var vec = function vec( par )
{
	if( par === undefined )
		par = {};

	var _x = par.x || 0;
	var _y = par.y || 0;
	var _z = par.z || 0;

	return {
		x: function(){return _x;},
		y: function(){return _y;},
		z: function(){return _z;},
		mul: function( scal ) { return vec( {x:scal*_x,y:scal*_y,z:scal*_z} ); },
		add: function( v ) { return vec({x:v.x()+_x,y:v.y()+_y,z:v.z()+_z}); },
		sub: function( v ) {return vec({y:v.x()-_x,y:v.y()-_y,z:v.z()-_z}); },
		projectOn: function(plane)
		{
			var c1 =
				(plane.u1().x() * _x) +
					(plane.u1().y() * _y) +
					(plane.u1().z() * _z);
			var c2 =
				(plane.u2().x() * _x) +
					(plane.u2().y() * _y) +
					(plane.u2().z() * _z);

			var p1 = plane.u1().mul(c1);
			var p2 = plane.u2().mul(c2);

			return p1.add( p2 );
		}

	};
};

var plane = function( par )
{
	if( par === undefined )
		par = {};
	var vec1 = par.u || vec();
	var vec2 = par.v || vec();
	var position = par.p || vec();

	var u1 = vec( {x:vec1.x(),y:vec1.y(),z:vec1.z()} );
	var u2 = vec( {x:vec2.x(),y:vec2.y(),z:vec2.z()} );
	return{
		u1: function() {return u1;},
		u2: function() {return u2;}
	};
};

var makeMoon = function()
{
	var radius = 10;
	var position = vec();
	return {
		r: function() {return radius;},
		tick: function(){},
		pos: function() {return position;}
	};
};

var makeView = function()
{
	var projectionplane = plane( {u:vec({x:0,y:1,z:0}), v:vec({x:1,y:0,z:0}),p:vec()} );
	return {
		tick: function(){ /* move viewport */ },
		pl: function() { return projectionplane; }
	};
};

var makeParticle = function()
{
	var position = vec();
	var velocity = vec({x:1,y:1,z:1});
	return {
		pos: function() { return position; },
		tick: function(dt) { position = position.add( velocity*dt ); },
		r: function(){ return 5;}
	};
};

var makeMoonSim = function()
{
	var moon = makeMoon();
	var viewport = makeView();
	var particle = makeParticle();
	var lastmark = -1;

	return function( context, width, height, mark ) {
		if( lastmark < 0 )
			lastmark =mark;
		moon.tick();
		viewport.tick();
		particle.tick( mark-lastmark ); //scale

		var v = particle.pos().sub( viewport.pos() );
		var pv = v.projectOn( viewport.pl() );

		context.beginPath();
//		context.arc( pv.
			//Math.floor((cartesian.x()+0.5)*canvaswidth),
//			Math.floor((cartesian.y()+0.5)*canvasheight),
//			starsize(), 0, Math.PI*2, true);
		context.fill();




		lastmark = mark;
	};
};
var makeInterstellar = function( )
{
	var x, y, z;
	var radii;
}

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

