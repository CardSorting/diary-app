<template>
  <div>
    <NavBar />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/NavBar.vue'
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.5;
}
</style>
