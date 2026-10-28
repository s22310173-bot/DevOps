import express from "express";
import { prisma } from "./db.js";
import { entitiesRouter } from "./routes/entities.js";
import { settingsRouter } from "./routes/settings.js";
import { summaryRouter } from "./routes/summary.js";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use("/api", entitiesRouter);
  app.use("/api", settingsRouter);
  app.use("/api", summaryRouter);

  app.get("/api/health", async (req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  });

  app.use("/api", (req, res) => {
    res.status(404).json({ error: "Endpoint tidak ditemukan" });
  });

  app.use((error, req, res, _next) => {
    console.error(`[${new Date().toISOString()}]`, error.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  });

  return app;
}
