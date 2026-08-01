// OpenRouter API integration — configurable AI client
// Default model: openai/gpt-4o-mini
// Admin can override API key + model at runtime via /admin → Settings (stored in DB)

import { getOpenRouterSettings } from "@/lib/settings";

const ENV_OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const ENV_DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
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

export interface OpenRouterModelItem {
  id: string;
  name: string;
  context_length?: number;
  pricing?: {
    prompt?: string;
    completion?: string;
  };
}

/**
 * Fallback curated list of major OpenRouter models across all top AI providers.
 */
const CURATED_MODELS: OpenRouterModelItem[] = [
  // OpenAI
  { id: "openai/gpt-4o-mini", name: "OpenAI: GPT-4o Mini (Fast & Efficient)" },
  { id: "openai/gpt-4o", name: "OpenAI: GPT-4o (Flagship Multimodal)" },
  { id: "openai/o3-mini", name: "OpenAI: o3-Mini (Reasoning)" },
  { id: "openai/o1", name: "OpenAI: o1 (High Reasoning)" },
  { id: "openai/gpt-4-turbo", name: "OpenAI: GPT-4 Turbo" },
  { id: "openai/gpt-3.5-turbo", name: "OpenAI: GPT-3.5 Turbo" },

  // Anthropic Claude
  { id: "anthropic/claude-3.7-sonnet", name: "Anthropic: Claude 3.7 Sonnet (Hybrid Reasoning)" },
  { id: "anthropic/claude-3.5-sonnet", name: "Anthropic: Claude 3.5 Sonnet" },
  { id: "anthropic/claude-3-haiku", name: "Anthropic: Claude 3 Haiku (Speed)" },
  { id: "anthropic/claude-3-opus", name: "Anthropic: Claude 3 Opus" },

  // DeepSeek
  { id: "deepseek/deepseek-chat", name: "DeepSeek: V3 (DeepSeek Chat)" },
  { id: "deepseek/deepseek-r1", name: "DeepSeek: R1 (Reasoning)" },
  { id: "deepseek/deepseek-r1-distill-llama-70b", name: "DeepSeek: R1 Distill Llama 70B" },

  // Google Gemini
  { id: "google/gemini-2.0-flash-001", name: "Google: Gemini 2.0 Flash 001" },
  { id: "google/gemini-1.5-pro", name: "Google: Gemini 1.5 Pro" },
  { id: "google/gemini-1.5-flash", name: "Google: Gemini 1.5 Flash" },
  { id: "google/gemini-2.0-pro-exp-02-05", name: "Google: Gemini 2.0 Pro Experimental" },

  // Meta Llama
  { id: "meta-llama/llama-3.3-70b-instruct", name: "Meta: Llama 3.3 70B Instruct" },
  { id: "meta-llama/llama-3.1-405b-instruct", name: "Meta: Llama 3.1 405B Instruct" },
  { id: "meta-llama/llama-3.1-70b-instruct", name: "Meta: Llama 3.1 70B Instruct" },
  { id: "meta-llama/llama-3.1-8b-instruct", name: "Meta: Llama 3.1 8B Instruct" },

  // Mistral AI
  { id: "mistralai/mistral-large-2411", name: "Mistral: Mistral Large 2411" },
  { id: "mistralai/codestral-2501", name: "Mistral: Codestral 2501" },
  { id: "mistralai/pixtral-large-2411", name: "Mistral: Pixtral Large 2411" },

  // Qwen
  { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen: Qwen 2.5 72B Instruct" },
  { id: "qwen/qwq-32b-preview", name: "Qwen: QwQ 32B Preview" },

  // Free Tier OpenRouter Models
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Meta: Llama 3.3 70B (Free)" },
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek: R1 (Free)" },
  { id: "google/gemini-2.0-flash-exp:free", name: "Google: Gemini 2.0 Flash (Free)" },
  { id: "qwen/qwen-2.5-coder-32b-instruct:free", name: "Qwen: Qwen 2.5 Coder 32B (Free)" },
];

/**
 * Call OpenRouter chat completions API.
 * Falls back to z-ai-web-dev-sdk if OPENROUTER_API_KEY is not set.
 */
export async function openRouterChat(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  const settings = await getOpenRouterSettings();
  const apiKey = settings.apiKey;
  const model = options.model || settings.model || ENV_DEFAULT_MODEL;

  // Fallback SDK if no OpenRouter key configured
  if (!apiKey) {
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
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Jinzai — Domain Expansion",
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
  const content = data.choices[0]?.message?.content?.trim();
  const reasoning = data.choices[0]?.message?.reasoning?.trim();
  return content || reasoning || "";
}

/**
 * Dynamically fetches ALL available models from OpenRouter's live API endpoint.
 * Returns all models available for the provided or effective API key.
 */
export async function getAvailableModels(): Promise<OpenRouterModelItem[]> {
  const settings = await getOpenRouterSettings();
  const apiKey = settings.apiKey;

  try {
    const headers: Record<string, string> = {};
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
      headers,
      next: { revalidate: 3600 }, // Cache model list for 1 hour
    });

    if (!response.ok) throw new Error("Failed to fetch OpenRouter models");
    const data = await response.json();

    if (Array.isArray(data?.data) && data.data.length > 0) {
      const liveModels: OpenRouterModelItem[] = data.data.map((m: { id: string; name?: string; context_length?: number; pricing?: any }) => ({
        id: m.id,
        name: m.name || m.id,
        context_length: m.context_length,
        pricing: m.pricing,
      }));

      // Sort models: popular ones first
      return liveModels.sort((a, b) => a.id.localeCompare(b.id));
    }
  } catch (err) {
    console.warn("[OpenRouter] Model list fetch fallback:", err);
  }

  return CURATED_MODELS;
}

export { ENV_DEFAULT_MODEL as DEFAULT_MODEL, ENV_OPENROUTER_API_KEY as OPENROUTER_API_KEY };
