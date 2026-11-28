"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Home, ClipboardList, MapPin, Search, Smartphone, ShieldCheck } from "lucide-react";

const brands = [
  ["Apple","apple"],["Samsung","samsung"],["realme","realme"],["Redmi","xiaomi"],["Xiaomi","xiaomi"],
  ["OnePlus","oneplus"],["Motorola","motorola"],["POCO","poco"],["OPPO","oppo"],["vivo","vivo"],
  ["iQOO","iqoo"],["Nothing","nothing"],["CMF","nothing"],["ASUS","asus"],["Google","google"]
] as const;
const models: Record<string,string[]> = {
  Apple:["iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16","iPhone 15 Pro Max","iPhone 15","iPhone 14"],
  Samsung:["Galaxy S25 Ultra","Galaxy S25+","Galaxy S25","Galaxy S24 Ultra","Galaxy A56 5G"],
  OnePlus:["OnePlus 13","OnePlus 13R","OnePlus 12","OnePlus Nord 4"],
  Google:["Pixel 9 Pro XL","Pixel 9 Pro","Pixel 9","Pixel 8a"],
  Xiaomi:["Xiaomi 15 Ultra","Xiaomi 15","Xiaomi 14"],
  Redmi:["Redmi Note 14 Pro+ 5G","Redmi Note 14 Pro 5G","Redmi Note 13 5G"],
  realme:["realme GT 7 Pro","realme 14 Pro+ 5G","realme 13 Pro 5G"],
  Motorola:["Edge 60 Pro","Edge 50 Pro","Moto G85 5G"],
  POCO:["POCO F7","POCO X7 Pro","POCO X7 5G"],
  OPPO:["Find X8 Pro","Reno 13 Pro 5G","Reno 12 5G"],
  vivo:["X200 Pro","V50 5G","V40 Pro"],
  iQOO:["iQOO 13","iQOO Neo 10","iQOO Z10"],
  Nothing:["Phone (3)","Phone (2a) Plus","Phone (2a)"],
  CMF:["CMF Phone 2 Pro","CMF Phone 1"],
  ASUS:["ROG Phone 9 Pro","ROG Phone 8"]
};
type Step = "brand"|"model"|"variant"|"condition"|"location"|"details"|"review";
type AreaResult = {ok:boolean;serviceable?:boolean;message:string;district?:string;state?:string;areas?:string[]};
const brandLogo=(slug:string)=>slug.startsWith("/")||slug.startsWith("http")?slug:`/images/brands/${slug}.svg`;
const modelSlug=(value:string)=>value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

