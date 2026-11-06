// Loads HTML partials into the page.

export async function loadPartial(id, file) {
  const target = document.getElementById(id);

  if (!target) return;

  try {
    const response = await fetch(file);

    if (!response.ok) {
      target.innerHTML = `<!-- Ne mogu da učitam ${file} -->`;
      return;
    }

    target.innerHTML = await response.text();
  } catch {
    target.innerHTML = `<!-- Greška pri učitavanju ${file} -->`;
  }
}