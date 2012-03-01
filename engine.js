function makeTimer()
{
	var counter = 0;
	var mark = 0;
	return {
		report: function(){
			if(counter === 0)
			{
				mark = new Date().getTime();
			}
			else if(counter > 1000 )
			{
				var took = new Date().getTime()-mark;
				counter =0;
				mark=new Date().getTime();
				console.log(1000/(took/1000));

			}
			counter++;
		}
	};
}

function makeEngine( canvas, timer )
{
	var workers = [];
	var triggerWork = function(context, width, height )
	{
		if(timer!== undefined)
			timer.report();

		for (var worker in workers)
		{
			workers[worker](context, width, height);
		}
	};

	var animate = function()
	{
		var context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.canvas.width  = window.innerWidth-10;
		context.canvas.height = window.innerHeight-10;
		triggerWork(context, canvas.width, canvas.height);

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






	return {
		add: function( fn )
		{
			workers.push(fn);
		},
		start: animate
	};
}