export default function SellPage() {
  const [step,setStep]=useState<Step>("brand");
  const [catalogBrands,setCatalogBrands]=useState<{id:string;name:string;slug:string;logo_path?:string}[]>([]);
  const [selectedBrandId,setSelectedBrandId]=useState("");
  const [catalogModels,setCatalogModels]=useState<{id:string;brand_id:string;name:string;slug:string;image_path?:string;base_price:number}[]>([]);
  const [catalogVariants,setCatalogVariants]=useState<{id:string;model_id:string;ram_gb:number;storage_gb:number;price_adjustment:number}[]>([]);
  const [catalogDefects,setCatalogDefects]=useState<{id:string;model_id:string;defect_key:string;label:string;deduction_amount:number}[]>([]);
  const [selectedDefects,setSelectedDefects]=useState<string[]>([]);
  const [selectedModelId,setSelectedModelId]=useState("");
  const [brand,setBrand]=useState(""); const [model,setModel]=useState(""); const [variant,setVariant]=useState("");
  const [query,setQuery]=useState(""); const [pincode,setPincode]=useState(""); const [area,setArea]=useState("");
  const [areaResult,setAreaResult]=useState<AreaResult|null>(null); const [checking,setChecking]=useState(false);
  const [condition,setCondition]=useState("Good"); const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [email,setEmail]=useState("");
  const [applicationId,setApplicationId]=useState(""); const [savingApplication,setSavingApplication]=useState(false); const [submission,setSubmission]=useState("");

  const filteredBrands=useMemo(()=>catalogBrands.length?catalogBrands.filter(b=>b.name.toLowerCase().includes(query.toLowerCase())).map(b=>[b.name,b.slug] as const):brands.filter(([name])=>name.toLowerCase().includes(query.toLowerCase())),[query,catalogBrands]);
  const filteredModels=(catalogModels.length?catalogModels.filter(m=>m.brand_id===selectedBrandId&&m.name.toLowerCase().includes(query.toLowerCase())).map(m=>m.name):((models[brand]??[]).filter(item=>item.toLowerCase().includes(query.toLowerCase()))));
  const availableVariants=catalogVariants.filter(v=>v.model_id===selectedModelId);
  const selectedModelData=catalogModels.find(m=>m.id===selectedModelId);
  const selectedVariantData=availableVariants.find(v=>`${v.ram_gb} GB / ${v.storage_gb} GB`===variant);
  const modelDefects=catalogDefects.filter(d=>d.model_id===selectedModelId);
  const baseEstimate=Number(selectedModelData?.base_price||0)+Number(selectedVariantData?.price_adjustment||0);
  const deductionTotal=modelDefects.filter(d=>selectedDefects.includes(d.defect_key)).reduce((sum,d)=>sum+Number(d.deduction_amount),0);
  useEffect(()=>{fetch("/api/catalog").then(r=>r.ok?r.json():null).then(data=>{if(data){setCatalogBrands((data.brands||[]).map((b:{id:string;name:string;slug:string;logo_path?:string})=>({...b,slug:b.logo_path||b.slug})));setCatalogModels(data.models||[]);setCatalogVariants(data.variants||[]);setCatalogDefects(data.defects||[]);}}).catch(()=>{});},[]);
  const steps:Step[]=["brand","model","variant","condition","location","details","review"];
  const stepIndex=steps.indexOf(step);
  async function saveApplication() {
    setSavingApplication(true); setSubmission("");
    try {
      const response=await fetch("/api/applications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({brand,model,variant,condition,pincode,area,customer_name:name,customer_phone:phone,customer_email:email,defects:modelDefects.filter(d=>selectedDefects.includes(d.defect_key)),estimated_price:baseEstimate,deduction_total:deductionTotal,final_estimate:Math.max(0,baseEstimate-deductionTotal)})});
      const result=await response.json(); if(!response.ok) throw new Error(result.message||"Could not save your application.");
      setApplicationId(result.id); setStep("review");
    } catch(error) { setSubmission(error instanceof Error?error.message:"Could not save your application."); }
    finally { setSavingApplication(false); }
  }
  async function submitSale() {
    if(!applicationId)return; setSavingApplication(true); setSubmission("");
    try { const response=await fetch(`/api/applications/${applicationId}/submit`,{method:"POST"}); const result=await response.json(); if(!response.ok) throw new Error(result.message||"Could not submit your request."); setSubmission(`Request submitted. Application: ${result.application_code} · Order: ${result.order_code}`); }
    catch(error) { setSubmission(error instanceof Error?error.message:"Could not submit your request."); }
    finally { setSavingApplication(false); }
  }
  async function lookupPincode() {
    setChecking(true); setAreaResult(null); setArea("");
    try { const response=await fetch(`/api/location/pincode?pincode=${pincode}`); const result=await response.json() as AreaResult; setAreaResult(result); }
    catch { setAreaResult({ok:false,message:"Pincode lookup failed. Please try again."}); }
    finally { setChecking(false); }
  }
  return <main className="container page" id="top">
    <header className="site-header" style={{position:"static",height:64,border:0}}>
      <div className="header-inner"><Link href="/" className="brand-lockup newturn-wordmark"><span className="newturn-mark"><Smartphone size={19}/></span><span className="newturn-wordmark-copy"><strong>NEW TURN</strong><small>SELL YOUR PHONE</small></span></Link><div style={{display:"flex",alignItems:"center",gap:14}}><Link href="/admin" className="pill">Sign in</Link><span style={{fontSize:12,color:"var(--gray)"}}>5G phone pickup · Bengaluru</span></div></div>
    </header>
    <div style={{paddingTop:30}}>
      <div className="breadcrumb"><Link href="/">Home</Link>　›　Sell your phone　›　{step==="details"?"Your details":step==="review"?"Review":step==="location"?"Pickup location":step==="condition"?"Phone condition":step}</div>
      <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:28}}>{steps.map((s,i)=><div key={s} title={s} style={{height:4,flex:1,borderRadius:8,background:i<=stepIndex?"var(--black)":"var(--silver)"}}/>)}</div>
      {step==="brand"&&<><h1 className="page-title">Choose your phone brand</h1><p className="page-subtitle">Select a brand to see supported 5G smartphones.</p><div style={{position:"relative",maxWidth:520}}><Search size={17} style={{position:"absolute",left:14,top:24,color:"var(--gray)"}}/><input className="search" style={{paddingLeft:42}} placeholder="Search brands" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="brand-grid">{filteredBrands.map(([label,slug])=><button className="brand-card" key={label} onClick={()=>{setBrand(label);setSelectedBrandId(catalogBrands.find(b=>b.name===label)?.id||"");setStep("model");setQuery("");setSelectedModelId("");}}><img src={brandLogo(slug)} alt={label} onError={e=>{e.currentTarget.style.display="none";const f=e.currentTarget.nextElementSibling as HTMLElement|null;if(f)f.style.display="grid";}}/><span className="brand-card-fallback" style={{display:"none"}}>{label.slice(0,1)}</span><span>{label}</span></button>)}</div></>}
      {step==="model"&&<><button className="pill" onClick={()=>setStep("brand")}><ArrowLeft size={13} style={{display:"inline"}}/> Brands</button><h1 className="page-title" style={{marginTop:20}}>Select your {brand} model</h1><p className="page-subtitle">Only supported 5G models should be listed here.</p><input className="search" placeholder="Search model" value={query} onChange={e=>setQuery(e.target.value)}/><div className="model-grid">{filteredModels.map(item=><button className="model-card" key={item} onClick={()=>{setModel(item);setSelectedModelId(catalogModels.find(m=>m.name===item)?.id||"");setVariant("");setSelectedDefects([]);setStep("variant");setQuery("");}}><div className="model-image"><img className="model-brand-mark" src={brandLogo(catalogBrands.find(b=>b.id===selectedBrandId)?.slug||brands.find(([n])=>n===brand)?.[1]||brand.toLowerCase())} alt={`${brand} logo`} onError={e=>{e.currentTarget.style.display="none";}}/><img src={catalogModels.find(m=>m.name===item)?.image_path||`/images/phones/${brand.toLowerCase()}/${modelSlug(item)}.webp`} alt={item} onError={e=>{e.currentTarget.style.display="none";const f=e.currentTarget.nextElementSibling as HTMLElement|null;if(f)f.style.display="grid";}}/><span className="model-image-fallback"><Smartphone size={76} strokeWidth={1.15}/></span></div><strong>{item}</strong><small>5G smartphone</small></button>)}</div></>}
      {step==="variant"&&<><button className="pill" onClick={()=>setStep("model")}><ArrowLeft size={13} style={{display:"inline"}}/> Models</button><h1 className="page-title" style={{marginTop:20}}>Choose RAM and storage</h1><p className="page-subtitle">{brand} {model} · Choose the exact variant printed in your phone settings.</p><div className="variant-grid">{availableVariants.map(v=>{const value=`${v.ram_gb} GB / ${v.storage_gb} GB`;return <button key={v.id} className={`variant-card ${variant===value?"selected":""}`} onClick={()=>setVariant(value)}>{value}</button>;})}</div>{!availableVariants.length&&<div className="status-note" style={{maxWidth:720}}>Verified RAM and storage options have not been added for this model yet. Please choose another model or ask the administrator to add the exact variants.</div>}{Boolean(baseEstimate)&&<div className="status-note" style={{maxWidth:720,marginTop:18}}>Indicative starting value: <strong>₹{baseEstimate.toLocaleString("en-IN")}</strong>. This is a provisional estimate before condition deductions.</div>}<button className="btn" disabled={!variant||!availableVariants.length} style={{marginTop:24}} onClick={()=>setStep("condition")}>Continue <ArrowRight size={16}/></button></>}
      {step==="condition"&&<><button className="pill" onClick={()=>setStep("variant")}><ArrowLeft size={13} style={{display:"inline"}}/> Variant</button><h1 className="page-title" style={{marginTop:20}}>How is your phone's condition?</h1><p className="page-subtitle">This is an initial condition selection. Detailed checks and model-specific deductions will be applied in the full evaluation.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,maxWidth:760}}>{["Like new","Good","Average","Needs repair"].map(value=><button key={value} className={`variant-card ${condition===value?"selected":""}`} onClick={()=>setCondition(value)} style={{minHeight:86}}><Smartphone size={21}/><div style={{marginTop:8}}>{value}</div></button>)}</div><div className="status-note" style={{maxWidth:760,marginTop:20}}>Select any issues that apply. Each deduction is attached to the exact model you selected and can be edited in the admin dashboard.</div><div className="defect-grid" style={{maxWidth:760,marginTop:14}}>{modelDefects.map(d=><label key={d.id} className="defect-option"><input type="checkbox" checked={selectedDefects.includes(d.defect_key)} onChange={e=>setSelectedDefects(old=>e.target.checked?[...old,d.defect_key]:old.filter(k=>k!==d.defect_key))}/><span>{d.label}</span><strong>−₹{Number(d.deduction_amount).toLocaleString("en-IN")}</strong></label>)}</div><div className="estimate-panel" style={{maxWidth:760,marginTop:15}}><div><span>Starting value</span><strong>₹{baseEstimate.toLocaleString("en-IN")}</strong></div><div><span>Condition deductions</span><strong>−₹{deductionTotal.toLocaleString("en-IN")}</strong></div><div className="estimate-total"><span>Estimated offer</span><strong>₹{Math.max(0,baseEstimate-deductionTotal).toLocaleString("en-IN")}</strong></div></div><button className="btn" style={{marginTop:22}} onClick={()=>setStep("location")}>Continue to pickup location <ArrowRight size={16}/></button></>}
      {step==="location"&&<><button className="pill" onClick={()=>setStep("condition")}><ArrowLeft size={13} style={{display:"inline"}}/> Condition</button><h1 className="page-title" style={{marginTop:20}}>Where should we pick up?</h1><p className="page-subtitle">Enter your Bengaluru pincode. We'll look up the actual postal areas before asking for your details.</p><section className="form-card"><div style={{display:"flex",alignItems:"center",gap:10,fontWeight:750}}><MapPin size={20}/> Bengaluru, Karnataka</div><label className="field-label" htmlFor="pincode">6-digit pincode</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><input id="pincode" className="field-input" style={{maxWidth:220}} inputMode="numeric" maxLength={6} value={pincode} onChange={e=>{setPincode(e.target.value.replace(/\D/g,"").slice(0,6));setAreaResult(null);}} placeholder="e.g. 560001"/><button className="btn" disabled={pincode.length!==6||checking} onClick={lookupPincode}>{checking?"Checking…":"Find area"}</button></div>{areaResult&&<div className="status-note" style={{marginTop:16}}>{areaResult.message}{areaResult.ok&&areaResult.areas&&<><label className="field-label" htmlFor="area">Choose your area / post office</label><select id="area" className="field-input" value={area} onChange={e=>setArea(e.target.value)}><option value="">Select your area</option>{areaResult.areas.map(value=><option key={value} value={value}>{value}</option>)}</select></>}</div>}<button className="btn" style={{marginTop:20}} disabled={!areaResult?.ok||!area} onClick={()=>setStep("details")}>Next <ArrowRight size={16}/></button></section></>}
      {step==="details"&&<><button className="pill" onClick={()=>setStep("location")}><ArrowLeft size={13} style={{display:"inline"}}/> Pickup location</button><h1 className="page-title" style={{marginTop:20}}>Your contact details</h1><p className="page-subtitle">Add your details to continue. OTP is not enabled yet, so you can move forward without verification.</p><section className="form-card"><div className="status-note" style={{marginBottom:18}}><Check size={14} style={{display:"inline"}}/> {area}, {areaResult?.district} · {pincode}</div><label className="field-label" htmlFor="customer-name">Full name</label><input id="customer-name" className="field-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name"/><label className="field-label" htmlFor="customer-phone">Mobile number</label><input id="customer-phone" className="field-input" inputMode="tel" maxLength={10} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} placeholder="10-digit mobile number"/><label className="field-label" htmlFor="customer-email">Email (optional)</label><input id="customer-email" className="field-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/><div className="status-note" style={{marginTop:16}}>No OTP is sent yet. We'll save your contact profile and unfinished application so the team can follow up. Secure phone verification and customer sign-in will be enabled when SMS is connected.</div><button className="btn" style={{marginTop:20}} onClick={saveApplication} disabled={name.trim().length<2||phone.length!==10||savingApplication}>{savingApplication?"Saving…":"Next"} <ArrowRight size={16}/></button>{submission&&<p role="alert" style={{marginTop:12,fontSize:12,color:"var(--teal)"}}>{submission}</p>}</section></>}
      {step==="review"&&<><button className="pill" onClick={()=>setStep("details")}><ArrowLeft size={13} style={{display:"inline"}}/> Edit details</button><h1 className="page-title" style={{marginTop:20}}>Review your phone details</h1><p className="page-subtitle">Check your selections before continuing.</p><section className="form-card"><div style={{display:"grid",gap:13}}>{[["Phone",brand+" "+model],["RAM / Storage",variant],["Condition",condition],["Pickup area",area+", "+(areaResult?.district??"Bengaluru")],["Pincode",pincode],["Name",name],["Mobile",phone],["Email",email||"Not provided"],["Estimated offer","₹"+Math.max(0,baseEstimate-deductionTotal).toLocaleString("en-IN")],["Selected defects",modelDefects.filter(d=>selectedDefects.includes(d.defect_key)).map(d=>d.label).join(", ")||"None"]].map(([label,value])=><div key={label} style={{display:"flex",justifyContent:"space-between",gap:18,borderBottom:"1px solid var(--silver)",paddingBottom:11,fontSize:13}}><span style={{color:"var(--gray)"}}>{label}</span><strong style={{textAlign:"right"}}>{value}</strong></div>)}</div><div className="status-note" style={{marginTop:18}}>Your contact profile and application are saved as incomplete. Submit below to create an order. Secure phone verification and customer sign-in will be enabled when SMS is connected.</div>{submission&&<p role="status" style={{marginTop:12,fontSize:12,color:"var(--teal)"}}>{submission}</p>}<div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:20}}><button className="btn btn-outline" onClick={()=>setStep("condition")}>Back to evaluation <ArrowLeft size={16}/></button><button className="btn" disabled={savingApplication||!applicationId||Boolean(submission.startsWith("Request submitted"))} onClick={submitSale}>{savingApplication?"Submitting…":"Submit selling request"} <ArrowRight size={16}/></button></div></section></>}
    </div>
    <nav className="mobile-site-nav" aria-label="Quick navigation"><Link href="/"><Home size={18}/><span>Home</span></Link><a href="#top" className="active"><Smartphone size={18}/><span>Sell</span></a><Link href="/admin"><ClipboardList size={18}/><span>Dashboard</span></Link></nav>
  </main>;
}
