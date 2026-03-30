/**
 * Elite Luxury Bookings - JavaScript Controller
 * 
 * This script binds Vanilla JS event listeners to the form and WhatsApp icons
 * and safely transmits data to the WordPress AJAX proxy endpoint to eliminate CORS issues.
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ----------------------------------------------------------------------
    // 1. Google Analytics (GA4) Tracking for WhatsApp Click
    // ----------------------------------------------------------------------
    const waIcons = document.querySelectorAll('.wa-float, .wa-link-track');
    waIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            if (typeof gtag === 'function') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'Contact',
                    'event_label': 'Floating Action Button or Message Link'
                });
            }
        });
    });

    // ----------------------------------------------------------------------
    // 2. Google Apps Script Form Submission (via WP Admin AJAX)
    // ----------------------------------------------------------------------
    const leadForm = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMsg = document.getElementById('formMsg');
    
    if (leadForm) {
        leadForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Stop standard HTTP submission
            
            // GA4 Lead Tracking Event
            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    'event_category': 'Engagement',
                    'event_label': 'Luxury Villa Form Submit'
                });
            }

            // Lock UI to prevent double submission
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'SECURELY SENDING...';
            submitBtn.disabled = true;

            // Generate Payload Object
            const formData = new FormData(leadForm);
            const data = Object.fromEntries(formData.entries());

            try {
                /**
                 * Server-to-Server Proxy Route 
                 * Action name matches the wp_ajax_{action} hook in functions.php
                 */
                const wpAjaxUrl = '/wp-admin/admin-ajax.php?action=submit_elb_lead';
                
                const response = await fetch(wpAjaxUrl, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    // Success State
                    leadForm.style.display = 'none';
                    formMsg.style.display = 'block';
                    document.getElementById('quote').scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Controlled Error State (e.g. invalid data, Google rejection)
                    alert('Submission error: ' + (result.data ? result.data.message : 'Please try again.'));
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                // Total Failure / Network Drop State
                console.error("Critical submission failure:", error);
                alert("We couldn't reach the server. Please check your connection or contact us directly via WhatsApp.");
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
