using Microsoft.DirectX.Direct3D;

namespace Noise
{
	public interface IDrawTriangles
	{
		void Draw( Device world, float[][] coords );
		void Flush( Device world );
	}
}