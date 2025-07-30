export function initStockChart() {
    const ctxStock = document.getElementById('stock-trend-chart');
    const stockSelect = document.getElementById('stock-select');
    if (!ctxStock || !stockSelect) return;
  
    let stockTrendChart = new Chart(ctxStock.getContext('2d'), {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            type: 'line',
            label: 'Price',
            data: [],
            borderColor: '#4bc0c0',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            type: 'bar',
            label: 'Volume',
            data: [],
            backgroundColor: ctx => ctx.raw >= 0 ? 'rgba(255,99,132,0.6)' : 'rgba(75,192,192,0.6)',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { labels: { color: 'white' } } },
        scales: {
          y: { type: 'linear', position: 'left', ticks: { color: 'white' } },
          y1: { type: 'linear', position: 'right', ticks: { color: 'white' }, grid: { drawOnChartArea: false } },
          x: { ticks: { color: 'white' } }
        }
      }
    });
  

    async function updateChart(symbol) {
        try {
          const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart?interval=5m&region=US&symbol=${symbol}&range=1d&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit`;
          
          const res = await fetch(url, {
            method: 'GET',
            headers: {
              "x-rapidapi-key": "cd8c7f660dmsh6f5277744c6cc7fp1a80d7jsn3a00ebdcd986",  // 你的真实 Key
              "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
            }
          });
      
          const data = await res.json();
          const result = data.chart?.result?.[0];
          if (!result) {
            console.error("No data returned from Yahoo API");
            return;
          }
      
          const timestamps = result.timestamp;
          const prices = result.indicators.quote[0].close;
          const volumes = result.indicators.quote[0].volume;
      
          const labels = timestamps.map(ts =>
            new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          );

                // 动态计算纵轴范围（上下浮动 1%）
          const minPrice = Math.min(...prices.filter(p => p != null));
          const maxPrice = Math.max(...prices.filter(p => p != null));
          const padding = (maxPrice - minPrice) * 0.02; // 上下各留 2%
      
          stockTrendChart.data.labels = labels;
          stockTrendChart.data.datasets[0].data = prices;
          stockTrendChart.data.datasets[1].data = volumes;
          stockTrendChart.data.datasets[0].label = `${symbol} Price`;

          stockTrendChart.options.scales.y.min = minPrice - padding;
          stockTrendChart.options.scales.y.max = maxPrice + padding;


          stockTrendChart.update();
        } catch (e) {
          console.error('Yahoo API Error:', e);
        }
      }

      function applyTheme() {
        const isLight = document.body.classList.contains('light-theme');
        stockTrendChart.options.plugins.legend.labels.color = isLight ? 'black' : 'white';
        stockTrendChart.options.scales.x.ticks.color = isLight ? 'black' : 'white';
        stockTrendChart.options.scales.y.ticks.color = isLight ? 'black' : 'white';
        stockTrendChart.options.scales.y1.ticks.color = isLight ? 'black' : 'white';
        stockTrendChart.update();
      }
      
      // 初次执行
      applyTheme();
      
      // 监听主题切换按钮（假设按钮 id 是 toggle-theme）
      document.getElementById('toggle-theme').addEventListener('click', () => {
        setTimeout(applyTheme, 100); // 切换完成后刷新图表样式
      });
    stockSelect.addEventListener('change', e => updateChart(e.target.value));
    setInterval(() => updateChart(stockSelect.value), 60000); // 每分钟刷新一次
    updateChart('AAPL');
  }