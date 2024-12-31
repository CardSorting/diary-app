<template>
  <div class="dashboard">
    <h1>Insights Dashboard</h1>
    
    <div class="audio-controls">
      <button @click="playSummary" :disabled="isPlaying">
        {{ isPlaying ? 'Playing...' : 'Play Audio Summary' }}
      </button>
      <button @click="stopSummary" v-if="isPlaying">Stop</button>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Entries</h3>
        <p>{{ stats?.totalEntries || 0 }}</p>
      </div>
      
      <div class="stat-card">
        <h3>Average Entry Length</h3>
        <p>{{ stats?.averageLength || 0 }} characters</p>
      </div>
    </div>

    <div class="insights-section">
      <h2>Mood Trends</h2>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else>
        <div v-for="(count, mood) in stats?.moodDistribution" :key="mood" class="mood-item">
          <span class="mood-label">{{ mood }}</span>
          <div class="mood-bar" :style="{ width: `${(count / stats.totalEntries) * 100}%` }"></div>
        </div>
      </div>
    </div>

    <div class="insights-section">
      <h2>Common Themes</h2>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else>
        <div v-for="[theme, count] in stats?.commonThemes" :key="theme" class="theme-item">
          <span class="theme-label">{{ theme }}</span>
          <span class="theme-count">{{ count }}</span>
        </div>
      </div>
    </div>

    <div class="insights-section">
      <h2>Recent Insights</h2>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else>
        <div v-for="(insight, index) in insights" :key="index" class="insight-item">
          {{ insight }}
        </div>
      </div>
    </div>

    <div class="insights-section">
      <h2>Journal Prompts</h2>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else>
        <div v-for="(question, index) in questions" :key="index" class="question-item">
          {{ question }}
        </div>
      </div>
    </div>

    <EntryExplorer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDiary } from '~/composables/useDiary'
import { useAudio } from '~/composables/useAudio'
import EntryExplorer from '~/components/EntryExplorer.vue'

const { getStats, getInsights } = useDiary()
const { isPlaying, playSummary, stopSummary } = useAudio()

const stats = ref<ReturnType<typeof getStats>>(null)
const insights = ref<string[]>([])
const questions = ref<string[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    stats.value = getStats()
    const analysis = await getInsights()
    if (analysis) {
      insights.value = analysis.insights
      questions.value = analysis.questions
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
}

.audio-controls {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f5f5f5;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: #666;
}

.stat-card p {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.insights-section {
  margin-bottom: 2rem;
}

.mood-item {
  margin: 0.5rem 0;
}

.mood-label {
  display: inline-block;
  width: 100px;
}

.mood-bar {
  height: 10px;
  background: #4285F4;
  border-radius: 4px;
}

.theme-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.insight-item,
.question-item {
  background: #f5f5f5;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 4px;
}

.loading {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #4285F4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

button:hover {
  background-color: #357ABD;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>