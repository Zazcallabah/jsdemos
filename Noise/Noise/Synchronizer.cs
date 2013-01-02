using System;
using System.Diagnostics;
using System.Threading;

namespace Noise
{
	internal class Synchronizer
	{
		readonly ICanPaint _target;
		readonly Thread _carrier;
		DateTime? mark;
		int count = 0;
		long _minimumTimePerFrame;
		bool _breakNow;

		void Time( DateTime now )
		{
			if( mark == null )
			{
				count = 1;
				mark = now;
				return;
			}

			count++;

			if( mark.Value.AddSeconds( 1.0 ) < now )
			{
				mark = null;
				Debug.Write( "\rFPS: " + count );
				//	Debug.Write( controlledCamera );
			}
		}
		public Synchronizer( ICanPaint target ) : this( target, 60 ) { }
		public Synchronizer( ICanPaint target, int maxFps )
		{
			_minimumTimePerFrame = 10000000 / maxFps;
			_target = target;
			_breakNow = false;
			_carrier = new Thread( BeginCallingPainterWithGivenMaximumFps );
		}

		void BeginCallingPainterWithGivenMaximumFps()
		{
			while( !_breakNow )
			{
				var now = DateTime.Now;
				Time( now );
				_target.Repaint();
				long timelefttillnewframe = now.Ticks + _minimumTimePerFrame - DateTime.Now.Ticks;
				if( timelefttillnewframe > 10000 )
				{
					Thread.Sleep( (int) timelefttillnewframe / 10000 );
				}
			}

		}

		public void Break()
		{
			_breakNow = true;
		}



		public void Start()
		{
			_carrier.Start();
		}


	}
}