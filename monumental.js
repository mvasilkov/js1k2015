const VERTEX_SHADER = [
	'attribute vec4 p;',
	'void main(void)',
	'{',
	'	gl_Position = p;',
	'}'
].join('\n')

const FRAGMENT_SHADER = [
	'precision lowp float;',
	'uniform float t;',
	'void main(void)',
	'{',
	'	gl_FragColor = vec4(0., 0., 0., 1.);',
	'}'
].join('\n')

main()

function main() {
	g.viewport(0, 0, 256, 256)
	a.height = a.width = 256
	p = link(VERTEX_SHADER, FRAGMENT_SHADER)

	g.enableVertexAttribArray(g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer()))
	g.bufferData(g.ARRAY_BUFFER, new Float32Array([1, 1, 1, -3, -3, 1]), g.STATIC_DRAW)
	g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0)

	t = 0
	render()
}

function render() {
	requestAnimationFrame(render)
	g.uniform1f(g.getUniformLocation(p, 't'), t += 0.01)
	g.drawArrays(g.TRIANGLES, 0, 3)
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
