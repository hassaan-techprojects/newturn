"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const result = await authClient.signUp.email({ name: name.trim(), email: email.trim(), password });
      if (result.error) {
        setError(result.error.message || "We couldn't create your account. Please check your details.");
        return;
      }
      router.replace("/account");
      router.refresh();
    } catch {
      setError("Sign-up couldn't be completed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return <main className="container page" style={{display:"grid",placeItems:"center"}}>
    <section style={{width:"min(100%,460px)",border:"1px solid var(--line)",borderRadius:16,padding:30,boxShadow:"0 15px 50px #00000008"}}>
      <Link href="/" className="brand">new<span>turn</span></Link>
      <div className="eyebrow" style={{marginTop:30}}>Create your account</div>
      <h1 className="page-title" style={{marginTop:8}}>Join NewTurn</h1>
      <p className="page-subtitle">Create an account to save your phone evaluation and manage your selling requests.</p>
      <form onSubmit={submit}>
        <label style={{display:"block",fontSize:13,fontWeight:700,marginBottom:7}}>Full name</label>
        <input className="search" style={{margin:"0 0 18px",maxWidth:"100%"}} autoComplete="name" required minLength={2} value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name"/>
        <label style={{display:"block",fontSize:13,fontWeight:700,marginBottom:7}}>Email address</label>
        <input className="search" style={{margin:"0 0 18px",maxWidth:"100%"}} type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
        <label style={{display:"block",fontSize:13,fontWeight:700,marginBottom:7}}>Password</label>
        <input className="search" style={{margin:"0 0 18px",maxWidth:"100%"}} type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/>
        {error&&<p role="alert" style={{color:"var(--red)",fontSize:13,margin:"0 0 14px"}}>{error}</p>}
        <button className="btn" disabled={pending} style={{width:"100%",opacity:pending?.65:1}}>{pending?"Creating account…":"Create account"}</button>
      </form>
      <p style={{fontSize:13,color:"var(--muted)",marginTop:20,textAlign:"center"}}>Already registered? <Link href="/auth/sign-in" style={{color:"var(--red)",fontWeight:700}}>Sign in</Link></p>
    </section>
  </main>;
}
