# Gunship

This project demonstrates several key features that are useful when writing applications in JavaScript:
- The use of sprites to create animated images
- The use of the HTML5 Canvas element
- Object oriented methods of building the game.
- Extensive use of JSON syntax.
- Some useful mathematical constructs for managing games

## The Game

The game we are building is a simple shooter game. We have a helicopter gunship that tries to stem the
tide of invading bugs. The Gunship has the advantage that it can shoot bullets in three directions simultaneously:
up, down, and forward. The gunship can move in all four directions.

There is a steady stream of bugs and they are added to the game faster as the game progresses.

We start off by deciding what the core objects of our game will be.

Then we start building the game with a blank HTML5 Canvas that we paint with the terrain.

### Week 1

First of all we identify some of the objects that we will need to build to complete this game.
The list we came up with was:
* The Gunship (this will be the player)
* Enemies - the swarm of bugs
* Bullets
* Explosions

One other less obvious object is that something needs to co-ordinate the activities of all of 
the objects. Some games call this the Game Artificial Intelligence. In our case we'll simply call 
it the Game Engine.

We created a simple HTML page with a single div containing a HTML canvas element.

``` html
<html>
	<head>
		<title>Helicopter Gunship</title>
		<link rel="stylesheet" type="text/css" href="css/gunship.css"/>
	</head>
	<body>
	    <div id="gameDiv">
		    <canvas id="gameCanvas"/>
	    </div>
	</body>
</html>
```
We then styled the page to position the div in the middle of the page with a size of 512px x 480px.
Hence the reference to css/gunship.css in the HTML file.

Then we created a javascript file, gunship.js, in which we included the startup code for our application
using a typical jQuery initialisation.

``` javascript
$(document).ready(function() {
});
```	
We then use this to get a reference to the canvas:

``` javascript
var gameCanvas = $("#gameCanvas")[0];
```

We use this to obtain a reference to the drawing object which will allow us to draw on this canvas.

``` javascript
var drawCtx = gameCanvas.getContext("2d");
```
	
We then use an image object to load the image we're going to use to draw the pattern for the terrain background.

``` javascript
var img = new Image();
img.src = "images/terrain.png";
```

Since the images load in the background we need to wait until the image is loaded before we can use this image
in our code. To do this we use the onload event of the image to tell us when the image is finished loading.

``` javascript
img.onload = function() {
	var pattern = drawCtx.createPattern(img,'repeat');
	drawCtx.fillStyle = pattern;
	drawCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
};
```

Finally we add the jQuery and gunship javascript files to the HTML file so that they will execute.

``` html
<head>
	<script src="scripts/jquery-1.10.2.min.js" type="text/javascript"></script>
	<script src="scripts/Gunship.js" type="text/javascript"></script>
</head>
```

OK! So we have painted our background for the game. However we're going to need to load other images for this game.
It's going to be tedious to have to set an onload function on every image we load and then find a way to string them all
together before we start our game.

How about we build our own solution to this problem. We can start by saying to ourselves "Wouldn't it be great if there
was a JavaScript class that we can use to load all of the images that we will need for our game at once and then notify
us when they're all loaded?"

Let's explore what we would expect of such a class.
* It should allow us to specify a list of images file to be loaded
* It should allow us to retrieve each of the images loaded by name
* It should notify us when all of the images are loaded.

So if we re-write our the image loading code in gunship.js as if this class existed it might look something like this.

``` javascript
// An object called ImageCache is going to load and store our images for us.
var imageCache = new ImageCache();
// When it has loaded all of the images it will call the function we provide here
imageCache.ready(function() {
	// imageCache.get will retrieve an image from the cache.
	var pattern = drawCtx.createPattern(imageCache.get('images/terrain.png'),"repeat");
	drawCtx.fillStyle = pattern;
	drawCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
	});
// It has a load method that allows us to specify an array of images to be loaded.
imageCache.load(['images/terrain.png']);
```

So from this we see that our ImageCache class needs to implement three methods:
* ```get(imageName)``` - Get an image from the image cache
* ```load(arrOfUrls)``` - load an array of images, each specified by it's url.
* ```ready(readyFunction)``` - provide a function to be called when all of the images have loaded.
	
So now we're going to create our ImageCache class.
First we create a file called ImageCache.js in the scripts directory (with the other javascript files).
Then we add the following script reference to the gunship.html file so that our new class is loaded into the project:

``` html
<script src="scripts/ImageCache.js" type="text/javascript"></script>
```
	
Now we start a new class in our ImageCache.js by putting in the following:

``` javascript
function ImageCache() {
}
```	

Now we create stubs for the three methods we need to implement:

``` javascript
this.get = function(imageName) {
};
	
this.load = function(arrOfUrls) {
};
	
this.ready = function(readyFunction) {
};
```
	
Let's implement these three methods starting with the get method:
For the get method to work we need to maintain a mapping of the image names to the actual
image objects. We can so this using a javascript object but by treating it like an array.
So we create a javascript object at the top of our ImageCache class using JSON notation like this:

``` javascript
var imageCache = {}; // Note the curly braces used for this declaraton - not to be confused with
					 // array notation which uses square brackets.
```

So now we can implement our get method as follows:

``` javascript
this.get = function(imageName) {
	return imageCache[imageName];
};
```

Next we implement our ready method. This method needs to store a reference to the function provided so that 
it can be called when all of the images are loaded. We use a javascript array to store an array of all of 
these ready functions. So we put the following declaration at the top of our ImageCache class:

``` javascript
var readyFunctions = [];		// Note square brackets used for an array.
```

Now each time the ready method is called we just store a reference to this function in the array. So
we can implement the ready function as follows:

``` javascript
this.ready = function(readyFunction) {
	readyFunctions.push(readyFunction);
};
```

We now have two of the three methods implemented. Just one left to implement - the load method.

We're providing an array of image names. We can make life easier for ourselves by just dealing
with these one at time by taking advantage of the forEach method of the javascript array object.
The forEach method accepts a reference to a function and calls that function passing in a reference
to the current element of the array as it goes through it. So our load function looks like this:

``` javascript
this.load = function( arrOfUrls ) {
	arrOfUrls.forEach(function(url) {
		loadOne(url);
	});
};
```

Now we just have to write the loadOne function and we're done. Since the loadOne function isn't 
going to be made available to callers of this class we declare it as a private function (i.e. one
that can only be called from within this class) as follows:

``` javascript
function loadOne( url ) {
}
```

In this function we need to create an image object and set it's src property to the url specified:

``` javascript
function loadOne(url) {
	var imageToLoad = new Image();
	imageToLoad.src = url;
}
```

