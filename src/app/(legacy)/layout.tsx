import Header from "@/app/components/header/header";
import Footer from "@/app/components/footer/footer";

/**
 * Layout for /impressum, /clanarine, /about, /contact and /test, using the
 * Header/Footer from components/header and components/footer.
 */
export default function LegacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="pt-12">{children}</main>
      <Footer />
    </>
  );
}
