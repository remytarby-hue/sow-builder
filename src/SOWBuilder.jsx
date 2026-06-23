import { useState } from "react";

const C = {
  bg:        "#0f0f0f",
  white:     "#1a1a1a",
  green:     "#5a9a3a",
  greenDark: "#3d6b27",
  greenLight:"#1e3014",
  border:    "#2a2a2a",
  text:      "#f0f0f0",
  muted:     "#888888",
  subtle:    "#222222",
  red:       "#e05252",
};

const SOW_ICONS = {
  mould:               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>,
  contents:            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  contents_relocation: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  stripout:            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  flooring:            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  flood:               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  restoration:         <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  drying:              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>,
};

const SOW_TYPES = [
  { id:"mould",              label:"Mould Remediation",                    },
  { id:"contents",           label:"Contents Remediation",                 },
  { id:"contents_relocation",label:"Contents Relocation",                  },
  { id:"stripout",           label:"Strip Out",                            },
  { id:"flooring",           label:"Flooring Removal",                     },
  { id:"flood",              label:"Building and Contents / Large SOW",    },
  { id:"restoration",        label:"Restoration Cleaning",                 },
  { id:"drying",             label:"Drying",                               },
];

const WORKS_TEMPLATES = {
  mould:            "Erection of containment to contain the work zone.\nEstablish negative air pressure using air filtration devices (AFDs).\nRemoval of the affected section of the [wall/ceiling].\nHEPA vac + sanitation of all affected surfaces.\nInstallation of drying equipment.\nEncapsulation of the affected building material as required.",
  contents:         "Assessment and inventory of the affected items.\nRemoval of affected items for disposal.\nPacking and relocation of restorable/non-affected items.\nHEPA vac + sanitation of restorable items.\nReinstatement of contents.",
  contents_relocation: "Packing and relocation of contents.\nReinstatement of contents.",
  stripout:         "Strip out of walls in the affected areas up to 1200mm.\nRemoval of all affected insulation.\nRemoval of all nails, fixings, adhesives and residues.\nDisposal of all stripped materials.",
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
  const tradeLines = [];
  if (d.builderActive === "yes" && d.builder)       tradeLines.push("Builder:\n\t- " + d.builder);
  if (d.elecActive === "yes" && d.electrician)      tradeLines.push("Electrician:\n\t- " + d.electrician);
  if (d.plumbActive === "yes" && d.plumber)         tradeLines.push("Plumber:\n\t- " + d.plumber);
  if (d.otherTradeActive === "yes" && d.otherTrade) tradeLines.push("Other:\n\t- " + d.otherTrade);
  const tradesText = tradeLines.length ? tradeLines.join("\n") : "None";

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
    {key:"packing",    label:"Packing / Relocation of contents"},
    {key:"disposal",   label:"Disposal of non-restorable items"},
    {key:"flooring",   label:"Removal of floor covering"},
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
    ...(d.boxes && d.boxes.trim() ? ["\t• Packing boxes required: " + d.boxes.trim()] : []),
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
    "Consumables Breakdown",
    "List of consumables required.",
    "\t• Moving supplies (boxes, tape, bubble wrap, blankets, shrink wrap, butcher paper, etc.)",
    ...(d.boxes && d.boxes.trim() ? ["\t• Packing boxes required: " + d.boxes.trim()] : []),
    ...(d.specCons === "yes" && d.consDetail ? ["\t• " + d.consDetail] : []),
    ...(d.truck === "yes" ? ["", "Truck required: Yes\n\t• Number of days: " + (d.truckDays || "To be confirmed")] : []),
    ...(d.addReqs ? ["", "Additional Requirements", d.addReqs.split(/[,\n]/).filter(Boolean).map(r => "\t• " + r.trim()).join("\n")] : []),
    ...(d.siteNotes ? ["", "Site Notes:", tobullets(d.siteNotes)] : []),
  ].join("\n");
}

function buildStripout(d, works) {
  const trades = [];
  if (d.builderActive === "yes" && d.builder) trades.push("Builder:\n\t- " + d.builder);
  if (d.elecActive === "yes" && d.elec)       trades.push("Electrician:\n\t- " + d.elec);
  if (d.plumbActive === "yes" && d.plumb)     trades.push("Plumber:\n\t- " + d.plumb);
  if (d.otherTradeActive === "yes" && d.otherTrade) trades.push("Other:\n\t- " + d.otherTrade);
  if (d.asbestos === "yes") trades.push("Other:\n\t- Asbestos clearance certificate required as there is potential asbestos on-site.");
  if (d.skipBin === "yes")  trades.push("Other:\n\t- " + (d.skipDetail || "Installation of a skip bin to dispose of building materials."));

  return [
    "SOW - Strip Out",
    "",
    "Other trades required prior to commencement of works:",
    trades.length ? trades.join("\n\n") : "None",
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
    ...(d.specCons === "yes" && d.consDetail ? ["\t• " + d.consDetail] : []),
    ...(d.truck === "yes" ? ["", "Truck required for " + d.truckDays + " day" + (d.truckDays > 1 ? "s" : "") + "."] : []),
    ...(d.addReqs ? ["", "Additional Requirements", d.addReqs.split(/[,\n]/).filter(Boolean).map(r => "\t• " + r.trim()).join("\n")] : []),
  ].join("\n");
}

function buildFlooring(d, works) {
  const equipDefs = [];
  if (d.dryingRequired === "yes") {
    equipDefs.push({key:"dehum", label:"Dehumidifiers"});
    equipDefs.push({key:"mover", label:"Air Movers / Fans"});
  }
  equipDefs.push({key:"hepa", label:"HEPA Vacuumed"});
  equipDefs.push({key:"scrubber", label:"Air Scrubbers (AFD)"});

  const labourLines = d.dryingRequired === "yes" ? LABOUR_FULL
    : "\t• Labour carried out during initial attendance\n\t• Final checks and confirmation of completion";

  const cons = ["Antimicrobial solution","PPE","Filters / bags","Microfibre cloths","Blade","Mop/Mop pad","Cloth tape/masking tape","Rags"];
  if (d.specCons === "yes" && d.consDetail) cons.push(d.consDetail);

  return [
    "SOW - Flooring Removal",
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
    ...(d.truck === "yes" ? ["", "Truck required for " + d.truckDays + " day" + (d.truckDays > 1 ? "s" : "") + " — disposal of removed flooring materials."] : []),
    ...(d.highCost === "yes" ? ["High-cost disposal required."] : []),
    ...(d.addReqs ? ["", "Additional Requirements", d.addReqs.split(/[,\n]/).filter(Boolean).map(r => "\t• " + r.trim()).join("\n")] : []),
  ].join("\n");
}

