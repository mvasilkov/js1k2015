F = 'precision lowp float;uniform float t;float a(vec3 b,vec3 c){return length(max(abs(b)-c,0.));}void main(){vec2 d=gl_FragCoord.xy/256.;float e=.1*(t-pow(d.x-.5,2.)-pow(d.y-.5,2.));float f=sin(e);float g=cos(e);float h=cos(3.*e);vec3 i=normalize(vec3(d.x+.2*g,d.y-.5,.2*f-1.));vec3 j=vec3(-100.*g*h+50.,5.,-100.*f*h-50.);float k=40.;float l;for(float m=0.;m<500.;m+=1.){vec3 n=vec3(j+i*k);vec3 o=vec3(100.,100.,100.);vec3 p=mod(n,o)-.5*o;float q=min(a(p,vec3(50.,1.,50.)),min(a(p,vec3(5.5,5.,5.5)),length(p.xz)-5.));k+=q;l=m;if(abs(q)<.0001){break;}}gl_FragColor=vec4(.02*l*(vec3(.38,.49,.55)+.2*abs(cos(20.*e))+.2),1.);}'

for (t in g) {
	g[t.match(/^..|[A-Z]|1f$/g).join('')] = g[t]
}

g.viewport(0, 0, a.height = a.width = 256, 256)
p = link('attribute vec4 p;void main(){gl_Position=p;}', F)

g.enableVertexAttribArray(g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer()))
g.bufferData(g.ARRAY_BUFFER, new Float32Array([1, 1, 1, -3, -3, 1]), g.STATIC_DRAW)
g.vertexAttribPointer(t=0, 2, g.FLOAT, false, 0, 0)

R()

function R() {
	requestAnimationFrame(R)
	g.uniform1f(g.getUniformLocation(p, 't'), t += 0.01)
	g.drawArrays(g.TRIANGLES, 0, 3)
}

function compile(shader_source, shader_type) {
	var shader = g.createShader(shader_type)
	g.shaderSource(shader, shader_source)
	g.compileShader(shader)
	return shader
}

function link(vertex_shader, fragment_shader) {
	var program = g.createProgram()
	g.attachShader(program, compile(vertex_shader, g.VERTEX_SHADER))
	g.attachShader(program, compile(fragment_shader, g.FRAGMENT_SHADER))
	g.linkProgram(program)
	g.useProgram(program)
	return program
}
