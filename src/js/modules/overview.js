export function initOverview() {
    const overviewGrid = document.querySelector('.overview-grid');
    overviewGrid.innerHTML = '';

    fetch('../../src/api/asset-overview.json')
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
