"use client";

import { useEffect,useRef,useState } from "react";

export default function Terminal({address}: {address: string}) {
  const ws = useRef<WebSocket | null>(null);
  const [log,setLog] = useState<string[]>([]);
  useEffect(()=>{
    ws.current = new WebSocket(address);
    ws.current.onmessage = (event) => {
      setLog((prev)=>[...prev,event.data.toString()]);
    }
  },[])
  const [input,setInput] = useState("");

  return (
    <div className="flex flex-col h-full border-slate-500 border-solid border-2 text-white overflow-y-auto">
      <div className="flex-1 overflow-y-auto">
        {
          log.map((item,index)=>{
            return (
              <div key={index}>{item}</div>
            )
          })
        }
      </div>
      <div className="flex">
        <span>{'>'}</span>
        <input type="text" className="flex-1 border-0 bg-transparent outline-none" value={input} onChange={(e)=>setInput((e.target as HTMLInputElement).value)} />
        <button onClick={()=>ws.current?.send(input)}>Send</button>

      </div>
    </div>
  );
}