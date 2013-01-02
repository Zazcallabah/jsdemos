using System;
using Microsoft.DirectX;
using Microsoft.DirectX.Direct3D;

namespace Noise.Actors.MinorObjects
{
	public class SimpleActor : IActor
	{
		VertexBuffer vb;
		CustomVertex.PositionColored[] vertices;
		IndexBuffer ib;
		short[] indices;
		Mesh lol;

		private void VertexDeclaration( Device device )
		{
			vb = new VertexBuffer( typeof( CustomVertex.PositionColored ), 6, device, Usage.Dynamic | Usage.WriteOnly, CustomVertex.PositionColored.Format, Pool.Default );

			vertices = new CustomVertex.PositionColored[6];

			int i = 0;
			vertices[i].Color = System.Drawing.Color.Gray.ToArgb();
			vertices[i++].Position = new Vector3( 0, 0, .5f );

			vertices[i].Color = System.Drawing.Color.Gray.ToArgb();
			vertices[i++].Position = new Vector3( 0, 1, .5f );

			vertices[i].Color = System.Drawing.Color.Gray.ToArgb();
			vertices[i++].Position = new Vector3( 0.5f, .2f, -.3f );


			vertices[i].Color = System.Drawing.Color.Red.ToArgb();
			vertices[i++].Position = new Vector3( 0, 0, 0 );

			vertices[i].Color = System.Drawing.Color.Green.ToArgb();
			vertices[i++].Position = new Vector3( 0, 1, 0 );

			vertices[i].Color = System.Drawing.Color.Red.ToArgb();
			vertices[i++].Position = new Vector3( 1, 0, 0 );




			vb.SetData( vertices, 0, LockFlags.None );
			ib = new IndexBuffer( typeof( int ), 6, device, Usage.WriteOnly, Pool.Default );
			indices = new short[6];

			indices[0] = 0;
			indices[1] = 1;
			indices[2] = 2;
			indices[3] = 3;
			indices[4] = 4;
			indices[5] = 5;

			ib.SetData( indices, 0, LockFlags.None );

			lol = new Mesh( 2, 6, MeshFlags.Managed, CustomVertex.PositionColored.Format, device );
			lol.SetVertexBufferData( vertices, LockFlags.None );
			lol.SetIndexBufferData( indices, LockFlags.None );

			int[] adjac = new int[lol.NumberFaces * 3];
			lol.GenerateAdjacency( 0.5f, adjac );
			lol.OptimizeInPlace( MeshFlags.OptimizeVertexCache, adjac );
		}

		public SimpleActor( Device world )
		{
			VertexDeclaration( world );
		}
		public void Poke( DateTime timestamp, Device world )
		{

			/*
			var vb = new VertexBuffer( typeof( CustomVertex.PositionColored ), 6, world, Usage.Dynamic | Usage.WriteOnly, CustomVertex.PositionColored.Format, Pool.Default );

			var vertices = new CustomVertex.PositionColored[6];
			int i = 0;
			vb.SetData( vertices, 0, LockFlags.None );

			var ib = new IndexBuffer( typeof( int ), 6, world, Usage.WriteOnly, Pool.Default );
			var indices = new int[6];

			indices[0] = 0;
			indices[1] = 1;
			indices[2] = 2;
			indices[3] = 3;
			indices[4] = 4;
			indices[5] = 5;

			ib.SetData( indices, 0, LockFlags.None );

			world.SetStreamSource( 0, vb, 0 );
			world.Indices = ib;

			world.DrawIndexedPrimitives( PrimitiveType.TriangleList, 0, 0, 6, 0, 2 );
			 */
			//			world.VertexFormat = CustomVertex.PositionColored.Format;

			//			world.SetStreamSource( 0, vb, 0 );
			//			world.Indices = ib;

			//			world.DrawIndexedPrimitives( PrimitiveType.TriangleList, 0, 0, 6, 0, 2 );
			lol.DrawSubset( 0 );
		}
	}
}