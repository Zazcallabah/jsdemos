using System;

namespace Noise
{
	/// <summary>
	/// Generates pseudo-random numbers using the Mersenne Twister algorithm.
	/// See <a href="http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html">
	/// http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html</a> for details
	/// on the algorithm.
	/// </summary>
	/// <remarks>
	/// Copyright 2007-2008 Rory Plaire (codekaizen@gmail.com)
	/// 
	/// Adapted from:
	/// 
	/// ------------------------------------------------------------------------
	///       C# Version Copyright (C) 2001-2004 Akihilo Kramot (Takel).      */
	///                                                                       */
	/// C# porting from a C-program for MT19937, originaly coded by           */
	/// Takuji Nishimura and Makoto Matsumoto, considering the suggestions by */
	/// Topher Cooper and Marc Rieffel in July-Aug. 1997.                     */
	/// This library is free software under the Artistic license:             */
	///                                                                       */
	/// You can find the original C-program at                                */
	///     http://www.math.keio.ac.jp/~matumoto/mt.html                      */
	///                                                                       */
	/// ----------------------------------------------------------------------
	/// 
	/// and:
	///
	/// //////////////////////////////////////////////////////////////////////////
	/// C# Version Copyright (c) 2003 CenterSpace Software, LLC                 //
	///                                                                         //
	/// This code is free software under the Artistic license.                  //
	///                                                                         //
	/// CenterSpace Software                                                    //
	/// 2098 NW Myrtlewood Way                                                  //
	/// Corvallis, Oregon, 97330                                                //
	/// USA                                                                     //
	/// http://www.centerspace.net                                              //
	/// //////////////////////////////////////////////////////////////////////////
	///
	/// and, of course:
	///
	///   A C-program for MT19937, with initialization improved 2002/2/10.
	///   Coded by Takuji Nishimura and Makoto Matsumoto.
	///   This is a faster version by taking Shawn Cokus's optimization,
	///   Matthe Bellew's simplification, Isaku Wada's real version.
	///
	///   Before using, initialize the state by using init_genrand(seed) 
	///   or init_by_array(init_key, key_length).
	///
	///   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
	///   All rights reserved.                          
	///
	///   Redistribution and use in source and binary forms, with or without
	///   modification, are permitted provided that the following conditions
	///   are met:
	///
	///	 1. Redistributions of source code must retain the above copyright
	///		notice, this list of conditions and the following disclaimer.
	///
	///	 2. Redistributions in binary form must reproduce the above copyright
	///		notice, this list of conditions and the following disclaimer in the
	///		documentation and/or other materials provided with the distribution.
	///
	///	 3. The names of its contributors may not be used to endorse or promote 
	///		products derived from this software without specific prior written 
	///		permission.
	///
	///   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	///   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	///   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	///   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
	///   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	///   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	///   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
	///   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
	///   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
	///   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	///   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	///
	///
	///   Any feedback is very welcome.
	///   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
	///   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
	///
	/// </remarks>
	public class MersenneTwister : Random
	{
		#region Private fields
		const double FiftyThreeBitsOf1S = 9007199254740991.0;
		const double Inverse53BitsOf1S = 1.0 / FiftyThreeBitsOf1S;
		const double InverseOnePlus53BitsOf1S = 1.0 / OnePlus53BitsOf1S;
		const uint LowerMask = 0x7fffffff; /* least significant r bits */
		const int M = 397;
		const uint MatrixA = 0x9908b0df; /* constant vector a */
		const int N = 624;
		const double OnePlus53BitsOf1S = FiftyThreeBitsOf1S + 1;
		const uint TemperingMaskB = 0x9d2c5680;
		const uint TemperingMaskC = 0xefc60000;
		const uint UpperMask = 0x80000000; /* most significant w-r bits */
		static readonly uint[] Mag01 = { 0x0, MatrixA };
		readonly uint[] _mt = new uint[N]; /* the array for the state vector  */
		short _mti;
		#endregion

		/// <summary>
		/// Creates a new pseudo-random number generator with a given seed.
		/// </summary>
		/// <param name="seed">A value to use as a seed.</param>
		public MersenneTwister( uint seed )
		{
			Init( seed );
		}

