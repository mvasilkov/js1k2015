main()

function main() {
	render()
}

function render() {
	//requestAnimationFrame(render)
}

function compile(shader_source, shader_type) {
	var shader = g.createShader(shader_type)
	g.shaderSource(shader, shader_source)
	g.compileShader(shader)
	// <debug>
	var worked = g.getShaderParameter(shader, g.COMPILE_STATUS)
	if (!worked)
		throw Error('compile() combusted spontaneously and violently:\n' +
			    g.getShaderInfoLog(shader))
	// </debug>
	return shader
}

function link(vertex_shader, fragment_shader) {
	var program = g.createProgram()
	g.attachShader(program, compile(vertex_shader, g.VERTEX_SHADER))
	g.attachShader(program, compile(fragment_shader, g.FRAGMENT_SHADER))
	g.linkProgram(program)
	// <debug>
	var worked = g.getProgramParameter(program, g.LINK_STATUS)
	if (!worked)
		throw Error('link() combusted spontaneously and violently:\n' +
			    g.getProgramInfoLog(program))
	// </debug>
	g.useProgram(program)
	return program
}
