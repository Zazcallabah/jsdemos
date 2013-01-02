using System;
using System.Collections.Generic;
using System.Linq;
using Noise;
using Noise.Helpers;

namespace NoiseTest
{

	struct DVector
	{
		public double X { get; set; }
		public double Y { get; set; }

		public static DVector operator +( DVector v1, DVector v2 )
		{
			return new DVector() { X = v1.X + v2.X, Y = v1.Y + v2.Y };
		}
		public static DVector operator *( DVector v, int scalar )
		{
			return new DVector() { X = v.X * scalar, Y = v.Y * scalar };
		}
		public static DVector operator -( DVector v1, DVector v2 )
		{
			return v1 + ( v2 * -1 );
		}
		public static double operator *( DVector v1, DVector v2 )
		{
			return v1.X * v2.X + v1.Y * v2.Y;
		}
	}

	struct CVector
	{
		public int X { get; set; }
		public int Y { get; set; }
	}

	public class PerlinGenerator
	{
		readonly int _gridSizeX;
		readonly int _gridSizeY;
		readonly double _xInterval;
		readonly double _yInterval;
		readonly DVector[] _gridPointGradients = new DVector[256];
		public PerlinGenerator( int gridSizeX, int gridSizeY )
		{
			_gridSizeX = gridSizeX;
			_gridSizeY = gridSizeY;

			_xInterval = 1.0 / _gridSizeX;
			_yInterval = 1.0 / _gridSizeY;

			for( var i = 0; i < _gridPointGradients.Length; i++ )
			{
				var angle = Generate.Random.NextDouble() * 2 * Math.PI;
				_gridPointGradients[i] = new DVector
				{
					X = Math.Cos( angle ),
					Y = Math.Sin( angle )
				};
			}
		}
		DVector GradientFor( CVector v )
		{ return GradientFor( v.X, v.Y ); }
		DVector GradientFor( int x, int y )
		{
			return _gridPointGradients[( ( y * _gridSizeY ) + x ) % 256];
		}

		public double Make( double xCoord, double yCoord, double xSize, double ySize )
		{
			return Make( xCoord / xSize, yCoord / ySize );
		}

		public double Make( double x, double y )
		{
			var encapsulatingGridPointIndices = new CVector[4];
			double x0 = 0, y0 = 0;
			int counter = 0;
			for( double i = 0; i < 1; i += _xInterval )
			{
				if( i <= x && i + _xInterval > x )
				{
					x0 = _xInterval * counter;
					encapsulatingGridPointIndices[0].X += counter;
					encapsulatingGridPointIndices[1].X += counter + 1;
					encapsulatingGridPointIndices[2].X += counter;
					encapsulatingGridPointIndices[3].X += counter + 1;

					break;
				}
				counter++;
			}
			counter = 0;
			for( double i = 0; i < 1; i += _yInterval )
			{
				if( i <= y && i + _yInterval > y )
				{
					y0 = _yInterval * counter;
					encapsulatingGridPointIndices[0].Y += counter;
					encapsulatingGridPointIndices[1].Y += counter;
					encapsulatingGridPointIndices[2].Y += counter + 1;
					encapsulatingGridPointIndices[3].Y += counter + 1;
					break;
				}
				counter++;
			}
			var l = encapsulatingGridPointIndices.Select( t => GradientFor( t ) * ( new DVector { X = x, Y = y } - MakeRealCoords( t ) ) ).ToList();

			var xWeight = Weighted( x - x0 );
			var yWeight = Weighted( y - y0 );
			var a = l[0] + xWeight * ( l[1] - l[0] );
			var b = l[2] + xWeight * ( l[3] - l[2] );
			return a + yWeight * ( b - a );
		}

		DVector MakeRealCoords( CVector v )
		{
			return new DVector() { X = v.X * _gridSizeX, Y = v.Y * _gridSizeY };
		}

		double Weighted( double v )
		{
			return ( 3 * Math.Pow( v, 2 ) ) - ( 2 * Math.Pow( v, 3 ) );
		}

		public PerlinGenerator()
			: this( 10, 10 )
		{
		}
	}
}