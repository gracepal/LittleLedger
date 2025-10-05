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

// Modal element variables will be defined globally but SELECTED later, after injection
// modalDescription is the H2 header.
let productModal, modalCloseBtn, modalTitle, modalImage, modalDescription, modalTags;

// NEW Modal Elements (modalNotes and modalSourceLink remain)
let modalNotes, modalSourceLink;

/**************************************************************
 * NEW HELPER FUNCTION: Re-attach necessary listeners
 */
function attachSidebarListeners() {
  // Re-select the links after innerHTML replacement
  const reAttachedProductsLink = document.getElementById('view-products-link');
  const reAttachedHomeLink = document.getElementById('view-home-link');

  if (reAttachedProductsLink) {
    reAttachedProductsLink.addEventListener('click', loadProductsView);
  }

  if (reAttachedHomeLink) {
    reAttachedHomeLink.addEventListener('click', loadHomeView);
  }
}

/**************************************************************
 * MODAL HANDLER FUNCTIONS
 */

/**
 * Closes the product detail modal.
 */
function closeModal() {
  if (productModal) {
    productModal.classList.remove('open');
  }
}

/**
 * Opens and populates the product detail modal.
 * @param {string} productId - The ID of the product to display.
 */
function openModal(productId) {
  // ... (product lookup logic remains the same) ...
  const idToFind = parseInt(productId, 10);
  const product = products.find((p) => p.id === idToFind);

  if (!product) {
    console.error('Product not found for ID:', productId);
    return;
  }

  // Populate the elements based on the new structure

  // 1. HEADER (Description) & NAME (Info Section)
  modalDescription.textContent = product.description;
  modalTitle.textContent = product.name;

  // 2. IMAGE
  modalImage.src = product.photo;
  modalImage.alt = product.name;

  // 3. NOTES
  if (product.notes && product.notes.trim() !== '') {
    modalNotes.textContent = product.notes;
    modalNotes.classList.remove('faint-none');
  } else {
    modalNotes.textContent = '(none)';
    modalNotes.classList.add('faint-none');
  }

  // 4. TAGS
  const tagsHtml = product.tags.map((tag) => `<span class="tag">${tag}</span>`).join(' ');
  modalTags.innerHTML = tagsHtml;

  // 5. LINK (Updated text: "View Product")
  if (product.link) {
    modalSourceLink.href = product.link;
    modalSourceLink.textContent = 'View Product'; // <-- UPDATED TEXT
    modalSourceLink.style.display = 'inline';
  } else {
    modalSourceLink.href = '#';
    modalSourceLink.textContent = 'Source Unavailable';
    modalSourceLink.style.display = 'none';
  }

  // Open the modal
  productModal.classList.add('open');
}

/**
 * Handles clicks on the product grid and delegates the event to open the modal.
 * @param {Event} event
 */
function handleProductCardClick(event) {
  const card = event.target.closest('.product-card');

  if (card) {
    const productId = card.dataset.id;
    if (productModal) {
      openModal(productId);
    }
  }
}

/**************************************************************
 * MODAL SETUP FUNCTIONS
 */

/**
 * Returns the full HTML structure for the product detail modal.
 */
