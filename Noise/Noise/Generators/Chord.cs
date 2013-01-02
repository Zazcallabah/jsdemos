using System.Collections.Generic;
using System.Linq;

namespace Noise.Generators
{
	public class Chord : IMakeNoise
	{
		readonly IEnumerable<TransformData> _chordset;
		readonly IMakeNoise _maker;
		public Chord( IMakeNoise maker, IEnumerable<TransformData> chordset )
		{
			_maker = maker;
			_chordset = chordset;
		}

		public float Noise( float x, float y, float z )
		{
			return _chordset.Sum( c => _maker.Noise( x * c.ScaleX, y * c.ScaleY, z * c.ScaleZ ) * c.OutWeigth );

		}
	}
}