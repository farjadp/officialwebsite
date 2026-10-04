// ============================================================================
// File Path: src/components/v3/reports/direct-to-cell/copy.ts
// Why: Every word of report 03 in both locales, one structure for both. The
//      Persian is Farjad's own final text, kept in his voice and divided into
//      the page's sections; the English says the same thing.
//
//      The line the whole report holds to: the technology is real and live in
//      several countries; what is not real, today, is the claim that people in
//      Iran can pick up an ordinary phone and get online through it. "Not
//      today, on the current network" — never "impossible".
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { Country, FocusKey, NeedKey } from "./data"

type Para = string[]

type Copy = {
  hero: { kicker: string; verdict: string; viral: string; aiNote: string; mega: string; megaUnit: string; megaLabel: string; asOf: string }
  findings: { kicker: string; title: string; items: string[] }
  what: { kicker: string; title: string; body: Para; pull: string; body2: Para }
  globe: {
    title: string
    lead: string
    hint: string
    noWebgl: string
    iranLabel: string
    focusLabel: string
    focus: Record<FocusKey, string>
    readings: Record<FocusKey, string>
    legendLive: string
    legendPlanned: string
    legendIran: string
    legendSats: string
    countries: Record<string, string>
  }
  now: { kicker: string; title: string; body: Para; stats: { v: string; l: string }[]; statsNote: string; uses: string[]; closing: string }
  iran: { kicker: string; title: string; body: Para; gapA: string; gapB: string; gapNote: string }
  pentagon: { kicker: string; title: string; body: Para; setup: string; monthly: string; setupLabel: string; monthlyLabel: string; disputed: string; butLabel: string }
  switchboard: {
    kicker: string
    title: string
    lead: string
    countries: Record<Country, string>
    needs: Record<NeedKey, { name: string; body: string }>
    yes: string
    no: string
    verdicts: Record<Country, string>
  }
  capacity: { kicker: string; title: string; body: Para; pull: string }
  signal: { title: string; rows: { lte: string; dtc: string }; weak: string; strong: string; reading: string }
  calc: {
    kicker: string
    title: string
    lead: string
    cityLabel: string
    cities: Record<string, string>
    popLabel: string
    shareLabel: string
    people: string
    beamsLabel: string
    beamsNote: string
    perUser: string
    uses: Record<string, string>
    caveat: string
    good: string[]
    bad: string
  }
  uplink: { kicker: string; title: string; body: Para }
  jamming: {
    kicker: string
    title: string
    lead: string
    on: string
    off: string
    dish: { name: string; clear: string; jammed: string }
    phone: { name: string; clear: string; jammed: string }
    caveat: string
    honest: string
  }
  lte: { kicker: string; title: string; body: Para; problems: { name: string; body: string }[]; finding: string; joke: string }
  generations: {
    kicker: string
    title: string
    lead: string
    views: { system: string; perSatellite: string }
    rows: { v1: string; v2: string }
    scale: string
    reading: string
  }
  kazakhstan: { kicker: string; title: string; body: Para; proves: string[]; button: string }
  claims: { kicker: string; title: string; hint: string; claimLabel: string; verdictLabel: string; items: { claim: string; verdict: string; why: string; true: boolean }[] }
  closing: { kicker: string; body: Para; last: string; notYet: string }
  method: { kicker: string; title: string; notes: string[]; sourcesTitle: string; sources: { label: string; href: string }[] }
  colophon: { shareTitle: string; disclaimer: string; cta: string }
  photos: Record<string, { alt: string; caption: string }>
}

