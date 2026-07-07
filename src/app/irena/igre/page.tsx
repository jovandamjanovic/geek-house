import type { Metadata } from "next";
import GamesPage from "@/app/components/irena/igre/GamesPage";
import { gameService } from "@/lib/domain/game/service";
import "../styles/pages/igre.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Igre | Eliksir",
  description:
    "Preko 120 društvenih igara u Eliksiru — porodične, strateške, party, dedukcija i TCG.",
};

export default async function IgrePage() {
  const games = await gameService.getGames();
  return <GamesPage initialGames={games} />;
}
