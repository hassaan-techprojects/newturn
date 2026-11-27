import {NextResponse} from "next/server";
import {getDb} from "@/lib/db";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){
 try{
  const sql=getDb();
  const [brands,models,variants,defects]=await Promise.all([
   sql`SELECT id,name,slug,logo_path FROM brands WHERE is_active=TRUE ORDER BY sort_order,name`,
   sql`SELECT id,brand_id,name,slug,image_path,base_price FROM phone_models WHERE is_active=TRUE AND network_type='5G' ORDER BY name`,
   sql`SELECT id,model_id,ram_gb,storage_gb,price_adjustment FROM model_variants WHERE is_active=TRUE ORDER BY ram_gb,storage_gb`,
   sql`SELECT id,model_id,defect_key,label,deduction_amount FROM defect_rules WHERE is_active=TRUE ORDER BY label`
  ]);
  return NextResponse.json({brands,models,variants,defects});
 }catch(error){return NextResponse.json({message:"Phone catalogue is being prepared."},{status:503});}
}
