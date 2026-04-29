const playerGrid = document.querySelector("#player-grid");
const selectedLabel = document.querySelector("#selected-player-label");
const scrollers = document.querySelectorAll(".product-scroller");
const logoutButton = document.querySelector("#logout-button");

let selectedGolfer = "all";

function getGolferName(id) {
  return golfers.find((golfer) => golfer.id === id)?.name || "TourPro";
}

function productCard(product) {
  return `
    <a class="product-card" href="/product.html?id=${product.id}" aria-label="View ${product.name}">
      <img src="${product.image}" alt="${product.name}" />
      <span class="product-kicker">${getGolferName(product.golfer)}</span>
      <strong>${product.name}</strong>
      <span>$${product.price}</span>
    </a>
  `;
}

function renderPlayers() {
  playerGrid.innerHTML = golfers
    .map(
      (golfer) => `
        <button class="player-card ${selectedGolfer === golfer.id ? "is-active" : ""}" data-player="${golfer.id}" type="button">
          <img src="${golfer.image}" alt="${golfer.name}" />
          <span>
            <strong>${golfer.name}</strong>
            <small>${golfer.title}</small>
          </span>
        </button>
      `,
    )
    .join("");
}

function renderProducts() {
  selectedLabel.textContent =
    selectedGolfer === "all" ? "Showing all collections" : `Showing ${getGolferName(selectedGolfer)}`;

  scrollers.forEach((scroller) => {
    const category = scroller.dataset.category;
    const categoryProducts = products.filter(
      (product) => product.category === category && (selectedGolfer === "all" || product.golfer === selectedGolfer),
    );

    scroller.innerHTML = categoryProducts.map(productCard).join("");
  });
}

playerGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-player]");
  if (!card) return;

  selectedGolfer = selectedGolfer === card.dataset.player ? "all" : card.dataset.player;
  renderPlayers();
  renderProducts();
});

logoutButton.addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST", credentials: "include" });
  window.location.href = "/";
});

renderPlayers();
renderProducts();
