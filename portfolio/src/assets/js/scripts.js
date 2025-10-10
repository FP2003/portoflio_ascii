// THREEJS
import * as THREE from 'three';

window.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const canvas = document.querySelector('#three-canvas');

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize( canvas.clientWidth, canvas.clientHeight, false );
    renderer.shadowMap.enabled = true;

    window.addEventListener('resize', () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    });

    // Room
    const roomGeometry = new THREE.BoxGeometry( 70, 50, 70 );
    const roomMaterial = new THREE.MeshStandardMaterial({
        side: THREE.BackSide
    });
    const room = new THREE.Mesh( roomGeometry, roomMaterial );
    room.receiveShadow = true;
    scene.add( room );

    // Edges
    const edges = new THREE.EdgesGeometry( roomGeometry );
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x11120e });
    const wireframe = new THREE.LineSegments( edges, edgeMaterial );
    scene.add( wireframe );

    // Particles
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 70;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x11120e
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Particle explosion setup
    const originalPositions = particles.attributes.position.array;
    const explodedPositions = new Float32Array(originalPositions.length);
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const vertex = new THREE.Vector3(originalPositions[i3], originalPositions[i3 + 1], originalPositions[i3 + 2]);
        const direction = vertex.clone().normalize();
        const explosionDistance = Math.random() * 20 + 10;
        const newPos = vertex.clone().add(direction.multiplyScalar(explosionDistance));
        explodedPositions[i3] = newPos.x;
        explodedPositions[i3+1] = newPos.y;
        explodedPositions[i3+2] = newPos.z;
    }

    let exploded = false;
    window.addEventListener('click', () => {
        if (typeof gsap !== 'undefined') {
            const targetArray = exploded ? originalPositions : explodedPositions;
            const currentPositions = particles.attributes.position.array;

            gsap.to(currentPositions, {
                duration: 2,
                endArray: targetArray,
                ease: "power2.inOut",
                onUpdate: () => {
                    particles.attributes.position.needsUpdate = true;
                }
            });

            exploded = !exploded;
        }
    });


    // Lights
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
    scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( 10, 15, 5 );
    directionalLight.castShadow = true;
    scene.add( directionalLight );

    // Camera Position
    camera.position.set(-7, 7, 8);
    camera.lookAt(0, 0, 0);

    function animate() {
        // Update room color based on dark mode
        const isDark = document.documentElement.classList.contains('dark');
        roomMaterial.color.set(isDark ? 0x1f271b : 0xF2F0EF);
        particleMaterial.color.set(isDark ? 0xF2F0EF : 0x11120e);
        scene.traverse((object) => {
            if (object.isMesh && object.geometry.type === 'TextGeometry') {
                object.material.color.set(isDark ? 0xF2F0EF : 0x11120e);
            }
        });

        // Animate particles
        const time = Date.now() * 0.0001;
        particleSystem.rotation.y = time;

        renderer.render( scene, camera );
    }
    renderer.setAnimationLoop( animate );
});


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
