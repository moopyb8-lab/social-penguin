const cursor=document.getElementById('cursor');const ring=document.getElementById('cursorRing');let mx=0,my=0,rx=0,ry=0;document.body.classList.add('js-cursor-active');document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});function animateCursor(){cursor.style.transform=`translate(${mx-6}px,${my-6}px)`;rx+=(mx-rx-18)*0.18;ry+=(my-ry-18)*0.18;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(animateCursor);}
animateCursor();const canvas=document.getElementById('waveCanvas');const ctx=canvas.getContext('2d');let W,H,t=0;function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight*3;}
resize();window.addEventListener('resize',resize);const waves=[{amp:80,freq:0.003,speed:0.008,yBase:0.22,color:'rgba(139,92,246,',width:1.2},{amp:60,freq:0.004,speed:0.012,yBase:0.28,color:'rgba(168,85,247,',width:0.8},{amp:100,freq:0.0025,speed:0.006,yBase:0.35,color:'rgba(236,72,153,',width:1.5},{amp:45,freq:0.005,speed:0.015,yBase:0.42,color:'rgba(244,114,182,',width:0.6},{amp:120,freq:0.002,speed:0.005,yBase:0.5,color:'rgba(139,92,246,',width:1.8},{amp:70,freq:0.0035,speed:0.01,yBase:0.58,color:'rgba(59,130,246,',width:1.0},{amp:55,freq:0.0045,speed:0.009,yBase:0.65,color:'rgba(236,72,153,',width:0.7},{amp:90,freq:0.003,speed:0.007,yBase:0.72,color:'rgba(168,85,247,',width:1.3},];function drawWave(w){ctx.beginPath();const yBase=H*w.yBase;for(let x=0;x<=W;x+=2){const y=yBase+Math.sin(x*w.freq+t*w.speed*100)*w.amp
+Math.cos(x*w.freq*0.7+t*w.speed*60)*w.amp*0.4;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
ctx.strokeStyle=w.color+'0.6)';ctx.lineWidth=w.width;ctx.shadowBlur=18;ctx.shadowColor=w.color+'0.4)';ctx.stroke();ctx.shadowBlur=0;}
let wavesRunning=true;function animateWaves(){if(wavesRunning){ctx.clearRect(0,0,W,H);t++;waves.forEach(drawWave);}
requestAnimationFrame(animateWaves);}
animateWaves();document.addEventListener('visibilitychange',()=>{wavesRunning=!document.hidden;});const reveals=document.querySelectorAll('.reveal');const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});},{threshold:0.12});reveals.forEach(r=>io.observe(r));let isAnnual=false;const prices={starter:['0','0'],pro:['9.99','6.99'],growth:['20','13.99'],};function toggleBilling(){isAnnual=!isAnnual;const toggle=document.getElementById('billingToggle');toggle.classList.toggle('annual',isAnnual);document.getElementById('label-monthly').classList.toggle('active',!isAnnual);document.getElementById('label-annual').classList.toggle('active',isAnnual);Object.keys(prices).forEach(p=>{const idx=isAnnual?1:0;const el=document.getElementById('price-'+p);const noteEl=document.getElementById('note-'+p);el.style.opacity='0';setTimeout(()=>{el.textContent=prices[p][idx];el.style.opacity='1';if(isAnnual&&parseFloat(prices[p][1])>0){const annual=(parseFloat(prices[p][1])*12).toFixed(0);const saved=((parseFloat(prices[p][0])-parseFloat(prices[p][1]))*12).toFixed(0);noteEl.textContent='Billed $'+annual+'/yr, save $'+saved;}else{noteEl.textContent='\u00a0';}},150);});}
function toggleFaq(btn){const answer=btn.nextElementSibling;const isOpen=btn.classList.contains('open');document.querySelectorAll('.faq-q.open').forEach(b=>{b.classList.remove('open');b.nextElementSibling.classList.remove('open');});if(!isOpen){btn.classList.add('open');answer.classList.add('open');}}
const ALL_PAGES=['home','pricing','login','signup','forgot','products','privacy','terms','contact','settings','dashboard','tool-post-optimizer','tool-virality-calculator','tool-cringe-calculator','tool-engagement-graph','tool-clip-studio'];const URL_ALIASES={'clipstudio':'tool-clip-studio','postoptimizer':'tool-post-optimizer','viralitycalculator':'tool-virality-calculator','cringecalculator':'tool-cringe-calculator','engagementgraph':'tool-engagement-graph'};const PAGE_TO_URL={'tool-clip-studio':'clipstudio','tool-post-optimizer':'postoptimizer','tool-virality-calculator':'viralitycalculator','tool-cringe-calculator':'cringecalculator','tool-engagement-graph':'engagementgraph'};function showPage(name,skipHistory){ALL_PAGES.forEach(p=>{const el=document.getElementById('page-'+p);if(el){el.style.display=p===name?'block':'none';el.style.minHeight='';}});const tabHome=document.getElementById('tab-home');const tabPricing=document.getElementById('tab-pricing');const tabProducts=document.getElementById('tab-products');if(tabHome)tabHome.classList.toggle('active',name==='home');if(tabPricing)tabPricing.classList.toggle('active',name==='pricing');if(tabProducts)tabProducts.classList.toggle('active',name==='products');const vcNav=document.getElementById('vcTestNav');if(vcNav)vcNav.style.display=name==='tool-virality-calculator'?'flex':'none';if(name==='dashboard')loadDashboard();window.scrollTo(0,0);const revealEls=document.querySelectorAll('#page-'+name+' .reveal, #page-'+name+' .packs-section, #page-'+name+' .compare-section, #page-'+name+' .faq-section, #page-'+name+' .cta-section');const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:0.08});revealEls.forEach(el=>{el.classList.remove('visible');obs.observe(el);});if(!skipHistory){const slug=PAGE_TO_URL[name]||name;const url=name==='home'?'/':'/'+slug;history.pushState({page:name},'',url);}}
window.addEventListener('popstate',e=>{if(e.state&&e.state.page)showPage(e.state.page,true);});
(function(){const path=window.location.pathname.replace(/^\//,'').replace(/\/$/,'')||'home';const page=URL_ALIASES[path]||(ALL_PAGES.includes(path)?path:'home');showPage(page,true);history.replaceState({page:page},'',window.location.pathname);})();
async function submitContact(){const name=document.getElementById('contactName').value.trim();const email=document.getElementById('contactEmail').value.trim();const msg=document.getElementById('contactMessage').value.trim();if(!name||!email||!msg){alert('Please fill in your name, email, and message.');return;}
const btn=event.target;btn.textContent='Sending…';btn.disabled=true;await new Promise(r=>setTimeout(r,1400));document.getElementById('contactFormWrap').style.display='none';document.getElementById('contactSuccess').classList.add('show');btn.textContent='Send Message →';btn.disabled=false;}
async function handleForgot(){document.getElementById('forgotError').classList.remove('show');document.getElementById('forgotSuccess').classList.remove('show');const email=document.getElementById('forgotEmail').value.trim();if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){const el=document.getElementById('forgotError');el.textContent='Please enter a valid email address.';el.classList.add('show');return;}
const btn=document.getElementById('forgotBtn');btn.classList.add('loading');btn.disabled=true;await new Promise(r=>setTimeout(r,1500));btn.classList.remove('loading');btn.disabled=false;document.getElementById('forgotSuccess').classList.add('show');document.getElementById('forgotEmail').value='';}
function togglePassword(inputId,btn){const input=document.getElementById(inputId);const isHidden=input.type==='password';input.type=isHidden?'text':'password';btn.innerHTML=isHidden?`<svg width="16"height="16"viewBox="0 0 24 24"fill="none"stroke="currentColor"stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1"y1="1"x2="23"y2="23"/></svg>`:`<svg width="16"height="16"viewBox="0 0 24 24"fill="none"stroke="currentColor"stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12"cy="12"r="3"/></svg>`;}
function socialLogin(provider){const el=document.getElementById('errorBanner')||document.getElementById('errorBannerSignup');if(el){el.textContent=provider.charAt(0).toUpperCase()+provider.slice(1)+' login coming soon.';el.classList.add('show');}}
function showAuthError(id,msg){const el=document.getElementById(id);if(!el)return;el.textContent=msg;el.classList.toggle('show',!!msg);}
async function handleLogin(){showAuthError('errorBanner','');const email=document.getElementById('loginEmail').value.trim();const password=document.getElementById('loginPassword').value;if(!email){showAuthError('errorBanner','Please enter your email address.');return;}
if(!password){showAuthError('errorBanner','Please enter your password.');return;}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showAuthError('errorBanner','Please enter a valid email address.');return;}
const btn=document.getElementById('loginBtn');btn.classList.add('loading');btn.disabled=true;await new Promise(r=>setTimeout(r,1500));btn.classList.remove('loading');btn.disabled=false;showAuthError('errorBanner','Login functionality not yet connected to a backend.');}
function checkStrength(pw){let score=0;if(pw.length>=8)score++;if(/[A-Z]/.test(pw))score++;if(/[0-9]/.test(pw))score++;if(/[^A-Za-z0-9]/.test(pw))score++;const levels=['weak','fair','good','strong'];const labels=['Too short','Fair','Good','Strong \u{1F4AA}'];const lColors=['#f87171','#fbbf24','#60a5fa','#34d399'];['pwBar1','pwBar2','pwBar3','pwBar4'].forEach((id,i)=>{const el=document.getElementById(id);if(el)el.className='pw-bar '+(i<score?levels[score-1]:'');});const lbl=document.getElementById('pwLabel');if(lbl){lbl.textContent=pw.length===0?'Enter a password':(labels[score-1]||'Too short');lbl.style.color=pw.length&&score>0?lColors[score-1]:'var(--muted)';}}
function validateEmailField(input){const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);input.className='form-input '+(input.value?(valid?'valid':'error'):'');}
async function handleSignup(){showAuthError('errorBannerSignup','');const first=document.getElementById('signupFirst').value.trim();const email=document.getElementById('signupEmail').value.trim();const password=document.getElementById('signupPassword').value;const terms=document.getElementById('signupTerms').checked;if(!first){showAuthError('errorBannerSignup','Please enter your first name.');return;}
if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showAuthError('errorBannerSignup','Please enter a valid email address.');return;}
if(password.length<8){showAuthError('errorBannerSignup','Password must be at least 8 characters.');return;}
if(!terms){showAuthError('errorBannerSignup','Please agree to the Terms of Service to continue.');return;}
const btn=document.getElementById('signupBtn');btn.classList.add('loading');btn.disabled=true;await new Promise(r=>setTimeout(r,1800));btn.classList.remove('loading');btn.disabled=false;showAuthError('errorBannerSignup','Sign-up functionality not yet connected to a backend.');}
(function(){const track=document.getElementById('ticker');if(!track)return;const items=Array.from(track.children);items.forEach(item=>{const clone=item.cloneNode(true);track.appendChild(clone);});let pos=0;const speed=0.6;const halfWidth=()=>track.scrollWidth/2;function animTicker(){pos-=speed;if(Math.abs(pos)>=halfWidth()){pos=0;}
track.style.transform='translateX('+pos+'px)';requestAnimationFrame(animTicker);}
animTicker();})();let carouselIndex=0;function carouselInit(){const grid=document.getElementById('reviewsGrid');const dotsWrap=document.getElementById('carouselDots');if(!grid||!dotsWrap)return;const cards=grid.querySelectorAll('.review-card');const perPage=window.innerWidth<900?1:3;const total=Math.ceil(cards.length/perPage);dotsWrap.innerHTML='';for(let i=0;i<total;i++){const dot=document.createElement('button');dot.className='carousel-dot'+(i===0?' active':'');dot.onclick=()=>carouselGoTo(i);dotsWrap.appendChild(dot);}
carouselGoTo(0);}
function carouselMove(dir){carouselGoTo(carouselIndex+dir);}
let carouselTimer=null;function carouselStartAuto(){clearInterval(carouselTimer);carouselTimer=setInterval(()=>{const grid=document.getElementById('reviewsGrid');if(!grid)return;const cards=grid.querySelectorAll('.review-card');const perPage=window.innerWidth<900?1:3;const total=Math.ceil(cards.length/perPage);carouselGoTo((carouselIndex+1)%total);},4000);}
function carouselGoTo(idx){const grid=document.getElementById('reviewsGrid');if(!grid)return;const cards=grid.querySelectorAll('.review-card');const perPage=window.innerWidth<900?1:3;const total=Math.ceil(cards.length/perPage);carouselIndex=((idx%total)+total)%total;const cardW=cards[0]?cards[0].offsetWidth+20:0;grid.style.transform='translateX(-'+(carouselIndex*perPage*cardW)+'px)';document.querySelectorAll('.carousel-dot').forEach((d,i)=>d.classList.toggle('active',i===carouselIndex));const prev=document.getElementById('carouselPrev');const next=document.getElementById('carouselNext');if(prev)prev.disabled=false;if(next)next.disabled=false;clearInterval(carouselTimer);carouselTimer=setInterval(()=>{carouselGoTo((carouselIndex+1)%Math.ceil(document.querySelectorAll('#reviewsGrid .review-card').length/(window.innerWidth<900?1:3)));},4000);}
window.addEventListener('load',()=>{carouselInit();carouselStartAuto();});window.addEventListener('resize',()=>{carouselInit();carouselStartAuto();});let selectedStars=0;function openReviewModal(){document.getElementById('reviewModal').classList.add('show');document.getElementById('modalForm').style.display='block';document.getElementById('modalSuccess').classList.remove('show');selectedStars=0;setStars(0);document.getElementById('reviewText').value='';document.getElementById('reviewName').value='';document.getElementById('reviewHandle').value='';}
function closeReviewModal(){document.getElementById('reviewModal').classList.remove('show');}
function closeReviewModalOutside(e){if(e.target===document.getElementById('reviewModal'))closeReviewModal();}
function setStars(n){selectedStars=n;document.querySelectorAll('.star-btn').forEach(btn=>{btn.classList.toggle('lit',parseInt(btn.dataset.val)<=n);});}
function submitReview(){const text=document.getElementById('reviewText').value.trim();const name=document.getElementById('reviewName').value.trim();if(!selectedStars){alert('Please select a star rating.');return;}
if(!text){alert('Please write a review before submitting.');return;}
if(!name){alert('Please enter your name.');return;}
const handle=document.getElementById('reviewHandle').value.trim();const emojis=['✨','🚀','🎯','💡','🔥','⚡'];const emoji=emojis[Math.floor(Math.random()*emojis.length)];const colors=['rgba(139,92,246,0.12)','rgba(236,72,153,0.12)','rgba(59,130,246,0.12)','rgba(16,185,129,0.12)'];const col=colors[Math.floor(Math.random()*colors.length)];const starsHtml=Array(selectedStars).fill('<span>★</span>').join('')+Array(5-selectedStars).fill('<span style="opacity:0.2">★</span>').join('');const card=document.createElement('div');card.className='review-card';card.style.opacity='0';card.style.transform='translateY(20px)';card.style.transition='opacity 0.5s ease, transform 0.5s ease';const safeText=text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');const safeName=name.replace(/&/g,'&amp;').replace(/</g,'&lt;');const safeHandle=handle.replace(/&/g,'&amp;').replace(/</g,'&lt;');const handleHtml=safeHandle?'<div class="review-handle">'+safeHandle+'</div>':'';card.innerHTML='<div class="review-stars">'+starsHtml+'</div>'+
'<p class="review-text">'+safeText+'</p>'+
'<div class="review-author">'+
'<div class="review-avatar" style="background:'+col+'">'+emoji+'</div>'+
'<div>'+
'<div class="review-name">'+safeName+'</div>'+
handleHtml+
'</div>'+
'</div>';const grid=document.getElementById('reviewsGrid');grid.insertBefore(card,grid.firstChild);requestAnimationFrame(()=>{card.style.opacity='1';card.style.transform='translateY(0)';});document.getElementById('modalForm').style.display='none';document.getElementById('modalSuccess').classList.add('show');setTimeout(closeReviewModal,2500);carouselInit();carouselStartAuto();}
let vcSelectedPlatform=null;let vcAnalyzing=false;function vcToggleChip(el){document.querySelectorAll('#page-tool-virality-calculator .vc-chip').forEach(c=>c.classList.remove('selected'));el.classList.add('selected');vcSelectedPlatform=el.dataset.platform;vcCheckReady();}
function vcCheckReady(){const caption=document.getElementById('vcCaption');const btn=document.getElementById('vcAnalyzeBtn');const hint=document.getElementById('vcHint');const ready=vcSelectedPlatform&&caption&&caption.value.trim().length>10;if(btn)btn.disabled=!ready;if(hint)hint.style.display=ready?'none':'block';}
function vcUpdateChar(){const el=document.getElementById('vcCaption');const cc=document.getElementById('vcCharCount');if(el&&cc)cc.textContent=el.value.length;vcCheckReady();}
function vcToggleOptional(){const toggle=document.getElementById('vcOptionalToggle');const fields=document.getElementById('vcOptionalFields');if(!toggle||!fields)return;const isOpen=!fields.classList.contains('open');fields.classList.toggle('open',isOpen);toggle.classList.toggle('open',isOpen);}
function vcStage(name){const idMap={input:'vcPageInput',loading:'vcPageLoading',results:'vcPageResults'};Object.values(idMap).forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('vc-active');});const target=document.getElementById(idMap[name]);if(target)target.classList.add('vc-active');window.scrollTo(0,0);}
function vcUpdateSteps(done){for(let i=0;i<5;i++){const s=document.getElementById('vcStep'+i);if(!s)continue;const statusEl=s.querySelector('.sp-step-status');s.className='sp-step '+(i<done?'done':i===done?'active':'pending');if(statusEl)statusEl.textContent=i<done?'Done':i===done?'Running...':'Waiting';}}
function vcReset(){vcSelectedPlatform=null;vcAnalyzing=false;document.querySelectorAll('#page-tool-virality-calculator .vc-chip').forEach(c=>c.classList.remove('selected'));const cap=document.getElementById('vcCaption');if(cap)cap.value='';['vcFollowers','vcEngagement','vcAudio','vcNiche'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});const cc=document.getElementById('vcCharCount');if(cc)cc.textContent='0';const err=document.getElementById('vcErrorBanner');if(err){err.textContent='';err.classList.remove('show');}
const opts=document.getElementById('vcOptionalFields');if(opts)opts.classList.remove('open');const tog=document.getElementById('vcOptionalToggle');if(tog)tog.classList.remove('open');const bdBody=document.getElementById('vcBreakdownBody');if(bdBody)bdBody.classList.remove('open');const bdChev=document.getElementById('vcBdChevron');if(bdChev)bdChev.classList.remove('open');vcCheckReady();vcStage('input');}
async function vcAnalyze(){if(vcAnalyzing)return;if(!await checkLimit('viralityCalc'))return;const caption=(document.getElementById('vcCaption')?.value||'').trim();const followers=(document.getElementById('vcFollowers')?.value||'').trim();const engagement=(document.getElementById('vcEngagement')?.value||'').trim();const audio=(document.getElementById('vcAudio')?.value||'').trim();const niche=(document.getElementById('vcNiche')?.value||'').trim();const errorEl=document.getElementById('vcErrorBanner');if(!vcSelectedPlatform){errorEl.textContent='Please select a platform.';errorEl.classList.add('show');return;}
if(caption.length<10){errorEl.textContent='Please paste your caption or hook (at least 10 characters).';errorEl.classList.add('show');return;}
errorEl.classList.remove('show');vcAnalyzing=true;const vcStartTime=Date.now();vcStage('loading');vcUpdateSteps(0);[700,1500,2200,2800].forEach((t,i)=>setTimeout(()=>vcUpdateSteps(i+1),t));const platformLabels={instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',twitter:'X / Twitter',linkedin:'LinkedIn'};const platformLabel=platformLabels[vcSelectedPlatform]||vcSelectedPlatform;const systemPrompt=`You are a world-class social media virality expert.Return ONLY valid JSON.No markdown,no code blocks,no preamble.Return this exact structure:{"score":<integer 0-100>,"grade":<"A+"|"A"|"A-"|"B+"|"B"|"B-"|"C+"|"C"|"C-"|"D"|"F">,"tier":<"Viral Potential"|"Strong Performer"|"Solid Content"|"Needs Work"|"Low Potential">,"verdict":<2-3 sentence direct assessment.No em dashes.No hype.>,"biggestOpportunity":<single most impactful fix,1-2 sentences,specific>,"quickWins":[<3 short specific actions,under 15 words each>],"highImpactChanges":[<3 significant structural changes,under 20 words each>],"ifOneThingOnly":<single most important action,1 sentence,direct and specific>,"flopRisk":{"score":<0-100>,"label":<"Very Low"|"Low"|"Medium"|"High"|"Very High">,"colorKey":<"green"|"yellow"|"red">,"reason":<1 sentence>},"commentTrigger":{"score":<0-100>,"label":<"Weak"|"Moderate"|"Strong"|"Very Strong">,"colorKey":<"red"|"yellow"|"purple"|"purple">,"reason":<1 sentence>},"scrollStop":{"score":<0-100>,"label":<"Low"|"Moderate"|"High"|"Very High">,"colorKey":<"red"|"yellow"|"purple"|"purple">,"reason":<1 sentence>},"freshness":{"score":<0-100>,"label":<"Overused"|"Familiar"|"Fresh"|"Cutting Edge">,"colorKey":<"red"|"yellow"|"blue"|"blue">,"reason":<1 sentence>},"contentPattern":<detected pattern e.g."Insight-led with implicit contrast">,"positioningLevel":<e.g."Creator to Peer">,"freshnessSignal":<e.g."Trending topic, moderate format saturation">,"similarComparison":<1 sentence comparing to similar content>,"benchmarkContext":<1 sentence percentile or stat comparison>,"accountTier":<e.g."Mid-Tier Creator (10K to 100K followers)">,"conservativeReach":<e.g."6,000 - 14,000">,"optimisticReach":<e.g."40,000 - 110,000">,"reachNote":<1 sentence on optimistic scenario conditions>,"breakdown":{"hookStrength":{"score":<0-100>,"confidence":<"High"|"Medium"|"Low">,"note":<1 concise sentence>},"emotionalTrigger":{"score":<0-100>,"confidence":<"High"|"Medium"|"Low">,"note":<1 concise sentence>},"shareability":{"score":<0-100>,"confidence":<"High"|"Medium"|"Low">,"note":<1 concise sentence>},"trendAlignment":{"score":<0-100>,"confidence":<"High"|"Medium"|"Low">,"note":<1 concise sentence>},"commentTrigger":{"score":<0-100>,"confidence":<"High"|"Medium"|"Low">,"note":<1 concise sentence>},"productionQuality":{"score":<0-100>,"confidence":<"High"|"Medium"|"Low">,"note":<1 concise sentence>}}}
Be specific and accurate.Scores must reflect real virality signals for the platform.No generic advice.`;const contextParts=[`Platform:${platformLabel}`,`Caption:\n${caption}`];if(followers)contextParts.push(`Follower count:${followers}`);if(engagement)contextParts.push(`Average engagement rate:${engagement}`);if(audio)contextParts.push(`Audio/sound used:${audio}`);if(niche)contextParts.push(`Niche/topic:${niche}`);const userPrompt=contextParts.join('\n\n')+'\n\nReturn the full virality analysis JSON.';let data=null;try{const res=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system:systemPrompt,messages:[{role:'user',content:userPrompt}]})});const json=await res.json();if(json.error)throw new Error(json.error.message||'API error');const raw=(json.content||[]).map(b=>b.text||'').join('').trim().replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/\s*```$/,'').trim();data=JSON.parse(raw);}catch(err){data=vcDemoData(platformLabel);}
vcUpdateSteps(5);const elapsed=Date.now()-vcStartTime;const delay=Math.max(700,3000-elapsed);setTimeout(()=>{vcBuildResults(data);vcStage('results');vcAnalyzing=false;},delay);}
function vcDemoData(platform){return{score:72,grade:'B+',tier:'Strong Performer',verdict:'This post has genuine viral potential on '+platform+'. The hook earns the click but the mid-section loses momentum before the CTA. A few targeted fixes could push this into the top tier for your niche.',biggestOpportunity:'Your opening line creates curiosity but does not give the reader a specific reason to keep reading. Add a concrete outcome or unexpected claim to hold their attention past the first line.',quickWins:['Remove the last two hashtags — they are too niche to add meaningful reach','End with a direct question to drive comments and signal engagement to the algorithm','Break your longest block of text into two shorter paragraphs for better readability'],highImpactChanges:['Rewrite the first line to lead with a specific result rather than a general observation','Reduce total caption length by around 25% to improve completion rate on mobile','Open with a number or credibility marker to increase scroll-stop probability'],ifOneThingOnly:'Rewrite your first line to lead with a specific, tangible outcome. Everything else flows from whether they stop scrolling or not.',flopRisk:{score:28,label:'Low',colorKey:'green',reason:'Content type has a consistent performance history on this platform with low flop variance.'},commentTrigger:{score:74,label:'Strong',colorKey:'purple',reason:'The implicit tension in the post invites responses and the structure rewards a reply.'},scrollStop:{score:81,label:'High',colorKey:'purple',reason:'Bold opener and clear contrast interrupt the default scroll pattern effectively.'},freshness:{score:66,label:'Fresh',colorKey:'blue',reason:'The angle is timely but the format has been used frequently in this niche over the past 30 days.'},contentPattern:'Insight-led with implicit contrast',positioningLevel:'Creator to Peer',freshnessSignal:'Trending topic, moderate format saturation',similarComparison:'Performs similarly to mid-tier content in this category from the past 60 days with a strong hook and an average CTA.',benchmarkContext:'Top 22% of content in this niche this week. Niche average virality score: 58.',accountTier:'Mid-Tier Creator (10K to 100K followers)',conservativeReach:'8,200 - 15,000',optimisticReach:'52,000 - 120,000',reachNote:'Optimistic range assumes the algorithm serves this to non-followers based on strong engagement velocity in the first 90 minutes.',breakdown:{hookStrength:{score:82,confidence:'High',note:'First line generates a curiosity gap and does not over-explain — keeps the reader moving forward.'},emotionalTrigger:{score:70,confidence:'Medium',note:'Aspiration and mild relatability are present but neither is fully maximised in the current structure.'},shareability:{score:62,confidence:'Medium',note:'Shareable in context but lacks the single universal insight that tends to drive mass resharing.'},trendAlignment:{score:77,confidence:'High',note:'Content fits an active trend cycle on this platform with solid algorithmic tailwinds right now.'},commentTrigger:{score:74,confidence:'High',note:'Implicit debate angle and unresolved tension both invite people to weigh in with their own take.'},productionQuality:{score:78,confidence:'Low',note:'Estimated from caption quality alone. Upload media for a more accurate production quality score.'}}};}
function vcBuildResults(d){function vcScoreColor(score){const stops=[[0,239,68,68],[25,249,115,22],[50,234,179,8],[75,134,239,172],[100,21,128,61],];for(let i=0;i<stops.length-1;i++){const[s0,r0,g0,b0]=stops[i],[s1,r1,g1,b1]=stops[i+1];if(score<=s1){const t=(score-s0)/(s1-s0);return`rgb(${Math.round(r0+(r1-r0)*t)},${Math.round(g0+(g1-g0)*t)},${Math.round(b0+(b1-b0)*t)})`;}}
return`rgb(21,128,61)`;}
const circ=2*Math.PI*65;const offset=circ*(1-d.score/100);const ring=document.getElementById('vcRingFill');const scoreColor=vcScoreColor(d.score);if(ring){ring.style.stroke=scoreColor;ring.style.strokeDasharray=circ;ring.style.strokeDashoffset=circ;setTimeout(()=>{ring.style.strokeDashoffset=offset;},120);}
const scoreNumEl=document.getElementById('vcScoreNum');if(scoreNumEl){scoreNumEl.textContent=d.score;scoreNumEl.style.color=scoreColor;scoreNumEl.style.webkitTextFillColor=scoreColor;}
const gradeEl=document.getElementById('vcGradeText');if(gradeEl){gradeEl.style.background=scoreColor;gradeEl.style.webkitBackgroundClip='text';gradeEl.style.webkitTextFillColor='transparent';gradeEl.style.backgroundClip='text';gradeEl.style.filter=`drop-shadow(0 0 22px ${scoreColor}88)`;}
const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};set('vcGradeText',d.grade);set('vcTierText',d.tier);set('vcVerdictText',d.verdict);set('vcIfOneText',d.ifOneThingOnly);set('vcBiggestOpp',d.biggestOpportunity);const qwEl=document.getElementById('vcQuickWins');if(qwEl)qwEl.innerHTML=(d.quickWins||[]).map(w=>'<li>'+esc(w)+'</li>').join('');const hiEl=document.getElementById('vcHighImpact');if(hiEl)hiEl.innerHTML=(d.highImpactChanges||[]).map(w=>'<li>'+esc(w)+'</li>').join('');const insightGrid=document.getElementById('vcInsightGrid');if(insightGrid){const cards=[{label:'Virality Score',data:d.flopRisk,invertBar:true},{label:'Comment Trigger',data:d.commentTrigger,invertBar:false},{label:'Scroll-Stop Probability',data:d.scrollStop,invertBar:false},{label:'Freshness Signal',data:d.freshness,invertBar:false},];insightGrid.innerHTML=cards.map(c=>{const s=c.data||{};const ck=s.colorKey||'purple';const pct=c.invertBar?Math.max(0,100-(s.score||0)):(s.score||0);const barColor=vcScoreColor(pct);return`<div class="vc-insight-card"><div class="vc-insight-top"><div class="vc-insight-name">${c.label}</div><div class="vc-badge vc-badge-${ck}">${esc(s.label||'')}</div></div><div class="vc-insight-score"style="color:${barColor};-webkit-text-fill-color:${barColor};">${pct}</div><div class="vc-bar-track"><div class="vc-bar-fill"style="width:0%;background:${barColor}"data-pct="${pct}"></div></div><div class="vc-insight-reason">${esc(s.reason||'')}</div></div>`;}).join('');setTimeout(()=>{insightGrid.querySelectorAll('.vc-bar-fill').forEach(b=>{b.style.width=b.dataset.pct+'%';});},250);}
const intelRows=document.getElementById('vcIntelRows');if(intelRows){const rows=[{key:'Content Pattern',val:d.contentPattern},{key:'Positioning',val:d.positioningLevel},{key:'Freshness Signal',val:d.freshnessSignal},{key:'Similar Content',val:d.similarComparison},{key:'Benchmark Context',val:d.benchmarkContext},];intelRows.innerHTML=rows.map(r=>`<div class="vc-intel-row"><div><div class="vc-intel-key">${r.key}</div><div class="vc-intel-val">${esc(r.val||'N/A')}</div></div></div>`).join('');}
const reachCard=document.getElementById('vcReachCard');if(reachCard){reachCard.innerHTML=`<div class="vc-reach-cell"><div class="vc-reach-key">Account Tier</div><div class="vc-reach-val">${esc(d.accountTier||'Unknown')}</div></div><div class="vc-reach-cell"><div class="vc-reach-key">Conservative Reach</div><div class="vc-reach-val">${esc(d.conservativeReach||'--')}</div><div class="vc-reach-note">Baseline estimate with no algorithm boost</div></div><div class="vc-reach-cell"><div class="vc-reach-key">Optimistic Reach</div><div class="vc-reach-val grad">${esc(d.optimisticReach||'--')}</div><div class="vc-reach-note">${esc(d.reachNote||'')}</div></div>`;}
const bdGrid=document.getElementById('vcBdGrid');if(bdGrid&&d.breakdown){const items=[{key:'hookStrength',label:'Hook Strength'},{key:'emotionalTrigger',label:'Emotional Trigger'},{key:'shareability',label:'Shareability'},{key:'trendAlignment',label:'Trend Alignment'},{key:'commentTrigger',label:'Comment Trigger'},{key:'productionQuality',label:'Production Quality'},];bdGrid.innerHTML=items.map(item=>{const b=d.breakdown[item.key]||{};const bdColor=vcScoreColor(b.score||0);return`<div class="vc-bd-item"><div class="vc-bd-header"><div class="vc-bd-name">${item.label}</div><div class="vc-bd-score"style="color:${bdColor};-webkit-text-fill-color:${bdColor};">${b.score??'--'}</div></div><div class="vc-bd-bar-track"><div class="vc-bd-bar-fill"style="width:0%;background:${bdColor}"data-pct="${b.score || 0}"></div></div><div class="vc-bd-note">${esc(b.note||'')}</div></div>`;}).join('');}}
function vcToggleBreakdown(){const body=document.getElementById('vcBreakdownBody');const chevron=document.getElementById('vcBdChevron');if(!body)return;const isOpen=body.classList.toggle('open');if(chevron)chevron.classList.toggle('open',isOpen);if(isOpen){setTimeout(()=>{body.querySelectorAll('.vc-bd-bar-fill').forEach(b=>{b.style.width=(b.dataset.pct||0)+'%';});},80);}}
(function(){function getConsentCookie(){const match=document.cookie.match(/(?:^|;\s*)sp_consent=([^;]+)/);return match?decodeURIComponent(match[1]):null;}
function setConsentCookie(val){const exp=new Date();exp.setFullYear(exp.getFullYear()+1);document.cookie='sp_consent='+encodeURIComponent(val)+'; expires='+exp.toUTCString()+'; path=/; SameSite=Lax';}
function hasConsented(){const ls=localStorage.getItem('viralo_consent');const ck=getConsentCookie();return(ls==='accepted'||ls==='declined')||(ck==='accepted'||ck==='declined');}
const ck=getConsentCookie();if(ck&&!localStorage.getItem('viralo_consent')){localStorage.setItem('viralo_consent',ck);}
const ls=localStorage.getItem('viralo_consent');if(ls&&!ck){setConsentCookie(ls);}
if(!hasConsented()){setTimeout(()=>{const banner=document.getElementById('consentBanner');if(banner)banner.classList.add('show');},1200);}
window._setConsentCookie=setConsentCookie;})();function acceptConsent(){localStorage.setItem('viralo_consent','accepted');if(window._setConsentCookie)window._setConsentCookie('accepted');const banner=document.getElementById('consentBanner');if(banner)banner.classList.remove('show');}
function closeConsent(){localStorage.setItem('viralo_consent','declined');if(window._setConsentCookie)window._setConsentCookie('declined');const banner=document.getElementById('consentBanner');if(banner)banner.classList.remove('show');}
function getCurrentUser(){return window._spUser||null;}
function loadDashboard(){const user=getCurrentUser();if(!user)return;const nameEl=document.getElementById('dashName');if(nameEl)nameEl.textContent=user.firstName||user.email.split('@')[0]||'there';const dateEl=document.getElementById('dashDate');if(dateEl){const now=new Date();dateEl.textContent=now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});}
const plan=user.plan||'free';const chip=document.getElementById('dashPlanChip');const planName=document.getElementById('dashPlanName');const planDesc=document.getElementById('dashPlanDesc');const upgradeBtn=document.getElementById('dashUpgradeBtn');if(chip){chip.textContent=plan==='pro'?'Pro':plan==='growth'?'Growth':'Starter';chip.className='plan-chip '+(plan==='free'?'free':'pro');}
if(planName)planName.textContent=plan==='free'?'Starter Plan':plan==='pro'?'Pro Plan':'Growth Plan';if(planDesc)planDesc.textContent=plan==='free'?'5 uses per tool per month. Upgrade to unlock unlimited access.':'You have unlimited access to all Social Penguin tools.';if(upgradeBtn)upgradeBtn.style.display=plan!=='free'?'none':'block';const usage=user.usage||{};const limit=plan==='free'?5:999;[['PO','postOptimizer'],['VC','viralityCalc'],['CC','cringeCalc']].forEach(([key,field])=>{const used=usage[field]||0;const pct=plan==='free'?Math.min(100,(used/5)*100):100;const useEl=document.getElementById('dashUse'+key);const fillEl=document.getElementById('dashFill'+key);if(useEl)useEl.textContent=plan==='free'?used+' / 5':used+' / Unlimited';if(fillEl)setTimeout(()=>{fillEl.style.width=pct+'%';},200);});['dashClipBadge','dashGraphBadge'].forEach(id=>{const el=document.getElementById(id);if(!el)return;if(plan!=='free'){el.textContent='Unlocked';el.className='tool-item-badge free';}
else{el.textContent='Pro';el.className='tool-item-badge pro';}});const statPosts=document.getElementById('dashStatPosts');const statAnalyses=document.getElementById('dashStatAnalyses');const statClips=document.getElementById('dashStatClips');const statScore=document.getElementById('dashStatScore');if(statPosts)statPosts.textContent=usage.postOptimizer||0;if(statAnalyses)statAnalyses.textContent=usage.viralityCalc||0;if(statClips)statClips.textContent=usage.clipStudio||0;if(statScore)statScore.textContent=user.avgScore?user.avgScore.toFixed(0):'0';const actEl=document.getElementById('dashActivity');if(actEl&&user.recentActivity&&user.recentActivity.length){actEl.innerHTML=user.recentActivity.slice(0,5).map(a=>'<div class="activity-item">'+
'<div class="activity-icon">'+a.icon+'</div>'+
'<div class="activity-text">'+
'<div class="activity-title">'+a.title+'</div>'+
'<div class="activity-time">'+a.time+'</div>'+
'</div>'+
(a.score?'<div class="activity-score">'+a.score+'</div>':'')+
'</div>').join('');}}
function updateNavAuth(){const user=getCurrentUser();const lo=document.getElementById('navAuth');const li=document.getElementById('navLoggedIn');if(!lo||!li)return;if(user){lo.style.display='none';li.style.display='flex';const n=document.getElementById('navUserName');if(n)n.textContent=user.firstName||user.email||'Account';}else{lo.style.display='flex';li.style.display='none';}}
async function googleSignIn(){if(!window._fb){alert('Firebase not configured. See setup instructions at the top of the file.');return;}
try{await window._fb.signInWithPopup(window._fb.auth,window._fb.googleProvider);showPage('home');}catch(e){showAuthError('errorBanner',e.message);}}
async function handleLogin(){if(!window._fb){showAuthError('errorBanner','Firebase not configured. Add your Firebase config to the script at the top of the file.');return;}
showAuthError('errorBanner','');const email=document.getElementById('loginEmail').value.trim();const password=document.getElementById('loginPassword').value;if(!email){showAuthError('errorBanner','Please enter your email address.');return;}
if(!password){showAuthError('errorBanner','Please enter your password.');return;}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showAuthError('errorBanner','Please enter a valid email address.');return;}
const btn=document.getElementById('loginBtn');btn.classList.add('loading');btn.disabled=true;try{await window._fb.signInWithEmailAndPassword(window._fb.auth,email,password);showPage('dashboard');}catch(e){showAuthError('errorBanner',e.code==='auth/wrong-password'||e.code==='auth/user-not-found'?'Incorrect email or password.':e.message);}finally{btn.classList.remove('loading');btn.disabled=false;}}
async function handleSignup(){if(!window._fb){showAuthError('errorBannerSignup','Firebase not configured. Add your Firebase config to the script at the top of the file.');return;}
showAuthError('errorBannerSignup','');const first=document.getElementById('signupFirst').value.trim();const last=document.getElementById('signupLast')?document.getElementById('signupLast').value.trim():'';const email=document.getElementById('signupEmail').value.trim();const pw=document.getElementById('signupPassword').value;const terms=document.getElementById('signupTerms').checked;if(!first){showAuthError('errorBannerSignup','Please enter your first name.');return;}
if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showAuthError('errorBannerSignup','Please enter a valid email address.');return;}
if(pw.length<8){showAuthError('errorBannerSignup','Password must be at least 8 characters.');return;}
if(!terms){showAuthError('errorBannerSignup','Please agree to the Terms of Service to continue.');return;}
const btn=document.getElementById('signupBtn');btn.classList.add('loading');btn.disabled=true;try{const cred=await window._fb.createUserWithEmailAndPassword(window._fb.auth,email,pw);await window._fb.updateProfile(cred.user,{displayName:first+' '+last});await window._fb.setDoc(window._fb.doc(window._fb.db,'users',cred.user.uid),{uid:cred.user.uid,email,firstName:first,lastName:last,plan:'free',createdAt:new Date().toISOString()});showPage('dashboard');}catch(e){showAuthError('errorBannerSignup',e.code==='auth/email-already-in-use'?'An account with that email already exists.':e.message);}finally{btn.classList.remove('loading');btn.disabled=false;}}
async function handleForgot(){if(!window._fb){const el=document.getElementById('forgotError');el.textContent='Firebase not configured.';el.classList.add('show');return;}
document.getElementById('forgotError').classList.remove('show');document.getElementById('forgotSuccess').classList.remove('show');const email=document.getElementById('forgotEmail').value.trim();if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){const el=document.getElementById('forgotError');el.textContent='Please enter a valid email address.';el.classList.add('show');return;}
const btn=document.getElementById('forgotBtn');btn.classList.add('loading');btn.disabled=true;try{await window._fb.sendPasswordResetEmail(window._fb.auth,email);document.getElementById('forgotSuccess').classList.add('show');document.getElementById('forgotEmail').value='';}catch(e){const el=document.getElementById('forgotError');el.textContent=e.message;el.classList.add('show');}
finally{btn.classList.remove('loading');btn.disabled=false;}}
function logOut(){if(window._fb)window._fb.signOut(window._fb.auth);window._spUser=null;updateNavAuth();showPage('home');}
function loadSettingsFromUser(){const u=getCurrentUser();if(!u)return;const el=id=>document.getElementById(id);if(el('sFirstName'))el('sFirstName').value=u.firstName||'';if(el('sLastName'))el('sLastName').value=u.lastName||'';if(el('sEmail'))el('sEmail').value=u.email||'';if(el('sUsername'))el('sUsername').value=u.username||'';if(el('sBio'))el('sBio').value=u.bio||'';const dn=((u.firstName||'')+' '+(u.lastName||'')).trim();if(el('settingsDisplayName'))el('settingsDisplayName').textContent=dn||'Your Name';if(el('settingsDisplayEmail'))el('settingsDisplayEmail').textContent=u.email||'';const plan=u.plan||'free';const chip=el('settingsPlanChip');if(chip){chip.textContent=plan==='pro'?'Pro':plan==='growth'?'Growth':'Starter';chip.className='plan-chip '+(plan==='free'?'free':'pro');}
if(el('subPlanName'))el('subPlanName').textContent=plan==='free'?'Starter Free':plan==='pro'?'Pro $9.99/mo':'Growth $20/mo';if(el('subPlanDetail'))el('subPlanDetail').textContent=plan==='free'?'Free plan. 5 uses per tool per month.':'Unlimited access to all Social Penguin tools.';const cb=el('cancelSubBtn');if(cb)cb.style.display=plan!=='free'?'block':'none';const mb=el('manageBillingBtn');if(mb)mb.style.display=plan!=='free'?'inline-flex':'none';const ub=document.querySelector('.btn-settings-save[onclick*=pricing]');if(ub)ub.style.display=plan==='free'?'':'none';if(el('subBillingCycle'))el('subBillingCycle').textContent=plan==='free'?'No active subscription':'Monthly, renews 1st of next month';}
async function saveProfile(){if(!window._fb||!window._fb.auth.currentUser){alert('You must be logged in.');return;}
const u=window._fb.auth.currentUser;const fn=document.getElementById('sFirstName').value.trim();const ln=document.getElementById('sLastName').value.trim();const em=document.getElementById('sEmail').value.trim();try{await window._fb.updateProfile(u,{displayName:fn+' '+ln});if(em!==u.email)await window._fb.updateEmail(u,em);await window._fb.updateDoc(window._fb.doc(window._fb.db,'users',u.uid),{firstName:fn,lastName:ln,email:em,username:document.getElementById('sUsername').value.trim(),bio:document.getElementById('sBio').value.trim()});if(window._spUser)Object.assign(window._spUser,{firstName:fn,lastName:ln,email:em});updateNavAuth();loadSettingsFromUser();const s=document.getElementById('profileSuccess');if(s){s.classList.add('show');setTimeout(()=>s.classList.remove('show'),3000);}}catch(e){alert(e.message);}}
async function savePassword(){if(!window._fb||!window._fb.auth.currentUser){alert('You must be logged in.');return;}
const u=window._fb.auth.currentUser;const cur=document.getElementById('sCurrentPw').value;const nw=document.getElementById('sNewPw').value;const cnf=document.getElementById('sConfirmPw').value;if(!cur){alert('Please enter your current password.');return;}
if(nw.length<8){alert('New password must be at least 8 characters.');return;}
if(nw!==cnf){alert('Passwords do not match.');return;}
try{await window._fb.reauthenticateWithCredential(u,window._fb.EmailAuthProvider.credential(u.email,cur));await window._fb.updatePassword(u,nw);['sCurrentPw','sNewPw','sConfirmPw'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});const s=document.getElementById('passwordSuccess');if(s){s.classList.add('show');setTimeout(()=>s.classList.remove('show'),3000);}}catch(e){alert(e.code==='auth/wrong-password'?'Current password is incorrect.':e.message);}}
function saveNotifications(){if(!window._fb||!window._fb.auth.currentUser)return;const notif={updates:document.getElementById('notifUpdates').checked,limits:document.getElementById('notifLimits').checked,digest:document.getElementById('notifDigest').checked,promo:document.getElementById('notifPromo').checked};window._fb.updateDoc(window._fb.doc(window._fb.db,'users',window._fb.auth.currentUser.uid),{notif});if(window._spUser)window._spUser.notif=notif;const s=document.getElementById('notifSuccess');if(s){s.classList.add('show');setTimeout(()=>s.classList.remove('show'),3000);}}
function exportData(){const u=getCurrentUser();if(!u){alert('You must be logged in.');return;}
const blob=new Blob([JSON.stringify({account:u,exportDate:new Date().toISOString()},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='social-penguin-data-export.json';a.click();URL.revokeObjectURL(a.href);}
let confirmCallback=null;function showConfirmModal(title,body,cb){document.getElementById('confirmTitle').textContent=title;document.getElementById('confirmBody').textContent=body;confirmCallback=cb;document.getElementById('confirmModal').classList.add('show');}
function closeConfirmModal(){document.getElementById('confirmModal').classList.remove('show');confirmCallback=null;}
function confirmAction(){closeConfirmModal();if(confirmCallback)confirmCallback();}
function promptCancelSub(){showConfirmModal('Cancel your subscription?','Your access continues until end of billing period. You will not be charged again.',async()=>{if(window._fb&&window._fb.auth.currentUser){await window._fb.updateDoc(window._fb.doc(window._fb.db,'users',window._fb.auth.currentUser.uid),{plan:'free'});if(window._spUser)window._spUser.plan='free';loadSettingsFromUser();}
alert('Subscription cancelled. You retain access until end of billing period.');});}
function promptDeleteAccount(){showConfirmModal('Delete your account?','This permanently deletes your Social Penguin account and all data. This cannot be undone.',async()=>{if(window._fb&&window._fb.auth.currentUser){const uid=window._fb.auth.currentUser.uid;await window._fb.deleteDoc(window._fb.doc(window._fb.db,'users',uid));await window._fb.deleteUser(window._fb.auth.currentUser);}
logOut();alert('Your account has been deleted.');});}
window.addEventListener('load',()=>{document.querySelectorAll('.btn-social').forEach(btn=>{if(btn.textContent.trim().toLowerCase().includes('google')){btn.onclick=e=>{e.preventDefault();googleSignIn();};}});});window.addEventListener('scroll',()=>{const btn=document.getElementById('scrollTopBtn');if(btn)btn.classList.toggle('visible',window.scrollY>400);});function toggleMobileNav(){const ham=document.getElementById('navHamburger');const drawer=document.getElementById('navDrawer');if(ham)ham.classList.toggle('open');if(drawer)drawer.classList.toggle('open');}
let selectedPlatforms=[];let generatedData={};let selections={};let activePlatform=null;let uploadedFile=null;let musicPlaying=false;let progressInterval=null;function poStage(name){const map={input:'poPageInput',loading:'poPageLoading',results:'poPageResults',preview:'poPagePreview'};document.querySelectorAll('.po-stage').forEach(el=>el.classList.remove('po-active'));const target=document.getElementById(map[name]);if(target)target.classList.add('po-active');window.scrollTo(0,0);}
function switchInputTab(tab,btn){document.getElementById('tabFile').style.display=tab==='file'?'block':'none';document.getElementById('tabLink').style.display=tab==='link'?'block':'none';document.querySelectorAll('#page-tool-post-optimizer .input-tab').forEach(b=>b.classList.remove('active'));if(btn)btn.classList.add('active');}
function handleFile(input){const file=input.files[0];if(!file)return;uploadedFile=file;const nameEl=document.getElementById('fileName');const chosenEl=document.getElementById('fileChosen');if(nameEl)nameEl.textContent=file.name;if(chosenEl)chosenEl.classList.add('visible');const zone=document.getElementById('uploadZone');if(zone)zone.style.borderColor='rgba(74,222,128,0.45)';}
function togglePlatform(el){const platform=el.dataset.platform;if(el.classList.contains('selected')){el.classList.remove('selected');selectedPlatforms=selectedPlatforms.filter(p=>p!==platform);}else{el.classList.add('selected');selectedPlatforms.push(platform);}
const btn=document.getElementById('generateBtn');const hint=document.getElementById('generateHint');if(btn)btn.disabled=selectedPlatforms.length===0;if(hint)hint.style.display=selectedPlatforms.length>0?'none':'block';}
async function generate(){if(!await checkLimit('postOptimizer'))return;const link=(document.getElementById('linkInput')?.value||'').trim();const desc=(document.getElementById('descInput')?.value||'').trim();const errorBanner=document.getElementById('errorBanner');if(selectedPlatforms.length===0){if(errorBanner){errorBanner.textContent='Select at least one platform.';errorBanner.classList.add('visible');}
return;}
if(!link&&!uploadedFile&&!desc){if(errorBanner){errorBanner.textContent='Paste a link, upload a file, or describe your content.';errorBanner.classList.add('visible');}
return;}
if(errorBanner)errorBanner.classList.remove('visible');poStage('loading');const platformNames={tiktok:'TikTok',instagram:'Instagram',youtube:'YouTube',twitter:'X / Twitter',linkedin:'LinkedIn'};const platformList=selectedPlatforms.map(p=>platformNames[p]||p).join(', ');const systemPrompt=`You are a world-class social media content strategist.Return ONLY valid JSON.No markdown,no code blocks,no preamble.Return this exact structure for each platform in the"platforms"array:{"platforms":[{"platform":"<platform name>","captions":["<caption 1>","<caption 2>","<caption 3>"],"hashtags":["<hashtag1>","<hashtag2>",...up to 30 hashtags],"music":[{"title":"<song title>","artist":"<artist>","reason":"<why it fits>"},{"title":"<song title>","artist":"<artist>","reason":"<why it fits>"},{"title":"<song title>","artist":"<artist>","reason":"<why it fits>"}]}]}
Generate content optimised specifically for each platform's audience, tone, and algorithm. Captions should be engaging and platform-appropriate. Hashtags should be a mix of trending, niche, and broad. No em dashes.`;

  const userPrompt = `Platforms: ${platformList}
Content description: ${desc || 'Not provided'}
Content link: ${link || 'Not provided'}

Generate optimised captions, hashtags, and music picks for each platform.`;

  let data = null;
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: systemPrompt, messages: [{ role: 'user', content: userPrompt }] })
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message || 'API error');
    const raw = (json.content || []).map(b => b.text || '').join('').trim()
      .replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/\s*```$/,'').trim();
    data = JSON.parse(raw);
  } catch (err) {
    data = poDemoData(selectedPlatforms);
  }

  generatedData = {};
  (data.platforms || []).forEach(p => { generatedData[p.platform.toLowerCase().replace(/\s.*/, '')] = p; });
  selections = {};
  selectedPlatforms.forEach(p => {
    const d = generatedData[p] || {};
    selections[p] = { caption: (d.captions || [])[0] || '', hashtags: (d.hashtags || []), music: null };
  });

  poBuildResults();
  poStage('results');
}

// ─── DEMO FALLBACK ───
function poDemoData(platforms) {
  return {
    platforms: platforms.map(p => ({
      platform: p,
      captions: [
        'This changed everything.No going back now.',
        'Most people scroll past this.The ones who stop — they get it.',
        'Three months ago I had no idea.Now I can not imagine doing it any other way.'
      ],
      hashtags: ['#fyp','#viral','#creator','#contentcreator','#trending','#growth','#mindset','#motivation','#entrepreneur','#lifestyle','#dailyvlog','#creatoreconomy','#socialmedia','#personalbranding','#authenticity'],
      music: [
        { title: 'Levitating', artist: 'Dua Lipa', reason: 'High energy,trending across the platform' },
        { title: 'Blinding Lights', artist: 'The Weeknd', reason: 'Nostalgic feel,massive engagement history' },
        { title: 'As It Was', artist: 'Harry Styles', reason: 'Emotional resonance,viral sound' }
      ]
    }))
  };
}

// ─── BUILD RESULTS ───
function poBuildResults() {
  const platformNames = { tiktok:'TikTok', instagram:'Instagram', youtube:'YouTube', twitter:'X/Twitter', linkedin:'LinkedIn' };
  const captionsSection = document.getElementById('allCaptionsSection');
  const tabsEl = document.getElementById('platformTabs');
  const panelsEl = document.getElementById('platformPanels');
  if (!captionsSection || !tabsEl || !panelsEl) return;

  // Captions
  captionsSection.innerHTML = selectedPlatforms.map(p => {
    const d = generatedData[p] || {};
    const captions = d.captions || [];
    return `<div style="margin-bottom:32px;">
      <div style="font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:14px;">${platformNames[p] || p} — Captions</div>
      ${captions.map((c, i) => `
        <div class="caption-option ${selections[p]?.caption === c ? 'selected' : ''}" onclick="selectCaption('${p}', ${i})" style="background:var(--card);border:1px solid ${selections[p]?.caption === c ? 'rgba(168,85,247,0.5)' : 'rgba(139,92,246,0.12)'};border-radius:12px;padding:16px 20px;margin-bottom:10px;cursor:pointer;transition:border-color 0.2s;font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.6;color:var(--text);">
          ${c}
        </div>`).join('')}
    </div>`;
  }).join('');

  // Tabs for hashtags + music
  tabsEl.innerHTML = selectedPlatforms.map((p, i) =>
    `<button class="platform-tab ${i===0?'active':''}" onclick="poSwitchTab('${p}', this)">${platformNames[p] || p}</button>`
  ).join('');

  panelsEl.innerHTML = selectedPlatforms.map((p, i) => {
    const d = generatedData[p] || {};
    const hashtags = d.hashtags || [];
    const music = d.music || [];
    return `<div class="platform-panel ${i===0?'active':''}" id="panel-${p}" style="display:${i===0?'block':'none'};">
      <div style="font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin:24px 0 12px;">Hashtags</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px;">
        ${hashtags.map(h => `<span style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:20px;padding:5px 12px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--purple-bright);">${h}</span>`).join('')}
      </div>
      <div style="font-family:'Syne',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:12px;">Music Picks</div>
      ${music.map((m, mi) => `
        <div onclick="selectMusic('${p}', ${mi})" style="background:var(--card);border:1px solid rgba(139,92,246,0.12);border-radius:12px;padding:14px 16px;margin-bottom:10px;cursor:pointer;display:flex;align-items:center;gap:14px;transition:border-color 0.2s;">
          <div style="width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;">♪</div>
          <div style="flex:1;min-width:0;">
            <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:700;">${m.title}</div>
            <div style="font-family:'DM Sans',sans-serif;font-size:12px;color:var(--muted);">${m.artist}</div>
            <div style="font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(148,144,176,0.6);margin-top:3px;">${m.reason}</div>
          </div>
        </div>`).join('')}
    </div>`;
  }).join('');
}

function poSwitchTab(platform, btn) {
  document.querySelectorAll('#page-tool-post-optimizer.platform-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#page-tool-post-optimizer.platform-panel').forEach(p => p.style.display = 'none');
  if (btn) btn.classList.add('active');
  const panel = document.getElementById('panel-' + platform);
  if (panel) panel.style.display = 'block';
  activePlatform = platform;
}

function selectCaption(platform, index) {
  const d = generatedData[platform] || {};
  const captions = d.captions || [];
  if (!selections[platform]) selections[platform] = {};
  selections[platform].caption = captions[index] || '';
  poBuildResults();
  poSwitchTab(platform, null);
}

function selectMusic(platform, index) {
  const d = generatedData[platform] || {};
  const music = d.music || [];
  if (!selections[platform]) selections[platform] = {};
  selections[platform].music = music[index] || null;
}

const _previewPlatformNames = { tiktok:'TikTok', instagram:'Instagram', youtube:'YouTube', twitter:'X/Twitter', linkedin:'LinkedIn' };
const _previewPlatformBtn   = { tiktok:'btn-tiktok', instagram:'btn-insta', youtube:'btn-youtube', twitter:'btn-twitter', linkedin:'btn-linkedin' };

function goToPreview() {
  const platform = activePlatform || selectedPlatforms[0];

  // Build platform tabs (only shown when multiple platforms selected)
  const tabsEl = document.getElementById('previewPlatformTabs');
  if (tabsEl) {
    if (selectedPlatforms.length > 1) {
      tabsEl.innerHTML = selectedPlatforms.map(p =>
        `<button class="preview-platform-tab${p === platform ? ' active' : ''}" data-platform="${p}" onclick="previewSwitchPlatform('${p}')">${_previewPlatformNames[p] || p}</button>`
      ).join('');
    } else {
      tabsEl.innerHTML = '';
    }
  }

  previewShowPlatform(platform);
  poStage('preview');
}

function previewShowPlatform(platform) {
  const sel = selections[platform] || {};
  const d   = generatedData[platform] || {};

  const captionEl   = document.getElementById('mockCaption');
  const hashtagsEl  = document.getElementById('mockHashtags');
  if (captionEl) captionEl.textContent = sel.caption || 'No caption selected.';
  if (hashtagsEl) hashtagsEl.innerHTML = (d.hashtags || []).map(h =>
    `<span style="color:var(--purple-bright);margin-right:6px;">${esc(h)}</span>`).join('');

  if (uploadedFile && uploadedFile.type.startsWith('image/')) {
    const img         = document.getElementById('mockImg');
    const placeholder = document.getElementById('mockPlaceholder');
    if (img) { img.src = URL.createObjectURL(uploadedFile); img.style.display = 'block'; }
    if (placeholder) placeholder.style.display = 'none';
  }

  const bar = document.getElementById('mockMusicBar');
  if (sel.music) {
    const title  = document.getElementById('musicBarTitle');
    const artist = document.getElementById('musicBarArtist');
    if (bar) bar.style.display = 'flex';
    if (title)  title.textContent  = sel.music.title  || '';
    if (artist) artist.textContent = sel.music.artist || '';
  } else {
    if (bar) bar.style.display = 'none';
  }

  // Copy button for this platform
  const postPlatformsEl = document.getElementById('postPlatforms');
  if (postPlatformsEl) {
    const btnClass = _previewPlatformBtn[platform] || '';
    const label    = _previewPlatformNames[platform] || platform;
    postPlatformsEl.innerHTML =
      `<button class="btn-platform ${btnClass}" onclick="copyForPlatform(this,'${platform}')">
        Copy full post for ${label}
      </button>`;
  }
}

function previewSwitchPlatform(platform) {
  document.querySelectorAll('.preview-platform-tab').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.platform === platform));
  previewShowPlatform(platform);
}

function copyForPlatform(btn, platform) {
  const sel      = selections[platform] || {};
  const d        = generatedData[platform] || {};
  const caption  = sel.caption || '';
  const hashtags = (d.hashtags || []).join(' ');
  const text     = [caption, hashtags].filter(Boolean).join('\n\n');
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = orig; }, 1800);
  });
}

function copyPreviewCaption(btn) {
  const el = document.getElementById('mockCaption');
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Copied';
    setTimeout(() => { btn.innerHTML = orig; }, 1500);
  });
}

function copyPreviewHashtags(btn) {
  const tags = Array.from(document.querySelectorAll('#mockHashtags span')).map(s => s.textContent).join('');
  navigator.clipboard.writeText(tags).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Copied';
    setTimeout(() => { btn.innerHTML = orig; }, 1500);
  });
}

function toggleMusicPreview() {
  musicPlaying = !musicPlaying;
  document.getElementById('playIcon').style.display = musicPlaying ? 'none' : 'block';
  document.getElementById('pauseIcon').style.display = musicPlaying ? 'block' : 'none';
}

// ── Plan permissions ──
const PLAN_LIMITS = {
  free:    { postOptimizer: 5, viralityCalc: 5, cringeCalc: 5 },
  starter: { postOptimizer: 5, viralityCalc: 5, cringeCalc: 5 },
  pro:     { postOptimizer: Infinity, viralityCalc: Infinity, cringeCalc: Infinity },
  growth:  { postOptimizer: Infinity, viralityCalc: Infinity, cringeCalc: Infinity },
  agency:  { postOptimizer: Infinity, viralityCalc: Infinity, cringeCalc: Infinity }
};
async function checkLimit(tool) {
  const user = window._spUser;
  if (!user) { showPage('login'); return false; }
  const plan = user.plan || 'free';
  const limit = (PLAN_LIMITS[plan] || PLAN_LIMITS.free)[tool];
  const monthKey = new Date().toISOString().slice(0, 7);
  if (user.usageMonth !== monthKey) { user.usage = {}; user.usageMonth = monthKey; }
  const used = (user.usage || {})[tool] || 0;
  if (used >= limit) {
    const planLabel = (plan === 'free' || plan === 'starter') ? 'Starter' : plan.charAt(0).toUpperCase() + plan.slice(1);
    alert("You've hit your monthly limit on the" + planLabel + "plan.Upgrade to continue.");
    showPage('pricing');
    return false;
  }
  user.usage = user.usage || {};
  user.usage[tool] = used + 1;
  user.usageMonth = monthKey;
  if (window._fb && window._fb.auth && window._fb.auth.currentUser) {
    try {
      await window._fb.updateDoc(
        window._fb.doc(window._fb.db, 'users', window._fb.auth.currentUser.uid),
        { usage: user.usage, usageMonth: monthKey }
      );
    } catch(e) { console.warn('Usage sync failed', e); }
  }
  return true;
}

function poReset() {
  selectedPlatforms = []; generatedData = {}; selections = {}; activePlatform = null;
  uploadedFile = null; musicPlaying = false;
  clearInterval(progressInterval);
  document.querySelectorAll('.platform-chip').forEach(c => c.classList.remove('selected'));
  document.getElementById('linkInput').value = '';
  document.getElementById('descInput').value = '';
  document.getElementById('fileInput').value = '';
  document.getElementById('fileChosen').classList.remove('visible');
  document.getElementById('errorBanner').classList.remove('visible');
  document.getElementById('generateBtn').disabled = true;
  document.getElementById('generateHint').style.display = 'block';
  poStage('input');
}

function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
(function(){let egSelectedPlatform='tiktok';let egUploadedFile=null;function egSwitchTab(tab){document.getElementById('egTabFileContent').style.display=tab==='file'?'block':'none';document.getElementById('egTabUrlContent').style.display=tab==='url'?'block':'none';document.getElementById('egTabFile').classList.toggle('active',tab==='file');document.getElementById('egTabUrl').classList.toggle('active',tab==='url');}
function egSelectPlatform(el){document.querySelectorAll('.eg-platform-chip').forEach(c=>c.classList.remove('selected'));el.classList.add('selected');egSelectedPlatform=el.dataset.platform;}
function egHandleFile(input){if(input.files[0]){egUploadedFile=input.files[0];document.querySelector('.eg-upload-title').textContent='✓ '+egUploadedFile.name;document.querySelector('.eg-upload-zone').style.borderColor='var(--green)';}}
function egShowPage(id){['egPageInput','egPageLoading','egPageResults'].forEach(p=>{const el=document.getElementById(p);if(el){el.style.cssText=p===id?'display:block':'display:none!important';}});window.scrollTo(0,0);}
async function egAnalyze(){const url=document.getElementById('egUrl').value.trim();const errorEl=document.getElementById('egError');errorEl.classList.remove('visible');const activeTab=document.getElementById('egTabFile').classList.contains('active')?'file':'url';if(activeTab==='file'&&!egUploadedFile){errorEl.textContent='Please upload a video file.';errorEl.classList.add('visible');return;}
if(activeTab==='url'&&!url){errorEl.textContent='Please paste a video URL.';errorEl.classList.add('visible');return;}
egShowPage('egPageLoading');const stepTimings=[600,1400,2200];const steps=['egStep2','egStep3','egStep4'];stepTimings.forEach((t,i)=>setTimeout(()=>{if(i>0){const prev=document.getElementById(steps[i-1]);prev.className='eg-load-step done';prev.querySelector('.eg-ls-status').textContent='Done';}
if(i<steps.length){const cur=document.getElementById(steps[i]);cur.className='eg-load-step active';cur.querySelector('.eg-ls-status').textContent='Running';}},t));await new Promise(r=>setTimeout(r,3000));steps.forEach(id=>{const s=document.getElementById(id);s.className='eg-load-step done';s.querySelector('.eg-ls-status').textContent='Done';});await new Promise(r=>setTimeout(r,400));const platformLabels={tiktok:'TikTok',instagram:'Instagram',youtube:'YouTube',twitter:'X / Twitter',linkedin:'LinkedIn'};document.getElementById('egPlatformLabel').textContent=platformLabels[egSelectedPlatform]||egSelectedPlatform;egShowPage('egPageResults');setTimeout(()=>{egDrawGraph();egAnimateBars();},100);}
function egReset(){egUploadedFile=null;document.getElementById('egUrl').value='';document.getElementById('egNiche').value='';document.getElementById('egDuration').value='';document.getElementById('egTranscript').value='';document.querySelector('.eg-upload-title').textContent='Drop your video here';document.querySelector('.eg-upload-zone').style.borderColor='';egShowPage('egPageInput');}
function egToggleCollapse(){const btn=document.getElementById('egCollapseBtn');const content=document.getElementById('egCollapseContent');btn.classList.toggle('open');content.classList.toggle('open');}
function egAnimateBars(){document.querySelectorAll('.eg-moment-bar-fill, .eg-intel-bar-fill, .eg-pacing-fill').forEach(el=>{const w=el.style.width;el.style.width='0';requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.width=w;}));});}
function egDrawGraph(){const canvas=document.getElementById('egCanvas');const dpr=window.devicePixelRatio||1;const W=canvas.offsetWidth;const H=220;canvas.width=W*dpr;canvas.height=H*dpr;const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);const PAD={top:20,right:20,bottom:36,left:44};const gW=W-PAD.left-PAD.right;const gH=H-PAD.top-PAD.bottom;const curve=[[0,100],[0.04,96],[0.08,80],[0.10,78],[0.13,80],[0.18,84],[0.22,81],[0.25,83],[0.30,87],[0.35,90],[0.42,93],[0.46,90],[0.51,88],[0.55,86],[0.58,91],[0.62,88],[0.68,85],[0.72,82],[0.76,80],[0.80,78],[0.84,72],[0.87,64],[0.90,58],[0.93,55],[0.96,52],[1.0,50]];const bench=[[0,100],[0.1,88],[0.2,80],[0.3,74],[0.4,70],[0.5,66],[0.6,62],[0.7,58],[0.8,55],[0.9,52],[1.0,50]];function toX(t){return PAD.left+t*gW;}
function toY(v){return PAD.top+(1-v/100)*gH;}
ctx.strokeStyle='rgba(139,92,246,0.08)';ctx.lineWidth=1;for(let i=0;i<=4;i++){const y=PAD.top+(i/4)*gH;ctx.beginPath();ctx.moveTo(PAD.left,y);ctx.lineTo(W-PAD.right,y);ctx.stroke();}
ctx.fillStyle='rgba(148,144,176,0.45)';ctx.font='10px DM Sans, sans-serif';ctx.textAlign='right';for(let i=0;i<=4;i++){const v=100-i*25;const y=PAD.top+(i/4)*gH;ctx.fillText(v+'%',PAD.left-8,y+4);}
const fillGrad=ctx.createLinearGradient(0,PAD.top,0,PAD.top+gH);fillGrad.addColorStop(0,'rgba(168,85,247,0.22)');fillGrad.addColorStop(0.5,'rgba(236,72,153,0.1)');fillGrad.addColorStop(1,'rgba(168,85,247,0.02)');ctx.beginPath();ctx.moveTo(toX(curve[0][0]),toY(curve[0][1]));curve.forEach(([t,v])=>ctx.lineTo(toX(t),toY(v)));ctx.lineTo(toX(1),PAD.top+gH);ctx.lineTo(toX(0),PAD.top+gH);ctx.closePath();ctx.fillStyle=fillGrad;ctx.fill();ctx.beginPath();ctx.setLineDash([4,4]);ctx.strokeStyle='rgba(148,144,176,0.3)';ctx.lineWidth=1.5;bench.forEach(([t,v],i)=>{i===0?ctx.moveTo(toX(t),toY(v)):ctx.lineTo(toX(t),toY(v));});ctx.stroke();ctx.setLineDash([]);const lineGrad=ctx.createLinearGradient(PAD.left,0,PAD.left+gW,0);lineGrad.addColorStop(0,'#a855f7');lineGrad.addColorStop(0.5,'#ec4899');lineGrad.addColorStop(1,'#a855f7');ctx.beginPath();curve.forEach(([t,v],i)=>{i===0?ctx.moveTo(toX(t),toY(v)):ctx.lineTo(toX(t),toY(v));});ctx.strokeStyle=lineGrad;ctx.lineWidth=2.5;ctx.lineJoin='round';ctx.stroke();const markers=[{t:0.04,type:'drop',label:'0:08',severity:'high'},{t:0.22,type:'micro',label:'0:22'},{t:0.42,type:'peak',label:'0:42'},{t:0.32,type:'replay',label:'0:58'},{t:0.62,type:'micro',label:'1:12',severity:'high'},{t:0.87,type:'drop',label:'1:47'},];const markerColors={drop:'#f87171',peak:'#a855f7',replay:'#60a5fa',micro:'#f59e0b',};markers.forEach(({t,type,label,severity})=>{const x=toX(t);const pt=curve.find(([ct])=>Math.abs(ct-t)<0.05);const y=pt?toY(pt[1]):PAD.top;const col=markerColors[type];ctx.beginPath();ctx.setLineDash([3,3]);ctx.strokeStyle=col+'60';ctx.lineWidth=1;ctx.moveTo(x,PAD.top);ctx.lineTo(x,PAD.top+gH);ctx.stroke();ctx.setLineDash([]);const r=severity==='high'?6:4;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();ctx.strokeStyle='rgba(8,6,15,0.8)';ctx.lineWidth=1.5;ctx.stroke();});const times=['0:00','0:26','0:52','1:18','1:44','End'];const ts=document.getElementById('egTimestamps');ts.innerHTML=times.map(t=>`<span>${t}</span>`).join('');}
(function(){const canvas=document.getElementById('egCanvas');if(!canvas)return;const tooltip=document.getElementById('egTooltip');const tipTs=document.getElementById('egTooltipTs');const tipVal=document.getElementById('egTooltipVal');const tipNote=document.getElementById('egTooltipNote');const curve=[[0,100],[0.04,96],[0.08,80],[0.10,78],[0.13,80],[0.18,84],[0.22,81],[0.25,83],[0.30,87],[0.35,90],[0.42,93],[0.46,90],[0.51,88],[0.55,86],[0.58,91],[0.62,88],[0.68,85],[0.72,82],[0.76,80],[0.80,78],[0.84,72],[0.87,64],[0.90,58],[0.93,55],[0.96,52],[1.0,50]];const events={0.04:{note:'Hook — 34% exit here',color:'#f87171'},0.22:{note:'Micro drop — transition gap',color:'#f59e0b'},0.42:{note:'Peak — replay spike',color:'#a855f7'},0.32:{note:'Replay cluster ×2.3',color:'#60a5fa'},0.62:{note:'Dead zone — cut recommended',color:'#f59e0b'},0.87:{note:'Outro exit before CTA',color:'#f87171'},};const totalSecs=114;canvas.addEventListener('mousemove',function(e){const rect=canvas.getBoundingClientRect();const mx=e.clientX-rect.left;const PAD_L=44,PAD_R=20;const gW=rect.width-PAD_L-PAD_R;const t=Math.max(0,Math.min(1,(mx-PAD_L)/gW));let closest=curve[0];curve.forEach(p=>{if(Math.abs(p[0]-t)<Math.abs(closest[0]-t))closest=p;});const[ct,cv]=closest;const secs=Math.round(ct*totalSecs);const mm=Math.floor(secs/60);const ss=String(secs%60).padStart(2,'0');const ts=mm+':'+ss;tipTs.textContent=ts;tipVal.textContent=cv+'% retention';let note='';Object.entries(events).forEach(([et,ev])=>{if(Math.abs(parseFloat(et)-ct)<0.04){note=ev.note;tipVal.style.color=ev.color;}});if(!note)tipVal.style.color='var(--text)';tipNote.textContent=note;const tW=150;let tx=mx+12;if(tx+tW>rect.width)tx=mx-tW-12;tooltip.style.left=tx+'px';tooltip.style.top='10px';tooltip.style.display='block';});canvas.addEventListener('mouseleave',()=>{tooltip.style.display='none';});})();let egResizeTimer;window.addEventListener('resize',()=>{clearTimeout(egResizeTimer);egResizeTimer=setTimeout(()=>{if(document.getElementById('egPageResults').style.display!=='none')egDrawGraph();},200);});window.egSwitchTab=egSwitchTab;window.egSelectPlatform=egSelectPlatform;window.egHandleFile=egHandleFile;window.egAnalyze=egAnalyze;window.egReset=egReset;window.egToggleCollapse=egToggleCollapse;window.egShowPage=egShowPage;window.egDrawGraph=egDrawGraph;})();let ccSelectedPlatform=null;let ccAnalyzing=false;let ccInputMode='text';let ccUploadedFile=null;let ccUploadedBase64=null;let ccUploadedMime=null;function ccEsc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
function ccSwitchInputTab(tab){ccInputMode=tab;['file','url'].forEach(t=>{const btn=document.getElementById('ccTab'+t.charAt(0).toUpperCase()+t.slice(1));const content=document.getElementById('ccTab'+t.charAt(0).toUpperCase()+t.slice(1)+'Content');if(btn)btn.classList.toggle('active',t===tab);if(content)content.style.display=t===tab?'block':'none';});ccCheckReady();}
function ccHandleFile(input){const file=input.files[0];if(!file)return;const reader=new FileReader();reader.onload=e=>{const dataUrl=e.target.result;const parts=dataUrl.split(',');ccUploadedBase64=parts[1];ccUploadedMime=file.type||'image/jpeg';ccUploadedFile=file;const titleEl=document.getElementById('ccUploadTitle');if(titleEl){titleEl.innerHTML='<span class="cc-upload-success">✓ '+ccEsc(file.name)+'</span>';}
const zone=document.getElementById('ccDropZone');if(zone)zone.style.borderColor='rgba(74,222,128,0.45)';ccCheckReady();};reader.readAsDataURL(file);}
function ccToggleChip(el){document.querySelectorAll('#page-tool-cringe-calculator .cc-chip').forEach(c=>c.classList.remove('selected'));el.classList.add('selected');ccSelectedPlatform=el.dataset.platform;ccCheckReady();}
function ccCheckReady(){const btn=document.getElementById('ccAnalyzeBtn');const hint=document.getElementById('ccHint');const cap=document.getElementById('ccCaption');const captionOk=cap&&cap.value.trim().length>10;let attachOk=false;if(ccInputMode==='file'){attachOk=!!ccUploadedBase64;}else if(ccInputMode==='url'){const url=document.getElementById('ccUrl');attachOk=url&&url.value.trim().length>10;}
const ready=ccSelectedPlatform&&captionOk&&attachOk;if(btn)btn.disabled=!ready;if(hint)hint.style.display=ready?'none':'block';}
function ccUpdateChar(){const el=document.getElementById('ccCaption');const cc=document.getElementById('ccCharCount');if(el&&cc)cc.textContent=el.value.length;ccCheckReady();}
function ccStage(name){const map={input:'ccPageInput',loading:'ccPageLoading',results:'ccPageResults'};Object.values(map).forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('cc-active');});const t=document.getElementById(map[name]);if(t)t.classList.add('cc-active');window.scrollTo(0,0);}
function ccUpdateSteps(done){for(let i=0;i<5;i++){const s=document.getElementById('ccStep'+i);if(!s)continue;const st=s.querySelector('.sp-step-status');s.className='sp-step '+(i<done?'done':i===done?'active':'pending');if(st)st.textContent=i<done?'Done':i===done?'Running...':'Waiting';}}
function ccReset(){ccSelectedPlatform=null;ccAnalyzing=false;ccInputMode='file';ccUploadedFile=null;ccUploadedBase64=null;ccUploadedMime=null;document.querySelectorAll('#page-tool-cringe-calculator .cc-chip').forEach(c=>c.classList.remove('selected'));const cap=document.getElementById('ccCaption');if(cap)cap.value='';const cc=document.getElementById('ccCharCount');if(cc)cc.textContent='0';const urlEl=document.getElementById('ccUrl');if(urlEl)urlEl.value='';const titleEl=document.getElementById('ccUploadTitle');if(titleEl)titleEl.textContent='Drop any file here';const zone=document.getElementById('ccDropZone');if(zone)zone.style.borderColor='';const fileInput=document.getElementById('ccFileInput');if(fileInput)fileInput.value='';const err=document.getElementById('ccErrorBanner');if(err){err.textContent='';err.classList.remove('show');}
const bdBody=document.getElementById('ccBdBody');if(bdBody)bdBody.classList.remove('open');const bdChev=document.getElementById('ccBdChevron');if(bdChev)bdChev.classList.remove('open');ccSwitchInputTab('file');ccCheckReady();ccStage('input');}
async function ccAnalyze(){if(ccAnalyzing)return;if(!await checkLimit('cringeCalc'))return;const errEl=document.getElementById('ccErrorBanner');errEl.classList.remove('show');if(!ccSelectedPlatform){errEl.textContent='Please select a platform.';errEl.classList.add('show');return;}
const caption=(document.getElementById('ccCaption')?.value||'').trim();if(caption.length<10){errEl.textContent='Please add your caption (at least 10 characters).';errEl.classList.add('show');return;}
if(ccInputMode==='file'&&!ccUploadedBase64){errEl.textContent='Please upload a file.';errEl.classList.add('show');return;}
if(ccInputMode==='url'){const url=(document.getElementById('ccUrl')?.value||'').trim();if(url.length<10){errEl.textContent='Please enter a valid post URL.';errEl.classList.add('show');return;}}
ccAnalyzing=true;const ccStartTime=Date.now();ccStage('loading');ccUpdateSteps(0);[700,1400,2100,2700].forEach((t,i)=>setTimeout(()=>ccUpdateSteps(i+1),t));const platformLabels={instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',twitter:'X / Twitter',linkedin:'LinkedIn'};const platformLabel=platformLabels[ccSelectedPlatform]||ccSelectedPlatform;const systemPrompt=`You are a brutally honest social media content quality analyst specialising in detecting cringe,inauthenticity,and low-quality patterns in creator content.Return ONLY valid JSON.No markdown,no code blocks,no preamble.Return this exact structure:{"score":<integer 0-100,where 0=completely authentic and 100=maximum cringe>,"grade":<"A+"|"A"|"A-"|"B+"|"B"|"B-"|"C+"|"C"|"C-"|"D"|"F">,"tier":<"Totally Clean"|"Mostly Authentic"|"Some Cringe"|"Pretty Cringe"|"Full Cringe">,"verdict":<2-3 sentence direct assessment of what makes this cringe or authentic.No em dashes.Be specific.>,"ifOneThingOnly":<single most important fix,1 sentence,direct and specific.No em dashes.>,"removeThese":[<3 specific phrases,patterns,or elements to remove,under 15 words each>],"replaceWith":[<3 specific alternative approaches corresponding to the remove list,under 20 words each>],"clicheDensity":{"score":<0-100>,"weight":25,"label":<"Fresh"|"Some Clichés"|"Very Overused"|"Saturated">,"colorKey":<"green"|"yellow"|"red">,"reason":<1 concise sentence>},"authenticity":{"score":<0-100>,"weight":20,"label":<"Genuine"|"Slightly Forced"|"Try-Hard"|"Performative">,"colorKey":<"green"|"yellow"|"red">,"reason":<1 concise sentence>},"engagementBait":{"score":<0-100>,"weight":15,"label":<"Clean"|"Mild Bait"|"Bait-Heavy"|"Full Bait">,"colorKey":<"green"|"yellow"|"red">,"reason":<1 concise sentence>},"overhype":{"score":<0-100>,"weight":15,"label":<"Grounded"|"Slightly Hyped"|"Overhyped"|"Unhinged Hype">,"colorKey":<"green"|"yellow"|"red">,"reason":<1 concise sentence>},"audienceMismatch":{"score":<0-100>,"weight":15,"label":<"Well-Matched"|"Minor Gaps"|"Noticeable Drift"|"Wrong Audience">,"colorKey":<"green"|"yellow"|"red">,"reason":<1 concise sentence>},"toneAndFlow":{"score":<0-100>,"weight":10,"label":<"Smooth"|"Minor Shifts"|"Jarring"|"Incoherent">,"colorKey":<"green"|"yellow"|"red">,"reason":<1 concise sentence>},"detectedPatterns":<e.g."Humble-brag opener, heavy CTA stack, algorithm-bait hashtags">,"platformFit":<1 sentence on how well the style fits the chosen platform>,"audienceMismatch":<1 sentence on potential disconnect between tone and likely audience>,"authenticityNote":<1 sentence on the single most authentic element in the content>,"breakdown":{"forced_relatability":{"score":<0-100>,"note":<1 concise sentence>},"buzzword_density":{"score":<0-100>,"note":<1 concise sentence>},"performative_humility":{"score":<0-100>,"note":<1 concise sentence>},"cta_desperation":{"score":<0-100>,"note":<1 concise sentence>},"trend_chasing":{"score":<0-100>,"note":<1 concise sentence>},"caption_bloat":{"score":<0-100>,"note":<1 concise sentence>}}}
Higher scores=more cringe.Grade A+means clean and authentic,F means full cringe.Weight the overall score as:Cliche Density 25%,Authenticity 20%,Engagement Bait 15%,Overhype 15%,Audience Mismatch 15%,Tone and Flow 10%.Be specific and accurate.`;const captionText=(document.getElementById('ccCaption')?.value||'').trim();let requestBody;if(ccInputMode==='file'){requestBody={system:systemPrompt,messages:[{role:'user',content:[{type:'image',source:{type:'base64',media_type:ccUploadedMime,data:ccUploadedBase64}},{type:'text',text:`Platform:${platformLabel}\n\nCaption/post text:\n${captionText}\n\nThe attached file is the post or content being analysed.Use both the caption above and the file to give the most accurate cringe analysis.Return the full cringe analysis JSON.`}]}]};}else if(ccInputMode==='url'){const url=(document.getElementById('ccUrl')?.value||'').trim();requestBody={system:systemPrompt,messages:[{role:'user',content:`Platform:${platformLabel}\n\nCaption/post text:\n${captionText}\n\nPost URL:${url}\n\nAnalyse the content using both the caption and the URL for context.Consider the platform format,URL pattern,and any content style cues you can infer.Return the full cringe analysis JSON.`}]};}
let data=null;try{const res=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(requestBody)});const json=await res.json();if(json.error)throw new Error(json.error.message||'API error');const raw=(json.content||[]).map(b=>b.text||'').join('').trim().replace(/^```json\s*/,'').replace(/^```\s*/,'').replace(/\s*```$/,'').trim();data=JSON.parse(raw);}catch(err){data=ccDemoData(platformLabel);}
ccUpdateSteps(5);const elapsed=Date.now()-ccStartTime;const delay=Math.max(700,3000-elapsed);setTimeout(()=>{ccBuildResults(data);ccStage('results');ccAnalyzing=false;},delay);}
function ccDemoData(platform){return{score:54,grade:'C+',tier:'Some Cringe',verdict:'This post has a few genuine moments but they get buried under predictable phrasing and a CTA stack that reads more desperate than confident. On '+platform+', this style is recognisable as "creator template" content rather than something that feels personal or specific.',ifOneThingOnly:'Rewrite the first line so it sounds like something you would actually say out loud to a friend, not a formula you read in a growth hack thread.',removeThese:['The phrase "Do not miss this" adds urgency but reads as filler','Stacked hashtags in the caption body break reading flow and signal low effort','The closing "Let me know in the comments" is overused and adds no specificity'],replaceWith:['Lead with the specific result or moment that made you want to post this','Move all hashtags to the first comment or keep only three highly relevant ones in the caption','End with a specific question tied to the content, for example what they would have done differently'],clicheDensity:{score:68,label:'Very Overused',colorKey:'red',reason:'At least four phrases rank in the top overused creator content patterns for this platform.'},authenticity:{score:62,label:'Try-Hard',colorKey:'red',reason:'Several lines appear engineered for engagement rather than genuine expression.'},engagementBait:{score:55,label:'Bait-Heavy',colorKey:'yellow',reason:'The CTA stack and hook both lean on classic bait mechanics without original framing.'},overhype:{score:48,label:'Slightly Hyped',colorKey:'yellow',reason:'Claim strength slightly exceeds what the content can substantiate on its own.'},audienceMismatch:{score:42,label:'Minor Gaps',colorKey:'yellow',reason:'The casual opener sets a peer tone but the closing CTA shifts to a broadcast register.'},toneAndFlow:{score:35,label:'Minor Shifts',colorKey:'green',reason:'Tone is broadly consistent but drifts slightly between the hook and the close.'},detectedPatterns:'Aspiration opener, value-list body, stacked CTA close, generic hashtag dump',platformFit:'The structure is common on '+platform+' but does not differentiate from the large volume of similar content in this format.',audienceMismatch:'The casual opener sets a peer tone but the stacked CTAs shift to a broadcast voice that does not match the opening register.',authenticityNote:'The specific detail in the second sentence is the most authentic element and is worth expanding.',breakdown:{forced_relatability:{score:60,note:'The opening "we all know" is a forced relatability device that distances rather than connects.'},buzzword_density:{score:55,note:'Three buzzwords in the first two sentences reduces perceived specificity.'},performative_humility:{score:40,note:'Moderate performative humility present but not dominant in the structure.'},cta_desperation:{score:68,note:'Three CTAs stacked in the final two lines signals low confidence in organic engagement.'},trend_chasing:{score:50,note:'The format mirrors a trend from 60 to 90 days ago, slightly past peak performance.'},caption_bloat:{score:45,note:'Caption length is within an acceptable range but could be trimmed by around 20 percent.'}}};}
function ccScoreColor(score){const stops=[[0,239,68,68],[25,249,115,22],[50,234,179,8],[75,134,239,172],[100,21,128,61],];for(let i=0;i<stops.length-1;i++){const[s0,r0,g0,b0]=stops[i];const[s1,r1,g1,b1]=stops[i+1];if(score<=s1){const t=(score-s0)/(s1-s0);return`rgb(${Math.round(r0+(r1-r0)*t)},${Math.round(g0+(g1-g0)*t)},${Math.round(b0+(b1-b0)*t)})`;}}
return`rgb(21,128,61)`;}
function ccBuildResults(d){const circ=408.41;const offset=circ*(1-d.score/100);const scoreColor=ccScoreColor(d.score);const ring=document.getElementById('ccRingFill');if(ring){ring.style.stroke=scoreColor;ring.style.strokeDasharray=circ;ring.style.strokeDashoffset=circ;setTimeout(()=>{ring.style.strokeDashoffset=offset;},120);const gradeEl=document.getElementById('ccGradeText');if(gradeEl){gradeEl.style.background=scoreColor;gradeEl.style.webkitBackgroundClip='text';gradeEl.style.webkitTextFillColor='transparent';gradeEl.style.backgroundClip='text';gradeEl.style.filter=`drop-shadow(0 0 22px ${scoreColor}88)`;}}
const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};const scoreNumEl=document.getElementById('ccScoreNum');if(scoreNumEl){scoreNumEl.textContent=d.score;scoreNumEl.style.background=scoreColor;scoreNumEl.style.webkitBackgroundClip='text';scoreNumEl.style.webkitTextFillColor='transparent';scoreNumEl.style.backgroundClip='text';}
set('ccGradeText',d.grade);set('ccTierText',d.tier);set('ccVerdictText',d.verdict);set('ccIfOneText',d.ifOneThingOnly);const rem=document.getElementById('ccRemoveList');if(rem)rem.innerHTML=(d.removeThese||[]).map(w=>'<li>'+ccEsc(w)+'</li>').join('');const rep=document.getElementById('ccReplaceList');if(rep)rep.innerHTML=(d.replaceWith||[]).map(w=>'<li>'+ccEsc(w)+'</li>').join('');const signals=[{key:'clicheDensity',name:'Cliche Density',weight:25},{key:'authenticity',name:'Authenticity',weight:20},{key:'engagementBait',name:'Engagement Bait',weight:15},{key:'overhype',name:'Overhype',weight:15},{key:'audienceMismatch',name:'Audience Mismatch',weight:15},{key:'toneAndFlow',name:'Tone & Flow',weight:10}];const grid=document.getElementById('ccSignalGrid');if(grid){grid.innerHTML=signals.map(s=>{const sig=d[s.key]||{};const ck=sig.colorKey||'yellow';const barColor=ccScoreColor(sig.score||0);return`<div class="cc-insight-card"><div class="cc-insight-top"><div class="cc-insight-name">${ccEsc(s.name)}</div><div class="cc-insight-badge cc-badge-${ck}">${ccEsc(sig.label||'—')}</div></div><div class="cc-insight-score"style="color:${barColor};-webkit-text-fill-color:${barColor};">${sig.score||0}</div><div class="cc-insight-bar"><div class="cc-insight-fill"style="width:0%;background:${barColor}"data-pct="${sig.score || 0}"></div></div><div class="cc-insight-reason">${ccEsc(sig.reason||'')}</div></div>`;}).join('');setTimeout(()=>{grid.querySelectorAll('.cc-insight-fill').forEach(el=>{el.style.width=el.dataset.pct+'%';});},200);}
const intelRows=document.getElementById('ccIntelRows');if(intelRows){const rows=[['Detected Patterns',d.detectedPatterns||'—'],['Platform Fit',d.platformFit||'—'],['Audience Mismatch',d.audienceMismatch||'—'],['Authentic Element',d.authenticityNote||'—']];intelRows.innerHTML=rows.map(([k,v])=>`<div class="cc-intel-row"><div class="cc-intel-key">${ccEsc(k)}</div><div class="cc-intel-val">${ccEsc(v)}</div></div>`).join('');}
const bdGrid=document.getElementById('ccBdGrid');if(bdGrid&&d.breakdown){const bdLabels={forced_relatability:'Forced Relatability',buzzword_density:'Buzzword Density',performative_humility:'Performative Humility',cta_desperation:'CTA Desperation',trend_chasing:'Trend Chasing',caption_bloat:'Caption Bloat'};bdGrid.innerHTML=Object.entries(d.breakdown).map(([k,v])=>{const bdColor=ccScoreColor(v.score||0);return`<div class="cc-bd-item"><div class="cc-bd-item-header"><div class="cc-bd-item-name">${ccEsc(bdLabels[k]||k)}</div><div class="cc-bd-item-score"style="color:${bdColor};-webkit-text-fill-color:${bdColor};">${v.score}</div></div><div class="cc-bd-item-bar"><div class="cc-bd-item-fill"style="width:0%;background:${bdColor}"data-w="${v.score}%"></div></div><div class="cc-bd-item-note">${ccEsc(v.note||'')}</div></div>`;}).join('');setTimeout(()=>{bdGrid.querySelectorAll('.cc-bd-item-fill').forEach(el=>{el.style.width=el.dataset.w;});},300);}}
function ccToggleBd(){const body=document.getElementById('ccBdBody');const chev=document.getElementById('ccBdChevron');if(body)body.classList.toggle('open');if(chev)chev.classList.toggle('open');}
// ── Clip Studio ──────────────────────────────────────────────────────────────
(function(){

// ── CAPTION GLOBALS ──
var capStyle = { font:'Impact', fontCss:'Impact,sans-serif', color:'#ffffff', colorLabel:'White', outline:'black', size:28, pos:'top-center' };

function toggleFontDrop(){
  var btn=document.getElementById('fontBtn');
  var drop=document.getElementById('fontDrop');
  btn.classList.toggle('open');
  drop.classList.toggle('open');
  if(drop.classList.contains('open')){
    setTimeout(function(){document.addEventListener('click',closeFontDrop,{once:true});},0);
  }
}
function closeFontDrop(e){
  var wrap=document.querySelector('.font-select-wrap');
  if(wrap&&!wrap.contains(e.target)){
    document.getElementById('fontBtn').classList.remove('open');
    document.getElementById('fontDrop').classList.remove('open');
  }
}
function selFont(el){
  document.querySelectorAll('.font-item').forEach(function(e){e.classList.remove('sel');});
  el.classList.add('sel');
  capStyle.font=el.dataset.font;
  capStyle.fontCss=el.dataset.css;
  var lbl=document.getElementById('fontBtnLabel');
  lbl.textContent='Aa — '+capStyle.font;
  lbl.style.fontFamily=capStyle.fontCss;
  document.getElementById('fontBtn').classList.remove('open');
  document.getElementById('fontDrop').classList.remove('open');
  updatePreview();
}
function selColor(el){
  document.querySelectorAll('.color-swatch').forEach(function(e){e.classList.remove('sel');});
  el.classList.add('sel');
  capStyle.color=el.dataset.color;
  capStyle.colorLabel=el.dataset.label;
  updatePreview();
}
function selOutline(el){
  document.querySelectorAll('.outline-opt').forEach(function(e){e.classList.remove('sel');});
  el.classList.add('sel');
  capStyle.outline=el.dataset.outline;
  updatePreview();
}
function updateSize(v){
  capStyle.size=parseInt(v);
  document.getElementById('fontSizeVal').textContent=v;
  updatePreview();
}
function selPos(el){
  document.querySelectorAll('.pos-opt').forEach(function(e){e.classList.remove('sel');});
  el.classList.add('sel');
  capStyle.pos=el.dataset.pos;
  updatePreview();
}
function updatePreview(){
  var pt=document.getElementById('capPreviewText');
  var em=document.getElementById('capEmphasis');
  if(!pt) return;
  pt.style.fontFamily=capStyle.fontCss;
  pt.style.fontSize=capStyle.size+'px';
  var gradMap={'grad-wyw':'linear-gradient(90deg,#fff 0%,#ffff00 50%,#fff 100%)','grad-fire':'linear-gradient(90deg,#ff0000,#ff9900,#ffff00)','grad-pp':'linear-gradient(90deg,#a855f7,#ec4899)','grad-pyp':'linear-gradient(90deg,#ff69b4 0%,#ffff00 50%,#ff69b4 100%)','grad-wbw':'linear-gradient(90deg,#fff 0%,#60a5fa 50%,#fff 100%)','grad-rgb':'linear-gradient(90deg,red,orange,yellow,green,blue,violet)'};
  var emphMap={'emph-wy':['#fff','#ffff00'],'emph-wo':['#fff','#ff9900'],'emph-wp':['#fff','#ff69b4']};
  if(emphMap[capStyle.color]){
    var cols=emphMap[capStyle.color];
    pt.style.background='';pt.style.webkitBackgroundClip='';pt.style.webkitTextFillColor='';pt.style.color=cols[0];
    if(em){em.style.color=cols[1];em.style.display='inline';}
    pt.style.textShadow=getCapShadow();
  } else if(gradMap[capStyle.color]){
    pt.style.background=gradMap[capStyle.color];pt.style.webkitBackgroundClip='text';pt.style.webkitTextFillColor='transparent';pt.style.backgroundClip='text';
    if(em){em.style.display='none';}
    pt.style.textShadow='';
  } else {
    pt.style.background='';pt.style.webkitBackgroundClip='';pt.style.webkitTextFillColor=capStyle.color;pt.style.color=capStyle.color;
    if(em){em.style.display='none';}
    pt.style.textShadow=getCapShadow();
  }
}
function getCapShadow(){
  if(capStyle.outline==='black') return '-2px -2px 0 #000,2px -2px 0 #000,-2px 2px 0 #000,2px 2px 0 #000';
  if(capStyle.outline==='white') return '-2px -2px 0 #fff,2px -2px 0 #fff,-2px 2px 0 #fff,2px 2px 0 #fff';
  if(capStyle.outline==='shadow') return '3px 3px 8px rgba(0,0,0,.9),0 0 20px rgba(0,0,0,.7)';
  return '';
}


(function(){


let vidFile = null, vidUrl = null, ffmpegReady = false, ff = null;

const CLIPS = [
  {r:1,ts:'1:24',te:'3:11',s:84,e:191,dur:'1:47',sc:94,tier:'pn',tl:'Post Immediately',reason:'Opens on a direct challenge, hits an emotional story beat at 2:10, closes with a punchy quotable line. No prior context needed.',hook:'"Most people think this is impossible — but I did it in 30 days."',cap:'30 days. Zero experience. This is what happened 👇\n\n#fyp #motivation #realresults #starttoday',pt:['TikTok','Reels','Shorts']},
  {r:2,ts:'0:08',te:'1:02',s:8,e:62,dur:'0:54',sc:88,tier:'st',tl:'Strong',reason:'Opens on a bold statement. Fast pacing throughout. Works perfectly as a hook-first Reel.',hook:'"Nobody told me this when I started."',cap:"Nobody told me this when I started. Saving this 📌\n\n#reels #tips #viral",pt:['TikTok','Reels','Shorts']},
  {r:3,ts:'5:33',te:'6:58',s:333,e:418,dur:'1:25',sc:81,tier:'st',tl:'Strong',reason:'High replay value — specific stat at 6:22 drives screenshot and share behavior.',hook:'"This single number changed everything."',cap:"This one number changed everything 🤯\n\n#viral #mindset",pt:['TikTok','Reels']},
  {r:4,ts:'8:12',te:'9:10',s:492,e:550,dur:'0:58',sc:74,tier:'ne',tl:'Needs Editing',reason:'Good energy but 15 seconds of setup can be trimmed to get to the payoff faster.',hook:'"The truth nobody wants to hear."',cap:"The truth nobody wants to hear 😮\n\n#honest #growth",pt:['TikTok','Shorts']},
  {r:5,ts:'11:40',te:'12:55',s:700,e:775,dur:'1:15',sc:68,tier:'ne',tl:'Needs Editing',reason:'Strong close but slow middle. Pacing drop at 12:10 loses momentum.',hook:'"Most people give up right before this."',cap:"Most people give up right before this 📍\n\n#motivation",pt:['Reels']},
  {r:6,ts:'3:45',te:'4:30',s:225,e:270,dur:'0:45',sc:61,tier:'ne',tl:'Needs Editing',reason:'Decent moment but relies on earlier context. Needs a caption card to work standalone.',hook:'"Here\'s what they never show you."',cap:"Here's what they never show you 👀",pt:['TikTok']},
  {r:7,ts:'14:22',te:'15:08',s:862,e:908,dur:'0:46',sc:42,tier:'sk',tl:'Skip',reason:'Long filler intro, soft close, no quotable moments. Better clips available.',hook:'—',cap:'—',pt:[]}
];

const RC = ['g','s','b','b','b','b','b'];

function cs_swTab(t){
  document.getElementById('tFileC').style.display=t==='file'?'block':'none';
  document.getElementById('tUrlC').style.display=t==='url'?'block':'none';
  document.getElementById('tFile').classList.toggle('active',t==='file');
  document.getElementById('tUrl').classList.toggle('active',t==='url');
}

function cs_handleFile(inp){
  if(!inp.files[0]) return;
  vidFile=inp.files[0];
  document.getElementById('uploadTitle').textContent='✓ '+vidFile.name;
  document.getElementById('dropZone').style.borderColor='var(--green)';
}

function show(id){
  ['pgInput','pgLoad','pgResults'].forEach(p=>document.getElementById(p).style.display=p===id?'block':'none');
  window.scrollTo(0,0);
}

async function analyze(){
  const url=document.getElementById('urlIn').value.trim();
  const err=document.getElementById('err');
  err.classList.remove('show');
  const isFile=document.getElementById('tFile').classList.contains('active');
  show('pgLoad');
  const sids=['s2','s3','s4','s5'];
  [700,1700,2800,3900].forEach((t,i)=>setTimeout(()=>{
    if(i>0){const p=document.getElementById(sids[i-1]);p.className='lstep done';p.querySelector('.lstat').textContent='Done';}
    const c=document.getElementById(sids[i]);c.className='lstep active';c.querySelector('.lstat').textContent='Running';
  },t));
  await new Promise(r=>setTimeout(r,5100));
  sids.forEach(id=>{const s=document.getElementById(id);s.className='lstep done';s.querySelector('.lstat').textContent='Done';});
  await new Promise(r=>setTimeout(r,300));
  if(isFile&&vidFile){vidUrl=URL.createObjectURL(vidFile);document.getElementById('vid').src=vidUrl;}
  document.getElementById('vid').load();
  show('pgResults');
  renderClips();
  initPlayer();
}

function resetTool(){
  if(vidUrl){URL.revokeObjectURL(vidUrl);vidUrl=null;}
  vidFile=null;
  document.getElementById('urlIn').value='';
  document.getElementById('uploadTitle').textContent='Drop your video here';
  document.getElementById('dropZone').style.borderColor='';
  ['s2','s3','s4','s5'].forEach(id=>{const s=document.getElementById(id);s.className='lstep pending';s.querySelector('.lstat').textContent='Queued';});
  document.getElementById('s2').className='lstep active';document.getElementById('s2').querySelector('.lstat').textContent='Running';
  show('pgInput');
}

function renderClips(){
  document.getElementById('clipList').innerHTML=CLIPS.map((c,i)=>`
<div class="clip-card${i===0?' active':''}" id="cc${i}">
  <div class="clip-hd" onclick="cs_previewClip(${i})">
    <div class="rnk ${RC[i]}">#${c.r}</div>
    <div class="cm">
      <div class="cts">${c.ts} — ${c.te}</div>
      <div class="ci">${c.dur} · ${c.pt.join(', ')||'Not recommended'}</div>
      <div class="sbar"><div class="sbar-fill" data-w="${c.sc}%" style="width:0"></div></div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">
      <div class="cscore">${c.sc}</div>
      <div class="tier ${c.tier}">${c.tl}</div>
    </div>
  </div>
  <div class="clip-body">
    <div class="clip-reason">${c.reason}</div>
    ${c.hook!=='—'?`<div class="hook-box"><div class="hook-lbl">Hook — First 3 Seconds</div><div class="hook-text">${c.hook}</div></div>`:''}
    ${c.cap!=='—'?`<div class="cap-box"><div class="cap-lbl">Suggested Caption</div><div class="cap-text">${c.cap.replace(/\n/g,'<br>')}</div></div>`:''}
    <div class="actions">
      <button class="abtn prev" onclick="cs_previewClip(${i})">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Preview Clip
      </button>
      ${c.tier!=='sk'?`<button class="abtn exp" id="eb${i}" onclick="cs_exportClip(${i},this)">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Export MP4
      </button>`:''}
      ${c.cap!=='—'?`<button class="abtn cp" id="cb${i}" onclick="cs_copyCap(${i},this)">Copy Caption</button>`:''}
    </div>
    <div class="exp-prog" id="ep${i}"><div class="exp-fill" id="ef${i}"></div></div>
    <div class="exp-stat" id="es${i}"></div>
  </div>
</div>`).join('');
  setTimeout(()=>document.querySelectorAll('[data-w]').forEach(el=>{const w=el.dataset.w;el.style.width='0';requestAnimationFrame(()=>requestAnimationFrame(()=>el.style.width=w));}),200);
}

// ── PLAYER ──
function initPlayer(){
  const v=document.getElementById('vid');
  v.addEventListener('timeupdate',updateProg);
  v.addEventListener('ended',()=>{document.getElementById('playIcon').innerHTML='<polygon points="5 3 19 12 5 21 5 3"/>';});
  if(vidFile) cs_previewClip(0);
}

function updateProg(){
  const v=document.getElementById('vid');
  if(!v.duration) return;
  document.getElementById('tlProg').style.width=(v.currentTime/v.duration*100)+'%';
  document.getElementById('tDisp').textContent=fmt(v.currentTime)+' / '+fmt(v.duration);
}

function togglePlay(){
  const v=document.getElementById('vid');
  if(v.paused){v.play();document.getElementById('playIcon').innerHTML='<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';}
  else{v.pause();document.getElementById('playIcon').innerHTML='<polygon points="5 3 19 12 5 21 5 3"/>';}
}

function seekTo(e){
  const v=document.getElementById('vid');if(!v.duration)return;
  const r=document.getElementById('tline').getBoundingClientRect();
  v.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*v.duration;
}

let stopFn=null;
function cs_previewClip(i){
  const c=CLIPS[i],v=document.getElementById('vid');
  document.querySelectorAll('.clip-card').forEach(el=>el.classList.remove('active'));
  document.getElementById('cc'+i).classList.add('active');
  document.getElementById('clipLbl').textContent='Clip #'+c.r;
  document.getElementById('clipLbl').style.display='flex';
  if(v.src){
    v.currentTime=c.s;v.play().catch(()=>{});
    document.getElementById('playIcon').innerHTML='<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    if(v.duration){
      const r=document.getElementById('tlRegion');
      r.style.left=(c.s/v.duration*100)+'%';r.style.width=((c.e-c.s)/v.duration*100)+'%';r.style.display='block';
    }
    if(stopFn) v.removeEventListener('timeupdate',stopFn);
    stopFn=()=>{if(v.currentTime>=c.e){v.pause();v.removeEventListener('timeupdate',stopFn);document.getElementById('playIcon').innerHTML='<polygon points="5 3 19 12 5 21 5 3"/>';}};
    v.addEventListener('timeupdate',stopFn);
  }
}

// ── EXPORT ──
async function cs_exportClip(i,btn){
  const c=CLIPS[i];
  const prog=document.getElementById('ep'+i),fill=document.getElementById('ef'+i),stat=document.getElementById('es'+i);
  btn.disabled=true;
  btn.innerHTML='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin .7s linear infinite"><path d="M21 12a9 9 0 1 1-18 0"/></svg> Processing...';
  prog.classList.add('on');stat.classList.add('on');fill.style.width='5%';stat.textContent='Starting...';

  if(!vidFile){
    stat.textContent='Upload a file to enable in-browser export.';stat.style.color='var(--yellow)';
    btn.disabled=false;btn.innerHTML='Export MP4';prog.classList.remove('on');stat.classList.remove('on');return;
  }

  try{
    if(typeof FFmpeg==='undefined') throw new Error('ffmpeg not ready');
    const {createFFmpeg,fetchFile}=FFmpeg;
    if(!ff){
      stat.textContent='Initializing video engine...';fill.style.width='10%';
      ff=createFFmpeg({log:false,progress:({ratio})=>{fill.style.width=Math.round(15+ratio*70)+'%';}});
      await ff.load();
    }
    stat.textContent='Reading video file...';fill.style.width='18%';
    const fdata=await fetchFile(vidFile);
    ff.FS('writeFile','in.mp4',fdata);
    stat.textContent='Cutting '+c.ts+' to '+c.te+'...';
    await ff.run('-ss',String(c.s),'-i','in.mp4','-t',String(c.e-c.s),'-c:v','libx264','-c:a','aac','-movflags','+faststart','-y','out.mp4');
    fill.style.width='93%';stat.textContent='Preparing download...';
    const data=ff.FS('readFile','out.mp4');
    const url=URL.createObjectURL(new Blob([data.buffer],{type:'video/mp4'}));
    const a=document.createElement('a');a.href=url;a.download=`clip-${c.r}-${c.ts.replace(':','-')}_to_${c.te.replace(':','-')}.mp4`;a.click();
    URL.revokeObjectURL(url);
    try{ff.FS('unlink','in.mp4');ff.FS('unlink','out.mp4');}catch(e){}
    fill.style.width='100%';stat.textContent='✓ Download started!';stat.style.color='var(--green)';
    btn.innerHTML='✓ Exported!';btn.style.background='var(--green)';
    setTimeout(()=>{prog.classList.remove('on');stat.classList.remove('on');},4000);
  }catch(err){
    // Fallback: download with time range hack
    stat.textContent='Fast export (trim manually from '+c.ts+'–'+c.te+')...';fill.style.width='80%';
    try{
      const url=URL.createObjectURL(vidFile);
      const a=document.createElement('a');a.href=url;a.download=`clip-${c.r}-fullvideo.mp4`;a.click();
      setTimeout(()=>URL.revokeObjectURL(url),5000);
      fill.style.width='100%';
      stat.textContent='Downloaded full video. Trim from '+c.ts+' to '+c.te+' in your editor.';
      stat.style.color='var(--yellow)';
      btn.innerHTML='⚠ Downloaded (trim needed)';
    }catch(e2){stat.textContent='Export failed. Please try a different browser.';stat.style.color='var(--red)';btn.disabled=false;btn.innerHTML='Retry Export';}
  }
}

function cs_copyCap(i,btn){
  navigator.clipboard.writeText(CLIPS[i].cap).catch(()=>{});
  btn.textContent='✓ Copied';btn.classList.add('done');
  setTimeout(()=>{btn.textContent='Copy Caption';btn.classList.remove('done');},2000);
}

function fmt(s){return Math.floor(s/60)+':'+(Math.floor(s%60)+'').padStart(2,'0');}

// Expose caption fns
window.cs_toggleFontDrop=cs_toggleFontDrop;window.cs_selFont=cs_selFont;window.cs_selColor=cs_selColor;window.cs_selOutline=cs_selOutline;window.cs_updateSize=cs_updateSize;window.cs_selPos=cs_selPos;window.cs_updatePreview=cs_updatePreview;
// Expose
window.cs_swTab=cs_swTab;window.cs_handleFile=cs_handleFile;window.analyze=analyze;window.resetTool=resetTool;
window.cs_previewClip=cs_previewClip;window.togglePlay=togglePlay;window.seekTo=seekTo;
window.cs_exportClip=cs_exportClip;window.cs_copyCap=cs_copyCap;

// Load FFmpeg in background
setTimeout(()=>{
  const sc=document.createElement('script');
  sc.src='https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js';
  sc.onload=()=>{
    const st=document.getElementById('ffStatus');
    st.classList.remove('ld');
    st.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0"><polyline points="20 6 9 17 4 12"/></svg> Video processing ready — exports will be exact MP4 cuts';
    ffmpegReady=true;
    setTimeout(()=>st.classList.remove('on'),4000);
  };
  sc.onerror=()=>{
    const st=document.getElementById('ffStatus');
    st.innerHTML='⚠ Processing engine unavailable — export will download full video for manual trimming';
    st.style.color='var(--yellow)';
    st.style.borderColor='rgba(245,158,11,.2)';
    st.style.background='rgba(245,158,11,.06)';
  };
  document.head.appendChild(sc);
},800);

})();

})();

