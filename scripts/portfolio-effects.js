window.addEventListener('DOMContentLoaded', event => {
    window.addEventListener('scroll', OnScroll);

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        hamburger.classList.toggle('open');
    });

    document.querySelectorAll('.nav-button').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
        });
    });

    InitAboutMeCarousel();
});

//Imagenes del carrusel de la seccion About me
const aboutMeImages = [
    "images/Home/SaintMichel.jpeg", 
    "images/Home/Fougeres.jpeg"
];

///Inicializa el carrusel de imagenes de la seccion "About me"
function InitAboutMeCarousel() {
    const carousel = document.getElementById("about-me-carousel");
    if (!carousel) return;

    const track = carousel.querySelector(".carousel-track");
    const prevButton = carousel.querySelector(".carousel-prev");
    const nextButton = carousel.querySelector(".carousel-next");
    const dotsContainer = carousel.querySelector(".carousel-dots");

    track.innerHTML = aboutMeImages
        .map(src => `<img class="carousel-image" src="${src}" alt="Profile Photo">`)
        .join("");

    let currentIndex = 0;

    if (aboutMeImages.length <= 1) {
        prevButton.style.display = "none";
        nextButton.style.display = "none";
        dotsContainer.style.display = "none";
        return;
    }

    dotsContainer.innerHTML = aboutMeImages
        .map((_, index) => `<button class="carousel-dot" data-index="${index}" aria-label="Go to image ${index + 1}"></button>`)
        .join("");

    const dots = dotsContainer.querySelectorAll(".carousel-dot");

    function UpdateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, index) => dot.classList.toggle("active", index === currentIndex));
    }

    prevButton.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + aboutMeImages.length) % aboutMeImages.length;
        UpdateCarousel();
    });

    nextButton.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % aboutMeImages.length;
        UpdateCarousel();
    });

    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            currentIndex = parseInt(dot.dataset.index, 10);
            UpdateCarousel();
        });
    });

    UpdateCarousel();
}

///Funcion que expande o retrae la barra de navegacion
function OnScroll() {
    let navBar = document.querySelector(".nav-bar");

    if (window.scrollY == 0) {
        navBar.classList.add("expanded");
    }
    else {
        navBar.classList.remove("expanded");
    }
}