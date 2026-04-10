// ===========================
// SHIPPING FORM VALIDATION & HANDLER
// ===========================

const form = document.getElementById('shippingForm');
const successMessage = document.getElementById('successMessage');

// --- Validation Rules ---
const validators = {
    firstName:    val => val.trim().length >= 2 ? '' : 'First name must be at least 2 characters.',
    lastName:     val => val.trim().length >= 2 ? '' : 'Last name must be at least 2 characters.',
    fullName:     val => val.trim().split(' ').length >= 2 ? '' : 'Please enter your full name (first and last).',
    email:        val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) ? '' : 'Please enter a valid email address.',
    phone:        val => val.trim().length >= 7 ? '' : 'Please enter a valid phone number.',
    addressLine1: val => val.trim().length >= 5 ? '' : 'Address Line 1 must be at least 5 characters.',
    streetAddress:val => val.trim().length >= 5 ? '' : 'Street address must be at least 5 characters.',
    city:         val => val.trim().length >= 2 ? '' : 'City must be at least 2 characters.',
    state:        val => val.trim().length >= 2 ? '' : 'State / Region must be at least 2 characters.',
    zipCode:      val => val.trim().length >= 3 ? '' : 'ZIP / Postal Code must be at least 3 characters.',
    country:      val => val !== '' ? '' : 'Please select a country.',
};

// --- Show / Clear field error ---
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    if (input) {
        input.classList.toggle('error', !!message);
        input.classList.toggle('valid', !message && input.value.trim() !== '');
    }
    if (errorEl) errorEl.textContent = message;
}

// --- Validate a single field ---
function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input || !validators[fieldId]) return true;
    const error = validators[fieldId](input.value);
    showError(fieldId, error);
    return error === '';
}

// --- Real-time validation on blur ---
Object.keys(validators).forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input) {
        input.addEventListener('blur', () => validateField(fieldId));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) validateField(fieldId);
        });
    }
});

// --- Auto-fill Full Name from First + Last ---
const firstNameInput = document.getElementById('firstName');
const lastNameInput  = document.getElementById('lastName');
const fullNameInput  = document.getElementById('fullName');

function updateFullName() {
    const first = firstNameInput.value.trim();
    const last  = lastNameInput.value.trim();
    if (first || last) {
        fullNameInput.value = [first, last].filter(Boolean).join(' ');
        if (fullNameInput.classList.contains('error')) validateField('fullName');
    }
}

if (firstNameInput) firstNameInput.addEventListener('input', updateFullName);
if (lastNameInput)  lastNameInput.addEventListener('input', updateFullName);

// --- Form Submission ---
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all required fields
        let isValid = true;
        Object.keys(validators).forEach(fieldId => {
            if (!validateField(fieldId)) isValid = false;
        });

        if (!isValid) {
            // Scroll to the first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.btn-submit');
        const btnText    = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';

        // Simulate processing delay then show success
        setTimeout(() => {
            form.style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1200);
    });
}

// --- Reset / Submit Another ---
function resetForm() {
    form.reset();
    form.style.display = 'block';
    successMessage.style.display = 'none';

    // Clear all validation states
    form.querySelectorAll('input, select').forEach(el => {
        el.classList.remove('error', 'valid');
    });
    form.querySelectorAll('.error-msg').forEach(el => {
        el.textContent = '';
    });

    // Re-enable submit button
    const submitBtn = form.querySelector('.btn-submit');
    if (submitBtn) {
        submitBtn.disabled = false;
        const btnText    = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        if (btnText)    btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
