function makeTimer()
{
	var counter = null;
	var mark = 0;
	return {
		report: function(){
			if(counter === null)
			{
				mark = new Date().getTime();
			}
			counter++;

			var took = new Date().getTime() - mark;


			if( took > 1000 )
			{
				var load = took/counter;
				var fps = 1000/load;
			//	console.log(fps);
			//	document.getElementById("fps").innerText = "Load: "+Math.round(load) + "\nFPS: "+Math.round(fps);
				counter =0;

				mark=new Date().getTime();
			}
		}
	};
}

function makeEngine( canvas, timer )
{
	var workers = [];
	var triggerWork = function(context, width, height, mark )
	{
		if(timer!== undefined)
			timer.report();

		for (var worker in workers)
		{
			workers[worker](context, width, height, mark);
		}
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

	window.requestAnimFrame = (function(callback){
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
