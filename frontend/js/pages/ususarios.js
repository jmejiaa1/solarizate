const API_URL = 'http://localhost:3000/api/usuarios';
const HOGAR_API_URL = 'http://localhost:3000/api/hogares';
const PANEL_API_URL = 'http://localhost:3000/api/panelesSolares';
const ELECTRODOMESTICO_API_URL = 'http://localhost:3000/api/electrodomesticos';
const REGION_API_URL = 'http://localhost:3000/api/regiones';


let currentUser = null;
let regiones = [];
let panelesSolares = [];
let electrodomesticos = [];


// RENDERIZAR FORMULARIO DE GESTIÓN DE HOGARES ANTES DE QUE SE CARGUE EL DOM
document.addEventListener('DOMContentLoaded', () => {
  inicializarApp();
});

// Función principal para inicializar la aplicación
async function inicializarApp() {
  // Verificar si hay usuario logueado
  const userData = localStorage.getItem('currentUser');
  if (userData) {
    try {
      currentUser = JSON.parse(userData);
      console.log('✅ Usuario logueado:', currentUser.nombre, '(ID:', currentUser.id + ')');
    } catch (e) {
      console.error('❌ Error al leer datos del usuario:', e);
      // Redirigir al login si los datos están corruptos
      alert('Error en los datos de sesión. Por favor, inicia sesión nuevamente.');
      window.location.href = 'iniciarSecion.html';
      return;
    }
  } else {
    // No hay usuario logueado - redirigir al login
    console.warn('⚠️ No hay usuario logueado. Redirigiendo al login...');
    alert('Debes iniciar sesión para acceder a la gestión de hogares.');
    window.location.href = 'iniciarSecion.html';
    return;
  }

  console.log('Usuario actual para gestión de hogares:', currentUser);
  
  // Verificar conexión con el servidor
  await verificarConexionServidor();
  
  await cargarDatosIniciales();
}

