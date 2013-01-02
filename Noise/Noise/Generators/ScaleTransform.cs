using System;

namespace Noise.Generators
{
	public class ScaleTransform : ITransformNoise
	{
		readonly IMakeNoise _maker;
		readonly float _scaleX;
		readonly float _scaleY;
		readonly float _scaleZ;
		readonly float _scaleOut;

		// parameter range [0-1]
		public ScaleTransform( IMakeNoise maker, float scaleX, float scaleY, float scaleZ, float scaleOut )
		{
			_maker = maker;
			_scaleX = scaleX;
			_scaleY = scaleY;
			_scaleZ = scaleZ;
			_scaleOut = scaleOut;
		}

		public float Noise( float x, float y, float z )
		{
			var height = _maker.Noise( x * _scaleX, y * _scaleY, z * _scaleZ );
			return height * _scaleOut;
		}

		public float OutScale
		{
			get { return _scaleOut; }
		}
	}
}