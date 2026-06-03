// Shows current club open/closed status.

export function initOpenStatus() {
  const statusElement = document.getElementById("openStatus");

  if (!statusElement) return;

  const OPEN_HOUR = 17;
  const CLOSE_HOUR = 23;
  const TIME_ZONE = "Europe/Belgrade";

  function pad(number) {
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
      parts.map((part) => [part.type, part.value])
    );

    return {
      weekday: values.weekday,
      hour: Number(values.hour),
      minute: Number(values.minute),
    };
  }

  function updateStatus() {
    const { weekday, hour, minute } = getBelgradeTime();

    const isMonday = weekday === "Mon";
    const isWorkingHours =
      hour >= OPEN_HOUR && (hour < CLOSE_HOUR || (hour === CLOSE_HOUR && minute === 0));

    const isOpen = !isMonday && isWorkingHours;
    const currentTime = `${pad(hour)}:${pad(minute)}`;

    if (isOpen) {
      statusElement.classList.remove("closed");
      statusElement.classList.add("open");

      statusElement.innerHTML = `🟢 Trenutno smo <b>otvoreni</b>
        <span class="small">Danas radimo do ${pad(CLOSE_HOUR)}:00 • Vreme u Nišu ${currentTime}</span>`;

      return;
    }

    statusElement.classList.remove("open");
    statusElement.classList.add("closed");

    let note = "";

    if (isMonday) {
      note = `Ponedeljkom ne radimo.`;
    } else if (hour < OPEN_HOUR) {
      note = `Otvaramo u ${pad(OPEN_HOUR)}:00.`;
    } else {
      note = `Radno vreme je završeno za danas.`;
    }

    statusElement.innerHTML = `🔴 Trenutno smo <b>zatvoreni</b>
      <span class="small">${note} • Vreme u Nišu ${currentTime}</span>`;
  }

  updateStatus();
  setInterval(updateStatus, 60000);
}