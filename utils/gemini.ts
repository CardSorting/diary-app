import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI('AIzaSyCyPhFBmZjTFtC5_FlU7pmBPtZyDInz3Q0')
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

interface AnalysisResult {
  emotions: string[]
  themes: string[]
  insights: string[]
  questions: string[]
}

export const analyzeEntry = async (content: string, isBulk = false): Promise<AnalysisResult> => {
  const prompt = isBulk 
    ? `Analyze these diary entries and provide:
1. Overall emotional patterns
2. Recurring themes
3. Key insights about the writer's life
4. Thought-provoking questions for reflection

Entries: ${content}

Provide the analysis in JSON format with arrays for emotions, themes, insights, and questions.`
    : `Analyze this diary entry and provide:
1. Primary emotions
2. Key themes
3. Personal insights
4. Reflection questions

Entry: ${content}

Provide the analysis in JSON format with arrays for emotions, themes, insights, and questions.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parse the JSON response
    const analysis = JSON.parse(text) as AnalysisResult
    return analysis
  } catch (error) {
    console.error('Error analyzing entry:', error)
    return {
      emotions: [],
      themes: [],
      insights: ['Unable to analyze entry at this time'],
      questions: []
    }
  }
}