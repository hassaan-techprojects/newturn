import {NextRequest,NextResponse} from "next/server";
import {getDb} from "@/lib/db";
export const runtime="nodejs";
export async function POST(request:NextRequest){
 const body=await request.json().catch(()=>null);
 if(!body||!body.brand||!body.model||!body.customer_name||!/^\d{10}$/.test(String(body.customer_phone||""))||!/^\d{6}$/.test(String(body.pincode||""))){
  return NextResponse.json({message:"Please complete your phone, contact and pickup details."},{status:400});
 }
 try{
  const sql=getDb();
  const rows=await sql`INSERT INTO applications(brand_name,model_name,variant_label,condition_label,defects,evaluation_answers,estimated_price,deduction_total,final_estimate,pincode,pickup_area,customer_name,customer_phone,customer_email,status,source_step)
  VALUES(${String(body.brand)},${String(body.model)},${String(body.variant||"")},${String(body.condition||"")},${JSON.stringify(body.defects||[])}::jsonb,${JSON.stringify(body.answers||{})}::jsonb,${Math.max(0,Number(body.estimated_price)||0)},${Math.max(0,Number(body.deduction_total)||0)},${Math.max(0,Number(body.final_estimate)||0)},${String(body.pincode)},${String(body.area)},${String(body.customer_name)},${String(body.customer_phone)},${String(body.customer_email||"")||null},'incomplete','review') RETURNING id,application_code`;
  await sql`INSERT INTO application_activity(application_id,actor_email,action,details) VALUES(${rows[0].id}::uuid,${String(body.customer_email||"")||"customer"},'application_saved',${JSON.stringify({application_code:rows[0].application_code,source_step:"review"})}::jsonb)`;
  return NextResponse.json(rows[0],{status:201});
 }catch(error){return NextResponse.json({message:"We couldn't save your application right now.",detail:error instanceof Error?error.message:"Database error"},{status:503});}
}
