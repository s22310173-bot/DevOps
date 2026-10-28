import { StatCard } from "../common/StatCard";
import { FinancialPanel } from "../dashboard/FinancialPanel";
import { ProductionPanel } from "../dashboard/ProductionPanel";
import { QuickActions } from "../dashboard/QuickActions";
import { money, number } from "../../lib/format";

export function DashboardPage({
  finance,
  eggs,
  feed,
  month,
  populasiDraft,
  onPopulasiChange,
  onPopulasiSave,
  onQuickAction,
}) {
  return (
    <>
      <section className="stat-grid">
        <StatCard
          title="Pendapatan Penjualan"
          value={money(finance.salesMonth)}
          icon="↗"
          color="green"
          note="Total penjualan bulan ini"
        />
        <StatCard
          title="Total Pengeluaran"
          value={money(finance.expensesMonth)}
          icon="↘"
          color="orange"
          note="Pembelian pakan + biaya lain"
        />
        <StatCard
          title="Produksi Telur"
          value={`${number(eggs.producedMonth)} butir`}
          icon="🥚"
          color="yellow"
          note={`${number(eggs.damagedMonth)} telur rusak`}
        />
        <StatCard
          title="Stok Pakan"
          value={`${number(feed.stock)} kg`}
          icon="◈"
          color="blue"
          note="Saldo kumulatif sejak awal"
        />
      </section>

      <section className="content-grid">
        <FinancialPanel finance={finance} feed={feed} month={month} />
        <ProductionPanel
          eggs={eggs}
          feed={feed}
          populasiDraft={populasiDraft}
          onPopulasiChange={onPopulasiChange}
          onPopulasiSave={onPopulasiSave}
        />
      </section>

      <QuickActions onAction={onQuickAction} />
    </>
  );
}
