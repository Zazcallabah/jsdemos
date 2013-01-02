using System;
using System.Collections;
using System.Linq;
using System.Text;
using Microsoft.DirectX;
using Microsoft.DirectX.Direct3D;
using Noise.Generators;
using Noise.Helpers;

namespace Noise.Actors.Terrain
{
	public class PerlinTerrain : IActor
	{
		readonly AnimationData _animate;
		readonly int _startX;
		readonly int _startY;
		readonly short _xCount;
		readonly short _yCount;
		DateTime _heightMapGenerationTime;
		readonly ITransformNoise _transform;
		readonly Mesh _meshTerrain;

		public PerlinTerrain( Device world )
			: this( world, new AnimationData( false ), 0, 0, 200, 200, new ScaleTransform( new FloatNoise(), 0.01f, 0.01f, 0.01f, 40 ) )
		{
		}

		public PerlinTerrain( Device world, AnimationData animate, int startX, int startY, short xCount, short yCount, ITransformNoise transform )
		{
			_animate = animate;
			_startX = startX;
			_startY = startY;
			_xCount = xCount;
			_yCount = yCount;
			_transform = transform;
			_meshTerrain = new Mesh( IndexArrayLength( xCount, yCount ) / 3, xCount * yCount, MeshFlags.Managed, CustomVertex.PositionNormalColored.Format, world );

			PopulateIndexMap();
			if( !_animate.ShouldAnimate )
				RegenerateHeightMap( DateTime.Now );
		}

		public int IndexArrayLength( int xLength, int yLength )
		{
			return 6 * ( xLength - 1 ) * ( yLength - 1 );
		}

		void PopulateIndexMap()
		{
			var indexMap = new short[IndexArrayLength( _xCount, _yCount )];
			int indexer = 0;
			for( short y = 0; y < _yCount - 1; y++ )
				for( short x = 0; x < _xCount - 1; x++ )
				{
					short currentIndex = (short) ( y * _xCount + x );
					indexMap[indexer++] = currentIndex;
					indexMap[indexer++] = (short) ( currentIndex + _xCount );
					indexMap[indexer++] = (short) ( currentIndex + _xCount + 1 );
					indexMap[indexer++] = (short) ( currentIndex + _xCount + 1 );
					indexMap[indexer++] = (short) ( currentIndex + 1 );
					indexMap[indexer++] = currentIndex;
				}
			_meshTerrain.IndexBuffer.SetData( indexMap, 0, LockFlags.None );
		}

		void RegenerateHeightMap( DateTime mark )
		{
			var vertices = new CustomVertex.PositionNormalColored[_xCount * _yCount];

			for( int y = 0; y < _yCount; y++ )
			{
				for( int x = 0; x < _xCount; x++ )
				{
					float vz = _transform.Noise( _startX + x, _startY + y, mark.Cycle( 0, 50, 20.Seconds() ) );// mark.Cycle( _animate.MinZ, _animate.MaxZ, _animate.AnimationLoopSpan ) );
					vertices[y * _xCount + x].Position = new Vector3( _startX + x, vz, _startY + y );
					vertices[y * _xCount + x].Color = MakeColor( vz );
					vertices[y * _xCount + x].Normal = new Vector3( 0, 1, 0 );
				}
			}

			_meshTerrain.VertexBuffer.SetData( vertices, 0, LockFlags.None );
			int[] adjac = new int[_meshTerrain.NumberFaces * 3];
			_meshTerrain.GenerateAdjacency( 0.5f, adjac );
			_meshTerrain.OptimizeInPlace( MeshFlags.OptimizeVertexCache, adjac );
			_meshTerrain.ComputeNormals();

			_heightMapGenerationTime = mark;
		}

		public void Poke( DateTime timestamp, Device world )
		{
			if( _animate.ShouldAnimate && _heightMapGenerationTime + _animate.RenderSpan < timestamp )
				RegenerateHeightMap( timestamp );

			world.VertexFormat = CustomVertex.PositionColored.Format;

			int numSubSets = _meshTerrain.GetAttributeTable().Length;
			for( int i = 0; i < numSubSets; ++i )
			{
				_meshTerrain.DrawSubset( i );
			}
		}

		int MakeColor( float height )
		{
			height += _transform.OutScale;
			height /= _transform.OutScale * 2;
			height *= 255f;
			var i = (uint) Math.Round( height );
			unchecked
			{
				return (int) (
				i << 24 |
				i << 16 |
				i << 8 |
				i );
			}
		}
	}
}
