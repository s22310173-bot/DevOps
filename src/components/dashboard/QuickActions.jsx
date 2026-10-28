import { ENTITIES, menuById } from "../../constants/menu";

export function QuickActions({ onAction }) {
  return (
    <section className="panel quick-panel">
      <div className="panel-header">
        <div>
          <h2>Akses Cepat</h2>
          <p>Pilih aktivitas yang ingin dicatat</p>
        </div>
      </div>
      <div className="quick-grid">
        {ENTITIES.map((id) => (
          <button className="quick-action" key={id} onClick={() => onAction(id)}>
            <span className="quick-icon">{menuById(id)?.icon}</span>
            <span>{menuById(id)?.label}</span>
            <b>＋</b>
          </button>
        ))}
      </div>
    </section>
  );
}
