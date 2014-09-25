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
	var dir = frameDir || 'horizontal';	// Default to 'horizontal' if not provided
	var once = doOnce || false; // Default to false if not provided
	
	// These variables store the internal state of our sprite.
	var frameIdx = 0;	// Index into the frameSet pointing to the current frame to render.
	var clockFrame = 0;
	var frameDivisor = frameRate > 0 ? 60/frameRate : 0;
	// if (frameRate > 0 ) {
	//	frameDivisor = frameRate/60
	// } else {
	//	frameDivisor = 0;
	// }
	
	// We need somewhere to store the current position of our sprite
	var curSpritePos = { top: 0, left: 0};
	
	// Store something to indicate that this sprite is finished
	var done = false;
	

	this.update = function(framesElapsed) {
		if ( frameDivisor > 0 ) {
			// clockFrame = clockFrame + framesElapsed;
			clockFrame += framesElapsed;
			// Calculate out how many frames we have moved since this sprite was created.
			var moveFrames = Math.floor(clockFrame/frameDivisor);
			// 0, 1 ,2 ,3, 2, 1,
			// We use the mod operator (%) to calculate the
			// remainder when moveFrames is divided by the number
			// of steps in our frameset. This will give us a value
			// that cycles from 0 to frameSet.length-1 repeatedly
			// as moveFrames increases.
			frameIdx = moveFrames % frameSet.length;
			// For single animations we're finished when the number
			// of frames we've moved exceeds the number of frames
			// in our frameSet.
			done = once && moveFrames > frameSet.length;
		}
	};
	
	this.render = function(drawCtx) {
		// We check here to see if the sprite is still visible before we 
		// go to the trouble of rendering it.
		// The below statement is equivaluent to
		// done = done || (curSpritePos.left ... );
		done |= curSpritePos.left < -size.w || 
				curSpritePos.left > drawCtx.canvas.width ||
				curSpritePos.top < -size.h ||
				curSpritePos.top > drawCtx.canvas.height;
		// If we're done we don't need to do anything
		if ( !done ) {
			// Get the frameNo from the frameSet array
			var frameNo = frameSet[frameIdx];
			var left = srcPos.left,
				top = srcPos.top;
			// Now calculate the offset to the start of the image
			// we want in our sprite map.
			if (dir == 'horizontal' ) {
				left += frameNo * size.w;
			} else {
				top += frameNo * size.h;
			}
			// Here we draw the image using the calculated left and top to find the location
			// of the image in the sprite map and curSpritePos to specify the position that 
			// we're going to draw frame on the canvas.
			drawCtx.drawImage(theSpriteMap, left, top, size.w,
				size.h, curSpritePos.left, curSpritePos.top,
				size.w, size.h);
		}
	};
	
	this.setPosition = function(top, left) {
		curSpritePos.top = top;
		curSpritePos.left = left;
	};
	
	this.getPosition = function() {
		// Rather than give away a reference to our sprites internal state
		// we create a JSON object and copy the current position into it.
		// This way we ensure that the only way to change the position
		// of our sprite is by calling the setPosition function.
		return { top: curSpritePos.top, left: curSpritePos.left };
	};
	
	this.getSize = function() {
		return { w: size.w, h: size.h};
	};
	
	this.isDone = function() {
		return done;
	};
}