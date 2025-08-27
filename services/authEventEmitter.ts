/**
 * EventEmitter personalizado compatible con React Native
 * Implementación simple sin dependencias de Node.js
 */
class AuthEventEmitter {
	private listeners: {[key: string]: (() => void)[]} = {};

	/**
	 * Agregar un listener para un evento
	 */
	on(event: string, callback: () => void) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	}

	/**
	 * Remover un listener
	 */
	off(event: string, callback: () => void) {
		if (this.listeners[event]) {
			this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
		}
	}

	/**
	 * Emitir un evento
	 */
	emit(event: string) {
		if (this.listeners[event]) {
			this.listeners[event].forEach((callback) => {
				try {
					callback();
				} catch (error) {
					console.error('❌ Error en callback del evento:', event, error);
				}
			});
		}
	}

	/**
	 * Emitir evento de token expirado
	 */
	emitTokenExpired() {
		console.log('🔔 AuthEventEmitter: Emitiendo evento de token expirado');
		this.emit('tokenExpired');
	}

	/**
	 * Emitir evento de logout
	 */
	emitLogout() {
		console.log('🔔 AuthEventEmitter: Emitiendo evento de logout');
		this.emit('logout');
	}

	/**
	 * Emitir evento de login exitoso
	 */
	emitLoginSuccess() {
		console.log('🔔 AuthEventEmitter: Emitiendo evento de login exitoso');
		this.emit('loginSuccess');
	}
}

// Instancia singleton
export const authEventEmitter = new AuthEventEmitter();

// Tipos de eventos disponibles
export type AuthEventType = 'tokenExpired' | 'logout' | 'loginSuccess';

// Función helper para emitir eventos
export const emitAuthEvent = (eventType: AuthEventType) => {
	switch (eventType) {
		case 'tokenExpired':
			authEventEmitter.emitTokenExpired();
			break;
		case 'logout':
			authEventEmitter.emitLogout();
			break;
		case 'loginSuccess':
			authEventEmitter.emitLoginSuccess();
			break;
	}
};
