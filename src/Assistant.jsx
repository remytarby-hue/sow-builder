import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#0f0f0f", card: "#1a1a1a", border: "#2a2a2a",
  green: "#5a9a3a", greenDim: "#1e3014", text: "#f0f0f0",
  muted: "#888888", red: "#e05252",
};

const SUGGESTIONS = [
  "Write an observation for a category 2 water damage job in a bathroom",
  "What moisture readings are considered dry standard for plasterboard?",
  "How do I explain mould remediation to a client?",
  "Write a note to an assessor recommending strip-out",
];

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const bottomRef = useRef(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "42px";

    const newMessages = [...messages, { role: "user", content: userText }];
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = e => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        setTranscribing(true);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const form = new FormData();
        form.append("audio", blob, "audio.webm");
        try {
          const res = await fetch("/api/transcribe", { method: "POST", body: form });
          const data = await res.json();
          if (data.text) setInput(prev => (prev + " " + data.text).trim());
        } catch {}
        setTranscribing(false);
      };
      mediaRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      bottom: "calc(58px + env(safe-area-inset-bottom))",
      background: C.bg,
      fontFamily: "'Segoe UI',Arial,sans-serif",
      color: C.text,
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes recpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
        textarea:focus{outline:none}
      `}</style>

      {/* HEADER */}
      <div style={{background:"#0f0f0f",borderBottom:"1px solid #222",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <img src="/logo.svg" alt="" style={{width:28,height:28,objectFit:"contain"}}/>
          <div>
            <div style={{fontSize:9,color:C.green,fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>Major Industries</div>
            <div style={{fontSize:15,fontWeight:700,color:"#fff"}}>Restoration Assistant</div>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])}
            style={{background:"transparent",border:"1px solid #333",color:C.muted,borderRadius:99,padding:"5px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
            Clear
          </button>
        )}
      </div>

      {/* MESSAGES — scrollable */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 16px 8px",display:"flex",flexDirection:"column",gap:12,WebkitOverflowScrolling:"touch"}}>
        {messages.length === 0 && (
          <div>
            <div style={{fontSize:13,color:C.muted,marginBottom:14}}>Ask me anything about restoration, or try one of these:</div>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)}
                style={{display:"block",width:"100%",textAlign:"left",background:C.card,border:"1px solid "+C.border,borderRadius:12,padding:"12px 14px",marginBottom:8,fontSize:13,color:"#ccc",cursor:"pointer",fontFamily:"inherit",lineHeight:1.5}}>
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{
              maxWidth:"85%",padding:"12px 16px",
              borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
              background:m.role==="user"?C.greenDim:C.card,
              border:"1px solid "+(m.role==="user"?C.green:C.border),
              fontSize:14,lineHeight:1.7,color:m.role==="user"?"#e0f0d8":C.text,
              whiteSpace:"pre-wrap",
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{display:"flex",justifyContent:"flex-start"}}>
            <div style={{background:C.card,border:"1px solid "+C.border,borderRadius:"18px 18px 18px 4px",padding:"14px 18px",display:"flex",gap:5,alignItems:"center"}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.green,animation:"pulse 1.2s ease infinite",animationDelay:`${i*0.2}s`}}/>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* INPUT BAR — stuck to bottom of the fixed container */}
      <div style={{background:"#0f0f0f",borderTop:"1px solid #222",padding:"10px 12px",flexShrink:0}}>
        {recording && <div style={{textAlign:"center",fontSize:11,color:C.red,marginBottom:6,fontWeight:600}}>Recording... release to stop</div>}
        {transcribing && <div style={{textAlign:"center",fontSize:11,color:C.muted,marginBottom:6}}>Transcribing...</div>}
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <textarea
            ref={textareaRef}
            value={transcribing?"Transcribing...":input}
            onChange={e=>{setInput(e.target.value);e.target.style.height="42px";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}}
            placeholder="Ask anything about restoration..."
            disabled={transcribing}
            style={{
              flex:1,background:"#1a1a1a",border:"1px solid #333",borderRadius:14,
              padding:"10px 14px",fontSize:14,color:"#eee",fontFamily:"inherit",
              resize:"none",lineHeight:1.5,height:42,maxHeight:120,overflowY:"auto",
            }}
          />

          <button
            onPointerDown={startRecording}
            onPointerUp={stopRecording}
            onPointerLeave={stopRecording}
            style={{
              width:44,height:44,borderRadius:"50%",border:"none",flexShrink:0,
              background:recording?C.red:"#222",color:recording?"#fff":C.muted,
              display:"flex",alignItems:"center",justifyContent:"center",
              cursor:"pointer",animation:recording?"recpulse 0.8s ease infinite":"none",
              transition:"background 0.15s",
            }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>

          <button onClick={()=>sendMessage()}
            disabled={!input.trim()||loading}
            style={{
              width:44,height:44,borderRadius:"50%",border:"none",flexShrink:0,
              background:input.trim()&&!loading?C.green:"#222",
              color:input.trim()&&!loading?"#fff":"#444",
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
