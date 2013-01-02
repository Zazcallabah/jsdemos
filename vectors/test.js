describe('given vectors', function(){
	describe('when subtracting', function(){
	it('zero vector from 1 results in same vector', function(){
		var v1 = vec({x:1,y:1,z:1});
		var v2 = vec({x:0,y:0,z:0});

		var result = v1.sub(v2);
		expect( result.x()).toBe( 1 );
		expect( result.y()).toBe( 1 );
		expect( result.z()).toBe( 1 );
	});
	it('same vector from same results in zero vector', function(){
		var v1 = vec({x:1,y:1,z:1});
		var v2 = vec({x:1,y:1,z:1});

		var result = v1.sub(v2);
		expect( result.x()).toBe( 0 );
		expect( result.y()).toBe( 0 );
		expect( result.z()).toBe( 0 );
	});

	it('a vector from another', function(){
		var v1 = vec({x:3,y:2,z:1});
		var v2 = vec({x:1,y:2,z:3});

		var result = v1.sub(v2);
		expect( result.x()).toBe( 2 );
		expect( result.y()).toBe( 0 );
		expect( result.z()).toBe( -2 );
	});
	it('can subtract negative vector values', function(){
		var v1 = vec({x:3,y:2,z:-1});
		var v2 = vec({x:1,y:-2,z:3});

		var result = v1.sub(v2);
		expect( result.x()).toBe( 2 );
		expect( result.y()).toBe( 4 );
		expect( result.z()).toBe( -4 );
	});
	});
	describe('when cross multiplying' , function(){
		it('results in correct vector', function(){
			var v1 = vec({x:1,y:0,z:0});
			var v2 = vec({x:0,y:1,z:0});
			var result = v1.cross(v2);
			expect( result.x()).toBe( 0 );
			expect( result.y()).toBe( 0 );
			expect( result.z()).toBe( 1 );
		});
		it('results in correct vector', function(){
			var v1 = vec({x:0,y:1,z:0});
			var v2 = vec({x:1,y:0,z:0});
			var result = v1.cross(v2);
			expect( result.x()).toBe( 0 );
			expect( result.y()).toBe( 0 );
			expect( result.z()).toBe( 1 );
		});		
	});
	describe('when adding ', function(){
		it('results in correct vector', function(){
			var v1 = vec({x:4,y:1,z:9});
			var v2 = vec({x:-1,y:3,z:0});
			var result = v1.add(v2);
			expect( result.x()).toBe( 3 );
			expect( result.y()).toBe( 4 );
			expect( result.z()).toBe( 9 );
		});
	});
	describe('when scaling', function(){
		it('to unit vector the vector has length 1', function(){
			var v = vec({x:5,y:0,z:0});
			var unit = v.unit();
			expect( unit.abs()).toBeCloseTo( 1, 8 );

			 v = vec({x:5,y:6,z:1});
			 unit = v.unit();
			expect( unit.abs()).toBeCloseTo(1, 14 );
		});
		it('to scalar correct vector is the result', function(){
			var v1 = vec({x:4,y:1,z:9});
			var result = v1.mul( 3 );
			expect( result.x()).toBe( 12 );
			expect( result.y()).toBe( 3 );
			expect( result.z()).toBe( 27 );
		});
	});


});

describe( 'given a viewport',function(){
	describe('when rotating viewport', function(){
		it('directional vectors are unit vectors', function(){
			var vp = makeView(vec());
			vp.rotate( makeRotational(0.4) );

			expect( vp.u().abs() ).toBeCloseTo(1,10);
			expect( vp.n().abs() ).toBeCloseTo(1,10);
			expect( vp.v().abs() ).toBeCloseTo(1,10);
		});
		it('u and v are orthogonal', function(){
			var vp = makeView(vec());
			vp.rotate( makeRotational(0.4) );

			expect( vp.u().dot( vp.v() ) ).toBeCloseTo(0,10);
			expect( vp.v().dot( vp.u() ) ).toBeCloseTo(0,10);
			expect( vp.v().dot( vp.n() ) ).toBeCloseTo(0,10);
		});
		it('rotates to correct position', function(){
			var vp = makeView(vec());
			vp.rotate( makeRotational(Math.PI/2) );

			expect( vp.u().x() ).toBeCloseTo(1,10);
			expect( vp.u().y() ).toBeCloseTo(0,10);
			expect( vp.u().z() ).toBeCloseTo(0,10);
			expect( vp.v().x() ).toBeCloseTo(0,10);
			expect( vp.v().y() ).toBeCloseTo(0,10);
			expect( vp.v().z() ).toBeCloseTo(-1,10);
			expect( vp.n().x() ).toBeCloseTo(0,10);
			expect( vp.n().y() ).toBeCloseTo(1,10);
			expect( vp.n().z() ).toBeCloseTo(0,10);
		});
	});
});