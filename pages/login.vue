<template>
  <div class="login-container">
    <h1>Diary App</h1>
    <div class="auth-buttons">
      <button @click="signInWithGoogle">Sign in with Google</button>
    </div>
  </div>
</template>

<script setup>
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    navigateTo('/diary');
  } catch (error) {
    console.error('Error signing in:', error);
  }
};
</script>

<style>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
}

.auth-buttons {
  margin-top: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #4285F4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #357ABD;
}
</style>