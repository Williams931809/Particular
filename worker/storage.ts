export interface Env { DB:D1Database; AUDIO:R2Bucket; API_TOKEN:string; ALLOWED_ORIGIN:string }
const json=(data:unknown,status=200)=>Response.json(data,{status});
export default {async fetch(req:Request,env:Env):Promise<Response>{
const origin=req.headers.get('Origin')||'';
const headers={'Access-Control-Allow-Origin':origin===env.ALLOWED_ORIGIN?origin:env.ALLOWED_ORIGIN,'Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Authorization,Content-Type','Vary':'Origin'};
if(req.method==='OPTIONS')return new Response(null,{headers});
const respond=(data:unknown,status=200)=>{const r=json(data,status);Object.entries(headers).forEach(([k,v])=>r.headers.set(k,v));return r};
if(req.headers.get('Authorization')!==`Bearer ${env.API_TOKEN}`)return respond({error:'Unauthorized'},401);
const u=new URL(req.url);
if(u.pathname==='/api/projects'&&req.method==='GET'){const rows=await env.DB.prepare('SELECT id,title,genre,bpm FROM projects ORDER BY rowid DESC').all();return respond(rows.results)}
if(u.pathname==='/api/projects'&&req.method==='POST'){const body=await req.json() as {title?:string;genre?:string;bpm?:number};const id=crypto.randomUUID();await env.DB.prepare('INSERT INTO projects(id,user_id,title,genre,bpm) VALUES(?,?,?,?,?)').bind(id,'owner',String(body.title||'Untitled').slice(0,120),body.genre||'Afrobeats',body.bpm||105).run();return respond({id},201)}
if(u.pathname==='/api/audio'&&req.method==='POST'){const project=u.searchParams.get('project');if(!project)return respond({error:'project required'},400);const exists=await env.DB.prepare('SELECT id FROM projects WHERE id=?').bind(project).first();if(!exists)return respond({error:'Unknown project'},404);const id=crypto.randomUUID();const bytes=await req.arrayBuffer();if(bytes.byteLength>25_000_000)return respond({error:'Maximum 25MB'},413);const key=`${project}/${id}`;await env.AUDIO.put(key,bytes,{httpMetadata:{contentType:req.headers.get('Content-Type')||'application/octet-stream'}});await env.DB.prepare('INSERT INTO tracks(id,project_id,r2_key,kind) VALUES(?,?,?,?)').bind(id,project,key,'vocal').run();return respond({id,key},201)}
return respond({error:'Not found'},404);
}};