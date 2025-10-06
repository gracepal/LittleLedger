// app.js

/**
 * 🚀 LAUNCH CODE 🚀
 * (1) Values, Data Types, and Operations
 * --------------------------------------
 * We use "let" for variables that can be reassigned, and
 * "const" for variables that cannot and should not be assigned.
 *
 * Below are examples of assigning a boolean data type to a let variable (ex. line 16),
 * and HTMLElements object data types to const and let variables (ex. liness 32, 34).
 *
 * Below also is one example of multiplication operation (ex. line 26).
 */

let debug = true; // set false to reduce noise or to print specific content

// --- ELEMENT SELECTION ---
// Top Navbar & Body(s)
const mainWrapper = document.getElementById('main-wrapper');
const mainContent = document.getElementById('main-content');
const homeTemplate = document.getElementById('home-template');
const menuToggleButton = document.getElementById('menu-toggle');
const userMenuToggleButton = document.getElementById('user-menu-toggle');
const scrollButton = document.getElementById('scrollToTopBtn');
const SCROLL_THRESHOLD = window.innerHeight * 0.01;
// Sidebar
const sidebarMenu = document.getElementById('sidebar-menu');
const viewHomeLink = document.getElementById('view-home-link');
const viewProductsLink = document.getElementById('view-products-link');
// User dropdown
const userDropdown = document.getElementById('user-dropdown');
// Products Page
let productModal, modalCloseBtn, modalTitle, modalImage, modalDescription, modalTags;
let modalNotes, modalSourceLink;

// --- HELPER FUNCTIONS ---

// Re-attach necessary listeners
function attachSidebarListeners() {
  if (debug) if (debug) console.log('[${getTimestamp()}] FUNCTION: attachSidebarListeners()');
  // Re-select links after replacing innerHTML
  const reAttachedProductsLink = document.getElementById('view-products-link');
  const reAttachedHomeLink = document.getElementById('view-home-link');
  // Add event listener to load Products Page if link clicked
  if (reAttachedProductsLink) {
    reAttachedProductsLink.addEventListener('click', loadProductsView);
  }
  // Add event listener to load Home page if link clicked
  if (reAttachedHomeLink) {
    reAttachedHomeLink.addEventListener('click', loadHomeView);
  }
}

// Toggle product details modal close by removing "open" class if currently added
function closeModal() {
  if (debug) console.log('[${getTimestamp()}] FUNCTION: closeModal()');
  if (productModal) {
    productModal.classList.remove('open');
  }
}

// Open and populate the product details modal
function openModal(productId) {
  /**
   * 🚀 LAUNCH CODE 🚀
   * (2) Stringing Characters Together
   * ---------------------------------
   * Below is an example of a template literal, where I pass in two types,
   * one is a function to "getTimestamp()"", and another is a string "productId"
   * (ex. line 73).
   */
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: openModal(productId=${productId})`);
  // Target product object using product ID
  const idToFind = parseInt(productId, 10);
  const product = products.find((p) => p.id === idToFind);
  // Print error if product ID not found
  /**
   * 🚀 LAUNCH CODE 🚀
   * (3) Control Structures and Logic
   * --------------------------------
   * Below is an example of a control logic, where print a message in the console
   * if we fail to find a product with a product ID (ex. lines 85-88).
   */
  if (!product) {
    console.error('Product not found for ID:', productId);
    return;
  }
  // Modal title is the user given (shorter) description
  modalDescription.textContent = product.description;
  // Modal content reads full product name from Amazon, etc.
  modalTitle.textContent = product.name;
  // Modal image taken from user-uploaded images
  modalImage.src = product.photo;
  modalImage.alt = product.name;
  // No notes currently, but reserved for adding product care and other important information
  if (product.notes && product.notes.trim() !== '') {
    modalNotes.textContent = product.notes;
    modalNotes.classList.remove('faint-none');
  } else {
    modalNotes.textContent = '(none)';
    modalNotes.classList.add('faint-none');
  }
  // Tags to allow grouping and filtering in the future
  const tagsHtml = product.tags.map((tag) => `<span class="tag">${tag}</span>`).join(' ');
  modalTags.innerHTML = tagsHtml;
  // Link to open source (ex. Amazon) in a new tab
  if (product.link) {
    modalSourceLink.href = product.link;
    modalSourceLink.textContent = 'View Product';
    modalSourceLink.style.display = 'inline';
  } else {
    modalSourceLink.href = '#';
    modalSourceLink.textContent = 'No Product Link';
    modalSourceLink.style.display = 'none';
  }
  // Open modal by adding "open" class
  productModal.classList.add('open');
}

// Read click and pass on clicked card's product ID to open modal with product details
function handleProductCardClick(event) {
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: handleProductCardClick(event=`, event, `)`);
  // Takes the card that is closet to the click event
  const card = event.target.closest('.product-card');
  // If found, this card will have a "data-id" attribute string value
  if (card) {
    const productId = card.dataset.id; // grabs the "data-id" value
    if (productModal) {
      // Then open modal with that product ID to populate with that product's details
      openModal(productId);
    }
  }
}

