using System;
using System.Collections.Generic;
using Noise.Helpers;

namespace Noise.Generators
{
	public class FloatNoise : IMakeNoise
	{
		private const int GradientSizeTable = 256;
		private readonly GradientVector[] _gradients = new GradientVector[GradientSizeTable];

		private readonly byte[] _perm = new byte[GradientSizeTable];

		public FloatNoise()
		{
			var indices = new List<byte>();
			for( int i = 0; i < GradientSizeTable; i++ )
				indices.Insert( (int) ( Math.Floor( Generate.Random.NextDouble() * indices.Count ) ), (byte) i );
			for( int i = 0; i < _perm.Length; i++ )
				_perm[i] = indices[i];
			InitGradients();
		}

		public float Noise( float x, float y, float z )
		{
			/* The main noise function. Looks up the pseudorandom gradients at the nearest
			   lattice points, dots them with the input vector, and interpolates the
			   results to produce a single output value in [0, 1] range. */

			int ix = (int) Math.Floor( x );
			float fx0 = x - ix;
			float fx1 = fx0 - 1;
			float wx = fx0.Weighted();

			int iy = (int) Math.Floor( y );
			float fy0 = y - iy;
			float fy1 = fy0 - 1;
			float wy = fy0.Weighted();

			int iz = (int) Math.Floor( z );
			float fz0 = z - iz;
			float fz1 = fz0 - 1;
			float wz = fz0.Weighted();

			float vx0 = Lattice( ix, iy, iz, fx0, fy0, fz0 );
			float vx1 = Lattice( ix + 1, iy, iz, fx1, fy0, fz0 );
			float vy0 = wx.Linear( vx0, vx1 );

			vx0 = Lattice( ix, iy + 1, iz, fx0, fy1, fz0 );
			vx1 = Lattice( ix + 1, iy + 1, iz, fx1, fy1, fz0 );
			float vy1 = wx.Linear( vx0, vx1 );

			float vz0 = wy.Linear( vy0, vy1 );

			vx0 = Lattice( ix, iy, iz + 1, fx0, fy0, fz1 );
			vx1 = Lattice( ix + 1, iy, iz + 1, fx1, fy0, fz1 );
			vy0 = wx.Linear( vx0, vx1 );

			vx0 = Lattice( ix, iy + 1, iz + 1, fx0, fy1, fz1 );
			vx1 = Lattice( ix + 1, iy + 1, iz + 1, fx1, fy1, fz1 );
			vy1 = wx.Linear( vx0, vx1 );

			float vz1 = wy.Linear( vy0, vy1 );
			return wz.Linear( vz0, vz1 );
		}

		private void InitGradients()
		{
			for( int i = 0; i < GradientSizeTable; i++ )
			{
				double z = 1f - 2f * Generate.Random.NextDouble();
				double r = Math.Sqrt( 1f - z * z );
				double theta = 2 * Math.PI * Generate.Random.NextDouble();
				_gradients[i].X = (float) ( r * Math.Cos( theta ) );
				_gradients[i].Y = (float) ( r * Math.Sin( theta ) );
				_gradients[i].Z = (float) z;
			}
		}


		int Permutate( int x )
		{
			const int mask = GradientSizeTable - 1;
			return _perm[x & mask];
		}

		int Index( int ix, int iy, int iz )
		{
			// Turn an XYZ triplet into a single gradient table index.
			return Permutate( ix + Permutate( iy + Permutate( iz ) ) );
		}

		float Lattice( int ix, int iy, int iz, float fx, float fy, float fz )
		{
			// Look up a random gradient at [ix,iy,iz] and dot it with the [fx,fy,fz] vector.
			int index = Index( ix, iy, iz );
			return _gradients[index].X * fx + _gradients[index].Y * fy + _gradients[index].Z * fz;
		}
	}


	public class FloatExtNoise
	{
		private const int GradientSizeTable = 256;
		private readonly float[] _gradients = new float[GradientSizeTable * 3];

		private readonly byte[] _perm = new byte[GradientSizeTable];

		public FloatExtNoise()
		{
			var indices = new List<byte>();
			for( int i = 0; i < GradientSizeTable; i++ )
				indices.Insert( (int) ( Math.Floor( Generate.Random.NextDouble() * indices.Count ) ), (byte) i );
			for( int i = 0; i < _perm.Length; i++ )
				_perm[i] = indices[i];
			InitGradients();
		}

		public float Noise( float x, float y, float z )
		{
			/* The main noise function. Looks up the pseudorandom gradients at the nearest
			   lattice points, dots them with the input vector, and interpolates the
			   results to produce a single output value in [0, 1] range. */

			int ix = (int) Math.Floor( x );
			float fx0 = x - ix;
			float fx1 = fx0 - 1;
			float wx = fx0.Weighted();

			int iy = (int) Math.Floor( y );
			float fy0 = y - iy;
			float fy1 = fy0 - 1;
			float wy = fy0.Weighted();

			int iz = (int) Math.Floor( z );
			float fz0 = z - iz;
			float fz1 = fz0 - 1;
			float wz = fz0.Weighted();

			float vx0 = Lattice( ix, iy, iz, fx0, fy0, fz0 );
			float vx1 = Lattice( ix + 1, iy, iz, fx1, fy0, fz0 );
			float vy0 = wx.Linear( vx0, vx1 );

			vx0 = Lattice( ix, iy + 1, iz, fx0, fy1, fz0 );
			vx1 = Lattice( ix + 1, iy + 1, iz, fx1, fy1, fz0 );
			float vy1 = wx.Linear( vx0, vx1 );

			float vz0 = wy.Linear( vy0, vy1 );

			vx0 = Lattice( ix, iy, iz + 1, fx0, fy0, fz1 );
			vx1 = Lattice( ix + 1, iy, iz + 1, fx1, fy0, fz1 );
			vy0 = wx.Linear( vx0, vx1 );

			vx0 = Lattice( ix, iy + 1, iz + 1, fx0, fy1, fz1 );
			vx1 = Lattice( ix + 1, iy + 1, iz + 1, fx1, fy1, fz1 );
			vy1 = wx.Linear( vx0, vx1 );

			float vz1 = wy.Linear( vy0, vy1 );
			return wz.Linear( vz0, vz1 );
		}

		private void InitGradients()
		{
			for( int i = 0; i < GradientSizeTable; i++ )
			{
				double z = 1f - 2f * Generate.Random.NextDouble();
				double r = Math.Sqrt( 1f - z * z );
				double theta = 2 * Math.PI * Generate.Random.NextDouble();
				_gradients[i * 3] = (float) ( r * Math.Cos( theta ) );
				_gradients[i * 3 + 1] = (float) ( r * Math.Sin( theta ) );
				_gradients[i * 3 + 2] = (float) z;
			}
		}


		int Permutate( int x )
		{
			const int mask = GradientSizeTable - 1;
			return _perm[x & mask];
		}

		int Index( int ix, int iy, int iz )
		{
			// Turn an XYZ triplet into a single gradient table index.
			return Permutate( ix + Permutate( iy + Permutate( iz ) ) );
		}

		float Lattice( int ix, int iy, int iz, float fx, float fy, float fz )
		{
			// Look up a random gradient at [ix,iy,iz] and dot it with the [fx,fy,fz] vector.
			int index = Index( ix, iy, iz );
			int g = index * 3;
			return _gradients[g] * fx + _gradients[g + 1] * fy + _gradients[g + 2] * fz;
		}
	}
}
