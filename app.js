/* ===== STEP 6: Supabase client — paste your own values ===== */
const SUPABASE_URL='https://qyavtvskavebgwpyctvz.supabase.co';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5YXZ0dnNrYXZlYmd3cHljdHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzY0MDAsImV4cCI6MjEwNzMxMjQwMH0.OpqpkapIbjm6PxLpx3fl6nyBq1G6DwB1JRiFADyR_cA';
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{
  auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
});

const P=[
{id:1,n:"Meridian Automatic",c:"Watches",p:1250,r:4.9,k:"watch",a:["#25323f","#7e98b0"],t:"New",d:"39mm Swiss automatic, sapphire crystal, 80-hour power reserve."},
{id:2,n:"Solène Chronograph",c:"Watches",p:1890,r:4.8,k:"watch",a:["#3a2a22","#c9915b"],t:"Limited",d:"Rose-gold chronograph with a hand-finished guilloché dial."},
{id:3,n:"Voyageur Weekender",c:"Leather",p:980,r:4.9,k:"bag",a:["#3b2a1d","#a8744a"],t:"Bestseller",d:"Full-grain Tuscan leather, brass hardware, fits a carry-on."},
{id:4,n:"Atelier Tote",c:"Leather",p:640,r:4.7,k:"bag",a:["#2a2f2a","#7d8f78"],t:"",d:"Structured everyday tote with a suede-lined interior."},
{id:5,n:"Cordovan Card Holder",c:"Leather",p:145,r:4.8,k:"card",a:["#4a1f26","#a9505b"],t:"",d:"Shell cordovan, hand-burnished edges, four-card capacity."},
{id:6,n:"Noir Bois Parfum",c:"Fragrance",p:210,r:4.9,k:"scent",a:["#1d1d24","#6a5d8f"],t:"New",d:"Oud, vetiver and smoked cedar. 50ml eau de parfum."},
{id:7,n:"Ambre Gris Candle",c:"Fragrance",p:78,r:4.6,k:"candle",a:["#3a342a","#d1b27a"],t:"",d:"Hand-poured soy wax, 60-hour burn, ceramic vessel."},
{id:8,n:"Linea Fountain Pen",c:"Writing",p:320,r:4.8,k:"pen",a:["#1c2a2e","#4f8f95"],t:"Bestseller",d:"Turned resin barrel, 18k gold nib, piston filler."}];
const SH={watch:'<circle cx="50" cy="50" r="26"/><path d="M50 50V33M50 50l11 6M40 20h20M40 80h20"/>',bag:'<rect x="22" y="40" width="56" height="38" rx="7"/><path d="M38 40v-8a12 12 0 0 1 24 0v8"/>',card:'<rect x="20" y="32" width="60" height="38" rx="6"/><path d="M20 46h60M30 58h14"/>',scent:'<rect x="33" y="44" width="34" height="36" rx="7"/><rect x="43" y="28" width="14" height="16" rx="2"/>',candle:'<rect x="32" y="46" width="36" height="32" rx="5"/><path d="M50 40c-6-6 0-10 0-16 6 5 6 10 0 16z"/>',pen:'<path d="M28 76 66 30l7 6-38 46zM28 76l-2 8 8-2"/>'};
const art=(p,w)=>`<svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" opacity=".92" ${w?'':''}>${SH[p.k]}</svg>`;
const grad=p=>`linear-gradient(135deg,${p.a[0]},${p.a[1]})`;
const $=id=>document.getElementById(id), usd=n=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:n%1?2:0,maximumFractionDigits:2});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ls={g(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},s(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const S={cat:'All',q:'',sort:'f',cart:ls.g('ma_cart',{}),wish:ls.g('ma_wish',[]),user:null,promo:null,co:null};
const save=()=>{ls.s('ma_cart',S.cart);ls.s('ma_wish',S.wish);ls.s('ma_user',S.user)};
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),2200)}
function toggleTheme(){const r=document.documentElement,d=r.dataset.theme==='dark'||(!r.dataset.theme&&matchMedia('(prefers-color-scheme:dark)').matches);r.dataset.theme=d?'light':'dark'}

