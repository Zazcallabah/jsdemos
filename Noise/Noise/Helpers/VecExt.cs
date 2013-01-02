using Microsoft.DirectX;

namespace Noise.Helpers
{
	public static class VecExt
	{
		public static Vector3 Cross( this Vector3 v1, Vector3 v2 )
		{
			return
				(
					new Vector3
						(
						v1.Y * v2.Z - v1.Z * v2.Y,
						v1.Z * v2.X - v1.X * v2.Z,
						v1.X * v2.Y - v1.Y * v2.X
						)
					);
		}
	}
}