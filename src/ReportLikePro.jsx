import { useState } from "react";

const C = { bg:"#f5f6f5", white:"#ffffff", green:"#5a9a3a", greenDark:"#3d6b27", greenLight:"#eaf3e5", border:"#d4e4cb", text:"#1a2e12", muted:"#6b8560", subtle:"#f0f7ec", red:"#c0392b" };

const CATEGORIES = [
  {
    id: "initial_inspection",
    label: "Initial Inspection",
    icon: "🔍",
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
    icon: "🔧",
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
    icon: "🛡️",
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
    icon: "☣️",
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
    icon: "📦",
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
    icon: "📊",
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
    icon: "🔥",
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
    icon: "🧹",
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
    icon: "⚠️",
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
    icon: "📋",
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
    icon: "🏠",
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
    navigator.clipboard.writeText(phrases.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const switchCategory = (catId) => {
    setActiveCategory(catId);
    setCopied(false);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Segoe UI',Arial,sans-serif",color:C.text,paddingBottom:100}}>
      <style>{`
        @keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideup{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        button:active{opacity:0.85}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#d4e4cb;border-radius:2px}
      `}</style>

      {/* HEADER */}
      <div style={{background:C.white,borderBottom:"2px solid "+C.green,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10,boxShadow:"0 2px 8px rgba(90,154,58,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {onBack&&<button onClick={onBack} style={{background:C.greenLight,border:"1.5px solid "+C.border,color:C.green,borderRadius:8,padding:"6px 13px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>← Home</button>}
          <div>
            <div style={{fontSize:10,color:C.green,fontWeight:800,letterSpacing:2,textTransform:"uppercase"}}>Major Industries</div>
            <div style={{fontSize:17,fontWeight:700,color:C.text}}>Report Like a Pro</div>
          </div>
        </div>
        <div style={{fontSize:11,color:C.muted,fontWeight:600}}>Select + Copy All</div>
      </div>

      {/* CATEGORY TABS */}
      <div style={{background:C.white,borderBottom:"1px solid "+C.border,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        <div style={{display:"flex",gap:0,padding:"0 8px",minWidth:"max-content"}}>
          {CATEGORIES.map(cat => {
            const countInCat = Object.keys(selected).filter(k => k.startsWith(cat.id + "|")).length;
            return (
              <button
                key={cat.id}
                onClick={() => switchCategory(cat.id)}
                style={{
                  background:"transparent",
                  border:"none",
                  borderBottom: activeCategory===cat.id ? "3px solid "+C.green : "3px solid transparent",
                  color: activeCategory===cat.id ? C.green : C.muted,
                  padding:"12px 14px",
                  fontSize:12,
                  fontWeight: activeCategory===cat.id ? 700 : 500,
                  cursor:"pointer",
                  fontFamily:"inherit",
                  whiteSpace:"nowrap",
                  transition:"color 0.15s,border-color 0.15s",
                  position:"relative",
                }}
              >
                {cat.icon} {cat.label}
                {countInCat > 0 && (
                  <span style={{marginLeft:5,background:C.green,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,fontWeight:800}}>{countInCat}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* PHRASES */}
      <div style={{maxWidth:700,margin:"0 auto",padding:"16px 16px 20px",animation:"fadein 0.25s ease"}}>
        {/* Select all / clear row */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontSize:13,color:C.muted,fontWeight:500}}>
            {selectedCount > 0 ? <span style={{color:C.green,fontWeight:700}}>{selectedCount} selected</span> : `${category.phrases.length} phrases`}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={selectAll} style={{background:C.greenLight,border:"1px solid "+C.border,color:C.greenDark,borderRadius:7,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Select all</button>
            {selectedCount > 0 && <button onClick={clearAll} style={{background:"#fff0f0",border:"1px solid #f5c6c6",color:C.red,borderRadius:7,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Clear</button>}
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {category.phrases.map((phrase, idx) => {
            const key = activeCategory + "|" + idx;
            const isSelected = !!selected[key];
            return (
              <button
                key={idx}
                onClick={() => togglePhrase(activeCategory, idx)}
                style={{
                  background: isSelected ? C.greenLight : C.white,
                  border: "1.5px solid " + (isSelected ? C.green : C.border),
                  borderRadius:12,
                  padding:"14px 16px",
                  textAlign:"left",
                  cursor:"pointer",
                  fontFamily:"inherit",
                  fontSize:14,
                  lineHeight:1.5,
                  color: C.text,
                  display:"flex",
                  alignItems:"flex-start",
                  gap:12,
                  boxShadow: isSelected ? "0 2px 8px rgba(90,154,58,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
                  transition:"background 0.12s,border-color 0.12s,box-shadow 0.12s",
                }}
              >
                <span style={{
                  width:20,height:20,minWidth:20,borderRadius:6,
                  border:"2px solid "+(isSelected ? C.green : C.border),
                  background: isSelected ? C.green : "#fff",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  marginTop:1,
                  transition:"background 0.12s,border-color 0.12s",
                }}>
                  {isSelected && <span style={{color:"#fff",fontSize:12,fontWeight:900,lineHeight:1}}>✓</span>}
                </span>
                <span style={{flex:1}}>{phrase}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* COPY ALL BUTTON — sticky bottom */}
      {selectedCount > 0 && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,padding:"12px 16px",background:C.white,borderTop:"2px solid "+C.border,zIndex:20,animation:"slideup 0.2s ease"}}>
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <button
              onClick={copySelected}
              style={{
                width:"100%",
                padding:"15px",
                borderRadius:12,
                border:"none",
                background: copied ? "#27ae60" : C.green,
                color:"#fff",
                fontWeight:800,
                fontSize:15,
                cursor:"pointer",
                fontFamily:"inherit",
                transition:"background 0.2s",
              }}
            >
              {copied ? `✓ Copied! (${selectedCount} phrase${selectedCount>1?"s":""})` : `Copy ${selectedCount} phrase${selectedCount>1?"s":""} to clipboard`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
