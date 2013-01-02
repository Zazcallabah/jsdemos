using System;
using Noise.Helpers;

namespace Noise
{
	public struct AnimationData
	{
		public AnimationData( bool animate )
		{
			ShouldAnimate = animate;
			MinZ = 0;
			MaxZ = 1;
			AnimationLoopSpan = 0.Seconds();
			RenderSpan = 60.Minutes();
		}

		public float MinZ;
		public float MaxZ;
		public TimeSpan AnimationLoopSpan;
		public bool ShouldAnimate;
		public TimeSpan RenderSpan;
	}
}