import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getDb} from "@/lib/db";
import {ADMIN_COOKIE,verifyAdminToken} from "@/lib/admin-session";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){
 if(!verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))return NextResponse.json({message:"Unauthorized"},{status:401});
 try{const sql=getDb();const customers=await sql`SELECT c.*,COUNT(a.id)::int AS application_count FROM customers c LEFT JOIN applications a ON a.customer_id=c.id GROUP BY c.id ORDER BY c.created_at DESC LIMIT 300`;return NextResponse.json({customers});}
 catch(error){return NextResponse.json({message:"Customer accounts will appear after OTP account creation is enabled.",detail:error instanceof Error?error.message:"Database error"},{status:503});}
}
