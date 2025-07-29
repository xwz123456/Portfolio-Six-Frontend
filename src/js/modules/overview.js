import API_CONFIG from '../../config/apiConfig.js';
export function initOverview() {
    const overviewGrid = document.querySelector('.overview-grid');
    overviewGrid.innerHTML = '';

    fetch(`${API_CONFIG.baseUrl}/api/assets/rate/1`)
        .then(response => response.json())
        .then(response => {
            // 从 response.data 中获取数据
            const data = response.data;
            data.forEach(item => {
                const assetDiv = document.createElement('div');
                assetDiv.className = 'asset';
                assetDiv.dataset.type = item.asset_type;

                assetDiv.innerHTML = `
                  ${item.asset_type.toUpperCase()}
                  <div class="value">${item.change > 0 ? '+' : ''}${item.change}%</div>
                  <div class="total_value">$${item.total_profit.toFixed(2)}</div>
              `;
                overviewGrid.appendChild(assetDiv);
            });
        })
        .catch(error => {
            console.error('Error loading asset overview data:', error);
        });
}