import {NextRequest,NextResponse} from "next/server";
import {cookies} from "next/headers";
import {S3Client,PutObjectCommand} from "@aws-sdk/client-s3";
import {ADMIN_COOKIE,verifyAdminToken} from "@/lib/admin-session";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const safe=(v:string)=>v.toLowerCase().trim().replace(/[^a-z0-9-]+/g,"-").replace(/^-|-$/g,"");
export async function POST(request:NextRequest){
 if(!verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value))return NextResponse.json({message:"Unauthorized"},{status:401});
 const form=await request.formData();
 const file=form.get("file");
 const kind=String(form.get("kind")||"");
 const brand= safe(String(form.get("brand")||""));
 const slug= safe(String(form.get("slug")||""));
 if(!(file instanceof File)||!slug||!["brand","phone"].includes(kind))return NextResponse.json({message:"Choose an image and provide its item name."},{status:400});
 const allowed:Record<string,string>={"image/png":"png","image/jpeg":"jpg","image/webp":"webp","image/svg+xml":"svg"};
 const ext=allowed[file.type];
 if(!ext)return NextResponse.json({message:"Use SVG, PNG, JPG or WebP images."},{status:415});
 if(file.size>5*1024*1024)return NextResponse.json({message:"Image must be 5 MB or smaller."},{status:413});
 const endpoint=process.env.AWS_ENDPOINT_URL_S3,region=process.env.AWS_REGION;
 if(!endpoint||!region||!process.env.AWS_ACCESS_KEY_ID||!process.env.AWS_SECRET_ACCESS_KEY){
  return NextResponse.json({message:"Neon Object Storage credentials are not configured in this environment. Pull the object-storage environment variables with the Neon CLI and add them to Vercel."},{status:503});
 }
 const key=kind==="brand"?`brands/${slug}.${ext}`:`phones/${brand||"other"}/${slug}.${ext}`;
 try{
  const client=new S3Client({region,endpoint,forcePathStyle:true,credentials:{accessKeyId:process.env.AWS_ACCESS_KEY_ID,secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY}});
  await client.send(new PutObjectCommand({Bucket:"photos",Key:key,Body:Buffer.from(await file.arrayBuffer()),ContentType:file.type,CacheControl:"public, max-age=31536000, immutable"}));
  return NextResponse.json({ok:true,key,url:`${endpoint.replace(/\/$/,"")}/photos/${key}`});
 }catch(error){return NextResponse.json({message:error instanceof Error?error.message:"Image upload failed."},{status:502});}
}
