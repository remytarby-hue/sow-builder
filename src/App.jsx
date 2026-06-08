import { useState, useRef, useEffect } from "react";

const T = {
  bg:"#07090d", surface:"#0e1318", border:"#1c2530",
  accent:"#f97316", text:"#e2e8f0", muted:"#4a6070", subtle:"#111820",
};

const SOW_TYPES = [
  { id:"mould",       label:"Mould Remediation",    icon:"🍄", color:"#22c55e" },
  { id:"contents",    label:"Contents",              icon:"📦", color:"#f59e0b" },
  { id:"stripout",    label:"Strip Out",             icon:"🔨", color:"#ef4444" },
  { id:"flooring",    label:"Flooring Removal",      icon:"🪵", color:"#a78bfa" },
  { id:"flood",       label:"Flood Remediation",     icon:"💧", color:"#38bdf8" },
  { id:"restoration", label:"Restoration Cleaning",  icon:"✨", color:"#f472b6" },
  { id:"drying",      label:"Drying",                icon:"💨", color:"#94a3b8" },
];

const WORKS_TEMPLATES = {
  mould: "Containment of the affected area.\nRemoval of the affected section of the ceiling/walls.\nHEPA vac + sanitation of all affected surfaces.\nInstallation of drying equipment.\nEncapsulation of timbers following drying.",
  contents: "Assessment and inventory of the affected items.\nRemoval of affected items for disposal.\nPacking and relocation of restorable/non-affected items to off-site storage.\nHEPA vac + sanitation of restorable items.\nReinstatement of contents.",
  stripout: "Strip out of walls in the affected areas up to 1200mm.\nRemoval of all affected insulation.",
  flooring: "Removal of the affected floor covering.\nHEPA vac + sanitation of subfloor.\nInstallation of drying equipment.",
  flood_contents: "All contents to be relocated. (Taxi box recommended.)\nSome items may require cleaning during the relocation process.\nIf an inventory is required, one full day will be allowed to complete it.\nA large storage unit is recommended to allow adequate space for storage and handling.",
  flood_stripout: "Strip out of walls up to 1200mm to expose all affected structural elements for proper cleaning and drying.\nRemoval of all affected insulation.",
  flood_siteprep: "Properly contain and protect items such as air conditioning units and other fixtures to prevent contamination or damage during the cleaning process.\nSet up air filtration devices (HEPA air scrubbers) to ensure a clean and safe environment for the duration of the restoration works.",
  flood_restoration: "Surface Preparation: Inspection to ensure all affected materials have been fully stripped out. Removal of nails, fixings, adhesives and residues. Confirmation that all affected insulation has been removed and the area is clean and ready.\nHEPA Vacuuming: Thorough HEPA vacuuming of all exposed surfaces including floors, walls and timbers to remove fine dust, mould spores and contaminants.\nSanitisation: Application of an industry-approved sanitising solution combined with abrasive cleaning to thoroughly remove stubborn residues, mould and microbial growth.\nCleaning of Windows, Tracks and Fixtures: Clean all windows including glass panes and tracks. Clean and sanitise fan blades, light fixtures and all surfaces.\nDrying Process: Installation of drying equipment to ensure all materials are thoroughly dried. Moisture levels monitored throughout the drying process.",
  restoration: "Removal of the affected smoothedge.\nHEPA vacuuming of all impacted areas.\nSanitisation of the subfloor.\nOdour control treatment including fogging due to strong odour identified on-site.",
  drying: "Sanitation of affected areas.\nInstallation of drying equipment.\nMoisture readings and monitoring throughout drying period.",
};

// ── DOCUMENT ASSEMBLERS ──────────────────────────────────────────────────────
function bulletLines(text) {
  if (!text) return "";
  return text.split("\n").filter(s=>s.trim()).map(s=>`\t• ${s.trim()}`).join("\n");
}

function equipSection(items, values) {
  const lines = [];
  items.forEach(({key, label}) => {
    const qty = values[key]?.qty ?? 0;
    if (qty > 0) {
      lines.push(`${label}\n\t• Quantity: ${qty}\n\t• Days used: ${values[key].days}`);
    }
  });
  Object.entries(values).forEach(([k,v]) => {
    if (k.startsWith("custom_") && (v.qty??0) > 0) {
      lines.push(`${v.label}\n\t• Quantity: ${v.qty}\n\t• Days used: ${v.days}`);
    }
  });
  return lines.join("\n\n");
}

function assembleMould({ areas, otherTrades, tradesDetail, works, techs, hours, equip, specCons, consDetail, addReqs }) {
  const EQUIP_DEF = [{key:"dehum",label:"Dehumidifiers"},{key:"scrubber",label:"Air Scrubbers"},{key:"mover",label:"Air Movers / Fans"},{key:"hepa",label:"HEPA Vacuumed"}];
  const cons = ["Antimicrobial solution","Plastic sheeting","PPE","Filters / bags","Microfibre cloths","Containment doors","Multi tools blade","Blade","Cloth tape/masking tape","Rags",...(specCons==="yes"&&consDetail?[consDetail]:[])];
  const worksText = works || WORKS_TEMPLATES.mould;
  const tradesLine = otherTrades==="yes" ? (tradesDetail||"To be confirmed") : "None";

  return `SOW - Mould Remediation

Other trades required prior to commencement of works: ${tradesLine}

Room Name / Area: ${areas||"To be confirmed"}

\tWorks required:
${bulletLines(worksText)}

General Scope of Works
\t• Disposal of contaminated or non-restorable materials
\t• Transport of waste to approved disposal facility
\t• Cleaning and sanitising of tools and equipment after works
\t• Compile report of findings and works carried out for each attendance

Labour Breakdown
General summary of labour carried out onsite.
\t• Labour carried out during initial attendance
\t• Reassessment of affected areas during re-attendance
\t• Moisture readings and monitoring
\t• Adjustment, relocation, and removal of equipment
\t• Final checks and confirmation of completion
Total Labour Hours
\t• Technician hours: ${techs} Technician${techs>1?"s":""} x ${hours} hours

Equipment Breakdown
${equipSection(EQUIP_DEF,equip)||"No equipment specified"}

Consumables Breakdown
List of consumables required.
${cons.map(c=>`\t• ${c}`).join("\n")}${addReqs?`\n\nAdditional Requirements\n${addReqs.split(/[,\n]/).filter(Boolean).map(r=>`\t• ${r.trim()}`).join("\n")}`:""}`;
}

