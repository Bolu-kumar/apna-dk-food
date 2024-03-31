// logout
// Check if the user is authenticated
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        // If user is not authenticated, redirect to login page
        location.replace("login.html");
    } else {
        // If user is authenticated, display a greeting
        const userName = user.email.split('@')[0]; // Extract username from email
        document.getElementById("userName").innerHTML = "Hi, " + userName;

        // document.getElementById("userName").innerHTML = "Hello, " + user.email;
    }
});

// Function to handle logout
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("User signed out successfully.");
        // Redirect to the login page
        window.location.href = "login.html";
    }).catch((error) => {
        // An error happened.
        console.error("Error signing out:", error);
    });
}
