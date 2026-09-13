import { useState, useEffect } from "react";

const STORAGE_KEY = "todo-matrix-tasks";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState(loadTasks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

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