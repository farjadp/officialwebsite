// ============================================================================
// File Path: src/components/v3/reports/undecided-fifth/copy.ts
// Why: Every word of report 08 in both locales, one structure for both. The
//      English follows Farjad's own analysis ("The Undecided Fifth") and keeps
//      its discipline: the survey is described as what it measured, not as a
//      result; every derived number is marked as derived; the what-if map is
//      labelled a model with its method and its limits; the two readings get
//      equal room; and the piece takes no side. The Persian says the same.
// ============================================================================

import type { Locale } from "@/lib/nav"
import type { Block, EngageKey, GroupKey } from "./data"

export type MedalKey = "chart" | "margins" | "pool" | "engagement" | "game" | "map"

type Copy = {
  hero: { kicker: string; lead: string; byline: string; kpis: { n: string; l: string; d: string }[]; medals: string; timing: { title: string; body: string } }
  groups: Record<GroupKey, string>
  blocks: Record<Block, string>
  party: { dem: string; rep: string; und: string; demShort: string; repShort: string; even: string }
  chart: { kicker: string; title: string; lead: string; heading: string; caption: string; hint: string; readout: (g: string, d: string, r: string, u: string, lean: string) => string }
  margins: {
    kicker: string
    title: string
    lead: string
    heading: string
    sub: string
    byMargin: string
    byGroup: string
    caption: string
    intro: string
    patterns: { title: string; body: string }[]
  }
  pool: {
    kicker: string
    title: string
    lead: string
    pull: string
    rankTitle: string
    rankCaption: string
    body: string[]
    breakTitle: string
    breakLead: string
    slider: string
    toRep: (p: string) => string
    readout: (d: string, r: string) => string
    leadLabel: (lean: string) => string
    tied: string
    breakEven: (p: string) => string
    breakNote: string
  }
  consolidation: { kicker: string; title: string; lead: string; caption: string; body: string[]; callout: { title: string; body: string } }
  engagement: {
    kicker: string
    title: string
    lead: string
    measures: Record<EngageKey, string>
    demSup: string
    repSup: string
    year: string
    caption: string
    gap: (lean: string) => string
    moodTitle: string
    mood: { n: string; l: string }[]
    moodNote: string
  }
  model: {
    kicker: string
    title: string
    lead: string
    warn: { title: string; method: string; breaks: string }
    gameTitle: string
    gameLead: string
    explorerTitle: string
    explorerCaption: string
    lessons: string
  }
  game: {
    progress: (i: string, n: string) => string
    finished: string
    score: (s: string, max: string) => string
    who: Record<GroupKey, string>
    states: Record<string, string>
    qCount: (who: string) => string
    qState: (who: string, state: string) => string
    guess: string
    lock: string
    countHead: (ans: string, g: string, pts: string) => string
    countBody: (group: string, lean: string, shift: string) => string
    right: string
    wrong: string
    stateHead: (verdict: string, state: string, lean: string, pts: string) => string
    stateBody: (base: string, group: string, lean: string, shift: string) => string
    close: string
    next: string
    finish: string
    again: string
    ranks: [string, string, string, string]
    final: string
  }
  explorer: {
    baseline: string
    baselineNote: string
    shift: (group: string, lean: string, shift: string, toward: string) => string
    tally: { dem: string; rep: string; close: string }
    flips: (n: string) => string
    noFlips: string
    key: { strong: string; lean: string; close: string }
    toward: { dem: string; rep: string }
  }
  readings: { kicker: string; title: string; solid: { title: string; items: string[] }; soft: { title: string; items: string[] }; after: string }
  takeaway: { kicker: string; title: string; body: string }
  notes: { kicker: string; title: string; items: { t: string; b: string }[] }
  medals: { title: string; hint: string; names: Record<MedalKey, string>; complete: string; open: string; close: string }
  method: { sourcesTitle: string; sources: { label: string; href: string }[]; footnote: string }
  colophon: { shareTitle: string; disclaimer: string; cta: string }
}

const SOURCES = [
  {
    label: "Pew Research Center, Midterm Vote Preferences by Race and Ethnicity, Age and Other Demographics (Oct. 8, 2026)",
    href: "https://www.pewresearch.org/politics/2026/10/08/midterm-vote-preferences-by-race-and-ethnicity-age-and-other-demographics/",
  },
  {
    label: "Pew Research Center, With Americans in a Sour Mood, Democratic Voters Are More Engaged in Midterms (Oct. 8, 2026)",
    href: "https://www.pewresearch.org/politics/2026/10/08/with-americans-in-a-sour-mood-democratic-voters-are-more-engaged-in-midterms/",
  },
  {
    label: "Pew Research Center, full report and methodology (PDF)",
    href: "https://www.pewresearch.org/wp-content/uploads/sites/20/2026/10/PP_2026.10.8_midterms_report.pdf",
  },
  {
    label: "The American Presidency Project, UC Santa Barbara, 2024 presidential election results by state",
    href: "https://www.presidency.ucsb.edu/statistics/elections/2024",
  },
]

const STATES_EN: Record<string, string> = { TX: "Texas", CA: "California", FL: "Florida", PA: "Pennsylvania", WY: "Wyoming", OH: "Ohio" }
const STATES_FA: Record<string, string> = { TX: "تگزاس", CA: "کالیفرنیا", FL: "فلوریدا", PA: "پنسیلوانیا", WY: "وایومینگ", OH: "اوهایو" }

