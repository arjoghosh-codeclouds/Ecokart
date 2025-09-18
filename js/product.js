// ================= Get Product ID from URL =================
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

// ================= Load and Render Product =================
document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/products.json")
    .then((res) => res.json())
    .then((products) => {
      const productId = getProductId();
      const product = products.find((p) => p.id === productId);

      if (!product) {
        document.getElementById(
          "product-details"
        ).innerHTML = `<p class="text-red-600 font-semibold">Product not found.</p>`;
        return;
      }

      renderProductDetails(product);
      updateCartCount();
    });
});

// ================= Render Product Details =================
function renderProductDetails(p) {
  const cart = getCart();
  const item = cart.find((i) => i.id === p.id);
  const qty = item ? item.qty : 0;

  // Extract description parts
  const summary = p.description?.summary || "";
  const highlights = p.description?.highlights || [];
  const rating = p.description?.rating || 0;
  const reviews = p.description?.reviews || [];

  // Render stars
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const stars =
    "★".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(emptyStars);

  // Render highlights
  const highlightsHtml = highlights.length
    ? `<ul class="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-1">
         ${highlights.map((h) => `<li>${h}</li>`).join("")}
       </ul>`
    : "";

  // Render reviews
  const reviewsHtml = reviews.length
    ? `<div class="mt-6">
         <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Customer Reviews</h3>
         <div class="space-y-4">
           ${reviews
             .map(
               (r) => `
             <div class="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm">
               <p class="font-semibold text-gray-900 dark:text-white">${r.user}</p>
               <p class="text-yellow-500">${"★".repeat(r.rating)}${"☆".repeat(
                 5 - r.rating
               )}</p>
               <p class="text-gray-700 dark:text-gray-300 mt-1">${r.comment}</p>
             </div>
           `
             )
             .join("")}
         </div>
       </div>`
    : `<p class="mt-4 text-gray-600 dark:text-gray-400">No reviews yet.</p>`;

  document.getElementById("product-details").innerHTML = `
    <div class="flex flex-col md:flex-row gap-8 items-start">
      
      <!-- Product Image -->
      <div class="flex-shrink-0 w-full md:w-1/2">
        <img src="${p.image}" alt="${p.name}" 
             class="w-full h-80 object-cover rounded-2xl shadow-lg" />
      </div>

      <!-- Product Info -->
      <div class="flex-1 space-y-4">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">${p.name}</h1>
        <p class="text-2xl font-semibold text-green-600">₹${p.price}</p>
        <p class="text-yellow-500 font-bold">${stars} (${rating || "No rating"})</p>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${summary}</p>

        <!-- Highlights -->
        ${highlightsHtml}

        <!-- Action Buttons -->
        <div class="mt-6 flex gap-4">
          <!-- Add to Cart -->
          ${
            qty === 0
              ? `<button onclick="addToCart(${p.id})" 
                        class="flex items-center justify-center gap-2 px-6 py-3 text-black font-semibold rounded-xl 
                               bg-yellow-400 hover:bg-yellow-500 shadow-lg active:scale-95 transition-all">
                🛒 Add to Cart
              </button>`
              : `<div class="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-xl shadow-inner w-fit">
                <button onclick="decreaseQty(${p.id})" 
                        class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition">-</button>
                <span class="min-w-[32px] text-center font-semibold text-gray-900 dark:text-white">${qty}</span>
                <button onclick="increaseQty(${p.id})" 
                        class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 active:scale-95 transition">+</button>
              </div>`
          }

          <!-- Buy Now -->
          <button id="buy-now-btn" onclick="buyNow(${p.id})"
                  class="flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl 
                         bg-orange-500 hover:bg-orange-600 shadow-lg active:scale-95 transition-all">
            ⚡ Buy Now
          </button>
        </div>

        <!-- Reviews -->
        ${reviewsHtml}
      </div>
    </div>
  `;
}

// ================= Cart Functions =================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Re-render product details
  fetch("./data/products.json")
    .then((res) => res.json())
    .then((products) => {
      const productId = getProductId();
      const product = products.find((p) => p.id === productId);
      if (product) renderProductDetails(product);
    });
}

// ================= Add To Cart =================
function addToCart(id) {
  fetch("./data/products.json")
    .then((res) => res.json())
    .then((products) => {
      const product = products.find((p) => p.id === id);
      if (!product) return;

      let cart = getCart();
      let item = cart.find((i) => i.id === id);
      if (item) item.qty++;
      else
        cart.push({
          id: id,
          qty: 1,
          name: product.name,
          price: product.price,
        });
      saveCart(cart);
    });
}

// ================= Increase / Decrease Qty =================
function increaseQty(id) {
  addToCart(id); // reuse addToCart logic
}

function decreaseQty(id) {
  let cart = getCart();
  let item = cart.find((i) => i.id === id);
  if (item) {
    item.qty--;
    if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  }
  saveCart(cart);
}

// ================= Buy Now =================
function buyNow(id) {
  fetch("./data/products.json")
    .then((res) => res.json())
    .then((products) => {
      const product = products.find((p) => p.id === id);
      if (!product) return;

      // Save product for checkout (as single object)
      const buyNowItem = {
        id: product.id,
        qty: 1,
        name: product.name,
        price: product.price,
      };
      localStorage.setItem("buyNow", JSON.stringify(buyNowItem));

      // Redirect with flag
      window.location.href = "checkout.html?buyNow=1";
    });
}

// ================= Update Cart Count =================
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = count;
}
