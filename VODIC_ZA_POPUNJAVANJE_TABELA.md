# Vodič za popunjavanje Google tabela (BlogPost, Događaji, Prostorije)

Ovaj vodič je namenjen ljudima koji **nisu programeri** i treba da unose sadržaj direktno u Google Sheets tabele koje sajt koristi. Prati uputstva korak po korak i sadržaj će se ispravno prikazati na sajtu.

## Opšta pravila (važe za sve tabele)

1. **Prvi red (red 1)** u svakom tabu je zaglavlje (naslovi kolona) — ne unosite podatke u njega, samo naslove.
2. **Podaci počinju od reda 2.** Svaki sledeći red je jedan blog post / događaj / prostorija.
3. **Kolonu A ("id")** kada dodajete novi red — ručno unosite broj, koristite sledeći slobodan redni broj (npr. ako poslednji red ima id `5`, novi treba da bude `6`).
4. Ne menjajte redosled kolona i ne dodajte/brišite kolone — aplikacija čita tabelu po tačno određenom redosledu.
5. Ne ostavljajte prazne redove između popunjenih redova.
6. Kada je polje označeno kao **opciono**, možete ostaviti ćeliju praznu.
7. **Slike (kolone "image"):** link do slike mora biti ili putanja sa sajta (počinje sa `/irena/images/...`) ili link sa sajta **i.ibb.co** (ImgBB). Linkovi sa drugih sajtova neće raditi i mogu da sruše prikaz stranice — ako želite da koristite neki drugi sajt za slike, javite programeru da ga doda.

---

## 1. Tab "BlogPosts" (blog objave)

Opseg kolona: **A do G**

| Kolona | Naziv polja | Obavezno? | Šta upisati                                                                                                              |
| ------ | ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| A      | id          | Da        | sledeći slobodan redni broj                                                                                              |
| B      | image       | Da        | Putanja/link do slike, npr. `/irena/images/igre.webp` ili link sa `https://i.ibb.co/...` (vidi napomenu o slikama ispod) |
| C      | imageAlt    | Da        | Kratak opis slike (za pristupačnost), npr. `Društvene igre na stolu`                                                     |
| D      | meta        | Da        | Slobodan tekst — obično datum i autor, npr. `12. mart 2026 · Eliksir tim`                                                |
| E      | title       | Da        | Naslov blog objave                                                                                                       |
| F      | paragraphs  | Da        | Tekst objave, **podeljen na pasuse** (vidi uputstvo ispod)                                                               |
| G      | list        | Ne        | Lista stavki za sada ostaviti prazno                                                                                     |

### Kako uneti kolonu F — "paragraphs" (pasusi teksta)

Tekst blog objave se piše kao niz pasusa, a **svaki pasus se odvaja sa tri crte (pajp)**: `|||`

Primer (ovo ide u JEDNU ćeliju, kolona F):

```
Ovo je prvi pasus teksta koji uvodi čitaoca u temu.|||Ovo je drugi pasus koji nastavlja priču.|||Ovo je treći, završni pasus.
```

