// ==================== ADMINISTRACIÓN LPA ====================

// Inicializar usuarios
const users = JSON.parse(localStorage.getItem("usuarios")) || [
  { usuario: "lorram", contraseña: "1234", rol: "super_admin" },
  { usuario: "gleon", contraseña: "5678", rol: "admin" },
];

function guardarUsuarios() {
  localStorage.setItem("usuarios", JSON.stringify(users));
}

function renderUsuarios() {
  const list = document.getElementById("userList");
  if (!list) return;
  list.innerHTML = users
    .map(
      (u, i) =>
        `<li><b>${u.usuario}</b> — ${u.rol}
         <button onclick="eliminarUsuario(${i})" class="delete-btn">🗑️</button></li>`
    )
    .join("");
}

document.getElementById("userForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const usuario = document.getElementById("newUser").value.trim();
  const contraseña = document.getElementById("newPassword").value.trim();
  const rol = document.getElementById("newRole").value;
  if (!usuario || !contraseña) return;

  users.push({ usuario, contraseña, rol });
  guardarUsuarios();
  renderUsuarios();
  document.getElementById("userMessage").textContent = "✅ Usuario creado";
  e.target.reset();
});

function eliminarUsuario(index) {
  users.splice(index, 1);
  guardarUsuarios();
  renderUsuarios();
}

// ==================== TAREAS ====================

function renderAllTasks() {
  const tasks = JSON.parse(localStorage.getItem("tareas")) || [];
  const container = document.getElementById("allTasks");
  if (!container) return;

  container.innerHTML = tasks.length
    ? tasks
        .map(
          (t) => `
      <div class="task-item">
        <h4>${t.titulo}</h4>
        <p>${t.descripcion}</p>
        <small>
          <b>Asignado a:</b> ${t.asignado} | 
          <b>Por:</b> ${t.creado_por} |
          <b>Estado:</b> ${t.estado} |
          <b>Fecha límite:</b> ${t.fecha_limite || "Sin definir"}
        </small>
      </div>`
        )
        .join("")
    : "<p>No hay tareas registradas.</p>";

  actualizarGraficos(tasks);
}

// ==================== GRÁFICOS ====================

let globalChart;
let pendingChart;

function actualizarGraficos(tasks) {
  const estados = { finalizadas: 0, pendientes: 0, aprobacion: 0 };
  const pendientesPorUsuario = {};

  tasks.forEach((t) => {
    if (t.estado === "finalizada") estados.finalizadas++;
    else if (t.estado === "pendiente") estados.pendientes++;
    else if (t.estado === "en_aprobacion") estados.aprobacion++;

    if (t.estado === "pendiente") {
      pendientesPorUsuario[t.asignado] =
        (pendientesPorUsuario[t.asignado] || 0) + 1;
    }
  });

  // --- Gráfico circular ---
  const ctx1 = document.getElementById("globalTasksChart").getContext("2d");
  if (globalChart) globalChart.destroy();
  globalChart = new Chart(ctx1, {
    type: "doughnut",
    data: {
      labels: ["Finalizadas", "Pendientes", "En aprobación"],
      datasets: [
        {
          data: [
            estados.finalizadas,
            estados.pendientes,
            estados.aprobacion,
          ],
          backgroundColor: ["#4CAF50", "#FFC107", "#FF7043"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
      onClick: (evt, activeEls) => {
        if (activeEls[0]?.index === 1) {
          renderGraficoPendientes(pendientesPorUsuario);
        }
      },
    },
  });

  renderGraficoPendientes(pendientesPorUsuario);
}

function renderGraficoPendientes(pendientesPorUsuario) {
  const ctx2 = document.getElementById("pendingUsersChart").getContext("2d");
  if (pendingChart) pendingChart.destroy();

  const labels = Object.keys(pendientesPorUsuario);
  const values = Object.values(pendientesPorUsuario);

  pendingChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Tareas Pendientes",
          data: values,
          backgroundColor: "#c4332a",
        },
      ],
    },
    options: {
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true } },
    },
  });
}

// ==================== INICIALIZACIÓN ====================

document.addEventListener("DOMContentLoaded", () => {
  renderUsuarios();
  renderAllTasks();
});
