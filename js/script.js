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

