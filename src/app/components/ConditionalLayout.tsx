"use client";

import { usePathname } from "next/navigation";
import Header from "@/app/components/header/header";
import Footer from "@/app/components/footer/footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Pages that should not have header and footer
  const excludedPaths = ["/under-construction"];

  const shouldShowHeaderFooter = !excludedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (!shouldShowHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="pt-12">{children}</main>
      <Footer />
    </>
  );
}
