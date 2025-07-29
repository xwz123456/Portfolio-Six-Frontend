export function initHoldingsTable() {
    const select = document.getElementById('asset-select');
    const tbody = document.querySelector('#data-table tbody');

    let allData = [];

    // 加载 JSON 数据，只执行一次
    fetch('../../src/api/holdings.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
            renderTable('stock'); // 默认显示 stock
        })
        .catch(err => {
            console.error('Error loading holdings data:', err);
        });

    // 添加下拉选择监听
    if (select) {
        select.addEventListener('change', () => {
            const selectedType = select.value;
            renderTable(selectedType);
        });
    }

    // 渲染表格函数
    function renderTable(type) {
        const filtered = allData.filter(item => item.type === type);
        tbody.innerHTML = ''; // 清空表格

        filtered.forEach(item => {
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
}
