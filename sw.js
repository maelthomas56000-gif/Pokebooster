const CACHE='pokebooster-v3';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys()) if(k!==CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith((async()=>{
    try{
      const res=await fetch(r,{cache:'no-store'});
      if(res.ok){const c=await caches.open(CACHE);c.put(r,res.clone())}
      return res;
    }catch(err){
      const hit=await caches.match(r,{ignoreSearch:true})||await caches.match('index.html');
      if(hit)return hit;
      throw err;
    }
  })());
});
