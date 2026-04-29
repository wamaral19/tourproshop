# TourPro Shop

Private storefront for `tourpro.shop`, built as a static Cloudflare Pages site with Pages Functions for password protection.

## Cloudflare setup

1. Deploy this folder to Cloudflare Pages.
2. In the Pages project settings, add an environment variable named `SITE_PASSWORD`.
3. Optional: add `AUTH_SECRET` as a separate long random value. If omitted, the password is also used to sign the session cookie.
4. Set the production domain to `tourpro.shop`.

The private pages are `/shop.html` and `/product.html`. The password is checked server-side by Cloudflare Pages Functions and stored as a 24-hour HttpOnly session cookie.

## Local preview

You can preview the static pages locally with any simple web server. The Cloudflare password function runs after deployment, so local preview is mainly for design and navigation.
