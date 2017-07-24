/**
 * entries/grid/routes/grid.js
 */
import merge from 'lodash.merge';
import Vue from 'vue';
import {mapState} from 'vuex';

import config_0 from 'config';
import config_1 from '../config';
import utils from '../../../lib/utils';
import template from './grid.html';
import topmenu from './components/topmenu.js';

import * as THREE from 'three';
THREE.OrbitControls = require(
	'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!' +
		'../../../../../node_modules\/three\/examples\/js\/controls\/OrbitControls.js');

window.request_animation_frame = (function(){
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(cb){
			window.setTimeout(cb, 1000/60);
		};
})();

const assign		= merge;
const path			= utils.path;
const Maybe			= utils.Maybe;

const config = assign({}, config_0, config_1);


const canvas_w_max = 1024;
const canvas_w_scale = 0.98;

let dpr					= 1;
let aspect				= 1;
let canvas_w			= 0;
let canvas_h			= 0;

let renderer			= null;
let camera				= null;
let scene				= null;
let controls			= null;
let cube				= null;

export default {
	data: () => {
		return {
		};
	},
	props: {
		translate:			{ required: true, type: Function },
		set_locale:			{ required: true, type: Function },
		is_prepare_ready:	{ required: true, type: Boolean }
	},
	// Similar to "this.data" but it provides you computed data.
	computed: {
		// We can map whatever the states defined in the "store".
		...mapState({
			screen: state => state.shared.screen,
			locale: state => state.i18n.locale
		}),
		is_ready() {
			return (
				this.is_prepare_ready &&
					// General screen size managed by "shared_store.js".
					this.screen.width && this.screen.width &&
					// Application specific screen size related values.
					canvas_w && canvas_h
			) ? true : false;
		}
	},
	template,
	components: {
		topmenu
	},
	// beforeRouteEnter (to, from, next) {
	//   next(vm => {});
	// },
	// beforeRouteUpdate (to, from, next) {
	//   next(vm => {});
	// },
	created() {
		this.init();
	},
	watch: {
		screen: function() {
			console.log('[entries.grid.routes.grid]   screen size has changed');
			this.resize();
		},
		// '$route': 'fetch_all',
		locale: function () {
			this.set_reservations();
		}
	},
	methods: {
		wait_for_ready,
		set_canvas_size,
		init,
		resize
		// fetch_all
	}
};


/**
 * @protected
 */
function set_canvas_size() {
	// mosaikekkan
	// console.log('[entries.grid.routes.grid] +++++++ set_canvas_size)');
	let { innerWidth: width, innerHeight: height } = window;
	let chk		= width * canvas_w_scale;
	canvas_w	= (canvas_w_max > chk) ? chk : canvas_w_max;
	canvas_h	= canvas_w / 2.1; // divided by "1.78" if you prefer "16:9"
	canvas_w	= parseInt(canvas_w);
	canvas_h	= parseInt(canvas_h);
	aspect		= canvas_w / canvas_h;
	width = height = void 0;
}

/**
 * @protected
 */
function resize() {
	// mosaikekkan
	console.log('[entries.grid.routes.grid] +++++++ resize()');

	this.set_canvas_size();

	if (renderer && camera) {
		renderer.setSize(canvas_w, canvas_h);
		camera.aspect = aspect;
		camera.updateProjectionMatrix();
		render();
	}
}


/**
 * @protected
 */
function wait_for_ready() {
	// mosaikekkan
	// console.log('[entries.grid.routes.grid] +++++++ wait_for_ready()');
	return utils.wait_for(
		() => (this.is_ready ? true : false),
		{
			name: 'wait for screen sets',
			wait: 3000
		}
	);
}

/**
 * @protected
 */
function init() {
	// mosaikekkan
	console.log('[entries.grid.routes.grid] +++++++ init()');
	this.set_canvas_size();
	this.wait_for_ready().then(__init.bind(this)).catch(e => console.error);
}


/**
 * @private
 */
function __init() {
	// mosaikekkan
	console.log('[entries.routes.grid] +++++++ __init()');
	// console.log('[entries.routes.grid]   canvas_w: ' + canvas_w);
	// console.log('[entries.routes.grid]   canvas_h: ' + canvas_h);

	dpr = this.screen.dpr;

	let canvas = document.getElementById('cube');
	canvas.style.position = 'absolute';
	renderer = new THREE.WebGLRenderer({canvas, antialias: (dpr == 1.0)});
	renderer.setClearColor(0xffffff);
	renderer.setPixelRatio(dpr);
	renderer.setViewport(0, 0, (canvas_w * dpr), (canvas_h * dpr));
	renderer.setSize(canvas_w, canvas_h);

	camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 2000);
	camera.position.set(120, 80, 280);

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enablePan			= false;
	controls.enableZoom			= false;
	controls.enableDamping		= true;
	controls.dampingFactor		= 0.16;	// default is 0.25
	controls.rotateSpeed		= 0.1;	// default is 1.0
	controls.autoRotateSpeed	= 0.09;	// default is 2.0
	controls.autoRotate			= true;
	controls.target				= new THREE.Vector3(0, 50, 0);

	scene = new THREE.Scene();

	let light = new THREE.PointLight(0xFFFFFF);
	light.position.set(300, 700, 500);
	scene.add(light);

	let size = parseInt(canvas_h * 0.18);
	let half_size = size / 2;
	let adj = size * 0.3;
	cube = new THREE.Mesh(
		new THREE.BoxGeometry(size, size, size),
		// new THREE.MeshLambertMaterial({ color: 0x33deff })
		new THREE.MeshLambertMaterial({ color: 0xffffff })
	);
	cube.position.x = -adj;
	cube.position.y = half_size + adj;
	cube.position.z = -adj;
	scene.add(cube);

	let wall_size = size * 3.5;
	let half_wall_size = wall_size / 2;
	let walls = [
		{ x: 0, y: 0, z: 0 },
		{ x: 0, y: half_wall_size, z: -half_wall_size },
		{ x: -half_wall_size, y: half_wall_size, z: 0 },
	];
	walls.forEach((pos, i) => {
		walls[i] = new THREE.GridHelper(wall_size, 10);
		walls[i].position.set(pos.x, pos.y, pos.z);
		walls[i].material.transparent = true;
		walls[i].material.opacity = 0.5;
		scene.add(walls[i]);
	});
	walls[1].rotation.x = Math.PI / 2;
	walls[2].rotation.z = Math.PI / 2;

	update();
}


/**
 * @private
 */
function render() {
	renderer.render(scene, camera);
}

/**
 * @private
 */
function update() {
	window.request_animation_frame(update);
	controls.update();
	render();
}

