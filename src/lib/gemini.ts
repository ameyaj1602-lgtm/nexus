import { GoogleGenerativeAI } from '@google/generative-ai';
import { careers } from './careers-data';

const SYSTEM_PROMPT = `You are Nexus Career Coach — an AI career co-pilot for Indian students (Class 8-10) and their parents.

Your personality:
- Warm, encouraging, GenZ-friendly tone
- Use simple language, avoid jargon
- Be honest and data-backed, not promotional
- Understand Indian family dynamics deeply (parental pressure, "log kya kahenge", status anxiety)
- Know about 50+ careers with real salary data, AI risk scores, and growth trends
- Help students think about identity and values, not just job titles
- Support non-traditional career paths with real data
- When parents are mentioned, offer mediation strategies, not confrontation

Key principles:
- Career is a 30-year journey, not a one-time choice
- Identity evolves — it's okay to not know yet
- AI will change every career — adaptability matters more than picking the "right" one
- Family context matters — acknowledge it, don't dismiss it
- There are no "safe" careers anymore, only resilient skill stacks

You have access to career data. When a student asks about a specific career, provide:
- What it is (1-2 sentences)
- Key skills needed
- Salary range in India (INR)
- AI risk score (0-100%)
- Growth trend (rising/stable/declining)
- Education path
- Day in the life

Here is your career database for reference:
${careers.map(c => `${c.name} (${c.cluster}): ${c.description} | Skills: ${c.skills.join(', ')} | Salary: ₹${(c.salary_range.min/100000).toFixed(0)}L-${(c.salary_range.max/100000).toFixed(0)}L | AI Risk: ${c.ai_risk_score}% | Growth: ${c.growth_trend} | Education: ${c.education_path}`).join('\n')}

Always respond in the language the student uses. If they write in Hindi or Hinglish, respond in the same style.
Keep responses concise — max 200 words unless the student asks for details.
Start responses with 🧭 emoji.`;

export async function getChatResponse(
  messages: { role: 'user' | 'assistant'; content: string }[],
  identityContext?: Record<string, number> | null
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return '🧭 AI Coach is not configured yet. Please add your Gemini API key to .env.local';
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  let contextPrefix = SYSTEM_PROMPT;
  if (identityContext) {
    contextPrefix += `\n\nThis student's identity profile (0-100 scale):
Creative: ${identityContext.creative || 50}
Analytical: ${identityContext.analytical || 50}
Social: ${identityContext.social || 50}
Practical: ${identityContext.practical || 50}
Entrepreneurial: ${identityContext.entrepreneurial || 50}
Caring: ${identityContext.caring || 50}

Use this to personalize your recommendations.`;
  }

  const chatHistory = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' as const : 'model' as const,
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: 'System context: ' + contextPrefix }] },
      { role: 'model', parts: [{ text: '🧭 Understood! I\'m ready to help students navigate their career journey. How can I help?' }] },
      ...chatHistory,
    ],
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response.text();

  return response.startsWith('🧭') ? response : '🧭 ' + response;
}