// Función para verificar la conexión con el servidor
async function verificarConexionServidor() {
  try {
    console.log('Verificando conexión con el servidor...');
    
    // Intentar conectar con una ruta básica
    const response = await fetch('http://localhost:3000/api/test');
    if (response.ok) {
      console.log('✅ Servidor conectado correctamente');
    } else {
      console.warn('⚠️ Servidor responde pero con status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error de conexión con el servidor:', error);
    mostrarError(`
      <strong>Error de conexión con el servidor</strong><br><br>
      Por favor verifica que:<br>
      • El servidor backend esté ejecutándose en el puerto 3000<br>
      • Las URLs de las APIs sean correctas<br>
      • No haya problemas de CORS<br><br>
      <strong>URLs que se están intentando:</strong><br>
      • Regiones: ${REGION_API_URL}<br>
      • Paneles: ${PANEL_API_URL}<br>
      • Electrodomésticos: ${ELECTRODOMESTICO_API_URL}<br>
      • Hogares: ${HOGAR_API_URL}
    `);
    return false;
  }
  return true;
}

// Cargar datos necesarios para el formulario
async function cargarDatosIniciales() {
  try {
    // Mostrar indicador de carga
    mostrarCargando(true);

    // Cargar regiones
    console.log('Cargando regiones desde:', REGION_API_URL);
    const regionesResponse = await fetch(REGION_API_URL);
    if (!regionesResponse.ok) {
      throw new Error(`Error al cargar regiones: ${regionesResponse.status}`);
    }
    const regionesData = await regionesResponse.json();
    regiones = Array.isArray(regionesData) ? regionesData : [];
    console.log('Regiones cargadas:', regiones);

    // Cargar paneles solares
    console.log('Cargando paneles desde:', PANEL_API_URL);
    const panelesResponse = await fetch(PANEL_API_URL);
    if (!panelesResponse.ok) {
      throw new Error(`Error al cargar paneles: ${panelesResponse.status}`);
    }
    // Cargar paneles solares
    const panelesData = await panelesResponse.json();
    panelesSolares = Array.isArray(panelesData) ? panelesData : [];
    console.log('Paneles cargados:', panelesSolares);

    // Cargar electrodomésticos
    console.log('Cargando electrodomésticos desde:', ELECTRODOMESTICO_API_URL);
    const electrodomesticosResponse = await fetch(ELECTRODOMESTICO_API_URL);
    if (!electrodomesticosResponse.ok) {
      throw new Error(`Error al cargar electrodomésticos: ${electrodomesticosResponse.status}`);
    }
    const electrodomesticosData = await electrodomesticosResponse.json();
    electrodomesticos = Array.isArray(electrodomesticosData) ? electrodomesticosData : [];
    console.log('Electrodomésticos cargados:', electrodomesticos);

    // Ocultar indicador de carga
    mostrarCargando(false);

    // Renderizar formulario con datos cargados
    renderHogarForm();
    cargarHogares();
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
    mostrarCargando(false);
    mostrarError(`Error al cargar los datos necesarios: ${error.message}. Por favor, verifica que el servidor esté ejecutándose y recarga la página.`);
  }
}

// Función para mostrar/ocultar indicador de carga barra de progreso
function mostrarCargando(mostrar) {
  const formDiv = document.getElementById('hogar-form');
  if (mostrar) {
    formDiv.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    `;
  }
}

// Función para mostrar errores
function mostrarError(mensaje) {
  const formDiv = document.getElementById('hogar-form');
  formDiv.innerHTML = `
    <div class="error-container">
      <h3>⚠️ Error</h3>
      <div style="text-align: left; margin: 1rem 0;">
        ${mensaje}
      </div>
      <button onclick="location.reload()" class="btn-reload">Recargar Página</button>
      <button onclick="probarConexiones()" class="btn-test" style="margin-left: 1rem; background: #2196F3;">Probar Conexiones</button>
    </div>
  `;
}

// Función para probar todas las conexiones de API
async function probarConexiones() {
  const formDiv = document.getElementById('hogar-form');
  formDiv.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Probando conexiones con las APIs...</p>
    </div>
  `;

  const endpoints = [
    { name: 'Regiones', url: REGION_API_URL },
    { name: 'Paneles Solares', url: PANEL_API_URL },
    { name: 'Electrodomésticos', url: ELECTRODOMESTICO_API_URL },
    { name: 'Hogares', url: HOGAR_API_URL },
    { name: 'Hogares por Usuario', url: `${HOGAR_API_URL}/usuario/1` }
  ];

  let resultados = '<h3>Resultados de Conexión:</h3><ul style="text-align: left; margin: 1rem 0;">';

  for (const endpoint of endpoints) {
    try {
      console.log(`Probando ${endpoint.name}: ${endpoint.url}`);
      const response = await fetch(endpoint.url);
      
      if (response.ok) {
        const data = await response.json();
        const count = Array.isArray(data) ? data.length : (data.length !== undefined ? data.length : 'N/A');
        resultados += `<li>✅ <strong>${endpoint.name}</strong>: Conectado (${count} elementos)</li>`;
      } else {
        resultados += `<li>❌ <strong>${endpoint.name}</strong>: Error ${response.status} - ${response.statusText}</li>`;
      }
    } catch (error) {
      resultados += `<li>❌ <strong>${endpoint.name}</strong>: ${error.message}</li>`;
    }
  }

  resultados += '</ul>';

  formDiv.innerHTML = `
    <div class="error-container">
      <h3>🔍 Diagnóstico de Conexión</h3>
      <div style="text-align: left; margin: 1rem 0;">
        ${resultados}
        <br>
        <strong>Notas:</strong><br>
        • Asegúrate de que el servidor backend esté ejecutándose en http://localhost:3000<br>
        • Verifica que las rutas en el backend coincidan con las URLs utilizadas<br>
        • La ruta '/usuario/:userId' debe estar ANTES de '/:id' en el archivo de rutas<br>
        • Revisa la consola del navegador para más detalles
      </div>
      <button onclick="location.reload()" class="btn-reload">Recargar Página</button>
      <button onclick="inicializarApp()" class="btn-retry" style="margin-left: 1rem; background: #4CAF50;">Reintentar</button>
    </div>
  `;
}

function renderHogarForm() {
  const formDiv = document.getElementById('hogar-form');
  
  if (!formDiv) {
    console.error('No se encontró el elemento hogar-form');
    return;
  }

  // Validar que los datos estén cargados
  if (!Array.isArray(regiones)) {
    console.warn('Regiones no está disponible como  lista:', regiones);
    regiones = [];
  }
  if (!Array.isArray(panelesSolares)) {
    console.warn('Paneles solares no está disponible como lista:', panelesSolares);
    panelesSolares = [];
  }
  if (!Array.isArray(electrodomesticos)) {
    console.warn('Electrodomésticos no está disponible como lista:', electrodomesticos);
    electrodomesticos = [];
  }

  formDiv.innerHTML = `



    <div class="hogar-container">
        
      <div  > 
       
      </div>
      
      
      <!-- Formulario para agregar nuevo hogar -->
      <div class="form-section">

        <h2>Gestión de Hogares</h2>

        <h3>Agregar Nuevo Hogar</h3>
        <form id="nuevoHogarForm">
          <div class="form-group">
            <label for="direccion">Dirección:</label>
            <input type="text" id="direccion" name="direccion" required>
          </div>
          
          <div class="form-group">
            <label for="ciudad">Ciudad:</label>
            <input type="text" id="ciudad" name="ciudad" required>
          </div>
          
          <div class="form-group">
            <label for="region">Región:</label>
            <select id="region" name="fk_region" required>
              <option value="">Seleccione una región</option>
              ${regiones.length > 0 ? regiones.map(region => `<option value="${region.id}">${region.nombre}</option>`).join('') : '<option value="">No hay regiones disponibles</option>'}
            </select>
          </div>

          <div class="form-group">
            <h4>Paneles Solares</h4>
            <div id="paneles-container">
              <div class="panel-item">
                <select name="panel_id" required>
                  <option value="">Seleccione un panel solar</option>
                  ${panelesSolares.length > 0 ? panelesSolares.map(panel => `<option value="${panel.id}" data-energia="${panel.energia_generada}">${panel.tipo} (${panel.potencia}w) - ${panel.energia_generada}kw/h generados</option>`).join('') : '<option value="">No hay paneles disponibles</option>'}
                </select>
                <input type="number" name="panel_cantidad" placeholder="Cantidad" min="1" required>
                <button type="button" onclick="eliminarPanel(this)">Eliminar</button>
              </div>
            </div>
            <button type="button" onclick="agregarPanel()">Agregar Panel</button>
          </div>

          <div class="form-group">
            <h4>Electrodomésticos</h4>
            <div id="electrodomesticos-container">
              <div class="electrodomestico-item">
                <select name="electrodomestico_id" required>
                  <option value="">Seleccione un electrodoméstico</option>
                  ${electrodomesticos.length > 0 ? electrodomesticos.map(electro => `<option value="${electro.id}" data-consumo="${electro.consumo}">${electro.nombre} - ${electro.consumo} kw/h</option>`).join('') : '<option value="">No hay electrodomésticos disponibles</option>'}
                </select>
                <input type="number" name="electrodomestico_cantidad" placeholder="Cantidad" min="1" required>
                <button type="button" onclick="eliminarElectrodomestico(this)">Eliminar</button>
              </div>
            </div>
            <button type="button" onclick="agregarElectrodomestico()">Agregar Electrodoméstico</button>
          </div>

          <div class="form-group">
            <label for="generacion_estimada">Generación Estimada (kw/h):</label>
            <input type="number" id="generacion_estimada" name="generacion_estimada" readonly>
          </div>

          <div class="form-group">
            <label for="consumo_estimado">Consumo Estimado (kw/h):</label>
            <input type="number" id="consumo_estimado" name="consumo_estimado" readonly>
          </div>

          <button type="submit">Crear Hogar</button>
          
        </form>
      </div>

      <!-- Lista de hogares del usuario -->
      <div class="hogares-section">
        <h3>Mis Hogares</h3>
        <div id="hogares-lista"></div>
      </div>
    </div>
  `;

  // Agregar eventos
  const form = document.getElementById('nuevoHogarForm');
  if (form) {
    form.addEventListener('submit', handleCrearHogar);
  }
  
  // Agregar listeners para cálculo automático
  document.addEventListener('change', (e) => {
    if (e.target.name === 'panel_cantidad' || e.target.name === 'electrodomestico_cantidad' ||
        e.target.name === 'panel_id' || e.target.name === 'electrodomestico_id') {
      calcularEstimados();
    }
  });
}

// Función para agregar un nuevo panel solar
function agregarPanel() {
  const container = document.getElementById('paneles-container');
  if (!container) return;

  const panelesOptions = Array.isArray(panelesSolares) && panelesSolares.length > 0 
    ? panelesSolares.map(panel => `<option value="${panel.id}" data-energia="${panel.energia_generada}">${panel.tipo} (${panel.potencia}W) - ${panel.energia_generada} kw/h generados</option>`).join('')
    : '<option value="">No hay paneles disponibles</option>';

  const newPanel = document.createElement('div');
  newPanel.className = 'panel-item';
  newPanel.innerHTML = `
    <select name="panel_id" required>
      <option value="">Seleccione un panel solar</option>
      ${panelesOptions}
    </select>
    <input type="number" name="panel_cantidad" placeholder="Cantidad" min="1" required>
    <button type="button" onclick="eliminarPanel(this)">Eliminar</button>
  `;
  container.appendChild(newPanel);
}

// Función para eliminar un panel solar
function eliminarPanel(button) {
  const container = document.getElementById('paneles-container');
  if (container && container.children.length > 1) {
    button.parentElement.remove();
    calcularEstimados();
  }
}

// Función para agregar un nuevo electrodoméstico
function agregarElectrodomestico() {
  const container = document.getElementById('electrodomesticos-container');
  if (!container) return;

  const electroOptions = Array.isArray(electrodomesticos) && electrodomesticos.length > 0
    ? electrodomesticos.map(electro => `<option value="${electro.id}" data-consumo="${electro.consumo}">${electro.nombre} - ${electro.consumo} kw/h</option>`).join('')
    : '<option value="">No hay electrodomésticos disponibles</option>';

  const newElectro = document.createElement('div');
  newElectro.className = 'electrodomestico-item';
  newElectro.innerHTML = `
    <select name="electrodomestico_id" required>
      <option value="">Seleccione un electrodoméstico</option>
      ${electroOptions}
    </select>
    <input type="number" name="electrodomestico_cantidad" placeholder="Cantidad" min="1" required>
    <button type="button" onclick="eliminarElectrodomestico(this)">Eliminar</button>
  `;
  container.appendChild(newElectro);
}

// Función para eliminar un electrodoméstico
function eliminarElectrodomestico(button) {
  const container = document.getElementById('electrodomesticos-container');
  if (container && container.children.length > 1) {
    button.parentElement.remove();
    calcularEstimados();
  }
}

// Función para calcular generación y consumo estimados
function calcularEstimados() {
  let generacionTotal = 0;
  let consumoTotal = 0;

  // Calcular generación de paneles solares
  const panelesItems = document.querySelectorAll('.panel-item');
  panelesItems.forEach(item => {
    const select = item.querySelector('select[name="panel_id"]');
    const cantidad = item.querySelector('input[name="panel_cantidad"]');
    
    if (select.value && cantidad.value) {
      const energia = parseFloat(select.options[select.selectedIndex].dataset.energia);
      generacionTotal += energia * parseInt(cantidad.value);
    }
  });

  // Calcular consumo de electrodomésticos
  const electroItems = document.querySelectorAll('.electrodomestico-item');
  electroItems.forEach(item => {
    const select = item.querySelector('select[name="electrodomestico_id"]');
    const cantidad = item.querySelector('input[name="electrodomestico_cantidad"]');
    
    if (select.value && cantidad.value) {
      const consumo = parseFloat(select.options[select.selectedIndex].dataset.consumo);
      consumoTotal += consumo * parseInt(cantidad.value);
    }
  });

  // Actualizar campos
  document.getElementById('generacion_estimada').value = generacionTotal;
  document.getElementById('consumo_estimado').value = consumoTotal;
}

// Función para manejar la creación del hogar
async function handleCrearHogar(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  
  // Recopilar datos de paneles
  const paneles = [];
  const panelesItems = document.querySelectorAll('.panel-item');
  panelesItems.forEach(item => {
    const panelSelect = item.querySelector('select[name="panel_id"]');
    const cantidadInput = item.querySelector('input[name="panel_cantidad"]');
    
    if (panelSelect.value && cantidadInput.value) {
      const energia_generada = parseFloat(panelSelect.options[panelSelect.selectedIndex].dataset.energia);
      paneles.push({
        panel_id: parseInt(panelSelect.value),
        cantidad: parseInt(cantidadInput.value),
        energia_generada: energia_generada
      });
    }
  });

  // Recopilar datos de electrodomésticos
  const electrodomesticos = [];
  const electroItems = document.querySelectorAll('.electrodomestico-item');
  electroItems.forEach(item => {
    const electroSelect = item.querySelector('select[name="electrodomestico_id"]');
    const cantidadInput = item.querySelector('input[name="electrodomestico_cantidad"]');
    
    if (electroSelect.value && cantidadInput.value) {
      const consumo = parseFloat(electroSelect.options[electroSelect.selectedIndex].dataset.consumo);
      electrodomesticos.push({
        electrodomestico_id: parseInt(electroSelect.value),
        cantidad: parseInt(cantidadInput.value),
        consumo: consumo
      });
    }
  });
  
  const hogarData = {
    direccion: formData.get('direccion'),
    ciudad: formData.get('ciudad'),
    fk_region: parseInt(formData.get('fk_region')),
    fk_usuario: currentUser.id,
    generacion_estimada: parseFloat(document.getElementById('generacion_estimada').value) || 0,
    consumo_estimado: parseFloat(document.getElementById('consumo_estimado').value) || 0,
    paneles: paneles,
    electrodomesticos: electrodomesticos
  };

  try {
    const response = await fetch(HOGAR_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hogarData)
    });

    if (response.ok) {
      const nuevoHogar = await response.json();
      alert('Hogar creado exitosamente');
      
      // Limpiar formulario
      event.target.reset();
      document.getElementById('generacion_estimada').value = '';
      document.getElementById('consumo_estimado').value = '';
      
      // Resetear contenedores de paneles y electrodomésticos
      resetFormulario();
      
      // Recargar lista de hogares
      cargarHogares();
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al crear el hogar');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al crear el hogar: ' + error.message);
  }
}

