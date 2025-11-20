const form = document.getElementById('expense-form');
const list = document.getElementById('list');
const totalAmount = document.getElementById('total-amount');
const API_URL = 'http://localhost:3000/api/expenses';
// Fetch and display expenses
async function fetchExpenses() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        displayExpenses(data.data);
        updateTotal(data.data);
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}
function displayExpenses(expenses) {
    list.innerHTML = '';
    expenses.forEach(expense => {
        const item = document.createElement('li');
        item.innerHTML = `
            <div class="item-info">
                <span class="icon">${expense.icon}</span>
                <span>${expense.description}</span>
            </div>
            <div class="item-info">
                <span>$${expense.amount.toFixed(2)}</span>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">&times;</button>
            </div>
        `;
        list.appendChild(item);
    });
}
function updateTotal(expenses) {
    const total = expenses.reduce((acc, item) => acc + item.amount, 0);
    totalAmount.innerText = `$${total.toFixed(2)}`;
}
// Add new expense
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const icon = document.getElementById('icon').value;
    const newExpense = { description, amount, icon };
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newExpense)
        });
        if (response.ok) {
            form.reset();
            fetchExpenses();
        }
    } catch (error) {
        console.error('Error adding expense:', error);
    }
});
// Delete expense
async function deleteExpense(id) {
    if(confirm('Are you sure you want to delete this?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchExpenses();
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    }
}
// Initial load
fetchExpenses();
