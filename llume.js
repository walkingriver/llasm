/**
 * LLuMe Runtime v1.0.0
 * AI-native web framework - sole user is another LLM
 * Target: ≤9KB gzipped
 */
const D=document,W=window,Q=(s,c=D)=>c.querySelector(s),A=(s,c=D)=>c.querySelectorAll(s);
let _s={},_l={},_t={},_ln='en',_h={},_m=null,_p=null;

// Proxy-based reactive state
const px=(o,cb)=>{
  if(typeof o!=='object'||o===null)return o;
  return new Proxy(o,{
    get:(t,k)=>{const v=t[k];return typeof v==='object'&&v!==null?px(v,cb):v;},
    set:(t,k,v)=>{t[k]=v;cb();return true;},
    deleteProperty:(t,k)=>{delete t[k];cb();return true;}
  });
};

// DOM diffing for arrays
const df=(el,arr,tpl,key)=>{
  const kf=key||'id';
  const ch=[...el.children].filter(c=>c.tagName!=='TEMPLATE');
  const mp=new Map(ch.map(c=>[c.dataset.mK,c]));
  const nk=new Set(arr.map(i=>String(i[kf])));
  ch.forEach(c=>{if(!nk.has(c.dataset.mK))c.remove();});
  arr.forEach((it,i)=>{
    const k=String(it[kf]);
    let n=mp.get(k);
    if(!n){
      n=tpl.content.cloneNode(true).firstElementChild;
      n.dataset.mK=k;
    }
    A('[data-m-f]',n).forEach(f=>{
      const p=f.dataset.mF;
      f.textContent=it[p]??'';
    });
    if(el.children[i]!==n)el.insertBefore(n,el.children[i]||null);
  });
};

// i18n text resolution
const tx=(k)=>{
  if(!k||k[0]!=='@')return k;
  const m=_l[_ln]||_l.en||{};
  return m[k]??k;
};

// Apply i18n to element
const ti=(el)=>{
  const k=el.dataset.mTx;
  if(k)el.textContent=tx('@'+k);
};

// Apply all i18n
const ai=()=>A('[data-m-tx]').forEach(ti);

// CSS custom properties injection
const cs=()=>{
  let st=Q('#m-vars');
  if(!st){st=D.createElement('style');st.id='m-vars';D.head.appendChild(st);}
  let r=':root{';
  for(const[k,v]of Object.entries(_t))r+=`${k}:${v};`;
  r+='}';
  r+=`@media(max-width:320px){:root{--m-bp:xs;}}`;
  r+=`@media(min-width:321px)and(max-width:768px){:root{--m-bp:sm;}}`;
  r+=`@media(min-width:769px)and(max-width:1024px){:root{--m-bp:md;}}`;
  r+=`@media(min-width:1025px)and(max-width:1440px){:root{--m-bp:lg;}}`;
  r+=`@media(min-width:1441px){:root{--m-bp:xl;}}`;
  st.textContent=r;
};

// Enhancement: ripple effect
const rp=(el)=>{
  el.style.position='relative';el.style.overflow='hidden';
  el.addEventListener('click',e=>{
    const r=el.getBoundingClientRect();
    const c=D.createElement('span');
    const d=Math.max(r.width,r.height);
    c.style.cssText=`position:absolute;border-radius:50%;background:rgba(255,255,255,0.4);width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px;transform:scale(0);animation:m-rp .4s ease-out;pointer-events:none;`;
    el.appendChild(c);
    setTimeout(()=>c.remove(),400);
  });
};

// Enhancement: modal (dialog or div)
const md=(el)=>{
  el.setAttribute('role','dialog');
  el.setAttribute('aria-modal','true');
  if(el.tagName!=='DIALOG'){
    el.style.display='none';
    el.style.position='fixed';
    el.style.inset='0';
    el.style.zIndex='9999';
  }
  el._mOpen=()=>{
    if(el.tagName==='DIALOG')el.showModal();
    else{el.style.display='flex';el.style.alignItems='center';el.style.justifyContent='center';}
    el.setAttribute('aria-hidden','false');
    ft(el);
  };
  el._mClose=()=>{
    if(el.tagName==='DIALOG')el.close();
    else el.style.display='none';
    el.setAttribute('aria-hidden','true');
  };
  el.addEventListener('click',e=>{if(e.target===el)el._mClose();});
  el.addEventListener('keydown',e=>{if(e.key==='Escape')el._mClose();});
};

