// ===== МОБИЛЬНОЕ МЕНЮ =====
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Закрытие мобильного меню при клике на ссылку
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// ===== ВЫПАДАЮЩЕЕ МЕНЮ ДЛЯ ДЕСКТОПА =====
const desktopDropdowns = document.querySelectorAll('.has-dropdown');

desktopDropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
        const dropdownMenu = dropdown.querySelector('.dropdown');
        if (dropdownMenu) {
            dropdownMenu.style.opacity = '1';
            dropdownMenu.style.visibility = 'visible';
            dropdownMenu.style.transform = 'translateY(0)';
        }
    });
    
    dropdown.addEventListener('mouseleave', () => {
        const dropdownMenu = dropdown.querySelector('.dropdown');
        if (dropdownMenu) {
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.visibility = 'hidden';
            dropdownMenu.style.transform = 'translateY(10px)';
        }
    });
});

// ===== FAQ АККОРДЕОН =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Закрываем все остальные вопросы
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // Открываем/закрываем текущий вопрос
        item.classList.toggle('active');
    });
});

// ===== ФОРМА ОБРАТНОЙ СВЯЗИ =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.messageEl = document.getElementById('form-message');
        
        if (this.form) {
            // URL для тестирования формы (можно изменить на ваш сервис форм)
            this.formspreeUrl = 'https://formspree.io/f/mvojgqza';
            this.init();
            this.initPhoneMask();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    // МАСКА ДЛЯ ТЕЛЕФОНА
    initPhoneMask() {
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) return;
        
        phoneInput.addEventListener('input', function(e) {
            let numbers = this.value.replace(/\D/g, '');
            
            if (numbers.length > 11) {
                numbers = numbers.substring(0, 11);
            }
            
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
        
        // Запрещаем ввод букв
        phoneInput.addEventListener('keypress', function(e) {
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
            
            if (allowedKeys.includes(e.key)) {
                return;
            }
            
            if (!/\d/.test(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Показываем загрузку
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Валидация телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput && phoneInput.value.trim() !== '') {
            const phoneNumbers = phoneInput.value.replace(/\D/g, '');
            if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
                this.showMessage('Номер телефона должен содержать 10-11 цифр', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
        }
        
        // Собираем данные формы
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Добавляем дополнительную информацию
        data._subject = 'Новая заявка с сайта Drupal-coder';
        data._replyto = data.email;
        
        try {
            const response = await fetch(this.formspreeUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.showMessage('Заявка успешно отправлена! Наш менеджер свяжется с вами в течение 2 часов.', 'success');
                this.form.reset();
            } else {
                throw new Error('Ошибка отправки формы');
            }
        } catch (error) {
            this.showMessage(`Ошибка: ${error.message}. Попробуйте еще раз.`, 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showMessage(text, type) {
        if (this.messageEl) {
            this.messageEl.textContent = text;
            this.messageEl.className = type;
            this.messageEl.style.display = 'block';
            
            setTimeout(() => {
                this.messageEl.style.display = 'none';
            }, 5000);
        }
    }
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
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
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем форму
    new ContactForm();
    
    // Инициализируем плавную прокрутку
    initSmoothScroll();
    
    // Обработка ошибки видео
    const video = document.querySelector('.video-background');
    if (video) {
        video.addEventListener('error', () => {
            console.log('Видео не загрузилось, используем фоновый градиент');
            video.style.display = 'none';
            document.querySelector('.header').style.background = 
                'linear-gradient(135deg, #3498db, #2c3e50)';
        });
    }
    
    // Фиксированная навигация при скролле
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// ===== ЗАПОЛНЕНИЕ ЧИСЛОВЫХ БЛОКОВ АНИМАЦИЕЙ =====
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
        }, 30);
    });
}

// Запускаем анимацию чисел при скролле
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Наблюдаем за секцией статистики
const statsSection = document.querySelector('.stats');
if (statsSection) {
    observer.observe(statsSection);
}
