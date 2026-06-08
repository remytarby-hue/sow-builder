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

const SOW_PROMPTS = {
  mould: `You are writing a professional Scope of Work document for a mould remediation company in Australia.
The technician has described the job verbally. Extract the key details and produce a complete SOW in this exact format:

SOW – Mould Remediation

Other trades required prior to commencement of works: [extract from notes, or "None"]

Room Name / Area: [extract areas from notes]

Works Required:
• [convert technician notes into clean professional bullet points — containment, removal, HEPA vac, sanitation, drying equipment, encapsulation etc.]

General Scope of Works
• Disposal of contaminated or non-restorable materials
• Transport of waste to approved disposal facility
• Cleaning and sanitising of tools and equipment after works
• Compile report of findings and works carried out for each attendance

Labour Breakdown
General summary of labour carried out onsite.
• Labour carried out during initial attendance
• Reassessment of affected areas during re-attendance
• Moisture readings and monitoring
• Adjustment, relocation, and removal of equipment
• Final checks and confirmation of completion
Total Labour Hours
• Technician hours: [X] Technicians x [Y] hours

Equipment Breakdown
[List equipment mentioned: Dehumidifiers, Air Scrubbers, Air Movers / Fans, HEPA Vacuumed — each with Quantity and Days used. Use sensible defaults if not specified: 5 days for drying equipment, 1 day for HEPA vac.]

Consumables Breakdown
List of consumables required.
• Antimicrobial solution
• Plastic sheeting
• PPE
• Filters / bags
• Microfibre cloths
• Containment doors
• Multi tools blade
• Cloth tape/masking tape
• Rags
[Add any extra consumables mentioned e.g. floor protection, containment poles]
[Add Additional Requirements section only if skip bin, truck, storage, scaffolding etc. were mentioned]

TECHNICIAN NOTES:`,

  contents: `You are writing a professional Scope of Work document for a remediation company in Australia.
The technician has described a contents job verbally. Produce a complete SOW in this exact format:

SOW – Contents

Room Name / Area: [extract from notes]

Works Required:
• [bullet points: assessment and inventory, removal for disposal, packing and relocation, HEPA vac + sanitation, reinstatement — based on notes]

General Scope of Works
• Transport of waste to approved disposal facility
• Cleaning and sanitising of tools and equipment after works
• Compile report of findings and works carried out for each attendance

Labour Breakdown
General summary of labour carried out onsite.
• Labour carried out during initial attendance - [X] techs x [Y] hours
• Remediation of restorable items - [X] techs x [Y] hours
• Reinstatement of contents - [X] techs x [Y] hours
• Final checks and confirmation of completion - [X] tech x [Y] hours

Equipment Breakdown
[Air Scrubbers, HEPA Vacuum — quantity and days from notes]

Consumables Breakdown
List of consumables required.
• Antimicrobial solution
• Filters / bags
• Microfibre cloths
• Moving supplies (boxes, tape, bubble wrap, blankets, shrink wrap, butcher paper, etc.)

Truck Required for [X] days:
• Relocation of contents
• Disposal of non-restorable items
• Reinstatement of contents

Off-site storage capacity required: [size from notes, or "To be confirmed"]
[Add Additional Requirements section only if other things were mentioned]

TECHNICIAN NOTES:`,

  stripout: `You are writing a professional Scope of Work document for a remediation company in Australia.
The technician has described a strip out job verbally. Produce a complete SOW in this exact format:

SOW – Strip Out

Other trades required prior to commencement of works:
[Extract any trades mentioned — Electrician, Plumber, Builder, Other. Include asbestos clearance if mentioned. If none, write "None"]

Room Name / Area: [extract from notes]

Works Required:
• [bullet points based on notes — strip out of walls up to 1200mm, removal of insulation etc.]

General Scope of Works
• Disposal of contaminated or non-restorable materials
• Transport of waste to approved disposal facility
• Cleaning and sanitising of tools and equipment after works
• Compile report of findings and works carried out for each attendance

Labour Breakdown
General summary of labour carried out onsite.
• Labour carried out during initial attendance
• Final checks and confirmation of completion
Total Labour Hours
• Technician hours: [X] Technicians x [Y] hours

Equipment Breakdown
[Air Scrubbers — quantity and days. Containment poles if mentioned.]

Consumables Breakdown
List of consumables required.
• Plastic sheeting
• PPE
• Filters / bags
• Containment doors
• Multi tools blade
• Blade
• Cloth tape/masking tape
• Rubbish bags
• Floor protection
[Add Additional Requirements if skip bin, truck etc. mentioned]

TECHNICIAN NOTES:`,

  flooring: `You are writing a professional Scope of Work document for a remediation company in Australia.
The technician has described a flooring removal job verbally. Produce a complete SOW in this exact format:

SOW – Flooring Removal

Room Name / Area: [extract from notes]
[If vacating was mentioned: "Contents currently on site may be temporarily relocated on-site for the duration of the flooring removal, in order to facilitate safe and efficient remediation works. However, we recommend that the insured vacate the property during this period, due to the potential disruption and health risks associated with the works."]

Works Required:
• [bullet points: removal of floor covering, HEPA vac + sanitation of subfloor, installation of drying equipment — based on notes]

General Scope of Works
• Disposal of contaminated or non-restorable materials
• Transport of waste to approved disposal facility
• Cleaning and sanitising of tools and equipment after works
• Compile report of findings and works carried out for each attendance

Labour Breakdown
General summary of labour carried out onsite.
• Labour carried out during initial attendance
• Reassessment of affected areas during re-attendance
• Moisture readings and monitoring
• Adjustment, relocation, and removal of equipment
• Final checks and confirmation of completion
Total Labour Hours
• Technician hours: [X] Technicians x [Y] hours

Equipment Breakdown
[Dehumidifiers, Air Movers / Fans, HEPA Vacuum — quantity and days from notes. Defaults: 5 dehums, 8 air movers for 5 days, 1 HEPA for 1 day if not specified]

Consumables Breakdown
List of consumables required.
• Antimicrobial solution
• PPE
• Filters / bags
• Microfibre cloths
• Blade
• Mop/Mop pad
• Cloth tape/masking tape
• Rags
[If truck or high-cost disposal mentioned, add that]
[Add Additional Requirements if other things mentioned]

TECHNICIAN NOTES:`,

  flood: `You are writing a professional multi-phase Scope of Work document for a remediation company in Australia.
The technician has described a flood remediation job verbally. Produce a complete SOW in this exact format with all phases:

SOW – Flood Remediation

Other trades required prior to commencement of works:
[Extract trades — Electrician, Plumber, Builder. Include standard language for each if mentioned. If none, write "None"]

Room Name / Area: [extract from notes]

**Preparation for Restoration Cleaning**

1 - Relocation of contents:
• All contents to be relocated. (Taxi box recommended)
• Some items may require cleaning during the relocation process.
• If an inventory is required, one full day will be allowed to complete it.
• A large storage unit is recommended to allow adequate space for storage and handling.
[Add storage size if mentioned]

Total Labour Hours
• Technician hours: [X] Technicians x [Y] hours

Equipment Breakdown
• Truck
• Trolley/Hand trolley
• Lifting straps

Consumables Breakdown
• Moving boxes ≈ 50
• Packing supplies (butcher paper, bubble wrap, packing tape, furniture blanket, Shrink wrap, etc.)
• Antimicrobial
• Rags

2 - Strip-Out:
• Strip-out of walls up to 1200mm, to expose all affected structural elements for proper cleaning and drying.
• Removal of all affected insulation.

Total Labour Hours
• Technician hours: [X] Technicians x [Y] hours

Equipment Breakdown
• Truck for disposal.
[Air Scrubbers and HEPA Vacuum — quantity and days]

Consumables Breakdown
• Plastic sheeting
• PPE
• Rubbish bags

3 - Site preparation for Restoration cleaning:
• Properly contain and protect items such as air conditioning units, and other fixtures to prevent contamination or damage during the cleaning process.
• Set up air filtration devices, HEPA air scrubbers, to ensure a clean and safe environment for the duration of the restoration works.

Total Labour Hours
• Technician hours: [X] Technicians x [Y] hours

Equipment Breakdown
[Air Scrubbers — quantity, duration of restoration cleaning]

**Restoration Cleaning**

Surface Preparation:
• Inspection to ensure all affected materials have been fully stripped out and nothing has been overlooked. This includes removal of nails, fixings, adhesives and residues, confirmation that all affected insulation has been removed, and that the area is clean, safe and ready for restoration cleaning.

HEPA Vacuuming:
• Perform thorough HEPA vacuuming of all exposed surfaces, including floors, walls, and timbers, to remove fine dust, mould spores, and other contaminants.

Sanitisation:
• Apply an industry-approved sanitising solution to all affected areas, combined with abrasive cleaning as needed, to thoroughly remove stubborn residues, mould, and potential microbial growth.

Cleaning of Windows, Tracks, and Fixtures:
• Thoroughly clean all windows, including glass panes and window tracks, to remove dirt, dust, and residues.
• Clean and sanitise fan blades, light fixtures, and other surfaces to ensure a dust-free and hygienic finish.

Drying Process:
• Install drying equipment to ensure all materials are thoroughly dried and prevent further damage.
• Monitor moisture levels throughout the drying process to ensure effective results.

Total Labour Hours
• Technician hours: [X] Technicians x [Y] hours

Equipment Breakdown
[Dehumidifiers, Air Scrubbers, Air Movers / Fans, HEPA Vacuum — quantity and days]

Consumables Breakdown
• Antimicrobial solution
• Plastic sheeting
• PPE
• Filters / bags
• Microfibre cloths
• Blade
• Cloth tape/masking tape
• Rags
• Rubbish bags
• Percide
• Mop pads
• Mop
• Hand brushes
• White vinegar

Final Inspection:
• Conduct a final walkthrough and moisture level check to confirm that the property has been properly cleaned, sanitised, and dried.
[Add Additional Requirements if other things mentioned]

TECHNICIAN NOTES:`,

  restoration: `You are writing a professional Scope of Work document for a remediation company in Australia.
The technician has described a restoration cleaning job verbally. Produce a complete SOW in this exact format:

SOW – Restoration Cleaning

Room Name / Area: [extract from notes]

Works Required:
• [bullet points based on notes — HEPA vac, sanitation, odour control, fogging etc.]

General Scope of Works
• Disposal of contaminated or non-restorable materials
• Transport of waste to approved disposal facility
• Cleaning and sanitising of tools and equipment after works
• Compile report of findings and works carried out for each attendance

Labour Breakdown
General summary of labour carried out onsite.
• Labour carried out during initial attendance
• Final checks and confirmation of completion
Total Labour Hours
• Technician hours: [X] Technicians x [Y] hours

Equipment Breakdown
[Air Scrubbers, HEPA Vacuum, Fogging Machine if mentioned — quantity and days]

Consumables Breakdown
List of consumables required.
• PPE
• Filters / bags
• Cloth tape/masking tape
• Rubbish bags
• Antimicrobial
• Odorx
[Add any extra consumables mentioned]
[Add Additional Requirements if other things mentioned]

TECHNICIAN NOTES:`,

  drying: `You are writing a professional Scope of Work document for a remediation company in Australia.
The technician has described a drying job verbally. Produce a complete SOW in this exact format:

SOW – Drying

Room Name / Area: [extract from notes]

Works Required:
• Sanitation
• Installation of drying equipment
[Add any other works mentioned]

General Scope of Works
• Compile report of findings and works carried out for each attendance

Labour Breakdown
General summary of labour carried out onsite.
• Labour carried out during initial attendance
• Reassessment of affected areas during re-attendance
• Moisture readings and monitoring
• Adjustment, relocation, and removal of equipment
• Final checks and confirmation of completion
Total Labour Hours
• Technician hours: [X] Technicians x [Y] hours

Equipment Breakdown
[Dehumidifiers, Air Movers / Fans — quantity and days. Default 5 days if not specified.]

Consumables Breakdown
List of consumables required.
• Antimicrobial solution
• PPE
• Filters / bags
• Microfibre cloths
• Rags
[Add Additional Requirements if other things mentioned]

TECHNICIAN NOTES:`,
};

