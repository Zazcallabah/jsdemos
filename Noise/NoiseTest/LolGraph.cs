using System.Drawing;
using System.Windows.Forms;
using Noise.Generators;

namespace NoiseTest
{
	public class LolGraph : Form
	{
		PictureBox[] pictureBox = new PictureBox[4];

		public LolGraph()
		{
			BackColor = Color.GhostWhite;
			Size = new Size( 800, 800 );
			for( int i = 0; i < pictureBox.Length; i++ )
				pictureBox[i] = new PictureBox() { Size = new Size { Width = Width / 2, Height = Height / 2 } };
			pictureBox[1].Location = new Point( 400, 0 );
			pictureBox[2].Location = new Point( 0, 400 );
			pictureBox[3].Location = new Point( 400, 400 );
			//	var fl = new FlowLayoutPanel();
			//	this.Controls.Add( fl );

			//PerlinNoise perlinNoise = new PerlinNoise( 99 );
			//float variant = 0;
			int algorithm = 0;
			foreach( var p in pictureBox )
			{
				//    Bitmap bitmap = new Bitmap( p.Width, p.Height );
				//    double widthDivisor = 1 / (double) p.Width;
				//    double heightDivisor = 1 / (double) p.Height;
				//    bitmap.SetEachPixelColour(
				//        ( point, color ) =>
				//        {
				//            double v =
				//                                        ( perlinNoise.Noise( Math.Pow( 2, variant + 1 ) * point.X * widthDivisor, Math.Pow( 2, variant + 1 ) * point.Y * heightDivisor, 2 ) + 1 ) / 2 * 1;


				//            v = Math.Min( 1, Math.Max( 0, v ) );
				//            byte b = (byte) ( v * 255 );
				//            return Color.FromArgb( b, b, b );
				//        } );
				//				p.Image = bitmap;
				//				variant++;
				var h = new AlphaFadingImage( Color.Blue ).Image( p.Size.Height, algorithm );
				p.Image = h;
				algorithm++;
				this.Controls.Add( p );
			}

		}

	}
}