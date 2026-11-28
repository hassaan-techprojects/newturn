"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, Banknote, CheckCircle2, ClipboardCheck, MapPin, Menu, PackageCheck, ShieldCheck, Smartphone, Truck, X, Sparkles, CircleHelp } from "lucide-react";
import { useEffect, useState } from "react";

const brands = [
  ["Apple","apple"],["Samsung","samsung"],["realme","realme"],["Redmi","redmi"],["Xiaomi","xiaomi"],
  ["OnePlus","oneplus"],["Motorola","motorola"],["POCO","poco"],["OPPO","oppo"],["vivo","vivo"],
  ["iQOO","iqoo"],["Nothing","nothing"],["CMF","cmf"],["ASUS","asus"],["Google","google"]
] as const;


function BrandLogo({slug,name}:{slug:string;name:string}) {
  const source=slug.startsWith("/")||slug.startsWith("http")?slug:`/images/brands/${slug}.svg`;
  return <img src={source} alt={name} loading="lazy"
    onError={e=>{e.currentTarget.style.display="none";const fallback=e.currentTarget.nextElementSibling as HTMLElement|null;if(fallback)fallback.style.display="grid";}}/>;
}
function BrandLockup({footer=false}:{footer?:boolean}) {
  return <Link href="/" className="newturn-wordmark" aria-label="NewTurn home">
    <span className="newturn-mark"><Smartphone size={footer?20:22} strokeWidth={1.8}/></span>
    <span className="newturn-wordmark-copy"><strong>NEW TURN</strong><small>SELL YOUR PHONE</small></span>
  </Link>;
}

export default function HomePage(){
  const [menuOpen,setMenuOpen]=useState(false);
  const [catalogBrands,setCatalogBrands]=useState<{name:string;slug:string;logo_path?:string}[]>(brands.map(([name,slug])=>({name,slug})));
  useEffect(()=>{const nodes=[...document.querySelectorAll(".section,.steps-grid article,.why-list>div,.cta-band")];nodes.forEach(node=>node.classList.add("reveal-on-scroll"));const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:"0px 0px -35px 0px"});nodes.forEach(node=>observer.observe(node));return()=>observer.disconnect();},[]);
  useEffect(()=>{fetch("/api/catalog").then(r=>r.ok?r.json():null).then(data=>{if(data?.brands?.length)setCatalogBrands(data.brands.map((b:{name:string;slug:string;logo_path?:string})=>({...b,slug:b.logo_path||b.slug})));}).catch(()=>{});},[]);
  const doubled=[...catalogBrands,...catalogBrands];
  return <main>
    <header className="site-header"><div className="container header-inner">
      <BrandLockup/>
      <nav className={`main-nav ${menuOpen?"is-open":""}`} aria-label="Main navigation">
        <Link href="/" onClick={()=>setMenuOpen(false)}><Smartphone size={17} strokeWidth={1.8}/> Home</Link>
        <a href="#brands" onClick={()=>setMenuOpen(false)}><PackageCheck size={17} strokeWidth={1.8}/> Brands</a>
        <Link href="/sell" className="nav-sell" onClick={()=>setMenuOpen(false)}>Sell <ArrowRight size={15}/></Link>
        <Link href="/admin" className="nav-account" aria-label="Account" title="Account" onClick={()=>setMenuOpen(false)}><span>Account</span><span className="account-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/></svg></span></Link>
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
        <div className="device-front"><div className="dynamic-island"/><div className="screen-orbit"/><img className="newturn-phone-logo" src="/images/brand/newturn-logo.svg" alt="NewTurn logo on phone screen" onError={e=>{e.currentTarget.style.display="none";}}/><div className="screen-word">SELL<br/>SMARTER.</div></div>
        <div className="device-caption"><Sparkles size={15}/> A SIMPLE, CLEAR SELLING EXPERIENCE</div>
      </div>
    </div></section>

    <section className="section brand-section" id="brands"><div className="container">
      <div className="section-head"><div className="eyebrow">POPULAR 5G BRANDS</div><h2>Good phones deserve a good next step.</h2><p>Choose your manufacturer to find eligible 5G models.</p></div>
      <div className="brand-window"><div className="brand-track">{doubled.map((brand,i)=><div className="brand-chip" key={`${brand.slug}-${i}`}><BrandLogo slug={brand.slug} name={brand.name}/><span className="brand-chip-fallback" style={{display:"none"}}>{brand.name.slice(0,1)}</span><span>{brand.name}</span></div>)}</div></div>
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

    <section className="section" id="faq"><div className="container"><div className="section-head"><div className="eyebrow">GOOD TO KNOW</div><h2>Questions, answered clearly.</h2></div><div className="faq-grid"><article><h3>Which phones can I sell?</h3><p>We currently list eligible 5G smartphones from supported brands. The available models and variants are shown in the selling flow.</p></article><article><h3>How is my estimated value calculated?</h3><p>Your starting estimate depends on the selected model and variant. Condition deductions are shown before you submit.</p></article><article><h3>Where is pickup available?</h3><p>Our initial service area is Bengaluru. Enter your pincode to check the matching postal area.</p></article><article><h3>Is the estimate final?</h3><p>The estimate is indicative and may be confirmed after the phone is physically inspected.</p></article></div></div></section>

    <section className="section" id="contact"><div className="container"><div className="contact-strip"><div><div className="eyebrow">HERE TO HELP</div><h2>Need a hand with your sale?</h2><p>Contact our NewTurn support team for help with your application or pickup details.</p></div><a href="mailto:support@newturn.in" className="btn">Email support</a></div></div></section>

    <section className="section"><div className="container"><div className="cta-band">
      <div><div className="eyebrow">READY WHEN YOU ARE</div><h2>Let your phone make its next move.</h2><p>Start with your phone model. It only takes a few steps.</p></div>
      <Link href="/sell" className="btn btn-light">Start selling <ArrowRight size={16}/></Link>
    </div></div></section>

    <footer className="footer"><div className="container"><div className="footer-grid"><div className="footer-col footer-brand-col"><BrandLockup footer/><p>A clearer way to sell your pre-loved 5G smartphone. Starting with Bengaluru.</p><p><MapPin size={14}/> Bengaluru, Karnataka, India</p><a href="mailto:support@newturn.in">support@newturn.in</a></div><div className="footer-col"><h4>SELL YOUR PHONE</h4><Link href="/sell">Start selling</Link><a href="#how">How it works</a><a href="#brands">Supported brands</a><a href="#faq">FAQs</a></div><div className="footer-col"><h4>NEW TURN</h4><a href="#why">Why NewTurn</a><a href="#contact">Contact</a><Link href="/admin">Admin sign in</Link></div><div className="footer-col"><h4>LEGAL</h4><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms & conditions</Link><a href="mailto:support@newturn.in?subject=Data%20request">Data & support requests</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} NewTurn. All rights reserved.</span><span>Sample contact details — update before public launch.</span><span>Made for a better next turn.</span></div></div></footer>
  </main>;
}
