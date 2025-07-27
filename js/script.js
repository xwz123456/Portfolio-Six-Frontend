// 开屏效果
window.onload = function() {
    // 获取元素
    const splashScreen = document.getElementById('splash-screen');
    const dashboard = document.getElementById('dashboard');

    // 监听鼠标滚动事件
    window.addEventListener('wheel', function() {
        // 当用户滑动鼠标时，执行以下操作
        splashScreen.style.opacity = 0;  // 隐藏开屏页面
        setTimeout(() => {
            splashScreen.style.display = 'none';  // 完全移除开屏页面
            dashboard.style.opacity = 1;  // 显示主题页
        }, 1000);  // 延时以便过渡效果
    });
};

// 创建Top Gainers测试数据
const gainersData = [
    { asset: 'NVDA', price: '$987.54', change: '+5.67%' },
    { asset: 'TSLA', price: '$245.30', change: '+4.21%' },
    { asset: 'AMD', price: '$156.78', change: '+3.89%' },
    { asset: 'BTC', price: '$62,450', change: '+3.56%' },
    { asset: 'ETH', price: '$3,420.20', change: '+2.98%' },
    { asset: 'AAPL', price: '$192.34', change: '+2.45%' },
    { asset: 'MSFT', price: '$405.67', change: '+1.98%' },
    { asset: 'GOOGL', price: '$152.89', change: '+1.76%' },
    { asset: 'AMZN', price: '$178.45', change: '+1.43%' },
    { asset: 'NFLX', price: '$654.21', change: '+0.87%' }
];

// 创建Top Losers测试数据
const losersData = [
    { asset: 'FB', price: '$320.45', change: '-3.21%' },
    { asset: 'UBER', price: '$45.67', change: '-2.87%' },
    { asset: 'LYFT', price: '$12.34', change: '-2.56%' },
    { asset: 'SHOP', price: '$67.89', change: '-2.34%' },
    { asset: 'SQ', price: '$67.23', change: '-1.98%' },
    { asset: 'ROKU', price: '$89.45', change: '-1.76%' },
    { asset: 'PLTR', price: '$23.56', change: '-1.54%' },
    { asset: 'SNAP', price: '$12.78', change: '-1.32%' },
    { asset: 'DIS', price: '$102.34', change: '-0.98%' },
    { asset: 'BA', price: '$223.45', change: '-0.76%' }
];

// 填充Top Gainers表格
const gainersBody = document.getElementById('gainers-body');
gainersData.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.asset}</td>
        <td>${item.price}</td>
        <td style="color: red;">${item.change}</td>
    `;
    gainersBody.appendChild(row);
});

// 填充Top Losers表格
const losersBody = document.getElementById('losers-body');
losersData.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.asset}</td>
        <td>${item.price}</td>
        <td style="color: green;">${item.change}</td>
    `;
    losersBody.appendChild(row);
});

// 实现自动滚动功能（鼠标悬停暂停）
function initScrolling(containerId, direction = 'up') {
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
                    container.scrollTop = 0;
                }
            } else {
                container.scrollTop -= scrollStep;
                if (container.scrollTop <= 0) {
                    container.scrollTop = container.scrollHeight - container.clientHeight;
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

// 初始化滚动
setTimeout(() => {
    initScrolling('#gainers-scroll');
    initScrolling('#losers-scroll');
}, 1000);

// 动态填充 Holdings 表格数据
const holdingsData = [
    { name: 'NVDA', b_price: 65.44, c_price: 42.65, charge: -25.32, total: 23456, time: '23453' },
    { name: 'TSLA', b_price: 55.34, c_price: 76.53, charge: 34.43, total: 345346, time: '34534543' },
    { name: 'AAPL', b_price: 42.55, c_price: 75.33, charge: 45.64, total: 345345, time: '345345345' },
    { name: 'O2HO', b_price: 53.24, c_price: 43.56, charge: -15.56, total: 45644, time: '234234' },
    { name: 'AMZN', b_price: 67.25, c_price: 76.43, charge: 64.24, total: 45644, time: '234234' },
    { name: 'RHM',  b_price: 55.24, c_price: 45.74, charge: -56.35, total: 34534, time: '234234' }
  ];
  
  const tbody = document.querySelector('#data-table tbody');
  holdingsData.forEach(item => {
    const tr = document.createElement('tr');
    const changeClass = item.charge >= 0 ? 'positive' : 'negative';
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.b_price.toFixed(2)}</td>
      <td>${item.c_price.toFixed(2)}</td>
      <td class="${changeClass}">${item.charge.toFixed(2)}%</td>
      <td>${item.total}</td>
      <td>${item.time}</td>
    `;
    tbody.appendChild(tr);
  });
  
// 初始化趋势图
const ctx = document.getElementById('net-worth-chart').getContext('2d');
const netWorthChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'Net Worth',
            data: [100000, 120000, 130000, 125000, 150000],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: false
            }
        }
    }
});

// 初始展示股票数据
updateHoldingsTable('stock');

// 处理不同资产的显示
function showAsset(assetType) {
    updateHoldingsTable(assetType);
}


document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.question');
  const answer = item.querySelector('.answer');

  question.addEventListener('click', () => {
    item.classList.toggle('open');
    if (item.classList.contains('open')) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
      answer.style.maxHeight = '0';
    }
  });
});