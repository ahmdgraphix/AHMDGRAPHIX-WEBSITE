/* ==========================================================================
   AHMDGRAPHIX INTERACTIVE CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // --- STATE VARIABLES ---
  let activePage = "portfolio"; // "portfolio" or "pricing"

  // --- THEME TOGGLE MECHANICS ---
  const themeToggleBtn = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // --- FLOATING TAG CONFS ---
  const portfolioTags = [
    "Front End Development",
    "SaaS Solutions",
    "Brand Identity",
    "Video Production",
    "Ethical Design",
    "Halal Content",
    "UI/UX"
  ];

  const pricingTags = [
    "Graphic Designing",
    "Social Media Management",
    "Logo Designing",
    "Poster Designing",
    "Web Designing",
    "Video Editing",
    "Brand identity",
    "SaaS"
  ];

  // --- SELECT DOM ELEMENTS ---
  const navLinks = document.querySelectorAll(".nav-link");
  const navLogo = document.getElementById("nav-logo");
  const btnHeaderHire = document.getElementById("btn-header-hire");
  const btnSwitchPricing = document.querySelector(".btn-switch-pricing");
  const portfolioView = document.getElementById("portfolio-page");
  const pricingView = document.getElementById("pricing-page");
  const floatingTagsContainer = document.getElementById("floating-tags-container");

  // --- PAGE VIEW SWITCHING ROUTING ---
  function switchPage(targetPage, scrollTargetId = null) {
    if (targetPage === activePage && !scrollTargetId) return;

    activePage = targetPage;

    // Remove active class on all views
    portfolioView.classList.remove("active-view");
    pricingView.classList.remove("active-view");

    // Clear active headers
    navLinks.forEach(link => link.classList.remove("active"));

    // Activate selected view
    if (targetPage === "portfolio") {
      portfolioView.classList.add("active-view");
      document.getElementById("nav-home").classList.add("active");
    } else if (targetPage === "pricing") {
      pricingView.classList.add("active-view");
      document.getElementById("nav-pricing").classList.add("active");
    }

    // Refresh tags
    renderFloatingTags(targetPage);

    // Scroll handling
    if (scrollTargetId) {
      setTimeout(() => {
        const targetElement = document.getElementById(scrollTargetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          
          // Set appropriate navigation link active
          const link = document.querySelector(`.nav-link[href="#${scrollTargetId}"]`);
          if (link) {
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
          }
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // --- RENDER FLOATING TAGS ---
  function renderFloatingTags(page) {
    floatingTagsContainer.innerHTML = "";
    const tags = page === "portfolio" ? portfolioTags : pricingTags;

    tags.forEach((tag, idx) => {
      const tagEl = document.createElement("div");
      tagEl.className = `floating-tag tag-color-${idx % 8}`;
      tagEl.textContent = tag;
      
      // Calculate asymmetrical rotation & initial offset
      const angle = (Math.sin(idx * 45) * 8).toFixed(1); // Values between -8 and 8 deg
      tagEl.style.setProperty("--rot", `${angle}deg`);
      
      // Draggable / responsive properties
      tagEl.addEventListener("mousedown", startDrag);
      tagEl.addEventListener("touchstart", startDrag, { passive: true });

      floatingTagsContainer.appendChild(tagEl);
    });
  }

  // --- FLOATING STICKERS INTERACTION (Drag/Physics) ---
  let activeDragElement = null;
  let offsetX = 0;
  let offsetY = 0;

  function startDrag(e) {
    activeDragElement = e.target;
    
    // Ignore trigger elements or empty spaces
    if (!activeDragElement.classList.contains("floating-tag")) return;

    activeDragElement.style.transition = "none";
    activeDragElement.style.zIndex = "1000";

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const rect = activeDragElement.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("touchmove", dragMove, { passive: false });
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchend", stopDrag);
  }

  function dragMove(e) {
    if (!activeDragElement) return;
    if (e.cancelable) e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Apply translations relative to parent viewport bounds
    const x = clientX - offsetX;
    const y = clientY - offsetY;
    
    activeDragElement.style.position = "fixed";
    activeDragElement.style.left = `${x}px`;
    activeDragElement.style.top = `${y}px`;
    activeDragElement.style.right = "auto";
  }

  function stopDrag() {
    if (activeDragElement) {
      activeDragElement.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      activeDragElement = null;
    }
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("touchmove", dragMove);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchend", stopDrag);
  }

  // --- HERO ANIMATED TYPING MECHANIC ---
  const typingWords = [
    "graphical Designer",
    "Developer",
    "video editor",
    "SaaS builder"
  ];
  let currentWordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeContainer = document.getElementById("typing-text");

  function typeEffect() {
    const fullWord = typingWords[currentWordIdx];
    
    if (isDeleting) {
      typeContainer.textContent = fullWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typeContainer.textContent = fullWord.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === fullWord.length) {
      // Pause at the end of word
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      currentWordIdx = (currentWordIdx + 1) % typingWords.length;
      delay = 500;
    }

    setTimeout(typeEffect, delay);
  }

  // Init Typing Animation
  if (typeContainer) {
    setTimeout(typeEffect, 1000);
  }

  // --- ATTACH EVENT LISTENERS ---

  // Unified Scroll / Page Router
  function handleLinkClick(targetId) {
    if (targetId === "home") {
      switchPage("portfolio");
    } else if (targetId === "pricing") {
      switchPage("pricing");
    } else if (targetId === "services") {
      switchPage("portfolio", "services-grid");
    } else if (targetId === "about") {
      switchPage("portfolio", "about");
    } else if (targetId === "contact") {
      if (activePage === "pricing") {
        switchPage("pricing", "contact");
      } else {
        switchPage("portfolio", "portfolio-cta");
      }
    } else {
      // Default scrolling on active page
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  // Nav Links click
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        handleLinkClick(href.substring(1));
      }
    });
  });

  // Global anchor click listener for relative hashes
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.classList.contains("nav-link")) return; // already handled

    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href === "#") return;
      
      e.preventDefault();
      handleLinkClick(href.substring(1));
    });
  });

  // Logo Link clicks home
  if (navLogo) {
    navLogo.addEventListener("click", (e) => {
      e.preventDefault();
      switchPage("portfolio");
    });
  }

  // Hire button
  if (btnHeaderHire) {
    btnHeaderHire.addEventListener("click", (e) => {
      e.preventDefault();
      if (activePage === "portfolio") {
        switchPage("portfolio", "portfolio-cta");
      } else {
        switchPage("pricing", "contact");
      }
    });
  }


  // Scroll spy effect to highlight navigation elements on scroll
  // Also controls header scroll responsive shrink effect
  const topHeader = document.querySelector(".top-header");
  
  function handleScrollEffects() {
    // 1. Header scroll shrink effect
    if (window.scrollY > 40) {
      topHeader.classList.add("header-scrolled");
    } else {
      topHeader.classList.remove("header-scrolled");
    }

    // 2. Scroll spy navigation highlighter
    if (activePage !== "portfolio") return;

    const sections = ["services-grid", "about", "portfolio-cta"];
    let currentActiveSection = "home";

    sections.forEach(secId => {
      const el = document.getElementById(secId);
      if (el) {
        const rect = el.getBoundingClientRect();
        // If element takes up majority space
        if (rect.top <= 180) {
          if (secId === "services-grid") currentActiveSection = "services";
          else if (secId === "about") currentActiveSection = "about";
          else if (secId === "portfolio-cta") currentActiveSection = "contact";
        }
      }
    });

    // Update active state in nav
    navLinks.forEach(link => {
      const targetId = link.getAttribute("href").substring(1);
      if (targetId === currentActiveSection && link.getAttribute("data-target") === "portfolio") {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", handleScrollEffects);
  handleScrollEffects(); // run once on load

  // --- SECURE FORM HANDLING MECHANICS ---
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  // XSS Sanitizer: Escape HTML characters to protect against XSS injection
  function sanitizeInput(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, (tag) => {
      const chars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      };
      return chars[tag] || tag;
    });
  }

  // Email Validation regex
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("form-name");
      const emailInput = document.getElementById("form-email");
      const messageInput = document.getElementById("form-message");

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const messageVal = messageInput.value.trim();

      let isFormValid = true;

      // Validate Name
      if (nameVal === "") {
        nameInput.parentElement.classList.add("invalid");
        isFormValid = false;
      } else {
        nameInput.parentElement.classList.remove("invalid");
      }

      // Validate Email
      if (emailVal === "" || !isValidEmail(emailVal)) {
        emailInput.parentElement.classList.add("invalid");
        isFormValid = false;
      } else {
        emailInput.parentElement.classList.remove("invalid");
      }

      // Validate Message
      if (messageVal === "") {
        messageInput.parentElement.classList.add("invalid");
        isFormValid = false;
      } else {
        messageInput.parentElement.classList.remove("invalid");
      }

      if (!isFormValid) {
        formStatus.textContent = "Please correct the highlighted errors.";
        formStatus.className = "form-status-alert error";
        return;
      }

      // Input Sanitization for XSS prevention
      const sanitizedName = sanitizeInput(nameVal);
      const sanitizedEmail = sanitizeInput(emailVal);
      const sanitizedMessage = sanitizeInput(messageVal);

      // Log or process sanitized values securely (mimic secure server response)
      console.log("Form submitted securely:", {
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage
      });

      // Show secure feedback safely using sanitized data
      formStatus.innerHTML = `Redirecting you to WhatsApp... Thank you, <strong>${sanitizedName}</strong>!`;
      formStatus.className = "form-status-alert success";

      // Construct pre-filled WhatsApp message
      const whatsappText = `Hi Irshad,\n\nI am contacting you from your website portfolio contact form.\n\n*Name:* ${nameVal}\n*Email:* ${emailVal}\n*Message:* ${messageVal}`;
      const whatsappUrl = `https://wa.me/916381950719?text=${encodeURIComponent(whatsappText)}`;

      // Open in a new tab
      window.open(whatsappUrl, "_blank", "noopener");

      // Reset form fields
      contactForm.reset();

      // Clear status after 6 seconds
      setTimeout(() => {
        formStatus.className = "form-status-alert";
        formStatus.innerHTML = "";
      }, 6000);
    });

    // Remove invalid style as soon as user types
    const formInputs = contactForm.querySelectorAll("input, textarea");
    formInputs.forEach(input => {
      input.addEventListener("input", () => {
        input.parentElement.classList.remove("invalid");
      });
    });
  }

  // Init Tags
  renderFloatingTags("portfolio");
});

