import { Router } from "express";
import { validationError } from "../validation.js";

const where = { deletedAt: null };
const order = [{ tanggal: "desc" }, { id: "desc" }];

function softDelete(model) {
  return async (req, res) => {
    const id = Number(req.params.id);
    const result = await model.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (result.count === 0) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    return res.status(204).end();
  };
}

export function createCrudRouter(config) {
  const { model, schema, toData, serialize, checkConflict } = config;
  const router = Router();

  router.get("/", async (req, res) => {
    const rows = await model.findMany({ where, orderBy: order });
    res.json(rows.map(serialize));
  });

  router.post("/", async (req, res) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: validationError(parsed.error) });
    }
    const data = toData(parsed.data);
    if (checkConflict) {
      const error = await checkConflict(data, null);
      if (error) return res.status(409).json({ error });
    }
    const row = await model.create({ data });
    return res.status(201).json(serialize(row));
  });

  router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const existing = await model.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: validationError(parsed.error) });
    }
    const data = toData(parsed.data);
    if (checkConflict) {
      const error = await checkConflict(data, id);
      if (error) return res.status(409).json({ error });
    }
    const row = await model.update({ where: { id }, data });
    return res.json(serialize(row));
  });

  router.delete("/:id", softDelete(model));

  return router;
}
