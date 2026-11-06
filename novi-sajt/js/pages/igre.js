// Game search and filters.

export function initGameSearch() {
  const input = document.getElementById("gameSearch");

  if (!input) return;

  const cards = Array.from(document.querySelectorAll(".game-card"));

  if (cards.length === 0) return;

  const resultCount = document.getElementById("resultCount");
  const pills = Array.from(document.querySelectorAll(".filter-pill"));
  const categories = Array.from(document.querySelectorAll(".category"));

  const activeFilters = new Set();

  function update() {
    const query = input.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const text = card.innerText.toLowerCase();
      const tags = (card.dataset.tags || "")
        .toLowerCase()
        .split(",")
        .map((tag) => tag.trim());

      const matchesSearch = text.includes(query);
      const matchesFilters =
        activeFilters.size === 0 ||
        Array.from(activeFilters).every((filter) => tags.includes(filter));

      const shouldShow = matchesSearch && matchesFilters;

      card.style.display = shouldShow ? "" : "none";

      if (shouldShow) {
        visible++;
      }
    });

    categories.forEach((category) => {
      const visibleCards = Array.from(category.querySelectorAll(".game-card")).filter(
        (card) => card.style.display !== "none"
      );

      category.classList.toggle("is-hidden", visibleCards.length === 0);
    });

    if (!resultCount) return;

    if (!query && activeFilters.size === 0) {
      resultCount.textContent = `Ukupno: ${cards.length}`;
      resultCount.classList.remove("no-results", "shake");
    } else if (visible > 0) {
      resultCount.textContent = `Pronađeno: ${visible}`;
      resultCount.classList.remove("no-results", "shake");
    } else {
      resultCount.textContent = "Nema pronađenih igara.";
      resultCount.classList.add("no-results");
      resultCount.classList.remove("shake");

      void resultCount.offsetWidth;

      resultCount.classList.add("shake");
    }
  }

  input.addEventListener("input", update);

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const filter = (pill.dataset.filter || "").toLowerCase();

      if (!filter) return;

      if (activeFilters.has(filter)) {
        activeFilters.delete(filter);
        pill.classList.remove("active");
      } else {
        activeFilters.add(filter);
        pill.classList.add("active");
      }

      update();
    });
  });

  update();
}

// Game details modal.

export function initGameModal() {
  const modal = document.getElementById("gameModal");

  if (!modal) return;

  const titleEl = document.getElementById("modalTitle");
  const metaEl = document.getElementById("modalMeta");
  const descEl = document.getElementById("modalDesc");
  const tagsEl = document.getElementById("modalTags");

  const cards = Array.from(document.querySelectorAll(".game-card"));

  if (cards.length === 0) return;

  function openModal(card) {
    const title = card.dataset.title || card.querySelector("h4")?.innerText || "Igra";
    const meta = card.dataset.meta || "";
    const desc = card.dataset.desc || "Opis uskoro.";
    const tags = (card.dataset.tags || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (titleEl) {
      titleEl.textContent = title;
    }

    if (metaEl) {
      metaEl.textContent = meta;
    }

    if (descEl) {
      descEl.textContent = desc;
    }

    if (tagsEl) {
      tagsEl.innerHTML = "";

      tags.forEach((tag) => {
        const span = document.createElement("span");
        span.className = "tag";
        span.textContent = tag;
        tagsEl.appendChild(span);
      });
    }

    modal.classList.remove("hidden");
    modal.classList.add("show");
  }

  function closeModal() {
    modal.classList.remove("show");
    modal.classList.add("hidden");
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-close='true']")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}

// Featured cards scroll to matching game.

export function initFeaturedCards() {
  const featuredCards = Array.from(document.querySelectorAll(".featured-card"));

  if (featuredCards.length === 0) return;

  featuredCards.forEach((card) => {
    card.addEventListener("click", () => {
      const name = card.dataset.game;

      if (!name) return;

      const target = Array.from(document.querySelectorAll(".game-card")).find(
        (gameCard) =>
          gameCard.dataset.title === name ||
          gameCard.querySelector("h4")?.textContent.trim() === name
      );

      if (!target) return;

      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      target.classList.add("pulse");

      setTimeout(() => {
        target.classList.remove("pulse");
      }, 1100);
    });
  });
}