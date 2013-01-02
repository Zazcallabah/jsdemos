using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Noise.Generators;

namespace NoiseTest
{
	/// <summary>
	/// Summary description for PerlinTimingBenchmarks
	/// </summary>
	[TestClass]
	public class PerlinTimingBenchmarks
	{
		/*[TestMethod]
		public void BenchCreate()
		{
			Time( 20000, () => { new BenchmarkNoise( 19364589 ); } );
		}

		[TestMethod]
		public void BenchPerform()
		{
			var n = new BenchmarkNoise( 3397 );
			double i = 0;

			Time( 1000000, () =>
			{
				var d = Math.Abs( n.Noise( i, 4.5, 4.3 ) );
				i += d;
			} );
		}
		*/
		[TestMethod]
		public void BenchCF()
		{
			Time( 20000, () => { new FloatNoise(); } );
		}

		[TestMethod]
		public void BenchPF()
		{
			var n = new FloatNoise();
			float i = 0;

			Time( 1000000, () =>
			{
				var d = Math.Abs( n.Noise( i, 4.5f, 4.3f ) );
				i += d;
			} );
		}

		[TestMethod]
		public void BenchCFe()
		{
			Time( 20000, () => { new FloatExtNoise(); } );
		}

		[TestMethod]
		public void BenchPFe()
		{
			var n = new FloatExtNoise();
			float i = 0;

			Time( 1000000, () =>
			{
				var d = Math.Abs( n.Noise( i, 4.5f, 4.3f ) );
				i += d;
			} );
		}
		/*
		[TestMethod]
		public void BenchRCreate()
		{
			Time( 20000, () => { new PerlinRndInitNoise( 19454589 ); } );
		}

		[TestMethod]
		public void BenchRPerform()
		{
			var n = new PerlinRndInitNoise( 93384987 );
			float i = 0;

			Time( 1000000, () =>
			{
				var d = (float) Math.Abs( n.Noise( i, 4.5f, 4.3f ) );
				i += d;
			} );
		}
		*/
		void Time( long repeats, Action @do )
		{
			var mark = DateTime.Now;

			while( repeats-- > 1 )
				@do();

			var took = DateTime.Now.Subtract( mark );
			Assert.Fail( "t:{0}", took );
		}
	}
}
