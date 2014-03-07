/**
 * This class sub-classes our existing sprite class. It adds the capability for the sprite to automatically move on the canvas
 */
function AutoSprite(pixelsPerFrame, spriteDirection, spriteMap, left, top, w, h, fr, frames, frameDir, doOnce) {
    Sprite.call(this,spriteMap,left,top,w,h,fr,frames,frameDir,doOnce);

    // The sign of pixelsPerFrame affects the direction e.g. horizontal direction with a positive pixelsPerFrame
    // means that the sprite is moving from left to right, while a negative value moves it from right to left.
    // Similarly for vertical direction, a negative value moves the sprite up and a positive value moves the sprite down.
    var pxPerFrame = pixelsPerFrame || 3;       // Number of pixels to move the sprite each frame
    var moveDirection = spriteDirection || "horizontal";    // Is sprite moving horizontally or vertically.

    // Now we want to replace the update method to move the sprite automatically each time update is called.
    // So we take a copy of the sprite class update method, do our own processing and then delegate to it.
    var spriteUpdate = this.update;

    this.update = function(framesElapsed) {
        var curPos = this.getPosition();
        // Now we calculate the new position of the sprite
        // If we're moving horizontally, then we will modify the left position and if moving vertically we'll
        // modify the top position
        if ( moveDirection === "horizontal") {
            curPos.left += pxPerFrame*framesElapsed;
        } else {
            curPos.top += pxPerFrame*framesElapsed;
        }

        this.setPosition(curPos.top, curPos.left);
        spriteUpdate(framesElapsed);
    }
}
