export function getAverageRating(feedbacks: { note: number | null }[]) {
  const notes = feedbacks.map((f) => f.note).filter((n): n is number => n !== null);
  if (notes.length === 0) return null;
  const avg = notes.reduce((sum, n) => sum + n, 0) / notes.length;
  return { avg: Math.round(avg * 10) / 10, count: notes.length };
}