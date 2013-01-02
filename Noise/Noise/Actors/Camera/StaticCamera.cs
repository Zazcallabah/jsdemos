using System;
using Microsoft.DirectX;
using Microsoft.DirectX.Direct3D;

namespace Noise.Actors.Camera
{
	public class StaticCamera : IActor
	{
		public void Poke( DateTime timestamp, Device world )
		{
			world.Transform.Projection = Matrix.PerspectiveFovLH( (float) Math.PI / 4, 1, 1f, 50f );
			world.Transform.View = Matrix.LookAtLH( new Vector3( 0, 0, -30 ), new Vector3( 0, 0, 0 ), new Vector3( 0, 1, 0 ) );
			world.RenderState.Lighting = false;
		}
	}
}