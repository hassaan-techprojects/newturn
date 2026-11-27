"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Banknote, MapPin, Smartphone, ShieldCheck, Truck } from "lucide-react";

const brands = ["Apple","Samsung","OnePlus","Google","OPPO","vivo","Xiaomi","Motorola","realme","POCO","iQOO","Nothing","CMF","ASUS","Nokia","Infinix"];
const doubled = [...brands,...brands];

export default function HomePage(){
  return <main>
    <header className="container topbar">
      <Link href="/" className="brand">new<span>turn</span></Link>
      <nav className="nav"><a href="#how">How it works</a><a href="#brands">Supported brands</a><a href="#why">Why NewTurn</a></nav>
      <div style={{display:"flex",gap:10,alignItems:"center"}}><Link href="/auth/sign-in" style={{fontSize:13,fontWeight:700}}>Sign in</Link><Link className="btn" href="/auth/sign-up">Create account</Link><Link className="btn btn-outline" href="/admin/login">Admin Login</Link></div>
    </header>
    <section className="hero">
      <div className="container">
        <div className="eyebrow">A smarter way to upgrade</div>
        <div className="phone-art"><Smartphone strokeWidth={1.3}/></div>
        <h1>Your old 5G phone.<br/><span style={{color:"var(--red)"}}>A brand-new opportunity.</span></h1>
        <p>Get a fair price for your used smartphone with a simple evaluation and convenient doorstep pickup in Bengaluru.</p>
        <Link href="/sell" className="btn">Sell your phone <ArrowRight size={17}/></Link>
        <div style={{marginTop:18,fontSize:12,color:"var(--muted)"}}>Only eligible 5G smartphones · Bengaluru service area</div>
      </div>
    </section>
    <section className="section" id="brands">
      <div className="container">
        <div className="section-head"><div className="eyebrow">Your phone, your price</div><h2>Sell phones from top brands</h2><p>Choose your brand to find your exact 5G model.</p></div>
        <div className="brand-window"><div className="brand-track">{doubled.map((b,i)=><div className="brand-chip" key={b+i}>{b}</div>)}</div></div>
        <div style={{textAlign:"center",marginTop:25}}><Link href="/sell" className="btn">Choose your phone <ArrowRight size={16}/></Link></div>
      </div>
    </section>
    <section className="section" id="why" style={{background:"var(--soft)"}}>
      <div className="container">
        <div className="section-head"><div className="eyebrow">The NewTurn promise</div><h2>A better way to sell your phone</h2><p>Clear steps, transparent evaluation and a straightforward selling experience.</p></div>
        <div className="benefits">
          <article className="benefit"><div className="benefit-icon"><Banknote/></div><h3>Transparent valuation</h3><p>See an indicative value first. Your final offer is based on the condition and details you provide.</p></article>
          <article className="benefit"><div className="benefit-icon"><ShieldCheck/></div><h3>Guided device checks</h3><p>Answer clear questions about your phone's screen, body, functions and included accessories.</p></article>
          <article className="benefit"><div className="benefit-icon"><Truck/></div><h3>Bengaluru pickup</h3><p>Share your serviceable location and submit your selling request for pickup coordination.</p></article>
        </div>
      </div>
    </section>
    <section className="section" id="how"><div className="container"><div className="cta-band"><div><div className="eyebrow" style={{color:"#ff718d"}}>Ready when you are</div><h2 style={{fontSize:28,margin:"10px 0 0"}}>Find out what your phone is worth.</h2><p>Start with your brand and model. It only takes a few steps.</p></div><Link href="/sell" className="btn">Start selling <ArrowRight size={16}/></Link></div></div></section>
    <footer className="footer"><div className="container" style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}><span>© {new Date().getFullYear()} NewTurn. All rights reserved.</span><span><MapPin size={13} style={{display:"inline",verticalAlign:"middle"}}/> Bengaluru, Karnataka</span></div></footer>
  </main>;
}
