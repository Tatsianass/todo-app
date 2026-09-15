import { useCallback, useState } from "react";

const USERS_KEY = "todo-matrix-users";
const SESSION_KEY = "todo-matrix-session";

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession() {
  try {
    const userId = localStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    return loadUsers().find((u) => u.id === userId) ?? null;
  } catch {
    return null;
  }
}

function publicUser(user) {
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email };
}

async function hashPassword(password, salt) {
  const encoded = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function useAuth() {
  const [user, setUser] = useState(() => publicUser(loadSession()));
  const [error, setError] = useState("");

  async function register({ name, email, password }) {
    setError("");
    const trimmedName = name.trim();
    const normalizedEmail = normalizeEmail(email);

    if (!trimmedName) {
      setError("Enter your name.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    const users = loadUsers();
    if (users.some((u) => u.email === normalizedEmail)) {
      setError("An account with this email already exists.");
      return false;
    }

    const salt = crypto.randomUUID();
    const passwordHash = await hashPassword(password, salt);
    const nextUser = {
      id: crypto.randomUUID(),
      name: trimmedName,
      email: normalizedEmail,
      salt,
      passwordHash,
    };

    saveUsers([...users, nextUser]);
    localStorage.setItem(SESSION_KEY, nextUser.id);
    setUser(publicUser(nextUser));
    return true;
  }

  async function login({ email, password }) {
    setError("");
    const normalizedEmail = normalizeEmail(email);
    const users = loadUsers();
    const found = users.find((u) => u.email === normalizedEmail);

    if (!found) {
      setError("No account found with this email.");
      return false;
    }

    const passwordHash = await hashPassword(password, found.salt);
    if (passwordHash !== found.passwordHash) {
      setError("Incorrect password.");
      return false;
    }

    localStorage.setItem(SESSION_KEY, found.id);
    setUser(publicUser(found));
    return true;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setError("");
  }

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return { user, error, register, login, logout, clearError };
}
