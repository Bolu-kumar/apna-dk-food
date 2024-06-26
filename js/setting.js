//.................................Start  Cleaup Data .......................................................
// Function to clean database based on selected time duration
function cleanDatabase() {
    const startDate = document.getElementById("cleanStartDate").value;
    const endDate = document.getElementById("cleanEndDate").value;

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    // Ask for confirmation before cleaning the database
    const confirmed = confirm("Are you sure you want to clean the database?");
    if (!confirmed) {
        return; // Exit function if not confirmed
    }

    // Convert dates to timestamp format
    const startTimestamp = new Date(startDate).toISOString();
    const endTimestamp = new Date(endDate).toISOString();

    console.log("Start Timestamp:", startTimestamp);
    console.log("End Timestamp:", endTimestamp);

    // Define the Firebase database reference
    const dbRef = firebase.database().ref('foodOrder');

    console.log("Database Reference:", dbRef.toString());

    // Query the database for records within the selected time range
    dbRef.orderByChild('timestamp').startAt(startTimestamp).endAt(endTimestamp).once('value')
        .then(snapshot => {
            console.log("Query Snapshot:", snapshot.val());

            // Check if there are records in the snapshot
            if (snapshot.exists()) {
                // Remove each record within the selected time range
                snapshot.forEach(childSnapshot => {
                    console.log("Removing:", childSnapshot.key);
                    childSnapshot.ref.remove();
                });

                alert("Database cleaned successfully.");
                // Reset date fields
                startDateInput.value = '';
                endDateInput.value = '';
            } else {
                console.log("No records found in the specified time range.");
                alert("No records found in the specified time range.");
            }
        })
        .catch(error => {
            console.error("Error cleaning database:", error);
            alert("An error occurred while cleaning the database.");
        });
}

//.................................End Cleaup Data .......................................................


//.................................. Start Export Data .....................................................





// Function to export data to CSV
async function exportToCsv(filename, headers, rows) {
    try {
        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

        if ('showSaveFilePicker' in window) {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: filename,
                types: [{
                    description: 'CSV Files',
                    accept: {
                        'text/csv': ['.csv'],
                    },
                }],
            });
            const writableStream = await fileHandle.createWritable();
            await writableStream.write(csvContent);
            await writableStream.close();
        } else {
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        alert("Database Save successfully.");
    } catch (err) {
        console.error('Error saving file:', err);
    }
}




// Fetch data from Firebase and convert to CSV
document.getElementById("exportButton").addEventListener("click", async function () {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
    }

    // Convert dates to timestamp format
    const startTimestamp = new Date(startDate).toISOString();
    const endTimestamp = new Date(endDate).toISOString();

    console.log("Start Timestamp:", startTimestamp);
    console.log("End Timestamp:", endTimestamp);

    // Define headers corresponding to each column
    var headers = [
        "orderId", "timestamp", "name", "phoneNumber", "email",
        "selectedMeal", "totalAmount", "mealFields", "address",
        "deliveryMethod", "status"
    ];

    // Reference to Firebase database
    const dbRef = firebase.database().ref('foodOrder');

    // Query the database for records within the selected time range
    dbRef.orderByChild('timestamp').startAt(startTimestamp).endAt(endTimestamp).once('value')
        .then(snapshot => {
            var data = snapshot.val();
            var rows = [];

            console.log(data)

            // Convert Firebase data to CSV format
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var row = [];
                    // Push data for each field into the row array
                    row.push(`"${data[key].orderId || ''}"`);
                    row.push(`"${data[key].timestamp || ''}"`);
                    row.push(`"${data[key].name || ''}"`);
                    row.push(`"${data[key].phoneNumber || ''}"`);
                    row.push(`"${data[key].email || ''}"`);
                    row.push(`"${data[key].selectedMeal || ''}"`);
                    row.push(`"${data[key].totalAmount || ''}"`);
                    var mealFields = data[key].mealFields ? `"${data[key].mealFields.join(', ')}"` : '';
                    row.push(mealFields);
                    row.push(`"${data[key].address || ''}"`);
                    row.push(`"${data[key].deliveryMethod || ''}"`);
                    row.push(`"${data[key].status || ''}"`);

                    rows.push(row);
                }
            }

            // Export data to CSV with headers
            exportToCsv('firebase_data.csv', headers, rows);
        })
        .catch(error => {
            console.error("Error fetching data from Firebase:", error);
            alert("An error occurred while fetching data from Firebase.");
        });
});


//.................................. End Export Data .....................................................
