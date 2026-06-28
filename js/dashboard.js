// ====================
// SEGURIDAD Y USUARIO
// ====================
const role = localStorage.getItem("role");
const currentUser = localStorage.getItem("currentUser");

document.addEventListener("DOMContentLoaded", () => {
    inicializarDashboard();
});

function inicializarDashboard() {

    mostrarDatosUsuario();
    controlarRoles();
    cargarContadores();
    generarInventarioCritico();
    cargarDashboardERP();

}

// ====================
// DATOS DEL USUARIO
// ====================

function mostrarDatosUsuario() {

    const user = document.getElementById("currentUser");
    const rol = document.getElementById("userRole");

    if (user) {
        user.textContent = currentUser || "Invitado";
    }

    if (rol) {
        rol.textContent = role || "Usuario";
    }

}

// ====================
// CONTROL DE ROLES
// ====================

function ocultar(id) {

    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.style.display = "none";
    }

}

function controlarRoles() {

    switch (role) {

        case "logistica":
            ocultar("menuPacientes");
            break;

        case "rrhh":
            ocultar("menuInventario");
            break;

        case "director":
            ocultar("menuPacientes");
            ocultar("menuInventario");
            break;

        case "user":
            ocultar("menuPacientes");
            ocultar("menuInventario");
            break;

        case "admin":
        default:
            // Acceso completo
            break;

    }

}

// ====================
// NAVEGACIÓN
// ====================

function goCRM() {
    window.location.href = "templates/crm.html";
}

function goERP() {
    window.location.href = "templates/ERP.html";
}

// ====================
// CERRAR SESIÓN
// ====================

function logout() {

    if (confirm("¿Desea cerrar sesión?")) {

        localStorage.removeItem("session");
        window.location.href = "index.html";

    }

}

// ====================
// CONTADORES
// ====================

function cargarContadores() {

    actualizarContador("clientes", "clientesCount");
    actualizarContador("productos", "productosCount");
    actualizarContador("citas", "citasCount");
    actualizarContador("personal", "personalCount");

}

function actualizarContador(storage, id) {

    const datos = JSON.parse(localStorage.getItem(storage)) || [];
    const elemento = document.getElementById(id);

    if (elemento) {

        elemento.textContent = datos.length;

    }

}

// ====================
// INVENTARIO CRÍTICO GENERAL
// ====================

function generarInventarioCritico() {

    const lista = document.getElementById("inventarioCritico");

    if (!lista) return;

    const productos =
        JSON.parse(localStorage.getItem("productos")) || [];

    const criticos =
        productos.filter(p => Number(p.stock) <= 10);

    lista.innerHTML = "";

    criticos.forEach(producto => {

        lista.innerHTML += `
            <li>
                ${producto.nombre} - ${producto.stock} unidades
            </li>
        `;

    });

}

// ====================
// DASHBOARD ERP
// ====================

function cargarDashboardERP() {

    let inventario =
        JSON.parse(localStorage.getItem("inventarioERP")) || [];

    const productosCount =
        document.getElementById("productosCount");

    if (productosCount) {
        productosCount.innerText = inventario.length;
    }

    let criticos = 0;
    let regulares = 0;
    let optimos = 0;

    let listaCriticos =
        document.getElementById("inventarioCritico");

    if (listaCriticos) {
        listaCriticos.innerHTML = "";
    }

    inventario.forEach(item => {

        const stock = Number(item.stock);

        if (stock <= 100) {

            criticos++;

            if (listaCriticos) {

                listaCriticos.innerHTML += `
                    <li>
                        ${item.nombre} - ${stock} unidades
                    </li>
                `;

            }

        } else if (stock <= 500) {

            regulares++;

        } else {

            optimos++;

        }

    });

    const total = criticos + regulares + optimos;

    actualizarTexto("totalCriticos", criticos);
    actualizarTexto("totalRegulares", regulares);
    actualizarTexto("totalOptimos", optimos);
    actualizarTexto("totalInventario", total);

    const pCritico =
        total > 0 ? ((criticos / total) * 100).toFixed(0) : 0;

    const pRegular =
        total > 0 ? ((regulares / total) * 100).toFixed(0) : 0;

    const pOptimo =
        total > 0 ? ((optimos / total) * 100).toFixed(0) : 0;

    actualizarTexto("porcentajeCritico", pCritico + "%");
    actualizarTexto("porcentajeRegular", pRegular + "%");
    actualizarTexto("porcentajeOptimo", pOptimo + "%");

    actualizarBarra("barraCritico", pCritico);
    actualizarBarra("barraRegular", pRegular);
    actualizarBarra("barraOptimo", pOptimo);

    cargarNoticiasERP(inventario);

}

