import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuadrant } from "../data/quadrants";
import { classifyDueDate } from "../utils/dueDate";

const FILTERS = [
  { id: "all", label: "Все" },
  { id: "today", label: "Сегодня" },
  { id: "week", label: "На неделе" },
];

export default function QuadrantScreen({ tasks, addTask, editTask, toggleTask, deleteTask }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const quadrant = getQuadrant(id);

  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  if (!quadrant) return null;

  const quadrantTasks = tasks.filter((t) => t.quadrant === quadrant.id);

  const withMeta = quadrantTasks.map((t) => ({
    ...t,
    meta: classifyDueDate(t.dueDate),
  }));

  const filtered =
    filter === "all"
      ? withMeta
      : withMeta.filter((t) => t.meta.bucket === filter);

  const counts = {
    all: quadrantTasks.length,
    today: withMeta.filter((t) => t.meta.bucket === "today").length,
    week: withMeta.filter((t) => t.meta.bucket === "week").length,
  };

  function handleSave() {
    const trimmed = title.trim();
    if (!trimmed) return;

    if (editingId) {
      editTask(editingId, { title: trimmed, dueDate: dueDate || null });
    } else {
      addTask({ title: trimmed, quadrant: quadrant.id, dueDate: dueDate || null });
    }

    resetForm();
  }

  function startEdit(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDueDate(task.dueDate || "");
    setShowForm(true);
    setOpenMenuId(null);
  }

  function resetForm() {
    setTitle("");
    setDueDate("");
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card} className="quadrant-card">
        <div style={{ ...styles.header, background: quadrant.bgSoft }}>
          <div style={styles.headerTop}>
            <i
              className="ti ti-chevron-left"
              style={{ fontSize: 20, color: quadrant.text, cursor: "pointer" }}
              onClick={() => navigate("/")}
            />
          </div>
          <div style={styles.headerMain}>
            <div style={{ ...styles.iconCircle, background: quadrant.color }}>
              <i className={`ti ${quadrant.icon}`} style={{ color: "#fff", fontSize: 18 }} />
            </div>
            <div>
              <p style={{ ...styles.headerTitle, color: quadrant.text }}>{quadrant.label}</p>
              <p style={{ ...styles.headerSubtitle, color: quadrant.text }}>{quadrant.subtitle}</p>
            </div>
          </div>
        </div>

        <div style={styles.body}>
          <div style={styles.filterRow}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  ...styles.filterChip,
                  background: filter === f.id ? "#fff" : "transparent",
                  boxShadow: filter === f.id ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                  color: filter === f.id ? "#2A2A28" : "#8A887F",
                }}
              >
                {f.label} ({counts[f.id]})
              </button>
            ))}
          </div>

          <div style={styles.list}>
            {filtered.length === 0 && (
              <p style={styles.empty}>Ничего нет в этой категории.</p>
            )}
            {filtered.map((t) => (
              <div key={t.id} style={styles.item}>
                <div style={styles.itemLeft}>
                  <div
                    onClick={() => toggleTask(t.id)}
                    style={{
                      ...styles.checkbox,
                      background: t.done ? quadrant.color : "transparent",
                      borderColor: t.done ? quadrant.color : "#CFCDC3",
                    }}
                  >
                    {t.done && <i className="ti ti-check" style={{ color: "#fff", fontSize: 12 }} />}
                  </div>
                  <div>
                    <p
                      style={{
                        ...styles.itemTitle,
                        textDecoration: t.done ? "line-through" : "none",
                        color: t.done ? "#A8A69D" : "#2A2A28",
                      }}
                    >
                      {t.title}
                    </p>
                    {t.meta.label && (
                      <p
                        style={{
                          ...styles.itemDate,
                          color: t.meta.bucket === "today" ? quadrant.color : "#8A887F",
                        }}
                      >
                        <i className="ti ti-calendar" style={{ fontSize: 11, marginRight: 4 }} />
                        {t.meta.label}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  <i
                    className="ti ti-dots-vertical"
                    style={{ fontSize: 16, color: "#B4B2A8", cursor: "pointer" }}
                    onClick={() => setOpenMenuId(openMenuId === t.id ? null : t.id)}
                  />
                  {openMenuId === t.id && (
                    <div style={styles.menu}>
                      <div
                        style={styles.menuItemNeutral}
                        onClick={() => startEdit(t)}
                      >
                        Редактировать
                      </div>
                      <div
                        style={styles.menuItem}
                        onClick={() => {
                          deleteTask(t.id);
                          setOpenMenuId(null);
                        }}
                      >
                        Удалить
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.footer}>
          {showForm ? (
            <div style={styles.form}>
              <input
                autoFocus
                style={styles.input}
                placeholder="Название задачи"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
              <input
                type="date"
                style={styles.input}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button style={styles.cancelBtn} onClick={resetForm}>
                  Отмена
                </button>
                <button
                  style={{ ...styles.confirmBtn, background: quadrant.color }}
                  onClick={handleSave}
                >
                  {editingId ? "Изменить" : "Сохранить"}
                </button>
              </div>
            </div>
          ) : (
            <button
              style={{ ...styles.addBtn, background: quadrant.bgSoft, color: quadrant.text }}
              onClick={() => setShowForm(true)}
            >
              <i className="ti ti-plus" style={{ fontSize: 16 }} /> Добавить задачу
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F1EFE8",
    display: "flex",
    justifyContent: "center",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  header: { padding: "16px 16px 20px" },
  headerTop: { marginBottom: 16 },
  headerMain: { display: "flex", alignItems: "center", gap: 12 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerTitle: { margin: 0, fontSize: 17, fontWeight: 600 },
  headerSubtitle: { margin: "2px 0 0", fontSize: 12, opacity: 0.8 },
  body: { flex: 1, padding: "14px 16px", overflow: "hidden", display: "flex", flexDirection: "column" },
  filterRow: { display: "flex", gap: 6, marginBottom: 12 },
  filterChip: { border: "none", borderRadius: 10, padding: "6px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer" },
  list: { display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", flex: 1 },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "12px 0",
    borderBottom: "0.5px solid #E5E3DA",
  },
  itemLeft: { display: "flex", gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    border: "1.5px solid",
    marginTop: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  itemTitle: { margin: 0, fontSize: 14 },
  itemDate: { margin: "4px 0 0", fontSize: 11, display: "flex", alignItems: "center" },
  menu: {
    position: "absolute",
    right: 0,
    top: 20,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    zIndex: 10,
    minWidth: 100,
  },
  menuItem: { padding: "8px 12px", fontSize: 13, color: "#D85A30", cursor: "pointer" },
  menuItemNeutral: { padding: "8px 12px", fontSize: 13, color: "#2A2A28", cursor: "pointer", borderBottom: "1px solid #F1EFE8" },
  empty: { fontSize: 13, color: "#999", textAlign: "center", padding: "24px 0" },
  footer: { padding: "8px 16px 20px" },
  addBtn: {
    width: "100%",
    border: "none",
    padding: "13px",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    cursor: "pointer",
  },
  form: { display: "flex", flexDirection: "column", gap: 8 },
  input: {
    border: "1px solid #E5E3DA",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
  },
  cancelBtn: {
    flex: 1,
    border: "1px solid #E5E3DA",
    background: "#fff",
    borderRadius: 8,
    padding: "10px",
    fontSize: 13,
    cursor: "pointer",
  },
  confirmBtn: {
    flex: 1,
    border: "none",
    color: "#fff",
    borderRadius: 8,
    padding: "10px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
};
