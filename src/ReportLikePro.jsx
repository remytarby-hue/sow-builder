import { useState } from "react";

const C = { bg:"#0f0f0f", white:"#1a1a1a", green:"#5a9a3a", greenDark:"#3d6b27", greenLight:"#1e3014", border:"#2a2a2a", text:"#f0f0f0", muted:"#888888", red:"#e05252" };

const CAT_ICONS = {
  initial_inspection: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  general_restoration: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  mould_make_safe: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  mould_remediation: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  contents_inventory: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  follow_up_monitoring: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  fire_remediation: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  builders_clean: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  sewage: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  recommendations: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  prv_cleaning: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
};

const CATEGORIES = [
  {
    id: "initial_inspection",
    label: "Initial Inspection",
    icon: null,
    phrases: [
      "Undertook a walkthrough safety inspection throughout all areas of the property.",
      "Full walkthrough inspection of the property to assess areas of damage.",
      "Identified areas of damage and liaised with the insured.",
      "Recorded room dimensions and documented affected areas.",
      "Collected moisture readings from affected areas.",
      "Inspection of the ceiling cavity to assess extent of damage.",
      "Completed photographic documentation of all affected areas.",
      "Assessed structural integrity of the affected areas prior to commencing works.",
    ]
  },
  {
    id: "general_restoration",
    label: "General Restoration",
    icon: null,
    phrases: [
      "Relocation of contents for the duration of work.",
      "Uplift, removal and disposal of the affected carpet, underlay and smooth edging.",
      "Uplift, removal and disposal of the affected [flooring type / wall type / material].",
      "Removal of water damaged skirting boards.",
      "Removal of mould affected skirting boards.",
      "Access holes drilled in the affected kickboards to inspect and facilitate drying.",
      "HEPA vacuum of all surfaces within the affected area.",
      "Application of antimicrobial to all affected surfaces.",
      "Installation of mechanical drying equipment to bring moisture levels back to normal.",
      "Installation of a dehumidifier with ducting connected to the wall cavity to assist with drying.",
      "Removal of all mechanical drying equipment following dry moisture readings.",
      "Completed final walkthrough and confirmed moisture levels within dry standard.",
    ]
  },
  {
    id: "mould_make_safe",
    label: "Mould Make Safe",
    icon: null,
    phrases: [
      "Installation of Air Filtration Device (HEPA) to stabilise the environment.",
      "HEPA vacuum of all surfaces within the affected area.",
      "Application of antimicrobial to all affected surfaces.",
      "Application of antimicrobial to all affected surfaces to include abrasive cleaning.",
      "Containment of the affected areas.",
      "Installation of dehumidifier in mitigation.",
      "Visible microbial activity was identified in the ceiling cavity. All affected areas within the property were HEPA vacuumed, sanitised, and contained to prevent further mould propagation. All moisture levels were within the dry standard at the time of our assessment.",
      "Completed assessment of the affected areas. Moisture levels were within the dry standard. No further drying equipment required at this stage.",
    ]
  },
  {
    id: "mould_remediation",
    label: "Mould Remediation",
    icon: null,
    phrases: [
      "Containment of contents for the duration of mould remediation works.",
      "Containment walls erected to isolate the affected area.",
      "Installation of zip doors to isolate affected room(s).",
      "Installation of Air Filtration Device (HEPA) to stabilise the environment.",
      "Uplift, removal and disposal of [contaminated materials] affected by microbial activity.",
      "HEPA vacuum of all surfaces within the affected area: plasterboard walls / plasterboard ceilings / timber framing / concrete subfloor.",
      "Application of antimicrobial to all affected surfaces.",
      "Application of antimicrobial to all affected surfaces to include abrasive cleaning.",
      "Installation of mechanical drying equipment to bring moisture levels back to normal.",
      "Encapsulation of affected timber framing.",
      "Encapsulation of back of affected plasterboard.",
      "Removal of Air Filtration Device (HEPA) on completion of works.",
      "Removal of all mechanical drying equipment following dry moisture readings.",
      "Completed final walkthrough and confirmed moisture levels within dry standard.",
    ]
  },
  {
    id: "contents_inventory",
    label: "Contents Inventory",
    icon: null,
    phrases: [
      "Commencement of assessment of affected contents.",
      "Restorable items treated with antimicrobial to prevent mould growth and contamination.",
      "Non-restorable (mould affected / water damaged) contents added to an inventory.",
      "All electronic devices were tested and tagged to ensure their safety and functionality.",
      "Photographic documentation completed for all assessed items.",
      "Removal and disposal of non-restorable contents (if approved).",
      "Completed final walkthrough and contents assessment.",
    ]
  },
  {
    id: "follow_up_monitoring",
    label: "Follow-up / Monitoring",
    icon: null,
    phrases: [
      "Re-assessment of moisture levels in the affected areas.",
      "Check the correct function of mechanical drying equipment.",
      "Reposition mechanical drying equipment to increase drying efficiency.",
      "Repositioned mechanical drying equipment to increase drying efficiency.",
      "Partially removed mechanical drying equipment.",
      "Removal of all mechanical drying equipment following dry moisture readings.",
      "Moisture levels have improved but remain elevated. Continued monitoring required.",
      "Moisture levels are within the dry standard. No further drying required.",
      "Collect surface swab sample for testing. Results confirmed within acceptable threshold.",
    ]
  },
  {
    id: "fire_remediation",
    label: "Fire Remediation",
    icon: null,
    phrases: [
      "Installation of Air Filtration Devices (HEPA) to stabilise the environment.",
      "Cleaning and wet washing of affected areas including walls and ceilings.",
      "Chemical fogging of affected areas including ceiling cavity and ceiling joists.",
      "Remediation of all affected areas by the use of smoke sponges, HEPA vacuuming and application of fire cleaning chemicals.",
      "Remediation of contents by the use of smoke sponges, HEPA vacuuming and application of fire cleaning chemicals.",
      "Installation of mechanical drying equipment to bring moisture levels back to normal.",
      "Removal of Air Filtration Devices (HEPA) on completion of works.",
      "Removal of all mechanical drying equipment following dry moisture readings.",
      "Completed final walkthrough and confirmed remediation works are complete.",
    ]
  },
  {
    id: "builders_clean",
    label: "Builder's Clean",
    icon: null,
    phrases: [
      "Removal of dust, dirt, and debris from all surfaces including floors, walls, ceilings, and windows.",
      "Cleaning and sanitising all fixtures including sinks, toilets, showers, and countertops.",
      "Cleaning and sanitising of all appliances including the stove, oven, refrigerator, and dishwasher.",
      "Cleaning and sanitising of exterior surfaces such as patios, decks, and balconies.",
      "Vacuuming and mopping all flooring.",
      "Cleaning of all mirrors and glass surfaces.",
      "Removal and disposal of all general waste following completion of works.",
      "Completed final walkthrough.",
    ]
  },
  {
    id: "sewage",
    label: "Sewage Jobs",
    icon: null,
    phrases: [
      "Containment of contents for the duration of works.",
      "Containment walls erected to isolate the affected area.",
      "Installation of zip doors to isolate affected room(s).",
      "Installation of Air Filtration Device (HEPA) to stabilise the environment.",
      "Uplift, removal and disposal of [contaminated materials] affected by sewage contamination.",
      "HEPA vacuum of all surfaces within the affected area: plasterboard walls / plasterboard ceilings / timber framing / concrete subfloor.",
      "Application of antimicrobial to all affected surfaces.",
      "Cleaning and sanitising all affected surfaces using approved antimicrobial agents to eliminate pathogens and contaminants.",
      "Installation of mechanical drying equipment to bring moisture levels back to normal.",
      "Removal of all mechanical drying equipment following dry moisture readings.",
      "Completed final walkthrough and confirmed area is safe and sanitised.",
    ]
  },
  {
    id: "recommendations",
    label: "Recommendations",
    icon: null,
    phrases: [
      "Recommended removal of the affected section of the flooring and assessment and remediation of subfloor.",
      "Further works by Major Industries Restoration: Re-assessment of moisture levels in the affected areas. Check the correct function of mechanical drying equipment. Reposition / Removal of all mechanical drying equipment.",
      "Further trades recommended: Remove the cabinetry to provide access to sanitise flooring and assess wall.",
      "Recommended removal of the affected section of the walls and remediation of the cavity.",
      "Recommended pressure washing of the concrete floor.",
      "We recommend the removal of the built-in cabinetry and the affected walls, from ceiling to floor, to allow proper access for mould remediation and structural drying. This will ensure that all contaminated or damaged materials within the cavity can be fully accessed and treated.",
      "Remediation of the cavity following strip-out, including HEPA vacuuming, mould treatment, and structural drying as required.",
      "It is recommended that a qualified builder be engaged to carry out the reinstatement works following completion of our scope.",
    ]
  },
  {
    id: "prv_cleaning",
    label: "PRV Cleaning",
    icon: null,
    phrases: [
      "Strip-out of the walls up to 600mm to expose all affected structural elements for proper cleaning and drying.",
      "Remove all glue, nails, and any remaining debris from exposed surfaces.",
      "HEPA vacuuming of all exposed surfaces including floors, walls, and timbers to remove fine dust, mould spores, and other contaminants.",
      "Apply a sanitising solution to all affected areas, combined with abrasive cleaning as needed, to thoroughly remove stubborn residues, mould, and potential microbial growth.",
      "Thoroughly clean all windows including glass panes and window tracks to remove dirt, dust, and residues.",
      "Clean and sanitise fan blades, light fixtures, and other surfaces to ensure a dust-free and hygienic finish.",
      "Inspect and wipe down all other fixtures and fittings to complete the cleaning process.",
      "Installation of drying equipment to ensure all materials are thoroughly dried and prevent further damage.",
      "Monitor moisture levels throughout the drying process to ensure effective results.",
      "Conduct a final walkthrough and moisture level check to confirm that the property has been properly cleaned, sanitised, and dried.",
    ]
  },
];

