import { useState, useRef, useEffect } from "react";
import "./App.css";

function App(){

  const [message,setMessage] = useState([ {sender:'bot',text:'hi, how can i help u today?'}])
  const [input , setInput] = useState("")
   const bottomRef = useRef();

  const handleSend= async()=>{
    if(!input.trim()) return;
    const userMsg = {sender:'user', text:input}
    setMessage((prev)=>[...prev,userMsg])
    setInput('')

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      const botMsg = { sender: "bot", text: data.reply };
      setMessage((prev) => [...prev, botMsg]);
    } catch (err) {
      const botMsg = { sender: "bot", text: "Oops! Something went wrong." };
      setMessage((prev) => [...prev, botMsg]);
      console.error(err);
    }
  };
  useEffect(() => {
    bottomRef.current?.scrollIntoView({  });
  }, [message]);

  return(
    <div className='App'>
    <div className='chatContainer'>
      <h1 className='chath1'>Lets Chat</h1>
      <div className='messageContainer'>
       {message.map((msg,i)=>(
        <div key={i} className={`message ${msg.sender}`}>
          {msg.text}
        </div>
       ))}
       <div ref={bottomRef}></div>
      </div>
      <div className='inputForUser'>
        <input 
        type='text'
        value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Type a message..."
        onKeyDown={(e)=>e.key === 'Enter'  && handleSend()}/>
        
        <button onClick={handleSend}> SEND</button>
      </div>
    
    </div>
    </div>
  )
}

export default App;