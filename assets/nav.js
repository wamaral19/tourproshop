const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("#site-nav-links");
const logoutButtons = document.querySelectorAll("[data-logout]");

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navLinks?.classList.toggle("is-open", !isOpen);
});

logoutButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    window.location.href = "/";
  });
});
