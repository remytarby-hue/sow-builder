import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#0f0f0f", card: "#1a1a1a", border: "#2a2a2a",
  green: "#5a9a3a", greenDim: "#1e3014", text: "#f0f0f0",
  muted: "#666", red: "#e05252",
};

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const bottomRef = useRef(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const mimeRef = useRef("");
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "42px";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "42px";

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const toggleRecording = async () => {
    if (transcribing || loading) return;

    if (recording) {
      // Stop
      mediaRef.current?.stop();
      setRecording(false);
    } else {
      // Start
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mime = ["audio/mp4","audio/webm;codecs=opus","audio/webm","audio/ogg"]
          .find(t => MediaRecorder.isTypeSupported(t)) || "";
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
            if (data.text?.trim()) {
              setInput(prev => (prev + " " + data.text).trim());
              setTimeout(autoResize, 50);
            }
          } catch {}
          setTranscribing(false);
        };
        mediaRef.current = recorder;
        recorder.start();
        setRecording(true);
      } catch {
        alert("Microphone access denied.");
      }
    }
  };

  return (
    <div style={{
      position:"fixed", top:"env(safe-area-inset-top)", left:0, right:0,
      bottom:"calc(58px + env(safe-area-inset-bottom))",
      background:C.bg, fontFamily:"'Segoe UI',Arial,sans-serif",
      color:C.text, display:"flex", flexDirection:"column",
      overflowX:"hidden",
    }}>
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
        {messages.length > 0 && (
          <button onClick={()=>setMessages([])}
            style={{background:"transparent",border:"1px solid #2a2a2a",color:C.muted,borderRadius:99,padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
            Clear
          </button>
        )}
      </div>

      {/* MESSAGES */}
      <div style={{flex:1,overflowY:"auto",overflowX:"hidden",padding:"16px",display:"flex",flexDirection:"column",gap:10,WebkitOverflowScrolling:"touch",touchAction:"pan-y",overscrollBehavior:"contain"}}>

        {messages.length === 0 && !loading && (
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{textAlign:"center",color:"#2a2a2a",fontSize:13,lineHeight:1.8,padding:"0 32px"}}>
              Ask about moisture standards,<br/>get observations written,<br/>draft notes for assessors.
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadein 0.25s ease"}}>
            {m.role === "assistant" && (
              <div style={{width:28,height:28,borderRadius:"50%",background:C.greenDim,border:"1px solid #2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginRight:8,marginTop:2}}>
                <img src="/logo.svg" alt="" style={{width:16,height:16,objectFit:"contain"}}/>
              </div>
            )}
            <div style={{
              maxWidth:"80%",padding:"12px 16px",
              borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
              background:m.role==="user"?C.greenDim:C.card,
              border:"1px solid "+(m.role==="user"?C.green:C.border),
              fontSize:14,lineHeight:1.75,
              color:m.role==="user"?"#e0f0d8":C.text,
              whiteSpace:"pre-wrap",
            }}>
              {m.content}
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

      {/* INPUT BAR */}
      <div style={{flexShrink:0,background:"#0f0f0f",borderTop:"1px solid #1a1a1a",padding:"10px 12px"}}>
        {(recording || transcribing) && (
          <div style={{textAlign:"center",fontSize:11,marginBottom:6,fontWeight:600,color:recording?C.red:C.muted}}>
            {recording ? "● Recording — tap mic to stop" : "Transcribing..."}
          </div>
        )}
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e=>{setInput(e.target.value);autoResize();}}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
            placeholder={transcribing?"Transcribing...":"Message..."}
            disabled={transcribing}
            style={{
              flex:1,background:"#1a1a1a",border:"1px solid #2a2a2a",borderRadius:22,
              padding:"10px 16px",fontSize:14,color:"#eee",fontFamily:"inherit",
              resize:"none",lineHeight:1.5,height:42,maxHeight:120,overflowY:"auto",
              transition:"border-color 0.15s",
            }}
          />

          {/* MIC — toggle */}
          <button onClick={toggleRecording}
            disabled={transcribing||loading}
            style={{
              width:44,height:44,borderRadius:"50%",border:"none",flexShrink:0,
              background:recording?"#1a0a0a":"#1a1a1a",
              color:recording?C.red:transcribing?C.muted:C.muted,
              display:"flex",alignItems:"center",justifyContent:"center",
              cursor:transcribing||loading?"default":"pointer",
              animation:recording?"recpulse 1s ease infinite":"none",
              transition:"background 0.15s, color 0.15s",
            }}>
            {recording
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill={C.red} stroke="none"><rect x="4" y="4" width="16" height="16" rx="3"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
            }
          </button>

          {/* SEND */}
          <button onClick={send}
            disabled={!input.trim()||loading}
            style={{
              width:44,height:44,borderRadius:"50%",border:"none",flexShrink:0,
              background:input.trim()&&!loading?C.green:"#1a1a1a",
              color:input.trim()&&!loading?"#fff":"#333",
              display:"flex",alignItems:"center",justifyContent:"center",
              cursor:input.trim()&&!loading?"pointer":"default",
              transition:"background 0.15s",
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
