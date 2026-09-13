export const QUADRANTS = [
  {
    id: "urgent-important",
    label: "Important and Urgent",
    subtitle: "Do it now",
    color: "#D85A30",
    bgSoft: "#F4CDC0",
    bgCard: "#FAECE7",
    text: "#4A1B0C",
    icon: "ti-exclamation-mark",
  },
  {
    id: "important",
    label: "Important, not urgent",
    subtitle: "Plan time for this",
    color: "#534AB7",
    bgSoft: "#D9D6F7",
    bgCard: "#EEEDFE",
    text: "#26215C",
    icon: "ti-star",
  },
  {
    id: "urgent",
    label: "Urgent, not important",
    subtitle: "Delegate or do quickly",
    color: "#B8860B",
    bgSoft: "#F1DFA8",
    bgCard: "#FBF3DA",
    text: "#5C4404",
    icon: "ti-bolt",
  },
  {
    id: "neither",
    label: "Neither important nor urgent",
    subtitle: "Defer or delete",
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