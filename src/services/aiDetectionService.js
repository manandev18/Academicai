import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { generateContent } from '../config/gemini';

const parseConfidenceLevel = (responseText) => {
  const match = responseText.match(/(High|Medium|Low)/i);
  return match ? match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase() : 'Unknown';
};

const getRiskColor = (confidence) => {
  const colors = {
    'High': '🔴 High Risk (AI-generated)',
    'Medium': '🟡 Medium Risk',
    'Low': '🟢 Low Risk'
  };
  return colors[confidence] || '⚪ Unknown';
};

export const detectAIContent = async (text) => {
  const prompt = `
You are an academic integrity agent. A student submitted this essay draft:

${text}

Does this appear to be written by an AI? Analyze the following aspects:
1. Writing patterns and style consistency
2. Depth of personal insight and critical thinking
3. Use of generic phrases or overly polished language
4. Logical flow and argumentation structure
5. Evidence of human experience and perspective

Explain your reasoning and give a confidence level (High, Medium, Low) for AI generation likelihood.

Format your response with clear reasoning followed by your confidence assessment.
  `;

  try {
    const analysis = await generateContent(prompt);
    const confidence = parseConfidenceLevel(analysis);
    
    return {
      success: true,
      data: {
        confidence,
        explanation: analysis,
        indicator: getRiskColor(confidence)
      }
    };
  } catch (error) {
    console.error('AI Detection Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const saveAIDetectionReport = async (userId, text, result) => {
  try {
    const docRef = await addDoc(collection(db, 'ai_detection_reports'), {
      userId,
      text,
      confidence: result.confidence,
      explanation: result.explanation,
      indicator: result.indicator,
      timestamp: Timestamp.now()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving AI detection report:', error);
    return { success: false, error: error.message };
  }
};

export const getUserAIReports = async (userId) => {
  try {
    const q = query(
      collection(db, 'ai_detection_reports'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const reports = [];
    
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      });
    });
    
    return { success: true, data: reports };
  } catch (error) {
    console.error('Error fetching AI reports:', error);
    return { success: false, error: error.message };
  }
};