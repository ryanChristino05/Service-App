import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--paper)] px-6 py-12">
      <Link
        href="/"
        className="mb-8 font-[var(--font-display)] text-2xl font-semibold text-[var(--brand-900)]"
      >
        Local Services
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}