// ====================
// NOTICIAS ERP
// ====================

function cargarNoticiasERP(inventario) {

    const noticias =
        document.getElementById("noticiasERP");

    if (!noticias) return;

    noticias.innerHTML = "";

    inventario
        .slice(-5)
        .reverse()
        .forEach(item => {

            noticias.innerHTML += `
                <div class="news-card">
                    📦 <strong>${item.nombre}</strong><br>
                    Stock: ${item.stock}<br>
                    Estado: ${item.estado || "Sin estado"}
                </div>
            `;

        });

}

// ====================
// FUNCIONES AUXILIARES
// ====================

function actualizarTexto(id, valor) {

    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.innerText = valor;
    }

}

function actualizarBarra(id, porcentaje) {

    const barra = document.getElementById(id);

    if (barra) {
        barra.style.width = porcentaje + "%";
    }

}
const API_URL = "https://script.google.com/macros/s/AKfycbyzV7ioEo8ag5EXziEJfrtxJJ62IZmr1baoURMOSJOM4VpFwufR9czCKo4HrDypyU-GKA/exec";

let ultimasBusquedas = [];

async function buscarPaciente() {
    const input = document.getElementById("buscador").value.trim();
    const contenedor = document.getElementById("resultadosBuscador");
    
    if (input.length === 0) {
        contenedor.style.display = "none";
        contenedor.innerHTML = "";
        return;
    }
    // ❌ si está vacío → mostrar últimas búsquedas
    if (input === "") {
        mostrarUltimasBusquedas();
        return;
    }

    try {
        const res = await fetch(`${API_URL}?q=${encodeURIComponent(input)}`);
        const data = await res.json();

        contenedor.innerHTML = "";

        if (data.length === 0) {
            contenedor.innerHTML = "<div class='resultado-item'>No se encontraron pacientes</div>";
            contenedor.style.display = "block";
            return;
        }

        data.forEach(p => {
            const div = document.createElement("div");
            div.classList.add("resultado-item");

            div.innerHTML = `
                <strong>${p.nombre}</strong>
                <small>DNI: ${p.dni}</small>
                <small>Tel: ${p.telefono}</small>
            `;

            div.onclick = () => seleccionarPaciente(p);

            contenedor.appendChild(div);
        });

        contenedor.style.display = "block";

    } catch (error) {
        console.error(error);
    }
}

function seleccionarPaciente(paciente) {
    document.getElementById("buscador").value = paciente.nombre;
    document.getElementById("resultadosBuscador").style.display = "none";

    // 🧠 guardar historial (evitar duplicados)
    ultimasBusquedas = ultimasBusquedas.filter(p => p.dni !== paciente.dni);
    ultimasBusquedas.unshift(paciente);

    // máximo 5
    if (ultimasBusquedas.length > 5) {
        ultimasBusquedas.pop();
    }

    console.log("Paciente seleccionado:", paciente);
}

function mostrarUltimasBusquedas() {
    const contenedor = document.getElementById("resultadosBuscador");
    contenedor.innerHTML = "";

    if (ultimasBusquedas.length === 0) {
        contenedor.innerHTML = "<div class='resultado-item'>Escribe para buscar pacientes...</div>";
        contenedor.style.display = "block";
        return;
    }

    ultimasBusquedas.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("resultado-item");

        div.innerHTML = `
            <strong>🕘 ${p.nombre}</strong>
            <small>DNI: ${p.dni}</small>
        `;

        div.onclick = () => seleccionarPaciente(p);

        contenedor.appendChild(div);
    });

    contenedor.style.display = "block";
}