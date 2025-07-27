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
// const holdingsData = [
//     { name: 'NVDA', b_price: 65.44, c_price: 42.65, charge: -25.32, total: 23456, time: '23453' },
//     { name: 'TSLA', b_price: 55.34, c_price: 76.53, charge: 34.43, total: 345346, time: '34534543' },
//     { name: 'AAPL', b_price: 42.55, c_price: 75.33, charge: 45.64, total: 345345, time: '345345345' },
//     { name: 'O2HO', b_price: 53.24, c_price: 43.56, charge: -15.56, total: 45644, time: '234234' },
//     { name: 'AMZN', b_price: 67.25, c_price: 76.43, charge: 64.24, total: 45644, time: '234234' },
//     { name: 'RHM',  b_price: 55.24, c_price: 45.74, charge: -56.35, total: 34534, time: '234234' }
//   ];
  
//   const tbody = document.querySelector('#data-table tbody');
//   holdingsData.forEach(item => {
//     const tr = document.createElement('tr');
//     const changeClass = item.charge >= 0 ? 'positive' : 'negative';
//     tr.innerHTML = `
//       <td>${item.name}</td>
//       <td>${item.b_price.toFixed(2)}</td>
//       <td>${item.c_price.toFixed(2)}</td>
//       <td class="${changeClass}">${item.charge.toFixed(2)}%</td>
//       <td>${item.total}</td>
//       <td>${item.time}</td>
//     `;
//     tbody.appendChild(tr);
//   });
  



const allHoldingsData = {
  stock: [
    { name: 'AAPL', b_price: 120, c_price: 150, charge: 25.00, total: 10000, time: '2025-07-01' },
    { name: 'TSLA', b_price: 300, c_price: 250, charge: -16.67, total: 8000, time: '2025-07-02' },
    { name: 'NVDA', b_price: 250, c_price: 275, charge: 10.00, total: 12000, time: '2025-07-03' }
  ],
  bond: [
    { name: 'US Treasury 10Y', b_price: 100, c_price: 101, charge: 1.00, total: 5000, time: '2025-07-01' },
    { name: 'Corporate Bond A', b_price: 98, c_price: 99.5, charge: 1.53, total: 3000, time: '2025-07-02' },
    { name: 'Municipal Bond B', b_price: 105, c_price: 102, charge: -2.86, total: 4000, time: '2025-07-03' }
  ],
  etf: [
    { name: 'VOO', b_price: 400, c_price: 430, charge: 7.50, total: 12000, time: '2025-07-01' },
    { name: 'QQQ', b_price: 350, c_price: 360, charge: 2.86, total: 9000, time: '2025-07-02' },
    { name: 'ARKK', b_price: 60, c_price: 50, charge: -16.67, total: 7000, time: '2025-07-03' }
  ],
  crypto: [
    { name: 'BTC', b_price: 20000, c_price: 30000, charge: 50.00, total: 15000, time: '2025-07-01' },
    { name: 'ETH', b_price: 1500, c_price: 2000, charge: 33.33, total: 10000, time: '2025-07-02' },
    { name: 'DOGE', b_price: 0.05, c_price: 0.03, charge: -40.00, total: 500, time: '2025-07-03' }
  ]
};


// 📊 渲染 Holdings 表格
function updateHoldingsTable(type) {
  const tbody = document.querySelector('#data-table tbody');
  tbody.innerHTML = '';

  const data = allHoldingsData[type];
  data.forEach(item => {
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
}

// 🎛 监听下拉框切换资产类型
const select = document.getElementById('asset-select');
if (select) {
  select.addEventListener('change', () => {
    updateHoldingsTable(select.value);
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

// // 初始展示股票数据
// updateHoldingsTable('stock');

// // 处理不同资产的显示
// function showAsset(assetType) {
//     updateHoldingsTable(assetType);
// }


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




// API 接口们

// net worth的API
async function loadNetWorthChart() {
  const response = await fetch('/api/net-worth');
  const data = await response.json(); // 假设返回: { labels: [...], values: [...] }

  const ctx = document.getElementById('net-worth-chart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Net Worth',
        data: data.values,
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
}


//top gainer和top loser的
async function loadTopGainers() {
  const response = await fetch('/api/top-gainers');
  const data = await response.json();
  const tbody = document.querySelector('#top-gainers tbody');
  tbody.innerHTML = '';
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price}</td>
      <td style="color: red;">+${item.change}%</td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadTopLosers() {
  const response = await fetch('/api/top-losers');
  const data = await response.json();
  const tbody = document.querySelector('#top-losers tbody');
  tbody.innerHTML = '';
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price}</td>
      <td style="color: green;">−${item.change}%</td>
    `;
    tbody.appendChild(tr);
  });
}

// Asset overview的

async function loadAssetOverview() {
  const response = await fetch('/api/asset-overview');
  const data = await response.json(); // 假设格式：{ stock: {...}, bond: {...}, ... }

  document.querySelectorAll('.asset').forEach(assetDiv => {
    const type = assetDiv.dataset.type;
    if (data[type]) {
      assetDiv.querySelector('.value').innerText = (data[type].change >= 0 ? '+ ' : '- ') + Math.abs(data[type].change).toFixed(2) + '%';
      assetDiv.querySelector('.total_value').innerText = '$ ' + data[type].total_value.toFixed(2);
    }
  });
}



// 用API时候的开屏逻辑 这个在最后跟后端结合的时候再用

window.onload = function () {
  // 开屏逻辑
  const splashScreen = document.getElementById('splash-screen');
  const dashboard = document.getElementById('dashboard');

  window.addEventListener('wheel', function () {
    splashScreen.style.opacity = 0;
    setTimeout(() => {
      splashScreen.style.display = 'none';
      dashboard.style.opacity = 1;
    }, 1000);
  });

  // 加载所有数据
  loadHoldingsData();
  loadNetWorthChart();
  loadTopGainers();
  loadTopLosers();
  loadAssetOverview();
};