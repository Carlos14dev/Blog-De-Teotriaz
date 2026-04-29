/* ============================================
   CRUD COMPLETO CON FETCH - TEORIAS CONSPIRATIVAS
   Blog de conspiraciones - Gestion de teorias
   ============================================ */

const API_URL = 'http://localhost:3000/api/teorias';

let teorias = [];
let modoEdicion = false;
let editandoId = null;

// ========== FUNCIONES CRUD ==========

async function obtenerTeorias() {
    try {
        const respuesta = await fetch(API_URL);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        const data = await respuesta.json();
        
        teorias = data.map(t => ({
            ...t,
            id: t.id || t._id,
            _id: t._id
        }));
        
        renderizarTabla();
        mostrarMensaje(`${teorias.length} teorias cargadas`, 'exito');
        
    } catch (error) {
        mostrarMensaje('Error al obtener teorias: ' + error.message, 'error');
        console.error('GET Error:', error);
    }
}

async function crearTeoria(teoria) {
    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(teoria)
        });
        
        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.error || `Error HTTP: ${respuesta.status}`);
        }
        
        const nuevaTeoria = await respuesta.json();
        
        teorias.unshift({
            ...nuevaTeoria,
            id: nuevaTeoria.id || nuevaTeoria._id,
            _id: nuevaTeoria._id
        });
        
        renderizarTabla();
        mostrarMensaje(`Teoria "${teoria.nombre}" creada (ID: ${nuevaTeoria.id})`, 'exito');
        
    } catch (error) {
        mostrarMensaje('Error al crear teoria: ' + error.message, 'error');
        console.error('POST Error:', error);
    }
}

async function actualizarTeoria(id, teoriaActualizada) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(teoriaActualizada)
        });
        
        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.error || `Error HTTP: ${respuesta.status}`);
        }
        
        const teoriaDelServidor = await respuesta.json();
        
        const index = teorias.findIndex(t => 
            t._id === id || t.id === id || t.id === parseInt(id)
        );
        
        if (index !== -1) {
            teorias[index] = {
                ...teoriaDelServidor,
                id: teoriaDelServidor.id || teoriaDelServidor._id,
                _id: teoriaDelServidor._id
            };
            renderizarTabla();
        }
        
        mostrarMensaje(`Teoria "${teoriaActualizada.nombre}" actualizada`, 'exito');
        
    } catch (error) {
        mostrarMensaje('Error al actualizar: ' + error.message, 'error');
        console.error('PUT Error:', error);
    }
}

async function eliminarTeoria(id, nombreTeoria) {
    if (!confirm(`Eliminar "${nombreTeoria}"?`)) {
        return;
    }
    
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!respuesta.ok && respuesta.status !== 200) {
            const error = await respuesta.json();
            throw new Error(error.error || `Error HTTP: ${respuesta.status}`);
        }
        
        teorias = teorias.filter(t => 
            t._id !== id && t.id !== id && t.id !== parseInt(id)
        );
        
        renderizarTabla();
        mostrarMensaje(`"${nombreTeoria}" eliminada`, 'exito');
        
        if (modoEdicion && (editandoId === id || editandoId === id.toString() || editandoId === parseInt(id))) {
            cancelarEdicion();
        }
        
    } catch (error) {
        mostrarMensaje('Error al eliminar: ' + error.message, 'error');
        console.error('DELETE Error:', error);
    }
}

// ========== FUNCIONES DE UI ==========

function renderizarTabla() {
    const tbody = document.getElementById('cuerpoTabla');
    
    if (!tbody) {
        console.error('No se encontro el elemento cuerpoTabla');
        return;
    }
    
    if (teorias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px;">No hay teorias registradas</td></tr>';
        return;
    }
    
    tbody.innerHTML = teorias.map(teoria => {
        const credibilidad = teoria.porcentajeCredibilidad || 0;
        const idMostrar = teoria.id || teoria._id;
        
        return `
        <tr>
            <td>#${idMostrar}</td>
            <td><strong>${escapeHtml(teoria.nombre)}</strong></td>
            <td>${credibilidad}%</td>
            <td>${escapeHtml(teoria.categoria || 'Sin clasificar')}</td>
            <td>${teoria.añoOrigen || '???'}</td>
            <td>${escapeHtml(teoria.estadoVigencia || 'Desconocido')}</td>
            <td>${escapeHtml(teoria.descripcion ? teoria.descripcion.substring(0, 80) : 'Sin descripcion')}${teoria.descripcion && teoria.descripcion.length > 80 ? '...' : ''}</td>
            <td>
                <button onclick="editarTeoria('${teoria._id || teoria.id}')" class="btn-editar">Editar</button>
                <button onclick="eliminarTeoria('${teoria._id || teoria.id}', '${escapeHtml(teoria.nombre)}')" class="btn-eliminar">Eliminar</button>
            </td>
        </tr>
    `}).join('');
}

function editarTeoria(id) {
    const teoria = teorias.find(t => 
        t._id === id || t.id === id || t.id === parseInt(id)
    );
    
    if (!teoria) {
        mostrarMensaje('Teoria no encontrada', 'error');
        return;
    }
    
    modoEdicion = true;
    editandoId = teoria._id || teoria.id;
    
    document.getElementById('teoriaId').value = teoria.id || teoria._id;
    document.getElementById('nombre').value = teoria.nombre;
    document.getElementById('porcentajeCredibilidad').value = teoria.porcentajeCredibilidad || 0;
    document.getElementById('categoria').value = teoria.categoria || '';
    document.getElementById('añoOrigen').value = teoria.añoOrigen || '';
    document.getElementById('estadoVigencia').value = teoria.estadoVigencia || 'En investigacion';
    document.getElementById('descripcion').value = teoria.descripcion || '';
    
    document.getElementById('formTitulo').textContent = 'Editar Teoria';
    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.textContent = 'Actualizar';
    document.getElementById('btnCancelar').style.display = 'inline-block';
    
    document.querySelector('.formulario-card').scrollIntoView({ behavior: 'smooth' });
    mostrarMensaje(`Editando: ${teoria.nombre}`, 'info');
}

