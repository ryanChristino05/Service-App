export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--accent-soft)] px-2.5 py-1 font-[var(--font-mono)] text-xs font-medium text-[var(--brand-900)]">
      {children}
    </span>
  );
}