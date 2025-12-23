// Мобильное меню
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        console.log('Мобильное меню:', mobileMenu.classList.contains('active') ? 'открыто' : 'закрыто');
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

// Слайдер - ОЧЕНЬ ПРОСТАЯ РАБОЧАЯ ВЕРСИЯ
class SimpleSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.slider-prev');
        this.nextBtn = document.querySelector('.slider-next');
        this.currentSlide = 0;
        
        console.log('Найдено слайдов:', this.slides.length);
        console.log('Найдено точек:', this.dots.length);
        console.log('Кнопка "Назад":', this.prevBtn ? 'найдена' : 'не найдена');
        console.log('Кнопка "Вперед":', this.nextBtn ? 'найдена' : 'не найдена');
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Кнопка "Назад"
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                console.log('Кнопка "Назад" нажата');
                this.prevSlide();
            });
        } else {
            console.error('Кнопка "Назад" не найдена!');
        }
        
        // Кнопка "Вперед"
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                console.log('Кнопка "Вперед" нажата');
                this.nextSlide();
            });
        } else {
            console.error('Кнопка "Вперед" не найдена!');
        }
        
        // Точки навигации
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                console.log('Точка', index, 'нажата');
                this.goToSlide(index);
            });
        });
        
        // Показываем первый слайд
        this.showSlide(this.currentSlide);
        
        // Автопрокрутка
        this.startAutoSlide();
    }
    
    showSlide(index) {
        // Скрываем все слайды
        this.slides.forEach(slide => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });
        
        // Показываем текущий слайд
        if (this.slides[index]) {
            this.slides[index].style.display = 'block';
            this.slides[index].classList.add('active');
        }
        
        // Обновляем точки
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        this.currentSlide = index;
        console.log('Показан слайд:', index);
    }
    
    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        if (nextIndex >= this.slides.length) {
            nextIndex = 0;
        }
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = this.slides.length - 1;
        }
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
        }
    }
    
    startAutoSlide() {
        // Автопрокрутка каждые 5 секунд
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
}

