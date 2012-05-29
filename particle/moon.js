var _rotate = function( ve, theta, around )
{
	var cos = Math.cos(theta);
	var sin = Math.sin(theta);
	var u = around.x();
	var v = around.y();
	var w = around.z();
	var x = ve.x();
	var y = ve.y();
	var z = ve.z();
	var rx = u*(u*x+v*y+w*z)*(1-cos)+x*cos+(-1*w*y+v*z)*sin;
	var ry = v*(u*x+v*y+w*z)*(1-cos)+y*cos+(w*x-u*z)*sin;
	var rz = w*(u*x+v*y+w*z)*(1-cos)+z*cos+(-1*v*x+u*y)*sin;
	return vec({x:rx,y:ry,z:rz});
};

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
	return makeInterstellar( 1.74e6, vec({x:-3.62570e8,y:0,z:0}), "white" );
};

var makeEarth = function()
{
	return makeInterstellar( 6.4e6, vec(), "blue" );
};

var makeView = function(start, xdir, ydir )
{
	var pos = start || vec();

	var storedData = localStorage.getItem( "viewport_position" );
	if( storedData !== null && storedData !== undefined )
	{
		var parsed = JSON.parse(storedData);
		pos = vec(parsed);
	}
	var u = xdir || vec({x:1,y:0,z:0}).unit();
	storedData = localStorage.getItem( "viewport_u" );
	if( storedData !== null && storedData !== undefined )
	{
		parsed = JSON.parse(storedData);
		u = vec(parsed);
	}
	var v = ydir || vec({x:0,y:1,z:0}).unit();
	storedData = localStorage.getItem( "viewport_v" );
	if( storedData !== null && storedData !== undefined )
	{
		 parsed = JSON.parse(storedData);
		v = vec(parsed);
	}
	var n = u.cross( v );

	var fov = 200;
	var hasmoved = false;

	var rotate = function( angle, about ) {
		var local_u = _rotate(u,angle,about);
		var local_v = _rotate(v,angle,about);

		u = local_u.unit();
		v = local_v.unit();
		n = u.cross( v );
	};

	var movespeed = 1e6;
	var rots = [
		{t:function(){return u;},a:73,s:75}, // i k
		{t:function(){return v;},a:74,s:76}, // j l
		{t:function(){return n;},a:79,s:85}  // o u
	];
var count = 0;
	return {
		rotate: rotate,
		tick: function(keys)
		{
			if( count++ % 3000 && hasmoved )
			{
				var jsonData = JSON.stringify( {x:this.pos().x(),y:this.pos().y(),z:this.pos().z()} );
				localStorage.setItem("viewport_position",jsonData);
				jsonData = JSON.stringify( {x:this.u().x(),y:this.u().y(),z:this.u().z()} );
				localStorage.setItem("viewport_u",jsonData);
				jsonData = JSON.stringify( {x:this.v().x(),y:this.v().y(),z:this.v().z()} );
				localStorage.setItem("viewport_v",jsonData);
				hasmoved = false;
			}

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
						hasmoved=true;
						return;
					}
					if( moves[m].s === keys[k] )
					{
						pos = pos.sub( moves[m].v);
						hasmoved=true;
						return;
					}
				}
				for( var r = 0; r < rots.length; r++ )
				{
					if( rots[r].a === keys[k] )
					{
						rotate( angle, rots[r].t() );
						hasmoved=true;
						return;
					}
					if( rots[r].s === keys[k] )
					{
						rotate(  -1*angle, rots[r].t() );
						hasmoved=true;
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
var _t89c = makeT89C();
var _RE = 6.378e6;

// energy decides particle speed, velocity is only the unit vector for the velocity direction
var makeParticle = function( energy, position, velocity, halt )
{
	var eV = 1.60218e-19;
	var c = 3e008;
	var RE = _RE;
	var c2 = c*c;
	var q = 1.602e-19;
	var m = 1.6726e-27;
	var style = "#77F";
	var radius = 7e5;


	var E = (energy  || 1e6)*eV;

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

			var t_b = _t89c( iopt,parmod,ps, r.x()/RE, r.y()/RE, r.z()/RE );
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
	var sun  = makeSun();
	var viewport = makeView(moon.pos().add(vec({x:0,y:0,z:-1*_RE*30})));

	for( var i = -300e6; i< 131e6; i+=34e6 )
		for( var j = -100e6; j< 101e6; j+=35e6 )
			for( var k = -100e6; k< 101e6; k+=36e6 )
			{
				var part_pos = moon.pos().mul(0.5).add(vec({x:i,y:j,z:k}));
				drawables.push(makeParticle(
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
	drawables.push(moon);
	drawables.push(earth);
	drawables.push(sun);
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
