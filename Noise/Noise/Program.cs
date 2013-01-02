using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows.Forms;

namespace Noise
{
	static class Program
	{


		static void Main()
		{
			using( var mainForm = new Renderer() )
			{
				mainForm.InitializeDevice();

				Application.Run( mainForm );

			}
		}
	}
}
