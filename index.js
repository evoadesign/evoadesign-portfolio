/**
 * evoadesign - Cinematic Dark Agency Portfolio Interactions
 * Year: 2026
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // 0. PREMIUM GLOWING PRELOADER SYSTEM
  // ==========================================================================
  const preloader = document.getElementById('preloader');
  const heroVideoIframe = document.getElementById('hero-vimeo-player');
  
  if (preloader) {
    // Lock scroll immediately on start
    document.body.style.overflow = 'hidden';

    // Safe fallback timeout to force-hide preloader after 7 seconds
    // This ensures that even on slow connections or if Vimeo fails, the site remains accessible.
    let fallbackTimeout = setTimeout(() => {
      console.log('Preloader: Safe timeout fallback triggered.');
      hidePreloader();
    }, 7000);

    const initVimeoPreloader = () => {
      if (typeof Vimeo !== 'undefined' && heroVideoIframe) {
        try {
          const player = new Vimeo.Player(heroVideoIframe);
          
          // Wait for the 'play' event which fires when the video has actually started playing!
          player.on('play', () => {
            console.log('Preloader: Vimeo video is fully loaded and playing.');
            clearTimeout(fallbackTimeout);
            // Give a tiny 400ms buffer for perfect visual completion
            setTimeout(hidePreloader, 400);
          });

          player.on('error', () => {
            console.warn('Preloader: Vimeo player reported an error. Falling back.');
            setupWindowLoadFallback();
          });
        } catch (e) {
          console.warn('Preloader: Vimeo Player initialization failed. Falling back.', e);
          setupWindowLoadFallback();
        }
      } else {
        setupWindowLoadFallback();
      }
    };

    const setupWindowLoadFallback = () => {
      window.addEventListener('load', () => {
        clearTimeout(fallbackTimeout);
        setTimeout(hidePreloader, 800);
      });
    };

    // Initialize Vimeo tracking if SDK is ready, otherwise fall back to window load
    if (typeof Vimeo !== 'undefined') {
      initVimeoPreloader();
    } else {
      setupWindowLoadFallback();
    }

    function hidePreloader() {
      if (preloader.classList.contains('loaded')) return;
      
      preloader.classList.add('loaded');
      // Unlock scroll
      document.body.style.overflow = '';
    }
  }

  // ==========================================================================
  // 1. SCROLL STATE FOR DYNAMIC CAPSULE HEADER
  // ==========================================================================
  const header = document.getElementById('main-header');
  
  const handleHeaderScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Trigger immediately to check initial load state

  // ==========================================================================
  // 2. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserverOptions = {
    root: null,
    threshold: 0.1, // Trigger when 10% is visible
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealObserverOptions);
  
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================================================
  // 3. ACTIVE NAV LINK ON SCROLL HIGHLIGHTING
  // ==========================================================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const highlightNavOptions = {
    root: null,
    threshold: 0.2, // Trigger earlier for long sections
    rootMargin: '-100px 0px -45% 0px' 
  };

  const highlightNavCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update desktop nav
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update mobile nav
        mobileNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const navObserver = new IntersectionObserver(highlightNavCallback, highlightNavOptions);
  
  sections.forEach(section => {
    if (section.id) {
      navObserver.observe(section);
    }
  });

  // ==========================================================================
  // 4. MOBILE HAMBURGER MENU DRAWER
  // ==========================================================================
  const menuToggle = document.getElementById('menu-toggle');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const allMobileLinks = document.querySelectorAll('.mobile-nav-link, .btn-cta-mobile');

  const toggleMobileMenu = () => {
    const isOpened = menuToggle.classList.toggle('active');
    mobileOverlay.classList.toggle('active', isOpened);
    
    // Prevent background scrolling when menu is open
    document.body.style.overflow = isOpened ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', toggleMobileMenu);

  // Close Mobile Menu on clicking links
  allMobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ==========================================================================
  // 5. CONTACT FORM VALIDATION & INTERACTIVE HANDLER (Glowing Underline Style)
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const successAlert = document.getElementById('success-alert');
  const btnSubmit = document.getElementById('btn-send-message');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateField = (input) => {
    const formGroup = input.parentElement; // .form-group
    let isValid = true;

    // Email validation
    if (input.type === 'email') {
      isValid = validateEmail(input.value.trim());
    } else if (input.id === 'phone') {
      // Simple phone format (minimum length just to avoid empty/rubbish values)
      isValid = input.value.trim().length >= 8;
    } else {
      // Simple required text verification
      isValid = input.value.trim() !== '';
    }

    if (isValid) {
      formGroup.classList.remove('invalid');
    } else {
      formGroup.classList.add('invalid');
    }

    return isValid;
  };

  // Instant Validation on blur and type
  const formInputs = contactForm.querySelectorAll('input, textarea');
  
  formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.parentElement.classList.contains('invalid')) {
        validateField(input);
      }
    });
  });

  // Form Submit Handler
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;

    formInputs.forEach(input => {
      const isFieldValid = validateField(input);
      if (!isFieldValid) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      btnSubmit.classList.add('loading');
      btnSubmit.disabled = true;

      // Mock API call latency (1.5s) for a premium feedback feel
      setTimeout(() => {
        btnSubmit.classList.remove('loading');
        
        // Hide form with fade out transition
        contactForm.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        contactForm.style.opacity = '0';
        contactForm.style.transform = 'translateY(10px)';
        
        // Fade in the success alert
        setTimeout(() => {
          contactForm.style.display = 'none';
          successAlert.classList.add('active');
        }, 400);

      }, 1500); 
    }
  });

  // ==========================================================================
  // 6. HERO PARALLAX MOUSE MOVEMENT EASE (Dynamic Automotive Focal Render)
  // ==========================================================================
  const heroSection = document.querySelector('.hero-agency-section');
  const parallaxContainer = document.querySelector('.hero-video-background');
  
  if (heroSection && parallaxContainer && window.innerWidth > 991) {
    heroSection.addEventListener('mousemove', (e) => {
      const { width, height } = heroSection.getBoundingClientRect();
      const mouseX = e.clientX - heroSection.offsetLeft;
      const mouseY = e.clientY - heroSection.offsetTop;
      
      const xPercent = (mouseX / width) - 0.5; // range: -0.5 to 0.5
      const yPercent = (mouseY / height) - 0.5;
      
      // Dynamic shift coordinate offset (gentler drift for slideshow container)
      const xOffset = xPercent * 16; 
      const yOffset = yPercent * 10;
      
      parallaxContainer.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      parallaxContainer.style.transition = 'transform 0.2s ease-out';
    });
 
    heroSection.addEventListener('mouseleave', () => {
      parallaxContainer.style.transform = 'translate(0px, 0px)';
      parallaxContainer.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  }

  // ==========================================================================
  // 7. FAQ ACCORDION INTERACTIVE TOGGLE (Event Delegation for Dynamic Content)
  // ==========================================================================
  const faqContainer = document.getElementById('faq-accordion-container');
  if (faqContainer) {
    faqContainer.addEventListener('click', (e) => {
      const header = e.target.closest('.faq-accordion-header');
      if (!header) return;

      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all other accordion items (Classic Accordion)
      faqContainer.querySelectorAll('.faq-accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-accordion-header').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // ==========================================================================
  // 8. CINEMATIC PROJECT DRAWER SYSTEM & DYNAMIC DATABASE FETCH
  // ==========================================================================
  
  let projectsData = {};

  const initGlobalSettings = (settings) => {
    if (!settings) return;

    // 0.0 Dynamic Style Customizer Settings (CSS Variables Override)
    if (settings.styles) {
      const styles = settings.styles;
      if (styles.primaryColor) {
        const hexToRgb = (hex) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : null;
        };
        const rgb = hexToRgb(styles.primaryColor);
        if (rgb) {
          document.documentElement.style.setProperty('--color-primary', styles.primaryColor);
          document.documentElement.style.setProperty('--color-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
          document.documentElement.style.setProperty('--color-border-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)`);
          
          const intensity = styles.glowIntensity !== undefined ? styles.glowIntensity : 0.35;
          document.documentElement.style.setProperty('--shadow-neon-glow', `0 0 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${intensity})`);
          document.documentElement.style.setProperty('--shadow-neon-glow-strong', `0 0 35px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${intensity * 1.7})`);
        }
      }
      if (styles.sectionPadding !== undefined) {
        document.documentElement.style.setProperty('--section-padding', `${styles.sectionPadding}px`);
      }
      if (styles.gridGap !== undefined) {
        document.documentElement.style.setProperty('--grid-gap', `${styles.gridGap}px`);
      }
    }

    // 0.1 Dynamic Favicon Management
    if (settings.favicon) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon;
    }

    // 0.1 Image Protection (Disable Saving/Right-click/Dragging)
    if (settings.disableImageSave) {
      document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG' || e.target.closest('img') || e.target.closest('.pa-image-wrapper') || e.target.closest('.drawer-gallery')) {
          e.preventDefault();
        }
      });
      document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG' || e.target.closest('img')) {
          e.preventDefault();
        }
      });
    }

    // 1. Title and SEO Description
    if (settings.seoTitle) {
      document.title = settings.seoTitle;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && settings.seoDescription) {
      metaDesc.setAttribute('content', settings.seoDescription);
    }

    // 2. Hero Section
    const heroSubtitle = document.querySelector('.hero-agency-subtitle');
    if (heroSubtitle && settings.heroSubtitle) {
      heroSubtitle.textContent = settings.heroSubtitle;
    }
    const heroTitle = document.querySelector('.hero-agency-title');
    if (heroTitle && settings.heroTitle) {
      heroTitle.innerHTML = settings.heroTitle;
    }

    // 3. About Section
    const aboutTag = document.querySelector('.manifesto-agency-tag');
    if (aboutTag && settings.aboutTag) {
      aboutTag.textContent = settings.aboutTag;
    }
    const aboutText = document.querySelector('.manifesto-agency-text');
    if (aboutText && settings.aboutText) {
      aboutText.textContent = settings.aboutText;
    }
    const aboutDesc = document.querySelector('.manifesto-agency-desc');
    if (aboutDesc && settings.aboutDescription) {
      aboutDesc.textContent = settings.aboutDescription;
    }

    // 4. Contact Details
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
      if (settings.contactEmail) {
        link.setAttribute('href', `mailto:${settings.contactEmail}`);
        if (link.textContent.includes('@')) {
          link.textContent = settings.contactEmail;
        }
      }
    });

    const waLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
    waLinks.forEach(link => {
      if (settings.contactWhatsapp) {
        const cleanNumber = settings.contactWhatsapp.replace(/\D/g, '');
        link.setAttribute('href', `https://wa.me/${cleanNumber}`);
        if (link.textContent.includes('(') || link.textContent.includes('+')) {
          link.textContent = settings.contactWhatsapp;
        }
      }
    });

    // CNPJ and Company Name in Footer
    const companyNameEl = document.querySelector('.fa-company-name');
    if (companyNameEl && settings.footerRazaoSocial) {
      companyNameEl.textContent = settings.footerRazaoSocial;
    }
    const companyCnpjEl = document.querySelector('.fa-company-cnpj');
    if (companyCnpjEl && settings.footerCnpj) {
      companyCnpjEl.textContent = `CNPJ ${settings.footerCnpj}`;
    }

    // Render dynamic social links in footer
    const socialContainer = document.querySelector('.fa-social-icons');
    if (socialContainer && settings.socialLinks) {
      const iconTemplates = {
        instagram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
        behance: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h-3v-3h3v3zm0-5h-3v2.5h3v-2.5zm10.5 4c0-2-1.5-3.5-3.5-3.5s-3.5 1.5-3.5 3.5 1.5 3.5 3.5 3.5 3.5-1.5 3.5-3.5zm-5 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-3.5 3.5h-5.5v-10h5.5c2 0 3.5 1 3.5 3 0 1.5-1 2.5-2 2.8 1.2.3 2 1.2 2 2.7 0 2-1.5 3.5-3.5 3.5zm6-9.5h-5v1.5h5v-1.5z"></path></svg>`,
        linkedin: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
        youtube: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>`,
        vimeo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0zm-8.24-5c-2.31 0-3.66 1.48-4 4.47-.32 2.81-1.39 3.46-2 3.46-.43 0-1.28-.68-1.5-2a22 22 0 0 1-.32-3.41c-.07-.72-.46-1-1.07-1a4 4 0 0 0-1.57.43l.43.86a2 2 0 0 1 .93.22c.28.21.35.79.43 1.58.14 2.29.93 5 2.5 5 1.57 0 2.85-1.58 3.28-4.47.43-2.95.86-4.54 2.21-4.54.93 0 1.64.93 1.5 2.29a14.7 14.7 0 0 1-.71 3.51c-.28 1-.07 1.43.43 1.43.86 0 1.78-1.07 2.14-2.22a7.7 7.7 0 0 0 .43-2.22c-.07-2.3-1.15-3.3-2.93-3.3z"></path></svg>`,
        whatsapp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`
      };

      socialContainer.innerHTML = settings.socialLinks.map(link => {
        const iconSvg = iconTemplates[link.platform] || '';
        const platformLabel = link.platform.charAt(0).toUpperCase() + link.platform.slice(1);
        return `
          <a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${platformLabel}">
            ${iconSvg}
          </a>
        `;
      }).join('');
    }

    // 5. Render dynamic client logos
    renderClients(settings.clients, settings.showClientsSection !== false);

    // 6. Render dynamic FAQ accordion
    renderFaqAccordion(settings.faqs, settings.showFaqSection !== false);

    // 7. Render dynamic section headers for Clients and FAQ
    const clientsTitleEl = document.getElementById('clients-section-title-display');
    if (clientsTitleEl) {
      clientsTitleEl.textContent = settings.clientsTitle || 'Marcas com as quais já colaboramos';
    }
    const faqTagEl = document.getElementById('faq-section-tag-display');
    if (faqTagEl) {
      faqTagEl.textContent = settings.faqTag || 'FAQ ESPECIALIZADO';
    }
    const faqTitleEl = document.getElementById('faq-section-title-display');
    if (faqTitleEl) {
      faqTitleEl.textContent = settings.faqTitle || 'Dúvidas Frequentes';
    }

    // 8. Render dynamic credentials highlights
    renderCredentials(settings.credentials, settings.showCredentialsSection !== false);
  };

  const renderClients = (clients, showSection) => {
    const container = document.getElementById('marquee-content-container');
    if (!container) return;
    
    const section = document.getElementById('clientes');
    if (!showSection || !clients || clients.length === 0) {
      container.innerHTML = '';
      if (section) section.style.display = 'none';
      return;
    }
    if (section) section.style.display = '';
    
    // We duplicate the list to make infinite scroll marquee seamless
    const doubleList = [...clients, ...clients];
    container.innerHTML = doubleList.map(client => `
      <div class="client-logo-item">
        <img src="${client.imageUrl}" alt="${client.name}" class="client-logo-img">
      </div>
    `).join('');
  };

  const renderFaqAccordion = (faqs, showSection) => {
    const container = document.getElementById('faq-accordion-container');
    if (!container) return;
    
    const section = document.getElementById('faq');
    const faqLinks = document.querySelectorAll('a[href="#faq"]');
    
    if (!showSection || !faqs || faqs.length === 0) {
      container.innerHTML = '';
      if (section) section.style.display = 'none';
      faqLinks.forEach(link => {
        const parentLi = link.closest('li');
        if (parentLi) {
          parentLi.style.display = 'none';
        } else {
          link.style.display = 'none';
        }
      });
      return;
    }
    
    if (section) section.style.display = '';
    faqLinks.forEach(link => {
      const parentLi = link.closest('li');
      if (parentLi) {
        parentLi.style.display = '';
      } else {
        link.style.display = '';
      }
    });
    
    container.innerHTML = faqs.map(faq => `
      <div class="faq-accordion-item">
        <button class="faq-accordion-header" aria-expanded="false">
          <h3>${faq.question}</h3>
          <div class="faq-icon-toggle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19" class="toggle-line-v"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
        </button>
        <div class="faq-accordion-body">
          <div class="faq-accordion-content">
            <p>${faq.answer}</p>
          </div>
        </div>
      </div>
    `).join('');
  };

  const renderCredentials = (credentials, showSection) => {
    const container = document.getElementById('manifesto-credentials-container');
    if (!container) return;

    if (!showSection || !credentials || credentials.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      return;
    }

    container.style.display = '';

    const iconTemplates = {
      globe: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
      gear: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
      cpu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3"/></svg>`,
      camera: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
      video: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
      pen: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
      star: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
      zap: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      eye: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
      layers: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`
    };

    container.innerHTML = credentials.map(cred => {
      const iconSvg = iconTemplates[cred.icon] || iconTemplates.globe;
      return `
        <div class="credential-card">
          <div class="cred-icon-wrapper">
            ${iconSvg}
          </div>
          <h3>${cred.title}</h3>
          <p>${cred.description}</p>
        </div>
      `;
    }).join('');
  };

  const renderProjectsGrid = (projects) => {
    const gridContainer = document.querySelector('.projects-agency-grid');
    if (!gridContainer || !projects || projects.length === 0) return;

    gridContainer.innerHTML = projects.map((proj, idx) => {
      const delayClass = (idx % 2 === 1) ? 'delay-1' : '';
      const thumbnail = proj.thumbnail || (proj.gallery && proj.gallery[0]) || '';
      return `
        <div class="project-agency-card reveal-on-scroll ${delayClass}" data-project-id="${proj.id}">
          <div class="pa-image-wrapper">
            <img src="${thumbnail}" alt="${proj.title} - evoadesign">
            <div class="pa-overlay">
              <span class="pa-category">${proj.category}</span>
            </div>
          </div>
          <div class="pa-footer">
            <div class="pa-text">
              <h3>${proj.title}</h3>
              <p>${proj.shortDescription || proj.description.substring(0, 100) + '...'}</p>
            </div>
            <div class="pa-arrow-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Observe newly created cards using the existing revealObserver
    const newCards = gridContainer.querySelectorAll('.project-agency-card');
    newCards.forEach(card => {
      revealObserver.observe(card);
    });
  };

  const drawerOverlay = document.getElementById('project-drawer-overlay');
  const drawer = document.getElementById('project-drawer');
  const drawerContent = document.getElementById('drawer-content');
  const drawerCloseBtn = document.getElementById('drawer-close');
  const gridContainer = document.querySelector('.projects-agency-grid');

  // Event Delegation for dynamic project card clicks
  if (gridContainer) {
    gridContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.project-agency-card');
      if (!card) return;

      const projectId = card.getAttribute('data-project-id');
      const data = projectsData[projectId];

      if (!data) return;

      // Compile and Inject HTML content
      let conceptSectionHTML = '';
      if (data.showConceptHighlights !== false && data.conceptHighlights && data.conceptHighlights.length > 0) {
        let conceptListHTML = data.conceptHighlights.map(item => `
          <li>
            <span class="drawer-highlight-bullet"></span>
            <span>${item}</span>
          </li>
        `).join('');
        
        conceptSectionHTML = `
          <!-- Section: Conceito e Styling -->
          <div class="drawer-section">
            <h3 class="drawer-section-title">Conceito & Styling</h3>
            <ul class="drawer-highlight-list">
              ${conceptListHTML}
            </ul>
          </div>
        `;
      }

      let cmfSectionHTML = '';
      if (data.showCmfHighlights !== false && data.cmfHighlights && data.cmfHighlights.length > 0) {
        let cmfListHTML = data.cmfHighlights.map(item => `
          <li>
            <span class="drawer-highlight-bullet"></span>
            <span>${item}</span>
          </li>
        `).join('');
        
        cmfSectionHTML = `
          <!-- Section: Cores, Materiais & Acabamento -->
          <div class="drawer-section">
            <h3 class="drawer-section-title">CMF & Especificações</h3>
            <ul class="drawer-highlight-list">
              ${cmfListHTML}
            </ul>
          </div>
        `;
      }

      let galleryHTML = '';
      if (data.iframeEmbed) {
        galleryHTML += `
          <div class="drawer-gallery-item drawer-iframe-wrapper ${data.iframeClass || ''}">
            ${data.iframeEmbed}
          </div>
        `;
      }
      galleryHTML += data.gallery.map(imgSrc => `
        <div class="drawer-gallery-item">
          <img src="${imgSrc}" alt="${data.title}" class="drawer-gallery-img" loading="lazy">
        </div>
      `).join('');

      drawerContent.innerHTML = `
        <span class="drawer-project-tag">${data.category}</span>
        <h2 class="drawer-project-title">${data.title}</h2>
        <p class="drawer-project-desc">${data.description}</p>
        
        <!-- Metrics Grid -->
        <div class="drawer-meta-grid">
          <div class="drawer-meta-item">
            <span class="drawer-meta-label">Cliente</span>
            <span class="drawer-meta-value">${data.client}</span>
          </div>
          <div class="drawer-meta-item">
            <span class="drawer-meta-label">Ano</span>
            <span class="drawer-meta-value">${data.year}</span>
          </div>
          <div class="drawer-meta-item">
            <span class="drawer-meta-label">Softwares</span>
            <span class="drawer-meta-value">${data.tools}</span>
          </div>
        </div>

        ${conceptSectionHTML}

        ${cmfSectionHTML}

        <!-- Section: Galeria Cinematic 3D -->
        <div class="drawer-section">
          <h3 class="drawer-section-title">Galeria de Renders</h3>
          <div class="drawer-gallery">
            ${galleryHTML}
          </div>
        </div>
      `;

      // Open drawer, lock body scroll
      drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Reset scroll position of the drawer content itself to top
      drawer.scrollTop = 0;
    });
  }

  // Fetch all CMS configurations and database assets in parallel
  Promise.all([
    fetch('content/settings.json').then(res => res.json()),
    fetch('content/projects.json').then(res => res.json())
  ])
  .then(([settings, projects]) => {
    // 1. Initialize institutional text and SEO tags
    initGlobalSettings(settings);

    // 2. Map database keys to local projectsData dictionary for drawer lookup
    if (projects && projects.items) {
      projects.items.forEach(proj => {
        projectsData[proj.id] = proj;
      });
      // 3. Build asymmetrical grid layout
      renderProjectsGrid(projects.items);
    }
  })
  .catch(err => {
    console.error('Erro ao carregar banco de dados JSON do CMS:', err);
  });

  // Cinematic Fullscreen Lightbox Elements
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCloseBtn = document.getElementById('lightbox-close');

  // Open Lightbox when clicking on any gallery image inside the drawer
  // Using event delegation because the drawer content is injected dynamically!
  drawerContent.addEventListener('click', (e) => {
    if (e.target.classList.contains('drawer-gallery-img')) {
      const src = e.target.getAttribute('src');
      const alt = e.target.getAttribute('alt');
      
      lightboxImg.setAttribute('src', src);
      lightboxImg.setAttribute('alt', alt);
      lightboxOverlay.classList.add('active');
    }
  });

  // Close Lightbox Function
  const closeLightbox = () => {
    lightboxOverlay.classList.remove('active');
    // Clear src after transition to prevent flickering when re-opening
    setTimeout(() => {
      if (!lightboxOverlay.classList.contains('active')) {
        lightboxImg.setAttribute('src', '');
      }
    }, 500);
  };

  // Lightbox Close Events
  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxImg.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  // Close Drawer Function
  const closeProjectDrawer = () => {
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close Event Listeners
  drawerCloseBtn.addEventListener('click', closeProjectDrawer);
  
  // Close when clicking outside of the drawer panel (on the overlay backdrop)
  drawerOverlay.addEventListener('click', (e) => {
    if (e.target === drawerOverlay) {
      closeProjectDrawer();
    }
  });

  // Close with Escape Key (Modal Stack Aware)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxOverlay.classList.contains('active')) {
        closeLightbox();
      } else if (drawerOverlay.classList.contains('active')) {
        closeProjectDrawer();
      }
    }
  });

  // ==========================================================================
  // 9. DYNAMIC HERO SLIDESHOW SYSTEM (Cinematic Fading Banner)
  // ==========================================================================
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlideIndex = 0;
  const slideIntervalTime = 6000; // 6 seconds per slide

  const showNextSlide = () => {
    if (slides.length === 0) return;
    
    slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slides[currentSlideIndex].classList.add('active');
  };

  if (slides.length > 0) {
    setInterval(showNextSlide, slideIntervalTime);
  }

  // ==========================================================================
  // 10. REAL-TIME LIVE PREVIEW CHANNEL (postMessage Listener for Visual Admin)
  // ==========================================================================
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PREVIEW_UPDATE') {
      console.log('Visual Studio: Preview Update Received.', event.data);
      const { settings, projects } = event.data;
      if (settings) {
        initGlobalSettings(settings);
      }
      if (projects) {
        projectsData = {};
        if (projects.items) {
          projects.items.forEach(proj => {
            projectsData[proj.id] = proj;
          });
          renderProjectsGrid(projects.items);
        }
      }
    }
  });

  // Brand introductory log in the console
  console.log(
    '%cevoadesign%c Cinematic Creative Studio Portfolio Active %c(2026)',
    'color: #009ae0; font-family: sans-serif; font-size: 20px; font-weight: bold;',
    'color: #94a3b8; font-family: sans-serif; font-size: 14px;',
    'color: #555; font-family: sans-serif; font-size: 12px;'
  );
});
