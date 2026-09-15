import { useState, useEffect } from "react";

const LEGACY_STORAGE_KEY = "todo-matrix-tasks";

function storageKey(userId) {
  return `${LEGACY_STORAGE_KEY}:${userId}`;
}

function loadTasks(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (raw) return JSON.parse(raw);

    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      localStorage.setItem(storageKey(userId), legacy);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return JSON.parse(legacy);
    }
    return [];
  } catch {
    return [];
  }
}

export function useTasks(userId) {
  const [tasks, setTasks] = useState(() => loadTasks(userId));

  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(storageKey(userId), JSON.stringify(tasks));
  }, [tasks, userId]);

  function addTask({ title, quadrant, dueDate }) {
    setTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title,
        quadrant,
        dueDate: dueDate || null,
        done: false,
      },
    ]);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function editTask(id, updates) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function countByQuadrant(quadrantId) {
    return tasks.filter((t) => t.quadrant === quadrantId).length;
  }

  return { tasks, addTask, editTask, toggleTask, deleteTask, countByQuadrant };
}