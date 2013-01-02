using System;
using Microsoft.DirectX;
using Microsoft.DirectX.Direct3D;
using Noise.Helpers;

namespace Noise.Actors.Camera
{
	public class RotatingCameraMovement : IActor
	{
		readonly Vector3 _from;
		readonly Vector3 _to;
		readonly TimeSpan _period;
		readonly TimeSpan _rotate;

		public RotatingCameraMovement( Vector3 from, Vector3 to, TimeSpan period, TimeSpan rotate )
		{
			_from = from;
			_to = to;
			_period = period;
			_rotate = rotate;
		}

		public float Radix { get; set; }

		public void Poke( DateTime timestamp, Device world )
		{
			var direction = _to - _from;
			var length = direction.Length();
			float cameramovementposition = timestamp.Cycle( 0, length, _period );
			direction.Normalize();
			direction.Scale( cameramovementposition );

			var angle = timestamp.Cycle( 0, (float) ( 2 * Math.PI ), _rotate );
			var rot = Matrix.RotationYawPitchRoll( 0, 0, angle );
			world.Transform.View = Matrix.LookAtLH( _from + direction, _to, new Vector3( 0, 1, 1 ) ) * rot;
		}
	}
}