export function initSplash() {
    window.onload = function () {
        const splashScreen = document.getElementById('splash-screen');
        const dashboard = document.getElementById('dashboard');
        window.addEventListener('wheel', function () {
            splashScreen.style.opacity = 0;
            setTimeout(() => {
                splashScreen.style.display = 'none';
                dashboard.style.opacity = 1;
            }, 1000);
        });
    };
}
