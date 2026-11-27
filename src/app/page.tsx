"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Banknote, CheckCircle2, ClipboardCheck, MapPin, Menu, PackageCheck, ShieldCheck, Smartphone, Truck, X, Sparkles, CircleHelp } from "lucide-react";
import { useState } from "react";

const brands = [
  ["Apple","apple"],["Samsung","samsung"],["realme","realme"],["Redmi","redmi"],["Xiaomi","xiaomi"],
  ["OnePlus","oneplus"],["Motorola","motorola"],["POCO","poco"],["OPPO","oppo"],["vivo","vivo"],
  ["iQOO","iqoo"],["Nothing","nothing"],["CMF","cmf"],["ASUS","asus"],["Google","google"]
] as const;
const doubled=[...brands,...brands];

function BrandLogo({slug,name}:{slug:string;name:string}) {
  return <img src={`/images/brands/${slug}.svg`} alt={name} loading="lazy"
    onError={e=>{e.currentTarget.style.display="none";const fallback=e.currentTarget.nextElementSibling as HTMLElement|null;if(fallback)fallback.style.display="grid";}}/>;
}
function BrandLockup({footer=false}:{footer?:boolean}) {
  return <Link href="/" className="brand-lockup" aria-label="NewTurn home">
    <img className="brand-logo" src="/images/brand/newturn-logo.svg" alt="NewTurn" onError={e=>{e.currentTarget.style.display="none";const f=e.currentTarget.nextElementSibling as HTMLElement|null;if(f)f.style.display="inline-flex";}}/>
    <span className="brand-fallback" style={{display:"none"}}><Smartphone size={footer?17:20}/><span>SELL YOUR PHONE</span></span>
  </Link>;
}

export default function HomePage(){
  const [menuOpen,setMenuOpen]=useState(false);
  return <main>
    <header className="site-header"><div className="container header-inner">
      <BrandLockup/>
      <nav className={`main-nav ${menuOpen?"is-open":""}`}>
        <a href="#how" onClick={()=>setMenuOpen(false)}><ClipboardCheck size={16}/> How it works</a>
        <a href="#brands" onClick={()=>setMenuOpen(false)}><Smartphone size={16}/> Brands</a>
        <a href="#why" onClick={()=>setMenuOpen(false)}><ShieldCheck size={16}/> Why sell with us</a>
        <Link href="/admin" className="nav-signin" onClick={()=>setMenuOpen(false)}>Sign in</Link>
        <Link href="/sell" className="nav-sell" onClick={()=>setMenuOpen(false)}>Sell your phone <ArrowRight size={15}/></Link>
      </nav>
      <button className="menu-toggle" aria-label={menuOpen?"Close menu":"Open menu"} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button>
    </div></header>

    <section className="hero"><div className="container hero-layout">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot"/> A BETTER WAY TO SELL YOUR PHONE</div>
        <h1>Your old phone.<br/><span>A fresh opportunity.</span></h1>
        <p>Turn your pre-loved 5G smartphone into value with a clear evaluation, a transparent process and convenient pickup across Bengaluru.</p>
        <Link href="/sell" className="btn">Get your phone's value <ArrowRight size={17}/></Link>
        <div className="hero-proof"><span><BadgeCheck size={15}/> Guided phone evaluation</span><span><MapPin size={15}/> Bengaluru pickup</span><span><CheckCircle2 size={15}/> Clear next steps</span></div>
      </div>
      <div className="hero-device-stage" aria-label="Premium smartphone illustration">
        <div className="device-glow"/>
        <div className="device-back"><div className="camera-island"><i/><i/><i/><i/></div></div>
        <div className="device-front"><div className="dynamic-island"/><div className="screen-orbit"/><div className="screen-word">SELL<br/>SMARTER.</div></div>
        <div className="device-caption"><Sparkles size={15}/> A SIMPLE, CLEAR SELLING EXPERIENCE</div>
      </div>
    </div></section>

    <section className="section brand-section" id="brands"><div className="container">
      <div className="section-head"><div className="eyebrow">POPULAR 5G BRANDS</div><h2>Good phones deserve a good next step.</h2><p>Choose your manufacturer to find eligible 5G models.</p></div>
      <div className="brand-window"><div className="brand-track">{doubled.map(([name,slug],i)=><div className="brand-chip" key={name+i}><BrandLogo slug={slug} name={name}/><span className="brand-chip-fallback" style={{display:"none"}}>{name.slice(0,1)}</span><span>{name}</span></div>)}</div></div>
      <p className="brand-note">Our supported catalogue focuses on genuine 5G smartphones and eligible models.</p>
    </div></section>

    <section className="section how-section" id="how"><div className="container">
      <div className="section-head"><div className="eyebrow">A CLEAR JOURNEY, STEP BY STEP</div><h2>From phone details to pickup request.</h2><p>Know what to expect before you submit your phone.</p></div>
      <div className="steps-grid">
        <article><span className="step-no">01 / SELECT</span><Smartphone/><h3>Choose your phone</h3><p>Select the brand, exact model and the RAM and storage variant.</p></article>
        <article><span className="step-no">02 / EVALUATE</span><ClipboardCheck/><h3>Tell us its condition</h3><p>Answer guided questions about your phone and its condition.</p></article>
        <article><span className="step-no">03 / LOCATION</span><MapPin/><h3>Confirm pickup details</h3><p>Enter your Bengaluru pincode and select the matching postal area.</p></article>
        <article><span className="step-no">04 / SUBMIT</span><Truck/><h3>Review your request</h3><p>Check your information and submit your interest for pickup.</p></article>
      </div>
    </div></section>

    <section className="section why-section" id="why"><div className="container why-layout">
      <div><div className="eyebrow">WHY SELL WITH US</div><h2>A more thoughtful way to part with your phone.</h2><p>We want every seller to understand the process, know what information is being collected and feel confident about the next step.</p><Link href="/sell" className="text-link">Start your phone evaluation <ArrowRight size={16}/></Link></div>
      <div className="why-list">
        <div><ShieldCheck/><span><b>A guided, understandable process</b><small>Clear steps help you know what comes next.</small></span></div>
        <div><Banknote/><span><b>Model-aware valuation</b><small>Estimates can account for the phone model and its condition.</small></span></div>
        <div><MapPin/><span><b>Local pickup details</b><small>Real pincode and postal-area lookup for Bengaluru service coverage.</small></span></div>
        <div><CircleHelp/><span><b>Help at every step</b><small>Share the information needed for a more accurate evaluation.</small></span></div>
      </div>
    </div></section>

    <section className="section"><div className="container"><div className="cta-band">
      <div><div className="eyebrow">READY WHEN YOU ARE</div><h2>Let your phone make its next move.</h2><p>Start with your phone model. It only takes a few steps.</p></div>
      <Link href="/sell" className="btn btn-light">Start selling <ArrowRight size={16}/></Link>
    </div></div></section>
    <footer className="footer"><div className="container footer-inner"><BrandLockup footer/><span>© {new Date().getFullYear()} NewTurn</span><span><MapPin size={14}/> Bengaluru, Karnataka</span></div></footer>
  </main>;
}
