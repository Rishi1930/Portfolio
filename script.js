/* =========================================
   RISHI PORTFOLIO — INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const heroVisual = document.getElementById("hero-visual");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =========================================
     MOBILE NAVIGATION
  ========================================= */

  function closeMenu() {
    if (!menuToggle || !nav) return;

    nav.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");

    const icon = menuToggle.querySelector("i");

    if (icon) {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
    }
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("show");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      const icon = menuToggle.querySelector("i");

      if (icon) {
        icon.classList.toggle("fa-bars", !isOpen);
        icon.classList.toggle("fa-xmark", isOpen);
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("show") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 700) {
        closeMenu();
      }
    });
  }


  /* =========================================
     ACTIVE NAVIGATION LINK
  ========================================= */

  const sections = document.querySelectorAll(
    "main section[id]"
  );

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = entry.target.id;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${currentId}`;

            link.classList.toggle("active", isActive);
          });
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }


  /* =========================================
     REVEAL ANIMATIONS
  ========================================= */

  const revealElements = document.querySelectorAll(".reveal");

  /*
    Keep all content visible by default.
    Only hide elements after confirming that
    the animation engine is available.
  */

  if (reduceMotion) {
    return;
  }

  if (window.gsap) {
    body.classList.add("js-animations");

    if (window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    /* Hero entrance */

    const heroItems = document.querySelectorAll(
      ".hero-content .reveal"
    );

    gsap.fromTo(
      heroItems,
      {
        opacity: 0,
        y: 24
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform"
      }
    );

    /* Hero portrait entrance */

    if (heroVisual) {
      gsap.fromTo(
        heroVisual,
        {
          opacity: 0,
          scale: 0.92,
          x: 20
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1.1,
          delay: 0.25,
          ease: "power3.out",
          clearProps: "transform"
        }
      );
    }

    /* Reveal the remaining sections on scroll */

    if (window.ScrollTrigger) {
      revealElements.forEach((element) => {
        if (element.closest(".hero")) return;

        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true
          }
        });
      });
    } else {
      gsap.to(revealElements, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        clearProps: "transform"
      });
    }

  } else if ("IntersectionObserver" in window) {

    /*
      Fallback when GSAP is unavailable:
      CSS and IntersectionObserver handle reveals.
    */

    body.classList.add("js-animations");

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

  } else {
    /* Old-browser fallback: show everything. */
    revealElements.forEach((element) => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  }


  /* =========================================
     INTERACTIVE PORTRAIT
  ========================================= */

  if (
    heroVisual &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    const portraitFrame = heroVisual.querySelector(".portrait-frame");
    const floatingChips = heroVisual.querySelectorAll(".floating-chip");

    heroVisual.addEventListener("pointermove", (event) => {
      const rect = heroVisual.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 12;
      const rotateX = (0.5 - y) * 10;

      if (portraitFrame) {
        portraitFrame.style.animation = "none";

        portraitFrame.style.transform =
          `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }

      floatingChips.forEach((chip, index) => {
        const direction = index % 2 === 0 ? 1 : -1;

        chip.style.transform =
          `translate(${(x - 0.5) * 12 * direction}px, ${(y - 0.5) * 12}px)`;
      });
    });

    heroVisual.addEventListener("pointerleave", () => {
      if (portraitFrame) {
        portraitFrame.style.animation = "";
        portraitFrame.style.transform = "";
      }

      floatingChips.forEach((chip) => {
        chip.style.transform = "";
      });
    });
  }


  /* =========================================
     PROJECT CARD HOVER POLISH
  ========================================= */

  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("pointerenter", () => {
      card.style.transform = "translateY(-5px)";
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

});
