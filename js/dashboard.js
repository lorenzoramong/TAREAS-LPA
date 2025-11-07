/* =========================================================
   DASHBOARD PRINCIPAL - TAREAS LPA
   ========================================================= */

// Verificar si hay sesión activa
const usuarioActivo = JSON.parse(localStorage.getItem("usuario"));
if (!usuarioActivo) {
  window.location.href = "index.html";
}

// Mostrar nombre del usuario en el header
document.getElementById("userName").textContent = usuarioActivo.nombre;

// Obtener referencias a las listas
const listaTareasActivas = document.getElementById("listaTareasActivas");
const listaTareasEnviadas = document.getElementById("listaTareasEnviadas");
const listaTareasFinalizadas = document.getElementById("listaTareasFinalizadas");
const listaPendientesAprobacion = document.getElementById("listaPendientesAprobacion");
const listaTareasPorConfirmar = document.getElementById("listaTareasPorConfirmar");

// Datos de ejemplo
let tareas = [
  {
    id: 1,
    titulo: "Actualizar documentos del club",
    descripcion: "Subir papelería al drive institucional.",
    asignado: "guillo",
    creado_por: "david",
    fecha_limite: "2025-11-15",
    estado: "Pendiente"
  },
  {
    id: 2,
    titulo: "Revisión de reportes mensuales",
    descripcion: "Revisar y aprobar reportes de noviembre.",
    asignado: "david",
    creado_por: "guillo",
    fecha_limite: "2025-11-10",
    estado: "Finalizada (por confirmar)"
  }
];

// =========================================================
// Función para renderizar las tareas
// =========================================================
function renderTareas() {
  const tareasAsignadas = tareas.filter(t => t.asignado === usuarioActivo.usuario);
  const tareasCreadas = tareas.filter(t => t.creado_por === usuarioActivo.usuario);
  const tareasFinalizadas = tareas.filter(t => t.estado === "Finalizada (aprobada)");
  const pendientesAprobacion = tareas.filter(t => t.estado === "Pendiente de aprobación");
  const porConfirmar = tareas.filter(t => t.estado === "Finalizada (por confirmar)" && t.creado_por === usuarioActivo.usuario);

  const generarHTML = (arr) =>
    arr
      .map(
        (t) => `
        <div class="tarea-item">
          <h4>${t.titulo}</h4>
          <p>${t.descripcion}</p>
          <small>Asignado a: <b>${t.asignado}</b> | Fecha límite: ${t.fecha_limite}</small>
          <small>Estado: <b>${t.estado}</b></small>
        </div>
      `
      )
      .join("");

  listaTareasActivas.innerHTML = generarHTML(tareasAsignadas);
  listaTareasEnviadas.innerHTML = generarHTML(tareasCreadas);
  listaTareasFinalizadas.innerHTML = generarHTML(tareasFinalizadas);
  listaPendientesAprobacion.innerHTML = generarHTML(pendientesAprobacion);
  listaTareasPorConfirmar.innerHTML = generarHTML(porConfirmar);
}

// Render inicial
renderTareas();

// =========================================================
// Logout manual
// =========================================================
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "index.html";
});
