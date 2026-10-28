import { menuById } from "../../constants/menu";

export function Topbar({ page, loading }) {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        FarmCare <span>/</span> {menuById(page)?.label}
      </div>
      <div className="topbar-right">
        <span className="status-dot" />
        <span>{loading ? "Memuat data..." : "Sistem operasional"}</span>
        <div className="user-avatar">A</div>
      </div>
    </header>
  );
}
