// ===============================
// RED INTEGRADA DE SALUD PACÍFICO NORTE
// script.js
// ===============================

// ===== MENU ACTIVO =====
const menuLinks = document.querySelectorAll("nav ul li a");

menuLinks.forEach(link => {
    link.addEventListener("click", function () {

        menuLinks.forEach(item => {
            item.classList.remove("activo");
        });

        this.classList.add("activo");
    });
});

// ===== SLIDER AUTOMÁTICO =====
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentSlide = 0;

function mostrarSlide(index) {

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    slides[index].classList.add("active");
}

// ===== BOTÓN SIGUIENTE =====
function siguienteSlide() {

    currentSlide++;

    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    mostrarSlide(currentSlide);
}

// ===== BOTÓN ANTERIOR =====
function anteriorSlide() {

    currentSlide--;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }

    mostrarSlide(currentSlide);
}

// ===== EVENTOS BOTONES =====
if (nextBtn) {
    nextBtn.addEventListener("click", siguienteSlide);
}

if (prevBtn) {
    prevBtn.addEventListener("click", anteriorSlide);
}

// ===== AUTO SLIDE CADA 5 SEGUNDOS =====
setInterval(() => {
    siguienteSlide();
}, 5000);

// ===== EFECTO SCROLL HEADER =====
window.addEventListener("scroll", () => {

    const header = document.querySelector("header");

    if (window.scrollY > 50) {
        header.classList.add("header-scroll");
    } else {
        header.classList.remove("header-scroll");
    }
});

// ===== ANIMACIÓN NOTICIAS =====
const noticias = document.querySelectorAll(".card-noticia");

window.addEventListener("scroll", () => {

    noticias.forEach(card => {

        const posicion = card.getBoundingClientRect().top;
        const tamañoPantalla = window.innerHeight;

        if (posicion < tamañoPantalla - 100) {
            card.classList.add("mostrar");
        }
    });
});

// ===== BOTÓN VOLVER ARRIBA =====
const btnTop = document.querySelector(".btn-top");

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {
        btnTop.classList.add("visible");
    } else {
        btnTop.classList.remove("visible");
    }
});

if (btnTop) {

    btnTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ===== FECHA ACTUAL =====
const fecha = new Date();

const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
};

const fechaTexto = fecha.toLocaleDateString("es-PE", opciones);

const fechaElemento = document.querySelector(".fecha-actual");

if (fechaElemento) {
    fechaElemento.textContent = fechaTexto;
}

// ===== PRELOADER =====
window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    if (loader) {

        loader.classList.add("loader-hidden");

        setTimeout(() => {
            loader.style.display = "none";
        }, 1000);
    }
});

// ===== EFECTO HOVER TARJETAS =====
const cards = document.querySelectorAll(".card-noticia");

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px)";
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0px)";
    });
});

console.log("Sistema RIS Pacífico Norte cargado correctamente.");