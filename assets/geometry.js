Game.Geometry = {
    getLine: function(startX, startY, endX, endY) {
        var points = [];
        var dX = Math.abs(endX - startX);
        var dY = Math.abs(endY - startY);
        var sX = (startX < endX) ? 1 : -1;
        var sY = (startY < endY) ? 1 : -1;
        var err = dX - dY;
        var e2;

        while (true) {
            points.push({x: startX, y: startY});
            if (startX == endX && startY == endY) {
                break;
            }
            e2 = err * 2;
            if (e2 > -dX) {
                err -= dY;
                startX += sX;
            }
            if (e2 < dX) {
                err += dX;
                startX += sY;
            }
        }

        return points;
    }
}