function getModalHTML() {
  // Note: The structure is simplified as requested
  return `
        <div id="product-modal" class="modal-overlay">
            <div class="modal-content">
                <span class="modal-close-btn" id="modal-close-btn">&times;</span>
                <div id="modal-product-details">
                    <h2 id="modal-description-header"></h2>

                    <div class="modal-body">
                        <img id="modal-image" src="" alt="Product Image">

                        <div class="modal-info">
                            <p><strong>Product:</strong> <span id="modal-name"></span></p>
                            <p><strong>Notes:</strong> <span id="modal-notes"></span></p>
                        </div>
                    </div>

                    <div class="modal-footer-area">
                        <div class="modal-tags-container">
                            <span id="modal-tags"></span>
                        </div>
                        <div class="modal-link-container">
                            <a id="modal-source-link" href="#" target="_blank">View Product</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
}

/**
 * Injects the modal HTML into the document body and selects its elements.
 */
function injectModalContainer() {
  document.body.insertAdjacentHTML('beforeend', getModalHTML());

  // CRITICAL: Select the elements now that they exist in the DOM
  productModal = document.getElementById('product-modal');
  modalCloseBtn = document.getElementById('modal-close-btn');

  // Selectors for New Structure
  modalDescription = document.getElementById('modal-description-header'); // H2 for description
  modalTitle = document.getElementById('modal-name'); // Span for the long name

  modalImage = document.getElementById('modal-image');
  modalTags = document.getElementById('modal-tags');

  // NEW Selectors (modalNotes is now a <span>)
  modalNotes = document.getElementById('modal-notes');
  modalSourceLink = document.getElementById('modal-source-link');
}

/**
 * Sets up all listeners related to the modal (after injection).
 */
function setupModalListeners() {
  mainContent.addEventListener('click', handleProductCardClick);

  modalCloseBtn.addEventListener('click', closeModal);

  productModal.addEventListener('click', function (event) {
    if (event.target === productModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && productModal.classList.contains('open')) {
      closeModal();
    }
  });
}

/**************************************************************
 * NEW FUNCTIONS FOR SIDEBAR CONTROLS
 */

// Define the HTML for the product-specific controls
function getProductsSidebarControlsHTML() {
  const productCount = products.length;

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

            <hr class="sidebar-separator faint">

            <div class="sort-controls">
                <span class="sort-label">Sort:</span>

                <div class="radio-group">
                    <label>
                        <input type="radio" name="product-sort" value="name" checked> Name
                    </label>
                    <label>
                        <input type="radio" name="product-sort" value="added"> Added
                    </label>
                    <label>
                        <input type="radio" name="product-sort" value="updated"> Updated
                    </label>
                </div>

                <div class="sort-direction">
                    <button id="sort-asc-btn" class="sort-arrow active">&uarr;</button>
                    <button id="sort-desc-btn" class="sort-arrow">&darr;</button>
                </div>
            </div>

            <hr class="sidebar-separator faint">
            <div class="result-summary">
                <span id="product-result-count">Showing ${productCount} products</span>

                ${generateProductSummaryList(products)}
            </div>

        </div>
    `;
}

/**
 * Generates the HTML list of product names for the sidebar summary.
 * @param {Array<Object>} productsArray - The array of products currently in view.
 * @returns {string} The HTML string for the list.
 */
function generateProductSummaryList(productsArray) {
  if (!productsArray || productsArray.length === 0) {
    return '<p class="no-results">No products match your current filters.</p>';
  }

  // Create a list of the product names
  const listItems = productsArray
    .map(
      (product) =>
        `<li class="product-summary-item" data-id="${product.id}">
            ${product.name.substring(0, 35)}...
        </li>`
    )
    .join('');

  return `<ul class="product-summary-list">${listItems}</ul>`;
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
  const hash = window.location.hash;

  if (hash === '#products') {
    loadProductsView(false);
  } else {
    loadHomeView(false);
  }
}

// Function to load the original home content
function loadHomeView(event) {
  if (event) {
    event.preventDefault();
    window.location.hash = ''; // Clear the hash for the home page
  }

  const homeContentHTML = homeTemplate.innerHTML;
  mainContent.innerHTML = homeContentHTML;

  // Restore the sidebar to its original state (only <ul> links)
  sidebarMenu.innerHTML = `
        <ul>
            <li><a href="#" id="view-home-link">Home</a></li>
            <li><a href="#" id="view-products-link">See Products</a></li>
            <li><a href="#">Calendar</a></li>
            <li><a href="#">Log Event</a></li>
        </ul>
    `;

  attachSidebarListeners();
  window.scrollTo(0, 0);
}

// Function to handle the navigation and view update
function loadProductsView(event) {
  if (event) {
    event.preventDefault();
    window.location.hash = '#products';
  }

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

  attachSidebarListeners();
  window.scrollTo(0, 0);
}

// Show/Hide Button based on Scroll Position
function toggleScrollButton() {
  if (document.body.scrollTop > SCROLL_THRESHOLD || document.documentElement.scrollTop > SCROLL_THRESHOLD) {
    scrollButton.classList.add('show');
  } else {
    scrollButton.classList.remove('show');
  }
}

// Scroll to the Top when Button is Clicked
function scrollToTop() {
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
  sidebarMenu.classList.toggle('open');
  mainWrapper.classList.toggle('shifted');
});

// --- DROPDOWN TOGGLE (OVERLAY) ---

userMenuToggleButton.addEventListener('click', function (event) {
  event.stopPropagation();
  userDropdown.classList.toggle('visible');
});

// --- DROPDOWN CLOSE ON EXTERNAL CLICK ---

document.addEventListener('click', function (event) {
  const isClickInsideDropdown = userDropdown.contains(event.target);
  const isClickOnToggle = userMenuToggleButton.contains(event.target);

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

// CRITICAL: On DOMContentLoaded, inject the modal HTML, set up listeners, and route the page
document.addEventListener('DOMContentLoaded', function () {
  injectModalContainer();
  setupModalListeners();
  routePage();
});

window.addEventListener('hashchange', routePage);
