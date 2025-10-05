// app.js

// --- ELEMENT SELECTION ---

// Sidebar and Main Content Elements
// const container = document.querySelector('.container'); // Removed, as it's not used in this JS
const menuToggleButton = document.getElementById('menu-toggle');
const sidebarMenu = document.getElementById('sidebar-menu');
const mainWrapper = document.getElementById('main-wrapper');

// 👇 New: User Dropdown Elements
const userMenuToggleButton = document.getElementById('user-menu-toggle');
const userDropdown = document.getElementById('user-dropdown');

// Scroll Button Elements
const scrollButton = document.getElementById('scrollToTopBtn');
const SCROLL_THRESHOLD = 300; // Define threshold for clarity

/**************************************************************
 * FUNCTIONS
 */

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

// Add event listener for scroll to top button
scrollButton.addEventListener('click', scrollToTop);
