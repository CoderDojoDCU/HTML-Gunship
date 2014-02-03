$(document).ready(function() {
	var gameCanvas = $("#gameCanvas")[0];
	var drawCtx = gameCanvas.getContext("2d");
	// HTML <img src='images/terrain.png'/>
	var imageCache = new ImageCache();
	imageCache.ready(function() {
		var pattern = drawCtx.createPattern(imageCache.get('images/terrain.png'),"repeat");
		drawCtx.fillStyle = pattern;
		drawCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
		drawCtx.drawImage(imageCache.get('images/gunship.png'),0,0,39,39,0,0,39,39);
		});
	imageCache.load(['images/terrain.png','images/gunship.png']);
	
	// More info on this drawing context here:
	// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
});