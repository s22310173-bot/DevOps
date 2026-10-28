import { Router } from "express";
import { prisma } from "../db.js";
import { settingsSchema, validationError } from "../validation.js";

export const settingsRouter = Router();

settingsRouter.get("/settings", async (req, res) => {
  const settings = await prisma.pengaturan.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, populasi: 0 },
  });
  res.json({ populasi: settings.populasi });
});

settingsRouter.put("/settings", async (req, res) => {
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: validationError(parsed.error) });
  }
  const settings = await prisma.pengaturan.upsert({
    where: { id: 1 },
    update: { populasi: parsed.data.populasi },
    create: { id: 1, populasi: parsed.data.populasi },
  });
  return res.json({ populasi: settings.populasi });
});
