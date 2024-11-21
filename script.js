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
    const expanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
    menuButton.setAttribute('aria-expanded', !expanded);
  }

  // Scroll functionality for hero section
  const heroContainers = document.querySelectorAll('.video-container');

  heroContainers.forEach((container) => {
    container.addEventListener('click', () => {
      const targetId = container.id === 'video1'
        ? 'contact'
        : container.id === 'video2'
        ? 'about'
        : container.id === 'video3'
        ? 'services'
        : null;

      if (targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Scroll-Triggered Animations
  const options = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observerInstance.unobserve(entry.target);
      }
    });
  }, options);

  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card) => observer.observe(card));

  const aboutUsSection = document.querySelector('.about-us');
  observer.observe(aboutUsSection);

  const contactUsSection = document.querySelector('.contact-us');
  observer.observe(contactUsSection);
});