		/// <summary>
		/// Returns the next pseudo-random <see cref="UInt32"/>.
		/// </summary>
		/// <returns>A pseudo-random <see cref="UInt32"/> value.</returns>
		public virtual uint NextUInt()
		{
			return GenerateUInt32();
		}

		/// <summary>
		/// Returns the next pseudo-random <see cref="UInt32"/> 
		/// up to <paramref name="maxValue"/>.
		/// </summary>
		/// <param name="maxValue">
		/// The maximum value of the pseudo-random number to create.
		/// </param>
		/// <returns>
		/// A pseudo-random <see cref="UInt32"/> value which is at most <paramref name="maxValue"/>.
		/// </returns>
		public virtual uint NextUInt( uint maxValue )
		{
			return (uint) ( GenerateUInt32() / ( (double) UInt32.MaxValue / maxValue ) );
		}
		/// <summary>
		/// Get a normal distributed value  centered around the parameter mean and with the given deviation
		/// </summary>
		/// <param name="mean">The mean value of the distribution</param>
		/// <param name="deviation">The deviation of the distribution</param>
		/// <returns>The random value.</returns>
		public double NextNormal( double mean, double deviation )
		{
			// algorithm from ftp://ftp.taygeta.com/pub/c/boxmuller.c
			double x1, w;

			do
			{
				x1 = ( 2.0 * NextDouble() ) - 1.0;
				double x2 = ( 2.0 * NextDouble() ) - 1.0;
				w = ( x1 * x1 ) + ( x2 * x2 );
			} while( w >= 1.0 );

			w = Math.Sqrt( ( -2.0 * Math.Log( w ) ) / w );

			return mean + ( x1 * w * deviation );
		}

		/// <summary>
		/// Get an exponentially distrubuted value with parameter mean as  1/lambda
		/// </summary>
		/// <param name="mean">The mean value of the distribution</param>
		/// <returns>The random value.</returns>
		public double NextExponential( double mean )
		{
			return -mean * Math.Log( NextDouble() );
		}

		/// <summary>
		/// Get a triangularly distributed value with set parameters.
		/// </summary>
		/// <param name="start">The start point of the distribution.</param>
		/// <param name="end">The end point of the destribution.</param>
		/// <param name="peak">The peak point of the distribution.</param>
		/// <returns></returns>
		public double NextTriangular( double start, double end, double peak )
		{
			double randomValue = NextDouble();

			if( randomValue <= ( peak - start ) / ( end - start ) )
				randomValue = start + Math.Sqrt( randomValue * ( end - start ) * ( peak - start ) );
			else
				randomValue = end - Math.Sqrt( ( 1 - randomValue ) * ( end - start ) * ( end - peak ) );
			return randomValue;
		}

		/// <summary>
		/// Returns the next pseudo-random <see cref="UInt32"/> at least 
		/// <paramref name="minValue"/> and up to <paramref name="maxValue"/>.
		/// </summary>
		/// <param name="minValue">The minimum value of the pseudo-random number to create.</param>
		/// <param name="maxValue">The maximum value of the pseudo-random number to create.</param>
		/// <returns>
		/// A pseudo-random <see cref="UInt32"/> value which is at least 
		/// <paramref name="minValue"/> and at most <paramref name="maxValue"/>.
		/// </returns>
		/// <exception cref="ArgumentOutOfRangeException">
		/// If <c><paramref name="minValue"/> &gt;= <paramref name="maxValue"/></c>.
		/// </exception>
		public virtual uint NextUInt( uint minValue, uint maxValue )
		{
			if( minValue >= maxValue )
				throw new ArgumentOutOfRangeException();

			return (uint) ( GenerateUInt32() / ( (double) UInt32.MaxValue / ( maxValue - minValue ) ) + minValue );
		}

		/// <summary>
		/// Returns the next pseudo-random <see cref="Int32"/>.
		/// </summary>
		/// <returns>A pseudo-random <see cref="Int32"/> value.</returns>
		public override int Next()
		{
			return Next( Int32.MaxValue );
		}

