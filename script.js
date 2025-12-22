// Мобильное меню
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
}

// Мобильные выпадающие меню
const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');

mobileDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.mobile-dropdown-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            menu.classList.toggle('active');
            
            // Закрытие других открытых меню
            mobileDropdowns.forEach(other => {
                if (other !== dropdown) {
                    other.querySelector('.mobile-dropdown-menu').classList.remove('active');
                }
            });
        });
    }
});

// Десктоп выпадающее меню
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
            dropdownMenu.style.transform = 'translateY(-15px)';
        }
    });
});

// Слайдер
class Slider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.slider-prev');
        this.nextBtn = document.querySelector('.slider-next');
        this.currentSlide = 0;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        this.updateSlider();
        
        // Автопрокрутка
        this.interval = setInterval(() => this.nextSlide(), 6000);
        
        // Остановка при наведении
        const slider = document.querySelector('.slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => clearInterval(this.interval));
            slider.addEventListener('mouseleave', () => {
                this.interval = setInterval(() => this.nextSlide(), 6000);
            });
        }
    }
    
    updateSlider() {
        const wrapper = document.querySelector('.slider-wrapper');
        if (wrapper) {
            wrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
}

// Форма заявки
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.messageEl = document.getElementById('form-message');
        
        if (this.form) {
            // Используем Formspree (замените на ваш endpoint)
            this.formspreeUrl = 'https://formspree.io/f/xbjvrdre';
            this.init();
            this.initPhoneMask();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    // Маска для телефона
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
        
        phoneInput.addEventListener('keypress', function(e) {
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
            
            if (allowedKeys.includes(e.key)) return;
            
            if (!/\d/.test(e.key)) {
                e.preventDefault();
            }
        });
        
        phoneInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = e.clipboardData.getData('text');
            const numbers = pastedText.replace(/\D/g, '').substring(0, 11);
            this.value = numbers;
            this.dispatchEvent(new Event('input'));
        });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;
        
        // Валидация телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput && phoneInput.value.trim() !== '') {
            const phoneNumbers = phoneInput.value.replace(/\D/g, '');
            if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
                this.showMessage('Номер телефона должен содержать 10-11 цифр', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
        }
        
        // Собираем данные
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
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
                this.showMessage('✅ Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в течение 24 часов.', 'success');
                this.form.reset();
            } else {
                throw new Error('Ошибка отправки формы');
            }
        } catch (error) {
            this.showMessage(`❌ Ошибка: ${error.message}. Пожалуйста, попробуйте еще раз.`, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем слайдер
    new Slider();
    
    // Инициализируем форму
    new ContactForm();
    
    // Закрываем мобильное меню при клике на ссылку
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Проверка видео
    const video = document.querySelector('.video-background');
    if (video) {
        video.addEventListener('error', () => {
            console.log('Видео не загрузилось, используем градиентный фон');
            video.style.display = 'none';
            document.querySelector('.header').style.background = 
                'linear-gradient(135deg, var(--primary-dark), var(--secondary))';
        });
        
        // Управление громкостью (если нужно)
        video.volume = 0;
    }
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами с анимацией
    document.querySelectorAll('.stat-item, .service-card, .advantage').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});
