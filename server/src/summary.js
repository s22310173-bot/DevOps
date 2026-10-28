import { prisma } from "./db.js";
import { monthRange } from "./dates.js";

const num = (value) => Number(value ?? 0);
const sum = (rows, pick) => rows.reduce((total, row) => total + pick(row), 0);

export async function buildSummary(month) {
  const range = monthRange(month);
  if (!range) return null;

  const active = { deletedAt: null };
  const inMonth = {
    deletedAt: null,
    tanggal: { gte: range.start, lt: range.end },
  };

  const [
    pakanAll,
    penggunaanAll,
    produksiAll,
    penjualanAll,
    pakanMonth,
    penggunaanMonth,
    produksiMonth,
    penjualanMonth,
    pengeluaranMonth,
    settings,
  ] = await Promise.all([
    prisma.pakan.findMany({ where: active, select: { jumlah: true, harga: true } }),
    prisma.penggunaanPakan.findMany({ where: active, select: { jumlah: true } }),
    prisma.produksiTelur.findMany({ where: active, select: { jumlah: true, rusak: true } }),
    prisma.penjualanTelur.findMany({ where: active, select: { jumlah: true } }),
    prisma.pakan.findMany({ where: inMonth, select: { jumlah: true, harga: true } }),
    prisma.penggunaanPakan.findMany({ where: inMonth, select: { jumlah: true } }),
    prisma.produksiTelur.findMany({ where: inMonth, select: { jumlah: true, rusak: true } }),
    prisma.penjualanTelur.findMany({ where: inMonth, select: { jumlah: true, harga: true } }),
    prisma.pengeluaran.findMany({ where: inMonth, select: { jumlah: true } }),
    prisma.pengaturan.findUnique({ where: { id: 1 } }),
  ]);

  const feedInTotal = sum(pakanAll, (row) => num(row.jumlah));
  const feedUsedTotal = sum(penggunaanAll, (row) => num(row.jumlah));
  const feedCostTotal = sum(pakanAll, (row) => num(row.jumlah) * row.harga);
  const avgFeedPrice = feedInTotal > 0 ? feedCostTotal / feedInTotal : 0;

  const feedInMonth = sum(pakanMonth, (row) => num(row.jumlah));
  const feedUsedMonth = sum(penggunaanMonth, (row) => num(row.jumlah));
  const feedCostMonth = sum(pakanMonth, (row) => num(row.jumlah) * row.harga);
  const feedUsedValue = Math.round(feedUsedMonth * avgFeedPrice);

  const eggsMonth = sum(produksiMonth, (row) => row.jumlah);
  const damagedMonth = sum(produksiMonth, (row) => row.rusak);
  const soldEggsMonth = sum(penjualanMonth, (row) => row.jumlah);
  const salesMonth = sum(penjualanMonth, (row) => row.jumlah * row.harga);
  const otherExpensesMonth = sum(pengeluaranMonth, (row) => row.jumlah);

  const goodEggsTotal = sum(produksiAll, (row) => row.jumlah - row.rusak);
  const soldEggsTotal = sum(penjualanAll, (row) => row.jumlah);

  const populasi = settings?.populasi ?? 0;
  const productionDays = produksiMonth.length;
  const hdPercent =
    populasi > 0 && productionDays > 0
      ? (eggsMonth / (populasi * productionDays)) * 100
      : null;

  return {
    month,
    populasi,
    feed: {
      inMonth: feedInMonth,
      usedMonth: feedUsedMonth,
      stock: feedInTotal - feedUsedTotal,
      costMonth: feedCostMonth,
      usedValue: feedUsedValue,
      avgPrice: Math.round(avgFeedPrice),
    },
    eggs: {
      producedMonth: eggsMonth,
      damagedMonth,
      goodMonth: eggsMonth - damagedMonth,
      soldMonth: soldEggsMonth,
      stock: goodEggsTotal - soldEggsTotal,
      productionDays,
      hdPercent: hdPercent === null ? null : Math.round(hdPercent * 100) / 100,
    },
    finance: {
      salesMonth,
      feedCostMonth,
      otherExpensesMonth,
      expensesMonth: feedCostMonth + otherExpensesMonth,
      netMonth: salesMonth - feedCostMonth - otherExpensesMonth,
    },
  };
}
