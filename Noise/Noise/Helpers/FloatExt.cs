namespace Noise.Helpers
{
	public static class NumberExt
	{
		public static float Linear( this float x, float min, float max )
		{
			return min + x * ( max - min );
		}

		/// <summary>
		/// Will project x linearely between 0.0 and 1.0
		/// </summary>
		public static double Normalize( this double x, double min, double max )
		{
			return x / ( max - min );
		}

		/// <summary>
		/// Expects x to be between 0.0 and 1.0
		/// </summary>
		public static double Linear( this double x, double min, double max )
		{
			return min + x * ( max - min );
		}

		public static float Weighted( this float x )
		{
			return ( 3 - 2 * x ) * x * x;
		}
	}


}