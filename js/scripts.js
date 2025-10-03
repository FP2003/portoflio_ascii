

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

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof ScrollSmoother !== 'undefined') {

    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.2, // Tweak this value for the desired smoothing amount
    normalizeScroll: true, // Prevents native scroll from being jumpy
    ignoreMobileResize: true // Often helpful for consistent behavior
    });


    gsap.from('header', {
        duration: 1.5,
        y: -30,
        opacity: 0,
        ease: "power3.out"
    });
}