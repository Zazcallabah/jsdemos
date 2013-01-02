using System;
using System.Drawing;
using Microsoft.DirectX;
using Microsoft.DirectX.Direct3D;
using Noise.Helpers;

namespace Noise.Actors
{
	public class LightManagement : IActor
	{
		readonly int _count;
		public LightManagement() : this( 10 ) { }

		LightManagement( int count )
		{
			_count = count;
		}

		public void Poke( DateTime timestamp, Device world )
		{
			world.Lights[0].Type = LightType.Directional;
			world.Lights[0].Diffuse = Color.White;
			world.Lights[0].Direction = new Vector3( 0.8f, 0, -1 );
			world.Lights[0].Enabled = true;
			world.Lights[0].Position = new Vector3( 20, 300, 30 );

			for( int i = 1; i <= _count; i++ )
			{

				world.Lights[i].Type = LightType.Point;
				world.Lights[i].Attenuation1 = 0.5f;
				world.Lights[i].Diffuse = Color.Red;
				world.Lights[i].Range = 100;
				world.Lights[i].Position = new Vector3( timestamp.Cycle( -200, 100, ( 15 * i ).Seconds() ), timestamp.Cycle( 5 * i, 40, 40.Seconds() ), timestamp.Cycle( -300, 40 * i, ( 2 * i + 5 ).Seconds() ) );
				world.Lights[i].Enabled = true;

			}
		}
	}
}