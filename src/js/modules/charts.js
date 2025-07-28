export function initCharts() {
    const ctx = document.getElementById('net-worth-chart').getContext('2d');
    fetch('../../src/api/net-worth.json') // 修改路径以匹配实际位置
        .then(response => response.json())
        .then(data => {
            const labels = data.map(item => item.date);
            const netWorthData = data.map(item => item.net_worth);

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Net Worth',
                        data: netWorthData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'transparent',
                        pointBorderColor: '#6de0ff',
                        pointBackgroundColor: '#6de0ff',
                        borderWidth: 2,
                        fill: false
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white'
                            }
                        }
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
                            ticks: {
                                color: 'white'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error loading net worth data:', error);
        });
}
