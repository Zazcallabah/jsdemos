var makeRoto = function( linecount )
{
	var lines = [makePoint()];
	if( linecount === undefined )
		linecount = 4;
	
	while( linecount-- > 1 )
	{
		lines.push(makePoint());
	}
	
	
	return function(context, canvaswidth, canvasheight, mark) {
		for( var l in lines)
		 lines[l].tick();
		context.strokeStyle = "white";
		context.fillStyle = "white";
		context.beginPath();
		context.moveTo(lines[0].x()*canvaswidth,lines[0].y()*canvasheight);
		for( var i = 1;i<lines.length; i++)
			context.lineTo(lines[i].x()*canvaswidth,lines[i].y()*canvasheight);
		context.closePath();
		context.fill();
	}
};

var makePoint = function()
{
	var pi = 3.14159265358;
	//randomize
	var x = Math.random();
	var y = Math.random();
	var velocity = 0.001*Math.random() + 0.003*Math.random();
	var direction = 2*pi*Math.random();

	var tick = function()
	{
		x += velocity*Math.cos(direction);
		y += velocity*Math.sin(direction);

		if( x < 0 )
		{
			if( direction > pi/2 && direction < 3*pi/2 )
			{
				direction -= pi/2;
				direction += 2* (pi-direction)
				direction += pi/2;
			}
			else console.log("badness x < 0 ");
		}
		else if( x > 1 )
		{
			if( direction > 3*pi/2 || direction < pi/2 )
			{
				direction -= pi/2;
				direction = 2*pi-direction;
				direction += pi/2;
			}
			else console.log("badness x > 1 ");
		}

		if( y < 0 )
		{
			if( direction > 0 && direction < pi )
			{
				direction += 2* (pi-direction);
			}
			else console.log("badness y < 0 ");
		}
		else if( y > 1 )
		{
			if( direction > pi && direction < 2*pi )
			{
				direction = 2*pi-direction;
			}
			else console.log("badness y > 1 ");
		}
	};

	return {
		x: function(){return x;},
		y: function(){return y;},
		tick: tick
	};
};