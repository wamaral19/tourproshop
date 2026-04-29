const players = [
  "Scottie Scheffler",
  "Rory McIlroy",
  "Matt Fitzpatrick",
  "Cameron Young",
  "Justin Rose",
  "Collin Morikawa",
  "Tommy Fleetwood",
  "Russell Henley",
  "Xander Schauffele",
  "J.J. Spaun",
  "Chris Gotterup",
  "Robert Macintyre",
  "Sepp Straka",
  "Ludvig Aberg",
  "Hideki Matsuyama",
  "Ben Griffin",
  "Justin Thomas",
  "Harris English",
  "Jacob Bridgeman",
  "Jon Rahm",
  "Keith Mitchell",
  "James Nicholas",
];

function playerSlug(name) {
  return name
    .toLowerCase()
    .replace(/j\.j\./g, "jj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const params = new URLSearchParams(window.location.search);
const requestedPlayer = params.get("player");
const playerName = players.find((name) => playerSlug(name) === requestedPlayer) || "Tour Pro";
const root = document.querySelector("#player-detail");
const modal = document.querySelector("#interest-modal");
const form = document.querySelector("#interest-form");
const message = document.querySelector("#interest-message");
const closeButton = document.querySelector(".modal-close");

document.title = `Tour Pro Shop | ${playerName}`;

root.innerHTML = `
  <section class="player-detail-layout">
    <div class="player-feature-image">
      <span class="not-member-ribbon">Not a member of Tour Pro Shop</span>
      <span class="player-feature-placeholder">${playerName}</span>
    </div>
    <aside class="player-request-panel">
      <h1>${playerName}</h1>
      <p>This player does not have products available in Tour Pro Shop yet.</p>
      <button class="fashion-action" id="request-gear" type="button">Let them know I want their gear</button>
    </aside>
  </section>
`;

document.querySelector("#request-gear").addEventListener("click", () => {
  message.textContent = "";
  form.reset();
  modal.showModal();
});

closeButton.addEventListener("click", () => {
  modal.close();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const mobile = String(data.get("mobile") || "").trim();
  const emailIsValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const mobileIsValid = !mobile || /^\+?[0-9 .()-]{7,20}$/.test(mobile);

  if (!name) {
    message.textContent = "Name is required.";
    return;
  }

  if (!email && !mobile) {
    message.textContent = "Add either an email or mobile number.";
    return;
  }

  if (!emailIsValid) {
    message.textContent = "Enter a valid email address.";
    return;
  }

  if (!mobileIsValid) {
    message.textContent = "Enter a valid mobile number.";
    return;
  }

  message.textContent = "Request received. We will keep you posted.";
  window.setTimeout(() => modal.close(), 900);
});
