import {NextRequest,NextResponse} from "next/server";
import {getDb} from "@/lib/db";
export const runtime="nodejs";
export async function POST(request:NextRequest){
 const body=await request.json().catch(()=>null);
 if(!body||!body.brand||!body.model||!body.customer_name||!/^\d{10}$/.test(String(body.customer_phone||""))||!/^\d{6}$/.test(String(body.pincode||""))){
  return NextResponse.json({message:"Please complete your phone, contact and pickup details."},{status:400});
 }
 try{
  const postalResponse=await fetch(`https://api.postalpincode.in/pincode/${String(body.pincode)}`,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(8000)});
  if(!postalResponse.ok) return NextResponse.json({message:"We couldn't verify your pickup pincode. Please try again."},{status:503});
  const postalPayload=await postalResponse.json();
  const offices=postalPayload?.[0]?.PostOffice??[];
  const district=String(offices[0]?.District??"");
  const state=String(offices[0]?.State??"");
  const areaIsValid=offices.some((office:{Name?:string})=>String(office.Name??"").toLowerCase()===String(body.area).trim().toLowerCase());
  if(postalPayload?.[0]?.Status!=="Success"||!(/karnataka/i.test(state)&&/bengaluru|bangalore/i.test(district))||!areaIsValid){
   return NextResponse.json({message:"Choose a valid postal area in Bengaluru, Karnataka."},{status:400});
  }
  const sql=getDb();
  const phone=String(body.customer_phone);
  const existing=await sql`SELECT id FROM customers WHERE phone=${phone} ORDER BY created_at ASC LIMIT 1`;
  const customerRows=existing.length
   ? await sql`UPDATE customers SET full_name=${String(body.customer_name)},email=${String(body.customer_email||"")||null},pincode=${String(body.pincode)},pickup_area=${String(body.area)},district=${district},state=${state},updated_at=NOW() WHERE id=${existing[0].id}::uuid RETURNING id`
   : await sql`INSERT INTO customers(full_name,phone,email,pincode,pickup_area,district,state) VALUES(${String(body.customer_name)},${phone},${String(body.customer_email||"")||null},${String(body.pincode)},${String(body.area)},${district},${state}) RETURNING id`;
  const customerId=customerRows[0].id;
  const rows=await sql`INSERT INTO applications(customer_id,brand_name,model_name,variant_label,condition_label,defects,evaluation_answers,estimated_price,deduction_total,final_estimate,pincode,pickup_area,customer_name,customer_phone,customer_email,status,source_step)
  VALUES(${customerId}::uuid,${String(body.brand)},${String(body.model)},${String(body.variant||"")},${String(body.condition||"")},${JSON.stringify(body.defects||[])}::jsonb,${JSON.stringify(body.answers||{})}::jsonb,${Math.max(0,Number(body.estimated_price)||0)},${Math.max(0,Number(body.deduction_total)||0)},${Math.max(0,Number(body.final_estimate)||0)},${String(body.pincode)},${String(body.area)},${String(body.customer_name)},${phone},${String(body.customer_email||"")||null},'incomplete','review') RETURNING id,application_code`;
  await sql`INSERT INTO application_activity(application_id,actor_email,action,details) VALUES(${rows[0].id}::uuid,${String(body.customer_email||"")||"customer"},'application_saved',${JSON.stringify({application_code:rows[0].application_code,source_step:"review"})}::jsonb)`;
  return NextResponse.json(rows[0],{status:201});
 }catch(error){return NextResponse.json({message:"We couldn't save your application right now.",detail:error instanceof Error?error.message:"Database error"},{status:503});}
}
