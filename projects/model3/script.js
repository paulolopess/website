// Function to transition to a new page
function changePage(pageId) {
    // Get all pages
    const pages = document.querySelectorAll('.page');
    
    // Remove 'active' class from all pages
    pages.forEach(page => {
      page.classList.remove('active');
    });
  
    // Add 'active' class to the page you want to show
    const targetPage = document.getElementById(pageId);
    targetPage.classList.add('active');
  }
  
  // Navigation logic
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPageId = e.target.getAttribute('href').substring(1); // Remove '#' from link href
      changePage(targetPageId);
    });
  });















// Select elements
const arrow = document.querySelector('.arrow.left');  // Arrow element
const bottomLeft = document.querySelector('.bottom-left');
const gallery = document.querySelector('.gallery');
const title = document.querySelector('.title');  // Title element

// Initially hide the gallery and bottom-left
gallery.style.display = 'none';
bottomLeft.style.display = 'none';
title.style.animation = 'fadeInBottom 1s ease-out forwards'; // Initial animation

// Event listener for arrow click
arrow.addEventListener('click', () => {
    // Toggle visibility of the elements
    if (bottomLeft.style.display === 'none' || bottomLeft.style.display === '') {
        bottomLeft.style.display = 'block';  // Show the bottom-left info box
        gallery.style.display = 'block'; // Show the gallery

        // Reverse animation for title (fade out)
        title.style.animation = 'fadeOutTop 1s ease-out forwards';
    } else {
        bottomLeft.style.display = 'none';   // Hide the bottom-left info box
        gallery.style.display = 'none'; // Hide the gallery

        // Play the initial animation for title (fade in)
        title.style.animation = 'fadeInBottom 1s ease-out forwards';
    }

    // Toggle the active class for the arrow
    arrow.classList.toggle('active');
});
