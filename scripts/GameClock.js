function GameClock() {
	var stepFunctions = [];
	var lastTickTime = 0;
	// The number of millisecomds between frames doesn't
	// change. So if we're going to have 60 frames per 
	// second, we can calculate the number of milliseconds
	// that will elapse between frames.
	var millsecsPerFrame = 1000/60;
	// We use this to keep track of the current frame number
	var currentFrameNo = 0;
	var animationId = 0;	// Returned by RequestAnimationFrame
	
	this.start = function() {
		animationId = requestAnimationFrame(clockTick);
	};
	
	this.registerStep = function(stepFunction) {
		stepFunctions.push(stepFunction);
	};
	
	function clockTick(timestamp) {
		// If timestamp isn't passed to this function, then
		// we calculate the current time using the built-in
		// Date class.
		timestamp = timestamp || Date.now();
		// Calculate the number of milli-seconds that have
		// elapsed since we were last called.
		var elapsed = timestamp - lastTickTime;
		var framesSinceLastTick = Math.floor(elapsed/millsecsPerFrame);
		currentFrameNo += framesSinceLastTick;
		if ( framesSinceLastTick > 0 ) {
			stepFunctions.forEach(function(fn) { 
				fn(framesSinceLastTick, currentFrameNo);
			});
			lastTickTime = timestamp;
		}
		// Finally we schedule this function to be called
		// on the next clock tick.
		animationId = requestAnimationFrame(clockTick);
	}
	
	// We want to define a function called requestAnimationFrame,
	// however it may be implemented differently across 
	// different browsers. So we use this trick to find an
	// implementation and make them all look the same.
	var requestAnimationFrame = 
			window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( animationCallback ) { window.setTimeout(animationCallback, millsecsPerFrame);};
}