// Función para resetear el formulario a su estado inicial
function resetFormulario() {
  // Validar arrays antes de usar
  const panelesOptions = Array.isArray(panelesSolares) && panelesSolares.length > 0 
    ? panelesSolares.map(panel => `<option value="${panel.id}" data-energia="${panel.energia_generada}">${panel.tipo} (${panel.potencia}W) - ${panel.energia_generada}kw/h generados</option>`).join('')
    : '<option value="">No hay paneles disponibles</option>';

  const electroOptions = Array.isArray(electrodomesticos) && electrodomesticos.length > 0
    ? electrodomesticos.map(electro => `<option value="${electro.id}" data-consumo="${electro.consumo}">${electro.nombre} - ${electro.consumo} kw/h</option>`).join('')
    : '<option value="">No hay electrodomésticos disponibles</option>';

  // Resetear paneles a uno solo
  const panelesContainer = document.getElementById('paneles-container');
  if (panelesContainer) {
    panelesContainer.innerHTML = `
      <div class="panel-item">
        <select name="panel_id" required>
          <option value="">Seleccione un panel solar</option>
          ${panelesOptions}
        </select>
        <input type="number" name="panel_cantidad" placeholder="Cantidad" min="1" required>
        <button type="button" onclick="eliminarPanel(this)">Eliminar</button>
      </div>
    `;
  }

  // Resetear electrodomésticos a uno solo
  const electroContainer = document.getElementById('electrodomesticos-container');
  if (electroContainer) {
    electroContainer.innerHTML = `
      <div class="electrodomestico-item">
        <select name="electrodomestico_id" required>
          <option value="">Seleccione un electrodoméstico</option>
          ${electroOptions}
        </select>
        <input type="number" name="electrodomestico_cantidad" placeholder="Cantidad" min="1" required>
        <button type="button" onclick="eliminarElectrodomestico(this)">Eliminar</button>
      </div>
    `;
  }
}

