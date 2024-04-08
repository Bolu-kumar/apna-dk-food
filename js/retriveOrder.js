const database = firebase.database();


// Function to fetch food items from Firebase asynchronously and display them as cards
async function displayFoodItems() {
    const foodContainer = document.getElementById('foodCards');
    const foodItemsRef = database.ref('menu');

    try {
        const snapshot = await foodItemsRef.once('value');
        const foodItems = snapshot.val();

        if (!foodItems) {
            // Handle case where no data is available
            console.log("No food items available");
            return;
        }

        foodContainer.innerHTML = ''; // Clear existing cards

        // Store the fetched data locally
        localStorage.setItem('foodItems', JSON.stringify(foodItems));

        for (let key in foodItems) {
            const foodItem = foodItems[key];
            const card = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${foodItem.imageUrl}" class="card-img-top" alt="${foodItem.mealName}">
                        <!-- Inside the card-body div -->
                        <div class="card-body">
                            <h4 class="card-title">${foodItem.mealType}</h4>
                            <p class="card-text">${foodItem.mealName}</p>
                            <p class="card-text">Price: ₹${foodItem.price}</p>
                            <!-- <p class="card-text">Quantity: ${foodItem.quantity}</p>  -->

                            <!-- Add to Cart and Buy Now buttons -->
                            <!-- <button class="btn btn-primary mr-2 addToCartBtn" onclick="addToCart('${key}')">Add to Cart</button>  -->
                            <button class="btn btn-lg w-100 btn-success" onclick="buyNow('${key}')">Order Now</button>
                        </div>
                    </div>
                </div>
            `;
            foodContainer.innerHTML += card;
        }
    } catch (error) {
        console.error("Error fetching food items:", error.message);
        // Handle error appropriately
    }
}

// Call the function to display food items when the page loads
displayFoodItems();

function buyNow(key) {
    // Add your logic for handling the order here, if needed

    // Redirect to place-order.html
    window.location.href = 'place-order.html';
}