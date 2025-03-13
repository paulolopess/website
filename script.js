document.addEventListener("DOMContentLoaded", function () {
    // Start the video instantly (handling potential errors)
    const firstVideo = document.querySelector(".carousel .list .item video");
    if (firstVideo) {
        try {
            firstVideo.muted = true; // Mute video to avoid autoplay restrictions
            firstVideo.play().catch(error => {
                console.warn("Autoplay failed:", error);
            });
        } catch (error) {
            console.warn("Autoplay failed:", error);
        }
    }

    // Set the first thumbnail as active
    let firstThumbnail = document.querySelector(".carousel .thumbnail .item");
    if (firstThumbnail) {
        firstThumbnail.classList.add("active");
    }

    // Carousel setup
    let carouselDom = document.querySelector(".carousel");
    let sliderDom = document.querySelector(".carousel .list");
    let thumbnailBorderDom = document.querySelector(".carousel .thumbnail");

    if (carouselDom && sliderDom && thumbnailBorderDom) {
        let thumbnails = Array.from(thumbnailBorderDom.querySelectorAll(".item"));
        let isAnimating = false;

        // Function to reset animations
        function resetAnimations() {
            document.querySelectorAll(".list .item img").forEach((img) => {
                img.style.animation = "none";
                img.offsetHeight; // Force reflow
                img.style.animation = "";
            });
        }

        // Ensure initial click events are set
        updateClickEvents();

        // Handle thumbnail updates
        const items = document.querySelectorAll(".list .item");
        const thumbnailImage = document.getElementById("current-thumbnail");

        items.forEach(item => {
            item.addEventListener("click", function () {
                const newThumbnail = item.getAttribute("data-thumbnail");
                if (newThumbnail && thumbnailImage) {
                    thumbnailImage.src = newThumbnail;
                }
            });
        });
    }

    // Search box toggle (check if element exists)
    const searchIcon = document.getElementById("searchIcon");
    const searchBox = document.getElementById("searchBox");
    
    if (searchIcon && searchBox) {
        searchIcon.addEventListener("click", () => {
            searchBox.classList.toggle("active");
        });
    }
});


//--------- SCROLL TO ACTIVATE ------------------------------------------------------
//--------- SCROLL TO ACTIVATE ------------------------------------------------------
window.addEventListener("scroll", function () {
    let scrollPosition = window.scrollY;

    // Text-line triggers and hide points
    let triggerHeight1 = 1.5 * window.innerHeight;
    let hideHeight1 = 2.2 * window.innerHeight;

    let triggerHeight2 = 1.7 * window.innerHeight;
    let hideHeight2 = 2.4 * window.innerHeight;

    let triggerHeight3 = 3 * window.innerHeight;
    let hideHeight3 = 3.8 * window.innerHeight;

    let triggerHeight4 = 3.2 * window.innerHeight;
    let hideHeight4 = 3.9 * window.innerHeight;

    let triggerHeight = 2.2 * window.innerHeight;
    let triggerHeightProjects = 3.5 * window.innerHeight;
    let triggerHeightFilterBar = 3.6 * window.innerHeight; // Adjust as needed
    let triggerHeightImageGrid = 3.7 * window.innerHeight; // Adjust as needed

    // Get elements
    let text1 = document.querySelector(".text-line1");
    let text2 = document.querySelector(".text-line2");
    let text3 = document.querySelector(".text-line3");
    let text4 = document.querySelector(".text-line4");
    let servicesContainer = document.querySelector(".services-container");
    let projectsList = document.querySelector(".projects-list");
    let filterBar = document.querySelector(".filter-bar");
    let imageGrid = document.querySelector(".image-grid");

    // Text-line visibility logic
    if (text1) {
        if (scrollPosition >= triggerHeight1 && scrollPosition < hideHeight1) {
            text1.classList.add("text-visible");
        } else {
            text1.classList.remove("text-visible");
        }
    }

    if (text2) {
        if (scrollPosition >= triggerHeight2 && scrollPosition < hideHeight2) {
            text2.classList.add("text-visible");
        } else {
            text2.classList.remove("text-visible");
        }
    }

    if (text3) {
        if (scrollPosition >= triggerHeight3 && scrollPosition < hideHeight3) {
            text3.classList.add("text-visible");
        } else {
            text3.classList.remove("text-visible");
        }
    }

    if (text4) {
        if (scrollPosition >= triggerHeight4 && scrollPosition < hideHeight4) {
            text4.classList.add("text-visible");
        } else {
            text4.classList.remove("text-visible");
        }
    }

    // Services container visibility logic
    if (servicesContainer && scrollPosition >= triggerHeight) {
        servicesContainer.classList.add("services-visible");
    } else if (servicesContainer) {
        servicesContainer.classList.remove("services-visible");
    }

    // Projects list visibility logic
    if (projectsList && scrollPosition >= triggerHeightProjects) {
        projectsList.classList.add("projects-visible");
    } else if (projectsList) {
        projectsList.classList.remove("projects-visible");
    }

    // Filter bar visibility logic
    if (filterBar && scrollPosition >= triggerHeightFilterBar) {
        filterBar.classList.add("filter-visible");
    } else if (filterBar) {
        filterBar.classList.remove("filter-visible");
    }

    // Image grid visibility logic
    if (imageGrid && scrollPosition >= triggerHeightImageGrid) {
        imageGrid.classList.add("grid-visible");
    } else if (imageGrid) {
        imageGrid.classList.remove("grid-visible");
    }
});



