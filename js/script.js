// Smooth scroll helper
function smoothScrollTo(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const behavior = prefersReducedMotion ? "auto" : "smooth";

  window.scrollTo({
    top: target.offsetTop - 72, // compensate for mobile header
    behavior,
  });
}

// Setup nav links + buttons scrolling
function initScrolling() {
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollButtons = document.querySelectorAll("[data-scroll-target]");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      smoothScrollTo(href);
      closeMobileNav();
    });
  });

  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-scroll-target");
      if (target) {
        smoothScrollTo(target);
      }
    });
  });
}

// Sidebar mobile toggle
function initSidebarToggle() {
  const toggle = document.querySelector(".sidebar-toggle");
  const nav = document.querySelector(".nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.classList.toggle("is-open");
    nav.classList.toggle("is-open", isOpen);
  });
}

function closeMobileNav() {
  const toggle = document.querySelector(".sidebar-toggle");
  const nav = document.querySelector(".nav");

  if (!toggle || !nav) return;

  toggle.classList.remove("is-open");
  nav.classList.remove("is-open");
}

// Intersection observer for reveal animations
function initRevealOnScroll() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || revealEls.length === 0) {
    // Fallback: make everything visible
    revealEls.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

// Active nav state based on scroll
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length === 0 || navLinks.length === 0) return;

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    let currentId = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const offsetTop = rect.top + window.pageYOffset;
      if (scrollY >= offsetTop - 120) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (href === `#${currentId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  updateActiveNav();
  window.addEventListener("scroll", updateActiveNav);
}

// Contact form: open mailto with data
function initContactForm() {
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  if (!form || !formMessage) return;

  function showMessage(type, text) {
    formMessage.className = `form-message ${type} show`;
    formMessage.innerHTML = `
      <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
      <span>${text}</span>
    `;

    // Hide message after 5 seconds
    setTimeout(() => {
      formMessage.classList.remove("show");
      setTimeout(() => {
        formMessage.className = "form-message";
        formMessage.innerHTML = "";
      }, 300);
    }, 5000);
  }

  function validateForm() {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      showMessage("error", "Please fill in all fields.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage("error", "Please enter a valid email address.");
      return false;
    }

    return true;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    const mailTo = "kylequitco3212@gmail.com";

    const fullSubject = subject || "Portfolio Contact";
    const bodyLines = [
      message,
      "",
      "-------------",
      `From: ${name || "Anonymous"}`,
      email ? `Email: ${email}` : "",
    ].filter(Boolean);

    const mailtoUrl = `mailto:${encodeURIComponent(
      mailTo
    )}?subject=${encodeURIComponent(
      fullSubject
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    // Show success message
    showMessage("success", "Opening your email client...");

    // Small delay to show message before opening email client
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 500);
  });
}

// Footer year
function initYear() {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear().toString();
}

// Simple project image carousels
function initProjectCarousels() {
  const carousels = document.querySelectorAll("[data-carousel]");
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const slides = Array.from(
      carousel.querySelectorAll(".project-slide")
    );
    if (slides.length <= 1) return;

    let current = 0;
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === current);
    });

    const rootCard = carousel.closest(".project-card");
    if (!rootCard) return;

    const prevBtn = rootCard.querySelector("[data-carousel-prev]");
    const nextBtn = rootCard.querySelector("[data-carousel-next]");

    function goTo(index) {
      slides[current].classList.remove("is-active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("is-active");
    }

    prevBtn?.addEventListener("click", () => goTo(current - 1));
    nextBtn?.addEventListener("click", () => goTo(current + 1));
  });
}

// Typing animation effect
function initTypingEffect() {
  const typingEl = document.getElementById("typing-text");
  if (!typingEl) return;

  const texts = ["Full-Stack Web Developer", "Backend Developer", "Frontend Developer"];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typingEl.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingEl.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
      typingSpeed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 500; // pause before next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// Scroll progress indicator
function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");
  if (!progressBar) return;

  function updateProgress() {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / windowHeight) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }

  window.addEventListener("scroll", updateProgress);
  updateProgress();
}

// Animate skill bars on scroll
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");
  if (!skillBars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const percent = entry.target.getAttribute("data-percent");
          entry.target.style.width = `${percent}%`;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach((bar) => observer.observe(bar));
}

// Animated statistics counters
function initAnimatedStats() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
          const target = parseInt(entry.target.getAttribute("data-target")) || 0;
          const duration = 2000; // 2 seconds
          const increment = target / (duration / 16); // 60fps
          let current = 0;

          entry.target.classList.add("counted");

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            entry.target.textContent = Math.floor(current) + (target >= 10 ? "+" : "");
          }, 16);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => observer.observe(stat));
}

// Resume download handler
function initResumeDownload() {
  const resumeBtn = document.getElementById("resume-btn");
  if (!resumeBtn) return;

  resumeBtn.addEventListener("click", (e) => {
    // If resume.pdf doesn't exist, show a message
    // You can replace this with actual resume file path
    const resumePath = resumeBtn.getAttribute("href");
    
    // Optional: Add analytics or tracking here
    console.log("Resume download initiated");
  });
}

// Back to Top button
function initBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;

  function toggleBackToTop() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  }

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", toggleBackToTop);
  toggleBackToTop();
}

// Add ripple effect to all buttons
function initRippleEffects() {
  const buttons = document.querySelectorAll(".btn.ripple");
  
  buttons.forEach((button) => {
    button.addEventListener("click", function(e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple-effect");
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  initScrolling();
  initSidebarToggle();
  initRevealOnScroll();
  initActiveNavOnScroll();
  initContactForm();
  initYear();
  initProjectCarousels();
  initTypingEffect();
  initScrollProgress();
  initSkillBars();
  initAnimatedStats();
  initResumeDownload();
  initBackToTop();
  initRippleEffects();
});