function cancelarEdicion() {
    modoEdicion = false;
    editandoId = null;
    
    document.getElementById('teoriaForm').reset();
    document.getElementById('teoriaId').value = '';
    
    document.getElementById('formTitulo').textContent = 'Nueva Teoria';
    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.textContent = 'Guardar';
    document.getElementById('btnCancelar').style.display = 'none';
}

function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    if (!mensajeDiv) return;
    
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje mensaje-${tipo}`;
    mensajeDiv.style.display = 'block';
    
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 4000);
}

function escapeHtml(texto) {
    if (!texto) return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ========== MANEJADOR DEL FORMULARIO ==========
async function manejarSubmit(event) {
    event.preventDefault();
    
    const teoria = {
        nombre: document.getElementById('nombre').value.trim(),
        porcentajeCredibilidad: parseInt(document.getElementById('porcentajeCredibilidad').value) || 0,
        categoria: document.getElementById('categoria').value.trim(),
        añoOrigen: parseInt(document.getElementById('añoOrigen').value) || new Date().getFullYear(),
        estadoVigencia: document.getElementById('estadoVigencia').value,
        descripcion: document.getElementById('descripcion').value.trim()
    };
    
    if (!teoria.nombre) {
        mostrarMensaje('El nombre es obligatorio', 'error');
        return;
    }
    
    if (!teoria.descripcion) {
        mostrarMensaje('La descripcion es obligatoria', 'error');
        return;
    }
    
    if (teoria.porcentajeCredibilidad < 0 || teoria.porcentajeCredibilidad > 100) {
        mostrarMensaje('El porcentaje debe estar entre 0 y 100', 'error');
        return;
    }
    
    const btnGuardar = document.getElementById('btnGuardar');
    const textoOriginal = btnGuardar.textContent;
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Procesando...';
    
    try {
        if (modoEdicion && editandoId) {
            await actualizarTeoria(editandoId, teoria);
            cancelarEdicion();
        } else {
            await crearTeoria(teoria);
            document.getElementById('teoriaForm').reset();
            document.getElementById('estadoVigencia').value = 'En investigacion';
        }
    } catch (error) {
        mostrarMensaje('Error: ' + error.message, 'error');
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
    }
}

// ========== FUNCIONES DE BUSQUEDA Y FILTROS ==========

async function buscarTeorias() {
    const texto = document.getElementById('busqueda').value.trim().toLowerCase();
    
    if (!texto) {
        obtenerTeorias();
        return;
    }
    
    try {
        const respuesta = await fetch(API_URL);
        const data = await respuesta.json();
        
        teorias = data
            .map(t => ({ ...t, _id: t._id, id: t.id || t._id }))
            .filter(t => 
                t.nombre.toLowerCase().includes(texto) ||
                t.descripcion.toLowerCase().includes(texto) ||
                t.categoria.toLowerCase().includes(texto)
            );
        
        renderizarTabla();
        mostrarMensaje(`Encontradas ${teorias.length} teorias`, 'info');
    } catch (error) {
        mostrarMensaje('Error en busqueda: ' + error.message, 'error');
    }
}

async function filtrarPorEstado(estado) {
    try {
        const respuesta = await fetch(`${API_URL}/filtro/estado/${estado}`);
        const data = await respuesta.json();
        
        teorias = data.map(t => ({ ...t, _id: t._id, id: t.id || t._id }));
        renderizarTabla();
        mostrarMensaje(`${teorias.length} teorias con estado "${estado}"`, 'info');
    } catch (error) {
        mostrarMensaje('Error al filtrar: ' + error.message, 'error');
    }
}

async function filtrarPorCategoria(categoria) {
    try {
        const respuesta = await fetch(`${API_URL}/filtro/categoria/${categoria}`);
        const data = await respuesta.json();
        
        teorias = data.map(t => ({ ...t, _id: t._id, id: t.id || t._id }));
        renderizarTabla();
        mostrarMensaje(`${teorias.length} teorias en categoria "${categoria}"`, 'info');
    } catch (error) {
        mostrarMensaje('Error al filtrar: ' + error.message, 'error');
    }
}

// ========== EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('teoriaForm');
    const btnCancelar = document.getElementById('btnCancelar');
    const btnBuscar = document.getElementById('btnBuscar');
    const inputBusqueda = document.getElementById('busqueda');
    
    if (form) {
        form.addEventListener('submit', manejarSubmit);
    }
    
    if (btnCancelar) {
        btnCancelar.addEventListener('click', cancelarEdicion);
    }
    
    if (btnBuscar) {
        btnBuscar.addEventListener('click', buscarTeorias);
    }
    
    if (inputBusqueda) {
        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                buscarTeorias();
            }
        });
    }
    
    window.editarTeoria = editarTeoria;
    window.eliminarTeoria = eliminarTeoria;
    window.filtrarPorEstado = filtrarPorEstado;
    window.filtrarPorCategoria = filtrarPorCategoria;
    
    obtenerTeorias();
});