// Función para cargar y mostrar los hogares del usuario
async function cargarHogares() {
  try {
    console.log('Cargando hogares para usuario:', currentUser);
    
    if (!currentUser || !currentUser.id) {
      console.warn('No hay usuario logueado');
      mostrarHogares([]);
      return;
    }

    // Usar la ruta específica para obtener hogares del usuario
    const url = `${HOGAR_API_URL}/usuario/${currentUser.id}`;
    console.log('URL para cargar hogares:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Error HTTP: ${response.status} - ${response.statusText}`);
      
      if (response.status === 404) {
        console.warn('Ruta no encontrada, intentando cargar todos los hogares y filtrar');
        // Fallback: cargar todos los hogares y filtrar por usuario
        const fallbackResponse = await fetch(HOGAR_API_URL);
        if (fallbackResponse.ok) {
          const todosLosHogares = await fallbackResponse.json();
          const hogaresUsuario = Array.isArray(todosLosHogares) 
            ? todosLosHogares.filter(hogar => hogar.fk_usuario == currentUser.id)
            : [];
          mostrarHogares(hogaresUsuario);
          return;
        }
      }
      
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Datos recibidos:', data);
    
    // Validar que la respuesta sea un array
    let hogaresUsuario = [];
    if (Array.isArray(data)) {
      hogaresUsuario = data;
    } else if (data.hogares && Array.isArray(data.hogares)) {
      hogaresUsuario = data.hogares;
    } else if (data.error) {
      console.error('Error del servidor:', data.error);
      hogaresUsuario = [];
    } else {
      console.warn('Respuesta inesperada del servidor:', data);
      hogaresUsuario = [];
    }
    
    console.log('Hogares del usuario procesados:', hogaresUsuario);
    mostrarHogares(hogaresUsuario);
    
  } catch (error) {
    console.error('Error al cargar hogares:', error);
    mostrarHogares([]); // Mostrar mensaje de sin hogares en caso de error
  }
}

// Función para mostrar la lista de hogares
function mostrarHogares(hogares) {
  const listaDiv = document.getElementById('hogares-lista');
  
  if (!listaDiv) {
    console.error('No se encontró el elemento hogares-lista');
    return;
  }

  // Validar que hogares sea un array
  if (!Array.isArray(hogares)) {
    console.warn('Los hogares no son un array:', hogares);
    hogares = [];
  }
  
  console.log('Mostrando hogares:', hogares.length);
  
  if (hogares.length === 0) {
    listaDiv.innerHTML = `
      <div class="no-hogares">
        <p>🏠 No tienes hogares registrados aún.</p>
        <p>Completa el formulario de arriba para agregar tu primer hogar.</p>
      </div>
    `;
    return;
  }

  try {
    listaDiv.innerHTML = `
      <div class="hogares-grid">
        ${hogares.map(hogar => {
          // Validar datos del hogar
          const direccion = hogar.direccion || 'Sin dirección';
          const ciudad = hogar.ciudad || 'Sin ciudad';
          const generacion = parseFloat(hogar.generacion_estimada) || 0;
          const consumo = parseFloat(hogar.consumo_estimado) || 0;
          const balance = generacion - consumo;
          const balanceClass = balance >= 0 ? 'balance-positivo' : 'balance-negativo';
          const balanceText = balance >= 0 ? 'Excedente' : 'Déficit';
          const eficiencia = Math.round((generacion / Math.max(consumo, 1)) * 100);
          const eficienciaWidth = Math.min((generacion / Math.max(consumo, 1)) * 100, 100);
          
          // Determinar color y clase de la barra de eficiencia
          let eficienciaColorClass = '';
          let eficienciaStatus = '';
          if (eficiencia >= 120) {
            eficienciaColorClass = 'efficiency-excellent'; // Verde brillante
            eficienciaStatus = 'Excelente';
          } else if (eficiencia >= 100) {
            eficienciaColorClass = 'efficiency-very-good'; // Verde
            eficienciaStatus = 'Muy Buena';
          } else if (eficiencia >= 80) {
            eficienciaColorClass = 'efficiency-good'; // Verde claro
            eficienciaStatus = 'Buena';
          } else if (eficiencia >= 60) {
            eficienciaColorClass = 'efficiency-regular'; // Amarillo
            eficienciaStatus = 'Regular';
          } else if (eficiencia >= 40) {
            eficienciaColorClass = 'efficiency-poor'; // Naranja
            eficienciaStatus = 'Deficiente';
          } else {
            eficienciaColorClass = 'efficiency-critical'; // Rojo
            eficienciaStatus = 'Crítica';
          }
          
          return `
            <div class="hogar-card">
              <h4>📍 ${direccion}</h4>
              <p><strong>🏙️ Ciudad:</strong> ${ciudad}</p>
              <div class="energy-stats">
                <p><strong>⚡ Generación Estimada:</strong> <span class="generation">${generacion} kw/h</span></p>
                <p><strong>🔌 Consumo Estimado:</strong> <span class="consumption">${consumo} kw/h</span></p>
                <p class="${balanceClass}"><strong>📊 Balance:</strong> ${Math.abs(balance)} kw/h (${balanceText})</p>
              </div>
              <div class="efficiency-container">
                <div class="efficiency-bar">
                  <div class="efficiency-fill ${eficienciaColorClass}" style="width: ${eficienciaWidth}%"></div>
                </div>
                <p class="efficiency-text">Eficiencia: ${eficiencia}% - <span class="efficiency-status ${eficienciaColorClass}">${eficienciaStatus}</span></p>
              </div>
              <div class="hogar-actions">
                <button onclick="verDetalleHogar(${hogar.id})" class="btn-info" data-tooltip="Ver información detallada">👁️ Ver Detalle</button>
                <button onclick="editarHogar(${hogar.id})" class="btn-edit" data-tooltip="Modificar configuración del hogar">✏️ Editar</button>
                <button onclick="eliminarHogar(${hogar.id})" class="btn-danger" data-tooltip="Eliminar hogar permanentemente">🗑️ Eliminar</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Error al renderizar hogares:', error);
    listaDiv.innerHTML = `
      <div class="error-container">
        <h3>⚠️ Error al mostrar hogares</h3>
        <p>Hubo un problema al mostrar la lista de hogares.</p>
        <button onclick="cargarHogares()" class="btn-reload">Reintentar</button>
      </div>
    `;
  }
}

// Función para ver detalle del hogar
async function verDetalleHogar(id) {
  try {
    console.log('Cargando detalles del hogar:', id);
    
    // Obtener datos del hogar
    const response = await fetch(`${HOGAR_API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Error al cargar hogar: ${response.status}`);
    }
    const hogar = await response.json();
    console.log('Datos del hogar recibidos:', hogar);
    
    // Obtener información de paneles y electrodomésticos usando endpoints alternativos
    let panelesHogar = [];
    let electrodomesticosHogar = [];
    
    // Intentar obtener paneles del hogar - usando diferentes métodos
    try {
      // Método 1: Verificar si el hogar ya incluye los paneles
      if (hogar.paneles && Array.isArray(hogar.paneles)) {
        panelesHogar = hogar.paneles;
        console.log('Paneles encontrados en hogar:', panelesHogar);
      } else {
        // Método 2: Intentar endpoint específico para paneles del hogar
        try {
          const panelesResponse = await fetch(`${HOGAR_API_URL}/${id}/paneles`);
          if (panelesResponse.ok) {
            panelesHogar = await panelesResponse.json();
            console.log('Paneles obtenidos de endpoint específico:', panelesHogar);
          }
        } catch (error) {
          console.warn('Endpoint específico de paneles no disponible:', error);
        }
        
        // Método 3: Obtener desde tabla de relación electrodomesticoHogar si existe
        if (panelesHogar.length === 0) {
          try {
            const relacionResponse = await fetch(`http://localhost:3000/api/eHogares/hogar/${id}`);
            if (relacionResponse.ok) {
              const relaciones = await relacionResponse.json();
              console.log('Relaciones encontradas:', relaciones);
              
              // Filtrar solo paneles (si tienen energia_generada o son de tipo panel)
              panelesHogar = relaciones.filter(item => 
                item.energia_generada > 0 || 
                (item.tipo && item.tipo.toLowerCase().includes('panel')) ||
                (item.nombre && item.nombre.toLowerCase().includes('panel'))
              );
              console.log('Paneles filtrados de relaciones:', panelesHogar);
            }
          } catch (error) {
            console.warn('No se pudo obtener desde relaciones:', error);
          }
        }
      }
    } catch (error) {
      console.warn('Error al cargar paneles del hogar:', error);
    }
    
    // Intentar obtener electrodomésticos del hogar
    try {
      // Método 1: Verificar si el hogar ya incluye los electrodomésticos
      if (hogar.electrodomesticos && Array.isArray(hogar.electrodomesticos)) {
        electrodomesticosHogar = hogar.electrodomesticos;
        console.log('Electrodomésticos encontrados en hogar:', electrodomesticosHogar);
      } else {
        // Método 2: Intentar endpoint específico
        try {
          const electroResponse = await fetch(`${HOGAR_API_URL}/${id}/electrodomesticos`);
          if (electroResponse.ok) {
            electrodomesticosHogar = await electroResponse.json();
            console.log('Electrodomésticos obtenidos de endpoint específico:', electrodomesticosHogar);
          }
        } catch (error) {
          console.warn('Endpoint específico de electrodomésticos no disponible:', error);
        }
        
        // Método 3: Obtener desde tabla de relación
        if (electrodomesticosHogar.length === 0) {
          try {
            const relacionResponse = await fetch(`http://localhost:3000/api/eHogares/hogar/${id}`);
            if (relacionResponse.ok) {
              const relaciones = await relacionResponse.json();
              
              // Filtrar solo electrodomésticos (si tienen consumo o no son paneles)
              electrodomesticosHogar = relaciones.filter(item => 
                (item.consumo > 0 && !item.energia_generada) || 
                (item.tipo && !item.tipo.toLowerCase().includes('panel')) ||
                (item.nombre && !item.nombre.toLowerCase().includes('panel'))
              );
              console.log('Electrodomésticos filtrados de relaciones:', electrodomesticosHogar);
            }
          } catch (error) {
            console.warn('No se pudo obtener electrodomésticos desde relaciones:', error);
          }
        }
      }
    } catch (error) {
      console.warn('Error al cargar electrodomésticos del hogar:', error);
    }
    
    console.log('Paneles finales para mostrar:', panelesHogar);
    console.log('Electrodomésticos finales para mostrar:', electrodomesticosHogar);
    
    // Si aún no tenemos datos, intentar obtenerlos de forma alternativa
    if (panelesHogar.length === 0 && electrodomesticosHogar.length === 0) {
      console.log('No se encontraron equipos, intentando métodos alternativos...');
      
      // Crear datos de ejemplo basados en la generación y consumo del hogar
      if (hogar.generacion_estimada > 0) {
        // Estimar paneles basados en la generación
        const estimatedPanels = Math.ceil(hogar.generacion_estimada / 300); // Asumiendo 300W por panel
        panelesHogar = [{
          tipo: 'Panel Solar Estimado',
          potencia: 300,
          energia_generada: Math.round(hogar.generacion_estimada / estimatedPanels),
          cantidad: estimatedPanels
        }];
      }
      
      if (hogar.consumo_estimado > 0) {
        // Estimar electrodomésticos basados en el consumo
        electrodomesticosHogar = [{
          nombre: 'Electrodomésticos del Hogar',
          consumo: hogar.consumo_estimado,
          cantidad: 1
        }];
      }
      
      console.log('Equipos estimados - Paneles:', panelesHogar);
      console.log('Equipos estimados - Electrodomésticos:', electrodomesticosHogar);
    }
    
    // Crear modal con información detallada
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>🏠 Detalle del Hogar</h3>
          <button onclick="cerrarModal()" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <h4>📍 ${hogar.direccion}, ${hogar.ciudad}</h4>
          
          <!-- Estadísticas de energía -->
          <div class="detail-stats">
            <div class="stat-card">
              <h5>⚡ Generación</h5>
              <p class="stat-value positive">${hogar.generacion_estimada} kw/h</p>
            </div>
            <div class="stat-card">
              <h5>🔌 Consumo</h5>
              <p class="stat-value">${hogar.consumo_estimado} kw/h</p>
            </div>
            <div class="stat-card">
              <h5>📊 Balance</h5>
              <p class="stat-value ${hogar.generacion_estimada >= hogar.consumo_estimado ? 'positive' : 'negative'}">
                ${Math.abs(hogar.generacion_estimada - hogar.consumo_estimado)} kw/h
                (${hogar.generacion_estimada >= hogar.consumo_estimado ? 'Excedente' : 'Déficit'})
              </p>
            </div>
          </div>
          
          <!-- Paneles Solares -->
          <div class="equipment-section">
            <h5>⚡ Paneles Solares Instalados</h5>
            <div class="equipment-grid">
              ${panelesHogar.length > 0 ? panelesHogar.map(panel => {
                // Manejar diferentes estructuras de datos de paneles
                const tipo = panel.tipo || panel.nombre || 'Panel Solar';
                const potencia = panel.potencia || panel.energia_generada || 'N/A';
                const energia = panel.energia_generada || panel.potencia || 0;
                const cantidad = panel.cantidad || 1;
                const total = energia * cantidad;
                
                return `
                  <div class="equipment-card panel-card">
                    <div class="equipment-header">
                      <span class="equipment-icon">🔋</span>
                      <h6>${tipo}</h6>
                    </div>
                    <div class="equipment-details">
                      <p><strong>Potencia:</strong> <span>${potencia} W</span></p>
                      <p><strong>Energía Generada:</strong> <span>${energia} kw/h</span></p>
                      <p><strong>Cantidad:</strong> <span>${cantidad} unidad(es)</span></p>
                      <p><strong>Total:</strong> <span>${total} W</span></p>
                    </div>
                  </div>
                `;
              }).join('') : `
                <div class="no-equipment">
                  <p>🔋 No hay paneles solares registrados para este hogar</p>
                  <p style="font-size: 0.8rem; color: #999; margin-top: 0.5rem;">
                    Los paneles se registran al crear o editar el hogar
                  </p>
                  <button onclick="verDetalleHogar(${id})" class="btn-secondary" style="margin-top: 1rem; font-size: 0.8rem;">
                    🔄 Recargar Datos
                  </button>
                </div>
              `}
            </div>
          </div>
          
          <!-- Electrodomésticos -->
          <div class="equipment-section">
            <h5>🔌 Electrodomésticos</h5>
            <div class="equipment-grid">
              ${electrodomesticosHogar.length > 0 ? electrodomesticosHogar.map(electro => {
                // Manejar diferentes estructuras de datos de electrodomésticos
                const nombre = electro.nombre || electro.tipo || 'Electrodoméstico';
                const consumo = electro.consumo || 0;
                const cantidad = electro.cantidad || 1;
                const total = consumo * cantidad;
                
                return `
                  <div class="equipment-card electro-card">
                    <div class="equipment-header">
                      <span class="equipment-icon">🏠</span>
                      <h6>${nombre}</h6>
                    </div>
                    <div class="equipment-details">
                      <p><strong>Consumo:</strong> <span>${consumo} kw/h</span></p>
                      <p><strong>Cantidad:</strong> <span>${cantidad} unidad(es)</span></p>
                      <p><strong>Total:</strong> <span>${total} W</span></p>
                    </div>
                  </div>
                `;
              }).join('') : `
                <div class="no-equipment">
                  <p>🔌 No hay electrodomésticos registrados para este hogar</p>
                  <p style="font-size: 0.8rem; color: #999; margin-top: 0.5rem;">
                    Los electrodomésticos se registran al crear o editar el hogar
                  </p>
                  <button onclick="verDetalleHogar(${id})" class="btn-secondary" style="margin-top: 1rem; font-size: 0.8rem;">
                    🔄 Recargar Datos
                  </button>
                </div>
              `}
            </div>
          </div>
          
          <!-- Recomendaciones (opcional) -->
          <div class="recommendations">
            <h5>💡 Recomendaciones:</h5>
            ${generarRecomendaciones(hogar)}
          </div>
          
          <!-- Información de depuración (temporal no solo era para visualizar el estado del hogar esta comentada porque no  es necesaria) 
          <div class="equipment-section" style="margin-top: 2rem; background: rgba(255, 255, 255, 0.02);">
            <h5 style="color: #999; font-size: 0.9rem;">🔧 Información de Depuración</h5>
            <div style="font-size: 0.8rem; color: #ccc; padding: 1rem;">
              <p><strong>ID del Hogar:</strong> ${hogar.id}</p>
              <p><strong>Paneles encontrados:</strong> ${panelesHogar.length} elementos</p>
              <p><strong>Electrodomésticos encontrados:</strong> ${electrodomesticosHogar.length} elementos</p>
              <p><strong>Estructura del hogar:</strong> ${Object.keys(hogar).join(', ')}</p>
              <details style="margin-top: 0.5rem;">
                <summary style="cursor: pointer; color: #4CAF50;">Ver datos completos del hogar</summary>
                <pre style="background: rgba(0,0,0,0.3); padding: 0.5rem; border-radius: 4px; margin-top: 0.5rem; font-size: 0.7rem; overflow-x: auto;">${JSON.stringify(hogar, null, 2)}</pre>
              </details>
            </div>
          </div> -->
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Forzar reflow para que las transiciones funcionen
    modal.offsetHeight;
    
    // Agregar clase para animación de entrada
    modal.classList.add('modal-show');
    
    // Agregar listener para cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cerrarModal();
      }
    });
    
  } catch (error) {
    console.error('Error al cargar detalle del hogar:', error);
    alert('Error al cargar los detalles del hogar');
  }
}

