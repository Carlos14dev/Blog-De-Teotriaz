const API_URL = 'https://mi-backendteoriaz.onrender.com/api/teorias';

let teorias = [];
let modoEdicion = false;
let editandoId = null;

// ========== UTILIDAD SEGURA ==========
function $(id) {
    return document.getElementById(id);
}

// ========== CRUD ==========
async function obtenerTeorias() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

        const data = await respuesta.json();

        teorias = data.map(t => ({
            ...t,
            id: t.id || t._id,
            _id: t._id
        }));

        renderizarTabla();
        mostrarMensaje(`${teorias.length} teorías cargadas`, 'exito');

    } catch (error) {
        mostrarMensaje('Error al obtener teorías: ' + error.message, 'error');
        console.error(error);
    }
}

async function crearTeoria(teoria) {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teoria)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const nueva = await res.json();

        teorias.unshift({
            ...nueva,
            id: nueva.id || nueva._id,
            _id: nueva._id
        });

        renderizarTabla();
        mostrarMensaje(`Teoría "${teoria.nombre}" creada`, 'exito');

    } catch (e) {
        mostrarMensaje('Error al crear: ' + e.message, 'error');
    }
}

async function actualizarTeoria(id, teoria) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(teoria)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const index = teorias.findIndex(t =>
            t._id == id || t.id == id
        );

        if (index !== -1) teorias[index] = data;

        renderizarTabla();
        mostrarMensaje('Teoría actualizada', 'exito');

    } catch (e) {
        mostrarMensaje('Error al actualizar: ' + e.message, 'error');
    }
}

async function eliminarTeoria(id, nombre) {
    if (!confirm(`Eliminar "${nombre}"?`)) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        teorias = teorias.filter(t => t._id != id && t.id != id);

        renderizarTabla();
        mostrarMensaje(`"${nombre}" eliminada`, 'exito');

    } catch (e) {
        mostrarMensaje('Error al eliminar: ' + e.message, 'error');
    }
}

// ========== UI ==========
function renderizarTabla() {
    const tbody = $('cuerpoTabla');
    if (!tbody) return;

    if (teorias.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">Sin datos</td></tr>`;
        return;
    }

    tbody.innerHTML = teorias.map(t => `
        <tr>
            <td>${t.id}</td>
            <td>${escapeHtml(t.nombre)}</td>
            <td>${t.porcentajeCredibilidad}%</td>
            <td>${escapeHtml(t.categoria)}</td>
            <td>${t.añoOrigen}</td>
            <td>${escapeHtml(t.estadoVigencia)}</td>
            <td>${escapeHtml(t.descripcion)}</td>
            <td>
                <button onclick="editarTeoria('${t._id}')">Editar</button>
                <button onclick="eliminarTeoria('${t._id}','${escapeHtml(t.nombre)}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

function editarTeoria(id) {
    const t = teorias.find(x => x._id == id || x.id == id);
    if (!t) return;

    modoEdicion = true;
    editandoId = id;

    $('nombre').value = t.nombre;
    $('porcentajeCredibilidad').value = t.porcentajeCredibilidad;
    $('categoria').value = t.categoria;
    $('añoOrigen').value = t.añoOrigen;
    $('estadoVigencia').value = t.estadoVigencia;
    $('descripcion').value = t.descripcion;

    mostrarMensaje(`Editando ${t.nombre}`, 'info');
}

function cancelarEdicion() {
    modoEdicion = false;
    editandoId = null;

    const form = $('teoriaForm');
    if (form) form.reset();
}

function mostrarMensaje(txt, tipo) {
    const m = $('mensaje');
    if (!m) return;

    m.textContent = txt;
    m.style.display = 'block';

    setTimeout(() => m.style.display = 'none', 3000);
}

function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ========== FORM ==========
async function manejarSubmit(e) {
    e.preventDefault();

    const teoria = {
        nombre: $('nombre').value.trim(),
        porcentajeCredibilidad: parseInt($('porcentajeCredibilidad').value) || 0,
        categoria: $('categoria').value.trim(),
        añoOrigen: parseInt($('añoOrigen').value),
        estadoVigencia: $('estadoVigencia').value,
        descripcion: $('descripcion').value.trim()
    };

    if (!teoria.nombre || !teoria.descripcion) {
        mostrarMensaje('Campos obligatorios', 'error');
        return;
    }

    if (modoEdicion) {
        await actualizarTeoria(editandoId, teoria);
        cancelarEdicion();
    } else {
        await crearTeoria(teoria);
        $('teoriaForm').reset();
    }
}

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {

    const form = $('teoriaForm');
    if (form) form.addEventListener('submit', manejarSubmit);

    window.editarTeoria = editarTeoria;
    window.eliminarTeoria = eliminarTeoria;

    obtenerTeorias();
});