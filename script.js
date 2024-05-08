// script.js

let cartCount = 0;
let selectedSize = null;
let cartItems = [];

function fetchProductData() {
    fetch('https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the retrieved data here
            displayProductData(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayProductData(product) {
    // Access the properties of the product object and display them in the HTML

    // Display product title
    document.getElementById('product-title').innerText = product.title;

    // Display product description
    document.getElementById('product-description').innerText = product.description;

    // Display product price
    document.getElementById('product-price').innerText = '$' + product.price;

    // Display product image
    document.getElementById('product-image').src = product.imageURL;

    const sizeOptionsContainer = document.getElementById('size-options');
    sizeOptionsContainer.innerHTML = ''; // Clear previous options
    product.sizeOptions.forEach(option => {
        const optionElement = document.createElement('li');
        optionElement.classList.add('size-option');
        optionElement.textContent = option.label;
        optionElement.addEventListener('click', function () {
            toggleSelected(optionElement);
        });
        sizeOptionsContainer.appendChild(optionElement);
    });
}

function toggleSelected(optionElement) {
    // Deselect all other size options
    const allOptions = document.querySelectorAll('.size-option');
    allOptions.forEach(option => {
        if (option !== optionElement) {
            option.classList.remove('selected');
        }
    });

    optionElement.classList.toggle('selected');
    selectedSize = optionElement.classList.contains('selected') ? optionElement.textContent : null;

    const selectedSizeContainer = document.getElementById('selected-size-container');
    selectedSizeContainer.textContent = selectedSize;
}

function addToCart() {
    if (!selectedSize) {
        alert('Please select a size before adding to cart!');
        return;
    }

    const productName = document.getElementById('product-title').textContent;
    const productPrice = document.getElementById('product-price').textContent;
    const productImage = document.getElementById('product-image').src;
    cartItems.push({ name: productName, size: selectedSize, price: productPrice, imageURL: productImage });
    cartCount++;
    updateCartCount()
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = `My Cart (${cartCount})`;
    alert('Product added to cart!');

    // Update mini-cart
    const miniCartCountElement = document.getElementById('mini-cart-count');
    miniCartCountElement.textContent = `My Cart (${cartCount})`;

}

function displayCartItems() {
    const miniCartItems = document.getElementById('mini-cart-items');
    miniCartItems.innerHTML = ''; // Clear previous items

    const groupedItems = {};

    if (cartItems.length === 0) {
        const listItem = document.createElement('li');
        listItem.textContent = 'Your cart is empty';
        miniCartItems.appendChild(listItem);
    } else {
        cartItems.forEach(item => {
            const key = `${item.name}-${item.size}`;
            if (!groupedItems[key]) {
                groupedItems[key] = { name: item.name, size: item.size, price: item.price, count: 1, image: item.imageURL }; // Create new entry if key not exists
            } else {
                groupedItems[key].count++;
            }
        });

        for (const key in groupedItems) {
            if (groupedItems.hasOwnProperty(key)) {
                const item = groupedItems[key];
                const itemInfo = `${item.name} - Size: ${item.size} ${item.count}x ${item.price}`;

                const listItem = document.createElement('li');
                listItem.classList.add('mini-cart-item');

                const image = document.createElement('img');
                image.src = item.image;
                image.alt = item.name;
                image.style.maxWidth = '50%';
                image.style.height = 'auto';
                listItem.appendChild(image);

                const detailsContainer = document.createElement('div');
                detailsContainer.classList.add('details-container');

                detailsContainer.appendChild(document.createTextNode(item.name));

                const priceElement = document.createElement('div');
                priceElement.textContent = `${item.count}x ${item.price}`;
                detailsContainer.appendChild(priceElement); 

                const sizeElement = document.createElement('div');
                sizeElement.textContent = `Size: ${item.size}`;
                detailsContainer.appendChild(sizeElement); 

                listItem.appendChild(detailsContainer);

                miniCartItems.appendChild(listItem);
            }
        }
    }
}

function showMiniCart() {
    const miniCart = document.getElementById('mini-cart');
    miniCart.style.display = 'block';
    displayCartItems();
}

function closeMiniCart() {
    const miniCart = document.getElementById('mini-cart');
    miniCart.style.display = 'none';
}