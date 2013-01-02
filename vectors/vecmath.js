

var setVpMovementActions = function( view )
{
	var movevp = function( vp, direction, multiplier ) {
		vp.moveTo( vp.pos().add( direction.mul( multiplier ) ) )
	};
	var addMoveActions = function( a, s, selector )
	{
		view.addAction( a, function(vp,c){ movevp( vp, selector(vp), 1 ) } );
		view.addAction( s, function(vp,c){ movevp( vp, selector(vp), -1 ) } );
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
	addRotActions( 76,74,function(vp){return vp.v() }); //lj
	addRotActions( 79,85,function(vp){return vp.n() }); //ou
};


var makeD = function(c,v) {
	return {
		color: function(){return c;},
		pos: function(){return v;}
		};
};


var makeVectorMath = function()
{
	var drawables = [];
	var v1 = vec({x:10,y:0,z:3});
	var v2 = vec({x:0,y:5,z:6});
	drawables.push( makeD("green", v1));
	drawables.push( makeD("lime", v2));
	drawables.push( makeD("red", v1.cross(v2)));
	
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
		setifdef( localStorage.getItem( "viewport_v" ), function(d){ xdir = d; } );
		setifdef( localStorage.getItem( "viewport_u" ), function(d){ ydir = d; } );
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
	
	var lastmark = -1;
	
	var sortFunction = function(a,b){
		var v1 = b.pos().sub( viewport.pos() ).abs();
		var v2 = a.pos().sub( viewport.pos() ).abs();
		return v1 - v2;
	};

	return {
	action: function(v1,v2,op)
	{
	},
	draw: function( context, width, height, mark, keys ) {

		viewport.tick( keys );
		
		drawables.sort( sortFunction ); // if we dont sort, stuff farther away may be drawn on top of closer stuff, it's a makeshift z-buffer

		for( var d2 in drawables )
		{
			viewport.draw( context, width,height, drawables[d2] );
		}
		viewport.drawguides( context, width, height );

	}
	};
};
