var Game = {
    _display: null,
    _currentScreen: null,
    _screenWidth: 80,
    _screenHeight: 24,

    init: function () {
        this._display = new ROT.Display({width: this._screenWidth,
                                         height: this._screenHeight + 1});

        // create helper function for binding an event
        // and making it send to the screen
        var game = this; // so we don't lose this
        var bindEventToScreen = function (event) {
            window.addEventListener(event, function(e) {
                // when an even is received, send it to screen
                // if there is one
                if (game._currentScreen !== null) {
                    // send the event type and data to the screen
                    game._currentScreen.handleInput(event, e);
                }
            });
        };

        // bind keyboard input events
        bindEventToScreen('keydown');
        // bindEventToScreen('keyup');
        bindEventToScreen('keypress');
    },

    refresh: function () {
        // clear the screen
        this._display.clear();
        // render the screen
        this._currentScreen.render(this._display);
    },

    getDisplay: function () {
        return this._display;
    },

    getScreenWidth: function () {
        return this._screenWidth;
    },

    getScreenHeight: function () {
        return this._screenHeight;
    },

    switchScreen: function (screen) {
        // if we had screen before, notify it that we exited
        if (this._currentScreen !== null) {
            this._currentScreen.exit();
        }

        // clear display
        this.getDisplay().clear();

        // update our current screen, notify when entered,
        // then render it
        this._currentScreen = screen;
        if (!this._currentScreen !== null) {
            this._currentScreen.enter();
            this.refresh();
        }
    }
};

window.onload = function () {
    if (!ROT.isSupported()) {
    } else {
        Game.init();

        document.body.appendChild(Game.getDisplay().getContainer());

        // load start screen
        Game.switchScreen(Game.Screen.startScreen);
    }
};
