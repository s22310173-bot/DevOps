import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { api } from "./api";
import { ENTITIES } from "./constants/menu";
import { configs, emptyData, emptySummary } from "./constants/entityConfig";
import { today } from "./lib/format";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { PageHeading } from "./components/layout/PageHeading";
import { Footer } from "./components/layout/Footer";
import { ErrorBanner } from "./components/common/ErrorBanner";
import { DataTableSection } from "./components/data/DataTableSection";
import { DashboardPage } from "./components/pages/DashboardPage";
import { ReportPage } from "./components/pages/ReportPage";
import "./App.css";

const PAGE_META = {
  dashboard: {
    title: "Dashboard",
    description: "Pantau kondisi peternakan Anda dalam satu tempat.",
  },
  laporan: {
    title: "Laporan Operasional",
    description: "Ringkasan data berdasarkan bulan yang dipilih.",
  },
};

function pageFromPath(pathname) {
  const segment = pathname.replace(/^\/+|\/+$/g, "");
  if (segment === "") return "dashboard";
  if (segment === "laporan") return "laporan";
  if (ENTITIES.includes(segment)) return segment;
  return null;
}

export default function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const page = pageFromPath(pathname);

  const [data, setData] = useState(emptyData);
  const [summary, setSummary] = useState(null);
  const [populasiDraft, setPopulasiDraft] = useState("0");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState(() => today().slice(0, 7));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [lists, settings] = await Promise.all([
          Promise.all(ENTITIES.map((entity) => api.list(entity))),
          api.getSettings(),
        ]);
        if (cancelled) return;
        const next = emptyData();
        ENTITIES.forEach((entity, index) => {
          next[entity] = lists[index];
        });
        setData(next);
        setPopulasiDraft(String(settings.populasi));
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [version]);

  useEffect(() => {
    let cancelled = false;
    api
      .summary(month)
      .then((value) => {
        if (!cancelled) setSummary(value);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [month, version]);

  const totals = useMemo(() => summary || emptySummary, [summary]);
  const feed = totals.feed;
  const eggs = totals.eggs;
  const finance = totals.finance;

  const currentConfig = configs[page];
  const heading = PAGE_META[page] || {
    title: currentConfig?.title,
    description: currentConfig?.description,
  };

  const rows = currentConfig
    ? (data[page] || []).filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase()),
        ),
      )
    : [];

  function openCreate() {
    setEditing(null);
    setForm({ tanggal: today() });
    setShowForm(true);
  }

  function openEdit(item) {
    setEditing(item.id);
    setForm({ ...item });
    setShowForm(true);
  }

  async function saveForm(event) {
    event.preventDefault();
    const payload = Object.fromEntries(
      currentConfig.fields.map((field) => [
        field.name,
        form[field.name] ?? "",
      ]),
    );

    try {
      if (editing) {
        await api.update(page, editing, payload);
      } else {
        await api.create(page, payload);
      }
      setShowForm(false);
      setEditing(null);
      setForm({});
      setVersion((value) => value + 1);
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeItem(id) {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await api.remove(page, id);
      setVersion((value) => value + 1);
    } catch (err) {
      setError(err.message);
    }
  }

  async function savePopulasi() {
    const value = Number(populasiDraft);
    if (!Number.isInteger(value) || value < 0) {
      setError("Populasi harus bilangan bulat dan tidak negatif");
      return;
    }
    try {
      const settings = await api.updateSettings({ populasi: value });
      setPopulasiDraft(String(settings.populasi));
      setVersion((current) => current + 1);
    } catch (err) {
      setError(err.message);
    }
  }

  function changePage(id) {
    setShowForm(false);
    setSearch("");
    navigate(id === "dashboard" ? "/" : `/${id}`);
  }

  function quickCreate(id) {
    changePage(id);
    setForm({ tanggal: today() });
    setShowForm(true);
  }

  if (!page) return <Navigate to="/" replace />;

  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={changePage} />

      <main className="main-content">
        <Topbar page={page} loading={loading} />

        <div className="page-content">
          <ErrorBanner message={error} onClose={() => setError("")} />

          <PageHeading
            title={heading.title}
            description={heading.description}
            month={month}
            onMonthChange={setMonth}
          />

          {page === "dashboard" && (
            <DashboardPage
              finance={finance}
              eggs={eggs}
              feed={feed}
              month={month}
              populasiDraft={populasiDraft}
              onPopulasiChange={setPopulasiDraft}
              onPopulasiSave={savePopulasi}
              onQuickAction={quickCreate}
            />
          )}

          {currentConfig && (
            <DataTableSection
              config={currentConfig}
              rows={rows}
              search={search}
              onSearch={setSearch}
              showForm={showForm}
              editing={editing}
              form={form}
              onFormChange={(name, value) =>
                setForm((prev) => ({ ...prev, [name]: value }))
              }
              onCreate={openCreate}
              onEdit={openEdit}
              onDelete={removeItem}
              onSubmitForm={saveForm}
              onCloseForm={() => setShowForm(false)}
            />
          )}

          {page === "laporan" && (
            <ReportPage finance={finance} feed={feed} eggs={eggs} month={month} />
          )}

          <Footer />
        </div>
      </main>
    </div>
  );
}
