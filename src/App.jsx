import { useState } from "react";

// ── COLOURS — Major Industries ────────────────────────────────────────────────
const C = {
  bg:        "#f5f6f5",
  white:     "#ffffff",
  green:     "#5a9a3a",
  greenDark: "#3d6b27",
  greenLight:"#eaf3e5",
  border:    "#d4e4cb",
  text:      "#1a2e12",
  muted:     "#6b8560",
  subtle:    "#f0f7ec",
  red:       "#c0392b",
};

const SOW_TYPES = [
  { id:"mould",              label:"Mould Remediation",      icon:"🍄" },
  { id:"contents",           label:"Contents Remediation",   icon:"📦" },
  { id:"contents_relocation",label:"Contents Relocation",    icon:"🚚" },
  { id:"stripout",           label:"Strip Out",              icon:"🔨" },
  { id:"flooring",           label:"Flooring Removal",       icon:"🪵" },
  { id:"flood",              label:"Flood Remediation",      icon:"💧" },
  { id:"restoration",        label:"Restoration Cleaning",   icon:"✨" },
  { id:"drying",             label:"Drying",                 icon:"💨" },
];

const WORKS_TEMPLATES = {
  mould:            "Erection of containment to contain the work zone.\nEstablish negative air pressure using air filtration devices (AFDs).\nRemoval of the affected section of the [wall/ceiling].\nHEPA vac + sanitation of all affected surfaces.\nInstallation of drying equipment.\nEncapsulation of the affected building material as required.",
  contents:         "Assessment and inventory of the affected items.\nRemoval of affected items for disposal.\nPacking and relocation of restorable/non-affected items.\nHEPA vac + sanitation of restorable items.\nReinstatement of contents.",
  contents_relocation: "Packing and relocation of contents.\nReinstatement of contents.",
  stripout:         "Strip out of walls in the affected areas up to 1200mm.\nRemoval of all affected insulation.",
  flooring:         "Removal of the affected floor covering.\nHEPA vac + sanitation of subfloor.\nInstallation of drying equipment.",
  flood_contents:   "All contents to be relocated.\nSome items may require cleaning during the relocation process.\nIf an inventory is required, one full day will be allowed to complete it.\nA large storage unit is recommended to allow adequate space for storage and handling.",
  flood_stripout:   "Strip out of walls up to 1200mm to expose all affected structural elements for proper cleaning and drying.\nRemoval of all affected insulation.",
  flood_siteprep:   "Properly contain and protect items such as air conditioning units and other fixtures to prevent contamination or damage during the cleaning process.\nSet up air filtration devices (HEPA air scrubbers) to ensure a clean and safe environment for the duration of the restoration works.",
  flood_restoration:"Surface Preparation: Inspection to ensure all affected materials have been fully stripped out. Removal of nails, fixings, adhesives and residues.\nHEPA Vacuuming: Thorough HEPA vacuuming of all exposed surfaces including floors, walls and timbers.\nSanitisation: Application of an industry-approved sanitising solution combined with abrasive cleaning.\nCleaning of Windows, Tracks and Fixtures: Clean all windows, fan blades, light fixtures and all surfaces.\nDrying Process: Installation of drying equipment. Moisture levels monitored throughout.",
  restoration:      "Removal of the affected smoothedge.\nHEPA vacuuming of all impacted areas.\nSanitisation of the subfloor.\nOdour control treatment including fogging due to strong odour identified on-site.",
  drying:           "Sanitation of affected areas.\nInstallation of drying equipment.\nMoisture readings and monitoring throughout drying period.",
};

// ── DOCUMENT ASSEMBLY ─────────────────────────────────────────────────────────
function tobullets(text) {
  if (!text) return "";
  return text.split("\n").filter(s => s.trim()).map(s => "\t• " + s.trim()).join("\n");
}

function equipBlock(defs, values) {
  const lines = [];
  defs.forEach(({ key, label }) => {
    const qty = values[key]?.qty ?? 0;
    if (qty > 0) lines.push(label + "\n\t• Quantity: " + qty + "\n\t• Days used: " + (values[key]?.days ?? 1));
  });
  Object.entries(values).forEach(([k, v]) => {
    if (k.startsWith("cx_") && (v.qty ?? 0) > 0)
      lines.push((v.label || k) + "\n\t• Quantity: " + v.qty + "\n\t• Days used: " + (v.days ?? 1));
  });
  return lines.join("\n\n") || "No equipment specified";
}

const GENERAL_SCOPE = "\t• Disposal of contaminated or non-restorable materials\n\t• Transport of waste to approved disposal facility\n\t• Cleaning and sanitising of tools and equipment after works\n\t• Compile report of findings and works carried out for each attendance";
const LABOUR_FULL   = "\t• Labour carried out during initial attendance\n\t• Reassessment of affected areas during re-attendance\n\t• Moisture readings and monitoring\n\t• Adjustment, relocation, and removal of equipment\n\t• Final checks and confirmation of completion";
const LABOUR_SHORT  = "\t• Labour carried out during initial attendance\n\t• Final checks and confirmation of completion";

function buildMould(d, works) {
  // Trades block
  const tradeLines = [];
  if (d.builder)   tradeLines.push("Builder:\n\t- " + d.builder);
  if (d.electrician) tradeLines.push("Electrician:\n\t- " + d.electrician);
  if (d.plumber)   tradeLines.push("Plumber:\n\t- " + d.plumber);
  if (d.otherTrade) tradeLines.push("Other:\n\t- " + d.otherTrade);
  const tradesText = tradeLines.length ? tradeLines.join("\n") : "None";

  // Labour lines depend on whether drying is required
  const labourLines = d.dryingRequired === "yes"
    ? LABOUR_FULL
    : "\t• Labour carried out during initial attendance\n\t• Moisture readings and monitoring\n\t• Final checks and confirmation of completion";
  const equipDefs = [];
  if (d.dryingRequired === "yes") {
    equipDefs.push({key:"dehum", label:"Dehumidifiers"});
    equipDefs.push({key:"mover", label:"Air Movers / Fans"});
  }
  equipDefs.push({key:"scrubber", label:"Air Scrubbers"});
  equipDefs.push({key:"hepa",    label:"HEPA Vacuumed"});
  equipDefs.push({key:"poles",   label:"Containment Poles"});

  // Consumables
  const cons = [
    "Antimicrobial solution","Plastic sheeting","PPE","Filters / bags",
    "Microfibre cloths","Containment doors","Multi tools blade","Blade",
    "Cloth tape/masking tape","Rags","Zip doors","Floor protection",
    "Percide","Mould/Stain Blocker Paint",
  ];
  if (d.specCons === "yes" && d.consDetail) cons.push(d.consDetail);

  return [
    "SOW - Mould Remediation",
    "",
    "Other trades required prior to commencement of works:",
    d.otherTrades === "yes" ? tradesText : "None",
    "",
    "Room Name / Area: " + (d.areas || "To be confirmed"),
    "",
    ...(d.siteNotes ? ["Site Notes:", tobullets(d.siteNotes), ""] : []),
    "\tWorks required:",
    tobullets(works),
    "",
    "General Scope of Works",
    GENERAL_SCOPE,
    "",
    "Labour Breakdown",
    "General summary of labour carried out onsite.",
    labourLines,
    "Total Labour Hours",
    "\t• Technician hours: " + d.techs + " Technician" + (d.techs > 1 ? "s" : "") + " x " + d.hours + " hours",
    "",
    "Equipment Breakdown",
    equipBlock(equipDefs, d.equip),
    "",
    "Consumables Breakdown",
    "List of consumables required.",
    cons.map(c => "\t• " + c).join("\n"),
    ...(d.addReqs ? ["", "Additional Requirements", d.addReqs.split(/[,\n]/).filter(Boolean).map(r => "\t• " + r.trim()).join("\n")] : []),
  ].join("\n");
}