/* catalog */
function draw(){
 const cats=['All',...new Set(P.map(p=>p.c))];
 $('chips').innerHTML=cats.map(c=>`<button class="chip ${c===S.cat?'on':''}" onclick="S.cat='${c}';draw()">${c}</button>`).join('');
 let l=P.filter(p=>(S.cat==='All'||p.c===S.cat)&&(p.n+p.c+p.d).toLowerCase().includes(S.q.toLowerCase()));
 if(S.sort==='lo')l.sort((a,b)=>a.p-b.p);if(S.sort==='hi')l.sort((a,b)=>b.p-a.p);if(S.sort==='r')l.sort((a,b)=>b.r-a.r);
 $('grid').innerHTML=l.map(p=>`<div class="card"><div class="art" style="background:${grad(p)}" onclick="quick(${p.id})">${art(p)}${p.t?`<span class="tag">${p.t}</span>`:''}
 <button class="heart ${S.wish.includes(p.id)?'on':''}" onclick="event.stopPropagation();wish(${p.id})" aria-label="Wishlist">♥</button></div>
 <div class="info"><small>${p.c} · ★ ${p.r}</small><h3 style="font-size:22px">${p.n}</h3>
 <div class="row"><span class="price">${usd(p.p)}</span><button class="btn mini" onclick="add(${p.id})">Add to bag</button></div></div></div>`).join('')||'<p class="note">No pieces match your search.</p>';
 $('wc').textContent=S.wish.length;$('cc').textContent=Object.values(S.cart).reduce((a,b)=>a+b,0);
}
function wish(id){const i=S.wish.indexOf(id);i<0?S.wish.push(id):S.wish.splice(i,1);save();draw()}
function showWish(){const l=P.filter(p=>S.wish.includes(p.id));
 M(`<h2 style="font-size:32px">Wishlist</h2>${l.length?l.map(p=>`<div class="li"><div class="th" style="background:${grad(p)}"></div><div style="flex:1"><b>${p.n}</b><br><span class="note">${usd(p.p)}</span></div><button class="btn mini" onclick="add(${p.id});closeM()">Add</button></div>`).join(''):'<p class="note">Tap the heart on any piece to save it here.</p>'}`)}
function quick(id){const p=P.find(x=>x.id===id);
 M(`<div class="pd"><div class="art" style="background:${grad(p)}">${art(p)}</div><div><small class="note">${p.c} · ★ ${p.r}</small><h2 style="font-size:34px">${p.n}</h2><p>${p.d}</p><p class="serif" style="font-size:28px">${usd(p.p)}</p>
 <p class="note">Free insured shipping over $250 · 30-day returns · Lifetime warranty</p><button class="btn" onclick="add(${p.id});closeM()">Add to bag</button> <button class="btn o" onclick="wish(${p.id});quick(${p.id})">${S.wish.includes(p.id)?'Saved ♥':'Save ♡'}</button></div></div>`,1)}

/* cart */
function add(id){S.cart[id]=(S.cart[id]||0)+1;save();draw();toast('Added to your bag');}
function qty(id,d){S.cart[id]=(S.cart[id]||0)+d;if(S.cart[id]<=0)delete S.cart[id];save();draw();renderCart()}
const PROMOS={AUREL10:{pct:.1,msg:'10% off applied'},VIP20:{pct:.2,msg:'VIP 20% off applied',vip:1}};
function totals(ship){const sub=Object.entries(S.cart).reduce((a,[id,q])=>a+P.find(p=>p.id==id).p*q,0);
 const disc=S.promo?sub*PROMOS[S.promo].pct:0;const sh=sub===0?0:ship==='x'?24:(sub-disc>=250?0:9);const tax=(sub-disc)*.08;
 return{sub,disc,sh,tax,total:sub-disc+sh+tax}}
