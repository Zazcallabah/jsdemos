using System;
using System.Windows.Forms;
using Microsoft.DirectX;
using Microsoft.DirectX.Direct3D;

namespace Noise.Actors.Camera
{
	public class ControlledCamera : IActor
	{
		readonly Matrix _perspectiveFovLh = Matrix.PerspectiveFovLH( (float) Math.PI / 4, 1f, 1f, 500f );

		float cx, cy, cz;
		float tx, ty, tz;

		public void Poke( DateTime timestamp, Device world )
		{
			world.Transform.Projection = _perspectiveFovLh;
			world.Transform.View = Matrix.LookAtLH( new Vector3( cx, cy, cz ), new Vector3( tx, ty, tz ), new Vector3( 0, 1, 0 ) );
		}

		public override string ToString()
		{
			return string.Format( "C:[{0},{1},{2}] T:[{3},{4},{5}]", (int) cx, (int) cy, (int) cz, (int) tx, (int) ty, (int) tz );
		}

		public void Interpret( Keys key )
		{
			switch( key )
			{
				case Keys.Up:
					cz++;
					break;
				case Keys.Down:
					cz--;
					break;
				case Keys.Right:
					cy++;
					break;
				case Keys.Left:
					cy--;
					break;
				case Keys.Space:
					cx++;
					break;
				case Keys.LControlKey:
					cx--;
					break;

				case Keys.Home:
					tz++;
					break;
				case Keys.End:
					tz--;
					break;
				case Keys.PageDown:
					ty++;
					break;
				case Keys.Delete:
					ty--;
					break;
				case Keys.PageUp:
					tx++;
					break;
				case Keys.Insert:
					tx--;
					break;

				default:
					break;
			}
		}
	}
}