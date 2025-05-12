export function cleanJsonResponse(content: string): string {
  try {
    // First try to parse as-is in case it's already valid JSON
    JSON.parse(content);
    return content;
  } catch {
    // If not valid JSON, try to extract from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    const cleaned = jsonMatch ? jsonMatch[1].trim() : content.trim();
    
    // Remove any potential markdown formatting or extra characters
    return cleaned.replace(/^[^{]*({.*})[^}]*$/s, '$1');
  }
}

export function safeJsonParse<T>(content: string): T | null {
  try {
    // Attempt to parse the cleaned content
    const parsed = JSON.parse(content) as T;
    
    // Validate the parsed object has the expected shape
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null;
  }
}