function renderCart(){const items=Object.entries(S.cart),t=totals(S.co&&S.co.ship);
 $('drawer').innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center"><h2 style="font-size:30px">Your bag</h2><button class="x" style="position:static" onclick="closeCart()">×</button></div>
 <div class="dl">${items.length?items.map(([id,q])=>{const p=P.find(x=>x.id==id);return`<div class="li"><div class="th" style="background:${grad(p)}"></div><div style="flex:1"><b>${p.n}</b><br><span class="note">${usd(p.p)}</span><br><span class="q"><button onclick="qty(${id},-1)">−</button><span style="min-width:20px;text-align:center">${q}</span><button onclick="qty(${id},1)">+</button></span></div><b>${usd(p.p*q)}</b></div>`}).join(''):'<p class="note">Your bag is empty.</p>'}</div>
 <div class="f" style="grid-template-columns:1fr auto;margin:0 0 10px"><input id="pc" placeholder="Promo code" value="${S.promo||''}"><button class="btn o mini" onclick="applyPromo()">Apply</button></div><div class="err" id="pe"></div>
 <div class="sum"><div><span>Subtotal</span><span>${usd(t.sub)}</span></div>${t.disc?`<div><span>Discount</span><span>−${usd(+t.disc.toFixed(2))}</span></div>`:''}<div><span>Shipping</span><span>${t.sh?usd(t.sh):'Free'}</span></div><div><span>Est. tax</span><span>${usd(+t.tax.toFixed(2))}</span></div><div class="t"><span>Total</span><span>${usd(+t.total.toFixed(2))}</span></div></div>
 <button class="btn" style="margin-top:14px" ${items.length?'':'disabled'} onclick="startCo()">Checkout</button>`}
function applyPromo(){const c=$('pc').value.trim().toUpperCase();if(!c){S.promo=null;return renderCart()}
 const p=PROMOS[c];if(!p){$('pe').textContent='Invalid code.';return}if(p.vip&&!S.user){$('pe').textContent='Sign in to use VIP20.';return}S.promo=c;renderCart();toast(p.msg)}
function openCart(){renderCart();$('drawer').classList.add('show')}function closeCart(){$('drawer').classList.remove('show')}

/* modal */
function M(h,w){$('modal').className='modal'+(w?' w':'');$('modal').innerHTML='<button class="x" onclick="closeM()">×</button>'+h;$('ov').classList.add('show')}
function closeM(){$('ov').classList.remove('show')}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeM();closeCart()}});

/* auth */
function openAuth(next){S.next=next;M(`<h2 style="font-size:32px">Welcome to Maison Aurel</h2><p class="note">Sign in to save your bag, track orders and unlock VIP20.</p>
 <button class="btn" style="width:100%;margin:14px 0" onclick="signIn()">Continue with Google</button><div class="err" id="ae"></div>`)}
async function signIn(){
 const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});
 if(error&&$('ae'))$('ae').textContent=error.message}
async function signOut(){await sb.auth.signOut();closeM();toast('Signed out')}
function fromSession(s){
 if(!s){S.user=null;syncAcct();return}
 const m=s.user.user_metadata||{};
 S.user={id:s.user.id,name:m.full_name||m.name||'Member',email:s.user.email||'',vip:1};
 syncAcct()}
function setUser(u){S.user=u;save();syncAcct();closeM();toast('Welcome, '+u.name.split(' ')[0]);if(S.next){const f=S.next;S.next=null;f()}}
function syncAcct(){$('acct').textContent=S.user?S.user.name.split(' ')[0]:'Sign in'}
function openAcct(){if(!S.user)return openAuth();
 M(`<h2 style="font-size:32px">${esc(S.user.name)}</h2><p class="note">${esc(S.user.email||'Signed in')}</p><p>VIP perk unlocked: code <b>VIP20</b> (20% off).</p>
 <button class="btn" onclick="showOrders()">My orders</button> <button class="btn o" onclick="signOut()">Sign out</button>`)}
async function showOrders(){
 M('<h2 style="font-size:32px">Orders</h2><p class="note">Loading…</p>');
 const {data:o,error}=await sb.from('orders').select('*').order('created_at',{ascending:false});
 if(error)return M('<h2 style="font-size:32px">Orders</h2><p class="err">'+esc(error.message)+'</p>');
 M(`<h2 style="font-size:32px">Orders</h2>${o.length?o.map(x=>`<div class="li"><div style="flex:1"><b>#${x.id.slice(0,8).toUpperCase()}</b><br><span class="note">${new Date(x.created_at).toLocaleDateString()} · ${x.items} item(s) · ${esc(x.city||'')}</span></div><b>${usd(Number(x.total))}</b></div>`).join(''):'<p class="note">No orders yet.</p>'}`)}

/* checkout */
function startCo(){if(!S.user)return openAuth(startCo);closeCart();S.co={step:1,ship:'s',a:{name:S.user.name,email:S.user.email||'',addr:'',city:'',zip:''}};coView()}
function coView(){const c=S.co,t=totals(c.ship);let b='';
 if(c.step===1)b=`<div class="f">${[['name','Full name',1],['email','Email',1],['addr','Address',1],['city','City'],['zip','Postal code']].map(([k,l,f])=>`<div class="${f?'full':''}"><label>${l}</label><input id="c_${k}" value="${esc(c.a[k])}"></div>`).join('')}</div>`;
 if(c.step===2)b=[['s','Standard · 3–5 days',t.sub-t.disc>=250?'Free':'$9'],['x','Express · next day','$24']].map(([k,l,p])=>`<div class="opt ${c.ship===k?'on':''}" onclick="S.co.ship='${k}';coView()"><span>${l}</span><b>${p}</b></div>`).join('');
 if(c.step===3)b=`<div class="f"><div class="full"><label>Card number</label><input id="cn" inputmode="numeric" maxlength="19" placeholder="4242 4242 4242 4242" oninput="this.value=this.value.replace(/\\D/g,'').replace(/(.{4})/g,'$1 ').trim()"></div><div><label>Expiry</label><input id="ce" placeholder="MM/YY" maxlength="5"></div><div><label>CVC</label><input id="cv" maxlength="4" inputmode="numeric"></div></div><p class="note">Demo checkout — nothing is charged and card data is never stored.</p>`;
 M(`<h2 style="font-size:32px">Checkout</h2><div class="steps">${[1,2,3].map(i=>`<span class="${i<=c.step?'on':''}"></span>`).join('')}</div>${b}<div class="err" id="ce2"></div>
 <div class="sum"><div class="t"><span>Total</span><span>${usd(+t.total.toFixed(2))}</span></div></div>
 <div style="display:flex;gap:8px;margin-top:12px">${c.step>1?'<button class="btn o" onclick="coBack()">Back</button>':''}<button class="btn" style="flex:1" onclick="coNext()">${c.step<3?'Continue':'Place order'}</button></div>`)}
function coBack(){S.co.step--;coView()}
async function coNext(){const c=S.co,e=$('ce2');
 if(c.step===1){for(const k of['name','email','addr','city','zip'])c.a[k]=$('c_'+k).value.trim();
  if(Object.values(c.a).some(v=>!v)||!/^\S+@\S+\.\S+$/.test(c.a.email)){e.textContent='Please complete all fields with a valid email.';return}}
 if(c.step===3){const n=$('cn').value.replace(/\s/g,'');if(n.length<13||!/^\d\d\/\d\d$/.test($('ce').value)||$('cv').value.length<3){e.textContent='Enter valid card details.';return}
  const {data:{session}}=await sb.auth.getSession();
  if(!session){e.textContent='Your session expired. Please sign in again.';return}
  const t=totals(c.ship);
  const {data,error}=await sb.from('orders').insert({total:+t.total.toFixed(2),items:Object.values(S.cart).reduce((a,b)=>a+b,0),city:c.a.city}).select('id').single();
  if(error){e.textContent='Could not save order: '+error.message;return}
  const id=data.id.slice(0,8).toUpperCase();
  S.cart={};S.promo=null;save();draw();
  return M(`<div style="text-align:center;padding:20px 0"><div style="font-size:48px;color:var(--gold)">✓</div><h2 style="font-size:34px">Thank you, ${esc(c.a.name.split(' ')[0])}</h2><p>Order <b>#${id}</b> is confirmed. A receipt was sent to ${esc(c.a.email)}.</p><button class="btn" onclick="closeM()">Continue shopping</button></div>`)}
 c.step++;coView()}

/* boot */
$('hart').innerHTML=art({k:'watch'});syncAcct();draw();

/* session: runs on load and after Google redirects back */
sb.auth.getSession().then(({data})=>fromSession(data.session));
sb.auth.onAuthStateChange((_e,s)=>fromSession(s));