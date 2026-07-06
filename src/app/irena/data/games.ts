export interface Game {
  title: string;
  meta: string;
  description: string;
  tags: string[];
  category: string;
  displayTitle: string;
}

export const GAMES: Game[] = [
  {
    title: "Ticket to Ride: Europe",
    meta: "Porodična • 2–5 igrača • 30–60 min",
    description:
      "Gradite železničke rute po Evropi kroz skupljanje setova karata i ispunjavanje destinacija. Klasičan, brz za učenje i odličan za miks društva.",
    tags: ["porodicna", "vozovi", "ruta", "2-igraca", "strategija"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Ticket to Ride: Europe",
  },
  {
    title: "Cascadia",
    meta: "Porodična • 1–4 igrača • 30–45 min",
    description:
      "Slaganje pločica i žetona životinja u pejzaže. Poeni se dobijaju kroz pattern-e i ciljeve životinja – mirna, pametna i veoma pristupačna.",
    tags: [
      "porodicna",
      "plocice",
      "puzzle",
      "pattern-building",
      "animals",
      "lagana",
      "2-igraca",
      "strategija",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Cascadia",
  },
  {
    title: "Azul Mini",
    meta: "Porodična • 2–4 igrača • 30–45 min",
    description:
      "Birate pločice i popunjavate mozaik uz pametno planiranje i blokiranje. Brza taktika u veoma čistim pravilima.",
    tags: [
      "porodicna",
      "puzzle",
      "pattern-building",
      "lagana",
      "2-igraca",
      "strategija",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Azul Mini",
  },
  {
    title: "Kingdomino",
    meta: "Porodična • 2–4 igrača • 15–25 min",
    description:
      "Draftujete domino pločice i gradite kraljevstvo povezivanjem istih terena. Brza i jako ‘još jedna partija’ igra.",
    tags: ["porodicna", "plocice", "puzzle", "brza", "lagana", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Kingdomino",
  },
  {
    title: "Patchwork",
    meta: "Porodična • 2 igrača • 15–30 min",
    description:
      "Duel slaganja ‘prekrivača’ kroz biranje delova i upravljanje vremenom/dugmićima. Kratko, taktično i baš zarazno.",
    tags: ["porodicna", "puzzle", "2-igraca", "lagana"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Patchwork",
  },
  {
    title: "Splendor",
    meta: "Porodična • 2–4 igrača • 30 min",
    description:
      "Skupljate žetone dragulja i kupujete karte kako biste gradili engine i privlačili plemiće. Jednostavno, elegantno, taktično.",
    tags: [
      "porodicna",
      "karte",
      "engine-building",
      "ekonomija",
      "lagana",
      "2-igraca",
      "strategija",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Splendor",
  },
  {
    title: "Jaipur",
    meta: "Porodična • 2 igrača • 30 min",
    description:
      "Brz duel trgovaca: pametan tajming uzimanja/razmene karata i prodaje setova za najveći profit.",
    tags: ["porodicna", "karte", "ekonomija", "2-igraca", "lagana"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Jaipur",
  },
  {
    title: "Trio",
    meta: "Porodična • 3–6 igrača • 15 min",
    description:
      "Igra memorije i pogađanja: otkrivate karte i pokušavate da skupite trio iste vrednosti uz pametna pitanja i procenu.",
    tags: ["porodicna", "karte", "memorija", "brza", "lagana", "6-plus"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Trio",
  },
  {
    title: "Bärenpark",
    meta: "Porodična • 2–4 igrača • 30–45 min",
    description:
      "Gradite park medveda kroz polaganje pločica u svoj raspored i trku za najboljim delovima. Pristupačna i taktična.",
    tags: [
      "porodicna",
      "plocice",
      "puzzle",
      "animals",
      "lagana",
      "2-igraca",
      "strategija",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Bärenpark",
  },
  {
    title: "Century: Spice Road",
    meta: "Porodična • 2–5 igrača • 30–45 min",
    description:
      "Kombinujete karte da unapređujete resurse i ispunjavate narudžbine. Čist engine i dobar osećaj planiranja.",
    tags: [
      "porodicna",
      "karte",
      "ekonomija",
      "engine-building",
      "lagana",
      "2-igraca",
      "strategija",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Century: Spice Road",
  },
  {
    title: "Takenoko + Chibis",
    meta: "Porodična • 2–4 igrača • 45 min",
    description:
      "Negujte bambus baštu, postavljajte pločice i navodnjavanje, ispunjavajte ciljeve i pazite na pandu. Prelepa porodična strategija.",
    tags: [
      "porodicna",
      "plocice",
      "animals",
      "lagana",
      "2-igraca",
      "strategija",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Takenoko + Chibis",
  },
  {
    title: "Acropolis",
    meta: "Porodična • 1–4 igrača • 20–30 min",
    description:
      "Gradite grad slojevima pločica i pokušavate da optimizujete bodovanje kvartova. Kratko, jasno i taktično.",
    tags: [
      "porodicna",
      "plocice",
      "puzzle",
      "strategija",
      "lagana",
      "2-igraca",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Acropolis",
  },
  {
    title: "Project L",
    meta: "Porodična • 1–4 igrača • 20–40 min",
    description:
      "Tetris-like puzzle sa pločicama: uzimate akcije i popunjavate obrasce za poene, uz postepeno jačanje svojih mogućnosti.",
    tags: ["porodicna", "puzzle", "abstract", "strategija", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Project L",
  },
  {
    title: "Forest Shuffle + Alps (Expansion)",
    meta: "Porodična / Strategija • 2–5 igrača • 40–60 min",
    description:
      "Gradite šumski ekosistem kroz slaganje karata i bodovanje kombinacija. Lako za početak, sa lepom dubinom planiranja.",
    tags: ["porodicna", "karte", "strategija", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Forest Shuffle + Alps",
  },
  {
    title: "Meadow",
    meta: "Porodična / Strategija • 1–4 igrača • 60–90 min",
    description:
      "Skupljate karte prirode i stvarate kombinacije kroz set collection i pametno upravljanje rukom. Predivna atmosfera i ‘kolekcionarski’ osećaj.",
    tags: [
      "porodicna",
      "strategija",
      "animals",
      "set-collection",
      "karte",
      "2-igraca",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Meadow",
  },
  {
    title: "Honey Buzz",
    meta: "Porodična / Strategija • 1–4 igrača • 45–90 min",
    description:
      "Upravljate košnicom kroz pametan izbor akcija i izgradnju mednog ‘engine-a’. Slatka tema, ozbiljno planiranje.",
    tags: [
      "porodicna",
      "strategija",
      "ekonomija",
      "engine-building",
      "2-igraca",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Honey Buzz",
  },
  {
    title: "Galaxy Trucker",
    meta: "Porodična • 2–4 igrača • 20–30 min",
    description:
      "U real-time fazi sklapate svemirski brod od delova, pa prolazite kroz avanturu punu nezgoda. Haotično zabavno.",
    tags: ["porodicna", "avantura", "plocice", "brza", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Galaxy Trucker",
  },
  {
    title: "The Isle of Cats",
    meta: "Porodična / Strategija • 1–4 igrača • 60–90 min",
    description:
      "Spašavate mačke i slažete ih kao polimine na brod, uz draft karata i planiranje bodovanja. Puzzle + strategija.",
    tags: ["porodicna", "strategija", "puzzle", "animals", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "The Isle of Cats",
  },
  {
    title: "Faraway (Daleke zemlje)",
    meta: "Porodična • 2–6 igrača • 15–20 min",
    description:
      "Kartaška igra draftovanja i set collection-a sa pametnim odlukama u kratkom vremenu. Lako se uči.",
    tags: [
      "porodicna",
      "karte",
      "set-collection",
      "brza",
      "2-igraca",
      "6-plus",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Faraway",
  },
  {
    title: "Castle Combo",
    meta: "Porodična • 2–5 igrača • 10–25 min",
    description:
      "Brz draft karata i slaganje setova kroz jednostavne izbore i kombinacije. Odlična za brze partije.",
    tags: [
      "porodicna",
      "karte",
      "set-collection",
      "brza",
      "lagana",
      "2-igraca",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Castle Combo",
  },
  {
    title: "Nidavelir",
    meta: "Porodična / Strategija • 2–5 igrača • 45 min",
    description:
      "Aukcija novčićima i skupljanje patuljaka za najbolje vojske. Lep miks taktike i set collection-a.",
    tags: ["porodicna", "strategija", "karte", "aukcija", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Nidavelir",
  },
  {
    title: "Sea Salt & Paper",
    meta: "Porodična • 2–4 igrača • 30–45 min",
    description:
      "Skupljate setove origami karata i odlučujete kada je pravi trenutak da završite rundu. Kratko, elegantno, ‘push-your-luck’ osećaj.",
    tags: ["porodicna", "karte", "set-collection", "lagana", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Sea Salt & Paper",
  },
  {
    title: "Trekking Through History",
    meta: "Porodična • 1–4 igrača • 30–60 min",
    description:
      "Putujete kroz istorijske događaje, skupljate setove i učite usput. Prijateljski i edukativno-avanturistički vibe.",
    tags: ["porodicna", "edukativna", "avantura", "set-collection", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Trekking Through History",
  },
  {
    title: "Kanagawa",
    meta: "Porodična • 2–4 igrača • 45 min",
    description:
      "Sakupljate elemente i gradite ‘sliku’ kroz set collection i pametan tajming. Lepo, mirno i taktično.",
    tags: ["porodicna", "karte", "set-collection", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Kanagawa",
  },
  {
    title: "Dream Home",
    meta: "Porodična • 2–4 igrača • 30 min",
    description:
      "Birate sobe i dodatke i slažete svoju kuću za poene. Brzo draftovanje i lagana taktika.",
    tags: ["porodicna", "karte", "set-collection", "lagana", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Dream Home",
  },
  {
    title: "Get on Board: New York & London",
    meta: "Porodična • 2–5 igrača • 30 min",
    description:
      "Planirate linije prevoza i popunjavate mrežu po mapi. Brzo i jasno, sa dosta optimizacije.",
    tags: [
      "porodicna",
      "transport",
      "network-building",
      "lagana",
      "2-igraca",
      "strategija",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Get on Board: NY & London",
  },
  {
    title: "Captain Flip",
    meta: "Porodična • 2–5 igrača • 20 min",
    description:
      "Brza porodična igra sa grid-om, memorijom i bodovanjem kroz jednostavne odluke. Kratka i vrlo pitka.",
    tags: ["porodicna", "brza", "lagana", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Captain Flip",
  },
  {
    title: "Pixies",
    meta: "Porodična • 2–5 igrača • 30 min",
    description:
      "Kartaška igra set collection-a sa temom životinja i povezivanja karata. Pristupačna i brza za učenje.",
    tags: [
      "porodicna",
      "animals",
      "karte",
      "set-collection",
      "lagana",
      "2-igraca",
    ],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Pixies",
  },
  {
    title: "Dragonkeepers",
    meta: "Porodična • 2–4 igrača • 20 min",
    description:
      "Draftujete i skupljate setove kroz kartu-mehanike i upravljanje rukom. Kratka i pitka porodična igra.",
    tags: ["porodicna", "karte", "set-collection", "brza", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Dragonkeepers",
  },
  {
    title: "Animals on Board",
    meta: "Porodična • 2–4 igrača • 15–30 min",
    description:
      "I-cut-you-choose i set collection: pametno delite opcije i birate najbolje. Brzo i zanimljivo.",
    tags: ["porodicna", "set-collection", "lagana", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Animals on Board",
  },
  {
    title: "Boreal",
    meta: "Porodična • 2 igrača • 15–20 min",
    description:
      "Duel sa kartama i polaganjem pločica: skupljate setove i gradite teritorije kroz kratke partije.",
    tags: ["porodicna", "karte", "plocice", "brza", "lagana", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Boreal",
  },
  {
    title: "Prime Climb",
    meta: "Porodična • 1–4 igrača • 20–45 min",
    description:
      "Edukativna matematička igra sa bacanjem kockica i kretanjem po tabli, uz učenje brojeva i faktora.",
    tags: ["porodicna", "edukativna", "kockice", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Prime Climb",
  },
  {
    title: "Baobab",
    meta: "Porodična • 2–4 igrača • 20 min",
    description:
      "Dexterity igra sa životinjama: balansiranje i fizičke akcije uz brze runde.",
    tags: ["porodicna", "dexterity", "animals", "brza", "lagana", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Baobab",
  },
  {
    title: "Carcassonne",
    meta: "Porodična • 2–5 igrača • 35–45 min",
    description:
      "Gradite srednjovekovni pejzaž postavljanjem pločica i osvajajte bodove kroz gradove, puteve i manastire. Jednostavna pravila, ali mnogo taktike.",
    tags: ["porodicna", "plocice", "strategija", "lagana", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Carcassonne",
  },
  {
    title: "Ticket to Ride",
    meta: "Porodična • 2–5 igrača • 30–60 min",
    description:
      "Sakupljajte karte vozova i povezujte gradove širom mape. Lako se uči, ali zahteva planiranje i blokiranje protivnika.",
    tags: ["porodicna", "vozovi", "ruta", "taktika", "2-igraca"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Ticket to Ride",
  },
  {
    title: "Dixit",
    meta: "Party / Porodična • 3–6 igrača • 30 min",
    description:
      "Kreativna igra mašte i asocijacija. Jedan igrač daje opis ilustracije, a ostali pokušavaju da pogode koja karta je njegova.",
    tags: ["party", "kreativna", "asocijacije", "lagana", "6-plus"],
    category: "👨‍👩‍👧‍👦 Porodične igre",
    displayTitle: "Dixit",
  },
  {
    title: "Gloomhaven",
    meta: "Strategija • 1–4 igrača • 60–120 min",
    description:
      "Kooperativna taktička kampanja sa istraživanjem i borbama. Igrači razvijaju likove kroz dugu narativnu avanturu.",
    tags: ["strategija", "kooperativna", "2-igraca"],
    category: "🧠 Strateške igre",
    displayTitle: "Gloomhaven",
  },
  {
    title: "Lost Ruins of Arnak",
    meta: "Strategija • 1–4 igrača • 30–120 min",
    description:
      "Istraživanje ostrva, deck building i radnici. Kombinuje avanturu i ekonomsku optimizaciju.",
    tags: ["strategija", "2-igraca"],
    category: "🧠 Strateške igre",
    displayTitle: "Lost Ruins of Arnak",
  },
  {
    title: "White Castle",
    meta: "Strategija • 1–4 igrača • 80 min",
    description:
      "Akciono draftovanje i ekonomska optimizacija u feudalnom Japanu.",
    tags: ["strategija", "2-igraca"],
    category: "🧠 Strateške igre",
    displayTitle: "White Castle",
  },
  {
    title: "Kutná Hora: The City of Silver",
    meta: "Strategija • 2–4 igrača • 60–120 min",
    description:
      "Srednjovekovna ekonomska simulacija sa dinamičnim tržištem i gradnjom grada.",
    tags: ["strategija", "2-igraca"],
    category: "🧠 Strateške igre",
    displayTitle: "Kutná Hora",
  },
  {
    title: "Lords of Waterdeep",
    meta: "Strategija • 2–5 igrača • 60–120 min",
    description:
      "Radnici, skriveni ciljevi i fantasy tematika u klasičnoj worker-placement igri.",
    tags: ["strategija", "2-igraca"],
    category: "🧠 Strateške igre",
    displayTitle: "Lords of Waterdeep",
  },
  {
    title: "Lords of Hellas",
    meta: "Strategija • 1–4 igrača • 60–90 min",
    description:
      "Teritorijalna borba i izgradnja mitoloških struktura u grčkom svetu.",
    tags: ["strategija", "2-igraca"],
    category: "🧠 Strateške igre",
    displayTitle: "Lords of Hellas",
  },
  {
    title: "Robinson Crusoe",
    meta: "Strategija / Kooperativna • 1–4 igrača • 60–120 min",
    description:
      "Preživljavanje na pustom ostrvu kroz scenarije i upravljanje resursima.",
    tags: ["strategija", "kooperativna", "2-igraca"],
    category: "🧠 Strateške igre",
    displayTitle: "Robinson Crusoe",
  },
  {
    title: "Red Rising",
    meta: "Strategija • 1–6 igrača • 45–60 min",
    description:
      "Draftovanje i kombinovanje karata u univerzumu istoimenog romana.",
    tags: ["strategija", "2-igraca", "6-plus"],
    category: "🧠 Strateške igre",
    displayTitle: "Red Rising",
  },
  {
    title: "Catan",
    meta: "Strategija • 3–4 igrača • 60–90 min",
    description:
      "Trgujte resursima, gradite naselja i puteve i taktički se pozicionirajte kako biste osvojili ostrvo Katan.",
    tags: ["strategija", "trade", "resursi", "klasik"],
    category: "🧠 Strateške igre",
    displayTitle: "Catan",
  },
  {
    title: "Everdell",
    meta: "Strategija • 1–4 igrača • 40–80 min",
    description:
      "Gradite šumski grad koristeći radnike i kombinacije karata. Prelepa ilustracija i duboka strategija.",
    tags: ["strategija", "engine-building", "fantasy", "karte", "2-igraca"],
    category: "🧠 Strateške igre",
    displayTitle: "Everdell",
  },
  {
    title: "Terraforming Mars",
    meta: "Strategija • 1–5 igrača • 90–120 min",
    description:
      "Korporacije se takmiče u teraformiranju Marsa. Upravljajte resursima i razvijajte projekte kako biste učinili planetu nastanjivom.",
    tags: ["strategija", "svemir", "resursi", "kompleksna", "2-igraca"],
    category: "🧠 Strateške igre",
    displayTitle: "Terraforming Mars",
  },
  {
    title: "Avalon",
    meta: "Party • 5–10 igrača • 30 min",
    description:
      "Skrivene uloge, blef i timska dedukcija u svetu Artura. Igrači pokušavaju da otkriju ko je na čijoj strani.",
    tags: ["party", "dedukcija", "bluff", "uloge", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Avalon",
  },
  {
    title: "The Resistance: Avalon",
    meta: "Party • 5–10 igrača • 30 min",
    description:
      "Timska igra skrivenih uloga: misije, sumnja i blef. Idealna za veće društvo.",
    tags: ["party", "dedukcija", "bluff", "uloge", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "The Resistance: Avalon",
  },
  {
    title: "Deception: Murder in Hong Kong",
    meta: "Party • 4–12 igrača • 20 min",
    description:
      "Jedan igrač zna istinu o zločinu, ostali pokušavaju da otkriju ubicu kroz tragove, blef i dedukciju.",
    tags: ["party", "dedukcija", "mystery", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Deception: Murder in Hong Kong",
  },
  {
    title: "Coup",
    meta: "Party • 2–6 igrača • 15 min",
    description:
      "Brza igra blefa i skrivenih uloga: pretnje, izazovi i eliminacije u kratkim rundama.",
    tags: [
      "party",
      "bluff",
      "dedukcija",
      "brza",
      "lagana",
      "2-igraca",
      "6-plus",
    ],
    category: "🎉 Party igre",
    displayTitle: "Coup",
  },
  {
    title: "Spicy",
    meta: "Party • 2–6 igrača • 15–20 min",
    description:
      "Kartaški blef: prijavljuješ šta si odigrao, ali možda lažeš… a drugi proveravaju.",
    tags: ["party", "bluff", "karte", "brza", "lagana", "2-igraca", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Spicy",
  },
  {
    title: "Exploding Kittens: Recipes for Disaster",
    meta: "Party • 2–5 igrača • 15 min",
    description:
      "Brza ‘hot potato’ kartaška igra sa push-your-luck momentima i haotičnim preokretima.",
    tags: ["party", "karte", "brza", "lagana", "2-igraca"],
    category: "🎉 Party igre",
    displayTitle: "Exploding Kittens: Recipes for Disaster",
  },
  {
    title: "Taco Cat Goat Cheese Pizza",
    meta: "Party • 2–8 igrača • 10 min",
    description:
      "Real-time kartaška igra refleksa i brzine. Kratko, glasno i zarazno.",
    tags: ["party", "brza", "lagana", "2-igraca", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Taco Cat Goat Cheese Pizza",
  },
  {
    title: "Trapwords",
    meta: "Party • 4–8 igrača • 30–45 min",
    description:
      "Timska igra reči sa ‘zabranjenim’ pojmovima: smišljate tragove, ali vas protivnici sapliću zamkama.",
    tags: ["party", "reci", "timska", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Trapwords",
  },
  {
    title: "Paranormal Detectives",
    meta: "Party • 3–6 igrača • 30–50 min",
    description:
      "Murder/mystery: postavljate pitanja (da/ne i slično) da biste rešili slučaj. Atmosferično i društveno.",
    tags: ["party", "mystery", "dedukcija", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Paranormal Detectives",
  },
  {
    title: "Bang! The Dice Game",
    meta: "Party • 3–8 igrača • 15 min",
    description:
      "Kockice, uloge i pucnjava u vestern stilu. Brze runde i puno smeha.",
    tags: ["party", "kockice", "brza", "lagana", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Bang! The Dice Game",
  },
  {
    title: "Cabanga!",
    meta: "Party • 3–6 igrača • 20 min",
    description: "Brza kartaška igra za društvo. Lako se uči i brzo ide.",
    tags: ["party", "karte", "lagana", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Cabanga!",
  },
  {
    title: "Coyote",
    meta: "Party • 3–6 igrača • 15–25 min",
    description:
      "Blef i procena: znaš tuđe brojeve, ali ne i svoj. Cilj je da pogodiš ukupno bez da preteraš.",
    tags: ["party", "bluff", "lagana", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Coyote",
  },
  {
    title: "Kluster",
    meta: "Party • 1–4 igrača • 10–20 min",
    description:
      "Dexterity sa magnetima: postavljaš magnete, ali ako se spoje – uzimaš kaznu. Brzo i urnebesno.",
    tags: ["party", "dexterity", "brza", "lagana", "2-igraca"],
    category: "🎉 Party igre",
    displayTitle: "Kluster",
  },
  {
    title: "So Clover!",
    meta: "Party / Kooperativna • 3–6 igrača • 30 min",
    description:
      "Kooperativna igra reči: povezujete pojmove i pokušavate da tim pogodi tačne veze.",
    tags: ["party", "kooperativna", "reci", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "So Clover!",
  },
  {
    title: "The Mind",
    meta: "Party / Kooperativna • 2–4 igrača • 20 min",
    description:
      "Kooperativno ‘čitanje tima’ bez komunikacije: odigravate brojeve u pravom redosledu.",
    tags: ["party", "kooperativna", "brza", "lagana", "2-igraca"],
    category: "🎉 Party igre",
    displayTitle: "The Mind",
  },
  {
    title: "Hues and Cues",
    meta: "Party • 3–10 igrača • 30 min",
    description:
      "Igra boja i asocijacija: daješ trag, a tim pogađa nijansu na paleti.",
    tags: ["party", "asocijacije", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Hues and Cues",
  },
  {
    title: "Kontour",
    meta: "Party • 3–7 igrača • 20 min",
    description:
      "Brza igra crtanja linijom (bez podizanja olovke) – kratko, jasno i smešno.",
    tags: ["party", "crtanje", "brza", "lagana", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Kontour",
  },
  {
    title: "Rory's Story Cubes",
    meta: "Party / Kooperativna • 1–12 igrača • 20 min",
    description:
      "Kockice sa simbolima za pričanje priča – improvizacija i kreativnost za sve uzraste.",
    tags: ["party", "kooperativna", "kockice", "lagana", "brza", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Rory's Story Cubes",
  },
  {
    title: "Unstable Unicorns",
    meta: "Party • 2–8 igrača • 30–60 min",
    description:
      "Kartaška igra humora i ‘take that’ poteza: skupljaš unicorns, a drugi ti smetaju.",
    tags: ["party", "karte", "2-igraca", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Unstable Unicorns",
  },
  {
    title: "JunKing",
    meta: "Party • 2–6 igrača • 30–60 min",
    description:
      "Kartaška igra humora i ‘take that’ stila, sa upravljanjem rukom i set collection-om.",
    tags: ["party", "karte", "2-igraca", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "JunKing",
  },
  {
    title: "Munchkin Deluxe",
    meta: "Party • 3–6 igrača • 60–120 min",
    description:
      "Humor + kartaška borba: skupljaš opremu, izdaješ, pomažeš i pokušavaš da ‘ukradeš’ pobedu.",
    tags: ["party", "karte", "humo", "rpg", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Munchkin Deluxe",
  },
  {
    title: "Illegal",
    meta: "Party • 5–9 igrača • 30 min",
    description:
      "Društvena igra pregovaranja/glasanja sa ulogama i interakcijom – odlična za veće društvo.",
    tags: ["party", "uloge", "timska", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Illegal",
  },
  {
    title: "Jenga",
    meta: "Party • 1–8 igrača • 20 min",
    description:
      "Klasična dexterity igra: izvlačiš blokove i pokušavaš da ne srušiš kulu.",
    tags: ["party", "dexterity", "lagana", "2-igraca", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Jenga",
  },
  {
    title: "Uno",
    meta: "Party • 2–10 igrača • 30 min",
    description:
      "Klasik ‘take that’ kartaška igra za svaku ekipu – brzo se uči i uvek radi.",
    tags: ["party", "karte", "lagana", "2-igraca", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Uno",
  },
  {
    title: "King Size",
    meta: "Party • 2–69 igrača • 10 min",
    description:
      "Ekstremno brza party igra sa kockicama i humorom – idealna za opuštene večeri.",
    tags: ["party", "kockice", "brza", "lagana", "2-igraca", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "King Size",
  },
  {
    title: "Codenames",
    meta: "Party • 2–8 igrača • 15–20 min",
    description:
      "Dve ekipe pokušavaju da pogode svoje reči na osnovu jedne asocijacije. Brza, zabavna i taktička.",
    tags: ["party", "reci", "timska", "brza", "2-igraca", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Codenames",
  },
  {
    title: "Dobble",
    meta: "Party • 2–8 igrača • 10–15 min",
    description:
      "Brza igra refleksa – pronađi zajednički simbol pre ostalih! Idealna za sve uzraste.",
    tags: ["party", "brza", "refleksi", "lagana", "2-igraca", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Dobble",
  },
  {
    title: "Just One",
    meta: "Party • 3–7 igrača • 20 min",
    description:
      "Kooperativna igra pogađanja reči gde tim daje jedinstvene tragove – ali isti tragovi se brišu!",
    tags: ["party", "kooperativna", "reci", "timska", "6-plus"],
    category: "🎉 Party igre",
    displayTitle: "Just One",
  },
  {
    title: "Whitehall Mystery",
    meta: "Dedukcija • 2–4 igrača • 45–60 min",
    description:
      "Jedan igrač beži kao Jack the Ripper, ostali ga love kroz skriveno kretanje i timsku analizu tragova.",
    tags: ["dedukcija", "strategija", "2-igraca", "timska"],
    category: "🕵️ Dedukcija",
    displayTitle: "Whitehall Mystery",
  },
  {
    title: "Mysterium Park",
    meta: "Dedukcija / Kooperativna • 2–6 igrača • 30–45 min",
    description:
      "Jedan igrač daje vizuelne tragove, ostali pokušavaju da reše misteriju kroz asocijacije i logiku.",
    tags: ["dedukcija", "kooperativna", "mystery", "2-igraca", "6-plus"],
    category: "🕵️ Dedukcija",
    displayTitle: "Mysterium Park",
  },
  {
    title: "Temple Code",
    meta: "Dedukcija • 1–4 igrača • 30 min",
    description:
      "Kombinovanje karata i logičko zaključivanje kako biste rešili tajni kod pre ostalih.",
    tags: ["dedukcija", "logika", "2-igraca"],
    category: "🕵️ Dedukcija",
    displayTitle: "Temple Code",
  },
  {
    title: "Cold War: CIA vs KGB",
    meta: "Dedukcija / Strategija • 2 igrača • 30–60 min",
    description:
      "Duel blefa i političkog nadmudrivanja između dve suprotstavljene sile.",
    tags: ["dedukcija", "strategija", "2-igraca", "bluff"],
    category: "🕵️ Dedukcija",
    displayTitle: "Cold War: CIA vs KGB",
  },
  {
    title: "Blood Bound",
    meta: "Dedukcija • 6–12 igrača • 30 min",
    description:
      "Igra skrivenih uloga gde pokušavate da otkrijete protivnički tim kroz napade i interakciju.",
    tags: ["dedukcija", "uloge", "6-plus"],
    category: "🕵️ Dedukcija",
    displayTitle: "Blood Bound",
  },
  {
    title: "Captain Sonar",
    meta: "Dedukcija / Real-time • 2–8 igrača • 45–60 min",
    description:
      "Dve podmornice u real-time nadmudrivanju. Timska koordinacija i analiza protivničkog kretanja su ključ.",
    tags: ["dedukcija", "real-time", "timska", "6-plus"],
    category: "🕵️ Dedukcija",
    displayTitle: "Captain Sonar",
  },
  {
    title: "Cluedo",
    meta: "Dedukcija • 2–6 igrača • 45 min",
    description:
      "Klasična misterija ubistva: ko, gde i čime? Logika i eliminacija opcija.",
    tags: ["dedukcija", "lagana", "2-igraca", "6-plus"],
    category: "🕵️ Dedukcija",
    displayTitle: "Cluedo",
  },
  {
    title: "Stratego",
    meta: "Dedukcija / Strategija • 2 igrača • 45 min",
    description:
      "Skrivene vrednosti figura i taktičko planiranje kroz ratnu tematiku.",
    tags: ["dedukcija", "strategija", "2-igraca"],
    category: "🕵️ Dedukcija",
    displayTitle: "Stratego",
  },
  {
    title: "Saboteur",
    meta: "Dedukcija / Party • 3–10 igrača • 30 min",
    description:
      "Jedan ili više sabotera pokušavaju da poremete tim rudara – ali niko ne zna ko je ko.",
    tags: ["dedukcija", "bluff", "party", "6-plus"],
    category: "🕵️ Dedukcija",
    displayTitle: "Saboteur",
  },
  {
    title: "Blood on the Clocktower",
    meta: "Dedukcija • 6–15 igrača • 60–120 min",
    description:
      "Intenzivna igra društvene dedukcije gde igrači pokušavaju da otkriju ko je demon među njima.",
    tags: ["dedukcija", "bluff", "uloge", "6-plus"],
    category: "🕵️ Dedukcija",
    displayTitle: "Blood on the Clocktower",
  },
  {
    title: "Secret Hitler",
    meta: "Dedukcija • 5–10 igrača • 45 min",
    description: "Politička igra skrivenih uloga.",
    tags: ["dedukcija", "uloge", "bluff", "timska", "6-plus"],
    category: "🕵️ Dedukcija",
    displayTitle: "Secret Hitler",
  },
  {
    title: "The Resistance",
    meta: "Dedukcija • 5–10 igrača • 30 min",
    description:
      "Otpor pokušava da sabotira misije dok lojalni članovi pokušavaju da otkriju špijune.",
    tags: ["dedukcija", "timska", "bluff", "6-plus"],
    category: "🕵️ Dedukcija",
    displayTitle: "The Resistance",
  },
  {
    title: "Magic: The Gathering",
    meta: "TCG • 2+ igrača • Turniri i casual",
    description:
      "Jedna od najaktivnijih zajednica u Eliksiru. Magic: The Gathering se igra kroz casual partije, organizovana okupljanja i turnire.",
    tags: ["tcg", "karte", "turniri", "strategija", "2-igraca"],
    category: "🃏 TCG",
    displayTitle: "Magic: The Gathering",
  },
  {
    title: "Yu-Gi-Oh!",
    meta: "TCG • 2 igrača • Turniri i druženja",
    description:
      "Brza i taktička kartaška igra sa raznim stilovima igre. Redovan deo TCG zajednice u klubu.",
    tags: ["tcg", "karte", "turniri", "duel", "2-igraca"],
    category: "🃏 TCG",
    displayTitle: "Yu-Gi-Oh!",
  },
  {
    title: "One Piece Card Game",
    meta: "TCG • 2 igrača • Događaji i casual",
    description:
      "Popularan TCG naslov koji okuplja zajednicu igrača kroz druženja, učenje i takmičarske partije.",
    tags: ["tcg", "karte", "duel", "2-igraca"],
    category: "🃏 TCG",
    displayTitle: "One Piece Card Game",
  },
];
