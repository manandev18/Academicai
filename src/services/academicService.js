import { generateContent } from '../config/gemini';

export const breakdownAssignment = async (prompt) => {
  const systemPrompt = `
You are an academic writing guide. Break this assignment into logical sections, each with a heading, purpose, and suggested word count.

Format your response as:
## Section Title - Purpose (Word Count)
Brief description of what should be covered in this section.

Make sure to provide a comprehensive breakdown that helps students structure their work effectively.

Assignment: ${prompt}
  `;

  try {
    const response = await generateContent(systemPrompt);
    return { success: true, data: response };
  } catch (error) {
    console.error('Assignment breakdown error:', error);
    return { success: false, error: error.message };
  }
};

export const reviewDraft = async (draft) => {
  const prompt = `
You are an academic writing coach. Review the following draft for:

1. **Originality and Critical Thinking**: Does the content show original thought and analysis?
2. **Clarity and Academic Tone**: Is the writing clear, professional, and appropriate for academic context?
3. **Logical Flow and Structure**: Does the argument flow logically from point to point?
4. **Evidence and Support**: Are claims properly supported with reasoning or evidence?
5. **Areas for Improvement**: What specific areas need enhancement?

Provide section-wise feedback with specific, actionable suggestions.

Draft:
${draft}
  `;

  try {
    const response = await generateContent(prompt);
    return { success: true, data: response };
  } catch (error) {
    console.error('Draft review error:', error);
    return { success: false, error: error.message };
  }
};

export const suggestSources = async (topic) => {
  const prompt = `
Suggest 5 reliable and ethical academic resources (books, research papers, reputable websites, databases) that a student can use for research on the topic: "${topic}"

For each resource, provide:
1. Title/Name
2. Author(s) or Organization
3. Brief description of relevance
4. Proper citation format (APA style)
5. Why this source is credible and useful

Focus on academic credibility and relevance to the topic.
  `;

  try {
    const response = await generateContent(prompt);
    return { success: true, data: response };
  } catch (error) {
    console.error('Source suggestion error:', error);
    return { success: false, error: error.message };
  }
};