// ── Stripe Checkout ──────────────────────────────────────────────────────────
async function startCheckout(plan) {
  const user = window._spUser;
  if (!user) { showPage('login'); return; }
  const btnId = 'checkout-btn-' + plan;
  const btn = document.getElementById(btnId);
  const orig = btn ? btn.textContent : '';
  if (btn) { btn.textContent = 'Loading…'; btn.disabled = true; }
  try {
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, isAnnual, uid: user.uid, email: user.email }),
    });
    const data = await res.json();
    if (data.url) { window.location.href = data.url; }
    else { alert(data.error || 'Could not start checkout. Try again.'); }
  } catch (e) {
    alert('Could not start checkout. Please try again.');
  } finally {
    if (btn) { btn.textContent = orig; btn.disabled = false; }
  }
}

async function openBillingPortal() {
  const user = window._spUser;
  if (!user) return;
  const btn = document.getElementById('manageBillingBtn');
  const orig = btn ? btn.textContent : '';
  if (btn) { btn.textContent = 'Loading…'; btn.disabled = true; }
  try {
    const res = await fetch('/api/customer-portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid }),
    });
    const data = await res.json();
    if (data.url) { window.location.href = data.url; }
    else { alert(data.error || 'Could not open billing portal.'); }
  } catch (e) {
    alert('Something went wrong. Please try again.');
  } finally {
    if (btn) { btn.textContent = orig; btn.disabled = false; }
  }
}

// Handle post-checkout success redirect
(function() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('checkout') === 'success') {
    history.replaceState({page:'dashboard'}, '', '/dashboard');
    showPage('dashboard', true);
    setTimeout(() => {
      const toast = document.createElement('div');
      toast.textContent = '🎉 You\'re all set! Your plan has been activated.';
      toast.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;font-family:\'DM Sans\',sans-serif;font-size:14px;font-weight:600;padding:14px 28px;border-radius:100px;z-index:9999;box-shadow:0 8px 32px rgba(168,85,247,0.4);';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    }, 500);
  }
})();