function assembleContents({ areas, works, phases, equip, truckDays, storageSize, addReqs }) {
  const EQUIP_DEF = [{key:"scrubber",label:"Air Scrubbers"},{key:"hepa",label:"HEPA Vacuumed"}];
  const PHASE_DEF = [
    {key:"initial",label:"Labour carried out during initial attendance"},
    {key:"remediation",label:"Remediation of restorable items"},
    {key:"reinstatement",label:"Reinstatement of contents"},
    {key:"finalcheck",label:"Final checks and confirmation of completion"},
  ];
  const worksText = works || WORKS_TEMPLATES.contents;

  return `SOW - Contents

Room Name / Area: ${areas||"Entire property"}

\tWorks required:
${bulletLines(worksText)}

General Scope of Works
\t• Transport of waste to approved disposal facility
\t• Cleaning and sanitising of tools and equipment after works
\t• Compile report of findings and works carried out for each attendance

Labour Breakdown
General summary of labour carried out onsite.
${PHASE_DEF.map(p=>`\t• ${p.label} - ${phases[p.key].techs} tech${phases[p.key].techs>1?"s":""} x ${phases[p.key].hours} hours`).join("\n")}

Equipment Breakdown
${equipSection(EQUIP_DEF,equip)||"No equipment specified"}

Consumables Breakdown
List of consumables required.
\t• Antimicrobial solution
\t• Filters / bags
\t• Microfibre cloths
\t• Moving supplies (boxes, tape, bubble wrap, blankets, shrink wrap, butcher paper, etc.)

Truck Required for ${truckDays} day${truckDays>1?"s":""}:
\t• Relocation of contents
\t• Disposal of non-restorable items
\t• Reinstatement of contents

Off-site storage capacity required: ${storageSize||"To be confirmed"}${addReqs?`\n\nAdditional Requirements\n${addReqs.split(/[,\n]/).filter(Boolean).map(r=>`\t• ${r.trim()}`).join("\n")}`:""}`;
}

function assembleStripout({ areas, elec, plumb, builder, other, asbestos, skipBin, skipDetail, works, techs, hours, equip, addReqs }) {
  const EQUIP_DEF = [{key:"scrubber",label:"Air Scrubbers"}];
  const trades = [];
  if (elec) trades.push(`Electrician\n${elec}`);
  if (plumb) trades.push(`Plumber\n${plumb}`);
  if (builder) trades.push(`Builder\n${builder}`);
  if (other) trades.push(`Other\n${other}`);
  if (asbestos==="yes") trades.push(`Other\n\t⁃ Asbestos clearance certificate required as there is potential asbestos on-site.`);
  if (skipBin==="yes") trades.push(`Other\n\t⁃ ${skipDetail||"Installation of a skip bin to dispose of building materials."}`);
  const worksText = works || WORKS_TEMPLATES.stripout;

  return `SOW - Strip Out

Other trades required prior to commencement of works:
${trades.length ? trades.join("\n\n") : "None"}

Room Name / Area: ${areas||"To be confirmed"}

\tWorks required:
${bulletLines(worksText)}

General Scope of Works
\t• Disposal of contaminated or non-restorable materials
\t• Transport of waste to approved disposal facility
\t• Cleaning and sanitising of tools and equipment after works
\t• Compile report of findings and works carried out for each attendance

Labour Breakdown
General summary of labour carried out onsite.
\t• Labour carried out during initial attendance
\t• Final checks and confirmation of completion
Total Labour Hours
\t• Technician hours: ${techs} Technician${techs>1?"s":""} x ${hours} hours

Equipment Breakdown
${equipSection(EQUIP_DEF,equip)||"No equipment specified"}
Containment poles
\t• Quantity: ${equip.poles?.qty??4}

Consumables Breakdown
List of consumables required.
\t• Plastic sheeting
\t• PPE
\t• Filters / bags
\t• Containment doors
\t• Multi tools blade
\t• Blade
\t• Cloth tape/masking tape
\t• Rubbish bags
\t• Floor protection${addReqs?`\n\nAdditional Requirements\n${addReqs.split(/[,\n]/).filter(Boolean).map(r=>`\t• ${r.trim()}`).join("\n")}`:""}`;
}

function assembleFlooring({ areas, vacate, works, techs, hours, equip, truck, highCost, addReqs }) {
  const EQUIP_DEF = [{key:"dehum",label:"Dehumidifiers"},{key:"mover",label:"Air Movers / Fans"},{key:"hepa",label:"HEPA Vacuumed"}];
  const worksText = works || WORKS_TEMPLATES.flooring;

  return `SOW - Flooring Removal

Room Name / Area: ${areas||"To be confirmed"}
${vacate==="yes"?"\nContents currently on site may be temporarily relocated on-site for the duration of the flooring removal, in order to facilitate safe and efficient remediation works. However, we recommend that the insured vacate the property during this period, due to the potential disruption and health risks associated with the works.\n":""}
\tWorks required:
${bulletLines(worksText)}

General Scope of Works
\t• Disposal of contaminated or non-restorable materials
\t• Transport of waste to approved disposal facility
\t• Cleaning and sanitising of tools and equipment after works
\t• Compile report of findings and works carried out for each attendance

Labour Breakdown
General summary of labour carried out onsite.
\t• Labour carried out during initial attendance
\t• Reassessment of affected areas during re-attendance
\t• Moisture readings and monitoring
\t• Adjustment, relocation, and removal of equipment
\t• Final checks and confirmation of completion
Total Labour Hours
\t• Technician hours: ${techs} Technician${techs>1?"s":""} x ${hours} hours

Equipment Breakdown
${equipSection(EQUIP_DEF,equip)||"No equipment specified"}

Consumables Breakdown
List of consumables required.
\t• Antimicrobial solution
\t• PPE
\t• Filters / bags
\t• Microfibre cloths
\t• Blade
\t• Mop/Mop pad
\t• Cloth tape/masking tape
\t• Rags${truck==="yes"?"\n\nTruck needed for disposal of removed flooring materials.":""}${highCost==="yes"?"\nHigh-cost disposal required.":""}${addReqs?`\n\nAdditional Requirements\n${addReqs.split(/[,\n]/).filter(Boolean).map(r=>`\t• ${r.trim()}`).join("\n")}`:""}`;
}

