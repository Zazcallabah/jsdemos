using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.DirectX;
using Microsoft.DirectX.Direct3D;

namespace Noise
{
	public class DrawTriangle : IDrawTriangles
	{
		readonly int triangleBufferSize;
		List<Vector3> _buffer;

		static int MakeColor( float height )
		{
			if( height < 5 )
				height = 5;
			else if( height > 15 )
				height = 15;

			height -= 5;
			height /= 10f;
			height *= 255f;
			var i = (uint) Math.Round( height );
			unchecked
			{
				return (int) (
					i << 24 |
						i << 16 |
							i << 8 |
								i
					);
			}

		}

		public DrawTriangle()
		{
			triangleBufferSize = 16000;
			_buffer = new List<Vector3>( triangleBufferSize * 3 );
		}

		public void Draw( Device world, float[][] coords )
		{
			if( _buffer.Count >= triangleBufferSize )
				Flush( world );
			foreach( var points in coords )
				_buffer.Add( new Vector3( points[0], points[1], points[2] ) );

		}

		public void Flush( Device world )
		{
			//				var normal = ( vertices[1].Position - vertices[2].Position ).Cross( vertices[0].Position - vertices[2].Position );
			//				normal.Normalize();
			//				vertices[0].Normal = vertices[1].Normal = vertices[2].Normal = normal;

			var vertices = _buffer.Select( c => new CustomVertex.PositionNormalColored() { Position = c, Color = MakeColor( c.Y ), Normal = new Vector3( 0, 1, 0 ) } );


			world.VertexFormat = CustomVertex.PositionNormalColored.Format;
			world.DrawUserPrimitives( PrimitiveType.TriangleList, _buffer.Count / 3, vertices.ToArray() );
			_buffer.Clear();
		}
	}
}