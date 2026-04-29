const protectedPaths = [
  "/shop.html",
  "/players.html",
  "/collections.html",
  "/player.html",
  "/product.html",
  "/about.html",
  "/account.html",
  "/cart.html",
];

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const isProtected = protectedPaths.some((path) => url.pathname === path);

  if (!isProtected) {
    return context.next();
  }

  const cookie = context.request.headers.get("Cookie") || "";
  const token = getCookie(cookie, "tp_session");

  if (token && (await isValidToken(token, context.env.AUTH_SECRET || context.env.SITE_PASSWORD))) {
    return context.next();
  }

  return Response.redirect(`${url.origin}/`, 302);
}

function getCookie(cookieHeader, name) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.split("=")[1];
}

async function isValidToken(token, secret) {
  if (!secret) return false;

  const [timestamp, signature] = token.split(".");
  const issuedAt = Number(timestamp);
  const oneDay = 24 * 60 * 60 * 1000;

  if (!timestamp || !signature || Number.isNaN(issuedAt) || Date.now() - issuedAt > oneDay) {
    return false;
  }

  const expected = await sign(timestamp, secret);
  return signature === expected;
}

async function sign(value, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
