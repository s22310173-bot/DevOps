export function PageHeading({ title, description, month, onMonthChange }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">MANAJEMEN PETERNAKAN</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <label className="month-select">
        <span>Periode</span>
        <input
          type="month"
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
        />
      </label>
    </div>
  );
}
