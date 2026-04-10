// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                              target.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start'
                              });
                }
      });
});

// Contact form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = this.querySelector('input[type="text"]').value;
                const email = this.querySelector('input[type="email"]').value;
                const message = this.querySelector('textarea').value;

                                           if (name && email && message) {
                                                         // Show success message
                    const btn = this.querySelector('.submit-btn');
                                                         const originalText = btn.textContent;
                                                         btn.textContent = 'Message Sent!';
                                                         btn.style.background = '#28a745';
                                                         btn.disabled = true;

                    setTimeout(() => {
                                      btn.textContent = originalText;
                                      btn.style.background = '';
                                      btn.disabled = false;
                                      this.reset();
                    }, 3000);
                                           }
      });
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
                navbar.style.background = 'rgba(26, 26, 46, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
      } else {
                navbar.style.background = 'rgba(0, 0, 0, 0.2)';
                navbar.style.boxShadow = 'none';
      }
});

// Animate feature cards on scroll (Intersection Observer)
const featureCards = document.querySelectorAll('.feature-card');
const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
                if (entry.isIntersecting) {
                              entry.target.style.opacity = '1';
                              entry.target.style.transform = 'translateY(0)';
                }
      });
}, observerOptions);

featureCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      cardObserver.observe(card);
});
