export function initCharts() {
    const ctx = document.getElementById('net-worth-chart').getContext('2d');

    // 读取两个 JSON 文件
    Promise.all([
        fetch('../../src/api/net-worth.json').then(res => res.json()),
        fetch('../../src/api/net-worth2.json').then(res => res.json())
    ])
    .then(([barData, lineData]) => {
        const labels = barData.map(item => item.date); // 日期横轴

        const totalAssetData = barData.map(item => item.net_worth);  // 柱状图
        const profitData = lineData.map(item => item.profit);        // 折线图（收益）

        new Chart(ctx, {
            data: {
                labels: labels,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Total Asset',
                        data: totalAssetData,
                        yAxisID: 'y', // 使用左边坐标轴
                        backgroundColor: 'rgba(52, 152, 219, 0.5)', // 蓝色半透明
                        borderRadius: 4,
                        borderSkipped: false
                    },
                    {
                        type: 'line',
                        label: 'Profit',
                        data: profitData,
                        yAxisID: 'y1', // 使用右边坐标轴
                        borderColor: '#6de0ff',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointBorderColor: '#6de0ff',
                        pointBackgroundColor: '#6de0ff',
                        tension: 0.3,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    x: {
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Total Asset',
                            color: 'white'
                        },
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Profit',
                            color: 'white'
                        },
                        ticks: {
                            color: 'white'
                        },
                        grid: {
                            drawOnChartArea: false // 不在主图层画网格
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Error loading chart data:', error);
    });
}
