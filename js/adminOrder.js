const database = firebase.database();
const orderList = document.getElementById("orderList");



const itemsPerPage = 5; // Number of items to display per page
let currentPage = 1;
let totalItems = 0;




// Fetch orders with pagination and filtering
function fetchOrders(searchQuery = "") {
    clearOrderList();

    database.ref('foodOrder').once('value', (snapshot) => {
        const orders = snapshot.val();
        if (orders) {
            let filteredOrders = filterOrders(orders, searchQuery);

            // Reverse the order of filtered orders
            filteredOrders.reverse();

            // Pagination
            totalItems = filteredOrders.length;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
            filteredOrders = filteredOrders.slice(startIndex, endIndex);

            if (filteredOrders.length === 0) {
                displayNoOrdersMessage();
            } else {
                renderOrders(filteredOrders);
                initPagination(totalItems);
            }
        } else {
            displayNoOrdersMessage();
        }
    });
}



// Function to clear order list
function clearOrderList() {
    orderList.innerHTML = "";
}

// Function to render orders on the page
function renderOrders(orders) {
    orders.forEach(renderOrder);
}




// Function to render an order row 
function renderOrder(order) {
    const row = createOrderRow(order);
    orderList.appendChild(row);
}



// Function to create an order row

function createOrderRow(order) {
    const row = document.createElement("tr");

    const timestamp = order.timestamp;
    const formattedDateTime = formatTimestamp(timestamp);

    row.innerHTML = `
        <td>${order.orderId}</td>
        <td>${formattedDateTime}</td>
        <td>${order.name}</td>
        <td>${order.email}</td>
        <td>${order.phoneNumber}</td>
        <td>${order.address}</td>
        <td>${order.pincode}</td>
        <td>${order.streetName}</td>
        <td>${order.doorNumber}</td>
        <td>${order.deliveryMethod}</td>
        <td>${order.paymentMethod}</td>
        <td>${order.selectedMeal}</td>
        <td>${order.mealFields}</td>
        <td>${order.quantity}</td>
        <td>${order.totalAmount}</td>
        
        <td>
            <select class="form-control status-select" id="status_${order.orderId}" style="width: 150px;">
                <option value="Pending" ${isSelected(order.status, 'Pending')}>Pending</option>
                <option value="Processing" ${isSelected(order.status, 'Processing')}>Processing</option>
                <option value="Completed" ${isSelected(order.status, 'Completed')}>Completed</option>
                <option value="Cancelled" ${isSelected(order.status, 'Cancelled')}>Cancelled</option>
            </select>
        </td>
        <td>
            <div class="d-flex justify-content-between align-items-center">
                <button class="btn btn-sm btn-primary mr-2" onclick="updateOrder('${order.orderId}')">Update</button>
                <button class="btn btn-sm btn-danger" onclick="deleteOrder('${order.orderId}')">Delete</button>
            </div>
        </td>
    `;
    return row;
}


// Function to initialize pagination navigation
function initPagination(totalItems) {
    const numPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    // Add "Previous" link
    paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="goToPage(currentPage - 1)">Previous</a></li>`;

    // Add page links
    for (let i = 1; i <= numPages; i++) {
        paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="goToPage(${i})">${i}</a></li>`;
    }

    // Add "Next" link
    paginationContainer.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="goToPage(currentPage + 1)">Next</a></li>`;
}

// Function to navigate to a specific page
function goToPage(page) {
    if (page < 1 || page > Math.ceil(totalItems / itemsPerPage)) {
        return; // Invalid page number
    }
    currentPage = page;
    fetchOrders();
}

// Function to filter orders based on search query
function filterOrders(orders, searchQuery) {
    if (!searchQuery) return Object.values(orders);

    return Object.values(orders).filter((order) => {
        return (
            order.phoneNumber.includes(searchQuery) ||
            order.orderId.includes(searchQuery)
        );
    });
}

// Function to display no orders message
function displayNoOrdersMessage() {
    const row = document.createElement("tr");
    row.innerHTML = "<td colspan='14' class='text-center'>No orders found</td>";
    orderList.appendChild(row);
}

// Function to handle search
function searchOrders(inputId) {
    const searchQuery = document.getElementById(inputId).value.trim();
    fetchOrders(searchQuery);
}

// Initial fetch of orders
fetchOrders();




// Other functions like updateOrder, deleteOrder, displayMessage, etc.

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Ensure 24-hour format
        timeZone: 'UTC' // Set the timezone here, replace 'UTC' with the appropriate timezone
    };

    // Format the date and time using toLocaleString()
    const formattedDateTime = date.toLocaleString('en-US', options);

    return formattedDateTime;
}


function isSelected(currentStatus, targetStatus) {
    return currentStatus === targetStatus ? 'selected' : '';
}



function searchOrders(inputId) {
    const searchQuery = document.getElementById(inputId).value.trim();
    fetchOrders(searchQuery);
}


function updateOrder(orderId) {
    const newStatus = document.getElementById("status_" + orderId).value;

    database.ref('foodOrder/' + orderId).update({
        status: newStatus
    }).then(() => {
        console.log('Order updated successfully.');
        setTimeout(() => {
            displayMessage('Order updated successfully.'); // Display success message
        }, 500); // Delay in milliseconds
        fetchOrders();
    }).catch((error) => {
        console.error('Error updating order:', error);
    });
}

function deleteOrder(orderId) {
    database.ref('foodOrder/' + orderId).remove().then(() => {
        console.log('Order deleted successfully.');
        setTimeout(() => {
            displayMessage('Order deleted successfully.'); // Display success message
        }, 500); // Delay in milliseconds
        fetchOrders();
    }).catch((error) => {
        console.error('Error deleting order:', error);
    });
}


function displayMessage(messageText) {
    // Create a message element
    const messageElement = document.createElement('div');
    messageElement.textContent = messageText;
    messageElement.classList.add('alert', 'alert-success'); // Add Bootstrap alert classes

    // Append the message element to the message container
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.appendChild(messageElement);

    // Remove the message after a certain time (e.g., 5 seconds)
    setTimeout(() => {
        messageContainer.removeChild(messageElement);
    }, 5000);
}


// Food menu start

// Function to add menu item to Firebase
function addMenuItem(mealType, mealName, availableFood, quantity, price, imageUrl) {
    database.ref('menu').push({
        mealType: mealType,
        mealName: mealName,
        availableFood: availableFood,
        quantity: quantity,
        price: price,
        imageUrl: imageUrl
    });
}

// Handle form submission
document.getElementById('menuForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const mealType = document.getElementById('mealType').value;
    const mealName = document.getElementById('mealName').value;
    const availableFood = document.getElementById('availableFood').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);
    const imageFile = document.getElementById('imageFile').files[0];
    if (imageFile) {
        const storageRef = firebase.storage().ref('menu_images/' + imageFile.name);
        storageRef.put(imageFile).then(function (snapshot) {
            snapshot.ref.getDownloadURL().then(function (downloadURL) {
                addMenuItem(mealType, mealName, availableFood, quantity, price, downloadURL);
                // Reset form fields after submission
                document.getElementById('menuForm').reset();
            });
        });
    }
});

// Display menu items in table format
const menuItemsRef = database.ref('menu');
menuItemsRef.on('value', function (snapshot) {
    const menuItems = snapshot.val();
    let tableRowsHTML = '';
    for (let key in menuItems) {
        tableRowsHTML += `
            <tr id="row-${key}">
