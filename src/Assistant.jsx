import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#0f0f0f", card: "#1a1a1a", border: "#2a2a2a",
  green: "#5a9a3a", greenDim: "#1e3014", text: "#f0f0f0",
  muted: "#666666", red: "#e05252",
};

export default function Assistant() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [status, setStatus] = useState("Hold to speak");
  const bottomRef = useRef(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const mimeTypeRef = useRef("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (userText) => {
    if (!userText.trim() || loading) return;
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    setStatus("Thinking...");

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
    setStatus("Hold to speak");
  };

  const startRecording = async () => {
    if (loading || transcribing) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Pick best supported format for iOS/Android
      const mime = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", "audio/ogg"]
        .find(t => MediaRecorder.isTypeSupported(t)) || "";
      mimeTypeRef.current = mime;
      const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
      chunksRef.current = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        if (chunksRef.current.length === 0) { setStatus("Hold to speak"); return; }
        setTranscribing(true);
        setStatus("Transcribing...");
        const ext = mimeTypeRef.current.includes("mp4") ? "m4a" : "webm";
        const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current || "audio/webm" });
        const form = new FormData();
        form.append("audio", blob, `audio.${ext}`);
        try {
          const res = await fetch("/api/transcribe", { method: "POST", body: form });
          const data = await res.json();
          if (data.text?.trim()) {
            setTranscribing(false);
            await sendMessage(data.text.trim());
          } else {
            setStatus("Hold to speak");
          }
        } catch {
          setStatus("Hold to speak");
        }
        setTranscribing(false);
      };
      mediaRef.current = recorder;
      recorder.start();
      setRecording(true);
      setStatus("Listening...");
    } catch {
      alert("Microphone access denied. Please allow microphone in your browser settings.");
    }
  };

  const stopRecording = () => {
    if (!recording) return;
    mediaRef.current?.stop();
    setRecording(false);
    setStatus("Processing...");
  };

  const pulse = recording
    ? "0 0 0 0 rgba(90,154,58,0.4)"
    : "none";

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
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(90,154,58,0.5); }
          70% { box-shadow: 0 0 0 22px rgba(90,154,58,0); }
          100% { box-shadow: 0 0 0 0 rgba(90,154,58,0); }
        }
        @keyframes fadein { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dots { 0%,100%{opacity:.3} 50%{opacity:1} }
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
      <div style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",gap:10,WebkitOverflowScrolling:"touch"}}>

        {messages.length === 0 && !loading && (
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,paddingBottom:20}}>
            <div style={{fontSize:13,color:"#333",textAlign:"center",lineHeight:1.6}}>
              Ask about moisture standards,<br/>write observations, draft notes...
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadein 0.25s ease"}}>
            <div style={{
              maxWidth:"85%",padding:"12px 16px",
              borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
              background:m.role==="user"?C.greenDim:C.card,
              border:"1px solid "+(m.role==="user"?C.green:C.border),
              fontSize:14,lineHeight:1.7,
              color:m.role==="user"?"#e0f0d8":C.text,
              whiteSpace:"pre-wrap",
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{display:"flex",justifyContent:"flex-start",animation:"fadein 0.2s ease"}}>
            <div style={{background:C.card,border:"1px solid "+C.border,borderRadius:"18px 18px 18px 4px",padding:"14px 18px",display:"flex",gap:5,alignItems:"center"}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.green,animation:`dots 1.2s ease infinite`,animationDelay:`${i*0.2}s`}}/>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* BIG MIC BUTTON */}
      <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 16px 20px",gap:12,background:C.bg}}>
        <div
          onPointerDown={startRecording}
          onPointerUp={stopRecording}
          onPointerLeave={stopRecording}
          onTouchStart={e=>{e.preventDefault();startRecording();}}
          onTouchEnd={e=>{e.preventDefault();stopRecording();}}
          style={{
            width:80,height:80,borderRadius:"50%",
            background:recording?"#c0392b":C.green,
            display:"flex",alignItems:"center",justifyContent:"center",
            cursor:"pointer",
            animation:recording?"pulse 1s ease infinite":"none",
            transition:"background 0.2s, transform 0.15s",
            transform:recording?"scale(1.08)":"scale(1)",
            userSelect:"none",
            WebkitUserSelect:"none",
          }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </div>
        <div style={{fontSize:12,color:recording?C.green:transcribing||loading?C.muted:"#444",fontWeight:500,letterSpacing:0.3,transition:"color 0.2s"}}>
          {status}
        </div>
      </div>
    </div>
  );
}
