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
var makeScaler = function()
{
	return {
		dist: function( x ){ return x/1e5; },
		time: function( t ) { return t/10000; }
	};
};

var makeMoon = function()
{
	var radius = 1.7371e6;
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

	var moves = [
		{v:vec({x:0,y:0,z:5e5}),a:87,s:83}, // w s
		{v:vec({x:5e5,y:0,z:0}),a:68,s:65}, // d a
		{v:vec({x:0,y:5e5,z:0}),a:81,s:69}  // q e
	];

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
		//		if( count % 100 === 0 )
		//			console.log(ndist+"|"+x+"|"+y);
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

var makeParticle = function( energy, position, velocity )
{
	var scaler = makeScaler();
	var eV = 1.60218e-19; //          %En elektronvolt [J]
	var MJ = 3844e5;     //          %Avstånd mellan månen och jorden [m]
	var RE = 6.378e6;        //      %Jordradien [m]
	var MR = 1.7371e6;        //     %Månradien [m]
	var c = 3e008;               //    %Ljusets hastighet [m/s]
	var c2 = c*c;
	var q = 1.602e-19;            //   %Elementarladdning för proton [C]
	var m = 1.6726e-27;           //   %Protons massa [kg]

//	dt = 1e-003;         //        %Tidssteg [s]
	var E = energy || 3e5*1e6*eV;  //        %Energi [J]

	var iopt = 3;       //             %Värde beroende av aktivitet där ca 3 är medel
	var ps = 0;         //             %Ingen lutning av dipol
	var parmod = []; // 10
	var emc = (E/(m*c2)+1)
	var absv = c*Math.sqrt( 1 - 1/(emc*emc)); //     %Hastighetens belopp [m/s]
	var g = 1/Math.sqrt(1-(absv*absv)/c2); //               %Gamma

	//M is end posit
	var theta = 0; // radians
	var r = position;//vec({x:-MJ+(MJ+10*RE)*Math.cos(theta),y:(MJ+10*RE)*Math.sin(theta),z: 0}); //  %Postition [m]
	var v = vec({
		x: absv*(Math.random()-0.5),
		y:absv*(Math.random()-0.5),
		z: absv*(Math.random()-0.5)
	});//    %Hastighet [m/s]
	var p = v.mul(m*g); //               %Rörelsemängd [kg*m/s]

	var ef_pos = position;

	return {
		pos: function() { return ef_pos; },
		tick: function(dt) {

			var B_field = vec({x:0.3,y:0.1,z:0.5});
			/*			if ( r[0] >= 5*RE )
			 {
			 B_field = vec();
			 }
			 else
			 {
			 //[bx,by,bz] = T89C(iopt,parmod,ps,r(1)/RE,0,r(3)/RE);
			 //B_field = [bx,by,bz]*1e-009;
			 }*/
			var A = v.mul(q);
			var F = A.cross(B_field);

			p = p.add( F.mul(dt) );          //            %Rörelsemängd [kg*m/s]
			var pabs = p.abs(); // %Absolutbeloppet av rörelsemängd [kg*m/s]
			v = p.mul(1/Math.sqrt(m*m+(pabs*pabs)/c2));  //  %Hastigheten [m/s]
			r = r.add(v.mul(dt) );               //       %Punkt: r=r+dr [m]


			ef_pos = vec({x:r.x(),y:r.y(),z:r.z()});
		},
		r: function(){ return 7e5;},
		style: function(){return "#77F"}
	};
};

var makeMoonSim = function()
{
	var scaler = makeScaler();
	var viewport = makeView(vec({x:50,y:-50,z:-80e6}));
	var drawables = [];

	for( var i = -100e6; i< 100e6; i+=34e6 )
		for( var j = -100e6; j< 101e6; j+=35e6 )
			for( var k = -100e6; k< 101e6; k+=36e6 )
				drawables.push(makeParticle(undefined,vec({x:i,y:j,z:k})));
	var moon = makeMoon();
	drawables.push(moon);
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
			drawables[d].tick( scaler.time(mark - lastmark) );
		}
		drawables.sort( sortFunction );

		for( var d in drawables )
		{
			viewport.draw( context, width,height, drawables[d] );
		}
		//document.getElementById("fps").innerText =
		//	"vp: "+viewport.pos().info() + " n:"+viewport.n().info();//+
//			"\nm: "+moon.pos().info() +
//			"\np: "+part.pos().info();

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

