$(document).ready(function() {
	var gameCanvas = $("#gameCanvas")[0];
	var drawCtx = gameCanvas.getContext("2d");
	// HTML <img src='images/terrain.png'/>
	var imageCache = new ImageCache();
	var sprite = null;
	var gameClock = new GameClock();
	imageCache.ready(function() {
		var pattern = drawCtx.createPattern(imageCache.get('images/terrain.png'),"repeat");
		drawCtx.fillStyle = pattern;
		drawCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
		sprite = new AutoSprite(-1.66,'horizontal',imageCache.get('images/sprites.png'),78,0,80,39,10,[0,1,2,3,2,1],'horizontal');
		sprite.setPosition(300,500);
		gameClock.registerStep(function(framesElapsed) {
			testSprite(framesElapsed);
		});
		
		gameClock.start();
	});
	imageCache.load(['images/terrain.png','images/gunship.png', 'images/sprites.png']);
	
	function testSprite(framesElapsed) {
		sprite.update(framesElapsed);
		drawCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
		sprite.render(drawCtx);
	}
	
	
	// More info on this drawing context here:
	// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
});