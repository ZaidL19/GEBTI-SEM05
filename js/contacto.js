document.getElementById("formContacto").addEventListener("submit", function(e) {
    e.preventDefault();

    // Capturar datos
    let nombre = document.getElementById("nombre").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let mensaje = document.getElementById("mensaje").value.trim();

    // Validación simple
    if (nombre === "" || correo === "" || mensaje === "") {
        alert("⚠️ Por favor completa todos los campos");
        return;
    }

    let telefono = "51966011494";


    let texto = 
`📩 Nuevo mensaje desde la web
-------------------------
👤 Nombre: ${nombre}
📧 Correo: ${correo}
💬 Mensaje: ${mensaje}`;

    // Codificar para URL
    let url = "https://wa.me/" + telefono + "?text=" + encodeURIComponent(texto);

    // Abrir WhatsApp
    window.open(url, "_blank");

    // Limpiar formulario
    this.reset();
});