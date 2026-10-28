export function DataForm({
  config,
  editing,
  form,
  onFormChange,
  onSubmit,
  onClose,
}) {
  return (
    <form className="data-form" onSubmit={onSubmit}>
      <div className="form-heading">
        <h3>{editing ? "Edit Data" : "Tambah Data Baru"}</h3>
        <button type="button" className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="form-grid">
        {config.fields.map((field) => (
          <label key={field.name}>
            {field.label}
            <input
              type={field.type || "text"}
              placeholder={field.placeholder || ""}
              min={field.type === "number" ? 0 : undefined}
              step={field.type === "number" ? "any" : undefined}
              required={field.required !== false}
              value={form[field.name] ?? ""}
              onChange={(e) => onFormChange(field.name, e.target.value)}
            />
          </label>
        ))}
      </div>
      <div className="form-actions">
        <button type="button" className="secondary-button" onClick={onClose}>
          Batal
        </button>
        <button className="primary-button" type="submit">
          Simpan Data
        </button>
      </div>
    </form>
  );
}
