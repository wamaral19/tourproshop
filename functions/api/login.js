export async function onRequestPost(context) {
  const form = await context.request.formData();
  const password = form.get("password");
  const sitePassword = context.env.SITE_PASSWORD;
  const secret = context.env.AUTH_SECRET || sitePassword;

  if (!sitePassword || password !== sitePassword) {
    return new Response("Unauthorized", { status: 401 });
  }

  const timestamp = String(Date.now());
  const signature = await sign(timestamp, secret);
  const secure = new URL(context.request.url).protocol === "https:" ? " Secure;" : "";
  const cookie = `tp_session=${timestamp}.${signature}; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=86400`;

  return new Response("OK", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}

async function sign(value, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
