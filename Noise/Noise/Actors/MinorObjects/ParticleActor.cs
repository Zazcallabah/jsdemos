using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using Microsoft.DirectX;
using Microsoft.DirectX.Direct3D;
using Noise.Generators;
using Noise.Helpers;

namespace Noise.Actors.MinorObjects
{
	public class ParticleActor
		: IActor
	{
		readonly int _particlecount;
		readonly Texture _texture;
		readonly IEnumerable<SpriteVertexFormat> _vecs;
		readonly Material _material;

		public ParticleActor( Device world )
			: this( world, 20 )
		{ }

		public ParticleActor( Device world, int particlecount )
		{
			_particlecount = particlecount;

			world.RenderState.SourceBlend = Blend.One;
			world.RenderState.DestinationBlend = Blend.DestinationColor;

			world.RenderState.PointSpriteEnable = true;
			world.RenderState.PointScaleEnable = true;
			world.RenderState.PointScaleC = 50;
			var alpha = new AlphaFadingImage( Color.Green );
			_material = new Material { Ambient = Color.Transparent, Diffuse = Color.Transparent };
			//_texture = TextureLoader.FromStream( world, alpha.Stream( 30 ) );
			_texture = TextureLoader.FromFile( world, "faded.png" );
			_vecs = new byte[particlecount].Select( i => new SpriteVertexFormat { Position = RndVector(), PointSize = 5f, Color = Color.Transparent.ToArgb() } ).ToArray();
		}


		public void Poke( DateTime timestamp, Device world )
		{
			world.RenderState.AlphaBlendEnable = true;
			world.SetTexture( 0, _texture );
			//world.Material = _material;
			world.VertexFormat = VertexFormats.Position | VertexFormats.PointSize | VertexFormats.Diffuse;
			world.DrawUserPrimitives( PrimitiveType.PointList, _particlecount, _vecs );
			world.RenderState.AlphaBlendEnable = false;
		}

		Vector3 RndVector()
		{
			return RndVector( 1.5f );
		}

		Vector3 RndVector( float length )
		{
			double xzyAngl = Generate.Random.NextDouble() * 2 * Math.PI;
			double xzAngl = Generate.Random.NextDouble() * 2 * Math.PI;
			float projection = (float) Math.Cos( xzyAngl );
			float yCoord = (float) Math.Sin( xzyAngl );
			float xCoord = (float) Math.Sin( xzAngl ) * projection;
			//float yCoord = (float) Math.Tan( xzAngl ) * projection;
			float zCoord = (float) Math.Cos( xzAngl ) * projection;

			return new Vector3( xCoord * length, yCoord * length, zCoord * length );

		}
	}
}