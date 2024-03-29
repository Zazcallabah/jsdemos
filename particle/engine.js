function makeLog()
{
	var counter = 0;
	var timestamp = new Date().getTime();
	var fps = 0;
	return function(context, width, height, mark, pressedkeys) {
			counter++;

			var took = new Date().getTime() - timestamp;

			if( took > 1000 )
			{
				var load = took/counter;
				fps = 1000/load;
				counter =0;
				timestamp=new Date().getTime();
			}
			
		context.fillStyle = "white";
		context.font = "12px";
		context.fillText( "FPS: " + Math.round(fps), 100, 40 );
	};
}

function makeEngine( canvas )
{
	var workers = [];
	var pressedkeys = [];
	var triggerWork = function(context, width, height, mark )
	{
		for (var worker in workers)
		{
			workers[worker](context, width, height, mark, pressedkeys);
		}
	};

	document.onkeyup = function(){ pressedkeys = []; }

	document.onkeydown = function(event) {
		var keyCode;
		if(event == null)
		{
			keyCode = window.event.keyCode;
		}
		else
		{
			keyCode = event.keyCode;
		}
		for( var k in pressedkeys )
		{
			if( pressedkeys[k] === keyCode )
				return;
		}
		pressedkeys.push( keyCode );
	};

	var animate = function()
	{
		var context = canvas.getContext("2d");
		var frameTimeStamp = new Date().getTime() - startTime;
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.canvas.width  = window.innerWidth-10;
		context.canvas.height = window.innerHeight-50;
		triggerWork(context, canvas.width, canvas.height, frameTimeStamp );

		// request new frame
		requestAnimFrame(function(){
			animate();
		});
	};

	window.requestAnimFrame = (function(){
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback){
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	var startTime = undefined;

	return {
		add: function( fn )
		{
			workers.push(fn);
		},
		start: function(){
			startTime = new Date().getTime();
			animate();
		}
	};
}
