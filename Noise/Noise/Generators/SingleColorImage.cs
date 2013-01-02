using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;

namespace Noise.Generators
{
	public class SingleColorImage
	{
		readonly Color _color;

		public SingleColorImage( Color color )
		{
			_color = color;
		}

		public Stream Image( int size )
		{
			Bitmap bm = new Bitmap( size, size );
			for( int x = 0; x < size; x++ )
				for( int y = 0; y < size; y++ )
				{
					bm.SetPixel( x, y, Color.FromArgb( 255, _color ) );
				}
			var str = new MemoryStream();
			bm.Save( str, ImageFormat.Bmp );
			str.Position = 0;
			return str;
		}

	}
}
