Game.Screen = {};

// Define our initial start screen
Game.Screen.startScreen = {
    enter: function () { console.log('Entered start screen.'); },
    exit: function () { console.log('Exited start screen.'); },

    render: function (display) {
        // render our prompt to the screen
        display.drawText(1,1, "%c{yellow}Javascript Roguelike");
        display.drawText(1,2, "Press [Enter] to start!");
    },

    handleInput: function (inputType, inputData) {
        // when [enter] is pressed, go to play screen
        if (inputType === 'keydown') {
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.playScreen);
            }
        }
    }
};

// define playing screen
Game.Screen.playScreen = {
    _map: null,
    _player: null,
    _gameEnded: false,

    enter: function () {
        console.log('Entered play screen.');

        // create a map based on our size parameters
        var width = 100;
        var height = 48;
        var depth = 6;

        // create map from the tiles and player
        var tiles = new Game.Builder(width, height, depth).getTiles();
        this._player = new Game.Entity(Game.PlayerTemplate);
        this._map = new Game.Map(tiles, this._player);

        // start the map's engine
        this._map.getEngine().start();
    },
    exit: function () { console.log('Exited play screen.'); },

    render: function (display) {
        var screenWidth = Game.getScreenWidth();
        var screenHeight = Game.getScreenHeight();

        // make sure x-axis doesn't go left of bound
        var topLeftX = Math.max(0, this._player.getX()- (screenWidth / 2));

        // make sure we have enoughspace to fit entire game screen
        topLeftX = Math.min(topLeftX, this._map.getWidth() - screenWidth);

        // make sure y-axis doesn't go above
        var topLeftY = Math.max(0, this._player.getY() - (screenHeight / 2));

        // make sure enough space
        topLeftY = Math.min(topLeftY, this._map.getHeight() - screenHeight);

        // this object will keep track of all visible map cells
        var visibleCells = {};

        // store this._map and player's z to prevent losing it in callback
        var map = this._map;
        var currentDepth = this._player.getZ();

        // find all visible cells and update object
        this._map.getFov(this._player.getZ()).compute(
            this._player.getX(), this._player.getY(),
            this._player.getSightRadius(),
            function (x, y, radius, visibility) {
                visibleCells[x + ',' + y] = true;
                // mark cell explored
                map.setExplored(x, y, currentDepth, true);
            });
        // iterate through all visible map cells
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                if (visibleCells[x + ',' + y]) {
                    // fetch glyph for the tile and render it to
                    // the screen
                    var tile = this._map.getTile(x, y, this._player.getZ());
                    display.draw(x - topLeftX,
                                 y - topLeftY,
                                 tile.getChar(),
                                 tile.getForeground(),
                                 tile.getBackground());
                }
            }
        }

        // render the explored map cells
        for (var x = topLeftX; x < topLeftX + screenWidth; x++) {
            for (var y = topLeftY; y < topLeftY + screenHeight; y++) {
                if (map.isExplored(x, y, currentDepth)) {
                    // fetch glyph for tile and render it to the screen
                    // at offset position
                    var tile = this._map.getTile(x, y, currentDepth);

                    // the foreground color becomes dark gray if has been
                    // explored but is not visible
                    var foreground = visibleCells[x + ',' + y] ?
                            tile.getForeground() : 'darkGray';
                    display.draw(
                        x - topLeftX,
                        y - topLeftY,
                        tile.getChar(),
                        foreground,
                        tile.getBackground());
                }
            }
        }

        // render the entities
        var entities = this._map.getEntities();
        for (var key in entities) {
            var entity = entities[key];

            // only render entity if they show on screen
            if (entity.getX() >= topLeftX && entity.getY() >= topLeftY &&
                entity.getX() < topLeftX + screenWidth &&
                entity.getY() < topLeftY + screenHeight &&
                entity.getZ() == this._player.getZ()) {
                if (visibleCells[entity.getX() + ',' + entity.getY()]) {
                    display.draw(
                        entity.getX() - topLeftX,
                        entity.getY() - topLeftY,
                        entity.getChar(),
                        entity.getForeground(),
                        entity.getBackground()
                    );
                }
            }
        }

        // get the messages in the player's queue and render
        var messages = this._player.getMessages();
        var messageY = 0;
        for (var i = 0; i < messages.length; i++) {
            // draw each message, adding num of lines
            messageY += display.drawText(
                0,
                messageY,
                '%c{white}%b{black}' + messages[i]
            );
        }

        // render player hp
        var stats = '%c{white}%b{black}';
        stats += vsprintf('HP: %d/%d ', [this._player.getHp(), this._player.getMaxHp()]);
        display.drawText(0, screenHeight, stats);
    },

    handleInput: function (inputType, inputData) {
        // if game is over, enter will bring the user to losing screen
        if (this._gameEnded) {
            if (inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.loseScreen);
            }

            // return to make sure the user can't still play
            return;
        }
        if (inputType === 'keydown') {
            // if [enter] is pressed, go to win screen
            // if [esc] is pressed, go to lose screen
            if (inputData.keyCode === ROT.VK_RETURN) {
                Game.switchScreen(Game.Screen.winScreen);
            } else if (inputData.keyCode === ROT.VK_ESCAPE) {
                Game.switchScreen(Game.Screen.loseScreen);
            }

            // movement
            if (inputData.keyCode === ROT.VK_H || inputData.keyCode === ROT.VK_LEFT) {
                this.move(-1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_L || inputData.keyCode === ROT.VK_RIGHT) {
                this.move(1, 0, 0);
            } else if (inputData.keyCode === ROT.VK_K || inputData.keyCode === ROT.VK_UP) {
                this.move(0, -1, 0);
            } else if (inputData.keyCode === ROT.VK_J || inputData.keyCode === ROT.VK_DOWN) {
                this.move(0, 1, 0);
            }

            // unlock the engine
            this._map.getEngine().unlock();
        } else if (inputType === 'keypress') {
            var keyChar = String.fromCharCode(inputData.charCode);
            if (keyChar === '>') {
                this.move(0, 0, 1);
            } else if (keyChar === '<') {
                this.move(0, 0, -1);
            } else {
                // not a valid key
                return;
            }
            // unlock engine
            this._map.getEngine().unlock();
        }
    },

    move: function (dX, dY, dZ) {
        // positive dX means right neg left
        var newX = this._player.getX() + dX;
        var newY = this._player.getY() + dY;
        var newZ = this._player.getZ() + dZ;

        // try to move
        this._player.tryMove(newX, newY, newZ, this._map);
    },

    setGameEnded: function (gameEnded) {
        this._gameEnded = gameEnded;
    }
};

// define winning screen
Game.Screen.winScreen = {
    enter: function() { console.log("Entered win screen."); },
    exit: function() { console.log("Exited win screen."); },

    render: function(display) {
        // render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            // generate random background colors
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            var background = ROT.Color.toRGB([r, g, b]);
            display.drawText(2, i + 1, "%b{" + background + "}You win!");
        }
    },

    handleInput: function(inputType, inputData) {
        // Nothing to do here
    }
};

// define losing screen
Game.Screen.loseScreen = {
    enter: function() { console.log("Entered lose screen."); },
    exit: function() { console.log("Exited lose screen."); },
    render: function(display) {
        // render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            display.drawText(2, i + 1, "%b{red}You lose! :(");
        }
    },
    handleInput: function(inputType, inputData) {
        // Nothing to do here
    }
};