This will start our image loading. But wait we still have to arrange things so that the ready function 
is called when all of the images are loaded (that's the point of this class after all). To so that we need
to keep track of the number of images that have been requested for loading and the number of images loaded.
So we create to variables in this class to keep track of these as follows:

``` javascript
var numImagesToLoad = 0;
var numImagesLoaded = 0;
```
	
Now each time we request to load an image we add 1 to the value of numImagesToLoad. So our loadOne
function becomes:

``` javascript
function loadOne(url) {
	numImagesToLoad++;
	var imageToLoad = new Image();
	imageToLoad.src = url;
}
```

Now we add an onload function for each image created and use it to check if all the images have loaded.

``` javascript
imageToLoad.onload = function() {
	// This image is loaded, so store a reference to it in our cache.
	imageCache[url] = imageToLoad;
	numImagesLoaded++;		// another one loaded
	// Now we check if all the images have loaded.
	if ( numImagesToLoad == numImagesLoaded ) {
		// Use the array forEach function to go
		// through all the elements in the array
		// of ready functions calling each one in turn
		readyFunctions.forEach(function(readyFn){
			readyFn();
		});
	}
};
```

That's it. We now have our ImageCache created.

Let's look at how we are going to draw our game images on to the canvas. The drawCtx gives us access to a number of methods which we can use to draw on the canvas. For the purposes of our game we're only interested in one of these - it's called the drawImage method. You should have an image called Gunship.png in your images directory. We can draw this image on our canvas by adding the following line into gunship.js immediately after the line that calls fillRect.

``` javascript
drawCtx.drawImage(imageCache.get('images/gunship.png'),0,0,39,36,0,0,39,36);
```

Lets' look at the parameters to this function:
* The first parameter is a reference to the image to draw. We get this from our image cache.
* The next two parameters are the location in this image to begin copying onto our canvas.
* The 4th and 5th parameters are the size of the image to be copied to the canvas.
* The 6th and 7th parameters specify the location on the canvas to begin drawing the image
* The 8th and 9th parameters specify the size of the area into which the image should be copied.

In effect this function copies a region of a source image onto a specified region of the canvas.
	
Of course you will have noticed that this presumes that the gunship.png image is in our imageCache. So to accomplish this we need to add this image to the list of images to be loaded by the image cache. To do this we change the call to imageCache.load in Gunship.js to read as follows:

``` javascript
imageCache.load(['images/terrain.png','images/gunship.png']);
```

So we now know how to draw a single static image on our canvas. But our sprites are composed of a series of images that are drawn in sequence to give the illusion of movement.

There should now be an image in the images directory called sprites.png. If you look at this image you will notice that it contains a series of images arranged horizontally which if drawn in sequence would have the effect of creating the illusion of movement.

Our Gunship has two images which is drawn in sequence wll give the illusion of the rotors spinning.

There are four images for the enemy which if drawn in sequence will look like they are moving their armour at the front.

There are eight images for an explosion.

By having all of these images loaded into a single image we can load all of the games images required in a single image - thus making our game faster to load.

## Building the Sprite Class

We're going to create a javascript class to manage the sprite. This class will be responsible for the animation of the sprite (i.e. choosing what frame of the sprite to display at a given time) and also for it's position on the screen.

Firstly though we need to get the concept of how to sequence the frames sorted. Every game has the concept of a game clock. This is what's used to drive the "automatic" parts of the game (generally called the game AI). In our case we're going to synchronise the game clock along with the clock we use to draw the sprites on the screen. This gives us a mechanism that will allow us to sequence the drawing of the different image frames of our sprites.

For the purposes of this game we're going to assume that our clock ticks 60 times a second. Therefore if we want our sprite to display it's frames at a rate of 4 frames a second - then with 60 clock ticks per second we need to update the sprite frame every 60/4 = 15 clock ticks. So for each sprite, we need to calculate the number of clock ticks between sprite frames depending on how fast we want that sprites animation to run.

Bearing that in mind let's start to build our sprite class.

Create a new file in your editor and type in the following to create the Sprite class:

``` javascript
function Sprite() {
}
```
	
Save this in the scripts directory as Sprite.js
So let's look at the functionality that we want our sprite class to have. We split the drawing of the appropriate frame into two parts. One part (update) decides which frame of the sprite should be drawn, and the second part (render) then actually draws the image using the selected frame at the current position of that sprite on the screen.

``` javascript
// Decide which frame of our sprite to display. Based on the number of clock ticks (clock 
// frames) that have passed since the last time we were called.
this.update = function(framesElapsed) {
};

// Render the current sprite frame at the current sprite location. Is passed in the drawing 
// context for the canvas on which the frame should be drawn.
this.render = function(drawCtx) {
};

// These two methods allow our program to set the current position of the sprite and to 
// query the current position of the sprite.
this.setPosition = function(top, left) {
};

this.getPosition = function() {
};

// This method allows us to query the size of the current sprite.
this.getSize = function() {
};

// Some sprites (e.g. explosions) just run through their animation once and then they're 
// finished. For those sprites we need to know when they are finished so that we can remove
// them from our list of sprites.
this.isDone = function() {
};
```

Now lets's look at the information we need in order to define a sprite and add parameters to our class function to pass those values into our class. We revise our classes function declaration to look like this:
``` javascript
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
...
}
```
	
Then we add internal variables to our sprite class that will store the information passed into our class function in case we need it again. Add these lines just after the curly bracket after the function line so that it looks like this:


``` javascript
function Sprite(spriteMap, top, left, width, height, fr, frames, frameDir, doOnce ) {
	// These variables store the definition of our sprite.
	var theSpriteMap = spriteMap;
	var srcPos = { left: left, top: top };
	var size = { w: width, h: height };
	var frameRate = fr;
	var frameSet = frames;
	var dir = frameDir;
	var once = doOnce;

	...
}
```
	
Now we need to look at other internal state for our sprite that we will need as we develop it. These variables are used to store information about the sprite that is calculated as the game runs.

``` javascript
// These variables store the internal state of our sprite.
var frameIdx = 0;	// Index into the frameSet pointing to the current frame to render.
var curSpritePos = { top :0, left: 0};
var clockFrame = 0;
var frameDivisor = frameRate > 0 ? 60/frameRate : 0;
```
	
The last line here introduces some new syntax. This is like writing an if - then - else all on one line. It's called a ternary operator. It breaks down as follows:

``` javascript
var frameDivisor = ...
```

We're just declaring a variable and we're going to assign it some initial value.

``` javascript
frameRate > 0 ? 60/frameRate : 0;
```

The bit before the question mark is treated like an if condition.

The next bit (before the :) is the value to return if the condition evaluates to true. The remainder of the statment is the value to return if the condition evaluates to false. The above declaration is the same as if I had written:

``` javascript
var frameDivisor;
if ( frameRate > 0 ) {
	frameDivisor = 60/frameRate;
} else {
	frameDivisor = 0;
}
```

But us lazy software developers find it much quicker to use:

``` javascript
var frameDivisor = frameRate > 0 ? 60/frameRate : 0;
```

Now let's complete the "easy" functions of our Sprite class.

The isDone method is just the value of the internal "done" variable.

``` javascript
this.isDone = function() { 
	return done;
}
```

The getSize method simply returns the width and height of the sprite as passed into the constructor. Note that since we store the width and height in a JSON object internally we don't want to pass back a reference to our internal size variables so we create one and return it when the getSize function is called using JSON notation:

``` javascript
this.getSize = function() {
	return { w: size.w, h: size.h};
}
```

We do the same for the getPosition function:

``` javascript
this.getPosition = function() {
	return {top: curSpritePos.top, left: curSpritePos.left; };
}
```

If a caller wants to set the location of the sprite on the screen they will call the setPosition function so we use this to update the internal sprite location:

``` javascript
this.setPosition = function( top, left ) {
	curSpritePos.top = top;
	curSpritePos.left = left;
}
```
	
Now we just need to complete the two "update" and "render" functions.

The "update" function is responsible for calculating the frame that we're next going to display for out sprite. However since we also use this class to manipulate the bullets (which aren't really sprites - just single images) we need can disregard the calculation if the frame divisor is 0 (which is the case for non-sprites).

``` javascript
this.update = function(framesElapsed) {
	if ( frameDivisor > 0 ) {
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
```

New syntax:
* clockFrame += framesElapsed 
    * is the same as writing clockFrame = clockFrame + framesElapsed
	* it's just a shorter way of writing this.
* var moveFrames = Math.floor(clockFrame/frameDivisor)
	* The Math.floor function returns the integer part of a value so 1.234 becomes 1, but 1.999 is also 1 i.e. it's not rounded.
* frameIdx = moveFrames % framesSet.length
	* The modulus operator (%) returns the remainder when the first value is divided by the second. We use this to cycle through the set of frames in the frameset.
* done = once && moveFrames > frameSet.length
	* The "done" variable is assigned the value true or false based on the result of the expression to the right of the equals sign. You can assign the result of a logical expression to a variable.

Once this function has completed frameIdx now contains the index in frameSet of the frame to be displayed. Also, the "done" variable will be true if the animation is finished (like for explosions).

So our render function now just needs to calculate the location of the sprite frame in our sprite map and draw it on the canvas.

``` javascript
this.render = function(drawCtx) {
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
```

Finally to use this new class in our project we need to include it in the set of scripts in the HTML file.

``` html
<script src="scripts/Sprite.js" type="text/javascript"></script>
```

## Testing the Sprite Class

Now that we've build our sprite class we should test it before we go any further. By testing it now (rather than when we're finished building the entire game) it's easier to find any bugs that we may have introduced in our class.

We'll add some code to the gunship.js file which will create the sprite and then create a test clock to animate it.

First we need to load the sprite map into our image cache. So we just add it to the array of images to be loaded into the image cache:

``` javascript
	imageCache.load(['images/terrain.png','images/gunship.png', 'images/sprites.png']);
```

Now we can use this image in our code. Previously we had drawn the gunship image on our canvas. Let's replace this with an animated enemy. So we can remove the call to drawImage that draws the gunship on the canvas. (So remove this line:

``` javascript
	drawCtx.drawImage(imageCache.get('images/gunship.png'),0,0,39,39,0,0,39,39);
```

And we replace it with the following lines:

``` javascript
	sprite = new Sprite(imageCache.get('images/sprites.png'),78,0,80,39,10,[0,1,2,3,2,1],'horizontal');
	sprite.setPosition(0,0);
	testSprite();
```

We also need to add a new variable to store the reference to the sprite that we just created. We add this below the declaration of the imageCache so that it is accessible. The code after the imageCache declaration in gunship.js should look like this now:

``` javascript
	var imageCache = new ImageCache();
	var sprite = null;
```

The first line creates a Sprite class and we pass it a reference to the sprite image map and tell it the location of the sprite we want to draw.

This code calls a function we haven't written yet called testSprite. So let's add this now:

``` javascript
	function testSprite() {
		sprite.update(5);
		drawCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
		sprite.render(drawCtx);
		setTimeout(testSprite,100);
	}
```

This function calls the sprite update method (which calculates the next frame of the sprite to display) and tells it to advance 5 clock ticks.

We then call drawCtx.fillRect to blank the canvas before every frame is drawn.

Finally we call sprite.render and then set a timeout to call this function again in 100 milliseconds.

This should draw an animated enemy on the screen.

### Providing default values
You may have noticed that we don't pass the last parameter to our Sprite function to create a sprite. This is the doOnce parameter. The reason for this is that if we omit a parameter to a function JavaScript will pass in a special value of *undefined*. If we treat such a parameter as if we are expecting a value of true or false, it will be evaluated as if it were false. Hence by omitting this parameter we implicitly pass a value of *false* for it.

This feature can be used to provide default values for parameters to a function using the following syntax:

``` javascript
	var once = doOnce || false;		// Means if doOnce is true once will get the value true.
```

We can do the same for the direction parameter also if we wish to default it's value to horizontal:

``` javascript
	var dir = frameDir || 'horizontal';	// Default to 'horizontal' if not provided
```

