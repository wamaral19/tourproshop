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
};

export function getSponsorsByPlayer(playerSlug: string): Sponsor[] {
  return SPONSORS_BY_PLAYER[playerSlug] ?? [];
}
