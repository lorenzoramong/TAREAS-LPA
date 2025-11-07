// ================== DASHBOARD JS ==================
document.addEventListener("DOMContentLoaded", () => {
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".section");
  const user = localStorage.getItem("usuarioActivo");
  const usuario = JSON.parse(user);
  const nombre = document.getElementById("nombreUsuario");
  nombre.textContent = usuario?.usuario || "Usuario";

  // Mostrar opciones admin si aplica
  if (usuario.rol === "super_admin" || usuario.rol === "admin") {
    document.querySelectorAll(".admin-only").forEach((el) => (el.style.display = "block"));
  }

  // Cambio de pestañas
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navButtons.forEach((b) => b.classList.remove("active"));
      sections.forEach((s) => s.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.section).classList.add("active");
    });
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
  });

  // ================== GRÁFICO PERSONAL ==================
  const ctx = document.getElementById("personalChart");
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  const misTareas = tareas.filter((t) => t.asignado === usuario.usuario);
  const finalizadas = misTareas.filter((t) => t.estado === "finalizada").length;
  const pendientes = misTareas.filter((t) => t.estado === "pendiente").length;

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Finalizadas", "Pendientes"],
      datasets: [
        {
          data: [finalizadas, pendientes],
          backgroundColor: ["#4CAF50", "#FFC107"],
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
});

