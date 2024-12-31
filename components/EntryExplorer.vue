<template>
  <div class="entry-explorer">
    <h2>Explore Past Entries</h2>
    
    <div class="search-controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search entries..."
        @input="searchEntries"
      />
      <select v-model="sortBy" @change="sortEntries">
        <option value="date">Date</option>
        <option value="mood">Mood</option>
        <option value="length">Length</option>
      </select>
    </div>

    <div class="entries-list">
      <div v-if="loading" class="loading">Loading entries...</div>
      <div v-else>
        <div
          v-for="entry in filteredEntries"
          :key="entry.id"
          class="entry-item"
          @click="selectEntry(entry)"
        >
          <div class="entry-header">
            <span class="entry-date">{{ formatDate(entry.timestamp) }}</span>
            <span class="entry-mood">{{ entry.mood || 'No mood' }}</span>
          </div>
          <div class="entry-preview">
            {{ entry.content.substring(0, 100) }}...
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedEntry" class="entry-detail">
      <h3>{{ formatDate(selectedEntry.timestamp) }}</h3>
      <div class="entry-content">{{ selectedEntry.content }}</div>
      <div class="entry-analysis">
        <h4>Analysis</h4>
        <div v-if="selectedEntry.analysis">
          <div class="analysis-section">
            <h5>Emotions</h5>
            <div class="emotions">
              <span
                v-for="emotion in selectedEntry.analysis.emotions"
                :key="emotion"
                class="emotion"
              >
                {{ emotion }}
              </span>
            </div>
          </div>
          <div class="analysis-section">
            <h5>Themes</h5>
            <div class="themes">
              <span
                v-for="theme in selectedEntry.analysis.themes"
                :key="theme"
                class="theme"
              >
                {{ theme }}
              </span>
            </div>
          </div>
        </div>
        <div v-else>No analysis available</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDiary } from '~/composables/useDiary'

const { entries } = useDiary()
const searchQuery = ref('')
const sortBy = ref('date')
const selectedEntry = ref(null)
const loading = ref(false)

const filteredEntries = computed(() => {
  let filtered = entries.value

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(entry =>
      entry.content.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Sort entries
  switch (sortBy.value) {
    case 'date':
      filtered.sort((a, b) => b.timestamp - a.timestamp)
      break
    case 'mood':
      filtered.sort((a, b) => (a.mood || '').localeCompare(b.mood || ''))
      break
    case 'length':
      filtered.sort((a, b) => b.content.length - a.content.length)
      break
  }

  return filtered
})

const searchEntries = () => {
  // Debounced search could be implemented here
}

const sortEntries = () => {
  // Sorting is handled in computed property
}

const selectEntry = (entry) => {
  selectedEntry.value = entry
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString()
}
</script>

<style scoped>
.entry-explorer {
  margin: 2rem 0;
}

.search-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.entries-list {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 0.5rem;
}

.entry-item {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.entry-item:hover {
  background-color: #f5f5f5;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.entry-preview {
  color: #333;
}

.entry-detail {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.entry-content {
  white-space: pre-wrap;
  margin: 1rem 0;
}

.analysis-section {
  margin: 1rem 0;
}

.emotions,
.themes {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.emotion,
.theme {
  background-color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #eee;
}

.loading {
  color: #666;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}
</style>