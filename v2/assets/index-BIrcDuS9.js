const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./sprint-DXPcit9o.js","./index-PPVm8Dsz.js","./shareplaza-CoiNKn2I.js","./share-0Wt4AeBc.js","./shareplaza-ext-B_uYEQ_P.js","./share-social-BkyaGfIc.js","./shareplaza-ai-yCidAihX.js"])))=>i.map(i=>d[i]);
import{o as ba,r as vt,b as de,c as j,e as le,f as E,g as I,h as un,i as b,u as U,j as ie,k as X,t as C,l as $,m as ka,w as Br,n as Sa,p as mo,q as qr,s as go,v as Ve,x as fe,F as K,y as ce,A as lt,B as hn,C as Rr,D as fr,E as Zn,G as $e,H as pe,I as xa,J as _a,K as Aa,L as Ta,M as Bs,N as Ea,O as Oa,P as Ia}from"./vendor-Co82n0Bw.js";import{T as Fe,P as Ma}from"./share-0Wt4AeBc.js";import{_ as W}from"./index-PPVm8Dsz.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const Ca="kaoyan2026",pr="kv",Pa="mistakePhotos";let er=null;function ja(){return er||(er=ba(Ca,1,{upgrade(e){e.objectStoreNames.contains(pr)||e.createObjectStore(pr)}})),er}function Na(e){let t=0,n=0,r=0,s="";return(e||[]).forEach(o=>{if(!o)return;t++,n+=(o.imageBase64||"").length;const i=o.updatedAt||o.analyzedAt||o.createdAt||"";i>s&&(s=i);try{r+=JSON.stringify(o,(a,c)=>a==="imageBase64"?void 0:c).length}catch{r+=1}}),t+"|"+n+"|"+r+"|"+s}let qs="";async function La(e){try{const t=Na(e);if(t===qs)return;await(await ja()).put(pr,JSON.parse(JSON.stringify(e||[])),Pa),qs=t}catch(t){console.warn("[photoStore] 镜像写入失败（不影响主存储）",t)}}const Rs=864e5,x={DAY_MS:Rs,uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)},dkey(e){e=e||new Date;const t=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return e.getFullYear()+"-"+t+"-"+n},isoDay(e){const t=new Date(e);return isNaN(t.getTime())?String(e||"").slice(0,10):x.dkey(t)},shortDate(e){return e=e?new Date(e):new Date,e.getMonth()+1+"."+e.getDate()},hm(e){return e=e||new Date,String(e.getHours()).padStart(2,"0")+":"+String(e.getMinutes()).padStart(2,"0")},daysTo(e){const t=new Date(e+"T00:00:00"),n=new Date;return n.setHours(0,0,0,0),Math.round((t-n)/Rs)},dow(e){return e=e||new Date,(e.getDay()+6)%7},weekMonday(e){e=e||new Date;const t=new Date(e);return t.setHours(0,0,0,0),t.setDate(t.getDate()-x.dow(t)),t},weekKeys(e){const t=x.weekMonday(e),n=[];for(let r=0;r<7;r++){const s=new Date(t);s.setDate(t.getDate()+r),n.push(x.dkey(s))}return n},keyLabel(e){const t=new Date(e+"T00:00:00"),n=["周一","周二","周三","周四","周五","周六","周日"][x.dow(t)];return t.getMonth()+1+"."+t.getDate()+" "+n},esc(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")},clamp(e,t,n){return Math.max(t,Math.min(n,e))},randInt(e,t){return e+Math.floor(Math.random()*(t-e+1))},pct(e,t){return t>0?Math.round(e/t*100):0},sum(e){return(e||[]).reduce((t,n)=>t+(+n||0),0)},avg(e){return e&&e.length?x.sum(e)/e.length:0},round1(e){return Math.round(e*10)/10},countBy(e,t){const n={};return(e||[]).forEach(r=>{const s=t(r);s!=null&&(n[s]=(n[s]||0)+1)}),n},topN(e,t){return Object.keys(e||{}).map(n=>({key:n,count:e[n]})).sort((n,r)=>r.count-n.count).slice(0,t||2)},lastNDays(e){const t=[],n=new Date;for(let r=e-1;r>=0;r--){const s=new Date(n);s.setDate(n.getDate()-r),t.push(x.dkey(s))}return t},inThisWeek(e){return x.weekKeys().indexOf(e)>=0},debounce(e,t){let n;return function(){clearTimeout(n);const r=arguments,s=this;n=setTimeout(()=>e.apply(s,r),t)}},clone(e){return JSON.parse(JSON.stringify(e))},download(e,t){const n=new Blob([t],{type:"application/json;charset=utf-8"}),r=document.createElement("a");r.href=URL.createObjectURL(n),r.download=e,document.body.appendChild(r),r.click(),setTimeout(()=>{URL.revokeObjectURL(r.href),r.remove()},100)},icon(e,t){return window.ICONS&&window.ICONS[e]?window.ICONS[e].replace("<svg",'<svg class="ci '+(t||"")+'"'):""},on(e,t){document.addEventListener(e,t)},emit(e,t){document.dispatchEvent(new CustomEvent(e,{detail:t}))},compressImage(e,t){t=t||{};const n=t.maxWidth||1200,r=t.quality!=null?t.quality:.7;return new Promise((s,o)=>{const i=new Image;if(i.onload=()=>{try{let a=i.width,c=i.height;if(a>n||c>n){const u=Math.min(n/a,n/c);a=Math.round(a*u),c=Math.round(c*u)}const l=document.createElement("canvas");l.width=a,l.height=c,l.getContext("2d").drawImage(i,0,0,a,c),s(l.toDataURL("image/jpeg",r))}catch(a){o(a)}},i.onerror=()=>o(new Error("图片读取失败")),typeof e=="string")i.src=e;else{const a=new FileReader;a.onload=()=>{i.src=a.result},a.onerror=()=>o(new Error("文件读取失败")),a.readAsDataURL(e)}})},bindSearch(e,t,n){if(!e)return function(){};const r=n??200;let s=!1,o=null;const i=()=>{t(e.value)},a=()=>{s=!0},c=()=>{s=!1,o&&(clearTimeout(o),o=null),i()},l=()=>{s||(o&&clearTimeout(o),o=setTimeout(()=>{o=null,i()},r))};return e.addEventListener("compositionstart",a),e.addEventListener("compositionend",c),e.addEventListener("input",l),function(){e.removeEventListener("compositionstart",a),e.removeEventListener("compositionend",c),e.removeEventListener("input",l),o&&clearTimeout(o)}},streamInto(e){e=e||{};const t=e.btn,n=e.el,r=t?t.textContent:"",s=()=>{t&&(t.disabled=!1,t.textContent=r)};function o(){if(t&&(t.disabled=!0,t.textContent=e.busyText||"生成中…"),n&&(n.innerHTML=e.placeholder||'<div class="skl-line"></div><div class="skl-line"></div><div class="skl-line skl-w60"></div>'),!window.AI||!window.AI.chatStream){s();const l=new Error("AI 模块未加载");return e.onError&&e.onError(l),Promise.reject(l)}let a=0;const c=Object.assign({},e.chatOpts||{});return e.model&&(c.model=e.model),window.AI.chatStream(e.sys||"",e.usr||"",function(l,u){if(e.onChunk){try{e.onChunk(l||"",u||"")}catch{}return}if(!n)return;const f=Date.now();if(f-a>(e.interval!=null?e.interval:300)){a=f;const d=e.tail!=null?e.tail:800,m=window.Tex&&window.Tex.repairPipeLatex?window.Tex.repairPipeLatex(l||""):l||"";n.innerHTML=x.esc(m.slice(-d)).replace(/\n/g,"<br>")+'<span class="ai-cursor"></span>'}},e.image||null,c).then(function(l){if(n&&!e.onChunk){const u=window.Tex&&window.Tex.repairPipeLatex?window.Tex.repairPipeLatex(l||""):l||"";n.innerHTML=x.esc(u).replace(/\n/g,"<br>")}return s(),e.onDone&&e.onDone(l||""),l||""}).catch(function(l){if(s(),e.onError)e.onError(l);else if(n){n.innerHTML='<div class="alert alert-danger" style="margin:6px 0">生成失败：'+x.esc(l&&l.message||l)+' <button class="btn btn-ghost btn-sm" style="margin-left:6px">'+x.esc(e.retryText||"重试")+"</button></div>";const u=n.querySelector("button");u&&(u.onclick=()=>{o().catch(()=>{})})}throw l})}const i=o();return i.catch(()=>{}),i},delegate(e,t,n,r){e&&e.addEventListener(n,function(s){const o=s.target&&s.target.closest?s.target.closest(t):null;o&&(o===e||e.contains(o))&&r.call(o,s,o)})},themeColor(e,t){try{const n=getComputedStyle(document.documentElement).getPropertyValue(e);return n&&n.trim()||t}catch{return t}},sim(e,t,n){var r=n||function(m){return String(m??"").replace(/[\s\u3000]+/g,"").replace(/[、，,。.：:；;·\-—_/\\|"'「」《》【】（）()\[\]]/g,"").toLowerCase()},s=r(e),o=r(t);if(!s||!o)return 0;var i={},a={},c=0,l=0,u,f;for(u=0;u<s.length-1;u++)i[s.substr(u,2)]=1,c++;for(u=0;u<o.length-1;u++)a[o.substr(u,2)]=1,l++;if(s.length===1&&(i[s]=1,c=1),o.length===1&&(a[o]=1,l=1),!c||!l)return 0;var d=0;for(f in i)a[f]&&d++;return(d/c+d/l)/2},secNavHtml(e){return'<div class="sec-nav">'+(e||[]).map(function(t){return'<button class="sec-nav-btn" data-sec="'+x.esc(t.id)+'">'+x.esc(t.label)+"</button>"}).join("")+"</div>"},bindSecNav(e){(e.querySelectorAll(".sec-nav-btn")||[]).forEach(function(t){t.onclick=function(){var n=e.querySelector('[data-sec-id="'+t.getAttribute("data-sec")+'"]');n&&n.scrollIntoView&&n.scrollIntoView({behavior:"smooth",block:"start"}),(e.querySelectorAll(".sec-nav-btn")||[]).forEach(function(r){r.classList.remove("sec-nav-on")}),t.classList.add("sec-nav-on")}})}},wn="kaoyan2026_data",bn="kaoyan2026_photos";function hr(e){let t=0,n=0,r=0,s="";return(e||[]).forEach(o=>{if(!o)return;t++,n+=(o.imageBase64||"").length;const i=o.updatedAt||o.analyzedAt||o.createdAt||"";i>s&&(s=i);try{r+=JSON.stringify(o,(a,c)=>a==="imageBase64"?void 0:c).length}catch{r+=1}}),t+"|"+n+"|"+r+"|"+s}let En="";function Da(){return[]}function mn(){return{meta:{createdAt:new Date().toISOString(),version:"2.0.0",lastBackupReminder:""},tasks:Da(),taskTomb:{},tomb:{quizBank:{},mistakePhotos:{},essays:{},vocab:{},mistakes:{},plazaPosts:{},keptPosts:{},mockExams:{},playbooks:{}},completions:{},taskArchive:{},mistakes:[],studyHours:{},focus:{sessions:[],todayCount:0,todayDate:""},weeklyStats:{},milestones:{octMath:!1,novProf:!1,decPol:!1},progress:{math:{percent:0,stage:"强化阶段",modules:{高数:0,线代:0,概率:0}},ctrl:{percent:0,stage:"强化阶段",modules:{经典控制:0,现代控制:0}},eng:{percent:0,stage:"真题阶段",modules:{阅读:0,作文:0}},pol:{percent:0,stage:"基础阶段",modules:{马原:0,思修:0,史纲:0,毛中特:0}}},progressHistory:[],heat:{},heatHistory:{},mistakeDrills:[],mental:[],reading:{results:[],cards:{},customVocab:[],analysis:{}},decision:{inputs:{mathSims:[],profScore:"",engAccuracy:"",polProgress:0,xiankongScore:5},result:null,updatedAt:""},inspector:{runs:[]},playbooks:[],quizBank:[],quizHistory:[],mistakePhotos:[],essays:[],vocab:[],vocabLog:[],vocabBooks:[],polRecite:[],polReciteLog:[],polFramework:[],polTemplates:[],polChoice:[],weaknessProfile:null,plugins:[],pluginData:{},pluginConfig:{},pluginLog:[],dailyQuiz:null,dailyQuizHistory:[],aiMemory:{profile:"",facts:[],reflectCount:0,lastConsolidate:"",updatedAt:""},dailyBrief:null,copilotChats:{},ai:{endpoint:"",key:"",model:"",preset:"",stream:!1,thinkingMode:void 0,memAuto:!0,briefAuto:!0,superviseMode:"coach",lastSupervise:null,superviseLog:[],apis:[],activeApi:"",autoSwitch:!0,cacheOn:!0,cacheTTL:360},deepReview:null,weekPlan:null,majorData:{},conceptAI:{nodes:{},extra:[],path:null,updatedAt:""},share:{myGistId:"",nick:"",friends:[],recvIds:{},receivedTexts:[],sentCount:0,autoCheck:!1,plaza:{posts:[],inbox:[],blocks:[],seen:{},likes:{}}},plazaKept:{posts:[]},cloudJobs:[],cloudJob:{secretCheckedTs:0},settings:{targetSchool:"undecided",examDate:"2026-12-26",weeklyTargetHours:50,onboarded:!1,examConfig:{mathType:"shuyi",engType:"yingyi",profName:"自控原理"},coachProfile:{mathWeak:"符号错误、分式漏分母、积分因子符号反",distractions:"硬件项目、B站、游戏",redlineNote:"“二战”是违禁词，禁止说“大不了二战”"},redline:{items:null,checklist:null,keywords:""},scheduler:{useAI:!0,mathAccThreshold:70,idleDays:3,signWeekThreshold:3,signForceCount:5,polCap:2},targetScores:{math:130,prof:135,eng:70,pol:65},aiTools:{enabled:!1}},alerts:{lastNovPush:""},mistakeClusters:[],topicExplain:{},topicQuiz:{},sprintData:{trends:null,mockExams:[],hitTracker:[],rushPlan:null,reasons:{}}}}let ne=null,Js=0;function St(e){if(!ne){ne=vt(e);return}Object.keys(ne).forEach(t=>{delete ne[t]}),Object.keys(e).forEach(t=>{ne[t]=e[t]})}function Ba(e){if(!e)return!1;if(e.name==="QuotaExceededError"||e.code===22||e.code===1014)return!0;const t=(e.message||"")+" "+(e.name||"");return/quota|exceeded|空间|storage/i.test(t)}function qa(){const e=ne;if(!e)return!1;const t=[];if((e.essays||[]).forEach(r=>{r&&r.imageBase64&&t.push({coll:"essays",id:r.id,t:r.createdAt||""})}),(e.mistakePhotos||[]).forEach(r=>{r&&r.imageBase64&&t.push({coll:"mistakePhotos",id:r.id,t:r.createdAt||""})}),!t.length)return!1;t.sort((r,s)=>(r.t||"").localeCompare(s.t||""));let n=0;for(let r=0;r<Math.min(3,t.length);r++){const s=t[r],i=(s.coll==="essays"?e.essays:e.mistakePhotos).find(a=>a.id===s.id);i&&(i.imageBase64="",n++)}return n>0}function Ra(){let e=!1;for(let t=0;t<3;t++)try{const n=ne&&ne.mistakePhotos||[],r=hr(n);r!==En&&(localStorage.setItem(bn,JSON.stringify(n)),En=r);const s=Object.assign({},ne);return delete s.mistakePhotos,localStorage.setItem(wn,JSON.stringify(s)),e}catch(n){if(Ba(n)&&qa()){e=!0;continue}throw n}throw new Error("存储空间不足（裁剪最旧图片后仍失败）")}const w={KEY:wn,KEY_PHOTOS:bn,get(){if(ne)return ne;try{let e=null;try{const r=localStorage.getItem(bn);if(r!=null){const s=JSON.parse(r);Array.isArray(s)&&(e=s)}}catch(r){console.error("[Store] 照片分区损坏，将在下次保存时重写",r)}const t=localStorage.getItem(wn);if(!t)return St(mn()),e&&e.length&&(ne.mistakePhotos=e),e&&(En=hr(ne.mistakePhotos)),w.save(),ne;const n=JSON.parse(t);return St(w.migrate(n)),e&&(ne.mistakePhotos=e,En=hr(e)),w.normalize(ne),ne}catch(e){return console.error("[Store] 数据损坏，已重置",e),St(mn()),w.save(),ne}},migrate(e){const t=mn();function n(s,o){if(o==null)return s;if(Array.isArray(s))return Array.isArray(o)?o:s;if(typeof s=="object"&&s!==null){const i={};return Object.keys(s).forEach(a=>{i[a]=n(s[a],o[a])}),Object.keys(o).forEach(a=>{a in i||(i[a]=o[a])}),i}return o}const r=n(t,e);return Array.isArray(r.vocabBooks)&&(r.vocabBooks=r.vocabBooks.filter(s=>!(s&&s.builtIn))),r},normalize(e){if(!e||!e.tasks)return e;if(e.taskTomb||(e.taskTomb={}),e.tasks.forEach(t=>{t&&!t.updatedAt&&(t.updatedAt=t.createdAt||new Date().toISOString())}),e.meta&&!e.meta.defaultTasksCleaned){const t=["高数强化第X章（按当前进度替换章节号）","线代：二次型标准化 + 正定判定","概率论：参数估计（矩估计/极大似然）","专业课第X节 + 课后题（按当前进度替换）","阅读真题2篇 + 定位法复盘","马原视频1节 + 肖1000对应章节"];e.tasks=e.tasks.filter(n=>!(n&&t.indexOf(n.text)>=0)),e.meta.defaultTasksCleaned=!0}return e},save(){Js++;try{Ra()&&window.Toast&&window.Toast.show("存储空间不足，已自动清理最旧的图片以保数据安全","warn",4e3)}catch(e){console.error("[Store] 保存失败",e),window.Toast&&window.Toast.show("存储失败：空间不足，请导出备份后清理","danger")}window.Cloud&&window.Cloud.schedulePush();try{La(ne&&ne.mistakePhotos||[])}catch{}},update(e){const t=w.get();return e(t),w.save(),x.emit("store:change"),t},replace(e){St(w.migrate(e)),w.save(),x.emit("store:change")},rev(){return Js},removeFromColl(e,t){w.update(n=>{n[e]&&(n[e]=n[e].filter(r=>r.id!==t),n.tomb||(n.tomb={}),n.tomb[e]||(n.tomb[e]={}),n.tomb[e][t]=Date.now())})},markTomb(e,t){t&&w.update(n=>{n.tomb||(n.tomb={}),n.tomb[e]||(n.tomb[e]={}),n.tomb[e][t]=Date.now()})},deepUnion(e,t){if(Array.isArray(e)&&Array.isArray(t)){const n={},r=[];return e.forEach(s=>{const o=s&&s.id!=null?s.id:JSON.stringify(s);n[o]=!0,r.push(s)}),t.forEach(s=>{const o=s&&s.id!=null?s.id:JSON.stringify(s);n[o]||(n[o]=!0,r.push(s))}),r}if(e&&typeof e=="object"&&!Array.isArray(e)&&t&&typeof t=="object"&&!Array.isArray(t)){const n={};return Object.keys(e).forEach(r=>{n[r]=e[r]}),Object.keys(t).forEach(r=>{r in n?n[r]=w.deepUnion(n[r],t[r]):n[r]=t[r]}),n}return e??t},mergeAiConfig(e,t){const n=e&&typeof e=="object"?e:null,r=t&&typeof t=="object"?t:null;if(!r)return n?Object.assign({},n):void 0;const s=Object.assign({},r),o=a=>!!(a&&String(a).trim());!o(s.key)&&n&&o(n.key)&&(s.key=n.key);const i=n&&Array.isArray(n.apis)?n.apis:[];return Array.isArray(s.apis)&&(s.apis=s.apis.map(function(a){if(!a||a.id==null)return a;const c=i.filter(function(l){return l&&l.id===a.id})[0];return c&&!o(a.key)&&o(c.key)?Object.assign({},a,{key:c.key}):a})),(!Array.isArray(s.apis)||!s.apis.length)&&i.length&&(s.apis=i.slice()),s},mergeSharePlaza(e,t,n){const r=e&&e.plaza||{},s=t&&t.plaza||{};if(!t||typeof t!="object")return e||{plaza:{}};const o=(v,S,_)=>{const T=[],A={};if((Array.isArray(v)?v:[]).forEach(M=>{M&&M.id!=null&&!A[M.id]&&(A[M.id]=!0,T.push(M))}),(Array.isArray(S)?S:[]).forEach(M=>{!M||M.id==null||A[M.id]||(A[M.id]=!0,T.push(M))}),_){const M={};return T.forEach(D=>{M[D.id]=D}),(Array.isArray(v)?v:[]).forEach(D=>{if(!D||D.id==null)return;const O=(Array.isArray(S)?S:[]).find(R=>R&&R.id===D.id);O&&(M[D.id]=_(D,O))}),Object.keys(M).map(D=>M[D])}return T},i=(v,S)=>Object.assign({},S||{},v||{});t.plaza=t.plaza||{};const a=(v,S)=>{const _=Object.assign({},S,v);return _.comments=w.deepUnion(v.comments||[],S.comments||[]),_.reactions=w.deepUnion(v.reactions||[],S.reactions||[]),_},c=n||{};t.plaza.posts=o(r.posts,s.posts,a).filter(v=>!c[v.id]),t.plaza.inbox=o(r.inbox,s.inbox,a),t.plaza.seen=i(r.seen,s.seen),t.plaza.likes=i(r.likes,s.likes),t.plaza.blocks=(Array.isArray(r.blocks)?r.blocks:[]).concat((Array.isArray(s.blocks)?s.blocks:[]).filter(v=>(r.blocks||[]).indexOf(v)<0));const l=e&&Array.isArray(e.friends)?e.friends:[],u=(Array.isArray(t.friends)?t.friends:[]).filter(v=>v&&v.id);if(l.length||u.length){const v={},S=[];l.forEach(_=>{_&&_.id!=null&&!v[_.id]&&(v[_.id]=!0,S.push(_))}),u.forEach(_=>{v[_.id]||(v[_.id]=!0,S.push(_))}),t.friends=S}const f=e&&typeof e.nick=="string"?e.nick:"";f&&(t.nick=f);const d=e&&typeof e.myGistId=="string"?e.myGistId:"",m=typeof t.myGistId=="string"?t.myGistId:"";d&&m&&d!==m?t.gistConflict={local:d,remote:m,at:new Date().toISOString()}:d&&m&&d===m&&delete t.gistConflict,d&&(t.myGistId=d),t.recvIds=i(e&&e.recvIds||{},t.recvIds||{}),t.receivedTexts=w.deepUnion(e&&Array.isArray(e.receivedTexts)?e.receivedTexts:[],Array.isArray(t.receivedTexts)?t.receivedTexts:[]);const p=r&&r.threads||{},y=s&&s.threads||{},h=Object.keys(p),g=Object.keys(y);if(h.length||g.length){const v={};h.forEach(S=>{v[S]=Array.isArray(p[S])?p[S].slice():[]}),g.forEach(S=>{const _={};(v[S]||[]).forEach(A=>{A&&A.id&&(_[A.id]=!0)}),(Array.isArray(y[S])?y[S]:[]).forEach(A=>{!A||!A.id||_[A.id]||(v[S]||(v[S]=[]),v[S].push(A),_[A.id]=!0)}),Array.isArray(v[S])&&v[S].length>500&&(v[S]=v[S].slice(-500))}),t.plaza.threads=v}return t},mergeMockExams(e,t){const n=[],r={};return(Array.isArray(e)?e:[]).forEach(s=>{!s||!s.id||(n.push(s),r[s.id]=!0,s.cloudJobId&&(r["cj:"+s.cloudJobId]=!0))}),(Array.isArray(t)?t:[]).forEach(s=>{!s||!s.id||r[s.id]||s.cloudJobId&&r["cj:"+s.cloudJobId]||(n.push(s),r[s.id]=!0,s.cloudJobId&&(r["cj:"+s.cloudJobId]=!0))}),n},mergeFrom(e,t){t=t||{};const n=w.migrate(e),r=w.get(),s=Object.assign({},r.taskTomb||{},n.taskTomb||{}),o=["quizBank","mistakePhotos","essays","vocab","mistakes","playbooks"],i={};o.forEach(p=>{i[p]=Object.assign({},r.tomb&&r.tomb[p]||{},n.tomb&&n.tomb[p]||{})}),["plazaPosts","keptPosts","mockExams"].forEach(p=>{i[p]=Object.assign({},r.tomb&&r.tomb[p]||{},n.tomb&&n.tomb[p]||{})});const c=(r.tasks||[]).filter(p=>!s[p.id]),l=(n.tasks||[]).filter(p=>!s[p.id]),u=c.slice(),f={};c.forEach(p=>{f[p.id]=!0}),l.forEach(p=>{if(f[p.id]){const y=r.tasks.find(v=>v.id===p.id),h=y&&y.updatedAt?new Date(y.updatedAt).getTime():0;if((p.updatedAt?new Date(p.updatedAt).getTime():0)>h){const v=u.findIndex(S=>S.id===p.id);v>=0&&(u[v]=p)}}else u.push(p),f[p.id]=!0}),u.sort((p,y)=>(p.order!=null?p.order:Number.MAX_SAFE_INTEGER)-(y.order!=null?y.order:Number.MAX_SAFE_INTEGER));let d;if(t.preserveLocal?(d=w.deepUnion(r,n),d.tasks=u,d.taskTomb=s,o.forEach(p=>{const y=(r[p]||[]).filter(S=>!i[p][S.id]),h=(n[p]||[]).filter(S=>!i[p][S.id]),g={},v=[];y.forEach(S=>{g[S.id]=!0,v.push(S)}),h.forEach(S=>{g[S.id]||(g[S.id]=!0,v.push(S))}),d[p]=v,d.tomb||(d.tomb={}),d.tomb[p]=i[p]})):(d=n,d.tasks=u,d.taskTomb=s,o.forEach(p=>{d[p]=(d[p]||[]).filter(y=>!i[p][y.id]),d.tomb||(d.tomb={}),d.tomb[p]=i[p]})),r.ai||d.ai){const p=w.mergeAiConfig(r.ai,n.ai);p!==void 0&&(d.ai=p)}if((r.sprintData||d.sprintData)&&(d.sprintData=d.sprintData||{},d.sprintData.mockExams=w.mergeMockExams(r.sprintData&&r.sprintData.mockExams,d.sprintData.mockExams),d.sprintData.mockExams=d.sprintData.mockExams.filter(p=>!i.mockExams[p.id]),d.tomb||(d.tomb={}),d.tomb.mockExams=i.mockExams,d.sprintData.hitTracker=w.deepUnion(r.sprintData&&r.sprintData.hitTracker||[],d.sprintData.hitTracker||[])),(r.share&&r.share.plaza||d.share&&d.share.plaza)&&(d.share=w.mergeSharePlaza(r.share,d.share||{},i.plazaPosts),d.tomb||(d.tomb={}),d.tomb.plazaPosts=i.plazaPosts),r.plazaKept||d.plazaKept){const p=r.plazaKept&&r.plazaKept.posts||[],y=d.plazaKept&&d.plazaKept.posts||[],h={},g=[];(Array.isArray(p)?p:[]).forEach(v=>{v&&v.id!=null&&!h[v.id]&&(h[v.id]=!0,g.push(v))}),(Array.isArray(y)?y:[]).forEach(v=>{v&&v.id!=null&&!h[v.id]&&(h[v.id]=!0,g.push(v))}),d.plazaKept={posts:g.filter(v=>!i.keptPosts[v.id])},d.tomb||(d.tomb={}),d.tomb.keptPosts=i.keptPosts}(r.settings&&r.settings.onboarded||r.completions&&Object.keys(r.completions).length>0||r.studyHours&&Object.keys(r.studyHours).length>0||r.mistakes&&r.mistakes.length>0||r.tasks&&r.tasks.length>6)&&d.settings&&(d.settings.onboarded=!0);{const p=r.cloudJob,y=d.cloudJob,h=p&&p.secretCheckedTs>0?p.secretCheckedTs:0,g=y&&y.secretCheckedTs>0?y.secretCheckedTs:0,v=Math.max(h,g);v>0&&(d.cloudJob=Object.assign({},y||{},p||{},{secretCheckedTs:v}))}St(d),w.save(),x.emit("store:change")},resetAll(){St(mn()),w.save(),x.emit("store:change")},exportJSON(){return JSON.stringify(w.get(),null,2)},usageBytes(){return((localStorage.getItem(wn)||"")+(localStorage.getItem(bn)||"")).length*2},usageEstimate(e){try{navigator.storage&&navigator.storage.estimate?navigator.storage.estimate().then(t=>e({used:t.usage||0,quota:t.quota||0,approx:!1})).catch(()=>e({used:w.usageBytes(),quota:0,approx:!0})):e({used:w.usageBytes(),quota:0,approx:!0})}catch{e({used:w.usageBytes(),quota:0,approx:!0})}},todayTaskStats(){const e=w.get(),t=e.completions[x.dkey()]||[],n={math:[0,0],ctrl:[0,0],eng:[0,0],pol:[0,0]};return e.tasks.forEach(r=>{n[r.subject]&&(n[r.subject][1]++,(r.done||t.indexOf(r.id)>=0)&&n[r.subject][0]++)}),n},todayAllDone(){const e=w.todayTaskStats();let t=0,n=0;return Object.keys(e).forEach(r=>{t+=e[r][1],n+=e[r][0]}),t>0&&n===t},weekHours(){const e=w.get();return x.weekKeys().map(t=>e.studyHours[t]||0)},todayHours(){return w.get().studyHours[x.dkey()]||0},addHours(e){w.update(t=>{const n=x.dkey();t.studyHours[n]=x.round1((t.studyHours[n]||0)+e)})},studyStreak(){const e=w.get();let t=0;for(let n=0;n<90;n++){const r=x.dkey(new Date(Date.now()-n*x.DAY_MS));if((e.studyHours[r]||0)>0||(e.completions[r]||[]).length>0)t++;else{if(n===0)continue;break}}return t},mistakeCountToday(e){const t=x.dkey();return w.get().mistakes.filter(n=>x.isoDay(n.createdAt)===t&&(!e||n.type===e)).length},mistakeCountWeek(e){return w.get().mistakes.filter(t=>x.inThisWeek(x.isoDay(t.createdAt))&&(!e||t.type===e)).length},weekTopMistakes(){const e=w.get().mistakes.filter(t=>x.inThisWeek(x.isoDay(t.createdAt)));return x.topN(x.countBy(e,t=>t.type),2)},currentMathAccuracy(){const e=w.get(),t=w.weekKey(),n=e.weeklyStats[t];return n&&typeof n.mathAccuracy=="number"?n.mathAccuracy:null},recomputeMathAccuracy(){const e=w.get(),t=w.weekKey(),n=i=>i?i[0]==="m"?"math":i[0]==="c"?"ctrl":i[0]==="e"?"eng":"pol":"",r=[];(e.quizHistory||[]).forEach(i=>{n(i.topicId)==="math"&&i.createdAt&&x.inThisWeek(x.isoDay(i.createdAt))&&typeof i.score=="number"&&r.push(i.score)});const s=i=>i&&i.subject==="math"&&i.selfEval&&x.inThisWeek(i.date)&&(i.selfEval==="known"||i.selfEval==="unknown");if([e.dailyQuiz].concat(e.dailyQuizHistory||[]).forEach(i=>{s(i)&&r.push(i.selfEval==="known"?100:0)}),!r.length)return;const o=Math.round(r.reduce((i,a)=>i+a,0)/r.length);w.update(i=>{if(i.weeklyStats[t]=i.weeklyStats[t]||{},i.weeklyStats[t].mathAccuracy==null){const a=Object.keys(i.weeklyStats).filter(l=>l<t&&i.weeklyStats[l]&&typeof i.weeklyStats[l].mathAccuracy=="number").sort(),c=a[a.length-1];c&&(i.weeklyStats[t].prevAccuracy=i.weeklyStats[c].mathAccuracy)}i.weeklyStats[t].mathAccuracy=o})},weekKey(e){e=e||new Date;const t=x.weekMonday(e),n=t.getFullYear(),r=new Date(n,0,1),s=Math.ceil(((t-r)/x.DAY_MS+r.getDay()+1)/7);return n+"-W"+String(s).padStart(2,"0")},profHardScore(){return w.get().decision.inputs.xiankongScore||0},profAdvancedPercent(){try{const e=window.DB.getActiveMajor().alertRule,t=e&&e.hardModule?e.hardModule:"现代控制",n=w.get().progress.ctrl.modules,r=Object.keys(n);for(let s=0;s<r.length;s++)if(r[s].indexOf(t)>=0||t.indexOf(r[s])>=0)return n[r[s]]||0;return r.length>0&&n[r[0]]||0}catch{return 0}},xiankongScore(){return w.profHardScore()},xiankongPercent(){return w.profAdvancedPercent()},addMistake(e){let t=null;return w.update(n=>{if(e.dedupKey){const s=n.mistakes.find(o=>o.dedupKey===e.dedupKey);if(s){e.stem&&!s.stem&&(s.stem=e.stem),e.answer!=null&&!s.answer&&(s.answer=e.answer),e.solution&&!s.solution&&(s.solution=e.solution),e.trap&&!s.trap&&(s.trap=e.trap),e.desc&&!s.desc&&(s.desc=e.desc),e.type&&!s.type&&(s.type=e.type),t=s.id;return}}const r={id:x.uid(),subject:e.subject||"math",type:e.type||"other",desc:e.desc||(e.stem?String(e.stem).slice(0,60):"错题"),date:x.shortDate(),createdAt:new Date().toISOString()};e.stem&&(r.stem=e.stem),e.answer!=null&&(r.answer=e.answer),e.solution&&(r.solution=e.solution),e.trap&&(r.trap=e.trap),e.refId&&(r.refId=e.refId),e.source&&(r.source=e.source),e.dedupKey&&(r.dedupKey=e.dedupKey),e.reviewPlan&&(r.reviewPlan=e.reviewPlan),n.mistakes.push(r),t=r.id}),t},subjectDoneInDays(e,t){const n=w.get(),r=x.lastNDays(t);for(const s of r)if(s===x.dkey()){const o=n.completions[s]||[];if(n.tasks.some(i=>i.subject===e&&(i.done||o.indexOf(i.id)>=0)))return!0}else if((n.taskArchive[s]||[]).some(i=>i.subject===e&&i.done))return!0;return!1}},z={show(e,t,n){const r=document.getElementById("toast-wrap");if(!r)return;const s=document.createElement("div");s.className="toast toast-"+(t||"info"),s.innerHTML="<span>"+e+'</span><button class="toast-x" aria-label="关闭">×</button>',r.appendChild(s),requestAnimationFrame(()=>s.classList.add("show"));const o=()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),200)};s.querySelector(".toast-x").onclick=o,setTimeout(o,n||3e3)},success(e){z.show(e,"success")},warn(e){z.show(e,"warn",4200)},danger(e){z.show(e,"danger",5e3)}},we={open(e){we.close();const t=document.createElement("div");t.className="modal-overlay",t.id="modal-overlay";const n=document.createElement("div");n.className="modal"+(e.wide?" modal-wide":"");let r="";(e.actions||[]).forEach((i,a)=>{r+='<button class="btn '+(i.kind||"btn-ghost")+'" data-act="'+a+'">'+x.esc(i.label)+"</button>"}),n.innerHTML='<div class="modal-head"><span class="modal-title">'+e.title+"</span>"+(e.dismissable===!1?"":'<button class="modal-x" aria-label="关闭">×</button>')+'</div><div class="modal-body">'+e.html+"</div>"+(r?'<div class="modal-foot">'+r+"</div>":""),t.appendChild(n),document.body.appendChild(t),document.body.style.overflow="hidden";const s=()=>{we.close(),e.onClose&&e.onClose()},o=n.querySelector(".modal-x");return o&&(o.onclick=s),e.dismissable!==!1&&t.addEventListener("click",i=>{i.target===t&&s()}),(e.actions||[]).forEach((i,a)=>{n.querySelector('[data-act="'+a+'"]').onclick=()=>{i.onClick?i.onClick(s):s()}}),requestAnimationFrame(()=>t.classList.add("show")),s},close(){const e=document.getElementById("modal-overlay");e&&(e.remove(),document.body.style.overflow="")},confirm(e,t,n,r,s){we.open({title:e,html:t,actions:[{label:"取消",kind:"btn-ghost"},{label:n||"确定",kind:s?"btn-danger":"btn-primary",onClick:o=>{o(),r&&r()}}]})}};let Et=null;function Ja(){return Et&&document.getElementById("ai-float")?Et:(Et=null,null)}function Hs(e){const t=document.getElementById("ai-float");t&&t.parentNode&&t.parentNode.removeChild(t);const n=document.createElement("div");n.id="ai-float",n.className="cm-ai-float",n.innerHTML='<div class="ai-float-ball-ico" title="单击展开 · 双击彻底关闭 · 可拖拽">💭</div><div class="cm-ai-float-h"><span>'+e+'</span><button class="cm-ai-float-x" aria-label="收起为小球">×</button></div><div class="cm-ai-float-b"><div class="muted-sm cm-ai-float-status" id="ai-float-status">⏳ 正在连接模型…</div><details class="cm-ai-float-think" id="ai-float-think" style="display:none"><summary class="cm-ai-float-label" style="cursor:pointer;user-select:none">💭 思考过程（点击展开/收起）</summary><pre class="report" id="ai-float-think-t"></pre></details><div class="cm-ai-float-tools" id="ai-float-tools" style="display:none"></div><div class="cm-ai-float-content" id="ai-float-content" style="display:none"><div class="cm-ai-float-label">📝 生成内容</div><pre class="report" id="ai-float-content-t"></pre></div></div>',document.body.appendChild(n);let r=!1,s=!1,o=0,i=0,a=0,c=0;n.addEventListener("mousedown",function(y){if(!n.classList.contains("ai-float-ball"))return;r=!0,s=!1,o=y.clientX,i=y.clientY;const h=n.getBoundingClientRect();a=h.left,c=h.top,y.preventDefault()}),document.addEventListener("mousemove",function(y){if(!r)return;const h=y.clientX-o,g=y.clientY-i;(Math.abs(h)>5||Math.abs(g)>5)&&(s=!0),n.style.left=a+h+"px",n.style.top=c+g+"px",n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",function(){r=!1}),n.addEventListener("click",function(){!n.classList.contains("ai-float-ball")||s||f()}),n.addEventListener("dblclick",function(){n.classList.contains("ai-float-ball")&&(n.remove(),r=!1)});let l=null;n.addEventListener("touchstart",function(y){if(!n.classList.contains("ai-float-ball"))return;const h=y.touches[0];l={x:h.clientX,y:h.clientY,ox:n.offsetLeft,oy:n.offsetTop,moved:!1}},{passive:!0}),n.addEventListener("touchmove",function(y){if(!l)return;const h=y.touches[0],g=h.clientX-l.x,v=h.clientY-l.y;(Math.abs(g)>5||Math.abs(v)>5)&&(l.moved=!0),n.style.left=l.ox+g+"px",n.style.top=l.oy+v+"px",n.style.right="auto",n.style.bottom="auto"},{passive:!0}),n.addEventListener("touchend",function(){l&&!l.moved&&n.classList.contains("ai-float-ball")&&f(),l=null},{passive:!0});function u(){n.classList.add("ai-float-ball"),n.style.left="auto",n.style.top="auto",n.style.right="16px",n.style.bottom="24px"}function f(){n.classList.remove("ai-float-ball"),n.style.left="auto",n.style.top="auto",n.style.right=(window.innerWidth<420?8:16)+"px",n.style.bottom="16px"}const d=n.querySelector(".cm-ai-float-x");d&&(d.onclick=function(y){y.stopPropagation(),u()});const m=function(){return document.getElementById("ai-float-status")},p={status(y){const h=m();h&&(h.textContent=y)},content(y){const h=document.getElementById("ai-float-content"),g=document.getElementById("ai-float-content-t");h&&g&&(h.style.display="",g.textContent=window.Tex&&window.Tex.repairPipeLatex?window.Tex.repairPipeLatex(y||""):y||"",g.scrollTop=g.scrollHeight)},think(y){const h=document.getElementById("ai-float-think"),g=document.getElementById("ai-float-think-t");h&&g&&(h.style.display="",g.textContent=y||"")},html(y){const h=document.getElementById("ai-float-content"),g=document.getElementById("ai-float-content-t");h&&g&&(h.style.display="",y==null?g.textContent="":g.innerHTML=y)},done(){const y=m();y&&(y.textContent="✓ 完成")},fail(y){const h=m();h&&(h.textContent="⚠ "+y)},close(){n.remove(),r=!1,l=null,Et===p&&(Et=null)},toolTask(y,h){h=h||{};const g=!!h.primary,v=n.querySelector("#ai-float-tools");v&&(v.style.display="");const S=document.createElement("div");S.className="at-ftask",S.setAttribute("data-testid","at-ftask"),S.innerHTML='<div class="at-ftask-h"><span class="at-ftask-t">🛠 '+x.esc(y)+'</span><span class="at-ftask-tag" data-k="tag" style="background:#8c8c8c">进行中</span><button class="at-ftask-x" data-k="x" title="取消任务">×</button></div><div class="at-ftask-st" data-k="st">⏳ 已发起，等待模型响应…</div><div class="at-ftask-b" data-k="body"></div>',v&&v.appendChild(S);const _=function(H){return S.querySelector('[data-k="'+H+'"]')},T=_("st"),A=_("tag"),M=_("body"),D=[];function O(H){T&&(T.textContent=H),g&&p.status(H)}let R=Date.now(),L=null;function J(){L&&(clearInterval(L),L=null)}L=setInterval(function(){const H=Math.round((Date.now()-R)/1e3),te=T?T.textContent:"";te&&te.indexOf("等待模型响应")>=0&&O("⏳ 已发起，等待模型响应…（"+H+"s）")},1e3);const G={cancelled:!1,onCancel(H){D.push(H)},setStatus(H,te){J(),O(H),te&&A&&(A.style.background=te)},roundStream(H,te){if(!M)return;let N=M.querySelector("[data-draft]");(!N||N.getAttribute("data-draft")!==String(H))&&(M.querySelectorAll("[data-draft]").forEach(function(ke){ke.remove()}),N=document.createElement("details"),N.setAttribute("data-draft",String(H)),N.open=!0,N.innerHTML="<summary>🛠 第 "+H+" 轮 · 正在构造 Python 代码…</summary><pre></pre>",M.appendChild(N));const Q=N.querySelector("pre");Q&&(Q.textContent=te)},step(H){if(!M)return;M.querySelectorAll("[data-draft]").forEach(function(N){N.remove()});const te=document.createElement("details");M.querySelectorAll("details").forEach(function(N){N.open=!1}),te.open=!0,te.innerHTML="<summary>🛠 第 "+H.round+" 轮 · Python 执行"+(H.error?"（出错，已回传修正）":" ✓")+"</summary><pre>"+x.esc(H.code||"")+"</pre><pre>→ 输出："+x.esc(H.output||"(无)")+(H.error?`
错误：`+x.esc(H.error):"")+"</pre>"+(H.image?'<img src="'+x.esc(H.image)+'" alt="工具产图">':""),M.appendChild(te)},think(H){p.think(String(H||""))},writing(H){G.setStatus("✍ 正在撰写最终回答…","#1a7f37"),g&&H!=null&&p.content(H)},finish(){J(),A&&(A.textContent="完成",A.style.background="#237804"),G.setStatus("✓ 完成"),g&&p.done()},fail(H){J(),A&&(A.textContent="失败",A.style.background="#cf1322"),G.setStatus("⚠ "+H),g&&p.fail(H)}},Z=_("x");return Z&&(Z.onclick=function(H){H&&H.stopPropagation&&H.stopPropagation(),G.cancelled=!0,G.setStatus("已取消（中断中…）","#8c8c8c"),D.slice().forEach(function(te){try{te()}catch{}})}),G}};return Et=p,p}const yo={aiFloat:Hs,openAiFloat:Hs},vo="https://api.github.com",en="kaoyan2026.json",Jr="core.json",Ue="manifest.json",wo="kaoyan2026-sync",Hr="kaoyan2026-sync-bulk",Gr="kaoyan2026_ghtoken",bo="kaoyan2026_cloud",Gs=1500,ko=3e5,Ha=[{ms:0,label:"实时",tip:"每次改动 1.5s 后推送（同步次数最多，密集操作易触发限流）"},{ms:6e4,label:"每 1 分钟",tip:"接近实时，适合双设备频繁切换"},{ms:12e4,label:"每 2 分钟",tip:"较均衡"},{ms:3e5,label:"每 5 分钟",tip:"默认推荐，大幅省同步次数"},{ms:6e5,label:"每 10 分钟",tip:"更省，跨设备看到更新稍慢"},{ms:18e5,label:"每 30 分钟",tip:"最省同步次数，适合单机为主"}],So=6e4,xo=15e3,Ga=[{ms:15e3,label:"每 15 秒",tip:"最快感知其他设备的更新（API 配额消耗最多）"},{ms:3e4,label:"每 30 秒",tip:"较快"},{ms:6e4,label:"每 1 分钟",tip:"默认推荐（ETag 命中时零流量，仅占 1 点配额）"},{ms:3e5,label:"每 5 分钟",tip:"均衡，适合不常切设备"},{ms:6e5,label:"每 10 分钟",tip:"更省配额"},{ms:18e5,label:"每 30 分钟",tip:"最省，跨设备更新感知最慢"}],za="https://github.com/settings/tokens/new?scopes=gist&description=kaoyan2026同步",re=["quizBank","mistakePhotos","essays","vocab","mistakes","dailyQuizHistory","mistakeDrills","playbooks"],zr={quizBank:"题库",mistakePhotos:"错题照片",essays:"作文",vocab:"单词本",mistakes:"文本错题",dailyQuizHistory:"每日一题历史",mistakeDrills:"错题重练",playbooks:"解题方法卡"},ve=["copilotChats","majorData","deepReview","conceptAI","sprintData","plugins","pluginData","pluginConfig","pluginLog","share","plazaKept"],On={copilotChats:"AI对话",majorData:"专业数据",deepReview:"深度复盘",conceptAI:"概念图谱AI",sprintData:"押题出卷",plugins:"插件源码",pluginData:"插件数据",pluginConfig:"插件配置",pluginLog:"插件日志",share:"星屿广场",plazaKept:"星藏包"},Ur=/^op-\d+-[A-Za-z0-9_-]+\.json$/,Ua=/^(quizBank|mistakePhotos|essays|vocab)\.ops\.json$/,tn=8,k={enabled:!1,token:null,gistId:null,bulkGistId:null,lastPushedAt:0,lastSyncAt:0,pollTimer:null,badge:null,lastPushAttemptAt:0,badgeBaseTitle:"",pushing:!1,rateLimitBackoffUntil:0,lastTransfer:null,syncPhase:"idle",syncLog:[],pendingBulk:[]};let ut=!1,et=null,P=$a();function $a(){let e;try{e=JSON.parse(localStorage.getItem(bo))}catch{e=null}e=e||{};try{localStorage.getItem("kaoyan2026_syncKeyMigrated")?e.syncAiKey===void 0&&(e.syncAiKey=!0):(e.syncAiKey=!0,localStorage.setItem("kaoyan2026_syncKeyMigrated","1"),e.pushedHashes&&(delete e.pushedHashes.core,delete e.pushedHashes.manifest))}catch{e.syncAiKey===void 0&&(e.syncAiKey=!0)}return e.pushedHashes=e.pushedHashes||{},e.deviceId||(e.deviceId="dev-"+Math.random().toString(36).slice(2,10)),e.opCursor=e.opCursor||{},e.appliedOps=Array.isArray(e.appliedOps)?e.appliedOps:[],e.compactGen=e.compactGen||0,e.opCount=e.opCount||0,e.bulkHashes=e.bulkHashes||{},(e.pushIntervalMs===void 0||e.pushIntervalMs===null)&&(e.pushIntervalMs=ko),(e.pullIntervalMs===void 0||e.pullIntervalMs===null)&&(e.pullIntervalMs=So),e}function Re(){P.gistId=k.gistId,P.bulkGistId=k.bulkGistId,P.lastPushedAt=k.lastPushedAt,P.lastSyncAt=k.lastSyncAt;try{localStorage.setItem(bo,JSON.stringify(P))}catch{}}function In(){var e=P.pushIntervalMs;return e===0?0:typeof e!="number"||!(e>0)?ko:e}function mr(){var e=P.pullIntervalMs;return typeof e!="number"||!(e>=xo)?So:e}function Fa(){try{return localStorage.getItem(Gr)||""}catch{return""}}function Ka(){try{localStorage.setItem(Gr,k.token)}catch{}}function Va(){try{localStorage.removeItem(Gr)}catch{}}const Qa=20;function Oe(e){k.syncPhase=e,e==="idle"?ae("☁ 已同步","on"):e==="downloading"?ae("⬇ 下载中…","busy"):e==="uploading"?ae("⬆ 上传中…","busy"):e==="uploading-bulk"?ae("⬆ 上传大数据…","busy"):e==="merging"&&ae("🔄 整合中…","busy")}function Mn(e,t,n,r){k.syncLog.unshift({ts:Date.now(),phase:e,durationMs:Math.round(t),detail:n||"",bytes:r||0}),k.syncLog.length>Qa&&k.syncLog.pop()}function Le(e){return(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Te(e){e=String(e??"");let t=2166136261,n=2538058380;for(let r=0;r<e.length;r++){const s=e.charCodeAt(r);t=Math.imul(t^s,16777619)>>>0,n=Math.imul(n^s,16777643)>>>0}return t=(t^e.length)>>>0,n=(n^Math.imul(e.length,31))>>>0,("00000000"+t.toString(16)).slice(-8)+("00000000"+n.toString(16)).slice(-8)}function $r(){return Date.now()<k.rateLimitBackoffUntil}function nn(e){const t=Math.min(3e4*Math.pow(2,e),3e5);k.rateLimitBackoffUntil=Date.now()+t,console.warn("[Cloud] 触发 API 限额退避，"+Math.round(t/1e3)+"秒内跳过请求")}const Ya={429:1,500:1,502:1,503:1,504:1},Wa={GET:1,HEAD:1,PATCH:1,PUT:1,DELETE:1},gn=[800,2e3,4500];function Xa(e){return new Promise(t=>setTimeout(t,e))}function Za(e){try{const t=e.headers&&e.headers.get?e.headers.get("X-RateLimit-Remaining"):null;return t!=null&&String(t)==="0"}catch{return!1}}function ec(e,t){return e===401?"auth":e===403?"ratelimit":e===404?"notfound":e===429?"ratelimit":e>=500?"server":"other"}function tc(e,t,n){return e==="auth"?"登录已失效或权限不足（"+t+"）：请到「设置 → 云同步」重新登录 GitHub":e==="ratelimit"?n?"已达 GitHub API 限额，稍后自动重试（可稍等片刻再手动同步）":"无权限访问该资源（"+t+"）：请检查令牌的 gist 权限":e==="notfound"?"资源不存在（"+t+"）：Gist 可能已在别处被删除":e==="network"?"网络连接失败：请检查网络后重试":e==="server"?"GitHub 服务暂时不可用（"+t+"），已自动重试":"HTTP "+t}function yn(e,t,n,r){const s=new Error(e);return s.status=t||0,s.kind=n||"other",r&&(s.retries=r),s}function nc(e,t,n){const r=n||3e4;if(typeof AbortController>"u")return fetch(e,t);const s=new AbortController,o=setTimeout(()=>{try{s.abort()}catch{}},r);return fetch(e,Object.assign({},t,{signal:s.signal})).then(i=>(clearTimeout(o),i)).catch(i=>{clearTimeout(o);const a=i&&i.name==="AbortError",c=new Error(a?"请求超时（>"+Math.round(r/1e3)+"s）":i&&i.message||"网络错误");throw c.isNetwork=!0,c.isTimeout=!!a,c})}function rc(e){if(e&&e.timeoutMs!=null)return e.timeoutMs;const t=e&&e.body;if(!t)return 3e4;const r=(typeof t=="string"?t:JSON.stringify(t)).length;return r>=3*1024*1024?3e5:r>=1024*1024?24e4:r>=500*1024?12e4:r>=100*1024?6e4:3e4}async function xe(e,t){if($r())throw yn("HTTP 403（退避中，"+Math.ceil((k.rateLimitBackoffUntil-Date.now())/1e3)+"s 后恢复）",403,"ratelimit");t=t||{};const n=String(t.method||"GET").toUpperCase(),r=!!Wa[n],s=t.retries===0||!r?1:t.retries||gn.length+1,o=rc(t);let i=null;for(let a=0;a<s;a++){a>0&&await Xa(gn[a-1]||gn[gn.length-1]);let c=null;try{c=await nc(vo+e,{method:n,headers:(function(){const u={Authorization:"Bearer "+k.token,Accept:"application/vnd.github+json","Content-Type":"application/json"};return t.etag&&(u["If-None-Match"]=t.etag),u})(),body:t.body?JSON.stringify(t.body):void 0},o)}catch(u){if(u.status=0,u.kind="network",i=u,!r||a>=s-1)break;continue}const l=c.headers&&c.headers.get?c.headers.get("ETag"):null;if(c.status===304)return{status:304,etag:t.etag||l,data:null};if(!c.ok){const u=Za(c),f=ec(c.status),d=tc(f,c.status,u);u&&nn(0);const m=!!Ya[c.status]&&r;if(i=yn(d,c.status,f,a),!m||a>=s-1)break;continue}try{const u=await c.text();return{status:c.status,etag:l,data:u?JSON.parse(u):null}}catch(u){i=yn("响应解析失败："+(u&&u.message||u),c.status,"parse",a);break}}throw i&&i.retries&&(i.message+="（已重试 "+i.retries+" 次）"),i||yn("请求失败",0,"other")}async function He(e){if(!e)return null;if(e.truncated&&e.raw_url){const t=await fetch(e.raw_url);if(!t.ok)throw new Error("raw 拉取失败 HTTP "+t.status);return await t.text()}return e.content}async function _o(e,t){return(await xe("/gists",{method:"POST",body:{description:e,public:!1,files:t}})).data.id}async function dt(e,t){return(await xe("/gists/"+e,{method:"PATCH",body:{files:t}})).etag}function gr(e,t){const n={};return(t||re).forEach(r=>{n[r+".json"]={content:e[r]}}),n}async function sc(e){return await _o(Hr,gr(e))}async function zn(){let e=1,t=null,n="",r=null,s=-1;for(;e<=10;){let o;try{o=(await xe("/gists?per_page=100&page="+e)).data}catch(i){throw i&&(i.status===403||i.status===429||i.status>=500)&&(i.transient=!0),i}if(!o||!o.length)break;for(const i of o){const a=i.files||{};if(a[Ue]){const c=i.updated_at||"";(!t||c>n)&&(t=i.id,n=c)}else if(a[en]){const c=a[en].size||0;c>s&&(s=c,r=i.id)}}e++}return t||r||null}async function oc(){let e=1,t=null,n="";for(;e<=10;){let r;try{r=(await xe("/gists?per_page=100&page="+e)).data}catch(s){throw s&&(s.status===403||s.status===429||s.status>=500)&&(s.transient=!0),s}if(!r||!r.length)break;for(const s of r)if(s.description===Hr){const o=s.updated_at||"";(!t||o>n)&&(t=s.id,n=o)}e++}return t}function ic(e){typeof e.key=="string"&&(e.key=""),Array.isArray(e.apis)&&e.apis.forEach(t=>{t&&typeof t.key=="string"&&(t.key="")})}function Cn(e){const t=Object.assign({},e);return re.forEach(n=>{delete t[n]}),ve.forEach(n=>{delete t[n]}),t}function zs(){try{return window.Store&&window.Store.rev?window.Store.rev():0}catch{return 0}}const tr=new WeakMap;function yr(e){if(e&&tr.has(e)){const n=tr.get(e);if(n&&n.rev===zs())return n.hash}const t=Te(JSON.stringify(e||[]));try{e&&tr.set(e,{hash:t,rev:zs()})}catch{}return t}function vr(e){return!e||!e.length?[]:e.map(function(t){return Object.assign({},t)})}function Ao(e){return e.cloudJob&&e.cloudJob.wftoken&&(e.cloudJob=Object.assign({},e.cloudJob),delete e.cloudJob.wftoken),P.syncAiKey!==!0&&e.ai&&(e.ai=JSON.parse(JSON.stringify(e.ai)),ic(e.ai)),e}function To(){const e=window.Store.get(),t={};for(const n in e)re.indexOf(n)<0&&ve.indexOf(n)<0&&(t[n]=e[n]);return JSON.stringify(Ao(t))}function Pn(e){if(e==null||typeof e!="object")try{return JSON.stringify(e)}catch{return String(e)}if(Array.isArray(e))return"["+e.map(Pn).join(",")+"]";const t={};for(const n in e)n.length>6&&n.slice(-6)==="Base64"||(t[n]=Pn(e[n]));return JSON.stringify(t)}function Fr(e,t,n){const r=[],s={},o={};return(e||[]).forEach(i=>{i&&i.id!=null&&(s[i.id]=i)}),(t||[]).forEach(i=>{i&&i.id!=null&&(o[i.id]=i)}),Object.keys(o).forEach(i=>{const a=o[i];i in s?Pn(s[i])!==Pn(a)&&r.push({op:"upd",id:i,item:a}):r.push({op:"add",id:i,item:a})}),Object.keys(s).forEach(i=>{!(i in o)&&n&&n[i]&&r.push({op:"del",id:i})}),r}function Eo(e,t,n){const r={};return(e||[]).forEach(s=>{s&&s.id!=null&&(r[s.id]=s)}),(t||[]).forEach(s=>{if(!(!s||s.id==null))if(s.op==="del")delete r[s.id];else{if(n&&n[s.id])return;r[s.id]=s.item}}),Object.keys(r).map(s=>r[s])}async function ac(e){if(!k.bulkGistId)return null;try{const t=await xe("/gists/"+k.bulkGistId,{etag:null});if(t.data&&t.data.files){const n=t.data.files[e+".json"];if(n){const r=await He(n);if(r!=null)return JSON.parse(r)}}}catch{}return null}function Oo(e,t){return"op-"+(e||Date.now())+"-"+(t||"dev")+"-"+Math.random().toString(36).slice(2,7)+".json"}async function cc(e,t,n,r,s){const o={};let i=!1;for(const a of e){let c=n&&n[a]||[];if(!c.length)try{c=await ac(a)}catch{c=[]}const l=Fr(c,t[a]||[],r&&r[a]||{});l.length&&(o[a]=l,i=!0)}return i?{gen:s||0,ts:Date.now(),dev:P.deviceId,ops:o}:null}function Io(e,t,n){e=e||{};const r={};return re.forEach(s=>{r[s]=(e[s]||[]).slice()}),(t||[]).forEach(s=>{const o=s&&s.ops;o&&re.forEach(i=>{o[i]&&o[i].length&&(r[i]=Eo(r[i],o[i],n&&n[i]||{}))})}),r}function lc(){const e=JSON.parse(window.Store.exportJSON());return Ao(e)}function Us(e,t){ut=!0;try{window.Store.mergeFrom(e,t||{})}finally{ut=!1}window.App&&App.refresh(),window.Onboarding&&Onboarding.dismissIfNeeded&&Onboarding.dismissIfNeeded()}async function De(e,t){if(!k.gistId){k.lastSyncAt=Date.now(),Re();return}const n=performance.now();Oe("downloading");const r={pulled:[],pushed:[],bytes:0};let s;try{s=await xe("/gists/"+k.gistId,{etag:e?null:P.coreEtag})}catch(N){throw N&&N.status===404&&(N.deadGist=!0),N}if(s.status===304){Oe("idle"),Mn("拉取",performance.now()-n,"304 无变化",0),k.lastSyncAt=Date.now(),Re(),k.lastTransfer=r;return}P.coreEtag=s.etag;const o=s.data;if(!o||!o.files){k.lastSyncAt=Date.now(),Re();return}const i=o.files,a=o.updated_at?new Date(o.updated_at).getTime():Date.now();if(!i[Ue]&&i[en]){const N=await He(i[en]);if(N){r.bytes+=ue(N),r.pulled.push("整包(旧格式)");try{const Q=Te(JSON.stringify(lc()));Te(N)!==Q&&Us(JSON.parse(N),t)}catch(Q){console.error("[Cloud] 旧格式解析/合并失败",Q)}}P.legacyRemote=!0,k.lastPushedAt=a,k.lastSyncAt=Date.now(),Re(),k.lastTransfer=r;return}const c=await He(i[Jr]),l=await He(i[Ue]);if(!c||!l){k.lastSyncAt=Date.now(),Re();return}r.bytes+=ue(c)+ue(l),r.pulled.push("核心");let u,f;try{u=JSON.parse(c),f=JSON.parse(l)}catch(N){console.error("[Cloud] 核心数据解析失败",N);return}P.legacyRemote=!1,f.bulkGistId&&(k.bulkGistId=f.bulkGistId);const d=f.compactGen||0,m=Object.keys(i).filter(N=>Ua.test(N)),p=Object.keys(i).filter(N=>Ur.test(N)),y=m.length&&!p.length;if(y){const N={};m.forEach(Q=>N[Q]=null);try{await dt(k.gistId,N)}catch{}P.compactGen||(P.compactGen=1)}const h=Object.assign({},window.Store.get()),g=h.tomb||{},v=(y||d>(P.compactGen||0))&&!!k.bulkGistId,S={},_={};if(v){const N=await xe("/gists/"+k.bulkGistId,{etag:e?null:P.bulkEtag});if(N.status!==304&&N.data&&N.data.files){P.bulkEtag=N.etag;for(const Q of re){const ke=N.data.files[Q+".json"];if(ke){const me=await He(ke);me!=null&&(r.bytes+=ue(me),r.pulled.push(zr[Q]+"(快照)"),S[Q]=JSON.parse(me))}}for(const Q of ve){const ke=N.data.files[Q+".json"];if(ke){const me=await He(ke);me!=null&&(r.bytes+=ue(me),r.pulled.push((On[Q]||Q)+"(快照)"),_[Q]=JSON.parse(me))}}}P.compactGen=d||(y?1:P.compactGen||0),P.appliedOps=[],P.opCount=0}const T={};(P.appliedOps||[]).forEach(N=>T[N]=1);const A=[];for(const N of p)if(!T[N])try{const Q=await He(i[N]);if(!Q)continue;const ke=JSON.parse(Q);if(!ke||!ke.ops)continue;ke.__name=N,A.push(ke),r.bytes+=ue(Q)}catch{}A.sort((N,Q)=>(N.ts||0)-(Q.ts||0)),A.length&&r.pulled.push("op×"+A.length);const M=v?S:h,D=Io(M,A,g),O=Object.assign({},u);if(re.forEach(N=>{O[N]=N in D?D[N]:M[N]||[]}),ve.forEach(N=>{N in _&&(O[N]=_[N])}),!v&&k.bulkGistId){const N=f.heavy||{},Q=window.Store.get(),ke=ve.filter(me=>{const rt=N[me];return rt&&rt.hash!==Te(JSON.stringify(Q[me]||null))});if(ke.length)try{const me=await xe("/gists/"+k.bulkGistId,{etag:null});if(me.data&&me.data.files)for(const rt of ke){const Ds=me.data.files[rt+".json"];if(Ds){const Xn=await He(Ds);Xn!=null&&(r.bytes+=ue(Xn),r.pulled.push(On[rt]||rt),O[rt]=JSON.parse(Xn))}}}catch(me){console.warn("[Cloud] 重量级字段拉取失败",me)}}const R=Te(JSON.stringify(Cn(O)))===Te(JSON.stringify(Cn(Object.assign({},h)))),L=ve.some(N=>{if(N in _)return!0;const Q=f.heavy&&f.heavy[N];return!Q||!Q.hash?!1:Q.hash!==Te(JSON.stringify(h[N]||null))}),J=!(R&&A.length===0&&!v&&!L),G=performance.now();if(Oe("merging"),J)try{Us(O,t)}catch(N){console.error("[Cloud] 合并失败",N)}A.length&&(P.appliedOps=P.appliedOps||[],A.forEach(N=>{N.__name&&P.appliedOps.indexOf(N.__name)<0&&P.appliedOps.push(N.__name)}));const Z=window.Store.get();k._remoteColls={},re.forEach(N=>{k._remoteColls[N]=vr(Z[N])});const H=performance.now()-G,te=performance.now()-n;Oe("idle"),Mn("拉取",te,(r.pulled.length?r.pulled.join(","):"无变化")+" · 整合"+Math.round(H)+"ms",r.bytes),k.lastPushedAt=a,k.lastSyncAt=Date.now(),Re(),k.lastTransfer=r}let nt=0;function Kr(){if(!(!k.enabled||!k.token||ut)){var e=In(),t=e>0?e:Gs,n=Date.now(),r=Math.max(k.lastPushedAt||0,k.lastPushAttemptAt||0),s=r+t;if(s<=n)s=n+Gs;else if(et&&nt&&nt<=s){wr();return}et&&clearTimeout(et),nt=s,et=setTimeout(uc,Math.max(0,s-n)),wr()}}function uc(){if(et=null,nt=0,k.pushing){Kr();return}k.lastPushAttemptAt=Date.now(),Ie().catch(e=>{console.error("[Cloud] 推送失败",e),ae("☁ 同步失败","err")})}function Mo(){if(!nt||k.syncPhase!=="idle")return"";var e=Math.max(0,nt-Date.now()),t=e>=6e4?Math.round(e/6e4)+" 分钟":Math.max(1,Math.round(e/1e3))+" 秒";return`
⏱ 有改动待推送：约 `+t+"后自动同步（可在同步面板改为实时）"}function wr(){k.badge&&(k.badge.title=(k.badgeBaseTitle||k.badge.title||"")+Mo())}async function Ie(e){e=e||{};const t=e.bulk===!0;if(!k.enabled||!k.token||k.pushing)return;k.pushing=!0,Oe(t?"uploading-bulk":"uploading");const n=performance.now(),r={pulled:[],pushed:[],bytes:0};try{if(k.gistId&&P.coreEtag==null)try{ut=!0;try{await De(!1,{preserveLocal:!0})}finally{ut=!1}}catch(O){console.warn("[Cloud] 推前校准失败，已跳过（稍后重试）",O)}const s=window.Store.get(),o=To(),i=Te(o),a={};re.forEach(O=>{a[O]=yr(s[O])});const c=P.pushedHashes||{},l=!!P.legacyRemote;let u=!1,f={};if(t||!k.bulkGistId||l||(P.opCount||0)>=tn){try{ut=!0;try{await De(!0,{preserveLocal:!0})}finally{ut=!1}}catch(G){console.warn("[Cloud] 压实前合并失败，已跳过（可能丢远端新增）",G)}const O=window.Store.get();let R=!1;if(!k.bulkGistId)try{k.bulkGistId=await oc()}catch(G){G&&G.transient&&(R=!0)}const L={};re.forEach(G=>{L[G]=JSON.stringify(O[G]||[])}),ve.forEach(G=>{L[G]=JSON.stringify(O[G]||null)});let J=null;if(k.bulkGistId){const G=re.concat(ve).filter(Z=>{const H=L[Z]!=null?L[Z]:"null";return Te(H)!==(P.bulkHashes[Z]||"")});if(G.length){const Z={};G.forEach(H=>{Z[H]=L[H]}),J=await dt(k.bulkGistId,gr(Z,G)),r.pushed.push("整包快照("+G.length+"/"+(re.length+ve.length)+" 变化集合)"),r.bytes+=ue(JSON.stringify(Z))}else r.pushed.push("整包快照(无变化,跳过)")}else R?console.warn("[Cloud] 大数据 Gist 发现遇瞬时错误，本次跳过整包上传（避免重复建）"):(k.bulkGistId=await sc(L),r.pushed.push("整包快照"),r.bytes+=ue(JSON.stringify(L)));J&&(P.bulkEtag=J),f={},(P.appliedOps||[]).forEach(G=>{Ur.test(G)&&(f[G]=null)}),l&&re.forEach(G=>f[G+".ops.json"]=null),P.compactGen=(P.compactGen||0)+1,P.appliedOps=[],P.opCount=0,P.bulkHashes=P.bulkHashes||{},re.concat(ve).forEach(G=>{P.bulkHashes[G]=Te(L[G]!=null?L[G]:"null")}),u=!0,k._remoteColls={},re.forEach(G=>{k._remoteColls[G]=vr(O[G])})}let d={};const m=re.filter(O=>!u&&(l||a[O]!==c[O]));if(m.length&&!u){const O=await cc(m,s,k._remoteColls,s.tomb||{},P.compactGen||0);if(O){const R=Oo(Date.now(),P.deviceId);d[R]={content:JSON.stringify(O)},r.bytes+=ue(JSON.stringify(O)),r.pushed.push("op:"+m.map(L=>zr[L]).join("/")),P.appliedOps=P.appliedOps||[],P.appliedOps.indexOf(R)<0&&P.appliedOps.push(R),P.opCount=(P.opCount||0)+1,k._remoteColls||(k._remoteColls={}),m.forEach(L=>{k._remoteColls[L]=vr(s[L])})}}let p=[],y={};if(!u&&k.bulkGistId&&(p=ve.filter(O=>Te(JSON.stringify(s[O]||null))!==(c[O]||"")),p.length)){p.forEach(O=>{y[O]=JSON.stringify(s[O]||null)});try{const O=await dt(k.bulkGistId,gr(y,p));O&&(P.bulkEtag=O)}catch(O){console.warn("[Cloud] 重量级字段上传失败",O)}p.forEach(O=>{r.pushed.push(On[O]||O),r.bytes+=ue(y[O]||"")})}const h={};ve.forEach(O=>{h[O]=Te(JSON.stringify(s[O]||null))});const g={ver:3,bulkGistId:k.bulkGistId,compactGen:P.compactGen||0,colls:{},heavy:{}};re.forEach(O=>{g.colls[O]={hash:yr(s[O]),n:(s[O]||[]).length}}),ve.forEach(O=>{g.heavy[O]={hash:h[O]}});const v=JSON.stringify(g),S=Te(v),_=l||i!==c.core||S!==c.manifest||u,T=Object.assign({[Jr]:{content:o},[Ue]:{content:v}},d);l&&(T[en]=null),u&&Object.assign(T,f||{});const A=!k.gistId||_||Object.keys(d).length||u&&f&&Object.keys(f).length;if(!k.gistId)k.gistId=await _o(wo,T),r.pushed.unshift("核心"),r.bytes+=ue(o)+ue(v);else if(A){try{const O=await dt(k.gistId,T);O&&(P.coreEtag=O)}catch(O){if(O&&(O.status===404||O.status===401)){k.gistId=null;let R=null;try{R=await zn()}catch(L){console.warn("[Cloud] 重发现 Gist 失败（不新建）",L)}if(R){k.gistId=R;try{const L=await dt(k.gistId,T);L&&(P.coreEtag=L),r.pushed.unshift("核心"),r.bytes+=ue(o)+ue(v)}catch(L){console.warn("[Cloud] 重指向后补丁失败",L)}}else console.warn("[Cloud] Gist 404 但未能重新发现，跳过本次核心写入（避免重复建）")}else throw O&&O.status===403&&nn(0),O}r.pushed.unshift("核心"),r.bytes+=ue(o)+ue(v)}P.pushedHashes=Object.assign({core:i,manifest:S},a,h),P.legacyRemote=!1;const M=Object.keys(d).length>0;k.gistId&&!$r()&&M&&De(!1,{preserveLocal:!0}).catch(O=>{console.warn("[Cloud] 后台合并跳过",O)}),k.lastPushedAt=Date.now(),k.lastSyncAt=Date.now(),k.lastTransfer=r,k.pendingBulk=[];try{const O=window.PlazaAutoPull;O&&typeof O.onCloudSync=="function"&&O.onCloudSync()}catch{}const D=performance.now()-n;Mn("推送",D,r.pushed.length?r.pushed.join(","):"无变化",r.bytes),Re(),Oe("idle")}catch(s){console.error("[Cloud] 推送失败",s);const o=s&&s.message?s.message:""+s;Oe("idle"),ae("☁ 同步失败","err"),k.badge&&(k.badge.title="同步失败："+o),Mn("推送",performance.now()-n,"失败: "+o,0),window.Toast&&z.danger("☁ 同步失败："+o)}finally{k.pushing=!1}}async function Co(){k.gistId=null,P.gistId=null,P.coreEtag=null,P.bulkEtag=null,k.lastPushedAt=0;try{const e=await zn();if(e)return k.gistId=e,P.gistId=e,k.bulkGistId=P.bulkGistId||null,!0}catch(e){if(e&&e.transient)throw e;console.warn("[Cloud] 重发现 Gist 失败",e)}return!1}async function Po(){ae("☁ 同步中…","busy");try{if(!k.gistId&&P.gistId&&(k.gistId=P.gistId,k.bulkGistId=P.bulkGistId||null),!k.gistId){try{k.gistId=await zn()}catch(t){if(t&&t.transient){console.warn("[Cloud] 发现 Gist 遭遇瞬时错误，将在轮询中自愈重试",t.message),Oe("idle"),kn();return}console.warn("[Cloud] 发现 Gist 失败",t)}k.lastPushedAt=0,P.coreEtag=null,P.bulkEtag=null}k.bulkGistId=P.bulkGistId||k.bulkGistId||null;try{await De()}catch(t){if(t&&t.deadGist)await Co()?await De():await Ie();else throw t}if(!k.gistId)await Ie();else{var e=In();e>0&&k.lastPushedAt>0&&Date.now()-k.lastPushedAt>=e&&(console.log("[Cloud] 开机追赶：距上次推送超一个周期，立即补推"),k.lastPushAttemptAt=Date.now(),await Ie()),Kr()}Oe("idle"),kn()}catch(t){console.error("[Cloud] 同步失败",t);const n=t&&t.message?t.message:""+t;Oe("idle"),ae("☁ 同步失败","err"),k.badge&&(k.badge.title="同步失败："+n),window.Toast&&z.danger("☁ 同步失败："+n),kn()}}function kn(){jo(),k.pollTimer=setInterval(async()=>{if(!$r()){if(!k.gistId&&!P.gistId){try{k.gistId=await zn()}catch(e){if(e&&e.transient)return}if(!k.gistId){await Ie();return}}try{await De(!1,{preserveLocal:!0}),ae("☁ 已同步","on")}catch(e){if(e&&e.status===403)nn(0);else if(e&&e.deadGist)try{await Co()&&(await De(!1,{preserveLocal:!0}),ae("☁ 已同步","on"))}catch{}}}},mr())}function jo(){k.pollTimer&&(clearInterval(k.pollTimer),k.pollTimer=null)}async function dc(){const e=Fa();if(!e){ae("☁ 未同步","off");return}k.token=e,k.enabled=!0,k.gistId=null,k.lastPushedAt=P.lastPushedAt||0,await Po()}async function fc(e,t){k.token=e.trim();try{await xe("/rate_limit"),k.enabled=!0,Ka(),k.gistId=null,k.lastPushedAt=P.lastPushedAt||0,Ot(),await Po()}catch(n){k.token=null,k.enabled=!1,at(t,n.status===401?"令牌无效或无 gist 权限，请检查":n.message||"验证失败")}}async function No(){jo(),Va(),k.token=null,k.enabled=!1,k.gistId=null,k.bulkGistId=null,k.rateLimitBackoffUntil=0,k.lastTransfer=null,P={syncAiKey:P.syncAiKey,pushedHashes:{},bulkHashes:{},appliedOps:[],compactGen:0,opCount:0},Re(),ae("☁ 未同步","off")}function Lo(){if(document.getElementById("cloud-style"))return;const e=document.createElement("style");e.id="cloud-style",e.textContent=`
#cloud-badge{display:inline-flex;align-items:center;font:11px/1.4 system-ui;padding:2px 6px;border-radius:8px;cursor:pointer;user-select:none;white-space:nowrap;vertical-align:middle;margin-left:6px}
#cloud-badge.on{background:#e6f7ec;color:#1a7f37}
#cloud-badge.off{background:#f0f0f0;color:#666}
#cloud-badge.busy{background:#e8f0fe;color:#1a56c4}
#cloud-badge.err{background:#fdeaea;color:#c0392b}
#cloud-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px}
#cloud-card{background:#fff;color:#222;border-radius:14px;width:100%;max-width:360px;padding:18px;box-shadow:0 10px 40px rgba(0,0,0,.3)}
#cloud-card h3{margin:0 0 12px;font-size:17px}
#cloud-card input{width:100%;box-sizing:border-box;padding:10px;margin:6px 0;border:1px solid #ddd;border-radius:8px;font-size:14px}
#cloud-card .row{display:flex;gap:8px;margin-top:12px}
#cloud-card button{flex:1;padding:10px;border:0;border-radius:8px;font-size:14px;cursor:pointer}
#cloud-card .primary{background:#2f54eb;color:#fff}
#cloud-card .ghost{background:#eee;color:#333}
#cloud-card .err{color:#c0392b;font-size:13px;min-height:18px;margin-top:6px}
#cloud-card .hint{color:#888;font-size:12px;margin-top:10px;line-height:1.6}
#cloud-card a{color:#2f54eb}`,document.head.appendChild(e)}var Xe=null;function $s(e){var t=e.querySelector?e.querySelector("#sb-theme"):null;t&&typeof e.insertBefore=="function"?k.badge.previousSibling!==t&&e.insertBefore(k.badge,t.nextSibling):k.badge.parentNode!==e&&e.appendChild(k.badge)}function Do(){if(k.badge){var e=document.getElementById("statusbar");if(e){$s(e),Xe&&(Xe.disconnect(),Xe=null);return}k.badge.parentNode!==document.body&&document.body.appendChild(k.badge),!Xe&&(Xe=new MutationObserver(function(){var t=document.getElementById("statusbar");t&&($s(t),Xe.disconnect(),Xe=null)}),Xe.observe(document.body,{childList:!0,subtree:!0}))}}function ae(e,t){Lo(),k.badge||(k.badge=document.createElement("div"),k.badge.id="cloud-badge",k.badge.onclick=qo),Do();let n=e;t==="on"&&k.gistId?n="☁ #"+k.gistId.slice(0,6):t==="on"?n="☁ 已同步":t==="off"?n="☁ 未同步":t==="err"?n="☁ 同步失败":n=e,k.badge.className=t,k.badge.textContent=n;let r=k.gistId?"核心 Gist: "+k.gistId+"（两台设备核心 ID 相同即同一份数据）":"未连接云端";k.lastTransfer&&(r+=Bo(k.lastTransfer)),k.badgeBaseTitle=r,k.badge.title=r+Mo()}function Bo(e){const t=[];e.pulled&&e.pulled.length&&t.push("拉取: "+e.pulled.join("、")),e.pushed&&e.pushed.length&&t.push("推送: "+e.pushed.join("、")),t.length||t.push("无变化（增量跳过）");const n=e.bytes?"（"+(e.bytes>1024?Math.round(e.bytes/1024*10)/10+" KB":e.bytes+" B")+"）":"";return`
最近同步 `+t.join(" · ")+n}function qo(){if(Lo(),document.getElementById("cloud-mask"))return;const e=document.createElement("div");e.id="cloud-mask",k.token?Sn(e):pc(e),document.body.appendChild(e),e.onclick=t=>{t.target===e&&Ot()}}function Ot(){const e=document.getElementById("cloud-mask");e&&e.remove()}function pc(e){e.innerHTML='<div id="cloud-card"><h3>☁ 同步到你的 GitHub</h3><input id="cv-t" placeholder="粘贴 GitHub 个人令牌" type="password"><div class="err" id="cv-err"></div><div class="row"><button class="primary" id="cv-ok">保存并同步</button><button class="ghost" id="cv-cancel">取消</button></div><div class="hint">① 去 <a href="'+za+'" target="_blank" rel="noreferrer">生成令牌</a>，只勾 <b>gist</b> 权限；<br>② 令牌仅存于本机浏览器，数据存在你自己的 Gist 里，别人看不到；<br>③ 不同设备用同一令牌即自动同步同一份数据。</div></div>',e.querySelector("#cv-cancel").onclick=Ot,e.querySelector("#cv-ok").onclick=()=>{const t=e.querySelector("#cv-t").value.trim();if(!t){at(e,"请粘贴令牌");return}fc(t,e)}}function Sn(e){const t=k.lastSyncAt?new Date(k.lastSyncAt).toLocaleString():"—",n=k.gistId?"https://gist.github.com/"+k.gistId:"#",r=k.gistId?k.gistId.slice(0,8):"（未绑定）",s=k.lastTransfer?Bo(k.lastTransfer).replace(/^\n/,""):"尚无同步记录",i='<span style="color:#1a56c4;font-weight:500">🧩 追加同步 '+(P.opCount||0)+"/"+tn+" op 文件（达阈值自动压实整包）</span><br>",a=k.syncLog.slice(0,8);let c="";if(a.length){c='<details style="margin-top:10px"><summary style="cursor:pointer;font-size:13px;font-weight:500;color:#1a56c4;margin-bottom:6px">📋 同步历史（最近 '+a.length+' 次）</summary><table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:4px"><tr style="background:#f6f6f6;color:#666"><th style="padding:4px 6px;text-align:left">时间</th><th style="padding:4px 6px;text-align:left">操作</th><th style="padding:4px 6px;text-align:right">耗时</th><th style="padding:4px 6px;text-align:right">数据量</th></tr>';for(let d=0;d<a.length;d++){const m=a[d],p=new Date(m.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),y=m.durationMs<1e3?m.durationMs+"ms":(m.durationMs/1e3).toFixed(1)+"s",h=m.bytes>1024?Math.round(m.bytes/1024*10)/10+"KB":m.bytes+"B",g=m.phase==="拉取"?"#1a7f37":m.phase==="推送"?"#2f54eb":"#c0392b";c+='<tr style="border-top:1px solid #eee"><td style="padding:3px 6px;color:#888;white-space:nowrap">'+p+'</td><td style="padding:3px 6px" title="'+Le(m.detail)+'"><span style="color:'+g+';font-weight:500">'+Le(m.phase)+"</span> "+Le((m.detail||"").slice(0,30))+'</td><td style="padding:3px 6px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums">'+y+'</td><td style="padding:3px 6px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;color:#888">'+h+"</td></tr>"}c+="</table></details>"}const l=(function(){try{const d=window.Store.get();let m=0,p=0,y=0;for(const h in d){const g=JSON.stringify(d[h]||"").length;if(re.indexOf(h)>=0){p+=g;continue}if(ve.indexOf(h)>=0){y+=g;continue}m+=g}return(m/1024).toFixed(1)+" KB 核心，"+(p/1024).toFixed(1)+" KB 大数据，"+(y/1024).toFixed(1)+" KB 重量级"}catch{return"—"}})();e.innerHTML='<div id="cloud-card"><h3>☁ 已同步到你的 GitHub（追加同步）</h3><div class="hint" style="margin-top:0">最近同步：'+t+'　<span id="cv-phase" style="color:'+(k.syncPhase!=="idle"?"#2f54eb":"#1a7f37")+';font-weight:500">'+(k.syncPhase==="downloading"?"⬇ 下载中…":k.syncPhase==="uploading"?"⬆ 上传中…":k.syncPhase==="uploading-bulk"?"⬆ 上传大数据…":k.syncPhase==="merging"?"🔄 整合中…":"✅ 空闲")+"</span><br>"+i+'<div style="font-size:12px;color:#555;margin:6px 0;padding:6px 8px;background:#f8f9fa;border-radius:6px">📊 '+l+'　<a style="color:#2f54eb;cursor:pointer" id="cv-go-settings">→ 去设置查看详情</a></div>核心 Gist ID：<b style="color:#1a7f37">'+r+"</b>"+(k.bulkGistId?"　图库 Gist：<b>"+k.bulkGistId.slice(0,8)+"</b>":"")+'<br>Gist 地址：<a href="'+n+'" target="_blank" rel="noreferrer">查看</a><br><span style="color:#1a56c4">'+s+"</span>"+c+'<span style="color:#c0392b;display:block;margin-top:6px">⚠ 跨设备同步前提：<b>每台设备粘贴【同一个】令牌</b>且都升级到新版（追加同步）。旧版本会把整包写回，造成格式混用。</span></div><label style="display:flex;align-items:center;gap:6px;font-size:13px;margin-top:10px;color:#444;cursor:pointer" title="开启（默认）：Key 随云端同步，换设备 / 重装后拉取一次即自动取回（Gist 为私有，仅本人令牌可读）。&#10;关闭：Key 只存本机、不上传云端——更保守，但换设备需手动重填。&#10;无论开关如何，本机已填好的 Key 都不会被云端空值清掉（2026-09-04 起）。"><input type="checkbox" id="cv-ai"'+(P.syncAiKey!==!1?" checked":"")+'> 同步 AI Key 到云端 <span style="color:#888">（默认开 · 换设备免重填）</span></label><div class="hint" style="margin-top:8px">⏱ 自动推送 / 拉取频率：<a style="color:#2f54eb;cursor:pointer" id="cv-go-freq">前往设置调整</a>（周期内的改动合并推送，省同步次数；改动始终实时存本机，关机不丢，重开超周期自动补推）。</div><div class="row"><button class="primary" id="cv-sync">拉取+推送</button><button class="ghost" id="cv-pull">仅拉取远端</button></div><div class="row"><button class="accent" id="cv-all">生成完整快照（压实 op 日志）</button></div><div class="row"><button class="primary" id="cv-copy">复制同步令牌</button><button class="ghost" id="cv-out">退出</button></div><div class="err" id="cv-err"></div><div class="hint">退出仅清除本机令牌，云端数据不删；换设备用同一令牌仍可取回。</div></div>',e.querySelector("#cv-ai").onchange=d=>{P.syncAiKey=d.target.checked,delete P.pushedHashes.core,delete P.pushedHashes.manifest,Re(),Ie().then(()=>ae("☁ 已同步","on")).catch(()=>{})};var u=e.querySelector("#cv-go-freq");u&&(u.onclick=()=>{Ot(),window.App&&App.go("settings")}),e.querySelector("#cv-sync").onclick=()=>{De(!0).then(Ie).then(()=>{Sn(e),ae("☁ 已同步","on"),window.Toast&&z.success("已与云端同步")}).catch(()=>at(e,"同步失败，请重试"))},e.querySelector("#cv-all").onclick=()=>{Oe("uploading-bulk"),window.Toast&&z.show("正在生成完整快照（压实 op 日志）…","info"),Ie({bulk:!0}).then(()=>{Sn(e),ae("☁ 已同步","on"),window.Toast&&z.success("已生成完整快照并压实")}).catch(()=>at(e,"生成快照失败，请重试"))},e.querySelector("#cv-pull").onclick=()=>{De(!0).then(()=>{Sn(e),ae("☁ 已同步","on"),window.Toast&&z.success("已拉取远端数据")}).catch(()=>at(e,"拉取失败，请检查网络或令牌"))},e.querySelector("#cv-copy").onclick=()=>{const d=k.token||"",m=()=>at(e,"已复制令牌，去另一台设备粘贴即可同步同一份数据"),p=()=>at(e,"当前环境不支持自动复制，请手动复制令牌");navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(d).then(m).catch(p):p()},e.querySelector("#cv-out").onclick=()=>{No(),Ot()};const f=e.querySelector("#cv-go-settings");f&&(f.onclick=()=>{Ot(),window.App&&App.go("settings")})}function at(e,t){const n=e.querySelector("#cv-err");n&&(n.textContent=t)}async function hc(e){e=e||{};const t=e.confirm||(l=>typeof window<"u"&&window.confirm?window.confirm(l):!0),n=e.progress||(()=>{}),r=e.phase||(()=>{}),s=e.result||(()=>{}),o=e.error||(l=>{window.Toast&&z.danger(l)});if(!k.token)return o("未登录，无法清理"),null;if(!await t(`将删除你 GitHub 账号下所有「同名但当前设备未在使用」的同步 Gist（保留当前活跃的那一对）。

这能清掉旧版本反复新建产生的重复/垃圾同步文件，减少 API 配额占用、避免同步变慢。

确认继续？此操作不可逆（但只删不再被任何设备引用的文件，活跃数据完好）。`))return null;r("uploading");const a=l=>new Promise(u=>setTimeout(u,l)),c=Date.now();try{const l=[],u=[];for(let _=1;_<=5;_++){let T;try{T=(await xe("/gists?per_page=100&page="+_)).data}catch(A){if(A&&A.status===403){nn(0),await a(3e4),_--;continue}throw A}if(!T||!T.length)break;for(const A of T){const M=A.description||"";M===wo?l.push(A):M===Hr&&u.push(A)}if(T.length<100)break}let f=null;if(P.gistId&&(f=l.find(_=>_.id===P.gistId&&_.files&&_.files[Ue])||null),!f){const _=l.filter(A=>A.files&&A.files[Ue]);f=(_.length?_:l).slice().sort((A,M)=>(M.updated_at||"").localeCompare(A.updated_at||""))[0]||null}let d=null;if(f&&f.files&&f.files[Ue])try{const _=await He(f.files[Ue]),T=_?JSON.parse(_):null;T&&T.bulkGistId&&(d=u.find(A=>A.id===T.bulkGistId)||null)}catch{}!d&&u.length&&(d=u.slice().sort((_,T)=>(T.updated_at||"").localeCompare(_.updated_at||""))[0]||null);const m=f?f.id:null,p=d?d.id:null,y=l.filter(_=>_.id!==m).concat(u.filter(_=>_.id!==p));if(!y.length){const _={ok:!0,deleted:0,failed:0,kept:{core:m,bulk:p},total:0,startedAt:c,finishedAt:Date.now(),message:"没有需要清理的孤儿 Gist，你的云端很干净 ✅"};return window.Toast&&z.success(_.message),s(_),r("idle"),_}n("发现 "+y.length+" 个孤儿 Gist，开始删除（保留活跃对）…");let h=0,g=0;for(let _=0;_<y.length;_++){const T=y[_];let A=!1,M=0;for(;M<5&&!A;)try{await xe("/gists/"+T.id,{method:"DELETE"}),A=!0}catch(D){if(D&&D.status===404)A=!0;else if(D&&D.status===403)nn(M),await a(Math.min(3e4*Math.pow(2,M),3e5)),M++;else{g++;break}}A&&h++,n("清理中… 已删除 "+h+" / "+y.length+(g?"（失败 "+g+"）":"")),await a(200)}const v=Date.now(),S={ok:!0,deleted:h,failed:g,kept:{core:m,bulk:p},total:y.length,startedAt:c,finishedAt:v,message:"清理完成：删除 "+h+" 个孤儿 Gist"+(g?"，"+g+" 个失败":"")+"，已保留活跃对"};return window.Toast&&z.success(S.message),s(S),r("idle"),S}catch(l){r("idle");const u="清理失败："+(l&&l.message?l.message:l);return o(u),{ok:!1,error:u,startedAt:c,finishedAt:Date.now()}}}function Dt(e){return e>=1024?Math.round(e/1024*10)/10+" KB":e+" B"}function ue(e){if(e==null)return 0;if(e=String(e),typeof TextEncoder<"u")try{return new TextEncoder().encode(e).length}catch{}let t=0;for(let n=0;n<e.length;n++){const r=e.charCodeAt(n);t+=r<128?1:r<2048?2:3}return t}function mc(e){const t=/^op-(\d+)-/.exec(e);if(!t)return"";try{return new Date(+t[1]).toLocaleString([],{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}catch{return""}}function gc(){try{const e=window.Store.get(),t=[],n=[],r=[];let s=0,o=0,i=0;for(const l in e){const u=JSON.stringify(e[l]||"").length;if(re.indexOf(l)>=0){n.push({k:l,kb:(u/1024).toFixed(1),sz:u}),o+=u;continue}if(ve.indexOf(l)>=0){r.push({k:l,kb:(u/1024).toFixed(1),sz:u}),i+=u;continue}s+=u,t.push({k:l,kb:(u/1024).toFixed(1),sz:u})}t.sort((l,u)=>u.sz-l.sz);const a=t.slice(0,15);let c='<details open style="margin-top:6px"><summary style="cursor:pointer;color:#2f54eb;font-weight:500;font-size:13px">📊 核心体积诊断（'+(s/1024).toFixed(1)+" KB 核心，"+(o/1024).toFixed(1)+" KB 大数据，"+(i/1024).toFixed(1)+" KB 重量级）</summary>";return r.length&&(c+='<div style="font-size:11px;color:#888;margin:4px 0">⬅ 已从核心剥离（重量级对象字段）：',c+=r.map(l=>Le(l.k)+" "+l.kb+"KB").join(" / "),c+="</div>"),n.length&&(c+='<div style="font-size:11px;color:#888;margin:2px 0">⬅ 已从核心剥离（大数据数组）：',c+=n.filter(l=>l.sz>500).map(l=>Le(l.k)+" "+l.kb+"KB").join(" / "),c+="</div>"),c+='<table style="width:100%;font-size:12px;margin-top:4px;border-collapse:collapse">',c+='<tr style="border-bottom:1px solid #ddd"><th style="text-align:left;padding:2px 6px;color:#888">字段</th><th style="text-align:right;padding:2px 6px;color:#888">KB</th><th style="text-align:left;padding:2px 6px;color:#888;width:60%">占比</th></tr>',a.forEach(l=>{const u=s>0?(l.sz/s*100).toFixed(0):0,f=l.sz>1e4?"#c0392b":l.sz>3e3?"#e67e22":"#1a7f37";c+='<tr><td style="padding:1px 6px;font-family:monospace;font-size:11px">'+Le(l.k)+'</td><td style="padding:1px 6px;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap">'+l.kb+'</td><td style="padding:1px 6px"><div style="background:#eee;border-radius:3px;height:12px;display:inline-block;min-width:40px;vertical-align:middle"><div style="background:'+f+";height:100%;border-radius:3px;width:"+Math.min(u,100)+'%"></div></div> <span style="color:#888;font-size:11px">'+u+"%</span></td></tr>"}),t.length>15&&(c+='<tr><td colspan="3" style="padding:2px 6px;color:#888;font-size:11px">… 还有 '+(t.length-15)+" 个更小的字段</td></tr>"),c+="</table></details>",c}catch{return""}}async function Ro(){const e={core:[],bulk:[],coreTotal:0,bulkTotal:0,total:0,gen:P.compactGen||0,opCount:P.opCount||0,error:null};try{if(k.gistId){const t=await xe("/gists/"+k.gistId,{etag:null});if(t.data&&t.data.files){for(const r in t.data.files){const s=t.data.files[r],o=typeof s.size=="number"?s.size:s.content?s.content.length:0;let i="other",a=r;r===Jr?(i="core",a="核心 core.json"):r===Ue?(i="manifest",a="清单 manifest.json"):Ur.test(r)&&(i="op"),e.core.push({name:r,size:o,type:i,label:a}),e.coreTotal+=o}const n=t.data.files[Ue];if(n){const r=await He(n);if(r)try{const s=JSON.parse(r);typeof s.compactGen=="number"&&(e.gen=s.compactGen),s.bulkGistId&&(k.bulkGistId=s.bulkGistId)}catch{}}}}if(k.bulkGistId){const t=await xe("/gists/"+k.bulkGistId,{etag:null});if(t.data&&t.data.files)for(const n in t.data.files){const r=t.data.files[n],s=typeof r.size=="number"?r.size:r.content?r.content.length:0;let o="bulk",i=n;re.forEach(a=>{n===a+".json"&&(o="coll",i=(zr[a]||a)+".json")}),ve.forEach(a=>{n===a+".json"&&(o="heavy",i=(On[a]||a)+".json")}),e.bulk.push({name:n,size:s,type:o,label:i}),e.bulkTotal+=s}}e.total=e.coreTotal+e.bulkTotal}catch(t){e.error=t&&t.message?t.message:""+t}return e}function Jo(e){const t=e.core.filter(a=>a.type==="op").sort((a,c)=>c.name.localeCompare(a.name)),n=e.core.filter(a=>a.type==="core"||a.type==="manifest"),r=e.gen,s=e.opCount,o=Math.min(100,Math.round(s/tn*100));let i='<div style="font-size:13px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b style="color:#1a56c4">☁ 云端数据分布</b><button class="btn btn-ghost cs-refresh" style="padding:2px 8px;font-size:12px">🔄 刷新</button></div>';return i+='<div style="font-size:12px;color:#444;margin-bottom:4px">总占用 <b>'+Dt(e.total)+"</b>　·　压实代次 <b>#"+r+"</b>　·　op 文件 <b>"+t.length+"/"+tn+"</b></div>",i+='<div style="background:#eee;border-radius:4px;height:8px;margin:2px 0 8px"><div style="background:'+(o>=100?"#c0392b":"#2f54eb")+";height:100%;border-radius:4px;width:"+o+'%"></div></div>',i+='<div style="font-size:12px;font-weight:600;color:#666;margin-top:4px">📦 核心 Gist</div>',i+='<table style="width:100%;font-size:12px;border-collapse:collapse">',n.forEach(a=>{i+='<tr><td style="padding:1px 6px">'+Le(a.label)+'</td><td style="padding:1px 6px;text-align:right;font-variant-numeric:tabular-nums;color:#888">'+Dt(a.size)+"</td></tr>"}),t.length&&(i+='<tr><td colspan="2" style="padding:2px 6px;color:#1a56c4;font-weight:500">op 增量文件（'+t.length+" 个，共 "+Dt(t.reduce((a,c)=>a+c.size,0))+"）</td></tr>",t.slice(0,30).forEach(a=>{i+='<tr><td style="padding:1px 6px;font-family:monospace;font-size:10px;color:#555">'+Le(a.name.slice(0,26))+(a.name.length>26?"…":"")+'<br><span style="color:#aaa">'+mc(a.name)+'</span></td><td style="padding:1px 6px;text-align:right;white-space:nowrap"><span style="color:#888;font-variant-numeric:tabular-nums">'+Dt(a.size)+'</span> <button class="cs-op-del" data-name="'+Le(a.name)+'" title="删除该 op 并整理云端（数据不丢）" style="padding:0 5px;font-size:11px;border:none;background:#fbeaea;color:#c0392b;border-radius:4px;cursor:pointer">🗑</button></td></tr>'}),t.length>30&&(i+='<tr><td colspan="2" style="padding:2px 6px;color:#888;font-size:11px">… 还有 '+(t.length-30)+" 个</td></tr>")),i+="</table>",i+='<div style="font-size:12px;font-weight:600;color:#666;margin-top:8px">🗄 大数据 Gist</div>',i+='<table style="width:100%;font-size:12px;border-collapse:collapse">',e.bulk.forEach(a=>{i+='<tr><td style="padding:1px 6px">'+Le(a.label)+'</td><td style="padding:1px 6px;text-align:right;font-variant-numeric:tabular-nums;color:#888">'+Dt(a.size)+"</td></tr>"}),e.bulk.length||(i+='<tr><td colspan="2" style="padding:2px 6px;color:#888;font-size:11px">（暂无，首次同步后生成）</td></tr>'),i+="</table>",i+='<div style="font-size:11px;color:#888;margin-top:6px">🗑 删除单个 op = 整理云端（生成完整快照 + 升代次 + 清旧 op，数据不丢）。也可用「压实」按钮手动整理。</div>',i+="</div>",i}async function br(e){if(e){e.innerHTML="☁ 正在读取云端数据分布…";try{const t=await Ro();if(t.error){e.innerHTML='<div style="color:#c0392b;font-size:12px">读取云端失败：'+Le(t.error)+' <button class="btn btn-ghost cs-refresh" style="padding:1px 6px;font-size:11px">重试</button></div>',Fs(e);return}e.innerHTML=Jo(t),Fs(e)}catch(t){e.innerHTML='<div style="color:#c0392b;font-size:12px">读取异常：'+Le(t&&t.message||t)+"</div>"}}}function Fs(e){if(!e)return;const t=e.querySelector(".cs-refresh");t&&(t.onclick=()=>br(e)),e.querySelectorAll(".cs-op-del").forEach(n=>{n.onclick=()=>{confirm(`确定整理云端吗？
将生成完整快照、升压实代次、并清除所有旧 op 文件（数据不会丢失）。`)&&(Oe("uploading-bulk"),window.Toast&&z.show("正在整理云端…","info"),Ie({bulk:!0}).then(()=>{window.Toast&&z.success("已整理云端"),br(e)}).catch(()=>{window.Toast&&z.danger("整理失败，请重试")}))}})}async function yc(e){if(Store.update(t=>{Array.isArray(t[e])?t[e]=[]:t[e]&&typeof t[e]=="object"?t[e]={}:t[e]=null}),k.bulkGistId)try{await dt(k.bulkGistId,{[e+".json"]:null})}catch{}return!0}async function vc(e){if(!k.bulkGistId)throw new Error("未登录或无大数据 Gist");return await dt(k.bulkGistId,{[e+".json"]:null}),!0}const _e={init:dc,pull:De,push:Ie,schedulePush:Kr,openPanel:qo,logout:No,mountBadge:()=>Do(),get isEnabled(){return k.enabled},get isLoggedIn(){return!!k.token},coreSizeBreakdown:gc,fetchCloudStats:Ro,clearCloudColl:yc,deleteCloudFile:vc,renderCloudStatsHtml:Jo,refreshCloudStatsIn:br,cleanupOrphanGists:hc,genOps:Fr,coreOf:Cn,doSync:()=>De(!0,void 0).then(Ie),doPull:()=>De(!0,void 0),doCompact:()=>(Oe("uploading-bulk"),Ie({bulk:!0})),get gistId(){return k.gistId},get bulkGistId(){return k.bulkGistId},gistReq:(e,t)=>{if(!k.token){const n=new Error("未登录云同步，无法使用分享协作（先在设置里登录）");throw n.status=0,n}return xe(e,t)},gistUpload:(e,t,n,r)=>{if(!k.token){const s=new Error("未登录云同步，无法上传");throw s.status=0,s}return new Promise(function(s,o){try{const i=new XMLHttpRequest;i.open("POST",vo+e),i.setRequestHeader("Authorization","Bearer "+k.token),i.setRequestHeader("Accept","application/vnd.github+json"),i.setRequestHeader("Content-Type","application/json"),i.timeout=3e5,r&&r.addEventListener("abort",()=>{try{i.abort()}catch{}}),i.upload.onprogress=function(a){a.lengthComputable&&typeof n=="function"&&n(Math.round(a.loaded/a.total*100),a.loaded,a.total)},i.onload=function(){if(i.status>=200&&i.status<300)try{s({status:i.status,data:JSON.parse(i.responseText||"{}")})}catch(a){o(new Error("Gist 创建成功但响应解析失败："+(a.message||a)))}else{const a=new Error("Gist 上传失败 HTTP "+i.status+"："+(i.responseText||"").slice(0,200));a.status=i.status,o(a)}},i.onerror=function(){o(new Error("Gist 上传网络错误（请检查网络后重试）"))},i.ontimeout=function(){o(new Error("Gist 上传超时（>5min，文件可能过大或网络过慢，建议压缩后重试）"))},i.send(JSON.stringify(t))}catch(i){o(new Error("Gist 上传初始化失败："+(i.message||i)))}})},get syncInfo(){return{gistId:k.gistId,bulkGistId:k.bulkGistId,lastSyncAt:k.lastSyncAt,lastTransfer:k.lastTransfer,opCount:P.opCount||0,compactGen:P.compactGen||0,compactThreshold:tn,pushIntervalMs:In(),pullIntervalMs:mr(),nextPushDue:nt||0,lastPushedAt:k.lastPushedAt||0}},PUSH_INTERVAL_OPTIONS:Ha,PULL_INTERVAL_OPTIONS:Ga,getPushIntervalMs:In,getPullIntervalMs:mr,setPushInterval(e){return e=parseInt(e,10),isNaN(e)||e<0?!1:(P.pushIntervalMs=e,Re(),et&&(clearTimeout(et),et=null,nt=0),e===0?(k.lastPushAttemptAt=Date.now(),Ie().then(()=>ae("☁ 已同步","on")).catch(()=>{})):(k.lastPushedAt=k.lastPushedAt||Date.now(),wr()),!0)},setPullInterval(e){return e=parseInt(e,10),isNaN(e)||e<xo?!1:(P.pullIntervalMs=e,Re(),k.pollTimer&&kn(),!0)}};typeof module<"u"&&module.exports&&(module.exports={genOps:Fr,applyOps:Eo,collHashLive:yr,mergeOpFiles:Io,genOpFileName:Oo,coreOf:Cn,liveCoreJson:To});const Ho="kaoyan2026_theme",nr=["day","morning","night"];function wc(){try{const e=localStorage.getItem(Ho);if(e==="morning"||e==="night"||e==="day")return e}catch{}return"day"}const ot=de(wc());function Go(e,t){try{const n=document.documentElement;t&&(n.classList.add("theme-anim"),setTimeout(()=>n.classList.remove("theme-anim"),400)),e==="day"?n.removeAttribute("data-theme"):n.setAttribute("data-theme",e)}catch{}}Go(ot.value,!1);function Vr(){const e=j(()=>ot.value),t=j(()=>ot.value==="night"),n=j(()=>ot.value==="morning");function r(i){if(!(i!=="day"&&i!=="morning"&&i!=="night")){ot.value=i,Go(i,!0);try{localStorage.setItem(Ho,i)}catch{}}}function s(){const i=nr.indexOf(ot.value);r(nr[(i+1)%nr.length])}function o(){r(ot.value==="night"?"day":"night")}return{theme:e,isNight:t,isMorning:n,set:r,toggle:o,cycle:s}}const rn={dashboard:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#3b5998" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',scheduler:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="16" r="2" fill="#f97316"/></svg>',review:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><circle cx="10" cy="9" r="2" fill="#f97316"/></svg>',photomistake:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/><circle cx="12" cy="13" r="1" fill="#f97316"/></svg>',vizai:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7v10l10 5 10-5V7z"/><path d="M2 7l10 5 10-5"/><path d="M12 22V12"/><path d="M7 4.5l10 5"/><path d="M17 4.5l-10 5"/><circle cx="12" cy="12" r="1.5" fill="#f97316"/></svg>',tools:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/><circle cx="10" cy="10" r="2" fill="#f97316"/></svg>',quiz:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="10"/><line x1="12" y1="17" x2="12.01" y2="17"/><circle cx="12" cy="16.5" r="1.5" fill="#f97316"/></svg>',essay:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/><circle cx="14" cy="6" r="1" fill="#f97316"/></svg>',mistakes:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/><circle cx="12" cy="12" r="1.5" fill="#f97316"/></svg>',heatmap:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/><circle cx="18" cy="4" r="2" fill="#f97316"/></svg>',inspector:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#65a30d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/><circle cx="15" cy="5" r="1" fill="#f97316"/></svg>',focus:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#4338ca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="#f97316"/></svg>',concept:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="14.5" y1="9.5" x2="17.5" y2="6.5"/><line x1="9.5" y1="9.5" x2="6.5" y2="6.5"/><line x1="9.5" y1="14.5" x2="6.5" y2="17.5"/><line x1="14.5" y1="14.5" x2="17.5" y2="17.5"/><circle cx="12" cy="12" r="1" fill="#f97316"/></svg>',sprint:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#c2410c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/><circle cx="13" cy="7" r="1.5" fill="#f97316"/></svg>',decision:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><circle cx="18" cy="7" r="2" fill="#f97316"/></svg>',mental:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><circle cx="12" cy="10" r="1.5" fill="#f97316"/></svg>',reading:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><circle cx="13" cy="11" r="1.5" fill="#f97316"/></svg>',wordbook:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="10" y1="7" x2="16" y2="7"/><line x1="10" y1="11" x2="16" y2="11"/><circle cx="13" cy="14" r="1.5" fill="#f97316"/></svg>',polrecite:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M10 10l2 2 4-4"/><circle cx="13" cy="7" r="1.5" fill="#f97316"/></svg>',redline:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#991b1b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/><circle cx="12" cy="12" r="1.5" fill="#f97316"/></svg>',progress:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="6"/><circle cx="18" cy="6" r="2" fill="#f97316"/></svg>',share:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/><circle cx="18" cy="5" r="0.5" fill="#f97316"/></svg>',settings:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/><circle cx="12" cy="12" r="1" fill="#f97316"/></svg>',plugins:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.5h1.5a2.5 2.5 0 0 1 0 5H2V19a2 2 0 0 0 2 2h3.5v-1.5a2.5 2.5 0 0 1 5 0V21H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z"/><circle cx="8.5" cy="8.5" r="1" fill="#f97316"/><circle cx="15.5" cy="15.5" r="1" fill="#f97316"/></svg>',copilot:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="cpBot" x1="3" y1="5" x2="21" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a855f7"/><stop offset="0.55" stop-color="#6366f1"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><path d="M12 2.4v3.2" stroke="#f97316" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="2.3" r="1.8" fill="#fbbf24"/><rect x="4.5" y="6" width="15" height="13" rx="6" fill="url(#cpBot)"/><rect x="6" y="7.6" width="12" height="3" rx="1.5" fill="#ffffff" opacity="0.16"/><circle cx="9.3" cy="12.7" r="1.7" fill="#ffffff"/><circle cx="14.7" cy="12.7" r="1.7" fill="#ffffff"/><circle cx="9.3" cy="12.7" r="0.8" fill="#6d28d9"/><circle cx="14.7" cy="12.7" r="0.8" fill="#6d28d9"/><path d="M9.6 15.6c1.1 1.1 3.7 1.1 4.8 0" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round"/><circle cx="6.7" cy="15" r="1.1" fill="#f472b6" opacity="0.85"/><circle cx="17.3" cy="15" r="1.1" fill="#34d399" opacity="0.85"/></svg>',cloud:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',clean:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',warn:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',bulb:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',list:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',thought:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r="1" fill="#f97316"/><circle cx="15" cy="7" r="1" fill="#f97316"/></svg>',search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><circle cx="11" cy="11" r="2" fill="#f97316"/></svg>',edit:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/><circle cx="16" cy="5" r="1" fill="#f97316"/></svg>',snap:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/><circle cx="12" cy="13" r="1" fill="#f97316"/></svg>',plus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',sun:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19"/></svg>',moon:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.3A8.4 8.4 0 0 1 10.7 3.4a8.4 8.4 0 1 0 9.9 9.9z"/></svg>'},bc=["innerHTML"],xn=le({__name:"AppIcon",props:{name:{},cls:{}},setup(e){const t=e,n=j(()=>(rn[t.name]||"").replace("<svg",'<svg class="ci '+(t.cls||"")+'"'));return(r,s)=>(E(),I("span",{class:"app-icon",innerHTML:n.value},null,8,bc))}}),kc={class:"statusbar",id:"statusbar","data-testid":"statusbar"},Sc=["title"],xc={class:"sb-item"},_c={class:"sb-item"},Ac={class:"sb-item"},Tc={key:0,class:"sb-item sb-streak"},Ec={key:1,class:"sb-item sb-warn"},Oc=le({__name:"StatusBar",setup(e){const{theme:t,cycle:n}=Vr(),r=j(()=>x.daysTo(w.get().settings.examDate)),s=j(()=>w.todayHours()),o=j(()=>{const u=w.todayTaskStats();let f=0,d=0;return Object.keys(u).forEach(m=>{f+=u[m][0],d+=u[m][1]}),{done:f,total:d}}),i=j(()=>w.studyStreak()),a=j(()=>w.mistakeCountToday("sign")),c=j(()=>t.value==="night"||t.value==="morning"?"sun":"moon"),l=j(()=>t.value==="night"?"当前「星阑」夜间，点击回「墨白」":t.value==="morning"?"当前「晨岚」柔和，点击进「星阑」":"当前「墨白」日间，点击进「晨岚」");return un(()=>{try{_e.mountBadge&&_e.mountBadge()}catch{}}),(u,f)=>(E(),I("header",kc,[b("button",{class:"sb-theme","data-testid":"theme-toggle",title:l.value,"aria-label":"切换主题",onClick:f[0]||(f[0]=(...d)=>U(n)&&U(n)(...d))},[ie(xn,{name:c.value},null,8,["name"])],8,Sc),b("span",xc,[f[1]||(f[1]=X("⏳ ",-1)),b("b",null,C(r.value),1),f[2]||(f[2]=X("天",-1))]),b("span",_c,[f[3]||(f[3]=X("🕐 ",-1)),b("b",null,C(s.value),1),f[4]||(f[4]=X("h",-1))]),b("span",Ac,[f[5]||(f[5]=X("✅ ",-1)),b("b",null,C(o.value.done)+"/"+C(o.value.total),1)]),i.value>=2?(E(),I("span",Tc,[f[6]||(f[6]=X("🔥 ",-1)),b("b",null,C(i.value),1),f[7]||(f[7]=X("天",-1))])):$("",!0),a.value>0?(E(),I("span",Ec,"⚠️符号"+C(a.value),1)):$("",!0)]))}}),sn=[{id:"dashboard",label:"仪表盘",icon:"dashboard"},{id:"scheduler",label:"排程",icon:"scheduler"},{id:"review",label:"复盘",icon:"review"},{id:"photomistake",label:"拍题",icon:"photomistake"}],Qr=[{id:"quiz",label:"AI测验",icon:"quiz"},{id:"essay",label:"作文批改",icon:"essay"},{id:"mistakes",label:"错题画像",icon:"mistakes"},{id:"heatmap",label:"考点热力",icon:"heatmap"},{id:"inspector",label:"解题方法",icon:"inspector"},{id:"focus",label:"深度专注",icon:"focus"},{id:"concept",label:"概念图谱",icon:"concept"},{id:"sprint",label:"智能押题",icon:"sprint"},{id:"decision",label:"院校决策",icon:"decision"},{id:"mental",label:"心理状态",icon:"mental"},{id:"reading",label:"英语阅读",icon:"reading"},{id:"wordbook",label:"单词本",icon:"wordbook"},{id:"polrecite",label:"政治背诵",icon:"polrecite"},{id:"redline",label:"红线禁令",icon:"redline"},{id:"progress",label:"进度追踪",icon:"progress"},{id:"plugins",label:"插件中心",icon:"plugins"},{id:"share",label:"星屿广场",icon:"share"},{id:"vizai",label:"AI可视化",icon:"vizai"},{id:"aitools",label:"AI工程台",icon:"bulb"},{id:"settings",label:"设置",icon:"settings"}];function Ic(e){return sn.some(t=>t.id===e)}function zo(e){return sn.concat(Qr).find(t=>t.id===e)?.label||e}function Qe(e){return Ic(e)?"/"+e:"/tool/"+e}var Uo={math:{name:"数学一",short:"数学",color:"#2f54eb",target:130,modules:["高数","线代","概率"]},ctrl:{name:"自控(含现控)",short:"自控",color:"#237804",target:135,modules:["经典控制","现代控制"]},eng:{name:"英语一",short:"英语",color:"#722ed1",target:70,modules:["阅读","作文"]},pol:{name:"政治",short:"政治",color:"#595959",target:65,modules:["马原","思修","史纲","毛中特"]}},kr={shuyi:{name:"数学一",modules:["高数","线代","概率"]},shuer:{name:"数学二",modules:["高数","线代"]},shusan:{name:"数学三",modules:["高数","线代","概率"]}},Sr={yingyi:{name:"英语一",difficulty:"hard"},yinger:{name:"英语二",difficulty:"medium"}};function $o(e){var t=e||{},n=kr[t.mathType]||kr.shuyi,r=Sr[t.engType]||Sr.yingyi,s=t.profName||"自控原理",o=[],i=Ee[s]||w.get().majorData&&w.get().majorData[s];return i&&i.modules&&(o=i.modules),{math:{name:n.name,short:"数学",color:"#2f54eb",target:130,modules:n.modules},ctrl:{name:s,short:s.length>4?s.slice(0,4)+"…":s,color:"#237804",target:135,modules:o},eng:{name:r.name,short:"英语",color:"#722ed1",target:70,modules:["阅读","作文"]},pol:{name:"政治",short:"政治",color:"#595959",target:65,modules:["马原","思修","史纲","毛中特"]}}}var Ee={};Ee.自控原理={modules:["经典控制","现代控制"],textbook:"胡寿松《自动控制原理》",alertRule:{hardModule:"现代控制",hardMilestone:"极点配置",learnPath:"状态转移矩阵 → 能控能观 → 极点配置"},milestoneLabel:"专业课核心能力验证（独立完成{hard}）",topics:[{id:"c-tf",name:"传递函数",tier:1,group:"经典控制"},{id:"c-time",name:"时域分析",tier:1,group:"经典控制"},{id:"c-root",name:"根轨迹",tier:2,group:"经典控制"},{id:"c-freq",name:"频域分析",tier:2,group:"经典控制"},{id:"c-comp",name:"校正设计",tier:3,group:"经典控制"},{id:"c-ss",name:"状态空间建模",tier:1,group:"现代控制"},{id:"c-stm",name:"状态转移矩阵",tier:2,group:"现代控制"},{id:"c-ctrb",name:"能控能观判据",tier:2,group:"现代控制"},{id:"c-pole",name:"极点配置",tier:2,group:"现代控制"},{id:"c-obs",name:"观测器设计",tier:3,group:"现代控制"},{id:"c-lyap",name:"李雅普诺夫稳定性",tier:3,group:"现代控制"}],conceptGraph:[{id:"c-tf",name:"传递函数",x:60,y:40,deps:[],book:"胡寿松《自控》P20 例2-1",glossary:[["被控对象","plant"],["放大倍数","增益 K"]]},{id:"c-time",name:"时域分析",x:60,y:130,deps:["c-tf"],book:"胡寿松P75 例3-2",glossary:[["响应快慢","上升时间 tr"],["超调","σ%"]]},{id:"c-root",name:"根轨迹",x:60,y:220,deps:["c-time"],book:"胡寿松P140 例4-3",glossary:[["开环增益","K*"],["分离点","breakaway point"]]},{id:"c-freq",name:"频域分析",x:60,y:310,deps:["c-root"],book:"胡寿松P180 例5-1",glossary:[["带宽","ωb"],["稳定裕度","PM/GM"]]},{id:"c-comp",name:"校正设计",x:60,y:400,deps:["c-freq"],book:"胡寿松P240 例6-2",glossary:[["超前校正","lead"],["滞后校正","lag"]]},{id:"c-ss",name:"状态空间建模",x:380,y:40,deps:[],book:"胡寿松(现控)P10 例1-1",glossary:[["刚度","Kp 类比"],["阻尼","Kd 类比"]]},{id:"c-stm",name:"状态转移矩阵",x:380,y:130,deps:["c-ss"],book:"现控P45 例2-3",glossary:[["矩阵指数","e^At"],["零输入响应","Φ(t)x(0)"]]},{id:"c-ctrb",name:"能控能观判据",x:380,y:220,deps:["c-stm"],book:"现控P80 例3-1",glossary:[["能控性","controllability"],["秩判据","rank test"]]},{id:"c-pole",name:"极点配置",x:380,y:310,deps:["c-ctrb"],book:"现控P120 例4-2",glossary:[["状态反馈","u=-Kx"],["期望极点","desired poles"]]},{id:"c-obs",name:"观测器设计",x:560,y:220,deps:["c-pole"],book:"现控P150 例5-1",glossary:[["状态观测","observer"],["估计误差","e=x-x̂"]]},{id:"c-lyap",name:"李雅普诺夫",x:560,y:310,deps:["c-ctrb"],book:"现控P180 例6-1",glossary:[["渐近稳定","asymptotically stable"],["能量函数","V(x)"]]}],localQuestions:{"c-pole":[{lv:2,gen:function(){return{stem:"状态反馈极点配置的前提条件是系统（ ）",type:"choice",options:["A. 完全能控","B. 完全能观","C. 渐近稳定","D. 最小相位"],answer:"A",solution:"极点可任意配置 ⟌ 系统完全能控",trap:"能控↔极点配置，能观↔观测器，别记反"}}}],"c-ctrb":[{lv:2,gen:function(){return{stem:"n 阶线性定常系统完全能控的充要条件是能控性矩阵 [B AB ... Aⁿ⁻¹B] 的秩为（ ）",type:"choice",options:["A. n","B. n-1","C. 1","D. 0"],answer:"A",solution:"秩判据：rank(Qc) = n",trap:"能控用Qc，能观用Qo=[C;CA;...]，矩阵别写错"}}}],"c-tf":[{lv:2,gen:function(){var e=x.randInt(1,5);return{stem:"单位反馈系统开环传递函数 G(s) = "+e+"/[s(s+1)]，闭环特征方程为？",type:"solve",answer:"s² + s + "+e+" = 0",solution:"1+G(s)=0 → s(s+1)+"+e+"=0 → s²+s+"+e+"=0",trap:"分式合并三步法：先写分母s(s+1)，再加分子"+e}}}]}};Ee.数模电={modules:["模拟电子技术","数字电子技术","信号与系统"],textbook:"康华光《电子技术基础》+ 郑君里《信号与系统》",alertRule:{hardModule:"模拟电子技术",hardMilestone:"多级放大电路频率响应",learnPath:"基本放大电路 → 多级放大 → 频率响应"},milestoneLabel:"模电核心能力验证（独立完成{hard}）",topics:[{id:"ee-bjt",name:"BJT基本特性",tier:1,group:"模拟电子技术"},{id:"ee-amp",name:"基本放大电路",tier:1,group:"模拟电子技术"},{id:"ee-multistage",name:"多级放大电路",tier:2,group:"模拟电子技术"},{id:"ee-freq",name:"频率响应",tier:2,group:"模拟电子技术"},{id:"ee-feedback",name:"负反馈放大电路",tier:3,group:"模拟电子技术"},{id:"ee-opamp",name:"运算放大器应用",tier:3,group:"模拟电子技术"},{id:"ee-logic",name:"逻辑代数基础",tier:1,group:"数字电子技术"},{id:"ee-gate",name:"门电路与组合逻辑",tier:1,group:"数字电子技术"},{id:"ee-ff",name:"触发器与时序逻辑",tier:2,group:"数字电子技术"},{id:"ee-counter",name:"计数器与寄存器",tier:2,group:"数字电子技术"},{id:"ee-dac",name:"A/D与D/A转换",tier:3,group:"数字电子技术"},{id:"ss-lti",name:"LTI系统时域分析",tier:1,group:"信号与系统"},{id:"ss-ft",name:"傅里叶变换",tier:2,group:"信号与系统"},{id:"ss-lt",name:"拉普拉斯变换",tier:2,group:"信号与系统"},{id:"ss-z",name:"Z变换与离散系统",tier:3,group:"信号与系统"}],conceptGraph:[{id:"ee-bjt",name:"BJT特性",x:60,y:40,deps:[],book:"康华光 P30 例2-1",glossary:[["放大区","active region"],["饱和","saturation"]]},{id:"ee-amp",name:"基本放大",x:60,y:130,deps:["ee-bjt"],book:"康华光 P80 例3-2",glossary:[["静态工作点","Q point"],["偏置","bias"]]},{id:"ee-multistage",name:"多级放大",x:60,y:220,deps:["ee-amp"],book:"康华光 P150 例4-3",glossary:[["耦合方式","coupling"],["增益带宽积","GBW"]]},{id:"ee-freq",name:"频率响应",x:60,y:310,deps:["ee-multistage"],book:"康华光 P200 例5-1",glossary:[["上限频率","fH"],["波特图","Bode plot"]]},{id:"ee-feedback",name:"负反馈",x:60,y:400,deps:["ee-freq"],book:"康华光 P260 例6-2",glossary:[["深度负反馈","deep feedback"],["虚短虚断","virtual short/open"]]},{id:"ee-logic",name:"逻辑代数",x:380,y:40,deps:[],book:"阎石 P10 例1-1",glossary:[["真值表","truth table"],["卡诺图","Karnaugh map"]]},{id:"ee-gate",name:"组合逻辑",x:380,y:130,deps:["ee-logic"],book:"阎石 P80 例3-1",glossary:[["竞争冒险","hazard"],["编码器","encoder"]]},{id:"ee-ff",name:"时序逻辑",x:380,y:220,deps:["ee-gate"],book:"阎石 P180 例5-2",glossary:[["触发器","flip-flop"],["特性方程","characteristic eq"]]},{id:"ee-counter",name:"计数器",x:380,y:310,deps:["ee-ff"],book:"阎石 P230 例6-1",glossary:[["同步/异步","sync/async"],["模N计数","mod-N counter"]]},{id:"ss-lti",name:"LTI时域",x:560,y:40,deps:[],book:"郑君里 P20 例1-1",glossary:[["冲激响应","impulse response"],["卷积","convolution"]]},{id:"ss-ft",name:"傅里叶变换",x:560,y:130,deps:["ss-lti"],book:"郑君里 P90 例3-1",glossary:[["频谱","spectrum"],["傅里叶系数","Fourier coeff"]]},{id:"ss-z",name:"Z变换",x:560,y:250,deps:["ss-ft"],book:"郑君里 P200 例8-1",glossary:[["收敛域","ROC"],["零极点","zero-pole"]]}],localQuestions:{}};Ee[408]={modules:["数据结构","计算机组成原理","操作系统","计算机网络"],textbook:"严蔚敏《数据结构》+ 唐朔飞《计组》+ 汤小丹《OS》+ 谢希仁《计网》",alertRule:{hardModule:"计算机组成原理",hardMilestone:"流水线CPU设计",learnPath:"数据通路 → 流水线 → Cache"},milestoneLabel:"计组核心能力验证（独立完成{hard}）",topics:[{id:"ds-linear",name:"线性表",tier:1,group:"数据结构"},{id:"ds-stack",name:"栈和队列",tier:1,group:"数据结构"},{id:"ds-tree",name:"二叉树与遍历",tier:1,group:"数据结构"},{id:"ds-graph",name:"图论算法",tier:2,group:"数据结构"},{id:"ds-sort",name:"排序算法",tier:2,group:"数据结构"},{id:"ds-search",name:"查找与哈希",tier:2,group:"数据结构"},{id:"co-rep",name:"数据表示",tier:1,group:"计组"},{id:"co-cpu",name:"指令系统",tier:1,group:"计组"},{id:"co-datapath",name:"数据通路",tier:2,group:"计组"},{id:"co-pipeline",name:"流水线",tier:3,group:"计组"},{id:"co-cache",name:"Cache与虚拟存储",tier:3,group:"计组"},{id:"os-proc",name:"进程管理",tier:1,group:"操作系统"},{id:"os-mem",name:"内存管理",tier:2,group:"操作系统"},{id:"os-file",name:"文件系统",tier:2,group:"操作系统"},{id:"os-io",name:"I/O管理",tier:3,group:"操作系统"},{id:"cn-arch",name:"网络体系结构",tier:1,group:"计算机网络"},{id:"cn-data",name:"数据链路层",tier:2,group:"计算机网络"},{id:"cn-net",name:"网络层(IP)",tier:2,group:"计算机网络"},{id:"cn-trans",name:"传输层(TCP/UDP)",tier:3,group:"计算机网络"},{id:"cn-app",name:"应用层",tier:3,group:"计算机网络"}],conceptGraph:[{id:"ds-linear",name:"线性表",x:60,y:40,deps:[],book:"严蔚敏 P18 例2-1",glossary:[["顺序存储","sequential"],["链式存储","linked"]]},{id:"ds-stack",name:"栈/队列",x:60,y:130,deps:["ds-linear"],book:"严蔚敏 P40 例3-1",glossary:[["LIFO","后进先出"],["FIFO","先进先出"]]},{id:"ds-tree",name:"二叉树",x:60,y:220,deps:["ds-stack"],book:"严蔚敏 P80 例6-1",glossary:[["遍历","traversal"],["BST","二叉搜索树"]]},{id:"ds-graph",name:"图论",x:60,y:310,deps:["ds-tree"],book:"严蔚敏 P160 例7-1",glossary:[["邻接矩阵","adjacency matrix"],["最短路","shortest path"]]},{id:"ds-sort",name:"排序",x:60,y:400,deps:["ds-graph"],book:"严蔚敏 P220 例8-1",glossary:[["时间复杂度","O(nlogn)"],["稳定性","stability"]]},{id:"co-rep",name:"数据表示",x:340,y:40,deps:[],book:"唐朔飞 P20 例2-1",glossary:[["补码","two's complement"],["浮点","floating-point"]]},{id:"co-cpu",name:"指令系统",x:340,y:130,deps:["co-rep"],book:"唐朔飞 P80 例4-1",glossary:[["寻址方式","addressing"],["CISC/RISC","架构分类"]]},{id:"co-datapath",name:"数据通路",x:340,y:220,deps:["co-cpu"],book:"唐朔飞 P140 例5-1",glossary:[["单周期","single-cycle"],["多周期","multi-cycle"]]},{id:"co-pipeline",name:"流水线",x:340,y:310,deps:["co-datapath"],book:"唐朔飞 P190 例6-1",glossary:[["冒险","hazard"],["转发/旁路","forwarding"]]},{id:"os-proc",name:"进程",x:580,y:40,deps:[],book:"汤小丹 P80 例2-1",glossary:[["PCB","进程控制块"],["上下文切换","context switch"]]},{id:"os-mem",name:"内存管理",x:580,y:130,deps:["os-proc"],book:"汤小丹 P170 例4-1",glossary:[["分页","paging"],["TLB","快表"]]},{id:"os-file",name:"文件系统",x:580,y:220,deps:["os-mem"],book:"汤小丹 P280 例5-1",glossary:[["inode","索引节点"],["目录项","directory entry"]]}],localQuestions:{}};var Fo={math:[{id:"m-limit",name:"极限计算",tier:1,group:"高数"},{id:"m-mvt",name:"微分中值定理",tier:2,group:"高数"},{id:"m-subst",name:"定积分换元",tier:1,group:"高数"},{id:"m-improper",name:"反常积分判敛",tier:2,group:"高数"},{id:"m-multi",name:"多元微分",tier:1,group:"高数"},{id:"m-dint",name:"重积分",tier:1,group:"高数"},{id:"m-line",name:"曲线曲面积分",tier:2,group:"高数"},{id:"m-series",name:"级数求和",tier:3,group:"高数"},{id:"m-ode",name:"微分方程",tier:1,group:"高数"},{id:"m-det",name:"行列式计算",tier:1,group:"线代"},{id:"m-matrix",name:"矩阵运算",tier:1,group:"线代"},{id:"m-vector",name:"向量组相关性",tier:2,group:"线代"},{id:"m-eigen",name:"特征值/特征向量",tier:1,group:"线代"},{id:"m-quad",name:"二次型标准化",tier:2,group:"线代"},{id:"m-posdef",name:"正定判定",tier:2,group:"线代"},{id:"m-dist",name:"分布函数",tier:1,group:"概率"},{id:"m-exp",name:"期望方差",tier:1,group:"概率"},{id:"m-est",name:"参数估计",tier:2,group:"概率"},{id:"m-hypo",name:"假设检验",tier:3,group:"概率"}],ctrl:Ee.自控原理.topics,eng:[{id:"e-read-detail",name:"阅读·细节题",tier:1,group:"阅读"},{id:"e-read-main",name:"阅读·主旨题",tier:1,group:"阅读"},{id:"e-read-vocab",name:"阅读·词义猜测",tier:1,group:"阅读"},{id:"e-read-infer",name:"阅读·推断题",tier:2,group:"阅读"},{id:"e-read-attitude",name:"阅读·态度题",tier:2,group:"阅读"},{id:"e-cloze",name:"完形·逻辑衔接",tier:2,group:"完形"},{id:"e-new",name:"新题型·七选五/排序",tier:2,group:"新题型"},{id:"e-trans",name:"翻译·长难句",tier:2,group:"翻译"},{id:"e-big-desc",name:"大作文·图画描述",tier:1,group:"作文"},{id:"e-big-argue",name:"大作文·论证展开",tier:2,group:"作文"},{id:"e-big-lang",name:"大作文·语言升级",tier:3,group:"作文"},{id:"e-small",name:"小作文·书信格式",tier:1,group:"作文"}],pol:[{id:"p-my-wz",name:"马原·唯物论",tier:1,group:"马原"},{id:"p-my-bz",name:"马原·辩证法",tier:1,group:"马原"},{id:"p-my-rsh",name:"马原·认识论",tier:2,group:"马原"},{id:"p-my-lsw",name:"马原·历史唯物",tier:2,group:"马原"},{id:"p-my-zj",name:"马原·政经",tier:3,group:"马原"},{id:"p-mzt-thought",name:"毛中特·思想理论",tier:1,group:"毛中特"},{id:"p-mzt-new",name:"毛中特·新时代",tier:1,group:"毛中特"},{id:"p-mzt-eco",name:"毛中特·经济建设",tier:2,group:"毛中特"},{id:"p-sg-newdemo",name:"史纲·新民主主义革命",tier:1,group:"史纲"},{id:"p-sg-explore",name:"史纲·社会主义探索",tier:2,group:"史纲"},{id:"p-sx-value",name:"思修·价值观与道德",tier:1,group:"思修"},{id:"p-sx-law",name:"思修·法治素养",tier:2,group:"思修"},{id:"p-sz-hot",name:"时政·年度热点",tier:2,group:"时政"}]},xr=Ee.自控原理.conceptGraph.slice(),on={name:"自控原理",modules:Ee.自控原理.modules,textbook:Ee.自控原理.textbook,alertRule:Ee.自控原理.alertRule,localQuestions:Ee.自控原理.localQuestions,milestoneLabel:Ee.自控原理.milestoneLabel},Mc={1:{name:"必拿层",range:"100-110分",color:"#237804",icon:"🟢",rule:"要求零失误，错一题罚5道同类题"},2:{name:"拔高层",range:"110-125分",color:"#d48806",icon:"🟡",rule:"理解套路，建立题型-方法映射"},3:{name:"冲刺层",range:"125-130+分",color:"#cf1322",icon:"😴",rule:"战略性取舍，不恋战"}},Cc={数模电:"电子技术基础 数字电路 模拟电路",数电:"数字电路 数字电子技术",模电:"模拟电路 模拟电子技术",自控:"自动控制原理 自动控制理论",现控:"现代控制理论",电路:"电路分析 电路原理 电路基础",信号:"信号与系统",通原:"通信原理",dsp:"数字信号处理",电磁场:"电磁场与电磁波",微机:"微机原理 微型计算机原理",数据结构:"数据结构",os:"操作系统",计组:"计算机组成原理",计网:"计算机网络",408:"计算机学科专业基础 数据结构 计算机组成原理 操作系统 计算机网络",材力:"材料力学",理力:"理论力学",传热:"传热学",工热:"工程热力学",机设:"机械设计",机原:"机械原理",流力:"流体力学"},_r={hebut:{id:"hebut",name:"河北工业大学",tier:"211",code:"081100 控制科学与工程（学硕）",exam:"初试：897 自动控制原理（现控约35%）",reexam:"复试：F2801（过程控制/运动控制）",line:"近年复试线≈国家线偏上，专业课给分大方",ratio:"报录比约 4:1",pros:["专业设难度适中、给分友好","一忆愿保护较好","稳首选择"],cons:["地域（天津）实习资源弱于不海"],career:"京津津自动化/车企供应链就业够用",score:{diff:3,region:3,career:3},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},shu:{id:"shu",name:"上海大学",tier:"211",code:"控制科学与工程（学硕）",exam:"初试：836 自动控制理论（含现控，占比高）",reexam:"复试：微机原理与软硬件",line:"复试线高于河工大，对数学一要求高",ratio:"报录比约 6:1",pros:["上海地域+大厂实习机会多","836现控对口","复试微机匹配工程背景"],cons:["分数线更高，风险更大","数学一需≥120才有底气"],career:"上海大厂/外企自动化岗首选跳板",score:{diff:4,region:5,career:5},examKeywords:["自动控制理论","自动控制原理","自控","控制理论","控制"]},gdut:{id:"gdut",name:"广东工业大学",tier:"双非（控制A-）",code:"控制科学与工程（A-学科）",exam:"初试：自控原理（难度适中）",reexam:"复试：电路/微机方向可选",line:"近年录取约275分",ratio:"招生约120人，名额充足",pros:["控制学科A-，实力强","招生多、分数友好","珠三角就业极强"],cons:["学硕名额需核对当年简章"],career:"珠三角制造/硬件大厂直通",score:{diff:2,region:4,career:4},examKeywords:["自控原理","自动控制原理","自控","控制原理"]},futzu:{id:"futzu",name:"福州大学",tier:"211",code:"控制科学与工程",exam:"初试：自控原理",reexam:"复试：综合",line:"国家线附近",ratio:"约 3:1",pros:["211，稳首"],cons:["地域一般"],career:"福建区域就业",score:{diff:2,region:2,career:2},examKeywords:["自控原理","自动控制原理","自控"]},hfut:{id:"hfut",name:"合肥工业大学",tier:"211",code:"控制科学与工程",exam:"初试：自控（含现控）",reexam:"复试：微机/过控",line:"国家线上浮",ratio:"约 4:1",pros:["211，车企资源（蔚来/比亚迪合肥）"],cons:["热度上升中"],career:"长三角制造业",score:{diff:3,region:3,career:3},examKeywords:["自控","自动控制原理","控制原理","自动控制"]},bjut:{id:"bjut",name:"北京工业大学",tier:"211",code:"081100 控制科学与工程（学硕）",exam:"初试：821 自动控制原理",reexam:"复试：微机原理/计算机控制",line:"国家线偏上，北京地域加分",ratio:"约 5:1",pros:["北京211，地域优势明显","控制学科实力稳健"],cons:["北京公共课压分"],career:"京津津就业平台高",score:{diff:3,region:4,career:4},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},njust:{id:"njust",name:"南京理工大学",tier:"211",code:"081100 控制科学与工程",exam:"初试：873 自动控制理论",reexam:"复试：微机原理",line:"211中偏上，军工背景",ratio:"约 6:1",pros:["控制学科实力强","南京地域好","军工项目多"],cons:["竞争激烈"],career:"长三角军工/自动化",score:{diff:4,region:4,career:4},examKeywords:["自动控制理论","自动控制原理","自控","控制理论"]},hit:{id:"hit",name:"哈尔滨工业大学",tier:"985",code:"081100 控制科学与工程（A+学科）",exam:"初试：801 控制原理（含现控）",reexam:"复试：电路+控制系统",line:"985自划线，竞争激烈",ratio:"约 10:1",pros:["控制A+，全国顶尖","军工/航天项目资源"],cons:["难度极大","地域偏北"],career:"航天/军工/大厂核心岗",score:{diff:5,region:2,career:5},examKeywords:["控制原理","自动控制原理","自控","控制"]},neu:{id:"neu",name:"东北大学",tier:"985",code:"081100 控制科学与工程（A学科）",exam:"初试：839 自动控制原理",reexam:"复试：微机原理/计算机控制",line:"985中性价比高，东北公共课给分松",ratio:"约 5:1",pros:["控制学科A级，实力劲劲","分数线相对友好","东北公共课不压分"],cons:["地域偏北，就业辄射弱"],career:"自动化/流程工业",score:{diff:3,region:2,career:3},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},scut:{id:"scut",name:"华南理工大学",tier:"985",code:"081100 控制科学与工程",exam:"初试：813 自动控制原理",reexam:"复试：微机原理",line:"985，华南工科强校",ratio:"约 8:1",pros:["华南工科Top2","珠三角就业无敌"],cons:["分数线高"],career:"广深大厂/车企",score:{diff:4,region:5,career:5},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},xjtu:{id:"xjtu",name:"西安交通大学",tier:"985",code:"081100 控制科学与工程",exam:"初试：811 自动控制原理与信号处理",reexam:"复试：综合面试",line:"C9高校，竞争激烈",ratio:"约 8:1",pros:["C9名校光环","控制学科实力强"],cons:["分数线高","地域偏西"],career:"全国通用顶级学历",score:{diff:5,region:2,career:5},examKeywords:["自动控制原理","自控","控制原理","信号处理"]},tju:{id:"tju",name:"天津大学",tier:"985",code:"081100 控制科学与工程",exam:"初试：812 自动控制理论",reexam:"复试：检测技术/微机原理",line:"985，工科强校",ratio:"约 6:1",pros:["985工科底蕴深厚","天津生活成本低"],cons:["名额有限"],career:"京津津工科就业",score:{diff:4,region:3,career:4},examKeywords:["自动控制理论","自动控制原理","自控","控制理论"]},zju:{id:"zju",name:"浙汉大学",tier:"985",code:"081100 控制科学与工程（A+学科）",exam:"初试：845 自动控制原理",reexam:"复试：微机原理/传感器",line:"华五，A+学科，竞争极激烈",ratio:"约 12:1",pros:["华五名校，全国顶尖","控制A+，杭州就业强"],cons:["极难考"],career:"互联网/自动化顶尖岗",score:{diff:5,region:5,career:5},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},hust:{id:"hust",name:"华中科技大学",tier:"985",code:"081100 控制科学与工程（A-学科）",exam:"初试：829 自动控制原理",reexam:"复试：微机原理/计算机控制",line:"985，武汉工科强校",ratio:"约 7:1",pros:["工科实力阔厚","武汉生活成本适中"],cons:["竞争激烈"],career:"中部/全国工科就业",score:{diff:4,region:3,career:4},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},dlut:{id:"dlut",name:"大连理工大学",tier:"985",code:"081100 控制科学与工程",exam:"初试：854 自动控制原理",reexam:"复试：微机原理/检测技术",line:"985中偏友好",ratio:"约 5:1",pros:["985，大连环境好","分数相对温和"],cons:["东北就业辄射有限"],career:"东北/全国工科就业",score:{diff:3,region:2,career:3},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},seu:{id:"seu",name:"东南大学",tier:"985",code:"081100 控制科学与工程",exam:"初试：934 电路+自动控制原理",reexam:"复试：微机原理",line:"985，南京工科强校",ratio:"约 7:1",pros:["985，长三角就业强","控制学科稳健"],cons:["考电路+自控两门"],career:"长三角工科就业",score:{diff:4,region:4,career:4},examKeywords:["自动控制原理","自控","电路","控制原理"]},cqu:{id:"cqu",name:"重庆大学",tier:"985",code:"081100 控制科学与工程",exam:"初试：844 自动控制原理",reexam:"复试：微机原理",line:"985中偏友好",ratio:"约 5:1",pros:["985，重庆宜居","分数相对友好"],cons:["西部就业辄射有限"],career:"西南/全国工科就业",score:{diff:3,region:2,career:3},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},hdu:{id:"hdu",name:"杭州电子科技大学",tier:"双非（电子强校）",code:"080900 电子科学与技术 / 081000 信通",exam:"初试：841 数字电路 / 843 模拟电路（选一）",reexam:"复试：信号与系统/通信原理",line:"国家线附近，部分方向偏上",ratio:"约 4:1",pros:["电子/通信强势双非","杭州互联网就业资源好","专业课给分友好"],cons:["非985/211"],career:"长三角电子/半导体/IT",score:{diff:2,region:4,career:4},examKeywords:["数字电路","模拟电路","数电","模电","电子技术","数模电"]},uestc:{id:"uestc",name:"电子科技大学",tier:"985",code:"080900 电子科学与技术（A+） / 081000 信通（A+）",exam:"初试：858 信号与系统 / 813 电磁场",reexam:"复试：数字电路/模拟电路/通信原理",line:"985中偏上，电子/通信全国顶尖",ratio:"约 10:1",pros:["电子/通信双A+，全国Top2","成都生活成本低","军工/华为/大厂直通"],cons:["分数线极高","竞争其中激烈"],career:"全国电子/通信/半导体顶级就业",score:{diff:5,region:3,career:5},examKeywords:["信号与系统","数字电路","模拟电路","电子技术","电磁场","通信原理","数模电"]},xidian:{id:"xidian",name:"西安电子科技大学",tier:"211",code:"080900 电子科学与技术 / 081000 信通",exam:"初试：821 电路、信号与系统",reexam:"复试：数字电路/模拟电路/通信原理",line:"211中偏上，电子通信A+级实力",ratio:"约 8:1",pros:["电子通信学科实力211最强","西安生活成本低","华为/军工招聘大户"],cons:["非985，部刍单位卡385"],career:"全国电子/通信/军工/IT",score:{diff:4,region:2,career:5},examKeywords:["电路","信号与系统","数字电路","模拟电路","电子技术","通信原理","数模电"]},bupt:{id:"bupt",name:"北京邮业大学",tier:"211",code:"081000 信息与通信工程（A+）",exam:"初试：801 通信原理 / 802 电子电路",reexam:"复试：数字信号处理/计算机网络",line:"211中偏高，通信A+全国Top2",ratio:"约 8:1",pros:["通信A+，北京地域","互联网大厂校招重镇","行业认可度极高"],cons:["非985，体制内可能受限"],career:"互联网/通信/北京IT圈",score:{diff:4,region:5,career:5},examKeywords:["通信原理","电子电路","信号与系统","数字信号处理","数电","模电","数模电"]},njupt:{id:"njupt",name:"南京邮业大学",tier:"双一流",code:"081000 信息与通信工程",exam:"初试：801 通信原理 / 802 数字信号处理",reexam:"复试：数字电路/模拟电路",line:"双一流中温和，通信实力稳健",ratio:"约 5:1",pros:["通信特色双一流","南京地域好","运营商/华为大量招聘"],cons:["非985/211"],career:"长三角通信/IT",score:{diff:2,region:4,career:3},examKeywords:["通信原理","数字信号处理","数字电路","模拟电路","数模电"]},fudan:{id:"fudan",name:"复旦大学",tier:"985",code:"080900 电子科学与技术 / 微电子（A+）",exam:"初试：881 电子线路与集成电路设计 / 882 半导体器件",reexam:"复试：模拟电路/数字电路/半导体物理",line:"华五，微电子A+，全国顶尖",ratio:"约 12:1",pros:["微电子A+，华五名校","上海集成电路产业核心","学术/产业路径均顶级"],cons:["极难考"],career:"半导体/芯片设计/集成电路",score:{diff:5,region:5,career:5},examKeywords:["电子线路","集成电路","模拟电路","数字电路","半导体器件","数电","模电","数模电"]},thu:{id:"thu",name:"清华大学",tier:"985",code:"080900 电子科学与技术 / 集成电路（A+）",exam:"初试：832 半导体器件与电子电路",reexam:"复试：模拟集成电路/数字集成电路",line:"全国最高，A+学科",ratio:"约 15:1",pros:["全国Top1","集成电路A+","任何方向就业无忧"],cons:["难度天花板"],career:"全理半导体/芯片/学术界",score:{diff:5,region:5,career:5},examKeywords:["半导体器件","电子电路","集成电路","模拟电路","数字电路","数电","模电","数模电"]},sjtu:{id:"sjtu",name:"上海交通大学",tier:"985",code:"080900 电子科学与技术 / 集成电路",exam:"初试：819 信号系统与信号处理 / 874 半导体物理",reexam:"复试：模拟电路/数字电路",line:"华五，上海集成电路产业中心",ratio:"约 10:1",pros:["华五名校","上海芯片/半导体产业","大厂实习便利"],cons:["竞争激烈"],career:"半导体/集成电路/IT",score:{diff:5,region:5,career:5},examKeywords:["信号与系统","信号处理","半导体物理","模拟电路","数字电路","集成电路","数模电"]}};function Pc(e,t){if(t=t||8,!e||!e.trim())return[];var n=e.trim().toLowerCase(),r=Cc[n]||n,s=r.split(/\s+/).filter(function(c){return c.length>0});r!==n&&s.push(n);var o=[],i=[];if(Object.keys(_r).forEach(function(c){var l=_r[c];i.push(l);for(var u=l.examKeywords||[],f=0,d=0;d<s.length;d++)for(var m=s[d],p=0;p<u.length;p++){var y=u[p].toLowerCase(),h=0;if(m===y)h=100;else if(m.indexOf(y)>=0||y.indexOf(m)>=0)h=60;else{for(var g=0,v=0;v<m.length;v++)y.indexOf(m[v])>=0&&g++;g>=2&&(h=20+g*5)}h>f&&(f=h)}f>0&&o.push({school:l,score:f})}),o.length>0)return o.sort(function(c,l){return l.score-c.score}),o.slice(0,t).map(function(c){return c.school});var a={985:3,211:2};return i.sort(function(c,l){var u=a[(c.tier||"").replace(/[^985211]/g,"")]||1,f=a[(l.tier||"").replace(/[^985211]/g,"")]||1;return f!==u?f-u:(c.name||"").localeCompare(l.name||"")}),i.slice(0,t)}var Ko=[{icon:"🔧",title:"初试前绝对禁止硬件项目",desc:"禁止PCB、禁止B站硬件视频、禁止STM32新工程、工程历程已足够，初试前任何硬件投入都是在偷数学的分数。"},{icon:"📋",title:"复试科目铁律",desc:"复试科目必须根据你选的目标院确定，不能盲目选择。"},{icon:"✍️",title:"数学防呆强制执行",desc:"符号前置、分式三步法（分母→分子→计算）、草稿分区（左乱草/右正稿）。不是建议，是流程。"},{icon:"⏰",title:"政治时间红线",desc:"9月前 ≤45分钟/天，11月前 ≤1.5小时/天。政治是提分效率最低的科目，禁止挤占数学/专业课。"},{icon:"🎯",title:"拒绝二战思维",desc:"所有规划基于一忆愿上岸。不许说“大不了二战”，这个词在本系统是违禁词。"}],Vo=["草稿纸已分区（左侧乱草 / 右侧正稿）","负号已前置处理，不留在后面","分式合并：先写分母 → 抄分子 → 去括号","积分因子指数号号已反向检查",'卡3分钟已标记"？"跳过，不倒推'],jc=["符号前置，负号立即提到最前面","分式合并三步法（分母→分子→计算）","草稿分区：左侧乱草，右侧正稿"],Qo=["PCB","pcb","硬件","B站","b站","Bilibili","bilibili","STM32","stm32","单片机","焊","电路板","打板"],Nc=[{w:"subject",com:"科目；主题",rare:"受试者；使从识",ex:"The subjects were tested. 受试者接受了测试。"},{w:"novel",com:"小说",rare:"新颖的",ex:"a novel approach 一种新颖的方法"},{w:"address",com:"地址",rare:"处理；致词；探讨",ex:"address the problem 处理该问题"},{w:"issue",com:"问题",rare:"发行；流出",ex:"issue a statement 发表声明"},{w:"practice",com:"练习",rare:"惯例；执业",ex:"common practice 通行惯例"},{w:"term",com:"学期；术语",rare:"条款；(pl.)关系",ex:"on good terms 关系良好"},{w:"figure",com:"数字；人物",rare:"认为；理解(figure out)",ex:"I figure that... 我认为…"},{w:"course",com:"课程",rare:"航向；进程",ex:"change course 改变航向"},{w:"plant",com:"植物",rare:"工厂",ex:"a power plant 发电厂"},{w:"board",com:"木板",rare:"事会；登上(车船机)",ex:"the board of directors 董事会"},{w:"rate",com:"比率",rare:"评价；等级",ex:"be highly rated 备受好评"},{w:"sound",com:"声音",rare:"健全的；合理的",ex:"sound advice 合理的建议"},{w:"mean",com:"意思是",rare:"吝啬的；平均的",ex:"the mean temperature 平均温度"},{w:"fine",com:"好的",rare:"罚款；细微的",ex:"a heavy fine 高额罚款"},{w:"bill",com:"账单",rare:"法案；纸币",ex:"pass the bill 通过法案"},{w:"firm",com:"坚固的",rare:"公司",ex:"a law firm 律所"},{w:"game",com:"游戏",rare:"猎物；博弈",ex:"big game 大型猎物"},{w:"slip",com:"滑倒",rare:"纸条；疏忽",ex:"a slip of the pen 笔误"},{w:"policy",com:"政策",rare:"保单",ex:"an insurance policy 保险单"},{w:"yield",com:"产量",rare:"屈服；让行",ex:"yield to pressure 屈服于压力"},{w:"secure",com:"安全的",rare:"获得；争取",ex:"secure a deal 达成协议"},{w:"conduct",com:"行为",rare:"实施；指挥；传导",ex:"conduct an experiment 做实验"},{w:"account",com:"账户",rare:"解释(account for)；叙述",ex:"account for 40% 占40%"},{w:"approach",com:"接近",rare:"方法；处理",ex:"a new approach to X 解决X的新方法"},{w:"concern",com:"关心",rare:"公司；事关；担忧",ex:"a going concern 持续经营企业"},{w:"present",com:"现在；礼物",rare:"呈现；提交",ex:"present findings 呈现研究结果"},{w:"content",com:"内容",rare:"满足的；使满意",ex:"be content with 满意于"},{w:"object",com:"物体",rare:"反对",ex:"object to the plan 反对该计划"},{w:"produce",com:"生产",rare:"农产品(名词)",ex:"fresh produce 新鲜农产品"},{w:"minute",com:"分钟",rare:"微小的",ex:"minute details 细枝末节"}],Lc={integral:{name:"积分计算",steps:[{name:"识别积分类型",hint:"换元/分部/有理式/三角？写下判断依据"},{name:"选择方法并写出首步",hint:"写出换元式或分部u,v"},{name:"执行换元/分部",hint:"⚠️ 负号前置！每一步检查符号"},{name:"回代为原变量",hint:"上下限是否同步变换？"},{name:"求导验证结果",hint:"对结果求导应等于被积函数"}],checks:[{key:"sign",label:"负号检查",desc:"全文搜索负号位置，确认无后置负号"},{key:"verify",label:"求导验证",desc:"结果求导 = 被积函数"}]},ode:{name:"微分方程",steps:[{name:"判定方程类型",hint:"一阶线性/可分离/齐次/二阶常系数？"},{name:"写出标准形",hint:"y'+P(x)y=Q(x)"},{name:"计算积分因子",hint:"⚠️ μ=e^∫P dx，指数符号必须反向检查！"},{name:"求解并写出通解",hint:"别忘 +C"},{name:"代回验证",hint:"代入原方程验证成立"}],checks:[{key:"factor",label:"积分因子符号反查",desc:"e 的指数符号与 P(x) 一致，无漏负号"},{key:"fraction",label:"分式三步法验证",desc:"分母→分子→计算，逐步核对"}]},matrix:{name:"矩阵运算",steps:[{name:"明确运算目标",hint:"求逆/特征值/秩/对角化？"},{name:"写出初等变换第一步",hint:"行变换标记清楚 r1↔r2 等"},{name:"逐步运算",hint:"⚠️ 每步只做一个变换，禁止心算跳步"},{name:"得到结果",hint:"特征值写全(含重根)"},{name:"验算",hint:"A·A⁻¹=E 或 |A-λE|=0 回代"}],checks:[{key:"sign",label:"行列式符号检查",desc:"换行/提公因子产生的符号已处理"}]},series:{name:"级数",steps:[{name:"判定级数类型",hint:"正项/交错/幂级数？"},{name:"选择判收法",hint:"比值/根值/比较/莱布尼兼"},{name:"计算极限",hint:"⚠️ 分式三步法：分母→分子→计算"},{name:"得出结论",hint:"收敛域端点单独讨论！"}],checks:[{key:"fraction",label:"分式三步法验证",desc:"极限计算中的分式无漏分母"}]}};function Yr(){var e="";try{var t=typeof w<"u"&&w.get();t&&t.settings&&t.settings.targetSchool&&t.settings.targetSchool!=="undecided"&&(e=t.settings.targetSchool)}catch{}var n=e?"（决定冲"+e+"）":"";return[{id:"octMath",date:"10月底",title:"数学真题模拟 ≥120分"+n,deadline:"10-31"},{id:"novProf",date:"11月底",title:"专业课真题二刲完成",deadline:"11-30"},{id:"decPol",date:"12月",title:"政治大题背诵启动",deadline:"12-01"}]}var Ar=Yr(),Dc={deepseek:{name:"DeepSeek",endpoint:"https://api.deepseek.com/v1/chat/completions",model:"deepseek-chat",hint:"platform.deepseek.com 申请 API Key"},kimi:{name:"Kimi (月之暗)",endpoint:"https://api.moonshot.cn/v1/chat/completions",model:"moonshot-v1-8k",hint:"platform.moonshot.cn 申请 API Key"},qwen:{name:"通义千问",endpoint:"https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",model:"qwen-plus",hint:"阿里云百炼平台申请 API Key"},zhipu:{name:"智谱 GLM",endpoint:"https://open.bigmodel.cn/api/paas/v4/chat/completions",model:"glm-4-flash",hint:"bigmodel.cn 申请 API Key（有免费额度）"},custom:{name:"自定义 (OpenAI兼容)",endpoint:"",model:"",hint:"任何 OpenAI 兼容接口均可"}};function Yo(e){e||(e="自控原理");var t=Ee[e];if(t)return Tr(e,t),!0;try{if(typeof w<"u"){var n=w.get().majorData;if(n&&n[e])return Tr(e,n[e]),!0}}catch{}return!1}function Tr(e,t){t.topics&&t.topics.length>0&&(Fo.ctrl=t.topics),t.conceptGraph&&t.conceptGraph.length>0&&(xr.length=0,t.conceptGraph.forEach(function(r){xr.push(r)})),on={name:e,modules:t.modules||[],textbook:t.textbook||e+"教材",alertRule:t.alertRule||{},localQuestions:t.localQuestions||{},milestoneLabel:t.milestoneLabel||"专业课核心能力验证（独立完成{hard}）"};var n=Yr();Ar.length=0,n.forEach(function(r){Ar.push(r)})}function Bc(e,t){if(!F.configured())return Promise.resolve(null);var n=`你是考研专业课知识体系架构师。
用户的专业课是「`+e+`」，请为这门课构建完整的考研知识体系。
返回严格 JSON（不带 markdown 代码块），字段如下：
{
  "modules": ["章节1", "章节2", ...],       // 该专业的主要章节（3-6个）
  "textbook": "推荐教材",                     // 最常用的教材书名
  "alertRule": {
    "hardModule": "最难章节名",           // 最难模块，用于里程碑描述
    "hardMilestone": "必须掌握的核心能力",
    "learnPath": "章节A → 章节B → 章节C"  // 推荐学习路径
  },
  "topics": [
    {"id":"p1","name":"考点名","tier":1,"group":"章节1"},
    {"id":"p2","name":"考点名","tier":2,"group":"章节1"},
    ...
  ],  // 8-18个考点；tier=1必拿层(100-110)、tier=2拔高层(110-125)、tier=3冲刺层(125+)；group按章节分组
  "conceptGraph": [
    {"id":"p1","name":"节点名","x":60,"y":40,"deps":[],"book":"教材 PXX 例X-Y","glossary":[["中文","english"]]},
    ...
  ]   // 6-12个节点，id与topics.id对应；x/y为SVG坐标；deps为前置节点id数组
}

要求：
1. modules 必须是该专业的真实章节，不能是通用名称
2. topics 覆盖该专业考研的核心知识点，tier分布合理
3. conceptGraph 反映真实的前置依赖关系
4. 只返纯 JSON，不要加注释`;function r(f){var d=(f||"").trim(),m=d.match(/```(?:json)?\s*([\s\S]*?)```/);if(m)return m[1].trim();var p=d.indexOf("{");if(p===-1)return"";for(var y=0,h=!1,g=!1,v=-1,S=p;S<d.length;S++){var _=d.charAt(S);if(g){g=!1;continue}if(_==="\\"){g=!0;continue}if(_==='"'){h=!h;continue}if(!h){if(_==="{")y++;else if(_==="}"&&(y--,y===0)){v=S+1;break}}}return v>p?d.slice(p,v):""}function s(f){var d=f;return d=d.replace(/\/\/(?=(?:[^"']*(?:"[^"]*"|'[^']*'))*[^"']*$)[^\n]*/g,""),d=d.replace(/\/\*[\s\S]*?\*\//g,""),d=d.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g,'"$1"'),d=d.replace(/,\s*([}\]])/g,"$1"),d=d.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*:)/g,'"$2"$3'),d=d.replace(/[\x00-\x09\x0b\x0c\x0e-\x1f]/g," "),d}function o(f){var d=r(f);if(!d)return null;var m,p;try{m=JSON.parse(d)}catch{}try{m||(p=JSON.parse(s(d)))}catch{}var y=m||p;return y?Fe.repairMangledLatex(y):null}var i=1,a=0,c=null;function l(f){var d=f&&f.message||"";return!!(/HTTP\s*5\d{2}/.test(d)||/Failed to fetch|NetworkError|TypeError.*network|Load failed|abort/i.test(d)||/timeout|timed? out|ETIMEDOUT/i.test(d)||f instanceof DOMException||f&&f.name==="AbortError"||/HTTP\s*(429|403)/.test(d))}function u(){a++;var f=a===1?n:n+`

【重要】上次返回的内容无法解析为有效 JSON。请务必：只输出一个标准 JSON 对象，不要任何解释文字、不要 markdown 标记、不要注释、不要尾逗号。直接以 { 开头、以 } 结尾。`;if(a>1)try{var d=document.getElementById("gm-status");d&&(d.textContent=x.icon("refresh")+" 第 "+a+" 次尝试生成中…")}catch{}return F.chatStream(f,"请按上述要求生成。",function(m,p){t&&t(m||p||"")},null,{cache:!1}).then(function(m){var p=o(m);if(p){if(!p.modules||!Array.isArray(p.topics))throw new Error("缺少 modules/topics");return p.topics.forEach(function(y,h){y.id||(y.id="gen-"+h)}),p.conceptGraph&&p.conceptGraph.forEach(function(y,h){y.id||(y.id="cg-"+h)}),typeof w<"u"&&w.update(function(y){y.majorData||(y.majorData={}),y.majorData[e]=p}),Tr(e,p),p}return a<=i?(console.warn("[DB] AI 专业数据 JSON 解析失败，第 "+a+" 次重试…(原始长度:"+(m||"").length+")"),u()):(console.warn("[DB] AI 生成专业数据解析最终失败。原始响应前200字符:",(m||"").slice(0,200)),c=new Error("AI 返回内容无法解析为有效 JSON"),null)}).catch(function(m){if(console.warn("[DB] AI 生成专业请求失败(第"+a+"次):",m.message),c=m,a<=i&&l(m))return console.warn("[DB] 检测到可重试错误，将重试…"),u();throw m})}return u().catch(function(f){throw f||c||new Error("未知错误")})}function qc(){try{if(typeof w>"u")return;var e=w.get();if(e&&e.settings&&e.settings.examConfig){var t=$o(e.settings.examConfig);Object.keys(t).forEach(function(r){Uo[r]=t[r]});var n=e.settings.examConfig.profName||"自控原理";Yo(n),Wo(n)}}catch{}}function Wo(e){try{if(typeof w>"u"||on.name!==e)return;var t=on.modules||[];if(!t.length)return;var n=w.get(),r=n.progress&&n.progress.ctrl&&n.progress.ctrl.modules||{},s=Object.keys(r),o=s.length===t.length&&t.every(function(a){return r.hasOwnProperty(a)});if(o)return;var i={};t.forEach(function(a){i[a]=r[a]||0}),w.update(function(a){a.progress.ctrl.modules=i})}catch{}}function Rc(){return on}function Jc(){try{var e=w.get().settings.redline.items;if(Array.isArray(e)&&e.length)return e}catch{}return Ko}function Hc(){try{var e=w.get().settings.redline.checklist;if(Array.isArray(e)&&e.length)return e}catch{}return Vo}function Gc(){var e=Qo.slice();try{var t=(w.get().settings.redline.keywords||"").split(/[,，\s]+/).map(function(n){return n.trim()}).filter(Boolean);e=e.concat(t)}catch{}return e}function zc(){try{var e=w.get().settings.coachProfile;if(e&&e.mathWeak)return e}catch{}return{mathWeak:"符号错误、分式漏分母、积分因子符号反",distractions:"硬件项目、B站、游戏",redlineNote:"“二战”是违禁词"}}function Uc(){try{var e=w.get().settings.scheduler;if(e)return{useAI:e.useAI!==!1,mathAccThreshold:e.mathAccThreshold||70,idleDays:e.idleDays||3,signWeekThreshold:e.signWeekThreshold||3,signForceCount:e.signForceCount||5,polCap:e.polCap||2,routine:e.routine||"normal",dayHours:e.dayHours||6,hardHours:e.hardHours||4,reviewOn:e.reviewOn!==!1,reviewCap:e.reviewCap||2,adjustOn:e.adjustOn!==!1}}catch{}return{useAI:!0,mathAccThreshold:70,idleDays:3,signWeekThreshold:3,signForceCount:5,polCap:2,routine:"normal",dayHours:6,hardHours:4,reviewOn:!0,reviewCap:2,adjustOn:!0}}function $c(){try{var e=w.get().settings.targetScores;if(e&&e.math)return e}catch{}return{math:130,prof:135,eng:70,pol:65}}var Er="kaoyan2026_schedplan";function Fc(){try{return JSON.parse(localStorage.getItem(Er)||"null")}catch{return null}}function Kc(e){try{e?localStorage.setItem(Er,JSON.stringify(e)):localStorage.removeItem(Er)}catch{}}const Y={SUBJECTS:Uo,MISTAKE_TYPES:{sign:{name:"符号错误",color:"#cf1322"},fraction:{name:"分式漏分母",color:"#237804"},concept:{name:"概念混淆",color:"#2f54eb"},integral:{name:"积分因子",color:"#722ed1"},careless:{name:"粗心大意",color:"#d48806"},other:{name:"其他",color:"#8c8c8c"}},TOPICS:Fo,TIERS:Mc,CONCEPT_GRAPH:xr,SCHOOLS:_r,RED_LINES:Ko,FOOLPROOF_CHECKLIST:Vo,FOOLPROOF_REMIND:jc,HARDWARE_KEYWORDS:Qo,VOCAB:Nc,INSPECTOR_TYPES:Lc,MILESTONES:Ar,AI_PRESETS:Dc,MATH_VARIANTS:kr,ENG_VARIANTS:Sr,getActiveSubjects:$o,syncSubjects:qc,recommendSchools:Pc,MAJOR_REGISTRY:Ee,loadMajorData:Yo,generateMajorAI:Bc,getActiveMajor:Rc,reconcileProgressModules:Wo,getMilestones:Yr,activeMajor:function(){return on},redlineItems:Jc,redlineChecklist:Hc,redlineKeywords:Gc,coachProfile:zc,schedulerConfig:Uc,targetScores:$c,readSchedulerPlan:Fc,writeSchedulerPlan:Kc};function Wr(){try{return Y.getActiveMajor().name||"专业课"}catch{return"专业课"}}function Xr(e){try{return window.AiMemory?window.AiMemory.digest(e):""}catch{return""}}function Ks(){const e=Wr(),t=(function(){try{return Y.coachProfile()}catch{return null}})()||{mathWeak:"数学计算易错",distractions:"分心/畏难",redlineNote:"“二战”是违禁词"},n=Xr();return"你是一名严厉的2026考研教练，服务对象是一名考研考生，专业课为「"+e+"」。其目标：公共课高分、专业课高分，一志愿上岸拒绝二战。其致命弱点："+t.mathWeak+"、偶有"+t.distractions+"冲动。"+(n?`
`+n+`
`:"")+"回复要求：1) 直接、犀利、不灌鸡汤；2) 优先指出风险与防呆措施；3) 建议必须落到具体章节/题量/时间；4) 发现"+t.redlineNote+"，立即引用红线禁令制止；5) 用简体中文，200-400字。"}const Xo="必须只输出 JSON，不要任何多余文字、不要markdown代码块。",Zo='"diagram":"题目需要配图时输出一段 SVG 代码字符串（不需要图时填 ""）。只能用 SVG，不要用 Mermaid 或其他语法。\\n硬性画法规范（务必遵守，否则图会很难看）：\\n1) 根标签必须为 <svg xmlns=\\\\"http://www.w3.org/2000/svg\\\\" viewBox=\\\\"0 0 320 240\\\\">，所有元素坐标必须落在 viewBox 内并留 20px 以上边距。\\n2) 建坐标系时统一取原点像素 O=(40,200)，x 正方向向右、y 正方向向上（即逻辑点 (a,b) → 像素 (40+a*S, 200-b*S)，S 为每单位像素数，自行选 S 使图形占满画布且不越界）。先把每个关键点的像素值算出来再写，不要凭感觉写坐标。\\n3) 坐标轴用 stroke=\\\\"#999\\\\" stroke-width=\\\\"1\\\\" 的直线，末端加小三角箭头；轴末标 x / y，原点标 O。\\n4) 阴影区域用 <polygon> 或 <path>，fill=\\\\"#4a90d9\\\\" fill-opacity=\\\\"0.18\\\\" stroke=\\\\"#2c6cb0\\\\" stroke-width=\\\\"1.5\\\\"。\\n5) 曲线用 <path d=\\\\"M ... L ...\\\\">，按函数在 8~20 个采样点上真实算出坐标再连线，禁止随手写贝塞尔。\\n6) 所有 <text> 用 font-size=\\\\"12\\\\" 或 13，短标签（如 (1,0)、x+y=1、区域D），文字必须避开线条且不出界。\\n示例（区域 D：x≥0, y≥0, x+y≤1，取 S=160）：\\n<svg xmlns=\\\\"http://www.w3.org/2000/svg\\\\" viewBox=\\\\"0 0 320 240\\\\"><line x1=\\\\"40\\\\" y1=\\\\"200\\\\" x2=\\\\"290\\\\" y2=\\\\"200\\\\" stroke=\\\\"#999\\\\" stroke-width=\\\\"1\\\\"/><polygon points=\\\\"290,200 282,196 282,204\\\\" fill=\\\\"#999\\\\"/><line x1=\\\\"40\\\\" y1=\\\\"200\\\\" x2=\\\\"40\\\\" y2=\\\\"20\\\\" stroke=\\\\"#999\\\\" stroke-width=\\\\"1\\\\"/><polygon points=\\\\"40,20 36,28 44,28\\\\" fill=\\\\"#999\\\\"/><polygon points=\\\\"40,200 200,200 40,40\\\\" fill=\\\\"#4a90d9\\\\" fill-opacity=\\\\"0.18\\\\" stroke=\\\\"#2c6cb0\\\\" stroke-width=\\\\"1.5\\\\"/><text x=\\\\"294\\\\" y=\\\\"204\\\\" font-size=\\\\"12\\\\">x</text><text x=\\\\"32\\\\" y=\\\\"18\\\\" font-size=\\\\"12\\\\">y</text><text x=\\\\"26\\\\" y=\\\\"214\\\\" font-size=\\\\"12\\\\">O</text><text x=\\\\"196\\\\" y=\\\\"216\\\\" font-size=\\\\"12\\\\">(1,0)</text><text x=\\\\"10\\\\" y=\\\\"40\\\\" font-size=\\\\"12\\\\">(0,1)</text><text x=\\\\"88\\\\" y=\\\\"160\\\\" font-size=\\\\"13\\\\" fill=\\\\"#2c6cb0\\\\">区域 D</text><text x=\\\\"150\\\\" y=\\\\"96\\\\" font-size=\\\\"12\\\\">x+y=1</text></svg>\\n流程/框图类题目同样用 SVG 画（矩形 + 箭头 + 文字），不要输出 Mermaid。';function Vc(){const e=Wr(),t=Xr(400);let n="";try{const r=window.AiTools;r&&r.enabled&&r.enabled()?n='"diagram":""(留空，不要再输出 SVG),"diagramNote":"配图说明(可空,如:函数f(x)=x²-2在[-2,3]的图像,标出零点)",\\n配图规则：几何/函数图像/积分区域等需要图形的题，先调用 python_exec 用 matplotlib 画出精确图形（figsize≈(4,3)，坐标轴/刻度/图例齐全，关键点标注），图会自动作为题目配图收录；JSON 里严禁再输出 SVG 代码字符串。\\n':n=Zo+'"}'}catch{n=""}return"你是考研数学 / "+e+" 出题官。根据用户给出的考点、层级、薄弱错误类型，出1道题。"+(t?`参考考生记忆，优先针对其长期弱点命题：
`+t+`
`:"")+Xo+'格式：{"stem":"题干（公式用纯文本，如 ∫(0到1) x dx）","type":"choice|solve","options":["A. ...","B. ...","C. ...","D. ..."](仅choice需要),"answer":"标准答案","solution":"分步详解（标出关键步骤）","trap":"本题最易踩的坑（符号/分母/积分因子/概念）",'+n+"题目必须贴合考研难度，层级越高越综合。矩阵/行列式必须用LaTeX语法输出（用$包裹）：如$\\begin{vmatrix}1&2\\\\3&4\\end{vmatrix}$，不要用[[1,2],[3,4]]文本格式。"}const Qc="你是考研阅卷老师，极其严格，按步骤给分。根据题目、标准答案、学生作答，输出判卷结果。"+Xo+'格式：{"score":0-100整数,"verdict":"对|部分对|错","steps":[{"point":"采分点","got":true|false,"note":"评语"}],"errorType":"sign|fraction|integral|concept|careless|other|none","comment":"一句话点评（指出最致命问题）"}。若学生跳步、符号错误、漏分母，即使答案碰巧对也要扣分并标记对应errorType。';function Zr(e){return!!(e&&e.endpoint&&e.key&&e.model)}(function(){try{const t=w.get().ai;(!t.apis||!t.apis.length)&&t.endpoint&&t.key&&w.update(function(n){if(n.ai.apis&&n.ai.apis.length)return;const r=Y.AI_PRESETS[n.ai.preset]&&Y.AI_PRESETS[n.ai.preset].name||"接口1",s={id:"api_"+Date.now(),name:r,endpoint:n.ai.endpoint,key:n.ai.key,model:n.ai.model};n.ai.apis=[s],n.ai.activeApi=s.id})}catch{}})();function Yc(){return(w.get().ai.apis||[]).slice()}function jt(){const e=w.get().ai,t=e.apis||[];let n=null;for(let r=0;r<t.length;r++)if(t[r].id===e.activeApi){n=t[r];break}return n||(n=t.filter(Zr)[0]||t[0]),n||{id:"",name:"默认",endpoint:e.endpoint,key:e.key,model:e.model}}function es(e){const t=e.ai.apis||[];let n=null;for(let r=0;r<t.length;r++)if(t[r].id===e.ai.activeApi){n=t[r];break}n||(n=t[0]),n&&(e.ai.endpoint=n.endpoint,e.ai.key=n.key,e.ai.model=n.model)}function Wc(e){let t=null;return w.update(function(n){n.ai.apis=n.ai.apis||[];let r=-1;for(let o=0;o<n.ai.apis.length;o++)if(e.id&&n.ai.apis[o].id===e.id){r=o;break}r>=0?n.ai.apis[r]=e:(e.id="api_"+Date.now()+"_"+Math.floor(Math.random()*1e3),n.ai.apis.push(e));let s=!1;for(let o=0;o<n.ai.apis.length;o++)if(n.ai.apis[o].id===n.ai.activeApi){s=!0;break}s||(n.ai.activeApi=e.id),es(n),t=e}),t}function Xc(e){w.update(function(t){t.ai.apis=(t.ai.apis||[]).filter(function(n){return n.id!==e}),t.ai.activeApi===e&&(t.ai.activeApi=t.ai.apis.length?t.ai.apis[0].id:""),es(t),t.ai.apis.length||(t.ai.endpoint="",t.ai.key="",t.ai.model="")})}function Zc(e,t){w.update(function(n){const r=n.ai.apis||[];let s=-1;for(let a=0;a<r.length;a++)if(r[a].id===e){s=a;break}const o=s+t;if(s<0||o<0||o>=r.length)return;const i=r[s];r[s]=r[o],r[o]=i})}function ei(e,t){let n=null;return w.update(function(r){const s=r.ai.apis||[];for(let o=0;o<s.length;o++)if(s[o].id===e){n=s[o];break}n&&(r.ai.activeApi=e,es(r))}),n&&t&&window.Toast&&window.Toast.show("⚡ AI 接口已自动切换到「"+n.name+"」","info",4e3),n}function el(){const e=w.get().ai,t=jt();if(e.autoSwitch===!1)return[t];const n=(e.apis||[]).filter(function(r){return Zr(r)&&r.id!==t.id});return[t].concat(n)}function tl(e){const n=(e&&e.message||"").match(/^HTTP (\d{3})/);if(n){const r=+n[1];return r===401||r===403||r===408||r===429||r>=500}return!0}function ts(e){const t=el();let n=0;function r(){const s=t[n];return e(s).then(function(o){if(n>0&&s.id)try{ei(s.id,!0)}catch(i){console.warn("[AI] 切换持久化失败（不影响本次结果）",i)}return o}).catch(function(o){if(o&&o.aborted)throw o;if(n<t.length-1&&tl(o))return console.warn("[AI] 接口「"+(s.name||s.endpoint)+"」失败："+(o.message||o)+"，自动切换到「"+t[n+1].name+"」重试…"),n++,r();throw o})}return r()}const nl=3e4;function ns(e,t,n,r){if(typeof AbortController>"u")return fetch(e,t);const s=new AbortController;t.signal=s.signal;const o=n||nl,i=setTimeout(function(){s.abort()},o);return r&&(r.aborted?s.abort():r.addEventListener("abort",function(){s.abort()},{once:!0})),fetch(e,t).then(function(a){return clearTimeout(i),a},function(a){if(clearTimeout(i),a&&a.name==="AbortError")throw r&&r.aborted?Object.assign(new Error("已取消"),{aborted:!0}):new Error("连接超时："+Math.round(o/1e3)+" 秒内未收到响应（视觉模型+思考模式可能需要更长时间，请重试或暂时关闭思考模式）");let c=a&&a.message||"网络错误";throw/Failed to fetch|ERR_NETWORK|ERR_CONNECTION/i.test(c)&&(c="网络连接失败（请检查网络或 API 地址是否可达）"),new Error(c)})}const an="kaoyan2026_ai_cache_v1",Vs=60,rl=2e4;function ti(){const e=w.get().ai;return{on:e.cacheOn!==!1,ttlMs:(e.cacheTTL>0?e.cacheTTL:360)*6e4}}function rs(){try{return JSON.parse(localStorage.getItem(an))||{}}catch{return{}}}function Or(e){try{localStorage.setItem(an,JSON.stringify(e))}catch{try{localStorage.removeItem(an)}catch{}}}function ss(e,t){const n=(e||"")+"|"+JSON.stringify(t);let r=2166136261;for(let s=0;s<n.length;s++)r^=n.charCodeAt(s),r=r+((r<<1)+(r<<4)+(r<<7)+(r<<8)+(r<<24))>>>0;return r.toString(16)+"_"+n.length}function os(e){const t=ti();if(!t.on||!e)return null;const n=rs(),r=n[e];return r?Date.now()-r.t>t.ttlMs?(delete n[e],Or(n),null):(r.h=(r.h||0)+1,r.u=Date.now(),Or(n),console.log("[AI] ✓ 缓存命中（第"+r.h+"次复用，省一次调用）key="+e),r.v):null}function is(e,t){if(!ti().on||!e||typeof t!="string"||!t||t.length>rl)return;const r=rs();r[e]={v:t,t:Date.now(),u:Date.now(),h:0};const s=Object.keys(r);if(s.length>Vs){s.sort(function(o,i){return(r[o].u||0)-(r[i].u||0)});for(let o=0;o<s.length-Vs;o++)delete r[s[o]]}Or(r)}function sl(){const e=rs(),t=Object.keys(e);let n=0,r=0,s=0;t.forEach(function(o){n+=e[o].h||0,s+=(e[o].h||0)*(e[o].v||"").length});try{r=(localStorage.getItem(an)||"").length}catch{}return{entries:t.length,hits:n,kb:Math.round(r/1024*10)/10,savedChars:s}}function ol(){try{localStorage.removeItem(an)}catch{}}const as="kaoyan2026_ai_usage_v1";function ni(){try{const e=JSON.parse(localStorage.getItem(as))||{};return{requests:e.requests||0,prompt:e.prompt||0,completion:e.completion||0,cacheHit:e.cacheHit||0}}catch{return{requests:0,prompt:0,completion:0,cacheHit:0}}}function Kt(e){if(e)try{const t=ni();t.requests++,t.prompt+=e.prompt_tokens||0,t.completion+=e.completion_tokens||0,t.cacheHit+=e.prompt_cache_hit_tokens||e.prompt_tokens_details&&e.prompt_tokens_details.cached_tokens||0,localStorage.setItem(as,JSON.stringify(t))}catch{}}function il(){return ni()}function al(){try{localStorage.removeItem(as)}catch{}}function cl(){return Zr(jt())}(function(){try{const t=w.get().ai;t&&t.thinkingMode===!0&&!t._thinkingModeSetByUser&&w.update(function(n){n.ai.thinkingMode===!0&&!n.ai._thinkingModeSetByUser&&(n.ai.thinkingMode=void 0)})}catch{}})();function ll(e){const t=Y.AI_PRESETS[e];t&&w.update(n=>{n.ai.preset=e,e!=="custom"&&(n.ai.endpoint=t.endpoint,n.ai.model=t.model)})}function Qs(){const e=window.ReviewModule.weekData(),t=w.mistakeCountWeek("sign"),n=w.get(),r=n.mental.filter(i=>x.inThisWeek(i.date)&&i.hwUrge).length,s={normal:"正常",anxious:"焦虑",tired:"疲劳",impulsive:"冲动",panic:"恐慌"};let o="专业课";try{o=Y.getActiveMajor().name||"专业课"}catch{}return`【本周学习摘要】
时长：`+e.totalHours+"h | 数学正确率："+(e.accuracy!=null?e.accuracy+"%":"未录入")+" | 主要错误："+(e.top2.length?e.top2.map(i=>i.name).join("、"):"无记录")+`
`+o+"进度："+w.profAdvancedPercent()+"% | 心理状态："+(s[e.mental]||"未记录")+" | 分心冲动："+r+"次"+(r?"（已劝阻）":"")+`
符号错误：`+t+"次/周 | 本周错题："+e.weekMistakes+"条 | 里程碑："+Y.MILESTONES.map(i=>(n.milestones[i.id]?"✓":"✗")+i.date).join(" ")}function ri(e,t){return e.text().then(function(n){let r="";try{const s=JSON.parse(n);r=s.error?s.error.message||JSON.stringify(s.error):n.slice(0,300)}catch{r=n.slice(0,200)}throw new Error("HTTP "+e.status+(r?" ("+r+")":""))}).catch(function(n){throw n.message&&n.message.indexOf("HTTP ")===0?n:new Error("HTTP "+(e&&e.status||"?")+" ("+t+")")})}function cs(e){const t=String(e.endpoint||"");try{const n=new URL(t),r=typeof location<"u"&&location.hostname||"";if((r==="localhost"||r==="127.0.0.1")&&n.host==="token.sensenova.cn")return"/sn-api"+n.pathname+n.search}catch{}return t}function ls(e,t,n,r){n=!!n,r=r||{};const s=w.get().ai,o=n?{model:e.model,messages:t}:{model:e.model,messages:t,temperature:.6};n||(r.noThink?o.chat_template_kwargs={enable_thinking:!1}:(s.thinkingMode===!0||s.thinkingMode===!1)&&(o.chat_template_kwargs={enable_thinking:s.thinkingMode}),r.maxTokens&&(o.max_tokens=r.maxTokens));const i=JSON.stringify(o);return console.log("[AI] rawChat 请求 接口="+(e.name||"")+" endpoint="+(e.endpoint||"").slice(0,60)+" model="+e.model+" messages数量="+t.length+" body前200字="+i.slice(0,200)),ns(cs(e),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e.key},body:i},r&&r.timeout||void 0,r&&r.signal).then(function(a){return a.ok?a.json():a.status===400&&!n?(console.error("[AI] rawChat 400！原始body前300字:",i.slice(0,300)),console.warn("[AI] 自动用极简请求体重试…"),ls(e,t,!0,r)):ri(a,"请求被拒绝")}).then(function(a){if(typeof a=="string")return a;Kt(a.usage);const c=a.choices&&a.choices[0]&&a.choices[0].message&&a.choices[0].message.content;if(!c)throw new Error("接口返回异常");return c})}const si="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFklEQVR42mP4z8BAEmIY1TCqYfhqAACQ+f8B8u7oVwAAAABJRU5ErkJggg==",oi="这是一张纯色小图。请只看图片内容、不要猜测，回答它的颜色。只回复一个字：红 / 蓝 / 绿 / 黄。",ul=6e4;function dl(e){const t=e||{};if(!t.endpoint||!t.key||!t.model)return Promise.resolve({v:"unknown",note:"配置不完整，无法探测"});const n=[{role:"user",content:[{type:"text",text:oi},{type:"image_url",image_url:{url:si}}]}],r=JSON.stringify({model:t.model,messages:n,max_tokens:16});return ns(cs(t),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+t.key},body:r},ul).then(function(s){return s.ok?s.json().then(function(o){Kt(o&&o.usage);const i=o&&o.choices&&o.choices[0]&&o.choices[0].message,a=String(i&&i.content||"").trim(),c=String(i&&(i.reasoning_content||i.reasoning)||"").trim(),l=a||c;return l?/红|red/i.test(l)?{v:"ok",note:"已正确识别探针图（纯红）",reply:l.slice(0,40)}:{v:"weak",note:"接受图片输入但未正确识别（回复："+l.slice(0,20)+"）",reply:l.slice(0,40)}:{v:"weak",note:"接口返回空内容，无法确认是否真的看到了图"}}):(s.text?s.text():Promise.resolve("")).then(function(o){let i="";try{const c=JSON.parse(o);i=c.error&&(c.error.message||JSON.stringify(c.error))||String(o).slice(0,160)}catch{i=String(o||"").slice(0,160)}return{v:s.status===400||s.status===415||s.status===422?"no":"unknown",note:"HTTP "+s.status+(i?"（"+i+"）":""),status:s.status}})}).catch(function(s){return{v:"unknown",note:s&&s.message||"网络错误"}})}function ii(e,t){t=t||{};let n=null;if(t.cache!==!1){n=ss(jt().model,e);const r=os(n);if(r!=null)return Promise.resolve(r)}return ts(function(r){return ls(r,e,!1,t)}).then(function(r){return is(n,r),r})}function rr(e,t){if(!(t&&t.noTools)){const n=ui();if(n)return n({system:Ks(),user:e,label:di(t&&t.ctx),signal:t&&t.signal})}return ii([{role:"system",content:Ks()},{role:"user",content:e}],t)}function fl(e,t,n,r){r=r||{};const s=Object.assign({},r);return fi(e,t,null,n,s).then(o=>Vt(o))}function sr(e){const t=String(e||"");for(let n=0;n<t.length;n++){const r=t.charAt(n);if(r!=="{"&&r!=="[")continue;const s=r,o=s==="{"?"}":"]";let i=0,a=!1,c=!1,l=-1;for(let u=n;u<t.length;u++){const f=t.charAt(u);if(c){c=!1;continue}if(f==="\\"){c=!0;continue}if(f==='"'){a=!a;continue}if(!a){if(f===s)i++;else if(f===o&&(i--,i===0)){l=u+1;break}}}if(l>n){const u=t.slice(n,l);try{return JSON.parse(u),u}catch{}try{return JSON.parse(It(u)),u}catch{}}}return""}function It(e){let t="",n="",r=!1;for(let s=0;s<e.length;s++){const o=e.charAt(s);if(n){if(r){o==='"'||o==="\\"||o==="u"?t+=o:t+="\\"+o,r=!1;continue}if(o==="\\"){t+=o,r=!0;continue}if(o===n){n="",t+='"';continue}if(o==='"'){t+='\\"';continue}if(o===`
`){t+="\\n";continue}if(o==="\r"){t+="\\r";continue}if(o==="	"){t+="\\t";continue}if(o<" ")continue;t+=o;continue}if(o==='"'){n='"',t+='"';continue}if(o==="'"){n="'",t+='"';continue}if(o==="“"){n="”",t+='"';continue}if(o==="/"&&e.charAt(s+1)==="/"){for(;s<e.length&&e.charAt(s)!==`
`;)s++;continue}if(o==="/"&&e.charAt(s+1)==="*"){for(s+=2;s+1<e.length&&!(e.charAt(s)==="*"&&e.charAt(s+1)==="/");)s++;s++;continue}if(!(o<" "&&o!==`
`&&o!=="\r"&&o!=="	")){if(/[A-Za-z_$]/.test(o)){const i=e.slice(s).match(/^([A-Za-z_$][\w$]*)(\s*:)/);if(i){t+='"'+i[1]+'"'+i[2],s+=i[0].length-1;continue}}t+=o}}return n&&(t+='"'),t.replace(/,\s*([}\]])/g,"$1")}function pl(e){let t="",n=!1,r=!1,s=0;const o=e.length;for(;s<o;){const i=e.charAt(s);if(r){t+=i,r=!1,s++;continue}if(i==="\\"){t+=i,r=!0,s++;continue}if(i==='"'){if(!n){n=!0,t+=i,s++;continue}let a=s+1;for(;a<o&&/[\s]/.test(e.charAt(a));)a++;const c=a<o?e.charAt(a):"";if(c===","||c==="}"||c==="]"||c===":"||c==="{"||c==="["||c===""){n=!1,t+=i,s++;continue}t+='\\"',s++;continue}t+=i,s++}return t}function Ir(e){const t=[],n={};let r=0;const s=e.length;for(;r<s;){if(e.charAt(r)!=="{"){r++;continue}let o=0,i=!1,a=!1,c=-1;for(let f=r;f<s;f++){const d=e.charAt(f);if(i){if(a){a=!1;continue}if(d==="\\"){a=!0;continue}d==='"'&&(i=!1);continue}if(d==='"'){i=!0;continue}if(d==="{")o++;else if(d==="}"&&(o--,o===0)){c=f+1;break}}if(c<0){r++;continue}const l=e.slice(r,c);let u=null;try{u=JSON.parse(l)}catch{try{u=JSON.parse(It(l))}catch{u=null}}if(u&&typeof u=="object"&&!Array.isArray(u)){const f=JSON.stringify(u);n[f]||(n[f]=1,t.push(u))}r=c}return t}function Ys(e){let t="",n=!1,r=!1;const s=[];for(let o=0;o<e.length;o++){const i=e.charAt(o);if(n&&!r){if(i===`
`){t+="\\n";continue}if(i==="\r"){t+="\\r";continue}if(i==="	"){t+="\\t";continue}if(i<" ")continue}if(t+=i,r){r=!1;continue}if(i==="\\"){r=!0;continue}if(i==='"'){n=!n;continue}n||(i==="{"||i==="["?s.push(i):(i==="}"||i==="]")&&s.length&&s.pop())}for(n&&(t.charAt(t.length-1)==="\\"&&(t+="\\"),t+='"');s.length;){const o=s.pop();t+=o==="{"?"}":"]"}return t.replace(/,\s*([}\]])/g,"$1")}function Vt(e){const t=[],n=function(h,g){t.push("L"+h+":"+g)};let r=String(e??"").replace(/^\uFEFF/,"");r=r.replace(/<think>[\s\S]*?<\/think>/gi,"").trim(),r=pl(r);let s=null,o;const i=/```(?:json|JSON)?\s*([\s\S]*?)```/g;for(;(o=i.exec(r))!==null;)(!s||o[1].length>s.length)&&(s=o[1]);if(s){const h=s.trim();try{return JSON.parse(h)}catch(g){n(1,"代码块直接解析失败("+g.message.slice(0,40)+")")}try{return JSON.parse(It(h))}catch(g){n(1,"代码块修复后仍解析失败("+g.message.slice(0,40)+")")}r=h}else n(1,"无 markdown 代码块");let a=-1;for(let h=0;h<r.length;h++)if(r.charAt(h)==="["||r.charAt(h)==="{"){a=h;break}if(a===-1)throw new Error("AI未返回JSON（L2失败：未找到 [ 或 {）。原始回复前200字："+r.slice(0,200));const c=r.charAt(a)==="[",l=c?"[":"{",u=c?"]":"}";let f=0,d=!1,m=!1,p=-1;for(let h=a;h<r.length;h++){const g=r.charAt(h);if(m){m=!1;continue}if(g==="\\"){m=!0;continue}if(g==='"'){d=!d;continue}if(!d){if(g===l)f++;else if(g===u&&(f--,f===0)){p=h+1;break}}}if(p<0&&n(2,"括号计数未找到匹配闭合（疑似截断或字符串引号错乱）"),p>a){const h=r.slice(a,p);try{return JSON.parse(h)}catch(g){n(3,g.message.slice(0,50))}try{return JSON.parse(It(h))}catch(g){n(4,g.message.slice(0,50))}}if(p<0){const h=r.slice(a);try{return JSON.parse(Ys(h))}catch(g){n(4.5,"截断补齐后解析失败("+g.message.slice(0,40)+")")}try{return JSON.parse(Ys(It(h)))}catch(g){n(4.5,"截断补齐+修复后仍失败("+g.message.slice(0,40)+")")}}const y=Ir(r.slice(a));if(y.length)return c?y:y.length===1?y[0]:y;if(n(5,"无任何完整可解析对象"),!c){const h={};[["w",/"w"\s*:\s*"((?:[^"\\]|\\.)*)"/],["com",/"com"\s*:\s*"((?:[^"\\]|\\.)*)"/],["rare",/"rare"\s*:\s*"((?:[^"\\]|\\.)*)"/],["ex",/"ex"\s*:\s*"((?:[^"\\]|\\.)*)"/],["word",/"word"\s*:\s*"((?:[^"\\]|\\.)*)"/],["question",/"question"\s*:\s*"((?:[^"\\]|\\.)*)"/],["stem",/"stem"\s*:\s*"((?:[^"\\]|\\.)*)"/],["answer",/"answer"\s*:\s*"((?:[^"\\]|\\.)*)"/],["options",/"options"\s*:\s*(\[[\s\S]*?\]\s*[,}])/],["topicName",/"topicName"\s*:\s*"((?:[^"\\]|\\.)*)"/],["solution",/"solution"\s*:\s*"((?:[^"\\]|\\.)*)"/],["subject",/"subject"\s*:\s*"([^"]*)"/],["keySteps",/"keySteps"\s*:\s*"((?:[^"\\]|\\.)*)"/],["errorCause",/"errorCause"\s*:\s*"((?:[^"\\]|\\.)*)"/],["extractedQuestion",/"extractedQuestion"\s*:\s*"((?:[^"\\]|\\.)*)"/],["painPoint",/"painPoint"\s*:\s*"((?:[^"\\]|\\.)*)"/]].forEach(function(M){const D=e.match(M[1]);D&&(h[M[0]]=M[0]==="options"?D[1]:D[1].replace(/\\n/g,`
`).replace(/\\t/g,"	"))});const v=/"([A-Za-z_$][\w$]*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;let S;for(;(S=v.exec(r))!==null;)if(h[S[1]]===void 0)try{h[S[1]]=JSON.parse('"'+S[2]+'"')}catch{h[S[1]]=S[2]}const _=/"([A-Za-z_$][\w$]*)"\s*:\s*(\d+(?:\.\d+)?)/g;for(;(S=_.exec(r))!==null;)h[S[1]]===void 0&&(h[S[1]]=parseFloat(S[2]));const T=/"([A-Za-z_$][\w$]*)"\s*:\s*\[/g;for(;(S=T.exec(r))!==null;){if(h[S[1]]!==void 0)continue;let M=r.slice(S.index+S[0].length-1,S.index+S[0].length+4e3);(function(){let J=0,G=!1,Z=!1,H=-1;for(let te=1;te<M.length;te++){const N=M.charAt(te);if(G){if(Z){Z=!1;continue}if(N==="\\"){Z=!0;continue}N==='"'&&(G=!1);continue}if(N==='"'){G=!0;continue}if(N==="[")J++;else if(N==="]"){if(J===0){H=te;break}J--}}H>=0&&(M=M.slice(0,H))})();const D=Ir(M);if(D.length){h[S[1]]=D;continue}const O=[],R=/"((?:[^"\\]|\\.)*)"/g;let L;for(;(L=R.exec(M))!==null&&O.length<12;)try{O.push(JSON.parse('"'+L[1]+'"'))}catch{O.push(L[1])}O.length&&(h[S[1]]=O)}let A=!1;if(Object.keys(h).forEach(function(M){Array.isArray(h[M])&&(A=!0)}),A||Object.keys(h).length>=3)return h;n(6,"正则捞值未命中关键字段")}throw new Error("AI未返回有效JSON（6层提取均失败）。失败轨迹："+t.join("；")+"。原始回复前200字："+r.slice(0,200))}function jn(e,t,n,r,s){r=!!r,s=s||{};const o=t.some(function(l){return Array.isArray(l.content)&&l.content.some(function(u){return u.type==="image_url"})}),i=s.timeout||(o?3e5:3e4),a=r?{model:e.model,messages:t}:{model:e.model,stream:!0,messages:t};!r&&!s._noStreamOptions&&(a.stream_options={include_usage:!0}),r||(s._think===!1?a.chat_template_kwargs={enable_thinking:!1}:s._think===!0&&(a.chat_template_kwargs={enable_thinking:!0}),s.maxTokens&&(a.max_tokens=s.maxTokens));const c=JSON.stringify(a);return console.log("[AI] chatStream 请求 接口="+(e.name||"")+" endpoint="+e.endpoint+" model="+e.model+" body前200字="+c.slice(0,200)),ns(cs(e),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e.key},body:c},i,s&&s.signal).then(function(l){if(!l.ok){if(l.status===400&&!r){if(console.error("[AI] chatStream 400！原始body前300字:",c.slice(0,300)),!s._noStreamOptions){console.warn("[AI] 400 重试①：去掉 stream_options（保留 stream + thinking）…");const v=Object.assign({},s,{_noStreamOptions:!0});return jn(e,t,n,!1,v)}return console.warn("[AI] 400 重试②：用极简请求体（仅 model+messages）…"),jn(e,t,n,!0,s)}return ri(l,"请求被拒绝")}if(r)return console.log("[AI] 极简重试路径（非流式 JSON 解析）"),l.json().then(function(v){Kt(v.usage);const S=v.choices&&v.choices[0]&&v.choices[0].message,_=S&&(S.reasoning_content||S.reasoning)||"";let T=S&&S.content||"";if(!T&&_){const A=sr(_);if(A)T=A;else try{T=JSON.stringify(Vt(_))}catch{}}if(!T)throw new Error("接口返回异常");return n&&n(T,_),T});const u=l.body.getReader(),f=new TextDecoder;let d="",m="",p="",y="";const h=()=>{n&&n(d,m)};function g(){return u.read().then(function(v){const S=v.done,_=v.value;if(S){if(!d&&m){const M=sr(m);if(M)d=M;else try{d=JSON.stringify(Vt(m)),console.log("[AI] extractJsonStr 失败，extractRobustJSON 成功")}catch{console.log("[AI] reasoning 中未提取到 JSON")}}else if(!d&&!m&&y&&y.trim()){console.log("[AI] SSE 流无 data: 行，尝试解析 rawAll 兜底，前200字: "+y.slice(0,200));try{const M=JSON.parse(y.trim());Kt(M.usage);const D=M.choices&&M.choices[0]&&M.choices[0].message;if(m=D&&(D.reasoning_content||D.reasoning)||"",d=D&&D.content||"",!d&&m){const O=sr(m);if(O)d=O;else try{d=JSON.stringify(Vt(m))}catch{}}d||(d=y)}catch{d=y}}return h(),d}const T=f.decode(_,{stream:!0});y+=T,p+=T;const A=p.split(`
`);return p=A.pop(),A.forEach(M=>{const D=M.trim();if(!(!D||D==="data: [DONE]"||D.indexOf("data:")!==0))try{const O=JSON.parse(D.slice(5));if(O.usage&&(Kt(O.usage),!O.choices||!O.choices.length))return;const R=O.choices&&O.choices[0]&&O.choices[0].delta;if(!R)return;let L=!1;const J=R.reasoning_content!=null?R.reasoning_content:R.reasoning;J&&(m+=J,L=!0),R.content&&(d+=R.content,L=!0),L&&h()}catch{}}),g()})}return g()})}function hl(){try{const e=w.get().ai.maxTokens;return e>0?e:null}catch{return null}}const ai=[{ctx:"quiz.gen",module:"出题",name:"出题生成",desc:"按考点生成题目与选项",def:"noThink"},{ctx:"quiz.variant",module:"出题",name:"错题变式",desc:"同考点换数换问法出变式",def:"noThink"},{ctx:"quiz.answer",module:"出题",name:"判分讲解",desc:"判分并讲解错因",def:"noThink"},{ctx:"copilot.chat",module:"AI 教练",name:"教练对话",desc:"自由对话 / 学习规划建议",def:"global"},{ctx:"copilot.review",module:"AI 教练",name:"深度复盘",desc:"学习进度全景深度复盘",def:"global"},{ctx:"photo.analyze",module:"拍题",name:"拍照分析",desc:"解析错题照片并归因",def:"noThink"},{ctx:"photo.similar",module:"拍题",name:"相似题生成",desc:"按照片考点出相似题",def:"noThink"},{ctx:"photo.weak",module:"拍题",name:"薄弱分析",desc:"照片暴露的薄弱点分析",def:"noThink"},{ctx:"essay.polish",module:"作文",name:"润色升级",desc:"作文润色 / 高分改写",def:"noThink"},{ctx:"essay.grade",module:"作文",name:"批改打分",desc:"按考研评分标准批改",def:"noThink"},{ctx:"word.gen",module:"单词",name:"词条提取",desc:"批量生成单词卡",def:"noThink"},{ctx:"word.mnemonic",module:"单词",name:"记忆口诀",desc:"为单词生成记忆锚点",def:"noThink"},{ctx:"pol.remember",module:"政治",name:"记忆口诀",desc:"政治知识点口诀化",def:"noThink"},{ctx:"pol.recite",module:"政治",name:"背诵判定",desc:"默写结果对照判分",def:"noThink"},{ctx:"insp.gen",module:"解题方法",name:"方法卡生成",desc:"AI 提炼解题方法卡",def:"noThink"},{ctx:"insp.example",module:"解题方法",name:"例题生成",desc:"按方法卡生成例题",def:"noThink"},{ctx:"insp.major",module:"解题方法",name:"专业方法卡",desc:"专业课专属方法卡",def:"noThink"},{ctx:"insp.guide",module:"解题方法",name:"带练提示",desc:"分步带练的提示点拨",def:"noThink"},{ctx:"insp.write",module:"解题方法",name:"带练代写",desc:"教练带你写标准答案",def:"noThink"},{ctx:"insp.check",module:"解题方法",name:"步骤审查",desc:"考生步骤与标准比对",def:"noThink"},{ctx:"mental.chat",module:"心理",name:"心理疏导",desc:"共情疏导与状态干预",def:"think"},{ctx:"sprint.trend",module:"智能押题",name:"趋势分析",desc:"押题趋势预判",def:"noThink"},{ctx:"sprint.gen",module:"智能押题",name:"押题组卷",desc:"单次调用生成整卷",def:"noThink"},{ctx:"sprint.parallel",module:"智能押题",name:"并行出题员",desc:"并行出卷的单题生成",def:"noThink"},{ctx:"sprint.review",module:"智能押题",name:"答案复核",desc:"深度复核原答案防幻觉",def:"think"},{ctx:"sprint.analyze",module:"智能押题",name:"整卷分析",desc:"多维评估整卷质量",def:"think"},{ctx:"sprint.chief",module:"智能押题",name:"总审查",desc:"并行出卷的整卷审查",def:"think"},{ctx:"cm.train",module:"特训营",name:"训练讲解",desc:"考点训练讲解",def:"noThink"},{ctx:"cm.judge",module:"特训营",name:"作答判定",desc:"作答对错判定",def:"noThink"},{ctx:"heat.gen",module:"考点热力",name:"热点生成",desc:"热力考点内容生成",def:"noThink"},{ctx:"heat.deep",module:"考点热力",name:"深度分析",desc:"薄弱点深度归因",def:"noThink"},{ctx:"mk.analyze",module:"错题本",name:"错题归因",desc:"错因分析 / 复习建议",def:"global"},{ctx:"mk.deep",module:"错题本",name:"深度分析",desc:"错题深度复盘",def:"noThink"},{ctx:"tutor.think",module:"AI 督学",name:"智能督学",desc:"教练督学 / 全智能督学",def:"global"}];function ci(e){e=e||{};const t=e.ctx;if(t){let r;try{r=(w.get().ai.moduleModes||{})[t]}catch{}if(r==="think")return!0;if(r==="noThink")return!1;if(r==="forceGlobal"){const s=w.get().ai;return s.thinkingMode===!0||s.thinkingMode===!1?s.thinkingMode:!1}}if(e.noThink!==void 0)return!e.noThink;if(e.think!==void 0)return!!e.think;const n=w.get().ai;return n.thinkingMode===!0||n.thinkingMode===!1?n.thinkingMode:!1}function li(e){if(e=e||{},e._think=ci(e),e.maxTokens==null){const t=hl();t&&(e.maxTokens=t)}return e}function ui(){try{const e=window.AiTools;return!e||typeof e.toolChat!="function"||!e.enabled||!e.enabled()||!e.isReady||!e.isReady()||e.scopeAll&&!e.scopeAll()?null:e.toolChat}catch{return null}}function di(e){try{const t=ai.find(function(n){return n.ctx===e});return t?t.module+" · "+t.name:"AI 长程任务"}catch{return"AI 长程任务"}}function fi(e,t,n,r,s){if(s=li(s),!(s&&s.noTools)){const c=ui();if(c)return c({system:e,user:t,imageDataUrl:r,onChunk:n,label:di(s&&s.ctx),signal:s&&s.signal})}const i=[{role:"system",content:e},r?{role:"user",content:[{type:"text",text:t},{type:"image_url",image_url:{url:r}}]}:{role:"user",content:t}];let a=null;if(s.cache!==!1){a=ss(jt().model,i);const c=os(a);if(c!=null){if(n)try{n(c,"")}catch{}return Promise.resolve(c)}}return ts(function(c){return jn(c,i,n,!1,s)}).then(function(c){return is(a,c),c})}function ml(e,t,n){n=li(n);var r=null;if(n.cache!==!1){r=ss(jt().model,e);var s=os(r);if(s!=null){if(t)try{t(s,"")}catch{}return Promise.resolve(s)}}return ts(function(o){return jn(o,e,t,!1,n)}).then(function(o){return is(r,o),o})}const F={configured:cl,applyPreset:ll,weeklySummary:Qs,chat:rr,chatJSON:fl,chatStream:fi,chatMessagesStream:ml,memoryDigest:Xr,AI_REGISTRY:ai,resolveThink:ci,listApis:Yc,saveApi:Wc,deleteApi:Xc,moveApi:Zc,switchApi:ei,activeApi:jt,cacheStats:sl,cacheClear:ol,usageStats:il,usageReset:al,useStream(){return!!w.get().ai.stream},useThinking(){return w.get().ai.thinkingMode===!0},extractRobustJSON:Vt,repairJsonSafely:It,salvageObjects:Ir,get QUIZ_PROMPT(){return Vc()},get DEEP_REVIEW_PROMPT(){return"你是一名2026考研深度复盘教练，服务对象专业课为「"+Wr()+`」。用户提交了一份【当前学习进度全景快照】（已控制在5000字内，含四科进度、正确率趋势、错题/疑难点、弱点画像、心理状态、里程碑、学习时长等）。
请基于这份快照做一次**深度复盘**，结构清晰、可直接指导行动：
1. 总体诊断：当前状态健康度评估（给出风险等级：安全 / 警戒 / 危险）；
2. 学科短板定位：每科最致命的 1-2 个问题（务必引用快照中的具体数据说话）；
3. 根因分析：为何出现这些短板（学习习惯 / 时间分配 / 概念漏洞 / 心态）；
4. 下周作战方案：逐日可执行的任务调整（具体到科目 / 题量 / 时长）；
5. 防呆强化：针对符号、分式、易错点的强化动作；
6. 心态与节奏：基于心理状态记录给出建议。
要求：用简体中文；每个结论都要落到具体动作；避免空话套话；如快照数据不足请明确指出缺什么。`},JUDGE_PROMPT:Qc,SVG_DIAGRAM_SPEC:Zo,reviewWeekly(e){const t=Qs(),n=e+`

`+t+`

请给出：1)风险诊断 2)下周逐日任务调整 3)防呆强化点。`;let r=document.getElementById("rv-ai-card"),s=document.getElementById("rv-ai-out"),o=document.getElementById("rv-ai-status");if(s)r.style.display="",o&&(o.textContent="已自动附带本周学习摘要，正在等待云端教练回复…"),s&&(s.textContent="加载中…");else{const i=document.createElement("div");i.id="rv-ai-panel",i.style.cssText="position:fixed;bottom:16px;right:16px;width:380px;max-width:calc(100vw - 32px);max-height:60vh;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);box-shadow:0 4px 20px rgba(0,0,0,.12);z-index:9000;overflow:hidden;display:flex;flex-direction:column",i.innerHTML='<div style="padding:10px 14px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center"><span style="font-weight:600;font-size:13px">🤖 AI 快速复盘</span><button id="rv-ai-panel-x" aria-label="关闭" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--text-muted);padding:0 4px;line-height:1">×</button></div><div style="padding:12px 14px;overflow-y:auto;flex:1"><div class="muted-sm" id="rv-ai-status">已自动附带本周学习摘要，正在等待云端教练回复…</div><pre class="report" id="rv-ai-out" style="margin-top:10px;min-height:60px;white-space:pre-wrap">加载中…</pre></div>',document.body.appendChild(i);const a=i.querySelector("#rv-ai-panel-x");a&&(a.onclick=function(){i.remove()}),s=document.getElementById("rv-ai-out"),o=document.getElementById("rv-ai-status"),r=i}rr(n).then(i=>{s&&(s.textContent=window.Tex&&window.Tex.repairPipeLatex?window.Tex.repairPipeLatex(i):i),o&&(o.textContent="✓ 完成");try{w.update(a=>{a.aiReview={week:w.weekKey(),output:i,generatedAt:new Date().toISOString()}})}catch{}z.success("AI 快速复盘完成"),window.App&&window.App.refresh()}).catch(i=>{s&&(s.textContent="调用失败："+i.message+`

可改用本地摘要手动复盘：
`+t),o&&(o.textContent="⚠ 调用失败"),z.warn("AI 快速复盘失败："+(i&&i.message||"未知错误"))})},test(){return rr("用一句话回复：系统连通正常",{cache:!1,noTools:!0}).then(e=>e.slice(0,60))},chatMessages(e,t){return ii(e,t)},testProfile(e){return ls(e,[{role:"user",content:"用一句话回复：系统连通正常"}],!1).then(t=>t.slice(0,60))},probeVision:dl,VISION_PROBE_PNG:si,VISION_PROBE_Q:oi};function Ze(e,t){return e[t]|e[t+1]<<8}function st(e,t){return e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24>>>0}async function gl(e){const t=new DecompressionStream("deflate-raw"),n=new Blob([e]).stream().pipeThrough(t),r=await new Response(n).arrayBuffer();return new Uint8Array(r)}async function yl(e){const t=new Uint8Array(e),n=t.length;if(n<22)throw new Error("不是有效的 zip 文件（太小）");let r=-1;const s=Math.max(0,n-22-65535);for(let u=n-22;u>=s;u--)if(st(t,u)===101010256){r=u;break}if(r<0)throw new Error("不是有效的 zip 文件（未找到目录尾）");const o=Ze(t,r+10),i=st(t,r+16);if(i>n)throw new Error("zip 目录偏移越界");const a=[];let c=i;for(let u=0;u<o&&c+46<=n&&st(t,c)===33639248;u++){const f=Ze(t,c+8),d=Ze(t,c+10),m=st(t,c+20),p=st(t,c+24),y=Ze(t,c+28),h=Ze(t,c+30),g=Ze(t,c+32),v=st(t,c+42);let S="";for(let _=0;_<y;_++)S+=String.fromCharCode(t[c+46+_]);if(f&2048)try{S=new TextDecoder("utf-8").decode(t.subarray(c+46,c+46+y))}catch{}else try{const T=new TextDecoder("utf-8").decode(t.subarray(c+46,c+46+y));/[\uFFFD]/.test(T)||(S=T)}catch{}a.push({name:S,method:d,compSize:m,uncompSize:p,flags:f,localOff:v}),c+=46+y+h+g}if(!a.length)throw new Error("zip 内没有文件条目");const l=[];for(let u=0;u<a.length;u++){const f=a[u];if(f.name.slice(-1)==="/"||f.name.slice(-1)==="\\")continue;const d=f.localOff;if(d+30>n||st(t,d)!==67324752)continue;const m=Ze(t,d+26),p=Ze(t,d+28),y=d+30+m+p;if(y+f.compSize>n)continue;const h=t.subarray(y,y+f.compSize);let g;if(f.method===0)g=h;else if(f.method===8)try{g=await gl(h)}catch{continue}else continue;l.push({name:f.name,data:g})}return l}function pi(e){if(!e||typeof e!="string")return null;const t=e.replace(/^\uFEFF/,""),n={name:"",description:"",whenToUse:"",body:t},r=t.match(/^\s*---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);if(r){const s=r[1],o=/^\s*([A-Za-z_][A-Za-z0-9_\-]*)\s*:\s*(.*)$/;s.split(/\r?\n/).forEach(function(i){const a=i.match(o);if(!a)return;const c=a[1].toLowerCase().replace(/-/g,""),l=a[2].trim().replace(/^["']|["']$/g,"");l&&(c==="name"&&!n.name?n.name=l:c==="description"&&!n.description?n.description=l:c==="whentouse"||c==="when"||c==="when_to_use"?n.whenToUse||(n.whenToUse=l):c==="summary"&&!n.description&&(n.description=l))}),n.body=t.slice(r[0].length).trim()}return n}function vl(e){const t=(e||[]).map(function(c){return{name:String(c.name||"").replace(/\\/g,"/"),data:c.data}});let n=null;if(t.forEach(function(c){if(/SKILL\.md$/i.test(c.name)){const l=(c.name.match(/\//g)||[]).length,u=n?(n.name.match(/\//g)||[]).length:1e9;l<=u&&(n=c)}}),!n)throw new Error("技能包缺少 SKILL.md");const r=pi(new TextDecoder("utf-8").decode(n.data)),s=n.name.split("/").slice(0,-1).join("/"),o=[],i=[];t.forEach(function(c){if(c.name===n.name)return;if(!(!s||c.name.indexOf(s+"/")===0)){i.push({path:c.name,size:c.data.length});return}const u=s?c.name.slice(s.length+1):c.name;/\.md$/i.test(u)&&!/^SKILL\.md$/i.test(u)&&u.indexOf("/SKILL.md")<0?o.push({path:c.name,text:new TextDecoder("utf-8").decode(c.data)}):/\.md$/i.test(u)||i.push({path:c.name,size:c.data.length})});const a=r.name||"skill-pack";return{id:a,name:a,description:r.description||"AI 技能包："+a,whenToUse:r.whenToUse||"",skillMd:r.body||"",refs:o,files:i}}const _n={parseZip:yl,parseSkillMd:pi,normalizeSkillPack:vl};function _t(){return w.get().plugins||[]}function wl(e){var t={pid:e,Store:window.Store,AI:window.AI,App:window.App,Toast:window.Toast,Modal:window.Modal,Components:window.Components,Tex:window.Tex,Charts:window.Charts,DB:window.DB,Mastery:window.Mastery,Spaced:window.Spaced,U:window.U,Theme:window.Theme,Cloud:window.Cloud,AiMemory:window.AiMemory,PluginBus:q,store:window.Store,ai:window.AI,toast:window.Toast,modal:window.Modal,uid:function(n){return x.uid?x.uid():(n||"plg")+Date.now().toString(36)},dkey:function(){return x.dkey?x.dkey():new Date().toISOString().slice(0,10)}};return Object.keys(window).forEach(function(n){/Module$/.test(n)&&typeof window[n]=="object"&&window[n]&&(t[n]=window[n])}),t.api={go:function(n){window.App&&App.go(n)},refresh:function(){window.App&&App.refresh()},current:function(){return window.App?App.current:""},openModal:function(n){window.Modal&&we.open(n)},openPanel:function(n){q.openPanel(n)},closePanel:function(n){q.closePanel(n)},panelsOf:function(n){return q.panels().filter(function(r){return r.pid===(n||t.pid)})},confirm:function(n,r,s,o){window.Modal&&we.confirm(n,r,o?"删除":"确定",s,o)},closeModal:function(){window.Modal&&we.close()},toast:function(n,r,s){window.Toast&&z.show(n,r||"info",s||2e3)},download:function(n,r,s){try{var o=new Blob([r],{type:s||"text/plain;charset=utf-8"}),i=URL.createObjectURL(o),a=document.createElement("a");a.href=i,a.download=n||"plugin-export.txt",document.body.appendChild(a),a.click(),a.remove(),setTimeout(function(){URL.revokeObjectURL(i)},2e3)}catch(c){window.Toast&&z.show("下载失败："+(c.message||c),"warn",2500)}},readFile:function(n){return new Promise(function(r,s){var o=document.createElement("input");o.type="file",n&&(o.accept=n),o.style.display="none",document.body.appendChild(o),o.onchange=function(){var i=o.files&&o.files[0];if(o.remove(),!i){s(new Error("未选择文件"));return}var a=new FileReader;a.onload=function(){r({name:i.name,text:String(a.result||""),size:i.size})},a.onerror=function(){s(new Error("文件读取失败"))},a.readAsText(i,"utf-8")},o.click()})},goTool:function(n,r){q.goTool(n,r)},params:function(){return q.params(e)}},t.ui={card:function(n,r){return'<div class="card">'+(r?'<div class="card-title-sm">'+x.esc(r)+"</div>":"")+n+"</div>"},btn:function(n,r,s){return'<button class="btn '+(r||"btn-ghost")+'" '+(s||"")+">"+n+"</button>"},btnRow:function(n){return'<div class="btn-row">'+n+"</div>"},tag:function(n,r){return'<span class="tag '+(r||"")+'">'+x.esc(n)+"</span>"},badge:function(n,r){return'<span class="tag '+(r||"")+'" style="font-size:11px;opacity:.9">'+x.esc(n)+"</span>"},alert:function(n,r){return'<div class="alert alert-'+(r||"info")+'">'+x.esc(n)+"</div>"},stat:function(n,r){return'<div class="stat"><div class="stat-num">'+n+'</div><div class="stat-label">'+x.esc(r)+"</div></div>"},statRow:function(n){return'<div class="stat-row">'+n.join("")+"</div>"},progress:function(n,r){return'<div class="pbar"><div class="pbar-fill" style="width:'+x.clamp(Math.round(+n||0),0,100)+"%;background:"+(r||"var(--ok)")+'"></div></div>'},empty:function(n){return'<div class="card empty-hint">'+x.esc(n)+"</div>"},section:function(n,r){return'<div class="pm-ai-section"><b>'+x.esc(n)+'：</b><div class="pm-ai-body">'+r+"</div></div>"},list:function(n){return"<div>"+(n||[]).map(function(r){return'<div style="padding:5px 0;border-bottom:1px solid var(--line)">'+r+"</div>"}).join("")+"</div>"},tabs:function(n,r){return'<div class="tab-row">'+n.map(function(s){return'<button class="tab'+(s[0]===r?" tab-on":"")+'">'+x.esc(s[1])+"</button>"}).join("")+"</div>"},input:function(n,r,s){return'<input id="'+x.esc(n)+'" class="input" placeholder="'+x.esc(r||"")+'" value="'+x.esc(s??"")+'">'},textarea:function(n,r,s){return'<textarea id="'+x.esc(n)+'" class="input" rows="'+(s||3)+'" placeholder="'+x.esc(r||"")+'"></textarea>'},select:function(n,r,s){return'<select id="'+x.esc(n)+'" class="input">'+(r||[]).map(function(o){return'<option value="'+x.esc(o)+'"'+(String(o)===String(s)?" selected":"")+">"+x.esc(o)+"</option>"}).join("")+"</select>"}},t.ai={has:function(){return!!(window.AI&&F.configured())},chat:function(n,r,s){return window.AI&&F.configured()?F.chatStream(n,r,null,null,Object.assign({noThink:!0},s||{})):Promise.reject(new Error("未配置 AI"))},json:function(n,r,s){return window.AI&&F.configured()?F.chatJSON(n,r,null,s||{}):Promise.reject(new Error("未配置 AI"))},stream:function(n,r,s,o){return window.AI&&F.configured()?F.chatStream(n,r,s,null,o||{}):Promise.reject(new Error("未配置 AI"))}},t.data=function(n,r){return q.data(e,n,r)},t.config=function(n,r){return q.config(e,n,r)},t.log=function(n,r){q.log(e,n,r)},t.call=function(n,r){var s=Array.prototype.slice.call(arguments,2);return q.call.apply(q,[n,r].concat(s))},t}function or(e){if(!e||typeof e!="object")throw new Error("插件必须注册一个对象");var t=String(e.id||"").trim();if(!t||!/^[a-z0-9][a-z0-9\-_]{1,31}$/i.test(t))throw new Error("插件 id 必填且只能含字母数字-_（如 my-plugin）");var n={id:t,name:String(e.name||t).trim().slice(0,30),version:String(e.version||"1.0").slice(0,12),desc:String(e.desc||"").slice(0,300),author:String(e.author||"").slice(0,40),skills:Array.isArray(e.skills)?e.skills.slice(0,20):[],actions:Array.isArray(e.actions)?e.actions.slice(0,20):[],tools:Array.isArray(e.tools)?e.tools.slice(0,10):[],panels:Array.isArray(e.panels)?e.panels.slice(0,6):[],hooks:e.hooks&&typeof e.hooks=="object"?e.hooks:{},queries:Array.isArray(e.queries)?e.queries.slice(0,20):[],maintabs:Array.isArray(e.maintabs)?e.maintabs.slice(0,3):[],css:String(e.css||"").slice(0,2e4),enhancers:Array.isArray(e.enhancers)?e.enhancers.slice(0,12):[],timers:Array.isArray(e.timers)?e.timers.slice(0,10):[],shortcuts:Array.isArray(e.shortcuts)?e.shortcuts.slice(0,10):[],config:Array.isArray(e.config)?e.config.slice(0,12):[],depends:Array.isArray(e.depends)?e.depends.slice(0,8):[],services:e.services&&typeof e.services=="object"?e.services:{},memory:String(e.memory||"").slice(0,200),init:typeof e.init=="function"?e.init:null,onEnable:typeof e.onEnable=="function"?e.onEnable:null,onDisable:typeof e.onDisable=="function"?e.onDisable:null,enabled:!0,createdAt:x.dkey?x.dkey():new Date().toISOString().slice(0,10)};return n.tools.forEach(function(r,s){if(r&&typeof r=="object"&&!r.id&&(r.id=n.id+"-tool"+(s+1)),r&&typeof r.render!="function"&&typeof r.mount!="function")throw new Error("工具 "+(r&&r.title||"?")+" 必须有 render 或 mount 函数")}),n.panels.forEach(function(r,s){if(!r||!r.id||!r.title)throw new Error("面板 #"+(s+1)+" 缺 id/title");if(typeof r.render!="function")throw new Error("面板 "+r.title+" 必须有 render(ctx, box) 函数");if(!/^[a-z0-9][a-z0-9\-_]{1,31}$/i.test(String(r.id)))throw new Error("面板 id 只能含字母数字-_")}),n.config.forEach(function(r,s){if(!r||!r.key||!r.label)throw new Error("配置项 #"+(s+1)+" 缺 key/label");["text","number","select","bool"].indexOf(r.type)<0&&(r.type="text")}),n.shortcuts.forEach(function(r){if(r&&r.key&&typeof r.run!="function")throw new Error("快捷键 "+r.key+" 缺 run 函数")}),n.queries.forEach(function(r,s){if(!r||!r.key||!r.label)throw new Error("查询 #"+(s+1)+" 缺 key/label");if(typeof r.run!="function")throw new Error("查询 "+r.label+" 缺 run 函数")}),n.maintabs.forEach(function(r,s){if(!r||!r.id||!r.name)throw new Error("主 tab #"+(s+1)+" 缺 id/name");if(typeof r.render!="function")throw new Error("主 tab "+r.name+" 缺 render 函数");if(!/^[a-z0-9][a-z0-9\-_]{1,31}$/i.test(String(r.id)))throw new Error("主 tab id 只能含字母数字-_")}),n}var ye={};function Bt(e){var t=ye[e];if(!t)return null;var n=_t().find(function(r){return r.id===e});return n&&n.enabled===!1?null:t.manifest}function Se(e){return ye[e]?(ye[e].ctx||(ye[e].ctx=wl(e)),ye[e].ctx):null}var Nn={};function Ws(e){Mr(e.id),(e.timers||[]).forEach(function(t){if(!(!t||!t.run)){var n=function(){try{t.run(Se(e.id),t)}catch(a){Pe(e.id,"定时器错误："+(a.message||a))}};if(t.at&&/^\d{1,2}:\d{2}$/.test(t.at)){var r=function(){var a=new Date,c=t.at.split(":"),l=new Date(a);l.setHours(+c[0],+c[1],0,0),l<=a&&l.setDate(l.getDate()+1);var u=setTimeout(function(){try{n()}catch{}r()},l-a);ir(e.id,u)};r()}else if(t.every&&/^\d+min$/.test(t.every)){var s=parseInt(t.every,10)*6e4,o=setInterval(n,s);ir(e.id,o)}else if(t.once&&/^\d+min$/.test(t.once)){var i=parseInt(t.once,10)*6e4,o=setTimeout(n,i);ir(e.id,o)}}})}function ir(e,t){(Nn[e]=Nn[e]||[]).push(t)}function Mr(e){(Nn[e]||[]).forEach(function(t){try{clearTimeout(t),clearInterval(t)}catch{}}),delete Nn[e]}function Pe(e,t,n){try{w.update(function(r){r.pluginLog=r.pluginLog||[],r.pluginLog.unshift({at:new Date().toISOString(),pid:e,level:n||"info",msg:String(t||"").slice(0,300)}),r.pluginLog.length>200&&(r.pluginLog=r.pluginLog.slice(0,200))})}catch{}}const q={_ver:"2.0.0",register:function(e){var t=or(e);if(ye[t.id]){try{q.unsubscribeAll(t.id)}catch{}try{q.closePanelsOf(t.id)}catch{}}ye[t.id]={manifest:t};try{Ws(t),t.init&&t.init(Se(t.id)),t.css&&q._injectCss(t.id,t.css)}catch(n){Pe(t.id,"初始化错误："+(n.message||n),"error")}return t},_cssTags:{},_injectCss:function(e,t){if(!(typeof document>"u"||!t)){q._removeCss(e);var n=document.createElement("style");n.id="plg-css-"+e,n.textContent=t,document.head.appendChild(n),q._cssTags[e]=n}},_removeCss:function(e){var t=q._cssTags[e]||document.getElementById("plg-css-"+e);t&&t.parentNode&&t.parentNode.removeChild(t),delete q._cssTags[e]},_enh:{},_onPageRendered:function(e,t){if(e){var n=this;this.list().forEach(function(r){(r.enhancers||[]).forEach(function(s,o){!s||!s.html&&typeof s.mount!="function"||s.tab&&s.tab!=="all"&&s.tab!==t||n._applyEnhancer(r,s,o,e,t)})})}},_applyEnhancer:function(e,t,n,r,s){var o=e.id+":"+n,i=this,a;if(t.selector?a=r.querySelector(t.selector):a=r.querySelector(t.slot==="top"?'div[data-pg-slot="top"]':'div[data-pg-slot="bottom"]'),!!a){var c=document.createElement("div");c.className="plg-enh",c.setAttribute("data-plg-enh",o);var l=null;try{if(typeof t.mount=="function")l=t.mount(Se(e.id),c)||null;else{var u=typeof t.html=="function"?t.html(Se(e.id),r)||"":String(t.html);u&&(c.innerHTML=u)}}catch(f){Pe(e.id,"页面装饰错误："+(f.message||f),"error")}a.appendChild(c),i._enh[o]={destroy:l,container:c,subscribe:t.subscribe,tab:s,pid:e.id}}},_clearEnh:function(e){var t=this._enh[e];if(t){try{typeof t.destroy=="function"&&t.destroy()}catch{}try{t.container&&t.container.parentNode&&t.container.parentNode.removeChild(t.container)}catch{}delete this._enh[e]}},_clearAllEnh:function(){var e=this;Object.keys(this._enh).forEach(function(t){e._clearEnh(t)})},_reapplyReactive:function(){var e=this,t=document.getElementById("view");if(!(!t||!window.App)){var n=App.current;Object.keys(e._enh).forEach(function(r){var s=e._enh[r];if(!(!s||!s.subscribe||!s.subscribe.length)&&!(s.tab!==n&&s.tab!=="all")){var o=r.split(":"),i=Bt(o[0]),a=+o[1];if(!i||!i.enhancers||!i.enhancers[a]){e._clearEnh(r);return}e._clearEnh(r),e._applyEnhancer(i,i.enhancers[a],a,t,n)}})}},list:function(){var e=[];return Object.keys(ye).forEach(function(t){var n=Bt(t);n&&e.push(n)}),e},get:function(e){var t=Bt(e);return t||null},ctxOf:Se,data:function(e,t,n){if(!(!e||!t))return arguments.length===2?(w.get().pluginData||{})[e]?w.get().pluginData[e][t]:void 0:(w.update(function(r){r.pluginData=r.pluginData||{},r.pluginData[e]||(r.pluginData[e]={}),n===null?delete r.pluginData[e][t]:r.pluginData[e][t]=n}),n)},config:function(e,t,n){if(!(!e||!t)){var r=(w.get().pluginConfig||{})[e]||{};return arguments.length===2?t in r?r[t]:void 0:(w.update(function(s){s.pluginConfig=s.pluginConfig||{},s.pluginConfig[e]||(s.pluginConfig[e]={}),s.pluginConfig[e][t]=n}),n)}},configWithDefault:function(e,t){var n=q.config(e.id,t);if(n!==void 0)return n;var r=(e.config||[]).find(function(s){return s.key===t});return r?r.default:void 0},log:Pe,skills:function(){var e=[];return this.list().forEach(function(t){(t.skills||[]).forEach(function(n){n&&n.trigger&&n.prompt&&e.push({pid:t.id,trigger:n.trigger,title:n.title||n.trigger,prompt:n.prompt,summary:n.summary||"",when:n.when||"",refs:n.refs||[]})})}),e},actions:function(){var e=[];return this.list().forEach(function(t){(t.actions||[]).forEach(function(n){n&&n.type&&e.push({pid:t.id,type:n.type,label:n.label||n.type,auto:!!n.auto,run:n.run,needs:n.needs,undo:n.undo})})}),e},tools:function(){var e=[];return this.list().forEach(function(t){(t.tools||[]).forEach(function(n){n&&n.id&&e.push({pid:t.id,id:n.id,title:n.title||n.id,icon:n.icon||"🧩",render:n.render,mount:n.mount})})}),e},queries:function(){var e=[];return this.list().forEach(function(t){(t.queries||[]).forEach(function(n){n&&n.key&&e.push({pid:t.id,key:n.key,label:n.label||n.key,run:n.run})})}),e},maintabs:function(){var e=[];return this.list().forEach(function(t){(t.maintabs||[]).forEach(function(n){n&&n.id&&e.push({pid:t.id,id:n.id,name:n.name||n.id,icon:n.icon||"🧩",render:n.render})})}),e},panels:function(){var e=[];return this.list().forEach(function(t){(t.panels||[]).forEach(function(n){n&&n.id&&e.push({pid:t.id,id:n.id,title:n.title||n.id,icon:n.icon||"🪟",render:n.render,width:n.width||300,height:n.height||360})})}),e},openPanel:function(e){var t=document.getElementById("plg-panel-"+e);if(t){q.closePanel(e);return}var n=this.panels().filter(function(d){return d.id===e})[0];if(!n){z.show("面板不存在或已禁用","warn",1800);return}var r=document.createElement("div");r.id="plg-panel-"+e,r.className="plg-panel",r.style.width=(n.width||300)+"px",r.style.height=(n.height||360)+"px",r.innerHTML='<div class="plg-panel-h"><span class="plg-panel-t">'+(n.icon||"🪟")+" "+x.esc(n.title)+'</span><button class="plg-panel-btn" data-pb="fold" title="折叠">—</button><button class="plg-panel-btn" data-pb="close" title="关闭">×</button></div><div class="plg-panel-b"></div>',document.body.appendChild(r);var s=r.querySelector(".plg-panel-b");try{var o=n.render(Se(n.pid),s);typeof o=="string"&&s.innerHTML===""&&(s.innerHTML=o)}catch(d){s.innerHTML='<div class="alert alert-danger">面板渲染失败：'+x.esc(d.message||d)+"</div>"}var i=r.querySelector('[data-pb="fold"]');i&&(i.onclick=function(){var d=r.querySelector(".plg-panel-b"),m=r.classList.toggle("plg-panel-folded");d&&(d.style.display=m?"none":""),i.textContent=m?"▢":"—"});var a=r.querySelector('[data-pb="close"]');a&&(a.onclick=function(){q.closePanel(e)});var c=r.querySelector(".plg-panel-h"),l=null,u=function(d){l&&(r.style.left=Math.max(0,d.clientX-l.dx)+"px",r.style.top=Math.max(0,d.clientY-l.dy)+"px",r.style.right="auto",r.style.bottom="auto")},f=function(){l=null,document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",f)};c&&(c.onmousedown=function(d){d.target&&d.target.tagName==="BUTTON"||(l={dx:d.clientX-r.offsetLeft,dy:d.clientY-r.offsetTop},d.preventDefault(),document.addEventListener("mousemove",u),document.addEventListener("mouseup",f))}),Pe(n.pid,"面板「"+n.title+"」已打开")},closePanel:function(e){var t=document.getElementById("plg-panel-"+e);t&&t.parentNode&&t.parentNode.removeChild(t)},closeAllPanels:function(){var e=this;this.panels().forEach(function(t){e.closePanel(t.id)})},openPanelsOf:function(e){var t=this;this.panels().filter(function(n){return n.pid===e}).forEach(function(n){t.openPanel(n.id)})},closePanelsOf:function(e){var t=this;this.panels().filter(function(n){return n.pid===e}).forEach(function(n){t.closePanel(n.id)})},_params:{},goTool:function(e,t){var n=this.tools().filter(function(r){return r.id===e})[0];if(!n){z.show("工具 "+e+" 不存在或已禁用","warn",2e3);return}this._params[n.pid]=t||{},window.App&&App.go(e)},params:function(e){return q._params[e]||{}},clearParams:function(e){delete q._params[e]},emit:function(e,t){var n=0;return this.list().forEach(function(r){var s=(r.hooks||{})[e]||(r.hooks||{})["*"];if(typeof s=="function")try{s(Se(r.id),t||{}),n++}catch(o){Pe(r.id,"钩子「"+e+"」错误："+(o.message||o),"error")}}),n},fire:function(e,t){return q.emit(e,t)},_subs:{},subscribe:function(e,t){return typeof t!="function"?function(){}:((q._subs[e]=q._subs[e]||[]).push(t),function(){q.unsubscribe(e,t)})},unsubscribe:function(e,t){var n=q._subs[e];if(n){var r=n.indexOf(t);r>=0&&n.splice(r,1),n.length||delete q._subs[e]}},unsubscribeAll:function(e){delete q._subs[e]},_onStoreUpdate:function(e){var t=this;Object.keys(t._subs).forEach(function(n){t._subs[n].forEach(function(r){try{r(Se(n),e||{})}catch(s){Pe(n,"订阅回调错误："+(s.message||s),"error")}})}),clearTimeout(t._enhDebounce),t._enhDebounce=setTimeout(function(){try{t._reapplyReactive()}catch{}},300)},call:function(e,t){var n=Array.prototype.slice.call(arguments,2),r=Bt(e);if(!r)throw new Error("插件「"+e+"」未启用或不存在");var s=r.services&&r.services[t];if(typeof s!="function")throw new Error("插件「"+e+"」未提供服务 "+t);return s.apply(null,[Se(e)].concat(n))},callService:function(e,t){var n=Array.prototype.slice.call(arguments,2);return q.call.apply(q,[e,t].concat(n))},memories:function(){var e=[];return this.list().forEach(function(t){t.memory&&e.push({pid:t.id,text:t.memory})}),e},runSkill:function(e,t,n){if(!e)return Promise.reject(new Error("技能不存在"));if(!(window.AI&&F.configured()))return Promise.reject(new Error("未配置 AI"));var r="🧠 "+(e.title||e.trigger),s=String(e.prompt||"").replace(/\{input\}/g,String(t||"")),o='<div class="pm-ai-body" id="pbskill-out"><div class="skl-line"></div><div class="skl-line"></div><div class="skl-line skl-w70"></div></div><div id="pbskill-actions"></div>',i=!1;we.open({title:r,wide:!0,html:o,actions:[{label:"关闭"}]});var a=function(c){var l=document.getElementById("pbskill-out"),u=window.Tex&&Fe.repairPipeLatex?Fe.repairPipeLatex(c||""):c||"";l&&(l.innerHTML=x.esc(u).replace(/\n/g,"<br>")+'<span class="ai-cursor"></span>')};return F.chatStream("你是考研AI助手。按技能要求执行。",(t?"【技能输入】"+t+`

`:"")+s,function(c){i||a(c)},null,{noThink:!0,timeout:12e4}).then(function(c){i=!0;var l=document.getElementById("pbskill-out");if(l)try{l.innerHTML=Fe.renderInline(c||"").replace(/\n/g,"<br>")}catch{l.textContent=c||""}var u=document.getElementById("pbskill-actions");if(u&&n&&n.postActions&&n.postActions.length){var f=n.postActions.map(function(d,m){return'<button class="btn btn-sm '+(m===0?"btn-primary":"btn-ghost")+' pbskill-post" data-kind="'+(d.kind||"action")+'" data-target="'+x.esc(d.target||"")+'" data-label="'+x.esc(d.label||"执行")+'" data-arg="'+x.esc(d.arg||"")+'">'+x.esc(d.label||"执行")+"</button>"}).join("");u.innerHTML='<div class="btn-row" style="justify-content:center;margin-top:10px">'+f+"</div>",u.querySelectorAll(".pbskill-post").forEach(function(d){d.onclick=function(){var m=d.getAttribute("data-kind"),p=d.getAttribute("data-target"),y=d.getAttribute("data-label");if(m==="goto"&&p)we.close(),App.go(p),z.show(y+"…","info",1200);else if(m==="action"&&p&&window.PluginBus)try{var h={type:p,label:y};if(d.getAttribute("data-arg"))try{h=JSON.parse(d.getAttribute("data-arg"))}catch{}var g=q.actions().filter(function(S){return S.type===p})[0];if(g&&typeof g.run=="function"){var v=g.run(Se(g.pid)||{},h)||"";v&&z.show(v,"success",2500),we.close()}else z.warn("未找到动作："+p)}catch{z.warn("动作执行失败")}}})}return Pe(e.pid,"技能「"+e.trigger+"」执行完成"+(t?"（输入："+String(t).slice(0,20)+"）":"")),c}).catch(function(c){i=!0;var l=document.getElementById("pbskill-out");throw l&&(l.innerHTML='<div class="alert alert-danger">技能执行失败：'+x.esc(c.message||c)+"</div>"),c})},commands:function(){var e=[];return this.skills().forEach(function(t){e.push({cmd:"/"+t.trigger,pid:t.pid,kind:"skill",skill:t,title:t.title||t.trigger})}),e},importText:function(e,t){if(!e||typeof e!="string"||!e.trim())throw new Error("空内容");if(e.indexOf("PluginBus.register")<0)throw new Error("这不是插件源码：未找到 PluginBus.register({...}) 调用");var n=null,r=window.PluginBus;window.PluginBus={register:function(a){return n=a,q.register(a)}};var s=null;try{var o=new Function("PluginBus","window",`"use strict";
`+e+`
;return true;`);o(window.PluginBus,window)}catch(a){s=a}if(window.PluginBus=r,s)throw new Error("插件执行失败："+(s.message||String(s)));if(!n)throw new Error("插件未调用 PluginBus.register");var i=or(n);return(i.depends||[]).forEach(function(a){var c=_t().some(function(l){return l.id===a});if(!c)throw new Error("依赖插件「"+a+"」未安装。请先安装它再导入本插件。")}),w.update(function(a){a.plugins=a.plugins||[];var c=a.plugins.findIndex(function(u){return u.id===i.id}),l={id:i.id,name:i.name,version:i.version,desc:i.desc,author:i.author,source:e,enabled:!0,createdAt:i.createdAt,config:i.config,shortcuts:i.shortcuts,depends:i.depends,memory:i.memory};c>=0?a.plugins[c]=l:a.plugins.push(l)}),t||z.show("插件「"+i.name+"」已导入","success",2500),i},exportText:function(e){var t=_t().find(function(n){return n.id===e});return t?`/*
 * `+t.name+" v"+t.version+(t.author?" by "+t.author:"")+`
 * `+(t.desc||"")+`
 */
`+(t.source||""):null},importSkillPack:function(e,t){if(!e||!e.skillMd)throw new Error("技能包缺少指令内容");var n=String(e.id||e.name||"skill-pack").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g,"-").replace(/^-+|-+$/g,""),r=n.replace(/[\u4e00-\u9fa5]+/g,function(l){for(var u=0,f=0;f<l.length;f++)u=u*31+l.charCodeAt(f)>>>0;return"s"+u.toString(36).slice(0,4)}),s=r.replace(/[^a-z0-9\-_]/g,"-").replace(/^-+|-+$/g,"").slice(0,32)||"skill-"+Date.now().toString(36);/^[a-z0-9][a-z0-9\-_]{1,31}$/i.test(s)||(s="skill-"+Date.now().toString(36));var o=e.refs.length?`

【参考文档（遇到相关问题时查阅）】
`+e.refs.map(function(l,u){return"["+(u+1)+"] "+l.path+"："+l.text.slice(0,300)+(l.text.length>300?"…":"")}).join(`
`):"",i=e.whenToUse?`
适用时机：`+e.whenToUse:"",a={id:s,name:e.name||s,version:e.version||"1.0",desc:e.description||"AI 技能包",author:e.author||"skill-pack",skills:[{trigger:e.name||s,title:e.name||s,summary:e.description||e.name||s,when:e.whenToUse||"",refs:e.refs||[],prompt:e.skillMd+i+o}]};w.update(function(l){l.plugins=l.plugins||[];var u=l.plugins.findIndex(function(d){return d.id===s}),f={id:s,name:e.name||s,version:e.version||"1.0",desc:e.description||"AI 技能包",author:"skill-pack",source:"/* skill-pack: "+(e.name||s)+` */
PluginBus.register(`+JSON.stringify(a)+");",enabled:!0,createdAt:x.dkey?x.dkey():new Date().toISOString().slice(0,10),isSkillPack:!0,skillMeta:{whenToUse:e.whenToUse,refCount:(e.refs||[]).length}};u>=0?l.plugins[u]=f:l.plugins.push(f)});var c=or(a);return ye[s]={manifest:c},t||z.show("技能包「"+(e.name||s)+"」已导入（"+(e.refs.length?e.refs.length+" 份参考":"无参考")+"）","success",3e3),c},importZip:function(e,t){if(!window.ZipKit)throw new Error("技能包解析器未加载");return _n.parseZip(e).then(function(n){var r=_n.normalizeSkillPack(n);return q.importSkillPack(r,t)})},importSkillMdText:function(e,t){if(!window.ZipKit)throw new Error("技能包解析器未加载");var n=_n.parseSkillMd(e);if(!n)throw new Error("无法解析 SKILL.md");var r=n.name||"skill-pack",s={id:r,name:r,description:n.description,whenToUse:n.whenToUse,skillMd:n.body,refs:[],files:[]};return q.importSkillPack(s,t)},exportShareCode:function(e){var t=_t().find(function(o){return o.id===e});if(!t||!t.source)return null;try{var n=new TextEncoder().encode(t.source),r="";n.forEach(function(o){r+=String.fromCharCode(o)});var s=btoa(r).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");return"PBCODE1:"+s}catch{return null}},importShareCode:function(e,t){if(!e||typeof e!="string")throw new Error("无效分享码");var n=e.match(/^PBCODE1:([A-Za-z0-9\-_]+)$/);if(!n)throw new Error("不是有效的插件分享码（应以 PBCODE1: 开头）");try{for(var r=n[1].replace(/-/g,"+").replace(/_/g,"/");r.length%4;)r+="=";for(var s=atob(r),o=new Uint8Array(s.length),i=0;i<s.length;i++)o[i]=s.charCodeAt(i);var a=new TextDecoder("utf-8").decode(o);return q.importText(a,t)}catch(c){throw new Error("分享码解析失败："+(c.message||c))}},enable:function(e,t){w.update(function(r){var s=(r.plugins||[]).find(function(o){return o.id===e});s&&(s.enabled=!!t)});var n=ye[e];if(n)if(t)try{Ws(n.manifest),n.manifest.css&&q._injectCss(e,n.manifest.css),n.manifest.onEnable&&n.manifest.onEnable(Se(e)),n.manifest.init&&n.manifest.init(Se(e))}catch(r){Pe(e,"启用错误："+(r.message||r),"error")}else{Mr(e),q.unsubscribeAll(e),q._removeCss(e),q._clearEnhOf(e);try{n.manifest.onDisable&&n.manifest.onDisable(Se(e))}catch(r){Pe(e,"禁用错误："+(r.message||r),"error")}}},_clearEnhOf:function(e){var t=this;Object.keys(this._enh).forEach(function(n){t._enh[n]&&t._enh[n].pid===e&&t._clearEnh(n)})},remove:function(e){w.update(function(t){t.plugins=(t.plugins||[]).filter(function(n){return n.id!==e})}),Mr(e),q.unsubscribeAll(e),q._removeCss(e),q._clearEnhOf(e);try{ye[e]&&ye[e].manifest.onDisable&&ye[e].manifest.onDisable(Se(e))}catch{}q.closePanelsOf(e),delete ye[e]},byStore:_t,handleKey:function(e){var t=e.target&&e.target.tagName||"",n=t==="INPUT"||t==="TEXTAREA"||t==="SELECT"||e.target&&e.target.isContentEditable;Object.keys(ye).forEach(function(r){var s=ye[r].manifest;Bt(r)&&(s.shortcuts||[]).forEach(function(o){if(!(!o||!o.key||typeof o.run!="function")){var i=o.key.toLowerCase().split("+"),a=i.indexOf("ctrl")>=0,c=i.indexOf("alt")>=0,l=i.indexOf("shift")>=0,u=i.indexOf("meta")>=0,f=i[i.length-1],d=!!e.ctrlKey===a&&!!e.altKey===c&&!!e.shiftKey===l&&!!e.metaKey===u&&String(e.key||"").toLowerCase()===f;if(d&&!(!a&&!c&&!u&&n)){e.preventDefault();try{o.run(Se(r),e)}catch(m){Pe(r,"快捷键错误："+(m.message||m),"error")}}}})})},bootstrap:function(){_t().forEach(function(e){if(!(!e.enabled||!e.source))try{var t=new Function("PluginBus","window",`"use strict";
`+e.source);t(q,window)}catch(n){Pe(e.id,"启动重放失败："+(n.message||n),"error")}})}};window.PluginBus=q;typeof document<"u"&&document.addEventListener&&(document.addEventListener("keydown",function(e){try{q.handleKey(e)}catch{}},!0),document.addEventListener("store:change",function(e){try{q._onStoreUpdate(e&&e.detail)}catch{}}));window.Store&&window.U&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",function(){try{q.bootstrap()}catch{}}):setTimeout(function(){try{q.bootstrap()}catch{}},0));const hi="kaoyan2026_layout",mi=900;function bl(){try{const e=localStorage.getItem(hi);return e==="phone"||e==="workbench"?e:"auto"}catch{return"auto"}}const cn=de(bl());function kl(){try{return window.innerWidth>=mi}catch{return!1}}function ft(){return cn.value==="workbench"?"workbench":cn.value==="phone"?"phone":kl()?"workbench":"phone"}function us(e,t){try{const n=document.documentElement;t&&(n.classList.add("layout-anim"),setTimeout(()=>n.classList.remove("layout-anim"),400)),e==="workbench"?n.setAttribute("data-layout","workbench"):n.removeAttribute("data-layout")}catch{}}us(ft(),!1);let Ln=ft();try{const e=window.matchMedia("(min-width: "+mi+"px)"),t=()=>{if(cn.value!=="auto")return;const n=ft();n!==Ln&&(Ln=n,us(n,!0))};e.addEventListener?e.addEventListener("change",t):e.addListener&&e.addListener(t)}catch{}function gi(){const e=j(()=>cn.value),t=j(()=>ft()),n=j(()=>ft()==="workbench");function r(o){cn.value=o;try{localStorage.setItem(hi,o)}catch{}Ln=ft(),us(Ln,!0)}function s(){r(ft()==="workbench"?"phone":"workbench")}return{pref:e,effective:t,isWorkbench:n,set:r,toggle:s}}let it=null;function Xs(e){it=e}function Sl(){const e={go(r){const s=window.FocusModule;if(s&&s.active){z.show("深度专注进行中，请先点「中断专注」结束再切换","warn",3500);return}Me.push(Qe(r))},refresh(){it&&it()},get current(){const r=Me.currentRoute.value;return String(r.params.id||r.name||"dashboard")}};window.App=e;const t=Vr();window.Theme={get:()=>t.isNight.value?"night":"day",isNight:()=>t.isNight.value,set:r=>{t.set(r),it&&it()},toggle:()=>{t.toggle(),it&&it()}};const n=gi();window.Layout={get:()=>n.pref.value,effective:()=>n.effective.value,isWorkbench:()=>n.isWorkbench.value,set:r=>{n.set(r)},toggle:()=>{n.toggle()}}}const xl={hidden:""},Zs=le({__name:"LegacyPage",setup(e){const t=qr(),n=mo(),r={dashboard:"DashboardModule",scheduler:"SchedulerModule",review:"ReviewModule",photomistake:"PhotoMistakeModule",quiz:"QuizModule",essay:"EssayModule",mistakes:"MistakesModule",heatmap:"HeatmapModule",inspector:"InspectorModule",focus:"FocusModule",concept:"ConceptMapModule",sprint:"SprintModule",decision:"DecisionModule",mental:"MentalModule",reading:"ReadingModule",wordbook:"WordbookModule",polrecite:"PolReciteModule",redline:"RedlineModule",progress:"ProgressModule",plugins:"PluginCenterModule",share:"SharePlazaModule",vizai:"VizAiModule",settings:"SettingsModule"};function s(){return String(t.params.id||t.name||"dashboard")}function o(){return document.getElementById("view")}function i(){const m=o();return{v:m?m.scrollTop:0,w:window.scrollY||window.pageYOffset||0}}function a(m){const p=o();m?(p&&(p.scrollTop=m.v),window.scrollTo(0,m.w)):(p&&(p.scrollTop=0),window.scrollTo(0,0))}const c={};ka(()=>{c[s()]=i()});function l(m){const p=new Map;return m.querySelectorAll("details[open]").forEach(y=>{const h=y.querySelector("summary");if(!h)return;const g=h.textContent.trim();p.set(g,(p.get(g)||0)+1)}),p}function u(m,p){m.size&&p.querySelectorAll("details").forEach(y=>{const h=y.querySelector("summary");if(!h)return;const g=h.textContent.trim(),v=m.get(g);v&&v>0&&(y.open=!0,v===1?m.delete(g):m.set(g,v-1))})}function f(m){const p=o();if(!p)return;const y=s(),h=!!(m&&m.preserveUi),g=h?l(p):null,v=h?i():void 0,S=r[y],_=(S?window[S]:null)||d(y);if(!_||typeof _.render!="function"){n.replace("/dashboard");return}p.innerHTML="",_.render(p),p.querySelector('div[data-pg-slot="top"]')||p.insertAdjacentHTML("afterbegin",'<div data-pg-slot="top" class="pg-slot"></div>'),p.querySelector('div[data-pg-slot="bottom"]')||p.insertAdjacentHTML("beforeend",'<div data-pg-slot="bottom" class="pg-slot"></div>');try{q._onPageRendered(p,y)}catch{}h&&g&&u(g,p),p.querySelectorAll(".pbar-fill").forEach(T=>{requestAnimationFrame(()=>{T.style.width=T.getAttribute("data-w")+"%"})}),h&&v&&a(v)}Br(()=>t.fullPath,async()=>{await go();const m=s();f(),a(c[m])}),un(()=>{Xs(()=>f({preserveUi:!0})),f()}),Sa(()=>Xs(null));function d(m){try{const p=q.tools();for(const h of p)if(h.id===m)return{render(g){const v=q.ctxOf?q.ctxOf(h.pid):{};if(g.innerHTML='<div class="card"><div class="card-title-row"><span class="card-title">'+(h.icon||"🧩")+" "+window.U.esc(h.title)+`</span><button class="btn btn-ghost btn-sm" onclick="App.go('__tools')">← 工具</button></div><div class="muted-sm" style="margin-bottom:8px">插件：`+window.U.esc(h.pid)+'</div></div><div class="plugin-tool-body">'+(typeof h.render=="function"&&h.render(v)||"")+"</div>",typeof h.mount=="function"){const S=g.querySelector(".plugin-tool-body");if(S)try{h.mount(S,v)}catch(_){S.innerHTML='<div class="alert alert-danger">插件渲染失败：'+window.U.esc(_.message||_)+"</div>"}}}};const y=q.maintabs();for(const h of y)if(h.id===m)return{render(g){const v=q.ctxOf?q.ctxOf(h.pid):{};try{h.render(v,g)}catch(S){g.innerHTML='<div class="alert alert-danger">插件主 tab 渲染失败：'+window.U.esc(S.message||S)+"</div>"}}}}catch{}return null}return(m,p)=>(E(),I("div",xl))}}),eo="0.26.4",_l=[`https://cdn.jsdelivr.net/pyodide/v${eo}/full/`,`https://registry.npmmirror.com/-/binary/pyodide/v${eo}/full/`],V=vt({status:"idle",log:[],lastError:"",progress:{pct:0,msg:""}});function to(e){V.log.push(e),V.log.length>200&&V.log.shift()}const Al=`
var py = null;
var st = { runtime: false, numpy: false, sympy: false, mpl: false, font: false, scipy: false };   // 资源状态（资源管理卡数据源）
function post(m) { self.postMessage(m); }
function prewarm(base, fromPct, toPct, label) {
  return fetch(base + 'pyodide.asm.wasm', { cache: 'default' }).then(function (resp) {
    var total = Number(resp.headers.get('content-length') || 0);
    if (!resp.body) { post({ type: 'progress', pct: toPct, msg: label + ' 完成' }); return; }
    var reader = resp.body.getReader();
    var got = 0;
    function mb(n) { return (n / 1048576).toFixed(1); }
    function pump() {
      return reader.read().then(function (r) {
        if (r.done) { post({ type: 'progress', pct: toPct, msg: label + ' 完成' }); return; }
        got += r.value.length;
        var pct = total > 0 ? (fromPct + (toPct - fromPct) * (got / total)) : ((fromPct + toPct) / 2);
        post({ type: 'progress', pct: pct, msg: label + ' ' + mb(got) + ' / ' + (total > 0 ? mb(total) + ' MB' : '') });
        return pump();
      });
    }
    return pump();
  }).catch(function () { /* 预取失败不阻断（importScripts 会再抓，命中缓存） */ });
}
var mplLoading = null;
function installFont() {
  // 中文字体（SimHei ≈4.7MB，仅首次）：DejaVu 无 CJK 字形，不装则图内中文全是
  // 方框（Font does not have a glyph）。raw.githubusercontent 被墙 → 仅 jsDelivr 源，
  // 失败不阻断（提示词已教模型该场景改用 LaTeX/英文标注）。
  var FONTS = ['https://cdn.jsdelivr.net/gh/StellarCN/scp_zh@master/fonts/SimHei.ttf'];
  var tryFont = function (i) {
    if (i >= FONTS.length) return Promise.resolve(false);
    return fetch(FONTS[i], { cache: 'force-cache' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.arrayBuffer();
    }).then(function (buf) {
      py.FS.writeFile('/SimHei.ttf', new Uint8Array(buf));
      var FSET = 'from matplotlib import font_manager as _fm\\n' +
        "_fm.fontManager.addfont('/SimHei.ttf')\\n" +
        'import matplotlib as _m\\n' +
        "_m.rcParams['font.family'] = 'sans-serif'\\n" +
        "_m.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']\\n" +
        "_m.rcParams['axes.unicode_minus'] = False\\n";
      return py.runPythonAsync(FSET);
    }).then(function () { return true; }).catch(function () { return tryFont(i + 1); });
  };
  return tryFont(0);
}
// 画图组件按需装载（exec 自动触发 / 资源管理卡「预载」触发）；并发调用共享同一在途 Promise
function ensureMpl() {
  if (st.mpl) return Promise.resolve();
  if (mplLoading) return mplLoading;
  mplLoading = py.loadPackage('matplotlib', { messageCallback: function (m) { post({ type: 'log', text: String(m).slice(0, 90) }); } }).then(function () {
    st.mpl = true;
    var SETUP = 'import os\\n' +
      "os.environ['MPLBACKEND'] = 'Agg'\\n" +
      'import matplotlib\\n' +
      "matplotlib.use('Agg', force=True)\\n" +
      'import matplotlib.pyplot as _plt\\n' +
      '_plt.savefig = lambda *a, **k: None\\n';
    // 【课本风画图助手】at_style2d / at_style3d：标准右手系 + 原点式坐标轴箭头，
    // 与高数教材例题同款观感。全部 try/except 包裹——任何 mpl 版本差异都不阻断画图。
    var HLP = 'import matplotlib.pyplot as _at_plt\\n' +
      'def at_style2d(ax=None):\\n' +
      '    # 课本风平面坐标：轴过原点、带箭头、淡网格\\n' +
      '    ax = ax or _at_plt.gca()\\n' +
      '    try:\\n' +
      "        ax.spines['left'].set_position('zero'); ax.spines['bottom'].set_position('zero')\\n" +
      "        ax.spines['right'].set_color('none'); ax.spines['top'].set_color('none')\\n" +
      '        ax.grid(True, alpha=0.25)\\n' +
      '        x0, x1 = ax.get_xlim(); y0, y1 = ax.get_ylim()\\n' +
      "        ax.annotate('', xy=(x1, 0), xytext=(x0, 0), arrowprops=dict(arrowstyle='->', color='#555', lw=1.2))\\n" +
      "        ax.annotate('', xy=(0, y1), xytext=(0, y0), arrowprops=dict(arrowstyle='->', color='#555', lw=1.2))\\n" +
      "        _at_plt.text(x1, 0, ' x', color='#333', fontsize=11); _at_plt.text(0, y1, ' y', color='#333', fontsize=11)\\n" +
      '    except Exception: pass\\n' +
      '    return ax\\n' +
      'def at_style3d(ax=None, elev=22, azim=-58):\\n' +
      '    # 课本风标准右手系三维坐标（曲面/空间曲线例题风格）\\n' +
      '    import numpy as _np\\n' +
      '    ax = ax or _at_plt.gca()\\n' +
      '    try: ax.set_box_aspect((1, 1, 1))\\n' +
      '    except Exception: pass\\n' +
      '    ax.view_init(elev=elev, azim=azim)\\n' +
      '    for _p in (ax.xaxis.pane, ax.yaxis.pane, ax.zaxis.pane):\\n' +
      '        try:\\n' +
      '            _p.set_facecolor((0.97, 0.97, 1.0, 0.30)); _p.set_edgecolor((0.75, 0.75, 0.75, 0.35))\\n' +
      '        except Exception: pass\\n' +
      '    try:\\n' +
      '        lims = [ax.get_xlim(), ax.get_ylim(), ax.get_zlim()]\\n' +
      "        for i, lbl in enumerate('xyz'):\\n" +
      '            s = [0.0, 0.0, 0.0]; e = [0.0, 0.0, 0.0]\\n' +
      '            s[i], e[i] = lims[i][0], lims[i][1]\\n' +
      "            ax.plot([s[0], e[0]], [s[1], e[1]], [s[2], e[2]], color='#555', lw=1.2)\\n" +
      '            dv = [(e[j] - s[j]) for j in range(3)]\\n' +
      '            ax.quiver(e[0] - 0.07 * dv[0], e[1] - 0.07 * dv[1], e[2] - 0.07 * dv[2],\\n' +
      "                      0.07 * dv[0], 0.07 * dv[1], 0.07 * dv[2], color='#555', arrow_length_ratio=1.0, lw=1.2)\\n" +
      "            ax.text(e[0] + 0.09 * dv[0], e[1] + 0.09 * dv[1], e[2] + 0.09 * dv[2], lbl, color='#333', fontsize=12)\\n" +
      '    except Exception: pass\\n' +
      '    return ax\\n';
    return py.runPythonAsync(SETUP).then(function () { return py.runPythonAsync(HLP); });
  }).then(function () {
    return installFont();
  }).then(function (fontOk) {
    st.font = !!fontOk;
    post({ type: 'log', text: fontOk
      ? '🧮 matplotlib 已装载（画图就绪 · 中文已支持）'
      : '🧮 matplotlib 已装载（画图就绪；中文字体未就绪——图内中文可能为方框，标注请用 LaTeX/英文）' });
    post({ type: 'mpl-on' });   // 通知主线程记住「本机装过」→ 重启自动从缓存恢复
  }).catch(function (err) {
    mplLoading = null;   // 失败允许重试
    post({ type: 'log', text: '⚠️ matplotlib 装载失败：' + String((err && err.message) || err) });
    throw err;
  });
  return mplLoading;
}
// scipy 按需装载（数值积分/优化；与 matplotlib 同机制：首次 import 自动触发）
var scipyLoading = null;
function ensureScipy() {
  if (st.scipy) return Promise.resolve();
  if (scipyLoading) return scipyLoading;
  scipyLoading = py.loadPackage('scipy', { messageCallback: function (m) { post({ type: 'log', text: String(m).slice(0, 90) }); } }).then(function () {
    st.scipy = true;
    post({ type: 'log', text: '🧮 scipy 已装载（数值积分/优化就绪）' });
  }).catch(function (err) {
    scipyLoading = null;
    post({ type: 'log', text: '⚠️ scipy 装载失败：' + String((err && err.message) || err) });
    throw err;
  });
  return scipyLoading;
}
self.onmessage = function (e) {
  var d = e.data || {};
  // 资源管理卡：状态查询 + 画图组件预载
  if (d.type === 'status') {
    post({ type: 'status-info', st: { runtime: st.runtime, numpy: st.numpy, sympy: st.sympy, mpl: st.mpl, font: st.font, scipy: st.scipy } });
    return;
  }
  if (d.type === 'preload-mpl') {
    if (!py) { post({ type: 'preload-done', ok: false, error: '基础组件未就绪（先下载基础组件）' }); return; }
    // 「预载画图组件」= matplotlib + 中文字体 + scipy 一并装载。
    // mpl 是硬要求（失败即整体失败）；scipy 装载失败只降级为日志警告，不影响画图就绪。
    ensureMpl().then(function () {
      return ensureScipy().catch(function () { /* scipy 失败已在 ensureScipy 内 post 过日志，这里吞掉 */ });
    }).then(function () { post({ type: 'preload-done', ok: true }); })
      .catch(function (err) { post({ type: 'preload-done', ok: false, error: String((err && err.message) || err) }); });
    return;
  }
  if (d.type === 'load') {
    var cdns = d.cdns || [];
    var tryAt = function (i) {
      if (i >= cdns.length) { post({ type: 'load-error', error: '所有下载源均失败（检查网络）' }); return; }
      var base = cdns[i];
      post({ type: 'log', text: '⏳ 下载运行时（' + base.split('/')[2] + '）…' });
      prewarm(base, 0, 68, '运行时内核+标准库').then(function () {
        self.importScripts(base + 'pyodide.js');
        post({ type: 'progress', pct: 72, msg: '初始化 Python 运行时…' });
        return self.loadPyodide({ indexURL: base });
      }).then(function (p) {
        py = p;
        st.runtime = true;
        post({ type: 'progress', pct: 78, msg: '加载 numpy…' });
        return py.loadPackage('numpy', { messageCallback: function (m) { post({ type: 'log', text: String(m).slice(0, 90) }); } });
      }).then(function () {
        st.numpy = true;
        post({ type: 'progress', pct: 86, msg: '加载 sympy（符号验算核心）…' });
        return py.loadPackage('sympy', { messageCallback: function (m) { post({ type: 'log', text: String(m).slice(0, 90) }); } });
      }).then(function () {
        st.sympy = true;
        post({ type: 'progress', pct: 100, msg: '✅ 基础组件就绪（numpy + sympy，Worker 沙箱）' });
        post({ type: 'ready' });
      }).catch(function (err) {
        post({ type: 'load-error', error: String((err && err.message) || err) });
      });
    };
    tryAt(0);
    return;
  }
  if (d.type === 'exec' && py) {
    var out = '';
    py.setStdout({ batched: function (s) { out += s + '\\n'; post({ type: 'stdout', id: d.id, text: s }); } });
    py.setStderr({ batched: function (s) { out += s + '\\n'; post({ type: 'stderr', id: d.id, text: s }); } });
    // 【2026-08-31 用户报障：画图连烧 4 轮全灭】包按需自动装载（matplotlib/scipy，
    // 资源管理卡可预载）；装载失败不阻断执行——用户代码会给出原始报错，模型可据此调整
    var codeStr = String(d.code || '');
    var needs = [];
    if (/matplotlib|pyplot|pylab/.test(codeStr)) needs.push(ensureMpl);
    if (/\b(?:imports+scipy|froms+scipy|scipy.)\b/.test(codeStr)) needs.push(ensureScipy);
    var ensureAll = needs.length
      ? Promise.all(needs.map(function (f) { return f().catch(function () { return null; }); }))
      : Promise.resolve(null);
    ensureAll.then(function () {
      py.runPythonAsync(d.code).then(function () {
        var CAP = 'def __at_capture():\\n' +
          "    import sys\\n" +
          "    if 'matplotlib.pyplot' not in sys.modules: return ''\\n" +
          '    import io, base64\\n' +
          '    import matplotlib.pyplot as plt\\n' +
          "    if not plt.get_fignums(): return ''\\n" +
          '    buf = io.BytesIO()\\n' +
          "    plt.gcf().savefig(buf, format='png', dpi=120, bbox_inches='tight')\\n" +
          "    plt.close('all')\\n" +
          "    return 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()\\n" +
          '__at_capture()';
        return py.runPythonAsync(CAP);
      }).then(function (img) {
        post({ type: 'exec-done', id: d.id, ok: true, output: out.slice(0, 30000), error: '', image: (img && String(img).indexOf('data:image') === 0) ? String(img) : '' });
      }).catch(function (err) {
        post({ type: 'exec-done', id: d.id, ok: false, output: out.slice(0, 30000), error: String((err && err.message) || err), image: '' });
      });
    });
  }
};
`;let he=null,At=null,Dn=null;const Qt=new Map;let Tl=0;const no="kaoyan2026_at_mpl";function yi(e){if(e.type==="log"){to(e.text),Dn&&Dn(e.text);return}if(e.type==="progress"){V.progress.pct=Math.max(0,Math.min(100,Math.round(e.pct))),V.progress.msg=e.msg||"";return}if(e.type==="ready"){V.status="ready",to("✅ 基础组件就绪（numpy + sympy，Worker 沙箱）");try{localStorage.getItem(no)==="1"&&he?.postMessage({type:"preload-mpl"})}catch{}return}if(e.type==="mpl-on"){try{localStorage.setItem(no,"1")}catch{}return}if(e.type==="load-error"){V.status="error",V.lastError=e.error;return}if(e.type==="stdout"||e.type==="stderr"){const t=Qt.get(e.id);t&&(t.stdout+=e.text+`
`);return}if(e.type==="exec-done"){const t=Qt.get(e.id);if(!t)return;clearTimeout(t.timer),Qt.delete(e.id),t.resolve({ok:!!e.ok,output:String(e.output||"").slice(0,1500),error:String(e.error||""),timedOut:!1,image:e.image||""})}}function El(){const e=new Blob([Al],{type:"application/javascript"}),t=new Worker(URL.createObjectURL(e));return t.onmessage=n=>yi(n.data),t.onerror=n=>{V.status="error",V.lastError="Worker 错误："+(n.message||"unknown")},t}function vi(e){return e&&(Dn=e),he&&V.status==="ready"?Promise.resolve(he):At||(V.status="loading",At=new Promise((t,n)=>{const r=El();he=r;const s=i=>{i.type==="ready"?t(r):i.type==="load-error"&&(he=null,At=null,n(new Error(i.error)))},o=r.onmessage;r.onmessage=function(i){const a=i.data||{};(a.type==="ready"||a.type==="load-error")&&(r.onmessage=o,s(a)),yi(a)},r.postMessage({type:"load",cdns:_l})}),At)}function Ol(){try{he&&he.terminate()}catch{}he=null,At=null,V.status="idle"}function Un(e){return vi(e).then(()=>{})}function dn(){return V.status==="ready"}const ar={runtime:!1,numpy:!1,sympy:!1,mpl:!1,font:!1,scipy:!1};function wi(){return new Promise(e=>{if(!he||V.status!=="ready"){e(Object.assign({},ar));return}const t=n=>{const r=n.data||{};r.type==="status-info"&&(he?.removeEventListener("message",t),e(Object.assign({},ar,r.st||{})))};he.addEventListener("message",t),he.postMessage({type:"status"}),setTimeout(()=>{he?.removeEventListener("message",t),e(Object.assign({},ar))},5e3)})}let xt=null;function bi(e){return xt||(e&&(Dn=e),xt=new Promise((t,n)=>{if(!he||V.status!=="ready"){xt=null,n(new Error("基础组件未就绪（先在上方下载基础组件）"));return}let r=!1;const s=(a,c)=>{r||(r=!0,clearTimeout(i),he?.removeEventListener("message",o),xt=null,a?t():n(new Error(c||"预载失败")))},o=a=>{const c=a.data||{};c.type==="preload-done"&&s(!!c.ok,c.error)},i=setTimeout(()=>s(!1,"预载超时（240s）——重试或查看工程台日志"),24e4);he.addEventListener("message",o),he.postMessage({type:"preload-mpl"})}),xt)}function ds(e,t=3e4){return vi().then(n=>new Promise(r=>{const s=++Tl,o={resolve:r,stdout:"",timer:setTimeout(()=>{Qt.delete(s),Ol(),r({ok:!1,output:o.stdout.slice(0,1500),error:"执行超时（"+Math.round(t/1e3)+"s 上限，已强制终止该次执行）",timedOut:!0})},t)};Qt.set(s,o),n.postMessage({type:"exec",id:s,code:String(e||"")})}))}const ki=["你是考研学习的工程助手，可以使用 Python 工具（numpy/sympy/matplotlib 已就绪，按 import 自动加载）。","工作方式（严格遵守）：",'1) 需要执行计算/验算/画图时，只输出一个 JSON 对象：{"tool":"python_exec","code":"<Python代码>"}，',"   不要 markdown 代码块、不要多余文字。代码会真实执行，stdout 与生成的图表会回传给你。","2) 画图用 matplotlib，直接 plt. 即可，图片会自动捕获展示给用户，无需 savefig/show。","3) 得出结论后，直接用正常的简体中文回答用户（自然文字，不要 JSON），结论必须有工具计算结果支撑，不要臆造。","4) 一次任务里可以连续调用工具多轮，直到确有把握。"].join(`
`),Il=["你是考研题目的验算引擎，可以使用 Python 工具（numpy/sympy 已安装）。","工作方式（严格遵守）：","1) 每次只输出一个 JSON 对象，不要 markdown 代码块、不要多余文字。",'2) 需要计算/验算时输出：{"tool":"python_exec","code":"<要执行的Python代码>"}。',"   代码将真实执行，stdout 会回传给你。优先用 sympy 做符号验算，辅以数值代入抽查。",'3) 验算完成或无需工具时输出最终结论：{"final":true,"verdict":"通过|不通过|无法确定","reason":"一句话依据"}。',"4) 多次调用工具直到确有把握；不要臆造计算结果。"].join(`
`);function Ml(e){let t=null;try{t=F.extractRobustJSON(e)}catch{t=null}return t&&typeof t=="object"?t:null}async function fs(e){return $n({system:Il,maxRounds:e.maxRounds||6}).send(e.task,{onStep:e.onStep,isCancelled:e.isCancelled})}function $n(e){const t=e?.maxRounds||8,n=e?.history?.length?e.history.slice():[{role:"system",content:e?.system||ki}];return{history:n,async send(r,s){const o=[];n.push({role:"user",content:r});for(let i=1;i<=t;i++){if(s?.isCancelled&&s.isCancelled()){const u={round:i,type:"text",text:"已取消"};return o.push(u),n.push({role:"assistant",content:"（已取消）"}),s?.onStep&&s.onStep(u),{finalText:"已取消",verdict:"",steps:o,rounds:i}}let a="";try{a=await F.chatMessages(n,{cache:!1,timeout:18e4})}catch(u){return{finalText:"AI 调用失败："+String(u?.message||u),verdict:"",steps:o,rounds:i}}const c=Ml(a);if(c&&c.tool==="python_exec"&&typeof c.code=="string"){const u={round:i,type:"exec",code:c.code};s?.onStep&&s.onStep(u);const f=await ds(c.code);u.output=f.output,u.error=f.error,u.image=f.image,o.push(u),s?.onStep&&s.onStep(u),n.push({role:"assistant",content:a}),n.push({role:"user",content:`工具执行结果：
`+(f.error?"[错误] "+f.error+`
`+f.output:f.output||"(无输出，请用 print 输出结论)")+(f.image?`
[图表已生成并展示给用户]`:"")+`
请继续：需要再调用工具输出 {"tool":...}；可以直接回答用户时输出自然文字（不要 JSON）。`});continue}if(c&&c.final){const u={round:i,type:"final",text:String(c.reason||c.verdict||"")};return o.push(u),s?.onStep&&s.onStep(u),n.push({role:"assistant",content:a}),{finalText:(c.verdict?"【"+c.verdict+"】":"")+(c.reason||""),verdict:String(c.verdict||""),steps:o,rounds:i}}const l={round:i,type:"text",text:a};return o.push(l),s?.onStep&&s.onStep(l),n.push({role:"assistant",content:a}),{finalText:a,verdict:"",steps:o,rounds:i}}return{finalText:"达到最大工具轮次（"+t+"）仍未收敛，请拆小问题或增加轮次。",verdict:"",steps:o,rounds:t}}}}function Cl(e){let t=Ja(),n=!1;return t||(t=yo.aiFloat("🛠 "+e),n=!0),t.toolTask(e,{primary:n})}const ps=["【工程工具模式（已启用：沙箱 Python，numpy/sympy/matplotlib 就绪）】","⚠️ 你【确实拥有】python_exec 工具且它真实可用——本环境不依赖平台工具栏/函数调用开关，",'工具通过在回复中直接输出 JSON 调用（{"tool":"python_exec","code":"…"}），结果会真实回传。','不要因为"以为自己没有工具"而跳过计算或说"我无法执行代码"。',"【多轮循环机制】这不是一次性问答：你输出工具 JSON 后【立即停止本轮】，系统真实执行并把",'stdout/错误作为新消息回传给你，你再继续——来回多轮直到完成；"先输出工具 JSON 等结果"是完全可行且被支持的，不是自言自语。'].join(`
`),Pl=`
`+ps+`
`+['【指令优先级】"只输出题目 JSON"指的是【最终交付物】；计算验证阶段输出工具 JSON 不违反它，恰恰是必经之路。',"【出题工作循环——像人类命题人一样闭环工作（严格遵守）】","① 产生思路：确定考点、解法、难度定位与命题意图。",'② 计算验证：调用 Python 工具（只输出 {"tool":"python_exec","code":"<sympy/numpy 代码>"}）真实算出标准答案与关键中间量——严禁凭感觉编造数值答案。',"③ 闭环调整：检查计算结果——若答案/难度/计算量不符合命题意图，调整思路再算（可多轮）；若发现之前的解法有问题，推翻重来。","④ 验收合格：标准答案经工具确认无误、题面所需数值全部落实。","⑤ 开始出题：围绕已验证的数值与思路，只输出题目 JSON 本体（格式：stem/type/options/answer/solution/trap），不要再带工具标记。","【配图规约（重要）】几何图形/函数图像/积分区域/数据图等需要配图的题：在验证阶段用 python_exec + matplotlib","画出精确图形（figsize≈(4,3)，含坐标轴/刻度/图例，关键点与区域标注清晰）。numpy/sympy【已在环境中装好】；","matplotlib / scipy 首次使用时【自动装载】（直接 import 即可，等待片刻即可）——","严禁 micropip / pyodide.loadPackage / asyncio（不存在也不需要，用了必报错）；","图【不需要 savefig 到文件】（沙箱无文件语义，画完留在内存即可，也无需 plt.show()）；系统自动收取图形作为题目配图，","严禁把文件路径（如 /tmp/xx.png）写进题面/解析/JSON。","【课本风·必用助手】环境已内置 at_style2d / at_style3d——标准右手系、原点式坐标轴箭头、半透明面板，与教材例题同款：",'平面图：ax = plt.gca(); at_style2d(ax)；立体图（曲面/空间曲线/区域/向量）：ax = fig.add_subplot(projection="3d"); at_style3d(ax)。',"图中标注优先用 LaTeX 数学记号（$...$）；已装载黑体，中文标注可用；若日志提示字体未就绪（中文变方框）则改用英文/LaTeX。","若计算结果与预想不符，以计算结果为准调整题面或答案。"].join(`
`),jl=`
`+ps+`
`+['1) 需要计算/验算/画图时，只输出一个 JSON {"tool":"python_exec","code":"<Python代码>"}，代码会真实执行，stdout 与生成的图表会回传给你。',"2) 数学答案与关键中间量必须以工具计算为准；画图直接用 matplotlib。","3) 完成后直接用自然文字回答（保持你原有的输出格式与标记习惯），不要带工具 JSON。"].join(`
`),Nl=`
`+ps+`
`+["【工作方式】凡涉及数学推导、数值验算、统计、画图的问题，先调用 Python 真实算，","结论以工具计算结果为准；本问题不需要计算就直接回答，不必强行调用工具。","【配图规约】画图用 matplotlib（figsize≈(4,3)），直接 import（首次使用自动装载）；","严禁 micropip / pyodide.loadPackage / asyncio；无需 savefig/plt.show（沙箱无文件语义），系统自动收取图形。","【最终交付（最重要）】完成后直接输出最终回答，并【严格保持你原系统提示词规定的输出格式】","（JSON schema、ACTION/QUERY/FLOW 等标记约定原样不变）——工具轮只是工作过程，",'最终回答里不得出现工具 JSON 或"我调用了工具"之类的说明。'].join(`
`),ro='{"tool":',Ll=/^\s*(?:`{0,3}[a-zA-Z]*)?\s*\{\s*"tool"\s*:/;function Dl(e){const t=String(e||"");if(!t.trim())return"hold";if(Ll.test(t))return"tool";const n=t.replace(/^\s*`{0,3}[a-zA-Z]*\s*/,"");return n.length<=ro.length&&ro.indexOf(n)===0?"hold":"final"}function Bl(e){const t=Math.max(1,e.maxRounds||8),n=Cl(e.label||"AI 工程任务");let r=!1;n.onCancel(()=>{r=!0});const s=()=>r||!!(e.signal&&e.signal.aborted)||!!(e.isCancelled&&e.isCancelled()),o=[{role:"system",content:(e.system||"")+Nl}],i=(e.user||"")+`

（环境提醒：本会话支持多轮工具调用——需要计算/画图时输出 {"tool":"python_exec","code":"…"} 并立即停止本轮，Python 会真实执行并把结果回传给你；不需要计算就直接按原格式输出最终回答。）`;return o.push({role:"user",content:e.imageDataUrl?[{type:"text",text:i},{type:"image_url",image_url:{url:e.imageDataUrl}}]:i}),new Promise((a,c)=>{const l=()=>{n.fail("已取消"),c(Object.assign(new Error("已取消"),{cancelled:!0}))},u=(f,d)=>{if(s()){l();return}n.setStatus(f>1?"第 "+f+" 轮 · 等待模型响应…":"任务已发起，等待模型响应…");let m=!1;F.chatMessagesStream(o,function(p,y){if(s())return;const h=String(p||"");y&&n.think(y);const g=Dl(h);if(g!=="hold"){if(g==="tool"){n.roundStream(f,h),m&&e.onChunk&&e.onChunk("",""),m=!1;return}m||(m=!0),n.writing(h),e.onChunk&&e.onChunk(h,y||"")}},{cache:!1,timeout:18e4,signal:e.signal}).then(p=>{if(s()){l();return}const y=String(p||"");let h=null;try{h=F.extractRobustJSON(y)}catch{h=null}const g=!!(h&&h.tool==="python_exec"&&typeof h.code=="string");if(g&&m&&(e.onChunk&&e.onChunk("",""),m=!1),g&&f>=t&&!d){n.setStatus("已达工具轮上限，强制汇总…"),o.push({role:"assistant",content:y}),o.push({role:"user",content:"已达最大工具轮次。请停止调用工具，基于目前已有结果，严格按原格式直接输出最终回答。"}),u(f+1,!0);return}if(g&&d){n.finish(),a(y);return}if(g){n.setStatus("第 "+f+" 轮 · 执行 Python…"),ds(h.code).then(v=>{n.step({round:f,code:h.code,output:v.output,error:v.error,image:v.image}),o.push({role:"assistant",content:y}),o.push({role:"user",content:`工具执行结果：
`+(v.error?"[错误] "+v.error+`
`:"")+(v.output||"(无输出，请用 print 输出关键结论)")+(v.image?`
（图形已收录，最终回答可引用）`:"")+`
请继续：还需要计算/画图就输出 {"tool":...}；完成了就按原格式直接输出最终回答。`}),u(f+1,d)}).catch(v=>{const S=String(v?.message||v);n.step({round:f,code:h.code,output:"",error:S}),o.push({role:"assistant",content:y}),o.push({role:"user",content:"工具执行异常："+S+`
请调整思路，按原格式输出最终回答。`}),u(f+1,d)});return}if(!y.trim()){if(f>t){n.fail("模型返回空内容"),c(new Error("模型返回空内容"));return}n.setStatus("返回为空，重试中…"),u(f+1,d);return}e.onChunk&&!m&&e.onChunk(y,""),n.finish(),a(y)}).catch(p=>{if(s()){n.fail("已取消"),c(Object.assign(new Error("已取消"),{cancelled:!0}));return}n.fail(String(p?.message||p)),c(p)})};u(1,!1)})}const pt=vt({running:!1,steps:[]});function Nt(){const e=w.get().settings;return!!(e.aiTools&&e.aiTools.enabled)}function Si(e){w.update(t=>{t.settings.aiTools=Object.assign({enabled:!1},t.settings.aiTools,{enabled:e})})}function Bn(){try{const e=w.get().settings;return!(e.aiTools&&e.aiTools.scopeAll===!1)}catch{return!0}}function xi(e){w.update(t=>{t.settings.aiTools=Object.assign({enabled:!1},t.settings.aiTools,{scopeAll:e})})}function ql(){xi(!Bn()),window.App&&window.App.refresh()}function Rl(){const e=Nt(),t=V.status,n=t==="ready"?"已就绪":t==="loading"?"下载中…":t==="error"?"加载失败":"未下载";return'<div class="card" id="st-aitools-card"><div class="card-title-row"><span class="card-title">🧪 AI 工程台（实验功能）</span><button class="btn btn-ghost btn-sm" onclick="window.AiTools.settingsGo()">打开</button></div><div class="muted-sm" style="margin-bottom:6px">给 AI 增加真实工程能力：全站各模块的 AI（出题、批改、复盘、规划、教练对话等）自动获得多轮长程任务——调用本地 Python（numpy/sympy/matplotlib）真实计算、验算、画图，过程在右下角任务卡实时可见、可随时取消。默认关闭，不影响现有任何功能。</div><div class="muted-sm" style="margin-bottom:6px">状态：'+(e?"已启用":"未启用")+" · 组件："+n+(e?" · 覆盖："+(Bn()?"全部模块":"仅测验/教练"):"")+'</div><div class="btn-row"><button class="btn btn-sm '+(e?"btn-ghost":"btn-primary")+'" onclick="window.AiTools.settingsToggle()">'+(e?"停用":"启用（本机）")+"</button>"+(e?'<button class="btn btn-sm btn-ghost" onclick="window.AiTools.settingsDownload()">'+(t==="ready"?"重新下载组件":"下载扩展组件（约10MB）")+"</button>":"")+(e?'<button class="btn btn-sm btn-ghost" data-testid="at-scope-btn" onclick="window.AiTools.settingsScope()">'+(Bn()?"覆盖范围：全部模块（点击退回仅测验/教练）":"覆盖范围：仅测验/教练（点击扩展到全部模块）")+"</button>":"")+"</div></div>"+(e?_i():"")}function Jl(){Si(!Nt()),window.App&&window.App.refresh()}function Hl(){window.Toast&&window.Toast.show("⏳ 正在下载扩展组件（约 10MB，仅此一次）…","info",8e3),Un(e=>{window.Toast&&window.Toast.show(e,"info",3e3)}).then(()=>{window.Toast&&window.Toast.success("✅ 扩展组件就绪（numpy + sympy）"),window.App&&window.App.refresh()}).catch(e=>{window.Toast&&window.Toast.danger("扩展组件加载失败："+String(e?.message||e))})}function Gl(){window.App&&window.App.go("aitools")}function _i(){const t='<div class="card" id="at-res-card"><div class="card-title-row"><span class="card-title">📦 组件资源管理</span><button class="btn btn-ghost btn-sm" onclick="window.AiTools.resRefresh()">↻ 刷新状态</button></div><div class="muted-sm" style="margin-bottom:6px">基础组件随首次下载安装；画图/数值组件默认「首次使用时按需下载」——重度用户可点「预载」提前装好，出题配图与 scipy 计算零等待。装过即记忆：重启后自动从缓存后台恢复，无需手动操作。</div>'+[["runtime","Pyodide 运行时（内核 + 标准库）","≈10MB",!0],["numpy","numpy（数值计算）","≈7MB",!0],["sympy","sympy（符号验算核心）","≈11MB",!0],["mpl","matplotlib（精确画图）","≈9MB",!1],["font","SimHei 中文字体（图内中文）","≈4.7MB",!1],["scipy","scipy（数值积分/优化）","≈12MB",!1]].map(function(n){return'<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--line);font-size:12.5px"><span style="flex:1">'+n[1]+(n[3]?' <span class="tag">基础</span>':' <span class="tag">画图</span>')+'</span><span class="muted-sm" style="width:64px;text-align:right">'+n[2]+'</span><span data-rs="'+n[0]+'" style="width:84px;text-align:right;font-weight:600">…</span></div>'}).join("")+'<div class="btn-row" style="margin-top:8px"><button class="btn btn-sm btn-primary" onclick="window.AiTools.resPreload()">🎨 预载画图组件（matplotlib + 中文字体 + scipy ≈26MB）</button></div></div>';return setTimeout(()=>{if(typeof document<"u"&&document.body)try{ln()}catch{}},60),setTimeout(()=>{if(typeof document<"u"&&document.body)try{ln()}catch{}},4e3),t}function ln(){wi().then(e=>{if(typeof document>"u"||!document.body)return;const t={runtime:e.runtime,numpy:e.numpy,sympy:e.sympy,mpl:e.mpl,font:e.font,scipy:e.scipy};Object.keys(t).forEach(n=>{const r=document.querySelector('[data-rs="'+n+'"]');r&&(r.textContent=t[n]?"✓ 已装载":"未装载",r.style.color=t[n]?"var(--ok,#237804)":"var(--text-muted,#888)")})}).catch(()=>{})}function zl(){const e=window.Toast;if(!dn()){e&&e.warn("基础组件未就绪——先点上方「下载扩展组件」");return}e&&e.show("⏳ 正在预载画图组件（matplotlib + 中文字体 + scipy ≈26MB，仅首次，视网速约 1~3 分钟）…","info",1e4),bi(t=>{e&&e.show(t,"info",3e3)}).then(()=>{e&&e.success("✅ 画图 + scipy 组件就绪——出题配图与数值计算零等待"),ln()}).catch(t=>{e&&e.danger("预载失败："+String(t.message||t)),ln()})}function Ul(e,t,n,r){pt.running=!0,pt.steps=[];const s=["请验算下面这道考研题目的答案是否正确。","【题目】"+(e||"（无题干）"),"【给出的答案】"+(t||"（无）"),"【给出的解析】"+(n||"（无）"),"要求：先用 sympy 独立重新求解/验算（不要照抄解析），再数值代入抽查，最后给出结论。"].join(`
`);return fs({task:s,maxRounds:6,onStep:o=>{pt.steps.push(o),r&&r.onStep&&r.onStep(o)},isCancelled:r&&r.isCancelled}).finally(()=>{pt.running=!1})}const $l=new Map,qt=new Map,An=new Map;function tt(e){return String(e||"").replace(/</g,"&lt;")}function zt(e,t,n,r,s){const o=[],i=(u,f,d)=>{e.innerHTML='<div class="card" style="margin-top:12px" data-testid="at-verify-card"><div class="card-title-row"><span class="card-title">'+s+'</span><span class="tag" style="background:'+(u==="通过"?"#237804":u==="不通过"?"#cf1322":"#8c8c8c")+';color:#fff">'+(d?"验算中…":u||"完成")+"</span></div>"+o.join("")+'<div style="margin-top:6px"><b style="color:'+(u==="通过"?"#237804":u==="不通过"?"#cf1322":"inherit")+'">'+(d?"AI 正在自主调用 Python 工具验算…":tt(f||"完成"))+"</b></div></div>"},a=t.get(n);if(a){i(a.verdict,a.report,!1);return}const c=An.get(n);if(c){i("","",!0),c.then(u=>i(u.verdict,u.report,!1)).catch(u=>i("失败","验算失败："+String(u?.message||u),!1));return}i("","",!0);const l=fs({task:r,maxRounds:6,onStep:u=>{u.type==="exec"&&(o.push('<details style="margin-top:6px"><summary class="muted-sm" style="cursor:pointer">第 '+u.round+' 轮 · AI 调用 Python 工具（点击展开代码与输出）</summary><pre class="report" style="font-size:12px">'+tt(u.code)+'</pre><pre class="report" style="font-size:12px;opacity:.8">输出：'+tt(u.output||"(无)")+(u.error?`
错误：`+tt(u.error):"")+"</pre></details>"),i("","",!0))}}).then(u=>{if(t.set(n,{verdict:u.verdict,report:u.finalText}),t.size>30){const f=t.keys().next().value;f!==void 0&&t.delete(f)}return i(u.verdict,u.finalText,!1),{verdict:u.verdict,report:u.finalText}}).catch(u=>{throw i("失败","验算失败："+String(u?.message||u),!1),u});An.set(n,l),l.finally(()=>{An.delete(n)}),l.catch(()=>{})}function Fl(e){const t=[{role:"system",content:e.system+`
`+Pl},{role:"user",content:e.ask+`

（环境提醒：本会话支持多轮工具调用——需要计算时输出 {"tool":"python_exec","code":"…"} 并立即停止本轮，Python 会真实执行并把结果回传给你。数学题的标准答案必须先用它算出。）`}],n=8,r=[];return new Promise((s,o)=>{const i=a=>{if(e.isCancelled&&e.isCancelled()){o(Object.assign(new Error("已取消"),{cancelled:!0}));return}F.chatMessagesStream(t,function(c,l){e.onStream&&e.onStream(c||"",l||"")},{cache:!1,timeout:18e4}).then(c=>{let l=null;try{l=F.extractRobustJSON(c)}catch{l=null}if(l&&l.tool==="python_exec"&&typeof l.code=="string"){ds(l.code).then(u=>{if(u.image&&String(u.image).indexOf("data:image")===0&&r.push(u.image),e.onStep&&e.onStep({round:a,type:"exec",code:l.code,output:u.output,error:u.error,image:u.image}),t.push({role:"assistant",content:c}),t.push({role:"user",content:`工具执行结果：
`+(u.error?"[错误] "+u.error+`
`:"")+(u.output||"(无输出，请用 print 输出结论)")+(u.image?`
（图形已收录，可作为题目配图）`:"")+`
请继续：需要再算/画图输出 {"tool":...}；算好了只输出题目 JSON 本体。`}),a>=n){o(new Error("达到最大工具轮次仍未输出题目 JSON"));return}i(a+1)});return}if(l&&l.stem){delete l.tool,r.length&&(l.diagramImg=r[r.length-1],l.diagrams=r.slice()),s(l);return}if(a>=n){o(new Error("AI 未输出有效题目 JSON。最后输出前200字："+c.slice(0,200)));return}t.push({role:"assistant",content:c}),t.push({role:"user",content:"请严格只输出题目 JSON 本体（含 stem/type/options/answer/solution/trap 字段），不要其他内容。"}),i(a+1)}).catch(o)};i(1)})}function Kl(e,t){try{if(!e||!Nt())return;if(!dn()){e.innerHTML='<div class="muted-sm" style="margin-top:10px">🧪 AI 工程验算：组件未就绪（到「AI 工程台」下载扩展组件后，出题将自动附带 sympy 真实验算）。</div>';return}const n=["请验算下面这道考研题目的答案是否正确。","【题目】"+(t.stem||"（无题干）"),"【给出的答案】"+(t.answer||"（无）"),"【给出的解析】"+(t.solution||"（无）"),"要求：先用 sympy 独立重新求解/验算（不要照抄解析），再数值代入抽查，最后给出结论。"].join(`
`);zt(e,$l,t.key,n,"🧪 AI 工程验算（sympy 真实计算）")}catch{}}function Vl(e,t){try{if(!Nt())return;(t||[]).forEach(n=>{if(!n||!n.aiAnalysis||!(n.aiAnalysis.keySteps||n.aiAnalysis.solution))return;const r=e.querySelector('[data-pm-verify="'+n.id+'"]');if(!r)return;const s=n.id+"|"+(n.updatedAt||n.createdAt||""),o="🧪 AI 工程验算（解析防幻觉）";if(qt.get(s)){zt(r,qt,s,"",o);return}if(An.has(s)){zt(r,qt,s,"",o);return}r.innerHTML='<div class="card" style="margin-top:12px"><div class="card-title-row"><span class="card-title">🧪 AI 工程验算（解析防幻觉）</span></div><div class="btn-row"><button class="btn btn-sm btn-ghost" data-pm-verify-run="'+n.id+'">🔬 手动验算（AI 调 sympy 核对解析，消耗 token）</button></div></div>';const a=r.querySelector('[data-pm-verify-run="'+n.id+'"]');a&&(a.onclick=function(){const c=["请验算这道拍题的 AI 解析是否正确（防解析幻觉）。","【题目】"+(n.extractedQuestion||n.note||"（无题干）"),"【AI 给出的解题关键】"+(n.aiAnalysis.keySteps||n.aiAnalysis.solution||"（无）"),"【易错原因】"+(n.aiAnalysis.errorCause||"（无）"),"要求：先用 sympy 独立重新求解（不要照抄解析），对照 AI 的解题关键逐步核对，再数值代入抽查，最后给出结论（AI 解析有错请明确指出错在哪一步）。"].join(`
`);if(dn()){zt(r,qt,s,c,o);return}const l=u=>{r.innerHTML='<div class="muted-sm" style="margin-top:10px">⏳ '+String(u||"").replace(/</g,"&lt;")+"</div>"};l("正在加载工程组件（约 10MB，仅首次）…"),Un(u=>l(u)).then(()=>zt(r,qt,s,c,o)).catch(u=>{r.innerHTML='<div class="muted-sm" style="margin-top:10px">工程组件加载失败：'+String(u&&u.message||u).replace(/</g,"&lt;")+"（检查网络后重试）</div>"})})})}catch{}}var Tt=null;function Ql(){Tt=null}function Yl(e,t){if(Tt&&!t?.fresh)return e.innerHTML="",e.appendChild(Tt.root),Tt.panel;var n=document.createElement("div");n.innerHTML='<div class="card"><div class="card-title-row"><span class="card-title">🤖 AI 工程出题中…</span><button class="btn btn-sm btn-ghost" data-testid="qes-cancel">取消</button></div><div style="margin:6px 0"><span class="tag" data-testid="qes-status" style="background:#8c8c8c;color:#fff"></span></div><details open style="margin-top:8px"><summary class="muted-sm" style="cursor:pointer">💭 思考过程（实时流式）</summary><pre class="report" data-testid="qes-think" style="max-height:220px;overflow:auto;opacity:.72;font-size:12px;white-space:pre-wrap;margin-top:4px"></pre></details><div data-testid="qes-tools" style="margin-top:8px"></div><div data-testid="qes-content-wrap" style="display:none;margin-top:10px"><div class="card-title-sm">📝 题面生成（基于已验证数值）</div><pre class="report" data-testid="qes-content" style="max-height:260px;overflow:auto;white-space:pre-wrap;font-size:12px"></pre></div></div>',e.innerHTML="",e.appendChild(n);var r=0,s=!1,o=null,i=0,a=n.querySelector('[data-testid="qes-status"]'),c=n.querySelector('[data-testid="qes-think"]'),l=n.querySelector('[data-testid="qes-think-wrap"]'),u=n.querySelector('[data-testid="qes-tools"]'),f=n.querySelector('[data-testid="qes-content"]'),d=n.querySelector('[data-testid="qes-content-wrap"]'),m=n.querySelector('[data-testid="qes-cancel"]');m&&t&&t.onCancel&&(m.onclick=function(){t.onCancel()});var p=!1,y=0,h=null;function g(){p=!0,y=Date.now(),h&&clearInterval(h);var T=function(){if(p){var A=Math.round((Date.now()-y)/1e3);S("📤 已发送出题请求，等待模型响应…（"+A+"s）"),h=setTimeout(T,1e3)}};T()}function v(){p=!1,h&&(clearInterval(h),h=null)}function S(T,A){a&&(a.textContent=T,A&&(a.style.background=A))}g();var _={setStatus:S,stream:function(T,A){s||(s=!0,v(),S("✅ 已连接 · 流式接收中…","#1a7f37")),A&&(l&&(l.style.display=""),c&&(c.textContent=A,c.scrollTop=c.scrollHeight));var M=String(T||"").trim();if(M.indexOf('{"tool"')===0){var D=r+1;S("🛠 第 "+D+" 轮：AI 正在构造 Python 计算代码…","#8c8c8c"),(i!==D||!o||!o.parentNode)&&(o&&o.parentNode&&o.parentNode.removeChild(o),o=document.createElement("details"),o.setAttribute("data-round-draft",String(D)),o.style.margin="6px 0",o.open=!0,o.innerHTML='<summary class="muted-sm" style="cursor:pointer">🛠 第 '+D+' 轮 · 正在构造 Python 计算代码…</summary><pre class="report" style="font-size:12px;white-space:pre-wrap"></pre>',u&&u.appendChild(o),i=D);var O=o.querySelector("pre");if(O)try{O.textContent=JSON.parse(M).code||M}catch{O.textContent=M}return}M&&(v(),S("✍ 正在撰写题面（基于已验证数值）…","#1a7f37"),d&&(d.style.display=""),f&&(f.textContent=M,f.scrollTop=f.scrollHeight))},toolRound:function(T,A,M,D,O){if(r=Math.max(r,T),v(),o&&i===T&&(o.parentNode&&o.parentNode.removeChild(o),o=null,i=0),S("🛠 第 "+T+" 轮计算完成 ✓ → 继续分析结果…","#1a7f37"),!!u){u.style.display="";var R=document.createElement("details");R.style.margin="6px 0",R.open=!0,R.innerHTML='<summary class="muted-sm" style="cursor:pointer">🛠 第 '+T+" 轮 · Python 计算完成"+(D?"（出错，已回传修正）":" ✓")+'</summary><pre class="report" style="font-size:12px;white-space:pre-wrap">'+tt(A)+'</pre><pre class="report" style="font-size:12px;opacity:.8;white-space:pre-wrap">→ 输出：'+tt(M||"(无)")+(D?`
错误：`+tt(D):"")+"</pre>"+(O?'<img src="'+tt(O)+'" alt="工具产图" style="max-width:100%;border-radius:8px;border:1px solid var(--line);margin-top:6px;background:#fff">':""),u.appendChild(R)}},done:function(){v(),S("✅ 完成","#237804"),Tt=null}};return Tt={root:n,panel:_},_}const ze=vt({items:[],running:!1});let yt=null;function Wl(){return yt||(yt=$n({system:ki,maxRounds:8})),yt}function Ai(e,t){if(e=String(e||"").trim(),!e||ze.running)return;if(!dn()){window.Toast&&window.Toast.warn("扩展组件未就绪，请先下载（约 10MB）");return}ze.items.push({role:"user",text:e,steps:[]});const n=vt({role:"assistant",text:"",steps:[],image:""});ze.items.push(n),ze.running=!0,Wl().send(e,{onStep:r=>{r.type==="exec"&&(n.steps.push(r),r.image&&(n.image=r.image))},isCancelled:t}).then(r=>{n.text=r.finalText||"（完成）"}).catch(r=>{n.text="AI 调用失败："+String(r?.message||r)}).finally(()=>{ze.running=!1,Ti()})}const hs="kaoyan2026_aitools_chat";function Xl(e){return $n({system:(e||"")+jl,maxRounds:8})}function Cr(){yt=null,ze.items.length=0;try{localStorage.removeItem(hs)}catch{}}function Ti(){try{const e=yt?yt.history.slice(-40):[],t=ze.items.slice(-30);localStorage.setItem(hs,JSON.stringify({hist:e,items:t}))}catch{}}function Zl(){try{const e=localStorage.getItem(hs);if(!e)return;const t=JSON.parse(e);Array.isArray(t.items)&&t.items.length&&t.items.forEach(function(n){ze.items.push({role:n.role==="user"?"user":"assistant",text:String(n.text||""),steps:Array.isArray(n.steps)?n.steps:[],image:n.image||""})}),Array.isArray(t.hist)&&t.hist.length&&(yt=$n({history:t.hist}))}catch{}}function eu(){try{if(!Nt()||V.status!=="idle")return;setTimeout(function(){Un(function(){}).catch(function(){})},1500)}catch{}}const ht={settingsCard:Rl,settingsToggle:Jl,settingsDownload:Hl,settingsGo:Gl,resourceCard:_i,resRefresh:ln,resPreload:zl,ensureLoaded:Un,isReady:dn,loaderState:V,pytoolsState:pt,chatState:ze,renderExamPanel:Yl,resetExamPanel:Ql,newCoachSession:Xl,chatSend:Ai,chatReset:Cr,saveChat:Ti,restoreChat:Zl,maybeAutoLoad:eu,verifyAnswer:Ul,quizAutoVerify:Kl,photoAutoVerify:Vl,generateQuestion:Fl,runAgent:fs,enabled:Nt,setEnabled:Si,toolChat:Bl,scopeAll:Bn,setScopeAll:xi,settingsScope:ql};try{window.AiTools=ht}catch{}const tu=["innerHTML"],cr=le({__name:"TexText",props:{source:{}},setup(e){const t=e,n=j(()=>Fe.renderInline(t.source||""));return(r,s)=>(E(),I("span",{class:"tex-text",innerHTML:n.value},null,8,tu))}}),nu={class:"card",style:{"margin-top":"24px"},"data-testid":"aitools-page"},ru={class:"card-title-row"},su={class:"btn-row",style:{margin:"8px 0"}},ou=["disabled"],iu={key:0,style:{margin:"8px 0"},"data-testid":"dl-progress"},au={class:"pbar",style:{height:"12px",background:"var(--surface-muted)"}},cu={class:"muted-sm",style:{"margin-top":"4px","font-variant-numeric":"tabular-nums"}},lu={key:1,class:"muted-sm",style:{"white-space":"pre-wrap","font-size":"12px"},"data-testid":"dl-logs"},uu={key:2,style:{"margin-top":"14px"},class:"card-inner","data-testid":"at-res"},du={style:{flex:"1"}},fu={class:"chip",style:{"font-size":"11px"}},pu={class:"muted-sm",style:{width:"64px","text-align":"right"}},hu={class:"btn-row",style:{"margin-top":"8px"}},mu=["disabled"],gu={key:0,class:"muted-sm",style:{"white-space":"pre-wrap","font-size":"12px"},"data-testid":"at-res-logs"},yu={style:{"margin-top":"14px"},class:"card-inner","data-testid":"at-chat"},vu={class:"card-title-row"},wu={style:{"max-height":"460px",overflow:"auto",margin:"6px 0"}},bu={key:0,style:{"text-align":"right"}},ku={class:"chip",style:{"white-space":"pre-wrap"}},Su={key:1},xu=["open"],_u={class:"muted-sm",style:{cursor:"pointer"}},Au={class:"report",style:{"font-size":"12px"}},Tu={class:"report",style:{"font-size":"12px",opacity:".8"}},Eu=["src"],Ou={key:1,style:{"margin-top":"4px"}},Iu={key:0,class:"muted-sm"},Mu={key:1,class:"muted-sm"},Cu={style:{display:"flex",gap:"8px","align-items":"flex-end"}},Pu=["disabled"],ju={style:{"margin-top":"14px"},class:"card-inner"},Nu={class:"btn-row",style:{margin:"8px 0"}},Lu=["disabled"],Du=["open"],Bu={class:"muted-sm",style:{cursor:"pointer"}},qu={key:0,class:"report",style:{"font-size":"12px"}},Ru={key:1,class:"report",style:{"font-size":"12px",opacity:".8"}},Ju={key:2},Hu={key:0,class:"card",style:{"margin-top":"8px"},"data-testid":"at-report"},Gu={style:{"margin-top":"4px"}},zu=le({__name:"AiToolsPage",setup(e){const t=j(()=>ht.enabled()),n=[{k:"runtime",name:"Pyodide 运行时（内核 + 标准库）",size:"≈10MB",core:!0},{k:"numpy",name:"numpy（数值计算）",size:"≈7MB",core:!0},{k:"sympy",name:"sympy（符号验算核心）",size:"≈11MB",core:!0},{k:"mpl",name:"matplotlib（精确画图）",size:"≈9MB",core:!1},{k:"font",name:"SimHei 中文字体（图内中文）",size:"≈4.7MB",core:!1},{k:"scipy",name:"scipy（数值积分/优化，按需）",size:"≈12MB",core:!1}],r=vt({runtime:!1,numpy:!1,sympy:!1,mpl:!1,font:!1,scipy:!1}),s=de(!1),o=de(!1),i=de([]);async function a(){try{const R=await wi();Object.assign(r,R),s.value=!0}catch{}}async function c(){if(!o.value){o.value=!0,i.value=[];try{await bi(R=>{i.value.push(R)}),i.value.push("✅ 画图组件就绪——出题配图零等待")}catch(R){i.value.push("✗ "+String(R?.message||R))}finally{o.value=!1,await a()}}}Br(()=>V.status,R=>{R==="ready"&&(a(),setTimeout(()=>{a()},4e3))},{immediate:!0});const l=de([]),u=de(!1);async function f(){u.value=!0,l.value=[];try{await ht.ensureLoaded(R=>{l.value.push(R)}),l.value.push("✅ 就绪")}catch(R){l.value.push("✗ "+String(R?.message||R))}finally{u.value=!1}}function d(){ht.setEnabled(!t.value)}const m=vt({stem:"",answer:"",solution:""}),p=j(()=>pt.running),y=j(()=>pt.steps),h=de(""),g=de(""),v=de(!1);async function S(){if(p.value)return;h.value="",g.value="",v.value=!1;const R=await ht.verifyAnswer(m.stem,m.answer,m.solution,{isCancelled:()=>v.value});h.value=R.finalText,g.value=R.verdict}function _(){v.value=!0}const T=ze,A=de("");let M=!1;function D(){if(T.running||!A.value.trim())return;M=!1;const R=A.value;A.value="",Ai(R,()=>M),go(()=>{const L=document.querySelector('[data-testid="at-chat"] > div:nth-child(3)');L&&(L.scrollTop=L.scrollHeight)})}function O(){M=!0}return(R,L)=>(E(),I("div",nu,[b("div",ru,[L[6]||(L[6]=b("span",{class:"card-title"},[X("🧪 AI 工程台 "),b("span",{class:"muted-sm"},"（实验功能）")],-1)),b("span",{class:"chip",style:Ve(U(V).status==="ready"?"color:#237804":"")},C(U(V).status==="ready"?"组件就绪":U(V).status==="loading"?"下载中…":U(V).status==="error"?"组件加载失败":"组件未下载"),5)]),L[15]||(L[15]=b("div",{class:"muted-sm",style:{"margin-bottom":"8px"}},[X(" 给 AI 增加真实工程能力：多轮调用 Python（numpy/sympy）做符号验算、数值抽查、画图。 两套方案自由选择："),b("b",null,"不启用 = 与现有完全一致"),X("（零下载零差异）；启用后仅本页与设置页入口生效。 ")],-1)),b("div",su,[b("button",{class:fe(["btn btn-sm",t.value?"btn-primary":"btn-ghost"]),"data-testid":"at-toggle",onClick:d},C(t.value?"✓ 已启用（点击停用）":"方案A：启用工程能力"),3),t.value?(E(),I("button",{key:0,class:"btn btn-sm btn-ghost","data-testid":"at-download",disabled:u.value||U(V).status==="ready",onClick:f},C(U(V).status==="ready"?"组件已就绪":u.value?"下载中…":"下载扩展组件（约10MB，仅一次）"),9,ou)):$("",!0)]),u.value?(E(),I("div",iu,[b("div",au,[b("div",{style:Ve([{height:"100%","border-radius":"999px",transition:"width .3s",background:"linear-gradient(90deg,#2f54eb,#7aa2ff)",width:"0%"},{width:U(V).progress.pct+"%"}])},null,4)]),b("div",cu,C(U(V).progress.pct)+"% · "+C(U(V).progress.msg||"准备下载…"),1)])):$("",!0),l.value.length?(E(),I("div",lu,C(l.value.join(`
`)),1)):$("",!0),t.value?(E(),I("div",uu,[b("div",{class:"card-title-row"},[L[7]||(L[7]=b("span",{class:"card-title"},"📦 组件资源管理",-1)),b("button",{class:"btn btn-ghost btn-sm","data-testid":"at-res-refresh",onClick:a},"↻ 刷新状态")]),L[8]||(L[8]=b("div",{class:"muted-sm",style:{"margin-bottom":"6px"}}," 基础组件随首次下载安装；画图组件默认「首次画图时按需下载」——重度可视化用户可点「预载」提前装好，出题配图零等待。 装过即记忆：重启后自动从缓存后台恢复，无需手动操作。 ",-1)),(E(),I(K,null,ce(n,J=>b("div",{key:J.k,style:{display:"flex","align-items":"center",gap:"8px",padding:"5px 0","border-bottom":"1px solid var(--line)","font-size":"12.5px"}},[b("span",du,[X(C(J.name)+" ",1),b("span",fu,C(J.core?"基础":"画图"),1)]),b("span",pu,C(J.size),1),b("span",{style:Ve([{width:"84px","text-align":"right","font-weight":"600"},r[J.k]?"color:#237804":"opacity:.55"])},C(s.value?r[J.k]?"✓ 已装载":"未装载":U(V).status==="ready"?"查询中…":"未下载"),5)])),64)),b("div",hu,[b("button",{class:"btn btn-sm btn-primary",disabled:o.value||U(V).status!=="ready","data-testid":"at-res-preload",onClick:c},C(o.value?"⏳ 预载中…":"🎨 预载画图组件（matplotlib + 中文字体 ≈14MB）"),9,mu)]),i.value.length?(E(),I("div",gu,C(i.value.join(`
`)),1)):$("",!0)])):$("",!0),t.value?(E(),I(K,{key:3},[b("div",yu,[b("div",vu,[L[9]||(L[9]=b("span",{class:"card-title"},"💬 工程对话（AI 自主编排工具）",-1)),b("button",{class:"btn btn-ghost btn-sm","data-testid":"at-chat-reset",onClick:L[0]||(L[0]=(...J)=>U(Cr)&&U(Cr)(...J))},"清空会话")]),L[10]||(L[10]=b("div",{class:"muted-sm",style:{"margin-bottom":"6px"}}," 像网页端 AI 平台一样问一句话，AI 连续自主调用 Python（验算/画图/数据处理）后作答。会话在本页驻留。 ",-1)),b("div",wu,[(E(!0),I(K,null,ce(U(T).items,(J,G)=>(E(),I("div",{key:G,style:{margin:"8px 0"}},[J.role==="user"?(E(),I("div",bu,[b("span",ku,C(J.text),1)])):(E(),I("div",Su,[(E(!0),I(K,null,ce(J.steps,(Z,H)=>(E(),I("details",{key:H,style:{margin:"4px 0"},open:H===J.steps.length-1&&!J.text},[b("summary",_u,"第 "+C(H+1)+" 次工具 · Python "+C(Z.error?"❌":"✓"),1),b("pre",Au,C(Z.code),1),b("pre",Tu,[X("输出："+C(Z.output||"(无)"),1),Z.error?(E(),I(K,{key:0},[X(C(`
`)+"错误："+C(Z.error),1)],64)):$("",!0)])],8,xu))),128)),J.image?(E(),I("img",{key:0,src:J.image,style:{"max-width":"100%",border:"1px solid var(--line)","border-radius":"8px",margin:"4px 0"},alt:"AI 生成图表"},null,8,Eu)):$("",!0),J.text?(E(),I("div",Ou,[ie(cr,{source:J.text},null,8,["source"])])):$("",!0)]))]))),128)),U(T).running?(E(),I("div",Iu,"⚙️ AI 正在自主安排工具调用…（可取消）")):$("",!0),U(T).items.length?$("",!0):(E(),I("div",Mu,"试试：「帮我验证 ∫₀¹ xeˣdx 的答案是 e+1 是否正确」或「画一张标准正态分布曲线」"))]),b("div",Cu,[lt(b("textarea",{"onUpdate:modelValue":L[1]||(L[1]=J=>A.value=J),class:"input",rows:"2",style:{flex:"1"},placeholder:"一句话交给 AI，它会自主决定是否调用 Python…（Ctrl+Enter 发送）","data-testid":"at-chat-input",onKeydown:L[2]||(L[2]=Rr(fr(J=>D(),["ctrl"]),["enter"]))},null,544),[[hn,A.value]]),U(T).running?(E(),I("button",{key:1,class:"btn btn-ghost",onClick:O},"取消")):(E(),I("button",{key:0,class:"btn btn-primary","data-testid":"at-chat-send",disabled:!A.value.trim(),onClick:D},"发送",8,Pu))])]),b("div",ju,[L[11]||(L[11]=b("div",{class:"card-title-row"},[b("span",{class:"card-title"},"🔎 答案真实验算（sympy 独立重解 + 数值抽查）")],-1)),L[12]||(L[12]=b("label",{class:"muted-sm"},"题干",-1)),lt(b("textarea",{"onUpdate:modelValue":L[3]||(L[3]=J=>m.stem=J),class:"input",rows:"2",placeholder:"例：计算 ∫₀¹ x·eˣ dx",style:{width:"100%"}},null,512),[[hn,m.stem]]),L[13]||(L[13]=b("label",{class:"muted-sm"},"给出的答案",-1)),lt(b("textarea",{"onUpdate:modelValue":L[4]||(L[4]=J=>m.answer=J),class:"input",rows:"2",placeholder:"例：e − 1 ≈ 1.718",style:{width:"100%"}},null,512),[[hn,m.answer]]),L[14]||(L[14]=b("label",{class:"muted-sm"},"解析（可选）",-1)),lt(b("textarea",{"onUpdate:modelValue":L[5]||(L[5]=J=>m.solution=J),class:"input",rows:"2",placeholder:"分部积分过程…",style:{width:"100%"}},null,512),[[hn,m.solution]]),b("div",Nu,[b("button",{class:"btn btn-primary","data-testid":"at-verify",disabled:p.value||U(V).status!=="ready",onClick:S},C(p.value?"验算中…":"⚡ 开始真实验算"),9,Lu),p.value?(E(),I("button",{key:0,class:"btn btn-ghost",onClick:_},"取消")):$("",!0)]),(E(!0),I(K,null,ce(y.value,(J,G)=>(E(),I("div",{key:G,style:{margin:"6px 0"}},[b("details",{open:J.type==="exec"&&G===y.value.length-1},[b("summary",Bu," 第 "+C(J.round)+" 轮 · "+C(J.type==="exec"?"执行 Python"+(J.error?" ❌":" ✓"):"最终结论"),1),J.code?(E(),I("pre",qu,C(J.code),1)):$("",!0),J.output!==void 0?(E(),I("pre",Ru,[X("输出："+C(J.output||"(无)"),1),J.error?(E(),I(K,{key:0},[X(C(`
`)+"错误："+C(J.error),1)],64)):$("",!0)])):$("",!0),J.type==="final"?(E(),I("div",Ju,[ie(cr,{source:J.text||""},null,8,["source"])])):$("",!0)],8,Du)]))),128)),h.value?(E(),I("div",Hu,[b("b",{style:Ve(g.value==="通过"?"color:#237804":g.value==="不通过"?"color:#cf1322":"")},C(g.value?"验算结论："+g.value:"结论"),5),b("div",Gu,[ie(cr,{source:h.value},null,8,["source"])])])):$("",!0)])],64)):$("",!0)]))}});function Uu(){const e=w.get(),t=x.dkey(),n=new Date;if((n.getMonth()+1)*100+n.getDate()>=1101&&!e.milestones.octMath&&e.alerts.lastNovPush!==t){w.update(a=>{a.alerts.lastNovPush=t}),we.open({title:"⚔️ 院校决策提醒",html:"<p>已到11月，「数学真题模拟≥120分」里程磊尚未勾选。</p><p><b>请立即根据数学成绩决定冲上大还是守河工大。</b>报名窗口不等人，用数据说话，不能凭感觉。</p>",actions:[{label:"去决策参谋",kind:"btn-primary",onClick:a=>{a(),window.App.go("decision")}},{label:"稍后",kind:"btn-ghost"}]});return}const s=w.usageBytes()/(5*1024*1024),o=e.meta.lastBackupReminder||"",i=o?(Date.now()-new Date(o).getTime())/x.DAY_MS:999;(s>.6||i>7)&&e.alerts.lastBakWarn!==t&&(w.update(a=>{a.alerts.lastBakWarn=t}),z.warn("💾 已"+Math.floor(i)+"天未导出备份。数据只存在浏览器，建议立即导出（设置 → 导出JSON备份）。"))}function $u(){const e=w.get(),t=new Date,n=(t.getMonth()+1)*100+t.getDate(),r=[];return n>=1101&&!e.milestones.octMath&&r.push(`<div class="alert alert-danger">⚔️ 11月已到而数学模拟里程磊未达成：<a href="javascript:App.go('decision')">立即去决策参谋定院 →</a></div>`),w.mistakeCountWeek("sign")>3&&r.push('<div class="alert alert-warn">✍️ 本周符号错误 '+w.mistakeCountWeek("sign")+" 次 &gt; 3次：智能排程已强制插入符号专项。</div>"),r.join("")}const ms={runDailyChecks:Uu,bannerHtml:$u},Fu={class:"stats-row"},Ku={class:"stat-top"},Vu={class:"stat-label"},Qu={class:"stat-num"},Yu={class:"stat-den"},Wu={class:"stat-bar"},Xu={class:"stat-foot"},Zu=le({__name:"StatsRow",setup(e){const t=j(()=>w.todayTaskStats()),n=[{k:"math",ico:"📐"},{k:"ctrl",ico:"🎛"},{k:"eng",ico:"📖"},{k:"pol",ico:"🏛"}],r=j(()=>n.map(s=>{const o=Y.SUBJECTS[s.k],[i,a]=t.value[s.k]||[0,0];return{k:s.k,ico:s.ico,short:o.short,color:o.color,d:i,t:a,done:a>0&&i===a,pct:a>0?Math.round(i/a*100):0,remain:a-i}}));return(s,o)=>(E(),I("div",Fu,[(E(!0),I(K,null,ce(r.value,i=>(E(),I("div",{key:i.k,class:fe(["stat-tile",{"stat-done":i.done}])},[b("div",Ku,[b("span",Vu,C(i.short),1),b("span",{class:"stat-badge",style:Ve({background:`color-mix(in srgb, ${i.color} 14%, transparent)`,color:i.color})},C(i.ico),5)]),b("div",Qu,[b("b",null,C(i.d),1),b("span",Yu,"/"+C(i.t),1)]),b("div",Wu,[b("div",{class:"stat-bar-fill",style:Ve({width:i.pct+"%",background:i.color})},null,4)]),b("div",Xu,C(i.done?"已清空 ✓":i.t===0?"今日无任务":"还差 "+i.remain+" 项"),1)],2))),128))]))}}),Ke=(e,t)=>{const n=e.__vccOpts||e;for(const[r,s]of t)n[r]=s;return n},ed=Ke(Zu,[["__scopeId","data-v-9fd1365c"]]),td={key:0,class:"dsh-head"},nd={key:1,class:"dsh-title"},rd={class:"dsh-head-extra"},sd={class:"dsh-head-actions"},od=le({__name:"DashCard",props:{icon:{default:""},title:{default:""},tint:{default:""},dense:{type:Boolean,default:!1}},setup(e){return(t,n)=>(E(),I("section",{class:fe(["dsh-card",{"dsh-dense":e.dense}])},[e.title||t.$slots.actions||t.$slots.extra?(E(),I("header",td,[e.icon?(E(),I("span",{key:0,class:fe(["dsh-badge",e.tint?"tint-"+e.tint:""])},C(e.icon),3)):$("",!0),e.title?(E(),I("h2",nd,C(e.title),1)):$("",!0),n[0]||(n[0]=b("span",{class:"dsh-head-spacer"},null,-1)),b("div",rd,[Zn(t.$slots,"extra",{},void 0)]),b("div",sd,[Zn(t.$slots,"actions",{},void 0)])])):$("",!0),Zn(t.$slots,"default",{},void 0)],2))}}),Ye=Ke(od,[["__scopeId","data-v-06402b0e"]]),Pr=[0,1,2,4,7,15];function id(e,t){const n=t||Pr,r=Math.max(1,Math.min(n.length-1,e||1));return n[r]!=null?n[r]:1}const Mt={BOX_DAYS:Pr,maxBox(e){return(e||Pr).length-1},dueKey(e,t){t=t||{};const n=t.from?new Date(t.from):new Date;return n.setDate(n.getDate()+id(e,t.boxDays)),x.dkey(n)},isDue(e,t){if(t=t||{},!e)return!0;if(t.includeMastered===!1&&(e.box||1)>=Mt.maxBox(t.boxDays))return!1;const n=t.today||x.dkey();return!e.due||e.due<=n},grade(e,t,n){n=n||{};const r=Mt.maxBox(n.boxDays);let s=e&&e.box||1;return s=t?Math.min(r,s+1):1,{box:s,due:Mt.dueKey(s,n)}}},Ne=()=>window;function ad(e){if(!e)return"";var t=e.replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");return t=t.replace(/(?<!\*)\*([^*<]+?)\*(?!\*)/g,"<i>$1</i>"),t}function Yt(e){if(!e)return"";try{return ad(Fe.renderInline(e).replace(/\n/g,"<br>"))}catch{}return x.esc(e).replace(/\n/g,"<br>")}function Ei(e){var t=[1,3,7,15],n=[];function r(c,l){(c||[]).forEach(function(u){if(u.reviewPlan)for(var f=Math.floor((Date.parse(x.dkey())-Date.parse(u.reviewPlan.start))/x.DAY_MS),d=0;d<t.length;d++){var m=t[d];if(f>=m&&!(u.reviewPlan.done&&u.reviewPlan.done["d"+m])){n.push({id:u.id,kind:l,stage:m,text:(l==="photo"?u.painPoint||u.extractedQuestion||u.note||"一道拍题错题":u.desc||"一条错题").slice(0,18)});break}}})}r(e.mistakes,"mistake"),r(e.mistakePhotos,"photo"),(e.polRecite||[]).forEach(function(c){Mt.isDue(c,{includeMastered:!1})&&n.push({id:c.id,kind:"pol",stage:0,text:(c.topic||"一道政治大题").slice(0,18)})});var s=e.reading&&e.reading.cards||{},o=0;(e.reading&&e.reading.customVocab||[]).concat(Y.VOCAB).forEach(function(c){Mt.isDue(s[c.w])&&o++}),o>0&&n.push({id:"reading-today",kind:"reading",stage:0,text:"熟词僻义 "+o+" 张到期"});var i=Ne().WordbookModule;if(i&&i.dueCount){var a=i.dueCount();a>0&&n.push({id:"vocab-today",kind:"vocab",stage:0,text:"单词 "+a+" 个待学（含新词）"})}return n}let Ut=!1;const Wt=de("");function cd(){var e=new Date().getHours();return e<6?"🌙 夜深了":e<9?"🌅 早上好":e<12?"☀️ 上午好":e<14?"🍚 中午好":e<18?"⛅ 下午好":"🌆 晚上好"}function ld(e){var t=x.daysTo(e.settings.examDate),n=w.todayTaskStats(),r=0,s=0;Object.keys(n).forEach(function(d){r+=n[d][0],s+=n[d][1]});var o=x.dkey(new Date(Date.now()-x.DAY_MS)),i=(e.taskArchive||{})[o]||[],a=i.filter(function(d){return d.done}).length,c=w.studyStreak(),l=[];l.push("距考试还有 <b>"+t+"</b> 天"+(c>=2?"，已连续作战 <b>"+c+"</b> 天":"")+"。"),i.length&&l.push("昨日完成 "+a+"/"+i.length+(a===i.length&&i.length>0?"，干净利落。":a/i.length<.6?"，欠债要还。":"，还差一点。")),s>0&&l.push("今日 "+s+" 项任务已就位"+(r>0?"，已清 "+r+" 项":"")+"。");var u=w.mistakeCountWeek("sign");u>=3&&l.push("⚠️ 本周符号错误 "+u+" 次，做题时强制末步验算。");var f=w.currentMathAccuracy();return f!=null&&f<70&&l.push("⚠️ 数学正确率 "+f+"% 低于安全线，先补概念再刷量。"),l.join("<br>")}function ud(){var e="专业课";try{e=Y.getActiveMajor().name||"专业课"}catch{}var t=F.memoryDigest(400);return"你是严厉的2026考研教练，正在为考生（专业课："+e+"）写「今日简报」。"+(t?`
`+t+`
`:"")+'要求：1) 三段式——一句话定调（结合时段与数据）→ 今日最关键的3个重点（具体到科目章节动作）→ 一句狠话收尾；2) 全文130-200字，用换行分段，不要标题不要列表符号；3) 直接犀利不灌鸡汤；4) 引用数据要自然（"昨天你只学了3h"），禁止罗列；5) 简体中文。'}function dd(){var e=w.get(),t=x.dkey(),n=w.todayTaskStats(),r=0,s=0,o=[];Object.keys(n).forEach(function(d){r+=n[d][0],s+=n[d][1]});var i=e.completions[t]||[];e.tasks.forEach(function(d){!d.done&&i.indexOf(d.id)<0&&o.push(Y.SUBJECTS[d.subject].short+"·"+d.text)});var a=x.dkey(new Date(Date.now()-x.DAY_MS)),c=(e.taskArchive||{})[a]||[],l=c.filter(function(d){return d.done}).length,u=w.currentMathAccuracy(),f=new Date().getHours();return"现在是"+t+" "+f+"点。距考试"+x.daysTo(e.settings.examDate)+`天。
昨日：完成 `+l+"/"+c.length+" 任务，学习 "+(e.studyHours[a]||0)+`h。
今日：任务 `+r+"/"+s+"，未完成清单："+(o.slice(0,6).join("；")||"无")+`
本周：日均 `+x.round1(x.sum(w.weekHours())/7)+"h（目标"+x.round1((e.settings.weeklyTargetHours||50)/7)+"h），符号错误 "+w.mistakeCountWeek("sign")+" 次，数学正确率 "+(u!=null?u+"%":"未录入")+"。"}function fd(){var e=w.get(),t=x.dkey();F.configured()&&e.ai.briefAuto!==!1&&(e.dailyBrief&&e.dailyBrief.date===t||Ut||Oi())}function Oi(){Ut||F.configured()&&(Ut=!0,Wt.value="",F.chatStream(ud(),dd(),function(e){Wt.value=e||""}).then(function(e){Ut=!1;var t=(e||"").trim();if(t)w.update(function(n){n.dailyBrief={date:x.dkey(),content:t.slice(0,1200),generatedAt:new Date().toISOString()}}),Ne().AiMemory&&Ne().AiMemory.recordEvent("查看今日简报");else throw new Error("empty")}).catch(function(e){Ut=!1,Wt.value="",w.update(function(t){t.dailyBrief={date:x.dkey(),failed:!0,error:e&&e.message||"生成失败"}})}))}let lr=!1;const vn=de("auto");function pd(){var e=w.get(),t=x.dkey();F.configured()&&(e.dailyQuiz&&e.dailyQuiz.date===t||lr||(lr=!0,Ii(!1,function(){lr=!1})))}function Ii(e,t,n){if(!F.configured()){t&&t();return}var r=x.dkey(),s=n||"auto",o=s!=="auto"?s:null,i=w.get(),a=i.settings&&i.settings.examConfig||{},c=a.profName||"自控原理",l=i.weaknessProfile,u=i.mistakePhotos||[],f=u.filter(function(A){return A.painPoint&&A.painPoint.trim()}).map(function(A){return A.painPoint.trim()}).slice(-15),d=u.filter(function(A){return(A.extractedQuestion||A.note||"").trim()}).slice(-6).map(function(A){return(A.extractedQuestion||A.note).trim().slice(0,50)}),m=[];if(o){var p=Y.SUBJECTS[o]&&Y.SUBJECTS[o].name||o;m.push("本次请**聚焦科目「"+p+"」**出题（不要出其它科目的题）。")}l&&l.weakAreas&&l.weakAreas.length&&m.push("考生薄弱点画像关键词："+l.weakAreas.join("、")),f.length&&m.push("近期疑难点标签："+f.join("、")),d.length&&m.push(`部分错题题干样例：
- `+d.join(`
- `));var y=i.heat||{},h=o?[o]:["math","ctrl","eng","pol"],g=[];h.forEach(function(A){var M=Y.TOPICS[A]||[];M.forEach(function(D){var O=y[D.id];O&&O.level!==void 0&&O.level<=1&&g.push((Y.SUBJECTS[A]?Y.SUBJECTS[A].name:A)+"·"+D.name+(O.level===0?"(🔴未掌握)":"(🟡薄弱)"))})}),g.length&&m.push(`热力图薄弱考点（需重点突破）：
- `+g.join(`
- `));var v=m.length?m.join(`
`):"（暂无错题/热力图记录，请基于该考生专业课「"+c+"」常见易错点出题）",S=o?"本题必须属于科目「"+(Y.SUBJECTS[o]&&Y.SUBJECTS[o].name||o)+'」，输出 JSON 时 "subject" 字段固定填 "'+o+'"。':'输出 JSON 时 "subject" 字段填该题目实际所属科目（math|ctrl|eng|pol）。',_="你是考研出题官，熟悉「"+c+"」及数学公共课的命题。根据考生的薄弱点画像与近期错题，出一道**针对性练习题**（聚焦其真正薄弱的考点，难度贴合真题）。"+S+'输出严格 JSON（不要 markdown、不要多余文字）：{"subject":"math|ctrl|eng|pol（该题目所属科目）","question":"完整题干（数学表达式用 LaTeX 如 \\frac{a}{b}、\\sqrt{x}、x^{2}、\\int、\\sum）","solution":"详细解答步骤（分步，含关键公式推导，LaTeX 格式）","trap":"本题最易踩的坑（与考生薄弱点对应）",'+F.SVG_DIAGRAM_SPEC+'"}要求：question 必须可独立作答；solution 自洽；trap 要点中考生该补的短板；diagram 仅辅助可留空。',T=v+`

请出今日针对性练习一题。`;F.chatStream(_,T,null,null,{cache:!1}).then(function(A){var M=hd(A);if(!M||!M.question){var D=A.replace(/```\w*\s*/g,"").replace(/```/g,"").replace(/^\s*[\{\[]/,"").replace(/[\}\]]\s*$/,"").replace(/^\s*"subject"\s*:\s*"[^"]*",?\s*/i,"").replace(/^\s*"question"\s*:\s*"/i,"").replace(/",\s*solution"\s*:.*/s,"");D=D.trim().replace(/\n+$/,""),M={subject:o||"math",question:D||A,solution:"",trap:"",diagram:""}}w.update(function(O){var R=O.dailyQuiz;R&&R.question&&(O.dailyQuizHistory=O.dailyQuizHistory||[],O.dailyQuizHistory.push(R),O.dailyQuizHistory.length>30&&(O.dailyQuizHistory=O.dailyQuizHistory.slice(-30))),O.dailyQuiz={date:r,subject:o||M.subject||"math",question:M.question||"",solution:M.solution||"",trap:M.trap||"",diagram:M.diagram||"",generatedAt:new Date().toISOString()}}),t&&t()}).catch(function(A){console.warn("[Dashboard] 每日一题生成失败:",A&&A.message),w.update(function(M){M.dailyQuiz={date:r,failed:!0,error:A&&A.message||String(A||"未知错误"),generatedAt:new Date().toISOString()}}),t&&t()})}function ur(e){var t=JSON.parse(e);if(t&&typeof t=="object"&&t.hasOwnProperty("diagram")){var n=t.diagram;t.diagram="",t=Fe.repairMangledLatex(t),t.diagram=n}else t=Fe.repairMangledLatex(t);return t}function hd(e){var t=(e||"").trim(),n=t.match(/```(?:json)?\s*([\s\S]*?)```/);if(n)try{return ur(n[1].trim())}catch{}var r=t.indexOf("{");if(r===-1)return null;for(var s=0,o=!1,i=!1,a=-1,c=r;c<t.length;c++){var l=t.charAt(c);if(i){i=!1;continue}if(l==="\\"){i=!0;continue}if(l==='"'){o=!o;continue}if(!o){if(l==="{")s++;else if(l==="}"&&(s--,s===0)){a=c+1;break}}}if(a<=r)return null;var u=t.slice(r,a);try{return ur(u)}catch{}try{return ur(F.repairJsonSafely(u))}catch{}var f={},d=[["subject",/"subject"\s*:\s*"([^"]*)"/],["question",/"question"\s*:\s*"((?:[^"\\]|\\.)*)"/],["solution",/"solution"\s*:\s*"((?:[^"\\]|\\.)*)"/],["trap",/"trap"\s*:\s*"((?:[^"\\]|\\.)*)"/]];return d.push(["subject",/"subject"\s*:\s*(\w+)/]),d.forEach(function(m){var p=e.match(m[1]);p&&(f[m[0]]=p[1].replace(/\\n/g,`
`).replace(/\\t/g,"	"))}),f.question?Fe.repairMangledLatex(f):null}function so(){w.update(function(e){e.dailyQuiz&&(e.dailyQuiz.revealed=!0)})}function oo(e){var t=w.get().dailyQuiz;if(e)w.update(function(r){if(r.dailyQuiz&&(r.dailyQuiz.selfEval="known"),t&&t.subject&&Y.TOPICS[t.subject]){var s=new Date().toISOString();(Y.TOPICS[t.subject]||[]).forEach(function(o){o.tier===1&&(r.heat=r.heat||{},r.heat[o.id]={level:2,score:85,updatedAt:s})})}}),w.recomputeMathAccuracy(),Ne().Toast&&Ne().Toast.success("✓ 拿下。明天继续。");else{var n=(t||{}).question||"";w.update(function(r){if(r.dailyQuiz&&(r.dailyQuiz.selfEval="unknown"),r.mistakes.push({id:x.uid(),subject:r.dailyQuiz.subject||"math",type:"concept",desc:"【每日一题】未掌握："+n.slice(0,40),stem:n||"",source:"daily",dedupKey:"dq:"+x.shortDate(),date:x.shortDate(),createdAt:new Date().toISOString()}),t&&t.subject&&Y.TOPICS[t.subject]){var s=new Date().toISOString();(Y.TOPICS[t.subject]||[]).forEach(function(o){if(o.tier===1){r.heat=r.heat||{};var i=r.heat[o.id];r.heat[o.id]={level:0,score:i&&i.score!==void 0?Math.min(i.score,30):30,updatedAt:s}}})}}),w.recomputeMathAccuracy(),Ne().AiMemory&&Ne().AiMemory.recordEvent("每日一题自评「还不会」",n.slice(0,40)),Ne().Copilot&&Ne().Copilot.isOpen&&Ne().Copilot.pushAssistant("这题还不会，已帮你记下。周末集中清账，别让它过夜。"),Ne().Toast&&Ne().Toast.show("已记入错题本。周末清账，别攒着。","warn")}}const md={class:"muted-sm"},gd=["innerHTML"],yd={class:"brief-foot"},vd={key:1,class:"brief-body"},wd=["innerHTML"],bd=["innerHTML"],kd={key:0,class:"muted-sm brief-note"},Sd={key:1,class:"muted-sm brief-note"},xd=le({__name:"BriefCard",setup(e){const t=x.dkey(),n=j(()=>w.get().dailyBrief),r=j(()=>F.configured()),s=j(()=>n.value&&n.value.date===t&&n.value.content),o=j(()=>n.value&&n.value.date===t&&n.value.failed),i=j(()=>F.configured()&&w.get().ai.briefAuto!==!1),a=j(()=>i.value&&!s.value&&!o.value),c=j(()=>a.value&&!Wt.value),l=cd(),u=t.slice(5).replace("-","."),f=j(()=>s.value?Yt(n.value.content):""),d=j(()=>Yt(Wt.value)),m=j(()=>ld(w.get()));function p(){w.update(y=>{y.dailyBrief=null}),Oi()}return(y,h)=>(E(),$e(Ye,{icon:"📰",title:"今日简报",tint:"blue",class:"dash-brief"},{extra:pe(()=>[b("span",md,C(U(l))+" · "+C(U(u)),1)]),default:pe(()=>[s.value?(E(),I(K,{key:0},[b("div",{class:"brief-body",innerHTML:f.value},null,8,gd),b("div",yd,[h[0]||(h[0]=b("span",{class:"muted-sm"},"🧠 结合你的记忆与数据生成",-1)),r.value?(E(),I("button",{key:0,class:"link-btn",onClick:p},"🔄 换一版")):$("",!0)])],64)):a.value?(E(),I("div",vd,[c.value?(E(),I(K,{key:0},[h[1]||(h[1]=b("div",{class:"skl-line"},null,-1)),h[2]||(h[2]=b("div",{class:"skl-line"},null,-1)),h[3]||(h[3]=b("div",{class:"skl-line skl-w60"},null,-1))],64)):(E(),I(K,{key:1},[b("span",{innerHTML:d.value},null,8,wd),h[4]||(h[4]=b("span",{class:"ai-cursor"},null,-1))],64))])):(E(),I(K,{key:2},[b("div",{class:"brief-body",innerHTML:m.value},null,8,bd),o.value?(E(),I("div",kd,[X(" ⚠️ AI 简报生成失败（"+C(String(n.value.error||"").slice(0,40))+"） ",1),b("button",{class:"link-btn",onClick:p},"🔄 重试")])):r.value?$("",!0):(E(),I("div",Sd,"配置 AI 后，这里会变成真正懂你的每日简报 →"))],64))]),_:1}))}}),_d=Ke(xd,[["__scopeId","data-v-17a6feac"]]);function Ad(e){if(!e)return{lang:"",code:""};e=String(e).trim();let t=e.match(/^```(\w*)\s*([\s\S]*?)```$/i);return t?{lang:(t[1]||"").toLowerCase(),code:t[2].trim()}:(t=e.match(/```(\w*)\s*\n([\s\S]*?)```/),t?{lang:(t[1]||"").toLowerCase(),code:t[2].trim()}:{lang:"",code:e})}function Mi(e){let t=String(e);/xmlns=/.test(t)||(t=t.replace(/<svg/i,'<svg xmlns="http://www.w3.org/2000/svg"'));let n;try{n=new DOMParser().parseFromString(t,"image/svg+xml")}catch{return null}if(!n||n.getElementsByTagName("parsererror").length)return null;const r=n.documentElement;if(!r||r.nodeName.toLowerCase()!=="svg")return null;const s=r.querySelectorAll("script, foreignObject, iframe, object, embed, link, meta");for(let i=0;i<s.length;i++)s[i].parentNode&&s[i].parentNode.removeChild(s[i]);const o=[r].concat(Array.prototype.slice.call(r.getElementsByTagName("*")));for(let i=0;i<o.length;i++){const a=o[i];for(let c=a.attributes.length-1;c>=0;c--){const l=a.attributes[c].name,u=a.attributes[c].value||"";(/^on/i.test(l)||/^(xlink:)?href$/i.test(l)&&/^\s*javascript:/i.test(u)||l.toLowerCase()==="style"&&/javascript:|expression\s*\(/i.test(u))&&a.removeAttribute(l)}}return r.getAttribute("viewBox")?(r.removeAttribute("width"),r.removeAttribute("height"),r.setAttribute("width","100%"),r.getAttribute("preserveAspectRatio")||r.setAttribute("preserveAspectRatio","xMidYMid meet")):r.getAttribute("width")||r.setAttribute("width","280"),r.setAttribute("overflow","visible"),new XMLSerializer().serializeToString(r)}function Ci(e){if(e&&typeof e=="object")return"";const t=Ad(e),n=t.code;if(!n)return"";if(t.lang==="svg"||n.toLowerCase().indexOf("<svg")>=0){const r=Mi(n);if(r)return'<div class="dgm-wrap">'+r+"</div>"}return'<div class="dgm-code"><pre class="report">'+x.esc(n)+"</pre></div>"}function Td(e){return Ci(e)}const Pi={render:Ci,renderSync:Td,sanitizeSvg:Mi},Ed=["innerHTML"],Od=le({__name:"DiagramBlock",props:{source:{}},setup(e){const t=e,n=j(()=>Pi.render(t.source||""));return(r,s)=>(E(),I("div",{class:"diagram-block",innerHTML:n.value},null,8,Ed))}}),Id={key:0,class:"dsh-dq-cell"},Md={class:"dq-tile-head"},Cd={class:"dq-tile-ico"},Pd={key:0,class:"dq-dot",title:"今日题还没做"},jd={key:1,class:"dq-tile-sub st-no"},Nd={key:2,class:"dq-tile-sub st-warn"},Ld={key:3,class:"dq-tile-sub st-warn"},Dd=["innerHTML"],Bd={key:1,class:"dq-tile-preview dq-tile-hint"},qd={class:"dq-week","aria-hidden":"true"},Rd={class:"dq-tools"},Jd=["value"],Hd=["disabled"],Gd={class:"dq-question"},zd=["innerHTML"],Ud={class:"dq-section"},$d=["innerHTML"],Fd={key:0,class:"dq-section"},Kd=["innerHTML"],Vd={key:2,class:"dq-eval dq-eval-ok"},Qd={key:3,class:"dq-eval dq-eval-no"},Yd={key:4,class:"dq-eval-row"},Wd={class:"muted-sm dq-foot"},Xd={class:"alert alert-warn"},Zd=["disabled"],ef={key:2,class:"muted-sm"},tf=le({__name:"DailyQuizCard",setup(e){const t=x.dkey(),n=j(()=>w.get().dailyQuiz),r=j(()=>n.value&&n.value.date===t&&n.value.question),s=j(()=>n.value&&n.value.date===t&&n.value.failed),o=j(()=>F.configured()),i=j(()=>!!(r.value&&!n.value.revealed&&!n.value.selfEval)),a=j(()=>r.value?Y.SUBJECTS[n.value.subject]||{short:"题",color:"#666"}:null),c=j(()=>n.value?.selfEval==="known"?{t:"已会 ✓",cls:"st-ok"}:n.value?.selfEval==="unknown"?{t:"记入错题",cls:"st-no"}:n.value?.revealed?{t:"待自评",cls:"st-warn"}:{t:"待作答",cls:"st-warn"}),l=de(!1),u=[{v:"auto",l:"🎲 自动(薄弱点)"},{v:"math",l:"📐 数学"},{v:"ctrl",l:"🎛 专业课"},{v:"eng",l:"📖 英语"},{v:"pol",l:"🏛 政治"}],f=de(!1),d=j(()=>Yt(n.value?.question||"")),m=j(()=>Yt(n.value?.solution||"")),p=j(()=>Yt(n.value?.trap||"")),y=j(()=>(n.value?.generatedAt||"").slice(0,16).replace("T"," ")),h=j(()=>{const A=(w.get().dailyQuizHistory||[]).slice(-6).map((D,O)=>({k:"h"+O+(D.date||""),cls:D.selfEval==="known"?"ok":D.selfEval==="unknown"?"no":"done",today:!1})),M=n.value&&n.value.date===t?n.value.selfEval==="known"?"ok":n.value.selfEval==="unknown"?"no":n.value.revealed?"done":"open":"none";return A.push({k:"today",cls:M,today:!0}),A});function g(){l.value=!l.value}function v(){f.value||(f.value=!0,l.value=!0,Ii(!0,()=>{f.value=!1},vn.value))}function S(){Me.push(Qe("settings"))}return(_,T)=>l.value?(E(),$e(Ye,{key:1,icon:"📅",title:"每日一题",tint:"purple",class:"dsh-dq"},{actions:pe(()=>[b("button",{class:"link-btn",onClick:g},"收起 ▴")]),default:pe(()=>[b("div",Rd,[lt(b("select",{"onUpdate:modelValue":T[0]||(T[0]=A=>xa(vn)?vn.value=A:null),class:"input input-sel dq-sel",title:"指定出题科目"},[(E(),I(K,null,ce(u,A=>b("option",{key:A.v,value:A.v},C(A.l),9,Jd)),64))],512),[[_a,U(vn)]]),r.value?(E(),I("button",{key:0,class:"btn btn-ghost btn-sm dq-again",disabled:f.value,onClick:v},C(f.value?"生成中…":"🔁 换题"),9,Hd)):$("",!0)]),r.value?(E(),I(K,{key:0},[b("div",Gd,[b("b",null,"📝 "+C(a.value.short)+"题：",1),b("span",{innerHTML:d.value},null,8,zd)]),n.value.diagram?(E(),$e(Od,{key:0,source:n.value.diagram},null,8,["source"])):$("",!0),n.value.revealed||n.value.selfEval?(E(),I(K,{key:1},[b("div",Ud,[T[8]||(T[8]=b("b",null,"🔑 解答：",-1)),b("div",{class:"dq-sol",innerHTML:m.value},null,8,$d)]),n.value.trap?(E(),I("div",Fd,[T[9]||(T[9]=b("b",null,"⚠️ 易错点：",-1)),b("div",{class:"dq-sol",innerHTML:p.value},null,8,Kd)])):$("",!0)],64)):$("",!0),n.value.selfEval==="known"?(E(),I("div",Vd,"✓ 已自评：会了。保持这个节奏。")):n.value.selfEval==="unknown"?(E(),I("div",Qd,"✗ 已自评：还不会——已记入错题本，明天简报会盯着你复习。")):n.value.revealed?(E(),I("div",Yd,[T[10]||(T[10]=b("span",{class:"muted-sm"},"看完解答，诚实自评：",-1)),b("button",{class:"btn btn-primary btn-sm",onClick:T[1]||(T[1]=A=>U(oo)(!0))},"✓ 会了"),b("button",{class:"btn btn-ghost btn-sm",onClick:T[2]||(T[2]=A=>U(oo)(!1))},"✗ 还不会")])):(E(),I(K,{key:5},[T[11]||(T[11]=b("div",{class:"dq-fold"},"🫣 解答已折叠——先拿草稿纸做一遍，再对答案。",-1)),b("button",{class:"btn btn-ghost btn-sm",onClick:T[3]||(T[3]=(...A)=>U(so)&&U(so)(...A))},"👀 查看解答")],64)),b("div",Wd,"基于你的薄弱点生成 · "+C(y.value),1)],64)):s.value?(E(),I(K,{key:1},[b("div",Xd,"⚠️ 今日一题生成失败："+C(n.value.error||"未知错误"),1),b("button",{class:"btn btn-ghost btn-sm dq-retry",disabled:f.value,onClick:v},C(f.value?"生成中…":"🔁 重试生成"),9,Zd)],64)):o.value?(E(),I("div",ef,"⏳ 正在依据你的薄弱点生成今日一题…")):(E(),I(K,{key:3},[T[12]||(T[12]=b("div",{class:"alert alert-warn"},"未配置 AI，无法生成每日一题。请先在「设置」中填写 API。",-1)),b("button",{class:"btn btn-ghost btn-sm",onClick:S,style:{"margin-top":"8px"}},"去设置 →")],64))]),_:1})):(E(),I("div",Id,[b("div",{class:"dq-tile",role:"button",tabindex:"0",title:"点击查看今日一题",onClick:g,onKeydown:Rr(g,["enter"])},[b("div",Md,[b("span",Cd,[T[4]||(T[4]=X("📅",-1)),i.value?(E(),I("span",Pd)):$("",!0)]),T[5]||(T[5]=b("span",{class:"dq-tile-name"},"每日一题",-1)),r.value?(E(),I("span",{key:0,class:fe(["dq-tile-sub",c.value.cls])},C(a.value.short)+" · "+C(c.value.t),3)):s.value?(E(),I("span",jd,"生成失败 · 重试")):o.value?(E(),I("span",Nd,"⏳ 生成中")):(E(),I("span",Ld,"配置 AI"))]),r.value?(E(),I("div",{key:0,class:"dq-tile-preview",innerHTML:d.value},null,8,Dd)):(E(),I("div",Bd,C(s.value?"今日生成失败，点击展开可重试。":o.value?"正在依据你的薄弱点生成今日一题…":"配置 AI 后，每天自动送一道针对你弱点的题。"),1)),b("div",qd,[(E(!0),I(K,null,ce(h.value,A=>(E(),I("span",{key:A.k,class:fe(["dq-wdot","w-"+A.cls+(A.today?" w-today":"")])},null,2))),128)),T[6]||(T[6]=b("span",{class:"dq-week-label muted-sm"},"近 7 日",-1))]),T[7]||(T[7]=b("div",{class:"dq-tile-cta"},"查看今日一题 →",-1))],32)]))}}),nf=Ke(tf,[["__scopeId","data-v-f0f7a385"]]),rf={class:"now-count"},sf={class:"now-actions"},of={class:"now-count"},af={class:"now-title"},cf={class:"now-sub"},lf={class:"now-reason"},uf={class:"now-actions"},df=le({__name:"NowCard",setup(e){const t=()=>window,n=j(()=>w.todayTaskStats()),r=j(()=>w.todayAllDone()),s=j(()=>{n.value;const f=t().SchedulerModule;if(!f||!f.currentPlan)return null;const d=f.currentPlan();return d&&d.sequence&&d.sequence.find(m=>!m.done)||null}),o=j(()=>s.value?Y.SUBJECTS[s.value.subject]:null),i=j(()=>{const f=n.value;return f.math[0]+f.ctrl[0]+f.eng[0]+f.pol[0]}),a=j(()=>{const f=n.value;return f.math[1]+f.ctrl[1]+f.eng[1]+f.pol[1]});function c(){const f=t().TasksModule;f&&s.value?f.toggleTask(s.value.id,!0):z.show("打卡模块未就绪","warn")}function l(){Me.push(Qe("focus"))}function u(){Me.push(Qe("scheduler"))}return(f,d)=>r.value?(E(),$e(Ye,{key:0,icon:"✅",title:"今日已清场",tint:"ok",class:"dsh-now dsh-now-done"},{extra:pe(()=>[b("span",rf,C(i.value)+"/"+C(a.value),1)]),default:pe(()=>[d[1]||(d[1]=b("div",{class:"now-title"},"✓ 全部任务完成",-1)),d[2]||(d[2]=b("div",{class:"now-sub"},"可以安心复盘、早点睡。明天继续。",-1)),b("div",sf,[b("button",{class:"btn btn-ghost",onClick:d[0]||(d[0]=m=>U(Me).push(U(Qe)("review")))},"去复盘 →")])]),_:1})):s.value?(E(),$e(Ye,{key:1,icon:"⚡",title:"现在就干这个",class:"dsh-now dsh-now-hero"},{extra:pe(()=>[b("span",of,C(i.value)+"/"+C(a.value)+" 已完成",1)]),default:pe(()=>[b("div",af,C(s.value.text),1),b("div",cf,[o.value?(E(),I("span",{key:0,class:"now-tag",style:Ve({background:o.value.color})},C(o.value.short),5)):$("",!0),b("span",lf,C(s.value.reason),1)]),b("div",uf,[b("button",{class:"now-btn-primary",onClick:c},"✓ 完成打卡"),b("button",{class:"now-btn-ghost",onClick:l},"🔒 专注"+C(s.value.subject==="math"?45:25)+"分钟",1)])]),_:1})):(E(),$e(Ye,{key:2,icon:"🗓️",title:"今日无待办",class:"dsh-now"},{default:pe(()=>[d[3]||(d[3]=b("div",{class:"now-title"},"还没排任务",-1)),d[4]||(d[4]=b("div",{class:"now-sub"},"去排程把今天的任务排上，仪表盘才知道你现在该干嘛。",-1)),b("div",{class:"now-actions"},[b("button",{class:"btn btn-primary",onClick:u},"去排程添加")])]),_:1}))}}),ff=Ke(df,[["__scopeId","data-v-a92668cf"]]);function Rt(e,t){return'<svg viewBox="0 0 '+e+" "+t+'" width="100%" height="'+t+'" xmlns="http://www.w3.org/2000/svg">'}function ge(e,t){return window.U&&x.themeColor?x.themeColor(e,t):t}const ji={bar(e,t){t=t||{};const n=ge("--chart-ink","#000"),r=ge("--chart-faint","#bfbfbf"),s=ge("--chart-muted","#8c8c8c"),o=ge("--chart-sub","#595959"),i=680,a=t.height||160,c=24,l=16,u=8,f=8,d=Math.max.apply(null,e.map(g=>g.value).concat([1])),m=e.length||1,p=(i-u-f)/m,y=Math.min(44,p*.55);let h=Rt(i,a);for(let g=0;g<m;g++){const v=e[g],S=Math.max(2,v.value/d*(a-c-l)),_=u+g*p+(p-y)/2,T=a-c-S,A=v.highlight?t.hiColor||n:t.color||r;h+='<rect x="'+_+'" y="'+T+'" width="'+y+'" height="'+S+'" rx="4" fill="'+A+'"><title>'+x.esc(v.label)+"："+v.value+(t.unit||"")+"</title></rect>",h+='<text x="'+(_+y/2)+'" y="'+(a-8)+'" text-anchor="middle" font-size="11" fill="'+s+'">'+x.esc(v.label)+"</text>",v.value>0&&(h+='<text x="'+(_+y/2)+'" y="'+(T-4)+'" text-anchor="middle" font-size="11" fill="'+o+'">'+v.value+"</text>")}return h+"</svg>"},donut(e,t){t=t||{};const n=ge("--chart-ink","#000"),r=ge("--chart-faint","#bfbfbf"),s=ge("--chart-muted","#8c8c8c"),o=ge("--chart-sub","#595959"),i=ge("--chart-track","#f0f0f0"),a=680,c=t.height||190,l=110,u=c/2,f=66,d=40,m=x.sum(e.map(h=>h.value));let p=Rt(a,c);if(m===0)p+='<circle cx="'+l+'" cy="'+u+'" r="'+f+'" fill="none" stroke="'+i+'" stroke-width="'+(f-d)+'"/>',p+='<text x="'+l+'" y="'+(u+5)+'" text-anchor="middle" font-size="13" fill="'+r+'">暂无数据</text>';else{let h=-Math.PI/2;e.forEach(g=>{if(g.value<=0)return;const v=g.value/m,S=h+v*Math.PI*2,_=v>.5?1:0,T=l+f*Math.cos(h),A=u+f*Math.sin(h),M=l+f*Math.cos(S),D=u+f*Math.sin(S),O=l+d*Math.cos(S),R=u+d*Math.sin(S),L=l+d*Math.cos(h),J=u+d*Math.sin(h);p+='<path d="M'+T+" "+A+" A"+f+" "+f+" 0 "+_+" 1 "+M+" "+D+" L"+O+" "+R+" A"+d+" "+d+" 0 "+_+" 0 "+L+" "+J+' Z" fill="'+g.color+'"><title>'+x.esc(g.label)+"："+g.value+"次 ("+Math.round(v*100)+"%)</title></path>",h=S}),p+='<text x="'+l+'" y="'+(u-2)+'" text-anchor="middle" font-size="22" font-weight="500" fill="'+n+'">'+m+"</text>",p+='<text x="'+l+'" y="'+(u+16)+'" text-anchor="middle" font-size="11" fill="'+s+'">总计</text>'}let y=24;return e.forEach(h=>{const g=m?Math.round(h.value/m*100):0;p+='<rect x="230" y="'+(y-10)+'" width="10" height="10" rx="2" fill="'+h.color+'"/>',p+='<text x="246" y="'+y+'" font-size="12" fill="'+n+'">'+x.esc(h.label)+"</text>",p+='<text x="660" y="'+y+'" font-size="12" text-anchor="end" fill="'+o+'">'+h.value+"次 · "+g+"%</text>",y+=24}),p+"</svg>"},line(e,t){t=t||{};const n=ge("--chart-ink","#000"),r=ge("--chart-faint","#bfbfbf"),s=ge("--chart-muted","#8c8c8c"),o=ge("--danger","#cf1322"),i=680,a=t.height||170,c=22,l=14,u=30,f=10,d=e.map(_=>_.value),m=t.min!=null?t.min:Math.min.apply(null,d.concat([0])),p=t.max!=null?t.max:Math.max.apply(null,d.concat([10])),y=e.length;if(y===0)return Rt(i,a)+'<text x="340" y="90" text-anchor="middle" fill="'+r+'" font-size="13">暂无数据</text></svg>';const h=_=>u+(y===1?(i-u-f)/2:_*(i-u-f)/(y-1)),g=_=>a-c-(_-m)/(p-m||1)*(a-c-l);let v=Rt(i,a);t.warnBelow!=null&&(v+='<line x1="'+u+'" y1="'+g(t.warnBelow)+'" x2="'+(i-f)+'" y2="'+g(t.warnBelow)+'" stroke="'+o+'" stroke-dasharray="4 4" stroke-width="1"/>',v+='<text x="'+(i-f)+'" y="'+(g(t.warnBelow)-4)+'" text-anchor="end" font-size="10" fill="'+o+'">预警线 '+t.warnBelow+"</text>");let S="";return e.forEach((_,T)=>{S+=(T===0?"M":"L")+h(T)+" "+g(_.value)}),v+='<path d="'+S+'" fill="none" stroke="'+n+'" stroke-width="2"/>',e.forEach((_,T)=>{const A=t.warnBelow!=null&&_.value<t.warnBelow;v+='<circle cx="'+h(T)+'" cy="'+g(_.value)+'" r="4" fill="'+(A?o:n)+'"><title>'+x.esc(_.label)+"："+_.value+(t.unit||"")+"</title></circle>",y<=12&&(v+='<text x="'+h(T)+'" y="'+(a-6)+'" text-anchor="middle" font-size="10" fill="'+s+'">'+x.esc(_.label)+"</text>")}),v+"</svg>"},progressBar(e,t,n){return e=x.clamp(e,0,100),'<div class="pbar" style="height:'+(n||8)+'px"><div class="pbar-fill" style="width:0%;background:'+t+'" data-w="'+e+'"></div></div>'},radar(e,t){t=t||{};const n=ge("--chart-ink","#000"),r=ge("--chart-sub","#595959"),s=ge("--chart-grid","#e8e8e8"),o=680,i=t.height||200,a=e.length||4,c=128,l=i/2,u=Math.max(40,Math.min(92,(i-24)/2-10)),f=t.color||"#2f54eb",d=g=>-Math.PI/2+2*Math.PI*g/a,m=(g,v)=>[c+v*Math.cos(d(g)),l+v*Math.sin(d(g))];let p=Rt(o,i);for(let g=1;g<=4;g++){const v=u*g/4;let S="";for(let _=0;_<=a;_++){const T=m(_%a,v);S+=(_===0?"M":"L")+T[0]+" "+T[1]}p+='<path d="'+S+' Z" fill="none" stroke="'+s+'" stroke-width="0.5"/>'}for(let g=0;g<a;g++){const[v,S]=m(g,u);p+='<line x1="'+c+'" y1="'+l+'" x2="'+v+'" y2="'+S+'" stroke="'+s+'" stroke-width="0.5"/>';const _=c+(u+22)*Math.cos(d(g)),T=l+(u+22)*Math.sin(d(g));p+='<text x="'+_+'" y="'+(T+4)+'" text-anchor="middle" font-size="12" fill="'+r+'">'+x.esc(e[g].label)+"</text>";const[A,M]=m(g,u*(x.clamp(e[g].value,0,100)/100));p+='<text x="'+A+'" y="'+(M-7)+'" text-anchor="middle" font-size="11" font-weight="500" fill="'+n+'">'+Math.round(e[g].value)+"</text>"}let y="";for(let g=0;g<=a;g++){const v=m(g%a,u*(x.clamp(e[g%a].value,0,100)/100));y+=(g===0?"M":"L")+v[0]+" "+v[1]}p+='<path d="'+y+' Z" fill="'+(t.fill||"rgba(47,84,235,0.16)")+'" stroke="'+f+'" stroke-width="1.5"/>';for(let g=0;g<a;g++){const v=m(g,u*(x.clamp(e[g].value,0,100)/100));p+='<circle cx="'+v[0]+'" cy="'+v[1]+'" r="3" fill="'+f+'"/>'}let h=24;return e.forEach(function(g,v){const S=["#185FA5","#0F6E56","#993C1D","#854F0B","#534AB7","#A32D2D","#5F5E5A","#639922"][v%8];p+='<circle cx="'+(o-108)+'" cy="'+(h-3)+'" r="4" fill="'+S+'"/>',p+='<text x="'+(o-96)+'" y="'+h+'" font-size="12" fill="'+n+'">'+x.esc(g.label)+"</text>",p+='<text x="'+(o-14)+'" y="'+h+'" text-anchor="end" font-size="12" font-weight="500" fill="'+n+'">'+Math.round(g.value)+"</text>",h+=20}),p+"</svg>"}},pf={class:"hours-line"},hf={class:"dsh-big"},mf=["innerHTML"],gf={class:"muted-sm"},yf=le({__name:"HoursCard",setup(e){const t=j(()=>w.weekHours()),n=j(()=>(new Date().getDay()+6)%7),r=j(()=>t.value.map((f,d)=>({label:["一","二","三","四","五","六","日"][d],value:f,highlight:d===n.value}))),s=j(()=>x.round1(x.sum(t.value))),o=j(()=>w.get().settings.weeklyTargetHours||50),i=j(()=>o.value?Math.round(s.value/o.value*100):0),{theme:a}=Vr(),c=j(()=>(a.value,ji.bar(r.value,{height:110,unit:"h",hiColor:x.themeColor("--chart-ink","#000")}))),l=j(()=>w.todayHours());function u(){we.open({title:"记录学习时长",html:'<div class="seg-row" id="hr-segs">'+[.5,1,1.5,2,3].map(f=>'<button class="seg" data-h="'+f+'">+'+f+"h</button>").join("")+'</div><div class="muted-sm">点击即累加到今天（当前 '+w.todayHours()+"h）</div>",actions:[{label:"完成",kind:"btn-primary"}]}),document.querySelectorAll("#hr-segs .seg").forEach(f=>{f.onclick=()=>{w.addHours(+f.getAttribute("data-h")),z.success("+"+f.getAttribute("data-h")+"h，今日共 "+w.todayHours()+"h")}})}return(f,d)=>(E(),$e(Ye,{icon:"📈",title:"本周节奏",tint:"ok"},{actions:pe(()=>[b("button",{class:"link-btn",onClick:u},"+ 记录时长")]),default:pe(()=>[b("div",pf,[b("span",hf,[X(C(s.value),1),d[0]||(d[0]=b("span",{class:"dsh-unit"},"小时",-1))]),b("span",{class:fe(["dsh-pill",i.value>=70?"dsh-pill-up":"dsh-pill-warn"])},C(i.value>=70?"↑":"↓")+" 目标 "+C(i.value)+"% ",3)]),b("div",{class:"wk-chart",innerHTML:c.value},null,8,mf),b("div",gf,"今日 "+C(l.value)+"h · 周目标 "+C(o.value)+"h",1)]),_:1}))}}),vf=Ke(yf,[["__scopeId","data-v-2168edf0"]]),wf={class:"subj4"},bf={class:"chip-name"},kf={class:"chip-num"},Sf={key:0,class:"rvd-wrap"},xf=["onClick"],_f={class:"rvd-stage"},Af={class:"rvd-text"},Tf=["onClick"],Ef=["onClick"],Of={key:1},If={class:"task-check"},Mf=["checked","onChange"],Cf={class:"seq-text"},Pf={key:2,class:"empty"},jf=le({__name:"TasksCard",setup(e){const t=()=>window,n=j(()=>w.todayTaskStats()),r=j(()=>{const y=t().SchedulerModule;return y&&y.currentPlan&&y.currentPlan()||{sequence:[]}}),s=j(()=>r.value.sequence.slice(0,5)),o=j(()=>Ei(w.get()).slice(0,5)),i=["math","ctrl","eng","pol"],a=j(()=>i.map(y=>{const h=Y.SUBJECTS[y],g=n.value[y][0],v=n.value[y][1];return{k:y,short:h.short,d:g,t:v,done:v>0&&g===v,color:h.color}}));function c(y){const h=w.get().tasks.find(g=>g.id===y);return h?!!h.done:!1}function l(y,h){const g=t().TasksModule;g&&g.toggleTask(y,h)}function u(y){return(Y.SUBJECTS[y]||{color:"#666"}).color}function f(y){return y.kind==="photo"?"📸":y.kind==="pol"?"📕":y.kind==="vocab"?"📚":y.kind==="reading"?"📖":"✍️"}function d(y){return y.kind==="vocab"||y.kind==="reading"}function m(y){if(y.kind==="pol"){const g=t().PolReciteModule;g&&g.grade(y.id,!0),t().AiMemory&&t().AiMemory.recordEvent("完成政治大题复习",String(y.id||"").slice(0,8)),z.success("✓ 政治大题复习完成，记忆又牢了一层");return}const h=y.kind==="photo"?"mistakePhotos":"mistakes";w.update(g=>{const v=(g[h]||[]).find(S=>S.id===y.id);v&&v.reviewPlan&&(v.reviewPlan.done||(v.reviewPlan.done={}),v.reviewPlan.done["d"+y.stage]=x.dkey())}),t().AiMemory&&t().AiMemory.recordEvent("完成到期复习","D"+y.stage+"阶段"+(y.kind==="photo"?"拍题":"错题")+"重做"),z.success("✓ 复习完成，记忆又牢了一层")}function p(y){if(y.kind==="pol"){const h=t().PolReciteModule;h&&h.openReview(y.id);return}if(y.kind==="vocab"){Me.push(Qe("wordbook"));return}if(y.kind==="reading"){Me.push(Qe("reading"));return}}return(y,h)=>(E(),$e(Ye,{icon:"☑️",title:"今日任务",tint:"ok"},{actions:pe(()=>[b("button",{class:"link-btn",onClick:h[0]||(h[0]=g=>U(Me).push(U(Qe)("scheduler")))},"完整排程 →")]),default:pe(()=>[b("div",wf,[(E(!0),I(K,null,ce(a.value,g=>(E(),I("div",{key:g.k,class:fe(["chip mini",{"chip-done":g.done}]),style:Ve({"--sc":g.color})},[b("span",bf,C(g.short),1),b("span",kf,C(g.d)+"/"+C(g.t),1)],6))),128))]),o.value.length?(E(),I("div",Sf,[h[1]||(h[1]=b("div",{class:"muted-sm rvd-cap"},"📅 今日到期复习（重做原题，勿看解析）",-1)),(E(!0),I(K,null,ce(o.value,g=>(E(),I("div",{key:g.kind+g.id,class:fe(["rvd-item",{"rvd-click":g.kind==="pol"||g.kind==="vocab"||g.kind==="reading"}]),onClick:v=>p(g)},[b("span",_f,C(d(g)?"SRS":"D"+g.stage),1),b("span",Af,C(f(g))+" "+C(g.text),1),d(g)?(E(),I("button",{key:0,class:"btn btn-primary btn-sm",onClick:fr(v=>p(g),["stop"])},"去复习 →",8,Tf)):(E(),I("button",{key:1,class:"btn btn-ghost btn-sm",onClick:fr(v=>m(g),["stop"])},"✓ 重做完成",8,Ef))],10,xf))),128))])):$("",!0),s.value.length?(E(),I("div",Of,[(E(!0),I(K,null,ce(s.value,g=>(E(),I("label",{key:g.id,class:fe(["seq-row",{"seq-is-done":c(g.id)}])},[b("span",If,[b("input",{type:"checkbox",checked:c(g.id),onChange:v=>l(g.id,v.target.checked)},null,40,Mf),h[2]||(h[2]=b("span",{class:"box"},null,-1))]),b("span",Cf,C(g.text),1),b("span",{class:"seq-badge",style:Ve({color:u(g.subject)})},C(g.weight),5)],2))),128))])):(E(),I("div",Pf,"暂无任务"))]),_:1}))}}),Nf=Ke(jf,[["__scopeId","data-v-b086b73c"]]),Lf={class:"tiles"},Df=["onClick"],Bf=["innerHTML"],qf={key:0,class:"tile-dot"},Rf={class:"tile-name"},Jf=le({__name:"TilesCard",setup(e){const t=()=>window,n=j(()=>{const c=w.todayTaskStats();return c.math[1]+c.ctrl[1]+c.eng[1]+c.pol[1]-c.math[0]-c.ctrl[0]-c.eng[0]-c.pol[0]}),r=j(()=>Ei(w.get()).length),s=j(()=>{const c=t().WordbookModule;try{return c&&c.dueCount?c.dueCount():0}catch{return 0}}),o=[{id:"scheduler",tint:"warn",badge:()=>n.value},{id:"quiz",tint:"blue"},{id:"mistakes",tint:"danger",badge:()=>r.value},{id:"wordbook",tint:"ok",badge:()=>s.value},{id:"polrecite",tint:"danger"},{id:"sprint",tint:"purple"},{id:"share",tint:"blue"},{id:"focus",tint:"ok"},{id:"essay",tint:"warn"}],i=j(()=>o.map(c=>{const l=rn[c.id]?c.id:"tools";return{go:c.id,svg:rn[l]||"",name:zo(c.id),n:c.badge?Math.max(0,c.badge()):0,tint:c.tint}}));function a(c){Me.push(Qe(c))}return(c,l)=>(E(),$e(Ye,{icon:"🚀",title:"快捷入口",tint:"blue"},{extra:pe(()=>[...l[0]||(l[0]=[b("span",{class:"muted-sm"},"红点 = 有待办",-1)])]),default:pe(()=>[b("div",Lf,[(E(!0),I(K,null,ce(i.value,u=>(E(),I("button",{key:u.go,class:"tile",onClick:f=>a(u.go)},[b("span",{class:fe(["tile-ico","tint-"+u.tint])},[b("span",{innerHTML:u.svg},null,8,Bf),u.n>0?(E(),I("span",qf)):$("",!0)],2),b("span",Rf,[X(C(u.name),1),u.n>0?(E(),I(K,{key:0},[X(" · "+C(u.n),1)],64)):$("",!0)])],8,Df))),128))])]),_:1}))}}),Hf=Ke(Jf,[["__scopeId","data-v-8644a98a"]]),Gf={key:0,class:"streak"},zf={class:"muted-sm"},Uf={class:"cal"},$f={class:"cal-mrow"},Ff={class:"cal-wd"},Kf={key:0,class:"cal-cell cal-empty"},Vf=["title"],Qf={class:"cal-foot"},Yf={class:"muted-sm"},Jt=12,Wf=le({__name:"CalendarCard",setup(e){const t=["一","二","三","四","五","六","日"],n=j(()=>{const o=w.get(),i=new Date;i.setHours(23,59,59,999);let a=x.weekMonday(new Date);a=new Date(a.getTime()-(Jt-1)*7*x.DAY_MS);const c=[];for(let l=0;l<7;l++){const u=[];for(let f=0;f<Jt;f++){const d=new Date(a.getTime()+(f*7+l)*x.DAY_MS);if(d>i){u.push(null);continue}const m=x.dkey(d),p=o.studyHours[m]||0,y=(o.completions[m]||[]).length,h=p+y*.5,g=h<=0?0:h<2?1:h<4?2:h<6?3:4,v=d.getFullYear()===i.getFullYear()&&d.getMonth()===i.getMonth()&&d.getDate()===i.getDate();u.push({k:m,lv:g,isToday:v,h:p,doneN:y})}c.push(u)}return c}),r=j(()=>{let o=x.weekMonday(new Date);o=new Date(o.getTime()-(Jt-1)*7*x.DAY_MS);const i=[];let a=-1;for(let c=0;c<Jt;c++){const l=new Date(o.getTime()+c*7*x.DAY_MS),u=c===0||l.getMonth()!==a?l.getMonth()+1+"月":"";u&&(a=l.getMonth()),i.push(u)}return i}),s=j(()=>{const o=w.get();let i=x.weekMonday(new Date);i=new Date(i.getTime()-(Jt-1)*7*x.DAY_MS);const a=new Date;a.setHours(23,59,59,999);let c=0,l=0,u=0,f=0;for(let d=0;;d++){const m=new Date(i.getTime()+d*x.DAY_MS);if(m>a)break;const p=x.dkey(m),y=o.studyHours[p]||0;y+(o.completions[p]||[]).length*.5>0?(l++,c+=y,f++,f>u&&(u=f)):f=0}return{totalH:x.round1(c),activeDays:l,best:u,streak:w.studyStreak()}});return(o,i)=>(E(),$e(Ye,{icon:"🗓️",title:"学习日历",tint:"warn"},{extra:pe(()=>[s.value.streak>=2?(E(),I("span",Gf,"🔥 连续 "+C(s.value.streak)+" 天",1)):$("",!0),b("span",zf,[i[0]||(i[0]=X("近12周 ",-1)),b("b",null,C(s.value.activeDays),1),i[1]||(i[1]=X(" 天活跃",-1))])]),default:pe(()=>[b("div",Uf,[b("div",$f,[i[2]||(i[2]=b("span",{class:"cal-wd"},null,-1)),(E(!0),I(K,null,ce(r.value,(a,c)=>(E(),I("span",{key:"m"+c,class:"cal-mcell"},C(a),1))),128))]),(E(!0),I(K,null,ce(n.value,(a,c)=>(E(),I("div",{key:"r"+c,class:"cal-row"},[b("span",Ff,C(t[c]),1),(E(!0),I(K,null,ce(a,(l,u)=>(E(),I(K,{key:"c"+c+"-"+u},[l?(E(),I("span",{key:1,class:fe(["cal-cell",["cal-lv"+l.lv,{"cal-today":l.isToday}]]),title:l.k+" · "+l.h+"h · 完成"+l.doneN+"项"},null,10,Vf)):(E(),I("span",Kf))],64))),128))]))),128))]),b("div",Qf,[i[4]||(i[4]=b("div",{class:"cal-legend"},[b("span",{class:"muted-sm"},"少"),b("span",{class:"cal-cell cal-lv0"}),b("span",{class:"cal-cell cal-lv1"}),b("span",{class:"cal-cell cal-lv2"}),b("span",{class:"cal-cell cal-lv3"}),b("span",{class:"cal-cell cal-lv4"}),b("span",{class:"muted-sm"},"多")],-1)),b("span",Yf,[i[3]||(i[3]=X("累计 ",-1)),b("b",null,C(s.value.totalH)+"h",1)])])]),_:1}))}}),Xf=Ke(Wf,[["__scopeId","data-v-d14087cc"]]),Zf={class:"dsh-root"},ep=["innerHTML"],tp={class:"dsh-bento"},np=le({__name:"DashboardView",setup(e){const t=j(()=>(w.get().milestones,w.get().alerts,ms.bannerHtml()));return un(()=>{fd(),pd()}),(n,r)=>(E(),I("div",Zf,[t.value?(E(),I("div",{key:0,class:"dsh-banner",innerHTML:t.value},null,8,ep)):$("",!0),ie(ed),b("div",tp,[ie(_d,{class:"dsh-span7"}),ie(nf,{class:"dsh-span5"}),ie(ff,{class:"dsh-span7"}),ie(vf,{class:"dsh-span5"}),ie(Nf,{class:"dsh-span7"}),ie(Hf,{class:"dsh-span5"}),ie(Xf,{class:"dsh-span12"})])]))}}),rp=Ke(np,[["__scopeId","data-v-f21c490f"]]),sp=[{path:"/",redirect:"/dashboard"},{path:"/dashboard",name:"dashboard",component:rp},...sn.filter(e=>e.id!=="dashboard").map(e=>({path:"/"+e.id,name:e.id,component:Zs})),{path:"/tool/aitools",name:"aitools",component:zu},{path:"/tool/:id",name:"tool",component:Zs},{path:"/:pathMatch(.*)*",redirect:"/dashboard"}],Me=Aa({history:Ta(),routes:sp});Me.beforeEach(()=>{const e=window.FocusModule;return e&&e.active?(z.show("深度专注进行中，请先点「中断专注」结束再切换","warn",3500),!1):!0});function op(){let e="";try{const r=q.tools();r&&r.length&&(e='<div class="muted-sm" style="margin:10px 0 4px;font-size:12px">🧩 插件工具</div><div class="tools-grid">'+r.map(s=>'<button class="tool-cell" data-tab="'+s.id+'"><span class="tool-icon">'+(s.icon||"🧩")+"</span><span>"+x.esc(s.title)+"</span></button>").join("")+"</div>")}catch{}const t=Qr.map(r=>'<button class="tool-cell" data-tab="'+r.id+'"><span class="tool-icon">'+(rn[r.icon]||"🧩")+"</span><span>"+r.label+"</span></button>").join(""),n=we.open({title:"🧰 工具箱",html:'<div class="tools-grid">'+t+"</div>"+e,actions:[{label:"关闭"}]});document.querySelectorAll(".tool-cell").forEach(r=>{r.onclick=()=>{const s=r.getAttribute("data-tab");n(),s&&Me.push("/tool/"+s)}})}const ip={class:"bottomnav",id:"bottomnav","data-testid":"bottomnav"},ap=["data-tab","data-testid","onClick"],cp={class:"bn-icon"},lp={class:"bn-label"},up=["data-tab","onClick"],dp={class:"bn-icon"},fp=["innerHTML"],pp={class:"bn-icon"},hp={class:"bn-scroll"},mp=["data-tab","onClick"],gp={class:"bn-icon"},yp={class:"bn-label"},vp=["data-tab","onClick"],wp={class:"bn-icon"},bp=["innerHTML"],kp=le({__name:"BottomNav",setup(e){const t=qr(),n=mo(),{toggle:r}=gi(),s=j(()=>String(t.params.id||t.name||"")),o=de([]),i=de([]);function a(){try{o.value=q.maintabs()||[]}catch{o.value=[]}try{i.value=q.tools()||[]}catch{i.value=[]}}un(a);const c=j(()=>!sn.some(d=>d.id===s.value)&&!!s.value);function l(d){n.push("/"+d)}function u(d){n.push("/tool/"+d)}function f(d){return x.esc(d)}return(d,m)=>(E(),I("nav",ip,[m[6]||(m[6]=b("div",{class:"bn-brand"},[b("div",{class:"bn-brand-name"},[b("span",{class:"bn-brand-ico"},"🎯"),X("26考研作战系统")]),b("div",{class:"bn-brand-sub"},"最适合你的工作台")],-1)),b("button",{class:"bn-layout-toggle","data-testid":"layout-toggle",title:"切回手机单列布局",onClick:m[0]||(m[0]=p=>U(r)())}," 📱 切回手机布局 "),(E(!0),I(K,null,ce(U(sn),p=>(E(),I("button",{key:p.id,class:fe(["bn-btn",{"bn-on":s.value===p.id}]),"data-tab":p.id,"data-testid":"nav-"+p.id,onClick:y=>l(p.id)},[b("span",cp,[ie(xn,{name:p.icon},null,8,["name"])]),b("span",lp,C(p.label),1)],10,ap))),128)),(E(!0),I(K,null,ce(o.value,p=>(E(),I("button",{key:"plugin-"+p.id,class:fe(["bn-btn",{"bn-on":s.value===p.id}]),"data-tab":p.id,onClick:y=>u(p.id)},[b("span",dp,C(p.icon||"🧩"),1),b("span",{class:"bn-label",innerHTML:f(p.name)},null,8,fp)],10,up))),128)),b("button",{class:fe(["bn-btn",{"bn-on":c.value}]),"data-tab":"__tools","data-testid":"nav-tools",onClick:m[1]||(m[1]=p=>U(op)())},[b("span",pp,[ie(xn,{name:"tools"})]),m[4]||(m[4]=b("span",{class:"bn-label"},"工具",-1))],2),m[7]||(m[7]=b("div",{class:"bn-group"},"工具",-1)),b("div",hp,[(E(!0),I(K,null,ce(U(Qr),p=>(E(),I("button",{key:"tool-"+p.id,class:fe(["bn-btn",{"bn-on":s.value===p.id}]),"data-tab":p.id,onClick:y=>u(p.id)},[b("span",gp,[ie(xn,{name:p.icon},null,8,["name"])]),b("span",yp,C(p.label),1)],10,mp))),128)),(E(!0),I(K,null,ce(i.value,p=>(E(),I("button",{key:"ptool-"+p.id,class:fe(["bn-btn",{"bn-on":s.value===p.id}]),"data-tab":p.id,onClick:y=>u(p.id)},[b("span",wp,C(p.icon||"🧩"),1),b("span",{class:"bn-label",innerHTML:f(p.title)},null,8,bp)],10,vp))),128))]),b("div",{class:"bn-user bn-user-clickable",role:"button",tabindex:"0",title:"前往设置","data-testid":"nav-go-settings",onClick:m[2]||(m[2]=p=>u("settings")),onKeydown:m[3]||(m[3]=Rr(p=>u("settings"),["enter"]))},[...m[5]||(m[5]=[b("span",{class:"bn-user-avatar"},"岸",-1),b("span",null,[b("b",null,"上岸预定人"),X("点击前往设置")],-1),b("span",{class:"bn-user-arrow","aria-hidden":"true"},"›",-1)])],32)]))}}),Sp={class:"app"},xp={class:"wb-pagehead","data-testid":"pagehead"},_p={class:"wb-pagehead-sub"},Ap=["data-cols"],Tp={class:"view",id:"vue-view","data-testid":"vue-view"},Ep=le({__name:"App",setup(e){const t=qr(),n=new Set(["aitools","dashboard"]),r=j(()=>n.has(String(t.name||""))),s=j(()=>String(t.params.id||t.name||"dashboard")),o=j(()=>zo(s.value)),i=j(()=>x.daysTo(w.get().settings.examDate)),a=j(()=>{const d=new Date;return x.dkey(d).slice(5)+" · "+["周日","周一","周二","周三","周四","周五","周六"][d.getDay()]}),c=new Set(["scheduler"]),l=j(()=>c.has(s.value)?"2":void 0);let u=null;function f(){const d=document.getElementById("view"),m=document.getElementById("vue-view"),p=r.value?m:d;p&&(p.classList.remove("view-enter"),p.offsetWidth,p.classList.add("view-enter"),u&&clearTimeout(u),u=setTimeout(()=>p.classList.remove("view-enter"),620))}return Br(()=>t.fullPath,()=>f()),un(()=>{f()}),(d,m)=>{const p=Ea("RouterView");return E(),I(K,null,[b("div",Sp,[ie(Oc),b("div",xp,[b("div",null,[b("h1",null,C(o.value),1),b("div",_p,C(a.value)+" · 距考研 "+C(i.value)+" 天",1)])]),lt(b("main",{class:"view",id:"view","data-cols":l.value},null,8,Ap),[[Bs,!r.value]]),lt(b("main",Tp,[ie(p)],512),[[Bs,r.value]]),ie(kp)]),m[0]||(m[0]=b("div",{id:"toast-wrap"},null,-1))],64)}}}),se={},Ht={},Op={run(e,t,n,r){if(r=r||{},Ht[e])return Ht[e];const s={id:e,label:t||e,status:"running",result:void 0,error:"",extra:r.extra||null,startedAt:new Date().toISOString(),finishedAt:""};se[e]=s;const o=Promise.resolve().then(function(){return n()}).then(function(i){if(s.status="done",s.result=i,s.finishedAt=new Date().toISOString(),delete Ht[e],r.onDone)try{r.onDone(i,s)}catch(a){console.warn("[BgTask] onDone 回调异常",a)}return window.U&&x.emit&&x.emit("bgTask:done",{id:e,label:s.label,result:i}),i},function(i){if(s.status="error",s.error=i&&i.message?i.message:String(i),s.finishedAt=new Date().toISOString(),delete Ht[e],r.onError)try{r.onError(i,s)}catch(a){console.warn("[BgTask] onError 回调异常",a)}throw window.U&&x.emit&&x.emit("bgTask:error",{id:e,label:s.label,error:s.error}),i});return Ht[e]=o,o.catch(function(){}),o},isRunning(e){return!!(se[e]&&se[e].status==="running")},get(e){return se[e]||null},getResult(e){return se[e]&&se[e].status==="done"?se[e].result:void 0},getError(e){return se[e]&&se[e].status==="error"?se[e].error:""},clear(e){se[e]&&se[e].status!=="running"&&delete se[e]},clearAll(){Object.keys(se).forEach(function(e){se[e].status!=="running"&&delete se[e]})},list(e){return Object.keys(se).filter(function(t){return!e||se[t].status==="running"}).map(function(t){return se[t]})}},Ip=`# kaoyan2026 云端出卷执行器 workflow（2026-08-24；v11 增 PDF 导入资源 Gist）
# 触发：本地工具通过 workflow_dispatch 派发
#   inputs.gist_id          = 任务 Gist id（出卷/导入任务本身）
#   inputs.resource_gist_id = 【v11 可选】PDF 导入时源文件所在的资源 Gist id
#                              （任务 Gist 只剩几 KB，彻底绕开 Gist 单文件 1MB 截断边界）
#                              不传则走老路径（源文件在任务 Gist 内）——向下兼容
# 所需 repo secrets（仓库 Settings → Secrets and variables → Actions）：
#   CLOUDJOB_GH_TOKEN     GitHub 令牌（需 gist 权限，用于读写任务 Gist）—— 必配
#   CLOUDJOB_AI_ENDPOINT / CLOUDJOB_AI_KEY / CLOUDJOB_AI_MODEL —— 可选回退：
#     本地工具提交任务时会把 AI 配置自动写进 job.json（存于用户本人 secret Gist），
#     执行器优先读取；仅当任务未自带时才用这三个 secrets。
name: AI Exam Runner

on:
  workflow_dispatch:
    inputs:
      gist_id:
        description: 'CloudJob Gist ID'
        required: true
      resource_gist_id:
        description: '【可选】试卷源文件 Gist ID（导入任务专用）'
        required: false
        default: ''

jobs:
  run-exam:
    runs-on: ubuntu-latest
    # 【2026-09-01】45 → 90：慢模型出强化卷（35+ 题）本就可能跑 40 分钟+，
    # 叠加 API 限额退避（v9 起最长等 30 分钟）后 45 分钟必死。超时被杀时
    # runner 已有 SIGTERM 终态回写（不再留「冻结在半路」的假运行状态）。
    timeout-minutes: 90
    steps:
      - name: Checkout runner
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup Python (AI 验算工具)
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install sympy
        run: pip install sympy

      # 【v11 PDF 导入】poppler-utils（pdfinfo / pdftotext / pdftoppm）——解析试卷必需的三个命令行工具。
      # 踩坑实证（2026-09-02）：ubuntu-latest **并未预装** poppler-utils，缺它时导入任务会在
      # 「已拉到源文件之后」直接崩 pdfinfo: not found。这里显式安装（约 10~20s，Actions runner 有免密 sudo）。
      # runner 侧另有运行时自救（检测到 not found 会自己 apt-get 装一次再重试），双保险。
      - name: Install poppler-utils (PDF 解析：页数/文字层/转图)
        run: |
          sudo apt-get update -qq
          sudo apt-get install -y -qq poppler-utils
          pdfinfo -v 2>&1 | head -1

      - name: Run cloud exam job
        env:
          GIST_ID: \${{ github.event.inputs.gist_id }}
          SOURCE_GIST_ID: \${{ github.event.inputs.resource_gist_id }}
          GH_TOKEN: \${{ secrets.CLOUDJOB_GH_TOKEN }}
          AI_ENDPOINT: \${{ secrets.CLOUDJOB_AI_ENDPOINT }}
          AI_KEY: \${{ secrets.CLOUDJOB_AI_KEY }}
          AI_MODEL: \${{ secrets.CLOUDJOB_AI_MODEL }}
        run: node tools/cloud/ai-exam-runner.cjs
`,Mp=`#!/usr/bin/env node
/* ============================================================
 * kaoyan2026 云端出卷执行器（GitHub Actions 内运行，2026-08-24）
 * 流水线：读任务 → 总工规划(1 call) → 并发出题池(conc 4) → 蓝本硬校验(纯代码)
 *        → 总工程师审查(1 call) → 定向重写池(conc 3) → 终检 → result.json 回写 Gist
 * 环境变量（全部来自 repo secrets / dispatch inputs）：
 *   GIST_ID      任务 Gist id（workflow_dispatch inputs）
 *   GH_TOKEN     GitHub 令牌（需 gist 权限）
 *   AI_ENDPOINT  OpenAI 兼容接口地址（如 https://api.xxx.com/v1）
 *   AI_KEY       接口密钥
 *   AI_MODEL     模型名
 * 设计原则：任何阶段失败 → status.json 标 error + 原因；绝不把半成品标 done。
 *           用户在本地取消（status=canceled）→ 阶段边界检测到即退出。
 * ============================================================ */
'use strict';
/* TOOLS:python v8 —— 云端闭环出题（2026-08-31）：出题/重写/审查 AI 可自主调用
 * 沙箱 Python（sympy/numpy），按人类命题人闭环工作：产生思路→计算验证→
 * 闭环调整→验收合格→输出。子进程 env 已净化，
 * GH_TOKEN/AI Key 等敏感变量不传入。不可用时自动退化为纯 LLM 出卷。 */
const { exec: cpExec } = require('child_process');
const osT = require('os');
const fsT = require('fs');
const pathT = require('path');
let PY_TOOLS_ON = false;
function execPython(code) {
  return new Promise((resolve) => {
    const f = pathT.join(osT.tmpdir(), 'at_tool_' + Date.now() + '_' + Math.random().toString(36).slice(2) + '.py');
    try { fsT.writeFileSync(f, String(code || ''), 'utf8'); } catch (e) { resolve({ ok: false, output: '', error: '写临时文件失败' }); return; }
    cpExec('python3 ' + JSON.stringify(f), {
      timeout: 30000, maxBuffer: 1024 * 1024, cwd: process.cwd(),
      env: { PATH: process.env.PATH || '', HOME: process.env.HOME || '', PYTHONIOENCODING: 'utf-8' }
    }, (err, stdout, stderr) => {
      try { fsT.unlinkSync(f); } catch (e) {}
      resolve({ ok: !err, output: String(stdout || '').slice(0, 1500), error: err ? (String(stderr || '').slice(0, 600) || err.message) : '' });
    });
  });
}
const https = require('https');
const { URL } = require('url');

const API = 'https://api.github.com';
const GIST_ID = process.env.GIST_ID || '';
const SOURCE_GIST_ID = process.env.SOURCE_GIST_ID || '';   // 【v11】PDF 导入时源文件所在独立 Gist（任务 Gist 截断时绕路用）
const GH_TOKEN = process.env.GH_TOKEN || '';
/* 【2026-09-02 PDF 导入】通用 shell 执行（poppler 工具链：pdfinfo/pdftotext/pdftoppm）。
 * 参数一律 JSON.stringify 引号化防注入；只允许跑本机二进制，不接收任何来自 Gist/AI 的命令文本。
 * ⚠️ poppler 在 ubuntu-latest 上**并未预装**（2026-09-02 真机踩坑），由 ensurePoppler 负责探测+自救。 */
function runShell(cmd, timeoutMs, maxBuffer) {
  return new Promise((resolve) => {
    cpExec(cmd, { timeout: timeoutMs || 60000, maxBuffer: maxBuffer || 8 * 1024 * 1024, cwd: process.cwd(),
      env: { PATH: process.env.PATH || '', HOME: process.env.HOME || '', LANG: 'C.UTF-8' } },
      (err, stdout, stderr) => resolve({ ok: !err, out: String(stdout || ''), err: err ? (String(stderr || '').slice(0, 400) || err.message) : '' }));
  });
}
/* 【v11 poppler 可用性】踩坑实证（2026-09-02）：GitHub Actions 的 ubuntu-latest
 * **并不预装** poppler-utils（此前假设「自带」是错的，真机实测 pdfinfo: not found）。
 * 三道防线：① 开跑前探测；② 缺失则运行时自救（Actions runner 有免密 sudo，装一次约 10~20s）
 * ——即使用户仓库里的 workflow 还是旧版（不含安装步骤），导入任务也能自己救回来；
 * ③ 装不上时给出「点一键安装升级 workflow」的明确出路，绝不再把环境缺失误报成文件损坏。 */
let POPPLER_READY = false;
async function ensurePoppler() {
  if (POPPLER_READY) return true;
  const probe = await runShell('command -v pdfinfo; command -v pdftotext; command -v pdftoppm', 20000);
  const out = String(probe.out || '');
  if (out.indexOf('pdfinfo') >= 0 && out.indexOf('pdftotext') >= 0 && out.indexOf('pdftoppm') >= 0) {
    POPPLER_READY = true;
    return true;
  }
  pushLog('⚙️ poppler-utils 缺失，尝试自动安装…', 'warn');
  const inst = await runShell('sudo apt-get update -qq && sudo apt-get install -y -qq poppler-utils', 240000);
  const probe2 = await runShell('command -v pdfinfo; command -v pdftotext; command -v pdftoppm', 20000);
  const out2 = String(probe2.out || '');
  POPPLER_READY = !!(out2.indexOf('pdfinfo') >= 0 && out2.indexOf('pdftotext') >= 0 && out2.indexOf('pdftoppm') >= 0);
  if (POPPLER_READY) pushLog('✅ poppler-utils 已自动安装就绪（pdfinfo/pdftotext/pdftoppm 齐备）');
  else pushLog('⚠️ poppler-utils 自动安装失败：' + String(inst.err || '').slice(0, 120), 'warn');
  return POPPLER_READY;
}
/* gist 大文件（>1MB 会被 API 响应截断）：抓 raw_url。secret gist 的 raw 匿名 404，
 * 必须带 GH_TOKEN；返回 Buffer（PDF/base64 都可能非 UTF-8 安全）。 */
function ghGetRawBuffer(urlStr) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlStr);
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search, method: 'GET',
      headers: { 'Authorization': 'Bearer ' + GH_TOKEN, 'User-Agent': 'kaoyan2026-cloudjob-runner' },
      timeout: 120000
    }, res => {
      if (res.statusCode >= 400) { res.resume(); return reject(new Error('raw HTTP ' + res.statusCode)); }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('timeout', () => req.destroy(new Error('raw 拉取超时')));
    req.on('error', reject);
    req.end();
  });
}
// 取 gist 中某文件的完整文本：truncated 或 content 缺失/空/与 size 对不上时都走 raw_url 回补。
// 教训：2026-09-02 导入任务因此崩在 JSON.parse 失败（GitHub Gist API 在大文件边界下
// 偶发把小文件 content 置空、不标 truncated——L902 守卫只看 key 不看 content 就掉坑）。
async function gistFileText(files, name) {
  const f = files && files[name];
  if (!f) return null;
  const needRaw = !!f.truncated || !f.content || !f.content.length
    || (f.size && f.content.length < f.size);
  if (!needRaw) return f.content;
  if (!f.raw_url) throw new Error(name + ' content 缺失且无 raw_url（无法回补）');
  const buf = await ghGetRawBuffer(f.raw_url);
  return buf.toString('utf8');
}
async function gistFileBuffer(files, name) {
  const f = files && files[name];
  if (!f) return null;
  const needRaw = !!f.truncated || !f.content || !f.content.length
    || (f.size && f.content.length < f.size);
  if (!needRaw) return Buffer.from(f.content, 'utf8');
  if (!f.raw_url) throw new Error(name + ' content 缺失且无 raw_url（无法回补）');
  return await ghGetRawBuffer(f.raw_url);
}
// 【v11】从资源 Gist / 任务 Gist 读 PDF/图片源文件：先 source.pdf（>1MB 走 b64 走 b64 通道）
async function readSourceBuffer(files, tag) {
  if (files['source.pdf']) return await gistFileBuffer(files, 'source.pdf');
  if (files['source.pdf.b64']) {
    const t = await gistFileText(files, 'source.pdf.b64');
    if (!t) return null;
    return Buffer.from(String(t).replace(/[^A-Za-z0-9+/=]/g, ''), 'base64');
  }
  // 标签友好化：资源 Gist 'source.pdf.b64' / 任务 Gist 'source.pdf.b64'，但报错时区分
  if (Object.keys(files || {}).length === 0) throw new Error(tag + ' 内无任何 files');
  throw new Error(tag + ' 内没有 source.pdf / source.pdf.b64（候选 files：' + Object.keys(files).join(',') + '）');
}
// 执行器版本（单一事实来源）：本地 cloudjob.ts 用正则从本文件源码提取（本地资产 vs 仓库远端），
// 向导第②步显示「云端 v? vs 本地 v?」。改版本只改这一处，所有 status.json 回写自动跟随。
const RUNNER_VER = 'v14';

if (!GIST_ID || !GH_TOKEN) { console.error('缺 GIST_ID 或 GH_TOKEN'); process.exit(1); }

function log(...a) { console.log('[runner]', ...a); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// AI 配置：优先 job.json 里的 prefs.ai（本地工具自动写入，免配 secrets），回退 repo secrets。
// 在主流程读到 job 后调用 initAiConf() 完成校验。
let JOB_AI = null;
let JOB_THINK = false;   // 思考模式（来自 job.prefs.think）——结构化 JSON 默认关闭，避免思考烧光 token 致空正文
let JOB_MAXTOK = 32768;  // 最大输出 token（2026-08-31 用户要求：默认 8000→32768；可被 job.prefs.maxTokens 覆盖，钳制 1024-65536）
let JOB_MAJOR = '';      // 专业课名（来自 job.prefs.major）——"专业课"科目出卷时必须具体到专业，否则出成泛化卷
function aiConf(k) {
  if (JOB_AI && JOB_AI[k]) return String(JOB_AI[k]);
  return process.env['AI_' + k.toUpperCase()] || '';
}
// 科目显示名：专业课带具体专业名（如「专业课（自控原理）」），其余科目用静态名。
function subjName(subj) {
  if (subj === 'ctrl' && JOB_MAJOR) return '专业课（' + JOB_MAJOR + '）';
  return (SUBJ_NAME[subj] || '综合');
}

// ---------- GitHub Gist ----------
function ghReq(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com', path, method,
      headers: {
        'Authorization': 'Bearer ' + GH_TOKEN,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'kaoyan2026-cloudjob-runner',
        'Content-Length': data ? Buffer.byteLength(data) : 0
      },
      timeout: 30000
    }, res => {
      let txt = '';
      res.on('data', c => txt += c);
      res.on('end', () => {
        if (res.statusCode === 204) return resolve(null);
        let d = null;
        try { d = txt ? JSON.parse(txt) : null; } catch (e) {}
        if (res.statusCode >= 400) {
          const e = new Error('GitHub HTTP ' + res.statusCode + ' ' + txt.slice(0, 200));
          e.status = res.statusCode;
          // 【2026-09-01 限额长退避】403/429 必须区分「限额」与「权限」：限额是暂时的
          //（窗口最长 60 分钟），权限错误是永久的。靠响应头识别，把 reset 时刻带给
          // ghRetry 安排真正的等待，而不是 2~8s 后放弃（那正是「进度冻结一小时」的元凶）。
          const rem = res.headers && res.headers['x-ratelimit-remaining'];
          const rst = res.headers && res.headers['x-ratelimit-reset'];
          if (res.statusCode === 429 || String(rem) === '0') {
            e.rateLimited = true;
            if (rst) e.rateReset = Number(rst) * 1000;
            const ra = res.headers && res.headers['retry-after'];
            if (ra) e.retryAfterMs = Number(ra) * 1000;
          }
          return reject(e);
        }
        resolve(d);
      });
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('GitHub 请求超时')));
    if (data) req.write(data);
    req.end();
  });
}
// 【2026-09-01 限额长退避】限额等待总预算：本地轮询 + 执行器回写共用同一个 PAT，
// 5000 次/时烧穿后，等窗口重置（最长 60 分钟）是唯一出路。预算 30 分钟封顶，
// 防止无限等把 Actions 时长烧光；预算耗尽才真正放弃（写 error 终态）。
let _rlWaitBudgetMs = 30 * 60 * 1000;
async function ghRetry(method, path, body, tries = 4) {
  for (let i = 0; ; i++) {
    try { return await ghReq(method, path, body); }
    catch (e) {
      if (e.rateLimited) {
        // 等到 reset 时刻（+3s 余量），单次最长 5 分钟、且不得超过剩余预算
        let waitMs = e.retryAfterMs || (e.rateReset ? Math.max(0, e.rateReset - Date.now() + 3000) : 60000);
        waitMs = Math.min(waitMs, 300000, _rlWaitBudgetMs);
        if (waitMs <= 0) throw new Error('GitHub API 限额持续未恢复（已累计等待 30 分钟），本次任务放弃回写：' + e.message);
        _rlWaitBudgetMs -= waitMs;
        log('⏸ GitHub API 限额，退避 ' + Math.round(waitMs / 1000) + 's 后重试（等待预算剩 ' + Math.round(_rlWaitBudgetMs / 60000) + ' 分钟）');
        pushLog('⏸ GitHub API 限额耗尽：退避 ' + Math.round(waitMs / 1000) + 's 后继续（出题不中断，进度回写延后）', 'warn');
        await sleep(waitMs);
        i = -1;   // 限额等待不计入普通重试次数
        continue;
      }
      if (i >= tries - 1 || (e.status && e.status < 500 && e.status !== 403)) throw e;
      log('GitHub 请求失败重试', i + 1, e.message);
      await sleep(2000 * (i + 1));
    }
  }
}
// ---------- 过程事件日志（写进 status.json.log，前端 aiFloat 浮窗实时可视化） ----------
/* 【H5，2026-08-30】运行日志：带级别(level)与耗时(dur)，并在失败时单独落盘 log.json。
 * 为什么日志要带级别：出卷跑 10~20 分钟、日志上百条，失败后用户只想看「哪一刻开始出问题」，
 * 平铺文本没法筛选。带级别后客户端可以直接定位到最后一条 error/warn。
 * 为什么还要单独落盘 log.json：日志一直挂在 status.json 里，而 status.json 是每次状态变更
 * 全量覆写——如果最后一次写 status 恰好失败（网络/权限/体积），日志就跟着一起丢了，
 * 那正是最需要看日志的时刻。所以失败分支额外把完整日志写一份独立的 log.json。 */
const RUN_LOG = [];
function pushLog(msg, level, dur) {
  const lv = (level === 'warn' || level === 'error') ? level : 'info';
  RUN_LOG.push({ t: new Date().toISOString(), lv: lv, msg: String(msg), dur: (typeof dur === 'number' ? dur : null) });
  if (RUN_LOG.length > 120) RUN_LOG.splice(0, RUN_LOG.length - 120);   // 只留最近 120 条
}
// 失败时把完整日志单独写一份（不受 status.json 覆写失败影响）
async function writeLogFile(extra, jobId) {
  try {
    const payload = { runnerVer: RUNNER_VER, jobId: jobId || '', at: new Date().toISOString(), error: extra || null, entries: RUN_LOG };
    await ghRetry('PATCH', '/gists/' + GIST_ID, { files: { 'log.json': { content: JSON.stringify(payload) } } }, 2);
    log('📜 已落盘 log.json（' + RUN_LOG.length + ' 条）');
  } catch (e) { log('!! log.json 落盘失败（不影响主流程）：', e.message); }
}

// ---------- 逐题状态跟踪（写进 status.json.qs，前端浮窗渲染逐题卡片墙） ----------
// st: wait=排队中 / run=出题中 / done=完成 / fail=生成失败 / rewrite=重写中
const QS = [];
// 已出合格题目（用于「停止并保存」——取消时把已完成的题攒成 partial 卷）
let SAVED = [];

// ---------- 已出题目的持续落盘（partial.json） ----------
// 【2026-08-29 重构】旧实现的死结：已出题目只活在进程内存 SAVED 里，Gist 上没有任何题目内容
// （status.json.qs 只是状态摘要，stem 被截断到 140 字符，无法还原成题）。于是「停止并保存」
// 完全依赖本进程存活——可用户恰恰是在「出卷失败」（进程已走 error 分支退出）后才去点保存，
// 此时没人读 cancel.json、没人写 result.json，本地轮询 40s 永远等不到，题目随进程永久丢失。
//
// 改为：每出好一题，立即把「已完成题目全集」增量写进 Gist 的 partial.json。
// 题目不再只活在内存：进程崩了/失败了/被取消了，之前落盘的题仍在 Gist 上，
// 客户端可自行读取组装成部分卷（CloudJob.collectPartial），完全不需要本进程配合。
//
// 两个落盘时机：
//   ① 出题阶段每题完成后（初稿，reviewed=false）
//   ② 终检通过后、写 result.json 之前（终稿，reviewed=true）
//   ② 很关键：写 result.json 是整条链路最后一步、文件最大、最容易失败，
//      落盘终稿后即使这一步挂了，客户端仍能抢救到「经过审查的完整卷」而非初稿。
let _flushChain = Promise.resolve();
let _partialCount = 0;   // 已成功落盘的题数（写进 status.json.savedCount，即「可抢救数量」）
// 【2026-09-03 配额治理】每题完成即写 partial.json 的「全集」是第二烧配额大户：
// 22 题卷子 = 22 次 PATCH，且 payload 随题目累积越来越大。改为「每 3 题或距上次 ≥90s」
// 落一次（opts.force 绕过节流）：抢救粒度从「最多丢 1 题」变「最多丢 3 题/90s」，
// 而一题要 30s~2min —— 实际丢题窗口 <1 题，几乎无损。终稿/取消/失败前抢救一律 force。
// 【竞态修正】节流计数改为「同步预约」：旧实现在异步链内 PATCH 成功后才更新 _lastFlushCount，
// 并发完成多题时它们同步检查看到的都是旧值 → 全部通过节流各自排队（harness 实测 6 题落 7 次）。
// 现在决策与预约在函数顶部同步完成，异步链只负责 PATCH——后续调用立即看到已预约的题数。
let _flushAt = 0, _flushCount = 0;   // 最近一次「已发起」落盘的时刻与题数（同步预约，非落盘成功）
const _FLUSH_EVERY_N = 3, _FLUSH_MIN_MS = 90000;
async function flushPartial(questions, opts) {
  opts = opts || {};
  const list = (questions || []).filter(q => q && q.stem);
  const now = Date.now();
  if (!opts.force) {
    if (list.length > 0 && list.length <= _flushCount) return _flushChain;   // 已被预约覆盖（无更新的题）
    if (_flushCount > 0 && list.length - _flushCount < _FLUSH_EVERY_N
        && now - _flushAt < _FLUSH_MIN_MS) return _flushChain;   // 节流窗口内攒着
  }
  _flushAt = now; _flushCount = list.length;   // 同步预约：本次将落盘 list.length 题
  _flushChain = _flushChain.then(async () => {
    const payload = {
      count: list.length,
      reviewed: !!opts.reviewed,
      subject: opts.subject || 'math',
      updatedAt: new Date().toISOString(),
      questions: list
    };
    if (opts.imported) payload.imported = true;   // v10：导入通道落盘标记（客户端据此区分抢救卷类型）
    try {
      await ghRetry('PATCH', '/gists/' + GIST_ID, { files: { 'partial.json': { content: JSON.stringify(payload) } } }, 3);
      _partialCount = list.length;
      log('💾 落盘 partial.json：' + list.length + ' 题' + (opts.reviewed ? '（终稿·已过审）' : '（初稿）'));
    } catch (e) {
      // 落盘失败绝不中断出题主流程：最坏退回「这一题没落盘」，其余题目继续出
      log('!! partial.json 落盘失败（不中断出卷）：', e.message);
    }
  }).catch(() => {});
  return _flushChain;
}

/* 【H1 断点续跑，2026-08-30】读回已落盘的 partial.json。
 * 续跑的前提是「之前出的题还在」——这正是 2026-08-29 那次落盘重构换来的能力：
 * 题目不再只活在进程内存里，进程死了题还在 Gist 上，新进程可以直接接着出。 */
function readPartialJson(gist) {
  try {
    const f = gist && gist.files && gist.files['partial.json'];
    if (!f) return null;
    if (f.truncated) return { __truncated: true };
    return JSON.parse(f.content || '{}');
  } catch (e) { log('!! partial.json 解析失败：', e.message); return null; }
}

// setStatus 串行化：多 worker 并发完成时 PATCH 同一 gist 文件，链式排队避免互踩/乱序
//
// 【2026-09-03 配额救星·状态回写风暴治理】旧实现每次状态变更都全量 PATCH status.json
// （带整个 RUN_LOG + 全部 QS），一次 22 题出卷光「每题开工写一次 + 完成写一次」就烧 ~44 次
// PATCH，叠加 flushPartial 每题全集重写、checkCancel 每题探测，单任务 PATCH+GET 逼近 150 次。
// 多任务并发或本地云同步同时轮询时，一小时 5000 配额轻松烧穿 → 「进度冻结一小时」。
// 三重治理（均不改变出题质量与抢救能力）：
//   ① 去重：status+stage+msg+progress 全同 → 直接跳过（不写）。
//   ② 节流合并：同阶段内非终态且距上次真实写 < 8s → 只保留「最新一条」待发，窗口到点写一次。
//      并发出题时 genDone 递增被合并，进度条不倒退。
//   ③ 立即写：终态（done/error/canceled）、阶段切换（planning→generating 等里程碑）、
//      force（调用方显式要求）绕过节流，保证关键节点即时可见。
let _stChain = Promise.resolve();
const _ST_THROTTLE_MS = 8000;
let _stLast = { key: '', at: 0, stage: '' };
let _stPending = null;   // { status, stage, msg, progress, timer }
function _stKey(status, stage, msg, progress) { return [status, stage, msg, progress].join('|'); }
function setStatus(status, stage, msg, progress, force) {
  const key = _stKey(status, stage, msg, progress);
  const now = Date.now();
  const terminal = status !== 'running';   // done/error/canceled 必须即时
  const stageChanged = stage !== _stLast.stage;   // 阶段切换是里程碑，立即写
  // ① 去重：与上次真实写入完全相同 → 跳过
  if (!force && !terminal && !stageChanged && key === _stLast.key) return _stChain;
  // ② 节流合并：同阶段内非终态非强制 + 距上次写 < 窗口 → 攒最新待发（旧待发被覆盖）
  if (!force && !terminal && !stageChanged && (now - _stLast.at) < _ST_THROTTLE_MS) {
    if (_stPending) clearTimeout(_stPending.timer);
    const pend = { status, stage, msg, progress };
    pend.timer = setTimeout(function () {
      if (_stPending === pend) _stPending = null;
      _stChain = _stChain.then(() => _setStatus(status, stage, msg, progress)).catch(() => {});
    }, _ST_THROTTLE_MS - (now - _stLast.at));
    _stPending = pend;
    return _stChain;
  }
  // ③ 立即写（force / 终态 / 超窗口）：先丢弃待发（本次已含其最新信息）
  if (_stPending) { clearTimeout(_stPending.timer); _stPending = null; }
  _stChain = _stChain.then(() => _setStatus(status, stage, msg, progress)).catch(() => {});
  return _stChain;
}
// 强制冲刷待发状态（终止/收卷等关键退出点调用，确保节流攒着的最后进度不丢）
function flushPendingStatus() {
  if (_stPending) {
    const p = _stPending; _stPending = null;
    clearTimeout(p.timer);
    _stChain = _stChain.then(() => _setStatus(p.status, p.stage, p.msg, p.progress)).catch(() => {});
  }
  return _stChain;
}
// 丢弃待发状态（调用方紧接着要用 ghRetry 直写终态时用）：终态已含最新信息，
// 若不清待发，8s 后迟到的 running PATCH 会把刚写好的 done/error 覆盖回去。
function dropPendingStatus() {
  if (_stPending) { clearTimeout(_stPending.timer); _stPending = null; }
}
async function _setStatus(status, stage, msg, progress) {
  pushLog((stage ? '[' + stage + '] ' : '') + (msg || ''));
  // savedCount = 已成功落盘到 partial.json 的题数（= 客户端随时能抢救走的数量），
  // 让本地无需额外拉 Gist 就知道「现在有几题可抢救」，任务行可直接显示入口。
  const payload = { files: { 'status.json': { content: JSON.stringify({ status, stage: stage || '', msg: msg || '', progress: progress == null ? null : progress, log: RUN_LOG, qs: QS, savedCount: _partialCount, updatedAt: new Date().toISOString(), runnerVer: RUNNER_VER }) } } };
  try { await ghRetry('PATCH', '/gists/' + GIST_ID, payload); _stLast = { key: _stKey(status, stage, msg, progress), at: Date.now(), stage: stage }; log('status →', status, stage || '', msg || ''); return true; }
  catch (e) {
    const hint = (e && e.status === 404)
      ? '　👉 诊断：能读 job.json 却写不回 status，几乎可断定 CLOUDJOB_GH_TOKEN 对 Gist 缺「写」权限（请用 classic PAT 勾选 gist，或 fine-grained PAT 把 Gist 设为 Read & Write）'
      : '';
    log('!! 写状态失败（不中断主流程）：', e.message + hint);
    return false;
  }
}

// ---------- AI 调用（OpenAI 兼容 /chat/completions） ----------
function aiCall(messages, opts = {}) {
  const maxTok = opts.maxTokens || JOB_MAXTOK;   // 默认 32768（可经 job.prefs.maxTokens 配置）；思考模型开时一半耗在 reasoning 上
  // 本地 job.json 里 endpoint 是「完整请求 URL」（含 /chat/completions，如 openrouter 的
  // /api/v1/chat/completions）；repo secrets 回退时可能是 base URL（如 /api/v1）。幂等拼接，
  // 避免出现 /chat/completions/chat/completions 双拼导致 AI 404。
  let endpoint = aiConf('endpoint').trim().replace(/\\/+$/, '');
  if (!/\\/chat\\/completions$/.test(endpoint)) endpoint += '/chat/completions';
  const payload = { model: aiConf('model'), messages, temperature: opts.temperature == null ? 0.7 : opts.temperature, max_tokens: maxTok };
  // 思考模式控制：结构化 JSON 场景默认「不思考」——思考模型（LongCat-2.0 等）若开着思考，
  // 会把 max_tokens 全烧在 reasoning_content 上、content 返回空（finish_reason=length），
  // 这正是「云端卡在总审查三小时」的根因。 opts.think=true 才显式发 enable_thinking:true；
  // opts._plain=true（400 降级重试）则彻底去掉 chat_template_kwargs，兼容不认该字段的接口。
  if (!opts._plain) {
    payload.chat_template_kwargs = { enable_thinking: !!opts.think };
  }
  const body = JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    const u = new URL(endpoint);
    const req = https.request({
      hostname: u.hostname, port: u.port || 443, path: u.pathname + u.search, method: 'POST',
      headers: { 'Authorization': 'Bearer ' + aiConf('key'), 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: opts.timeoutMs || 240000
    }, res => {
      let txt = '';
      res.on('data', c => txt += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error('AI HTTP ' + res.statusCode + ' ' + txt.slice(0, 300)));
        try {
          const d = JSON.parse(txt);
          const ch0 = d.choices && d.choices[0];
          const msg = ch0 && ch0.message;
          const content = String((msg && msg.content) || '').trim();
          if (!content) {
            // 空正文诊断：思考模型把 max_tokens 全烧在 reasoning 上时 content 为空（finish_reason=length）
            // 必须用 reject 而非 throw——此处处于 res.on('end') 事件回调内，throw 会变成
            // 未捕获异常直接崩掉进程，主流程 catch→setStatus('error') 永远执行不到，
            // 任务状态就冻结在半路（12 小时假运行的根因）。
            const fr = (ch0 && ch0.finish_reason) || '?';
            const hasReason = !!(msg && (msg.reasoning_content || msg.reasoning));
            return reject(new Error('AI 返回空正文（finish_reason=' + fr
              + (hasReason ? '；模型只输出了思考内容没写答案——请换非思考模型、关闭思考模式或调大 max_tokens' : '；模型未输出任何内容')
              + '）响应片段：' + txt.slice(0, 150)));
          }
          resolve(content);
        } catch (e) { reject(new Error('AI 响应解析失败: ' + txt.slice(0, 200))); }
      });
    });
    req.on('timeout', () => req.destroy(new Error('AI 调用超时')));
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
async function aiRetry(messages, opts, tries = 3) {
  for (let i = 0; ; i++) {
    try {
      // 【H5】只给「慢调用」打点：每题都记耗时会把日志淹没，而出卷卡住时用户真正想知道的
      // 就是「是哪一次调用特别慢」。阈值 30s（正常出题 10~40s，超 60s 基本可判定异常）。
      const _t0 = Date.now();
      const r = await aiCall(messages, opts);
      const _dur = Date.now() - _t0;
      if (_dur >= 30000) pushLog('🐢 AI 调用较慢：' + Math.round(_dur / 1000) + 's' + (_dur >= 60000 ? '（异常，可能是思考模型在长推理）' : ''), 'warn', _dur);
      return r;
    }
    catch (e) {
      const m = (e && e.message) || '';
      const sm = m.match(/^AI HTTP (\\d{3})/);
      const code = sm ? Number(sm[1]) : 0;
      // 400 且当前还带着 chat_template_kwargs：不少接口不认 enable_thinking 这个扩展字段，
      // 去掉该字段用纯 body 重试一次（对齐本地 ai.js 的「400 极简重试」降级链）。
      if (code === 400 && opts && !opts._plain) {
        log('AI 400：接口可能不认 chat_template_kwargs，去掉思考开关字段重试…');
        opts = Object.assign({}, opts, { _plain: true });
        continue;
      }
      // 401/403：令牌无效/无权限——重试毫无意义，立即失败并点破最常见根因
      if (code === 401 || code === 403) {
        throw new Error(m + '　👉 诊断：令牌无效或无权限。最常见根因是 endpoint 与 key 不匹配'
          + '（例如 endpoint 填了 api.agnes-ai.cn 但 key 还是 OpenRouter 的 sk-or-v1-…）。'
          + '请到押题页配置向导换成该平台自己的 key，保存后重新提交/重发任务');
      }
      // 其他 4xx（除 429/408）：请求本身有问题（模型名错/参数错），重试也不会好
      if (code && code >= 400 && code < 500 && code !== 429 && code !== 408) throw e;
      // 429 限流：退避加倍重试（限流是暂时的，多等一会儿比失败好）
      if (code === 429 && i < tries - 1) {
        log('AI 限流 429，退避', 15 * (i + 1), 's 后重试');
        pushLog('⏳ AI 限流 429，退避 ' + (15 * (i + 1)) + 's 后重试（第 ' + (i + 1) + ' 次）', 'warn');
        await sleep(15000 * (i + 1));
        continue;
      }
      if (i >= tries - 1) throw e;
      log('AI 调用失败重试', i + 1, e.message);
      pushLog('🔁 AI 调用失败，' + (3 * (i + 1)) + 's 后重试（第 ' + (i + 1) + '/' + (tries - 1) + ' 次）：' + String(e.message).slice(0, 80), 'warn');
      await sleep(3000 * (i + 1));
    }
  }
}
// 【v13 子母卷】纯文本 AI 调用（带 aiRetry 重试链）：用于「命题形式研究报告」这类
// 输出为自然语言（非 JSON）的阶段。think 默认跟随 JOB_THINK，由调用方 opts 覆盖。
async function aiText(messages, opts) {
  return await aiRetry(messages, Object.assign({ think: JOB_THINK }, opts || {}));
}
// 宽容 JSON 抽取：剥 <think> 思考块 → 剥代码围栏 → 找首个平衡的 {...} 或 [...]
function extractJson(txt) {
  let t = String(txt || '')
    .replace(/<think>[\\s\\S]*?<\\/think>/gi, '')   // 思考模型的显式思考块
    .replace(/<think>[\\s\\S]*$/i, '')             // 未闭合的思考块（后面不会再有正文了）
    .trim();
  t = t.replace(/^\`\`\`(?:json)?\\s*/i, '').replace(/\`\`\`\\s*$/g, '').trim();
  try { return JSON.parse(t); } catch (e) {}
  const starts = [t.indexOf('{'), t.indexOf('[')].filter(i => i >= 0);
  if (!starts.length) throw new Error('输出中没有 JSON（原始输出前 160 字：' + t.slice(0, 160).replace(/\\s+/g, ' ') + '）');
  const s = Math.min(...starts);
  const open = t[s], close = open === '{' ? '}' : ']';
  let depth = 0, inStr = false, esc = false;
  for (let i = s; i < t.length; i++) {
    const ch = t[i];
    if (inStr) { if (esc) esc = false; else if (ch === '\\\\') esc = true; else if (ch === '"') inStr = false; continue; }
    if (ch === '"') inStr = true;
    else if (ch === open) depth++;
    else if (ch === close) { depth--; if (!depth) return JSON.parse(t.slice(s, i + 1)); }
  }
  throw new Error('JSON 不完整/被截断（输出末尾：…' + t.slice(-100).replace(/\\s+/g, ' ') + '）。可尝试调大 max_tokens 或换模型');
}

// AI 调用 + 宽容 JSON 抽取一体化：网络/HTTP 错误由 aiRetry 重试；
// 解析类失败（没 JSON / 被截断 / 空正文）自动换一轮重问。
// 「空正文/finish_reason=length」= 思考模型把 token 全烧在 reasoning 上：优先「关思考」重试，
// 仍空再翻倍 max_tokens（上限 32768 ≈ 65536 的一半）——云端对齐本地后能跑通的关键，避免三小时卡死。
async function aiJson(messages, opts, tries = 3) {
  let o = Object.assign({ think: JOB_THINK }, opts || {});
  for (let i = 0; ; i++) {
    let out;
    try { out = await aiRetry(messages, o, 2); }
    catch (e) {
      const m = (e && e.message) || '';
      if (/空正文|finish_reason=length/.test(m)) {
        if (!(o._thinkOff)) { o = Object.assign({}, o, { _thinkOff: true, think: false }); log('思考模型烧光 token 致空正文 → 关思考重试'); }
        else if ((o.maxTokens || JOB_MAXTOK) < JOB_MAXTOK) { o = Object.assign({}, o, { maxTokens: Math.min((o.maxTokens || JOB_MAXTOK) * 2, JOB_MAXTOK) }); log('关思考仍空正文，max_tokens 翻倍至', o.maxTokens, '重试'); }
      } else if (/JSON 不完整/.test(m) && (o.maxTokens || JOB_MAXTOK) < JOB_MAXTOK) {
        o = Object.assign({}, o, { maxTokens: Math.min((o.maxTokens || JOB_MAXTOK) * 2, JOB_MAXTOK) });
        log('疑似输出截断，max_tokens 翻倍至', o.maxTokens, '重试');
      }
      if (i >= tries - 1) throw e;
      await sleep(2000 * (i + 1));
      continue;
    }
    try { return extractJson(out); }
    catch (e) {
      log('JSON 解析失败，重问', i + 1, '/', tries, '：', ((e && e.message) || '').slice(0, 120));
      if (/JSON 不完整/.test((e && e.message) || '') && (o.maxTokens || JOB_MAXTOK) < JOB_MAXTOK) {
        o = Object.assign({}, o, { maxTokens: Math.min((o.maxTokens || JOB_MAXTOK) * 2, JOB_MAXTOK) });
        log('疑似输出截断，max_tokens 翻倍至', o.maxTokens, '重试');
      }
      if (i >= tries - 1) throw e;
      await sleep(2500 * (i + 1));
    }
  }
}

// ---------- 工具调用循环（云端 sympy 验算/画图） ----------
// v8（2026-08-31 用户定调「像人一样闭环出题」）：与本地 AI 测验同一工作法——
// 产生思路→计算验证→闭环调整→验收合格→输出。每一轮都自主决定是否调工具/思考。
const TOOL_APPENDIX = [
  '',
  '【工程工具模式——像人类命题人一样闭环工作（本次任务已启用，真 Ubuntu + Python3 + sympy/numpy）】',
  '⚠️ 你【确实拥有】python_exec 工具且它真实可用——不要因为"以为自己没有工具"而跳过计算或凭感觉编造数值。',
  '【多轮循环机制】这不是一次性问答：你输出工具 JSON 后【立即停止本轮】，系统会真实执行代码并把 stdout',
  '作为新消息回传给你，你再继续——来回多轮直到验收合格。"输出工具 JSON 等结果"是被支持的。',
  '你的工作循环（严格遵守）：',
  '① 产生思路：确定考点、解法、难度定位与命题意图。',
  '② 计算验证：调用 Python 工具（只输出 {"tool":"python_exec","code":"<Python代码>"}）真实算出标准答案与关键中间量；严禁凭感觉写答案。',
  '③ 闭环调整：检查计算结果——若答案/难度/计算量不符合命题意图，调整思路再算（可多轮）；若发现之前的解法有问题，推翻重来。',
  '④ 验收合格：标准答案经工具确认无误、题面所需数值全部落实。',
  '⑤ 开始输出：围绕已验证的数值与思路，按原要求只输出最终 JSON（不再带工具标记）。',
  '若计算结果与预想不符，以计算结果为准调整题面或答案。',
].join('\\n');
// 工具循环：出题/重写/审查共用。system 首条自动追加工具规约；
// 模型要工具就执行并回传，最多 maxRounds 轮；封顶后强制要求直接给最终 JSON。
async function aiToolJson(messages, opts, maxRounds) {
  if (!PY_TOOLS_ON) return aiJson(messages, opts);
  const MR = maxRounds || 8;
  const msgs = messages.map((m, i) => (i === 0 && m.role === 'system')
    ? { role: 'system', content: m.content + '\\n' + TOOL_APPENDIX } : m);
  for (let round = 1; round <= MR; round++) {
    const obj = await aiJson(msgs, opts);
    if (obj && obj.tool === 'python_exec' && typeof obj.code === 'string') {
      const res = await execPython(obj.code);
      pushLog('🧮 [云端工具] 第' + round + '轮 Python ' + (res.error ? '出错' : '完成') + '：' + String(res.output || res.error || '').slice(0, 140).replace(/\\n/g, ' '));
      msgs.push({ role: 'assistant', content: JSON.stringify(obj) });
      msgs.push({ role: 'user', content: '工具执行结果：\\n' + (res.error ? ('[错误] ' + res.error + '\\n（请修正代码再算，或换解法）') : '') + (res.output || '(无输出，请用 print)') + '\\n请像命题人一样闭环推进：核对结果是否符合命题意图——不符则调整思路再算（输出 {"tool":...}）；已验收合格则按原要求输出最终 JSON。' });
      continue;
    }
    return obj;
  }
  const finalMsgs = msgs.map((m, i) => (i === 0)
    ? { role: 'system', content: String(m.content).replace(TOOL_APPENDIX, '\\n【工具轮次已用完】不要再调用工具，立即按原要求输出最终 JSON。') } : m);
  return await aiJson(finalMsgs, opts);
}

// ---------- 取消信号（独立 cancel.json 承载） ----------
// 为什么不能把 canceled 写进 status.json：setStatus 每一轮都会 PATCH 覆盖 status.json，
// 前端写进去的 canceled 会被下一轮 running 覆盖冲掉 → 取消信号丢失。独立 cancel.json 不被覆盖。
let _cancelCache = null;
let _cancelCheckedAt = 0;   // 上次真实探测时刻（20s 节流）
class CancelError extends Error { constructor(m) { super(m); this.name = 'CancelError'; } }
/* 【2026-09-01 取消探测节流】出题池每取一题前后都查取消信号，且 cancel.json 在用户
 * 取消前根本不存在 → _cancelCache 永远是 null → 每次探测都是真实 GET（全量 gist，
 * 随 partial.json 增长越来越大）。35 题的卷子光取消探测就烧 ~100 次配额。
 * 节流到 20s 一次：取消延迟 ≤20s + 题边界，用户无感；配额省下一个数量级。
 * 已取消则永久缓存（取消不可逆）；阶段边界 cancelCheckpoint(force) 不受节流约束。
 * 【2026-09-03 再放宽到 30s】取消探测是无条件 GET 整个 gist（含已落盘的 partial.json 全集，
 * 越跑越大），是继 setStatus/flushPartial 之后的第三配额大户。放宽到 30s：取消响应延迟
 * ≤30s + 题边界（一题本就 30s~2min，用户点停止后最迟下一题边界生效），配额再省 1/3。 */
async function checkCancel(force) {
  if (_cancelCache && _cancelCache.canceled) return _cancelCache;
  if (!force && Date.now() - _cancelCheckedAt < 30000) return _cancelCache;
  _cancelCheckedAt = Date.now();
  try {
    const g = await ghRetry('GET', '/gists/' + GIST_ID);
    const f = g && g.files && g.files['cancel.json'];
    if (f && f.content) _cancelCache = JSON.parse(f.content);
  } catch (e) { /* 取消探测失败忽略，不拖垮主流程 */ }
  return _cancelCache;
}
// 阶段边界检查点：若已取消 → 抛 CancelError 退出主流程（由 catch 落 partial/取消处理）
async function cancelCheckpoint() {
  const c = await checkCancel(true);
  if (c && c.canceled) throw new CancelError((c.savePartial === false) ? 'user-cancel-no-save' : 'user-cancel-save');
}

// ---------- 并发池 ----------
// 固定并发版本（保留：非 AI 密集的场景仍可用，如组识别有本地 PDF 渲染瓶颈）
async function pool(items, conc, worker, onEachDone) {
  const results = new Array(items.length);
  let idx = 0, done = 0;
  async function runOne() {
    while (idx < items.length) {
      const ci = await checkCancel();
      if (ci && ci.canceled) break;                       // 已取消：不再取新题
      const i = idx++;
      // 【2026-09-03 竞态修复】while 检查与真正取号之间隔着 await checkCancel()——并发 worker
      // 可能同时通过检查，恢复后 idx++ 越过 items.length 拿到幽灵下标：worker 内访问
      // items[undefined] 会抛 TypeError，pool 把它记成 results[i]={__err} 多出一个「幽灵第 N+1 题」。
      // 旧版靠终检 validateQuestion 过滤掉它；但 v12 的节流时序让幽灵更易命中「本地硬校验→重写」
      // 通道——重写 mock/真实 AI 返回合法题时会把它洗成合法题混进最终卷（题量 6→7）。
      // 取号后立即边界守卫，越界直接归还（不消耗 done/不回调）。
      if (i >= items.length) break;
      try { results[i] = await worker(items[i], i); }
      catch (e) {
        if (e && e.name === 'CancelError') { results[i] = { __canceled: true }; break; }
        results[i] = { __err: (e && e.message) || String(e) }; log('worker 失败 @' + i, e.message);
      }
      done++; if (onEachDone) onEachDone(done, items.length);
      const ci2 = await checkCancel();
      if (ci2 && ci2.canceled) break;                     // 刚做完一题发现已取消：停
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(conc, items.length)) }, runOne));
  return results;
}

// 【T7 v13 智能并发池】对齐本地「快升探测版」调度器并加 429 感知——目标：尽可能压满
// 接口吞吐、把总出题时长压到最短，同时被限流时自动收敛不烧重试配额。
//  - 每完成 2 个「快而稳」样本（平均耗时 <30s）→ 并发 +1（慢速成功=API 已饱和排队，不升）
//  - 任一失败 → 立即 -1；连续 2 失败 → 再 -1 到底（快速避险）
//  - 429 限流 → 额外降 1 + 置 10s 冷却（冷却期内不升档；aiRetry 自带退避，池只负责不再添乱）
//  - 空闲 worker 等 120ms 再看新许可（动态扩容时自动被唤醒补位）
// start=起始并发，max=上限（默认 start*5 封顶 20）；签名与 pool 完全兼容，调用点可平移。
let RATE_STRIKES = 0;   // 近期 429 计数（跨池共享：出题池撞限流，重写池开局也别太猛）
let RATE_COOLDOWN_UNTIL = 0;
function is429Err(e) {
  const m = (e && e.message) || '';
  return /HTTP 429|限流|too many|rate.?limit/i.test(m);
}
async function smartPool(items, start, worker, onEachDone, opts) {
  opts = opts || {};
  const MIN = 1, MAX = Math.max(start, opts.max != null ? opts.max : Math.min(20, start * 5));
  let cur = Math.min(start, items.length || 1), idx = 0, done = 0;
  let recent = [], sinceUp = 0, failStreak = 0;
  const _t0 = Date.now();
  function observe(ms, ok, err) {
    if (ok) {
      recent.push(ms); if (recent.length > 4) recent.shift();
      failStreak = 0; sinceUp++;
      if (cur < MAX && sinceUp >= 2 && recent.length >= 2
          && Date.now() >= RATE_COOLDOWN_UNTIL
          && recent.reduce(function (a, b) { return a + b; }, 0) / recent.length < 30000) {
        cur++; sinceUp = 0; recent = [];
        log('⚡ 并发升档 →', cur);
      }
    } else {
      failStreak++; recent = []; sinceUp = 0;
      const r429 = !!err && is429Err(err);
      const before = cur;
      if (cur > MIN) cur--;
      if (failStreak >= 2) { cur = Math.max(MIN, cur - 1); failStreak = 0; }
      if (r429) {
        RATE_STRIKES++; RATE_COOLDOWN_UNTIL = Date.now() + 10000;
        if (cur > MIN) cur--;
        pushLog('🚦 接口限流 429：并发降 ' + before + '→' + cur + '，冷却 10s（已撞限流 ' + RATE_STRIKES + ' 次）', 'warn');
      } else if (cur < before) {
        pushLog('⚠️ AI 调用失败：并发降 ' + before + '→' + cur, 'warn');
      }
    }
  }
  const results_store = new Array(items.length);
  let inFlight = 0;
  async function runOne() {
    while (idx < items.length) {
      if (inFlight >= cur) { await sleep(120); continue; }   // 活跃数达当前并发：小睡等新许可（cur 升档后自动补位）
      const ci = await checkCancel();
      if (ci && ci.canceled) break;
      const i = idx++;
      if (i >= items.length) break;                     // 同 pool 的幽灵下标守卫
      const wt = Date.now();
      inFlight++;
      try {
        results_store[i] = await worker(items[i], i);
        observe(Date.now() - wt, true, null);
      } catch (e) {
        if (e && e.name === 'CancelError') { results_store[i] = { __canceled: true }; break; }
        results_store[i] = { __err: (e && e.message) || String(e) };
        observe(Date.now() - wt, false, e);
        log('worker 失败 @' + i, e.message);
      } finally { inFlight--; }
      done++; if (onEachDone) onEachDone(done, items.length);
      const ci2 = await checkCancel();
      if (ci2 && ci2.canceled) break;
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(MAX, items.length)) }, runOne));
  pushLog('⚡ 智能并发结束：峰值 ' + cur + ' 路 · 用时 ' + Math.round((Date.now() - _t0) / 1000) + 's · 完成 ' + done + '/' + items.length);
  return results_store;
}

// ---------- 提示词（与 sprint.js 本地管线同风格，独立内联） ----------
const SUBJ_NAME = { math: '数学', ctrl: '专业课', eng: '英语', pol: '政治' };

// 从蓝本派生题量（低耦合：本地/云端共用同一入口）
function bpQuestionCount(bp) { return (bp && Array.isArray(bp.types)) ? bp.types.reduce(function (a, t) { return a + (t.count || 0); }, 0) : 0; }
function bpStructureDesc(bp) {
  if (!bp || !Array.isArray(bp.types)) return '';
  return bp.types.map(function (t) { return (t.count || 0) + ' 道' + (t.label || t.type) + (t.score > 0 ? '(每 ' + t.score + ' 分)' : '(均摊)'); }).join(' + ');
}
function bpTotalScore(bp) { return Number(bp && bp.totalScore) || 150; }
function bpTimeLimit(bp) { return Number(bp && bp.timeLimit) || 180; }

// 蓝图预设（与 js/core/exam-pipeline.js 保持同步）
const DEFAULT_BP = {
  shuyi: { name: '数学一（真题卷型）', subject: 'math', totalScore: 150, timeLimit: 180, types: [{ type: 'choice', count: 10, score: 5 }, { type: 'fill', count: 6, score: 5 }, { type: 'solve', count: 6, score: 0 }], starMix: { 1: 0, 2: 15, 3: 45, 4: 30, 5: 10 } },
  ctrl: { name: '专业课（6 道综合大题）', subject: 'ctrl', totalScore: 150, timeLimit: 180, types: [{ type: 'solve', count: 6, score: 25 }], starMix: { 1: 0, 2: 0, 3: 35, 4: 45, 5: 20 } },
  yingyi: { name: '英语一（真题卷型）', subject: 'eng', totalScore: 100, timeLimit: 180, types: [{ type: 'choice', count: 20, score: 0.5 }, { type: 'choice', count: 20, score: 2 }, { type: 'solve', count: 1, score: 10 }, { type: 'essay', count: 2, score: 15 }], starMix: { 1: 0, 2: 20, 3: 50, 4: 25, 5: 5 } },
  pol: { name: '政治（真题卷型）', subject: 'pol', totalScore: 100, timeLimit: 180, types: [{ type: 'choice', count: 16, score: 1 }, { type: 'choice', count: 17, score: 2 }, { type: 'solve', count: 5, score: 10 }], starMix: { 1: 10, 2: 30, 3: 40, 4: 15, 5: 5 } },
  ying2: { name: '英语二', subject: 'eng', totalScore: 100, timeLimit: 180, types: [{ type: 'fill', count: 10, score: 1 }, { type: 'choice', count: 15, score: 2 }, { type: 'essay', count: 2, score: 15 }, { type: 'solve', count: 1, score: 0 }], starMix: { 1: 8, 2: 22, 3: 40, 4: 25, 5: 5 } }
};
const SUBJ_TO_PRESET = { math: 'shuyi', ctrl: 'ctrl', eng: 'yingyi', pol: 'pol' };

// 【2026-09-03 链路加固】从蓝图反推每道题的 score —— 不再相信出题 AI 自报 score。
// 出题 schema 里没有 score 字段，AI 会自由发挥（常全 5）；必须由 blueprint.types[].score 决定性覆盖。
// 旧版兜底 "|| 5" 是分值失真总根源（22 题 × 5 = 110 ≠ bp.totalScore 150，趋势图分母/成绩单档位全错）。
function scoreForType(bp, qtype) {
  var types = (bp && bp.types) || [];
  var t = types.find(function (x) { return x && x.type === qtype; });
  if (!t) return 5;   // 蓝图未规定（如 essay 0 分）→ 兜底 5
  return Number(t.score) || 0;
}
// 把"每题 score 应分"转成自然语言描述注入 plannerSystem，让 AI 在规划阶段就把 score 写齐（方便审查对照）。
function scoreSpecText(bp) {
  var types = (bp && bp.types) || [];
  return types.map(function (t) { return (t.score || 0) + '分/' + (t.type || '?') + '×' + t.count + '道'; }).join('，');
}
// 把"bp.starMix 比例"转成"目标数量"：例如 {1:0,2:15,3:45,4:30,5:10} + 22 题 → ★2×3 / ★3×10 / ★4×7 / ★5×2
// 出题完成后若分布明显偏离（±2 道以上）做一次 forceStarMix 再平衡，star 字段不再是 AI 自由发挥。
function starMixTargets(bp, n) {
  var mix = (bp && bp.starMix) || {};
  var targets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  var assigned = 0;
  [1, 2, 3, 4, 5].forEach(function (s) {
    var c = Math.round((mix[s] || 0) / 100 * n);
    targets[s] = c; assigned += c;
  });
  // 舍入误差：把差值贴到占比最大的档
  var diff = n - assigned;
  if (diff !== 0) {
    var topS = [3, 4, 2, 5, 1].sort(function (a, b) { return (mix[b] || 0) - (mix[a] || 0); })[0];
    targets[topS] = Math.max(0, targets[topS] + diff);
  }
  return targets;
}
// 根据目标分布，把当前 questions 数组按 star 重新平衡：只在分布差异 ≥2 道时才动手（避免无谓改写）。
function forceStarMix(questions, bp) {
  var n = questions.length;
  if (!n) return { changed: 0, distribution: {} };
  var targets = starMixTargets(bp, n);
  // 统计当前各 star 的题数
  var counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  questions.forEach(function (q) {
    var s = clampStar(q.star);
    counts[s] = (counts[s] || 0) + 1;
  });
  var changed = 0;
  // 多于目标的 star → 把多出来的题的 star 降到目标数最少的 star（保持题内容不变）
  [5, 4, 3, 2, 1].forEach(function (s) {
    var over = counts[s] - (targets[s] || 0);
    if (over <= 0) return;
    var deficitStars = [];
    [1, 2, 3, 4, 5].forEach(function (t) { if ((counts[t] || 0) < (targets[t] || 0)) deficitStars.push(t); });
    if (!deficitStars.length) return;
    var moved = 0;
    for (var i = 0; i < questions.length && moved < over; i++) {
      var q = questions[i];
      if (clampStar(q.star) !== s) continue;
      //  选当前缺口最大的目标 star
      var pickT = deficitStars.sort(function (a, b) { return (targets[b] - counts[b]) - (targets[a] - counts[a]); })[0];
      q.star = pickT;
      counts[s]--; counts[pickT] = (counts[pickT] || 0) + 1;
      changed++; moved++;
    }
  });
  return { changed: changed, distribution: counts, targets: targets };
}
function clampStar(v) {
  var n = Math.floor(Number(v));
  if (n >= 1 && n <= 5) return n;
  return 3;   // AI 不给或乱给 → 兜底 ★3（中档），避免渲染 ★?
}
// chiefSystem 的 targetHardPct 不再硬编码 40，按 bp.starMix 实际 ★4+★5 占比算
function targetHardPct(bp) {
  var mix = (bp && bp.starMix) || {};
  return Math.round(((mix[4] || 0) + (mix[5] || 0)));
}

// 题量档缩放（与本地 sprint.js 的 volumeBp 同规则，保证云/地两端题量口径一致）：
// lite：选择/填空减半、解答/写作保留，限时 ×0.7；full：全题型 ×1.5，限时 ×1.25。纯函数、不原地改蓝图。
function scaleBp(bp, cnt) {
  var out = JSON.parse(JSON.stringify(bp || {}));
  if (cnt === 'lite' || cnt === 'full') {
    var isLite = cnt === 'lite';
    out.types = (out.types || []).map(function (t) {
      var fac = isLite ? ((t.type === 'solve' || t.type === 'essay') ? 1 : 0.5) : 1.5;
      return Object.assign({}, t, { count: Math.max(1, Math.round((t.count || 1) * fac)) });
    });
    out.timeLimit = Math.round((out.timeLimit || 180) * (isLite ? 0.7 : 1.25));
  }
  return out;
}

// 从 prefs 解析「已生效的蓝本」：优先 prefs.blueprint（本地存的永远是 std 基准）+ count 缩放；
// 未传则回退科目预设并按 count 缩放（兼容旧任务）。题量据此真正生效，不再用 8/12/15 猜测。
function resolveBpFromPrefs(subj, prefs) {
  if (prefs && prefs.blueprint && prefs.blueprint.types && Array.isArray(prefs.blueprint.types)) {
    return scaleBp(prefs.blueprint, prefs && prefs.count);
  }
  var key = SUBJ_TO_PRESET[subj] || 'shuyi';
  var def = DEFAULT_BP[key] || DEFAULT_BP.shuyi;
  return scaleBp(def, prefs && prefs.count);
}

function plannerSystem(subj, prefs, styleNote) {
  const bp = resolveBpFromPrefs(subj, prefs);
  const diffNote = prefs.diff === 'superhard'
    ? '难度硬约束：全部为压轴难题（★4~★5），禁止基础题。'
    : prefs.diff === 'hard'
      ? '难度约束：约 70% 压轴难题（★4~★5），30% 中档（★3）。'
      : '难度约束：约 60% 中档综合题（★3），40% 压轴题（★4~★5）。';
  const n = bpQuestionCount(bp);
  const structure = bpStructureDesc(bp);
  const totalScore = bpTotalScore(bp);
  const timeLimit = bpTimeLimit(bp);
  // 【2026-09-03】把 starMix 配比 + score 分值硬约束 + avoidHint 注入 prompt——出题 AI 不再自由发挥。
  const starMixSpec = Object.keys((bp && bp.starMix) || {})
    .filter(function (s) { return (bp.starMix[s] || 0) > 0; })
    .map(function (s) { return '★' + s + ' ' + bp.starMix[s] + '%'; })
    .join('，');
  const scoreSpec = scoreSpecText(bp);
  const historyTopics = Array.isArray(prefs.historyTopics) ? prefs.historyTopics : [];
  const avoidHint = historyTopics.length
    ? '\\n【避重·硬约束】以下考点与角度在最近卷已考过：' + historyTopics.slice(0, 30).map(function (t) { return String(t).slice(0, 50); }).join(' / ')
      + '——**严禁原样复刻**（可考同模块的不同考点，或换设问角度）。'
    : '';
  // 【v13 子母卷】styleNote：母卷命题形式研究报告（derive 模式）。注入后总工按母卷风格规划子卷，
  //   而非自由押题。非 derive 模式此参数为空，行为与旧版完全一致（零回归）。
  const styleBlock = styleNote
    ? '\\n【子卷·仿母卷命题形式】本卷是某母卷的子卷，须严格模仿下列命题形式研究报告的'
      + '题型结构/考点分布逻辑/难度配比/设问风格出题（出新题、换数据换情境，绝不复刻母卷原题）：\\n'
      + styleNote + '\\n'
    : '';
  return '你是考研' + subjName(subj) + '命题总工程师。请按给定蓝本规划一份押题卷。'
    + '\\n【蓝本】' + (bp.name || '押题卷') + '：' + structure + '，共 ' + n + ' 题，总分 ' + totalScore + '，限时 ' + timeLimit + ' 分钟。'
    + '\\n【难度配比硬约束】' + starMixSpec + '——每题 star 严格按此分布（★1-2 基础 / ★3 中档 / ★4-5 压轴）。'
    + '\\n【分值硬分配】每题 score = ' + scoreSpec + '；规划阶段把每题 score 直接写入（与蓝本严格一致）。'
    + '\\n【难度】' + diffNote
    + styleBlock
    + avoidHint
    + '\\n要求：①覆盖不同考点，突出今年高频与考生薄弱方向 ②题型分布严格符合蓝本结构 ③每题给出方向描述供出题 AI 执行。\\n'
    + '只输出 JSON：{"title":"卷名","timeLimit":' + timeLimit + ',"questions":[{"topicName":"考点","type":"choice|fill|solve|essay","direction":"命题方向一句话","star":1-5,"score":按分值硬分配}]}';
}
// 【v13 子母卷】母卷命题形式研究员：读母卷指纹（结构 + 每题选题摘要），产出一份
//   「命题形式研究报告」文本，注入 plannerSystem 指导子卷规划。与「出题」解耦——
//   研究员只做归纳（零编造：只依据指纹里给的结构与摘要，不臆测母卷没有的东西）。
function deriveStyleSystem(subj, prefs) {
  return '你是考研' + subjName(subj) + '命题形式研究员。给你一张母卷的结构化指纹（题型分布、分值、难度★配比、'
    + '每题考点与题干摘要）。任务：归纳这张卷子的【命题形式特征】，供后续据此仿出一张同形式的子卷。'
    + '【铁律】①只做归纳，严禁编造指纹里没有的题号/考点；②聚焦"形式"而非"具体题目内容"——'
    + '要提炼出可迁移到一套全新题目的规律（如：选择题前 6 题考基础概念辨析、后 4 题考综合应用；'
    + '大题按章节轮动、每题设置多问递进；计算量分布、陷阱类型偏好等）。'
    + '只输出一段纯文本研究报告（≤500 字，分点陈述，不要 JSON、不要标题寒暄）：'
    + '1) 题型与分值结构规律 2) 考点分布逻辑（哪些模块占多少、如何轮动）3) 难度梯度与★配比规律 '
    + '4) 设问风格（直接求值/证明/辨析/应用情境的占比与套路）5) 仿制子卷时最该复刻的 3 个形式特征。';
}
function questionSystem(subj) {
  return '你是考研' + subjName(subj) + '命题专家。按给定蓝图出一道题：题目创新但解法严格在考纲内；题干严谨无歧义；选择题给 4 个选项（A. B. C. D. 开头）；答案必须正确——输出前自己把解答完整走一遍（能算的数值都算实），确保答案与解析逐步一致。\\n'
    + '【解析完整性·硬要求】solution 必须"分步推导→结论→易错点"三段式完整；solve/essay 题解析 ≥60 字、choice 题 ≥25 字、fill 题 ≥20 字；禁止只写最终答案或一句话带过。\\n'
    + '【字段必填】star（1-5 整数，按蓝图分配，不要自由发挥）+ diff（easy|medium|hard，按 star 派生：★1-2→easy，★3→medium，★4-5→hard）。\\n'
    + '只输出 JSON：{"stem":"题干(LaTeX用$...$)","type":"choice|fill|solve|essay","options":["A. ..","B. ..","C. ..","D. .."]或省略,"answer":"正确答案","solution":"详细解析","trap":"常见陷阱一句话","diff":"easy|medium|hard","star":1-5}';
}
function chiefSystem(subj, bp) {
  // 【2026-09-03】接收 bp → targetHardPct 从硬编码 40 改为按 bp.starMix 实际 ★4+★5 占比算（数学一 40 / 专业课 65 / 政治 20 / 英语一 30 / 英语二 30）；
  // 同时要求审查时核对题分是否对齐蓝图。
  var tHP = targetHardPct(bp);
  var scoreSpec = scoreSpecText(bp);
  return '你是考研' + subjName(subj) + '押题卷总审查工程师。逐题检查：'
    + '①解析是否完整（是否分步推导+结论+易错点、是否满足 solve/essay≥60字·choice≥25字·fill≥20字的下限——看的是**完整解析**，不是片段）'
    + '②答案是否正确（工具开启时优先用 python_exec 真实验算关键步骤，不要心算）'
    + '③题干是否严谨无歧义 ④选项是否有双对/无解 ⑤难度星级 star 是否虚标（★1-2 基础 / ★3 中档 / ★4-5 压轴）'
    + '⑥【新增】题目方向 direction 是否与考点 topicName 一致 ⑦【新增】题分 score 是否与蓝图分值硬分配一致（蓝图：' + scoreSpec + '）。\\n'
    + 'verdict 判定：全过关 ok；≤2 题小问题 minor；更多或整卷性问题 major。'
    + 'targetHardPct（按蓝本 ★4+★5 占比）：' + tHP + '。\\n'
    + '只输出 JSON：{"verdict":"ok|minor|major","targetHardPct":' + tHP + ',"hardPct":实际hard百分比,"summary":"总评一句话","needsRewrite":[{"index":题号从1开始（必须在 1..' + (bpQuestionCount(bp)) + ' 范围内）, "reason":"问题","fixHint":"修改指引"}]}';
}

// ---------- 本地蓝本硬校验（纯代码，零幻觉防线） ----------
function validateQuestion(q) {
  if (!q || typeof q !== 'object') return '不是对象';
  if (!q.stem || typeof q.stem !== 'string' || q.stem.length < 8) return '题干缺失或过短';
  if (q.answer == null || q.answer === '') return '缺 answer';
  if (q.type === 'choice') {
    if (!Array.isArray(q.options) || q.options.length !== 4) return '选择题须 4 个选项';
    const letters = q.options.map(o => String(o).trim().charAt(0).toUpperCase());
    if (letters.join('') !== 'ABCD') return '选项前缀须 A/B/C/D（实为 ' + letters.join('') + '）';
    const ans = String(q.answer).trim().charAt(0).toUpperCase();
    if (letters.indexOf(ans) < 0) return 'answer 不在选项中';
    // 双对粗检：answer 出现在 ≥2 个选项正文里
    const ansBody = String(q.answer).trim().slice(1).trim();
    if (ansBody.length > 6 && q.options.filter(o => String(o).indexOf(ansBody) >= 0).length > 1) return '疑似多个选项含相同答案内容';
  }
  if (!q.solution || String(q.solution).length < 1) return '解析缺失';
  // 【2026-08-27 解析完整性分级】解析"一句话带过"是"每题返工"的元凶之一：AI 主观看一眼判不完整。
  // 纯代码按题型设最低词数下限，缺步骤/缺结论的残次解析在校验层就被拦住，不再全压给总工程师主观拍板。
  var solLen = String(q.solution).replace(/\\s+/g, '').length;
  var minLen = q.type === 'solve' || q.type === 'essay' ? 60 : q.type === 'choice' ? 25 : 20;
  if (solLen < minLen) return '解析不完整（' + solLen + ' 字 < ' + minLen + ' 字下限，需分步推导+结论+易错点）';
  return '';
}
// LaTeX 花括号平衡粗检（防 AI 漏花括号导致渲染崩坏）
function braceBalanced(s) {
  let n = 0;
  s = String(s || '');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '\\\\') { i++; continue; }
    if (ch === '{') n++;
    else if (ch === '}') n--;
  }
  return n === 0;
}

// ---------- 终止信号处理（2026-09-01「进度静止一小时不动」的另一半元凶） ----------
// Actions 超时（timeout-minutes）或手动取消工作流时，runner 进程收到 SIGTERM 直接被杀，
// status.json 永远停在最后一次成功回写——本地侧无限轮询一个死任务，表现为
// 「进度/日志冻结，一小时回来还是静止」。终止前尽力写一条 error 终态（带原因 +
// 可抢救题数），让本地立刻知道任务已死、该去抢救 partial.json，而不是干等。
let _sigHandled = false;
async function handleTermination(sig) {
  if (_sigHandled) return;
  _sigHandled = true;
  log('!! 收到 ' + sig + '：执行器将被终止（Actions 超时或手动取消），尽力回写终态…');
  dropPendingStatus();   // 丢弃节流攒着的待发 running，避免 8s 后迟到 PATCH 覆盖下面的 error 终态
  // 被杀的宽限期只有几秒：直写不走 ghRetry（限额长退避会白等几分钟，等来 SIGKILL）
  const payload = { files: {
    'status.json': { content: JSON.stringify({ status: 'error', stage: '', msg: '⚠ 执行器被强制终止（' + sig + '：Actions 超时或手动取消）· 已出 ' + _partialCount + ' 题已落盘 partial.json，可点「🆘 抢救已出题目」收卷', progress: null, log: RUN_LOG, qs: QS, savedCount: _partialCount, updatedAt: new Date().toISOString(), runnerVer: RUNNER_VER }) }
  } };
  for (let i = 0; i < 2; i++) {
    try { await ghReq('PATCH', '/gists/' + GIST_ID, payload); log('✅ 终态已回写'); break; }
    catch (e) { log('!! 终态回写失败（第 ' + (i + 1) + ' 次）：', e.message); await sleep(1500); }
  }
  process.exit(1);
}
process.on('SIGTERM', () => handleTermination('SIGTERM'));
process.on('SIGINT', () => handleTermination('SIGINT'));

// ---------- 主流程 ----------
// ==================== 📥 PDF 试卷导入（v10，2026-09-02 新增通道） ====================
/* 与「出卷通道」平行的第二条云端流水线：客户端把用户试卷（PDF/图片）base64 塞进
 * 任务 Gist（source.pdf.b64 或 source.pdf），云端用 Actions runner 自带的 poppler 工具链解析：
 *   pdfinfo 页数 → 逐页 pdftotext 判断文字层密度
 *   → 文字页按连续页分组喂文本模型；扫描页 pdftoppm 转 PNG 喂视觉模型
 *   → 逐题结构校验 + 跨组去重 → 每组识别完即 flushPartial 落盘（中途失败可抢救）
 *   → result.json（builtBy:'pdf-import'，结构与 mockExams 条目一致）
 * 零幻觉铁律：识别不出的题只标记（lowConfidence/noAnswer）绝不编造；
 * 客户端收卷后走「预览确认」人工修订，未经人工过目的导入不当成品用。 */
const IMG_MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' };
function extOf(name) { const m = String(name || '').toLowerCase().match(/\\.(\\w+)$/); return m ? m[1] : ''; }

// 【v14 乱码文字层判定】有些 PDF 用无 ToUnicode 映射的子集字体（CID 编码）：本地阅读器
// 按内嵌字形直接画「看起来正常」，但 pdftotext 提取出来是「狶狶狶」碎片乱码。
// 旧防御只看字符数 ≥240，乱码页照样放行文本通道 → AI 收到噪声直接拒答（"输出中没有 JSON"）。
// 三重启发式（任一命中即乱码）：
//   ① 非常用字符占比 >0.45（CJK 扩展区/兼容区生僻字——注意 CID 乱码也常用 U+4E00 区的生僻字，
//      所以光靠①不够，见②③）
//   ② 长度 ≥3 的连续同字符覆盖 >50%（「狶狶狶狶犥犥犥」式碎片重复）
//   ③ 单一字符占比 >25%（真中文页 top 字频一般 <8%；乱码/点线页 top 字频暴增）
// 常用字符白名单：CJK 基本区 U+4E00-9FA5 + 假名 + ASCII + CJK 标点 + 全角（一律用 \\u 转义写，
// 防止字面汉字区间被工具链编码破坏——曾发生「一-龥」变成「㐀-䶿」致全部正常中文误判乱码）
const COMMON_CJK_RE = /[\\u4e00-\\u9fa5\\u3040-\\u30ffA-Za-z0-9\\u3000-\\u303f\\uff00-\\uffef]/;
function garbledRatio(txt) {
  // Array.from 按码点拆分：代理对（CJK 扩展区 𠀋/𪚥 等）算 1 字符——若用 s.length（UTF-16 计数）
  // 会让这类字符的分母翻倍、rare 占比被稀释一半，导致扩展区乱码漏判。
  const arr = Array.from(String(txt || '').replace(/\\s+/g, ''));
  const n = arr.length;
  if (n < 30) return 0;
  let rare = 0, topCnt = 0;
  const cnt = {};
  let runCover = 0, prev = '', run = 0;
  // run≥4 的连续同字符计入「重复覆盖」：正常中文/英文几乎不会出现 4 连同字；
  // CID 乱码（狶狶狶狶）与填空点线（＿＿＿＿）都会命中——前者是噪声该转视觉，
  // 后者视觉同样能读，转过去无害。阈值取 4 而非 3，避开「看看」「谢谢」类自然叠字。
  const flushRun = () => { if (run >= 4) runCover += run; };
  for (const ch of arr) {
    if (COMMON_CJK_RE.test(ch) === false) rare++;
    cnt[ch] = (cnt[ch] || 0) + 1;
    if (cnt[ch] > topCnt) topCnt = cnt[ch];
    if (ch === prev) run++; else { flushRun(); prev = ch; run = 1; }
  }
  flushRun();
  return Math.max(rare / n, runCover / n, topCnt / n * 0.9);
}
// 一页文字层 → 该页转视觉；阈值 0.45：真页（中英混排/公式）rare<0.3、cover≈0、top 字频贡献 <0.12
// 均远低于阈值；CID 乱码页（生僻字主导 + 高重复）ratio 通常 >0.6。漏网的由第二层防御兜底。
function pageIsGarbled(txt) { return garbledRatio(txt) > 0.45; }
function importTextSystem(subj) {
  return '你是考研' + subjName(subj) + '试卷数字化工程师。用户给你一份试卷其中几页的文字层提取（pdftotext 输出，'
    + '可能含页眉页脚、双栏错序、公式残缺、题目跨页）。任务：把每一道题完整还原成结构化 JSON。'
    + '【铁律】①只做搬运与整理，严禁增删改题意、严禁编造卷面上没有的答案或解析——卷面没给答案就输出 answer:"" 并置 noAnswer:true。'
    + '②题目跨页出现时合并为一题（sourcePages 给全部页码）。③公式保留为 LaTeX（$...$），文字层里错乱的上下标/根号按你能确定的最小修改还原；'
    + '拿不准是否还原正确就把 confidence 调低（0-1 小数），不要猜。④题号 no 用卷面原题号（数字），分卷/无题号按出现顺序编号。'
    + '⑤页眉页脚、答题卡填涂说明、注意事项等非试题文字一律丢弃。'
    + '只输出 JSON：{"questions":[{"no":1,"stem":"题干","type":"choice|fill|solve|essay","options":["A. ..","B. ..","C. ..","D. .."],"answer":"卷面答案","solution":"卷面解析（没有则空串）","noAnswer":false,"topicName":"考点","score":数字或null,"sourcePages":[1],"confidence":0.95}]}';
}
function importVisionSystem(subj) {
  return '你是考研' + subjName(subj) + '试卷数字化工程师。用户给你试卷整页的高清图片（扫描版/拍照版）。'
    + '任务：逐题识别图片中的试题，还原成结构化 JSON。'
    + '【铁律】①忠实转录：识别什么输出什么，严禁补全图片里没有的题干、答案或解析；看不清的字用 □ 占位并调低 confidence。'
    + '②卷面没印答案就 answer:"" + noAnswer:true，严禁用你的知识"顺手解出来"冒充卷面答案。'
    + '③数学公式必须用 LaTeX（$...$）准确还原（分式/根号/上下标/积分号）。④题号 no 用卷面原题号。'
    + '⑤一道题跨页时在两页都识别完整部分，sourcePages 标该页即可（合并由系统处理）。'
    + '只输出 JSON：{"questions":[{"no":1,"stem":"题干","type":"choice|fill|solve|essay","options":["A. ..","B. ..","C. ..","D. .."],"answer":"卷面答案","solution":"卷面解析（没有则空串）","noAnswer":false,"topicName":"考点","score":数字或null,"sourcePages":[1],"confidence":0.95}]}';
}
// 【v13 答案解析补全】解答器：给卷面缺答案/解析的题补「AI 参考答案」。
//   与转录通道解耦——转录铁律「严禁顺手解题」保持不变，补全是独立显式步骤（用户勾选才会跑）。
//   开思考模式（opts.think=true）提高解题正确率；输出仍走 JSON 便于机器回填。
function importFillSystem(subj) {
  return '你是考研' + subjName(subj) + '命题解析专家。用户给你一道试卷原题（卷面没有答案或解析）。'
    + '任务：把这道题完整解出来，给出参考答案与分步解析。'
    + '【铁律】①输出前先自己把解答完整走一遍，能算的数值必须算实，确保答案与解析逐步一致；'
    + '②解析按「思路→分步推导→结论」组织，solve/essay ≥60 字、choice/fill ≥25 字；'
    + '③若题目信息不全（缺条件/题干有 □ 占位导致无法唯一求解），不要硬编——'
    + 'answer 与 solution 各写「无法求解：<原因>」并在 unsure 里说明缺什么。'
    + '只输出 JSON：{"answer":"参考答案（choice 给字母）","solution":"分步解析","unsure":"无法求解的原因或不确定点，确定则空串"}';
}
// 导入题结构校验（与出卷题的 validateQuestion 不同：忠实搬运优先，残次不判死只标记）
function validateImported(q) {
  if (!q || typeof q !== 'object' || !q.stem || String(q.stem).trim().length < 6) return '题干缺失';
  const t = ['choice', 'fill', 'solve', 'essay'].indexOf(String(q.type)) >= 0 ? String(q.type) : ((Array.isArray(q.options) && q.options.length === 4) ? 'choice' : 'solve');
  if (t === 'choice' && (!Array.isArray(q.options) || q.options.length < 2)) return '选择题缺选项';
  if (t === 'choice' && Array.isArray(q.options) && q.options.length === 4 && q.answer) {
    const letters = q.options.map(o => String(o || '').trim().charAt(0).toUpperCase());
    if (letters.indexOf(String(q.answer).trim().charAt(0).toUpperCase()) < 0) return '答案不在选项中';
  }
  return '';
}
function normalizeImported(q, g) {
  let type = ['choice', 'fill', 'solve', 'essay'].indexOf(String(q.type)) >= 0 ? String(q.type) : ((Array.isArray(q.options) && q.options.length === 4) ? 'choice' : 'solve');
  let options = Array.isArray(q.options) ? q.options.filter(o => o != null && String(o).trim() !== '').map(o => String(o)) : [];
  let stem = String(q.stem || '').trim();
  let low = false;
  const conf = typeof q.confidence === 'number' ? q.confidence : null;
  if (conf != null && conf < 0.7) low = true;
  // 选择题结构不完整：把选项并入题干（忠实保留信息），降级 solve——判分管线对坏 choice 会直接报错
  if (type === 'choice' && (options.length !== 4 || !options.length)) {
    if (options.length >= 2) stem += '\\n' + options.join('\\n');
    options = []; type = 'solve'; low = true;
  }
  let answer = q.answer == null ? '' : String(q.answer).trim();
  const noAnswer = !!q.noAnswer || answer === '';
  if (noAnswer) low = true;
  // choice 答案不在选项内（validateImported 拦下）→ 同样标低置信，交人工裁决
  if (validateImported(q)) low = true;
  let pages = Array.isArray(q.sourcePages) && q.sourcePages.length ? q.sourcePages.map(Number).filter(n => n > 0) : (g.pages || []);
  return {
    no: Number(q.no) || null,
    stem: stem, type: type, options: options.length === 4 ? options : undefined,
    answer: answer, solution: q.solution == null ? '' : String(q.solution).trim(),
    noAnswer: noAnswer, topicName: q.topicName == null ? '' : String(q.topicName).trim(),
    score: typeof q.score === 'number' && q.score > 0 ? q.score : null,
    sourcePages: pages, confidence: conf, lowConfidence: low,
    fromImport: true, importKind: g.kind, importNote: validateImported(q) || ''
  };
}
async function runImport(gist, job, prefs) {
  const subj = prefs.subject && prefs.subject !== 'auto' ? prefs.subject : (prefs.importSubject || 'math');
  // ---------- ① 拉源文件 ----------
  await setStatus('running', 'parsing', '📥 拉取试卷源文件…', 2);
  // 【v11 资源 Gist 拆文件】优先从独立资源 Gist 读源文件（任务 Gist 永远只几 KB，
  // 不再与几 MB 的 PDF 同 Gist 触发 GitHub API 截断边界）。回退到任务 Gist 内源文件（兼容老路径）。
  const gFiles = gist.files || {};
  let buf = null;
  let sourceOrigin = '';
  try {
    if (SOURCE_GIST_ID) {
      const assetGist = await ghRetry('GET', '/gists/' + SOURCE_GIST_ID);
      const aFiles = (assetGist && assetGist.files) || {};
      buf = await readSourceBuffer(aFiles, '资源 Gist');
      sourceOrigin = 'resource gist ' + SOURCE_GIST_ID;
      pushLog('📂 源文件来自资源 Gist（' + Math.round(buf.length / 1024) + 'KB，gist=' + SOURCE_GIST_ID.slice(0, 8) + '…）');
    }
  } catch (e) { pushLog('⚠️ 资源 Gist 读取失败，回退任务 Gist：' + String(e.message || e).slice(0, 120), 'warn'); }
  if (!buf) {
    try {
      buf = await readSourceBuffer(gFiles, '任务 Gist');
      sourceOrigin = 'task gist';
    } catch (e) { throw new Error('源文件读取失败：' + ((e && e.message) || e)); }
  }
  if (!buf || buf.length < 100) throw new Error('源文件读取为空（来源：' + sourceOrigin + '）——请确认提交时已上传试卷文件，或删除任务重试');
  const isImg = prefs.importKind === 'image';
  pushLog('📄 源文件 ' + Math.round(buf.length / 1024) + ' KB · 类型 ' + (isImg ? '图片' : 'PDF') + ' · ' + (prefs.fileName || '(未命名)') + ' · 来源 ' + sourceOrigin);
  // 【2026-09-05 v13 修复：非标准 PDF 头】部分扫描件/下载器产物在 %PDF 魔数前混入 BOM 或
  // 垃圾字节（如 \\r\\n、HTML 残片），旧版要求 %PDF 严格在 offset 0 → 整单报「不是合法 PDF」。
  // 现在在前 4KB 内搜索魔数，找到即裁掉头部杂质继续解析；找不到才判非 PDF。
  if (!isImg) {
    const isMagic = (o) => buf[o] === 0x25 && buf[o + 1] === 0x50 && buf[o + 2] === 0x44 && buf[o + 3] === 0x46;
    if (!isMagic(0)) {
      let found = -1;
      const scanMax = Math.min(buf.length - 4, 4096);
      for (let i = 1; i <= scanMax; i++) { if (isMagic(i)) { found = i; break; } }
      if (found > 0) {
        pushLog('🔧 非标准 PDF 头：%PDF 位于偏移 ' + found + '（前有 ' + found + ' 字节杂质/BOM），自动裁头后继续解析');
        buf = buf.subarray(found);
      } else {
        throw new Error('源文件不是合法 PDF（前 4KB 内未找到 %PDF 头）——若是图片请改用图片导入；'
          + '若文件确实是 PDF 且是 v13 前提交的任务，属旧版上传通道把字节写坏（latin1 损坏），请删除该任务后用最新页面重新提交');
      }
    }
  }
  const wd = pathT.join(osT.tmpdir(), 'cjimp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7));
  fsT.mkdirSync(wd, { recursive: true });
  try {
    // ---------- ② 分组（文字组 / 视觉组） ----------
    const groups = [];
    if (isImg) {
      const mime = IMG_MIME[extOf(prefs.fileName)] || 'image/png';
      if (buf.length > 2.6 * 1024 * 1024) throw new Error('图片过大（' + Math.round(buf.length / 1048576) + ' MB > 2.6 MB 接口上限），请在手机端压缩后重试');
      groups.push({ kind: 'img', imgs: ['data:' + mime + ';base64,' + buf.toString('base64')], pages: [1] });
    } else {
      const pdfPath = pathT.join(wd, 'src.pdf');
      fsT.writeFileSync(pdfPath, buf);
      await ensurePoppler();   // 【v11】poppler 可能没预装 → 探测 + 缺失时自动 apt 安装
      const vi = await runShell('pdfinfo ' + JSON.stringify(pdfPath), 30000);
      if (!vi.ok) {
        // 错误信息纠偏：工具缺失 ≠ 文件损坏。旧版把 not found 也报成「文件损坏/加密」，
        // 用户会一直去换 PDF，而真正要做的是升级 workflow（或等 runner 自救失败后的明确指引）。
        if (/not found|No such file|command not found/i.test(String(vi.err))) {
          throw new Error('执行器环境缺少 poppler-utils（pdfinfo/pdftotext/pdftoppm 都不可用，自动安装也失败）——请到「🛠 配置向导」点一次「🚀 一键安装」升级 workflow（新版 workflow 自带安装步骤）');
        }
        throw new Error('PDF 解析失败（文件损坏或加密受保护）：' + String(vi.err).slice(0, 200));
      }
      const pm = vi.out.match(/^Pages:\\s+(\\d+)/m);
      const pages = pm ? parseInt(pm[1], 10) : 0;
      if (!pages) throw new Error('PDF 页数为 0');
      if (pages > 40) throw new Error('共 ' + pages + ' 页，超过单次导入上限 40 页（建议拆分后分批导入）');
      pushLog('🧾 pdfinfo：' + pages + ' 页，逐页提取文字层…');
      const pgTxt = {};
      for (let p = 1; p <= pages; p++) {
        await checkCancel();   // 每页边界：拉取用户取消信号
        const r = await runShell('pdftotext -f ' + p + ' -l ' + p + ' -layout ' + JSON.stringify(pdfPath) + ' -', 30000);
        pgTxt[p] = r.ok ? r.out : '';
        if (p === 1 || p === pages || p % 5 === 0) await setStatus('running', 'parsing', '🧾 逐页提取文字层 ' + p + '/' + pages + '…', 2 + Math.round(p / pages * 10));
      }
      // 文字密度阈值：pdftotext 压掉空白后 <240 字符判为「扫描页/公式页」，转图走视觉
      // 【v14 乱码防御】字符数够但乱码率高的页（CID 无 ToUnicode 字体）同样转视觉——
      //   否则喂文本模型只会得到「AI 已拒绝输出 JSON」。
      const TEXT_MIN = 240;
      let tGroup = [];
      const flushT = () => {
        if (!tGroup.length) return;
        const gp = tGroup.map(g => g.p);
        groups.push({
          kind: 'text', text: tGroup.map(g => g.txt).join('\\n\\n'), pages: gp,
          // 【v14 第二层防御】文本通道被 AI 拒答时的视觉重试闭包（renderPageImgs 声明提升，调用时才用）
          visionRetry: async function () {
            const out = [];
            for (let i = 0; i < gp.length; i += 2) {
              const chunk = gp.slice(i, i + 2);
              const pngs = await renderPageImgs(chunk);
              if (pngs.length) out.push({ imgs: pngs, pages: chunk });
            }
            return out;
          }
        });
        tGroup = [];
      };
      const imgPages = [];
      let garbledN = 0;
      for (let p = 1; p <= pages; p++) {
        const flat = String(pgTxt[p] || '').replace(/\\s+/g, '').trim();
        const garbled = flat.length >= TEXT_MIN && pageIsGarbled(pgTxt[p]);
        if (garbled) garbledN++;
        if (flat.length >= TEXT_MIN && !garbled) tGroup.push({ p: p, txt: pgTxt[p] });
        else { flushT(); imgPages.push(p); }
      }
      flushT();
      if (garbledN) pushLog('⚠️ 检测到 ' + garbledN + ' 页文字层为乱码（PDF 用无 ToUnicode 的子集字体），已转视觉识别');
      if (imgPages.length) pushLog('👁 转视觉的页：' + imgPages.join(',') + '（文字层不足 ' + TEXT_MIN + ' 字符或乱码，转 150dpi 图片）');
      // 【v14】单页渲染 helper：分组转图与「文本组被拒后转视觉重试」共用（150dpi 与 2.6MB 上限口径一致）
      async function renderPageImgs(pList) {
        const out = [];
        for (const p of pList) {
          const base = pathT.join(wd, 'pg' + p);
          const r = await runShell('pdftoppm -f ' + p + ' -l ' + p + ' -png -r 150 ' + JSON.stringify(pdfPath) + ' ' + JSON.stringify(base), 90000);
          if (!r.ok) { pushLog('⚠️ 第 ' + p + ' 页转图失败：' + String(r.err).slice(0, 120), 'warn'); continue; }
          for (const f of fsT.readdirSync(wd).filter(x => x.indexOf('pg' + p) === 0 && /\\.png$/.test(x))) {
            const data = fsT.readFileSync(pathT.join(wd, f));
            if (data.length > 2.6 * 1024 * 1024) { pushLog('⚠️ 第 ' + p + ' 页图 ' + Math.round(data.length / 1048576) + 'MB 过大，跳过', 'warn'); continue; }
            out.push('data:image/png;base64,' + data.toString('base64'));
          }
        }
        return out;
      }
      for (let i = 0; i < imgPages.length; i += 2) {
        const chunk = imgPages.slice(i, i + 2);
        const pngs = await renderPageImgs(chunk);
        if (pngs.length) groups.push({ kind: 'img', imgs: pngs, pages: chunk });
      }
    }
    if (!groups.length) throw new Error('没有可识别的页面（文字层与转图均失败）');
    pushLog('🗂 识别分组：' + groups.map(g => g.kind + '(' + g.pages.join('+') + ')').join(' · '));
    await setStatus('running', 'parsing', '🗂 ' + groups.length + ' 组页面就绪（文字 ' + groups.filter(g => g.kind === 'text').length + ' · 视觉 ' + groups.filter(g => g.kind === 'img').length + '）', 13);
    // ---------- ③ 逐组识别（并发 3，组内按页保序） ----------
    const all = [];
    const failedGroups = [];
    // 识别一个组（text/img 两种形态共用）：返回题数；AI 失败抛错由调用方处理
    async function extractGroup(g) {
      await cancelCheckpoint();
      const userTxt = g.kind === 'text'
        ? '【第 ' + g.pages.join('、') + ' 页 · 文字层提取】\\n' + String(g.text).slice(0, 24000)
        : '【第 ' + g.pages.join('、') + ' 页 · 整页图片】请从图片逐题识别。';
      const sys = g.kind === 'text' ? importTextSystem(subj) : importVisionSystem(subj);
      const msgs = g.kind === 'img'
        ? [{ role: 'system', content: sys }, { role: 'user', content: [{ type: 'text', text: userTxt }].concat(g.imgs.map(u => ({ type: 'image_url', image_url: { url: u } }))) }]
        : [{ role: 'system', content: sys }, { role: 'user', content: userTxt }];
      const res = await aiJson(msgs, { think: false, temperature: 0.1 });
      const rawList = res && Array.isArray(res.questions) ? res.questions : (Array.isArray(res) ? res : []);
      const qs = [];
      for (const raw of rawList) {
        try { qs.push(normalizeImported(raw, g)); } catch (e) { pushLog('⚠️ 一题规范化失败已跳过：' + String(e.message || e).slice(0, 100), 'warn'); }
      }
      qs.forEach(q => all.push(q));
      // 每组识别完立即落盘 partial.json（含 imported 标记）：中途失败/停止也能抢救已识别题
      await flushPartial(all, { subject: subj, imported: true });
      pushLog('🔎 第 ' + g.pages.join(',') + ' 页（' + g.kind + '）识别出 ' + qs.length + ' 题，累计 ' + all.length + ' 题已落盘');
      return qs.length;
    }
    await pool(groups, 3, async (g) => {
      try { return { n: await extractGroup(g) }; }
      catch (e) {
        const m = String((e && e.message) || e);
        // 【v14 第二层防御】文字组被 AI 拒答（大概率是漏网的乱码文字层）→ 渲染整页转视觉重试一次。
        //   判据取反更稳：除明确的传输层错误（HTTP 401/403/408/429/5xx、断网、超时）外全部转视觉——
        //   解析类失败文案多样（没有 JSON / Unexpected token / 被截断 / 空正文），白名单容易漏。
        const transportErr = /HTTP 40[138]|HTTP 429|HTTP 5\\d\\d|Failed to fetch|timeout|超时|ECONN/i.test(m);
        if (g.kind === 'text' && typeof g.visionRetry === 'function' && !transportErr) {
          try {
            pushLog('🔁 第 ' + g.pages.join(',') + ' 页文本通道失败（' + m.slice(0, 60) + '），自动转视觉重试…', 'warn');
            await setStatus('running', 'extracting', '🔁 第 ' + g.pages.join(',') + ' 页转视觉重试…', 40);
            const imgGroups = await g.visionRetry();
            let n2 = 0, lastErr = null;
            for (const ig of imgGroups) {
              try { n2 += await extractGroup(Object.assign({ kind: 'img' }, ig)); }
              catch (e2) { lastErr = e2; pushLog('⚠️ 第 ' + ig.pages.join(',') + ' 页视觉重试仍失败：' + String(e2.message || e2).slice(0, 120), 'warn'); }
            }
            if (n2 > 0) return { n: n2, visionRescued: true };
            failedGroups.push({ pages: g.pages, err: (lastErr && String(lastErr.message || lastErr)) || m });
            return { __err: m };
          } catch (e3) {
            pushLog('⚠️ 第 ' + g.pages.join(',') + ' 页转视觉准备失败：' + String(e3.message || e3).slice(0, 120), 'warn');
          }
        }
        failedGroups.push({ pages: g.pages, err: m.slice(0, 160) });
        pushLog('⚠️ 第 ' + g.pages.join(',') + ' 页组识别失败：' + m.slice(0, 140), 'warn');
        return { __err: m };
      }
    }, (d, n) => setStatus('running', 'extracting', '🔎 AI 拆题中（' + d + '/' + n + ' 组 · 已识出 ' + all.length + ' 题）…', 15 + Math.round(d / n * 65)));
    if (!all.length) {
      throw new Error('所有页面识别失败（共 ' + groups.length + ' 组' + (failedGroups.length ? '：' + failedGroups.map(f => 'P' + f.pages.join('+') + ' ' + f.err).join('；') : '') + '）');
    }
    // ---------- ④ 合并去重 + 排序 + 打包 ----------
    await cancelCheckpoint();
    await setStatus('running', 'finalizing', '📦 整理成卷…', 85);
    const seen = {};
    const uniq = [];
    for (const q of all) {
      const k = String(q.stem).replace(/\\s+/g, '').slice(0, 90);
      if (seen[k]) continue;
      seen[k] = 1; uniq.push(q);
    }
    const dropped = all.length - uniq.length;
    if (dropped) pushLog('🧹 跨页边界去重：丢弃 ' + dropped + ' 道重复题');
    uniq.sort((a, b) => ((a.sourcePages[0] || 0) - (b.sourcePages[0] || 0)) || ((Number(a.no) || 0) - (Number(b.no) || 0)));
    uniq.forEach((q, i) => { if (q.no == null) q.no = i + 1; });
    const lowN = uniq.filter(q => q.lowConfidence).length;
    // ---------- ④.5 AI 思考补全参考答案与解析（v13，prefs.fillAnswers 开启时） ----------
    // 只补「卷面缺答案/缺解析」的题：answer/solution 为空的才进补全队列。
    // 补全产物挂到 q.aiAnswer/q.aiSolution + aiFilled:true——绝不覆盖卷面原文字段，
    // 客户端预览与卷页用「🧠 AI 补全」徽标区分展示（零幻觉：卷面有无答案永远可溯）。
    let filledN = 0, fillFailN = 0;
    if (prefs.fillAnswers) {
      const needFill = uniq.filter(q => !String(q.answer || '').trim() || !String(q.solution || '').trim());
      if (needFill.length) {
        await setStatus('running', 'finalizing', '🧠 AI 思考补全 ' + needFill.length + ' 题的答案解析…', 86);
        pushLog('🧠 开始补全：' + needFill.length + '/' + uniq.length + ' 题缺卷面答案或解析（思考模式逐题求解）');
        await smartPool(needFill, 4, async (q) => {
          try {
            const r = await aiJson(
              [{ role: 'system', content: importFillSystem(subj) },
               { role: 'user', content: '【第 ' + (q.no || '?') + ' 题·' + (q.type || 'solve') + '】\\n题干：' + String(q.stem).slice(0, 3000)
                 + (Array.isArray(q.options) && q.options.length ? '\\n选项：\\n' + q.options.join('\\n') : '')
                 + (String(q.answer || '').trim() ? '\\n（卷面已有答案，仅需补解析）：' + String(q.answer).slice(0, 300) : '') }],
              { think: true, temperature: 0.2 });
            const aiAns = String((r && r.answer) || '').trim();
            const aiSol = String((r && r.solution) || '').trim();
            if (/^无法求解/.test(aiAns) || (!aiAns && !aiSol)) {
              fillFailN++;
              q.aiNote = String((r && r.unsure) || aiAns || 'AI 判定信息不足').slice(0, 200);
              pushLog('⚠️ 第 ' + (q.no || '?') + ' 题无法补全：' + String(q.aiNote).slice(0, 80), 'warn');
              return;
            }
            if (!String(q.answer || '').trim() && aiAns) q.aiAnswer = aiAns;
            if (!String(q.solution || '').trim() && aiSol) q.aiSolution = aiSol;
            if (r.unsure) q.aiNote = String(r.unsure).slice(0, 200);
            q.aiFilled = true;
            filledN++;
          } catch (e) {
            fillFailN++;   // 单题失败不致命：该题保持无答案进人工复核
            log('补全失败 @题' + (q.no || '?'), e.message);
          }
        }, (d, n) => setStatus('running', 'finalizing', '🧠 AI 补全中（' + d + '/' + n + ' 题）…', 86 + Math.round(d / n * 9)));
        pushLog('🧠 补全完成：成功 ' + filledN + ' 题' + (fillFailN ? '，无法求解/失败 ' + fillFailN + ' 题（保持待人工）' : ''));
      } else {
        pushLog('🧠 已勾选补全，但所有题都有卷面答案与解析，跳过');
      }
    }
    const totalScore = uniq.reduce((a, q) => a + (Number(q.score) || 0), 0);
    const exam = {
      id: job.jobId + '-imp',
      title: (String(prefs.importTitle || '').trim() || '📄 导入试卷').slice(0, 60) + '（' + uniq.length + ' 题）',
      subject: subj,
      timeLimit: Number(prefs.importTimeLimit) > 0 ? Number(prefs.importTimeLimit) : Math.max(30, uniq.length * 6),
      totalScore: totalScore || uniq.length * 5,
      questions: uniq,
      imported: true, lowConfidenceCount: lowN, failedPages: failedGroups.map(f => f.pages.join('+')),
      aiFilledCount: filledN,
      builtBy: 'pdf-import', generatedAt: new Date().toISOString()
    };
    pushLog('✅ 识别完成：' + uniq.length + ' 题 · 待人工复核 ' + lowN + ' 题' + (failedGroups.length ? ' · 失败页组 ' + failedGroups.length : ''));
    await flushPartial(uniq, { subject: subj, imported: true, force: true });
    dropPendingStatus();
    await ghRetry('PATCH', '/gists/' + GIST_ID, { files: {
      'result.json': { content: JSON.stringify(exam) },
      'status.json': { content: JSON.stringify({ status: 'done', stage: 'finalizing', msg: '📄 识别完成（' + uniq.length + ' 题 · 待复核 ' + lowN + '），可收卷导入预览确认', progress: 100, log: RUN_LOG, qs: QS, savedCount: _partialCount, imported: true, updatedAt: new Date().toISOString(), runnerVer: RUNNER_VER }) }
    } });
    log('✅ 导入任务完成');
  } finally {
    try { fsT.rmSync(wd, { recursive: true, force: true }); } catch (e) {}
  }
}

// ---------- 主流程 ----------
(async function main() {
  // 供 catch（取消/失败路径）使用：try 块内 let/const 的作用域到不了 catch，
  // 若在 catch 里直接引用 gist/subj 会 ReferenceError 崩进程 → partial 卷写不出去。
  let JOB_GIST = null;
  let JOB_SUBJ = 'math';
  let JOB_JOBID = '';   // 供 catch 里写 log.json 使用（job 是 try 内 const，catch 取不到）
  try {
    // ① 读任务
    let gist;
    try { gist = await ghRetry('GET', '/gists/' + GIST_ID); }
    catch (e) {
      if (e.status === 404) throw new Error('找不到任务 Gist（404）：gist_id 传错，或 CLOUDJOB_GH_TOKEN 缺 gist 权限。GIST_ID=' + GIST_ID);
      throw e;
    }
    if (!gist || !gist.files || !gist.files['job.json']) throw new Error('Gist 缺 job.json');
    JOB_GIST = gist;
    // 【2026-09-02 容错】用容错读取（content 缺失/空/size 不符自动 raw_url 回补）；
    // 万一仍失败，把 GIST_ID + files keys/sizes 全打出来方便直接定位
    var jobJsonRaw = await gistFileText(gist.files, 'job.json');
    if (!jobJsonRaw) {
      var fk = Object.keys(gist.files || {}).map(function (k) {
        var f = gist.files[k];
        return k + '(size=' + (f.size || 0) + ',truncated=' + !!f.truncated + ',contentLen=' + (f.content ? f.content.length : 0) + ')';
      }).join(',');
      throw new Error('GIST_ID=' + GIST_ID + ' job.json 读取为空/损坏。files=' + fk);
    }
    const job = JSON.parse(jobJsonRaw);
    JOB_JOBID = String(job.jobId || '');
    var statusJsonRaw = gist.files['status.json'] ? await gistFileText(gist.files, 'status.json') : '{}';
    const stNow = JSON.parse(statusJsonRaw || '{}');
    if (stNow.status === 'canceled') { log('任务已被用户取消，直接退出'); return; }
    const prefs = job.prefs || {};
    /* 【H1 断点续跑】job.resume 存在 → 从 partial.json 取回上次已出的题，只补缺口。
     * 为什么值得做：一次出卷 10~20 分钟、几十次 AI 调用，若第 16 题偶发网络失败就整卷作废，
     * 前面 15 题白烧的 token 与时间比这一题贵得多。续跑把「失败重来」变成「接着出」。 */
    let resumeQs = [];
    let resumeNeed = 0;
    const resuming = !!(job.resume && job.resume.target);
    if (resuming) {
      const pj = readPartialJson(gist);
      if (pj && pj.__truncated) throw new Error('partial.json 过大已被截断，无法续跑（请重新出卷）');
      resumeQs = ((pj && pj.questions) || []).filter(q => q && q.stem);
      if (!resumeQs.length) {
        log('续跑：partial.json 里没有可用题目，退回全新出卷');
        pushLog('⚠️ 续跑未找到已落盘题目，退回全新出卷', 'warn');
      } else {
        SAVED = resumeQs.slice();
        _partialCount = resumeQs.length;
        resumeNeed = Math.max(0, (job.resume.target || 0) - resumeQs.length);
        pushLog('▶️ 续跑模式：已落盘 ' + resumeQs.length + ' 题，目标 ' + job.resume.target + ' 题，还需补 ' + resumeNeed + ' 题');
      }
    }
    // AI 配置：优先任务自带的 prefs.ai（本地工具写入 secret Gist），回退 repo secrets
    JOB_AI = prefs.ai || null;
    // 思考模式：结构化 JSON 出卷默认关闭思考（思考模型会把 token 烧光致空正文、卡死）；
    // 仅当用户显式勾选「启用思考模式」（prefs.think=true）才开启。
    JOB_THINK = !!prefs.think;
    // 【2026-08-31】最大输出 token 可配置：job.prefs.maxTokens（出卷弹窗填写，随 job.json 下发）；
    // 不填/非法 = 默认 32768。钳制 1024-65536（防手滑 0 或爆预算）。
    var mt = parseInt(prefs.maxTokens, 10);
    JOB_MAXTOK = (mt >= 1024 && mt <= 65536) ? mt : 32768;
    // 专业课名：专业课（ctrl）科目出卷必须具体到专业，否则提示词只会写泛化的「专业课」三个字。
    JOB_MAJOR = String(prefs.major || '').trim();
    log('AI 配置来源：', JOB_AI ? 'job.json' : 'repo secrets', '· model =', aiConf('model') || '(空)', '· think =', JOB_THINK, '· major =', JOB_MAJOR || '(无)');
    if (!aiConf('endpoint') || !aiConf('key') || !aiConf('model')) {
      throw new Error('缺 AI 配置：任务未携带（prefs.ai）且 repo secrets 也未配置');
    }

    // ①.5 自检模式：只验证链路（Gist 读写 + secret 有效 + AI 配置在场），不调 AI、不耗 token
    if (prefs.check) {const aiOk = !!(aiConf('endpoint') && aiConf('key') && aiConf('model'));
      await ghRetry('PATCH', '/gists/' + GIST_ID, { files: {
        'result.json': { content: JSON.stringify({ cloudJobCheck: true, ok: true, aiConfigPresent: aiOk, checkedAt: new Date().toISOString() }) },
        'status.json': { content: JSON.stringify({ status: 'done', stage: '', msg: '🧪 自检通过：Gist 读写 ✓ · CLOUDJOB_GH_TOKEN ✓ · AI 配置在场' + (aiOk ? ' ✓' : ' ✗'), progress: 100, updatedAt: new Date().toISOString(), runnerVer: RUNNER_VER }) }
      } });
      log('🧪 自检完成');
      return;
    }
    const subj = prefs.subject === 'auto' ? 'math' : (prefs.subject || 'math');   // auto 由规划阶段自行判断科目语境
    JOB_SUBJ = subj;
    // 【v10 导入通道】prefs.mode==='import' → 走 PDF/图片识别流水线，与出卷流水线平行
    if (prefs.mode === 'import') {
      await runImport(gist, job, prefs);
      return;
    }
    log('接单', job.jobId, JSON.stringify(prefs));
    pushLog('📋 接单 ' + job.jobId + ' · ' + (SUBJ_NAME[subj] || subj) + ' · 难度 ' + (prefs.diff || 'mix') + ' · 模型 ' + (aiConf('model') || '?') + ' · maxTok ' + JOB_MAXTOK + (JOB_THINK ? ' · 💭 思考模式' : ' · ⚡ 不思考(结构化)'));
    pushLog('🧠 思考开关已对齐本地：' + (JOB_THINK ? '开启（若思考模型烧光 token 会自动关思考降级）' : '关闭（结构化 JSON 默认不思考，避免空正文卡死）'));
    // 云端工具探测：python3 + sympy 可用则启用出题/审查的工具调用
    try {
      await execPython('import sympy\\nprint("ok")');
      PY_TOOLS_ON = true;
      pushLog('🧮 云端工具调用已启用：sympy 就绪（出题/重写/审查可自主调用 Python 验算）');
    } catch (e) {
      PY_TOOLS_ON = false;
      pushLog('⚠️ Python/sympy 不可用，本次退化为纯 LLM 出卷（不影响出卷，仅无工具验算）', 'warn');
    }

    // key/endpoint 匹配预检：最常见的 401 根因，开跑前先提醒（写进日志，浮窗可见）
    {
      const ep = aiConf('endpoint') || '', key = aiConf('key') || '';
      if (/sk-or-v1-/.test(key) && !/openrouter\\.ai/i.test(ep)) pushLog('⚠️ key 是 OpenRouter 的（sk-or-v1-…）但 endpoint 不是 openrouter.ai——大概率会 401，请换该平台自己的 key');
      else if (/sk-ant-/.test(key) && !/anthropic/i.test(ep)) pushLog('⚠️ key 是 Anthropic 的（sk-ant-…）但 endpoint 不是 anthropic——大概率会 401');
    }

    // ② 总工规划
    const isResume = resuming && resumeQs.length > 0;
    // 【2026-09-03】把生效蓝图提到主流程作用域：worker / chief / 终检都要用到 bp.starMix 与 bp.types
    // （不再在 plannerSystem 里局部声明，避免 worker/chief 引用不到）。
    const bp = resolveBpFromPrefs(subj, prefs);
    // 【v13 子母卷】derive 模式：先读母卷指纹 → AI 归纳「命题形式研究报告」→ 注入 planner。
    //   研究报告失败不致命（降级为无风格约束的普通出卷，任务仍能完成，只是不"仿母卷"）。
    let deriveStyleNote = null;
    if (prefs.mode === 'derive' && !isResume) {
      await setStatus('running', 'planning', '🧬 研究母卷命题形式…', 3);
      try {
        let srcTxt = await gistFileText(gist.files, 'source.json');
        if (!srcTxt && SOURCE_GIST_ID) {
          const assetGist = await ghRetry('GET', '/gists/' + SOURCE_GIST_ID);
          srcTxt = await gistFileText((assetGist && assetGist.files) || {}, 'source.json');
        }
        if (!srcTxt) throw new Error('任务未携带 source.json 母卷指纹');
        const src = JSON.parse(srcTxt);
        pushLog('🧬 母卷《' + (src.motherTitle || '?') + '》指纹就绪：' + (src.questions || []).length + ' 题 · ★配比 ' + JSON.stringify(src.starMix || {}));
        deriveStyleNote = await aiText(
          [{ role: 'system', content: deriveStyleSystem(subj, prefs) },
           { role: 'user', content: '【母卷命题形式指纹】\\n' + JSON.stringify(src).slice(0, 30000) }],
          { temperature: 0.3 });
        deriveStyleNote = String(deriveStyleNote || '').trim().slice(0, 1200);
        if (!deriveStyleNote) deriveStyleNote = null;
        pushLog(deriveStyleNote ? ('📝 命题形式研究报告完成（' + deriveStyleNote.length + ' 字），据此规划子卷') : '⚠️ 研究报告为空，降级为普通出卷');
      } catch (e) {
        pushLog('⚠️ 母卷形式研究失败，降级为普通出卷：' + String((e && e.message) || e).slice(0, 120), 'warn');
        deriveStyleNote = null;
      }
    }
    await setStatus('running', 'planning', isResume ? ('续跑规划中…（已有 ' + resumeQs.length + ' 题，补 ' + resumeNeed + ' 题）') : (deriveStyleNote ? '🧬 子卷总工按母卷形式规划蓝图…' : '总工程师正在规划蓝图…'), 5);
    let plan;
    if (isResume && resumeNeed <= 0) {
      // 题已够：跳过规划与出题，直接进入终检打包（单纯把上次落盘的题走完审查流程）
      plan = { title: null, timeLimit: (job.resume && job.resume.timeLimit) || 120, questions: [] };
      pushLog('✅ 题量已满足（' + resumeQs.length + '/' + job.resume.target + '），跳过出题直接终检');
    } else if (isResume) {
      plan = await aiJson(
        [{ role: 'system', content: plannerSystem(subj, prefs, deriveStyleNote) },
         { role: 'user', content: '【续跑任务】本卷此前已出好 ' + resumeQs.length + ' 题，还缺 ' + resumeNeed + ' 题。\\n'
           + '已有题目涉及的考点与设问角度如下——请只规划**剩余的 ' + resumeNeed + ' 题**，'
           + '严禁重复已有考点与设问角度（否则用户会拿到两道雷同的题）：\\n'
           + resumeQs.map((q, i) => (i + 1) + '. ' + String(q.topicName || '?') + '：' + String(q.stem || '').slice(0, 60)).join('\\n')
           + '\\n只输出 JSON，questions 数组长度必须恰好为 ' + resumeNeed + '。' }],
        {});
    } else {
      plan = await aiJson(
        [{ role: 'system', content: plannerSystem(subj, prefs, deriveStyleNote) },
         { role: 'user', content: deriveStyleNote ? '请依据上述母卷命题形式，规划一张同形式的子卷蓝图（新题、不复刻母卷）。' : '请规划本卷蓝图。' }],
        {});
    }
    // 续跑且题已够时 questions 允许为空；其余情况空蓝图就是失败
    if (!plan || !Array.isArray(plan.questions)) throw new Error('蓝图规划失败：返回格式不对');
    if (!plan.questions.length && !(isResume && resumeNeed <= 0)) throw new Error('蓝图规划失败：无 questions');
    // 【2026-09-03 链路加固】蓝图落地时按 bp 决定性覆盖 score + star，AI 自由发挥不再生效。
    // 1) score 用 scoreForType(bp, type) 反查（避免 AI 全填 5）；2) star 用 clampStar 兜底（避免 ?）;
    // 3) starMixTargets/bp 决定每题目标档 → 超过 ±2 道差异再 forceStarMix 再平衡。
    plan.questions.forEach(function (pq, i) {
      pq.score = scoreForType(bp, pq.type);
      pq.star = clampStar(pq.star);
    });
    var planStarMix = forceStarMix(plan.questions, bp);
    log('蓝图完成：', plan.questions.length, '题 ·', plan.title || '', '· star 分布=', JSON.stringify(planStarMix.distribution));
    pushLog('🗺 蓝图《' + (plan.title || '未命名卷') + '》规划完成：共 ' + plan.questions.length + ' 题 · 限时 ' + (plan.timeLimit || 120) + ' 分钟 · ★分布 ' + JSON.stringify(planStarMix.distribution));
    plan.questions.forEach((pq, i) => pushLog('　第' + (i + 1) + '题 ' + (pq.topicName || '?') + ' · ' + (pq.type || '?') + ' · ★' + (pq.star || '?') + ' · ' + (pq.score || 0) + '分'));
    // 初始化逐题状态墙（浮窗卡片数据源）
    // 续跑时先为「上次已落盘的题」占位（st=done + resumed 标记），浮窗一眼能看出哪些是接着出的
    if (isResume) {
      resumeQs.forEach((q, i) => QS.push({ i: i + 1, topic: String(q.topicName || '?').slice(0, 30), star: clampStar(q.star), type: q.type || '?', score: Number(q.score) || 5,
        st: 'done', resumed: true, stem: String(q.stem || '').slice(0, 140), ans: String(q.answer || '').slice(0, 60) }));
    }
    plan.questions.forEach((pq, i) => QS.push({ i: resumeQs.length + i + 1, topic: String(pq.topicName || '?').slice(0, 30), star: pq.star, type: pq.type || '?', score: pq.score || 5, st: 'wait' }));
    await setStatus('running', 'generating', '并发出题中… 0/' + plan.questions.length, 10);

    // ③ 并发出题池
    let genDone = 0;
    const genTotal = plan.questions.length;
    let questions = genTotal ? await smartPool(plan.questions, 4, async (pq, i) => {
      const ci = await checkCancel();
      if (ci && ci.canceled) throw new CancelError('cancel');
      QS[i].st = 'run';
      QS[i].t0 = Date.now();
      // 【2026-09-03 配额治理】开工不再单独 setStatus：QS[i].st='run' 会随「上一题完成」或
      // 「本题完成」的节流窗口合并写入，浮窗逐题卡片仍会更新，省掉每题一次的冗余 PATCH。
      const out = await aiToolJson(
        [{ role: 'system', content: questionSystem(subj) },
         { role: 'user', content: '蓝图第' + (i + 1) + '题：' + JSON.stringify(pq) }],
        {});
      out.topicName = pq.topicName || out.topicName || '';
      // 【2026-09-03】出题 AI 经常乱填 score → 一律按蓝图 scoreForType 决定性覆盖；
      // diff 字段也按 clampStar 反推，避免与 star 自相矛盾。
      out.score = scoreForType(bp, out.type || pq.type);
      out.type = pq.type || out.type || 'solve';
      out.star = clampStar(out.star);
      out.diff = ({ 1: 'easy', 2: 'easy', 3: 'medium', 4: 'hard', 5: 'hard' })[out.star] || 'medium';
      if (!validateQuestion(out)) {
        QS[i].st = 'done';
        QS[i].sec = Math.round((Date.now() - QS[i].t0) / 1000);
        QS[i].stem = String(out.stem || '').slice(0, 140);
        QS[i].ans = String(out.answer || '').slice(0, 60);
        genDone++;
        SAVED.push(out);   // 合格题攒进 SAVED，「停止并保存」时打包成 partial 卷
        // 每题完成即落盘：一题要 30s~2min，写一次 Gist 不到 1s，代价可忽略，
        // 换来的是「进程随时可死、已出的题永不丢」。
        await flushPartial(SAVED);
        pushLog('✅ 第' + (i + 1) + '题出好了 · ' + (out.topicName || '?') + ' · ★' + (out.star || '?') + '（' + genDone + '/' + genTotal + '）');
        await setStatus('running', 'generating', '并发出题中… ' + genDone + '/' + genTotal, 10 + Math.round(genDone / genTotal * 45));
      }
      return out;
    }) : [];   // 续跑且题量已够时 plan.questions 为空 → 不出新题，直接拿已落盘的题进终检
    // 池结束后：仍处 run 状态的题 = 生成失败或取消（pool 吞掉了异常）
    QS.forEach(q => { if (q.st === 'run') { q.st = 'fail'; q.err = '生成失败'; } });
    // 【H1】续跑：把上次已落盘的题并到新出的题前面，构成完整卷
    if (isResume) {
      const fresh = questions.filter(q => q && q.stem && !q.__err && !q.__canceled);
      questions = resumeQs.concat(fresh);
      pushLog('🔗 续跑合并：' + resumeQs.length + ' 题（已有） + ' + fresh.length + ' 题（新出） = ' + questions.length + ' 题');
    }
    await cancelCheckpoint();   // 出题阶段完成 → 检查取消（已出 SAVED 题可保存）

    // ④ 蓝本硬校验（纯代码）：坏题先标记，交由审查后统一重写
    const localIssues = [];
    questions.forEach((q, i) => {
      const bad = validateQuestion(q);
      const braceBad = !braceBalanced(q.stem) || !braceBalanced(q.solution);
      if (bad || braceBad) localIssues.push({ index: i + 1, reason: bad + (braceBad ? '；LaTeX 花括号不平衡' : ''), fixHint: '修复结构问题，保持题意不变' });
    });
    log('本地硬校验：', localIssues.length, '题有问题');
    pushLog('🔍 本地硬校验：' + (questions.length - localIssues.length) + ' 题过关，' + localIssues.length + ' 题待修');

    // ⑤ 总工审查
    await setStatus('running', 'reviewing', '总工程师审查中…', 58);
    let review = {};
    let reviewFailed = false;
    try {
      review = await aiToolJson(
        [{ role: 'system', content: chiefSystem(subj, bp) },
         { role: 'user', content: '审查这份押题卷（题号从1开始，共 ' + questions.length + ' 题）：\\n' + JSON.stringify(questions.map((q, i) => ({
           index: i + 1, stem: q.stem, options: q.options, answer: q.answer,
           solution: String(q.solution || ''), star: q.star, diff: q.diff, score: q.score,
           topicName: q.topicName, type: q.type, direction: plan.questions[i] && plan.questions[i].direction
         })) ) }],
        {});
    } catch (e) {
      reviewFailed = true;
      log('审查调用失败，仅按本地校验处理：', e.message);
      pushLog('⚠️ 总审查调用失败（' + String((e && e.message) || '').slice(0, 60) + '），降级为本地校验通过', 'warn');
    }
    const rewriteList = [];
    const seenRw = {};
    // 【2026-09-03】needsRewrite 的 index 必须落在 1..questions.length 范围内（之前不校验，
    // AI 可能写 0 或超大下标 → 后续 questions[i] = undefined → 重写池空跑或越界）。
    ((review.needsRewrite) || []).forEach(r => {
      if (!r || !r.index) return;
      var idx = parseInt(r.index, 10);
      if (!(idx >= 1 && idx <= questions.length)) { log('审查 needsRewrite.index 越界：', r.index); return; }
      if (!seenRw[idx]) { seenRw[idx] = 1; rewriteList.push(r); }
    });
    localIssues.forEach(li => { if (!seenRw[li.index]) { seenRw[li.index] = 1; rewriteList.push(li); } });
    log('审查 verdict=', review.verdict || 'n/a', '待重写', rewriteList.length, '题');
    pushLog('🧐 总审查 verdict=' + (review.verdict || 'n/a') + (review.summary ? '（' + String(review.summary).slice(0, 60) + '）' : '') + '，待重写 ' + rewriteList.length + ' 题');
    rewriteList.forEach(rw => pushLog('　第' + rw.index + '题需重写：' + String(rw.reason || '').slice(0, 50)));
    await cancelCheckpoint();   // 审查完成 → 检查取消

    // ⑥ 定向重写池
    if (rewriteList.length) {
      await setStatus('running', 'rewriting', '定向重写 ' + rewriteList.length + ' 题…', 68);
      rewriteList.forEach(rw => { const q = QS[rw.index - 1]; if (q) q.st = 'rewrite'; });
      await smartPool(rewriteList, 3, async (rw) => {
        const i = rw.index - 1;
        const old = questions[i];
        if (!old) return null;
        // 【2026-08-27 收敛闭环】重写后不达标不再是"保留原题"摆烂（那等于返工白跑）：
        // 不达标就把「校验失败原因」作为新反馈再重写一轮（上限 2 轮），让 审查→重写→再校验 真正收敛。
        let fixed = null;
        let lastBad = '';
        for (let attempt = 0; attempt < 2; attempt++) {
          const feedback = attempt === 0
            ? '必须修复：' + rw.reason + '。指引：' + (rw.fixHint || '')
            : '上一轮重写仍未通过校验，问题：' + (lastBad || '') + '。请针对性修复并确保解析完整（分步+结论+易错点）。';
          const cand = await aiToolJson(
            [{ role: 'system', content: questionSystem(subj) },
             { role: 'user', content: '重写这道题（原题如下）。' + feedback + '\\n原题：' + JSON.stringify(old) }],
            {});
          // 旧题可能是 worker 失败占位（{__err}），topicName/score 会丢——回退到蓝图原题参数
          const pq0 = plan.questions[i];
          cand.topicName = old.topicName || (pq0 && pq0.topicName) || '';
          // 【2026-09-03】重写也按蓝图决定性覆盖 score（避免 AI 在重写 prompt 里再填 5）
          cand.score = scoreForType(bp, cand.type || (pq0 && pq0.type) || old.type);
          cand.type = old.type || (pq0 && pq0.type) || cand.type;
          cand.star = clampStar(cand.star);
          cand.diff = ({ 1: 'easy', 2: 'easy', 3: 'medium', 4: 'hard', 5: 'hard' })[cand.star] || 'medium';
          const bad = validateQuestion(cand);
          if (!bad) { fixed = cand; break; }
          lastBad = bad;
          log('重写第', attempt + 1, '轮未过校验 @', rw.index, ':', bad);
        }
        if (!fixed) { log('重写 2 轮后仍不合格，保留原题 @', rw.index, lastBad); pushLog('⚠️ 第' + rw.index + '题重写 2 轮仍未过关，保留原题（' + String(lastBad || '').slice(0, 40) + '）'); const q = QS[i]; if (q) { q.st = 'done'; q.err = '重写未过，保留原题'; } return null; }
        questions[i] = fixed;
        const q = QS[i]; if (q) { q.st = 'done'; q.stem = String(fixed.stem || '').slice(0, 140); q.ans = String(fixed.answer || '').slice(0, 60); }
        pushLog('✏️ 第' + rw.index + '题重写完成');
        return null;
      }, (d, n) => setStatus('running', 'rewriting', '定向重写中… ' + d + '/' + n, 68 + Math.round(d / n * 20)));
    }

    // ⑦ 终检 + 打包
    await cancelCheckpoint();   // 终检前最后一道取消检查
    await setStatus('running', 'finalizing', '终检打包中…', 92);
    const finalBad = [];
    questions.forEach((q, i) => { const b = validateQuestion(q); if (b) finalBad.push((i + 1) + ':' + b); });
    if (finalBad.length > Math.ceil(questions.length / 3)) throw new Error('终检不合格题过多（' + finalBad.length + '/' + questions.length + '），放弃交付：' + finalBad.join('; ').slice(0, 300));
    // 剔除个别终检仍坏的题（宁缺毋滥），至少保留 60%
    questions = questions.filter(q => !validateQuestion(q));
    if (questions.length < 5) throw new Error('合格题不足 5 题，放弃交付');
    // 【2026-09-03】重写后 / 终检后做一次 forceStarMix（防止 AI 自由发挥让 ★4+★5 远超 bp.starMix）
    var finalMix = forceStarMix(questions, bp);
    if (finalMix.changed > 0) pushLog('🎯 终检再平衡 star 配比：调整 ' + finalMix.changed + ' 题 → ' + JSON.stringify(finalMix.distribution));
    // 【2026-09-03】总分对齐：Σ q.score 必须 = bp.totalScore（除不尽的零头贴最后一题）。
    // 出题阶段已按 scoreForType 决定性覆盖，理论已对齐；此处兜底防止某个 review/chief 误改了 score。
    var bpTotal = bpTotalScore(bp);
    var sumScore = questions.reduce(function (a, q) { return a + (Number(q.score) || 0); }, 0);
    if (Math.abs(sumScore - bpTotal) > 0.01 && questions.length) {
      var drift = +(bpTotal - sumScore).toFixed(2);
      questions[questions.length - 1].score = +((Number(questions[questions.length - 1].score) || 0) + drift).toFixed(2);
      sumScore = questions.reduce(function (a, q) { return a + (Number(q.score) || 0); }, 0);
      pushLog('⚖️ 总分对齐：原 Σ ' + sumScore.toFixed(0) + ' → 强制贴齐蓝图 ' + bpTotal + '（最后一题吸收 ' + drift + ' 分）');
    }
    const totalScore = sumScore;
    const exam = {
      title: plan.title || ('云端押题卷 · ' + (SUBJ_NAME[subj] || '')),
      subject: subj,
      timeLimit: plan.timeLimit || 120,
      totalScore: totalScore,
      questions: questions,
      // 【2026-09-03】审查异常时不再默 ok（之前 reviewFailed=true 时 chiefReview.verdict 走 fallback 仍写 ok → 用户误以为"已过审"）；
      // 降级为 'unknown' 让前端明示"AI 审查未响应，本地校验通过"
      chiefReview: { verdict: reviewFailed ? 'unknown' : (review.verdict || (rewriteList.length ? 'minor' : 'ok')),
        hardPct: review.hardPct || null, targetHardPct: targetHardPct(bp),
        summary: review.summary || (reviewFailed ? 'AI 审查未响应，已按本地校验通过' : ''),
        rewrittenCount: rewriteList.length, reviewFailed: reviewFailed },
      builtBy: 'cloud-actions',
      generatedAt: new Date().toISOString()
    };

    // ⑧ 收卷回写
    pushLog('📦 终检通过：' + questions.length + ' 题 · 总分 ' + totalScore + ' · 即将回写');
    // 先落盘终稿再写 result.json：这一步是整条链路的最后一跳、文件最大、最容易失败
    // （Gist 限额/网络/权限都可能在这一刻报错），落盘后即使它挂了，
    // 客户端也能从 partial.json 抢救出「已过总工审查的完整卷」，而不是退回初稿。
    await flushPartial(questions, { reviewed: true, subject: subj, force: true });
    dropPendingStatus();
    await ghRetry('PATCH', '/gists/' + GIST_ID, { files: {
      'result.json': { content: JSON.stringify(exam) },
      'status.json': { content: JSON.stringify({ status: 'done', stage: '', msg: '出卷完成（' + questions.length + ' 题 · ' + totalScore + ' 分），可收卷导入', progress: 100, log: RUN_LOG, qs: QS, savedCount: _partialCount, updatedAt: new Date().toISOString(), runnerVer: RUNNER_VER }) }
    } });
    log('✅ 完成');
  } catch (e) {
    // 进入终态处理（取消/失败）：先丢弃节流攒着的待发 running，否则它会在下面
    // 直写 canceled/error 之后迟到触发，把终态覆盖回 running（客户端永远看到「进行中」）。
    dropPendingStatus();
    // 取消路径：用户主动停止 → 按 savePartial 决定是否把已出合格题打包成 partial 卷
    if (e && e.name === 'CancelError') {
      const wantSave = !(e.message === 'user-cancel-no-save');
      const cands = (SAVED || []).filter(q => q && q.stem);
      try {
        if (wantSave && cands.length) {
          // 取消路径也补一次落盘：把「最后一次 flush 之后才完成」的题补进 partial.json，
          // 保证 result.json 与 partial.json 内容一致（客户端优先用前者，后者作兜底）。
          await flushPartial(cands, { force: true });
          const partial = {
            title: '☁️ 云端押题卷（部分 · ' + cands.length + ' 题）',
            subject: (function () {
              try { if (JOB_GIST && JOB_GIST.files && JOB_GIST.files['job.json']) return (JSON.parse(JOB_GIST.files['job.json'].content).prefs || {}).subject; } catch (e) {}
              return JOB_SUBJ;
            })() || 'math',
            timeLimit: 120, totalScore: cands.reduce((a, q) => a + (Number(q.score) || 5), 0),
            questions: cands, partial: true, cancelReason: '用户停止时保存已出题目',
            builtBy: 'cloud-actions', generatedAt: new Date().toISOString()
          };
          await ghRetry('PATCH', '/gists/' + GIST_ID, { files: {
            'result.json': { content: JSON.stringify(partial) },
            'status.json': { content: JSON.stringify({ status: 'canceled', stage: '', msg: '⏹ 已停止 · 已保存 ' + cands.length + ' 题（可收卷导入部分卷）', progress: 100, partialSaved: true, partialCount: cands.length, savedCount: _partialCount, log: RUN_LOG, qs: QS, updatedAt: new Date().toISOString(), runnerVer: RUNNER_VER }) }
          } });
          log('⏹ 已停止并保存', cands.length, '题');
        } else {
          await setStatus('canceled', '', '⏹ 已停止（未保存题目）', 100);
          log('⏹ 已停止，未保存');
        }
      } catch (err2) {
        // 取消路径内部兜底：绝不能因写回异常让状态卡在 running 假运行
        log('!! 取消落盘异常，降级写 canceled：', err2.message);
        try { await setStatus('canceled', '', '⏹ 已停止（保存失败：' + String(err2.message || '').slice(0, 40) + '）', 100); } catch (e3) {}
        process.exitCode = 1;
        return;
      }
      process.exitCode = 0;
      return;
    }
    log('❌ 失败：', e.message);
    // 崩溃前的最后一次抢救：把内存里还没落盘的题尽力写出去。
    // 这是本次重构的核心场景——执行器失败退出后，本地仍能从 partial.json 捞回已出的题，
    // 而不是像旧实现那样「进程一死，题目全没，本地点多少次保存都没用」。
    // SAVED 定义在 try 块之外，catch 里可安全引用（gist/subj 是 try 内 const，不可引用）。
    try { await flushPartial(SAVED, { force: true }); } catch (e0) { log('!! 失败前抢救落盘异常：', e0.message); }
    // 【H5】先把完整日志单独落盘，再写 error 状态：
    // 万一写 status 这一步也失败，日志已经在 log.json 里，客户端仍能看到「AI 在哪一步挂的」。
    pushLog('❌ 执行失败：' + String((e && e.message) || e).slice(0, 200), 'error');
    try { await writeLogFile(String((e && e.message) || e), JOB_JOBID); } catch (eL) {}
    try { await setStatus('error', '', '云端执行失败：' + ((e && e.message) || e)); } catch (e2) {}
    process.exitCode = 1;
  }
})();
`;(()=>{try{window.CLOUDJOB_ASSETS={yml:Ip,runner:Mp}}catch{}})();var oe="KaoYanTools_WorkRepo",gs="ai-exam.yml",qn="kaoyan2026_wftoken",ys="kaoyan2026_cj_repo_owner",Ni="kaoyan2026_cj_secret_checked",Cp=20;function Be(){return window.U}function ee(){return new Date().toISOString()}function vs(){return window.Store.get().cloudJobs=window.Store.get().cloudJobs||[]}function be(e){return vs().find(function(t){return t.id===e})}function Je(e,t){window.Store.update(function(n){n.cloudJobs=n.cloudJobs||[];var r=n.cloudJobs.find(function(s){return s.id===e});r&&Object.keys(t).forEach(function(s){r[s]=t[s]})})}function Li(e){window.Store.update(function(t){t.cloudJobs=(t.cloudJobs||[]).filter(function(n){return n.id!==e})})}function kt(){try{var e=localStorage.getItem(qn);if(e)return String(e).trim()}catch{}try{var t=window.Store.get(),n=t&&t.cloudJob&&t.cloudJob.wftoken;if(n)return localStorage.setItem(qn,String(n).trim()),window.Store.update(function(r){r.cloudJob&&delete r.cloudJob.wftoken}),String(n).trim()}catch{}return""}function Pp(e){try{e?localStorage.setItem(qn,String(e).trim()):localStorage.removeItem(qn)}catch{}try{localStorage.removeItem(ys)}catch{}$t=null;try{var t=window.Store.get();t&&t.cloudJob&&t.cloudJob.wftoken&&window.Store.update(function(n){n.cloudJob&&delete n.cloudJob.wftoken})}catch{}}function ws(){return!!kt()}function Fn(){try{return String(localStorage.getItem(ys)||"").trim()}catch{return""}}var Gt=null;function Di(e){var t=String(e||"").trim();if(!t)return"";try{localStorage.setItem(ys,t)}catch{}return t}function bs(){var e=Fn();if(e)return Promise.resolve(e);var t=kt();return t?Gt||(Gt=fetch("https://api.github.com/user",{headers:{Authorization:"Bearer "+t,Accept:"application/vnd.github+json"}}).then(function(n){if(n.status!==200)throw new Error("令牌无效（HTTP "+n.status+"），无法确定你的仓库归属");return n.json()}).then(function(n){return Di(n&&n.login)}).finally(function(){Gt=null}),Gt):Promise.resolve("")}function Kn(){return bs().catch(function(){return""})}function jp(){var e=Fn();return e?e+"/"+oe:"{你的用户名}/"+oe}function Ce(){if(!window.Cloud){var e=new Error("云同步模块未加载");throw e.status=0,e}var t=_e.isLoggedIn,n=typeof t=="function"?!!t():!!t;if(!n){var r=new Error("未登录云同步（先到设置页登录 GitHub）");throw r.status=0,r}}var io={};async function Lt(e,t){var n=await _e.gistReq("/gists/"+e,t?{etag:t}:{});return n}async function wt(e){if(!e)return null;if(e.truncated&&e.raw_url){var t=await fetch(e.raw_url);if(!t.ok)throw new Error("raw 拉取失败 HTTP "+t.status);return await t.text()}return e.content}function Bi(e){var t={"job.json":{content:JSON.stringify({ver:1,jobId:e.id,prefs:e.prefs,createdAt:e.createdAt},null,1)},"status.json":{content:JSON.stringify({status:"queued",stage:"",msg:"已排队，等待执行器接单",progress:0,updatedAt:ee()},null,1)}};if(e._source&&(t["source.json"]={content:e._source}),e._pdf&&e._pdf.data&&e._pdf.data.length){var n=ks(e._pdf.data);if(n.length>100*1024*1024)throw new Error("试卷文件过大（base64 后 "+Math.round(n.length/1048576)+"MB > 100MB Gist 上限）");t["source.pdf.b64"]={content:n}}return t}function ks(e){if(typeof Buffer<"u"&&e&&typeof e!="string")try{return Buffer.from(e).toString("base64")}catch{}var t=e instanceof Uint8Array?e:null;if(!t&&typeof e=="object"&&typeof e.length=="number"&&(t=e),!t)return"";for(var n=32768,r=[],s=0;s<t.length;s+=n)r.push(String.fromCharCode.apply(null,t.subarray?t.subarray(s,s+n):Array.prototype.slice.call(t,s,s+n)));return btoa(r.join(""))}async function Vn(e,t){var n=kt();if(!n)return!1;var r=await bs();if(!r)throw new Error("无法确定仓库归属（令牌无效？），请重新保存令牌");var s=await fetch("https://api.github.com/repos/"+r+"/"+oe+"/actions/workflows/"+gs+"/dispatches",{method:"POST",headers:{Authorization:"Bearer "+n,Accept:"application/vnd.github+json","Content-Type":"application/json"},body:JSON.stringify({ref:"main",inputs:{gist_id:e,resource_gist_id:t||""}})});if(s.status===204)return!0;throw s.status===401||s.status===403?new Error("执行器令牌无效或缺 workflow 权限（HTTP "+s.status+"）"):s.status===404?new Error("执行器尚未安装（仓库 "+r+"/"+oe+" 里没有 ai-exam.yml），先跑安装器"):new Error("触发失败 HTTP "+s.status)}function Np(e){return typeof btoa=="function"?btoa(unescape(encodeURIComponent(e))):Buffer.from(e,"utf8").toString("base64")}async function Lp(e){if(!window.CLOUDJOB_ASSETS||!window.CLOUDJOB_ASSETS.yml)throw new Error("安装包未随本页构建打入（请用最新构建的页面，或回退手动运行 tools/install_cloudjob.py）");var t=kt();if(!t)throw new Error("先在下方粘贴并保存 GitHub PAT（需 workflow + repo 权限），再点一键安装");e&&e("⏳ 校验令牌…");var n=await fetch("https://api.github.com/user",{headers:{Authorization:"Bearer "+t,Accept:"application/vnd.github+json"}});if(n.status===401)throw new Error("令牌无效（HTTP 401），请重新生成 PAT");var r=n.headers.get("X-OAuth-Scopes")||"";if(r.indexOf("workflow")<0)throw new Error("该令牌缺 workflow 权限（scope: "+(r||"无")+"）。请到 GitHub → Settings → Developer settings → PAT 勾选 workflow 后重新生成");var s=await n.json(),o=Di(s&&s.login);if(!o)throw new Error("令牌未返回用户名，无法确定仓库归属");var i={Authorization:"Bearer "+t,Accept:"application/vnd.github+json","Content-Type":"application/json"};function a(u){return new Promise(function(f){setTimeout(f,u)})}async function c(){e&&e("🔎 检查仓库 "+o+"/"+oe+"…");var u=await fetch("https://api.github.com/repos/"+o+"/"+oe,{headers:i});if(u.status!==200){if(u.status!==404)throw new Error("检查仓库失败 HTTP "+u.status+"（令牌可能缺 repo 权限）");e&&e("🆕 首次使用：正在你名下创建私有仓库 "+oe+"…");var f=await fetch("https://api.github.com/user/repos",{method:"POST",headers:i,body:JSON.stringify({name:oe,private:!0,auto_init:!0,description:"26考研全能作战系统 · 云端出卷执行器仓库（工具自动创建）"})});if(f.status!==201&&f.status!==202)throw f.status===403?new Error("创建仓库被拒（HTTP 403）：fine-grained PAT 需勾选创建用户仓库的权限，或改用 classic PAT 勾选 repo"):new Error("创建仓库失败 HTTP "+f.status);for(var d=0;d<6;d++){await a(1500);var m=await fetch("https://api.github.com/repos/"+o+"/"+oe+"/contents/README.md?ref=main",{headers:i});if(m.status===200)return}}}await c();async function l(u,f,d){for(var m=0;;m++){var p=null;try{var y=await fetch("https://api.github.com/repos/"+o+"/"+oe+"/contents/"+u+"?ref=main",{headers:i});if(y.status===200){var h=await y.json();p=h.sha}}catch{}e&&e((p?"⬆️ 更新 ":"🆕 新建 ")+u+(m>0?"（第 "+m+" 次重试）":"")+" …");var g=await fetch("https://api.github.com/repos/"+o+"/"+oe+"/contents/"+u,{method:"PUT",headers:i,body:JSON.stringify({message:d,content:Np(f),branch:"main",sha:p})});if(g.status===200||g.status===201)return;if((g.status===409||g.status>=500)&&m<4){await a(1500*(m+1));continue}throw new Error(u+" 上传失败 HTTP "+g.status+(g.status===404?"（仓库或 main 分支未就绪，稍后重试）":g.status===409?"（分支持续冲突，稍后再试）":""))}}return await l(".github/workflows/ai-exam.yml",window.CLOUDJOB_ASSETS.yml,"ci: install cloud exam runner (workflow)"),await l("tools/cloud/ai-exam-runner.cjs",window.CLOUDJOB_ASSETS.runner,"ci: install cloud exam runner (script)"),e&&e("✅ 执行器已上线（"+o+"/"+oe+"）"),!0}function fn(){try{for(var e=window.Store.get().ai||{},t=e.apis||[],n=null,r=0;r<t.length;r++)if(t[r].id===e.activeApi){n=t[r];break}if(n=n||(e.endpoint?e:null),n&&n.endpoint&&n.key&&n.model)return{endpoint:n.endpoint,key:n.key,model:n.model}}catch{}return null}function qi(e){var t=/RUNNER_VER\s*=\s*'v(\d+)'/.exec(String(e||""));return t?"v"+t[1]:""}function Xt(e){var t=/^v(\d+)$/.exec(String(e||""));return t?parseInt(t[1],10):0}function Ct(){try{return qi(window.CLOUDJOB_ASSETS&&window.CLOUDJOB_ASSETS.runner||"")}catch{return""}}async function Ri(){var e=kt();if(!e)return{ok:!1,fresh:!1,ver:""};var t=await Kn();if(!t)return{ok:!1,fresh:!1,ver:""};var n={Authorization:"Bearer "+e,Accept:"application/vnd.github+json"},r=!1,s="";try{var o=await fetch("https://api.github.com/repos/"+t+"/"+oe+"/contents/.github/workflows/"+gs+"?ref=main",{headers:n});if(r=o.status===200,r)try{var i=await o.json();if(i&&i.content){var a=String(i.content).replace(/\s+/g,"");try{s=decodeURIComponent(escape(atob(a)))}catch{try{s=atob(a)}catch{s=""}}}}catch{s=""}}catch{return{ok:!1,fresh:!1,ver:""}}if(!r)return{ok:!1,fresh:!1,ver:""};var c=!1,l="";try{var u=await fetch("https://api.github.com/repos/"+t+"/"+oe+"/contents/tools/cloud/ai-exam-runner.cjs?ref=main",{headers:n});if(u.status===200){var f=await u.json(),d="";if(f&&f.content){var a=String(f.content).replace(/\s+/g,"");try{d=decodeURIComponent(escape(atob(a)))}catch{try{d=atob(a)}catch{d=""}}}l=qi(d);var m=Xt(l)>0&&Xt(l)>=Xt(Ct());c=m||/partial\.json/.test(d)&&/function flushPartial/.test(d)&&/TOOLS:python/.test(d)&&/闭环工作/.test(d)&&/x-ratelimit-remaining/.test(d)}}catch{}return{ok:!0,fresh:c,ver:l,workflowYml:s}}function Ji(){return!!fn()}async function Dp(e){if(!ws())return{ok:!1,msg:"还没保存执行器令牌（先完成第①步）"};var t=await $i(Object.assign({check:!0},{}));Je(t.id,{title:"🧪 配置自检 · "+ee().slice(5,16).replace("T"," ")});try{for(var n=0;n<80;n++){await new Promise(function(c){setTimeout(c,3e3)});var r=null;try{r=await xs(t.id)}catch{}var s=r&&(r.status==="done"||r.status==="error"||r.status==="canceled");if(e&&e(n+1,r||{status:"unknown"}),s){if(r.status==="done")try{var o=(await Lt(t.gistId)).data,i=await wt(o.files&&o.files["result.json"]),a=JSON.parse(i);return a&&a.cloudJobCheck?{ok:!0,aiConfigPresent:!!a.aiConfigPresent,msg:r.stageMsg||"自检通过"}:{ok:!1,msg:"自检任务完成但未返回校验标记（执行器可能是旧版，点「一键安装」更新）"}}catch(c){return{ok:!1,msg:"读自检结果失败："+(c.message||c)}}return{ok:!1,msg:"自检失败："+(r.error||r.stageMsg||r.status)}}}return{ok:!1,msg:"自检超时（240s 未完成）。排查：① 执行器是否已装 ② secret 是否配对 ③ Actions 是否被禁用（仓库 Settings→Actions→Actions permissions 勾 Allow）。注：secret 是否存在已可即时探测，此处超时多半是 Actions 未跑起来"}}finally{try{Li(t.id)}catch{}}}async function Bp(){var e=kt();if(!e)return!1;var t=await Kn();if(!t)return!1;try{var n=await fetch("https://api.github.com/repos/"+t+"/"+oe+"/actions/secrets",{headers:{Authorization:"Bearer "+e,Accept:"application/vnd.github+json"}});if(n.status!==200)return!1;var r=await n.json(),s=(r&&r.secrets||[]).map(function(o){return o&&o.name});return s.indexOf("CLOUDJOB_GH_TOKEN")>=0}catch{return!1}}async function qp(){if(Jp())return!0;var e=await Bp();return e&&Ui(),e}var $t=null,Rp=300*1e3;async function Hi(e){if(!e&&$t&&Date.now()-$t.at<Rp)return $t.data;var t=ws(),n=t?await Kn():"",r=t?await Ri():{ok:!1,fresh:!1},s=!!(r&&r.ok),o=n?"https://github.com/"+n+"/"+oe:"https://github.com",i={token:t,repoOwner:n,repoName:oe,runner:s,runnerFresh:!!(r&&r.fresh),runnerVerLocal:Ct(),runnerVerRemote:r&&r.ver||"",workflowAssetSupported:!!(r&&r.workflowYml&&/resource_gist_id/.test(r.workflowYml)),ai:Ji(),secret:await qp(),runnerUrl:o+"/actions",secretsUrl:n?o+"/settings/secrets/actions":""};return $t={at:Date.now(),data:i},i}var Ge=-1;function Gi(){var e=Fn();return(e||"")+"/"+oe}function zi(){if(!(Ge>=0)){Ge=0;var e=Gi();try{var t=window.Store.get(),n=t.cloudJob&&t.cloudJob.secretCheckedTs>0&&t.cloudJob.secretCheckedRepo===e?t.cloudJob.secretCheckedTs:0,r=0;try{var s=localStorage.getItem(Ni);if(s&&s.charAt(0)==="{"){var o=JSON.parse(s);o&&o.ts>0&&o.repo===e&&(r=o.ts)}}catch{}Ge=Math.max(n,r),Ge>0&&Ge>n&&window.Store.update(function(i){i.cloudJob=i.cloudJob||{secretCheckedTs:0},i.cloudJob.secretCheckedTs=Ge,i.cloudJob.secretCheckedRepo=e})}catch{}}}function Jp(){return zi(),Ge>0}function Ui(){zi(),Ge=Date.now();var e=Gi();try{localStorage.setItem(Ni,JSON.stringify({ts:Ge,repo:e}))}catch{}window.Store.update(function(t){t.cloudJob=t.cloudJob||{secretCheckedTs:0},t.cloudJob.secretCheckedTs=Ge,t.cloudJob.secretCheckedRepo=e})}function Ss(e){if(!e||typeof e!="object")return"result 不是对象";if(!Array.isArray(e.questions)||!e.questions.length)return"questions 为空";for(var t=0;t<e.questions.length;t++){var n=e.questions[t];if(!n||!n.stem)return"第"+(t+1)+"题缺题干";if(n.answer==null||n.answer==="")return"第"+(t+1)+"题缺答案";if(n.type==="choice"){if(!Array.isArray(n.options)||n.options.length<2)return"第"+(t+1)+"题选择题缺选项";var r=String(n.answer).trim().charAt(0).toUpperCase(),s=n.options.map(function(o){return String(o||"").trim().charAt(0).toUpperCase()});if(s.indexOf(r)<0)return"第"+(t+1)+"题答案不在选项中"}}return""}function ao(e){if(!e||typeof e!="object")return"内容不是对象";if(!Array.isArray(e.questions)||!e.questions.length)return"没有可抢救的题目";for(var t=0;t<e.questions.length;t++){var n=e.questions[t];if(!n||!n.stem)return"第"+(t+1)+"题缺题干";if(n.answer==null||n.answer==="")return"第"+(t+1)+"题缺答案";if(n.type==="choice"&&(!Array.isArray(n.options)||n.options.length<2))return"第"+(t+1)+"题选择题缺选项"}return""}function bt(e){if(!e||typeof e!="object")return"导入结果不是对象";if(!Array.isArray(e.questions)||!e.questions.length)return"未识别出任何题目（可能是纯图片无文字层，或文件损坏）";for(var t=0;t<e.questions.length;t++){var n=e.questions[t];if(!n||!n.stem||String(n.stem).trim().length<4)return"第"+(t+1)+"题缺题干";n.type==="choice"&&(!Array.isArray(n.options)||n.options.length<2)&&(n.type="solve")}return""}function mt(e,t,n){n=n||{};var r=be(e);t.id=t.id||(Be()&&Be().uid?Be().uid():e),t.title=t.title||(n.partial?"☁️ 云端押题卷（抢救）":"云端押题卷"),t.subject=t.subject||r&&r.prefs&&r.prefs.subject||"math",t.createdAt=t.createdAt||ee(),t.builtBy=t.builtBy||"cloud",t.cloudJobId=e,t.completedAt=null,t.score=null,t.duration=null,n.imported&&(t.imported=!0,t.needsReview=!0),n.partial&&(t.partial=!0,t.rescued=!0,t.unreviewed=!n.reviewed,t.timeLimit=t.timeLimit||120,t.totalScore=t.totalScore||(t.questions||[]).reduce(function(o,i){return o+(Number(i.score)||5)},0)),window.Store.update(function(o){o.sprintData=o.sprintData||{},o.sprintData.mockExams=o.sprintData.mockExams||[],o.sprintData.mockExams.some(function(i){return i.cloudJobId===e})||o.sprintData.mockExams.unshift(t)});var s={resultImported:!0,status:"done"};return!n.partial&&r&&Array.isArray(r.log)&&r.log.length>30&&(s.log=r.log.slice(-30)),Je(e,s),t}async function $i(e){Ce(),e=e||{};var t=Be()&&Be().uid?Be().uid():"cj"+Date.now()+Math.random().toString(16).slice(2,8),n={id:t,gistId:"",title:"☁️ 云端押题卷 · "+ee().slice(5,16).replace("T"," "),subject:e.subject||"auto",prefs:{subject:e.subject||"auto",diff:e.diff||"mix",count:e.count||"std",think:!!e.think,maxTokens:parseInt(e.maxTokens,10)||null,blueprint:e.blueprint||null,major:e.major||null,check:!!e.check,ai:fn()},status:"creating",stage:"",stageMsg:"",error:"",wfDispatched:!1,resultImported:!1,createdAt:ee(),submittedAt:ee(),doneAt:""};return Rn(n)}async function Hp(e){Ce(),e=e||{};var t=e.mother||{},n=Array.isArray(t.questions)?t.questions:[];if(!n.length)throw new Error("母卷没有题目，无法衍生子卷");var r=Xt(Ct());if(r>0&&r<13)throw new Error("本页面打包的执行器是 "+(Ct()||"旧版")+"，尚不支持子母卷（需 v13+）。请使用最新构建的页面，或先重新构建并点「🚀 一键安装」。");var s=e.blueprint&&e.blueprint.types&&e.blueprint.types.length?e.blueprint:null;if(!s){var o={};n.forEach(function(f){var d=(f.type||"solve")+"|"+(Number(f.score)||0);o[d]=(o[d]||0)+1}),s={name:"母卷卷型（自动反推）",subject:e.subject||"math",totalScore:Number(t.totalScore)||n.reduce(function(f,d){return f+(Number(d.score)||0)},0),timeLimit:Number(t.timeLimit)||180,types:Object.keys(o).map(function(f){var d=f.split("|");return{type:d[0],count:o[f],score:Number(d[1])||0}})}}var i={1:0,2:0,3:0,4:0,5:0},a={motherTitle:String(t.title||"母卷").slice(0,60),subject:e.subject||s.subject||"math",blueprint:s,questions:n.slice(0,60).map(function(f,d){var m=Math.min(5,Math.max(1,Math.floor(Number(f.star)||3)));return i[m]++,{no:d+1,type:f.type||"solve",score:Number(f.score)||0,star:m,topicName:String(f.topicName||"").slice(0,50),stemDigest:String(f.stem||"").replace(/\s+/g," ").slice(0,80)}}),starMix:(function(){var f=Math.min(n.length,60),d={};return Object.keys(i).forEach(function(m){d[m]=f?Math.round(i[m]/f*100):0}),d})()},c=JSON.stringify(a);if(c.length>400*1024)throw new Error("母卷指纹过大（"+Math.round(c.length/1024)+"KB > 400KB），无法上传");var l=Be()&&Be().uid?Be().uid():"cj"+Date.now()+Math.random().toString(16).slice(2,8),u={id:l,gistId:"",title:"🧬 子卷 · 仿「"+a.motherTitle.slice(0,14)+"」· "+ee().slice(5,16).replace("T"," "),subject:a.subject,prefs:{subject:a.subject,mode:"derive",diff:e.diff||"mix",count:e.count==="lite"||e.count==="full"?e.count:"std",think:!!e.think,maxTokens:parseInt(e.maxTokens,10)||null,blueprint:s,major:e.major||null,deriveNote:String(e.note||"").slice(0,200),motherTitle:a.motherTitle,motherId:e.motherId||null,ai:fn()},status:"creating",stage:"",stageMsg:"",error:"",wfDispatched:!1,resultImported:!1,isDerive:!0,createdAt:ee(),submittedAt:ee(),doneAt:"",_source:c};return Rn(u)}async function Gp(e){Ce();var t=Xt(Ct());if(t>0&&t<10)throw new Error("本页面打包的执行器是 "+(Ct()||"旧版")+"，尚不支持试卷导入（需 v10+）。请使用最新构建的页面，或先重新构建。");e=e||{};var n=e.data;if(n instanceof ArrayBuffer&&(n=new Uint8Array(n)),!n||!n.length)throw new Error("请先选择要导入的试卷文件");var r=(String(e.fileName||"").toLowerCase().match(/\.(\w+)$/)||[])[1]||"pdf";if(r!=="pdf"&&["png","jpg","jpeg","gif","webp"].indexOf(r)<0)throw new Error("不支持的文件类型：."+r+"（仅支持 PDF 与 png/jpg/jpeg/gif/webp 图片）");var s=Be()&&Be().uid?Be().uid():"cj"+Date.now()+Math.random().toString(16).slice(2,8),o={id:s,gistId:"",title:"📄 导入试卷 · "+String(e.fileName||"未命名").slice(0,14)+" · "+ee().slice(5,16).replace("T"," "),subject:e.subject||"math",prefs:{subject:e.subject||"math",mode:"import",think:!1,importKind:r==="pdf"?"pdf":"image",fileName:String(e.fileName||""),importTitle:String(e.title||"").slice(0,60)||null,importTimeLimit:parseInt(e.timeLimit,10)>0?parseInt(e.timeLimit,10):null,fillAnswers:e.fillAnswers!==!1,ai:fn()},status:"creating",stage:"",stageMsg:"",error:"",wfDispatched:!1,resultImported:!1,isImport:!0,srcSize:n.length,srcName:String(e.fileName||""),createdAt:ee(),submittedAt:ee(),doneAt:"",_pdf:{data:n}},i=null;try{i=await Hi()}catch{i=null}var a=!!(i&&i.workflowAssetSupported);if(a){var c={},l=ks(n);if(l.length>100*1024*1024)throw new Error("试卷文件过大（base64 后 "+Math.round(l.length/1048576)+"MB > 100MB Gist 上限）");c["source.pdf.b64"]={content:l};var u={description:"[kaoyan2026] exam-import-asset "+s+" "+(e.fileName||""),public:!1,files:c},f=typeof AbortController<"u"?new AbortController:null,d=typeof(e&&e.onProgress)=="function"?e.onProgress:null,m=0,p=0,y=0,h=-1;try{var g=await _e.gistUpload("/gists",u,function(S,_,T){m=S,p=_,y=T,d&&(S===100||S-h>=5)&&(h=S,d(S,_,T,e.fileName||""))},f&&f.signal);if(!g.data||!g.data.id)throw new Error("资源 Gist 创建失败（无法上传试卷源文件）");var v=g.data.id;return o._pdf=null,d&&(d(100,p,y,e.fileName||""),d("stage","🔗 已上传源文件，正在初始化任务…")),Rn(o,{assetGistId:v}).then(function(S){return S._pdf=null,d&&d("stage","✅ 任务已派发，等待云端执行器响应…"),S})}catch(S){throw f&&f.signal.aborted?new Error("上传已取消（已传 "+m+"%）"):S}}return Rn(o).then(function(S){return delete S._pdf,S})}async function Rn(e,t){t=t||{};var n=Bi(e),r=await _e.gistReq("/gists",{method:"POST",body:{description:"[kaoyan2026] "+(e.isImport?"exam-import":"cloud-exam-job")+" "+e.id,public:!1,files:n}});if(!r.data||!r.data.id)throw new Error("创建任务 Gist 失败");e.gistId=r.data.id,t.assetGistId&&(e.assetGistId=t.assetGistId);var s=Object.assign({},e);delete s._pdf,window.Store.update(function(i){i.cloudJobs=i.cloudJobs||[],i.cloudJobs.unshift(s),Fi(i.cloudJobs)});try{var o=await Vn(e.gistId,t.assetGistId);Je(e.id,{status:o?"dispatched":"queued",wfDispatched:!!o,stageMsg:o?"已触发云端执行器，排队启动中…":"已排队（执行器未接入，装好后点「重发」即跑）"})}catch(i){if(t.assetGistId)try{await _e.gistReq("/gists/"+t.assetGistId,{method:"DELETE"})}catch{}throw Je(e.id,{status:"error",error:i&&i.message||String(i),stageMsg:"触发失败"}),i}return be(e.id)}async function zp(e,t){Ce();var n=be(e);if(!n||!n.gistId)throw new Error("任务不存在");var r=parseInt(t,10)||n.qs&&n.qs.length||0;if(!r)throw new Error("无法确定目标题量（任务没有蓝图记录），请重新出卷");var s=n.partialCount||n.savedCount||0;if(s>=r)throw new Error("题量已满足（"+s+"/"+r+"），无需续跑；可点「抢救已出题目」直接收卷");await _e.gistReq("/gists/"+n.gistId,{method:"PATCH",body:{files:{"job.json":{content:JSON.stringify({ver:1,jobId:n.id,prefs:n.prefs,createdAt:n.createdAt,resume:{target:r,timeLimit:((n.prefs||{}).blueprint||{}).timeLimit||120,from:"partial.json",have:s}},null,1)},"status.json":{content:JSON.stringify({status:"queued",stage:"",msg:"已排队（续跑：补齐剩余 "+(r-s)+" 题）",progress:0,updatedAt:ee()},null,1)}}}});var o=!1;try{o=await Vn(n.gistId)}catch(i){throw Je(e,{status:"error",error:i&&i.message||String(i),stageMsg:"续跑触发失败"}),i}return Je(e,{status:o?"dispatched":"queued",wfDispatched:!!o,resultImported:!1,error:"",doneAt:"",resumed:!0,resumeTarget:r,resumeHave:s,stage:"",stageMsg:o?"▶️ 续跑已触发：已有 "+s+" 题，补齐至 "+r+" 题":"续跑已排队（执行器未接入，装好后点「重发」即跑）"}),be(e)}async function Up(e){Ce();var t=be(e);if(!t||!t.gistId)throw new Error("任务不存在");try{var n=await Lt(t.gistId),r=await wt(n.files&&n.files["log.json"]);if(r){var s=null;try{s=JSON.parse(r)}catch{}if(s&&Array.isArray(s.entries)&&s.entries.length)return s}}catch{}return{entries:t.log||[],error:t.error||null,runnerVer:"",at:"",fallback:!0}}function Fi(e){for(var t={done:1,error:1,canceled:1},n=e.filter(function(o){return t[o.status]});e.length>Cp&&n.length;){var r=n.shift(),s=e.indexOf(r);s>=0&&e.splice(s,1)}}async function xs(e){Ce();var t=be(e);if(!t||!t.gistId)throw new Error("任务不存在");var n=await Lt(t.gistId,io[t.gistId]);if(n.status===304)return t;n.etag&&(io[t.gistId]=n.etag);var r=n.data,s=await wt(r.files&&r.files["status.json"]),o=null;try{o=JSON.parse(s)}catch{}if(!o)throw new Error("status.json 解析失败");var i={status:o.status||"running",stage:o.stage||"",stageMsg:o.msg||"",updatedAtRemote:o.updatedAt||"",progress:typeof o.progress=="number"?o.progress:null,log:Array.isArray(o.log)?o.log:null,qs:Array.isArray(o.qs)?o.qs:null,partialSaved:!!o.partialSaved,partialCount:typeof o.partialCount=="number"?o.partialCount:null,savedCount:typeof o.savedCount=="number"?o.savedCount:null};return o.status==="done"&&(i.doneAt=o.updatedAt||ee()),o.status==="error"&&(i.error=o.msg||"云端执行失败"),t.updatedAtRemote===i.updatedAtRemote&&t.status===i.status?t:(Je(e,i),be(e))}async function $p(e){var t=vs().filter(function(s){return s.status!=="done"&&s.status!=="error"&&s.status!=="canceled"}),n=await Promise.all(t.map(function(s){return xs(s.id).then(function(){return null}).catch(function(o){return o})})),r=n.filter(Boolean);return r.length&&!(e&&e.silent)&&console.warn("[CloudJob] 刷新失败",r),r}async function Fp(e){Ce();var t=be(e);if(!t)throw new Error("任务不存在");if(t.resultImported)throw new Error("该任务成果已导入过（去押题卷列表找）");var n=(await Lt(t.gistId)).data,r=await wt(n.files&&n.files["result.json"]);if(!r)throw new Error("result.json 还没生成（云端可能仍在写或失败）");var s=null;try{s=JSON.parse(r)}catch{throw new Error("result.json 不是合法 JSON")}if(s&&s.cloudJobPending)throw new Error("成品还没生成（云端可能仍在执行或失败，先刷新状态看看）");if(s&&(s.imported||s.builtBy==="pdf-import")){var o=bt(s);if(o)throw new Error("导入卷校验未通过："+o);return s.imported=!0,mt(e,s,{imported:!0})}var i=Ss(s);if(i)throw new Error("成品校验未通过："+i);return mt(e,s,{partial:!1})}async function Kp(e){Ce();var t=be(e);if(!t)throw new Error("任务不存在");if(t.resultImported)throw new Error("该任务成果已导入过（去押题卷列表找）");var n=(await Lt(t.gistId)).data,r=await wt(n.files&&n.files["result.json"]);if(!r)throw new Error("识别结果还没生成（云端可能仍在执行或失败，先刷新状态看看）");var s=null;try{s=JSON.parse(r)}catch{throw new Error("result.json 不是合法 JSON")}if(s&&s.cloudJobPending)throw new Error("识别还没完成（云端可能仍在执行，先刷新状态看看）");if(!(s.imported||s.builtBy==="pdf-import"))throw new Error("云端返回的不是导入识别结果（执行器可能是 v9 旧版）——请到配置向导点「🚀 一键安装」升级到 v10 后点「♻️ 重发」重跑本任务");var o=bt(s);if(o)throw new Error("导入卷校验未通过："+o);return s.imported=!0,s}async function Vp(e,t){Ce();var n=be(e);if(n&&n.resultImported)throw new Error("该任务成果已导入过（去押题卷列表找）");if(!t||!Array.isArray(t.questions)||!t.questions.length)throw new Error("没有可导入的题目（全部被删？）");var r=bt(t);if(r)throw new Error("修订后仍有题目不完整："+r);return t.imported=!0,mt(e,t,{imported:!0})}async function Qp(e){Ce();var t=be(e);if(!t)throw new Error("任务不存在");if(t.resultImported)throw new Error("该任务成果已导入过（去押题卷列表找）");var n=(await Lt(t.gistId)).data,r=n&&n.files||{},s=await wt(r["result.json"]);if(s){var o=null;try{o=JSON.parse(s)}catch{o=null}if(o&&(o.imported||o.builtBy==="pdf-import")&&Array.isArray(o.questions)&&o.questions.length&&!bt(o))return o.imported=!0,mt(e,o,{imported:!0});if(o&&!o.cloudJobPending&&Array.isArray(o.questions)&&o.questions.length&&!ao(o))return mt(e,o,{partial:!o.chiefReview,reviewed:!!o.chiefReview})}var i=await wt(r["partial.json"]);if(!i)throw new Error("云端没落盘任何题目（执行器在第一题出完前就失败了/或用的是旧版执行器）。旧版执行器不落盘，需在「🛠 配置向导」点一次「🚀 一键安装」升级后再出卷。");var a=null;try{a=JSON.parse(i)}catch{throw new Error("partial.json 不是合法 JSON")}if(!a||!Array.isArray(a.questions)||!a.questions.length)throw new Error("云端已落盘 0 题（partial.json 为空）——执行器一道题都没出成功。");if(a.imported){var c=bt({questions:a.questions});if(c)throw new Error("导入抢救卷校验未通过："+c);var l={title:"📄 导入试卷（抢救 · "+a.questions.length+" 题）",subject:a.subject||t.prefs&&t.prefs.subject||"math",timeLimit:120,totalScore:a.questions.reduce(function(d,m){return d+(Number(m.score)||5)},0),questions:a.questions,imported:!0,builtBy:"pdf-import",generatedAt:a.updatedAt||ee()};return mt(e,l,{imported:!0})}var u=ao(a);if(u)throw new Error("抢救卷校验未通过："+u);var f={title:"☁️ 云端押题卷（抢救 · "+a.questions.length+" 题）",subject:a.subject||t.prefs&&t.prefs.subject||"math",timeLimit:120,totalScore:a.questions.reduce(function(d,m){return d+(Number(m.score)||5)},0),questions:a.questions,builtBy:"cloud-rescue",generatedAt:a.updatedAt||ee()};return mt(e,f,{partial:!0,reviewed:!!a.reviewed})}async function Yp(e,t){Ce(),t=t||{};var n=be(e);if(!n||!n.gistId)throw new Error("任务不存在");if(n.status==="done")throw new Error("任务已完成，无需取消");var r={"cancel.json":{content:JSON.stringify({canceled:!0,savePartial:t.savePartial!==!1,at:ee()})},"status.json":{content:JSON.stringify({status:"canceled",stage:"",msg:t.savePartial!==!1?"⏹ 正在停止，已出题目尝试保存…":"⏹ 已停止",progress:0,updatedAt:ee()})}};await _e.gistReq("/gists/"+n.gistId,{method:"PATCH",body:{files:r}}),Je(e,{status:"canceled",stageMsg:"已停止"+(t.savePartial!==!1?"（云端整理已出题目中…）":"")})}async function Wp(e){Ce();var t=be(e);if(!t||!t.gistId)throw new Error("任务不存在");await _e.gistReq("/gists/"+t.gistId,{method:"PATCH",body:{files:{"status.json":{content:JSON.stringify({status:"queued",stage:"",msg:"重新入队",progress:0,updatedAt:ee()})},"result.json":{content:JSON.stringify({cloudJobPending:!0})},"cancel.json":{content:JSON.stringify({canceled:!1,at:ee()})}}}}),Je(e,{status:"dispatching",error:"",resultImported:!1,retryAt:ee()});try{var n=await Vn(t.gistId);Je(e,{status:n?"dispatched":"queued",wfDispatched:!!n,stageMsg:n?"已重新触发执行器":"已排队（执行器未接入）"})}catch(r){throw Je(e,{status:"error",error:r&&r.message||String(r)}),r}return be(e)}async function Xp(e){Ce();var t=be(e);if(t&&t.gistId)try{await _e.gistReq("/gists/"+t.gistId,{method:"DELETE"})}catch(n){if(n.status!==404)throw n}if(t&&t.assetGistId)try{await _e.gistReq("/gists/"+t.assetGistId,{method:"DELETE"})}catch(n){n.status}Li(e)}var Jn={planning:"🧠 总工规划中",generating:"⚙️ 并发出题中",validating:"📐 蓝本校验中",reviewing:"🔍 总审查中",rewriting:"🔧 定向重写中",finalizing:"✅ 终检打包中",parsing:"🧾 解析试卷中",extracting:"🔎 AI 拆题识别中"},Zp=["planning","generating","reviewing","rewriting","finalizing"],Qn={creating:{label:"创建中",cls:"#8c8c8c"},queued:{label:"已排队",cls:"#d46b08"},dispatched:{label:"已派发",cls:"#096dd9"},running:{label:"执行中",cls:"#722ed1"},done:{label:"✅ 完成",cls:"#237804"},error:{label:"🔴 失败",cls:"#cf1322"},canceled:{label:"已取消",cls:"#8c8c8c"}};function Ki(e){if(e.stage&&Jn[e.stage])return Jn[e.stage];var t=Qn[e.status]||{label:e.status||"?"};return t.label}function Vi(e){var t=Qn[e.status];return t?t.cls:"#8c8c8c"}const eh={submit:$i,submitImport:Gp,submitDerive:Hp,refresh:xs,refreshAll:$p,collectResult:Fp,collectPartial:Qp,collectImportPreview:Kp,confirmImportExam:Vp,cancel:Yp,retry:Wp,remove:Xp,resumeJob:zp,fetchLog:Up,installRunner:Lp,getSetup:Hi,runCheck:Dp,markSecretChecked:Ui,aiReady:Ji,aiConfig:fn,list:vs,find:be,getToken:kt,setToken:Pp,hasToken:ws,repoOwner:Fn,resolveOwner:bs,resolveOwnerSafe:Kn,repoFull:jp,dispatch:Vn,runnerInstalled:Ri,REPO_NAME:oe,WF_FILE:gs,STAGE_CN:Jn,STAGE_ORDER:Zp,STATUS_META:Qn,stageLabel:Ki,statusColor:Vi,validateResultExam:Ss,validateImportedExam:bt};typeof module<"u"&&module.exports&&(module.exports={_pure:{validateResultExam:Ss,validateImportedExam:bt,gistFiles:Bi,u8ToB64:ks,stageLabel:Ki,statusColor:Vi,trimJobs:Fi,STATUS_META:Qn,STAGE_CN:Jn}});const _s={ensurePermission(){if(!("Notification"in window))return!1;if(Notification.permission==="default")try{Notification.requestPermission()}catch{}return Notification.permission==="granted"},send(e,t){if(_s.ensurePermission())try{new Notification(e,{body:t});return}catch{}z.show("🔔 "+e+"："+t,"info",5e3)}},jr=30,th=700;function Ae(){const e=w.get();return e.aiMemory||(e.aiMemory={profile:"",facts:[],reflectCount:0,updatedAt:""}),e.aiMemory.facts||(e.aiMemory.facts=[]),e.aiMemory}function Pt(e){return(e||"").replace(/\s+/g,"").slice(0,60)}function co(e){return(e.pinned?1e4:0)+(e.hits||1)*10+Math.min(9,Math.floor((Date.now()-new Date(e.updatedAt||e.createdAt).getTime())/x.DAY_MS)*-1)}function Yn(e){return e.slice().sort(function(t,n){return co(n)-co(t)})}function nh(e){if(e.facts.length<=jr)return;const n=Yn(e.facts).slice(0,jr),r={};n.forEach(function(s){r[s.id]=!0}),e.facts=e.facts.filter(function(s){return r[s.id]})}function As(e,t,n,r){if(e=(e||"").trim(),!e||e.length<4)return null;e.length>80&&(e=e.slice(0,80));const s=new Date().toISOString();let o=null;return w.update(function(i){const a=Ae(),c=Pt(e);for(let u=0;u<a.facts.length;u++){const f=a.facts[u];if(r&&f.sigKey===r||Pt(f.text)===c){f.text=e,f.hits=(f.hits||1)+1,f.updatedAt=s,t&&(f.kind=t),o=f,a.updatedAt=s;return}}const l={id:x.uid(),text:e,kind:t||"context",hits:1,createdAt:s,updatedAt:s,pinned:!1,source:n||"ai"};r&&(l.sigKey=r),a.facts.push(l),nh(a),a.updatedAt=s,o=l}),o}function Qi(e){const t=Pt(e);if(!t)return!1;let n=!1;return w.update(function(r){const s=Ae();s.facts.forEach(function(o){(Pt(o.text)===t||o.text.indexOf(t.slice(0,12))>=0)&&(o.hits=(o.hits||1)+1,o.updatedAt=new Date().toISOString(),n=!0)}),n&&(s.updatedAt=new Date().toISOString())}),n}function rh(e){w.update(function(t){const n=Ae();n.facts=n.facts.filter(function(r){return r.id!==e}),n.updatedAt=new Date().toISOString()})}function sh(e){w.update(function(t){Ae().facts.forEach(function(r){r.id===e&&(r.pinned=!r.pinned)})})}function Yi(e){w.update(function(t){const n=Ae();n.profile=(e||"").slice(0,400),n.updatedAt=new Date().toISOString()})}function oh(e){e=e||th;const t=Ae();let n="";t.profile&&(n+="【考生画像】"+t.profile+`
`);const r=Yn(t.facts);let s=n.length;const o=[];for(let i=0;i<r.length;i++){const a="- "+r[i].text;if(s+a.length+1>e)break;o.push(a),s+=a.length+1}return o.length&&(n+=`【关于考生的记忆】
`+o.join(`
`)+`
请在回复中体现你对他的了解，但不要机械复述记忆条目。`),n.trim()}function ih(){try{const e=w.get(),t=w.mistakeCountWeek("sign");je("sig-sign",t>=3?"近期符号错误频发（本周"+t+"次），做题需强制验算":null,"weakness");const n=w.weekTopMistakes(),r={sign:"符号错误",fraction:"分式处理",integral:"积分",concept:"概念不清",careless:"粗心",other:"其他"};je("sig-toperr",n&&n.length&&n[0].count>=2?"本周主要错误类型是「"+(r[n[0].key]||n[0].key)+"」（"+n[0].count+"次）":null,"weakness");const s=w.currentMathAccuracy();je("sig-acc",s!=null&&s<70?"当前数学正确率仅"+s+"%，低于安全线70%":null,"weakness");const o=w.weekHours();if(o.filter(function(d){return d>0}).length>=2){const d=x.round1(x.sum(o)/7),m=(e.settings.weeklyTargetHours||50)/7;je("sig-pace",d<m*.7?"本周日均学习"+d+"h，明显低于目标"+x.round1(m)+"h":null,"habit")}w.subjectDoneInDays("math",3)?Ft("sig-idle-math"):je("sig-idle-math","已连续3天没有完成数学任务","habit"),w.subjectDoneInDays("ctrl",3)?Ft("sig-idle-ctrl"):je("sig-idle-ctrl","已连续3天没有碰专业课","habit");const a=(e.mental||[]).slice(-3);a.length>=3&&a.every(function(d){return d.mood<=5})?je("sig-mood","近3天心情持续偏低（≤5分），需要关注状态","habit"):Ft("sig-mood"),e.weaknessProfile&&e.weaknessProfile.weakAreas&&e.weaknessProfile.weakAreas.length?je("sig-weakareas","拍题暴露的薄弱点："+e.weaknessProfile.weakAreas.slice(0,3).join("、"),"weakness"):Ft("sig-weakareas");const c=ch();let l=null,u=0;Object.keys(c).forEach(function(d){c[d]>u&&(u=c[d],l=d)}),je("sig-strength",u>=3?"本周在"+(ah[l]||l)+"上投入最多（完成"+u+"项任务）":null,"habit");const f=w.studyStreak();je("sig-streak",f>=3?"已连续学习"+f+"天，节奏稳定":null,"habit")}catch{}}function je(e,t,n){if(!t){Ft(e);return}As(t,n,"system",e)}function Ft(e){w.update(function(t){const n=Ae();n.facts=n.facts.filter(function(r){return r.sigKey!==e})})}const ah={math:"数学",ctrl:"专业课",eng:"英语",pol:"政治"};function ch(){const e=w.get(),t={math:0,ctrl:0,eng:0,pol:0};return x.weekKeys().forEach(function(n){if(n===x.dkey()){const r=e.completions[n]||[];e.tasks.forEach(function(s){t[s.subject]!=null&&(s.done||r.indexOf(s.id)>=0)&&t[s.subject]++})}else(e.taskArchive[n]||[]).forEach(function(r){t[r.subject]!=null&&r.done&&t[r.subject]++})}),t}function Ts(){try{const e=w.get(),t=x.dkey();let n=0;(e.polRecite||[]).forEach(function(s){s.due&&s.due<=t&&n++}),(e.vocab||[]).forEach(function(s){s.due&&s.due<=t&&n++});const r=e.reading&&e.reading.cards||{};return Object.keys(r).forEach(function(s){r[s].due&&r[s].due<=t&&n++}),n}catch{return 0}}function lh(e){e=e||{};const t=e.exclude||[];try{let n=function(f,d,m,p,y){o||!d||t.indexOf(f)>=0||(o={key:f,tab:p,preset:m,action:{type:"goto",tab:p,label:y}})};const r=w.get(),s=w.studyStreak()>0||Object.keys(r.completions||{}).length>0||r.tasks&&r.tasks.length>0;let o=null;s&&(n("idle-math",!w.subjectDoneInDays("math",3),"已经三天没碰数学了。今天必须补上，先两道真题找手感，别再拖。","scheduler","→ 现在去补数学"),n("idle-ctrl",!o&&!w.subjectDoneInDays("ctrl",3),"专业课冷了三天。核心考点最忌断档，今天固定一小时把它捡回来。","scheduler","→ 去捡专业课"));const i=Ts();n("due-backlog",i>=8,"你有 "+i+" 项复习到期了。记忆不复习就是白学，先清一批到期的。","dashboard","→ 去清到期复习");const a=w.currentMathAccuracy();n("low-acc",a!=null&&a<70,"数学正确率还在 "+a+"%，低于安全线。别刷新题，回头把错题按类型吃透。","mistakes","→ 去吃透错题");const c=(r.mental||[]).slice(-3);n("low-mood",c.length>=3&&c.every(function(f){return f.mood<=5}),"连着几天状态都不高。别硬扛，把今天目标砍到能完成，稳住比冲刺重要。","mental","→ 去记录状态");const l=w.weekHours();if(l.filter(function(f){return f>0}).length>=2){const f=x.round1(x.sum(l)/7),d=(r.settings.weeklyTargetHours||50)/7;n("slow-pace",f<d*.7,"本周日均才 "+f+" 小时，离目标差一截。今天多挤一个番茄钟出来。","focus","→ 去挤一个番茄钟")}if(new Date().getHours()>=18){const f=w.todayTaskStats();let d=0,m=0;Object.keys(f).forEach(function(p){d+=f[p][0],m+=f[p][1]}),n("late-undone",m>0&&d*2<m,"都这个点了今天任务还没过半。挑最重要的两件先干完，别让今天空过。","scheduler","→ 去挑两件干完")}return o}catch{return null}}const lo={"idle-math":"补数学","idle-ctrl":"捡专业课","due-backlog":"清到期复习","low-acc":"吃透错题","low-mood":"关注状态","slow-pace":"加时长","late-undone":"晚间清任务","ai-daily":"AI全智能建议"};function Es(){const e=w.get();return e.ai.superviseLog||(e.ai.superviseLog=[]),e.ai.superviseLog}function uh(e,t,n){w.update(function(r){for(r.ai.superviseLog||(r.ai.superviseLog=[]),r.ai.superviseLog.push({date:e,key:t,slot:n||"am",outcome:null});r.ai.superviseLog.length>14;)r.ai.superviseLog.shift();r.ai.lastSupervise={date:e,key:t,slot:n||"am"}})}function uo(e,t){const n=w.get();if(e===x.dkey()){const r=n.completions[e]||[];return n.tasks.some(function(s){return s.subject===t&&(s.done||r.indexOf(s.id)>=0)})}return(n.taskArchive[e]||[]).some(function(r){return r.subject===t&&r.done})}function dh(e){const t=w.get();if(e===x.dkey()){const r=w.todayTaskStats();let s=0,o=0;return Object.keys(r).forEach(function(i){s+=r[i][0],o+=r[i][1]}),o?s/o:null}const n=t.taskArchive[e]||[];return n.length?n.filter(function(r){return r.done}).length/n.length:null}function fh(){const e=Es();let t=null;for(let r=e.length-1;r>=0;r--)if(e[r].outcome==null&&e[r].date!==x.dkey()){t=e[r];break}if(!t)return null;let n=null;try{switch(t.key){case"idle-math":n=uo(t.date,"math");break;case"idle-ctrl":n=uo(t.date,"ctrl");break;case"due-backlog":n=Ts()<=4;break;case"low-acc":{const r=w.currentMathAccuracy();r!=null?n=r>=70:n=(w.get().quizHistory||[]).some(function(s){return x.isoDay(s.createdAt)>=t.date});break}case"low-mood":{const r=(w.get().mental||[]).slice(-1)[0];n=r?r.mood>=6:null;break}case"slow-pace":{const r=w.get().studyHours[t.date]||0;n=r>=4?!0:r>0?!1:null;break}case"late-undone":{const r=dh(t.date);n=r==null?null:r>=.5;break}default:{const r=w.get(),s=r.studyHours[t.date]||0,o=(r.completions[t.date]||[]).length,i=(r.mental||[]).some(function(a){return a.date===t.date});n=s>0||o>0||i?!0:null}}}catch{n=null}return n!=null&&(w.update(function(r){(r.ai.superviseLog||[]).forEach(function(s){s.date===t.date&&s.key===t.key&&s.slot===t.slot&&(s.outcome=n)})}),t.outcome=n,n===!0?je("sig-sv-react","对督学有回应：被督促「"+(lo[t.key]||t.key)+"」后执行了","preference"):Wi().indexOf(t.key)>=0&&je("sig-sv-mute-"+t.key,"对「"+(lo[t.key]||t.key)+"」类督促反复无行动，唠叨无效，换角度或暂放","preference")),t}function Wi(){const e={};return Es().forEach(function(t){t.outcome===!1&&(e[t.key]=(e[t.key]||0)+1)}),Object.keys(e).filter(function(t){return e[t]>=2})}function ph(){try{const e=w.get();if(!F.configured()||e.ai.memAuto===!1)return!1;const t=Ae().lastConsolidate;return t?Date.now()-new Date(t).getTime()>=7*x.DAY_MS:!0}catch{return!1}}function hh(){return'你是考研教练的“记忆官”，现在做每周记忆巩固。基于考生的全部长期记忆与画像，做一次去冗余与升华。只输出 JSON，不要多余文字、不要 markdown 代码块。格式：{"add":[{"text":"新提炼的稳定规律(≤40字)","kind":"weakness|habit|preference|goal|context|pattern"}],"reinforce":["值得强化保留的记忆原文片段"],"remove":["重复/过时/太琐碎应删除的记忆原文片段"],"profile":"重写后的考生画像一段话(≤140字，更立体：弱点·习惯·偏好·最佳状态·目标)"}。规则：1) 合并语义重复项，只留最凝练一条；2) remove 一次性或已过时的；3) add 最多3条真正跨周有用的规律；4) 简体中文。'}function fo(){w.update(function(e){e.aiMemory.lastConsolidate=x.dkey()})}function mh(){if(!F.configured())return Promise.resolve(!1);const e=Ae(),t=Yn(e.facts);if(!t.length&&!e.profile)return fo(),Promise.resolve(!1);const n="【当前画像】"+(e.profile||"（空）")+`
【全部记忆事实】
`+t.map(function(r){return"- ["+(r.kind||"context")+"] "+r.text+"（命中"+(r.hits||1)+"）"}).join(`
`);return F.chatJSON(hh(),n,null,{noTools:!0}).then(function(r){return Zi(r),fo(),!0}).catch(function(){return!1})}function gh(){return'你是一名考研教练的"记忆官"。根据教练与考生的最近对话和已有记忆，提取值得长期记住的事实。只输出 JSON，不要多余文字、不要 markdown 代码块。格式：{"add":[{"text":"一句话事实(≤40字)","kind":"weakness|habit|preference|goal|context"}],"reinforce":["已有记忆中被再次验证的原文片段"],"remove":["已过时/被纠正的记忆原文片段"],"profile":"重写后的考生画像一段话(≤120字，融合新旧认知，无变化则原样返回)"}。规则：1) 只沉淀稳定的、跨会话有用的认知（弱点/习惯/偏好/目标/背景），不要记录一次性闲聊；2) add 最多3条，宁缺毋滥；3) reinforce/remove 引用【已有记忆】中的原文；4) 简体中文。'}function Xi(e){const t=w.get();if(!F.configured()||t.ai.memAuto===!1||!e||e.length<30)return Promise.resolve(!1);const n=Ae(),r=n.facts.map(function(o){return o.text}).slice(0,30),s="【当前画像】"+(n.profile||"（空）")+`
【已有记忆】
`+(r.length?r.map(function(o){return"- "+o}).join(`
`):"（无）")+`
【最近对话】
`+e.slice(-3e3);return F.chatJSON(gh(),s,null,{noTools:!0}).then(function(o){return Zi(o),w.update(function(i){i.aiMemory.reflectCount=(i.aiMemory.reflectCount||0)+1}),!0}).catch(function(){return!1})}function Zi(e){e&&(e.profile&&typeof e.profile=="string"&&Yi(e.profile),(e.add||[]).slice(0,3).forEach(function(t){t&&t.text&&As(t.text,t.kind||"context","ai")}),(e.reinforce||[]).slice(0,5).forEach(function(t){t&&Qi(t)}),(e.remove||[]).slice(0,5).forEach(function(t){if(!t)return;const n=Pt(t);w.update(function(r){const s=Ae();s.facts=s.facts.filter(function(o){return Pt(o.text)!==n&&o.text.indexOf(n.slice(0,12))<0})})}))}let Zt=[];function yh(e,t){const n="["+x.hm()+"] "+e+(t?"："+t:"");Zt.push(n),Zt.length>=4&&ea()}function ea(){if(!Zt.length)return;const e=`考生近期行为事件：
`+Zt.join(`
`);Zt=[],Xi(e)}function vh(){const e=Ae();return{facts:e.facts.length,pinned:e.facts.filter(function(t){return t.pinned}).length,aiFacts:e.facts.filter(function(t){return t.source==="ai"}).length,hasProfile:!!e.profile,reflectCount:e.reflectCount||0,updatedAt:e.updatedAt||""}}const Tn={MAX_FACTS:jr,digest:oh,addFact:As,reinforceByText:Qi,removeFact:rh,togglePin:sh,setProfile:Yi,syncLocalSignals:ih,dueBacklog:Ts,superviseSuggestion:lh,logSupervise:uh,evalLastOutcome:fh,mutedSuperviseKeys:Wi,superviseLog:function(){return Es().slice()},consolidateDue:ph,weeklyConsolidate:mh,reflect:Xi,recordEvent:yh,flushEvents:ea,stats:vh,list:function(){return Yn(Ae().facts)},profile:function(){return Ae().profile||""}},ta={scoreToLevel(e){return e=+e,isNaN(e)?0:e>=80?2:e>=50?1:0},effScore(e){return e?typeof e.score=="number"&&!isNaN(e.score)?Math.round(e.score):e.level===2?85:e.level===1?60:e.level===0?30:null:null},recordAnswer(e){if(!e||!e.topicId||typeof e.score!="number")return;const t=ta.scoreToLevel(e.score),n=new Date().toISOString();w.update(function(r){if(r.heat=r.heat||{},r.heat[e.topicId]={level:t,score:e.score,updatedAt:n},r.heatHistory=r.heatHistory||{},r.heatHistory[e.topicId]=r.heatHistory[e.topicId]||[],r.heatHistory[e.topicId].push({score:e.score,level:t,at:n}),r.heatHistory[e.topicId].length>30&&(r.heatHistory[e.topicId]=r.heatHistory[e.topicId].slice(-30)),!e.noMistake&&e.score<80&&e.errorType&&e.errorType!=="none"){r.mistakes=r.mistakes||[];const s=e.sourceLabel||"测验";r.mistakes.push({id:x.uid(),subject:e.subject||"math",type:e.errorType,desc:"【"+s+"】"+e.topicName+"："+(e.comment||"作答有误"),stem:e.stem||"",answer:e.answer||"",solution:e.solution||"",trap:e.trap||"",refId:e.topicId,source:e.source||"quiz",dedupKey:(e.source||"quiz")+":"+e.topicId+":"+x.shortDate(),date:x.shortDate(),createdAt:n})}if(e.tier===1&&e.score<(e.penaltyBelow!=null?e.penaltyBelow:90)){const s=e.penaltyCount||5;r.mistakeDrills=r.mistakeDrills||[];for(let o=0;o<s;o++)r.mistakeDrills.push({id:x.uid(),source:"topic",refId:e.topicId,title:"【罚练】"+e.topicName+" 同类题 "+(o+1)+"/"+s,subject:e.subject||"math",status:"pending",penaltyOf:e.topicId,createdAt:n})}r.quizHistory=r.quizHistory||[],r.quizHistory.push({id:x.uid(),topicId:e.topicId,topicName:e.topicName,score:e.score,verdict:e.verdict||"",date:x.shortDate(),createdAt:n,source:e.source||"quiz"}),r.quizHistory.length>100&&(r.quizHistory=r.quizHistory.slice(-100))});try{w.recomputeMathAccuracy&&w.recomputeMathAccuracy()}catch{}}},na={},B=na;B.LATEX_RULE="【LaTeX 格式硬约束】所有数学公式必须用标准 LaTeX 反斜杠命令（如 \\frac{a}{b}、\\int_a^b、\\pi、\\sqrt{x}、\\sin x、\\begin{vmatrix}…\\end{vmatrix}、\\begin{cases}…\\end{cases}），**严禁用 | 竖线代替反斜杠**。矩阵用 \\begin{vmatrix}/\\begin{bmatrix} 环境，分段函数用 \\begin{cases} 环境，公式用 $…$ 包裹。【格式细节】① 带参数命令必须用花括号：\\frac{1}{t^3}（严禁漏花括号写成 \\frac1t3），\\mathbb{E}[X]（严禁 \\mathbbE），\\operatorname{rank}(A)；② 上下标必带花括号：e^{-x}（严禁 e-x），x^{2}、A^3-3A^2+3A（指数超过一位必带 {}）；③ 区间/属于用 \\in（**严禁 \\ln**——对数 \\ln 不是属于！），\\to（**严禁裸 \\to**——必须双反斜杠或写作 \\to），\\Leftrightarrow，\\geqslant/\\leqslant；④ 微分写作 \\mathrm{d}x 或直接 dx，禁写成 |dx（|dx 是 pipe 不会渲染）。";B.SUBJ_NAME={math:"数学",ctrl:"专业课",eng:"英语",pol:"政治"};B.SUBJ_ORDER=["math","ctrl","eng","pol"];B.starToDiff=function(e){var t=Math.max(1,Math.min(5,Math.floor(Number(e)||3)));return t<=2?"easy":t===3?"medium":"hard"};B.starOf=function(e){var t=Number(e&&e.star);return t>=1&&t<=5?Math.round(t):{easy:2,medium:3,hard:5}[e&&e.diff||"medium"]||3};B.forceStarMix=function(e,t){if(!t||!e||!e.length)return e;for(var n=e.length,r={1:0,2:0,3:0,4:0,5:0},s=0,o=n,i=1;i<=5;i++){var a=Number(t[i])||0;if(a>0&&o>0){var c=Math.round(n*a/100);c>o&&(c=o),r[i]=c,s+=c,o-=c}}s<n&&(r[3]+=n-s);for(var l={},u=1;u<=5;u++)l[u]=[];e.forEach(function(S,_){l[B.starOf(S)]=l[B.starOf(S)]||[],l[B.starOf(S)].push(_)});for(var f=1;f<=5;f++){for(var d=r[f],m=l[f]||[],p=0,y=0;y<m.length&&p<d;y++)e[m[y]].star=f,p++;for(;p<d;)if(l[3]&&l[3].length){var h=l[3].shift();if(h!=null)e[h].star=f,p++;else break}else if(l[4]&&l[4].length){var g=l[4].shift();if(g!=null)e[g].star=f,p++;else break}else if(l[2]&&l[2].length){var v=l[2].shift();if(v!=null)e[v].star=f,p++;else break}else break}return e.forEach(function(S){S.diff=B.starToDiff(B.starOf(S))}),e};B.forceDiff=function(e,t,n){if(n&&typeof B.forceStarMix=="function")return B.forceStarMix(e,n);var r=t==="hard"?.7:t==="superhard"?1:.4,s=Math.round(e.length*r),o=[],i=[],a=[];for(e.forEach(function(f,d){var m=B.starOf(f);m>=4?o.push(d):m===3?i.push(d):a.push(d)});o.length<s&&(i.length||a.length);){var c=i.length?i.shift():a.shift();e[c].star=4,o.push(c)}for(;o.length>s;){var l=o.filter(function(f){return B.starOf(e[f])===4});if(l.length||(l=o.filter(function(f){return B.starOf(e[f])>=5})),!l.length)break;var u=l[0];e[u].star=3,o.splice(o.indexOf(u),1)}return e.forEach(function(f){f.star=B.starOf(f),f.diff=B.starToDiff(f.star)}),e};var ra={choice:"选择题",fill:"填空题",solve:"解答题",essay:"写作题"};B.bpTypeName=function(e){return ra[e]||"解答题"};B.BLUEPRINT_PRESETS={shuyi:{name:"数一标准卷",subject:"math",totalScore:150,timeLimit:180,types:[{type:"choice",count:10,score:4},{type:"fill",count:6,score:4},{type:"solve",count:6,score:0}],starMix:{1:5,2:20,3:35,4:30,5:10}},shu2:{name:"数二标准卷",subject:"math",totalScore:150,timeLimit:180,types:[{type:"choice",count:10,score:4},{type:"fill",count:6,score:4},{type:"solve",count:6,score:0}],starMix:{1:8,2:22,3:35,4:25,5:10}},shu3:{name:"数三标准卷",subject:"math",totalScore:150,timeLimit:180,types:[{type:"choice",count:10,score:3},{type:"fill",count:10,score:3},{type:"solve",count:5,score:0}],starMix:{1:10,2:25,3:40,4:20,5:5}},yingyi:{name:"英语一标准卷",subject:"eng",totalScore:100,timeLimit:180,types:[{type:"fill",count:5,score:1},{type:"choice",count:10,score:2},{type:"essay",count:2,score:15},{type:"solve",count:1,score:0}],starMix:{1:5,2:20,3:40,4:30,5:5}},ying2:{name:"英语二标准卷",subject:"eng",totalScore:100,timeLimit:180,types:[{type:"fill",count:10,score:1},{type:"choice",count:15,score:2},{type:"essay",count:2,score:15},{type:"solve",count:1,score:0}],starMix:{1:8,2:22,3:40,4:25,5:5}},ctrl:{name:"专业课标准卷",subject:"ctrl",totalScore:150,timeLimit:180,types:[{type:"choice",count:20,score:1},{type:"fill",count:10,score:2},{type:"solve",count:6,score:0}],starMix:{1:10,2:20,3:35,4:30,5:5}},pol:{name:"政治标准卷",subject:"pol",totalScore:100,timeLimit:180,types:[{type:"choice",count:16,score:1},{type:"choice",count:17,score:2,label:"多选题"},{type:"solve",count:5,score:0}],starMix:{1:10,2:25,3:40,4:20,5:5}}};B.SUBJ_TO_PRESET={math:"shuyi",ctrl:"ctrl",eng:"yingyi",pol:"pol"};B.normalizeBlueprint=function(e,t){e=e&&typeof e=="object"?e:{};var n=B.BLUEPRINT_PRESETS[B.SUBJ_TO_PRESET[t]||"shuyi"]||B.BLUEPRINT_PRESETS.shuyi,r={preset:typeof e.preset=="string"?e.preset:B.SUBJ_TO_PRESET[t]||"custom",name:e.name||n.name,subject:e.subject||t||n.subject,totalScore:Math.max(10,Math.min(300,Number(e.totalScore)||n.totalScore)),timeLimit:Math.max(10,Math.min(600,Number(e.timeLimit)||n.timeLimit)),types:[],starMix:{},topicMode:e.topicMode==="manual"?"manual":"auto",topics:Array.isArray(e.topics)?e.topics.map(String).filter(Boolean).slice(0,30):[],volume:e.volume==="lite"||e.volume==="full"?e.volume:"std",updatedAt:e.updatedAt||""},s=Array.isArray(e.types)&&e.types.length?e.types:n.types;s.forEach(function(m){if(m){var p={choice:"choice",fill:"fill",solve:"solve",essay:"essay"}[m.type]||"solve",y=Math.max(0,Math.min(60,Math.floor(Number(m.count)||0)));if(y){var h=Number(m.score);h>=0&&h<=100||(h=0),r.types.push({type:p,label:String(m.label||ra[p]),count:y,score:h})}}}),r.types.length||(r.types=JSON.parse(JSON.stringify(n.types)));for(var o=e.starMix&&typeof e.starMix=="object"?e.starMix:n.starMix,i=0,a=1;a<=5;a++){var c=Math.max(0,Math.min(100,Math.round(Number(o[a])||0)));r.starMix[a]=c,i+=c}if(i!==100){for(var l=i>0?r.starMix:n.starMix,u=i>0?i:100,f=0,d=1;d<=5;d++)r.starMix[d]=Math.round((l[d]||0)/u*100),f+=r.starMix[d];r.starMix[3]+=100-f}return r};B.bpQuestionCount=function(e){return(e.types||[]).reduce(function(t,n){return t+(n.count||0)},0)};B.bpAutoScores=function(e){var t=0,n=0;(e.types||[]).forEach(function(l){l.score>0?t+=l.count*l.score:n+=l.count});var r=Math.max(0,(e.totalScore||100)-t);if(!n)return[];for(var s=Math.floor(r/n*2)/2,o=[],i=0;i<n;i++)o.push(s);for(var a=Math.round((r-s*n)*2)/2,c=n-1;c>=0&&a>0;c--)o[c]+=.5,a-=.5;return o};B.blueprintCheck=function(e,t){var n=[],r=e.questions||[],s=r.length,o=B.bpQuestionCount(t);s!==o&&n.push("题量不符：蓝图 "+o+" 题，实际 "+s+" 题");var i={choice:0,fill:0,solve:0,essay:0};if(r.forEach(function(d){i[d.type]=(i[d.type]||0)+1}),(t.types||[]).forEach(function(d){var m=i[d.type]||0;m!==d.count&&n.push(d.label+"题量：蓝图 "+d.count+"，实际 "+m)}),t.starMix){var a={1:0,2:0,3:0,4:0,5:0};r.forEach(function(d){var m=B.starOf(d);a[m]=(a[m]||0)+1});for(var c=s||1,l=1;l<=5;l++){var u=Math.round(c*((t.starMix[l]||0)/100)),f=a[l];u>0&&Math.abs(f-u)>Math.max(1,Math.round(u*.3))&&n.push("★"+l+" 星级配比偏差：蓝图约 "+u+"，实际 "+f)}}return n};B.defaultBlueprint=function(e){var t=B.SUBJ_TO_PRESET[e]||"shuyi",n=B.BLUEPRINT_PRESETS[t]||B.BLUEPRINT_PRESETS.shuyi;return B.normalizeBlueprint(JSON.parse(JSON.stringify(n)),e)};B.validateQuestion=function(e){if(!e||typeof e!="object")return"不是对象";if(!e.stem||typeof e.stem!="string"||e.stem.length<8)return"题干缺失或过短";if(e.answer==null||e.answer==="")return"缺 answer";if(e.type==="choice"){if(!Array.isArray(e.options)||e.options.length!==4)return"选择题须 4 个选项";var t=e.options.map(function(i){return String(i).trim().charAt(0).toUpperCase()});if(t.join("")!=="ABCD")return"选项前缀须 A/B/C/D（实为 "+t.join("")+"）";var n=String(e.answer).trim().charAt(0).toUpperCase();if(t.indexOf(n)<0)return"answer 不在选项中";var r=String(e.answer).trim().slice(1).trim();if(r.length>6&&e.options.filter(function(i){return String(i).indexOf(r)>=0}).length>1)return"疑似多个选项含相同答案内容"}if(!e.solution||String(e.solution).length<1)return"解析缺失";var s=String(e.solution).replace(/\s+/g,"").length,o=e.type==="solve"||e.type==="essay"?60:e.type==="choice"?25:20;return s<o?"解析不完整（"+s+" 字 < "+o+" 字下限，需分步推导+结论+易错点）":""};B.braceBalanced=function(e){var t=0;e=String(e||"");for(var n=0;n<e.length;n++){var r=e[n];if(r==="\\"){n++;continue}r==="{"?t++:r==="}"&&t--}return t===0};B.buildVariantContext=function(e,t){if(!e||typeof e!="object")return"";var n=[];function r(o,i){if(i!=null){if(Array.isArray(i)){var a=i.map(function(l){return String(l??"").trim()}).filter(function(l){return!!l});if(!a.length)return;n.push(o+"："+a.join(" | "));return}var c=String(i).trim();c&&n.push(o+"："+c)}}function s(){for(var o=0;o<arguments.length;o++){var i=arguments[o];if(i!=null&&String(i).trim()!=="")return i}return""}return r("原题题干",s(e.stem,e.question,e.extractedQuestion)),r("原题选项",e.options),r("标准答案",s(e.answer,e.referenceAnswer)),r("原解析/解题关键",s(e.solution,e.keySteps,e.analysis)),r("易错点/错误原因",s(e.trap,e.errorCause)),r("考点",s(e.topicName,e.topic,e.painPoint)),n.join(`
`)};B.unwrapQuestionObj=function(e){return!e||typeof e!="object"?null:Array.isArray(e)?e.length?e[0]:null:e.questions&&Array.isArray(e.questions)?e.questions[0]:e.q?e.q:e};B.normalizeParallelQ=function(e,t){var n=B.unwrapQuestionObj(e);return n?(n.type={choice:"choice",fill:"fill",solve:"solve",essay:"essay"}[n.type]||t&&t.type||"solve",n.diff={easy:"easy",medium:"medium",hard:"hard"}[n.diff]||t&&t.diff||"medium",n.star=n.star>=1&&n.star<=5?n.star:t&&t.star||3,n.score=typeof n.score=="number"?n.score:t&&t.score||5,n.type==="choice"&&(!Array.isArray(n.options)||n.options.length!==4)&&(n.options=["A. 待补充","B. 待补充","C. 待补充","D. 待补充"]),n):null};B._normAns=function(e){return String(e??"").replace(/\$/g,"").replace(/\\left|\\right|\\!|\\,/g,"").replace(/\\d?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g,"($1)/($2)").replace(/\s+/g,"").replace(/[（(][^（()）]*[）)]/g,"").replace(/^[：:，,。.、答案答解]+/,"").replace(/[。．.、，,：:]+$/,"").toLowerCase()};B._ansNum=function(e){var t=String(e??"").replace(/[()（）]/g,""),n=t.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);if(n){var r=parseFloat(n[2]);return r?parseFloat(n[1])/r:NaN}var s=parseFloat(t);return isNaN(s)?NaN:s};B.answerEquivalent=function(e,t){var n=B._normAns(e),r=B._normAns(t);if(!n||!r)return!1;if(n===r)return!0;var s=function(d){return d.replace(/^[a-d][.、．]/,"")},o=s(n),i=s(r);if(o&&i&&o===i)return!0;var a=function(d){var m=d.lastIndexOf("=");return m>=0?d.slice(m+1):d},c=a(o),l=a(i);if(c&&l&&c===l)return!0;var u=B._ansNum(c),f=B._ansNum(l);return!isNaN(u)&&!isNaN(f)&&Math.abs(u-f)<1e-9};B.triageVerify=function(e,t,n){if(!e&&!t)return{status:"failed",suspect:null};var r=e&&t&&B.answerEquivalent(e,t),s=e&&n!=null&&String(n).trim()!==""&&B.answerEquivalent(e,n),o=t&&n!=null&&String(n).trim()!==""&&B.answerEquivalent(t,n);return r&&s?{status:"agree",suspect:null}:r&&!s?{status:"dispute",suspect:n?"orig-wrong":null}:!r&&(s||o)?{status:"lean",suspect:null}:{status:"dispute",suspect:null}};B.examTitle=function(e,t){return e&&e.title?e.title:"云端押题卷 · "+(B.SUBJ_NAME[t]||"综合")};B.examTotalScore=function(e){var t=e.questions||[];return t.reduce(function(n,r){return n+(Number(r.score)||5)},0)||Number(e.totalScore)||150};B.validateExam=function(e,t){var n=[];return!e||!Array.isArray(e.questions)||!e.questions.length?["无 questions"]:(e.questions.forEach(function(r,s){var o=B.validateQuestion(r);if(o)n.push("第"+(s+1)+"题："+o);else{var i=!B.braceBalanced(r.stem)||!B.braceBalanced(r.solution);i&&n.push("第"+(s+1)+"题：LaTeX 花括号不平衡")}}),t&&B.blueprintCheck(e,t).forEach(function(r){n.push("蓝本："+r)}),n)};B.normalizeQuestion=function(e){var t={stem:String(e&&e.stem||""),type:{choice:"choice",fill:"fill",solve:"solve",essay:"essay"}[e&&e.type]||"solve",options:Array.isArray(e&&e.options)?e.options:null,answer:String(e&&e.answer||""),solution:String(e&&e.solution||""),trap:String(e&&e.trap||""),diff:{easy:"easy",medium:"medium",hard:"hard"}[e&&e.diff]||"medium",star:e&&e.star>=1&&e.star<=5?e.star:3,score:Number(e&&e.score)||5,topicName:String(e&&e.topicName||"")};return t};const Nr={early:{label:"早起型",bias:{morning:1.25,afternoon:1,evening:.75},desc:"上午精力最好，难点排上午"},normal:{label:"常规型",bias:{morning:1,afternoon:1.05,evening:1},desc:"均衡分配"},night:{label:"夜猫型",bias:{morning:.75,afternoon:1,evening:1.25},desc:"晚上精力最好，难点排晚上"}},wh={math:{morning:1.3,afternoon:1,evening:1.1},ctrl:{morning:1.1,afternoon:1.15,evening:.9},eng:{morning:1,afternoon:1,evening:1},pol:{morning:.9,afternoon:1,evening:1.15}},ct=[{key:"morning",label:"☀️ 上午",hours:[8,12],share:.34},{key:"afternoon",label:"🌤 下午",hours:[14,18],share:.33},{key:"evening",label:"🌙 晚上",hours:[19,23],share:.33}];function bh(e,t){t=t||{};const n=Nr[t.routine]||Nr.normal,r=Math.max(60,Math.round((t.dayHours||6)*60)),s={math:90,ctrl:75,eng:45,pol:40},o=[],i=[];(e||[]).forEach(p=>{if(!p)return;(p.forced||p.hard?o:i).push(Object.assign({},p,{minutes:Math.max(15,Math.min(240,p.minutes||s[p.subject]||60))}))});const a=ct.map(p=>({key:p.key,label:p.label,items:[],usedMin:0})),c=ct.map(p=>Math.round(r*p.share*(n.bias[p.key]||1))),l=(p,y)=>{const h=ct[y].key,g=(wh[p.subject]||{})[h]||1,v=a[y].usedMin,S=c[y],_=v+p.minutes>S?1e3:0;return(n.bias[h]||1)*g-_+Math.random()*.01},u={morning:0,afternoon:1,evening:2},f=(p,y)=>{let h=-1,g=-1/0;if(p.slotKey&&u[p.slotKey]!=null?h=u[p.slotKey]:ct.forEach((v,S)=>{const _=l(p,S);_>g&&(g=_,h=S)}),h<0){d.push(p);return}if(y){const v=a[h].items.length-1;if(v>=0&&!a[h].items[v].forced&&!a[h].items[v].hard&&a[h].usedMin+p.minutes>c[h]){const S=a[h].items.splice(v,1)[0];a[h].usedMin-=S.minutes,d.push(Object.assign({},S,{displaced:!0}))}}else if(a[h].usedMin+p.minutes>c[h]){const v=ct.findIndex((S,_)=>a[_].usedMin+p.minutes<=c[_]);if(v>=0)h=v;else{d.push(p);return}}a[h].items.push(Object.assign({},p,{slotStart:kh(h,a[h].usedMin),overflow:a[h].usedMin+p.minutes>c[h]})),a[h].usedMin+=p.minutes},d=[];return o.forEach(p=>f(p,!0)),i.forEach(p=>f(p,!1)),{slots:a.map((p,y)=>({key:p.key,label:p.label,items:p.items,usedMin:p.usedMin,budgetMin:c[y]})),unmapped:d,dayMin:r,hardN:o.length,softN:i.length}}function kh(e,t){const n=ct[e].hours[0]*60;return Math.round((n+t)/5)*5}function Sh(e){if(e=Math.round(e||0),e>=60){const t=e/60;return(t%1===0?t:t.toFixed(1))+"h"}return e+"min"}function xh(e,t,n){n=n||{};const r=n.cap||3;if(!e||!t)return[];const s=[];try{const o=e.reading&&e.reading.cards||{},i=Object.keys(o).filter(a=>t(o[a])).slice(0,r);i.length&&s.push({id:"__review_eng",subject:"eng",kind:"vocab",due:!0,text:"📖 单词复习："+i.length+" 个到期（"+(e.readingCount!=null,"")+"间隔复习）",count:i.length,minutes:Math.min(30,i.length*2)})}catch{}try{const o=(e.polRecite||[]).filter(i=>t(i,{includeMastered:!1})).slice(0,r);o.length&&s.push({id:"__review_pol",subject:"pol",kind:"pol",due:!0,text:"📖 政治背诵："+o.length+" 个到期复习",count:o.length,minutes:Math.min(40,o.length*4)})}catch{}try{const o=Array.isArray(e.mistakePhotos)?e.mistakePhotos:[],i=Date.parse(String(n.todayKey||_h()))||Date.now(),a=o.filter(function(c){if(!c||!c.reviewPlan||!c.reviewPlan.start)return!1;const l=Date.parse(c.reviewPlan.start);if(isNaN(l))return!1;const u=Math.floor((i-l)/864e5);return u<0?!1:[1,3,7,15].some(function(f){const d="d"+f;return!(c.reviewPlan.done&&c.reviewPlan.done[d])&&u>=f})});a.length&&s.push({id:"__review_math",subject:"math",kind:"mistake",due:!0,text:"📖 拍题复习："+a.length+" 道到期（D1/3/7/15 间隔）",count:a.length,minutes:Math.min(45,a.length*5)})}catch{}return s}function _h(){const e=new Date;return e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0")}function Ah(e,t){const n={math:0,ctrl:0,eng:0,pol:0},r=[],s={};(e||[]).forEach(o=>{!o||o.forced||!o.subject||(s[o.subject]=s[o.subject]||{total:0,done:0},s[o.subject].total++,o.done&&s[o.subject].done++)}),Object.keys(s).forEach(o=>{const i=s[o];i.total&&i.done<i.total?(n[o]=(n[o]||0)+6,r.push(o+" 未全完成（"+i.done+"/"+i.total+"）→ 明日权重 +6%")):i.total&&i.done===i.total&&(n[o]=(n[o]||0)-2,r.push(o+" 全完成 ✓ → 明日权重 -2%"))});try{t&&Object.keys(t).forEach(o=>{(t[o]||99)>=3&&(n[o]=Math.max(n[o]||0,8),r.push(o+" 连续 "+t[o]+" 天未打卡 → 强制补救 +8%"))})}catch{}return{adjust:n,reasons:r}}const Th={ROUTINES:Nr,SLOT_META:ct,slotAllocate:bh,fmtMin:Sh,collectDueReviews:xh,computeAdjust:Ah};function sa(){return window.U||{}}function We(){return window.Store}function oa(){return window.AI}function qe(){return window.InspectorModule}function gt(e){var t=sa();return(t.esc?t.esc:function(n){return String(n??"")})(e)}var Os={math:"数学",ctrl:"自控",eng:"英语",pol:"政治"},Is={sprint:"押题卷",quiz:"AI测验",mistakes:"错题本",photomistake:"拍题",conceptmap:"考点地图",tutor:"私教",reading:"阅读",polrecite:"政治背诵",wordbook:"单词本",review:"复习",daily:"每日一题",bank:"题库"};function Hn(){return We().get()}function ia(){var e=Hn();return(!e.playbookLinks||typeof e.playbookLinks!="object")&&(We().update(function(t){t.playbookLinks={}}),e=Hn()),e.playbookLinks}function Ms(){var e=Hn();return Array.isArray(e.playbookDrills)||(We().update(function(t){t.playbookDrills=[]}),e=Hn()),e.playbookDrills}function Gn(e){return String(e??"").replace(/[\s\u3000]+/g,"").replace(/[（(].*?[)）]/g,"").replace(/[、，,。.：:；;·\-—_/\\|"'「」《》【】\[\]]/g,"").toLowerCase().slice(0,24)}function aa(e,t,n){return[e||"_",Gn(t),Gn(n)].filter(function(r){return r}).join("|")}function ca(e,t,n){e=e||{},n=n||{};var r=e.subject||n.subject||"",s=e.topicName||e.topic||e.name||n.topic||"",o=e.stem||e.question||e.title||e.desc||e.text||"",i=e.type||e.qtype||e.mistakeType||"",a=e.solution||e.analysis||e.explanation||"";return{subject:r,topicName:String(s||"").slice(0,40),topicId:e.topicId||n.topicId||"",type:String(i||"").slice(0,20),stem:String(o||"").slice(0,400),solution:String(a||"").slice(0,600),module:t||"",refId:n.id||e.examId||e.id||"",refTitle:n.title||e.examTitle||"",fp:aa(r,i,s)}}function Lr(e,t){var n=sa();return n.sim?n.sim(e,t,Gn):0}function Cs(e,t){if(!e||t.subject&&e.subject&&e.subject!==t.subject)return-1;var n=0,r=Lr(e.title||"",t.topicName||"");n+=r*60,t.type&&(e.tags||[]).indexOf(t.type)>=0&&(n+=25);var s=t.stem||"";if(s){var o=0;(e.recognize||[]).forEach(function(i){if(i){var a=Gn(i).slice(0,6);a&&s.indexOf(a)>=0&&o++}}),o&&(n+=Math.min(o,3)*10)}return s&&!t.topicName&&(n+=Lr(e.title||"",s.slice(0,60))*30),e.uses&&(n+=Math.min(e.uses,10)*.5),n}var la=22;function pn(e,t){if(t=t||{},!e||!window.InspectorModule)return null;var n=qe().list()||[];if(!n.length)return null;var r=ia(),s=e.fp?r[e.fp]:"";if(s&&!t.ignoreBound){var o=n.filter(function(c){return c.id===s})[0];if(o)return{pb:o,score:999,bound:!0};We().update(function(c){c.playbookLinks&&delete c.playbookLinks[e.fp]})}var i=null,a=-1;return n.forEach(function(c){var l=Cs(c,e);l>a&&(a=l,i=c)}),!i||a<la?null:{pb:i,score:Math.round(a),bound:!1}}function ua(e,t){if(!e||!window.InspectorModule)return[];var n=qe().list()||[],r=[];return n.forEach(function(s){var o=Cs(s,e);o>0&&r.push({pb:s,score:Math.round(o)})}),r.sort(function(s,o){return o.score-s.score}),r.slice(0,t||6)}function po(e){return"你是考研方法论教练。考生在做「"+(Os[e.subject]||e.subject||"未标科目")+`」的一类题时反复卡住，需要一张可反复套用的【解题方法卡】。
【这类题】
考点/题型：`+(e.topicName||e.type||"见题面")+`
`+(e.stem?"代表性题面："+e.stem.slice(0,220)+`
`:"")+(e.solution?"参考解析（若有错请忽略，按你认为的正确做法写）："+e.solution.slice(0,200)+`
`:"")+`
只输出 JSON 本身（不要前言/后记/markdown 围栏）。【格式硬约束】steps 必须是【对象数组】——每一项都是 {"name":"…","do":"…","tip":"…"} 形式的对象，严禁把 steps 写成字符串数组。
格式：
{
  "subject": "`+(e.subject||"math")+`",
  "title": "题型名(≤12字)",
  "recognize": ["识别信号1(≤30字)","信号2",…] (3-5条：看到什么就该想到这套方法，不是题目描述),
  "steps": [{"name":"步骤名(≤8字,动词开头)","do":"这步做什么(≤40字,具体可执行)","tip":"该步高频坑(≤30字)"},…]
            (至少4步至多7步，必须覆盖「识别题型→下手→执行→验证结果」完整闭环),
  "pitfalls": ["整题高频错1(≤30字)",…] (2-4条，整题级，与 steps.tip 不重复),
  "verify": ["验证方法1(≤30字)",…] (1-3条，对最终结果的合理性检验：代值/量级/边界/特殊情形),
  "examFreq": 1|2|3,
  "difficulty": "basic|medium|hard"
}

质量纪律（违反即废卷）：
① steps 必须可执行——动词开头、有具体动作；禁止「分析题目」「套用公式」「认真计算」这类空话；
② 这是一类题的通用方法，不要写死成某一道具体题的演算过程（不要出现题面里的具体数字）；
③ recognize 是触发信号；④ pitfalls 是整题级易错；⑤ verify 是结果自检；
⑥ 不确定就给保守、通用、稳妥的做法，不要编造偏门技巧。用简体中文。`}function Eh(){var e=oa();return!!(e&&e.configured&&e.configured())}function Ps(e,t){return t=t||{},new Promise(function(n){if(!window.InspectorModule){n(null);return}var r=t.force?null:pn(e);if(r&&r.pb){n({pb:r.pb,created:!1,bound:r.bound});return}if(!Eh()){t.silent||window.Toast&&z.warn("未配置 AI，无法自动建立方法卡。可到「解题方法」页手动新建。"),n(null);return}var s=oa();function o(i,a){var c=s.chatJSON?s.chatJSON(po(e),i,null,{ctx:"insp.gen",noThink:!0}):s.chatStream(po(e),i,null,null,{ctx:"insp.gen",noThink:!0}).then(function(l){return s.extractRobustJSON(l||"")});c.then(function(l){var u=qe().normalizePlaybook(l,e.subject||"math");if(!u){if(!a){o(i+`
【重试注意】上次 JSON 不完整（疑似被截断）。请压缩每条字数（do≤25字/tip≤20字），确保 steps 4-7 步与全部字段一次性完整输出。严禁把裸字段名（如 "name"、"do"、"tip"）或 JSON 语法碎片（如 "]"、"steps"）当成内容输出；所有数组必须完整闭合。`,!0);return}t.silent||window.Toast&&z.warn("AI 返回的方法卡格式不合格，已放弃入库（不会污染方法库）"),n(null);return}u.source="auto:"+(e.module||"unknown"),u.autoFp=e.fp||"",u.autoTopic=e.topicName||e.type||"",u.uses=0,We().update(function(f){f.playbooks=f.playbooks||[],f.playbooks.unshift(u)}),Wn(e.fp,u.id),n({pb:u,created:!0,bound:!0})}).catch(function(l){t.silent||window.Toast&&z.warn("建立方法卡失败："+(l&&l.message||l)),n(null)})}o("请为这类题生成方法卡。",!1)})}function Wn(e,t){!e||!t||We().update(function(n){n.playbookLinks=n.playbookLinks||{},n.playbookLinks[e]=t})}function Oh(e){e&&We().update(function(t){t.playbookLinks&&delete t.playbookLinks[e]})}function da(e,t){t=t||{};var n=t.autoCreate!==!1;return new Promise(function(r){if(!window.InspectorModule){window.Toast&&z.warn("解题方法模块未加载"),r(null);return}var s=pn(e);if(s&&s.pb){ho(s.pb,e,t),r(s.pb);return}if(!n){qe().startGuide?qe().startGuide("",e.stem,{origin:t.origin,ctx:e}):qe().openFor({subject:e.subject,type:e.type,desc:e.topicName}),r(null);return}Ps(e,{silent:!1}).then(function(o){o&&o.pb&&ho(o.pb,e,t),r(o?o.pb:null)})})}function ho(e,t,n){e&&(t.fp&&Wn(t.fp,e.id),qe().startGuide?qe().startGuide(e.id,t.stem||t.topicName,{origin:n.origin||Is[t.module]||t.module||"",originTab:n.originTab||t.module||"",ctx:t}):qe().openPlaybook(e.id))}function fa(e){var t=pn(e);return t&&t.pb?(qe().openPlaybook(t.pb.id),t.pb):(qe().openFor({subject:e.subject,type:e.type,desc:e.topicName||e.stem}),null)}function Ih(e){e=e||{};var t={id:"dr"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),pbId:e.pbId||"",fp:e.fp||"",subject:e.subject||"",topicId:e.topicId||"",topic:String(e.topic||"").slice(0,40),module:e.module||"",steps:e.steps||0,doneSteps:e.doneSteps||0,risk:e.risk==null?null:e.risk,ok:!!e.ok,createdAt:new Date().toISOString()};return We().update(function(n){n.playbookDrills=n.playbookDrills||[],n.playbookDrills.unshift(t),n.playbookDrills.length>300&&(n.playbookDrills.length=300)}),t.ok&&t.topicId?pa(t.topicId,6):t.ok&&t.topic&&Mh(t.subject,t.topic,6),t}function pa(e,t){e&&We().update(function(n){n.heat=n.heat||{};var r=n.heat[e]||{level:0,score:null,updatedAt:""};r.score==null&&(r.score=50),r.score=Math.max(0,Math.min(100,r.score+t)),r.level=r.score>=75?2:r.score>=45?1:0,r.updatedAt=new Date().toISOString(),n.heat[e]=r,n.heatHistory||(n.heatHistory={});var s=n.heatHistory[e]||[];s.push({score:r.score,level:r.level,at:new Date().toISOString()}),s.length>30&&(s=s.slice(-30)),n.heatHistory[e]=s})}function Mh(e,t,n){try{var r=window.DB&&Y.TOPICS&&Y.TOPICS[e]||[],s=null,o=0;r.forEach(function(i){var a=Lr(String(i.name||""),t);a>o&&(o=a,s=i)}),s&&o>.5&&pa(s.id,n)}catch{}}function ha(e){var t=Ms().filter(function(r){return r.pbId===e});if(!t.length)return{n:0,ok:0,rate:0,last:""};var n=t.filter(function(r){return r.ok}).length;return{n:t.length,ok:n,rate:Math.round(n/t.length*100),last:t[0].createdAt||""}}function Ch(e){var t=Ms().filter(function(n){return n.fp===e});return{n:t.length,ok:t.filter(function(n){return n.ok}).length,last:t.length?t[0].createdAt:""}}var Dr={},dr=0;function Ph(e){dr>400&&(Dr={},dr=0);var t="c"+dr+++Math.random().toString(36).slice(2,6);return Dr[t]=e,t}function ma(e){return e&&Dr[e]||null}function js(e,t){if(t=t||{},!e)return"";var n=pn(e),r=n?n.pb:null,s=e.topicName||e.type||"这一类题",o=r?ha(r.id):null,i;return r?i='<span class="ml-pb-name">'+gt(r.title)+'</span><span class="ml-pb-meta">'+(o&&o.n?"练过 "+o.n+" 次 · 通过率 "+o.rate+"%":"尚未实操")+(n.bound?" · 已绑定此类题":"")+"</span>":i='<span class="ml-pb-none">「'+gt(s)+'」还没建立解题方法</span><span class="ml-pb-meta">建立后，同类题自动复用，带练闭环</span>','<div class="ml-panel'+(t.compact?" ml-compact":"")+'" data-ml-fp="'+gt(e.fp)+'" data-ml-ctx="'+Ph(e)+'"><div class="ml-head"><span class="ml-ico">🧭</span><div class="ml-right">'+i+"</div></div>"+(t.hint?'<div class="ml-hint">'+gt(t.hint)+"</div>":"")+'<div class="ml-acts">'+(r?'<button class="btn btn-sm btn-primary ml-act" data-ml="practice">🎯 带我练</button><button class="btn btn-sm btn-ghost ml-act" data-ml="view">📖 看方法</button><button class="btn btn-sm btn-ghost ml-act" data-ml="swap">🔄 换一张</button>':'<button class="btn btn-sm btn-primary ml-act" data-ml="create">🧠 为这类题建立方法卡</button><button class="btn btn-sm btn-ghost ml-act" data-ml="pick">📚 从方法库挑一张</button>')+"</div></div>"}function ga(e,t,n){if(n=n||{},!!e){var r=e.classList&&e.classList.contains("ml-panel")?[e]:Array.prototype.slice.call(e.querySelectorAll(".ml-panel"));r.forEach(function(s){var o=ma(s.getAttribute("data-ml-ctx"))||t;o&&ya(s,o,n)})}}function ya(e,t,n){n=n||{},e.querySelectorAll(".ml-act").forEach(function(r){r.onclick=function(){var s=r.getAttribute("data-ml");if(s==="view"){fa(t);return}if(s==="practice"){da(t,{origin:Is[t.module]||"",originTab:t.module});return}if(s==="create"){r.disabled=!0,r.textContent="⏳ 正在建立方法卡…",Ps(t,{force:!0}).then(function(o){r.disabled=!1,r.textContent="🧠 为这类题建立方法卡",o&&o.pb&&(window.Toast&&z.success("方法卡已建立："+o.pb.title+"（同类题将自动复用）"),Ns(e,t,n),n.onChange&&n.onChange(o.pb,t))});return}if(s==="swap"||s==="pick"){va(t,n,e);return}}})}function Ns(e,t,n){if(!(!e||!t)){var r=js(t,n),s=document.createElement("div");s.innerHTML=r;var o=s.firstChild;o&&(ya(o,t,n),e.parentNode&&e.parentNode.replaceChild(o,e))}}function va(e,t,n){t=t||{};var r=ua(e,12),s=(window.InspectorModule?qe().list():[])||[],o=r.length?r:s.filter(function(a){return!e.subject||a.subject===e.subject}).map(function(a){return{pb:a,score:0}}),i='<div class="muted-sm" style="margin-bottom:8px">为「'+gt(e.topicName||e.type||"这类题")+"」指定方法卡。绑定后，同类题会自动命中这张卡，不再重复询问。</div>"+(o.length?o.map(function(a){return'<div class="ml-pick-row"><div style="flex:1;min-width:0"><div style="font-size:13.5px;font-weight:600">'+gt(a.pb.title)+'</div><div class="muted-sm" style="font-size:11.5px">'+(Os[a.pb.subject]||a.pb.subject)+" · "+(a.pb.steps||[]).length+" 步"+(a.score?" · 匹配度 "+a.score:"")+'</div></div><button class="btn btn-sm btn-primary ml-pick" data-id="'+gt(a.pb.id)+'">绑定</button></div>'}).join(""):'<div class="empty">当前没有候选方法卡，可先「建立方法卡」。</div>');window.Modal&&we.open({title:"🔄 选择方法卡",html:i,actions:[{label:"取消"}]}),setTimeout(function(){document.querySelectorAll(".ml-pick").forEach(function(a){a.onclick=function(){Wn(e.fp,a.getAttribute("data-id")),window.Modal&&we.close&&we.close(),window.Toast&&z.success("已绑定，同类题将自动使用这张卡"),n&&Ns(n,e,t),t.onChange&&t.onChange({id:a.getAttribute("data-id")},e)}})},30)}function jh(e,t,n,r,s){if(!e)return null;var o=ca(t,n,r);return e.innerHTML=js(o,s),ga(e,o,s),o}const Nh={fromQuestion:ca,fingerprint:aa,match:pn,candidates:ua,scoreOf:Cs,ensure:Ps,bind:Wn,unbind:Oh,links:ia,practice:da,view:fa,recordDrill:Ih,drills:Ms,statsOf:ha,fpStats:Ch,panelHtml:js,bindPanel:ga,repaintPanel:Ns,mount:jh,openPicker:va,ctxOfToken:ma,SUBJ_CN:Os,MOD_CN:Is,MATCH_MIN:la};function wa(){const e=window;e.U=x,e.ICONS=rn,e.Spaced=Mt,e.BgTask=Op,e.Tex=Fe,e.Store=w,e.Cloud=_e,e.CloudJob=eh,e.DB=Y,e.Charts=ji,e.Diagram=Pi,e.Toast=z,e.Modal=we,e.Components=yo,e.Notify=_s,e.AI=F,e.AiMemory=Tn,e.Alerts=ms,e.Mastery=ta,e.ZipKit=_n,e.PluginBus=q,e.ExamPipeline=na,e.MethodLink=Nh,e.Plaza=Ma,e.SchedulerEngine=Th}function Lh(){const e=w.get(),t=x.dkey();if(e.meta.lastOpenDate===t)return;const n=e.meta.lastOpenDate;if(n&&n<t){const r=e.completions[n]||[];e.taskArchive[n]=e.tasks.map(o=>({subject:o.subject,text:o.text,done:o.done||r.indexOf(o.id)>=0})),e.tasks.forEach(o=>{o.done=!1});const s=Object.keys(e.taskArchive).sort();for(;s.length>60;)delete e.taskArchive[s.shift()]}w.update(r=>{r.meta.lastOpenDate=t})}function Dh(){wa();try{const t="kaoyan2026_v2_bak";if(!localStorage.getItem(t)&&localStorage.getItem("kaoyan2026_data")){localStorage.setItem(t,new Date().toISOString());const n=localStorage.getItem("kaoyan2026_data");n&&localStorage.setItem("kaoyan2026_data_bak_v2",n)}}catch{}const e=(function(){try{return _e.init()}catch{return Promise.resolve()}})();Y.syncSubjects(),Lh(),_s.ensurePermission();try{Tn.syncLocalSignals()}catch{}setTimeout(()=>{try{ms.runDailyChecks()}catch{}},800),e.then(function(){setTimeout(function(){try{const t=window.Copilot;t&&t.superviseCheck&&t.superviseCheck()}catch{}try{Tn.consolidateDue()&&Tn.weeklyConsolidate()}catch{}},1200)}).catch(function(){});try{ht.restoreChat(),ht.maybeAutoLoad()}catch{}e.then(function(){const t=window.Onboarding;t&&t.needed&&t.needed()&&t.show()}).catch(function(){});try{const t=window.Copilot;t&&t.mount&&t.mount()}catch{}}wa();const Bh=[()=>W(()=>import("./dashboard-Dz_FY-l0.js"),[],import.meta.url),()=>W(()=>import("./scheduler-DD9ULQJk.js"),[],import.meta.url),()=>W(()=>import("./tasks-BqMe-nc1.js"),[],import.meta.url),()=>W(()=>import("./progress-MouM4HYd.js"),[],import.meta.url),()=>W(()=>import("./review-D181tX7l.js"),[],import.meta.url),()=>W(()=>import("./mistakes-D27T-2KH.js"),[],import.meta.url),()=>W(()=>import("./redline-Dj0Zvmn_.js"),[],import.meta.url),()=>W(()=>import("./heatmap-CJtykNWz.js"),[],import.meta.url),()=>W(()=>import("./quiz-Cj_US8Am.js"),[],import.meta.url),()=>W(()=>import("./inspector-C-9uhYsn.js"),[],import.meta.url),()=>W(()=>import("./focus-BD4CQq5D.js"),[],import.meta.url),()=>W(()=>import("./conceptmap-DkvhK5Y_.js"),[],import.meta.url),()=>W(()=>import("./sprint-DXPcit9o.js"),__vite__mapDeps([0,1]),import.meta.url),()=>W(()=>import("./decision-Ca7lZVwo.js"),[],import.meta.url),()=>W(()=>import("./mental-BDB5Acye.js"),[],import.meta.url),()=>W(()=>import("./reading-ChUStPXE.js"),[],import.meta.url),()=>W(()=>import("./wordbook-Ca7-PuGq.js"),[],import.meta.url),()=>W(()=>import("./tutor-Z22EhQvz.js"),[],import.meta.url),()=>W(()=>import("./essay-D9SX4cHb.js"),[],import.meta.url),()=>W(()=>import("./settings-B8gHEf1t.js"),[],import.meta.url),()=>W(()=>import("./onboarding-6bP4wBOR.js"),[],import.meta.url),()=>W(()=>import("./photomistake-C_tCUvX2.js"),[],import.meta.url),()=>W(()=>import("./copilot-D4VRSbzx.js"),[],import.meta.url),()=>W(()=>import("./polrecite-B5B-BP4h.js"),[],import.meta.url),()=>W(()=>import("./plugincenter-DKF4I8cZ.js"),[],import.meta.url),()=>W(()=>import("./shareplaza-CoiNKn2I.js"),__vite__mapDeps([2,3]),import.meta.url),()=>W(()=>import("./vizai-CJiNeE2l.js"),[],import.meta.url),()=>W(()=>import("./shareplaza-ext-B_uYEQ_P.js"),__vite__mapDeps([4,3,5]),import.meta.url),()=>W(()=>import("./shareplaza-ai-yCidAihX.js"),__vite__mapDeps([6,3,5]),import.meta.url)];for(const e of Bh)await e();const Ls=Oa(Ep);Ls.use(Ia());Ls.use(Me);Sl();Dh();Ls.mount("#app");try{typeof window.__BOOT_READY=="function"&&window.__BOOT_READY()}catch{}
