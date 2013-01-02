using System;
using System.Collections.Generic;
using Microsoft.DirectX.Direct3D;

namespace Noise.Actors
{
	public class ActorGroup : IActor
	{
		readonly IEnumerable<IActor> _actors;
		readonly Action<DateTime, Device> _groupedTransform;

		public ActorGroup( IEnumerable<IActor> actors, Action<DateTime, Device> groupedTransform )
		{
			_actors = actors;
			_groupedTransform = groupedTransform;
		}

		public void Poke( DateTime timestamp, Device world )
		{
			if( _groupedTransform != null )
			{
				_groupedTransform( timestamp, world );
			}

			if( _actors != null )
				foreach( var actor in _actors )
				{
					actor.Poke( timestamp, world );
				}

		}
	}
}