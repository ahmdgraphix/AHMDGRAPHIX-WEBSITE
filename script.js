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

  // --- MOBILE NAV TOGGLE MECHANICS ---
  const mobileNavToggle = document.getElementById("mobile-nav-toggle");
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener("click", () => {
      document.body.classList.toggle("mobile-nav-open");
    });
  }

  // Close mobile nav when clicking a nav link, logo, or hire button
  const navLinksList = document.querySelectorAll(".nav-link");
  navLinksList.forEach(link => {
    link.addEventListener("click", () => {
      document.body.classList.remove("mobile-nav-open");
    });
  });

  if (navLogo) {
    navLogo.addEventListener("click", () => {
      document.body.classList.remove("mobile-nav-open");
    });
  }
  if (btnHeaderHire) {
    btnHeaderHire.addEventListener("click", () => {
      document.body.classList.remove("mobile-nav-open");
    });
  }

  // Init Custom Cursor
  initCustomCursor();

  // Init Services Carousel
  initServicesCarousel();

  // Init Tags
  renderFloatingTags("portfolio");
});

/* ==========================================================================
   CUSTOM APPLE-STYLE ARROW CURSOR MECHANICS
   ========================================================================== */
function initCustomCursor() {
  // Only enable custom cursor on fine-pointer devices (desktops/laptops with mouse/trackpad)
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (!isFinePointer) return;

  // Create arrow container element dynamically
  const cursorContainer = document.createElement("div");
  cursorContainer.className = "custom-arrow-cursor hidden";
  cursorContainer.setAttribute("id", "custom-cursor");

  // Inject macOS-inspired SVG arrow with radial gradients for standard/link glows
  cursorContainer.innerHTML = `
    <svg class="custom-arrow-cursor-svg" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Standard state glow (Purple/Orange Gradient) -->
        <radialGradient id="cursor-glow-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.55" />
          <stop offset="60%" stop-color="#f97316" stop-opacity="0.22" />
          <stop offset="100%" stop-color="#f97316" stop-opacity="0" />
        </radialGradient>
        <!-- Link hover state glow (Blue/Green Gradient) -->
        <radialGradient id="cursor-glow-link" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.55" />
          <stop offset="60%" stop-color="#10b981" stop-opacity="0.22" />
          <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
        </radialGradient>
      </defs>
      
      <!-- Soft backdrop glow (centered under the arrow body for natural lighting balance) -->
      <circle class="cursor-glow-circle" cx="6" cy="6" r="14" fill="url(#cursor-glow-gradient)" />
      
      <!-- Crisp macOS Arrow Shape (Crisp white fill, sharp dark borders, hotspot active at 0,0) -->
      <path d="M0,0 L0,17 L4.5,12.5 L8.5,21.5 L11,20.5 L7.5,11.5 L12.5,11.5 Z" 
            fill="#FFFFFF" 
            stroke="#111111" 
            stroke-width="1.5" 
            stroke-linejoin="miter" 
            stroke-miterlimit="4" />
    </svg>
  `;

  document.body.appendChild(cursorContainer);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let isMouseInWindow = false;
  let rafId = null;
  let activeHoverTarget = null;

  // LERP factor (higher is faster/snappier, 1 is instant).
  // 0.35 provides high responsiveness while retaining the premium organic glide.
  const EASE = 0.35;

  function updateCursor() {
    if (!isMouseInWindow) {
      rafId = null;
      return;
    }

    // Apply interpolation
    cursorX += (mouseX - cursorX) * EASE;
    cursorY += (mouseY - cursorY) * EASE;

    // Use Math.round to avoid subpixel rendering issues and visual blurriness
    cursorContainer.style.transform = `translate3d(${Math.round(cursorX)}px, ${Math.round(cursorY)}px, 0)`;

    // Check if visual coordinates have converged to save cycles
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
      rafId = requestAnimationFrame(updateCursor);
    } else {
      cursorX = mouseX;
      cursorY = mouseY;
      cursorContainer.style.transform = `translate3d(${Math.round(cursorX)}px, ${Math.round(cursorY)}px, 0)`;
      rafId = null;
    }
  }

  // Track Mouse Movements
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isMouseInWindow) {
      isMouseInWindow = true;
      cursorContainer.classList.remove("hidden");
      // Snap instantly on first entry to prevent lagging from top-left (0,0)
      cursorX = mouseX;
      cursorY = mouseY;
    }

    // Start rendering loop if not already running
    if (!rafId) {
      rafId = requestAnimationFrame(updateCursor);
    }
  });

  // Track window focus/exit
  document.addEventListener("mouseleave", () => {
    isMouseInWindow = false;
    cursorContainer.classList.add("hidden");
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  document.addEventListener("mouseenter", (e) => {
    isMouseInWindow = true;
    cursorContainer.classList.remove("hidden");
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorX = mouseX;
    cursorY = mouseY;
    cursorContainer.style.transform = `translate3d(${Math.round(cursorX)}px, ${Math.round(cursorY)}px, 0)`;
  });

  // CLICK animations (Mousedown/Mouseup triggers small scale-down)
  window.addEventListener("mousedown", () => {
    cursorContainer.classList.add("active");
  });
  window.addEventListener("mouseup", () => {
    cursorContainer.classList.remove("active");
  });

  // HOVER States - Interactive delegation
  function updateHoverState(element) {
    if (!element) return;
    
    // If hovering over input fields, textareas or selects, hide the custom cursor and show native caret
    const isInputField = element.closest('input, textarea, select, [contenteditable="true"]');
    if (isInputField) {
      cursorContainer.classList.add("hidden-input");
      return;
    } else {
      cursorContainer.classList.remove("hidden-input");
    }

    const target = element.closest('a, button, .btn, .nav-link, [role="button"], .floating-tag, .who-tag, .pricing-card, .services-card, .process-step, .carousel-control-btn');
    
    if (target !== activeHoverTarget) {
      activeHoverTarget = target;
      if (target) {
        const isButton = target.tagName === "BUTTON" || target.classList.contains("btn") || target.classList.contains("btn-theme-toggle") || target.classList.contains("btn-hamburger") || target.getAttribute("role") === "button" || target.classList.contains("carousel-control-btn");
        
        if (isButton) {
          cursorContainer.classList.add("hover-button");
          cursorContainer.classList.remove("hover-link");
        } else {
          cursorContainer.classList.add("hover-link");
          cursorContainer.classList.remove("hover-button");
        }
      } else {
        cursorContainer.classList.remove("hover-button", "hover-link");
      }
    }
  }

  document.addEventListener("mouseover", (e) => {
    updateHoverState(e.target);
  });

  // Update hover state on scroll so cursor changes type when content scrolls beneath it
  window.addEventListener("scroll", () => {
    if (isMouseInWindow) {
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      if (elementUnderMouse) {
        updateHoverState(elementUnderMouse);
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   SERVICES CAROUSEL MANUAL NAVIGATION & JS AUTO-SCROLL
   ========================================================================== */
function initServicesCarousel() {
  const track = document.querySelector(".services-carousel-track");
  const prevBtn = document.querySelector(".carousel-control-btn.prev-btn");
  const nextBtn = document.querySelector(".carousel-control-btn.next-btn");

  if (!track || !prevBtn || !nextBtn) return;

  const CARD_WIDTH = 320;
  const GAP = 24;
  const STEP_SIZE = CARD_WIDTH + GAP; // 344px
  const TOTAL_SET_WIDTH = 12 * STEP_SIZE; // 4128px
  
  let isManual = false;
  let isHovered = false;
  let index = 0;
  let currentX = 0;
  let isTransitioning = false;
  let resumeTimeout = null;
  let rafId = null;

  // Auto-scroll speed configuration (pixels per frame, e.g. 0.8px/frame)
  const AUTO_SCROLL_SPEED = 0.8;

  function autoScrollLoop() {
    if (!isManual && !isHovered) {
      currentX -= AUTO_SCROLL_SPEED;
      
      // Seamless wrap: if we scroll past the first set, wrap back
      if (currentX <= -TOTAL_SET_WIDTH) {
        currentX += TOTAL_SET_WIDTH;
      }
      track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    }
    rafId = requestAnimationFrame(autoScrollLoop);
  }

  // Start auto scroll
  rafId = requestAnimationFrame(autoScrollLoop);

  // Mouse hover detection to pause/resume auto-scroll
  track.addEventListener("mouseenter", () => {
    isHovered = true;
  });
  track.addEventListener("mouseleave", () => {
    isHovered = false;
  });

  function switchToManual() {
    if (isManual) return;
    isManual = true;

    // Remove transition class to read exact current computed transform
    track.classList.remove("transition-active");
    
    const style = window.getComputedStyle(track);
    const transform = style.transform || style.webkitTransform;
    let computedX = 0;

    if (transform && transform !== "none") {
      try {
        const matrix = new DOMMatrix(transform);
        computedX = matrix.m41;
      } catch (err) {
        const parts = transform.split("(")[1].split(")")[0].split(",");
        computedX = parseFloat(parts[4] || 0);
      }
    }

    // Determine nearest card index
    index = Math.round(computedX / -STEP_SIZE);

    // If index is outside the double set's middle range, snap to the middle duplicate to support left navigation
    if (index < 12) {
      index += 12;
      computedX = -index * STEP_SIZE;
      track.style.transform = `translate3d(${computedX}px, 0, 0)`;
      track.offsetHeight; // Force reflow
    }

    currentX = -index * STEP_SIZE;
    track.classList.add("transition-active");
    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
  }

  function navigate(direction) {
    switchToManual();

    if (isTransitioning) return;
    isTransitioning = true;

    if (direction === "next") {
      index++;
    } else {
      index--;
    }

    currentX = -index * STEP_SIZE;
    track.style.transform = `translate3d(${currentX}px, 0, 0)`;

    // Clear existing resume timeout
    if (resumeTimeout) {
      clearTimeout(resumeTimeout);
    }
  }

  prevBtn.addEventListener("click", () => navigate("prev"));
  nextBtn.addEventListener("click", () => navigate("next"));

  // Handle seamless wrapping on transitionend
  track.addEventListener("transitionend", (e) => {
    // Only handle transitions on the track itself
    if (e.target !== track) return;
    
    isTransitioning = false;
    if (!isManual) return;

    // Wrap index if outside the safe zone [6, 17]
    if (index < 6) {
      index += 12;
      currentX = -index * STEP_SIZE;
      
      track.classList.remove("transition-active");
      track.style.transform = `translate3d(${currentX}px, 0, 0)`;
      track.offsetHeight; // Force reflow
      track.classList.add("transition-active");
    } else if (index >= 18) {
      index -= 12;
      currentX = -index * STEP_SIZE;
      
      track.classList.remove("transition-active");
      track.style.transform = `translate3d(${currentX}px, 0, 0)`;
      track.offsetHeight; // Force reflow
      track.classList.add("transition-active");
    }

    // Schedule resuming of auto scroll after 5 seconds of inactivity
    if (resumeTimeout) {
      clearTimeout(resumeTimeout);
    }
    resumeTimeout = setTimeout(() => {
      isManual = false;
      track.classList.remove("transition-active");
    }, 5000);
  });
}