## Providing a clock for our game
Sprites, unlike static images, require continuous updating in order to generate their animation. So we need a clock of some sort to drive all of the sprites in our game. We will also be able to use this clock to monitor and update the game state according as the game is played.

We're going to count our clock ticks in terms of the number of frames of the game that have elapsed. i.e. based on a frame rate of 60 frames per second we arrange it so that our clock ticks 60 times per second.

Let's consider the functionality that we would require of a clock class.
- We need to be able to tell our clock what to do every time the clock ticks. This should also tell us how many game frames have elapsed since the last time it was called. Ideally this will always be 1, but it may be more. We're going to call this function ```registerGameStep```.
- We need to be able to tell the clock when to start ticking. We're going to call this function ```start```

Ideally then we could rewrite the portion of gunship.js that we wrote to test our sprite class as follows:
``` javascript
	// Create our game clock that's going to animate our sprites
	var gameClock = new GameClock();
	imageCache.ready(function() {
		var pattern = drawCtx.createPattern(imageCache.get('images/terrain.png'),"repeat");
		drawCtx.fillStyle = pattern;
		drawCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
		// Create a sprite
		sprite = new Sprite(imageCache.get('images/sprites.png'),78,0,80,39,10,[0,1,2,3,2,1],'horizontal');
		sprite.setPosition(0,0);
		// Register a step with the clock that will cause the animation of our sprite
		gameClock.registerStep(function(framesElapsed) {
			testSprite(framesElapsed);
		});
		
		// Now that we have our clock all configured - tell it to start ticking.
		gameClock.start();
	});
```

Also, since our game clock is now responsible for calling the testSprite method we can remove the call to ```setTimeout()``` so that it looks like this. Note how we now pass the number of frames that have elapsed since last called to the ```sprite.update()``` method instead of the value of 5 that we had hard-coded previously.

``` javascript
	function testSprite(framesElapsed) {
		sprite.update(framesElapsed);
		drawCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
		sprite.render(drawCtx);
	}
```

So now that we know what we want our game clock class to look like, let's go and write it.

### The GameClock class
We start a new file in our scripts directory called GameClock.js and we start it with the standard syntax we use for defining a new JavaScript class:

``` javascript
function GameClock() {
}
```

Based on what we know our clock class is going to look like to it's user we know that we're going to have to store a list of possible functions to be executed each time the clock ticks. Typically we store these in an array. So we declare storage for these in our class as follows:

``` javascript
	var stepFunctions = [];
```

Additionally in order to be able to tell how many frames have elapsed we need to "remember" the time at which the tick method was last called so we store the last tick time:

``` javascript
	var lastTickTime = 0;
```

Also, since we're working on a frame rate of 60 frames per second we can calculate the number of milliseconds that elapse between frames as this won't change.

``` javascript
	var millsecsPerFrame = 1000/60;
```

We also keep track of the current frame numbers which is effectively the number of times we have ticked since the clock was started. We also have one other variable that we use to capture a number that the browser gives us back to control the way in which the class is called. We don't really need it right now, however we'll capture it here so that we have it in the future if we need it.

``` javascript
	var currentFrameNo = 0;
	var animationId = 0;	// Returned by RequestAnimationFrame
```

Let's have a look at our start method. It's job is to start the clock ticking. To do this it calls a new HTML5 browser method which will give us a clock rate of approximately 60 frames per second. Every time the HTML5 clock ticks we want to figure out what needs to be carried out in our game.

``` javascript
	this.start = function() {
		animationId = requestAnimationFrame(clockTick);
	};
```

This uses the ```requestAnimationFrame()``` method which is a new method available to us in HTML5. However because HTML5 is very new it may not be implemented using the same name in each browser. Therefore we use the following construct to figure out the correct HTML5 function to call. We define a variable which points to the actual function to be called as follows:

``` javascript
	var requestAnimationFrame = 
			window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( animationCallback ) { window.setTimeout(animationCallback, millsecsPerFrame);};
```

This uses the same syntax that we use for defining default values as we saw previously. If it can't find a built-in function to call it falls back on creating a ```window.setTimeout()``` that gets called 60 times a second.

To register a clock tick function we simply put the supplied function into the array of step functions:

``` javascript
	this.registerStep = function(stepFunction) {
		stepFunctions.push(stepFunction);
	};
```

So now all we have to do is write the clockTick function that the start method registers with the ```requestAnimationFrame()``` method.

The clockTick function that we registered with ```requestAnimationFrame()``` is called with the current time given in milliseconds. However because it can could be called using the ```window.setTimeout()``` function it might not be passed the current time. We can default the current time if it's not provided using the standard method of providing default values:

``` javascript
	function clockTick(timestamp) {
		// If timestamp isn't passed to this function, then
		// we calculate the current time using the built-in
		// Date class.
		timestamp = timestamp || Date.now();
		...
	}
```

Now we need to calculate the amount of time that has elapsed since we were last called. Then we figure out the number of frames this represents. We use this to keep track of the current frame number for the game.

``` javascript
		var elapsed = timestamp - lastTickTime;
		var framesSinceLastTick = Math.floor(elapsed/millsecsPerFrame);
		currentFrameNo += framesSinceLastTick;
```

If some frames have elapsed since we were last called, then we need to call our step functions and record the last time we executed them. We only record the ```lastTickTime``` if some frames have elapsed to make sure that we calculate the number of elapsed frames correctly.

``` javascript
		if ( framesSinceLastTick > 0 ) {
			stepFunctions.forEach(function(fn) { 
				fn(framesSinceLastTick, currentFrameNo);
			});
			lastTickTime = timestamp;
		}
```

And then finally we schedule this function to be called again on the next tick.

``` javascript
		animationId = requestAnimationFrame(clockTick);
```

With our GameClock class complete now we just need to include it in our set of loaded scripts. So add the following &lt;script&gt; tags to your gunship.html file:

``` html
		<script src="scripts/GameClock.js" type="text/javascript"></script>
```

## Automating Sprites

Our game has two kinds of sprites - we have the player which moves in response to the keys on the keyboard.

On the other hand we have the enemies and the bullets which move on their own (until they collide with something of course).

We can use our existing sprite class to represent the player sprite and call setPosition on it to change it's position. However we need to do something different for the bullets and the enemies. These sprites need to move automatically once they have been created.

These automated sprites are just ordinary sprites but they also change their position automatically. Therefore they have all of the functionality of a sprite (i.e. they animate), but in addition when they update their state they also change their position.

One solution to this problem is to copy all of the code we have in our Sprite class and then just modify the update function to do the additional positioning.

However this isn't an ideal solution. Suppose we found a problem in our sprite class and we needed to fix it, we would then have to fix it in two places.

Wouldn't it be great if there was a way to use the sprite class as it is and just change the functionality of the update function.

Happily there is a way to do this. We call it sub-classing. 

Sub classing allows us to create a new class that is based on an existing class. In our sub-class we can provide additional functionality and over-ride some of the functionality of the base class.

For our scenario, we need to sub-class our sprite class and then over-ride the update function to reposition the sprite each time update is called. If at some point in the future we need to make a change to our sprite class, then our sub-class will also benefit from those changes automatically.

So let's create a new class AutoSprite - (for automated sprite). AutoSprite will do everthing that Sprite does except that we want to add some functionality to the update function.

Therefore our AutoSprite class will take all of the same parameters as our Sprite class. Additionally our AutoSprite class requires two more parameters:
	- direction - horizontal or vertical - indicating the direction in which the sprite will move.
	- numpixels - the number of pixels that the sprite will move per clock frame.
	
So let's implement our AutoSprite class. Create a new file called AutoSprite.js in the scripts sub-directory. 

We declare our class function and add the new parameters at the beginning of the parameter list (this is a choice, we could have added them in any order).

```javascript
function AutoSprite(pixelsPerFrame, spriteDirection, spriteMap, left, top, w, h, fr, frames, frameDir, doOnce) {
}
```

The first thing that we want to do is to call the Sprite class function to do the necessary initialisation there. We have a special syntax for doing this which applies the initialisation code to the implicit ```this``` object which is created on calling the AutoSprite function.

```javascript
    Sprite.call(this,spriteMap,left,top,w,h,fr,frames,frameDir,doOnce);
```

Note how we pass the parameters to the Sprite function from those declare to the AutoSprite function.

We set some defaults for the ```pixelsPerFrame``` and the ```spriteDirection``` parameters:

```javascript
    var pxPerFrame = pixelsPerFrame || 3;       // Number of pixels to move the sprite each frame
    var moveDirection = spriteDirection || "horizontal";    // Is sprite moving horizontally or vertically.
```

Now this is the other clever bit. We want to reposition the sprite before then allowing the standard ```Sprite.update``` to be called. We do this by taking a copy of the update function that was created by the ```Sprite``` function and then over-writing this method with our own version.

```javascript
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
```

Note that the last line of our new ```update``` function calls the function that we took a copy of earlier. So that's it - we've intercepted the update function call, done our bit of code to customise the behaviour, and then called the original update function as usual.

Now we just need to load this javascript in the html file. So add the following tags there:

```html
		<script src="scripts/AutoSprite.js" type="text/javascript"></script>
```

And now we modify our gunship.js function to use the new automated sprite as follows. Modify the line that creates the existing sprite to look like this:

```javascript
		sprite = new AutoSprite(-1.66,'horizontal',imageCache.get('images/sprites.png'),78,0,80,39,10,[0,1,2,3,2,1],'horizontal');
```

