const CACHE='vente-v1';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png',
 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  e.respondWith(
    caches.match(req,{ignoreSearch:true}).then(hit=>{
      const net=fetch(req).then(res=>{
        if(res && (res.ok||res.type==='opaque')){ const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); }
        return res;
      }).catch(()=>hit||(req.mode==='navigate'?caches.match('index.html'):undefined));
      return hit||net;
    })
  );
});
