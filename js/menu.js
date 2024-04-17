// Menu data
const menuData = {
    breakfast: [
        { name: "Idli with Sambhar", region: "South", price: "₹8.00/piece", image: "img/menu/breakfast1-idli.jpg" },
        { name: "Dosa with Sambhar", region: "South", price: "₹15.00/piece", image: "img/menu/breakfast2-dosa.jpg" },
        { name: "Aloo Paratha with Butter", region: "North", price: "₹20.00/piece", image: "img/menu/breakfast3-aloo-paratha.jpg" }
    ],
    lunch: [
        { name: "Rice, Chapati, Daal & Sabji", region: "East/North", price: "₹70.00/plate", image: "img/menu/lunch1.jpg" },
        { name: "Rice, 2 Chapati, Daal & Sabji", region: "East/North", price: "₹70.00/plate", image: "img/menu/lunch2.jpg" },
        { name: "Rice, Daal, Sabji, Puri ", region: "North/South", price: "₹80.00/plate", image: "img/menu/lunch3.jpg" }
    ],
    dinner: [
        { name: "Chapati with Sabji", region: "South/East", price: "₹15.00/chapati", image: "img/menu/dinner1.jpg" },
        { name: "Rice, 2 Chapati, Daal & Sabji", region: "West", price: "₹60.00/plate", image: "img/menu/dinner2.jpg" },
        { name: "Aloo Paratha with Butter", region: "North", price: "₹20.00/paratha", image: "img/menu/breakfast3-aloo-paratha.jpg" }
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
