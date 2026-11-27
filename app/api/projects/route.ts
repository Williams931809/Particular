import {NextRequest,NextResponse} from 'next/server';
const base=process.env.PARTICULAR_API_URL;const token=process.env.PARTICULAR_API_TOKEN;
async function proxy(req:NextRequest){if(!base||!token)return NextResponse.json({error:'Cloudflare credentials are not configured on Vercel'},{status:503});const res=await fetch(base+'/api/projects',{method:req.method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:req.method==='POST'?await req.text():undefined,cache:'no-store'});return new NextResponse(await res.text(),{status:res.status,headers:{'Content-Type':'application/json'}})}
export const GET=proxy;export const POST=proxy;
