// ===== JOB APPLICATION PAGE FUNCTIONALITY =====

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeJobApplication();
});

function initializeJobApplication() {
    // Initialize file upload functionality
    initFileUpload();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize form submission
    initFormSubmission();
    
    // Initialize analytics tracking
    initJobApplicationAnalytics();
    
    // Initialize accessibility features
    initAccessibilityFeatures();
}

// ===== FILE UPLOAD FUNCTIONALITY =====
function initFileUpload() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('resume');
    const fileInfo = document.getElementById('fileInfo');

    if (!fileUploadArea || !fileInput || !fileInfo) {
        console.warn('File upload elements not found');
        return;
    }

    // Handle drag and drop events
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleDrop);
    
    // Handle file selection via click
    fileInput.addEventListener('change', handleFileSelect);
    
    // Handle click on upload area
    fileUploadArea.addEventListener('click', function(e) {
        if (e.target === fileUploadArea || e.target.closest('.file-upload-content')) {
            fileInput.click();
        }
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const fileUploadArea = e.currentTarget;
    const fileInput = document.getElementById('resume');
    
    fileUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        // Create a new FileList object and assign it to the input
        const dt = new DataTransfer();
        dt.items.add(files[0]);
        fileInput.files = dt.files;
        
        handleFileSelection(files[0]);
    }
}

function handleFileSelect(e) {
    if (e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
    }
}

function handleFileSelection(file) {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileInput = document.getElementById('resume');
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        showFileError('File size must be less than 5MB. Please choose a smaller file.');
        clearFileSelection();
        return false;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        showFileError('Please upload a PDF, DOC, or DOCX file only.');
        clearFileSelection();
        return false;
    }

    // File is valid, show success state
    showFileSuccess(file);
    return true;
}

function showFileSuccess(file) {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInfo = document.getElementById('fileInfo');
    
    fileUploadArea.classList.add('file-selected');
    fileInfo.style.display = 'block';
    fileInfo.innerHTML = `
        <div class="file-name">
            <span>📄 ${file.name}</span>
            <span style="color: #6C757D; font-size: 0.8rem;">(${formatFileSize(file.size)})</span>
            <button type="button" class="remove-file" onclick="removeFile()" title="Remove file">×</button>
        </div>
    `;
    
    // Update upload area content
    const uploadContent = fileUploadArea.querySelector('.file-upload-content');
    uploadContent.innerHTML = `
        <div class="file-upload-icon" style="color: #48BB78;">✓</div>
        <div class="file-upload-text" style="color: #48BB78;">File uploaded successfully!</div>
        <div class="file-upload-hint">Click to choose a different file</div>
    `;
    
    // Track file upload event
    trackEvent('file_uploaded', {
        file_type: file.type,
        file_size: file.size,
        file_name: file.name
    });
}

function showFileError(message) {
    const fileUploadArea = document.getElementById('fileUploadArea');
    
    // Show error message
    showNotification(message, 'error');
    
    // Add error styling temporarily
    fileUploadArea.style.borderColor = '#F56565';
    fileUploadArea.style.background = '#FED7D7';
    
    setTimeout(() => {
        fileUploadArea.style.borderColor = '#38B2AC';
        fileUploadArea.style.background = '#F7FAFC';
    }, 3000);
}

function clearFileSelection() {
    const fileInput = document.getElementById('resume');
    fileInput.value = '';
}

