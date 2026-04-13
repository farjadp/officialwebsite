import ExcelJS from 'exceljs';

export async function generateNPIOperatingSystem(
  leadData: any,
  answers: Record<string, string | string[]>
): Promise<Buffer> {
  const a = answers;
  const firstName = a.name ? (a.name as string).split(' ')[0] : 'Your';
  const today = new Date();

  const WB = new ExcelJS.Workbook();
  WB.creator = 'Farjad Pourmohammad – NPI Framework';
  WB.created = today;

  // ── PALETTE ─────────────────────────────────────────────────────────────────
  const C = {
    NAVY:     '0D1B2A', DARK_BLUE: '1F3F6E', ACCENT:   '2962B8',
    RED:      'C0392B', GOLD:      'D4A017', WHITE:     'FFFFFF',
    LIGHT:    'F4F6F9', MID_GRAY:  'E8ECF2', BORDER:    'C5CBD8',
    TEXT:     '0D1B2A', TEXT_MID:  '3A4A5C', TEXT_LT:   '7A8A9C',
    N_BG:     '1A3A5C', N_SOFT:    'D6E8F7',
    P_BG:     '145233', P_SOFT:    'D5F0E3',
    I_BG:     '4A1A6E', I_SOFT:    'EBD9FF',
    R_BG:     '7B2A00', R_SOFT:    'FDEBD0',
  };

  function F(bold=false, size=10, color=C.TEXT, italic=false) {
    return { name:'Arial', bold, size, color: { argb: 'FF' + color }, italic } as ExcelJS.Font;
  }
  function Fill(color: string) {
    return { type:'pattern', pattern:'solid', fgColor:{argb:'FF'+color} } as ExcelJS.Fill;
  }
  function Border() {
    const s: Partial<ExcelJS.Border> = { style:'thin', color:{argb:'FF'+C.BORDER} };
    return { top:s, bottom:s, left:s, right:s } as ExcelJS.Borders;
  }
  function Align(h='left', v='middle', wrap=true) {
    return { horizontal: h as any, vertical: v as any, wrapText: wrap };
  }
  function cellSet(cell: ExcelJS.Cell, val: any, bg: string, fg=C.TEXT, bold=false, size=10, h='left', italic=false, numFmt: string | null = null) {
    cell.value = val;
    cell.font = F(bold, size, fg, italic);
    if (bg) cell.fill = Fill(bg);
    cell.alignment = Align(h);
    cell.border = Border();
    if (numFmt) cell.numFmt = numFmt;
  }
  function hdrCell(cell: ExcelJS.Cell, val: any, bg: string, fg=C.WHITE, size=11, h='center') {
    cell.value = val;
    cell.font = F(true, size, fg);
    cell.fill = Fill(bg);
    cell.alignment = Align(h, 'middle', true);
    cell.border = Border();
  }
  function mergeHdr(ws: ExcelJS.Worksheet, range: string, val: any, bg: string, fg=C.WHITE, size=11, h='center') {
    ws.mergeCells(range);
    const start = range.split(':')[0];
    hdrCell(ws.getCell(start), val, bg, fg, size, h);
  }

  // Helper to capitalize
  function capitalize(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 1 — NARRATIVE
  // ══════════════════════════════════════════════════════════════════════════
  const ws1 = WB.addWorksheet('🧭 Narrative');
  ws1.views = [{ showGridLines: false }];
  ws1.getColumn('A').width = 3;
  ws1.getColumn('B').width = 28;
  ws1.getColumn('C').width = 55;
  ws1.getColumn('D').width = 3;

  // Title
  ws1.getRow(1).height = 12;
  ws1.mergeCells('B1:C1'); ws1.getCell('B1').fill = Fill(C.NAVY);
  ws1.getRow(2).height = 44;
  mergeHdr(ws1,'B2:C2','NPI OPERATING SYSTEM  ·  MY NARRATIVE',C.NAVY,C.WHITE,15);
  ws1.getRow(3).height = 22;
  mergeHdr(ws1,'B3:C3','Define it once. Repeat it everywhere. Update it only when you genuinely evolve.',C.DARK_BLUE,C.N_SOFT,9);
  ws1.getRow(4).height = 10;

  // Brand statement block
  ws1.getRow(5).height = 22;
  mergeHdr(ws1,'B5:C5','BRAND STATEMENT',C.N_BG,C.WHITE,9);
  ws1.getRow(6).height = 64;
  ws1.mergeCells('B6:C6');
  const bsCell = ws1.getCell('B6');
  const knownFor = Array.isArray(a.q3) ? a.q3.slice(0,2).join(' and ').toLowerCase() : (a.q3 || '');
  const brandStatement = `"I help ${a.q1 || '...'} ${(a.q2 as string || '...').toLowerCase().replace(/^they /, '')} through ${knownFor}."`;
  bsCell.value = brandStatement;
  bsCell.font = F(true, 12, C.N_BG, true);
  bsCell.fill = Fill(C.N_SOFT);
  bsCell.alignment = Align('center','middle',true);
  bsCell.border = Border();
  ws1.getRow(7).height = 8;

  const role = a.role || 'Business Consultant — Tech-Savvy, Strategy-First';
  const problem = a.q2 || 'Persian founders have strong skills but weak market structure. They lack clarity, local traction strategy, and credible visibility in the Canadian market.';
  const result = 'They get a clear strategy, structured execution systems (OKR, NPI), and real market confidence — so they move faster and waste less.';
  
  const blocks1 = [
    ['PRIMARY IDENTITY',  role],
    ['TARGET AUDIENCE',   `${capitalize(a.q1 as string || '')} — early-stage, pre-traction, pivoting, or stuck between confusion and action.`],
    ['PROBLEM I SOLVE',   problem],
    ['RESULT I CREATE',   result],
    ['DISTINCT POV',      a.q12 ? `Many struggle to stand out: "${a.q12}". I give honest, no-fantasy strategy built for the real reality.` : 'Most startup advice is built for Silicon Valley insiders. I give honest, no-fantasy strategy built for the immigrant founder\'s real reality in Canada.'],
    ['SECONDARY IDENTITY', 'Fractional CTO — emerges naturally as consulting clients need technical leadership.'],
  ];
  let r1 = 8;
  blocks1.forEach(([label, val]) => {
    ws1.getRow(r1).height = 22;
    mergeHdr(ws1,`B${r1}:C${r1}`,label,C.N_BG,C.WHITE,9);
    ws1.getRow(r1+1).height = 44;
    ws1.mergeCells(`B${r1+1}:C${r1+1}`);
    cellSet(ws1.getCell(`B${r1+1}`), val, C.LIGHT, C.TEXT, false, 10);
    ws1.getRow(r1+2).height = 6;
    r1 += 3;
  });

  // Core themes
  ws1.getRow(r1).height = 22;
  mergeHdr(ws1,`B${r1}:C${r1}`,'CORE BRAND THEMES  ·  Repeat these consistently across all content',C.N_BG,C.WHITE,9);
  r1++;
  ws1.getRow(r1).height = 20;
  cellSet(ws1.getCell(`B${r1}`),'Theme',C.N_BG,C.WHITE,true,9,'center');
  cellSet(ws1.getCell(`C${r1}`),'Name -> What it means in practice',C.N_BG,C.WHITE,true,9,'center');
  r1++;
  const defaultThemes = [
    'Business Reality vs. Startup Fantasy · Challenge hype. Show what actually happens when you build a real business in Canada.',
    'Traction for Immigrant Founders · Specific challenges: network gaps, credibility gaps, cultural translation in the Canadian market.',
    'Strategy + Execution Systems · OKR, NPI, validation loops — practical tools that create structure and remove guesswork.',
    'Real Stories from Real Clients · Case studies and lessons from Persian business owners you have worked with. No theory, no fantasy.',
    'Tech as a Business Tool · Technology decisions in context of business goals. Not the other way around.'
  ];
  const themes = Array.isArray(a.q4) && a.q4.length > 0 ? a.q4 : defaultThemes;
  themes.forEach((theme, i) => {
    ws1.getRow(r1).height = 28;
    const bg = i % 2 === 0 ? C.N_SOFT : C.WHITE;
    cellSet(ws1.getCell(`B${r1}`),`Theme ${i+1}`,bg,C.N_BG,true,9,'center');
    cellSet(ws1.getCell(`C${r1}`),theme,bg,C.TEXT,false,10);
    r1++;
  });
  
  ws1.getRow(r1).height = 8;
  r1++;
  
  // Tone & Style
  mergeHdr(ws1,`B${r1}:C${r1}`,'TONE & STYLE',C.N_BG,C.WHITE,9);
  r1++;
  const tones = [
    ['Voice', 'Direct. Honest. No-fluff. Mentor energy — not influencer energy.'],
    ['Style', 'Short sentences. Real examples. Challenge assumptions. Never fake motivation or startup buzzwords.'],
    ['Avoid', 'Vague inspiration. Overpromising. Copying Silicon Valley language. Empty engagement bait.']
  ]
  tones.forEach(([label, val], i) => {
    ws1.getRow(r1).height = 28;
    const bg = i % 2 === 0 ? C.N_SOFT : C.WHITE;
    cellSet(ws1.getCell(`B${r1}`),label,bg,C.N_BG,true,9,'center');
    cellSet(ws1.getCell(`C${r1}`),val,bg,C.TEXT,false,10);
    r1++;
  });


  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 2 — WEEKLY TRACKER 
  // ══════════════════════════════════════════════════════════════════════════
  const ws2 = WB.addWorksheet('📅 Weekly Tracker');
  ws2.views = [{ showGridLines: false }];
  const w2cols: Record<string, number> = {A:3,B:22,C:14,D:14,E:14,F:14,G:14,H:14,I:3};
  Object.entries(w2cols).forEach(([c,w]) => { ws2.getColumn(c).width = w; });

  ws2.getRow(1).height = 12; ws2.mergeCells('B1:H1'); ws2.getCell('B1').fill = Fill(C.NAVY);
  ws2.getRow(2).height = 44;
  mergeHdr(ws2,'B2:H2',`NPI OPERATING SYSTEM  ·  WEEKLY TRACKER`,C.NAVY,C.WHITE,15);
  ws2.getRow(3).height = 22;
  mergeHdr(ws2,'B3:H3','Fill this in every Sunday evening. 15 minutes max. Be honest with yourself.',C.DARK_BLUE,C.N_SOFT,9);
  ws2.getRow(4).height = 10;

  // Week selector
  ws2.getRow(5).height = 30;
  ws2.mergeCells('B5:C5');
  hdrCell(ws2.getCell('B5'),'WEEK STARTING (Monday):',C.DARK_BLUE,C.WHITE,10);
  const wkCell = ws2.getCell('D5');
  wkCell.value = today;
  wkCell.font = F(true,11,C.RED);
  wkCell.fill = Fill(C.LIGHT);
  wkCell.alignment = Align('center');
  wkCell.border = Border();
  wkCell.numFmt = 'DD-MMM-YYYY';
  ws2.mergeCells('E5:F5');
  hdrCell(ws2.getCell('E5'),'WEEK #',C.DARK_BLUE,C.WHITE,10);
  const wkNum = ws2.getCell('G5');
  wkNum.value = { formula: 'IFERROR(WEEKNUM(D5,2),"")' };
  wkNum.font = F(true,11,C.RED);
  wkNum.fill = Fill(C.LIGHT);
  wkNum.alignment = Align('center');
  wkNum.border = Border();
  ws2.getRow(6).height = 10;

  // Presence section
  ws2.getRow(7).height = 28;
  mergeHdr(ws2,'B7:H7','P  ·  PRESENCE  —  Show up. Be consistent. Stay in front of the right people.',C.P_BG,C.WHITE,11);
  ws2.getRow(8).height = 22;
  ['Presence Action','Weekly Target','Mon','Tue','Wed','Thu','Fri'].forEach((h,i) => {
    const col = String.fromCharCode(66+i); // B,C,D,...
    hdrCell(ws2.getCell(`${col}8`),h,C.P_BG,C.WHITE,9);
  });

  const presenceRows = [
    [`LinkedIn Post (any format)`,       '3 / week'],
    ['Newsletter / Long-form article',   '1 / week'],
    ['Meaningful Comment (relevant)',    '5 / week'],
    ['Direct Outreach (strategic DMs)',  '3 / week'],
    ['Persian Community Touchpoint',     '2 / week'],
    ['Speaking / Event / Podcast',       '1 / month'],
  ];
  presenceRows.forEach(([act, tgt], i) => {
    const r = 9 + i;
    ws2.getRow(r).height = 26;
    const bg = i % 2 === 0 ? C.P_SOFT : C.WHITE;
    cellSet(ws2.getCell(`B${r}`),act,bg,C.TEXT,false,10);
    cellSet(ws2.getCell(`C${r}`),tgt,bg,C.P_BG,true,9,'center');
    ['D','E','F','G','H'].forEach(col => {
      ws2.getCell(`${col}${r}`).fill = Fill(bg);
      ws2.getCell(`${col}${r}`).border = Border();
      ws2.getCell(`${col}${r}`).alignment = Align('center');
    });
  });

  // Totals row
  ws2.getRow(15).height = 24;
  cellSet(ws2.getCell('B15'),'WEEKLY TOTALS (auto)',C.P_BG,C.WHITE,true,9);
  cellSet(ws2.getCell('C15'),'—',C.P_BG,C.WHITE,true,9,'center');
  ['D','E','F','G','H'].forEach(col => {
    const c = ws2.getCell(`${col}15`);
    c.value = 0; // Or formula `COUNTA(${col}9:${col}14)`
    c.font = F(true,11,C.WHITE);
    c.fill = Fill(C.P_BG);
    c.alignment = Align('center');
    c.border = Border();
  });
  ws2.getRow(16).height = 10;
  
  // Narrative Check
  ws2.getRow(17).height = 28;
  mergeHdr(ws2,'B17:H17','N  ·  NARRATIVE CHECK  —  Did my message stay consistent this week? (Y / N)',C.DARK_BLUE,C.WHITE,11);
  ws2.getRow(18).height = 20;
  ['Question','Mon','Tue','Wed','Thu','Fri','Week Note'].forEach((h,i) => {
    hdrCell(ws2.getCell(`${String.fromCharCode(66+i)}18`),h,C.DARK_BLUE,C.WHITE,9);
  });
  const nChecks = [
      'Every piece of content tied to one of my 5 themes?',
      'Stayed in my POV — honest, no-fantasy, practical?',
      'Mentioned my audience (Persian founders / Canada)?',
      'Tone: mentor, not motivational speaker?'
  ];
  nChecks.forEach((chk, i) => {
    const r = 19 + i;
    ws2.getRow(r).height = 36;
    const bg = i % 2 === 0 ? C.N_SOFT : C.WHITE;
    cellSet(ws2.getCell(`B${r}`),chk,bg,C.TEXT,false,9);
    ['C','D','E','F','G','H'].forEach(col => {
      ws2.getCell(`${col}${r}`).fill = Fill(bg);
      ws2.getCell(`${col}${r}`).border = Border();
    });
  });
  
  ws2.getRow(23).height = 10;

  // Content log section (Pre-filled with examples from user graphic)
  ws2.getRow(24).height = 28;
  mergeHdr(ws2,'B24:H24','📝  CONTENT LOG  —  What did I publish this week?',C.DARK_BLUE,C.WHITE,11);
  ws2.getRow(25).height = 20;
  ['Platform','Theme Used','Format','Title / Topic','Impressions','Best Reaction','Action Taken?'].forEach((h,i) => {
    hdrCell(ws2.getCell(`${String.fromCharCode(66+i)}25`),h,C.DARK_BLUE,C.WHITE,9);
  });
  const sampleContent = [
      ['LinkedIn', 'Startup Reality', 'Short post', 'What Persian founders get wrong about MVPs'],
      ['LinkedIn', 'Immigrant Challenges', 'Story post', 'What happened when I helped a beauty salon scale'],
      ['Newsletter', 'Execution Systems', 'Long-form', 'How to use OKRs when you are a solo-founder with a team of freelancers'],
      ['LinkedIn', 'Tech as Business Tool', 'Carousel', '5 tech decisions that should come AFTER your business model']
  ];
  
  for (let i = 0; i < 4; i++) {
    const r = 26 + i;
    ws2.getRow(r).height = 42;
    const bg = i % 2 === 0 ? C.LIGHT : C.WHITE;
    cellSet(ws2.getCell(`B${r}`),sampleContent[i][0],bg,C.TEXT,false,9,'center');
    cellSet(ws2.getCell(`C${r}`),sampleContent[i][1],bg,C.TEXT,false,9);
    cellSet(ws2.getCell(`D${r}`),sampleContent[i][2],bg,C.TEXT,false,9,'center');
    cellSet(ws2.getCell(`E${r}`),sampleContent[i][3],bg,C.TEXT,false,9);
    ['F','G','H'].forEach(col => {
      ws2.getCell(`${col}${r}`).fill = Fill(bg);
      ws2.getCell(`${col}${r}`).border = Border();
    });
  }
  ws2.getRow(30).height = 10;

  // Impact signals (Example data from graphic)
  ws2.getRow(31).height = 28;
  mergeHdr(ws2,'B31:H31','I  ·  IMPACT SIGNALS  —  What happened because of my brand this week?',C.I_BG,C.WHITE,11);
  ws2.getRow(32).height = 20;
  ['Signal Type','#','Who / Where','Source Content','Status','Value','Follow-up?'].forEach((h,i) => {
    hdrCell(ws2.getCell(`${String.fromCharCode(66+i)}32`),h,C.I_BG,C.WHITE,9);
  });

  const allSignals = [
    'Qualified lead (Persian founder)',
    'Consulting inquiry / discovery call',
    'IT project inquiry',
    'Speaking / guest invite',
    'Partnership conversation',
    'Strategic intro or referral',
    'Newsletter signup (qualified)',
    'Media / community mention'
  ];

  allSignals.forEach((sig, i) => {
    const r = 33 + i;
    ws2.getRow(r).height = 26;
    const bg = i % 2 === 0 ? C.I_SOFT : C.WHITE;
    cellSet(ws2.getCell(`B${r}`),sig,bg,C.TEXT,false,9);
    const numCell = ws2.getCell(`C${r}`);
    numCell.value = 0;
    numCell.font = F(true,11,C.I_BG);
    numCell.fill = Fill(bg);
    numCell.alignment = Align('center');
    numCell.border = Border();
    ['D','E','F','G','H'].forEach(col => {
      ws2.getCell(`${col}${r}`).fill = Fill(bg);
      ws2.getCell(`${col}${r}`).border = Border();
      ws2.getCell(`${col}${r}`).font = F(false,9);
    });
  });

  const totR = 33 + allSignals.length;
  ws2.getRow(totR).height = 24;
  cellSet(ws2.getCell(`B${totR}`),'TOTAL SIGNALS THIS WEEK',C.I_BG,C.WHITE,true,10);
  const totCell = ws2.getCell(`C${totR}`);
  totCell.value = { formula: `SUM(C33:C${totR-1})` };
  totCell.font = F(true,13,C.RED);
  totCell.fill = Fill(C.I_SOFT);
  totCell.alignment = Align('center');
  totCell.border = Border();
  ['D','E','F','G','H'].forEach(col => {
    ws2.getCell(`${col}${totR}`).fill = Fill(C.I_BG);
    ws2.getCell(`${col}${totR}`).border = Border();
  });

  // Reflection
  const reflR = totR + 2;
  ws2.getRow(reflR).height = 28;
  mergeHdr(ws2,`B${reflR}:H${reflR}`,'🪞  WEEKLY REFLECTION  ·  5 minutes. Every Sunday. Non-negotiable.',C.NAVY,C.WHITE,11);
  const refQs = [
    'What worked this week (content or conversation)?',
    'What did NOT work? Be specific.',
    `One thing I will do differently next week:`,
  ];
  let rr = reflR + 1;
  refQs.forEach(q => {
    ws2.getRow(rr).height = 20;
    ws2.mergeCells(`B${rr}:H${rr}`);
    cellSet(ws2.getCell(`B${rr}`),q,C.MID_GRAY,C.TEXT,true,9,'left',false);
    ws2.getRow(rr+1).height = 36;
    ws2.mergeCells(`B${rr+1}:H${rr+1}`);
    cellSet(ws2.getCell(`B${rr+1}`),'',C.WHITE,C.TEXT,false,10);
    ws2.getRow(rr+2).height = 6;
    rr += 3;
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 3 — REVENUE TRACKER  (New matching graphic)
  // ══════════════════════════════════════════════════════════════════════════
  const ws3 = WB.addWorksheet('💰 Revenue Tracker');
  ws3.views = [{ showGridLines: false }];
  const w3cols = {A:3,B:28,C:25,D:15,E:15,F:15,G:15,H:15,I:15,J:3};
  Object.entries(w3cols).forEach(([c,w]) => { ws3.getColumn(c).width = w; });

  ws3.getRow(1).height = 12; ws3.mergeCells('B1:I1'); ws3.getCell('B1').fill = Fill(C.NAVY);
  ws3.getRow(2).height = 44;
  mergeHdr(ws3,'B2:I2',`NPI OPERATING SYSTEM  ·  REVENUE TRACKER`,C.NAVY,C.WHITE,15);
  ws3.getRow(3).height = 22;
  mergeHdr(ws3,'B3:I3','Track actual income vs. target every month  ·  Update at end of each month',C.R_BG,C.R_SOFT,9);
  ws3.getRow(4).height = 10;
  
  ws3.getRow(5).height = 24;
  ['Income Stream','Notes','Month 1','Month 2','Month 3','Month 4','Month 5','Month 6'].forEach((h,i) => {
    hdrCell(ws3.getCell(`${String.fromCharCode(66+i)}5`),h,C.R_BG,C.WHITE,10);
  });
  
  ws3.getRow(6).height = 24;
  mergeHdr(ws3,'B6:I6','PLAN (CAD $)  ·  Edit these numbers if your targets change',C.R_BG,C.WHITE,10);
  
  const planRows = [
      ['Consulting Revenue', '3h free -> 5h@$75 -> 8h@$100 -> 8h@$125', 500, 1500, 2500, 3500, 4500, 5000],
      ['IT Projects', '1 free+1 small -> 2@$1K -> 2@$3K -> 2@$3K+addons', 500, 2000, 3500, 4500, 5000, 5000],
      ['Add-ons & Retainers', 'Website support, AI automation, maintenance', 0, 0, 0, 0, 1000, 1500]
  ];
  planRows.forEach((row, i) => {
      const r = 7 + i;
      ws3.getRow(r).height = 26;
      cellSet(ws3.getCell(`B${r}`),row[0],C.R_SOFT,C.TEXT,true,10);
      cellSet(ws3.getCell(`C${r}`),row[1],C.R_SOFT,C.TEXT_LT,false,9,'center',true);
      ['D','E','F','G','H','I'].forEach((col, j) => {
          cellSet(ws3.getCell(`${col}${r}`),row[j+2],C.R_SOFT,C.TEXT,false,10,'center',false, '"$"#,##0');
      });
  });
  
  ws3.getRow(10).height = 24;
  cellSet(ws3.getCell('B10'),'PLANNED TOTAL',C.R_BG,C.WHITE,true,10);
  cellSet(ws3.getCell('C10'),'',C.R_BG,C.WHITE,true,10);
  ['D','E','F','G','H','I'].forEach(col => {
      const target = ws3.getCell(`${col}10`);
      target.value = { formula: `SUM(${col}7:${col}9)` };
      target.font = F(true, 10, C.WHITE);
      target.fill = Fill(C.R_BG);
      target.alignment = Align('center');
      target.border = Border();
      target.numFmt = '"$"#,##0';
  });
  
  ws3.getRow(11).height = 24;
  cellSet(ws3.getCell('B11'),'STATED TARGET',C.NAVY,C.WHITE,true,10);
  cellSet(ws3.getCell('C11'),'From original plan',C.NAVY,C.WHITE,true,9,'center',true);
  [1000, 3500, 6000, 8000, 9500, 11000].forEach((val, j) => {
      const col = String.fromCharCode(68+j);
      const cell = ws3.getCell(`${col}11`);
      cell.value = val;
      cell.font = F(true, 10, C.GOLD);
      cell.fill = Fill(C.NAVY);
      cell.alignment = Align('center');
      cell.border = Border();
      cell.numFmt = '"$"#,##0';
  });

  ws3.getRow(12).height = 8;
  
  ws3.getRow(13).height = 24;
  mergeHdr(ws3,'B13:I13','ACTUAL (CAD $)  ·  Fill in at end of each month',C.NAVY,C.WHITE,10);
  const actualCols = ['Consulting — Actual', 'IT Projects — Actual', 'Add-ons — Actual'];
  actualCols.forEach((act, i) => {
      const r = 14 + i;
      ws3.getRow(r).height = 26;
      cellSet(ws3.getCell(`B${r}`),act,C.WHITE,C.TEXT_LT,false,10);
      cellSet(ws3.getCell(`C${r}`),'',C.WHITE,C.TEXT,false,10);
      ['D','E','F','G','H','I'].forEach(col => {
          cellSet(ws3.getCell(`${col}${r}`),0,C.WHITE,C.ACCENT,true,10,'center',false,'"$"#,##0');
      });
  });
  
  ws3.getRow(17).height = 24;
  cellSet(ws3.getCell('B17'),'ACTUAL TOTAL',C.NAVY,C.WHITE,true,10);
  cellSet(ws3.getCell('C17'),'',C.NAVY,C.WHITE,true,10);
  ['D','E','F','G','H','I'].forEach(col => {
      const target = ws3.getCell(`${col}17`);
      target.value = { formula: `SUM(${col}14:${col}16)` };
      target.font = F(true, 10, C.WHITE);
      target.fill = Fill(C.NAVY);
      target.alignment = Align('center');
      target.border = Border();
      target.numFmt = '"$"#,##0';
  });
  
  ws3.getRow(18).height = 24;
  cellSet(ws3.getCell('B18'),'VS. TARGET (±)',C.NAVY,C.WHITE,true,10);
  cellSet(ws3.getCell('C18'),'',C.NAVY,C.WHITE,true,10);
  ['D','E','F','G','H','I'].forEach(col => {
      const target = ws3.getCell(`${col}18`);
      target.value = { formula: `${col}17-${col}11` }; // Actual - Stated Target
      target.font = F(true, 10, C.WHITE);
      target.fill = Fill(C.NAVY);
      target.alignment = Align('center');
      target.border = Border();
      target.numFmt = '("$"#,##0);("$"#,##0)';
  });
  
  ws3.getRow(19).height = 10;
  
  ws3.getRow(20).height = 24;
  mergeHdr(ws3,'B20:I20','CONSULTING HOURS MODEL  ·  Reference',C.NAVY,C.WHITE,10);
  const hourModel = [
      ['Hours / week', 'Free (portfolio)', 3, 5, 8, 8, 10, 10],
      ['Rate ($/hr)', 'Building trust -> charging premium', 0, 75, 100, 125, 150, 150],
      ['Weeks / month', 'Avg 4.3', 4, 4, 4, 4, 4, 4],
  ];
  hourModel.forEach((row, i) => {
      const r = 21 + i;
      ws3.getRow(r).height = 28;
      cellSet(ws3.getCell(`B${r}`),row[0],C.LIGHT,C.TEXT,true,9);
      cellSet(ws3.getCell(`C${r}`),row[1],C.LIGHT,C.TEXT_LT,false,9,'left',true);
      ['D','E','F','G','H','I'].forEach((col, j) => {
          const val = row[j+2];
          cellSet(ws3.getCell(`${col}${r}`),val,C.WHITE,C.TEXT,false,10,'center',false);
          if (i === 1) ws3.getCell(`${col}${r}`).numFmt = '"$"#,##0'; // Match row format
      });
  });
  ws3.getRow(24).height = 28;
  cellSet(ws3.getCell('B24'),'Monthly Income',C.LIGHT,C.TEXT,true,9);
  cellSet(ws3.getCell('C24'),'hours x rate x weeks (reference model)',C.LIGHT,C.TEXT_LT,false,9,'left',true);
  ['D','E','F','G','H','I'].forEach(col => {
      const target = ws3.getCell(`${col}24`);
      target.value = { formula: `${col}21*${col}22*${col}23` }; 
      target.font = F(true, 10, C.ACCENT);
      target.fill = Fill(C.WHITE);
      target.alignment = Align('center');
      target.border = Border();
      target.numFmt = '"$"#,##0';
  });
  
  ws3.getRow(25).height = 20;
  ws3.mergeCells('C26:G26');
  cellSet(ws3.getCell('C26'),'⚡ Blue cells = enter actual values.   Orange = plan.   Navy = calculated.   Update at the end of each month.',C.WHITE,C.TEXT_LT,false,9,'center',true);

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 4 — PIPELINE
  // ══════════════════════════════════════════════════════════════════════════
  const ws4 = WB.addWorksheet('🔗 Pipeline');
  ws4.views = [{ showGridLines: false }];
  [3,18,16,22,25,14,16,14,24,3].forEach((w,i) => {
    ws4.getColumn(String.fromCharCode(65+i)).width = w;
  });

  ws4.getRow(1).height = 12; ws4.mergeCells('B1:I1'); ws4.getCell('B1').fill = Fill(C.NAVY);
  ws4.getRow(2).height = 44;
  mergeHdr(ws4,'B2:I2',`NPI OPERATING SYSTEM  ·  CLIENT PIPELINE`,C.NAVY,C.WHITE,15);
  ws4.getRow(3).height = 22;
  mergeHdr(ws4,'B3:I3','Your 6 warm contacts + new prospects  ·  Update as conversations progress',C.ACCENT,C.N_SOFT,9);
  ws4.getRow(4).height = 10;

  ws4.getRow(5).height = 26;
  mergeHdr(ws4,'B5:I5','🔥 WARM CONTACTS  —  You already have these relationships. Do not let them go cold.',C.NAVY,C.WHITE,11);

  const pipeHdrs = ['Name','Industry','Context / Source','Next Action','Status','Value Type','Timeline','Notes'];
  ws4.getRow(6).height = 22;
  pipeHdrs.forEach((h,i) => {
    hdrCell(ws4.getCell(`${String.fromCharCode(66+i)}6`),h,C.NAVY,C.WHITE,9);
  });
  
  const sampleContacts = [
      ['Ahmadreza', 'Startup / PropTech', 'Online meeting — proptech startup', 'Send follow-up with PropTech OKR framework offer', 'Warm', 'Consulting', 'Month 1', 'Strong lead — real startup with real problems'],
      ['Shahla', 'Beauty Salon', 'Online meeting — beauty salon owner', 'Offer 2-session business structure package', 'Warm', 'Consulting', 'Month 1', 'SMB owner — great case study potential'],
      ['Elham', 'IT / Career Pivot', 'Online meeting — personal dev + IT', 'Offer career positioning strategy session', 'Exploring', 'Consulting', 'Month 1', 'Different buyer — personal brand + career'],
      ['Tine', 'Startup / GTM', 'Online meeting — startup GTM strategy', 'Send GTM framework doc, book follow-up call', 'Hot', 'Consulting', 'Month 1', 'GTM = high value problem. Prioritize this one'],
      ['Amir', 'Construction', 'Online meeting — construction company', 'Offer operations + OKR structure session', 'Warm', 'Consulting', 'Month 1', 'SMB — good for early case study'],
      ['Ehsaneh', 'TBD', 'Online meeting', 'Follow up to clarify their need', 'Unclear', 'TBD', 'Month 1', 'Need more info — send a short re-engagement note'],
  ];

  for (let i = 0; i < 6; i++) {
    const r = 7 + i;
    ws4.getRow(r).height = 36;
    const isHot = sampleContacts[i][4] === 'Hot';
    const isExpl = sampleContacts[i][4] === 'Exploring';
    const isWarm = sampleContacts[i][4] === 'Warm';
    
    sampleContacts[i].forEach((val, j) => {
        const col = String.fromCharCode(66+j);
        const cell = ws4.getCell(`${col}${r}`);
        let bgStyle = C.WHITE;
        if (j === 4) { // Status column
            if (isHot) bgStyle = 'FFDDDD';
            else if (isWarm) bgStyle = 'FFF5CC';
            else if (isExpl) bgStyle = 'DDEEFF';
        }
        
        let fgColor = C.TEXT;
        if (j === 0) { // Name column
            bgStyle = C.LIGHT;
            fgColor = C.NAVY;
        }

        cellSet(cell, val, bgStyle, fgColor, j===0, 9, j===4||j===5||j===6 ? 'center' : 'left', false);
    });
  }

  ws4.getRow(13).height = 10;
  ws4.getRow(14).height = 26;
  mergeHdr(ws4,'B14:I14','➕ NEW PROSPECTS  —  Add as you meet people. Persian community first.',C.NAVY,C.WHITE,11);
  
  ws4.getRow(15).height = 22;
  pipeHdrs.forEach((h,i) => {
    hdrCell(ws4.getCell(`${String.fromCharCode(66+i)}15`),h,C.NAVY,C.WHITE,9);
  });
  
  for (let i = 0; i < 11; i++) {
      const r = 16 + i;
      ws4.getRow(r).height = 28;
      const bg = i % 2 === 0 ? C.N_SOFT : C.WHITE;
      ['B','C','D','E','F','G','H','I'].forEach((col,j) => {
        cellSet(ws4.getCell(`${col}${r}`),'',bg,C.TEXT,false,9);
      });
  }

  ws4.getRow(28).height = 10;
  ws4.mergeCells('B29:D29');
  hdrCell(ws4.getCell('B29'),'PIPELINE SUMMARY (auto)',C.NAVY,C.WHITE,10);
  [
    ['Total warm contacts',     `COUNTA(B7:B12)`],
    ['Hot leads',               `COUNTIF(F7:F12,"Hot")+COUNTIF(F16:F26,"Hot")`],
    ['Total prospects (new)',   `COUNTA(B16:B26)`],
  ].forEach(([label, formula], i) => {
    const r = 30 + i;
    ws4.getRow(r).height = 24;
    const bg = i % 2 === 0 ? C.LIGHT : C.WHITE;
    cellSet(ws4.getCell(`B${r}`),label,bg,C.TEXT,true,9);
    ws4.mergeCells(`C${r}:D${r}`);
    const sc = ws4.getCell(`C${r}`);
    sc.value = { formula };
    sc.font = F(true,12, i === 1 ? C.RED : C.ACCENT);
    sc.fill = Fill(bg);
    sc.alignment = Align('center');
    sc.border = Border();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // SHEET 5 — IMPACT LOG
  // ══════════════════════════════════════════════════════════════════════════
  const ws5 = WB.addWorksheet('📋 Impact Log');
  ws5.views = [{ showGridLines: false }];
  [3,14,20,24,24,22,14,14,26,3].forEach((w,i) => {
    ws5.getColumn(String.fromCharCode(65+i)).width = w;
  });

  ws5.getRow(1).height = 12; ws5.mergeCells('B1:I1'); ws5.getCell('B1').fill = Fill(C.NAVY);
  ws5.getRow(2).height = 44;
  mergeHdr(ws5,'B2:I2',`NPI OPERATING SYSTEM  ·  IMPACT LOG`,C.NAVY,C.WHITE,15);
  ws5.getRow(3).height = 22;
  mergeHdr(ws5,'B3:I3','Running record of every real-world outcome your brand creates  ·  One row per signal, added as they happen',C.I_BG,C.I_SOFT,9);
  ws5.getRow(4).height = 10;

  const logHdrs = ['Date','Signal Type','Person / Org','Description','Source Content','Status','Value','Notes'];
  ws5.getRow(5).height = 24;
  logHdrs.forEach((h,i) => {
    hdrCell(ws5.getCell(`${String.fromCharCode(66+i)}5`),h,C.I_BG,C.WHITE,9);
  });
  
  const sampleLog = [
      ['12-Apr-2026', 'Qualified lead', 'Tine / Startup GTM', 'Asked for full GTM strategy engagement after our call', 'Initial meeting', 'Active', 'High', 'Prioritize — real budget signal'],
      ['12-Apr-2026', 'Qualified lead', 'Amir / Construction Co', 'Wants OKR setup + quarterly planning support', 'Initial meeting', 'Warm', 'Medium', 'Follow up this week'],
      ['12-Apr-2026', 'Portfolio case study', 'Shahla / Beauty Salon', 'Agreed to be a case study after free session', 'Free consultation', 'Confirmed', 'High', 'Write up and publish on LinkedIn'],
      ['12-Apr-2026', 'Speaking invite', 'Persian Founders TO', 'Asked to speak on business strategy at their next meetup', 'LinkedIn activity', 'Confirmed', 'High', 'Good community signal — accept'],
      ['12-Apr-2026', 'IT Project inquiry', 'Ahmadreza / PropTech', 'Wants help with their tech stack decisions and vendor selection', 'Initial meeting', 'Exploring', 'High', 'Could be Fractional CTO intro']
  ];

  for (let i = 0; i < 25; i++) {
    const r = 6 + i;
    ws5.getRow(r).height = 36;
    const bg = i % 2 === 0 ? C.I_SOFT : C.WHITE;
    
    if (i < 5) {
        // Render sample
        cellSet(ws5.getCell(`B${r}`), sampleLog[i][0], bg, C.TEXT, true, 9, 'center');
        ['C','D','E','F','G'].forEach((col, j) => cellSet(ws5.getCell(`${col}${r}`), sampleLog[i][j+1], bg, C.TEXT, false, 9));
        cellSet(ws5.getCell(`H${r}`), sampleLog[i][6], bg, C.TEXT, false, 9, 'center');
        cellSet(ws5.getCell(`I${r}`), sampleLog[i][7], bg, C.TEXT, false, 9);
    } else {
        // Render blank
        ['B','C','D','E','F','G','H','I'].forEach((col,j) => {
          const cell = ws5.getCell(`${col}${r}`);
          cell.fill = Fill(bg);
          cell.border = Border();
          cell.font = F(false,9);
          if (col === 'B' || col === 'H') cell.alignment = Align('center');
        });
    }
  }

  ws5.getRow(32).height = 10;
  ws5.mergeCells('B33:D33');
  hdrCell(ws5.getCell('B33'),'IMPACT SUMMARY (auto-calculated)',C.I_BG,C.WHITE,10);
  const summRows = [
    ['Total signals logged',      'COUNTA(C6:C30)'],
    ['Qualified leads (auto)',        'COUNTIF(C6:C30,"Qualified lead*")'],
    ['IT project inquiries',      'COUNTIF(C6:C30,"IT Project*")'],
    ['Speaking invitations',      'COUNTIF(C6:C30,"Speaking*")'],
    ['High-value signals',        'COUNTIF(H6:H30,"High")'],
    ['Portfolio / case studies',  'COUNTIF(C6:C30,"*case study*")']
  ];
  summRows.forEach(([label, formula], i) => {
    const r = 34 + i;
    ws5.getRow(r).height = 24;
    const bg = i % 2 === 0 ? C.I_SOFT : C.WHITE;
    cellSet(ws5.getCell(`B${r}`),label,bg,C.TEXT,false,10);
    ws5.mergeCells(`C${r}:D${r}`);
    const sc = ws5.getCell(`C${r}`);
    sc.value = { formula };
    sc.font = F(true,11,C.I_BG);
    sc.fill = Fill(bg);
    sc.alignment = Align('center');
    sc.border = Border();
  });

  // ── Set active sheet to Weekly Tracker ──
  // Default tab is the first (Narrative)

  // ── Generate & download ──
  const buffer = await WB.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
