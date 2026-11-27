import { NextRequest,NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { ADMIN_COOKIE,verifyAdminToken } from "@/lib/admin-session";
export const runtime="nodejs";
async function allowed(){return verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);}
export async function PATCH(request:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(!await allowed())return NextResponse.json({message:"Unauthorized"},{status:401});
 const {id}=await params,body=await request.json().catch(()=>null);
 if(!body)return NextResponse.json({message:"Invalid request"},{status:400});
 try{
  const sql=getDb();let rows:any[]=[];
  if(body.entity==="brand") rows=await sql`UPDATE brands SET name=${String(body.name).trim()},slug=${String(body.slug).trim().toLowerCase()},logo_path=${body.logo_path||null},is_active=${body.is_active!==false},sort_order=${Number(body.sort_order)||0},updated_at=NOW() WHERE id=${id}::uuid RETURNING *`;
  else if(body.entity==="model") rows=await sql`UPDATE phone_models SET brand_id=${body.brand_id}::uuid,name=${String(body.name).trim()},slug=${String(body.slug).trim().toLowerCase()},image_path=${body.image_path||null},base_price=${Math.max(0,Number(body.base_price)||0)},is_active=${body.is_active!==false},updated_at=NOW() WHERE id=${id}::uuid RETURNING *`;
  else if(body.entity==="defect") rows=await sql`UPDATE defect_rules SET label=${String(body.label).trim()},deduction_amount=${Math.max(0,Number(body.deduction_amount)||0)},is_active=${body.is_active!==false},updated_at=NOW() WHERE id=${id}::uuid RETURNING *`;
  else return NextResponse.json({message:"Unknown catalogue entity"},{status:400});
  if(!rows.length)return NextResponse.json({message:"Item not found"},{status:404});
  return NextResponse.json(rows[0]);
 }catch(error){return NextResponse.json({message:error instanceof Error?error.message:"Could not update item"},{status:400});}
}
export async function DELETE(request:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(!await allowed())return NextResponse.json({message:"Unauthorized"},{status:401});
 const {id}=await params,entity=request.nextUrl.searchParams.get("entity");
 try{
  const sql=getDb();let rows:any[]=[];
  if(entity==="brand")rows=await sql`DELETE FROM brands WHERE id=${id}::uuid RETURNING id`;
  else if(entity==="model")rows=await sql`DELETE FROM phone_models WHERE id=${id}::uuid RETURNING id`;
  else if(entity==="defect")rows=await sql`DELETE FROM defect_rules WHERE id=${id}::uuid RETURNING id`;
  else return NextResponse.json({message:"Unknown catalogue entity"},{status:400});
  return rows.length?NextResponse.json({ok:true}):NextResponse.json({message:"Item not found"},{status:404});
 }catch(error){return NextResponse.json({message:error instanceof Error?error.message:"Could not delete item"},{status:400});}
}