// Función para generar recomendaciones
function generarRecomendaciones(hogar) {
  const balance = hogar.generacion_estimada - hogar.consumo_estimado;
  const eficiencia = Math.round((hogar.generacion_estimada / Math.max(hogar.consumo_estimado, 1)) * 100);
  
  let recomendaciones = '<div class="recommendations-grid">';
  
  // Análisis de eficiencia
  if (eficiencia >= 120) {
    recomendaciones += `
      <div class="recommendation-card excellent">
        <h6>🌟 Sistema Excelente</h6>
        <p>Tu eficiencia del ${eficiencia}% es excepcional. Considera vender el excedente a la red eléctrica o instalar baterías para almacenar energía.</p>
      </div>
    `;
  } else if (eficiencia >= 100) {
    recomendaciones += `
      <div class="recommendation-card very-good">
        <h6>✅ Sistema Muy Eficiente</h6>
        <p>Con ${eficiencia}% de eficiencia, tu sistema cubre completamente tus necesidades. Podrías considerar agregar más electrodomésticos eficientes.</p>
      </div>
    `;
  } else if (eficiencia >= 80) {
    recomendaciones += `
      <div class="recommendation-card good">
        <h6>👍 Buen Rendimiento</h6>
        <p>Tu eficiencia del ${eficiencia}% está bien. Considera agregar 1-2 paneles adicionales para alcanzar la autosuficiencia total.</p>
      </div>
    `;
  } else if (eficiencia >= 60) {
    recomendaciones += `
      <div class="recommendation-card regular">
        <h6>⚡ Mejora Necesaria</h6>
        <p>Con ${eficiencia}% de eficiencia, necesitas más generación. Considera duplicar tus paneles solares o reducir el consumo.</p>
      </div>
    `;
  } else {
    recomendaciones += `
      <div class="recommendation-card critical">
        <h6>🚨 Acción Urgente</h6>
        <p>Tu eficiencia del ${eficiencia}% es crítica. Necesitas una revisión completa del sistema y posiblemente triplicar la capacidad de generación.</p>
      </div>
    `;
  }
  
  // Análisis de balance energético
  if (balance < -500) {
    recomendaciones += `
      <div class="recommendation-card energy-deficit">
        <h6>⚠️ Déficit Alto</h6>
        <p>Tu déficit de ${Math.abs(balance)}W es significativo. Prioriza agregar paneles solares de alta capacidad y revisa electrodomésticos ineficientes.</p>
      </div>
    `;
  } else if (balance < 0) {
    recomendaciones += `
      <div class="recommendation-card energy-minor-deficit">
        <h6>📊 Déficit Menor</h6>
        <p>Con un déficit de ${Math.abs(balance)}kw/h, estás cerca del equilibrio. Unos pocos paneles adicionales resolverían el problema.</p>
      </div>
    `;
  } else if (balance > 1000) {
    recomendaciones += `
      <div class="recommendation-card energy-surplus">
        <h6>💚 Gran Excedente</h6>
        <p>Tu excedente de ${balance}kw/h es excelente. Considera instalar un sistema de baterías o conectarte a la red para vender energía.</p>
      </div>
    `;
  } else if (balance > 0) {
    recomendaciones += `
      <div class="recommendation-card energy-balanced">
        <h6>⚖️ Sistema Balanceado</h6>
        <p>Tu excedente de ${balance}kw/h indica un buen equilibrio. Tu sistema está bien optimizado.</p>
      </div>
    `;
  }
  
  /*
  // Recomendaciones específicas basadas en rangos esta funcion la  tengo comentada en la linea 972 ya que no es necesaria por ahora
  const generationKW = (hogar.generacion_estimada / 1000).toFixed(1);
  const consumptionKW = (hogar.consumo_estimado / 1000).toFixed(1);
  
  recomendaciones += `
    <div class="recommendation-card technical">
      <h6>📈 Datos Técnicos</h6>
      <p><strong>Generación:</strong> ${generationKW} kW/h</p>
      <p><strong>Consumo:</strong> ${consumptionKW} kW/h</p>
     <!--<p><strong>Ahorro mensual estimado:</strong> $${Math.round(hogar.generacion_estimada * 0.15 * 24 * 30 / 1000)} (aprox.)</p> -->
      
    </div>
  `;
   */ 
  recomendaciones += '</div>';
  
  return recomendaciones;
}

