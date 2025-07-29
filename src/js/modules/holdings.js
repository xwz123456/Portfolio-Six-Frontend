import API_CONFIG from '../../config/apiConfig.js';
export function initHoldingsTable() {
    const select = document.getElementById('asset-select');
    const tbody = document.querySelector('#data-table tbody');
  
    let allData = [];
  
    fetch(`${API_CONFIG.baseUrl}/api/assets/findAllAssets/1`)
      .then(response => response.json())
      .then(data => {
        // 修改: 使用 data 字段中的数据
        allData = data.data;
        renderTable('all'); // 默认展示所有
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
      // 修改: 过滤条件使用 asset_type 字段
      const filtered = type === 'all'
        ? allData
        : allData.filter(item => item.asset_type === type);
  
      tbody.innerHTML = ''; // 清空表格
  
      filtered.forEach(item => {
        const tr = document.createElement('tr');
        const purchasePrice = Number(item.purchase_price);
        const currentPrice = Number(item.current_price);
        const quantity = Number(item.quantity);
        const purchaseValue = quantity * purchasePrice;
        const currentValue = quantity * currentPrice;
        const change = purchaseValue !== 0 ? ((currentValue - purchaseValue) / purchaseValue) * 100 : 0;
        const changeClass = change >= 0 ? 'positive' : 'negative';
        const formattedDate = item.purchase_date ? item.purchase_date.substring(0, 16).replace('T', ' ') : '';
        tr.innerHTML = `
          <td>${item.asset_name}</td>
          <td>${purchasePrice.toFixed(2)}</td>
          <td>${currentPrice.toFixed(2)}</td>
          <td class="${changeClass}">${change.toFixed(2)}%</td>
          <td>${currentValue.toFixed(2)}</td>
          <td>${formattedDate}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }