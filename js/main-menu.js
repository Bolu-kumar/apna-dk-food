document.addEventListener("DOMContentLoaded", function () {
    const navbarCollapse = document.getElementById("navbarCollapse");
    const menuItems = [
        { text: "Home", link: "index.html", active: true },
        { text: "Menu", link: "menu.html", active: false },
        { text: "About", link: "about.html", active: false },
        { text: "Feature", link: "feature.html", active: false },
        { text: "Login", link: "login.html", active: false }
    ];

    const orderButton = document.createElement("a");
    orderButton.setAttribute("href", "order.html");
    orderButton.classList.add("btn", "custom-btn");
    orderButton.innerText = "Order Now";

    menuItems.forEach(item => {
        const navItem = document.createElement("a");
        navItem.setAttribute("href", item.link);
        navItem.classList.add("nav-item", "nav-link");
        if (item.active) {
            navItem.classList.add("active");
        }
        navItem.innerText = item.text;
        navbarCollapse.appendChild(navItem);
    });

    navbarCollapse.appendChild(orderButton);

    // Add event listener to menu items to toggle active class
    const menuLinks = document.querySelectorAll('.nav-item.nav-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function () {
            menuLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
