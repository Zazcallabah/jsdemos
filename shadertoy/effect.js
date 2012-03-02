var vsSource = [
    "attribute vec2 pos;",
//    "varying vec2 p;",
    "void main()",
    "{",
  //      "p=pos;",
        "gl_Position = vec4(pos.x,pos.y,0.0,1.0);",
    "}"
    ].join("\n");


var fsSource = [
    "void main()",
    "{",
        "gl_FragColor = vec4(0.0,0.0,0.0,1.0);",
    "}"
    ].join("\n");

//--------------------------------------

function createGLTexture(ctx, image, texture)
{
    ctx.enable(ctx.TEXTURE_2D);
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    //ctx.texImage2D(ctx.TEXTURE_2D, 0, image);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_LINEAR);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.REPEAT);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.REPEAT);
    ctx.generateMipmap(ctx.TEXTURE_2D)
    ctx.bindTexture(ctx.TEXTURE_2D, null);
}
function loadImageTexture(gl, url)
{
    var texture = gl.createTexture();
    texture.image = new Image();
    texture.image.crossOrigin = '';
    texture.image.onload = function() { createGLTexture(gl, texture.image, texture) }
    texture.image.src = url;
    return texture;
}


function Effect(gl,xres,yres)
{
    this.mGLContext = gl;
    this.mQuadVBO = null;
    this.mProgram = null;
    this.mXres = xres;
    this.mYres = yres;
    this.mTexture0 = null;
    this.mTexture1 = null;
    this.mTexture2 = null;
    this.mTexture3 = null;

//    this.NewShader(fsSource);

    //-------------
    //var vertices = new WebGLFloatArray([ -1., -1.,   1., -1.,    -1.,  1.,     1., -1.,    1.,  1.,    -1.,  1.]);
    var vertices = new Float32Array([ -1., -1.,   1., -1.,    -1.,  1.,     1., -1.,    1.,  1.,    -1.,  1.]);

    this.mQuadVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.mQuadVBO);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var res = this.NewShader(fsSource);
    // alert( res );
}


Effect.prototype.NewTexture = function(slot,txt)
{
    var gl = this.mGLContext;

    var tmpTexture = (txt=="")?null:loadImageTexture(gl, txt);

    if( slot==0 ) { if( this.mTexture0!=null ) gl.deleteTexture(this.mTexture0); this.mTexture0 = tmpTexture; }
    if( slot==1 ) { if( this.mTexture1!=null ) gl.deleteTexture(this.mTexture1); this.mTexture1 = tmpTexture; }
    if( slot==2 ) { if( this.mTexture2!=null ) gl.deleteTexture(this.mTexture2); this.mTexture2 = tmpTexture; }
    if( slot==3 ) { if( this.mTexture3!=null ) gl.deleteTexture(this.mTexture3); this.mTexture3 = tmpTexture; }
}

Effect.prototype.NewShader = function(shaderCode)
{
    var gl = this.mGLContext;

    var tmpProgram = gl.createProgram();

    var vs = gl.createShader(gl.VERTEX_SHADER);
    var fs = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vs, vsSource);
    gl.shaderSource(fs, shaderCode);

    gl.compileShader(vs);
    gl.compileShader(fs);

    //-------------
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
    {
        var infoLog = gl.getShaderInfoLog(vs);
        gl.deleteProgram( tmpProgram );
        return "VS ERROR: " + infoLog;;
    }

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
    {
        var infoLog = gl.getShaderInfoLog(fs);
        gl.deleteProgram( tmpProgram );
        return "FS ERROR: " + infoLog;
    }

    //-------------

    gl.attachShader(tmpProgram, vs);
    gl.attachShader(tmpProgram, fs);

    gl.deleteShader(vs);
    gl.deleteShader(fs);

    gl.linkProgram(tmpProgram);

    if( this.mProgram != null )
        gl.deleteProgram( this.mProgram );

    this.mProgram = tmpProgram;

    return "Shader compiled successfully";
}

Effect.prototype.SetSize = function(xres,yres)
{
    this.mXres = xres;
    this.mYres = yres;
}

Effect.prototype.Paint = function(time, mouseOriX, mouseOriY, mousePosX, mousePosY)
{

    var gl = this.mGLContext;

    gl.viewport( 0, 0, this.mXres, this.mYres );

    gl.useProgram(this.mProgram);

    var l1 = gl.getAttribLocation(this.mProgram, "pos");
    var l2 = gl.getUniformLocation(this.mProgram, "time");
    var l3 = gl.getUniformLocation(this.mProgram, "resolution");
    var l4 = gl.getUniformLocation(this.mProgram, "mouse");

    var t0 = gl.getUniformLocation(this.mProgram, "tex0");
    var t1 = gl.getUniformLocation(this.mProgram, "tex1");
    var t2 = gl.getUniformLocation(this.mProgram, "tex2");
    var t3 = gl.getUniformLocation(this.mProgram, "tex3");

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mQuadVBO);
    if( l2!=null ) gl.uniform1f(l2, time);
    if( l3!=null ) gl.uniform2f(l3, this.mXres, this.mYres);
    if( l4!=null ) gl.uniform4f(l4, mousePosX, this.mYres-1-mousePosY, mouseOriX, this.Yres-1-mouseOriY);

    gl.vertexAttribPointer(l1, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(l1);

    if( t0!=null ) { gl.uniform1i(t0, 0 ); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.mTexture0); }
    if( t1!=null ) { gl.uniform1i(t1, 1 ); gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.mTexture1); }
    if( t2!=null ) { gl.uniform1i(t2, 2 ); gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.mTexture2); }
    if( t3!=null ) { gl.uniform1i(t3, 3 ); gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, this.mTexture3); }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.disableVertexAttribArray(l1);
}
