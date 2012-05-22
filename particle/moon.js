var makeScaler = function()
{
	return {
		dist: function( x ){ return x; },
		time: function( t ) { return t/10000; }
	};
};
var vec = function vec( par )
{
	if( par === undefined )
		par = {};

	var _x = par.x || 0;
	var _y = par.y || 0;
	var _z = par.z || 0;
	var num = function( i ) {
		var tmp = i*100;
		return Math.floor( tmp ) / 100;
	};

	var abs = undefined;

	return {
		x: function(){return _x;},
		y: function(){return _y;},
		z: function(){return _z;},
		abs: function()
		{
			if( abs === undefined )
			{
				abs = Math.sqrt( _x*_x + _y*_y + _z*_z );
			}
			return abs;
		},
		dot: function( v ) { return _x* v.x() + _y* v.y() + _z* v.z(); },
		cross: function( v ) { return vec({
			x:_y* v.z()-_z* v.y(),
			y:_z* v.x()-_x* v.z(),
			z:_x* v.y()-_y* v.x()
		});
			},
		mul: function( scal ) {
			return vec( {x:scal*_x,y:scal*_y,z:scal*_z} );
		},
		add: function( v ) {
			return vec({x:v.x()+_x,y:v.y()+_y,z:v.z()+_z});
		},
		sub: function( v ) {return vec({x:v.x()-_x,y:v.y()-_y,z:v.z()-_z}); },
		info: function() { return "[ "+num(_x)+", "+num(_y)+", "+num(_z)+" ]";}
	};
};

var makeMoon = function()
{
	var radius = 10;
	var position = vec();
	return {
		r: function() {return radius;},
		tick: function(){},
		pos: function() {return position;},
		style: function(){return "white";}
	};
};

var makeView = function(start)
{
	var pos = start;
	var u = vec({x:0,y:1,z:0});
	var v = vec({x:1,y:0,z:0});
	var n = u.cross( v );

	var fov = 200;

	return {
		tick: function(){ /* move viewport */ },
		u: function() { return u; },
		v: function() { return v; },
		n: function() { return n; },
		pos: function() { return pos; },
		draw: function( context, obj )
		{
			var p = obj.pos().sub( this.pos() );
			var ndist = p.dot( this.n() );
			if( ndist > 0 )
			{
				var x = p.dot( this.u());
				var y = p.dot( this.v());
				var cx = (x*ndist) / (ndist+fov);
				var cy = (y*ndist) / (ndist+fov);

				if( cx < fov && cy < fov && cx >= 0 && cy >= 0 )
				{
					context.fillStyle = obj.style();
					context.beginPath();
					context.arc( x,y,obj.r(),0, Math.PI*2, true);
					context.fill();
				}
			}
		}
	};
};

var makeParticle = function()
{
	var position = vec({x:-50,y:-30,z: 0});
	var velocity = vec({x:1,y:1,z:-1});
	return {
		pos: function() { return position; },
		tick: function(dt) {
//			position = position.add( velocity.mul(dt) );
			position = vec( {
				x: Math.sin(dt*2*Math.PI)*30,
				y:Math.sin(dt*2*Math.PI)*40,
				z:Math.cos(dt*2*Math.PI)*60});
		},
		r: function(){ return 5;},
		style: function(){return "#77F"}
	};
};

var makeMoonSim = function()
{
	var scaler = makeScaler();
	var viewport = makeView(vec({x:200,y:200,z:-80}));
	var part = makeParticle();
	var moon = makeMoon();
	var drawables = [part,moon];
	var lastmark = -1;
	var sortFunction = function(a,b){
		var v1 = b.pos().sub( viewport.pos() ).abs();
		var v2 = a.pos().sub( viewport.pos() ).abs();
		return v1 - v2;
	};

	return function( context, width, height, mark ) {

		if( lastmark < 0 )
			lastmark =mark;
		viewport.tick();
		for( var d in drawables )
		{
			drawables[d].tick( scaler.time(mark) );
		}
		drawables.sort( sortFunction );

		for( var d in drawables )
		{
			viewport.draw( context, drawables[d] );
		}
		document.getElementById("fps").innerText =
			"vp: "+viewport.pos().info() + " n:"+viewport.n().info()+
			"\nm: "+moon.pos().info() +
			"\np: "+part.pos().info();

		lastmark = mark;
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
	setifundefined( stardata, "colorredbias", 1- Math.random()*0.2  );
	setifundefined( stardata, "colorbluebias", 1- Math.random()*0.2 );
	setifundefined( stardata, "colorgreenbias", 1- Math.random()*0.2 );
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

