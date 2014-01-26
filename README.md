Gunship

This project demonstrates several key features that are useful when writing applications in JavaScript:
- The use of sprites to create animated images
- The use of the HTML5 Canvas element
- Object oriented methods of building the game.
- Extensive use of JSON syntax.
- Some useful mathematical constructs for managing games

The Game
========
The game we are building is a simple shooter game. We have a helicopter gunship that tries to stem the
tide of invading bugs. The Gunship has the advantage that it can shoot bullets in three directions simultaneously:
up, down, and forward. The gunship can move in all four directions.

There is a steady stream of bugs and they are added to the game faster as the game progresses.

We start off by deciding what the core objects of our game will be.

Then we start building the game with a blank HTML5 Canvas that we paint with the terrain.

Week 1
======== 
First of all we identify some of the objects that we will need to build to complete this game.
The list we came up with was:
- The Gunship (this will be the player)
- Enemies - the swarm of bugs
- Bullets
- Explosions
One other less obvious object is that something needs to co-ordinate the activities of all of 
the objects. Some games call this the Game Artificial Intelligence. In our case we'll simply call 
it the Game Engine.

We created a simple HTML page with a single div containing a HTML canvas element.
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

We then styled the page to position the div in the middle of the page with a size of 512px x 480px.
Hence the reference to css/gunship.css in the HTML file.

Then we created a javascript file, gunship.js, in which we included the startup code for our application
using a typical jQuery initialisation.
	$(document).ready(function() {
	});
	
We then use this to get a reference to the canvas:
	var gameCanvas = $("#gameCanvas")[0];

We use this to obtain a reference to the drawing object which will allow us to draw on this canvas.
	var drawCtx = gameCanvas.getContext("2d");
	
We then use an image object to load the image we're going to use to draw the pattern for the terrain background.
	var img = new Image();
	img.src = "images/terrain.png";

Since the images load in the background we need to wait until the image is loaded before we can use this image
in our code. To do this we use the onload event of the image to tell us when the image is finished loading.
	img.onload = function() {
		var pattern = drawCtx.createPattern(img,'repeat');
		drawCtx.fillStyle = pattern;
		drawCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
	};

Finally we add the jQuery and gunship javascript files to the HTML file so that they will execute.
<head>
	<script src="scripts/jquery-1.10.2.min.js" type="text/javascript"></script>
	<script src="scripts/Gunship.js" type="text/javascript"></script>
</head>

OK! So we have painted our background for the game. However we're going to need to load other images for this game.
It's going to be tedious to have to set an onload function on every image we load and then find a way to string them all
together before we start our game.

How about we build our own solution to this problem. We can start by saying to ourselves "Wouldn't it be great if there
was a JavaScript class that we can use to load all of the images that we will need for our game at once and then notify
us when they're all loaded?"

Let's explore what we would expect of such a class.
- It should allow us to specify a list of images file to be loaded
- It should allow us to retrieve each of the images loaded by name
- It should notify us when all of the images are loaded.

So if we re-write our the image loading code in gunship.js as if this class existed it might look something like this.
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

So from this we see that our ImageCache class needs to implement three methods:
	- get(imageName) - Get an image from the image cache
	- load(arrOfUrls) - load an array of images, each specified by it's url.
	- ready(readyFunction) - provide a function to be called when all of the images have loaded.
	
So now we're going to create our ImageCache class.
First we create a file called ImageCache.js in the scripts directory (with the other javascript files).
Then we add the following script reference to the gunship.html file so that our new class is loaded into the project:
	<script src="scripts/ImageCache.js" type="text/javascript"></script>
	
Now we start a new class in our ImageCache.js by putting in the following:
	function ImageCache() {
	}
	
Now we create stubs for the three methods we need to implement:

	this.get = function(imageName) {
	};
	
	this.load = function(arrOfUrls) {
	};
	
	this.ready = function(readyFunction) {
	};
	
Let's implement these three methods starting with the get method:
For the get method to work we need to maintain a mapping of the image names to the actual
image objects. We can so this using a javascript object but by treating it like an array.
So we create a javascript object at the top of our ImageCache class using JSON notation like this:

	var imageCache = {}; // Note the curly braces used for this declaraton - not to be confused with
						 // array notation which uses square brackets.

So now we can implement our get method as follows:

	this.get = function(imageName) {
		return imageCache[imageName];
	};
	
Next we implement our ready method. This method needs to store a reference to the function provided so that 
it can be called when all of the images are loaded. We use a javascript array to store an array of all of 
these ready functions. So we put the following declaration at the top of our ImageCache class:

	var readyFunctions = [];		// Note square brackets used for an array.
	
Now each time the ready method is called we just store a reference to this function in the array. So
we can implement the ready function as follows:

	this.ready = function(readyFunction) {
		readyFunctions.push(readyFunction);
	};
	
We now have two of the three methods implemented. Just one left to implement - the load method.

We're providing an array of image names. We can make life easier for ourselves by just dealing
with these one at time by taking advantage of the forEach method of the javascript array object.
The forEach method accepts a reference to a function and calls that function passing in a reference
to the current element of the array as it goes through it. So our load function looks like this:

	this.load = function( arrOfUrls ) {
		arrOfUrls.forEach(function(url) {
			loadOne(url);
		});
	};

Now we just have to write the loadOne function and we're done. Since the loadOne function isn't 
going to be made available to callers of this class we declare it as a private function (i.e. one
that can only be called from within this class) as follows:

	function loadOne( url ) {
	}

In this function we need to create an image object and set it's src property to the url specified:

	function loadOne(url) {
		var imageToLoad = new Image();
		imageToLoad.src = url;
	}

This will start our image loading. But wait we still have to arrange things so that the ready function 
is called when all of the images are loaded (that's the point of this class after all). To so that we need
to keep track of the number of images that have been requested for loading and the number of images loaded.
So we create to variables in this class to keep track of these as follows:

	var numImagesToLoad = 0;
	var numImagesLoaded = 0;
	
Now each time we request to load an image we add 1 to the value of numImagesToLoad. So our loadOne
function becomes:

	function loadOne(url) {
		numImagesToLoad++;
		var imageToLoad = new Image();
		imageToLoad.src = url;
	}

Now we add an onload function for each image created and use it to check if all the images have loaded.

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

That's it. We now have our ImageCache created.