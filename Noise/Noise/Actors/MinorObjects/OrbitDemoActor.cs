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
	public class OrbitDemoActor
		: IActor
	{
		readonly Texture _texture;
		public OrbitDemoActor( Device world )
		{

			world.RenderState.SourceBlend = Blend.One;
			world.RenderState.DestinationBlend = Blend.DestinationColor;

			world.RenderState.PointSpriteEnable = true;
			world.RenderState.PointScaleEnable = true;
			world.RenderState.PointScaleC = 50;

			_texture = TextureLoader.FromFile( world, "faded.png" );
		}


		public void Poke( DateTime timestamp, Device world )
		{
			world.RenderState.AlphaBlendEnable = true;
			world.SetTexture( 0, _texture );

			world.VertexFormat = VertexFormats.Position | VertexFormats.PointSize | VertexFormats.Diffuse;
			var sprite = new[] { new SpriteVertexFormat { Position = timestamp.Orbit(), PointSize = 5f, Color = Color.Transparent.ToArgb() } };

			world.DrawUserPrimitives( PrimitiveType.PointList, 1, sprite );
			world.RenderState.AlphaBlendEnable = false;
		}
	}
}