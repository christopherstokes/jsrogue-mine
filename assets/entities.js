// create our Mixins namespace
Game.Mixins = {};

// General Mixins for various actions
// Destructible mixin
Game.Mixins.Destructible = {
    name: 'Destructible',
    init: function (template) {
        this._maxHp = template['maxHp'] || 10;

        // we allow takingin health from the template
        // in case we want to start with different HP
        // than the max specifies

        this._hp = template['hp'] || this._maxHp;

        this._defenseValue = template['defenseValue'] || 0;
    },
    getHp: function () {
        return this._hp;
    },
    getMaxHp: function () {
        return this._maxHp;
    },
    getDefenseValue: function () {
        return this._defenseValue;
    },
    takeDamage: function (attacker, damage) {
        this._hp -= damage;

        // remove entity when reaching 0 or less hp
        if (this._hp <= 0) {
            Game.sendMessage(attacker, 'You kill the %s!', [this.getName()]);

            // check if player died, if so call their act method
            if (this.hasMixin(Game.Mixins.PlayerActor)) {
                this.act();
            } else {
                this.getMap().removeEntity(this);
            }
        }
    }
};

// Attacker mixin
Game.Mixins.Attacker = {
    name: 'Attacker',
    groupName: 'Attacker',

    init: function (template) {
        this._attackValue = template['attackValue'] || 1;
    },

    getAttackValue: function () {
        return this._attackValue;
    },

    attack: function (target) {
        // only remove entity if attackable
        if (target.hasMixin('Destructible')) {
            var attack = this.getAttackValue();
            var defense = this.getDefenseValue();
            var max = Math.max(0, attack - defense);
            var damage = 1 + Math.floor(Math.random() * max);

            Game.sendMessage(this, 'You strike the %s for %d damage!',
                             [target.getName(), damage]);
            Game.sendMessage(target, 'The %s strikes you for %d damage!',
                             [this.getName(), damage]);

            target.takeDamage(this, damage);
        }
    }
};

// signifies our entity possesa fieldof visionof given radius
Game.Mixins.Sight = {
    name: 'Sight',
    groupName: 'Sight',

    init: function (template) {
        this._sightRadius = template['sightRadius'] || 5;
    },

    getSightRadius: function () {
        return this._sightRadius;
    }
};

// Messaging
Game.Mixins.MessageRecipient = {
    name: 'MessageRecipient',
    init: function (template) {
        this._messages = [];
    },

    receiveMessage: function (message) {
        this._messages.push(message);
    },

    getMessages: function () {
        return this._messages;
    },

    clearMessages: function () {
        this._messages = [];
    }
};

Game.sendMessage = function (recipient, message, args) {
    // makesure recipient can receive message
    if (recipient.hasMixin(Game.Mixins.MessageRecipient)) {
        // if args passed, format message, else no format
        if (args) {
            message = vsprintf(message, args);
        }
        recipient.receiveMessage(message);
    }
};

Game.sendMessageNearby = function (map, centerX, centerY, centerZ, message, args) {
    // if args were passed, format message else no format
    if (args) {
        message = vsprint(message, args);
    }
    // get nearby entities
    entities = map.getEntitiesWithinRadius(centerX, centerY, centerZ, 5);

    // iterate through nearby entities sending message if possible
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].hasMixin(Game.Mixins.MessageRecipient)) {
            entities[i].receiveMessage(message);
        }
    }
};

// Actors

Game.Mixins.PlayerActor = {
    name: 'PlayerActor',
    groupName: 'Actor',

    act: function () {
        // detect if the game is over
        if (this.getHp() < 1) {
            Game.Screen.playScreen.setGameEnded(true);

            // send last message to the player
            Game.sendMessage(this, 'You have died... Press [Enter] to continue!');
        }

        // re-render the screen
        Game.refresh();

        // lock engine and wait for player
        // to press key
        this.getMap().getEngine().lock();

        // clear message queue
        this.clearMessages();
    }
};

Game.Mixins.FungusActor = {
    name: 'FungusActor',
    groupName: 'Actor',

    init: function () {
        this._growthsRemaining = 5;
    },

    act: function () {
        // check if growths remain
        if (this._growthsRemaining > 0) {
            if (Math.random () <= 0.02) {
                // generate coordinate for random adjacent
                // square -- generate number 0 to 2 and subtract
                // 1 to find offsets for direction
                var xOffset = Math.floor(Math.random() * 3) - 1;
                var yOffset = Math.floor(Math.random() * 3) - 1;

                // make sure not spawning on same tile
                if (xOffset !=0 || yOffset !=0) {
                    // check if location is available
                    if (this.getMap().isEmptyFloor(this.getX() + xOffset,
                                                   this.getY() + yOffset,
                                                   this.getZ())) {
                        var entity = new Game.Entity(Game.FungusTemplate);
                        entity.setPosition(this.getX() + xOffset,
                                           this.getY() + yOffset,
                                           this.getZ());
                        this.getMap().addEntity(entity);
                        this._growthsRemaining--;

                        // send message nearby
                        Game.sendMessageNearby(this.getMap(),
                                               entity.getX(), entity.getY(),
                                               entity.getZ(),
                                               'The fungus is spreading!');
                    }
                }
            }
        }
    }
};

// An entity that simply wanders around.
Game.Mixins.WanderActor = {
    name: 'WanderActor',
    groupName: 'Actor',
    act: function() {
        // Flip coin to determine if moving by 1 in the positive or negative direction
        var moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1;
        // Flip coin to determine if moving in x direction or y direction
        if (Math.round(Math.random()) === 1) {
            this.tryMove(this.getX() + moveOffset, this.getY(), this.getZ());
        } else {
            this.tryMove(this.getX(), this.getY() + moveOffset, this.getZ());
        }
    }
};

// hit counter mixin
Game.Mixins.HitCounter = {
    name: 'HitCounter',

    init: function (properties) {
        // add state to entity and read props
        this._multiplier = properties['multiplier'] || 1;
        this._hits = 0;
    },

    incrementHit: function () {
        // update state
        this._hits += this._multiplier;
    },

    getTotalHits: function () {
        return this._hits;
    }
};

// Templates

// Player template
Game.PlayerTemplate = {
    character: '@',
    foreground: 'white',
    maxHp: 40,
    attackValue: 10,
    sightRadius: 6,
    mixins: [Game.Mixins.PlayerActor,
             Game.Mixins.Attacker, Game.Mixins.Destructible,
             Game.Mixins.Sight, Game.Mixins.MessageRecipient]
};

// Fungus template
Game.FungusTemplate = {
    name: 'fungus',
    character: 'T',
    foreground: 'green',
    maxHp: 10,
    mixins: [Game.Mixins.FungusActor, Game.Mixins.Destructible]
};

// bat
Game.BatTemplate = {
    name: 'bat',
    character: 'w',
    foreground: 'grey',
    maxHp: 5,
    attackValue: 4,
    mixins: [Game.Mixins.WanderActor, Game.Mixins.Attacker,
             Game.Mixins.Destructible]
};

// newt
Game.NewtTemplate = {
    name: 'newt',
    character: ':',
    foreground: 'yellow',
    maxHp: 3,
    attackValue: 2,
    mixins: [Game.Mixins.WanderActor, Game.Mixins.Attacker,
             Game.Mixins.Destructible]
};
