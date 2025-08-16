// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.isSubmitting = false;
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupInteractiveElements();
        this.initFAQ();
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
            
            // Enhanced focus effects
            input.addEventListener('focus', () => {
                const formGroup = input.closest('.form-group');
                formGroup.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                const formGroup = input.closest('.form-group');
                if (!input.value) {
                    formGroup.classList.remove('focused');
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Validation rules
        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'subject':
                if (!value) {
                    errorMessage = 'Please select a subject';
                    isValid = false;
                }
                break;
                
            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
        
        // Animate error message
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            errorElement.style.opacity = '1';
            errorElement.style.transform = 'translateY(0)';
        }, 10);
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.isSubmitting) return;
            
            // Validate all fields
            const inputs = this.form.querySelectorAll('input, select, textarea');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                this.showNotification('Please fix the errors above', 'error');
                return;
            }
            
            await this.submitForm();
        });
    }

    async submitForm() {
        this.isSubmitting = true;
        const submitButton = this.form.querySelector('.btn-submit');
        const buttonText = submitButton.querySelector('.btn-text');
        const buttonLoading = submitButton.querySelector('.btn-loading');
        
        // Show loading state
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'flex';
        submitButton.disabled = true;
        
        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateFormSubmission();
            
            // Success
            this.showSuccessMessage();
            this.form.reset();
            
            // Clear focused states
            const formGroups = this.form.querySelectorAll('.form-group');
            formGroups.forEach(group => group.classList.remove('focused'));
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            buttonText.style.display = 'block';
            buttonLoading.style.display = 'none';
            submitButton.disabled = false;
            this.isSubmitting = false;
        }
    }

    async simulateFormSubmission() {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
        `;
        
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--card-bg);
            padding: 2rem;
            border-radius: var(--border-radius-lg);
            box-shadow: 0 20px 60px var(--shadow);
            text-align: center;
            z-index: 10000;
            max-width: 400px;
            width: 90%;
            opacity: 0;
            scale: 0.8;
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(successMessage);
        
        // Animate in
        setTimeout(() => {
            successMessage.style.opacity = '1';
            successMessage.style.scale = '1';
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.scale = '0.8';
            setTimeout(() => {
                successMessage.remove();
            }, 300);
        }, 4000);
    }

    showNotification(message, type = 'info') {
        if (window.app) {
            window.app.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    setupInteractiveElements() {
        // Enhanced contact method hover effects
        const contactMethods = document.querySelectorAll('.contact-method');
        
        contactMethods.forEach(method => {
            method.addEventListener('mouseenter', () => {
                method.style.transform = 'translateY(-5px) scale(1.02)';
                method.style.boxShadow = '0 15px 40px var(--shadow)';
            });
            
            method.addEventListener('mouseleave', () => {
                method.style.transform = '';
                method.style.boxShadow = '';
            });
        });

        // Developer card animation
        const developerCard = document.querySelector('.developer-card');
        if (developerCard) {
            developerCard.addEventListener('mouseenter', () => {
                const avatar = developerCard.querySelector('.developer-avatar img');
                if (avatar) {
                    avatar.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            developerCard.addEventListener('mouseleave', () => {
                const avatar = developerCard.querySelector('.developer-avatar img');
                if (avatar) {
                    avatar.style.transform = '';
                }
            });
        }
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = question.querySelector('i');
            
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        const otherIcon = otherItem.querySelector('.faq-question i');
                        otherAnswer.style.maxHeight = '0';
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('open');
                    answer.style.maxHeight = '0';
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }
}

// Enhanced form styles
const contactStyles = document.createElement('style');
contactStyles.textContent = `
    .form-group {
        position: relative;
        margin-bottom: 2rem;
    }
    
    .form-group label {
        position: absolute;
        top: 1rem;
        left: 1rem;
        color: var(--text-secondary);
        transition: all 0.3s ease;
        pointer-events: none;
        font-weight: 500;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 1rem;
        background: var(--secondary-bg);
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        color: var(--text-color);
        font-size: 1rem;
        transition: all 0.3s ease;
        resize: vertical;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--accent-color);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .form-group.focused label,
    .form-group input:focus + label,
    .form-group select:focus + label,
    .form-group textarea:focus + label {
        top: -0.5rem;
        left: 0.75rem;
        font-size: 0.875rem;
        color: var(--accent-color);
        background: var(--card-bg);
        padding: 0 0.5rem;
    }
    
    .form-group input:not(:placeholder-shown) + label,
    .form-group select:not(:placeholder-shown) + label,
    .form-group textarea:not(:placeholder-shown) + label {
        top: -0.5rem;
        left: 0.75rem;
        font-size: 0.875rem;
        background: var(--card-bg);
        padding: 0 0.5rem;
    }
    
    .form-line {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--gradient-primary);
        transition: width 0.3s ease;
    }
    
    .form-group input:focus ~ .form-line,
    .form-group select:focus ~ .form-line,
    .form-group textarea:focus ~ .form-line {
        width: 100%;
    }
    
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        transition: all 0.3s ease;
    }
    
    .btn-submit {
        position: relative;
        overflow: hidden;
    }
    
    .btn-loading {
        display: none;
        align-items: center;
        gap: 0.5rem;
    }
    
    .success-message .success-icon {
        font-size: 3rem;
        color: #10b981;
        margin-bottom: 1rem;
    }
    
    .success-message h3 {
        color: var(--text-color);
        margin-bottom: 0.5rem;
    }
    
    .success-message p {
        color: var(--text-secondary);
    }
    
    .faq-item {
        background: var(--card-bg);
        border-radius: var(--border-radius);
        margin-bottom: 1rem;
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    .faq-question {
        padding: 1.5rem;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease;
    }
    
    .faq-question:hover {
        background: var(--secondary-bg);
    }
    
    .faq-question h4 {
        margin: 0;
        color: var(--text-color);
    }
    
    .faq-question i {
        color: var(--accent-color);
        transition: transform 0.3s ease;
    }
    
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }
    
    .faq-answer p {
        padding: 0 1.5rem 1.5rem;
        margin: 0;
        color: var(--text-secondary);
    }
    
    .contact-method {
        transition: all 0.3s ease;
    }
    
    .developer-avatar img {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(contactStyles);

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.contactForm = new ContactForm();
});