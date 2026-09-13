import { useNavigate } from "react-router-dom";
import { QUADRANTS } from "../data/quadrants";

export default function HomeScreen({ countByQuadrant }) {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card} className="home-card">
        <p style={styles.title}>Мои задачи</p>

        <div className="home-grid">
          {QUADRANTS.map((q) => (
            <button
              key={q.id}
              onClick={() => navigate(`/quadrant/${q.id}`)}
              style={{ ...styles.tile, background: q.bgCard }}
            >
              <div style={{ ...styles.iconCircle, background: q.color }}>
                <i className={`ti ${q.icon}`} style={{ color: "#fff", fontSize: 18 }} />
              </div>
              <p style={{ ...styles.tileLabel, color: q.text }}>{q.label}</p>
              <p style={{ ...styles.tileCount, color: q.text }}>
                {countByQuadrant(q.id)} задач
              </p>
            </button>
          ))}
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
    padding: "24px 12px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    margin: "8px 0 16px",
    color: "#2A2A28",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  tile: {
    border: "none",
    borderRadius: 16,
    padding: "18px 14px",
    minHeight: 130,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    cursor: "pointer",
    textAlign: "left",
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  tileLabel: {
    fontSize: 13,
    fontWeight: 600,
    margin: 0,
    lineHeight: 1.3,
  },
  tileCount: {
    fontSize: 11,
    opacity: 0.75,
    margin: "4px 0 0",
  },
};
