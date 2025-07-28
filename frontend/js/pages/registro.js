
//const API_URL = 'http://localhost:3000/api/usuarios';

// RENDERIZAR FORMULARIO  DE  REGISTRO ANTES DE QUE SE CARGUE EL DOM
document.addEventListener('DOMContentLoaded', () => {
  renderForm();
  fetchUsuario();
});

function renderForm(usuario = {}){

  const formDiv = document.getElementById('registro-form');

    formDiv.innerHTML = `

    <div id= "registroForm">
        
        <div class="container">
            <div class="container-form">

            <form class="sing-in">

                <input type="hidden" id="fk_roll" name="fk_roll" value="2">
                

                <h2>Registrarse</h2>
                <div class="social-network">
                <ion-icon name="logo-facebook"></ion-icon>
                <ion-icon name="logo-instagram"></ion-icon>
                <ion-icon name="logo-tiktok"></ion-icon>
                </div>

                <span>Use su correo electronico para registrarse </span>

                <div class="container-input">
                <ion-icon name="lock-closed-outline"></ion-icon>
                <input id ="nombre" name="nombre" type="text" placeholder="Nombre" required value="${usuario.nombre || ''}">
                </div>

                <div class="container-input">
                <ion-icon name="lock-closed-outline"></ion-icon>
                <input id ="documento" name="documento" type="text" placeholder="Documento" required value="${usuario.documento || ''}">
                </div>

                <div class="container-input">
                <ion-icon name="mail-outline"></ion-icon>
                <input id ="correo" name="correo" type="email" placeholder="Correo" required value="${usuario.correo || ''}">
                </div>

                <div class="container-input">
                <ion-icon name="lock-closed-outline"></ion-icon>
                <input id ="contrasena" name="contrasena" type="password" placeholder="Contraseña" required value="${usuario.contrasena || ''}">
                </div>

                <button type="submit" class="button">${usuario.id ? 'Actualizar' : 'Registrar'}</button>


                <div id="errorMessage" style="color: red; margin-top: 10px; display: none;"></div>
                <div id="successMessage" style="color: green; margin-top: 10px; display: none;"></div>
                

            </form>
            </div>

            <div class="container-form">
            <form class="sing-up">

                

            </form>
            </div>

            <div class="container-welcome">

            <div class="welcome-sign-up welcome">
                <h3>!Hola!</h3>
                <p>Registrate con tus datos personales para usar todas las funciones del sitio </p>
                <button class="button" onclick="window.location.href='iniciarSecion.html'; return false;">Iniciar Sesion</button>
                
            </div>

            </div>

        </div>
    </div> 

          

 
 `; // fializa el HTML del formulario de registro

  // Agregar evento al formulario
        document.getElementById('registroForm').onsubmit = handleSumit;
        if (usuario.id) {
          document.getElementById('cancelEdit').onclick = () => renderForm();
        }

}// final renderForm

async function fetchUsuario() {
 const res = await fetch('http://localhost:3000/api/usuarios');
 const usuario = await res.json();
 console.log('Usuarios desde el servidor:', usuario);
}


async function handleSumit(e) {
  e.preventDefault();
  const form = e.target;

  const data = Object.fromEntries(new FormData(form));

  const errorDiv = document.getElementById('errorMessage');

  const successDiv = document.getElementById('successMessage');

  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';
  const res = await fetch('http://localhost:3000/api/usuarios', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data), // Asume que "data" contiene los datos del formulario
})
.then(response => {
  if (response.ok) {

    // mensaje de éxito al registrarse
    successDiv.textContent = 'Registro exitoso. Redirigiendo...';
    successDiv.style.display = 'block';

    // Redireccionar después de 3 segundos

    setTimeout(() => {
                window.location.href = 'iniciarSecion.html'; // 
            }, 3000);

    // Mostrar mensaje en ventana
    //alert('✅ Registro exitoso. ¡Bienvenido!');

    // Redireccionar a otra página, 
    //window.location.href = 'iniciarSecion.html';
  } else {

    // mensaje de error  no se pudo registrar
    errorDiv.textContent = data.error || 'Error al registrarse';
    errorDiv.style.display = 'block';

    // Manejar errores del servidor por ventana
    //alert('❌ Hubo un problema con el registro. Intenta nuevamente.');
  }
})
.catch(error => {
  // Manejar errores de red o código
  console.error('Error:', error);
  alert('❌ No se pudo conectar con el servidor.');
});

  console.log('Usuario registrado:', await res.json());
  renderForm();
  fetchUsuario();
}