//--------- INITIAL AND FINAL ANIMATIONS ------------------------------------------------------
document.addEventListener("scroll", function () {
    const logo = document.querySelector("#logo");
    const fadeWhite = document.querySelector(".fade-white");
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;

    // Calculate scale factor for the logo
    let maxScale = Math.max(window.innerWidth, viewportHeight) / 1000;
    let scale = 1 + (scrollPosition / 130) * (maxScale - 1);

    // Zoom-in (Intro Animation)
    if (logo && scrollPosition < 3.5 * viewportHeight) {
        logo.style.transform = `scale(${scale})`;
    }
    // Zoom-out (Outro Animation) — ending sooner at 550vh
    else if (logo && scrollPosition >= 3.5 * viewportHeight && scrollPosition <= 5.5 * viewportHeight) {
        let reverseScale = 20 - ((scrollPosition - 3.5 * viewportHeight) / (2 * viewportHeight)) * 19;
        logo.style.transform = `scale(${Math.max(reverseScale, 1)})`; 
    }

    // White overlay fading logic (matching end animation timing)
    if (fadeWhite) {
        if (scrollPosition >= viewportHeight && scrollPosition < 3.5 * viewportHeight) {
            fadeWhite.style.opacity = 1;
        } else if (scrollPosition >= 3.5 * viewportHeight && scrollPosition < 5 * viewportHeight) {
            fadeWhite.style.opacity = 1;
        } else if (scrollPosition >= 5 * viewportHeight && scrollPosition < 5.5 * viewportHeight) {
            // Fade-out starts at 500vh and finishes by 550vh
            let opacity = 1 - (scrollPosition - 5 * viewportHeight) / (0.5 * viewportHeight);
            fadeWhite.style.opacity = Math.max(opacity, 0);
        } else {
            fadeWhite.style.opacity = 0;
        }
    }
});





// Initial fade-in animation on load
window.addEventListener("load", function () {
    const logo = document.querySelector("#logo");
    if (logo) {
        logo.classList.add("fade-in");
    }
});


//--------- PROJECTS LIST VIDEO PLAYBACK ------------------------------------------------------
document.querySelectorAll('.project-item').forEach(item => {
    const video = item.querySelector('.project-video');
    
    if (video) {
        item.addEventListener('mouseenter', () => {
            // When mouse enters, make the video visible and start playing
            video.play();
        });
        
        item.addEventListener('mouseleave', () => {
            // When mouse leaves, pause and reset the video
            video.pause();
            video.currentTime = 0; // Reset to the beginning
        });
    }
});









document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".filter-btn");
    const projects = document.querySelectorAll(".image-item");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");

            // Reset the layout: Show all items
            projects.forEach(project => {
                const description = project.querySelector(".overlay p").textContent.toLowerCase();

                // Show or hide projects based on the filter
                if (filter === "all" || description.includes(filter)) {
                    project.style.display = "block";  // Show item
                } else {
                    project.style.display = "none";  // Hide item
                }
            });

            // Remove 'active' from all buttons and add it to the clicked one
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });
});
