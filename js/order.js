// ---------------------------orderForm Forms ------------------------
const form = document.getElementById("orderForm");
const alert = document.querySelector(".alert");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBLvhQ5Ag0kDvqCVN1ggKmx1ZgBPk_XfYI",
    authDomain: "diwakar-tiffin-services.firebaseapp.com",
    databaseURL: "https://diwakar-tiffin-services-default-rtdb.firebaseio.com",
    projectId: "diwakar-tiffin-services",
    storageBucket: "diwakar-tiffin-services.appspot.com",
    messagingSenderId: "901872908984",
    appId: "1:901872908984:web:5eb4319972dbb49b4e524d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to fetch the last order ID from the database
function fetchLastOrderId() {
    return database.ref('orders').orderByKey().limitToLast(1).once('value').then(snapshot => {
        // Get the last order node
        const lastOrder = snapshot.val();
        // Extract the order ID from the last order
        const orderId = Object.keys(lastOrder)[0];
        return orderId;
    }).catch(error => {
        console.error('Error fetching last order ID:', error);
        throw error;
    });
}

// Function to generate a unique numeric order ID with 12 digits using auto-increment
function generateUniqueOrderId() {
    return fetchLastOrderId().then(lastOrderId => {
        // If no orders exist in the database yet, start with the default counter
        let orderIdCounter = lastOrderId ? parseInt(lastOrderId) + 1 : 310120240001;
        if (isNaN(orderIdCounter)) {
            orderIdCounter = 310120240001; // Set default counter if NaN
        }
        return orderIdCounter.toString().padStart(12, '0');
    }).catch(error => {
        console.error('Error generating order ID:', error);
        throw error;
    });
}

// Function to save form data to Firebase
function saveFormData(formData) {
    // Generate a unique order ID
    generateUniqueOrderId().then(orderId => {
        // Assign the orderId to the formData
        formData.orderId = orderId;
        // Save the form data to the database under the 'orders' node with the generated order ID
        database.ref('orders/' + orderId).set(formData)
            .then(() => {
                // Display the alert
                alert.textContent = 'Order placed successfully!';
                alert.style.display = "block";

                // After 5 seconds
                setTimeout(() => {
                    // Hide the alert
                    alert.style.display = "none";
                    form.reset(); // Reset the form

                    // Redirect to WhatsApp
                    const phoneNumber = "+919350125817";
                    const message = "Hi, I have ordered my tiffin. When will it arrive?";
                    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
                    window.location.href = whatsappURL;
                }, 5000);
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

// Add event listener to form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const selectedMeal = document.getElementById('mealSelect').value;
    // Get selected additional items
    const additionalItems = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(item => item.value);
    // Get other form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const address = document.getElementById('address').value;
    const pincode = document.getElementById('pincode').value;
    const streetName = document.getElementById('streetName').value;
    const doorNumber = document.getElementById('doorNumber').value;
    const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Data to be saved
    const formData = {
        selectedMeal,
        additionalItems,
        name,
        email,
        phoneNumber,
        address,
        pincode,
        streetName,
        doorNumber,
        deliveryMethod,
        paymentMethod
    };

    // Save form data to Firebase
    saveFormData(formData);
});
