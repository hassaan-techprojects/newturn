import Link from "next/link";
export default function NotFound(){return <main className="container page" style={{textAlign:"center"}}><h1 className="page-title">Page not found</h1><p className="page-subtitle">The page you are looking for does not exist.</p><Link href="/" className="btn">Back to home</Link></main>}
