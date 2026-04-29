document.addEventListener("DOMContentLoaded", function () {

    // ================= FORMULARIO =================
    let formulario = document.getElementById("formulario");

    if (formulario) {
        formulario.addEventListener("submit", function (e) {
            e.preventDefault();

            let nombre = document.getElementById("nombre")?.value || "";
            let correo = document.getElementById("email")?.value || "";
            let telefono = document.getElementById("telefono")?.value || "";
            let mensaje = document.getElementById("mensaje");

            if (mensaje) {
                if (nombre === "" || correo === "" || telefono === "") {
                    mensaje.textContent = "Todos los campos son obligatorios";
                } else if (!correo.includes("@")) {
                    mensaje.textContent = "Correo inválido";
                } else {
                    mensaje.textContent = "Formulario enviado correctamente";
                }
            }

            console.log("Nombre:", nombre);
            console.log("Correo:", correo);
            console.log("Telefono:", telefono);
        });
    }

    // ================= MODO OSCURO =================
    function cambiarModo() {
        const body = document.body;
        const boton = document.getElementById("botonModo");

        if (!boton) return;

        if (body.classList.contains("claro")) {
            body.classList.remove("claro");
            boton.textContent = "Tomar Pastilla Azul";
            localStorage.setItem("modo", "oscuro");
        } else {
            body.classList.add("claro");
            boton.textContent = "Tomar Pastilla Roja";
            localStorage.setItem("modo", "claro");
        }
    }

    window.cambiarModo = cambiarModo;

    function cargarModoGuardado() {
        const modoGuardado = localStorage.getItem("modo");
        const body = document.body;
        const boton = document.getElementById("botonModo");

        if (modoGuardado === "claro") {
            body.classList.add("claro");
            if (boton) boton.textContent = "Tomar Pastilla Azul";
        } else {
            body.classList.remove("claro");
            if (boton) boton.textContent = "Tomar Pastilla Roja";
        }
    }

    cargarModoGuardado();

    // ================= CONTADOR CHECKBOX =================
    let contadorElemento = document.getElementById('contadorRespuestas');

    if (contadorElemento) {
        function actualizarContador() {
            let total = document.querySelectorAll("input[type='checkbox']:checked").length;
            contadorElemento.textContent = `Respuestas seleccionadas: ${total}`;
        }

        document.querySelectorAll("input[type='checkbox']").forEach(c => {
            c.addEventListener("change", actualizarContador);
        });

        actualizarContador();
    }

    // ================= BOTÓN ARRIBA =================
    let btn = document.getElementById("arriba");

    if (btn) {
        window.addEventListener("scroll", function () {
            btn.style.display = (document.documentElement.scrollTop > 200) ? "block" : "none";
        });

        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // ================= CARRUSEL =================
    let indiceActual = 0;
    const tarjetas = document.querySelectorAll('.contenedor .tarjeta');

    function mostrarTarjeta(indice) {
        tarjetas.forEach((t, i) => {
            t.style.display = (i === indice) ? 'block' : 'none';
        });
    }

    if (tarjetas.length > 0) {
        mostrarTarjeta(0);

        setInterval(() => {
            indiceActual = (indiceActual + 1) % tarjetas.length;
            mostrarTarjeta(indiceActual);
        }, 5000);
    }

    let btnSiguiente = document.getElementById('siguiente');
    let btnAnterior = document.getElementById('anterior');

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

    // ================= LINKS EXTERNOS =================
    document.querySelectorAll("a[href^='http']").forEach(link => {
        link.addEventListener("click", function (e) {
            if (!confirm("¿Deseas salir de la página?")) {
                e.preventDefault();
            }
        });
    });

    // ================= LIKE =================
    document.querySelectorAll(".like-btn").forEach(boton => {
        boton.addEventListener("click", function () {
            let contadorSpan = this.nextElementSibling;
            let nuevoContador = parseInt(contadorSpan.textContent) + 1;
            contadorSpan.textContent = nuevoContador;

            let fila = this.closest('tr');
            let titulo = fila?.cells[0]?.textContent;

            if (titulo) {
                localStorage.setItem('like_' + titulo, nuevoContador);
            }
        });
    });

    document.querySelectorAll('tbody tr').forEach(fila => {
        let titulo = fila.cells[0]?.textContent;
        let likeGuardados = localStorage.getItem('like_' + titulo);

        if (likeGuardados) {
            let span = fila.querySelector('.like-count');
            if (span) span.textContent = likeGuardados;
        }
    });

});