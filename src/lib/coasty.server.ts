/**
 * Server-only Coasty AI client.
 * The API key never leaves the server and is never returned to the browser.
 */

const DEFAULT_BASE_URL = "https://api.coasty.ai/v1";

export type CoastyResult = {
  ok: boolean;
  status: number;
  data: unknown;
  message: string;
};

export function coastyConfigured(): boolean {
  return Boolean(process.env["COASTY_API_KEY"]);
}

export async function runCoastyAction(input: {
  action: string;
  company: Record<string, unknown>;
  payload: Record<string, unknown>;
}): Promise<CoastyResult> {
  const apiKey = process.env["COASTY_API_KEY"];
  if (!apiKey) {
    return { ok: false, status: 0, data: null, message: "Coasty AI key is not configured" };
  }
  const baseUrl = process.env["COASTY_API_URL"] ?? DEFAULT_BASE_URL;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const res = await fetch(`${baseUrl}/actions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: input.action,
        context: input.company,
        input: input.payload,
      }),
      signal: controller.signal,
    });

    const text = await res.text();
    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      /* keep raw text */
    }

    return {
      ok: res.ok,
      status: res.status,
      data,
      message: res.ok
        ? "Coasty AI completed the action"
        : `Coasty AI responded ${res.status}: ${text.slice(0, 400)}`,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      message: error instanceof Error ? error.message : "Coasty AI request failed",
    };
  } finally {
    clearTimeout(timeout);
  }
}
