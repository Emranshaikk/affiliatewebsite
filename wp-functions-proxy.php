<?php
/**
 * Elite Luxury Bookings - Google Apps Script Proxy
 * 
 * Instructions: Paste this code into your child theme's functions.php or within a 
 * snippet tool (like WPCode). 
 * 
 * This creates a secure, server-to-server connection to your Google Apps Script
 * so you don't have to worry about CORS or browser tracking blockers stopping
 * the form submission.
 */

// Register the AJAX endpoint for both logged-out and logged-in visitors
add_action('wp_ajax_nopriv_submit_elb_lead', 'handle_elb_lead_submission');
add_action('wp_ajax_submit_elb_lead', 'handle_elb_lead_submission');

function handle_elb_lead_submission() {
    
    // 1. Basic security check
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        wp_send_json_error(['message' => 'Invalid request method.'], 405);
    }

    // 2. Read the JSON payload sent by our fetch() script
    $body = json_decode(file_get_contents('php://input'), true);
    
    // 3. Simple Validation (ensure we at least have contact details)
    if (empty($body['email']) && empty($body['phone'])) {
        wp_send_json_error(['message' => 'Critical contact information is missing. Please retry.'], 400);
    }

    // 4. Your Exact Google Apps Script Endpoint
    $gas_endpoint = 'https://script.google.com/macros/s/AKfycbxwH6b82MCg90tYS-yTwUMWw1ePx2S3oBdn3BC5U1UAt2uQRCB2bq03bzPP52ygUGU6UA/exec';

    // 5. Fire off the server-to-server POST request 
    $response = wp_remote_post($gas_endpoint, [
        'method'      => 'POST',
        'timeout'     => 15, // Important: Apps Script can occasionally be slow
        'redirection' => 5,  // Important: Apps Script relies on redirects internally
        'httpversion' => '1.1',
        'blocking'    => true,
        'headers'     => [
            'Content-Type' => 'application/json'
        ],
        'body'        => json_encode($body)
    ]);

    // 6. Handle WordPress internal/networking errors
    if (is_wp_error($response)) {
        wp_send_json_error(['message' => 'Our secure server could not connect to scheduling. Please use WhatsApp.'], 500);
    }

    $http_code = wp_remote_retrieve_response_code($response);
    
    // 7. Check if Google Apps Script rejected it for some reason
    if ($http_code >= 400) {
        wp_send_json_error(['message' => 'Upstream provider rejected data. Status: ' . $http_code], $http_code);
    }

    // 8. Success Output back to the frontend JS!
    wp_send_json_success(['message' => 'Your private request was successfully received.']);
}
