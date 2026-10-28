import { Router } from "express";
import { prisma } from "../db.js";
import { parseDate, formatDate } from "../dates.js";
import {
  pakanSchema,
  penggunaanSchema,
  produksiSchema,
  penjualanSchema,
  pengeluaranSchema,
} from "../validation.js";
import { createCrudRouter } from "./crud.js";

export const entitiesRouter = Router();

entitiesRouter.use(
  "/pakan",
  createCrudRouter({
    model: prisma.pakan,
    schema: pakanSchema,
    toData: (value) => ({
      tanggal: parseDate(value.tanggal),
      nama: value.nama,
      jumlah: value.jumlah,
      harga: value.harga,
    }),
    serialize: (row) => ({
      id: row.id,
      tanggal: formatDate(row.tanggal),
      nama: row.nama,
      jumlah: Number(row.jumlah),
      harga: row.harga,
    }),
  }),
);

entitiesRouter.use(
  "/penggunaan",
  createCrudRouter({
    model: prisma.penggunaanPakan,
    schema: penggunaanSchema,
    toData: (value) => ({
      tanggal: parseDate(value.tanggal),
      nama: value.nama,
      jumlah: value.jumlah,
    }),
    serialize: (row) => ({
      id: row.id,
      tanggal: formatDate(row.tanggal),
      nama: row.nama,
      jumlah: Number(row.jumlah),
    }),
  }),
);

entitiesRouter.use(
  "/produksi",
  createCrudRouter({
    model: prisma.produksiTelur,
    schema: produksiSchema,
    toData: (value) => ({
      tanggal: parseDate(value.tanggal),
      jumlah: value.jumlah,
      rusak: value.rusak,
    }),
    serialize: (row) => ({
      id: row.id,
      tanggal: formatDate(row.tanggal),
      jumlah: row.jumlah,
      rusak: row.rusak,
    }),
    checkConflict: async (data, id) => {
      const duplicate = await prisma.produksiTelur.findFirst({
        where: {
          tanggal: data.tanggal,
          deletedAt: null,
          ...(id ? { id: { not: id } } : {}),
        },
      });
      return duplicate
        ? "Produksi untuk tanggal ini sudah ada. Edit catatan tersebut."
        : null;
    },
  }),
);

entitiesRouter.use(
  "/penjualan",
  createCrudRouter({
    model: prisma.penjualanTelur,
    schema: penjualanSchema,
    toData: (value) => ({
      tanggal: parseDate(value.tanggal),
      jumlah: value.jumlah,
      harga: value.harga,
      pelanggan: value.pelanggan,
    }),
    serialize: (row) => ({
      id: row.id,
      tanggal: formatDate(row.tanggal),
      jumlah: row.jumlah,
      harga: row.harga,
      pelanggan: row.pelanggan,
    }),
  }),
);

entitiesRouter.use(
  "/pengeluaran",
  createCrudRouter({
    model: prisma.pengeluaran,
    schema: pengeluaranSchema,
    toData: (value) => ({
      tanggal: parseDate(value.tanggal),
      nama: value.nama,
      jumlah: value.jumlah,
      keterangan: value.keterangan,
    }),
    serialize: (row) => ({
      id: row.id,
      tanggal: formatDate(row.tanggal),
      nama: row.nama,
      jumlah: row.jumlah,
      keterangan: row.keterangan,
    }),
  }),
);
