"use client";

import { useEffect, useState } from "react";

const OPEN_HOUR = 17;
const CLOSE_HOUR = 23;
const TIME_ZONE = "Europe/Belgrade";

function pad(number: number) {
  return String(number).padStart(2, "0");
}

function getBelgradeTime() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return {
    weekday: values.weekday,
    hour: Number(values.hour),
    minute: Number(values.minute),
  };
}

export default function OpenStatus() {
  const [status, setStatus] = useState<{
    isOpen: boolean;
    html: string;
  } | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      const { weekday, hour, minute } = getBelgradeTime();
      const isMonday = weekday === "Mon";
      const isWorkingHours =
        hour >= OPEN_HOUR &&
        (hour < CLOSE_HOUR || (hour === CLOSE_HOUR && minute === 0));
      const isOpen = !isMonday && isWorkingHours;
      const currentTime = `${pad(hour)}:${pad(minute)}`;

      if (isOpen) {
        setStatus({
          isOpen: true,
          html: `🟢 Trenutno smo <b>otvoreni</b> <span class="small">Danas radimo do ${pad(CLOSE_HOUR)}:00 • Vreme u Nišu ${currentTime}</span>`,
        });
        return;
      }

      let note = "";
      if (isMonday) note = "Ponedeljkom ne radimo.";
      else if (hour < OPEN_HOUR) note = `Otvaramo u ${pad(OPEN_HOUR)}:00.`;
      else note = "Radno vreme je završeno za danas.";

      setStatus({
        isOpen: false,
        html: `🔴 Trenutno smo <b>zatvoreni</b> <span class="small">${note} • Vreme u Nišu ${currentTime}</span>`,
      });
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div className="open-status" aria-live="polite" />;

  return (
    <div
      className={`open-status ${status.isOpen ? "open" : "closed"}`}
      aria-live="polite"
      dangerouslySetInnerHTML={{ __html: status.html }}
    />
  );
}
