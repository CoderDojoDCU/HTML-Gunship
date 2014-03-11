function GameEngine(gameCanvas, imageCache) {
	// Store the parameters passed in here in case we need them later.
	var theCanvas = gameCanvas;
	var theImages = imageCache;
	
	// Get the drawing context that we're going to use to draw on our game surface.
	var drawCtx = theCanvas.getContext("2d");
	
	// The game will need a game clock - so create it here.
	var gameClock = new GameClock();
	
	var sprite = null;
	
	// We only need to create the pattern once so do it when we initialise the game engine.
	var pattern = drawCtx.createPattern(imageCache.get('images/terrain.png'),"repeat");
	// The fill style isn't going to change throughout our game.
	drawCtx.fillStyle = pattern;
	
	this.init = function() {
		sprite = createEnemySprite();
		sprite.setPosition(300,500);
		gameClock.registerStep(function(framesElapsed,curFrameNo) {
			drawCtx.fillRect(0,0,theCanvas.width, theCanvas.height);
			sprite.update(framesElapsed);
			sprite.render(drawCtx);
		});
		gameClock.start();
	}
	
	function createEnemySprite() {
		var s = new AutoSprite(-1.66,'horizontal',imageCache.get('images/sprites.png'),78,0,80,39,10,[0,1,2,3,2,1],'horizontal');
		return s;
	}
}