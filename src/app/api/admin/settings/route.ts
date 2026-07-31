import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, adminUnauthorized } from "@/lib/admin-auth";
import { getOpenRouterSettings, setOpenRouterSettings } from "@/lib/settings";
import { getAvailableModels } from "@/lib/openrouter";

export const runtime = "nodejs";

// GET /api/admin/settings — current OpenRouter settings + available models
export async function GET(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const settings = await getOpenRouterSettings();
    const models = await getAvailableModels();
    // Mask the API key for display (show only last 4 + first 8 chars)
    const maskedKey = settings.apiKey
      ? settings.apiKey.slice(0, 8) + "••••••••••••••••" + settings.apiKey.slice(-4)
      : "";
    return NextResponse.json({
      apiKey: maskedKey,
      hasApiKey: !!settings.apiKey,
      apiKeyLength: settings.apiKey.length,
      model: settings.model,
      models,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// PUT /api/admin/settings — update OpenRouter API key and/or model
export async function PUT(req: NextRequest) {
  try {
    if (!verifyAdmin(req)) return adminUnauthorized();
    const body = await req.json();
    const { apiKey, model } = body;

    // Only update fields that are provided and non-empty
    const updates: { apiKey?: string; model?: string } = {};
    if (apiKey && apiKey.trim() && !apiKey.includes("••••")) {
      updates.apiKey = apiKey.trim();
    }
    if (model && model.trim()) {
      updates.model = model.trim();
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await setOpenRouterSettings(updates);
    const settings = await getOpenRouterSettings();
    const models = await getAvailableModels();
    const maskedKey = settings.apiKey
      ? settings.apiKey.slice(0, 8) + "••••••••••••••••" + settings.apiKey.slice(-4)
      : "";

    return NextResponse.json({
      success: true,
      apiKey: maskedKey,
      hasApiKey: !!settings.apiKey,
      apiKeyLength: settings.apiKey.length,
      model: settings.model,
      models,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
