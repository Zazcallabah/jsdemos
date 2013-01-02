var makeView = function(start, xdir, ydir, ping_callback )
{
	var default_position = vec({x:0,y:0,z:-20});
	var default_u = vec({x:0,y:1,z:0}).unit();
	var default_v = vec({x:1,y:0,z:0}).unit();
	
	var pos = start || default_position;
	var u = ydir || default_u;
	var v = xdir || default_v;
	var n = v.cross( u );
	var fovx = 1;
	var fovy = 1;
	var hasmoved = false;
	var actions = {};
	var count = 0;

	var _rotate = function( ve, theta, around )
	{
		// this is basically the extracted arithmetic of multiplying a series of rotational matrixes with vector ve
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
		
	return {
		rotate: function( angle, about ) {
			var local_u = _rotate(u,angle,about);
			var local_v = _rotate(v,angle,about);
			u = local_u.unit();
			v = local_v.unit();
			n = v.cross( u );
		},
		tick: function(keys) {
			if( count++ % 3000 === 0 && hasmoved )
			{
				ping_callback( this );
				hasmoved = false;
			}
			for( var k = 0; k < keys.length; k++ )
			{
				if(actions[keys[k]] !== undefined )
				{
					actions[keys[k]](this);
					hasmoved = true;
				}
			}
		},
		u: function() { return u; },
		v: function() { return v; },
		n: function() { return n; },
		pos: function() { return pos; },
		moveTo: function( newpos ) { pos = newpos; },
		reset: function(){ pos = default_position; u = default_u; v = default_v; n = v.cross( u ); },
		addAction: function( key, action ){
			actions[key] = action;
		},
		draw: function( context, w, h, obj ) { // draw: draw obj on context which has width w, height h
			var perspective_start = vec().sub( this.pos() );
			var perspective_end = obj.pos().sub( this.pos() ); 
			
			var distance_end = perspective_end.dot( this.n() );
			var distance_start = perspective_start.dot( this.n() );
			
			var limit = 1*fovx*w;
			if( distance_end > 0 && distance_start > 0 ) // if object should be drawn, (i.e. if distance is positive)
			{
				var absolute_x_coord_start = perspective_start.dot( v );
				var absolute_y_coord_start = perspective_start.dot( u );
				
				var absolute_x_coord_end = perspective_end.dot( v );
				var absolute_y_coord_end = perspective_end.dot( u ) ;
				
				var scaled_x_start = (absolute_x_coord_start*fovx*w) / (distance_start+fovx*w) + w/2;
				var scaled_y_start = h - ( (absolute_x_coord_start*fovy*h) / (distance_start+fovy*h) + h/2 );

				var scaled_x_end = (absolute_x_coord_end*fovx*w) / (distance_end+fovx*w) + w/2;
				var scaled_y_end = h - ( (absolute_y_coord_end*fovy*h) / (distance_end+fovy*h) + h/2 );
				
				context.strokeStyle = obj.color();
				context.lineWidth = 2;
				context.beginPath();
				context.moveTo(scaled_x_start,scaled_y_start);
				context.lineTo(scaled_x_end,scaled_y_end);
				context.stroke();
			}
		},
		drawguides: function( context, w,h){ // draw axis unit vectors in corner
			var sorter = function(a,b){ return b.z - a.z; };
			var drawbuffer = [];
			var drawAction = function( color, vector ){
				var x2 = vector.dot( u );
				var y2 = vector.dot( v );
				var z2 = vector.dot( n );
				
				if( z2 > 0 )
					color = "dark"+color;
				
				return {
					z: z2,
					draw: function(){
				context.strokeStyle = color;
				context.lineWidth = 2;
				context.beginPath();
				context.moveTo(50,50);
				context.lineTo(50*x2+50,100-(50*y2+50));
				context.stroke();
				}
				};
			};
			
			
			drawbuffer.push(drawAction( "red", vec({x:1,y:0,z:0})));
			drawbuffer.push(drawAction( "green", vec({x:0,y:1,z:0})));
			drawbuffer.push(drawAction( "blue", vec({x:0,y:0,z:1})));
			
			drawbuffer.sort( sorter );
			
			
		for( var d2 in drawbuffer )
		{
			drawbuffer[d2].draw();
		}
			
			context.fillStyle = "white";
			context.font = "12px";
			context.fillText( this.pos().info(), 100, 20 );
		
		}
	};
};