function assembleFlood({ areas, elec, plumb, builder, w1, techs1, hours1, equip1, w2, techs2, hours2, equip2, w3, techs3, hours3, equip3, w4, techs4, hours4, equip4, storageSize, addReqs }) {
  const EQUIP1_DEF = [{key:"truck",label:"Truck"},{key:"trolley",label:"Trolley/Hand trolley"},{key:"straps",label:"Lifting straps"}];
  const EQUIP2_DEF = [{key:"scrubber",label:"Air Scrubbers"},{key:"hepa",label:"HEPA Vacuum"}];
  const EQUIP3_DEF = [{key:"scrubber",label:"Air Scrubbers"}];
  const EQUIP4_DEF = [{key:"dehum",label:"Dehumidifiers"},{key:"scrubber",label:"Air Scrubbers"},{key:"mover",label:"Air Movers / Fans"},{key:"hepa",label:"HEPA Vacuumed"}];

  const trades = [];
  if (elec) trades.push(`Electrician\n${elec}`);
  if (plumb) trades.push(`Plumber\n${plumb}`);
  if (builder) trades.push(`Builder\n${builder}`);

  return `SOW - Flood Remediation

Other trades required prior to commencement of works:
${trades.length ? trades.join("\n\n") : "None"}

Room Name / Area: ${areas||"To be confirmed"}

**Preparation for Restoration Cleaning**

1 - Relocation of contents:
${bulletLines(w1||WORKS_TEMPLATES.flood_contents)}
${storageSize?`\t⁃ A large storage unit is recommended (${storageSize}) to allow adequate space for storage and handling.\n`:""}
Total Labour Hours
\t• Technician hours: ${techs1} Technician${techs1>1?"s":""} x ${hours1} hours

Equipment Breakdown
${equipSection(EQUIP1_DEF,equip1)||"\t• Truck\n\t• Trolley/Hand trolley\n\t• Lifting straps"}

Consumables Breakdown
\t• Moving boxes ≈ 50
\t• Packing supplies (butcher paper, bubble wrap, packing tape, furniture blanket, Shrink wrap, etc.)
\t• Antimicrobial
\t• Rags

2 - Strip Out:
${bulletLines(w2||WORKS_TEMPLATES.flood_stripout)}

Total Labour Hours
\t• Technician hours: ${techs2} Technician${techs2>1?"s":""} x ${hours2} hours

Equipment Breakdown
\t• Truck for disposal.
${equipSection(EQUIP2_DEF,equip2)}

Consumables Breakdown
\t• Plastic sheeting
\t• PPE
\t• Rubbish bags

3 - Site preparation for Restoration cleaning:
${bulletLines(w3||WORKS_TEMPLATES.flood_siteprep)}

Total Labour Hours
\t• Technician hours: ${techs3} Technician${techs3>1?"s":""} x ${hours3} hours

Equipment Breakdown
${equipSection(EQUIP3_DEF,equip3)||"Air Scrubbers — duration of restoration cleaning."}

**Restoration Cleaning**

4 - Restoration Cleaning:
${bulletLines(w4||WORKS_TEMPLATES.flood_restoration)}

Total Labour Hours
\t• Technician hours: ${techs4} Technician${techs4>1?"s":""} x ${hours4} hours

Equipment Breakdown
${equipSection(EQUIP4_DEF,equip4)}

Consumables Breakdown
\t• Antimicrobial solution
\t• Plastic sheeting
\t• PPE
\t• Filters / bags
\t• Microfibre cloths
\t• Blade
\t• Cloth tape/masking tape
\t• Rags
\t• Rubbish bags
\t• Percide
\t• Mop pads
\t• Mop
\t• Hand brushes
\t• White vinegar

Final Inspection:
\t• Conduct a final walkthrough and moisture level check to confirm that the property has been properly cleaned, sanitised, and dried.${addReqs?`\n\nAdditional Requirements\n${addReqs.split(/[,\n]/).filter(Boolean).map(r=>`\t• ${r.trim()}`).join("\n")}`:""}`;
}

function assembleRestoration({ areas, works, techs, hours, equip, addReqs }) {
  const EQUIP_DEF = [{key:"scrubber",label:"Air Scrubbers"},{key:"hepa",label:"HEPA Vacuum"},{key:"fogging",label:"Fogging Machine"}];
  const worksText = works || WORKS_TEMPLATES.restoration;

  return `SOW - Restoration Cleaning

Room Name / Area: ${areas||"To be confirmed"}

\tWorks required:
${bulletLines(worksText)}

General Scope of Works
\t• Disposal of contaminated or non-restorable materials
\t• Transport of waste to approved disposal facility
\t• Cleaning and sanitising of tools and equipment after works
\t• Compile report of findings and works carried out for each attendance

Labour Breakdown
General summary of labour carried out onsite.
\t• Labour carried out during initial attendance
\t• Final checks and confirmation of completion
Total Labour Hours
\t• Technician hours: ${techs} Technician${techs>1?"s":""} x ${hours} hours

Equipment Breakdown
${equipSection(EQUIP_DEF,equip)||"No equipment specified"}

Consumables Breakdown
List of consumables required.
\t• PPE
\t• Filters / bags
\t• Cloth tape/masking tape
\t• Rubbish bags
\t• Antimicrobial
\t• Odorx${addReqs?`\n\nAdditional Requirements\n${addReqs.split(/[,\n]/).filter(Boolean).map(r=>`\t• ${r.trim()}`).join("\n")}`:""}`;
}

function assembleDrying({ areas, works, techs, hours, equip, addReqs }) {
  const EQUIP_DEF = [{key:"dehum",label:"Dehumidifiers"},{key:"mover",label:"Air Movers / Fans"}];
  const worksText = works || WORKS_TEMPLATES.drying;

  return `SOW - Drying

Room Name / Area: ${areas||"To be confirmed"}

\tWorks required:
${bulletLines(worksText)}

General Scope of Works
\t• Compile report of findings and works carried out for each attendance

Labour Breakdown
General summary of labour carried out onsite.
\t• Labour carried out during initial attendance
\t• Reassessment of affected areas during re-attendance
\t• Moisture readings and monitoring
\t• Adjustment, relocation, and removal of equipment
\t• Final checks and confirmation of completion
Total Labour Hours
\t• Technician hours: ${techs} Technician${techs>1?"s":""} x ${hours} hours

Equipment Breakdown
${equipSection(EQUIP_DEF,equip)||"No equipment specified"}

Consumables Breakdown
List of consumables required.
\t• Antimicrobial solution
\t• PPE
\t• Filters / bags
\t• Microfibre cloths
\t• Rags${addReqs?`\n\nAdditional Requirements\n${addReqs.split(/[,\n]/).filter(Boolean).map(r=>`\t• ${r.trim()}`).join("\n")}`:""}`;
}

// ── SPEECH HOOK ──────────────────────────────────────────────────────────────
function useSpeech(onResult) {
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)) setSupported(true);
  }, []);
  const start = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-AU"; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onresult = (e) => onResult(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start(); recRef.current = rec; setListening(true);
  };
  const stop = () => { recRef.current?.stop(); setListening(false); };
  return { listening, supported, start, stop };
}

