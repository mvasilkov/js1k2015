HEIGHT = WIDTH = 500
STEPS = 32
CLOSE_ENOUGH = 0.001

var imagedata = c.createImageData(WIDTH, HEIGHT)

var camera = [0, 0, -400]
var focal_length = 40
var up = [0, 1, 0]
var right = [1, 0, 0]

render()

function render() {
	var p = 0
	var u, v, real_u, real_v, rgb
	var data = imagedata.data

	for (v = 0; v < HEIGHT; ++v) {
		real_v = -(2 * v / HEIGHT - 1)
		for (u = 0; u < WIDTH; ++u) {
			real_u = 2 * u / WIDTH - 1
			rgb = cast_ray(real_u, real_v)
			data[p + 0] = 255 * rgb[0]
			data[p + 1] = 255 * rgb[1]
			data[p + 2] = 255 * rgb[2]
			data[p + 3] = 255
			p += 4
		}
	}
	c.putImageData(imagedata, 0, 0)
	console.log('done')
}

function cast_ray(u, v) {
	var right_x_up = vec3_xproduct(right, up)
	var dir = vec3_sum(vec3_mul(right_x_up, focal_length), vec3_sum(vec3_mul(right, u), vec3_mul(up, v)))
	var ray_origin = vec3_sum(camera, dir)
	var ray_dir = vec3_normalize(dir)
	var t = 0
	for (var s = 0; s < STEPS; ++s) {
		var p = vec3_sum(ray_origin, vec3_mul(ray_dir, t))
		//var dist = vec3_length(p) - 0.5
		var dist = box_repeat(p, [1, 1, 1], 4)
		if (dist < CLOSE_ENOUGH) {
			return [s / STEPS, s / STEPS, s / STEPS]
		}
		t += dist
	}
	return [1, 1, 1]
}

// functions

function box_repeat(p, b, step) {
	p = [p[0] % step, p[1], p[2]]
	if (p[0] < 0)
		p[0] += step / 2
	else
		p[0] -= step / 2
	return box(p, b)
}

function box(p, b) {
	return vec3_length(vec3_max(vec3_sub(vec3_abs(p), b), 0))
}

function signed_box(p, b) {
	var d = vec3_sub(vec3_abs(p), b)
	return Math.min(vec3_max_comp(d), 0) + vec3_length(vec3_max(d, 0))
}

// math

function vec3_mul(a, n) {
	return [a[0] * n, a[1] * n, a[2] * n]
}

function vec3_sum(a, b) {
	return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
}

function vec3_xproduct(a, b) {
	var x = a[1] * b[2] - a[2] * b[1]
	var y = a[0] * b[2] - a[2] * b[0]
	var z = a[0] * b[1] - a[1] * b[0]
	return [x, -y, z]
}

function vec3_normalize(a) {
	var len = vec3_length(a)
	return [a[0] / len, a[1] / len, a[2] / len]
}

function vec3_length(a) {
	return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2])
}

function vec3_abs(a) {
	return [Math.abs(a[0]), Math.abs(a[1]), Math.abs(a[2])]
}

function vec3_sub(a, b) {
	return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

function vec3_max(a, n) {
	return [Math.max(a[0], n), Math.max(a[1], n), Math.max(a[2], n)]
}

function vec3_max_comp(a) {
	return Math.max.apply(Math, a)
}
