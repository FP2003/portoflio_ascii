

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