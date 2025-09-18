// ================== GLOBAL PRODUCT CACHE ==================
let allProducts = [];

// ================== LOAD PRODUCTS ON PAGE LOAD ==================
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  fetch("./data/products.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch products.json");
      return res.json();
    })
    .then((products) => {
      allProducts = products; // store globally
      console.log("Products loaded:", allProducts); // debug
      renderProducts(allProducts); // show all initially
      updateCartCount(); // update cart count on load
    })
    .catch((err) => console.error("Error loading products:", err));
});

// ================== RENDER PRODUCTS ==================
function renderProducts(products) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (!products || products.length === 0) {
    grid.innerHTML = `<p class="text-gray-600 dark:text-gray-300">No products found.</p>`;
    return;
  }

  const cart = getCart();

  products.forEach((p) => {
    const item = cart.find((i) => i.id === p.id);
    const qty = item ? item.qty : 0;

    grid.innerHTML += `
      <div class="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                  rounded-2xl shadow-sm flex flex-col transition transform 
                  hover:scale-[1.02] hover:shadow-xl overflow-hidden cursor-pointer
                  hover:bg-black dark:hover:bg-black"
           onclick="window.location.href='product.html?id=${p.id}'">
        
        <!-- Product Image -->
        <div class="relative w-full h-56 overflow-hidden">
          <img class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
               src="${p.image}" alt="${p.name}" />
          <span class="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
            New
          </span>
        </div>

        <!-- Card Content -->
        <div class="flex flex-col flex-grow p-5 transition-colors duration-300 group-hover:text-white">
          <h5 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-400">
            ${p.name}
          </h5>
          <p class="text-gray-700 dark:text-gray-300 font-medium mb-4 group-hover:text-gray-200">₹${
            p.price
          }</p>

          <!-- Spacer -->
          <div class="flex-grow"></div>

          <!-- Actions -->
          <div class="flex flex-col gap-3">
            <!-- Cart Controls -->
            <div id="cart-controls-${p.id}">
              ${
                qty === 0
                  ? `<button onclick="event.stopPropagation(); addToCart(${p.id}); window.location.href='product.html?id=${p.id}'" 
                    class="w-full px-5 py-2 text-sm font-semibold 
                           bg-yellow-400 text-black rounded-xl 
                           shadow-md hover:bg-yellow-500 active:scale-95 transition-all duration-200">
                    Add to Cart
                   </button>`
                  : `<div class="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-xl shadow-inner"
                       onclick="event.stopPropagation(); window.location.href='product.html?id=${p.id}'">
                    <button onclick="event.stopPropagation(); decreaseQty(${p.id})" 
                      class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition">-</button>
                    <span class="min-w-[32px] text-center font-semibold text-gray-900 dark:text-white">${qty}</span>
                    <button onclick="event.stopPropagation(); increaseQty(${p.id})" 
                      class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 active:scale-95 transition">+</button>
                  </div>`
              }
            </div>

            <!-- Buy Now -->
            <button onclick="event.stopPropagation(); buyNow(${p.id})"
              class="w-full px-5 py-2 text-sm font-semibold text-white 
                     bg-orange-500 rounded-xl shadow-md 
                     hover:bg-orange-600 active:scale-95 transition-all duration-200">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

// ================== CART FUNCTIONS ==================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderProducts(allProducts); // refresh UI
}

function addToCart(id) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);

  if (item) item.qty++;
  else {
    const product = allProducts.find((p) => p.id === id);
    if (product) cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
}

function increaseQty(id) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) item.qty++;
  saveCart(cart);
}

function decreaseQty(id) {
  let cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty--;
    if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  }
  saveCart(cart);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = count;
}

// ================== CATEGORY & SEARCH FILTER ==================
let activeCategory = "All";

function filterProducts(query = "") {
  query = query.toLowerCase();
  let filtered = allProducts;

  if (activeCategory !== "All") {
    filtered = filtered.filter((p) => p.category === activeCategory);
  }

  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }

  renderProducts(filtered);
}
function buyNow(id) {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  // Save as temporary single-item checkout
  localStorage.setItem(
    "buyNow",
    JSON.stringify({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    })
  );

  // Redirect with flag so checkout.js knows it's Buy Now mode
  window.location.href = "checkout.html?buyNow=1";
}
// Category click
document.querySelectorAll(".category-item").forEach((item) => {
  item.addEventListener("click", () => {
    activeCategory = item.getAttribute("data-category");
    filterProducts(document.getElementById("search-input")?.value || "");
  });
});

// Search input
const searchInput = document.getElementById("search-input");
const mobileSearchInput = document.getElementById("mobile-search-input");

[searchInput, mobileSearchInput].forEach((input) => {
  input?.addEventListener("input", (e) => filterProducts(e.target.value));
});

// ================== INITIALIZE ==================
updateCartCount();
