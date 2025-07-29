export function initTopLists() {
    const updateTopGainers = () => {
        const tbody = document.querySelector('#top-gainers tbody');
        tbody.innerHTML = '';

        fetch('../../src/api/top-gainers.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                      <td>${item.name}</td>
                      <td>$${item.price}</td>
                      <td style="color: red;">+${(item.change * 100).toFixed(2)}%</td>
                  `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error loading top gainers data:', error);
            });
    };

    const updateTopLosers = () => {
        const tbody = document.querySelector('#top-losers tbody');
        tbody.innerHTML = '';
        fetch('../../src/api/top-losers.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                      <td>${item.name}</td>
                      <td>$${item.price}</td>
                      <td style="color: green;">-${(item.change * 100).toFixed(2)}%</td>
                  `;
                    tbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error loading top losers data:', error);
            });
    };

    updateTopGainers();
    updateTopLosers();
}
