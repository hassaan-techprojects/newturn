"use client";
import { useState } from "react";
import { LogOut } from "lucide-react";
export default function AdminSignOutButton(){
 const [busy,setBusy]=useState(false);
 async function signOut(){setBusy(true);await fetch("/api/admin/session",{method:"DELETE"});window.location.assign("/");}
 return <button className="pill" onClick={signOut} disabled={busy} style={{display:"inline-flex",alignItems:"center",gap:7}}><LogOut size={14}/>{busy?"Signing out…":"Sign out"}</button>;
}
