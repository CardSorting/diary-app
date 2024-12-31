<template>
  <div>Redirecting...</div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const { user } = useAuth()

onMounted(() => {
  if (user.value) {
    navigateTo('/diary')
  } else {
    navigateTo('/login')
  }
})
</script>