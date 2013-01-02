using System;
using System.IO;

namespace HashName
{
	class Program
	{
		static void Main( string[] args )
		{
			string targetFileName = "Noise.exe"; // default name
			string targetFolder = ".";
			if( args.Length > 0 )
				targetFileName = args[0];
			if( args.Length > 1 )
				targetFolder = args[1];


			if( !File.Exists( targetFileName ) )
			{
				Console.WriteLine( "Can't find target file \"{0}\"", targetFileName );
				return;
			}

			if( File.Exists( targetFolder ) )
			{
				Console.WriteLine( "Target folder \"{0}\" is a file, cant continue.", targetFolder );
				return;
			}


			var namer = new Crc32();
			try
			{
				var hash = namer.GetCrc32( File.OpenRead( targetFileName ) ).AsHex();

				var hashname = string.Concat( hash, ".exe" );

				if( hashname != targetFileName )
				{
					var fi = new FileInfo( targetFileName );
					if( !Directory.Exists( targetFolder ) )
					{
						Console.WriteLine( "Target folder \"{0}\" doesn't exist, creating.", targetFolder );
						Directory.CreateDirectory( targetFolder );
					}
					string destination = Path.Combine( targetFolder, hashname );
					Console.WriteLine( "Copying {0} to {1}", targetFileName, destination );
					fi.CopyTo( destination );
				}
			}
			catch( IOException ioe ) { Console.WriteLine( ioe ); }

		}
	}
}
