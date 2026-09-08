const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./sprint-BVUykZNr.js","./index-PPVm8Dsz.js","./vendor-C7_tiLVl.js","./vendor-DLVrwanO.css","./shareplaza-PPk_Igeq.js","./share-HJ6npvgl.js","./shareplaza-ext-DAfxhdYb.js","./share-social-C16scoJl.js","./shareplaza-ai-BUz797Ip.js"])))=>i.map(i=>d[i]);
import{o as qa,r as wt,b as se,c as D,e as de,f as _,g as A,h as jt,i as h,u as W,j as fe,k as te,t as T,l as V,m as Ba,w as $r,n as Ra,p as Ao,q as Ur,s as To,v as Xe,x as re,F as U,y as X,A as rt,B as Ft,C as Fr,D as yr,E as Ja,G as rr,H as Ve,I as ge,J as Ha,K as Ga,L as za,M as $a,N as Qs,O as Ua,P as Fa,Q as Ka}from"./vendor-C7_tiLVl.js";import{T as Qe,P as Va}from"./share-HJ6npvgl.js";import{_ as Y}from"./index-PPVm8Dsz.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const Qa="kaoyan2026",vr="kv",Wa="mistakePhotos";let sr=null;function Xa(){return sr||(sr=qa(Qa,1,{upgrade(e){e.objectStoreNames.contains(vr)||e.createObjectStore(vr)}})),sr}function Ya(e){let t=0,n=0,r=0,s="";return(e||[]).forEach(o=>{if(!o)return;t++,n+=(o.imageBase64||"").length;const i=o.updatedAt||o.analyzedAt||o.createdAt||"";i>s&&(s=i);try{r+=JSON.stringify(o,(a,c)=>a==="imageBase64"?void 0:c).length}catch{r+=1}}),t+"|"+n+"|"+r+"|"+s}let Ws="";async function Za(e){try{const t=Ya(e);if(t===Ws)return;await(await Xa()).put(vr,JSON.parse(JSON.stringify(e||[])),Wa),Ws=t}catch(t){console.warn("[photoStore] 镜像写入失败（不影响主存储）",t)}}const Xs=864e5,x={DAY_MS:Xs,uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)},dkey(e){e=e||new Date;const t=String(e.getMonth()+1).padStart(2,"0"),n=String(e.getDate()).padStart(2,"0");return e.getFullYear()+"-"+t+"-"+n},isoDay(e){const t=new Date(e);return isNaN(t.getTime())?String(e||"").slice(0,10):x.dkey(t)},shortDate(e){return e=e?new Date(e):new Date,e.getMonth()+1+"."+e.getDate()},hm(e){return e=e||new Date,String(e.getHours()).padStart(2,"0")+":"+String(e.getMinutes()).padStart(2,"0")},daysTo(e){const t=new Date(e+"T00:00:00"),n=new Date;return n.setHours(0,0,0,0),Math.round((t-n)/Xs)},dow(e){return e=e||new Date,(e.getDay()+6)%7},weekMonday(e){e=e||new Date;const t=new Date(e);return t.setHours(0,0,0,0),t.setDate(t.getDate()-x.dow(t)),t},weekKeys(e){const t=x.weekMonday(e),n=[];for(let r=0;r<7;r++){const s=new Date(t);s.setDate(t.getDate()+r),n.push(x.dkey(s))}return n},keyLabel(e){const t=new Date(e+"T00:00:00"),n=["周一","周二","周三","周四","周五","周六","周日"][x.dow(t)];return t.getMonth()+1+"."+t.getDate()+" "+n},esc(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")},clamp(e,t,n){return Math.max(t,Math.min(n,e))},randInt(e,t){return e+Math.floor(Math.random()*(t-e+1))},pct(e,t){return t>0?Math.round(e/t*100):0},sum(e){return(e||[]).reduce((t,n)=>t+(+n||0),0)},avg(e){return e&&e.length?x.sum(e)/e.length:0},round1(e){return Math.round(e*10)/10},countBy(e,t){const n={};return(e||[]).forEach(r=>{const s=t(r);s!=null&&(n[s]=(n[s]||0)+1)}),n},topN(e,t){return Object.keys(e||{}).map(n=>({key:n,count:e[n]})).sort((n,r)=>r.count-n.count).slice(0,t||2)},lastNDays(e){const t=[],n=new Date;for(let r=e-1;r>=0;r--){const s=new Date(n);s.setDate(n.getDate()-r),t.push(x.dkey(s))}return t},inThisWeek(e){return x.weekKeys().indexOf(e)>=0},debounce(e,t){let n;return function(){clearTimeout(n);const r=arguments,s=this;n=setTimeout(()=>e.apply(s,r),t)}},clone(e){return JSON.parse(JSON.stringify(e))},download(e,t){const n=new Blob([t],{type:"application/json;charset=utf-8"}),r=document.createElement("a");r.href=URL.createObjectURL(n),r.download=e,document.body.appendChild(r),r.click(),setTimeout(()=>{URL.revokeObjectURL(r.href),r.remove()},100)},icon(e,t){return window.ICONS&&window.ICONS[e]?window.ICONS[e].replace("<svg",'<svg class="ci '+(t||"")+'"'):""},on(e,t){document.addEventListener(e,t)},emit(e,t){document.dispatchEvent(new CustomEvent(e,{detail:t}))},compressImage(e,t){t=t||{};const n=t.maxWidth||1200,r=t.quality!=null?t.quality:.7;return new Promise((s,o)=>{const i=new Image;if(i.onload=()=>{try{let a=i.width,c=i.height;if(a>n||c>n){const u=Math.min(n/a,n/c);a=Math.round(a*u),c=Math.round(c*u)}const l=document.createElement("canvas");l.width=a,l.height=c,l.getContext("2d").drawImage(i,0,0,a,c),s(l.toDataURL("image/jpeg",r))}catch(a){o(a)}},i.onerror=()=>o(new Error("图片读取失败")),typeof e=="string")i.src=e;else{const a=new FileReader;a.onload=()=>{i.src=a.result},a.onerror=()=>o(new Error("文件读取失败")),a.readAsDataURL(e)}})},bindSearch(e,t,n){if(!e)return function(){};const r=n??200;let s=!1,o=null;const i=()=>{t(e.value)},a=()=>{s=!0},c=()=>{s=!1,o&&(clearTimeout(o),o=null),i()},l=()=>{s||(o&&clearTimeout(o),o=setTimeout(()=>{o=null,i()},r))};return e.addEventListener("compositionstart",a),e.addEventListener("compositionend",c),e.addEventListener("input",l),function(){e.removeEventListener("compositionstart",a),e.removeEventListener("compositionend",c),e.removeEventListener("input",l),o&&clearTimeout(o)}},streamInto(e){e=e||{};const t=e.btn,n=e.el,r=t?t.textContent:"",s=()=>{t&&(t.disabled=!1,t.textContent=r)};function o(){if(t&&(t.disabled=!0,t.textContent=e.busyText||"生成中…"),n&&(n.innerHTML=e.placeholder||'<div class="skl-line"></div><div class="skl-line"></div><div class="skl-line skl-w60"></div>'),!window.AI||!window.AI.chatStream){s();const l=new Error("AI 模块未加载");return e.onError&&e.onError(l),Promise.reject(l)}let a=0;const c=Object.assign({},e.chatOpts||{});return e.model&&(c.model=e.model),window.AI.chatStream(e.sys||"",e.usr||"",function(l,u){if(e.onChunk){try{e.onChunk(l||"",u||"")}catch{}return}if(!n)return;const f=Date.now();if(f-a>(e.interval!=null?e.interval:300)){a=f;const d=e.tail!=null?e.tail:800,m=window.Tex&&window.Tex.repairPipeLatex?window.Tex.repairPipeLatex(l||""):l||"";n.innerHTML=x.esc(m.slice(-d)).replace(/\n/g,"<br>")+'<span class="ai-cursor"></span>'}},e.image||null,c).then(function(l){if(n&&!e.onChunk){const u=window.Tex&&window.Tex.repairPipeLatex?window.Tex.repairPipeLatex(l||""):l||"";n.innerHTML=x.esc(u).replace(/\n/g,"<br>")}return s(),e.onDone&&e.onDone(l||""),l||""}).catch(function(l){if(s(),e.onError)e.onError(l);else if(n){n.innerHTML='<div class="alert alert-danger" style="margin:6px 0">生成失败：'+x.esc(l&&l.message||l)+' <button class="btn btn-ghost btn-sm" style="margin-left:6px">'+x.esc(e.retryText||"重试")+"</button></div>";const u=n.querySelector("button");u&&(u.onclick=()=>{o().catch(()=>{})})}throw l})}const i=o();return i.catch(()=>{}),i},delegate(e,t,n,r){e&&e.addEventListener(n,function(s){const o=s.target&&s.target.closest?s.target.closest(t):null;o&&(o===e||e.contains(o))&&r.call(o,s,o)})},themeColor(e,t){try{const n=getComputedStyle(document.documentElement).getPropertyValue(e);return n&&n.trim()||t}catch{return t}},sim(e,t,n){var r=n||function(m){return String(m??"").replace(/[\s\u3000]+/g,"").replace(/[、，,。.：:；;·\-—_/\\|"'「」《》【】（）()\[\]]/g,"").toLowerCase()},s=r(e),o=r(t);if(!s||!o)return 0;var i={},a={},c=0,l=0,u,f;for(u=0;u<s.length-1;u++)i[s.substr(u,2)]=1,c++;for(u=0;u<o.length-1;u++)a[o.substr(u,2)]=1,l++;if(s.length===1&&(i[s]=1,c=1),o.length===1&&(a[o]=1,l=1),!c||!l)return 0;var d=0;for(f in i)a[f]&&d++;return(d/c+d/l)/2},secNavHtml(e){return'<div class="sec-nav">'+(e||[]).map(function(t){return'<button class="sec-nav-btn" data-sec="'+x.esc(t.id)+'">'+x.esc(t.label)+"</button>"}).join("")+"</div>"},bindSecNav(e){(e.querySelectorAll(".sec-nav-btn")||[]).forEach(function(t){t.onclick=function(){var n=e.querySelector('[data-sec-id="'+t.getAttribute("data-sec")+'"]');n&&n.scrollIntoView&&n.scrollIntoView({behavior:"smooth",block:"start"}),(e.querySelectorAll(".sec-nav-btn")||[]).forEach(function(r){r.classList.remove("sec-nav-on")}),t.classList.add("sec-nav-on")}})}},kn="kaoyan2026_data",xn="kaoyan2026_photos";function br(e){let t=0,n=0,r=0,s="";return(e||[]).forEach(o=>{if(!o)return;t++,n+=(o.imageBase64||"").length;const i=o.updatedAt||o.analyzedAt||o.createdAt||"";i>s&&(s=i);try{r+=JSON.stringify(o,(a,c)=>a==="imageBase64"?void 0:c).length}catch{r+=1}}),t+"|"+n+"|"+r+"|"+s}let Mn="";function ec(){return[]}function yn(){return{meta:{createdAt:new Date().toISOString(),version:"2.0.0",lastBackupReminder:""},tasks:ec(),taskTomb:{},tomb:{quizBank:{},mistakePhotos:{},essays:{},vocab:{},mistakes:{},plazaPosts:{},keptPosts:{},mockExams:{},playbooks:{}},completions:{},taskArchive:{},mistakes:[],studyHours:{},focus:{sessions:[],todayCount:0,todayDate:""},weeklyStats:{},milestones:{octMath:!1,novProf:!1,decPol:!1},progress:{math:{percent:0,stage:"强化阶段",modules:{高数:0,线代:0,概率:0}},ctrl:{percent:0,stage:"强化阶段",modules:{经典控制:0,现代控制:0}},eng:{percent:0,stage:"真题阶段",modules:{阅读:0,作文:0}},pol:{percent:0,stage:"基础阶段",modules:{马原:0,思修:0,史纲:0,毛中特:0}}},progressHistory:[],heat:{},heatHistory:{},mistakeDrills:[],mental:[],reading:{results:[],cards:{},customVocab:[],analysis:{}},decision:{inputs:{mathSims:[],profScore:"",engAccuracy:"",polProgress:0,xiankongScore:5},result:null,updatedAt:""},inspector:{runs:[]},playbooks:[],quizBank:[],quizHistory:[],mistakePhotos:[],essays:[],vocab:[],vocabLog:[],vocabBooks:[],polRecite:[],polReciteLog:[],polFramework:[],polTemplates:[],polChoice:[],weaknessProfile:null,plugins:[],pluginData:{},pluginConfig:{},pluginLog:[],dailyQuiz:null,dailyQuizHistory:[],aiMemory:{profile:"",facts:[],reflectCount:0,lastConsolidate:"",updatedAt:""},dailyBrief:null,copilotChats:{},ai:{endpoint:"",key:"",model:"",preset:"",stream:!1,thinkingMode:void 0,memAuto:!0,briefAuto:!0,superviseMode:"coach",lastSupervise:null,superviseLog:[],apis:[],activeApi:"",autoSwitch:!0,cacheOn:!0,cacheTTL:360},deepReview:null,weekPlan:null,majorData:{},conceptAI:{nodes:{},extra:[],path:null,updatedAt:""},share:{myGistId:"",nick:"",friends:[],recvIds:{},receivedTexts:[],sentCount:0,autoCheck:!1,plaza:{posts:[],inbox:[],blocks:[],seen:{},likes:{}}},plazaKept:{posts:[]},cloudJobs:[],cloudJob:{secretCheckedTs:0},studyBooks:[],settings:{targetSchool:"undecided",examDate:"2026-12-26",weeklyTargetHours:50,onboarded:!1,examConfig:{mathType:"shuyi",engType:"yingyi",profName:"自控原理"},coachProfile:{mathWeak:"符号错误、分式漏分母、积分因子符号反",distractions:"硬件项目、B站、游戏",redlineNote:"“二战”是违禁词，禁止说“大不了二战”"},redline:{items:null,checklist:null,keywords:""},scheduler:{useAI:!0,mathAccThreshold:70,idleDays:3,signWeekThreshold:3,signForceCount:5,polCap:2},targetScores:{math:130,prof:135,eng:70,pol:65},aiTools:{enabled:!1}},alerts:{lastNovPush:""},mistakeClusters:[],topicExplain:{},topicQuiz:{},sprintData:{trends:null,mockExams:[],hitTracker:[],rushPlan:null,reasons:{}}}}let ie=null,Ys=0;function _t(e){if(!ie){ie=wt(e);return}Object.keys(ie).forEach(t=>{delete ie[t]}),Object.keys(e).forEach(t=>{ie[t]=e[t]})}function tc(e){if(!e)return!1;if(e.name==="QuotaExceededError"||e.code===22||e.code===1014)return!0;const t=(e.message||"")+" "+(e.name||"");return/quota|exceeded|空间|storage/i.test(t)}function nc(){const e=ie;if(!e)return!1;const t=[];if((e.essays||[]).forEach(r=>{r&&r.imageBase64&&t.push({coll:"essays",id:r.id,t:r.createdAt||""})}),(e.mistakePhotos||[]).forEach(r=>{r&&r.imageBase64&&t.push({coll:"mistakePhotos",id:r.id,t:r.createdAt||""})}),!t.length)return!1;t.sort((r,s)=>(r.t||"").localeCompare(s.t||""));let n=0;for(let r=0;r<Math.min(3,t.length);r++){const s=t[r],i=(s.coll==="essays"?e.essays:e.mistakePhotos).find(a=>a.id===s.id);i&&(i.imageBase64="",n++)}return n>0}function rc(){let e=!1;for(let t=0;t<3;t++)try{const n=ie&&ie.mistakePhotos||[],r=br(n);r!==Mn&&(localStorage.setItem(xn,JSON.stringify(n)),Mn=r);const s=Object.assign({},ie);return delete s.mistakePhotos,localStorage.setItem(kn,JSON.stringify(s)),e}catch(n){if(tc(n)&&nc()){e=!0;continue}throw n}throw new Error("存储空间不足（裁剪最旧图片后仍失败）")}const b={KEY:kn,KEY_PHOTOS:xn,get(){if(ie)return ie;try{let e=null;try{const r=localStorage.getItem(xn);if(r!=null){const s=JSON.parse(r);Array.isArray(s)&&(e=s)}}catch(r){console.error("[Store] 照片分区损坏，将在下次保存时重写",r)}const t=localStorage.getItem(kn);if(!t)return _t(yn()),e&&e.length&&(ie.mistakePhotos=e),e&&(Mn=br(ie.mistakePhotos)),b.save(),ie;const n=JSON.parse(t);return _t(b.migrate(n)),e&&(ie.mistakePhotos=e,Mn=br(e)),b.normalize(ie),ie}catch(e){return console.error("[Store] 数据损坏，已重置",e),_t(yn()),b.save(),ie}},migrate(e){const t=yn();function n(s,o){if(o==null)return s;if(Array.isArray(s))return Array.isArray(o)?o:s;if(typeof s=="object"&&s!==null){const i={};return Object.keys(s).forEach(a=>{i[a]=n(s[a],o[a])}),Object.keys(o).forEach(a=>{a in i||(i[a]=o[a])}),i}return o}const r=n(t,e);return Array.isArray(r.vocabBooks)&&(r.vocabBooks=r.vocabBooks.filter(s=>!(s&&s.builtIn))),r},normalize(e){if(!e||!e.tasks)return e;if(e.taskTomb||(e.taskTomb={}),e.tasks.forEach(t=>{t&&!t.updatedAt&&(t.updatedAt=t.createdAt||new Date().toISOString())}),e.meta&&!e.meta.defaultTasksCleaned){const t=["高数强化第X章（按当前进度替换章节号）","线代：二次型标准化 + 正定判定","概率论：参数估计（矩估计/极大似然）","专业课第X节 + 课后题（按当前进度替换）","阅读真题2篇 + 定位法复盘","马原视频1节 + 肖1000对应章节"];e.tasks=e.tasks.filter(n=>!(n&&t.indexOf(n.text)>=0)),e.meta.defaultTasksCleaned=!0}return e},save(){Ys++;try{rc()&&window.Toast&&window.Toast.show("存储空间不足，已自动清理最旧的图片以保数据安全","warn",4e3)}catch(e){console.error("[Store] 保存失败",e),window.Toast&&window.Toast.show("存储失败：空间不足，请导出备份后清理","danger")}window.Cloud&&window.Cloud.schedulePush();try{Za(ie&&ie.mistakePhotos||[])}catch{}},update(e){const t=b.get();return e(t),b.save(),x.emit("store:change"),t},replace(e){_t(b.migrate(e)),b.save(),x.emit("store:change")},importBooksFromText(e){let t;try{t=JSON.parse(String(e||""))}catch(s){return{ok:!1,error:"不是合法 JSON："+s.message}}const n=Array.isArray(t)?t:t&&Array.isArray(t.studyBooks)?t.studyBooks:t&&t.chapters?[t]:null;return!n||!n.length?{ok:!1,error:"文件里没有资料库的书（需书数组 / {studyBooks:[...]} / 单本书对象）"}:n.find(s=>!s||!s.id||!Array.isArray(s.chapters))?{ok:!1,error:"有书缺 id/chapters，疑似格式不对"}:(b.update(s=>{s.studyBooks=s.studyBooks||[],n.forEach(o=>{o.importedAt=o.importedAt||new Date().toISOString();const i=s.studyBooks.findIndex(a=>a.id===o.id);i>=0?s.studyBooks[i]=o:s.studyBooks.unshift(o)})}),{ok:!0,count:n.length})},rev(){return Ys},removeFromColl(e,t){b.update(n=>{n[e]&&(n[e]=n[e].filter(r=>r.id!==t),n.tomb||(n.tomb={}),n.tomb[e]||(n.tomb[e]={}),n.tomb[e][t]=Date.now())})},markTomb(e,t){t&&b.update(n=>{n.tomb||(n.tomb={}),n.tomb[e]||(n.tomb[e]={}),n.tomb[e][t]=Date.now()})},deepUnion(e,t){if(Array.isArray(e)&&Array.isArray(t)){const n={},r=[];return e.forEach(s=>{const o=s&&s.id!=null?s.id:JSON.stringify(s);n[o]=!0,r.push(s)}),t.forEach(s=>{const o=s&&s.id!=null?s.id:JSON.stringify(s);n[o]||(n[o]=!0,r.push(s))}),r}if(e&&typeof e=="object"&&!Array.isArray(e)&&t&&typeof t=="object"&&!Array.isArray(t)){const n={};return Object.keys(e).forEach(r=>{n[r]=e[r]}),Object.keys(t).forEach(r=>{r in n?n[r]=b.deepUnion(n[r],t[r]):n[r]=t[r]}),n}return e??t},mergeAiConfig(e,t){const n=e&&typeof e=="object"?e:null,r=t&&typeof t=="object"?t:null;if(!r)return n?Object.assign({},n):void 0;const s=Object.assign({},r),o=a=>!!(a&&String(a).trim());!o(s.key)&&n&&o(n.key)&&(s.key=n.key);const i=n&&Array.isArray(n.apis)?n.apis:[];return Array.isArray(s.apis)&&(s.apis=s.apis.map(function(a){if(!a||a.id==null)return a;const c=i.filter(function(l){return l&&l.id===a.id})[0];return c&&!o(a.key)&&o(c.key)?Object.assign({},a,{key:c.key}):a})),(!Array.isArray(s.apis)||!s.apis.length)&&i.length&&(s.apis=i.slice()),s},mergeSharePlaza(e,t,n){const r=e&&e.plaza||{},s=t&&t.plaza||{};if(!t||typeof t!="object")return e||{plaza:{}};const o=(w,S,O)=>{const M=[],E={};if((Array.isArray(w)?w:[]).forEach(L=>{L&&L.id!=null&&!E[L.id]&&(E[L.id]=!0,M.push(L))}),(Array.isArray(S)?S:[]).forEach(L=>{!L||L.id==null||E[L.id]||(E[L.id]=!0,M.push(L))}),O){const L={};return M.forEach(R=>{L[R.id]=R}),(Array.isArray(w)?w:[]).forEach(R=>{if(!R||R.id==null)return;const P=(Array.isArray(S)?S:[]).find(H=>H&&H.id===R.id);P&&(L[R.id]=O(R,P))}),Object.keys(L).map(R=>L[R])}return M},i=(w,S)=>Object.assign({},S||{},w||{});t.plaza=t.plaza||{};const a=(w,S)=>{const O=Object.assign({},S,w);return O.comments=b.deepUnion(w.comments||[],S.comments||[]),O.reactions=b.deepUnion(w.reactions||[],S.reactions||[]),O},c=n||{};t.plaza.posts=o(r.posts,s.posts,a).filter(w=>!c[w.id]),t.plaza.inbox=o(r.inbox,s.inbox,a),t.plaza.seen=i(r.seen,s.seen),t.plaza.likes=i(r.likes,s.likes),t.plaza.blocks=(Array.isArray(r.blocks)?r.blocks:[]).concat((Array.isArray(s.blocks)?s.blocks:[]).filter(w=>(r.blocks||[]).indexOf(w)<0));const l=e&&Array.isArray(e.friends)?e.friends:[],u=(Array.isArray(t.friends)?t.friends:[]).filter(w=>w&&w.id);if(l.length||u.length){const w={},S=[];l.forEach(O=>{O&&O.id!=null&&!w[O.id]&&(w[O.id]=!0,S.push(O))}),u.forEach(O=>{w[O.id]||(w[O.id]=!0,S.push(O))}),t.friends=S}const f=e&&typeof e.nick=="string"?e.nick:"";f&&(t.nick=f);const d=e&&typeof e.myGistId=="string"?e.myGistId:"",m=typeof t.myGistId=="string"?t.myGistId:"";d&&m&&d!==m?t.gistConflict={local:d,remote:m,at:new Date().toISOString()}:d&&m&&d===m&&delete t.gistConflict,d&&(t.myGistId=d),t.recvIds=i(e&&e.recvIds||{},t.recvIds||{}),t.receivedTexts=b.deepUnion(e&&Array.isArray(e.receivedTexts)?e.receivedTexts:[],Array.isArray(t.receivedTexts)?t.receivedTexts:[]);const p=r&&r.threads||{},y=s&&s.threads||{},g=Object.keys(p),v=Object.keys(y);if(g.length||v.length){const w={};g.forEach(S=>{w[S]=Array.isArray(p[S])?p[S].slice():[]}),v.forEach(S=>{const O={};(w[S]||[]).forEach(E=>{E&&E.id&&(O[E.id]=!0)}),(Array.isArray(y[S])?y[S]:[]).forEach(E=>{!E||!E.id||O[E.id]||(w[S]||(w[S]=[]),w[S].push(E),O[E.id]=!0)}),Array.isArray(w[S])&&w[S].length>500&&(w[S]=w[S].slice(-500))}),t.plaza.threads=w}return t},mergeMockExams(e,t){const n=[],r={};return(Array.isArray(e)?e:[]).forEach(s=>{!s||!s.id||(n.push(s),r[s.id]=!0,s.cloudJobId&&(r["cj:"+s.cloudJobId]=!0))}),(Array.isArray(t)?t:[]).forEach(s=>{!s||!s.id||r[s.id]||s.cloudJobId&&r["cj:"+s.cloudJobId]||(n.push(s),r[s.id]=!0,s.cloudJobId&&(r["cj:"+s.cloudJobId]=!0))}),n},mergeFrom(e,t){t=t||{};const n=b.migrate(e),r=b.get(),s=Object.assign({},r.taskTomb||{},n.taskTomb||{}),o=["quizBank","mistakePhotos","essays","vocab","mistakes","playbooks"],i={};o.forEach(p=>{i[p]=Object.assign({},r.tomb&&r.tomb[p]||{},n.tomb&&n.tomb[p]||{})}),["plazaPosts","keptPosts","mockExams"].forEach(p=>{i[p]=Object.assign({},r.tomb&&r.tomb[p]||{},n.tomb&&n.tomb[p]||{})});const c=(r.tasks||[]).filter(p=>!s[p.id]),l=(n.tasks||[]).filter(p=>!s[p.id]),u=c.slice(),f={};c.forEach(p=>{f[p.id]=!0}),l.forEach(p=>{if(f[p.id]){const y=r.tasks.find(w=>w.id===p.id),g=y&&y.updatedAt?new Date(y.updatedAt).getTime():0;if((p.updatedAt?new Date(p.updatedAt).getTime():0)>g){const w=u.findIndex(S=>S.id===p.id);w>=0&&(u[w]=p)}}else u.push(p),f[p.id]=!0}),u.sort((p,y)=>(p.order!=null?p.order:Number.MAX_SAFE_INTEGER)-(y.order!=null?y.order:Number.MAX_SAFE_INTEGER));let d;if(t.preserveLocal?(d=b.deepUnion(r,n),d.tasks=u,d.taskTomb=s,o.forEach(p=>{const y=(r[p]||[]).filter(S=>!i[p][S.id]),g=(n[p]||[]).filter(S=>!i[p][S.id]),v={},w=[];y.forEach(S=>{v[S.id]=!0,w.push(S)}),g.forEach(S=>{v[S.id]||(v[S.id]=!0,w.push(S))}),d[p]=w,d.tomb||(d.tomb={}),d.tomb[p]=i[p]})):(d=n,d.tasks=u,d.taskTomb=s,o.forEach(p=>{d[p]=(d[p]||[]).filter(y=>!i[p][y.id]),d.tomb||(d.tomb={}),d.tomb[p]=i[p]})),r.ai||d.ai){const p=b.mergeAiConfig(r.ai,n.ai);p!==void 0&&(d.ai=p)}if((r.sprintData||d.sprintData)&&(d.sprintData=d.sprintData||{},d.sprintData.mockExams=b.mergeMockExams(r.sprintData&&r.sprintData.mockExams,d.sprintData.mockExams),d.sprintData.mockExams=d.sprintData.mockExams.filter(p=>!i.mockExams[p.id]),d.tomb||(d.tomb={}),d.tomb.mockExams=i.mockExams,d.sprintData.hitTracker=b.deepUnion(r.sprintData&&r.sprintData.hitTracker||[],d.sprintData.hitTracker||[])),(r.share&&r.share.plaza||d.share&&d.share.plaza)&&(d.share=b.mergeSharePlaza(r.share,d.share||{},i.plazaPosts),d.tomb||(d.tomb={}),d.tomb.plazaPosts=i.plazaPosts),r.plazaKept||d.plazaKept){const p=r.plazaKept&&r.plazaKept.posts||[],y=d.plazaKept&&d.plazaKept.posts||[],g={},v=[];(Array.isArray(p)?p:[]).forEach(w=>{w&&w.id!=null&&!g[w.id]&&(g[w.id]=!0,v.push(w))}),(Array.isArray(y)?y:[]).forEach(w=>{w&&w.id!=null&&!g[w.id]&&(g[w.id]=!0,v.push(w))}),d.plazaKept={posts:v.filter(w=>!i.keptPosts[w.id])},d.tomb||(d.tomb={}),d.tomb.keptPosts=i.keptPosts}(r.settings&&r.settings.onboarded||r.completions&&Object.keys(r.completions).length>0||r.studyHours&&Object.keys(r.studyHours).length>0||r.mistakes&&r.mistakes.length>0||r.tasks&&r.tasks.length>6)&&d.settings&&(d.settings.onboarded=!0);{const p=r.cloudJob,y=d.cloudJob,g=p&&p.secretCheckedTs>0?p.secretCheckedTs:0,v=y&&y.secretCheckedTs>0?y.secretCheckedTs:0,w=Math.max(g,v);w>0&&(d.cloudJob=Object.assign({},y||{},p||{},{secretCheckedTs:w}))}_t(d),b.save(),x.emit("store:change")},resetAll(){_t(yn()),b.save(),x.emit("store:change")},exportJSON(){return JSON.stringify(b.get(),null,2)},usageBytes(){return((localStorage.getItem(kn)||"")+(localStorage.getItem(xn)||"")).length*2},usageEstimate(e){try{navigator.storage&&navigator.storage.estimate?navigator.storage.estimate().then(t=>e({used:t.usage||0,quota:t.quota||0,approx:!1})).catch(()=>e({used:b.usageBytes(),quota:0,approx:!0})):e({used:b.usageBytes(),quota:0,approx:!0})}catch{e({used:b.usageBytes(),quota:0,approx:!0})}},todayTaskStats(){const e=b.get(),t=e.completions[x.dkey()]||[],n={math:[0,0],ctrl:[0,0],eng:[0,0],pol:[0,0]};return e.tasks.forEach(r=>{n[r.subject]&&(n[r.subject][1]++,(r.done||t.indexOf(r.id)>=0)&&n[r.subject][0]++)}),n},todayAllDone(){const e=b.todayTaskStats();let t=0,n=0;return Object.keys(e).forEach(r=>{t+=e[r][1],n+=e[r][0]}),t>0&&n===t},weekHours(){const e=b.get();return x.weekKeys().map(t=>e.studyHours[t]||0)},todayHours(){return b.get().studyHours[x.dkey()]||0},addHours(e){b.update(t=>{const n=x.dkey();t.studyHours[n]=x.round1((t.studyHours[n]||0)+e)})},studyStreak(){const e=b.get();let t=0;for(let n=0;n<90;n++){const r=x.dkey(new Date(Date.now()-n*x.DAY_MS));if((e.studyHours[r]||0)>0||(e.completions[r]||[]).length>0)t++;else{if(n===0)continue;break}}return t},mistakeCountToday(e){const t=x.dkey();return b.get().mistakes.filter(n=>x.isoDay(n.createdAt)===t&&(!e||n.type===e)).length},mistakeCountWeek(e){return b.get().mistakes.filter(t=>x.inThisWeek(x.isoDay(t.createdAt))&&(!e||t.type===e)).length},weekTopMistakes(){const e=b.get().mistakes.filter(t=>x.inThisWeek(x.isoDay(t.createdAt)));return x.topN(x.countBy(e,t=>t.type),2)},currentMathAccuracy(){const e=b.get(),t=b.weekKey(),n=e.weeklyStats[t];return n&&typeof n.mathAccuracy=="number"?n.mathAccuracy:null},recomputeMathAccuracy(){const e=b.get(),t=b.weekKey(),n=i=>i?i[0]==="m"?"math":i[0]==="c"?"ctrl":i[0]==="e"?"eng":"pol":"",r=[];(e.quizHistory||[]).forEach(i=>{n(i.topicId)==="math"&&i.createdAt&&x.inThisWeek(x.isoDay(i.createdAt))&&typeof i.score=="number"&&r.push(i.score)});const s=i=>i&&i.subject==="math"&&i.selfEval&&x.inThisWeek(i.date)&&(i.selfEval==="known"||i.selfEval==="unknown");if([e.dailyQuiz].concat(e.dailyQuizHistory||[]).forEach(i=>{s(i)&&r.push(i.selfEval==="known"?100:0)}),!r.length)return;const o=Math.round(r.reduce((i,a)=>i+a,0)/r.length);b.update(i=>{if(i.weeklyStats[t]=i.weeklyStats[t]||{},i.weeklyStats[t].mathAccuracy==null){const a=Object.keys(i.weeklyStats).filter(l=>l<t&&i.weeklyStats[l]&&typeof i.weeklyStats[l].mathAccuracy=="number").sort(),c=a[a.length-1];c&&(i.weeklyStats[t].prevAccuracy=i.weeklyStats[c].mathAccuracy)}i.weeklyStats[t].mathAccuracy=o})},weekKey(e){e=e||new Date;const t=x.weekMonday(e),n=t.getFullYear(),r=new Date(n,0,1),s=Math.ceil(((t-r)/x.DAY_MS+r.getDay()+1)/7);return n+"-W"+String(s).padStart(2,"0")},profHardScore(){return b.get().decision.inputs.xiankongScore||0},profAdvancedPercent(){try{const e=window.DB.getActiveMajor().alertRule,t=e&&e.hardModule?e.hardModule:"现代控制",n=b.get().progress.ctrl.modules,r=Object.keys(n);for(let s=0;s<r.length;s++)if(r[s].indexOf(t)>=0||t.indexOf(r[s])>=0)return n[r[s]]||0;return r.length>0&&n[r[0]]||0}catch{return 0}},xiankongScore(){return b.profHardScore()},xiankongPercent(){return b.profAdvancedPercent()},addMistake(e){let t=null;return b.update(n=>{if(e.dedupKey){const s=n.mistakes.find(o=>o.dedupKey===e.dedupKey);if(s){e.stem&&!s.stem&&(s.stem=e.stem),e.answer!=null&&!s.answer&&(s.answer=e.answer),e.solution&&!s.solution&&(s.solution=e.solution),e.trap&&!s.trap&&(s.trap=e.trap),e.desc&&!s.desc&&(s.desc=e.desc),e.type&&!s.type&&(s.type=e.type),t=s.id;return}}const r={id:x.uid(),subject:e.subject||"math",type:e.type||"other",desc:e.desc||(e.stem?String(e.stem).slice(0,60):"错题"),date:x.shortDate(),createdAt:new Date().toISOString()};e.stem&&(r.stem=e.stem),e.answer!=null&&(r.answer=e.answer),e.solution&&(r.solution=e.solution),e.trap&&(r.trap=e.trap),e.refId&&(r.refId=e.refId),e.source&&(r.source=e.source),e.dedupKey&&(r.dedupKey=e.dedupKey),e.reviewPlan&&(r.reviewPlan=e.reviewPlan),n.mistakes.push(r),t=r.id}),t},subjectDoneInDays(e,t){const n=b.get(),r=x.lastNDays(t);for(const s of r)if(s===x.dkey()){const o=n.completions[s]||[];if(n.tasks.some(i=>i.subject===e&&(i.done||o.indexOf(i.id)>=0)))return!0}else if((n.taskArchive[s]||[]).some(i=>i.subject===e&&i.done))return!0;return!1}},Q={show(e,t,n){const r=document.getElementById("toast-wrap");if(!r)return;const s=document.createElement("div");s.className="toast toast-"+(t||"info"),s.innerHTML="<span>"+e+'</span><button class="toast-x" aria-label="关闭">×</button>',r.appendChild(s),requestAnimationFrame(()=>s.classList.add("show"));const o=()=>{s.classList.remove("show"),setTimeout(()=>s.remove(),200)};s.querySelector(".toast-x").onclick=o,setTimeout(o,n||3e3)},success(e){Q.show(e,"success")},warn(e){Q.show(e,"warn",4200)},danger(e){Q.show(e,"danger",5e3)}},xe={open(e){xe.close();const t=document.createElement("div");t.className="modal-overlay",t.id="modal-overlay";const n=document.createElement("div");n.className="modal"+(e.wide?" modal-wide":"");let r="";(e.actions||[]).forEach((i,a)=>{r+='<button class="btn '+(i.kind||"btn-ghost")+'" data-act="'+a+'">'+x.esc(i.label)+"</button>"}),n.innerHTML='<div class="modal-head"><span class="modal-title">'+e.title+"</span>"+(e.dismissable===!1?"":'<button class="modal-x" aria-label="关闭">×</button>')+'</div><div class="modal-body">'+e.html+"</div>"+(r?'<div class="modal-foot">'+r+"</div>":""),t.appendChild(n),document.body.appendChild(t),document.body.style.overflow="hidden";const s=()=>{xe.close(),e.onClose&&e.onClose()},o=n.querySelector(".modal-x");return o&&(o.onclick=s),e.dismissable!==!1&&t.addEventListener("click",i=>{i.target===t&&s()}),(e.actions||[]).forEach((i,a)=>{n.querySelector('[data-act="'+a+'"]').onclick=()=>{i.onClick?i.onClick(s):s()}}),requestAnimationFrame(()=>t.classList.add("show")),s},close(){const e=document.getElementById("modal-overlay");e&&(e.remove(),document.body.style.overflow="")},confirm(e,t,n,r,s){xe.open({title:e,html:t,actions:[{label:"取消",kind:"btn-ghost"},{label:n||"确定",kind:s?"btn-danger":"btn-primary",onClick:o=>{o(),r&&r()}}]})}};let It=null;function sc(){return It&&document.getElementById("ai-float")?It:(It=null,null)}function Zs(e){const t=document.getElementById("ai-float");t&&t.parentNode&&t.parentNode.removeChild(t);const n=document.createElement("div");n.id="ai-float",n.className="cm-ai-float",n.innerHTML='<div class="ai-float-ball-ico" title="单击展开 · 双击彻底关闭 · 可拖拽">💭</div><div class="cm-ai-float-h"><span>'+e+'</span><button class="cm-ai-float-x" aria-label="收起为小球">×</button></div><div class="cm-ai-float-b"><div class="muted-sm cm-ai-float-status" id="ai-float-status">⏳ 正在连接模型…</div><details class="cm-ai-float-think" id="ai-float-think" style="display:none"><summary class="cm-ai-float-label" style="cursor:pointer;user-select:none">💭 思考过程（点击展开/收起）</summary><pre class="report" id="ai-float-think-t"></pre></details><div class="cm-ai-float-tools" id="ai-float-tools" style="display:none"></div><div class="cm-ai-float-content" id="ai-float-content" style="display:none"><div class="cm-ai-float-label">📝 生成内容</div><pre class="report" id="ai-float-content-t"></pre></div></div>',document.body.appendChild(n);let r=!1,s=!1,o=0,i=0,a=0,c=0;n.addEventListener("mousedown",function(y){if(!n.classList.contains("ai-float-ball"))return;r=!0,s=!1,o=y.clientX,i=y.clientY;const g=n.getBoundingClientRect();a=g.left,c=g.top,y.preventDefault()}),document.addEventListener("mousemove",function(y){if(!r)return;const g=y.clientX-o,v=y.clientY-i;(Math.abs(g)>5||Math.abs(v)>5)&&(s=!0),n.style.left=a+g+"px",n.style.top=c+v+"px",n.style.right="auto",n.style.bottom="auto"}),document.addEventListener("mouseup",function(){r=!1}),n.addEventListener("click",function(){!n.classList.contains("ai-float-ball")||s||f()}),n.addEventListener("dblclick",function(){n.classList.contains("ai-float-ball")&&(n.remove(),r=!1)});let l=null;n.addEventListener("touchstart",function(y){if(!n.classList.contains("ai-float-ball"))return;const g=y.touches[0];l={x:g.clientX,y:g.clientY,ox:n.offsetLeft,oy:n.offsetTop,moved:!1}},{passive:!0}),n.addEventListener("touchmove",function(y){if(!l)return;const g=y.touches[0],v=g.clientX-l.x,w=g.clientY-l.y;(Math.abs(v)>5||Math.abs(w)>5)&&(l.moved=!0),n.style.left=l.ox+v+"px",n.style.top=l.oy+w+"px",n.style.right="auto",n.style.bottom="auto"},{passive:!0}),n.addEventListener("touchend",function(){l&&!l.moved&&n.classList.contains("ai-float-ball")&&f(),l=null},{passive:!0});function u(){n.classList.add("ai-float-ball"),n.style.left="auto",n.style.top="auto",n.style.right="16px",n.style.bottom="24px"}function f(){n.classList.remove("ai-float-ball"),n.style.left="auto",n.style.top="auto",n.style.right=(window.innerWidth<420?8:16)+"px",n.style.bottom="16px"}const d=n.querySelector(".cm-ai-float-x");d&&(d.onclick=function(y){y.stopPropagation(),u()});const m=function(){return document.getElementById("ai-float-status")},p={status(y){const g=m();g&&(g.textContent=y)},content(y){const g=document.getElementById("ai-float-content"),v=document.getElementById("ai-float-content-t");g&&v&&(g.style.display="",v.textContent=window.Tex&&window.Tex.repairPipeLatex?window.Tex.repairPipeLatex(y||""):y||"",v.scrollTop=v.scrollHeight)},think(y){const g=document.getElementById("ai-float-think"),v=document.getElementById("ai-float-think-t");g&&v&&(g.style.display="",v.textContent=y||"")},html(y){const g=document.getElementById("ai-float-content"),v=document.getElementById("ai-float-content-t");g&&v&&(g.style.display="",y==null?v.textContent="":v.innerHTML=y)},done(){const y=m();y&&(y.textContent="✓ 完成")},fail(y){const g=m();g&&(g.textContent="⚠ "+y)},close(){n.remove(),r=!1,l=null,It===p&&(It=null)},toolTask(y,g){g=g||{};const v=!!g.primary,w=n.querySelector("#ai-float-tools");w&&(w.style.display="");const S=document.createElement("div");S.className="at-ftask",S.setAttribute("data-testid","at-ftask"),S.innerHTML='<div class="at-ftask-h"><span class="at-ftask-t">🛠 '+x.esc(y)+'</span><span class="at-ftask-tag" data-k="tag" style="background:#8c8c8c">进行中</span><button class="at-ftask-x" data-k="x" title="取消任务">×</button></div><div class="at-ftask-st" data-k="st">⏳ 已发起，等待模型响应…</div><div class="at-ftask-b" data-k="body"></div>',w&&w.appendChild(S);const O=function(I){return S.querySelector('[data-k="'+I+'"]')},M=O("st"),E=O("tag"),L=O("body"),R=[];function P(I){M&&(M.textContent=I),v&&p.status(I)}let H=Date.now(),B=null;function z(){B&&(clearInterval(B),B=null)}B=setInterval(function(){const I=Math.round((Date.now()-H)/1e3),J=M?M.textContent:"";J&&J.indexOf("等待模型响应")>=0&&P("⏳ 已发起，等待模型响应…（"+I+"s）")},1e3);const j={cancelled:!1,onCancel(I){R.push(I)},setStatus(I,J){z(),P(I),J&&E&&(E.style.background=J)},roundStream(I,J){if(!L)return;let N=L.querySelector("[data-draft]");(!N||N.getAttribute("data-draft")!==String(I))&&(L.querySelectorAll("[data-draft]").forEach(function(ne){ne.remove()}),N=document.createElement("details"),N.setAttribute("data-draft",String(I)),N.open=!0,N.innerHTML="<summary>🛠 第 "+I+" 轮 · 正在构造 Python 代码…</summary><pre></pre>",L.appendChild(N));const F=N.querySelector("pre");F&&(F.textContent=J)},step(I){if(!L)return;L.querySelectorAll("[data-draft]").forEach(function(N){N.remove()});const J=document.createElement("details");L.querySelectorAll("details").forEach(function(N){N.open=!1}),J.open=!0,J.innerHTML="<summary>🛠 第 "+I.round+" 轮 · Python 执行"+(I.error?"（出错，已回传修正）":" ✓")+"</summary><pre>"+x.esc(I.code||"")+"</pre><pre>→ 输出："+x.esc(I.output||"(无)")+(I.error?`
错误：`+x.esc(I.error):"")+"</pre>"+(I.image?'<img src="'+x.esc(I.image)+'" alt="工具产图">':""),L.appendChild(J)},think(I){p.think(String(I||""))},writing(I){j.setStatus("✍ 正在撰写最终回答…","#1a7f37"),v&&I!=null&&p.content(I)},finish(){z(),E&&(E.textContent="完成",E.style.background="#237804"),j.setStatus("✓ 完成"),v&&p.done()},fail(I){z(),E&&(E.textContent="失败",E.style.background="#cf1322"),j.setStatus("⚠ "+I),v&&p.fail(I)}},C=O("x");return C&&(C.onclick=function(I){I&&I.stopPropagation&&I.stopPropagation(),j.cancelled=!0,j.setStatus("已取消（中断中…）","#8c8c8c"),R.slice().forEach(function(J){try{J()}catch{}})}),j}};return It=p,p}const Eo={aiFloat:Zs,openAiFloat:Zs},Oo="https://api.github.com",sn="kaoyan2026.json",Kr="core.json",Ke="manifest.json",Io="kaoyan2026-sync",Vr="kaoyan2026-sync-bulk",Qr="kaoyan2026_ghtoken",Mo="kaoyan2026_cloud",eo=1500,Po=3e5,oc=[{ms:0,label:"实时",tip:"每次改动 1.5s 后推送（同步次数最多，密集操作易触发限流）"},{ms:6e4,label:"每 1 分钟",tip:"接近实时，适合双设备频繁切换"},{ms:12e4,label:"每 2 分钟",tip:"较均衡"},{ms:3e5,label:"每 5 分钟",tip:"默认推荐，大幅省同步次数"},{ms:6e5,label:"每 10 分钟",tip:"更省，跨设备看到更新稍慢"},{ms:18e5,label:"每 30 分钟",tip:"最省同步次数，适合单机为主"}],Co=6e4,No=15e3,ic=[{ms:15e3,label:"每 15 秒",tip:"最快感知其他设备的更新（API 配额消耗最多）"},{ms:3e4,label:"每 30 秒",tip:"较快"},{ms:6e4,label:"每 1 分钟",tip:"默认推荐（ETag 命中时零流量，仅占 1 点配额）"},{ms:3e5,label:"每 5 分钟",tip:"均衡，适合不常切设备"},{ms:6e5,label:"每 10 分钟",tip:"更省配额"},{ms:18e5,label:"每 30 分钟",tip:"最省，跨设备更新感知最慢"}],ac="https://github.com/settings/tokens/new?scopes=gist&description=kaoyan2026同步",ae=["quizBank","mistakePhotos","essays","vocab","mistakes","dailyQuizHistory","mistakeDrills","playbooks"],Wr={quizBank:"题库",mistakePhotos:"错题照片",essays:"作文",vocab:"单词本",mistakes:"文本错题",dailyQuizHistory:"每日一题历史",mistakeDrills:"错题重练",playbooks:"解题方法卡"},ke=["copilotChats","majorData","deepReview","conceptAI","sprintData","plugins","pluginData","pluginConfig","pluginLog","share","plazaKept"],Pn={copilotChats:"AI对话",majorData:"专业数据",deepReview:"深度复盘",conceptAI:"概念图谱AI",sprintData:"押题出卷",plugins:"插件源码",pluginData:"插件数据",pluginConfig:"插件配置",pluginLog:"插件日志",share:"星屿广场",plazaKept:"星藏包"},Xr=/^op-\d+-[A-Za-z0-9_-]+\.json$/,cc=/^(quizBank|mistakePhotos|essays|vocab)\.ops\.json$/,on=8,k={enabled:!1,token:null,gistId:null,bulkGistId:null,lastPushedAt:0,lastSyncAt:0,pollTimer:null,badge:null,lastPushAttemptAt:0,badgeBaseTitle:"",pushing:!1,rateLimitBackoffUntil:0,lastTransfer:null,syncPhase:"idle",syncLog:[],pendingBulk:[]};let ft=!1,st=null,q=lc();function lc(){let e;try{e=JSON.parse(localStorage.getItem(Mo))}catch{e=null}e=e||{};try{localStorage.getItem("kaoyan2026_syncKeyMigrated")?e.syncAiKey===void 0&&(e.syncAiKey=!0):(e.syncAiKey=!0,localStorage.setItem("kaoyan2026_syncKeyMigrated","1"),e.pushedHashes&&(delete e.pushedHashes.core,delete e.pushedHashes.manifest))}catch{e.syncAiKey===void 0&&(e.syncAiKey=!0)}return e.pushedHashes=e.pushedHashes||{},e.deviceId||(e.deviceId="dev-"+Math.random().toString(36).slice(2,10)),e.opCursor=e.opCursor||{},e.appliedOps=Array.isArray(e.appliedOps)?e.appliedOps:[],e.compactGen=e.compactGen||0,e.opCount=e.opCount||0,e.bulkHashes=e.bulkHashes||{},(e.pushIntervalMs===void 0||e.pushIntervalMs===null)&&(e.pushIntervalMs=Po),(e.pullIntervalMs===void 0||e.pullIntervalMs===null)&&(e.pullIntervalMs=Co),e}function He(){q.gistId=k.gistId,q.bulkGistId=k.bulkGistId,q.lastPushedAt=k.lastPushedAt,q.lastSyncAt=k.lastSyncAt;try{localStorage.setItem(Mo,JSON.stringify(q))}catch{}}function Cn(){var e=q.pushIntervalMs;return e===0?0:typeof e!="number"||!(e>0)?Po:e}function wr(){var e=q.pullIntervalMs;return typeof e!="number"||!(e>=No)?Co:e}function uc(){try{return localStorage.getItem(Qr)||""}catch{return""}}function dc(){try{localStorage.setItem(Qr,k.token)}catch{}}function fc(){try{localStorage.removeItem(Qr)}catch{}}const pc=20;function Me(e){k.syncPhase=e,e==="idle"?pe("☁ 已同步","on"):e==="downloading"?pe("⬇ 下载中…","busy"):e==="uploading"?pe("⬆ 上传中…","busy"):e==="uploading-bulk"?pe("⬆ 上传大数据…","busy"):e==="merging"&&pe("🔄 整合中…","busy")}function Nn(e,t,n,r){k.syncLog.unshift({ts:Date.now(),phase:e,durationMs:Math.round(t),detail:n||"",bytes:r||0}),k.syncLog.length>pc&&k.syncLog.pop()}function qe(e){return(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Oe(e){e=String(e??"");let t=2166136261,n=2538058380;for(let r=0;r<e.length;r++){const s=e.charCodeAt(r);t=Math.imul(t^s,16777619)>>>0,n=Math.imul(n^s,16777643)>>>0}return t=(t^e.length)>>>0,n=(n^Math.imul(e.length,31))>>>0,("00000000"+t.toString(16)).slice(-8)+("00000000"+n.toString(16)).slice(-8)}function Yr(){return Date.now()<k.rateLimitBackoffUntil}function an(e){const t=Math.min(3e4*Math.pow(2,e),3e5);k.rateLimitBackoffUntil=Date.now()+t,console.warn("[Cloud] 触发 API 限额退避，"+Math.round(t/1e3)+"秒内跳过请求")}const hc={429:1,500:1,502:1,503:1,504:1},gc={GET:1,HEAD:1,PATCH:1,PUT:1,DELETE:1},vn=[800,2e3,4500];function mc(e){return new Promise(t=>setTimeout(t,e))}function yc(e){try{const t=e.headers&&e.headers.get?e.headers.get("X-RateLimit-Remaining"):null;return t!=null&&String(t)==="0"}catch{return!1}}function vc(e,t){return e===401?"auth":e===403?"ratelimit":e===404?"notfound":e===429?"ratelimit":e>=500?"server":"other"}function bc(e,t,n){return e==="auth"?"登录已失效或权限不足（"+t+"）：请到「设置 → 云同步」重新登录 GitHub":e==="ratelimit"?n?"已达 GitHub API 限额，稍后自动重试（可稍等片刻再手动同步）":"无权限访问该资源（"+t+"）：请检查令牌的 gist 权限":e==="notfound"?"资源不存在（"+t+"）：Gist 可能已在别处被删除":e==="network"?"网络连接失败：请检查网络后重试":e==="server"?"GitHub 服务暂时不可用（"+t+"），已自动重试":"HTTP "+t}function bn(e,t,n,r){const s=new Error(e);return s.status=t||0,s.kind=n||"other",r&&(s.retries=r),s}function wc(e,t,n){const r=n||3e4;if(typeof AbortController>"u")return fetch(e,t);const s=new AbortController,o=setTimeout(()=>{try{s.abort()}catch{}},r);return fetch(e,Object.assign({},t,{signal:s.signal})).then(i=>(clearTimeout(o),i)).catch(i=>{clearTimeout(o);const a=i&&i.name==="AbortError",c=new Error(a?"请求超时（>"+Math.round(r/1e3)+"s）":i&&i.message||"网络错误");throw c.isNetwork=!0,c.isTimeout=!!a,c})}function kc(e){if(e&&e.timeoutMs!=null)return e.timeoutMs;const t=e&&e.body;if(!t)return 3e4;const r=(typeof t=="string"?t:JSON.stringify(t)).length;return r>=3*1024*1024?3e5:r>=1024*1024?24e4:r>=500*1024?12e4:r>=100*1024?6e4:3e4}async function Ae(e,t){if(Yr())throw bn("HTTP 403（退避中，"+Math.ceil((k.rateLimitBackoffUntil-Date.now())/1e3)+"s 后恢复）",403,"ratelimit");t=t||{};const n=String(t.method||"GET").toUpperCase(),r=!!gc[n],s=t.retries===0||!r?1:t.retries||vn.length+1,o=kc(t);let i=null;for(let a=0;a<s;a++){a>0&&await mc(vn[a-1]||vn[vn.length-1]);let c=null;try{c=await wc(Oo+e,{method:n,headers:(function(){const u={Authorization:"Bearer "+k.token,Accept:"application/vnd.github+json","Content-Type":"application/json"};return t.etag&&(u["If-None-Match"]=t.etag),u})(),body:t.body?JSON.stringify(t.body):void 0},o)}catch(u){if(u.status=0,u.kind="network",i=u,!r||a>=s-1)break;continue}const l=c.headers&&c.headers.get?c.headers.get("ETag"):null;if(c.status===304)return{status:304,etag:t.etag||l,data:null};if(!c.ok){const u=yc(c),f=vc(c.status),d=bc(f,c.status,u);u&&an(0);const m=!!hc[c.status]&&r;if(i=bn(d,c.status,f,a),!m||a>=s-1)break;continue}try{const u=await c.text();return{status:c.status,etag:l,data:u?JSON.parse(u):null}}catch(u){i=bn("响应解析失败："+(u&&u.message||u),c.status,"parse",a);break}}throw i&&i.retries&&(i.message+="（已重试 "+i.retries+" 次）"),i||bn("请求失败",0,"other")}async function $e(e){if(!e)return null;if(e.truncated&&e.raw_url){const t=await fetch(e.raw_url);if(!t.ok)throw new Error("raw 拉取失败 HTTP "+t.status);return await t.text()}return e.content}async function Lo(e,t){return(await Ae("/gists",{method:"POST",body:{description:e,public:!1,files:t}})).data.id}async function pt(e,t){return(await Ae("/gists/"+e,{method:"PATCH",body:{files:t}})).etag}function kr(e,t){const n={};return(t||ae).forEach(r=>{n[r+".json"]={content:e[r]}}),n}async function xc(e){return await Lo(Vr,kr(e))}async function Fn(){let e=1,t=null,n="",r=null,s=-1;for(;e<=10;){let o;try{o=(await Ae("/gists?per_page=100&page="+e)).data}catch(i){throw i&&(i.status===403||i.status===429||i.status>=500)&&(i.transient=!0),i}if(!o||!o.length)break;for(const i of o){const a=i.files||{};if(a[Ke]){const c=i.updated_at||"";(!t||c>n)&&(t=i.id,n=c)}else if(a[sn]){const c=a[sn].size||0;c>s&&(s=c,r=i.id)}}e++}return t||r||null}async function Sc(){let e=1,t=null,n="";for(;e<=10;){let r;try{r=(await Ae("/gists?per_page=100&page="+e)).data}catch(s){throw s&&(s.status===403||s.status===429||s.status>=500)&&(s.transient=!0),s}if(!r||!r.length)break;for(const s of r)if(s.description===Vr){const o=s.updated_at||"";(!t||o>n)&&(t=s.id,n=o)}e++}return t}function _c(e){typeof e.key=="string"&&(e.key=""),Array.isArray(e.apis)&&e.apis.forEach(t=>{t&&typeof t.key=="string"&&(t.key="")})}function Ln(e){const t=Object.assign({},e);return ae.forEach(n=>{delete t[n]}),ke.forEach(n=>{delete t[n]}),t}function to(){try{return window.Store&&window.Store.rev?window.Store.rev():0}catch{return 0}}const or=new WeakMap;function xr(e){if(e&&or.has(e)){const n=or.get(e);if(n&&n.rev===to())return n.hash}const t=Oe(JSON.stringify(e||[]));try{e&&or.set(e,{hash:t,rev:to()})}catch{}return t}function Sr(e){return!e||!e.length?[]:e.map(function(t){return Object.assign({},t)})}function jo(e){return e.cloudJob&&e.cloudJob.wftoken&&(e.cloudJob=Object.assign({},e.cloudJob),delete e.cloudJob.wftoken),q.syncAiKey!==!0&&e.ai&&(e.ai=JSON.parse(JSON.stringify(e.ai)),_c(e.ai)),e}function Do(){const e=window.Store.get(),t={};for(const n in e)ae.indexOf(n)<0&&ke.indexOf(n)<0&&(t[n]=e[n]);return JSON.stringify(jo(t))}function jn(e){if(e==null||typeof e!="object")try{return JSON.stringify(e)}catch{return String(e)}if(Array.isArray(e))return"["+e.map(jn).join(",")+"]";const t={};for(const n in e)n.length>6&&n.slice(-6)==="Base64"||(t[n]=jn(e[n]));return JSON.stringify(t)}function Zr(e,t,n){const r=[],s={},o={};return(e||[]).forEach(i=>{i&&i.id!=null&&(s[i.id]=i)}),(t||[]).forEach(i=>{i&&i.id!=null&&(o[i.id]=i)}),Object.keys(o).forEach(i=>{const a=o[i];i in s?jn(s[i])!==jn(a)&&r.push({op:"upd",id:i,item:a}):r.push({op:"add",id:i,item:a})}),Object.keys(s).forEach(i=>{!(i in o)&&n&&n[i]&&r.push({op:"del",id:i})}),r}function qo(e,t,n){const r={};return(e||[]).forEach(s=>{s&&s.id!=null&&(r[s.id]=s)}),(t||[]).forEach(s=>{if(!(!s||s.id==null))if(s.op==="del")delete r[s.id];else{if(n&&n[s.id])return;r[s.id]=s.item}}),Object.keys(r).map(s=>r[s])}async function Ac(e){if(!k.bulkGistId)return null;try{const t=await Ae("/gists/"+k.bulkGistId,{etag:null});if(t.data&&t.data.files){const n=t.data.files[e+".json"];if(n){const r=await $e(n);if(r!=null)return JSON.parse(r)}}}catch{}return null}function Bo(e,t){return"op-"+(e||Date.now())+"-"+(t||"dev")+"-"+Math.random().toString(36).slice(2,7)+".json"}async function Tc(e,t,n,r,s){const o={};let i=!1;for(const a of e){let c=n&&n[a]||[];if(!c.length)try{c=await Ac(a)}catch{c=[]}const l=Zr(c,t[a]||[],r&&r[a]||{});l.length&&(o[a]=l,i=!0)}return i?{gen:s||0,ts:Date.now(),dev:q.deviceId,ops:o}:null}function Ro(e,t,n){e=e||{};const r={};return ae.forEach(s=>{r[s]=(e[s]||[]).slice()}),(t||[]).forEach(s=>{const o=s&&s.ops;o&&ae.forEach(i=>{o[i]&&o[i].length&&(r[i]=qo(r[i],o[i],n&&n[i]||{}))})}),r}function Ec(){const e=JSON.parse(window.Store.exportJSON());return jo(e)}function no(e,t){ft=!0;try{window.Store.mergeFrom(e,t||{})}finally{ft=!1}window.App&&App.refresh(),window.Onboarding&&Onboarding.dismissIfNeeded&&Onboarding.dismissIfNeeded()}async function Be(e,t){if(!k.gistId){k.lastSyncAt=Date.now(),He();return}const n=performance.now();Me("downloading");const r={pulled:[],pushed:[],bytes:0};let s;try{s=await Ae("/gists/"+k.gistId,{etag:e?null:q.coreEtag})}catch(N){throw N&&N.status===404&&(N.deadGist=!0),N}if(s.status===304){Me("idle"),Nn("拉取",performance.now()-n,"304 无变化",0),k.lastSyncAt=Date.now(),He(),k.lastTransfer=r;return}q.coreEtag=s.etag;const o=s.data;if(!o||!o.files){k.lastSyncAt=Date.now(),He();return}const i=o.files,a=o.updated_at?new Date(o.updated_at).getTime():Date.now();if(!i[Ke]&&i[sn]){const N=await $e(i[sn]);if(N){r.bytes+=he(N),r.pulled.push("整包(旧格式)");try{const F=Oe(JSON.stringify(Ec()));Oe(N)!==F&&no(JSON.parse(N),t)}catch(F){console.error("[Cloud] 旧格式解析/合并失败",F)}}q.legacyRemote=!0,k.lastPushedAt=a,k.lastSyncAt=Date.now(),He(),k.lastTransfer=r;return}const c=await $e(i[Kr]),l=await $e(i[Ke]);if(!c||!l){k.lastSyncAt=Date.now(),He();return}r.bytes+=he(c)+he(l),r.pulled.push("核心");let u,f;try{u=JSON.parse(c),f=JSON.parse(l)}catch(N){console.error("[Cloud] 核心数据解析失败",N);return}q.legacyRemote=!1,f.bulkGistId&&(k.bulkGistId=f.bulkGistId);const d=f.compactGen||0,m=Object.keys(i).filter(N=>cc.test(N)),p=Object.keys(i).filter(N=>Xr.test(N)),y=m.length&&!p.length;if(y){const N={};m.forEach(F=>N[F]=null);try{await pt(k.gistId,N)}catch{}q.compactGen||(q.compactGen=1)}const g=Object.assign({},window.Store.get()),v=g.tomb||{},w=(y||d>(q.compactGen||0))&&!!k.bulkGistId,S={},O={};if(w){const N=await Ae("/gists/"+k.bulkGistId,{etag:e?null:q.bulkEtag});if(N.status!==304&&N.data&&N.data.files){q.bulkEtag=N.etag;for(const F of ae){const ne=N.data.files[F+".json"];if(ne){const ce=await $e(ne);ce!=null&&(r.bytes+=he(ce),r.pulled.push(Wr[F]+"(快照)"),S[F]=JSON.parse(ce))}}for(const F of ke){const ne=N.data.files[F+".json"];if(ne){const ce=await $e(ne);ce!=null&&(r.bytes+=he(ce),r.pulled.push((Pn[F]||F)+"(快照)"),O[F]=JSON.parse(ce))}}}q.compactGen=d||(y?1:q.compactGen||0),q.appliedOps=[],q.opCount=0}const M={};(q.appliedOps||[]).forEach(N=>M[N]=1);const E=[];for(const N of p)if(!M[N])try{const F=await $e(i[N]);if(!F)continue;const ne=JSON.parse(F);if(!ne||!ne.ops)continue;ne.__name=N,E.push(ne),r.bytes+=he(F)}catch{}E.sort((N,F)=>(N.ts||0)-(F.ts||0)),E.length&&r.pulled.push("op×"+E.length);const L=w?S:g,R=Ro(L,E,v),P=Object.assign({},u);if(ae.forEach(N=>{P[N]=N in R?R[N]:L[N]||[]}),ke.forEach(N=>{N in O&&(P[N]=O[N])}),!w&&k.bulkGistId){const N=f.heavy||{},F=window.Store.get(),ne=ke.filter(ce=>{const _e=N[ce];return _e&&_e.hash!==Oe(JSON.stringify(F[ce]||null))});if(ne.length)try{const ce=await Ae("/gists/"+k.bulkGistId,{etag:null});if(ce.data&&ce.data.files)for(const _e of ne){const Vs=ce.data.files[_e+".json"];if(Vs){const nr=await $e(Vs);nr!=null&&(r.bytes+=he(nr),r.pulled.push(Pn[_e]||_e),P[_e]=JSON.parse(nr))}}}catch(ce){console.warn("[Cloud] 重量级字段拉取失败",ce)}}const H=Oe(JSON.stringify(Ln(P)))===Oe(JSON.stringify(Ln(Object.assign({},g)))),B=ke.some(N=>{if(N in O)return!0;const F=f.heavy&&f.heavy[N];return!F||!F.hash?!1:F.hash!==Oe(JSON.stringify(g[N]||null))}),z=!(H&&E.length===0&&!w&&!B),j=performance.now();if(Me("merging"),z)try{no(P,t)}catch(N){console.error("[Cloud] 合并失败",N)}E.length&&(q.appliedOps=q.appliedOps||[],E.forEach(N=>{N.__name&&q.appliedOps.indexOf(N.__name)<0&&q.appliedOps.push(N.__name)}));const C=window.Store.get();k._remoteColls={},ae.forEach(N=>{k._remoteColls[N]=Sr(C[N])});const I=performance.now()-j,J=performance.now()-n;Me("idle"),Nn("拉取",J,(r.pulled.length?r.pulled.join(","):"无变化")+" · 整合"+Math.round(I)+"ms",r.bytes),k.lastPushedAt=a,k.lastSyncAt=Date.now(),He(),k.lastTransfer=r}let it=0;function es(){if(!(!k.enabled||!k.token||ft)){var e=Cn(),t=e>0?e:eo,n=Date.now(),r=Math.max(k.lastPushedAt||0,k.lastPushAttemptAt||0),s=r+t;if(s<=n)s=n+eo;else if(st&&it&&it<=s){_r();return}st&&clearTimeout(st),it=s,st=setTimeout(Oc,Math.max(0,s-n)),_r()}}function Oc(){if(st=null,it=0,k.pushing){es();return}k.lastPushAttemptAt=Date.now(),Pe().catch(e=>{console.error("[Cloud] 推送失败",e),pe("☁ 同步失败","err")})}function Jo(){if(!it||k.syncPhase!=="idle")return"";var e=Math.max(0,it-Date.now()),t=e>=6e4?Math.round(e/6e4)+" 分钟":Math.max(1,Math.round(e/1e3))+" 秒";return`
⏱ 有改动待推送：约 `+t+"后自动同步（可在同步面板改为实时）"}function _r(){k.badge&&(k.badge.title=(k.badgeBaseTitle||k.badge.title||"")+Jo())}async function Pe(e){e=e||{};const t=e.bulk===!0;if(!k.enabled||!k.token||k.pushing)return;k.pushing=!0,Me(t?"uploading-bulk":"uploading");const n=performance.now(),r={pulled:[],pushed:[],bytes:0};try{if(k.gistId&&q.coreEtag==null)try{ft=!0;try{await Be(!1,{preserveLocal:!0})}finally{ft=!1}}catch(P){console.warn("[Cloud] 推前校准失败，已跳过（稍后重试）",P)}const s=window.Store.get(),o=Do(),i=Oe(o),a={};ae.forEach(P=>{a[P]=xr(s[P])});const c=q.pushedHashes||{},l=!!q.legacyRemote;let u=!1,f={};if(t||!k.bulkGistId||l||(q.opCount||0)>=on){try{ft=!0;try{await Be(!0,{preserveLocal:!0})}finally{ft=!1}}catch(j){console.warn("[Cloud] 压实前合并失败，已跳过（可能丢远端新增）",j)}const P=window.Store.get();let H=!1;if(!k.bulkGistId)try{k.bulkGistId=await Sc()}catch(j){j&&j.transient&&(H=!0)}const B={};ae.forEach(j=>{B[j]=JSON.stringify(P[j]||[])}),ke.forEach(j=>{B[j]=JSON.stringify(P[j]||null)});let z=null;if(k.bulkGistId){const j=ae.concat(ke).filter(C=>{const I=B[C]!=null?B[C]:"null";return Oe(I)!==(q.bulkHashes[C]||"")});if(j.length){const C={};j.forEach(I=>{C[I]=B[I]}),z=await pt(k.bulkGistId,kr(C,j)),r.pushed.push("整包快照("+j.length+"/"+(ae.length+ke.length)+" 变化集合)"),r.bytes+=he(JSON.stringify(C))}else r.pushed.push("整包快照(无变化,跳过)")}else H?console.warn("[Cloud] 大数据 Gist 发现遇瞬时错误，本次跳过整包上传（避免重复建）"):(k.bulkGistId=await xc(B),r.pushed.push("整包快照"),r.bytes+=he(JSON.stringify(B)));z&&(q.bulkEtag=z),f={},(q.appliedOps||[]).forEach(j=>{Xr.test(j)&&(f[j]=null)}),l&&ae.forEach(j=>f[j+".ops.json"]=null),q.compactGen=(q.compactGen||0)+1,q.appliedOps=[],q.opCount=0,q.bulkHashes=q.bulkHashes||{},ae.concat(ke).forEach(j=>{q.bulkHashes[j]=Oe(B[j]!=null?B[j]:"null")}),u=!0,k._remoteColls={},ae.forEach(j=>{k._remoteColls[j]=Sr(P[j])})}let d={};const m=ae.filter(P=>!u&&(l||a[P]!==c[P]));if(m.length&&!u){const P=await Tc(m,s,k._remoteColls,s.tomb||{},q.compactGen||0);if(P){const H=Bo(Date.now(),q.deviceId);d[H]={content:JSON.stringify(P)},r.bytes+=he(JSON.stringify(P)),r.pushed.push("op:"+m.map(B=>Wr[B]).join("/")),q.appliedOps=q.appliedOps||[],q.appliedOps.indexOf(H)<0&&q.appliedOps.push(H),q.opCount=(q.opCount||0)+1,k._remoteColls||(k._remoteColls={}),m.forEach(B=>{k._remoteColls[B]=Sr(s[B])})}}let p=[],y={};if(!u&&k.bulkGistId&&(p=ke.filter(P=>Oe(JSON.stringify(s[P]||null))!==(c[P]||"")),p.length)){p.forEach(P=>{y[P]=JSON.stringify(s[P]||null)});try{const P=await pt(k.bulkGistId,kr(y,p));P&&(q.bulkEtag=P)}catch(P){console.warn("[Cloud] 重量级字段上传失败",P)}p.forEach(P=>{r.pushed.push(Pn[P]||P),r.bytes+=he(y[P]||"")})}const g={};ke.forEach(P=>{g[P]=Oe(JSON.stringify(s[P]||null))});const v={ver:3,bulkGistId:k.bulkGistId,compactGen:q.compactGen||0,colls:{},heavy:{}};ae.forEach(P=>{v.colls[P]={hash:xr(s[P]),n:(s[P]||[]).length}}),ke.forEach(P=>{v.heavy[P]={hash:g[P]}});const w=JSON.stringify(v),S=Oe(w),O=l||i!==c.core||S!==c.manifest||u,M=Object.assign({[Kr]:{content:o},[Ke]:{content:w}},d);l&&(M[sn]=null),u&&Object.assign(M,f||{});const E=!k.gistId||O||Object.keys(d).length||u&&f&&Object.keys(f).length;if(!k.gistId)k.gistId=await Lo(Io,M),r.pushed.unshift("核心"),r.bytes+=he(o)+he(w);else if(E){try{const P=await pt(k.gistId,M);P&&(q.coreEtag=P)}catch(P){if(P&&(P.status===404||P.status===401)){k.gistId=null;let H=null;try{H=await Fn()}catch(B){console.warn("[Cloud] 重发现 Gist 失败（不新建）",B)}if(H){k.gistId=H;try{const B=await pt(k.gistId,M);B&&(q.coreEtag=B),r.pushed.unshift("核心"),r.bytes+=he(o)+he(w)}catch(B){console.warn("[Cloud] 重指向后补丁失败",B)}}else console.warn("[Cloud] Gist 404 但未能重新发现，跳过本次核心写入（避免重复建）")}else throw P&&P.status===403&&an(0),P}r.pushed.unshift("核心"),r.bytes+=he(o)+he(w)}q.pushedHashes=Object.assign({core:i,manifest:S},a,g),q.legacyRemote=!1;const L=Object.keys(d).length>0;k.gistId&&!Yr()&&L&&Be(!1,{preserveLocal:!0}).catch(P=>{console.warn("[Cloud] 后台合并跳过",P)}),k.lastPushedAt=Date.now(),k.lastSyncAt=Date.now(),k.lastTransfer=r,k.pendingBulk=[];try{const P=window.PlazaAutoPull;P&&typeof P.onCloudSync=="function"&&P.onCloudSync()}catch{}const R=performance.now()-n;Nn("推送",R,r.pushed.length?r.pushed.join(","):"无变化",r.bytes),He(),Me("idle")}catch(s){console.error("[Cloud] 推送失败",s);const o=s&&s.message?s.message:""+s;Me("idle"),pe("☁ 同步失败","err"),k.badge&&(k.badge.title="同步失败："+o),Nn("推送",performance.now()-n,"失败: "+o,0),window.Toast&&Q.danger("☁ 同步失败："+o)}finally{k.pushing=!1}}async function Ho(){k.gistId=null,q.gistId=null,q.coreEtag=null,q.bulkEtag=null,k.lastPushedAt=0;try{const e=await Fn();if(e)return k.gistId=e,q.gistId=e,k.bulkGistId=q.bulkGistId||null,!0}catch(e){if(e&&e.transient)throw e;console.warn("[Cloud] 重发现 Gist 失败",e)}return!1}async function Go(){pe("☁ 同步中…","busy");try{if(!k.gistId&&q.gistId&&(k.gistId=q.gistId,k.bulkGistId=q.bulkGistId||null),!k.gistId){try{k.gistId=await Fn()}catch(t){if(t&&t.transient){console.warn("[Cloud] 发现 Gist 遭遇瞬时错误，将在轮询中自愈重试",t.message),Me("idle"),Sn();return}console.warn("[Cloud] 发现 Gist 失败",t)}k.lastPushedAt=0,q.coreEtag=null,q.bulkEtag=null}k.bulkGistId=q.bulkGistId||k.bulkGistId||null;try{await Be()}catch(t){if(t&&t.deadGist)await Ho()?await Be():await Pe();else throw t}if(!k.gistId)await Pe();else{var e=Cn();e>0&&k.lastPushedAt>0&&Date.now()-k.lastPushedAt>=e&&(console.log("[Cloud] 开机追赶：距上次推送超一个周期，立即补推"),k.lastPushAttemptAt=Date.now(),await Pe()),es()}Me("idle"),Sn()}catch(t){console.error("[Cloud] 同步失败",t);const n=t&&t.message?t.message:""+t;Me("idle"),pe("☁ 同步失败","err"),k.badge&&(k.badge.title="同步失败："+n),window.Toast&&Q.danger("☁ 同步失败："+n),Sn()}}function Sn(){zo(),k.pollTimer=setInterval(async()=>{if(!Yr()){if(!k.gistId&&!q.gistId){try{k.gistId=await Fn()}catch(e){if(e&&e.transient)return}if(!k.gistId){await Pe();return}}try{await Be(!1,{preserveLocal:!0}),pe("☁ 已同步","on")}catch(e){if(e&&e.status===403)an(0);else if(e&&e.deadGist)try{await Ho()&&(await Be(!1,{preserveLocal:!0}),pe("☁ 已同步","on"))}catch{}}}},wr())}function zo(){k.pollTimer&&(clearInterval(k.pollTimer),k.pollTimer=null)}async function Ic(){const e=uc();if(!e){pe("☁ 未同步","off");return}k.token=e,k.enabled=!0,k.gistId=null,k.lastPushedAt=q.lastPushedAt||0,await Go()}async function Mc(e,t){k.token=e.trim();try{await Ae("/rate_limit"),k.enabled=!0,dc(),k.gistId=null,k.lastPushedAt=q.lastPushedAt||0,Mt(),await Go()}catch(n){k.token=null,k.enabled=!1,ut(t,n.status===401?"令牌无效或无 gist 权限，请检查":n.message||"验证失败")}}async function $o(){zo(),fc(),k.token=null,k.enabled=!1,k.gistId=null,k.bulkGistId=null,k.rateLimitBackoffUntil=0,k.lastTransfer=null,q={syncAiKey:q.syncAiKey,pushedHashes:{},bulkHashes:{},appliedOps:[],compactGen:0,opCount:0},He(),pe("☁ 未同步","off")}function Uo(){if(document.getElementById("cloud-style"))return;const e=document.createElement("style");e.id="cloud-style",e.textContent=`
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
#cloud-card a{color:#2f54eb}`,document.head.appendChild(e)}var tt=null;function ro(e){var t=e.querySelector?e.querySelector("#sb-theme"):null;t&&typeof e.insertBefore=="function"?k.badge.previousSibling!==t&&e.insertBefore(k.badge,t.nextSibling):k.badge.parentNode!==e&&e.appendChild(k.badge)}function Fo(){if(k.badge){var e=document.getElementById("statusbar");if(e){ro(e),tt&&(tt.disconnect(),tt=null);return}k.badge.parentNode!==document.body&&document.body.appendChild(k.badge),!tt&&(tt=new MutationObserver(function(){var t=document.getElementById("statusbar");t&&(ro(t),tt.disconnect(),tt=null)}),tt.observe(document.body,{childList:!0,subtree:!0}))}}function pe(e,t){Uo(),k.badge||(k.badge=document.createElement("div"),k.badge.id="cloud-badge",k.badge.onclick=Vo),Fo();let n=e;t==="on"&&k.gistId?n="☁ #"+k.gistId.slice(0,6):t==="on"?n="☁ 已同步":t==="off"?n="☁ 未同步":t==="err"?n="☁ 同步失败":n=e,k.badge.className=t,k.badge.textContent=n;let r=k.gistId?"核心 Gist: "+k.gistId+"（两台设备核心 ID 相同即同一份数据）":"未连接云端";k.lastTransfer&&(r+=Ko(k.lastTransfer)),k.badgeBaseTitle=r,k.badge.title=r+Jo()}function Ko(e){const t=[];e.pulled&&e.pulled.length&&t.push("拉取: "+e.pulled.join("、")),e.pushed&&e.pushed.length&&t.push("推送: "+e.pushed.join("、")),t.length||t.push("无变化（增量跳过）");const n=e.bytes?"（"+(e.bytes>1024?Math.round(e.bytes/1024*10)/10+" KB":e.bytes+" B")+"）":"";return`
最近同步 `+t.join(" · ")+n}function Vo(){if(Uo(),document.getElementById("cloud-mask"))return;const e=document.createElement("div");e.id="cloud-mask",k.token?_n(e):Pc(e),document.body.appendChild(e),e.onclick=t=>{t.target===e&&Mt()}}function Mt(){const e=document.getElementById("cloud-mask");e&&e.remove()}function Pc(e){e.innerHTML='<div id="cloud-card"><h3>☁ 同步到你的 GitHub</h3><input id="cv-t" placeholder="粘贴 GitHub 个人令牌" type="password"><div class="err" id="cv-err"></div><div class="row"><button class="primary" id="cv-ok">保存并同步</button><button class="ghost" id="cv-cancel">取消</button></div><div class="hint">① 去 <a href="'+ac+'" target="_blank" rel="noreferrer">生成令牌</a>，只勾 <b>gist</b> 权限；<br>② 令牌仅存于本机浏览器，数据存在你自己的 Gist 里，别人看不到；<br>③ 不同设备用同一令牌即自动同步同一份数据。</div></div>',e.querySelector("#cv-cancel").onclick=Mt,e.querySelector("#cv-ok").onclick=()=>{const t=e.querySelector("#cv-t").value.trim();if(!t){ut(e,"请粘贴令牌");return}Mc(t,e)}}function _n(e){const t=k.lastSyncAt?new Date(k.lastSyncAt).toLocaleString():"—",n=k.gistId?"https://gist.github.com/"+k.gistId:"#",r=k.gistId?k.gistId.slice(0,8):"（未绑定）",s=k.lastTransfer?Ko(k.lastTransfer).replace(/^\n/,""):"尚无同步记录",i='<span style="color:#1a56c4;font-weight:500">🧩 追加同步 '+(q.opCount||0)+"/"+on+" op 文件（达阈值自动压实整包）</span><br>",a=k.syncLog.slice(0,8);let c="";if(a.length){c='<details style="margin-top:10px"><summary style="cursor:pointer;font-size:13px;font-weight:500;color:#1a56c4;margin-bottom:6px">📋 同步历史（最近 '+a.length+' 次）</summary><table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:4px"><tr style="background:#f6f6f6;color:#666"><th style="padding:4px 6px;text-align:left">时间</th><th style="padding:4px 6px;text-align:left">操作</th><th style="padding:4px 6px;text-align:right">耗时</th><th style="padding:4px 6px;text-align:right">数据量</th></tr>';for(let d=0;d<a.length;d++){const m=a[d],p=new Date(m.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),y=m.durationMs<1e3?m.durationMs+"ms":(m.durationMs/1e3).toFixed(1)+"s",g=m.bytes>1024?Math.round(m.bytes/1024*10)/10+"KB":m.bytes+"B",v=m.phase==="拉取"?"#1a7f37":m.phase==="推送"?"#2f54eb":"#c0392b";c+='<tr style="border-top:1px solid #eee"><td style="padding:3px 6px;color:#888;white-space:nowrap">'+p+'</td><td style="padding:3px 6px" title="'+qe(m.detail)+'"><span style="color:'+v+';font-weight:500">'+qe(m.phase)+"</span> "+qe((m.detail||"").slice(0,30))+'</td><td style="padding:3px 6px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums">'+y+'</td><td style="padding:3px 6px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;color:#888">'+g+"</td></tr>"}c+="</table></details>"}const l=(function(){try{const d=window.Store.get();let m=0,p=0,y=0;for(const g in d){const v=JSON.stringify(d[g]||"").length;if(ae.indexOf(g)>=0){p+=v;continue}if(ke.indexOf(g)>=0){y+=v;continue}m+=v}return(m/1024).toFixed(1)+" KB 核心，"+(p/1024).toFixed(1)+" KB 大数据，"+(y/1024).toFixed(1)+" KB 重量级"}catch{return"—"}})();e.innerHTML='<div id="cloud-card"><h3>☁ 已同步到你的 GitHub（追加同步）</h3><div class="hint" style="margin-top:0">最近同步：'+t+'　<span id="cv-phase" style="color:'+(k.syncPhase!=="idle"?"#2f54eb":"#1a7f37")+';font-weight:500">'+(k.syncPhase==="downloading"?"⬇ 下载中…":k.syncPhase==="uploading"?"⬆ 上传中…":k.syncPhase==="uploading-bulk"?"⬆ 上传大数据…":k.syncPhase==="merging"?"🔄 整合中…":"✅ 空闲")+"</span><br>"+i+'<div style="font-size:12px;color:#555;margin:6px 0;padding:6px 8px;background:#f8f9fa;border-radius:6px">📊 '+l+'　<a style="color:#2f54eb;cursor:pointer" id="cv-go-settings">→ 去设置查看详情</a></div>核心 Gist ID：<b style="color:#1a7f37">'+r+"</b>"+(k.bulkGistId?"　图库 Gist：<b>"+k.bulkGistId.slice(0,8)+"</b>":"")+'<br>Gist 地址：<a href="'+n+'" target="_blank" rel="noreferrer">查看</a><br><span style="color:#1a56c4">'+s+"</span>"+c+'<span style="color:#c0392b;display:block;margin-top:6px">⚠ 跨设备同步前提：<b>每台设备粘贴【同一个】令牌</b>且都升级到新版（追加同步）。旧版本会把整包写回，造成格式混用。</span></div><label style="display:flex;align-items:center;gap:6px;font-size:13px;margin-top:10px;color:#444;cursor:pointer" title="开启（默认）：Key 随云端同步，换设备 / 重装后拉取一次即自动取回（Gist 为私有，仅本人令牌可读）。&#10;关闭：Key 只存本机、不上传云端——更保守，但换设备需手动重填。&#10;无论开关如何，本机已填好的 Key 都不会被云端空值清掉（2026-09-04 起）。"><input type="checkbox" id="cv-ai"'+(q.syncAiKey!==!1?" checked":"")+'> 同步 AI Key 到云端 <span style="color:#888">（默认开 · 换设备免重填）</span></label><div class="hint" style="margin-top:8px">⏱ 自动推送 / 拉取频率：<a style="color:#2f54eb;cursor:pointer" id="cv-go-freq">前往设置调整</a>（周期内的改动合并推送，省同步次数；改动始终实时存本机，关机不丢，重开超周期自动补推）。</div><div class="row"><button class="primary" id="cv-sync">拉取+推送</button><button class="ghost" id="cv-pull">仅拉取远端</button></div><div class="row"><button class="accent" id="cv-all">生成完整快照（压实 op 日志）</button></div><div class="row"><button class="primary" id="cv-copy">复制同步令牌</button><button class="ghost" id="cv-out">退出</button></div><div class="err" id="cv-err"></div><div class="hint">退出仅清除本机令牌，云端数据不删；换设备用同一令牌仍可取回。</div></div>',e.querySelector("#cv-ai").onchange=d=>{q.syncAiKey=d.target.checked,delete q.pushedHashes.core,delete q.pushedHashes.manifest,He(),Pe().then(()=>pe("☁ 已同步","on")).catch(()=>{})};var u=e.querySelector("#cv-go-freq");u&&(u.onclick=()=>{Mt(),window.App&&App.go("settings")}),e.querySelector("#cv-sync").onclick=()=>{Be(!0).then(Pe).then(()=>{_n(e),pe("☁ 已同步","on"),window.Toast&&Q.success("已与云端同步")}).catch(()=>ut(e,"同步失败，请重试"))},e.querySelector("#cv-all").onclick=()=>{Me("uploading-bulk"),window.Toast&&Q.show("正在生成完整快照（压实 op 日志）…","info"),Pe({bulk:!0}).then(()=>{_n(e),pe("☁ 已同步","on"),window.Toast&&Q.success("已生成完整快照并压实")}).catch(()=>ut(e,"生成快照失败，请重试"))},e.querySelector("#cv-pull").onclick=()=>{Be(!0).then(()=>{_n(e),pe("☁ 已同步","on"),window.Toast&&Q.success("已拉取远端数据")}).catch(()=>ut(e,"拉取失败，请检查网络或令牌"))},e.querySelector("#cv-copy").onclick=()=>{const d=k.token||"",m=()=>ut(e,"已复制令牌，去另一台设备粘贴即可同步同一份数据"),p=()=>ut(e,"当前环境不支持自动复制，请手动复制令牌");navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(d).then(m).catch(p):p()},e.querySelector("#cv-out").onclick=()=>{$o(),Mt()};const f=e.querySelector("#cv-go-settings");f&&(f.onclick=()=>{Mt(),window.App&&App.go("settings")})}function ut(e,t){const n=e.querySelector("#cv-err");n&&(n.textContent=t)}async function Cc(e){e=e||{};const t=e.confirm||(l=>typeof window<"u"&&window.confirm?window.confirm(l):!0),n=e.progress||(()=>{}),r=e.phase||(()=>{}),s=e.result||(()=>{}),o=e.error||(l=>{window.Toast&&Q.danger(l)});if(!k.token)return o("未登录，无法清理"),null;if(!await t(`将删除你 GitHub 账号下所有「同名但当前设备未在使用」的同步 Gist（保留当前活跃的那一对）。

这能清掉旧版本反复新建产生的重复/垃圾同步文件，减少 API 配额占用、避免同步变慢。

确认继续？此操作不可逆（但只删不再被任何设备引用的文件，活跃数据完好）。`))return null;r("uploading");const a=l=>new Promise(u=>setTimeout(u,l)),c=Date.now();try{const l=[],u=[];for(let O=1;O<=5;O++){let M;try{M=(await Ae("/gists?per_page=100&page="+O)).data}catch(E){if(E&&E.status===403){an(0),await a(3e4),O--;continue}throw E}if(!M||!M.length)break;for(const E of M){const L=E.description||"";L===Io?l.push(E):L===Vr&&u.push(E)}if(M.length<100)break}let f=null;if(q.gistId&&(f=l.find(O=>O.id===q.gistId&&O.files&&O.files[Ke])||null),!f){const O=l.filter(E=>E.files&&E.files[Ke]);f=(O.length?O:l).slice().sort((E,L)=>(L.updated_at||"").localeCompare(E.updated_at||""))[0]||null}let d=null;if(f&&f.files&&f.files[Ke])try{const O=await $e(f.files[Ke]),M=O?JSON.parse(O):null;M&&M.bulkGistId&&(d=u.find(E=>E.id===M.bulkGistId)||null)}catch{}!d&&u.length&&(d=u.slice().sort((O,M)=>(M.updated_at||"").localeCompare(O.updated_at||""))[0]||null);const m=f?f.id:null,p=d?d.id:null,y=l.filter(O=>O.id!==m).concat(u.filter(O=>O.id!==p));if(!y.length){const O={ok:!0,deleted:0,failed:0,kept:{core:m,bulk:p},total:0,startedAt:c,finishedAt:Date.now(),message:"没有需要清理的孤儿 Gist，你的云端很干净 ✅"};return window.Toast&&Q.success(O.message),s(O),r("idle"),O}n("发现 "+y.length+" 个孤儿 Gist，开始删除（保留活跃对）…");let g=0,v=0;for(let O=0;O<y.length;O++){const M=y[O];let E=!1,L=0;for(;L<5&&!E;)try{await Ae("/gists/"+M.id,{method:"DELETE"}),E=!0}catch(R){if(R&&R.status===404)E=!0;else if(R&&R.status===403)an(L),await a(Math.min(3e4*Math.pow(2,L),3e5)),L++;else{v++;break}}E&&g++,n("清理中… 已删除 "+g+" / "+y.length+(v?"（失败 "+v+"）":"")),await a(200)}const w=Date.now(),S={ok:!0,deleted:g,failed:v,kept:{core:m,bulk:p},total:y.length,startedAt:c,finishedAt:w,message:"清理完成：删除 "+g+" 个孤儿 Gist"+(v?"，"+v+" 个失败":"")+"，已保留活跃对"};return window.Toast&&Q.success(S.message),s(S),r("idle"),S}catch(l){r("idle");const u="清理失败："+(l&&l.message?l.message:l);return o(u),{ok:!1,error:u,startedAt:c,finishedAt:Date.now()}}}function Rt(e){return e>=1024?Math.round(e/1024*10)/10+" KB":e+" B"}function he(e){if(e==null)return 0;if(e=String(e),typeof TextEncoder<"u")try{return new TextEncoder().encode(e).length}catch{}let t=0;for(let n=0;n<e.length;n++){const r=e.charCodeAt(n);t+=r<128?1:r<2048?2:3}return t}function Nc(e){const t=/^op-(\d+)-/.exec(e);if(!t)return"";try{return new Date(+t[1]).toLocaleString([],{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}catch{return""}}function Lc(){try{const e=window.Store.get(),t=[],n=[],r=[];let s=0,o=0,i=0;for(const l in e){const u=JSON.stringify(e[l]||"").length;if(ae.indexOf(l)>=0){n.push({k:l,kb:(u/1024).toFixed(1),sz:u}),o+=u;continue}if(ke.indexOf(l)>=0){r.push({k:l,kb:(u/1024).toFixed(1),sz:u}),i+=u;continue}s+=u,t.push({k:l,kb:(u/1024).toFixed(1),sz:u})}t.sort((l,u)=>u.sz-l.sz);const a=t.slice(0,15);let c='<details open style="margin-top:6px"><summary style="cursor:pointer;color:#2f54eb;font-weight:500;font-size:13px">📊 核心体积诊断（'+(s/1024).toFixed(1)+" KB 核心，"+(o/1024).toFixed(1)+" KB 大数据，"+(i/1024).toFixed(1)+" KB 重量级）</summary>";return r.length&&(c+='<div style="font-size:11px;color:#888;margin:4px 0">⬅ 已从核心剥离（重量级对象字段）：',c+=r.map(l=>qe(l.k)+" "+l.kb+"KB").join(" / "),c+="</div>"),n.length&&(c+='<div style="font-size:11px;color:#888;margin:2px 0">⬅ 已从核心剥离（大数据数组）：',c+=n.filter(l=>l.sz>500).map(l=>qe(l.k)+" "+l.kb+"KB").join(" / "),c+="</div>"),c+='<table style="width:100%;font-size:12px;margin-top:4px;border-collapse:collapse">',c+='<tr style="border-bottom:1px solid #ddd"><th style="text-align:left;padding:2px 6px;color:#888">字段</th><th style="text-align:right;padding:2px 6px;color:#888">KB</th><th style="text-align:left;padding:2px 6px;color:#888;width:60%">占比</th></tr>',a.forEach(l=>{const u=s>0?(l.sz/s*100).toFixed(0):0,f=l.sz>1e4?"#c0392b":l.sz>3e3?"#e67e22":"#1a7f37";c+='<tr><td style="padding:1px 6px;font-family:monospace;font-size:11px">'+qe(l.k)+'</td><td style="padding:1px 6px;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap">'+l.kb+'</td><td style="padding:1px 6px"><div style="background:#eee;border-radius:3px;height:12px;display:inline-block;min-width:40px;vertical-align:middle"><div style="background:'+f+";height:100%;border-radius:3px;width:"+Math.min(u,100)+'%"></div></div> <span style="color:#888;font-size:11px">'+u+"%</span></td></tr>"}),t.length>15&&(c+='<tr><td colspan="3" style="padding:2px 6px;color:#888;font-size:11px">… 还有 '+(t.length-15)+" 个更小的字段</td></tr>"),c+="</table></details>",c}catch{return""}}async function Qo(){const e={core:[],bulk:[],coreTotal:0,bulkTotal:0,total:0,gen:q.compactGen||0,opCount:q.opCount||0,error:null};try{if(k.gistId){const t=await Ae("/gists/"+k.gistId,{etag:null});if(t.data&&t.data.files){for(const r in t.data.files){const s=t.data.files[r],o=typeof s.size=="number"?s.size:s.content?s.content.length:0;let i="other",a=r;r===Kr?(i="core",a="核心 core.json"):r===Ke?(i="manifest",a="清单 manifest.json"):Xr.test(r)&&(i="op"),e.core.push({name:r,size:o,type:i,label:a}),e.coreTotal+=o}const n=t.data.files[Ke];if(n){const r=await $e(n);if(r)try{const s=JSON.parse(r);typeof s.compactGen=="number"&&(e.gen=s.compactGen),s.bulkGistId&&(k.bulkGistId=s.bulkGistId)}catch{}}}}if(k.bulkGistId){const t=await Ae("/gists/"+k.bulkGistId,{etag:null});if(t.data&&t.data.files)for(const n in t.data.files){const r=t.data.files[n],s=typeof r.size=="number"?r.size:r.content?r.content.length:0;let o="bulk",i=n;ae.forEach(a=>{n===a+".json"&&(o="coll",i=(Wr[a]||a)+".json")}),ke.forEach(a=>{n===a+".json"&&(o="heavy",i=(Pn[a]||a)+".json")}),e.bulk.push({name:n,size:s,type:o,label:i}),e.bulkTotal+=s}}e.total=e.coreTotal+e.bulkTotal}catch(t){e.error=t&&t.message?t.message:""+t}return e}function Wo(e){const t=e.core.filter(a=>a.type==="op").sort((a,c)=>c.name.localeCompare(a.name)),n=e.core.filter(a=>a.type==="core"||a.type==="manifest"),r=e.gen,s=e.opCount,o=Math.min(100,Math.round(s/on*100));let i='<div style="font-size:13px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b style="color:#1a56c4">☁ 云端数据分布</b><button class="btn btn-ghost cs-refresh" style="padding:2px 8px;font-size:12px">🔄 刷新</button></div>';return i+='<div style="font-size:12px;color:#444;margin-bottom:4px">总占用 <b>'+Rt(e.total)+"</b>　·　压实代次 <b>#"+r+"</b>　·　op 文件 <b>"+t.length+"/"+on+"</b></div>",i+='<div style="background:#eee;border-radius:4px;height:8px;margin:2px 0 8px"><div style="background:'+(o>=100?"#c0392b":"#2f54eb")+";height:100%;border-radius:4px;width:"+o+'%"></div></div>',i+='<div style="font-size:12px;font-weight:600;color:#666;margin-top:4px">📦 核心 Gist</div>',i+='<table style="width:100%;font-size:12px;border-collapse:collapse">',n.forEach(a=>{i+='<tr><td style="padding:1px 6px">'+qe(a.label)+'</td><td style="padding:1px 6px;text-align:right;font-variant-numeric:tabular-nums;color:#888">'+Rt(a.size)+"</td></tr>"}),t.length&&(i+='<tr><td colspan="2" style="padding:2px 6px;color:#1a56c4;font-weight:500">op 增量文件（'+t.length+" 个，共 "+Rt(t.reduce((a,c)=>a+c.size,0))+"）</td></tr>",t.slice(0,30).forEach(a=>{i+='<tr><td style="padding:1px 6px;font-family:monospace;font-size:10px;color:#555">'+qe(a.name.slice(0,26))+(a.name.length>26?"…":"")+'<br><span style="color:#aaa">'+Nc(a.name)+'</span></td><td style="padding:1px 6px;text-align:right;white-space:nowrap"><span style="color:#888;font-variant-numeric:tabular-nums">'+Rt(a.size)+'</span> <button class="cs-op-del" data-name="'+qe(a.name)+'" title="删除该 op 并整理云端（数据不丢）" style="padding:0 5px;font-size:11px;border:none;background:#fbeaea;color:#c0392b;border-radius:4px;cursor:pointer">🗑</button></td></tr>'}),t.length>30&&(i+='<tr><td colspan="2" style="padding:2px 6px;color:#888;font-size:11px">… 还有 '+(t.length-30)+" 个</td></tr>")),i+="</table>",i+='<div style="font-size:12px;font-weight:600;color:#666;margin-top:8px">🗄 大数据 Gist</div>',i+='<table style="width:100%;font-size:12px;border-collapse:collapse">',e.bulk.forEach(a=>{i+='<tr><td style="padding:1px 6px">'+qe(a.label)+'</td><td style="padding:1px 6px;text-align:right;font-variant-numeric:tabular-nums;color:#888">'+Rt(a.size)+"</td></tr>"}),e.bulk.length||(i+='<tr><td colspan="2" style="padding:2px 6px;color:#888;font-size:11px">（暂无，首次同步后生成）</td></tr>'),i+="</table>",i+='<div style="font-size:11px;color:#888;margin-top:6px">🗑 删除单个 op = 整理云端（生成完整快照 + 升代次 + 清旧 op，数据不丢）。也可用「压实」按钮手动整理。</div>',i+="</div>",i}async function Ar(e){if(e){e.innerHTML="☁ 正在读取云端数据分布…";try{const t=await Qo();if(t.error){e.innerHTML='<div style="color:#c0392b;font-size:12px">读取云端失败：'+qe(t.error)+' <button class="btn btn-ghost cs-refresh" style="padding:1px 6px;font-size:11px">重试</button></div>',so(e);return}e.innerHTML=Wo(t),so(e)}catch(t){e.innerHTML='<div style="color:#c0392b;font-size:12px">读取异常：'+qe(t&&t.message||t)+"</div>"}}}function so(e){if(!e)return;const t=e.querySelector(".cs-refresh");t&&(t.onclick=()=>Ar(e)),e.querySelectorAll(".cs-op-del").forEach(n=>{n.onclick=()=>{confirm(`确定整理云端吗？
将生成完整快照、升压实代次、并清除所有旧 op 文件（数据不会丢失）。`)&&(Me("uploading-bulk"),window.Toast&&Q.show("正在整理云端…","info"),Pe({bulk:!0}).then(()=>{window.Toast&&Q.success("已整理云端"),Ar(e)}).catch(()=>{window.Toast&&Q.danger("整理失败，请重试")}))}})}async function jc(e){if(Store.update(t=>{Array.isArray(t[e])?t[e]=[]:t[e]&&typeof t[e]=="object"?t[e]={}:t[e]=null}),k.bulkGistId)try{await pt(k.bulkGistId,{[e+".json"]:null})}catch{}return!0}async function Dc(e){if(!k.bulkGistId)throw new Error("未登录或无大数据 Gist");return await pt(k.bulkGistId,{[e+".json"]:null}),!0}const Te={init:Ic,pull:Be,push:Pe,schedulePush:es,openPanel:Vo,logout:$o,mountBadge:()=>Fo(),get isEnabled(){return k.enabled},get isLoggedIn(){return!!k.token},coreSizeBreakdown:Lc,fetchCloudStats:Qo,clearCloudColl:jc,deleteCloudFile:Dc,renderCloudStatsHtml:Wo,refreshCloudStatsIn:Ar,cleanupOrphanGists:Cc,genOps:Zr,coreOf:Ln,doSync:()=>Be(!0,void 0).then(Pe),doPull:()=>Be(!0,void 0),doCompact:()=>(Me("uploading-bulk"),Pe({bulk:!0})),get gistId(){return k.gistId},get bulkGistId(){return k.bulkGistId},gistReq:(e,t)=>{if(!k.token){const n=new Error("未登录云同步，无法使用分享协作（先在设置里登录）");throw n.status=0,n}return Ae(e,t)},gistUpload:(e,t,n,r)=>{if(!k.token){const s=new Error("未登录云同步，无法上传");throw s.status=0,s}return new Promise(function(s,o){try{const i=new XMLHttpRequest;i.open("POST",Oo+e),i.setRequestHeader("Authorization","Bearer "+k.token),i.setRequestHeader("Accept","application/vnd.github+json"),i.setRequestHeader("Content-Type","application/json"),i.timeout=3e5,r&&r.addEventListener("abort",()=>{try{i.abort()}catch{}}),i.upload.onprogress=function(a){a.lengthComputable&&typeof n=="function"&&n(Math.round(a.loaded/a.total*100),a.loaded,a.total)},i.onload=function(){if(i.status>=200&&i.status<300)try{s({status:i.status,data:JSON.parse(i.responseText||"{}")})}catch(a){o(new Error("Gist 创建成功但响应解析失败："+(a.message||a)))}else{const a=new Error("Gist 上传失败 HTTP "+i.status+"："+(i.responseText||"").slice(0,200));a.status=i.status,o(a)}},i.onerror=function(){o(new Error("Gist 上传网络错误（请检查网络后重试）"))},i.ontimeout=function(){o(new Error("Gist 上传超时（>5min，文件可能过大或网络过慢，建议压缩后重试）"))},i.send(JSON.stringify(t))}catch(i){o(new Error("Gist 上传初始化失败："+(i.message||i)))}})},get syncInfo(){return{gistId:k.gistId,bulkGistId:k.bulkGistId,lastSyncAt:k.lastSyncAt,lastTransfer:k.lastTransfer,opCount:q.opCount||0,compactGen:q.compactGen||0,compactThreshold:on,pushIntervalMs:Cn(),pullIntervalMs:wr(),nextPushDue:it||0,lastPushedAt:k.lastPushedAt||0}},PUSH_INTERVAL_OPTIONS:oc,PULL_INTERVAL_OPTIONS:ic,getPushIntervalMs:Cn,getPullIntervalMs:wr,setPushInterval(e){return e=parseInt(e,10),isNaN(e)||e<0?!1:(q.pushIntervalMs=e,He(),st&&(clearTimeout(st),st=null,it=0),e===0?(k.lastPushAttemptAt=Date.now(),Pe().then(()=>pe("☁ 已同步","on")).catch(()=>{})):(k.lastPushedAt=k.lastPushedAt||Date.now(),_r()),!0)},setPullInterval(e){return e=parseInt(e,10),isNaN(e)||e<No?!1:(q.pullIntervalMs=e,He(),k.pollTimer&&Sn(),!0)}};typeof module<"u"&&module.exports&&(module.exports={genOps:Zr,applyOps:qo,collHashLive:xr,mergeOpFiles:Ro,genOpFileName:Bo,coreOf:Ln,liveCoreJson:Do});const Xo="kaoyan2026_theme",ir=["day","morning","night"];function qc(){try{const e=localStorage.getItem(Xo);if(e==="morning"||e==="night"||e==="day")return e}catch{}return"day"}const ct=se(qc());function Yo(e,t){try{const n=document.documentElement;t&&(n.classList.add("theme-anim"),setTimeout(()=>n.classList.remove("theme-anim"),400)),e==="day"?n.removeAttribute("data-theme"):n.setAttribute("data-theme",e)}catch{}}Yo(ct.value,!1);function ts(){const e=D(()=>ct.value),t=D(()=>ct.value==="night"),n=D(()=>ct.value==="morning");function r(i){if(!(i!=="day"&&i!=="morning"&&i!=="night")){ct.value=i,Yo(i,!0);try{localStorage.setItem(Xo,i)}catch{}}}function s(){const i=ir.indexOf(ct.value);r(ir[(i+1)%ir.length])}function o(){r(ct.value==="night"?"day":"night")}return{theme:e,isNight:t,isMorning:n,set:r,toggle:o,cycle:s}}const cn={dashboard:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#3b5998" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',scheduler:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="16" r="2" fill="#f97316"/></svg>',review:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><circle cx="10" cy="9" r="2" fill="#f97316"/></svg>',photomistake:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/><circle cx="12" cy="13" r="1" fill="#f97316"/></svg>',vizai:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7v10l10 5 10-5V7z"/><path d="M2 7l10 5 10-5"/><path d="M12 22V12"/><path d="M7 4.5l10 5"/><path d="M17 4.5l-10 5"/><circle cx="12" cy="12" r="1.5" fill="#f97316"/></svg>',tools:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/><circle cx="10" cy="10" r="2" fill="#f97316"/></svg>',quiz:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="10"/><line x1="12" y1="17" x2="12.01" y2="17"/><circle cx="12" cy="16.5" r="1.5" fill="#f97316"/></svg>',essay:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/><circle cx="14" cy="6" r="1" fill="#f97316"/></svg>',mistakes:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/><circle cx="12" cy="12" r="1.5" fill="#f97316"/></svg>',heatmap:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/><circle cx="18" cy="4" r="2" fill="#f97316"/></svg>',inspector:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#65a30d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/><circle cx="15" cy="5" r="1" fill="#f97316"/></svg>',focus:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#4338ca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="#f97316"/></svg>',concept:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="14.5" y1="9.5" x2="17.5" y2="6.5"/><line x1="9.5" y1="9.5" x2="6.5" y2="6.5"/><line x1="9.5" y1="14.5" x2="6.5" y2="17.5"/><line x1="14.5" y1="14.5" x2="17.5" y2="17.5"/><circle cx="12" cy="12" r="1" fill="#f97316"/></svg>',sprint:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#c2410c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/><circle cx="13" cy="7" r="1.5" fill="#f97316"/></svg>',decision:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><circle cx="18" cy="7" r="2" fill="#f97316"/></svg>',mental:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><circle cx="12" cy="10" r="1.5" fill="#f97316"/></svg>',reading:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><circle cx="13" cy="11" r="1.5" fill="#f97316"/></svg>',wordbook:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="10" y1="7" x2="16" y2="7"/><line x1="10" y1="11" x2="16" y2="11"/><circle cx="13" cy="14" r="1.5" fill="#f97316"/></svg>',polrecite:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M10 10l2 2 4-4"/><circle cx="13" cy="7" r="1.5" fill="#f97316"/></svg>',redline:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#991b1b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/><circle cx="12" cy="12" r="1.5" fill="#f97316"/></svg>',progress:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="6"/><circle cx="18" cy="6" r="2" fill="#f97316"/></svg>',share:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/><circle cx="18" cy="5" r="0.5" fill="#f97316"/></svg>',settings:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/><circle cx="12" cy="12" r="1" fill="#f97316"/></svg>',plugins:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.5h1.5a2.5 2.5 0 0 1 0 5H2V19a2 2 0 0 0 2 2h3.5v-1.5a2.5 2.5 0 0 1 5 0V21H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z"/><circle cx="8.5" cy="8.5" r="1" fill="#f97316"/><circle cx="15.5" cy="15.5" r="1" fill="#f97316"/></svg>',copilot:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="cpBot" x1="3" y1="5" x2="21" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a855f7"/><stop offset="0.55" stop-color="#6366f1"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><path d="M12 2.4v3.2" stroke="#f97316" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="2.3" r="1.8" fill="#fbbf24"/><rect x="4.5" y="6" width="15" height="13" rx="6" fill="url(#cpBot)"/><rect x="6" y="7.6" width="12" height="3" rx="1.5" fill="#ffffff" opacity="0.16"/><circle cx="9.3" cy="12.7" r="1.7" fill="#ffffff"/><circle cx="14.7" cy="12.7" r="1.7" fill="#ffffff"/><circle cx="9.3" cy="12.7" r="0.8" fill="#6d28d9"/><circle cx="14.7" cy="12.7" r="0.8" fill="#6d28d9"/><path d="M9.6 15.6c1.1 1.1 3.7 1.1 4.8 0" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round"/><circle cx="6.7" cy="15" r="1.1" fill="#f472b6" opacity="0.85"/><circle cx="17.3" cy="15" r="1.1" fill="#34d399" opacity="0.85"/></svg>',cloud:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',clean:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',warn:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',bulb:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',list:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',thought:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r="1" fill="#f97316"/><circle cx="15" cy="7" r="1" fill="#f97316"/></svg>',search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><circle cx="11" cy="11" r="2" fill="#f97316"/></svg>',edit:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/><circle cx="16" cy="5" r="1" fill="#f97316"/></svg>',snap:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/><circle cx="12" cy="13" r="1" fill="#f97316"/></svg>',plus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',sun:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19"/></svg>',moon:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.3A8.4 8.4 0 0 1 10.7 3.4a8.4 8.4 0 1 0 9.9 9.9z"/></svg>'},Bc=["innerHTML"],An=de({__name:"AppIcon",props:{name:{},cls:{}},setup(e){const t=e,n=D(()=>(cn[t.name]||"").replace("<svg",'<svg class="ci '+(t.cls||"")+'"'));return(r,s)=>(_(),A("span",{class:"app-icon",innerHTML:n.value},null,8,Bc))}}),Rc={class:"statusbar",id:"statusbar","data-testid":"statusbar"},Jc=["title"],Hc={class:"sb-item"},Gc={class:"sb-item"},zc={class:"sb-item"},$c={key:0,class:"sb-item sb-streak"},Uc={key:1,class:"sb-item sb-warn"},Fc=de({__name:"StatusBar",setup(e){const{theme:t,cycle:n}=ts(),r=D(()=>x.daysTo(b.get().settings.examDate)),s=D(()=>b.todayHours()),o=D(()=>{const u=b.todayTaskStats();let f=0,d=0;return Object.keys(u).forEach(m=>{f+=u[m][0],d+=u[m][1]}),{done:f,total:d}}),i=D(()=>b.studyStreak()),a=D(()=>b.mistakeCountToday("sign")),c=D(()=>t.value==="night"||t.value==="morning"?"sun":"moon"),l=D(()=>t.value==="night"?"当前「星阑」夜间，点击回「墨白」":t.value==="morning"?"当前「晨岚」柔和，点击进「星阑」":"当前「墨白」日间，点击进「晨岚」");return jt(()=>{try{Te.mountBadge&&Te.mountBadge()}catch{}}),(u,f)=>(_(),A("header",Rc,[h("button",{class:"sb-theme","data-testid":"theme-toggle",title:l.value,"aria-label":"切换主题",onClick:f[0]||(f[0]=(...d)=>W(n)&&W(n)(...d))},[fe(An,{name:c.value},null,8,["name"])],8,Jc),h("span",Hc,[f[1]||(f[1]=te("⏳ ",-1)),h("b",null,T(r.value),1),f[2]||(f[2]=te("天",-1))]),h("span",Gc,[f[3]||(f[3]=te("🕐 ",-1)),h("b",null,T(s.value),1),f[4]||(f[4]=te("h",-1))]),h("span",zc,[f[5]||(f[5]=te("✅ ",-1)),h("b",null,T(o.value.done)+"/"+T(o.value.total),1)]),i.value>=2?(_(),A("span",$c,[f[6]||(f[6]=te("🔥 ",-1)),h("b",null,T(i.value),1),f[7]||(f[7]=te("天",-1))])):V("",!0),a.value>0?(_(),A("span",Uc,"⚠️符号"+T(a.value),1)):V("",!0)]))}}),ln=[{id:"dashboard",label:"仪表盘",icon:"dashboard"},{id:"scheduler",label:"排程",icon:"scheduler"},{id:"review",label:"复盘",icon:"review"},{id:"photomistake",label:"拍题",icon:"photomistake"}],ns=[{id:"quiz",label:"AI测验",icon:"quiz"},{id:"essay",label:"作文批改",icon:"essay"},{id:"mistakes",label:"错题画像",icon:"mistakes"},{id:"heatmap",label:"考点热力",icon:"heatmap"},{id:"inspector",label:"解题方法",icon:"inspector"},{id:"focus",label:"深度专注",icon:"focus"},{id:"concept",label:"概念图谱",icon:"concept"},{id:"sprint",label:"智能押题",icon:"sprint"},{id:"decision",label:"院校决策",icon:"decision"},{id:"mental",label:"心理状态",icon:"mental"},{id:"reading",label:"英语阅读",icon:"reading"},{id:"wordbook",label:"单词本",icon:"wordbook"},{id:"polrecite",label:"政治背诵",icon:"polrecite"},{id:"redline",label:"红线禁令",icon:"redline"},{id:"progress",label:"进度追踪",icon:"progress"},{id:"plugins",label:"插件中心",icon:"plugins"},{id:"share",label:"星屿广场",icon:"share"},{id:"vizai",label:"AI可视化",icon:"vizai"},{id:"aitools",label:"AI工程台",icon:"bulb"},{id:"settings",label:"设置",icon:"settings"}];function Kc(e){return ln.some(t=>t.id===e)}function Zo(e){return ln.concat(ns).find(t=>t.id===e)?.label||e}function Ye(e){return Kc(e)?"/"+e:"/tool/"+e}var ei={math:{name:"数学一",short:"数学",color:"#2f54eb",target:130,modules:["高数","线代","概率"]},ctrl:{name:"自控(含现控)",short:"自控",color:"#237804",target:135,modules:["经典控制","现代控制"]},eng:{name:"英语一",short:"英语",color:"#722ed1",target:70,modules:["阅读","作文"]},pol:{name:"政治",short:"政治",color:"#595959",target:65,modules:["马原","思修","史纲","毛中特"]}},Tr={shuyi:{name:"数学一",modules:["高数","线代","概率"]},shuer:{name:"数学二",modules:["高数","线代"]},shusan:{name:"数学三",modules:["高数","线代","概率"]}},Er={yingyi:{name:"英语一",difficulty:"hard"},yinger:{name:"英语二",difficulty:"medium"}};function ti(e){var t=e||{},n=Tr[t.mathType]||Tr.shuyi,r=Er[t.engType]||Er.yingyi,s=t.profName||"自控原理",o=[],i=Ie[s]||b.get().majorData&&b.get().majorData[s];return i&&i.modules&&(o=i.modules),{math:{name:n.name,short:"数学",color:"#2f54eb",target:130,modules:n.modules},ctrl:{name:s,short:s.length>4?s.slice(0,4)+"…":s,color:"#237804",target:135,modules:o},eng:{name:r.name,short:"英语",color:"#722ed1",target:70,modules:["阅读","作文"]},pol:{name:"政治",short:"政治",color:"#595959",target:65,modules:["马原","思修","史纲","毛中特"]}}}var Ie={};Ie.自控原理={modules:["经典控制","现代控制"],textbook:"胡寿松《自动控制原理》",alertRule:{hardModule:"现代控制",hardMilestone:"极点配置",learnPath:"状态转移矩阵 → 能控能观 → 极点配置"},milestoneLabel:"专业课核心能力验证（独立完成{hard}）",topics:[{id:"c-tf",name:"传递函数",tier:1,group:"经典控制"},{id:"c-time",name:"时域分析",tier:1,group:"经典控制"},{id:"c-root",name:"根轨迹",tier:2,group:"经典控制"},{id:"c-freq",name:"频域分析",tier:2,group:"经典控制"},{id:"c-comp",name:"校正设计",tier:3,group:"经典控制"},{id:"c-ss",name:"状态空间建模",tier:1,group:"现代控制"},{id:"c-stm",name:"状态转移矩阵",tier:2,group:"现代控制"},{id:"c-ctrb",name:"能控能观判据",tier:2,group:"现代控制"},{id:"c-pole",name:"极点配置",tier:2,group:"现代控制"},{id:"c-obs",name:"观测器设计",tier:3,group:"现代控制"},{id:"c-lyap",name:"李雅普诺夫稳定性",tier:3,group:"现代控制"}],conceptGraph:[{id:"c-tf",name:"传递函数",x:60,y:40,deps:[],book:"胡寿松《自控》P20 例2-1",glossary:[["被控对象","plant"],["放大倍数","增益 K"]]},{id:"c-time",name:"时域分析",x:60,y:130,deps:["c-tf"],book:"胡寿松P75 例3-2",glossary:[["响应快慢","上升时间 tr"],["超调","σ%"]]},{id:"c-root",name:"根轨迹",x:60,y:220,deps:["c-time"],book:"胡寿松P140 例4-3",glossary:[["开环增益","K*"],["分离点","breakaway point"]]},{id:"c-freq",name:"频域分析",x:60,y:310,deps:["c-root"],book:"胡寿松P180 例5-1",glossary:[["带宽","ωb"],["稳定裕度","PM/GM"]]},{id:"c-comp",name:"校正设计",x:60,y:400,deps:["c-freq"],book:"胡寿松P240 例6-2",glossary:[["超前校正","lead"],["滞后校正","lag"]]},{id:"c-ss",name:"状态空间建模",x:380,y:40,deps:[],book:"胡寿松(现控)P10 例1-1",glossary:[["刚度","Kp 类比"],["阻尼","Kd 类比"]]},{id:"c-stm",name:"状态转移矩阵",x:380,y:130,deps:["c-ss"],book:"现控P45 例2-3",glossary:[["矩阵指数","e^At"],["零输入响应","Φ(t)x(0)"]]},{id:"c-ctrb",name:"能控能观判据",x:380,y:220,deps:["c-stm"],book:"现控P80 例3-1",glossary:[["能控性","controllability"],["秩判据","rank test"]]},{id:"c-pole",name:"极点配置",x:380,y:310,deps:["c-ctrb"],book:"现控P120 例4-2",glossary:[["状态反馈","u=-Kx"],["期望极点","desired poles"]]},{id:"c-obs",name:"观测器设计",x:560,y:220,deps:["c-pole"],book:"现控P150 例5-1",glossary:[["状态观测","observer"],["估计误差","e=x-x̂"]]},{id:"c-lyap",name:"李雅普诺夫",x:560,y:310,deps:["c-ctrb"],book:"现控P180 例6-1",glossary:[["渐近稳定","asymptotically stable"],["能量函数","V(x)"]]}],localQuestions:{"c-pole":[{lv:2,gen:function(){return{stem:"状态反馈极点配置的前提条件是系统（ ）",type:"choice",options:["A. 完全能控","B. 完全能观","C. 渐近稳定","D. 最小相位"],answer:"A",solution:"极点可任意配置 ⟌ 系统完全能控",trap:"能控↔极点配置，能观↔观测器，别记反"}}}],"c-ctrb":[{lv:2,gen:function(){return{stem:"n 阶线性定常系统完全能控的充要条件是能控性矩阵 [B AB ... Aⁿ⁻¹B] 的秩为（ ）",type:"choice",options:["A. n","B. n-1","C. 1","D. 0"],answer:"A",solution:"秩判据：rank(Qc) = n",trap:"能控用Qc，能观用Qo=[C;CA;...]，矩阵别写错"}}}],"c-tf":[{lv:2,gen:function(){var e=x.randInt(1,5);return{stem:"单位反馈系统开环传递函数 G(s) = "+e+"/[s(s+1)]，闭环特征方程为？",type:"solve",answer:"s² + s + "+e+" = 0",solution:"1+G(s)=0 → s(s+1)+"+e+"=0 → s²+s+"+e+"=0",trap:"分式合并三步法：先写分母s(s+1)，再加分子"+e}}}]}};Ie.数模电={modules:["模拟电子技术","数字电子技术","信号与系统"],textbook:"康华光《电子技术基础》+ 郑君里《信号与系统》",alertRule:{hardModule:"模拟电子技术",hardMilestone:"多级放大电路频率响应",learnPath:"基本放大电路 → 多级放大 → 频率响应"},milestoneLabel:"模电核心能力验证（独立完成{hard}）",topics:[{id:"ee-bjt",name:"BJT基本特性",tier:1,group:"模拟电子技术"},{id:"ee-amp",name:"基本放大电路",tier:1,group:"模拟电子技术"},{id:"ee-multistage",name:"多级放大电路",tier:2,group:"模拟电子技术"},{id:"ee-freq",name:"频率响应",tier:2,group:"模拟电子技术"},{id:"ee-feedback",name:"负反馈放大电路",tier:3,group:"模拟电子技术"},{id:"ee-opamp",name:"运算放大器应用",tier:3,group:"模拟电子技术"},{id:"ee-logic",name:"逻辑代数基础",tier:1,group:"数字电子技术"},{id:"ee-gate",name:"门电路与组合逻辑",tier:1,group:"数字电子技术"},{id:"ee-ff",name:"触发器与时序逻辑",tier:2,group:"数字电子技术"},{id:"ee-counter",name:"计数器与寄存器",tier:2,group:"数字电子技术"},{id:"ee-dac",name:"A/D与D/A转换",tier:3,group:"数字电子技术"},{id:"ss-lti",name:"LTI系统时域分析",tier:1,group:"信号与系统"},{id:"ss-ft",name:"傅里叶变换",tier:2,group:"信号与系统"},{id:"ss-lt",name:"拉普拉斯变换",tier:2,group:"信号与系统"},{id:"ss-z",name:"Z变换与离散系统",tier:3,group:"信号与系统"}],conceptGraph:[{id:"ee-bjt",name:"BJT特性",x:60,y:40,deps:[],book:"康华光 P30 例2-1",glossary:[["放大区","active region"],["饱和","saturation"]]},{id:"ee-amp",name:"基本放大",x:60,y:130,deps:["ee-bjt"],book:"康华光 P80 例3-2",glossary:[["静态工作点","Q point"],["偏置","bias"]]},{id:"ee-multistage",name:"多级放大",x:60,y:220,deps:["ee-amp"],book:"康华光 P150 例4-3",glossary:[["耦合方式","coupling"],["增益带宽积","GBW"]]},{id:"ee-freq",name:"频率响应",x:60,y:310,deps:["ee-multistage"],book:"康华光 P200 例5-1",glossary:[["上限频率","fH"],["波特图","Bode plot"]]},{id:"ee-feedback",name:"负反馈",x:60,y:400,deps:["ee-freq"],book:"康华光 P260 例6-2",glossary:[["深度负反馈","deep feedback"],["虚短虚断","virtual short/open"]]},{id:"ee-logic",name:"逻辑代数",x:380,y:40,deps:[],book:"阎石 P10 例1-1",glossary:[["真值表","truth table"],["卡诺图","Karnaugh map"]]},{id:"ee-gate",name:"组合逻辑",x:380,y:130,deps:["ee-logic"],book:"阎石 P80 例3-1",glossary:[["竞争冒险","hazard"],["编码器","encoder"]]},{id:"ee-ff",name:"时序逻辑",x:380,y:220,deps:["ee-gate"],book:"阎石 P180 例5-2",glossary:[["触发器","flip-flop"],["特性方程","characteristic eq"]]},{id:"ee-counter",name:"计数器",x:380,y:310,deps:["ee-ff"],book:"阎石 P230 例6-1",glossary:[["同步/异步","sync/async"],["模N计数","mod-N counter"]]},{id:"ss-lti",name:"LTI时域",x:560,y:40,deps:[],book:"郑君里 P20 例1-1",glossary:[["冲激响应","impulse response"],["卷积","convolution"]]},{id:"ss-ft",name:"傅里叶变换",x:560,y:130,deps:["ss-lti"],book:"郑君里 P90 例3-1",glossary:[["频谱","spectrum"],["傅里叶系数","Fourier coeff"]]},{id:"ss-z",name:"Z变换",x:560,y:250,deps:["ss-ft"],book:"郑君里 P200 例8-1",glossary:[["收敛域","ROC"],["零极点","zero-pole"]]}],localQuestions:{}};Ie[408]={modules:["数据结构","计算机组成原理","操作系统","计算机网络"],textbook:"严蔚敏《数据结构》+ 唐朔飞《计组》+ 汤小丹《OS》+ 谢希仁《计网》",alertRule:{hardModule:"计算机组成原理",hardMilestone:"流水线CPU设计",learnPath:"数据通路 → 流水线 → Cache"},milestoneLabel:"计组核心能力验证（独立完成{hard}）",topics:[{id:"ds-linear",name:"线性表",tier:1,group:"数据结构"},{id:"ds-stack",name:"栈和队列",tier:1,group:"数据结构"},{id:"ds-tree",name:"二叉树与遍历",tier:1,group:"数据结构"},{id:"ds-graph",name:"图论算法",tier:2,group:"数据结构"},{id:"ds-sort",name:"排序算法",tier:2,group:"数据结构"},{id:"ds-search",name:"查找与哈希",tier:2,group:"数据结构"},{id:"co-rep",name:"数据表示",tier:1,group:"计组"},{id:"co-cpu",name:"指令系统",tier:1,group:"计组"},{id:"co-datapath",name:"数据通路",tier:2,group:"计组"},{id:"co-pipeline",name:"流水线",tier:3,group:"计组"},{id:"co-cache",name:"Cache与虚拟存储",tier:3,group:"计组"},{id:"os-proc",name:"进程管理",tier:1,group:"操作系统"},{id:"os-mem",name:"内存管理",tier:2,group:"操作系统"},{id:"os-file",name:"文件系统",tier:2,group:"操作系统"},{id:"os-io",name:"I/O管理",tier:3,group:"操作系统"},{id:"cn-arch",name:"网络体系结构",tier:1,group:"计算机网络"},{id:"cn-data",name:"数据链路层",tier:2,group:"计算机网络"},{id:"cn-net",name:"网络层(IP)",tier:2,group:"计算机网络"},{id:"cn-trans",name:"传输层(TCP/UDP)",tier:3,group:"计算机网络"},{id:"cn-app",name:"应用层",tier:3,group:"计算机网络"}],conceptGraph:[{id:"ds-linear",name:"线性表",x:60,y:40,deps:[],book:"严蔚敏 P18 例2-1",glossary:[["顺序存储","sequential"],["链式存储","linked"]]},{id:"ds-stack",name:"栈/队列",x:60,y:130,deps:["ds-linear"],book:"严蔚敏 P40 例3-1",glossary:[["LIFO","后进先出"],["FIFO","先进先出"]]},{id:"ds-tree",name:"二叉树",x:60,y:220,deps:["ds-stack"],book:"严蔚敏 P80 例6-1",glossary:[["遍历","traversal"],["BST","二叉搜索树"]]},{id:"ds-graph",name:"图论",x:60,y:310,deps:["ds-tree"],book:"严蔚敏 P160 例7-1",glossary:[["邻接矩阵","adjacency matrix"],["最短路","shortest path"]]},{id:"ds-sort",name:"排序",x:60,y:400,deps:["ds-graph"],book:"严蔚敏 P220 例8-1",glossary:[["时间复杂度","O(nlogn)"],["稳定性","stability"]]},{id:"co-rep",name:"数据表示",x:340,y:40,deps:[],book:"唐朔飞 P20 例2-1",glossary:[["补码","two's complement"],["浮点","floating-point"]]},{id:"co-cpu",name:"指令系统",x:340,y:130,deps:["co-rep"],book:"唐朔飞 P80 例4-1",glossary:[["寻址方式","addressing"],["CISC/RISC","架构分类"]]},{id:"co-datapath",name:"数据通路",x:340,y:220,deps:["co-cpu"],book:"唐朔飞 P140 例5-1",glossary:[["单周期","single-cycle"],["多周期","multi-cycle"]]},{id:"co-pipeline",name:"流水线",x:340,y:310,deps:["co-datapath"],book:"唐朔飞 P190 例6-1",glossary:[["冒险","hazard"],["转发/旁路","forwarding"]]},{id:"os-proc",name:"进程",x:580,y:40,deps:[],book:"汤小丹 P80 例2-1",glossary:[["PCB","进程控制块"],["上下文切换","context switch"]]},{id:"os-mem",name:"内存管理",x:580,y:130,deps:["os-proc"],book:"汤小丹 P170 例4-1",glossary:[["分页","paging"],["TLB","快表"]]},{id:"os-file",name:"文件系统",x:580,y:220,deps:["os-mem"],book:"汤小丹 P280 例5-1",glossary:[["inode","索引节点"],["目录项","directory entry"]]}],localQuestions:{}};var ni={math:[{id:"m-limit",name:"极限计算",tier:1,group:"高数"},{id:"m-mvt",name:"微分中值定理",tier:2,group:"高数"},{id:"m-subst",name:"定积分换元",tier:1,group:"高数"},{id:"m-improper",name:"反常积分判敛",tier:2,group:"高数"},{id:"m-multi",name:"多元微分",tier:1,group:"高数"},{id:"m-dint",name:"重积分",tier:1,group:"高数"},{id:"m-line",name:"曲线曲面积分",tier:2,group:"高数"},{id:"m-series",name:"级数求和",tier:3,group:"高数"},{id:"m-ode",name:"微分方程",tier:1,group:"高数"},{id:"m-det",name:"行列式计算",tier:1,group:"线代"},{id:"m-matrix",name:"矩阵运算",tier:1,group:"线代"},{id:"m-vector",name:"向量组相关性",tier:2,group:"线代"},{id:"m-eigen",name:"特征值/特征向量",tier:1,group:"线代"},{id:"m-quad",name:"二次型标准化",tier:2,group:"线代"},{id:"m-posdef",name:"正定判定",tier:2,group:"线代"},{id:"m-dist",name:"分布函数",tier:1,group:"概率"},{id:"m-exp",name:"期望方差",tier:1,group:"概率"},{id:"m-est",name:"参数估计",tier:2,group:"概率"},{id:"m-hypo",name:"假设检验",tier:3,group:"概率"}],ctrl:Ie.自控原理.topics,eng:[{id:"e-read-detail",name:"阅读·细节题",tier:1,group:"阅读"},{id:"e-read-main",name:"阅读·主旨题",tier:1,group:"阅读"},{id:"e-read-vocab",name:"阅读·词义猜测",tier:1,group:"阅读"},{id:"e-read-infer",name:"阅读·推断题",tier:2,group:"阅读"},{id:"e-read-attitude",name:"阅读·态度题",tier:2,group:"阅读"},{id:"e-cloze",name:"完形·逻辑衔接",tier:2,group:"完形"},{id:"e-new",name:"新题型·七选五/排序",tier:2,group:"新题型"},{id:"e-trans",name:"翻译·长难句",tier:2,group:"翻译"},{id:"e-big-desc",name:"大作文·图画描述",tier:1,group:"作文"},{id:"e-big-argue",name:"大作文·论证展开",tier:2,group:"作文"},{id:"e-big-lang",name:"大作文·语言升级",tier:3,group:"作文"},{id:"e-small",name:"小作文·书信格式",tier:1,group:"作文"}],pol:[{id:"p-my-wz",name:"马原·唯物论",tier:1,group:"马原"},{id:"p-my-bz",name:"马原·辩证法",tier:1,group:"马原"},{id:"p-my-rsh",name:"马原·认识论",tier:2,group:"马原"},{id:"p-my-lsw",name:"马原·历史唯物",tier:2,group:"马原"},{id:"p-my-zj",name:"马原·政经",tier:3,group:"马原"},{id:"p-mzt-thought",name:"毛中特·思想理论",tier:1,group:"毛中特"},{id:"p-mzt-new",name:"毛中特·新时代",tier:1,group:"毛中特"},{id:"p-mzt-eco",name:"毛中特·经济建设",tier:2,group:"毛中特"},{id:"p-sg-newdemo",name:"史纲·新民主主义革命",tier:1,group:"史纲"},{id:"p-sg-explore",name:"史纲·社会主义探索",tier:2,group:"史纲"},{id:"p-sx-value",name:"思修·价值观与道德",tier:1,group:"思修"},{id:"p-sx-law",name:"思修·法治素养",tier:2,group:"思修"},{id:"p-sz-hot",name:"时政·年度热点",tier:2,group:"时政"}]},Or=Ie.自控原理.conceptGraph.slice(),un={name:"自控原理",modules:Ie.自控原理.modules,textbook:Ie.自控原理.textbook,alertRule:Ie.自控原理.alertRule,localQuestions:Ie.自控原理.localQuestions,milestoneLabel:Ie.自控原理.milestoneLabel},Vc={1:{name:"必拿层",range:"100-110分",color:"#237804",icon:"🟢",rule:"要求零失误，错一题罚5道同类题"},2:{name:"拔高层",range:"110-125分",color:"#d48806",icon:"🟡",rule:"理解套路，建立题型-方法映射"},3:{name:"冲刺层",range:"125-130+分",color:"#cf1322",icon:"😴",rule:"战略性取舍，不恋战"}},Qc={数模电:"电子技术基础 数字电路 模拟电路",数电:"数字电路 数字电子技术",模电:"模拟电路 模拟电子技术",自控:"自动控制原理 自动控制理论",现控:"现代控制理论",电路:"电路分析 电路原理 电路基础",信号:"信号与系统",通原:"通信原理",dsp:"数字信号处理",电磁场:"电磁场与电磁波",微机:"微机原理 微型计算机原理",数据结构:"数据结构",os:"操作系统",计组:"计算机组成原理",计网:"计算机网络",408:"计算机学科专业基础 数据结构 计算机组成原理 操作系统 计算机网络",材力:"材料力学",理力:"理论力学",传热:"传热学",工热:"工程热力学",机设:"机械设计",机原:"机械原理",流力:"流体力学"},Ir={hebut:{id:"hebut",name:"河北工业大学",tier:"211",code:"081100 控制科学与工程（学硕）",exam:"初试：897 自动控制原理（现控约35%）",reexam:"复试：F2801（过程控制/运动控制）",line:"近年复试线≈国家线偏上，专业课给分大方",ratio:"报录比约 4:1",pros:["专业设难度适中、给分友好","一忆愿保护较好","稳首选择"],cons:["地域（天津）实习资源弱于不海"],career:"京津津自动化/车企供应链就业够用",score:{diff:3,region:3,career:3},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},shu:{id:"shu",name:"上海大学",tier:"211",code:"控制科学与工程（学硕）",exam:"初试：836 自动控制理论（含现控，占比高）",reexam:"复试：微机原理与软硬件",line:"复试线高于河工大，对数学一要求高",ratio:"报录比约 6:1",pros:["上海地域+大厂实习机会多","836现控对口","复试微机匹配工程背景"],cons:["分数线更高，风险更大","数学一需≥120才有底气"],career:"上海大厂/外企自动化岗首选跳板",score:{diff:4,region:5,career:5},examKeywords:["自动控制理论","自动控制原理","自控","控制理论","控制"]},gdut:{id:"gdut",name:"广东工业大学",tier:"双非（控制A-）",code:"控制科学与工程（A-学科）",exam:"初试：自控原理（难度适中）",reexam:"复试：电路/微机方向可选",line:"近年录取约275分",ratio:"招生约120人，名额充足",pros:["控制学科A-，实力强","招生多、分数友好","珠三角就业极强"],cons:["学硕名额需核对当年简章"],career:"珠三角制造/硬件大厂直通",score:{diff:2,region:4,career:4},examKeywords:["自控原理","自动控制原理","自控","控制原理"]},futzu:{id:"futzu",name:"福州大学",tier:"211",code:"控制科学与工程",exam:"初试：自控原理",reexam:"复试：综合",line:"国家线附近",ratio:"约 3:1",pros:["211，稳首"],cons:["地域一般"],career:"福建区域就业",score:{diff:2,region:2,career:2},examKeywords:["自控原理","自动控制原理","自控"]},hfut:{id:"hfut",name:"合肥工业大学",tier:"211",code:"控制科学与工程",exam:"初试：自控（含现控）",reexam:"复试：微机/过控",line:"国家线上浮",ratio:"约 4:1",pros:["211，车企资源（蔚来/比亚迪合肥）"],cons:["热度上升中"],career:"长三角制造业",score:{diff:3,region:3,career:3},examKeywords:["自控","自动控制原理","控制原理","自动控制"]},bjut:{id:"bjut",name:"北京工业大学",tier:"211",code:"081100 控制科学与工程（学硕）",exam:"初试：821 自动控制原理",reexam:"复试：微机原理/计算机控制",line:"国家线偏上，北京地域加分",ratio:"约 5:1",pros:["北京211，地域优势明显","控制学科实力稳健"],cons:["北京公共课压分"],career:"京津津就业平台高",score:{diff:3,region:4,career:4},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},njust:{id:"njust",name:"南京理工大学",tier:"211",code:"081100 控制科学与工程",exam:"初试：873 自动控制理论",reexam:"复试：微机原理",line:"211中偏上，军工背景",ratio:"约 6:1",pros:["控制学科实力强","南京地域好","军工项目多"],cons:["竞争激烈"],career:"长三角军工/自动化",score:{diff:4,region:4,career:4},examKeywords:["自动控制理论","自动控制原理","自控","控制理论"]},hit:{id:"hit",name:"哈尔滨工业大学",tier:"985",code:"081100 控制科学与工程（A+学科）",exam:"初试：801 控制原理（含现控）",reexam:"复试：电路+控制系统",line:"985自划线，竞争激烈",ratio:"约 10:1",pros:["控制A+，全国顶尖","军工/航天项目资源"],cons:["难度极大","地域偏北"],career:"航天/军工/大厂核心岗",score:{diff:5,region:2,career:5},examKeywords:["控制原理","自动控制原理","自控","控制"]},neu:{id:"neu",name:"东北大学",tier:"985",code:"081100 控制科学与工程（A学科）",exam:"初试：839 自动控制原理",reexam:"复试：微机原理/计算机控制",line:"985中性价比高，东北公共课给分松",ratio:"约 5:1",pros:["控制学科A级，实力劲劲","分数线相对友好","东北公共课不压分"],cons:["地域偏北，就业辄射弱"],career:"自动化/流程工业",score:{diff:3,region:2,career:3},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},scut:{id:"scut",name:"华南理工大学",tier:"985",code:"081100 控制科学与工程",exam:"初试：813 自动控制原理",reexam:"复试：微机原理",line:"985，华南工科强校",ratio:"约 8:1",pros:["华南工科Top2","珠三角就业无敌"],cons:["分数线高"],career:"广深大厂/车企",score:{diff:4,region:5,career:5},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},xjtu:{id:"xjtu",name:"西安交通大学",tier:"985",code:"081100 控制科学与工程",exam:"初试：811 自动控制原理与信号处理",reexam:"复试：综合面试",line:"C9高校，竞争激烈",ratio:"约 8:1",pros:["C9名校光环","控制学科实力强"],cons:["分数线高","地域偏西"],career:"全国通用顶级学历",score:{diff:5,region:2,career:5},examKeywords:["自动控制原理","自控","控制原理","信号处理"]},tju:{id:"tju",name:"天津大学",tier:"985",code:"081100 控制科学与工程",exam:"初试：812 自动控制理论",reexam:"复试：检测技术/微机原理",line:"985，工科强校",ratio:"约 6:1",pros:["985工科底蕴深厚","天津生活成本低"],cons:["名额有限"],career:"京津津工科就业",score:{diff:4,region:3,career:4},examKeywords:["自动控制理论","自动控制原理","自控","控制理论"]},zju:{id:"zju",name:"浙汉大学",tier:"985",code:"081100 控制科学与工程（A+学科）",exam:"初试：845 自动控制原理",reexam:"复试：微机原理/传感器",line:"华五，A+学科，竞争极激烈",ratio:"约 12:1",pros:["华五名校，全国顶尖","控制A+，杭州就业强"],cons:["极难考"],career:"互联网/自动化顶尖岗",score:{diff:5,region:5,career:5},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},hust:{id:"hust",name:"华中科技大学",tier:"985",code:"081100 控制科学与工程（A-学科）",exam:"初试：829 自动控制原理",reexam:"复试：微机原理/计算机控制",line:"985，武汉工科强校",ratio:"约 7:1",pros:["工科实力阔厚","武汉生活成本适中"],cons:["竞争激烈"],career:"中部/全国工科就业",score:{diff:4,region:3,career:4},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},dlut:{id:"dlut",name:"大连理工大学",tier:"985",code:"081100 控制科学与工程",exam:"初试：854 自动控制原理",reexam:"复试：微机原理/检测技术",line:"985中偏友好",ratio:"约 5:1",pros:["985，大连环境好","分数相对温和"],cons:["东北就业辄射有限"],career:"东北/全国工科就业",score:{diff:3,region:2,career:3},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},seu:{id:"seu",name:"东南大学",tier:"985",code:"081100 控制科学与工程",exam:"初试：934 电路+自动控制原理",reexam:"复试：微机原理",line:"985，南京工科强校",ratio:"约 7:1",pros:["985，长三角就业强","控制学科稳健"],cons:["考电路+自控两门"],career:"长三角工科就业",score:{diff:4,region:4,career:4},examKeywords:["自动控制原理","自控","电路","控制原理"]},cqu:{id:"cqu",name:"重庆大学",tier:"985",code:"081100 控制科学与工程",exam:"初试：844 自动控制原理",reexam:"复试：微机原理",line:"985中偏友好",ratio:"约 5:1",pros:["985，重庆宜居","分数相对友好"],cons:["西部就业辄射有限"],career:"西南/全国工科就业",score:{diff:3,region:2,career:3},examKeywords:["自动控制原理","自控","控制原理","自动控制"]},hdu:{id:"hdu",name:"杭州电子科技大学",tier:"双非（电子强校）",code:"080900 电子科学与技术 / 081000 信通",exam:"初试：841 数字电路 / 843 模拟电路（选一）",reexam:"复试：信号与系统/通信原理",line:"国家线附近，部分方向偏上",ratio:"约 4:1",pros:["电子/通信强势双非","杭州互联网就业资源好","专业课给分友好"],cons:["非985/211"],career:"长三角电子/半导体/IT",score:{diff:2,region:4,career:4},examKeywords:["数字电路","模拟电路","数电","模电","电子技术","数模电"]},uestc:{id:"uestc",name:"电子科技大学",tier:"985",code:"080900 电子科学与技术（A+） / 081000 信通（A+）",exam:"初试：858 信号与系统 / 813 电磁场",reexam:"复试：数字电路/模拟电路/通信原理",line:"985中偏上，电子/通信全国顶尖",ratio:"约 10:1",pros:["电子/通信双A+，全国Top2","成都生活成本低","军工/华为/大厂直通"],cons:["分数线极高","竞争其中激烈"],career:"全国电子/通信/半导体顶级就业",score:{diff:5,region:3,career:5},examKeywords:["信号与系统","数字电路","模拟电路","电子技术","电磁场","通信原理","数模电"]},xidian:{id:"xidian",name:"西安电子科技大学",tier:"211",code:"080900 电子科学与技术 / 081000 信通",exam:"初试：821 电路、信号与系统",reexam:"复试：数字电路/模拟电路/通信原理",line:"211中偏上，电子通信A+级实力",ratio:"约 8:1",pros:["电子通信学科实力211最强","西安生活成本低","华为/军工招聘大户"],cons:["非985，部刍单位卡385"],career:"全国电子/通信/军工/IT",score:{diff:4,region:2,career:5},examKeywords:["电路","信号与系统","数字电路","模拟电路","电子技术","通信原理","数模电"]},bupt:{id:"bupt",name:"北京邮业大学",tier:"211",code:"081000 信息与通信工程（A+）",exam:"初试：801 通信原理 / 802 电子电路",reexam:"复试：数字信号处理/计算机网络",line:"211中偏高，通信A+全国Top2",ratio:"约 8:1",pros:["通信A+，北京地域","互联网大厂校招重镇","行业认可度极高"],cons:["非985，体制内可能受限"],career:"互联网/通信/北京IT圈",score:{diff:4,region:5,career:5},examKeywords:["通信原理","电子电路","信号与系统","数字信号处理","数电","模电","数模电"]},njupt:{id:"njupt",name:"南京邮业大学",tier:"双一流",code:"081000 信息与通信工程",exam:"初试：801 通信原理 / 802 数字信号处理",reexam:"复试：数字电路/模拟电路",line:"双一流中温和，通信实力稳健",ratio:"约 5:1",pros:["通信特色双一流","南京地域好","运营商/华为大量招聘"],cons:["非985/211"],career:"长三角通信/IT",score:{diff:2,region:4,career:3},examKeywords:["通信原理","数字信号处理","数字电路","模拟电路","数模电"]},fudan:{id:"fudan",name:"复旦大学",tier:"985",code:"080900 电子科学与技术 / 微电子（A+）",exam:"初试：881 电子线路与集成电路设计 / 882 半导体器件",reexam:"复试：模拟电路/数字电路/半导体物理",line:"华五，微电子A+，全国顶尖",ratio:"约 12:1",pros:["微电子A+，华五名校","上海集成电路产业核心","学术/产业路径均顶级"],cons:["极难考"],career:"半导体/芯片设计/集成电路",score:{diff:5,region:5,career:5},examKeywords:["电子线路","集成电路","模拟电路","数字电路","半导体器件","数电","模电","数模电"]},thu:{id:"thu",name:"清华大学",tier:"985",code:"080900 电子科学与技术 / 集成电路（A+）",exam:"初试：832 半导体器件与电子电路",reexam:"复试：模拟集成电路/数字集成电路",line:"全国最高，A+学科",ratio:"约 15:1",pros:["全国Top1","集成电路A+","任何方向就业无忧"],cons:["难度天花板"],career:"全理半导体/芯片/学术界",score:{diff:5,region:5,career:5},examKeywords:["半导体器件","电子电路","集成电路","模拟电路","数字电路","数电","模电","数模电"]},sjtu:{id:"sjtu",name:"上海交通大学",tier:"985",code:"080900 电子科学与技术 / 集成电路",exam:"初试：819 信号系统与信号处理 / 874 半导体物理",reexam:"复试：模拟电路/数字电路",line:"华五，上海集成电路产业中心",ratio:"约 10:1",pros:["华五名校","上海芯片/半导体产业","大厂实习便利"],cons:["竞争激烈"],career:"半导体/集成电路/IT",score:{diff:5,region:5,career:5},examKeywords:["信号与系统","信号处理","半导体物理","模拟电路","数字电路","集成电路","数模电"]}};function Wc(e,t){if(t=t||8,!e||!e.trim())return[];var n=e.trim().toLowerCase(),r=Qc[n]||n,s=r.split(/\s+/).filter(function(c){return c.length>0});r!==n&&s.push(n);var o=[],i=[];if(Object.keys(Ir).forEach(function(c){var l=Ir[c];i.push(l);for(var u=l.examKeywords||[],f=0,d=0;d<s.length;d++)for(var m=s[d],p=0;p<u.length;p++){var y=u[p].toLowerCase(),g=0;if(m===y)g=100;else if(m.indexOf(y)>=0||y.indexOf(m)>=0)g=60;else{for(var v=0,w=0;w<m.length;w++)y.indexOf(m[w])>=0&&v++;v>=2&&(g=20+v*5)}g>f&&(f=g)}f>0&&o.push({school:l,score:f})}),o.length>0)return o.sort(function(c,l){return l.score-c.score}),o.slice(0,t).map(function(c){return c.school});var a={985:3,211:2};return i.sort(function(c,l){var u=a[(c.tier||"").replace(/[^985211]/g,"")]||1,f=a[(l.tier||"").replace(/[^985211]/g,"")]||1;return f!==u?f-u:(c.name||"").localeCompare(l.name||"")}),i.slice(0,t)}var ri=[{icon:"🔧",title:"初试前绝对禁止硬件项目",desc:"禁止PCB、禁止B站硬件视频、禁止STM32新工程、工程历程已足够，初试前任何硬件投入都是在偷数学的分数。"},{icon:"📋",title:"复试科目铁律",desc:"复试科目必须根据你选的目标院确定，不能盲目选择。"},{icon:"✍️",title:"数学防呆强制执行",desc:"符号前置、分式三步法（分母→分子→计算）、草稿分区（左乱草/右正稿）。不是建议，是流程。"},{icon:"⏰",title:"政治时间红线",desc:"9月前 ≤45分钟/天，11月前 ≤1.5小时/天。政治是提分效率最低的科目，禁止挤占数学/专业课。"},{icon:"🎯",title:"拒绝二战思维",desc:"所有规划基于一忆愿上岸。不许说“大不了二战”，这个词在本系统是违禁词。"}],si=["草稿纸已分区（左侧乱草 / 右侧正稿）","负号已前置处理，不留在后面","分式合并：先写分母 → 抄分子 → 去括号","积分因子指数号号已反向检查",'卡3分钟已标记"？"跳过，不倒推'],Xc=["符号前置，负号立即提到最前面","分式合并三步法（分母→分子→计算）","草稿分区：左侧乱草，右侧正稿"],oi=["PCB","pcb","硬件","B站","b站","Bilibili","bilibili","STM32","stm32","单片机","焊","电路板","打板"],Yc=[{w:"subject",com:"科目；主题",rare:"受试者；使从识",ex:"The subjects were tested. 受试者接受了测试。"},{w:"novel",com:"小说",rare:"新颖的",ex:"a novel approach 一种新颖的方法"},{w:"address",com:"地址",rare:"处理；致词；探讨",ex:"address the problem 处理该问题"},{w:"issue",com:"问题",rare:"发行；流出",ex:"issue a statement 发表声明"},{w:"practice",com:"练习",rare:"惯例；执业",ex:"common practice 通行惯例"},{w:"term",com:"学期；术语",rare:"条款；(pl.)关系",ex:"on good terms 关系良好"},{w:"figure",com:"数字；人物",rare:"认为；理解(figure out)",ex:"I figure that... 我认为…"},{w:"course",com:"课程",rare:"航向；进程",ex:"change course 改变航向"},{w:"plant",com:"植物",rare:"工厂",ex:"a power plant 发电厂"},{w:"board",com:"木板",rare:"事会；登上(车船机)",ex:"the board of directors 董事会"},{w:"rate",com:"比率",rare:"评价；等级",ex:"be highly rated 备受好评"},{w:"sound",com:"声音",rare:"健全的；合理的",ex:"sound advice 合理的建议"},{w:"mean",com:"意思是",rare:"吝啬的；平均的",ex:"the mean temperature 平均温度"},{w:"fine",com:"好的",rare:"罚款；细微的",ex:"a heavy fine 高额罚款"},{w:"bill",com:"账单",rare:"法案；纸币",ex:"pass the bill 通过法案"},{w:"firm",com:"坚固的",rare:"公司",ex:"a law firm 律所"},{w:"game",com:"游戏",rare:"猎物；博弈",ex:"big game 大型猎物"},{w:"slip",com:"滑倒",rare:"纸条；疏忽",ex:"a slip of the pen 笔误"},{w:"policy",com:"政策",rare:"保单",ex:"an insurance policy 保险单"},{w:"yield",com:"产量",rare:"屈服；让行",ex:"yield to pressure 屈服于压力"},{w:"secure",com:"安全的",rare:"获得；争取",ex:"secure a deal 达成协议"},{w:"conduct",com:"行为",rare:"实施；指挥；传导",ex:"conduct an experiment 做实验"},{w:"account",com:"账户",rare:"解释(account for)；叙述",ex:"account for 40% 占40%"},{w:"approach",com:"接近",rare:"方法；处理",ex:"a new approach to X 解决X的新方法"},{w:"concern",com:"关心",rare:"公司；事关；担忧",ex:"a going concern 持续经营企业"},{w:"present",com:"现在；礼物",rare:"呈现；提交",ex:"present findings 呈现研究结果"},{w:"content",com:"内容",rare:"满足的；使满意",ex:"be content with 满意于"},{w:"object",com:"物体",rare:"反对",ex:"object to the plan 反对该计划"},{w:"produce",com:"生产",rare:"农产品(名词)",ex:"fresh produce 新鲜农产品"},{w:"minute",com:"分钟",rare:"微小的",ex:"minute details 细枝末节"}],Zc={integral:{name:"积分计算",steps:[{name:"识别积分类型",hint:"换元/分部/有理式/三角？写下判断依据"},{name:"选择方法并写出首步",hint:"写出换元式或分部u,v"},{name:"执行换元/分部",hint:"⚠️ 负号前置！每一步检查符号"},{name:"回代为原变量",hint:"上下限是否同步变换？"},{name:"求导验证结果",hint:"对结果求导应等于被积函数"}],checks:[{key:"sign",label:"负号检查",desc:"全文搜索负号位置，确认无后置负号"},{key:"verify",label:"求导验证",desc:"结果求导 = 被积函数"}]},ode:{name:"微分方程",steps:[{name:"判定方程类型",hint:"一阶线性/可分离/齐次/二阶常系数？"},{name:"写出标准形",hint:"y'+P(x)y=Q(x)"},{name:"计算积分因子",hint:"⚠️ μ=e^∫P dx，指数符号必须反向检查！"},{name:"求解并写出通解",hint:"别忘 +C"},{name:"代回验证",hint:"代入原方程验证成立"}],checks:[{key:"factor",label:"积分因子符号反查",desc:"e 的指数符号与 P(x) 一致，无漏负号"},{key:"fraction",label:"分式三步法验证",desc:"分母→分子→计算，逐步核对"}]},matrix:{name:"矩阵运算",steps:[{name:"明确运算目标",hint:"求逆/特征值/秩/对角化？"},{name:"写出初等变换第一步",hint:"行变换标记清楚 r1↔r2 等"},{name:"逐步运算",hint:"⚠️ 每步只做一个变换，禁止心算跳步"},{name:"得到结果",hint:"特征值写全(含重根)"},{name:"验算",hint:"A·A⁻¹=E 或 |A-λE|=0 回代"}],checks:[{key:"sign",label:"行列式符号检查",desc:"换行/提公因子产生的符号已处理"}]},series:{name:"级数",steps:[{name:"判定级数类型",hint:"正项/交错/幂级数？"},{name:"选择判收法",hint:"比值/根值/比较/莱布尼兼"},{name:"计算极限",hint:"⚠️ 分式三步法：分母→分子→计算"},{name:"得出结论",hint:"收敛域端点单独讨论！"}],checks:[{key:"fraction",label:"分式三步法验证",desc:"极限计算中的分式无漏分母"}]}};function rs(){var e="";try{var t=typeof b<"u"&&b.get();t&&t.settings&&t.settings.targetSchool&&t.settings.targetSchool!=="undecided"&&(e=t.settings.targetSchool)}catch{}var n=e?"（决定冲"+e+"）":"";return[{id:"octMath",date:"10月底",title:"数学真题模拟 ≥120分"+n,deadline:"10-31"},{id:"novProf",date:"11月底",title:"专业课真题二刲完成",deadline:"11-30"},{id:"decPol",date:"12月",title:"政治大题背诵启动",deadline:"12-01"}]}var Mr=rs(),el={deepseek:{name:"DeepSeek",endpoint:"https://api.deepseek.com/v1/chat/completions",model:"deepseek-chat",hint:"platform.deepseek.com 申请 API Key"},kimi:{name:"Kimi (月之暗)",endpoint:"https://api.moonshot.cn/v1/chat/completions",model:"moonshot-v1-8k",hint:"platform.moonshot.cn 申请 API Key"},qwen:{name:"通义千问",endpoint:"https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",model:"qwen-plus",hint:"阿里云百炼平台申请 API Key"},zhipu:{name:"智谱 GLM",endpoint:"https://open.bigmodel.cn/api/paas/v4/chat/completions",model:"glm-4-flash",hint:"bigmodel.cn 申请 API Key（有免费额度）"},custom:{name:"自定义 (OpenAI兼容)",endpoint:"",model:"",hint:"任何 OpenAI 兼容接口均可"}};function ii(e){e||(e="自控原理");var t=Ie[e];if(t)return Pr(e,t),!0;try{if(typeof b<"u"){var n=b.get().majorData;if(n&&n[e])return Pr(e,n[e]),!0}}catch{}return!1}function Pr(e,t){t.topics&&t.topics.length>0&&(ni.ctrl=t.topics),t.conceptGraph&&t.conceptGraph.length>0&&(Or.length=0,t.conceptGraph.forEach(function(r){Or.push(r)})),un={name:e,modules:t.modules||[],textbook:t.textbook||e+"教材",alertRule:t.alertRule||{},localQuestions:t.localQuestions||{},milestoneLabel:t.milestoneLabel||"专业课核心能力验证（独立完成{hard}）"};var n=rs();Mr.length=0,n.forEach(function(r){Mr.push(r)})}function tl(e,t){if(!K.configured())return Promise.resolve(null);var n=`你是考研专业课知识体系架构师。
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
4. 只返纯 JSON，不要加注释`;function r(f){var d=(f||"").trim(),m=d.match(/```(?:json)?\s*([\s\S]*?)```/);if(m)return m[1].trim();var p=d.indexOf("{");if(p===-1)return"";for(var y=0,g=!1,v=!1,w=-1,S=p;S<d.length;S++){var O=d.charAt(S);if(v){v=!1;continue}if(O==="\\"){v=!0;continue}if(O==='"'){g=!g;continue}if(!g){if(O==="{")y++;else if(O==="}"&&(y--,y===0)){w=S+1;break}}}return w>p?d.slice(p,w):""}function s(f){var d=f;return d=d.replace(/\/\/(?=(?:[^"']*(?:"[^"]*"|'[^']*'))*[^"']*$)[^\n]*/g,""),d=d.replace(/\/\*[\s\S]*?\*\//g,""),d=d.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g,'"$1"'),d=d.replace(/,\s*([}\]])/g,"$1"),d=d.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*:)/g,'"$2"$3'),d=d.replace(/[\x00-\x09\x0b\x0c\x0e-\x1f]/g," "),d}function o(f){var d=r(f);if(!d)return null;var m,p;try{m=JSON.parse(d)}catch{}try{m||(p=JSON.parse(s(d)))}catch{}var y=m||p;return y?Qe.repairMangledLatex(y):null}var i=1,a=0,c=null;function l(f){var d=f&&f.message||"";return!!(/HTTP\s*5\d{2}/.test(d)||/Failed to fetch|NetworkError|TypeError.*network|Load failed|abort/i.test(d)||/timeout|timed? out|ETIMEDOUT/i.test(d)||f instanceof DOMException||f&&f.name==="AbortError"||/HTTP\s*(429|403)/.test(d))}function u(){a++;var f=a===1?n:n+`

【重要】上次返回的内容无法解析为有效 JSON。请务必：只输出一个标准 JSON 对象，不要任何解释文字、不要 markdown 标记、不要注释、不要尾逗号。直接以 { 开头、以 } 结尾。`;if(a>1)try{var d=document.getElementById("gm-status");d&&(d.textContent=x.icon("refresh")+" 第 "+a+" 次尝试生成中…")}catch{}return K.chatStream(f,"请按上述要求生成。",function(m,p){t&&t(m||p||"")},null,{cache:!1}).then(function(m){var p=o(m);if(p){if(!p.modules||!Array.isArray(p.topics))throw new Error("缺少 modules/topics");return p.topics.forEach(function(y,g){y.id||(y.id="gen-"+g)}),p.conceptGraph&&p.conceptGraph.forEach(function(y,g){y.id||(y.id="cg-"+g)}),typeof b<"u"&&b.update(function(y){y.majorData||(y.majorData={}),y.majorData[e]=p}),Pr(e,p),p}return a<=i?(console.warn("[DB] AI 专业数据 JSON 解析失败，第 "+a+" 次重试…(原始长度:"+(m||"").length+")"),u()):(console.warn("[DB] AI 生成专业数据解析最终失败。原始响应前200字符:",(m||"").slice(0,200)),c=new Error("AI 返回内容无法解析为有效 JSON"),null)}).catch(function(m){if(console.warn("[DB] AI 生成专业请求失败(第"+a+"次):",m.message),c=m,a<=i&&l(m))return console.warn("[DB] 检测到可重试错误，将重试…"),u();throw m})}return u().catch(function(f){throw f||c||new Error("未知错误")})}function nl(){try{if(typeof b>"u")return;var e=b.get();if(e&&e.settings&&e.settings.examConfig){var t=ti(e.settings.examConfig);Object.keys(t).forEach(function(r){ei[r]=t[r]});var n=e.settings.examConfig.profName||"自控原理";ii(n),ai(n)}}catch{}}function ai(e){try{if(typeof b>"u"||un.name!==e)return;var t=un.modules||[];if(!t.length)return;var n=b.get(),r=n.progress&&n.progress.ctrl&&n.progress.ctrl.modules||{},s=Object.keys(r),o=s.length===t.length&&t.every(function(a){return r.hasOwnProperty(a)});if(o)return;var i={};t.forEach(function(a){i[a]=r[a]||0}),b.update(function(a){a.progress.ctrl.modules=i})}catch{}}function rl(){return un}function sl(){try{var e=b.get().settings.redline.items;if(Array.isArray(e)&&e.length)return e}catch{}return ri}function ol(){try{var e=b.get().settings.redline.checklist;if(Array.isArray(e)&&e.length)return e}catch{}return si}function il(){var e=oi.slice();try{var t=(b.get().settings.redline.keywords||"").split(/[,，\s]+/).map(function(n){return n.trim()}).filter(Boolean);e=e.concat(t)}catch{}return e}function al(){try{var e=b.get().settings.coachProfile;if(e&&e.mathWeak)return e}catch{}return{mathWeak:"符号错误、分式漏分母、积分因子符号反",distractions:"硬件项目、B站、游戏",redlineNote:"“二战”是违禁词"}}function cl(){try{var e=b.get().settings.scheduler;if(e)return{useAI:e.useAI!==!1,mathAccThreshold:e.mathAccThreshold||70,idleDays:e.idleDays||3,signWeekThreshold:e.signWeekThreshold||3,signForceCount:e.signForceCount||5,polCap:e.polCap||2,routine:e.routine||"normal",dayHours:e.dayHours||6,hardHours:e.hardHours||4,reviewOn:e.reviewOn!==!1,reviewCap:e.reviewCap||2,adjustOn:e.adjustOn!==!1}}catch{}return{useAI:!0,mathAccThreshold:70,idleDays:3,signWeekThreshold:3,signForceCount:5,polCap:2,routine:"normal",dayHours:6,hardHours:4,reviewOn:!0,reviewCap:2,adjustOn:!0}}function ll(){try{var e=b.get().settings.targetScores;if(e&&e.math)return e}catch{}return{math:130,prof:135,eng:70,pol:65}}var Cr="kaoyan2026_schedplan";function ul(){try{return JSON.parse(localStorage.getItem(Cr)||"null")}catch{return null}}function dl(e){try{e?localStorage.setItem(Cr,JSON.stringify(e)):localStorage.removeItem(Cr)}catch{}}const ee={SUBJECTS:ei,MISTAKE_TYPES:{sign:{name:"符号错误",color:"#cf1322"},fraction:{name:"分式漏分母",color:"#237804"},concept:{name:"概念混淆",color:"#2f54eb"},integral:{name:"积分因子",color:"#722ed1"},careless:{name:"粗心大意",color:"#d48806"},other:{name:"其他",color:"#8c8c8c"}},TOPICS:ni,TIERS:Vc,CONCEPT_GRAPH:Or,SCHOOLS:Ir,RED_LINES:ri,FOOLPROOF_CHECKLIST:si,FOOLPROOF_REMIND:Xc,HARDWARE_KEYWORDS:oi,VOCAB:Yc,INSPECTOR_TYPES:Zc,MILESTONES:Mr,AI_PRESETS:el,MATH_VARIANTS:Tr,ENG_VARIANTS:Er,getActiveSubjects:ti,syncSubjects:nl,recommendSchools:Wc,MAJOR_REGISTRY:Ie,loadMajorData:ii,generateMajorAI:tl,getActiveMajor:rl,reconcileProgressModules:ai,getMilestones:rs,activeMajor:function(){return un},redlineItems:sl,redlineChecklist:ol,redlineKeywords:il,coachProfile:al,schedulerConfig:cl,targetScores:ll,readSchedulerPlan:ul,writeSchedulerPlan:dl};function ss(){try{return ee.getActiveMajor().name||"专业课"}catch{return"专业课"}}function os(e){try{return window.AiMemory?window.AiMemory.digest(e):""}catch{return""}}function Nr(){const e=ss(),t=(function(){try{return ee.coachProfile()}catch{return null}})()||{mathWeak:"数学计算易错",distractions:"分心/畏难",redlineNote:"“二战”是违禁词"},n=os();return"你是一名严厉的2026考研教练，服务对象是一名考研考生，专业课为「"+e+"」。其目标：公共课高分、专业课高分，一志愿上岸拒绝二战。其致命弱点："+t.mathWeak+"、偶有"+t.distractions+"冲动。"+(n?`
`+n+`
`:"")+"回复要求：1) 直接、犀利、不灌鸡汤；2) 优先指出风险与防呆措施；3) 建议必须落到具体章节/题量/时间；4) 发现"+t.redlineNote+"，立即引用红线禁令制止；5) 用简体中文，200-400字。"}const is="必须只输出 JSON，不要任何多余文字、不要markdown代码块。",as='"diagram":"题目需要配图时输出一段 SVG 代码字符串（不需要图时填 ""）。只能用 SVG，不要用 Mermaid 或其他语法。\\n硬性画法规范（务必遵守，否则图会很难看）：\\n1) 根标签必须为 <svg xmlns=\\\\"http://www.w3.org/2000/svg\\\\" viewBox=\\\\"0 0 320 240\\\\">，所有元素坐标必须落在 viewBox 内并留 20px 以上边距。\\n2) 建坐标系时统一取原点像素 O=(40,200)，x 正方向向右、y 正方向向上（即逻辑点 (a,b) → 像素 (40+a*S, 200-b*S)，S 为每单位像素数，自行选 S 使图形占满画布且不越界）。先把每个关键点的像素值算出来再写，不要凭感觉写坐标。\\n3) 坐标轴用 stroke=\\\\"#999\\\\" stroke-width=\\\\"1\\\\" 的直线，末端加小三角箭头；轴末标 x / y，原点标 O。\\n4) 阴影区域用 <polygon> 或 <path>，fill=\\\\"#4a90d9\\\\" fill-opacity=\\\\"0.18\\\\" stroke=\\\\"#2c6cb0\\\\" stroke-width=\\\\"1.5\\\\"。\\n5) 曲线用 <path d=\\\\"M ... L ...\\\\">，按函数在 8~20 个采样点上真实算出坐标再连线，禁止随手写贝塞尔。\\n6) 所有 <text> 用 font-size=\\\\"12\\\\" 或 13，短标签（如 (1,0)、x+y=1、区域D），文字必须避开线条且不出界。\\n示例（区域 D：x≥0, y≥0, x+y≤1，取 S=160）：\\n<svg xmlns=\\\\"http://www.w3.org/2000/svg\\\\" viewBox=\\\\"0 0 320 240\\\\"><line x1=\\\\"40\\\\" y1=\\\\"200\\\\" x2=\\\\"290\\\\" y2=\\\\"200\\\\" stroke=\\\\"#999\\\\" stroke-width=\\\\"1\\\\"/><polygon points=\\\\"290,200 282,196 282,204\\\\" fill=\\\\"#999\\\\"/><line x1=\\\\"40\\\\" y1=\\\\"200\\\\" x2=\\\\"40\\\\" y2=\\\\"20\\\\" stroke=\\\\"#999\\\\" stroke-width=\\\\"1\\\\"/><polygon points=\\\\"40,20 36,28 44,28\\\\" fill=\\\\"#999\\\\"/><polygon points=\\\\"40,200 200,200 40,40\\\\" fill=\\\\"#4a90d9\\\\" fill-opacity=\\\\"0.18\\\\" stroke=\\\\"#2c6cb0\\\\" stroke-width=\\\\"1.5\\\\"/><text x=\\\\"294\\\\" y=\\\\"204\\\\" font-size=\\\\"12\\\\">x</text><text x=\\\\"32\\\\" y=\\\\"18\\\\" font-size=\\\\"12\\\\">y</text><text x=\\\\"26\\\\" y=\\\\"214\\\\" font-size=\\\\"12\\\\">O</text><text x=\\\\"196\\\\" y=\\\\"216\\\\" font-size=\\\\"12\\\\">(1,0)</text><text x=\\\\"10\\\\" y=\\\\"40\\\\" font-size=\\\\"12\\\\">(0,1)</text><text x=\\\\"88\\\\" y=\\\\"160\\\\" font-size=\\\\"13\\\\" fill=\\\\"#2c6cb0\\\\">区域 D</text><text x=\\\\"150\\\\" y=\\\\"96\\\\" font-size=\\\\"12\\\\">x+y=1</text></svg>\\n流程/框图类题目同样用 SVG 画（矩形 + 箭头 + 文字），不要输出 Mermaid。';function ci(){const e=ss(),t=os(400);let n="";try{const r=window.AiTools;r&&r.enabled&&r.enabled()?n='"diagram":""(留空，不要再输出 SVG),"diagramNote":"配图说明(可空,如:函数f(x)=x²-2在[-2,3]的图像,标出零点)",\\n配图规则：几何/函数图像/积分区域等需要图形的题，先调用 python_exec 用 matplotlib 画出精确图形（figsize≈(4,3)，坐标轴/刻度/图例齐全，关键点标注），图会自动作为题目配图收录；JSON 里严禁再输出 SVG 代码字符串。\\n':n=as+'"}'}catch{n=""}return"你是考研数学 / "+e+" 出题官。根据用户给出的考点、层级、薄弱错误类型，出1道题。"+(t?`参考考生记忆，优先针对其长期弱点命题：
`+t+`
`:"")+is+'格式：{"stem":"题干（公式用纯文本，如 ∫(0到1) x dx）","type":"choice|solve","options":["A. ...","B. ...","C. ...","D. ..."](仅choice需要),"answer":"标准答案","solution":"分步详解（标出关键步骤）","trap":"本题最易踩的坑（符号/分母/积分因子/概念）",'+n+"题目必须贴合考研难度，层级越高越综合。矩阵/行列式必须用LaTeX语法输出（用$包裹）：如$\\begin{vmatrix}1&2\\\\3&4\\end{vmatrix}$，不要用[[1,2],[3,4]]文本格式。"}const li="你是考研阅卷老师，极其严格，按步骤给分。根据题目、标准答案、学生作答，输出判卷结果。"+is+'格式：{"score":0-100整数,"verdict":"对|部分对|错","steps":[{"point":"采分点","got":true|false,"note":"评语"}],"errorType":"sign|fraction|integral|concept|careless|other|none","comment":"一句话点评（指出最致命问题）"}。若学生跳步、符号错误、漏分母，即使答案碰巧对也要扣分并标记对应errorType。',ar=[{id:"global.coach",name:"AI 教练人格（全局 system · copilot 对话底座）",build:function(){return Nr()}},{id:"quiz.gen",name:"出题官（quiz.gen 单题生成 · 注入记忆摘要/考点/薄弱参数）",build:function(){return ci()}},{id:"quiz.answer",name:"阅卷官（quiz.answer 判分讲解）",build:function(){return li}},{id:"copilot.review",name:"深度复盘教练（copilot.review 全景快照分析）",build:function(){return K.DEEP_REVIEW_PROMPT}},{id:"spec.json",name:"共享片段 · JSON 输出纪律（JSON_ONLY，被出题/判卷等复用）",build:function(){return is}},{id:"spec.svg",name:"共享片段 · SVG 画图规约（SVG_DIAGRAM_SPEC，dashboard 每日一题等复用）",build:function(){return as}}];function cs(e){return!!(e&&e.endpoint&&e.key&&e.model)}(function(){try{const t=b.get().ai;(!t.apis||!t.apis.length)&&t.endpoint&&t.key&&b.update(function(n){if(n.ai.apis&&n.ai.apis.length)return;const r=ee.AI_PRESETS[n.ai.preset]&&ee.AI_PRESETS[n.ai.preset].name||"接口1",s={id:"api_"+Date.now(),name:r,endpoint:n.ai.endpoint,key:n.ai.key,model:n.ai.model};n.ai.apis=[s],n.ai.activeApi=s.id})}catch{}})();function fl(){return(b.get().ai.apis||[]).slice()}function Dt(){const e=b.get().ai,t=e.apis||[];let n=null;for(let r=0;r<t.length;r++)if(t[r].id===e.activeApi){n=t[r];break}return n||(n=t.filter(cs)[0]||t[0]),n||{id:"",name:"默认",endpoint:e.endpoint,key:e.key,model:e.model}}function ls(e){const t=e.ai.apis||[];let n=null;for(let r=0;r<t.length;r++)if(t[r].id===e.ai.activeApi){n=t[r];break}n||(n=t[0]),n&&(e.ai.endpoint=n.endpoint,e.ai.key=n.key,e.ai.model=n.model)}function pl(e){let t=null;return b.update(function(n){n.ai.apis=n.ai.apis||[];let r=-1;for(let o=0;o<n.ai.apis.length;o++)if(e.id&&n.ai.apis[o].id===e.id){r=o;break}r>=0?n.ai.apis[r]=e:(e.id="api_"+Date.now()+"_"+Math.floor(Math.random()*1e3),n.ai.apis.push(e));let s=!1;for(let o=0;o<n.ai.apis.length;o++)if(n.ai.apis[o].id===n.ai.activeApi){s=!0;break}s||(n.ai.activeApi=e.id),ls(n),t=e}),t}function hl(e){b.update(function(t){t.ai.apis=(t.ai.apis||[]).filter(function(n){return n.id!==e}),t.ai.activeApi===e&&(t.ai.activeApi=t.ai.apis.length?t.ai.apis[0].id:""),ls(t),t.ai.apis.length||(t.ai.endpoint="",t.ai.key="",t.ai.model="")})}function gl(e,t){b.update(function(n){const r=n.ai.apis||[];let s=-1;for(let a=0;a<r.length;a++)if(r[a].id===e){s=a;break}const o=s+t;if(s<0||o<0||o>=r.length)return;const i=r[s];r[s]=r[o],r[o]=i})}function ui(e,t){let n=null;return b.update(function(r){const s=r.ai.apis||[];for(let o=0;o<s.length;o++)if(s[o].id===e){n=s[o];break}n&&(r.ai.activeApi=e,ls(r))}),n&&t&&window.Toast&&window.Toast.show("⚡ AI 接口已自动切换到「"+n.name+"」","info",4e3),n}function ml(){const e=b.get().ai,t=Dt();if(e.autoSwitch===!1)return[t];const n=(e.apis||[]).filter(function(r){return cs(r)&&r.id!==t.id});return[t].concat(n)}function yl(e){const n=(e&&e.message||"").match(/^HTTP (\d{3})/);if(n){const r=+n[1];return r===401||r===403||r===408||r===429||r>=500}return!0}function hn(e){if(!e)return null;const t=(b.get().ai||{}).apis||[];for(let n=0;n<t.length;n++)if(t[n].id===e)return t[n];return null}const We={until:0,strikes:0};function vl(e){const t=e&&e.message||"",n=t.match(/^HTTP (\d{3})/);return n?+n[1]==429:/限流|too many|rate.?limit/i.test(t)}function bl(){return new Promise(function(e){const t=function(){const n=We.until-Date.now();if(n<=0)return e();setTimeout(t,Math.min(n,800)+Math.random()*250)};t()})}function wl(e){We.strikes++;const t=Math.min(6e4,5e3*Math.pow(2,Math.min(We.strikes-1,4))),n=Date.now()+t*(.8+Math.random()*.4);n>We.until&&(We.until=n),console.warn("[AI] 429 限流：全局闸门 "+Math.round((We.until-Date.now())/1e3)+"s（连续 "+We.strikes+" 次）——在途调用共享闸门错峰重试",e&&e.message||"")}function us(e,t){const n=t&&t.apiId?hn(t.apiId):null,r=n?[n]:ml();let s=0,o=0;async function i(){const a=r[s];try{await bl();const c=await e(a);if(We.strikes=Math.floor(We.strikes/2),s>0&&a.id)try{ui(a.id,!0)}catch(l){console.warn("[AI] 切换持久化失败（不影响本次结果）",l)}return c}catch(c){if(c&&c.aborted)throw c;if(vl(c)&&o<6)return wl(c),o++,i();if(s<r.length-1&&yl(c))return console.warn("[AI] 接口「"+(a.name||a.endpoint)+"」失败："+(c.message||c)+"，自动切换到「"+r[s+1].name+"」重试…"),s++,i();throw c}}return i()}const kl=3e4;function ds(e,t,n,r){if(typeof AbortController>"u")return fetch(e,t);const s=new AbortController;t.signal=s.signal;const o=n||kl,i=setTimeout(function(){s.abort()},o);return r&&(r.aborted?s.abort():r.addEventListener("abort",function(){s.abort()},{once:!0})),fetch(e,t).then(function(a){return clearTimeout(i),a},function(a){if(clearTimeout(i),a&&a.name==="AbortError")throw r&&r.aborted?Object.assign(new Error("已取消"),{aborted:!0}):new Error("连接超时："+Math.round(o/1e3)+" 秒内未收到响应（视觉模型+思考模式可能需要更长时间，请重试或暂时关闭思考模式）");let c=a&&a.message||"网络错误";throw/Failed to fetch|ERR_NETWORK|ERR_CONNECTION/i.test(c)&&(c="网络连接失败（请检查网络或 API 地址是否可达）"),new Error(c)})}const dn="kaoyan2026_ai_cache_v1",oo=60,xl=2e4;function di(){const e=b.get().ai;return{on:e.cacheOn!==!1,ttlMs:(e.cacheTTL>0?e.cacheTTL:360)*6e4}}function fs(){try{return JSON.parse(localStorage.getItem(dn))||{}}catch{return{}}}function Lr(e){try{localStorage.setItem(dn,JSON.stringify(e))}catch{try{localStorage.removeItem(dn)}catch{}}}function ps(e,t){const n=(e||"")+"|"+JSON.stringify(t);let r=2166136261;for(let s=0;s<n.length;s++)r^=n.charCodeAt(s),r=r+((r<<1)+(r<<4)+(r<<7)+(r<<8)+(r<<24))>>>0;return r.toString(16)+"_"+n.length}function hs(e){const t=di();if(!t.on||!e)return null;const n=fs(),r=n[e];return r?Date.now()-r.t>t.ttlMs?(delete n[e],Lr(n),null):(r.h=(r.h||0)+1,r.u=Date.now(),Lr(n),console.log("[AI] ✓ 缓存命中（第"+r.h+"次复用，省一次调用）key="+e),r.v):null}function gs(e,t){if(!di().on||!e||typeof t!="string"||!t||t.length>xl)return;const r=fs();r[e]={v:t,t:Date.now(),u:Date.now(),h:0};const s=Object.keys(r);if(s.length>oo){s.sort(function(o,i){return(r[o].u||0)-(r[i].u||0)});for(let o=0;o<s.length-oo;o++)delete r[s[o]]}Lr(r)}function Sl(){const e=fs(),t=Object.keys(e);let n=0,r=0,s=0;t.forEach(function(o){n+=e[o].h||0,s+=(e[o].h||0)*(e[o].v||"").length});try{r=(localStorage.getItem(dn)||"").length}catch{}return{entries:t.length,hits:n,kb:Math.round(r/1024*10)/10,savedChars:s}}function _l(){try{localStorage.removeItem(dn)}catch{}}const ms="kaoyan2026_ai_usage_v1";function fi(){try{const e=JSON.parse(localStorage.getItem(ms))||{};return{requests:e.requests||0,prompt:e.prompt||0,completion:e.completion||0,cacheHit:e.cacheHit||0}}catch{return{requests:0,prompt:0,completion:0,cacheHit:0}}}function Xt(e){if(e)try{const t=fi();t.requests++,t.prompt+=e.prompt_tokens||0,t.completion+=e.completion_tokens||0,t.cacheHit+=e.prompt_cache_hit_tokens||e.prompt_tokens_details&&e.prompt_tokens_details.cached_tokens||0,localStorage.setItem(ms,JSON.stringify(t))}catch{}}function Al(){return fi()}function Tl(){try{localStorage.removeItem(ms)}catch{}}function El(){return cs(Dt())}(function(){try{const t=b.get().ai;t&&t.thinkingMode===!0&&!t._thinkingModeSetByUser&&b.update(function(n){n.ai.thinkingMode===!0&&!n.ai._thinkingModeSetByUser&&(n.ai.thinkingMode=void 0)})}catch{}})();function Ol(e){const t=ee.AI_PRESETS[e];t&&b.update(n=>{n.ai.preset=e,e!=="custom"&&(n.ai.endpoint=t.endpoint,n.ai.model=t.model)})}function io(){const e=window.ReviewModule.weekData(),t=b.mistakeCountWeek("sign"),n=b.get(),r=n.mental.filter(i=>x.inThisWeek(i.date)&&i.hwUrge).length,s={normal:"正常",anxious:"焦虑",tired:"疲劳",impulsive:"冲动",panic:"恐慌"};let o="专业课";try{o=ee.getActiveMajor().name||"专业课"}catch{}return`【本周学习摘要】
时长：`+e.totalHours+"h | 数学正确率："+(e.accuracy!=null?e.accuracy+"%":"未录入")+" | 主要错误："+(e.top2.length?e.top2.map(i=>i.name).join("、"):"无记录")+`
`+o+"进度："+b.profAdvancedPercent()+"% | 心理状态："+(s[e.mental]||"未记录")+" | 分心冲动："+r+"次"+(r?"（已劝阻）":"")+`
符号错误：`+t+"次/周 | 本周错题："+e.weekMistakes+"条 | 里程碑："+ee.MILESTONES.map(i=>(n.milestones[i.id]?"✓":"✗")+i.date).join(" ")}function pi(e,t){return e.text().then(function(n){let r="";try{const s=JSON.parse(n);r=s.error?s.error.message||JSON.stringify(s.error):n.slice(0,300)}catch{r=n.slice(0,200)}throw new Error("HTTP "+e.status+(r?" ("+r+")":""))}).catch(function(n){throw n.message&&n.message.indexOf("HTTP ")===0?n:new Error("HTTP "+(e&&e.status||"?")+" ("+t+")")})}function ys(e){const t=String(e.endpoint||"");try{const n=new URL(t),r=typeof location<"u"&&location.hostname||"";if((r==="localhost"||r==="127.0.0.1")&&n.host==="token.sensenova.cn")return"/sn-api"+n.pathname+n.search}catch{}return t}function vs(e,t,n,r){n=!!n,r=r||{};const s=b.get().ai,o=r&&r._temp!=null?r._temp:bs(r),i=n?{model:e.model,messages:t}:{model:e.model,messages:t,temperature:o??.6};n||(r.noThink?i.chat_template_kwargs={enable_thinking:!1}:(s.thinkingMode===!0||s.thinkingMode===!1)&&(i.chat_template_kwargs={enable_thinking:s.thinkingMode}),r.maxTokens&&(i.max_tokens=r.maxTokens));const a=JSON.stringify(i);return console.log("[AI] rawChat 请求 接口="+(e.name||"")+" endpoint="+(e.endpoint||"").slice(0,60)+" model="+e.model+" messages数量="+t.length+" body前200字="+a.slice(0,200)),ds(ys(e),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e.key},body:a},r&&r.timeout||void 0,r&&r.signal).then(function(c){return c.ok?c.json():c.status===400&&!n?(console.error("[AI] rawChat 400！原始body前300字:",a.slice(0,300)),console.warn("[AI] 自动用极简请求体重试…"),vs(e,t,!0,r)):pi(c,"请求被拒绝")}).then(function(c){if(typeof c=="string")return c;Xt(c.usage);const l=c.choices&&c.choices[0]&&c.choices[0].message&&c.choices[0].message.content;if(!l)throw new Error("接口返回异常");return l})}const hi="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAFklEQVR42mP4z8BAEmIY1TCqYfhqAACQ+f8B8u7oVwAAAABJRU5ErkJggg==",gi="这是一张纯色小图。请只看图片内容、不要猜测，回答它的颜色。只回复一个字：红 / 蓝 / 绿 / 黄。",Il=6e4;function Ml(e){const t=e||{};if(!t.endpoint||!t.key||!t.model)return Promise.resolve({v:"unknown",note:"配置不完整，无法探测"});const n=[{role:"user",content:[{type:"text",text:gi},{type:"image_url",image_url:{url:hi}}]}],r=JSON.stringify({model:t.model,messages:n,max_tokens:16});return ds(ys(t),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+t.key},body:r},Il).then(function(s){return s.ok?s.json().then(function(o){Xt(o&&o.usage);const i=o&&o.choices&&o.choices[0]&&o.choices[0].message,a=String(i&&i.content||"").trim(),c=String(i&&(i.reasoning_content||i.reasoning)||"").trim(),l=a||c;return l?/红|red/i.test(l)?{v:"ok",note:"已正确识别探针图（纯红）",reply:l.slice(0,40)}:{v:"weak",note:"接受图片输入但未正确识别（回复："+l.slice(0,20)+"）",reply:l.slice(0,40)}:{v:"weak",note:"接口返回空内容，无法确认是否真的看到了图"}}):(s.text?s.text():Promise.resolve("")).then(function(o){let i="";try{const c=JSON.parse(o);i=c.error&&(c.error.message||JSON.stringify(c.error))||String(o).slice(0,160)}catch{i=String(o||"").slice(0,160)}return{v:s.status===400||s.status===415||s.status===422?"no":"unknown",note:"HTTP "+s.status+(i?"（"+i+"）":""),status:s.status}})}).catch(function(s){return{v:"unknown",note:s&&s.message||"网络错误"}})}function mi(e,t){t=t||{};let n=null;if(t.cache!==!1){const r=t.apiId&&hn(t.apiId)||Dt();n=ps(r.model,e);const s=hs(n);if(s!=null)return Promise.resolve(s)}return us(function(r){return vs(r,e,!1,t)},t).then(function(r){return gs(n,r),r})}function cr(e,t){if(!(t&&t.noTools)){const n=ki();if(n)return n({system:Nr(),user:e,label:xi(t&&t.ctx),signal:t&&t.signal})}return mi([{role:"system",content:Nr()},{role:"user",content:e}],t)}function Pl(e,t,n,r){r=r||{};const s=Object.assign({},r);return Si(e,t,null,n,s).then(o=>Yt(o))}function lr(e){const t=String(e||"");for(let n=0;n<t.length;n++){const r=t.charAt(n);if(r!=="{"&&r!=="[")continue;const s=r,o=s==="{"?"}":"]";let i=0,a=!1,c=!1,l=-1;for(let u=n;u<t.length;u++){const f=t.charAt(u);if(c){c=!1;continue}if(f==="\\"){c=!0;continue}if(f==='"'){a=!a;continue}if(!a){if(f===s)i++;else if(f===o&&(i--,i===0)){l=u+1;break}}}if(l>n){const u=t.slice(n,l);try{return JSON.parse(u),u}catch{}try{return JSON.parse(Pt(u)),u}catch{}}}return""}function Pt(e){let t="",n="",r=!1;for(let s=0;s<e.length;s++){const o=e.charAt(s);if(n){if(r){o==='"'||o==="\\"||o==="u"?t+=o:t+="\\"+o,r=!1;continue}if(o==="\\"){t+=o,r=!0;continue}if(o===n){n="",t+='"';continue}if(o==='"'){t+='\\"';continue}if(o===`
`){t+="\\n";continue}if(o==="\r"){t+="\\r";continue}if(o==="	"){t+="\\t";continue}if(o<" ")continue;t+=o;continue}if(o==='"'){n='"',t+='"';continue}if(o==="'"){n="'",t+='"';continue}if(o==="“"){n="”",t+='"';continue}if(o==="/"&&e.charAt(s+1)==="/"){for(;s<e.length&&e.charAt(s)!==`
`;)s++;continue}if(o==="/"&&e.charAt(s+1)==="*"){for(s+=2;s+1<e.length&&!(e.charAt(s)==="*"&&e.charAt(s+1)==="/");)s++;s++;continue}if(!(o<" "&&o!==`
`&&o!=="\r"&&o!=="	")){if(/[A-Za-z_$]/.test(o)){const i=e.slice(s).match(/^([A-Za-z_$][\w$]*)(\s*:)/);if(i){t+='"'+i[1]+'"'+i[2],s+=i[0].length-1;continue}}t+=o}}return n&&(t+='"'),t.replace(/,\s*([}\]])/g,"$1")}function Cl(e){let t="",n=!1,r=!1,s=0;const o=e.length;for(;s<o;){const i=e.charAt(s);if(r){t+=i,r=!1,s++;continue}if(i==="\\"){t+=i,r=!0,s++;continue}if(i==='"'){if(!n){n=!0,t+=i,s++;continue}let a=s+1;for(;a<o&&/[\s]/.test(e.charAt(a));)a++;const c=a<o?e.charAt(a):"";if(c===","||c==="}"||c==="]"||c===":"||c==="{"||c==="["||c===""){n=!1,t+=i,s++;continue}t+='\\"',s++;continue}t+=i,s++}return t}function jr(e){const t=[],n={};let r=0;const s=e.length;for(;r<s;){if(e.charAt(r)!=="{"){r++;continue}let o=0,i=!1,a=!1,c=-1;for(let f=r;f<s;f++){const d=e.charAt(f);if(i){if(a){a=!1;continue}if(d==="\\"){a=!0;continue}d==='"'&&(i=!1);continue}if(d==='"'){i=!0;continue}if(d==="{")o++;else if(d==="}"&&(o--,o===0)){c=f+1;break}}if(c<0){r++;continue}const l=e.slice(r,c);let u=null;try{u=JSON.parse(l)}catch{try{u=JSON.parse(Pt(l))}catch{u=null}}if(u&&typeof u=="object"&&!Array.isArray(u)){const f=JSON.stringify(u);n[f]||(n[f]=1,t.push(u))}r=c}return t}function ao(e){let t="",n=!1,r=!1;const s=[];for(let o=0;o<e.length;o++){const i=e.charAt(o);if(n&&!r){if(i===`
`){t+="\\n";continue}if(i==="\r"){t+="\\r";continue}if(i==="	"){t+="\\t";continue}if(i<" ")continue}if(t+=i,r){r=!1;continue}if(i==="\\"){r=!0;continue}if(i==='"'){n=!n;continue}n||(i==="{"||i==="["?s.push(i):(i==="}"||i==="]")&&s.length&&s.pop())}for(n&&(t.charAt(t.length-1)==="\\"&&(t+="\\"),t+='"');s.length;){const o=s.pop();t+=o==="{"?"}":"]"}return t.replace(/,\s*([}\]])/g,"$1")}function Yt(e){const t=[],n=function(g,v){t.push("L"+g+":"+v)};let r=String(e??"").replace(/^\uFEFF/,"");r=r.replace(/<think>[\s\S]*?<\/think>/gi,"").trim(),r=Cl(r);let s=null,o;const i=/```(?:json|JSON)?\s*([\s\S]*?)```/g;for(;(o=i.exec(r))!==null;)(!s||o[1].length>s.length)&&(s=o[1]);if(s){const g=s.trim();try{return JSON.parse(g)}catch(v){n(1,"代码块直接解析失败("+v.message.slice(0,40)+")")}try{return JSON.parse(Pt(g))}catch(v){n(1,"代码块修复后仍解析失败("+v.message.slice(0,40)+")")}r=g}else n(1,"无 markdown 代码块");let a=-1;for(let g=0;g<r.length;g++)if(r.charAt(g)==="["||r.charAt(g)==="{"){a=g;break}if(a===-1)throw new Error("AI未返回JSON（L2失败：未找到 [ 或 {）。原始回复前200字："+r.slice(0,200));const c=r.charAt(a)==="[",l=c?"[":"{",u=c?"]":"}";let f=0,d=!1,m=!1,p=-1;for(let g=a;g<r.length;g++){const v=r.charAt(g);if(m){m=!1;continue}if(v==="\\"){m=!0;continue}if(v==='"'){d=!d;continue}if(!d){if(v===l)f++;else if(v===u&&(f--,f===0)){p=g+1;break}}}if(p<0&&n(2,"括号计数未找到匹配闭合（疑似截断或字符串引号错乱）"),p>a){const g=r.slice(a,p);try{return JSON.parse(g)}catch(v){n(3,v.message.slice(0,50))}try{return JSON.parse(Pt(g))}catch(v){n(4,v.message.slice(0,50))}}if(p<0){const g=r.slice(a);try{return JSON.parse(ao(g))}catch(v){n(4.5,"截断补齐后解析失败("+v.message.slice(0,40)+")")}try{return JSON.parse(ao(Pt(g)))}catch(v){n(4.5,"截断补齐+修复后仍失败("+v.message.slice(0,40)+")")}}const y=jr(r.slice(a));if(y.length)return c?y:y.length===1?y[0]:y;if(n(5,"无任何完整可解析对象"),!c){const g={};[["w",/"w"\s*:\s*"((?:[^"\\]|\\.)*)"/],["com",/"com"\s*:\s*"((?:[^"\\]|\\.)*)"/],["rare",/"rare"\s*:\s*"((?:[^"\\]|\\.)*)"/],["ex",/"ex"\s*:\s*"((?:[^"\\]|\\.)*)"/],["word",/"word"\s*:\s*"((?:[^"\\]|\\.)*)"/],["question",/"question"\s*:\s*"((?:[^"\\]|\\.)*)"/],["stem",/"stem"\s*:\s*"((?:[^"\\]|\\.)*)"/],["answer",/"answer"\s*:\s*"((?:[^"\\]|\\.)*)"/],["options",/"options"\s*:\s*(\[[\s\S]*?\]\s*[,}])/],["topicName",/"topicName"\s*:\s*"((?:[^"\\]|\\.)*)"/],["solution",/"solution"\s*:\s*"((?:[^"\\]|\\.)*)"/],["subject",/"subject"\s*:\s*"([^"]*)"/],["keySteps",/"keySteps"\s*:\s*"((?:[^"\\]|\\.)*)"/],["errorCause",/"errorCause"\s*:\s*"((?:[^"\\]|\\.)*)"/],["extractedQuestion",/"extractedQuestion"\s*:\s*"((?:[^"\\]|\\.)*)"/],["painPoint",/"painPoint"\s*:\s*"((?:[^"\\]|\\.)*)"/]].forEach(function(L){const R=e.match(L[1]);R&&(g[L[0]]=L[0]==="options"?R[1]:R[1].replace(/\\n/g,`
`).replace(/\\t/g,"	"))});const w=/"([A-Za-z_$][\w$]*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;let S;for(;(S=w.exec(r))!==null;)if(g[S[1]]===void 0)try{g[S[1]]=JSON.parse('"'+S[2]+'"')}catch{g[S[1]]=S[2]}const O=/"([A-Za-z_$][\w$]*)"\s*:\s*(\d+(?:\.\d+)?)/g;for(;(S=O.exec(r))!==null;)g[S[1]]===void 0&&(g[S[1]]=parseFloat(S[2]));const M=/"([A-Za-z_$][\w$]*)"\s*:\s*\[/g;for(;(S=M.exec(r))!==null;){if(g[S[1]]!==void 0)continue;let L=r.slice(S.index+S[0].length-1,S.index+S[0].length+4e3);(function(){let z=0,j=!1,C=!1,I=-1;for(let J=1;J<L.length;J++){const N=L.charAt(J);if(j){if(C){C=!1;continue}if(N==="\\"){C=!0;continue}N==='"'&&(j=!1);continue}if(N==='"'){j=!0;continue}if(N==="[")z++;else if(N==="]"){if(z===0){I=J;break}z--}}I>=0&&(L=L.slice(0,I))})();const R=jr(L);if(R.length){g[S[1]]=R;continue}const P=[],H=/"((?:[^"\\]|\\.)*)"/g;let B;for(;(B=H.exec(L))!==null&&P.length<12;)try{P.push(JSON.parse('"'+B[1]+'"'))}catch{P.push(B[1])}P.length&&(g[S[1]]=P)}let E=!1;if(Object.keys(g).forEach(function(L){Array.isArray(g[L])&&(E=!0)}),E||Object.keys(g).length>=3)return g;n(6,"正则捞值未命中关键字段")}throw new Error("AI未返回有效JSON（6层提取均失败）。失败轨迹："+t.join("；")+"。原始回复前200字："+r.slice(0,200))}function Dn(e,t,n,r,s){r=!!r,s=s||{};const o=t.some(function(l){return Array.isArray(l.content)&&l.content.some(function(u){return u.type==="image_url"})}),i=s.timeout||(o?3e5:3e4),a=r?{model:e.model,messages:t}:{model:e.model,stream:!0,messages:t};!r&&!s._noStreamOptions&&(a.stream_options={include_usage:!0}),r||(s._think===!1?a.chat_template_kwargs={enable_thinking:!1}:s._think===!0&&(a.chat_template_kwargs={enable_thinking:!0}),s.maxTokens&&(a.max_tokens=s.maxTokens),s._temp!=null&&(a.temperature=s._temp));const c=JSON.stringify(a);return console.log("[AI] chatStream 请求 接口="+(e.name||"")+" endpoint="+e.endpoint+" model="+e.model+" body前200字="+c.slice(0,200)),ds(ys(e),{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e.key},body:c},i,s&&s.signal).then(function(l){if(!l.ok){if(l.status===400&&!r){if(console.error("[AI] chatStream 400！原始body前300字:",c.slice(0,300)),!s._noStreamOptions){console.warn("[AI] 400 重试①：去掉 stream_options（保留 stream + thinking）…");const w=Object.assign({},s,{_noStreamOptions:!0});return Dn(e,t,n,!1,w)}return console.warn("[AI] 400 重试②：用极简请求体（仅 model+messages）…"),Dn(e,t,n,!0,s)}return pi(l,"请求被拒绝")}if(r)return console.log("[AI] 极简重试路径（非流式 JSON 解析）"),l.json().then(function(w){Xt(w.usage);const S=w.choices&&w.choices[0]&&w.choices[0].message,O=S&&(S.reasoning_content||S.reasoning)||"";let M=S&&S.content||"";if(!M&&O){const E=lr(O);if(E)M=E;else try{M=JSON.stringify(Yt(O))}catch{}}if(!M)throw new Error("接口返回异常");return n&&n(M,O),M});const u=l.body.getReader(),f=new TextDecoder;let d="",m="",p="",y="";const g=()=>{n&&n(d,m)};function v(){return u.read().then(function(w){const S=w.done,O=w.value;if(S){if(!d&&m){const L=lr(m);if(L)d=L;else try{d=JSON.stringify(Yt(m)),console.log("[AI] extractJsonStr 失败，extractRobustJSON 成功")}catch{console.log("[AI] reasoning 中未提取到 JSON")}}else if(!d&&!m&&y&&y.trim()){console.log("[AI] SSE 流无 data: 行，尝试解析 rawAll 兜底，前200字: "+y.slice(0,200));try{const L=JSON.parse(y.trim());Xt(L.usage);const R=L.choices&&L.choices[0]&&L.choices[0].message;if(m=R&&(R.reasoning_content||R.reasoning)||"",d=R&&R.content||"",!d&&m){const P=lr(m);if(P)d=P;else try{d=JSON.stringify(Yt(m))}catch{}}d||(d=y)}catch{d=y}}return g(),d}const M=f.decode(O,{stream:!0});y+=M,p+=M;const E=p.split(`
`);return p=E.pop(),E.forEach(L=>{const R=L.trim();if(!(!R||R==="data: [DONE]"||R.indexOf("data:")!==0))try{const P=JSON.parse(R.slice(5));if(P.usage&&(Xt(P.usage),!P.choices||!P.choices.length))return;const H=P.choices&&P.choices[0]&&P.choices[0].delta;if(!H)return;let B=!1;const z=H.reasoning_content!=null?H.reasoning_content:H.reasoning;z&&(m+=z,B=!0),H.content&&(d+=H.content,B=!0),B&&g()}catch{}}),v()})}return v()})}function Nl(){try{const e=b.get().ai.maxTokens;return e>0?e:null}catch{return null}}const yi=[{ctx:"quiz.gen",module:"出题",name:"出题生成",desc:"按考点生成题目与选项",def:"noThink"},{ctx:"quiz.variant",module:"出题",name:"错题变式",desc:"同考点换数换问法出变式",def:"noThink"},{ctx:"quiz.answer",module:"出题",name:"判分讲解",desc:"判分并讲解错因",def:"noThink"},{ctx:"copilot.chat",module:"AI 教练",name:"教练对话",desc:"自由对话 / 学习规划建议",def:"global"},{ctx:"copilot.review",module:"AI 教练",name:"深度复盘",desc:"学习进度全景深度复盘",def:"global"},{ctx:"photo.analyze",module:"拍题",name:"拍照分析",desc:"解析错题照片并归因",def:"noThink"},{ctx:"photo.similar",module:"拍题",name:"相似题生成",desc:"按照片考点出相似题",def:"noThink"},{ctx:"photo.weak",module:"拍题",name:"薄弱分析",desc:"照片暴露的薄弱点分析",def:"noThink"},{ctx:"essay.polish",module:"作文",name:"润色升级",desc:"作文润色 / 高分改写",def:"noThink"},{ctx:"essay.grade",module:"作文",name:"批改打分",desc:"按考研评分标准批改",def:"noThink"},{ctx:"word.gen",module:"单词",name:"词条提取",desc:"批量生成单词卡",def:"noThink"},{ctx:"word.mnemonic",module:"单词",name:"记忆口诀",desc:"为单词生成记忆锚点",def:"noThink"},{ctx:"pol.remember",module:"政治",name:"记忆口诀",desc:"政治知识点口诀化",def:"noThink"},{ctx:"pol.recite",module:"政治",name:"背诵判定",desc:"默写结果对照判分",def:"noThink"},{ctx:"insp.gen",module:"解题方法",name:"方法卡生成",desc:"AI 提炼解题方法卡",def:"noThink"},{ctx:"insp.example",module:"解题方法",name:"例题生成",desc:"按方法卡生成例题",def:"noThink"},{ctx:"insp.major",module:"解题方法",name:"专业方法卡",desc:"专业课专属方法卡",def:"noThink"},{ctx:"insp.guide",module:"解题方法",name:"带练提示",desc:"分步带练的提示点拨",def:"noThink"},{ctx:"insp.write",module:"解题方法",name:"带练代写",desc:"教练带你写标准答案",def:"noThink"},{ctx:"insp.check",module:"解题方法",name:"步骤审查",desc:"考生步骤与标准比对",def:"noThink"},{ctx:"mental.chat",module:"心理",name:"心理疏导",desc:"共情疏导与状态干预",def:"think"},{ctx:"sprint.trend",module:"智能押题",name:"趋势分析",desc:"押题趋势预判",def:"noThink"},{ctx:"sprint.gen",module:"智能押题",name:"押题组卷",desc:"单次调用生成整卷",def:"noThink"},{ctx:"sprint.parallel",module:"智能押题",name:"并行出题员",desc:"并行出卷的单题生成",def:"noThink"},{ctx:"sprint.review",module:"智能押题",name:"答案复核",desc:"深度复核原答案防幻觉",def:"think"},{ctx:"sprint.analyze",module:"智能押题",name:"整卷分析",desc:"多维评估整卷质量",def:"think"},{ctx:"sprint.chief",module:"智能押题",name:"总审查",desc:"并行出卷的整卷审查",def:"think"},{ctx:"cm.train",module:"特训营",name:"训练讲解",desc:"考点训练讲解",def:"noThink"},{ctx:"cm.judge",module:"特训营",name:"作答判定",desc:"作答对错判定",def:"noThink"},{ctx:"heat.gen",module:"考点热力",name:"热点生成",desc:"热力考点内容生成",def:"noThink"},{ctx:"heat.deep",module:"考点热力",name:"深度分析",desc:"薄弱点深度归因",def:"noThink"},{ctx:"mk.analyze",module:"错题本",name:"错题归因",desc:"错因分析 / 复习建议",def:"global"},{ctx:"mk.deep",module:"错题本",name:"深度分析",desc:"错题深度复盘",def:"noThink"},{ctx:"tutor.think",module:"AI 督学",name:"智能督学",desc:"教练督学 / 全智能督学",def:"global"},{ctx:"insp.photo",module:"解题方法",name:"拍题解析",desc:"拍题图片的方法联动解析",def:"noThink"},{ctx:"sprint.rewrite",module:"智能押题",name:"定向重写",desc:"审查后不达标题目重写",def:"think"},{ctx:"sprint.optimize",module:"智能押题",name:"卷面优化",desc:"重写后整卷质量优化",def:"think"},{ctx:"sprint.latexfix",module:"智能押题",name:"AI格式修复",desc:"逐题检查题干与选项 LaTeX 书写错误（多空格/残缺命令/乱码），只修语法不碰内容",def:"noThink"},{ctx:"exam.photo",module:"智能押题",name:"拍题收录",desc:"成品卷拍题解析收录",def:"noThink"},{ctx:"vizai",module:"可视化 AI",name:"图表生成",desc:"学习数据图表智能生成",def:"noThink"},{ctx:"vizai.photo",module:"可视化 AI",name:"图表照片解析",desc:"照片数据可视化解析",def:"noThink"},{ctx:"word.confuse",module:"单词",name:"易混词生成",desc:"选择题易混干扰项生成",def:"noThink"},{ctx:"word.example",module:"单词",name:"语境例句",desc:"考研语境例句生成",def:"noThink"}];function vi(e){e=e||{};const t=e.ctx;if(t){let r;try{r=(b.get().ai.moduleModes||{})[t]}catch{}if(r==="think")return!0;if(r==="noThink")return!1;if(r==="forceGlobal"){const s=b.get().ai;return s.thinkingMode===!0||s.thinkingMode===!1?s.thinkingMode:!1}}if(e.noThink!==void 0)return!e.noThink;if(e.think!==void 0)return!!e.think;const n=b.get().ai;return n.thinkingMode===!0||n.thinkingMode===!1?n.thinkingMode:!1}function bi(e){e=e||{};try{const t=(b.get().ai.moduleToks||{})[e.ctx];if(t>0)return t}catch{}return e.maxTokens>0?e.maxTokens:Nl()||0}function bs(e){e=e||{};const t=n=>typeof n=="number"&&n>=0&&n<=2;try{const n=(b.get().ai.moduleTemps||{})[e.ctx];if(t(n))return n}catch{}if(t(e.temperature))return e.temperature;try{const n=b.get().ai.temperature;if(t(n))return n}catch{}return null}function wi(e){if(e=e||{},e._think=vi(e),e._temp==null&&(e._temp=bs(e)),e.maxTokens==null){const t=bi(e);t>0&&(e.maxTokens=t)}return e}function ki(){try{const e=window.AiTools;return!e||typeof e.toolChat!="function"||!e.enabled||!e.enabled()||!e.isReady||!e.isReady()||e.scopeAll&&!e.scopeAll()?null:e.toolChat}catch{return null}}function xi(e){try{const t=yi.find(function(n){return n.ctx===e});return t?t.module+" · "+t.name:"AI 长程任务"}catch{return"AI 长程任务"}}function Si(e,t,n,r,s){if(s=wi(s),!(s&&(s.noTools||s.apiId))){const c=ki();if(c)return c({system:e,user:t,imageDataUrl:r,onChunk:n,label:xi(s&&s.ctx),signal:s&&s.signal})}const i=[{role:"system",content:e},r?{role:"user",content:[{type:"text",text:t},{type:"image_url",image_url:{url:r}}]}:{role:"user",content:t}];let a=null;if(s.cache!==!1){const c=s.apiId&&hn(s.apiId)||Dt();a=ps(c.model,i);const l=hs(a);if(l!=null){if(n)try{n(l,"")}catch{}return Promise.resolve(l)}}return us(function(c){return Dn(c,i,n,!1,s)},s).then(function(c){return gs(a,c),c})}function Ll(e,t,n){n=wi(n);var r=null;if(n.cache!==!1){const o=n.apiId&&hn(n.apiId)||Dt();r=ps(o.model,e);var s=hs(r);if(s!=null){if(t)try{t(s,"")}catch{}return Promise.resolve(s)}}return us(function(o){return Dn(o,e,t,!1,n)},n).then(function(o){return gs(r,o),o})}const K={configured:El,applyPreset:Ol,weeklySummary:io,chat:cr,chatJSON:Pl,chatStream:Si,chatMessagesStream:Ll,memoryDigest:os,AI_REGISTRY:yi,resolveThink:vi,resolveMaxTokens:bi,resolveTemperature:bs,listApis:fl,saveApi:pl,deleteApi:hl,moveApi:gl,switchApi:ui,activeApi:Dt,apiById:hn,cacheStats:Sl,cacheClear:_l,usageStats:Al,usageReset:Tl,useThinking(){return b.get().ai.thinkingMode===!0},extractRobustJSON:Yt,repairJsonSafely:Pt,salvageObjects:jr,get QUIZ_PROMPT(){return ci()},registerPrompt(e){e&&e.id&&!ar.some(function(t){return t.id===e.id})&&ar.push(e)},globalPrompts(){return ar.map(function(e){return{id:e.id,name:e.name,text:String(e.build()||"")}})},get DEEP_REVIEW_PROMPT(){return"你是一名2026考研深度复盘教练，服务对象专业课为「"+ss()+`」。用户提交了一份【当前学习进度全景快照】（已控制在5000字内，含四科进度、正确率趋势、错题/疑难点、弱点画像、心理状态、里程碑、学习时长等）。
请基于这份快照做一次**深度复盘**，结构清晰、可直接指导行动：
1. 总体诊断：当前状态健康度评估（给出风险等级：安全 / 警戒 / 危险）；
2. 学科短板定位：每科最致命的 1-2 个问题（务必引用快照中的具体数据说话）；
3. 根因分析：为何出现这些短板（学习习惯 / 时间分配 / 概念漏洞 / 心态）；
4. 下周作战方案：逐日可执行的任务调整（具体到科目 / 题量 / 时长）；
5. 防呆强化：针对符号、分式、易错点的强化动作；
6. 心态与节奏：基于心理状态记录给出建议。
要求：用简体中文；每个结论都要落到具体动作；避免空话套话；如快照数据不足请明确指出缺什么。`},JUDGE_PROMPT:li,SVG_DIAGRAM_SPEC:as,reviewWeekly(e){const t=io(),n=e+`

`+t+`

请给出：1)风险诊断 2)下周逐日任务调整 3)防呆强化点。`;let r=document.getElementById("rv-ai-card"),s=document.getElementById("rv-ai-out"),o=document.getElementById("rv-ai-status");if(s)r.style.display="",o&&(o.textContent="已自动附带本周学习摘要，正在等待云端教练回复…"),s&&(s.textContent="加载中…");else{const i=document.createElement("div");i.id="rv-ai-panel",i.style.cssText="position:fixed;bottom:16px;right:16px;width:380px;max-width:calc(100vw - 32px);max-height:60vh;background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);box-shadow:0 4px 20px rgba(0,0,0,.12);z-index:9000;overflow:hidden;display:flex;flex-direction:column",i.innerHTML='<div style="padding:10px 14px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center"><span style="font-weight:600;font-size:13px">🤖 AI 快速复盘</span><button id="rv-ai-panel-x" aria-label="关闭" style="background:none;border:none;font-size:18px;cursor:pointer;color:var(--text-muted);padding:0 4px;line-height:1">×</button></div><div style="padding:12px 14px;overflow-y:auto;flex:1"><div class="muted-sm" id="rv-ai-status">已自动附带本周学习摘要，正在等待云端教练回复…</div><pre class="report" id="rv-ai-out" style="margin-top:10px;min-height:60px;white-space:pre-wrap">加载中…</pre></div>',document.body.appendChild(i);const a=i.querySelector("#rv-ai-panel-x");a&&(a.onclick=function(){i.remove()}),s=document.getElementById("rv-ai-out"),o=document.getElementById("rv-ai-status"),r=i}cr(n).then(i=>{s&&(s.textContent=window.Tex&&window.Tex.repairPipeLatex?window.Tex.repairPipeLatex(i):i),o&&(o.textContent="✓ 完成");try{b.update(a=>{a.aiReview={week:b.weekKey(),output:i,generatedAt:new Date().toISOString()}})}catch{}Q.success("AI 快速复盘完成"),window.App&&window.App.refresh()}).catch(i=>{s&&(s.textContent="调用失败："+i.message+`

可改用本地摘要手动复盘：
`+t),o&&(o.textContent="⚠ 调用失败"),Q.warn("AI 快速复盘失败："+(i&&i.message||"未知错误"))})},test(){return cr("用一句话回复：系统连通正常",{cache:!1,noTools:!0}).then(e=>e.slice(0,60))},chatMessages(e,t){return mi(e,t)},testProfile(e){return vs(e,[{role:"user",content:"用一句话回复：系统连通正常"}],!1).then(t=>t.slice(0,60))},probeVision:Ml,VISION_PROBE_PNG:hi,VISION_PROBE_Q:gi};function nt(e,t){return e[t]|e[t+1]<<8}function at(e,t){return e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24>>>0}async function jl(e){const t=new DecompressionStream("deflate-raw"),n=new Blob([e]).stream().pipeThrough(t),r=await new Response(n).arrayBuffer();return new Uint8Array(r)}async function Dl(e){const t=new Uint8Array(e),n=t.length;if(n<22)throw new Error("不是有效的 zip 文件（太小）");let r=-1;const s=Math.max(0,n-22-65535);for(let u=n-22;u>=s;u--)if(at(t,u)===101010256){r=u;break}if(r<0)throw new Error("不是有效的 zip 文件（未找到目录尾）");const o=nt(t,r+10),i=at(t,r+16);if(i>n)throw new Error("zip 目录偏移越界");const a=[];let c=i;for(let u=0;u<o&&c+46<=n&&at(t,c)===33639248;u++){const f=nt(t,c+8),d=nt(t,c+10),m=at(t,c+20),p=at(t,c+24),y=nt(t,c+28),g=nt(t,c+30),v=nt(t,c+32),w=at(t,c+42);let S="";for(let O=0;O<y;O++)S+=String.fromCharCode(t[c+46+O]);if(f&2048)try{S=new TextDecoder("utf-8").decode(t.subarray(c+46,c+46+y))}catch{}else try{const M=new TextDecoder("utf-8").decode(t.subarray(c+46,c+46+y));/[\uFFFD]/.test(M)||(S=M)}catch{}a.push({name:S,method:d,compSize:m,uncompSize:p,flags:f,localOff:w}),c+=46+y+g+v}if(!a.length)throw new Error("zip 内没有文件条目");const l=[];for(let u=0;u<a.length;u++){const f=a[u];if(f.name.slice(-1)==="/"||f.name.slice(-1)==="\\")continue;const d=f.localOff;if(d+30>n||at(t,d)!==67324752)continue;const m=nt(t,d+26),p=nt(t,d+28),y=d+30+m+p;if(y+f.compSize>n)continue;const g=t.subarray(y,y+f.compSize);let v;if(f.method===0)v=g;else if(f.method===8)try{v=await jl(g)}catch{continue}else continue;l.push({name:f.name,data:v})}return l}function _i(e){if(!e||typeof e!="string")return null;const t=e.replace(/^\uFEFF/,""),n={name:"",description:"",whenToUse:"",body:t},r=t.match(/^\s*---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);if(r){const s=r[1],o=/^\s*([A-Za-z_][A-Za-z0-9_\-]*)\s*:\s*(.*)$/;s.split(/\r?\n/).forEach(function(i){const a=i.match(o);if(!a)return;const c=a[1].toLowerCase().replace(/-/g,""),l=a[2].trim().replace(/^["']|["']$/g,"");l&&(c==="name"&&!n.name?n.name=l:c==="description"&&!n.description?n.description=l:c==="whentouse"||c==="when"||c==="when_to_use"?n.whenToUse||(n.whenToUse=l):c==="summary"&&!n.description&&(n.description=l))}),n.body=t.slice(r[0].length).trim()}return n}function ql(e){const t=(e||[]).map(function(c){return{name:String(c.name||"").replace(/\\/g,"/"),data:c.data}});let n=null;if(t.forEach(function(c){if(/SKILL\.md$/i.test(c.name)){const l=(c.name.match(/\//g)||[]).length,u=n?(n.name.match(/\//g)||[]).length:1e9;l<=u&&(n=c)}}),!n)throw new Error("技能包缺少 SKILL.md");const r=_i(new TextDecoder("utf-8").decode(n.data)),s=n.name.split("/").slice(0,-1).join("/"),o=[],i=[];t.forEach(function(c){if(c.name===n.name)return;if(!(!s||c.name.indexOf(s+"/")===0)){i.push({path:c.name,size:c.data.length});return}const u=s?c.name.slice(s.length+1):c.name;/\.md$/i.test(u)&&!/^SKILL\.md$/i.test(u)&&u.indexOf("/SKILL.md")<0?o.push({path:c.name,text:new TextDecoder("utf-8").decode(c.data)}):/\.md$/i.test(u)||i.push({path:c.name,size:c.data.length})});const a=r.name||"skill-pack";return{id:a,name:a,description:r.description||"AI 技能包："+a,whenToUse:r.whenToUse||"",skillMd:r.body||"",refs:o,files:i}}const Tn={parseZip:Dl,parseSkillMd:_i,normalizeSkillPack:ql};function Tt(){return b.get().plugins||[]}function Bl(e){var t={pid:e,Store:window.Store,AI:window.AI,App:window.App,Toast:window.Toast,Modal:window.Modal,Components:window.Components,Tex:window.Tex,Charts:window.Charts,DB:window.DB,Mastery:window.Mastery,Spaced:window.Spaced,U:window.U,Theme:window.Theme,Cloud:window.Cloud,AiMemory:window.AiMemory,PluginBus:$,store:window.Store,ai:window.AI,toast:window.Toast,modal:window.Modal,uid:function(n){return x.uid?x.uid():(n||"plg")+Date.now().toString(36)},dkey:function(){return x.dkey?x.dkey():new Date().toISOString().slice(0,10)}};return Object.keys(window).forEach(function(n){/Module$/.test(n)&&typeof window[n]=="object"&&window[n]&&(t[n]=window[n])}),t.api={go:function(n){window.App&&App.go(n)},refresh:function(){window.App&&App.refresh()},current:function(){return window.App?App.current:""},openModal:function(n){window.Modal&&xe.open(n)},openPanel:function(n){$.openPanel(n)},closePanel:function(n){$.closePanel(n)},panelsOf:function(n){return $.panels().filter(function(r){return r.pid===(n||t.pid)})},confirm:function(n,r,s,o){window.Modal&&xe.confirm(n,r,o?"删除":"确定",s,o)},closeModal:function(){window.Modal&&xe.close()},toast:function(n,r,s){window.Toast&&Q.show(n,r||"info",s||2e3)},download:function(n,r,s){try{var o=new Blob([r],{type:s||"text/plain;charset=utf-8"}),i=URL.createObjectURL(o),a=document.createElement("a");a.href=i,a.download=n||"plugin-export.txt",document.body.appendChild(a),a.click(),a.remove(),setTimeout(function(){URL.revokeObjectURL(i)},2e3)}catch(c){window.Toast&&Q.show("下载失败："+(c.message||c),"warn",2500)}},readFile:function(n){return new Promise(function(r,s){var o=document.createElement("input");o.type="file",n&&(o.accept=n),o.style.display="none",document.body.appendChild(o),o.onchange=function(){var i=o.files&&o.files[0];if(o.remove(),!i){s(new Error("未选择文件"));return}var a=new FileReader;a.onload=function(){r({name:i.name,text:String(a.result||""),size:i.size})},a.onerror=function(){s(new Error("文件读取失败"))},a.readAsText(i,"utf-8")},o.click()})},goTool:function(n,r){$.goTool(n,r)},params:function(){return $.params(e)}},t.ui={card:function(n,r){return'<div class="card">'+(r?'<div class="card-title-sm">'+x.esc(r)+"</div>":"")+n+"</div>"},btn:function(n,r,s){return'<button class="btn '+(r||"btn-ghost")+'" '+(s||"")+">"+n+"</button>"},btnRow:function(n){return'<div class="btn-row">'+n+"</div>"},tag:function(n,r){return'<span class="tag '+(r||"")+'">'+x.esc(n)+"</span>"},badge:function(n,r){return'<span class="tag '+(r||"")+'" style="font-size:11px;opacity:.9">'+x.esc(n)+"</span>"},alert:function(n,r){return'<div class="alert alert-'+(r||"info")+'">'+x.esc(n)+"</div>"},stat:function(n,r){return'<div class="stat"><div class="stat-num">'+n+'</div><div class="stat-label">'+x.esc(r)+"</div></div>"},statRow:function(n){return'<div class="stat-row">'+n.join("")+"</div>"},progress:function(n,r){return'<div class="pbar"><div class="pbar-fill" style="width:'+x.clamp(Math.round(+n||0),0,100)+"%;background:"+(r||"var(--ok)")+'"></div></div>'},empty:function(n){return'<div class="card empty-hint">'+x.esc(n)+"</div>"},section:function(n,r){return'<div class="pm-ai-section"><b>'+x.esc(n)+'：</b><div class="pm-ai-body">'+r+"</div></div>"},list:function(n){return"<div>"+(n||[]).map(function(r){return'<div style="padding:5px 0;border-bottom:1px solid var(--line)">'+r+"</div>"}).join("")+"</div>"},tabs:function(n,r){return'<div class="tab-row">'+n.map(function(s){return'<button class="tab'+(s[0]===r?" tab-on":"")+'">'+x.esc(s[1])+"</button>"}).join("")+"</div>"},input:function(n,r,s){return'<input id="'+x.esc(n)+'" class="input" placeholder="'+x.esc(r||"")+'" value="'+x.esc(s??"")+'">'},textarea:function(n,r,s){return'<textarea id="'+x.esc(n)+'" class="input" rows="'+(s||3)+'" placeholder="'+x.esc(r||"")+'"></textarea>'},select:function(n,r,s){return'<select id="'+x.esc(n)+'" class="input">'+(r||[]).map(function(o){return'<option value="'+x.esc(o)+'"'+(String(o)===String(s)?" selected":"")+">"+x.esc(o)+"</option>"}).join("")+"</select>"}},t.ai={has:function(){return!!(window.AI&&K.configured())},chat:function(n,r,s){return window.AI&&K.configured()?K.chatStream(n,r,null,null,Object.assign({noThink:!0},s||{})):Promise.reject(new Error("未配置 AI"))},json:function(n,r,s){return window.AI&&K.configured()?K.chatJSON(n,r,null,s||{}):Promise.reject(new Error("未配置 AI"))},stream:function(n,r,s,o){return window.AI&&K.configured()?K.chatStream(n,r,s,null,o||{}):Promise.reject(new Error("未配置 AI"))}},t.data=function(n,r){return $.data(e,n,r)},t.config=function(n,r){return $.config(e,n,r)},t.log=function(n,r){$.log(e,n,r)},t.call=function(n,r){var s=Array.prototype.slice.call(arguments,2);return $.call.apply($,[n,r].concat(s))},t}function ur(e){if(!e||typeof e!="object")throw new Error("插件必须注册一个对象");var t=String(e.id||"").trim();if(!t||!/^[a-z0-9][a-z0-9\-_]{1,31}$/i.test(t))throw new Error("插件 id 必填且只能含字母数字-_（如 my-plugin）");var n={id:t,name:String(e.name||t).trim().slice(0,30),version:String(e.version||"1.0").slice(0,12),desc:String(e.desc||"").slice(0,300),author:String(e.author||"").slice(0,40),skills:Array.isArray(e.skills)?e.skills.slice(0,20):[],actions:Array.isArray(e.actions)?e.actions.slice(0,20):[],tools:Array.isArray(e.tools)?e.tools.slice(0,10):[],panels:Array.isArray(e.panels)?e.panels.slice(0,6):[],hooks:e.hooks&&typeof e.hooks=="object"?e.hooks:{},queries:Array.isArray(e.queries)?e.queries.slice(0,20):[],maintabs:Array.isArray(e.maintabs)?e.maintabs.slice(0,3):[],css:String(e.css||"").slice(0,2e4),enhancers:Array.isArray(e.enhancers)?e.enhancers.slice(0,12):[],timers:Array.isArray(e.timers)?e.timers.slice(0,10):[],shortcuts:Array.isArray(e.shortcuts)?e.shortcuts.slice(0,10):[],config:Array.isArray(e.config)?e.config.slice(0,12):[],depends:Array.isArray(e.depends)?e.depends.slice(0,8):[],services:e.services&&typeof e.services=="object"?e.services:{},memory:String(e.memory||"").slice(0,200),init:typeof e.init=="function"?e.init:null,onEnable:typeof e.onEnable=="function"?e.onEnable:null,onDisable:typeof e.onDisable=="function"?e.onDisable:null,enabled:!0,createdAt:x.dkey?x.dkey():new Date().toISOString().slice(0,10)};return n.tools.forEach(function(r,s){if(r&&typeof r=="object"&&!r.id&&(r.id=n.id+"-tool"+(s+1)),r&&typeof r.render!="function"&&typeof r.mount!="function")throw new Error("工具 "+(r&&r.title||"?")+" 必须有 render 或 mount 函数")}),n.panels.forEach(function(r,s){if(!r||!r.id||!r.title)throw new Error("面板 #"+(s+1)+" 缺 id/title");if(typeof r.render!="function")throw new Error("面板 "+r.title+" 必须有 render(ctx, box) 函数");if(!/^[a-z0-9][a-z0-9\-_]{1,31}$/i.test(String(r.id)))throw new Error("面板 id 只能含字母数字-_")}),n.config.forEach(function(r,s){if(!r||!r.key||!r.label)throw new Error("配置项 #"+(s+1)+" 缺 key/label");["text","number","select","bool"].indexOf(r.type)<0&&(r.type="text")}),n.shortcuts.forEach(function(r){if(r&&r.key&&typeof r.run!="function")throw new Error("快捷键 "+r.key+" 缺 run 函数")}),n.queries.forEach(function(r,s){if(!r||!r.key||!r.label)throw new Error("查询 #"+(s+1)+" 缺 key/label");if(typeof r.run!="function")throw new Error("查询 "+r.label+" 缺 run 函数")}),n.maintabs.forEach(function(r,s){if(!r||!r.id||!r.name)throw new Error("主 tab #"+(s+1)+" 缺 id/name");if(typeof r.render!="function")throw new Error("主 tab "+r.name+" 缺 render 函数");if(!/^[a-z0-9][a-z0-9\-_]{1,31}$/i.test(String(r.id)))throw new Error("主 tab id 只能含字母数字-_")}),n}var we={};function Jt(e){var t=we[e];if(!t)return null;var n=Tt().find(function(r){return r.id===e});return n&&n.enabled===!1?null:t.manifest}function Se(e){return we[e]?(we[e].ctx||(we[e].ctx=Bl(e)),we[e].ctx):null}var qn={};function co(e){Dr(e.id),(e.timers||[]).forEach(function(t){if(!(!t||!t.run)){var n=function(){try{t.run(Se(e.id),t)}catch(a){Le(e.id,"定时器错误："+(a.message||a))}};if(t.at&&/^\d{1,2}:\d{2}$/.test(t.at)){var r=function(){var a=new Date,c=t.at.split(":"),l=new Date(a);l.setHours(+c[0],+c[1],0,0),l<=a&&l.setDate(l.getDate()+1);var u=setTimeout(function(){try{n()}catch{}r()},l-a);dr(e.id,u)};r()}else if(t.every&&/^\d+min$/.test(t.every)){var s=parseInt(t.every,10)*6e4,o=setInterval(n,s);dr(e.id,o)}else if(t.once&&/^\d+min$/.test(t.once)){var i=parseInt(t.once,10)*6e4,o=setTimeout(n,i);dr(e.id,o)}}})}function dr(e,t){(qn[e]=qn[e]||[]).push(t)}function Dr(e){(qn[e]||[]).forEach(function(t){try{clearTimeout(t),clearInterval(t)}catch{}}),delete qn[e]}function Le(e,t,n){try{b.update(function(r){r.pluginLog=r.pluginLog||[],r.pluginLog.unshift({at:new Date().toISOString(),pid:e,level:n||"info",msg:String(t||"").slice(0,300)}),r.pluginLog.length>200&&(r.pluginLog=r.pluginLog.slice(0,200))})}catch{}}const $={_ver:"2.0.0",register:function(e){var t=ur(e);if(we[t.id]){try{$.unsubscribeAll(t.id)}catch{}try{$.closePanelsOf(t.id)}catch{}}we[t.id]={manifest:t};try{co(t),t.init&&t.init(Se(t.id)),t.css&&$._injectCss(t.id,t.css)}catch(n){Le(t.id,"初始化错误："+(n.message||n),"error")}return t},_cssTags:{},_injectCss:function(e,t){if(!(typeof document>"u"||!t)){$._removeCss(e);var n=document.createElement("style");n.id="plg-css-"+e,n.textContent=t,document.head.appendChild(n),$._cssTags[e]=n}},_removeCss:function(e){var t=$._cssTags[e]||document.getElementById("plg-css-"+e);t&&t.parentNode&&t.parentNode.removeChild(t),delete $._cssTags[e]},_enh:{},_onPageRendered:function(e,t){if(e){var n=this;this.list().forEach(function(r){(r.enhancers||[]).forEach(function(s,o){!s||!s.html&&typeof s.mount!="function"||s.tab&&s.tab!=="all"&&s.tab!==t||n._applyEnhancer(r,s,o,e,t)})})}},_applyEnhancer:function(e,t,n,r,s){var o=e.id+":"+n,i=this,a;if(t.selector?a=r.querySelector(t.selector):a=r.querySelector(t.slot==="top"?'div[data-pg-slot="top"]':'div[data-pg-slot="bottom"]'),!!a){var c=document.createElement("div");c.className="plg-enh",c.setAttribute("data-plg-enh",o);var l=null;try{if(typeof t.mount=="function")l=t.mount(Se(e.id),c)||null;else{var u=typeof t.html=="function"?t.html(Se(e.id),r)||"":String(t.html);u&&(c.innerHTML=u)}}catch(f){Le(e.id,"页面装饰错误："+(f.message||f),"error")}a.appendChild(c),i._enh[o]={destroy:l,container:c,subscribe:t.subscribe,tab:s,pid:e.id}}},_clearEnh:function(e){var t=this._enh[e];if(t){try{typeof t.destroy=="function"&&t.destroy()}catch{}try{t.container&&t.container.parentNode&&t.container.parentNode.removeChild(t.container)}catch{}delete this._enh[e]}},_clearAllEnh:function(){var e=this;Object.keys(this._enh).forEach(function(t){e._clearEnh(t)})},_reapplyReactive:function(){var e=this,t=document.getElementById("view");if(!(!t||!window.App)){var n=App.current;Object.keys(e._enh).forEach(function(r){var s=e._enh[r];if(!(!s||!s.subscribe||!s.subscribe.length)&&!(s.tab!==n&&s.tab!=="all")){var o=r.split(":"),i=Jt(o[0]),a=+o[1];if(!i||!i.enhancers||!i.enhancers[a]){e._clearEnh(r);return}e._clearEnh(r),e._applyEnhancer(i,i.enhancers[a],a,t,n)}})}},list:function(){var e=[];return Object.keys(we).forEach(function(t){var n=Jt(t);n&&e.push(n)}),e},get:function(e){var t=Jt(e);return t||null},ctxOf:Se,data:function(e,t,n){if(!(!e||!t))return arguments.length===2?(b.get().pluginData||{})[e]?b.get().pluginData[e][t]:void 0:(b.update(function(r){r.pluginData=r.pluginData||{},r.pluginData[e]||(r.pluginData[e]={}),n===null?delete r.pluginData[e][t]:r.pluginData[e][t]=n}),n)},config:function(e,t,n){if(!(!e||!t)){var r=(b.get().pluginConfig||{})[e]||{};return arguments.length===2?t in r?r[t]:void 0:(b.update(function(s){s.pluginConfig=s.pluginConfig||{},s.pluginConfig[e]||(s.pluginConfig[e]={}),s.pluginConfig[e][t]=n}),n)}},configWithDefault:function(e,t){var n=$.config(e.id,t);if(n!==void 0)return n;var r=(e.config||[]).find(function(s){return s.key===t});return r?r.default:void 0},log:Le,skills:function(){var e=[];return this.list().forEach(function(t){(t.skills||[]).forEach(function(n){n&&n.trigger&&n.prompt&&e.push({pid:t.id,trigger:n.trigger,title:n.title||n.trigger,prompt:n.prompt,summary:n.summary||"",when:n.when||"",refs:n.refs||[]})})}),e},actions:function(){var e=[];return this.list().forEach(function(t){(t.actions||[]).forEach(function(n){n&&n.type&&e.push({pid:t.id,type:n.type,label:n.label||n.type,auto:!!n.auto,run:n.run,needs:n.needs,undo:n.undo})})}),e},tools:function(){var e=[];return this.list().forEach(function(t){(t.tools||[]).forEach(function(n){n&&n.id&&e.push({pid:t.id,id:n.id,title:n.title||n.id,icon:n.icon||"🧩",render:n.render,mount:n.mount})})}),e},queries:function(){var e=[];return this.list().forEach(function(t){(t.queries||[]).forEach(function(n){n&&n.key&&e.push({pid:t.id,key:n.key,label:n.label||n.key,run:n.run})})}),e},maintabs:function(){var e=[];return this.list().forEach(function(t){(t.maintabs||[]).forEach(function(n){n&&n.id&&e.push({pid:t.id,id:n.id,name:n.name||n.id,icon:n.icon||"🧩",render:n.render})})}),e},panels:function(){var e=[];return this.list().forEach(function(t){(t.panels||[]).forEach(function(n){n&&n.id&&e.push({pid:t.id,id:n.id,title:n.title||n.id,icon:n.icon||"🪟",render:n.render,width:n.width||300,height:n.height||360})})}),e},openPanel:function(e){var t=document.getElementById("plg-panel-"+e);if(t){$.closePanel(e);return}var n=this.panels().filter(function(d){return d.id===e})[0];if(!n){Q.show("面板不存在或已禁用","warn",1800);return}var r=document.createElement("div");r.id="plg-panel-"+e,r.className="plg-panel",r.style.width=(n.width||300)+"px",r.style.height=(n.height||360)+"px",r.innerHTML='<div class="plg-panel-h"><span class="plg-panel-t">'+(n.icon||"🪟")+" "+x.esc(n.title)+'</span><button class="plg-panel-btn" data-pb="fold" title="折叠">—</button><button class="plg-panel-btn" data-pb="close" title="关闭">×</button></div><div class="plg-panel-b"></div>',document.body.appendChild(r);var s=r.querySelector(".plg-panel-b");try{var o=n.render(Se(n.pid),s);typeof o=="string"&&s.innerHTML===""&&(s.innerHTML=o)}catch(d){s.innerHTML='<div class="alert alert-danger">面板渲染失败：'+x.esc(d.message||d)+"</div>"}var i=r.querySelector('[data-pb="fold"]');i&&(i.onclick=function(){var d=r.querySelector(".plg-panel-b"),m=r.classList.toggle("plg-panel-folded");d&&(d.style.display=m?"none":""),i.textContent=m?"▢":"—"});var a=r.querySelector('[data-pb="close"]');a&&(a.onclick=function(){$.closePanel(e)});var c=r.querySelector(".plg-panel-h"),l=null,u=function(d){l&&(r.style.left=Math.max(0,d.clientX-l.dx)+"px",r.style.top=Math.max(0,d.clientY-l.dy)+"px",r.style.right="auto",r.style.bottom="auto")},f=function(){l=null,document.removeEventListener("mousemove",u),document.removeEventListener("mouseup",f)};c&&(c.onmousedown=function(d){d.target&&d.target.tagName==="BUTTON"||(l={dx:d.clientX-r.offsetLeft,dy:d.clientY-r.offsetTop},d.preventDefault(),document.addEventListener("mousemove",u),document.addEventListener("mouseup",f))}),Le(n.pid,"面板「"+n.title+"」已打开")},closePanel:function(e){var t=document.getElementById("plg-panel-"+e);t&&t.parentNode&&t.parentNode.removeChild(t)},closeAllPanels:function(){var e=this;this.panels().forEach(function(t){e.closePanel(t.id)})},openPanelsOf:function(e){var t=this;this.panels().filter(function(n){return n.pid===e}).forEach(function(n){t.openPanel(n.id)})},closePanelsOf:function(e){var t=this;this.panels().filter(function(n){return n.pid===e}).forEach(function(n){t.closePanel(n.id)})},_params:{},goTool:function(e,t){var n=this.tools().filter(function(r){return r.id===e})[0];if(!n){Q.show("工具 "+e+" 不存在或已禁用","warn",2e3);return}this._params[n.pid]=t||{},window.App&&App.go(e)},params:function(e){return $._params[e]||{}},clearParams:function(e){delete $._params[e]},emit:function(e,t){var n=0;return this.list().forEach(function(r){var s=(r.hooks||{})[e]||(r.hooks||{})["*"];if(typeof s=="function")try{s(Se(r.id),t||{}),n++}catch(o){Le(r.id,"钩子「"+e+"」错误："+(o.message||o),"error")}}),n},fire:function(e,t){return $.emit(e,t)},_subs:{},subscribe:function(e,t){return typeof t!="function"?function(){}:(($._subs[e]=$._subs[e]||[]).push(t),function(){$.unsubscribe(e,t)})},unsubscribe:function(e,t){var n=$._subs[e];if(n){var r=n.indexOf(t);r>=0&&n.splice(r,1),n.length||delete $._subs[e]}},unsubscribeAll:function(e){delete $._subs[e]},_onStoreUpdate:function(e){var t=this;Object.keys(t._subs).forEach(function(n){t._subs[n].forEach(function(r){try{r(Se(n),e||{})}catch(s){Le(n,"订阅回调错误："+(s.message||s),"error")}})}),clearTimeout(t._enhDebounce),t._enhDebounce=setTimeout(function(){try{t._reapplyReactive()}catch{}},300)},call:function(e,t){var n=Array.prototype.slice.call(arguments,2),r=Jt(e);if(!r)throw new Error("插件「"+e+"」未启用或不存在");var s=r.services&&r.services[t];if(typeof s!="function")throw new Error("插件「"+e+"」未提供服务 "+t);return s.apply(null,[Se(e)].concat(n))},callService:function(e,t){var n=Array.prototype.slice.call(arguments,2);return $.call.apply($,[e,t].concat(n))},memories:function(){var e=[];return this.list().forEach(function(t){t.memory&&e.push({pid:t.id,text:t.memory})}),e},runSkill:function(e,t,n){if(!e)return Promise.reject(new Error("技能不存在"));if(!(window.AI&&K.configured()))return Promise.reject(new Error("未配置 AI"));var r="🧠 "+(e.title||e.trigger),s=String(e.prompt||"").replace(/\{input\}/g,String(t||"")),o='<div class="pm-ai-body" id="pbskill-out"><div class="skl-line"></div><div class="skl-line"></div><div class="skl-line skl-w70"></div></div><div id="pbskill-actions"></div>',i=!1;xe.open({title:r,wide:!0,html:o,actions:[{label:"关闭"}]});var a=function(c){var l=document.getElementById("pbskill-out"),u=window.Tex&&Qe.repairPipeLatex?Qe.repairPipeLatex(c||""):c||"";l&&(l.innerHTML=x.esc(u).replace(/\n/g,"<br>")+'<span class="ai-cursor"></span>')};return K.chatStream("你是考研AI助手。按技能要求执行。",(t?"【技能输入】"+t+`

`:"")+s,function(c){i||a(c)},null,{noThink:!0,timeout:12e4}).then(function(c){i=!0;var l=document.getElementById("pbskill-out");if(l)try{l.innerHTML=Qe.renderInline(c||"").replace(/\n/g,"<br>")}catch{l.textContent=c||""}var u=document.getElementById("pbskill-actions");if(u&&n&&n.postActions&&n.postActions.length){var f=n.postActions.map(function(d,m){return'<button class="btn btn-sm '+(m===0?"btn-primary":"btn-ghost")+' pbskill-post" data-kind="'+(d.kind||"action")+'" data-target="'+x.esc(d.target||"")+'" data-label="'+x.esc(d.label||"执行")+'" data-arg="'+x.esc(d.arg||"")+'">'+x.esc(d.label||"执行")+"</button>"}).join("");u.innerHTML='<div class="btn-row" style="justify-content:center;margin-top:10px">'+f+"</div>",u.querySelectorAll(".pbskill-post").forEach(function(d){d.onclick=function(){var m=d.getAttribute("data-kind"),p=d.getAttribute("data-target"),y=d.getAttribute("data-label");if(m==="goto"&&p)xe.close(),App.go(p),Q.show(y+"…","info",1200);else if(m==="action"&&p&&window.PluginBus)try{var g={type:p,label:y};if(d.getAttribute("data-arg"))try{g=JSON.parse(d.getAttribute("data-arg"))}catch{}var v=$.actions().filter(function(S){return S.type===p})[0];if(v&&typeof v.run=="function"){var w=v.run(Se(v.pid)||{},g)||"";w&&Q.show(w,"success",2500),xe.close()}else Q.warn("未找到动作："+p)}catch{Q.warn("动作执行失败")}}})}return Le(e.pid,"技能「"+e.trigger+"」执行完成"+(t?"（输入："+String(t).slice(0,20)+"）":"")),c}).catch(function(c){i=!0;var l=document.getElementById("pbskill-out");throw l&&(l.innerHTML='<div class="alert alert-danger">技能执行失败：'+x.esc(c.message||c)+"</div>"),c})},commands:function(){var e=[];return this.skills().forEach(function(t){e.push({cmd:"/"+t.trigger,pid:t.pid,kind:"skill",skill:t,title:t.title||t.trigger})}),e},importText:function(e,t){if(!e||typeof e!="string"||!e.trim())throw new Error("空内容");if(e.indexOf("PluginBus.register")<0)throw new Error("这不是插件源码：未找到 PluginBus.register({...}) 调用");var n=null,r=window.PluginBus;window.PluginBus={register:function(a){return n=a,$.register(a)}};var s=null;try{var o=new Function("PluginBus","window",`"use strict";
`+e+`
;return true;`);o(window.PluginBus,window)}catch(a){s=a}if(window.PluginBus=r,s)throw new Error("插件执行失败："+(s.message||String(s)));if(!n)throw new Error("插件未调用 PluginBus.register");var i=ur(n);return(i.depends||[]).forEach(function(a){var c=Tt().some(function(l){return l.id===a});if(!c)throw new Error("依赖插件「"+a+"」未安装。请先安装它再导入本插件。")}),b.update(function(a){a.plugins=a.plugins||[];var c=a.plugins.findIndex(function(u){return u.id===i.id}),l={id:i.id,name:i.name,version:i.version,desc:i.desc,author:i.author,source:e,enabled:!0,createdAt:i.createdAt,config:i.config,shortcuts:i.shortcuts,depends:i.depends,memory:i.memory};c>=0?a.plugins[c]=l:a.plugins.push(l)}),t||Q.show("插件「"+i.name+"」已导入","success",2500),i},exportText:function(e){var t=Tt().find(function(n){return n.id===e});return t?`/*
 * `+t.name+" v"+t.version+(t.author?" by "+t.author:"")+`
 * `+(t.desc||"")+`
 */
`+(t.source||""):null},importSkillPack:function(e,t){if(!e||!e.skillMd)throw new Error("技能包缺少指令内容");var n=String(e.id||e.name||"skill-pack").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g,"-").replace(/^-+|-+$/g,""),r=n.replace(/[\u4e00-\u9fa5]+/g,function(l){for(var u=0,f=0;f<l.length;f++)u=u*31+l.charCodeAt(f)>>>0;return"s"+u.toString(36).slice(0,4)}),s=r.replace(/[^a-z0-9\-_]/g,"-").replace(/^-+|-+$/g,"").slice(0,32)||"skill-"+Date.now().toString(36);/^[a-z0-9][a-z0-9\-_]{1,31}$/i.test(s)||(s="skill-"+Date.now().toString(36));var o=e.refs.length?`

【参考文档（遇到相关问题时查阅）】
`+e.refs.map(function(l,u){return"["+(u+1)+"] "+l.path+"："+l.text.slice(0,300)+(l.text.length>300?"…":"")}).join(`
`):"",i=e.whenToUse?`
适用时机：`+e.whenToUse:"",a={id:s,name:e.name||s,version:e.version||"1.0",desc:e.description||"AI 技能包",author:e.author||"skill-pack",skills:[{trigger:e.name||s,title:e.name||s,summary:e.description||e.name||s,when:e.whenToUse||"",refs:e.refs||[],prompt:e.skillMd+i+o}]};b.update(function(l){l.plugins=l.plugins||[];var u=l.plugins.findIndex(function(d){return d.id===s}),f={id:s,name:e.name||s,version:e.version||"1.0",desc:e.description||"AI 技能包",author:"skill-pack",source:"/* skill-pack: "+(e.name||s)+` */
PluginBus.register(`+JSON.stringify(a)+");",enabled:!0,createdAt:x.dkey?x.dkey():new Date().toISOString().slice(0,10),isSkillPack:!0,skillMeta:{whenToUse:e.whenToUse,refCount:(e.refs||[]).length}};u>=0?l.plugins[u]=f:l.plugins.push(f)});var c=ur(a);return we[s]={manifest:c},t||Q.show("技能包「"+(e.name||s)+"」已导入（"+(e.refs.length?e.refs.length+" 份参考":"无参考")+"）","success",3e3),c},importZip:function(e,t){if(!window.ZipKit)throw new Error("技能包解析器未加载");return Tn.parseZip(e).then(function(n){var r=Tn.normalizeSkillPack(n);return $.importSkillPack(r,t)})},importSkillMdText:function(e,t){if(!window.ZipKit)throw new Error("技能包解析器未加载");var n=Tn.parseSkillMd(e);if(!n)throw new Error("无法解析 SKILL.md");var r=n.name||"skill-pack",s={id:r,name:r,description:n.description,whenToUse:n.whenToUse,skillMd:n.body,refs:[],files:[]};return $.importSkillPack(s,t)},exportShareCode:function(e){var t=Tt().find(function(o){return o.id===e});if(!t||!t.source)return null;try{var n=new TextEncoder().encode(t.source),r="";n.forEach(function(o){r+=String.fromCharCode(o)});var s=btoa(r).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");return"PBCODE1:"+s}catch{return null}},importShareCode:function(e,t){if(!e||typeof e!="string")throw new Error("无效分享码");var n=e.match(/^PBCODE1:([A-Za-z0-9\-_]+)$/);if(!n)throw new Error("不是有效的插件分享码（应以 PBCODE1: 开头）");try{for(var r=n[1].replace(/-/g,"+").replace(/_/g,"/");r.length%4;)r+="=";for(var s=atob(r),o=new Uint8Array(s.length),i=0;i<s.length;i++)o[i]=s.charCodeAt(i);var a=new TextDecoder("utf-8").decode(o);return $.importText(a,t)}catch(c){throw new Error("分享码解析失败："+(c.message||c))}},enable:function(e,t){b.update(function(r){var s=(r.plugins||[]).find(function(o){return o.id===e});s&&(s.enabled=!!t)});var n=we[e];if(n)if(t)try{co(n.manifest),n.manifest.css&&$._injectCss(e,n.manifest.css),n.manifest.onEnable&&n.manifest.onEnable(Se(e)),n.manifest.init&&n.manifest.init(Se(e))}catch(r){Le(e,"启用错误："+(r.message||r),"error")}else{Dr(e),$.unsubscribeAll(e),$._removeCss(e),$._clearEnhOf(e);try{n.manifest.onDisable&&n.manifest.onDisable(Se(e))}catch(r){Le(e,"禁用错误："+(r.message||r),"error")}}},_clearEnhOf:function(e){var t=this;Object.keys(this._enh).forEach(function(n){t._enh[n]&&t._enh[n].pid===e&&t._clearEnh(n)})},remove:function(e){b.update(function(t){t.plugins=(t.plugins||[]).filter(function(n){return n.id!==e})}),Dr(e),$.unsubscribeAll(e),$._removeCss(e),$._clearEnhOf(e);try{we[e]&&we[e].manifest.onDisable&&we[e].manifest.onDisable(Se(e))}catch{}$.closePanelsOf(e),delete we[e]},byStore:Tt,handleKey:function(e){var t=e.target&&e.target.tagName||"",n=t==="INPUT"||t==="TEXTAREA"||t==="SELECT"||e.target&&e.target.isContentEditable;Object.keys(we).forEach(function(r){var s=we[r].manifest;Jt(r)&&(s.shortcuts||[]).forEach(function(o){if(!(!o||!o.key||typeof o.run!="function")){var i=o.key.toLowerCase().split("+"),a=i.indexOf("ctrl")>=0,c=i.indexOf("alt")>=0,l=i.indexOf("shift")>=0,u=i.indexOf("meta")>=0,f=i[i.length-1],d=!!e.ctrlKey===a&&!!e.altKey===c&&!!e.shiftKey===l&&!!e.metaKey===u&&String(e.key||"").toLowerCase()===f;if(d&&!(!a&&!c&&!u&&n)){e.preventDefault();try{o.run(Se(r),e)}catch(m){Le(r,"快捷键错误："+(m.message||m),"error")}}}})})},bootstrap:function(){Tt().forEach(function(e){if(!(!e.enabled||!e.source))try{var t=new Function("PluginBus","window",`"use strict";
`+e.source);t($,window)}catch(n){Le(e.id,"启动重放失败："+(n.message||n),"error")}})}};window.PluginBus=$;typeof document<"u"&&document.addEventListener&&(document.addEventListener("keydown",function(e){try{$.handleKey(e)}catch{}},!0),document.addEventListener("store:change",function(e){try{$._onStoreUpdate(e&&e.detail)}catch{}}));window.Store&&window.U&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",function(){try{$.bootstrap()}catch{}}):setTimeout(function(){try{$.bootstrap()}catch{}},0));const Ai="kaoyan2026_layout",Ti=900;function Rl(){try{const e=localStorage.getItem(Ai);return e==="phone"||e==="workbench"?e:"auto"}catch{return"auto"}}const fn=se(Rl());function Jl(){try{return window.innerWidth>=Ti}catch{return!1}}function ht(){return fn.value==="workbench"?"workbench":fn.value==="phone"?"phone":Jl()?"workbench":"phone"}function ws(e,t){try{const n=document.documentElement;t&&(n.classList.add("layout-anim"),setTimeout(()=>n.classList.remove("layout-anim"),400)),e==="workbench"?n.setAttribute("data-layout","workbench"):n.removeAttribute("data-layout")}catch{}}ws(ht(),!1);let Bn=ht();try{const e=window.matchMedia("(min-width: "+Ti+"px)"),t=()=>{if(fn.value!=="auto")return;const n=ht();n!==Bn&&(Bn=n,ws(n,!0))};e.addEventListener?e.addEventListener("change",t):e.addListener&&e.addListener(t)}catch{}function Ei(){const e=D(()=>fn.value),t=D(()=>ht()),n=D(()=>ht()==="workbench");function r(o){fn.value=o;try{localStorage.setItem(Ai,o)}catch{}Bn=ht(),ws(Bn,!0)}function s(){r(ht()==="workbench"?"phone":"workbench")}return{pref:e,effective:t,isWorkbench:n,set:r,toggle:s}}let lt=null;function lo(e){lt=e}function Hl(){const e={go(r){const s=window.FocusModule;if(s&&s.active){Q.show("深度专注进行中，请先点「中断专注」结束再切换","warn",3500);return}Ce.push(Ye(r))},refresh(){lt&&lt()},get current(){const r=Ce.currentRoute.value;return String(r.params.id||r.name||"dashboard")}};window.App=e;const t=ts();window.Theme={get:()=>t.isNight.value?"night":"day",isNight:()=>t.isNight.value,set:r=>{t.set(r),lt&&lt()},toggle:()=>{t.toggle(),lt&&lt()}};const n=Ei();window.Layout={get:()=>n.pref.value,effective:()=>n.effective.value,isWorkbench:()=>n.isWorkbench.value,set:r=>{n.set(r)},toggle:()=>{n.toggle()}}}const Gl={hidden:""},uo=de({__name:"LegacyPage",setup(e){const t=Ur(),n=Ao(),r={dashboard:"DashboardModule",scheduler:"SchedulerModule",review:"ReviewModule",photomistake:"PhotoMistakeModule",quiz:"QuizModule",essay:"EssayModule",mistakes:"MistakesModule",heatmap:"HeatmapModule",inspector:"InspectorModule",focus:"FocusModule",concept:"ConceptMapModule",sprint:"SprintModule",decision:"DecisionModule",mental:"MentalModule",reading:"ReadingModule",wordbook:"WordbookModule",polrecite:"PolReciteModule",redline:"RedlineModule",progress:"ProgressModule",plugins:"PluginCenterModule",share:"SharePlazaModule",vizai:"VizAiModule",settings:"SettingsModule"};function s(){return String(t.params.id||t.name||"dashboard")}function o(){return document.getElementById("view")}function i(){const m=o();return{v:m?m.scrollTop:0,w:window.scrollY||window.pageYOffset||0}}function a(m){const p=o();m?(p&&(p.scrollTop=m.v),window.scrollTo(0,m.w)):(p&&(p.scrollTop=0),window.scrollTo(0,0))}const c={};Ba(()=>{c[s()]=i()});function l(m){const p=new Map;return m.querySelectorAll("details[open]").forEach(y=>{const g=y.querySelector("summary");if(!g)return;const v=g.textContent.trim();p.set(v,(p.get(v)||0)+1)}),p}function u(m,p){m.size&&p.querySelectorAll("details").forEach(y=>{const g=y.querySelector("summary");if(!g)return;const v=g.textContent.trim(),w=m.get(v);w&&w>0&&(y.open=!0,w===1?m.delete(v):m.set(v,w-1))})}function f(m){const p=o();if(!p)return;const y=s(),g=!!(m&&m.preserveUi),v=g?l(p):null,w=g?i():void 0,S=r[y],O=(S?window[S]:null)||d(y);if(!O||typeof O.render!="function"){n.replace("/dashboard");return}p.innerHTML="",O.render(p),p.querySelector('div[data-pg-slot="top"]')||p.insertAdjacentHTML("afterbegin",'<div data-pg-slot="top" class="pg-slot"></div>'),p.querySelector('div[data-pg-slot="bottom"]')||p.insertAdjacentHTML("beforeend",'<div data-pg-slot="bottom" class="pg-slot"></div>');try{$._onPageRendered(p,y)}catch{}g&&v&&u(v,p),p.querySelectorAll(".pbar-fill").forEach(M=>{requestAnimationFrame(()=>{M.style.width=M.getAttribute("data-w")+"%"})}),g&&w&&a(w)}$r(()=>t.fullPath,async()=>{await To();const m=s();f(),a(c[m])}),jt(()=>{lo(()=>f({preserveUi:!0})),f()}),Ra(()=>lo(null));function d(m){try{const p=$.tools();for(const g of p)if(g.id===m)return{render(v){const w=$.ctxOf?$.ctxOf(g.pid):{};if(v.innerHTML='<div class="card"><div class="card-title-row"><span class="card-title">'+(g.icon||"🧩")+" "+window.U.esc(g.title)+`</span><button class="btn btn-ghost btn-sm" onclick="App.go('__tools')">← 工具</button></div><div class="muted-sm" style="margin-bottom:8px">插件：`+window.U.esc(g.pid)+'</div></div><div class="plugin-tool-body">'+(typeof g.render=="function"&&g.render(w)||"")+"</div>",typeof g.mount=="function"){const S=v.querySelector(".plugin-tool-body");if(S)try{g.mount(S,w)}catch(O){S.innerHTML='<div class="alert alert-danger">插件渲染失败：'+window.U.esc(O.message||O)+"</div>"}}}};const y=$.maintabs();for(const g of y)if(g.id===m)return{render(v){const w=$.ctxOf?$.ctxOf(g.pid):{};try{g.render(w,v)}catch(S){v.innerHTML='<div class="alert alert-danger">插件主 tab 渲染失败：'+window.U.esc(S.message||S)+"</div>"}}}}catch{}return null}return(m,p)=>(_(),A("div",Gl))}}),fo="0.26.4",zl=[`https://cdn.jsdelivr.net/pyodide/v${fo}/full/`,`https://registry.npmmirror.com/-/binary/pyodide/v${fo}/full/`],Z=wt({status:"idle",log:[],lastError:"",progress:{pct:0,msg:""}});function po(e){Z.log.push(e),Z.log.length>200&&Z.log.shift()}const $l=`
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
`;let me=null,Et=null,Rn=null;const Zt=new Map;let Ul=0;const ho="kaoyan2026_at_mpl";function Oi(e){if(e.type==="log"){po(e.text),Rn&&Rn(e.text);return}if(e.type==="progress"){Z.progress.pct=Math.max(0,Math.min(100,Math.round(e.pct))),Z.progress.msg=e.msg||"";return}if(e.type==="ready"){Z.status="ready",po("✅ 基础组件就绪（numpy + sympy，Worker 沙箱）");try{localStorage.getItem(ho)==="1"&&me?.postMessage({type:"preload-mpl"})}catch{}return}if(e.type==="mpl-on"){try{localStorage.setItem(ho,"1")}catch{}return}if(e.type==="load-error"){Z.status="error",Z.lastError=e.error;return}if(e.type==="stdout"||e.type==="stderr"){const t=Zt.get(e.id);t&&(t.stdout+=e.text+`
`);return}if(e.type==="exec-done"){const t=Zt.get(e.id);if(!t)return;clearTimeout(t.timer),Zt.delete(e.id),t.resolve({ok:!!e.ok,output:String(e.output||"").slice(0,1500),error:String(e.error||""),timedOut:!1,image:e.image||""})}}function Fl(){const e=new Blob([$l],{type:"application/javascript"}),t=new Worker(URL.createObjectURL(e));return t.onmessage=n=>Oi(n.data),t.onerror=n=>{Z.status="error",Z.lastError="Worker 错误："+(n.message||"unknown")},t}function Ii(e){return e&&(Rn=e),me&&Z.status==="ready"?Promise.resolve(me):Et||(Z.status="loading",Et=new Promise((t,n)=>{const r=Fl();me=r;const s=i=>{i.type==="ready"?t(r):i.type==="load-error"&&(me=null,Et=null,n(new Error(i.error)))},o=r.onmessage;r.onmessage=function(i){const a=i.data||{};(a.type==="ready"||a.type==="load-error")&&(r.onmessage=o,s(a)),Oi(a)},r.postMessage({type:"load",cdns:zl})}),Et)}function Kl(){try{me&&me.terminate()}catch{}me=null,Et=null,Z.status="idle"}function Kn(e){return Ii(e).then(()=>{})}function gn(){return Z.status==="ready"}const fr={runtime:!1,numpy:!1,sympy:!1,mpl:!1,font:!1,scipy:!1};function Mi(){return new Promise(e=>{if(!me||Z.status!=="ready"){e(Object.assign({},fr));return}const t=n=>{const r=n.data||{};r.type==="status-info"&&(me?.removeEventListener("message",t),e(Object.assign({},fr,r.st||{})))};me.addEventListener("message",t),me.postMessage({type:"status"}),setTimeout(()=>{me?.removeEventListener("message",t),e(Object.assign({},fr))},5e3)})}let At=null;function Pi(e){return At||(e&&(Rn=e),At=new Promise((t,n)=>{if(!me||Z.status!=="ready"){At=null,n(new Error("基础组件未就绪（先在上方下载基础组件）"));return}let r=!1;const s=(a,c)=>{r||(r=!0,clearTimeout(i),me?.removeEventListener("message",o),At=null,a?t():n(new Error(c||"预载失败")))},o=a=>{const c=a.data||{};c.type==="preload-done"&&s(!!c.ok,c.error)},i=setTimeout(()=>s(!1,"预载超时（240s）——重试或查看工程台日志"),24e4);me.addEventListener("message",o),me.postMessage({type:"preload-mpl"})}),At)}function ks(e,t=3e4){return Ii().then(n=>new Promise(r=>{const s=++Ul,o={resolve:r,stdout:"",timer:setTimeout(()=>{Zt.delete(s),Kl(),r({ok:!1,output:o.stdout.slice(0,1500),error:"执行超时（"+Math.round(t/1e3)+"s 上限，已强制终止该次执行）",timedOut:!0})},t)};Zt.set(s,o),n.postMessage({type:"exec",id:s,code:String(e||"")})}))}function Vl(e){let t=sc(),n=!1;return t||(t=Eo.aiFloat("🛠 "+e),n=!0),t.toolTask(e,{primary:n})}const xs=["【工程工具模式（已启用：沙箱 Python，numpy/sympy/matplotlib 就绪）】","⚠️ 你【确实拥有】python_exec 工具且它真实可用——本环境不依赖平台工具栏/函数调用开关，",'工具通过在回复中直接输出 JSON 调用（{"tool":"python_exec","code":"…"}），结果会真实回传。','不要因为"以为自己没有工具"而跳过计算或说"我无法执行代码"。',"【多轮循环机制】这不是一次性问答：你输出工具 JSON 后【立即停止本轮】，系统真实执行并把",'stdout/错误作为新消息回传给你，你再继续——来回多轮直到完成；"先输出工具 JSON 等结果"是完全可行且被支持的，不是自言自语。'].join(`
`),Ql=`
`+xs+`
`+['【指令优先级】"只输出题目 JSON"指的是【最终交付物】；计算验证阶段输出工具 JSON 不违反它，恰恰是必经之路。',"【出题工作循环——像人类命题人一样闭环工作（严格遵守）】","① 产生思路：确定考点、解法、难度定位与命题意图。",'② 计算验证：调用 Python 工具（只输出 {"tool":"python_exec","code":"<sympy/numpy 代码>"}）真实算出标准答案与关键中间量——严禁凭感觉编造数值答案。',"③ 闭环调整：检查计算结果——若答案/难度/计算量不符合命题意图，调整思路再算（可多轮）；若发现之前的解法有问题，推翻重来。","④ 验收合格：标准答案经工具确认无误、题面所需数值全部落实。","⑤ 开始出题：围绕已验证的数值与思路，只输出题目 JSON 本体（格式：stem/type/options/answer/solution/trap），不要再带工具标记。","【配图规约（重要）】几何图形/函数图像/积分区域/数据图等需要配图的题：在验证阶段用 python_exec + matplotlib","画出精确图形（figsize≈(4,3)，含坐标轴/刻度/图例，关键点与区域标注清晰）。numpy/sympy【已在环境中装好】；","matplotlib / scipy 首次使用时【自动装载】（直接 import 即可，等待片刻即可）——","严禁 micropip / pyodide.loadPackage / asyncio（不存在也不需要，用了必报错）；","图【不需要 savefig 到文件】（沙箱无文件语义，画完留在内存即可，也无需 plt.show()）；系统自动收取图形作为题目配图，","严禁把文件路径（如 /tmp/xx.png）写进题面/解析/JSON。","【课本风·必用助手】环境已内置 at_style2d / at_style3d——标准右手系、原点式坐标轴箭头、半透明面板，与教材例题同款：",'平面图：ax = plt.gca(); at_style2d(ax)；立体图（曲面/空间曲线/区域/向量）：ax = fig.add_subplot(projection="3d"); at_style3d(ax)。',"图中标注优先用 LaTeX 数学记号（$...$）；已装载黑体，中文标注可用；若日志提示字体未就绪（中文变方框）则改用英文/LaTeX。","若计算结果与预想不符，以计算结果为准调整题面或答案。"].join(`
`),Wl=`
`+xs+`
`+['1) 需要计算/验算/画图时，只输出一个 JSON {"tool":"python_exec","code":"<Python代码>"}，代码会真实执行，stdout 与生成的图表会回传给你。',"2) 数学答案与关键中间量必须以工具计算为准；画图直接用 matplotlib。","3) 完成后直接用自然文字回答（保持你原有的输出格式与标记习惯），不要带工具 JSON。"].join(`
`),Xl=`
`+xs+`
`+["【工作方式】凡涉及数学推导、数值验算、统计、画图的问题，先调用 Python 真实算，","结论以工具计算结果为准；本问题不需要计算就直接回答，不必强行调用工具。","【配图规约】画图用 matplotlib（figsize≈(4,3)），直接 import（首次使用自动装载）；","严禁 micropip / pyodide.loadPackage / asyncio；无需 savefig/plt.show（沙箱无文件语义），系统自动收取图形。","【最终交付（最重要）】完成后直接输出最终回答，并【严格保持你原系统提示词规定的输出格式】","（JSON schema、ACTION/QUERY/FLOW 等标记约定原样不变）——工具轮只是工作过程，",'最终回答里不得出现工具 JSON 或"我调用了工具"之类的说明。'].join(`
`),go='{"tool":',Yl=/^\s*(?:`{0,3}[a-zA-Z]*)?\s*\{\s*"tool"\s*:/;function Ci(e){const t=String(e||"");if(!t.trim())return"hold";if(Yl.test(t))return"tool";const n=t.replace(/^\s*`{0,3}[a-zA-Z]*\s*/,"");return n.length<=go.length&&go.indexOf(n)===0?"hold":"final"}function Zl(e){const t=Math.max(1,e.maxRounds||8),n=Vl(e.label||"AI 工程任务");let r=!1;n.onCancel(()=>{r=!0});const s=()=>r||!!(e.signal&&e.signal.aborted)||!!(e.isCancelled&&e.isCancelled()),o=[{role:"system",content:(e.system||"")+Xl}],i=(e.user||"")+`

（环境提醒：本会话支持多轮工具调用——需要计算/画图时输出 {"tool":"python_exec","code":"…"} 并立即停止本轮，Python 会真实执行并把结果回传给你；不需要计算就直接按原格式输出最终回答。）`;return o.push({role:"user",content:e.imageDataUrl?[{type:"text",text:i},{type:"image_url",image_url:{url:e.imageDataUrl}}]:i}),new Promise((a,c)=>{const l=()=>{n.fail("已取消"),c(Object.assign(new Error("已取消"),{cancelled:!0}))},u=(f,d)=>{if(s()){l();return}n.setStatus(f>1?"第 "+f+" 轮 · 等待模型响应…":"任务已发起，等待模型响应…");let m=!1;K.chatMessagesStream(o,function(p,y){if(s())return;const g=String(p||"");y&&n.think(y);const v=Ci(g);if(v!=="hold"){if(v==="tool"){n.roundStream(f,g),m&&e.onChunk&&e.onChunk("",""),m=!1;return}m||(m=!0),n.writing(g),e.onChunk&&e.onChunk(g,y||"")}},{cache:!1,timeout:18e4,signal:e.signal}).then(p=>{if(s()){l();return}const y=String(p||"");let g=null;try{g=K.extractRobustJSON(y)}catch{g=null}const v=!!(g&&g.tool==="python_exec"&&typeof g.code=="string");if(v&&m&&(e.onChunk&&e.onChunk("",""),m=!1),v&&f>=t&&!d){n.setStatus("已达工具轮上限，强制汇总…"),o.push({role:"assistant",content:y}),o.push({role:"user",content:"已达最大工具轮次。请停止调用工具，基于目前已有结果，严格按原格式直接输出最终回答。"}),u(f+1,!0);return}if(v&&d){n.finish(),a(y);return}if(v){n.setStatus("第 "+f+" 轮 · 执行 Python…"),ks(g.code).then(w=>{n.step({round:f,code:g.code,output:w.output,error:w.error,image:w.image}),o.push({role:"assistant",content:y}),o.push({role:"user",content:`工具执行结果：
`+(w.error?"[错误] "+w.error+`
`:"")+(w.output||"(无输出，请用 print 输出关键结论)")+(w.image?`
（图形已收录，最终回答可引用）`:"")+`
请继续：还需要计算/画图就输出 {"tool":...}；完成了就按原格式直接输出最终回答。`}),u(f+1,d)}).catch(w=>{const S=String(w?.message||w);n.step({round:f,code:g.code,output:"",error:S}),o.push({role:"assistant",content:y}),o.push({role:"user",content:"工具执行异常："+S+`
请调整思路，按原格式输出最终回答。`}),u(f+1,d)});return}if(!y.trim()){if(f>t){n.fail("模型返回空内容"),c(new Error("模型返回空内容"));return}n.setStatus("返回为空，重试中…"),u(f+1,d);return}e.onChunk&&!m&&e.onChunk(y,""),n.finish(),a(y)}).catch(p=>{if(s()){n.fail("已取消"),c(Object.assign(new Error("已取消"),{cancelled:!0}));return}n.fail(String(p?.message||p)),c(p)})};u(1,!1)})}const Ni=["你是考研学习的工程助手，可以使用 Python 工具（numpy/sympy/matplotlib 已就绪，按 import 自动加载）。","工作方式（严格遵守）：",'1) 需要执行计算/验算/画图时，只输出一个 JSON 对象：{"tool":"python_exec","code":"<Python代码>"}，',"   不要 markdown 代码块、不要多余文字。代码会真实执行，stdout 与生成的图表会回传给你。","2) 画图用 matplotlib，直接 plt. 即可，图片会自动捕获展示给用户，无需 savefig/show。","3) 得出结论后，直接用正常的简体中文回答用户（自然文字，不要 JSON），结论必须有工具计算结果支撑，不要臆造。","4) 一次任务里可以连续调用工具多轮，直到确有把握。"].join(`
`),eu=["你是考研题目的验算引擎，可以使用 Python 工具（numpy/sympy 已安装）。","工作方式（严格遵守）：","1) 每次只输出一个 JSON 对象，不要 markdown 代码块、不要多余文字。",'2) 需要计算/验算时输出：{"tool":"python_exec","code":"<要执行的Python代码>"}。',"   代码将真实执行，stdout 会回传给你。优先用 sympy 做符号验算，辅以数值代入抽查。",'3) 验算完成或无需工具时输出最终结论：{"final":true,"verdict":"通过|不通过|无法确定","reason":"一句话依据"}。',"4) 多次调用工具直到确有把握；不要臆造计算结果。"].join(`
`);function tu(e){let t=null;try{t=K.extractRobustJSON(e)}catch{t=null}return t&&typeof t=="object"?t:null}async function Ss(e){return Vn({system:eu,maxRounds:e.maxRounds||6}).send(e.task,{onStep:e.onStep,isCancelled:e.isCancelled})}function Vn(e){const t=e?.maxRounds||8,n=e?.history?.length?e.history.slice():[{role:"system",content:e?.system||Ni}];return{history:n,async send(r,s){const o=[];n.push({role:"user",content:r});for(let i=1;i<=t;i++){if(s?.isCancelled&&s.isCancelled()){const u={round:i,type:"text",text:"已取消"};return o.push(u),n.push({role:"assistant",content:"（已取消）"}),s?.onStep&&s.onStep(u),{finalText:"已取消",verdict:"",steps:o,rounds:i}}let a="";try{let u=!1;a=await K.chatMessagesStream(n,function(f,d){if(!s?.onText)return;const m=String(f||""),p=String(d||""),y=Ci(m);if(y==="tool"){u&&(s.onText("",""),u=!1),p&&s.onText("",p);return}if(y==="hold"){p&&s.onText("",p);return}if(/^\s*(?:`{0,3}[a-zA-Z]*)?\s*\{/.test(m)){p&&s.onText("",p);return}u=!0,s.onText(m,p)},{cache:!1,timeout:18e4})}catch(u){return{finalText:"AI 调用失败："+String(u?.message||u),verdict:"",steps:o,rounds:i}}const c=tu(a);if(c&&c.tool==="python_exec"&&typeof c.code=="string"){const u={round:i,type:"exec",code:c.code};s?.onStep&&s.onStep(u);const f=await ks(c.code);u.output=f.output,u.error=f.error,u.image=f.image,o.push(u),s?.onStep&&s.onStep(u),n.push({role:"assistant",content:a}),n.push({role:"user",content:`工具执行结果：
`+(f.error?"[错误] "+f.error+`
`+f.output:f.output||"(无输出，请用 print 输出结论)")+(f.image?`
[图表已生成并展示给用户]`:"")+`
请继续：需要再调用工具输出 {"tool":...}；可以直接回答用户时输出自然文字（不要 JSON）。`});continue}if(c&&c.final){const u={round:i,type:"final",text:String(c.reason||c.verdict||"")};return o.push(u),s?.onStep&&s.onStep(u),n.push({role:"assistant",content:a}),{finalText:(c.verdict?"【"+c.verdict+"】":"")+(c.reason||""),verdict:String(c.verdict||""),steps:o,rounds:i}}const l={round:i,type:"text",text:a};return o.push(l),s?.onStep&&s.onStep(l),n.push({role:"assistant",content:a}),{finalText:a,verdict:"",steps:o,rounds:i}}return{finalText:"达到最大工具轮次（"+t+"）仍未收敛，请拆小问题或增加轮次。",verdict:"",steps:o,rounds:t}}}}const gt=wt({running:!1,steps:[]});function qt(){const e=b.get().settings;return!!(e.aiTools&&e.aiTools.enabled)}function Li(e){b.update(t=>{t.settings.aiTools=Object.assign({enabled:!1},t.settings.aiTools,{enabled:e})})}function Jn(){try{const e=b.get().settings;return!(e.aiTools&&e.aiTools.scopeAll===!1)}catch{return!0}}function ji(e){b.update(t=>{t.settings.aiTools=Object.assign({enabled:!1},t.settings.aiTools,{scopeAll:e})})}function nu(){ji(!Jn()),window.App&&window.App.refresh()}function ru(){const e=qt(),t=Z.status,n=t==="ready"?"已就绪":t==="loading"?"下载中…":t==="error"?"加载失败":"未下载";return'<div class="card" id="st-aitools-card"><div class="card-title-row"><span class="card-title">🧪 AI 工程台（实验功能）</span><button class="btn btn-ghost btn-sm" onclick="window.AiTools.settingsGo()">打开</button></div><div class="muted-sm" style="margin-bottom:6px">给 AI 增加真实工程能力：全站各模块的 AI（出题、批改、复盘、规划、教练对话等）自动获得多轮长程任务——调用本地 Python（numpy/sympy/matplotlib）真实计算、验算、画图，过程在右下角任务卡实时可见、可随时取消。默认关闭，不影响现有任何功能。</div><div class="muted-sm" style="margin-bottom:6px">状态：'+(e?"已启用":"未启用")+" · 组件："+n+(e?" · 覆盖："+(Jn()?"全部模块":"仅测验/教练"):"")+'</div><div class="btn-row"><button class="btn btn-sm '+(e?"btn-ghost":"btn-primary")+'" onclick="window.AiTools.settingsToggle()">'+(e?"停用":"启用（本机）")+"</button>"+(e?'<button class="btn btn-sm btn-ghost" onclick="window.AiTools.settingsDownload()">'+(t==="ready"?"重新下载组件":"下载扩展组件（约10MB）")+"</button>":"")+(e?'<button class="btn btn-sm btn-ghost" data-testid="at-scope-btn" onclick="window.AiTools.settingsScope()">'+(Jn()?"覆盖范围：全部模块（点击退回仅测验/教练）":"覆盖范围：仅测验/教练（点击扩展到全部模块）")+"</button>":"")+"</div></div>"+(e?Di():"")}function su(){Li(!qt()),window.App&&window.App.refresh()}function ou(){window.Toast&&window.Toast.show("⏳ 正在下载扩展组件（约 10MB，仅此一次）…","info",8e3),Kn(e=>{window.Toast&&window.Toast.show(e,"info",3e3)}).then(()=>{window.Toast&&window.Toast.success("✅ 扩展组件就绪（numpy + sympy）"),window.App&&window.App.refresh()}).catch(e=>{window.Toast&&window.Toast.danger("扩展组件加载失败："+String(e?.message||e))})}function iu(){window.App&&window.App.go("aitools")}function Di(){const t='<div class="card" id="at-res-card"><div class="card-title-row"><span class="card-title">📦 组件资源管理</span><button class="btn btn-ghost btn-sm" onclick="window.AiTools.resRefresh()">↻ 刷新状态</button></div><div class="muted-sm" style="margin-bottom:6px">基础组件随首次下载安装；画图/数值组件默认「首次使用时按需下载」——重度用户可点「预载」提前装好，出题配图与 scipy 计算零等待。装过即记忆：重启后自动从缓存后台恢复，无需手动操作。</div>'+[["runtime","Pyodide 运行时（内核 + 标准库）","≈10MB",!0],["numpy","numpy（数值计算）","≈7MB",!0],["sympy","sympy（符号验算核心）","≈11MB",!0],["mpl","matplotlib（精确画图）","≈9MB",!1],["font","SimHei 中文字体（图内中文）","≈4.7MB",!1],["scipy","scipy（数值积分/优化）","≈12MB",!1]].map(function(n){return'<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--line);font-size:12.5px"><span style="flex:1">'+n[1]+(n[3]?' <span class="tag">基础</span>':' <span class="tag">画图</span>')+'</span><span class="muted-sm" style="width:64px;text-align:right">'+n[2]+'</span><span data-rs="'+n[0]+'" style="width:84px;text-align:right;font-weight:600">…</span></div>'}).join("")+'<div class="btn-row" style="margin-top:8px"><button class="btn btn-sm btn-primary" onclick="window.AiTools.resPreload()">🎨 预载画图组件（matplotlib + 中文字体 + scipy ≈26MB）</button></div></div>';return setTimeout(()=>{if(typeof document<"u"&&document.body)try{pn()}catch{}},60),setTimeout(()=>{if(typeof document<"u"&&document.body)try{pn()}catch{}},4e3),t}function pn(){Mi().then(e=>{if(typeof document>"u"||!document.body)return;const t={runtime:e.runtime,numpy:e.numpy,sympy:e.sympy,mpl:e.mpl,font:e.font,scipy:e.scipy};Object.keys(t).forEach(n=>{const r=document.querySelector('[data-rs="'+n+'"]');r&&(r.textContent=t[n]?"✓ 已装载":"未装载",r.style.color=t[n]?"var(--ok,#237804)":"var(--text-muted,#888)")})}).catch(()=>{})}function au(){const e=window.Toast;if(!gn()){e&&e.warn("基础组件未就绪——先点上方「下载扩展组件」");return}e&&e.show("⏳ 正在预载画图组件（matplotlib + 中文字体 + scipy ≈26MB，仅首次，视网速约 1~3 分钟）…","info",1e4),Pi(t=>{e&&e.show(t,"info",3e3)}).then(()=>{e&&e.success("✅ 画图 + scipy 组件就绪——出题配图与数值计算零等待"),pn()}).catch(t=>{e&&e.danger("预载失败："+String(t.message||t)),pn()})}function cu(e,t,n,r){gt.running=!0,gt.steps=[];const s=["请验算下面这道考研题目的答案是否正确。","【题目】"+(e||"（无题干）"),"【给出的答案】"+(t||"（无）"),"【给出的解析】"+(n||"（无）"),"要求：先用 sympy 独立重新求解/验算（不要照抄解析），再数值代入抽查，最后给出结论。"].join(`
`);return Ss({task:s,maxRounds:6,onStep:o=>{gt.steps.push(o),r&&r.onStep&&r.onStep(o)},isCancelled:r&&r.isCancelled}).finally(()=>{gt.running=!1})}const lu=new Map,Ht=new Map,En=new Map;function ot(e){return String(e||"").replace(/</g,"&lt;")}function Kt(e,t,n,r,s){const o=[],i=(u,f,d)=>{e.innerHTML='<div class="card" style="margin-top:12px" data-testid="at-verify-card"><div class="card-title-row"><span class="card-title">'+s+'</span><span class="tag" style="background:'+(u==="通过"?"#237804":u==="不通过"?"#cf1322":"#8c8c8c")+';color:#fff">'+(d?"验算中…":u||"完成")+"</span></div>"+o.join("")+'<div style="margin-top:6px"><b style="color:'+(u==="通过"?"#237804":u==="不通过"?"#cf1322":"inherit")+'">'+(d?"AI 正在自主调用 Python 工具验算…":ot(f||"完成"))+"</b></div></div>"},a=t.get(n);if(a){i(a.verdict,a.report,!1);return}const c=En.get(n);if(c){i("","",!0),c.then(u=>i(u.verdict,u.report,!1)).catch(u=>i("失败","验算失败："+String(u?.message||u),!1));return}i("","",!0);const l=Ss({task:r,maxRounds:6,onStep:u=>{u.type==="exec"&&(o.push('<details style="margin-top:6px"><summary class="muted-sm" style="cursor:pointer">第 '+u.round+' 轮 · AI 调用 Python 工具（点击展开代码与输出）</summary><pre class="report" style="font-size:12px">'+ot(u.code)+'</pre><pre class="report" style="font-size:12px;opacity:.8">输出：'+ot(u.output||"(无)")+(u.error?`
错误：`+ot(u.error):"")+"</pre></details>"),i("","",!0))}}).then(u=>{if(t.set(n,{verdict:u.verdict,report:u.finalText}),t.size>30){const f=t.keys().next().value;f!==void 0&&t.delete(f)}return i(u.verdict,u.finalText,!1),{verdict:u.verdict,report:u.finalText}}).catch(u=>{throw i("失败","验算失败："+String(u?.message||u),!1),u});En.set(n,l),l.finally(()=>{En.delete(n)}),l.catch(()=>{})}function uu(e){const t=[{role:"system",content:e.system+`
`+Ql},{role:"user",content:e.ask+`

（环境提醒：本会话支持多轮工具调用——需要计算时输出 {"tool":"python_exec","code":"…"} 并立即停止本轮，Python 会真实执行并把结果回传给你。数学题的标准答案必须先用它算出。）`}],n=8,r=[];return new Promise((s,o)=>{const i=a=>{if(e.isCancelled&&e.isCancelled()){o(Object.assign(new Error("已取消"),{cancelled:!0}));return}K.chatMessagesStream(t,function(c,l){e.onStream&&e.onStream(c||"",l||"")},{cache:!1,timeout:18e4}).then(c=>{let l=null;try{l=K.extractRobustJSON(c)}catch{l=null}if(l&&l.tool==="python_exec"&&typeof l.code=="string"){ks(l.code).then(u=>{if(u.image&&String(u.image).indexOf("data:image")===0&&r.push(u.image),e.onStep&&e.onStep({round:a,type:"exec",code:l.code,output:u.output,error:u.error,image:u.image}),t.push({role:"assistant",content:c}),t.push({role:"user",content:`工具执行结果：
`+(u.error?"[错误] "+u.error+`
`:"")+(u.output||"(无输出，请用 print 输出结论)")+(u.image?`
（图形已收录，可作为题目配图）`:"")+`
请继续：需要再算/画图输出 {"tool":...}；算好了只输出题目 JSON 本体。`}),a>=n){o(new Error("达到最大工具轮次仍未输出题目 JSON"));return}i(a+1)});return}if(l&&l.stem){delete l.tool,r.length&&(l.diagramImg=r[r.length-1],l.diagrams=r.slice()),s(l);return}if(a>=n){o(new Error("AI 未输出有效题目 JSON。最后输出前200字："+c.slice(0,200)));return}t.push({role:"assistant",content:c}),t.push({role:"user",content:"请严格只输出题目 JSON 本体（含 stem/type/options/answer/solution/trap 字段），不要其他内容。"}),i(a+1)}).catch(o)};i(1)})}function du(e,t){try{if(!e||!qt())return;if(!gn()){e.innerHTML='<div class="muted-sm" style="margin-top:10px">🧪 AI 工程验算：组件未就绪（到「AI 工程台」下载扩展组件后，出题将自动附带 sympy 真实验算）。</div>';return}const n=["请验算下面这道考研题目的答案是否正确。","【题目】"+(t.stem||"（无题干）"),"【给出的答案】"+(t.answer||"（无）"),"【给出的解析】"+(t.solution||"（无）"),"要求：先用 sympy 独立重新求解/验算（不要照抄解析），再数值代入抽查，最后给出结论。"].join(`
`);Kt(e,lu,t.key,n,"🧪 AI 工程验算（sympy 真实计算）")}catch{}}function fu(e,t){try{if(!qt())return;(t||[]).forEach(n=>{if(!n||!n.aiAnalysis||!(n.aiAnalysis.keySteps||n.aiAnalysis.solution))return;const r=e.querySelector('[data-pm-verify="'+n.id+'"]');if(!r)return;const s=n.id+"|"+(n.updatedAt||n.createdAt||""),o="🧪 AI 工程验算（解析防幻觉）";if(Ht.get(s)){Kt(r,Ht,s,"",o);return}if(En.has(s)){Kt(r,Ht,s,"",o);return}r.innerHTML='<div class="card" style="margin-top:12px"><div class="card-title-row"><span class="card-title">🧪 AI 工程验算（解析防幻觉）</span></div><div class="btn-row"><button class="btn btn-sm btn-ghost" data-pm-verify-run="'+n.id+'">🔬 手动验算（AI 调 sympy 核对解析，消耗 token）</button></div></div>';const a=r.querySelector('[data-pm-verify-run="'+n.id+'"]');a&&(a.onclick=function(){const c=["请验算这道拍题的 AI 解析是否正确（防解析幻觉）。","【题目】"+(n.extractedQuestion||n.note||"（无题干）"),"【AI 给出的解题关键】"+(n.aiAnalysis.keySteps||n.aiAnalysis.solution||"（无）"),"【易错原因】"+(n.aiAnalysis.errorCause||"（无）"),"要求：先用 sympy 独立重新求解（不要照抄解析），对照 AI 的解题关键逐步核对，再数值代入抽查，最后给出结论（AI 解析有错请明确指出错在哪一步）。"].join(`
`);if(gn()){Kt(r,Ht,s,c,o);return}const l=u=>{r.innerHTML='<div class="muted-sm" style="margin-top:10px">⏳ '+String(u||"").replace(/</g,"&lt;")+"</div>"};l("正在加载工程组件（约 10MB，仅首次）…"),Kn(u=>l(u)).then(()=>Kt(r,Ht,s,c,o)).catch(u=>{r.innerHTML='<div class="muted-sm" style="margin-top:10px">工程组件加载失败：'+String(u&&u.message||u).replace(/</g,"&lt;")+"（检查网络后重试）</div>"})})})}catch{}}var Ot=null;function pu(){Ot=null}function hu(e,t){if(Ot&&!t?.fresh)return e.innerHTML="",e.appendChild(Ot.root),Ot.panel;var n=document.createElement("div");n.innerHTML='<div class="card"><div class="card-title-row"><span class="card-title">🤖 AI 工程出题中…</span><button class="btn btn-sm btn-ghost" data-testid="qes-cancel">取消</button></div><div style="margin:6px 0"><span class="tag" data-testid="qes-status" style="background:#8c8c8c;color:#fff"></span></div><details open style="margin-top:8px"><summary class="muted-sm" style="cursor:pointer">💭 思考过程（实时流式）</summary><pre class="report" data-testid="qes-think" style="max-height:220px;overflow:auto;opacity:.72;font-size:12px;white-space:pre-wrap;margin-top:4px"></pre></details><div data-testid="qes-tools" style="margin-top:8px"></div><div data-testid="qes-content-wrap" style="display:none;margin-top:10px"><div class="card-title-sm">📝 题面生成（基于已验证数值）</div><pre class="report" data-testid="qes-content" style="max-height:260px;overflow:auto;white-space:pre-wrap;font-size:12px"></pre></div></div>',e.innerHTML="",e.appendChild(n);var r=0,s=!1,o=null,i=0,a=n.querySelector('[data-testid="qes-status"]'),c=n.querySelector('[data-testid="qes-think"]'),l=n.querySelector('[data-testid="qes-think-wrap"]'),u=n.querySelector('[data-testid="qes-tools"]'),f=n.querySelector('[data-testid="qes-content"]'),d=n.querySelector('[data-testid="qes-content-wrap"]'),m=n.querySelector('[data-testid="qes-cancel"]');m&&t&&t.onCancel&&(m.onclick=function(){t.onCancel()});var p=!1,y=0,g=null;function v(){p=!0,y=Date.now(),g&&clearInterval(g);var M=function(){if(p){var E=Math.round((Date.now()-y)/1e3);S("📤 已发送出题请求，等待模型响应…（"+E+"s）"),g=setTimeout(M,1e3)}};M()}function w(){p=!1,g&&(clearInterval(g),g=null)}function S(M,E){a&&(a.textContent=M,E&&(a.style.background=E))}v();var O={setStatus:S,stream:function(M,E){s||(s=!0,w(),S("✅ 已连接 · 流式接收中…","#1a7f37")),E&&(l&&(l.style.display=""),c&&(c.textContent=E,c.scrollTop=c.scrollHeight));var L=String(M||"").trim();if(L.indexOf('{"tool"')===0){var R=r+1;S("🛠 第 "+R+" 轮：AI 正在构造 Python 计算代码…","#8c8c8c"),(i!==R||!o||!o.parentNode)&&(o&&o.parentNode&&o.parentNode.removeChild(o),o=document.createElement("details"),o.setAttribute("data-round-draft",String(R)),o.style.margin="6px 0",o.open=!0,o.innerHTML='<summary class="muted-sm" style="cursor:pointer">🛠 第 '+R+' 轮 · 正在构造 Python 计算代码…</summary><pre class="report" style="font-size:12px;white-space:pre-wrap"></pre>',u&&u.appendChild(o),i=R);var P=o.querySelector("pre");if(P)try{P.textContent=JSON.parse(L).code||L}catch{P.textContent=L}return}L&&(w(),S("✍ 正在撰写题面（基于已验证数值）…","#1a7f37"),d&&(d.style.display=""),f&&(f.textContent=L,f.scrollTop=f.scrollHeight))},toolRound:function(M,E,L,R,P){if(r=Math.max(r,M),w(),o&&i===M&&(o.parentNode&&o.parentNode.removeChild(o),o=null,i=0),S("🛠 第 "+M+" 轮计算完成 ✓ → 继续分析结果…","#1a7f37"),!!u){u.style.display="";var H=document.createElement("details");H.style.margin="6px 0",H.open=!0,H.innerHTML='<summary class="muted-sm" style="cursor:pointer">🛠 第 '+M+" 轮 · Python 计算完成"+(R?"（出错，已回传修正）":" ✓")+'</summary><pre class="report" style="font-size:12px;white-space:pre-wrap">'+ot(E)+'</pre><pre class="report" style="font-size:12px;opacity:.8;white-space:pre-wrap">→ 输出：'+ot(L||"(无)")+(R?`
错误：`+ot(R):"")+"</pre>"+(P?'<img src="'+ot(P)+'" alt="工具产图" style="max-width:100%;border-radius:8px;border:1px solid var(--line);margin-top:6px;background:#fff">':""),u.appendChild(H)}},done:function(){w(),S("✅ 完成","#237804"),Ot=null}};return Ot={root:n,panel:O},O}const Fe=wt({items:[],running:!1});let bt=null;function gu(){return bt||(bt=Vn({system:Ni,maxRounds:8})),bt}function qi(e,t){if(e=String(e||"").trim(),!e||Fe.running)return;if(!gn()){window.Toast&&window.Toast.warn("扩展组件未就绪，请先下载（约 10MB）");return}Fe.items.push({role:"user",text:e,steps:[]});const n=wt({role:"assistant",text:"",steps:[],image:""});Fe.items.push(n),Fe.running=!0,gu().send(e,{onStep:r=>{r.type==="exec"&&(n.steps.push(r),r.image&&(n.image=r.image))},isCancelled:t}).then(r=>{n.text=r.finalText||"（完成）"}).catch(r=>{n.text="AI 调用失败："+String(r?.message||r)}).finally(()=>{Fe.running=!1,Bi()})}const _s="kaoyan2026_aitools_chat";function mu(e){return Vn({system:(e||"")+Wl,maxRounds:8})}function qr(){bt=null,Fe.items.length=0;try{localStorage.removeItem(_s)}catch{}}function Bi(){try{const e=bt?bt.history.slice(-40):[],t=Fe.items.slice(-30);localStorage.setItem(_s,JSON.stringify({hist:e,items:t}))}catch{}}function yu(){try{const e=localStorage.getItem(_s);if(!e)return;const t=JSON.parse(e);Array.isArray(t.items)&&t.items.length&&t.items.forEach(function(n){Fe.items.push({role:n.role==="user"?"user":"assistant",text:String(n.text||""),steps:Array.isArray(n.steps)?n.steps:[],image:n.image||""})}),Array.isArray(t.hist)&&t.hist.length&&(bt=Vn({history:t.hist}))}catch{}}function vu(){try{if(!qt()||Z.status!=="idle")return;setTimeout(function(){Kn(function(){}).catch(function(){})},1500)}catch{}}const mt={settingsCard:ru,settingsToggle:su,settingsDownload:ou,settingsGo:iu,resourceCard:Di,resRefresh:pn,resPreload:au,ensureLoaded:Kn,isReady:gn,loaderState:Z,pytoolsState:gt,chatState:Fe,renderExamPanel:hu,resetExamPanel:pu,newCoachSession:mu,chatSend:qi,chatReset:qr,saveChat:Bi,restoreChat:yu,maybeAutoLoad:vu,verifyAnswer:cu,quizAutoVerify:du,photoAutoVerify:fu,generateQuestion:uu,runAgent:Ss,enabled:qt,setEnabled:Li,toolChat:Zl,scopeAll:Jn,setScopeAll:ji,settingsScope:nu};try{window.AiTools=mt}catch{}const bu=["innerHTML"],pr=de({__name:"TexText",props:{source:{}},setup(e){const t=e,n=D(()=>Qe.renderInline(t.source||""));return(r,s)=>(_(),A("span",{class:"tex-text",innerHTML:n.value},null,8,bu))}}),wu={class:"card",style:{"margin-top":"24px"},"data-testid":"aitools-page"},ku={class:"card-title-row"},xu={class:"btn-row",style:{margin:"8px 0"}},Su=["disabled"],_u={key:0,style:{margin:"8px 0"},"data-testid":"dl-progress"},Au={class:"pbar",style:{height:"12px",background:"var(--surface-muted)"}},Tu={class:"muted-sm",style:{"margin-top":"4px","font-variant-numeric":"tabular-nums"}},Eu={key:1,class:"muted-sm",style:{"white-space":"pre-wrap","font-size":"12px"},"data-testid":"dl-logs"},Ou={key:2,style:{"margin-top":"14px"},class:"card-inner","data-testid":"at-res"},Iu={style:{flex:"1"}},Mu={class:"chip",style:{"font-size":"11px"}},Pu={class:"muted-sm",style:{width:"64px","text-align":"right"}},Cu={class:"btn-row",style:{"margin-top":"8px"}},Nu=["disabled"],Lu={key:0,class:"muted-sm",style:{"white-space":"pre-wrap","font-size":"12px"},"data-testid":"at-res-logs"},ju={style:{"margin-top":"14px"},class:"card-inner","data-testid":"at-chat"},Du={class:"card-title-row"},qu={style:{"max-height":"460px",overflow:"auto",margin:"6px 0"}},Bu={key:0,style:{"text-align":"right"}},Ru={class:"chip",style:{"white-space":"pre-wrap"}},Ju={key:1},Hu=["open"],Gu={class:"muted-sm",style:{cursor:"pointer"}},zu={class:"report",style:{"font-size":"12px"}},$u={class:"report",style:{"font-size":"12px",opacity:".8"}},Uu=["src"],Fu={key:1,style:{"margin-top":"4px"}},Ku={key:0,class:"muted-sm"},Vu={key:1,class:"muted-sm"},Qu={style:{display:"flex",gap:"8px","align-items":"flex-end"}},Wu=["disabled"],Xu={style:{"margin-top":"14px"},class:"card-inner"},Yu={class:"btn-row",style:{margin:"8px 0"}},Zu=["disabled"],ed=["open"],td={class:"muted-sm",style:{cursor:"pointer"}},nd={key:0,class:"report",style:{"font-size":"12px"}},rd={key:1,class:"report",style:{"font-size":"12px",opacity:".8"}},sd={key:2},od={key:0,class:"card",style:{"margin-top":"8px"},"data-testid":"at-report"},id={style:{"margin-top":"4px"}},ad=de({__name:"AiToolsPage",setup(e){const t=D(()=>mt.enabled()),n=[{k:"runtime",name:"Pyodide 运行时（内核 + 标准库）",size:"≈10MB",core:!0},{k:"numpy",name:"numpy（数值计算）",size:"≈7MB",core:!0},{k:"sympy",name:"sympy（符号验算核心）",size:"≈11MB",core:!0},{k:"mpl",name:"matplotlib（精确画图）",size:"≈9MB",core:!1},{k:"font",name:"SimHei 中文字体（图内中文）",size:"≈4.7MB",core:!1},{k:"scipy",name:"scipy（数值积分/优化，按需）",size:"≈12MB",core:!1}],r=wt({runtime:!1,numpy:!1,sympy:!1,mpl:!1,font:!1,scipy:!1}),s=se(!1),o=se(!1),i=se([]);async function a(){try{const H=await Mi();Object.assign(r,H),s.value=!0}catch{}}async function c(){if(!o.value){o.value=!0,i.value=[];try{await Pi(H=>{i.value.push(H)}),i.value.push("✅ 画图组件就绪——出题配图零等待")}catch(H){i.value.push("✗ "+String(H?.message||H))}finally{o.value=!1,await a()}}}$r(()=>Z.status,H=>{H==="ready"&&(a(),setTimeout(()=>{a()},4e3))},{immediate:!0});const l=se([]),u=se(!1);async function f(){u.value=!0,l.value=[];try{await mt.ensureLoaded(H=>{l.value.push(H)}),l.value.push("✅ 就绪")}catch(H){l.value.push("✗ "+String(H?.message||H))}finally{u.value=!1}}function d(){mt.setEnabled(!t.value)}const m=wt({stem:"",answer:"",solution:""}),p=D(()=>gt.running),y=D(()=>gt.steps),g=se(""),v=se(""),w=se(!1);async function S(){if(p.value)return;g.value="",v.value="",w.value=!1;const H=await mt.verifyAnswer(m.stem,m.answer,m.solution,{isCancelled:()=>w.value});g.value=H.finalText,v.value=H.verdict}function O(){w.value=!0}const M=Fe,E=se("");let L=!1;function R(){if(M.running||!E.value.trim())return;L=!1;const H=E.value;E.value="",qi(H,()=>L),To(()=>{const B=document.querySelector('[data-testid="at-chat"] > div:nth-child(3)');B&&(B.scrollTop=B.scrollHeight)})}function P(){L=!0}return(H,B)=>(_(),A("div",wu,[h("div",ku,[B[6]||(B[6]=h("span",{class:"card-title"},[te("🧪 AI 工程台 "),h("span",{class:"muted-sm"},"（实验功能）")],-1)),h("span",{class:"chip",style:Xe(W(Z).status==="ready"?"color:#237804":"")},T(W(Z).status==="ready"?"组件就绪":W(Z).status==="loading"?"下载中…":W(Z).status==="error"?"组件加载失败":"组件未下载"),5)]),B[15]||(B[15]=h("div",{class:"muted-sm",style:{"margin-bottom":"8px"}},[te(" 给 AI 增加真实工程能力：多轮调用 Python（numpy/sympy）做符号验算、数值抽查、画图。 两套方案自由选择："),h("b",null,"不启用 = 与现有完全一致"),te("（零下载零差异）；启用后仅本页与设置页入口生效。 ")],-1)),h("div",xu,[h("button",{class:re(["btn btn-sm",t.value?"btn-primary":"btn-ghost"]),"data-testid":"at-toggle",onClick:d},T(t.value?"✓ 已启用（点击停用）":"方案A：启用工程能力"),3),t.value?(_(),A("button",{key:0,class:"btn btn-sm btn-ghost","data-testid":"at-download",disabled:u.value||W(Z).status==="ready",onClick:f},T(W(Z).status==="ready"?"组件已就绪":u.value?"下载中…":"下载扩展组件（约10MB，仅一次）"),9,Su)):V("",!0)]),u.value?(_(),A("div",_u,[h("div",Au,[h("div",{style:Xe([{height:"100%","border-radius":"999px",transition:"width .3s",background:"linear-gradient(90deg,#2f54eb,#7aa2ff)",width:"0%"},{width:W(Z).progress.pct+"%"}])},null,4)]),h("div",Tu,T(W(Z).progress.pct)+"% · "+T(W(Z).progress.msg||"准备下载…"),1)])):V("",!0),l.value.length?(_(),A("div",Eu,T(l.value.join(`
`)),1)):V("",!0),t.value?(_(),A("div",Ou,[h("div",{class:"card-title-row"},[B[7]||(B[7]=h("span",{class:"card-title"},"📦 组件资源管理",-1)),h("button",{class:"btn btn-ghost btn-sm","data-testid":"at-res-refresh",onClick:a},"↻ 刷新状态")]),B[8]||(B[8]=h("div",{class:"muted-sm",style:{"margin-bottom":"6px"}}," 基础组件随首次下载安装；画图组件默认「首次画图时按需下载」——重度可视化用户可点「预载」提前装好，出题配图零等待。 装过即记忆：重启后自动从缓存后台恢复，无需手动操作。 ",-1)),(_(),A(U,null,X(n,z=>h("div",{key:z.k,style:{display:"flex","align-items":"center",gap:"8px",padding:"5px 0","border-bottom":"1px solid var(--line)","font-size":"12.5px"}},[h("span",Iu,[te(T(z.name)+" ",1),h("span",Mu,T(z.core?"基础":"画图"),1)]),h("span",Pu,T(z.size),1),h("span",{style:Xe([{width:"84px","text-align":"right","font-weight":"600"},r[z.k]?"color:#237804":"opacity:.55"])},T(s.value?r[z.k]?"✓ 已装载":"未装载":W(Z).status==="ready"?"查询中…":"未下载"),5)])),64)),h("div",Cu,[h("button",{class:"btn btn-sm btn-primary",disabled:o.value||W(Z).status!=="ready","data-testid":"at-res-preload",onClick:c},T(o.value?"⏳ 预载中…":"🎨 预载画图组件（matplotlib + 中文字体 ≈14MB）"),9,Nu)]),i.value.length?(_(),A("div",Lu,T(i.value.join(`
`)),1)):V("",!0)])):V("",!0),t.value?(_(),A(U,{key:3},[h("div",ju,[h("div",Du,[B[9]||(B[9]=h("span",{class:"card-title"},"💬 工程对话（AI 自主编排工具）",-1)),h("button",{class:"btn btn-ghost btn-sm","data-testid":"at-chat-reset",onClick:B[0]||(B[0]=(...z)=>W(qr)&&W(qr)(...z))},"清空会话")]),B[10]||(B[10]=h("div",{class:"muted-sm",style:{"margin-bottom":"6px"}}," 像网页端 AI 平台一样问一句话，AI 连续自主调用 Python（验算/画图/数据处理）后作答。会话在本页驻留。 ",-1)),h("div",qu,[(_(!0),A(U,null,X(W(M).items,(z,j)=>(_(),A("div",{key:j,style:{margin:"8px 0"}},[z.role==="user"?(_(),A("div",Bu,[h("span",Ru,T(z.text),1)])):(_(),A("div",Ju,[(_(!0),A(U,null,X(z.steps,(C,I)=>(_(),A("details",{key:I,style:{margin:"4px 0"},open:I===z.steps.length-1&&!z.text},[h("summary",Gu,"第 "+T(I+1)+" 次工具 · Python "+T(C.error?"❌":"✓"),1),h("pre",zu,T(C.code),1),h("pre",$u,[te("输出："+T(C.output||"(无)"),1),C.error?(_(),A(U,{key:0},[te(T(`
`)+"错误："+T(C.error),1)],64)):V("",!0)])],8,Hu))),128)),z.image?(_(),A("img",{key:0,src:z.image,style:{"max-width":"100%",border:"1px solid var(--line)","border-radius":"8px",margin:"4px 0"},alt:"AI 生成图表"},null,8,Uu)):V("",!0),z.text?(_(),A("div",Fu,[fe(pr,{source:z.text},null,8,["source"])])):V("",!0)]))]))),128)),W(M).running?(_(),A("div",Ku,"⚙️ AI 正在自主安排工具调用…（可取消）")):V("",!0),W(M).items.length?V("",!0):(_(),A("div",Vu,"试试：「帮我验证 ∫₀¹ xeˣdx 的答案是 e+1 是否正确」或「画一张标准正态分布曲线」"))]),h("div",Qu,[rt(h("textarea",{"onUpdate:modelValue":B[1]||(B[1]=z=>E.value=z),class:"input",rows:"2",style:{flex:"1"},placeholder:"一句话交给 AI，它会自主决定是否调用 Python…（Ctrl+Enter 发送）","data-testid":"at-chat-input",onKeydown:B[2]||(B[2]=Fr(yr(z=>R(),["ctrl"]),["enter"]))},null,544),[[Ft,E.value]]),W(M).running?(_(),A("button",{key:1,class:"btn btn-ghost",onClick:P},"取消")):(_(),A("button",{key:0,class:"btn btn-primary","data-testid":"at-chat-send",disabled:!E.value.trim(),onClick:R},"发送",8,Wu))])]),h("div",Xu,[B[11]||(B[11]=h("div",{class:"card-title-row"},[h("span",{class:"card-title"},"🔎 答案真实验算（sympy 独立重解 + 数值抽查）")],-1)),B[12]||(B[12]=h("label",{class:"muted-sm"},"题干",-1)),rt(h("textarea",{"onUpdate:modelValue":B[3]||(B[3]=z=>m.stem=z),class:"input",rows:"2",placeholder:"例：计算 ∫₀¹ x·eˣ dx",style:{width:"100%"}},null,512),[[Ft,m.stem]]),B[13]||(B[13]=h("label",{class:"muted-sm"},"给出的答案",-1)),rt(h("textarea",{"onUpdate:modelValue":B[4]||(B[4]=z=>m.answer=z),class:"input",rows:"2",placeholder:"例：e − 1 ≈ 1.718",style:{width:"100%"}},null,512),[[Ft,m.answer]]),B[14]||(B[14]=h("label",{class:"muted-sm"},"解析（可选）",-1)),rt(h("textarea",{"onUpdate:modelValue":B[5]||(B[5]=z=>m.solution=z),class:"input",rows:"2",placeholder:"分部积分过程…",style:{width:"100%"}},null,512),[[Ft,m.solution]]),h("div",Yu,[h("button",{class:"btn btn-primary","data-testid":"at-verify",disabled:p.value||W(Z).status!=="ready",onClick:S},T(p.value?"验算中…":"⚡ 开始真实验算"),9,Zu),p.value?(_(),A("button",{key:0,class:"btn btn-ghost",onClick:O},"取消")):V("",!0)]),(_(!0),A(U,null,X(y.value,(z,j)=>(_(),A("div",{key:j,style:{margin:"6px 0"}},[h("details",{open:z.type==="exec"&&j===y.value.length-1},[h("summary",td," 第 "+T(z.round)+" 轮 · "+T(z.type==="exec"?"执行 Python"+(z.error?" ❌":" ✓"):"最终结论"),1),z.code?(_(),A("pre",nd,T(z.code),1)):V("",!0),z.output!==void 0?(_(),A("pre",rd,[te("输出："+T(z.output||"(无)"),1),z.error?(_(),A(U,{key:0},[te(T(`
`)+"错误："+T(z.error),1)],64)):V("",!0)])):V("",!0),z.type==="final"?(_(),A("div",sd,[fe(pr,{source:z.text||""},null,8,["source"])])):V("",!0)],8,ed)]))),128)),g.value?(_(),A("div",od,[h("b",{style:Xe(v.value==="通过"?"color:#237804":v.value==="不通过"?"color:#cf1322":"")},T(v.value?"验算结论："+v.value:"结论"),5),h("div",id,[fe(pr,{source:g.value},null,8,["source"])])])):V("",!0)])],64)):V("",!0)]))}}),cd={class:"card",style:{"margin-top":"24px"},"data-testid":"prompt-studio-page"},ld={class:"card-title-row"},ud=["disabled"],dd={class:"ps-live","data-testid":"ps-live-strip"},fd={class:"chip"},pd={class:"chip"},hd={class:"chip"},gd={class:"chip"},md={class:"chip"},yd={class:"chip"},vd={class:"chip"},bd={style:{display:"flex",gap:"8px","align-items":"center",margin:"10px 0","flex-wrap":"wrap"}},wd={class:"seg-row",style:{margin:"0"}},kd=["placeholder"],xd={class:"card-inner","data-testid":"ps-lanes"},Sd={style:{display:"flex","align-items":"baseline",gap:"8px","flex-wrap":"wrap"}},_d={style:{"font-size":"18px"}},Ad={style:{"font-size":"13.5px"}},Td={class:"muted-sm",style:{"font-size":"11px"}},Ed={key:0,class:"chip chip-warn",style:{"font-size":"10px"}},Od={class:"muted-sm",style:{"font-size":"12px",margin:"3px 0"}},Id={class:"ps-facts"},Md={class:"card-inner",style:{"margin-top":"12px"},"data-testid":"ps-flow"},Pd={style:{"font-size":"20px",flex:"0 0 auto","line-height":"1.4"}},Cd={style:{flex:"1","border-left":"3px solid var(--line)","padding-left":"10px"}},Nd={style:{"font-size":"13px"}},Ld={class:"muted-sm",style:{"font-size":"12px","margin-top":"2px"}},jd={class:"card-inner",style:{"margin-top":"12px"},"data-testid":"ps-chains"},Dd={style:{"font-size":"12.5px","min-width":"170px"}},qd={class:"chip",style:{"font-size":"11px"}},Bd={key:0,class:"muted-sm"},Rd={class:"card-inner",style:{"margin-top":"12px"},"data-testid":"ps-frag"},Jd={style:{"font-size":"13px"}},Hd={class:"muted-sm",style:{"font-size":"12px",margin:"2px 0"}},Gd={key:1,class:"card-inner","data-testid":"ps-registry-table"},zd={class:"card-title-row"},$d={class:"muted-sm",style:{"font-size":"11px"}},Ud={class:"ps-reg-group"},Fd={style:{flex:"1","min-width":"150px"}},Kd={style:{"font-size":"12.5px"}},Vd={class:"muted-sm",style:{"font-size":"10.5px","margin-left":"6px"}},Qd={class:"muted-sm",style:{"font-size":"11px"}},Wd={class:"chip",style:{"font-size":"11px",flex:"none"}},Xd={class:"chip",style:{"font-size":"11px",flex:"none"}},Yd={class:"chip",style:{"font-size":"11px",flex:"none"}},Zd=["onClick"],ef={key:0,class:"empty"},tf={class:"card-inner","data-testid":"ps-coach-flow"},nf={style:{"font-size":"18px",flex:"0 0 auto","line-height":"1.5"}},rf={style:{flex:"1","border-left":"3px solid var(--line)","padding-left":"10px"}},sf={style:{"font-size":"13px"}},of={class:"muted-sm",style:{"font-size":"12px","margin-top":"2px"}},af={class:"card-inner",style:{"margin-top":"12px"}},cf={class:"muted-sm",style:{"font-size":"12px","line-height":"2"}},lf={class:"card-inner","data-testid":"ps-globals"},uf={class:"card-title-row"},df={class:"muted-sm",style:{"font-size":"11px"}},ff={style:{display:"flex","align-items":"center",gap:"8px","flex-wrap":"wrap"}},pf={style:{"font-size":"13px"}},hf={class:"chip",style:{"font-size":"11px"}},gf={class:"muted-sm",style:{"font-size":"11px"}},mf=["onClick"],yf={style:{"font-size":"11.5px","white-space":"pre-wrap","max-height":"280px",overflow:"auto",margin:"6px 0 0"}},vf={key:0,style:{"margin-top":"8px","border-top":"1px dashed var(--line)","padding-top":"6px"}},bf={style:{flex:"0 0 auto"}},wf={style:{flex:"0 0 118px"}},kf={class:"muted-sm",style:{flex:"1"}},xf={key:0,class:"empty"},Sf={class:"card-inner",style:{"margin-top":"14px"},"data-testid":"ps-modules"},_f={class:"card-title-row"},Af={class:"muted-sm",style:{"font-size":"11px"}},Tf={style:{display:"flex","align-items":"center",gap:"8px","flex-wrap":"wrap"}},Ef={style:{"font-size":"13px"}},Of={class:"chip",style:{"font-size":"11px"}},If={key:0,class:"muted-sm",style:{"font-size":"11px"}},Mf={class:"muted-sm",style:{"font-size":"11px"}},Pf=["onClick"],Cf={key:0,style:{"font-size":"11.5px","white-space":"pre-wrap","max-height":"280px",overflow:"auto",margin:"6px 0 0"}},Nf={key:1,class:"alert alert-danger",style:{margin:"6px 0 0","font-size":"12px"}},Lf={key:2,style:{"margin-top":"8px","border-top":"1px dashed var(--line)","padding-top":"6px"}},jf={style:{flex:"0 0 auto"}},Df={style:{flex:"0 0 118px"}},qf={class:"muted-sm",style:{flex:"1"}},Bf={key:0,class:"empty"},Rf=de({__name:"PromptStudioPage",setup(e){const t=se("map"),n=se(!0),r=se(""),s=se([]),o=se([]),i=se(""),a=se(0),c=D(()=>{a.value;const j=b.get(),C=j.ai||{};let I={};try{I=K.activeApi()||{}}catch{}let J={};try{J=K.cacheStats()||{}}catch{}let N={};try{N=window.AiMemory&&window.AiMemory.stats()||{}}catch{}const F=window.AiTools;let ne=0;try{ne=window.PluginBus&&window.PluginBus.skills&&window.PluginBus.skills().length||0}catch{}let ce=0;try{const _e=Object.keys(j.copilotChats||{})[0];ce=((j.copilotChats||{})[_e]||[]).length}catch{}return{apiName:I.name||"",apiModel:I.model||"",apiEp:String(I.endpoint||"").replace(/^https?:\/\//,"").slice(0,34),configured:!!(I.model&&I.key&&I.endpoint),apisN:(C.apis||[]).length,cacheEntries:J.entries||0,cacheHits:J.hits||0,cacheKb:J.kb||0,memFacts:N.facts||0,memPinned:N.pinned||0,memAi:N.aiFacts||0,engEnabled:!!(F&&F.enabled&&F.enabled()),engReady:!!(F&&F.isReady&&F.isReady()),skillsN:ne,chatsN:ce,globalThink:C.thinkingMode===!0?"开":C.thinkingMode===!1?"关":"未设",globalTok:C.maxTokens||0,globalTemp:typeof C.temperature=="number"?C.temperature:null,modes:C.moduleModes||{},toks:C.moduleToks||{},temps:C.moduleTemps||{}}}),l=[{icon:"🌊",name:"本地流式（SSE）",on:!0,route:"chatJSON / chatStream / chatMessagesStream → chatStreamOnce",who:"全站绝大多数调用：出题/判卷/押题组卷/查重/格式修复/提取/教练/可视化…（注册表 43 条几乎全走这条）",facts:["body 带 stream:true + include_usage；响应头先到即算连接正常，30s 超时只管「连不上」，生成可跑几分钟（带图放宽 90s）","reasoning_content 双轨：思考流与正文分开回调（教练 💭 思考条 / 判卷思考区的数据源）","400 两级降级：先去 stream_options 再退极简非流式——不支持 SSE 的厂商自动兜底","chatJSON = 流式收完 → extractRobustJSON 六层容错提取"]},{icon:"📦",name:"本地非流式（rawChat）",on:!0,route:"AI.chat → rawChatOnce（整包 JSON 响应）",who:"仅广场一次性调用（shareAI）+ 任何请求 400 后的极简重试临时落到这条",facts:["30s 超时覆盖整个生成过程——长输出必死，这就是重任务全走流式的原因","思考决策只看显式 noThink + 全局开关（逐功能 moduleModes 在此不生效）","温度：决策链命中即发，未配置保持历史默认 0.6"]},{icon:"🧪",name:"AI 工程台（Python 工具循环）",on:D(()=>c.value.engEnabled),route:"toolsBridge 门卫 → toolChat 多轮循环；教练面板另走 newCoachSession 直连",who:"启用后 chat/chatStream/chatJSON 自动转多轮；教练/出题/验算/画图可自主调 Python",facts:['JSON 协议：模型输出 {"tool":"python_exec","code":…} → pyodide 真执行 → stdout/图表回传 → 下一轮；≤8 轮封顶','streamClass 分类器：工具轮/结构化 {"final":…} JSON 不上屏，最终回答轮流式喂 UI（思考流全程透传）',"教练 UI：打字机 + 💭 思考条 + 行级步骤卡（liveSteps 会话留存）","晚绑定 window.AiTools 防 core→extensions 循环依赖；未启用零差异"]},{icon:"☁️",name:"云端 runner（GitHub Actions）",on:!0,route:"CloudJob 提交 → ai-exam-runner.cjs（v31）→ secret gist 中转 → 收卷",who:"智能出卷（并行出题员/总审查/重写）、导入整卷、资料库整本提取（S0 探测→R1 书签→R2 页脚→R3/R4 目录→R4b 宫格→R5 兜底）",facts:["非流式一次性请求（自带 temperature 默认 0.7），跑在用户自己的 Actions 里，BYOK","断点续跑：每步落盘 gist status.json，崩溃从 checkpoint 恢复","收卷两段式：预览确认（逐题可修订）才入库——防幻觉的人工闸门","与本地链路完全独立：不占浏览器、可关页"]}],u=[{icon:"🚀",t:"① 模块发起",d:"chatStream / chatJSON / chatMessagesStream —— opts.ctx 自报身份（注册表见「调用注册表」页，CI 守门：新增 ctx 不注册→测试红）"},{icon:"🎛",t:"② 决策收口 normalizeOpts",d:"三链同构：单模块配置 > 调用方显式 > 全局默认 > 兜底。思考 resolveThink 五层 · maxTokens 四层 · 温度 resolveTemperature 四层（0~2，未配置=不干预）"},{icon:"🧠",t:"③ 提示词组装",d:"全局人格 / 模块指令 + 动态注入（记忆摘要 · 技能指令 · 识屏 PageCtx · 查询数据 · 用户参数）+ 共享片段（JSON_ONLY · SVG_DIAGRAM_SPEC）"},{icon:"🛠",t:"④ 传输",d:"缓存 cacheHash（命中即回，出题/教练类 cache:false 跳过）· toolsBridge 工程门卫 · withFailover 多接口故障切换 · SSE/非流式两通道"},{icon:"📥",t:"⑤ 解析与修复",d:"extractRobustJSON（围栏/括号配平/截断抢救）· repairJsonSafely · repairPipeLatex · 空正文三级降级（关思考→翻倍 token）"},{icon:"🖼",t:"⑥ 渲染终点",d:"结构化对象 → 模块状态 → 视图；文本 → Tex.renderInline → KaTeX 印刷体（.tx 1.21em 同标度兜底）→ 屏幕 main.css / 打印 txPrintCss+KaTeX 字体内嵌"}],f=[{icon:"🧠",name:"思考 resolveThink",chain:["单模块 moduleModes","显式 noThink/think","局部开关(卷 prefs/深度)","全局 thinkingMode","默认不思考"]},{icon:"📏",name:"maxTokens resolveMaxTokens",chain:["单模块 moduleToks","调用方显式","全局 s.ai.maxTokens","服务端默认"]},{icon:"🌡",name:"温度 resolveTemperature",chain:["单模块 moduleTemps","调用方显式","全局 s.ai.temperature","不干预(流式不发/非流式0.6)"]}],d=D(()=>{a.value;const j=c.value;return(K.AI_REGISTRY||[]).map(C=>{const I=[];j.modes[C.ctx]&&j.modes[C.ctx]!=="global"&&I.push("思考"+(j.modes[C.ctx]==="think"?"✓":"✗")),j.toks[C.ctx]&&I.push("tok"),typeof j.temps[C.ctx]=="number"&&I.push("temp");let J="",N="",F="";try{J=K.resolveThink({ctx:C.ctx})?"思考":"不思考"}catch{J="?"}try{const ne=K.resolveMaxTokens({ctx:C.ctx});N=ne>0?String(ne):"默认"}catch{N="?"}try{const ne=K.resolveTemperature({ctx:C.ctx});F=ne==null?"默认":String(ne)}catch{F="?"}return{ctx:C.ctx,name:C.name,desc:C.desc,def:C.def==="think"?"默认思考":C.def==="noThink"?"默认不思考":"跟随全局",think:J,tok:N,temp:F,ov:I}})}),m=D(()=>{const j=r.value.trim().toLowerCase(),C={};return d.value.forEach(I=>{if(j&&!(I.ctx+I.name+I.desc).toLowerCase().includes(j))return;const J=(K.AI_REGISTRY.find(N=>N.ctx===I.ctx)||{}).module||"其他";(C[J]=C[J]||[]).push(I)}),C}),p=D(()=>(K.AI_REGISTRY||[]).length),y=D(()=>d.value.filter(j=>j.ov.length).length),g=D(()=>{const j=c.value;return[{icon:"📥",t:"输入汇聚",d:"文本 Enter / 📷图片 / 📎附件 / 快捷问题 / 划词小牌；每条消息带最近 12 轮对话上下文"},{icon:"📍",t:"识屏 PageCtx",d:"DOM 直读当前页（≤40 条 × 400 字，超预算如实截断）：📍钉住每条都带；说「这道题/刚才」指代词自动带一次"},{icon:"🎯",t:"技能匹配 matchSkill",d:`PluginBus 技能库（当前 ${j.skillsN} 个）按触发词命中 → 技能指令注入 system；附件名也参与匹配`},{icon:"🧠",t:"systemPrompt 组装",d:`教练人格(coachProfile) + 当前专业课 + AiMemory 记忆摘要（已记住 ${j.memFacts} 条，AI 归纳 ${j.memAi}）+ 实时学习数据快照 + 动作协议（9 类接管工具）`},{icon:"🔀",t:"路由选择",d:j.engEnabled?"✅ 工程台已启用：newCoachSession 多轮 Python 循环（工具轮 JSON 屏弃、思考流+最终回答流式上屏、步骤卡留存）":"常规：agentLoop QUERY 多轮协议——教练输出 [[QUERY:]] → runQuery 本地查数据 → 回填继续（≤5 轮，无结果也逼回收口）"},{icon:"🌊",t:"流式传输",d:"SSE（cache:false 每次新鲜）；reasoning 与正文双轨回调"},{icon:"🖼",t:"渲染",d:"正文逐字打字机 + 💭 一行滚动思考条（点击展开完整思考流，会话级留存可回看）+ 动作按钮（低风险自动执行）+ 存为 Markdown"},{icon:"🧷",t:"后处理",d:"pushHistory(60 条) + 动作执行 + QUERY 结果回填历史 + reflectIfWorthy 值得才反思沉淀记忆 + 主动督学 superviseCheck（双时段节流，教练画像/全智能两档）"}]});function v(j,C,I,J){const N=[{icon:"🧩",t:"system 组装",d:C},{icon:"🎛",t:"决策收口 normalizeOpts",d:"思考/最大token/温度三链同构：单模块 > 显式 > 全局 > 兜底",live:j},{icon:"🛠",t:"传输",d:"缓存（命中即回；出题类 cache:false 跳过）· 工具桥门卫（工程模式自动转多轮 Python）· 故障切换链（多接口 30s）· 流式 SSE"}];return J&&N.splice(3,0,{icon:"🧪",t:"沙箱执行",d:J}),N.push({icon:"📥",t:"解析与修复",d:"extractRobustJSON（代码围栏/括号配平/截断抢救）→ repairJsonSafely → repairPipeLatex"}),N.push({icon:"🖼",t:"渲染终点",d:I}),N}function w(j){try{const C=K.resolveThink({ctx:j})?"思考":"不思考",I=K.resolveMaxTokens({ctx:j}),J=K.resolveTemperature({ctx:j});return"当前生效："+C+" · maxTokens "+(I>0?I:"服务端默认")+" · 温度 "+(J??"默认")}catch{return""}}const S={"global.coach":{system:"教练人格 systemPrompt：教练画像(settings.coachProfile) + activeMajorName + memoryDigest(400)",dest:"copilot 对话底座（被 copilot 层二次组合）"},"quiz.gen":{system:"quizPrompt：出题官 + 记忆摘要(memBlock) + 考点/层级/薄弱参数 + JSON_ONLY + SVG_DIAGRAM_SPEC(按需)",dest:"quiz 对象 → formatStem → Tex.renderInline → KaTeX（作答页）",extra:"工程模式：出题前先 python_exec 算准标准答案"},"quiz.answer":{system:"JUDGE_PROMPT：阅卷官 + JSON_ONLY + 题面/作答/标准答案",dest:"判分 JSON → steps 采分点渲染（作答页/复盘）"},"copilot.review":{system:"DEEP_REVIEW_PROMPT：复盘教练 + activeMajor",dest:"全景快照(reportText 打包) → 深度复盘结构化输出"},"copilot.chat":{system:"systemPrompt：教练人格 + activeMajor + memoryDigest(500) + 实时快照 snapshot + 动作协议",dest:"copilot 气泡打字机 + 💭思考条 → renderContent → Tex/KaTeX；动作 parseActions 自动执行",extra:"技能指令 matchSkill / QUERY 数据 runQuery / 识屏 PageCtx 注入"},"word.mnemonic":{system:"mnemonicSystem：词根/联想/考研考点/搭配/易混 五件套契约",dest:"patchWord(mnemonic) → 词卡 mnemonicHtml（复习翻面）"},"word.example":{system:"exampleSystem：考研语境例句 12-20 词 + 中文翻译",dest:"patchWord(example/exampleCn) → 复习页词卡"},"word.confuse":{system:"易混词契约：3 个近形/近义/同根干扰词",dest:"patchWord(confuseList) → 看义选词干扰项（choiceHtml）"},"insp.gen":{system:"genSystem：方法卡契约（recognize/steps/pitfalls/verify）+ 考点/题面/解析",dest:"normalizePlaybook → 方法卡库 + 带练闭环"},"sprint.latexfix":{system:"LATEX_FIX_SYS：LaTeX 质检员契约——只修语法禁改内容，字段级回传（stem/options 只回传改动）",dest:"逐题勾选确认弹窗 → 覆盖 stem/options → Store 落库"}};function O(j){const C=S[j.ctx];return C&&(j.dest=C.dest,j.pipe=v(j.ctx,C.system,C.dest,C.extra)),j}const M=[{name:"JSON_ONLY",desc:"JSON 输出纪律（出题/判卷/例句/易混词/方法卡/云端 questionSystem 复用同一份）",usedBy:["quiz.gen","quiz.answer","word.example","word.confuse","insp.gen","cloud.questionSystem"]},{name:"SVG_DIAGRAM_SPEC",desc:"SVG 画图规约（配图字段单源，改一处全站生效）",usedBy:["quiz.gen","dashboard 每日一题"]},{name:"TOOL 附录",desc:"python_exec 工具声明（本地 TOOL_APPENDIX / 云端 TOOL_APPENDIX）",usedBy:["工程出题","教练/私教工具会话","云端出题/重写/审查"]},{name:"streamClass 分类器",desc:"流式期 tool/final/hold 三态（bridge.toolChat 与 agent 会话共用，JSON 轮不裸上屏）",usedBy:["工程台全站","教练工程分支"]}];async function E(){n.value=!0;try{await Promise.all([Y(()=>import("./wordbook-eEe6LSnt.js"),[],import.meta.url),Y(()=>import("./copilot-CbyOhhe7.js"),[],import.meta.url),Y(()=>Promise.resolve().then(()=>Mm),void 0,import.meta.url)]),s.value=(K.globalPrompts()||[]).map(C=>O({name:C.name,ctx:C.id,text:String(C.text||"")}));const j=window;o.value=[{name:"单词 · 记忆口诀",ctx:"word.mnemonic",compose:"助记契约 + 示例词条参数",text:()=>j.WordbookModule.mnemonicSystem({word:"abandon",meaning:"放弃；抛弃"})},{name:"单词 · 语境例句",ctx:"word.example",compose:"例句契约 + 示例词条参数",text:()=>j.WordbookModule.exampleSystem()},{name:"单词 · 易混词干扰项",ctx:"word.confuse",compose:"易混词契约（3 个近形/近义/同根）",text:()=>j.WordbookModule.confuseSystem()},{name:"解题方法 · 方法卡 system",ctx:"insp.gen",compose:"方法卡契约 + 科目/考点/代表性题面",text:()=>j.MethodLink.genSystemPreview({subject:"math",topicName:"极限计算"})}].map(C=>{try{return O({name:C.name,ctx:C.ctx,text:String(C.text()),compose:C.compose})}catch(I){return{name:C.name,ctx:C.ctx,text:"",error:String(I.message||I)}}})}finally{n.value=!1}}jt(E);function L(){a.value++,E()}function R(j){const C=r.value.trim().toLowerCase();return C?j.filter(I=>(I.name+" "+I.ctx+" "+I.text).toLowerCase().includes(C)):j}const P=D(()=>R(s.value)),H=D(()=>R(o.value));async function B(j,C){try{await navigator.clipboard.writeText(j.text),i.value=C,setTimeout(()=>{i.value===C&&(i.value="")},1500)}catch{}}function z(j){r.value=j,t.value="list"}return(j,C)=>(_(),A("div",cd,[h("div",ld,[C[5]||(C[5]=h("span",{class:"card-title"},[te("🛰 AI 层链路可视化 "),h("span",{class:"muted-sm"},"（实时求值 · 非硬编码快照）")],-1)),h("button",{class:"btn btn-ghost btn-sm","data-testid":"ps-refresh",disabled:n.value,onClick:L},"↻ 刷新实时值",8,ud)]),h("div",dd,[h("span",{class:re(["chip",c.value.configured?"chip-ok":"chip-warn"])},"🔌 "+T(c.value.configured?(c.value.apiName||"当前接口")+" · "+c.value.apiModel:"未配置接口"),3),h("span",fd,"备用链 "+T(c.value.apisN)+" 个",1),h("span",pd,"🌐 全局思考："+T(c.value.globalThink),1),h("span",hd,"📏 全局 maxTokens："+T(c.value.globalTok||"服务端默认"),1),h("span",gd,"🌡 全局温度："+T(c.value.globalTemp==null?"不干预":c.value.globalTemp),1),h("span",md,"🗂 缓存 "+T(c.value.cacheEntries)+" 条 · 命中 "+T(c.value.cacheHits)+" 次 · "+T(c.value.cacheKb)+"KB",1),h("span",yd,"🧠 记忆 "+T(c.value.memFacts)+" 条（置顶 "+T(c.value.memPinned)+"）",1),h("span",vd,"🎓 教练会话 "+T(c.value.chatsN)+" 条 · 技能 "+T(c.value.skillsN)+" 个",1),h("span",{class:re(["chip",c.value.engEnabled?"chip-ok":""])},"🧪 工程台 "+T(c.value.engEnabled?c.value.engReady?"已启用·就绪":"已启用·未加载":"未启用"),3)]),h("div",bd,[h("div",wd,[h("button",{class:re(["seg",t.value==="map"?"seg-on":""]),"data-testid":"ps-tab-map",onClick:C[0]||(C[0]=I=>t.value="map")},"🗺 链路全景",2),h("button",{class:re(["seg",t.value==="registry"?"seg-on":""]),"data-testid":"ps-tab-registry",onClick:C[1]||(C[1]=I=>t.value="registry")},"📋 调用注册表",2),h("button",{class:re(["seg",t.value==="coach"?"seg-on":""]),"data-testid":"ps-tab-coach",onClick:C[2]||(C[2]=I=>t.value="coach")},"🎓 教练机制",2),h("button",{class:re(["seg",t.value==="list"?"seg-on":""]),"data-testid":"ps-tab-list",onClick:C[3]||(C[3]=I=>t.value="list")},"📜 提示词清单",2)]),rt(h("input",{"onUpdate:modelValue":C[4]||(C[4]=I=>r.value=I),class:"input",placeholder:t.value==="registry"?"🔍 搜索 ctx / 功能名…":"🔍 搜索名称 / ctx / 提示词内容…","data-testid":"ps-q",style:{flex:"1","min-width":"180px"}},null,8,kd),[[Ft,r.value]])]),t.value==="map"?(_(),A(U,{key:0},[h("div",xd,[C[7]||(C[7]=h("div",{class:"card-title"},"四条传输通道（谁走哪条、为什么）",-1)),(_(),A(U,null,X(l,(I,J)=>h("div",{key:J,class:re(["ps-lane",{dim:I.on===!1}])},[h("div",Sd,[h("span",_d,T(I.icon),1),h("b",Ad,T(I.name),1),h("code",Td,T(I.route),1),I.on===!1?(_(),A("span",Ed,"当前未启用")):V("",!0)]),h("div",Od,[C[6]||(C[6]=h("b",null,"谁在用：",-1)),te(T(I.who),1)]),h("ul",Id,[(_(!0),A(U,null,X(I.facts,(N,F)=>(_(),A("li",{key:F},T(N),1))),128))])],2)),64))]),h("div",Md,[C[8]||(C[8]=h("div",{class:"card-title"},"一次 AI 调用的六层旅程",-1)),(_(),A(U,null,X(u,(I,J)=>h("div",{key:J,style:{display:"flex",gap:"10px","align-items":"flex-start",margin:"8px 0"}},[h("div",Pd,T(I.icon),1),h("div",Cd,[h("b",Nd,T(I.t),1),h("div",Ld,T(I.d),1)])])),64))]),h("div",jd,[C[9]||(C[9]=h("div",{class:"card-title"},"三条决策链（同构：单模块 > 调用方显式 > 全局 > 兜底）",-1)),(_(),A(U,null,X(f,I=>h("div",{key:I.name,style:{display:"flex","align-items":"center",gap:"6px","flex-wrap":"wrap",margin:"8px 0"}},[h("b",Dd,T(I.icon)+" "+T(I.name),1),(_(!0),A(U,null,X(I.chain,(J,N)=>(_(),A(U,{key:N},[h("span",qd,T(J),1),N<I.chain.length-1?(_(),A("span",Bd,"›")):V("",!0)],64))),128))])),64)),C[10]||(C[10]=h("div",{class:"muted-sm",style:{"font-size":"11.5px"}},"逐功能的当前生效值见「📋 调用注册表」；配置入口：设置 → ⚙️ AI 参数配置中心。",-1))]),h("div",Rd,[C[11]||(C[11]=h("div",{class:"card-title"},"🧾 共享片段使用关系（单源契约，改一处全站生效）",-1)),(_(),A(U,null,X(M,I=>h("div",{key:I.name,style:{border:"1px solid var(--line)","border-radius":"8px",padding:"8px 10px",margin:"6px 0"}},[h("b",Jd,T(I.name),1),h("div",Hd,T(I.desc),1),(_(!0),A(U,null,X(I.usedBy,J=>(_(),A("span",{key:J,class:"chip",style:{"font-size":"11px",margin:"2px 4px 2px 0"}},T(J),1))),128))])),64))])],64)):t.value==="registry"?(_(),A("div",Gd,[h("div",zd,[C[12]||(C[12]=h("span",{class:"card-title"},"全量 ctx × 当前实时生效",-1)),h("span",$d,T(p.value)+" 个注册功能 · "+T(y.value)+" 个有逐功能覆盖 · 传输默认走 🌊SSE（例外见全景页）",1)]),(_(!0),A(U,null,X(m.value,(I,J)=>(_(),A(U,{key:J},[h("div",Ud,T(J),1),(_(!0),A(U,null,X(I,N=>(_(),A("div",{key:N.ctx,class:"ps-reg-row"},[h("div",Fd,[h("b",Kd,T(N.name),1),h("code",Vd,T(N.ctx),1),h("div",Qd,T(N.desc),1)]),h("span",Wd,T(N.def),1),h("span",{class:re(["chip",N.think==="思考"?"chip-think":""]),style:{"font-size":"11px",flex:"none"}},"现·"+T(N.think),3),h("span",Xd,"tok "+T(N.tok),1),h("span",Yd,"温 "+T(N.temp),1),(_(!0),A(U,null,X(N.ov,F=>(_(),A("span",{key:F,class:"chip chip-ov",style:{"font-size":"10px",flex:"none"}},T(F),1))),128)),h("button",{class:"btn btn-ghost btn-sm",style:{flex:"none","font-size":"11px"},onClick:F=>z(N.ctx)},"📜",8,Zd)]))),128))],64))),128)),Object.keys(m.value).length?V("",!0):(_(),A("div",ef,"无匹配项"))])):t.value==="coach"?(_(),A(U,{key:2},[h("div",tf,[C[13]||(C[13]=h("div",{class:"card-title"},"教练一句话的全旅程（含工程台分支）",-1)),(_(!0),A(U,null,X(g.value,(I,J)=>(_(),A("div",{key:J,style:{display:"flex",gap:"10px","align-items":"flex-start",margin:"9px 0"}},[h("div",nf,T(I.icon),1),h("div",rf,[h("b",sf,T(J+1)+". "+T(I.t),1),h("div",of,T(I.d),1)])]))),128))]),h("div",af,[C[17]||(C[17]=h("div",{class:"card-title"},"教练专属设施速查",-1)),h("div",cf,[C[14]||(C[14]=te(" · 记忆：",-1)),C[15]||(C[15]=h("b",null,"AiMemory",-1)),te("（事实库 ≤120 条 / 画像 / 反思沉淀 reflectIfWorthy / 整理 memoryDigest）——当前 "+T(c.value.memFacts)+" 条",1),C[16]||(C[16]=Ja("<br data-v-8113e10b> · 识屏：<b data-v-8113e10b>PageCtx</b>（DOM 直读 ≤40 条 × 400 字 + 9000 字总预算截断如实告知）+ 指代词自动附带<br data-v-8113e10b> · 动作：<b data-v-8113e10b>parseActions</b> 9 类接管工具（跳转/加任务/打卡/改排程…），低风险 auto 执行、可撤销<br data-v-8113e10b> · 查询：<b data-v-8113e10b>[[QUERY:]]</b> 协议 → runQuery 本地数据 → 回填同轮继续（agentLoop ≤5 轮）<br data-v-8113e10b> · 渲染：<b data-v-8113e10b>makeStreamView</b> 打字机 + 💭 思考条（liveThink 会话留存可回看）+ 步骤卡（liveSteps）<br data-v-8113e10b> · 主动：开场白（每日一次）/ 督学 superviseCheck（双时段）/ pushAssistant（关键事件关怀） ",18))])])],64)):n.value?V("",!0):(_(),A(U,{key:3},[h("div",lf,[h("div",uf,[C[18]||(C[18]=h("span",{class:"card-title"},"🌐 注册表提示词",-1)),h("span",df,"core/ai.ts 单源 + 模块自注册 · "+T(P.value.length)+" 条",1)]),(_(!0),A(U,null,X(P.value,I=>(_(),A("div",{key:I.ctx,style:{border:"1px solid var(--line)","border-radius":"8px",padding:"8px 10px",margin:"6px 0"}},[h("div",ff,[h("b",pf,T(I.name),1),h("span",hf,"ctx:"+T(I.ctx),1),h("span",gf,T(I.text.length)+" 字",1),h("button",{class:"btn btn-ghost btn-sm",style:{"margin-left":"auto"},onClick:J=>B(I,I.ctx)},T(i.value===I.ctx?"✓ 已复制":"📋 复制"),9,mf)]),h("pre",yf,T(I.text),1),I.pipe?(_(),A("div",vf,[(_(!0),A(U,null,X(I.pipe,(J,N)=>(_(),A("div",{key:N,style:{display:"flex",gap:"6px","font-size":"11.5px",margin:"3px 0"}},[h("span",bf,T(J.icon),1),h("b",wf,T(J.t),1),h("span",kf,T(J.live?w(J.live):J.d),1)]))),128))])):V("",!0)]))),128)),P.value.length?V("",!0):(_(),A("div",xf,"无匹配项"))]),h("div",Sf,[h("div",_f,[C[19]||(C[19]=h("span",{class:"card-title"},"🧩 模块指令层",-1)),h("span",Af,"window 门面实时构造 · 示例参数 · "+T(H.value.length)+" 条",1)]),(_(!0),A(U,null,X(H.value,I=>(_(),A("div",{key:I.ctx,style:{border:"1px solid var(--line)","border-radius":"8px",padding:"8px 10px",margin:"6px 0"}},[h("div",Tf,[h("b",Ef,T(I.name),1),h("span",Of,"ctx:"+T(I.ctx),1),I.compose?(_(),A("span",If,T(I.compose),1)):V("",!0),h("span",Mf,T(I.text.length)+" 字",1),h("button",{class:"btn btn-ghost btn-sm",style:{"margin-left":"auto"},onClick:J=>B(I,I.ctx)},T(i.value===I.ctx?"✓ 已复制":"📋 复制"),9,Pf)]),I.error?(_(),A("div",Nf,"求值失败："+T(I.error),1)):(_(),A("pre",Cf,T(I.text),1)),I.pipe?(_(),A("div",Lf,[(_(!0),A(U,null,X(I.pipe,(J,N)=>(_(),A("div",{key:N,style:{display:"flex",gap:"6px","font-size":"11.5px",margin:"3px 0"}},[h("span",jf,T(J.icon),1),h("b",Df,T(J.t),1),h("span",qf,T(J.live?w(J.live):J.d),1)]))),128))])):V("",!0)]))),128)),H.value.length?V("",!0):(_(),A("div",Bf,"无匹配项"))])],64))]))}}),ze=(e,t)=>{const n=e.__vccOpts||e;for(const[r,s]of t)n[r]=s;return n},Jf=ze(Rf,[["__scopeId","data-v-8113e10b"]]);function Hf(){const e=b.get(),t=x.dkey(),n=new Date;if((n.getMonth()+1)*100+n.getDate()>=1101&&!e.milestones.octMath&&e.alerts.lastNovPush!==t){b.update(a=>{a.alerts.lastNovPush=t}),xe.open({title:"⚔️ 院校决策提醒",html:"<p>已到11月，「数学真题模拟≥120分」里程磊尚未勾选。</p><p><b>请立即根据数学成绩决定冲上大还是守河工大。</b>报名窗口不等人，用数据说话，不能凭感觉。</p>",actions:[{label:"去决策参谋",kind:"btn-primary",onClick:a=>{a(),window.App.go("decision")}},{label:"稍后",kind:"btn-ghost"}]});return}const s=b.usageBytes()/(5*1024*1024),o=e.meta.lastBackupReminder||"",i=o?(Date.now()-new Date(o).getTime())/x.DAY_MS:999;(s>.6||i>7)&&e.alerts.lastBakWarn!==t&&(b.update(a=>{a.alerts.lastBakWarn=t}),Q.warn("💾 已"+Math.floor(i)+"天未导出备份。数据只存在浏览器，建议立即导出（设置 → 导出JSON备份）。"))}function Gf(){const e=b.get(),t=new Date,n=(t.getMonth()+1)*100+t.getDate(),r=[];return n>=1101&&!e.milestones.octMath&&r.push(`<div class="alert alert-danger">⚔️ 11月已到而数学模拟里程磊未达成：<a href="javascript:App.go('decision')">立即去决策参谋定院 →</a></div>`),b.mistakeCountWeek("sign")>3&&r.push('<div class="alert alert-warn">✍️ 本周符号错误 '+b.mistakeCountWeek("sign")+" 次 &gt; 3次：智能排程已强制插入符号专项。</div>"),r.join("")}const As={runDailyChecks:Hf,bannerHtml:Gf},zf={class:"stats-row"},$f={class:"stat-top"},Uf={class:"stat-label"},Ff={class:"stat-num"},Kf={class:"stat-den"},Vf={class:"stat-bar"},Qf={class:"stat-foot"},Wf=de({__name:"StatsRow",setup(e){const t=D(()=>b.todayTaskStats()),n=[{k:"math",ico:"📐"},{k:"ctrl",ico:"🎛"},{k:"eng",ico:"📖"},{k:"pol",ico:"🏛"}],r=D(()=>n.map(s=>{const o=ee.SUBJECTS[s.k],[i,a]=t.value[s.k]||[0,0];return{k:s.k,ico:s.ico,short:o.short,color:o.color,d:i,t:a,done:a>0&&i===a,pct:a>0?Math.round(i/a*100):0,remain:a-i}}));return(s,o)=>(_(),A("div",zf,[(_(!0),A(U,null,X(r.value,i=>(_(),A("div",{key:i.k,class:re(["stat-tile",{"stat-done":i.done}])},[h("div",$f,[h("span",Uf,T(i.short),1),h("span",{class:"stat-badge",style:Xe({background:`color-mix(in srgb, ${i.color} 14%, transparent)`,color:i.color})},T(i.ico),5)]),h("div",Ff,[h("b",null,T(i.d),1),h("span",Kf,"/"+T(i.t),1)]),h("div",Vf,[h("div",{class:"stat-bar-fill",style:Xe({width:i.pct+"%",background:i.color})},null,4)]),h("div",Qf,T(i.done?"已清空 ✓":i.t===0?"今日无任务":"还差 "+i.remain+" 项"),1)],2))),128))]))}}),Xf=ze(Wf,[["__scopeId","data-v-9fd1365c"]]),Yf={key:0,class:"dsh-head"},Zf={key:1,class:"dsh-title"},ep={class:"dsh-head-extra"},tp={class:"dsh-head-actions"},np=de({__name:"DashCard",props:{icon:{default:""},title:{default:""},tint:{default:""},dense:{type:Boolean,default:!1}},setup(e){return(t,n)=>(_(),A("section",{class:re(["dsh-card",{"dsh-dense":e.dense}])},[e.title||t.$slots.actions||t.$slots.extra?(_(),A("header",Yf,[e.icon?(_(),A("span",{key:0,class:re(["dsh-badge",e.tint?"tint-"+e.tint:""])},T(e.icon),3)):V("",!0),e.title?(_(),A("h2",Zf,T(e.title),1)):V("",!0),n[0]||(n[0]=h("span",{class:"dsh-head-spacer"},null,-1)),h("div",ep,[rr(t.$slots,"extra",{},void 0)]),h("div",tp,[rr(t.$slots,"actions",{},void 0)])])):V("",!0),rr(t.$slots,"default",{},void 0)],2))}}),Ze=ze(np,[["__scopeId","data-v-06402b0e"]]),Br=[0,1,2,4,7,15];function rp(e,t){const n=t||Br,r=Math.max(1,Math.min(n.length-1,e||1));return n[r]!=null?n[r]:1}const Ct={BOX_DAYS:Br,maxBox(e){return(e||Br).length-1},dueKey(e,t){t=t||{};const n=t.from?new Date(t.from):new Date;return n.setDate(n.getDate()+rp(e,t.boxDays)),x.dkey(n)},isDue(e,t){if(t=t||{},!e)return!0;if(t.includeMastered===!1&&(e.box||1)>=Ct.maxBox(t.boxDays))return!1;const n=t.today||x.dkey();return!e.due||e.due<=n},grade(e,t,n){n=n||{};const r=Ct.maxBox(n.boxDays);let s=e&&e.box||1;return s=t?Math.min(r,s+1):1,{box:s,due:Ct.dueKey(s,n)}}},De=()=>window;function sp(e){if(!e)return"";var t=e.replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");return t=t.replace(/(?<!\*)\*([^*<]+?)\*(?!\*)/g,"<i>$1</i>"),t}function en(e){if(!e)return"";try{return sp(Qe.renderInline(e).replace(/\n/g,"<br>"))}catch{}return x.esc(e).replace(/\n/g,"<br>")}function Ri(e){var t=[1,3,7,15],n=[];function r(c,l){(c||[]).forEach(function(u){if(u.reviewPlan)for(var f=Math.floor((Date.parse(x.dkey())-Date.parse(u.reviewPlan.start))/x.DAY_MS),d=0;d<t.length;d++){var m=t[d];if(f>=m&&!(u.reviewPlan.done&&u.reviewPlan.done["d"+m])){n.push({id:u.id,kind:l,stage:m,text:(l==="photo"?u.painPoint||u.extractedQuestion||u.note||"一道拍题错题":u.desc||"一条错题").slice(0,18)});break}}})}r(e.mistakes,"mistake"),r(e.mistakePhotos,"photo"),(e.polRecite||[]).forEach(function(c){Ct.isDue(c,{includeMastered:!1})&&n.push({id:c.id,kind:"pol",stage:0,text:(c.topic||"一道政治大题").slice(0,18)})});var s=e.reading&&e.reading.cards||{},o=0;(e.reading&&e.reading.customVocab||[]).concat(ee.VOCAB).forEach(function(c){Ct.isDue(s[c.w])&&o++}),o>0&&n.push({id:"reading-today",kind:"reading",stage:0,text:"熟词僻义 "+o+" 张到期"});var i=De().WordbookModule;if(i&&i.dueCount){var a=i.dueCount();a>0&&n.push({id:"vocab-today",kind:"vocab",stage:0,text:"单词 "+a+" 个待学（含新词）"})}return n}let Vt=!1;const tn=se("");function op(){var e=new Date().getHours();return e<6?"🌙 夜深了":e<9?"🌅 早上好":e<12?"☀️ 上午好":e<14?"🍚 中午好":e<18?"⛅ 下午好":"🌆 晚上好"}function ip(e){var t=x.daysTo(e.settings.examDate),n=b.todayTaskStats(),r=0,s=0;Object.keys(n).forEach(function(d){r+=n[d][0],s+=n[d][1]});var o=x.dkey(new Date(Date.now()-x.DAY_MS)),i=(e.taskArchive||{})[o]||[],a=i.filter(function(d){return d.done}).length,c=b.studyStreak(),l=[];l.push("距考试还有 <b>"+t+"</b> 天"+(c>=2?"，已连续作战 <b>"+c+"</b> 天":"")+"。"),i.length&&l.push("昨日完成 "+a+"/"+i.length+(a===i.length&&i.length>0?"，干净利落。":a/i.length<.6?"，欠债要还。":"，还差一点。")),s>0&&l.push("今日 "+s+" 项任务已就位"+(r>0?"，已清 "+r+" 项":"")+"。");var u=b.mistakeCountWeek("sign");u>=3&&l.push("⚠️ 本周符号错误 "+u+" 次，做题时强制末步验算。");var f=b.currentMathAccuracy();return f!=null&&f<70&&l.push("⚠️ 数学正确率 "+f+"% 低于安全线，先补概念再刷量。"),l.join("<br>")}function ap(){var e="专业课";try{e=ee.getActiveMajor().name||"专业课"}catch{}var t=K.memoryDigest(400);return"你是严厉的2026考研教练，正在为考生（专业课："+e+"）写「今日简报」。"+(t?`
`+t+`
`:"")+'要求：1) 三段式——一句话定调（结合时段与数据）→ 今日最关键的3个重点（具体到科目章节动作）→ 一句狠话收尾；2) 全文130-200字，用换行分段，不要标题不要列表符号；3) 直接犀利不灌鸡汤；4) 引用数据要自然（"昨天你只学了3h"），禁止罗列；5) 简体中文。'}function cp(){var e=b.get(),t=x.dkey(),n=b.todayTaskStats(),r=0,s=0,o=[];Object.keys(n).forEach(function(d){r+=n[d][0],s+=n[d][1]});var i=e.completions[t]||[];e.tasks.forEach(function(d){!d.done&&i.indexOf(d.id)<0&&o.push(ee.SUBJECTS[d.subject].short+"·"+d.text)});var a=x.dkey(new Date(Date.now()-x.DAY_MS)),c=(e.taskArchive||{})[a]||[],l=c.filter(function(d){return d.done}).length,u=b.currentMathAccuracy(),f=new Date().getHours();return"现在是"+t+" "+f+"点。距考试"+x.daysTo(e.settings.examDate)+`天。
昨日：完成 `+l+"/"+c.length+" 任务，学习 "+(e.studyHours[a]||0)+`h。
今日：任务 `+r+"/"+s+"，未完成清单："+(o.slice(0,6).join("；")||"无")+`
本周：日均 `+x.round1(x.sum(b.weekHours())/7)+"h（目标"+x.round1((e.settings.weeklyTargetHours||50)/7)+"h），符号错误 "+b.mistakeCountWeek("sign")+" 次，数学正确率 "+(u!=null?u+"%":"未录入")+"。"}function lp(){var e=b.get(),t=x.dkey();K.configured()&&e.ai.briefAuto!==!1&&(e.dailyBrief&&e.dailyBrief.date===t||Vt||Ji())}function Ji(){Vt||K.configured()&&(Vt=!0,tn.value="",K.chatStream(ap(),cp(),function(e){tn.value=e||""}).then(function(e){Vt=!1;var t=(e||"").trim();if(t)b.update(function(n){n.dailyBrief={date:x.dkey(),content:t.slice(0,1200),generatedAt:new Date().toISOString()}}),De().AiMemory&&De().AiMemory.recordEvent("查看今日简报");else throw new Error("empty")}).catch(function(e){Vt=!1,tn.value="",b.update(function(t){t.dailyBrief={date:x.dkey(),failed:!0,error:e&&e.message||"生成失败"}})}))}let hr=!1;const wn=se("auto");function up(){var e=b.get(),t=x.dkey();K.configured()&&(e.dailyQuiz&&e.dailyQuiz.date===t||hr||(hr=!0,Hi(!1,function(){hr=!1})))}function Hi(e,t,n){if(!K.configured()){t&&t();return}var r=x.dkey(),s=n||"auto",o=s!=="auto"?s:null,i=b.get(),a=i.settings&&i.settings.examConfig||{},c=a.profName||"自控原理",l=i.weaknessProfile,u=i.mistakePhotos||[],f=u.filter(function(E){return E.painPoint&&E.painPoint.trim()}).map(function(E){return E.painPoint.trim()}).slice(-15),d=u.filter(function(E){return(E.extractedQuestion||E.note||"").trim()}).slice(-6).map(function(E){return(E.extractedQuestion||E.note).trim().slice(0,50)}),m=[];if(o){var p=ee.SUBJECTS[o]&&ee.SUBJECTS[o].name||o;m.push("本次请**聚焦科目「"+p+"」**出题（不要出其它科目的题）。")}l&&l.weakAreas&&l.weakAreas.length&&m.push("考生薄弱点画像关键词："+l.weakAreas.join("、")),f.length&&m.push("近期疑难点标签："+f.join("、")),d.length&&m.push(`部分错题题干样例：
- `+d.join(`
- `));var y=i.heat||{},g=o?[o]:["math","ctrl","eng","pol"],v=[];g.forEach(function(E){var L=ee.TOPICS[E]||[];L.forEach(function(R){var P=y[R.id];P&&P.level!==void 0&&P.level<=1&&v.push((ee.SUBJECTS[E]?ee.SUBJECTS[E].name:E)+"·"+R.name+(P.level===0?"(🔴未掌握)":"(🟡薄弱)"))})}),v.length&&m.push(`热力图薄弱考点（需重点突破）：
- `+v.join(`
- `));var w=m.length?m.join(`
`):"（暂无错题/热力图记录，请基于该考生专业课「"+c+"」常见易错点出题）",S=o?"本题必须属于科目「"+(ee.SUBJECTS[o]&&ee.SUBJECTS[o].name||o)+'」，输出 JSON 时 "subject" 字段固定填 "'+o+'"。':'输出 JSON 时 "subject" 字段填该题目实际所属科目（math|ctrl|eng|pol）。',O="你是考研出题官，熟悉「"+c+"」及数学公共课的命题。根据考生的薄弱点画像与近期错题，出一道**针对性练习题**（聚焦其真正薄弱的考点，难度贴合真题）。"+S+'输出严格 JSON（不要 markdown、不要多余文字）：{"subject":"math|ctrl|eng|pol（该题目所属科目）","question":"完整题干（数学表达式用 LaTeX 如 \\frac{a}{b}、\\sqrt{x}、x^{2}、\\int、\\sum）","solution":"详细解答步骤（分步，含关键公式推导，LaTeX 格式）","trap":"本题最易踩的坑（与考生薄弱点对应）",'+K.SVG_DIAGRAM_SPEC+'"}要求：question 必须可独立作答；solution 自洽；trap 要点中考生该补的短板；diagram 仅辅助可留空。',M=w+`

请出今日针对性练习一题。`;K.chatStream(O,M,null,null,{cache:!1}).then(function(E){var L=dp(E);if(!L||!L.question){var R=E.replace(/```\w*\s*/g,"").replace(/```/g,"").replace(/^\s*[\{\[]/,"").replace(/[\}\]]\s*$/,"").replace(/^\s*"subject"\s*:\s*"[^"]*",?\s*/i,"").replace(/^\s*"question"\s*:\s*"/i,"").replace(/",\s*solution"\s*:.*/s,"");R=R.trim().replace(/\n+$/,""),L={subject:o||"math",question:R||E,solution:"",trap:"",diagram:""}}b.update(function(P){var H=P.dailyQuiz;H&&H.question&&(P.dailyQuizHistory=P.dailyQuizHistory||[],P.dailyQuizHistory.push(H),P.dailyQuizHistory.length>30&&(P.dailyQuizHistory=P.dailyQuizHistory.slice(-30))),P.dailyQuiz={date:r,subject:o||L.subject||"math",question:L.question||"",solution:L.solution||"",trap:L.trap||"",diagram:L.diagram||"",generatedAt:new Date().toISOString()}}),t&&t()}).catch(function(E){console.warn("[Dashboard] 每日一题生成失败:",E&&E.message),b.update(function(L){L.dailyQuiz={date:r,failed:!0,error:E&&E.message||String(E||"未知错误"),generatedAt:new Date().toISOString()}}),t&&t()})}function gr(e){var t=JSON.parse(e);if(t&&typeof t=="object"&&t.hasOwnProperty("diagram")){var n=t.diagram;t.diagram="",t=Qe.repairMangledLatex(t),t.diagram=n}else t=Qe.repairMangledLatex(t);return t}function dp(e){var t=(e||"").trim(),n=t.match(/```(?:json)?\s*([\s\S]*?)```/);if(n)try{return gr(n[1].trim())}catch{}var r=t.indexOf("{");if(r===-1)return null;for(var s=0,o=!1,i=!1,a=-1,c=r;c<t.length;c++){var l=t.charAt(c);if(i){i=!1;continue}if(l==="\\"){i=!0;continue}if(l==='"'){o=!o;continue}if(!o){if(l==="{")s++;else if(l==="}"&&(s--,s===0)){a=c+1;break}}}if(a<=r)return null;var u=t.slice(r,a);try{return gr(u)}catch{}try{return gr(K.repairJsonSafely(u))}catch{}var f={},d=[["subject",/"subject"\s*:\s*"([^"]*)"/],["question",/"question"\s*:\s*"((?:[^"\\]|\\.)*)"/],["solution",/"solution"\s*:\s*"((?:[^"\\]|\\.)*)"/],["trap",/"trap"\s*:\s*"((?:[^"\\]|\\.)*)"/]];return d.push(["subject",/"subject"\s*:\s*(\w+)/]),d.forEach(function(m){var p=e.match(m[1]);p&&(f[m[0]]=p[1].replace(/\\n/g,`
`).replace(/\\t/g,"	"))}),f.question?Qe.repairMangledLatex(f):null}function mo(){b.update(function(e){e.dailyQuiz&&(e.dailyQuiz.revealed=!0)})}function yo(e){var t=b.get().dailyQuiz;if(e)b.update(function(r){if(r.dailyQuiz&&(r.dailyQuiz.selfEval="known"),t&&t.subject&&ee.TOPICS[t.subject]){var s=new Date().toISOString();(ee.TOPICS[t.subject]||[]).forEach(function(o){o.tier===1&&(r.heat=r.heat||{},r.heat[o.id]={level:2,score:85,updatedAt:s})})}}),b.recomputeMathAccuracy(),De().Toast&&De().Toast.success("✓ 拿下。明天继续。");else{var n=(t||{}).question||"";b.update(function(r){if(r.dailyQuiz&&(r.dailyQuiz.selfEval="unknown"),r.mistakes.push({id:x.uid(),subject:r.dailyQuiz.subject||"math",type:"concept",desc:"【每日一题】未掌握："+n.slice(0,40),stem:n||"",source:"daily",dedupKey:"dq:"+x.shortDate(),date:x.shortDate(),createdAt:new Date().toISOString()}),t&&t.subject&&ee.TOPICS[t.subject]){var s=new Date().toISOString();(ee.TOPICS[t.subject]||[]).forEach(function(o){if(o.tier===1){r.heat=r.heat||{};var i=r.heat[o.id];r.heat[o.id]={level:0,score:i&&i.score!==void 0?Math.min(i.score,30):30,updatedAt:s}}})}}),b.recomputeMathAccuracy(),De().AiMemory&&De().AiMemory.recordEvent("每日一题自评「还不会」",n.slice(0,40)),De().Copilot&&De().Copilot.isOpen&&De().Copilot.pushAssistant("这题还不会，已帮你记下。周末集中清账，别让它过夜。"),De().Toast&&De().Toast.show("已记入错题本。周末清账，别攒着。","warn")}}const fp={class:"muted-sm"},pp=["innerHTML"],hp={class:"brief-foot"},gp={key:1,class:"brief-body"},mp=["innerHTML"],yp=["innerHTML"],vp={key:0,class:"muted-sm brief-note"},bp={key:1,class:"muted-sm brief-note"},wp=de({__name:"BriefCard",setup(e){const t=x.dkey(),n=D(()=>b.get().dailyBrief),r=D(()=>K.configured()),s=D(()=>n.value&&n.value.date===t&&n.value.content),o=D(()=>n.value&&n.value.date===t&&n.value.failed),i=D(()=>K.configured()&&b.get().ai.briefAuto!==!1),a=D(()=>i.value&&!s.value&&!o.value),c=D(()=>a.value&&!tn.value),l=op(),u=t.slice(5).replace("-","."),f=D(()=>s.value?en(n.value.content):""),d=D(()=>en(tn.value)),m=D(()=>ip(b.get()));function p(){b.update(y=>{y.dailyBrief=null}),Ji()}return(y,g)=>(_(),Ve(Ze,{icon:"📰",title:"今日简报",tint:"blue",class:"dash-brief"},{extra:ge(()=>[h("span",fp,T(W(l))+" · "+T(W(u)),1)]),default:ge(()=>[s.value?(_(),A(U,{key:0},[h("div",{class:"brief-body",innerHTML:f.value},null,8,pp),h("div",hp,[g[0]||(g[0]=h("span",{class:"muted-sm"},"🧠 结合你的记忆与数据生成",-1)),r.value?(_(),A("button",{key:0,class:"link-btn",onClick:p},"🔄 换一版")):V("",!0)])],64)):a.value?(_(),A("div",gp,[c.value?(_(),A(U,{key:0},[g[1]||(g[1]=h("div",{class:"skl-line"},null,-1)),g[2]||(g[2]=h("div",{class:"skl-line"},null,-1)),g[3]||(g[3]=h("div",{class:"skl-line skl-w60"},null,-1))],64)):(_(),A(U,{key:1},[h("span",{innerHTML:d.value},null,8,mp),g[4]||(g[4]=h("span",{class:"ai-cursor"},null,-1))],64))])):(_(),A(U,{key:2},[h("div",{class:"brief-body",innerHTML:m.value},null,8,yp),o.value?(_(),A("div",vp,[te(" ⚠️ AI 简报生成失败（"+T(String(n.value.error||"").slice(0,40))+"） ",1),h("button",{class:"link-btn",onClick:p},"🔄 重试")])):r.value?V("",!0):(_(),A("div",bp,"配置 AI 后，这里会变成真正懂你的每日简报 →"))],64))]),_:1}))}}),kp=ze(wp,[["__scopeId","data-v-17a6feac"]]);function xp(e){if(!e)return{lang:"",code:""};e=String(e).trim();let t=e.match(/^```(\w*)\s*([\s\S]*?)```$/i);return t?{lang:(t[1]||"").toLowerCase(),code:t[2].trim()}:(t=e.match(/```(\w*)\s*\n([\s\S]*?)```/),t?{lang:(t[1]||"").toLowerCase(),code:t[2].trim()}:{lang:"",code:e})}function Gi(e){let t=String(e);/xmlns=/.test(t)||(t=t.replace(/<svg/i,'<svg xmlns="http://www.w3.org/2000/svg"'));let n;try{n=new DOMParser().parseFromString(t,"image/svg+xml")}catch{return null}if(!n||n.getElementsByTagName("parsererror").length)return null;const r=n.documentElement;if(!r||r.nodeName.toLowerCase()!=="svg")return null;const s=r.querySelectorAll("script, foreignObject, iframe, object, embed, link, meta");for(let i=0;i<s.length;i++)s[i].parentNode&&s[i].parentNode.removeChild(s[i]);const o=[r].concat(Array.prototype.slice.call(r.getElementsByTagName("*")));for(let i=0;i<o.length;i++){const a=o[i];for(let c=a.attributes.length-1;c>=0;c--){const l=a.attributes[c].name,u=a.attributes[c].value||"";(/^on/i.test(l)||/^(xlink:)?href$/i.test(l)&&/^\s*javascript:/i.test(u)||l.toLowerCase()==="style"&&/javascript:|expression\s*\(/i.test(u))&&a.removeAttribute(l)}}return r.getAttribute("viewBox")?(r.removeAttribute("width"),r.removeAttribute("height"),r.setAttribute("width","100%"),r.getAttribute("preserveAspectRatio")||r.setAttribute("preserveAspectRatio","xMidYMid meet")):r.getAttribute("width")||r.setAttribute("width","280"),r.setAttribute("overflow","visible"),new XMLSerializer().serializeToString(r)}function zi(e){if(e&&typeof e=="object")return"";const t=xp(e),n=t.code;if(!n)return"";if(t.lang==="svg"||n.toLowerCase().indexOf("<svg")>=0){const r=Gi(n);if(r)return'<div class="dgm-wrap">'+r+"</div>"}return'<div class="dgm-code"><pre class="report">'+x.esc(n)+"</pre></div>"}function Sp(e){return zi(e)}const $i={render:zi,renderSync:Sp,sanitizeSvg:Gi},_p=["innerHTML"],Ap=de({__name:"DiagramBlock",props:{source:{}},setup(e){const t=e,n=D(()=>$i.render(t.source||""));return(r,s)=>(_(),A("div",{class:"diagram-block",innerHTML:n.value},null,8,_p))}}),Tp={key:0,class:"dsh-dq-cell"},Ep={class:"dq-tile-head"},Op={class:"dq-tile-ico"},Ip={key:0,class:"dq-dot",title:"今日题还没做"},Mp={key:1,class:"dq-tile-sub st-no"},Pp={key:2,class:"dq-tile-sub st-warn"},Cp={key:3,class:"dq-tile-sub st-warn"},Np=["innerHTML"],Lp={key:1,class:"dq-tile-preview dq-tile-hint"},jp={class:"dq-week","aria-hidden":"true"},Dp={class:"dq-tools"},qp=["value"],Bp=["disabled"],Rp={class:"dq-question"},Jp=["innerHTML"],Hp={class:"dq-section"},Gp=["innerHTML"],zp={key:0,class:"dq-section"},$p=["innerHTML"],Up={key:2,class:"dq-eval dq-eval-ok"},Fp={key:3,class:"dq-eval dq-eval-no"},Kp={key:4,class:"dq-eval-row"},Vp={class:"muted-sm dq-foot"},Qp={class:"alert alert-warn"},Wp=["disabled"],Xp={key:2,class:"muted-sm"},Yp=de({__name:"DailyQuizCard",setup(e){const t=x.dkey(),n=D(()=>b.get().dailyQuiz),r=D(()=>n.value&&n.value.date===t&&n.value.question),s=D(()=>n.value&&n.value.date===t&&n.value.failed),o=D(()=>K.configured()),i=D(()=>!!(r.value&&!n.value.revealed&&!n.value.selfEval)),a=D(()=>r.value?ee.SUBJECTS[n.value.subject]||{short:"题",color:"#666"}:null),c=D(()=>n.value?.selfEval==="known"?{t:"已会 ✓",cls:"st-ok"}:n.value?.selfEval==="unknown"?{t:"记入错题",cls:"st-no"}:n.value?.revealed?{t:"待自评",cls:"st-warn"}:{t:"待作答",cls:"st-warn"}),l=se(!1),u=[{v:"auto",l:"🎲 自动(薄弱点)"},{v:"math",l:"📐 数学"},{v:"ctrl",l:"🎛 专业课"},{v:"eng",l:"📖 英语"},{v:"pol",l:"🏛 政治"}],f=se(!1),d=D(()=>en(n.value?.question||"")),m=D(()=>en(n.value?.solution||"")),p=D(()=>en(n.value?.trap||"")),y=D(()=>(n.value?.generatedAt||"").slice(0,16).replace("T"," ")),g=D(()=>{const E=(b.get().dailyQuizHistory||[]).slice(-6).map((R,P)=>({k:"h"+P+(R.date||""),cls:R.selfEval==="known"?"ok":R.selfEval==="unknown"?"no":"done",today:!1})),L=n.value&&n.value.date===t?n.value.selfEval==="known"?"ok":n.value.selfEval==="unknown"?"no":n.value.revealed?"done":"open":"none";return E.push({k:"today",cls:L,today:!0}),E});function v(){l.value=!l.value}function w(){f.value||(f.value=!0,l.value=!0,Hi(!0,()=>{f.value=!1},wn.value))}function S(){Ce.push(Ye("settings"))}return(O,M)=>l.value?(_(),Ve(Ze,{key:1,icon:"📅",title:"每日一题",tint:"purple",class:"dsh-dq"},{actions:ge(()=>[h("button",{class:"link-btn",onClick:v},"收起 ▴")]),default:ge(()=>[h("div",Dp,[rt(h("select",{"onUpdate:modelValue":M[0]||(M[0]=E=>Ha(wn)?wn.value=E:null),class:"input input-sel dq-sel",title:"指定出题科目"},[(_(),A(U,null,X(u,E=>h("option",{key:E.v,value:E.v},T(E.l),9,qp)),64))],512),[[Ga,W(wn)]]),r.value?(_(),A("button",{key:0,class:"btn btn-ghost btn-sm dq-again",disabled:f.value,onClick:w},T(f.value?"生成中…":"🔁 换题"),9,Bp)):V("",!0)]),r.value?(_(),A(U,{key:0},[h("div",Rp,[h("b",null,"📝 "+T(a.value.short)+"题：",1),h("span",{innerHTML:d.value},null,8,Jp)]),n.value.diagram?(_(),Ve(Ap,{key:0,source:n.value.diagram},null,8,["source"])):V("",!0),n.value.revealed||n.value.selfEval?(_(),A(U,{key:1},[h("div",Hp,[M[8]||(M[8]=h("b",null,"🔑 解答：",-1)),h("div",{class:"dq-sol",innerHTML:m.value},null,8,Gp)]),n.value.trap?(_(),A("div",zp,[M[9]||(M[9]=h("b",null,"⚠️ 易错点：",-1)),h("div",{class:"dq-sol",innerHTML:p.value},null,8,$p)])):V("",!0)],64)):V("",!0),n.value.selfEval==="known"?(_(),A("div",Up,"✓ 已自评：会了。保持这个节奏。")):n.value.selfEval==="unknown"?(_(),A("div",Fp,"✗ 已自评：还不会——已记入错题本，明天简报会盯着你复习。")):n.value.revealed?(_(),A("div",Kp,[M[10]||(M[10]=h("span",{class:"muted-sm"},"看完解答，诚实自评：",-1)),h("button",{class:"btn btn-primary btn-sm",onClick:M[1]||(M[1]=E=>W(yo)(!0))},"✓ 会了"),h("button",{class:"btn btn-ghost btn-sm",onClick:M[2]||(M[2]=E=>W(yo)(!1))},"✗ 还不会")])):(_(),A(U,{key:5},[M[11]||(M[11]=h("div",{class:"dq-fold"},"🫣 解答已折叠——先拿草稿纸做一遍，再对答案。",-1)),h("button",{class:"btn btn-ghost btn-sm",onClick:M[3]||(M[3]=(...E)=>W(mo)&&W(mo)(...E))},"👀 查看解答")],64)),h("div",Vp,"基于你的薄弱点生成 · "+T(y.value),1)],64)):s.value?(_(),A(U,{key:1},[h("div",Qp,"⚠️ 今日一题生成失败："+T(n.value.error||"未知错误"),1),h("button",{class:"btn btn-ghost btn-sm dq-retry",disabled:f.value,onClick:w},T(f.value?"生成中…":"🔁 重试生成"),9,Wp)],64)):o.value?(_(),A("div",Xp,"⏳ 正在依据你的薄弱点生成今日一题…")):(_(),A(U,{key:3},[M[12]||(M[12]=h("div",{class:"alert alert-warn"},"未配置 AI，无法生成每日一题。请先在「设置」中填写 API。",-1)),h("button",{class:"btn btn-ghost btn-sm",onClick:S,style:{"margin-top":"8px"}},"去设置 →")],64))]),_:1})):(_(),A("div",Tp,[h("div",{class:"dq-tile",role:"button",tabindex:"0",title:"点击查看今日一题",onClick:v,onKeydown:Fr(v,["enter"])},[h("div",Ep,[h("span",Op,[M[4]||(M[4]=te("📅",-1)),i.value?(_(),A("span",Ip)):V("",!0)]),M[5]||(M[5]=h("span",{class:"dq-tile-name"},"每日一题",-1)),r.value?(_(),A("span",{key:0,class:re(["dq-tile-sub",c.value.cls])},T(a.value.short)+" · "+T(c.value.t),3)):s.value?(_(),A("span",Mp,"生成失败 · 重试")):o.value?(_(),A("span",Pp,"⏳ 生成中")):(_(),A("span",Cp,"配置 AI"))]),r.value?(_(),A("div",{key:0,class:"dq-tile-preview",innerHTML:d.value},null,8,Np)):(_(),A("div",Lp,T(s.value?"今日生成失败，点击展开可重试。":o.value?"正在依据你的薄弱点生成今日一题…":"配置 AI 后，每天自动送一道针对你弱点的题。"),1)),h("div",jp,[(_(!0),A(U,null,X(g.value,E=>(_(),A("span",{key:E.k,class:re(["dq-wdot","w-"+E.cls+(E.today?" w-today":"")])},null,2))),128)),M[6]||(M[6]=h("span",{class:"dq-week-label muted-sm"},"近 7 日",-1))]),M[7]||(M[7]=h("div",{class:"dq-tile-cta"},"查看今日一题 →",-1))],32)]))}}),Zp=ze(Yp,[["__scopeId","data-v-f0f7a385"]]),eh={class:"now-count"},th={class:"now-actions"},nh={class:"now-count"},rh={class:"now-title"},sh={class:"now-sub"},oh={class:"now-reason"},ih={class:"now-actions"},ah=de({__name:"NowCard",setup(e){const t=()=>window,n=D(()=>b.todayTaskStats()),r=D(()=>b.todayAllDone()),s=D(()=>{n.value;const f=t().SchedulerModule;if(!f||!f.currentPlan)return null;const d=f.currentPlan();return d&&d.sequence&&d.sequence.find(m=>!m.done)||null}),o=D(()=>s.value?ee.SUBJECTS[s.value.subject]:null),i=D(()=>{const f=n.value;return f.math[0]+f.ctrl[0]+f.eng[0]+f.pol[0]}),a=D(()=>{const f=n.value;return f.math[1]+f.ctrl[1]+f.eng[1]+f.pol[1]});function c(){const f=t().TasksModule;f&&s.value?f.toggleTask(s.value.id,!0):Q.show("打卡模块未就绪","warn")}function l(){Ce.push(Ye("focus"))}function u(){Ce.push(Ye("scheduler"))}return(f,d)=>r.value?(_(),Ve(Ze,{key:0,icon:"✅",title:"今日已清场",tint:"ok",class:"dsh-now dsh-now-done"},{extra:ge(()=>[h("span",eh,T(i.value)+"/"+T(a.value),1)]),default:ge(()=>[d[1]||(d[1]=h("div",{class:"now-title"},"✓ 全部任务完成",-1)),d[2]||(d[2]=h("div",{class:"now-sub"},"可以安心复盘、早点睡。明天继续。",-1)),h("div",th,[h("button",{class:"btn btn-ghost",onClick:d[0]||(d[0]=m=>W(Ce).push(W(Ye)("review")))},"去复盘 →")])]),_:1})):s.value?(_(),Ve(Ze,{key:1,icon:"⚡",title:"现在就干这个",class:"dsh-now dsh-now-hero"},{extra:ge(()=>[h("span",nh,T(i.value)+"/"+T(a.value)+" 已完成",1)]),default:ge(()=>[h("div",rh,T(s.value.text),1),h("div",sh,[o.value?(_(),A("span",{key:0,class:"now-tag",style:Xe({background:o.value.color})},T(o.value.short),5)):V("",!0),h("span",oh,T(s.value.reason),1)]),h("div",ih,[h("button",{class:"now-btn-primary",onClick:c},"✓ 完成打卡"),h("button",{class:"now-btn-ghost",onClick:l},"🔒 专注"+T(s.value.subject==="math"?45:25)+"分钟",1)])]),_:1})):(_(),Ve(Ze,{key:2,icon:"🗓️",title:"今日无待办",class:"dsh-now"},{default:ge(()=>[d[3]||(d[3]=h("div",{class:"now-title"},"还没排任务",-1)),d[4]||(d[4]=h("div",{class:"now-sub"},"去排程把今天的任务排上，仪表盘才知道你现在该干嘛。",-1)),h("div",{class:"now-actions"},[h("button",{class:"btn btn-primary",onClick:u},"去排程添加")])]),_:1}))}}),ch=ze(ah,[["__scopeId","data-v-a92668cf"]]);function Gt(e,t){return'<svg viewBox="0 0 '+e+" "+t+'" width="100%" height="'+t+'" xmlns="http://www.w3.org/2000/svg">'}function ve(e,t){return window.U&&x.themeColor?x.themeColor(e,t):t}const Ui={bar(e,t){t=t||{};const n=ve("--chart-ink","#000"),r=ve("--chart-faint","#bfbfbf"),s=ve("--chart-muted","#8c8c8c"),o=ve("--chart-sub","#595959"),i=680,a=t.height||160,c=24,l=16,u=8,f=8,d=Math.max.apply(null,e.map(v=>v.value).concat([1])),m=e.length||1,p=(i-u-f)/m,y=Math.min(44,p*.55);let g=Gt(i,a);for(let v=0;v<m;v++){const w=e[v],S=Math.max(2,w.value/d*(a-c-l)),O=u+v*p+(p-y)/2,M=a-c-S,E=w.highlight?t.hiColor||n:t.color||r;g+='<rect x="'+O+'" y="'+M+'" width="'+y+'" height="'+S+'" rx="4" fill="'+E+'"><title>'+x.esc(w.label)+"："+w.value+(t.unit||"")+"</title></rect>",g+='<text x="'+(O+y/2)+'" y="'+(a-8)+'" text-anchor="middle" font-size="11" fill="'+s+'">'+x.esc(w.label)+"</text>",w.value>0&&(g+='<text x="'+(O+y/2)+'" y="'+(M-4)+'" text-anchor="middle" font-size="11" fill="'+o+'">'+w.value+"</text>")}return g+"</svg>"},donut(e,t){t=t||{};const n=ve("--chart-ink","#000"),r=ve("--chart-faint","#bfbfbf"),s=ve("--chart-muted","#8c8c8c"),o=ve("--chart-sub","#595959"),i=ve("--chart-track","#f0f0f0"),a=680,c=t.height||190,l=110,u=c/2,f=66,d=40,m=x.sum(e.map(g=>g.value));let p=Gt(a,c);if(m===0)p+='<circle cx="'+l+'" cy="'+u+'" r="'+f+'" fill="none" stroke="'+i+'" stroke-width="'+(f-d)+'"/>',p+='<text x="'+l+'" y="'+(u+5)+'" text-anchor="middle" font-size="13" fill="'+r+'">暂无数据</text>';else{let g=-Math.PI/2;e.forEach(v=>{if(v.value<=0)return;const w=v.value/m,S=g+w*Math.PI*2,O=w>.5?1:0,M=l+f*Math.cos(g),E=u+f*Math.sin(g),L=l+f*Math.cos(S),R=u+f*Math.sin(S),P=l+d*Math.cos(S),H=u+d*Math.sin(S),B=l+d*Math.cos(g),z=u+d*Math.sin(g);p+='<path d="M'+M+" "+E+" A"+f+" "+f+" 0 "+O+" 1 "+L+" "+R+" L"+P+" "+H+" A"+d+" "+d+" 0 "+O+" 0 "+B+" "+z+' Z" fill="'+v.color+'"><title>'+x.esc(v.label)+"："+v.value+"次 ("+Math.round(w*100)+"%)</title></path>",g=S}),p+='<text x="'+l+'" y="'+(u-2)+'" text-anchor="middle" font-size="22" font-weight="500" fill="'+n+'">'+m+"</text>",p+='<text x="'+l+'" y="'+(u+16)+'" text-anchor="middle" font-size="11" fill="'+s+'">总计</text>'}let y=24;return e.forEach(g=>{const v=m?Math.round(g.value/m*100):0;p+='<rect x="230" y="'+(y-10)+'" width="10" height="10" rx="2" fill="'+g.color+'"/>',p+='<text x="246" y="'+y+'" font-size="12" fill="'+n+'">'+x.esc(g.label)+"</text>",p+='<text x="660" y="'+y+'" font-size="12" text-anchor="end" fill="'+o+'">'+g.value+"次 · "+v+"%</text>",y+=24}),p+"</svg>"},line(e,t){t=t||{};const n=ve("--chart-ink","#000"),r=ve("--chart-faint","#bfbfbf"),s=ve("--chart-muted","#8c8c8c"),o=ve("--danger","#cf1322"),i=680,a=t.height||170,c=22,l=14,u=30,f=10,d=e.map(O=>O.value),m=t.min!=null?t.min:Math.min.apply(null,d.concat([0])),p=t.max!=null?t.max:Math.max.apply(null,d.concat([10])),y=e.length;if(y===0)return Gt(i,a)+'<text x="340" y="90" text-anchor="middle" fill="'+r+'" font-size="13">暂无数据</text></svg>';const g=O=>u+(y===1?(i-u-f)/2:O*(i-u-f)/(y-1)),v=O=>a-c-(O-m)/(p-m||1)*(a-c-l);let w=Gt(i,a);t.warnBelow!=null&&(w+='<line x1="'+u+'" y1="'+v(t.warnBelow)+'" x2="'+(i-f)+'" y2="'+v(t.warnBelow)+'" stroke="'+o+'" stroke-dasharray="4 4" stroke-width="1"/>',w+='<text x="'+(i-f)+'" y="'+(v(t.warnBelow)-4)+'" text-anchor="end" font-size="10" fill="'+o+'">预警线 '+t.warnBelow+"</text>");let S="";return e.forEach((O,M)=>{S+=(M===0?"M":"L")+g(M)+" "+v(O.value)}),w+='<path d="'+S+'" fill="none" stroke="'+n+'" stroke-width="2"/>',e.forEach((O,M)=>{const E=t.warnBelow!=null&&O.value<t.warnBelow;w+='<circle cx="'+g(M)+'" cy="'+v(O.value)+'" r="4" fill="'+(E?o:n)+'"><title>'+x.esc(O.label)+"："+O.value+(t.unit||"")+"</title></circle>",y<=12&&(w+='<text x="'+g(M)+'" y="'+(a-6)+'" text-anchor="middle" font-size="10" fill="'+s+'">'+x.esc(O.label)+"</text>")}),w+"</svg>"},progressBar(e,t,n){return e=x.clamp(e,0,100),'<div class="pbar" style="height:'+(n||8)+'px"><div class="pbar-fill" style="width:0%;background:'+t+'" data-w="'+e+'"></div></div>'},radar(e,t){t=t||{};const n=ve("--chart-ink","#000"),r=ve("--chart-sub","#595959"),s=ve("--chart-grid","#e8e8e8"),o=680,i=t.height||200,a=e.length||4,c=128,l=i/2,u=Math.max(40,Math.min(92,(i-24)/2-10)),f=t.color||"#2f54eb",d=v=>-Math.PI/2+2*Math.PI*v/a,m=(v,w)=>[c+w*Math.cos(d(v)),l+w*Math.sin(d(v))];let p=Gt(o,i);for(let v=1;v<=4;v++){const w=u*v/4;let S="";for(let O=0;O<=a;O++){const M=m(O%a,w);S+=(O===0?"M":"L")+M[0]+" "+M[1]}p+='<path d="'+S+' Z" fill="none" stroke="'+s+'" stroke-width="0.5"/>'}for(let v=0;v<a;v++){const[w,S]=m(v,u);p+='<line x1="'+c+'" y1="'+l+'" x2="'+w+'" y2="'+S+'" stroke="'+s+'" stroke-width="0.5"/>';const O=c+(u+22)*Math.cos(d(v)),M=l+(u+22)*Math.sin(d(v));p+='<text x="'+O+'" y="'+(M+4)+'" text-anchor="middle" font-size="12" fill="'+r+'">'+x.esc(e[v].label)+"</text>";const[E,L]=m(v,u*(x.clamp(e[v].value,0,100)/100));p+='<text x="'+E+'" y="'+(L-7)+'" text-anchor="middle" font-size="11" font-weight="500" fill="'+n+'">'+Math.round(e[v].value)+"</text>"}let y="";for(let v=0;v<=a;v++){const w=m(v%a,u*(x.clamp(e[v%a].value,0,100)/100));y+=(v===0?"M":"L")+w[0]+" "+w[1]}p+='<path d="'+y+' Z" fill="'+(t.fill||"rgba(47,84,235,0.16)")+'" stroke="'+f+'" stroke-width="1.5"/>';for(let v=0;v<a;v++){const w=m(v,u*(x.clamp(e[v].value,0,100)/100));p+='<circle cx="'+w[0]+'" cy="'+w[1]+'" r="3" fill="'+f+'"/>'}let g=24;return e.forEach(function(v,w){const S=["#185FA5","#0F6E56","#993C1D","#854F0B","#534AB7","#A32D2D","#5F5E5A","#639922"][w%8];p+='<circle cx="'+(o-108)+'" cy="'+(g-3)+'" r="4" fill="'+S+'"/>',p+='<text x="'+(o-96)+'" y="'+g+'" font-size="12" fill="'+n+'">'+x.esc(v.label)+"</text>",p+='<text x="'+(o-14)+'" y="'+g+'" text-anchor="end" font-size="12" font-weight="500" fill="'+n+'">'+Math.round(v.value)+"</text>",g+=20}),p+"</svg>"}},lh={class:"hours-line"},uh={class:"dsh-big"},dh=["innerHTML"],fh={class:"muted-sm"},ph=de({__name:"HoursCard",setup(e){const t=D(()=>b.weekHours()),n=D(()=>(new Date().getDay()+6)%7),r=D(()=>t.value.map((f,d)=>({label:["一","二","三","四","五","六","日"][d],value:f,highlight:d===n.value}))),s=D(()=>x.round1(x.sum(t.value))),o=D(()=>b.get().settings.weeklyTargetHours||50),i=D(()=>o.value?Math.round(s.value/o.value*100):0),{theme:a}=ts(),c=D(()=>(a.value,Ui.bar(r.value,{height:110,unit:"h",hiColor:x.themeColor("--chart-ink","#000")}))),l=D(()=>b.todayHours());function u(){xe.open({title:"记录学习时长",html:'<div class="seg-row" id="hr-segs">'+[.5,1,1.5,2,3].map(f=>'<button class="seg" data-h="'+f+'">+'+f+"h</button>").join("")+'</div><div class="muted-sm">点击即累加到今天（当前 '+b.todayHours()+"h）</div>",actions:[{label:"完成",kind:"btn-primary"}]}),document.querySelectorAll("#hr-segs .seg").forEach(f=>{f.onclick=()=>{b.addHours(+f.getAttribute("data-h")),Q.success("+"+f.getAttribute("data-h")+"h，今日共 "+b.todayHours()+"h")}})}return(f,d)=>(_(),Ve(Ze,{icon:"📈",title:"本周节奏",tint:"ok"},{actions:ge(()=>[h("button",{class:"link-btn",onClick:u},"+ 记录时长")]),default:ge(()=>[h("div",lh,[h("span",uh,[te(T(s.value),1),d[0]||(d[0]=h("span",{class:"dsh-unit"},"小时",-1))]),h("span",{class:re(["dsh-pill",i.value>=70?"dsh-pill-up":"dsh-pill-warn"])},T(i.value>=70?"↑":"↓")+" 目标 "+T(i.value)+"% ",3)]),h("div",{class:"wk-chart",innerHTML:c.value},null,8,dh),h("div",fh,"今日 "+T(l.value)+"h · 周目标 "+T(o.value)+"h",1)]),_:1}))}}),hh=ze(ph,[["__scopeId","data-v-2168edf0"]]),gh={class:"subj4"},mh={class:"chip-name"},yh={class:"chip-num"},vh={key:0,class:"rvd-wrap"},bh=["onClick"],wh={class:"rvd-stage"},kh={class:"rvd-text"},xh=["onClick"],Sh=["onClick"],_h={key:1},Ah={class:"task-check"},Th=["checked","onChange"],Eh={class:"seq-text"},Oh={key:2,class:"empty"},Ih=de({__name:"TasksCard",setup(e){const t=()=>window,n=D(()=>b.todayTaskStats()),r=D(()=>{const y=t().SchedulerModule;return y&&y.currentPlan&&y.currentPlan()||{sequence:[]}}),s=D(()=>r.value.sequence.slice(0,5)),o=D(()=>Ri(b.get()).slice(0,5)),i=["math","ctrl","eng","pol"],a=D(()=>i.map(y=>{const g=ee.SUBJECTS[y],v=n.value[y][0],w=n.value[y][1];return{k:y,short:g.short,d:v,t:w,done:w>0&&v===w,color:g.color}}));function c(y){const g=b.get().tasks.find(v=>v.id===y);return g?!!g.done:!1}function l(y,g){const v=t().TasksModule;v&&v.toggleTask(y,g)}function u(y){return(ee.SUBJECTS[y]||{color:"#666"}).color}function f(y){return y.kind==="photo"?"📸":y.kind==="pol"?"📕":y.kind==="vocab"?"📚":y.kind==="reading"?"📖":"✍️"}function d(y){return y.kind==="vocab"||y.kind==="reading"}function m(y){if(y.kind==="pol"){const v=t().PolReciteModule;v&&v.grade(y.id,!0),t().AiMemory&&t().AiMemory.recordEvent("完成政治大题复习",String(y.id||"").slice(0,8)),Q.success("✓ 政治大题复习完成，记忆又牢了一层");return}const g=y.kind==="photo"?"mistakePhotos":"mistakes";b.update(v=>{const w=(v[g]||[]).find(S=>S.id===y.id);w&&w.reviewPlan&&(w.reviewPlan.done||(w.reviewPlan.done={}),w.reviewPlan.done["d"+y.stage]=x.dkey())}),t().AiMemory&&t().AiMemory.recordEvent("完成到期复习","D"+y.stage+"阶段"+(y.kind==="photo"?"拍题":"错题")+"重做"),Q.success("✓ 复习完成，记忆又牢了一层")}function p(y){if(y.kind==="pol"){const g=t().PolReciteModule;g&&g.openReview(y.id);return}if(y.kind==="vocab"){Ce.push(Ye("wordbook"));return}if(y.kind==="reading"){Ce.push(Ye("reading"));return}}return(y,g)=>(_(),Ve(Ze,{icon:"☑️",title:"今日任务",tint:"ok"},{actions:ge(()=>[h("button",{class:"link-btn",onClick:g[0]||(g[0]=v=>W(Ce).push(W(Ye)("scheduler")))},"完整排程 →")]),default:ge(()=>[h("div",gh,[(_(!0),A(U,null,X(a.value,v=>(_(),A("div",{key:v.k,class:re(["chip mini",{"chip-done":v.done}]),style:Xe({"--sc":v.color})},[h("span",mh,T(v.short),1),h("span",yh,T(v.d)+"/"+T(v.t),1)],6))),128))]),o.value.length?(_(),A("div",vh,[g[1]||(g[1]=h("div",{class:"muted-sm rvd-cap"},"📅 今日到期复习（重做原题，勿看解析）",-1)),(_(!0),A(U,null,X(o.value,v=>(_(),A("div",{key:v.kind+v.id,class:re(["rvd-item",{"rvd-click":v.kind==="pol"||v.kind==="vocab"||v.kind==="reading"}]),onClick:w=>p(v)},[h("span",wh,T(d(v)?"SRS":"D"+v.stage),1),h("span",kh,T(f(v))+" "+T(v.text),1),d(v)?(_(),A("button",{key:0,class:"btn btn-primary btn-sm",onClick:yr(w=>p(v),["stop"])},"去复习 →",8,xh)):(_(),A("button",{key:1,class:"btn btn-ghost btn-sm",onClick:yr(w=>m(v),["stop"])},"✓ 重做完成",8,Sh))],10,bh))),128))])):V("",!0),s.value.length?(_(),A("div",_h,[(_(!0),A(U,null,X(s.value,v=>(_(),A("label",{key:v.id,class:re(["seq-row",{"seq-is-done":c(v.id)}])},[h("span",Ah,[h("input",{type:"checkbox",checked:c(v.id),onChange:w=>l(v.id,w.target.checked)},null,40,Th),g[2]||(g[2]=h("span",{class:"box"},null,-1))]),h("span",Eh,T(v.text),1),h("span",{class:"seq-badge",style:Xe({color:u(v.subject)})},T(v.weight),5)],2))),128))])):(_(),A("div",Oh,"暂无任务"))]),_:1}))}}),Mh=ze(Ih,[["__scopeId","data-v-b086b73c"]]),Ph={class:"tiles"},Ch=["onClick"],Nh=["innerHTML"],Lh={key:0,class:"tile-dot"},jh={class:"tile-name"},Dh=de({__name:"TilesCard",setup(e){const t=()=>window,n=D(()=>{const c=b.todayTaskStats();return c.math[1]+c.ctrl[1]+c.eng[1]+c.pol[1]-c.math[0]-c.ctrl[0]-c.eng[0]-c.pol[0]}),r=D(()=>Ri(b.get()).length),s=D(()=>{const c=t().WordbookModule;try{return c&&c.dueCount?c.dueCount():0}catch{return 0}}),o=[{id:"scheduler",tint:"warn",badge:()=>n.value},{id:"quiz",tint:"blue"},{id:"mistakes",tint:"danger",badge:()=>r.value},{id:"wordbook",tint:"ok",badge:()=>s.value},{id:"polrecite",tint:"danger"},{id:"sprint",tint:"purple"},{id:"share",tint:"blue"},{id:"focus",tint:"ok"},{id:"essay",tint:"warn"}],i=D(()=>o.map(c=>{const l=cn[c.id]?c.id:"tools";return{go:c.id,svg:cn[l]||"",name:Zo(c.id),n:c.badge?Math.max(0,c.badge()):0,tint:c.tint}}));function a(c){Ce.push(Ye(c))}return(c,l)=>(_(),Ve(Ze,{icon:"🚀",title:"快捷入口",tint:"blue"},{extra:ge(()=>[...l[0]||(l[0]=[h("span",{class:"muted-sm"},"红点 = 有待办",-1)])]),default:ge(()=>[h("div",Ph,[(_(!0),A(U,null,X(i.value,u=>(_(),A("button",{key:u.go,class:"tile",onClick:f=>a(u.go)},[h("span",{class:re(["tile-ico","tint-"+u.tint])},[h("span",{innerHTML:u.svg},null,8,Nh),u.n>0?(_(),A("span",Lh)):V("",!0)],2),h("span",jh,[te(T(u.name),1),u.n>0?(_(),A(U,{key:0},[te(" · "+T(u.n),1)],64)):V("",!0)])],8,Ch))),128))])]),_:1}))}}),qh=ze(Dh,[["__scopeId","data-v-8644a98a"]]),Bh={key:0,class:"streak"},Rh={class:"muted-sm"},Jh={class:"cal"},Hh={class:"cal-mrow"},Gh={class:"cal-wd"},zh={key:0,class:"cal-cell cal-empty"},$h=["title"],Uh={class:"cal-foot"},Fh={class:"muted-sm"},zt=12,Kh=de({__name:"CalendarCard",setup(e){const t=["一","二","三","四","五","六","日"],n=D(()=>{const o=b.get(),i=new Date;i.setHours(23,59,59,999);let a=x.weekMonday(new Date);a=new Date(a.getTime()-(zt-1)*7*x.DAY_MS);const c=[];for(let l=0;l<7;l++){const u=[];for(let f=0;f<zt;f++){const d=new Date(a.getTime()+(f*7+l)*x.DAY_MS);if(d>i){u.push(null);continue}const m=x.dkey(d),p=o.studyHours[m]||0,y=(o.completions[m]||[]).length,g=p+y*.5,v=g<=0?0:g<2?1:g<4?2:g<6?3:4,w=d.getFullYear()===i.getFullYear()&&d.getMonth()===i.getMonth()&&d.getDate()===i.getDate();u.push({k:m,lv:v,isToday:w,h:p,doneN:y})}c.push(u)}return c}),r=D(()=>{let o=x.weekMonday(new Date);o=new Date(o.getTime()-(zt-1)*7*x.DAY_MS);const i=[];let a=-1;for(let c=0;c<zt;c++){const l=new Date(o.getTime()+c*7*x.DAY_MS),u=c===0||l.getMonth()!==a?l.getMonth()+1+"月":"";u&&(a=l.getMonth()),i.push(u)}return i}),s=D(()=>{const o=b.get();let i=x.weekMonday(new Date);i=new Date(i.getTime()-(zt-1)*7*x.DAY_MS);const a=new Date;a.setHours(23,59,59,999);let c=0,l=0,u=0,f=0;for(let d=0;;d++){const m=new Date(i.getTime()+d*x.DAY_MS);if(m>a)break;const p=x.dkey(m),y=o.studyHours[p]||0;y+(o.completions[p]||[]).length*.5>0?(l++,c+=y,f++,f>u&&(u=f)):f=0}return{totalH:x.round1(c),activeDays:l,best:u,streak:b.studyStreak()}});return(o,i)=>(_(),Ve(Ze,{icon:"🗓️",title:"学习日历",tint:"warn"},{extra:ge(()=>[s.value.streak>=2?(_(),A("span",Bh,"🔥 连续 "+T(s.value.streak)+" 天",1)):V("",!0),h("span",Rh,[i[0]||(i[0]=te("近12周 ",-1)),h("b",null,T(s.value.activeDays),1),i[1]||(i[1]=te(" 天活跃",-1))])]),default:ge(()=>[h("div",Jh,[h("div",Hh,[i[2]||(i[2]=h("span",{class:"cal-wd"},null,-1)),(_(!0),A(U,null,X(r.value,(a,c)=>(_(),A("span",{key:"m"+c,class:"cal-mcell"},T(a),1))),128))]),(_(!0),A(U,null,X(n.value,(a,c)=>(_(),A("div",{key:"r"+c,class:"cal-row"},[h("span",Gh,T(t[c]),1),(_(!0),A(U,null,X(a,(l,u)=>(_(),A(U,{key:"c"+c+"-"+u},[l?(_(),A("span",{key:1,class:re(["cal-cell",["cal-lv"+l.lv,{"cal-today":l.isToday}]]),title:l.k+" · "+l.h+"h · 完成"+l.doneN+"项"},null,10,$h)):(_(),A("span",zh))],64))),128))]))),128))]),h("div",Uh,[i[4]||(i[4]=h("div",{class:"cal-legend"},[h("span",{class:"muted-sm"},"少"),h("span",{class:"cal-cell cal-lv0"}),h("span",{class:"cal-cell cal-lv1"}),h("span",{class:"cal-cell cal-lv2"}),h("span",{class:"cal-cell cal-lv3"}),h("span",{class:"cal-cell cal-lv4"}),h("span",{class:"muted-sm"},"多")],-1)),h("span",Fh,[i[3]||(i[3]=te("累计 ",-1)),h("b",null,T(s.value.totalH)+"h",1)])])]),_:1}))}}),Vh=ze(Kh,[["__scopeId","data-v-d14087cc"]]),Qh={class:"dsh-root"},Wh=["innerHTML"],Xh={class:"dsh-bento"},Yh=de({__name:"DashboardView",setup(e){const t=D(()=>(b.get().milestones,b.get().alerts,As.bannerHtml()));return jt(()=>{lp(),up()}),(n,r)=>(_(),A("div",Qh,[t.value?(_(),A("div",{key:0,class:"dsh-banner",innerHTML:t.value},null,8,Wh)):V("",!0),fe(Xf),h("div",Xh,[fe(kp,{class:"dsh-span7"}),fe(Zp,{class:"dsh-span5"}),fe(ch,{class:"dsh-span7"}),fe(hh,{class:"dsh-span5"}),fe(Mh,{class:"dsh-span7"}),fe(qh,{class:"dsh-span5"}),fe(Vh,{class:"dsh-span12"})])]))}}),Zh=ze(Yh,[["__scopeId","data-v-f21c490f"]]),eg=[{path:"/",redirect:"/dashboard"},{path:"/dashboard",name:"dashboard",component:Zh},...ln.filter(e=>e.id!=="dashboard").map(e=>({path:"/"+e.id,name:e.id,component:uo})),{path:"/tool/aitools",name:"aitools",component:ad},{path:"/tool/prompt-studio",name:"prompt-studio",component:Jf},{path:"/tool/:id",name:"tool",component:uo},{path:"/:pathMatch(.*)*",redirect:"/dashboard"}],Ce=za({history:$a(),routes:eg});Ce.beforeEach(()=>{const e=window.FocusModule;return e&&e.active?(Q.show("深度专注进行中，请先点「中断专注」结束再切换","warn",3500),!1):!0});function tg(){let e="";try{const r=$.tools();r&&r.length&&(e='<div class="muted-sm" style="margin:10px 0 4px;font-size:12px">🧩 插件工具</div><div class="tools-grid">'+r.map(s=>'<button class="tool-cell" data-tab="'+s.id+'"><span class="tool-icon">'+(s.icon||"🧩")+"</span><span>"+x.esc(s.title)+"</span></button>").join("")+"</div>")}catch{}const t=ns.map(r=>'<button class="tool-cell" data-tab="'+r.id+'"><span class="tool-icon">'+(cn[r.icon]||"🧩")+"</span><span>"+r.label+"</span></button>").join(""),n=xe.open({title:"🧰 工具箱",html:'<div class="tools-grid">'+t+"</div>"+e,actions:[{label:"关闭"}]});document.querySelectorAll(".tool-cell").forEach(r=>{r.onclick=()=>{const s=r.getAttribute("data-tab");n(),s&&Ce.push("/tool/"+s)}})}const ng={class:"bottomnav",id:"bottomnav","data-testid":"bottomnav"},rg=["data-tab","data-testid","onClick"],sg={class:"bn-icon"},og={class:"bn-label"},ig=["data-tab","onClick"],ag={class:"bn-icon"},cg=["innerHTML"],lg={class:"bn-icon"},ug={class:"bn-scroll"},dg=["data-tab","onClick"],fg={class:"bn-icon"},pg={class:"bn-label"},hg=["data-tab","onClick"],gg={class:"bn-icon"},mg=["innerHTML"],yg=de({__name:"BottomNav",setup(e){const t=Ur(),n=Ao(),{toggle:r}=Ei(),s=D(()=>String(t.params.id||t.name||"")),o=se([]),i=se([]);function a(){try{o.value=$.maintabs()||[]}catch{o.value=[]}try{i.value=$.tools()||[]}catch{i.value=[]}}jt(a);const c=D(()=>!ln.some(d=>d.id===s.value)&&!!s.value);function l(d){n.push("/"+d)}function u(d){n.push("/tool/"+d)}function f(d){return x.esc(d)}return(d,m)=>(_(),A("nav",ng,[m[6]||(m[6]=h("div",{class:"bn-brand"},[h("div",{class:"bn-brand-name"},[h("span",{class:"bn-brand-ico"},"🎯"),te("26考研作战系统")]),h("div",{class:"bn-brand-sub"},"最适合你的工作台")],-1)),h("button",{class:"bn-layout-toggle","data-testid":"layout-toggle",title:"切回手机单列布局",onClick:m[0]||(m[0]=p=>W(r)())}," 📱 切回手机布局 "),(_(!0),A(U,null,X(W(ln),p=>(_(),A("button",{key:p.id,class:re(["bn-btn",{"bn-on":s.value===p.id}]),"data-tab":p.id,"data-testid":"nav-"+p.id,onClick:y=>l(p.id)},[h("span",sg,[fe(An,{name:p.icon},null,8,["name"])]),h("span",og,T(p.label),1)],10,rg))),128)),(_(!0),A(U,null,X(o.value,p=>(_(),A("button",{key:"plugin-"+p.id,class:re(["bn-btn",{"bn-on":s.value===p.id}]),"data-tab":p.id,onClick:y=>u(p.id)},[h("span",ag,T(p.icon||"🧩"),1),h("span",{class:"bn-label",innerHTML:f(p.name)},null,8,cg)],10,ig))),128)),h("button",{class:re(["bn-btn",{"bn-on":c.value}]),"data-tab":"__tools","data-testid":"nav-tools",onClick:m[1]||(m[1]=p=>W(tg)())},[h("span",lg,[fe(An,{name:"tools"})]),m[4]||(m[4]=h("span",{class:"bn-label"},"工具",-1))],2),m[7]||(m[7]=h("div",{class:"bn-group"},"工具",-1)),h("div",ug,[(_(!0),A(U,null,X(W(ns),p=>(_(),A("button",{key:"tool-"+p.id,class:re(["bn-btn",{"bn-on":s.value===p.id}]),"data-tab":p.id,onClick:y=>u(p.id)},[h("span",fg,[fe(An,{name:p.icon},null,8,["name"])]),h("span",pg,T(p.label),1)],10,dg))),128)),(_(!0),A(U,null,X(i.value,p=>(_(),A("button",{key:"ptool-"+p.id,class:re(["bn-btn",{"bn-on":s.value===p.id}]),"data-tab":p.id,onClick:y=>u(p.id)},[h("span",gg,T(p.icon||"🧩"),1),h("span",{class:"bn-label",innerHTML:f(p.title)},null,8,mg)],10,hg))),128))]),h("div",{class:"bn-user bn-user-clickable",role:"button",tabindex:"0",title:"前往设置","data-testid":"nav-go-settings",onClick:m[2]||(m[2]=p=>u("settings")),onKeydown:m[3]||(m[3]=Fr(p=>u("settings"),["enter"]))},[...m[5]||(m[5]=[h("span",{class:"bn-user-avatar"},"岸",-1),h("span",null,[h("b",null,"上岸预定人"),te("点击前往设置")],-1),h("span",{class:"bn-user-arrow","aria-hidden":"true"},"›",-1)])],32)]))}}),vg={class:"app"},bg={class:"wb-pagehead","data-testid":"pagehead"},wg={class:"wb-pagehead-sub"},kg=["data-cols"],xg={class:"view",id:"vue-view","data-testid":"vue-view"},Sg=de({__name:"App",setup(e){const t=Ur(),n=new Set(["aitools","dashboard","prompt-studio"]),r=D(()=>n.has(String(t.name||""))),s=D(()=>String(t.params.id||t.name||"dashboard")),o=D(()=>Zo(s.value)),i=D(()=>x.daysTo(b.get().settings.examDate)),a=D(()=>{const d=new Date;return x.dkey(d).slice(5)+" · "+["周日","周一","周二","周三","周四","周五","周六"][d.getDay()]}),c=new Set(["scheduler"]),l=D(()=>c.has(s.value)?"2":void 0);let u=null;function f(){const d=document.getElementById("view"),m=document.getElementById("vue-view"),p=r.value?m:d;p&&(p.classList.remove("view-enter"),p.offsetWidth,p.classList.add("view-enter"),u&&clearTimeout(u),u=setTimeout(()=>p.classList.remove("view-enter"),620))}return $r(()=>t.fullPath,()=>f()),jt(()=>{f()}),(d,m)=>{const p=Ua("RouterView");return _(),A(U,null,[h("div",vg,[fe(Fc),h("div",bg,[h("div",null,[h("h1",null,T(o.value),1),h("div",wg,T(a.value)+" · 距考研 "+T(i.value)+" 天",1)])]),rt(h("main",{class:"view",id:"view","data-cols":l.value},null,8,kg),[[Qs,!r.value]]),rt(h("main",xg,[fe(p)],512),[[Qs,r.value]]),fe(yg)]),m[0]||(m[0]=h("div",{id:"toast-wrap"},null,-1))],64)}}}),le={},$t={},_g={run(e,t,n,r){if(r=r||{},$t[e])return $t[e];const s={id:e,label:t||e,status:"running",result:void 0,error:"",extra:r.extra||null,startedAt:new Date().toISOString(),finishedAt:""};le[e]=s;const o=Promise.resolve().then(function(){return n()}).then(function(i){if(s.status="done",s.result=i,s.finishedAt=new Date().toISOString(),delete $t[e],r.onDone)try{r.onDone(i,s)}catch(a){console.warn("[BgTask] onDone 回调异常",a)}return window.U&&x.emit&&x.emit("bgTask:done",{id:e,label:s.label,result:i}),i},function(i){if(s.status="error",s.error=i&&i.message?i.message:String(i),s.finishedAt=new Date().toISOString(),delete $t[e],r.onError)try{r.onError(i,s)}catch(a){console.warn("[BgTask] onError 回调异常",a)}throw window.U&&x.emit&&x.emit("bgTask:error",{id:e,label:s.label,error:s.error}),i});return $t[e]=o,o.catch(function(){}),o},isRunning(e){return!!(le[e]&&le[e].status==="running")},get(e){return le[e]||null},getResult(e){return le[e]&&le[e].status==="done"?le[e].result:void 0},getError(e){return le[e]&&le[e].status==="error"?le[e].error:""},clear(e){le[e]&&le[e].status!=="running"&&delete le[e]},clearAll(){Object.keys(le).forEach(function(e){le[e].status!=="running"&&delete le[e]})},list(e){return Object.keys(le).filter(function(t){return!e||le[t].status==="running"}).map(function(t){return le[t]})}},Ag=`# kaoyan2026 云端出卷执行器 workflow（2026-08-24；v11 增 PDF 导入资源 Gist）
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
    # 【2026-09-07】90 → 360：85 套卷整本视觉提取实测单调用 60-120s×170+ 次，90 分钟必死。原 45→90：慢模型出强化卷（35+ 题）本就可能跑 40 分钟+，
    # 叠加 API 限额退避（v9 起最长等 30 分钟）后 45 分钟必死。超时被杀时
    # runner 已有 SIGTERM 终态回写（不再留「冻结在半路」的假运行状态）。
    timeout-minutes: 360
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

      # 【v29】PyMuPDF(fitz)：资料库书签直拆（R1）依赖它读 PDF outline。pypdf 对 LaTeX 生成的
      # outline 返回空，fitz 可靠；运行时 pip 自救不稳（时好时坏降级到宫格），故在 workflow 预装。
      - name: Install pymupdf (资料库书签直拆)
        run: pip install pymupdf

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
`,Tg=`#!/usr/bin/env node
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
// 版本规则：runner 行为变更才 +1（v15 = 资料库 book 通道；v16 = 429 共享闸门不弃题 + score=0 自动均摊修复；v17 = book 分发致命修复 + 数学乱码转视觉）。
const RUNNER_VER = 'v31';

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
// 【v16 429 共享闸门】全部 AI 调用共用一个限流闸门（单一收口）：任一调用撞 429 就把闸门推远
// （指数 + 抖动），所有在途/后续调用在闸门前排队错峰重试。旧实现各 worker 独立退避固定 15s——
// 10 路同时撞 429 → 同时睡 15s → 同时重撞（惊群），低并发量 API（2~3 路）被撞得整段失败。
let AI_GATE_UNTIL = 0;    // 闸门截止时间戳（最新一次 429 推远它）
let AI_GATE_STRIKES = 0;  // 连续 429 计数（指数退避档位）
let AI_GATE_LAST_LOG = 0; // 日志去重：风暴期每 10s 最多一行，不刷屏
async function aiGateWait() {
  while (Date.now() < AI_GATE_UNTIL) {
    await sleep(Math.min(AI_GATE_UNTIL - Date.now(), 800) + Math.random() * 250);   // 轮询 + 抖动：唤醒天然错峰
  }
}
async function aiRetry(messages, opts, tries = 3) {
  const deadline = Date.now() + 10 * 60000;   // 限流整体等待预算（防死循环；闸门是全员共享的，等待并行不叠加）
  let i = 0;   // 非 429 失败计数：429 不占重试次数——限流是全员的事，不能烧掉单题的重试配额（旧实现弃题的根源）
  for (;;) {
    try {
      await aiGateWait();
      // 【H5】只给「慢调用」打点：每题都记耗时会把日志淹没，而出卷卡住时用户真正想知道的
      // 就是「是哪一次调用特别慢」。阈值 30s（正常出题 10~40s，超 60s 基本可判定异常）。
      const _t0 = Date.now();
      const r = await aiCall(messages, opts);
      const _dur = Date.now() - _t0;
      if (_dur >= 30000) pushLog('🐢 AI 调用较慢：' + Math.round(_dur / 1000) + 's' + (_dur >= 60000 ? '（异常，可能是思考模型在长推理）' : ''), 'warn', _dur);
      AI_GATE_STRIKES = Math.floor(AI_GATE_STRIKES / 2);   // 成功半衰（不清零：混合流量下避免闸门反复失守）
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
      // 429 限流：推远全局闸门（指数 + 抖动），不占 tries，超时预算内一直重试——题目绝不因限流被弃
      if (code === 429 || code === 408) {
        if (Date.now() >= deadline) throw e;
        AI_GATE_STRIKES++;
        const backoff = Math.min(60000, 5000 * Math.pow(2, Math.min(AI_GATE_STRIKES - 1, 4))) * (0.8 + Math.random() * 0.4);
        const until = Date.now() + backoff;
        if (until > AI_GATE_UNTIL) {
          AI_GATE_UNTIL = until;
          if (Date.now() - AI_GATE_LAST_LOG > 10000) {
            AI_GATE_LAST_LOG = Date.now();
            pushLog('⏳ AI 限流 429：全局退避 ' + Math.round(backoff) + 's（连续 ' + AI_GATE_STRIKES + ' 次）——所有在途调用共享闸门、抖动错峰重试，题目不弃', 'warn');
          }
        }
        continue;
      }
      if (i >= tries - 1) throw e;
      i++;
      log('AI 调用失败重试', i, e.message);
      pushLog('🔁 AI 调用失败，' + (3 * i) + 's 后重试（第 ' + i + '/' + (tries - 1) + ' 次）：' + String(e.message).slice(0, 80), 'warn');
      await sleep(3000 * i);
    }
  }
}
// 【v13 子母卷】纯文本 AI 调用（带 aiRetry 重试链）：用于「命题形式研究报告」这类
// 输出为自然语言（非 JSON）的阶段。think 默认跟随 JOB_THINK，由调用方 opts 覆盖。
async function aiText(messages, opts) {
  return await aiRetry(messages, Object.assign({ think: JOB_THINK }, opts || {}));
}
// 宽容 JSON 抽取：剥 <think> 思考块 → 剥代码围栏 → 找首个平衡的 {...} 或 [...]
/* 【v23 LaTeX 转义修复】模型输出 JSON 字符串里的 LaTeX 命令（\\sqrt \\delta \\frac…）含非法
 * JSON 转义（\\s \\d 不在合法集），严格 JSON.parse 必炸——李林四套卷实测
 * 「Bad escaped character in JSON at position 4247」整章报废。修复：非法 \\x 补成合法 \\\\x。 */
function jsonRepairEscapes(t) {
  // 【v26 真跑验证修复】三趟，顺序不能换：
  //  1) \\b\\f\\n\\r\\t 后紧跟字母 → 是 LaTeX 命令（\\frac \\beta \\nu \\right \\times），双写；单独保留。
  //  2) \\u 后不跟 4 位十六进制（\\use 等）→ 双写。
  //  3) 其余：先整体「消费」合法转义（\\\\ \\" \\/ \\b\\f\\n\\r\\t \\uXXXX）原样保留，只把非法 \\X 双写。
  //     ——v25 逐字符正则会二次破坏模型合法输出的 \\\\! → \\\\\\!（新增非法转义），故必须消费式。
  return String(t)
    .replace(/\\\\([bfnrt])(?=[A-Za-z])/g, '\\\\\\\\$1')
    .replace(/\\\\u(?![0-9a-fA-F]{4})/g, '\\\\\\\\u')
    .replace(/\\\\(["\\\\\\/bfnrtu]|u[0-9a-fA-F]{4})|\\\\(.)/g, function (m, ok, bad) { return ok !== undefined ? m : '\\\\\\\\' + bad; });
}
/* 【v30 控制字符修复】模型常把题干写成跨行（JSON 字符串里塞裸换行/制表符），
 * JSON.parse 报 "Expected ',' or '}' after property value"（李林卷一/卷二实测）。
 * 逐字符扫描，仅在字符串内部把 0x00-0x1F 转义成 \\n \\r \\t \\uXXXX。 */
function jsonEscapeControlInStrings(t) {
  let out = '', inStr = false, esc = false;
  const s = String(t || '');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      if (esc) { out += c; esc = false; continue; }
      if (c === '\\\\') { out += c; esc = true; continue; }
      if (c === '"') { out += c; inStr = false; continue; }
      const code = c.charCodeAt(0);
      if (code < 0x20) {
        if (c === '\\n') out += '\\\\n';
        else if (c === '\\r') out += '\\\\r';
        else if (c === '\\t') out += '\\\\t';
        else out += '\\\\u' + ('000' + code.toString(16)).slice(-4);
      } else out += c;
    } else { out += c; if (c === '"') inStr = true; }
  }
  return out;
}
/* 【v30 解析链】原样 → 修反斜杠转义 → 修控制字符 → 两者都修，逐级放宽。 */
function jsonParseLoose(x) {
  const cands = [x, jsonRepairEscapes(x), jsonEscapeControlInStrings(x), jsonEscapeControlInStrings(jsonRepairEscapes(x))];
  let lastErr = null;
  for (const c of cands) { try { return JSON.parse(c); } catch (e) { lastErr = e; } }
  throw lastErr;
}
function extractJson(txt) {
  let t = String(txt || '')
    .replace(/<think>[\\s\\S]*?<\\/think>/gi, '')   // 思考模型的显式思考块
    .replace(/<think>[\\s\\S]*$/i, '')             // 未闭合的思考块（后面不会再有正文了）
    .trim();
  t = t.replace(/^\`\`\`(?:json)?\\s*/i, '').replace(/\`\`\`\\s*$/g, '').trim();
  try { return jsonParseLoose(t); } catch (e) {}   // 【v30】四重修复链（转义+控制字符）
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
    else if (ch === close) {
      depth--;
      if (!depth) {
        const seg = t.slice(s, i + 1);
        return jsonParseLoose(seg);   // 【v30】段内同样走四重修复链
      }
    }
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
// 【2026-09-06 v16 修复·score=0 自动均摊】蓝图单题分值 0 = 剩余分自动均摊（本地 exam-pipeline.bpAutoScores
// 一直有此语义，云端从来没有）——旧 scoreForType 对 0 分行直接回 0，云端数一卷 6 道解答题全 0 分，
// 最后靠「总分对齐」把 86 分全贴给最后一题（0,0,0,0,0,86）。现按本地同款算法均摊（0.5 分刻度）。
function bpAutoScores(bp) {
  var fixed = 0, autoN = 0;
  ((bp && bp.types) || []).forEach(function (t) {
    if (t.score > 0) fixed += t.count * t.score;
    else autoN += t.count;
  });
  var rest = Math.max(0, (bpTotalScore(bp)) - fixed);
  if (!autoN) return [];
  var per = Math.floor((rest / autoN) * 2) / 2;
  var scores = [];
  for (var i = 0; i < autoN; i++) scores.push(per);
  var leftover = Math.round((rest - per * autoN) * 2) / 2;
  for (var j = autoN - 1; j >= 0 && leftover > 0; j--) { scores[j] += 0.5; leftover -= 0.5; }
  return scores;
}
// 蓝图分值队列：type → [分数...]（按蓝图行序展开；score=0 行从均摊序列依次取）。
function bpScoreQueues(bp) {
  var auto = bpAutoScores(bp), k = 0, q = {};
  ((bp && bp.types) || []).forEach(function (t) {
    var arr = q[t.type] || (q[t.type] = []);
    for (var i = 0; i < (t.count || 0); i++) arr.push(t.score > 0 ? Number(t.score) : (auto[k++] || 0));
  });
  return q;
}

// ==================== 【v16 蓝本槽位制】蓝本是卷面结构的唯一事实来源 ====================
// 旧链路：规划 AI 自由返回题型分布 → 只覆盖 score/star，题型数量错了没人管，直到终检 blueprintCheck
// 才暴露「题量不符/题型错位」，整卷返工。新链路：
//   ① bpSlots：按蓝本 types 顺序展开权威槽位（qid/type/score/star 全由槽位决定；
//      star 按 starMix 最大余数法装桶、升序排列 = 压轴在后的真题节奏，与本地 bpPerQuestionPlan 同款）；
//   ② reconcilePlanSlots：AI 规划题按「题型一致 + 顺序就近」入槽——AI 只贡献内容（考点/方向），
//      结构字段全被槽位覆盖；
//   ③ 缺槽 → 一次补规划（只补缺的题型/数量）；超产 → 弃用。AI 再怎么跑偏，卷面结构永不错位。
function bpSlots(bp) {
  var n = bpQuestionCount(bp);
  var targets = starMixTargets(bp, n);
  var starPool = [];
  for (var s = 1; s <= 5; s++) for (var k = 0; k < (targets[s] || 0); k++) starPool.push(s);
  var auto = bpAutoScores(bp), k2 = 0, qid = 0, slots = [];
  ((bp && bp.types) || []).forEach(function (t) {
    for (var i = 0; i < (t.count || 0); i++) {
      qid++;
      var poolIdx = Math.round((qid - 1) / Math.max(1, n - 1) * (starPool.length - 1));
      slots.push({
        qid: qid, type: t.type, label: t.label,
        score: t.score > 0 ? Number(t.score) : (auto[k2++] || 0),
        star: starPool[Math.min(poolIdx, starPool.length - 1)] || 3
      });
    }
  });
  return slots;
}
function reconcilePlanSlots(planQuestions, bp) {
  var slots = bpSlots(bp);
  var ai = Array.isArray(planQuestions) ? planQuestions.slice() : [];
  var used = new Array(ai.length).fill(false);
  var filled = [], missing = [];
  slots.forEach(function (slot) {
    var pick = -1;
    for (var i = 0; i < ai.length; i++) {
      if (used[i]) continue;
      if (String(ai[i].type || 'solve') === slot.type) { pick = i; break; }   // 同题型顺序就近
    }
    if (pick < 0) { missing.push(slot); return; }
    used[pick] = true;
    var q = ai[pick];
    q.type = slot.type; q.score = slot.score; q.star = slot.star; q.qid = slot.qid; q._slotLabel = slot.label;
    filled.push(q);
  });
  return { questions: filled, missing: missing, extras: ai.filter(function (q, i) { return !used[i]; }) };
}
function scoreForType(bp, qtype) {
  var types = (bp && bp.types) || [];
  var t = types.find(function (x) { return x && x.type === qtype; });
  if (!t) return 5;   // 蓝图未规定（如 essay 0 分）→ 兜底 5
  return Number(t.score) || 0;
}
// 把"每题 score 应分"转成自然语言描述注入 plannerSystem，让 AI 在规划阶段就把 score 写齐（方便审查对照）。
// 【v16】0 分行显示均摊结果（如"均摊14~14.5分"），不再让规划 AI 看到"0分/solve"自由发挥。
function scoreSpecText(bp) {
  var auto = bpAutoScores(bp), k = 0;
  var types = (bp && bp.types) || [];
  return types.map(function (t) {
    if (t.score > 0) return t.score + '分/' + (t.type || '?') + '×' + t.count + '道';
    var slice = auto.slice(k, k + (t.count || 0)); k += (t.count || 0);
    if (!slice.length) return '均摊/' + (t.type || '?') + '×' + t.count + '道';
    var mn = Math.min.apply(null, slice), mx = Math.max.apply(null, slice);
    return '均摊' + (mn === mx ? mn : mn + '~' + mx) + '分/' + (t.type || '?') + '×' + t.count + '道';
  }).join('，');
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
// 一页文字层是否「文本通道不可用」→ 转视觉。两个独立信号（任一命中即转）：
// ① garbledRatio > 0.45：CID 碎片乱码（狶狶狶式，生僻字主导+高重复）；
// ② PUA 私有区字符（\\uE000-\\uF8FF）占比 >3% 或绝对数 >30：字体无 ToUnicode 映射的
//    「半坏文字层」——真·实测样本（李林四套卷）中文正常但公式括号全变 \\uf0ee\\uf0ee，
//    pypdf 字频 rare 高达 0.80；整体 ratio 只 0.36 会漏判，但 PUA 信号 100% 特异
//    （正常 PDF 文字层零 PUA）。公式残缺对文本模型是噪声，视觉模型反而能看原型。
function puaCount(txt) {
  let n = 0;
  for (const ch of String(txt || '')) { const c = ch.codePointAt(0); if (c >= 0xE000 && c <= 0xF8FF) n++; }
  return n;
}
function pageIsGarbled(txt) {
  if (garbledRatio(txt) > 0.45) return true;
  const s = String(txt || '').replace(/\\s+/g, '');
  if (s.length < 30) return false;
  const pua = puaCount(txt);
  if (pua > 30 || pua / s.length > 0.03) return true;
  // 【v17 数学乱码信号】字体无 ToUnicode 映射时，pdftotext 把公式字形输出成 🟥/□/■/U+FFFD
  // 这类替换字符——它们不是 PUA，旧检测全漏（李林四套卷实测：每页 10+ 个 🟥、积分/分式
  // 全碎成「n2+1」，但文字层"看起来"正常，被喂给文本模型提取出垃圾）。
  // 出现 ≥6 个或占比 >0.8% 即判乱码 → 转视觉整页识别。
  const boxy = (String(txt).match(/[\\u{1F7E5}\\u{1F7E6}\\u{1F7E7}\\u{1F7E8}□■▯]/gu) || []).length;
  return boxy >= 6 || boxy / s.length > 0.008;
}
function importTextSystem(subj) {
  return '你是考研' + subjName(subj) + '试卷数字化工程师。用户给你一份试卷其中几页的文字层提取（pdftotext 输出，'
    + '可能含页眉页脚、双栏错序、公式残缺、题目跨页）。任务：把每一道题完整还原成结构化 JSON。'
    + '【铁律】①只做搬运与整理，严禁增删改题意、严禁编造卷面上没有的答案或解析——卷面没给答案就输出 answer:"" 并置 noAnswer:true。'
    + '②题目跨页出现时合并为一题（sourcePages 给全部页码）。③公式保留为 LaTeX（$...$），文字层里错乱的上下标/根号按你能确定的最小修改还原；'
    + '拿不准是否还原正确就把 confidence 调低（0-1 小数），不要猜。④题号 no 用卷面原题号（数字），分卷/无题号按出现顺序编号。'
    + '⑤页眉页脚、答题卡填涂说明、注意事项等非试题文字一律丢弃。'
    + '⑥star 为难度粗评（1=送分直接套公式 … 5=压轴综合），看信息量/计算量/思维量快速判断即可，不必精确。'
    + '只输出 JSON：{"questions":[{"no":1,"stem":"题干","type":"choice|fill|solve|essay","options":["A. ..","B. ..","C. ..","D. .."],"answer":"卷面答案","solution":"卷面解析（没有则空串）","noAnswer":false,"topicName":"考点","score":数字或null,"star":1-5,"sourcePages":[1],"confidence":0.95}]}';
}
function importVisionSystem(subj) {
  return '你是考研' + subjName(subj) + '试卷数字化工程师。用户给你试卷整页的高清图片（扫描版/拍照版）。'
    + '任务：逐题识别图片中的试题，还原成结构化 JSON。'
    + '【铁律】①忠实转录：识别什么输出什么，严禁补全图片里没有的题干、答案或解析；看不清的字用 □ 占位并调低 confidence。'
    + '②卷面没印答案就 answer:"" + noAnswer:true，严禁用你的知识"顺手解出来"冒充卷面答案。'
    + '③数学公式必须用 LaTeX（$...$）准确还原（分式/根号/上下标/积分号）。④题号 no 用卷面原题号。'
    + '⑤一道题跨页时在两页都识别完整部分，sourcePages 标该页即可（合并由系统处理）。'
    + '⑥star 为难度粗评（1=送分直接套公式 … 5=压轴综合），看信息量/计算量/思维量快速判断即可，不必精确。'
    + '只输出 JSON：{"questions":[{"no":1,"stem":"题干","type":"choice|fill|solve|essay","options":["A. ..","B. ..","C. ..","D. .."],"answer":"卷面答案","solution":"卷面解析（没有则空串）","noAnswer":false,"topicName":"考点","score":数字或null,"star":1-5,"sourcePages":[1],"confidence":0.95}]}';
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
  // 【v16 导入评星】AI 粗评难度 1-5（缺失/非法回退 3）——导入卷不再全员三星
  const starRaw = Math.round(Number(q.star));
  const star = (starRaw >= 1 && starRaw <= 5) ? starRaw : 3;
  return {
    no: Number(q.no) || null,
    stem: stem, type: type, options: options.length === 4 ? options : undefined,
    answer: answer, solution: q.solution == null ? '' : String(q.solution).trim(),
    noAnswer: noAnswer, topicName: q.topicName == null ? '' : String(q.topicName).trim(),
    score: typeof q.score === 'number' && q.score > 0 ? q.score : null,
    star: star,
    sourcePages: pages, confidence: conf, lowConfidence: low,
    fromImport: true, importKind: g.kind, importNote: validateImported(q) || ''
  };
}
/* 【v20 完整性铁律】22 题的卷子只提回 17 题事故：模型对长解答卷会「抽样偷懒」。
 * schema 强制 num（原题号），规约要求题号连续覆盖——审计函数据此找缺口，缺则定向补提。 */
const BOOK_Q_COMPLETE_RULE = '【完整性铁律——最重要】必须输出本章全部题目，一题不落：'
  + '每题的 num 填原文题号（数字），输出前自查题号是否从最小号连续覆盖到最大号；'
  + '题干再长、解析再繁也不许省略或概括——宁可 solution 写简，不可丢题。原文没有的题号不许编造。'
  + '【LaTeX 书写】公式命令与其花括号/参数连续书写，命令之间禁止插入多余空格'
  + '（写 $\\\\dfrac{1}{x}$、$\\\\lim\\\\limits_{x\\\\to+\\\\infty}$、$\\\\begin{cases}$，不要写成 \\\\dfrac {1} {x} 或 \\\\begin {cases}）；'
  + '反斜杠命令必须完整（\\\\begin 不能漏成 \\\\egin），下标上标紧贴符号。';
function bookChapterSystem(subject, kind) {
  const kn = kind === '习题册' ? '习题册' : '讲义';
  return '你是考研资料数字化专家。下面是一本' + subject + kn + '中某一章的原文（文字层提取，可能有排版噪声）。'
    + '请产出本章的结构化学习内容，只输出 JSON（不要 markdown 围栏）：'
    + '{"content":["讲义要点段落1","段落2",…],"questions":[{"num":原题号数字,"stem":"题目原文(不重复题号前缀)","options":["A. ..","B. .."]或省略,"answer":"答案","solution":"解析（含步骤）","page":原文页码}]}。'
    + '要求：1) content 提炼本章真正的知识内容（定义/定理/方法/结论/例题讲解），每段≤300字，按原文顺序，公式用 $…$ LaTeX；'
    + '2) questions 提取原文中出现的例题与习题，没有题目就给空数组；3) 忠实原文，禁止编造原文没有的内容；4) 用简体中文。'
    + BOOK_Q_COMPLETE_RULE;
}

function bookChapterVisionSystem(subject, kind) {
  const kn = kind === '习题册' ? '习题册' : '讲义';
  return '你是考研资料数字化专家。下面是一本' + subject + kn + '中某一章的原文页面图片（公式密集，文字层不可靠，故走整页视觉识别）。'
    + '请产出本章的结构化学习内容，只输出 JSON（不要 markdown 围栏）：'
    + '{"content":["讲义要点段落1","段落2",…],"questions":[{"num":原题号数字,"stem":"题目原文(不重复题号前缀)","options":["A. ..","B. .."]或省略,"answer":"答案","solution":"解析（含步骤）","page":原文页码,"confidence":0.0到1.0}]}。'
    + '【双通道校对】若消息附带该页文字层：以图片理解版面/题号/公式结构，文字层仅用于校对汉字与数字；'
    + '冲突时公式一律以图片为准、汉字以文字层为准；文字层大面积乱码时忽略它。'
    + '【图形题】题干含函数图像/几何图时照常提取文字部分，confidence 酌情下调。'
    + '要求：1) content 提炼本章真正的知识内容（定义/定理/方法/结论/例题讲解），每段≤300字，按原文顺序，公式用 $…$ LaTeX；'
    + '2) questions 提取图片中出现的例题与习题，没有题目就给空数组；'
    + '3) 数学公式必须用 LaTeX（$…$）准确还原（分式/根号/上下标/积分号）；'
    + '4) 忠实原文，禁止编造原文没有的内容；5) 用简体中文；6) 忽略页眉页脚水印群号广告等噪声。'
    + BOOK_Q_COMPLETE_RULE;
}

/* 【v20 缺题审计】题号集合 → 1..max 中的缺口列表。纯函数（可单测）。
 * 无题号/题号<3 不审计（习题册节选本就跳号）；缺口>30 视为题号混乱不可信，不触发补提。 */
function auditGapNums(questions) {
  const found = {};
  (questions || []).forEach(function (q) {
    const n = parseInt(q && q.num, 10);
    if (n >= 1 && n <= 80) found[n] = 1;
  });
  const ks = Object.keys(found).map(Number);
  if (!ks.length) return [];
  const maxN = Math.max.apply(null, ks);
  if (maxN < 3) return [];
  const miss = [];
  for (let n = 1; n <= maxN; n++) if (!found[n]) miss.push(n);
  return miss.length > 30 ? [] : miss;
}

/* 【v20 定向补提规约】只找缺失题号——比首轮「全部重提」便宜且准。 */
function bookRepairSystem(chTitle, missList) {
  return '你是考研资料数字化专家。《' + chTitle + '》此前已提取过题目，但缺以下题号：' + missList.join('、') + '。'
    + '请在原文（文字或图片）中只找这些题号的题目，逐字转录。只输出 JSON：'
    + '{"questions":[{"num":题号,"stem":"题干全文(公式用$…$LaTeX)","options":["A. ..",…]或省略,"answer":"答案","solution":"解析"}]}。'
    + '原文确实没有的题号（跳号、只有答案没有题目、或属于下一套卷）就跳过，严禁编造。找不到任何缺失题就输出 {"questions":[]}。';
}

/* 【v18 两级目录·确定性解析器】「85 套卷」这类多卷合集书的正确结构 = 大类（入门/进阶/难/系列）→ 小类（每套卷一章）。
 * 书自带目录页（标题 … 页码）时，页码是作者给的权威事实——直接解析，零 AI 猜测：
 *   ① 前几页找「目录页」：≥6 行「标题 + 引导点/空格 + 页码」且页码单调不减；随后 ≥3 行的连续页并入（跨页目录）；
 *   ② 目录内「入门/进阶/难」这类层级标题（短、不含套/卷/题/数字、与下一条同页）识别为大类专业分隔，
 *      不成章，同时确定性给出每个小类的 group（省掉一次 AI 调用）；没有这类标题时才让调用方跑 AI 归类；
 *   ③ 印刷页码 → 物理页：offset = 目录后首页 − 最小印刷页（印刷页码连续编号的常见情形）；
 *   ④ 相邻条目页码差即每套卷的页范围，末章到全书最后一页。
 * 返回 {chapters:[{title,from,to,group}], headersFound, tocLastPage, entries} 或 null（无目录页 → 调用方走 AI 划分）。
 * 纯函数：不依赖任何模块作用域，可被单测直接求值调用。 */
function extractBookToc(pgTxt, pages) {
  const entryRe = /^\\s*(.{2,40}?)[\\s.…·⋯\\-]{2,}(\\d{1,3})\\s*$/;
  const pageHits = [];
  const scanTo = Math.min(pages, 10);
  for (let p = 1; p <= scanTo; p++) {
    const lines = String(pgTxt[p] || '').split(/\\r?\\n/);
    const hits = [];
    for (const ln of lines) {
      const m = entryRe.exec(ln);
      if (!m) continue;
      const title = m[1].replace(/[.…·⋯\\-]+$/, '').trim();
      const printed = parseInt(m[2], 10);
      if (!title || printed < 1 || printed > Math.max(pages, 1)) continue;
      hits.push({ title: title, printed: printed });
    }
    let mono = true;
    for (let i = 1; i < hits.length; i++) if (hits[i].printed < hits[i - 1].printed - 2) { mono = false; break; }
    pageHits.push({ page: p, hits: mono ? hits : [] });
  }
  // 目录页 = 首个 ≥6 条的页，向后并入连续 ≥3 条的页（最多 4 页目录）
  let start = -1;
  for (let i = 0; i < pageHits.length; i++) if (pageHits[i].hits.length >= 6) { start = i; break; }
  if (start < 0) return null;
  const found = [pageHits[start]];
  for (let i = start + 1; i < pageHits.length && i <= start + 4; i++) {
    if (pageHits[i].hits.length >= 3) found.push(pageHits[i]);
    else break;
  }
  // 跨页目录：按 title+printed 去重保序
  const seen = {}; const entries = []; let tocLastPage = 0;
  for (const f of found) {
    tocLastPage = f.page;
    for (const h of f.hits) {
      const k = h.title + '@' + h.printed;
      if (seen[k]) continue;
      seen[k] = 1; entries.push(h);
    }
  }
  if (entries.length < 6) return null;
  return tocEntriesToChapters(entries, tocLastPage, pages);
}

/* 【v20.1 共享】目录条目 → 章节（层级标题归组 + 印刷页→物理页校准 + 区间夹逼）。
 * 文字层解析（extractBookToc）与视觉读目录（extractBookTocVision）共用，保证两条路产出同构。纯函数。 */
function tocEntriesToChapters(entries, tocLastPage, pages) {
  const sorted = entries.slice().sort((a, b) => a.printed - b.printed);
  // ② 层级标题识别：短、无 套/卷/题/数字，且与下一条同页
  const headerSet = {};
  for (let i = 0; i < sorted.length - 1; i++) {
    const e = sorted[i], nx = sorted[i + 1];
    if (e.printed === nx.printed && e.title.length <= 8 && !/[0-9０-９一二三四五六七八九十百两套卷题篇]/.test(e.title)) headerSet[i] = e.title;
  }
  const headersFound = Object.keys(headerSet).length > 0;
  const contentStart = tocLastPage + 1;
  // 印刷页 → 物理页：默认恒偏移（印刷页码连续编号）；若最大印刷页 + 偏移超出实际页数，
  // 说明编号不连续（每套卷各自编号等）→ 退化为线性比例映射，保证末章落在最后一页。
  const minP = sorted[0].printed, maxP = sorted[sorted.length - 1].printed;
  const offset = Math.max(0, contentStart - minP);
  const useProp = (maxP + offset) > pages && maxP > minP;
  const phys = useProp
    ? function (printed) { return contentStart + Math.round((printed - minP) * (pages - contentStart) / (maxP - minP)); }
    : function (printed) { return printed + offset; };
  const chapters = [];
  let curGroup = '';
  for (let i = 0; i < sorted.length; i++) {
    if (headerSet[i] !== undefined) { curGroup = headerSet[i]; continue; }   // 分隔标题不成章
    let from = phys(sorted[i].printed);
    let to = i + 1 < sorted.length ? phys(sorted[i + 1].printed) - 1 : pages;
    if (from < contentStart) from = contentStart;
    if (from > pages) from = pages;
    if (to > pages) to = pages;
    if (to < from) to = from;
    chapters.push({ title: sorted[i].title.slice(0, 40), printed: sorted[i].printed, from: from, to: to, group: curGroup });
  }
  // 去重叠夹逼（印刷页码不连续时相邻章区间可能倒挂）
  chapters.sort((a, b) => a.from - b.from);
  for (let i = 0; i < chapters.length; i++) {
    if (i + 1 < chapters.length && chapters[i].to > chapters[i + 1].to) chapters[i].to = chapters[i + 1].to;
    if (chapters[i].to < chapters[i].from) chapters.splice(i, 1), i--;
  }
  if (chapters.length < 5) return null;
  return { chapters: chapters.slice(0, 150), headersFound: headersFound, tocLastPage: tocLastPage, entries: sorted };
}

/* 【v20.1 视觉读目录】乱码书（做题本/公式讲义）的目录页文字层同样是 🟥——文字解析拿不到条目，
 * 退回 AI 逐页摘要划分时，AI 看不清套卷边界，会把 85 套卷捏成 13 章（P3-34 这种 32 页「一套卷」）。
 * 目录页的套卷名是中文（不是公式），视觉识别准确率高 → 渲染前几页让模型抄目录。
 * 返回 {chapters, headersFound, tocLastPage, entries}（与 extractBookToc 同构）或 null。
 * 依赖注入（renderPageImgs/aiJson）保持纯逻辑可测。 */
async function extractBookTocVision(deps) {
  const { pages, renderPageImgs, aiJson } = deps;
  const frontN = Math.min(pages, 4);
  const plist = []; for (let p = 1; p <= frontN; p++) plist.push(p);
  const pngs = await renderPageImgs(plist);
  if (!pngs.length) return null;
  const r = await aiJson(
    [{ role: 'system', content: '你是目录识别专家。给你的图片是一本书的前几页（按顺序编号 1..N）。若其中有目录页（一列「标题 …… 页码」），把每一条目录项逐字抄下来，并给出目录所在的最后一页的编号；没有目录页就返回 tocFound:false。只输出 JSON：{"tocFound":true/false,"tocLastPage":目录最后一页的图片编号,"entries":[{"title":"目录条目标题原文","printed":条目右侧页码数字}]}。' },
     { role: 'user', content: [{ type: 'text', text: '这些是全书前 ' + frontN + ' 页。请找目录并抄全部条目（含页码）。' }].concat(pngs.map(u => ({ type: 'image_url', image_url: { url: u } }))) }],
    { think: false, temperature: 0.1, maxTokens: 12000 });
  if (!r || !r.tocFound || !Array.isArray(r.entries)) return null;
  const entries = r.entries
    .map(e => ({ title: String((e && e.title) || '').trim().slice(0, 40), printed: parseInt(e && e.printed, 10) }))
    .filter(e => e.title && e.printed >= 1 && e.printed <= Math.max(pages, 1));
  if (entries.length < 5) return null;
  // 目录结束页：模型报的编号（图片序=物理页）；异常值兜底为前几页的一半
  let tocLastPage = parseInt(r.tocLastPage, 10);
  if (!(tocLastPage >= 1 && tocLastPage <= frontN)) tocLastPage = Math.max(1, Math.min(frontN, 2));
  return tocEntriesToChapters(entries, tocLastPage, pages);
}

/* 【v22 R4 缩略图定界】最后一层兜底：纯扫描 + 无书签 + 无页脚锚点 + 无目录页的书
 * （实测：26合工大超越 1-25，25 页全扫描 0 书签）——旧版到 R5 直接抛「可读文字页过少」死路。
 * 方法论 R4：每 12 页一组低分辨率整页图喂 VLM，找「新套卷起始页」（每套首页顶部大字套名、题号从 1 重启）。
 * 返回 {chapters:[{title,from,to,group}]}（≥1 套）或 null。 */
async function detectSetsByGrid(deps) {
  const { pages, renderPageImgs, aiJson, budgetOk } = deps;
  const found = [];
  for (let i = 1; i <= pages; i += 12) {
    const group = []; for (let p = i; p < Math.min(i + 12, pages + 1); p++) group.push(p);
    if (budgetOk && !budgetOk('宫格定界 P' + group[0] + '-' + group[group.length - 1])) break;
    const imgs = await renderPageImgs(group, { dpi: 96, forceWhole: true });
    if (!imgs.length) continue;
    const r = await aiJson(
      [{ role: 'system', content: '你是试卷合订本结构分析引擎。给你的图片按顺序是一本书的连续页面（缩略图，只看版面结构不必读题）。'
        + '这是「多套模拟卷合订」：每套卷第一页同时满足两个特征——①顶部有大字试卷标题（如「XX模拟试卷N」「XX六套卷第N套」）；②该页从题号 (1)/1. 重新开始。'
        + '若某页题号从上页延续（如从 (15)、三、解答题 17 开始），它是续页，不是套首。'
        + '找出每一套卷的起始页。只输出 JSON：{"sets":[{"startPage":物理页码,"title":"套卷标题原文(≤40字)"}]}。'
        + '封面/目录/空白页不算套；整本就一套时输出 1 条；不确定就别列。' },
       { role: 'user', content: [{ type: 'text', text: '这些是全书第 ' + group[0] + '—' + group[group.length - 1] + ' 页（按图片顺序）。请找出新套卷的起始页。' }].concat(imgs.map(u => ({ type: 'image_url', image_url: { url: u } }))) }],
      { think: false, temperature: 0.1, maxTokens: 2000 });
    const sets = Array.isArray(r && r.sets) ? r.sets : [];
    sets.forEach(function (s) {
      const sp = parseInt(s && s.startPage, 10);
      if (sp >= group[0] && sp <= group[group.length - 1]) found.push({ page: sp, title: String((s && s.title) || '').trim().slice(0, 40) });
    });
  }
  // 【S2 边界精化】候选套首逐页高清确认（缩略图实测会把续页 (15)(16) 误判成套首）；
  //   首页 1 也强制确认（模型常因「书从中途开始」不自信而漏报第一套）。
  const cands = {};
  found.forEach(function (f) { cands[f.page] = f.title; });
  if (!cands[1]) cands[1] = '';
  const confirmed = [];
  const candPages = Object.keys(cands).map(Number).sort(function (a, b) { return a - b; });
  for (const cp of candPages) {
    if (budgetOk && !budgetOk('套首确认 P' + cp)) break;
    const one = await renderPageImgs([cp], { dpi: 200, forceWhole: true });
    if (!one.length) { confirmed.push({ page: cp, title: cands[cp] || '' }); continue; }
    const v = await aiJson(
      [{ role: 'system', content: '给你一本书的一页（高清）。判断它是否是一套试卷的第一页：①顶部有大字试卷标题；②本页从题号 (1)/1. 重新开始（若从 (15) 等延续题号开始则是续页）。'
        + '只输出 JSON：{"isStart":true/false,"title":"若 isStart 给出卷标题原文(≤40字)，否则空串"}。' },
       { role: 'user', content: [{ type: 'text', text: '请判断这一页是否新套卷首页。' }].concat(one.map(u => ({ type: 'image_url', image_url: { url: u } }))) }],
      { think: false, temperature: 0, maxTokens: 400 });
    if (v && v.isStart) confirmed.push({ page: cp, title: String(v.title || cands[cp] || '').trim().slice(0, 40) });
  }
  if (!confirmed.length) return null;
  confirmed.sort(function (a, b) { return a.page - b.page; });
  const starts = [];
  confirmed.forEach(function (f) { if (!starts.length || f.page > starts[starts.length - 1].page) starts.push(f); });
  if (starts[0].page > 1) starts.unshift({ page: 1, title: '前段（未识别到套首，按一套处理）' });
  const chapters = [];
  for (let i = 0; i < starts.length; i++) {
    let from = starts[i].page;
    let to = i + 1 < starts.length ? starts[i + 1].page - 1 : pages;
    if (to < from) to = from;
    chapters.push({ title: (starts[i].title || ('第' + (i + 1) + '部分')).slice(0, 40), from: from, to: to, group: '' });
  }
  return { chapters: chapters.slice(0, 150), headersFound: false, entries: starts, groups: [] };
}

/* 大类归类校验：AI 给的 groups 必须每个条目恰好落一组，否则全部退回「全册」单组。
 * ids 为 1-based 条目编号。纯函数。 */
function validateBookGroups(aiGroups, nEntries) {
  const out = new Array(nEntries).fill('');
  if (!Array.isArray(aiGroups) || !aiGroups.length) return out;
  const used = {};
  let ok = true;
  for (const g of aiGroups) {
    const title = String((g && g.title) || '').trim().slice(0, 12);
    const ids = Array.isArray(g && g.ids) ? g.ids : null;
    if (!title || !ids) { ok = false; break; }
    for (const idRaw of ids) {
      const id = parseInt(idRaw, 10) - 1;
      if (isNaN(id) || id < 0 || id >= nEntries || used[id]) { ok = false; break; }
      used[id] = 1; out[id] = title;
    }
    if (!ok) break;
    if (out.filter(Boolean).length > 12 * nEntries) { ok = false; break; }   // 防幻觉冗余
  }
  if (!ok || used[0] === undefined) return new Array(nEntries).fill('');
  for (let i = 0; i < nEntries; i++) if (!out[i]) return new Array(nEntries).fill('');
  return out;
}

/* 从 chapters[].group 推导书级 groups 列表（顺序=首次出现；组名空 → 「全册」）。纯函数。 */
function deriveBookGroups(chapters) {
  const groups = []; const idx = {};
  (chapters || []).forEach(function (c) {
    const title = String(c.group || '').trim() || '全册';
    if (!(title in idx)) { idx[title] = groups.length; groups.push({ title: title, count: 0, qCount: 0 }); }
    const g = groups[idx[title]];
    g.count++; g.qCount += (c.questions || []).length;
  });
  return groups;
}

/* ==================== 【v21 PDF 提取方法论·Runner 版 Skill】====================
 * 依据《PDF题目提取方法论（含Runner版Skill）》S0→S4 决策树改造 book 通道。
 * probe 三本真卷的实证结论（2026-09-07）：
 *   · 贾基八十五套卷（A3 数一 182页 / K16 数二 190页）：宽>高 = 2-up 双联页，
 *     书签 95/189 条（L1=入门/进阶/难 分组，L2=每套卷+物理起始页），文字层全乱码；
 *   · 李林四套卷做题本（16页）：非 2-up，书签 L1=卷一~卷四 起始页，L2=选择题/填空题/解答题 节噪点。
 * → 书签直拆（R1）是第一优先路线：零 VLM 成本、页码是出版方权威事实。 */

/* R1 书签 → 章节（纯函数，可单测）。raw = [[level,title,page1based],...]
 * 规则：
 *  ① 去重（title+page）；
 *  ② 节噪点剔除：「一、选择题」类小节书签不成章（李林 L2）；
 *  ③ 结构标题（封面/目录/前言/版权/后记/空白页，或 ≤8 字且无数字无套/卷 → 入门/进阶/难）→ 大类而非章；
 *  ④ 其余为章（套卷）：from=书签页，to=下一同列章起始页-1（末章到全书末页）；
 *  ⑤ 章数 ≥3 才可信（4 套卷的书合法；2 条以下多半是章节级书签混入）。 */
function normalizeBookmarks(raw, pages) {
  if (!Array.isArray(raw) || raw.length < 3) return null;
  const seen = {}; const entries = [];
  raw.forEach(function (it) {
    const level = parseInt(it && it[0], 10) || 1;
    const title = String((it && it[1]) || '').replace(/\\s+/g, ' ').trim().slice(0, 40);
    const page = parseInt(it && it[2], 10);
    if (!title || !(page >= 1 && page <= pages)) return;
    const k = title + '@' + page;
    if (seen[k]) return;
    seen[k] = 1; entries.push({ level: level, title: title, page: page });
  });
  const SECTION_RE = /^([一二三四五六七八九十]+|[0-9]{1,2})\\s*[、.．]\\s*(单项选择|多项选择|选择题|填空题|解答题|判断题|计算题|证明题|应用题|填空题部分|客观题|主观题)/;
  const META_RE = /^(封面|封底|目录|前言|出版说明|版权|后记|答案册|参考答案|附录[一二三四五六七八九十0-9]*|空白页|致读者|勘误)$/;
  const isStructural = function (t) {
    if (META_RE.test(t)) return true;
    if (/^第\\s*[一二三四五六七八九十0-9０-９]+\\s*[章讲节部篇]/.test(t)) return false;   // 讲义「第一章 …」是章不是组
    return t.length <= 8 && !/[0-9０-９套卷]/.test(t);   // 入门/进阶/难/冲刺 这类层级标题
  };
  const leaves = []; const groups = [];
  let curGroup = '';
  entries.sort(function (a, b) { return a.page - b.page || a.level - b.level; });
  entries.forEach(function (e) {
    if (SECTION_RE.test(e.title)) return;                       // 节噪点：直接丢
    if (isStructural(e.title)) {
      if (!META_RE.test(e.title)) { curGroup = e.title; groups.push(e.title); }  // 入门/进阶/难 → 大类
      return;                                                   // 封面/目录等元页：丢，不切组
    }
    leaves.push({ title: e.title, page: e.page, group: curGroup });
  });
  if (leaves.length < 3) return null;
  const chapters = [];
  for (let i = 0; i < leaves.length; i++) {
    let from = leaves[i].page;
    let to = i + 1 < leaves.length ? leaves[i + 1].page - 1 : pages;
    if (to < from) to = from;
    if (from > pages) continue;
    if (to > pages) to = pages;
    chapters.push({ title: leaves[i].title.slice(0, 40), from: from, to: to, group: leaves[i].group || '' });
  }
  if (chapters.length < 3) return null;
  return { chapters: chapters.slice(0, 150), headersFound: groups.length > 0, entries: leaves, groups: groups };
}

/* R2 页脚锚点（纯函数）：做题本常见「《套名》 第1页（共4页）」页脚——
 * 第 1 页出现处即新套起点，套名就在页脚里。要求文字层可读（乱码书走 R1/R4）。
 * 每页取页脚区（末 3 行）匹配；起点 ≥3 才可信。 */
function footerAnchorChapters(pgTxt, pages) {
  const re = /第\\s*1\\s*页\\s*[（(]\\s*共\\s*(\\d{1,2})\\s*页\\s*[)）]/;
  const starts = [];
  for (let p = 1; p <= pages; p++) {
    const lines = String(pgTxt[p] || '').split(/\\r?\\n/).filter(function (l) { return l.trim(); });
    const tail = lines.slice(-3).join(' ');
    const m = re.exec(tail);
    if (!m) continue;
    // 页脚里「第1页」之前的文字即套名（去掉水印噪声取 ≤40 字）
    // 【v24】2-up 页脚行混入左右两半的正文：只取尾部像「套卷名」的片段（…第N套/…卷N/…试卷N），
    //   正文垃圾被标点天然截断；取不到就回退「第N部分」（宁缺毋滥，脏标题比无名更伤体验）
    const pre = tail.slice(0, m.index).replace(/\\s+/g, ' ').trim();
    const nm = /([0-9A-Za-z一-鿿（）()·\\- ]{2,40}?(?:第\\s*[0-9一二三四五六七八九十百]+\\s*套|[卷套]\\s*[0-9一二三四五六七八九十百]+|试卷\\s*[0-9一二三四五六七八九十百]+|模拟卷\\s*[0-9一二三四五六七八九十百]+))\\s*$/.exec(pre);
    const name = (nm ? nm[1] : '').replace(/^[（）()\\s·\\-]+/, '').trim().slice(-40);
    starts.push({ page: p, title: name || ('第' + (starts.length + 1) + '部分'), total: parseInt(m[1], 10) });
  }
  if (starts.length < 3) return null;
  const chapters = [];
  for (let i = 0; i < starts.length; i++) {
    let from = starts[i].page;
    let to = i + 1 < starts.length ? starts[i + 1].page - 1 : pages;
    if (to < from) to = from;
    chapters.push({ title: starts[i].title.slice(0, 40), from: from, to: to, group: '' });
  }
  return { chapters: chapters.slice(0, 150), headersFound: false, entries: starts, groups: [] };
}

/* S4 validate_index 断言③（纯函数）：正文区每个物理页恰好归属一章。
 * 返回 {gaps:[[from,to]...未覆盖], overlaps:[[page,chA,chB]...]}——违规只报告+局部修，
 * 绝不全书重跑（铁律④：重跑粒度=套）。 */
function validateIndexCoverage(chapters, contentStart, pages) {
  const owner = {};
  (chapters || []).forEach(function (c, i) {
    for (let p = c.from; p <= c.to; p++) {
      if (p < contentStart || p > pages) continue;
      if (owner[p] === undefined) owner[p] = i;
    }
  });
  const gaps = []; let run = 0;
  for (let p = contentStart; p <= pages; p++) {
    if (owner[p] === undefined) { if (!run) run = p; }
    else if (run) { gaps.push([run, p - 1]); run = 0; }
  }
  if (run) gaps.push([run, pages]);
  return { gaps: gaps };
}

/* 2-up 裁半页参数（纯函数）：A3/K16 横版一页两联。pdftoppm -x -y -W -H 按设备像素裁。
 * 页宽 pt → 像素 = pt*dpi/72；左右各一半。 */
function halfCropArgs(pageWpt, pageHpt, dpi, half) {
  const wpx = Math.floor(pageWpt * dpi / 72);
  const hpx = Math.floor(pageHpt * dpi / 72);
  const hw = Math.floor(wpx / 2);
  const x = half === 'right' ? hw : 0;
  const w = half === 'right' ? wpx - hw : hw;
  return { x: x, y: 0, w: w, h: hpx };
}

/* 【v21 R1 / v24 换 fitz / v25 修自救触发】读 PDF 书签：临时脚本 + python3。
 * 【v25 根因】v24 脚本 fitz 缺失时静默 fall 到 pypdf，pypdf 对 LaTeX outline 返回空 [] →
 *   r.ok=true → pip 自救（装 pymupdf）永不触发 → 书签路线形同虚设（贾基靠改进后的页脚路线救回，
 *   李林无页脚 → 宫格只找到 1 套）。修复：fitz 缺失或 pypdf 返回空都 exit 43 触发自救装 pymupdf 重试。
 * 返回 [[level,title,page1based],...] 或 null（调用方落 R2/R3/R4 路线）。 */
async function readPdfBookmarks(pdfPath) {
  const py = [
    'import sys, json',
    'def read_fitz():',
    '    import fitz',
    '    d = fitz.open(sys.argv[1])',
    '    return [[int(t[0]), str(t[1])[:60], int(t[2])] for t in d.get_toc()]',
    'def read_pypdf():',
    '    from pypdf import PdfReader',
    '    r = PdfReader(sys.argv[1]); out = []',
    '    def walk(items, lv):',
    '        for it in items:',
    '            if isinstance(it, list):',
    '                walk(it, lv + 1)',
    '            else:',
    '                try:',
    '                    pg = r.get_destination_page_number(it) + 1',
    '                except Exception:',
    '                    pg = 0',
    '                out.append([lv, str(it.title or "")[:60], pg])',
    '    try:',
    '        walk(r.outline, 1)',
    '    except Exception:',
    '        pass',
    '    return out',
    '# 1) fitz 优先（对 LaTeX 生成的 outline 可靠）。缺库 → exit 43 触发 pip 装 pymupdf。',
    'try:',
    '    print(json.dumps(read_fitz(), ensure_ascii=False)); sys.exit(0)',
    'except ImportError:',
    '    sys.exit(43)',
    'except Exception as e:',
    '    print("FITZERR:" + str(e), file=sys.stderr)',
    '# 2) pypdf 兜底：非空才可信；空 → exit 43（多半是 fitz 缺失的降级，装 pymupdf 重试更值）',
    'try:',
    '    res = read_pypdf()',
    '    if res:',
    '        print(json.dumps(res, ensure_ascii=False)); sys.exit(0)',
    '    sys.exit(43)',
    'except Exception:',
    '    sys.exit(43)',
  ].join('\\n');
  const f = pathT.join(osT.tmpdir(), 'bm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6) + '.py');
  try { fsT.writeFileSync(f, py, 'utf8'); } catch (e) { return null; }
  let r = await runShell('python3 ' + JSON.stringify(f) + ' ' + JSON.stringify(pdfPath), 30000, 8 * 1024 * 1024);
  // exit 42/43 或模块缺失 → pip 自救装 pymupdf（pypdf 兜底），再跑一次
  if ((!r.ok && /4[23]|ModuleNotFoundError|No module named/.test(String(r.err) + String(r.out))) || (r.ok && String(r.out).trim().endsWith('[]'))) {
    pushLog('🐍 书签读取需 pymupdf（fitz 缺失或 pypdf 返空），pip 自救…');
    // Ubuntu 24.04 runner 是 externally-managed（PEP 668）：普通 pip install 会被拒。
    // 依次尝试 --break-system-packages（系统级）→ --user（用户级），任一成功即可。
    for (const pkg of ['pymupdf', 'pypdf']) {
      const pip1 = await runShell('python3 -m pip install --quiet --disable-pip-version-check --break-system-packages ' + pkg, 180000);
      if (!pip1.ok) await runShell('python3 -m pip install --quiet --disable-pip-version-check --user ' + pkg, 180000);
    }
    r = await runShell('python3 ' + JSON.stringify(f) + ' ' + JSON.stringify(pdfPath), 30000, 8 * 1024 * 1024);
    if (!r.ok) pushLog('⚠️ 书签读取仍失败（pip 自救未成功），本本将退回页脚/目录/宫格路线', 'warn');
  }
  try { fsT.unlinkSync(f); } catch (e) {}
  if (!r.ok) return null;
  try {
    const j = JSON.parse(String(r.out).trim().split('\\n').pop());
    return Array.isArray(j) ? j : null;
  } catch (e) { return null; }
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
      if (pages > (prefs.mode === 'book' ? 300 : 40)) throw new Error('共 ' + pages + ' 页，超过单次导入上限 ' + (prefs.mode === 'book' ? 300 : 40) + ' 页（' + (prefs.mode === 'book' ? '建议按章拆分后分批导入' : '建议拆分后分批导入') + '）');
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
      // 【v21 2-up】RENDER_2UP 置位时（book 分支探测到横版双联页），每物理页渲染成左/右两个半页图，
      //   dpi 提到 200（半页宽度减半，方法论要求 scale≥2.0 公式才认得清）。
      let RENDER_2UP = null;   // {pageW, pageH} pt（由 book 分支置位）
      async function renderPageImgs(pList, opts) {
        const out = [];
        const two = !opts && !!(RENDER_2UP && RENDER_2UP.pageW > RENDER_2UP.pageH * 1.1);   // opts.forceWhole 时不裁半（宫格定界看整页版面）
        const DPI = (opts && opts.dpi) || (two ? 200 : 150);
        for (const p of pList) {
          if (two) {
            for (const half of ['l', 'r']) {
              const cr = halfCropArgs(RENDER_2UP.pageW, RENDER_2UP.pageH, DPI, half === 'l' ? 'left' : 'right');
              const hb = pathT.join(wd, 'pg' + p + half);
              const cmd = 'pdftoppm -f ' + p + ' -l ' + p + ' -png -r ' + DPI +
                ' -x ' + cr.x + ' -y ' + cr.y + ' -W ' + cr.w + ' -H ' + cr.h + ' ' +
                JSON.stringify(pdfPath) + ' ' + JSON.stringify(hb);
              const r2 = await runShell(cmd, 90000);
              if (!r2.ok) { pushLog('⚠️ 第 ' + p + ' 页' + (half === 'l' ? '左' : '右') + '半页渲染失败：' + String(r2.err).slice(0, 100), 'warn'); continue; }
              for (const f of fsT.readdirSync(wd).filter(x => x.indexOf('pg' + p + half + '-') === 0 && /\\.png$/.test(x))) {
                const data = fsT.readFileSync(pathT.join(wd, f));
                if (data.length > 2.6 * 1024 * 1024) { pushLog('⚠️ 第 ' + p + half + ' 图过大，跳过', 'warn'); continue; }
                out.push('data:image/png;base64,' + data.toString('base64'));
              }
            }
            continue;
          }
          const base = pathT.join(wd, 'pg' + p);
          const r = await runShell('pdftoppm -f ' + p + ' -l ' + p + ' -png -r ' + DPI + ' ' + JSON.stringify(pdfPath) + ' ' + JSON.stringify(base), 90000);
          if (!r.ok) { pushLog('⚠️ 第 ' + p + ' 页转图失败：' + String(r.err).slice(0, 120), 'warn'); continue; }
          // 【v19 致命修复】前缀必须带 '-'：旧版 indexOf('pg'+p)===0 让第 1 页同时命中
          // pg10~pg16（2 页组实际塞 8 张图 → payload 暴涨/网关拒收）。pg{p}- 才是精确匹配。
          for (const f of fsT.readdirSync(wd).filter(x => x.indexOf('pg' + p + '-') === 0 && /\\.png$/.test(x))) {
            const data = fsT.readFileSync(pathT.join(wd, f));
            if (data.length > 2.6 * 1024 * 1024) { pushLog('⚠️ 第 ' + p + ' 页图 ' + Math.round(data.length / 1048576) + 'MB 过大，跳过', 'warn'); continue; }
            out.push('data:image/png;base64,' + data.toString('base64'));
          }
        }
        return out;
      }
      // 【v19】book 模式跳过这次预渲染：groups 对 book 无用（分章提取自己按页转图），
      //   旧版白烧 16 次 pdftoppm 还留下满目录 pg*.png 诱发前缀误匹配 bug。
      if (prefs.mode !== 'book') {
        for (let i = 0; i < imgPages.length; i += 2) {
          const chunk = imgPages.slice(i, i + 2);
          const pngs = await renderPageImgs(chunk);
          if (pngs.length) groups.push({ kind: 'img', imgs: pngs, pages: chunk });
        }
      }

      /* 【2026-09-06 资料库·book 分支】讲义/习题册整本导入：
       * 与试卷拆题共用逐页文字提取与乱码判定，分支差异在 AI 目标——
       *   ① AI 目录划分（整本 → 章节页码范围，2-30 章）
       *   ② 分章提取（并发 2）：讲义要点段落 + 例题/习题（题干/答案/解析）
       *   ③ book.json（结构 = studyBook 记录）→ 前端资料库阅读
       * 【v17 视觉通道】公式密集型 PDF（做题本/讲义）文字层被 pdftotext 压碎（🟥/分式碎裂），
       *   这类页已判乱码转视觉——分章提取按章决策：视觉页过半 → 整章走 2 页/次视觉识别合并；
       *   否则走文字层。旧 v1「仅处理文字层页、乱码页跳过」对数学资料等于丢内容。 */
      if (prefs.mode === 'book') {
        // 【v17 致命修复】subject 此前未定义（runImport 开头是 subj）——book 分支一进
        // 分章提取就 ReferenceError，整条链路从未真正跑通过。中文科目名供提示词用。
        const subject = SUBJ_NAME[subj] || subj;
        const imgSet = {}; imgPages.forEach(p => { imgSet[p] = 1; });
        // 【v21 预算硬顶】铁律⑤：视觉调用 ≤ 页数×1.2+20（声明提前：宫格定界/预检/提取/补提共用闸门）
        let BOOK_VLM = 0;
        const BOOK_BUDGET = Math.floor(pages * 1.2 + 20);
        function budgetOk(tag) {
          if (BOOK_VLM >= BOOK_BUDGET) { pushLog('⛔ 视觉调用预算到顶（' + BOOK_BUDGET + '），跳过：' + tag, 'warn'); return false; }
          BOOK_VLM++; return true;
        }
        if (garbledN) pushLog('⚠️ ' + garbledN + ' 页文字层乱码（公式字体无 ToUnicode），对应章节将走整页视觉识别');
        await setStatus('running', 'parsing', '🗂 解析目录结构…', 15);
        // 【v21 PDF 提取方法论·Runner Skill】结构来源决策树（S0→S5，禁止跳步）：
        //   S0 probe：pdfinfo 页尺寸 → 2-up 判定（宽>高=横版双联页，如 A3 合订卷）；
        //   R1 书签直拆：PDF 内嵌书签粒度≈套数 → 零 VLM 成本（三本真卷实测全命中）；
        //   R2 页脚锚点：「第1页（共N页）」页脚 = 新套起点（文字层可读的做题本）；
        //   R3 文字层目录页解析 → R4 视觉读目录 → R5 AI 逐页摘要划分（兜底）。
        let chapters = null, structSrc = '';
        const psz = String(vi.out || '').match(/Page size:\\s+([\\d.]+)\\s*x\\s*([\\d.]+)/i);
        const pageW = psz ? parseFloat(psz[1]) : 0, pageH = psz ? parseFloat(psz[2]) : 0;
        const is2up = pageW > pageH * 1.1;
        if (is2up) {
          RENDER_2UP = { pageW: pageW, pageH: pageH };
          pushLog('📐 S0 probe：' + pageW + '×' + pageH + 'pt 横版 = 2-up 双联页 → 每页裁左右半页识别（dpi 200）');
        }
        // R1 书签
        const bm = await readPdfBookmarks(pdfPath);
        if (bm && bm.length) {
          const bmc = normalizeBookmarks(bm, pages);
          if (bmc) {
            chapters = bmc.chapters;
            structSrc = '🔖 书签直拆（' + bm.length + ' 条书签，零目录识别成本）';
            pushLog('🔖 R1 书签直拆：' + chapters.length + ' 个小类' + (bmc.headersFound ? ' · 大类 ' + bmc.groups.join('/') : '') + '（页码=书签权威值）');
          } else {
            pushLog('🔖 书签 ' + bm.length + ' 条但粒度不像套卷（章数<3），落后续路线');
          }
        }
        // R2 页脚锚点
        if (!chapters) {
          const fa = footerAnchorChapters(pgTxt, pages);
          if (fa) {
            chapters = fa.chapters;
            structSrc = '🦶 页脚锚点（第1页·共N页）';
            pushLog('🦶 R2 页脚锚点：' + chapters.length + ' 套（每套起点由页脚计数器确定）');
          }
        }
        // R3/R4 目录页（文字 → 视觉）
        if (!chapters) {
          let toc = extractBookToc(pgTxt, pages);
          if (!toc && (prefs.bookKind === '习题册' || imgPages.length * 2 >= pages)) {
            try {
              pushLog('📷 R4 目录页文字层不可用，转视觉读目录…');
              toc = await extractBookTocVision({ pages: pages, renderPageImgs: renderPageImgs, aiJson: aiJson });
              if (toc) { toc.viaVision = true; pushLog('📷 视觉目录读取成功：' + toc.entries.length + ' 条'); }
            } catch (e) { pushLog('⚠️ 视觉读目录失败（' + String((e && e.message) || e).slice(0, 100) + '），退回 AI 划分', 'warn'); toc = null; }
          }
          if (toc && toc.chapters.length) {
            chapters = toc.chapters;
            structSrc = (toc.viaVision ? '📷 视觉读目录' : '📑 目录页') + '（第 1-' + toc.tocLastPage + ' 页，' + toc.entries.length + ' 条）';
            pushLog('📑 R3 目录页：' + toc.entries.length + ' 个条目 → ' + chapters.length + ' 个小类（章），页码按目录精确切分' + (toc.headersFound ? '（含层级标题，大类已确定性归组）' : ''));
            // 大类归类：目录自带层级标题时解析阶段已分组；否则一次轻量 AI 调用（失败→全册，结构仍可用）
            if (!toc.headersFound) try {
              const gc = await aiJson(
                [{ role: 'system', content: '我会给出资料目录里的条目列表（编号. 标题）。请按内容把它们归入「大类」——通常是难度层级（如 入门/基础/进阶/强化/冲刺/难）或系列名（如 张宇八套卷/李林四套卷）；若条目本就是同一层级的一组试卷，可整体归为 1 个大类（组名概括书的内容，如 "模拟卷"）。只输出 JSON：{"groups":[{"title":"大类名(≤12字)","ids":[条目编号]}]}。要求：每个编号恰好属于一组、不重不漏；≤12 个大类。' },
                 { role: 'user', content: '【条目】\\n' + toc.entries.map((e, i) => (i + 1) + '. ' + e.title).join('\\n').slice(0, 12000) + '\\n\\n请归类。' }],
                { think: false, temperature: 0.2, maxTokens: 4000 });
              const groupNames = validateBookGroups(gc && gc.groups, chapters.length);
              if (groupNames.some(Boolean)) {
                chapters.forEach((c, i) => { c.group = groupNames[i]; });
                pushLog('🏷 大类归类：' + deriveBookGroups(chapters).map(g => g.title + '(' + g.count + ')').join(' · '));
              }
            } catch (e) { pushLog('⚠️ 大类归类失败（' + String(e.message || e).slice(0, 80) + '），全部归入「全册」', 'warn'); }
          }
        }
        // R4b 宫格定界（v22 纯扫描兜底）：书签/页脚/目录全空但整本以扫描页为主时，
        //   每 12 页一组低分辨率整页图让 VLM 找「新套卷起始页」（方法论 R4）。
        if (!chapters && imgPages.length * 2 >= pages) {
          try {
            pushLog('🧩 书签/页脚/目录均无结构 → 缩略图宫格定界（纯扫描兜底）…');
            const g = await detectSetsByGrid({ pages: pages, renderPageImgs: renderPageImgs, aiJson: aiJson, budgetOk: budgetOk });
            if (g && g.chapters.length) {
              chapters = g.chapters;
              structSrc = '🧩 宫格定界（VLM 找套首页）';
              pushLog('🧩 宫格定界：' + chapters.length + ' 套（起始页 ' + chapters.slice(0, 12).map(c => c.from).join('、') + (chapters.length > 12 ? '…' : '') + '）');
            }
          } catch (e) { pushLog('⚠️ 宫格定界失败（' + String((e && e.message) || e).slice(0, 100) + '）', 'warn'); }
        }
        // R5 AI 逐页摘要划分（最后兜底）
        if (!chapters) {
          structSrc = 'AI 划分';
          const digest = [];
          for (let p = 1; p <= pages; p++) {
            const t = String(pgTxt[p] || '').replace(/\\s+/g, ' ').trim();
            if (t.length >= 40) digest.push('P' + p + ': ' + t.slice(0, 110));
          }
          if (digest.length < 3) throw new Error('无法建立结构：书签/页脚/目录/宫格定界四条路都没拿到结构，且可读文字页过少（' + digest.length + ' 页）——若是纯扫描版合订书，请确认已安装 v22+ 执行器（宫格定界）后重发；仍失败可按套拍照分批导入');
          const outline = await aiJson(
            [{ role: 'system', content: '你是教材结构分析专家。根据一份资料的逐页摘要（P页码: 内容首行）划分章节结构。只输出 JSON：{"chapters":[{"title":"章节名(≤40字)","from":起始页,"to":结束页,"group":"所属大类(≤12字，没有则留空)"}]}。要求：2-150 个章节；页码范围连续、不重叠、覆盖全部有内容的页。粒度=书的一级目录（章/讲），不要拆到小节。【特例】若这份资料是「多套试卷/习题的合集」（每套 2-6 页、标题形如 XX五套卷第N套 / 模拟卷N），则每一套卷单独成章（title 用套卷全名，如 "2024余炳森五套卷第3套"），并按难度层级或系列给出 group（如 入门/进阶/难；同书同层级时 group 可留空）。' },
             { role: 'user', content: '【逐页摘要】（共 ' + pages + ' 页）\\n' + digest.join('\\n') + '\\n\\n请划分章节。' }],
            { think: false, temperature: 0.2, maxTokens: JOB_MAXTOK });
          chapters = (Array.isArray(outline.chapters) ? outline.chapters : [])
            .map(c => ({ title: String((c && c.title) || '未命名章节').slice(0, 40), from: Math.max(1, Number(c && c.from) || 1), to: Math.min(pages, Number(c && c.to) || 1), group: String((c && c.group) || '').trim().slice(0, 12) }))
            .filter(c => c.to >= c.from).slice(0, 150);
          if (!chapters.length) throw new Error('AI 未划分出有效章节');
        }
        pushLog('🗂 章节划分（' + structSrc + '）：' + chapters.length + ' 章 · ' + (chapters.some(c => c.group) ? chapters.length + ' 个小类 / ' + deriveBookGroups(chapters).length + ' 个大类' : '单层级'));

        // 【v19 视觉能力预检】李林做题本事故根因：乱码书全部走视觉，而文本模型挂在宽容网关后时
        // 会「静默丢图」——模型没收到任何图片却照常回 {"content":[],"questions":[]}，
        // 旧版把空结果当正常跳过（无日志），最终只剩一句「模型未产出有效内容」，用户无从下手。
        // 现在开跑前用首页做一次 3 行小测：读不出图上文字 = 模型不支持视觉，立即中止并给出换模型指引。
        // 【v23】2-up 书即使乱码页少也全走视觉 → 预检条件同口径
        const visHeavy = pages > 0 && (imgPages.length * 2 >= pages || !!(RENDER_2UP && RENDER_2UP.pageW > RENDER_2UP.pageH * 1.1));
        if (visHeavy) {
          await setStatus('running', 'parsing', '👁 视觉能力预检…', 16);
          try {
            const probePages = imgPages.slice(0, 2);   // 首页可能是纯封面：带第 2 页，任一页读出文字即通过
            const t1 = await renderPageImgs(probePages);
            if (!t1.length) throw new Error('首页转图失败（pdftoppm 无产出）');
            const probe = await aiJson(
              [{ role: 'system', content: '你是视觉能力探针。给你资料页面图片，只输出 JSON：{"lines":["图中能读到的前 3 行文字原文"]}' },
               { role: 'user', content: [{ type: 'text', text: '请逐字读出第一张图片最靠上的 3 行文字（若全是公式或无文字，读第二张图的标题行；都没有则返回空数组）。' }].concat(t1.map(u => ({ type: 'image_url', image_url: { url: u } }))) }],
              { think: false, temperature: 0, maxTokens: 600 });
            const got = Array.isArray(probe && probe.lines) ? probe.lines.filter(l => String(l).trim().length >= 2) : [];
            if (!got.length) throw new Error('模型对图片返回空内容（典型症状：网关丢弃了图片段 / 模型不支持图片输入）');
            pushLog('👁 视觉预检通过：模型能读图（示例识别：「' + String(got[0]).slice(0, 24) + '」）');
          } catch (e) {
            throw new Error('视觉预检失败——这本书 ' + imgPages.length + '/' + pages + ' 页文字层不可用，整本必须靠视觉模型提取。'
              + '当前模型读不了图（' + String((e && e.message) || e).slice(0, 140) + '）。'
              + '出路：到 设置→AI 把模型换成支持图片输入的视觉模型（如 GLM-4V-Plus / Qwen-VL-Max / GPT-4o / gemini-2.5-flash），保存后回到 ☁️ 云端任务点「♻️ 重发」。');
          }
        }

        // ② 分章提取（并发 3）：要点段落 + 题目，每章独立落盘；【v20】题号审计 + 缺题定向补提
        // 预算闸门 BOOK_VLM/budgetOk 已在 book 分支开头声明（宫格定界/预检/提取/补提共用）
        const out = [];
        let done = 0, emptyN = 0, repairedN = 0;
        const poolRes = await pool(chapters, 3, async (ch, ci) => {
          await cancelCheckpoint();
          const ps = []; for (let p = ch.from; p <= ch.to; p++) ps.push(p);
          const visN = ps.filter(p => imgSet[p]).length;
          // 【v23】2-up 书强制视觉：pdftotext -layout 把左右两半逐行交织，文字通道喂给模型
          //   等于乱序阅读（题号/公式串行）；半页裁切图是唯一可靠读法。
          const is2upBook = !!(RENDER_2UP && RENDER_2UP.pageW > RENDER_2UP.pageH * 1.1);
          const wasVision = visN * 2 >= ps.length || is2upBook;
          let res = { content: [], questions: [] };
          if (wasVision) {
            // 视觉为主（公式页/扫描页占比过半）：整章转图识别，合并各次产出。
            // 【v21 窗口策略】方法论：单次 ≤2 逻辑页最优、≤4 硬顶；跨页题靠窗口重叠兜住。
            //   · 2-up：1 物理页 = 2 半页（逻辑页），窗口 2 物理页 = 4 逻辑页（顶格），步进 1；
            //   · 非 2-up：窗口 2 页步进 1（相邻窗口共享 1 页），跨页解答题至少完整出现一次。
            const is2up = !!(RENDER_2UP && RENDER_2UP.pageW > RENDER_2UP.pageH * 1.1);
            const chunks = [];
            if (ps.length <= 2) chunks.push(ps.slice());
            else for (let i = 0; i < ps.length; i += 1) chunks.push(ps.slice(i, i + 2));
            // 【v28 0 题整章重试】模型对某些页偶发乱码/吐 0 题（李林卷三实测），审计只补「题号有洞」
            //   补不到「整章 0 题」。故窗口全跑完仍 0 题 → 整章窗口重试一次（乱码是瞬时的）。
            async function runVisionWindows(focused) {
              const acc = { content: [], questions: [] };
              const ask = focused
                ? '【重试·只提取题目】上一轮你可能把整页当成讲义散文塞进了 content、questions 交了白卷。这一轮【只输出 questions 数组】：把这几页上每一道题（含选择/填空/解答的题干、选项、答案、解析）逐题提取，题号填 num，一题不落。content 一律留空。'
                : '第一步：先数清楚这几页上一共出现了哪些题号；第二步：逐题输出，一题不落。只输出 JSON。';
              for (const chunk of chunks) {
                if (!chunk.length) continue;
                if (!budgetOk('《' + ch.title + '》P' + chunk.join('+'))) break;
                const pngs = await renderPageImgs(chunk);
                if (!pngs.length) { pushLog('⚠️ 《' + ch.title + '》第 ' + chunk.join('、') + ' 页转图无产出，该窗口跳过', 'warn'); continue; }
                // 【v21 双通道】文字层随图附上做汉字校对（乱码书它多半是噪声，规约已教模型忽略）
                let layerTxt = '';
                for (const p of chunk) layerTxt += '\\n【P' + p + '】' + String(pgTxt[p] || '').slice(0, 3000);
                const vr = await aiJson(
                  [{ role: 'system', content: bookChapterVisionSystem(subject, prefs.bookKind) },
                   { role: 'user', content: [{ type: 'text', text: '【章节】' + ch.title + '（原文页 ' + chunk.join('、') + (is2up ? ' · 每物理页已裁左右半页' : ' · 整页图片') + '）\\n【该页文字层（仅校对汉字数字，公式以图为准）】' + (layerTxt.trim().slice(0, 6000) || '（无）') + '\\n' + ask + '只输出 JSON。' }].concat(pngs.map(u => ({ type: 'image_url', image_url: { url: u } }))) }],
                  { think: false, temperature: focused ? 0.1 : 0.2, maxTokens: 16000 });
                if (Array.isArray(vr.content)) acc.content = acc.content.concat(vr.content);
                if (Array.isArray(vr.questions)) acc.questions = acc.questions.concat(vr.questions);
              }
              return acc;
            }
            res = await runVisionWindows(false);
            // 【v31 0 题重试修正】习题册的命根子是题目：只要 questions==0 就聚焦重试一轮，
            //   不再被「content 塞得很多」挡住（旧条件 content<4 让「要点满、题全空」的章漏网，
            //   实测约四分之一套卷栽在这）。讲义类仍保留 content<4 门槛（纯笔记 0 题正常）。
            if (!res.questions.length && (prefs.bookKind === '习题册' || res.content.length < 4)) {
              pushLog('🩹 《' + ch.title + '》首轮 0 题（模型疑似把题当散文），聚焦重试一轮只逼它出 questions…');
              const retry = await runVisionWindows(true);
              if (retry.questions.length) res = { content: res.content.concat(retry.content), questions: retry.questions };
            }
            if (!res.questions.length && prefs.bookKind === '习题册') {
              pushLog('⚠️ 《' + ch.title + '》两轮仍 0 题——该页可能确无题（纯答案页/图不清），保留要点、标记待人工', 'warn');
            }
            if (!res.content.length && !res.questions.length) {
              emptyN++;
              pushLog('⚠️ 《' + ch.title + '》视觉提取返回空（预检虽过，模型对这几页没读出内容——可重试或换更强的视觉模型）', 'warn');
              return;
            }
          } else {
            // 文字为主（原路径）
            let text = '';
            for (const p of ps) text += '\\n【P' + p + '】\\n' + String(pgTxt[p] || '');
            text = text.trim().slice(0, 24000);
            if (!text) return;
            res = await aiJson(
              [{ role: 'system', content: bookChapterSystem(subject, prefs.bookKind) },
               { role: 'user', content: '【章节】' + ch.title + '（原文页 ' + ch.from + '-' + ch.to + '）\\n【原文】\\n' + text + '\\n\\n请按系统规约提取本章讲义要点与题目，只输出 JSON。' }],
              { think: false, temperature: 0.3, maxTokens: 16000 });
          }
          const content = (Array.isArray(res.content) ? res.content : []).map(x => String(x || '').trim().slice(0, 500)).filter(Boolean).slice(0, 40);
          // 【v31 落库前清洗】剥掉漏网的 C0 控制字符（\\b 退格=0x08、\\f=0x0C 等，来自极少数绕过
          //   jsonRepairEscapes 的输出）与 U+FFFD 乱码替换符——它们会让前端 KaTeX/文本渲染出黑块/断字。
          //   保留 \\t \\n \\r（正常排版）。这是兜底网，主修复在 extractJson 的转义链。
          function cleanCtl(s) {
            return String(s == null ? '' : s)
              .replace(/[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F]/g, '')
              .replace(/\\uFFFD/g, '');
          }
          // 【v20】num 兜底：模型漏给 num 时从题干前缀解析原题号——「18.」「18、」「(18)」「（18）」（李林做题本用括号编号）
          function normQs(list, tag) {
            return (Array.isArray(list) ? list : []).map(function (q, qi) {
              const stem = cleanCtl(q && q.stem).trim().slice(0, 900);
              let n = parseInt(q && q.num, 10);
              if (!(n >= 1)) {
                const m = stem.match(/^\\s*(?:[(（]\\s*(\\d{1,2})\\s*[)）]|(\\d{1,2})\\s*[.、．])/);
                n = m ? parseInt(m[1] || m[2], 10) : 0;
              }
              const cf = Number(q && q.confidence);
              return {
                id: 'bq' + ci + '_' + tag + qi,
                num: n >= 1 && n <= 80 ? n : undefined,
                stem: stem,
                options: Array.isArray(q.options) ? q.options.slice(0, 4).map(o => cleanCtl(o).slice(0, 120)) : undefined,
                answer: cleanCtl((q && q.answer)).trim().slice(0, 200),
                solution: cleanCtl((q && q.solution)).trim().slice(0, 800),
                conf: cf >= 0 && cf <= 1 ? Math.round(cf * 100) / 100 : undefined,
              };
            }).filter(q => q.stem);
          }
          // 滑窗重叠会让同一题号出现两份：按 num 去重，保留题干+解析更全的那份
          function dedupeByNum(list) {
            const byNum = {}, noNum = [];
            list.forEach(function (q) {
              if (!q.num) { noNum.push(q); return; }
              const old = byNum[q.num];
              const rich = (q.stem || '').length + (q.solution || '').length;
              if (!old || rich > (old.stem || '').length + (old.solution || '').length) byNum[q.num] = q;
            });
            return Object.keys(byNum).map(Number).sort(function (a, b) { return a - b; }).map(function (n) { return byNum[n]; }).concat(noNum);
          }
          let questions = dedupeByNum(normQs(res.questions, '')).slice(0, 80);
          // 【v20 缺题审计+定向补提】题号 1..max 有洞 → 拿原文（同通道）只补缺洞题号。
          //   最多两轮：模型第一轮偷懒漏了，第二轮拿「已提取题号清单」逼它只补缺口；
          //   某轮一题都没补回来 → 判定原文确实没有，停止（防无限烧调用）。
          for (let round = 0; round < 2; round++) {
            const miss = auditGapNums(questions);
            if (!miss.length) break;
            try {
              pushLog('🩹 《' + ch.title + '》题号审计缺 ' + miss.length + ' 题（' + miss.join('、') + '），第 ' + (round + 1) + ' 轮定向补提…');
              const got = [];
              if (wasVision) {
                // 【v21】补提窗口与提取一致 2 页/次（2-up 时 2 物理页=4 逻辑页顶格），并吃预算闸门
                for (let i = 0; i < ps.length; i += 2) {
                  const chunk = ps.slice(i, i + 2);
                  if (!budgetOk('补提《' + ch.title + '》P' + chunk.join('+'))) break;
                  const pngs = await renderPageImgs(chunk);
                  if (!pngs.length) continue;
                  const rr = await aiJson(
                    [{ role: 'system', content: bookRepairSystem(ch.title, miss) },
                     { role: 'user', content: [{ type: 'text', text: '【章节】' + ch.title + '（原文页 ' + chunk.join('、') + ' · 整页图片）\\n只输出缺失题号的题目 JSON。' }].concat(pngs.map(u => ({ type: 'image_url', image_url: { url: u } }))) }],
                    { think: false, temperature: 0.2, maxTokens: 12000 });
                  if (Array.isArray(rr.questions)) got.push.apply(got, rr.questions);
                }
              } else {
                let text = '';
                for (const p of ps) text += '\\n【P' + p + '】\\n' + String(pgTxt[p] || '');
                const rr = await aiJson(
                  [{ role: 'system', content: bookRepairSystem(ch.title, miss) },
                   { role: 'user', content: '【章节】' + ch.title + '（原文页 ' + ch.from + '-' + ch.to + '）\\n【原文】\\n' + text.trim().slice(0, 24000) + '\\n\\n只输出缺失题号的题目 JSON。' }],
                  { think: false, temperature: 0.2, maxTokens: 12000 });
                if (Array.isArray(rr.questions)) got.push.apply(got, rr.questions);
              }
              const have = {}; questions.forEach(q => { if (q.num) have[q.num] = 1; });
              let added = 0;
              normQs(got, 'r' + round).forEach(function (q) {
                if (q.num && miss.indexOf(q.num) >= 0 && !have[q.num]) { questions.push(q); have[q.num] = 1; added++; }
              });
              if (added) {
                repairedN += added;
                questions.sort(function (a, b) { return (a.num || 999) - (b.num || 999); });
              }
              const still = auditGapNums(questions);
              if (!still.length) { pushLog('✅ 《' + ch.title + '》补提成功（+' + added + ' 题），题号已连续覆盖'); break; }
              if (!added) { pushLog('⚠️ 《' + ch.title + '》补提后仍缺 ' + still.join('、') + '（两轮无新增，判定原文跳号/图不清，停止补提）', 'warn'); break; }
            } catch (e) { pushLog('⚠️ 《' + ch.title + '》补提失败（' + String((e && e.message) || e).slice(0, 100) + '），保留已提取部分', 'warn'); break; }
          }
          if (!content.length && !questions.length) return;
          out.push({ id: 'ch' + (ci + 1), title: (ch.title || '章节').slice(0, 40), from: ch.from, to: ch.to, group: String(ch.group || '').slice(0, 12), content: content, questions: questions });
          done++;
          await setStatus('running', 'extracting', '📖 已提取 ' + done + '/' + chapters.length + ' 章 · ' + ch.title, 20 + Math.round(done / chapters.length * 70));
        }, (d, n) => { });
        out.sort((a, b) => a.from - b.from);
        const qTotal = out.reduce((a, c) => a + c.questions.length, 0);
        // 【v27 逐章错误可见化】pool 把 worker 异常吞进 results[i].__err（仅 console）。
        //   部分章成功时，失败章此前完全静默（李林 4 卷只出 2 卷却看不到另 2 卷为何崩）。
        //   这里按索引把每个 __err 连同章节标题写进用户可见日志，并汇总计数。
        const errChs = []
        ;(poolRes || []).forEach(function (r, i) { if (r && r.__err) errChs.push({ t: (chapters[i] || {}).title || ('第' + (i + 1) + '章'), e: String(r.__err) }) })
        if (errChs.length) {
          errChs.slice(0, 6).forEach(function (x) { pushLog('⚠️ 章《' + x.t + '》提取失败：' + x.e.slice(0, 160), 'warn') })
          if (errChs.length > 6) pushLog('⚠️ …另有 ' + (errChs.length - 6) + ' 章同类失败', 'warn')
          pushLog('🧮 章节完成度：' + out.length + '/' + chapters.length + ' 章成功，' + errChs.length + ' 章报错，' + emptyN + ' 章空', 'warn')
        }
        if (!out.length) {
          // 【v19】pool 把 worker 异常只记进 results[i].__err（console），用户端日志此前全盲。
          // 最终失败必须带第一个真实错误，否则「模型未产出有效内容」永远猜不动根因。
          const firstErr = (poolRes || []).find(r => r && r.__err);
          throw new Error('全部章节提取失败（' + chapters.length + ' 章：' + emptyN + ' 章返回空' + (firstErr ? '，' + (chapters.length - emptyN) + ' 章报错' : '') + '）'
            + (firstErr ? '。首个错误：' + String(firstErr.__err).slice(0, 220) : '')
            + '——视觉书请确认用的是支持图片输入的模型（GLM-4V/Qwen-VL/GPT-4o 等），换模型后点「♻️ 重发」');
        }
        // 【v21 S4 validate_index】断言③：正文区每页恰好归属一章。缺口并入前章（局部修，不全书重跑）。
        const contentStart = out.length ? out[0].from : 1;
        const cov = validateIndexCoverage(out, contentStart, pages);
        if (cov.gaps.length) {
          pushLog('🧮 validate_index：正文区 ' + contentStart + '-' + pages + ' 有 ' + cov.gaps.length + ' 段未归属 → 并入前章：'
            + cov.gaps.map(g => g[0] + '-' + g[1]).join('，'), 'warn');
          cov.gaps.forEach(function (g) {
            const prev = out.filter(c => c.from < g[0]).pop();
            if (prev && prev.to < g[0]) prev.to = Math.min(g[1], pages);
          });
        } else {
          pushLog('🧮 validate_index 通过：' + out.length + ' 章覆盖 P' + contentStart + '-' + pages + ' 无孤儿页');
        }
        const groups = deriveBookGroups(out);
        const book = {
          id: (job.jobId || 'book') + '-book',
          title: (String(prefs.bookTitle || '').trim() || '未命名资料').slice(0, 60),
          kind: (prefs.bookKind === '习题册' ? '习题册' : '讲义'),
          subject: subject,
          chapters: out, chapterCount: out.length, questionCount: qTotal,
          groups: groups,
          structSrc: structSrc, is2up: !!(RENDER_2UP && RENDER_2UP.pageW > RENDER_2UP.pageH * 1.1),
          basedOnPages: pages, builtBy: 'book-import', generatedAt: new Date().toISOString()
        };
        pushLog('✅ 整本提取完成：' + out.length + ' 章 · ' + qTotal + ' 题 · 视觉调用 ' + BOOK_VLM + '/' + BOOK_BUDGET + (repairedN ? '（含审计补提 ' + repairedN + ' 题）' : '') + (groups.length > 1 || groups[0].title !== '全册' ? '（' + groups.length + ' 个大类：' + groups.map(g => g.title + ' ' + g.count + ' 章').join(' / ') + '）' : ''));
        dropPendingStatus();
        await ghRetry('PATCH', '/gists/' + GIST_ID, { files: {
          'result.json': { content: JSON.stringify({ builtBy: 'book-import', book: book }) },
          'status.json': { content: JSON.stringify({ status: 'done', stage: 'finalizing', msg: '📚 整本提取完成（' + out.length + ' 章 · ' + qTotal + ' 题），可收录到资料库', progress: 100, log: RUN_LOG, updatedAt: new Date().toISOString(), runnerVer: RUNNER_VER, isBook: true }) }
        } });
        log('✅ 资料库任务完成');
        return;
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
    // 【v17 致命修复·资料库】book 模式也必须进 runImport——book 分支就写在 runImport 里面，
    //   旧入口只认 'import'，mode='book' 的任务直接掉进出卷管线（用户实测：四套卷 90+ 题
    //   被当成数一蓝本出了 22 道新题，日志全是「并发出题/总审查/定向重写」）。
    //   回归测试：tests/core/cloudjob-repo.test.ts「book 分发」守门断言。
    if (prefs.mode === 'import' || prefs.mode === 'book') {
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
    // 【v16 蓝本槽位制】结构归位：题型/数量/分值/星级全由蓝本槽位决定，AI 只贡献内容；
    // 缺槽自动补规划一轮，超产弃用——卷面结构永不错位（不再等终检 blueprintCheck 才发现跑偏）。
    // 【注意】续跑路径只规划「剩余缺题」，不是全卷蓝图 —— 跳过归位；score 按题型队列出队
    // （含 0 分行均摊序列，与已落盘题保持同口径），星级 clampStar 兜底。
    if (isResume) {
      var scoreQueuesResume = bpScoreQueues(bp);
      plan.questions.forEach(function (pq) {
        var arr = scoreQueuesResume[pq.type];
        pq.score = (arr && arr.length) ? arr.shift() : scoreForType(bp, pq.type);
        pq.star = clampStar(pq.star);
      });
    } else {
      var rec = reconcilePlanSlots(plan.questions, bp);
      if (rec.extras.length) pushLog('🧹 弃用超产规划题 ' + rec.extras.length + ' 道（题型不符合蓝本槽位）');
      if (rec.missing.length) {
        pushLog('🧩 蓝图归位缺口 ' + rec.missing.length + ' 题（' + rec.missing.map(function (m2) { return m2.label || m2.type; }).join('、') + '），自动补规划…', 'warn');
        try {
          const repair = await aiJson(
            [{ role: 'system', content: plannerSystem(subj, prefs, deriveStyleNote) },
             { role: 'user', content: '【只补规划缺失题位】整卷大部分题位已规划完成，请只补规划以下缺失题位'
               + '（题型/星级/分值必须严格按给定槽位，考点优先取尚未覆盖的薄弱方向，禁止与其他题位重复考点）：\\n'
               + rec.missing.map(function (m2, i2) { return (i2 + 1) + '. type=' + m2.type + ' ★' + m2.star + ' ' + m2.score + ' 分'; }).join('\\n')
               + '\\n只输出 JSON：{"questions":[{"topicName":"考点","type":"…","direction":"…","star":1-5,"score":分值}]}，'
               + '数组长度必须恰好为 ' + rec.missing.length + '，顺序与上述题位一一对应。' }],
            {});
          var repaired = 0;
          (repair && Array.isArray(repair.questions) ? repair.questions : []).forEach(function (q, i2) {
            if (i2 >= rec.missing.length) return;
            var slot = rec.missing[i2];
            q.type = slot.type; q.score = slot.score; q.star = slot.star; q.qid = slot.qid; q._slotLabel = slot.label;
            rec.questions.push(q); repaired++;
          });
          pushLog('🧩 补规划完成：+' + repaired + ' 题' + (repaired < rec.missing.length ? '（仍缺 ' + (rec.missing.length - repaired) + ' 题，终检将如实标记）' : ''));
        } catch (e) {
          pushLog('⚠️ 补规划失败（继续用已归位的题）：' + String((e && e.message) || e).slice(0, 80), 'warn');
        }
      }
      plan.questions = rec.questions;
    }
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
      // 【2026-09-03】出题 AI 经常乱填 score → 按蓝图决定性覆盖；【v16】直接取规划阶段算好的
      // pq.score（含 0 分行均摊值）——旧实现按题型反查，出题阶段在完成顺序上乱序覆盖，
      // 同题型多行（英语一 choice 0.5/2 分）会全部错配到第一行。
      // diff 字段也按 clampStar 反推，避免与 star 自相矛盾。
      out.score = pq.score;
      out.type = pq.type || out.type || 'solve';
      out.star = clampStar(pq.star);   // 【v16 槽位制】星级由蓝本槽位决定（AI 自由发挥不生效）
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
          // 【v16】优先取蓝图规划阶段算好的 pq0.score（含均摊值）；旧题占位/续跑丢失时退回按行反查
          cand.score = (pq0 && pq0.score) || scoreForType(bp, cand.type || (pq0 && pq0.type) || old.type);
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
    // 出题阶段已按蓝本槽位决定性覆盖，理论已对齐；此处兜底防止某个 review/chief 误改了 score。
    // 【v16 护栏】贴齐上限 5 分——差得多说明有题位没出齐（补规划也失败了），把 40 分贴给
    // 最后一题是荒谬的（旧数一卷出现过 0,0,0,0,0,86），如实保留缺口让 blueprintCheck 标记。
    var bpTotal = bpTotalScore(bp);
    var sumScore = questions.reduce(function (a, q) { return a + (Number(q.score) || 0); }, 0);
    if (Math.abs(sumScore - bpTotal) > 0.01 && questions.length && Math.abs(bpTotal - sumScore) <= 5) {
      var drift = +(bpTotal - sumScore).toFixed(2);
      questions[questions.length - 1].score = +((Number(questions[questions.length - 1].score) || 0) + drift).toFixed(2);
      sumScore = questions.reduce(function (a, q) { return a + (Number(q.score) || 0); }, 0);
      pushLog('⚖️ 总分对齐：原 Σ ' + sumScore.toFixed(0) + ' → 强制贴齐蓝图 ' + bpTotal + '（最后一题吸收 ' + drift + ' 分）');
    } else if (Math.abs(sumScore - bpTotal) > 5) {
      pushLog('⚠️ 总分 Σ ' + sumScore + ' ≠ 蓝图 ' + bpTotal + '（差 ' + Math.round(Math.abs(bpTotal - sumScore)) + ' 分，疑有题位未出齐——不做贴齐，如实标记）', 'warn');
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
`;(()=>{try{window.CLOUDJOB_ASSETS={yml:Ag,runner:Tg}}catch{}})();var ue="KaoYanTools_WorkRepo",Ts="ai-exam.yml",Hn="kaoyan2026_wftoken",Es="kaoyan2026_cj_repo_owner",Fi="kaoyan2026_cj_secret_checked",Eg=20;function Re(){return window.U}function oe(){return new Date().toISOString()}function Os(){return window.Store.get().cloudJobs=window.Store.get().cloudJobs||[]}function ye(e){return Os().find(function(t){return t.id===e})}function Ge(e,t){window.Store.update(function(n){n.cloudJobs=n.cloudJobs||[];var r=n.cloudJobs.find(function(s){return s.id===e});r&&Object.keys(t).forEach(function(s){r[s]=t[s]})})}function Ki(e){window.Store.update(function(t){t.cloudJobs=(t.cloudJobs||[]).filter(function(n){return n.id!==e})})}function St(){try{var e=localStorage.getItem(Hn);if(e)return String(e).trim()}catch{}try{var t=window.Store.get(),n=t&&t.cloudJob&&t.cloudJob.wftoken;if(n)return localStorage.setItem(Hn,String(n).trim()),window.Store.update(function(r){r.cloudJob&&delete r.cloudJob.wftoken}),String(n).trim()}catch{}return""}function Og(e){try{e?localStorage.setItem(Hn,String(e).trim()):localStorage.removeItem(Hn)}catch{}try{localStorage.removeItem(Es)}catch{}Qt=null;try{var t=window.Store.get();t&&t.cloudJob&&t.cloudJob.wftoken&&window.Store.update(function(n){n.cloudJob&&delete n.cloudJob.wftoken})}catch{}}function Is(){return!!St()}function Qn(){try{return String(localStorage.getItem(Es)||"").trim()}catch{return""}}var Ut=null;function Vi(e){var t=String(e||"").trim();if(!t)return"";try{localStorage.setItem(Es,t)}catch{}return t}function Ms(){var e=Qn();if(e)return Promise.resolve(e);var t=St();return t?Ut||(Ut=fetch("https://api.github.com/user",{headers:{Authorization:"Bearer "+t,Accept:"application/vnd.github+json"}}).then(function(n){if(n.status!==200)throw new Error("令牌无效（HTTP "+n.status+"），无法确定你的仓库归属");return n.json()}).then(function(n){return Vi(n&&n.login)}).finally(function(){Ut=null}),Ut):Promise.resolve("")}function Wn(){return Ms().catch(function(){return""})}function Ig(){var e=Qn();return e?e+"/"+ue:"{你的用户名}/"+ue}function Ne(){if(!window.Cloud){var e=new Error("云同步模块未加载");throw e.status=0,e}var t=Te.isLoggedIn,n=typeof t=="function"?!!t():!!t;if(!n){var r=new Error("未登录云同步（先到设置页登录 GitHub）");throw r.status=0,r}}var vo={};async function Bt(e,t){var n=await Te.gistReq("/gists/"+e,t?{etag:t}:{});return n}async function kt(e){if(!e)return null;if(e.truncated&&e.raw_url){var t=await fetch(e.raw_url);if(!t.ok)throw new Error("raw 拉取失败 HTTP "+t.status);return await t.text()}return e.content}function Qi(e){var t={"job.json":{content:JSON.stringify({ver:1,jobId:e.id,prefs:e.prefs,createdAt:e.createdAt},null,1)},"status.json":{content:JSON.stringify({status:"queued",stage:"",msg:"已排队，等待执行器接单",progress:0,updatedAt:oe()},null,1)}};if(e._source&&(t["source.json"]={content:e._source}),e._pdf&&e._pdf.data&&e._pdf.data.length){var n=Ps(e._pdf.data);if(n.length>100*1024*1024)throw new Error("试卷文件过大（base64 后 "+Math.round(n.length/1048576)+"MB > 100MB Gist 上限）");t["source.pdf.b64"]={content:n}}return t}function Ps(e){if(typeof Buffer<"u"&&e&&typeof e!="string")try{return Buffer.from(e).toString("base64")}catch{}var t=e instanceof Uint8Array?e:null;if(!t&&typeof e=="object"&&typeof e.length=="number"&&(t=e),!t)return"";for(var n=32768,r=[],s=0;s<t.length;s+=n)r.push(String.fromCharCode.apply(null,t.subarray?t.subarray(s,s+n):Array.prototype.slice.call(t,s,s+n)));return btoa(r.join(""))}async function Xn(e,t){var n=St();if(!n)return!1;var r=await Ms();if(!r)throw new Error("无法确定仓库归属（令牌无效？），请重新保存令牌");var s=await fetch("https://api.github.com/repos/"+r+"/"+ue+"/actions/workflows/"+Ts+"/dispatches",{method:"POST",headers:{Authorization:"Bearer "+n,Accept:"application/vnd.github+json","Content-Type":"application/json"},body:JSON.stringify({ref:"main",inputs:{gist_id:e,resource_gist_id:t||""}})});if(s.status===204)return!0;throw s.status===401||s.status===403?new Error("执行器令牌无效或缺 workflow 权限（HTTP "+s.status+"）"):s.status===404?new Error("执行器尚未安装（仓库 "+r+"/"+ue+" 里没有 ai-exam.yml），先跑安装器"):new Error("触发失败 HTTP "+s.status)}function Mg(e){return typeof btoa=="function"?btoa(unescape(encodeURIComponent(e))):Buffer.from(e,"utf8").toString("base64")}async function Pg(e){if(!window.CLOUDJOB_ASSETS||!window.CLOUDJOB_ASSETS.yml)throw new Error("安装包未随本页构建打入（请用最新构建的页面，或回退手动运行 tools/install_cloudjob.py）");var t=St();if(!t)throw new Error("先在下方粘贴并保存 GitHub PAT（需 workflow + repo 权限），再点一键安装");e&&e("⏳ 校验令牌…");var n=await fetch("https://api.github.com/user",{headers:{Authorization:"Bearer "+t,Accept:"application/vnd.github+json"}});if(n.status===401)throw new Error("令牌无效（HTTP 401），请重新生成 PAT");var r=n.headers.get("X-OAuth-Scopes")||"";if(r.indexOf("workflow")<0)throw new Error("该令牌缺 workflow 权限（scope: "+(r||"无")+"）。请到 GitHub → Settings → Developer settings → PAT 勾选 workflow 后重新生成");var s=await n.json(),o=Vi(s&&s.login);if(!o)throw new Error("令牌未返回用户名，无法确定仓库归属");var i={Authorization:"Bearer "+t,Accept:"application/vnd.github+json","Content-Type":"application/json"};function a(u){return new Promise(function(f){setTimeout(f,u)})}async function c(){e&&e("🔎 检查仓库 "+o+"/"+ue+"…");var u=await fetch("https://api.github.com/repos/"+o+"/"+ue,{headers:i});if(u.status!==200){if(u.status!==404)throw new Error("检查仓库失败 HTTP "+u.status+"（令牌可能缺 repo 权限）");e&&e("🆕 首次使用：正在你名下创建私有仓库 "+ue+"…");var f=await fetch("https://api.github.com/user/repos",{method:"POST",headers:i,body:JSON.stringify({name:ue,private:!0,auto_init:!0,description:"26考研全能作战系统 · 云端出卷执行器仓库（工具自动创建）"})});if(f.status!==201&&f.status!==202)throw f.status===403?new Error("创建仓库被拒（HTTP 403）：fine-grained PAT 需勾选创建用户仓库的权限，或改用 classic PAT 勾选 repo"):new Error("创建仓库失败 HTTP "+f.status);for(var d=0;d<6;d++){await a(1500);var m=await fetch("https://api.github.com/repos/"+o+"/"+ue+"/contents/README.md?ref=main",{headers:i});if(m.status===200)return}}}await c();async function l(u,f,d){for(var m=0;;m++){var p=null;try{var y=await fetch("https://api.github.com/repos/"+o+"/"+ue+"/contents/"+u+"?ref=main",{headers:i});if(y.status===200){var g=await y.json();p=g.sha}}catch{}e&&e((p?"⬆️ 更新 ":"🆕 新建 ")+u+(m>0?"（第 "+m+" 次重试）":"")+" …");var v=await fetch("https://api.github.com/repos/"+o+"/"+ue+"/contents/"+u,{method:"PUT",headers:i,body:JSON.stringify({message:d,content:Mg(f),branch:"main",sha:p})});if(v.status===200||v.status===201)return;if((v.status===409||v.status>=500)&&m<4){await a(1500*(m+1));continue}throw new Error(u+" 上传失败 HTTP "+v.status+(v.status===404?"（仓库或 main 分支未就绪，稍后重试）":v.status===409?"（分支持续冲突，稍后再试）":""))}}return await l(".github/workflows/ai-exam.yml",window.CLOUDJOB_ASSETS.yml,"ci: install cloud exam runner (workflow)"),await l("tools/cloud/ai-exam-runner.cjs",window.CLOUDJOB_ASSETS.runner,"ci: install cloud exam runner (script)"),e&&e("✅ 执行器已上线（"+o+"/"+ue+"）"),!0}function Yn(e){try{var t=window.Store.get().ai||{},n=t.apis||[],r=null,s=!1;if(e){for(var o=0;o<n.length;o++)if(n[o].id===e){r=n[o],s=!0;break}}if(!r){for(var i=0;i<n.length;i++)if(n[i].id===t.activeApi){r=n[i];break}}if(r=r||(t.endpoint?t:null),r&&r.endpoint&&r.key&&r.model)return{endpoint:r.endpoint,key:r.key,model:r.model,_pinned:s}}catch{}return null}function Cs(e){var t=Yn(e);return t&&t._pinned?e:null}function Ns(e){var t=Yn(e);return t?{endpoint:t.endpoint,key:t.key,model:t.model}:null}function Wi(e){var t=/RUNNER_VER\s*=\s*'v(\d+)'/.exec(String(e||""));return t?"v"+t[1]:""}function nn(e){var t=/^v(\d+)$/.exec(String(e||""));return t?parseInt(t[1],10):0}function Nt(){try{return Wi(window.CLOUDJOB_ASSETS&&window.CLOUDJOB_ASSETS.runner||"")}catch{return""}}async function Xi(){var e=St();if(!e)return{ok:!1,fresh:!1,ver:""};var t=await Wn();if(!t)return{ok:!1,fresh:!1,ver:""};var n={Authorization:"Bearer "+e,Accept:"application/vnd.github+json"},r=!1,s="";try{var o=await fetch("https://api.github.com/repos/"+t+"/"+ue+"/contents/.github/workflows/"+Ts+"?ref=main",{headers:n});if(r=o.status===200,r)try{var i=await o.json();if(i&&i.content){var a=String(i.content).replace(/\s+/g,"");try{s=decodeURIComponent(escape(atob(a)))}catch{try{s=atob(a)}catch{s=""}}}}catch{s=""}}catch{return{ok:!1,fresh:!1,ver:""}}if(!r)return{ok:!1,fresh:!1,ver:""};var c=!1,l="";try{var u=await fetch("https://api.github.com/repos/"+t+"/"+ue+"/contents/tools/cloud/ai-exam-runner.cjs?ref=main",{headers:n});if(u.status===200){var f=await u.json(),d="";if(f&&f.content){var a=String(f.content).replace(/\s+/g,"");try{d=decodeURIComponent(escape(atob(a)))}catch{try{d=atob(a)}catch{d=""}}}l=Wi(d);var m=nn(l)>0&&nn(l)>=nn(Nt());c=m||/partial\.json/.test(d)&&/function flushPartial/.test(d)&&/TOOLS:python/.test(d)&&/闭环工作/.test(d)&&/x-ratelimit-remaining/.test(d)}}catch{}return{ok:!0,fresh:c,ver:l,workflowYml:s}}function Yi(){return!!Yn()}async function Cg(e){if(!Is())return{ok:!1,msg:"还没保存执行器令牌（先完成第①步）"};var t=await ra(Object.assign({check:!0},{}));Ge(t.id,{title:"🧪 配置自检 · "+oe().slice(5,16).replace("T"," ")});try{for(var n=0;n<80;n++){await new Promise(function(c){setTimeout(c,3e3)});var r=null;try{r=await js(t.id)}catch{}var s=r&&(r.status==="done"||r.status==="error"||r.status==="canceled");if(e&&e(n+1,r||{status:"unknown"}),s){if(r.status==="done")try{var o=(await Bt(t.gistId)).data,i=await kt(o.files&&o.files["result.json"]),a=JSON.parse(i);return a&&a.cloudJobCheck?{ok:!0,aiConfigPresent:!!a.aiConfigPresent,msg:r.stageMsg||"自检通过"}:{ok:!1,msg:"自检任务完成但未返回校验标记（执行器可能是旧版，点「一键安装」更新）"}}catch(c){return{ok:!1,msg:"读自检结果失败："+(c.message||c)}}return{ok:!1,msg:"自检失败："+(r.error||r.stageMsg||r.status)}}}return{ok:!1,msg:"自检超时（240s 未完成）。排查：① 执行器是否已装 ② secret 是否配对 ③ Actions 是否被禁用（仓库 Settings→Actions→Actions permissions 勾 Allow）。注：secret 是否存在已可即时探测，此处超时多半是 Actions 未跑起来"}}finally{try{Ki(t.id)}catch{}}}async function Ng(){var e=St();if(!e)return!1;var t=await Wn();if(!t)return!1;try{var n=await fetch("https://api.github.com/repos/"+t+"/"+ue+"/actions/secrets",{headers:{Authorization:"Bearer "+e,Accept:"application/vnd.github+json"}});if(n.status!==200)return!1;var r=await n.json(),s=(r&&r.secrets||[]).map(function(o){return o&&o.name});return s.indexOf("CLOUDJOB_GH_TOKEN")>=0}catch{return!1}}async function Lg(){if(Dg())return!0;var e=await Ng();return e&&na(),e}var Qt=null,jg=300*1e3;async function Zi(e){if(!e&&Qt&&Date.now()-Qt.at<jg)return Qt.data;var t=Is(),n=t?await Wn():"",r=t?await Xi():{ok:!1,fresh:!1},s=!!(r&&r.ok),o=n?"https://github.com/"+n+"/"+ue:"https://github.com",i={token:t,repoOwner:n,repoName:ue,runner:s,runnerFresh:!!(r&&r.fresh),runnerVerLocal:Nt(),runnerVerRemote:r&&r.ver||"",workflowAssetSupported:!!(r&&r.workflowYml&&/resource_gist_id/.test(r.workflowYml)),ai:Yi(),secret:await Lg(),runnerUrl:o+"/actions",secretsUrl:n?o+"/settings/secrets/actions":""};return Qt={at:Date.now(),data:i},i}var Ue=-1;function ea(){var e=Qn();return(e||"")+"/"+ue}function ta(){if(!(Ue>=0)){Ue=0;var e=ea();try{var t=window.Store.get(),n=t.cloudJob&&t.cloudJob.secretCheckedTs>0&&t.cloudJob.secretCheckedRepo===e?t.cloudJob.secretCheckedTs:0,r=0;try{var s=localStorage.getItem(Fi);if(s&&s.charAt(0)==="{"){var o=JSON.parse(s);o&&o.ts>0&&o.repo===e&&(r=o.ts)}}catch{}Ue=Math.max(n,r),Ue>0&&Ue>n&&window.Store.update(function(i){i.cloudJob=i.cloudJob||{secretCheckedTs:0},i.cloudJob.secretCheckedTs=Ue,i.cloudJob.secretCheckedRepo=e})}catch{}}}function Dg(){return ta(),Ue>0}function na(){ta(),Ue=Date.now();var e=ea();try{localStorage.setItem(Fi,JSON.stringify({ts:Ue,repo:e}))}catch{}window.Store.update(function(t){t.cloudJob=t.cloudJob||{secretCheckedTs:0},t.cloudJob.secretCheckedTs=Ue,t.cloudJob.secretCheckedRepo=e})}function Ls(e){if(!e||typeof e!="object")return"result 不是对象";if(!Array.isArray(e.questions)||!e.questions.length)return"questions 为空";for(var t=0;t<e.questions.length;t++){var n=e.questions[t];if(!n||!n.stem)return"第"+(t+1)+"题缺题干";if(n.answer==null||n.answer==="")return"第"+(t+1)+"题缺答案";if(n.type==="choice"){if(!Array.isArray(n.options)||n.options.length<2)return"第"+(t+1)+"题选择题缺选项";var r=String(n.answer).trim().charAt(0).toUpperCase(),s=n.options.map(function(o){return String(o||"").trim().charAt(0).toUpperCase()});if(s.indexOf(r)<0)return"第"+(t+1)+"题答案不在选项中"}}return""}function bo(e){if(!e||typeof e!="object")return"内容不是对象";if(!Array.isArray(e.questions)||!e.questions.length)return"没有可抢救的题目";for(var t=0;t<e.questions.length;t++){var n=e.questions[t];if(!n||!n.stem)return"第"+(t+1)+"题缺题干";if(n.answer==null||n.answer==="")return"第"+(t+1)+"题缺答案";if(n.type==="choice"&&(!Array.isArray(n.options)||n.options.length<2))return"第"+(t+1)+"题选择题缺选项"}return""}function xt(e){if(!e||typeof e!="object")return"导入结果不是对象";if(!Array.isArray(e.questions)||!e.questions.length)return"未识别出任何题目（可能是纯图片无文字层，或文件损坏）";for(var t=0;t<e.questions.length;t++){var n=e.questions[t];if(!n||!n.stem||String(n.stem).trim().length<4)return"第"+(t+1)+"题缺题干";n.type==="choice"&&(!Array.isArray(n.options)||n.options.length<2)&&(n.type="solve")}return""}function yt(e,t,n){n=n||{};var r=ye(e);t.id=t.id||(Re()&&Re().uid?Re().uid():e),t.title=t.title||(n.partial?"☁️ 云端押题卷（抢救）":"云端押题卷"),t.subject=t.subject||r&&r.prefs&&r.prefs.subject||"math",t.createdAt=t.createdAt||oe(),t.builtBy=t.builtBy||"cloud",t.cloudJobId=e,t.completedAt=null,t.score=null,t.duration=null,n.imported&&(t.imported=!0,t.needsReview=!0),n.partial&&(t.partial=!0,t.rescued=!0,t.unreviewed=!n.reviewed,t.timeLimit=t.timeLimit||120,t.totalScore=t.totalScore||(t.questions||[]).reduce(function(o,i){return o+(Number(i.score)||5)},0)),window.Store.update(function(o){o.sprintData=o.sprintData||{},o.sprintData.mockExams=o.sprintData.mockExams||[],o.sprintData.mockExams.some(function(i){return i.cloudJobId===e})||o.sprintData.mockExams.unshift(t)});var s={resultImported:!0,status:"done"};return!n.partial&&r&&Array.isArray(r.log)&&r.log.length>30&&(s.log=r.log.slice(-30)),Ge(e,s),t}async function ra(e){Ne(),e=e||{};var t=Re()&&Re().uid?Re().uid():"cj"+Date.now()+Math.random().toString(16).slice(2,8),n={id:t,gistId:"",title:"☁️ 云端押题卷 · "+oe().slice(5,16).replace("T"," "),subject:e.subject||"auto",prefs:{subject:e.subject||"auto",diff:e.diff||"mix",count:e.count||"std",think:!!e.think,maxTokens:parseInt(e.maxTokens,10)||null,blueprint:e.blueprint||null,major:e.major||null,check:!!e.check,ai:Ns(e.apiId),apiId:Cs(e.apiId)},status:"creating",stage:"",stageMsg:"",error:"",wfDispatched:!1,resultImported:!1,createdAt:oe(),submittedAt:oe(),doneAt:""};return Gn(n)}async function qg(e){Ne(),e=e||{};var t=e.mother||{},n=Array.isArray(t.questions)?t.questions:[];if(!n.length)throw new Error("母卷没有题目，无法衍生子卷");var r=nn(Nt());if(r>0&&r<13)throw new Error("本页面打包的执行器是 "+(Nt()||"旧版")+"，尚不支持子母卷（需 v13+）。请使用最新构建的页面，或先重新构建并点「🚀 一键安装」。");var s=e.blueprint&&e.blueprint.types&&e.blueprint.types.length?e.blueprint:null;if(!s){var o={};n.forEach(function(f){var d=(f.type||"solve")+"|"+(Number(f.score)||0);o[d]=(o[d]||0)+1}),s={name:"母卷卷型（自动反推）",subject:e.subject||"math",totalScore:Number(t.totalScore)||n.reduce(function(f,d){return f+(Number(d.score)||0)},0),timeLimit:Number(t.timeLimit)||180,types:Object.keys(o).map(function(f){var d=f.split("|");return{type:d[0],count:o[f],score:Number(d[1])||0}})}}var i={1:0,2:0,3:0,4:0,5:0},a={motherTitle:String(t.title||"母卷").slice(0,60),subject:e.subject||s.subject||"math",blueprint:s,questions:n.slice(0,60).map(function(f,d){var m=Math.min(5,Math.max(1,Math.floor(Number(f.star)||3)));return i[m]++,{no:d+1,type:f.type||"solve",score:Number(f.score)||0,star:m,topicName:String(f.topicName||"").slice(0,50),stemDigest:String(f.stem||"").replace(/\s+/g," ").slice(0,80)}}),starMix:(function(){var f=Math.min(n.length,60),d={};return Object.keys(i).forEach(function(m){d[m]=f?Math.round(i[m]/f*100):0}),d})()},c=JSON.stringify(a);if(c.length>400*1024)throw new Error("母卷指纹过大（"+Math.round(c.length/1024)+"KB > 400KB），无法上传");var l=Re()&&Re().uid?Re().uid():"cj"+Date.now()+Math.random().toString(16).slice(2,8),u={id:l,gistId:"",title:"🧬 子卷 · 仿「"+a.motherTitle.slice(0,14)+"」· "+oe().slice(5,16).replace("T"," "),subject:a.subject,prefs:{subject:a.subject,mode:"derive",diff:e.diff||"mix",count:e.count==="lite"||e.count==="full"?e.count:"std",think:!!e.think,maxTokens:parseInt(e.maxTokens,10)||null,blueprint:s,major:e.major||null,deriveNote:String(e.note||"").slice(0,200),motherTitle:a.motherTitle,motherId:e.motherId||null,ai:Ns(e.apiId),apiId:Cs(e.apiId)},status:"creating",stage:"",stageMsg:"",error:"",wfDispatched:!1,resultImported:!1,isDerive:!0,createdAt:oe(),submittedAt:oe(),doneAt:"",_source:c};return Gn(u)}async function Bg(e){Ne();var t=nn(Nt()),n=e&&e.mode==="book"?30:10,r=e&&e.mode==="book"?"资料库整本导入（需 v30+：书签直拆/2-up裁半/JSON修复）":"试卷导入（需 v10+）";if(t>0&&t<n)throw new Error("本页面打包的执行器是 "+(Nt()||"旧版")+"，尚不支持"+r+"。请使用最新构建的页面，或先重新构建。");e=e||{};var s=e.data;if(s instanceof ArrayBuffer&&(s=new Uint8Array(s)),!s||!s.length)throw new Error("请先选择要导入的试卷文件");var o=(String(e.fileName||"").toLowerCase().match(/\.(\w+)$/)||[])[1]||"pdf";if(o!=="pdf"&&["png","jpg","jpeg","gif","webp"].indexOf(o)<0)throw new Error("不支持的文件类型：."+o+"（仅支持 PDF 与 png/jpg/jpeg/gif/webp 图片）");var i=Re()&&Re().uid?Re().uid():"cj"+Date.now()+Math.random().toString(16).slice(2,8),a=e&&e.mode==="book",c={id:i,gistId:"",title:(a?"📚 导入资料 · ":"📄 导入试卷 · ")+String(e.fileName||"未命名").slice(0,14)+" · "+oe().slice(5,16).replace("T"," "),subject:e.subject||"math",prefs:{subject:e.subject||"math",mode:e.mode||"import",think:!1,bookTitle:e.bookTitle||null,bookKind:e.bookKind||null,importKind:o==="pdf"?"pdf":"image",fileName:String(e.fileName||""),importTitle:String(e.title||"").slice(0,60)||null,importTimeLimit:parseInt(e.timeLimit,10)>0?parseInt(e.timeLimit,10):null,fillAnswers:e.fillAnswers!==!1,ai:Ns(e.apiId),apiId:Cs(e.apiId)},status:"creating",stage:"",stageMsg:"",error:"",wfDispatched:!1,resultImported:!1,isImport:!0,srcSize:s.length,srcName:String(e.fileName||""),createdAt:oe(),submittedAt:oe(),doneAt:"",_pdf:{data:s}},l=null;try{l=await Zi()}catch{l=null}var u=!!(l&&l.workflowAssetSupported);if(u){var f={},d=Ps(s);if(d.length>100*1024*1024)throw new Error("试卷文件过大（base64 后 "+Math.round(d.length/1048576)+"MB > 100MB Gist 上限）");f["source.pdf.b64"]={content:d};var m={description:"[kaoyan2026] exam-import-asset "+i+" "+(e.fileName||""),public:!1,files:f},p=typeof AbortController<"u"?new AbortController:null,y=typeof(e&&e.onProgress)=="function"?e.onProgress:null,g=0,v=0,w=0,S=-1;try{var O=await Te.gistUpload("/gists",m,function(E,L,R){g=E,v=L,w=R,y&&(E===100||E-S>=5)&&(S=E,y(E,L,R,e.fileName||""))},p&&p.signal);if(!O.data||!O.data.id)throw new Error("资源 Gist 创建失败（无法上传试卷源文件）");var M=O.data.id;return c._pdf=null,y&&(y(100,v,w,e.fileName||""),y("stage","🔗 已上传源文件，正在初始化任务…")),Gn(c,{assetGistId:M}).then(function(E){return E._pdf=null,y&&y("stage","✅ 任务已派发，等待云端执行器响应…"),E})}catch(E){throw p&&p.signal.aborted?new Error("上传已取消（已传 "+g+"%）"):E}}return Gn(c).then(function(E){return delete E._pdf,E})}async function Gn(e,t){t=t||{};var n=Qi(e),r=await Te.gistReq("/gists",{method:"POST",body:{description:"[kaoyan2026] "+(e.isImport?"exam-import":"cloud-exam-job")+" "+e.id,public:!1,files:n}});if(!r.data||!r.data.id)throw new Error("创建任务 Gist 失败");e.gistId=r.data.id,t.assetGistId&&(e.assetGistId=t.assetGistId);var s=Object.assign({},e);delete s._pdf,window.Store.update(function(i){i.cloudJobs=i.cloudJobs||[],i.cloudJobs.unshift(s),sa(i.cloudJobs)});try{var o=await Xn(e.gistId,t.assetGistId);Ge(e.id,{status:o?"dispatched":"queued",wfDispatched:!!o,stageMsg:o?"已触发云端执行器，排队启动中…":"已排队（执行器未接入，装好后点「重发」即跑）"})}catch(i){if(t.assetGistId)try{await Te.gistReq("/gists/"+t.assetGistId,{method:"DELETE"})}catch{}throw Ge(e.id,{status:"error",error:i&&i.message||String(i),stageMsg:"触发失败"}),i}return ye(e.id)}async function Rg(e,t){Ne();var n=ye(e);if(!n||!n.gistId)throw new Error("任务不存在");var r=parseInt(t,10)||n.qs&&n.qs.length||0;if(!r)throw new Error("无法确定目标题量（任务没有蓝图记录），请重新出卷");var s=n.partialCount||n.savedCount||0;if(s>=r)throw new Error("题量已满足（"+s+"/"+r+"），无需续跑；可点「抢救已出题目」直接收卷");await Te.gistReq("/gists/"+n.gistId,{method:"PATCH",body:{files:{"job.json":{content:JSON.stringify({ver:1,jobId:n.id,prefs:n.prefs,createdAt:n.createdAt,resume:{target:r,timeLimit:((n.prefs||{}).blueprint||{}).timeLimit||120,from:"partial.json",have:s}},null,1)},"status.json":{content:JSON.stringify({status:"queued",stage:"",msg:"已排队（续跑：补齐剩余 "+(r-s)+" 题）",progress:0,updatedAt:oe()},null,1)}}}});var o=!1;try{o=await Xn(n.gistId)}catch(i){throw Ge(e,{status:"error",error:i&&i.message||String(i),stageMsg:"续跑触发失败"}),i}return Ge(e,{status:o?"dispatched":"queued",wfDispatched:!!o,resultImported:!1,error:"",doneAt:"",resumed:!0,resumeTarget:r,resumeHave:s,stage:"",stageMsg:o?"▶️ 续跑已触发：已有 "+s+" 题，补齐至 "+r+" 题":"续跑已排队（执行器未接入，装好后点「重发」即跑）"}),ye(e)}async function Jg(e){Ne();var t=ye(e);if(!t||!t.gistId)throw new Error("任务不存在");try{var n=await Bt(t.gistId),r=await kt(n.files&&n.files["log.json"]);if(r){var s=null;try{s=JSON.parse(r)}catch{}if(s&&Array.isArray(s.entries)&&s.entries.length)return s}}catch{}return{entries:t.log||[],error:t.error||null,runnerVer:"",at:"",fallback:!0}}function sa(e){for(var t={done:1,error:1,canceled:1},n=e.filter(function(o){return t[o.status]});e.length>Eg&&n.length;){var r=n.shift(),s=e.indexOf(r);s>=0&&e.splice(s,1)}}async function js(e){Ne();var t=ye(e);if(!t||!t.gistId)throw new Error("任务不存在");var n=await Bt(t.gistId,vo[t.gistId]);if(n.status===304)return t;n.etag&&(vo[t.gistId]=n.etag);var r=n.data,s=await kt(r.files&&r.files["status.json"]),o=null;try{o=JSON.parse(s)}catch{}if(!o)throw new Error("status.json 解析失败");var i={status:o.status||"running",stage:o.stage||"",stageMsg:o.msg||"",updatedAtRemote:o.updatedAt||"",progress:typeof o.progress=="number"?o.progress:null,log:Array.isArray(o.log)?o.log:null,qs:Array.isArray(o.qs)?o.qs:null,partialSaved:!!o.partialSaved,partialCount:typeof o.partialCount=="number"?o.partialCount:null,savedCount:typeof o.savedCount=="number"?o.savedCount:null};return o.status==="done"&&(i.doneAt=o.updatedAt||oe()),o.status==="error"&&(i.error=o.msg||"云端执行失败"),t.updatedAtRemote===i.updatedAtRemote&&t.status===i.status?t:(Ge(e,i),ye(e))}async function Hg(e){var t=Os().filter(function(s){return s.status!=="done"&&s.status!=="error"&&s.status!=="canceled"}),n=await Promise.all(t.map(function(s){return js(s.id).then(function(){return null}).catch(function(o){return o})})),r=n.filter(Boolean);return r.length&&!(e&&e.silent)&&console.warn("[CloudJob] 刷新失败",r),r}async function Gg(e){Ne();var t=ye(e);if(!t)throw new Error("任务不存在");if(t.resultImported)throw new Error("该任务成果已导入过（去押题卷列表找）");var n=(await Bt(t.gistId)).data,r=await kt(n.files&&n.files["result.json"]);if(!r)throw new Error("result.json 还没生成（云端可能仍在写或失败）");var s=null;try{s=JSON.parse(r)}catch{throw new Error("result.json 不是合法 JSON")}if(s&&s.cloudJobPending)throw new Error("成品还没生成（云端可能仍在执行或失败，先刷新状态看看）");if(s&&s.builtBy==="book-import"&&s.book){var o=s.book;if(!o.chapters||!o.chapters.length)throw new Error("book 结果为空（云端提取失败）");if(!Array.isArray(o.groups)){var i={};o.groups=[],(o.chapters||[]).forEach(function(u){var f=u&&u.group||"全册";i[f]||(i[f]={title:f,count:0,qCount:0},o.groups.push(i[f])),i[f].count++,i[f].qCount+=(u.questions||[]).length})}Store.update(function(u){u.studyBooks=u.studyBooks||[],!u.studyBooks.some(function(f){return f.id===o.id})&&(o.importedAt=new Date().toISOString(),u.studyBooks.unshift(o))});var a=ye(e);return a&&(a.resultImported=!0),{book:o}}if(s&&(s.imported||s.builtBy==="pdf-import")){var c=xt(s);if(c)throw new Error("导入卷校验未通过："+c);return s.imported=!0,yt(e,s,{imported:!0})}if(t.prefs&&t.prefs.mode==="book")throw new Error("云端返回的不是资料库整本提取结果（执行器可能是 v30 之前的旧版）——请到配置向导点「🚀 一键安装」升级到 v30+ 后点「♻️ 重发」重跑本任务");var l=Ls(s);if(l)throw new Error("成品校验未通过："+l);return yt(e,s,{partial:!1})}async function zg(e){Ne();var t=ye(e);if(!t)throw new Error("任务不存在");if(t.resultImported)throw new Error("该任务成果已导入过（去押题卷列表找）");var n=(await Bt(t.gistId)).data,r=await kt(n.files&&n.files["result.json"]);if(!r)throw new Error("识别结果还没生成（云端可能仍在执行或失败，先刷新状态看看）");var s=null;try{s=JSON.parse(r)}catch{throw new Error("result.json 不是合法 JSON")}if(s&&s.cloudJobPending)throw new Error("识别还没完成（云端可能仍在执行，先刷新状态看看）");if(!(s.imported||s.builtBy==="pdf-import")){var o=!!(t.prefs&&t.prefs.mode==="book");throw new Error(o?"云端返回的不是资料库整本提取结果（执行器可能是 v30 之前的旧版）——请到配置向导点「🚀 一键安装」升级后点「♻️ 重发」重跑本任务":"云端返回的不是导入识别结果（执行器可能是 v9 旧版）——请到配置向导点「🚀 一键安装」升级到 v10 后点「♻️ 重发」重跑本任务")}var i=xt(s);if(i)throw new Error("导入卷校验未通过："+i);return s.imported=!0,s}async function $g(e,t){Ne();var n=ye(e);if(n&&n.resultImported)throw new Error("该任务成果已导入过（去押题卷列表找）");if(!t||!Array.isArray(t.questions)||!t.questions.length)throw new Error("没有可导入的题目（全部被删？）");var r=xt(t);if(r)throw new Error("修订后仍有题目不完整："+r);return t.imported=!0,yt(e,t,{imported:!0})}async function Ug(e){Ne();var t=ye(e);if(!t)throw new Error("任务不存在");if(t.resultImported)throw new Error("该任务成果已导入过（去押题卷列表找）");var n=(await Bt(t.gistId)).data,r=n&&n.files||{},s=await kt(r["result.json"]);if(s){var o=null;try{o=JSON.parse(s)}catch{o=null}if(o&&(o.imported||o.builtBy==="pdf-import")&&Array.isArray(o.questions)&&o.questions.length&&!xt(o))return o.imported=!0,yt(e,o,{imported:!0});if(o&&!o.cloudJobPending&&Array.isArray(o.questions)&&o.questions.length&&!bo(o))return yt(e,o,{partial:!o.chiefReview,reviewed:!!o.chiefReview})}var i=await kt(r["partial.json"]);if(!i)throw new Error("云端没落盘任何题目（执行器在第一题出完前就失败了/或用的是旧版执行器）。旧版执行器不落盘，需在「🛠 配置向导」点一次「🚀 一键安装」升级后再出卷。");var a=null;try{a=JSON.parse(i)}catch{throw new Error("partial.json 不是合法 JSON")}if(!a||!Array.isArray(a.questions)||!a.questions.length)throw new Error("云端已落盘 0 题（partial.json 为空）——执行器一道题都没出成功。");if(a.imported){var c=xt({questions:a.questions});if(c)throw new Error("导入抢救卷校验未通过："+c);var l={title:"📄 导入试卷（抢救 · "+a.questions.length+" 题）",subject:a.subject||t.prefs&&t.prefs.subject||"math",timeLimit:120,totalScore:a.questions.reduce(function(d,m){return d+(Number(m.score)||5)},0),questions:a.questions,imported:!0,builtBy:"pdf-import",generatedAt:a.updatedAt||oe()};return yt(e,l,{imported:!0})}var u=bo(a);if(u)throw new Error("抢救卷校验未通过："+u);var f={title:"☁️ 云端押题卷（抢救 · "+a.questions.length+" 题）",subject:a.subject||t.prefs&&t.prefs.subject||"math",timeLimit:120,totalScore:a.questions.reduce(function(d,m){return d+(Number(m.score)||5)},0),questions:a.questions,builtBy:"cloud-rescue",generatedAt:a.updatedAt||oe()};return yt(e,f,{partial:!0,reviewed:!!a.reviewed})}async function Fg(e,t){Ne(),t=t||{};var n=ye(e);if(!n||!n.gistId)throw new Error("任务不存在");if(n.status==="done")throw new Error("任务已完成，无需取消");var r={"cancel.json":{content:JSON.stringify({canceled:!0,savePartial:t.savePartial!==!1,at:oe()})},"status.json":{content:JSON.stringify({status:"canceled",stage:"",msg:t.savePartial!==!1?"⏹ 正在停止，已出题目尝试保存…":"⏹ 已停止",progress:0,updatedAt:oe()})}};await Te.gistReq("/gists/"+n.gistId,{method:"PATCH",body:{files:r}}),Ge(e,{status:"canceled",stageMsg:"已停止"+(t.savePartial!==!1?"（云端整理已出题目中…）":"")})}async function Kg(e){Ne();var t=ye(e);if(!t||!t.gistId)throw new Error("任务不存在");await Te.gistReq("/gists/"+t.gistId,{method:"PATCH",body:{files:{"status.json":{content:JSON.stringify({status:"queued",stage:"",msg:"重新入队",progress:0,updatedAt:oe()})},"result.json":{content:JSON.stringify({cloudJobPending:!0})},"cancel.json":{content:JSON.stringify({canceled:!1,at:oe()})}}}}),Ge(e,{status:"dispatching",error:"",resultImported:!1,retryAt:oe()});try{var n=await Xn(t.gistId);Ge(e,{status:n?"dispatched":"queued",wfDispatched:!!n,stageMsg:n?"已重新触发执行器":"已排队（执行器未接入）"})}catch(r){throw Ge(e,{status:"error",error:r&&r.message||String(r)}),r}return ye(e)}async function Vg(e){Ne();var t=ye(e);if(t&&t.gistId)try{await Te.gistReq("/gists/"+t.gistId,{method:"DELETE"})}catch(n){if(n.status!==404)throw n}if(t&&t.assetGistId)try{await Te.gistReq("/gists/"+t.assetGistId,{method:"DELETE"})}catch(n){n.status}Ki(e)}var zn={planning:"🧠 总工规划中",generating:"⚙️ 并发出题中",validating:"📐 蓝本校验中",reviewing:"🔍 总审查中",rewriting:"🔧 定向重写中",finalizing:"✅ 终检打包中",parsing:"🧾 解析试卷中",extracting:"🔎 AI 拆题识别中"},Qg=["planning","generating","reviewing","rewriting","finalizing"],Zn={creating:{label:"创建中",cls:"#8c8c8c"},queued:{label:"已排队",cls:"#d46b08"},dispatched:{label:"已派发",cls:"#096dd9"},running:{label:"执行中",cls:"#722ed1"},done:{label:"✅ 完成",cls:"#237804"},error:{label:"🔴 失败",cls:"#cf1322"},canceled:{label:"已取消",cls:"#8c8c8c"}};function oa(e){if(e.stage&&zn[e.stage])return zn[e.stage];var t=Zn[e.status]||{label:e.status||"?"};return t.label}function ia(e){var t=Zn[e.status];return t?t.cls:"#8c8c8c"}const Wg={submit:ra,submitImport:Bg,submitDerive:qg,refresh:js,refreshAll:Hg,collectResult:Gg,collectPartial:Ug,collectImportPreview:zg,confirmImportExam:$g,cancel:Fg,retry:Kg,remove:Vg,resumeJob:Rg,fetchLog:Jg,installRunner:Pg,getSetup:Zi,runCheck:Cg,markSecretChecked:na,aiReady:Yi,aiConfig:Yn,list:Os,find:ye,getToken:St,setToken:Og,hasToken:Is,repoOwner:Qn,resolveOwner:Ms,resolveOwnerSafe:Wn,repoFull:Ig,dispatch:Xn,runnerInstalled:Xi,REPO_NAME:ue,WF_FILE:Ts,STAGE_CN:zn,STAGE_ORDER:Qg,STATUS_META:Zn,stageLabel:oa,statusColor:ia,validateResultExam:Ls,validateImportedExam:xt};typeof module<"u"&&module.exports&&(module.exports={_pure:{validateResultExam:Ls,validateImportedExam:xt,gistFiles:Qi,u8ToB64:Ps,stageLabel:oa,statusColor:ia,trimJobs:sa,STATUS_META:Zn,STAGE_CN:zn}});const Ds={ensurePermission(){if(!("Notification"in window))return!1;if(Notification.permission==="default")try{Notification.requestPermission()}catch{}return Notification.permission==="granted"},send(e,t){if(Ds.ensurePermission())try{new Notification(e,{body:t});return}catch{}Q.show("🔔 "+e+"："+t,"info",5e3)}},Rr=30,Xg=700;function Ee(){const e=b.get();return e.aiMemory||(e.aiMemory={profile:"",facts:[],reflectCount:0,updatedAt:""}),e.aiMemory.facts||(e.aiMemory.facts=[]),e.aiMemory}function Lt(e){return(e||"").replace(/\s+/g,"").slice(0,60)}function wo(e){return(e.pinned?1e4:0)+(e.hits||1)*10+Math.min(9,Math.floor((Date.now()-new Date(e.updatedAt||e.createdAt).getTime())/x.DAY_MS)*-1)}function er(e){return e.slice().sort(function(t,n){return wo(n)-wo(t)})}function Yg(e){if(e.facts.length<=Rr)return;const n=er(e.facts).slice(0,Rr),r={};n.forEach(function(s){r[s.id]=!0}),e.facts=e.facts.filter(function(s){return r[s.id]})}function qs(e,t,n,r){if(e=(e||"").trim(),!e||e.length<4)return null;e.length>80&&(e=e.slice(0,80));const s=new Date().toISOString();let o=null;return b.update(function(i){const a=Ee(),c=Lt(e);for(let u=0;u<a.facts.length;u++){const f=a.facts[u];if(r&&f.sigKey===r||Lt(f.text)===c){f.text=e,f.hits=(f.hits||1)+1,f.updatedAt=s,t&&(f.kind=t),o=f,a.updatedAt=s;return}}const l={id:x.uid(),text:e,kind:t||"context",hits:1,createdAt:s,updatedAt:s,pinned:!1,source:n||"ai"};r&&(l.sigKey=r),a.facts.push(l),Yg(a),a.updatedAt=s,o=l}),o}function aa(e){const t=Lt(e);if(!t)return!1;let n=!1;return b.update(function(r){const s=Ee();s.facts.forEach(function(o){(Lt(o.text)===t||o.text.indexOf(t.slice(0,12))>=0)&&(o.hits=(o.hits||1)+1,o.updatedAt=new Date().toISOString(),n=!0)}),n&&(s.updatedAt=new Date().toISOString())}),n}function Zg(e){b.update(function(t){const n=Ee();n.facts=n.facts.filter(function(r){return r.id!==e}),n.updatedAt=new Date().toISOString()})}function em(e){b.update(function(t){Ee().facts.forEach(function(r){r.id===e&&(r.pinned=!r.pinned)})})}function ca(e){b.update(function(t){const n=Ee();n.profile=(e||"").slice(0,400),n.updatedAt=new Date().toISOString()})}function tm(e){e=e||Xg;const t=Ee();let n="";t.profile&&(n+="【考生画像】"+t.profile+`
`);const r=er(t.facts);let s=n.length;const o=[];for(let i=0;i<r.length;i++){const a="- "+r[i].text;if(s+a.length+1>e)break;o.push(a),s+=a.length+1}return o.length&&(n+=`【关于考生的记忆】
`+o.join(`
`)+`
请在回复中体现你对他的了解，但不要机械复述记忆条目。`),n.trim()}function nm(){try{const e=b.get(),t=b.mistakeCountWeek("sign");je("sig-sign",t>=3?"近期符号错误频发（本周"+t+"次），做题需强制验算":null,"weakness");const n=b.weekTopMistakes(),r={sign:"符号错误",fraction:"分式处理",integral:"积分",concept:"概念不清",careless:"粗心",other:"其他"};je("sig-toperr",n&&n.length&&n[0].count>=2?"本周主要错误类型是「"+(r[n[0].key]||n[0].key)+"」（"+n[0].count+"次）":null,"weakness");const s=b.currentMathAccuracy();je("sig-acc",s!=null&&s<70?"当前数学正确率仅"+s+"%，低于安全线70%":null,"weakness");const o=b.weekHours();if(o.filter(function(d){return d>0}).length>=2){const d=x.round1(x.sum(o)/7),m=(e.settings.weeklyTargetHours||50)/7;je("sig-pace",d<m*.7?"本周日均学习"+d+"h，明显低于目标"+x.round1(m)+"h":null,"habit")}b.subjectDoneInDays("math",3)?Wt("sig-idle-math"):je("sig-idle-math","已连续3天没有完成数学任务","habit"),b.subjectDoneInDays("ctrl",3)?Wt("sig-idle-ctrl"):je("sig-idle-ctrl","已连续3天没有碰专业课","habit");const a=(e.mental||[]).slice(-3);a.length>=3&&a.every(function(d){return d.mood<=5})?je("sig-mood","近3天心情持续偏低（≤5分），需要关注状态","habit"):Wt("sig-mood"),e.weaknessProfile&&e.weaknessProfile.weakAreas&&e.weaknessProfile.weakAreas.length?je("sig-weakareas","拍题暴露的薄弱点："+e.weaknessProfile.weakAreas.slice(0,3).join("、"),"weakness"):Wt("sig-weakareas");const c=sm();let l=null,u=0;Object.keys(c).forEach(function(d){c[d]>u&&(u=c[d],l=d)}),je("sig-strength",u>=3?"本周在"+(rm[l]||l)+"上投入最多（完成"+u+"项任务）":null,"habit");const f=b.studyStreak();je("sig-streak",f>=3?"已连续学习"+f+"天，节奏稳定":null,"habit")}catch{}}function je(e,t,n){if(!t){Wt(e);return}qs(t,n,"system",e)}function Wt(e){b.update(function(t){const n=Ee();n.facts=n.facts.filter(function(r){return r.sigKey!==e})})}const rm={math:"数学",ctrl:"专业课",eng:"英语",pol:"政治"};function sm(){const e=b.get(),t={math:0,ctrl:0,eng:0,pol:0};return x.weekKeys().forEach(function(n){if(n===x.dkey()){const r=e.completions[n]||[];e.tasks.forEach(function(s){t[s.subject]!=null&&(s.done||r.indexOf(s.id)>=0)&&t[s.subject]++})}else(e.taskArchive[n]||[]).forEach(function(r){t[r.subject]!=null&&r.done&&t[r.subject]++})}),t}function Bs(){try{const e=b.get(),t=x.dkey();let n=0;(e.polRecite||[]).forEach(function(s){s.due&&s.due<=t&&n++}),(e.vocab||[]).forEach(function(s){s.due&&s.due<=t&&n++});const r=e.reading&&e.reading.cards||{};return Object.keys(r).forEach(function(s){r[s].due&&r[s].due<=t&&n++}),n}catch{return 0}}function om(e){e=e||{};const t=e.exclude||[];try{let n=function(f,d,m,p,y){o||!d||t.indexOf(f)>=0||(o={key:f,tab:p,preset:m,action:{type:"goto",tab:p,label:y}})};const r=b.get(),s=b.studyStreak()>0||Object.keys(r.completions||{}).length>0||r.tasks&&r.tasks.length>0;let o=null;s&&(n("idle-math",!b.subjectDoneInDays("math",3),"已经三天没碰数学了。今天必须补上，先两道真题找手感，别再拖。","scheduler","→ 现在去补数学"),n("idle-ctrl",!o&&!b.subjectDoneInDays("ctrl",3),"专业课冷了三天。核心考点最忌断档，今天固定一小时把它捡回来。","scheduler","→ 去捡专业课"));const i=Bs();n("due-backlog",i>=8,"你有 "+i+" 项复习到期了。记忆不复习就是白学，先清一批到期的。","dashboard","→ 去清到期复习");const a=b.currentMathAccuracy();n("low-acc",a!=null&&a<70,"数学正确率还在 "+a+"%，低于安全线。别刷新题，回头把错题按类型吃透。","mistakes","→ 去吃透错题");const c=(r.mental||[]).slice(-3);n("low-mood",c.length>=3&&c.every(function(f){return f.mood<=5}),"连着几天状态都不高。别硬扛，把今天目标砍到能完成，稳住比冲刺重要。","mental","→ 去记录状态");const l=b.weekHours();if(l.filter(function(f){return f>0}).length>=2){const f=x.round1(x.sum(l)/7),d=(r.settings.weeklyTargetHours||50)/7;n("slow-pace",f<d*.7,"本周日均才 "+f+" 小时，离目标差一截。今天多挤一个番茄钟出来。","focus","→ 去挤一个番茄钟")}if(new Date().getHours()>=18){const f=b.todayTaskStats();let d=0,m=0;Object.keys(f).forEach(function(p){d+=f[p][0],m+=f[p][1]}),n("late-undone",m>0&&d*2<m,"都这个点了今天任务还没过半。挑最重要的两件先干完，别让今天空过。","scheduler","→ 去挑两件干完")}return o}catch{return null}}const ko={"idle-math":"补数学","idle-ctrl":"捡专业课","due-backlog":"清到期复习","low-acc":"吃透错题","low-mood":"关注状态","slow-pace":"加时长","late-undone":"晚间清任务","ai-daily":"AI全智能建议"};function Rs(){const e=b.get();return e.ai.superviseLog||(e.ai.superviseLog=[]),e.ai.superviseLog}function im(e,t,n){b.update(function(r){for(r.ai.superviseLog||(r.ai.superviseLog=[]),r.ai.superviseLog.push({date:e,key:t,slot:n||"am",outcome:null});r.ai.superviseLog.length>14;)r.ai.superviseLog.shift();r.ai.lastSupervise={date:e,key:t,slot:n||"am"}})}function xo(e,t){const n=b.get();if(e===x.dkey()){const r=n.completions[e]||[];return n.tasks.some(function(s){return s.subject===t&&(s.done||r.indexOf(s.id)>=0)})}return(n.taskArchive[e]||[]).some(function(r){return r.subject===t&&r.done})}function am(e){const t=b.get();if(e===x.dkey()){const r=b.todayTaskStats();let s=0,o=0;return Object.keys(r).forEach(function(i){s+=r[i][0],o+=r[i][1]}),o?s/o:null}const n=t.taskArchive[e]||[];return n.length?n.filter(function(r){return r.done}).length/n.length:null}function cm(){const e=Rs();let t=null;for(let r=e.length-1;r>=0;r--)if(e[r].outcome==null&&e[r].date!==x.dkey()){t=e[r];break}if(!t)return null;let n=null;try{switch(t.key){case"idle-math":n=xo(t.date,"math");break;case"idle-ctrl":n=xo(t.date,"ctrl");break;case"due-backlog":n=Bs()<=4;break;case"low-acc":{const r=b.currentMathAccuracy();r!=null?n=r>=70:n=(b.get().quizHistory||[]).some(function(s){return x.isoDay(s.createdAt)>=t.date});break}case"low-mood":{const r=(b.get().mental||[]).slice(-1)[0];n=r?r.mood>=6:null;break}case"slow-pace":{const r=b.get().studyHours[t.date]||0;n=r>=4?!0:r>0?!1:null;break}case"late-undone":{const r=am(t.date);n=r==null?null:r>=.5;break}default:{const r=b.get(),s=r.studyHours[t.date]||0,o=(r.completions[t.date]||[]).length,i=(r.mental||[]).some(function(a){return a.date===t.date});n=s>0||o>0||i?!0:null}}}catch{n=null}return n!=null&&(b.update(function(r){(r.ai.superviseLog||[]).forEach(function(s){s.date===t.date&&s.key===t.key&&s.slot===t.slot&&(s.outcome=n)})}),t.outcome=n,n===!0?je("sig-sv-react","对督学有回应：被督促「"+(ko[t.key]||t.key)+"」后执行了","preference"):la().indexOf(t.key)>=0&&je("sig-sv-mute-"+t.key,"对「"+(ko[t.key]||t.key)+"」类督促反复无行动，唠叨无效，换角度或暂放","preference")),t}function la(){const e={};return Rs().forEach(function(t){t.outcome===!1&&(e[t.key]=(e[t.key]||0)+1)}),Object.keys(e).filter(function(t){return e[t]>=2})}function lm(){try{const e=b.get();if(!K.configured()||e.ai.memAuto===!1)return!1;const t=Ee().lastConsolidate;return t?Date.now()-new Date(t).getTime()>=7*x.DAY_MS:!0}catch{return!1}}function um(){return'你是考研教练的“记忆官”，现在做每周记忆巩固。基于考生的全部长期记忆与画像，做一次去冗余与升华。只输出 JSON，不要多余文字、不要 markdown 代码块。格式：{"add":[{"text":"新提炼的稳定规律(≤40字)","kind":"weakness|habit|preference|goal|context|pattern"}],"reinforce":["值得强化保留的记忆原文片段"],"remove":["重复/过时/太琐碎应删除的记忆原文片段"],"profile":"重写后的考生画像一段话(≤140字，更立体：弱点·习惯·偏好·最佳状态·目标)"}。规则：1) 合并语义重复项，只留最凝练一条；2) remove 一次性或已过时的；3) add 最多3条真正跨周有用的规律；4) 简体中文。'}function So(){b.update(function(e){e.aiMemory.lastConsolidate=x.dkey()})}function dm(){if(!K.configured())return Promise.resolve(!1);const e=Ee(),t=er(e.facts);if(!t.length&&!e.profile)return So(),Promise.resolve(!1);const n="【当前画像】"+(e.profile||"（空）")+`
【全部记忆事实】
`+t.map(function(r){return"- ["+(r.kind||"context")+"] "+r.text+"（命中"+(r.hits||1)+"）"}).join(`
`);return K.chatJSON(um(),n,null,{noTools:!0}).then(function(r){return da(r),So(),!0}).catch(function(){return!1})}function fm(){return'你是一名考研教练的"记忆官"。根据教练与考生的最近对话和已有记忆，提取值得长期记住的事实。只输出 JSON，不要多余文字、不要 markdown 代码块。格式：{"add":[{"text":"一句话事实(≤40字)","kind":"weakness|habit|preference|goal|context"}],"reinforce":["已有记忆中被再次验证的原文片段"],"remove":["已过时/被纠正的记忆原文片段"],"profile":"重写后的考生画像一段话(≤120字，融合新旧认知，无变化则原样返回)"}。规则：1) 只沉淀稳定的、跨会话有用的认知（弱点/习惯/偏好/目标/背景），不要记录一次性闲聊；2) add 最多3条，宁缺毋滥；3) reinforce/remove 引用【已有记忆】中的原文；4) 简体中文。'}function ua(e){const t=b.get();if(!K.configured()||t.ai.memAuto===!1||!e||e.length<30)return Promise.resolve(!1);const n=Ee(),r=n.facts.map(function(o){return o.text}).slice(0,30),s="【当前画像】"+(n.profile||"（空）")+`
【已有记忆】
`+(r.length?r.map(function(o){return"- "+o}).join(`
`):"（无）")+`
【最近对话】
`+e.slice(-3e3);return K.chatJSON(fm(),s,null,{noTools:!0}).then(function(o){return da(o),b.update(function(i){i.aiMemory.reflectCount=(i.aiMemory.reflectCount||0)+1}),!0}).catch(function(){return!1})}function da(e){e&&(e.profile&&typeof e.profile=="string"&&ca(e.profile),(e.add||[]).slice(0,3).forEach(function(t){t&&t.text&&qs(t.text,t.kind||"context","ai")}),(e.reinforce||[]).slice(0,5).forEach(function(t){t&&aa(t)}),(e.remove||[]).slice(0,5).forEach(function(t){if(!t)return;const n=Lt(t);b.update(function(r){const s=Ee();s.facts=s.facts.filter(function(o){return Lt(o.text)!==n&&o.text.indexOf(n.slice(0,12))<0})})}))}let rn=[];function pm(e,t){const n="["+x.hm()+"] "+e+(t?"："+t:"");rn.push(n),rn.length>=4&&fa()}function fa(){if(!rn.length)return;const e=`考生近期行为事件：
`+rn.join(`
`);rn=[],ua(e)}function hm(){const e=Ee();return{facts:e.facts.length,pinned:e.facts.filter(function(t){return t.pinned}).length,aiFacts:e.facts.filter(function(t){return t.source==="ai"}).length,hasProfile:!!e.profile,reflectCount:e.reflectCount||0,updatedAt:e.updatedAt||""}}const On={MAX_FACTS:Rr,digest:tm,addFact:qs,reinforceByText:aa,removeFact:Zg,togglePin:em,setProfile:ca,syncLocalSignals:nm,dueBacklog:Bs,superviseSuggestion:om,logSupervise:im,evalLastOutcome:cm,mutedSuperviseKeys:la,superviseLog:function(){return Rs().slice()},consolidateDue:lm,weeklyConsolidate:dm,reflect:ua,recordEvent:pm,flushEvents:fa,stats:hm,list:function(){return er(Ee().facts)},profile:function(){return Ee().profile||""}},pa={scoreToLevel(e){return e=+e,isNaN(e)?0:e>=80?2:e>=50?1:0},effScore(e){return e?typeof e.score=="number"&&!isNaN(e.score)?Math.round(e.score):e.level===2?85:e.level===1?60:e.level===0?30:null:null},recordAnswer(e){if(!e||!e.topicId||typeof e.score!="number")return;const t=pa.scoreToLevel(e.score),n=new Date().toISOString();b.update(function(r){if(r.heat=r.heat||{},r.heat[e.topicId]={level:t,score:e.score,updatedAt:n},r.heatHistory=r.heatHistory||{},r.heatHistory[e.topicId]=r.heatHistory[e.topicId]||[],r.heatHistory[e.topicId].push({score:e.score,level:t,at:n}),r.heatHistory[e.topicId].length>30&&(r.heatHistory[e.topicId]=r.heatHistory[e.topicId].slice(-30)),!e.noMistake&&e.score<80&&e.errorType&&e.errorType!=="none"){r.mistakes=r.mistakes||[];const s=e.sourceLabel||"测验";r.mistakes.push({id:x.uid(),subject:e.subject||"math",type:e.errorType,desc:"【"+s+"】"+e.topicName+"："+(e.comment||"作答有误"),stem:e.stem||"",answer:e.answer||"",solution:e.solution||"",trap:e.trap||"",refId:e.topicId,source:e.source||"quiz",dedupKey:(e.source||"quiz")+":"+e.topicId+":"+x.shortDate(),date:x.shortDate(),createdAt:n})}if(e.tier===1&&e.score<(e.penaltyBelow!=null?e.penaltyBelow:90)){const s=e.penaltyCount||5;r.mistakeDrills=r.mistakeDrills||[];for(let o=0;o<s;o++)r.mistakeDrills.push({id:x.uid(),source:"topic",refId:e.topicId,title:"【罚练】"+e.topicName+" 同类题 "+(o+1)+"/"+s,subject:e.subject||"math",status:"pending",penaltyOf:e.topicId,createdAt:n})}r.quizHistory=r.quizHistory||[],r.quizHistory.push({id:x.uid(),topicId:e.topicId,topicName:e.topicName,score:e.score,verdict:e.verdict||"",date:x.shortDate(),createdAt:n,source:e.source||"quiz"}),r.quizHistory.length>100&&(r.quizHistory=r.quizHistory.slice(-100))});try{b.recomputeMathAccuracy&&b.recomputeMathAccuracy()}catch{}}},ha={},G=ha;G.LATEX_RULE="【LaTeX 格式硬约束】所有数学公式必须用标准 LaTeX 反斜杠命令（如 \\frac{a}{b}、\\int_a^b、\\pi、\\sqrt{x}、\\sin x、\\begin{vmatrix}…\\end{vmatrix}、\\begin{cases}…\\end{cases}），**严禁用 | 竖线代替反斜杠**。矩阵用 \\begin{vmatrix}/\\begin{bmatrix} 环境，分段函数用 \\begin{cases} 环境，公式用 $…$ 包裹。【格式细节】① 带参数命令必须用花括号：\\frac{1}{t^3}（严禁漏花括号写成 \\frac1t3），\\mathbb{E}[X]（严禁 \\mathbbE），\\operatorname{rank}(A)；② 上下标必带花括号：e^{-x}（严禁 e-x），x^{2}、A^3-3A^2+3A（指数超过一位必带 {}）；③ 区间/属于用 \\in（**严禁 \\ln**——对数 \\ln 不是属于！），\\to（**严禁裸 \\to**——必须双反斜杠或写作 \\to），\\Leftrightarrow，\\geqslant/\\leqslant；④ 微分写作 \\mathrm{d}x 或直接 dx，禁写成 |dx（|dx 是 pipe 不会渲染）。";G.SUBJ_NAME={math:"数学",ctrl:"专业课",eng:"英语",pol:"政治"};G.SUBJ_ORDER=["math","ctrl","eng","pol"];G.starToDiff=function(e){var t=Math.max(1,Math.min(5,Math.floor(Number(e)||3)));return t<=2?"easy":t===3?"medium":"hard"};G.starOf=function(e){var t=Number(e&&e.star);return t>=1&&t<=5?Math.round(t):{easy:2,medium:3,hard:5}[e&&e.diff||"medium"]||3};G.forceStarMix=function(e,t){if(!t||!e||!e.length)return e;for(var n=e.length,r={1:0,2:0,3:0,4:0,5:0},s=0,o=n,i=1;i<=5;i++){var a=Number(t[i])||0;if(a>0&&o>0){var c=Math.round(n*a/100);c>o&&(c=o),r[i]=c,s+=c,o-=c}}s<n&&(r[3]+=n-s);for(var l={},u=1;u<=5;u++)l[u]=[];e.forEach(function(S,O){l[G.starOf(S)]=l[G.starOf(S)]||[],l[G.starOf(S)].push(O)});for(var f=1;f<=5;f++){for(var d=r[f],m=l[f]||[],p=0,y=0;y<m.length&&p<d;y++)e[m[y]].star=f,p++;for(;p<d;)if(l[3]&&l[3].length){var g=l[3].shift();if(g!=null)e[g].star=f,p++;else break}else if(l[4]&&l[4].length){var v=l[4].shift();if(v!=null)e[v].star=f,p++;else break}else if(l[2]&&l[2].length){var w=l[2].shift();if(w!=null)e[w].star=f,p++;else break}else break}return e.forEach(function(S){S.diff=G.starToDiff(G.starOf(S))}),e};G.forceDiff=function(e,t,n){if(n&&typeof G.forceStarMix=="function")return G.forceStarMix(e,n);var r=t==="hard"?.7:t==="superhard"?1:.4,s=Math.round(e.length*r),o=[],i=[],a=[];for(e.forEach(function(f,d){var m=G.starOf(f);m>=4?o.push(d):m===3?i.push(d):a.push(d)});o.length<s&&(i.length||a.length);){var c=i.length?i.shift():a.shift();e[c].star=4,o.push(c)}for(;o.length>s;){var l=o.filter(function(f){return G.starOf(e[f])===4});if(l.length||(l=o.filter(function(f){return G.starOf(e[f])>=5})),!l.length)break;var u=l[0];e[u].star=3,o.splice(o.indexOf(u),1)}return e.forEach(function(f){f.star=G.starOf(f),f.diff=G.starToDiff(f.star)}),e};var ga={choice:"选择题",fill:"填空题",solve:"解答题",essay:"写作题"};G.bpTypeName=function(e){return ga[e]||"解答题"};G.BLUEPRINT_PRESETS={shuyi:{name:"数一标准卷",subject:"math",totalScore:150,timeLimit:180,types:[{type:"choice",count:10,score:4},{type:"fill",count:6,score:4},{type:"solve",count:6,score:0}],starMix:{1:5,2:20,3:35,4:30,5:10}},shu2:{name:"数二标准卷",subject:"math",totalScore:150,timeLimit:180,types:[{type:"choice",count:10,score:4},{type:"fill",count:6,score:4},{type:"solve",count:6,score:0}],starMix:{1:8,2:22,3:35,4:25,5:10}},shu3:{name:"数三标准卷",subject:"math",totalScore:150,timeLimit:180,types:[{type:"choice",count:10,score:3},{type:"fill",count:10,score:3},{type:"solve",count:5,score:0}],starMix:{1:10,2:25,3:40,4:20,5:5}},yingyi:{name:"英语一标准卷",subject:"eng",totalScore:100,timeLimit:180,types:[{type:"fill",count:5,score:1},{type:"choice",count:10,score:2},{type:"essay",count:2,score:15},{type:"solve",count:1,score:0}],starMix:{1:5,2:20,3:40,4:30,5:5}},ying2:{name:"英语二标准卷",subject:"eng",totalScore:100,timeLimit:180,types:[{type:"fill",count:10,score:1},{type:"choice",count:15,score:2},{type:"essay",count:2,score:15},{type:"solve",count:1,score:0}],starMix:{1:8,2:22,3:40,4:25,5:5}},ctrl:{name:"专业课标准卷",subject:"ctrl",totalScore:150,timeLimit:180,types:[{type:"choice",count:20,score:1},{type:"fill",count:10,score:2},{type:"solve",count:6,score:0}],starMix:{1:10,2:20,3:35,4:30,5:5}},pol:{name:"政治标准卷",subject:"pol",totalScore:100,timeLimit:180,types:[{type:"choice",count:16,score:1},{type:"choice",count:17,score:2,label:"多选题"},{type:"solve",count:5,score:0}],starMix:{1:10,2:25,3:40,4:20,5:5}}};G.SUBJ_TO_PRESET={math:"shuyi",ctrl:"ctrl",eng:"yingyi",pol:"pol"};G.normalizeBlueprint=function(e,t){e=e&&typeof e=="object"?e:{};var n=G.BLUEPRINT_PRESETS[G.SUBJ_TO_PRESET[t]||"shuyi"]||G.BLUEPRINT_PRESETS.shuyi,r={preset:typeof e.preset=="string"?e.preset:G.SUBJ_TO_PRESET[t]||"custom",name:e.name||n.name,subject:e.subject||t||n.subject,totalScore:Math.max(10,Math.min(300,Number(e.totalScore)||n.totalScore)),timeLimit:Math.max(10,Math.min(600,Number(e.timeLimit)||n.timeLimit)),types:[],starMix:{},topicMode:e.topicMode==="manual"?"manual":"auto",topics:Array.isArray(e.topics)?e.topics.map(String).filter(Boolean).slice(0,30):[],volume:e.volume==="lite"||e.volume==="full"?e.volume:"std",updatedAt:e.updatedAt||""},s=Array.isArray(e.types)&&e.types.length?e.types:n.types;s.forEach(function(m){if(m){var p={choice:"choice",fill:"fill",solve:"solve",essay:"essay"}[m.type]||"solve",y=Math.max(0,Math.min(60,Math.floor(Number(m.count)||0)));if(y){var g=Number(m.score);g>=0&&g<=100||(g=0),r.types.push({type:p,label:String(m.label||ga[p]),count:y,score:g})}}}),r.types.length||(r.types=JSON.parse(JSON.stringify(n.types)));for(var o=e.starMix&&typeof e.starMix=="object"?e.starMix:n.starMix,i=0,a=1;a<=5;a++){var c=Math.max(0,Math.min(100,Math.round(Number(o[a])||0)));r.starMix[a]=c,i+=c}if(i!==100){for(var l=i>0?r.starMix:n.starMix,u=i>0?i:100,f=0,d=1;d<=5;d++)r.starMix[d]=Math.round((l[d]||0)/u*100),f+=r.starMix[d];r.starMix[3]+=100-f}return r};G.bpQuestionCount=function(e){return(e.types||[]).reduce(function(t,n){return t+(n.count||0)},0)};G.bpAutoScores=function(e){var t=0,n=0;(e.types||[]).forEach(function(l){l.score>0?t+=l.count*l.score:n+=l.count});var r=Math.max(0,(e.totalScore||100)-t);if(!n)return[];for(var s=Math.floor(r/n*2)/2,o=[],i=0;i<n;i++)o.push(s);for(var a=Math.round((r-s*n)*2)/2,c=n-1;c>=0&&a>0;c--)o[c]+=.5,a-=.5;return o};G.blueprintCheck=function(e,t){var n=[],r=e.questions||[],s=r.length,o=G.bpQuestionCount(t);s!==o&&n.push("题量不符：蓝图 "+o+" 题，实际 "+s+" 题");var i={choice:0,fill:0,solve:0,essay:0};if(r.forEach(function(d){i[d.type]=(i[d.type]||0)+1}),(t.types||[]).forEach(function(d){var m=i[d.type]||0;m!==d.count&&n.push(d.label+"题量：蓝图 "+d.count+"，实际 "+m)}),t.starMix){var a={1:0,2:0,3:0,4:0,5:0};r.forEach(function(d){var m=G.starOf(d);a[m]=(a[m]||0)+1});for(var c=s||1,l=1;l<=5;l++){var u=Math.round(c*((t.starMix[l]||0)/100)),f=a[l];u>0&&Math.abs(f-u)>Math.max(1,Math.round(u*.3))&&n.push("★"+l+" 星级配比偏差：蓝图约 "+u+"，实际 "+f)}}return n};G.defaultBlueprint=function(e){var t=G.SUBJ_TO_PRESET[e]||"shuyi",n=G.BLUEPRINT_PRESETS[t]||G.BLUEPRINT_PRESETS.shuyi;return G.normalizeBlueprint(JSON.parse(JSON.stringify(n)),e)};G.validateQuestion=function(e){if(!e||typeof e!="object")return"不是对象";if(!e.stem||typeof e.stem!="string"||e.stem.length<8)return"题干缺失或过短";if(e.answer==null||e.answer==="")return"缺 answer";if(e.type==="choice"){if(!Array.isArray(e.options)||e.options.length!==4)return"选择题须 4 个选项";var t=e.options.map(function(i){return String(i).trim().charAt(0).toUpperCase()});if(t.join("")!=="ABCD")return"选项前缀须 A/B/C/D（实为 "+t.join("")+"）";var n=String(e.answer).trim().charAt(0).toUpperCase();if(t.indexOf(n)<0)return"answer 不在选项中";var r=String(e.answer).trim().slice(1).trim();if(r.length>6&&e.options.filter(function(i){return String(i).indexOf(r)>=0}).length>1)return"疑似多个选项含相同答案内容"}if(!e.solution||String(e.solution).length<1)return"解析缺失";var s=String(e.solution).replace(/\s+/g,"").length,o=e.type==="solve"||e.type==="essay"?60:e.type==="choice"?25:20;return s<o?"解析不完整（"+s+" 字 < "+o+" 字下限，需分步推导+结论+易错点）":""};G.braceBalanced=function(e){var t=0;e=String(e||"");for(var n=0;n<e.length;n++){var r=e[n];if(r==="\\"){n++;continue}r==="{"?t++:r==="}"&&t--}return t===0};G.buildVariantContext=function(e,t){if(!e||typeof e!="object")return"";var n=[];function r(o,i){if(i!=null){if(Array.isArray(i)){var a=i.map(function(l){return String(l??"").trim()}).filter(function(l){return!!l});if(!a.length)return;n.push(o+"："+a.join(" | "));return}var c=String(i).trim();c&&n.push(o+"："+c)}}function s(){for(var o=0;o<arguments.length;o++){var i=arguments[o];if(i!=null&&String(i).trim()!=="")return i}return""}return r("原题题干",s(e.stem,e.question,e.extractedQuestion)),r("原题选项",e.options),r("标准答案",s(e.answer,e.referenceAnswer)),r("原解析/解题关键",s(e.solution,e.keySteps,e.analysis)),r("易错点/错误原因",s(e.trap,e.errorCause)),r("考点",s(e.topicName,e.topic,e.painPoint)),n.join(`
`)};G.unwrapQuestionObj=function(e){return!e||typeof e!="object"?null:Array.isArray(e)?e.length?e[0]:null:e.questions&&Array.isArray(e.questions)?e.questions[0]:e.q?e.q:e};G.normalizeParallelQ=function(e,t){var n=G.unwrapQuestionObj(e);return n?(n.type={choice:"choice",fill:"fill",solve:"solve",essay:"essay"}[n.type]||t&&t.type||"solve",n.diff={easy:"easy",medium:"medium",hard:"hard"}[n.diff]||t&&t.diff||"medium",n.star=n.star>=1&&n.star<=5?n.star:t&&t.star||3,n.score=typeof n.score=="number"?n.score:t&&t.score||5,n.type==="choice"&&(!Array.isArray(n.options)||n.options.length!==4)&&(n.options=["A. 待补充","B. 待补充","C. 待补充","D. 待补充"]),n):null};G._normAns=function(e){return String(e??"").replace(/\$/g,"").replace(/\\left|\\right|\\!|\\,/g,"").replace(/\\d?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g,"($1)/($2)").replace(/\s+/g,"").replace(/[（(][^（()）]*[）)]/g,"").replace(/^[：:，,。.、答案答解]+/,"").replace(/[。．.、，,：:]+$/,"").toLowerCase()};G._ansNum=function(e){var t=String(e??"").replace(/[()（）]/g,""),n=t.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);if(n){var r=parseFloat(n[2]);return r?parseFloat(n[1])/r:NaN}var s=parseFloat(t);return isNaN(s)?NaN:s};G.answerEquivalent=function(e,t){var n=G._normAns(e),r=G._normAns(t);if(!n||!r)return!1;if(n===r)return!0;var s=function(d){return d.replace(/^[a-d][.、．]/,"")},o=s(n),i=s(r);if(o&&i&&o===i)return!0;var a=function(d){var m=d.lastIndexOf("=");return m>=0?d.slice(m+1):d},c=a(o),l=a(i);if(c&&l&&c===l)return!0;var u=G._ansNum(c),f=G._ansNum(l);return!isNaN(u)&&!isNaN(f)&&Math.abs(u-f)<1e-9};G.triageVerify=function(e,t,n){if(!e&&!t)return{status:"failed",suspect:null};var r=e&&t&&G.answerEquivalent(e,t),s=e&&n!=null&&String(n).trim()!==""&&G.answerEquivalent(e,n),o=t&&n!=null&&String(n).trim()!==""&&G.answerEquivalent(t,n);return r&&s?{status:"agree",suspect:null}:r&&!s?{status:"dispute",suspect:n?"orig-wrong":null}:!r&&(s||o)?{status:"lean",suspect:null}:{status:"dispute",suspect:null}};G.examTitle=function(e,t){return e&&e.title?e.title:"云端押题卷 · "+(G.SUBJ_NAME[t]||"综合")};G.examTotalScore=function(e){var t=e.questions||[];return t.reduce(function(n,r){return n+(Number(r.score)||5)},0)||Number(e.totalScore)||150};G.validateExam=function(e,t){var n=[];return!e||!Array.isArray(e.questions)||!e.questions.length?["无 questions"]:(e.questions.forEach(function(r,s){var o=G.validateQuestion(r);if(o)n.push("第"+(s+1)+"题："+o);else{var i=!G.braceBalanced(r.stem)||!G.braceBalanced(r.solution);i&&n.push("第"+(s+1)+"题：LaTeX 花括号不平衡")}}),t&&G.blueprintCheck(e,t).forEach(function(r){n.push("蓝本："+r)}),n)};G.normalizeQuestion=function(e){var t={stem:String(e&&e.stem||""),type:{choice:"choice",fill:"fill",solve:"solve",essay:"essay"}[e&&e.type]||"solve",options:Array.isArray(e&&e.options)?e.options:null,answer:String(e&&e.answer||""),solution:String(e&&e.solution||""),trap:String(e&&e.trap||""),diff:{easy:"easy",medium:"medium",hard:"hard"}[e&&e.diff]||"medium",star:e&&e.star>=1&&e.star<=5?e.star:3,score:Number(e&&e.score)||5,topicName:String(e&&e.topicName||"")};return t};const Jr={early:{label:"早起型",bias:{morning:1.25,afternoon:1,evening:.75},desc:"上午精力最好，难点排上午"},normal:{label:"常规型",bias:{morning:1,afternoon:1.05,evening:1},desc:"均衡分配"},night:{label:"夜猫型",bias:{morning:.75,afternoon:1,evening:1.25},desc:"晚上精力最好，难点排晚上"}},gm={math:{morning:1.3,afternoon:1,evening:1.1},ctrl:{morning:1.1,afternoon:1.15,evening:.9},eng:{morning:1,afternoon:1,evening:1},pol:{morning:.9,afternoon:1,evening:1.15}},dt=[{key:"morning",label:"☀️ 上午",hours:[8,12],share:.34},{key:"afternoon",label:"🌤 下午",hours:[14,18],share:.33},{key:"evening",label:"🌙 晚上",hours:[19,23],share:.33}];function mm(e,t){t=t||{};const n=Jr[t.routine]||Jr.normal,r=Math.max(60,Math.round((t.dayHours||6)*60)),s={math:90,ctrl:75,eng:45,pol:40},o=[],i=[];(e||[]).forEach(p=>{if(!p)return;(p.forced||p.hard?o:i).push(Object.assign({},p,{minutes:Math.max(15,Math.min(240,p.minutes||s[p.subject]||60))}))});const a=dt.map(p=>({key:p.key,label:p.label,items:[],usedMin:0})),c=dt.map(p=>Math.round(r*p.share*(n.bias[p.key]||1))),l=(p,y)=>{const g=dt[y].key,v=(gm[p.subject]||{})[g]||1,w=a[y].usedMin,S=c[y],O=w+p.minutes>S?1e3:0;return(n.bias[g]||1)*v-O+Math.random()*.01},u={morning:0,afternoon:1,evening:2},f=(p,y)=>{let g=-1,v=-1/0;if(p.slotKey&&u[p.slotKey]!=null?g=u[p.slotKey]:dt.forEach((w,S)=>{const O=l(p,S);O>v&&(v=O,g=S)}),g<0){d.push(p);return}if(y){const w=a[g].items.length-1;if(w>=0&&!a[g].items[w].forced&&!a[g].items[w].hard&&a[g].usedMin+p.minutes>c[g]){const S=a[g].items.splice(w,1)[0];a[g].usedMin-=S.minutes,d.push(Object.assign({},S,{displaced:!0}))}}else if(a[g].usedMin+p.minutes>c[g]){const w=dt.findIndex((S,O)=>a[O].usedMin+p.minutes<=c[O]);if(w>=0)g=w;else{d.push(p);return}}a[g].items.push(Object.assign({},p,{slotStart:ym(g,a[g].usedMin),overflow:a[g].usedMin+p.minutes>c[g]})),a[g].usedMin+=p.minutes},d=[];return o.forEach(p=>f(p,!0)),i.forEach(p=>f(p,!1)),{slots:a.map((p,y)=>({key:p.key,label:p.label,items:p.items,usedMin:p.usedMin,budgetMin:c[y]})),unmapped:d,dayMin:r,hardN:o.length,softN:i.length}}function ym(e,t){const n=dt[e].hours[0]*60;return Math.round((n+t)/5)*5}function vm(e){if(e=Math.round(e||0),e>=60){const t=e/60;return(t%1===0?t:t.toFixed(1))+"h"}return e+"min"}function bm(e,t,n){n=n||{};const r=n.cap||3;if(!e||!t)return[];const s=[];try{const o=e.reading&&e.reading.cards||{},i=Object.keys(o).filter(a=>t(o[a])).slice(0,r);i.length&&s.push({id:"__review_eng",subject:"eng",kind:"vocab",due:!0,text:"📖 单词复习："+i.length+" 个到期（"+(e.readingCount!=null,"")+"间隔复习）",count:i.length,minutes:Math.min(30,i.length*2)})}catch{}try{const o=(e.polRecite||[]).filter(i=>t(i,{includeMastered:!1})).slice(0,r);o.length&&s.push({id:"__review_pol",subject:"pol",kind:"pol",due:!0,text:"📖 政治背诵："+o.length+" 个到期复习",count:o.length,minutes:Math.min(40,o.length*4)})}catch{}try{const o=Array.isArray(e.mistakePhotos)?e.mistakePhotos:[],i=Date.parse(String(n.todayKey||wm()))||Date.now(),a=o.filter(function(c){if(!c||!c.reviewPlan||!c.reviewPlan.start)return!1;const l=Date.parse(c.reviewPlan.start);if(isNaN(l))return!1;const u=Math.floor((i-l)/864e5);return u<0?!1:[1,3,7,15].some(function(f){const d="d"+f;return!(c.reviewPlan.done&&c.reviewPlan.done[d])&&u>=f})});a.length&&s.push({id:"__review_math",subject:"math",kind:"mistake",due:!0,text:"📖 拍题复习："+a.length+" 道到期（D1/3/7/15 间隔）",count:a.length,minutes:Math.min(45,a.length*5)})}catch{}return s}function wm(){const e=new Date;return e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0")}function km(e,t){const n={math:0,ctrl:0,eng:0,pol:0},r=[],s={};(e||[]).forEach(o=>{!o||o.forced||!o.subject||(s[o.subject]=s[o.subject]||{total:0,done:0},s[o.subject].total++,o.done&&s[o.subject].done++)}),Object.keys(s).forEach(o=>{const i=s[o];i.total&&i.done<i.total?(n[o]=(n[o]||0)+6,r.push(o+" 未全完成（"+i.done+"/"+i.total+"）→ 明日权重 +6%")):i.total&&i.done===i.total&&(n[o]=(n[o]||0)-2,r.push(o+" 全完成 ✓ → 明日权重 -2%"))});try{t&&Object.keys(t).forEach(o=>{(t[o]||99)>=3&&(n[o]=Math.max(n[o]||0,8),r.push(o+" 连续 "+t[o]+" 天未打卡 → 强制补救 +8%"))})}catch{}return{adjust:n,reasons:r}}const xm={ROUTINES:Jr,SLOT_META:dt,slotAllocate:mm,fmtMin:vm,collectDueReviews:bm,computeAdjust:km};function ma(){return window.U||{}}function et(){return window.Store}function ya(){return window.AI}function Je(){return window.InspectorModule}function vt(e){var t=ma();return(t.esc?t.esc:function(n){return String(n??"")})(e)}var Js={math:"数学",ctrl:"自控",eng:"英语",pol:"政治"},Hs={sprint:"押题卷",quiz:"AI测验",mistakes:"错题本",photomistake:"拍题",conceptmap:"考点地图",tutor:"私教",reading:"阅读",polrecite:"政治背诵",wordbook:"单词本",review:"复习",daily:"每日一题",bank:"题库"};function $n(){return et().get()}function va(){var e=$n();return(!e.playbookLinks||typeof e.playbookLinks!="object")&&(et().update(function(t){t.playbookLinks={}}),e=$n()),e.playbookLinks}function Gs(){var e=$n();return Array.isArray(e.playbookDrills)||(et().update(function(t){t.playbookDrills=[]}),e=$n()),e.playbookDrills}function Un(e){return String(e??"").replace(/[\s\u3000]+/g,"").replace(/[（(].*?[)）]/g,"").replace(/[、，,。.：:；;·\-—_/\\|"'「」《》【】\[\]]/g,"").toLowerCase().slice(0,24)}function ba(e,t,n){return[e||"_",Un(t),Un(n)].filter(function(r){return r}).join("|")}function wa(e,t,n){e=e||{},n=n||{};var r=e.subject||n.subject||"",s=e.topicName||e.topic||e.name||n.topic||"",o=e.stem||e.question||e.title||e.desc||e.text||"",i=e.type||e.qtype||e.mistakeType||"",a=e.solution||e.analysis||e.explanation||"";return{subject:r,topicName:String(s||"").slice(0,40),topicId:e.topicId||n.topicId||"",type:String(i||"").slice(0,20),stem:String(o||"").slice(0,400),solution:String(a||"").slice(0,600),module:t||"",refId:n.id||e.examId||e.id||"",refTitle:n.title||e.examTitle||"",fp:ba(r,i,s)}}function Hr(e,t){var n=ma();return n.sim?n.sim(e,t,Un):0}function zs(e,t){if(!e||t.subject&&e.subject&&e.subject!==t.subject)return-1;var n=0,r=Hr(e.title||"",t.topicName||"");n+=r*60,t.type&&(e.tags||[]).indexOf(t.type)>=0&&(n+=25);var s=t.stem||"";if(s){var o=0;(e.recognize||[]).forEach(function(i){if(i){var a=Un(i).slice(0,6);a&&s.indexOf(a)>=0&&o++}}),o&&(n+=Math.min(o,3)*10)}return s&&!t.topicName&&(n+=Hr(e.title||"",s.slice(0,60))*30),e.uses&&(n+=Math.min(e.uses,10)*.5),n}var ka=22;function mn(e,t){if(t=t||{},!e||!window.InspectorModule)return null;var n=Je().list()||[];if(!n.length)return null;var r=va(),s=e.fp?r[e.fp]:"";if(s&&!t.ignoreBound){var o=n.filter(function(c){return c.id===s})[0];if(o)return{pb:o,score:999,bound:!0};et().update(function(c){c.playbookLinks&&delete c.playbookLinks[e.fp]})}var i=null,a=-1;return n.forEach(function(c){var l=zs(c,e);l>a&&(a=l,i=c)}),!i||a<ka?null:{pb:i,score:Math.round(a),bound:!1}}function xa(e,t){if(!e||!window.InspectorModule)return[];var n=Je().list()||[],r=[];return n.forEach(function(s){var o=zs(s,e);o>0&&r.push({pb:s,score:Math.round(o)})}),r.sort(function(s,o){return o.score-s.score}),r.slice(0,t||6)}function Gr(e){return"你是考研方法论教练。考生在做「"+(Js[e.subject]||e.subject||"未标科目")+`」的一类题时反复卡住，需要一张可反复套用的【解题方法卡】。
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
⑥ 不确定就给保守、通用、稳妥的做法，不要编造偏门技巧。用简体中文。`}function Sm(){var e=ya();return!!(e&&e.configured&&e.configured())}function $s(e,t){return t=t||{},new Promise(function(n){if(!window.InspectorModule){n(null);return}var r=t.force?null:mn(e);if(r&&r.pb){n({pb:r.pb,created:!1,bound:r.bound});return}if(!Sm()){t.silent||window.Toast&&Q.warn("未配置 AI，无法自动建立方法卡。可到「解题方法」页手动新建。"),n(null);return}var s=ya();function o(i,a){var c=s.chatJSON?s.chatJSON(Gr(e),i,null,{ctx:"insp.gen",noThink:!0}):s.chatStream(Gr(e),i,null,null,{ctx:"insp.gen",noThink:!0}).then(function(l){return s.extractRobustJSON(l||"")});c.then(function(l){var u=Je().normalizePlaybook(l,e.subject||"math");if(!u){if(!a){o(i+`
【重试注意】上次 JSON 不完整（疑似被截断）。请压缩每条字数（do≤25字/tip≤20字），确保 steps 4-7 步与全部字段一次性完整输出。严禁把裸字段名（如 "name"、"do"、"tip"）或 JSON 语法碎片（如 "]"、"steps"）当成内容输出；所有数组必须完整闭合。`,!0);return}t.silent||window.Toast&&Q.warn("AI 返回的方法卡格式不合格，已放弃入库（不会污染方法库）"),n(null);return}u.source="auto:"+(e.module||"unknown"),u.autoFp=e.fp||"",u.autoTopic=e.topicName||e.type||"",u.uses=0,et().update(function(f){f.playbooks=f.playbooks||[],f.playbooks.unshift(u)}),tr(e.fp,u.id),n({pb:u,created:!0,bound:!0})}).catch(function(l){t.silent||window.Toast&&Q.warn("建立方法卡失败："+(l&&l.message||l)),n(null)})}o("请为这类题生成方法卡。",!1)})}function tr(e,t){!e||!t||et().update(function(n){n.playbookLinks=n.playbookLinks||{},n.playbookLinks[e]=t})}function _m(e){e&&et().update(function(t){t.playbookLinks&&delete t.playbookLinks[e]})}function Sa(e,t){t=t||{};var n=t.autoCreate!==!1;return new Promise(function(r){if(!window.InspectorModule){window.Toast&&Q.warn("解题方法模块未加载"),r(null);return}var s=mn(e);if(s&&s.pb){_o(s.pb,e,t),r(s.pb);return}if(!n){Je().startGuide?Je().startGuide("",e.stem,{origin:t.origin,ctx:e}):Je().openFor({subject:e.subject,type:e.type,desc:e.topicName}),r(null);return}$s(e,{silent:!1}).then(function(o){o&&o.pb&&_o(o.pb,e,t),r(o?o.pb:null)})})}function _o(e,t,n){e&&(t.fp&&tr(t.fp,e.id),Je().startGuide?Je().startGuide(e.id,t.stem||t.topicName,{origin:n.origin||Hs[t.module]||t.module||"",originTab:n.originTab||t.module||"",ctx:t}):Je().openPlaybook(e.id))}function _a(e){var t=mn(e);return t&&t.pb?(Je().openPlaybook(t.pb.id),t.pb):(Je().openFor({subject:e.subject,type:e.type,desc:e.topicName||e.stem}),null)}function Am(e){e=e||{};var t={id:"dr"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),pbId:e.pbId||"",fp:e.fp||"",subject:e.subject||"",topicId:e.topicId||"",topic:String(e.topic||"").slice(0,40),module:e.module||"",steps:e.steps||0,doneSteps:e.doneSteps||0,risk:e.risk==null?null:e.risk,ok:!!e.ok,createdAt:new Date().toISOString()};return et().update(function(n){n.playbookDrills=n.playbookDrills||[],n.playbookDrills.unshift(t),n.playbookDrills.length>300&&(n.playbookDrills.length=300)}),t.ok&&t.topicId?Aa(t.topicId,6):t.ok&&t.topic&&Tm(t.subject,t.topic,6),t}function Aa(e,t){e&&et().update(function(n){n.heat=n.heat||{};var r=n.heat[e]||{level:0,score:null,updatedAt:""};r.score==null&&(r.score=50),r.score=Math.max(0,Math.min(100,r.score+t)),r.level=r.score>=75?2:r.score>=45?1:0,r.updatedAt=new Date().toISOString(),n.heat[e]=r,n.heatHistory||(n.heatHistory={});var s=n.heatHistory[e]||[];s.push({score:r.score,level:r.level,at:new Date().toISOString()}),s.length>30&&(s=s.slice(-30)),n.heatHistory[e]=s})}function Tm(e,t,n){try{var r=window.DB&&ee.TOPICS&&ee.TOPICS[e]||[],s=null,o=0;r.forEach(function(i){var a=Hr(String(i.name||""),t);a>o&&(o=a,s=i)}),s&&o>.5&&Aa(s.id,n)}catch{}}function Ta(e){var t=Gs().filter(function(r){return r.pbId===e});if(!t.length)return{n:0,ok:0,rate:0,last:""};var n=t.filter(function(r){return r.ok}).length;return{n:t.length,ok:n,rate:Math.round(n/t.length*100),last:t[0].createdAt||""}}function Em(e){var t=Gs().filter(function(n){return n.fp===e});return{n:t.length,ok:t.filter(function(n){return n.ok}).length,last:t.length?t[0].createdAt:""}}var zr={},mr=0;function Om(e){mr>400&&(zr={},mr=0);var t="c"+mr+++Math.random().toString(36).slice(2,6);return zr[t]=e,t}function Ea(e){return e&&zr[e]||null}function Us(e,t){if(t=t||{},!e)return"";var n=mn(e),r=n?n.pb:null,s=e.topicName||e.type||"这一类题",o=r?Ta(r.id):null,i;return r?i='<span class="ml-pb-name">'+vt(r.title)+'</span><span class="ml-pb-meta">'+(o&&o.n?"练过 "+o.n+" 次 · 通过率 "+o.rate+"%":"尚未实操")+(n.bound?" · 已绑定此类题":"")+"</span>":i='<span class="ml-pb-none">「'+vt(s)+'」还没建立解题方法</span><span class="ml-pb-meta">建立后，同类题自动复用，带练闭环</span>','<div class="ml-panel'+(t.compact?" ml-compact":"")+'" data-ml-fp="'+vt(e.fp)+'" data-ml-ctx="'+Om(e)+'"><div class="ml-head"><span class="ml-ico">🧭</span><div class="ml-right">'+i+"</div></div>"+(t.hint?'<div class="ml-hint">'+vt(t.hint)+"</div>":"")+'<div class="ml-acts">'+(r?'<button class="btn btn-sm btn-primary ml-act" data-ml="practice">🎯 带我练</button><button class="btn btn-sm btn-ghost ml-act" data-ml="view">📖 看方法</button><button class="btn btn-sm btn-ghost ml-act" data-ml="swap">🔄 换一张</button>':'<button class="btn btn-sm btn-primary ml-act" data-ml="create">🧠 为这类题建立方法卡</button><button class="btn btn-sm btn-ghost ml-act" data-ml="pick">📚 从方法库挑一张</button>')+"</div></div>"}function Oa(e,t,n){if(n=n||{},!!e){var r=e.classList&&e.classList.contains("ml-panel")?[e]:Array.prototype.slice.call(e.querySelectorAll(".ml-panel"));r.forEach(function(s){var o=Ea(s.getAttribute("data-ml-ctx"))||t;o&&Ia(s,o,n)})}}function Ia(e,t,n){n=n||{},e.querySelectorAll(".ml-act").forEach(function(r){r.onclick=function(){var s=r.getAttribute("data-ml");if(s==="view"){_a(t);return}if(s==="practice"){Sa(t,{origin:Hs[t.module]||"",originTab:t.module});return}if(s==="create"){r.disabled=!0,r.textContent="⏳ 正在建立方法卡…",$s(t,{force:!0}).then(function(o){r.disabled=!1,r.textContent="🧠 为这类题建立方法卡",o&&o.pb&&(window.Toast&&Q.success("方法卡已建立："+o.pb.title+"（同类题将自动复用）"),Fs(e,t,n),n.onChange&&n.onChange(o.pb,t))});return}if(s==="swap"||s==="pick"){Ma(t,n,e);return}}})}function Fs(e,t,n){if(!(!e||!t)){var r=Us(t,n),s=document.createElement("div");s.innerHTML=r;var o=s.firstChild;o&&(Ia(o,t,n),e.parentNode&&e.parentNode.replaceChild(o,e))}}function Ma(e,t,n){t=t||{};var r=xa(e,12),s=(window.InspectorModule?Je().list():[])||[],o=r.length?r:s.filter(function(a){return!e.subject||a.subject===e.subject}).map(function(a){return{pb:a,score:0}}),i='<div class="muted-sm" style="margin-bottom:8px">为「'+vt(e.topicName||e.type||"这类题")+"」指定方法卡。绑定后，同类题会自动命中这张卡，不再重复询问。</div>"+(o.length?o.map(function(a){return'<div class="ml-pick-row"><div style="flex:1;min-width:0"><div style="font-size:13.5px;font-weight:600">'+vt(a.pb.title)+'</div><div class="muted-sm" style="font-size:11.5px">'+(Js[a.pb.subject]||a.pb.subject)+" · "+(a.pb.steps||[]).length+" 步"+(a.score?" · 匹配度 "+a.score:"")+'</div></div><button class="btn btn-sm btn-primary ml-pick" data-id="'+vt(a.pb.id)+'">绑定</button></div>'}).join(""):'<div class="empty">当前没有候选方法卡，可先「建立方法卡」。</div>');window.Modal&&xe.open({title:"🔄 选择方法卡",html:i,actions:[{label:"取消"}]}),setTimeout(function(){document.querySelectorAll(".ml-pick").forEach(function(a){a.onclick=function(){tr(e.fp,a.getAttribute("data-id")),window.Modal&&xe.close&&xe.close(),window.Toast&&Q.success("已绑定，同类题将自动使用这张卡"),n&&Fs(n,e,t),t.onChange&&t.onChange({id:a.getAttribute("data-id")},e)}})},30)}function Im(e,t,n,r,s){if(!e)return null;var o=wa(t,n,r);return e.innerHTML=Us(o,s),Oa(e,o,s),o}const Pa={fromQuestion:wa,fingerprint:ba,match:mn,candidates:xa,scoreOf:zs,genSystemPreview:function(e){return Gr(e||{subject:"math",topicName:"极限计算"})},ensure:$s,bind:tr,unbind:_m,links:va,practice:Sa,view:_a,recordDrill:Am,drills:Gs,statsOf:Ta,fpStats:Em,panelHtml:Us,bindPanel:Oa,repaintPanel:Fs,mount:Im,openPicker:Ma,ctxOfToken:Ea,SUBJ_CN:Js,MOD_CN:Hs,MATCH_MIN:ka},Mm=Object.freeze(Object.defineProperty({__proto__:null,MethodLink:Pa},Symbol.toStringTag,{value:"Module"})),In=40,Pm=400,Cm=9e3,Nm={sprint:[[".sp-exam-card","考试题目",e=>be(e.querySelector(".sp-exam-no"))+" "+be(e)],[".sp-item","押题考点",e=>be(e.querySelector(".sp-name"))+"（"+be(e.querySelector(".sp-score"))+"）"],["#lib-reader-body > div","资料章节段",e=>be(e)]],mistakes:[[".mis-row","错题",e=>be(e.querySelector(".mis-desc"))||be(e)]],photomistake:[[".pm-question","拍题题目",e=>be(e)],[".pm-card","拍题记录",e=>be(e)]],wordbook:[[".fc-word","当前单词卡",e=>be(e)+" "+be(e.parentElement?.querySelector(".fc-hint"))]],scheduler:[[".seq-row","排程任务",e=>be(e)]],essay:[[".essay-row","作文批改记录",e=>be(e.querySelector(".mis-desc"))||be(e)]]};function be(e){return(e&&e.textContent||"").replace(/\s+/g," ").trim().slice(0,Pm)}function Ca(e){const t=document.getElementById("view");let n=e;for(;n&&n!==t;){if(n.hidden)return!1;const r=n.style&&n.style.display;if(r==="none"||r==="hidden"||typeof n.className=="string"&&/(^|\s)cp-hide(\s|$)/.test(n.className))return!1;n=n.parentElement}return!0}const Na=new Map;function Lm(e){const t=[];return e.querySelectorAll(".card").forEach(n=>{if(t.length>=In||!Ca(n))return;const r=be(n.querySelector(".card-title")),s=be(n),o=(r?r+"：":"")+(s.length>90?s.slice(0,90)+"…":s);o.trim()&&t.push({kind:r||"卡片",text:o})}),t}function jm(e){const t=document.getElementById("view");if(!t)return[];const n=Na.get(e);if(n)try{return n(t).slice(0,In)}catch{}const r=Nm[e];if(r){const s=[];for(const[o,i,a]of r)if(t.querySelectorAll(o).forEach(c=>{if(s.length>=In||!Ca(c))return;const l=a(c);l&&s.push({kind:i,text:l})}),s.length>=In)break;if(s.length)return s}return Lm(t)}const Dm={dashboard:"仪表盘",scheduler:"排程",review:"复盘",photomistake:"拍题",quiz:"测验",heatmap:"热力图",inspector:"方法卡",sprint:"智能押题",progress:"进度",decision:"决策",mental:"心态",redline:"红线",wordbook:"单词本",reading:"阅读",essay:"作文",polrecite:"政治背诵",mistakes:"错题本",concept:"概念图",focus:"专注",settings:"设置"};function La(){const e=String(window.App?.current||"");if(!e||!document.getElementById("view"))return null;const t=jm(e);return t.length?{pageId:e,label:Dm[e]||e,entries:t}:null}function ja(){const e=La();if(!e)return"";const t=[];let n=0;for(let s=0;s<e.entries.length;s++){const o=s+1+". ["+e.entries[s].kind+"] "+e.entries[s].text;if(n+o.length>Cm)break;n+=o.length,t.push(o)}const r=t.length<e.entries.length?`
（本页共 `+e.entries.length+" 条，因长度上限仅列出前 "+t.length+" 条；被截断部分如需查看请让用户滚动页面或指明题号）":"";return"【当前页面·"+e.label+`（用户此刻看到的内容，DOM 直读非截图）】
`+t.join(`
`)+r+`
（用户说"这道题/这页/刚才"等指代时，即指上述条目）`}const qm=/(这道题|这题|这个题|这道|这页|本页|当前页|上面|刚才|屏幕上|看到的|这里|哪个错|哪道题)/;function Bm(e){return qm.test(e||"")?ja():""}function Rm(){try{const e=window.getSelection(),t=e?String(e.toString()||"").trim():"";if(t.length<4||t.length>800)return"";if(e&&e.rangeCount){const n=e.getRangeAt(0).commonAncestorContainer,r=n.nodeType===1?n:n.parentElement;if(!r||!r.closest("#view"))return""}return t}catch{return""}}const Jm={register(e,t){Na.set(e,t)},snapshot:La,text:ja,auto:Bm,selection:Rm};window.PageCtx=Jm;function Da(){const e=window;e.U=x,e.ICONS=cn,e.Spaced=Ct,e.BgTask=_g,e.Tex=Qe,e.Store=b,e.Cloud=Te,e.CloudJob=Wg,e.DB=ee,e.Charts=Ui,e.Diagram=$i,e.Toast=Q,e.Modal=xe,e.Components=Eo,e.Notify=Ds,e.AI=K,e.AiMemory=On,e.Alerts=As,e.Mastery=pa,e.ZipKit=Tn,e.PluginBus=$,e.ExamPipeline=ha,e.MethodLink=Pa,e.Plaza=Va,e.SchedulerEngine=xm}function Hm(){const e=b.get(),t=x.dkey();if(e.meta.lastOpenDate===t)return;const n=e.meta.lastOpenDate;if(n&&n<t){const r=e.completions[n]||[];e.taskArchive[n]=e.tasks.map(o=>({subject:o.subject,text:o.text,done:o.done||r.indexOf(o.id)>=0})),e.tasks.forEach(o=>{o.done=!1});const s=Object.keys(e.taskArchive).sort();for(;s.length>60;)delete e.taskArchive[s.shift()]}b.update(r=>{r.meta.lastOpenDate=t})}function Gm(){Da();try{const t="kaoyan2026_v2_bak";if(!localStorage.getItem(t)&&localStorage.getItem("kaoyan2026_data")){localStorage.setItem(t,new Date().toISOString());const n=localStorage.getItem("kaoyan2026_data");n&&localStorage.setItem("kaoyan2026_data_bak_v2",n)}}catch{}const e=(function(){try{return Te.init()}catch{return Promise.resolve()}})();ee.syncSubjects(),Hm(),Ds.ensurePermission();try{On.syncLocalSignals()}catch{}setTimeout(()=>{try{As.runDailyChecks()}catch{}},800),e.then(function(){setTimeout(function(){try{const t=window.Copilot;t&&t.superviseCheck&&t.superviseCheck()}catch{}try{On.consolidateDue()&&On.weeklyConsolidate()}catch{}},1200)}).catch(function(){});try{mt.restoreChat(),mt.maybeAutoLoad()}catch{}e.then(function(){const t=window.Onboarding;t&&t.needed&&t.needed()&&t.show()}).catch(function(){});try{const t=window.Copilot;t&&t.mount&&t.mount()}catch{}}Da();const zm=[()=>Y(()=>import("./dashboard-Dz_FY-l0.js"),[],import.meta.url),()=>Y(()=>import("./scheduler-DD9ULQJk.js"),[],import.meta.url),()=>Y(()=>import("./tasks-BqMe-nc1.js"),[],import.meta.url),()=>Y(()=>import("./progress-MouM4HYd.js"),[],import.meta.url),()=>Y(()=>import("./review-D181tX7l.js"),[],import.meta.url),()=>Y(()=>import("./mistakes-D27T-2KH.js"),[],import.meta.url),()=>Y(()=>import("./redline-Dj0Zvmn_.js"),[],import.meta.url),()=>Y(()=>import("./heatmap-CJtykNWz.js"),[],import.meta.url),()=>Y(()=>import("./quiz-DI2bIuFi.js"),[],import.meta.url),()=>Y(()=>import("./inspector-C-9uhYsn.js"),[],import.meta.url),()=>Y(()=>import("./focus-BD4CQq5D.js"),[],import.meta.url),()=>Y(()=>import("./conceptmap-DkvhK5Y_.js"),[],import.meta.url),()=>Y(()=>import("./sprint-BVUykZNr.js"),__vite__mapDeps([0,1,2,3]),import.meta.url),()=>Y(()=>import("./decision-Ca7lZVwo.js"),[],import.meta.url),()=>Y(()=>import("./mental-BDB5Acye.js"),[],import.meta.url),()=>Y(()=>import("./reading-ChUStPXE.js"),[],import.meta.url),()=>Y(()=>import("./wordbook-eEe6LSnt.js"),[],import.meta.url),()=>Y(()=>import("./tutor-Z22EhQvz.js"),[],import.meta.url),()=>Y(()=>import("./essay-DYPiZctW.js"),[],import.meta.url),()=>Y(()=>import("./settings-Bv17lt_Z.js"),[],import.meta.url),()=>Y(()=>import("./onboarding-6bP4wBOR.js"),[],import.meta.url),()=>Y(()=>import("./photomistake-8miypL2M.js"),[],import.meta.url),()=>Y(()=>import("./copilot-CbyOhhe7.js"),[],import.meta.url),()=>Y(()=>import("./polrecite-B5B-BP4h.js"),[],import.meta.url),()=>Y(()=>import("./plugincenter-DKF4I8cZ.js"),[],import.meta.url),()=>Y(()=>import("./shareplaza-PPk_Igeq.js"),__vite__mapDeps([4,5,2,3]),import.meta.url),()=>Y(()=>import("./vizai-WcsIuia_.js"),[],import.meta.url),()=>Y(()=>import("./shareplaza-ext-DAfxhdYb.js"),__vite__mapDeps([6,5,2,3,7]),import.meta.url),()=>Y(()=>import("./shareplaza-ai-BUz797Ip.js"),__vite__mapDeps([8,5,2,3,7]),import.meta.url)];for(const e of zm)await e();const Ks=Fa(Sg);Ks.use(Ka());Ks.use(Ce);Hl();Gm();Ks.mount("#app");try{typeof window.__BOOT_READY=="function"&&window.__BOOT_READY()}catch{}
