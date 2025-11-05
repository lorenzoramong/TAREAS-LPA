// URL de tu PROXY público
const API_URL = "https://script.google.com/macros/s/AKfycbyNuN89FmoLohAwlqhaDulV6tNr6dXhkYEFxTo1iK5I09H-trylUGxHoKS-NqE28eCd/exec";

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
      redirect: "follow",
      mode: "cors",
      body: JSON.stringify({ usuario, contraseña }),
    });

    // leemos siempre como texto primero
    const text = await response.text();
    console.log("Respuesta cruda del servidor:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error("No se pudo interpretar la respuesta del servidor.");
    }

    if (data.result === "success") {
      message.textContent = "Acceso concedido. Redirigiendo...";
      message.style.color = "green";

      // Redirección según rol
      if (data.rol === "super_admin" || data.rol === "admin") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "tareas.html";
      }
    } else {
      message.textContent = data.message || "Usuario o contraseña incorrectos.";
      message.style.color = "red";
    }
  } catch (error) {
    console.error("Error al conectar:", error);
    message.textContent = "Error al conectar con el servidor.";
    message.style.color = "red";
  }
});


