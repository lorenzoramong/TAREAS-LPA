/* =========================================================
   LOGIN DE TAREAS LPA
   ========================================================= */

// Obtener formulario
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Obtener lista de usuarios guardados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar usuario
    const usuarioEncontrado = usuarios.find(
      (u) => u.usuario === username && u.contraseña === password
    );

    if (usuarioEncontrado) {
      // Guardar sesión activa
      localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));

      // Mostrar mensaje y redirigir
      loginMessage.textContent = "✅ Iniciando sesión...";
      loginMessage.style.color = "green";

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    } else {
      loginMessage.textContent = "❌ Usuario o contraseña incorrectos.";
      loginMessage.style.color = "red";
    }
  });
}

/* =========================================================
   CARGAR USUARIOS POR DEFECTO (solo si no hay ninguno)
   ========================================================= */
if (!localStorage.getItem("usuarios")) {
  const usuariosBase = [
    {
      usuario: "lorram",
      contraseña: "1234",
      rol: "super_admin",
      nombre: "Lorenzo Ramón"
    },
    {
      usuario: "guillo",
      contraseña: "5678",
      rol: "super_admin",
      nombre: "Guillermo Mendoza"
    },
    {
      usuario: "david",
      contraseña: "9999",
      rol: "admin",
      nombre: "David Manager"
    }
  ];

  localStorage.setItem("usuarios", JSON.stringify(usuariosBase));
  console.log("Usuarios iniciales cargados ✅");
}


