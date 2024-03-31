

const database = firebase.database();

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


