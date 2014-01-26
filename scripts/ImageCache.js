function ImageCache() {
	// Our imagecache is a javascript object that we are using
	// as a map or dictionary so that we can lookup
	// an object (in this case an Image object) based on
	// a string (in this case the url to the image).
	var imageCache = {};
	// we store an array of ready functions and execute all
	// of them once all of the images have loaded.
	var readyFunctions = [];
	
	// Keep track of the number of images we need to load
	var numImagesToLoad = 0;
	// Keep track of the number of images actually loaded
	var numImagesLoaded = 0;

	// This function loads an array of images. Each image 
	// is specified as a Url
	this.load = function( arrOfUrls ) {
		arrOfUrls.forEach(function(url) {
			loadOne(url);
		});
	};
	
	function loadOne(url) {
		numImagesToLoad++;	// numImageToLoad = numImagesToLoad+1;
		var imageToLoad = new Image();
		imageToLoad.onload = function() {
			// Store a reference to the image loaded into
			// our image cache to that it can be accessed
			// by the get method
			imageCache[url] = imageToLoad;
			numImagesLoaded++;		// another one loaded
			if ( numImagesToLoad == numImagesLoaded ) {
				// Use the array forEach function to go
				// through all the elements in the array
				// of ready functions calling each one in turn
				readyFunctions.forEach(function(readyFn){
					readyFn();
				});
			}
		};
		// This line starts the loading of the image 
		imageToLoad.src=url;
	}
	
	// This function will return one of the loaded images
	// from it's internal cache of images.
	this.get = function(imageToGet) {
		return imageCache[imageToGet];
	};
	
	// This function allows the caller to specify a function
	// to be called when all of the images specified in the
	// load function have been loaded.
	this.ready = function( functionToRun ) {
		//readyFunctions[readyFunctions.length] = functionToRun;
		readyFunctions.push(functionToRun);
	};
}