(() => {
  const root = document.documentElement;

  // --- Theme: persisted + respects system pref on first load ---
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  const toggle = document.querySelector(".theme-toggle");
  const setIcon = (theme) => {
    if (!toggle) return;
    toggle.textContent = theme === "dark" ? "☀" : "☾";
    toggle.setAttribute("aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  };
  setIcon(initial);

  toggle?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setIcon(next);
  });

  // --- Image load: drop skeleton when each image is ready ---
  document.querySelectorAll(".card").forEach((card) => {
    const img = card.querySelector("img");
    if (!img) return;
    const done = () => card.classList.add("loaded");
    if (img.complete && img.naturalWidth > 0) done();
    else {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  });

  // --- Reveal on scroll ---
  const cards = document.querySelectorAll(".card");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    cards.forEach((c) => io.observe(c));
  } else {
    cards.forEach((c) => c.classList.add("revealed"));
  }
})();
