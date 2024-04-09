// Function to add coupon to Firebase
function addCoupon(mealTypeForCoupon, couponCode, discountPercentage, marketingType) {
    database.ref('coupons').push({
        mealTypeForCoupon: mealTypeForCoupon,
        couponCode: couponCode,
        discountPercentage: discountPercentage,
        marketingType: marketingType
    });
}

// Handle coupon form submission
document.getElementById('couponForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const mealTypeForCoupon = document.getElementById('mealTypeForCoupon').value;
    const couponCode = document.getElementById('couponCode').value;
    const discountPercentage = parseInt(document.getElementById('discountPercentage').value);
    const marketingType = document.getElementById('marketingType').value;
    addCoupon(mealTypeForCoupon, couponCode, discountPercentage, marketingType);
    // Reset form fields after submission
    document.getElementById('couponForm').reset();
});

// Function to display coupons from Firebase
function displayCoupons() {
    const couponList = document.getElementById('couponList');
    database.ref('coupons').on('value', function (snapshot) {
        couponList.innerHTML = '';
        snapshot.forEach(function (childSnapshot) {
            const coupon = childSnapshot.val();
            const key = childSnapshot.key;
            const row = document.createElement('tr');
            row.id = `row-${key}`;
            row.innerHTML = `
                <td>${coupon.mealTypeForCoupon}</td>
                <td>${coupon.couponCode}</td>
                <td>${coupon.discountPercentage}</td>
                <td>${coupon.marketingType}</td>
                <td>
                    <button class="btn btn-primary" onclick="editCoupon('${key}', '${coupon.mealTypeForCoupon}', '${coupon.couponCode}', ${coupon.discountPercentage}, '${coupon.marketingType}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteCoupon('${childSnapshot.key}')">Delete</button>
                    <!--  <button class="btn btn-success" onclick="activateCoupon('${childSnapshot.key}')">Activate</button>
                     <button class="btn btn-warning" onclick="deactivateCoupon('${childSnapshot.key}')">Deactivate</button>  -->
                                </td>
            `;
            couponList.appendChild(row);
        });
    });
}

// Call function to display coupons
displayCoupons();


// Function to edit coupon
function editCoupon(key, mealTypeForCoupon, couponCode, discountPercentage, marketingType) {
    console.log("Editing coupon:", key, mealTypeForCoupon, couponCode, discountPercentage, marketingType);

    // Find the row corresponding to the key
    const row = document.getElementById(`row-${key}`);
    console.log("Row:", row);

    if (!row) {
        console.error("Row is null. Element with ID 'row-" + key + "' not found.");
        return; // Exit the function early if row is null
    }

    // Enable editing mode for each cell
    row.innerHTML = `
        <td><input type="text" class="form-control" value="${mealTypeForCoupon}"></td>
        <td><input type="text" class="form-control" value="${couponCode}"></td>
        <td><input type="number" class="form-control" value="${discountPercentage}"></td>
        <td><input type="text" class="form-control" value="${marketingType}"></td>
        <td>
            <button class="btn btn-success" onclick="saveCouponChanges('${key}')">Save</button>
            <button class="btn btn-danger" onclick="deleteCoupon('${key}')">Delete</button>
        </td>
    `;
}


// Function to save changes after editing
function saveCouponChanges(key) {
    const row = document.getElementById(`row-${key}`);
    if (!row) {
        console.error("Row is null. Element with ID 'row-" + key + "' not found.");
        return; // Exit the function early if row is null
    }
    // Get updated values from input fields
    const mealTypeForCoupon = row.querySelector('td:nth-child(1) input').value;
    const couponCode = row.querySelector('td:nth-child(2) input').value;
    const discountPercentage = row.querySelector('td:nth-child(3) input').value;
    const marketingType = row.querySelector('td:nth-child(4) input').value;
    // Display alert message before saving changes
    alert("Changes saved successfully!");
    // Update data in Firebase
    database.ref('coupons/' + key).update({
        mealTypeForCoupon: mealTypeForCoupon,
        couponCode: couponCode,
        discountPercentage: discountPercentage,
        marketingType: marketingType
    });
}


// Function to delete coupon
function deleteCoupon(key) {
    // Display alert message before deleting coupon
    alert("Are you sure you want to delete this coupon?");

    database.ref('coupons/' + key).remove();
}



// Toggle form visibility and change button text/icon for closed button
document.getElementById('toggleFormButtonForCoupon').addEventListener('click', function () {
    const form = document.getElementById('addCoupon');
    const button = document.getElementById('toggleFormButtonForCoupon');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        button.textContent = 'Close Coupon Form';
    } else {
        form.style.display = 'none';
        button.textContent = 'Add Coupon';
    }
});








