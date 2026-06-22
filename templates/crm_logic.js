// 1. Base de datos semilla (Carga de localStorage o usa la semilla inicial)
const SEMILLA_CIUDADANOS = [
    { id: 1, nombre: "Juan Pérez", edad: 65, zona: "Chimbote Centro", telefono: "945123456", riesgo: "Adulto Mayor" },
    { id: 2, nombre: "María Baca", edad: 24, zona: "Coishco", telefono: "987654321", riesgo: "Ninguno" },
    { id: 3, nombre: "Carlos Flores", edad: 3, zona: "Nuevo Chimbote", telefono: "912345678", riesgo: "Pediátrico" },
    { id: 4, nombre: "Ana Flores", edad: 72, zona: "Coishco", telefono: "955667788", riesgo: "Adulto Mayor" },
    { id: 5, nombre: "Luis Milla", edad: 28, zona: "Santa", telefono: "933221144", riesgo: "Ninguno" }
];

let CIUDADANOS = JSON.parse(localStorage.getItem("crm_ciudadanos")) || SEMILLA_CIUDADANOS;
let historialEnvios = JSON.parse(localStorage.getItem("crm_historial")) || [];
let idPacienteSeleccionado = null;

const CAMPANAS_CONFIG = {
    "DENGUE": {
        titulo: "Campaña de Prevención Contra el Dengue",
        mensaje: "Alerta Red Pacífico Norte: Se registran brotes en tu zona. Elimina recipientes con agua estancada. Usa repelente.",
        filtro_zona: ["Coishco", "Santa", "Chimbote Centro"]
    },
    "INFLUENZA": {
        titulo: "Vacunación Neumococo e Influenza 2026",
        mensaje: "Red Pacífico Norte: Protege tu salud este invierno. Acude al puesto de salud más cercano para tu vacunación gratuita.",
        filtro_riesgo: ["Adulto Mayor", "Pediátrico"]
    }
};

function guardarEnLocalStorage() {
    localStorage.setItem("crm_ciudadanos", JSON.stringify(CIUDADANOS));
    localStorage.setItem("crm_historial", JSON.stringify(historialEnvios));
}

function cargarCiudadanos() {
    const tbody = document.getElementById("tabla-ciudadanos");
    tbody.innerHTML = ""; 

    CIUDADANOS.forEach(c => {
        const estaSeleccionado = c.id === idPacienteSeleccionado;
        tbody.innerHTML += `
            <tr id="fila-${c.id}" onclick="seleccionarFila(${c.id})" class="${estaSeleccionado ? 'selected-row' : ''}">
                <td>${c.nombre}</td>
                <td>${c.edad} años</td>
                <td>${c.zona}</td>
                <td>${c.riesgo}</td>
                <td>${c.telefono}</td>
            </tr>
        `;
    });

    actualizarBotonesAccion();
}

function seleccionarFila(id) {
    if (idPacienteSeleccionado === id) {
        idPacienteSeleccionado = null;
    } else {
        idPacienteSeleccionado = id;
    }
    cargarCiudadanos();
}

function actualizarBotonesAccion() {
    const btnEditar = document.getElementById("btn-global-editar");
    const btnEliminar = document.getElementById("btn-global-eliminar");

    if (idPacienteSeleccionado !== null) {
        btnEditar.removeAttribute("disabled");
        btnEliminar.removeAttribute("disabled");
    } else {
        btnEditar.setAttribute("disabled", "true");
        btnEliminar.setAttribute("disabled", "true");
    }
}

// Pega aquí la URL larga que te dio Google después de darle "Allow" y desplegar
const URL_GOOGLE_SCRIPT = "https://script.google.com/macros/s/AKfycbyzV7ioEo8ag5EXziEJfrtxJJ62IZmr1baoURMOSJOM4VpFwufR9czCKo4HrDypyU-GKA/exec";

function guardarPaciente(event) {
    event.preventDefault();

    const nombre = document.getElementById("form-nombre").value;
    const edad = parseInt(document.getElementById("form-edad").value);
    const zona = document.getElementById("form-zona").value;
    const riesgo = document.getElementById("form-riesgo").value;
    const telefono = document.getElementById("form-telefono").value;

    const btnForm = document.getElementById("btn-enviar");

    // Creamos el objeto con los datos exactos que espera recibir tu Google Sheets
    const datosPaciente = { nombre, edad, zona, riesgo, telefono };

    if (btnForm.innerText === "Registrar Paciente") {
        const nuevoId = CIUDADANOS.length > 0 ? Math.max(...CIUDADANOS.map(c => c.id)) + 1 : 1;
        CIUDADANOS.push({ id: nuevoId, nombre, edad, zona, riesgo, telefono });

        // 🚀 ENVIAR A GOOGLE SHEETS (Solo cuando se registra un paciente nuevo)
        fetch(URL_GOOGLE_SCRIPT, {
            method: "POST",
            mode: "no-cors", // Crucial para evitar bloqueos por políticas de Google desde localhost
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosPaciente)
        })
        .then(() => console.log("Sincronizado con Google Sheets con éxito"))
        .catch(err => console.error("Error al enviar a la nube:", err));

    } else {
        const paciente = CIUDADANOS.find(c => c.id === idPacienteSeleccionado);
        if (paciente) {
            paciente.nombre = nombre;
            paciente.edad = edad;
            paciente.zona = zona;
            paciente.riesgo = riesgo;
            paciente.telefono = telefono;
        }
        cancelarEdicion();
    }

    // Mantener la persistencia local y refrescar la tabla del CRM
    guardarEnLocalStorage();
    document.getElementById("form-paciente").reset();
    idPacienteSeleccionado = null;
    cargarCiudadanos();
}