// Форма заявки с РЕАЛЬНОЙ отправкой на Formspree
class SimpleContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.messageEl = document.getElementById('form-message');
        // ⬇⬇⬇ ВАША ССЫЛКА НА FORMSPREE ⬇⬇⬇
        this.formspreeUrl = 'https://formspree.io/f/mgownazv';
        // ⬆⬆⬆ ВАША ССЫЛКА НА FORMSPREE ⬆⬆⬆
        
        console.log('Форма найдена:', this.form ? 'да' : 'нет');
        console.log('Formspree URL:', this.formspreeUrl);
        
        if (this.form) {
            this.init();
            this.initPhoneMask();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        console.log('Форма инициализирована');
    }
    
    initPhoneMask() {
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) {
            console.log('Поле телефона не найдено');
            return;
        }
        
        console.log('Маска телефона инициализирована');
        
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
        console.log('Форма отправляется на Formspree...');
        
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Показываем загрузку
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;
        
        // Проверяем обязательные поля
        const requiredFields = this.form.querySelectorAll('[required]');
        let allValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#e53e3e';
                allValid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        
        if (!allValid) {
            this.showMessage('Пожалуйста, заполните все обязательные поля', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Проверка email
        const emailField = this.form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                this.showMessage('Введите корректный email адрес', 'error');
                emailField.style.borderColor = '#e53e3e';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
        }
        
        // Проверка телефона
        const phoneInput = document.getElementById('phone');
        if (phoneInput && phoneInput.value.trim() !== '') {
            const phoneNumbers = phoneInput.value.replace(/\D/g, '');
            if (phoneNumbers.length < 11) {
                this.showMessage('Номер телефона должен содержать 11 цифр', 'error');
                phoneInput.style.borderColor = '#e53e3e';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }
        }
        
        // РЕАЛЬНАЯ отправка через Formspree
        try {
            // Собираем данные формы
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Добавляем дополнительную информацию для Formspree
            data._subject = `Новая заявка с сайта Drupal Coder от ${data.name || 'пользователя'}`;
            data._replyto = data.email || '';
            data._format = 'plain';
            
            console.log('Отправка данных на Formspree:', data);
            
            const response = await fetch(this.formspreeUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const responseData = await response.json();
            
            if (response.ok && responseData.ok) {
                this.showMessage('✅ Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
                this.form.reset();
                console.log('Форма успешно отправлена на Formspree:', responseData);
            } else {
                throw new Error(responseData.error || 'Ошибка отправки формы');
            }
        } catch (error) {
            console.error('Ошибка отправки:', error);
            this.showMessage(`❌ Ошибка: ${error.message}. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.`, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showMessage(text, type) {
        console.log('Показ сообщения:', text);
        
        if (!this.messageEl) {
            // Создаем элемент сообщения если его нет
            const messageDiv = document.createElement('div');
            messageDiv.id = 'form-message';
            messageDiv.className = type;
            messageDiv.textContent = text;
            messageDiv.style.cssText = `
                margin: 20px 0;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                font-weight: 600;
                background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
                color: ${type === 'success' ? '#155724' : '#721c24'};
                border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
            `;
            
            // Вставляем перед формой
            this.form.parentNode.insertBefore(messageDiv, this.form.nextSibling);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
            return;
        }
        
        this.messageEl.textContent = text;
        this.messageEl.className = type;
        this.messageEl.style.display = 'block';
        
        // Прокручиваем к сообщению
        setTimeout(() => {
            this.messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        setTimeout(() => {
            this.messageEl.style.display = 'none';
        }, 5000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== ДОМ ЗАГРУЖЕН ===');
    console.log('Начинаем инициализацию...');
    
    // 1. Инициализируем слайдер
    console.log('1. Инициализация слайдера...');
    const slider = new SimpleSlider();
    
    // 2. Инициализируем форму
    console.log('2. Инициализация формы...');
    const contactForm = new SimpleContactForm();
    
    // 3. Закрываем мобильное меню при клике на ссылку
    console.log('3. Настройка мобильного меню...');
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // 4. Плавная прокрутка
    console.log('4. Настройка плавной прокрутки...');
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
    
    // 5. Проверка видео
    console.log('5. Проверка видео...');
    const video = document.querySelector('.video-background');
    if (video) {
        video.addEventListener('error', () => {
            console.log('Видео не загружено, используем градиент');
            video.style.display = 'none';
            document.querySelector('.header').style.background = 
                'linear-gradient(135deg, var(--primary-dark), var(--secondary))';
        });
        
        // Отключаем звук
        video.volume = 0;
        video.muted = true;
    } else {
        console.log('Видео не найдено');
    }
    
    // 6. Анимация элементов при скролле
    console.log('6. Настройка анимаций...');
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
    
    console.log('=== ИНИЦИАЛИЗАЦИЯ ЗАВЕРШЕНА ===');
});

// Тестовые функции для проверки вручную
window.testSlider = {
    next: () => {
        const slider = document.querySelectorAll('.slide');
        let current = 0;
        slider.forEach((s, i) => {
            if (s.classList.contains('active')) current = i;
            s.style.display = 'none';
        });
        let next = (current + 1) % slider.length;
        slider[next].style.display = 'block';
        console.log('Вручную переключено на слайд:', next);
    },
    
    prev: () => {
        const slider = document.querySelectorAll('.slide');
        let current = 0;
        slider.forEach((s, i) => {
            if (s.classList.contains('active')) current = i;
            s.style.display = 'none';
        });
        let prev = current - 1;
        if (prev < 0) prev = slider.length - 1;
        slider[prev].style.display = 'block';
        console.log('Вручную переключено на слайд:', prev);
    },
    
    testForm: () => {
        const form = document.getElementById('contact-form');
        if (form) {
            form.dispatchEvent(new Event('submit'));
            console.log('Тест формы запущен');
        }
    }
};

// Добавляем стили для отладки (только в режиме разработки)
if (window.location.search.includes('debug')) {
    const debugStyles = document.createElement('style');
    debugStyles.textContent = `
        .debug-border {
            border: 2px solid red !important;
        }
        
        .debug-info {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 9999;
        }
    `;
    document.head.appendChild(debugStyles);
    
    // Добавляем панель отладки
    const debugPanel = document.createElement('div');
    debugPanel.className = 'debug-info';
    debugPanel.innerHTML = `
        <div>Слайдер: <span id="debug-slider-status">Загрузка...</span></div>
        <div>Форма: <span id="debug-form-status">Загрузка...</span></div>
        <button onclick="window.testSlider.next()">Тест: След. слайд</button>
        <button onclick="window.testSlider.prev()">Тест: Пред. слайд</button>
        <button onclick="window.testSlider.testForm()">Тест: Форма</button>
    `;
    document.body.appendChild(debugPanel);
    
    // Обновляем статус
    setTimeout(() => {
        const slides = document.querySelectorAll('.slide');
        const form = document.getElementById('contact-form');
        
        document.getElementById('debug-slider-status').textContent = 
            `${slides.length} слайдов найдено`;
        
        document.getElementById('debug-form-status').textContent = 
            form ? 'Форма найдена' : 'Форма не найдена';
    }, 1000);
    
    console.log('Режим отладки включен');
}

console.log('Скрипт полностью загружен и готов к работе!');
console.log('Formspree URL настроен: https://formspree.io/f/mgownazv');