// Create modal HTML
function getModalHTML() {
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: getModalHTML()`);
  // Topmost contains the product description (short name) and a button to close the modal
  // Followed by middle, product image left, full product name and notes on right
  // Followed by bottom, tags on the left, and link to product (ex. Amazon) on right
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

// Insert modal HTML and select elements into variables
function injectModalContainer() {
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: injectModalContainer()`);
  // Actually inserts to the end of body, in this case, after the script tags
  document.body.insertAdjacentHTML('beforeend', getModalHTML());

  // Select elements now rendered in DOM
  productModal = document.getElementById('product-modal');
  modalCloseBtn = document.getElementById('modal-close-btn');
  modalDescription = document.getElementById('modal-description-header'); // short user name
  modalTitle = document.getElementById('modal-name'); // full-long product name
  modalImage = document.getElementById('modal-image');
  modalNotes = document.getElementById('modal-notes');
  modalTags = document.getElementById('modal-tags');
  modalSourceLink = document.getElementById('modal-source-link');
}

// Setup listeners for the modal (after injection).
function setupModalListeners() {
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: setupModalListeners()`);
  // Add event listener to gets closest product card from click, to use its
  // "data-id" product ID to open modal with that product's specific details
  mainContent.addEventListener('click', handleProductCardClick);
  // Add event listener to close open modal by removing its "open" class
  modalCloseBtn.addEventListener('click', closeModal);
  // Add event listener to the dark overlay surrounding modal, to close modal
  productModal.addEventListener('click', function (event) {
    if (event.target === productModal) {
      closeModal();
    }
  });
  // Add event listener to close modal if user presses the Escape key and modal is open
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && productModal.classList.contains('open')) {
      closeModal();
    }
  });
}

// Define the HTML for the product-specific controls
function getProductsSidebarControlsHTML() {
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: getProductsSidebarControlsHTML()`);
  const productCount = products.length;
  // Add horizontal line below the generic/shared sidebar content
  // Followed by title indicating "Products"
  // Followed by a search input container, and 3 checkboxes under "Search Fields" header
  // Followed by another horizontal line
  // Followed by radio button group with 3 sort options under "Sort" header
  // Followed by another horizontal line
  // Followed by a results summary products list under "Showing <N> products" header
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

// Generate the HTML list of product names for the sidebar summary.
function generateProductSummaryList(productsArray) {
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: generateProductSummaryList(productsArray=`, productsArray, `)`);
  // If there is no array or it is empty, print message indicating no products
  if (!productsArray || productsArray.length === 0) {
    return '<p class="no-results">No products match your current filters.</p>';
  }
  /**
   * 🚀 LAUNCH CODE 🚀
   * (4) Building Arrays
   * -------------------
   * Below is an example of building an array using the .map() function, to build
   * a new array based on the elements of an existing one (ex. lines 300-306).
   */
  // Create a list of the product names up to 35 characters, then ellipses if longer
  const listItems = productsArray
    .map(
      (product) =>
        `<li class="product-summary-item" data-id="${product.id}">
            ${product.name.substring(0, 35)}...
        </li>`
    )
    .join('');
  // Add above list of <li> tags inside below <ul> tag
  return `<ul class="product-summary-list">${listItems}</ul>`;
}

// Generate HTML string for tag bubbles at the bottom of the card
function generateTagBubbles(tags) {
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: generateTagBubbles(tags=`, tags, `)`);
  // Return empty string is tags is falsey, or it is empty
  if (!tags || tags.length === 0) return '';
  /**
   * 🚀 LAUNCH CODE 🚀
   * (5) Using Arrays
   * ----------------
   * Similar to the previous example, the .map() function also applies to
   * "Using Arrays". It is part of the "array iterator methods", in addition to
   * .forEach(), .filter(), and .reduce().
   *
   * In below example, we take in the tag, and enclose it within a span tag with
   * the class "tag" (ex. line 329).
   */
  // Otherwise create span tags with each tag
  return tags.map((tag) => `<span class="tag">${tag}</span>`).join('');
}

