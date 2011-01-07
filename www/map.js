
//The chunk data type
function Chunk(x, y, z, data)
{
	//Set chunk data
	this.data = data;
	
	//Set position
	this.x = x;
	this.y = y;
	this.z = z;
	
	//Leave vertex buffer currently empty for now
	this.vb = null;
	this.num_elements = null;
}

Chunk.prototype.DIMS = [32, 32, 32];

Chunk.prototype.block = function(x, y, z)
{
	if(x < 0 || y < 0 || z < 0 ||
		x >= this.DIMS[0]+2 || 
		y >= this.DIMS[1]+2 || 
		z >= this.DIMS[2]+2)
		return 0;

	return this.data[x + (this.DIMS[0]+2)*(y + (this.DIMS[1]+2)*z) ];
}

Chunk.prototype.calc_ao = function(x, y, z, nx, ny, nz)
{
	if(!Game.calc_ao)
		return 1.0;
		
	//Calculate ambient occlusion
	return 1.0;
}

//Construct vertex buffer for this chunk
Chunk.prototype.gen_vb = function(gl)
{
	var vertices = new Array();
	var n_elements = 0;
	
	var append = function(v)
	{
		for(var i=0; i<v.length; i++)
		{
			vertices.push(v[i][0] - 0.5
			);
			vertices.push(v[i][1] - 0.5);
			vertices.push(v[i][2] - 0.5);
		}
	}
	
	for(var x=1; x<=this.DIMS[0]; ++x)
	for(var y=1; y<=this.DIMS[1]; ++y)
	for(var z=1; z<=this.DIMS[2]; ++z)
	{
		if(this.block(x,y,z) == 0)
			continue;
		
		if(this.block(x-1,y,z) == 0)
		{
			//Add -x face
			append( [
				[x,y  ,z  ],
				[x,y+1,z  ],
				[x,y+1,z+1],
				[x,y,  z  ],
				[x,y+1,z+1],
				[x,y,  z+1]]);
		}
		
		if(this.block(x+1,y,z) == 0)
		{
			//Add +x face
			append([
				[x+1,y,  z+1],			
				[x+1,y+1,z+1],
				[x+1,y,  z  ],
				[x+1,y+1,z+1],
				[x+1,y+1,z  ],
				[x+1,y  ,z  ]]);
		}
		
		if(this.block(x,y-1,z) == 0)
		{
			//Add -y face
			append([
				[x,  y,  z  ],
				[x,  y,  z+1],
				[x+1,y,  z+1],
				[x,  y,  z  ],
				[x+1,y,  z+1],
				[x+1,y,  z  ]]);
		}
		
		if(this.block(x,y+1,z) == 0)
		{
			//Add +y face
			append([
				[x+1,y+1,  z  ],
				[x+1,y+1,  z+1],
				[x,  y+1,  z  ],
				[x+1,y+1,  z+1],
				[x,  y+1,  z+1],
				[x,  y+1,  z  ]]);
		}
		
		if(this.block(x,y,z-1) == 0)
		{
			//Add -z face
			append([
				[x+1,y,  z],
				[x,  y,  z],
				[x,  y+1,z],
				[x+1,y,  z],
				[x,  y+1,z],
				[x+1,y+1,z]]);
		}
		
		if(this.block(x,y,z+1) == 0)
		{
			//Add +z face
			append([
				[x+1,y+1,z+1],
				[x,  y+1,z+1],
				[x+1,y,  z+1],
				[x,  y+1,z+1],
				[x,  y,  z+1],
				[x+1,y,  z+1]]);
		}
	}

	this.num_elements = vertices.length / 3;
	this.vb = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

Chunk.prototype.draw = function(gl, chunk_shader)
{
	if(this.vb == null)
		this.gen_vb(gl);

	var pos = new Float32Array([1, 0, 0, 0,
								0, 1, 0, 0,
								0, 0, 1, 0,
								this.x*this.DIMS[0], this.y*this.DIMS[1], this.z*this.DIMS[2], 1]);
	
	gl.uniformMatrix4fv(chunk_shader.view_mat, false, pos);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vb);
	gl.vertexAttribPointer(chunk_shader.pos_attr, 3, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, this.num_elements);
}

Chunk.prototype.release = function(gl)
{
	//Release chunk here
}

var Map =
{
	chunks : []
};

Map.init = function(gl)
{
	var res = getProgram(gl, "shaders/chunk.fs", "shaders/chunk.vs");
	if(res[0] != "Ok")
	{
		return res[1];
	}
	
	//Read in return variables
	Map.chunk_fs 	 = res[1];
	Map.chunk_vs 	 = res[2];
	Map.chunk_shader = res[3];
	
	//Get attributes
	Map.chunk_shader.pos_attr = gl.getAttribLocation(Map.chunk_shader, "pos");
	if(Map.chunk_shader.pos_attr == null)
		return "Could not locate position attribute";
		
	Map.chunk_shader.proj_mat = gl.getUniformLocation(Map.chunk_shader, "proj");
	if(Map.chunk_shader.proj_mat == null)
		return "Could not locate projection matrix uniform";
	
	Map.chunk_shader.view_mat = gl.getUniformLocation(Map.chunk_shader, "view");
	if(Map.chunk_shader.view_mat == null)
		return "Could not locate view matrix uniform";
	
	return "Ok";
}

//Draws the map
// Input:
//  gl - the open gl rendering context
//  camera - the current camera matrix
Map.draw = function(gl, camera)
{
	gl.useProgram(Map.chunk_shader);
	gl.enableVertexAttribArray(Map.pos_attr);
	gl.uniformMatrix4fv(Map.chunk_shader.proj_mat, false, camera);
	
	for(var i=0; i<Map.chunks.length; i++)
	{
		var c = Map.chunks[i];
		c.draw(gl, Map.chunk_shader);
	}
}

//Adds a chunk to the list
Map.add_chunk = function(chunk)
{
	Map.chunks.push(chunk);
}

//Returns the block type for the give position
Map.get_block = function(pos)
{
	return 0;
}
