import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { SignOutButton } from "./sign-out-button";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  if (!auth) redirect("/");
  const { data, error } = await auth.getSession();
  if (error || !data?.user) redirect("/auth/sign-in");

  return <main className="container page">
    <header className="topbar"><Link href="/" className="brand">new<span>turn</span></Link><SignOutButton/></header>
    <section style={{maxWidth:680,margin:"55px auto",border:"1px solid var(--line)",borderRadius:16,padding:30}}>
      <div className="eyebrow">Your NewTurn account</div>
      <h1 className="page-title" style={{marginTop:8}}>You're signed in.</h1>
      <p className="page-subtitle">This profile is loaded from the current Neon Auth session.</p>
      <div style={{background:"var(--soft)",borderRadius:10,padding:18,display:"grid",gap:12}}>
        <div><span style={{fontSize:11,color:"var(--muted)"}}>Name</span><div style={{fontWeight:700}}>{data.user.name}</div></div>
        <div><span style={{fontSize:11,color:"var(--muted)"}}>Email</span><div style={{fontWeight:700}}>{data.user.email}</div></div>
        <div><span style={{fontSize:11,color:"var(--muted)"}}>User ID</span><div style={{fontSize:12,overflowWrap:"anywhere"}}>{data.user.id}</div></div>
      </div>
      <Link href="/sell" className="btn" style={{marginTop:22}}>Continue to sell your phone</Link>
    </section>
  </main>;
}
