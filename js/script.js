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

let allHoldingsData = []; // 全部数据缓存

// 从后端加载数据
async function fetchHoldingsData() {
  try {
    const response = await fetch('/api/holdings.json'); // ✅ 替换为你真实的接口地址
    if (!response.ok) throw new Error('网络错误');

    const data = await response.json();
    allHoldingsData = data;

    const uniqueTypes = [...new Set(data.map(item => item.type))];
    populateTypeSelect(uniqueTypes);

    // 默认展示 stock 类型
    renderHoldingsTable(filterByType('stock'));
    document.getElementById('type-select').value = 'stock';
  } catch (err) {
    console.error('获取 Holdings 数据失败：', err);
  }
}

// 填充下拉框选项
function populateTypeSelect(types) {
  const select = document.getElementById('type-select');
  select.innerHTML = ''; // 清空旧选项

  types.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type.toUpperCase();
    select.appendChild(option);
  });

  // 添加 change 事件监听器
  select.addEventListener('change', () => {
    const selectedType = select.value;
    renderHoldingsTable(filterByType(selectedType));
  });
}

// 按 type 过滤数据
function filterByType(type) {
  return allHoldingsData.filter(item => item.type === type);
}

// 渲染表格内容
function renderHoldingsTable(data) {
  const tbody = document.querySelector('#data-table tbody');
  tbody.innerHTML = '';

  data.forEach(item => {
    const tr = document.createElement('tr');

    const chargeClass = item.charge >= 0 ? 'positive' : 'negative';
    const chargeText = (item.charge >= 0 ? '+' : '') + item.charge.toFixed(2) + '%';

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.b_price.toFixed(2)}</td>
      <td>${item.c_price.toFixed(2)}</td>
      <td class="${chargeClass}">${chargeText}</td>
      <td>$${item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
      <td>${item.time}</td>
    `;

    tbody.appendChild(tr);
  });
}

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', fetchHoldingsData);

// 趋势图：
// 嵌入的 Net Worth 数据（原本来自接口）
const mockNetWorthData = [
  { date: "2025-03", net_worth: 100000 },
  { date: "2025-04", net_worth: 120000 },
  { date: "2025-05", net_worth: 130000 },
  { date: "2025-06", net_worth: 125000 },
  { date: "2025-07", net_worth: 150000 }
];

// 初始化 Chart 实例
let netWorthChart;

function initNetWorthChart() {
  const ctx = document.getElementById('net-worth-chart').getContext('2d');

  const labels = mockNetWorthData.map(item => item.date);
  const values = mockNetWorthData.map(item => item.net_worth);

  netWorthChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Net Worth',
        data: values,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

// 页面加载后初始化图表
document.addEventListener('DOMContentLoaded', () => {
  initNetWorthChart();
});

// let netWorthChart;

// // 从 API 获取数据并更新趋势图
// async function fetchNetWorthData() {
//   try {
//     const response = await fetch('../api/net-worth.json'); // 替换为你的真实接口
//     if (!response.ok) throw new Error('网络错误');

//     const data = await response.json();

//     const labels = data.map(item => item.date);
//     const values = data.map(item => item.net_worth);

//     updateNetWorthChart(labels, values);
//   } catch (err) {
//     console.error('获取 Net Worth 数据失败：', err);
//   }
// }

// // 初始化 Chart 实例
// function initNetWorthChart() {
//   const ctx = document.getElementById('net-worth-chart').getContext('2d');
//   netWorthChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: [], // 初始为空，加载后填充
//       datasets: [{
//         label: 'Net Worth',
//         data: [],
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 2,
//         fill: false
//       }]
//     },
//     options: {
//       responsive: true,
//       scales: {
//         y: {
//           beginAtZero: false
//         }
//       }
//     }
//   });
// }

// // 更新图表数据
// function updateNetWorthChart(labels, values) {
//   netWorthChart.data.labels = labels;
//   netWorthChart.data.datasets[0].data = values;
//   netWorthChart.update();
// }

// // 页面加载时初始化
// document.addEventListener('DOMContentLoaded', () => {
//   initNetWorthChart();
//   fetchNetWorthData();
// });



// top-gainers 和 top-losers 表格渲染函数
// 通用函数：根据 API 渲染表格
async function renderTableFromApi(apiUrl, tableSelector, isGainer = true) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('网络错误');

    const data = await response.json();
    const tbody = document.querySelector(`${tableSelector} tbody`);
    tbody.innerHTML = '';

    data.forEach(item => {
      const tr = document.createElement('tr');

      const changePercent = (item.change * 100).toFixed(2);
      const color = isGainer ? 'red' : 'lightgreen';
      const sign = isGainer ? '+' : '−'; // 注意：是全角负号

      tr.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price.toLocaleString()}</td>
        <td style="color: ${color};">${sign}${changePercent}%</td>
      `;

      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(`加载 ${apiUrl} 数据失败：`, err);
  }
}

// 页面加载时请求并渲染两个表格
document.addEventListener('DOMContentLoaded', () => {
  renderTableFromApi('/api/top-gainers.json', '#top-gainers', true);
  renderTableFromApi('/api/top-losers.json', '#top-losers', false);
});

async function updateAssetOverview() {
  try {
    const response = await fetch('/api/asset-overview.json'); // 替换为实际 API
    if (!response.ok) throw new Error('网络错误');

    const data = await response.json();
    const grid = document.getElementById('asset-overview-grid');
    grid.innerHTML = ''; // 清空旧内容

    data.forEach(item => {
      const container = document.createElement('div');
      container.className = 'asset';
      container.setAttribute('data-type', item.type);

      const typeName = item.type.toUpperCase();
      const change = item.change;
      const sign = change >= 0 ? '+ ' : '- ';
      const color = change >= 0 ? 'lightgreen' : 'red';

      const percent = `${sign}${Math.abs(change).toFixed(2)}%`;
      const sum = `$ ${item.sum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

      container.innerHTML = `
        ${typeName}
        <div class="value" style="color: ${color};">${percent}</div>
        <div class="total_value">${sum}</div>
      `;

      grid.appendChild(container);
    });
  } catch (err) {
    console.error('更新 Asset Overview 失败：', err);
  }
}

document.addEventListener('DOMContentLoaded', updateAssetOverview);

// FAQ部分
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

