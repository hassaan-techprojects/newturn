"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Banknote, CircleHelp, ClipboardCheck, MapPin, Menu, PackageCheck, ShieldCheck, Smartphone, Truck, X } from "lucide-react";
import { useState } from "react";

const brands = [
  ["Apple","apple"],["Samsung","samsung"],["realme","realme"],["Redmi","xiaomi"],["Xiaomi","xiaomi"],
  ["OnePlus","oneplus"],["Motorola","motorola"],["POCO","poco"],["OPPO","oppo"],["vivo","vivo"],
  ["iQOO","iqoo"],["Nothing","nothing"],["CMF","nothing"],["ASUS","asus"],["Google","google"]
];
const brandIcon = (slug:string) => `https://cdn.simpleicons.org/${slug}/404040`;
const doubled = [...brands,...brands];

export default function HomePage(){
  const [menuOpen,setMenuOpen]=useState(false);
  return <main>
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-lockup" aria-label="NewTurn home"><span className="brand-symbol"><Smartphone size={22}/></span><span className="brand-word">newturn</span></Link>
        <nav className={`main-nav ${menuOpen?"is-open":""}`}>
          <a href="#how" onClick={()=>setMenuOpen(false)}><ClipboardCheck size={16}/> How it works</a>
          <a href="#brands" onClick={()=>setMenuOpen(false)}><Smartphone size={16}/> Brands</a>
          <a href="#why" onClick={()=>setMenuOpen(false)}><ShieldCheck size={16}/> Why NewTurn</a>
          <Link href="/admin" className="nav-signin" onClick={()=>setMenuOpen(false)}>Sign in</Link><Link href="/sell" className="nav-sell" onClick={()=>setMenuOpen(false)}>Sell your phone <ArrowRight size={15}/></Link>
        </nav>
        <button className="menu-toggle" aria-label={menuOpen?"Close menu":"Open menu"} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button>
      </div>
    </header>
    <section className="hero">
      <div className="container hero-layout">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot"/> THE SMARTER WAY TO SELL</div>
          <h1>Give your 5G phone<br/><span>a better next turn.</span></h1>
          <p>Get a clear estimate for your pre-loved smartphone, complete a guided condition check and arrange pickup across Bengaluru.</p>
          <Link href="/sell" className="btn">Get your phone's value <ArrowRight size={17}/></Link>
          <div className="hero-proof"><span><BadgeCheck size={15}/> Guided evaluation</span><span><MapPin size={15}/> Bengaluru pickup</span></div>
        </div>
        <div className="hero-device-stage" aria-label="Illustration of a modern smartphone">
          <div className="device-glow"/>
          <div className="device-back"><div className="camera-island"><i/><i/><i/></div><span className="device-mark">N</span></div>
          <div className="device-front"><div className="dynamic-island"/><div className="screen-orbit"/><div className="screen-word">NEXT<br/>TURN.</div></div>
          <div className="device-caption"><Smartphone size={15}/> YOUR NEXT UPGRADE STARTS HERE</div>
        </div>
      </div>
    </section>
    <section className="section brand-section" id="brands">
      <div className="container">
        <div className="section-head"><div className="eyebrow">BRANDS WE ACCEPT</div><h2>Your brand. Your model. Your offer.</h2><p>Choose from supported 5G smartphones.</p></div>
        <div className="brand-window"><div className="brand-track">{doubled.map(([name,slug],i)=><div className="brand-chip" key={name+i}><img src={brandIcon(slug)} alt="" loading="lazy" onError={e=>{e.currentTarget.style.display="none"}}/><span>{name}</span></div>)}</div></div>
        <p className="brand-note">Only eligible 5G models are listed during the selling process.</p>
      </div>
    </section>
    <section className="section how-section" id="how"><div className="container"><div className="section-head"><div className="eyebrow">SIMPLE FROM START TO PICKUP</div><h2>Four steps. One smoother sale.</h2></div>
      <div className="steps-grid"><article><span className="step-no">01</span><Smartphone/><h3>Choose your phone</h3><p>Select brand, exact model and available storage variant.</p></article><article><span className="step-no">02</span><MapPin/><h3>Confirm your location</h3><p>Enter your Bengaluru pickup address and pincode.</p></article><article><span className="step-no">03</span><ShieldCheck/><h3>Verify and evaluate</h3><p>Verify your phone number, then complete the condition check.</p></article><article><span className="step-no">04</span><Truck/><h3>Submit for pickup</h3><p>Review your offer and send your selling request.</p></article></div>
    </div></section>
    <section className="section why-section" id="why"><div className="container why-layout"><div><div className="eyebrow">THE NEWTURN DIFFERENCE</div><h2>A clear process, without the guesswork.</h2><p>Know what happens at every step, from your first estimate to the final device inspection.</p><Link href="/sell" className="text-link">Start your evaluation <ArrowRight size={16}/></Link></div><div className="why-list"><div><Banknote/><span><b>Transparent estimates</b><small>See an indicative value before the condition check.</small></span></div><div><ClipboardCheck/><span><b>Model-aware evaluation</b><small>Condition adjustments are designed around the selected phone model.</small></span></div><div><PackageCheck/><span><b>Convenient pickup</b><small>Share your location and request a pickup in Bengaluru.</small></span></div><div><CircleHelp/><span><b>Guided at every step</b><small>Simple questions help capture the actual condition of your phone.</small></span></div></div></div></section>
    <section className="section"><div className="container"><div className="cta-band"><div><div className="eyebrow">READY FOR A NEW TURN?</div><h2>Your old phone still has value.</h2><p>Find out what it could be worth in a few simple steps.</p></div><Link href="/sell" className="btn btn-light">Check my phone <ArrowRight size={16}/></Link></div></div></section>
    <footer className="footer"><div className="container footer-inner"><Link href="/" className="brand-lockup"><span className="brand-symbol"><Smartphone size={18}/></span><span className="brand-word">newturn</span></Link><span>© {new Date().getFullYear()} NewTurn</span><span><MapPin size={14}/> Bengaluru, Karnataka</span></div></footer>
  </main>;
}
