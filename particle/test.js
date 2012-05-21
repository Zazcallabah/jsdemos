describe('projection', function(){
	it('of vector onto simple plane', function(){
		var v1 = vec({x:0,y:0,z:1});
		var v2 = vec({x:1,y:0,z:0});
		var p = plane({u:v1,v:v2});
		var v3 = vec( {x:1,y:1,z:1} ) ;
		var result = v3.projectOn(p);
		expect( result.x()).toBe( 1 );
		expect( result.y()).toBe( 0 );
		expect( result.z()).toBe( 1 );
	});
	it('of vector onto plane', function(){
		var v1 = vec({x:0,y:0,z:1});
		var v2 = vec({x:1,y:0,z:0});
		var p = plane({u:v1,v:v2});
		var v3 = vec( {x:2,y:2,z:2} ) ;
		var result = v3.projectOn(p);
		expect( result.x()).toBe( 2 );
		expect( result.y()).toBe( 0 );
		expect( result.z()).toBe( 2 );
	});
});
