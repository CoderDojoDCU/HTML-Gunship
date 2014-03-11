$(document).ready(function() {
	var gameCanvas = $("#gameCanvas")[0];
	var imageCache = new ImageCache();

	var gameEngine;
	imageCache.ready(function() {
		gameEngine = new GameEngine(gameCanvas, imageCache);
		gameEngine.init();
	});
	imageCache.load(['images/terrain.png','images/gunship.png', 'images/sprites.png']);
});