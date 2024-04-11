// Order Form JavaScript

// Function to fetch food details from Firebase and display based on meal selection
document.getElementById('mealSelect').addEventListener('change', async function () {
    const selectedMeal = this.value;
    const mealOptions = document.getElementById('mealOptions');
    mealOptions.innerHTML = ''; // Clear previous options

    if (selectedMeal) {
        try {
            const snapshot = await database.ref('menu').orderByChild('mealType').equalTo(selectedMeal).once('value');
            const foodItems = snapshot.val();

            if (foodItems) {
                for (const key in foodItems) {
                    const foodItem = foodItems[key];
                    const optionElement = document.createElement('div');
                    optionElement.classList.add('form-check');
                    optionElement.innerHTML = `
                    <input class="form-check-input meal-checkbox" type="checkbox" data-price="${foodItem.price}" value="${foodItem.mealName}" id="${foodItem.mealName.replace(/\s+/g, '-')}">
                    <label class="form-check-label label-items" for="${foodItem.mealName.replace(/\s+/g, '-')}">${foodItem.mealName} - ₹${foodItem.price}</label>
                `;
                    mealOptions.appendChild(optionElement);
                }
                document.getElementById('mealFields').style.display = 'block';
            } else {
                // If no food items found for the selected meal
                console.log('No food items found for the selected meal');
            }
        } catch (error) {
            console.error('Error fetching food items:', error);
        }
    } else {
        document.getElementById('mealFields').style.display = 'none'; // Hide meal options
    }
});

// Function to calculate the total amount
function calculateTotalAmount() {
    const selectedMealOptions = document.querySelectorAll('#mealOptions input[type="checkbox"]:checked');
    const quantity = parseInt(document.getElementById('quantity').value);
    let totalAmount = 0;
    selectedMealOptions.forEach(function (option) {
        totalAmount += parseFloat(option.dataset.price);
    });
    totalAmount *= quantity;
    return totalAmount;
}

// Function to update the total amount display
function updateTotalAmount() {
    const totalAmount = calculateTotalAmount();
    document.getElementById('totalAmount').textContent = 'Total Amount: ₹' + totalAmount.toFixed(2);
}

// Event listener to update the total amount when meal options or quantity change
document.getElementById('mealOptions').addEventListener('change', updateTotalAmount);
document.getElementById('quantity').addEventListener('change', updateTotalAmount);



// Initialize orderForm
console.log("Initializing orderForm...");
const orderForm = document.getElementById("orderForm");
console.log("orderForm:", orderForm);
const alert = document.querySelector(".alert");
console.log("alert:", alert);


const database = firebase.database();
console.log("Firebase initialized:", firebase);

// Function to fetch the last order ID from the database
function fetchLastOrderId() {
    return database.ref('foodOrder').orderByKey().limitToLast(1).once('value').then(snapshot => {
        const lastOrder = snapshot.val();
        if (lastOrder === null) {
            return null;
        } else {
            const orderId = Object.keys(lastOrder)[0];
            return orderId;
        }
    }).catch(error => {
        console.error('Error fetching last order ID:', error);
        throw error;
    });
}

// Function to generate a unique numeric order ID with 12 digits using auto-increment
function generateUniqueOrderId() {
    console.log("Generating unique order ID...");
    return fetchLastOrderId().then(lastOrderId => {
        console.log("Last order ID (inside generateUniqueOrderId function):", lastOrderId);
        let orderIdCounter = lastOrderId ? parseInt(lastOrderId) + 1 : 310120240001;
        if (isNaN(orderIdCounter)) {
            orderIdCounter = 310120240001; // Set default counter if NaN
        }
        console.log("Generated order ID counter:", orderIdCounter);
        return orderIdCounter.toString().padStart(12, '0');
    }).catch(error => {
        console.error('Error generating order ID:', error);
        throw error;
    });
}


