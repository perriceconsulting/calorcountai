export const OPENAI_CONFIG = {
  model: "gpt-4o",
  maxTokens: 300,
  promptTemplate: "As your personal coach, please analyze this food image (taken from exactly 1 foot away) and provide best-practice nutrition suggestions. Then, deliver the following information in a clean JSON format without markdown: {\"description\": \"food description\", \"macros\": {\"calories\": number, \"protein\": number, \"fat\": number, \"carbs\": number}}"
} as const;