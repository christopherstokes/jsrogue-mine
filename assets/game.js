var Game = {
	_display: null,
	_currentScreen: null,
	_screenWidth: 48,
	_screenHeight: 24,
	init: function() {
		var tileSet = document.createElement("img");
		tileSet.src = "tiles.png";

		var tileMap = {
			"@": [0, 0],
			"#": [128, 64],
			".": [112, 64],
			"a": [48, 48],
			"p": [64, 48],
			"&": [0, 16],
			"n": [32, 16],
			"f": [80, 48],
			"b": [16, 16],
			"$": [16, 32],
			"%": [32, 48],
			"z": [0, 32],
			"*": [144, 48],
			"[": [0, 64],
			"<": [96, 64],
			">": [80, 64],
			"A": [0, 80],
			"B": [16, 80],
			"C": [32, 80],
			"D": [48, 80],
			"E": [64, 80],
			"F": [80, 80],
			"G": [96, 80],
			"H": [112, 80],
			"I": [128, 80],
			"J": [144, 80],
			"K": [160, 80],
			"L": [0, 96],
			"M": [16, 96],
			"N": [32, 96],
			"O": [48, 96],
			"P": [64, 96],
			"Q": [80, 96],
			"R": [96, 96],
			"S": [112, 96],
			"T": [128, 96],
			"U": [144, 96],
			"V": [160, 96],
			"W": [0, 112],
			"X": [16, 112],
			"Y": [32, 112],
			"Z": [48, 112],
			"0": [64, 112],
			"1": [80, 112],
			"2": [96, 112],
			"3": [112, 112],
			"4": [128, 112],
			"5": [144, 112],
			"6": [160, 112],
			"7": [0, 128],
			"8": [16, 128],
			"9": [32, 128],
			":": [48, 128],
			"(": [64, 128],
			")": [80, 128],
			"/": [96, 128],
			",": [128, 128],
			"!": [144, 128],
			"?": [160, 128],
			"'": [0, 144],
			"-": [16, 144],
			";": [32, 144],
			"+": [48, 144],
			"~": [64, 144],
			" ": [80, 144]
		};
		// ".": [112, 128],
		// Any necessary initialization will go here.
		this._display = new ROT.Display({
			width: this._screenWidth,
			height: this._screenHeight + 1,
			layout: "tile",
			bg: "black",
			tileWidth: 16,
			tileHeight: 16,
			tileSet: tileSet,
			tileMap: tileMap
		});
		// Create a helper function for binding to an event
		// and making it send it to the screen
		var game = this; // So that we don't lose this
		var bindEventToScreen = function(event) {
			window.addEventListener(event, function(e) {
				// When an event is received, send it to the
				// screen if there is one
				if (game._currentScreen !== null) {
					// Send the event type and data to the screen
					game._currentScreen.handleInput(event, e);
				}
			});
		};
		// Bind keyboard input events
		bindEventToScreen('keydown');
		//bindEventToScreen('keyup');
		bindEventToScreen('keypress');
	},
	getDisplay: function() {
		return this._display;
	},
	getScreenWidth: function() {
		return this._screenWidth;
	},
	getScreenHeight: function() {
		return this._screenHeight;
	},
	refresh: function() {
		// Clear the screen
		this._display.clear();
		// Render the screen
		this._currentScreen.render(this._display);
	},
	switchScreen: function(screen) {
		// If we had a screen before, notify it that we exited
		if (this._currentScreen !== null) {
			this._currentScreen.exit();
		}
		// Clear the display
		this.getDisplay().clear();
		// Update our current screen, notify it we entered
		// and then render it
		this._currentScreen = screen;
		if (!this._currentScreen !== null) {
			this._currentScreen.enter();
			this.refresh();
		}
	}
};

window.onload = function() {
	// Check if rot.js can work on this browser
	if (!ROT.isSupported()) {
		alert("The rot.js library isn't supported by your browser.");
	} else {
		// Initialize the game
		Game.init();
		// Add the container to our HTML page
		document.body.appendChild(Game.getDisplay().getContainer());
		// Load the start screen
		Game.switchScreen(Game.Screen.startScreen);
	}
};
