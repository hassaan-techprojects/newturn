"use client";

import { useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";

export default function AdminLoginForm() {
  const [email,setEmail]=useState("admin@gmail.com");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response=await fetch("/api/admin/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
      const result=await response.json();
      if(!response.ok) throw new Error(result.message??"Unable to sign in.");
      window.location.assign("/admin");
    } catch(e) { setError(e instanceof Error?e.message:"Unable to sign in."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="form-card" style={{maxWidth:440}}>
    <div style={{width:44,height:44,borderRadius:9,background:"var(--black)",color:"var(--white)",display:"grid",placeItems:"center"}}><LockKeyhole size={21}/></div>
    <h2 style={{fontSize:22,margin:"18px 0 6px"}}>Administrator access</h2>
    <p style={{fontSize:13,color:"var(--gray)",margin:"0 0 18px"}}>Sign in to manage NewTurn operations.</p>
    <label className="field-label" htmlFor="admin-email">Email</label>
    <input id="admin-email" className="field-input" type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/>
    <label className="field-label" htmlFor="admin-password">Password</label>
    <input id="admin-password" className="field-input" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/>
    {error&&<p role="alert" style={{fontSize:12,color:"var(--charcoal)",background:"#F5F5F5",border:"1px solid var(--silver)",padding:10,borderRadius:6}}>{error}</p>}
    <button className="btn" type="submit" disabled={busy} style={{width:"100%",marginTop:18}}>{busy?"Signing in…":"Sign in"} <LogIn size={16}/></button>
  </form>;
}
