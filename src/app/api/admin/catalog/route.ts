import { NextRequest,NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { ADMIN_COOKIE,verifyAdminToken } from "@/lib/admin-session";
export const runtime="nodejs";
export const dynamic="force-dynamic";
async function allowed(){return verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);}
export async function GET(){
 if(!await allowed())return NextResponse.json({message:"Unauthorized"},{status:401});
 try{
  const sql=getDb();
  const [brands,models,variants,defects]=await Promise.all([
   sql`SELECT * FROM brands ORDER BY sort_order,name`,
   sql`SELECT m.*,b.name AS brand_name FROM phone_models m JOIN brands b ON b.id=m.brand_id ORDER BY b.sort_order,b.name,m.name`,
   sql`SELECT v.*,m.name AS model_name,b.name AS brand_name FROM model_variants v JOIN phone_models m ON m.id=v.model_id JOIN brands b ON b.id=m.brand_id ORDER BY b.name,m.name,v.ram_gb,v.storage_gb`,
   sql`SELECT d.*,m.name AS model_name,b.name AS brand_name FROM defect_rules d JOIN phone_models m ON m.id=d.model_id JOIN brands b ON b.id=m.brand_id ORDER BY b.name,m.name,d.label`
  ]);
  return NextResponse.json({brands,models,variants,defects});
 }catch(error){return NextResponse.json({message:"Could not load catalogue. Apply the NewTurn database migration.",detail:error instanceof Error?error.message:"Database error"},{status:503});}
}
export async function POST(request:NextRequest){
 if(!await allowed())return NextResponse.json({message:"Unauthorized"},{status:401});
 const body=await request.json().catch(()=>null);
 if(!body)return NextResponse.json({message:"Invalid request"},{status:400});
 try{
  const sql=getDb();
  if(body.entity==="brand"){
   const name=String(body.name??"").trim(),slug=String(body.slug??"").trim().toLowerCase();
   if(!name||!slug)return NextResponse.json({message:"Brand name and slug are required"},{status:400});
   const rows=await sql`INSERT INTO brands(name,slug,logo_path,sort_order,is_active) VALUES(${name},${slug},${body.logo_path||null},${Number(body.sort_order)||0},${body.is_active!==false}) RETURNING *`;
   return NextResponse.json(rows[0],{status:201});
  }
  if(body.entity==="model"){
   const brandId=String(body.brand_id??""),name=String(body.name??"").trim(),slug=String(body.slug??"").trim().toLowerCase();
   if(!brandId||!name||!slug)return NextResponse.json({message:"Brand, model name and slug are required"},{status:400});
   const rows=await sql`INSERT INTO phone_models(brand_id,name,slug,image_path,base_price,is_active) VALUES(${brandId}::uuid,${name},${slug},${body.image_path||null},${Math.max(0,Number(body.base_price)||0)},${body.is_active!==false}) RETURNING *`;
   return NextResponse.json(rows[0],{status:201});
  }
  if(body.entity==="variant"){
   const rows=await sql`INSERT INTO model_variants(model_id,ram_gb,storage_gb,price_adjustment) VALUES(${body.model_id}::uuid,${Number(body.ram_gb)},${Number(body.storage_gb)},${Number(body.price_adjustment)||0}) RETURNING *`;
   return NextResponse.json(rows[0],{status:201});
  }
  if(body.entity==="defect"){
   const rows=await sql`INSERT INTO defect_rules(model_id,defect_key,label,deduction_amount) VALUES(${body.model_id}::uuid,${String(body.defect_key)},${String(body.label)},${Math.max(0,Number(body.deduction_amount)||0)}) RETURNING *`;
   return NextResponse.json(rows[0],{status:201});
  }
  return NextResponse.json({message:"Unknown catalogue entity"},{status:400});
 }catch(error){return NextResponse.json({message:error instanceof Error?error.message:"Could not save catalogue item"},{status:400});}
}
