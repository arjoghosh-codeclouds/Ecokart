
document.addEventListener('DOMContentLoaded', () => {
  // Load wishlist items from localStorage
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const wishlistGrid = document.getElementById('wishlist-grid');
  const emptyWishlistMessage = document.getElementById('empty-wishlist');
  const wishlistCount = document.getElementById('wishlist-count');
  const mobileWishlistCount = document.getElementById('mobile-wishlist-count');

  console.log('Wishlist data:', wishlist); // Debug wishlist content

  // Update wishlist count in navbar
  const updateWishlistCount = () => {
    try {
      const count = wishlist.length;
      wishlistCount.textContent = count;
      mobileWishlistCount.textContent = count;
      if (count > 0) {
        wishlistCount.classList.add('scale-125');
        mobileWishlistCount.classList.add('scale-125');
        setTimeout(() => {
          wishlistCount.classList.remove('scale-125');
          mobileWishlistCount.classList.remove('scale-125');
        }, 300);
      }
    } catch (error) {
      console.error('Error in updateWishlistCount:', error);
    }
  };

  // Function to remove item from wishlist
  window.removeFromWishlist = (button) => {
    try {
      const productCard = button.closest('.bg-white');
      const productName = productCard.querySelector('h3').textContent;
      const updatedWishlist = wishlist.filter(item => item.name !== productName);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      wishlist.splice(0, wishlist.length, ...updatedWishlist); // Update local wishlist array
      renderWishlist();
      updateWishlistCount();
    } catch (error) {
      console.error('Error in removeFromWishlist:', error);
    }
  };

  // Render wishlist items
  const renderWishlist = () => {
    try {
      wishlistGrid.innerHTML = '';
      if (wishlist.length === 0) {
        emptyWishlistMessage.classList.remove('hidden');
        return;
      }
      emptyWishlistMessage.classList.add('hidden');
      wishlist.forEach(item => {
        if (!item.description) {
          console.warn(`No description found for item: ${item.name}`);
        }
        const productCard = document.createElement('div');
        productCard.className = 'bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300';
        productCard.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-contain rounded-lg mb-4" />
          <h3 class="text-xl font-semibold text-gray-900">${item.name}</h3>
          <p class="text-gray-700 mt-2">${item.description.summary || 'No description available.'}</p>
          <p class="text-red-600 font-bold mt-2 text-lg">₹${item.price} ${item.originalPrice ? `<span class="line-through text-gray-500">₹${item.originalPrice}</span>` : ''}</p>
          <div class="mt-4 flex justify-between items-center space-x-4">
            <button
              onclick="buyNow(${item.id})"
              class="flex-1 px-6 py-3 text-base font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 active:scale-95 transition-all duration-200"
            >
              Buy Now
            </button>
            <button
              class="bg-gray-200 rounded-full p-2 hover:bg-red-500 hover:text-white hover:scale-110 transition-all duration-300"
              onclick="removeFromWishlist(this)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        `;
        wishlistGrid.appendChild(productCard);
      });
    } catch (error) {
      console.error('Error in renderWishlist:', error);
    }
  };

  // Initial render and count updates
  renderWishlist();
  updateWishlistCount();
  updateCartCount(); // Ensure cart count is updated on page load
});
