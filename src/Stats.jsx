import { useState, useEffect } from "react";

const C = {
  bg: "#0f0f0f", card: "#1a1a1a", border: "#2a2a2a",
  green: "#5a9a3a", greenDim: "#1e3014", text: "#f0f0f0",
  muted: "#666",
};

const SOW_LABELS = {
  mould: "Mould Remediation", contents: "Contents Remediation",
  contents_relocation: "Contents Relocation", stripout: "Strip Out",
  flooring: "Flooring Removal", flood: "Building & Contents",
  restoration: "Restoration Cleaning", drying: "Drying",
};

function loadStats() {
  try { return JSON.parse(localStorage.getItem("app_stats") || "{}"); } catch { return {}; }
}

function loadSOWHistory() {
  try { return JSON.parse(localStorage.getItem("sow_history") || "[]"); } catch { return []; }
}

function loadAssistantHistory() {
  try { return JSON.parse(localStorage.getItem("assistant_history") || "[]"); } catch { return []; }
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{background:C.card,border:"1px solid "+C.border,borderRadius:16,padding:"18px 20px",flex:1,minWidth:0}}>
      <div style={{fontSize:32,fontWeight:800,color:"#fff",letterSpacing:-1}}>{value}</div>
      <div style={{fontSize:13,fontWeight:600,color:C.green,marginTop:2}}>{label}</div>
      {sub && <div style={{fontSize:11,color:C.muted,marginTop:4}}>{sub}</div>}
    </div>
  );
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-AU", { day:"numeric", month:"short", year:"numeric" });
}

export default function Stats() {
  const [stats, setStats] = useState(loadStats);
  const [sowHistory, setSowHistory] = useState(loadSOWHistory);
  const [assistantHistory, setAssistantHistory] = useState(loadAssistantHistory);
  const [viewing, setViewing] = useState(null);
  const [copied, setCopied] = useState(false);

  const copySOW = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setStats(loadStats());
    setSowHistory(loadSOWHistory());
    setAssistantHistory(loadAssistantHistory());
  }, []);

  const totalSOW = sowHistory.length;
  const totalAssistant = assistantHistory.length;
  const totalPhrases = stats.phrases_copied || 0;

  const sowByType = sowHistory.reduce((acc, entry) => {
    const t = entry.type || "unknown";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  const topType = Object.entries(sowByType).sort((a,b) => b[1]-a[1])[0];

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',Arial,sans-serif",paddingBottom:"calc(80px + env(safe-area-inset-bottom))"}}>

      {/* HEADER */}
      <div style={{padding:"14px 20px",paddingTop:"calc(env(safe-area-inset-top) + 14px)",borderBottom:"1px solid #1a1a1a",background:"#0f0f0f"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <img src="/logo.svg" alt="" style={{width:28,height:28,objectFit:"contain"}}/>
          <div>
            <div style={{fontSize:9,color:C.green,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Major Industries</div>
            <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>Activity</div>
          </div>
        </div>
      </div>

      <div style={{padding:"20px 16px",display:"flex",flexDirection:"column",gap:16}}>

        {/* TOP STATS */}
        <div style={{display:"flex",gap:10}}>
          <StatCard label="SOW Generated" value={totalSOW} sub={topType ? `Most: ${SOW_LABELS[topType[0]] || topType[0]}` : "None yet"} />
          <StatCard label="AI Responses" value={totalAssistant} />
        </div>
        <div style={{display:"flex",gap:10}}>
          <StatCard label="Phrases Copied" value={totalPhrases} sub="Report Like a Pro" />
          <div style={{flex:1}}/>
        </div>

        {/* SOW BY TYPE */}
        {Object.keys(sowByType).length > 0 && (
          <div style={{background:C.card,border:"1px solid "+C.border,borderRadius:16,padding:"16px 20px"}}>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:14}}>SOW by type</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {Object.entries(sowByType).sort((a,b)=>b[1]-a[1]).map(([type, count]) => {
                const pct = Math.round((count / totalSOW) * 100);
                return (
                  <div key={type}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:13,color:C.text}}>{SOW_LABELS[type] || type}</span>
                      <span style={{fontSize:13,fontWeight:700,color:C.green}}>{count}</span>
                    </div>
                    <div style={{height:4,background:"#222",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:C.green,borderRadius:99,transition:"width 0.4s ease"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SOW HISTORY */}
        {sowHistory.length > 0 && (
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Recent SOW</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {sowHistory.slice(0, 10).map((entry, i) => (
                <button key={i} onClick={() => { setViewing(entry); setCopied(false); }}
                  style={{background:C.card,border:"1px solid "+C.border,borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",fontFamily:"inherit",textAlign:"left",width:"100%"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:3}}>{entry.address || "No address"}</div>
                    <div style={{fontSize:11,color:C.green}}>{SOW_LABELS[entry.type] || entry.type}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,marginLeft:12}}>
                    <div style={{fontSize:11,color:C.muted}}>{entry.date ? formatDate(entry.date) : ""}</div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5a9a3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ASSISTANT HISTORY PREVIEW */}
        {assistantHistory.length > 0 && (
          <div>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>Recent AI responses</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {assistantHistory.slice(0, 5).map((entry, i) => (
                <div key={i} style={{background:C.card,border:"1px solid "+C.border,borderRadius:14,padding:"14px 16px"}}>
                  <div style={{fontSize:11,color:C.muted,marginBottom:5}}>{formatDate(entry.date)}</div>
                  <div style={{fontSize:12,color:"#888",marginBottom:6,fontStyle:"italic"}}>"{entry.prompt.length > 60 ? entry.prompt.slice(0,60)+"…" : entry.prompt}"</div>
                  <div style={{fontSize:13,color:C.text,lineHeight:1.6}}>{entry.response.length > 100 ? entry.response.slice(0,100)+"…" : entry.response}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalSOW === 0 && totalAssistant === 0 && totalPhrases === 0 && (
          <div style={{textAlign:"center",color:"#2a2a2a",fontSize:13,paddingTop:60,lineHeight:2}}>
            No activity yet.<br/>Start using the tools and your stats will appear here.
          </div>
        )}

      </div>

      {/* SOW VIEWER */}
      {viewing && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:C.bg,zIndex:50,display:"flex",flexDirection:"column",paddingTop:"env(safe-area-inset-top)"}}>
          <div style={{background:"#0f0f0f",borderBottom:"1px solid #1a1a1a",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={() => setViewing(null)} style={{background:"transparent",border:"none",cursor:"pointer",padding:4,color:C.muted,display:"flex",alignItems:"center"}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{viewing.address || "No address"}</div>
                <div style={{fontSize:11,color:C.green}}>{SOW_LABELS[viewing.type] || viewing.type} · {viewing.date ? formatDate(viewing.date) : ""}</div>
              </div>
            </div>
          </div>

          <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
            <div style={{background:C.card,border:"1px solid "+C.border,borderRadius:16,padding:"18px 20px",whiteSpace:"pre-wrap",fontSize:13,lineHeight:1.9,color:"#ddd"}}>
              {viewing.text}
            </div>
          </div>

          <div style={{padding:"10px 16px",paddingBottom:"calc(10px + env(safe-area-inset-bottom))",background:"#0f0f0f",borderTop:"1px solid #1a1a1a"}}>
            <button onClick={() => copySOW(viewing.text)}
              style={{width:"100%",padding:"15px",borderRadius:99,background:copied?"#27ae60":C.green,border:"none",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit",transition:"background 0.2s"}}>
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
