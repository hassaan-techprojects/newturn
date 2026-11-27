import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin-session";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){
 const token=(await cookies()).get(ADMIN_COOKIE)?.value;
 if(!verifyAdminToken(token)) return NextResponse.json({message:"Unauthorized"},{status:401});
 try{
  const sql=getDb();
  const [apps,orders,customers,calls,activity]=await Promise.all([
   sql`SELECT COUNT(*)::int AS total, COUNT(*) FILTER(WHERE status='incomplete')::int AS incomplete, COUNT(*) FILTER(WHERE status='submitted')::int AS submitted, COUNT(*) FILTER(WHERE status='converted')::int AS converted FROM applications`,
   sql`SELECT COUNT(*)::int AS total, COUNT(*) FILTER(WHERE order_status='new')::int AS new, COUNT(*) FILTER(WHERE order_status='pickup_scheduled')::int AS pickup_scheduled, COUNT(*) FILTER(WHERE order_status='picked_up')::int AS picked_up, COUNT(*) FILTER(WHERE order_status='inspected')::int AS inspected, COUNT(*) FILTER(WHERE order_status='completed')::int AS completed, COUNT(*) FILTER(WHERE order_status='cancelled')::int AS cancelled FROM orders`,
   sql`SELECT COUNT(*)::int AS total FROM customers`,
   sql`SELECT call_status,COUNT(*)::int AS total FROM applications GROUP BY call_status`,
   sql`SELECT id,action,actor_email,details,created_at FROM application_activity ORDER BY created_at DESC LIMIT 8`
  ]);
  const callCounts=Object.fromEntries(calls.map((r:any)=>[r.call_status,r.total]));
  return NextResponse.json({applications:apps[0],orders:orders[0],customers:customers[0],calls:callCounts,activity});
 }catch(error){return NextResponse.json({message:"Dashboard data is not ready. Apply database/migrations/001_newturn_core.sql in Neon first.",detail:error instanceof Error?error.message:"Database error"},{status:503});}
}
