/* Reef Float Karaoke service worker: shows "your turn is coming" notifications for the join page. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(_){}
  e.waitUntil(self.registration.showNotification(d.title||'Reef Float Karaoke',{body:d.body||'',icon:'icon-180.png',badge:'icon-180.png',tag:d.tag||'reef',renotify:true,vibrate:[200,100,200,100,300],data:d,
    actions:d.qid?[{action:'sing',title:'🎤 I\u2019m ready!'},{action:'cold',title:'🥶 Cold feet'}]:[]}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const d=e.notification.data||{};
  if(e.action==='cold'&&d.worker&&d.qid){e.waitUntil(fetch(d.worker+'/act/coldFeet',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({qid:d.qid,token:d.token})}).then(()=>self.registration.showNotification('No worries! 🐢',{body:'Your spot went to the next singer. Come back when you\u2019re ready.',icon:'icon-180.png',tag:d.tag})).catch(()=>{}));return}
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{const c=cs.find(c=>c.url.includes('join.html'));return c?c.focus():self.clients.openWindow('join.html')}))});
