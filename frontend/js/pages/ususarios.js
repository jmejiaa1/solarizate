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

// Función para mostrar/ocultar indicador de carga
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
                  ${panelesSolares.length > 0 ? panelesSolares.map(panel => `<option value="${panel.id}" data-energia="${panel.energia_generada}">${panel.tipo} (${panel.potencia}Kw/h) - ${panel.energia_generada}W generados</option>`).join('') : '<option value="">No hay paneles disponibles</option>'}
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
                  ${electrodomesticos.length > 0 ? electrodomesticos.map(electro => `<option value="${electro.id}" data-consumo="${electro.consumo}">${electro.nombre} - ${electro.consumo} W</option>`).join('') : '<option value="">No hay electrodomésticos disponibles</option>'}
                </select>
                <input type="number" name="electrodomestico_cantidad" placeholder="Cantidad" min="1" required>
                <button type="button" onclick="eliminarElectrodomestico(this)">Eliminar</button>
              </div>
            </div>
            <button type="button" onclick="agregarElectrodomestico()">Agregar Electrodoméstico</button>
          </div>

          <div class="form-group">
            <label for="generacion_estimada">Generación Estimada (W):</label>
            <input type="number" id="generacion_estimada" name="generacion_estimada" readonly>
          </div>

          <div class="form-group">
            <label for="consumo_estimado">Consumo Estimado (W):</label>
            <input type="number" id="consumo_estimado" name="consumo_estimado" readonly>
          </div>

          <button type="submit">Crear Hogar</button>
          <button type="button" onclick="calcularEstimados()">Calcular Estimados</button>
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
    ? panelesSolares.map(panel => `<option value="${panel.id}" data-energia="${panel.energia_generada}">${panel.tipo} (${panel.potencia}W) - ${panel.energia_generada}W generados</option>`).join('')
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
    ? electrodomesticos.map(electro => `<option value="${electro.id}" data-consumo="${electro.consumo}">${electro.nombre} - ${electro.consumo} W</option>`).join('')
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
    ? panelesSolares.map(panel => `<option value="${panel.id}" data-energia="${panel.energia_generada}">${panel.tipo} (${panel.potencia}W) - ${panel.energia_generada}W generados</option>`).join('')
    : '<option value="">No hay paneles disponibles</option>';

  const electroOptions = Array.isArray(electrodomesticos) && electrodomesticos.length > 0
    ? electrodomesticos.map(electro => `<option value="${electro.id}" data-consumo="${electro.consumo}">${electro.nombre} - ${electro.consumo} W</option>`).join('')
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
          
          return `
            <div class="hogar-card">
              <h4>📍 ${direccion}</h4>
              <p><strong>🏙️ Ciudad:</strong> ${ciudad}</p>
              <div class="energy-stats">
                <p><strong>⚡ Generación Estimada:</strong> <span class="generation">${generacion} W</span></p>
                <p><strong>🔌 Consumo Estimado:</strong> <span class="consumption">${consumo} W</span></p>
                <p class="${balanceClass}"><strong>📊 Balance:</strong> ${Math.abs(balance)} W (${balanceText})</p>
              </div>
              <div class="efficiency-bar">
                <div class="efficiency-fill" style="width: ${eficienciaWidth}%"></div>
              </div>
              <p class="efficiency-text">Eficiencia: ${eficiencia}%</p>
              <div class="hogar-actions">
                <button onclick="verDetalleHogar(${hogar.id})" class="btn-info">Ver Detalle</button>
                <button onclick="editarHogar(${hogar.id})" class="btn-edit">Editar</button>
                <button onclick="eliminarHogar(${hogar.id})" class="btn-danger">Eliminar</button>
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
    const response = await fetch(`${HOGAR_API_URL}/${id}`);
    const hogar = await response.json();
    
    // Crear modal o sección expandida para mostrar detalles
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Detalle del Hogar</h3>
          <button onclick="cerrarModal()" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <h4>📍 ${hogar.direccion}, ${hogar.ciudad}</h4>
          <div class="detail-stats">
            <div class="stat-card">
              <h5>⚡ Generación</h5>
              <p class="stat-value">${hogar.generacion_estimada} W</p>
            </div>
            <div class="stat-card">
              <h5>🔌 Consumo</h5>
              <p class="stat-value">${hogar.consumo_estimado} W</p>
            </div>
            <div class="stat-card">
              <h5>📊 Balance</h5>
              <p class="stat-value ${hogar.generacion_estimada >= hogar.consumo_estimado ? 'positive' : 'negative'}">
                ${hogar.generacion_estimada - hogar.consumo_estimado} W
              </p>
            </div>
          </div>
          <div class="recommendations">
            <h5>💡 Recomendaciones:</h5>
            ${generarRecomendaciones(hogar)}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  } catch (error) {
    console.error('Error al cargar detalle del hogar:', error);
    alert('Error al cargar los detalles del hogar');
  }
}

// Función para generar recomendaciones
function generarRecomendaciones(hogar) {
  const balance = hogar.generacion_estimada - hogar.consumo_estimado;
  const eficiencia = (hogar.generacion_estimada / Math.max(hogar.consumo_estimado, 1)) * 100;
  
  let recomendaciones = '';
  
  if (balance < 0) {
    recomendaciones += '<p>🔋 Considera agregar más paneles solares para cubrir tu consumo.</p>';
    recomendaciones += '<p>💡 Revisa electrodomésticos de alto consumo y considera reemplazarlos por versiones más eficientes.</p>';
  } else if (balance > hogar.consumo_estimado * 0.5) {
    recomendaciones += '<p>✅ Tienes un excelente excedente de energía.</p>';
    recomendaciones += '<p>💰 Podrías considerar vender energía a la red eléctrica.</p>';
  } else {
    recomendaciones += '<p>⚖️ Tu sistema está bien balanceado.</p>';
    recomendaciones += '<p>📈 Considera pequeños ajustes para optimizar aún más.</p>';
  }
  
  if (eficiencia < 50) {
    recomendaciones += '<p>⚠️ La eficiencia de tu sistema es baja. Revisa la configuración.</p>';
  }
  
  return recomendaciones;
}

// Función para cerrar modal
function cerrarModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.remove();
  }
}

// Función para editar hogar
async function editarHogar(id) {
  // Implementar lógica de edición
  alert('Función de edición en desarrollo');
}

// Función para eliminar hogar
// Función para eliminar hogar
async function eliminarHogar(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este hogar? Esta acción no se puede deshacer.')) {
    return;
  }

  try {
    console.log(`Intentando eliminar hogar con ID: ${id}`);
    
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
      alert('Hogar eliminado exitosamente');
      
      // Recargar la lista de hogares
      await cargarHogares();
    } else {
      const errorData = await response.json();
      console.error('Error del servidor:', errorData);
      throw new Error(errorData.error || `Error del servidor: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al eliminar hogar:', error);
    alert(`Error al eliminar el hogar: ${error.message}`);
  }
}

