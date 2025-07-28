// Sistema de autenticación simple para la aplicación
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.initAuth();
    }

    // Inicializar autenticación al cargar la página
    initAuth() {
        const userData = localStorage.getItem('currentUser');
        if (userData && userData !== 'undefined' && userData !== 'null') {
            try {
                const parsedUser = JSON.parse(userData);
                // Validar que el objeto parseado sea válido
                if (parsedUser && typeof parsedUser === 'object' && parsedUser.id) {
                    this.currentUser = parsedUser;
                } else {
                    console.warn('Datos de usuario inválidos en localStorage');
                    localStorage.removeItem('currentUser');
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('currentUser');
            }
        } else if (userData === 'undefined' || userData === 'null') {
            // Limpiar valores inválidos
            localStorage.removeItem('currentUser');
        }
    }

    // Simular login (en producción esto haría una llamada al backend)
    login(userData) {
        // Validar datos de entrada
        if (!userData || typeof userData !== 'object' || !userData.id) {
            console.error('Datos de usuario inválidos para login:', userData);
            return null;
        }
        
        this.currentUser = userData;
        try {
            localStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('Usuario logueado exitosamente:', userData);
        } catch (e) {
            console.error('Error guardando usuario en localStorage:', e);
        }
        return this.currentUser;
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar si hay usuario logueado
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Obtener ID del usuario actual
    getCurrentUserId() {
        return this.currentUser ? this.currentUser.id : null;
    }
}

// Crear instancia global del manager de autenticación
const authManager = new AuthManager();

// Función para simular login con un usuario de prueba
function simulateLogin() {
    const testUser = {
        id: 1,
        nombre: "Usuario de Prueba",
        email: "usuario@prueba.com"
    };
    
    authManager.login(testUser);
    return testUser;
}

// Exportar para uso en otros archivos
window.authManager = authManager;
window.simulateLogin = simulateLogin;
