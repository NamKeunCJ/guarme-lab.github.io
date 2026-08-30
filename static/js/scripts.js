document.addEventListener("DOMContentLoaded", () => {
    console.log("entroooo");

    // Tooltip de WhatsApp
    const whatsappBtn = document.querySelector(".whatsapp-btn");
    const tooltip = document.querySelector(".whatsapp-tooltip");

    if (whatsappBtn && tooltip) {
        whatsappBtn.addEventListener("mouseenter", () => tooltip.style.display = "block");
        whatsappBtn.addEventListener("mouseleave", () => tooltip.style.display = "none");
    }

    // Imágenes
    const imagenes = document.querySelectorAll(".contenedor-imagen");

    if (imagenes.length) {
        const primeraImagen = imagenes[0];
        primeraImagen.classList.add("expandido");

        imagenes.forEach(imagen => {
            imagen.addEventListener("mouseenter", () => primeraImagen.classList.remove("expandido"));
            imagen.addEventListener("mouseleave", () => primeraImagen.classList.add("expandido"));
        });
    }
});