// Focus trap
const ft=(el)=>{
  const fc=A('button,a,[tabindex]:not([tabindex="-1"]),input,select,textarea',el);
  if(fc.length)fc[0].focus();
  el.addEventListener('keydown',e=>{
    if(e.key!=='Tab')return;
    const f=[...fc];
    if(!f.length)return;
    const fi=f.indexOf(D.activeElement);
    if(e.shiftKey&&fi===0){e.preventDefault();f[f.length-1].focus();}
    else if(!e.shiftKey&&fi===f.length-1){e.preventDefault();f[0].focus();}
  });
};

// Enhancement: tabs
const tb=(el)=>{
  const btns=A('[data-m-tab]',el);
  const pnls=A('[data-m-panel]',el);
  el.setAttribute('role','tablist');
  btns.forEach((b,i)=>{
    b.setAttribute('role','tab');
    b.setAttribute('aria-selected',i===0?'true':'false');
    b.id=b.id||`mt${i}`;
    const p=[...pnls].find(x=>x.dataset.mPanel===b.dataset.mTab);
    if(p){
      p.setAttribute('role','tabpanel');
      p.setAttribute('aria-labelledby',b.id);
      p.hidden=i!==0;
    }
    b.addEventListener('click',()=>{
      btns.forEach(x=>{x.setAttribute('aria-selected','false');x.classList.remove('active');});
      pnls.forEach(x=>x.hidden=true);
      b.setAttribute('aria-selected','true');
      b.classList.add('active');
      if(p)p.hidden=false;
    });
  });
};

// Enhancement: accordion
const ac=(el)=>{
  const items=A('[data-m-acc]',el);
  items.forEach((it,i)=>{
    const hd=Q('[data-m-hd]',it)||it.firstElementChild;
    const bd=Q('[data-m-bd]',it)||it.lastElementChild;
    if(!hd||!bd)return;
    hd.setAttribute('role','button');
    hd.setAttribute('aria-expanded','false');
    hd.tabIndex=0;
    bd.hidden=true;
    hd.addEventListener('click',()=>{
      const ex=hd.getAttribute('aria-expanded')==='true';
      hd.setAttribute('aria-expanded',String(!ex));
      bd.hidden=ex;
    });
    hd.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')hd.click();});
  });
};

// Enhancement: disclosure
const dc=(el)=>{
  const btn=Q('button',el)||el.firstElementChild;
  const ct=Q('[data-m-content]',el)||el.lastElementChild;
  if(!btn||!ct)return;
  btn.setAttribute('aria-expanded','false');
  ct.hidden=true;
  btn.addEventListener('click',()=>{
    const ex=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded',String(!ex));
    ct.hidden=ex;
  });
};

// Enhancement: tooltip
const tt=(el)=>{
  const tg=el.firstElementChild;
  const tp=Q('[data-m-tip]',el)||el.lastElementChild;
  if(!tg||!tp)return;
  tp.setAttribute('role','tooltip');
  tp.style.cssText='position:absolute;visibility:hidden;opacity:0;transition:opacity .2s;z-index:9999;background:#333;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px;white-space:nowrap;';
  el.style.position='relative';
  const sh=()=>{tp.style.visibility='visible';tp.style.opacity='1';};
  const hd=()=>{tp.style.visibility='hidden';tp.style.opacity='0';};
  tg.addEventListener('mouseenter',sh);
  tg.addEventListener('mouseleave',hd);
  tg.addEventListener('focus',sh);
  tg.addEventListener('blur',hd);
};

