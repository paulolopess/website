// Select elements
const arrow = document.querySelector('.arrow.left');  // Arrow element
const bottomLeft = document.querySelector('.bottom-left');
const gallery = document.querySelector('.gallery');

// Initially hide the gallery
gallery.style.display = 'none';

// Event listener for arrow click
arrow.addEventListener('click', () => {
    // Toggle visibility of the elements
    if (bottomLeft.style.display === 'none' || bottomLeft.style.display === '') {
        bottomLeft.style.display = 'block';  // Show the bottom-left info box
        gallery.style.display = 'block'; // Show the experience box
    } else {
        bottomLeft.style.display = 'none';   // Hide the bottom-left info box
        gallery.style.display = 'none'; // Hide the experience box
    }

    // Toggle the active class for the arrow
    arrow.classList.toggle('active');
});