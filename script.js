// URL pública del Apps Script (asegurate de que termine en /exec)
const API_URL = "https://script.google.com/macros/s/AKfycbyNuN89FmoLohAwlqhaDulV6tNr6dXhkYEFxTo1iK5I09H-trylUGxHoKS-NqE28eCd/exec";

// Manejador del formulario de inicio de sesión
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("username").value.trim();
  const contraseña = document.getElementById("password").value.trim();
  const message = document.getElementById("loginMessage");

  message.textContent = "Verificando credenciales...";
  message.style.color = "gray";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow", // sigue redirecciones internas de Google
      body: JSON.stringify({ usuario, contraseña }),
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.result === "success") {
      message.textContent = "Acceso concedido. Redirigiendo...";
      message.style.color = "green";

      // Redirección según el rol del usuario
      if (data.rol === "super_admin" || data.rol === "admin") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "tareas.html";
      }
    } else {
      message.textContent = "Usuario o contraseña incorrectos.";
      message.style.color = "red";
    }

  } catch (error) {
    console.error("Error al conectar:", error);
    message.textContent = "Error al conectar con el servidor.";
    message.style.color = "red";
  }
});

