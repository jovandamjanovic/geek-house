// Custom topic select for the contact form.

export function initCustomTopicSelect() {
  const root = document.getElementById("topicSelect");

  if (!root) return;

  const button = root.querySelector(".select-selected");
  const optionsWrap = root.querySelector(".select-options");
  const options = Array.from(root.querySelectorAll(".select-option"));
  const realSelect = root.querySelector("#topic");

  if (!button || !optionsWrap || !realSelect || options.length === 0) return;

  function openSelect() {
    root.classList.add("open");
    button.setAttribute("aria-expanded", "true");
  }

  function closeSelect() {
    root.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
  }

  button.addEventListener("click", () => {
    if (root.classList.contains("open")) {
      closeSelect();
    } else {
      openSelect();
    }
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;
      const label = option.textContent.trim();

      button.childNodes[0].textContent = `${label} `;

      options.forEach((item) => item.classList.remove("active"));
      option.classList.add("active");

      realSelect.value = value;
      closeSelect();
    });
  });

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      closeSelect();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSelect();
    }
  });

  const initialValue = realSelect.value;
  const initialOption = options.find((option) => option.dataset.value === initialValue);

  if (initialOption) {
    button.childNodes[0].textContent = `${initialOption.textContent.trim()} `;

    options.forEach((option) => option.classList.remove("active"));
    initialOption.classList.add("active");
  }
}

// Contact form validation and submit.

export function initContactForm() {
  const form = document.getElementById("contactForm");

  if (!form) return;

  const status = document.getElementById("formStatus");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");
  const topic = document.getElementById("topic");
  const submitButton = form.querySelector("button[type='submit']");

  function setError(element, messageText) {
    element.classList.add("input-error");

    const error = element.parentElement.querySelector(".error");

    if (error) {
      error.textContent = messageText;
    }
  }

  function clearError(element) {
    element.classList.remove("input-error");

    const error = element.parentElement.querySelector(".error");

    if (error) {
      error.textContent = "";
    }
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (status) {
      status.textContent = "";
      status.className = "form-status";
    }

    let isValid = true;

    if (!name.value.trim()) {
      setError(name, "Unesi ime.");
      isValid = false;
    } else {
      clearError(name);
    }

    if (!email.value.trim()) {
      setError(email, "Unesi email.");
      isValid = false;
    } else if (!isEmail(email.value.trim())) {
      setError(email, "Email nije validan.");
      isValid = false;
    } else {
      clearError(email);
    }

    if (!message.value.trim()) {
      setError(message, "Napiši poruku.");
      isValid = false;
    } else {
      clearError(message);
    }

    if (!isValid) {
      if (status) {
        status.textContent = "Proveri polja iznad.";
        status.classList.add("fail");
      }

      return;
    }

    const oldButtonText = submitButton ? submitButton.textContent : "";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Šaljem...";
    }

    try {
      // TODO: Connect form submission to the production backend/API.
      if (status) {
        status.textContent =
          "Trenutno radimo na povezivanju kontakt forme. Za poruke nas kontaktiraj preko Vibera, WhatsApp-a ili društvenih mreža.";
        status.classList.add("fail");
      }

      form.reset();
    } catch {
      if (status) {
        status.textContent = "Došlo je do greške. Pokušaj ponovo.";
        status.classList.add("fail");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = oldButtonText;
      }
    }
  });
}

// Prefills message and topic from URL parameters.

export function prefillContactFromURL() {
  const form = document.getElementById("contactForm");

  if (!form) return;

  const params = new URLSearchParams(window.location.search);

  const topicParam = params.get("topic");
  const roomParam = params.get("room");
  const actionParam = params.get("action");
  const eventParam = params.get("event");
  const productParam = params.get("product");
  const publisherParam = params.get("publisher");
  const priceParam = params.get("price");
  const memberPriceParam = params.get("memberPrice");

  const topic = document.getElementById("topic");
  const message = document.getElementById("message");

  if (topicParam && topic) {
    topic.value = topicParam;
  }

  if (!message || message.value.trim()) return;

  if (actionParam === "prijava") {
    message.value = `Zdravo,

Voleo/la bih da se prijavim${eventParam ? ` za "${eventParam}"` : ""}.

Broj osoba / tim:
Kontakt telefon:

Hvala!`;
    return;
  }

  if (roomParam) {
    message.value = `Zdravo,

Voleo/la bih da rezervišem prostoriju "${roomParam}".

Datum:
Vreme:
Broj osoba:
Kontakt telefon:

Hvala!`;
    return;
  }

  if (topicParam === "shop" && productParam) {
    const niceProduct = decodeURIComponent(productParam);
    const nicePublisher = publisherParam ? decodeURIComponent(publisherParam) : "";
    const nicePrice = priceParam ? decodeURIComponent(priceParam) : "";
    const niceMemberPrice = memberPriceParam ? decodeURIComponent(memberPriceParam) : "";

    message.value = `Zdravo,

Voleo/la bih da se raspitam o igri "${niceProduct}".${nicePublisher ? `\nIzdavač: ${nicePublisher}` : ""}${nicePrice ? `\nCena: ${nicePrice} din` : ""}${niceMemberPrice ? `\nCena za članove: ${niceMemberPrice} din` : ""}

Broj komada:
Kontakt telefon:

Hvala!`;
  }
}