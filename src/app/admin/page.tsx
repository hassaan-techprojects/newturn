import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { Activity, ClipboardList, PackageCheck, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data, error } = await auth.getSession();
  if (error || !data?.user || !process.env.ADMIN_EMAIL || data.user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
    redirect("/");
  }

  return <main className="container page">
    <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,borderBottom:"1px solid var(--silver)",paddingBottom:20}}>
      <div><div className="eyebrow">NEW TURN OPERATIONS</div><h1 className="page-title" style={{marginTop:8}}>Dashboard</h1><p className="page-subtitle" style={{marginBottom:0}}>Signed in as an authorised administrator.</p></div>
      <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"var(--gray)"}}><Activity size={16}/> Live database metrics will appear here</div>
    </header>
    <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,marginTop:28}}>
      {[["Applications",ClipboardList],["Customers",Users],["Orders",PackageCheck]].map(([label,Icon])=><div key={label as string} style={{border:"1px solid var(--silver)",borderRadius:9,padding:20}}><div style={{display:"flex",alignItems:"center",gap:10,color:"var(--charcoal)"}}>{/* @ts-expect-error dynamic icon component */}<Icon size={18}/><span style={{fontSize:13,fontWeight:700}}>{label as string}</span></div><p style={{fontSize:12,color:"var(--gray)",marginBottom:0}}>Connected counts will be loaded from Neon after schema and query verification.</p></div>)}
    </section>
    <div className="status-note" style={{marginTop:22}}>No separate admin login page is used. Access to this route is restricted to the configured administrator email and a valid authenticated session. Customer accounts cannot view this dashboard.</div>
  </main>;
}
