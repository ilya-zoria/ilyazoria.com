$(document).ready(function() {

	//hero canvas
	var canvas, ctx, settings, landmarks = [], particles = [];

	var ww, wh, HSLshade = 0;

	/* Settings */

	settings = {

		line: {
			width: 1,
			distance: 15,
			color: '#EFEFEF'
		},

		clear: {
			color: '#202124',
			persistence: 0.3
		},

		landmark: {
			color: '#9094A1',
			w: 1,
			h: 1,
			left: 14,
			right: 14,
			top: 14,
			bottom: 14
		},

		particle: {
			length: 100,
			w: 1,
			h: 1,
			color: '#D0D0D0'
		}

	}

	/* Init */

	function init(){

		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		window.onresize = resize;

		resize();
		createParticles(settings.particle);
		update();

	}

	/* Event Handlers */

	function resize() {

		// get window geometry

		ww = window.innerWidth;
		wh = 1000;

		// set canvas size

		canvas.width = ww;
		canvas.height = wh;

		// create Landmarks

		createLandmarks(settings.landmark);

	}

	/* CREATE */

	function createParticles(s){

		// clear particles

		particles = [];

		// create particles points

		var i = s.length;

		while (i--){

			var x = Math.random() * ww,
				y = Math.random() * wh,
				c = s.color,
				p = new point(s, x, y, c);

			particles.push(p);
		}

	}

	function createLandmarks(s){

		// clear landmarks

		landmarks = [];

		// create landmarks points vertically

		var iy = Math.ceil(wh / (s.top + s.h + s.bottom)),
			ix = rix = Math.ceil(ww / (s.left + s.w + s.right));

		while (iy--){
			while (ix--){

				var x = (ix * (s.left + s.w + s.right)) + s.left,
					y = (iy * (s.top + s.h + s.bottom)) + s.top,
					c = s.color,
					p = new point(s, x, y, c);

				landmarks.push(p);

			}
			ix = rix;
		}

	}

	/* DRAW */

	function drawLandmarks(s){

		ctx.save();

		var i = landmarks.length;
		while (i--){ landmarks[i].draw(); }

		ctx.restore();
	}

	function drawParticles(s){

		ctx.save();

		var i = particles.length,
			j = rj = landmarks.length,
			distanceLimit = settings.line.distance;

		while (i--){

			var p = particles[i],
				receiver = null;

			p.animate();
			p.draw();

			while (j--){

				var l = landmarks[j],
					distance = Math.sqrt( Math.pow((p.x - l.x), 4) + Math.pow((p.y - l.y), 4) );

				if (distance < distanceLimit){
					receiver = l;
				}

			}

			if (receiver){
				drawLinks(settings.line, p.x, p.y, receiver.x, receiver.y);
			}

			j = rj;

		}

		ctx.restore();
	}

	function drawLinks(s, startX, startY, endX, endY){

		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(endX, endY);
		ctx.lineWidth = s.width;
		ctx.strokeStyle = s.color;
		ctx.stroke();
		ctx.closePath();

	}

	function drawClear(s){
		ctx.save();
		ctx.globalAlpha = 1 - s.persistence;
		ctx.fillStyle   = s.color;
		ctx.fillRect(0, 0, ww, wh);
		ctx.restore();
	}


	// function setRandomColor(){
	//
	// 	HSLshade++;
	//
	// 	settings.line.color = 'white'
	//
	// 	if (HSLshade == 360){
	// 		HSLshade = 0;
	// 	}
	// }

	/* RENDER */

	function render(){
		drawClear(settings.clear);
		drawLandmarks(settings.landmark);
		drawParticles(settings.particle);
		// setRandomColor();
	}

	function update(){
		window.requestAnimationFrame(update);
		render();
	}

	/* ITEMS */

	var point = function(s, x, y, c){

		this.w = s.w;
		this.h = s.h;

		this.speedX = Math.random() * 2 - 1,
		this.speedY = Math.random() * 2 - 1,

		this.x = x;
		this.y = y;
		this.color = c;

		this.animate = function(){

			// inc

			this.x += this.speedX;
			this.y += this.speedY;

			// limit

			if (this.x < 0){ this.x = ww; }
			else if (this.x > ww){ this.x = 0; }

			if (this.y < 0){ this.y = wh; }
			else if (this.y > wh){ this.y = 0; }
		}

		this.draw = function(){
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.closePath();
		}

	}

	/* */

	init();


});
