document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menu-button');
  const navMenu = document.getElementById('nav-menu');
  const heroContainers = document.querySelectorAll('.video-container');

  // Menu Toggle
  menuButton.addEventListener('click', toggleMenu);
  menuButton.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  function toggleMenu() {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    navMenu.classList.toggle('active');
    menuButton.classList.toggle('active');
    menuButton.setAttribute('aria-expanded', !isExpanded);

    // Reset menu button color to black when menu is closed
    if (!navMenu.classList.contains('active')) {
      resetMenuButtonColor();
    }
  }

  function resetMenuButtonColor() {
    const menuSpans = menuButton.querySelectorAll('span');
    menuSpans.forEach((span) => {
      span.style.backgroundColor = '#000'; // Black color
    });
  }

  // Scroll event to close the menu on mobile
  window.addEventListener('scroll', () => {
    if (isMobileDevice() && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  function closeMenu() {
    navMenu.classList.remove('active');
    menuButton.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    resetMenuButtonColor();
  }

  // Function to detect mobile devices
  function isMobileDevice() {
    return (
      typeof window.orientation !== 'undefined' ||
      navigator.userAgent.indexOf('IEMobile') !== -1 ||
      navigator.maxTouchPoints > 0 ||
      'ontouchstart' in window
    );
  }

  // Disable video playback on mobile but keep the poster
  if (isMobileDevice()) {
    heroContainers.forEach((container) => {
      const video = container.querySelector('video');
      if (video) {
        video.pause(); // Stop video playback
        video.removeAttribute('autoplay'); // Remove autoplay on mobile
        video.removeAttribute('loop'); // Remove looping to prevent unwanted behavior
        video.style.pointerEvents = 'none'; // Disable interaction with the video
      }
    });
  }

  // Scroll functionality for hero section
  heroContainers.forEach((container) => {
    container.addEventListener('click', () => {
      const targetId =
        container.id === 'video1'
          ? 'contact'
          : container.id === 'video2'
          ? 'about'
          : container.id === 'video3'
          ? 'services'
          : null;

      if (targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    });
  });

  // Video Hover Play Functionality (only for non-mobile)
  if (!isMobileDevice()) {
    heroContainers.forEach((container) => {
      const video = container.querySelector('video');
      if (video) {
        container.addEventListener('mouseenter', () => {
          video.play();
        });
        container.addEventListener('mouseleave', () => {
          video.pause();
          video.currentTime = 0;
        });
      }
    });
  }

  // IntersectionObserver for service cards with high threshold
  const serviceCardsObserverOptions = { threshold: 1 };
  const serviceCardsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target;

      if (entry.isIntersecting) {
        // Add 'animate' class only once
        if (!target.classList.contains('animate')) {
          target.classList.add('animate');
        }
        // For service cards on mobile, handle 'animate-line' class
        if (isMobileDevice()) {
          target.classList.add('animate-line');
        }
      } else {
        // For service cards on mobile, remove 'animate-line' to reset accent line animation
        if (isMobileDevice()) {
          target.classList.remove('animate-line');
        }
        // Do not remove 'animate' class for 'service-card'
      }
    });
  }, serviceCardsObserverOptions);

  // IntersectionObserver for other sections with lower threshold
  const otherSectionsObserverOptions = { threshold: 0.2 }; // Adjust as needed
  const otherSectionsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target;

      if (entry.isIntersecting) {
        // Add 'animate' class only once
        if (!target.classList.contains('animate')) {
          target.classList.add('animate');
        }
      } else {
        // Do not remove 'animate' class to prevent reanimation
      }
    });
  }, otherSectionsObserverOptions);

  // Observe service cards with high threshold observer
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card) => serviceCardsObserver.observe(card));

  // Observe 'about-us' section with lower threshold observer
  const aboutUsSection = document.querySelector('.about-us');
  if (aboutUsSection) {
    otherSectionsObserver.observe(aboutUsSection);
  }

  // Observe other sections if needed (e.g., 'contact-us')
  const contactUsSection = document.querySelector('.contact-us');
  if (contactUsSection) {
    otherSectionsObserver.observe(contactUsSection);
  }
});