export const COPY: Record<Locale, Copy> = {
  en: {
    hero: {
      kicker: "Reports",
      lead: "Pew's last major survey before the 2026 midterms gave Democratic House candidates a 44% to 36% edge among registered voters. The headline was the eight points. The more telling number sat in the column on the right: one voter in five chose another candidate or was not sure, even after being asked which way they leaned. And they were not spread evenly.",
      byline: "An analysis of Pew Research Center data. Survey fielded Sept. 28 – Oct. 4, 2026.",
      kpis: [
        { n: "44%", l: "Democratic candidate", d: "all registered voters" },
        { n: "36%", l: "Republican candidate", d: "all registered voters" },
        { n: "20%", l: "Another candidate or not sure", d: "5% other, 15% not sure" },
        { n: "9 pts", l: "Consolidation gap", d: "82% of the Democratic side backed its party; 73% of the Republican side did" },
      ],
      medals: "Each interactive figure awards a badge the first time you use it. There are six.",
      timing: {
        title: "A note on timing, before anything else",
        body: "This survey was taken a month before Election Day, among registered voters, not likely voters. The election was held on November 3. This piece is about what the survey measured and how to read it. It is not an account of the results, and a registered-voter poll in early October should not be read as one.",
      },
    },
    groups: {
      all: "All registered voters",
      men: "Men",
      women: "Women",
      white: "White",
      hispanic: "Hispanic",
      black: "Black",
      asian: "Asian*",
      a18: "Ages 18–29",
      a30: "30–49",
      a50: "50–64",
      a65: "65+",
      postgrad: "Postgrad",
      college: "College grad",
      someCollege: "Some college",
      hs: "HS or less",
      repLean: "Rep/Lean Rep",
      rep: "Republican",
      leanRep: "Lean Rep",
      demLean: "Dem/Lean Dem",
      dem: "Democrat",
      leanDem: "Lean Dem",
      ind: "Ind/other, incl. leaners",
    },
    blocks: { all: "Total", gender: "Gender", race: "Race and ethnicity", age: "Age", edu: "Education", party: "Party" },
    party: { dem: "Democratic candidate", rep: "Republican candidate", und: "Other / not sure", demShort: "D", repShort: "R", even: "Even" },
    chart: {
      kicker: "1 · The whole chart",
      title: "The full picture, group by group",
      lead: "Here is the survey's central chart, rebuilt. Blue bars run toward the Democratic candidate, red toward the Republican, and the gold column is everyone who chose another candidate or was not sure. Tap a row to read it.",
      heading: "House vote preference among registered voters",
      caption: "% of registered voters who would vote for, or lean toward, each party's candidate for U.S. House if the election were held today. Respondents saw the named candidates in their own district. *Asian estimates represent English speakers only. Source: Pew Research Center, survey of Sept. 28 – Oct. 4, 2026.",
      hint: "Tap or hover a row",
      readout: (g, d, r, u, lean) => `${g}: ${d} for the Democratic candidate, ${r} for the Republican, ${u} other or not sure. Margin ${lean}.`,
    },
    margins: {
      kicker: "2 · Where the lead came from",
      title: "Subtract one side from the other",
      lead: "Take the Republican share from the Democratic share in each group and the survey's structure is easier to see.",
      heading: "Democratic margin by group, in points",
      sub: "Democratic share minus Republican share. Party rows are left out because they are near-tautological.",
      byMargin: "Sort by margin",
      byGroup: "Group order",
      caption: "Margins calculated from Pew's published shares. Small margins — men (0), 65 and older (+3), some college (+4), high school or less (−4) — sit close enough to zero that sampling error alone could account for them.",
      intro: "The Democratic advantage was widest among Black voters (63 points), Asian voters (40), voters under 30 (28), postgraduates (28) and Hispanic voters (27). Republican candidates led in three groups: White voters by 7, voters aged 50 to 64 by 6, and voters with a high school education or less by 4. Three patterns stand out, and each cuts against a simple story.",
      patterns: [
        {
          title: "The gender gap was one-sided",
          body: "Men split exactly evenly, 42% to 42%. Women favoured Democratic candidates by 14 points, but were also far more likely to be uncommitted: 24% against 16% of men. The gap came less from women being more Democratic than men (45% against 42%) than from fewer women choosing the Republican candidate (31% against 42%).",
        },
        {
          title: "Age did not run in a straight line",
          body: "Voters under 30 leaned Democratic by 28 points and voters aged 50 to 64 leaned Republican by 6. Yet the oldest group, 65 and over, tilted back to Democratic candidates by 3. The familiar assumption that support moves steadily rightward with age does not describe this data.",
        },
        {
          title: "Education sorted voters cleanly",
          body: "The Democratic margin climbed at every step: −4 among those with a high school education or less, +4 with some college, +15 among college graduates, +28 among postgraduates. Only race and party sorted voters more sharply.",
        },
      ],
    },
    pool: {
      kicker: "3 · The undecided",
      title: "The number that mattered more than the margin",
      lead: "And the uncommitted were not a random slice of the electorate. They were concentrated in specific places.",
      pull: "The uncommitted share, 20%, was two and a half times the size of the lead. Any reading of this poll that treats the eight points as settled is reading less than half of the chart.",
      rankTitle: "Share choosing another candidate or not sure",
      rankCaption: "Source: Pew Research Center, Sept. 28 – Oct. 4, 2026. Registered voters.",
      body: [
        "Among the least committed groups were Republican-leaning independents (38%), independents and other-party identifiers, leaners included (36%), Asian voters (27%), voters with a high school education or less (26%) and voters aged 30 to 49 (26%). The most committed were self-identified Democrats (10%), Republicans (12%) and postgraduates (12%).",
        "That profile matters for a practical reason. Younger voters and voters without college degrees are, historically, the groups least likely to turn out in midterms, and independents who lean to neither party are the least likely to say they voted. A share of that gold column was never going to become votes for anyone. A registered-voter survey cannot tell you which share.",
      ],
      breakTitle: "How lopsided would the undecided have to break?",
      breakLead: "Pure arithmetic, not a forecast. Suppose all 15% who said “not sure” picked one of the two parties, and the 5% already choosing someone else stayed put. Drag to set how many of the not-sure voters go Republican.",
      slider: "Share of not-sure voters breaking Republican",
      toRep: (p) => `${p} break Republican`,
      readout: (d, r) => `Democratic ${d} · Republican ${r}`,
      leadLabel: (lean) => `Lead: ${lean}`,
      tied: "Tied",
      breakEven: (p) => `The lead disappears only when about ${p} of the not-sure voters break Republican.`,
      breakNote: "Undecided voters rarely break that lopsidedly, and many of them do not vote at all. That is why the 20% matters, and also why it cannot be read as a hidden Republican vote.",
    },
    consolidation: {
      kicker: "4 · Each side's own voters",
      title: "A consolidation gap, not just a persuasion gap",
      lead: "The party rows at the bottom of the chart hold what may be the survey's most important structural finding: each party's own side was not equally locked in.",
      caption: "All shares are Pew's, including the small cross-party slivers. Rows may not sum to 100 because of rounding.",
      body: [
        "Among Democrats and Democratic leaners, 82% backed the Democratic candidate. Among Republicans and Republican leaners, 73% backed the Republican. Almost nobody crossed over in either direction: 6% of the Republican side chose a Democrat, 2% of the Democratic side chose a Republican.",
        "The difference was in the leaners. Only 53% of Republican-leaning independents said they would vote Republican, with 38% uncommitted. Among Democratic-leaning independents, 72% were on board and 25% uncommitted. The eight-point lead owed at least as much to soft Republican-side voters sitting on the fence as it did to anyone changing sides.",
      ],
      callout: {
        title: "Why the distinction matters",
        body: "Voters who have switched parties are hard to win back. Voters parked in “not sure” who lean your way are, in most cycles, the easiest voters to bring home late. A lead built on the second kind is real, but more fragile than one built on the first.",
      },
    },
    engagement: {
      kicker: "5 · Engagement",
      title: "The engagement picture had flipped since 2022",
      lead: "The same survey asked how much the election mattered to voters. On all three of Pew's measures, supporters of Democratic candidates were more engaged than supporters of Republican candidates — a reversal of the pattern Pew recorded in October 2022. Switch years to watch it turn.",
      measures: { matters: "“Really matters” who wins", thought: "Thought “a lot” about the election", motivated: "“Extremely motivated” to vote" },
      demSup: "Supporters of Democratic candidates",
      repSup: "Supporters of Republican candidates",
      year: "October",
      caption: "Source: Pew Research Center, “With Americans in a Sour Mood, Democratic Voters Are More Engaged in Midterms,” Oct. 8, 2026.",
      gap: (lean) => `Gap ${lean}`,
      moodTitle: "The backdrop",
      mood: [
        { n: "22%", l: "of all U.S. adults satisfied with the way things are going" },
        { n: "84%", l: "of registered voters call the economy very important to their vote" },
        { n: "63%", l: "say the president is a factor in their vote: 44% against him, 19% for him" },
        { n: "30%", l: "presidential approval among all U.S. adults" },
      ],
      moodNote: "Midterms have often worked against the party holding the White House, and these numbers fit that long-running pattern rather than breaking it.",
    },
    model: {
      kicker: "6 · A thought experiment",
      title: "What if only one group voted?",
      lead: "“If only women voted” maps are a long-standing device in data journalism. Nobody is proposing to restrict the vote; the point is to see how much the shape of the electorate decides the outcome. Pew's survey is national and has no state-level numbers, so the map below is a simulation with one stated assumption, not survey data.",
      warn: {
        title: "How the model works, and where it breaks",
        method: "Method: each state starts from its certified 2024 presidential margin. The whole map is then shifted by the difference between a group's national margin in the Pew survey and the 2024 national margin (R+1.5). This is a uniform swing.",
        breaks: "Where it breaks: groups do not vote the same way everywhere. White voters in Vermont and White voters in Mississippi are far apart, and a uniform swing cannot see that. The baseline is a presidential race, the survey asks about House races, and it covers registered voters a month before the election. Read the map for direction and scale. It is not a forecast and not a result.",
      },
      gameTitle: "Guess first: 10 questions, 100 points",
      gameLead: "Commit to a guess before you see the map. A wrong guess made first is remembered better than a right answer read cold.",
      explorerTitle: "Then explore the model yourself",
      explorerCaption: "Each square is one state, plus D.C. Model: the 2024 certified presidential margin by state, shifted uniformly by the group's national margin in Pew's Sept. 28 – Oct. 4, 2026 survey. 2024 results: The American Presidency Project, UC Santa Barbara.",
      lessons: "Two things the model does show reliably. First, how lopsided some groups are: among voters under 30, the shift is large enough that even states Republicans won by 25 points in 2024 change colour. Second, how little some shifts move: with men only, the map is almost the 2024 map, because men split evenly and 2024 was close to even. The model says nothing trustworthy about any single state.",
    },
    game: {
      progress: (i, n) => `Question ${i} of ${n}`,
      finished: "Finished",
      score: (s, max) => `${s} / ${max} points`,
      who: {
        all: "registered voters as a whole",
        men: "men",
        women: "women",
        white: "White voters",
        hispanic: "Hispanic voters",
        black: "Black voters",
        asian: "Asian voters",
        a18: "voters under 30",
        a30: "voters aged 30 to 49",
        a50: "voters aged 50 to 64",
        a65: "voters 65 and older",
        postgrad: "voters with a postgraduate degree",
        college: "college graduates",
        someCollege: "voters with some college",
        hs: "voters with a high school education or less",
        repLean: "Republicans and leaners",
        rep: "Republicans",
        leanRep: "Republican leaners",
        demLean: "Democrats and leaners",
        dem: "Democrats",
        leanDem: "Democratic leaners",
        ind: "independents and other-party voters, leaners included",
      },
      states: STATES_EN,
      qCount: (who) => `If only ${who} voted, how many of the 50 states plus D.C. would lean Democratic under the model?`,
      qState: (who, state) => `If only ${who} voted, which way would ${state} lean under the model?`,
      guess: "Your guess",
      lock: "Lock in my guess",
      countHead: (ans, g, pts) => `The model says ${ans} of 51. You said ${g}. +${pts}`,
      countBody: (group, lean, shift) => `${group}: ${lean} nationally in the survey, a shift of ${shift} points on every state's 2024 margin.`,
      right: "Correct",
      wrong: "Not this time",
      stateHead: (verdict, state, lean, pts) => `${verdict}: ${state} comes out ${lean}. +${pts}`,
      stateBody: (base, group, lean, shift) => `2024 baseline ${base}; ${group} were ${lean} nationally, a shift of ${shift} points.`,
      close: " That is inside the 3-point band, so treat it as a coin flip.",
      next: "Next question",
      finish: "See my score",
      again: "Play again",
      ranks: ["Map reader", "Solid instincts", "Learning the terrain", "The map surprised you"],
      final: "The usual lesson: people underestimate how far a lopsided group moves the map, and overestimate how much an evenly split group does. Every answer here came from a uniform-swing model, not from state-level data.",
    },
    explorer: {
      baseline: "2024 baseline",
      baselineNote: "The certified 2024 presidential result in each state. No shift applied.",
      shift: (group, lean, shift, toward) => `${group}: ${lean} nationally in the Pew survey. Every state is shifted ${shift} points toward ${toward} from its 2024 margin.`,
      tally: { dem: "lean Democratic", rep: "lean Republican", close: "within 3 points" },
      flips: (n) => `Changes side versus 2024 (${n}):`,
      noFlips: "No state changes side versus 2024.",
      key: { strong: "by 10+", lean: "by 3–10", close: "within 3 points" },
      toward: { dem: "Democratic candidates", rep: "Republican candidates" },
    },
    readings: {
      kicker: "7 · Two fair readings",
      title: "Two fair readings of the same data",
      solid: {
        title: "The case that the lead was solid",
        items: [
          "Eight points among registered voters, with an engagement advantage on every measure Pew tracks.",
          "Democratic-side voters were already consolidated at 82%.",
          "Leads among young, Hispanic and college-educated voters were wide, not marginal.",
          "National dissatisfaction and presidential approval pointed the same way.",
        ],
      },
      soft: {
        title: "The case that it was softer than it looked",
        items: [
          "The uncommitted pool was more than twice the lead.",
          "The biggest undecided bloc, Republican leaners at 38%, leaned Republican by definition.",
          "Registered voters are not the electorate; midterm turnout skews older, where the race was close.",
          "A national House preference does not map directly onto 435 district contests.",
        ],
      },
      after: "Both readings use the same chart honestly. Which one better described the electorate is a question for the certified results and the post-election validated-voter studies, not for this survey.",
    },
    takeaway: {
      kicker: "The takeaway",
      title: "Not “ahead by eight”",
      body: "The chart is usually shared for its top line, and the top line was accurate as far as it went: an eight-point Democratic edge among registered voters a month out. But the structure underneath is the more durable lesson. The parties were barely trading voters. The contest in this survey was between one side that had largely come home and another whose leaners had not yet decided whether to show up for it — among registered voters a fifth of whom had still not chosen either party. That is a different, and more precise, claim than “one party is ahead by eight.”",
    },
    notes: {
      kicker: "How to read a chart like this",
      title: "Six cautions",
      items: [
        { t: "Registered voters, not likely voters", b: "The survey describes everyone on the rolls. The people who actually vote in a midterm are a smaller and different group." },
        { t: "Subgroups carry wider error", b: "The full sample was 3,917 registered voters, but each row of the chart rests on far fewer interviews. A 3- or 4-point gap inside a subgroup — men, voters 65+, some college — should be treated as roughly even." },
        { t: "The Asian estimate has a stated limit", b: "Pew notes it represents English speakers only. It does not describe all Asian American voters." },
        { t: "A snapshot, a month out", b: "Fieldwork ended October 4. “If the election were held today” is not a forecast of November 3." },
        { t: "National vote is not seats", b: "The question asks about the House race in each respondent's district, but the aggregate says nothing about how those votes are spread across districts." },
        { t: "Groups overlap", b: "Age, education, race and party are tangled together. The chart shows each cut separately and cannot say which factor is doing the work." },
      ],
    },
    medals: {
      title: "Chart-reader badges",
      hint: "One for each interactive figure.",
      names: { chart: "Row reader", margins: "Margin sorter", pool: "Fence counter", engagement: "Time traveller", game: "Map guesser", map: "Model explorer" },
      complete: "All six. You have read this chart more carefully than most people who shared it.",
      open: "Your badges",
      close: "Close",
    },
    method: {
      sourcesTitle: "Sources",
      sources: SOURCES,
      footnote: "Survey of 5,062 U.S. adults, including 3,917 registered voters, on Pew's American Trends Panel, Sept. 28 – Oct. 4, 2026. Margins, rankings and the map are calculated from Pew's published percentages; the interpretation is the author's, not Pew's. This analysis takes no position on any party or candidate.",
    },
    colophon: {
      shareTitle: "The Undecided Fifth — what Pew's last big pre-midterm poll really measured",
      disclaimer: "Analysis of published survey data, for education. Not a forecast, not an account of the 2026 results, and not an endorsement of any party or candidate.",
      cta: "Book a session",
    },
  },
  fa: {
    hero: {
      kicker: "گزارش‌ها",
      lead: "آخرین نظرسنجی بزرگ مرکز تحقیقات پیو پیش از انتخابات میان‌دوره‌ای ۲۰۲۶ آمریکا، به نامزدهای دموکرات مجلس نمایندگان در میان رأی‌دهندگان ثبت‌نام‌شده ۴۴٪ در برابر ۳۶٪ برتری داد. تیتر همان هشت امتیاز بود. اما عدد گویاتر در ستون سمت راست نشسته بود: از هر پنج رأی‌دهنده یک نفر، حتی بعد از این که پرسیدند به کدام طرف متمایل است، نامزد دیگری را انتخاب کرد یا مطمئن نبود. و این آدم‌ها یکنواخت پخش نشده بودند.",
      byline: "تحلیل داده‌های مرکز تحقیقات پیو. نظرسنجی از ۲۸ سپتامبر تا ۴ اکتبر ۲۰۲۶.",
      kpis: [
        { n: "۴۴٪", l: "نامزد دموکرات", d: "کل رأی‌دهندگان ثبت‌نام‌شده" },
        { n: "۳۶٪", l: "نامزد جمهوری‌خواه", d: "کل رأی‌دهندگان ثبت‌نام‌شده" },
        { n: "۲۰٪", l: "نامزد دیگر یا مطمئن نیستم", d: "۵٪ نامزد دیگر، ۱۵٪ مطمئن نیستم" },
        { n: "۹ امتیاز", l: "شکاف یکپارچگی", d: "۸۲٪ طرف دموکرات پشت حزبش بود؛ در طرف جمهوری‌خواه ۷۳٪" },
      ],
      medals: "هر نمودار تعاملی بار اولی که با آن کار کنی یک نشان می‌دهد. شش نشان در این صفحه هست.",
      timing: {
        title: "پیش از هر چیز، یک نکته درباره‌ی زمان",
        body: "این نظرسنجی یک ماه پیش از روز انتخابات و در میان رأی‌دهندگان ثبت‌نام‌شده گرفته شده، نه رأی‌دهندگان محتمل. انتخابات ۳ نوامبر برگزار شد. این نوشته درباره‌ی این است که نظرسنجی چه چیزی را سنجید و چطور باید خواندش. گزارش نتایج نیست، و نظرسنجیِ رأی‌دهندگان ثبت‌نام‌شده در اوایل اکتبر را نباید جای نتیجه خواند.",
      },
    },
    groups: {
      all: "کل رأی‌دهندگان ثبت‌نام‌شده",
      men: "مردان",
      women: "زنان",
      white: "سفیدپوست",
      hispanic: "هیسپانیک",
      black: "سیاه‌پوست",
      asian: "آسیایی*",
      a18: "۱۸ تا ۲۹ سال",
      a30: "۳۰ تا ۴۹",
      a50: "۵۰ تا ۶۴",
      a65: "۶۵ به بالا",
      postgrad: "تحصیلات تکمیلی",
      college: "لیسانس",
      someCollege: "دانشگاه نیمه‌تمام",
      hs: "دیپلم یا کمتر",
      repLean: "جمهوری‌خواه و متمایل",
      rep: "جمهوری‌خواه",
      leanRep: "متمایل به جمهوری‌خواه",
      demLean: "دموکرات و متمایل",
      dem: "دموکرات",
      leanDem: "متمایل به دموکرات",
      ind: "مستقل/دیگر، با متمایل‌ها",
    },
    blocks: { all: "کل", gender: "جنسیت", race: "نژاد و قومیت", age: "سن", edu: "تحصیلات", party: "حزب" },
    party: { dem: "نامزد دموکرات", rep: "نامزد جمهوری‌خواه", und: "دیگر / مطمئن نیستم", demShort: "دموکرات", repShort: "جمهوری‌خواه", even: "مساوی" },
    chart: {
      kicker: "۱ · کل نمودار",
      title: "تصویر کامل، گروه به گروه",
      lead: "این نمودار اصلی نظرسنجی است، از نو ساخته شده. میله‌های آبی سهم نامزد دموکرات‌اند، قرمزها سهم نامزد جمهوری‌خواه، و ستون طلایی همه‌ی کسانی که نامزد دیگری را انتخاب کردند یا مطمئن نبودند. روی هر ردیف بزن تا بخوانی‌اش.",
      heading: "ترجیح رأی برای مجلس نمایندگان، در میان رأی‌دهندگان ثبت‌نام‌شده",
      caption: "درصد رأی‌دهندگان ثبت‌نام‌شده‌ای که اگر انتخابات امروز بود، به نامزد هر حزب برای مجلس نمایندگان رأی می‌دادند یا به او متمایل بودند. پاسخ‌دهنده‌ها نام نامزدهای حوزه‌ی خودشان را می‌دیدند. *برآورد آسیایی‌ها فقط انگلیسی‌زبان‌ها را نمایندگی می‌کند. منبع: مرکز تحقیقات پیو، نظرسنجی ۲۸ سپتامبر تا ۴ اکتبر ۲۰۲۶.",
      hint: "روی یک ردیف بزن",
      readout: (g, d, r, u, lean) => `${g}: ${d} نامزد دموکرات، ${r} نامزد جمهوری‌خواه، ${u} دیگر یا مطمئن نیستم. فاصله: ${lean}.`,
    },
    margins: {
      kicker: "۲ · برتری از کجا آمد",
      title: "یک طرف را از طرف دیگر کم کن",
      lead: "در هر گروه سهم جمهوری‌خواه را از سهم دموکرات کم کن تا ساختار نظرسنجی راحت‌تر دیده شود.",
      heading: "فاصله‌ی دموکرات‌ها در هر گروه، به امتیاز",
      sub: "سهم دموکرات منهای سهم جمهوری‌خواه. ردیف‌های حزبی کنار گذاشته شده‌اند، چون تقریباً همان‌گویی‌اند.",
      byMargin: "مرتب بر اساس فاصله",
      byGroup: "ترتیب گروه‌ها",
      caption: "فاصله‌ها از درصدهای منتشرشده‌ی پیو حساب شده‌اند. فاصله‌های کوچک، یعنی مردان (صفر)، ۶۵ سال به بالا (\u200E+۳)، دانشگاه نیمه‌تمام (\u200E+۴) و دیپلم یا کمتر (\u200E−۴)، آن‌قدر به صفر نزدیک‌اند که خطای نمونه‌گیری به تنهایی می‌تواند توضیحشان بدهد.",
      intro: "برتری دموکرات‌ها در میان سیاه‌پوستان از همه بیشتر بود (۶۳ امتیاز)، بعد آسیایی‌ها (۴۰)، زیر ۳۰ ساله‌ها (۲۸)، دارندگان تحصیلات تکمیلی (۲۸) و هیسپانیک‌ها (۲۷). نامزدهای جمهوری‌خواه در سه گروه جلو بودند: سفیدپوستان با ۷ امتیاز، ۵۰ تا ۶۴ ساله‌ها با ۶ و دیپلم یا کمتر با ۴. سه الگو برجسته است و هر کدام یک روایت ساده را نقض می‌کند.",
      patterns: [
        {
          title: "شکاف جنسیتی یک‌طرفه بود",
          body: "مردان دقیقاً نصف‌نصف بودند: ۴۲٪ در برابر ۴۲٪. زنان ۱۴ امتیاز به نفع دموکرات‌ها بودند، اما خیلی بیشتر هم بی‌تصمیم بودند: ۲۴٪ در برابر ۱۶٪ مردان. شکاف کمتر از این آمد که زنان دموکرات‌تر از مردان باشند (۴۵٪ در برابر ۴۲٪) و بیشتر از این که زنان کمتری نامزد جمهوری‌خواه را انتخاب کردند (۳۱٪ در برابر ۴۲٪).",
        },
        {
          title: "سن در یک خط مستقیم حرکت نکرد",
          body: "زیر ۳۰ ساله‌ها ۲۸ امتیاز به سمت دموکرات‌ها بودند و ۵۰ تا ۶۴ ساله‌ها ۶ امتیاز به سمت جمهوری‌خواه‌ها. اما مسن‌ترین گروه، ۶۵ سال به بالا، دوباره ۳ امتیاز به سمت دموکرات‌ها برگشت. این فرض آشنا که با بالا رفتن سن، حمایت پیوسته به راست می‌رود، این داده را توصیف نمی‌کند.",
        },
        {
          title: "تحصیلات رأی‌دهنده‌ها را تمیز جدا کرد",
          body: "فاصله‌ی دموکرات‌ها در هر پله بالا رفت: \u200E−۴ در دیپلم یا کمتر، \u200E+۴ در دانشگاه نیمه‌تمام، \u200E+۱۵ در لیسانس، \u200E+۲۸ در تحصیلات تکمیلی. فقط نژاد و حزب رأی‌دهنده‌ها را تیزتر از این جدا کردند.",
        },
      ],
    },
    pool: {
      kicker: "۳ · بی‌تصمیم‌ها",
      title: "عددی که از فاصله مهم‌تر بود",
      lead: "و بی‌تصمیم‌ها برش تصادفی‌ای از رأی‌دهندگان نبودند. در جاهای مشخصی جمع شده بودند.",
      pull: "سهم بی‌تصمیم‌ها، ۲۰٪، دو و نیم برابر برتری بود. هر خوانشی از این نظرسنجی که آن هشت امتیاز را قطعی بگیرد، کمتر از نیمی از نمودار را خوانده است.",
      rankTitle: "سهم کسانی که نامزد دیگری را انتخاب کردند یا مطمئن نبودند",
      rankCaption: "منبع: مرکز تحقیقات پیو، ۲۸ سپتامبر تا ۴ اکتبر ۲۰۲۶. رأی‌دهندگان ثبت‌نام‌شده.",
      body: [
        "از کم‌تعهدترین گروه‌ها: مستقل‌های متمایل به جمهوری‌خواه (۳۸٪)، مستقل‌ها و هواداران حزب‌های دیگر با متمایل‌ها (۳۶٪)، آسیایی‌ها (۲۷٪)، دیپلم یا کمتر (۲۶٪) و ۳۰ تا ۴۹ ساله‌ها (۲۶٪) بودند. متعهدترین‌ها دموکرات‌ها (۱۰٪)، جمهوری‌خواه‌ها (۱۲٪) و دارندگان تحصیلات تکمیلی (۱۲٪).",
        "این ترکیب به یک دلیل عملی مهم است. رأی‌دهندگان جوان‌تر و بی‌مدرک دانشگاهی، از نظر تاریخی، گروه‌هایی‌اند که در انتخابات میان‌دوره‌ای کمتر از همه پای صندوق می‌آیند، و مستقل‌هایی که به هیچ حزبی متمایل نیستند کمتر از همه می‌گویند رأی داده‌اند. بخشی از آن ستون طلایی قرار نبود به رأی هیچ‌کس تبدیل شود. نظرسنجیِ رأی‌دهندگان ثبت‌نام‌شده نمی‌تواند بگوید کدام بخش.",
      ],
      breakTitle: "بی‌تصمیم‌ها باید چقدر یک‌طرفه بشکنند؟",
      breakLead: "حساب ساده است، نه پیش‌بینی. فرض کن همه‌ی ۱۵٪ که گفتند «مطمئن نیستم» یکی از دو حزب را انتخاب کنند و آن ۵٪ که نامزد دیگری را انتخاب کرده بودند سر جایشان بمانند. با لغزنده تعیین کن چند درصدِ مطمئن‌نیستم‌ها به جمهوری‌خواه‌ها بروند.",
      slider: "سهم مطمئن‌نیستم‌هایی که به جمهوری‌خواه‌ها می‌روند",
      toRep: (p) => `${p} به جمهوری‌خواه‌ها`,
      readout: (d, r) => `دموکرات ${d} · جمهوری‌خواه ${r}`,
      leadLabel: (lean) => `برتری: ${lean}`,
      tied: "مساوی",
      breakEven: (p) => `برتری فقط وقتی از بین می‌رود که حدود ${p} از مطمئن‌نیستم‌ها به جمهوری‌خواه‌ها بروند.`,
      breakNote: "بی‌تصمیم‌ها به‌ندرت این‌قدر یک‌طرفه می‌شکنند و بسیاری‌شان اصلاً رأی نمی‌دهند. برای همین آن ۲۰٪ مهم است، و برای همین هم نمی‌شود آن را رأی پنهان جمهوری‌خواه خواند.",
    },
    consolidation: {
      kicker: "۴ · رأی‌دهندگان خود هر حزب",
      title: "شکاف یکپارچگی، نه فقط شکاف متقاعدسازی",
      lead: "ردیف‌های حزبی پایین نمودار شاید مهم‌ترین یافته‌ی ساختاری نظرسنجی را در خود دارند: طرفداران هر حزب به یک اندازه قفل نشده بودند.",
      caption: "همه‌ی سهم‌ها، از جمله باریکه‌های کوچک عبور از خط حزبی، ارقام پیو است. به خاطر گرد کردن، جمع بعضی ردیف‌ها دقیقاً ۱۰۰ نمی‌شود.",
      body: [
        "در میان دموکرات‌ها و متمایل‌ها، ۸۲٪ پشت نامزد دموکرات بودند. در میان جمهوری‌خواه‌ها و متمایل‌ها، ۷۳٪ پشت نامزد جمهوری‌خواه. تقریباً هیچ‌کس از خط عبور نکرد: ۶٪ طرف جمهوری‌خواه دموکرات را انتخاب کرد و ۲٪ طرف دموکرات جمهوری‌خواه را.",
        "تفاوت در متمایل‌ها بود. فقط ۵۳٪ مستقل‌های متمایل به جمهوری‌خواه گفتند به جمهوری‌خواه رأی می‌دهند و ۳۸٪ بی‌تصمیم بودند. در میان مستقل‌های متمایل به دموکرات، ۷۲٪ همراه بودند و ۲۵٪ بی‌تصمیم. آن برتری هشت‌امتیازی دست‌کم به همان اندازه که مدیون تغییر جبهه بود، مدیون رأی‌دهندگان سست طرف جمهوری‌خواه بود که روی نرده نشسته بودند.",
      ],
      callout: {
        title: "چرا این تفاوت مهم است",
        body: "رأی‌دهنده‌ای که حزبش را عوض کرده سخت برمی‌گردد. رأی‌دهنده‌ای که در «مطمئن نیستم» پارک کرده و به سمت تو متمایل است، در بیشتر دوره‌ها راحت‌ترین رأی‌دهنده برای برگرداندن در روزهای آخر است. برتری‌ای که روی گروه دوم ساخته شده واقعی است، اما شکننده‌تر از برتری‌ای که روی گروه اول ساخته شده.",
      },
    },
    engagement: {
      kicker: "۵ · درگیری",
      title: "تصویر درگیری از ۲۰۲۲ برعکس شده بود",
      lead: "همین نظرسنجی پرسید انتخابات چقدر برای رأی‌دهندگان مهم است. در هر سه سنجه‌ی پیو، حامیان نامزدهای دموکرات درگیرتر از حامیان نامزدهای جمهوری‌خواه بودند؛ برعکس الگویی که پیو در اکتبر ۲۰۲۲ ثبت کرده بود. سال را عوض کن و چرخش را ببین.",
      measures: { matters: "«واقعاً مهم است» چه کسی ببرد", thought: "«خیلی» به انتخابات فکر کرده", motivated: "«بی‌اندازه» انگیزه‌ی رأی دادن دارد" },
      demSup: "حامیان نامزدهای دموکرات",
      repSup: "حامیان نامزدهای جمهوری‌خواه",
      year: "اکتبر",
      caption: "منبع: مرکز تحقیقات پیو، «با حال‌وهوای تلخ آمریکایی‌ها، رأی‌دهندگان دموکرات در انتخابات میان‌دوره‌ای درگیرترند»، ۸ اکتبر ۲۰۲۶.",
      gap: (lean) => `شکاف: ${lean}`,
      moodTitle: "پس‌زمینه",
      mood: [
        { n: "۲۲٪", l: "از کل بزرگسالان آمریکایی از وضع کشور راضی‌اند" },
        { n: "۸۴٪", l: "از رأی‌دهندگان ثبت‌نام‌شده اقتصاد را برای رأیشان خیلی مهم می‌دانند" },
        { n: "۶۳٪", l: "می‌گویند رئیس‌جمهور در رأیشان نقش دارد: ۴۴٪ علیه او، ۱۹٪ به نفع او" },
        { n: "۳۰٪", l: "محبوبیت رئیس‌جمهور در میان کل بزرگسالان آمریکایی" },
      ],
      moodNote: "انتخابات میان‌دوره‌ای اغلب به ضرر حزبِ صاحب کاخ سفید تمام شده، و این عددها با همان الگوی دیرینه جور درمی‌آیند، نه این که آن را بشکنند.",
    },
    model: {
      kicker: "۶ · یک آزمایش ذهنی",
      title: "اگر فقط یک گروه رأی می‌داد؟",
      lead: "نقشه‌های «اگر فقط زنان رأی می‌دادند» ابزار قدیمی روزنامه‌نگاری داده‌اند. کسی پیشنهاد محدود کردن رأی نمی‌دهد؛ هدف این است که ببینیم ترکیب رأی‌دهندگان چقدر نتیجه را تعیین می‌کند. نظرسنجی پیو سراسری است و عدد ایالتی ندارد، پس نقشه‌ی پایین یک شبیه‌سازی با یک فرض اعلام‌شده است، نه داده‌ی نظرسنجی.",
      warn: {
        title: "مدل چطور کار می‌کند و کجا می‌شکند",
        method: "روش: هر ایالت از فاصله‌ی تأییدشده‌ی انتخابات ریاست‌جمهوری ۲۰۲۴ خودش شروع می‌کند. بعد کل نقشه به اندازه‌ی تفاوت فاصله‌ی سراسری یک گروه در نظرسنجی پیو با فاصله‌ی سراسری ۲۰۲۴ (جمهوری‌خواه \u200E+۱٫۵) جابه‌جا می‌شود. به این می‌گویند جابه‌جایی یکنواخت.",
        breaks: "کجا می‌شکند: گروه‌ها همه‌جا یک‌جور رأی نمی‌دهند. سفیدپوستان ورمانت و سفیدپوستان میسیسیپی فاصله‌ی زیادی دارند و جابه‌جایی یکنواخت این را نمی‌بیند. پایه یک رقابت ریاست‌جمهوری است، نظرسنجی درباره‌ی مجلس نمایندگان می‌پرسد، و رأی‌دهندگان ثبت‌نام‌شده را یک ماه پیش از انتخابات پوشش می‌دهد. نقشه را برای جهت و مقیاس بخوان. پیش‌بینی نیست و نتیجه هم نیست.",
      },
      gameTitle: "اول حدس بزن: ۱۰ سؤال، ۱۰۰ امتیاز",
      gameLead: "پیش از دیدن نقشه حدست را قطعی کن. حدس غلطی که اول زده شده بهتر از جواب درستی که سرد خوانده شده در یاد می‌ماند.",
      explorerTitle: "بعد خودت مدل را بگرد",
      explorerCaption: "هر مربع یک ایالت است، به‌اضافه‌ی واشنگتن دی‌سی. مدل: فاصله‌ی تأییدشده‌ی ریاست‌جمهوری ۲۰۲۴ در هر ایالت، که به اندازه‌ی فاصله‌ی سراسری گروه در نظرسنجی ۲۸ سپتامبر تا ۴ اکتبر ۲۰۲۶ پیو یکنواخت جابه‌جا شده. نتایج ۲۰۲۴: پروژه‌ی ریاست‌جمهوری آمریکا، دانشگاه کالیفرنیا سانتا باربارا.",
      lessons: "دو چیز را مدل با اطمینان نشان می‌دهد. اول، بعضی گروه‌ها چقدر یک‌طرفه‌اند: در میان زیر ۳۰ ساله‌ها جابه‌جایی آن‌قدر بزرگ است که حتی ایالت‌هایی که جمهوری‌خواه‌ها در ۲۰۲۴ با ۲۵ امتیاز بردند رنگ عوض می‌کنند. دوم، بعضی جابه‌جایی‌ها چقدر کم تکان می‌دهند: با فقط مردان، نقشه تقریباً همان نقشه‌ی ۲۰۲۴ است، چون مردان نصف‌نصف بودند و ۲۰۲۴ هم نزدیک به مساوی بود. مدل درباره‌ی هیچ ایالت مشخصی چیز قابل اعتمادی نمی‌گوید.",
    },
    game: {
      progress: (i, n) => `سؤال ${i} از ${n}`,
      finished: "تمام شد",
      score: (s, max) => `${s} از ${max} امتیاز`,
      who: {
        all: "کل رأی‌دهندگان ثبت‌نام‌شده",
        men: "مردان",
        women: "زنان",
        white: "سفیدپوستان",
        hispanic: "هیسپانیک‌ها",
        black: "سیاه‌پوستان",
        asian: "آسیایی‌ها",
        a18: "زیر ۳۰ ساله‌ها",
        a30: "۳۰ تا ۴۹ ساله‌ها",
        a50: "۵۰ تا ۶۴ ساله‌ها",
        a65: "۶۵ ساله‌ها و بالاتر",
        postgrad: "دارندگان تحصیلات تکمیلی",
        college: "لیسانسه‌ها",
        someCollege: "کسانی که دانشگاه را نیمه‌تمام گذاشته‌اند",
        hs: "دیپلمه‌ها و کمتر",
        repLean: "جمهوری‌خواه‌ها و متمایل‌ها",
        rep: "جمهوری‌خواه‌ها",
        leanRep: "متمایل‌ها به جمهوری‌خواه",
        demLean: "دموکرات‌ها و متمایل‌ها",
        dem: "دموکرات‌ها",
        leanDem: "متمایل‌ها به دموکرات",
        ind: "مستقل‌ها و دیگر حزب‌ها، با متمایل‌ها",
      },
      states: STATES_FA,
      qCount: (who) => `اگر فقط ${who} رأی می‌دادند، در این مدل چند تا از ۵۰ ایالت به‌اضافه‌ی دی‌سی به سمت دموکرات‌ها می‌رفتند؟`,
      qState: (who, state) => `اگر فقط ${who} رأی می‌دادند، در این مدل ${state} به کدام سمت می‌رفت؟`,
      guess: "حدس تو",
      lock: "حدسم را قطعی کن",
      countHead: (ans, g, pts) => `مدل می‌گوید ${ans} از ۵۱. تو گفتی ${g}. +${pts}`,
      countBody: (group, lean, shift) => `${group}: ${lean} در سطح کشور در نظرسنجی؛ یعنی ${shift} امتیاز جابه‌جایی روی فاصله‌ی ۲۰۲۴ هر ایالت.`,
      right: "درست",
      wrong: "این بار نه",
      stateHead: (verdict, state, lean, pts) => `${verdict}: ${state} می‌شود ${lean}. +${pts}`,
      stateBody: (base, group, lean, shift) => `پایه‌ی ۲۰۲۴: ${base}. ${group} در سطح کشور ${lean} بودند؛ یعنی ${shift} امتیاز جابه‌جایی.`,
      close: " این داخل نوار ۳ امتیازی است؛ پس آن را شیر یا خط حساب کن.",
      next: "سؤال بعد",
      finish: "امتیازم را ببینم",
      again: "دوباره بازی کن",
      ranks: ["نقشه‌خوان", "غریزه‌ی خوب", "در حال شناختن زمین", "نقشه غافلگیرت کرد"],
      final: "درس معمول: آدم‌ها دست‌کم می‌گیرند که یک گروه یک‌طرفه چقدر نقشه را جابه‌جا می‌کند، و دست‌بالا می‌گیرند که یک گروه نصف‌نصف چقدر. همه‌ی جواب‌های این‌جا از یک مدل جابه‌جایی یکنواخت آمده، نه از داده‌ی ایالتی.",
    },
    explorer: {
      baseline: "پایه‌ی ۲۰۲۴",
      baselineNote: "نتیجه‌ی تأییدشده‌ی انتخابات ریاست‌جمهوری ۲۰۲۴ در هر ایالت. بدون جابه‌جایی.",
      shift: (group, lean, shift, toward) => `${group}: ${lean} در سطح کشور در نظرسنجی پیو. همه‌ی ایالت‌ها ${shift} امتیاز از فاصله‌ی ۲۰۲۴ خود به سمت ${toward} جابه‌جا شده‌اند.`,
      tally: { dem: "متمایل به دموکرات", rep: "متمایل به جمهوری‌خواه", close: "زیر ۳ امتیاز" },
      flips: (n) => `ایالت‌هایی که نسبت به ۲۰۲۴ طرف عوض می‌کنند (${n}):`,
      noFlips: "هیچ ایالتی نسبت به ۲۰۲۴ طرف عوض نمی‌کند.",
      key: { strong: "۱۰+ امتیاز", lean: "۳ تا ۱۰", close: "زیر ۳ امتیاز" },
      toward: { dem: "نامزدهای دموکرات", rep: "نامزدهای جمهوری‌خواه" },
    },
    readings: {
      kicker: "۷ · دو خوانش منصفانه",
      title: "دو خوانش منصفانه از یک داده",
      solid: {
        title: "دلایل محکم بودن برتری",
        items: [
          "هشت امتیاز در میان رأی‌دهندگان ثبت‌نام‌شده، با برتری در درگیری در همه‌ی سنجه‌هایی که پیو دنبال می‌کند.",
          "طرف دموکرات از قبل ۸۲٪ یکپارچه بود.",
          "برتری در میان جوان‌ها، هیسپانیک‌ها و تحصیل‌کرده‌های دانشگاهی پهن بود، نه حاشیه‌ای.",
          "نارضایتی سراسری و محبوبیت رئیس‌جمهور به یک سمت اشاره می‌کردند.",
        ],
      },
      soft: {
        title: "دلایل سست‌تر بودنش از ظاهر",
        items: [
          "استخر بی‌تصمیم‌ها بیش از دو برابر برتری بود.",
          "بزرگ‌ترین گروه بی‌تصمیم، متمایل‌ها به جمهوری‌خواه با ۳۸٪، طبق تعریف به جمهوری‌خواه متمایل بودند.",
          "رأی‌دهندگان ثبت‌نام‌شده همان رأی‌دهندگان واقعی نیستند؛ مشارکت در میان‌دوره‌ای پیرتر است، جایی که رقابت نزدیک بود.",
          "ترجیح سراسری برای مجلس مستقیماً به ۴۳۵ رقابت حوزه‌ای ترجمه نمی‌شود.",
        ],
      },
      after: "هر دو خوانش از یک نمودار صادقانه استفاده می‌کنند. این که کدام رأی‌دهندگان را بهتر توصیف کرد، سؤالی برای نتایج تأییدشده و مطالعات پس از انتخابات روی رأی‌دهندگان تأییدشده است، نه برای این نظرسنجی.",
    },
    takeaway: {
      kicker: "جمع‌بندی",
      title: "نه «هشت امتیاز جلوتر»",
      body: "این نمودار معمولاً برای خط اولش دست‌به‌دست می‌شود، و خط اول تا همان جا که می‌رفت دقیق بود: برتری هشت‌امتیازی دموکرات‌ها در میان رأی‌دهندگان ثبت‌نام‌شده، یک ماه مانده به انتخابات. اما درس ماندگارتر ساختار زیر آن است. حزب‌ها تقریباً رأی‌دهنده رد و بدل نمی‌کردند. رقابت در این نظرسنجی بین طرفی بود که بیشترش به خانه برگشته بود و طرفی که متمایل‌هایش هنوز تصمیم نگرفته بودند برایش بیایند یا نه؛ در میان رأی‌دهندگان ثبت‌نامی که یک‌پنجمشان هنوز هیچ‌کدام از دو حزب را انتخاب نکرده بودند. این ادعایی متفاوت و دقیق‌تر از «یک حزب هشت امتیاز جلوتر است» است.",
    },
    notes: {
      kicker: "چطور چنین نموداری را بخوانیم",
      title: "شش احتیاط",
      items: [
        { t: "رأی‌دهندگان ثبت‌نام‌شده، نه رأی‌دهندگان محتمل", b: "نظرسنجی همه‌ی کسانی را که در فهرست‌اند توصیف می‌کند. کسانی که واقعاً در میان‌دوره‌ای رأی می‌دهند گروهی کوچک‌تر و متفاوت‌اند." },
        { t: "زیرگروه‌ها خطای بزرگ‌تری دارند", b: "کل نمونه ۳٬۹۱۷ رأی‌دهنده‌ی ثبت‌نام‌شده بود، اما هر ردیف نمودار روی مصاحبه‌های خیلی کمتری بنا شده. فاصله‌ی ۳ یا ۴ امتیازی داخل یک زیرگروه، مثل مردان، ۶۵ سال به بالا یا دانشگاه نیمه‌تمام، را باید تقریباً مساوی حساب کرد." },
        { t: "برآورد آسیایی‌ها محدودیت اعلام‌شده دارد", b: "پیو می‌گوید این برآورد فقط انگلیسی‌زبان‌ها را نمایندگی می‌کند و همه‌ی رأی‌دهندگان آسیایی‌آمریکایی را توصیف نمی‌کند." },
        { t: "یک عکس فوری، یک ماه زودتر", b: "کار میدانی ۴ اکتبر تمام شد. «اگر انتخابات امروز بود» پیش‌بینی ۳ نوامبر نیست." },
        { t: "رأی سراسری کرسی نیست", b: "سؤال درباره‌ی رقابت مجلس در حوزه‌ی هر پاسخ‌دهنده است، اما جمع کل چیزی درباره‌ی پخش این رأی‌ها در حوزه‌ها نمی‌گوید." },
        { t: "گروه‌ها روی هم افتاده‌اند", b: "سن، تحصیلات، نژاد و حزب در هم تنیده‌اند. نمودار هر برش را جدا نشان می‌دهد و نمی‌تواند بگوید کار را کدام عامل می‌کند." },
      ],
    },
    medals: {
      title: "نشان‌های نمودارخوانی",
      hint: "یکی برای هر نمودار تعاملی.",
      names: { chart: "ردیف‌خوان", margins: "فاصله‌سنج", pool: "شمارنده‌ی نرده", engagement: "مسافر زمان", game: "حدس‌زن نقشه", map: "کاوشگر مدل" },
      complete: "هر شش نشان. این نمودار را دقیق‌تر از بیشتر کسانی که هم‌رسانی‌اش کردند خواندی.",
      open: "نشان‌های تو",
      close: "بستن",
    },
    method: {
      sourcesTitle: "منابع",
      sources: SOURCES,
      footnote: "نظرسنجی از ۵٬۰۶۲ بزرگسال آمریکایی، از جمله ۳٬۹۱۷ رأی‌دهنده‌ی ثبت‌نام‌شده، در پنل روندهای آمریکایی پیو، ۲۸ سپتامبر تا ۴ اکتبر ۲۰۲۶. فاصله‌ها، رتبه‌ها و نقشه از درصدهای منتشرشده‌ی پیو حساب شده‌اند؛ تفسیر از نویسنده است، نه از پیو. این تحلیل طرف هیچ حزب یا نامزدی را نمی‌گیرد.",
    },
    colophon: {
      shareTitle: "یک‌پنجم مردد؛ آخرین نظرسنجی بزرگ پیو پیش از میان‌دوره‌ای واقعاً چه سنجید",
      disclaimer: "تحلیل داده‌های منتشرشده‌ی نظرسنجی، برای آموزش. پیش‌بینی نیست، گزارش نتایج ۲۰۲۶ نیست و حمایت از هیچ حزب یا نامزدی هم نیست.",
      cta: "رزرو جلسه",
    },
  },
}
