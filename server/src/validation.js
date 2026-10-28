import { z } from "zod";
import { parseDate } from "./dates.js";

const dateField = z
  .string()
  .refine((value) => parseDate(value) !== null, "Tanggal tidak valid");

const text = (max) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => (value ? value : null));

const positiveAmount = z.coerce
  .number()
  .positive("Jumlah harus lebih dari 0");

const nonNegativeInt = z.coerce
  .number()
  .int("Harus bilangan bulat")
  .min(0, "Tidak boleh negatif");

const positiveInt = z.coerce
  .number()
  .int("Harus bilangan bulat")
  .positive("Jumlah harus lebih dari 0");

export const pakanSchema = z.object({
  tanggal: dateField,
  nama: z.string().trim().min(1, "Nama pakan wajib diisi").max(120),
  jumlah: positiveAmount,
  harga: nonNegativeInt,
});

export const penggunaanSchema = z.object({
  tanggal: dateField,
  nama: text(120),
  jumlah: positiveAmount,
});

export const produksiSchema = z
  .object({
    tanggal: dateField,
    jumlah: nonNegativeInt,
    rusak: nonNegativeInt.default(0),
  })
  .refine((value) => value.rusak <= value.jumlah, {
    message: "Telur rusak tidak boleh melebihi total produksi",
    path: ["rusak"],
  });

export const penjualanSchema = z.object({
  tanggal: dateField,
  jumlah: positiveInt,
  harga: nonNegativeInt,
  pelanggan: text(120),
});

export const pengeluaranSchema = z.object({
  tanggal: dateField,
  nama: z.string().trim().min(1, "Kategori biaya wajib diisi").max(120),
  jumlah: positiveInt,
  keterangan: text(255),
});

export const settingsSchema = z.object({
  populasi: nonNegativeInt,
});

export function validationError(error) {
  const issue = error.issues?.[0];
  return issue ? issue.message : "Data tidak valid";
}
