"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const result = await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) {
        setError(result.error.message || "Incorrect email or password.");
        return;
      }
      router.replace("/account");
      router.refresh();
    } catch {
      setError("Sign-in couldn't be completed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return <main className="container page" style={{display:"grid",placeItems:"center"}}>
    <section style={{width:"min(100%,460px)",border:"1px solid var(--line)",borderRadius:16,padding:30,boxShadow:"0 15px 50px #00000008"}}>
      <Link href="/" className="brand">new<span>turn</span></Link>
      <div className="eyebrow" style={{marginTop:30}}>Welcome back</div>
      <h1 className="page-title" style={{marginTop:8}}>Sign in to NewTurn</h1>
      <p className="page-subtitle">Use your registered email address and password.</p>
      <form onSubmit={submit}>
        <label style={{display:"block",fontSize:13,fontWeight:700,marginBottom:7}}>Email address</label>
        <input className="search" style={{margin:"0 0 18px",maxWidth:"100%"}} type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
        <label style={{display:"block",fontSize:13,fontWeight:700,marginBottom:7}}>Password</label>
        <input className="search" style={{margin:"0 0 18px",maxWidth:"100%"}} type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/>
        {error&&<p role="alert" style={{color:"var(--red)",fontSize:13,margin:"0 0 14px"}}>{error}</p>}
        <button className="btn" disabled={pending} style={{width:"100%",opacity:pending?.65:1}}>{pending?"Signing in…":"Sign in"}</button>
      </form>
      <p style={{fontSize:13,color:"var(--muted)",marginTop:20,textAlign:"center"}}>New to NewTurn? <Link href="/auth/sign-up" style={{color:"var(--red)",fontWeight:700}}>Create an account</Link></p>
    </section>
  </main>;
}