export default function ReportLikePro({ onBack }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [selected, setSelected] = useState({});
  const [copied, setCopied] = useState(false);

  const category = CATEGORIES.find(c => c.id === activeCategory);
  const selectedInCategory = Object.keys(selected).filter(k => k.startsWith(activeCategory + "|"));
  const selectedCount = selectedInCategory.length;

  const togglePhrase = (catId, idx) => {
    const key = catId + "|" + idx;
    setSelected(prev => {
      const next = {...prev};
      if (next[key]) delete next[key];
      else next[key] = CATEGORIES.find(c => c.id === catId).phrases[idx];
      return next;
    });
  };

  const selectAll = () => {
    const next = {...selected};
    category.phrases.forEach((phrase, idx) => {
      next[activeCategory + "|" + idx] = phrase;
    });
    setSelected(next);
  };

  const clearAll = () => {
    const next = {...selected};
    category.phrases.forEach((_, idx) => {
      delete next[activeCategory + "|" + idx];
    });
    setSelected(next);
  };

  const copySelected = () => {
    const phrases = selectedInCategory
      .sort((a, b) => {
        const ia = parseInt(a.split("|")[1]);
        const ib = parseInt(b.split("|")[1]);
        return ia - ib;
      })
      .map(k => selected[k]);
    navigator.clipboard.writeText(phrases.map(p => "• " + p).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const switchCategory = (catId) => {
    setActiveCategory(catId);
    setCopied(false);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Segoe UI',Arial,sans-serif",color:C.text,paddingBottom:140}}>
      <style>{`
        @keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        button:active{opacity:0.85}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#d4e4cb;border-radius:2px}
      `}</style>

      {/* HEADER */}
      <div style={{background:"#0f0f0f",borderBottom:"1px solid #1e1e1e",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <img src="/logo.svg" alt="" style={{width:28,height:28,objectFit:"contain"}} />
          <div>
            <div style={{fontSize:9,color:C.green,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Major Industries</div>
            <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>Report Like a Pro</div>
          </div>
        </div>
        <div style={{fontSize:11,color:C.muted,fontWeight:500}}>Select + Copy</div>
      </div>

      {/* CATEGORY CHIPS */}
      <div style={{background:"#0f0f0f",borderBottom:"1px solid #1e1e1e",overflowX:"auto",WebkitOverflowScrolling:"touch",padding:"12px 16px"}}>
        <div style={{display:"flex",gap:8,minWidth:"max-content"}}>
          {CATEGORIES.map(cat => {
            const active = activeCategory===cat.id;
            const countInCat = Object.keys(selected).filter(k => k.startsWith(cat.id + "|")).length;
            return (
              <button key={cat.id} onClick={() => switchCategory(cat.id)}
                style={{background: active ? C.green : "#1a1a1a", border:"1px solid "+(active ? C.green : "#2a2a2a"), color: active ? "#fff" : C.muted, borderRadius:99, padding:"7px 14px", fontSize:12, fontWeight: active ? 700 : 500, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6, transition:"all 0.15s"}}>
                <span style={{color: active ? "#fff" : "#555", display:"flex", alignItems:"center"}}>{CAT_ICONS[cat.id]}</span>
                {cat.label}
                {countInCat > 0 && <span style={{background: active ? "rgba(255,255,255,0.3)" : C.green, color:"#fff", borderRadius:99, padding:"0 6px", fontSize:10, fontWeight:800}}>{countInCat}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* PHRASES */}
      <div style={{padding:"16px 16px 20px",animation:"fadein 0.25s ease"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontSize:12,color:C.muted}}>
            {selectedCount > 0 ? <span style={{color:C.green,fontWeight:700}}>{selectedCount} selected</span> : `${category.phrases.length} phrases`}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={selectAll} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#ccc",borderRadius:99,padding:"5px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Select all</button>
            {selectedCount > 0 && <button onClick={clearAll} style={{background:"#2a1010",border:"1px solid #4a2020",color:C.red,borderRadius:99,padding:"5px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Clear</button>}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {category.phrases.map((phrase, idx) => {
            const key = activeCategory + "|" + idx;
            const isSelected = !!selected[key];
            return (
              <button key={idx} onClick={() => togglePhrase(activeCategory, idx)}
                style={{background: isSelected ? "#1e3014" : "#1a1a1a", border:"1px solid "+(isSelected ? C.green : "#2a2a2a"), borderRadius:14, padding:"14px 16px", textAlign:"left", cursor:"pointer", fontFamily:"inherit", fontSize:14, lineHeight:1.6, color: isSelected ? "#e0f0d8" : "#ccc", display:"flex", alignItems:"flex-start", gap:12, transition:"all 0.12s"}}>
                <span style={{width:20,height:20,minWidth:20,borderRadius:6, border:"2px solid "+(isSelected ? C.green : "#333"), background: isSelected ? C.green : "transparent", display:"flex",alignItems:"center",justifyContent:"center", marginTop:2, flexShrink:0, transition:"all 0.12s"}}>
                  {isSelected && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </span>
                <span style={{flex:1}}>{phrase}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* COPY ALL — sticky bottom */}
      {selectedCount > 0 && (
        <div style={{position:"fixed",bottom:68,left:0,right:0,padding:"10px 16px",background:"rgba(15,15,15,0.95)",borderTop:"1px solid #222",zIndex:20,animation:"slideup 0.2s ease",backdropFilter:"blur(10px)"}}>
          <button onClick={copySelected}
            style={{width:"100%",padding:"16px",borderRadius:99,border:"none",background: copied ? "#27ae60" : C.green,color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit",transition:"background 0.2s"}}>
            {copied ? `Copied! (${selectedCount} phrase${selectedCount>1?"s":""})` : `Copy ${selectedCount} phrase${selectedCount>1?"s":""} to clipboard`}
          </button>
        </div>
      )}
    </div>
  );
}
