function GameEngine(gameCanvas, imageCache) {
	// Store the parameters passed in here in case we need them later.
	var theCanvas = gameCanvas;
	var theImages = imageCache;
	
	var canvasHeight = theCanvas.clientHeight,
		canvasWidth  = theCanvas.clientWidth;
		
	var MOVE_PIXELS = 3;
	// Get the drawing context that we're going to use to draw on our game surface.
	var drawCtx = theCanvas.getContext("2d");
	
	// The game will need a game clock - so create it here.
	var gameClock = new GameClock();
	
	var playerSprite = createPlayerSprite();
	// Interrogate the playersprite to find out it's width and height.
	var playerWidth = playerSprite.getSize().w;
	var playerHeight = playerSprite.getSize().h;
	
	// We're going to have a lot of enemy sprites so array
	var enemies = [];
	
	// We only need to create the pattern once so do it when we initialise the game engine.
	var pattern = drawCtx.createPattern(imageCache.get('images/terrain.png'),"repeat");
	// The fill style isn't going to change throughout our game.
	drawCtx.fillStyle = pattern;
	
	var keyStatusMap = {};
	
	function setKeyStatus(keyEvent, status) {
		switch( keyEvent.keyCode ) {
			case 32:  // Space key
				keyStatusMap["SPACE"] = status;
				break;
			case 37:  // Left key
				keyStatusMap["LEFT"] = status;
				break;
			case 38: // Up key
				keyStatusMap["UP"] = status;
				break;
			case 39: // Right key
				keyStatusMap["RIGHT"] = status;
				break;
			case 40: // DOWN key
				keyStatusMap["DOWN"] = status;
				break;
		}
	}
	
	this.init = function() {
		$(document).keydown(function(keyEvent) {
			setKeyStatus(keyEvent,true);
		});
		
		$(document).keyup(function(keyEvent) {
			setKeyStatus(keyEvent,false);
		});
	
		enemies.push(createEnemySprite());
		gameClock.registerStep(function(framesElapsed,curFrameNo) {
			checkPlayerActions(framesElapsed);
			drawCtx.fillRect(0,0,theCanvas.width, theCanvas.height);
			playerSprite.update(framesElapsed);
			playerSprite.render(drawCtx);
			var ix = 0;
			// Turn forEach statment below into code for the below loop so that we can 
			// remove completed sprites from the array as we process it.
			for(ix = 0; ix < enemies.length; ix++ ) {
				
			}
			enemies.forEach(function(s) {
				s.update(framesElapsed);
				s.render(drawCtx);
			});
		});
		gameClock.start();
	}
	
	function checkPlayerActions(framesElapsed) {
		var currentPlayerPos = playerSprite.getPosition();
		if ( keyStatusMap["LEFT"] ) {
			playerSprite.setPosition(currentPlayerPos.top,
				Math.max(0,
					currentPlayerPos.left-(MOVE_PIXELS*framesElapsed)));
		}
		if ( keyStatusMap["RIGHT"] ) {
			playerSprite.setPosition(currentPlayerPos.top,
				Math.min(
					canvasWidth-playerWidth,
					currentPlayerPos.left+(MOVE_PIXELS*framesElapsed)));
		}
		if ( keyStatusMap["UP"] ) {
			playerSprite.setPosition(
				Math.max(0,currentPlayerPos.top-(MOVE_PIXELS*framesElapsed)),
				currentPlayerPos.left);
		}
		if ( keyStatusMap["DOWN"] ) {
			playerSprite.setPosition(
				Math.min(canvasHeight-playerHeight,
					currentPlayerPos.top+(MOVE_PIXELS*framesElapsed)),
				currentPlayerPos.left);
		}
	}
	
	function createEnemySprite() {
		var s = new AutoSprite(-1.66,'horizontal',imageCache.get('images/sprites.png'),78,0,80,39,10,[0,1,2,3,2,1],'horizontal');
		var left = canvasWidth - 5;   // Left most part of sprite is 5px from RHS
		var top = Math.min(Math.random()*canvasHeight, 
								canvasHeight - s.getSize().h);
		s.setPosition(top,left);
		return s;
	}
	
	function createPlayerSprite() {
		var s = new Sprite(imageCache.get('images/sprites.png'),5,0,39,25,10,[0,1]);
		var top = Math.floor((canvasHeight - 39)/2);
		s.setPosition(top,0);
		return s;
	}
}