function buildContents(d, works) {
  const phases = [
    {key:"initial",    label:"Labour carried out during initial attendance"},
    {key:"remediation",label:"Remediation of restorable items"},
    {key:"reinstate",  label:"Reinstatement of contents"},
    {key:"final",      label:"Final checks and confirmation of completion"},
  ];

  const locationLines = [];
  if (d.onsite === "yes" && d.onsiteRoom) locationLines.push("\t• On-site relocation to: " + d.onsiteRoom);
  if (d.offsite === "yes" && d.storageSize) locationLines.push("\t• Off-site storage capacity required: " + d.storageSize);
  else if (d.offsite === "yes") locationLines.push("\t• Off-site storage required — capacity to be confirmed");

  return [
    "SOW - Contents Remediation",
    "",
    "Room Name / Area: " + (d.areas || "Entire property"),
    "",
    ...(locationLines.length ? ["Relocation Details:", locationLines.join("\n"), ""] : []),
    "\tWorks required:",
    tobullets(works),
    "",
    "General Scope of Works",
    "\t• Transport of waste to approved disposal facility\n\t• Cleaning and sanitising of tools and equipment after works\n\t• Compile report of findings and works carried out for each attendance",
    "",
    "Labour Breakdown",
    "General summary of labour carried out onsite.",
    phases.filter(p => d.phases[p.key].techs > 0 && d.phases[p.key].hours > 0).map(p => "\t• " + p.label + " - " + d.phases[p.key].techs + " tech" + (d.phases[p.key].techs > 1 ? "s" : "") + " x " + d.phases[p.key].hours + " hours").join("\n"),
    "",
    "Equipment Breakdown",
    equipBlock([{key:"scrubber",label:"Air Scrubbers"},{key:"hepa",label:"HEPA Vacuumed"}], d.equip),
    "",
    "Consumables Breakdown",
    "List of consumables required.",
    "\t• Antimicrobial solution\n\t• Filters / bags\n\t• Microfibre cloths\n\t• Moving supplies (boxes, tape, bubble wrap, blankets, shrink wrap, butcher paper, etc.)",
    ...(d.specCons === "yes" && d.consDetail ? ["\t• " + d.consDetail] : []),
    ...(d.truck === "yes" ? ["", "Truck Required for " + d.truckDays + " day" + (d.truckDays > 1 ? "s" : "") + ":", "\t• Relocation of contents\n\t• Disposal of non-restorable items\n\t• Reinstatement of contents"] : []),
    ...(d.addReqs ? ["", "Additional Requirements", d.addReqs.split(/[,\n]/).filter(Boolean).map(r => "\t• " + r.trim()).join("\n")] : []),
    ...(d.siteNotes ? ["", "Site Notes:", tobullets(d.siteNotes)] : []),
  ].join("\n");
}


function buildContentsRelocation(d, works) {
  const labourLines = [];
  if (d.techsInitial > 0 && d.hoursInitial > 0)
    labourLines.push("\t• Initial attendance — packing & relocation: " + d.techsInitial + " Technician" + (d.techsInitial > 1 ? "s" : "") + " x " + d.hoursInitial + " hours");
  if (d.techsReinstate > 0 && d.hoursReinstate > 0)
    labourLines.push("\t• Reinstatement of contents: " + d.techsReinstate + " Technician" + (d.techsReinstate > 1 ? "s" : "") + " x " + d.hoursReinstate + " hours");

  const locationLines = [];
  if (d.onsite === "yes" && d.onsiteRoom) locationLines.push("\t• On-site relocation to: " + d.onsiteRoom);
  if (d.offsite === "yes" && d.storageSize) locationLines.push("\t• Off-site storage capacity required: " + d.storageSize);
  else if (d.offsite === "yes") locationLines.push("\t• Off-site storage required — capacity to be confirmed");

  const equipDefs = [
    {key:"truck",   label:"Truck"},
    {key:"trolley", label:"Trolley / Hand Trolley"},
    {key:"straps",  label:"Lifting Straps"},
  ];

  return [
    "SOW - Contents Relocation",
    "",
    "Room Name / Area: " + (d.areas || "Entire property"),
    "",
    "\tWorks required:",
    tobullets(works),
    "",
    ...(locationLines.length ? ["Relocation Details:", locationLines.join("\n"), ""] : []),
    "General Scope of Works",
    "\t• Cleaning and sanitising of tools and equipment after works\n\t• Compile report of findings and works carried out for each attendance",
    "",
    "Labour Breakdown",
    "General summary of labour carried out onsite.",
    labourLines.join("\n") || "\t• Labour carried out during initial attendance",
    "",
    "Equipment Breakdown",
    equipBlock([{key:"trolley",label:"Trolley / Hand Trolley"},{key:"straps",label:"Lifting Straps"}], d.equip),
    "",
    "Consumables Breakdown",
    "List of consumables required.",
    "\t• Moving supplies (boxes, tape, bubble wrap, blankets, shrink wrap, butcher paper, etc.)",
    ...(d.specCons === "yes" && d.consDetail ? ["\t• " + d.consDetail] : []),
    ...(d.truck === "yes" ? ["", "Truck required: Yes\n\t• Number of days: " + (d.truckDays || "To be confirmed")] : []),
    ...(d.addReqs ? ["", "Additional Requirements", d.addReqs.split(/[,\n]/).filter(Boolean).map(r => "\t• " + r.trim()).join("\n")] : []),
    ...(d.siteNotes ? ["", "Site Notes:", tobullets(d.siteNotes)] : []),
  ].join("\n");
}

function buildStripout(d, works) {
  const trades = [];
  if (d.elec)    trades.push("Electrician\n" + d.elec);
  if (d.plumb)   trades.push("Plumber\n" + d.plumb);
  if (d.builder) trades.push("Builder\n" + d.builder);
  if (d.other)   trades.push("Other\n" + d.other);
  if (d.asbestos === "yes") trades.push("Other\n\t⁃ Asbestos clearance certificate required as there is potential asbestos on-site.");
  if (d.skipBin === "yes")  trades.push("Other\n\t⁃ " + (d.skipDetail || "Installation of a skip bin to dispose of building materials."));
  return [
    "SOW - Strip Out",
    "",
    "Other trades required prior to commencement of works:",
    trades.length ? trades.join("\n\n") : "None",
    "",
    "Room Name / Area: " + (d.areas || "To be confirmed"),
    "",
    "\tWorks required:",
    tobullets(works),
    "",
    "General Scope of Works",
    GENERAL_SCOPE,
    "",
    "Labour Breakdown",
    "General summary of labour carried out onsite.",
    LABOUR_SHORT,
    "Total Labour Hours",
    "\t• Technician hours: " + d.techs + " Technician" + (d.techs > 1 ? "s" : "") + " x " + d.hours + " hours",
    "",
    "Equipment Breakdown",
    equipBlock([{key:"scrubber",label:"Air Scrubbers"},{key:"poles",label:"Containment Poles"}], d.equip),
    "",
    "Consumables Breakdown",
    "List of consumables required.",
    "\t• Plastic sheeting\n\t• PPE\n\t• Filters / bags\n\t• Containment doors\n\t• Multi tools blade\n\t• Blade\n\t• Cloth tape/masking tape\n\t• Rubbish bags\n\t• Floor protection",
    ...(d.addReqs ? ["", "Additional Requirements", d.addReqs.split(/[,\n]/).filter(Boolean).map(r => "\t• " + r.trim()).join("\n")] : []),
  ].join("\n");
}

function buildFlooring(d, works) {
  return [
    "SOW - Flooring Removal",
    "",
    "Room Name / Area: " + (d.areas || "To be confirmed"),
    ...(d.vacate === "yes" ? ["", "Contents currently on site may be temporarily relocated on-site for the duration of the flooring removal, in order to facilitate safe and efficient remediation works. However, we recommend that the insured vacate the property during this period, due to the potential disruption and health risks associated with the works."] : []),
    "",
    "\tWorks required:",
    tobullets(works),
    "",
    "General Scope of Works",
    GENERAL_SCOPE,
    "",
    "Labour Breakdown",
    "General summary of labour carried out onsite.",
    LABOUR_FULL,
    "Total Labour Hours",
    "\t• Technician hours: " + d.techs + " Technician" + (d.techs > 1 ? "s" : "") + " x " + d.hours + " hours",
    "",
    "Equipment Breakdown",
    equipBlock([{key:"dehum",label:"Dehumidifiers"},{key:"mover",label:"Air Movers / Fans"},{key:"hepa",label:"HEPA Vacuumed"}], d.equip),
    "",
    "Consumables Breakdown",
    "List of consumables required.",
    "\t• Antimicrobial solution\n\t• PPE\n\t• Filters / bags\n\t• Microfibre cloths\n\t• Blade\n\t• Mop/Mop pad\n\t• Cloth tape/masking tape\n\t• Rags",
    ...(d.truck === "yes" ? ["", "Truck needed for disposal of removed flooring materials."] : []),
    ...(d.highCost === "yes" ? ["High-cost disposal required."] : []),
    ...(d.addReqs ? ["", "Additional Requirements", d.addReqs.split(/[,\n]/).filter(Boolean).map(r => "\t• " + r.trim()).join("\n")] : []),
  ].join("\n");
}

