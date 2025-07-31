export function initScrolling(containerId, direction = 'up') {
    const container = document.querySelector(containerId);
    if (!container) return;

    let scrollStep = 1;
    const delay = 50;
    let intervalId = null;
    let paused = false;

    function startScroll() {
        if (intervalId) return;
        intervalId = setInterval(() => {
            if (paused) return;
            if (direction === 'up') {
                container.scrollTop += scrollStep;
                if (container.scrollTop >= container.scrollHeight - container.clientHeight) {
                    container.scrollTop = 0; // Reset to the top for infinite scrolling
                }
            } else {
                container.scrollTop -= scrollStep;
                if (container.scrollTop <= 0) {
                    container.scrollTop = container.scrollHeight - container.clientHeight; // Reset to the bottom for infinite scrolling
                }
            }
        }, delay);
    }

    function stopScroll() {
        paused = true;
    }

    function resumeScroll() {
        paused = false;
    }

    container.addEventListener('mouseenter', stopScroll);
    container.addEventListener('mouseleave', resumeScroll);

    startScroll();
}
