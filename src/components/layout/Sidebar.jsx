import { menus } from "../../constants/menu";

export function Sidebar({ page, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">🐔</div>
        <div>
          <strong>
            Farm<span>Care</span>
          </strong>
          <small>Farm Management System</small>
        </div>
      </div>

      <div className="nav-label">MENU UTAMA</div>
      <nav>
        {menus.map((menu) => (
          <button
            key={menu.id}
            className={`nav-item ${page === menu.id ? "active" : ""}`}
            onClick={() => onNavigate(menu.id)}
          >
            <span className="nav-icon">{menu.icon}</span>
            {menu.label}
            {page === menu.id && <span className="nav-marker" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="farm-avatar">🐓</div>
        <div>
          <strong>Peternakan Saya</strong>
          <small>Administrator</small>
        </div>
      </div>
    </aside>
  );
}