// Generate HTML string for a single product card
function generateProductCard(product) {
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: generateProductCard(product=`, product, `)`);
  /**
   * 🚀 LAUNCH CODE 🚀
   * (6) Creating and Using Objects
   * ------------------------------
   * Below is an example of using/accessing data from the object created in the
   * data.js file (containing an array of objects, each object representing a product).
   * We access object values using dot notation, to populate our modal with the specific
   * data related to the product card we clicked (ex. lines 344, 351, 353, 356, 359).
   */
  const imagePath = product.photo;
  // Create product card with "data-id" to identify product
  // Populate remainder of card with product-specific details
  // Starting with the (shorter, user-given) product description
  // Followed by the user-taken and submitted product image
  // Followed by a list of product group/filter tags, if any
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

// Generate HTML for full products page view
function getProductsPageHTML() {
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: getProductsPageHTML()`);
  // Construct html for each product card then join together
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
  const hash = window.location.hash; // returns url portion starting with hash '#'
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: routePage(); current hash is "${hash}"`);

  if (hash === '#products') {
    loadProductsView(false);
  } else {
    loadHomeView(false);
  }
}

// Function to load the original home content
function loadHomeView(event) {
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: loadHomeView(event=`, event, `)`);
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
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: loadProductsView(event=`, event, `)`);
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
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: toggleScrollButton()`);
  if (document.body.scrollTop > SCROLL_THRESHOLD || document.documentElement.scrollTop > SCROLL_THRESHOLD) {
    scrollButton.classList.add('show');
  } else {
    scrollButton.classList.remove('show');
  }
}

// Scroll to the Top when Button is Clicked
function scrollToTop() {
  if (debug) console.log(`[${getTimestamp()}] FUNCTION: scrollToTop()`);
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

// Get timestamp
function getTimestamp() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // or false for 24-hour time
  });
}

/**************************************************************
 * EVENT LISTENERS
 */

// --- SIDEBAR TOGGLE (PUSH EFFECT) ---

menuToggleButton.addEventListener('click', function () {
  if (debug) console.log(`[${getTimestamp()}] EVENT LISTENER: "click" event on "menuToggleButton"`);
  sidebarMenu.classList.toggle('open');
  mainWrapper.classList.toggle('shifted');
});

// --- DROPDOWN TOGGLE (OVERLAY) ---

userMenuToggleButton.addEventListener('click', function (event) {
  if (debug) console.log(`[${getTimestamp()}] EVENT LISTENER: "click" event on "userMenuToggleButton"}"`);
  event.stopPropagation();
  userDropdown.classList.toggle('visible');
});

// --- DROPDOWN CLOSE ON EXTERNAL CLICK ---

document.addEventListener('click', function (event) {
  if (debug) console.log(`[${getTimestamp()}] EVENT LISTENER: "click" event on "document"`);
  const isClickInsideDropdown = userDropdown.contains(event.target);
  const isClickOnToggle = userMenuToggleButton.contains(event.target);

  if (userDropdown.classList.contains('visible') && !isClickInsideDropdown && !isClickOnToggle) {
    userDropdown.classList.remove('visible');
  }
});

// --- SCROLL TO TOP LISTENERS ---
if (debug) console.log(`[${getTimestamp()}] EVENT LISTENER: "click" event on "window"`);
window.addEventListener('scroll', toggleScrollButton);
if (debug) console.log(`[${getTimestamp()}] EVENT LISTENER: "click" event on "scrollButton"`);
scrollButton.addEventListener('click', scrollToTop);

// --- VIEW SWITCHING LISTENERS (Initial Setup) ---

// Home button always exists, so attach its listener once
if (debug) console.log(`[${getTimestamp()}] EVENT LISTENER: "click" event on "viewHomeLink"`);
viewHomeLink.addEventListener('click', loadHomeView);

// CRITICAL: On DOMContentLoaded, inject the modal HTML, set up listeners, and route the page
if (debug) console.log(`[${getTimestamp()}] EVENT LISTENER: "DOMContentLoaded" event on "document"`);
document.addEventListener('DOMContentLoaded', function () {
  injectModalContainer();
  setupModalListeners();
  routePage();
});
if (debug) console.log(`[${getTimestamp()}] EVENT LISTENER: "hashchange" event on "window"`);
window.addEventListener('hashchange', routePage);
