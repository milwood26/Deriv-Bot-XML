// Flex Property Solutions - Form Handling & CRM Integration

document.addEventListener('DOMContentLoaded', function() {
    const leadForm = document.getElementById('leadForm');
    
    if (leadForm) {
        leadForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Auto-detect lead source from URL parameters
    function getLeadSourceFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');
        const utmMedium = urlParams.get('utm_medium');
        const utmCampaign = urlParams.get('utm_campaign');
        const referrer = document.referrer;
        
        let source = 'direct';
        
        if (utmSource) {
            if (utmSource.includes('google')) {
                source = utmMedium === 'cpc' ? 'google-ads' : 'google-organic';
            } else if (utmSource.includes('facebook') || utmSource.includes('fb')) {
                source = 'social-media';
            } else if (utmSource.includes('checkatrade')) {
                source = 'checkatrade';
            }
        } else if (referrer) {
            if (referrer.includes('google')) {
                source = 'google-organic';
            } else if (referrer.includes('checkatrade')) {
                source = 'checkatrade';
            } else if (referrer.includes('facebook')) {
                source = 'social-media';
            }
        }
        
        return source;
    }
    
    // Set lead source field automatically
    const leadSourceField = document.getElementById('lead-source');
    if (leadSourceField && !leadSourceField.value) {
        const detectedSource = getLeadSourceFromURL();
        leadSourceField.value = detectedSource;
    }
    
    // Pre-fill service type from page context
    function prefillServiceType() {
        const form = document.getElementById('leadForm');
        if (!form) return;
        
        const pagePath = window.location.pathname;
        const serviceSelect = form.querySelector('select[name="service"]');
        
        if (pagePath.includes('fire-alarm')) {
            serviceSelect.value = 'fire-alarm';
        } else if (pagePath.includes('emergency-lighting')) {
            serviceSelect.value = 'emergency-lighting';
        } else if (pagePath.includes('testing') || pagePath.includes('certification')) {
            serviceSelect.value = 'testing-certification';
        } else if (pagePath.includes('bathroom')) {
            serviceSelect.value = 'bathroom-fitting';
        } else if (pagePath.includes('plumbing')) {
            serviceSelect.value = 'plumbing';
        } else if (pagePath.includes('property-maintenance') || pagePath.includes('maintenance')) {
            serviceSelect.value = 'property-maintenance';
        }
    }
    
    prefillServiceType();
    
    // Form submission handler
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const messageDiv = document.getElementById('formMessage');
        
        // Disable button during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Add additional metadata
        data.timestamp = new Date().toISOString();
        data.url = window.location.href;
        data.pageTitle = document.title;
        data.userAgent = navigator.userAgent;
        data.lead_source = data.lead_source || getLeadSourceFromURL();
        
        // GDPR consent
        data.gdpr_consent = form.querySelector('input[name="gdpr_consent"]')?.checked || false;
        
        try {
            // Send to CRM backend
            const response = await submitToCRM(data);
            
            if (response.success) {
                // Show success message
                messageDiv.className = 'form-message success';
                messageDiv.innerHTML = `
                    <strong><i class="fas fa-check-circle"></i> Thank you!</strong><br>
                    Your quote request has been received. We'll contact you within 24 hours.
                `;
                
                // Reset form
                form.reset();
                
                // Track conversion in analytics
                trackConversion('lead_submitted', {
                    service: data.service,
                    source: data.lead_source
                });
                
                // Send auto-responder email notification (via backend)
                // This is handled server-side
                
            } else {
                throw new Error(response.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show error message
            messageDiv.className = 'form-message error';
            messageDiv.innerHTML = `
                <strong><i class="fas fa-exclamation-circle"></i> Error</strong><br>
                ${error.message || 'Failed to submit form. Please call us directly: 07849 183139'}
            `;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Request Free Quote';
            
            // Clear message after 10 seconds
            setTimeout(() => {
                messageDiv.className = 'form-message';
                messageDiv.style.display = 'none';
            }, 10000);
        }
    }
    
    // Submit to CRM backend
    async function submitToCRM(data) {
        // In production, this would be your actual CRM API endpoint
        const CRM_ENDPOINT = 'admin/api/leads.php';
        
        try {
            const response = await fetch(CRM_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                const result = await response.json();
                return result;
            } else {
                // If CRM endpoint doesn't exist yet, simulate success for demo
                console.log('CRM endpoint not available, simulating success...');
                return { success: true, message: 'Lead captured (demo mode)' };
            }
        } catch (error) {
            // Fallback: store in localStorage for later sync
            storeLeadLocally(data);
            return { success: true, message: 'Lead stored locally (will sync when online)' };
        }
    }
    
    // Store lead locally if offline
    function storeLeadLocally(data) {
        const leads = JSON.parse(localStorage.getItem('pending_leads') || '[]');
        leads.push(data);
        localStorage.setItem('pending_leads', JSON.stringify(leads));
        console.log('Lead stored locally for later sync');
    }
    
    // Sync pending leads when connection restored
    window.addEventListener('online', async () => {
        const pendingLeads = JSON.parse(localStorage.getItem('pending_leads') || '[]');
        
        if (pendingLeads.length > 0) {
            console.log(`Syncing ${pendingLeads.length} pending leads...`);
            
            for (const lead of pendingLeads) {
                try {
                    await submitToCRM(lead);
                    pendingLeads.shift();
                } catch (error) {
                    console.error('Failed to sync lead:', error);
                    break;
                }
            }
            
            localStorage.setItem('pending_leads', JSON.stringify(pendingLeads));
        }
    });
    
    // Analytics tracking
    function trackConversion(eventName, eventData) {
        // Google Analytics 4
        if (typeof gtag === 'function') {
            gtag('event', eventName, eventData);
        }
        
        // Facebook Pixel
        if (typeof fbq === 'function') {
            fbq('track', eventName, eventData);
        }
        
        // Google Tag Manager
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
                event: eventName,
                ...eventData
            });
        }
    }
    
    // Form validation enhancements
    const formInputs = document.querySelectorAll('.quote-form input[required], .quote-form select[required]');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const isValid = field.checkValidity();
        
        if (!isValid) {
            field.classList.add('invalid');
            field.classList.remove('valid');
        } else {
            field.classList.remove('invalid');
            field.classList.add('valid');
        }
        
        return isValid;
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // UK phone number formatting
            if (value.length > 0) {
                if (value.length <= 5) {
                    value = value;
                } else if (value.length <= 9) {
                    value = value.slice(0, 5) + ' ' + value.slice(5);
                } else {
                    value = value.slice(0, 5) + ' ' + value.slice(5, 9) + ' ' + value.slice(9, 13);
                }
            }
            
            e.target.value = value;
        });
    }
    
    console.log('Form handling initialized');
});
