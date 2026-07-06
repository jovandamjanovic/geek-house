"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TOPIC_OPTIONS = [
  { value: "opste", label: "Opšte" },
  { value: "dogadjaji", label: "Događaji" },
  { value: "rezervacija", label: "Rezervacija" },
  { value: "shop", label: "Porudžbina" },
];

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildPrefillMessage(params: URLSearchParams) {
  const topicParam = params.get("topic");
  const roomParam = params.get("room");
  const actionParam = params.get("action");
  const eventParam = params.get("event");
  const productParam = params.get("product");
  const publisherParam = params.get("publisher");
  const priceParam = params.get("price");
  const memberPriceParam = params.get("memberPrice");

  if (actionParam === "prijava") {
    return `Zdravo,

Voleo/la bih da se prijavim${eventParam ? ` za "${eventParam}"` : ""}.

Broj osoba / tim:
Kontakt telefon:

Hvala!`;
  }

  if (roomParam) {
    return `Zdravo,

Voleo/la bih da rezervišem prostoriju "${roomParam}".

Datum:
Vreme:
Broj osoba:
Kontakt telefon:

Hvala!`;
  }

  if (topicParam === "shop" && productParam) {
    const niceProduct = decodeURIComponent(productParam);
    const nicePublisher = publisherParam
      ? decodeURIComponent(publisherParam)
      : "";
    const nicePrice = priceParam ? decodeURIComponent(priceParam) : "";
    const niceMemberPrice = memberPriceParam
      ? decodeURIComponent(memberPriceParam)
      : "";

    return `Zdravo,

Voleo/la bih da se raspitam o igri "${niceProduct}".${nicePublisher ? `\nIzdavač: ${nicePublisher}` : ""}${nicePrice ? `\nCena: ${nicePrice} din` : ""}${niceMemberPrice ? `\nCena za članove: ${niceMemberPrice} din` : ""}

Broj komada:
Kontakt telefon:

Hvala!`;
  }

  return "";
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const prefillDone = useRef(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("opste");
  const [message, setMessage] = useState("");
  const [topicOpen, setTopicOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [statusClass, setStatusClass] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (prefillDone.current) return;
    prefillDone.current = true;

    const topicParam = searchParams.get("topic");
    if (topicParam && TOPIC_OPTIONS.some((o) => o.value === topicParam)) {
      setTopic(topicParam);
    }

    const prefill = buildPrefillMessage(searchParams);
    if (prefill) setMessage(prefill);
  }, [searchParams]);

  const topicLabel =
    TOPIC_OPTIONS.find((o) => o.value === topic)?.label ?? "Opšte";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("");
    setStatusClass("");

    const nextErrors: Record<string, string> = {};

    if (!name.trim()) nextErrors.name = "Unesi ime.";
    if (!email.trim()) nextErrors.email = "Unesi email.";
    else if (!isEmail(email.trim())) nextErrors.email = "Email nije validan.";
    if (!message.trim()) nextErrors.message = "Napiši poruku.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("Proveri polja iznad.");
      setStatusClass("fail");
      return;
    }

    setSubmitting(true);

    try {
      setStatus(
        "Trenutno radimo na povezivanju kontakt forme. Za poruke nas kontaktiraj preko Vibera, WhatsApp-a ili društvenih mreža.",
      );
      setStatusClass("fail");
      setName("");
      setEmail("");
      setTopic("opste");
      setMessage("");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">Ime</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Tvoje ime"
          required
          value={name}
          className={errors.name ? "input-error" : ""}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
        />
        <small className="error">{errors.name}</small>
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="ime@email.com"
          required
          value={email}
          className={errors.email ? "input-error" : ""}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />
        <small className="error">{errors.email}</small>
      </div>

      <div className="field">
        <label htmlFor="topic">Tema</label>
        <div
          className={`custom-select${topicOpen ? " open" : ""}`}
          id="topicSelect"
        >
          <button
            type="button"
            className="select-selected"
            aria-haspopup="listbox"
            aria-expanded={topicOpen}
            onClick={() => setTopicOpen((open) => !open)}
          >
            {topicLabel}
            <span className="select-caret">▼</span>
          </button>
          <div className="select-options" role="listbox">
            {TOPIC_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`select-option${topic === option.value ? " active" : ""}`}
                onClick={() => {
                  setTopic(option.value);
                  setTopicOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
          <select
            id="topic"
            name="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            tabIndex={-1}
            aria-hidden
          >
            {TOPIC_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="message">Poruka</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Napiši poruku..."
          required
          value={message}
          className={errors.message ? "input-error" : ""}
          onChange={(e) => {
            setMessage(e.target.value);
            setErrors((prev) => ({ ...prev, message: "" }));
          }}
        />
        <small className="error">{errors.message}</small>
      </div>

      <button className="contact-btn" type="submit" disabled={submitting}>
        {submitting ? "Šaljem..." : "Pošalji"}
      </button>
      {status ? (
        <div className={`form-status ${statusClass}`} aria-live="polite">
          {status}
        </div>
      ) : null}
    </form>
  );
}
