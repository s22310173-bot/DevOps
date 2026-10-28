import { Router } from "express";
import { currentMonth } from "../dates.js";
import { buildSummary } from "../summary.js";

export const summaryRouter = Router();

summaryRouter.get("/summary", async (req, res) => {
  const month = req.query.month || currentMonth();
  const summary = await buildSummary(month);
  if (!summary) {
    return res.status(400).json({ error: "Periode tidak valid" });
  }
  return res.json(summary);
});