export const COPY: Record<Locale, Copy> = {
  en: {
    hero: {
      kicker: "Report 03",
      verdict:
        "Let me give you the conclusion first. Direct to Cell is real. But the idea that today, in Iran, you can pick up your ordinary phone and connect straight to Starlink — no dish, no antenna, no extra equipment — and get online is not real. Not yet.",
      viral:
        "So when you see headlines like “Starlink internet straight to your phone in Iran” or “no more need for a dish”, selling this as a practical answer for people inside Iran, you are looking at a sales pitch for a dream, not a service you can use.",
      aiNote:
        "I wrote this with the help of AI, but from technical documentation, academic measurement studies and the published material of the operators and providers involved.",
      mega: "0",
      megaUnit: "public services",
      megaLabel: "Starlink has announced for users inside Iran — as of October 2026",
      asOf: "Status as of 4 October 2026. This field moves fast; dates are given with every figure.",
    },
    findings: {
      kicker: "In five lines",
      title: "What is true today",
      items: [
        "Direct to Cell is real and commercially live in several countries, through partner mobile operators.",
        "No public Direct to Cell service has been announced for users inside Iran, and nothing official says one exists.",
        "One beam's estimated capacity, about 3 Mbps outdoors, is shared by everyone under it. That works for a stranded driver; it cannot carry a city whose internet has been cut.",
        "A phone's signal reaching the satellite is weak and goes in every direction, which leaves it more exposed to jamming than a Starlink dish.",
        "The next generation promises far more capacity from 2027. It is not in orbit yet, and today's network should not be credited with what it might do.",
      ],
    },
    what: {
      kicker: "The idea",
      title: "What is Direct to Cell, anyway?",
      body: [
        "The idea sounds simple. Instead of your phone always having to reach a mobile mast on the ground, a satellite in low Earth orbit plays part of the role of that mobile base station.",
        "In today's Starlink Direct to Cell, the aim is that compatible phones can reach a satellite through ordinary cellular standards — without a Starlink dish and without a special satellite antenna. Unlike ordinary Starlink, there is nothing to put on the roof. That part is completely real.",
      ],
      pull: "The technology existing does not mean it is available in every country.",
      body2: [
        "What the viral videos leave out is how the current generation is built: on partnerships with mobile operators. The partner operator lends part of its radio spectrum, and the satellite network plugs into the operator's own infrastructure. In plain words, a satellite is not enough. Spectrum, an operator, a core network, regulatory permission and a stack of technical and legal coordination are all part of it.",
        "This architecture will not stay the same forever. For the next generation, SpaceX is moving towards dedicated satellite spectrum and 5G NR-NTN, so “Direct to Cell will always need a domestic operator in each country” is not accurate either. But for the generation actually in use today, operator partnership is still central.",
      ],
    },
    globe: {
      title: "Where it is switched on",
      lead: "The satellites pass over every country on Earth, Iran included. The service does not. It is switched on one country at a time, through a local operator.",
      hint: "Drag to turn the globe.",
      noWebgl: "This browser cannot draw the 3D globe. The list beside it carries the same information.",
      iranLabel: "Iran · no service",
      focusLabel: "Turn the globe to",
      focus: { iran: "Iran", kazakhstan: "Kazakhstan", americas: "The Americas", pacific: "Australia & NZ" },
      readings: {
        iran: "Iran is under the same satellites as everyone else — and has no partner operator, no spectrum agreement and no regulatory approval. The satellites are there; the service is not.",
        kazakhstan: "Kazakhstan, across the Caspian, is the nearest live example: at the end of September 2026 Beeline and Starlink launched service for areas outside terrestrial coverage, after agreements between the government and Starlink — for now on compatible Android phones only.",
        americas: "In the United States, T-Mobile's service has been commercial since July 2025; in Canada, Rogers. Entel runs it in Chile and Peru, and Liberty in Costa Rica and Panama.",
        pacific: "One NZ in New Zealand was among the first, in December 2024. In Australia, Telstra; in Japan, KDDI, Docomo and SoftBank; in the Philippines, Globe.",
      },
      legendLive: "Live through a partner operator",
      legendPlanned: "Partner: announced, in trial or launching",
      legendIran: "Iran",
      legendSats: "Satellites (illustrative)",
      countries: {
        US: "United States", CA: "Canada", NZ: "New Zealand", AU: "Australia", JP: "Japan", CL: "Chile",
        PE: "Peru", UA: "Ukraine", KZ: "Kazakhstan", CH: "Switzerland", GB: "United Kingdom", MX: "Mexico",
        PH: "Philippines", CR: "Costa Rica", PA: "Panama", ES: "Spain", IT: "Italy", UG: "Uganda", ZM: "Zambia", BD: "Bangladesh", MN: "Mongolia", CD: "DR Congo", KE: "Kenya", DE: "Germany",
      },
    },
    now: {
      kicker: "Today",
      title: "So what can it actually do now?",
      body: [
        "Direct to Cell is no longer a lab experiment. In several countries it has gone operational with mobile operators, offering messaging and some data services.",
        "But it should not be confused with the high-speed Starlink internet we get through a dish. What it carries today is text messages, a set of selected apps and voice through apps such as WhatsApp — there is no ordinary phone calling over it yet. The main goal of the current generation is closer to this: where the mobile network ends, some connection survives. For example:",
      ],
      stats: [
        { v: "~650", l: "first-generation Direct to Cell satellites" },
        { v: "7.4M", l: "devices using it each month" },
        { v: "~30", l: "countries with service" },
      ],
      statsNote: "SpaceX's figures in its 2026 prospectus, as of 31 March 2026. The satellites orbit at about 360 km.",
      uses: ["Remote roads", "Rural areas", "Mountains", "Network blind spots", "Emergencies"],
      closing: "That is why the accurate term for what it is today is something like supplemental coverage — not a replacement for the mobile network.",
    },
    iran: {
      kicker: "Iran",
      title: "So what is the situation in Iran?",
      body: [
        "As of early October 2026, Starlink has announced no public Direct to Cell service for users inside Iran. There is no credible official announcement showing that Iranian users can connect directly to Starlink today with their ordinary phone and SIM.",
        "One point matters here. Technically, the only possible scenario is not necessarily that Hamrah-e Aval or Irancell sign a contract with Starlink. In theory, scenarios involving a foreign operator, roaming or a foreign SIM/eSIM can be examined. But there is a long distance between these two:",
      ],
      gapA: "An engineer can imagine a scenario",
      gapB: "The service is usable by people in Iran today",
      gapNote: "And for now, there is no evidence for the second.",
    },
    pentagon: {
      kicker: "Washington",
      title: "The United States has looked at this too",
      body: [
        "In June 2026 a report, based on information attributed to Reuters, said the Pentagon had discussed with SpaceX the possibility of using Direct to Cell for Iranian citizens. According to the same report, figures of around $500 million to set it up and around $100 million a month were mentioned.",
      ],
      setup: "$500M",
      monthly: "$100M",
      setupLabel: "to set up, reportedly",
      monthlyLabel: "a month, reportedly",
      disputed:
        "The underlying Reuters report was published on 26 May 2026. The Pentagon called its claims “not based in reality” and Elon Musk called it “false”; Reuters said it could not confirm whether any agreement was reached.",
      butLabel: "But the problem is not only money. Even setting the political, legal and financial questions aside, there is another large one: capacity.",
    },
    switchboard: {
      kicker: "The switches",
      title: "What has to be true before it works in a country",
      lead: "Kazakhstan's launch shows what it takes. Pick a country and see which switches are on.",
      countries: { kazakhstan: "Kazakhstan", us: "United States", iran: "Iran" },
      needs: {
        satellites: { name: "Satellites overhead", body: "Starlink's Direct to Cell satellites pass over the whole planet." },
        phones: { name: "Compatible phones", body: "Most recent LTE phones can work; no special hardware is needed." },
        operator: { name: "A partner operator", body: "A mobile operator whose network the satellite service plugs into." },
        spectrum: { name: "Spectrum", body: "Radio frequencies the operator makes available to the satellite network." },
        regulator: { name: "Regulatory approval", body: "The national regulator has to permit the service." },
        core: { name: "Core network link", body: "Integration with the operator's core network, so phones are recognised and billed." },
      },
      yes: "on",
      no: "off",
      verdicts: {
        kazakhstan: "Every switch on. Service runs for areas without terrestrial coverage — for now on compatible Android phones.",
        us: "Every switch on. T-Mobile's service has been commercial since July 2025.",
        iran: "The satellites and the phones are there. Every switch that depends on agreements is off.",
      },
    },
    capacity: {
      kicker: "Capacity",
      title: "Why today's Direct to Cell cannot replace urban internet in Iran",
      body: [
        "This is where the important part of the story begins. Your phone was not designed to talk to a satellite. An ordinary phone transmits at very limited power — at most about 0.2 watts — and now this same device has to reach a satellite about 360 kilometres above the Earth, moving at more than seven kilometres a second. That is a real engineering achievement.",
        "But physics cannot be removed by advertising. Academic measurements of the Direct to Cell network show the received signal can be markedly weaker than terrestrial LTE.",
      ],
      pull: "Physics cannot be removed by advertising.",
    },
    signal: {
      title: "Received signal strength, median",
      rows: { lte: "Terrestrial LTE", dtc: "Direct to Cell" },
      weak: "weaker",
      strong: "stronger",
      reading:
        "About {db} decibels apart — roughly {x} times less power arriving. To make up for it the satellite uses large antennas, beamforming and advanced processing. But there is another fundamental limit.",
    },
    calc: {
      kicker: "Try it",
      title: "One beam, one city",
      lead: "A satellite cannot build an unlimited private channel for every phone. Radio resources are shared among everyone in an area — and one beam's footprint is tens of kilometres across, wider than a whole city. One academic study estimated about 3 Mbps per beam outdoors; that is not one user's capacity, it is shared. Pick a city and decide how many people go online at once.",
      cityLabel: "City",
      cities: { tehran: "Tehran", mashhad: "Mashhad", isfahan: "Isfahan", karaj: "Karaj", shiraz: "Shiraz", tabriz: "Tabriz" },
      popLabel: "Population (2016 census)",
      shareLabel: "Online at the same moment",
      people: "people sharing the capacity",
      beamsLabel: "Beams covering the city",
      beamsNote: "Total shared capacity: {mbps} Mbps. Being generous: real coverage of one city by many beams at once is not established.",
      perUser: "Each person gets about",
      uses: { sms: "A text message", text: "Messenger chat", voice: "A voice call", photo: "Sending a photo", web: "Loading a web page", video: "Watching video" },
      caveat:
        "A deliberately simple model: shared capacity divided evenly, ignoring signalling overhead, retransmissions and how the system schedules users. The real figures would be lower, not higher. The bitrates per use are rough orders of magnitude.",
      good: ["A driver on a remote road who wants to send a message? Great.", "A few people lost in the mountains? Very valuable.", "A village outside coverage that needs emergency contact? A remarkable use."],
      bad: "But millions of people in Tehran, Mashhad, Shiraz, Isfahan and Tabriz whose terrestrial internet has been cut, all wanting at once to watch video, make calls and open Telegram and Instagram? That is a completely different problem. The current generation was not built for that load.",
    },
    uplink: {
      kicker: "The uplink",
      title: "The next problem: from your phone to the satellite",
      body: [
        "In satellite links, one of the hardest parts is the path from phone to satellite. The satellite has a large antenna and powerful equipment. Your phone does not: it is a small device with a limited battery and an antenna designed to talk to masts on the ground.",
        "That is why a clear view of the sky matters so much. Inside a building, a car park, a basement, under a heavy roof or between tall buildings, conditions can get much worse. Direct to Cell should not be compared with ordinary LTE, where a phone indoors talks to a mast a few hundred metres or a few kilometres away.",
      ],
    },
    jamming: {
      kicker: "Jamming",
      title: "Then we come to jamming",
      lead: "This part matters a great deal for Iran. The Direct to Cell signal is inherently weak, especially from the phone up to the satellite, so deliberate interference on the ground can be a serious problem. A Starlink dish is a directional, specialised antenna — and even dishes were hit: in January 2026, Filterwatch measured packet loss of 10 to 40 percent on Starlink connections, mostly in Tehran. A phone has no such advantage.",
      on: "Switch the jammer on",
      off: "Switch it off",
      dish: {
        name: "Starlink dish",
        clear: "A narrow beam, pointed straight at the satellite.",
        jammed: "Its focused beam gives it a better chance of holding on — not a guarantee.",
      },
      phone: {
        name: "Ordinary phone",
        clear: "A weak signal, spread in every direction.",
        jammed: "Much more exposed: a little ground interference can swamp a signal this faint.",
      },
      caveat: "A schematic, not a measurement: it shows the geometry of the problem, not the outcome of any particular jammer.",
      honest:
        "But we should watch for a different exaggeration here too: saying “so the government can definitely knock Direct to Cell out completely” is not a proven claim either. The accurate conclusion: jamming is a real and serious technical threat, and any analysis of using this technology in Iran has to account for it.",
    },
    lte: {
      kicker: "The protocol",
      title: "And a stranger problem: LTE itself",
      body: [
        "One of the most attractive things about Direct to Cell is exactly that an ordinary phone does not have to become a satellite phone. But that same advantage creates a limit. LTE was designed for phones talking to masts that stand on the ground — not to a base station moving at several kilometres per second in orbit.",
        "The satellite keeps moving, the distance keeps changing, there is Doppler shift and changing latency, and the satellite a phone is using has to keep handing over to another — while the phone must still believe it is dealing with an ordinary cellular network. Measurement studies published by the ACM have observed problems like these:",
      ],
      problems: [
        { name: "Frequent access failures", body: "Attempts to connect to the satellite that do not succeed." },
        { name: "Ping-pong handovers", body: "The connection bouncing back and forth between satellites." },
        { name: "Extensive retransmissions", body: "The same data sent again and again before it gets through." },
      ],
      finding:
        "More interesting still, the researchers concluded that some of these problems do not disappear simply by launching more satellites or adding spectrum. Part of the problem comes from keeping the system compatible with existing networks and phones.",
      joke: "Engineers are stretching a protocol built for the ground up into low Earth orbit. And nature, as usual, has no interest in corporate PowerPoint.",
    },
    generations: {
      kicker: "The next generation",
      title: "What happens next?",
      lead: "This is where the story gets much more interesting. SpaceX has a far bigger plan for the second generation: bigger antennas, more spectrum and newer technology, moving towards 5G and standards better suited to non-terrestrial networks (NTN).",
      views: { system: "Whole-system capacity", perSatellite: "Throughput per satellite" },
      rows: { v1: "Today's first generation", v2: "Second generation (announced)" },
      scale: "Logarithmic scale. Hatched: announced, not yet in orbit.",
      reading:
        "The 20× and 100× figures are from SpaceX's announcement of its spectrum deal with EchoStar in September 2025; its 2026 prospectus says “orders of magnitude”. Second-generation satellites are to start launching on Starship in {year}, the spectrum deal is not expected to close until November 2027, and full 5G-NTN service needs phones with new radio hardware. If these targets are met, what is today a supplementary network for blind spots could become something far more serious. But two words matter: “if” and “future”.",
    },
    kazakhstan: {
      kicker: "The nearest example",
      title: "Kazakhstan is a good example",
      body: [
        "Kazakhstan is in fact a very good case for understanding all this. At the end of September 2026, the partnership between Beeline Kazakhstan and Starlink went operational, and Direct to Cell service was offered for places outside the terrestrial network: messages and a set of apps, free for a promotional period, and for now on compatible Android phones only. It came after a first test call — a WhatsApp audio call — in December 2025.",
      ],
      proves: ["First: the technology is real.", "Second: switching it on is the result of cooperation between Starlink, an operator, spectrum, infrastructure and a regulatory framework."],
      button: "Nobody at SpaceX presses a button on a map so that the next morning every phone in a country is connected to a satellite.",
    },
    claims: {
      kicker: "Let's sum up",
      title: "Seven questions, straight answers",
      hint: "Tap a card to see the answer.",
      claimLabel: "The question",
      verdictLabel: "The answer",
      items: [
        { claim: "Is Direct to Cell real?", verdict: "Yes", why: "It is a working technology, not a demo.", true: true },
        { claim: "Can an ordinary phone really connect to a satellite without a dish?", verdict: "Yes — with conditions", why: "On supported networks, in supported countries and in suitable conditions.", true: true },
        { claim: "Is it operational in some countries right now?", verdict: "Yes", why: "Through partner operators — for example in the US, Canada, New Zealand, Australia, Japan, Chile, Peru and Kazakhstan. SpaceX puts it at about 30 countries.", true: true },
        { claim: "Has it been switched on for ordinary users inside Iran?", verdict: "No evidence", why: "There is no credible evidence or official announcement of any such thing.", true: false },
        { claim: "Could it be switched on for Iran in the future?", verdict: "Technically, yes", why: "Practically, politically, legally and in network capacity, the story is far more complicated.", true: true },
        { claim: "Can today's generation replace high-speed internet for millions of Iranians during a shutdown?", verdict: "No", why: "Its current capacity was not designed for that.", true: false },
        { claim: "Could later generations change the equation?", verdict: "Seriously possible", why: "Especially with more capacity, dedicated spectrum and the move to 5G NTN. But that future should not be sold as today's capability.", true: true },
      ],
    },
    closing: {
      kicker: "The point",
      body: [
        "So when you see a video of someone in a remote part of the United States, New Zealand or Kazakhstan holding up their phone and sending a message through Starlink, do not conclude: “so satellite internet without a dish has been switched on in Iran too.” Those are not the same statement.",
        "Direct to Cell is in fact one of the most important changes coming to the telecom industry, and will probably blur much of the line between “mobile network” and “satellite network” over the next few years. But precisely because it is important, there is no need to exaggerate it.",
      ],
      last: "We are watching the start of a big change in telecommunications. But we have not reached the point where millions of people in Iran, during an internet shutdown, take their ordinary phone out of their pocket, choose Starlink and come back online.",
      notYet: "Not yet, at least.",
    },
    method: {
      kicker: "Method and sources",
      title: "How this was put together",
      notes: [
        "Status as of 4 October 2026. Partner operators and service details change often; each is dated and sourced.",
        "Capacity and signal figures come from an academic field study of the first-generation network in the US (IEEE Communications Magazine, June 2026). They describe that network, not the announced second generation.",
        "The city calculator is a deliberately simple model. Real per-user speeds would be lower, not higher, once signalling, retransmissions and scheduling are counted.",
        "The figures for the Pentagon talks are reported, attributed to Reuters, and were disputed by the Pentagon and by Elon Musk.",
        "On the globe, “live” means public commercial service confirmed by an operator or trade source; every other partner on Starlink's official list is shown as announced, even where it may already have launched.",
        "The globe's satellites are illustrative, not a live ephemeris.",
        "Written with the help of AI, from the documents and studies listed here. This is analysis, not advice on using any service.",
      ],
      sourcesTitle: "Sources",
      sources: [
        { label: "Starlink — Starlink Mobile (Direct to Cell): partners and service", href: "https://www.starlink.com/business/mobile" },
        { label: "SpaceX — Direct to Cell first text update, January 2024 (operator LTE spectrum; roaming-partner integration; 0.2 W phone power)", href: "https://starlink.com/public-files/DIRECT_TO_CELL_FIRST_TEXT_UPDATE.pdf" },
        { label: "Starlink — 2025 Progress Report", href: "https://www.starlink.com/progress" },
        { label: "SpaceX — Form S-1 registration statement, 2026 (figures as of 31 March 2026)", href: "https://www.sec.gov/Archives/edgar/data/1181412/000162828026036936/spaceexplorationtechnologi.htm" },
        { label: "Starlink — Constellation altitudes (V1 Direct to Cell shells at ~360 km)", href: "https://docs.space-safety.starlink.com/docs/space-safety-articles/constellation_altitudes" },
        { label: "Garcia-Cabeza J et al. — Direct-to-Cell: A first look into Starlink's direct satellite-to-device RAN through crowdsourced measurements. IEEE Communications Magazine 64(6), June 2026", href: "https://arxiv.org/abs/2506.00283" },
        { label: "Liu W et al. — A variegated look at Direct-to-Cell satellites in the wild. Proc. ACM Meas. Anal. Comput. Syst. 10(1), 2026", href: "https://doi.org/10.1145/3788086" },
        { label: "EchoStar — Spectrum agreement with SpaceX, 8 September 2025", href: "https://ir.echostar.com/node/32686" },
        { label: "Ookla via ISPreview — The size of Starlink's Direct to Cell beams, 19 August 2026", href: "https://www.ispreview.co.uk/index.php/2026/08/ookla-maps-size-of-starlinks-direct-to-cell-4g-mobile-satellite-beams.html" },
        { label: "Iran International — Direct-to-cell offers Iranians future hope, not a fix today, 27 June 2026", href: "https://www.iranintl.com/en/202606260731" },
        { label: "Reuters via CNBC — Pentagon spars with SpaceX over Starlink price hike during Iran war, 26 May 2026", href: "https://www.cnbc.com/2026/05/26/pentagon-spars-with-spacex-over-starlink-price-hike-during-iran-war.html" },
        { label: "ABC News — Pentagon denies claims of SpaceX clash, 27 May 2026", href: "https://www.abc.net.au/news/2026-05-27/pentagon-denies-claims-of-spacex-clash-during-iran-war/106725980" },
        { label: "Filterwatch — Network monitoring, January 2026 (Starlink packet loss in Tehran)", href: "https://filter.watch/english/2026/01/13/network-monitoring-january-2025-internet-repression-in-times-of-protest/" },
        { label: "Via Satellite — Kazakhstan population gets access to Starlink connectivity through Beeline, 28 September 2026", href: "https://www.satellitetoday.com/connectivity/2026/09/28/kazakhstan-population-gets-access-to-starlink-connectivity-through-beeline/" },
        { label: "PR Newswire — Starlink satellite-to-mobile service launched in Kazakhstan, 1 October 2026", href: "https://www.prnewswire.com/news-releases/starlink-satellite-to-mobile-service-launched-in-kazakhstan-302896187.html" },
        { label: "Via Satellite — Beeline Kazakhstan completes Direct to Cell call with Starlink, 15 December 2025", href: "https://www.satellitetoday.com/connectivity/2025/12/15/beeline-kazakhstan-completes-direct-to-cell-call-with-starlink-in-central-asia/" },
        { label: "Via Satellite — Verizon, AT&T and T-Mobile formally establish a joint venture for D2D services, 2 October 2026", href: "https://www.satellitetoday.com/connectivity/2026/10/02/verizon-att-and-t-mobile-formally-establish-joint-venture-for-d2d-services/" },
        { label: "T-Mobile — T-Satellite service and compatible phones", href: "https://www.t-mobile.com/coverage/satellite-phone-service" },
        { label: "Statistical Centre of Iran — 2016 census (city populations, via Wikipedia)", href: "https://en.wikipedia.org/wiki/List_of_cities_in_Iran" },
      ],
    },
    colophon: {
      shareTitle: "Starlink on an ordinary phone in Iran? · What is real today",
      disclaimer: "This is analysis, not advice on using any service, and not a technical or legal guarantee.",
      cta: "Talk to me about technology strategy",
    },
    photos: {},
  },

  fa: {
    hero: {
      kicker: "گزارش ۰۳",
      verdict:
        "حرف آخر را اول بزنم: Direct to Cell واقعی است؛ اما اینکه امروز در ایران گوشی معمولی‌تان را بردارید و بدون دیش، آنتن یا تجهیزات اضافه مستقیماً به استارلینک وصل شوید و اینترنت بگیرید، فعلاً واقعیت ندارد.",
      viral:
        "پس اگر جایی می‌بینید با تیترهایی مثل «اینترنت استارلینک مستقیم روی موبایل در ایران» یا «دیگر نیازی به دیش نیست» این فناوری را به‌عنوان یک راه‌حل عملی برای کاربران داخل ایران معرفی می‌کنند، فعلاً بیشتر با رویافروشی طرفیم تا یک سرویس در دسترس.",
      aiNote:
        "این متن را با کمک هوش مصنوعی، اما بر اساس مستندات فنی، مطالعات دانشگاهی و گزارش‌های مربوط به اپراتورها و ارائه‌دهندگان این فناوری تهیه کرده‌ام.",
      mega: "صفر",
      megaUnit: "سرویس عمومی",
      megaLabel: "که استارلینک برای کاربران داخل ایران اعلام کرده است؛ تا اکتبر ۲۰۲۶",
      asOf: "وضعیت تا ۴ اکتبر ۲۰۲۶. این حوزه سریع تغییر می‌کند؛ کنار هر عدد تاریخش آمده است.",
    },
    findings: {
      kicker: "در پنج خط",
      title: "آنچه امروز درست است",
      items: [
        "Direct to Cell واقعی است و در چند کشور، از طریق اپراتورهای موبایل شریک، به‌صورت تجاری فعال است.",
        "هیچ سرویس عمومی Direct to Cell برای کاربران داخل ایران اعلام نشده و هیچ منبع رسمی‌ای وجود چنین سرویسی را تأیید نمی‌کند.",
        "ظرفیت برآوردشده‌ی هر beam، حدود ۳ مگابیت بر ثانیه در فضای باز، بین همه‌ی کسانی که زیر آن هستند تقسیم می‌شود. برای راننده‌ای در جاده‌ی دورافتاده کافی است؛ برای شهری که اینترنتش قطع شده نه.",
        "سیگنال گوشی تا ماهواره ضعیف و همه‌جهته است و همین آن را در برابر پارازیت آسیب‌پذیرتر از دیش استارلینک می‌کند.",
        "نسل بعدی از ۲۰۲۷ به بعد ظرفیت بسیار بیشتری وعده می‌دهد. هنوز در مدار نیست و نباید کارهایی را که شاید بکند به شبکه‌ی امروز نسبت داد.",
      ],
    },
    what: {
      kicker: "ایده",
      title: "اصلاً Direct to Cell چیست؟",
      body: [
        "ایده در ظاهر ساده است: به‌جای اینکه گوشی شما حتماً به یک دکل موبایل روی زمین متصل شود، ماهواره‌ای در مدار پایین زمین بخشی از نقش ایستگاه پایه‌ی موبایل را بازی می‌کند.",
        "در نسل فعلی Starlink Direct to Cell، هدف این است که گوشی‌های سازگار بتوانند بدون دیش استارلینک و بدون آنتن ماهواره‌ای مخصوص، از طریق استانداردهای شبکه‌ی سلولی با ماهواره ارتباط برقرار کنند. یعنی برخلاف استارلینک معمولی، قرار نیست دیشی روی پشت‌بام بگذارید. این بخش کاملاً واقعی است.",
      ],
      pull: "وجود فناوری به معنی در دسترس بودن آن در هر کشور نیست.",
      body2: [
        "اما چیزی که معمولاً در ویدیوها و پست‌های وایرال حذف می‌شود این است که نسل فعلی Direct to Cell عمدتاً بر همکاری استارلینک با اپراتورهای موبایل بنا شده است. اپراتور شریک بخشی از طیف فرکانسی خود را در اختیار این شبکه می‌گذارد و شبکه‌ی ماهواره‌ای با زیرساخت اپراتور یکپارچه می‌شود. به زبان ساده: ماهواره به‌تنهایی کافی نیست. طیف فرکانسی، اپراتور، Core Network، مجوزهای رگولاتوری و مجموعه‌ای از هماهنگی‌های فنی و حقوقی هم بخشی از ماجرا هستند.",
        "البته این معماری قرار نیست برای همیشه همین بماند. SpaceX برای نسل بعدی به سمت استفاده‌ی گسترده‌تر از طیف اختصاصی ماهواره‌ای و 5G/NR-NTN حرکت می‌کند؛ پس اینکه بگوییم «Direct to Cell برای همیشه به همکاری اپراتور داخلی هر کشور نیاز دارد» هم دقیق نیست. اما درباره‌ی نسلی که امروز واقعاً در حال استفاده است، همکاری اپراتوری هنوز بخش مهمی از مدل است.",
      ],
    },
    globe: {
      title: "کجا روشن است",
      lead: "ماهواره‌ها از بالای همه‌ی کشورهای جهان، از جمله ایران، عبور می‌کنند. سرویس نه. سرویس کشوربه‌کشور و از طریق یک اپراتور محلی روشن می‌شود.",
      hint: "برای چرخاندن کره بکشید.",
      noWebgl: "این مرورگر نمی‌تواند کره‌ی سه‌بعدی را نشان دهد. فهرست کنارش همان اطلاعات را دارد.",
      iranLabel: "ایران · بدون سرویس",
      focusLabel: "کره را بچرخان به سمت",
      focus: { iran: "ایران", kazakhstan: "قزاقستان", americas: "قاره‌ی آمریکا", pacific: "استرالیا و نیوزیلند" },
      readings: {
        iran: "ایران زیر همان ماهواره‌هایی است که بقیه‌ی دنیا زیرشان هستند؛ اما نه اپراتور شریک دارد، نه توافق طیف فرکانسی و نه مجوز رگولاتوری. ماهواره‌ها هستند؛ سرویس نیست.",
        kazakhstan: "قزاقستان، آن سوی دریای خزر، نزدیک‌ترین نمونه‌ی فعال است: Beeline و استارلینک اواخر سپتامبر ۲۰۲۶، پس از توافق‌های دولت قزاقستان و استارلینک، سرویس را برای مناطق خارج از پوشش شبکه‌ی زمینی راه انداختند؛ فعلاً فقط روی گوشی‌های اندرویدی سازگار.",
        americas: "در آمریکا سرویس T-Mobile از ژوئیه‌ی ۲۰۲۵ تجاری است و در کانادا Rogers. Entel در شیلی و پرو و Liberty در کاستاریکا و پاناما این سرویس را ارائه می‌کنند.",
        pacific: "One NZ در نیوزیلند از نخستین‌ها بود، از دسامبر ۲۰۲۴. در استرالیا Telstra؛ در ژاپن KDDI، Docomo و SoftBank؛ و در فیلیپین Globe.",
      },
      legendLive: "فعال از طریق اپراتور شریک",
      legendPlanned: "شریک: اعلام‌شده، در آزمایش یا در حال راه‌اندازی",
      legendIran: "ایران",
      legendSats: "ماهواره‌ها (نمادین)",
      countries: {
        US: "آمریکا", CA: "کانادا", NZ: "نیوزیلند", AU: "استرالیا", JP: "ژاپن", CL: "شیلی",
        PE: "پرو", UA: "اوکراین", KZ: "قزاقستان", CH: "سوئیس", GB: "بریتانیا", MX: "مکزیک",
        PH: "فیلیپین", CR: "کاستاریکا", PA: "پاناما", ES: "اسپانیا", IT: "ایتالیا", UG: "اوگاندا", ZM: "زامبیا", BD: "بنگلادش", MN: "مغولستان", CD: "کنگو", KE: "کنیا", DE: "آلمان",
      },
    },
    now: {
      kicker: "امروز",
      title: "پس الان چه کاری می‌تواند انجام دهد؟",
      body: [
        "Direct to Cell امروز دیگر صرفاً یک آزمایش آزمایشگاهی نیست. در چند کشور با همکاری اپراتورهای موبایل وارد مرحله‌ی عملیاتی شده و قابلیت‌هایی مثل پیام‌رسانی و برخی سرویس‌های داده را ارائه می‌کند.",
        "اما نباید آن را با اینترنت پرسرعت استارلینک که از طریق دیش دریافت می‌کنیم یکی دانست. چیزی که امروز منتقل می‌کند پیامک، مجموعه‌ای از اپلیکیشن‌های منتخب و تماس صوتی از طریق اپ‌هایی مثل واتس‌اپ است؛ تماس تلفنی معمولی هنوز رویش نیست. هدف اصلی نسل فعلی بیشتر این است: جایی که شبکه‌ی موبایل تمام می‌شود، حداقلی از ارتباط باقی بماند. مثلاً در:",
      ],
      stats: [
        { v: "~۶۵۰", l: "ماهواره‌ی نسل اول Direct to Cell" },
        { v: "۷٫۴M", l: "دستگاه که هر ماه از آن استفاده می‌کنند" },
        { v: "~۳۰", l: "کشور دارای سرویس" },
      ],
      statsNote: "عددهای SpaceX در امیدنامه‌ی عرضه‌ی سهام ۲۰۲۶، تا ۳۱ مارس ۲۰۲۶. این ماهواره‌ها در ارتفاع حدود ۳۶۰ کیلومتری می‌چرخند.",
      uses: ["جاده‌های دورافتاده", "مناطق روستایی", "کوهستان", "نقاط کور شبکه", "شرایط اضطراری"],
      closing: "به همین دلیل اصطلاح دقیق‌تر برای وضعیت فعلی چیزی شبیه supplemental coverage یا پوشش مکمل است، نه «جایگزین شبکه‌ی موبایل».",
    },
    iran: {
      kicker: "ایران",
      title: "وضعیت ایران چیست؟",
      body: [
        "تا اوایل اکتبر ۲۰۲۶ هیچ سرویس عمومی Direct to Cell برای کاربران داخل ایران از سوی استارلینک اعلام نشده است. هیچ اعلام رسمی معتبری هم وجود ندارد که نشان دهد کاربران ایرانی می‌توانند همین امروز با سیم‌کارت و گوشی معمولی خود مستقیماً به استارلینک متصل شوند.",
        "این نکته مهم است: از نظر فنی، تنها سناریوی ممکن الزاماً این نیست که همراه اول یا ایرانسل با استارلینک قرارداد ببندند. از نظر نظری می‌توان سناریوهایی شامل اپراتور خارجی، رومینگ یا سیم‌کارت و eSIM خارجی را بررسی کرد. اما فاصله‌ی زیادی است بین:",
      ],
      gapA: "«از نظر مهندسی می‌توان سناریویی تصور کرد»",
      gapB: "«این سرویس امروز برای مردم ایران قابل استفاده است»",
      gapNote: "و فعلاً شواهدی برای دومی نداریم.",
    },
    pentagon: {
      kicker: "واشنگتن",
      title: "آمریکا هم این موضوع را بررسی کرده است",
      body: [
        "در ژوئن ۲۰۲۶ گزارشی منتشر شد که بر اساس اطلاعات منتسب به رویترز می‌گفت پنتاگون درباره‌ی امکان استفاده از Direct to Cell برای شهروندان ایرانی با SpaceX گفت‌وگو کرده است. بر اساس همان گزارش، ارقامی در حدود ۵۰۰ میلیون دلار برای راه‌اندازی و حدود ۱۰۰ میلیون دلار هزینه‌ی ماهانه مطرح شده بود.",
      ],
      setup: "$500M",
      monthly: "$100M",
      setupLabel: "برای راه‌اندازی، طبق گزارش",
      monthlyLabel: "در ماه، طبق گزارش",
      disputed:
        "گزارش اصلی رویترز در ۲۶ مه ۲۰۲۶ منتشر شد. پنتاگون ادعاهای آن را «بی‌پایه» خواند و ایلان ماسک آن را «نادرست» دانست؛ رویترز هم گفت نتوانسته تأیید کند که توافقی حاصل شده یا نه.",
      butLabel: "اما مسئله فقط پول نیست. حتی اگر مسائل سیاسی، حقوقی و مالی را کنار بگذاریم، یک مشکل بزرگ دیگر وجود دارد: ظرفیت.",
    },
    switchboard: {
      kicker: "کلیدها",
      title: "پیش از آنکه در یک کشور کار کند، چه چیزهایی باید درست باشد",
      lead: "راه‌اندازی قزاقستان نشان می‌دهد چه لازم است. یک کشور را انتخاب کنید و ببینید کدام کلیدها روشن‌اند.",
      countries: { kazakhstan: "قزاقستان", us: "آمریکا", iran: "ایران" },
      needs: {
        satellites: { name: "ماهواره در آسمان", body: "ماهواره‌های Direct to Cell استارلینک از بالای کل کره‌ی زمین عبور می‌کنند." },
        phones: { name: "گوشی سازگار", body: "بیشتر گوشی‌های LTE جدید کار می‌کنند؛ سخت‌افزار خاصی لازم نیست." },
        operator: { name: "اپراتور شریک", body: "اپراتور موبایلی که سرویس ماهواره‌ای به شبکه‌اش وصل می‌شود." },
        spectrum: { name: "طیف فرکانسی", body: "فرکانس‌هایی که اپراتور در اختیار شبکه‌ی ماهواره‌ای می‌گذارد." },
        regulator: { name: "مجوز رگولاتوری", body: "نهاد تنظیم‌گر کشور باید اجازه‌ی ارائه‌ی سرویس را بدهد." },
        core: { name: "اتصال به Core Network", body: "یکپارچگی با هسته‌ی شبکه‌ی اپراتور تا گوشی‌ها شناسایی و صورت‌حساب شوند." },
      },
      yes: "روشن",
      no: "خاموش",
      verdicts: {
        kazakhstan: "همه‌ی کلیدها روشن‌اند. سرویس برای مناطق بدون پوشش زمینی کار می‌کند؛ فعلاً روی گوشی‌های اندرویدی سازگار.",
        us: "همه‌ی کلیدها روشن‌اند. سرویس T-Mobile از ژوئیه‌ی ۲۰۲۵ تجاری است.",
        iran: "ماهواره‌ها و گوشی‌ها هستند. همه‌ی کلیدهایی که به توافق بستگی دارند خاموش‌اند.",
      },
    },
    capacity: {
      kicker: "ظرفیت",
      title: "چرا Direct to Cell فعلی نمی‌تواند جای اینترنت شهری ایران را بگیرد؟",
      body: [
        "اینجا بخش مهم داستان شروع می‌شود. گوشی موبایل شما برای صحبت با ماهواره طراحی نشده بود. یک گوشی معمولی با توان بسیار محدودی سیگنال ارسال می‌کند، حداکثر حدود ۰٫۲ وات؛ و حالا همین دستگاه قرار است با ماهواره‌ای که حدود ۳۶۰ کیلومتر بالاتر از زمین و با سرعتی بیش از هفت کیلومتر بر ثانیه در حرکت است ارتباط برقرار کند. این کار از نظر مهندسی دستاورد بزرگی است.",
        "اما فیزیک را نمی‌شود با تبلیغات حذف کرد. اندازه‌گیری‌های دانشگاهی روی شبکه‌ی Direct to Cell نشان داده‌اند که قدرت سیگنال دریافتی می‌تواند به‌طور محسوسی پایین‌تر از شبکه‌ی LTE زمینی باشد.",
      ],
      pull: "فیزیک را نمی‌شود با تبلیغات حذف کرد.",
    },
    signal: {
      title: "قدرت سیگنال دریافتی، مقدار میانه",
      rows: { lte: "LTE زمینی", dtc: "Direct to Cell" },
      weak: "ضعیف‌تر",
      strong: "قوی‌تر",
      reading:
        "تقریباً {db} دسی‌بل اختلاف؛ یعنی حدود {x} برابر توان کمتری می‌رسد. برای جبران، ماهواره از آنتن‌های بزرگ، beamforming و پردازش پیشرفته استفاده می‌کند. اما هنوز محدودیت اساسی دیگری داریم.",
    },
    calc: {
      kicker: "امتحان کنید",
      title: "یک beam، یک شهر",
      lead: "یک ماهواره نمی‌تواند برای هر گوشی یک کانال اختصاصی نامحدود بسازد. منابع رادیویی بین کاربران یک محدوده‌ی جغرافیایی تقسیم می‌شوند؛ و پهنای هر beam چند ده کیلومتر است، بزرگ‌تر از کل یک شهر. یک مطالعه‌ی دانشگاهی ظرفیت هر beam را در فضای باز حدود ۳ مگابیت بر ثانیه برآورد کرده است؛ و این ظرفیت یک کاربر نیست، ظرفیت مشترک است. یک شهر را انتخاب کنید و تعیین کنید چند نفر هم‌زمان آنلاین شوند.",
      cityLabel: "شهر",
      cities: { tehran: "تهران", mashhad: "مشهد", isfahan: "اصفهان", karaj: "کرج", shiraz: "شیراز", tabriz: "تبریز" },
      popLabel: "جمعیت (سرشماری ۱۳۹۵)",
      shareLabel: "هم‌زمان آنلاین",
      people: "نفر در حال تقسیم ظرفیت",
      beamsLabel: "تعداد beamهای روی شهر",
      beamsNote: "ظرفیت مشترک کل: {mbps} مگابیت بر ثانیه. این سخاوتمندانه است: پوشش هم‌زمان یک شهر با beamهای متعدد ثابت نشده.",
      perUser: "سهم هر نفر حدود",
      uses: { sms: "یک پیامک", text: "چت در پیام‌رسان", voice: "تماس صوتی", photo: "فرستادن عکس", web: "باز کردن یک صفحه‌ی وب", video: "تماشای ویدیو" },
      caveat:
        "مدلی عمداً ساده: ظرفیت مشترک به‌طور مساوی تقسیم شده و سربار سیگنالینگ، ارسال دوباره و نحوه‌ی زمان‌بندی کاربران در نظر گرفته نشده است. عددهای واقعی پایین‌ترند، نه بالاتر. نرخ لازم برای هر کاربرد تقریبی و در حد مرتبه‌ی بزرگی است.",
      good: ["یک راننده در جاده‌ی دورافتاده که می‌خواهد پیام بفرستد؟ عالی.", "چند نفر گمشده در کوهستان؟ بسیار ارزشمند.", "یک روستای خارج از پوشش برای ارتباط اضطراری؟ کاربرد فوق‌العاده‌ای است."],
      bad: "اما میلیون‌ها کاربر در تهران، مشهد، شیراز، اصفهان و تبریز که اینترنت زمینی‌شان قطع شده و می‌خواهند هم‌زمان ویدیو ببینند، تماس بگیرند، تلگرام و اینستاگرام باز کنند؟ این دیگر مسئله‌ی کاملاً متفاوتی است. نسل فعلی Direct to Cell برای چنین بار ترافیکی ساخته نشده است.",
    },
    uplink: {
      kicker: "Uplink",
      title: "مشکل بعدی: از گوشی تا ماهواره",
      body: [
        "در ارتباط ماهواره‌ای، یکی از سخت‌ترین قسمت‌ها مسیر گوشی به ماهواره است. ماهواره آنتن بزرگ و تجهیزات قدرتمند دارد. گوشی شما ندارد: دستگاهی کوچک با باتری محدود و آنتنی که اساساً برای ارتباط با دکل‌های زمینی طراحی شده است.",
        "به همین دلیل داشتن دید مناسب به آسمان اهمیت زیادی پیدا می‌کند. داخل ساختمان، پارکینگ، زیرزمین، زیر سقف‌های سنگین یا میان ساختمان‌های بلند، شرایط می‌تواند بسیار بدتر شود. یعنی تجربه‌ی Direct to Cell را نباید با تجربه‌ی عادی LTE مقایسه کرد که گوشی داخل خانه با دکلی چندصد متر یا چند کیلومتر آن‌طرف‌تر ارتباط دارد.",
      ],
    },
    jamming: {
      kicker: "پارازیت",
      title: "بعد می‌رسیم به پارازیت",
      lead: "این قسمت برای ایران بسیار مهم است. سیگنال Direct to Cell ذاتاً ضعیف است، مخصوصاً در مسیر گوشی به ماهواره؛ بنابراین اختلال عمدی زمینی می‌تواند مسئله‌ی جدی باشد. دیش معمولی استارلینک آنتنی جهت‌دار و تخصصی است؛ و حتی دیش‌ها هم آسیب دیدند: در ژانویه‌ی ۲۰۲۶ فیلترواچ روی اتصال‌های استارلینک، بیشتر در تهران، ۱۰ تا ۴۰ درصد گم شدن بسته اندازه گرفت. گوشی موبایل چنین مزیتی ندارد.",
      on: "پارازیت را روشن کن",
      off: "خاموشش کن",
      dish: {
        name: "دیش استارلینک",
        clear: "پرتوی باریک، مستقیم رو به ماهواره.",
        jammed: "پرتوی متمرکزش شانس بیشتری برای حفظ ارتباط می‌دهد؛ نه تضمین.",
      },
      phone: {
        name: "گوشی معمولی",
        clear: "سیگنالی ضعیف، پخش در همه‌ی جهت‌ها.",
        jammed: "بسیار آسیب‌پذیرتر: کمی اختلال زمینی می‌تواند سیگنالی به این ضعیفی را بپوشاند.",
      },
      caveat: "طرحی شماتیک است، نه اندازه‌گیری: هندسه‌ی مسئله را نشان می‌دهد، نه نتیجه‌ی هیچ پارازیت مشخصی را.",
      honest:
        "اما اینجا هم باید مراقب یک اغراق دیگر باشیم: اینکه بگوییم «پس حکومت حتماً می‌تواند Direct to Cell را به‌طور کامل از کار بیندازد» هم ادعای اثبات‌شده‌ای نیست. نتیجه‌ی دقیق‌تر این است: پارازیت یک تهدید فنی واقعی و جدی است و باید در هر تحلیلی درباره‌ی استفاده از این فناوری در ایران در نظر گرفته شود.",
    },
    lte: {
      kicker: "پروتکل",
      title: "یک مشکل عجیب‌تر هم هست: خود LTE",
      body: [
        "یکی از جذاب‌ترین ویژگی‌های Direct to Cell همین است که گوشی معمولی لازم نیست به تلفن ماهواره‌ای تبدیل شود. اما همین مزیت محدودیت ایجاد می‌کند. LTE اساساً برای ارتباط گوشی با دکل‌هایی طراحی شده که روی زمین‌اند، نه ایستگاه پایه‌ای که با سرعت چند کیلومتر بر ثانیه در مدار حرکت می‌کند.",
        "ماهواره مرتب حرکت می‌کند، فاصله تغییر می‌کند، Doppler shift و تأخیر متغیر داریم، و ماهواره‌ای که گوشی با آن در ارتباط است باید مرتب جای خود را به ماهواره‌ی دیگری بدهد؛ در حالی که گوشی همچنان باید تصور کند با یک شبکه‌ی سلولی معمولی سروکار دارد. مطالعات منتشرشده در ACM روی شبکه‌ی Direct to Cell مشکلاتی از این دست را مشاهده کرده‌اند:",
      ],
      problems: [
        { name: "شکست مکرر در دسترسی", body: "تلاش‌هایی برای اتصال به ماهواره که به نتیجه نمی‌رسند." },
        { name: "handoverهای ping-pong", body: "رفت‌وبرگشت مکرر اتصال بین ماهواره‌ها." },
        { name: "ارسال دوباره‌ی گسترده", body: "همان داده بارها فرستاده می‌شود تا برسد." },
      ],
      finding:
        "نکته‌ی جالب‌تر اینکه پژوهشگران نتیجه گرفته‌اند بخشی از این مشکلات صرفاً با فرستادن ماهواره‌های بیشتر یا اضافه کردن طیف فرکانسی ناپدید نمی‌شود. بخشی از مشکل از تلاش برای سازگار نگه داشتن سیستم با شبکه‌ها و گوشی‌های موجود می‌آید.",
      joke: "یعنی مهندسان دارند پروتکلی را که برای زمین ساخته شده تا مدار پایین زمین می‌کشند؛ و طبیعت، طبق معمول، علاقه‌ای به PowerPoint شرکت‌ها ندارد.",
    },
    generations: {
      kicker: "نسل بعدی",
      title: "نسل بعدی چه می‌شود؟",
      lead: "اینجا داستان بسیار جذاب‌تر می‌شود. SpaceX برنامه‌ی بسیار بزرگ‌تری برای نسل دوم Direct to Cell دارد: آنتن‌های بزرگ‌تر، طیف بیشتر و فناوری‌های جدیدتر، و حرکت به سمت 5G و استانداردهای مناسب‌تر برای شبکه‌های غیرزمینی یا NTN.",
      views: { system: "ظرفیت کل سیستم", perSatellite: "throughput هر ماهواره" },
      rows: { v1: "نسل اول امروز", v2: "نسل دوم (اعلام‌شده)" },
      scale: "مقیاس لگاریتمی. هاشورخورده: اعلام‌شده، هنوز در مدار نیست.",
      reading:
        "عددهای ۲۰ و ۱۰۰ برابر از اعلامیه‌ی SpaceX درباره‌ی معامله‌ی طیف با EchoStar در سپتامبر ۲۰۲۵ آمده‌اند؛ امیدنامه‌ی ۲۰۲۶ آن از «چندین مرتبه‌ی بزرگی» حرف می‌زند. ماهواره‌های نسل دوم قرار است از {year} با Starship پرتاب شوند، معامله‌ی طیف انتظار نمی‌رود پیش از نوامبر ۲۰۲۷ نهایی شود، و سرویس کامل 5G-NTN به گوشی‌هایی با سخت‌افزار رادیویی جدید نیاز دارد. اگر این اهداف عملی شوند، چیزی که امروز یک شبکه‌ی مکمل برای نقاط کور است می‌تواند به شبکه‌ای بسیار جدی‌تر تبدیل شود. اما دو کلمه مهم‌اند: «اگر» و «آینده».",
    },
    kazakhstan: {
      kicker: "نزدیک‌ترین نمونه",
      title: "قزاقستان مثال خوبی است",
      body: [
        "قزاقستان اتفاقاً نمونه‌ی بسیار خوبی برای فهمیدن ماجراست. اواخر سپتامبر ۲۰۲۶، همکاری Beeline قزاقستان و استارلینک وارد مرحله‌ی عملیاتی شد و سرویس Direct to Cell برای نقاط خارج از پوشش شبکه‌ی زمینی ارائه شد: پیام و مجموعه‌ای از اپ‌ها، رایگان در دوره‌ی تبلیغاتی، و فعلاً فقط روی گوشی‌های اندرویدی سازگار. پیش از آن، دسامبر ۲۰۲۵، نخستین تماس آزمایشی (یک تماس صوتی واتس‌اپ) انجام شده بود. این مثال دو چیز را هم‌زمان ثابت می‌کند:",
      ],
      proves: ["اول اینکه فناوری واقعی است.", "دوم اینکه فعال شدن آن نتیجه‌ی همکاری استارلینک، اپراتور، طیف فرکانسی، زیرساخت و چارچوب رگولاتوری است."],
      button: "یعنی کسی در SpaceX یک دکمه روی نقشه فشار نمی‌دهد که فردا صبح تمام موبایل‌های یک کشور به ماهواره وصل شوند.",
    },
    claims: {
      kicker: "جمع‌بندی",
      title: "هفت سؤال، هفت جواب صریح",
      hint: "روی هر کارت بزنید تا جوابش را ببینید.",
      claimLabel: "سؤال",
      verdictLabel: "جواب",
      items: [
        { claim: "آیا Direct to Cell واقعی است؟", verdict: "بله", why: "فناوری‌ای است که کار می‌کند، نه یک نمایش.", true: true },
        { claim: "آیا گوشی معمولی واقعاً می‌تواند بدون دیش به ماهواره وصل شود؟", verdict: "بله، با شرط", why: "در شبکه‌ها و کشورهای پشتیبانی‌شده و در شرایط مناسب.", true: true },
        { claim: "آیا این فناوری همین الان در بعضی کشورها عملیاتی است؟", verdict: "بله", why: "از طریق اپراتورهای شریک؛ از جمله در آمریکا، کانادا، نیوزیلند، استرالیا، ژاپن، شیلی، پرو و قزاقستان. SpaceX تعدادشان را حدود ۳۰ کشور اعلام کرده است.", true: true },
        { claim: "آیا امروز برای کاربران عمومی داخل ایران فعال شده؟", verdict: "شواهدی نیست", why: "هیچ شواهد معتبر یا اعلام رسمی‌ای برای چنین چیزی وجود ندارد.", true: false },
        { claim: "آیا ممکن است در آینده برای ایران فعال شود؟", verdict: "از نظر فنی، بله", why: "از نظر عملی، سیاسی، رگولاتوری و ظرفیت شبکه، داستان بسیار پیچیده‌تر است.", true: true },
        { claim: "آیا نسل فعلی می‌تواند در زمان قطع اینترنت، اینترنت پرسرعت میلیون‌ها ایرانی را جایگزین کند؟", verdict: "خیر", why: "ظرفیت فعلی برای چنین کاری طراحی نشده است.", true: false },
        { claim: "آیا نسل‌های بعدی می‌توانند معادله را تغییر دهند؟", verdict: "احتمالش جدی است", why: "مخصوصاً با افزایش ظرفیت، طیف اختصاصی و حرکت به سمت 5G NTN. اما آن آینده را نباید به‌عنوان قابلیت امروز فروخت.", true: true },
      ],
    },
    closing: {
      kicker: "حرف آخر",
      body: [
        "بنابراین وقتی ویدیویی می‌بینید که فردی در منطقه‌ای دورافتاده در آمریکا، نیوزیلند یا قزاقستان گوشی‌اش را بالا می‌گیرد و از طریق استارلینک پیام می‌فرستد، نتیجه نگیرید: «پس اینترنت ماهواره‌ای بدون دیش در ایران هم فعال شد.» این دو گزاره یکی نیستند.",
        "اتفاقاً Direct to Cell یکی از مهم‌ترین تحول‌های آینده‌ی صنعت مخابرات است و احتمالاً طی چند سال آینده مرز میان «شبکه‌ی موبایل» و «شبکه‌ی ماهواره‌ای» را تا حد زیادی محو خواهد کرد. اما دقیقاً چون فناوری مهمی است، نیازی نیست درباره‌اش اغراق کنیم.",
      ],
      last: "ما داریم شروع یک تغییر بزرگ در صنعت مخابرات را می‌بینیم؛ اما هنوز به نقطه‌ای نرسیده‌ایم که میلیون‌ها نفر در ایران هنگام قطع اینترنت، گوشی معمولی‌شان را از جیب دربیاورند، استارلینک را انتخاب کنند و دوباره آنلاین شوند.",
      notYet: "حداقل فعلاً نه.",
    },
    method: {
      kicker: "روش و منابع",
      title: "این گزارش چطور ساخته شد",
      notes: [
        "وضعیت تا ۴ اکتبر ۲۰۲۶. اپراتورهای شریک و جزئیات سرویس مرتب تغییر می‌کنند؛ هر مورد تاریخ و منبع دارد.",
        "عددهای ظرفیت و قدرت سیگنال از یک مطالعه‌ی میدانی دانشگاهی روی شبکه‌ی نسل اول در آمریکا آمده‌اند (IEEE Communications Magazine، ژوئن ۲۰۲۶) و همان شبکه را توصیف می‌کنند، نه نسل دوم اعلام‌شده را.",
        "ماشین‌حساب شهرها مدلی عمداً ساده است. با حساب کردن سیگنالینگ، ارسال دوباره و زمان‌بندی، سرعت واقعی هر نفر پایین‌تر می‌شود، نه بالاتر.",
        "ارقام مذاکرات پنتاگون گزارش‌شده و منتسب به رویترزند و پنتاگون و ایلان ماسک آن‌ها را رد کرده‌اند.",
        "روی کره، «فعال» یعنی سرویس تجاری عمومی که منبع اپراتور یا رسانه‌ی تخصصی تأییدش کرده؛ بقیه‌ی شرکای فهرست رسمی استارلینک «اعلام‌شده» نشان داده شده‌اند، حتی اگر شاید راه افتاده باشند.",
        "ماهواره‌های روی کره نمادین‌اند، نه موقعیت زنده‌ی ماهواره‌ها.",
        "با کمک هوش مصنوعی و بر پایه‌ی اسناد و مطالعاتی که اینجا آمده نوشته شده است. این یک تحلیل است، نه توصیه برای استفاده از هیچ سرویسی.",
      ],
      sourcesTitle: "منابع",
      sources: [
        { label: "Starlink — Starlink Mobile (Direct to Cell): partners and service", href: "https://www.starlink.com/business/mobile" },
        { label: "SpaceX — Direct to Cell first text update, January 2024 (operator LTE spectrum; roaming-partner integration; 0.2 W phone power)", href: "https://starlink.com/public-files/DIRECT_TO_CELL_FIRST_TEXT_UPDATE.pdf" },
        { label: "Starlink — 2025 Progress Report", href: "https://www.starlink.com/progress" },
        { label: "SpaceX — Form S-1 registration statement, 2026 (figures as of 31 March 2026)", href: "https://www.sec.gov/Archives/edgar/data/1181412/000162828026036936/spaceexplorationtechnologi.htm" },
        { label: "Starlink — Constellation altitudes (V1 Direct to Cell shells at ~360 km)", href: "https://docs.space-safety.starlink.com/docs/space-safety-articles/constellation_altitudes" },
        { label: "Garcia-Cabeza J et al. — Direct-to-Cell: A first look into Starlink's direct satellite-to-device RAN through crowdsourced measurements. IEEE Communications Magazine 64(6), June 2026", href: "https://arxiv.org/abs/2506.00283" },
        { label: "Liu W et al. — A variegated look at Direct-to-Cell satellites in the wild. Proc. ACM Meas. Anal. Comput. Syst. 10(1), 2026", href: "https://doi.org/10.1145/3788086" },
        { label: "EchoStar — Spectrum agreement with SpaceX, 8 September 2025", href: "https://ir.echostar.com/node/32686" },
        { label: "Ookla via ISPreview — The size of Starlink's Direct to Cell beams, 19 August 2026", href: "https://www.ispreview.co.uk/index.php/2026/08/ookla-maps-size-of-starlinks-direct-to-cell-4g-mobile-satellite-beams.html" },
        { label: "Iran International — Direct-to-cell offers Iranians future hope, not a fix today, 27 June 2026", href: "https://www.iranintl.com/en/202606260731" },
        { label: "Reuters via CNBC — Pentagon spars with SpaceX over Starlink price hike during Iran war, 26 May 2026", href: "https://www.cnbc.com/2026/05/26/pentagon-spars-with-spacex-over-starlink-price-hike-during-iran-war.html" },
        { label: "ABC News — Pentagon denies claims of SpaceX clash, 27 May 2026", href: "https://www.abc.net.au/news/2026-05-27/pentagon-denies-claims-of-spacex-clash-during-iran-war/106725980" },
        { label: "Filterwatch — Network monitoring, January 2026 (Starlink packet loss in Tehran)", href: "https://filter.watch/english/2026/01/13/network-monitoring-january-2025-internet-repression-in-times-of-protest/" },
        { label: "Via Satellite — Kazakhstan population gets access to Starlink connectivity through Beeline, 28 September 2026", href: "https://www.satellitetoday.com/connectivity/2026/09/28/kazakhstan-population-gets-access-to-starlink-connectivity-through-beeline/" },
        { label: "PR Newswire — Starlink satellite-to-mobile service launched in Kazakhstan, 1 October 2026", href: "https://www.prnewswire.com/news-releases/starlink-satellite-to-mobile-service-launched-in-kazakhstan-302896187.html" },
        { label: "Via Satellite — Beeline Kazakhstan completes Direct to Cell call with Starlink, 15 December 2025", href: "https://www.satellitetoday.com/connectivity/2025/12/15/beeline-kazakhstan-completes-direct-to-cell-call-with-starlink-in-central-asia/" },
        { label: "Via Satellite — Verizon, AT&T and T-Mobile formally establish a joint venture for D2D services, 2 October 2026", href: "https://www.satellitetoday.com/connectivity/2026/10/02/verizon-att-and-t-mobile-formally-establish-joint-venture-for-d2d-services/" },
        { label: "T-Mobile — T-Satellite service and compatible phones", href: "https://www.t-mobile.com/coverage/satellite-phone-service" },
        { label: "Statistical Centre of Iran — 2016 census (city populations, via Wikipedia)", href: "https://en.wikipedia.org/wiki/List_of_cities_in_Iran" },
      ],
    },
    colophon: {
      shareTitle: "استارلینک روی گوشی معمولی در ایران؟ · آنچه امروز واقعی است",
      disclaimer: "این یک تحلیل است، نه توصیه برای استفاده از هیچ سرویسی، و تضمین فنی یا حقوقی نیست.",
      cta: "درباره‌ی استراتژی فناوری با من صحبت کنید",
    },
    photos: {},
  },
}
