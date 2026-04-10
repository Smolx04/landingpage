// ============================================================
// SHIPPING FORM — AJAX SUBMISSION (XMLHttpRequest + Fetch)
// ============================================================

(function () {
    'use strict';

    // ── DOM References ─────────────────────────────────────────
    const form           = document.getElementById('shippingForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn      = form ? form.querySelector('.btn-submit')   : null;
    const btnText        = submitBtn ? submitBtn.querySelector('.btn-text')    : null;
    const btnLoading     = submitBtn ? submitBtn.querySelector('.btn-loading') : null;

    // ── AJAX Endpoint ──────────────────────────────────────────
    // Replace this URL with your real server / serverless endpoint.
    // The form will POST JSON data to this address.
    const AJAX_ENDPOINT = 'https://httpbin.org/post'; // demo endpoint (echoes the request)

    // ── Field Validators ───────────────────────────────────────
    const validators = {
        firstName:     v => v.trim().length >= 2  ? '' : 'First name must be at least 2 characters.',
        lastName:      v => v.trim().length >= 2  ? '' : 'Last name must be at least 2 characters.',
        fullName:      v => v.trim().split(' ').length >= 2 ? '' : 'Please enter your full name (first and last).',
        email:         v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.',
        phone:         v => v.trim().length >= 7  ? '' : 'Please enter a valid phone number.',
        addressLine1:  v => v.trim().length >= 5  ? '' : 'Address Line 1 must be at least 5 characters.',
        streetAddress: v => v.trim().length >= 5  ? '' : 'Street address must be at least 5 characters.',
        city:          v => v.trim().length >= 2  ? '' : 'City must be at least 2 characters.',
        state:         v => v.trim().length >= 2  ? '' : 'State / Region must be at least 2 characters.',
        zipCode:       v => v.trim().length >= 3  ? '' : 'ZIP / Postal Code must be at least 3 characters.',
        country:       v => v !== ''              ? '' : 'Please select a country.',
    };

    // ── UI Helpers ─────────────────────────────────────────────
    function setFieldState(fieldId, errorMsg) {
        const input = document.getElementById(fieldId);
        const err   = document.getElementById(fieldId + 'Error');
        if (!input) return;
        const hasValue = input.value.trim() !== '';
        input.classList.toggle('error', !!errorMsg);
        input.classList.toggle('valid', !errorMsg && hasValue);
        if (err) err.textContent = errorMsg || '';
    }

    function validateField(fieldId) {
        const input = document.getElementById(fieldId);
        if (!input || !validators[fieldId]) return true;
        const msg = validators[fieldId](input.value);
        setFieldState(fieldId, msg);
        return msg === '';
    }

    function validateAll() {
        return Object.keys(validators)
            .map(id => validateField(id))
            .every(Boolean);
    }

    function setLoading(isLoading) {
        if (!submitBtn) return;
        submitBtn.disabled = isLoading;
        if (btnText)    btnText.style.display    = isLoading ? 'none'   : 'inline';
        if (btnLoading) btnLoading.style.display = isLoading ? 'inline' : 'none';
    }

    function showSuccess() {
        if (form)           form.style.display           = 'none';
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function showAjaxError(message) {
        // Inject or update an AJAX error banner above the submit button
        let banner = document.getElementById('ajaxErrorBanner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'ajaxErrorBanner';
            banner.style.cssText = [
                'background:#fff5f5',
                'border:2px solid #e53e3e',
                'border-radius:8px',
                'color:#c53030',
                'font-size:.9rem',
                'font-weight:600',
                'margin-top:16px',
                'padding:14px 18px',
                'text-align:center'
            ].join(';');
            const actions = form.querySelector('.form-actions');
            if (actions) actions.insertAdjacentElement('beforebegin', banner);
        }
        banner.textContent = '\u26A0\uFE0F ' + message;
        banner.style.display = 'block';
    }

    function clearAjaxError() {
        const banner = document.getElementById('ajaxErrorBanner');
        if (banner) banner.style.display = 'none';
    }

    // ── Collect Form Data ──────────────────────────────────────
    function collectFormData() {
        return {
            firstName:     document.getElementById('firstName')?.value.trim()     || '',
            lastName:      document.getElementById('lastName')?.value.trim()      || '',
            fullName:      document.getElementById('fullName')?.value.trim()      || '',
            email:         document.getElementById('email')?.value.trim()         || '',
            phone:         document.getElementById('phone')?.value.trim()         || '',
            altPhone:      document.getElementById('altPhone')?.value.trim()      || '',
            addressLine1:  document.getElementById('addressLine1')?.value.trim()  || '',
            addressLine2:  document.getElementById('addressLine2')?.value.trim()  || '',
            streetAddress: document.getElementById('streetAddress')?.value.trim() || '',
            aptSuite:      document.getElementById('aptSuite')?.value.trim()      || '',
            city:          document.getElementById('city')?.value.trim()          || '',
            state:         document.getElementById('state')?.value.trim()         || '',
            zipCode:       document.getElementById('zipCode')?.value.trim()       || '',
            country:       document.getElementById('country')?.value              || '',
        };
    }

    // ── AJAX via XMLHttpRequest ────────────────────────────────
    function sendWithXHR(data) {
        return new Promise(function (resolve, reject) {
            const xhr = new XMLHttpRequest();

            xhr.open('POST', AJAX_ENDPOINT, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.timeout = 15000; // 15 s timeout

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== XMLHttpRequest.DONE) return;
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        resolve(JSON.parse(xhr.responseText));
                    } catch (e) {
                        resolve({ status: 'ok', raw: xhr.responseText });
                    }
                } else {
                    reject(new Error('Server returned status ' + xhr.status));
                }
            };

            xhr.onerror   = () => reject(new Error('Network error. Please check your connection.'));
            xhr.ontimeout = () => reject(new Error('Request timed out. Please try again.'));

            xhr.send(JSON.stringify(data));
        });
    }

    // ── AJAX via Fetch API (fallback / alternative) ────────────
    function sendWithFetch(data) {
        return fetch(AJAX_ENDPOINT, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept':       'application/json',
            },
            body: JSON.stringify(data),
        }).then(function (res) {
            if (!res.ok) throw new Error('Server returned status ' + res.status);
            return res.json();
        });
    }

    // ── Choose transport: XHR first, Fetch as fallback ─────────
    function sendAjax(data) {
        if (typeof XMLHttpRequest !== 'undefined') {
            return sendWithXHR(data);
        } else if (typeof fetch !== 'undefined') {
            return sendWithFetch(data);
        } else {
            return Promise.reject(new Error('No AJAX transport available in this browser.'));
        }
    }

    // ── Real-time Validation Listeners ─────────────────────────
    Object.keys(validators).forEach(function (fieldId) {
        const input = document.getElementById(fieldId);
        if (!input) return;
        input.addEventListener('blur',  () => validateField(fieldId));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) validateField(fieldId);
        });
    });

    // ── Auto-fill Full Name ────────────────────────────────────
    const firstNameEl = document.getElementById('firstName');
    const lastNameEl  = document.getElementById('lastName');
    const fullNameEl  = document.getElementById('fullName');

    function syncFullName() {
        if (!fullNameEl) return;
        const first = firstNameEl ? firstNameEl.value.trim() : '';
        const last  = lastNameEl  ? lastNameEl.value.trim()  : '';
        if (first || last) {
            fullNameEl.value = [first, last].filter(Boolean).join(' ');
            if (fullNameEl.classList.contains('error')) validateField('fullName');
        }
    }

    if (firstNameEl) firstNameEl.addEventListener('input', syncFullName);
    if (lastNameEl)  lastNameEl.addEventListener('input',  syncFullName);

    // ── Form Submit Handler ────────────────────────────────────
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearAjaxError();

            // 1. Client-side validation
            if (!validateAll()) {
                const firstErrorEl = form.querySelector('.error');
                if (firstErrorEl) {
                    firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstErrorEl.focus();
                }
                return;
            }

            // 2. Collect data
            const payload = collectFormData();

            // 3. Show loading state
            setLoading(true);

            // 4. Send AJAX request
            sendAjax(payload)
                .then(function (response) {
                    console.log('[ShippingForm] AJAX success:', response);
                    setLoading(false);
                    showSuccess();
                })
                .catch(function (err) {
                    console.error('[ShippingForm] AJAX error:', err);
                    setLoading(false);
                    showAjaxError(err.message || 'Something went wrong. Please try again.');
                });
        });
    }

    // ── Reset / Submit Another ─────────────────────────────────
    window.resetForm = function () {
        if (!form) return;
        form.reset();
        form.style.display = 'block';
        if (successMessage) successMessage.style.display = 'none';

        // Clear all validation classes & messages
        form.querySelectorAll('input, select').forEach(function (el) {
            el.classList.remove('error', 'valid');
        });
        form.querySelectorAll('.error-msg').forEach(function (el) {
            el.textContent = '';
        });

        clearAjaxError();
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

})(); // end IIFE
