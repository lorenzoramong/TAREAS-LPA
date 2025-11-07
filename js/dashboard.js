document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Dashboard cargado correctamente");

  // ======= VARIABLES =======
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".section");
  const nombre = document.getElementById("nombreUsuario");
  const logoutBtn = document.getElementById("logoutBtn");

  // ======= USUARIO ACTIVO =======
  const usuarioData = localStorage.getItem("usuarioActivo");
  if (!usuarioData) {
    window.location.href = "index.html";
    return;
  }

  const usuario = JSON.parse(usuarioData);
  nombre.textContent = usuario.usuario;

  // ======= MOSTRAR BOTONES ADMIN =======
  if (usuario.rol === "super_admin" || usuario.rol === "admin") {
    document.querySelectorAll(".admin-only").forEach((el) => {
      el.style.display = "block";
    });
  }

  // ======= NAVEGACIÓN ENTRE SECCIONES =======
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetSection = btn.getAttribute("data-section");

      // Quitar 'active' a todos los botones y secciones
      navButtons.forEach((b) => b.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));

      // Activar la pestaña clickeada
      btn.classList.add("active");
      document.getElementById(targetSection).classList.add("active");
    });
  });

  // ======= CERRAR SESIÓN =======
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
  });

  // ======= CARGAR DATOS Y GRÁFICO =======
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  const misTareas = tareas.filter((t) => t.asignado === usuario.usuario);
  const finalizadas = misTareas.filter((t) => t.estado === "finalizada").length;
  const pendientes = misTareas.filter((t) => t.estado === "pendiente").length;

  const ctx = document.getElementById("personalChart");
  if (ctx) {
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Finalizadas", "Pendientes"],
        datasets: [
          {
            data: [finalizadas, pendientes],
            backgroundColor: ["#4CAF50", "#FFC107"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: { legend: { position: "bottom" } },
      },
    });
  }

  // ======= LISTAS DE TAREAS =======
  const contenedorActivas = document.getElementById("listaTareasActivas");
  const contenedorEnviadas = document.getElementById("listaTareasEnviadas");
  const contenedorFinalizadas = document.getElementById("listaTareasFinalizadas");

  if (contenedorActivas && contenedorEnviadas && contenedorFinalizadas) {
    mostrarTareas();
  }

  function mostrarTareas() {
    contenedorActivas.innerHTML = "";
    contenedorEnviadas.innerHTML = "";
    contenedorFinalizadas.innerHTML = "";

    misTareas.forEach((tarea) => {
      const div = document.createElement("div");
      div.classList.add("tarea-item");
      div.innerHTML = `
        <strong>${tarea.titulo}</strong> — ${tarea.descripcion}
        <br><small>Estado: ${tarea.estado}</small>
      `;

      if (tarea.estado === "pendiente") {
        contenedorActivas.appendChild(div);
      } else if (tarea.estado === "finalizada") {
        contenedorFinalizadas.appendChild(div);
      } else {
        contenedorEnviadas.appendChild(div);
      }
    });

    if (contenedorActivas.innerHTML === "")
      contenedorActivas.innerHTML = "<p>No hay tareas asignadas.</p>";
    if (contenedorEnviadas.innerHTML === "")
      contenedorEnviadas.innerHTML = "<p>No hay tareas enviadas.</p>";
    if (contenedorFinalizadas.innerHTML === "")
      contenedorFinalizadas.innerHTML = "<p>No hay tareas finalizadas.</p>";
  }

  // ======= MENSAJE DE BIENVENIDA =======
  document.getElementById("resumenDatos").innerHTML = `
    <p><strong>${usuario.usuario}</strong>, tienes <b>${pendientes}</b> tareas pendientes y <b>${finalizadas}</b> finalizadas.</p>
  `;
});


