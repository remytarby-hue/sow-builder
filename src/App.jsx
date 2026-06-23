import { useState } from "react";
import SOWBuilder from "./SOWBuilder";
import ReportLikePro from "./ReportLikePro";

const C = {
  bg: "#f0ede8",
  white: "#ffffff",
  black: "#111111",
  green: "#5a9a3a",
  greenDark: "#3d6b27",
  greenLight: "#eaf3e5",
  border: "#e2ddd8",
  text: "#111111",
  muted: "#999",
};

const IconHome = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#5a9a3a" : "#999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconDoc = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#5a9a3a" : "#999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

const IconPen = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#5a9a3a" : "#999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

function BottomNav({ screen, setScreen }) {
  const tabs = [
    { id: "home",   label: "Home",   Icon: IconHome },
    { id: "sow",    label: "SOW",    Icon: IconDoc  },
    { id: "report", label: "Report", Icon: IconPen  },
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#111111",display:"flex",borderTop:"1px solid #222",zIndex:100,paddingBottom:"env(safe-area-inset-bottom)"}}>
      {tabs.map(({ id, label, Icon }) => {
        const active = screen === id;
        return (
          <button
            key={id}
            onClick={() => setScreen(id)}
            style={{flex:1,background:"transparent",border:"none",cursor:"pointer",padding:"10px 0 12px",display:"flex",flexDirection:"column",alignItems:"center",gap:4,fontFamily:"inherit"}}
          >
            <Icon active={active} />
            <span style={{fontSize:10,fontWeight:active?700:500,color:active?"#5a9a3a":"#666",letterSpacing:0.3}}>{label}</span>
            {active && <div style={{width:4,height:4,borderRadius:"50%",background:"#5a9a3a",marginTop:-2}}/>}
          </button>
        );
      })}
    </div>
  );
}

function HomeScreen({ setScreen }) {
  const TOOLS = [
    {
      id: "sow",
      Icon: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>,
      title: "SOW Builder",
      subtitle: "Scope of Work Generator",
      description: "Generate a complete Scope of Work for any job type in minutes.",
      accent: "#111111",
    },
    {
      id: "report",
      Icon: () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
      title: "Report Like a Pro",
      subtitle: "Phrase Library",
      description: "Select phrases, copy them all, paste straight into your report.",
      accent: "#5a9a3a",
    },
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,paddingBottom:80}}>
      {/* HEADER */}
      <div style={{background:"#111111",padding:"22px 20px 28px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <img src="/logo.svg" alt="Major Industries" style={{width:46,height:46,objectFit:"contain"}}/>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#fff",letterSpacing:1,textTransform:"uppercase",lineHeight:1.2}}>Major Industries</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:2,textTransform:"uppercase"}}>Restoration</div>
          </div>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:4}}>Internal tool</div>
        <div style={{fontSize:26,fontWeight:800,color:"#fff",letterSpacing:-0.5}}>Restorer Assistant</div>
      </div>

      {/* TOOLS */}
      <div style={{padding:"22px 16px",display:"flex",flexDirection:"column",gap:12}}>
        <div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:2}}>Your tools</div>
        {TOOLS.map(({ id, Icon, title, subtitle, description, accent }) => (
          <button
            key={id}
            onClick={() => setScreen(id)}
            style={{background:C.white,border:"1px solid "+C.border,borderRadius:16,padding:"18px 16px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",fontFamily:"inherit",textAlign:"left",width:"100%",transition:"transform 0.1s"}}
            onTouchStart={e=>e.currentTarget.style.transform="scale(0.98)"}
            onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}
          >
            <div style={{width:50,height:50,borderRadius:14,background:accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon />
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:2}}>{title}</div>
              <div style={{fontSize:10,fontWeight:700,color:C.green,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6}}>{subtitle}</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{description}</div>
            </div>
            <div style={{width:32,height:32,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <IconChevron />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");

  return (
    <div style={{fontFamily:"'Segoe UI',Arial,sans-serif"}}>
      <style>{`* { box-sizing: border-box; } button { -webkit-tap-highlight-color: transparent; }`}</style>

      {screen === "home"   && <HomeScreen setScreen={setScreen} />}
      {screen === "sow"    && <SOWBuilder />}
      {screen === "report" && <ReportLikePro />}

      <BottomNav screen={screen} setScreen={setScreen} />
    </div>
  );
}
