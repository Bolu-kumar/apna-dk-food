// Menu data
const menuData = {
    breakfast: [
        { name: "Idli with Sambhar", region: "South", price: "₹40.00", image: "img/menu/idli.jpg" },
        { name: "Aloo Tikki with Chole", region: "West", price: "₹50.00", image: "img/menu/aloo_tikki.jpg" },
        { name: "Poori with Aloo Sabzi", region: "North", price: "₹50.00", image: "img/menu/poori.jpg" }
    ],
    lunch: [
        { name: "Aloo Sabzi with Poori", region: "East/South", price: "₹50.00", image: "img/menu/aloo_sabzi.jpg" },
        { name: "Dal, Rice & Chapati", region: "East", price: "₹60.00", image: "img/menu/jeera_rice.jpg" },
        { name: "Curry Chicken with Rice ", region: "North", price: "₹80.00", image: "img/menu/chicken_korma.jpg" }
    ],
    dinner: [
        { name: "Idli with Sambhar", region: "South/East", price: "₹40.00", image: "img/menu/idli.jpg" },
        { name: "Aloo Tikki with Chole", region: "West", price: "₹50.00", image: "img/menu/aloo_tikki.jpg" },
        { name: "Poori with Aloo Sabzi", region: "North", price: "₹50.00", image: "img/menu/poori.jpg" }
    ]
};

// Function to create menu items
function createMenuItems(data) {
    const menuItems = data.map(item => {
        return `
            <div class="menu-item">
                <div class="menu-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="menu-text">
                    <h3><span>${item.name} (${item.region})</span> <strong>${item.price}</strong></h3>
                </div>
            </div>
        `;
    });
    return menuItems.join('');
}

// Function to append menu items to the DOM
function appendMenuItems(sectionId, data) {
    const section = document.getElementById(sectionId);
    if (section) {
        const menuItemsHTML = createMenuItems(data);
        section.innerHTML = menuItemsHTML;
    }
}

// Append menu items to respective sections
appendMenuItems('breakfast', menuData.breakfast);
appendMenuItems('lunch', menuData.lunch);
appendMenuItems('dinner', menuData.dinner);
