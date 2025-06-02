
function addToCart(productName, price) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let image = getImageForProduct(productName);
  cart.push({ name: productName, price: price, image: image });
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(productName + " ajouté au panier !");
}

function loadCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let container = document.getElementById('cart-items');
  let total = 0;
  container.innerHTML = "";
  cart.forEach((item, index) => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${item.image}" alt="${item.name}">
        <h2>${item.name}</h2>
        <p>Prix : ${item.price.toFixed(2)} €</p>
        <button onclick="removeFromCart(${index})">Supprimer</button>
      </div>`;
    total += item.price;
  });
  document.getElementById('total-price').innerText = "Total : " + total.toFixed(2) + " €";
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

function clearCart() {
  localStorage.removeItem('cart');
  location.reload();
}

function getImageForProduct(name) {
  if (name.includes("Basique")) return "Basique.jpg";
  if (name.includes("Bluetooth")) return "bluetooth.jpg";
  if (name.includes("Adaptateur")) return "adaptateur.webp";
  return "";
}

function applyCoupon() {
  let code = document.getElementById('coupon').value.trim();
  if (code === "100") {
    document.getElementById('total-price').innerText = "Total : 0.00 € (Code appliqué)";
    alert("Code promo appliqué ! 🎉 Votre commande est gratuite.");
  } else {
    alert("Code invalide");
  }
}

async function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) return alert("Votre panier est vide.");

  const response = await fetch("https://carplay-stripe-backend.onrender.com/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    localStorage.setItem('lastOrder', JSON.stringify(cart));
  body: JSON.stringify({ cart })
  });

  const session = await response.json();
  window.location.href = session.url;
}

if (window.location.pathname.includes("cart.html")) {
  window.onload = loadCart;
}