function buildFlood(d, works) {
  const trades = [];
  if (d.elec)    trades.push("Electrician\n" + d.elec);
  if (d.plumb)   trades.push("Plumber\n" + d.plumb);
  if (d.builder) trades.push("Builder\n" + d.builder);
  return [
    "SOW - Flood Remediation",
    "",
    "Other trades required prior to commencement of works:",
    trades.length ? trades.join("\n\n") : "None",
    "",
    "Room Name / Area: " + (d.areas || "To be confirmed"),
    "",
    "**Preparation for Restoration Cleaning**",
    "",
    "1 - Relocation of contents:",
    toButtons(works.w1),
    ...(d.storageSize ? ["\t⁃ Storage unit recommended: " + d.storageSize] : []),
    "",
    "Total Labour Hours",
    "\t• Technician hours: " + d.techs1 + " Technician" + (d.techs1 > 1 ? "s" : "") + " x " + d.hours1 + " hours",
    "",
    "Equipment Breakdown",
    equipBlock([{key:"truck",label:"Truck"},{key:"trolley",label:"Trolley/Hand trolley"},{key:"straps",label:"Lifting straps"}], d.equip1),
    "",
    "Consumables Breakdown",
    "\t• Moving boxes ≈ 50\n\t• Packing supplies (butcher paper, bubble wrap, packing tape, furniture blanket, shrink wrap, etc.)\n\t• Antimicrobial\n\t• Rags",
    "",
    "2 - Strip-Out:",
    toButtons(works.w2),
    "",
    "Total Labour Hours",
    "\t• Technician hours: " + d.techs2 + " Technician" + (d.techs2 > 1 ? "s" : "") + " x " + d.hours2 + " hours",
    "",
    "Equipment Breakdown",
    "\t• Truck for disposal.",
    equipBlock([{key:"scrubber",label:"Air Scrubbers"},{key:"hepa",label:"HEPA Vacuum"}], d.equip2),
    "",
    "Consumables Breakdown",
    "\t• Plastic sheeting\n\t• PPE\n\t• Rubbish bags",
    "",
    "3 - Site preparation for Restoration cleaning:",
    toButtons(works.w3),
    "",
    "Total Labour Hours",
    "\t• Technician hours: " + d.techs3 + " Technician" + (d.techs3 > 1 ? "s" : "") + " x " + d.hours3 + " hours",
    "",
    "Equipment Breakdown",
    equipBlock([{key:"scrubber",label:"Air Scrubbers"}], d.equip3),
    "",
    "**Restoration Cleaning**",
    "",
    "4 - Restoration Cleaning:",
    toButtons(works.w4),
    "",
    "Total Labour Hours",
    "\t• Technician hours: " + d.techs4 + " Technician" + (d.techs4 > 1 ? "s" : "") + " x " + d.hours4 + " hours",
    "",
    "Equipment Breakdown",
    equipBlock([{key:"dehum",label:"Dehumidifiers"},{key:"scrubber",label:"Air Scrubbers"},{key:"mover",label:"Air Movers / Fans"},{key:"hepa",label:"HEPA Vacuumed"}], d.equip4),
    "",
    "Consumables Breakdown",
    "\t• Antimicrobial solution\n\t• Plastic sheeting\n\t• PPE\n\t• Filters / bags\n\t• Microfibre cloths\n\t• Blade\n\t• Cloth tape/masking tape\n\t• Rags\n\t• Rubbish bags\n\t• Percide\n\t• Mop pads\n\t• Mop\n\t• Hand brushes\n\t• White vinegar",
    "",
    "Final Inspection:",
    "\t• Conduct a final walkthrough and moisture level check to confirm that the property has been properly cleaned, sanitised, and dried.",
    ...(d.addReqs ? ["", "Additional Requirements", d.addReqs.split(/[,\n]/).filter(Boolean).map(r => "\t• " + r.trim()).join("\n")] : []),
  ].join("\n");
}

// alias so typo above works
function toButtons(t) { return tobullets(t); }

function buildRestoration(d, works) {
  return [
    "SOW - Restoration Cleaning",
    "",
    "Room Name / Area: " + (d.areas || "To be confirmed"),
    "",
    "\tWorks required:",
    toButtons(works),
    "",
    "General Scope of Works",
    GENERAL_SCOPE,
    "",
    "Labour Breakdown",
    "General summary of labour carried out onsite.",
    LABOUR_SHORT,
    "Total Labour Hours",
    "\t• Technician hours: " + d.techs + " Technician" + (d.techs > 1 ? "s" : "") + " x " + d.hours + " hours",
    "",
    "Equipment Breakdown",
    equipBlock([{key:"scrubber",label:"Air Scrubbers"},{key:"hepa",label:"HEPA Vacuum"},{key:"fogging",label:"Fogging Machine"}], d.equip),
    "",
    "Consumables Breakdown",
    "List of consumables required.",
    "\t• PPE\n\t• Filters / bags\n\t• Cloth tape/masking tape\n\t• Rubbish bags\n\t• Antimicrobial\n\t• Odorx",
    ...(d.addReqs ? ["", "Additional Requirements", d.addReqs.split(/[,\n]/).filter(Boolean).map(r => "\t• " + r.trim()).join("\n")] : []),
  ].join("\n");
}

function buildDrying(d, works) {
  return [
    "SOW - Drying",
    "",
    "Room Name / Area: " + (d.areas || "To be confirmed"),
    "",
    "\tWorks required:",
    toButtons(works),
    "",
    "General Scope of Works",
    "\t• Compile report of findings and works carried out for each attendance",
    "",
    "Labour Breakdown",
    "General summary of labour carried out onsite.",
    LABOUR_FULL,
    "Total Labour Hours",
    "\t• Technician hours: " + d.techs + " Technician" + (d.techs > 1 ? "s" : "") + " x " + d.hours + " hours",
    "",
    "Equipment Breakdown",
    equipBlock([{key:"dehum",label:"Dehumidifiers"},{key:"mover",label:"Air Movers / Fans"}], d.equip),
    "",
    "Consumables Breakdown",
    "List of consumables required.",
    "\t• Antimicrobial solution\n\t• PPE\n\t• Filters / bags\n\t• Microfibre cloths\n\t• Rags",
    ...(d.addReqs ? ["", "Additional Requirements", d.addReqs.split(/[,\n]/).filter(Boolean).map(r => "\t• " + r.trim()).join("\n")] : []),
  ].join("\n");
}

// ── AI TEXT CLEANER ───────────────────────────────────────────────────────────
async function aiClean(text, mode = "inline") {
  if (!text || !text.trim()) return text;
  const context = "You are an expert scope of work writer for a professional property remediation and restoration company in Australia (Major Industries Restoration). You are highly familiar with industry terminology and standards: HEPA vacuuming, containment setup, negative air pressure, air scrubbers (AFDs), dehumidifiers, air movers, sanitation, encapsulation, strip out, moisture readings, drying equipment, antimicrobial treatment, odour control, fogging, clearance certificates, etc. The input may be in any language (French, English, etc.) — always output in English. Do not add information that was not mentioned by the technician.";
  const prompts = {
    bullets: context + "\n\nConvert the following technician notes into clean, professional bullet points suitable for a Scope of Work document. Use correct industry terminology. Output ONLY the bullet points, one per line, plain text, no dashes or asterisks. Fix spelling or transcription errors.\n\nNotes:\n" + text,
    inline:  context + "\n\nClean up the following field text: fix spelling, transcription errors, grammar, and translate to English if needed. Use correct industry terminology where appropriate. Output ONLY the corrected text, nothing else.\n\nText:\n" + text,
    trades:  context + "\n\nClean up the following trade requirement notes: fix spelling, transcription errors, grammar, and translate to English if needed. Keep professional and concise. Output ONLY the corrected text, nothing else.\n\nText:\n" + text,
    translate: "Translate the following text to English if it is not already in English. Fix spelling errors. Output ONLY the translated/corrected text, nothing else. Do not add any explanation or extra words.\n\nText:\n" + text,
    sitenotes: context + "\n\nClean up the following site notes written by a technician. Fix spelling and transcription errors only. Keep every point exactly as written — do not add, remove, or interpret anything. Output each note as a separate line, plain text, no bullets or dashes.\n\nNotes:\n" + text,
  };
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [{ role: "user", content: prompts[mode] || prompts.inline }],
      }),
    });
    const data = await res.json();
    return data.content?.map(b => b.text || "").join("").trim() || text;
  } catch {
    return text;
  }
}

// Clean multiple fields in parallel
async function cleanAll(fields) {
  const entries = Object.entries(fields);
  const results = await Promise.all(entries.map(([, { text, mode }]) => aiClean(text, mode)));
  return Object.fromEntries(entries.map(([key], i) => [key, results[i]]));
}



// ── UI COMPONENTS ─────────────────────────────────────────────────────────────
function TextField({ value, onChange, placeholder, rows = 3, templateKey }) {
  const tmpl = templateKey ? WORKS_TEMPLATES[templateKey] : null;
  return (
    <div>
      {tmpl && (
        <button onClick={() => onChange(tmpl)} style={{ marginBottom:10, padding:"10px 18px", borderRadius:9, background:C.green, border:"none", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:8, boxShadow:"0 2px 8px rgba(90,154,58,0.25)" }}>
          <span style={{fontSize:16}}>📋</span> Use Standard Template
        </button>
      )}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width:"100%", boxSizing:"border-box", padding:"11px 14px", borderRadius:10, border:"1.5px solid "+C.border, background:C.white, color:C.text, fontSize:14, fontFamily:"inherit", resize:"vertical", lineHeight:1.6, outline:"none" }} />
    </div>
  );
}

