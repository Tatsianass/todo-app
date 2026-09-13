export const QUADRANTS = [
  {
    id: "urgent-important",
    label: "Важно и срочно",
    subtitle: "Сделай это сейчас",
    color: "#D85A30",
    bgSoft: "#F4CDC0",
    bgCard: "#FAECE7",
    text: "#4A1B0C",
    icon: "ti-exclamation-mark",
  },
  {
    id: "important",
    label: "Важно, не срочно",
    subtitle: "Запланируй время на это",
    color: "#534AB7",
    bgSoft: "#D9D6F7",
    bgCard: "#EEEDFE",
    text: "#26215C",
    icon: "ti-star",
  },
  {
    id: "urgent",
    label: "Срочно, не важно",
    subtitle: "Делегируй или сделай быстро",
    color: "#B8860B",
    bgSoft: "#F1DFA8",
    bgCard: "#FBF3DA",
    text: "#5C4404",
    icon: "ti-bolt",
  },
  {
    id: "neither",
    label: "Не важно, не срочно",
    subtitle: "Отложи или удали",
    color: "#4A6FA5",
    bgSoft: "#CBDBF0",
    bgCard: "#E7EFF9",
    text: "#1F3A5C",
    icon: "ti-minus",
  },
];

export function getQuadrant(id) {
  return QUADRANTS.find((q) => q.id === id);
}