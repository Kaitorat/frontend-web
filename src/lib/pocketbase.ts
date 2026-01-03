import PocketBase from 'pocketbase'

const pbUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090'

export const pb = new PocketBase(pbUrl)

// PocketBase maneja automáticamente el localStorage para la autenticación
// No necesitamos configurar nada adicional

export default pb
