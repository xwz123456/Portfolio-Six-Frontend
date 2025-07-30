import API_CONFIG from '../../config/apiConfig.js';

let pieChartInstance = null;

export function initOverview() {
    const overviewGrid = document.querySelector('.overview-grid');
    const pieCanvas = document.getElementById('asset-pie-chart');
    const toggleBtn = document.getElementById('toggle-pie');

    overviewGrid.innerHTML = '';
    pieCanvas.style.display = "none";
    toggleBtn.textContent = "Pie Chart";

    fetch(`${API_CONFIG.baseUrl}/api/assets/rate/1`)
        .then(response => response.json())
        .then(response => {
            const data = response.data;
            const totals = { stock: 0, bond: 0, fund: 0, crypto: 0 };

            // 渲染卡片 + 收集份额数据
            data.forEach(item => {
                const assetDiv = document.createElement('div');
                assetDiv.className = 'asset';
                assetDiv.dataset.type = item.asset_type;
                const changeColor = item.change > 0 ? 'red' : 'green';
                assetDiv.innerHTML = `
                    ${item.asset_type.toUpperCase()}
                    <div class="value" style="color: ${changeColor};">${item.change > 0 ? '+' : ''}${item.change}%</div>
                    <div class="total_value">$${item.total_profit.toFixed(2)}</div>
                `;
                overviewGrid.appendChild(assetDiv);

                // 统计总份额
                if (totals[item.asset_type] !== undefined) {
                    totals[item.asset_type] += item.total_profit;
                }
            });

            // 点击按钮切换饼图
            toggleBtn.onclick = function() {
                if (pieCanvas.style.display === "none") {
                    pieCanvas.style.display = "block";
                    overviewGrid.style.display = "none";
                    toggleBtn.textContent = "Overview";

                    // 如果之前画过，销毁避免重复叠加
                    if (pieChartInstance) pieChartInstance.destroy();

                    const ctx = pieCanvas.getContext('2d');
                    pieChartInstance = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: ['Stock', 'Bond', 'ETFs', 'Crypto'],
                            datasets: [{
                                data: [
                                    totals.stock,
                                    totals.bond,
                                    totals.fund,
                                    totals.crypto
                                ],
                                backgroundColor: [
                                    'rgba(255, 155, 213)', // pink 半透明
                                    'rgba(47, 98, 55)',    // green 半透明
                                    'rgba(255, 173, 72)',  // yellow 半透明
                                    'rgba(52, 152, 219)'   // blue 半透明
                                ]
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    align : 'end',
                                    labels:{
                                        boxWidth: 15,
                                        padding: 10,
                                        font:{
                                            size: 8
                                        }
                                    }

                                }
                            }
                        }
                    });
                } else {
                    pieCanvas.style.display = "none";
                    overviewGrid.style.display = "grid";
                    toggleBtn.textContent = "Pie Chart";
                }
            };
        })
        .catch(error => {
            console.error('Error loading asset overview data:', error);
        });
}