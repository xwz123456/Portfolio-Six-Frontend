import { initSplash } from './modules/splash.js';
import { initScrolling } from './modules/scrolling.js';
import { initHoldingsTable } from './modules/holdings.js';
import { initOverview } from './modules/overview.js';
import { initCharts } from './modules/charts.js';
import { initTopLists } from './modules/toplists.js';
import { initFAQ } from './modules/faq.js';
import { initThemeToggle } from './modules/theme.js';

document.addEventListener('DOMContentLoaded', () => {
    initSplash();
    setTimeout(() => {
        initScrolling('#gainers-scroll');
        initScrolling('#losers-scroll');
        initScrolling('#holdings-scroll');
    }, 1000);
    initHoldingsTable();
    initOverview();
    initCharts();
    initTopLists();
    initFAQ();
    initThemeToggle();
});