<td>${menuItems[key].mealType}</td>
<td>${menuItems[key].mealName}</td>
<td>${menuItems[key].availableFood}</td>
<td>${menuItems[key].quantity}</td>
<td>${menuItems[key].price}</td>
<td><img src="${menuItems[key].imageUrl}" alt="${menuItems[key].mealName}" style="max-width: 100px;"></td>
<td>
    <div class="d-flex">
        <button class="btn btn-primary mr-1" onclick="editMenuItem('${key}', '${menuItems[key].mealType}', '${menuItems[key].mealName}', '${menuItems[key].availableFood}', ${menuItems[key].quantity}, ${menuItems[key].price}, '${menuItems[key].imageUrl}')">Edit</button>
        <button class="btn btn-danger" onclick="deleteMenuItem('${key}')">Delete</button>
    </div>
</td>
</tr>

            `;
    }
    document.getElementById('menuItemsTableBody').innerHTML = tableRowsHTML;
});

// Function to delete menu item
function deleteMenuItem(key) {
    database.ref('menu/' + key).remove();
}

// Function to edit menu item
function editMenuItem(key, mealType, mealName, availableFood, quantity, price, imageUrl) {
    const row = document.getElementById(`row-${key}`);
    const cells = row.getElementsByTagName('td');

    // Enable editing mode for each cell
    cells[0].innerHTML = `<input type="text" class="form-control" value="${mealType}">`;
    cells[1].innerHTML = `<input type="text" class="form-control" value="${mealName}">`;
    cells[2].innerHTML = `<input type="text" class="form-control" value="${availableFood}">`;
    cells[3].innerHTML = `<input type="number" class="form-control" value="${quantity}">`;
    cells[4].innerHTML = `<input type="number" class="form-control" value="${price}">`;
    cells[5].innerHTML = `<input type="text" class="form-control" value="${imageUrl}">`;

    // Add save button
    cells[6].innerHTML = `<button class="btn btn-success" onclick="saveChanges('${key}')">Save</button>`;
}

// Function to save changes after editing
function saveChanges(key) {
    const row = document.getElementById(`row-${key}`);
    const cells = row.getElementsByTagName('td');

    // Get updated values from input fields
    const mealType = cells[0].getElementsByTagName('input')[0].value;
    const mealName = cells[1].getElementsByTagName('input')[0].value;
    const availableFood = cells[2].getElementsByTagName('input')[0].value;
    const quantity = parseInt(cells[3].getElementsByTagName('input')[0].value);
    const price = parseFloat(cells[4].getElementsByTagName('input')[0].value);
    const imageUrl = cells[5].getElementsByTagName('input')[0].value;

    // Update data in Firebase
    database.ref('menu/' + key).set({
        mealType: mealType,
        mealName: mealName,
        availableFood: availableFood,
        quantity: quantity,
        price: price,
        imageUrl: imageUrl
    });
}



// Toggle add form visibility and change button text/icon
document.getElementById('toggleFormButton').addEventListener('click', function () {
    const form = document.getElementById('addForm');
    const button = document.getElementById('toggleFormButton');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        button.textContent = 'Close Menu';
    } else {
        form.style.display = 'none';
        button.textContent = 'Add Menu Item';
    }
});