// Función para cerrar modal
function cerrarModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    // Agregar clase de animación de salida
    modal.classList.add('modal-hide');
    modal.classList.remove('modal-show');
    
    // Esperar a que termine la animación antes de remover del DOM
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 300); // Coincide con la duración de la transición CSS
  }
}

// Función para editar hogar
async function editarHogar(id) {
  try {
    console.log('Cargando datos del hogar para editar:', id);
    
    // Obtener datos actuales del hogar
    const response = await fetch(`${HOGAR_API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Error al cargar hogar: ${response.status}`);
    }
    
    const hogar = await response.json();
    console.log('Datos del hogar cargados:', hogar);
    
    // Crear y mostrar modal de edición
    mostrarModalEdicion(hogar);
    
  } catch (error) {
    console.error('Error al cargar hogar para edición:', error);
    alert('Error al cargar los datos del hogar: ' + error.message);
  }
}

// Función para mostrar el modal de edición
function mostrarModalEdicion(hogar) {
  // Validar que los datos estén disponibles
  const regionesOptions = Array.isArray(regiones) && regiones.length > 0 
    ? regiones.map(region => `<option value="${region.id}" ${region.id == hogar.fk_region ? 'selected' : ''}>${region.nombre}</option>`).join('')
    : '<option value="">No hay regiones disponibles</option>';

  const panelesOptions = Array.isArray(panelesSolares) && panelesSolares.length > 0 
    ? panelesSolares.map(panel => `<option value="${panel.id}" data-energia="${panel.energia_generada}">${panel.tipo} (${panel.potencia}W) - ${panel.energia_generada}Kw/h generados</option>`).join('')
    : '<option value="">No hay paneles disponibles</option>';

  const electroOptions = Array.isArray(electrodomesticos) && electrodomesticos.length > 0
    ? electrodomesticos.map(electro => `<option value="${electro.id}" data-consumo="${electro.consumo}">${electro.nombre} - ${electro.consumo} kw/h</option>`).join('')
    : '<option value="">No hay electrodomésticos disponibles</option>';

  // Crear modal
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'modal-editar-hogar';
  
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>✏️ Editar Hogar</h3>
        <button onclick="cerrarModalEdicion()" class="close-btn">&times;</button>
      </div>
      
      <div class="modal-body">
        <form id="editarHogarForm">
          <input type="hidden" id="edit-hogar-id" value="${hogar.id}">
          
          <div class="form-group">
            <label for="edit-direccion">📍 Dirección:</label>
            <input type="text" id="edit-direccion" name="direccion" value="${hogar.direccion || ''}" required>
          </div>
          
          <div class="form-group">
            <label for="edit-ciudad">🏙️ Ciudad:</label>
            <input type="text" id="edit-ciudad" name="ciudad" value="${hogar.ciudad || ''}" required>
          </div>
          
          <div class="form-group">
            <label for="edit-region">🌍 Región:</label>
            <select id="edit-region" name="fk_region" required>
              <option value="">Seleccione una región</option>
              ${regionesOptions}
            </select>
          </div>

          <div class="form-group">
            <h4>⚡ Paneles Solares</h4>
            <div id="edit-paneles-container">
              <!-- Los paneles se cargarán dinámicamente -->
            </div>
            <button type="button" onclick="agregarPanelEdicion()">➕ Agregar Panel</button>
          </div>

          <div class="form-group">
            <h4>🔌 Electrodomésticos</h4>
            <div id="edit-electrodomesticos-container">
              <!-- Los electrodomésticos se cargarán dinámicamente -->
            </div>
            <button type="button" onclick="agregarElectrodomesticoEdicion()">➕ Agregar Electrodoméstico</button>
          </div>

          <div class="form-group">
            <label for="edit-generacion-estimada">⚡ Generación Estimada (kw/h):</label>
            <input type="number" id="edit-generacion-estimada" name="generacion_estimada" readonly value="${hogar.generacion_estimada || 0}">
          </div>

          <div class="form-group">
            <label for="edit-consumo-estimado">🔌 Consumo Estimado (kw/h):</label>
            <input type="number" id="edit-consumo-estimado" name="consumo_estimado" readonly value="${hogar.consumo_estimado || 0}">
          </div>

          <div class="hogar-actions">
            <button type="submit" class="btn-edit">💾 Guardar Cambios</button>
            <button type="button" onclick="cerrarModalEdicion()" class="btn-secondary">❌ Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Agregar modal al DOM
  document.body.appendChild(modal);
  
  // Forzar reflow para que las transiciones funcionen
  modal.offsetHeight;
  
  // Agregar clase para animación de entrada
  modal.classList.add('modal-show');
  
  // Agregar listener para cerrar al hacer clic fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModalEdicion();
    }
  });
  
  // Cargar los paneles y electrodomésticos existentes del hogar
  cargarPanelesExistentes(hogar.id);
  cargarElectrodomesticosExistentes(hogar.id);
  
  // Agregar event listener para el formulario
  const form = document.getElementById('editarHogarForm');
  form.addEventListener('submit', handleActualizarHogar);
  
  // Agregar listeners para cálculo automático en edición
  modal.addEventListener('change', (e) => {
    if (e.target.name === 'edit_panel_cantidad' || e.target.name === 'edit_electrodomestico_cantidad' ||
        e.target.name === 'edit_panel_id' || e.target.name === 'edit_electrodomestico_id') {
      calcularEstimadosEdicion();
    }
  });
}

