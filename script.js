const yearNode = document.querySelector("#year");
const sectionLinks = document.querySelectorAll('.site-nav a[href^="#"]');

function isReloadNavigation() {
  const [navigationEntry] = performance.getEntriesByType("navigation");

  if (navigationEntry) {
    return navigationEntry.type === "reload";
  }

  if ("navigation" in performance) {
    return performance.navigation.type === performance.navigation.TYPE_RELOAD;
  }

  return false;
}

function resetScrollOnReload() {
  if (!isReloadNavigation()) {
    return;
  }

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  if (window.location.hash) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  scrollToTop();
  requestAnimationFrame(scrollToTop);
}

resetScrollOnReload();

window.addEventListener(
  "load",
  () => {
    if (isReloadNavigation()) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  },
  { once: true }
);

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if ("IntersectionObserver" in window && sectionLinks.length > 0) {
  const sectionMap = new Map();

  sectionLinks.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));

    if (section) {
      sectionMap.set(section, link);
    }
  });

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        sectionLinks.forEach((link) => link.removeAttribute("aria-current"));
        sectionMap.get(entry.target)?.setAttribute("aria-current", "location");
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-10% 0px -45% 0px",
    }
  );

  sectionMap.forEach((_, section) => navObserver.observe(section));
}
