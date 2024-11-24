document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menu-button');
  const navMenu = document.getElementById('nav-menu');

  // Menu Toggle
  menuButton.addEventListener('click', toggleMenu);
  menuButton.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  function toggleMenu() {
    navMenu.classList.toggle('active');
    menuButton.classList.toggle('active');
    const expanded =
      menuButton.getAttribute('aria-expanded') === 'true' || false;
    menuButton.setAttribute('aria-expanded', !expanded);
  }

  // Scroll functionality for hero section
  const heroContainers = document.querySelectorAll('.video-container');

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

  // Video Hover Play Functionality
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

  // Function to detect mobile devices
  function isMobileDevice() {
    return (
      typeof window.orientation !== 'undefined' ||
      navigator.userAgent.indexOf('IEMobile') !== -1 ||
      navigator.maxTouchPoints > 0 ||
      'ontouchstart' in window
    );
  }

  // Scroll-Triggered Animations
  const options = { threshold: 1 }; // Adjust threshold as needed

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const target = entry.target;

      // Handle service cards and "About Us" differently
      if (
        target.classList.contains('service-card') ||
        target.classList.contains('about-us')
      ) {
        if (entry.isIntersecting) {
          // Add 'animate' class only once
          if (!target.classList.contains('animate')) {
            target.classList.add('animate');
          }
          // For service cards on mobile, handle 'animate-line' class
          if (target.classList.contains('service-card') && isMobileDevice()) {
            target.classList.add('animate-line');
          }
        } else {
          // For service cards on mobile, remove 'animate-line' to reset accent line animation
          if (target.classList.contains('service-card') && isMobileDevice()) {
            target.classList.remove('animate-line');
          }
          // Do not remove 'animate' class for 'about-us' or 'service-card'
        }
      } else {
        // For other elements (e.g., 'contact-us'), add and remove 'animate' class
        if (entry.isIntersecting) {
          target.classList.add('animate');
        } else {
          target.classList.remove('animate');
        }
      }
    });
  }, options);

  // Observe service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card) => observer.observe(card));

  // Observe 'about-us' section
  const aboutUsSection = document.querySelector('.about-us');
  if (aboutUsSection) {
    observer.observe(aboutUsSection);
  }

  // Observe other sections if needed
  const contactUsSection = document.querySelector('.contact-us');
  if (contactUsSection) {
    observer.observe(contactUsSection);
  }
});
