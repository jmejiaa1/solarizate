

const API_URL = 'http://localhost:3000/api/usuarios';

// RENDERIZAR FORMULARIO DE INICIO DE SESIÓN ANTES DE QUE SE CARGUE EL DOM
document.addEventListener('DOMContentLoaded', () => {
  renderLoginForm();
});

function renderLoginForm(){

  const formDiv = document.getElementById('usuario-form');

    formDiv.innerHTML = `

    <div id= "usuarioForm">

        <div class="container">
            <div class="container-form">

            <form class="sing-in" id="loginForm">

                <h2>Iniciar Sesión</h2>

                <div class="social-network">
                <ion-icon name="logo-facebook"></ion-icon>
                <ion-icon name="logo-instagram"></ion-icon>
                <ion-icon name="logo-tiktok"></ion-icon>
                </div>

                <span>Use su correo y contraseña</span>

                <div class="container-input">
                <ion-icon name="mail-outline"></ion-icon>
                <input type="email" id="email" placeholder="Email" required>
                </div>

                <div class="container-input">
                <ion-icon name="lock-closed-outline"></ion-icon>
                <input type="password" id="password" placeholder="Contraseña" required>
                </div>

                <a href="#">¿Olvidaste tu contraseña?</a>

                <button type="submit" class="button">INICIAR SESIÓN</button>

                <div id="errorMessage" style="color: red; margin-top: 10px; display: none;"></div>
                <div id="successMessage" style="color: green; margin-top: 10px; display: none;"></div>

            </form>
            </div>

            <div class="container-form">
            <form class="sing-up"></form>
            </div>

            <div class="container-welcome">

            <div class="welcome-sign-up welcome">
                <h3>¡Bienvenido!</h3>
                <p>Ingrese sus datos personales para usar las funciones del sitio</p>
                <button class="button" onclick="window.location.href='registro.html'; return false;">Registrarse</button>
            </div>
            
           

            </div>

        </div>
    </div>

 
 `;

    // Agregar evento de submit al formulario
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

// Función para manejar el inicio de sesión
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    // Limpiar mensajes anteriores
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo: email,
                contrasena: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login exitoso
            successDiv.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
            successDiv.style.display = 'block';
            
            // Guardar información del usuario en localStorage
            localStorage.setItem('currentUser', JSON.stringify(data.currentUser));
            
            // Redirigir después de 3 segundos
            setTimeout(() => {
                window.location.href = 'usuario.html'; 
            }, 3000);
            
        } else {
            // Error en el login
            errorDiv.textContent = data.error || 'Error al iniciar sesión';
            errorDiv.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error:', error);
        errorDiv.textContent = 'Error de conexión. Por favor, intente nuevamente.';
        errorDiv.style.display = 'block';
    }
} 
