describe('one star', function(){
	it('has methods', function(){
		var star = makeStar();
		expect( star.tick ).not.toBe( undefined );
		expect( star.cartesian ).not.toBe( undefined );
		expect( star.polar ).not.toBe( undefined );
		expect( star.draw ).not.toBe( undefined );
	});

	it('has cartesian coordinates', function(){
		var star = makeStar({startangle:0,starheight:.5,startposition:1},{viewportposition:0.2});
		expect( star.cartesian.y() ).toBe( 0 );
		expect( star.cartesian.x() ).toBe( 0.2*0.5 );
	});
	describe('when ticked', function(){
		it('has changed depth', function(){
			var star = makeStar({startangle:0,starheight:.5,startposition:1,starspeed:0.005,rotationspeed:0},{viewportposition:0.2});
			star.tick();
			expect( star.polar.depth ).toBe( 0.995 );
		});
		it('can loop to far away depth', function(){
			var star = makeStar({startangle:0,starheight:.5,startposition:0.001,starspeed:0.005,rotationspeed:0},{viewportposition:0.2});
			star.tick();
			expect( star.polar.depth ).toBe( 0.996 );
		});
	});
});



