using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Microsoft.DirectX;
using Microsoft.DirectX.DirectSound;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Noise;
using Noise.Helpers;

namespace NoiseTest
{
	/// <summary>
	/// Summary description for UnitTest1
	/// </summary>
	[TestClass]
	public class WorkBench
	{
		[TestMethod]
		public void Test()
		{

			var t = DateTime.Now;
			var o = t.Cycle( 0, 1, 1.Minutes() );
			var l = t.AddSeconds( 1 ).Cycle( 0, 1, 1.Minutes() );
			Assert.AreEqual( 1.0 / 60, l - o );
		}

		[Ignore]
		[TestMethod]
		public void TestMethod1()
		{
			// Set up wave format 
			WaveFormat waveFormat = new WaveFormat();
			waveFormat.FormatTag = WaveFormatTag.Pcm;
			waveFormat.Channels = 1;
			waveFormat.BitsPerSample = 16;
			waveFormat.SamplesPerSecond = 44100;
			waveFormat.BlockAlign = (short) ( waveFormat.Channels * waveFormat.BitsPerSample / 8 );
			waveFormat.AverageBytesPerSecond = waveFormat.BlockAlign * waveFormat.SamplesPerSecond;

			// Set up buffer description 
			BufferDescription bufferDesc = new BufferDescription( waveFormat );
			bufferDesc.Control3D = false;
			bufferDesc.ControlEffects = false;
			bufferDesc.ControlFrequency = true;
			bufferDesc.ControlPan = true;
			bufferDesc.ControlVolume = true;
			bufferDesc.DeferLocation = true;
			bufferDesc.GlobalFocus = true;

			Device d = new Device();
			d.SetCooperativeLevel( new System.Windows.Forms.Control(), CooperativeLevel.Priority );


			int samples = 5 * waveFormat.SamplesPerSecond * waveFormat.Channels;
			char[] buffer = new char[samples];

			// Set buffer length 
			bufferDesc.BufferBytes = buffer.Length * waveFormat.BlockAlign;

			// Set initial amplitude and frequency 
			double frequency = 500;
			double amplitude = short.MaxValue / 3;
			double two_pi = 2 * Math.PI;

			// Iterate through time 
			for( int i = 0; i < buffer.Length; i++ )
			{
				// Add to sine 
				buffer[i] = (char) ( amplitude * Math.Sin( i * two_pi * frequency / waveFormat.SamplesPerSecond ) );
			}

			SecondaryBuffer bufferSound = new SecondaryBuffer( bufferDesc, d );
			bufferSound.Volume = (int) Volume.Max;
			bufferSound.Write( 0, buffer, LockFlag.None );
			bufferSound.Play( 0, BufferPlayFlags.Default );
			System.Threading.Thread.Sleep( 10000 );
		}
	}
}
