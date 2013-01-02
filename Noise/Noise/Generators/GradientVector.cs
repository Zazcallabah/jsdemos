namespace Noise.Generators
{
	public struct GradientVector
	{
		public float X { get; set; }
		public float Y { get; set; }
		public float Z { get; set; }

		public static GradientVector operator -( GradientVector v1, GradientVector v2 )
		{
			return v1 + ( -1f ) * v2;
		}

		public static GradientVector operator +( GradientVector v1, GradientVector v2 )
		{
			return new GradientVector { X = v1.X + v2.X, Y = v1.Y + v2.Y, Z = v1.Z + v2.Z };
		}

		public static float operator *( GradientVector v1, GradientVector v2 )
		{
			return v1.X * v2.X + v1.Y * v2.Y + v1.Z * v2.Z;
		}

		public static GradientVector operator *( GradientVector v, int scalar )
		{
			return v * (float) scalar;
		}
		public static GradientVector operator *( int scalar, GradientVector v )
		{
			return v * (float) scalar;
		}
		public static GradientVector operator *( float scalar, GradientVector v )
		{
			return v * scalar;
		}

		public static GradientVector operator *( GradientVector v, float scalar )
		{
			return new GradientVector { X = v.X * scalar, Y = v.Y * scalar, Z = v.Z * scalar };
		}
	}
}