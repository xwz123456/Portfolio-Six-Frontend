export function initThemeToggle() {
    document.getElementById("toggle-theme").addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
    });
}
