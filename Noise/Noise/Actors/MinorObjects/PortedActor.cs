using System;
using Microsoft.DirectX;
using Microsoft.DirectX.Direct3D;

namespace Noise.Actors.MinorObjects
{
	public class PortedActor : IActor
	{
		public void Poke( DateTime timestamp, Device world )
		{
			var vb = new VertexBuffer( typeof( CustomVertex.PositionColored ), 6, world, Usage.Dynamic | Usage.WriteOnly, CustomVertex.PositionColored.Format, Pool.Default );

			var vertices = new CustomVertex.PositionColored[6];

			int i = 0;
			vertices[i].Color = System.Drawing.Color.Gray.ToArgb();
			vertices[i++].Position = new Vector3( 100, 200, 1 );

			vertices[i].Color = System.Drawing.Color.Gray.ToArgb();
			vertices[i++].Position = new Vector3( 0, 100, 1 );

			vertices[i].Color = System.Drawing.Color.Gray.ToArgb();
			vertices[i++].Position = new Vector3( 200, 100, 1 );

			vertices[i].Color = System.Drawing.Color.Gray.ToArgb();
			vertices[i++].Position = new Vector3( 200, 300, 1 );

			vertices[i].Color = System.Drawing.Color.Gray.ToArgb();
			vertices[i++].Position = new Vector3( 0, 300, 1 );

			vertices[i].Color = System.Drawing.Color.Gray.ToArgb();
			vertices[i++].Position = new Vector3( 0, 100, 1 );


			vb.SetData( vertices, 0, LockFlags.None );
			world.SetStreamSource( 1, vb, 0 );
			world.DrawPrimitives( PrimitiveType.TriangleFan, 0, 6 );
		}
	}
}