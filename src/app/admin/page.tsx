import {cookies} from "next/headers";
import {ADMIN_COOKIE,verifyAdminToken} from "@/lib/admin-session";
import AdminLoginForm from "./admin-login-form";
import AdminWorkspace from "./admin-workspace";
export const dynamic="force-dynamic";
export default async function AdminPage(){
 const authorised=verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);
 if(!authorised)return <main className="container page"><div className="breadcrumb">NewTurn　›　Admin</div><div style={{maxWidth:450,margin:"50px auto"}}><AdminLoginForm/></div></main>;
 return <AdminWorkspace/>;
}
