const revealItems = document.querySelectorAll("[data-reveal]");
const yearNode = document.querySelector("#year");
const sectionLinks = document.querySelectorAll('.site-nav a[href^="#"]');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -5% 0px",
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
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