// ── SPEECH HOOK ──────────────────────────────────────────────────────────────
function useSpeech(onResult, onInterim) {
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) setSupported(true);
  }, []);
  const start = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-AU";
    rec.interimResults = true;
    rec.continuous = true;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      if (final) onResult(final);
      if (onInterim) onInterim(interim);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  };
  const stop = () => { recRef.current?.stop(); setListening(false); };
  return { listening, supported, start, stop };
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedType, setSelectedType] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [result, setResult] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const currentType = SOW_TYPES.find(t => t.id === selectedType);
  const accent = currentType?.color ?? T.accent;

  const appendTranscript = (t) => setTranscript(prev => prev ? prev + " " + t : t);

  const { listening, supported, start, stop } = useSpeech(appendTranscript, setInterim);

  const generate = async () => {
    if (!transcript.trim()) { setError("Please describe the job first."); return; }
    setGenerating(true); setError("");
    const systemPrompt = SOW_PROMPTS[selectedType];
    const fullPrompt = systemPrompt + "\n\n" + transcript;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: fullPrompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") ?? "";
      if (!text) throw new Error("Empty response");
      setResult(text);
      setScreen("result");
    } catch (e) {
      setError("Generation failed — check your API key or try again.");
    } finally {
      setGenerating(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const reset = () => {
    setScreen("home"); setSelectedType(null);
    setTranscript(""); setInterim(""); setResult(""); setError("");
  };

  const selectType = (id) => {
    setSelectedType(id); setTranscript(""); setInterim(""); setError("");
    setScreen("speak");
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'DM Mono','Courier New',monospace", color:T.text, paddingBottom:60 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes ripple{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2.5);opacity:0}}
        button:active{opacity:0.8}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1c2530;border-radius:2px}
        textarea:focus{border-color:#f97316 !important;outline:none}
      `}</style>

      {/* HEADER */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"13px 18px",
        display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {screen !== "home" && (
            <button onClick={reset} style={{ background:"none", border:`1px solid ${T.border}`,
              color:T.muted, borderRadius:7, padding:"5px 11px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>← Back</button>
          )}
          <div>
            <div style={{ fontSize:9, color:T.accent, fontWeight:700, letterSpacing:3, textTransform:"uppercase" }}>Remediation Co.</div>
            <div style={{ fontSize:16, fontWeight:500, color:T.text }}>
              {screen === "home" ? "SOW Builder" : currentType ? `${currentType.icon} ${currentType.label}` : "SOW Builder"}
            </div>
          </div>
        </div>
        {screen === "result" && (
          <button onClick={copy} style={{ padding:"7px 16px", borderRadius:8, border:"none",
            background: copied ? "#16a34a" : accent, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        )}
      </div>

      <div style={{ maxWidth:580, margin:"0 auto", padding:"20px 14px" }}>

        {/* HOME — type selection */}
        {screen === "home" && (
          <div style={{ animation:"fadein 0.3s ease" }}>
            <div style={{ fontSize:12, color:T.muted, marginBottom:18, letterSpacing:0.5 }}>Select the type of Scope of Work</div>
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              {SOW_TYPES.map(t => (
                <button key={t.id} onClick={() => selectType(t.id)}
                  style={{ background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:12,
                    padding:"15px 17px", display:"flex", alignItems:"center", gap:13,
                    cursor:"pointer", textAlign:"left", fontFamily:"inherit", transition:"border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = t.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
                  <span style={{ fontSize:24 }}>{t.icon}</span>
                  <span style={{ fontSize:14, fontWeight:600, color:T.text }}>{t.label}</span>
                  <span style={{ marginLeft:"auto", color:T.muted, fontSize:16 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SPEAK SCREEN */}
        {screen === "speak" && (
          <div style={{ animation:"fadein 0.3s ease" }}>

            {/* Instructions */}
            <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"14px 16px", marginBottom:16 }}>
              <div style={{ fontSize:11, color:accent, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>How to use</div>
              <div style={{ fontSize:13, color:T.muted, lineHeight:1.7 }}>
                Describe the job in your own words — areas affected, works needed, trades required, labour, equipment, anything special. Speak naturally, the AI will structure it.
              </div>
              <div style={{ marginTop:10, fontSize:12, color:"#475569", fontStyle:"italic" }}>
                e.g. "Bedroom 1 and hallway, remove the ceiling, set up containment, HEPA vac and sanitation, two techs about ten hours, one dehum five days, two air movers five days, need a truck on site"
              </div>
            </div>

            {/* Big mic button */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"30px 0 20px" }}>
              <div style={{ position:"relative", marginBottom:20 }}>
                {listening && (
                  <div style={{ position:"absolute", inset:-8, borderRadius:"50%",
                    border:`2px solid ${accent}`, animation:"ripple 1.5s infinite" }}/>
                )}
                <button
                  onClick={listening ? stop : start}
                  style={{ width:90, height:90, borderRadius:"50%",
                    background: listening ? "#ef4444" : accent,
                    border:"none", fontSize:36, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow: listening ? "0 0 30px #ef444466" : `0 0 30px ${accent}44`,
                    transition:"all 0.2s" }}>
                  {listening ? "⏹" : "🎙"}
                </button>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color: listening ? "#ef4444" : T.muted }}>
                {listening ? <span style={{animation:"pulse 1s infinite"}}>● Recording — tap to stop</span> : supported ? "Tap to speak" : "Voice not available — type below"}
              </div>
            </div>

            {/* Live transcript */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:T.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>
                {transcript || interim ? "Transcript" : ""}
              </div>
              <textarea
                value={transcript + (interim ? " " + interim : "")}
                onChange={e => setTranscript(e.target.value)}
                placeholder="Your description will appear here as you speak, or type directly…"
                rows={6}
                style={{ width:"100%", boxSizing:"border-box", padding:"12px 14px",
                  borderRadius:10, border:`1.5px solid ${T.border}`, background:T.surface,
                  color: interim ? T.muted : T.text, fontSize:13, fontFamily:"inherit",
                  resize:"vertical", lineHeight:1.7 }}
              />
              {transcript && (
                <button onClick={() => { setTranscript(""); setInterim(""); }}
                  style={{ marginTop:6, background:"none", border:"none", color:T.muted, fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
                  × Clear
                </button>
              )}
            </div>

            {error && (
              <div style={{ background:"#2d1515", border:"1px solid #ef4444", borderRadius:10,
                padding:"11px 15px", color:"#ef4444", fontSize:12, marginBottom:14 }}>{error}</div>
            )}

            {/* Generate button */}
            <button onClick={generate} disabled={generating || !transcript.trim()}
              style={{ width:"100%", padding:"16px", borderRadius:12,
                background: generating || !transcript.trim() ? "#1a2530" : accent,
                border:"none", color: generating || !transcript.trim() ? T.muted : "#fff",
                fontSize:15, fontWeight:700, cursor: generating || !transcript.trim() ? "not-allowed" : "pointer",
                fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              {generating ? (
                <><span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>⚙️</span> Generating…</>
              ) : "Generate Scope of Work →"}
            </button>
          </div>
        )}

        {/* RESULT */}
        {screen === "result" && (
          <div style={{ animation:"fadein 0.3s ease" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:13 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.text }}>SOW Ready ✓</div>
              <button onClick={reset} style={{ background:"none", border:`1px solid ${T.border}`,
                color:T.muted, borderRadius:7, padding:"5px 11px", fontSize:11, cursor:"pointer", fontFamily:"inherit" }}>
                New SOW
              </button>
            </div>
            <div style={{ background:T.surface, border:`1.5px solid ${T.border}`, borderRadius:12,
              padding:"17px 19px", whiteSpace:"pre-wrap", fontSize:13, lineHeight:1.85,
              color:"#cbd5e1", maxHeight:"62vh", overflowY:"auto" }}>
              {result}
            </div>
            <button onClick={copy} style={{ width:"100%", marginTop:12, padding:"14px", borderRadius:12,
              background: copied ? "#16a34a" : accent, border:"none",
              color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>
              {copied ? "✓ Copied to clipboard!" : "Copy to clipboard"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
