// 开屏效果
window.onload = function () {
    // 获取元素
    const splashScreen = document.getElementById('splash-screen');
    const dashboard = document.getElementById('dashboard');

    // 监听鼠标滚动事件
    window.addEventListener('wheel', function () {
        // 当用户滑动鼠标时，执行以下操作
        splashScreen.style.opacity = 0;  // 隐藏开屏页面
        setTimeout(() => {
            splashScreen.style.display = 'none';  // 完全移除开屏页面
            dashboard.style.opacity = 1;  // 显示主题页
        }, 1000);  // 延时以便过渡效果
    });
};

// // 创建Top Gainers测试数据
// const gainersData = [
//     { asset: 'NVDA', price: '$987.54', change: '+5.67%' },
//     { asset: 'TSLA', price: '$245.30', change: '+4.21%' },
//     { asset: 'AMD', price: '$156.78', change: '+3.89%' },
//     { asset: 'BTC', price: '$62,450', change: '+3.56%' },
//     { asset: 'ETH', price: '$3,420.20', change: '+2.98%' },
//     { asset: 'AAPL', price: '$192.34', change: '+2.45%' },
//     { asset: 'MSFT', price: '$405.67', change: '+1.98%' },
//     { asset: 'GOOGL', price: '$152.89', change: '+1.76%' },
//     { asset: 'AMZN', price: '$178.45', change: '+1.43%' },
//     { asset: 'NFLX', price: '$654.21', change: '+0.87%' }
// ];

// // 创建Top Losers测试数据
// const losersData = [
//     { asset: 'FB', price: '$320.45', change: '-3.21%' },
//     { asset: 'UBER', price: '$45.67', change: '-2.87%' },
//     { asset: 'LYFT', price: '$12.34', change: '-2.56%' },
//     { asset: 'SHOP', price: '$67.89', change: '-2.34%' },
//     { asset: 'SQ', price: '$67.23', change: '-1.98%' },
//     { asset: 'ROKU', price: '$89.45', change: '-1.76%' },
//     { asset: 'PLTR', price: '$23.56', change: '-1.54%' },
//     { asset: 'SNAP', price: '$12.78', change: '-1.32%' },
//     { asset: 'DIS', price: '$102.34', change: '-0.98%' },
//     { asset: 'BA', price: '$223.45', change: '-0.76%' }
// ];

// // 填充Top Gainers表格
// gainersData.forEach(item => {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//         <td>${item.asset}</td>
//         <td>${item.price}</td>
//         <td style="color: red;">${item.change}</td>
//     `;
//     gainersBody.appendChild(row);
// });

// // 填充Top Losers表格
// losersData.forEach(item => {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//         <td>${item.asset}</td>
//         <td>${item.price}</td>
//         <td style="color: green;">${item.change}</td>
//     `;
//     losersBody.appendChild(row);
// });

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

// 📊 加载并渲染 Holdings 表格数据
function updateHoldingsTable(type) {
    const tbody = document.querySelector('#data-table tbody');
    tbody.innerHTML = '';

    fetch(`/api/holdings.json`)  // 确保替换为实际路径
        .then(response => response.json())
        .then(data => {
            const holdingsData = data.filter(item => item.type === type);
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
        })
        .catch(error => {
            console.error('Error loading holdings data:', error);
        });
}


document.addEventListener('DOMContentLoaded', () => {
    // 加载默认的 stock 数据
    updateHoldingsTable('stock');

    // 监听选择变更
    const select = document.getElementById('asset-select');
    if (select) {
        select.addEventListener('change', () => {
            updateHoldingsTable(select.value);
        });
    }
});

// 初始化趋势图
const ctx = document.getElementById('net-worth-chart').getContext('2d');
fetch('/api/net-worth.json')  // 确保替换为实际路径
    .then(response => response.json())
    .then(data => {
        const labels = data.map(item => item.date);
        const netWorthData = data.map(item => item.net_worth);

        const netWorthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Net Worth',
                    data: netWorthData,
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
    })
    .catch(error => {
        console.error('Error loading net worth data:', error);
    });

// 处理资产概览（Asset Overview）
function updateAssetOverview() {
    const overviewGrid = document.querySelector('.overview-grid');
    overviewGrid.innerHTML = '';

    fetch('/api/asset-overview.json')  // 确保替换为实际路径
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const assetDiv = document.createElement('div');
                assetDiv.className = 'asset';
                assetDiv.dataset.type = item.type;

                assetDiv.innerHTML = `
                  ${item.type.toUpperCase()}
                  <div class="value">${item.change > 0 ? '+' : ''}${item.change}%</div>
                  <div class="total_value">$${item.sum.toFixed(2)}</div>
              `;
                overviewGrid.appendChild(assetDiv);
            });
        })
        .catch(error => {
            console.error('Error loading asset overview data:', error);
        });
}

// 📈 更新 Top Gainers 表格
function updateTopGainers() {
    const tbody = document.querySelector('#top-gainers tbody');
    tbody.innerHTML = '';

    fetch('/api/top-gainers.json')  // 确保替换为实际路径
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                  <td>${item.name}</td>
                  <td>$${item.price}</td>
                  <td style="color: red;">+${(item.change * 100).toFixed(2)}%</td>
              `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error loading top gainers data:', error);
        });
}

// 📉 更新 Top Losers 表格
function updateTopLosers() {
    const tbody = document.querySelector('#top-losers tbody');
    tbody.innerHTML = '';

    fetch('/api/top-losers.json')  // 确保替换为实际路径
        .then(response => response.json())
        .then(data => {
            data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                  <td>${item.name}</td>
                  <td>$${item.price}</td>
                  <td style="color: green;">-${(item.change * 100).toFixed(2)}%</td>
              `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error loading top losers data:', error);
        });
}

// 初始化所有数据
document.addEventListener('DOMContentLoaded', () => {
    updateAssetOverview();
    updateTopGainers();
    updateTopLosers();
});



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