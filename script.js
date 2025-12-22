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
                    other.querySelector('.mobile-dropdown-menu')?.classList.remove('active');
                }
            });
        });
    }
});

// Десктоп выпадающее меню
const desktopDropdowns = document.querySelectorAll('.has-dropdown');

desktopDropdowns.forEach(dropdown => {
    const dropdownMenu = dropdown.querySelector('.dropdown');
    
    if (!dropdownMenu) return;
    
    dropdown.addEventListener('mouseenter', () => {
        dropdownMenu.style.opacity = '1';
        dropdownMenu.style.visibility = 'visible';
        dropdownMenu.style.transform = 'translateY(0)';
    });
    
    dropdown.addEventListener('mouseleave', () => {
        dropdownMenu.style.opacity = '0';
        dropdownMenu.style.visibility = 'hidden';
        dropdownMenu.style.transform = 'translateY(-15px)';
    });
});

// Слайдер (исправленная версия)
class PortfolioSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slider .slide');
        this.dots = document.querySelectorAll('.slider-dots .dot');
        this.prevBtn = document.querySelector('.slider-prev');
        this.nextBtn = document.querySelector('.slider-next');
        this.wrapper = document.querySelector('.slider-wrapper');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.interval = null;
        
        if (this.slides.length > 0) {
            this.init();
            console.log('Slider initialized with', this.totalSlides, 'slides');
        } else {
            console.log('No slides found');
        }
    }
    
    init() {
        // Кнопки навигации
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetInterval();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetInterval();
            });
        }
        
        // Точки навигации
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetInterval();
            });
        });
        
        this.updateSlider();
        
        // Автопрокрутка
        this.startAutoSlide();
        
        // Остановка при наведении
        const slider = document.querySelector('.slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => this.stopAutoSlide());
            slider.addEventListener('mouseleave', () => this.startAutoSlide());
        }
    }
    
    updateSlider() {
        // Перемещение слайдов
        if (this.wrapper) {
            this.wrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
            this.wrapper.style.transition = 'transform 0.5s ease';
        }
        
        // Обновление точек
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
        
        // Обновление слайдов
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlide = index;
            this.updateSlider();
        }
    }
    
    startAutoSlide() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoSlide() {
        if (this.interval) clearInterval(this.interval);
    }
    
    resetInterval() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}

// Форма заявки (исправленная версия)
class DrupalContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.messageEl = document.getElementById('form-message');
        
        if (this.form) {
            // Используем Formspree - замените на ваш реальный endpoint
            this.formspreeUrl = 'https://formspree.io/f/xbjvrdre';
            this.init();
            this.initPhoneMask();
        } else {
            console.log('Форма не найдена');
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
                formatted = '+7';
                if (numbers.length > 1) {
                    formatted += ' (' + numbers.substring(1, 4);
                    if (numbers.length >= 4) {
                        formatted += ') ' + numbers.substring(4, 7);
                        if (numbers.length >= 7) {
                            formatted += '-' + numbers.substring(7, 9);
                            if (numbers.length >= 9) {
                                formatted += '-' + numbers.substring(9, 11);
                            }
                        }
                    }
                }
            }
            
            this.value = formatted;
        });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;
        
        // Простая валидация
        const phoneInput = document.getElementById('phone');
        if (phoneInput && phoneInput.value.trim() !== '') {
            const phoneNumbers = phoneInput.value.replace(/\D/g, '');
            if (phoneNumbers.length < 11) {
                this.showMessage('Номер телефона должен содержать 11 цифр', 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
        }
        
        // Проверка обязательных полей
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#e53e3e';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            this.showMessage('Заполните все обязательные поля', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Собираем данные
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        try {
            console.log('Отправка данных:', data);
            
            // Имитация отправки (для теста)
            // В реальном проекте раскомментируйте fetch
            /*
            const response = await fetch(this.formspreeUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.showMessage('✅ Спасибо! Ваша заявка отправлена.', 'success');
                this.form.reset();
            } else {
                throw new Error('Ошибка отправки формы');
            }
            */
            
            // Для теста - сразу успех
            setTimeout(() => {
                this.showMessage('✅ Спасибо! Ваша заявка отправлена.', 'success');
                this.form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1000);
            
        } catch (error) {
            console.error('Ошибка:', error);
            this.showMessage(`❌ Ошибка: ${error.message}`, 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showMessage(text, type) {
        if (this.messageEl) {
            this.messageEl.textContent = text;
            this.messageEl.className = type;
            this.messageEl.style.display = 'block';
            
            // Прокрутка к сообщению
            this.messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Автоскрытие
            setTimeout(() => {
                this.messageEl.style.display = 'none';
            }, 5000);
        } else {
            // Создаем сообщение, если его нет
            const messageDiv = document.createElement('div');
            messageDiv.id = 'form-message';
            messageDiv.className = type;
            messageDiv.textContent = text;
            messageDiv.style.cssText = `
                margin-top: 20px;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                font-weight: 600;
                background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
                color: ${type === 'success' ? '#155724' : '#721c24'};
            `;
            
            this.form.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, инициализация...');
    
    // Инициализируем слайдер
    const slider = new PortfolioSlider();
    console.log('Слайдер создан:', slider);
    
    // Инициализируем форму
    const contactForm = new DrupalContactForm();
    console.log('Форма создана:', contactForm);
    
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
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Учитываем высоту навигации
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Проверка видео
    const video = document.querySelector('.video-background');
    if (video) {
        video.addEventListener('error', () => {
            console.log('Видео не загрузилось, используем фоновый градиент');
            video.style.display = 'none';
            document.querySelector('.header').style.background = 
                'linear-gradient(135deg, var(--primary-dark), var(--secondary))';
        });
        
        // Установка громкости
        video.volume = 0;
    }
    
    // Добавляем анимации при скролле
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.stat-item, .service-card, .advantage');
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Начальные стили для анимации
    document.querySelectorAll('.stat-item, .service-card, .advantage').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Запускаем анимацию при загрузке
    setTimeout(animateOnScroll, 300);
    
    // И при скролле
    window.addEventListener('scroll', animateOnScroll);
});

// Также инициализируем при полной загрузке страницы
window.addEventListener('load', () => {
    console.log('Страница полностью загружена');
});
