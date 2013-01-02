using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.DirectX;

namespace Noise.Helpers
{
	public static class Cycler
	{
		public static Vector3 Orbit( this DateTime mark )
		{
			return new Vector3();
		}
		public static float Cycle( this DateTime mark, float min, float max, TimeSpan period )
		{
			long ticks = period.Ticks;
			if( ticks == 0 )
				return 0f;
			long current = mark.Ticks % ticks;
			return (float) ( ( (double) current ).Normalize( 0, ticks ).Linear( min, max ) );
		}

		public static TimeSpan Ms( this int m )
		{
			return TimeSpan.FromMilliseconds( m );
		}

		public static TimeSpan Seconds( this int m )
		{
			return TimeSpan.FromSeconds( m );
		}

		public static TimeSpan Minutes( this int m )
		{
			return TimeSpan.FromMinutes( m );
		}

		public static TimeSpan Ms( this double m )
		{
			return TimeSpan.FromMilliseconds( m );
		}

		public static TimeSpan Seconds( this double m )
		{
			return TimeSpan.FromSeconds( m );
		}

		public static TimeSpan Minutes( this double m )
		{
			return TimeSpan.FromMinutes( m );
		}

	}
}