function iniciarEdicion() {
    if (idPacienteSeleccionado === null) return;
    const paciente = CIUDADANOS.find(c => c.id === idPacienteSeleccionado);
    if (!paciente) return;

    document.getElementById("form-nombre").value = paciente.nombre;
    document.getElementById("form-edad").value = paciente.edad;
    document.getElementById("form-zona").value = paciente.zona;
    document.getElementById("form-riesgo").value = paciente.riesgo;
    document.getElementById("form-telefono").value = paciente.telefono;

    document.getElementById("btn-enviar").innerText = "Actualizar Datos";
    document.getElementById("btn-cancelar").style.display = "block";
    document.getElementById("titulo-formulario").innerText = "Modificando Paciente";
}

function cancelarEdicion() {
    document.getElementById("form-paciente").reset();
    document.getElementById("btn-enviar").innerText = "Registrar Paciente";
    document.getElementById("btn-cancelar").style.display = "none";
    document.getElementById("titulo-formulario").innerText = "Registrar Nuevo Paciente";
    idPacienteSeleccionado = null;
    cargarCiudadanos();
}

function eliminarPaciente() {
    if (idPacienteSeleccionado === null) return;
    if (confirm("¿Deseas eliminar permanentemente al paciente seleccionado?")) {
        CIUDADANOS = CIUDADANOS.filter(c => c.id !== idPacienteSeleccionado);
        idPacienteSeleccionado = null;
        guardarEnLocalStorage();
        cancelarEdicion();
        cargarCiudadanos();
    }
}

function dispararCampana(tipo) {
    const config = CAMPANAS_CONFIG[tipo];
    if (!config) return;

    let beneficiariosFiltrados = [];

    CIUDADANOS.forEach(c => {
        if (tipo === "DENGUE" && config.filtro_zona.includes(c.zona)) {
            beneficiariosFiltrados.push(c);
        } else if (tipo === "INFLUENZA" && config.filtro_riesgo.includes(c.riesgo)) {
            beneficiariosFiltrados.push(c);
        }
    });

    if (beneficiariosFiltrados.length === 0) {
        return alert(`No hay pacientes que cumplan con los criterios de la campaña ${tipo}.`);
    }

    const fechaEnvio = new Date().toLocaleString();
    beneficiariosFiltrados.forEach(b => {
        // Generamos el texto personalizado agregando el nombre del ciudadano
        const mensajePersonalizado = `Hola ${b.nombre}. ${config.mensaje}`;
        
        // 🚀 CONSTRUCCIÓN DEL LINK DE WHATSAPP API:
        // Prefijo internacional Perú: 51. encodeURIComponent codifica espacios y tildes para la URL.
        const linkWhatsapp = `https://wa.me/51${b.telefono}?text=${encodeURIComponent(mensajePersonalizado)}`;

        historialEnvios.unshift({
            fecha: fechaEnvio,
            campana: config.titulo,
            ciudadano: b.nombre,
            zona: b.zona,
            contacto: b.telefono,
            mensaje: mensajePersonalizado,
            link: linkWhatsapp // Guardamos el enlace listo para usarse
        });
    });

    guardarEnLocalStorage();
    alert(`🎯 Campaña procesada con éxito. Se generaron ${beneficiariosFiltrados.length} colas de envío para WhatsApp.`);
    actualizarHistorialHtml();
}

function actualizarHistorialHtml() {
    const divHistorial = document.getElementById("historial-envios");
    if (!divHistorial) return;
    
    if (historialEnvios.length === 0) {
        divHistorial.innerHTML = `<p style="color: #888;">No hay envíos en cola.</p>`;
        return;
    }

    divHistorial.innerHTML = "";
    historialEnvios.forEach(h => {
        divHistorial.innerHTML += `
            <div class="card-sms">
                <small>⏰ ${h.fecha}</small><br>
                <strong>📢 ${h.campana}</strong><br>
                <small>Paciente: ${h.ciudadano} (${h.zona})</small>
                <p class="txt-msg">"${h.mensaje}"</p>
                <a href="${h.link}" target="_blank" class="btn-wa-link">
                    🟢 Enviar por WhatsApp
                </a>
            </div>
        `;
    });
}

function reiniciarHistorial() {
    if (confirm("¿Estás seguro de limpiar todo el historial de envíos para la demostración?")) {
        historialEnvios = []; // Vaciamos el arreglo
        localStorage.removeItem("crm_historial"); // Lo borramos del disco del navegador
        actualizarHistorialHtml(); // Refrescamos la interfaz
        alert("♻️ Historial reseteado con éxito.");
    }
}

window.onload = function() {
    cargarCiudadanos();
    actualizarHistorialHtml();
};