import { cookies } from "next/headers";
import { Activity, ClipboardList, PackageCheck, Users, Smartphone, MapPin, Settings2, type LucideIcon } from "lucide-react";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-session";
import AdminLoginForm from "./admin-login-form";
import AdminSignOutButton from "./admin-sign-out-button";

export const dynamic = "force-dynamic";

const adminNav: { label: string; Icon: LucideIcon }[] = [
  { label: "Overview", Icon: Activity }, { label: "Applications", Icon: ClipboardList },
  { label: "Orders", Icon: PackageCheck }, { label: "Customers", Icon: Users },
  { label: "Phone catalogue", Icon: Smartphone }, { label: "Pickup areas", Icon: MapPin },
  { label: "Settings", Icon: Settings2 },
];

export default async function AdminPage() {
  const cookieStore = await cookies();
  const authorised = verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!authorised) return <main className="container page"><div className="breadcrumb">NewTurn　›　Admin</div><div style={{maxWidth:440,margin:"48px auto"}}><AdminLoginForm/></div></main>;

  return <main className="container page">
    <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,borderBottom:"1px solid var(--silver)",paddingBottom:20}}>
      <div><div className="eyebrow">NEW TURN OPERATIONS</div><h1 className="page-title" style={{marginTop:8}}>Dashboard</h1><p className="page-subtitle" style={{marginBottom:0}}>Authorised administrator workspace</p></div>
      <AdminSignOutButton/>
    </header>
    <nav style={{display:"flex",gap:9,flexWrap:"wrap",marginTop:22}}>
      {adminNav.map(({label,Icon})=><span key={label} className="pill" style={{display:"inline-flex",alignItems:"center",gap:7}}><Icon size={14}/>{label}</span>)}
    </nav>
    <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,marginTop:26}}>
      <article style={{border:"1px solid var(--silver)",borderRadius:9,padding:20}}><ClipboardList size={19}/><h3 style={{fontSize:14}}>Applications</h3><p style={{fontSize:12,color:"var(--gray)"}}>Waiting for the live application database connection.</p></article>
      <article style={{border:"1px solid var(--silver)",borderRadius:9,padding:20}}><Users size={19}/><h3 style={{fontSize:14}}>Customers</h3><p style={{fontSize:12,color:"var(--gray)"}}>Customer profiles and verified contact details.</p></article>
      <article style={{border:"1px solid var(--silver)",borderRadius:9,padding:20}}><PackageCheck size={19}/><h3 style={{fontSize:14}}>Orders</h3><p style={{fontSize:12,color:"var(--gray)"}}>Submitted sale requests and pickup lifecycle.</p></article>
    </section>
    <div className="status-note" style={{marginTop:22}}>Admin access is protected by a signed, HTTP-only session cookie. Customer browsing and selling do not require a sign-in. OTP-based customer account creation will be connected after the location step in a later phase.</div>
  </main>;
}
