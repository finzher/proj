// Мобильное меню
const mobileBtn = document.getElementById('mobileBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileBtn.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileBtn.classList.remove('active');
        });
    });
}

// Выпадающее меню
document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
        dropdown.querySelector('.dropdown-menu').style.cssText = 'opacity:1;visibility:visible;transform:translateY(0)';
    });
    
    dropdown.addEventListener('mouseleave', () => {
        dropdown.querySelector('.dropdown-menu').style.cssText = 'opacity:0;visibility:hidden;transform:translateY(10px)';
    });
});

// FAQ аккордеон
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
        // Закрыть все остальные
        document.querySelectorAll('.faq-item').forEach(other => {
            if (other !== item) other.classList.remove('active');
        });
        
        // Открыть текущий
        item.classList.toggle('active');
    });
});

// Слайдер портфолио
let currentSlide = 0;
const slides = document.querySelectorAll('.portfolio-slide');
const dots = document.querySelectorAll('.dot');

if (slides.length > 0) {
    // Навигация по точкам
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Кнопки вперед/назад
    document.getElementById('prevSlide')?.addEventListener('click', () => goToSlide(currentSlide - 1));
    document.getElementById('nextSlide')?.addEventListener('click', () => goToSlide(currentSlide + 1));
    
    function goToSlide(n) {
        if (n < 0) n = slides.length - 1;
        if (n >= slides.length) n = 0;
        
        currentSlide = n;
        updateSlider();
    }
    
    function updateSlider() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Автопрокрутка
    setInterval(() => goToSlide(currentSlide + 1), 5000);
}

// Анимация печатающегося текста
const typingText = document.querySelector('.typing-text .typed');
if (typingText) {
    const texts = [
        "Поддержка сайтов на Drupal",
        "Разработка модулей Drupal",
        "Аудит безопасности Drupal",
        "Оптимизация скорости Drupal"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    
    type();
}

// Анимация кругов прогресса
document.querySelectorAll('.circle-progress').forEach(circle => {
    const value = parseInt(circle.dataset.value);
    circle.style.setProperty('--progress', value);
});

// Форма обратной связи
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Показываем загрузку
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Валидация телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            const phone = phoneInput.value.replace(/\D/g, '');
            if (phone.length < 10 || phone.length > 11) {
                showMessage('Введите корректный номер телефона', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
        }
        
        // Собираем данные
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        try {
            // Используем Formspree для отправки
            const response = await fetch('https://formspree.io/f/mvojgqza', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showMessage('Заявка успешно отправлена! Мы свяжемся с вами в течение часа.', 'success');
                contactForm.reset();
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            showMessage('Ошибка отправки. Попробуйте еще раз.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Маска телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let numbers = this.value.replace(/\D/g, '');
            if (numbers.length > 11) numbers = numbers.substring(0, 11);
            
            let formatted = '';
            if (numbers.length > 0) {
                if (numbers.startsWith('7') || numbers.startsWith('8')) {
                    formatted = '+7';
                    if (numbers.length > 1) formatted += ' (' + numbers.substring(1, 4);
                    if (numbers.length >= 4) formatted += ') ' + numbers.substring(4, 7);
                    if (numbers.length >= 7) formatted += '-' + numbers.substring(7, 9);
                    if (numbers.length >= 9) formatted += '-' + numbers.substring(9, 11);
                } else {
                    formatted = '+7 (' + numbers.substring(0, 3);
                    if (numbers.length >= 3) formatted += ') ' + numbers.substring(3, 6);
                    if (numbers.length >= 6) formatted += '-' + numbers.substring(6, 8);
                    if (numbers.length >= 8) formatted += '-' + numbers.substring(8, 10);
                }
            }
            
            this.value = formatted;
        });
    }
}

// Показать сообщение
function showMessage(text, type) {
    const messageEl = document.getElementById('formMessage');
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = 'form-message ' + type;
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Фиксированная навигация при скролле
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Анимация чисел при появлении
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.5 });

// Наблюдаем за элементами с анимацией
document.querySelectorAll('.circle-progress, .stat-number').forEach(el => {
    observer.observe(el);
});

// Обработка ошибки видео
const video = document.querySelector('.video-background');
if (video) {
    video.addEventListener('error', () => {
        document.querySelector('.header').style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    console.log('Drupal-coder project loaded');
});
