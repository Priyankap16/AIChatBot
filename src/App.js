import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [msgs, setMsgs] = useState([
    { sender: "bot", text: "Hi! I’m your chatbot 🤖. How can I help you today?" },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const bottomRef = useRef();

  const handleSend = async () => {
    if (!inputMsg.trim()) return;

    const userMsg = { sender: "user", text: inputMsg };
    setMsgs((prev) => [...prev, userMsg]);
    setInputMsg("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMsg }),
      });
      const data = await res.json();

      const botMsg = { sender: "bot", text: data.reply };
      setMsgs((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg = { sender: "bot", text: "Oops! Something went wrong." };
      setMsgs((prev) => [...prev, botMsg]);
      console.error(err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({  });
  }, [msgs]);

  return (
    <div className="chatContainer">
      <h1 className="title">AI Chatbot 🤖</h1>
      <div className="msgContainer">
        {msgs.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="inputBox">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