// ── UI COMPONENTS ────────────────────────────────────────────────────────────
function VoiceField({ value, onChange, placeholder, rows = 3, templateKey }) {
  const append = (t) => onChange((value ? value + " " : "") + t);
  const { listening, supported, start, stop } = useSpeech(append);
  const template = templateKey ? WORKS_TEMPLATES[templateKey] : null;
  return (
    <div>
      {template && (
        <button onClick={() => onChange(template)} style={{
          marginBottom:8, padding:"5px 12px", borderRadius:7,
          background:"transparent", border:`1px solid ${T.border}`,
          color:T.muted, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
        }}>↙ Use Template</button>
      )}
      <textarea value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} rows={rows}
        style={{ width:"100%", boxSizing:"border-box", padding:"11px 14px",
          borderRadius:10, border:`1.5px solid ${T.border}`, background:T.bg,
          color:T.text, fontSize:13, fontFamily:"inherit", resize:"vertical",
          lineHeight:1.6, outline:"none" }} />
      <div style={{display:"flex", alignItems:"center", gap:8, marginTop:7}}>
        {supported ? (
          <button onClick={listening ? stop : start} style={{
            display:"flex", alignItems:"center", gap:7, padding:"6px 13px", borderRadius:8,
            background: listening ? "#ef4444" : T.subtle,
            border:`1.5px solid ${listening ? "#ef4444" : T.border}`,
            color: listening ? "#fff" : T.muted,
            fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
            <span>{listening ? "⏹" : "🎙"}</span>
            {listening ? <span style={{animation:"pulse 1s infinite"}}>Recording…</span> : "Speak"}
          </button>
        ) : (
          <span style={{fontSize:11, color:T.muted}}>🎙 Voice not available in this browser</span>
        )}
      </div>
    </div>
  );
}

function Stepper({ value, onChange, min = 0, max = 99 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", background:T.bg,
      borderRadius:9, border:`1.5px solid ${T.border}`, overflow:"hidden", width:"fit-content" }}>
      <button onClick={() => onChange(Math.max(min, value-1))}
        style={{ width:36, height:36, background:"none", border:"none", color:T.muted, fontSize:20, cursor:"pointer" }}>−</button>
      <input type="number" value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value)||0)))}
        style={{ width:40, textAlign:"center", background:"none", border:"none",
          color:T.text, fontSize:15, fontWeight:700, fontFamily:"inherit", outline:"none" }} />
      <button onClick={() => onChange(Math.min(max, value+1))}
        style={{ width:36, height:36, background:"none", border:"none", color:T.muted, fontSize:20, cursor:"pointer" }}>+</button>
    </div>
  );
}

function Section({ number, title, accent = T.accent, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}>
        <div style={{ width:22, height:22, borderRadius:"50%", background:accent,
          color:"#fff", fontSize:10, fontWeight:800,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{number}</div>
        <div style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:1.2 }}>{title}</div>
      </div>
      <div style={{ background:T.surface, borderRadius:12, border:`1.5px solid ${T.border}`, padding:"15px 17px" }}>
        {children}
      </div>
    </div>
  );
}

const lbl = { fontSize:11, color:T.muted, marginBottom:6, display:"block", textTransform:"uppercase", letterSpacing:0.8 };

function YesNo({ value, onChange, accent = T.accent }) {
  const btn = (opt) => ({
    padding:"8px 20px", borderRadius:8, fontWeight:700, fontSize:13,
    cursor:"pointer", fontFamily:"inherit",
    border:`1.5px solid ${value===opt ? accent : T.border}`,
    background: value===opt ? accent : "transparent",
    color: value===opt ? "#fff" : T.muted,
  });
  return (
    <div style={{ display:"flex", gap:8 }}>
      <button style={btn("yes")} onClick={() => onChange("yes")}>Yes</button>
      <button style={btn("no")} onClick={() => onChange("no")}>No</button>
    </div>
  );
}

function EquipGrid({ items, values, onChange, onSetAll }) {
  const [newItem, setNewItem] = useState("");
  const addItem = () => {
    if (!newItem.trim()) return;
    const key = "custom_" + Date.now();
    onSetAll(prev => ({...prev, [key]: {qty:1, days:1, label:newItem.trim()}}));
    setNewItem("");
  };
  const removeCustom = (key) => onSetAll(prev => { const n={...prev}; delete n[key]; return n; });

  const allItems = [
    ...items,
    ...Object.entries(values).filter(([k])=>k.startsWith("custom_")).map(([k,v])=>({key:k,label:v.label||k,defaultDays:1,custom:true}))
  ];

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 76px 76px 28px", gap:"6px 10px", alignItems:"center", marginBottom:4 }}>
        <div/><span style={{...lbl,marginBottom:0,textAlign:"center"}}>Qty</span><span style={{...lbl,marginBottom:0,textAlign:"center"}}>Days</span><div/>
      </div>
      {allItems.map(({key,label,defaultDays,custom})=>(
        <div key={key} style={{ display:"grid", gridTemplateColumns:"1fr 76px 76px 28px", gap:"6px 10px", alignItems:"center", marginBottom:8 }}>
          <span style={{fontSize:12,color:"#94a3b8"}}>{label}</span>
          <div style={{display:"flex",justifyContent:"center"}}>
            <Stepper value={values[key]?.qty??0} onChange={v=>onChange(key,"qty",v)}/>
          </div>
          <div style={{display:"flex",justifyContent:"center"}}>
            <Stepper value={values[key]?.days??defaultDays??1} onChange={v=>onChange(key,"days",v)}/>
          </div>
          {custom
            ? <button onClick={()=>removeCustom(key)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:16,padding:0}}>×</button>
            : <div/>}
        </div>
      ))}
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <input value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addItem()}
          placeholder="Add equipment…"
          style={{flex:1,padding:"7px 11px",borderRadius:8,border:`1.5px solid ${T.border}`,background:T.bg,color:T.text,fontSize:12,fontFamily:"inherit",outline:"none"}}/>
        <button onClick={addItem} style={{padding:"7px 14px",borderRadius:8,background:T.subtle,border:`1.5px solid ${T.border}`,color:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ Add</button>
      </div>
    </div>
  );
}

