using System;
using System.Collections.Generic;
using Microsoft.DirectX.Direct3D;
using Noise.Generators;

namespace Noise.Actors.Terrain
{
	public class TiledTerrain : IActor
	{
		IEnumerable<IActor> _tiles;
		const short MeshTileSize = 150;

		public TiledTerrain( Device world, int sizeX, int sizeY, int startX, int startY, ITransformNoise transform, AnimationData animation )
		{
			int xCount = (int) Math.Ceiling( (double) sizeX / MeshTileSize );
			int yCount = (int) Math.Ceiling( (double) sizeY / MeshTileSize );
			int tileCount = xCount * yCount;
			var tiles = new PerlinTerrain[tileCount];
			int indexer = 0;
			for( int y = 0; y < yCount; y++ )
				for( int x = 0; x < xCount; x++ )
					tiles[indexer++] = new PerlinTerrain( world, animation, startX + x * ( MeshTileSize - 1 ), startY + y * ( MeshTileSize - 1 ), MeshTileSize, MeshTileSize, transform );

			_tiles = tiles;
		}

		public void Poke( DateTime timestamp, Device world )
		{
			foreach( var tile in _tiles )
			{
				tile.Poke( timestamp, world );
			}
		}
	}
}