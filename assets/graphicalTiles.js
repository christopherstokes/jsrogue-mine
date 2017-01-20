Game.TileSet = function(properties) {
    properties = properties || {};
    this._src = properties['source'] || null;
    this._bg = properties['bg'] || 'transparent';
    this._tileWidth = properties['tileWidth'] || 8;
    this._tileHeight = properties['tileHeight'] || 8;
    this._tileSet = properties['tileSet'] || null;
    this._tileMap = properties['tileMap'] || {};
};

Game.TileSet.prototype.getSrc = function() {
    return this._src;
};

Game.TileSet.prototype.getBg = function() {
    return this._bg;
};

Game.TileSet.prototype.getTileWidth = function() {
    return this._tileWidth;
};

Game.TileSet.prototype.getTileHeight = function() {
    return this._tileHeight;
};

Game.TileSet.prototype.getTileSet = function() {
    return this._tileSet;
};

Game.TileSet.prototype.getTileMap = function() {
    return this._tileMap;
};

Game.TileSet.prototype.setSrc = function(src) {
    this._src = src;
};

Game.TileSet.prototype.setBg = function(bg) {
    this._bg = bg;
};

Game.TileSet.prototype.setTileWidth = function(width) {
    this._tileWidth = width;
};

Game.TileSet.prototype.setTileHeight = function(height) {
    this._tileHeight = height;
};

Game.TileSet.prototype.setTileSet = function(tileSet) {
    this._tileSet = tileSet;
};

Game.TileSet.prototype.setTileMap = function(tileMap) {
    this._tileMap = tileMap;
};

// ROT.Display arguments needed
// layout: "tile"
// tileWidth: 16,
// tileHeight: 16,
// tileSet: tileSet,
// tileMap: {
//     '@': [0, 0],
//     '#': [160, 32],
//     '.': [128, 32],
//     'w': [16, 16],
//     'k': [0, 16],
//     ':': [32, 16],
//     '<': [192, 16],
//     '>': [176, 16],
//     '%': [64, 48],
//     'X': [48, 48]
// }
