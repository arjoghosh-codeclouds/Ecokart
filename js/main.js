// ================== GLOBAL PRODUCT CACHE ==================
let allProducts = {
  onSale: [],
  newArrivals: [],
  comingSoon: []
};

// ================== LOAD PRODUCTS ON PAGE LOAD ==================
document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/products.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch products.json");
      return res.json();
    })
    .then((products) => {
      allProducts.onSale = products.filter(p => p.section === "onSale");
      allProducts.newArrivals = products.filter(p => p.section === "newArrivals");
      allProducts.comingSoon = products.filter(p => p.section === "comingSoon");
      console.log("Products loaded:", allProducts);
      renderProducts();
      updateCartCount();
      updateWishlistCount(); // Initialize wishlist count
    })
    .catch((err) => console.error("Error loading products:", err));
});

// ================== RENDER PRODUCTS ==================
function renderProducts(filterCategory = "All", searchQuery = "", showAll = false) {
  const onSaleGrid = document.getElementById("on-sale-grid");
  const newArrivalsGrid = document.getElementById("new-arrivals-grid");
  const comingSoonGrid = document.getElementById("coming-soon-grid");

  if (onSaleGrid) onSaleGrid.innerHTML = "";
  if (newArrivalsGrid) newArrivalsGrid.innerHTML = "";
  if (comingSoonGrid) comingSoonGrid.innerHTML = "";

  function createProductCard(p) {
    const cart = getCart();
    const item = cart.find((i) => i.id === p.id);
    const qty = item ? item.qty : 0;
    const discount = p.originalPrice
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : null;
    const wishlist = getWishlist();
    const isInWishlist = wishlist.some((i) => i.id === p.id);

    return `
      <div class="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                  rounded-xl shadow-md flex flex-col transition transform 
                  hover:scale-[1.03] hover:shadow-lg overflow-hidden cursor-pointer
                  max-w-xs mx-auto"
           onclick="window.location.href='product.html?id=${p.id}'">
        
        <!-- Product Image -->
        <div class="relative w-full h-40 overflow-hidden">
          <img class="absolute inset-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" 
               src="${p.image}" alt="${p.name}" />
          <span class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            ${p.section === "onSale" ? `${discount}% OFF` : p.section === "newArrivals" ? "New" : "Coming Soon"}
          </span>
        </div>

        <!-- Card Content -->
        <div class="flex flex-col flex-grow p-4">
          <h5 class="text-base font-semibold text-gray-900 dark:text-white truncate group-hover:text-red-500">
            ${p.name}
          </h5>
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">${p.description.summary}</p>
          <div class="mt-2 flex items-center justify-between">
            <div>
              <span class="text-base font-bold text-gray-900 dark:text-white">₹${p.price}</span>
              ${p.originalPrice ? `<span class="ml-2 text-xs text-gray-500 line-through">₹${p.originalPrice}</span>` : ""}
            </div>
            <div class="text-sm text-yellow-400">${p.description.rating} ★</div>
          </div>

          <!-- Actions -->
          <div class="mt-3 flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <div id="cart-controls-${p.id}" class="flex-1">
                ${
                  qty === 0
                    ? `<button onclick="event.stopPropagation(); addToCart(${p.id});" 
                      class="w-full px-4 py-1.5 text-sm font-semibold bg-red-500 text-white rounded-lg 
                             hover:bg-red-600 active:scale-95 transition-all duration-200">
                      Add to Cart
                     </button>`
                    : `<div class="flex items-center justify-center space-x-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                      <button onclick="event.stopPropagation(); decreaseQty(${p.id})" 
                        class="px-2 py-0.5 bg-red-500 text-white rounded-md hover:bg-red-600 active:scale-95 transition">-</button>
                      <span class="min-w-[24px] text-center font-semibold text-gray-900 dark:text-white">${qty}</span>
                      <button onclick="event.stopPropagation(); increaseQty(${p.id})" 
                        class="px-2 py-0.5 bg-green-500 text-white rounded-md hover:bg-green-600 active:scale-95 transition">+</button>
                    </div>`
                }
              </div>
              <button onclick="event.stopPropagation(); toggleWishlist(${p.id});"
                class="px-3 py-1.5 text-sm font-semibold text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-600 
                       rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 active:scale-95 transition-all duration-200">
                <svg class="w-5 h-5 inline-block ${isInWishlist ? 'fill-red-500' : 'fill-none stroke-current'}" 
                     viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" 
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>
            <button onclick="event.stopPropagation(); buyNow(${p.id})"
              class="w-full px-4 py-1.5 text-sm font-semibold text-white bg-orange-500 rounded-lg 
                     hover:bg-orange-600 active:scale-95 transition-all duration-200">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function createViewAllButton(section) {
    return `
      <div class="flex justify-center mt-4">
        <a href="products.html?section=${section}" 
           class="px-6 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg 
                  hover:bg-red-700 transition-all duration-200">
          View All ${section === "onSale" ? "On Sale" : section === "newArrivals" ? "New Arrivals" : "Coming Soon"}
        </a>
      </div>
    `;
  }

  Object.keys(allProducts).forEach((section) => {
    const grid = section === "onSale" ? onSaleGrid : section === "newArrivals" ? newArrivalsGrid : comingSoonGrid;
    if (!grid) return;

    let filtered = allProducts[section];
    if (filterCategory !== "All") {
      filtered = filtered.filter((p) => p.category === filterCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description.summary || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<p class="text-gray-600 dark:text-gray-300 text-center">No products found.</p>`;
    } else {
      const displayProducts = showAll ? filtered : filtered.slice(0, 3);
      displayProducts.forEach((p) => {
        grid.innerHTML += createProductCard(p);
      });
      if (!showAll && filtered.length > 3) {
        grid.innerHTML += createViewAllButton(section);
      }
    }
  });
}