function saveFormData(formData) {
    console.log("Saving form data to Firebase...");
    generateUniqueOrderId().then(orderId => {
        console.log("Generated order ID:", orderId);
        formData.orderId = orderId;
        console.log("Form data with order ID:", formData);
        database.ref('foodOrder/' + orderId).set(formData)
            .then(() => {
                console.log('Form data saved successfully!');
                // Set the user's name and order ID in the modal
                document.getElementById('userName').textContent = formData.name;
                // Example usage
                const deliveryPaidStatus = document.getElementById('deliveyPaidstatus');
                deliveryPaidStatus.textContent = toProperCase(formData.deliveryChargePaid);

                document.getElementById('invoiceNumber').textContent = orderId;

                $('#orderConfirmationModal').modal('show'); // Trigger the modal
                setTimeout(() => {
                    $('#orderConfirmationModal').modal('hide'); // Close the modal after 5 seconds
                    orderForm.reset();

                    window.location.href = 'https://dktiffin.itfinisher.in/';
                }, 10000);
            })
            .catch(error => {
                console.error('Error saving data:', error);
                alert.textContent = 'An error occurred while placing the order. Please try again.';
                alert.style.display = "block";
            });
    }).catch(error => {
        console.error('Error generating order ID:', error);
        alert.textContent = 'An error occurred while generating the order ID. Please try again.';
        alert.style.display = "block";
    });
}

function toProperCase(str) {
    return str.toLowerCase().replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}

// Function to display current date and time in Indian time zone on order confirmation
function displayDateTime() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone: 'Asia/Kolkata' };
    const currentDateTime = new Date().toLocaleString('en-IN', options);
    document.getElementById('currentDateTime').textContent = currentDateTime;
}


// Get the share button element
const shareButton = document.getElementById('shareButton');

// Add click event listener to the share button
shareButton.addEventListener('click', function () {
    // Get the order details
    const userName = document.getElementById('userName').textContent;
    const invoiceNumber = document.getElementById('invoiceNumber').textContent;
    const deliveryChargePaid = document.querySelector('input[name="deliveryChargePaid"]:checked').value;


    const message = `Hi Team,\nMy Name: ${userName},\nOrder Id: ${invoiceNumber},\nDelivery Fee Status: ${deliveryChargePaid}\nI have ordered my tiffin.\nWhen will it arrive?\n`;


    // Construct the WhatsApp sharing link
    const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    // Open the WhatsApp sharing link in a new tab
    window.open(whatsappURL, '_blank');
});




// Call the function to display date and time when the modal is shown
$('#orderConfirmationModal').on('show.bs.modal', function (e) {
    displayDateTime();
});




// Add event listener to form submission
console.log("Adding event listener to form submission...");
orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Form submitted...");

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
    const address = document.getElementById('address').value;
    const pincode = document.getElementById('pincode').value;
    const streetName = document.getElementById('streetName').value;
    const doorNumber = document.getElementById('doorNumber').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const deliveryChargePaid = document.querySelector('input[name="deliveryChargePaid"]:checked').value;

    // Get the selected subscription plan
    const subscriptionPlan = document.querySelector('input[name="subscriptionPlan"]:checked').value;
    const selectedMeal = document.getElementById('mealSelect').value;
    // Get the values of the checked mealFields checkboxes
    const mealFields = Array.from(document.querySelectorAll('#mealOptions input[type="checkbox"]:checked')).map(item => item.id); // Use item.id instead of item.value

    const quantity = parseInt(document.getElementById('quantity').value);
    const totalAmount = calculateTotalAmount(); // Assuming you have the calculateTotalAmount function

    console.log("Form values:", name, email, phoneNumber, deliveryMethod, address, pincode, streetName, doorNumber, paymentMethod, selectedMeal, mealFields, quantity, totalAmount);



    // Get current date and time
    var currentdate = new Date();

    // Adjust for India Standard Time (GMT+5:30)
    currentdate.setHours(currentdate.getHours() + 5);
    currentdate.setMinutes(currentdate.getMinutes() + 30);

    // Convert to ISO 8601 format
    var isoDateTime = currentdate.toISOString();



    const formData = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        deliveryMethod: deliveryMethod,
        address: address,
        pincode: pincode,
        streetName: streetName,
        doorNumber: doorNumber,
        paymentMethod: paymentMethod,
        subscriptionPlan: subscriptionPlan,
        deliveryChargePaid: deliveryChargePaid,
        selectedMeal: selectedMeal,
        mealFields: mealFields,
        status: "Pending",
        quantity: quantity,
        totalAmount: totalAmount,
        timestamp: isoDateTime // Add current date and time,

    };

    console.log("Form data:", formData);

    saveFormData(formData);
});

