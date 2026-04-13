import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { AgentMemory } from "../lib/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const memoryFilePath = path.resolve(__dirname, "../../data/agent-memory.json");

function buildDefaultMemory(agentId: number): AgentMemory {
  return {
    agentId,
    preferredUpgrade: "efficiency",
    fatigueIndex: 0.25,
    ambition: 0.68,
    cyclesObserved: 0,
    lastAction: null,
    lastDecisionAt: null,
    lastMineYield: "0",
    notes: ["Freshly commissioned by the Overseer."]
  };
}

export class AgentMemoryStore {
  async get(agentId: number): Promise<AgentMemory> {
    const memoryMap = await this.readAll();
    const existing = memoryMap[String(agentId)];
    return existing ?? buildDefaultMemory(agentId);
  }

  async update(agentId: number, updater: (memory: AgentMemory) => AgentMemory): Promise<AgentMemory> {
    const memoryMap = await this.readAll();
    const current = memoryMap[String(agentId)] ?? buildDefaultMemory(agentId);
    const next = updater(current);
    memoryMap[String(agentId)] = next;
    await this.writeAll(memoryMap);
    return next;
  }

  private async readAll(): Promise<Record<string, AgentMemory>> {
    try {
      const raw = await readFile(memoryFilePath, "utf8");
      return JSON.parse(raw) as Record<string, AgentMemory>;
    } catch {
      return {};
    }
  }

  private async writeAll(memoryMap: Record<string, AgentMemory>) {
    await mkdir(path.dirname(memoryFilePath), { recursive: true });
    await writeFile(memoryFilePath, JSON.stringify(memoryMap, null, 2));
  }
}
