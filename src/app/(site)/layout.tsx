import { Poppins, Cinzel_Decorative } from "next/font/google";
import IrenaHeader from "@/app/components/irena/layout/IrenaHeader";
import IrenaFooter from "@/app/components/irena/layout/IrenaFooter";
import ScrollToTop from "@/app/components/irena/layout/ScrollToTop";
import "./styles/global.css";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "800"],
  variable: "--font-poppins",
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin", "latin-ext"],
  weight: ["700"],
  variable: "--font-cinzel-decorative",
});

export default function IrenaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`irena-site ${poppins.variable} ${cinzelDecorative.variable}`}
    >
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />
      <IrenaHeader />
      <main>{children}</main>
      <IrenaFooter />
      <ScrollToTop />
    </div>
  );
}
