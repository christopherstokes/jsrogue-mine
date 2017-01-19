Game.Tile = function (properties) {
    properties = properties || {};

    // call Glyph constructor
    Game.Glyph.call(this, properties);

    // set up the properties, false by default
    this._isWalkable = properties['isWalkable'] || false;
    this._isDiggable = properties['isDiggable'] || false;
    this._blocksLight = (properties['blocksLight'] !== undefined) ? properties['blocksLight'] : true;
};

Game.Tile.extend(Game.Glyph);

Game.Tile.prototype.isWalkable = function () {
    return this._isWalkable;
};

Game.Tile.prototype.isDiggable = function () {
    return this._isDiggable;
};

Game.Tile.prototype.isBlockingLight = function () {
    return this._blocksLight;
};

Game.Tile.nullTile = new Game.Tile();

Game.Tile.floorTile = new Game.Tile({
    character: '.',
    isWalkable: true,
    blocksLight: false
});

Game.Tile.wallTile = new Game.Tile({
    character: '#',
    foreground: 'goldenrod',
    isDiggable: true
});

Game.Tile.stairsUpTile = new Game.Tile({
    character: '<',
    foreground: 'white',
    isWalkable: true,
    blocksLight: false
});

Game.Tile.stairsDownTile = new Game.Tile({
    character: '>',
    foreground: 'white',
    isWalkable: true,
    blocksLight: false
});

// helper functions
Game.getNeighborPositions = function (x, y) {
    var tiles = [];

    // generate all possible offsets
    for (var dX = -1; dX < 2; dX++) {
        for (var dY = -1; dY < 2; dY++) {
            // make sure it isn't same tile
            if (dX == 0 && dY == 0) {
                continue;
            }
            tiles.push({x: x + dX, y: y + dY});
        }
    }
    return tiles.randomize();
};
