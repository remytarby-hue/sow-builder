import { useState } from "react";
import SOWBuilder from "./SOWBuilder";
import ReportLikePro from "./ReportLikePro";

const C = { bg:"#f5f6f5", white:"#ffffff", green:"#5a9a3a", greenDark:"#3d6b27", greenLight:"#eaf3e5", border:"#d4e4cb", text:"#1a2e12", muted:"#6b8560", subtle:"#f0f7ec" };

const TOOLS = [
  {
    id: "sow",
    icon: "📋",
    title: "SOW Builder",
    subtitle: "Scope of Work Generator",
    description: "Generate a complete Scope of Work for any job type — water, mould, fire, contents, drying and more.",
    tags: ["Water", "Mould", "Fire", "Drying", "Contents"],
  },
  {
    id: "report",
    icon: "✍️",
    title: "Report Like a Pro",
    subtitle: "Phrase Library",
    description: "Tap any phrase to copy it instantly. All the sentences you need to write a proper job report, organised by category.",
    tags: ["Inspection", "Mould", "Fire", "Contents", "Recommendations"],
  },
];

export default function App() {
  const [screen, setScreen] = useState("home");

  if (screen === "sow") return <SOWBuilder onBack={() => setScreen("home")} />;
  if (screen === "report") return <ReportLikePro onBack={() => setScreen("home")} />;

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Segoe UI',Arial,sans-serif",color:C.text}}>
      <style>{`
        @keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        button:active{opacity:0.85}
      `}</style>

      {/* HEADER */}
      <div style={{background:C.white,borderBottom:"2px solid "+C.green,padding:"20px 20px 16px",textAlign:"center",boxShadow:"0 2px 8px rgba(90,154,58,0.08)"}}>
        <div style={{fontSize:11,color:C.green,fontWeight:800,letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>Major Industries</div>
        <div style={{fontSize:24,fontWeight:800,color:C.text,letterSpacing:-0.5}}>Restorer Assistant</div>
        <div style={{fontSize:13,color:C.muted,marginTop:4,fontWeight:500}}>Your toolkit for faster, better documentation</div>
      </div>

      {/* TOOL CARDS */}
      <div style={{maxWidth:600,margin:"0 auto",padding:"28px 16px",display:"flex",flexDirection:"column",gap:16,animation:"fadein 0.3s ease"}}>
        {TOOLS.map(tool => (
          <button
            key={tool.id}
            onClick={() => setScreen(tool.id)}
            style={{
              background:C.white,
              border:"2px solid "+C.border,
              borderRadius:16,
              padding:"22px 20px",
              textAlign:"left",
              cursor:"pointer",
              fontFamily:"inherit",
              boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
              transition:"border-color 0.15s,box-shadow 0.15s,transform 0.1s",
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.green;e.currentTarget.style.boxShadow="0 4px 16px rgba(90,154,58,0.18)";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.05)";e.currentTarget.style.transform="translateY(0)";}}
          >
            <div style={{display:"flex",alignItems:"flex-start",gap:16}}>
              <div style={{fontSize:36,lineHeight:1}}>{tool.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:19,fontWeight:800,color:C.text,marginBottom:2}}>{tool.title}</div>
                <div style={{fontSize:11,color:C.green,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>{tool.subtitle}</div>
                <div style={{fontSize:14,color:C.muted,lineHeight:1.55,marginBottom:14}}>{tool.description}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {tool.tags.map(tag=>(
                    <span key={tag} style={{background:C.greenLight,color:C.greenDark,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,border:"1px solid "+C.border}}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{color:C.green,fontSize:20,alignSelf:"center"}}>›</div>
            </div>
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{textAlign:"center",padding:"10px 20px 30px",color:C.muted,fontSize:11,fontWeight:500}}>
        Major Industries Restoration — Internal Tool
      </div>
    </div>
  );
}
