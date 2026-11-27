import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { Activity, ClipboardList, PackageCheck, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data, error } = await auth.getSession();
  if (error || !data?.user || !process.env.ADMIN_EMAIL || data.user.email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) redirect("/");

  return <main className="container page">
    <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,borderBottom:"1px solid var(--silver)",paddingBottom:20}}>
      <div><div className="eyebrow">NEW TURN OPERATIONS</div><h1 className="page-title" style={{marginTop:8}}>Dashboard</h1><p className="page-subtitle" style={{marginBottom:0}}>Authorised administrator workspace</p></div>
      <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"var(--gray)"}}><Activity size={16}/> Operations overview</div>
    </header>
    <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,marginTop:28}}>
      <article style={{border:"1px solid var(--silver)",borderRadius:9,padding:20}}><ClipboardList size={19}/><h3 style={{fontSize:14}}>Applications</h3><p style={{fontSize:12,color:"var(--gray)"}}>Live Neon count and application status breakdown will be connected here.</p></article>
      <article style={{border:"1px solid var(--silver)",borderRadius:9,padding:20}}><Users size={19}/><h3 style={{fontSize:14}}>Customers</h3><p style={{fontSize:12,color:"var(--gray)"}}>Customer profiles and verified contact details.</p></article>
      <article style={{border:"1px solid var(--silver)",borderRadius:9,padding:20}}><PackageCheck size={19}/><h3 style={{fontSize:14}}>Orders</h3><p style={{fontSize:12,color:"var(--gray)"}}>Submitted sale requests and pickup lifecycle.</p></article>
    </section>
    <div className="status-note" style={{marginTop:22}}>There is no separate admin login page. Access is restricted to the configured administrator email and a valid authenticated session. Customer accounts cannot view this dashboard. Live metrics are not displayed until database queries are connected.</div>
  </main>;
}
