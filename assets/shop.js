const track = document.querySelector("#carousel-track");
const dots = document.querySelector("#carousel-dots");
const prev = document.querySelector(".carousel-prev");
const next = document.querySelector(".carousel-next");

const headwear = products.filter((product) => product.category === "headwear");
const slides = headwear.map((product, index) => {
  const golfer = golfers.find((item) => item.id === product.golfer);
  return {
    ...product,
    golferName: golfer?.name || "Tour Pro Shop",
    golferImage: golfer?.image || product.image,
    kicker: index % 2 === 0 ? "Player release" : "Headwear drop",
  };
});

let activeSlide = 0;
let carouselTimer;

function renderSlides() {
  track.innerHTML = slides
    .map(
      (slide, index) => `
        <a class="carousel-slide" href="/product.html?id=${slide.id}" aria-label="View ${slide.name}">
          <div class="slide-art">
            <img class="slide-player" src="${slide.golferImage}" alt="${slide.golferName}" />
            <img class="slide-product" src="${slide.image}" alt="${slide.name}" />
          </div>
          <div class="slide-copy">
            <p>${slide.kicker}</p>
            <h1>${slide.golferName}</h1>
            <span>${slide.name}</span>
          </div>
        </a>
      `,
    )
    .join("");

  dots.innerHTML = slides
    .map(
      (_, index) => `
        <button class="${index === activeSlide ? "is-active" : ""}" type="button" aria-label="Go to slide ${index + 1}" data-slide="${index}"></button>
      `,
    )
    .join("");

  updateCarousel();
}

function goToSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  updateCarousel();
}

function updateCarousel() {
  track.style.transform = `translateX(-${activeSlide * 100}%)`;

  dots.querySelectorAll("button").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === activeSlide);
  });
}

function restartCarouselTimer() {
  window.clearInterval(carouselTimer);
  carouselTimer = window.setInterval(() => {
    goToSlide(activeSlide + 1);
  }, 5000);
}

function handleManualSlide(index) {
  goToSlide(index);
  restartCarouselTimer();
}

prev.addEventListener("click", () => handleManualSlide(activeSlide - 1));
next.addEventListener("click", () => handleManualSlide(activeSlide + 1));
dots.addEventListener("click", (event) => {
  const dot = event.target.closest("[data-slide]");
  if (!dot) return;
  handleManualSlide(Number(dot.dataset.slide));
});

renderSlides();
restartCarouselTimer();
