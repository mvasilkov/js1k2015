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
	'float make_box(vec3 p, vec3 b)',
	'{',
	'	return length(max(abs(p) - b, 0.));',
	'}',
	'float make_column(vec3 p, vec3 c)',
	'{',
	'	return length(p.xz - c.xy) - c.z;',
	'}',
	'void main(void)',
	'{',
	'	vec2 coords = gl_FragCoord.xy / 256.;',
	'	float u = .1 * (t - pow(coords.x - .5, 2.) - pow(coords.y - .5, 2.));',
	'	vec3 ray_dir = normalize(vec3(coords.x + .2 * cos(u), coords.y - .5, .2 * sin(u) - 1.));',
	'	vec3 ray_orig = vec3(-100. * cos(u) * cos(3. * u) + 50., 5., -100. * sin(u) * cos(3. * u) - 50.);',
	'	float offs = 40.;',
	'	float j;',
	'	for (float i = 0.; i < 500.; i += 1.)',
	'	{',
	'		vec3 pos = vec3(ray_orig + ray_dir * offs);',
	'		vec3 c = vec3(100., 100., 100.);',
	'		vec3 q = mod(pos, c) - .5 * c;',
	'		float dist = min(make_box(q, vec3(50., 1., 50.)),',
	'				 min(make_column(q, vec3(0., 0., 5.)),',
	'				     make_box(q, vec3(5.5, 5., 5.5))));',
	'		offs += dist;',
	'		j = i;',
	'		if (abs(dist) < .0001)',
	'		{',
	'			break;',
	'		}',
	'	}',
	'	float c = .02 * j;',
	'	vec3 bg = vec3(.38, .49, .55);',
	'	float add_c = .2 * abs(cos(20. * u)) + .2;',
	'	gl_FragColor = vec4(c * (bg + add_c), 1.);',
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