function Stepper({ value, onChange, min = 0, max = 99 }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", background:C.white, borderRadius:8, border:"1.5px solid "+C.border, overflow:"hidden" }}>
      <button onClick={() => onChange(Math.max(min, value - 1))}
        style={{ width:40, height:40, background:"none", border:"none", borderRight:"1px solid "+C.border, color: value <= min ? C.border : C.green, fontSize:22, fontWeight:700, cursor: value <= min ? "default" : "pointer", lineHeight:1, flexShrink:0 }}>−</button>
      <input type="number" value={value}
        onChange={e => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || 0)))}
        style={{ width:46, textAlign:"center", background:"none", border:"none", color:C.text, fontSize:16, fontWeight:700, fontFamily:"inherit", outline:"none", flexShrink:0 }} />
      <button onClick={() => onChange(Math.min(max, value + 1))}
        style={{ width:40, height:40, background:"none", border:"none", borderLeft:"1px solid "+C.border, color:C.green, fontSize:22, fontWeight:700, cursor:"pointer", lineHeight:1, flexShrink:0 }}>+</button>
    </div>
  );
}

function Card({ children }) {
  return (
    <div style={{ background:C.white, borderRadius:12, border:"1.5px solid "+C.border, padding:"16px 18px", marginBottom:14 }}>
      {children}
    </div>
  );
}

function SectionTitle({ number, title }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
      <div style={{ width:24, height:24, borderRadius:"50%", background:C.green, color:"#fff", fontSize:11, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{number}</div>
      <span style={{ fontSize:12, fontWeight:700, color:C.green, textTransform:"uppercase", letterSpacing:1.1 }}>{title}</span>
    </div>
  );
}

function Sec({ number, title, children }) {
  return (
    <div style={{ marginBottom:14 }}>
      <SectionTitle number={number} title={title} />
      <Card>{children}</Card>
    </div>
  );
}

const lbl = { fontSize:12, color:C.muted, marginBottom:6, display:"block", fontWeight:600, textTransform:"uppercase", letterSpacing:0.7 };

function YesNo({ value, onChange }) {
  const btn = opt => ({
    padding:"8px 22px", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit",
    border:"1.5px solid "+(value === opt ? C.green : C.border),
    background: value === opt ? C.green : C.white,
    color: value === opt ? "#fff" : C.muted,
  });
  return <div style={{display:"flex",gap:10}}><button style={btn("yes")} onClick={()=>onChange("yes")}>Yes</button><button style={btn("no")} onClick={()=>onChange("no")}>No</button></div>;
}

function EquipGrid({ defs, values, setValues }) {
  const [newName, setNewName] = useState("");
  const setE = (key, field, val) => setValues(p => ({ ...p, [key]: { ...p[key], [field]: val } }));
  const addCustom = () => {
    if (!newName.trim()) return;
    const key = "cx_" + Date.now();
    setValues(p => ({ ...p, [key]: { qty:1, days:1, label:newName.trim() } }));
    setNewName("");
  };
  const removeCustom = key => setValues(p => { const n = {...p}; delete n[key]; return n; });
  const customs = Object.entries(values).filter(([k]) => k.startsWith("cx_")).map(([k,v]) => ({ key:k, label:v.label||k, custom:true }));
  const allDefs = [...defs, ...customs];

  return (
    <div>
      {allDefs.map(({ key, label, custom }) => (
        <div key={key} style={{ marginBottom:14, paddingBottom:14, borderBottom:"1px solid "+C.border }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:14, color:C.text, fontWeight:600 }}>{label}</span>
            {custom && <button onClick={() => removeCustom(key)} style={{ background:"none", border:"none", color:C.red, cursor:"pointer", fontSize:18, padding:"0 4px" }}>×</button>}
          </div>
          <div style={{ display:"flex", gap:16 }}>
            <div>
              <span style={{ ...lbl, marginBottom:4 }}>Qty</span>
              <Stepper value={values[key]?.qty ?? 0} onChange={v => setE(key, "qty", v)} />
            </div>
            <div>
              <span style={{ ...lbl, marginBottom:4 }}>Days</span>
              <Stepper value={values[key]?.days ?? 1} onChange={v => setE(key, "days", v)} />
            </div>
          </div>
        </div>
      ))}
      <div style={{ display:"flex", gap:8, marginTop:4 }}>
        <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key==="Enter"&&addCustom()}
          placeholder="Add equipment…"
          style={{ flex:1, padding:"10px 12px", borderRadius:8, border:"1.5px solid "+C.border, background:C.subtle, color:C.text, fontSize:13, fontFamily:"inherit", outline:"none" }} />
        <button onClick={addCustom} style={{ padding:"10px 18px", borderRadius:8, background:C.greenLight, border:"1.5px solid "+C.border, color:C.green, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>+ Add</button>
      </div>
    </div>
  );
}

function GenBtn({ onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading} style={{ width:"100%", padding:"16px", borderRadius:12, marginTop:4,
      background: loading ? C.muted : C.green, border:"none", color:"#fff",
      fontSize:16, fontWeight:700, cursor: loading ? "not-allowed" : "pointer", fontFamily:"inherit" }}>
      {loading ? "⚙️ Generating…" : "Generate Scope of Work →"}
    </button>
  );
}

