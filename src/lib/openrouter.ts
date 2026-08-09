// OpenRouter API integration — configurable AI client & Multimodal Vision Engine
// Default model: openai/gpt-4o-mini (supports text + vision images)
// Admin can override API key + model at runtime via /admin → Settings (stored in DB)

import { getOpenRouterSettings } from "@/lib/settings";

const ENV_OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const ENV_DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export type MessageContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export type MessageContent = string | MessageContentPart[];

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: MessageContent;
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
  { id: "openai/gpt-4o-mini", name: "OpenAI: GPT-4o Mini (Fast & Vision Multimodal)" },
  { id: "openai/gpt-4o", name: "OpenAI: GPT-4o (Flagship Vision Multimodal)" },
  { id: "openai/o3-mini", name: "OpenAI: o3-Mini (Reasoning)" },
  { id: "openai/o1", name: "OpenAI: o1 (High Reasoning)" },
  { id: "openai/gpt-4-turbo", name: "OpenAI: GPT-4 Turbo" },

  // Google Gemini
  { id: "google/gemini-2.0-flash-001", name: "Google: Gemini 2.0 Flash (Fast Vision Multimodal)" },
  { id: "google/gemini-1.5-pro", name: "Google: Gemini 1.5 Pro (Vision Multimodal)" },
  { id: "google/gemini-1.5-flash", name: "Google: Gemini 1.5 Flash" },

  // Anthropic Claude
  { id: "anthropic/claude-3.7-sonnet", name: "Anthropic: Claude 3.7 Sonnet (Hybrid Reasoning & Vision)" },
  { id: "anthropic/claude-3.5-sonnet", name: "Anthropic: Claude 3.5 Sonnet (Vision)" },
  { id: "anthropic/claude-3-haiku", name: "Anthropic: Claude 3 Haiku (Speed)" },

  // Meta Llama & DeepSeek
  { id: "meta-llama/llama-3.3-70b-instruct", name: "Meta: Llama 3.3 70B Instruct" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek: V3 (DeepSeek Chat)" },
  { id: "deepseek/deepseek-r1", name: "DeepSeek: R1 (Reasoning)" },

  // Free Tier OpenRouter Models
  { id: "google/gemini-2.0-flash-exp:free", name: "Google: Gemini 2.0 Flash Vision (Free)" },
  { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Meta: Llama 3.3 70B (Free)" },
  { id: "deepseek/deepseek-r1:free", name: "DeepSeek: R1 (Free)" },
];

/**
 * Call OpenRouter chat completions API (Supports Text & Vision Base64 Images).
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
    console.log("[AI Engine] No OPENROUTER_API_KEY set, using z-ai-web-dev-sdk SDK");
    try {
      const ZAI = (await import("z-ai-web-dev-sdk")).default;
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: messages as never,
        thinking: { type: "disabled" },
      });
      return completion.choices[0]?.message?.content?.trim() || "";
    } catch (sdkErr) {
      console.warn("[AI Engine SDK Error]:", sdkErr);
      throw new Error("AI provider failed or unconfigured.");
    }
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Jinzai - Domain Expansion",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.2, // lower temperature for high-precision OCR extraction
      max_tokens: options.maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[OpenRouter] Vision Chat Error:", response.status, error);
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content?.trim();
  const reasoning = data.choices[0]?.message?.reasoning?.trim();
  return content || reasoning || "";
}

/**
 * Dynamically fetches ALL available models from OpenRouter's live API endpoint.
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
      next: { revalidate: 3600 },
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

      return liveModels.sort((a, b) => a.id.localeCompare(b.id));
    }
  } catch (err) {
    console.warn("[OpenRouter] Model list fetch fallback:", err);
  }

  return CURATED_MODELS;
}

export { ENV_DEFAULT_MODEL as DEFAULT_MODEL, ENV_OPENROUTER_API_KEY as OPENROUTER_API_KEY };
