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
