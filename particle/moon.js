var makeRotational = function( theta, type )
{
	var cos = Math.cos(theta);
	var sin = Math.sin(theta);
	if( type === "z" )
	{
		return [
			vec({x:cos,y:sin,z:0}),
			vec({x:-1*sin,y:cos,z:0}),
			vec({x:0,y:0,z:1})];
	}
	else if( type === "y" )
	{
		return [
			vec({x:cos,y:0,z:-1*sin}),
			vec({x:0,y:1,z:0}),
			vec({x:sin,y:0,z:cos})];
	}
	else
	return [
		vec({x:1,y:0,z:0}),
		vec({x:0,y:cos,z:sin}),
		vec({x:0,y:-1*sin,z:cos})];
};

var makeMoon = function()
{
	var position = vec({x:3.62570e8,y:0,z:0});
	var radius = 1.7371e6;
	return {
		r: function() {return radius;},
		tick: function(){},
		pos: function() {return position;},
		style: function(){return "white";}
	};
};
var makeEarth = function()
{
	var position = vec();
	var radius = 6.371e6;
	return {
		r: function() {return radius;},
		tick: function(){},
		pos: function() {return position;},
		style: function(){return "blue";}
	};
};
var makeView = function(start)
{
	var pos = start;
	var u = vec({x:1,y:0,z:0}).unit();
	var v = vec({x:0,y:1,z:0}).unit();
	var n = u.cross( v );

	var fov = 400;

	var rotate = function( rot ) {
		var r1 = u.dot( rot[0] );
		var r2 = u.dot( rot[1] );
		var r3 = u.dot( rot[2] );
		u = vec({x:r1,y:r2,z:r3});

		r1 = v.dot( rot[0] );
		r2 = v.dot( rot[1] );
		r3 = v.dot( rot[2] );
		v = vec({x:r1,y:r2,z:r3});
		n= u.cross( v );
	};

	var movespeed = 1e6;
	var rots = [
		{t:"x",a:73,s:75}, // i k
		{t:"y",a:74,s:76}, // j l
		{t:"z",a:79,s:85}  // o u
	];
var count = 0;
	return {
		rotate: rotate,
		tick: function(keys)
		{
			var moves = [
				{v:n.mul(movespeed),a:87,s:83}, // w s
				{v:u.mul(movespeed),a:68,s:65}, // d a
				{v:v.mul(movespeed),a:81,s:69}  // q e
			];

			var angle = 0.001*2*Math.PI;
			for( var k = 0; k < keys.length; k++ )
			{
				for( var m = 0; m< moves.length; m++ )
				{
					if( moves[m].a === keys[k] )
					{
						pos = pos.add( moves[m].v );
						return;
					}
					if( moves[m].s === keys[k] )
					{
						pos = pos.sub( moves[m].v);
						return;
					}
				}
				for( var r = 0; r < rots.length; r++ )
				{
					if( rots[r].a === keys[k] )
					{
						rotate(makeRotational( angle, rots[r].t ) );
						return;
					}
					if( rots[r].s === keys[k] )
					{
						rotate( makeRotational( -1*angle, rots[r].t ));
						return;
					}
				}
			}
		},
		u: function() { return u; },
		v: function() { return v; },
		n: function() { return n; },
		pos: function() { return pos; },
		draw: function( context, w,h,obj )
		{
			count++;
			var p = obj.pos().sub( this.pos() );
			var ndist = p.dot( this.n() );
			if( ndist > -1*fov )
			{
				var x = p.dot( this.u());
				var y = p.dot( this.v());
				var cx = (x*fov) / (ndist+fov) + w/2;
				var cy = (y*fov) / (ndist+fov) + h/2;

				if( cx < w && cy < h && cx >= 0 && cy >= 0 )
				{
					context.fillStyle = obj.style();
					context.beginPath();
					context.arc( cx,cy,obj.r()*fov/(ndist+fov),0, Math.PI*2, true);
					context.fill();
				}
			}
		}
	};
};

// energy decides particle speed, velocity is only the unit vector for the velocity direction
var makeParticle = function( energy, position, velocity, halt )
{
	var t89c = makeT89C();
	var eV = 1.60218e-19;
	var RE = 6.378e6;
	var c = 3e008;
	var c2 = c*c;
	var q = 1.602e-19;
	var m = 1.6726e-27;
	var style = "#77F";
	var radius = 7e5;


	var E = energy || 3e5*1e6*eV;

	var iopt = 3;
	var ps = 0;
	var parmod = []; // 10
	var emc = (E/(m*c2)+1);
	var absv = c*Math.sqrt( 1 - 1/(emc*emc));
	var g = 1/Math.sqrt(1-(absv*absv)/c2);

	var r = position;
	var v = (velocity || vec({
		x: (Math.random()-0.5),
		y:(Math.random()-0.5),
		z: (Math.random()-0.5)
	}).unit()).mul(absv);
	var p = v.mul(m*g);

	var ef_pos = position;
	var we_are_done = false;

	return {
		pos: function() { return ef_pos; },
		tick: function(dt) {
			if( we_are_done )
			{
				return
			}

			if( halt !== undefined )
			{
				we_are_done = halt( this.pos() );
				if( we_are_done )
				{
					style = "red";
					radius = 1e5;
				}
			}

			var t_b = t89c( iopt,parmod,ps, r.x()/RE, r.y()/RE, r.z()/RE );
			if( t_b.bx === NaN )
				t_b.bx = 0;
			if( t_b.by === NaN )
				t_b.by = 0;
			if( t_b.bz === NaN )
				t_b.bz = 0;
			var B_field = vec({x:t_b.bx,y:t_b.by,z:t_b.bz}).mul( 1e-9 );

			var A = v.mul(q);
			var F = A.cross(B_field);

			p = p.add( F.mul(dt) );
			var pabs = p.abs();
			v = p.mul(1/Math.sqrt(m*m+(pabs*pabs)/c2));
			r = r.add(v.mul(dt) );


			ef_pos = vec({x:r.x(),y:r.y(),z:r.z()});
		},
		r: function(){ return radius;},
		style: function(){return style;}
	};
};

var makeMoonSim = function()
{
	var drawables = [];
	var moon = makeMoon();
	var earth = makeEarth();
	var viewport = makeView(moon.pos().add(vec({x:0,y:0,z:-10e6})));

	for( var i = -100e6; i< 100e6; i+=34e6 )
		for( var j = -100e6; j< 101e6; j+=35e6 )
			for( var k = -100e6; k< 101e6; k+=36e6 )
			{
				var part_pos = moon.pos().add(vec({x:i,y:j,z:k}));
				drawables.push(makeParticle(
					undefined,
					part_pos,
					moon.pos().sub(part_pos).unit(),
					function(p){
					if(p.sub(moon.pos()).abs() < moon.r() )
					{
						return true;
					}
					return p.sub(earth.pos()).abs() < earth.r();


				}));
			}
	drawables.push(moon);
	drawables.push(earth);
	var lastmark = -1;
	var sortFunction = function(a,b){
		var v1 = b.pos().sub( viewport.pos() ).abs();
		var v2 = a.pos().sub( viewport.pos() ).abs();
		return v1 - v2;
	};

	return function( context, width, height, mark, keys ) {

		if( lastmark < 0 )
			lastmark =mark;
		viewport.tick( keys );
		for( var d in drawables )
		{
			drawables[d].tick( (mark - lastmark)/10000 );
		}
		drawables.sort( sortFunction );

		for( var d2 in drawables )
		{
			viewport.draw( context, width,height, drawables[d2] );
		}
		lastmark = mark;
	};
};
