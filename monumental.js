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
	'void main(void)',
	'{',
	'	vec2 coords = gl_FragCoord.xy / 256.;',
	'	float u = .1 * (t - pow(coords.x - .5, 2.) - pow(coords.y - .5, 2.));',
	'	float sin_u = sin(u);',
	'	float cos_u = cos(u);',
	'	float cos_3u = cos(3. * u);',
	'	vec3 ray_dir = normalize(vec3(coords.x + .2 * cos_u, coords.y - .5, .2 * sin_u - 1.));',
	'	vec3 ray_orig = vec3(-100. * cos_u * cos_3u + 50., 5., -100. * sin_u * cos_3u - 50.);',
	'	float offs = 40.;',
	'	float j;',
	'	for (float i = 0.; i < 500.; i += 1.)',
	'	{',
	'		vec3 pos = vec3(ray_orig + ray_dir * offs);',
	'		vec3 c = vec3(100., 100., 100.);',
	'		vec3 q = mod(pos, c) - .5 * c;',
	'		float dist = min(make_box(q, vec3(50., 1., 50.)),',
	'				 min(make_box(q, vec3(5.5, 5., 5.5)),',
	'				     length(q.xz) - 5.));',
	'		offs += dist;',
	'		j = i;',
	'		if (abs(dist) < .0001)',
	'		{',
	'			break;',
	'		}',
	'	}',
	'	gl_FragColor = vec4(.02 * j * (vec3(.38, .49, .55) + .2 * abs(cos(20. * u)) + .2), 1.);',
	'}'
].join('\n')

const FRAGMENT_SHADER_MIN = 'precision lowp float;uniform float t;float a(vec3 b,vec3 c){return length(max(abs(b)-c,0.));}void main(){vec2 d=gl_FragCoord.xy/256.;float e=.1*(t-pow(d.x-.5,2.)-pow(d.y-.5,2.));float f=sin(e);float g=cos(e);float h=cos(3.*e);vec3 i=normalize(vec3(d.x+.2*g,d.y-.5,.2*f-1.));vec3 j=vec3(-100.*g*h+50.,5.,-100.*f*h-50.);float k=40.;float l;for(float m=0.;m<500.;m+=1.){vec3 n=vec3(j+i*k);vec3 o=vec3(100.,100.,100.);vec3 p=mod(n,o)-.5*o;float q=min(a(p,vec3(50.,1.,50.)),min(a(p,vec3(5.5,5.,5.5)),length(p.xz)-5.));k+=q;l=m;if(abs(q)<.0001){break;}}gl_FragColor=vec4(.02*l*(vec3(.38,.49,.55)+.2*abs(cos(20.*e))+.2),1.);}'

main()

function main() {
	g.viewport(0, 0, 256, 256)
	a.height = a.width = 256
	p = link('attribute vec4 p;void main(){gl_Position=p;}', FRAGMENT_SHADER_MIN)

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
