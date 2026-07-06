import type { Metadata } from "next";
import GamesPage from "@/app/components/irena/igre/GamesPage";
import "../styles/pages/igre.css";

export const metadata: Metadata = {
  title: "Igre | Eliksir",
  description:
    "Preko 120 društvenih igara u Eliksiru — porodične, strateške, party, dedukcija i TCG.",
};

export default function IgrePage() {
  return <GamesPage />;
}
