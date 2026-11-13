/* Reef Float Karaoke: event layer shared by the player, join.html and admin.html.
   Backend: set REEF_WORKER_URL (in event-config.js) to the deployed Cloudflare Worker. Until then a demo
   backend keeps all state in this browser and syncs between tabs on the same device. */
(function(){
const WORKER=(window.REEF_WORKER_URL||'').replace(/\/$/,'');
/* rooms: every DJ has a code (?room=joe-halloween). The link wins; otherwise the last room this browser used. */
const ROOM=(()=>{let r=null;try{r=new URLSearchParams(location.search).get('room');if(r)localStorage.setItem('reefev:room',r);else r=localStorage.getItem('reefev:room')}catch(e){}
  r=String(r||'main').toLowerCase();return /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/.test(r)?r:'main'})();
const KEY=ROOM==='main'?'reefev:state':'reefev:state:'+ROOM,DEV='reefev:device',CH='reefev:'+ROOM;
const now=()=>Date.now();
const uid=()=>Math.random().toString(36).slice(2,9)+now().toString(36).slice(-4);
const device=(()=>{try{let d=localStorage.getItem(DEV);if(!d){d=uid();localStorage.setItem(DEV,d)}return d}catch(e){return 'anon'}})();
const clean=t=>!window.ReefFilter||window.ReefFilter.clean(t);
const trim=(s,n)=>String(s||'').replace(/\s+/g,' ').trim().slice(0,n);
const {BLANK,ACTIONS}=reefActions({now,uid,clean,trim,device:()=>device});

/* ---------- demo backend: localStorage + BroadcastChannel ---------- */
function makeDemo(){
  let bc=null;try{bc=new BroadcastChannel(CH)}catch(e){}
  const load=()=>{try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.v===1)return Object.assign(BLANK(),s)}catch(e){}return BLANK()};
  const listeners=new Set();
  const emit=s=>listeners.forEach(f=>{try{f(s)}catch(e){console.error(e)}});
  const save=s=>{s.seq=(s.seq||0)+1;try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}if(bc)bc.postMessage(s.seq);emit(s)};
  const onExternal=()=>emit(load());
  if(bc)bc.onmessage=onExternal;
  window.addEventListener('storage',e=>{if(e.key===KEY)onExternal()});
  return{kind:'demo',load,save,subscribe(f){listeners.add(f);f(load());return()=>listeners.delete(f)},
    async call(action,args){const s=load();const r=ACTIONS[action](s,args||{});if(r&&r.ok!==false)save(s);return r||{ok:true}}};
}

/* ---------- Cloudflare Worker backend (used once REEF_WORKER_URL is set) ---------- */
function makeRemote(){
  const listeners=new Set();let last=BLANK(),ws=null,retry=0;
  const emit=()=>listeners.forEach(f=>{try{f(last)}catch(e){console.error(e)}});
  function connect(){try{ws=new WebSocket(WORKER.replace(/^http/,'ws')+'/live?room='+encodeURIComponent(ROOM)+'&device='+encodeURIComponent(device)+(window.EV&&EV.pin?'&pin='+encodeURIComponent(EV.pin):''));
    ws.onmessage=e=>{try{last=JSON.parse(e.data);retry=0;api.online=true;emit()}catch(_){}};
    ws.onclose=()=>{api.online=false;emit();if(ws&&ws._dead)return;setTimeout(connect,Math.min(15000,1000*2**retry++))};}catch(e){setTimeout(connect,5000)}}
  const reconnect=()=>{if(ws){ws._dead=true;try{ws.close()}catch(e){}}retry=0;connect()};
  /* phones freeze background tabs and drop the socket; reconnect the moment the page is looked at again */
  const wake=()=>{if(document.visibilityState==='visible'&&(!ws||ws.readyState>1))reconnect()};
  document.addEventListener('visibilitychange',wake);window.addEventListener('online',wake);window.addEventListener('pageshow',wake);
  fetch(WORKER+'/act/hello?room='+encodeURIComponent(ROOM),{method:'POST',headers:{'content-type':'application/json'},body:'{}'}).then(r=>r.status===404?r.json():null).then(j=>{
    if(j&&/no room/i.test(j.msg||'')){api.missing=true;if(ws){ws._dead=true;try{ws.close()}catch(e){}}const d=document.createElement('div');d.textContent=j.msg;
      d.style.cssText='position:fixed;left:12px;right:12px;top:12px;z-index:99;background:#f3c56b;color:#2a1a00;font:700 15px/1.4 system-ui,sans-serif;padding:14px 16px;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.4)';document.body.appendChild(d)}}).catch(()=>{});
  const api={kind:'worker',online:false,reconnect,load:()=>last,subscribe(f){listeners.add(f);f(last);if(!ws)connect();return()=>listeners.delete(f)},
    async call(action,args){try{const r=await fetch(WORKER+'/act/'+action+'?room='+encodeURIComponent(ROOM),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(Object.assign({device},args||{}))});return await r.json()}catch(e){return{ok:false,msg:'Can’t reach the reef right now. Try again in a moment.'}}}};
  return api;
}

const backend=WORKER?makeRemote():makeDemo();
const EV={room:ROOM,backend,device,state:backend.load(),pin:'',
  on(f){return backend.subscribe(s=>{EV.state=s;if(window.ReefFilter)window.ReefFilter.setExtra((s.settings||{}).extra||[]);f(s)})},
  call(action,args){return backend.call(action,Object.assign({pin:EV.pin},args||{}))},
  reconnect(){if(backend.reconnect)backend.reconnect()},
  isDemo:backend.kind==='demo'};
window.EV=EV;
})();
