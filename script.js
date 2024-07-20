// Sample product data
let productData = JSON.parse(localStorage.getItem('productData')) || [
    { name: 'Product A', quantity: 30 },
    { name: 'Product B', quantity: 50 },
    { name: 'Product C', quantity: 20 },
    { name: 'Product D', quantity: 60 },
    { name: 'Product E', quantity: 40 },
];

// Sample recipient data
let recipientData = JSON.parse(localStorage.getItem('recipients')) || [];

// Render highest quantity products
function renderHighestProducts() {
    const highestProductsDiv = document.getElementById('highestProducts');
    highestProductsDiv.innerHTML = '';
    const sortedProducts = [...productData].sort((a, b) => b.quantity - a.quantity).slice(0, 3);
    sortedProducts.forEach(product => {
        highestProductsDiv.innerHTML += `<div class="product-box">${product.name} <div> ${product.quantity}</div</div>`;
    });
}

// Render bar chart
function renderBarChart() {
    const data = [
        {
            x: productData.map(product => product.name),
            y: productData.map(product => product.quantity),
            type: 'bar'
        }
    ];
    Plotly.newPlot('myDiv', data);
}

// Render recipient table
function renderRecipientTable() {
    const tableBody = document.querySelector('#recipientTable tbody');
    tableBody.innerHTML = '';
    recipientData.forEach(recipient => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${recipient.productName}</td><td>${recipient.receipt}</td><td>${recipient.quantity}</td>`;
        tableBody.appendChild(row);
    });
}

// Handle add product
function handleAddProduct(event) {
    event.preventDefault();
    const form = event.target;
    const productName = form.productName.value;
    const quantity = parseInt(form.quantity.value, 10);
    productData.push({ name: productName, quantity });
    localStorage.setItem('productData', JSON.stringify(productData));

    alert('Product added successfully');
    form.reset();
    document.getElementById('addProductBtn').style.display = 'block';
    document.getElementById('updateInventoryBtn').style.display = 'block';

    renderHighestProducts();
    renderBarChart();
}

// Handle update inventory
function handleUpdateInventory(event) {
    event.preventDefault();
    const form = event.target;
    const productName = form.productName.value;
    const quantity = parseInt(form.quantity.value, 10);
    const receipt = form.receipt.value;
    
    // Check if the product exists in the productData
    const productIndex = productData.findIndex(product => product.name === productName);
    if (productIndex > -1) {
        // If product exists, update the quantity by subtracting
        productData[productIndex].quantity -= quantity;
        if (productData[productIndex].quantity < 0) {
            productData[productIndex].quantity = 0; // Prevent negative quantities
        }
    } else {
        // If product doesn't exist, handle accordingly (e.g., show an alert)
        alert('Product not found in inventory');
        return;
    }
   
    // Update localStorage with the modified productData
    localStorage.setItem('productData', JSON.stringify(productData));

    // Update recipient data
    recipientData.push({ productName, quantity, receipt });
    localStorage.setItem('recipients', JSON.stringify(recipientData));
   
    alert('Inventory updated successfully');
    form.reset();
  
    // Render updates or refresh the display
    renderHighestProducts();
    renderBarChart();
    renderRecipientTable();

}

// Show add product form
document.getElementById('addProductBtn').addEventListener('click', () => {
    const addProductForm = `
        <form id="addProductForm">
            <button type="button" onclick="hideForm()" class="cancel">X</button>
            <label for="productName">Product Name:</label>
            <input type="text" id="productName" name="productName" required>
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" required>
            <button type="submit">Add Product</button>
            
        </form>
    `;
    showForm(addProductForm);
});


// Show update inventory form
document.getElementById('updateInventoryBtn').addEventListener('click', () => {
    const updateInventoryForm = `
        <form id="updateInventoryForm">
        <button type="button" onclick="hideForm()" class="cancel">X</button>
            <label for="productName">Product Name:</label>
            <input type="text" id="productName" name="productName" required>
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" required>
            <label for="receipt">Receipt:</label>
            <input type="text" id="receipt" name="receipt" required>
            <button type="submit">Update Inventory</button>
            
        </form>
    `;
    showForm(updateInventoryForm);
});


function handleAddProduct(event) {
    event.preventDefault();
    // Handle the add product form submission
    alert('Product added successfully');
    hideForm();
}

function handleUpdateInventory(event) {
    event.preventDefault();
    // Handle the update inventory form submission
    alert('Inventory updated successfully');
    hideForm();
}

// Attach form submission handlers
document.addEventListener('submit', function(event) {
    if (event.target.id === 'addProductForm') {
        handleAddProduct(event);
    } else if (event.target.id === 'updateInventoryForm') {
        handleUpdateInventory(event);
    }
});

// Initial rendering
renderHighestProducts();
renderBarChart();
renderRecipientTable();


function showForm(formHtml) {
    document.getElementById('formContent').innerHTML = formHtml;
    document.getElementById('formContent').classList.remove('hidden');
    document.getElementById('formContainer').classList.add('hidden');
}

// Function to hide the form and show buttons
function hideForm() {
    document.getElementById('formContent').classList.add('hidden');
    document.getElementById('formContainer').classList.remove('hidden');
}