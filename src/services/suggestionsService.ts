import OpenAI from 'openai';
import { OPENAI_CONFIG } from '../config/openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Fetches alternative or better food suggestions for a given item.
 */
export async function fetchSuggestions(item: string): Promise<string[]> {
  const prompt = `Suggest 5 healthier or more protein-rich alternatives or complementary foods for: ${item}. Respond with a JSON array of strings.`;
  const response = await openai.chat.completions.create({
    model: OPENAI_CONFIG.model,
    messages: [
      { role: 'system', content: 'You are a nutrition assistant suggesting healthier food alternatives.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 200,
    temperature: 0.7
  });
  const content = response.choices[0]?.message?.content || '[]';
  // attempt to extract JSON array substring from response
  let jsonText = content.trim();
  const startIdx = jsonText.indexOf('[');
  const endIdx = jsonText.lastIndexOf(']');
  if (startIdx > -1 && endIdx > startIdx) {
    const jsonSubstring = jsonText.substring(startIdx, endIdx + 1);
    try {
      const arr = JSON.parse(jsonSubstring);
    if (Array.isArray(arr)) {
      return arr
        .map(s => typeof s === 'string' ? s.trim() : String(s))
        .filter(s => s.toLowerCase() !== 'json' && s.length > 0);
    }
    } catch {
      // ignore parse errors and fallback
    }
  }
  // fallback: remove code fences and extract clean lines
  const cleanedContent = content
    .replace(/```.*?```/gs, '')   // remove fenced code blocks
    .replace(/```/g, '')          // remove any remaining backticks
    .trim();
  // If cleanedContent is a JSON array string, parse it directly
  try {
    const direct = JSON.parse(cleanedContent);
    if (Array.isArray(direct)) {
      return direct
        .map(s => (typeof s === 'string' ? s.trim() : String(s)))
        .filter(s => s.toLowerCase() !== 'json' && s.length > 0);
    }
  } catch {
    // ignore and proceed to line-by-line fallback
  }
  return cleanedContent
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !/^\[|\]$/.test(line) && !/^```/.test(line) && !/^\s*json\s*$/i.test(line))
    .map(line =>
      line
        .replace(/^[-*]\s*/, '')                // remove bullet
        .replace(/^\d+\.?\s*/, '')            // remove numbering
        .replace(/^"|"$/g, '')                 // strip surrounding quotes
        .replace(/,$/, '')                       // remove trailing commas
        .trim()
    )
    .filter(item => item.toLowerCase() !== 'json');
}