		/// <summary>
		/// Returns the next pseudo-random <see cref="Int32"/> up to <paramref name="maxValue"/>.
		/// </summary>
		/// <param name="maxValue">The maximum value of the pseudo-random number to create.</param>
		/// <returns>
		/// A pseudo-random <see cref="Int32"/> value which is at most <paramref name="maxValue"/>.
		/// </returns>
		/// <exception cref="ArgumentOutOfRangeException">
		/// When <paramref name="maxValue"/> &lt; 0.
		/// </exception>
		public override int Next( int maxValue )
		{
			if( maxValue <= 1 )
			{
				if( maxValue < 0 )
					throw new ArgumentOutOfRangeException();
				return 0;
			}

			return (int) ( NextDouble() * maxValue );
		}

		/// <summary>
		/// Returns the next pseudo-random <see cref="Int32"/> 
		/// at least <paramref name="minValue"/> 
		/// and up to <paramref name="maxValue"/>.
		/// </summary>
		/// <param name="minValue">The minimum value of the pseudo-random number to create.</param>
		/// <param name="maxValue">The maximum value of the pseudo-random number to create.</param>
		/// <returns>A pseudo-random Int32 value which is at least <paramref name="minValue"/> and at 
		/// most <paramref name="maxValue"/>.</returns>
		/// <exception cref="ArgumentOutOfRangeException">
		/// If <c><paramref name="minValue"/> &gt;= <paramref name="maxValue"/></c>.
		/// </exception>
		public override int Next( int minValue, int maxValue )
		{
			if( maxValue <= minValue )
				throw new ArgumentOutOfRangeException();
			if( maxValue == minValue )
				return minValue;
			return Next( maxValue - minValue ) + minValue;
		}

		/// <summary>
		/// Fills a buffer with pseudo-random bytes.
		/// </summary>
		/// <param name="buffer">The buffer to fill.</param>
		/// <exception cref="ArgumentNullException">
		/// If <c><paramref name="buffer"/> == <see langword="null"/></c>.
		/// </exception>
		public override void NextBytes( byte[] buffer )
		{
			// [codekaizen: corrected this to check null before checking length.]
			if( buffer == null )
				throw new ArgumentNullException();

			int bufLen = buffer.Length;

			for( int idx = 0; idx < bufLen; ++idx )
				buffer[idx] = (byte) Next( 256 );
		}

		/// <summary>
		/// Returns the next pseudo-random <see cref="Double"/> value.
		/// </summary>
		/// <returns>A pseudo-random double floating point value.</returns>
		/// <remarks>
		/// <para>
		/// There are two common ways to create a double floating point using MT19937: 
		/// using <see cref="GenerateUInt32"/> and dividing by 0xFFFFFFFF + 1, 
		/// or else generating two double words and shifting the first by 26 bits and 
		/// adding the second.
		/// </para>
		/// <para>
		/// In a newer measurement of the randomness of MT19937 published in the 
		/// journal "Monte Carlo Methods and Applications, Vol. 12, No. 5-6, pp. 385 – 393 (2006)"
		/// entitled "A Repetition Test for Pseudo-Random Number Generators",
		/// it was found that the 32-bit version of generating a double fails at the 95% 
		/// confidence level when measuring for expected repetitions of a particular 
		/// number in a sequence of numbers generated by the algorithm.
		/// </para>
		/// <para>
		/// Due to this, the 53-bit method is implemented here and the 32-bit method
		/// of generating a double is not. If, for some reason,
		/// the 32-bit method is needed, it can be generated by the following:
		/// <code>
		/// (Double)NextUInt32() / ((UInt64)UInt32.MaxValue + 1);
		/// </code>
		/// </para>
		/// </remarks>
		public override double NextDouble()
		{
			return Compute53BitRandom( 0, InverseOnePlus53BitsOf1S );
		}

		/// <summary>
		/// Returns a pseudo-random number greater than or equal to zero, and 
		/// either strictly less than one, or less than or equal to one, 
		/// depending on the value of the given parameter.
		/// </summary>
		/// <param name="includeOne">
		/// If <see langword="true"/>, the pseudo-random number returned will be 
		/// less than or equal to one; otherwise, the pseudo-random number returned will
		/// be strictly less than one.
		/// </param>
		/// <returns>
		/// If <paramref name="includeOne"/> is <see langword="true"/>, 
		/// this method returns a double-precision pseudo-random number greater than 
		/// or equal to zero, and less than or equal to one. 
		/// If <paramref name="includeOne"/> is <see langword="false"/>, this method
		/// returns a double-precision pseudo-random number greater than or equal to zero and
		/// strictly less than one.
		/// </returns>
		public double NextDouble( bool includeOne )
		{
			return includeOne ? Compute53BitRandom( 0, Inverse53BitsOf1S ) : NextDouble();
		}

