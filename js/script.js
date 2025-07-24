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

// 模拟的资产数据
const assetData = {
    stock: [
        { name: 'Apple', priceToday: 145.3, priceYesterday: 140.0, quantity: 50 },
        { name: 'Tesla', priceToday: 625.0, priceYesterday: 600.0, quantity: 30 }
    ],
    fund: [
        { name: 'Vanguard', priceToday: 32.5, priceYesterday: 31.5, quantity: 100 },
        { name: 'Fidelity', priceToday: 112.0, priceYesterday: 110.0, quantity: 60 }
    ],
    crypto: [
        { name: 'Bitcoin', priceToday: 47000, priceYesterday: 46000, quantity: 2 },
        { name: 'Ethereum', priceToday: 3300, priceYesterday: 3100, quantity: 10 }
    ],
    bond: [
        { name: 'Government Bond', priceToday: 102.0, priceYesterday: 101.5, quantity: 200 },
        { name: 'Corporate Bond', priceToday: 110.0, priceYesterday: 108.0, quantity: 150 }
    ]
};

// 显示资产表格
function updateHoldingsTable(assetType) {
    const tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = '';  // 清空当前表格内容

    const assets = assetData[assetType];
    assets.forEach(asset => {
        const priceChange = ((asset.priceToday - asset.priceYesterday) / asset.priceYesterday * 100).toFixed(2);
        const totalValue = (asset.priceToday * asset.quantity).toFixed(2);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${asset.name}</td>
            <td>${asset.priceToday}</td>
            <td>${priceChange}%</td>
            <td>${totalValue}</td>
        `;
        tableBody.appendChild(row);
    });
}

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
