// URL del Apps Script desplegado:
const API_URL = "https://script.google.com/macros/s/AKfycbwIpdk6NEcIBMypm-6Xf9y2SNUiOLwRrNv1QOCgVabuIyHZpiIYUixxbHiOMKDBnactTw/exec";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("loginMessage");

  message.textContent = "Verificando...";
  message.style.color = "#555";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("usuario", JSON.stringify(data.user));
      window.location.href = "dashboard.html";
    } else {
      message.textContent = "Usuario o contraseña incorrectos.";
      message.style.color = "red";
    }
  } catch (err) {
    console.error(err);
    message.textContent = "Error al conectar con el servidor.";
    message.style.color = "red";
  }
});

