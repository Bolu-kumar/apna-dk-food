// Get a reference to the database
// const database = firebase.database()
const ordersRef = database.ref("foodOrder") // Change 'orders' to your data path

// Listen for changes in the data
ordersRef.on("value", (snapshot) => {
    const totalOrders = snapshot.numChildren()
    document.getElementById("totalOrders").textContent = totalOrders
})

// Function to get today's date in YYYY-MM-DD format

function getTodayDate() {
    const today = new Date()

    const year = today.getFullYear()

    const month = String(today.getMonth() + 1).padStart(2, "0")

    const day = String(today.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

// Function to count today's total orders
function countTodayTotalOrders() {
    const todayDate = getTodayDate()

    // Query orders for today's date
    ordersRef.once("value", (snapshot) => {
        let totalOrders = 0
        snapshot.forEach((childSnapshot) => {
            const order = childSnapshot.val()
            const orderDate = new Date(order.timestamp)
            const orderDateString = orderDate.toISOString().split("T")[0] // convert timstamp into yyyy-mm-dd
            if (orderDateString === todayDate) {
                totalOrders++
            }
        })

        document.getElementById("todayTotalOrders").innerText = totalOrders
    })
}
countTodayTotalOrders()
