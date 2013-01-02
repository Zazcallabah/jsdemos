using System;

namespace Noise.Helpers
{
	public static class Generate
	{
		static MersenneTwister _twister;
		static uint _seed = (uint) DateTime.Now.Ticks;
		static Random _random;

		public static void Init( long seed )
		{
			Init( (uint) seed );
		}

		public static void Init( uint seed )
		{
			_seed = seed;
		}

		public static MersenneTwister Mersenne { get { return _twister ?? ( _twister = new MersenneTwister( _seed ) ); } }
		public static Random Random { get { return _random ?? ( _random = new Random( (int) _seed ) ); } }
	}
}