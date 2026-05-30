/* ==========================================================
   PORTFOLIO ENGINE v3
========================================================== */

/* ==========================================================
   THEME DRAWER CONTROLLER
========================================================== */
const openDrawerBtn = document.getElementById("open-drawer");
const closeDrawerBtn = document.getElementById("close-drawer");
const drawerOverlay = document.getElementById("drawer-overlay");
const themeDrawer = document.getElementById("theme-drawer");

if (openDrawerBtn && themeDrawer && drawerOverlay) {
  openDrawerBtn.addEventListener("click", () => {
    themeDrawer.classList.add("open");
    drawerOverlay.classList.add("open");
  });
}

if (closeDrawerBtn && drawerOverlay && themeDrawer) {
  const closeDrawer = () => {
    themeDrawer.classList.remove("open");
    drawerOverlay.classList.remove("open");
  };
  closeDrawerBtn.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", closeDrawer);
}

/* ==========================================================
   THEME PERSISTENCE ENGINE
========================================================== */
const themeButtons = document.querySelectorAll(".theme-btn");
const DEFAULT_THEME = "dark"; // Fallback theme if nothing is saved yet

// Helper function to update the active UI button state
const setActiveButton = (theme) => {
  themeButtons.forEach(btn => {
    if (btn.dataset.themeId === theme) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
};

// Helper function to apply the theme to the DOM and Storage
const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);
  setActiveButton(theme);
};

// 1. Attach Event Listeners to Buttons
themeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Correctly fetches from data-theme-id
    const theme = btn.dataset.themeId; 
    applyTheme(theme);
  });
});

// 2. Initialize Theme on Page Load
const savedTheme = localStorage.getItem("portfolio-theme") || DEFAULT_THEME;
applyTheme(savedTheme);

/* ==========================================================
   SCROLL REVEAL INTERSECTION OBSERVER
========================================================== */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach(el => revealObserver.observe(el));

/* ==========================================================
   ACTIVE NAVIGATION DETECTOR
========================================================== */
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-node");

window.addEventListener("scroll", () => {
  let current = "";
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 180;
    if (scrollPosition >= sectionTop) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

/* ==========================================================
   NAV INDICATOR UTILITY
========================================================== */
const indicator = document.querySelector(".nav-indicator");

function moveIndicator() {
  if (window.innerWidth <= 768 || !indicator) return;

  const active = document.querySelector(".nav-node.active");
  if (!active) return;

  indicator.style.width = active.offsetWidth + "px";
  indicator.style.left = active.offsetLeft + "px";
}

window.addEventListener("load", moveIndicator);
window.addEventListener("resize", moveIndicator);

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    setTimeout(moveIndicator, 100);
  });
});

/* ==========================================================
   COUNTER ANIMATION SYSTEM
========================================================== */
const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const counter = entry.target;
    const target = +counter.dataset.target;
    let current = 0;
    const increment = target / 80;

    const update = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    };

    update();
    counterObserver.unobserve(counter);
  });
}, {
  threshold: 0.5
});

counters.forEach(counter => counterObserver.observe(counter));

/* ==========================================================
   CURSOR GLOW HOOK
========================================================== */
const glow = document.querySelector(".cursor-glow");

if (glow) {
  document.addEventListener("mousemove", e => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });
}

/* ==========================================================
   PARALLAX HERO ANIMATION ENGINE
========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-section");
  if (!hero) return;

  let scrollY = 0;
  let isVisible = true;

  // 1. Only calculate calculations when the Hero is actually on screen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0 });

  observer.observe(hero);

  // 2. Ticking loop using requestAnimationFrame for 60fps/120fps fluid rendering
  function updateParallax() {
    if (isVisible) {
      scrollY = window.scrollY;
      // Using opacity scaling alongside transform hides visual pops against upper elements
      hero.style.transform = `translate3d(0, ${scrollY * 0.05}px, 0)`;
    }
    requestAnimationFrame(updateParallax);
  }

  // Start the animation engine frame loop
  requestAnimationFrame(updateParallax);
});

/* ==========================================================
   TYPING EFFECT UTILITY SYSTEM
========================================================== */
const typingElement = document.querySelector(".typing-text");

if (typingElement) {
  const texts = [
    " Software Engineer",
    "Web Developer",
    "Java Programmer",
    "Problem Solver",
    "an AI Enthusiast"
  ];

  let textIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const currentText = texts[textIndex];

    if (!deleting) {
      typingElement.textContent = currentText.substring(0, charIndex);
      charIndex++;

      if (charIndex > currentText.length) {
        deleting = true;
        setTimeout(type, 1500);
        return;
      }
    } else {
      typingElement.textContent = currentText.substring(0, charIndex);
      charIndex--;

      if (charIndex < 0) {
        deleting = false;
        charIndex = 0;
        textIndex = (textIndex + 1) % texts.length;
      }
    }

    setTimeout(type, deleting ? 50 : 100);
  }

  type();
}

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Toggle mobile menu visibility
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Automatically close menu when a custom link section is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMenu.classList.remove('remove');
      
      // Update active link state
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});



/* ==========================================================
   MAGNETIC BUTTON ATTRACTOR
========================================================== */
const magneticButtons = document.querySelectorAll(".btn");

magneticButtons.forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0, 0)";
  });
});

/* ==========================================================
   SMOOTH NAV SCROLL COMPONENT
========================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

/* ==========================================================
   BOOT APPLICATION EXECUTION
========================================================== */
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

console.log(
  "%cPortfolio Engine Loaded 🚀",
  "color:#3b82f6;font-size:14px"
);