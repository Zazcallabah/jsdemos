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
	return function( context, width, height, mark ) {

		stars.sort(sortfunction);
		for( var i = 0; i<stars.length; i++ )
		{
			stars[i].draw(context,width,height,mark);
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
	return "rgb(" + Math.round(c*r) + "," + Math.round(c*g) + "," + Math.round(c*b) + ")";
};

var makeStar = function( stardata, settings )
{
	if( stardata === undefined )
		stardata = {};
	if( settings === undefined )
		settings = {};

	setifundefined( stardata, "starsize", 10 );
	setifundefined( stardata, "colorredbias", 1- Math.random()*0.8  );
	setifundefined( stardata, "colorbluebias", 1- Math.random()*0.8 );
	setifundefined( stardata, "colorgreenbias", 1- Math.random()*0.8 );
	setifundefined( stardata, "starheight", Math.random() + 0.3 );
	setifundefined( stardata, "startposition", Math.random() );
	setifundefined( stardata, "rotationspeed", (Math.random() - 0.5) * 0.0007 );
	setifundefined( stardata, "starspeed", Math.random() / 1000  +.0001 );
	setifundefined( stardata, "startangle",  Math.random() * 2 * Math.PI );

	setifundefined( settings, "colorminposition", .2 );
	setifundefined( settings, "colormaxposition", .9 );
	setifundefined( settings, "viewportheight", .5 );
	setifundefined( settings, "viewportposition", .15 );
	setifundefined( settings, "maxstarheight", 0.9 );

	var colorer = makeColorer( settings.colorminposition, settings.colormaxposition );

	var polar = {
		angle: 0,
		depth: 0,
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
	var conformer = function(min,max,diff){
		return function( mark, start ){
			var delta = max-min;
			return (mark*diff + start) % delta;
		};
	};

	var conformdepth = conformer( 0, 1, -1* stardata.starspeed );
	var conformangle = conformer( 0, 2*Math.PI,stardata.rotationspeed);

	var tick = function( mark ){


		polar.angle = conformangle( mark,stardata.startangle );
		//stardata.rotationspeed;
		if( polar.angle < 0 )
			polar.angle += 2*Math.PI;
		else if( polar.angle > 2 * Math.PI )
			polar.angle -= 2*Math.PI;

		polar.depth = conformdepth(mark,stardata.startposition);//stardata.starspeed;
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
		var val = (settings.viewportheight/settings.viewportposition)*polar.depth;
		var ratio = (stardata.starsize/val)*settings.viewportheight;
		return ratio;
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
		draw: function(context, canvaswidth, canvasheight, mark) {
			tick(mark);
			context.fillStyle = this.color();
			if( polar.length() < Math.sqrt(2) )
			{
				context.beginPath();
				context.arc(
					Math.floor((cartesian.x()+0.5)*canvaswidth),
					Math.floor((cartesian.y()+0.5)*canvasheight),
					starsize(), 0, Math.PI*2, true);
				context.fill();
			}
		},
		cartesian: cartesian,
		polar: polar,
		color: color,
		tick : tick,
		starsize: starsize
	};
};