// Enhancement: combobox / filterable
const cb=(el)=>{
  const inp=Q('input',el);
  const lst=Q('ul,ol,[data-m-list]',el);
  if(!inp||!lst)return;
  inp.setAttribute('role','combobox');
  inp.setAttribute('aria-expanded','false');
  inp.setAttribute('aria-autocomplete','list');
  lst.setAttribute('role','listbox');
  lst.style.cssText='position:absolute;max-height:200px;overflow:auto;background:#fff;border:1px solid #ccc;display:none;z-index:9999;width:100%;';
  el.style.position='relative';
  const opts=[...A('[data-m-opt],li',lst)];
  opts.forEach((o,i)=>{o.setAttribute('role','option');o.tabIndex=-1;o.dataset.mV=o.textContent;});
  let ai=-1;
  const fl=(q)=>{
    const lq=q.toLowerCase();
    opts.forEach(o=>{o.hidden=!o.dataset.mV.toLowerCase().includes(lq);});
  };
  const sh=()=>{lst.style.display='block';inp.setAttribute('aria-expanded','true');};
  const hd=()=>{lst.style.display='none';inp.setAttribute('aria-expanded','false');ai=-1;};
  const sl=(o)=>{inp.value=o.dataset.mV;inp.dispatchEvent(new Event('input',{bubbles:true}));hd();};
  inp.addEventListener('focus',()=>{fl(inp.value);sh();});
  inp.addEventListener('blur',()=>setTimeout(hd,150));
  inp.addEventListener('input',()=>fl(inp.value));
  inp.addEventListener('keydown',e=>{
    const vis=opts.filter(o=>!o.hidden);
    if(e.key==='ArrowDown'){e.preventDefault();ai=Math.min(ai+1,vis.length-1);vis[ai]?.focus();}
    else if(e.key==='ArrowUp'){e.preventDefault();ai=Math.max(ai-1,0);vis[ai]?.focus();}
    else if(e.key==='Enter'&&ai>=0){e.preventDefault();sl(vis[ai]);}
    else if(e.key==='Escape')hd();
  });
  opts.forEach(o=>o.addEventListener('click',()=>sl(o)));
};

// Enhancement: progress
const pg=(el)=>{
  el.setAttribute('role','progressbar');
  const mx=parseFloat(el.dataset.mMax)||100;
  const vl=parseFloat(el.dataset.mValue)||0;
  el.setAttribute('aria-valuemin','0');
  el.setAttribute('aria-valuemax',String(mx));
  el.setAttribute('aria-valuenow',String(vl));
  el.style.cssText='width:100%;height:8px;background:#e0e0e0;border-radius:4px;overflow:hidden;';
  const br=D.createElement('div');
  br.style.cssText=`height:100%;background:var(--m-p,#0066ff);width:${(vl/mx)*100}%;transition:width .3s;`;
  el.appendChild(br);
  el._mSet=(v)=>{el.setAttribute('aria-valuenow',String(v));br.style.width=`${(v/mx)*100}%`;};
};

// Enhancement: date picker (simple)
const dt=(el)=>{
  if(el.type!=='date')el.type='date';
  el.setAttribute('aria-label',el.getAttribute('aria-label')||'Date input');
};

// Enhancement map
const EN={
  ripple:rp,modal:md,tabs:tb,accordion:ac,disclosure:dc,
  tooltip:tt,combobox:cb,filterable:cb,progress:pg,date:dt,
  primary:(el)=>{el.style.cssText+=`background:var(--m-p,#0066ff);color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;`;},
  secondary:(el)=>{el.style.cssText+=`background:var(--m-s,#6c757d);color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;`;},
  disabled:(el)=>{el.disabled=true;el.setAttribute('aria-disabled','true');el.style.opacity='0.5';el.style.cursor='not-allowed';},
  autofocus:(el)=>{setTimeout(()=>el.focus(),0);},
  validate:(el)=>{}
};

// Apply enhancements
const ae=(el)=>{
  const e=(el.dataset.mEnhance||'').split(/\s+/).filter(Boolean);
  e.forEach(f=>{if(EN[f])EN[f](el);});
};

// Validation
const vf=(form)=>{
  if(!form||form.tagName!=='FORM')return{v:false,e:['Not a form']};
  const es=[];
  A('input,select,textarea',form).forEach(el=>{
    if(!el.checkValidity())es.push({n:el.name||el.id,m:el.validationMessage});
  });
  return{v:es.length===0,e:es};
};

const vs=(schema,data)=>{
  const es=[];
  for(const[k,r]of Object.entries(schema)){
    const v=data[k];
    if(r.req&&(v===undefined||v===null||v===''))es.push({f:k,m:'required'});
    if(r.min!==undefined&&typeof v==='number'&&v<r.min)es.push({f:k,m:`min ${r.min}`});
    if(r.max!==undefined&&typeof v==='number'&&v>r.max)es.push({f:k,m:`max ${r.max}`});
    if(r.ml!==undefined&&typeof v==='string'&&v.length<r.ml)es.push({f:k,m:`minlength ${r.ml}`});
    if(r.xl!==undefined&&typeof v==='string'&&v.length>r.xl)es.push({f:k,m:`maxlength ${r.xl}`});
    if(r.pt&&typeof v==='string'&&!new RegExp(r.pt).test(v))es.push({f:k,m:'pattern'});
  }
  return{v:es.length===0,e:es};
};