function removeFile() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileInput = document.getElementById('resume');
    
    // Clear file input
    fileInput.value = '';
    
    // Reset upload area
    fileUploadArea.classList.remove('file-selected');
    fileInfo.style.display = 'none';
    
    // Reset upload area content
    const uploadContent = fileUploadArea.querySelector('.file-upload-content');
    uploadContent.innerHTML = `
        <div class="file-upload-icon">📄</div>
        <div class="file-upload-text">Click to upload or drag and drop</div>
        <div class="file-upload-hint">PDF, DOC, or DOCX (max 5MB)</div>
    `;
    
    // Track file removal
    trackEvent('file_removed');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const formInputs = document.querySelectorAll('#jobApplicationForm input, #jobApplicationForm select, #jobApplicationForm textarea');
    
    formInputs.forEach(input => {
        // Real-time validation on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear validation styling on focus
        input.addEventListener('focus', function() {
            clearFieldValidation(this);
        });
        
        // Special validation for specific fields
        if (input.type === 'email') {
            input.addEventListener('input', debounce(function() {
                if (this.value) validateEmail(this);
            }, 500));
        }
        
        if (input.type === 'url') {
            input.addEventListener('input', debounce(function() {
                if (this.value) validateURL(this);
            }, 500));
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    // URL validation
    else if (field.type === 'url' && value && !isValidURL(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid URL (e.g., https://example.com)';
    }
    
    // Phone validation (basic)
    else if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    // Apply validation styling
    if (isValid) {
        setFieldValid(field);
    } else {
        setFieldInvalid(field, errorMessage);
    }
    
    return isValid;
}

function setFieldValid(field) {
    field.style.borderColor = '#48BB78';
    field.style.background = '#F0FFF4';
    removeFieldError(field);
}

function setFieldInvalid(field, message) {
    field.style.borderColor = '#F56565';
    field.style.background = '#FED7D7';
    showFieldError(field, message);
}

function clearFieldValidation(field) {
    field.style.borderColor = '#38B2AC';
    field.style.background = 'white';
    removeFieldError(field);
}

function showFieldError(field, message) {
    removeFieldError(field); // Remove existing error
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.color = '#F56565';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.3rem';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Validation helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidURL(url) {
    try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
    } catch {
        return false;
    }
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 7;
}

function validateEmail(field) {
    if (isValidEmail(field.value)) {
        setFieldValid(field);
    } else {
        setFieldInvalid(field, 'Please enter a valid email address');
    }
}

function validateURL(field) {
    if (isValidURL(field.value)) {
        setFieldValid(field);
    } else {
        setFieldInvalid(field, 'Please enter a valid URL (e.g., https://example.com)');
    }
}

// ===== FORM SUBMISSION =====
function initFormSubmission() {
    const form = document.getElementById('jobApplicationForm');
    
    if (!form) {
        console.warn('Job application form not found');
        return;
    }
    
    form.addEventListener('submit', handleFormSubmission);
}

function handleFormSubmission(e) {
    const form = e.target;
    const submitButton = form.querySelector('.form-submit');
    
    // Validate all fields before submission
    const formInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let allValid = true;
    
    formInputs.forEach(input => {
        if (!validateField(input)) {
            allValid = false;
        }
    });
    
    // Check if resume file is uploaded
    const resumeInput = document.getElementById('resume');
    if (!resumeInput.files.length) {
        showNotification('Please upload your resume before submitting', 'error');
        allValid = false;
    }
    
    if (!allValid) {
        e.preventDefault();
        showNotification('Please fix the errors above before submitting', 'error');
        return;
    }
    
    // Show loading state
    setSubmissionLoading(submitButton, true);
    
    // Track form submission
    trackEvent('job_application_submitted', {
        position: form.querySelector('input[name="position"]').value,
        experience: form.querySelector('select[name="experience"]').value,
        state_management: form.querySelector('select[name="stateManagement"]').value,
        platforms: form.querySelector('select[name="platforms"]').value
    });
    
    // Let Formspree handle the actual submission
    // The loading state will be visible during submission
    
    // Show success message after a delay (assuming successful submission)
    setTimeout(() => {
        if (form.querySelector('.form-submit.loading')) {
            showSuccessMessage();
        }
    }, 3000);
}

function setSubmissionLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
        button.querySelector('.submit-text').style.display = 'none';
        button.querySelector('.submit-loading').style.display = 'inline';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        button.querySelector('.submit-text').style.display = 'inline';
        button.querySelector('.submit-loading').style.display = 'none';
    }
}

function showSuccessMessage() {
    const applicationCard = document.querySelector('.application-card');
    
    applicationCard.innerHTML = `
        <div class="form-success">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <h3>Application Submitted Successfully!</h3>
            <p>Thank you for your interest in joining our team. We've received your application and will review it carefully.</p>
            <p>You can expect to hear from us within <strong>3-5 business days</strong>.</p>
            <div style="margin-top: 2rem;">
                <a href="index.html#careers" class="btn-secondary">Back to Careers</a>
                <a href="index.html" class="btn-primary" style="margin-left: 1rem;">Go Home</a>
            </div>
        </div>
    `;
    
    // Scroll to success message
    applicationCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== ANALYTICS TRACKING =====
function initJobApplicationAnalytics() {
    // Track page view
    trackEvent('job_page_viewed', {
        position: getJobPosition(),
        page_url: window.location.href
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', debounce(() => {
        const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            if (scrollDepth === 100) {
                trackEvent('job_page_fully_read', { position: getJobPosition() });
            }
        }
    }, 1000));
    
    // Track time spent on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('job_page_time_spent', {
            position: getJobPosition(),
            time_seconds: timeSpent
        });
    });
}

function getJobPosition() {
    const positionInput = document.querySelector('input[name="position"]');
    return positionInput ? positionInput.value : 'Unknown';
}

// ===== ACCESSIBILITY FEATURES =====
function initAccessibilityFeatures() {
    // Keyboard navigation for file upload
    const fileUploadArea = document.getElementById('fileUploadArea');
    if (fileUploadArea) {
        fileUploadArea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById('resume').click();
            }
        });
        
        // Make file upload area focusable
        fileUploadArea.setAttribute('tabindex', '0');
        fileUploadArea.setAttribute('role', 'button');
        fileUploadArea.setAttribute('aria-label', 'Upload resume file');
    }
    
    // Announce form validation errors to screen readers
    const originalShowFieldError = showFieldError;
    showFieldError = function(field, message) {
        originalShowFieldError(field, message);
        
        // Create ARIA live region for screen readers
        announceToScreenReader(message);
    };
    
    // Enhanced keyboard navigation
    const formElements = document.querySelectorAll('#jobApplicationForm input, #jobApplicationForm select, #jobApplicationForm textarea, #jobApplicationForm button');
    formElements.forEach((element, index) => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && element.type !== 'textarea' && element.type !== 'submit') {
                e.preventDefault();
                const nextElement = formElements[index + 1];
                if (nextElement) {
                    nextElement.focus();
                }
            }
        });
    });
}

function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#48BB78';
            break;
        case 'error':
            notification.style.background = '#F56565';
            break;
        case 'warning':
            notification.style.background = '#ED8936';
            break;
        default:
            notification.style.background = '#38B2AC';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Add click to dismiss
    notification.addEventListener('click', () => {
        notification.remove();
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function trackEvent(eventName, properties = {}) {
    // Enhanced analytics tracking
    console.log('Job Application Event:', eventName, properties);
    
    // Example for Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'job_application',
            ...properties
        });
    }
    
    // Example for other analytics services
    if (typeof analytics !== 'undefined') {
        analytics.track(eventName, properties);
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Job Application Page Error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Job Application Page Promise Rejection:', e.reason);
    trackEvent('promise_rejection', {
        reason: e.reason.toString()
    });
});

// ===== CSS ANIMATIONS (Added via JavaScript) =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);