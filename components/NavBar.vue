<template>
  <nav>
    <ul>
      <li><NuxtLink to="/diary">Diary</NuxtLink></li>
      <li><NuxtLink to="/dashboard">Insights</NuxtLink></li>
      <li><button @click="signOut">Sign Out</button></li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { signOut } = useAuth()
</script>

<style scoped>
nav {
  background: #f5f5f5;
  padding: 1rem;
  margin-bottom: 2rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
}

li {
  display: inline-block;
}

a {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

a:hover {
  background: #eee;
}

button {
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 0.5rem 1rem;
}

button:hover {
  background: #eee;
}
</style>