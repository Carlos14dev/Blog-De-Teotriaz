let formulario = document.getElementById("formulario");
if (formulario) {
    formulario.addEventListener("submit", function(e){
        e.preventDefault();

        let nombre = document.getElementById("nombre").value;
        let correo = document.getElementById("email").value;
        let telefono = document.getElementById("telefono").value;

        if(nombre === "" || correo === "" || telefono === ""){
            document.getElementById("mensaje").textContent = "Todos los campos son obligatorios";
        } else if(!correo.includes("@")){
            document.getElementById("mensaje").textContent = "Correo invalido";
        } else {
            document.getElementById("mensaje").textContent = "Formulario enviado correctamente";
        }
        console.log("Nombre: " + nombre);
        console.log("Correo: " + correo);
        console.log("Telefono: " + telefono);
    });
}


// Función para cambiar entre modo oscuro (por defecto) y modo claro
function cambiarModo() {
    const body = document.body;
    const boton = document.getElementById("botonModo");
    
    // Verificar si el body tiene la clase 'claro'
    if (body.classList.contains("claro")) {
        // Si tiene la clase, la quitamos (modo oscuro)
        body.classList.remove("claro");
        boton.textContent = "Tomar Pastilla Azul";
        // Guardar preferencia en localStorage
        localStorage.setItem("modo", "oscuro");
    } else {
        // Si no tiene la clase, la agregamos (modo claro)
        body.classList.add("claro");
        boton.textContent = "Tomar Pastilla Roja";
        // Guardar preferencia en localStorage
        localStorage.setItem("modo", "claro");
    }
}

// Al cargar la página, verificar si hay una preferencia guardada
function cargarModoGuardado() {
    const modoGuardado = localStorage.getItem("modo");
    const body = document.body;
    const boton = document.getElementById("botonModo");
    
    if (modoGuardado === "claro") {
        body.classList.add("claro");
        if (boton) boton.textContent = "Tomar Pastilla Azul";
    } else {
        // Por defecto, modo oscuro
        body.classList.remove("claro");
        if (boton) boton.textContent = "Tomar Pastilla Roja";
    }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarModoGuardado);

function agregar(){
let teoria = document.getElementById("teoria").value;
let lista = document.getElementById("lista");

let li = document.createElement("li");
li.textContent = teoria;

console.log("Teoría agregada: " + teoria);

lista.appendChild(li);
}

function cambiar(img){
    let seccion = img.closest('.teoria');
    let imagenPrincipal = seccion.querySelector('img:first-of-type');
    
    if (imagenPrincipal) {
        imagenPrincipal.src = img.src;
    }
}

let links = document.querySelectorAll("a[href*='http'], a[href*='https']");
    links.forEach(function(link) {
        link.addEventListener("click", function(e) {
        if (!confirm("¿Deseas salir de la página?")) {
            e.preventDefault();
        }
    });
});

// Reemplaza el bloque actual de checks por este:
let checks = document.querySelectorAll("input[type='checkbox']");
let contadorElemento = document.getElementById('contadorRespuestas'); // Asegúrate de tener este elemento en el HTML

if (contadorElemento) { // Solo ejecuta si el elemento existe (estás en formulario.html)
    function actualizarContador() {
        let total = document.querySelectorAll("input[type='checkbox']:checked").length;
        contadorElemento.textContent = `Respuestas seleccionadas: ${total}`;
    }

    checks.forEach(c => {
        c.addEventListener("change", actualizarContador);
    });
    
    // Llama la función al cargar para mostrar 0 inicialmente
    actualizarContador(); 
}

let btn = document.getElementById("arriba");
window.onscroll = function() {
    btn.style.display = (document.documentElement.scrollTop > 200) ? "block" : "none";
}

btn.onclick = function() {
    window.scrollTo({top: 0, behavior: "smooth"});
}

// CARRUSEL DE IMÁGENES - AGREGAR ESTO AL FINAL DEL ARCHIVO
let indiceActual = 0;
const tarjetas = document.querySelectorAll('.contenedor .tarjeta');

// Ocultar todas las imágenes excepto la primera
function mostrarTarjeta(indice) {
    tarjetas.forEach((t, i) => {
        if (i === indice) {
            t.style.display = 'block';
        } else {
            t.style.display = 'none';
        }
    });
}

// Botones de navegación
const btnSiguiente = document.getElementById('siguiente');
const btnAnterior = document.getElementById('anterior');

if (btnSiguiente) {
    btnSiguiente.addEventListener('click', () => {
        indiceActual = (indiceActual + 1) % tarjetas.length;
        mostrarTarjeta(indiceActual);
    });
}

if (btnAnterior) {
    btnAnterior.addEventListener('click', () => {
        indiceActual = (indiceActual - 1 + tarjetas.length) % tarjetas.length;
        mostrarTarjeta(indiceActual);
    });
}

// Cambio automático cada 5 segundos
setInterval(() => {
    if (tarjetas.length > 0) {
        indiceActual = (indiceActual + 1) % tarjetas.length;
        mostrarTarjeta(indiceActual);
    }
}, 5000);

// Mostrar la primera imagen al cargar
if (tarjetas.length > 0) {
    mostrarTarjeta(0);
}

document.querySelectorAll(".like-btn").forEach(buton => {
    buton.addEventListener("click", function() {
        let contadorSpan = this.nextElementSibling;
        let nuevoContador = parseInt(contadorSpan.textContent) + 1;
        contadorSpan.textContent = nuevoContador;

        let fila = this.closest('tr');
        let titulo = fila.cells[0].textContent;
        localStorage.setItem('like_' + titulo, nuevoContador);
    });
});

window.onload = function() {
    document.querySelectorAll('tbody tr').forEach(fila => {
        let titulo = fila.cells[0].textContent; 
        let likeGuardados = localStorage.getItem('like_' + titulo);
        if (likeGuardados) {
            fila.querySelector('.like-count').textContent = likeGuardados;
        }
    });
}   