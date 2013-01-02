using System;
using Microsoft.DirectX;
using Microsoft.DirectX.Direct3D;
using Noise.Helpers;

namespace Noise.Actors.Camera
{
	public class SimpleCameraMovement : IActor
	{
		//	world.Transform.Projection = _perspectiveFovLh;
		//readonly Matrix _perspectiveFovLh = Matrix.PerspectiveFovLH( (float) Math.PI / 4, 1f, 1f, 500f );
		readonly float _height;
		readonly TimeSpan _period;
		Vector3 _cameraTarget;
		public SimpleCameraMovement() : this( new Vector3( 15, 15, 15 ), 60, 20 ) { }

		public SimpleCameraMovement( Vector3 cameraTarget, float radix, float height ) : this( cameraTarget, radix, height, 1.Minutes() ) { }
		public SimpleCameraMovement( Vector3 cameraTarget, float radix, float height, TimeSpan period )
		{
			Radix = radix;
			_height = height;
			_period = period;

			_cameraTarget = cameraTarget;
		}

		public float Radix { get; set; }

		public void Poke( DateTime timestamp, Device world )
		{
			float angle = timestamp.Cycle( 0, 2 * (float) Math.PI, _period );
			float cameraz = (float) Math.Sin( angle ) * Radix;
			float camerax = (float) Math.Cos( angle ) * Radix;
			//	world.Transform.Projection = _perspectiveFovLh;
			world.Transform.View = Matrix.LookAtLH( new Vector3( camerax, _height, cameraz ) + _cameraTarget, _cameraTarget, new Vector3( 0, 1, 0 ) );
		}
	}
}