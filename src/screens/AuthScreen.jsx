import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AuthScreen({ mode, onSubmit, error, onClearError }) {
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    onClearError?.();
  }, [mode, onClearError]);
  const isRegister = mode === "register";
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");

    if (isRegister && password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const ok = await onSubmit({ name, email, password });
    setSubmitting(false);
    if (ok) navigate("/", { replace: true });
  }

  return (
    <div style={styles.page}>
      <div style={styles.card} className="home-card">
        <p style={styles.title}>{isRegister ? "Create account" : "Sign in"}</p>
        <p style={styles.subtitle}>
          {isRegister
            ? "Register to keep your tasks on this device."
            : "Sign in to your account to continue."}
        </p>

        <form style={styles.form} onSubmit={handleSubmit}>
          {isRegister && (
            <input
              style={styles.input}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          )}
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? "new-password" : "current-password"}
          />
          {isRegister && (
            <input
              style={styles.input}
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          )}

          {(localError || error) && (
            <p style={styles.error}>{localError || error}</p>
          )}

          <button
            style={{
              ...styles.submit,
              opacity: submitting ? 0.7 : 1,
            }}
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : isRegister
                ? "Register"
                : "Sign in"}
          </button>
        </form>

        <p style={styles.switch}>
          {isRegister ? (
            <>
              Already have an account? <Link to="/login">Sign in</Link>
            </>
          ) : (
            <>
              No account yet? <Link to="/register">Register</Link>
            </>
          )}
        </p>
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
    maxWidth: 420,
    background: "#fff",
    borderRadius: 20,
    padding: "28px 22px",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
    height: "fit-content",
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    margin: "0 0 6px",
    color: "#2A2A28",
  },
  subtitle: {
    fontSize: 13,
    color: "#8A887F",
    margin: "0 0 20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  input: {
    border: "1px solid #E5E3DA",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14,
    fontFamily: "inherit",
  },
  error: {
    margin: 0,
    fontSize: 13,
    color: "#D85A30",
  },
  submit: {
    border: "none",
    background: "#2A2A28",
    color: "#fff",
    borderRadius: 10,
    padding: "12px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    marginTop: 4,
  },
  switch: {
    margin: "16px 0 0",
    fontSize: 13,
    color: "#8A887F",
    textAlign: "center",
  },
};
