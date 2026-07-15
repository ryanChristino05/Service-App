"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ViewModeProvider } from "@/context/ViewModeContext";

const hideHeaderFooterPaths = [
  "/login",
  "/register",
  "/public/login",
  "/public/register",
];

export default function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideShell = hideHeaderFooterPaths.includes(pathname);

  return (
    <ViewModeProvider>
      {!hideShell && <Header />}
      <main className="flex-1">{children}</main>
      {!hideShell && <Footer />}
    </ViewModeProvider>
  );
}