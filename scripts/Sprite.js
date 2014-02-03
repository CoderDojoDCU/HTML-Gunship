// This is our sprite class
// Parameters:
//	spriteMap - a reference to the image containing our sprite map
//	top, left - position where our sprite starts in the image map
//	width, height - the size of an individual frame of our sprite
//  fr - the frame rate for switching between frames of our sprite
//	frames - an array specifying the order in which to render frames
//  frameDir - the direction in which sprite frames are laid out
//	doOnce - render the sprite frameset once and then we're done
function Sprite(spriteMap, top, left, width, height, fr, frames, frameDir, doOnce ) {
	// These variables store the definition of our sprite.
	var theSpriteMap = spriteMap;
	var srcPos = { left: left, top: top };
	var size = { w: width, h: height };
	var frameRate = fr;
	var frameSet = frames;
	var dir = frameDir;
	var once = doOnce;
	
	// These variables store the internal state of our sprite.
	var frameIdx = 0;	// Index into the frameSet pointing to the current frame to render.
	var curSpritePos = { top :0, left: 0};
	var clockFrame = 0;
	var frameDivisor = frameRate > 0 ? 60/frameRate : 0;
	// if (frameRate > 0 ) {
	//	frameDivisor = frameRate/60
	// } else {
	//	frameDivisor = 0;
	// }
	


	this.update = function(framesElapsed) {
	};
	
	this.render = function(drawCtx) {
	};
	
	this.setPosition = function(top, left) {
	};
	
	this.getPosition = function() {
	};
	
	this.getSize = function() {
	};
	
	this.isDone = function() {
	};
}