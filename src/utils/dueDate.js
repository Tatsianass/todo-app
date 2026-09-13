// Возвращает { label, bucket } для даты задачи.
// bucket: "today" | "week" | "later" | "none" — используется для подфильтров.
export function classifyDueDate(dueDate) {
  if (!dueDate) return { label: null, bucket: "none" };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return { label: "Сегодня", bucket: "today" };
  if (diffDays === 1) return { label: "Завтра", bucket: "week" };
  if (diffDays > 1 && diffDays <= 7) return { label: "На этой неделе", bucket: "week" };
  if (diffDays < 0) return { label: "Просрочено", bucket: "today" };

  return {
    label: due.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
    bucket: "later",
  };
}