		/// <summary>
		/// Returns a pseudo-random number greater than 0.0 and less than 1.0.
		/// </summary>
		/// <returns>A pseudo-random number greater than 0.0 and less than 1.0.</returns>
		public double NextDoublePositive()
		{
			return Compute53BitRandom( 0.5, Inverse53BitsOf1S );
		}

		/// <summary>
		/// Generates a new pseudo-random <see cref="UInt32"/>.
		/// </summary>
		/// <returns>A pseudo-random <see cref="UInt32"/>.</returns>
		protected uint GenerateUInt32()
		{
			uint y;

			/* Mag01[x] = x * MatrixA  for x=0,1 */
			if( _mti >= N ) /* generate N words at one time */
			{
				short kk = 0;

				for( ; kk < N - M; ++kk )
				{
					y = ( _mt[kk] & UpperMask ) | ( _mt[kk + 1] & LowerMask );
					_mt[kk] = _mt[kk + M] ^ ( y >> 1 ) ^ Mag01[y & 0x1];
				}

				for( ; kk < N - 1; ++kk )
				{
					y = ( _mt[kk] & UpperMask ) | ( _mt[kk + 1] & LowerMask );
					_mt[kk] = _mt[kk + ( M - N )] ^ ( y >> 1 ) ^ Mag01[y & 0x1];
				}

				y = ( _mt[N - 1] & UpperMask ) | ( _mt[0] & LowerMask );
				_mt[N - 1] = _mt[M - 1] ^ ( y >> 1 ) ^ Mag01[y & 0x1];

				_mti = 0;
			}

			y = _mt[_mti++];
			y ^= TemperingShiftU( y );
			y ^= TemperingShiftS( y ) & TemperingMaskB;
			y ^= TemperingShiftT( y ) & TemperingMaskC;
			y ^= TemperingShiftL( y );

			return y;
		}

		static uint TemperingShiftU( uint y )
		{
			return ( y >> 11 );
		}

		static uint TemperingShiftS( uint y )
		{
			return ( y << 7 );
		}

		static uint TemperingShiftT( uint y )
		{
			return ( y << 15 );
		}

		static uint TemperingShiftL( uint y )
		{
			return ( y >> 18 );
		}

		void Init( uint seed )
		{
			_mt[0] = seed & 0xffffffffU;

			for( _mti = 1; _mti < N; _mti++ )
			{
				_mt[_mti] = (uint) ( 1812433253U * ( _mt[_mti - 1] ^ ( _mt[_mti - 1] >> 30 ) ) + _mti );
				// See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. 
				// In the previous versions, MSBs of the seed affect   
				// only MSBs of the array _mt[].                        
				// 2002/01/09 modified by Makoto Matsumoto             
				_mt[_mti] &= 0xffffffffU;
				// for >32 bit machines
			}
		}

		/// <summary>
		/// </summary>
		/// <remarks>9007199254740991.0 is the maximum double value which the 53 significand
		/// can hold when the exponent is 0.
		/// </remarks>
		double Compute53BitRandom( double translate, double scale )
		{
			// get 27 pseudo-random bits
			ulong a = (ulong) GenerateUInt32() >> 5;
			// get 26 pseudo-random bits
			ulong b = (ulong) GenerateUInt32() >> 6;

			// shift the 27 pseudo-random bits (a) over by 26 bits (* 67108864.0) and
			// add another pseudo-random 26 bits (+ b).
			return ( ( a * 67108864.0 + b ) + translate ) * scale;

			// What about the following instead of the above? Is the multiply better? 
			// Why? (Is it the FMUL instruction? Does this count in .Net? Will the JITter notice?)
			//return BitConverter.Int64BitsToDouble((a << 26) + b));
		}
	}
}