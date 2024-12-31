<template>
  <div class="diary-container">
    <header>
      <h1>My Diary</h1>
      <button @click="handleSignOut">Sign Out</button>
    </header>
    
    <div class="entry-editor">
      <textarea
        v-model="currentEntry"
        placeholder="Write your thoughts..."
      ></textarea>
      <button @click="saveEntry">Save Entry</button>
    </div>

    <div class="insights-section">
      <h2>Insights</h2>
      <div v-if="loadingInsights" class="loading">Analyzing your entries...</div>
      <div v-else class="insights">
        <div v-for="(insight, index) in insights" :key="index" class="insight">
          {{ insight }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '../firebase'
import { analyzeEntry } from '~/utils/gemini'

const currentEntry = ref('')
const insights = ref([])
const loadingInsights = ref(false)

const saveEntry = async () => {
  if (!currentEntry.value.trim()) return

  loadingInsights.value = true
  try {
    const analysis = await analyzeEntry(currentEntry.value)
    insights.value = analysis.insights
    currentEntry.value = ''
  } catch (error) {
    console.error('Error analyzing entry:', error)
    insights.value = ['Unable to analyze entry at this time']
  } finally {
    loadingInsights.value = false
  }
}

const handleSignOut = async () => {
  try {
    await firebaseSignOut(auth)
    navigateTo('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script>

<style>
.diary-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.entry-editor {
  margin-bottom: 2rem;
}

textarea {
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
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

.insights-section {
  margin-top: 2rem;
}

.loading {
  color: #666;
  font-style: italic;
}

.insight {
  background-color: #f5f5f5;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 4px;
}
</style>