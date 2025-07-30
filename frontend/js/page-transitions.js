// Sistema de transiciones de página para SolarizateP
class PageTransition {
    constructor() {
        this.overlay = null;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        // Crear el overlay si no existe
        this.createOverlay();
        
        // Agregar event listeners para todos los links de navegación
        this.attachLinkListeners();
        
        // Manejar la carga inicial de la página
        this.handlePageLoad();
        
        // Manejar el botón atrás del navegador
        this.handleBrowserNavigation();
    }

    createOverlay() {
        if (!document.getElementById('page-transition')) {
            const overlay = document.createElement('div');
            overlay.id = 'page-transition';
            overlay.className = 'page-transition';
            overlay.innerHTML = `
                <div class="page-transition-content">
                    <div class="page-transition-spinner"></div>
                    <div class="page-transition-text">Cargando...</div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        this.overlay = document.getElementById('page-transition');
    }

    attachLinkListeners() {
        // Interceptar clicks en links de navegación
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            
            if (link && this.shouldTransition(link)) {
                e.preventDefault();
                this.navigateWithTransition(link.href, link.textContent.trim());
            }
        });
    }

    shouldTransition(link) {
        const href = link.getAttribute('href');
        
        // No hacer transición para:
        // - Links externos
        // - Anchors (#)
        // - JavaScript links
        // - Links que abren en nueva ventana
        if (!href || 
            href.startsWith('#') || 
            href.startsWith('javascript:') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            link.target === '_blank' ||
            href.includes('://') && !href.includes(window.location.origin)) {
            return false;
        }

        return true;
    }

    navigateWithTransition(url, linkText = '') {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        
        // Actualizar texto de carga según el destino
        this.updateLoadingText(linkText);
        
        // Mostrar overlay con animación
        this.showOverlay().then(() => {
            // Simular un pequeño delay para suavizar la transición
            setTimeout(() => {
                window.location.href = url;
            }, 400);
        });
    }

    updateLoadingText(linkText) {
        const textElement = this.overlay.querySelector('.page-transition-text');
        // texto para mostrar cuando se este navegado a  una nueva  pagina.
        if (linkText) {
            const messages = {
                'Inicio': 'Cargando página principal...',
                'Salir': 'Cerrando sesión...',
                'Casa': 'Cargando gestión de hogares...',
                'Gestión': 'Cargando gestión de hogares...',
                'Perfil': 'Cargando perfil...',
                'Configuración': 'Cargando configuración...',
                'Registrarse': 'Cargando formulario de registro...',
                'Iniciar Sesión': 'Cargando formulario de acceso...',
                'Login': 'Cargando formulario de acceso...',
                'Registro': 'Cargando formulario de registro...'
            };
            
            textElement.textContent = messages[linkText] || `Navegando a ${linkText}...`;
        } else {
            textElement.textContent = 'Cargando...';
        }
    }

    showOverlay() {
        return new Promise((resolve) => {
            this.overlay.classList.add('active');
            
            // Resolver cuando termine la animación
            setTimeout(resolve, 100);
        });
    }

    hideOverlay() {
        return new Promise((resolve) => {
            this.overlay.classList.remove('active');
            
            // Esperar a que termine la animación
            setTimeout(() => {
                this.isTransitioning = false;
                resolve();
            }, 600);
        });
    }

    handlePageLoad() {
        // Asegurar que el overlay esté oculto cuando cargue la página
        document.addEventListener('DOMContentLoaded', () => {
            // Pequeño delay para evitar flicker
            setTimeout(() => {
                if (this.overlay) {
                    this.hideOverlay();
                }
                
                // Agregar clase de animación de entrada al contenido
                const main = document.querySelector('.main');
                if (main && !main.classList.contains('page-fade-in')) {
                    main.classList.add('page-fade-in');
                }
            }, 100);
        });

        // También manejar cuando la página ya está cargada
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(() => {
                if (this.overlay) {
                    this.hideOverlay();
                }
            }, 100);
        }
    }

    handleBrowserNavigation() {
        // Manejar navegación con botones del navegador
        window.addEventListener('popstate', () => {
            // No mostrar transición para navegación atrás/adelante
            // ya que el navegador maneja esto nativamente
        });
    }

    // Método público para navegación programática
    navigateTo(url, text = '') {
        this.navigateWithTransition(url, text);
    }

    // Método específico para manejo de formularios de autenticación
    handleAuthFormSubmit(formType = 'login') {
        const messages = {
            'login': 'Iniciando sesión...',
            'register': 'Creando cuenta...',
            'logout': 'Cerrando sesión...'
        };
        
        if (this.overlay) {
            const textElement = this.overlay.querySelector('.page-transition-text');
            textElement.textContent = messages[formType] || 'Procesando...';
            this.showOverlay();
        }
    }
}

// Función global para cerrar sesión con transición
function cerrarSesionConTransicion() {
    const pageTransition = window.pageTransitionInstance;
    
    if (pageTransition) {
        pageTransition.updateLoadingText('Salir');
        pageTransition.showOverlay().then(() => {
            // Limpiar localStorage
            localStorage.removeItem('currentUser');
            localStorage.removeItem('usuario');
            
            // Pequeño delay para mostrar el mensaje de carga
            setTimeout(() => {
                alert('Sesión cerrada exitosamente');
                window.location.href = 'index.html';
            }, 500);
        });
    } else {
        // Fallback si no hay sistema de transiciones
        cerrarSesion();
    }
}

// Función global para navegación con transición desde formularios
function navegarConTransicion(url, mensaje = '') {
    const pageTransition = window.pageTransitionInstance;
    
    if (pageTransition) {
        if (mensaje) {
            const textElement = pageTransition.overlay.querySelector('.page-transition-text');
            textElement.textContent = mensaje;
        }
        pageTransition.navigateWithTransition(url, '');
    } else {
        // Fallback si no hay sistema de transiciones
        window.location.href = url;
    }
}

// Inicializar el sistema de transiciones cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.pageTransitionInstance = new PageTransition();
});

// Exportar para uso en otros archivos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PageTransition;
}