// ── MOULD FORM ────────────────────────────────────────────────────────────────
function MouldForm({ onResult }) {
  const [areas,setAreas]=useState("");
  const [otherTrades,setOtherTrades]=useState(null);
  const [builder,setBuilder]=useState("");
  const [electrician,setElectrician]=useState("");
  const [plumber,setPlumber]=useState("");
  const [otherTrade,setOtherTrade]=useState("");
  const [works,setWorks]=useState("");
  const [techs,setTechs]=useState(2);
  const [hours,setHours]=useState(10);
  const [dryingRequired,setDryingRequired]=useState(null);
  const [equip,setEquip]=useState({ dehum:{qty:1,days:5}, mover:{qty:2,days:5}, scrubber:{qty:1,days:1}, hepa:{qty:1,days:1}, poles:{qty:4,days:1} });
  const [specCons,setSpecCons]=useState(null);
  const [consDetail,setConsDetail]=useState("");
  const [addReqs,setAddReqs]=useState("");
  const [siteNotes,setSiteNotes]=useState("");
  const [loading,setLoading]=useState(false);

  const DEFS_DRYING=[{key:"dehum",label:"Dehumidifier"},{key:"mover",label:"Air Mover / Fan"}];
  const DEFS_ALWAYS=[{key:"scrubber",label:"Air Scrubber (AFD)"},{key:"hepa",label:"HEPA Vacuum"},{key:"poles",label:"Containment Poles"}];

  const CONS_STD=["Antimicrobial solution","Plastic sheeting","PPE","Filters / bags","Microfibre cloths","Containment doors","Multi-tool blades","Blade","Cloth tape / masking tape","Rags","Zip doors","Floor protection","Percide","Mould/Stain Blocker Paint"];

  const go = async () => {
    setLoading(true);
    const cleaned = await cleanAll({
      areas:       { text: areas,       mode: "translate" },
      builder:     { text: builder,     mode: "trades"    },
      electrician: { text: electrician, mode: "trades"    },
      plumber:     { text: plumber,     mode: "trades"    },
      otherTrade:  { text: otherTrade,  mode: "trades"    },
      works:       { text: works || WORKS_TEMPLATES.mould, mode: "bullets" },
      consDetail:  { text: consDetail,  mode: "translate"    },
      addReqs:     { text: addReqs,     mode: "translate"    },
      siteNotes:   { text: siteNotes,   mode: "sitenotes" },
    });
    onResult(buildMould({
      areas:cleaned.areas, otherTrades,
      builder:cleaned.builder, electrician:cleaned.electrician,
      plumber:cleaned.plumber, otherTrade:cleaned.otherTrade,
      techs, hours, dryingRequired, equip,
      specCons, consDetail:cleaned.consDetail,
      addReqs:cleaned.addReqs, siteNotes:cleaned.siteNotes,
    }, cleaned.works));
    setLoading(false);
  };

  return (<div>
    {/* 1. Areas */}
    <Sec number={1} title="Areas / Rooms Affected">
      <TextField value={areas} onChange={setAreas} placeholder="e.g. kitchen, bedroom 1, hallway ceiling…"/>
    </Sec>

    {/* 2. Other Trades */}
    <Sec number={2} title="Other Trades Required">
      <span style={lbl}>Any trades needed before works begin?</span>
      <YesNo value={otherTrades} onChange={setOtherTrades}/>
      {otherTrades==="yes"&&(
        <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <span style={lbl}>Builder</span>
            <TextField value={builder} onChange={setBuilder} placeholder="e.g. Removal of kitchen cabinetry…" rows={2}/>
          </div>
          <div>
            <span style={lbl}>Electrician</span>
            <TextField value={electrician} onChange={setElectrician} placeholder="e.g. Isolation of power outlets…" rows={2}/>
          </div>
          <div>
            <span style={lbl}>Plumber</span>
            <TextField value={plumber} onChange={setPlumber} placeholder="e.g. Identify and rectify source of water ingress…" rows={2}/>
          </div>
          <div>
            <span style={lbl}>Other trade (if needed)</span>
            <TextField value={otherTrade} onChange={setOtherTrade} placeholder="e.g. Asbestos removalist, structural engineer…" rows={2}/>
          </div>
        </div>
      )}
    </Sec>

    {/* 3. Works Required */}
    <Sec number={3} title="Works Required">
      <TextField value={works} onChange={setWorks} placeholder="Describe what needs to be done…" rows={5} templateKey="mould"/>
    </Sec>

    {/* 4. Labour */}
    <Sec number={4} title="Labour">
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Sec>

    {/* 5. Equipment */}
    <Sec number={5} title="Equipment">
      <span style={lbl}>Drying equipment required?</span>
      <YesNo value={dryingRequired} onChange={setDryingRequired}/>
      {dryingRequired==="yes"&&(
        <div style={{marginTop:14, paddingBottom:14, borderBottom:"1px solid "+C.border}}>
          <EquipGrid defs={DEFS_DRYING} values={equip} setValues={setEquip}/>
        </div>
      )}
      <div style={{marginTop:14}}>
        <span style={{...lbl, marginBottom:10}}>AFD, HEPA Vacuum & Containment Poles</span>
        <EquipGrid defs={DEFS_ALWAYS} values={equip} setValues={setEquip}/>
      </div>
    </Sec>

    {/* 6. Consumables */}
    <Sec number={6} title="Consumables">
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        {CONS_STD.map(c=><span key={c} style={{fontSize:11,color:C.muted,background:C.subtle,border:"1px solid "+C.border,borderRadius:5,padding:"3px 9px"}}>{c}</span>)}
      </div>
      <span style={lbl}>Anything special beyond the standard kit?</span>
      <YesNo value={specCons} onChange={setSpecCons}/>
      {specCons==="yes"&&<div style={{marginTop:10}}><TextField value={consDetail} onChange={setConsDetail} placeholder="e.g. extra sheeting, specialised PPE…" rows={2}/></div>}
    </Sec>

    {/* 7. Additional Requirements */}
    <Sec number={7} title="Additional Requirements">
      <TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed for this job…" rows={2}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>
        {["Skip bin","Off-site storage","Truck"].map(ex=><span key={ex} style={{fontSize:11,color:C.muted,background:C.subtle,border:"1px dashed "+C.border,borderRadius:5,padding:"3px 9px"}}>e.g. {ex}</span>)}
      </div>
    </Sec>

    {/* 8. Site Notes */}
    <Sec number={8} title="Site Notes — Anything that could help attending technicians">
      <TextField value={siteNotes} onChange={setSiteNotes} placeholder="e.g. high ceiling — large ladder required, access via elevator, trolley needed, park on street only…" rows={3}/>
    </Sec>

    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── CONTENTS FORM ─────────────────────────────────────────────────────────────
function ContentsForm({ onResult }) {
  const [areas,setAreas]=useState(""); const [works,setWorks]=useState("");
  const [phases,setPhases]=useState({
    initial:    {active:null, techs:3, hours:20},
    remediation:{active:null, techs:2, hours:8},
    reinstate:  {active:null, techs:3, hours:8},
    final:      {active:null, techs:1, hours:2},
  });
  const [equip,setEquip]=useState({scrubber:{qty:1,days:1},hepa:{qty:2,days:1}});
  const [onsite,setOnsite]=useState(null); const [onsiteRoom,setOnsiteRoom]=useState("");
  const [offsite,setOffsite]=useState(null); const [storageSize,setStorageSize]=useState("");
  const [truck,setTruck]=useState(null); const [truckDays,setTruckDays]=useState(4);
  const [specCons,setSpecCons]=useState(null); const [consDetail,setConsDetail]=useState("");
  const [addReqs,setAddReqs]=useState("");
  const [siteNotes,setSiteNotes]=useState("");
  const [loading,setLoading]=useState(false);

  const setP=(k,f,v)=>setPhases(p=>({...p,[k]:{...p[k],[f]:v}}));
  const DEFS=[{key:"scrubber",label:"Air Scrubber (AFD)"},{key:"hepa",label:"HEPA Vacuum"}];
  const PHASE_DEF=[
    {key:"initial",    label:"Initial attendance — assessment & inventory"},
    {key:"remediation",label:"Remediation of restorable items"},
    {key:"reinstate",  label:"Reinstatement of contents"},
    {key:"final",      label:"Final checks & confirmation"},
  ];
  const CONS_STD=["Antimicrobial solution","Filters / bags","Microfibre cloths","Moving supplies (boxes, tape, bubble wrap, blankets, shrink wrap, butcher paper, etc.)"];

  const go = async () => {
    setLoading(true);
    // Convert phases to old format for buildContents
    const phasesForBuild = {};
    PHASE_DEF.forEach(p => {
      phasesForBuild[p.key] = {
        techs: phases[p.key].active === "yes" ? phases[p.key].techs : 0,
        hours: phases[p.key].active === "yes" ? phases[p.key].hours : 0,
      };
    });
    const cleaned = await cleanAll({
      areas:       { text: areas,       mode: "translate" },
      works:       { text: works || WORKS_TEMPLATES.contents, mode: "bullets" },
      onsiteRoom:  { text: onsiteRoom,  mode: "translate" },
      storageSize: { text: storageSize, mode: "translate" },
      consDetail:  { text: consDetail,  mode: "translate" },
      addReqs:     { text: addReqs,     mode: "translate" },
      siteNotes:   { text: siteNotes,   mode: "sitenotes" },
    });
    onResult(buildContents({
      areas:cleaned.areas, phases:phasesForBuild, equip,
      onsite, onsiteRoom:cleaned.onsiteRoom,
      offsite, storageSize:cleaned.storageSize,
      truck, truckDays,
      specCons, consDetail:cleaned.consDetail,
      addReqs:cleaned.addReqs, siteNotes:cleaned.siteNotes,
    }, cleaned.works));
    setLoading(false);
  };

  return (<div>
    {/* 1. Areas */}
    <Sec number={1} title="Areas / Rooms Affected">
      <TextField value={areas} onChange={setAreas} placeholder="e.g. entire property…"/>
    </Sec>

    {/* 2. Works Required */}
    <Sec number={2} title="Works Required">
      <TextField value={works} onChange={setWorks} placeholder="Describe contents works…" rows={4} templateKey="contents"/>
    </Sec>

    {/* 3. Labour by Phase */}
    <Sec number={3} title="Labour by Phase">
      {PHASE_DEF.map(p=>(
        <div key={p.key} style={{marginBottom:18, paddingBottom:18, borderBottom:"1px solid "+C.border}}>
          <span style={{...lbl, color:C.green, marginBottom:8}}>{p.label}</span>
          <YesNo value={phases[p.key].active} onChange={v=>setP(p.key,"active",v)}/>
          {phases[p.key].active==="yes"&&(
            <div style={{display:"flex",gap:20,flexWrap:"wrap",marginTop:12}}>
              <div><span style={lbl}>Technicians</span><Stepper value={phases[p.key].techs} onChange={v=>setP(p.key,"techs",v)} min={1}/></div>
              <div><span style={lbl}>Hours</span><Stepper value={phases[p.key].hours} onChange={v=>setP(p.key,"hours",v)} min={1} max={200}/></div>
            </div>
          )}
        </div>
      ))}
    </Sec>

    {/* 4. Relocation */}
    <Sec number={4} title="Relocation">
      <span style={lbl}>Contents relocated to another room on-site?</span>
      <YesNo value={onsite} onChange={setOnsite}/>
      {onsite==="yes"&&<div style={{marginTop:12,marginBottom:18}}>
        <span style={lbl}>Which room?</span>
        <TextField value={onsiteRoom} onChange={setOnsiteRoom} placeholder="e.g. garage, master bedroom, living area…" rows={1}/>
      </div>}
      <div style={{marginTop:16}}>
        <span style={lbl}>Contents relocated to off-site storage?</span>
        <YesNo value={offsite} onChange={setOffsite}/>
        {offsite==="yes"&&<div style={{marginTop:12}}>
          <span style={lbl}>Storage capacity required</span>
          <TextField value={storageSize} onChange={setStorageSize} placeholder="e.g. ≈ 20 m², large unit, half carriage…" rows={1}/>
        </div>}
      </div>
    </Sec>

    {/* 5. Truck */}
    <Sec number={5} title="Truck Required?">
      <YesNo value={truck} onChange={setTruck}/>
      {truck==="yes"&&<div style={{marginTop:12}}>
        <span style={lbl}>Number of days</span>
        <Stepper value={truckDays} onChange={setTruckDays} min={1}/>
      </div>}
    </Sec>

    {/* 6. Equipment */}
    <Sec number={6} title="Equipment">
      <EquipGrid defs={DEFS} values={equip} setValues={setEquip}/>
    </Sec>

    {/* 7. Consumables */}
    <Sec number={7} title="Consumables">
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        {CONS_STD.map(c=><span key={c} style={{fontSize:11,color:C.muted,background:C.subtle,border:"1px solid "+C.border,borderRadius:5,padding:"3px 9px"}}>{c}</span>)}
      </div>
      <span style={lbl}>Anything special beyond the standard kit?</span>
      <YesNo value={specCons} onChange={setSpecCons}/>
      {specCons==="yes"&&<div style={{marginTop:10}}><TextField value={consDetail} onChange={setConsDetail} placeholder="e.g. extra blankets, specialised packing…" rows={2}/></div>}
    </Sec>

    {/* 8. Additional Requirements */}
    <Sec number={8} title="Additional Requirements">
      <TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/>
    </Sec>

    {/* 9. Site Notes */}
    <Sec number={9} title="Site Notes — Anything that could help attending technicians">
      <TextField value={siteNotes} onChange={setSiteNotes} placeholder="e.g. elevator access, fragile items, no parking on street…" rows={3}/>
    </Sec>

    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── CONTENTS RELOCATION FORM ──────────────────────────────────────────────────
function ContentsRelocationForm({ onResult }) {
  const [areas,setAreas]=useState("");
  const [works,setWorks]=useState("");
  const [techsInitial,setTechsInitial]=useState(3); const [hoursInitial,setHoursInitial]=useState(20);
  const [techsReinstate,setTechsReinstate]=useState(3); const [hoursReinstate,setHoursReinstate]=useState(8);
  const [onsite,setOnsite]=useState(null); const [onsiteRoom,setOnsiteRoom]=useState("");
  const [offsite,setOffsite]=useState(null); const [storageSize,setStorageSize]=useState("");
  const [truck,setTruck]=useState(null); const [truckDays,setTruckDays]=useState(1);
  const [equip,setEquip]=useState({trolley:{qty:1,days:1},straps:{qty:1,days:1}});
  const [specCons,setSpecCons]=useState(null); const [consDetail,setConsDetail]=useState("");
  const [addReqs,setAddReqs]=useState("");
  const [siteNotes,setSiteNotes]=useState("");
  const [loading,setLoading]=useState(false);
  const DEFS=[{key:"trolley",label:"Trolley / Hand Trolley"},{key:"straps",label:"Lifting Straps"}];

  const go = async () => {
    setLoading(true);
    const cleaned = await cleanAll({
      areas:       { text: areas,       mode: "translate" },
      works:       { text: works || WORKS_TEMPLATES.contents_relocation, mode: "bullets" },
      onsiteRoom:  { text: onsiteRoom,  mode: "translate" },
      storageSize: { text: storageSize, mode: "translate" },
      addReqs:     { text: addReqs,     mode: "translate" },
      consDetail:  { text: consDetail,  mode: "translate" },
      siteNotes:   { text: siteNotes,   mode: "sitenotes" },
    });
    onResult(buildContentsRelocation({
      areas:cleaned.areas, techsInitial, hoursInitial, techsReinstate, hoursReinstate,
      onsite, onsiteRoom:cleaned.onsiteRoom,
      offsite, storageSize:cleaned.storageSize,
      truck, truckDays, equip,
      specCons, consDetail:cleaned.consDetail,
      addReqs:cleaned.addReqs, siteNotes:cleaned.siteNotes,
    }, cleaned.works));
    setLoading(false);
  };

  return (<div>
    <Sec number={1} title="Areas / Rooms Affected">
      <TextField value={areas} onChange={setAreas} placeholder="e.g. entire property, ground floor…"/>
    </Sec>

    <Sec number={2} title="Works Required">
      <TextField value={works} onChange={setWorks} placeholder="Describe what needs to be relocated and how…" rows={3} templateKey="contents_relocation"/>
    </Sec>

    <Sec number={3} title="Labour">
      <div style={{marginBottom:16}}>
        <span style={{...lbl,color:C.green,marginBottom:8}}>Initial attendance — packing & relocation</span>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          <div><span style={lbl}>Technicians</span><Stepper value={techsInitial} onChange={setTechsInitial} min={0}/></div>
          <div><span style={lbl}>Hours</span><Stepper value={hoursInitial} onChange={setHoursInitial} min={0} max={200}/></div>
        </div>
      </div>
      <div>
        <span style={{...lbl,color:C.green,marginBottom:8}}>Reinstatement of contents</span>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          <div><span style={lbl}>Technicians</span><Stepper value={techsReinstate} onChange={setTechsReinstate} min={0}/></div>
          <div><span style={lbl}>Hours</span><Stepper value={hoursReinstate} onChange={setHoursReinstate} min={0} max={200}/></div>
        </div>
      </div>
    </Sec>

    <Sec number={4} title="On-Site Relocation?">
      <span style={lbl}>Will contents be relocated to another room on-site?</span>
      <YesNo value={onsite} onChange={setOnsite}/>
      {onsite==="yes"&&<div style={{marginTop:12}}>
        <span style={lbl}>Which room?</span>
        <TextField value={onsiteRoom} onChange={setOnsiteRoom} placeholder="e.g. garage, master bedroom, living area…" rows={1}/>
      </div>}
    </Sec>

    <Sec number={5} title="Off-Site Storage?">
      <span style={lbl}>Will contents be relocated to off-site storage?</span>
      <YesNo value={offsite} onChange={setOffsite}/>
      {offsite==="yes"&&<div style={{marginTop:12}}>
        <span style={lbl}>Storage capacity required</span>
        <TextField value={storageSize} onChange={setStorageSize} placeholder="e.g. ≈ 20 m², large unit, half carriage…" rows={1}/>
      </div>}
    </Sec>

    <Sec number={6} title="Truck Required?">
      <YesNo value={truck} onChange={setTruck}/>
      {truck==="yes"&&<div style={{marginTop:12}}>
        <span style={lbl}>Number of days</span>
        <Stepper value={truckDays} onChange={setTruckDays} min={1}/>
      </div>}
    </Sec>

    <Sec number={7} title="Equipment">
      <EquipGrid defs={DEFS} values={equip} setValues={setEquip}/>
    </Sec>

    <Sec number={8} title="Consumables">
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        <span style={{fontSize:11,color:C.muted,background:C.subtle,border:"1px solid "+C.border,borderRadius:5,padding:"3px 9px"}}>Moving supplies (boxes, tape, bubble wrap, blankets, shrink wrap, butcher paper, etc.)</span>
      </div>
      <span style={lbl}>Anything special beyond the standard kit?</span>
      <YesNo value={specCons} onChange={setSpecCons}/>
      {specCons==="yes"&&<div style={{marginTop:10}}><TextField value={consDetail} onChange={setConsDetail} placeholder="e.g. extra furniture blankets, specialised packing materials…" rows={2}/></div>}
    </Sec>

    <Sec number={9} title="Additional Requirements">
      <TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed for this job…" rows={2}/>
    </Sec>

    <Sec number={10} title="Site Notes — Anything that could help attending technicians">
      <TextField value={siteNotes} onChange={setSiteNotes} placeholder="e.g. elevator access required, high-rise building, fragile items, no parking on street…" rows={3}/>
    </Sec>

    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── STRIP OUT FORM ────────────────────────────────────────────────────────────
function StripOutForm({ onResult }) {
  const [areas,setAreas]=useState(""); const [elec,setElec]=useState(""); const [plumb,setPlumb]=useState(""); const [builder,setBuilder]=useState(""); const [other,setOther]=useState("");
  const [asbestos,setAsbestos]=useState(null); const [skipBin,setSkipBin]=useState(null); const [skipDetail,setSkipDetail]=useState("");
  const [works,setWorks]=useState(""); const [techs,setTechs]=useState(2); const [hours,setHours]=useState(20);
  const [equip,setEquip]=useState({scrubber:{qty:2,days:1},poles:{qty:4,days:1}}); const [addReqs,setAddReqs]=useState("");
  const [loading,setLoading]=useState(false);
  const DEFS=[{key:"scrubber",label:"Air Scrubber (AFD)"},{key:"poles",label:"Containment Poles"}];
  const go = async () => {
    setLoading(true);
    const cleaned = await cleanAll({
      areas:      { text: areas,      mode: "translate"  },
      elec:       { text: elec,       mode: "trades"  },
      plumb:      { text: plumb,      mode: "trades"  },
      builder:    { text: builder,    mode: "trades"  },
      other:      { text: other,      mode: "trades"  },
      skipDetail: { text: skipDetail, mode: "translate"  },
      works:      { text: works || WORKS_TEMPLATES.stripout, mode: "bullets" },
      addReqs:    { text: addReqs,    mode: "translate"  },
    });
    onResult(buildStripout({areas:cleaned.areas,elec:cleaned.elec,plumb:cleaned.plumb,builder:cleaned.builder,other:cleaned.other,asbestos,skipBin,skipDetail:cleaned.skipDetail,techs,hours,equip,addReqs:cleaned.addReqs}, cleaned.works));
    setLoading(false);
  };
  return (<div>
    <Sec number={1} title="Areas / Rooms Affected"><TextField value={areas} onChange={setAreas} placeholder="e.g. ground floor, entire property…"/></Sec>
    <Sec number={2} title="Other Trades Required">
      <span style={lbl}>Electrician (leave blank if not needed)</span><TextField value={elec} onChange={setElec} placeholder="e.g. Disconnect and make safe all electrical outlets below 1200mm…" rows={2}/>
      <div style={{marginTop:12}}><span style={lbl}>Plumber</span><TextField value={plumb} onChange={setPlumb} placeholder="e.g. Isolate, disconnect and make safe all plumbing below 1200mm…" rows={2}/></div>
      <div style={{marginTop:12}}><span style={lbl}>Builder</span><TextField value={builder} onChange={setBuilder} placeholder="e.g. Remove all fixed cabinetry below 1200mm…" rows={2}/></div>
      <div style={{marginTop:12}}><span style={lbl}>Other</span><TextField value={other} onChange={setOther} placeholder="Any other trades or requirements…" rows={2}/></div>
    </Sec>
    <Sec number={3} title="Asbestos"><span style={lbl}>Clearance certificate required?</span><YesNo value={asbestos} onChange={setAsbestos}/></Sec>
    <Sec number={4} title="Skip Bin">
      <YesNo value={skipBin} onChange={setSkipBin}/>
      {skipBin==="yes"&&<div style={{marginTop:12}}><TextField value={skipDetail} onChange={setSkipDetail} placeholder="e.g. Medium skip bin for building materials…" rows={2}/></div>}
    </Sec>
    <Sec number={5} title="Works Required"><TextField value={works} onChange={setWorks} placeholder="Describe strip out works…" rows={4} templateKey="stripout"/></Sec>
    <Sec number={6} title="Labour">
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Sec>
    <Sec number={7} title="Equipment"><EquipGrid defs={DEFS} values={equip} setValues={setEquip}/></Sec>
    <Sec number={8} title="Additional Requirements"><TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Sec>
    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── FLOORING FORM ─────────────────────────────────────────────────────────────
function FlooringForm({ onResult }) {
  const [areas,setAreas]=useState(""); const [vacate,setVacate]=useState(null); const [works,setWorks]=useState("");
  const [techs,setTechs]=useState(2); const [hours,setHours]=useState(20);
  const [equip,setEquip]=useState({dehum:{qty:5,days:5},mover:{qty:8,days:5},hepa:{qty:1,days:1}});
  const [truck,setTruck]=useState(null); const [highCost,setHighCost]=useState(null); const [addReqs,setAddReqs]=useState("");
  const [loading,setLoading]=useState(false);
  const DEFS=[{key:"dehum",label:"Dehumidifier"},{key:"mover",label:"Air Mover / Fan"},{key:"hepa",label:"HEPA Vacuum"}];
  const go = async () => {
    setLoading(true);
    const cleaned = await cleanAll({
      areas:   { text: areas,   mode: "translate"  },
      works:   { text: works || WORKS_TEMPLATES.flooring, mode: "bullets" },
      addReqs: { text: addReqs, mode: "translate"  },
    });
    onResult(buildFlooring({areas:cleaned.areas,vacate,techs,hours,equip,truck,highCost,addReqs:cleaned.addReqs}, cleaned.works));
    setLoading(false);
  };
  return (<div>
    <Sec number={1} title="Areas / Rooms Affected"><TextField value={areas} onChange={setAreas} placeholder="e.g. living area, entire ground floor…"/></Sec>
    <Sec number={2} title="Vacate Recommended?"><span style={lbl}>Should the insured vacate during works?</span><YesNo value={vacate} onChange={setVacate}/></Sec>
    <Sec number={3} title="Works Required"><TextField value={works} onChange={setWorks} placeholder="Describe flooring works…" rows={4} templateKey="flooring"/></Sec>
    <Sec number={4} title="Labour">
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Sec>
    <Sec number={5} title="Equipment"><EquipGrid defs={DEFS} values={equip} setValues={setEquip}/></Sec>
    <Sec number={6} title="Truck & Disposal">
      <span style={lbl}>Truck required?</span><YesNo value={truck} onChange={setTruck}/>
      <div style={{marginTop:14}}><span style={lbl}>High-cost disposal?</span><YesNo value={highCost} onChange={setHighCost}/></div>
    </Sec>
    <Sec number={7} title="Additional Requirements"><TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Sec>
    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── FLOOD FORM ────────────────────────────────────────────────────────────────
function FloodForm({ onResult }) {
  const [areas,setAreas]=useState(""); const [elec,setElec]=useState(""); const [plumb,setPlumb]=useState(""); const [builder,setBuilder]=useState("");
  const [w1,setW1]=useState(""); const [techs1,setTechs1]=useState(3); const [hours1,setHours1]=useState(12); const [equip1,setEquip1]=useState({truck:{qty:1,days:1},trolley:{qty:1,days:1},straps:{qty:1,days:1}});
  const [w2,setW2]=useState(""); const [techs2,setTechs2]=useState(3); const [hours2,setHours2]=useState(20); const [equip2,setEquip2]=useState({scrubber:{qty:4,days:2},hepa:{qty:1,days:1}});
  const [w3,setW3]=useState(""); const [techs3,setTechs3]=useState(2); const [hours3,setHours3]=useState(4); const [equip3,setEquip3]=useState({scrubber:{qty:4,days:1}});
  const [w4,setW4]=useState(""); const [techs4,setTechs4]=useState(2); const [hours4,setHours4]=useState(15); const [equip4,setEquip4]=useState({dehum:{qty:3,days:5},scrubber:{qty:3,days:1},mover:{qty:6,days:5},hepa:{qty:2,days:1}});
  const [storageSize,setStorageSize]=useState(""); const [addReqs,setAddReqs]=useState("");
  const [loading,setLoading]=useState(false);
  const DEFS1=[{key:"truck",label:"Truck"},{key:"trolley",label:"Trolley / Hand Trolley"},{key:"straps",label:"Lifting Straps"}];
  const DEFS2=[{key:"scrubber",label:"Air Scrubber (AFD)"},{key:"hepa",label:"HEPA Vacuum"}];
  const DEFS3=[{key:"scrubber",label:"Air Scrubber (AFD)"}];
  const DEFS4=[{key:"dehum",label:"Dehumidifier"},{key:"scrubber",label:"Air Scrubber (AFD)"},{key:"mover",label:"Air Mover / Fan"},{key:"hepa",label:"HEPA Vacuum"}];

  const go = async () => {
    setLoading(true);
    const cleaned = await cleanAll({
      areas:       { text: areas,       mode: "translate"  },
      elec:        { text: elec,        mode: "trades"  },
      plumb:       { text: plumb,       mode: "trades"  },
      builder:     { text: builder,     mode: "trades"  },
      w1:          { text: w1 || WORKS_TEMPLATES.flood_contents,   mode: "bullets" },
      w2:          { text: w2 || WORKS_TEMPLATES.flood_stripout,   mode: "bullets" },
      w3:          { text: w3 || WORKS_TEMPLATES.flood_siteprep,   mode: "bullets" },
      w4:          { text: w4 || WORKS_TEMPLATES.flood_restoration,mode: "bullets" },
      storageSize: { text: storageSize, mode: "translate"  },
      addReqs:     { text: addReqs,     mode: "translate"  },
    });
    onResult(buildFlood({areas:cleaned.areas,elec:cleaned.elec,plumb:cleaned.plumb,builder:cleaned.builder,techs1,hours1,equip1,techs2,hours2,equip2,techs3,hours3,equip3,techs4,hours4,equip4,storageSize:cleaned.storageSize,addReqs:cleaned.addReqs}, {w1:cleaned.w1,w2:cleaned.w2,w3:cleaned.w3,w4:cleaned.w4}));
    setLoading(false);
  };

  const PhaseCard = ({num,title,works,setWorks,tKey,techs,setTechs,hours,setHours,defs,equip,setEquip}) => (
    <div style={{marginBottom:16,border:"1.5px solid "+C.border,borderRadius:12,overflow:"hidden"}}>
      <div style={{background:C.greenLight,padding:"10px 16px",borderBottom:"1px solid "+C.border}}>
        <span style={{fontSize:13,fontWeight:700,color:C.green}}>Phase {num} — {title}</span>
      </div>
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:14}}>
        <div><span style={lbl}>Works</span><TextField value={works} onChange={setWorks} placeholder={"Describe phase "+num+" works…"} rows={3} templateKey={tKey}/></div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
          <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
        </div>
        <div><span style={lbl}>Equipment</span><EquipGrid defs={defs} values={equip} setValues={setEquip}/></div>
      </div>
    </div>
  );

  return (<div>
    <Sec number={1} title="Areas / Rooms Affected"><TextField value={areas} onChange={setAreas} placeholder="e.g. entire ground floor, kitchen, living area…"/></Sec>
    <Sec number={2} title="Other Trades Required">
      <span style={lbl}>Electrician</span><TextField value={elec} onChange={setElec} placeholder="e.g. Disconnect and make safe all electrical below 1200mm…" rows={2}/>
      <div style={{marginTop:12}}><span style={lbl}>Plumber</span><TextField value={plumb} onChange={setPlumb} placeholder="e.g. Isolate and disconnect all plumbing below 1200mm…" rows={2}/></div>
      <div style={{marginTop:12}}><span style={lbl}>Builder</span><TextField value={builder} onChange={setBuilder} placeholder="e.g. Remove all fixed cabinetry below 1200mm…" rows={2}/></div>
    </Sec>
    <div style={{marginBottom:14}}>
      <SectionTitle number={3} title="Phases"/>
      <PhaseCard num={1} title="Relocation of Contents" works={w1} setWorks={setW1} tKey="flood_contents" techs={techs1} setTechs={setTechs1} hours={hours1} setHours={setHours1} defs={DEFS1} equip={equip1} setEquip={setEquip1}/>
      <PhaseCard num={2} title="Strip Out" works={w2} setWorks={setW2} tKey="flood_stripout" techs={techs2} setTechs={setTechs2} hours={hours2} setHours={setHours2} defs={DEFS2} equip={equip2} setEquip={setEquip2}/>
      <PhaseCard num={3} title="Site Preparation" works={w3} setWorks={setW3} tKey="flood_siteprep" techs={techs3} setTechs={setTechs3} hours={hours3} setHours={setHours3} defs={DEFS3} equip={equip3} setEquip={setEquip3}/>
      <PhaseCard num={4} title="Restoration Cleaning" works={w4} setWorks={setW4} tKey="flood_restoration" techs={techs4} setTechs={setTechs4} hours={hours4} setHours={setHours4} defs={DEFS4} equip={equip4} setEquip={setEquip4}/>
    </div>
    <Sec number={4} title="Off-Site Storage"><TextField value={storageSize} onChange={setStorageSize} placeholder="e.g. large unit, ≈ 20m², taxi box…" rows={1}/></Sec>
    <Sec number={5} title="Additional Requirements"><TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Sec>
    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── RESTORATION FORM ──────────────────────────────────────────────────────────
function RestorationForm({ onResult }) {
  const [areas,setAreas]=useState(""); const [works,setWorks]=useState("");
  const [techs,setTechs]=useState(2); const [hours,setHours]=useState(5);
  const [equip,setEquip]=useState({scrubber:{qty:2,days:1},hepa:{qty:1,days:1},fogging:{qty:0,days:1}}); const [addReqs,setAddReqs]=useState("");
  const [loading,setLoading]=useState(false);
  const DEFS=[{key:"scrubber",label:"Air Scrubber (AFD)"},{key:"hepa",label:"HEPA Vacuum"},{key:"fogging",label:"Fogging Machine"}];
  const go = async () => {
    setLoading(true);
    const cleaned = await cleanAll({
      areas:   { text: areas,   mode: "translate"  },
      works:   { text: works || WORKS_TEMPLATES.restoration, mode: "bullets" },
      addReqs: { text: addReqs, mode: "translate"  },
    });
    onResult(buildRestoration({areas:cleaned.areas,techs,hours,equip,addReqs:cleaned.addReqs}, cleaned.works));
    setLoading(false);
  };
  return (<div>
    <Sec number={1} title="Areas / Rooms Affected"><TextField value={areas} onChange={setAreas} placeholder="e.g. master bedroom, bedroom 2, closet…"/></Sec>
    <Sec number={2} title="Works Required"><TextField value={works} onChange={setWorks} placeholder="Describe restoration cleaning works…" rows={4} templateKey="restoration"/></Sec>
    <Sec number={3} title="Labour">
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Sec>
    <Sec number={4} title="Equipment"><EquipGrid defs={DEFS} values={equip} setValues={setEquip}/></Sec>
    <Sec number={5} title="Additional Requirements"><TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Sec>
    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── DRYING FORM ───────────────────────────────────────────────────────────────
function DryingForm({ onResult }) {
  const [areas,setAreas]=useState(""); const [works,setWorks]=useState("");
  const [techs,setTechs]=useState(1); const [hours,setHours]=useState(5);
  const [equip,setEquip]=useState({dehum:{qty:1,days:5},mover:{qty:3,days:5}}); const [addReqs,setAddReqs]=useState("");
  const [loading,setLoading]=useState(false);
  const DEFS=[{key:"dehum",label:"Dehumidifier"},{key:"mover",label:"Air Mover / Fan"}];
  const go = async () => {
    setLoading(true);
    const cleaned = await cleanAll({
      areas:   { text: areas,   mode: "translate"  },
      works:   { text: works || WORKS_TEMPLATES.drying, mode: "bullets" },
      addReqs: { text: addReqs, mode: "translate"  },
    });
    onResult(buildDrying({areas:cleaned.areas,techs,hours,equip,addReqs:cleaned.addReqs}, cleaned.works));
    setLoading(false);
  };
  return (<div>
    <Sec number={1} title="Areas / Rooms Affected"><TextField value={areas} onChange={setAreas} placeholder="e.g. main bedroom, bedroom 2, hallway…"/></Sec>
    <Sec number={2} title="Works Required"><TextField value={works} onChange={setWorks} placeholder="Describe drying works…" rows={3} templateKey="drying"/></Sec>
    <Sec number={3} title="Labour">
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Sec>
    <Sec number={4} title="Equipment"><EquipGrid defs={DEFS} values={equip} setValues={setEquip}/></Sec>
    <Sec number={5} title="Additional Requirements"><TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Sec>
    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]=useState("home");
  const [type,setType]=useState(null);
  const [result,setResult]=useState("");
  const [copied,setCopied]=useState(false);

  const cur = SOW_TYPES.find(t => t.id === type);
  const handleResult = doc => { setResult(doc); setScreen("result"); };
  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false),2500); };
  const reset = () => { setScreen("home"); setType(null); setResult(""); };

  const FORMS = {
    mould:               <MouldForm              onResult={handleResult}/>,
    contents:            <ContentsForm           onResult={handleResult}/>,
    contents_relocation: <ContentsRelocationForm onResult={handleResult}/>,
    stripout:            <StripOutForm           onResult={handleResult}/>,
    flooring:            <FlooringForm           onResult={handleResult}/>,
    flood:               <FloodForm              onResult={handleResult}/>,
    restoration:         <RestorationForm        onResult={handleResult}/>,
    drying:              <DryingForm             onResult={handleResult}/>,
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Segoe UI',Arial,sans-serif",color:C.text,paddingBottom:60}}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        textarea:focus{border-color:#5a9a3a !important;outline:none}
        button:active{opacity:0.85}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#d4e4cb;border-radius:2px}
      `}</style>

      {/* HEADER */}
      <div style={{background:C.white,borderBottom:"2px solid "+C.green,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,boxShadow:"0 2px 8px rgba(90,154,58,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {screen!=="home"&&<button onClick={reset} style={{background:C.greenLight,border:"1.5px solid "+C.border,color:C.green,borderRadius:8,padding:"6px 13px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>}
          <div>
            <div style={{fontSize:10,color:C.green,fontWeight:800,letterSpacing:2,textTransform:"uppercase"}}>Major Industries</div>
            <div style={{fontSize:17,fontWeight:700,color:C.text}}>{screen==="home"?"SOW Builder":cur?cur.icon+" "+cur.label:"SOW Builder"}</div>
          </div>
        </div>
        {screen==="result"&&<button onClick={copy} style={{padding:"8px 18px",borderRadius:8,border:"none",background:copied?"#27ae60":C.green,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{copied?"✓ Copied!":"Copy"}</button>}
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"22px 16px"}}>

        {/* HOME */}
        {screen==="home"&&(
          <div style={{animation:"fadein 0.3s ease"}}>
            <div style={{fontSize:13,color:C.muted,marginBottom:20,fontWeight:500}}>Select the type of Scope of Work</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {SOW_TYPES.map(t=>(
                <button key={t.id} onClick={()=>{setType(t.id);setScreen("form");}}
                  style={{background:C.white,border:"1.5px solid "+C.border,borderRadius:12,padding:"16px 18px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",textAlign:"left",fontFamily:"inherit",boxShadow:"0 1px 4px rgba(0,0,0,0.04)",transition:"border-color 0.15s,box-shadow 0.15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.boxShadow="0 2px 10px rgba(90,154,58,0.15)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.04)";}}>
                  <span style={{fontSize:26}}>{t.icon}</span>
                  <span style={{fontSize:15,fontWeight:600,color:C.text}}>{t.label}</span>
                  <span style={{marginLeft:"auto",color:C.green,fontSize:20,fontWeight:700}}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FORM */}
        {screen==="form"&&<div style={{animation:"fadein 0.3s ease"}}>{FORMS[type]}</div>}

        {/* RESULT */}
        {screen==="result"&&(
          <div style={{animation:"fadein 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:15,fontWeight:700,color:C.green}}>✓ SOW Ready</div>
              <button onClick={reset} style={{background:C.greenLight,border:"1.5px solid "+C.border,color:C.green,borderRadius:8,padding:"6px 13px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>New SOW</button>
            </div>
            <div style={{background:C.white,border:"1.5px solid "+C.border,borderRadius:12,padding:"18px 20px",whiteSpace:"pre-wrap",fontSize:13,lineHeight:1.9,color:C.text,maxHeight:"62vh",overflowY:"auto",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
              {result}
            </div>
            <button onClick={copy} style={{width:"100%",marginTop:12,padding:"15px",borderRadius:12,background:copied?"#27ae60":C.green,border:"none",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>
              {copied?"✓ Copied to clipboard!":"Copy to clipboard"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
