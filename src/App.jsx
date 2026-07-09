import { useState } from "react";
import SOWBuilder from "./SOWBuilder";
import ReportLikePro from "./ReportLikePro";
import Assistant from "./Assistant";

export const D = {
  bg:       "#0f0f0f",
  card:     "#1a1a1a",
  card2:    "#222222",
  border:   "#2a2a2a",
  green:    "#5a9a3a",
  greenDim: "#1e3014",
  white:    "#ffffff",
  muted:    "#888888",
  text:     "#f0f0f0",
};

function BottomNav({ screen, setScreen }) {
  const tabs = [
    { id:"home",   label:"Home",
      icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?"#5a9a3a":"#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id:"sow",    label:"SOW",
      icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?"#5a9a3a":"#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { id:"report", label:"Report",
      icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?"#5a9a3a":"#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
    { id:"assistant", label:"Assistant",
      icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?"#5a9a3a":"#666"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#0f0f0f",borderTop:"1px solid #222",display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom)"}}>
      {tabs.map(({ id, label, icon }) => {
        const active = screen === id;
        return (
          <button key={id} onClick={() => setScreen(id)}
            style={{flex:1,background:"transparent",border:"none",cursor:"pointer",padding:"12px 0 14px",display:"flex",flexDirection:"column",alignItems:"center",gap:5,fontFamily:"inherit"}}>
            {icon(active)}
            <span style={{fontSize:10,fontWeight:500,color:active?"#5a9a3a":"#555",letterSpacing:0.3}}>{label}</span>
            {active && <div style={{width:20,height:2,borderRadius:2,background:"#5a9a3a",marginTop:1}}/>}
          </button>
        );
      })}
    </div>
  );
}

function HomeScreen({ setScreen }) {
  const tools = [
    {
      id: "sow",
      label: "SOW Builder",
      sub: "Scope of Work Generator",
      desc: "Generate a complete Scope of Work for any job type in minutes.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5a9a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
    },
    {
      id: "report",
      label: "Report Like a Pro",
      sub: "Phrase Library",
      desc: "Select phrases, copy them all, paste straight into your report.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5a9a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    },
    {
      id: "assistant",
      label: "Restoration Assistant",
      sub: "AI-Powered",
      desc: "Restoration Observation · Site Note · Technical question · Client message",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5a9a3a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    },
  ];

  return (
    <div style={{minHeight:"100vh",background:D.bg,color:D.text,fontFamily:"'Segoe UI',Arial,sans-serif",paddingBottom:80}}>
      <div style={{padding:"28px 20px 32px",borderBottom:"1px solid "+D.border}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
          <img src="/logo.svg" alt="Major Industries" style={{width:40,height:40,objectFit:"contain"}}/>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:D.green,letterSpacing:2,textTransform:"uppercase"}}>Major Industries</div>
            <div style={{fontSize:10,color:D.muted,letterSpacing:1.5,textTransform:"uppercase"}}>Restoration</div>
          </div>
        </div>
        <div style={{fontSize:11,color:D.muted,marginBottom:6,letterSpacing:0.5}}>Internal tool</div>
        <div style={{fontSize:30,fontWeight:800,color:D.white,letterSpacing:-1,lineHeight:1.1}}>Restorer<br/>Assistant</div>
      </div>

      <div style={{padding:"24px 16px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{fontSize:11,fontWeight:600,color:D.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Your tools</div>
        {tools.map(t => (
          <button key={t.id} onClick={() => setScreen(t.id)}
            style={{background:D.card,border:"1px solid "+D.border,borderRadius:18,padding:"20px 18px",display:"flex",alignItems:"center",gap:16,cursor:"pointer",textAlign:"left",width:"100%",fontFamily:"inherit",transition:"border-color 0.15s"}}
            onTouchStart={e => e.currentTarget.style.borderColor=D.green}
            onTouchEnd={e => e.currentTarget.style.borderColor=D.border}
            onMouseEnter={e => e.currentTarget.style.borderColor=D.green}
            onMouseLeave={e => e.currentTarget.style.borderColor=D.border}
          >
            <div style={{width:54,height:54,borderRadius:16,background:D.greenDim,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {t.icon}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:17,fontWeight:700,color:D.white,marginBottom:3}}>{t.label}</div>
              <div style={{fontSize:10,fontWeight:700,color:D.green,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{t.sub}</div>
              <div style={{fontSize:12,color:D.muted,lineHeight:1.6}}>{t.desc}</div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5a9a3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  return (
    <div style={{fontFamily:"'Segoe UI',Arial,sans-serif",background:"#0f0f0f",minHeight:"100vh",paddingTop:"env(safe-area-inset-top)"}}>
      <style>{`* { box-sizing:border-box; } button { -webkit-tap-highlight-color:transparent; } html, body { overflow-x:hidden; max-width:100vw; }`}</style>
      {screen === "home"      && <HomeScreen setScreen={setScreen} />}
      {screen === "sow"       && <SOWBuilder />}
      {screen === "report"    && <ReportLikePro />}
      {screen === "assistant" && <Assistant />}
      <BottomNav screen={screen} setScreen={setScreen} />
    </div>
  );
}
