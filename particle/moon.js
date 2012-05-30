var makeInterstellar = function( radius, position, color )
{
	var _radius = radius;
	var _pos = position;
	var _color = color;
	return {
		r: function() {return _radius;},
		tick: function(){},
		pos: function() {return _pos;},
		style: function(){return _color;}
	};
}
var makeSun = function()
{
	return makeInterstellar( 7e8, vec({x:1.496e11,y:0,z:0}), "yellow" );
};

var makeMoon = function()
{
	return makeInterstellar( 1.7371e6, vec({x:-3844e5,y:0,z:0}), "white" );
};

var makeEarth = function()
{
	return makeInterstellar( 6.4e6, vec(), "blue" );
};

var _t89c = makeT89C();
var _RE = 6.378e6;

// energy decides particle speed, velocity is only the unit vector for the velocity direction
var makeParticle = function( energy, position, velocity, halt )
{
	// this whole function is a javascript port of the brilliant work of Emelie Holm. Without her thesis, this simulation would be very boring indeed.
	var eV = 1.60218e-19;
	var c = 3e8;
	var RE = _RE;
	var c2 = c*c;
	var q = 1.602e-19;
	var m = 1.6726e-27;
	var style = "#77F";
	var radius = 6e5;


	var E = (energy  || 1e6)*eV;

	var iopt = 3;
	var ps = 0;
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

			var t_b = _t89c( iopt,[],ps, r.x()/RE, r.y()/RE, r.z()/RE );
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

var setVpMovementActions = function( view )
{
	var movevp = function( vp, direction, multiplier ) {
		vp.moveTo( vp.pos().add( direction.mul( multiplier ) ) )
	};
	var addMoveActions = function( a, s, selector )
	{
		view.addAction( a, function(vp,c){ movevp( vp, selector(vp), 1e6*(c===undefined?1:10) ) } );
		view.addAction( s, function(vp,c){ movevp( vp, selector(vp), -1e6*(c===undefined?1:10) ) } );
	};
	addMoveActions( 87, 83, function(vp){ return vp.n() } ); // w s
	addMoveActions( 68, 65, function(vp){ return vp.u() } ); // d a
	addMoveActions( 81, 69, function(vp){ return vp.v() } ); // q e
	view.addAction( 88, //x
	function(vp){ vp.reset() } );
	var rotatevp = function( vp, angle, about )
	{
		vp.rotate( angle, about );
	};
	var addRotActions = function( a, s, selector)
	{
		var rotatespeed = 0.005*2*Math.PI;
		view.addAction( a, function(vp){rotatevp( vp, rotatespeed, selector(vp) ) } );
		view.addAction( s, function(vp){rotatevp( vp, -1*rotatespeed, selector(vp) ) } );
	};

	addRotActions( 73,75,function(vp){return vp.u() }); //ik
	addRotActions( 74,76,function(vp){return vp.v() }); //jl
	addRotActions( 79,85,function(vp){return vp.n() }); //ou
};

var setParticleControlActions = function( view, drawlist )
{
	var frameTimeStamp = new Date().getTime();
	// stuff already in drawlist are always supposed to be there
	var defaultobjects = [];
	for( var d in drawlist )
	{
		defaultobjects.push( drawlist[d] );
	}
	var moon = defaultobjects[0];
	var earth = defaultobjects[1];	
	// clear all particles.
	view.addAction( 67, // c
	function() {
		drawlist.length = 0;
		for( d in defaultobjects )
			drawlist.push( defaultobjects[d]);
	}); 
	
	// boxed-in moon
	view.addAction( 86, // v
	function(){

		var current = new Date().getTime();
		if( current - frameTimeStamp < 1000 )
			return;
		frameTimeStamp = new Date().getTime();
	for( var i = -300e6; i< 131e6; i+=34e6 )
		for( var j = -100e6; j< 101e6; j+=35e6 )
			for( var k = -100e6; k< 101e6; k+=36e6 )
			{
				var part_pos = moon.pos().mul(0.5).add(vec({x:i,y:j,z:k}));
				drawlist.push( makeParticle(
					1e8,
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
	});
	
	var energies = [1e6,1e7,1e8,1e9,1e4*1e6,1e5*1e6,1e6*1e6];
	var MJ = 3844e5;
	var energycounter = 0;
	var selectenergy = function()
	{
		return energies[energycounter++ % energies.length];
	};
	view.addAction( 78, // n
		function(){

			var current = new Date().getTime();
			if( current - frameTimeStamp < 1000 )
				return;
			frameTimeStamp = new Date().getTime();

			var energy = selectenergy();
			for( var j = 1; j<37;j++)
			{
				var theta = j*10*Math.PI/180;
				var r = vec({x:(-MJ+(MJ+10*_RE)*Math.cos(theta)),
					y:(MJ+10*_RE)*Math.sin(theta),z: 0});
				var v = vec({x: -Math.cos(theta),y: -Math.sin(theta),z: 0}).unit();
				drawlist.push( makeParticle( energy, r, v,
					function(p){
					if(p.sub(moon.pos()).abs() < moon.r() )
					{
						return true;
					}
					return p.sub(earth.pos()).abs() < earth.r();
					}));

				}
		});
	// circle around moon
	view.addAction( 66, // b
	function(){

		var current = new Date().getTime();
		if( current - frameTimeStamp < 1000 )
			return;
		frameTimeStamp = new Date().getTime();

		var energy = selectenergy();
		for( var i = 0; i<50;i++)
		{
			var theta = i * (2/50)*Math.PI;
			var directionv = vec({x:Math.sin(theta),y:Math.cos(theta),z:0});
			var part_pos = moon.pos().add( directionv.mul(MJ) );
			drawlist.push( makeParticle(
				energy,
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

		 });
	
};

var makeMoonSim = function()
{
	var drawables = [];
	var moon = makeMoon();
	var earth = makeEarth();
	var sun  = makeSun();
	var vp_start = moon.pos().add(vec({x:0,y:0,z:-1*_RE*30}));
	var xdir = undefined;
	var ydir = undefined;
	
	var setifdef = function( data, setter )
	{
		if( data !== null && data !== undefined )
		{
			var parsed = JSON.parse(data);
			setter(vec(parsed));
		}
	};
	
	if( typeof(localStorage) !== undefined )
	{
		setifdef( localStorage.getItem( "viewport_position" ), function(d){ vp_start = d; } );
		setifdef( localStorage.getItem( "viewport_u" ), function(d){ xdir = d; } );
		setifdef( localStorage.getItem( "viewport_v" ), function(d){ ydir = d; } );
	}
	
	var setStorageVec = function( label, v )
	{
		var jsonData = JSON.stringify( {x:v.x(),y:v.y(),z:v.z()} );
		localStorage.setItem(label,jsonData);
	};
	
	var touch_storage = function( vp )
	{
		if( typeof(localStorage) !== undefined )
		{
			setStorageVec( "viewport_position", vp.pos() );
			setStorageVec( "viewport_u", vp.u() );
			setStorageVec( "viewport_v", vp.v() );
		}
	};
	
	var viewport = makeView(vp_start,xdir,ydir,touch_storage);
	setVpMovementActions( viewport );

	drawables.push(moon);
	drawables.push(earth);
	drawables.push(sun);
	
	setParticleControlActions( viewport, drawables );
	
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
			drawables[d].tick( (mark - lastmark)/10000 ); // magic number here, since mark is measured in seconds*10^-5
		}
		
		drawables.sort( sortFunction ); // if we dont sort, stuff farther away may be drawn on top of closer stuff, it's a makeshift z-buffer

		for( var d2 in drawables )
		{
			viewport.draw( context, width,height, drawables[d2] );
		}
		viewport.drawguides( context, width, height );
		lastmark = mark;
	};
};
