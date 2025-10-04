// THREEJS
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const canvas = document.querySelector('#three-canvas');

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize( canvas.clientWidth, canvas.clientHeight, false );

window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x5a9e70 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 10;

function animate() {
    renderer.render( scene, camera );
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}
renderer.setAnimationLoop( animate );


// DARK MODE

const html = document.documentElement;
const toggleButton = document.getElementById('mode-toggle');

const setTheme = (isDark) => {
    if (isDark) {
        html.classList.add('dark');
        localStorage.setItem('mode', 'dark');
    } else {
        html.classList.remove('dark');
        localStorage.setItem('mode', 'light');
    }

    toggleButton.textContent = isDark ? '[🌙]' : '[☀️]';
};

const storedMode = localStorage.getItem('mode');
const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const initialDarkState = storedMode ? storedMode === 'dark' : preferDark;

setTheme(initialDarkState);

toggleButton.addEventListener('click', () => {
    setTheme(!html.classList.contains('dark'));
});

// SMOOTH SCROLL

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof ScrollSmoother !== 'undefined') {

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.2, // Tweak this value for the desired smoothing amount
    normalizeScroll: true, // Prevents native scroll from being jumpy
    ignoreMobileResize: true // Often helpful for consistent behavior
    });


    gsap.from('header, main', {
        duration: 1.5,
        y: -30,
        opacity: 0,
        ease: "power3.out"
    });
}
