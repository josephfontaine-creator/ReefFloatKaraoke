/* Reef Float Karaoke: event rules shared by the browser demo backend and the Cloudflare Worker.
   ctx = {now, uid, clean, trim, device}. Keep this file free of browser-only and Worker-only code. */
function reefActions(ctx){
const {now,uid,clean,trim}=ctx;
const BLANK=()=>({v:1,mode:'requests',requests:[],queue:[],now:null,cmd:null,remixes:[],nixed:{},
  rl:{},thanks:[],game:[],votes:{},contestShow:false,settings:{coverSecs:6,autoStart:true,cornerQR:true,pin:'1234',extra:[],tipUrl:'',contest:false},player:{status:'idle',id:null,at:0},seq:0});

/* ---------- shared rules (the Worker runs the same logic server-side) ---------- */
function rate(s,key,limit,windowMs){s.rl=s.rl||{};const k=key+':'+ctx.device();const t=now();const arr=(s.rl[k]||[]).filter(x=>t-x<windowMs);if(arr.length>=limit)return false;arr.push(t);s.rl[k]=arr;return true}
function adminOk(s,a){return String(a.pin||'')===String(s.settings.pin)}
function advance(s){
  const cur=s.now&&s.queue.find(q=>q.id===s.now.id);if(cur&&cur.status!=='rejected'){cur.status='done';cur.doneAt=now()}
  const nx=s.queue.find(q=>q.status==='approved');
  if(nx){nx.status='up';s.nowN=(s.nowN||0)+1;s.now={id:nx.id,k:nx.k,title:nx.title,name:nx.name,at:now(),n:s.nowN}}
  else s.now=null;
}
/* how many turns before a new sign-up would this song last be sung? 1 = right before them. null = not within reach */
const REPEAT_GAP=3;
function repeatGap(s,k,exceptId){
  const done=s.queue.filter(q=>q.status==='done'&&q.id!==exceptId).sort((a,b)=>(a.doneAt||a.ts)-(b.doneAt||b.ts));
  const live=['up','approved','pending'].flatMap(st=>s.queue.filter(q=>q.status===st&&q.id!==exceptId));
  const seq=done.concat(live);
  for(let j=seq.length-1,g=1;j>=0&&g<=REPEAT_GAP;j--,g++)if(seq[j].k===k)return{gap:g,sung:seq[j].status==='done'};
  return null;
}
const ACTIONS={
  request(s,a){const name=trim(a.name,40),theme=trim(a.theme,60),title=trim(a.title,60),artist=trim(a.artist,40);
    if(a.type==='new'&&!title)return{ok:false,msg:'Add the song title.'};
    if(![name,theme,title,artist].every(clean))return{ok:false,msg:'Let’s keep it family friendly. Try different words.'};
    if(!rate(s,'req',5,3600e3))return{ok:false,msg:'That’s plenty of requests for now. Try again later.'};
    s.requests.push({id:uid(),type:a.type==='new'?'new':'library',k:a.k||null,title,artist,theme,name,ts:now(),dev:ctx.device()});return{ok:true}},
  queue(s,a){const name=trim(a.name,40);if(!name)return{ok:false,msg:'Add your name so we can call you up.'};
    if(!clean(name))return{ok:false,msg:'Let’s keep it family friendly. Try another name.'};
    if(s.mode!=='event')return{ok:false,msg:'The show hasn’t started yet. Send a request instead.'};
    if(s.queue.some(q=>q.dev===ctx.device()&&['pending','approved','up'].includes(q.status)))return{ok:false,msg:'You’re already in line. One song at a time!'};
    if(s.nixed&&s.nixed[a.k])return{ok:false,nixed:true,msg:'That song is taking a break tonight. Pick another one!'};
    const rep=repeatGap(s,a.k);
    if(rep&&!a.anyway)return{ok:false,repeat:rep,msg:rep.sung?'That one was just sung.':'That one is already coming up.'};
    if(!rate(s,'q',3,3600e3))return{ok:false,msg:'Give someone else a turn first.'};
    const id=uid();const item={id,k:a.k,title:trim(a.title,80),name,ts:now(),status:'pending',dev:ctx.device(),ev:s.eventId||null};if(rep)item.repeat=rep.gap;
    if(a.av)item.av=trim(a.av,60);s.queue.push(item);return{ok:true,id}},
  cancelMine(s,a){const q=s.queue.find(x=>x.id===a.id&&x.dev===ctx.device()&&['pending','approved','up'].includes(x.status));if(!q)return{ok:false};q.status='rejected';q.reason='cold feet';if(s.now&&s.now.id===q.id)advance(s);return{ok:true}},
  /* after your song: a thank-you the DJ booth sees (tips go through the DJ's own link, never through here) */
  thanks(s,a){const q=s.queue.find(x=>x.id===a.id&&x.dev===ctx.device()&&x.status==='done');if(!q)return{ok:false};
    const em=['🙌','👏','🐚','🔥','💙'].includes(a.emoji)?a.emoji:'🙌';if(q.thanked)return{ok:true};
    if(!rate(s,'thx',6,3600e3))return{ok:false};q.thanked=em;s.thanks=s.thanks||[];s.thanks.push({name:q.name,title:q.title,emoji:em,ts:now()});s.thanks=s.thanks.slice(-50);return{ok:true}},
  /* Jelly Drift: one best score per device, top 50 kept. The board outlives a single night until the DJ clears it. */
  gameScore(s,a){const sc=Math.floor(+a.score||0);if(!(sc>0&&sc<100000))return{ok:false};const name=trim(a.name,40)||'Mystery Jelly';
    if(!clean(name))return{ok:false,msg:'Let’s keep it family friendly.'};if(!rate(s,'game',40,3600e3))return{ok:false};
    s.game=s.game||[];const d=ctx.device();const ex=s.game.find(g=>g.dev===d);
    if(ex){if(sc>ex.score){ex.score=sc;ex.ts=now()}ex.name=name}else s.game.push({dev:d,name,score:sc,ts:now()});
    s.game.sort((x,y)=>y.score-x.score||x.ts-y.ts);s.game=s.game.slice(0,50);return{ok:true,rank:s.game.findIndex(g=>g.dev===d)+1}},
  /* contest mode: 1 to 5 shells, only for a performance that has finished, only during the event it was sung in, never for yourself */
  vote(s,a){if(!s.settings.contest)return{ok:false,msg:'Voting is off tonight.'};if(s.mode!=='event')return{ok:false,msg:'Voting closed when the show ended.'};
    const q=s.queue.find(x=>x.id===a.id);if(!q||q.status!=='done')return{ok:false,msg:'You can vote once the song is over.'};
    if(q.ev&&q.ev!==s.eventId)return{ok:false,msg:'That performance was on a different night.'};
    const d=ctx.device();if(q.dev===d)return{ok:false,msg:'No voting for yourself!'};
    const n=Math.round(+a.stars);if(!(n>=1&&n<=5))return{ok:false};if(!rate(s,'vote',80,3600e3))return{ok:false};
    s.votes=s.votes||{};const v=s.votes[q.id]||(s.votes[q.id]={name:q.name,title:q.title,av:q.av||null,at:q.doneAt||now(),v:{}});v.v[d]=n;return{ok:true}},
  contestReveal(s,a){if(!adminOk(s,a))return{ok:false};s.contestShow=!!a.on;return{ok:true}},
  contestClear(s,a){if(!adminOk(s,a))return{ok:false};s.votes={};s.contestShow=false;s.queue=s.queue.filter(q=>!q.sample);return{ok:true}},
  /* rehearsal: turns the contest on, starts a show if one is not running, and adds finished sample singers with votes so the host can see every screen */
  contestSample(s,a){if(!adminOk(s,a))return{ok:false};s.settings.contest=true;if(s.mode!=='event'||!s.eventId){s.mode='event';s.eventId=uid();s.nixed={};s.thanks=[];s.votes={};s.contestShow=false}
    s.queue=s.queue.filter(q=>!q.sample);for(const id in s.votes||{})if(s.votes[id].sample)delete s.votes[id];
    const names=['Sample: Maya','Sample: Theo','Sample: Grandpa Ray','Sample: The Kelp Twins'],songs=(a.songs||[]).slice(0,4),spread=[[5,5,4,5,4,5],[4,3,4,5,3],[5,4,4],[3]];
    names.forEach((name,i)=>{const c=songs[i]||{},id=uid(),t=now()-(names.length-i)*240e3;s.queue.push({id,k:trim(c.k||'sample',80),title:trim(c.title||'Sample song',80),name,ts:t-200e3,status:'done',doneAt:t,dev:'sample',ev:s.eventId,sample:true});
      s.votes[id]={name,title:trim(c.title||'Sample song',80),av:null,at:t,sample:true,v:Object.fromEntries(spread[i].map((n,j)=>['sample'+j,n]))}});return{ok:true}},
  clearGame(s,a){if(!adminOk(s,a))return{ok:false};s.game=[];return{ok:true}},
  /* admin */
  login(s,a){return adminOk(s,a)?{ok:true}:{ok:false,msg:'Wrong PIN.'}},
  setMode(s,a){if(!adminOk(s,a))return{ok:false};const was=s.mode;s.mode=a.mode==='event'?'event':'requests';
    if(s.mode==='event'&&(was!=='event'||!s.eventId)){s.eventId=uid();s.nixed={};s.thanks=[];s.votes={};s.contestShow=false}if(s.mode!=='event'){s.endedEvent=s.eventId||null;s.eventId=null}return{ok:true,eventId:s.eventId}},
  approve(s,a){if(!adminOk(s,a))return{ok:false};const q=s.queue.find(x=>x.id===a.id);if(q&&q.status==='pending')q.status='approved';if(!s.now)advance(s);return{ok:true}},
  reject(s,a){if(!adminOk(s,a))return{ok:false};const q=s.queue.find(x=>x.id===a.id);if(q){q.status='rejected';if(s.now&&s.now.id===q.id)advance(s)}return{ok:true}},
  move(s,a){if(!adminOk(s,a))return{ok:false};const i=s.queue.findIndex(x=>x.id===a.id);if(i<0)return{ok:true};
    const same=s.queue.map((q,j)=>[q,j]).filter(([q])=>q.status==='approved');const pos=same.findIndex(([q])=>q.id===a.id);const to=same[pos+(a.dir<0?-1:1)];
    if(to){const j=to[1];[s.queue[i],s.queue[j]]=[s.queue[j],s.queue[i]]}return{ok:true}},
  add(s,a){if(!adminOk(s,a))return{ok:false};const nid=uid();s.queue.push({id:nid,k:a.k,title:trim(a.title,80),name:trim(a.name,40)||'The Reef Crew',ts:now(),status:'approved',dev:'admin'});if(!s.now&&s.mode==='event'&&!a.hold)advance(s);return{ok:true,id:nid}},
  playNow(s,a){if(!adminOk(s,a))return{ok:false};const q=s.queue.find(x=>x.id===a.id);if(!q)return{ok:true};
    const cur=s.now&&s.queue.find(x=>x.id===s.now.id);if(cur&&cur.status!=='done')cur.status='approved';
    q.status='approved';s.queue.splice(s.queue.indexOf(q),1);const firstAp=s.queue.findIndex(x=>x.status==='approved');s.queue.splice(firstAp<0?s.queue.length:firstAp,0,q);
    if(cur){cur.status='done'}s.now=null;advance(s);return{ok:true}},
  nix(s,a){if(!adminOk(s,a))return{ok:false};s.nixed=s.nixed||{};if(!a.k)return{ok:false};
    if(a.on===false)delete s.nixed[a.k];else s.nixed[a.k]=now();
    return{ok:true,queued:s.queue.filter(q=>q.k===a.k&&['pending','approved'].includes(q.status)).length}},
  next(s,a){if(!adminOk(s,a))return{ok:false};advance(s);return{ok:true}},
  cmd(s,a){if(!adminOk(s,a))return{ok:false};s.cmd={type:a.type,arg:a.arg??null,n:((s.cmd&&s.cmd.n)||0)+1,at:now()};return{ok:true}},
  clearDone(s,a){if(!adminOk(s,a))return{ok:false};s.queue=s.queue.filter(q=>!['done','rejected'].includes(q.status));return{ok:true}},
  clearRequests(s,a){if(!adminOk(s,a))return{ok:false};s.requests=[];return{ok:true}},
  settings(s,a){if(!adminOk(s,a))return{ok:false};const x=a.settings||{};
    if(x.coverSecs!=null)s.settings.coverSecs=Math.max(0,Math.min(20,+x.coverSecs||0));
    if(x.autoStart!=null)s.settings.autoStart=!!x.autoStart;if(x.contest!=null)s.settings.contest=!!x.contest;if(x.cornerQR!=null)s.settings.cornerQR=!!x.cornerQR;
    if(x.extra)s.settings.extra=x.extra.map(w=>trim(w,40)).filter(Boolean).slice(0,500);
    if(x.tipUrl!=null)s.settings.tipUrl=/^https:\/\/[^\s"'<>]{4,300}$/.test(x.tipUrl)?x.tipUrl:'';
    if(x.pin&&/^\d{4,8}$/.test(x.pin))s.settings.pin=x.pin;return{ok:true}},
  saveRemix(s,a){if(!adminOk(s,a))return{ok:false};const r=a.remix;if(!r||!r.base||!Array.isArray(r.lines))return{ok:false,msg:'Missing lyrics.'};
    if(!r.lines.every(clean)||!clean(r.theme)||!clean(r.title))return{ok:false,msg:'The lyrics hit the banned-word list. Edit them first.'};
    const ex=s.remixes.find(x=>x.id===r.id);const rec={id:r.id||uid(),base:r.base,theme:trim(r.theme,60),title:trim(r.title,80),lines:r.lines.map(l=>trim(l,200)),ts:now()};
    if(ex)Object.assign(ex,rec);else s.remixes.push(rec);return{ok:true,id:rec.id}},
  deleteRemix(s,a){if(!adminOk(s,a))return{ok:false};s.remixes=s.remixes.filter(x=>x.id!==a.id);return{ok:true}},
  reset(s,a){if(!adminOk(s,a))return{ok:false};const keep={settings:s.settings,remixes:s.remixes,game:s.game||[],mode:s.mode,eventId:s.mode==='event'?uid():null,endedEvent:s.eventId||null};Object.assign(s,BLANK(),keep);return{ok:true}},
  /* player */
  player(s,a){s.player={status:a.status,id:a.id||null,at:now(),t:+a.t||0,len:+a.len||0,linked:!!a.linked,view:a.view||''};if(a.status==='ended'&&s.mode==='event'&&s.now&&s.now.id===a.id)advance(s);return{ok:true}}
};

/* contest standings: average shells, ties broken by number of votes. Needs 2 votes to place (1 in a tiny room). */
function standings(s){const all=Object.entries(s.votes||{}).map(([id,r])=>{const xs=Object.values(r.v||{});const n=xs.length;return{id,name:r.name,title:r.title,av:r.av||null,n,avg:n?Math.round(xs.reduce((p,c)=>p+c,0)/n*100)/100:0}}).filter(r=>r.n>0);
  const min=all.some(r=>r.n>=2)?2:1;return all.filter(r=>r.n>=min).sort((x,y)=>y.avg-x.avg||y.n-x.n)}
/* host view: every performance with at least one vote, including ones that do not place yet */
function tally(s){return Object.entries(s.votes||{}).map(([id,r])=>{const xs=Object.values(r.v||{}),n=xs.length;return{id,n,avg:n?Math.round(xs.reduce((p,c)=>p+c,0)/n*100)/100:0}})}
/* what a guest's phone may know: scores without device ids, and winners only after the DJ reveals them */
function publicExtras(s,dev){return{game:(s.game||[]).slice(0,10).map(g=>({name:g.name,score:g.score,mine:dev?g.dev===dev:false})),
  contest:{on:!!(s.settings&&s.settings.contest),show:!!s.contestShow,votes:Object.values(s.votes||{}).reduce((p,r)=>p+Object.keys(r.v||{}).length,0),board:s.contestShow?standings(s).slice(0,10):null}}}
function ahead(s,id){const live=s.queue.filter(q=>['up','approved'].includes(q.status));const i=live.findIndex(q=>q.id===id);return i<0?-1:i}
return {BLANK,ACTIONS,advance,ahead,repeatGap,REPEAT_GAP,standings,tally,publicExtras};
}
if(typeof module!=='undefined'&&module.exports)module.exports=reefActions;