function buildFlood(d, works) {
  const sections = ["SOW - Building and Contents / Large SOW", "", "Room Name / Area: " + (d.areas || "To be confirmed"), ""];

  if (d.phase2 === "yes") {
    const trades = [];
    if (d.builderActive === "yes" && d.builder) trades.push("Builder:\n\t- " + d.builder);
    if (d.elecActive === "yes" && d.elec)       trades.push("Electrician:\n\t- " + d.elec);
    if (d.plumbActive === "yes" && d.plumb)     trades.push("Plumber:\n\t- " + d.plumb);
    if (d.otherTradeActive === "yes" && d.otherTrade) trades.push("Other:\n\t- " + d.otherTrade);
    if (d.asbestos === "yes") trades.push("Other:\n\t- Asbestos clearance certificate required as there is potential asbestos on-site.");
    if (d.skipBin === "yes")  trades.push("Other:\n\t- " + (d.skipDetail || "Installation of a skip bin to dispose of building materials."));
    if (trades.length) {
      sections.push("Other trades required prior to commencement of works:");
      sections.push(trades.join("\n\n"));
      sections.push("");
    }
  }

  if (d.siteNotes) { sections.push("Site Notes:"); sections.push(tobullets(d.siteNotes)); sections.push(""); }

  sections.push("**Preparation for Restoration Cleaning**");

  if (d.phase1 === "yes") {
    sections.push("", "1 - Contents Remediation:");
    sections.push(tobullets(works.w1));
    const locLines = [];
    if (d.onsite === "yes" && d.onsiteRoom) locLines.push("\t• On-site relocation to: " + d.onsiteRoom);
    if (d.offsite === "yes" && d.storageSize) locLines.push("\t• Off-site storage capacity required: " + d.storageSize);
    else if (d.offsite === "yes") locLines.push("\t• Off-site storage required — capacity to be confirmed");
    if (locLines.length) { sections.push("Relocation Details:"); sections.push(locLines.join("\n")); }
    sections.push("", "Total Labour Hours");
    sections.push("\t• Technician hours: " + d.techs1 + " Technician" + (d.techs1>1?"s":"") + " x " + d.hours1 + " hours");
    sections.push("", "Equipment Breakdown");
    sections.push(equipBlock([{key:"truck",label:"Truck"},{key:"trolley",label:"Trolley / Hand Trolley"},{key:"straps",label:"Lifting Straps"}], d.equip1));
    sections.push("", "Consumables Breakdown");
    sections.push("\t• Moving supplies (boxes, tape, bubble wrap, blankets, shrink wrap, butcher paper, etc.)\n\t• Antimicrobial\n\t• Rags");
    if (d.truck1 === "yes") sections.push("", "Truck required for " + d.truckDays1 + " day" + (d.truckDays1>1?"s":"") + ".");
  }

  if (d.phase2 === "yes") {
    sections.push("", "2 - Strip Out:");
    sections.push(tobullets(works.w2));
    sections.push("", "Total Labour Hours");
    sections.push("\t• Technician hours: " + d.techs2 + " Technician" + (d.techs2>1?"s":"") + " x " + d.hours2 + " hours");
    sections.push("", "Equipment Breakdown");
    if (d.truck2 === "yes") sections.push("\t• Truck for disposal.");
    sections.push(equipBlock([{key:"scrubber",label:"Air Scrubbers"},{key:"hepa",label:"HEPA Vacuum"}], d.equip2));
    sections.push("", "Consumables Breakdown");
    sections.push("\t• Plastic sheeting\n\t• PPE\n\t• Rubbish bags");
  }

  if (d.phase3 === "yes") {
    sections.push("", "3 - Site Preparation for Restoration Cleaning:");
    sections.push(tobullets(works.w3));
    sections.push("", "Total Labour Hours");
    sections.push("\t• Technician hours: " + d.techs3 + " Technician" + (d.techs3>1?"s":"") + " x " + d.hours3 + " hours");
    sections.push("", "Equipment Breakdown");
    sections.push(equipBlock([{key:"scrubber",label:"Air Scrubbers"}], d.equip3));
  }

  sections.push("", "**Restoration Cleaning**", "");
  sections.push("4 - Restoration Cleaning:");
  sections.push(tobullets(works.w4));
  sections.push("", "Total Labour Hours");
  sections.push("\t• Technician hours: " + d.techs4 + " Technician" + (d.techs4>1?"s":"") + " x " + d.hours4 + " hours");
  sections.push("", "Equipment Breakdown");
  const eq4Defs = [];
  if (d.drying4 === "yes") { eq4Defs.push({key:"dehum",label:"Dehumidifiers"}); eq4Defs.push({key:"mover",label:"Air Movers / Fans"}); }
  eq4Defs.push({key:"scrubber",label:"Air Scrubbers"}); eq4Defs.push({key:"hepa",label:"HEPA Vacuumed"});
  sections.push(equipBlock(eq4Defs, d.equip4));
  sections.push("", "Consumables Breakdown");
  sections.push("\t• Antimicrobial solution\n\t• Plastic sheeting\n\t• PPE\n\t• Filters / bags\n\t• Microfibre cloths\n\t• Blade\n\t• Cloth tape/masking tape\n\t• Rags\n\t• Rubbish bags\n\t• Percide\n\t• Mop pads\n\t• Mop\n\t• Hand brushes\n\t• White vinegar");

  sections.push("", "Final Inspection:");
  sections.push("\t• Conduct a final walkthrough and moisture level check to confirm that the property has been properly cleaned, sanitised, and dried.");

  if (d.addReqs) { sections.push("", "Additional Requirements"); sections.push(d.addReqs.split(/[,\n]/).filter(Boolean).map(r=>"\t• "+r.trim()).join("\n")); }

  return sections.join("\n");
}

function buildRestoration(d, works) {
  const cons = ["PPE","Filters / bags","Cloth tape/masking tape","Rubbish bags","Antimicrobial","Odorx"];
  if (d.specCons === "yes" && d.consDetail) cons.push(d.consDetail);
  return [
    "SOW - Restoration Cleaning",
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
    LABOUR_SHORT,
    "Total Labour Hours",
    "\t• Technician hours: " + d.techs + " Technician" + (d.techs > 1 ? "s" : "") + " x " + d.hours + " hours",
    "",
    "Equipment Breakdown",
    equipBlock([{key:"scrubber",label:"Air Scrubbers"},{key:"hepa",label:"HEPA Vacuum"},{key:"fogging",label:"Fogging Machine"}], d.equip),
    "",
    "Consumables Breakdown",
    "List of consumables required.",
    cons.map(c => "\t• " + c).join("\n"),
    ...(d.truck === "yes" ? ["", "Truck required for " + d.truckDays + " day" + (d.truckDays > 1 ? "s" : "") + "."] : []),
    ...(d.addReqs ? ["", "Additional Requirements", d.addReqs.split(/[,\n]/).filter(Boolean).map(r => "\t• " + r.trim()).join("\n")] : []),
  ].join("\n");
}

function buildDrying(d, works) {
  const cons = ["Antimicrobial solution","PPE","Filters / bags","Microfibre cloths","Rags"];
  if (d.specCons === "yes" && d.consDetail) cons.push(d.consDetail);
  return [
    "SOW - Drying",
    "",
    "Room Name / Area: " + (d.areas || "To be confirmed"),
    "",
    ...(d.siteNotes ? ["Site Notes:", tobullets(d.siteNotes), ""] : []),
    "\tWorks required:",
    tobullets(works),
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
    cons.map(c => "\t• " + c).join("\n"),
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
        max_tokens: 800,
        messages: [{ role: "user", content: prompts[mode] || prompts.inline }],
      }),
    });
    const data = await res.json();
    return data.content?.map(b => b.text || "").join("").trim() || text;
  } catch {
    return "⚠️ [AI error — check this field] " + text;
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

const ROOMS = ["Master bedroom","Bedroom 2","Bedroom 3","Bedroom 4","Bathroom","Ensuite","Walk-in wardrobe","Kitchen","Living room","Dining room","Garage","Laundry","Hallway 1","Hallway 2","Media room"];

function RoomPicker({ selected, setSelected, extra, setExtra }) {
  const toggle = room => setSelected(prev => prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]);
  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
        {ROOMS.map(room => {
          const on = selected.includes(room);
          return (
            <button key={room} onClick={() => toggle(room)}
              style={{ padding:"8px 14px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit",
                border:"1.5px solid "+(on ? C.green : C.border),
                background: on ? C.green : C.white,
                color: on ? "#fff" : C.muted }}>
              {on ? "✓ " : ""}{room}
            </button>
          );
        })}
      </div>
      <span style={lbl}>Other rooms / areas (if any)</span>
      <TextField value={extra} onChange={setExtra} placeholder="e.g. study, sunroom, attic…" rows={1}/>
    </div>
  );
}

