import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export default function AdminPage() {
  return <main className="container page" style={{display:"grid",placeItems:"center"}}>
    <section style={{maxWidth:480,textAlign:"center",border:"1px solid var(--line)",borderRadius:16,padding:32}}>
      <div className="benefit-icon" style={{margin:"0 auto 18px"}}><LockKeyhole/></div>
      <h1 className="page-title">NewTurn Admin</h1>
      <p className="page-subtitle">The operations dashboard will be available after secure admin authentication and Neon database setup are verified.</p>
      <Link className="btn" href="/admin/login">Admin sign in</Link>
    </section>
  </main>;
}
