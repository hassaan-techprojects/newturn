import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { ADMIN_COOKIE,verifyAdminToken } from "@/lib/admin-session";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:Request){
 if(!verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))return NextResponse.json({message:"Unauthorized"},{status:401});
 try{
  const status=new URL(request.url).searchParams.get("call_status");
  const sql=getDb();
  const rows=status
   ? await sql`SELECT * FROM applications WHERE call_status=${status} ORDER BY created_at DESC LIMIT 200`
   : await sql`SELECT * FROM applications ORDER BY created_at DESC LIMIT 200`;
  return NextResponse.json({applications:rows});
 }catch(error){return NextResponse.json({message:"Could not load applications. Apply the database migration.",detail:error instanceof Error?error.message:"Database error"},{status:503});}
}
