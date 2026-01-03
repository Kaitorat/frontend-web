import { pb } from './pocketbase'

export async function login(email: string, password: string) {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password)
    return authData
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export function logout() {
  pb.authStore.clear()
}

export function isAuthenticated() {
  return pb.authStore.isValid
}

export function getCurrentUser() {
  return pb.authStore.model
}
