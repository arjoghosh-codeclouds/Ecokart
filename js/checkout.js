document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartSubtotalElement = document.getElementById("cart-subtotal");
  const cartDiscountElement = document.getElementById("cart-discount");
  const cartShippingElement = document.getElementById("cart-shipping"); // NEW
  const cartTaxElement = document.getElementById("cart-tax"); // NEW
  const cartTotalElement = document.getElementById("cart-total");
  const cartCountElement = document.getElementById("cart-count");
  const couponInput = document.getElementById("coupon");
  const applyCouponBtn = document.getElementById("apply-coupon");
  const couponMessage = document.getElementById("coupon-message");
  const discountLine = document.getElementById("discount-line");
  const placeOrderBtn = document.getElementById("place-order"); // Optional button

  let appliedCoupon = null;
  let coupons = [];

  // === Load coupons from JSON ===
  fetch("./data/coupons.json")
    .then((res) => res.json())
    .then((data) => {
      coupons = data;
    })
    .catch((err) => console.error("Error loading coupons:", err));

  // === Helpers ===
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function getBuyNow() {
    return JSON.parse(localStorage.getItem("buyNow")) || null;
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCheckout();
  }

  window.increaseQty = function (id) {
    let cart = getCart();
    let item = cart.find((i) => i.id === id);
    if (item) item.qty++;
    saveCart(cart);
  };

  window.decreaseQty = function (id) {
    let cart = getCart();
    let item = cart.find((i) => i.id === id);
    if (item) {
      item.qty--;
      if (item.qty <= 0) {
        cart = cart.filter((i) => i.id !== id);
      }
    }
    saveCart(cart);
  };

  // === Render Checkout (Cart or Buy Now) ===
  function renderCheckout() {
    let items = [];
    let subtotal = 0;

    const urlParams = new URLSearchParams(window.location.search);
    const buyNowMode = urlParams.get("buyNow") === "1";

    if (buyNowMode) {
      const buyNowItem = getBuyNow();
      if (buyNowItem) items = [buyNowItem];
    } else {
      items = getCart();
    }

    cartItemsContainer.innerHTML = "";

   if (items.length === 0) {
  cartItemsContainer.innerHTML = `<p class="text-gray-600 dark:text-gray-300">Your cart is empty.</p>`;
  
  // Reset all totals
  cartSubtotalElement.textContent = "0.00";
  cartDiscountElement.textContent = "0.00";
  cartShippingElement.textContent = "0.00";
  cartTaxElement.textContent = "0.00";
  cartTotalElement.textContent = "0.00";
  cartCountElement.textContent = "0";

  discountLine.classList.add("hidden");
  
  return;
}


    fetch("./data/products.json")
      .then((res) => res.json())
      .then((products) => {
        items.forEach((item) => {
          const product = products.find((p) => p.id === item.id);
          const price = Number(item.price) || 0;
          const quantity = item.qty || 1;
          const itemTotal = price * quantity;
          subtotal += itemTotal;

          const itemDiv = document.createElement("div");
          itemDiv.className =
            "flex justify-between items-center border-b pb-2 dark:text-gray-100";

          itemDiv.innerHTML = `
            <div class="flex items-center gap-4">
              ${
                product?.image
                  ? `<img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded-lg shadow-sm">`
                  : ""
              }
              <div>
                <p class="font-medium">${item.name}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">₹${price} × ${quantity}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              ${
                buyNowMode
                  ? ""
                  : `<button onclick="decreaseQty(${item.id})" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">-</button>
                     <span class="min-w-[24px] text-center">${quantity}</span>
                     <button onclick="increaseQty(${item.id})" class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">+</button>`
              }
              <p class="font-bold ml-4">₹${itemTotal}</p>
            </div>
          `;
          cartItemsContainer.appendChild(itemDiv);
        });

        // Apply discount
        let discount = 0;
        if (appliedCoupon) {
          if (appliedCoupon.type === "flat") discount = appliedCoupon.value;
          else if (appliedCoupon.type === "percent")
            discount = (subtotal * appliedCoupon.value) / 100;
        }

        // Shipping (Flat ₹50 if subtotal > 0)
        let shipping = subtotal > 0 ? 50 : 0;

        // Tax (5% of (subtotal - discount))
        let taxableAmount = Math.max(0, subtotal - discount);
        let tax = taxableAmount * 0.05;

        // Total
        const total = Math.max(0, taxableAmount + shipping + tax);

        // Update DOM
        cartSubtotalElement.textContent = subtotal.toFixed(2);
        cartDiscountElement.textContent = discount.toFixed(2);
        cartShippingElement.textContent = shipping.toFixed(2);
        cartTaxElement.textContent = tax.toFixed(2);
        cartTotalElement.textContent = total.toFixed(2);
        discountLine.classList.toggle("hidden", discount === 0);

        cartCountElement.textContent = buyNowMode
          ? items.length
          : items.reduce((sum, i) => sum + (i.qty || 1), 0);

        // === Save Order Summary for Confirmation Page ===
        const orderSummary = {
          orderNumber: "EK" + Math.floor(Math.random() * 1000000),
          subtotal: subtotal.toFixed(2),
          discount: discount.toFixed(2),
          shipping: shipping.toFixed(2),
          tax: tax.toFixed(2),
          total: total.toFixed(2),
          deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
          }),
          items: items
        };

        localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
      })
      .catch((err) => console.error("Error loading product images:", err));
  }

  // === Coupon Apply ===
  applyCouponBtn.addEventListener("click", () => {
    const code = couponInput.value.trim().toUpperCase();

    if (!code) {
      couponMessage.textContent = "Please enter a coupon code.";
      couponMessage.className = "mt-2 text-sm text-red-500";
      return;
    }

    const foundCoupon = coupons.find((c) => c.code.toUpperCase() === code);

    if (!foundCoupon) {
      appliedCoupon = null;
      couponMessage.textContent = "Invalid coupon code.";
      couponMessage.className = "mt-2 text-sm text-red-500";
    } else {
      appliedCoupon = foundCoupon;
      couponMessage.textContent = `Coupon "${code}" applied successfully!`;
      couponMessage.className = "mt-2 text-sm text-green-600";
    }

    renderCheckout();
  });

  renderCheckout();
});
