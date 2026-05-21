// ========================================
// SCRIPT PRINCIPAL - RED DE SALUD
// ========================================

// ===== MENU RESPONSIVE =====
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if(menuToggle){

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

    });

}

// ========================================
// HEADER SCROLL
// ========================================
window.addEventListener("scroll", () => {

    const header = document.querySelector("header");

    if(window.scrollY > 50){

        header.classList.add("header-scroll");

    }else{

        header.classList.remove("header-scroll");

    }

});

// ========================================
// SLIDER AUTOMÁTICO
// ========================================
const slides = document.querySelectorAll(".slide");

let currentSlide = 0;

function showSlide(index){

    slides.forEach(slide => {

        slide.classList.remove("active");

    });

    slides[index].classList.add("active");

}

function nextSlide(){

    currentSlide++;

    if(currentSlide >= slides.length){

        currentSlide = 0;

    }

    showSlide(currentSlide);

}

// Cambia cada 5 segundos
setInterval(() => {

    nextSlide();

}, 5000);

// ========================================
// SCROLL SUAVE MENU
// ========================================
const enlaces = document.querySelectorAll('a[href^="#"]');

enlaces.forEach(enlace => {

    enlace.addEventListener("click", function(e){

        e.preventDefault();

        const destino = document.querySelector(this.getAttribute("href"));

        destino.scrollIntoView({
            behavior: "smooth"
        });

    });

});

// ========================================
// ANIMACIONES AL HACER SCROLL
// ========================================
const elementos = document.querySelectorAll(".animado");

function mostrarElementos(){

    elementos.forEach(el => {

        const posicion = el.getBoundingClientRect().top;
        const pantalla = window.innerHeight;

        if(posicion < pantalla - 100){

            el.classList.add("mostrar");

        }

    });

}

window.addEventListener("scroll", mostrarElementos);

// ========================================
// BOTON VOLVER ARRIBA
// ========================================
const btnTop = document.querySelector(".btn-top");

window.addEventListener("scroll", () => {

    if(window.scrollY > 300){

        btnTop.classList.add("visible");

    }else{

        btnTop.classList.remove("visible");

    }

});

if(btnTop){

    btnTop.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}

// ========================================
// FORMULARIO CONTACTO
// ========================================
const form = document.querySelector(".form-contacto");

if(form){

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const nombre = document.querySelector("#nombre").value;
        const correo = document.querySelector("#correo").value;
        const mensaje = document.querySelector("#mensaje").value;

        if(nombre === "" || correo === "" || mensaje === ""){

            alert("Complete todos los campos.");

        }else{

            alert("Mensaje enviado correctamente.");

            form.reset();

        }

    });

}

console.log("Sistema cargado correctamente.");