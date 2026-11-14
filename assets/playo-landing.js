document.addEventListener('DOMContentLoaded',function(){try{

(function(){
  const $=s=>document.querySelector(s)||document.createElement('div'),$$=s=>[...document.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt=n=>n.toFixed(2).replace('.',',')+' €',pad3=n=>String(n).padStart(3,'0'),p2=n=>String(n).padStart(2,'0');

  function total(){const p=$('input[name=pack]:checked');$$('[data-total]').forEach(e=>e.textContent=fmt(+p.dataset.price));$('#stickyPack').textContent=(p.value==='2'?'2 máquinas':'1 máquina')+' · tarjeta o al recibir'}
  $$('input[name=pack]').forEach(i=>i.addEventListener('change',total));

  const msgs=$$('#msgs span');let mi=0;
  if(!reduce)setInterval(()=>{msgs[mi].classList.remove('on');mi=(mi+1)%msgs.length;msgs[mi].classList.add('on')},3200);


  function addBiz(d,n){d=new Date(d);while(n>0){d.setDate(d.getDate()+1);if(d.getDay()%6)n--}return d}
  const mf=new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'short'}),a=addBiz(new Date(),1),b=addBiz(new Date(),2);
  $('#shipIn').textContent=(a.getMonth()===b.getMonth()?a.getDate():mf.format(a))+'-'+mf.format(b);

  // Galería
  const photo=$('#stagePhoto'),thumbs=$$('.thumbs button');
  thumbs.forEach(bt=>bt.addEventListener('click',()=>{thumbs.forEach(x=>x.setAttribute('aria-pressed','false'));bt.setAttribute('aria-pressed','true');
    const sv=$('#stageVid');sv.hidden=!bt.dataset.video;if(bt.dataset.video){photo.hidden=true;sv.play().catch(()=>{})}else sv.pause();
    if(bt.dataset.src){photo.src=bt.dataset.src;photo.alt=bt.querySelector('img').alt;photo.hidden=false}else photo.hidden=true}));
  const stage=$('#stage');let sx=null;
  stage.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  stage.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)<40)return;const cur=thumbs.findIndex(x=>x.getAttribute('aria-pressed')==='true');thumbs[(cur+(dx<0?1:-1)+thumbs.length)%thumbs.length].click()});

  // Demo: dianas, velocidad y sonido
  const pads=$$('.pad'),hs=$('#heroScore'),POW=['¡PAM!','¡ZAS!','¡TOMA!','¡BOOM!'];let lit=-1,score=0,speed=5;
  function beat(){pads.forEach(p=>p.classList.remove('lit'));let n;do{n=Math.floor(Math.random()*6)}while(n===lit);lit=n;pads[n].classList.add('lit')}
  pads.forEach((p,i)=>p.addEventListener('click',()=>{if(i!==lit)return;score++;hs.textContent=pad3(score);
    p.classList.remove('lit');p.classList.add('hit');setTimeout(()=>p.classList.remove('hit'),220);lit=-1;
    const pw=document.createElement('span');pw.className='pow';pw.textContent=POW[score%4];pw.style.left=p.style.left;pw.style.top=p.style.top;p.parentNode.appendChild(pw);setTimeout(()=>pw.remove(),700);
    if(score===3)$('#tryTxt').textContent='¡Así de fácil engancha!'}));
  const iv=()=>1150-(speed-1)*95;
  function setSpeed(v){speed=v;$('#spdOut').textContent=v;$$('[data-lv]').forEach(x=>x.setAttribute('aria-pressed',(v<=3&&x.dataset.lv==='2')||(v>3&&v<=6&&x.dataset.lv==='5')||(v>6&&x.dataset.lv==='9')))}
  $$('[data-lv]').forEach(x=>x.addEventListener('click',()=>setSpeed(+x.dataset.lv)));
  let ctx=null,sound=false,step=0;
  function drum(){if(!sound||!ctx)return;const t=ctx.currentTime;
    const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+.15);g.gain.setValueAtTime(.9,t);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+.26);
    const len=ctx.sampleRate*.05,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
    const n=ctx.createBufferSource(),f=ctx.createBiquadFilter(),hg=ctx.createGain();n.buffer=buf;f.type='highpass';f.frequency.value=7000;hg.gain.value=.25;n.connect(f).connect(hg).connect(ctx.destination);n.start(t+iv()/2000);
    if(step++%2===0){const s=ctx.createOscillator(),sg=ctx.createGain();s.type='triangle';s.frequency.value=[220,262,196,247][(step>>1)%4];sg.gain.setValueAtTime(.12,t);sg.gain.exponentialRampToValueAtTime(.001,t+.4);s.connect(sg).connect(ctx.destination);s.start(t);s.stop(t+.42)}}
  $('#soundBtn').addEventListener('click',e=>{const bt=e.currentTarget;sound=!sound;bt.setAttribute('aria-pressed',sound);bt.lastElementChild.textContent=sound?'Sonando':'Con música';
    if(sound){try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();ctx.resume()}catch(_){sound=false}}});
  (function loop(){beat();drum();setTimeout(loop,reduce?1500:iv())})();
  

  const mw=$('#machine');
  if(!reduce&&matchMedia('(pointer:fine)').matches){stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;mw.style.transform='perspective(900px) rotateY('+(x*16)+'deg) rotateX('+(-y*16)+'deg)'});stage.addEventListener('pointerleave',()=>{mw.style.transform=''})}


  // Cartel personalizado
  (function(){const P=$('#poster');if(!P)return;const up=(i,o,f)=>{const v=$(i).value.trim();$(o).textContent=f(v)};let t;
    const go=()=>{up('#mkA','#pA',v=>v||'Peque');up('#mkA','#bA',v=>v||'Peque');up('#mkB','#bB',v=>v||'Papá');up('#mkAk','#pAk',v=>'«'+(v||'El Rayo')+'»');up('#mkB','#pB',v=>v||'Papá');P.classList.remove('pop');void P.offsetWidth;P.classList.add('pop')};
    ['#mkA','#mkAk','#mkB'].forEach(i=>$(i).addEventListener('input',()=>{clearTimeout(t);t=setTimeout(go,120)}))})();

  // Descargar cartel
  const BRAND={name:'PLAYO',web:'playo.es'};
  (function(){const btn=$('#dlPoster');if(!btn)return;
    const gloveSVG=$('.poster .glove').outerHTML.replace('class="glove"','xmlns="http://www.w3.org/2000/svg" width="256" height="256"');
    const gimg=new Image();gimg.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(gloveSVG);
    function fit(ctx,txt,max,size,font){let z=size;do{ctx.font=font.replace('#',z);z-=2}while(ctx.measureText(txt).width>max&&z>20);return z}
    async function draw(){
      try{await Promise.all(['900 100px "Big Shoulders Display"','italic 900 100px "Big Shoulders Display"','700 30px "Chakra Petch"'].map(f=>document.fonts.load(f)))}catch(e){}
      // Formato historia 1080x1920. Zona segura: nada importante en los 270 px de arriba ni en los 340 px de abajo.
      const W=1080,H=1920,T=270,B=H-340,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
      x.fillStyle='#E5262F';x.fillRect(0,0,W,H);
      x.fillStyle='#1E5BFF';x.beginPath();x.moveTo(0,0);x.lineTo(W*.62,0);x.lineTo(W*.38,H);x.lineTo(0,H);x.fill();
      let g=x.createRadialGradient(W/2,T+60,0,W/2,T+60,800);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
      g=x.createLinearGradient(0,0,0,T);g.addColorStop(0,'rgba(5,10,30,.55)');g.addColorStop(1,'rgba(5,10,30,0)');x.fillStyle=g;x.fillRect(0,0,W,T);
      g=x.createLinearGradient(0,H*.55,0,H);g.addColorStop(0,'rgba(5,10,30,0)');g.addColorStop(1,'rgba(5,10,30,.92)');x.fillStyle=g;x.fillRect(0,0,W,H);
      x.fillStyle='rgba(0,0,0,.08)';for(let y=0;y<H;y+=6)x.fillRect(0,y,W,2);
      x.fillStyle='rgba(255,255,255,.55)';[760,860,960].forEach(y=>x.fillRect(0,y,W,5));
      x.textAlign='center';x.textBaseline='alphabetic';
      x.fillStyle='#F5B800';x.font='700 32px "Chakra Petch"';x.letterSpacing='10px';x.fillText('ESTA NOCHE · EN EL SALÓN',W/2,T+80);x.letterSpacing='0px';
      x.font='900 150px "Big Shoulders Display"';x.fillStyle='rgba(0,0,0,.35)';x.fillText('VELADA EN CASA',W/2,T+240);x.fillStyle='#F5B800';x.fillText('VELADA EN CASA',W/2,T+230);
      const A=$('#pA').textContent.toUpperCase(),Ak=$('#pAk').textContent.toUpperCase(),B2=$('#pB').textContent.toUpperCase();
      const side=(cx,name,nick,flip)=>{x.save();x.translate(cx,830);if(flip)x.scale(-1,1);x.drawImage(gimg,-135,-135,270,270);x.restore();
        const z=fit(x,name,440,140,'900 #px "Big Shoulders Display"');x.font='900 '+z+'px "Big Shoulders Display"';x.fillStyle='rgba(0,0,0,.4)';x.fillText(name,cx,1100);x.fillStyle='#fff';x.fillText(name,cx,1092);
        x.font='700 32px "Chakra Petch"';x.letterSpacing='3px';const w=x.measureText(nick).width+40;x.fillStyle='rgba(0,0,0,.4)';x.fillRect(cx-w/2,1124,w,56);x.fillStyle='#fff';x.fillText(nick,cx,1163);x.letterSpacing='0px'};
      side(W*.25,A,Ak,false);side(W*.75,B2,'«EL JEFE»',true);
      x.save();x.translate(W/2,920);x.rotate(-.06);x.font='italic 900 200px "Big Shoulders Display"';x.lineWidth=14;x.strokeStyle='#0b1020';x.strokeText('VS',0,0);x.fillStyle='#F5B800';x.fillText('VS',0,0);x.restore();
      const bw=600,bh=104,bx=(W-bw)/2,by=1290;x.fillStyle='#0b1020';x.beginPath();x.roundRect(bx-8,by-8,bw+16,bh+16,60);x.fill();
      g=x.createLinearGradient(0,by,0,by+bh);g.addColorStop(0,'#FFD84A');g.addColorStop(1,'#E0A200');x.fillStyle=g;x.beginPath();x.roundRect(bx,by,bw,bh,52);x.fill();
      x.fillStyle='#0b1020';x.font='900 60px "Big Shoulders Display"';x.fillText('★ TÍTULO DEL SALÓN ★',W/2,by+76);
      x.fillStyle='#cfd6ee';x.font='700 32px "Chakra Petch"';x.letterSpacing='6px';x.fillText($('#pDt').textContent.toUpperCase(),W/2,1470);x.letterSpacing='0px';
      // Marca discreta, dentro de la zona segura
      x.globalAlpha=.85;x.fillStyle='#fff';x.font='900 40px "Big Shoulders Display"';x.letterSpacing='4px';x.fillText(BRAND.name,W/2,B-20);x.letterSpacing='0px';
      if(BRAND.web){x.font='600 24px "Chakra Petch"';x.fillStyle='#9CA7C8';x.fillText(BRAND.web,W/2,B+12)}x.globalAlpha=1;
      x.strokeStyle='#F5B800';x.lineWidth=16;x.strokeRect(8,8,W-16,H-16);x.strokeStyle='#0b1020';x.lineWidth=6;x.strokeRect(19,19,W-38,H-38);
      return c}
    const ov=document.createElement('div');ov.className='pv';ov.hidden=true;ov.innerHTML='<div class="pv-in"><img alt="Tu cartel de la velada"><p>Mantén pulsada la imagen para guardarla, o usa los botones.</p><div class="pv-b"><button type="button" class="btn sm" id="pvShare">Compartir</button><button type="button" class="btn sm ghost" id="pvSave">Descargar</button><button type="button" class="btn sm ghost" id="pvClose">Cerrar</button></div></div>';document.body.appendChild(ov);
    let file=null;
    btn.addEventListener('click',async()=>{if(!gimg.complete)await new Promise(r=>gimg.onload=r);const c=await draw();const url=c.toDataURL('image/png');
      ov.querySelector('img').src=url;ov.hidden=false;
      c.toBlob(b=>{file=new File([b],'cartel-velada.png',{type:'image/png'});$('#pvShare').hidden=!(navigator.canShare&&navigator.canShare({files:[file]}))})});
    ov.addEventListener('click',e=>{if(e.target===ov||e.target.id==='pvClose')ov.hidden=true});
    let dls=null;(async()=>{try{dls=window.claude&&claude.use?await claude.use('downloads'):null}catch(e){}})();
    $('#pvSave').addEventListener('click',async()=>{if(!file)return;
      if(dls){try{await dls.save({filename:'cartel-velada.png',data:file})}catch(e){}return}
      const a=document.createElement('a');a.href=URL.createObjectURL(file);a.setAttribute('download','cartel-velada.png');a.click()});
    $('#pvShare').addEventListener('click',()=>{if(file)navigator.share({files:[file],title:'Velada en casa'}).catch(()=>{})});
  })();
  // Vídeos: solo se reproducen cuando se ven
  if('IntersectionObserver' in window){const vio=new IntersectionObserver(es=>es.forEach(en=>{const v=en.target;if(en.isIntersecting&&!reduce){v.play().catch(()=>{})}else v.pause()}),{threshold:.35});$$('.lazyv').forEach(v=>vio.observe(v))}
  // Cinta
  const words=[['¡Ding, ding!',0],['★',2],['Rincón azul',1],['vs',0],['Rincón rojo',1],['★',2],['Su propia velada',0],['★',2],['Canción de entrada',1],['★',2],['Tarjeta o al recibir',0],['★',2]];
  const seq=words.map(([t,o])=>o===2?'<span class="mq-star">★</span>':'<span class="mq-i'+(o?' o':'')+'">'+t+'</span>').join('');
  $('#mq').innerHTML=seq+seq;

  // Marcador azul vs rojo
  function duel(){const t1=128,t2=134,dur=reduce?1:3200,t0=performance.now();$('#winner').textContent='Asalto 3';
    (function f(now){const k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,3),e2=k<.7?e*.97:e;
      $('#p1').textContent=pad3(Math.round(t1*e));$('#p2').textContent=pad3(Math.round(t2*e2));$('#b1').style.width=(t1/150*100*e)+'%';$('#b2').style.width=(t2/150*100*e2)+'%';
      if(k<1)requestAnimationFrame(f);else $('#winner').textContent='¡Gana '+$('#bB').textContent+'!'})(t0)}
  if('IntersectionObserver' in window){let ran=false;new IntersectionObserver(([en])=>{if(en.isIntersecting&&!ran){ran=true;duel();setInterval(duel,9000)}},{threshold:.4}).observe($('#board'))}else duel();

  // Categorías
  $$('.card').forEach(c=>{const v=+c.dataset.speed,m=c.querySelector('.meter'),col=v<=3?'#F5B800':v<=6?'#1E5BFF':'#E5262F';
    for(let k=0;k<9;k++){const i=document.createElement('i');if(k<v)i.style.background=col;m.appendChild(i)}
    c.addEventListener('click',()=>{$$('.card').forEach(x=>x.classList.remove('on'));c.classList.add('on');setSpeed(v);stage.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})})});
  const rail=$('#rail');$('#railPrev').onclick=()=>rail.scrollBy({left:-rail.clientWidth*.8,behavior:'smooth'});$('#railNext').onclick=()=>rail.scrollBy({left:rail.clientWidth*.8,behavior:'smooth'});

  // De cerca
  const hsB=$$('.hs'),hi=$$('.hot-item');let hk=0,hT;
  function showHot(i){hk=i;hsB.forEach((x,k)=>x.setAttribute('aria-pressed',k===i));hi.forEach((x,k)=>x.setAttribute('aria-pressed',k===i))}
  [...hsB,...hi].forEach(x=>x.addEventListener('click',()=>{showHot(+x.dataset.i);clearInterval(hT)}));
  showHot(0);if(!reduce)hT=setInterval(()=>showHot((hk+1)%4),3200);


  const tl=$('#tl');if(!reduce&&'IntersectionObserver' in window&&tl.getBoundingClientRect().top>innerHeight){tl.style.setProperty('--tl',0);new IntersectionObserver(([en],o)=>{if(en.isIntersecting){tl.style.setProperty('--tl',1);o.disconnect()}},{threshold:.5}).observe(tl)}

  // Vídeos
  const cards=$$('.v9');let ci=0;
  function flow(){const W=innerWidth<640?150:220;cards.forEach((c,k)=>{let o=k-ci;const n=cards.length;if(o>n/2)o-=n;if(o<-n/2)o+=n;const ab=Math.abs(o);c.classList.toggle('c0',o===0);c.style.transform='translateX('+(o*W)+'px) translateZ('+(-ab*140)+'px) rotateY('+(-o*20)+'deg)';c.style.opacity=ab>2?0:1-ab*.2;c.style.zIndex=10-ab})}
  flow();addEventListener('resize',flow);
  $('#flowPrev').onclick=()=>{ci=(ci-1+cards.length)%cards.length;flow()};$('#flowNext').onclick=()=>{ci=(ci+1)%cards.length;flow()};
  cards.forEach((c,k)=>c.addEventListener('click',()=>{ci=k;flow()}));
  let fx=null;$('#flow').addEventListener('touchstart',e=>{fx=e.touches[0].clientX},{passive:true});
  $('#flow').addEventListener('touchend',e=>{if(fx===null)return;const dx=e.changedTouches[0].clientX-fx;fx=null;if(Math.abs(dx)>40){ci=(ci+(dx<0?1:-1)+cards.length)%cards.length;flow()}});

  // Pedido
  ['A Coruña','Álava','Albacete','Alicante','Almería','Asturias','Ávila','Illes Balears','Badajoz','Barcelona','Bizkaia','Burgos','Cáceres','Cádiz','Cantabria','Castellón','Ciudad Real','Córdoba','Cuenca','Gipuzkoa','Girona','Granada','Guadalajara','Huelva','Huesca','Jaén','La Rioja','León','Lleida','Lugo','Madrid','Málaga','Murcia','Navarra','Ourense','Palencia','Pontevedra','Salamanca','Segovia','Sevilla','Soria','Tarragona','Teruel','Toledo','Valencia','Valladolid','Zamora','Zaragoza'].forEach(p=>{const o=document.createElement('option');o.textContent=p;$('#fProv').appendChild(o)});

  // Método de pago
  const CARD_OFF=0;
  function payUI(){const p=$('input[name=pack]:checked'),card=$('input[name=pay]:checked').value==='card',t=+p.dataset.price-(card?CARD_OFF:0);
    $('#payTotal').textContent=fmt(t);$('#sumTot').textContent=fmt(t);$('#bdSub').textContent=fmt(+p.dataset.price);$('#bdLabel').textContent=p.dataset.label;
    $$('input[name=dpack]').forEach(r=>r.checked=r.value===p.value);$('#payVerb').textContent=card?'Pagar':'Confirmar';
    $('#paySub').textContent=card?'Pago seguro · Envío gratis':'Pagas al recibir · Envío gratis';
    $('#payNote').textContent=card?'Pago cifrado. Se cobra al confirmar el pedido.':'No te cobramos nada ahora.';
    $('#doneMsg').textContent=card?'Pago recibido. Te escribimos por WhatsApp con el seguimiento.':'Te escribimos por WhatsApp en unos minutos para confirmar. Pagas cuando te llegue.'}
  $$('input[name=dpack]').forEach(r=>r.addEventListener('change',()=>{const m=$('input[name=pack][value="'+r.value+'"]');m.checked=true;m.dispatchEvent(new Event('change',{bubbles:true}))}));
  // Código postal → provincia
  const PROV={'01':'Álava','02':'Albacete','03':'Alicante','04':'Almería','05':'Ávila','06':'Badajoz','07':'Illes Balears','08':'Barcelona','09':'Burgos','10':'Cáceres','11':'Cádiz','12':'Castellón','13':'Ciudad Real','14':'Córdoba','15':'A Coruña','16':'Cuenca','17':'Girona','18':'Granada','19':'Guadalajara','20':'Gipuzkoa','21':'Huelva','22':'Huesca','23':'Jaén','24':'León','25':'Lleida','26':'La Rioja','27':'Lugo','28':'Madrid','29':'Málaga','30':'Murcia','31':'Navarra','32':'Ourense','33':'Asturias','34':'Palencia','36':'Pontevedra','37':'Salamanca','39':'Cantabria','40':'Segovia','41':'Sevilla','42':'Soria','43':'Tarragona','44':'Teruel','45':'Toledo','46':'Valencia','47':'Valladolid','48':'Bizkaia','49':'Zamora','50':'Zaragoza'};
  $('#fZip').addEventListener('input',e=>{const v=e.target.value.replace(/\D/g,'').slice(0,5);e.target.value=v;if(v.length>=2&&PROV[v.slice(0,2)]){const sel=$('#fProv');sel.value=PROV[v.slice(0,2)];sel.closest('label.f').classList.remove('bad');sel.classList.add('auto');setTimeout(()=>sel.classList.remove('auto'),900)}});
  $$('input[name=pay]').forEach(i=>i.addEventListener('change',payUI));$$('input[name=pack]').forEach(i=>i.addEventListener('change',payUI));payUI();

  // Shopify: el boton de pedido anade el pack elegido al carrito y abre el checkout
  const VARIANTS=window.PLAYO_VARIANTS||{};
  $$('[data-order]').forEach(x=>x.addEventListener('click',async ev=>{ev.preventDefault();ev.stopImmediatePropagation();
    const p=document.querySelector('input[name=pack]:checked'),id=VARIANTS[p?p.value:'1'];
    if(!id){location.href='/cart';return}
    x.setAttribute('aria-busy','true');
    try{const r=await fetch('/cart/add.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:[{id:+id,quantity:1}]})});if(!r.ok)throw 0;location.href='/checkout'}
    catch(e){x.removeAttribute('aria-busy');location.href='/cart'}},true));
  const dlg=$('#order'),form=$('#orderForm'),done=$('#done');
  $$('[data-order]').forEach(x=>x.addEventListener('click',()=>{form.hidden=false;done.hidden=true;dlg.showModal()}));
  $('#closeDlg').onclick=()=>dlg.close();$('#closeDone').onclick=()=>dlg.close();
  form.addEventListener('submit',e=>{e.preventDefault();form.querySelectorAll('label.f').forEach(l=>l.classList.toggle('bad',!l.querySelector('input,select').checkValidity()));
    const bad=[...form.querySelectorAll('input,select')].find(i=>!i.checkValidity());if(bad){bad.focus();return}
    $('#orderNo').textContent='Pedido de prueba nº '+(10000+Math.floor(Math.random()*90000));form.hidden=true;done.hidden=false});
  form.addEventListener('input',e=>{const l=e.target.closest('label.f');if(l&&e.target.checkValidity())l.classList.remove('bad')});

  const prog=$('#prog');addEventListener('scroll',()=>{const h=document.documentElement;prog.style.transform='scaleX('+(h.scrollTop/(h.scrollHeight-h.clientHeight))+')'},{passive:true});
  const sticky=$('#sticky');if('IntersectionObserver' in window)new IntersectionObserver(([en])=>sticky.classList.toggle('show',!en.isIntersecting&&en.boundingClientRect.top<0)).observe($('.buy .cta'));
  if(!reduce&&'IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.remove('pre');io.unobserve(en.target)}}),{threshold:.12});
    $$('.rv-in,.card,.inbox li,.faq>details').forEach(el=>{el.classList.add('rv-in');if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pre');io.observe(el)}})}
})();

}catch(e){console.warn('Playo',e)}});
