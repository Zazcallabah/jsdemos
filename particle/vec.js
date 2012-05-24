var vec = function vec( par )
{
	if( par === undefined )
		par = {};

	var _x = par.x || 0;
	var _y = par.y || 0;
	var _z = par.z || 0;
	var num = function( i ) {
//		var tmp = i*100;
	//	return Math.floor( tmp ) / 100;
	return i;
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
		unit: function(){ return this.mul( 1 / this.abs() ); },
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
			return vec({
				x:v.x()+_x,
				y:v.y()+_y,
				z:v.z()+_z
			});
		},
		sub: function( v ) {return vec({
			x:_x- v.x(),
			y:_y- v.y(),
			z:_z- v.z()
		}); },
		info: function() { return "[ "+num(_x)+", "+num(_y)+", "+num(_z)+" ]";}
	};
};
