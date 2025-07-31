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
          <td><button class="delete-btn" data-id="${item.id}" style="color: red;">🗑️</button></td>
        `;
        tbody.appendChild(tr);
      });

      // Add event listeners for delete buttons
      const deleteButtons = tbody.querySelectorAll('.delete-btn');
      deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const holdingId = e.target.getAttribute('data-id');
          showDeleteConfirmation(holdingId);
        });
      });
    }

    function showDeleteConfirmation(holdingId) {
      const modal = document.getElementById('delete-confirm-modal');
      const confirmButton = document.getElementById('confirm-delete-btn');
      const cancelButton = document.getElementById('cancel-delete-btn');
  
      modal.style.display = 'block';
  
      confirmButton.onclick = () => {
        modal.style.display = 'none';
        deleteHolding(holdingId);
      };
  
      cancelButton.onclick = () => {
        modal.style.display = 'none';
      };
    }

    function deleteHolding(holdingId) {
      fetch(`${API_CONFIG.baseUrl}/api/assets/delete/${holdingId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) throw new Error('Failed to delete holding');
          return response.json();
        })
        .then(() => {
          alert('Holding deleted successfully');
          initHoldingsTable(); // Refresh the table
        })
        .catch(err => {
          console.error('Error deleting holding:', err);
          alert('Error deleting holding');
        });
    }

    // Add button functionality
    const addButton = document.getElementById('add-holding-btn');
    const modal = document.getElementById('add-holding-modal');
    const modalForm = document.getElementById('add-holding-form');
    const closeModal = document.getElementById('close-modal');

    if (addButton) {
      addButton.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(modalForm);
            const data = Object.fromEntries(formData.entries());

            // Validate fields
            const requiredFields = ['userID', 'asset_type', 'asset_code', 'asset_name', 'quantity', 'purchase_price', 'current_price', 'purchase_date'];
            for (const field of requiredFields) {
                if (!data[field]) {
                    alert(`${field} cannot be empty`);
                    return;
                }
            }

            // Construct payload
            const payload = {
                metadata: {
                    timestamp: new Date().toISOString(),
                    version: '1.0',
                    source: 'web-ui'
                },
                request: {
                    action: 'add_holding',
                    parameters: data // 原始数据
                }
            };

            // Debug: Log the payload being sent to the server
            console.log('Payload being sent to the server:', payload);

            // Send data to server
            fetch(`${API_CONFIG.baseUrl}/api/assets/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to add holding');
                    return response.json();
                })
                .then(() => {
                    alert('Holding added successfully');
                    modal.style.display = 'none';
                    modalForm.reset();
                    initHoldingsTable(); // Refresh the table
                })
                .catch(err => {
                    console.error('Error adding holding:', err);
                    alert('Error adding holding');
                });
        });
    }

    // Set default value for datetime-local input
    const purchaseDateInput = document.querySelector('input[name="purchase_date"]');
    if (purchaseDateInput) {
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 16); // Format as yyyy-MM-ddTHH:mm
        purchaseDateInput.value = formattedDate;
    }
}