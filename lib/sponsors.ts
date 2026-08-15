import { PLAYER_NAMES_HIDDEN } from "./site-mode";

export type Sponsor = {
  name: string;
  blurb: string;
};

const SPONSORS_BY_PLAYER: Record<string, Sponsor[]> = {
  "min-woo-lee": [
    {
      name: "IREN",
      blurb:
        "An ASX- and Nasdaq-listed sustainable data-center company powering bitcoin mining and AI compute with 100% renewable energy. Their partnership with Min Woo leans into his global, next-generation appeal — and into golf's growing crossover with tech and finance audiences.",
    },
    {
      name: "Ares",
      blurb:
        "Ares Management is a global alternative investment manager with deep roots in the game — title sponsor of the Ares Management LPGA Match Play and an active backer of pro golf. The Min Woo partnership extends that platform into the PGA Tour with one of its most marketable young stars.",
    },
    {
      name: "Lululemon",
      blurb:
        "The Vancouver-born technical apparel brand that anchored Min Woo's on-course look in 2025. Lululemon's golf range translates the brand's performance-fabric pedigree into Tour-grade pieces — and Min Woo's swagger has made him the face of their push into men's golf.",
    },
  ],
  "james-nicholas": [
    {
      name: "Greyson Clothiers",
      blurb:
        "A premium golf and lifestyle label founded by Charlie Schaefer, known for the wolf mark, distinctive prints, and elevated performance fabrications. James anchors Greyson's tour presence — the brand he wears week-in, week-out on the PGA Tour.",
    },
    {
      name: "Pepe Auto Group",
      blurb:
        "A Westchester County, New York automotive dealer group with deep ties to the local sports community. Their partnership with James leans into his New York roots and the close-knit network around his rise on Tour.",
    },
    {
      name: "IKON Pass",
      blurb:
        "Alterra Mountain Company's flagship season pass with access to more than 50 mountain destinations worldwide. The IKON / James pairing speaks to a year-round, multi-sport audience — golfers in the summer, skiers and riders in the winter.",
    },
    {
      name: "protiviti",
      blurb:
        "A global consulting firm (a Robert Half subsidiary) delivering risk, technology, and business consulting to more than 80% of the Fortune 100. Title sponsor of the Protiviti Championship on the Korn Ferry Tour and an increasingly active backer of pro golf, with James as part of their player roster.",
    },
  ],
  "keith-mitchell": [
    {
      name: "Imperial",
      blurb:
        "The Connecticut-based headwear maker behind Mitchell's tour visor. Imperial has quietly outfitted Tour pros for decades, building lightweight, structured visors and caps that hold their shape through tournament weeks — and Keith's signature on-course look is one of the brand's most recognizable silhouettes.",
    },
    {
      name: "Mizuno",
      blurb:
        "The Osaka-founded equipment house Mitchell trusts from tee to green. Mizuno's forged irons have a cult following on Tour for their feel, and Keith's bag deal makes him one of the brand's most visible American ambassadors — the runbird sits side-panel on every visor he wears.",
    },
    {
      name: "Cisco",
      blurb:
        "The networking and security giant that anchors Mitchell's front-panel sponsorship. Cisco's PGA Tour platform leans on Keith's everyman discipline and Atlanta roots — a partnership built around steadiness, preparation, and the long game both on course and in enterprise tech.",
    },
  ],
  "cameron-young": [
    {
      name: "Peter Millar",
      blurb:
        "The North Carolina-founded performance and lifestyle brand that anchors Cameron's on-course look. Peter Millar's tour-grade jerseys and tailored silhouettes have become a staple of Young's Sunday rotation — a partnership rooted in classic American style with modern tour-tested fabrications.",
    },
    {
      name: "Mastercard",
      blurb:
        "One of the most active brands in pro golf and a long-running PGA Tour partner. Mastercard's roster of Tour ambassadors leans into players with broad appeal and championship pedigree — Young's pure ball-striking and big-stage moments make him a natural fit for the brand's Priceless platform.",
    },
    {
      name: "MLB",
      blurb:
        "Major League Baseball's partnership with Cameron Young is one of golf's most distinctive crossovers — a nod to the Yankees-loving New Yorker and his Westchester roots. The collar mark is a year-round shoutout to the league and Young's lifelong fandom of the game's other great walk-off sport.",
    },
    {
      name: "Cisco",
      blurb:
        "The networking and security giant Young carries on his right sleeve. Cisco's PGA Tour platform pairs the brand with players known for preparation, composure, and the long game — and Young's calm, methodical approach inside the ropes lines up with how Cisco talks about enterprise tech.",
    },
    {
      name: "Mutual of Omaha",
      blurb:
        "The Omaha-founded insurance and financial services company with deep PGA Tour ties — title sponsor of the Mutual of Omaha Cup and a long-time backer of pro golf. Young joined their player roster as a representation of generational stewardship and the next wave of American stars.",
    },
    {
      name: "iCapital",
      blurb:
        "The fintech platform that built the rails for alternative investments across the wealth management industry. iCapital's golf sponsorships target advisor and investor audiences who follow the Tour closely — Young's blend of marketability and on-course consistency made him an early signing on their roster.",
    },
  ],
  "si-woo-kim": [
    {
      name: "Primo",
      blurb:
        "A modern golf apparel label known for textured, all-over prints and clean performance silhouettes. Primo anchors Si Woo's on-course look — the grayscale Echo Classic Collar Polo is one of the brand's signature pieces in his tournament rotation.",
    },
    {
      name: "NetJets",
      blurb:
        "The Berkshire Hathaway-owned private aviation company that pioneered fractional jet ownership, and one of professional golf's most prolific patron sponsors. Si Woo carries NetJets on his right sleeve — a fitting placement for a tour pro who spends much of the season in the air between Korea and the US.",
    },
    {
      name: "CJ Logistics",
      blurb:
        "The logistics arm of South Korea's CJ Group — the same conglomerate behind The CJ Cup, one of the largest Korean platforms in pro golf. Si Woo, a CJ Cup champion, has long anchored CJ Group's player roster, with CJ Logistics' colorful mark riding on his left sleeve.",
    },
    {
      name: "Bibigo",
      blurb:
        "CJ CheilJedang's flagship Korean food brand, known globally for K-food crossover marketing and high-profile sports partnerships. Bibigo earns two placements on Si Woo's polo — the green circular mark at the right chest and a smaller wordmark on the right collar — extending the CJ Group platform across his on-course look.",
    },
    {
      name: "Brock",
      blurb:
        "A patch sponsor on the left collar of Si Woo's tournament polo, completing his on-course lineup alongside the CJ Group brands and NetJets.",
    },
  ],
  "ben-griffin": [
    {
      name: "Lord Abbett",
      blurb:
        "A privately held asset management firm that has backed Ben Griffin through his rise on the PGA Tour. Their sponsorship leans into Griffin's perseverance and work ethic, especially his comeback story after briefly stepping away from professional golf.",
    },
    {
      name: "Prometric",
      blurb:
        "A global testing, credentialing, and workforce skills-development company. They partnered with Griffin in 2025 after seeing parallels between his preparation-focused approach to golf and their emphasis on professional excellence, certification, and continuous improvement.",
    },
    {
      name: "Zurich Insurance Group",
      blurb:
        "A global insurance company best known in golf for sponsoring the Zurich Classic of New Orleans. Griffin's connection to Zurich grew after winning that event alongside Andrew Novak, and the brand has become tied to his breakout season on Tour.",
    },
    {
      name: "Holderness & Bourne",
      blurb:
        "A premium golf apparel brand known for classic, tailored golf clothing. Griffin became an ambassador in 2022 after discovering the brand while training at Sea Island — a partnership rooted in shared UNC ties and traditional golf style.",
    },
    {
      name: "Delta Air Lines",
      blurb:
        "One of the world's largest airlines and an increasingly active golf sponsor. Griffin's relationship with Delta centers on the travel demands of the PGA Tour lifestyle, later tying him into broader premium-travel partnerships like Wheels Up.",
    },
  ],
  "jackson-koivun": [
    {
      name: "Malbon Golf",
      blurb:
        "The streetwear-inflected golf label that blends lifestyle cool with tour-grade performance fabrics. Malbon anchors Jackson's on-course look as he steps into the pro ranks — the Buckets script and modern silhouettes a natural fit for one of the game's most hyped young talents.",
    },
    {
      name: "Delta Air Lines",
      blurb:
        "One of the world's largest airlines and an increasingly active golf sponsor. Delta backs Jackson as he takes on a full tour schedule — a partnership built around the constant travel that defines a rising pro's life on the road.",
    },
    {
      name: "Betterment",
      blurb:
        "The automated investing and cash-management platform built to help a new generation grow wealth. Betterment's pairing with Jackson leans into his emergence as a young pro — smart, long-term, and just getting started.",
    },
    {
      name: "Omni Hotels & Resorts",
      blurb:
        "The luxury hotel and resort collection with a deep golf portfolio, including championship host resorts on the PGA Tour. Omni's partnership with Jackson connects its tournament-caliber properties to one of golf's brightest young stars.",
    },
    {
      name: "Old Republic",
      blurb:
        "A Fortune 500 insurance holding company with a long history of backing the game. Old Republic's mark on Jackson's sleeve reflects a steady, long-game partnership as he builds his professional career.",
    },
  ],
  "wyndham-clark": [
    {
      name: "Municipal",
      blurb:
        "The performance golf and lifestyle brand co-founded by Mark Wahlberg. Municipal outfits Wyndham in its Sportcross line — tour-tested fabrics and clean, understated design that match his no-frills, all-power game.",
    },
    {
      name: "SoFi",
      blurb:
        "The digital personal-finance company and one of golf's fastest-rising sponsors. SoFi's front-and-center placement backs a major champion whose breakout aligns with the brand's own ascent.",
    },
    {
      name: "Power Design",
      blurb:
        "A national design-build firm specializing in electrical, mechanical, and technology systems for large-scale projects. Power Design's partnership with Wyndham ties its building expertise to one of the tour's biggest hitters.",
    },
  ],
  "harry-higgs": [
    {
      name: "Greyson Clothiers",
      blurb:
        "The premium golf and lifestyle label founded by Charlie Schaefer, known for the wolf mark, distinctive prints, and elevated performance fabrications. Greyson anchors Harry's on-course look — the Ghost Thistle print is his kind of shirt: classic from ten feet, a little bit of a statement up close.",
    },
    {
      name: "Dude Wipes",
      blurb:
        "The Chicago-founded personal-care brand that turned flushable wipes into a cult consumer label — and one of the most unapologetically fun sponsors in pro sports. Their mark on Harry's left chest is close to a perfect match: golf's most self-deprecating everyman fronting a brand that never takes itself too seriously.",
    },
    {
      name: "Knockaround",
      blurb:
        "The San Diego sunglasses company built on the idea that great shades shouldn't cost a paycheck — durable, polarized, and priced for the people actually walking the course. Knockaround rides the right collar on Harry's polo, a fitting placement for a player whose appeal has always been that he feels like one of us.",
    },
  ],
  "sam-burns": [
    {
      name: "Peter Millar",
      blurb:
        "The North Carolina-founded performance and lifestyle brand that anchors Sam's on-course look. Peter Millar's Albatross piqué and tailored silhouettes are a staple of Burns's tournament rotation.",
    },
    {
      name: "Mastercard",
      blurb:
        "One of the most active brands in pro golf and a long-running PGA Tour partner. Mastercard's Priceless platform pairs with players of championship pedigree — Burns's steady, repeat-winning game fits the bill.",
    },
    {
      name: "Raising Cane's",
      blurb:
        "The Louisiana-born chicken-finger chain with a cult following and a golf-obsessed founder in Todd Graves. Raising Cane's backs fellow Louisianan Sam Burns — a hometown partnership through and through.",
    },
    {
      name: "ADP",
      blurb:
        "The global human-capital-management company and a prominent PGA Tour sponsor. ADP's front-chest mark reflects a partnership built around consistency and performance — on the course and in the workplace.",
    },
    {
      name: "iCapital",
      blurb:
        "The fintech platform that built the rails for alternative investments across the wealth management industry. iCapital's newest addition to Burns's right chest puts the brand alongside ADP on one of the Tour's most consistent winners — a placement aimed squarely at the advisor and investor audiences who follow every week.",
    },
    {
      name: "Topgolf",
      blurb:
        "The tech-driven driving-range and entertainment brand that's grown the game for a whole new audience. Topgolf's partnership with Burns connects one of golf's most accessible experiences to a proven Tour winner.",
    },
    {
      name: "RBC",
      blurb:
        "The Royal Bank of Canada, one of pro golf's most prolific patrons with a deep Team RBC roster and title sponsorships across the Tour. Burns carries the RBC shield as part of that lineup.",
    },
  ],
  "jj-spaun": [
    {
      name: "PUMA",
      blurb:
        "The global sportswear giant whose PUMA Golf line anchors JJ's tournament look. The MATTR Brigade polo pairs moisture-wicking performance fabric with bold pattern — a fit for the reigning U.S. Open champion's breakout run.",
    },
    {
      name: "NICE",
      blurb:
        "A global software company specializing in customer-experience and AI-driven analytics. NICE's front-chest placement backs JJ as a marquee ambassador following his major breakthrough.",
    },
    {
      name: "Tradeweb",
      blurb:
        "The electronic marketplace for fixed-income and derivatives trading, and an active golf sponsor. Tradeweb's mark on JJ's sleeve reflects a partnership rooted in precision and steadiness under pressure.",
    },
    {
      name: "Amerisure",
      blurb:
        "The Michigan-based commercial property-and-casualty insurer. Amerisure's partnership with JJ leans into reliability and the long game — values shared on the course and in risk management.",
    },
  ],
  "justin-rose": [
    {
      name: "Peter Millar",
      blurb:
        "The North Carolina-founded performance and lifestyle brand behind Justin's on-course look. Peter Millar's Crown Crafted tour line pairs classic silhouettes with modern performance fabrications — a natural match for a player whose style has stayed understated across three decades on tour.",
    },
    {
      name: "Mastercard",
      blurb:
        "One of the most active brands in pro golf and a long-running PGA Tour partner. Rose is among the longest-tenured players on Mastercard's Priceless roster — the interlocking circles ride high on his left collar, one of the most recognizable marks in the game.",
    },
    {
      name: "Workday",
      blurb:
        "The enterprise cloud platform for finance and HR, and one of golf's most visible software sponsors. Workday's left-chest placement backs a player known for preparation and process — the same qualities the brand sells to the Fortune 500.",
    },
    {
      name: "McLaren Golf",
      blurb:
        "The golf arm of McLaren Racing, extending the Woking marque's engineering obsession from Formula 1 into the game. The speedmark sits at Justin's right chest — motorsport precision alongside one of golf's most technically minded swings.",
    },
    {
      name: "Teneo",
      blurb:
        "The global CEO advisory firm that counsels boards and executives across communications, capital, and risk. Teneo's mark on Justin's left sleeve reflects a partnership built around counsel and longevity — the long game, played at the top.",
    },
    {
      name: "Flyhouse",
      blurb:
        "A private aviation company serving clients who live on the road. Flyhouse rides on Justin's right sleeve — fitting for a player whose career has spanned the European Tour, the PGA Tour, the Olympics, and every time zone in between.",
    },
  ],
};

/**
 * Sponsors as shown in public copy. While PLAYER_NAMES_HIDDEN is on the blurbs
 * are dropped and only the sponsor name is surfaced: the copy is prose that
 * names players by first name, surname and possessive ("Min Woo's swagger",
 * "Griffin's perseverance"), and find-and-replacing a person out of a sentence
 * is not something worth automating. The hotspot still does its job — it points
 * at a mark and says whose brand it is.
 */
export function getPublicSponsorsByPlayer(playerSlug: string): Sponsor[] {
  const sponsors = getSponsorsByPlayer(playerSlug);
  if (!PLAYER_NAMES_HIDDEN) return sponsors;
  return sponsors.map((sponsor) => ({ ...sponsor, blurb: "" }));
}

export function getSponsorsByPlayer(playerSlug: string): Sponsor[] {
  return SPONSORS_BY_PLAYER[playerSlug] ?? [];
}
