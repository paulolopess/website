
// Select elements
const button = document.querySelector('.toggle-button');
const bottomLeft = document.querySelector('.bottom-left');
const experienceBox = document.querySelector('.experience-box');

// Event listener for button click
button.addEventListener('click', () => {
    // Toggle visibility of the elements
    if (bottomLeft.style.display === 'none' || bottomLeft.style.display === '') {
        bottomLeft.style.display = 'block';  // Show the bottom-left info box
        experienceBox.style.display = 'block'; // Show the experience box
    } else {
        bottomLeft.style.display = 'none';   // Hide the bottom-left info box
        experienceBox.style.display = 'none'; // Hide the experience box
    }
});

button.addEventListener('click', () => {
    bottomLeft.classList.toggle('show');
    experienceBox.classList.toggle('show');
});

