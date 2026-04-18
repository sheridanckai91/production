(() => {
  const root = document.documentElement;

  // --- Theme: persisted + respects system pref on first load ---
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initial);

  const toggles = document.querySelectorAll(".theme-toggle");
  const setIcon = (theme) => {
    toggles.forEach((t) => {
      t.textContent = theme === "dark" ? "☀" : "☾";
      t.setAttribute("aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
  };
  setIcon(initial);

  toggles.forEach((t) => {
    t.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      setIcon(next);
    });
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

  // --- Mobile drawer ---
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.querySelector(".menu-toggle");
  const closeBtn = document.querySelector(".sidebar-close");
  const backdrop = document.querySelector(".sidebar-backdrop");

  const openDrawer = () => {
    if (!sidebar) return;
    sidebar.classList.add("open");
    backdrop?.classList.add("show");
    document.body.classList.add("drawer-open");
    menuBtn?.setAttribute("aria-expanded", "true");
  };
  const closeDrawer = () => {
    if (!sidebar) return;
    sidebar.classList.remove("open");
    backdrop?.classList.remove("show");
    document.body.classList.remove("drawer-open");
    menuBtn?.setAttribute("aria-expanded", "false");
  };

  menuBtn?.addEventListener("click", () => {
    sidebar?.classList.contains("open") ? closeDrawer() : openDrawer();
  });
  closeBtn?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar?.classList.contains("open")) closeDrawer();
  });
  // Close drawer when a sidebar link is tapped
  sidebar?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", closeDrawer)
  );
  // If user resizes back to desktop, reset state
  window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => {
    if (e.matches) closeDrawer();
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
