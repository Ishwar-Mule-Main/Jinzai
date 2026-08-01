// Site settings storage — DB-backed settings with env fallback
// Allows admin to change OpenRouter API key + model at runtime without redeploy

import { db } from "@/lib/db";

export interface OpenRouterSettings {
  apiKey: string;
  model: string;
}

/**
 * Get the effective OpenRouter settings (DB overrides env).
 */
export async function getOpenRouterSettings(): Promise<OpenRouterSettings> {
  const envKey = process.env.OPENROUTER_API_KEY || "";
  const envModel = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

  try {
    const rows = await db.siteSettings.findMany({
      where: { key: { in: ["openrouter_api_key", "openrouter_model"] } },
    });
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;

    return {
      apiKey: map.openrouter_api_key || envKey,
      model: map.openrouter_model || envModel,
    };
  } catch {
    // If DB unavailable, fall back to env
    return { apiKey: envKey, model: envModel };
  }
}

/**
 * Persist OpenRouter settings to DB (overrides env).
 */
export async function setOpenRouterSettings(data: Partial<OpenRouterSettings>): Promise<void> {
  if (data.apiKey !== undefined) {
    await db.siteSettings.upsert({
      where: { key: "openrouter_api_key" },
      update: { value: data.apiKey },
      create: { key: "openrouter_api_key", value: data.apiKey },
    });
  }
  if (data.model !== undefined) {
    await db.siteSettings.upsert({
      where: { key: "openrouter_model" },
      update: { value: data.model },
      create: { key: "openrouter_model", value: data.model },
    });
  }
}

/**
 * Generic settings getter/setter for future use.
 */
export async function getSetting(key: string, fallback = ""): Promise<string> {
  try {
    const row = await db.siteSettings.findUnique({ where: { key } });
    return row?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db.siteSettings.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