⚠️ **Pazite:** to su tačno tri crte `|||` (na tastaturi je to znak "pajp", obično se kuca sa `Shift + \` ili `AltGr + Ö/W` u zavisnosti od tastature). Nemojte koristiti razmake oko crta osim ako ne žele da budu deo teksta.

---

## 2. Tab "Dogadjaji" (događaji)

Opseg kolona: **A do R**

| Kolona | Naziv polja | Obavezno? | Šta upisati                                                                                                      |
| ------ | ----------- | --------- | ---------------------------------------------------------------------------------------------------------------- |
| A      | id          | Da        | sledeći slobodan redni broj                                                                                      |
| B      | featured    | Da        | Da li je ovo "izdvojen" (glavni, istaknuti) događaj — vidi napomenu ispod                                        |
| C      | title       | Da        | Naziv događaja                                                                                                   |
| D      | description | Da        | Opis događaja                                                                                                    |
| E      | badge       | Da        | Kratka oznaka/kategorija, npr. `Kviz`, `TCG`, `Društvene igre`, `Izdvajamo`                                      |
| F      | badgeClass  | Da        | Stil oznake — mora biti jedna od tačno ovih vrednosti: `badge-quiz`, `badge-tcg`, `badge-board`, `badge-special` |
| G      | date        | Da        | Datum u slobodnom tekstu, npr. `📅 Uto, 12. mart 2026` (koristi se samo kod istaknutog događaja)                 |
| H      | day         | Da        | Skraćenica dana u nedelji, VELIKIM slovima, 3 slova, npr. `PET`, `SUB`, `NED`                                    |
| I      | num         | Da        | Broj dana u mesecu, kao dvocifren tekst, npr. `08`, `09`, `15`                                                   |
| J      | month       | Da        | Skraćenica meseca, VELIKIM slovima, npr. `MAR`, `APR`, `MAJ`                                                     |
| K      | year        | Da        | Godina, npr. `2026`                                                                                              |
| L      | time        | Da        | Vreme početka, npr. `19:00` ili `🕒 19:00`                                                                       |
| M      | players     | Ne        | Broj igrača (samo za istaknuti događaj), npr. `👥 6–15 igrača`                                                   |
| N      | location    | Ne        | Lokacija (samo za istaknuti događaj), npr. `📍 Oblačića Rada 11, Niš`                                            |
| O      | meta        | Da        | Kratak dodatni tekst ispod kartice događaja, npr. `📍 Oblačića Rada 11, Niš`                                     |
| P      | actionLabel | Da        | Tekst na dugmetu, npr. `Prijavi ekipu`, `Rezerviši mesto`                                                        |
| Q      | actionHref  | Da        | Link na koji dugme vodi, npr. `/irena/rezervacija`                                                               |
| R      | signupHref  | Da        | Link za dugme "Prijavi se" (koristi se samo kod istaknutog događaja)                                             |

### Napomena za kolonu B — "featured" (istaknut događaj)

- Ako je događaj **glavni/istaknuti** (prikazuje se kao velika kartica na vrhu stranice), upišite tačno: `TRUE` (velikim slovima).
- Za sve ostale događaje ostavite ćeliju **praznu** ili upišite bilo šta drugo osim `TRUE` — tretiraće se kao "nije istaknut".
- **Samo jedan događaj treba da bude `TRUE` u isto vreme** — ako ih ima više, sajt će uzeti prvi takav red u tabeli.

### Napomena o datumima

Datumi i vreme (kolone G, H, I, J, K, L) se ne "razumeju" automatski od strane sajta — to je samo tekst koji se prikazuje tačno onako kako ga upišete. Zato je važno da:

- `num` uvek bude dvocifren (npr. `05`, ne `5`)
- `day` i `month` uvek budu 3 slova, velikim slovima

Ovo je bitno samo da bi tekst lepo izgledao na sajtu, a ne zbog tehničkih grešaka.

---

## 3. Tab "Prostorije" (sale/prostorije)

Opseg kolona: **A do F**

| Kolona | Naziv polja | Obavezno? | Šta upisati                                                |
| ------ | ----------- | --------- | ---------------------------------------------------------- |
| A      | id          | Da        | sledeći slobodan redni broj                                |
| B      | name        | Da        | Naziv prostorije, npr. `Dungeon`                           |
| C      | image       | Da        | Putanja/link do slike, npr. `/irena/images/dungeon.webp`   |
| D      | capacity    | Da        | Kapacitet, slobodan tekst, npr. `👥 8–10 osoba`            |
| E      | description | Da        | Opis prostorije                                            |
| F      | tags        | Ne        | Oznake/tagovi, odvojeni **jednom crtom** `\|` (vidi ispod) |

### Kako uneti kolonu F — "tags" (oznake)

Ako prostorija ima više oznaka, odvojite ih **jednom crtom** (pajp znak, `|`):

```
RPG|Strategije
```

⚠️ **Važno — ne mešati sa blog objavama!** Kod blog objava (kolona "paragraphs") koriste se **tri crte** `|||`, a kod prostorija (kolona "tags") koristi se **samo jedna crta** `|`. Ovo su dve različite tabele i dva različita pravila — pazite da ih ne pomešate.

Ako prostorija nema oznake, ostavite ćeliju praznu.

---

## Brzi podsetnik — dve najčešće greške

1. **Mešanje crta (pajpova):** `|||` je za pasuse blog objave, `|` je za tagove prostorije.
2. **Loš JSON format u koloni "list" kod blog objava:** ako niste sigurni, radije ostavite prazno i javite programeru da doda listu, nego da rizikujete grešku koja ruši prikaz cele objave.

Ako niste sigurni oko bilo kog polja, najbolje je da pogledate kako izgleda već popunjen red iznad vašeg i kopirate isti stil/format.
