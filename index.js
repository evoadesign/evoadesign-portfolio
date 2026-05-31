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
  // 7. FAQ ACCORDION INTERACTIVE TOGGLE
  // ==========================================================================
  const faqHeaders = document.querySelectorAll('.faq-accordion-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all other accordion items (Classic Accordion)
      document.querySelectorAll('.faq-accordion-item').forEach(otherItem => {
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
  });

  // ==========================================================================
  // 8. CINEMATIC PROJECT DRAWER SYSTEM & DYNAMIC DATABASE FETCH
  // ==========================================================================
  
  let projectsData = {};

  const initGlobalSettings = (settings) => {
    if (!settings) return;

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
      let conceptListHTML = data.conceptHighlights.map(item => `
        <li>
          <span class="drawer-highlight-bullet"></span>
          <span>${item}</span>
        </li>
      `).join('');

      let cmfListHTML = data.cmfHighlights.map(item => `
        <li>
          <span class="drawer-highlight-bullet"></span>
          <span>${item}</span>
        </li>
      `).join('');

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

        <!-- Section: Conceito e Styling -->
        <div class="drawer-section">
          <h3 class="drawer-section-title">Conceito & Styling</h3>
          <ul class="drawer-highlight-list">
            ${conceptListHTML}
          </ul>
        </div>

        <!-- Section: Cores, Materiais & Acabamento -->
        <div class="drawer-section">
          <h3 class="drawer-section-title">CMF & Especificações</h3>
          <ul class="drawer-highlight-list">
            ${cmfListHTML}
          </ul>
        </div>

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

  // Brand introductory log in the console
  console.log(
    '%cevoadesign%c Cinematic Creative Studio Portfolio Active %c(2026)',
    'color: #009ae0; font-family: sans-serif; font-size: 20px; font-weight: bold;',
    'color: #94a3b8; font-family: sans-serif; font-size: 14px;',
    'color: #555; font-family: sans-serif; font-size: 12px;'
  );
});
