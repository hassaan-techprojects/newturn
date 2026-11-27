import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getDb} from "@/lib/db";
import {ADMIN_COOKIE,verifyAdminToken} from "@/lib/admin-session";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){
 if(!verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))return NextResponse.json({message:"Unauthorized"},{status:401});
 try{const sql=getDb();const orders=await sql`SELECT o.*,a.application_code,a.brand_name,a.model_name,a.variant_label,a.customer_name,a.customer_phone,a.pickup_area,a.pincode FROM orders o JOIN applications a ON a.id=o.application_id ORDER BY o.created_at DESC LIMIT 300`;return NextResponse.json({orders});}
 catch(error){return NextResponse.json({message:"Could not load orders.",detail:error instanceof Error?error.message:"Database error"},{status:503});}
}
