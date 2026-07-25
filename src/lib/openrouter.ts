// OpenRouter API integration — configurable AI client
// Default model: meta-llama/llama-3.3-70b-instruct (works in all regions)
// Change via OPENROUTER_MODEL env var — see https://openrouter.ai/models for available models
// Get your API key from https://openrouter.ai/keys

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  model?: string; // override default model
  temperature?: number;
  maxTokens?: number;
}

/**
 * Call OpenRouter chat completions API.
 * Falls back to z-ai-web-dev-sdk if OPENROUTER_API_KEY is not set.
 */
export async function openRouterChat(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  const model = options.model || DEFAULT_MODEL;

  // If no OpenRouter key, fall back to z-ai-web-dev-sdk
  if (!OPENROUTER_API_KEY) {
    console.log("[AI] No OPENROUTER_API_KEY set, falling back to z-ai-web-dev-sdk");
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: messages as never,
      thinking: { type: "disabled" },
    });
    return completion.choices[0]?.message?.content?.trim() || "";
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "ResumeForge",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[OpenRouter] Error:", response.status, error);
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  // Some models (e.g. deepseek) return content in "reasoning" instead of "content"
  const content = data.choices[0]?.message?.content?.trim();
  const reasoning = data.choices[0]?.message?.reasoning?.trim();
  return content || reasoning || "";
}

/**
 * Get available models from OpenRouter (for admin panel model selection).
 */
export async function getAvailableModels(): Promise<{ id: string; name: string }[]> {
  if (!OPENROUTER_API_KEY) {
    return [
      { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B (default, works globally)" },
      { id: "anthropic/claude-sonnet-5", name: "Claude Sonnet 5 (may be region-restricted)" },
      { id: "openai/gpt-oss-20b:free", name: "GPT-OSS 20B (free)" },
      { id: "deepseek/deepseek-v4-pro", name: "DeepSeek V4 Pro" },
    ];
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
      headers: { "Authorization": `Bearer ${OPENROUTER_API_KEY}` },
    });
    if (!response.ok) throw new Error("Failed to fetch models");
    const data = await response.json();
    return (data.data || []).map((m: { id: string; name?: string }) => ({
      id: m.id,
      name: m.name || m.id,
    }));
  } catch {
    return [{ id: DEFAULT_MODEL, name: `${DEFAULT_MODEL} (current)` }];
  }
}

export { DEFAULT_MODEL, OPENROUTER_API_KEY };
