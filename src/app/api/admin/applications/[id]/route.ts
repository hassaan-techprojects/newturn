import { NextRequest,NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { ADMIN_COOKIE,verifyAdminToken } from "@/lib/admin-session";
export const runtime="nodejs";
const allowed=async()=>verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);
export async function PATCH(request:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(!await allowed())return NextResponse.json({message:"Unauthorized"},{status:401});
 const {id}=await params,body=await request.json().catch(()=>null);
 const callStatuses=["pending","interested","not_interested","no_response","busy","switched_off"];
 const orderStatuses=["new","pickup_scheduled","picked_up","inspected","completed","cancelled"];
 try{
  const sql=getDb();
  if(body?.call_status&&callStatuses.includes(body.call_status)){
   const rows=await sql`UPDATE applications SET call_status=${body.call_status},updated_at=NOW() WHERE id=${id}::uuid RETURNING *`;
   await sql`INSERT INTO application_activity(application_id,actor_email,action,details) VALUES(${id}::uuid,${process.env.ADMIN_EMAIL||"admin"},'call_status_changed',${JSON.stringify({call_status:body.call_status})}::jsonb)`;
   return NextResponse.json(rows[0]);
  }
  if(body?.order_status&&orderStatuses.includes(body.order_status)){
   const rows=await sql`UPDATE orders SET order_status=${body.order_status},updated_at=NOW() WHERE id=${id}::uuid RETURNING *`;
   if(rows[0]) await sql`INSERT INTO application_activity(application_id,order_id,actor_email,action,details) VALUES(${rows[0].application_id}::uuid,${id}::uuid,${process.env.ADMIN_EMAIL||"admin"},'order_status_changed',${JSON.stringify({order_status:body.order_status})}::jsonb)`;
   return NextResponse.json(rows[0]??{});
  }
  return NextResponse.json({message:"Unsupported status"},{status:400});
 }catch(error){return NextResponse.json({message:error instanceof Error?error.message:"Could not update record"},{status:400});}
}
