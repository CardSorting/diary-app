import { ref } from 'vue'
import { useDiary } from './useDiary'

export const useAudio = () => {
  const { getInsights } = useDiary()
  const isPlaying = ref(false)
  const audio = ref<HTMLAudioElement | null>(null)

  const generateSummary = async () => {
    try {
      const insights = await getInsights()
      if (!insights) return null

      // Convert insights to text
      const text = insights.insights.join('\n')

      // Use Web Speech API for text-to-speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.volume = 1

      return utterance
    } catch (error) {
      console.error('Error generating audio summary:', error)
      return null
    }
  }

  const playSummary = async () => {
    const utterance = await generateSummary()
    if (utterance) {
      isPlaying.value = true
      speechSynthesis.speak(utterance)
      
      utterance.onend = () => {
        isPlaying.value = false
      }
    }
  }

  const stopSummary = () => {
    speechSynthesis.cancel()
    isPlaying.value = false
  }

  return {
    isPlaying,
    playSummary,
    stopSummary
  }
}