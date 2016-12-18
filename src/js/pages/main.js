import Vue from 'vue';
import {mapState} from 'vuex';
import store from '../store/index.js';
import config from 'config';
import utils from '../lib/utils.js';
import template from '../../main.html';
import heading from './heading.js';
import sidemenu from './sidemenu.js';

import * as THREE from 'three';
THREE.OrbitControls = require(
	'imports?THREE=three!exports?THREE.OrbitControls!' +
		'../../../node_modules\/three\/examples\/js\/controls\/OrbitControls.js');

window.request_animation_frame = (function(){
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(cb){
			window.setTimeout(cb, 1000/60);
		};
})();

let dpr					= 1;
let aspect				= 1;
let width				= 0;
let height				= 0;
let renderer			= null;
let camera				= null;
let scene				= null;
let controls			= null;
let cube				= null;

// Routing definition for "/main"
export default {
	data: () => {
		return {
			// <input v-model="keywords" />
			keywords: ''
		};
	},
	// Our template:
	//    ../../main.html
	template,
	// When Vue.js is ready.
	created() {
		window.addEventListener("resize", this.resize, false);
	},
	// When the page document is ready.
	mounted() {
		this.$nextTick(() => {
			this.init();
		});
	},
	// Similar to "this.data" but it provides you computed data.
	computed: {
		// We can map whatever the states defined in the "store".
		...mapState({
			is_searching: state => state.wiki.searching,
			search_result_list: state => state.wiki.list
		})
	},
	components: {
		// Child component:
		//    heading.js
		// Embedded in "index.html":
		//    <heading page="main"></heading>
		heading,
		// Child component:
		//    sidemenu.js
		// Embedded in "index.html":
		//    <sidemenu page="main"></sidemenu>
		sidemenu
	},
	methods: {
		resize,
		init
	}
};


/**
 * @private
 */
function render() { renderer.render(scene, camera); }

/**
 * @private
 */
function update() {
	window.request_animation_frame(update);
	controls.update();
	render();
}

/**
 * @private
 */
function set_window_size() {
	let {innerWidth: w, innerHeight: h} = window;
	let chk = w * 0.6;
	width	= 540 > chk ? chk : 540;
	height	= width / 1.78; // 16:9
	width	= parseInt(width);
	height	= parseInt(height);
	aspect	= width / height;
	w = h = void 0;
}

/**
 * @public
 */
function resize() {
	set_window_size();
	renderer.setSize(width, height);
	camera.aspect = aspect;
	camera.updateProjectionMatrix();
	render();
}

/**
 * @public
 */
function init() {

	set_window_size();
	dpr = window.devicePixelRatio || 1;

	let canvas = document.getElementById('cube');
	canvas.style.position = 'absolute';
	renderer = new THREE.WebGLRenderer({canvas, antialias: (dpr == 1.0)});
	renderer.setClearColor(0xffffff);
	renderer.setPixelRatio(dpr);
	renderer.setViewport(0, 0, (width * dpr), (height * dpr));
	renderer.setSize(width, height);

	camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 2000);
	camera.position.set(200, 100, 70);

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

	let walls = [
		{x: 100, y: 0, z: 100},
		{x: 100, y: 100, z: 0},
		{x: 0, y: 100, z: 100}
	];
	walls.forEach((pos, i) => {
		walls[i] = new THREE.GridHelper(100, 10);
		walls[i].position.set(pos.x, pos.y, pos.z);
		walls[i].material.transparent = true;
		walls[i].material.opacity = 0.5;
		scene.add(walls[i]);
	});
	walls[1].rotation.x = Math.PI / 2;
	walls[2].rotation.z = Math.PI / 2;

	let size = parseInt(height * 0.14);
	cube = new THREE.Mesh(
		new THREE.BoxGeometry(size, size, size),
		// new THREE.MeshLambertMaterial({ color: 0x33deff })
		new THREE.MeshLambertMaterial({ color: 0xffffff })
	);
	cube.position.x = size;
	cube.position.y = size;
	cube.position.z = size;
	scene.add(cube);

	update();
}