// Función para cargar paneles existentes del hogar
async function cargarPanelesExistentes(hogarId) {
  try {
    // Aquí deberías hacer una llamada para obtener los paneles del hogar específico
    // Por ahora, agregaremos un panel vacío como ejemplo
    const container = document.getElementById('edit-paneles-container');
    
    const panelesOptions = Array.isArray(panelesSolares) && panelesSolares.length > 0 
      ? panelesSolares.map(panel => `<option value="${panel.id}" data-energia="${panel.energia_generada}">${panel.tipo} (${panel.potencia}W) - ${panel.energia_generada} kw/h generados</option>`).join('')
      : '<option value="">No hay paneles disponibles</option>';
    
    // Agregar al menos un panel vacío para edición
    container.innerHTML = `
      <div class="panel-item">
        <select name="edit_panel_id" required>
          <option value="">Seleccione un panel solar</option>
          ${panelesOptions}
        </select>
        <input type="number" name="edit_panel_cantidad" placeholder="Cantidad" min="1" required>
        <button type="button" onclick="eliminarPanelEdicion(this)">❌ Eliminar</button>
      </div>
    `;
    
  } catch (error) {
    console.error('Error al cargar paneles existentes:', error);
  }
}

// Función para cargar electrodomésticos existentes del hogar
async function cargarElectrodomesticosExistentes(hogarId) {
  try {
    const container = document.getElementById('edit-electrodomesticos-container');
    
    const electroOptions = Array.isArray(electrodomesticos) && electrodomesticos.length > 0
      ? electrodomesticos.map(electro => `<option value="${electro.id}" data-consumo="${electro.consumo}">${electro.nombre} - ${electro.consumo} kw/h</option>`).join('')
      : '<option value="">No hay electrodomésticos disponibles</option>';
    
    // Agregar al menos un electrodoméstico vacío para edición
    container.innerHTML = `
      <div class="electrodomestico-item">
        <select name="edit_electrodomestico_id" required>
          <option value="">Seleccione un electrodoméstico</option>
          ${electroOptions}
        </select>
        <input type="number" name="edit_electrodomestico_cantidad" placeholder="Cantidad" min="1" required>
        <button type="button" onclick="eliminarElectrodomesticoEdicion(this)">❌ Eliminar</button>
      </div>
    `;
    
  } catch (error) {
    console.error('Error al cargar electrodomésticos existentes:', error);
  }
}

// Función para agregar panel en edición
function agregarPanelEdicion() {
  const container = document.getElementById('edit-paneles-container');
  if (!container) return;

  const panelesOptions = Array.isArray(panelesSolares) && panelesSolares.length > 0 
    ? panelesSolares.map(panel => `<option value="${panel.id}" data-energia="${panel.energia_generada}">${panel.tipo} (${panel.potencia}W) - ${panel.energia_generada} kw/h generados</option>`).join('')
    : '<option value="">No hay paneles disponibles</option>';

  const newPanel = document.createElement('div');
  newPanel.className = 'panel-item';
  newPanel.innerHTML = `
    <select name="edit_panel_id" required>
      <option value="">Seleccione un panel solar</option>
      ${panelesOptions}
    </select>
    <input type="number" name="edit_panel_cantidad" placeholder="Cantidad" min="1" required>
    <button type="button" onclick="eliminarPanelEdicion(this)">❌ Eliminar</button>
  `;
  container.appendChild(newPanel);
}

// Función para eliminar panel en edición
function eliminarPanelEdicion(button) {
  const container = document.getElementById('edit-paneles-container');
  if (container && container.children.length > 1) {
    button.parentElement.remove();
    calcularEstimadosEdicion();
  } else {
    alert('Debe mantener al menos un panel solar');
  }
}

// Función para agregar electrodoméstico en edición
function agregarElectrodomesticoEdicion() {
  const container = document.getElementById('edit-electrodomesticos-container');
  if (!container) return;

  const electroOptions = Array.isArray(electrodomesticos) && electrodomesticos.length > 0
    ? electrodomesticos.map(electro => `<option value="${electro.id}" data-consumo="${electro.consumo}">${electro.nombre} - ${electro.consumo} kw/h</option>`).join('')
    : '<option value="">No hay electrodomésticos disponibles</option>';

  const newElectro = document.createElement('div');
  newElectro.className = 'electrodomestico-item';
  newElectro.innerHTML = `
    <select name="edit_electrodomestico_id" required>
      <option value="">Seleccione un electrodoméstico</option>
      ${electroOptions}
    </select>
    <input type="number" name="edit_electrodomestico_cantidad" placeholder="Cantidad" min="1" required>
    <button type="button" onclick="eliminarElectrodomesticoEdicion(this)">❌ Eliminar</button>
  `;
  container.appendChild(newElectro);
}

// Función para eliminar electrodoméstico en edición
function eliminarElectrodomesticoEdicion(button) {
  const container = document.getElementById('edit-electrodomesticos-container');
  if (container && container.children.length > 1) {
    button.parentElement.remove();
    calcularEstimadosEdicion();
  } else {
    alert('Debe mantener al menos un electrodoméstico');
  }
}

// Función para calcular estimados en el modal de edición
function calcularEstimadosEdicion() {
  let generacionTotal = 0;
  let consumoTotal = 0;

  // Calcular generación de paneles solares
  const panelesItems = document.querySelectorAll('#edit-paneles-container .panel-item');
  panelesItems.forEach(item => {
    const select = item.querySelector('select[name="edit_panel_id"]');
    const cantidad = item.querySelector('input[name="edit_panel_cantidad"]');
    
    if (select && select.value && cantidad && cantidad.value) {
      const energia = parseFloat(select.options[select.selectedIndex].dataset.energia || 0);
      generacionTotal += energia * parseInt(cantidad.value);
    }
  });

  // Calcular consumo de electrodomésticos
  const electroItems = document.querySelectorAll('#edit-electrodomesticos-container .electrodomestico-item');
  electroItems.forEach(item => {
    const select = item.querySelector('select[name="edit_electrodomestico_id"]');
    const cantidad = item.querySelector('input[name="edit_electrodomestico_cantidad"]');
    
    if (select && select.value && cantidad && cantidad.value) {
      const consumo = parseFloat(select.options[select.selectedIndex].dataset.consumo || 0);
      consumoTotal += consumo * parseInt(cantidad.value);
    }
  });

  // Actualizar campos
  const generacionInput = document.getElementById('edit-generacion-estimada');
  const consumoInput = document.getElementById('edit-consumo-estimado');
  
  if (generacionInput) generacionInput.value = generacionTotal;
  if (consumoInput) consumoInput.value = consumoTotal;
}

