import { ref } from 'vue'
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  type DocumentData 
} from 'firebase/firestore'
import { db } from '~/firebase'
import { useAuth } from './useAuth'
import { analyzeEntry } from '~/utils/gemini'

export interface DiaryEntry {
  id?: string
  content: string
  timestamp: Date
  userId: string
  mood?: string
  themes?: string[]
  analysis?: {
    emotions: string[]
    themes: string[]
    insights: string[]
    questions: string[]
  }
}

export const useDiary = () => {
  const { user } = useAuth()
  const entries = ref<DiaryEntry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch user's entries
  const fetchEntries = async () => {
    if (!user.value) return

    loading.value = true
    try {
      const entriesRef = collection(db, 'entries')
      const q = query(
        entriesRef,
        where('userId', '==', user.value.uid),
        orderBy('timestamp', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      entries.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DiaryEntry[]
    } catch (e) {
      error.value = 'Failed to fetch entries'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // Save new entry
  const saveEntry = async (content: string) => {
    if (!user.value || !content.trim()) return null

    loading.value = true
    try {
      // Analyze entry using Gemini
      const analysis = await analyzeEntry(content)
      
      const entry: DiaryEntry = {
        content,
        userId: user.value.uid,
        timestamp: new Date(),
        mood: analysis.emotions[0], // Primary emotion
        themes: analysis.themes,
        analysis
      }

      const docRef = await addDoc(collection(db, 'entries'), entry)
      entry.id = docRef.id
      entries.value.unshift(entry)
      
      return entry
    } catch (e) {
      error.value = 'Failed to save entry'
      console.error(e)
      return null
    } finally {
      loading.value = false
    }
  }

  // Get insights across all entries
  const getInsights = async () => {
    if (!entries.value.length) return null

    try {
      const allContent = entries.value
        .map(entry => entry.content)
        .join('\n\n')
      
      return await analyzeEntry(allContent, true)
    } catch (e) {
      error.value = 'Failed to generate insights'
      console.error(e)
      return null
    }
  }

  // Get entry statistics
  const getStats = () => {
    if (!entries.value.length) return null

    const stats = {
      totalEntries: entries.value.length,
      moodDistribution: {} as Record<string, number>,
      commonThemes: new Map<string, number>(),
      averageLength: 0
    }

    entries.value.forEach(entry => {
      // Count moods
      if (entry.mood) {
        stats.moodDistribution[entry.mood] = (stats.moodDistribution[entry.mood] || 0) + 1
      }

      // Count themes
      entry.themes?.forEach(theme => {
        stats.commonThemes.set(theme, (stats.commonThemes.get(theme) || 0) + 1)
      })

      // Calculate average length
      stats.averageLength += entry.content.length
    })

    stats.averageLength = Math.round(stats.averageLength / entries.value.length)

    return stats
  }

  return {
    entries,
    loading,
    error,
    fetchEntries,
    saveEntry,
    getInsights,
    getStats
  }
}