// ================== CART FUNCTIONS ==================
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderProducts(activeCategory, document.getElementById("search-input")?.value || "");
}

function addToCart(id) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);

  if (item) item.qty++;
  else {
    const product = Object.values(allProducts).flat().find((p) => p.id === id);
    if (product) cart.push({ ...product, qty: 1 });
  }

  saveCart(cart);
  animateCart();
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

function animateCart() {
  const badge = document.getElementById("cart-count");
  badge.classList.add("scale-125");
  setTimeout(() => badge.classList.remove("scale-125"), 300);
}

function buyNow(id) {
  const product = Object.values(allProducts).flat().find((p) => p.id === id);
  if (!product) return;

  localStorage.setItem(
    "buyNow",
    JSON.stringify({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    })
  );

  window.location.href = "checkout.html?buyNow=1";
}

// ================== WISHLIST FUNCTIONS ==================
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistCount();
  renderProducts(activeCategory, document.getElementById("search-input")?.value || "");
}

function toggleWishlist(id) {
  const wishlist = getWishlist();
  const index = wishlist.findIndex((i) => i.id === id);

  if (index === -1) {
    const product = Object.values(allProducts).flat().find((p) => p.id === id);
    if (product) wishlist.push({ id: product.id, name: product.name, price: product.price, image: product.image });
  } else {
    wishlist.splice(index, 1);
  }

  saveWishlist(wishlist);
  animateWishlist();
}

function updateWishlistCount() {
  const wishlist = getWishlist();
  const count = wishlist.length;
  const countEl = document.getElementById("wishlist-count");
  if (countEl) countEl.textContent = count;
}

function animateWishlist() {
  const badge = document.getElementById("wishlist-count");
  badge.classList.add("scale-125");
  setTimeout(() => badge.classList.remove("scale-125"), 300);
}

// ================== CATEGORY & SEARCH FILTER ==================
let activeCategory = "All";

function filterProducts(query = "") {
  renderProducts(activeCategory, query);
}

document.querySelectorAll(".category-item").forEach((item) => {
  item.addEventListener("click", () => {
    activeCategory = item.getAttribute("data-category");
    filterProducts(document.getElementById("search-input")?.value || "");
  });
});

const searchInput = document.getElementById("search-input");
const mobileSearchInput = document.getElementById("mobile-search-input");

[searchInput, mobileSearchInput].forEach((input) => {
  input?.addEventListener("input", (e) => filterProducts(e.target.value));
});

document.getElementById("mobile-search-submit")?.addEventListener("click", () => {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});