import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#0f0f0f", card: "#1a1a1a", border: "#2a2a2a",
  green: "#5a9a3a", greenDim: "#1e3014", text: "#f0f0f0",
  muted: "#666", red: "#e05252",
};

const HISTORY_KEY = "assistant_history";

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
}

function saveToHistory(prompt, response) {
  const history = loadHistory();
  history.unshift({ id: Date.now(), date: new Date().toISOString(), prompt, response });
  if (history.length > 50) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const isToday = d.toDateString() === today.toDateString();
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const time = d.toLocaleTimeString("en-AU", { hour:"2-digit", minute:"2-digit" });
  if (isToday) return `Today ${time}`;
  if (isYesterday) return `Yesterday ${time}`;
  return d.toLocaleDateString("en-AU", { day:"numeric", month:"short" }) + " " + time;
}

function InputBar({ input, setInput, loading, recording, transcribing, speaking, textareaRef, onSend, onToggleRecording, autoResize, compact }) {
  return (
    <div style={{background: compact ? "transparent" : "#0f0f0f", borderTop: compact ? "none" : "1px solid #1a1a1a", padding: compact ? "0" : "10px 12px", width:"100%"}}>
      {(recording || transcribing || speaking) && (
        <div style={{textAlign:"center",fontSize:11,marginBottom:6,fontWeight:600,color:recording?C.red:C.muted}}>
          {recording ? "● Recording — tap mic to stop" : transcribing ? "Transcribing..." : "🔊 Speaking..."}
        </div>
      )}
      <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e=>{setInput(e.target.value);autoResize();}}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();onSend();}}}
          placeholder={transcribing?"Transcribing...":"Message..."}
          disabled={transcribing}
          style={{flex:1,background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:22,padding:"10px 16px",fontSize:16,color:"#eee",fontFamily:"inherit",resize:"none",lineHeight:1.5,height:42,maxHeight:120,overflowY:"auto",transition:"border-color 0.15s"}}
        />
        <button onClick={onToggleRecording} disabled={transcribing||loading||speaking}
          style={{width:44,height:44,borderRadius:"50%",border:"none",flexShrink:0,background:recording?"#1a0a0a":"#1a1a1a",color:recording?C.red:C.muted,display:"flex",alignItems:"center",justifyContent:"center",cursor:transcribing||loading||speaking?"default":"pointer",animation:recording?"recpulse 1s ease infinite":"none",transition:"background 0.15s, color 0.15s"}}>
          {recording
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill={C.red} stroke="none"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          }
        </button>
        <button onClick={onSend} disabled={!input.trim()||loading}
          style={{width:44,height:44,borderRadius:"50%",border:"none",flexShrink:0,background:input.trim()&&!loading?C.green:"#1a1a1a",color:input.trim()&&!loading?"#fff":"#333",display:"flex",alignItems:"center",justifyContent:"center",cursor:input.trim()&&!loading?"pointer":"default",transition:"background 0.15s"}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

function HistoryPanel({ onClose }) {
  const [history, setHistory] = useState(loadHistory);
  const [copied, setCopied] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const remove = (id) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return (
    <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,background:C.bg,zIndex:50,display:"flex",flexDirection:"column",paddingTop:"env(safe-area-inset-top)"}}>
      {/* Header */}
      <div style={{background:"#0f0f0f",borderBottom:"1px solid #1a1a1a",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={onClose} style={{background:"transparent",border:"none",cursor:"pointer",padding:4,display:"flex",alignItems:"center",color:C.muted}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>History</div>
        </div>
        {history.length > 0 && (
          <button onClick={clearAll} style={{background:"transparent",border:"1px solid #2a2a2a",color:C.muted,borderRadius:99,padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
            Clear all
          </button>
        )}
      </div>

      {/* List */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {history.length === 0 && (
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#2a2a2a",fontSize:13,textAlign:"center",paddingTop:80}}>
            No history yet.<br/>Responses will appear here.
          </div>
        )}
        {history.map(h => (
          <div key={h.id} style={{background:C.card,border:"1px solid "+C.border,borderRadius:14,overflow:"hidden"}}>
            {/* Prompt */}
            <div style={{padding:"10px 14px",borderBottom:"1px solid #222",fontSize:12,color:C.muted,lineHeight:1.5}}>
              <span style={{color:"#3a5a2a",fontWeight:600,fontSize:10,textTransform:"uppercase",letterSpacing:1,marginRight:8}}>You</span>
              {h.prompt.length > 80 ? h.prompt.slice(0, 80) + "…" : h.prompt}
            </div>
            {/* Response preview */}
            <div style={{padding:"10px 14px"}}>
              <div style={{fontSize:13,color:C.text,lineHeight:1.65,whiteSpace:"pre-wrap",maxHeight:expanded===h.id?9999:72,overflow:"hidden",transition:"max-height 0.2s"}}>
                {h.response}
              </div>
              {h.response.length > 180 && (
                <button onClick={()=>setExpanded(expanded===h.id?null:h.id)}
                  style={{background:"transparent",border:"none",color:C.green,fontSize:11,cursor:"pointer",padding:"4px 0",fontFamily:"inherit"}}>
                  {expanded===h.id ? "Show less" : "Show more"}
                </button>
              )}
            </div>
            {/* Actions */}
            <div style={{padding:"6px 10px 10px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:10,color:"#333"}}>{formatDate(h.date)}</span>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>remove(h.id)}
                  style={{background:"transparent",border:"none",cursor:"pointer",color:"#333",fontSize:11,fontFamily:"inherit",padding:"4px 8px"}}>
                  Delete
                </button>
                <button onClick={()=>copy(h.response, h.id)}
                  style={{background:copied===h.id?C.greenDim:"#222",border:"1px solid "+(copied===h.id?C.green:C.border),color:copied===h.id?C.green:"#ccc",borderRadius:99,padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:4,transition:"all 0.15s"}}>
                  {copied===h.id
                    ? <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied</>
                    : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
                  }
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [copied, setCopied] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [handsFree, setHandsFree] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const mimeRef = useRef("");
  const textareaRef = useRef(null);
  const handsFreeRef = useRef(false);
  const audioRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => { handsFreeRef.current = handsFree; }, [handsFree]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "42px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const speakText = (text) => new Promise((resolve) => {
    setSpeaking(true);
    fetch("/api/speak", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then(res => { if (!res.ok) throw new Error("TTS failed"); return res.blob(); })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); resolve(); };
        audio.onerror = () => { setSpeaking(false); URL.revokeObjectURL(url); resolve(); };
        audio.play();
      })
      .catch(() => { setSpeaking(false); resolve(); });
  });

  // Shared send logic. When `speak` is true, the reply is read aloud, and once
  // it finishes, listening resumes automatically — this is what keeps a
  // hands-free session going without the user re-tapping the mic each turn.
  const sendMessage = async (text, { speak } = {}) => {
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    let reply;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      reply = data.content;
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      saveToHistory(text, reply);
    } catch {
      reply = "Something went wrong. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    }
    setLoading(false);

    if (speak) {
      await speakText(reply);
      if (handsFreeRef.current) startRecording();
    }
  };

  const send = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "42px";
    sendMessage(text, { speak: handsFreeRef.current });
  };

  const copyMessage = (text, i) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(i);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const startRecording = async () => {
    if (transcribing || loading || speaking || recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = ["audio/mp4","audio/webm;codecs=opus","audio/webm","audio/ogg"].find(t => MediaRecorder.isTypeSupported(t)) || "";
      mimeRef.current = mime;
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
      chunksRef.current = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        if (!chunksRef.current.length) return;
        setTranscribing(true);
        const ext = mimeRef.current.includes("mp4") ? "m4a" : "webm";
        const blob = new Blob(chunksRef.current, { type: mimeRef.current || "audio/webm" });
        const form = new FormData();
        form.append("audio", blob, `audio.${ext}`);
        try {
          const res = await fetch("/api/transcribe", { method: "POST", body: form });
          const data = await res.json();
          const text = data.text?.trim();
          setTranscribing(false);
          if (text) {
            if (handsFreeRef.current) {
              sendMessage(text, { speak: true });
            } else {
              setInput(prev => (prev + " " + text).trim());
              setTimeout(autoResize, 50);
            }
          } else if (handsFreeRef.current) {
            // Nothing understood (silence) — keep the conversation alive.
            startRecording();
          }
        } catch {
          setTranscribing(false);
        }
      };
      mediaRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setHandsFree(false);
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  const toggleRecording = () => {
    if (transcribing || loading || speaking) return;
    recording ? stopRecording() : startRecording();
  };

  const toggleHandsFree = () => {
    if (handsFree) {
      setHandsFree(false);
      handsFreeRef.current = false;
      if (recording) stopRecording();
      if (audioRef.current) { audioRef.current.pause(); setSpeaking(false); }
    } else {
      setHandsFree(true);
      handsFreeRef.current = true;
      startRecording();
    }
  };

  const startTemplate = (prompt) => {
    const guide = {
      "Restoration Observation": "Describe the cause of damage, which areas were affected, and what was observed on site. Include any moisture readings, visible damage, or mould if relevant.",
      "Site Note": "What happened during today's attendance? (e.g. equipment installed/removed, containment, access issues, works completed)",
      "Client Message": "What do you need to tell the client? Give me the key info and I'll write the message.",
      "Other": "What do you need?",
    };
    setMessages([{ role: "assistant", content: guide[prompt] }]);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const TEMPLATES = [
    { label: "Restoration Observation", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { label: "Site Note",               icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { label: "Client Message",          icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { label: "Other",                   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  ];

  const isEmpty = messages.length === 0 && !loading;
  const historyCount = loadHistory().length;

  return (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,paddingTop:"env(safe-area-inset-top)",paddingBottom:"calc(72px + env(safe-area-inset-bottom))",background:C.bg,fontFamily:"'Segoe UI',Arial,sans-serif",color:C.text,display:"flex",flexDirection:"column",overflowX:"hidden"}}>
      <style>{`
        @keyframes dots{0%,100%{opacity:.3}50%{opacity:1}}
        @keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes recpulse{0%,100%{box-shadow:0 0 0 0 rgba(224,82,82,.5)}70%{box-shadow:0 0 0 10px rgba(224,82,82,0)}}
        textarea:focus{outline:none}
      `}</style>

      {/* HEADER */}
      <div style={{background:"#0f0f0f",borderBottom:"1px solid #1a1a1a",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <img src="/logo.svg" alt="" style={{width:28,height:28,objectFit:"contain"}}/>
          <div>
            <div style={{fontSize:9,color:C.green,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Major Industries</div>
            <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>Restoration Assistant</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {messages.length > 0 && (
            <button onClick={()=>setMessages([])} style={{background:"transparent",border:"1px solid #2a2a2a",color:C.muted,borderRadius:99,padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
              Clear
            </button>
          )}
          <button onClick={toggleHandsFree}
            style={{background:handsFree?C.greenDim:"transparent",border:"1px solid "+(handsFree?C.green:"#2a2a2a"),color:handsFree?C.green:C.muted,borderRadius:99,padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            {handsFree ? "End conversation" : "Hands-free"}
          </button>
          <button onClick={()=>setShowHistory(true)}
            style={{background:"transparent",border:"1px solid #2a2a2a",color:C.muted,borderRadius:99,padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            History{historyCount > 0 && <span style={{background:C.green,color:"#fff",borderRadius:99,padding:"0 5px",fontSize:9,fontWeight:800}}>{historyCount}</span>}
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {isEmpty && (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 24px",gap:24}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:C.greenDim,border:"1px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <img src="/logo.svg" alt="" style={{width:36,height:36,objectFit:"contain"}}/>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:10}}>Restoration Assistant</div>
            <div style={{fontSize:13,color:"#555",lineHeight:2}}>
              Restoration Observation · Site Note<br/>
              Technical question · Client message
            </div>
            <div style={{fontSize:13,color:"#3d6b27",fontStyle:"italic",marginTop:10}}>Ask and you shall receive.</div>
          </div>
          {/* TEMPLATE BUTTONS */}
          <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",maxWidth:360}}>
            {TEMPLATES.map(t => (
              <button key={t.label} onClick={() => startTemplate(t.label)}
                style={{background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#ccc",borderRadius:99,padding:"8px 16px",fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s",display:"flex",alignItems:"center",gap:7}}
                onTouchStart={e=>e.currentTarget.style.borderColor=C.green}
                onTouchEnd={e=>e.currentTarget.style.borderColor="#2a2a2a"}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.green}
                onMouseLeave={e=>e.currentTarget.style.borderColor="#2a2a2a"}>
                <span style={{color:C.green,display:"flex"}}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{width:"100%",maxWidth:480}}>
            <InputBar input={input} setInput={setInput} loading={loading} recording={recording} transcribing={transcribing} speaking={speaking} textareaRef={textareaRef} onSend={send} onToggleRecording={toggleRecording} autoResize={autoResize} compact/>
          </div>
        </div>
      )}

      {/* MESSAGES */}
      {!isEmpty && (
        <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"16px",display:"flex",flexDirection:"column",gap:10,WebkitOverflowScrolling:"touch",touchAction:"pan-y",overscrollBehavior:"contain"}}>
          {messages.map((m, i) => (
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadein 0.25s ease"}}>
              {m.role === "assistant" && (
                <div style={{width:28,height:28,borderRadius:"50%",background:C.greenDim,border:"1px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginRight:8,marginTop:2}}>
                  <img src="/logo.svg" alt="" style={{width:16,height:16,objectFit:"contain"}}/>
                </div>
              )}
              <div style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start",maxWidth:"80%",gap:4}}>
                <div style={{padding:"12px 16px",borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.role==="user"?C.greenDim:C.card,border:"1px solid "+(m.role==="user"?C.green:C.border),fontSize:14,lineHeight:1.75,color:m.role==="user"?"#e0f0d8":C.text,whiteSpace:"pre-wrap"}}>
                  {m.content}
                </div>
                {m.role === "assistant" && (
                  <button onClick={() => copyMessage(m.content, i)}
                    style={{background:"transparent",border:"none",cursor:"pointer",padding:"2px 4px",display:"flex",alignItems:"center",gap:4,color:copied===i?C.green:C.muted,fontSize:11,fontFamily:"inherit",transition:"color 0.15s"}}>
                    {copied===i
                      ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Copied</>
                      : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
                    }
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{display:"flex",alignItems:"center",gap:8,animation:"fadein 0.2s ease"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:C.greenDim,border:"1px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <img src="/logo.svg" alt="" style={{width:16,height:16,objectFit:"contain"}}/>
              </div>
              <div style={{background:C.card,border:"1px solid "+C.border,borderRadius:"18px 18px 18px 4px",padding:"14px 18px",display:"flex",gap:5,alignItems:"center"}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.green,animation:"dots 1.2s ease infinite",animationDelay:`${i*0.2}s`}}/>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
      )}

      {/* INPUT BAR */}
      {!isEmpty && (
        <div style={{flexShrink:0,background:"#0f0f0f",borderTop:"1px solid #1a1a1a",padding:"10px 12px"}}>
          <InputBar input={input} setInput={setInput} loading={loading} recording={recording} transcribing={transcribing} speaking={speaking} textareaRef={textareaRef} onSend={send} onToggleRecording={toggleRecording} autoResize={autoResize}/>
        </div>
      )}

      {/* HISTORY PANEL */}
      {showHistory && <HistoryPanel onClose={() => setShowHistory(false)}/>}
    </div>
  );
}
