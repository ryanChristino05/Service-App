type CategoryStyle = { bg: string; text: string };

const CATEGORY_COLORS: Record<string, CategoryStyle> = {
  "Plomberie": { bg: "#2C6E8E", text: "#F6F4EF" },
  "Électricité": { bg: "#C68A1F", text: "#241F1A" },
  "Ménage": { bg: "#4E7A51", text: "#F6F4EF" },
  "Jardinage": { bg: "#7A8B3F", text: "#F6F4EF" },
};

const DEFAULT_STYLE: CategoryStyle = { bg: "#6B5A4E", text: "#F6F4EF" };

export function getCategoryStyle(nom: string): CategoryStyle {
  return CATEGORY_COLORS[nom] ?? DEFAULT_STYLE;
}