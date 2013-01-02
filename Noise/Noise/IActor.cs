using System;
using Microsoft.DirectX.Direct3D;

namespace Noise
{
	public interface IActor
	{
		void Poke( DateTime timestamp, Device world );
	}
}