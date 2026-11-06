import type { Metadata } from "next";
import ShopPage from "@/app/components/irena/shop/ShopPage";
import "../styles/pages/shop.css";

export const metadata: Metadata = {
  title: "Prodavnica | Eliksir",
  description:
    "Originalne društvene igre u Eliksiru — proveri dostupnost i cenu.",
};

export default function IrenaShopPage() {
  return <ShopPage />;
}
