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
  muted: "#888880",
};

const IconDoc = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

const IconPen = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const TOOLS = [
  {
    id: "sow",
    Icon: IconDoc,
    title: "SOW Builder",
    subtitle: "Scope of Work Generator",
    description: "Generate a complete Scope of Work for any job in minutes.",
    accent: C.black,
  },
  {
    id: "report",
    Icon: IconPen,
    title: "Report Like a Pro",
    subtitle: "Phrase Library",
    description: "Select phrases, copy them all, paste straight into your report.",
    accent: C.green,
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
        .tool-card:active{transform:scale(0.98);opacity:0.9}
      `}</style>

      {/* HEADER */}
      <div style={{background:C.black,padding:"22px 20px 26px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <img src="/logo.svg" alt="Major Industries" style={{width:44,height:44,objectFit:"contain"}} />
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#fff",letterSpacing:1,textTransform:"uppercase",lineHeight:1.2}}>Major Industries</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",letterSpacing:2,textTransform:"uppercase"}}>Restoration</div>
          </div>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:4}}>Internal tool</div>
        <div style={{fontSize:24,fontWeight:800,color:"#fff",letterSpacing:-0.5}}>Restorer Assistant</div>
      </div>

      {/* TOOLS */}
      <div style={{padding:"20px 16px",display:"flex",flexDirection:"column",gap:12,animation:"fadein 0.3s ease"}}>
        <div style={{fontSize:10,fontWeight:700,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Tools</div>

        {TOOLS.map(({ id, Icon, title, subtitle, description, accent }) => (
          <button
            key={id}
            className="tool-card"
            onClick={() => setScreen(id)}
            style={{
              background:C.white,
              border:"1px solid "+C.border,
              borderRadius:16,
              padding:"16px 14px",
              display:"flex",
              alignItems:"center",
              gap:14,
              cursor:"pointer",
              fontFamily:"inherit",
              textAlign:"left",
              transition:"transform 0.1s,opacity 0.1s",
              width:"100%",
            }}
          >
            <div style={{width:48,height:48,borderRadius:14,background:accent,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon />
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:2}}>{title}</div>
              <div style={{fontSize:10,fontWeight:700,color:C.green,textTransform:"uppercase",letterSpacing:0.8,marginBottom:6}}>{subtitle}</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{description}</div>
            </div>
            <div style={{width:30,height:30,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <IconChevron />
            </div>
          </button>
        ))}
      </div>

      <div style={{textAlign:"center",padding:"8px 16px 30px",fontSize:11,color:C.muted}}>
        Major Industries Restoration — Internal Tool
      </div>
    </div>
  );
}
