import { fallbackAgentDetail, fallbackOverview } from "./fallback-data";
import { AgentDetailPayload, OverviewPayload } from "./types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      next: { revalidate: 10 }
    });

    if (!response.ok) {
      return fallback;
    }

    return response.json() as Promise<T>;
  } catch {
    return fallback;
  }
}

export function getOverview() {
  return fetchJson<OverviewPayload>("/api/game/overview", fallbackOverview);
}

export function getAgentDetail(agentId: number) {
  return fetchJson<AgentDetailPayload>(`/api/agents/${agentId}`, fallbackAgentDetail(agentId));
}
