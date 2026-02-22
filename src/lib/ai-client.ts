/**
 * Mistral AI Client for AdminFlow AI
 * Uses Mistral API for intelligent automation
 */

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface MistralResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

/**
 * Generate AI response using Mistral API
 */
export const generateAIResponse = async (
  prompt: string,
  systemPrompt: string = "You are a professional administrative assistant. Provide clear, concise, and helpful responses."
): Promise<string> => {
  try {
    const mistralKey = process.env.MISTRAL_API_KEY;

    if (!mistralKey) {
      console.warn('MISTRAL_API_KEY not found in environment variables');
      return "⚠️ API key not configured. Please add your Mistral API key to .env file.";
    }

    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Mistral API request failed');
    }

    const data: MistralResponse = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error calling Mistral API:', error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
  }
};

/**
 * Generate email response using AI
 */
export const generateEmailResponse = async (emailContent: string): Promise<string> => {
  const prompt = `Analyze this email and write a professional, helpful response:

Email Content:
${emailContent}

Provide a clear, professional response. If you need more information, ask specific questions.`;

  return generateAIResponse(prompt, "You are a professional administrative assistant responding to business emails. Write concise, professional responses.");
};

/**
 * Summarize email thread
 */
export const summarizeEmailThread = async (threadContent: string): Promise<string> => {
  const prompt = `Summarize this email thread concisely (under 100 words):

${threadContent}

Provide a bullet-point summary of key points and next steps.`;

  return generateAIResponse(prompt, "You are a professional assistant. Summarize email threads in bullet points.");
};

/**
 * Categorize emails by priority
 */
export const categorizeEmailPriority = async (emailContent: string): Promise<string> => {
  const prompt = `Analyze this email and determine its priority:

${emailContent}

Respond with one word only: HIGH, MEDIUM, or LOW.`;

  return generateAIResponse(prompt, "You are an email priority categorizer. Respond with only 'HIGH', 'MEDIUM', or 'LOW'.");
};

/**
 * Generate document using AI
 */
export const generateDocument = async (
  type: 'contract' | 'invoice' | 'proposal' | 'email' | 'meeting-note',
  details: Record<string, string>
): Promise<string> => {
  const prompt = `Generate a professional ${type} document with these details:

${JSON.stringify(details, null, 2)}

Create a well-formatted, professional ${type} with proper structure.`;

  return generateAIResponse(prompt, "You are a professional document generator. Create clean, well-formatted documents.");
};
