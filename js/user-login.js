
// user login pop up
function openLoginPopup() {
    document.getElementById("login-popup").style.display = "block";
}

function closeLoginPopup() {
    document.getElementById("login-popup").style.display = "none";
}
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCvFgMk5U8Wi2kKkHemGdVcknueraLT8R4", //Other API
    authDomain: "rkdktiffinbox.firebaseapp.com",
    projectId: "rkdktiffinbox",
    databaseURL: "https://rkdktiffinbox-default-rtdb.firebaseio.com/",
    storageBucket: "rkdktiffinbox.appspot.com",
    messagingSenderId: "478058439707",
    appId: "1:478058439707:web:86c5af98ecf5be2a3d04be",
    measurementId: "G-ZTBN8JQCM8"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();


// Set Firebase session persistence to keep the user logged in
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log("Session persistence set to LOCAL");
    })

    .catch((error) => {
        console.error("Error setting session persistence:", error);
    });

// Check if the user is authenticated on page load
auth.onAuthStateChanged((user) => {
    if (user) {
        updateUIForLoggedInUser(user);
        displayOrders();
    } else {
        updateUIForLoggedOutUser();
    }
});

// Google Sign-In
function googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            updateUIForLoggedInUser(user);
            displayOrders();
        })
        .catch((error) => {
            console.error("Error signing in with Google:", error);
        });
}

// Google Sign-Out
function googleSignOut() {
    auth.signOut()
        .then(() => {
            updateUIForLoggedOutUser();
        })
        .catch((error) => {
            console.error("Error signing out:", error);
        });
}

function updateUIForLoggedInUser(user) {
    document.getElementById("username").innerText = `Welcome, ${user.displayName}`;
    document.getElementById("username").classList.remove("d-none");
    document.getElementById("signoutButton").classList.remove("d-none");
    document.getElementById("order-form").classList.remove("d-none");
    document.getElementById("order-data").classList.remove("d-none");
    closeLoginPopup();
}

function updateUIForLoggedOutUser() {
    document.getElementById("username").classList.add("d-none");
    document.getElementById("signoutButton").classList.add("d-none");
    document.getElementById("order-form").classList.add("d-none");
    document.getElementById("order-data").classList.add("d-none");
    document.getElementById("username").innerText = "";
}

function submitOrder() {
    const uid = auth.currentUser.uid;
    const item = document.getElementById("item").value;
    const quantity = document.getElementById("quantity").value;
    const customerName = document.getElementById("customer-name").value;
    const address = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;

    const orderData = {
        item,
        quantity,
        customerName,
        address,
        phone,
    };

    database.ref("orders/" + uid).push(orderData)
        .then(() => {
            console.log("Order placed successfully");
            displayOrders(); // Refresh orders list
        })
        .catch((error) => {
            console.error("Error placing order:", error);
        });
}

function displayOrders() {
    const uid = auth.currentUser.uid;
    const orderList = document.getElementById("order-list");

    database.ref("orders/" + uid).once("value")
        .then((snapshot) => {
            const orders = snapshot.val();
            orderList.innerHTML = "";

            if (orders) {
                Object.keys(orders).forEach((key) => {
                    const order = orders[key];
                    const row = document.createElement("tr");

                    row.innerHTML = `
                <td>${order.item}</td>
                <td>${order.quantity}</td>
                <td>${order.customerName}</td>
                <td>${order.address}</td>
                <td>${order.phone}</td>
            `;

                    orderList.appendChild(row);
                });
            } else {
                console.log("No orders found");
            }
        })
        .catch((error) => {
            console.error("Error fetching orders:", error);
        });
}

function showOrderForm() {
    document.getElementById("order-form").classList.remove("d-none");
    document.getElementById("order-data").classList.add("d-none");
}

function closeLoginPopup() {
    document.getElementById("login-popup-wrapper").style.display = "none";
}

