// @ts-nocheck
// Suppress TS errors and use Node globals (process) in Netlify Functions
// @ts-ignore
import { Handler } from '@netlify/functions';
import OpenAI from 'openai';
import { OPENAI_CONFIG } from '../../src/config/openai';
import { cleanJsonResponse, safeJsonParse } from '../../src/utils/jsonParser';
import { convertDataURLToBase64 } from '../../src/utils/canvasUtils';
import type { FoodAnalysis } from '../../src/types/food';

// Use server-side env var (set in Netlify UI)
const rawApiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || '';
const apiKey = rawApiKey.replace(/\s+/g, '');
if (!apiKey) {
  throw new Error('Missing OpenAI API key in environment');
}
const openai = new OpenAI({ apiKey });

export const handler: Handler = async (event) => {
  try {
    const { dataURL } = JSON.parse(event.body || '{}');
    if (typeof dataURL !== 'string' || !dataURL.startsWith('data:image/')) {
      return { statusCode: 400, body: 'Invalid dataURL' };
    }

    const base64Image = convertDataURLToBase64(dataURL);
    if (!base64Image) {
      return { statusCode: 400, body: 'Failed to convert DataURL' };
    }

    const response = await openai.chat.completions.create({
      model: OPENAI_CONFIG.model,
      messages: [
        { role: 'user', content: [
            { type: 'text', text: OPENAI_CONFIG.promptTemplate },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ] }
      ],
      max_tokens: OPENAI_CONFIG.maxTokens,
      temperature: 0,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const cleaned = cleanJsonResponse(content);
    const parsed = safeJsonParse<FoodAnalysis>(cleaned);
    if (!parsed) {
      throw new Error('Failed to parse OpenAI response');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(parsed),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (err: any) {
    return { statusCode: 500, body: err.message };
  }
};
