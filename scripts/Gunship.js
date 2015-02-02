$(document).ready(function() {
	var gameCanvas = $("#gameCanvas")[0];
	var scoreDiv = $("#scoreDiv")[0];
	var imageCache = new ImageCache();

	var gameEngine;
	imageCache.ready(function() {
		var score = 0;
		gameEngine = new GameEngine(gameCanvas, imageCache);
		gameEngine.addScoreListener(function(scoreEvent) {
			score += scoreEvent.score;
			scoreDiv.innerHTML = score;
		});
		gameEngine.addPlayerDestroyedListener(function() {
			$("#gameOver").fadeIn(500);
		});
		gameEngine.init();
	});
	imageCache.load(['images/terrain.png','images/gunship.png', 'images/sprites.png']);
});