function GenBtn({ onClick, accent }) {
  return (
    <button onClick={onClick} style={{width:"100%",padding:"16px",borderRadius:12,marginTop:8,
      background:accent,border:"none",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
      Generate Scope of Work →
    </button>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// FORM COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

function MouldForm({ accent, onResult }) {
  const [areas,setAreas]=useState(""); const [otherTrades,setOtherTrades]=useState(null);
  const [tradesDetail,setTradesDetail]=useState(""); const [works,setWorks]=useState("");
  const [techs,setTechs]=useState(2); const [hours,setHours]=useState(10);
  const [equip,setEquip]=useState({dehum:{qty:1,days:5},scrubber:{qty:1,days:5},mover:{qty:2,days:5},hepa:{qty:1,days:1}});
  const [specCons,setSpecCons]=useState(null); const [consDetail,setConsDetail]=useState("");
  const [addReqs,setAddReqs]=useState("");
  const setE=(k,f,v)=>setEquip(p=>({...p,[k]:{...p[k],[f]:v}}));
  const EQUIP_DEF=[{key:"dehum",label:"Dehumidifier",defaultDays:5},{key:"scrubber",label:"Air Scrubber (AFD)",defaultDays:5},{key:"mover",label:"Air Mover / Fan",defaultDays:5},{key:"hepa",label:"HEPA Vacuum",defaultDays:1}];
  const CONS_STD=["Antimicrobial solution","Plastic sheeting","PPE","Filters / bags","Microfibre cloths","Containment doors","Multi-tool blades","Cloth tape / masking tape","Rags"];

  return (<div>
    <Section number={1} title="Areas / Rooms Affected" accent={accent}>
      <VoiceField value={areas} onChange={setAreas} placeholder="e.g. guest room, music room, hallway ceiling…"/>
    </Section>
    <Section number={2} title="Other Trades Required Prior to Works" accent={accent}>
      <span style={lbl}>Any trades needed before works begin?</span>
      <YesNo value={otherTrades} onChange={setOtherTrades} accent={accent}/>
      {otherTrades==="yes"&&<div style={{marginTop:10}}><VoiceField value={tradesDetail} onChange={setTradesDetail} placeholder="e.g. Electrician to isolate power outlets…" rows={2}/></div>}
    </Section>
    <Section number={3} title="Works Required" accent={accent}>
      <VoiceField value={works} onChange={setWorks} placeholder="Describe works to be carried out…" rows={4} templateKey="mould"/>
    </Section>
    <Section number={4} title="Labour" accent={accent}>
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Section>
    <Section number={5} title="Equipment" accent={accent}>
      <EquipGrid items={EQUIP_DEF} values={equip} onChange={setE} onSetAll={setEquip}/>
    </Section>
    <Section number={6} title="Consumables" accent={accent}>
      <span style={lbl}>Anything special beyond the standard kit?</span>
      <YesNo value={specCons} onChange={setSpecCons} accent={accent}/>
      {specCons==="yes"&&<div style={{marginTop:10}}><VoiceField value={consDetail} onChange={setConsDetail} placeholder="e.g. floor protection, containment poles…" rows={2}/></div>}
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:10}}>
        {CONS_STD.map(c=><span key={c} style={{fontSize:10,color:T.muted,background:T.bg,border:`1px solid ${T.border}`,borderRadius:5,padding:"2px 8px"}}>{c}</span>)}
      </div>
    </Section>
    <Section number={7} title="Additional Requirements" accent={accent}>
      <VoiceField value={addReqs} onChange={setAddReqs} placeholder="e.g. skip bin, off-site storage, truck access…" rows={2}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>
        {["Skip bin","Off-site storage","Truck access","Scaffolding","Pod / portable storage"].map(ex=><span key={ex} style={{fontSize:10,color:"#334155",background:T.bg,border:`1px dashed ${T.border}`,borderRadius:5,padding:"2px 8px"}}>e.g. {ex}</span>)}
      </div>
    </Section>
    <GenBtn onClick={()=>onResult(assembleMould({areas,otherTrades,tradesDetail,works,techs,hours,equip,specCons,consDetail,addReqs}))} accent={accent}/>
  </div>);
}

function ContentsForm({ accent, onResult }) {
  const [areas,setAreas]=useState(""); const [works,setWorks]=useState("");
  const [phases,setPhases]=useState({initial:{techs:3,hours:20},remediation:{techs:2,hours:8},reinstatement:{techs:3,hours:8},finalcheck:{techs:1,hours:2}});
  const [equip,setEquip]=useState({scrubber:{qty:1,days:1},hepa:{qty:2,days:1}});
  const [truckDays,setTruckDays]=useState(4); const [storageSize,setStorageSize]=useState(""); const [addReqs,setAddReqs]=useState("");
  const setP=(k,f,v)=>setPhases(p=>({...p,[k]:{...p[k],[f]:v}}));
  const setE=(k,f,v)=>setEquip(p=>({...p,[k]:{...p[k],[f]:v}}));
  const EQUIP_DEF=[{key:"scrubber",label:"Air Scrubber (AFD)",defaultDays:1},{key:"hepa",label:"HEPA Vacuum",defaultDays:1}];
  const PHASE_DEF=[{key:"initial",label:"Initial attendance — assessment & inventory"},{key:"remediation",label:"Remediation of restorable items"},{key:"reinstatement",label:"Reinstatement of contents"},{key:"finalcheck",label:"Final checks & confirmation"}];

  return (<div>
    <Section number={1} title="Areas / Rooms Affected" accent={accent}><VoiceField value={areas} onChange={setAreas} placeholder="e.g. entire property…"/></Section>
    <Section number={2} title="Works Required" accent={accent}><VoiceField value={works} onChange={setWorks} placeholder="Describe contents works…" rows={4} templateKey="contents"/></Section>
    <Section number={3} title="Labour by Phase" accent={accent}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {PHASE_DEF.map(p=>(
          <div key={p.key}>
            <span style={{...lbl,color:"#94a3b8",marginBottom:8}}>{p.label}</span>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              <div><span style={lbl}>Technicians</span><Stepper value={phases[p.key].techs} onChange={v=>setP(p.key,"techs",v)} min={1}/></div>
              <div><span style={lbl}>Hours</span><Stepper value={phases[p.key].hours} onChange={v=>setP(p.key,"hours",v)} min={1} max={200}/></div>
            </div>
          </div>
        ))}
      </div>
    </Section>
    <Section number={4} title="Equipment" accent={accent}><EquipGrid items={EQUIP_DEF} values={equip} onChange={setE} onSetAll={setEquip}/></Section>
    <Section number={5} title="Truck & Storage" accent={accent}>
      <div style={{marginBottom:14}}><span style={lbl}>Truck — days required</span><Stepper value={truckDays} onChange={setTruckDays} min={0}/></div>
      <span style={lbl}>Off-site storage capacity</span>
      <VoiceField value={storageSize} onChange={setStorageSize} placeholder="e.g. ≈ 20 m², large unit, half carriage…" rows={1}/>
    </Section>
    <Section number={6} title="Additional Requirements" accent={accent}><VoiceField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Section>
    <GenBtn onClick={()=>onResult(assembleContents({areas,works,phases,equip,truckDays,storageSize,addReqs}))} accent={accent}/>
  </div>);
}

function StripOutForm({ accent, onResult }) {
  const [areas,setAreas]=useState(""); const [elec,setElec]=useState(""); const [plumb,setPlumb]=useState(""); const [builder,setBuilder]=useState(""); const [other,setOther]=useState("");
  const [asbestos,setAsbestos]=useState(null); const [skipBin,setSkipBin]=useState(null); const [skipDetail,setSkipDetail]=useState("");
  const [works,setWorks]=useState(""); const [techs,setTechs]=useState(2); const [hours,setHours]=useState(20);
  const [equip,setEquip]=useState({scrubber:{qty:2,days:1},poles:{qty:4,days:1}});
  const [addReqs,setAddReqs]=useState("");
  const setE=(k,f,v)=>setEquip(p=>({...p,[k]:{...p[k],[f]:v}}));
  const EQUIP_DEF=[{key:"scrubber",label:"Air Scrubber (AFD)",defaultDays:1},{key:"poles",label:"Containment Poles",defaultDays:1}];

  return (<div>
    <Section number={1} title="Areas / Rooms Affected" accent={accent}><VoiceField value={areas} onChange={setAreas} placeholder="e.g. ground floor, entire property…"/></Section>
    <Section number={2} title="Other Trades Required" accent={accent}>
      <span style={lbl}>Electrician (leave blank if not needed)</span>
      <VoiceField value={elec} onChange={setElec} placeholder="e.g. Disconnect and make safe all electrical outlets below 1200mm…" rows={2}/>
      <span style={{...lbl,marginTop:10}}>Plumber</span>
      <VoiceField value={plumb} onChange={setPlumb} placeholder="e.g. Isolate, disconnect and make safe all plumbing below 1200mm…" rows={2}/>
      <span style={{...lbl,marginTop:10}}>Builder</span>
      <VoiceField value={builder} onChange={setBuilder} placeholder="e.g. Remove all fixed cabinetry below 1200mm…" rows={2}/>
      <span style={{...lbl,marginTop:10}}>Other</span>
      <VoiceField value={other} onChange={setOther} placeholder="Any other trades or requirements…" rows={2}/>
    </Section>
    <Section number={3} title="Asbestos" accent={accent}>
      <span style={lbl}>Asbestos clearance certificate required?</span>
      <YesNo value={asbestos} onChange={setAsbestos} accent={accent}/>
    </Section>
    <Section number={4} title="Skip Bin Required?" accent={accent}>
      <YesNo value={skipBin} onChange={setSkipBin} accent={accent}/>
      {skipBin==="yes"&&<div style={{marginTop:10}}><VoiceField value={skipDetail} onChange={setSkipDetail} placeholder="e.g. Medium skip bin for building materials…" rows={2}/></div>}
    </Section>
    <Section number={5} title="Works Required" accent={accent}><VoiceField value={works} onChange={setWorks} placeholder="Describe strip out works…" rows={4} templateKey="stripout"/></Section>
    <Section number={6} title="Labour" accent={accent}>
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Section>
    <Section number={7} title="Equipment" accent={accent}><EquipGrid items={EQUIP_DEF} values={equip} onChange={setE} onSetAll={setEquip}/></Section>
    <Section number={8} title="Additional Requirements" accent={accent}><VoiceField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Section>
    <GenBtn onClick={()=>onResult(assembleStripout({areas,elec,plumb,builder,other,asbestos,skipBin,skipDetail,works,techs,hours,equip,addReqs}))} accent={accent}/>
  </div>);
}

function FlooringForm({ accent, onResult }) {
  const [areas,setAreas]=useState(""); const [vacate,setVacate]=useState(null); const [works,setWorks]=useState("");
  const [techs,setTechs]=useState(2); const [hours,setHours]=useState(20);
  const [equip,setEquip]=useState({dehum:{qty:5,days:5},mover:{qty:8,days:5},hepa:{qty:1,days:1}});
  const [truck,setTruck]=useState(null); const [highCost,setHighCost]=useState(null); const [addReqs,setAddReqs]=useState("");
  const setE=(k,f,v)=>setEquip(p=>({...p,[k]:{...p[k],[f]:v}}));
  const EQUIP_DEF=[{key:"dehum",label:"Dehumidifier",defaultDays:5},{key:"mover",label:"Air Mover / Fan",defaultDays:5},{key:"hepa",label:"HEPA Vacuum",defaultDays:1}];

  return (<div>
    <Section number={1} title="Areas / Rooms Affected" accent={accent}><VoiceField value={areas} onChange={setAreas} placeholder="e.g. living area, entire ground floor…"/></Section>
    <Section number={2} title="Vacate Recommended?" accent={accent}>
      <span style={lbl}>Should the insured vacate during works?</span>
      <YesNo value={vacate} onChange={setVacate} accent={accent}/>
    </Section>
    <Section number={3} title="Works Required" accent={accent}><VoiceField value={works} onChange={setWorks} placeholder="Describe flooring works…" rows={4} templateKey="flooring"/></Section>
    <Section number={4} title="Labour" accent={accent}>
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Section>
    <Section number={5} title="Equipment" accent={accent}><EquipGrid items={EQUIP_DEF} values={equip} onChange={setE} onSetAll={setEquip}/></Section>
    <Section number={6} title="Truck & Disposal" accent={accent}>
      <span style={lbl}>Truck required?</span><YesNo value={truck} onChange={setTruck} accent={accent}/>
      <div style={{marginTop:12}}><span style={lbl}>High-cost disposal?</span><YesNo value={highCost} onChange={setHighCost} accent={accent}/></div>
    </Section>
    <Section number={7} title="Additional Requirements" accent={accent}><VoiceField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Section>
    <GenBtn onClick={()=>onResult(assembleFlooring({areas,vacate,works,techs,hours,equip,truck,highCost,addReqs}))} accent={accent}/>
  </div>);
}

function FloodForm({ accent, onResult }) {
  const [areas,setAreas]=useState(""); const [elec,setElec]=useState(""); const [plumb,setPlumb]=useState(""); const [builder,setBuilder]=useState("");
  const [w1,setW1]=useState(""); const [techs1,setTechs1]=useState(3); const [hours1,setHours1]=useState(12);
  const [equip1,setEquip1]=useState({truck:{qty:1,days:1},trolley:{qty:1,days:1},straps:{qty:1,days:1}});
  const [w2,setW2]=useState(""); const [techs2,setTechs2]=useState(3); const [hours2,setHours2]=useState(20);
  const [equip2,setEquip2]=useState({scrubber:{qty:4,days:2},hepa:{qty:1,days:1}});
  const [w3,setW3]=useState(""); const [techs3,setTechs3]=useState(2); const [hours3,setHours3]=useState(4);
  const [equip3,setEquip3]=useState({scrubber:{qty:4,days:1}});
  const [w4,setW4]=useState(""); const [techs4,setTechs4]=useState(2); const [hours4,setHours4]=useState(15);
  const [equip4,setEquip4]=useState({dehum:{qty:3,days:5},scrubber:{qty:3,days:1},mover:{qty:6,days:5},hepa:{qty:2,days:1}});
  const [storageSize,setStorageSize]=useState(""); const [addReqs,setAddReqs]=useState("");
  const setE1=(k,f,v)=>setEquip1(p=>({...p,[k]:{...p[k],[f]:v}}));
  const setE2=(k,f,v)=>setEquip2(p=>({...p,[k]:{...p[k],[f]:v}}));
  const setE3=(k,f,v)=>setEquip3(p=>({...p,[k]:{...p[k],[f]:v}}));
  const setE4=(k,f,v)=>setEquip4(p=>({...p,[k]:{...p[k],[f]:v}}));
  const EQUIP1_DEF=[{key:"truck",label:"Truck",defaultDays:1},{key:"trolley",label:"Trolley / Hand Trolley",defaultDays:1},{key:"straps",label:"Lifting Straps",defaultDays:1}];
  const EQUIP2_DEF=[{key:"scrubber",label:"Air Scrubber (AFD)",defaultDays:2},{key:"hepa",label:"HEPA Vacuum",defaultDays:1}];
  const EQUIP3_DEF=[{key:"scrubber",label:"Air Scrubber (AFD)",defaultDays:1}];
  const EQUIP4_DEF=[{key:"dehum",label:"Dehumidifier",defaultDays:5},{key:"scrubber",label:"Air Scrubber (AFD)",defaultDays:1},{key:"mover",label:"Air Mover / Fan",defaultDays:5},{key:"hepa",label:"HEPA Vacuum",defaultDays:1}];

  const PhaseCard = ({num,title,works,setWorks,tKey,techs,setTechs,hours,setHours,equipDef,equip,setE,setEquipFull})=>(
    <div style={{marginBottom:16,border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden"}}>
      <div style={{background:accent+"22",padding:"10px 16px",borderBottom:`1px solid ${T.border}`}}>
        <span style={{fontSize:12,fontWeight:700,color:accent}}>Phase {num} — {title}</span>
      </div>
      <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",gap:12}}>
        <div><span style={lbl}>Works</span><VoiceField value={works} onChange={setWorks} placeholder={`Describe phase ${num} works…`} rows={3} templateKey={tKey}/></div>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
          <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
        </div>
        <div><span style={lbl}>Equipment</span><EquipGrid items={equipDef} values={equip} onChange={setE} onSetAll={setEquipFull}/></div>
      </div>
    </div>
  );

  return (<div>
    <Section number={1} title="Areas / Rooms Affected" accent={accent}><VoiceField value={areas} onChange={setAreas} placeholder="e.g. entire ground floor, kitchen, living area…"/></Section>
    <Section number={2} title="Other Trades Required" accent={accent}>
      <span style={lbl}>Electrician</span><VoiceField value={elec} onChange={setElec} placeholder="e.g. Disconnect and make safe all electrical below 1200mm…" rows={2}/>
      <span style={{...lbl,marginTop:10}}>Plumber</span><VoiceField value={plumb} onChange={setPlumb} placeholder="e.g. Isolate and disconnect all plumbing below 1200mm…" rows={2}/>
      <span style={{...lbl,marginTop:10}}>Builder</span><VoiceField value={builder} onChange={setBuilder} placeholder="e.g. Remove all fixed cabinetry below 1200mm, strip out walls…" rows={2}/>
    </Section>
    <Section number={3} title="Phases" accent={accent}>
      <PhaseCard num={1} title="Relocation of Contents" works={w1} setWorks={setW1} tKey="flood_contents" techs={techs1} setTechs={setTechs1} hours={hours1} setHours={setHours1} equipDef={EQUIP1_DEF} equip={equip1} setE={setE1} setEquipFull={setEquip1}/>
      <PhaseCard num={2} title="Strip Out" works={w2} setWorks={setW2} tKey="flood_stripout" techs={techs2} setTechs={setTechs2} hours={hours2} setHours={setHours2} equipDef={EQUIP2_DEF} equip={equip2} setE={setE2} setEquipFull={setEquip2}/>
      <PhaseCard num={3} title="Site Preparation" works={w3} setWorks={setW3} tKey="flood_siteprep" techs={techs3} setTechs={setTechs3} hours={hours3} setHours={setHours3} equipDef={EQUIP3_DEF} equip={equip3} setE={setE3} setEquipFull={setEquip3}/>
      <PhaseCard num={4} title="Restoration Cleaning" works={w4} setWorks={setW4} tKey="flood_restoration" techs={techs4} setTechs={setTechs4} hours={hours4} setHours={setHours4} equipDef={EQUIP4_DEF} equip={equip4} setE={setE4} setEquipFull={setEquip4}/>
    </Section>
    <Section number={4} title="Off-Site Storage" accent={accent}><VoiceField value={storageSize} onChange={setStorageSize} placeholder="e.g. large unit, ≈ 20m², taxi box…" rows={1}/></Section>
    <Section number={5} title="Additional Requirements" accent={accent}><VoiceField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Section>
    <GenBtn onClick={()=>onResult(assembleFlood({areas,elec,plumb,builder,w1,techs1,hours1,equip1,w2,techs2,hours2,equip2,w3,techs3,hours3,equip3,w4,techs4,hours4,equip4,storageSize,addReqs}))} accent={accent}/>
  </div>);
}

function RestorationForm({ accent, onResult }) {
  const [areas,setAreas]=useState(""); const [works,setWorks]=useState("");
  const [techs,setTechs]=useState(2); const [hours,setHours]=useState(5);
  const [equip,setEquip]=useState({scrubber:{qty:2,days:1},hepa:{qty:1,days:1},fogging:{qty:0,days:1}});
  const [addReqs,setAddReqs]=useState("");
  const setE=(k,f,v)=>setEquip(p=>({...p,[k]:{...p[k],[f]:v}}));
  const EQUIP_DEF=[{key:"scrubber",label:"Air Scrubber (AFD)",defaultDays:1},{key:"hepa",label:"HEPA Vacuum",defaultDays:1},{key:"fogging",label:"Fogging Machine",defaultDays:1}];

  return (<div>
    <Section number={1} title="Areas / Rooms Affected" accent={accent}><VoiceField value={areas} onChange={setAreas} placeholder="e.g. master bedroom, bedroom 2, closet…"/></Section>
    <Section number={2} title="Works Required" accent={accent}><VoiceField value={works} onChange={setWorks} placeholder="Describe restoration cleaning works…" rows={4} templateKey="restoration"/></Section>
    <Section number={3} title="Labour" accent={accent}>
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Section>
    <Section number={4} title="Equipment" accent={accent}><EquipGrid items={EQUIP_DEF} values={equip} onChange={setE} onSetAll={setEquip}/></Section>
    <Section number={5} title="Additional Requirements" accent={accent}><VoiceField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Section>
    <GenBtn onClick={()=>onResult(assembleRestoration({areas,works,techs,hours,equip,addReqs}))} accent={accent}/>
  </div>);
}

function DryingForm({ accent, onResult }) {
  const [areas,setAreas]=useState(""); const [works,setWorks]=useState("");
  const [techs,setTechs]=useState(1); const [hours,setHours]=useState(5);
  const [equip,setEquip]=useState({dehum:{qty:1,days:5},mover:{qty:3,days:5}});
  const [addReqs,setAddReqs]=useState("");
  const setE=(k,f,v)=>setEquip(p=>({...p,[k]:{...p[k],[f]:v}}));
  const EQUIP_DEF=[{key:"dehum",label:"Dehumidifier",defaultDays:5},{key:"mover",label:"Air Mover / Fan",defaultDays:5}];

  return (<div>
    <Section number={1} title="Areas / Rooms Affected" accent={accent}><VoiceField value={areas} onChange={setAreas} placeholder="e.g. main bedroom, bedroom 2, hallway…"/></Section>
    <Section number={2} title="Works Required" accent={accent}><VoiceField value={works} onChange={setWorks} placeholder="Describe drying works…" rows={3} templateKey="drying"/></Section>
    <Section number={3} title="Labour" accent={accent}>
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div><span style={lbl}>Technicians</span><Stepper value={techs} onChange={setTechs} min={1}/></div>
        <div><span style={lbl}>Hours</span><Stepper value={hours} onChange={setHours} min={1} max={200}/></div>
      </div>
    </Section>
    <Section number={4} title="Equipment" accent={accent}><EquipGrid items={EQUIP_DEF} values={equip} onChange={setE} onSetAll={setEquip}/></Section>
    <Section number={5} title="Additional Requirements" accent={accent}><VoiceField value={addReqs} onChange={setAddReqs} placeholder="Anything else needed…" rows={2}/></Section>
    <GenBtn onClick={()=>onResult(assembleDrying({areas,works,techs,hours,equip,addReqs}))} accent={accent}/>
  </div>);
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen,setScreen]=useState("home");
  const [selectedType,setSelectedType]=useState(null);
  const [result,setResult]=useState("");
  const [copied,setCopied]=useState(false);

  const currentType=SOW_TYPES.find(t=>t.id===selectedType);
  const accent=currentType?.color??T.accent;

  const handleResult=(doc)=>{ setResult(doc); setScreen("result"); };
  const copy=()=>{ navigator.clipboard.writeText(result); setCopied(true); setTimeout(()=>setCopied(false),2500); };
  const reset=()=>{ setScreen("home"); setSelectedType(null); setResult(""); };

  const FORMS={
    mould:       <MouldForm       accent={accent} onResult={handleResult}/>,
    contents:    <ContentsForm    accent={accent} onResult={handleResult}/>,
    stripout:    <StripOutForm    accent={accent} onResult={handleResult}/>,
    flooring:    <FlooringForm    accent={accent} onResult={handleResult}/>,
    flood:       <FloodForm       accent={accent} onResult={handleResult}/>,
    restoration: <RestorationForm accent={accent} onResult={handleResult}/>,
    drying:      <DryingForm      accent={accent} onResult={handleResult}/>,
  };

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Mono','Courier New',monospace",color:T.text,paddingBottom:60}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        textarea:focus{border-color:#f97316 !important}
        button:active{opacity:0.8}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1c2530;border-radius:2px}
      `}</style>

      {/* HEADER */}
      <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"13px 18px",
        display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {screen!=="home"&&<button onClick={reset} style={{background:"none",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,padding:"5px 11px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>}
          <div>
            <div style={{fontSize:9,color:T.accent,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>Remediation Co.</div>
            <div style={{fontSize:16,fontWeight:500,color:T.text}}>{screen==="home"?"SOW Builder":currentType?`${currentType.icon} ${currentType.label}`:"SOW Builder"}</div>
          </div>
        </div>
        {screen==="result"&&<button onClick={copy} style={{padding:"7px 16px",borderRadius:8,border:"none",background:copied?"#16a34a":accent,color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{copied?"✓ Copied!":"Copy"}</button>}
      </div>

      <div style={{maxWidth:580,margin:"0 auto",padding:"20px 14px"}}>

        {screen==="home"&&(
          <div style={{animation:"fadein 0.3s ease"}}>
            <div style={{fontSize:12,color:T.muted,marginBottom:18,letterSpacing:0.5}}>Select the type of Scope of Work</div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {SOW_TYPES.map(t=>(
                <button key={t.id} onClick={()=>{setSelectedType(t.id);setScreen("form");}}
                  style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:12,
                    padding:"15px 17px",display:"flex",alignItems:"center",gap:13,
                    cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=t.color}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}>
                  <span style={{fontSize:24}}>{t.icon}</span>
                  <span style={{fontSize:14,fontWeight:600,color:T.text}}>{t.label}</span>
                  <span style={{marginLeft:"auto",color:T.muted,fontSize:16}}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {screen==="form"&&(
          <div style={{animation:"fadein 0.3s ease"}}>{FORMS[selectedType]}</div>
        )}

        {screen==="result"&&(
          <div style={{animation:"fadein 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text}}>SOW Ready ✓</div>
              <button onClick={reset} style={{background:"none",border:`1px solid ${T.border}`,color:T.muted,borderRadius:7,padding:"5px 11px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>New SOW</button>
            </div>
            <div style={{background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:12,
              padding:"17px 19px",whiteSpace:"pre-wrap",fontSize:13,lineHeight:1.85,
              color:"#cbd5e1",maxHeight:"62vh",overflowY:"auto"}}>
              {result}
            </div>
            <button onClick={copy} style={{width:"100%",marginTop:12,padding:"14px",borderRadius:12,
              background:copied?"#16a34a":accent,border:"none",
              color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit"}}>
              {copied?"✓ Copied to clipboard!":"Copy to clipboard"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
