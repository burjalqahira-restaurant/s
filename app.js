
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  const header = document.querySelector(".site-header");
  const progress = document.getElementById("scroll-progress");

  const openBtn = document.getElementById("open-menu");
  const closeBtn = document.getElementById("close-menu");
  const drawer = document.getElementById("site-drawer");
  const overlay = document.getElementById("drawer-overlay");

  let previousFocus = null;

  // تحديث شريط تقدم التمرير والهيدر
  const updateScroll = () => {
    const scrollTop = window.scrollY;
    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (progress) {
      const percentage =
        maxScroll > 0
          ? (scrollTop / maxScroll) * 100
          : 0;

      progress.style.width = `${percentage}%`;
    }

    if (header) {
      header.classList.toggle("scrolled", scrollTop > 15);
    }
  };

  window.addEventListener("scroll", updateScroll, {
    passive: true
  });

  window.addEventListener("resize", updateScroll);
  updateScroll();

  // القائمة الجانبية
  const openMenu = () => {
    if (!drawer || !overlay) return;

    previousFocus = document.activeElement;

    drawer.classList.add("active");
    overlay.classList.add("active");
    body.classList.add("menu-open");

    drawer.setAttribute("aria-hidden", "false");
    openBtn?.setAttribute("aria-expanded", "true");

    closeBtn?.focus();
  };

  const closeMenu = () => {
    if (!drawer || !overlay) return;

    drawer.classList.remove("active");
    overlay.classList.remove("active");
    body.classList.remove("menu-open");

    drawer.setAttribute("aria-hidden", "true");
    openBtn?.setAttribute("aria-expanded", "false");

    if (previousFocus instanceof HTMLElement) {
      previousFocus.focus();
    }
  };

  openBtn?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);
  overlay?.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      drawer?.classList.contains("active")
    ) {
      closeMenu();
    }

    if (
      event.key === "Tab" &&
      drawer?.classList.contains("active")
    ) {
      const focusable = Array.from(
        drawer.querySelectorAll(
          'a[href], button:not([disabled]), ' +
          'input:not([disabled]), select:not([disabled]), ' +
          'textarea:not([disabled]), [tabindex="0"]'
        )
      ).filter((element) => element.getClientRects().length);

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  drawer?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // حركات ظهور الأقسام
  const revealElements = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

    body.classList.add("reveal-ready");
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // تفعيل رابط القسم الحالي في فهرس الخصوصية
  const tocLinks = document.querySelectorAll(".toc-links a");

  const sections = Array.from(tocLinks)
    .map((link) => {
      const id = link.getAttribute("href");
      return id?.startsWith("#")
        ? document.getElementById(id.substring(1))
        : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const tocObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top -
              b.boundingClientRect.top
          );

        if (!visible.length) return;

        const activeId = visible[0].target.id;

        tocLinks.forEach((link) => {
          const isActive =
            link.getAttribute("href") === `#${activeId}`;

          link.classList.toggle("active", isActive);

          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-110px 0px -55% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      tocObserver.observe(section);
    });
  }

  // التنقل السلس بين أقسام الخصوصية
  tocLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;

      const target = document.getElementById(href.substring(1));
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      history.replaceState(null, "", href);
    });
  });
});
