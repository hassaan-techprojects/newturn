import {NextResponse} from "next/server";
import {getDb} from "@/lib/db";
export const runtime="nodejs";
export async function POST(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 try{
  const sql=getDb();
  const rows=await sql`UPDATE applications SET status='submitted',updated_at=NOW() WHERE id=${id}::uuid AND status IN ('incomplete','submitted') RETURNING *`;
  if(!rows.length)return NextResponse.json({message:"Application not found."},{status:404});
  const orders=await sql`INSERT INTO orders(application_id,customer_id) VALUES(${id}::uuid,${rows[0].customer_id}) ON CONFLICT(application_id) DO UPDATE SET updated_at=NOW() RETURNING order_code`;
  await sql`INSERT INTO application_activity(application_id,order_id,actor_email,action,details) SELECT ${id}::uuid,o.id,'customer','order_submitted',jsonb_build_object('application_code',${rows[0].application_code}) FROM orders o WHERE o.application_id=${id}::uuid`;
  return NextResponse.json({ok:true,application_code:rows[0].application_code,order_code:orders[0].order_code});
 }catch(error){return NextResponse.json({message:"Could not submit your sale request.",detail:error instanceof Error?error.message:"Database error"},{status:503});}
}
