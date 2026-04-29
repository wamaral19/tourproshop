export async function onRequestPost() {
  return new Response("OK", {
    headers: {
      "Set-Cookie": "tp_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    },
  });
}
