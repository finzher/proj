// Мобильное меню
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
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
            dropdownMenu.style.transform = 'translateY(-10px)';
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
        
        // Автопрокрутка каждые 5 секунд
        this.interval = setInterval(() => this.nextSlide(), 5000);
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

// Форма с ВАШИМ Formspree URL и валидацией телефона
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.messageEl = document.getElementById('form-message');
        
        if (this.form) {
            // ВАШ Formspree URL
            this.formspreeUrl = 'https://formspree.io/f/meejqlzw';
            this.init();
            
            // Инициализация маски для телефона
            this.initPhoneMask();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    // МАСКА ДЛЯ ТЕЛЕФОНА - запрещает буквы и форматирует номер
    initPhoneMask() {
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) return;
        
        // Обработчик ввода - форматирование в реальном времени
        phoneInput.addEventListener('input', function(e) {
            // Удаляем всё кроме цифр
            let numbers = this.value.replace(/\D/g, '');
            
            // Ограничиваем длину (11 цифр: 7 + 10)
            if (numbers.length > 11) {
                numbers = numbers.substring(0, 11);
            }
            
            // Форматируем номер
            let formatted = '';
            if (numbers.length > 0) {
                // Если первая цифра 7 или 8, считаем это кодом страны
                if (numbers.startsWith('7') || numbers.startsWith('8')) {
                    formatted = '+7';
                    if (numbers.length > 1) formatted += ' (' + numbers.substring(1, 4);
                    if (numbers.length >= 4) formatted += ') ' + numbers.substring(4, 7);
                    if (numbers.length >= 7) formatted += '-' + numbers.substring(7, 9);
                    if (numbers.length >= 9) formatted += '-' + numbers.substring(9, 11);
                } else {
                    // Иначе форматируем как российский номер без кода страны
                    formatted = '+7 (' + numbers.substring(0, 3);
                    if (numbers.length >= 3) formatted += ') ' + numbers.substring(3, 6);
                    if (numbers.length >= 6) formatted += '-' + numbers.substring(6, 8);
                    if (numbers.length >= 8) formatted += '-' + numbers.substring(8, 10);
                }
            }
            
            this.value = formatted;
        });
        
        // Запрещаем ввод букв через клавиатуру
        phoneInput.addEventListener('keypress', function(e) {
            // Разрешаем только цифры, Backspace, Delete, Tab, стрелки
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
            
            if (allowedKeys.includes(e.key)) {
                return; // Разрешаем служебные клавиши
            }
            
            // Разрешаем только цифры
            if (!/\d/.test(e.key)) {
                e.preventDefault();
            }
        });
        
        // Обработчик вставки из буфера обмена
        phoneInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = e.clipboardData.getData('text');
            const numbers = pastedText.replace(/\D/g, '').substring(0, 11);
            
            // Устанавливаем значение и триггерим событие input для форматирования
            this.value = numbers;
            this.dispatchEvent(new Event('input'));
        });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Показываем загрузку
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Валидация телефона (если заполнен)
        const phoneInput = document.getElementById('phone');
        if (phoneInput && phoneInput.value.trim() !== '') {
            const phoneNumbers = phoneInput.value.replace(/\D/g, '');
            // Должно быть 10 или 11 цифр (11 если начинается с 7 или 8)
            if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
                this.showMessage('Номер телефона должен содержать 10-11 цифр', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
            
            // Если 11 цифр, проверяем что начинается с 7 или 8
            if (phoneNumbers.length === 11 && !(phoneNumbers.startsWith('7') || phoneNumbers.startsWith('8'))) {
                this.showMessage('Неверный формат номера телефона', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                return;
            }
        }
        
        // Собираем данные формы
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
                this.showMessage('Форма успешно отправлена!', 'success');
                this.form.reset();
            } else {
                throw new Error('Ошибка отправки формы');
            }
        } catch (error) {
            this.showMessage(`Ошибка: ${error.message}. Попробуйте еще раз.`, 'error');
        } finally {
            // Возвращаем кнопку в исходное состояние
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    showMessage(text, type) {
        if (this.messageEl) {
            this.messageEl.textContent = text;
            this.messageEl.className = type;
            this.messageEl.style.display = 'block';
            
            // Скрываем сообщение через 5 секунд
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
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Проверка загрузки видео
    const video = document.querySelector('.video-background');
    if (video) {
        video.addEventListener('error', () => {
            console.log('Видео не загрузилось, используем фоновый градиент');
            video.style.display = 'none';
            document.querySelector('.header').style.background = 
                'linear-gradient(135deg, #3498db, #2c3e50)';
        });
    }
});

// ... предыдущий код для меню и слайдера остается без изменений ...

// Обновленный класс Form для выставки
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.messageEl = document.getElementById('form-message');
        
        if (this.form) {
            this.formspreeUrl = 'https://formspree.io/f/meejqlzw';
            this.init();
            this.initPhoneMask();
            this.initTicketSelection();
            this.initDateRestrictions();
            this.calculateTotal();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Обновляем итоговую цену при изменении
        document.getElementById('quantity')?.addEventListener('change', () => this.calculateTotal());
        document.getElementById('ticket-type')?.addEventListener('change', () => this.calculateTotal());
    }
    
    // Инициализация выбора билетов
    initTicketSelection() {
        const ticketOptions = document.querySelectorAll('.ticket-option');
        const ticketTypeSelect = document.getElementById('ticket-type');
        
        ticketOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Убираем активный класс у всех
                ticketOptions.forEach(opt => opt.classList.remove('active'));
                // Добавляем активный класс выбранному
                option.classList.add('active');
                
                // Обновляем select
                const ticketType = option.querySelector('h4').textContent.toLowerCase();
                const price = option.dataset.price;
                
                if (ticketType.includes('стандартный')) {
                    ticketTypeSelect.value = 'standard';
                } else if (ticketType.includes('расширенный')) {
                    ticketTypeSelect.value = 'extended';
                } else if (ticketType.includes('vip')) {
                    ticketTypeSelect.value = 'vip';
                }
                
                this.calculateTotal();
            });
        });
    }
    
    // Ограничение дат (15-30 декабря 2024)
    initDateRestrictions() {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            // Устанавливаем минимальную и максимальную даты
            dateInput.min = '2024-12-15';
            dateInput.max = '2024-12-30';
            
            // Устанавливаем сегодняшнюю дату или ближайшую доступную
            const today = new Date().toISOString().split('T')[0];
            if (today >= '2024-12-15' && today <= '2024-12-30') {
                dateInput.value = today;
            } else {
                dateInput.value = '2024-12-15';
            }
        }
    }
    
    // Расчет итоговой стоимости
    calculateTotal() {
        const quantity = parseInt(document.getElementById('quantity')?.value || 1);
        const ticketType = document.getElementById('ticket-type')?.value;
        
        let pricePerTicket = 500; // Стандартный по умолчанию
        
        if (ticketType === 'extended') {
            pricePerTicket = 800;
        } else if (ticketType === 'vip') {
            pricePerTicket = 1200;
        }
        
        const total = quantity * pricePerTicket;
        const totalPriceEl = document.getElementById('total-price');
        if (totalPriceEl) {
            totalPriceEl.textContent = total + '₽';
        }
    }
    
    // ... остальные методы (initPhoneMask, handleSubmit, showMessage) остаются без изменений ...
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new Slider();
    new ContactForm();
    
    // ... остальной код инициализации ...
});
