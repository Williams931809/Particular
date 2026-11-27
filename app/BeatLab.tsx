'use client';
import {useEffect,useRef,useState} from 'react';
type Genre='Afrobeats'|'Amapiano'|'Hip-hop'|'Highlife'|'R&B';
const patterns:Record<Genre,{kick:number[];snare:number[];hat:number[];shaker:number[]}> = {
Afrobeats:{kick:[0,6,10,14],snare:[4,12],hat:[0,2,4,6,8,10,12,14],shaker:[1,3,5,7,9,11,13,15]},
Amapiano:{kick:[0,4,8,12],snare:[4,12],hat:[2,6,10,14],shaker:[1,3,5,7,9,11,13,15]},
'Hip-hop':{kick:[0,7,10],snare:[4,12],hat:[0,2,4,6,8,10,12,14],shaker:[]},
Highlife:{kick:[0,6,8,14],snare:[4,12],hat:[0,2,4,6,8,10,12,14],shaker:[3,7,11,15]},
'R&B':{kick:[0,8,11],snare:[4,12],hat:[0,4,8,12],shaker:[2,6,10,14]}};
export default function BeatLab(){
const [genre,setGenre]=useState<Genre>('Afrobeats'),[bpm,setBpm]=useState(105),[playing,setPlaying]=useState(false),[volume,setVolume]=useState(.5),[step,setStep]=useState(0);
const ctx=useRef<AudioContext|null>(null),timer=useRef<ReturnType<typeof setInterval>|null>(null),pos=useRef(0);
function hit(type:'kick'|'snare'|'hat'|'shaker',at:number){const c=ctx.current;if(!c)return;const gain=c.createGain();gain.connect(c.destination);gain.gain.setValueAtTime(volume*(type==='kick'?.9:.35),at);gain.gain.exponentialRampToValueAtTime(.001,at+(type==='kick'?.23:.08));
if(type==='kick'){const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(155,at);o.frequency.exponentialRampToValueAtTime(48,at+.18);o.connect(gain);o.start(at);o.stop(at+.24)}
else{const length=Math.floor(c.sampleRate*.1),buffer=c.createBuffer(1,length,c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=Math.random()*2-1;const source=c.createBufferSource();source.buffer=buffer;const filter=c.createBiquadFilter();filter.type=type==='snare'?'bandpass':'highpass';filter.frequency.value=type==='snare'?1800:6500;source.connect(filter);filter.connect(gain);source.start(at);source.stop(at+.1)}}
function stop(){if(timer.current)clearInterval(timer.current);timer.current=null;setPlaying(false);pos.current=0;setStep(0)}
function start(){if(!ctx.current)ctx.current=new AudioContext();ctx.current.resume();pos.current=0;setPlaying(true)}
useEffect(()=>{if(!playing)return;const interval=60000/bpm/4;const play=()=>{const n=pos.current%16;setStep(n);const t=ctx.current?.currentTime||0;for(const instrument of ['kick','snare','hat','shaker'] as const)if(patterns[genre][instrument].includes(n))hit(instrument,t+.008);pos.current++};play();timer.current=setInterval(play,interval);return()=>{if(timer.current)clearInterval(timer.current)}},[playing,bpm,genre,volume]);
useEffect(()=>()=>{if(timer.current)clearInterval(timer.current);ctx.current?.close()},[]);
return <section><h2>Beat Lab <span style={{fontSize:13,color:'#bfa7ff'}}>Live drum preview</span></h2><p className="muted">Play an original, adjustable rhythm while you rehearse your vocal. This is a browser drum sequencer, not AI-generated accompaniment or automatic vocal alignment.</p><label>Style <select value={genre} onChange={e=>setGenre(e.target.value as Genre)}>{Object.keys(patterns).map(g=><option key={g}>{g}</option>)}</select></label><label>Tempo <input type="number" min="60" max="190" value={bpm} onChange={e=>setBpm(Math.max(60,Math.min(190,Number(e.target.value)||105)))}/></label><label>Volume <input aria-label="Beat volume" type="range" min="0" max="1" step=".05" value={volume} onChange={e=>setVolume(Number(e.target.value))}/></label><div style={{display:'flex',gap:5,margin:'20px 0'}}>{Array.from({length:16},(_,i)=><div key={i} style={{flex:1,height:40,borderRadius:6,background:playing&&step===i?'#ad7aff':patterns[genre].kick.includes(i)?'#584076':'#29263a'}}/>)}</div><button onClick={playing?stop:start}>{playing?'Stop beat':'Play beat'}</button><p className="muted">For the best timing, select a BPM close to your freestyle. AI tempo detection and full arrangement are still in development.</p></section>
}