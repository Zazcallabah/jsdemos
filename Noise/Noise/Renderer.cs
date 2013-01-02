using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Text;
using System.Threading;
using System.Windows.Forms;
using Microsoft.DirectX;
using Microsoft.DirectX.Direct3D;
using Noise.Actors;
using Noise.Actors.Camera;
using Noise.Actors.MinorObjects;
using Noise.Actors.Terrain;
using Noise.Generators;
using Noise.Helpers;

namespace Noise
{
	public class Renderer : Form, ICanPaint
	{
		private Microsoft.DirectX.Direct3D.Device device;
		DateTime? paused;
		TimeSpan _pausedDelay;
		IEnumerable<IActor> actors;
		ControlledCamera controlledCamera;
		List<Keys> _currentlyPressedKeys = new List<Keys>();
		readonly Synchronizer sync;

		public Renderer()
		{
			this.MouseUp += new MouseEventHandler( Renderer_MouseUp );
			//			this.KeyPress += new KeyPressEventHandler( Renderer_KeyPress );
			this.KeyDown += new KeyEventHandler( Renderer_KeyDown );
			this.KeyUp += new KeyEventHandler( Renderer_KeyUp );
			this.Closing += new CancelEventHandler( Renderer_Closing );
			this.SetStyle( ControlStyles.AllPaintingInWmPaint | ControlStyles.Opaque, true );
			FormBorderStyle = System.Windows.Forms.FormBorderStyle.Fixed3D;
			this.Text = "Noise";
			this.Size = new Size( 700, 500 );
			paused = null;
			controlledCamera = new ControlledCamera();
			_pausedDelay = new TimeSpan();
			sync = new Synchronizer( this, 120 );
		}

		void Renderer_Closing( object sender, CancelEventArgs e )
		{
			sync.Break();
		}

		void Renderer_KeyUp( object sender, KeyEventArgs e )
		{
			_currentlyPressedKeys.RemoveAll( k => e.KeyCode.Equals( k ) );
		}

		void InterpretPressedKeys()
		{
			foreach( var k in this._currentlyPressedKeys )
				controlledCamera.Interpret( k );

		}

		void Renderer_KeyDown( object sender, KeyEventArgs e )
		{
			if( !_currentlyPressedKeys.Contains( e.KeyCode ) )
				_currentlyPressedKeys.Add( e.KeyCode );
			InterpretPressedKeys();
		}


		void Renderer_MouseUp( object sender, MouseEventArgs e )
		{
			if( e.Button == MouseButtons.Right )
			{
				if( paused == null )
					paused = DateTime.Now;
				else
				{
					_pausedDelay = _pausedDelay.Add( DateTime.Now.Subtract( paused.Value ) );
					paused = null;
				}
			}
			else if( e.Button == MouseButtons.Left )
			{
				device.RenderState.FillMode = device.RenderState.FillMode == FillMode.WireFrame ? FillMode.Solid : FillMode.WireFrame;
			}
		}


		public void InitializeDevice()
		{
			PresentParameters presentParams = new PresentParameters();
			presentParams.Windowed = true;
			presentParams.EnableAutoDepthStencil = true;
			presentParams.AutoDepthStencilFormat = DepthFormat.D16;
			presentParams.SwapEffect = SwapEffect.Discard;

			device = new Device( 0, DeviceType.Hardware, this, CreateFlags.SoftwareVertexProcessing, presentParams );
			device.Transform.Projection = Matrix.PerspectiveFovLH( (float) Math.PI / 4, 1f, 1f, 500f );
			device.RenderState.Lighting = true;
			device.RenderState.ZBufferEnable = false;
			actors = new IActor[] {
			//	new StaticCamera(), new OrbitDemoActor(device) };
					new SimpleCameraMovement(new Vector3(0,0,0), 100f,50f,0.4.Minutes()),
		//	new StaticCamera(),
				//new RotatingCameraMovement( new Vector3(-100,50,0), new Vector3( 200,30,0),15.Seconds(),7.Seconds() ),
					new LightManagement(),
					new TiledTerrain( device, 400, 100, -100, -100,
						new ScaleTransform(
							new Chord(
								new FloatNoise(),
								new List<TransformData> {
									new TransformData { OutWeigth = 1.5f, ScaleX = 0.1f, ScaleY = 0.1f, ScaleZ = 1 },
									new TransformData { OutWeigth = .3f, ScaleX = .5f, ScaleY = .5f, ScaleZ = 1 },
									new TransformData { OutWeigth = .05f, ScaleX = 1, ScaleY = 1, ScaleZ = 1 },
								}),0.1f,0.1f,0.01f,50),new AnimationData(false)) };
			//			                new SimpleCameraMovement( new Vector3(), 3f, 2 ), new SimpleActor(device) };
			//	new SimpleCameraMovement( new Vector3( 50, 18, 50 ), 20, 15 ), new TerrainGen( 10, 100 ) };
			sync.Start();
		}

		public void Repaint()
		{
			try
			{

				device.Clear( ClearFlags.Target | ClearFlags.ZBuffer, Color.DeepSkyBlue, 1.0f, 0 );

				device.BeginScene();
				foreach( var actor in actors )
					actor.Poke( paused == null ? DateTime.Now.Subtract( _pausedDelay ) : paused.Value.Subtract( _pausedDelay ), device );

				device.EndScene();
				device.Present();
			}
			catch( GraphicsException e )
			{
				Debug.WriteLine( e );
				Application.Exit();
			}
		}


	}
}