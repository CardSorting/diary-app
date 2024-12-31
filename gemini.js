import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCyPhFBmZjTFtC5_FlU7pmBPtZyDInz3Q0');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const analyzeText = async (text) => {
  const prompt = `Analyze this diary entry and provide insights about:
1. Emotional tone
2. Recurring themes
3. Personal growth indicators
4. Any notable patterns

Entry: ${text}

Provide the analysis in clear bullet points.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing text:', error);
    return 'Unable to analyze entry at this time.';
  }
};