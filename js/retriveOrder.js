
// Reference to your database
const database = firebase.database();

// Reference to the location of your data in the database
const dataRef = database.ref('foodOrder');

// Fetch data once
dataRef.once('value', (snapshot) => {
    // Get the data from the snapshot
    const data = snapshot.val();

    // Display the data on the webpage
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.innerText = JSON.stringify(data, null, 2); // Convert data to JSON format for display
});