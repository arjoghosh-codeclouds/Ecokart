# EcoKart - Sustainable E-Commerce Frontend

EcoKart is a modern, responsive e-commerce website focused on eco-friendly products. Built with HTML, Tailwind CSS, and vanilla JavaScript, it features product browsing, cart management, wishlist functionality, search/filtering, and a streamlined checkout process. The site emphasizes sustainability, showcasing sections for on-sale items, new arrivals, and coming-soon products. All user data (cart, wishlist) persists via localStorage for a seamless experience.

This project demonstrates client-side e-commerce features, including dynamic rendering from a JSON data source, form validation, and UI interactions like animations and dark mode support.

## Features

- **Product Catalog**: Dynamic loading of products from `data/products.json`, categorized into On Sale, New Arrivals, and Coming Soon.
- **Search & Filtering**: Real-time search by name/category/description and category-based filtering.
- **Cart Management**: Add/remove items, quantity controls, subtotal/tax/shipping calculations, and coupon application (e.g., "SAVE50" for 50% off).
- **Wishlist**: Toggle items with heart icons, count badges, and persistence.
- **Checkout Flow**: Form for user details, payment options (COD, Card, UPI), and order summary. Supports "Buy Now" single-item mode.
- **Responsive Design**: Mobile-friendly navbar with hamburger menu, search, and dark mode compatibility.
- **Animations & UX**: Hover effects, scaling badges, gradient buttons, and smooth transitions.
- **Additional Pages**: Hero with countdown timer, categories grid, about section, reviews, FAQ accordion, and enhanced footer with social links/newsletter.

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS (via CDN), vanilla JavaScript.
- **Libraries**: Flowbite for components (e.g., accordion), Clerk.js for potential auth (placeholder).
- **Storage**: localStorage for cart/wishlist.
- **Data**: Static JSON file (`data/products.json`) for products.
- **Deployment**: Static hosting (e.g., GitHub Pages, Vercel, Netlify).

No backend required; all logic is client-side.

## Project Structure

```
project-root/
├── index.html          # Homepage with products, hero, about, etc.
├── checkout.html       # Checkout page with cart summary and form
├── products.html       # Full products listing (if separate; referenced in code)
├── product.html        # Single product detail (referenced)
├── team.html           # Team page (placeholder)
├── login.html          # Login page (placeholder)
├── wishlist.html       # Wishlist page (to be implemented)
├── data/
│   └── products.json   # Sample product data
├── js/
│   ├── main.js         # Core logic: products, cart, wishlist, filters
│   ├── checkout.js     # Cart rendering, coupons, totals
│   └── validation.js   # Form validation (e.g., phone/pincode)
├── images/             # Product images, carousel icons
└── README.md           # This file
```

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari).
- Local server for development (e.g., Live Server VS Code extension or `python -m http.server` to avoid CORS issues with JSON fetch).

## Setup & Installation

1. Clone or download the repository:
   ```
   git clone <your-repo-url>
   cd ecokart
   ```

2. Ensure `data/products.json` exists with sample data (example structure below).

3. Open `index.html` in a browser or serve locally:
   ```
   # Using Python 3
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

4. For development: Edit files and refresh. Use browser dev tools for localStorage inspection.

## Sample `data/products.json`

```json
[
  {
    "id": 1,
    "name": "Eco Bamboo Watch",
    "price": 2999,
    "originalPrice": 4999,
    "image": "./images/bamboo-watch.jpg",
    "section": "onSale",
    "category": "Fashion",
    "description": {
      "summary": "Sustainable bamboo watch",
      "rating": 4.8
    }
  }
  // Add more products...
]
```

## Usage

- **Browse Products**: Filter by category or search; click cards for details (implement `product.html` if needed).
- **Add to Cart/Wishlist**: Buttons on product cards; badges update in navbar.
- **Checkout**: Navigate to `checkout.html`; apply coupons; submit form (logs to console; extend for backend).
- **Buy Now**: Direct to checkout with single item from product card.

## Scripts

- `main.js`: Handles product rendering, cart/wishlist CRUD, filters/search.
- `checkout.js`: Renders cart items, calculates totals, coupon logic.
- `validation.js`: Client-side form checks (e.g., email, phone pattern).

Key functions:
- `renderProducts()`: Builds product cards with buttons.
- `addToCart(id)`, `toggleWishlist(id)`: Update localStorage.
- `buyNow(id)`: Sets single-item mode and redirects.

## Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add amazing feature'`).
4. Push to branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

Focus on eco-theme enhancements, bug fixes, or new features like auth integration.

## License

MIT License - feel free to use, modify, and distribute.

## Contact

Developed by Arjo Ghosh (arjoghosh123@gmail.com). Connect on [LinkedIn](https://www.linkedin.com/in/ghosharjo/) or visit [portfolio](https://me2.vercel.app/).

For issues: Open a GitHub issue.

---

*© 2025 EcoKart. All rights reserved to Arjo Ghosh*