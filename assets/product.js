const root = document.querySelector("#product-root");
const logoutButton = document.querySelector("#logout-button");
const params = new URLSearchParams(window.location.search);
const product = products.find((item) => item.id === params.get("id")) || products[0];
const golfer = golfers.find((item) => item.id === product.golfer);
const related = products.filter((item) => item.golfer === product.golfer && item.id !== product.id);

document.title = `TourPro Shop | ${product.name}`;

root.innerHTML = `
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/shop.html">Collections</a>
    <span>/</span>
    <a href="/shop.html#${product.category}">${product.category}</a>
  </nav>

  <section class="product-layout">
    <div class="product-media">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <article class="product-info">
      <p class="eyebrow">${golfer.name}</p>
      <h1>${product.name}</h1>
      <p class="price">$${product.price}</p>
      <p>${product.description}</p>

      <div class="option-group">
        <span>Color</span>
        <button class="option-button is-selected" type="button">${product.color}</button>
      </div>

      <div class="option-group">
        <span>Size</span>
        <div class="size-grid">
          <button type="button">S</button>
          <button type="button">M</button>
          <button class="is-selected" type="button">L</button>
          <button type="button">XL</button>
        </div>
      </div>

      <button class="cart-button" type="button">Add to cart</button>

      <dl class="product-details">
        <div><dt>Material</dt><dd>Performance stretch fabric</dd></div>
        <div><dt>Care</dt><dd>Machine wash cold</dd></div>
        <div><dt>Shipping</dt><dd>Ships in 2-4 business days</dd></div>
      </dl>
    </article>
  </section>

  <section class="merch-section related-section" aria-labelledby="related-title">
    <div class="section-heading">
      <h2 id="related-title">More from ${golfer.name}</h2>
      <span>Complete the player look</span>
    </div>
    <div class="product-scroller">
      ${related
        .map(
          (item) => `
            <a class="product-card" href="/product.html?id=${item.id}">
              <img src="${item.image}" alt="${item.name}" />
              <span class="product-kicker">${item.category}</span>
              <strong>${item.name}</strong>
              <span>$${item.price}</span>
            </a>
          `,
        )
        .join("")}
    </div>
  </section>
`;

root.querySelector(".cart-button").addEventListener("click", (event) => {
  event.currentTarget.textContent = "Added";
  event.currentTarget.classList.add("is-added");
});

logoutButton.addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST", credentials: "include" });
  window.location.href = "/";
});
