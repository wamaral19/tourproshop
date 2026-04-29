# Tour Pro Shop

Private storefront for `tourpro.shop`, built as a static Cloudflare Pages site with Pages Functions for password protection.

## Cloudflare setup

1. Deploy this folder to Cloudflare Pages.
2. In the Pages project settings, add an environment variable named `SITE_PASSWORD` with the value `PGA`.
3. Optional: add `AUTH_SECRET` as a separate long random value. If omitted, the password is also used to sign the session cookie.
4. Set the production domain to `tourpro.shop`.

The private pages are `/shop.html`, `/players.html`, `/player.html`, `/collections.html`, `/product.html`, `/about.html`, `/account.html`, and `/cart.html`. The password is checked server-side by Cloudflare Pages Functions and stored as a 24-hour HttpOnly session cookie.

## Local preview

You can preview the static pages locally with any simple web server. The Cloudflare password function runs after deployment, so local preview is mainly for design and navigation.

Useful local paths:

- `/` - password landing page
- `/shop.html` - post-password carousel landing page
- `/players.html` - player directory
- `/player.html?player=ben-griffin` - reusable player profile page
- `/collections.html` - collection category tiles

Local-only files such as `.dev.vars` and `.preview.pid` are intentionally ignored by Git. Set `SITE_PASSWORD=PGA` in Cloudflare Pages rather than committing a password file.