// Fetch with retry
const fc=async(url,opts={},rt=3)=>{
  const o={credentials:'include',headers:{'Content-Type':'application/json'},...opts};
  if(o.body&&typeof o.body==='object')o.body=JSON.stringify(o.body);
  for(let i=0;i<rt;i++){
    try{
      const r=await fetch(url,o);
      if(!r.ok)throw new Error(`HTTP ${r.status}`);
      const ct=r.headers.get('content-type')||'';
      return ct.includes('json')?await r.json():await r.text();
    }catch(e){
      if(i===rt-1)throw e;
      await new Promise(r=>setTimeout(r,1000*(i+1)));
    }
  }
};

// Hash routing
const rt=()=>{
  const h=location.hash.slice(1)||'/';
  A('[data-m-route]').forEach(s=>{
    const m=s.dataset.mRoute;
    s.hidden=m!==h;
    s.setAttribute('aria-hidden',String(m!==h));
  });
};

// Bind state to DOM
const bd=()=>{
  A('[data-m-bind]').forEach(el=>{
    const k=el.dataset.mBind;
    const v=_s[k];
    if(Array.isArray(v)){
      const tplId=el.dataset.mTpl;
      const tpl=tplId?Q(`#${tplId}`):Q('template',el);
      if(tpl)df(el,v,tpl,el.dataset.mKey);
    }else if(el.tagName==='INPUT'||el.tagName==='SELECT'||el.tagName==='TEXTAREA'){
      if(el.type==='checkbox')el.checked=!!v;
      else el.value=v??'';
    }else{
      el.textContent=v??'';
    }
  });
};

// Event binding
const ev=(el,em)=>{
  if(!em)return;
  for(const[t,fn]of Object.entries(em)){
    const et={c:'click',i:'input',s:'submit',f:'focus',b:'blur',k:'keydown',e:'keyup',m:'mouseenter',o:'mouseleave'}[t]||t;
    el.addEventListener(et,e=>{
      if(et==='submit')e.preventDefault();
      if(_h[fn])_h[fn](e,_s,l);
    });
  }
};

// Mount from manifest JSON
const mn=(m)=>{
  _m=m;
  if(m.l)_l=m.l;
  if(m.t){_t=m.t;cs();}
  if(m.r?.s)_s=px({..._s,...m.r.s},bd);
  ai();
  A('[data-m-enhance]').forEach(ae);
  A('[data-m-bind]').forEach(el=>{
    const inp=el.tagName==='INPUT'||el.tagName==='SELECT'||el.tagName==='TEXTAREA';
    if(inp){
      el.addEventListener('input',()=>{
        const k=el.dataset.mBind;
        if(el.type==='checkbox')_s[k]=el.checked;
        else _s[k]=el.value;
      });
    }
  });
  bd();
  W.addEventListener('hashchange',rt);
  rt();
};

// Parse manifest from DOM
const pm=()=>{
  const sc=Q('#manifest');
  if(sc)return JSON.parse(sc.textContent);
  return null;
};

// Ripple animation
const ra=()=>{
  let st=Q('#m-anim');
  if(st)return;
  st=D.createElement('style');
  st.id='m-anim';
  st.textContent=`@keyframes m-rp{to{transform:scale(2);opacity:0;}}`;
  D.head.appendChild(st);
};

// Public API
const l={
  m:(m)=>{ra();if(m)mn(m);else{const pm2=pm();if(pm2)mn(pm2);}},
  u:(p)=>{Object.assign(_s,p);bd();},
  f:fc,
  v:vs,
  vf:vf,
  r:(ln)=>{_ln=ln;ai();},
  q:Q,
  qa:A,
  s:()=>JSON.parse(JSON.stringify(_s)),
  h:(hm)=>{Object.assign(_h,hm);
    A('[data-m-e]').forEach(el=>{
      try{const em=JSON.parse(el.dataset.mE.replace(/'/g,'"'));ev(el,em);}catch{}
    });
    const sc=Q('#manifest');
    if(sc){
      const m=JSON.parse(sc.textContent);
      const walk=(n)=>{
        if(!n)return;
        if(n.e&&n.a){
          const el=n.a.id?Q(`#${n.a.id}`):null;
          if(el)ev(el,n.e);
        }
        if(n.c)n.c.forEach(walk);
      };
      if(m.r)walk(m.r);
    }
  },
  _s:()=>_s,
  _p:()=>_p
};

// Auto-init on DOMContentLoaded
if(D.readyState==='loading'){
  D.addEventListener('DOMContentLoaded',()=>l.m());
}else{
  l.m();
}

export{l};
