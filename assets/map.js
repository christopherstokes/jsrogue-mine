Game.Map = function (tiles, player) {
    this._tiles = tiles;

    // cache w and h based on length
    // of dimensions of tiles array
    this._depth = tiles.length;
    this._width = tiles[0].length;
    this._height = tiles[0][0].length;

    // setup field of view
    this._fov = [];
    this.setupFov();

    // create a list which hold entities
    this._entities = {};

    // create the engine and scheduler
    this._scheduler = new ROT.Scheduler.Simple();
    this._engine = new ROT.Engine(this._scheduler);

    // add the player
    this.addEntityAtRandomPosition(player, 0);

    // add random enemies to each floor
    var templates = [Game.FungusTemplate, Game.BatTemplate, Game.NewtTemplate];
    for (var z = 0; z < this._depth; z++) {
        for (var i = 0; i < 20; i++) {
            var template = templates[Math.floor(Math.random() * templates.length)];
            // place the entity
            this.addEntityAtRandomPosition(new Game.Entity(template), z);
        }
    }

    // setup the explored array
    this._explored = new Array(this._depth);
    this._setupExploredArray();
};

// getters
Game.Map.prototype.getWidth = function () {
    return this._width;
};

Game.Map.prototype.getHeight = function () {
    return this._height;
};

Game.Map.prototype.getDepth = function () {
    return this._depth;
};

Game.Map.prototype._setupExploredArray = function () {
    for (var z = 0; z < this._depth; z++) {
        this._explored[z] = new Array(this._width);
        for (var x = 0; x < this._width; x++) {
            this._explored[z][x] = new Array(this._height);
            for (var y = 0; y < this._height; y++) {
                this._explored[z][x][y] = false;
            }
        }
    }
};

Game.Map.prototype.setExplored = function (x, y, z, state) {
    // only update if tile is within bounds
    if (this.getTile(x, y, z) !== Game.Tile.nullTile) {
        this._explored[z][x][y] = state;
    }
};

Game.Map.prototype.isExplored = function (x, y, z) {
    // only return value if within bounds
    if (this.getTile(x, y, z) !== Game.Tile.nullTile) {
        return this._explored[z][x][y];
    } else {
        return false;
    }
};

// gets tile for given coordinate set
Game.Map.prototype.getTile = function (x, y, z) {
    // make sure we are in bounds, else return null tile
    if (x < 0 || x >= this._width || y < 0 || y >= this._height ||
        z < 0 || z >= this._depth) {
        return Game.Tile.nullTile;
    } else {
        return this._tiles[z][x][y] || Game.Tile.nullTile;
    }
};

Game.Map.prototype.getEngine = function () {
    return this._engine;
};

Game.Map.prototype.getEntities = function () {
    return this._entities;
};

Game.Map.prototype.getEntityAt = function (x, y, z) {
    // get entity based on position key
    return this._entities[x + ',' + y + ',' + z];
};

Game.Map.prototype.getEntitiesWithinRadius = function(centerX, centerY,
                                                      centerZ, radius) {
    var results = [];

    // determine bounds
    var leftX = centerX - radius;
    var rightX = centerX + radius;
    var topY = centerY - radius;
    var bottomY = centerY + radius;

    // iterate through our entities, adding any which are within bounds
    for (var key in this._entities) {
        var entity = this._entities[key];
        if (entity.getX() >= leftX && entity.getX() <= rightX &&
            entity.getY() >= topY && entity.getY() <= bottomY &&
            entity.getZ() == centerZ) {
            results.push(entity);
        }
    }
    return results;
};

Game.Map.prototype.addEntity = function (entity) {
    // update the entity's map
    entity.setMap(this);

    // add entity to list of entities
    this.updateEntityPosition(entity);

    // check if entity is actor, if so add to sched
    if (entity.hasMixin('Actor')) {
        this._scheduler.add(entity, true);
    }
};

Game.Map.prototype.addEntityAtRandomPosition = function (entity, z) {
    var position = this.getRandomFloorPosition(z);
    entity.setX(position.x);
    entity.setY(position.y);
    entity.setZ(position.z);
    this.addEntity(entity);
};

Game.Map.prototype.removeEntity = function (entity) {
    // remove entity from the map
    var key = entity.getX() + ',' + entity.getY() + ',' + entity.getZ();
    if (this._entities[key] == entity) {
        delete this._entities[key];
    }
    // if the entity is an anctor remove from sched
    if (entity.hasMixin('Actor')) {
        this._scheduler.remove(entity);
    }
};

Game.Map.prototype.updateEntityPosition = function(entity, oldX, oldY, oldZ) {
    // Delete the old key if it is the same entity and we have old positions.
    if (oldX) {
        var oldKey = oldX + ',' + oldY + ',' + oldZ;
        if (this._entities[oldKey] == entity) {
            delete this._entities[oldKey];
        }
    }
    // Make sure the entity's position is within bounds
    if (entity.getX() < 0 || entity.getX() >= this._width ||
        entity.getY() < 0 || entity.getY() >= this._height ||
        entity.getZ() < 0 || entity.getZ() >= this._depth) {
        throw new Error("Entity's position is out of bounds.");
    }
    // Sanity check to make sure there is no entity at the new position.
    var key = entity.getX() + ',' + entity.getY() + ',' + entity.getZ();
    if (this._entities[key]) {
        throw new Error('Tried to add an entity at an occupied position.');
    }
    // Add the entity to the table of entities
    this._entities[key] = entity;
};

Game.Map.prototype.isEmptyFloor = function(x, y, z) {
    // check if til is floor and has no entity
    return this.getTile(x, y, z) == Game.Tile.floorTile &&
        !this.getEntityAt(x, y, z);
};

Game.Map.prototype.dig = function (x, y, z) {
    // if tile is diggable, update it to a floor
    if (this.getTile(x, y, z).isDiggable()) {
        this._tiles[z][x][y] = Game.Tile.floorTile;
    }
};

Game.Map.prototype.getRandomFloorPosition = function (z) {
    // randomly enerate a tile which is a floor
    var x, y;
    do {
        x = Math.floor(Math.random() * this._width);
        y = Math.floor(Math.random() * this._height);
    } while (!this.isEmptyFloor(x, y, z));
    return {x: x, y: y, z: z};
};

Game.Map.prototype.setupFov = function () {
    // keep this in 'map' variable so that we don't lose it
    var map = this;

    // iterate each depth level setting fov
    for (var z = 0; z < this._depth; z++) {
        // we have to put following code in its ownscope to
        // prevent depth variable from being hoisted out of the loop
        (function () {
            // for each depth we need to create a callback which
            // figures out if light can pass through a given tile
            var depth = z;
            map._fov.push(
                new ROT.FOV.DiscreteShadowcasting(function (x, y) {
                    return !map.getTile(x, y, depth).isBlockingLight();
                }, {topoloy: 8}));
        })();
    }
};

Game.Map.prototype.getFov = function (depth) {
    return this._fov[depth];
}
