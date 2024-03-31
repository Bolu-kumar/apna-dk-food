document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault()
})



document.getElementById("resetPasswordForm").addEventListener("submit", (event) => {
    event.preventDefault()
})



firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        location.replace("admin.html")
    }
})


function login(event) {
    event.preventDefault(); // Prevents the default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in successfully
            const user = userCredential.user;
            console.log("User logged in successfully:", user);

            // Redirect to another page
            window.location.href = "admin.html";
        })
        .catch((error) => {
            document.getElementById("error").innerHTML = "Invalid email or password.  Please try again.";
        });
}



function forgotPass(event) {
    event.preventDefault(); // Prevents the default form submission
    const email = document.getElementById("email").value;

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("Reset link sent to your email id");
        })
        .catch((error) => {
            document.getElementById("error").innerHTML = "Invalid email or account. Please try again.";
        });
}
