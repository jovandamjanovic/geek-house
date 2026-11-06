// Shop page: search, sort, filter, render cards and product modal.

const GAMES = [
  { name: "5 KULA", publisher: "Cool Play", qty: 2, price: 1200 },
  { name: "6. NOSI!", publisher: "Mipl", qty: 4, price: 1000 },
  { name: "7 WONDERS", publisher: "Cool Play", qty: 1, price: 5600 },
  { name: "7 WONDERS DUEL", publisher: "Cool Play", qty: 1, price: 3600 },
  { name: "7 WONDERS DUEL ekspanzija PANTHEON", publisher: "Cool Play", qty: 0, price: 3000 },
  { name: "7 WONDERS ekspanzija EDIFICE", publisher: "Cool Play", qty: 1, price: 3400 },
  { name: "AKROPOLIS", publisher: "Games 4 You", qty: 1, price: 3000 },
  { name: "AKVARIJUM", publisher: "Mipl", qty: 0, price: 1600 },
  { name: "ALHAMBRA - REVIDIRANO IZDANJE", publisher: "Games 4 You", qty: 0, price: 4800 },
  { name: "AMBIS", publisher: "Mipl", qty: 0, price: 5500 },
  { name: "AQUA", publisher: "Cool Play", qty: 0, price: 4300 },
  { name: "ARK NOVA", publisher: "Mipl", qty: 0, price: 7500 },
  { name: "ARK NOVA MAPE ZOO VRTA 2", publisher: "Mipl", qty: 0, price: 1200 },
  { name: "AVALON", publisher: "Games 4 You", qty: 0, price: 3000 },
  { name: "AZUL", publisher: "Mipl", qty: 1, price: 5800 },
  { name: "AZUL DUEL", publisher: "Mipl", qty: 0, price: 3800 },
  { name: "AZUL LETNJI PAVILJON MINI", publisher: "Mipl", qty: 0, price: 2800 },
  { name: "AZUL MAJSTOR ČOKOLATIJER", publisher: "Cool Play", qty: 0, price: 6000 },
  { name: "AZUL MINI", publisher: "Mipl", qty: 0, price: 2800 },
  { name: "BANDA", publisher: "Cool Play", qty: 0, price: 2300 },
  { name: "BANG! THE DICE GAME", publisher: "Games 4 You", qty: 5, price: 2500 },
  { name: "BELI DVORAC", publisher: "Games 4 You", qty: 0, price: 3900 },
  { name: "BIBIN SVET - IGRA ZNANJA", publisher: "Laguna", qty: 0, price: 3000 },
  { name: "BITKA ZA HOT", publisher: "Mipl", qty: 1, price: 6000 },
  { name: "BOOP", publisher: "Mipl", qty: 1, price: 3000 },
  { name: "BOOTY CALL", publisher: "Cool Play", qty: 0, price: 2000 },
  { name: "BRASS BIRMINGHAM", publisher: "Cool Play", qty: 0, price: 8000 },
  { name: "CALICO", publisher: "Conflux", qty: 1, price: 4800 },
  { name: "CATAN DODATAK 5 6 IGRACA", publisher: "Mipl", qty: 0, price: 3000 },
  { name: "CATAN OSNOVNA IGRA", publisher: "Mipl", qty: 0, price: 4800 },
  { name: "CATAN POMOCNICI", publisher: "Mipl", qty: 0, price: 1700 },
  { name: "CATAN POMORCI", publisher: "Mipl", qty: 1, price: 4800 },
  { name: "CATAPULT FEUD", publisher: "Cool Play", qty: 0, price: 5000 },
  { name: "CEZAR I KLEOPATRA", publisher: "Cool Play", qty: 0, price: 2800 },
  { name: "CGT", publisher: "Dažbog Games", qty: 5, price: 1800 },
  { name: "CITADELE", publisher: "Cool Play", qty: 0, price: 4000 },
  { name: "CODENAMES", publisher: "Mipl", qty: 1, price: 2600 },
  { name: "CODENAMES DUET", publisher: "Mipl", qty: 0, price: 2600 },
  { name: "CODENAMES SLIKE", publisher: "Games 4 You", qty: 1, price: 2600 },
  { name: "CODENAMES SLIKE", publisher: "Mipl", qty: 0, price: 2600 },
];

