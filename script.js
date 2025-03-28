
//--------- FILTER PROJECTS ------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
   const buttons = document.querySelectorAll(".filter-btn");
    const projects = document.querySelectorAll(".item");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");

            projects.forEach(project => {
                const description = project.querySelector(".overlay p").textContent.toLowerCase();

                if (filter === "all" || description.includes(filter)) {
                    project.style.display = "block";
                } else {
                    project.style.display = "none";
                }
            });

            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });
});


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
    let triggerHeightFilterBar = 3.6 * window.innerHeight;
    let triggerHeightImageGrid = 3.7 * window.innerHeight;

    // Get elements
    let text1 = document.querySelector(".text-line1");
    let text2 = document.querySelector(".text-line2");
    let text3 = document.querySelector(".text-line3");
    let text4 = document.querySelector(".text-line4");
    let servicesContainer = document.querySelector(".services-container");
    let filterBar = document.querySelector(".filter-bar");
    let imageGrid = document.querySelector(".container.gallery-visible");

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