function roomsToText(selected, extra) {
  const parts = [...selected];
  if (extra && extra.trim()) parts.push(extra.trim());
  return parts.join(", ");
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
  const [rooms,setRooms]=useState([]); const [roomsExtra,setRoomsExtra]=useState("");
  const [otherTrades,setOtherTrades]=useState(null);
  const [builderActive,setBuilderActive]=useState(null); const [builder,setBuilder]=useState("");
  const [elecActive,setElecActive]=useState(null); const [electrician,setElectrician]=useState("");
  const [plumbActive,setPlumbActive]=useState(null); const [plumber,setPlumber]=useState("");
  const [otherTradeActive,setOtherTradeActive]=useState(null); const [otherTrade,setOtherTrade]=useState("");
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
    const areas = roomsToText(rooms, roomsExtra);
    const cleaned = await cleanAll({
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
      areas, otherTrades,
      builderActive, builder:cleaned.builder,
      elecActive, electrician:cleaned.electrician,
      plumbActive, plumber:cleaned.plumber,
      otherTradeActive, otherTrade:cleaned.otherTrade,
      techs, hours, dryingRequired, equip,
      specCons, consDetail:cleaned.consDetail,
      addReqs:cleaned.addReqs, siteNotes:cleaned.siteNotes,
    }, cleaned.works));
    setLoading(false);
  };

  return (<div>
    <Sec number={1} title="Areas / Rooms Affected">
      <RoomPicker selected={rooms} setSelected={setRooms} extra={roomsExtra} setExtra={setRoomsExtra}/>
    </Sec>

    <Sec number={2} title="Other Trades Required">
      <span style={lbl}>Any trades needed before works begin?</span>
      <YesNo value={otherTrades} onChange={setOtherTrades}/>
      {otherTrades==="yes"&&(
        <div style={{marginTop:16}}>
          {[{label:"Builder",active:builderActive,setActive:setBuilderActive,val:builder,setVal:setBuilder,ph:"e.g. Removal of kitchen cabinetry…"},
            {label:"Electrician",active:elecActive,setActive:setElecActive,val:electrician,setVal:setElectrician,ph:"e.g. Isolation of power outlets…"},
            {label:"Plumber",active:plumbActive,setActive:setPlumbActive,val:plumber,setVal:setPlumber,ph:"e.g. Identify and rectify source of water ingress…"},
            {label:"Other trade",active:otherTradeActive,setActive:setOtherTradeActive,val:otherTrade,setVal:setOtherTrade,ph:"e.g. Asbestos removalist, structural engineer…"},
          ].map(t=>(
            <div key={t.label} style={{marginBottom:14, paddingBottom:14, borderBottom:"1px solid "+C.border}}>
              <span style={{...lbl,color:C.green,marginBottom:6}}>{t.label}</span>
              <YesNo value={t.active} onChange={t.setActive}/>
              {t.active==="yes"&&<div style={{marginTop:10}}><TextField value={t.val} onChange={t.setVal} placeholder={t.ph} rows={2}/></div>}
            </div>
          ))}
        </div>
      )}
    </Sec>

    <Sec number={3} title="Works Required">
      <TextField value={works} onChange={setWorks} placeholder="Describe what needs to be done…" rows={5} templateKey="mould"/>
    </Sec>

    <Sec number={4} title="Labour">
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Sec>

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

    <Sec number={6} title="Consumables">
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        {CONS_STD.map(c=><span key={c} style={{fontSize:11,color:C.muted,background:C.subtle,border:"1px solid "+C.border,borderRadius:5,padding:"3px 9px"}}>{c}</span>)}
      </div>
      <span style={lbl}>Anything special beyond the standard kit?</span>
      <YesNo value={specCons} onChange={setSpecCons}/>
      {specCons==="yes"&&<div style={{marginTop:10}}><TextField value={consDetail} onChange={setConsDetail} placeholder="e.g. extra sheeting, specialised PPE…" rows={2}/></div>}
    </Sec>

    <Sec number={7} title="Additional Requirements">
      <TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed for this job…" rows={2}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>
        {["Skip bin","Off-site storage","Truck"].map(ex=><span key={ex} style={{fontSize:11,color:C.muted,background:C.subtle,border:"1px dashed "+C.border,borderRadius:5,padding:"3px 9px"}}>e.g. {ex}</span>)}
      </div>
    </Sec>

    <Sec number={8} title="Site Notes — Anything that could help attending technicians">
      <TextField value={siteNotes} onChange={setSiteNotes} placeholder="e.g. high ceiling — large ladder required, access via elevator, trolley needed, park on street only…" rows={3}/>
    </Sec>

    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── CONTENTS FORM ─────────────────────────────────────────────────────────────
function ContentsForm({ onResult }) {
  const [rooms,setRooms]=useState([]); const [roomsExtra,setRoomsExtra]=useState(""); const [works,setWorks]=useState("");
  const [phases,setPhases]=useState({
    initial:    {active:null, techs:3, hours:20},
    packing:    {active:null, techs:3, hours:8},
    disposal:   {active:null, techs:2, hours:8},
    flooring:   {active:null, techs:2, hours:8},
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
  const [boxes,setBoxes]=useState("");
  const [loading,setLoading]=useState(false);

  const setP=(k,f,v)=>setPhases(p=>({...p,[k]:{...p[k],[f]:v}}));
  const DEFS=[{key:"scrubber",label:"Air Scrubber (AFD)"},{key:"hepa",label:"HEPA Vacuum"}];
  const PHASE_DEF=[
    {key:"initial",    label:"Initial attendance — assessment & inventory"},
    {key:"packing",    label:"Packing / Relocation of contents"},
    {key:"disposal",   label:"Disposal of non-restorable items"},
    {key:"flooring",   label:"Removal of floor covering"},
    {key:"remediation",label:"Remediation of restorable items"},
    {key:"reinstate",  label:"Reinstatement of contents"},
    {key:"final",      label:"Final checks & confirmation"},
  ];
  const CONS_STD=["Antimicrobial solution","Filters / bags","Microfibre cloths","Moving supplies (boxes, tape, bubble wrap, blankets, shrink wrap, butcher paper, etc.)"];

  const go = async () => {
    setLoading(true);
    const areas = roomsToText(rooms, roomsExtra);
    const phasesForBuild = {};
    PHASE_DEF.forEach(p => {
      phasesForBuild[p.key] = {
        techs: phases[p.key].active === "yes" ? phases[p.key].techs : 0,
        hours: phases[p.key].active === "yes" ? phases[p.key].hours : 0,
      };
    });
    const cleaned = await cleanAll({
      works:       { text: works || WORKS_TEMPLATES.contents, mode: "bullets" },
      onsiteRoom:  { text: onsiteRoom,  mode: "translate" },
      storageSize: { text: storageSize, mode: "translate" },
      consDetail:  { text: consDetail,  mode: "translate" },
      addReqs:     { text: addReqs,     mode: "translate" },
      siteNotes:   { text: siteNotes,   mode: "sitenotes" },
    });
    onResult(buildContents({
      areas, phases:phasesForBuild, equip,
      onsite, onsiteRoom:cleaned.onsiteRoom,
      offsite, storageSize:cleaned.storageSize,
      truck, truckDays,
      specCons, consDetail:cleaned.consDetail, boxes,
      addReqs:cleaned.addReqs, siteNotes:cleaned.siteNotes,
    }, cleaned.works));
    setLoading(false);
  };

  return (<div>
    <Sec number={1} title="Areas / Rooms Affected">
      <RoomPicker selected={rooms} setSelected={setRooms} extra={roomsExtra} setExtra={setRoomsExtra}/>
    </Sec>

    <Sec number={2} title="Works Required">
      <TextField value={works} onChange={setWorks} placeholder="Describe contents works…" rows={4} templateKey="contents"/>
    </Sec>

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

    <Sec number={5} title="Truck Required?">
      <YesNo value={truck} onChange={setTruck}/>
      {truck==="yes"&&<div style={{marginTop:12}}>
        <span style={lbl}>Number of days</span>
        <Stepper value={truckDays} onChange={setTruckDays} min={1}/>
      </div>}
    </Sec>

    <Sec number={6} title="Equipment">
      <EquipGrid defs={DEFS} values={equip} setValues={setEquip}/>
    </Sec>

    <Sec number={7} title="Consumables">
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        {CONS_STD.map(c=><span key={c} style={{fontSize:11,color:C.muted,background:C.subtle,border:"1px solid "+C.border,borderRadius:5,padding:"3px 9px"}}>{c}</span>)}
      </div>
      <span style={lbl}>How many packing boxes required?</span>
      <TextField value={boxes} onChange={setBoxes} placeholder="e.g. 10 large, 15 medium, 5 small…" rows={1}/>
      <div style={{marginTop:14}}>
        <span style={lbl}>Anything special beyond the standard kit?</span>
        <YesNo value={specCons} onChange={setSpecCons}/>
        {specCons==="yes"&&<div style={{marginTop:10}}><TextField value={consDetail} onChange={setConsDetail} placeholder="e.g. extra blankets, specialised packing…" rows={2}/></div>}
      </div>
    </Sec>

    <Sec number={8} title="Additional Requirements">
      <TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/>
    </Sec>

    <Sec number={9} title="Site Notes — Anything that could help attending technicians">
      <TextField value={siteNotes} onChange={setSiteNotes} placeholder="e.g. elevator access, fragile items, no parking on street…" rows={3}/>
    </Sec>

    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── CONTENTS RELOCATION FORM ──────────────────────────────────────────────────
function ContentsRelocationForm({ onResult }) {
  const [rooms,setRooms]=useState([]); const [roomsExtra,setRoomsExtra]=useState("");
  const [works,setWorks]=useState("");
  const [techsInitial,setTechsInitial]=useState(3); const [hoursInitial,setHoursInitial]=useState(20);
  const [techsReinstate,setTechsReinstate]=useState(3); const [hoursReinstate,setHoursReinstate]=useState(8);
  const [onsite,setOnsite]=useState(null); const [onsiteRoom,setOnsiteRoom]=useState("");
  const [offsite,setOffsite]=useState(null); const [storageSize,setStorageSize]=useState("");
  const [truck,setTruck]=useState(null); const [truckDays,setTruckDays]=useState(1);
  const [specCons,setSpecCons]=useState(null); const [consDetail,setConsDetail]=useState("");
  const [boxes,setBoxes]=useState("");
  const [addReqs,setAddReqs]=useState("");
  const [siteNotes,setSiteNotes]=useState("");
  const [loading,setLoading]=useState(false);

  const go = async () => {
    setLoading(true);
    const areas = roomsToText(rooms, roomsExtra);
    const cleaned = await cleanAll({
      works:       { text: works || WORKS_TEMPLATES.contents_relocation, mode: "bullets" },
      onsiteRoom:  { text: onsiteRoom,  mode: "translate" },
      storageSize: { text: storageSize, mode: "translate" },
      addReqs:     { text: addReqs,     mode: "translate" },
      consDetail:  { text: consDetail,  mode: "translate" },
      siteNotes:   { text: siteNotes,   mode: "sitenotes" },
    });
    onResult(buildContentsRelocation({
      areas, techsInitial, hoursInitial, techsReinstate, hoursReinstate,
      onsite, onsiteRoom:cleaned.onsiteRoom,
      offsite, storageSize:cleaned.storageSize,
      truck, truckDays,
      specCons, consDetail:cleaned.consDetail, boxes,
      addReqs:cleaned.addReqs, siteNotes:cleaned.siteNotes,
    }, cleaned.works));
    setLoading(false);
  };

  return (<div>
    <Sec number={1} title="Areas / Rooms Affected">
      <RoomPicker selected={rooms} setSelected={setRooms} extra={roomsExtra} setExtra={setRoomsExtra}/>
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

    <Sec number={7} title="Consumables">
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        <span style={{fontSize:11,color:C.muted,background:C.subtle,border:"1px solid "+C.border,borderRadius:5,padding:"3px 9px"}}>Moving supplies (boxes, tape, bubble wrap, blankets, shrink wrap, butcher paper, etc.)</span>
      </div>
      <span style={lbl}>How many packing boxes required?</span>
      <TextField value={boxes} onChange={setBoxes} placeholder="e.g. 10 large, 15 medium, 5 small…" rows={1}/>
      <div style={{marginTop:14}}>
        <span style={lbl}>Anything special beyond the standard kit?</span>
        <YesNo value={specCons} onChange={setSpecCons}/>
        {specCons==="yes"&&<div style={{marginTop:10}}><TextField value={consDetail} onChange={setConsDetail} placeholder="e.g. extra furniture blankets, specialised packing materials…" rows={2}/></div>}
      </div>
    </Sec>

    <Sec number={8} title="Additional Requirements">
      <TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed for this job…" rows={2}/>
    </Sec>

    <Sec number={9} title="Site Notes — Anything that could help attending technicians">
      <TextField value={siteNotes} onChange={setSiteNotes} placeholder="e.g. elevator access required, high-rise building, fragile items, no parking on street…" rows={3}/>
    </Sec>

    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── STRIP OUT FORM ────────────────────────────────────────────────────────────
function StripOutForm({ onResult }) {
  const [rooms,setRooms]=useState([]); const [roomsExtra,setRoomsExtra]=useState("");
  const [otherTrades,setOtherTrades]=useState(null);
  const [builderActive,setBuilderActive]=useState(null); const [builder,setBuilder]=useState("");
  const [elecActive,setElecActive]=useState(null); const [elec,setElec]=useState("");
  const [plumbActive,setPlumbActive]=useState(null); const [plumb,setPlumb]=useState("");
  const [otherTradeActive,setOtherTradeActive]=useState(null); const [otherTrade,setOtherTrade]=useState("");
  const [asbestos,setAsbestos]=useState(null);
  const [skipBin,setSkipBin]=useState(null); const [skipDetail,setSkipDetail]=useState("");
  const [works,setWorks]=useState("");
  const [techs,setTechs]=useState(2); const [hours,setHours]=useState(20);
  const [truck,setTruck]=useState(null); const [truckDays,setTruckDays]=useState(1);
  const [equip,setEquip]=useState({scrubber:{qty:2,days:1},poles:{qty:4,days:1}});
  const [specCons,setSpecCons]=useState(null); const [consDetail,setConsDetail]=useState("");
  const [addReqs,setAddReqs]=useState("");
  const [siteNotes,setSiteNotes]=useState("");
  const [loading,setLoading]=useState(false);
  const DEFS=[{key:"scrubber",label:"Air Scrubber (AFD)"},{key:"poles",label:"Containment Poles"}];
  const CONS_STD=["Plastic sheeting","PPE","Filters / bags","Containment doors","Multi tools blade","Blade","Cloth tape/masking tape","Rubbish bags","Floor protection"];

  const go = async () => {
    setLoading(true);
    const areas = roomsToText(rooms, roomsExtra);
    const cleaned = await cleanAll({
      builder:    { text: builder,    mode: "trades"    },
      elec:       { text: elec,       mode: "trades"    },
      plumb:      { text: plumb,      mode: "trades"    },
      otherTrade: { text: otherTrade, mode: "trades"    },
      skipDetail: { text: skipDetail, mode: "translate" },
      works:      { text: works || WORKS_TEMPLATES.stripout, mode: "bullets" },
      addReqs:    { text: addReqs,    mode: "translate" },
      consDetail: { text: consDetail, mode: "translate" },
      siteNotes:  { text: siteNotes,  mode: "sitenotes" },
    });
    onResult(buildStripout({
      areas,
      builderActive, builder:cleaned.builder,
      elecActive, elec:cleaned.elec,
      plumbActive, plumb:cleaned.plumb,
      otherTradeActive, otherTrade:cleaned.otherTrade,
      asbestos, skipBin, skipDetail:cleaned.skipDetail,
      techs, hours, truck, truckDays, equip,
      specCons, consDetail:cleaned.consDetail,
      addReqs:cleaned.addReqs, siteNotes:cleaned.siteNotes,
    }, cleaned.works));
    setLoading(false);
  };

  const TradeRow = ({ label, active, setActive, value, setValue, placeholder }) => (
    <div style={{marginBottom:16, paddingBottom:16, borderBottom:"1px solid "+C.border}}>
      <span style={{...lbl, color:C.green, marginBottom:8}}>{label}</span>
      <YesNo value={active} onChange={setActive}/>
      {active==="yes"&&<div style={{marginTop:10}}>
        <TextField value={value} onChange={setValue} placeholder={placeholder} rows={2}/>
      </div>}
    </div>
  );

  return (<div>
    <Sec number={1} title="Areas / Rooms Affected">
      <RoomPicker selected={rooms} setSelected={setRooms} extra={roomsExtra} setExtra={setRoomsExtra}/>
    </Sec>

    <Sec number={2} title="Other Trades Required">
      <span style={lbl}>Any trades needed before works begin?</span>
      <YesNo value={otherTrades} onChange={setOtherTrades}/>
      {otherTrades==="yes"&&<div style={{marginTop:16}}>
        <TradeRow label="Builder" active={builderActive} setActive={setBuilderActive} value={builder} setValue={setBuilder} placeholder="e.g. Remove all fixed cabinetry below 1200mm…"/>
        <TradeRow label="Electrician" active={elecActive} setActive={setElecActive} value={elec} setValue={setElec} placeholder="e.g. Disconnect and make safe all electrical outlets below 1200mm…"/>
        <TradeRow label="Plumber" active={plumbActive} setActive={setPlumbActive} value={plumb} setValue={setPlumb} placeholder="e.g. Isolate, disconnect and make safe all plumbing below 1200mm…"/>
        <TradeRow label="Other trade" active={otherTradeActive} setActive={setOtherTradeActive} value={otherTrade} setValue={setOtherTrade} placeholder="e.g. Asbestos removalist, structural engineer…"/>
      </div>}
    </Sec>

    <Sec number={3} title="Asbestos">
      <span style={lbl}>Clearance certificate required?</span>
      <YesNo value={asbestos} onChange={setAsbestos}/>
    </Sec>

    <Sec number={4} title="Skip Bin Required?">
      <YesNo value={skipBin} onChange={setSkipBin}/>
      {skipBin==="yes"&&<div style={{marginTop:12}}>
        <TextField value={skipDetail} onChange={setSkipDetail} placeholder="e.g. Medium skip bin for building materials…" rows={2}/>
      </div>}
    </Sec>

    <Sec number={5} title="Works Required">
      <TextField value={works} onChange={setWorks} placeholder="Describe strip out works…" rows={4} templateKey="stripout"/>
    </Sec>

    <Sec number={6} title="Labour">
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Sec>

    <Sec number={7} title="Truck Required?">
      <YesNo value={truck} onChange={setTruck}/>
      {truck==="yes"&&<div style={{marginTop:12}}>
        <span style={lbl}>Number of days</span>
        <Stepper value={truckDays} onChange={setTruckDays} min={1}/>
      </div>}
    </Sec>

    <Sec number={8} title="Equipment">
      <EquipGrid defs={DEFS} values={equip} setValues={setEquip}/>
    </Sec>

    <Sec number={9} title="Consumables">
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        {CONS_STD.map(c=><span key={c} style={{fontSize:11,color:C.muted,background:C.subtle,border:"1px solid "+C.border,borderRadius:5,padding:"3px 9px"}}>{c}</span>)}
      </div>
      <span style={lbl}>Anything special beyond the standard kit?</span>
      <YesNo value={specCons} onChange={setSpecCons}/>
      {specCons==="yes"&&<div style={{marginTop:10}}><TextField value={consDetail} onChange={setConsDetail} placeholder="e.g. extra rubbish bags, specialised PPE…" rows={2}/></div>}
    </Sec>

    <Sec number={10} title="Additional Requirements">
      <TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/>
    </Sec>

    <Sec number={11} title="Site Notes — Anything that could help attending technicians">
      <TextField value={siteNotes} onChange={setSiteNotes} placeholder="e.g. high ceiling, elevator access, no parking on street…" rows={3}/>
    </Sec>

    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── FLOORING FORM ─────────────────────────────────────────────────────────────
function FlooringForm({ onResult }) {
  const [rooms,setRooms]=useState([]); const [roomsExtra,setRoomsExtra]=useState("");
  const [works,setWorks]=useState("");
  const [techs,setTechs]=useState(2); const [hours,setHours]=useState(20);
  const [dryingRequired,setDryingRequired]=useState(null);
  const [equip,setEquip]=useState({dehum:{qty:5,days:5},mover:{qty:8,days:5},hepa:{qty:1,days:1},scrubber:{qty:0,days:1}});
  const [truck,setTruck]=useState(null); const [truckDays,setTruckDays]=useState(1);
  const [highCost,setHighCost]=useState(null);
  const [specCons,setSpecCons]=useState(null); const [consDetail,setConsDetail]=useState("");
  const [addReqs,setAddReqs]=useState("");
  const [siteNotes,setSiteNotes]=useState("");
  const [loading,setLoading]=useState(false);

  const DEFS_DRYING=[{key:"dehum",label:"Dehumidifier"},{key:"mover",label:"Air Mover / Fan"}];
  const DEFS_ALWAYS=[{key:"hepa",label:"HEPA Vacuum"},{key:"scrubber",label:"Air Scrubber (AFD)"}];
  const CONS_STD=["Antimicrobial solution","PPE","Filters / bags","Microfibre cloths","Blade","Mop/Mop pad","Cloth tape/masking tape","Rags"];

  const go = async () => {
    setLoading(true);
    const areas = roomsToText(rooms, roomsExtra);
    const cleaned = await cleanAll({
      works:      { text: works || WORKS_TEMPLATES.flooring, mode: "bullets" },
      consDetail: { text: consDetail, mode: "translate"  },
      addReqs:    { text: addReqs,    mode: "translate"  },
      siteNotes:  { text: siteNotes,  mode: "sitenotes"  },
    });
    onResult(buildFlooring({
      areas, techs, hours,
      dryingRequired, equip, truck, truckDays,
      highCost, specCons, consDetail:cleaned.consDetail,
      addReqs:cleaned.addReqs, siteNotes:cleaned.siteNotes,
    }, cleaned.works));
    setLoading(false);
  };

  return (<div>
    <Sec number={1} title="Areas / Rooms Affected">
      <RoomPicker selected={rooms} setSelected={setRooms} extra={roomsExtra} setExtra={setRoomsExtra}/>
    </Sec>

    <Sec number={2} title="Works Required">
      <TextField value={works} onChange={setWorks} placeholder="Describe flooring works…" rows={4} templateKey="flooring"/>
    </Sec>

    <Sec number={3} title="Labour">
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Sec>

    <Sec number={4} title="Equipment">
      <span style={lbl}>Drying equipment required?</span>
      <YesNo value={dryingRequired} onChange={setDryingRequired}/>
      {dryingRequired==="yes"&&(
        <div style={{marginTop:14,paddingBottom:14,borderBottom:"1px solid "+C.border}}>
          <EquipGrid defs={DEFS_DRYING} values={equip} setValues={setEquip}/>
        </div>
      )}
      <div style={{marginTop:14}}>
        <span style={{...lbl,marginBottom:10}}>HEPA Vacuum & AFD</span>
        <EquipGrid defs={DEFS_ALWAYS} values={equip} setValues={setEquip}/>
      </div>
    </Sec>

    <Sec number={5} title="Truck & Disposal">
      <span style={lbl}>Truck required?</span>
      <YesNo value={truck} onChange={setTruck}/>
      {truck==="yes"&&<div style={{marginTop:12}}>
        <span style={lbl}>Number of days</span>
        <Stepper value={truckDays} onChange={setTruckDays} min={1}/>
      </div>}
      <div style={{marginTop:16}}>
        <span style={lbl}>High-cost disposal?</span>
        <YesNo value={highCost} onChange={setHighCost}/>
      </div>
    </Sec>

    <Sec number={6} title="Consumables">
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        {CONS_STD.map(c=><span key={c} style={{fontSize:11,color:C.muted,background:C.subtle,border:"1px solid "+C.border,borderRadius:5,padding:"3px 9px"}}>{c}</span>)}
      </div>
      <span style={lbl}>Anything special beyond the standard kit?</span>
      <YesNo value={specCons} onChange={setSpecCons}/>
      {specCons==="yes"&&<div style={{marginTop:10}}><TextField value={consDetail} onChange={setConsDetail} placeholder="e.g. extra mop pads, floor protection…" rows={2}/></div>}
    </Sec>

    <Sec number={7} title="Additional Requirements">
      <TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/>
    </Sec>

    <Sec number={8} title="Site Notes — Anything that could help attending technicians">
      <TextField value={siteNotes} onChange={setSiteNotes} placeholder="e.g. high ceiling, heavy furniture, elevator access…" rows={3}/>
    </Sec>

    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── FLOOD FORM ────────────────────────────────────────────────────────────────
function FloodForm({ onResult }) {
  const [rooms,setRooms]=useState([]); const [roomsExtra,setRoomsExtra]=useState("");
  const [phase1,setPhase1]=useState(null);
  const [phase2,setPhase2]=useState(null);
  const [phase3,setPhase3]=useState(null);

  const [w1,setW1]=useState(""); const [techs1,setTechs1]=useState(3); const [hours1,setHours1]=useState(12);
  const [equip1,setEquip1]=useState({trolley:{qty:1,days:1},straps:{qty:1,days:1}});
  const [onsite,setOnsite]=useState(null); const [onsiteRoom,setOnsiteRoom]=useState("");
  const [offsite,setOffsite]=useState(null); const [storageSize,setStorageSize]=useState("");
  const [truck1,setTruck1]=useState(null); const [truckDays1,setTruckDays1]=useState(1);

  const [w2,setW2]=useState(""); const [techs2,setTechs2]=useState(3); const [hours2,setHours2]=useState(20);
  const [equip2,setEquip2]=useState({scrubber:{qty:4,days:2},hepa:{qty:1,days:1}});
  const [builderActive,setBuilderActive]=useState(null); const [builder,setBuilder]=useState("");
  const [elecActive,setElecActive]=useState(null); const [elec,setElec]=useState("");
  const [plumbActive,setPlumbActive]=useState(null); const [plumb,setPlumb]=useState("");
  const [otherTradeActive,setOtherTradeActive]=useState(null); const [otherTrade,setOtherTrade]=useState("");
  const [asbestos,setAsbestos]=useState(null);
  const [skipBin,setSkipBin]=useState(null); const [skipDetail,setSkipDetail]=useState("");
  const [truck2,setTruck2]=useState(null);

  const [w3,setW3]=useState(""); const [techs3,setTechs3]=useState(2); const [hours3,setHours3]=useState(4);
  const [equip3,setEquip3]=useState({scrubber:{qty:4,days:1}});

  const [w4,setW4]=useState(""); const [techs4,setTechs4]=useState(2); const [hours4,setHours4]=useState(15);
  const [drying4,setDrying4]=useState(null);
  const [equip4,setEquip4]=useState({dehum:{qty:3,days:5},mover:{qty:6,days:5},scrubber:{qty:3,days:1},hepa:{qty:2,days:1}});

  const [addReqs,setAddReqs]=useState("");
  const [siteNotes,setSiteNotes]=useState("");
  const [loading,setLoading]=useState(false);

  const DEFS1=[{key:"trolley",label:"Trolley / Hand Trolley"},{key:"straps",label:"Lifting Straps"}];
  const DEFS2=[{key:"scrubber",label:"Air Scrubber (AFD)"},{key:"hepa",label:"HEPA Vacuum"}];
  const DEFS3=[{key:"scrubber",label:"Air Scrubber (AFD)"}];
  const DEFS4_DRYING=[{key:"dehum",label:"Dehumidifier"},{key:"mover",label:"Air Mover / Fan"}];
  const DEFS4_ALWAYS=[{key:"scrubber",label:"Air Scrubber (AFD)"},{key:"hepa",label:"HEPA Vacuum"}];

  const go = async () => {
    setLoading(true);
    const areas = roomsToText(rooms, roomsExtra);
    const cleaned = await cleanAll({
      builder:     { text: builder,     mode: "trades"    },
      elec:        { text: elec,        mode: "trades"    },
      plumb:       { text: plumb,       mode: "trades"    },
      otherTrade:  { text: otherTrade,  mode: "trades"    },
      skipDetail:  { text: skipDetail,  mode: "translate" },
      onsiteRoom:  { text: onsiteRoom,  mode: "translate" },
      storageSize: { text: storageSize, mode: "translate" },
      w1: { text: w1 || WORKS_TEMPLATES.flood_contents,    mode: "bullets" },
      w2: { text: w2 || WORKS_TEMPLATES.flood_stripout,    mode: "bullets" },
      w3: { text: w3 || WORKS_TEMPLATES.flood_siteprep,    mode: "bullets" },
      w4: { text: w4 || WORKS_TEMPLATES.flood_restoration, mode: "bullets" },
      addReqs:    { text: addReqs,    mode: "translate"  },
      siteNotes:  { text: siteNotes,  mode: "sitenotes"  },
    });
    onResult(buildFlood({
      areas, phase1, phase2, phase3,
      techs1, hours1, equip1, onsite, onsiteRoom:cleaned.onsiteRoom,
      offsite, storageSize:cleaned.storageSize, truck1, truckDays1,
      builderActive, builder:cleaned.builder, elecActive, elec:cleaned.elec,
      plumbActive, plumb:cleaned.plumb, otherTradeActive, otherTrade:cleaned.otherTrade,
      asbestos, skipBin, skipDetail:cleaned.skipDetail, truck2,
      techs2, hours2, equip2,
      techs3, hours3, equip3,
      techs4, hours4, drying4, equip4,
      addReqs:cleaned.addReqs, siteNotes:cleaned.siteNotes,
    }, {w1:cleaned.w1, w2:cleaned.w2, w3:cleaned.w3, w4:cleaned.w4}));
    setLoading(false);
  };

  const phaseHeader = (num, title, active, setActive) => (
    <div style={{background:C.greenLight, padding:"12px 16px", borderBottom:"1px solid "+C.border, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
      <span style={{fontSize:13, fontWeight:700, color:C.green}}>Phase {num} — {title}</span>
      <YesNo value={active} onChange={setActive}/>
    </div>
  );

  return (<div>
    <Sec number={1} title="Areas / Rooms Affected">
      <RoomPicker selected={rooms} setSelected={setRooms} extra={roomsExtra} setExtra={setRoomsExtra}/>
    </Sec>

    {/* PHASE 1 — Contents Remediation */}
    <div style={{marginBottom:14, border:"1.5px solid "+C.border, borderRadius:12, overflow:"hidden"}}>
      {phaseHeader(1, "Contents Remediation", phase1, setPhase1)}
      {phase1==="yes"&&<div style={{padding:"16px"}}>
        <span style={lbl}>Works Required</span>
        <TextField value={w1} onChange={setW1} placeholder="Describe contents remediation works…" rows={3} templateKey="flood_contents"/>
        <div style={{display:"flex",gap:20,flexWrap:"wrap",marginTop:14}}>
          <div><span style={lbl}>Technicians</span><Stepper value={techs1} onChange={setTechs1} min={1}/></div>
          <div><span style={lbl}>Hours</span><Stepper value={hours1} onChange={setHours1} min={1} max={200}/></div>
        </div>
        <div style={{marginTop:14}}>
          <span style={lbl}>On-site relocation?</span>
          <YesNo value={onsite} onChange={setOnsite}/>
          {onsite==="yes"&&<div style={{marginTop:10}}><span style={lbl}>Which room?</span><TextField value={onsiteRoom} onChange={setOnsiteRoom} placeholder="e.g. garage, living area…" rows={1}/></div>}
        </div>
        <div style={{marginTop:14}}>
          <span style={lbl}>Off-site storage?</span>
          <YesNo value={offsite} onChange={setOffsite}/>
          {offsite==="yes"&&<div style={{marginTop:10}}><span style={lbl}>Capacity required</span><TextField value={storageSize} onChange={setStorageSize} placeholder="e.g. ≈ 20 m², large unit…" rows={1}/></div>}
        </div>
        <div style={{marginTop:14}}>
          <span style={lbl}>Truck required?</span>
          <YesNo value={truck1} onChange={setTruck1}/>
          {truck1==="yes"&&<div style={{marginTop:10}}><span style={lbl}>Number of days</span><Stepper value={truckDays1} onChange={setTruckDays1} min={1}/></div>}
        </div>
        <div style={{marginTop:14}}><span style={lbl}>Equipment</span><EquipGrid defs={DEFS1} values={equip1} setValues={setEquip1}/></div>
      </div>}
    </div>

    {/* PHASE 2 — Strip Out */}
    <div style={{marginBottom:14, border:"1.5px solid "+C.border, borderRadius:12, overflow:"hidden"}}>
      {phaseHeader(2, "Strip Out", phase2, setPhase2)}
      {phase2==="yes"&&<div style={{padding:"16px"}}>
        <span style={lbl}>Other Trades Required?</span>
        <div style={{marginBottom:14}}>
          {[{label:"Builder",active:builderActive,setActive:setBuilderActive,val:builder,setVal:setBuilder,ph:"e.g. Remove all fixed cabinetry below 1200mm…"},
            {label:"Electrician",active:elecActive,setActive:setElecActive,val:elec,setVal:setElec,ph:"e.g. Disconnect and make safe all electrical below 1200mm…"},
            {label:"Plumber",active:plumbActive,setActive:setPlumbActive,val:plumb,setVal:setPlumb,ph:"e.g. Isolate and disconnect all plumbing below 1200mm…"},
            {label:"Other",active:otherTradeActive,setActive:setOtherTradeActive,val:otherTrade,setVal:setOtherTrade,ph:"e.g. Asbestos removalist…"},
          ].map(t=>(
            <div key={t.label} style={{marginBottom:12, paddingBottom:12, borderBottom:"1px solid "+C.border}}>
              <span style={{...lbl,color:C.green,marginBottom:6}}>{t.label}</span>
              <YesNo value={t.active} onChange={t.setActive}/>
              {t.active==="yes"&&<div style={{marginTop:8}}><TextField value={t.val} onChange={t.setVal} placeholder={t.ph} rows={2}/></div>}
            </div>
          ))}
        </div>
        <div style={{marginBottom:12}}><span style={lbl}>Asbestos clearance required?</span><YesNo value={asbestos} onChange={setAsbestos}/></div>
        <div style={{marginBottom:14}}>
          <span style={lbl}>Skip bin required?</span>
          <YesNo value={skipBin} onChange={setSkipBin}/>
          {skipBin==="yes"&&<div style={{marginTop:8}}><TextField value={skipDetail} onChange={setSkipDetail} placeholder="e.g. Medium skip bin…" rows={2}/></div>}
        </div>
        <span style={lbl}>Works Required</span>
        <TextField value={w2} onChange={setW2} placeholder="Describe strip out works…" rows={3} templateKey="flood_stripout"/>
        <div style={{display:"flex",gap:20,flexWrap:"wrap",marginTop:14}}>
          <div><span style={lbl}>Technicians</span><Stepper value={techs2} onChange={setTechs2} min={1}/></div>
          <div><span style={lbl}>Hours</span><Stepper value={hours2} onChange={setHours2} min={1} max={200}/></div>
        </div>
        <div style={{marginTop:14}}><span style={lbl}>Truck for disposal?</span><YesNo value={truck2} onChange={setTruck2}/></div>
        <div style={{marginTop:14}}><span style={lbl}>Equipment</span><EquipGrid defs={DEFS2} values={equip2} setValues={setEquip2}/></div>
      </div>}
    </div>

    {/* PHASE 3 — Site Preparation */}
    <div style={{marginBottom:14, border:"1.5px solid "+C.border, borderRadius:12, overflow:"hidden"}}>
      {phaseHeader(3, "Site Preparation", phase3, setPhase3)}
      {phase3==="yes"&&<div style={{padding:"16px"}}>
        <span style={lbl}>Works Required</span>
        <TextField value={w3} onChange={setW3} placeholder="Describe site preparation works…" rows={3} templateKey="flood_siteprep"/>
        <div style={{display:"flex",gap:20,flexWrap:"wrap",marginTop:14}}>
          <div><span style={lbl}>Technicians</span><Stepper value={techs3} onChange={setTechs3} min={1}/></div>
          <div><span style={lbl}>Hours</span><Stepper value={hours3} onChange={setHours3} min={1} max={200}/></div>
        </div>
        <div style={{marginTop:14}}><span style={lbl}>Equipment</span><EquipGrid defs={DEFS3} values={equip3} setValues={setEquip3}/></div>
      </div>}
    </div>

    {/* PHASE 4 — Restoration Cleaning (always shown) */}
    <div style={{marginBottom:14, border:"1.5px solid "+C.border, borderRadius:12, overflow:"hidden"}}>
      <div style={{background:C.greenLight, padding:"12px 16px", borderBottom:"1px solid "+C.border}}>
        <span style={{fontSize:13, fontWeight:700, color:C.green}}>Phase 4 — Restoration Cleaning</span>
      </div>
      <div style={{padding:"16px"}}>
        <span style={lbl}>Works Required</span>
        <TextField value={w4} onChange={setW4} placeholder="Describe restoration cleaning works…" rows={4} templateKey="flood_restoration"/>
        <div style={{display:"flex",gap:20,flexWrap:"wrap",marginTop:14}}>
          <div><span style={lbl}>Technicians</span><Stepper value={techs4} onChange={setTechs4} min={1}/></div>
          <div><span style={lbl}>Hours</span><Stepper value={hours4} onChange={setHours4} min={1} max={200}/></div>
        </div>
        <div style={{marginTop:14}}>
          <span style={lbl}>Drying equipment required?</span>
          <YesNo value={drying4} onChange={setDrying4}/>
          {drying4==="yes"&&<div style={{marginTop:12,paddingBottom:12,borderBottom:"1px solid "+C.border}}>
            <EquipGrid defs={DEFS4_DRYING} values={equip4} setValues={setEquip4}/>
          </div>}
          <div style={{marginTop:12}}>
            <span style={{...lbl,marginBottom:8}}>AFD & HEPA Vacuum</span>
            <EquipGrid defs={DEFS4_ALWAYS} values={equip4} setValues={setEquip4}/>
          </div>
        </div>
      </div>
    </div>

    <Sec number={5} title="Additional Requirements">
      <TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/>
    </Sec>

    <Sec number={6} title="Site Notes — Anything that could help attending technicians">
      <TextField value={siteNotes} onChange={setSiteNotes} placeholder="e.g. high ceiling, elevator access, no parking on street…" rows={3}/>
    </Sec>

    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── RESTORATION FORM ──────────────────────────────────────────────────────────
function RestorationForm({ onResult }) {
  const [rooms,setRooms]=useState([]); const [roomsExtra,setRoomsExtra]=useState(""); const [works,setWorks]=useState("");
  const [techs,setTechs]=useState(2); const [hours,setHours]=useState(5);
  const [equip,setEquip]=useState({scrubber:{qty:2,days:1},hepa:{qty:1,days:1},fogging:{qty:0,days:1}});
  const [truck,setTruck]=useState(null); const [truckDays,setTruckDays]=useState(1);
  const [specCons,setSpecCons]=useState(null); const [consDetail,setConsDetail]=useState("");
  const [addReqs,setAddReqs]=useState("");
  const [siteNotes,setSiteNotes]=useState("");
  const [loading,setLoading]=useState(false);
  const DEFS=[{key:"scrubber",label:"Air Scrubber (AFD)"},{key:"hepa",label:"HEPA Vacuum"},{key:"fogging",label:"Fogging Machine"}];
  const CONS_STD=["PPE","Filters / bags","Cloth tape/masking tape","Rubbish bags","Antimicrobial","Odorx"];

  const go = async () => {
    setLoading(true);
    const areas = roomsToText(rooms, roomsExtra);
    const cleaned = await cleanAll({
      works:      { text: works || WORKS_TEMPLATES.restoration, mode: "bullets" },
      consDetail: { text: consDetail, mode: "translate" },
      addReqs:    { text: addReqs,    mode: "translate" },
      siteNotes:  { text: siteNotes,  mode: "sitenotes" },
    });
    onResult(buildRestoration({
      areas, techs, hours, equip,
      truck, truckDays, specCons, consDetail:cleaned.consDetail,
      addReqs:cleaned.addReqs, siteNotes:cleaned.siteNotes,
    }, cleaned.works));
    setLoading(false);
  };

  return (<div>
    <Sec number={1} title="Areas / Rooms Affected"><RoomPicker selected={rooms} setSelected={setRooms} extra={roomsExtra} setExtra={setRoomsExtra}/></Sec>
    <Sec number={2} title="Works Required"><TextField value={works} onChange={setWorks} placeholder="Describe restoration cleaning works…" rows={4} templateKey="restoration"/></Sec>
    <Sec number={3} title="Labour">
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Sec>
    <Sec number={4} title="Equipment"><EquipGrid defs={DEFS} values={equip} setValues={setEquip}/></Sec>
    <Sec number={5} title="Truck Required?">
      <YesNo value={truck} onChange={setTruck}/>
      {truck==="yes"&&<div style={{marginTop:12}}>
        <span style={lbl}>Number of days</span>
        <Stepper value={truckDays} onChange={setTruckDays} min={1}/>
      </div>}
    </Sec>
    <Sec number={6} title="Consumables">
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        {CONS_STD.map(c=><span key={c} style={{fontSize:11,color:C.muted,background:C.subtle,border:"1px solid "+C.border,borderRadius:5,padding:"3px 9px"}}>{c}</span>)}
      </div>
      <span style={lbl}>Anything special beyond the standard kit?</span>
      <YesNo value={specCons} onChange={setSpecCons}/>
      {specCons==="yes"&&<div style={{marginTop:10}}><TextField value={consDetail} onChange={setConsDetail} placeholder="e.g. extra Odorx, specialised cleaning products…" rows={2}/></div>}
    </Sec>
    <Sec number={7} title="Additional Requirements"><TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Sec>
    <Sec number={8} title="Site Notes — Anything that could help attending technicians">
      <TextField value={siteNotes} onChange={setSiteNotes} placeholder="e.g. strong odour on site, high ceiling, elevator access…" rows={3}/>
    </Sec>
    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── DRYING FORM ───────────────────────────────────────────────────────────────
function DryingForm({ onResult }) {
  const [rooms,setRooms]=useState([]); const [roomsExtra,setRoomsExtra]=useState(""); const [works,setWorks]=useState("");
  const [techs,setTechs]=useState(1); const [hours,setHours]=useState(5);
  const [equip,setEquip]=useState({dehum:{qty:1,days:5},mover:{qty:3,days:5}});
  const [specCons,setSpecCons]=useState(null); const [consDetail,setConsDetail]=useState("");
  const [addReqs,setAddReqs]=useState("");
  const [siteNotes,setSiteNotes]=useState("");
  const [loading,setLoading]=useState(false);
  const DEFS=[{key:"dehum",label:"Dehumidifier"},{key:"mover",label:"Air Mover / Fan"}];
  const CONS_STD=["Antimicrobial solution","PPE","Filters / bags","Microfibre cloths","Rags"];

  const go = async () => {
    setLoading(true);
    const areas = roomsToText(rooms, roomsExtra);
    const cleaned = await cleanAll({
      works:      { text: works || WORKS_TEMPLATES.drying, mode: "bullets" },
      consDetail: { text: consDetail, mode: "translate" },
      addReqs:    { text: addReqs,    mode: "translate" },
      siteNotes:  { text: siteNotes,  mode: "sitenotes" },
    });
    onResult(buildDrying({
      areas, techs, hours, equip,
      specCons, consDetail:cleaned.consDetail,
      addReqs:cleaned.addReqs, siteNotes:cleaned.siteNotes,
    }, cleaned.works));
    setLoading(false);
  };

  return (<div>
    <Sec number={1} title="Areas / Rooms Affected"><RoomPicker selected={rooms} setSelected={setRooms} extra={roomsExtra} setExtra={setRoomsExtra}/></Sec>
    <Sec number={2} title="Works Required"><TextField value={works} onChange={setWorks} placeholder="Describe drying works…" rows={3} templateKey="drying"/></Sec>
    <Sec number={3} title="Labour">
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Sec>
    <Sec number={4} title="Equipment"><EquipGrid defs={DEFS} values={equip} setValues={setEquip}/></Sec>
    <Sec number={5} title="Consumables">
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
        {CONS_STD.map(c=><span key={c} style={{fontSize:11,color:C.muted,background:C.subtle,border:"1px solid "+C.border,borderRadius:5,padding:"3px 9px"}}>{c}</span>)}
      </div>
      <span style={lbl}>Anything special beyond the standard kit?</span>
      <YesNo value={specCons} onChange={setSpecCons}/>
      {specCons==="yes"&&<div style={{marginTop:10}}><TextField value={consDetail} onChange={setConsDetail} placeholder="e.g. extra filters, floor protection…" rows={2}/></div>}
    </Sec>
    <Sec number={6} title="Additional Requirements"><TextField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Sec>
    <Sec number={7} title="Site Notes — Anything that could help attending technicians">
      <TextField value={siteNotes} onChange={setSiteNotes} placeholder="e.g. equipment access, power availability, key location…" rows={3}/>
    </Sec>
    <GenBtn onClick={go} loading={loading}/>
  </div>);
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function SOWBuilder({ onBack }) {
  const [screen,setScreen]=useState("home");
  const [type,setType]=useState(null);
  const [result,setResult]=useState("");
  const [copied,setCopied]=useState(false);
  const [formKey,setFormKey]=useState(0);

  const cur = SOW_TYPES.find(t => t.id === type);
  const handleResult = doc => { setResult(doc); setScreen("result"); window.scrollTo(0,0); };
  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false),2500); };
  const reset = () => { setScreen("home"); setType(null); setResult(""); setFormKey(k=>k+1); };
  const backToEdit = () => { setScreen("form"); };

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
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Segoe UI',Arial,sans-serif",color:C.text,paddingBottom:90}}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        textarea:focus{border-color:#5a9a3a !important;outline:none}
        button:active{opacity:0.85}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#d4e4cb;border-radius:2px}
      `}</style>

      {/* HEADER */}
      <div style={{background:"#0f0f0f",borderBottom:"1px solid #222",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {screen!=="home" && (
            <button onClick={screen==="result"?backToEdit:reset}
              style={{background:"#1a1a1a",border:"1px solid #333",color:"#aaa",borderRadius:99,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
          )}
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <img src="/logo.svg" alt="" style={{width:28,height:28,objectFit:"contain"}} />
            <div>
              <div style={{fontSize:9,color:"#5a9a3a",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Major Industries</div>
              <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>{screen==="home"?"SOW Builder":cur?cur.label:"SOW Builder"}</div>
            </div>
          </div>
        </div>
        {screen==="result"&&<button onClick={copy} style={{padding:"8px 20px",borderRadius:99,border:"none",background:copied?"#27ae60":C.green,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>{copied?"Copied!":"Copy"}</button>}
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:"22px 16px"}}>

        {/* HOME */}
        {screen==="home"&&(
          <div style={{animation:"fadein 0.3s ease"}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:16,fontWeight:600,letterSpacing:1,textTransform:"uppercase"}}>Select job type</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {SOW_TYPES.map(t=>(
                <button key={t.id} onClick={()=>{setType(t.id);setScreen("form");}}
                  style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:"16px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"border-color 0.2s",width:"100%"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.green}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="#2a2a2a"}
                  onTouchStart={e=>e.currentTarget.style.borderColor=C.green}
                  onTouchEnd={e=>e.currentTarget.style.borderColor="#2a2a2a"}>
                  <div style={{width:44,height:44,borderRadius:13,background:"#1e3014",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:C.green}}>
                    {SOW_ICONS[t.id]}
                  </div>
                  <span style={{fontSize:15,fontWeight:600,color:C.text,flex:1}}>{t.label}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FORM — stays mounted on result screen so data survives Edit */}
        {(screen==="form"||screen==="result")&&type&&(
          <div key={formKey} style={{animation:"fadein 0.3s ease", display:screen==="form"?"block":"none"}}>{FORMS[type]}</div>
        )}

        {/* RESULT */}
        {screen==="result"&&(
          <div style={{animation:"fadein 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:15,fontWeight:700,color:C.green,display:"flex",alignItems:"center",gap:6}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>SOW Ready</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={backToEdit} style={{background:"#1a1a1a",border:"1px solid #333",color:"#ccc",borderRadius:99,padding:"6px 16px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Edit</button>
                <button onClick={reset} style={{background:"#1a1a1a",border:"1px solid #333",color:"#ccc",borderRadius:99,padding:"6px 16px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>New SOW</button>
              </div>
            </div>
            <div style={{background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:16,padding:"18px 20px",whiteSpace:"pre-wrap",fontSize:13,lineHeight:1.9,color:"#ddd",maxHeight:"62vh",overflowY:"auto"}}>
              {result}
            </div>
            <button onClick={copy} style={{width:"100%",marginTop:12,padding:"16px",borderRadius:99,background:copied?"#27ae60":C.green,border:"none",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>
              {copied?"Copied to clipboard!":"Copy to clipboard"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
