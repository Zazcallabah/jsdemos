using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Drawing.Text;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Windows.Forms;
using Microsoft.DirectX;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Noise;

namespace NoiseTest
{
	/// <summary>
	/// Summary description for PerlinTests
	/// </summary>
	[TestClass]
	public class PerlinTests
	{
		[TestMethod]
		public void oeu()
		{
			DateTime? one = new DateTime?( new DateTime( 2003, 2, 2 ) );
			DateTime? two = new DateTime?( new DateTime( 2003, 2, 2 ) );
			DateTime? three = new DateTime?( new DateTime( 2003, 3, 2 ) );
			DateTime? nul = new DateTime?();
			Assert.AreEqual( one, two );
			Assert.AreNotEqual( two, three );
			Assert.AreNotEqual( two, nul);
		}

		[TestMethod]
		public void m()
		{
			string[] s = new []{"aoeu","aoeu21","a","eee"};

			var s2 = s.Skip(1).Take(4).ToArray();

			Assert.AreEqual( 3, s2.Length );
		}

		[TestMethod]
		public void makeimg()
		{
			var n = new Noise.Generators.AlphaFadingImage( Color.HotPink );
			var b = n.Image( 50, 2 );
			b.Save( "faded.png", ImageFormat.Png );
		}

		[TestMethod]
		public void testdivide()
		{
			var v = new Vector3( 1, 1, 1 );

		}

		[TestMethod]
		public void TestMethod1()
		{
			LolGraph g = new LolGraph();
			Application.Run( g );

		}
	}
}


















