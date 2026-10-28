import { DataForm } from "./DataForm";
import { money, numberIfNumeric } from "../../lib/format";

export function DataTableSection({
  config,
  rows,
  search,
  onSearch,
  showForm,
  editing,
  form,
  onFormChange,
  onCreate,
  onEdit,
  onDelete,
  onSubmitForm,
  onCloseForm,
}) {
  return (
    <section className="panel table-panel">
      <div className="table-toolbar">
        <div>
          <h2>Daftar Data</h2>
          <p>{rows.length} data ditemukan</p>
        </div>
        <div className="toolbar-actions">
          <input
            className="search-input"
            placeholder="Cari data..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          <button className="primary-button" onClick={onCreate}>
            ＋ Tambah Data
          </button>
        </div>
      </div>

      {showForm && (
        <DataForm
          config={config}
          editing={editing}
          form={form}
          onFormChange={onFormChange}
          onSubmit={onSubmitForm}
          onClose={onCloseForm}
        />
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              {config.fields
                .filter((f) => f.name !== "tanggal")
                .map((f) => (
                  <th key={f.name}>{f.label}</th>
                ))}
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={config.fields.length + 1} className="empty-state">
                  Belum ada data. Klik “Tambah Data” untuk mulai mencatat.
                </td>
              </tr>
            ) : (
              rows.map((item) => (
                <tr key={item.id}>
                  <td>{item.tanggal || "-"}</td>
                  {config.fields
                    .filter((f) => f.name !== "tanggal")
                    .map((f) => (
                      <td key={f.name}>
                        {f.format === "money"
                          ? money(Number(item[f.name] || 0))
                          : numberIfNumeric(item[f.name])}
                      </td>
                    ))}
                  <td>
                    <div className="row-actions">
                      <button
                        className="edit-button"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => onDelete(item.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        Data disimpan di database · {rows.length} catatan
      </div>
    </section>
  );
}
