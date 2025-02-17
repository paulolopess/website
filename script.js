function toggleMenu() {
    const menuContainer = document.querySelector('.menu-container');
    menuContainer.classList.toggle('active');
  }
  
  // Ensure only one set of event listeners for hover video
  document.querySelectorAll(".hover-video").forEach((video) => {
    video.addEventListener("mouseover", function () {
        this.play();
    });
  
    video.addEventListener("mouseleave", function () {
        this.pause();
        this.currentTime = 0; // Reset to the first frame
    });
  });
  
// Step 1: Get DOM elements
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
let timeDom = document.querySelector('.carousel .time');

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 3000;
//let timeAutoNext = 4000; // Define `timeAutoNext`

let isAnimating = false; // Prevent overlapping animations

function resetAnimations() {
    const items = document.querySelectorAll('.list .item img');
    items.forEach(img => {
        img.style.animation = 'none';
        img.offsetHeight; // Force reflow to reset animation
        img.style.animation = '';
    });
}

function goNext() {
    if (isAnimating) return; // Prevent spam clicks causing lag
    isAnimating = true;

    resetAnimations(); // Reset animations before switching

    let SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');

    SliderDom.appendChild(SliderItemsDom[0]);
    thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);

    carouselDom.classList.add('next');

    setTimeout(() => {
        carouselDom.classList.remove('next');
        isAnimating = false; // Allow next animation
    }, 800);
}

function goPrev() {
    if (isAnimating) return;
    isAnimating = true;

    resetAnimations();

    let SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');

    SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
    thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);

    carouselDom.classList.add('prev');

    setTimeout(() => {
        carouselDom.classList.remove('prev');
        isAnimating = false;
    }, 800);
}

// Attach correct event listeners
nextDom.onclick = goNext;
prevDom.onclick = goPrev;

// Function for continuous autoplay
function autoNext() {
    // Wait for the timeAutoNext delay before starting the transition
    setTimeout(() => {
        nextDom.click(); // Trigger the next button click

        // Reset the timeout to continue the cycle
        setTimeout(autoNext, timeAutoNext);
    }, timeAutoNext);
}

// Start the automatic cycle with a delay for the first transition
setTimeout(autoNext, timeAutoNext);











const searchContainer = document.getElementById("searchBox");
const searchIcon = document.getElementById("searchIcon");

searchIcon.addEventListener("click", () => {
    searchContainer.classList.toggle("active");
});