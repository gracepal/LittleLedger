// app.js

// --- ELEMENT SELECTION ---

// Select the main content area and the products link
const mainContent = document.getElementById('main-content');
const viewProductsLink = document.getElementById('view-products-link');

// Select the home link and the template container
const viewHomeLink = document.getElementById('view-home-link');
const homeTemplate = document.getElementById('home-template');

// Sidebar and Main Content Elements
const menuToggleButton = document.getElementById('menu-toggle');
const sidebarMenu = document.getElementById('sidebar-menu');
const mainWrapper = document.getElementById('main-wrapper');

// User Dropdown Elements
const userMenuToggleButton = document.getElementById('user-menu-toggle');
const userDropdown = document.getElementById('user-dropdown');

// Scroll Button Elements
const scrollButton = document.getElementById('scrollToTopBtn');
const SCROLL_THRESHOLD = 300; // Define threshold for clarity

/**************************************************************
 * FUNCTIONS
 */

// Function to load the original home content
function loadHomeView(event) {
  if (event) event.preventDefault(); // Stop the link from acting as a traditional link

  // 1. Get the content from the hidden template
  // We use innerHTML to get the content *inside* the template div
  const homeContentHTML = homeTemplate.innerHTML;

  // 2. Update the main content area with the home HTML
  mainContent.innerHTML = homeContentHTML;

  // 3. Ensure the sidebar is closed
  sidebarMenu.classList.remove('open');
  mainWrapper.classList.remove('shifted');

  // 4. Scroll to the top
  window.scrollTo(0, 0);
}

// Generates the HTML string for the tag bubbles at the bottom of the card.
function generateTagBubbles(tags) {
  if (!tags || tags.length === 0) return '';

  // Creates HTML like: <span class="tag">bath</span><span class="tag">skincare</span>
  return tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
}

// Generates the HTML string for a single product card.
function generateProductCard(product) {
  // Note: The photo path is relative to index.html
  const imagePath = product.photo;

  return `
        <div class="product-card" data-id="${product.id}">
            <div class="card-header">
                ${product.description}
            </div>
            <div class="card-image-container">
                <img src="${imagePath}" alt="${product.name}">
            </div>
            <div class="card-footer">
                ${generateTagBubbles(product.tags)}
            </div>
        </div>
    `;
}

// Generates the HTML for the full products page view.
function getProductsPageHTML() {
  // Map the products array to an array of card HTML strings
  const productCardsHTML = products.map(generateProductCard).join('');

  // Wrap the cards in a grid container
  return `
        <div class="products-page">
            <h2>All Products (${products.length} Items)</h2>

            <div class="product-grid">
                ${productCardsHTML}
            </div>
        </div>
    `;
}

// Function to handle the navigation and view update
function loadProductsView(event) {
  event.preventDefault(); // Stop the link from trying to navigate traditionally

  // 1. Update the main content area with the new HTML
  mainContent.innerHTML = getProductsPageHTML();

  // 2. Close the sidebar after navigation
  sidebarMenu.classList.remove('open');
  mainWrapper.classList.remove('shifted');

  // 3. (Optional but recommended) Scroll to the top of the page
  window.scrollTo(0, 0);
}

// Show/Hide Button based on Scroll Position
function toggleScrollButton() {
  // Show button if the user has scrolled down more than 300 pixels
  if (document.body.scrollTop > SCROLL_THRESHOLD || document.documentElement.scrollTop > SCROLL_THRESHOLD) {
    scrollButton.classList.add('show');
  } else {
    scrollButton.classList.remove('show');
  }
}

// Scroll to the Top when Button is Clicked
function scrollToTop() {
  // This is the modern, smooth way to scroll in most browsers
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

/**************************************************************
 * EVENT LISTENERS
 */

// --- 1. SIDEBAR TOGGLE (PUSH EFFECT) ---

menuToggleButton.addEventListener('click', function () {
  // 1. Toggle the 'open' class on the sidebar (to slide it in)
  sidebarMenu.classList.toggle('open');

  // 2. Toggle the 'shifted' class on the main wrapper (to push content)
  mainWrapper.classList.toggle('shifted');
});

// --- 2. DROPDOWN TOGGLE (OVERLAY) ---

userMenuToggleButton.addEventListener('click', function (event) {
  // Prevent the button click from bubbling up (important for overlays)
  event.stopPropagation();

  // Toggle the 'visible' class on the dropdown
  userDropdown.classList.toggle('visible');
});

// --- 3. DROPDOWN CLOSE ON EXTERNAL CLICK ---

// Close dropdown when clicking anywhere else (excluding the toggle button)
document.addEventListener('click', function (event) {
  const isClickInsideDropdown = userDropdown.contains(event.target);
  const isClickOnToggle = userMenuToggleButton.contains(event.target);

  // Only close if the menu is visible AND the click was outside both the dropdown and the toggle button
  if (userDropdown.classList.contains('visible') && !isClickInsideDropdown && !isClickOnToggle) {
    userDropdown.classList.remove('visible');
  }
});

// --- 4. SCROLL TO TOP LISTENERS ---
// window.addEventListener('scroll', toggleScrollButton);
scrollButton.addEventListener('click', scrollToTop);
viewHomeLink.addEventListener('click', loadHomeView);
viewProductsLink.addEventListener('click', loadProductsView);
document.addEventListener('DOMContentLoaded', loadHomeView);
