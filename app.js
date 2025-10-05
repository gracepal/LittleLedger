// app.js

// --- ELEMENT SELECTION ---

// Select the main content area and the products link
// NOTE: viewProductsLink is ONLY used for the initial attachment here. It is re-selected in attachSidebarListeners()
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
 * NEW HELPER FUNCTION: Re-attach necessary listeners
 */
function attachSidebarListeners() {
  // Re-select the products link element (it was destroyed by innerHTML swap)
  const reAttachedProductsLink = document.getElementById('view-products-link');
  const reAttachedHomeLink = document.getElementById('view-home-link'); // <-- NEW SELECTION

  // Attach the new listeners (if the elements exist)
  if (reAttachedProductsLink) {
    reAttachedProductsLink.addEventListener('click', loadProductsView);
  }

  // Re-attach the Home listener
  if (reAttachedHomeLink) {
    reAttachedHomeLink.addEventListener('click', loadHomeView);
  }
}

/**************************************************************
 * NEW FUNCTIONS FOR SIDEBAR CONTROLS
 */

// Define the HTML for the product-specific controls
function getProductsSidebarControlsHTML() {
  return `
        <hr class="sidebar-separator">

        <div class="sidebar-section" id="product-controls">
            <h3>Products</h3>

            <div class="search-input-container">
                <input type="text" id="product-search-input" placeholder="Search products...">
            </div>

            <div class="search-options">
                <label>Search Fields:</label>

                <div class="checkbox-group">
                    <label>
                        <input type="checkbox" id="search-tags" checked>
                        Include tags
                    </label>
                    <label>
                        <input type="checkbox" id="search-titles" checked>
                        Include titles
                    </label>
                    <label>
                        <input type="checkbox" id="search-all-text" checked>
                        Include all text
                    </label>
                </div>
            </div>
        </div>
    `;
}

/**************************************************************
 * NEW FUNCTIONS FOR RENDERING PRODUCTS
 */

/**
 * Generates the HTML string for the tag bubbles at the bottom of the card.
 */
function generateTagBubbles(tags) {
  if (!tags || tags.length === 0) return '';

  return tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
}

/**
 * Generates the HTML string for a single product card.
 */
function generateProductCard(product) {
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

/**
 * Generates the HTML for the full products page view.
 */
function getProductsPageHTML() {
  // Map the products array (from data.js) to an array of card HTML strings
  // NOTE: 'products' is assumed to be global from data.js
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

/**************************************************************
 * ROUTING AND VIEW FUNCTIONS
 */

// Function to handle the initial view loading based on the URL hash
function routePage() {
  // Get the hash (e.g., '#products' or '')
  const hash = window.location.hash;

  // Load the appropriate view
  if (hash === '#products') {
    // Load the products page without changing the URL hash again (pass false)
    loadProductsView(false);
  } else {
    // Default to the home view (pass false)
    loadHomeView(false);
  }
}

// Function to load the original home content
function loadHomeView(event) {
  // Check if an event object was passed to prevent default link action and set hash
  if (event) {
    event.preventDefault();
    window.location.hash = ''; // Clear the hash for the home page
  }

  // Get the content from the hidden template
  const homeContentHTML = homeTemplate.innerHTML;

  // Update the main content area with the home HTML
  mainContent.innerHTML = homeContentHTML;

  // Restore the sidebar to its original state (only <ul> links)
  // This recreates the 'See Products' link element.
  sidebarMenu.innerHTML = `
        <ul>
            <li><a href="#" id="view-home-link">Home</a></li>
            <li><a href="#" id="view-products-link">See Products</a></li>
            <li><a href="#">Calendar</a></li>
            <li><a href="#">Log Event</a></li>
        </ul>
    `;

  // Re-attach the event listener to the NEW 'See Products' link element
  attachSidebarListeners();

  // Scroll to the top
  window.scrollTo(0, 0);
}

// Function to handle the navigation and view update
function loadProductsView(event) {
  // Check if an event object was passed to prevent default link action and set hash
  if (event) {
    event.preventDefault();
    window.location.hash = '#products';
  }

  // Update the main content area with the new HTML
  mainContent.innerHTML = getProductsPageHTML();

  // Overwrite the sidebar content with the links PLUS the controls
  sidebarMenu.innerHTML = `
        <ul>
            <li><a href="#" id="view-home-link">Home</a></li>
            <li><a href="#" id="view-products-link">See Products</a></li>
            <li><a href="#">Calendar</a></li>
            <li><a href="#">Log Event</a></li>
        </ul>
        ${getProductsSidebarControlsHTML()}
    `;

  // We must re-attach the listener to the 'See Products' link
  attachSidebarListeners();

  // Scroll to the top of the page
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

// --- SIDEBAR TOGGLE (PUSH EFFECT) ---

menuToggleButton.addEventListener('click', function () {
  // Toggle the 'open' class on the sidebar (to slide it in)
  sidebarMenu.classList.toggle('open');

  // Toggle the 'shifted' class on the main wrapper (to push content)
  mainWrapper.classList.toggle('shifted');
});

// --- DROPDOWN TOGGLE (OVERLAY) ---

userMenuToggleButton.addEventListener('click', function (event) {
  // Prevent the button click from bubbling up (important for overlays)
  event.stopPropagation();

  // Toggle the 'visible' class on the dropdown
  userDropdown.classList.toggle('visible');
});

// --- DROPDOWN CLOSE ON EXTERNAL CLICK ---

// Close dropdown when clicking anywhere else (excluding the toggle button)
document.addEventListener('click', function (event) {
  const isClickInsideDropdown = userDropdown.contains(event.target);
  const isClickOnToggle = userMenuToggleButton.contains(event.target);

  // Only close if the menu is visible AND the click was outside both the dropdown and the toggle button
  if (userDropdown.classList.contains('visible') && !isClickInsideDropdown && !isClickOnToggle) {
    userDropdown.classList.remove('visible');
  }
});

// --- SCROLL TO TOP LISTENERS ---
window.addEventListener('scroll', toggleScrollButton);
scrollButton.addEventListener('click', scrollToTop);

// --- VIEW SWITCHING LISTENERS (Initial Setup) ---

// Home button always exists, so attach its listener once
viewHomeLink.addEventListener('click', loadHomeView);

// The 'See Products' link listener is attached in loadHomeView/attachSidebarListeners

// Handle initial page load and browser history (back/forward)
document.addEventListener('DOMContentLoaded', routePage);
window.addEventListener('hashchange', routePage);
viewHomeLink.addEventListener('click', loadHomeView);
