/**
 * entries/sample/routes/webgl.js
 */
import merge from 'lodash.merge';
import Vue from 'vue';
import {mapState} from 'vuex';

import config from '../config';
import utils from '../../../lib/utils';
import template from './webgl.html';
import topmenu from './components/topmenu.js';

// "imports-loader" to import "THREE", and then "exports-loader"
// to export "THREE.OrbitControls" as "THREE.OrbitControls".
import * as THREE from 'three';
THREE.OrbitControls = require(
	'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!' +
		'../../../../../node_modules\/three\/examples\/js\/controls\/OrbitControls.js');

// Although this project does not have animations samples,
// I tought it would be nice to have example to define
// our own "window.requestAnimationFrame".
window.request_animation_frame = (function(){
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(cb){
			window.setTimeout(cb, 1000/60);
		};
})();

// Some handy tools to import...
const pipe			= utils.pipe;

const canvas_w_max		= 1024;
const canvas_w_scale	= 0.98;

let dpr					= 1;
let aspect				= 1;
let canvas_w			= 0;
let canvas_h			= 0;

let renderer			= null;
let camera				= null;
let scene				= null;
let controls			= null;
let cube				= null;
let cube_size			= 0;


const set_canvas_size = () => {
	let { innerWidth = 0, devicePixelRatio = 1 } = window;
	dpr = devicePixelRatio;
	let chk		= innerWidth * canvas_w_scale;
	canvas_w	= (canvas_w_max > chk) ? chk : canvas_w_max;
	canvas_h	= canvas_w / 2.1; // divided by "1.78" if you prefer "16:9"
	canvas_w	= parseInt(canvas_w);
	canvas_h	= parseInt(canvas_h);
	aspect		= canvas_w / canvas_h;
	innerWidth = devicePixelRatio = void 0;
	return Promise.resolve();
};

// No arrow function syntax for it will be bound to a specific scope.
const wait_for_ready = function() {
	return utils.wait_for(
		() => (this.is_ready ? true : false),
		{
			name: 'wait for screen sets',
			wait: 3000
		}
	);
};

const render = () => (renderer.render(scene, camera));

const update = () => {
	window.request_animation_frame(update);
	controls.update();
	render();
};

const set_canvas = () => {
	let canvas = document.getElementById('cube');
	canvas.style.position = 'absolute';
	renderer = new THREE.WebGLRenderer({canvas, antialias: (dpr == 1.0)});
	renderer.setClearColor(0xffffff);
	renderer.setPixelRatio(dpr);
	renderer.setViewport(0, 0, (canvas_w * dpr), (canvas_h * dpr));
	renderer.setSize(canvas_w, canvas_h);
};

const set_camera = () => {
	camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 2000);
	camera.position.set(120, 80, 280);
};

const set_controls = () => {
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enablePan			= false;
	controls.enableZoom			= false;
	controls.enableDamping		= true;
	controls.dampingFactor		= 0.16;	// default is 0.25
	controls.rotateSpeed		= 0.1;	// default is 1.0
	controls.autoRotateSpeed	= 0.09;	// default is 2.0
	controls.autoRotate			= true;
	controls.target				= new THREE.Vector3(0, 50, 0);
};

const set_scene = () => (scene = new THREE.Scene());

const set_light = () => {
	let light = new THREE.PointLight(0xFFFFFF);
	light.position.set(300, 700, 500);
	scene.add(light);
};

const set_cube = () => {
	cube_size = parseInt(canvas_h * 0.18);
	let half_cube_size = cube_size / 2;
	let adj = cube_size * 0.3;
	cube = new THREE.Mesh(
		new THREE.BoxGeometry(cube_size, cube_size, cube_size),
		// new THREE.MeshLambertMaterial({ color: 0x33deff })
		new THREE.MeshLambertMaterial({ color: 0xffffff })
	);
	cube.position.x = -adj;
	cube.position.y = half_cube_size + adj;
	cube.position.z = -adj;
	scene.add(cube);
};

const set_walls = () => {
	let wall_size = cube_size * 3.5;
	let half_wall_size = wall_size / 2;
	let walls = [];
	[
		{ x: 0, y: 0, z: 0 },
		{ x: 0, y: half_wall_size, z: -half_wall_size },
		{ x: -half_wall_size, y: half_wall_size, z: 0 },
	].forEach((pos, i) => {
		walls[i] = new THREE.GridHelper(wall_size, 10);
		walls[i].position.set(pos.x, pos.y, pos.z);
		walls[i].material.transparent = true;
		walls[i].material.opacity = 0.5;
		scene.add(walls[i]);
	});
	walls[1].rotation.x = Math.PI / 2;
	walls[2].rotation.z = Math.PI / 2;
};


/**
 * No arrow function syntax for it will be bound to a specific scope.
 * @protected
 */
const on_create = function() {
	// mosaikekkan
	console.log('[entries.sample.routes.webgl] +++++++ on_create()');
	set_canvas_size()
		.then(wait_for_ready.bind(this))
		.then(pipe([
			set_canvas,
			set_camera,
			set_controls,
			set_scene,
			set_light,
			set_cube,
			set_walls,
			update
		]))
		.catch(console.error);
};

/**
 * No arrow function syntax for it will be bound to a specific scope.
 * @protected
 */
const on_screen_change = function() {
	// mosaikekkan
	console.log('[entries.sample.routes.webgl] +++++++ on_screen_change()');
	set_canvas_size()
		.then(() => {
			if (renderer && camera) {
				renderer.setSize(canvas_w, canvas_h);
				camera.aspect = aspect;
				camera.updateProjectionMatrix();
				render();
			}
		})
		.catch(console.error);
};

/**
 * No arrow function syntax for it will be bound to a specific scope.
 * @protected
 */
const on_locale_change = function() {
	// mosaikekkan
	console.log('[entries.sample.routes.webgl] +++++++ on_locale_change()');
};


export default {
	data: () => {
		return {
		};
	},
	props: {
		// All defined in "entries/sample/index.js".
		translate:			{ required: true, type: Function },
		set_locale:			{ required: true, type: Function },
		is_prepare_ready:	{ required: true, type: Boolean }
	},
	computed: {
		// Map the store managed states.
		...mapState({
			screen: state => state.share.screen,
			locale: state => state.i18n.locale
		}),
		// Wait for the screen size related variables are set.
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
	// You can hook the router transitions.
	// Make sure to call "next()" for the transitions
	// to actually take place.
	//----------------------------------------------------
	// beforeRouteEnter (to, from, next) {
	//   next(vm => {});
	// },
	// beforeRouteUpdate (to, from, next) {
	//   next(vm => {});
	// },
	//----------------------------------------------------
	created: on_create,
	watch: {
		screen: on_screen_change,
		locale: on_locale_change
		// If you wish to perform some tasks when route changes
		// you can use "$route" syntax to which you simply
		// specify a component method.
		//-------------------------------------------
		// '$route': 'route_change_handler'
		//-------------------------------------------
	},
	methods: {
		// route_change_handler
	}
};