And let's position it in the middle of our canvas so that we can see the effect better.

```javascript
		sprite.setPosition(300,500);
```

## Starting to put it all together
To date we've tended to use ```gunship.js``` to test the various other classes that we've been working on. Now though we want to start putting all of these classes together to build our application. 

At the outset we identified that one of the classes we were going to require to build our game is the GameEngine or the Game AI. This class is going to drive the game and implement the logic that controls all aspects of the game. 

So to get started we're going to do a little bit of re-organisation of some of the code in ```gunship.js```. We're going to create a new class called ```GameEngine``` and move our sample automated sprite into that to verify that it's working correctly.

Our GameEngine really only has one function and that is to start the game. We implement a method on GameEngine called ```init``` to do this. So we can re-arrange gunship.js to look like this: (Note the amount of code we've removed from this file).

```javascript
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
```

We create the GameEngine passing it in a reference to the canvas that we're going to use for the game and also a reference to the cache of images that it has loaded. Then we call the GameEngine's ```init``` method which starts the game.

So what does GameEngine look like. Let's create ```GameEngine.js``` (don't forget that this has to be saved to our scripts directory along with the other JavaScript files).

```javascript
	function GameEngine(gameCanvas, imageCache) {
		var theCanvas = gameCanvas;
		var theImages = imageCache;
		
		var drawCtx = theCanvas.getContext("2d");
		
		var gameClock = new GameClock();
		var pattern = drawCtx.createPattern(imageCache.get('images/terrain.png'),"repeat");
		drawCtx.fillStyle = pattern;
		
	}
```

This is just the functionality that we've moved to ```GameEngine.js``` from ```Gunship.js```. We also need to add a reference to a sprite object (just to check that we haven't broken anything) and implement our ```init``` function.

```javascript
	var sprite = null;

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
```

We've created a function ```createEnemySprite``` because we're going to need a function like this as we develop our game so we might as well create it now.

So all our GameEngine class does yet is create an enemy sprite, position it on the screen and then register a game step function with the game clock to make everything work.

Finally we need to add a reference to our GameEngine class to our HTML file so that it get's included. So add the following script tag below the others in the HTML file.

```html
	<script src="scripts/GameEngine.js" type="text/javascript"></script>
```

Now our game should work as before - it simply creates an enemy sprite on the screen that travels to the left and off screen.


### Adding the Player Sprite

So now that we've proven that our little re-organisation hasn't broken anything let's start to introduce some elements of our game. The easiest place to start is by introducing the player sprite and adding keyboard handling to control it.

First let's place the enemy sprite we have already with the player sprite and position it in middle at the left hand edge of the screen. We create a function ```createPlayerSprite``` to create the sprite and position it. So add the following function to ```GameEngine.js```:

```javascript
	function createPlayerSprite() {
		var s = new Sprite(imageCache.get('images/sprites.png'),0,0,39,39,10,[0,1]);
		var top = Math.floor((canvasHeight - 39)/2);
		s.setPosition(top,0);
		return s;
	}
```

