export function initHoldingsTable() {
    const tbody = document.querySelector('#data-table tbody');
    tbody.innerHTML = '';

    fetch(`../../src/api/holdings.json`)
        .then(response => response.json())
        .then(data => {
            const holdingsData = data.filter(item => item.type === 'stock');
            holdingsData.forEach(item => {
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
        })
        .catch(error => {
            console.error('Error loading holdings data:', error);
        });

    const select = document.getElementById('asset-select');
    if (select) {
        select.addEventListener('change', () => {
            const type = select.value;
            updateHoldingsTable(type);
        });
    }
}