const MEMBER_DISCOUNT = 0.1;

export function initShopPage() {
  const elGrid = document.getElementById("shopGrid");
  const elSearch = document.getElementById("shopSearch");
  const elInStock = document.getElementById("inStockOnly");
  const elCount = document.getElementById("resultsCount");

  const modal = document.getElementById("shopModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalPublisher = document.getElementById("modalPublisher");
  const modalPrice = document.getElementById("modalPrice");
  const modalQty = document.getElementById("modalQty");
  const modalStockBadge = document.getElementById("modalStockBadge");
  const modalOrderBtn = document.getElementById("modalOrderBtn");

  const sortWrap = document.getElementById("shopSortWrap");
  const sortTrigger = document.getElementById("shopSortTrigger");
  const sortPanel = document.getElementById("shopSortPanel");
  const sortLabel = document.getElementById("shopSortLabel");

  if (
    !elGrid ||
    !elSearch ||
    !elInStock ||
    !elCount ||
    !modal ||
    !modalTitle ||
    !modalPublisher ||
    !modalPrice ||
    !modalQty ||
    !modalStockBadge ||
    !modalOrderBtn ||
    !sortWrap ||
    !sortTrigger ||
    !sortPanel ||
    !sortLabel
  ) {
    return;
  }

  let sortValue = "relevance";

  // Sort dropdown.

  function openSort() {
    sortWrap.classList.add("is-open");
    sortTrigger.setAttribute("aria-expanded", "true");
  }

  function closeSort() {
    sortWrap.classList.remove("is-open");
    sortTrigger.setAttribute("aria-expanded", "false");
  }

  // Helpers.

  function formatRSD(number) {
    return `${new Intl.NumberFormat("sr-RS").format(number)} din`;
  }

  function getMemberPrice(price) {
    return Math.round(price * (1 - MEMBER_DISCOUNT));
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function escapeAttribute(value) {
    return String(value).replace(/"/g, "&quot;");
  }

  function scoreRelevance(item, query) {
    if (!query) return 0;

    const name = normalize(item.name);
    const publisher = normalize(item.publisher);

    let score = 0;

    if (name === query) score += 100;
    if (name.startsWith(query)) score += 60;
    if (name.includes(query)) score += 35;
    if (publisher.startsWith(query)) score += 18;
    if (publisher.includes(query)) score += 10;

    return score;
  }

  // Filtering and sorting.

  function getFiltered() {
    const query = normalize(elSearch.value);
    const inStockOnly = elInStock.checked;

    const list = GAMES.filter((item) => {
      const matchesStock = !inStockOnly || item.qty > 0;
      const matchesQuery =
        !query ||
        normalize(item.name).includes(query) ||
        normalize(item.publisher).includes(query);

      return matchesStock && matchesQuery;
    });

    if (sortValue === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortValue === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name, "sr"));
    } else if (sortValue === "name-desc") {
      list.sort((a, b) => b.name.localeCompare(a.name, "sr"));
    } else {
      list.sort((a, b) => scoreRelevance(b, query) - scoreRelevance(a, query));
    }

    return list;
  }

  // Cards.

  function cardTemplate(item) {
    const inStock = item.qty > 0;
    const badgeClass = inStock ? "stock-badge" : "stock-badge out";
    const badgeText = inStock ? "Na stanju" : "Nema na stanju";
    const memberPrice = getMemberPrice(item.price);

    return `
      <article
        class="shop-card"
        tabindex="0"
        role="button"
        data-name="${escapeAttribute(item.name)}"
        data-publisher="${escapeAttribute(item.publisher)}"
        data-qty="${item.qty}"
        data-price="${item.price}"
      >
        <div class="${badgeClass}">
          <span class="dot"></span>
          <span>${badgeText}</span>
        </div>

        <h3 class="shop-title">${item.name}</h3>
        <p class="shop-publisher">${item.publisher}</p>

        <div class="shop-row">
          <div class="shop-price-wrap">
            <div class="shop-price">${formatRSD(item.price)}</div>
            <div class="shop-member-price">${formatRSD(memberPrice)} za članove</div>
          </div>

          <div class="shop-qty">${inStock ? `Količina: ${item.qty}` : "—"}</div>
        </div>
      </article>
    `;
  }

  function render() {
    const list = getFiltered();

    elCount.textContent = `${list.length} proizvoda`;
    elGrid.innerHTML = list.map(cardTemplate).join("");

    elGrid.querySelectorAll(".shop-card").forEach((card) => {
      const open = () => {
        openModal({
          name: card.dataset.name,
          publisher: card.dataset.publisher,
          qty: Number(card.dataset.qty),
          price: Number(card.dataset.price),
        });
      };

      card.addEventListener("click", open);

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      });
    });
  }

  // Modal.

  function openModal(item) {
    const inStock = item.qty > 0;
    const memberPrice = getMemberPrice(item.price);

    modal.setAttribute("aria-hidden", "false");

    modalTitle.textContent = item.name;
    modalPublisher.textContent = `Izdavač: ${item.publisher}`;
    modalPrice.innerHTML = `
      <span class="modal-regular-price">${formatRSD(item.price)}</span>
      <span class="modal-member-price">${formatRSD(memberPrice)} za članove</span>
    `;
    modalQty.textContent = inStock
      ? `Na stanju: ${item.qty}`
      : "Trenutno nema na stanju";

    modalStockBadge.className = inStock ? "stock-badge" : "stock-badge out";
    modalStockBadge.innerHTML = `
      <span class="dot"></span>
      <span>${inStock ? "Na stanju" : "Nema na stanju"}</span>
    `;

    const product = encodeURIComponent(item.name);
    const publisher = encodeURIComponent(item.publisher);
    const price = encodeURIComponent(item.price);
    const memberPriceParam = encodeURIComponent(memberPrice);

    modalOrderBtn.href = `kontakt.html?topic=shop&product=${product}&publisher=${publisher}&price=${price}&memberPrice=${memberPriceParam}`;
  }

  function closeModal() {
    const card = modal.querySelector(".shop-modal-card");

    if (!card) {
      modal.setAttribute("aria-hidden", "true");
      return;
    }

    card.style.transform = "scale(.95)";
    card.style.opacity = "0";

    setTimeout(() => {
      modal.setAttribute("aria-hidden", "true");
      card.style.transform = "";
      card.style.opacity = "";
    }, 200);
  }

  // Events.

  sortTrigger.addEventListener("click", () => {
    if (sortWrap.classList.contains("is-open")) {
      closeSort();
    } else {
      openSort();
    }
  });

  sortPanel.addEventListener("click", (event) => {
    const option = event.target.closest(".cs-option");
    if (!option) return;

    sortValue = option.dataset.value;
    sortLabel.textContent = `Sortiraj: ${option.textContent}`;

    sortPanel
      .querySelectorAll(".cs-option")
      .forEach((button) => button.classList.remove("is-active"));

    option.classList.add("is-active");

    closeSort();
    render();
  });

  document.addEventListener("click", (event) => {
    if (!sortWrap.contains(event.target)) {
      closeSort();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeSort();

    if (modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  modal.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-close]");

    if (closeButton) {
      closeModal();
    }
  });

  elSearch.addEventListener("input", render);
  elInStock.addEventListener("change", render);

  render();
}