// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Menu Button Functionality
  const menuButton = document.getElementById('menu-button');
  const navMenu = document.getElementById('nav-menu');

  // Toggle the 'active' class on click and keyboard events
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
    // Accessibility attribute
    const expanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
    menuButton.setAttribute('aria-expanded', !expanded);
  }

  // Video Hover Play Functionality
  const videoContainers = document.querySelectorAll('.video-container');

  videoContainers.forEach(container => {
    const video = container.querySelector('video');
    
    // Only add event listeners if video exists
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
  const options = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries, observerInstance) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observerInstance.unobserve(entry.target);
      }
    });
  }, options);

  // Observe Service Cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    observer.observe(card);
  });

  // Observe About Us Section
  const aboutUsSection = document.querySelector('.about-us');
  observer.observe(aboutUsSection);

  // Observe Contact Us Section
  const contactUsSection = document.querySelector('.contact-us');
  observer.observe(contactUsSection);
});