Here we just use the Sprite object (since we're going to be moving this sprite around using the keyboard). Notice that since we earlier added default parameters to the Sprite object for ```frameDir``` and ```doOnce``` we don't need to specify those last two parameters to the Sprite object function. If not specified default values of 'horizontal' and 'false' are assumed for these two parameters.

Since we're going to position this sprite at the left hand side of our canvas we know that the left position is going to be 0 (zero). Therefore we only need to calculate the vertical (top) position of the sprite. To position the sprite correctly in the middle of the vertical we need adjust for the height of the sprite itself so it's not quite as simple as dividing the height of the canvas in two. We capture the ```canvasHeight``` and ```canvasWidth``` by adding some more ```var``` statments when the GameEngine object is constructed as follows:

```javascript
	var canvasHeight = theCanvas.clientHeight,
		canvasWidth  = theCanvas.clientWidth;
```

We know that our player sprite is 39 pixels square so we can calculate the top position of our sprite using
```
	(canvasHeight - 39)/2
```

However in order to ensure that the returned value is an integer (it could be a value like 305.75!!) we surround the calculation with a call to ```Math.floor``` which returns the whole number part of a value (no rounding).

Then we use this calculation to position the sprite by calling:
```javascript
	s.setPosition(top,0);
```

Finally, in GameEngine.js change
```javascript
	var sprite = null;
```

to 

```javascript
	var playerSprite = createPlayerSprite();
```

and change the two lines:
```javascript
	sprite.update(framesElapsed);
	sprite.render(drawCtx);
```

to 

```javascript
	playerSprite.update(framesElapsed);
	playerSprite.render(drawCtx);
```

(We're replacing the var we used earlier to test our re-organisation since this was only a temporary measure.)

Save GameEngine.js and open the game in the browser. You should see the gunship sitting in the middle of the left-hand side of the game canvas.

### Keyboard Handling

Now let's add our keyboard handling. 

In order to make the keyboard handling more responsive we're going to monitor key-up and key-down events to track which keys are pressed and we respond based on the current status of those keys. This allows us to keep moving the sprite as long as the key remains pressed rather than depending on the keyboard repeat rate which usually has a delay before the first repeat.

We're going to use a key status map object to keep track of the keys that are pressed. In ```GameEngine.js``` we create this object and add a function that we can use to update it for us as follows:

```javascript
	var keyStatusMap = {};
	
	function setKeyStatus(keyEvent, status) {
		switch( keyEvent.keyCode ) {
			case 32:  // Space key
				keyStatusMap["SPACE"] = status;
				break;
			case 37:  // Left key
				keyStatusMap["LEFT"] = status;
				break;
			case 38: // Up key
				keyStatusMap["UP"] = status;
				break;
			case 39: // Right key
				keyStatusMap["RIGHT"] = status;
				break;
			case 40: // DOWN key
				keyStatusMap["DOWN"] = status;
				break;
		}
	}
```

This function is passed a reference to the key event and the status to be assigned to the key pressed. This function only looks at the UP, DOWN, LEFT, and RIGHT arrow keys for the moment and then creates a member of the JSON object ```keyStatusMap``` using the friendly name for the key and updates it with the status passed in.

We use this functionality by attaching keyboard handlers to the document in which the game is executing. We use the keyDown handler to set the status of the key to 'true' to indicate that the key is pressed, and then the keyUp handler to set the status of the key to 'false'. This is accomplished by adding the following code to the GameEngine's ```init``` method:

```javascript
	$(document).keydown(function(keyEvent) {
		setKeyStatus(keyEvent,true);
	});
	
	$(document).keyup(function(keyEvent) {
		setKeyStatus(keyEvent,false);
	});
```

Now we have an object which reflects the current status of the keys in which we're interested. We write a function to check this object and use it to reposition the playerSprite as appropriate.

```javascript
	function checkPlayerActions(framesElapsed) {
		var currentPlayerPos = playerSprite.getPosition();
		if ( keyStatusMap["LEFT"] ) {
			playerSprite.setPosition(currentPlayerPos.top,
				Math.max(0,
					currentPlayerPos.left-(MOVE_PIXELS*framesElapsed)));
		}
		if ( keyStatusMap["RIGHT"] ) {
			playerSprite.setPosition(currentPlayerPos.top,
				Math.min(
					canvasWidth-playerWidth,
					currentPlayerPos.left+(MOVE_PIXELS*framesElapsed)));
		}
		if ( keyStatusMap["UP"] ) {
			playerSprite.setPosition(
				Math.max(0,currentPlayerPos.top-(MOVE_PIXELS*framesElapsed)),
				currentPlayerPos.left);
		}
		if ( keyStatusMap["DOWN"] ) {
			playerSprite.setPosition(
				Math.min(canvasHeight-playerHeight,
					currentPlayerPos.top+(MOVE_PIXELS*framesElapsed)),
				currentPlayerPos.left);
		}
	}
```

This method checks each of the keys of interest in the ```keyStatusMap``` object and if the status of that key is indicated as being pressed, we then calculate the new position of the playerSprite and set it as appropriate.

For the LEFT and RIGHT keys we simply calculate a new ```top``` position for the player sprite and set this position on the playerSprite object. For the UP and DOWN keys we only change the ```left``` position of the object.

You will notice that the LEFT and UP keyboard processing uses ```Math.max``` when calculating the left and top positions. The purpose of this is to ensure that when moving the sprite LEFT or UP we don't allow the sprite to move off the canvas in that direction which would happen if the relevant parameter was 
allowed to become negative.

A similar ploy is used to stop the sprite going off the right or bottom of the canvas when the RIGHT and DOWN keys are pressed. In this instance we use ```Math.min``` to limit the position to the maximum position that the sprite can have on the right or bottom of the canvas. To calculate the maximum left position of the sprite we subtract the width of the sprite from the width of the canvas and using Math.min we stop the calculated value exceeding this. We do the same when calculating a new top position on detecting the DOWN key except we calculate the maximum value for top by subtracting the height of the sprite from the canvas height.

You will also notice that we use a constant ```MOVE_PIXELS``` to calculate the number of pixels to move the sprite each time the key status is checked. We set this to a value of 3 pixels. We put the following line towards the top of the GameEngine.js file (immediately after the declaration of canvasWidth and canvasHeight):

```javascript
	var MOVE_PIXELS=3;
```

Also you will notice that we use the number of elapsed frames as a multiplier to calculate the distance to move each time. Hence we need to pass this value into the ```checkPlayerActions``` function. 

Finally we need to call this function from the game step function. So we add the following call as the first line of the the gamestep function:

```javascript
	checkPlayerActions(framesElapsed);
```

That's it. We should now be able to move the playerSprite around the game canvas and we shouldn't be able to move it off the canvas in any direction.

As we move our sprite around the screen now with the arrow keys you will notice that it stops before running off the screen. However you will notice that while moving from left to right, the sprite goes right up to the vertical edges, when moving up and down there is a gap between the sprite and the edge. 

This gap is down to the height we defined for the sprite in ```createPlayerSprite()```. Currently the sprite is a square 39px X 39px image. However if you examine the height of the sprite in the sprite map you will notice that the actual image starts 5px from the top and the bottom of the image is actually 30px from the top. So we could change the sprite definition to start 5px further down and to only have a height of 25px (30px bottom - 5px top) as follows:
```javascript
	function createPlayerSprite() {
		var s = new Sprite(imageCache.get('images/sprites.png'),5,0,39,25,10,[0,1]);
		var top = Math.floor((canvasHeight - 39)/2);
		s.setPosition(top,0);
		return s;
	}
```
(Note the updated 2nd and 5th parameters to the Sprite constructor.)

Now when we move up the sprite goes right to the top edge of our canvas, however moving down still leaves a gap. Debugging the down arrow action in ```checkPlayerActions()``` reveals that the calculation at the following line is incorrect.
```javascript
	Math.min(canvasHeight-playerHeight,
		currentPlayerPos.top+(MOVE_PIXELS*framesElapsed)),
		currentPlayerPos.left)
```

On examination we see that the value of playerHeight is still 39!! How did that happen. Let's look back to where this value is set.
```javascript
	var canvasHeight = theCanvas.clientHeight,
		canvasWidth  = theCanvas.clientWidth;
		
	var MOVE_PIXELS = 3;
	var playerWidth = 39;
	var playerHeight = 39;
```
There's the problem - we've hardcoded the size of the sprite. 


Why don't we interrogate the sprite after it's created and use that to get the values for these variables (which we're really only using for convenience). So we move the two lines relating to ```playerWidth``` and ```playerHeight``` above to below where the playerSprite is created and change them as follows:
```javascript
	var playerSprite = createPlayerSprite();
	// Interrogate the playersprite to find out it's width and height.
	var playerWidth = playerSprite.getSize().w;
	var playerHeight = playerSprite.getSize().h;
```

Now you'll find that the sprite moves right to the bottom of the screen correctly.

### Introducing ... The Enemy
Our game is going to generate a stream of enemies for us to fight. These enemies are introduced randomly. Also, we need to manage many enemies as they are created, update them on screen and remove them when they are killed or go off-screen.

First let's create somewhere to store references to all of the enemies that we create. An array seems like an ideal way to do this. So we add an array for enemies just under where we declared the playerSprite in ```GameEngine.js```

```javascript
	var playerSprite = createPlayerSprite();
	// Interrogate the playersprite to find out it's width and height.
	var playerWidth = playerSprite.getSize().w;
	var playerHeight = playerSprite.getSize().h;
	
    // Many enemies - so use an array to store references to them
    var enemies = [];
```

And for the moment we'll make life easy on ourselves by just putting a single enemy into the array. So let's add an enemy to the array in the init function (i.e. just before registering the gamestep.

```javascript
	this.init = function() {
		$(document).keydown(function(keyEvent) {
			setKeyStatus(keyEvent,true);
		});
		
		$(document).keyup(function(keyEvent) {
			setKeyStatus(keyEvent,false);
		});
	
		enemies.push(createEnemySprite());
		gameClock.registerStep(function(framesElapsed,curFrameNo) {
```
Next we need to display any enemy sprites whenever we're drawing the current game state. So when we modify the step registered in the gameClock to include rendering of the sprites in the enemy array.
```javascript
		gameClock.registerStep(function(framesElapsed,curFrameNo) {
			checkPlayerActions(framesElapsed);
			drawCtx.fillRect(0,0,theCanvas.width, theCanvas.height);
			playerSprite.update(framesElapsed);
			playerSprite.render(drawCtx);
			var ix = 0;
			enemies.forEach(function(s) {
				s.update(framesElapsed);
				s.render(drawCtx);
			});
		});
```
This will render the enemy on the canvas and it will move to the left off the screen. 

But wait a minute! All new enemy sprites should be position just on the right hand side of our game canvas and in some random vertical position. So let's update our ```createEnemySprite``` function to position the sprite randomly vertically and just on the right handside of the screen. So the sprite returned by ```createEnemySprite``` is already appropriately positioned.

```javascript
	function createEnemySprite() {
		var s = new AutoSprite(-1.66,'horizontal',imageCache.get('images/sprites.png'),78,0,80,39,10,[0,1,2,3,2,1],'horizontal');
		var left = canvasWidth - 5;   // Left most part of sprite is 5px from RHS
		var top = Math.min(Math.random()*canvasHeight, 
								canvasHeight - s.getSize().h);
		s.setPosition(top,left);
		return s;
	}
```

Above we've calculated the left position of the enemy sprite (just 5px from the RHS of the canvas) and the top position (some random location that will fit on the canvas. We use Math.min to make sure that the sprite will always completely fit on the screen.

Now if we reload the page for our project we will see an enemy sprite appear on the very right hand side of the canvas and each time we reload the page it's initial vertical position will change randomly.

### Tracking active sprites
The enemy sprite will eventually move off the left side of the canvas. However just because it's no longer visible doesn't mean that it's not still part of our game. In fact if you were to debug the web-page you would see that the sprite is positioned further and further to the left with an increasing negative 'left' position.

As we add sprites to our game we will have more and more of these objects to manage. Each of these consumes memory and processor time to manage. Therefore it makes sense to get rid of the sprites that are no longer on screen. Let's look at how we do that.

You may remember that we introduced a 'done' variable in the sprite class specifically to work with single play sprites (i.e. like explosions - they are no longer rendered once they have rendered all of their frames). Let's look at using this variable to flag when a sprite is no longer visible on the screen.

We can use the ```render()``` method of the sprite class to detect when the sprite is no longer visible on the screen. This is convenient because this method is passed a reference to the drawing context which allows us to access the canvas dimensions and hence we can make the detection of sprites no longer being visible "automatic".

So we look for the left side of the sprite less than the negative width of the sprite ('cos then it's completely off the left of the canvas) or the left of the sprite greater than the canvas width. A similar evaluation can be applied to the top position relative to the top and bottom of the canvas.

We can express this using the following statement. Put this at the beginning of the ```render()``` method.
```javascript
	this.render = function(drawCtx) {
		// We check here to see if the sprite is still visible before we 
		// go to the trouble of rendering it.
		// The below statement is equivaluent to
		//    done = done || (curSpritePos.left ... );
		// Or 
		//    if ( !done) {
		//		done = ...
		//	  } else {
		//		done = done;
		//    }
		done |= curSpritePos.left < -size.w || 
				curSpritePos.left > drawCtx.canvas.width ||
				curSpritePos.top < -size.h ||
				curSpritePos.top > drawCtx.canvas.height;
```
Note the use of the ```|=``` operator which provides a more convenient method of evaluating our conditions and assigning the result to the ```done``` variable.

Now when our sprite is no longer visible on screen it will flag itself as done and the gameengine can check this using the ```isDone()``` method of the sprite.

Now let's look at removing inactive sprites from the enemy list of the gameengine.

Currently we use an array.forEach() method to step through the list of enemy sprites and call the ```update()``` and ```render()``` methods on each one. However this method of stepping through the list of enemies doesn't allow us to modify the array of enemies. So we need to change the way we step through this array.

Another way to step through the array is to use a ```for()``` loop. This allows us to step through the list of enemies and reference each one by it's position in the array. So we convert the following code:
```javascript
	enemies.forEach(function(s){
		s.update(framesElapsed);
		s.render(drawCtx);
	});
```

to look like this:

```javascript
	var ix;
	for(ix = 0; ix < enemies.length; ix++) {
		var s = enemies[ix];
		s.update(framesElapsed);
		s.render(drawCtx);
	}
```

Now we can use the sprites ```isDone()``` method to check if the sprite is completed and if so we can remove it from the array using the ```array.splice()``` method.
```javascript
	for(ix = 0; ix < enemies.length; ix++) {
		var s = enemies[ix];
		s.update(framesElapsed);
		s.render(drawCtx);
		if ( s.isDone() ) {
			enemies.splice(ix,1);
		}
	}
```	

This looks correct ( and if you run it and check the enemies array you will see that it empties when the sprite goes off-screen), however as you examine it you will see that it has a slight flaw. 

Say we have an array of 6 items as follows: A B C D E F - where A is index 0, B is index 1, etc.
If we remove the element at index 2 (i.e. element C) our array now looks like: A B D E F.
So now the element that was previously at index 3 is now at index 2.

In our loop - the index value is 2 when the element is removed. The value of index variable, ```ix``` is then incremented so it now has a value of 3. But element 3 is now 'E' which means we never processed element D. The solution is to decrement the index variable when an element is removed from the array. We can do this as follows:
```javascript
		if ( s.isDone() ) {
			enemies.splice(ix,1);
			ix--;
		}
```
Alternatively we can so this in-place as part of the call to ```Array.splice()``` by taking advantage of the fact that this is called __post__ decrement. This means that the current value of the variable is returned before the value is decremented. The following snippet should clarify:
```javascript
	var c = 2;		// C is initialised with a value of 2
	var y = c--;	// y is initialised with a value of 2, but c will have a value of 1 afterwards.
```

So we can rewrite this statement as
```javascript
		if ( s.isDone() ) {
			enemies.splice(ix--,1);
		}
```

### Let's shoot some bullets
As our game progresses we will introduce bullets each time the user presses the space bar. However each time the space bar is pressed we want to create three bullets - one going forward, one going up and another going down. So we're actually going to generate an array of three bullets each time the space bar is pressed.

Let's generate the bullets first. Each bullet is an AutoSprite. So lets create the AutoSprites first. Let's add a new function called ```createBullets()```:
```javascript
	function createBulletSprites() {
		var forward = new AutoSprite(BULLET_SPEED, 'horizontal', imageCache.get('images/sprites.png'),0,39,17,7,0,[0],null,false);
		var down = new AutoSprite(BULLET_SPEED,'vertical',imageCache.get('images/sprites.png'),0,50,9,5,0,[0],null,false);
		var up = new AutoSprite(BULLET_SPEED,'vertical',imageCache.get('images/sprites.png'),0,60,9,5,0,[0],null,false);
		
		return [forward,up,down];
	}
```

This creates three bullets and returns them in an array. However these bullets are not positioned. We need to position these around the player sprite. Let's position the forward bullet first. First we capture the position and size of the player sprite as we will use these to calculate where to position the bullets.
```javascript
	function createBulletSprites() {
		var spos = playerSprite.getPosition();
		var ssize = playerSprite.getSize();
		
		var forward = new AutoSprite(BULLET_SPEED, 'horizontal', imageCache.get('images/sprites.png'),0,39,17,7,0,[0],null,false);
		// Position the bullet in front of the player sprite and put the middle of the bullet in the middle of the sprite.
		forward.setPosition( spos.top + (ssize.h/2) - (forward.getSize().h/2),
							 spos.left + ssize.w);
		var down = new AutoSprite(BULLET_SPEED,'vertical',imageCache.get('images/sprites.png'),0,50,9,5,0,[0],null,false);
		var up = new AutoSprite(BULLET_SPEED,'vertical',imageCache.get('images/sprites.png'),0,60,9,5,0,[0],null,false);
		
		return [forward,up,down];
	}
```

As our game progresses we will have a number of bullets in flight at any given time. So we use an array to manage our bullets just like we did with our enemies.
```javascript
	// We're going to have a lot of enemy sprites so array
	var enemies = [];
	// Just like the enemies, we can have a lot of bullets on screen.
	// Manage these here.
	var bullets = [];
```

And now we add a line to ```checkPlayerActions()``` to generate the bullets when the space bar is pressed.
```javascript
		if ( keyStatusMap["SPACE"] ) {
			// Create the bullet sprites.
			bullets = bullets.concat(createBulletSprites());
		}
```

Since our function creates an array of bullets we can use the concat method to create a new array with the contents of the existing array and the newly created bullet array.

Now in our game engine we can repeat the functionality that we did with the enemies to render the bullets. Anytime we end up duplicating code it should prompt us to look at creating a function to do this so that we don't end up writing effectively the same code twice.

So we create a new function called ```renderSprites()``` directly below the ```init()``` function as follows:
```javascript
	function renderSprites(spriteArray, framesElapsed) {
		for( var ix = 0; ix < spriteArray.length; ix++ ) {
			var s = spriteArray[ix];
			s.update(framesElapsed);
			s.render(drawCtx);
			// Now we test to see if the sprite is still visible and if not
			// we remove from the array so we no longer have to manage it.
			if ( s.isDone() ) {
				// Note post-decrement of ix - returns the current value of ix to the 
				// splice method call and then decrements ix
				spriteArray.splice(ix--,1);	
				// If we didn't decrement ix, then it would skip evaluation of the next 
				// element of the sprites array.
			}
		}
	}
```

(Note: we had to pass framesElapsed into this method also).

Then we can replace the corresponding code in the ```init``` function with a single line:
```javascript
			renderSprites(enemies, framesElapsed);
```

Finally we can now do the same for our bullets array. Out init function should now look like this:
```javascript
	this.init = function() {
		$(document).keydown(function(keyEvent) {
			setKeyStatus(keyEvent,true);
		});
		
		$(document).keyup(function(keyEvent) {
			setKeyStatus(keyEvent,false);
		});
	
		enemies.push(createEnemySprite());
		gameClock.registerStep(function(framesElapsed,curFrameNo) {
			checkPlayerActions(framesElapsed);
			drawCtx.fillRect(0,0,theCanvas.width, theCanvas.height);
			playerSprite.update(framesElapsed);
			playerSprite.render(drawCtx);
			// Render the sprites that are stored in arrays.
			renderSprites(enemies, framesElapsed);
			renderSprites(bullets, framesElapsed);
		});
		gameClock.start();
	}
```

Now if you run the game and press the space bar it should three bullets - only one of which is as yet positioned correctly. When I did this I noticed that the forward bullet wasn't rendered properly. What's going on?

Here I have a confession to make :(. 

When we (I?) defined the ```AutoSprite``` object we mis-matched it's constructor with that of the ```Sprite``` object that it uses. Currently the ```AutoSprite``` is defined as follows:
```javascript
	function AutoSprite(pixelsPerFrame, spriteDirection, spriteMap, left, top, w, h, fr, frames, frameDir, doOnce) {
		Sprite.call(this,spriteMap,left,top,w,h,fr,frames,frameDir,doOnce);
		...
	}
```

If we look at the ```Sprite``` constructor we see that it is defined as follows:
```javascript
	function Sprite(spriteMap, top, left, width, height, fr, frames, frameDir, doOnce ) {
```

Note how we are passing the parameter called __left__ from the ```AutoSprite``` constructor to the parameter called __top__ in the ```Sprite``` constructor. Similarly the __top__ parameter is passed to the ```Sprite``` as __left__. This means that the sprite definition is incorrect. To fix this we swap the order of the declared parameters in ```AutoSprite``` so that it matches the order declared in ```Sprite```. This means that it's now consistent between the two similar object definitions.

So the ```AutoSprite``` declaration now looks like this:
```javascript
	function AutoSprite(pixelsPerFrame, spriteDirection, spriteMap, top, left, w, h, fr, frames, frameDir, doOnce) {
		Sprite.call(this,spriteMap,left,top,w,h,fr,frames,frameDir,doOnce);
		...
	}
```

Now we also have to change the declaration of the parameters to the AutoSprite created in ```createEnemy``` as follows:
```javascript
	function createEnemySprite() {
		var s = new AutoSprite(-1.66,'horizontal',imageCache.get('images/sprites.png'),0,78,80,39,10,[0,1,2,3,2,1],'horizontal');
		...
	}
```

Note: We have swapped the 4th and 5th parameters to the object definition.

If you re-run the game now and hit the space bar the forward bullet is rendered correctly.

Now let's position the up and down bullets. This just requires a little bit of maths. I also notice that our original definition of the up and down sprites were actually mis-defined - we were using the up bullet for the down sprite and vice versa.
Revise the ```createBullets()``` function as follows to correct this and to position the sprites correctly:
```javascript
	function createBulletSprites() {
		var spos = playerSprite.getPosition();
		var ssize = playerSprite.getSize();
		
		var forward = new AutoSprite(BULLET_SPEED, 'horizontal', imageCache.get('images/sprites.png'),0,39,17,7,0,[0],null,false);
		forward.setPosition( spos.top + (ssize.h/2) - (forward.getSize().h/2),
							 spos.left + ssize.w);
        var down = new AutoSprite(BULLET_SPEED,'vertical',imageCache.get('images/sprites.png'),0,60,9,5,0,[0],null,false);
        down.setPosition(spos.top+ssize.h, spos.left + (ssize.w/2) - (down.getSize().w/2) );
		var up = new AutoSprite(-BULLET_SPEED,'vertical',imageCache.get('images/sprites.png'),0,50,9,5,0,[0],null,false);
        up.setPosition( spos.top, spos.left + (ssize.w/2) - (up.getSize().w/2) );

		return [forward,up,down];
	}
```

If we run this program now we see bullets flying everywhere. However one other little problem has come to light. For even the quickest press on the spacebar we seem to generate several bullets in each direction.
This happens because the keyboard is scanned 60 times per second so even when you press the key quickly it will be detected on several scans and generate bullets for each one.
We need to devise a way to delay the generation of the next sprite when an individual keypress is detected.

We can add some code to the keyboard handling for the spacebar to address this. 

### Limiting key repeat
We can implement a generic mechanism for limit the number of times a key press is recognised per second by waiting for a specified period before generating the next keypress event.
Every time a key is pressed that we want to implement a repeat delay on we can store the time at which is was last pressed and then not generate another keypress unless a minumum period has elapsed.
A function to check for this might look something like the following:

```javascript
    function checkKeyHitDelay(keyName, delay) {
    }
```

This function is going to check if the specified delay has elapsed since the last time the specified keyName was registered. We can add this to our code that generates bullets when the spacebar is pressed as follows:

```javascript
		if ( keyStatusMap["SPACE"] && checkKeyHitDelay("SPACE", KEY_REPEAT_DELAY)) {
			// Create the bullet sprites.
			bullets = bullets.concat(createBulletSprites());
		}
```

As you can see it is easy to add this functionality to any keypress. So let's look at what it would take to implement this functionality.

First we are going to need someplace to store the last time a specific key press was registered. So we create an object to record this just under the object that tracks the key press status:
```javascript
	var keyStatusMap = {};
    var keyHitTime = {};
```

Now we use this to implement our keypress delay.
```javascript
    function checkKeyHitDelay(keyName, delay) {
        // See if we have recorded a hit time for this key already - if not then set the hit time as zero.
        var lastHit = keyHitTime[keyName] ? keyHitTime[keyName] : 0;
        // What time is it now, 
        var curTime = Date.now();
        // Does the elapsed time exceed the required delay time.
        if ( curTime-lastHit >= delay ) {
            // If it does then update the key hit time ...
            keyHitTime[keyName] = curTime;
            // and return true
            return true;
        }
        // Otherwise disregard this key press.
        return false;
    }
```

### Collision Detection
Now that we have most of our core elements on screen let's look at how we detect when they collide. The rules are as follows:
- When a bullet hits an enemy the enemy is destroyed
- When an enemy hits the player the gunship is destroyed (and the game is over).

In order to do this we need to go through the list of enemies and check to see if they collide. If two of our sprites overlap we consider that a collision has occured. So we can write the outline of our collision detection as follows:

```javascript
	enemies.forEach(function(nme){
		bullets.forEach(function(bullet) {
			if ( overlap(bullet, nme) ) {
				alert("Bullet kills enemy");
			}
		});
		
		if ( overlap(playerSprite,nme) ) {
			alert("Player dies!!");
		}
	});
```

So now all we need to do it write a function called ```overlap``` to check if the two objects overlap and our collision detection is complete. This function should return the value true if the two objects overlap and false otherwise.

```javascript
	function overlap( s1, s2 ) {
	
	}
```

Our overlap function looks at the two objects as boxes and checks that the lines outlining these boxes don't intersect. So we need to find the addresses of the lines that represent the outline of the box.
```
	// For simplicity we calculate the lines surrounding each of the sprites.
	var s1_lines = { top : s1.getPosition().top, bottom: s1.getPosition().top+s1.getSize().h,
					 left: s1.getPosition().left, right: s1.getPosition().left + s1.getSize().w };
	var s2_lines = { top : s2.getPosition().top, bottom: s2.getPosition().top+s2.getSize().h,
					 left: s2.getPosition().left, right: s2.getPosition().left + s2.getSize().w };
```

Now we can construct an expression that returns true or false depending on whether the two boxes defined by the lines overlap or not. The boxes overlap if the following expression is true:
```javascript
	// Check top left and right corners against the 4 sides of s2
	((s1_lines.top >= s2_lines.top && s1_lines.top <= s2_lines.bottom &&
		((s1_lines.left >= s2_lines.left && s1_lines.left <= s2_lines.right) ||
		 (s1_lines.right >= s2_lines.left && s1_lines.right <= s2_lines.right))) ||
	// Check bottom left & right corners of s1 against 4 sides of s2
	(s1_lines.bottom >= s2_lines.top && s1_lines.bottom <= s2_lines.bottom && 
		((s1_lines.left >= s2_lines.left && s1_lines.left <= s2_lines.right) ||
		 (s1_lines.right >= s2_lines.left && s1_lines.right <= s2_lines.right))));
```
We can simply return the value of this expression from our overlap function. So the finished function looks like this:
```javascript
	function overlap( s1, s2 ) {
		// For simplicity we calculate the lines surrounding each of the sprites.
		var s1_lines = { top : s1.getPosition().top, bottom: s1.getPosition().top+s1.getSize().h,
		                 left: s1.getPosition().left, right: s1.getPosition().left + s1.getSize().w };
		var s2_lines = { top : s2.getPosition().top, bottom: s2.getPosition().top+s2.getSize().h,
		                 left: s2.getPosition().left, right: s2.getPosition().left + s2.getSize().w };
		

		// Check top left & right corners of s1 against 4 sides of s2
		return	((s1_lines.top >= s2_lines.top && s1_lines.top <= s2_lines.bottom &&
			  ((s1_lines.left >= s2_lines.left && s1_lines.left <= s2_lines.right) ||
			   (s1_lines.right >= s2_lines.left && s1_lines.right <= s2_lines.right))) ||
			// Check bottom left & right corners of s1 against 4 sides of s2
			(s1_lines.bottom >= s2_lines.top && s1_lines.bottom <= s2_lines.bottom && 
			  ((s1_lines.left >= s2_lines.left && s1_lines.left <= s2_lines.right) ||
			   (s1_lines.right >= s2_lines.left && s1_lines.right <= s2_lines.right))));
	}
```

Now if we reload our game and move the player in front of the enemy sprite, when the two meet we should see the message "Player dies!!" appear in an alert box. 

Reload the game again and this time shoot the enemy sprite. When the bullet hits the sprite the message "Bullet kills enemy" should appear in the alert box.

Now we just need to do something useful (rather than issue an alert message) when these collisions are detected.

###Making things go BOOM!
Instead of simply issuing an alert message when a bullet hits an enemy we want to:
- Create an explosion at the point of impact
- Remove the enemy that is hit
- Remove the bullet that hit the enemy

Of course we can have several explosions going on at the same time. So we are going to need a container to manage them. Just like the bullets and the enemies we use an array to store references to the explosions that are live. So just below where we created the array to manage the bullets we add the following lines:
```javascript
	// Manage explosions
	var explosions = [];
```

Now we will write a function that we can call to create an explosion at a given point:
```javascript
	function createExplosionAt( top, left ) {
		var boom = new Sprite(imageCache.get("images/sprites.png"),116,0,39,39,4,[0,1,2,3,4,5,6,7,8,9,10,11],'horizontal',true);
		boom.setPosition(top,left);
		return boom;
	}
```

As you can see this function returns a reference to the explosion object created. So we replace the alert that we show when a bullet hits an enemy with the following:
```javascript
	explosions.push(createExplosionAt(bullet.getPosition().top, bullet.getPosition().left));
```

Of course this will only create an explosion - the bullet and the enemy will continue their progress across the canvas. We need to find a way to remove these from the game.

If you recall our Sprite object has an internal variable (done) that it uses to determine when the sprite is finished rendering. We already use this in the renderSprites function to remove the sprite from the display. Wouldn't it be handy if we could flag these sprites as 'done' when they've been blown up.

We can allow a client class to change this value by adding the following lines to the ```Sprite``` class in ```Sprite.js```,
```javascript
	this.setDone = function( status ) {
		done = status;
	}
```

So now we can call this method for each of the sprites that are to be removed from the game when we drop the explosion. We can revise our Overlap check as follows:
```javascript
	if ( overlap(bullet, nme) ) {
		bullet.setDone(true);
		nme.setDone(true);
		explosions.push(createExplosionAt(bullet.getPosition().top, bullet.getPosition().left));
	}
```

Re-running the game now we would expect to see our Enemy and the Bullet disappear when the explosion occurs. If you try it you will find that this isn't the case!! The reason why is that the ```done``` variable is re-evaluated each time the Sprites ```update``` function is called. Observe the following line at the end of the ```update``` function in Sprite.js
```javascript
	done = once && moveFrames > frameSet.length;
``` 

Regardless of what the current value of ```done``` is it will be reset on this line. This means that if the sprite is in the middle of the screen this line will change the value of ```done``` so that the sprite is nolonger ```done```.

We need to change this so that if this variable already has a value of ```true``` then we don't change that. We could do that by adding an ```if``` statement in front of this line as follows:
```javascript
	if ( !done ) {
		done = once && moveFrames > frameSet.length;
	}
```

Alternatively we could use a simple logic evaluation as follows:
```javascript
	done = done || once && moveFrames > frameSet.length;
```

Of course this last option can be further abbreviated by using the ```|=``` operator as follows:
```javascript
	done |= once && moveFrames > frameSet.length;
```

So we can solve this bug by the simple addition of a vertical bar operator in front of the equals sign on this line.

Once you've made the above change you should find that the enemy and the bullet will disappear when the explosion is created.

While here it was brought to my attention that there is another bug here. This logic enables one additional iteration of frames which results in an additional frame being rendered. This is noticed if you look at an explosion. After the explosion is complete it renders the first frame again before terminating the animation. We can solve this (almost imperceptible) but by changing this line again as follows:
```javascript
	done |= once && moveFrames >= frameSet.length;
```
By making it finish the animation when the number of frames moved is greater than *or equal to* the number of frames in the frameset we terminate it correctly. Previously it wouldn't terminate until the number of frames exceeded the number of frames in the set which meant that it rendered an additional frame.

### Adding more enemies
Various strategies can be used to determine how often enemies are added to our game. We're going to adopt a simple strategy of a setting a finite maximum number of enemies that can be in play and starting with a fraction of that number and ramping up the number of enemies to this maximum as the game progresses. To implement this we have a single function that returns an array of enemies that are being created called `addEnemies`. The strategy is implemented in this function making it easy to try different ways of generating enemies as the game progresses.

Once this function exists we call it at each game step to see if more enemies should be added. Let's add a line to our game step to populate the enemies array.
```javascript
		gameClock.registerStep(function(framesElapsed,curFrameNo) {
			Array.prototype.push.apply(enemies,addEnemies());
			...
		}
```

The array of enemies generated by ```addEnemies``` is added into the enemies array which will be managed by the game engine. So now we just need to write the ```addEnemies``` function.

```javascript
function addEnemies() {
	
}

Since our strategy is going to progressively generate more enemies according as the game progresses we need to track how long the game is running. To so this we create a var called `gameStartTime` up near the rest of our game variables to store the game startup time.
```javascript
	var explosions = [];
	var gameStartTime = 0;
```

and at the beginning of the init function we store the game startup time to this variable.
```javascript
	this.init = function() {
		gameStartTime = Date.now()
		...
	}
```

Now back to our addEnemies function where we calculate how long the game is running.
```javascript
	function addEnemies() {
		var elapsedTimeMillis = Date.now() - gameStartTime;
		...
	}
```

We start with a difficulty level of 0.05 and every 10 seconds we increase this by 0.05. We use this difficulty to calculate the number of enemies that should be on-screen at any given time. We create 4 variables to store these parameters so that we can change them easily. Add these variables under the gameStartTime variable:
```javascript
	var ENEMY_ADDITION_INCREMENT = 0.05;// Every time we ratchet up the level this specifies how much we increment by
	var initialAdditionRate = 0.05;		// Initial rate for adding enemies.
	var MS_PER_INCREMENT = 15000;		// Ratchet up the level every 15secs.
	var MAX_ENEMIES = 100;
```

Now back to our ```addEnemies``` function we work out the current difficulty level based on the elapsed time using these variables as follows:
```javascript
	function addEnemies() {
		var elapsedTimeMillis = Date.now() - gameStartTime;
		var currentLevel = Math.min(initialAdditionRate + ( ENEMY_ADDITION_INCREMENT * Math.floor(elapsedTimeMillis / MS_PER_INCREMENT)),1);
		...
	}
```
Use this to calculate the number of enemies that should be on screen:
```javascript
			var currentMaxEnemies = Math.floor(MAX_ENEMIES * currentLevel);
```

Then we calculate how many we need to create considering the number of enemies currently on screen:
```javascript
		var numToCreate = currentMaxEnemies - enemies.length;
		if (numToCreate < 0) numToCreate = 0;	// Shouldn't be needed, but just to be safe
```
Now we create that number of enemies and put them in an array to be returned:
```javascript
		var newEnemies = [];
		while(numToCreate-- > 0) {
			newEnemies.push(createEnemySprite());
		}
		return newEnemies;
```
## Some finishing touches
At this stage we've got the heavy lifting done. There's a couple of more things we need to add:
- When the player is destroyed we want to stop the game.
- According as we destroy enemies we want to keep score.
Let's start with keeping score:
### Keeping score
As the game progresses we want to display the score. The score should be updated each time an enemy is destroyed. To do this we're going to update the look of our game a little bit. We modify the HTML to display the score.
```html
	<body>
		<div id="canvasTop">
			SCORE: <div class="setInline width50" id="scoreDiv">0</div>
		</div>
		<div id="gameDiv">
			<canvas id="gameCanvas" width='512' height='480'/>
		</div>
	</body>
```
We have introduced a new div called ```scoreDiv``` which we will update with the score as the game progresses.

And we add a little bit of styling to change the look:
```css
body {
	background-color: black;
	font-family: 'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace;
	font-style: normal;
	font-variant: normal;
	font-weight: bold;	
}

#gameDiv {
 	margin-left: auto;
	margin-right: auto;
	width: 512px;
	height: 480px;
}

#gameCanvas {
	border: 2px solid gray;
	z-index: 1;
}

#canvasTop {
	margin-top: 40px;
	width: 512px;
	text-align: right;
	margin-left: auto;
	margin-right: auto;
	color: green;
	font-size: 24px;
}

.setInline {
	display: inline-block;
}

.width50 {
	width: 50px;
}
```

Now we introduce a new concept - event listeners. A listener is a function that is called when specific events happen in the browser. Listeners exist which allow a developer to take action when the browser is resized, when a page is loaded, etc. We are going to do the same thing in our game - we're going to generate an event every time an enemy is destroyed and support listeners for that event which will update the score.

To start with we need storage for our listeners. We could have many objects that are interested in the same event so we want to support multiple listeners. So let's add another variable to the gameEngine which will store references to callback functions. So create a new variable just above where the keyStatusMap is defined as follows:

```javascript
	...
	// An array that we use to store a set of callbacks for events
	var scoreEventListeners = [];

	var keyStatusMap = {};
	...
```

Now we add a couple of functions to our game engine to manage the registration of listeners for this event.
```javascript
	this.addScoreListener = function(listener) {
		scoreEventListeners.push(listener);
	}
	
	this.removeScoreListener = function(listener) {
		for(var ix = 0; ix< scoreEventListeners.length; ix++ ) {
			if ( scoreEventListeners[ix] === listener ) {
				scoreEventListeners.split(ix,1);
				break;
			}
		}
	}
```
So now we have an array of listeners to be notified when the score should be changed.

We now write a function that's private to the game engine to call each of these listeners when a score update occurs.
```javascript
	function notifyScoreUpdate( score ) {
		var scoreEvent = { score: score };
		scoreEventListeners.forEach(function(listener) {
			listener(scoreEvent);
		});
	}
```
Every time the score changes we simply call this function passing in the new score. This then calls each of the listeners registered passing in a JSON object which informs the listener of the amount to be added to the score.

Now we simply call this function whenever we destroy an enemy passing in the amount to be added to the score. Find the code where we're checking for bullet hits and modify it to call our notifyScoreUpdate function whenever a bullet hits and enemy:
```javascript
				bullets.forEach(function(bullet) {
					if ( overlap(bullet, nme) ) {
						bullet.setDone(true);
						nme.setDone(true);
						explosions.push(createExplosionAt(bullet.getPosition().top, bullet.getPosition().left));
						notifyScoreUpdate(10);
					}
				});
```

Now we just need to register a listener to use this notifier to maintain the score and update it in the browser.

So edit the gunship.js file and add a variable to get a reference to the div that we're using to display the score.
```javascript
	var scoreDiv = $("#scoreDiv")[0];
```

In the initialisation function we add a var to keep track of the score according as it's updated:
```javascript
	imageCache.ready(function() {
		var score = 0;
		...
```
Finally we register a listener for score update events and use that to update the score variable and the score display:
```javascript
	imageCache.ready(function() {
		var score = 0;
		gameEngine = new GameEngine(gameCanvas, imageCache);
		gameEngine.addScoreListener(function(scoreEvent) {
			score += scoreEvent.score;
			scoreDiv.innerHTML = score;
		});
		...
```

If you run the game now you should see the score update for each enemy destroyed.

## Game Over
Finally we want to do something when the game finishes. We'd like to display a game over message on top of our game canvas and cease the game.

Firstly we define a div to overlay on the game canvas. So modify gunship.html to add in a ```gameOver``` div.
```html
		<div id="gameDiv">
			<div id="gameOver" hidden="true">Game Over</div>
			<canvas id="gameCanvas" width='512' height='480'/>
		</div>
```
And then add a style for this div to make sure that it appears directly over the game canvas.
```css
#gameOver {
	border: 2px solid gray;
	width: 512px;
	height: 480px;
	margin-left: auto;
	margin-right: auto;
	padding-top: auto;
	padding-bottom: auto;
	background-color: gray;
	text-align: center;
	opacity: 0.5;	 
	/*visibility: hidden; */
	position: absolute;
	font-size: 30pt;
	z-index:10;
}
```

Since our game finishes when the player is destroyed we can generate an event that can be published when the game finishes. So just like we did for the score update event we create a game over event.

So we can add a variable containing an array of listeners to be notified when a player is destroyed. In GameEngine.js add the following around where we created the array for the score update event listeners:
```javascript
	...
	// An array that we use to store a set of callbacks for events
	var scoreEventListeners = [];
	// Add an array for done listeners
	var playerDestroyedListeners = [];
	...
```
Now create the methods to add a listener to this array and to notify updates to callers.
```javascript
	this.addPlayerDestroyedListener = function(listener) {
		playerDestroyedListeners.push(listener);
	}
	
	function notifyPlayerDestroyedListeners() {
		playerDestroyedListeners.forEach(function(listener) {
			listener();
		});
	}
```

Now when a player is destroyed we simply call our function to notify the ```playerDestroyedListeners```. Notice how we also added another condition the to the if statement so that this code is only checked as long as the player isn't destroyed.
```javascript
	if ( !playerSprite.isDone() &&  overlap(playerSprite,nme) ) {
		playerSprite.setDone(true);
		explosions.push(createExplosionAt(playerSprite.getPosition().top, playerSprite.getPosition().left));
		notifyPlayerDestroyedListeners();
	}
```

Our last change in this file is to stop the user from moving around an "invisible" player and shooting when the game is over. So we add an if statement around the call to ```checkPlayerActions``` which also watches for when the player sprite is finished:
```javascript
	if ( !playerSprite.isDone() ) {
		checkPlayerActions(framesElapsed);
	}
```

All that remains to do now is to have our game over message display when the player is detroyed. We do this by adding a listener for the GameEngine's playerDestroyed event in Gunship.js as follows. Open Gunship.js and add the following just _before_ the call to gameEngine.init():
```javascript
		gameEngine.addPlayerDestroyedListener(function() {
			$("#gameOver").fadeIn(500);
		});
		gameEngine.init();
```