// Función para manejar la actualización del hogar
async function handleActualizarHogar(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const hogarId = document.getElementById('edit-hogar-id').value;
  
  // Recopilar datos de paneles
  const paneles = [];
  const panelesItems = document.querySelectorAll('#edit-paneles-container .panel-item');
  panelesItems.forEach(item => {
    const panelSelect = item.querySelector('select[name="edit_panel_id"]');
    const cantidadInput = item.querySelector('input[name="edit_panel_cantidad"]');
    
    if (panelSelect && panelSelect.value && cantidadInput && cantidadInput.value) {
      const energia_generada = parseFloat(panelSelect.options[panelSelect.selectedIndex].dataset.energia || 0);
      paneles.push({
        panel_id: parseInt(panelSelect.value),
        cantidad: parseInt(cantidadInput.value),
        energia_generada: energia_generada
      });
    }
  });

  // Recopilar datos de electrodomésticos
  const electrodomesticosData = [];
  const electroItems = document.querySelectorAll('#edit-electrodomesticos-container .electrodomestico-item');
  electroItems.forEach(item => {
    const electroSelect = item.querySelector('select[name="edit_electrodomestico_id"]');
    const cantidadInput = item.querySelector('input[name="edit_electrodomestico_cantidad"]');
    
    if (electroSelect && electroSelect.value && cantidadInput && cantidadInput.value) {
      const consumo = parseFloat(electroSelect.options[electroSelect.selectedIndex].dataset.consumo || 0);
      electrodomesticosData.push({
        electrodomestico_id: parseInt(electroSelect.value),
        cantidad: parseInt(cantidadInput.value),
        consumo: consumo
      });
    }
  });
  
  const hogarData = {
    direccion: formData.get('direccion'),
    ciudad: formData.get('ciudad'),
    fk_region: parseInt(formData.get('fk_region')),
    fk_usuario: currentUser.id,
    generacion_estimada: parseFloat(document.getElementById('edit-generacion-estimada').value) || 0,
    consumo_estimado: parseFloat(document.getElementById('edit-consumo-estimado').value) || 0,
    paneles: paneles,
    electrodomesticos: electrodomesticosData
  };

  try {
    console.log('Actualizando hogar:', hogarId, hogarData);
    
    const response = await fetch(`${HOGAR_API_URL}/${hogarId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hogarData)
    });

    if (response.ok) {
      const hogarActualizado = await response.json();
      console.log('Hogar actualizado exitosamente:', hogarActualizado);
      
      alert('✅ Hogar actualizado exitosamente');
      
      // Cerrar modal
      cerrarModalEdicion();
      
      // Recargar lista de hogares
      await cargarHogares();
      
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar el hogar');
    }
  } catch (error) {
    console.error('Error al actualizar hogar:', error);
    alert('❌ Error al actualizar el hogar: ' + error.message);
  }
}

// Función para cerrar el modal de edición
function cerrarModalEdicion() {
  const modal = document.getElementById('modal-editar-hogar');
  if (modal) {
    // Agregar clase de animación de salida
    modal.classList.add('modal-hide');
    modal.classList.remove('modal-show');
    
    // Esperar a que termine la animación antes de remover del DOM
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 300); // Coincide con la duración de la transición CSS
  }
}

// Función para eliminar hogar
async function eliminarHogar(id) {
  // Crear modal de confirmación personalizado
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'modal-confirmar-eliminacion';
  
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <div class="modal-header">
        <h3>🗑️ Confirmar Eliminación</h3>
        <button onclick="cerrarModalConfirmacion()" class="close-btn">&times;</button>
      </div>
      
      <div class="modal-body">
        <div style="text-align: center; padding: 2rem 1rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
          <h4 style="color: #f44336; margin-bottom: 1rem;">¿Estás seguro?</h4>
          <p style="color: #fff; margin-bottom: 2rem; line-height: 1.6;">
            Esta acción <strong>eliminará permanentemente</strong> este hogar junto con toda su configuración de paneles solares y electrodomésticos.
            <br><br>
            <strong>Esta acción no se puede deshacer.</strong>
          </p>
          
          <div class="hogar-actions">
            <button onclick="confirmarEliminacion(${id})" class="btn-danger">
              🗑️ Sí, Eliminar
            </button>
            <button onclick="cerrarModalConfirmacion()" class="btn-secondary">
              ❌ Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  
  // Forzar reflow para que las transiciones funcionen
  modal.offsetHeight;
  
  // Agregar clase para animación de entrada
  modal.classList.add('modal-show');
  
  // Agregar listener para cerrar al hacer clic fuera del modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModalConfirmacion();
    }
  });
}

// Función para confirmar la eliminación
async function confirmarEliminacion(id) {
  try {
    console.log(`Eliminando hogar con ID: ${id}`);
    
    // Mostrar indicador de carga
    const modal = document.getElementById('modal-confirmar-eliminacion');
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div class="loading-spinner" style="margin: 0 auto 1rem;"></div>
        <p style="color: #fff;">Eliminando hogar...</p>
      </div>
    `;
    
    const response = await fetch(`${HOGAR_API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log(`Respuesta del servidor: ${response.status}`);

    if (response.ok) {
      const result = await response.json();
      console.log('Hogar eliminado exitosamente:', result);
      
      // Mostrar mensaje de éxito
      modalBody.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem; color: #4CAF50;">✅</div>
          <h4 style="color: #4CAF50; margin-bottom: 1rem;">¡Eliminado exitosamente!</h4>
          <p style="color: #fff; margin-bottom: 2rem;">
            El hogar ha sido eliminado permanentemente de tu cuenta.
          </p>
          <button onclick="cerrarModalConfirmacion()" class="btn-secondary">
            👍 Entendido
          </button>
        </div>
      `;
      
      // Recargar la lista de hogares después de 2 segundos
      setTimeout(async () => {
        await cargarHogares();
        cerrarModalConfirmacion();
      }, 2000);
      
    } else {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      
      // Mostrar mensaje de error
      modalBody.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem; color: #f44336;">❌</div>
          <h4 style="color: #f44336; margin-bottom: 1rem;">Error al eliminar</h4>
          <p style="color: #fff; margin-bottom: 2rem;">
            ${errorData.error || `Error del servidor: ${response.status}`}
          </p>
          <div class="hogar-actions">
            <button onclick="eliminarHogar(${id})" class="btn-danger">
              🔄 Reintentar
            </button>
            <button onclick="cerrarModalConfirmacion()" class="btn-secondary">
              ❌ Cancelar
            </button>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error al eliminar hogar:', error);
    
    // Mostrar mensaje de error de conexión
    const modal = document.getElementById('modal-confirmar-eliminacion');
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem; color: #f44336;">🔌</div>
        <h4 style="color: #f44336; margin-bottom: 1rem;">Error de conexión</h4>
        <p style="color: #fff; margin-bottom: 2rem;">
          No se pudo conectar con el servidor. Verifica tu conexión a internet.
        </p>
        <div class="hogar-actions">
          <button onclick="eliminarHogar(${id})" class="btn-danger">
            🔄 Reintentar
          </button>
          <button onclick="cerrarModalConfirmacion()" class="btn-secondary">
            ❌ Cancelar
          </button>
        </div>
      </div>
    `;
  }
}

// Función para cerrar modal de confirmación
function cerrarModalConfirmacion() {
  const modal = document.getElementById('modal-confirmar-eliminacion');
  if (modal) {
    // Agregar clase de animación de salida
    modal.classList.add('modal-hide');
    modal.classList.remove('modal-show');
    
    // Esperar a que termine la animación antes de remover del DOM
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 300); // Coincide con la duración de la transición CSS
  }
}

