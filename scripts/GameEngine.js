function GameEngine(gameCanvas, imageCache) {
	// Store the parameters passed in here in case we need them later.
	var theCanvas = gameCanvas;
	var theImages = imageCache;
	
	var canvasHeight = theCanvas.clientHeight,
		canvasWidth  = theCanvas.clientWidth;
		
	var MOVE_PIXELS = 3;
	var BULLET_SPEED = 5;
    var KEY_REPEAT_DELAY = 250;     // Milliseconds between registered keypresses
	// Get the drawing context that we're going to use to draw on our game surface.
	var drawCtx = theCanvas.getContext("2d");
	
	// The game will need a game clock - so create it here.
	var gameClock = new GameClock();
	
	var playerSprite = createPlayerSprite();
	// Interrogate the playersprite to find out it's width and height.
	var playerWidth = playerSprite.getSize().w;
	var playerHeight = playerSprite.getSize().h;
	
	// We're going to have a lot of enemy sprites so array
	var enemies = [];
	// Just like the enemies, we can have a lot of bullets on screen.
	// Manage these here.
	var bullets = [];
	
	// We only need to create the pattern once so do it when we initialise the game engine.
	var pattern = drawCtx.createPattern(imageCache.get('images/terrain.png'),"repeat");
	// The fill style isn't going to change throughout our game.
	drawCtx.fillStyle = pattern;
	
	var keyStatusMap = {};
    var keyHitTime = {};
	
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
			var ix = 0;
			// Turn forEach statment below into code for the below loop so that we can 
			// remove completed sprites from the array as we process it.
			renderSprites(enemies, framesElapsed);
			if ( bullets.length > 0 ) {
				renderSprites(bullets, framesElapsed);
			}
			
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
			
			
		});
		gameClock.start();
	}
	
	// This function is used to detect overlaps between sprites. Returns true if the sprites overlap and false
	// otherwise.
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
			// Check bottom left & rihgt corners of s1 against 4 sides of s2
			(s1_lines.bottom >= s2_lines.top && s1_lines.bottom <= s2_lines.bottom && 
			  ((s1_lines.left >= s2_lines.left && s1_lines.left <= s2_lines.right) ||
			   (s1_lines.right >= s2_lines.left && s1_lines.right <= s2_lines.right))));
	}
	
	// For each set of sprites that we need to render we 
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

		if ( keyStatusMap["SPACE"] && checkKeyHitDelay("SPACE", KEY_REPEAT_DELAY)) {
			// Create the bullet sprites.
			bullets = bullets.concat(createBulletSprites());
		}
	}

    // This function returns a value of true or false depending on whether the required period has elapsed since the last time
    // a keypress was recognised.
    function checkKeyHitDelay(keyName, delay) {
        // See if we have recorded a hit time for this key already - if not then set the hist time as zero.
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
	
	function createEnemySprite() {
		var s = new AutoSprite(-1.66,'horizontal',imageCache.get('images/sprites.png'),0,78,80,39,10,[0,1,2,3,2,1],'horizontal');
		var left = canvasWidth - 5;   // Left most part of sprite is 5px from RHS
		var top = Math.min(Math.random()*canvasHeight, 
								canvasHeight - s.getSize().h);
		s.setPosition(top,left);
        s['getType'] = function() {return "ENEMY";};
		return s;
	}
	
	function createPlayerSprite() {
		var s = new Sprite(imageCache.get('images/sprites.png'),5,0,39,25,10,[0,1]);
		var top = Math.floor((canvasHeight - 39)/2);
		s.setPosition(top,0);
        s['getType'] = function() {return "PLAYER";};
		return s;
	}
	
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

        forward['getType'] = up['getType'] = down['getType'] = function() {return "BULLET";};

		return [forward,up,down];
	}
}