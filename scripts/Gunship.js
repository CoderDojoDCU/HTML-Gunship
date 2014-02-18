$(document).ready(function() {
	var gameCanvas = $("#gameCanvas")[0];
	var drawCtx = gameCanvas.getContext("2d");
	// HTML <img src='images/terrain.png'/>
	var imageCache = new ImageCache();
	var sprite = null;
	imageCache.ready(function() {
		var pattern = drawCtx.createPattern(imageCache.get('images/terrain.png'),"repeat");
		drawCtx.fillStyle = pattern;
		drawCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
//		drawCtx.drawImage(imageCache.get('images/gunship.png'),0,0,39,39,0,0,39,39);
		sprite = new Sprite(imageCache.get('images/sprites.png'),78,0,80,39,10,[0,1,2,3,2,1],'horizontal');
		sprite.setPosition(0,0);
		testSprite();
	});
	imageCache.load(['images/terrain.png','images/gunship.png', 'images/sprites.png']);
	
	function testSprite() {
		sprite.update(5);
		drawCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
		sprite.render(drawCtx);
		setTimeout(testSprite,100);
	}
	
	
	// More info on this drawing context here:
	// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
});