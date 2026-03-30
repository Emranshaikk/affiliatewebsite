# Elite Luxury Bookings - WordPress Deployment Guide

This folder contains the fully modular, decoupled components required to securely host your Luxury Villa Rentals landing page within WordPress.

## Step 1: Add HTML
1. Open your WordPress Page Editor (Elementor or Gutenberg).
2. Insert a **Custom HTML** block or widget.
3. Open `wp-landing.html` and copy the entire contents.
4. Paste the content into the block. No changes needed.

## Step 2: Add CSS
1. Open `wp-styles.css` and copy the contents.
2. In WordPress, navigate to **Appearance > Customize > Additional CSS**.
3. Paste the CSS there. (Alternatively, add this inside a `<style>` block right below your HTML in Step 1).

## Step 3: Add the PHP Proxy (Fixes CORS & Failures)
1. Install the free plugin **WPCode** (if your theme doesn't let you edit code easily).
2. Create a new "PHP Snippet".
3. Open `wp-functions-proxy.php` and copy the code.
4. Paste it into WPCode and set it to **"Run Everywhere"** (Make sure the snippet is active).
5. *Why?* This allows WordPress itself to talk directly to your Google Sheet, bypassing browser CORS blockers and tracking blockers.

## Step 4: Add the Frontend JavaScript
1. In **WPCode** (or any Headers & Footers plugin), create a new **"JavaScript Snippet"**.
2. Open `wp-scripts.js` and copy the code.
3. Wrap it in `<script>`...`</script>` tags and set the placement to the **Footer** of this specific page.

## Step 5: Add Header Scripts (GA4, Fonts, Schema)
1. Place this inside the `<head>` of your website using your Headers plugin:

```html
<!-- Premium Typography -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@300;400;600&display=swap" as="style">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@300;400;600&display=swap">

<!-- Google Analytics (GA4) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-J56D1LJLFM"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-J56D1LJLFM');
</script>
```

2. Add your Schema Markup (FAQ and Breadcrumbs) using RankMath, Yoast SEO, or by injecting the `<script type="application/ld+json">` explicitly into the page head.
