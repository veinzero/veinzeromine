import { FastifyPluginAsync } from "fastify";

export const healthRoute: FastifyPluginAsync = async (app) => {
  app.get("/health", async () => ({
    ok: true,
    service: "veinzero-backend",
    timestamp: new Date().toISOString()
  }));
};
