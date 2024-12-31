import { ref } from 'vue'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from '~/firebase'

export const useAuth = () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Initialize auth state
  onAuthStateChanged(auth, (newUser) => {
    user.value = newUser
    loading.value = false
  })

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      error.value = null
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      return navigateTo('/diary')
    } catch (e) {
      error.value = 'Failed to sign in with Google'
      console.error(e)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      error.value = null
      await firebaseSignOut(auth)
      return navigateTo('/login')
    } catch (e) {
      error.value = 'Failed to sign out'
      console.error(e)
    }
  }

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut
  }
}