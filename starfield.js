var makeStarField = function(count)
{
	var sortfunction = function(a,b){
		return b.polar.hyp() - a.polar.hyp();
	};
	var stars = [];
	var length = count;
	while( length-- > 0 )
	{
		var s = makeStar();
		stars.push(s);
	}
	return function( context, width, height ) {

		stars.sort(sortfunction);
		for( var i = 0; i<stars.length; i++ )
		{
			stars[i].draw(context,width,height);
		}
	};
};

var makeColorer = function( visible, gone )
{
	var k = -255/(gone-visible);
	var m = 255 - k*visible;
	return function( distance ) {
		if( distance < visible )
			return 255;
		if( distance > gone )
			return 0;
		return Math.floor(k*distance+m);
	};
};

var setifundefined = function( object, name, value )
{
	if( object[name] === undefined )
		object[name] = value;
};

var combiner = function(c,r,g,b)
{
	return "rgb(" + c*r + "," + c*g + "," + c*b + ")";
};

var makeStar = function( stardata, settings )
{
	if( stardata === undefined )
		stardata = {};
	if( settings === undefined )
		settings = {};

	setifundefined( stardata, "starsize", 3 );
	setifundefined( stardata, "colorredbias", Math.random() );
	setifundefined( stardata, "colorbluebias", Math.random() );
	setifundefined( stardata, "colorgreenbias", Math.random() );
	setifundefined( stardata, "starheight", Math.random() );
	setifundefined( stardata, "startposition", Math.random()+0.1 );
	setifundefined( stardata, "rotationspeed", (Math.random() - 0.5) * 0.005 );
	setifundefined( stardata, "starspeed", Math.random() / 1000 + +.01 );
	setifundefined( stardata, "startangle",  Math.random() * 2 * Math.PI );

	setifundefined( settings, "colorminposition", .3 );
	setifundefined( settings, "colormaxposition", .95 );
	setifundefined( settings, "viewportheight", .5 );
	setifundefined( settings, "viewportposition", .15 );
	setifundefined( settings, "maxstarheight", 0.9 );

	var colorer = makeColorer( settings.colorminposition*Math.sqrt(2), settings.colormaxposition*Math.sqrt(2) );

/*	var angle = stardata.startangle;

	var actualmaxstarheight = ( settings.viewportheight / settings.viewportposition ) * settings.maxstarheight;
	var height = actualmaxstarheight*stardata.starheight;

	var xcoord = 0;
	var ycoord = 0;
	var zcoord = stardata.startposition;

	var color = combiner(1000);
	var distsqare = dist*dist;
	var lll =Math.sqrt( zcoord*zcoord + distsqare )
	var calc = setcolor( lll );

	var star =
	{
		x: function()
		{
			return xcoord - (side/2) + 0.5;
		},
		y: function()
		{
			return ycoord -(side/2) +0.5;
		},
		z: function()
		{
			return lll;
		},
		drawsize: function()
		{
			return stardata.size * ( settings.viewportposition / lll );
		},
		color: "black"
	};

	var transform = function()
	{
		zcoord-=0.001;
		angle += stardata.rotationspeed;

			angle += speed;
		else angle -= speed;
		if( zcoord < 0 )
			zcoord = 1;

		var fovheight = (dist/zcoord) * settings.viewportposition;
		if(fovheight < settings.viewportheight)
		{
			lll =Math.sqrt( zcoord*zcoord + distsqare )
			calc = setcolor( lll );
			side = Math.ceil( (calc) / 70 ) + 3;
			color = combiner(
				calc,
				stardata.colorredbias,
				stardata.colorgreenbias,
				stardata.colorbluebias
			);

			xcoord = Math.floor( fovheight * Math.cos(angle) );
			ycoord = Math.floor( fovheight * Math.sin(angle) );
			show = true;
		}
		else show = false;
	};
	};*/
	var polar = {
		angle: stardata.startangle,
		depth: stardata.startposition,
		_length: null,
		length: function(){
			if(this._length === null )
				this._length = stardata.starheight * settings.viewportposition / this.depth;
			return this._length;
		},
		_hyp: null,
		hyp: function(){
			if(this._hyp===null)
				this._hyp= Math.sqrt(this.depth*this.depth + stardata.starheight*stardata.starheight);
			return this._hyp;
		}
	};

	var tick = function(){

		polar.angle += stardata.rotationspeed;
		if( polar.angle < 0 )
			polar.angle += 2*Math.PI;
		else if( polar.angle > 2 * Math.PI )
			polar.angle -= 2*Math.PI;

		polar.depth -= stardata.starspeed;
		if( polar.depth < 0 )
			polar.depth += 1;
		else if( polar.depth > 1 )
			polar.depth -= 1;
		polar._hyp = null;
		polar._length = null;
	};
	var color = function(){
		var val = colorer(polar.hyp());
		return combiner(val,stardata.colorredbias,stardata.colorgreenbias,stardata.colorbluebias);
	};
	var starsize = function(){
		return stardata.starsize;
	};
	var cartesian = {
		x: function(){
			return polar.length() * Math.cos( polar.angle )
		},
		y: function(){
			return polar.length() * Math.sin( polar.angle )
		}
	};
	return {
		draw: function(context, canvaswidth, canvasheight) {
			tick();
			context.fillStyle = this.color();
			if( polar.length() < Math.sqrt(2) )
				context.fillRect(
					Math.floor((cartesian.x()+0.5)*canvaswidth),
					Math.floor((cartesian.y()+0.5)*canvasheight),
					starsize(),starsize());
		},
		cartesian: cartesian,
		polar: polar,
		color: color,
		tick : tick,
		starsize: starsize
	};
};

