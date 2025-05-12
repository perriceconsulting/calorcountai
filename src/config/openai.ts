export const OPENAI_CONFIG = {
  model: "gpt-4o",
  maxTokens: 300,
  promptTemplate: "Analyze this food image, assuming it was taken from exactly 1 foot away from the plate. Provide the following information in a clean JSON format without markdown: {\"description\": \"food description\", \"macros\": {\"calories\": number, \"protein\": number, \"fat\": number, \"carbs\": number}}"
} as const;