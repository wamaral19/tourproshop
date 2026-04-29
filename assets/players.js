const playerNames = [
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

const directory = document.querySelector("#players-directory");

directory.innerHTML = playerNames
  .map(
    (name, index) => `
      <a class="directory-player" href="/player.html?player=${playerSlug(name)}" aria-label="${name}">
        <span class="player-placeholder">${String(index + 1).padStart(2, "0")}</span>
        <span class="directory-player-name">${name}</span>
      </a>
    `,
  )
  .join("");
