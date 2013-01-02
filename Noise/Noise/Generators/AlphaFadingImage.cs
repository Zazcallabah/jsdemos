using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;

namespace Noise.Generators
{
	public class AlphaFadingImage
	{
		readonly Color _color;

		public AlphaFadingImage( Color color )
		{
			_color = color;
		}
		public Bitmap Image( int size, int algorithm )
		{
			Bitmap bm = new Bitmap( size, size );
			for( int x = 0; x < size; x++ )
				for( int y = 0; y < size; y++ )
				{
					double pixelweight = Decide( x, y, size, algorithm );
					bm.SetPixel( x, y, Color.FromArgb( (int) ( _color.R * pixelweight ), (int) ( _color.G * pixelweight ), (int) ( _color.B * pixelweight ) ) );
				}
			return bm;
		}

		public Stream Stream( int size )
		{
			var bm = Image( size, 3 );
			var str = new MemoryStream();
			bm.Save( str, ImageFormat.Png );
			str.Position = 0;
			return str;
		}

		double Decide( int x, int y, int max, int algorithm )
		{
			switch( algorithm )
			{
				case 0:
					return Linear( x, max );
				case 1:
					return ProjectX2( x, max );
				case 2:
					return ProjectX2( x, max ) * ProjectX2( y, max );
				case 3:
					return ( ProjectX2( x, max ) / 2 ) + ( ProjectX2( y, max ) / 2 );
				default:
					return 1.0;
			}
		}

		double Linear( int x, int max )
		{
			return (double) x / max;
		}

		double ProjectX2( int x, int max )
		{
			if( x < 0 )
				x = 0;
			if( x > max )
				x = max;
			double xDiff = ( max / 2.0 );
			double xMin = ( 0 - xDiff ) * 0.9;
			double xMax = ( 0 + xDiff ) * .9;
			double transformedX = ( x - xDiff ) * .9;

			Func<double, double> f = ( a ) => -1 * ( a - xMax ) * ( a - xMin );

			double y = f( transformedX );
			double yMax = f( 0 );

			return y / yMax;



		}




	}
}
