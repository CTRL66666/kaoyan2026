const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./copilot-DnPowQJ9.js","./mdrender-TC-dwmMA.js","./markdown-CjcKfXm4.js","./vendor-BVCdKi1G.js","./vendor-DLVrwanO.css","./tex-DM1sK5vY.js","./utils-Bn1Okx2s.js","./dashboard-NYxkHTJA.js","./dashboardLogic-CbzWA-eN.js","./ai-BgMe9yo4.js","./sprint-B5hRTBrt.js","./index-PPVm8Dsz.js","./settings-CD-7844Z.js","./shareplaza-SOJnMojg.js","./share-Dp9ztnAQ.js","./shareplaza-ext-BYlyrW7i.js","./share-social-CgRhOwZQ.js","./shareplaza-ai-CtnFQRXe.js","./index-BSDxLz4U.js"])))=>i.map(i=>d[i]);
import{_ as Z}from"./index-PPVm8Dsz.js";import{g as et,h as L,i as rt,o as w,j as _,k as he,l as c,n as W,q as ct,s as Y,t as k,v as z,w as Po,x as je,y as sr,A as Vn,B as Qn,C as Ze,D as Vt,E as tt,F as H,G as Q,H as Qt,I as me,J as Xn,K as tn,M as Cs,N as No,O as In,Q as Lt,R as ft,S as Co,T as Lo,U as jo,V as qo,W as Do,X as Ls,Y as Ro,Z as Bo,$ as Jo}from"./vendor-BVCdKi1G.js";import{T as X,S as M,A as K,M as It,D as Wt,C as Go}from"./ai-BgMe9yo4.js";import{U as O}from"./utils-Bn1Okx2s.js";import{T as Pe}from"./tex-DM1sK5vY.js";import{r as Ho,p as zo,A as ye,c as $o,a as Uo,l as Et,b as js,d as qs,e as Fo}from"./index-BSDxLz4U.js";import{g as Ko,b as Ds,r as Ne,l as Vo,s as Qo,d as ze,a as Rs,c as Bs,e as Xo,f as rr,h as Wo,i as Yo,S as Zo}from"./dashboardLogic-CbzWA-eN.js";import{P as ti}from"./share-Dp9ztnAQ.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();const or="https://api.github.com",qe="kaoyan2026.json",Wn="core.json",zt="manifest.json",ir="kaoyan2026-sync",Yn="kaoyan2026-sync-bulk",Zn="kaoyan2026_ghtoken",ar="kaoyan2026_cloud",Js=1500,lr=3e5,ei=[{ms:0,label:"实时",tip:"每次改动 1.5s 后推送（同步次数最多，密集操作易触发限流）"},{ms:6e4,label:"每 1 分钟",tip:"接近实时，适合双设备频繁切换"},{ms:12e4,label:"每 2 分钟",tip:"较均衡"},{ms:3e5,label:"每 5 分钟",tip:"默认推荐，大幅省同步次数"},{ms:6e5,label:"每 10 分钟",tip:"更省，跨设备看到更新稍慢"},{ms:18e5,label:"每 30 分钟",tip:"最省同步次数，适合单机为主"}],cr=6e4,ur=15e3,ni=[{ms:15e3,label:"每 15 秒",tip:"最快感知其他设备的更新（API 配额消耗最多）"},{ms:3e4,label:"每 30 秒",tip:"较快"},{ms:6e4,label:"每 1 分钟",tip:"默认推荐（ETag 命中时零流量，仅占 1 点配额）"},{ms:3e5,label:"每 5 分钟",tip:"均衡，适合不常切设备"},{ms:6e5,label:"每 10 分钟",tip:"更省配额"},{ms:18e5,label:"每 30 分钟",tip:"最省，跨设备更新感知最慢"}],si="https://github.com/settings/tokens/new?scopes=gist&description=kaoyan2026同步",st=["quizBank","mistakePhotos","essays","vocab","mistakes","dailyQuizHistory","mistakeDrills","playbooks"],ts={quizBank:"题库",mistakePhotos:"错题照片",essays:"作文",vocab:"单词本",mistakes:"文本错题",dailyQuizHistory:"每日一题历史",mistakeDrills:"错题重练",playbooks:"解题方法卡"},yt=["copilotChats","majorData","deepReview","conceptAI","sprintData","plugins","pluginData","pluginConfig","pluginLog","share","plazaKept","studyBooks"],en={copilotChats:"AI对话",majorData:"专业数据",deepReview:"深度复盘",conceptAI:"概念图谱AI",sprintData:"押题出卷",plugins:"插件源码",pluginData:"插件数据",pluginConfig:"插件配置",pluginLog:"插件日志",share:"星屿广场",plazaKept:"星藏包",studyBooks:"资料库"},gn=/^op-\d+-[A-Za-z0-9_-]+\.json$/,ri=/^(quizBank|mistakePhotos|essays|vocab)\.ops\.json$/,De=8,y={enabled:!1,token:null,gistId:null,bulkGistId:null,lastPushedAt:0,lastSyncAt:0,pollTimer:null,badge:null,lastPushAttemptAt:0,badgeBaseTitle:"",pushing:!1,rateLimitBackoffUntil:0,lastTransfer:null,syncPhase:"idle",syncLog:[],pendingBulk:[]};let le=!1,ee=null,q=oi();function oi(){let t;try{t=JSON.parse(localStorage.getItem(ar))}catch{t=null}t=t||{};try{localStorage.getItem("kaoyan2026_syncKeyMigrated")?t.syncAiKey===void 0&&(t.syncAiKey=!0):(t.syncAiKey=!0,localStorage.setItem("kaoyan2026_syncKeyMigrated","1"),t.pushedHashes&&(delete t.pushedHashes.core,delete t.pushedHashes.manifest))}catch{t.syncAiKey===void 0&&(t.syncAiKey=!0)}return t.pushedHashes=t.pushedHashes||{},t.deviceId||(t.deviceId="dev-"+Math.random().toString(36).slice(2,10)),t.opCursor=t.opCursor||{},t.appliedOps=Array.isArray(t.appliedOps)?t.appliedOps:[],t.compactGen=t.compactGen||0,t.opCount=t.opCount||0,t.bulkHashes=t.bulkHashes||{},(t.pushIntervalMs===void 0||t.pushIntervalMs===null)&&(t.pushIntervalMs=lr),(t.pullIntervalMs===void 0||t.pullIntervalMs===null)&&(t.pullIntervalMs=cr),t}function Bt(){q.gistId=y.gistId,q.bulkGistId=y.bulkGistId,q.lastPushedAt=y.lastPushedAt,q.lastSyncAt=y.lastSyncAt;try{localStorage.setItem(ar,JSON.stringify(q))}catch{}}function nn(){var t=q.pushIntervalMs;return t===0?0:typeof t!="number"||!(t>0)?lr:t}function jn(){var t=q.pullIntervalMs;return typeof t!="number"||!(t>=ur)?cr:t}function ii(){try{return localStorage.getItem(Zn)||""}catch{return""}}function ai(){try{localStorage.setItem(Zn,y.token)}catch{}}function li(){try{localStorage.removeItem(Zn)}catch{}}const ci=20;function Pt(t){y.syncPhase=t,t==="idle"?ut("☁ 已同步","on"):t==="downloading"?ut("⬇ 下载中…","busy"):t==="uploading"?ut("⬆ 上传中…","busy"):t==="uploading-bulk"?ut("⬆ 上传大数据…","busy"):t==="merging"&&ut("🔄 整合中…","busy")}function sn(t,e,n,s){y.syncLog.unshift({ts:Date.now(),phase:t,durationMs:Math.round(e),detail:n||"",bytes:s||0}),y.syncLog.length>ci&&y.syncLog.pop()}function Nt(t){return(t||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Tt(t){t=String(t??"");let e=2166136261,n=2538058380;for(let s=0;s<t.length;s++){const r=t.charCodeAt(s);e=Math.imul(e^r,16777619)>>>0,n=Math.imul(n^r,16777643)>>>0}return e=(e^t.length)>>>0,n=(n^Math.imul(t.length,31))>>>0,("00000000"+e.toString(16)).slice(-8)+("00000000"+n.toString(16)).slice(-8)}function es(){return Date.now()<y.rateLimitBackoffUntil}function Re(t){const e=Math.min(3e4*Math.pow(2,t),3e5);y.rateLimitBackoffUntil=Date.now()+e,console.warn("[Cloud] 触发 API 限额退避，"+Math.round(e/1e3)+"秒内跳过请求")}const ui={429:1,500:1,502:1,503:1,504:1},di={GET:1,HEAD:1,PATCH:1,PUT:1,DELETE:1},$e=[800,2e3,4500];function pi(t){return new Promise(e=>setTimeout(e,t))}function fi(t){try{const e=t.headers&&t.headers.get?t.headers.get("X-RateLimit-Remaining"):null;return e!=null&&String(e)==="0"}catch{return!1}}function hi(t,e){return t===401?"auth":t===403?"ratelimit":t===404?"notfound":t===429?"ratelimit":t>=500?"server":"other"}function gi(t,e,n){return t==="auth"?"登录已失效或权限不足（"+e+"）：请到「设置 → 云同步」重新登录 GitHub":t==="ratelimit"?n?"已达 GitHub API 限额，稍后自动重试（可稍等片刻再手动同步）":"无权限访问该资源（"+e+"）：请检查令牌的 gist 权限":t==="notfound"?"资源不存在（"+e+"）：Gist 可能已在别处被删除":t==="network"?"网络连接失败：请检查网络后重试":t==="server"?"GitHub 服务暂时不可用（"+e+"），已自动重试":"HTTP "+e}function Ue(t,e,n,s){const r=new Error(t);return r.status=e||0,r.kind=n||"other",s&&(r.retries=s),r}function mi(t,e,n){const s=n||3e4;if(typeof AbortController>"u")return fetch(t,e);const r=new AbortController,o=setTimeout(()=>{try{r.abort()}catch{}},s);return fetch(t,Object.assign({},e,{signal:r.signal})).then(i=>(clearTimeout(o),i)).catch(i=>{clearTimeout(o);const a=i&&i.name==="AbortError",l=new Error(a?"请求超时（>"+Math.round(s/1e3)+"s）":i&&i.message||"网络错误");throw l.isNetwork=!0,l.isTimeout=!!a,l})}function yi(t){if(t&&t.timeoutMs!=null)return t.timeoutMs;const e=t&&t.body;if(!e)return 3e4;const s=(typeof e=="string"?e:JSON.stringify(e)).length;return s>=3*1024*1024?3e5:s>=1024*1024?24e4:s>=500*1024?12e4:s>=100*1024?6e4:3e4}async function _t(t,e){if(es())throw Ue("HTTP 403（退避中，"+Math.ceil((y.rateLimitBackoffUntil-Date.now())/1e3)+"s 后恢复）",403,"ratelimit");e=e||{};const n=String(e.method||"GET").toUpperCase(),s=!!di[n],r=e.retries===0||!s?1:e.retries||$e.length+1,o=yi(e);let i=null;for(let a=0;a<r;a++){a>0&&await pi($e[a-1]||$e[$e.length-1]);let l=null;try{l=await mi(or+t,{method:n,headers:(function(){const p={Authorization:"Bearer "+y.token,Accept:"application/vnd.github+json","Content-Type":"application/json"};return e.etag&&(p["If-None-Match"]=e.etag),p})(),body:e.body?JSON.stringify(e.body):void 0},o)}catch(p){if(p.status=0,p.kind="network",i=p,!s||a>=r-1)break;continue}const u=l.headers&&l.headers.get?l.headers.get("ETag"):null;if(l.status===304)return{status:304,etag:e.etag||u,data:null};if(!l.ok){const p=fi(l),d=hi(l.status),f=gi(d,l.status,p);p&&Re(0);const v=!!ui[l.status]&&s;if(i=Ue(f,l.status,d,a),!v||a>=r-1)break;continue}try{const p=await l.text();return{status:l.status,etag:u,data:p?JSON.parse(p):null}}catch(p){i=Ue("响应解析失败："+(p&&p.message||p),l.status,"parse",a);break}}throw i&&i.retries&&(i.message+="（已重试 "+i.retries+" 次）"),i||Ue("请求失败",0,"other")}async function Gt(t){if(!t)return null;if(t.truncated&&t.raw_url){const e=await fetch(t.raw_url);if(!e.ok)throw new Error("raw 拉取失败 HTTP "+e.status);return await e.text()}return t.content}async function dr(t,e){return(await _t("/gists",{method:"POST",body:{description:t,public:!1,files:e}})).data.id}async function ne(t,e){return(await _t("/gists/"+t,{method:"PATCH",body:{files:e}})).etag}function qn(t,e){const n={};return(e||st).forEach(s=>{n[s+".json"]={content:t[s]}}),n}async function vi(t){return await dr(Yn,qn(t))}async function mn(){let t=1,e=null,n="",s=null,r=-1;for(;t<=10;){let o;try{o=(await _t("/gists?per_page=100&page="+t)).data}catch(i){throw i&&(i.status===403||i.status===429||i.status>=500)&&(i.transient=!0),i}if(!o||!o.length)break;for(const i of o){const a=i.files||{};if(a[zt]){const l=i.updated_at||"";(!e||l>n)&&(e=i.id,n=l)}else if(a[qe]){const l=a[qe].size||0;l>r&&(r=l,s=i.id)}}t++}return e||s||null}async function bi(){let t=1,e=null,n="";for(;t<=10;){let s;try{s=(await _t("/gists?per_page=100&page="+t)).data}catch(r){throw r&&(r.status===403||r.status===429||r.status>=500)&&(r.transient=!0),r}if(!s||!s.length)break;for(const r of s)if(r.description===Yn){const o=r.updated_at||"";(!e||o>n)&&(e=r.id,n=o)}t++}return e}function wi(t){typeof t.key=="string"&&(t.key=""),Array.isArray(t.apis)&&t.apis.forEach(e=>{e&&typeof e.key=="string"&&(e.key="")})}function rn(t){const e=Object.assign({},t);return st.forEach(n=>{delete e[n]}),yt.forEach(n=>{delete e[n]}),e}function Gs(){try{return window.Store&&window.Store.rev?window.Store.rev():0}catch{return 0}}const On=new WeakMap;function Dn(t){if(t&&On.has(t)){const n=On.get(t);if(n&&n.rev===Gs())return n.hash}const e=Tt(JSON.stringify(t||[]));try{t&&On.set(t,{hash:e,rev:Gs()})}catch{}return e}function Rn(t){return!t||!t.length?[]:t.map(function(e){return Object.assign({},e)})}function pr(t){return t.cloudJob&&t.cloudJob.wftoken&&(t.cloudJob=Object.assign({},t.cloudJob),delete t.cloudJob.wftoken),q.syncAiKey!==!0&&t.ai&&(t.ai=JSON.parse(JSON.stringify(t.ai)),wi(t.ai)),t}function fr(){const t=window.Store.get(),e={};for(const n in t)st.indexOf(n)<0&&yt.indexOf(n)<0&&(e[n]=t[n]);return JSON.stringify(pr(e))}function on(t){if(t==null||typeof t!="object")try{return JSON.stringify(t)}catch{return String(t)}if(Array.isArray(t))return"["+t.map(on).join(",")+"]";const e={};for(const n in t)n.length>6&&n.slice(-6)==="Base64"||(e[n]=on(t[n]));return JSON.stringify(e)}function ns(t,e,n){const s=[],r={},o={};return(t||[]).forEach(i=>{i&&i.id!=null&&(r[i.id]=i)}),(e||[]).forEach(i=>{i&&i.id!=null&&(o[i.id]=i)}),Object.keys(o).forEach(i=>{const a=o[i];i in r?on(r[i])!==on(a)&&s.push({op:"upd",id:i,item:a}):s.push({op:"add",id:i,item:a})}),Object.keys(r).forEach(i=>{!(i in o)&&n&&n[i]&&s.push({op:"del",id:i})}),s}function hr(t,e,n){const s={};return(t||[]).forEach(r=>{r&&r.id!=null&&(s[r.id]=r)}),(e||[]).forEach(r=>{if(!(!r||r.id==null))if(r.op==="del")delete s[r.id];else{if(n&&n[r.id])return;s[r.id]=r.item}}),Object.keys(s).map(r=>s[r])}async function ki(t){if(!y.bulkGistId)return null;try{const e=await _t("/gists/"+y.bulkGistId,{etag:null});if(e.data&&e.data.files){const n=e.data.files[t+".json"];if(n){const s=await Gt(n);if(s!=null)return JSON.parse(s)}}}catch{}return null}function gr(t,e){return"op-"+(t||Date.now())+"-"+(e||"dev")+"-"+Math.random().toString(36).slice(2,7)+".json"}async function _i(t,e,n,s,r){const o={};let i=!1;for(const a of t){let l=n&&n[a]||[];if(!l.length)try{l=await ki(a)}catch{l=[]}const u=ns(l,e[a]||[],s&&s[a]||{});u.length&&(o[a]=u,i=!0)}return i?{gen:r||0,ts:Date.now(),dev:q.deviceId,ops:o}:null}function mr(t,e,n){t=t||{};const s={};return st.forEach(r=>{s[r]=(t[r]||[]).slice()}),(e||[]).forEach(r=>{const o=r&&r.ops;o&&st.forEach(i=>{o[i]&&o[i].length&&(s[i]=hr(s[i],o[i],n&&n[i]||{}))})}),s}function Si(){const t=JSON.parse(window.Store.exportJSON());return pr(t)}function Hs(t,e){le=!0;try{window.Store.mergeFrom(t,e||{})}finally{le=!1}window.App&&App.refresh(),window.Onboarding&&Onboarding.dismissIfNeeded&&Onboarding.dismissIfNeeded()}async function jt(t,e){if(!y.gistId){y.lastSyncAt=Date.now(),Bt();return}const n=performance.now();Pt("downloading");const s={pulled:[],pushed:[],bytes:0};let r;try{r=await _t("/gists/"+y.gistId,{etag:t?null:q.coreEtag})}catch(I){throw I&&I.status===404&&(I.deadGist=!0),I}if(r.status===304){Pt("idle"),sn("拉取",performance.now()-n,"304 无变化",0),y.lastSyncAt=Date.now(),Bt(),y.lastTransfer=s;return}q.coreEtag=r.etag;const o=r.data;if(!o||!o.files){y.lastSyncAt=Date.now(),Bt();return}const i=o.files,a=o.updated_at?new Date(o.updated_at).getTime():Date.now();if(!i[zt]&&i[qe]){const I=await Gt(i[qe]);if(I){s.bytes+=pt(I),s.pulled.push("整包(旧格式)");try{const x=Tt(JSON.stringify(Si()));Tt(I)!==x&&Hs(JSON.parse(I),e)}catch(x){console.error("[Cloud] 旧格式解析/合并失败",x)}}q.legacyRemote=!0,y.lastPushedAt=a,y.lastSyncAt=Date.now(),Bt(),y.lastTransfer=s;return}const l=await Gt(i[Wn]),u=await Gt(i[zt]);if(!l||!u){y.lastSyncAt=Date.now(),Bt();return}s.bytes+=pt(l)+pt(u),s.pulled.push("核心");let p,d;try{p=JSON.parse(l),d=JSON.parse(u)}catch(I){console.error("[Cloud] 核心数据解析失败",I);return}q.legacyRemote=!1,d.bulkGistId&&(y.bulkGistId=d.bulkGistId);const f=d.compactGen||0,v=Object.keys(i).filter(I=>ri.test(I)),m=Object.keys(i).filter(I=>gn.test(I)),b=v.length&&!m.length;if(b){const I={};v.forEach(x=>I[x]=null);try{await ne(y.gistId,I)}catch{}q.compactGen||(q.compactGen=1)}const h=Object.assign({},window.Store.get()),g=h.tomb||{},A=(b||f>(q.compactGen||0))&&!!y.bulkGistId,j={},E={};if(A){const I=await _t("/gists/"+y.bulkGistId,{etag:t?null:q.bulkEtag});if(I.status!==304&&I.data&&I.data.files){q.bulkEtag=I.etag;for(const x of st){const S=I.data.files[x+".json"];if(S){const J=await Gt(S);J!=null&&(s.bytes+=pt(J),s.pulled.push(ts[x]+"(快照)"),j[x]=JSON.parse(J))}}for(const x of yt){const S=I.data.files[x+".json"];if(S){const J=await Gt(S);J!=null&&(s.bytes+=pt(J),s.pulled.push((en[x]||x)+"(快照)"),E[x]=JSON.parse(J))}}}q.compactGen=f||(b?1:q.compactGen||0),q.appliedOps=[],q.opCount=0}const P={};(q.appliedOps||[]).forEach(I=>P[I]=1);const T=[];for(const I of m)if(!P[I])try{const x=await Gt(i[I]);if(!x)continue;const S=JSON.parse(x);if(!S||!S.ops)continue;S.__name=I,T.push(S),s.bytes+=pt(x)}catch{}T.sort((I,x)=>(I.ts||0)-(x.ts||0)),T.length&&s.pulled.push("op×"+T.length);const C=A?j:h,R=mr(C,T,g),N=Object.assign({},p);if(st.forEach(I=>{N[I]=I in R?R[I]:C[I]||[]}),yt.forEach(I=>{I in E&&(N[I]=E[I])}),!A&&y.bulkGistId){const I=d.heavy||{},x=window.Store.get(),S=yt.filter(J=>{const F=I[J];return F&&F.hash!==Tt(JSON.stringify(x[J]||null))});if(S.length)try{const J=await _t("/gists/"+y.bulkGistId,{etag:null});if(J.data&&J.data.files)for(const F of S){const it=J.data.files[F+".json"];if(it){const vt=await Gt(it);vt!=null&&(s.bytes+=pt(vt),s.pulled.push(en[F]||F),N[F]=JSON.parse(vt))}}}catch(J){console.warn("[Cloud] 重量级字段拉取失败",J)}}const U=Tt(JSON.stringify(rn(N)))===Tt(JSON.stringify(rn(Object.assign({},h)))),B=yt.some(I=>{if(I in E)return!0;const x=d.heavy&&d.heavy[I];return!x||!x.hash?!1:x.hash!==Tt(JSON.stringify(h[I]||null))}),$=!(U&&T.length===0&&!A&&!B),V=performance.now();if(Pt("merging"),$)try{Hs(N,e)}catch(I){console.error("[Cloud] 合并失败",I)}T.length&&(q.appliedOps=q.appliedOps||[],T.forEach(I=>{I.__name&&q.appliedOps.indexOf(I.__name)<0&&q.appliedOps.push(I.__name)}));const ot=window.Store.get();y._remoteColls={},st.forEach(I=>{y._remoteColls[I]=Rn(ot[I])});const At=performance.now()-V,Tn=performance.now()-n;Pt("idle"),sn("拉取",Tn,(s.pulled.length?s.pulled.join(","):"无变化")+" · 整合"+Math.round(At)+"ms",s.bytes),y.lastPushedAt=a,y.lastSyncAt=Date.now(),Bt(),y.lastTransfer=s}let se=0;function ss(){if(!(!y.enabled||!y.token||le)){var t=nn(),e=t>0?t:Js,n=Date.now(),s=Math.max(y.lastPushedAt||0,y.lastPushAttemptAt||0),r=s+e;if(r<=n)r=n+Js;else if(ee&&se&&se<=r){Bn();return}ee&&clearTimeout(ee),se=r,ee=setTimeout(xi,Math.max(0,r-n)),Bn()}}function xi(){if(ee=null,se=0,y.pushing){ss();return}y.lastPushAttemptAt=Date.now(),Ct().catch(t=>{console.error("[Cloud] 推送失败",t),ut("☁ 同步失败","err")})}function yr(){if(!se||y.syncPhase!=="idle")return"";var t=Math.max(0,se-Date.now()),e=t>=6e4?Math.round(t/6e4)+" 分钟":Math.max(1,Math.round(t/1e3))+" 秒";return`
⏱ 有改动待推送：约 `+e+"后自动同步（可在同步面板改为实时）"}function Bn(){y.badge&&(y.badge.title=(y.badgeBaseTitle||y.badge.title||"")+yr())}async function Ct(t){t=t||{};const e=t.bulk===!0;if(!y.enabled||!y.token||y.pushing)return;y.pushing=!0,Pt(e?"uploading-bulk":"uploading");const n=performance.now(),s={pulled:[],pushed:[],bytes:0};try{if(y.gistId&&q.coreEtag==null)try{le=!0;try{await jt(!1,{preserveLocal:!0})}finally{le=!1}}catch(N){console.warn("[Cloud] 推前校准失败，已跳过（稍后重试）",N)}const r=window.Store.get(),o=fr(),i=Tt(o),a={};st.forEach(N=>{a[N]=Dn(r[N])});const l=q.pushedHashes||{},u=!!q.legacyRemote;let p=!1,d={};if(e||!y.bulkGistId||u||(q.opCount||0)>=De){try{le=!0;try{await jt(!0,{preserveLocal:!0})}finally{le=!1}}catch(V){console.warn("[Cloud] 压实前合并失败，已跳过（可能丢远端新增）",V)}const N=window.Store.get();let U=!1;if(!y.bulkGistId)try{y.bulkGistId=await bi()}catch(V){V&&V.transient&&(U=!0)}const B={};st.forEach(V=>{B[V]=JSON.stringify(N[V]||[])}),yt.forEach(V=>{B[V]=JSON.stringify(N[V]||null)});let $=null;if(y.bulkGistId){const V=st.concat(yt).filter(ot=>{const At=B[ot]!=null?B[ot]:"null";return Tt(At)!==(q.bulkHashes[ot]||"")});if(V.length){const ot={};V.forEach(At=>{ot[At]=B[At]}),$=await ne(y.bulkGistId,qn(ot,V)),s.pushed.push("整包快照("+V.length+"/"+(st.length+yt.length)+" 变化集合)"),s.bytes+=pt(JSON.stringify(ot))}else s.pushed.push("整包快照(无变化,跳过)")}else U?console.warn("[Cloud] 大数据 Gist 发现遇瞬时错误，本次跳过整包上传（避免重复建）"):(y.bulkGistId=await vi(B),s.pushed.push("整包快照"),s.bytes+=pt(JSON.stringify(B)));$&&(q.bulkEtag=$),d={},(q.appliedOps||[]).forEach(V=>{gn.test(V)&&(d[V]=null)}),u&&st.forEach(V=>d[V+".ops.json"]=null),q.compactGen=(q.compactGen||0)+1,q.appliedOps=[],q.opCount=0,q.bulkHashes=q.bulkHashes||{},st.concat(yt).forEach(V=>{q.bulkHashes[V]=Tt(B[V]!=null?B[V]:"null")}),p=!0,y._remoteColls={},st.forEach(V=>{y._remoteColls[V]=Rn(N[V])})}let f={};const v=st.filter(N=>!p&&(u||a[N]!==l[N]));if(v.length&&!p){const N=await _i(v,r,y._remoteColls,r.tomb||{},q.compactGen||0);if(N){const U=gr(Date.now(),q.deviceId);f[U]={content:JSON.stringify(N)},s.bytes+=pt(JSON.stringify(N)),s.pushed.push("op:"+v.map(B=>ts[B]).join("/")),q.appliedOps=q.appliedOps||[],q.appliedOps.indexOf(U)<0&&q.appliedOps.push(U),q.opCount=(q.opCount||0)+1,y._remoteColls||(y._remoteColls={}),v.forEach(B=>{y._remoteColls[B]=Rn(r[B])})}}let m=[],b={};if(!p&&y.bulkGistId&&(m=yt.filter(N=>Tt(JSON.stringify(r[N]||null))!==(l[N]||"")),m.length)){m.forEach(N=>{b[N]=JSON.stringify(r[N]||null)});try{const N=await ne(y.bulkGistId,qn(b,m));N&&(q.bulkEtag=N)}catch(N){console.warn("[Cloud] 重量级字段上传失败",N)}m.forEach(N=>{s.pushed.push(en[N]||N),s.bytes+=pt(b[N]||"")})}const h={};yt.forEach(N=>{h[N]=Tt(JSON.stringify(r[N]||null))});const g={ver:3,bulkGistId:y.bulkGistId,compactGen:q.compactGen||0,colls:{},heavy:{}};st.forEach(N=>{g.colls[N]={hash:Dn(r[N]),n:(r[N]||[]).length}}),yt.forEach(N=>{g.heavy[N]={hash:h[N]}});const A=JSON.stringify(g),j=Tt(A),E=u||i!==l.core||j!==l.manifest||p,P=Object.assign({[Wn]:{content:o},[zt]:{content:A}},f);u&&(P[qe]=null),p&&Object.assign(P,d||{});const T=!y.gistId||E||Object.keys(f).length||p&&d&&Object.keys(d).length;if(!y.gistId)y.gistId=await dr(ir,P),s.pushed.unshift("核心"),s.bytes+=pt(o)+pt(A);else if(T){try{const N=await ne(y.gistId,P);N&&(q.coreEtag=N)}catch(N){if(N&&(N.status===404||N.status===401)){y.gistId=null;let U=null;try{U=await mn()}catch(B){console.warn("[Cloud] 重发现 Gist 失败（不新建）",B)}if(U){y.gistId=U;try{const B=await ne(y.gistId,P);B&&(q.coreEtag=B),s.pushed.unshift("核心"),s.bytes+=pt(o)+pt(A)}catch(B){console.warn("[Cloud] 重指向后补丁失败",B)}}else console.warn("[Cloud] Gist 404 但未能重新发现，跳过本次核心写入（避免重复建）")}else throw N&&N.status===403&&Re(0),N}s.pushed.unshift("核心"),s.bytes+=pt(o)+pt(A)}q.pushedHashes=Object.assign({core:i,manifest:j},a,h),q.legacyRemote=!1;const C=Object.keys(f).length>0;y.gistId&&!es()&&C&&jt(!1,{preserveLocal:!0}).catch(N=>{console.warn("[Cloud] 后台合并跳过",N)}),y.lastPushedAt=Date.now(),y.lastSyncAt=Date.now(),y.lastTransfer=s,y.pendingBulk=[];try{const N=window.PlazaAutoPull;N&&typeof N.onCloudSync=="function"&&N.onCloudSync()}catch{}const R=performance.now()-n;sn("推送",R,s.pushed.length?s.pushed.join(","):"无变化",s.bytes),Bt(),Pt("idle")}catch(r){console.error("[Cloud] 推送失败",r);const o=r&&r.message?r.message:""+r;Pt("idle"),ut("☁ 同步失败","err"),y.badge&&(y.badge.title="同步失败："+o),sn("推送",performance.now()-n,"失败: "+o,0),window.Toast&&X.danger("☁ 同步失败："+o)}finally{y.pushing=!1}}async function vr(){y.gistId=null,q.gistId=null,q.coreEtag=null,q.bulkEtag=null,y.lastPushedAt=0;try{const t=await mn();if(t)return y.gistId=t,q.gistId=t,y.bulkGistId=q.bulkGistId||null,!0}catch(t){if(t&&t.transient)throw t;console.warn("[Cloud] 重发现 Gist 失败",t)}return!1}async function br(){ut("☁ 同步中…","busy");try{if(!y.gistId&&q.gistId&&(y.gistId=q.gistId,y.bulkGistId=q.bulkGistId||null),!y.gistId){try{y.gistId=await mn()}catch(e){if(e&&e.transient){console.warn("[Cloud] 发现 Gist 遭遇瞬时错误，将在轮询中自愈重试",e.message),Pt("idle"),Ke();return}console.warn("[Cloud] 发现 Gist 失败",e)}y.lastPushedAt=0,q.coreEtag=null,q.bulkEtag=null}y.bulkGistId=q.bulkGistId||y.bulkGistId||null;try{await jt()}catch(e){if(e&&e.deadGist)await vr()?await jt():await Ct();else throw e}if(!y.gistId)await Ct();else{var t=nn();t>0&&y.lastPushedAt>0&&Date.now()-y.lastPushedAt>=t&&(console.log("[Cloud] 开机追赶：距上次推送超一个周期，立即补推"),y.lastPushAttemptAt=Date.now(),await Ct()),ss()}Pt("idle"),Ke()}catch(e){console.error("[Cloud] 同步失败",e);const n=e&&e.message?e.message:""+e;Pt("idle"),ut("☁ 同步失败","err"),y.badge&&(y.badge.title="同步失败："+n),window.Toast&&X.danger("☁ 同步失败："+n),Ke()}}function Ke(){wr(),y.pollTimer=setInterval(async()=>{if(!es()){if(!y.gistId&&!q.gistId){try{y.gistId=await mn()}catch(t){if(t&&t.transient)return}if(!y.gistId){await Ct();return}}try{await jt(!1,{preserveLocal:!0}),ut("☁ 已同步","on")}catch(t){if(t&&t.status===403)Re(0);else if(t&&t.deadGist)try{await vr()&&(await jt(!1,{preserveLocal:!0}),ut("☁ 已同步","on"))}catch{}}}},jn())}function wr(){y.pollTimer&&(clearInterval(y.pollTimer),y.pollTimer=null)}async function Ai(){const t=ii();if(!t){ut("☁ 未同步","off");return}y.token=t,y.enabled=!0,y.gistId=null,y.lastPushedAt=q.lastPushedAt||0,await br()}async function Ei(t,e){y.token=t.trim();try{await _t("/rate_limit"),y.enabled=!0,ai(),y.gistId=null,y.lastPushedAt=q.lastPushedAt||0,ve(),await br()}catch(n){y.token=null,y.enabled=!1,ie(e,n.status===401?"令牌无效或无 gist 权限，请检查":n.message||"验证失败")}}async function kr(){wr(),li(),y.token=null,y.enabled=!1,y.gistId=null,y.bulkGistId=null,y.rateLimitBackoffUntil=0,y.lastTransfer=null,q={syncAiKey:q.syncAiKey,pushedHashes:{},bulkHashes:{},appliedOps:[],compactGen:0,opCount:0},Bt(),ut("☁ 未同步","off")}function _r(){if(document.getElementById("cloud-style"))return;const t=document.createElement("style");t.id="cloud-style",t.textContent=`
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
#cloud-card a{color:#2f54eb}`,document.head.appendChild(t)}var Zt=null;function zs(t){var e=t.querySelector?t.querySelector("#sb-theme"):null;e&&typeof t.insertBefore=="function"?y.badge.previousSibling!==e&&t.insertBefore(y.badge,e.nextSibling):y.badge.parentNode!==t&&t.appendChild(y.badge)}function Sr(){if(y.badge){var t=document.getElementById("statusbar");if(t){zs(t),Zt&&(Zt.disconnect(),Zt=null);return}y.badge.parentNode!==document.body&&document.body.appendChild(y.badge),!Zt&&(Zt=new MutationObserver(function(){var e=document.getElementById("statusbar");e&&(zs(e),Zt.disconnect(),Zt=null)}),Zt.observe(document.body,{childList:!0,subtree:!0}))}}function ut(t,e){_r(),y.badge||(y.badge=document.createElement("div"),y.badge.id="cloud-badge",y.badge.onclick=Ar),Sr();let n=t;e==="on"&&y.gistId?n="☁ #"+y.gistId.slice(0,6):e==="on"?n="☁ 已同步":e==="off"?n="☁ 未同步":e==="err"?n="☁ 同步失败":n=t,y.badge.className=e,y.badge.textContent=n;let s=y.gistId?"核心 Gist: "+y.gistId+"（两台设备核心 ID 相同即同一份数据）":"未连接云端";y.lastTransfer&&(s+=xr(y.lastTransfer)),y.badgeBaseTitle=s,y.badge.title=s+yr()}function xr(t){const e=[];t.pulled&&t.pulled.length&&e.push("拉取: "+t.pulled.join("、")),t.pushed&&t.pushed.length&&e.push("推送: "+t.pushed.join("、")),e.length||e.push("无变化（增量跳过）");const n=t.bytes?"（"+(t.bytes>1024?Math.round(t.bytes/1024*10)/10+" KB":t.bytes+" B")+"）":"";return`
最近同步 `+e.join(" · ")+n}function Ar(){if(_r(),document.getElementById("cloud-mask"))return;const t=document.createElement("div");t.id="cloud-mask",y.token?Ve(t):Ti(t),document.body.appendChild(t),t.onclick=e=>{e.target===t&&ve()}}function ve(){const t=document.getElementById("cloud-mask");t&&t.remove()}function Ti(t){t.innerHTML='<div id="cloud-card"><h3>☁ 同步到你的 GitHub</h3><input id="cv-t" placeholder="粘贴 GitHub 个人令牌" type="password"><div class="err" id="cv-err"></div><div class="row"><button class="primary" id="cv-ok">保存并同步</button><button class="ghost" id="cv-cancel">取消</button></div><div class="hint">① 去 <a href="'+si+'" target="_blank" rel="noreferrer">生成令牌</a>，只勾 <b>gist</b> 权限；<br>② 令牌仅存于本机浏览器，数据存在你自己的 Gist 里，别人看不到；<br>③ 不同设备用同一令牌即自动同步同一份数据。</div></div>',t.querySelector("#cv-cancel").onclick=ve,t.querySelector("#cv-ok").onclick=()=>{const e=t.querySelector("#cv-t").value.trim();if(!e){ie(t,"请粘贴令牌");return}Ei(e,t)}}function Ve(t){const e=y.lastSyncAt?new Date(y.lastSyncAt).toLocaleString():"—",n=y.gistId?"https://gist.github.com/"+y.gistId:"#",s=y.gistId?y.gistId.slice(0,8):"（未绑定）",r=y.lastTransfer?xr(y.lastTransfer).replace(/^\n/,""):"尚无同步记录",i='<span style="color:#1a56c4;font-weight:500">🧩 追加同步 '+(q.opCount||0)+"/"+De+" op 文件（达阈值自动压实整包）</span><br>",a=y.syncLog.slice(0,8);let l="";if(a.length){l='<details style="margin-top:10px"><summary style="cursor:pointer;font-size:13px;font-weight:500;color:#1a56c4;margin-bottom:6px">📋 同步历史（最近 '+a.length+' 次）</summary><table style="width:100%;border-collapse:collapse;font-size:12px;margin-top:4px"><tr style="background:#f6f6f6;color:#666"><th style="padding:4px 6px;text-align:left">时间</th><th style="padding:4px 6px;text-align:left">操作</th><th style="padding:4px 6px;text-align:right">耗时</th><th style="padding:4px 6px;text-align:right">数据量</th></tr>';for(let f=0;f<a.length;f++){const v=a[f],m=new Date(v.ts).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),b=v.durationMs<1e3?v.durationMs+"ms":(v.durationMs/1e3).toFixed(1)+"s",h=v.bytes>1024?Math.round(v.bytes/1024*10)/10+"KB":v.bytes+"B",g=v.phase==="拉取"?"#1a7f37":v.phase==="推送"?"#2f54eb":"#c0392b";l+='<tr style="border-top:1px solid #eee"><td style="padding:3px 6px;color:#888;white-space:nowrap">'+m+'</td><td style="padding:3px 6px" title="'+Nt(v.detail)+'"><span style="color:'+g+';font-weight:500">'+Nt(v.phase)+"</span> "+Nt((v.detail||"").slice(0,30))+'</td><td style="padding:3px 6px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums">'+b+'</td><td style="padding:3px 6px;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;color:#888">'+h+"</td></tr>"}l+="</table></details>"}const u=(function(){try{const f=window.Store.get();let v=0,m=0,b=0;for(const h in f){const g=JSON.stringify(f[h]||"").length;if(st.indexOf(h)>=0){m+=g;continue}if(yt.indexOf(h)>=0){b+=g;continue}v+=g}return(v/1024).toFixed(1)+" KB 核心，"+(m/1024).toFixed(1)+" KB 大数据，"+(b/1024).toFixed(1)+" KB 重量级"}catch{return"—"}})();t.innerHTML='<div id="cloud-card"><h3>☁ 已同步到你的 GitHub（追加同步）</h3><div class="hint" style="margin-top:0">最近同步：'+e+'　<span id="cv-phase" style="color:'+(y.syncPhase!=="idle"?"#2f54eb":"#1a7f37")+';font-weight:500">'+(y.syncPhase==="downloading"?"⬇ 下载中…":y.syncPhase==="uploading"?"⬆ 上传中…":y.syncPhase==="uploading-bulk"?"⬆ 上传大数据…":y.syncPhase==="merging"?"🔄 整合中…":"✅ 空闲")+"</span><br>"+i+'<div style="font-size:12px;color:#555;margin:6px 0;padding:6px 8px;background:#f8f9fa;border-radius:6px">📊 '+u+'　<a style="color:#2f54eb;cursor:pointer" id="cv-go-settings">→ 去设置查看详情</a></div>核心 Gist ID：<b style="color:#1a7f37">'+s+"</b>"+(y.bulkGistId?"　图库 Gist：<b>"+y.bulkGistId.slice(0,8)+"</b>":"")+'<br>Gist 地址：<a href="'+n+'" target="_blank" rel="noreferrer">查看</a><br><span style="color:#1a56c4">'+r+"</span>"+l+'<span style="color:#c0392b;display:block;margin-top:6px">⚠ 跨设备同步前提：<b>每台设备粘贴【同一个】令牌</b>且都升级到新版（追加同步）。旧版本会把整包写回，造成格式混用。</span></div><label style="display:flex;align-items:center;gap:6px;font-size:13px;margin-top:10px;color:#444;cursor:pointer" title="开启（默认）：Key 随云端同步，换设备 / 重装后拉取一次即自动取回（Gist 为私有，仅本人令牌可读）。&#10;关闭：Key 只存本机、不上传云端——更保守，但换设备需手动重填。&#10;无论开关如何，本机已填好的 Key 都不会被云端空值清掉（2026-09-04 起）。"><input type="checkbox" id="cv-ai"'+(q.syncAiKey!==!1?" checked":"")+'> 同步 AI Key 到云端 <span style="color:#888">（默认开 · 换设备免重填）</span></label><div class="hint" style="margin-top:8px">⏱ 自动推送 / 拉取频率：<a style="color:#2f54eb;cursor:pointer" id="cv-go-freq">前往设置调整</a>（周期内的改动合并推送，省同步次数；改动始终实时存本机，关机不丢，重开超周期自动补推）。</div><div class="row"><button class="primary" id="cv-sync">拉取+推送</button><button class="ghost" id="cv-pull">仅拉取远端</button></div><div class="row"><button class="accent" id="cv-all">生成完整快照（压实 op 日志）</button></div><div class="row"><button class="primary" id="cv-copy">复制同步令牌</button><button class="ghost" id="cv-out">退出</button></div><div class="err" id="cv-err"></div><div class="hint">退出仅清除本机令牌，云端数据不删；换设备用同一令牌仍可取回。</div></div>',t.querySelector("#cv-ai").onchange=f=>{q.syncAiKey=f.target.checked,delete q.pushedHashes.core,delete q.pushedHashes.manifest,Bt(),Ct().then(()=>ut("☁ 已同步","on")).catch(()=>{})};var p=t.querySelector("#cv-go-freq");p&&(p.onclick=()=>{ve(),window.App&&App.go("settings")}),t.querySelector("#cv-sync").onclick=()=>{jt(!0).then(Ct).then(()=>{Ve(t),ut("☁ 已同步","on"),window.Toast&&X.success("已与云端同步")}).catch(()=>ie(t,"同步失败，请重试"))},t.querySelector("#cv-all").onclick=()=>{Pt("uploading-bulk"),window.Toast&&X.show("正在生成完整快照（压实 op 日志）…","info"),Ct({bulk:!0}).then(()=>{Ve(t),ut("☁ 已同步","on"),window.Toast&&X.success("已生成完整快照并压实")}).catch(()=>ie(t,"生成快照失败，请重试"))},t.querySelector("#cv-pull").onclick=()=>{jt(!0).then(()=>{Ve(t),ut("☁ 已同步","on"),window.Toast&&X.success("已拉取远端数据")}).catch(()=>ie(t,"拉取失败，请检查网络或令牌"))},t.querySelector("#cv-copy").onclick=()=>{const f=y.token||"",v=()=>ie(t,"已复制令牌，去另一台设备粘贴即可同步同一份数据"),m=()=>ie(t,"当前环境不支持自动复制，请手动复制令牌");navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(f).then(v).catch(m):m()},t.querySelector("#cv-out").onclick=()=>{kr(),ve()};const d=t.querySelector("#cv-go-settings");d&&(d.onclick=()=>{ve(),window.App&&App.go("settings")})}function ie(t,e){const n=t.querySelector("#cv-err");n&&(n.textContent=e)}async function Ii(t){t=t||{};const e=t.confirm||(u=>typeof window<"u"&&window.confirm?window.confirm(u):!0),n=t.progress||(()=>{}),s=t.phase||(()=>{}),r=t.result||(()=>{}),o=t.error||(u=>{window.Toast&&X.danger(u)});if(!y.token)return o("未登录，无法清理"),null;if(!await e(`将删除你 GitHub 账号下所有「同名但当前设备未在使用」的同步 Gist（保留当前活跃的那一对）。

这能清掉旧版本反复新建产生的重复/垃圾同步文件，减少 API 配额占用、避免同步变慢。

确认继续？此操作不可逆（但只删不再被任何设备引用的文件，活跃数据完好）。`))return null;s("uploading");const a=u=>new Promise(p=>setTimeout(p,u)),l=Date.now();try{const u=[],p=[];for(let E=1;E<=5;E++){let P;try{P=(await _t("/gists?per_page=100&page="+E)).data}catch(T){if(T&&T.status===403){Re(0),await a(3e4),E--;continue}throw T}if(!P||!P.length)break;for(const T of P){const C=T.description||"";C===ir?u.push(T):C===Yn&&p.push(T)}if(P.length<100)break}let d=null;if(q.gistId&&(d=u.find(E=>E.id===q.gistId&&E.files&&E.files[zt])||null),!d){const E=u.filter(T=>T.files&&T.files[zt]);d=(E.length?E:u).slice().sort((T,C)=>(C.updated_at||"").localeCompare(T.updated_at||""))[0]||null}let f=null;if(d&&d.files&&d.files[zt])try{const E=await Gt(d.files[zt]),P=E?JSON.parse(E):null;P&&P.bulkGistId&&(f=p.find(T=>T.id===P.bulkGistId)||null)}catch{}!f&&p.length&&(f=p.slice().sort((E,P)=>(P.updated_at||"").localeCompare(E.updated_at||""))[0]||null);const v=d?d.id:null,m=f?f.id:null,b=u.filter(E=>E.id!==v).concat(p.filter(E=>E.id!==m));if(!b.length){const E={ok:!0,deleted:0,failed:0,kept:{core:v,bulk:m},total:0,startedAt:l,finishedAt:Date.now(),message:"没有需要清理的孤儿 Gist，你的云端很干净 ✅"};return window.Toast&&X.success(E.message),r(E),s("idle"),E}n("发现 "+b.length+" 个孤儿 Gist，开始删除（保留活跃对）…");let h=0,g=0;for(let E=0;E<b.length;E++){const P=b[E];let T=!1,C=0;for(;C<5&&!T;)try{await _t("/gists/"+P.id,{method:"DELETE"}),T=!0}catch(R){if(R&&R.status===404)T=!0;else if(R&&R.status===403)Re(C),await a(Math.min(3e4*Math.pow(2,C),3e5)),C++;else{g++;break}}T&&h++,n("清理中… 已删除 "+h+" / "+b.length+(g?"（失败 "+g+"）":"")),await a(200)}const A=Date.now(),j={ok:!0,deleted:h,failed:g,kept:{core:v,bulk:m},total:b.length,startedAt:l,finishedAt:A,message:"清理完成：删除 "+h+" 个孤儿 Gist"+(g?"，"+g+" 个失败":"")+"，已保留活跃对"};return window.Toast&&X.success(j.message),r(j),s("idle"),j}catch(u){s("idle");const p="清理失败："+(u&&u.message?u.message:u);return o(p),{ok:!1,error:p,startedAt:l,finishedAt:Date.now()}}}function Se(t){return t>=1024?Math.round(t/1024*10)/10+" KB":t+" B"}function pt(t){if(t==null)return 0;if(t=String(t),typeof TextEncoder<"u")try{return new TextEncoder().encode(t).length}catch{}let e=0;for(let n=0;n<t.length;n++){const s=t.charCodeAt(n);e+=s<128?1:s<2048?2:3}return e}function Oi(t){const e=/^op-(\d+)-/.exec(t);if(!e)return"";try{return new Date(+e[1]).toLocaleString([],{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}catch{return""}}function Mi(){try{const t=window.Store.get(),e=[],n=[],s=[];let r=0,o=0,i=0;for(const u in t){const p=JSON.stringify(t[u]||"").length;if(st.indexOf(u)>=0){n.push({k:u,kb:(p/1024).toFixed(1),sz:p}),o+=p;continue}if(yt.indexOf(u)>=0){s.push({k:u,kb:(p/1024).toFixed(1),sz:p}),i+=p;continue}r+=p,e.push({k:u,kb:(p/1024).toFixed(1),sz:p})}e.sort((u,p)=>p.sz-u.sz);const a=e.slice(0,15);let l='<details open style="margin-top:6px"><summary style="cursor:pointer;color:#2f54eb;font-weight:500;font-size:13px">📊 核心体积诊断（'+(r/1024).toFixed(1)+" KB 核心，"+(o/1024).toFixed(1)+" KB 大数据，"+(i/1024).toFixed(1)+" KB 重量级）</summary>";return s.length&&(l+='<div style="font-size:11px;color:#888;margin:4px 0">⬅ 已从核心剥离（重量级对象字段）：',l+=s.map(u=>Nt(u.k)+" "+u.kb+"KB").join(" / "),l+="</div>"),n.length&&(l+='<div style="font-size:11px;color:#888;margin:2px 0">⬅ 已从核心剥离（大数据数组）：',l+=n.filter(u=>u.sz>500).map(u=>Nt(u.k)+" "+u.kb+"KB").join(" / "),l+="</div>"),l+='<table style="width:100%;font-size:12px;margin-top:4px;border-collapse:collapse">',l+='<tr style="border-bottom:1px solid #ddd"><th style="text-align:left;padding:2px 6px;color:#888">字段</th><th style="text-align:right;padding:2px 6px;color:#888">KB</th><th style="text-align:left;padding:2px 6px;color:#888;width:60%">占比</th></tr>',a.forEach(u=>{const p=r>0?(u.sz/r*100).toFixed(0):0,d=u.sz>1e4?"#c0392b":u.sz>3e3?"#e67e22":"#1a7f37";l+='<tr><td style="padding:1px 6px;font-family:monospace;font-size:11px">'+Nt(u.k)+'</td><td style="padding:1px 6px;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap">'+u.kb+'</td><td style="padding:1px 6px"><div style="background:#eee;border-radius:3px;height:12px;display:inline-block;min-width:40px;vertical-align:middle"><div style="background:'+d+";height:100%;border-radius:3px;width:"+Math.min(p,100)+'%"></div></div> <span style="color:#888;font-size:11px">'+p+"%</span></td></tr>"}),e.length>15&&(l+='<tr><td colspan="3" style="padding:2px 6px;color:#888;font-size:11px">… 还有 '+(e.length-15)+" 个更小的字段</td></tr>"),l+="</table></details>",l}catch{return""}}async function Er(){const t={core:[],bulk:[],coreTotal:0,bulkTotal:0,total:0,gen:q.compactGen||0,opCount:q.opCount||0,error:null};try{if(y.gistId){const e=await _t("/gists/"+y.gistId,{etag:null});if(e.data&&e.data.files){for(const s in e.data.files){const r=e.data.files[s],o=typeof r.size=="number"?r.size:r.content?r.content.length:0;let i="other",a=s;s===Wn?(i="core",a="核心 core.json"):s===zt?(i="manifest",a="清单 manifest.json"):gn.test(s)&&(i="op"),t.core.push({name:s,size:o,type:i,label:a}),t.coreTotal+=o}const n=e.data.files[zt];if(n){const s=await Gt(n);if(s)try{const r=JSON.parse(s);typeof r.compactGen=="number"&&(t.gen=r.compactGen),r.bulkGistId&&(y.bulkGistId=r.bulkGistId)}catch{}}}}if(y.bulkGistId){const e=await _t("/gists/"+y.bulkGistId,{etag:null});if(e.data&&e.data.files)for(const n in e.data.files){const s=e.data.files[n],r=typeof s.size=="number"?s.size:s.content?s.content.length:0;let o="bulk",i=n;st.forEach(a=>{n===a+".json"&&(o="coll",i=(ts[a]||a)+".json")}),yt.forEach(a=>{n===a+".json"&&(o="heavy",i=(en[a]||a)+".json")}),t.bulk.push({name:n,size:r,type:o,label:i}),t.bulkTotal+=r}}t.total=t.coreTotal+t.bulkTotal}catch(e){t.error=e&&e.message?e.message:""+e}return t}function Tr(t){const e=t.core.filter(a=>a.type==="op").sort((a,l)=>l.name.localeCompare(a.name)),n=t.core.filter(a=>a.type==="core"||a.type==="manifest"),s=t.gen,r=t.opCount,o=Math.min(100,Math.round(r/De*100));let i='<div style="font-size:13px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b style="color:#1a56c4">☁ 云端数据分布</b><button class="btn btn-ghost cs-refresh" style="padding:2px 8px;font-size:12px">🔄 刷新</button></div>';return i+='<div style="font-size:12px;color:#444;margin-bottom:4px">总占用 <b>'+Se(t.total)+"</b>　·　压实代次 <b>#"+s+"</b>　·　op 文件 <b>"+e.length+"/"+De+"</b></div>",i+='<div style="background:#eee;border-radius:4px;height:8px;margin:2px 0 8px"><div style="background:'+(o>=100?"#c0392b":"#2f54eb")+";height:100%;border-radius:4px;width:"+o+'%"></div></div>',i+='<div style="font-size:12px;font-weight:600;color:#666;margin-top:4px">📦 核心 Gist</div>',i+='<table style="width:100%;font-size:12px;border-collapse:collapse">',n.forEach(a=>{i+='<tr><td style="padding:1px 6px">'+Nt(a.label)+'</td><td style="padding:1px 6px;text-align:right;font-variant-numeric:tabular-nums;color:#888">'+Se(a.size)+"</td></tr>"}),e.length&&(i+='<tr><td colspan="2" style="padding:2px 6px;color:#1a56c4;font-weight:500">op 增量文件（'+e.length+" 个，共 "+Se(e.reduce((a,l)=>a+l.size,0))+"）</td></tr>",e.slice(0,30).forEach(a=>{i+='<tr><td style="padding:1px 6px;font-family:monospace;font-size:10px;color:#555">'+Nt(a.name.slice(0,26))+(a.name.length>26?"…":"")+'<br><span style="color:#aaa">'+Oi(a.name)+'</span></td><td style="padding:1px 6px;text-align:right;white-space:nowrap"><span style="color:#888;font-variant-numeric:tabular-nums">'+Se(a.size)+'</span> <button class="cs-op-del" data-name="'+Nt(a.name)+'" title="只删这一个 op 文件（不合并、不压实）" style="padding:0 5px;font-size:11px;border:none;background:#fbeaea;color:#c0392b;border-radius:4px;cursor:pointer">🗑</button></td></tr>'}),e.length>30&&(i+='<tr><td colspan="2" style="padding:2px 6px;color:#888;font-size:11px">… 还有 '+(e.length-30)+" 个</td></tr>")),i+="</table>",i+='<div style="font-size:12px;font-weight:600;color:#666;margin-top:8px">🗄 大数据 Gist</div>',i+='<table style="width:100%;font-size:12px;border-collapse:collapse">',t.bulk.forEach(a=>{i+='<tr><td style="padding:1px 6px">'+Nt(a.label)+'</td><td style="padding:1px 6px;text-align:right;font-variant-numeric:tabular-nums;color:#888">'+Se(a.size)+"</td></tr>"}),t.bulk.length||(i+='<tr><td colspan="2" style="padding:2px 6px;color:#888;font-size:11px">（暂无，首次同步后生成）</td></tr>'),i+="</table>",i+='<div style="font-size:11px;color:#888;margin-top:6px">🗑 删除单个 op = 只从云端删掉那一个增量文件（不合并、不压实），用于精确回退某次改动；要整体整理仍用下方「压实」按钮。</div>',i+="</div>",i}async function Jn(t){if(t){t.innerHTML="☁ 正在读取云端数据分布…";try{const e=await Er();if(e.error){t.innerHTML='<div style="color:#c0392b;font-size:12px">读取云端失败：'+Nt(e.error)+' <button class="btn btn-ghost cs-refresh" style="padding:1px 6px;font-size:11px">重试</button></div>',$s(t);return}t.innerHTML=Tr(e),$s(t)}catch(e){t.innerHTML='<div style="color:#c0392b;font-size:12px">读取异常：'+Nt(e&&e.message||e)+"</div>"}}}function $s(t){if(!t)return;const e=t.querySelector(".cs-refresh");e&&(e.onclick=()=>Jn(t)),t.querySelectorAll(".cs-op-del").forEach(n=>{n.onclick=()=>{const s=n.getAttribute("data-name");confirm(`只删除这一个 op 增量文件（不合并、不压实，其余 op 与整包快照都不动）：

`+s+`

· 适合精确回退某一次改动批次（配合 Gist 版本历史）。
· 注意：删 op 不改本机现有数据，需再点「仅拉取」或换设备重放剩余 op 才体现。`)&&(n.disabled=!0,Ir(s).then(()=>{window.Toast&&X.success("已删除该 op 文件（未压实）"),Jn(t)}).catch(r=>{window.Toast&&X.danger("删除失败："+(r&&r.message||r)),n.disabled=!1}))}})}async function Pi(t){if(Store.update(e=>{Array.isArray(e[t])?e[t]=[]:e[t]&&typeof e[t]=="object"?e[t]={}:e[t]=null}),y.bulkGistId)try{await ne(y.bulkGistId,{[t+".json"]:null})}catch{}return!0}async function Ni(t){if(!y.bulkGistId)throw new Error("未登录或无大数据 Gist");return await ne(y.bulkGistId,{[t+".json"]:null}),!0}async function Ir(t){if(!y.gistId)throw new Error("未登录或无核心 Gist");if(!gn.test(t))throw new Error("非法 op 文件名");return await ne(y.gistId,{[t]:null}),!0}const St={init:Ai,pull:jt,push:Ct,schedulePush:ss,openPanel:Ar,logout:kr,mountBadge:()=>Sr(),get isEnabled(){return y.enabled},get isLoggedIn(){return!!y.token},coreSizeBreakdown:Mi,fetchCloudStats:Er,clearCloudColl:Pi,deleteCloudFile:Ni,deleteOpFile:Ir,renderCloudStatsHtml:Tr,refreshCloudStatsIn:Jn,cleanupOrphanGists:Ii,genOps:ns,coreOf:rn,doSync:()=>jt(!0,void 0).then(Ct),doPull:()=>jt(!0,void 0),doCompact:()=>(Pt("uploading-bulk"),Ct({bulk:!0})),get gistId(){return y.gistId},get bulkGistId(){return y.bulkGistId},gistReq:(t,e)=>{if(!y.token){const n=new Error("未登录云同步，无法使用分享协作（先在设置里登录）");throw n.status=0,n}return _t(t,e)},gistUpload:(t,e,n,s)=>{if(!y.token){const r=new Error("未登录云同步，无法上传");throw r.status=0,r}return new Promise(function(r,o){try{const i=new XMLHttpRequest;i.open("POST",or+t),i.setRequestHeader("Authorization","Bearer "+y.token),i.setRequestHeader("Accept","application/vnd.github+json"),i.setRequestHeader("Content-Type","application/json"),i.timeout=3e5,s&&s.addEventListener("abort",()=>{try{i.abort()}catch{}}),i.upload.onprogress=function(a){a.lengthComputable&&typeof n=="function"&&n(Math.round(a.loaded/a.total*100),a.loaded,a.total)},i.onload=function(){if(i.status>=200&&i.status<300)try{r({status:i.status,data:JSON.parse(i.responseText||"{}")})}catch(a){o(new Error("Gist 创建成功但响应解析失败："+(a.message||a)))}else{const a=new Error("Gist 上传失败 HTTP "+i.status+"："+(i.responseText||"").slice(0,200));a.status=i.status,o(a)}},i.onerror=function(){o(new Error("Gist 上传网络错误（请检查网络后重试）"))},i.ontimeout=function(){o(new Error("Gist 上传超时（>5min，文件可能过大或网络过慢，建议压缩后重试）"))},i.send(JSON.stringify(e))}catch(i){o(new Error("Gist 上传初始化失败："+(i.message||i)))}})},get syncInfo(){return{gistId:y.gistId,bulkGistId:y.bulkGistId,lastSyncAt:y.lastSyncAt,lastTransfer:y.lastTransfer,opCount:q.opCount||0,compactGen:q.compactGen||0,compactThreshold:De,pushIntervalMs:nn(),pullIntervalMs:jn(),nextPushDue:se||0,lastPushedAt:y.lastPushedAt||0}},PUSH_INTERVAL_OPTIONS:ei,PULL_INTERVAL_OPTIONS:ni,getPushIntervalMs:nn,getPullIntervalMs:jn,setPushInterval(t){return t=parseInt(t,10),isNaN(t)||t<0?!1:(q.pushIntervalMs=t,Bt(),ee&&(clearTimeout(ee),ee=null,se=0),t===0?(y.lastPushAttemptAt=Date.now(),Ct().then(()=>ut("☁ 已同步","on")).catch(()=>{})):(y.lastPushedAt=y.lastPushedAt||Date.now(),Bn()),!0)},setPullInterval(t){return t=parseInt(t,10),isNaN(t)||t<ur?!1:(q.pullIntervalMs=t,Bt(),y.pollTimer&&Ke(),!0)}};typeof module<"u"&&module.exports&&(module.exports={genOps:ns,applyOps:hr,collHashLive:Dn,mergeOpFiles:mr,genOpFileName:gr,coreOf:rn,liveCoreJson:fr});const Or="kaoyan2026_theme",Mn=["day","morning","night"];function Ci(){try{return!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}catch{return!1}}function Li(){try{const t=localStorage.getItem(Or);if(t==="auto"||t==="morning"||t==="night"||t==="day")return t}catch{}return"day"}const Be=et(Li());function Kt(){return Be.value==="auto"?Ci()?"night":"day":Be.value}function rs(t,e){try{const n=document.documentElement;e&&(n.classList.add("theme-anim"),setTimeout(()=>n.classList.remove("theme-anim"),400)),t==="day"?n.removeAttribute("data-theme"):n.setAttribute("data-theme",t)}catch{}}rs(Kt(),!1);let an=Kt();try{const t=window.matchMedia("(prefers-color-scheme: dark)"),e=()=>{if(Be.value!=="auto")return;const n=Kt();n!==an&&(an=n,rs(n,!0))};t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e)}catch{}function yn(){const t=L(()=>Be.value),e=L(()=>Kt()),n=L(()=>Kt()==="night"),s=L(()=>Kt()==="morning");function r(a){if(!(a!=="auto"&&a!=="day"&&a!=="morning"&&a!=="night")){Be.value=a,an=Kt(),rs(an,!0);try{localStorage.setItem(Or,a)}catch{}}}function o(){const a=Kt(),l=Mn.indexOf(a);r(Mn[(l+1)%Mn.length])}function i(){r(Kt()==="night"?"day":"night")}return{pref:t,theme:e,isNight:n,isMorning:s,set:r,toggle:i,cycle:o}}const Je={dashboard:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#3b5998" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',scheduler:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="16" r="2" fill="#f97316"/></svg>',review:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><circle cx="10" cy="9" r="2" fill="#f97316"/></svg>',photomistake:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/><circle cx="12" cy="13" r="1" fill="#f97316"/></svg>',vizai:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 2 7v10l10 5 10-5V7z"/><path d="M2 7l10 5 10-5"/><path d="M12 22V12"/><path d="M7 4.5l10 5"/><path d="M17 4.5l-10 5"/><circle cx="12" cy="12" r="1.5" fill="#f97316"/></svg>',tools:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/><circle cx="10" cy="10" r="2" fill="#f97316"/></svg>',quiz:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="10"/><line x1="12" y1="17" x2="12.01" y2="17"/><circle cx="12" cy="16.5" r="1.5" fill="#f97316"/></svg>',essay:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/><circle cx="14" cy="6" r="1" fill="#f97316"/></svg>',mistakes:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/><circle cx="12" cy="12" r="1.5" fill="#f97316"/></svg>',heatmap:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/><circle cx="18" cy="4" r="2" fill="#f97316"/></svg>',inspector:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#65a30d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/><circle cx="15" cy="5" r="1" fill="#f97316"/></svg>',focus:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#4338ca" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1" fill="#f97316"/></svg>',concept:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="14.5" y1="9.5" x2="17.5" y2="6.5"/><line x1="9.5" y1="9.5" x2="6.5" y2="6.5"/><line x1="9.5" y1="14.5" x2="6.5" y2="17.5"/><line x1="14.5" y1="14.5" x2="17.5" y2="17.5"/><circle cx="12" cy="12" r="1" fill="#f97316"/></svg>',sprint:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#c2410c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/><circle cx="13" cy="7" r="1.5" fill="#f97316"/></svg>',decision:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><circle cx="18" cy="7" r="2" fill="#f97316"/></svg>',mental:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><circle cx="12" cy="10" r="1.5" fill="#f97316"/></svg>',reading:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><circle cx="13" cy="11" r="1.5" fill="#f97316"/></svg>',wordbook:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="10" y1="7" x2="16" y2="7"/><line x1="10" y1="11" x2="16" y2="11"/><circle cx="13" cy="14" r="1.5" fill="#f97316"/></svg>',polrecite:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M10 10l2 2 4-4"/><circle cx="13" cy="7" r="1.5" fill="#f97316"/></svg>',redline:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#991b1b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/><circle cx="12" cy="12" r="1.5" fill="#f97316"/></svg>',progress:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="6"/><circle cx="18" cy="6" r="2" fill="#f97316"/></svg>',share:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/><circle cx="18" cy="5" r="0.5" fill="#f97316"/></svg>',settings:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/><circle cx="12" cy="12" r="1" fill="#f97316"/></svg>',plugins:'<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v3.5h1.5a2.5 2.5 0 0 1 0 5H2V19a2 2 0 0 0 2 2h3.5v-1.5a2.5 2.5 0 0 1 5 0V21H17a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z"/><circle cx="8.5" cy="8.5" r="1" fill="#f97316"/><circle cx="15.5" cy="15.5" r="1" fill="#f97316"/></svg>',copilot:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="cpBot" x1="3" y1="5" x2="21" y2="19" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a855f7"/><stop offset="0.55" stop-color="#6366f1"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><path d="M12 2.4v3.2" stroke="#f97316" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="2.3" r="1.8" fill="#fbbf24"/><rect x="4.5" y="6" width="15" height="13" rx="6" fill="url(#cpBot)"/><rect x="6" y="7.6" width="12" height="3" rx="1.5" fill="#ffffff" opacity="0.16"/><circle cx="9.3" cy="12.7" r="1.7" fill="#ffffff"/><circle cx="14.7" cy="12.7" r="1.7" fill="#ffffff"/><circle cx="9.3" cy="12.7" r="0.8" fill="#6d28d9"/><circle cx="14.7" cy="12.7" r="0.8" fill="#6d28d9"/><path d="M9.6 15.6c1.1 1.1 3.7 1.1 4.8 0" stroke="#ffffff" stroke-width="1.4" stroke-linecap="round"/><circle cx="6.7" cy="15" r="1.1" fill="#f472b6" opacity="0.85"/><circle cx="17.3" cy="15" r="1.1" fill="#34d399" opacity="0.85"/></svg>',cloud:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',clean:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',warn:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',check:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',bulb:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>',list:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',thought:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r="1" fill="#f97316"/><circle cx="15" cy="7" r="1" fill="#f97316"/></svg>',search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><circle cx="11" cy="11" r="2" fill="#f97316"/></svg>',edit:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/><circle cx="16" cy="5" r="1" fill="#f97316"/></svg>',snap:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/><circle cx="12" cy="13" r="1" fill="#f97316"/></svg>',plus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',sun:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19"/></svg>',moon:'<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.3A8.4 8.4 0 0 1 10.7 3.4a8.4 8.4 0 1 0 9.9 9.9z"/></svg>'},ji=["innerHTML"],Qe=rt({__name:"AppIcon",props:{name:{},cls:{}},setup(t){const e=t,n=L(()=>(Je[e.name]||"").replace("<svg",'<svg class="ci '+(e.cls||"")+'"'));return(s,r)=>(w(),_("span",{class:"app-icon",innerHTML:n.value},null,8,ji))}}),qi={class:"statusbar",id:"statusbar","data-testid":"statusbar"},Di=["title"],Ri={class:"sb-item"},Bi={class:"sb-item"},Ji={class:"sb-item"},Gi={key:0,class:"sb-item sb-streak"},Hi={key:1,class:"sb-item sb-warn"},zi=rt({__name:"StatusBar",setup(t){const{theme:e,cycle:n}=yn();function s(){const d=window.CommandPalette;d&&d.open&&d.open()}const r=L(()=>O.daysTo(M.get().settings.examDate)),o=L(()=>M.todayHours()),i=L(()=>{const d=M.todayTaskStats();let f=0,v=0;return Object.keys(d).forEach(m=>{f+=d[m][0],v+=d[m][1]}),{done:f,total:v}}),a=L(()=>M.studyStreak()),l=L(()=>M.mistakeCountToday("sign")),u=L(()=>e.value==="night"||e.value==="morning"?"sun":"moon"),p=L(()=>e.value==="night"?"当前「星阑」夜间，点击回「墨白」":e.value==="morning"?"当前「晨岚」柔和，点击进「星阑」":"当前「墨白」日间，点击进「晨岚」");return he(()=>{try{St.mountBadge&&St.mountBadge()}catch{}}),(d,f)=>(w(),_("header",qi,[c("button",{class:"sb-theme","data-testid":"theme-toggle",title:p.value,"aria-label":"切换主题",onClick:f[0]||(f[0]=(...v)=>W(n)&&W(n)(...v))},[ct(Qe,{name:u.value},null,8,["name"])],8,Di),c("button",{class:"sb-theme sb-palette","data-testid":"palette-open",title:"搜索 / 命令面板（⌘K）","aria-label":"命令面板",onClick:s},"🔍"),c("span",Ri,[f[1]||(f[1]=Y("⏳ ",-1)),c("b",null,k(r.value),1),f[2]||(f[2]=Y("天",-1))]),c("span",Bi,[f[3]||(f[3]=Y("🕐 ",-1)),c("b",null,k(o.value),1),f[4]||(f[4]=Y("h",-1))]),c("span",Ji,[f[5]||(f[5]=Y("✅ ",-1)),c("b",null,k(i.value.done)+"/"+k(i.value.total),1)]),a.value>=2?(w(),_("span",Gi,[f[6]||(f[6]=Y("🔥 ",-1)),c("b",null,k(a.value),1),f[7]||(f[7]=Y("天",-1))])):z("",!0),l.value>0?(w(),_("span",Hi,"⚠️符号"+k(l.value),1)):z("",!0)]))}}),be=[{id:"dashboard",label:"仪表盘",icon:"dashboard"},{id:"scheduler",label:"排程",icon:"scheduler"},{id:"review",label:"复盘",icon:"review"},{id:"photomistake",label:"拍题",icon:"photomistake"}],vn=[{id:"quiz",label:"AI测验",icon:"quiz"},{id:"essay",label:"作文批改",icon:"essay"},{id:"mistakes",label:"错题画像",icon:"mistakes"},{id:"heatmap",label:"考点热力",icon:"heatmap"},{id:"inspector",label:"解题方法",icon:"inspector"},{id:"focus",label:"深度专注",icon:"focus"},{id:"concept",label:"概念图谱",icon:"concept"},{id:"sprint",label:"我的题卷",icon:"sprint"},{id:"decision",label:"院校决策",icon:"decision"},{id:"mental",label:"心理状态",icon:"mental"},{id:"reading",label:"英语阅读",icon:"reading"},{id:"wordbook",label:"单词本",icon:"wordbook"},{id:"polrecite",label:"政治背诵",icon:"polrecite"},{id:"redline",label:"红线禁令",icon:"redline"},{id:"progress",label:"进度追踪",icon:"progress"},{id:"plugins",label:"插件中心",icon:"plugins"},{id:"share",label:"星屿广场",icon:"share"},{id:"vizai",label:"AI可视化",icon:"vizai"},{id:"aitools",label:"AI工程台",icon:"bulb"},{id:"settings",label:"设置",icon:"settings"}];function $i(t){return be.some(e=>e.id===t)}function Mr(t){return be.concat(vn).find(e=>e.id===t)?.label||t}function $t(t){return $i(t)?"/"+t:"/tool/"+t}function te(t,e){return t[e]|t[e+1]<<8}function re(t,e){return t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24>>>0}async function Ui(t){const e=new DecompressionStream("deflate-raw"),n=new Blob([t]).stream().pipeThrough(e),s=await new Response(n).arrayBuffer();return new Uint8Array(s)}async function Fi(t){const e=new Uint8Array(t),n=e.length;if(n<22)throw new Error("不是有效的 zip 文件（太小）");let s=-1;const r=Math.max(0,n-22-65535);for(let p=n-22;p>=r;p--)if(re(e,p)===101010256){s=p;break}if(s<0)throw new Error("不是有效的 zip 文件（未找到目录尾）");const o=te(e,s+10),i=re(e,s+16);if(i>n)throw new Error("zip 目录偏移越界");const a=[];let l=i;for(let p=0;p<o&&l+46<=n&&re(e,l)===33639248;p++){const d=te(e,l+8),f=te(e,l+10),v=re(e,l+20),m=re(e,l+24),b=te(e,l+28),h=te(e,l+30),g=te(e,l+32),A=re(e,l+42);let j="";for(let E=0;E<b;E++)j+=String.fromCharCode(e[l+46+E]);if(d&2048)try{j=new TextDecoder("utf-8").decode(e.subarray(l+46,l+46+b))}catch{}else try{const P=new TextDecoder("utf-8").decode(e.subarray(l+46,l+46+b));/[\uFFFD]/.test(P)||(j=P)}catch{}a.push({name:j,method:f,compSize:v,uncompSize:m,flags:d,localOff:A}),l+=46+b+h+g}if(!a.length)throw new Error("zip 内没有文件条目");const u=[];for(let p=0;p<a.length;p++){const d=a[p];if(d.name.slice(-1)==="/"||d.name.slice(-1)==="\\")continue;const f=d.localOff;if(f+30>n||re(e,f)!==67324752)continue;const v=te(e,f+26),m=te(e,f+28),b=f+30+v+m;if(b+d.compSize>n)continue;const h=e.subarray(b,b+d.compSize);let g;if(d.method===0)g=h;else if(d.method===8)try{g=await Ui(h)}catch{continue}else continue;u.push({name:d.name,data:g})}return u}function Pr(t){if(!t||typeof t!="string")return null;const e=t.replace(/^\uFEFF/,""),n={name:"",description:"",whenToUse:"",body:e},s=e.match(/^\s*---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);if(s){const r=s[1],o=/^\s*([A-Za-z_][A-Za-z0-9_\-]*)\s*:\s*(.*)$/;r.split(/\r?\n/).forEach(function(i){const a=i.match(o);if(!a)return;const l=a[1].toLowerCase().replace(/-/g,""),u=a[2].trim().replace(/^["']|["']$/g,"");u&&(l==="name"&&!n.name?n.name=u:l==="description"&&!n.description?n.description=u:l==="whentouse"||l==="when"||l==="when_to_use"?n.whenToUse||(n.whenToUse=u):l==="summary"&&!n.description&&(n.description=u))}),n.body=e.slice(s[0].length).trim()}return n}function Ki(t){const e=(t||[]).map(function(l){return{name:String(l.name||"").replace(/\\/g,"/"),data:l.data}});let n=null;if(e.forEach(function(l){if(/SKILL\.md$/i.test(l.name)){const u=(l.name.match(/\//g)||[]).length,p=n?(n.name.match(/\//g)||[]).length:1e9;u<=p&&(n=l)}}),!n)throw new Error("技能包缺少 SKILL.md");const s=Pr(new TextDecoder("utf-8").decode(n.data)),r=n.name.split("/").slice(0,-1).join("/"),o=[],i=[];e.forEach(function(l){if(l.name===n.name)return;if(!(!r||l.name.indexOf(r+"/")===0)){i.push({path:l.name,size:l.data.length});return}const p=r?l.name.slice(r.length+1):l.name;/\.md$/i.test(p)&&!/^SKILL\.md$/i.test(p)&&p.indexOf("/SKILL.md")<0?o.push({path:l.name,text:new TextDecoder("utf-8").decode(l.data)}):/\.md$/i.test(p)||i.push({path:l.name,size:l.data.length})});const a=s.name||"skill-pack";return{id:a,name:a,description:s.description||"AI 技能包："+a,whenToUse:s.whenToUse||"",skillMd:s.body||"",refs:o,files:i}}const Xe={parseZip:Fi,parseSkillMd:Pr,normalizeSkillPack:Ki};function oe(){return M.get().plugins||[]}function Vi(t){var e={pid:t,Store:window.Store,AI:window.AI,App:window.App,Toast:window.Toast,Modal:window.Modal,Components:window.Components,Tex:window.Tex,Charts:window.Charts,DB:window.DB,Mastery:window.Mastery,Spaced:window.Spaced,U:window.U,Theme:window.Theme,Cloud:window.Cloud,AiMemory:window.AiMemory,PluginBus:D,store:window.Store,ai:window.AI,toast:window.Toast,modal:window.Modal,uid:function(n){return O.uid?O.uid():(n||"plg")+Date.now().toString(36)},dkey:function(){return O.dkey?O.dkey():new Date().toISOString().slice(0,10)}};return Object.keys(window).forEach(function(n){/Module$/.test(n)&&typeof window[n]=="object"&&window[n]&&(e[n]=window[n])}),e.api={go:function(n){window.App&&App.go(n)},refresh:function(){window.App&&App.refresh()},current:function(){return window.App?App.current:""},openModal:function(n){window.Modal&&It.open(n)},openPanel:function(n){D.openPanel(n)},closePanel:function(n){D.closePanel(n)},panelsOf:function(n){return D.panels().filter(function(s){return s.pid===(n||e.pid)})},confirm:function(n,s,r,o){window.Modal&&It.confirm(n,s,o?"删除":"确定",r,o)},closeModal:function(){window.Modal&&It.close()},toast:function(n,s,r){window.Toast&&X.show(n,s||"info",r||2e3)},download:function(n,s,r){try{var o=new Blob([s],{type:r||"text/plain;charset=utf-8"}),i=URL.createObjectURL(o),a=document.createElement("a");a.href=i,a.download=n||"plugin-export.txt",document.body.appendChild(a),a.click(),a.remove(),setTimeout(function(){URL.revokeObjectURL(i)},2e3)}catch(l){window.Toast&&X.show("下载失败："+(l.message||l),"warn",2500)}},readFile:function(n){return new Promise(function(s,r){var o=document.createElement("input");o.type="file",n&&(o.accept=n),o.style.display="none",document.body.appendChild(o),o.onchange=function(){var i=o.files&&o.files[0];if(o.remove(),!i){r(new Error("未选择文件"));return}var a=new FileReader;a.onload=function(){s({name:i.name,text:String(a.result||""),size:i.size})},a.onerror=function(){r(new Error("文件读取失败"))},a.readAsText(i,"utf-8")},o.click()})},goTool:function(n,s){D.goTool(n,s)},params:function(){return D.params(t)}},e.ui={card:function(n,s){return'<div class="card">'+(s?'<div class="card-title-sm">'+O.esc(s)+"</div>":"")+n+"</div>"},btn:function(n,s,r){return'<button class="btn '+(s||"btn-ghost")+'" '+(r||"")+">"+n+"</button>"},btnRow:function(n){return'<div class="btn-row">'+n+"</div>"},tag:function(n,s){return'<span class="tag '+(s||"")+'">'+O.esc(n)+"</span>"},badge:function(n,s){return'<span class="tag '+(s||"")+'" style="font-size:11px;opacity:.9">'+O.esc(n)+"</span>"},alert:function(n,s){return'<div class="alert alert-'+(s||"info")+'">'+O.esc(n)+"</div>"},stat:function(n,s){return'<div class="stat"><div class="stat-num">'+n+'</div><div class="stat-label">'+O.esc(s)+"</div></div>"},statRow:function(n){return'<div class="stat-row">'+n.join("")+"</div>"},progress:function(n,s){return'<div class="pbar"><div class="pbar-fill" style="width:'+O.clamp(Math.round(+n||0),0,100)+"%;background:"+(s||"var(--ok)")+'"></div></div>'},empty:function(n){return'<div class="card empty-hint">'+O.esc(n)+"</div>"},section:function(n,s){return'<div class="pm-ai-section"><b>'+O.esc(n)+'：</b><div class="pm-ai-body">'+s+"</div></div>"},list:function(n){return"<div>"+(n||[]).map(function(s){return'<div style="padding:5px 0;border-bottom:1px solid var(--line)">'+s+"</div>"}).join("")+"</div>"},tabs:function(n,s){return'<div class="tab-row">'+n.map(function(r){return'<button class="tab'+(r[0]===s?" tab-on":"")+'">'+O.esc(r[1])+"</button>"}).join("")+"</div>"},input:function(n,s,r){return'<input id="'+O.esc(n)+'" class="input" placeholder="'+O.esc(s||"")+'" value="'+O.esc(r??"")+'">'},textarea:function(n,s,r){return'<textarea id="'+O.esc(n)+'" class="input" rows="'+(r||3)+'" placeholder="'+O.esc(s||"")+'"></textarea>'},select:function(n,s,r){return'<select id="'+O.esc(n)+'" class="input">'+(s||[]).map(function(o){return'<option value="'+O.esc(o)+'"'+(String(o)===String(r)?" selected":"")+">"+O.esc(o)+"</option>"}).join("")+"</select>"}},e.ai={has:function(){return!!(window.AI&&K.configured())},chat:function(n,s,r){return window.AI&&K.configured()?K.chatStream(n,s,null,null,Object.assign({noThink:!0},r||{})):Promise.reject(new Error("未配置 AI"))},json:function(n,s,r){return window.AI&&K.configured()?K.chatJSON(n,s,null,r||{}):Promise.reject(new Error("未配置 AI"))},stream:function(n,s,r,o){return window.AI&&K.configured()?K.chatStream(n,s,r,null,o||{}):Promise.reject(new Error("未配置 AI"))}},e.data=function(n,s){return D.data(t,n,s)},e.config=function(n,s){return D.config(t,n,s)},e.log=function(n,s){D.log(t,n,s)},e.call=function(n,s){var r=Array.prototype.slice.call(arguments,2);return D.call.apply(D,[n,s].concat(r))},e}function Pn(t){if(!t||typeof t!="object")throw new Error("插件必须注册一个对象");var e=String(t.id||"").trim();if(!e||!/^[a-z0-9][a-z0-9\-_]{1,31}$/i.test(e))throw new Error("插件 id 必填且只能含字母数字-_（如 my-plugin）");var n={id:e,name:String(t.name||e).trim().slice(0,30),version:String(t.version||"1.0").slice(0,12),desc:String(t.desc||"").slice(0,300),author:String(t.author||"").slice(0,40),skills:Array.isArray(t.skills)?t.skills.slice(0,20):[],actions:Array.isArray(t.actions)?t.actions.slice(0,20):[],tools:Array.isArray(t.tools)?t.tools.slice(0,10):[],panels:Array.isArray(t.panels)?t.panels.slice(0,6):[],hooks:t.hooks&&typeof t.hooks=="object"?t.hooks:{},promptAugment:Array.isArray(t.promptAugment)?t.promptAugment.slice(0,12):[],queries:Array.isArray(t.queries)?t.queries.slice(0,20):[],maintabs:Array.isArray(t.maintabs)?t.maintabs.slice(0,3):[],css:String(t.css||"").slice(0,2e4),enhancers:Array.isArray(t.enhancers)?t.enhancers.slice(0,12):[],timers:Array.isArray(t.timers)?t.timers.slice(0,10):[],shortcuts:Array.isArray(t.shortcuts)?t.shortcuts.slice(0,10):[],config:Array.isArray(t.config)?t.config.slice(0,12):[],depends:Array.isArray(t.depends)?t.depends.slice(0,8):[],services:t.services&&typeof t.services=="object"?t.services:{},memory:String(t.memory||"").slice(0,200),init:typeof t.init=="function"?t.init:null,onEnable:typeof t.onEnable=="function"?t.onEnable:null,onDisable:typeof t.onDisable=="function"?t.onDisable:null,enabled:!0,createdAt:O.dkey?O.dkey():new Date().toISOString().slice(0,10)};return n.tools.forEach(function(s,r){if(s&&typeof s=="object"&&!s.id&&(s.id=n.id+"-tool"+(r+1)),s&&typeof s.render!="function"&&typeof s.mount!="function")throw new Error("工具 "+(s&&s.title||"?")+" 必须有 render 或 mount 函数")}),n.panels.forEach(function(s,r){if(!s||!s.id||!s.title)throw new Error("面板 #"+(r+1)+" 缺 id/title");if(typeof s.render!="function")throw new Error("面板 "+s.title+" 必须有 render(ctx, box) 函数");if(!/^[a-z0-9][a-z0-9\-_]{1,31}$/i.test(String(s.id)))throw new Error("面板 id 只能含字母数字-_")}),n.config.forEach(function(s,r){if(!s||!s.key||!s.label)throw new Error("配置项 #"+(r+1)+" 缺 key/label");["text","number","select","bool"].indexOf(s.type)<0&&(s.type="text")}),n.shortcuts.forEach(function(s){if(s&&s.key&&typeof s.run!="function")throw new Error("快捷键 "+s.key+" 缺 run 函数")}),n.queries.forEach(function(s,r){if(!s||!s.key||!s.label)throw new Error("查询 #"+(r+1)+" 缺 key/label");if(typeof s.run!="function")throw new Error("查询 "+s.label+" 缺 run 函数")}),n.maintabs.forEach(function(s,r){if(!s||!s.id||!s.name)throw new Error("主 tab #"+(r+1)+" 缺 id/name");if(typeof s.render!="function")throw new Error("主 tab "+s.name+" 缺 render 函数");if(!/^[a-z0-9][a-z0-9\-_]{1,31}$/i.test(String(s.id)))throw new Error("主 tab id 只能含字母数字-_")}),n}var dt={};function xe(t){var e=dt[t];if(!e)return null;var n=oe().find(function(s){return s.id===t});return n&&n.enabled===!1?null:e.manifest}function bt(t){return dt[t]?(dt[t].ctx||(dt[t].ctx=Vi(t)),dt[t].ctx):null}var ln={};function Us(t){Gn(t.id),(t.timers||[]).forEach(function(e){if(!(!e||!e.run)){var n=function(){try{e.run(bt(t.id),e)}catch(a){wt(t.id,"定时器错误："+(a.message||a))}};if(e.at&&/^\d{1,2}:\d{2}$/.test(e.at)){var s=function(){var a=new Date,l=e.at.split(":"),u=new Date(a);u.setHours(+l[0],+l[1],0,0),u<=a&&u.setDate(u.getDate()+1);var p=setTimeout(function(){try{n()}catch{}s()},u-a);Nn(t.id,p)};s()}else if(e.every&&/^\d+min$/.test(e.every)){var r=parseInt(e.every,10)*6e4,o=setInterval(n,r);Nn(t.id,o)}else if(e.once&&/^\d+min$/.test(e.once)){var i=parseInt(e.once,10)*6e4,o=setTimeout(n,i);Nn(t.id,o)}}})}function Nn(t,e){(ln[t]=ln[t]||[]).push(e)}function Gn(t){(ln[t]||[]).forEach(function(e){try{clearTimeout(e),clearInterval(e)}catch{}}),delete ln[t]}function wt(t,e,n){try{M.update(function(s){s.pluginLog=s.pluginLog||[],s.pluginLog.unshift({at:new Date().toISOString(),pid:t,level:n||"info",msg:String(e||"").slice(0,300)}),s.pluginLog.length>200&&(s.pluginLog=s.pluginLog.slice(0,200))})}catch{}}const D={_ver:"2.0.0",register:function(t){var e=Pn(t);if(dt[e.id]){try{D.unsubscribeAll(e.id)}catch{}try{D.closePanelsOf(e.id)}catch{}}dt[e.id]={manifest:e};try{Us(e),e.init&&e.init(bt(e.id)),e.css&&D._injectCss(e.id,e.css)}catch(n){wt(e.id,"初始化错误："+(n.message||n),"error")}return D.syncAugmentors(),e},syncAugmentors:function(){if(!(typeof K>"u"||!K||!K.unregisterPromptAugmentorsByPid)){var t=this;(this._augPids||[]).forEach(function(n){try{K.unregisterPromptAugmentorsByPid(n)}catch{}});var e={};this.list().forEach(function(n){(n.promptAugment||[]).forEach(function(s){if(!(!s||typeof s.build!="function")){e[n.id]=!0;try{K.registerPromptAugmentor({id:"plg:"+n.id+":"+(s.name||s.ctx||"x"),pid:n.id,name:(n.name||n.id)+"·"+(s.name||"提示词拓展"),ctx:String(s.ctx||"*"),note:String(s.note||s.name||""),build:s.build})}catch(r){wt(n.id,"提示词拓展注册失败："+(r.message||r),"error")}}})}),t._augPids=Object.keys(e)}},_augPids:[],_cssTags:{},_injectCss:function(t,e){if(!(typeof document>"u"||!e)){D._removeCss(t);var n=document.createElement("style");n.id="plg-css-"+t,n.textContent=e,document.head.appendChild(n),D._cssTags[t]=n}},_removeCss:function(t){var e=D._cssTags[t]||document.getElementById("plg-css-"+t);e&&e.parentNode&&e.parentNode.removeChild(e),delete D._cssTags[t]},_enh:{},_onPageRendered:function(t,e){if(t){var n=this;this.list().forEach(function(s){(s.enhancers||[]).forEach(function(r,o){!r||!r.html&&typeof r.mount!="function"||r.tab&&r.tab!=="all"&&r.tab!==e||n._applyEnhancer(s,r,o,t,e)})})}},_applyEnhancer:function(t,e,n,s,r){var o=t.id+":"+n,i=this,a;if(e.selector?a=s.querySelector(e.selector):a=s.querySelector(e.slot==="top"?'div[data-pg-slot="top"]':'div[data-pg-slot="bottom"]'),!!a){var l=document.createElement("div");l.className="plg-enh",l.setAttribute("data-plg-enh",o);var u=null;try{if(typeof e.mount=="function")u=e.mount(bt(t.id),l)||null;else{var p=typeof e.html=="function"?e.html(bt(t.id),s)||"":String(e.html);p&&(l.innerHTML=p)}}catch(d){wt(t.id,"页面装饰错误："+(d.message||d),"error")}a.appendChild(l),i._enh[o]={destroy:u,container:l,subscribe:e.subscribe,tab:r,pid:t.id}}},_clearEnh:function(t){var e=this._enh[t];if(e){try{typeof e.destroy=="function"&&e.destroy()}catch{}try{e.container&&e.container.parentNode&&e.container.parentNode.removeChild(e.container)}catch{}delete this._enh[t]}},_clearAllEnh:function(){var t=this;Object.keys(this._enh).forEach(function(e){t._clearEnh(e)})},_reapplyReactive:function(){var t=this,e=document.getElementById("view");if(!(!e||!window.App)){var n=App.current;Object.keys(t._enh).forEach(function(s){var r=t._enh[s];if(!(!r||!r.subscribe||!r.subscribe.length)&&!(r.tab!==n&&r.tab!=="all")){var o=s.split(":"),i=xe(o[0]),a=+o[1];if(!i||!i.enhancers||!i.enhancers[a]){t._clearEnh(s);return}t._clearEnh(s),t._applyEnhancer(i,i.enhancers[a],a,e,n)}})}},list:function(){var t=[];return Object.keys(dt).forEach(function(e){var n=xe(e);n&&t.push(n)}),t},get:function(t){var e=xe(t);return e||null},ctxOf:bt,data:function(t,e,n){if(!(!t||!e))return arguments.length===2?(M.get().pluginData||{})[t]?M.get().pluginData[t][e]:void 0:(M.update(function(s){s.pluginData=s.pluginData||{},s.pluginData[t]||(s.pluginData[t]={}),n===null?delete s.pluginData[t][e]:s.pluginData[t][e]=n}),n)},config:function(t,e,n){if(!(!t||!e)){var s=(M.get().pluginConfig||{})[t]||{};return arguments.length===2?e in s?s[e]:void 0:(M.update(function(r){r.pluginConfig=r.pluginConfig||{},r.pluginConfig[t]||(r.pluginConfig[t]={}),r.pluginConfig[t][e]=n}),n)}},configWithDefault:function(t,e){var n=D.config(t.id,e);if(n!==void 0)return n;var s=(t.config||[]).find(function(r){return r.key===e});return s?s.default:void 0},log:wt,skills:function(){var t=[];return this.list().forEach(function(e){(e.skills||[]).forEach(function(n){n&&n.trigger&&n.prompt&&t.push({pid:e.id,trigger:n.trigger,title:n.title||n.trigger,prompt:n.prompt,summary:n.summary||"",when:n.when||"",refs:n.refs||[]})})}),t},actions:function(){var t=[];return this.list().forEach(function(e){(e.actions||[]).forEach(function(n){n&&n.type&&t.push({pid:e.id,type:n.type,label:n.label||n.type,auto:!!n.auto,run:n.run,needs:n.needs,undo:n.undo})})}),t},tools:function(){var t=[];return this.list().forEach(function(e){(e.tools||[]).forEach(function(n){n&&n.id&&t.push({pid:e.id,id:n.id,title:n.title||n.id,icon:n.icon||"🧩",render:n.render,mount:n.mount})})}),t},queries:function(){var t=[];return this.list().forEach(function(e){(e.queries||[]).forEach(function(n){n&&n.key&&t.push({pid:e.id,key:n.key,label:n.label||n.key,run:n.run})})}),t},maintabs:function(){var t=[];return this.list().forEach(function(e){(e.maintabs||[]).forEach(function(n){n&&n.id&&t.push({pid:e.id,id:n.id,name:n.name||n.id,icon:n.icon||"🧩",render:n.render})})}),t},panels:function(){var t=[];return this.list().forEach(function(e){(e.panels||[]).forEach(function(n){n&&n.id&&t.push({pid:e.id,id:n.id,title:n.title||n.id,icon:n.icon||"🪟",render:n.render,width:n.width||300,height:n.height||360})})}),t},openPanel:function(t){var e=document.getElementById("plg-panel-"+t);if(e){D.closePanel(t);return}var n=this.panels().filter(function(f){return f.id===t})[0];if(!n){X.show("面板不存在或已禁用","warn",1800);return}var s=document.createElement("div");s.id="plg-panel-"+t,s.className="plg-panel",s.style.width=(n.width||300)+"px",s.style.height=(n.height||360)+"px",s.innerHTML='<div class="plg-panel-h"><span class="plg-panel-t">'+(n.icon||"🪟")+" "+O.esc(n.title)+'</span><button class="plg-panel-btn" data-pb="fold" title="折叠">—</button><button class="plg-panel-btn" data-pb="close" title="关闭">×</button></div><div class="plg-panel-b"></div>',document.body.appendChild(s);var r=s.querySelector(".plg-panel-b");try{var o=n.render(bt(n.pid),r);typeof o=="string"&&r.innerHTML===""&&(r.innerHTML=o)}catch(f){r.innerHTML='<div class="alert alert-danger">面板渲染失败：'+O.esc(f.message||f)+"</div>"}var i=s.querySelector('[data-pb="fold"]');i&&(i.onclick=function(){var f=s.querySelector(".plg-panel-b"),v=s.classList.toggle("plg-panel-folded");f&&(f.style.display=v?"none":""),i.textContent=v?"▢":"—"});var a=s.querySelector('[data-pb="close"]');a&&(a.onclick=function(){D.closePanel(t)});var l=s.querySelector(".plg-panel-h"),u=null,p=function(f){u&&(s.style.left=Math.max(0,f.clientX-u.dx)+"px",s.style.top=Math.max(0,f.clientY-u.dy)+"px",s.style.right="auto",s.style.bottom="auto")},d=function(){u=null,document.removeEventListener("mousemove",p),document.removeEventListener("mouseup",d)};l&&(l.onmousedown=function(f){f.target&&f.target.tagName==="BUTTON"||(u={dx:f.clientX-s.offsetLeft,dy:f.clientY-s.offsetTop},f.preventDefault(),document.addEventListener("mousemove",p),document.addEventListener("mouseup",d))}),wt(n.pid,"面板「"+n.title+"」已打开")},closePanel:function(t){var e=document.getElementById("plg-panel-"+t);e&&e.parentNode&&e.parentNode.removeChild(e)},closeAllPanels:function(){var t=this;this.panels().forEach(function(e){t.closePanel(e.id)})},openPanelsOf:function(t){var e=this;this.panels().filter(function(n){return n.pid===t}).forEach(function(n){e.openPanel(n.id)})},closePanelsOf:function(t){var e=this;this.panels().filter(function(n){return n.pid===t}).forEach(function(n){e.closePanel(n.id)})},_params:{},goTool:function(t,e){var n=this.tools().filter(function(s){return s.id===t})[0];if(!n){X.show("工具 "+t+" 不存在或已禁用","warn",2e3);return}this._params[n.pid]=e||{},window.App&&App.go(t)},params:function(t){return D._params[t]||{}},clearParams:function(t){delete D._params[t]},emit:function(t,e){var n=0;return this.list().forEach(function(s){var r=(s.hooks||{})[t]||(s.hooks||{})["*"];if(typeof r=="function")try{r(bt(s.id),e||{}),n++}catch(o){wt(s.id,"钩子「"+t+"」错误："+(o.message||o),"error")}}),n},fire:function(t,e){return D.emit(t,e)},_subs:{},subscribe:function(t,e){return typeof e!="function"?function(){}:((D._subs[t]=D._subs[t]||[]).push(e),function(){D.unsubscribe(t,e)})},unsubscribe:function(t,e){var n=D._subs[t];if(n){var s=n.indexOf(e);s>=0&&n.splice(s,1),n.length||delete D._subs[t]}},unsubscribeAll:function(t){delete D._subs[t]},_onStoreUpdate:function(t){var e=this;Object.keys(e._subs).forEach(function(n){e._subs[n].forEach(function(s){try{s(bt(n),t||{})}catch(r){wt(n,"订阅回调错误："+(r.message||r),"error")}})}),clearTimeout(e._enhDebounce),e._enhDebounce=setTimeout(function(){try{e._reapplyReactive()}catch{}},300)},call:function(t,e){var n=Array.prototype.slice.call(arguments,2),s=xe(t);if(!s)throw new Error("插件「"+t+"」未启用或不存在");var r=s.services&&s.services[e];if(typeof r!="function")throw new Error("插件「"+t+"」未提供服务 "+e);return r.apply(null,[bt(t)].concat(n))},callService:function(t,e){var n=Array.prototype.slice.call(arguments,2);return D.call.apply(D,[t,e].concat(n))},memories:function(){var t=[];return this.list().forEach(function(e){e.memory&&t.push({pid:e.id,text:e.memory})}),t},runSkill:function(t,e,n){if(!t)return Promise.reject(new Error("技能不存在"));if(!(window.AI&&K.configured()))return Promise.reject(new Error("未配置 AI"));var s="🧠 "+(t.title||t.trigger),r=String(t.prompt||"").replace(/\{input\}/g,String(e||"")),o='<div class="pm-ai-body" id="pbskill-out"><div class="skl-line"></div><div class="skl-line"></div><div class="skl-line skl-w70"></div></div><div id="pbskill-actions"></div>',i=!1;It.open({title:s,wide:!0,html:o,actions:[{label:"关闭"}]});var a=function(l){var u=document.getElementById("pbskill-out"),p=window.Tex&&Pe.repairPipeLatex?Pe.repairPipeLatex(l||""):l||"";u&&(u.innerHTML=O.esc(p).replace(/\n/g,"<br>")+'<span class="ai-cursor"></span>')};return K.chatStream("你是考研AI助手。按技能要求执行。",(e?"【技能输入】"+e+`

`:"")+r,function(l){i||a(l)},null,{noThink:!0,timeout:12e4}).then(function(l){i=!0;var u=document.getElementById("pbskill-out");if(u)try{u.innerHTML=Pe.renderInline(l||"").replace(/\n/g,"<br>")}catch{u.textContent=l||""}var p=document.getElementById("pbskill-actions");if(p&&n&&n.postActions&&n.postActions.length){var d=n.postActions.map(function(f,v){return'<button class="btn btn-sm '+(v===0?"btn-primary":"btn-ghost")+' pbskill-post" data-kind="'+(f.kind||"action")+'" data-target="'+O.esc(f.target||"")+'" data-label="'+O.esc(f.label||"执行")+'" data-arg="'+O.esc(f.arg||"")+'">'+O.esc(f.label||"执行")+"</button>"}).join("");p.innerHTML='<div class="btn-row" style="justify-content:center;margin-top:10px">'+d+"</div>",p.querySelectorAll(".pbskill-post").forEach(function(f){f.onclick=function(){var v=f.getAttribute("data-kind"),m=f.getAttribute("data-target"),b=f.getAttribute("data-label");if(v==="goto"&&m)It.close(),App.go(m),X.show(b+"…","info",1200);else if(v==="action"&&m&&window.PluginBus)try{var h={type:m,label:b};if(f.getAttribute("data-arg"))try{h=JSON.parse(f.getAttribute("data-arg"))}catch{}var g=D.actions().filter(function(j){return j.type===m})[0];if(g&&typeof g.run=="function"){var A=g.run(bt(g.pid)||{},h)||"";A&&X.show(A,"success",2500),It.close()}else X.warn("未找到动作："+m)}catch{X.warn("动作执行失败")}}})}return wt(t.pid,"技能「"+t.trigger+"」执行完成"+(e?"（输入："+String(e).slice(0,20)+"）":"")),l}).catch(function(l){i=!0;var u=document.getElementById("pbskill-out");throw u&&(u.innerHTML='<div class="alert alert-danger">技能执行失败：'+O.esc(l.message||l)+"</div>"),l})},commands:function(){var t=[];return this.skills().forEach(function(e){t.push({cmd:"/"+e.trigger,pid:e.pid,kind:"skill",skill:e,title:e.title||e.trigger})}),t},importText:function(t,e){if(!t||typeof t!="string"||!t.trim())throw new Error("空内容");if(t.indexOf("PluginBus.register")<0)throw new Error("这不是插件源码：未找到 PluginBus.register({...}) 调用");var n=null,s=window.PluginBus;window.PluginBus={register:function(a){return n=a,D.register(a)}};var r=null;try{var o=new Function("PluginBus","window",`"use strict";
`+t+`
;return true;`);o(window.PluginBus,window)}catch(a){r=a}if(window.PluginBus=s,r)throw new Error("插件执行失败："+(r.message||String(r)));if(!n)throw new Error("插件未调用 PluginBus.register");var i=Pn(n);return(i.depends||[]).forEach(function(a){var l=oe().some(function(u){return u.id===a});if(!l)throw new Error("依赖插件「"+a+"」未安装。请先安装它再导入本插件。")}),M.update(function(a){a.plugins=a.plugins||[];var l=a.plugins.findIndex(function(p){return p.id===i.id}),u={id:i.id,name:i.name,version:i.version,desc:i.desc,author:i.author,source:t,enabled:!0,createdAt:i.createdAt,config:i.config,shortcuts:i.shortcuts,depends:i.depends,memory:i.memory};l>=0?a.plugins[l]=u:a.plugins.push(u)}),e||X.show("插件「"+i.name+"」已导入","success",2500),i},exportText:function(t){var e=oe().find(function(n){return n.id===t});return e?`/*
 * `+e.name+" v"+e.version+(e.author?" by "+e.author:"")+`
 * `+(e.desc||"")+`
 */
`+(e.source||""):null},importSkillPack:function(t,e){if(!t||!t.skillMd)throw new Error("技能包缺少指令内容");var n=String(t.id||t.name||"skill-pack").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g,"-").replace(/^-+|-+$/g,""),s=n.replace(/[\u4e00-\u9fa5]+/g,function(u){for(var p=0,d=0;d<u.length;d++)p=p*31+u.charCodeAt(d)>>>0;return"s"+p.toString(36).slice(0,4)}),r=s.replace(/[^a-z0-9\-_]/g,"-").replace(/^-+|-+$/g,"").slice(0,32)||"skill-"+Date.now().toString(36);/^[a-z0-9][a-z0-9\-_]{1,31}$/i.test(r)||(r="skill-"+Date.now().toString(36));var o=t.refs.length?`

【参考文档（遇到相关问题时查阅）】
`+t.refs.map(function(u,p){return"["+(p+1)+"] "+u.path+"："+u.text.slice(0,300)+(u.text.length>300?"…":"")}).join(`
`):"",i=t.whenToUse?`
适用时机：`+t.whenToUse:"",a={id:r,name:t.name||r,version:t.version||"1.0",desc:t.description||"AI 技能包",author:t.author||"skill-pack",skills:[{trigger:t.name||r,title:t.name||r,summary:t.description||t.name||r,when:t.whenToUse||"",refs:t.refs||[],prompt:t.skillMd+i+o}]};M.update(function(u){u.plugins=u.plugins||[];var p=u.plugins.findIndex(function(f){return f.id===r}),d={id:r,name:t.name||r,version:t.version||"1.0",desc:t.description||"AI 技能包",author:"skill-pack",source:"/* skill-pack: "+(t.name||r)+` */
PluginBus.register(`+JSON.stringify(a)+");",enabled:!0,createdAt:O.dkey?O.dkey():new Date().toISOString().slice(0,10),isSkillPack:!0,skillMeta:{whenToUse:t.whenToUse,refCount:(t.refs||[]).length}};p>=0?u.plugins[p]=d:u.plugins.push(d)});var l=Pn(a);return dt[r]={manifest:l},e||X.show("技能包「"+(t.name||r)+"」已导入（"+(t.refs.length?t.refs.length+" 份参考":"无参考")+"）","success",3e3),l},importZip:function(t,e){if(!window.ZipKit)throw new Error("技能包解析器未加载");return Xe.parseZip(t).then(function(n){var s=Xe.normalizeSkillPack(n);return D.importSkillPack(s,e)})},importSkillMdText:function(t,e){if(!window.ZipKit)throw new Error("技能包解析器未加载");var n=Xe.parseSkillMd(t);if(!n)throw new Error("无法解析 SKILL.md");var s=n.name||"skill-pack",r={id:s,name:s,description:n.description,whenToUse:n.whenToUse,skillMd:n.body,refs:[],files:[]};return D.importSkillPack(r,e)},exportShareCode:function(t){var e=oe().find(function(o){return o.id===t});if(!e||!e.source)return null;try{var n=new TextEncoder().encode(e.source),s="";n.forEach(function(o){s+=String.fromCharCode(o)});var r=btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");return"PBCODE1:"+r}catch{return null}},importShareCode:function(t,e){if(!t||typeof t!="string")throw new Error("无效分享码");var n=t.match(/^PBCODE1:([A-Za-z0-9\-_]+)$/);if(!n)throw new Error("不是有效的插件分享码（应以 PBCODE1: 开头）");try{for(var s=n[1].replace(/-/g,"+").replace(/_/g,"/");s.length%4;)s+="=";for(var r=atob(s),o=new Uint8Array(r.length),i=0;i<r.length;i++)o[i]=r.charCodeAt(i);var a=new TextDecoder("utf-8").decode(o);return D.importText(a,e)}catch(l){throw new Error("分享码解析失败："+(l.message||l))}},_replaySource:function(t){var e=new Function("PluginBus","window",`"use strict";
`+t);e(D,window)},enable:function(t,e){if(M.update(function(r){var o=(r.plugins||[]).find(function(i){return i.id===t});o&&(o.enabled=!!e)}),e&&!dt[t]){var n=oe().find(function(r){return r.id===t});if(n&&n.source){try{D._replaySource(n.source)}catch(r){wt(t,"启用重注册失败："+(r.message||r),"error")}return}}var s=dt[t];if(!s){D.syncAugmentors();return}if(e)try{Us(s.manifest),s.manifest.css&&D._injectCss(t,s.manifest.css),s.manifest.onEnable&&s.manifest.onEnable(bt(t)),s.manifest.init&&s.manifest.init(bt(t))}catch(r){wt(t,"启用错误："+(r.message||r),"error")}else{Gn(t),D.unsubscribeAll(t),D._removeCss(t),D._clearEnhOf(t);try{s.manifest.onDisable&&s.manifest.onDisable(bt(t))}catch(r){wt(t,"禁用错误："+(r.message||r),"error")}}D.syncAugmentors()},_clearEnhOf:function(t){var e=this;Object.keys(this._enh).forEach(function(n){e._enh[n]&&e._enh[n].pid===t&&e._clearEnh(n)})},remove:function(t){M.update(function(e){e.plugins=(e.plugins||[]).filter(function(n){return n.id!==t})}),Gn(t),D.unsubscribeAll(t),D._removeCss(t),D._clearEnhOf(t);try{dt[t]&&dt[t].manifest.onDisable&&dt[t].manifest.onDisable(bt(t))}catch{}D.closePanelsOf(t),delete dt[t],D.syncAugmentors()},byStore:oe,handleKey:function(t){var e=t.target&&t.target.tagName||"",n=e==="INPUT"||e==="TEXTAREA"||e==="SELECT"||t.target&&t.target.isContentEditable;Object.keys(dt).forEach(function(s){var r=dt[s].manifest;xe(s)&&(r.shortcuts||[]).forEach(function(o){if(!(!o||!o.key||typeof o.run!="function")){var i=o.key.toLowerCase().split("+"),a=i.indexOf("ctrl")>=0,l=i.indexOf("alt")>=0,u=i.indexOf("shift")>=0,p=i.indexOf("meta")>=0,d=i[i.length-1],f=!!t.ctrlKey===a&&!!t.altKey===l&&!!t.shiftKey===u&&!!t.metaKey===p&&String(t.key||"").toLowerCase()===d;if(f&&!(!a&&!l&&!p&&n)){t.preventDefault();try{o.run(bt(s),t)}catch(v){wt(s,"快捷键错误："+(v.message||v),"error")}}}})})},bootstrap:function(){oe().forEach(function(t){if(!(!t.enabled||!t.source))try{D._replaySource(t.source)}catch(e){wt(t.id,"启动重放失败："+(e.message||e),"error")}});try{D.syncAugmentors()}catch{}}};window.PluginBus=D;typeof document<"u"&&document.addEventListener&&(document.addEventListener("keydown",function(t){try{D.handleKey(t)}catch{}},!0),document.addEventListener("store:change",function(t){try{D._onStoreUpdate(t&&t.detail)}catch{}}));M&&O&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",function(){try{D.bootstrap()}catch{}}):setTimeout(function(){try{D.bootstrap()}catch{}},0));const Nr="kaoyan2026_layout",Cr=900;function Qi(){try{const t=localStorage.getItem(Nr);return t==="phone"||t==="workbench"?t:"auto"}catch{return"auto"}}const Ge=et(Qi());function Xi(){try{return window.innerWidth>=Cr}catch{return!1}}function ce(){return Ge.value==="workbench"?"workbench":Ge.value==="phone"?"phone":Xi()?"workbench":"phone"}function os(t,e){try{const n=document.documentElement;e&&(n.classList.add("layout-anim"),setTimeout(()=>n.classList.remove("layout-anim"),400)),t==="workbench"?n.setAttribute("data-layout","workbench"):n.removeAttribute("data-layout")}catch{}}os(ce(),!1);let cn=ce();try{const t=window.matchMedia("(min-width: "+Cr+"px)"),e=()=>{if(Ge.value!=="auto")return;const n=ce();n!==cn&&(cn=n,os(n,!0))};t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e)}catch{}function Lr(){const t=L(()=>Ge.value),e=L(()=>ce()),n=L(()=>ce()==="workbench");function s(o){Ge.value=o;try{localStorage.setItem(Nr,o)}catch{}cn=ce(),os(cn,!0)}function r(){s(ce()==="workbench"?"phone":"workbench")}return{pref:t,effective:e,isWorkbench:n,set:s,toggle:r}}let Ft=null;function Fs(t){Ft=t}function Wi(){const t={go(s){const r=window.FocusModule;if(r&&r.active){X.show("深度专注进行中，请先点「中断专注」结束再切换","warn",3500);return}kt.push($t(s))},refresh(){Ft&&Ft()},get current(){const s=kt.currentRoute.value;return String(s.params.id||s.name||"dashboard")}};window.App=t;const e=yn();window.Theme={get:()=>e.pref.value,current:()=>e.theme.value,isNight:()=>e.isNight.value,isMorning:()=>e.isMorning.value,set:s=>{e.set(s),Ft&&Ft()},toggle:()=>{e.toggle(),Ft&&Ft()},cycle:()=>{e.cycle(),Ft&&Ft()}};const n=Lr();window.Layout={get:()=>n.pref.value,effective:()=>n.effective.value,isWorkbench:()=>n.isWorkbench.value,set:s=>{n.set(s)},toggle:()=>{n.toggle()}}}const Yi={hidden:""},Ks=rt({__name:"LegacyPage",setup(t){const e=Qn(),n=Vn(),s={dashboard:"DashboardModule",scheduler:"SchedulerModule",review:"ReviewModule",photomistake:"PhotoMistakeModule",quiz:"QuizModule",essay:"EssayModule",mistakes:"MistakesModule",heatmap:"HeatmapModule",inspector:"InspectorModule",focus:"FocusModule",concept:"ConceptMapModule",sprint:"SprintModule",decision:"DecisionModule",mental:"MentalModule",reading:"ReadingModule",wordbook:"WordbookModule",polrecite:"PolReciteModule",redline:"RedlineModule",progress:"ProgressModule",plugins:"PluginCenterModule",share:"SharePlazaModule",vizai:"VizAiModule",settings:"SettingsModule"};function r(){return String(e.params.id||e.name||"dashboard")}function o(){return document.getElementById("view")}function i(){const v=o();return{v:v?v.scrollTop:0,w:window.scrollY||window.pageYOffset||0}}function a(v){const m=o();v?(m&&(m.scrollTop=v.v),window.scrollTo(0,v.w)):(m&&(m.scrollTop=0),window.scrollTo(0,0))}const l={};Po(()=>{l[r()]=i()});function u(v){const m=new Map;return v.querySelectorAll("details[open]").forEach(b=>{const h=b.querySelector("summary");if(!h)return;const g=h.textContent.trim();m.set(g,(m.get(g)||0)+1)}),m}function p(v,m){v.size&&m.querySelectorAll("details").forEach(b=>{const h=b.querySelector("summary");if(!h)return;const g=h.textContent.trim(),A=v.get(g);A&&A>0&&(b.open=!0,A===1?v.delete(g):v.set(g,A-1))})}function d(v){const m=o();if(!m)return;const b=r(),h=!!(v&&v.preserveUi),g=h?u(m):null,A=h?i():void 0,j=s[b],E=(j?window[j]:null)||f(b);if(!E||typeof E.render!="function"){if(!window.__LEGACY_ALL__){m.innerHTML='<div class="card"><div class="empty">⏳ 模块加载中…（后台补齐中，片刻即好）</div></div>',window.addEventListener("legacy:rest-loaded",()=>{if(r()===b)try{d(v)}catch{}},{once:!0});return}n.replace("/dashboard");return}m.innerHTML="";try{E.render(m)}catch(P){const T=P&&(P.message||String(P))||"未知渲染错误",C=P&&P.stack?String(P.stack):"";m.innerHTML='<div class="card"><div class="card-title" style="color:var(--danger)">⚠️ 「'+O.esc(b)+'」模块加载失败</div><div class="muted-sm" style="margin:8px 0;word-break:break-all">'+O.esc(T)+"</div>"+(C?'<details style="margin-top:6px"><summary class="muted-sm" style="cursor:pointer">📄 详细堆栈（截图反馈）</summary><pre class="report" style="font-size:11px;white-space:pre-wrap;max-height:260px;overflow:auto;margin-top:6px">'+O.esc(C)+"</pre></details>":"")+'<div class="btn-row" style="margin-top:12px"><button class="btn btn-sm btn-primary" id="pgerr-reload">🔄 重试</button><button class="btn btn-sm btn-ghost" id="pgerr-home">返回作战台</button></div></div>';const R=m.querySelector("#pgerr-reload");R&&(R.onclick=()=>{try{d(v)}catch{}});const N=m.querySelector("#pgerr-home");N&&(N.onclick=()=>n.replace("/dashboard")),console.error("[LegacyPage] 模块渲染失败:",b,P)}m.querySelector('div[data-pg-slot="top"]')||m.insertAdjacentHTML("afterbegin",'<div data-pg-slot="top" class="pg-slot"></div>'),m.querySelector('div[data-pg-slot="bottom"]')||m.insertAdjacentHTML("beforeend",'<div data-pg-slot="bottom" class="pg-slot"></div>');try{D._onPageRendered(m,b)}catch{}h&&g&&p(g,m),m.querySelectorAll(".pbar-fill").forEach(P=>{requestAnimationFrame(()=>{P.style.width=P.getAttribute("data-w")+"%"})}),h&&A&&a(A)}je(()=>e.fullPath,async()=>{await Ze();const v=r();d(),a(l[v])}),he(()=>{Fs(()=>d({preserveUi:!0})),d()}),sr(()=>Fs(null));function f(v){try{const m=D.tools();for(const h of m)if(h.id===v)return{render(g){const A=D.ctxOf?D.ctxOf(h.pid):{};if(g.innerHTML='<div class="card"><div class="card-title-row"><span class="card-title">'+(h.icon||"🧩")+" "+window.U.esc(h.title)+`</span><button class="btn btn-ghost btn-sm" onclick="App.go('__tools')">← 工具</button></div><div class="muted-sm" style="margin-bottom:8px">插件：`+window.U.esc(h.pid)+'</div></div><div class="plugin-tool-body">'+(typeof h.render=="function"&&h.render(A)||"")+"</div>",typeof h.mount=="function"){const j=g.querySelector(".plugin-tool-body");if(j)try{h.mount(j,A)}catch(E){j.innerHTML='<div class="alert alert-danger">插件渲染失败：'+window.U.esc(E.message||E)+"</div>"}}}};const b=D.maintabs();for(const h of b)if(h.id===v)return{render(g){const A=D.ctxOf?D.ctxOf(h.pid):{};try{h.render(A,g)}catch(j){g.innerHTML='<div class="alert alert-danger">插件主 tab 渲染失败：'+window.U.esc(j.message||j)+"</div>"}}}}catch{}return null}return(v,m)=>(w(),_("div",Yi))}}),Zi=["innerHTML"],Cn=rt({__name:"TexText",props:{source:{}},setup(t){const e=t,n=L(()=>Pe.renderInline(e.source||""));return(s,r)=>(w(),_("span",{class:"tex-text",innerHTML:n.value},null,8,Zi))}}),ta={class:"card",style:{"margin-top":"24px"},"data-testid":"aitools-page"},ea={class:"card-title-row"},na={class:"btn-row",style:{margin:"8px 0"}},sa=["disabled"],ra={key:0,style:{margin:"8px 0"},"data-testid":"dl-progress"},oa={class:"pbar",style:{height:"12px",background:"var(--surface-muted)"}},ia={class:"muted-sm",style:{"margin-top":"4px","font-variant-numeric":"tabular-nums"}},aa={key:1,class:"muted-sm",style:{"white-space":"pre-wrap","font-size":"12px"},"data-testid":"dl-logs"},la={key:2,style:{"margin-top":"14px"},class:"card-inner","data-testid":"at-res"},ca={style:{flex:"1"}},ua={class:"chip",style:{"font-size":"11px"}},da={class:"muted-sm",style:{width:"64px","text-align":"right"}},pa={class:"btn-row",style:{"margin-top":"8px"}},fa=["disabled"],ha={key:0,class:"muted-sm",style:{"white-space":"pre-wrap","font-size":"12px"},"data-testid":"at-res-logs"},ga={style:{"margin-top":"14px"},class:"card-inner","data-testid":"at-chat"},ma={class:"card-title-row"},ya={style:{"max-height":"460px",overflow:"auto",margin:"6px 0"}},va={key:0,style:{"text-align":"right"}},ba={class:"chip",style:{"white-space":"pre-wrap"}},wa={key:1},ka=["open"],_a={class:"muted-sm",style:{cursor:"pointer"}},Sa={class:"report",style:{"font-size":"12px"}},xa={class:"report",style:{"font-size":"12px",opacity:".8"}},Aa=["src"],Ea={key:1,style:{"margin-top":"4px"}},Ta={key:0,class:"muted-sm"},Ia={key:1,class:"muted-sm"},Oa={style:{display:"flex",gap:"8px","align-items":"flex-end"}},Ma=["disabled"],Pa={style:{"margin-top":"14px"},class:"card-inner"},Na={class:"btn-row",style:{margin:"8px 0"}},Ca=["disabled"],La=["open"],ja={class:"muted-sm",style:{cursor:"pointer"}},qa={key:0,class:"report",style:{"font-size":"12px"}},Da={key:1,class:"report",style:{"font-size":"12px",opacity:".8"}},Ra={key:2},Ba={key:0,class:"card",style:{"margin-top":"8px"},"data-testid":"at-report"},Ja={style:{"margin-top":"4px"}},Ga=rt({__name:"AiToolsPage",setup(t){const e=L(()=>ye.enabled()),n=[{k:"runtime",name:"Pyodide 运行时（内核 + 标准库）",size:"≈10MB",core:!0},{k:"numpy",name:"numpy（数值计算）",size:"≈7MB",core:!0},{k:"sympy",name:"sympy（符号验算核心）",size:"≈11MB",core:!0},{k:"mpl",name:"matplotlib（精确画图）",size:"≈9MB",core:!1},{k:"font",name:"SimHei 中文字体（图内中文）",size:"≈4.7MB",core:!1},{k:"scipy",name:"scipy（数值积分/优化，按需）",size:"≈12MB",core:!1}],s=Cs({runtime:!1,numpy:!1,sympy:!1,mpl:!1,font:!1,scipy:!1}),r=et(!1),o=et(!1),i=et([]);async function a(){try{const U=await Ho();Object.assign(s,U),r.value=!0}catch{}}async function l(){if(!o.value){o.value=!0,i.value=[];try{await zo(U=>{i.value.push(U)}),i.value.push("✅ 画图组件就绪——出题配图零等待")}catch(U){i.value.push("✗ "+String(U?.message||U))}finally{o.value=!1,await a()}}}je(()=>Et.status,U=>{U==="ready"&&(a(),setTimeout(()=>{a()},4e3))},{immediate:!0});const u=et([]),p=et(!1);async function d(){p.value=!0,u.value=[];try{await ye.ensureLoaded(U=>{u.value.push(U)}),u.value.push("✅ 就绪")}catch(U){u.value.push("✗ "+String(U?.message||U))}finally{p.value=!1}}function f(){ye.setEnabled(!e.value)}const v=Cs({stem:"",answer:"",solution:""}),m=L(()=>js.running),b=L(()=>js.steps),h=et(""),g=et(""),A=et(!1);async function j(){if(m.value)return;h.value="",g.value="",A.value=!1;const U=await ye.verifyAnswer(v.stem,v.answer,v.solution,{isCancelled:()=>A.value});h.value=U.finalText,g.value=U.verdict}function E(){A.value=!0}const P=$o,T=et("");let C=!1;function R(){if(P.running||!T.value.trim())return;C=!1;const U=T.value;T.value="",Uo(U,()=>C),Ze(()=>{const B=document.querySelector('[data-testid="at-chat"] > div:nth-child(3)');B&&(B.scrollTop=B.scrollHeight)})}function N(){C=!0}return(U,B)=>(w(),_("div",ta,[c("div",ea,[B[6]||(B[6]=c("span",{class:"card-title"},[Y("🧪 AI 工程台 "),c("span",{class:"muted-sm"},"（实验功能）")],-1)),c("span",{class:"chip",style:Vt(W(Et).status==="ready"?"color:#237804":"")},k(W(Et).status==="ready"?"组件就绪":W(Et).status==="loading"?"下载中…":W(Et).status==="error"?"组件加载失败":"组件未下载"),5)]),B[15]||(B[15]=c("div",{class:"muted-sm",style:{"margin-bottom":"8px"}},[Y(" 给 AI 增加真实工程能力：多轮调用 Python（numpy/sympy）做符号验算、数值抽查、画图。 两套方案自由选择："),c("b",null,"不启用 = 与现有完全一致"),Y("（零下载零差异）；启用后仅本页与设置页入口生效。 ")],-1)),c("div",na,[c("button",{class:tt(["btn btn-sm",e.value?"btn-primary":"btn-ghost"]),"data-testid":"at-toggle",onClick:f},k(e.value?"✓ 已启用（点击停用）":"方案A：启用工程能力"),3),e.value?(w(),_("button",{key:0,class:"btn btn-sm btn-ghost","data-testid":"at-download",disabled:p.value||W(Et).status==="ready",onClick:d},k(W(Et).status==="ready"?"组件已就绪":p.value?"下载中…":"下载扩展组件（约10MB，仅一次）"),9,sa)):z("",!0)]),p.value?(w(),_("div",ra,[c("div",oa,[c("div",{style:Vt([{height:"100%","border-radius":"999px",transition:"width .3s",background:"linear-gradient(90deg,#2f54eb,#7aa2ff)",width:"0%"},{width:W(Et).progress.pct+"%"}])},null,4)]),c("div",ia,k(W(Et).progress.pct)+"% · "+k(W(Et).progress.msg||"准备下载…"),1)])):z("",!0),u.value.length?(w(),_("div",aa,k(u.value.join(`
`)),1)):z("",!0),e.value?(w(),_("div",la,[c("div",{class:"card-title-row"},[B[7]||(B[7]=c("span",{class:"card-title"},"📦 组件资源管理",-1)),c("button",{class:"btn btn-ghost btn-sm","data-testid":"at-res-refresh",onClick:a},"↻ 刷新状态")]),B[8]||(B[8]=c("div",{class:"muted-sm",style:{"margin-bottom":"6px"}}," 基础组件随首次下载安装；画图组件默认「首次画图时按需下载」——重度可视化用户可点「预载」提前装好，出题配图零等待。 装过即记忆：重启后自动从缓存后台恢复，无需手动操作。 ",-1)),(w(),_(H,null,Q(n,$=>c("div",{key:$.k,style:{display:"flex","align-items":"center",gap:"8px",padding:"5px 0","border-bottom":"1px solid var(--line)","font-size":"12.5px"}},[c("span",ca,[Y(k($.name)+" ",1),c("span",ua,k($.core?"基础":"画图"),1)]),c("span",da,k($.size),1),c("span",{style:Vt([{width:"84px","text-align":"right","font-weight":"600"},s[$.k]?"color:#237804":"opacity:.55"])},k(r.value?s[$.k]?"✓ 已装载":"未装载":W(Et).status==="ready"?"查询中…":"未下载"),5)])),64)),c("div",pa,[c("button",{class:"btn btn-sm btn-primary",disabled:o.value||W(Et).status!=="ready","data-testid":"at-res-preload",onClick:l},k(o.value?"⏳ 预载中…":"🎨 预载画图组件（matplotlib + 中文字体 ≈14MB）"),9,fa)]),i.value.length?(w(),_("div",ha,k(i.value.join(`
`)),1)):z("",!0)])):z("",!0),e.value?(w(),_(H,{key:3},[c("div",ga,[c("div",ma,[B[9]||(B[9]=c("span",{class:"card-title"},"💬 工程对话（AI 自主编排工具）",-1)),c("button",{class:"btn btn-ghost btn-sm","data-testid":"at-chat-reset",onClick:B[0]||(B[0]=(...$)=>W(qs)&&W(qs)(...$))},"清空会话")]),B[10]||(B[10]=c("div",{class:"muted-sm",style:{"margin-bottom":"6px"}}," 像网页端 AI 平台一样问一句话，AI 连续自主调用 Python（验算/画图/数据处理）后作答。会话在本页驻留。 ",-1)),c("div",ya,[(w(!0),_(H,null,Q(W(P).items,($,V)=>(w(),_("div",{key:V,style:{margin:"8px 0"}},[$.role==="user"?(w(),_("div",va,[c("span",ba,k($.text),1)])):(w(),_("div",wa,[(w(!0),_(H,null,Q($.steps,(ot,At)=>(w(),_("details",{key:At,style:{margin:"4px 0"},open:At===$.steps.length-1&&!$.text},[c("summary",_a,"第 "+k(At+1)+" 次工具 · Python "+k(ot.error?"❌":"✓"),1),c("pre",Sa,k(ot.code),1),c("pre",xa,[Y("输出："+k(ot.output||"(无)"),1),ot.error?(w(),_(H,{key:0},[Y(k(`
`)+"错误："+k(ot.error),1)],64)):z("",!0)])],8,ka))),128)),$.image?(w(),_("img",{key:0,src:$.image,style:{"max-width":"100%",border:"1px solid var(--line)","border-radius":"8px",margin:"4px 0"},alt:"AI 生成图表"},null,8,Aa)):z("",!0),$.text?(w(),_("div",Ea,[ct(Cn,{source:$.text},null,8,["source"])])):z("",!0)]))]))),128)),W(P).running?(w(),_("div",Ta,"⚙️ AI 正在自主安排工具调用…（可取消）")):z("",!0),W(P).items.length?z("",!0):(w(),_("div",Ia,"试试：「帮我验证 ∫₀¹ xeˣdx 的答案是 e+1 是否正确」或「画一张标准正态分布曲线」"))]),c("div",Oa,[Qt(c("textarea",{"onUpdate:modelValue":B[1]||(B[1]=$=>T.value=$),class:"input",rows:"2",style:{flex:"1"},placeholder:"一句话交给 AI，它会自主决定是否调用 Python…（Ctrl+Enter 发送）","data-testid":"at-chat-input",onKeydown:B[2]||(B[2]=Xn(tn($=>R(),["ctrl"]),["enter"]))},null,544),[[me,T.value]]),W(P).running?(w(),_("button",{key:1,class:"btn btn-ghost",onClick:N},"取消")):(w(),_("button",{key:0,class:"btn btn-primary","data-testid":"at-chat-send",disabled:!T.value.trim(),onClick:R},"发送",8,Ma))])]),c("div",Pa,[B[11]||(B[11]=c("div",{class:"card-title-row"},[c("span",{class:"card-title"},"🔎 答案真实验算（sympy 独立重解 + 数值抽查）")],-1)),B[12]||(B[12]=c("label",{class:"muted-sm"},"题干",-1)),Qt(c("textarea",{"onUpdate:modelValue":B[3]||(B[3]=$=>v.stem=$),class:"input",rows:"2",placeholder:"例：计算 ∫₀¹ x·eˣ dx",style:{width:"100%"}},null,512),[[me,v.stem]]),B[13]||(B[13]=c("label",{class:"muted-sm"},"给出的答案",-1)),Qt(c("textarea",{"onUpdate:modelValue":B[4]||(B[4]=$=>v.answer=$),class:"input",rows:"2",placeholder:"例：e − 1 ≈ 1.718",style:{width:"100%"}},null,512),[[me,v.answer]]),B[14]||(B[14]=c("label",{class:"muted-sm"},"解析（可选）",-1)),Qt(c("textarea",{"onUpdate:modelValue":B[5]||(B[5]=$=>v.solution=$),class:"input",rows:"2",placeholder:"分部积分过程…",style:{width:"100%"}},null,512),[[me,v.solution]]),c("div",Na,[c("button",{class:"btn btn-primary","data-testid":"at-verify",disabled:m.value||W(Et).status!=="ready",onClick:j},k(m.value?"验算中…":"⚡ 开始真实验算"),9,Ca),m.value?(w(),_("button",{key:0,class:"btn btn-ghost",onClick:E},"取消")):z("",!0)]),(w(!0),_(H,null,Q(b.value,($,V)=>(w(),_("div",{key:V,style:{margin:"6px 0"}},[c("details",{open:$.type==="exec"&&V===b.value.length-1},[c("summary",ja," 第 "+k($.round)+" 轮 · "+k($.type==="exec"?"执行 Python"+($.error?" ❌":" ✓"):"最终结论"),1),$.code?(w(),_("pre",qa,k($.code),1)):z("",!0),$.output!==void 0?(w(),_("pre",Da,[Y("输出："+k($.output||"(无)"),1),$.error?(w(),_(H,{key:0},[Y(k(`
`)+"错误："+k($.error),1)],64)):z("",!0)])):z("",!0),$.type==="final"?(w(),_("div",Ra,[ct(Cn,{source:$.text||""},null,8,["source"])])):z("",!0)],8,La)]))),128)),h.value?(w(),_("div",Ba,[c("b",{style:Vt(g.value==="通过"?"color:#237804":g.value==="不通过"?"color:#cf1322":"")},k(g.value?"验算结论："+g.value:"结论"),5),c("div",Ja,[ct(Cn,{source:h.value},null,8,["source"])])])):z("",!0)])],64)):z("",!0)]))}}),Ha={class:"card",style:{"margin-top":"24px"},"data-testid":"prompt-studio-page"},za={class:"card-title-row"},$a=["disabled"],Ua={class:"ps-live","data-testid":"ps-live-strip"},Fa={class:"chip"},Ka={class:"chip"},Va={class:"chip"},Qa={class:"chip"},Xa={class:"chip"},Wa={class:"chip"},Ya={class:"chip"},Za={style:{display:"flex",gap:"8px","align-items":"center",margin:"10px 0","flex-wrap":"wrap"}},tl={class:"seg-row",style:{margin:"0"}},el=["placeholder"],nl={class:"card-inner","data-testid":"ps-lanes"},sl={style:{display:"flex","align-items":"baseline",gap:"8px","flex-wrap":"wrap"}},rl={style:{"font-size":"18px"}},ol={style:{"font-size":"13.5px"}},il={class:"muted-sm",style:{"font-size":"11px"}},al={key:0,class:"chip chip-warn",style:{"font-size":"10px"}},ll={class:"muted-sm",style:{"font-size":"12px",margin:"3px 0"}},cl={class:"ps-facts"},ul={class:"card-inner",style:{"margin-top":"12px"},"data-testid":"ps-flow"},dl={style:{"font-size":"20px",flex:"0 0 auto","line-height":"1.4"}},pl={style:{flex:"1","border-left":"3px solid var(--line)","padding-left":"10px"}},fl={style:{"font-size":"13px"}},hl={class:"muted-sm",style:{"font-size":"12px","margin-top":"2px"}},gl={class:"card-inner",style:{"margin-top":"12px"},"data-testid":"ps-chains"},ml={style:{"font-size":"12.5px","min-width":"170px"}},yl={class:"chip",style:{"font-size":"11px"}},vl={key:0,class:"muted-sm"},bl={class:"card-inner",style:{"margin-top":"12px"},"data-testid":"ps-frag"},wl={style:{"font-size":"13px"}},kl={class:"muted-sm",style:{"font-size":"12px",margin:"2px 0"}},_l={key:1,class:"card-inner","data-testid":"ps-registry-table"},Sl={class:"card-title-row"},xl={class:"muted-sm",style:{"font-size":"11px"}},Al={class:"ps-reg-group"},El={style:{flex:"1","min-width":"150px"}},Tl={style:{"font-size":"12.5px"}},Il={class:"muted-sm",style:{"font-size":"10.5px","margin-left":"6px"}},Ol={class:"muted-sm",style:{"font-size":"11px"}},Ml={class:"chip",style:{"font-size":"11px",flex:"none"}},Pl={class:"chip",style:{"font-size":"11px",flex:"none"}},Nl={class:"chip",style:{"font-size":"11px",flex:"none"}},Cl=["onClick"],Ll={key:0,class:"empty"},jl={class:"card-inner","data-testid":"ps-coach-flow"},ql={style:{"font-size":"18px",flex:"0 0 auto","line-height":"1.5"}},Dl={style:{flex:"1","border-left":"3px solid var(--line)","padding-left":"10px"}},Rl={style:{"font-size":"13px"}},Bl={class:"muted-sm",style:{"font-size":"12px","margin-top":"2px"}},Jl={class:"card-inner",style:{"margin-top":"12px"}},Gl={class:"muted-sm",style:{"font-size":"12px","line-height":"2"}},Hl={class:"card-inner","data-testid":"ps-aug-list"},zl={class:"card-title-row"},$l={class:"muted-sm",style:{"font-size":"11px"}},Ul={style:{flex:"1","min-width":"150px"}},Fl={style:{"font-size":"12.5px"}},Kl={class:"muted-sm",style:{"font-size":"11px"}},Vl={class:"chip",style:{"font-size":"11px"}},Ql={class:"chip",style:{"font-size":"11px"}},Xl={key:0,class:"empty"},Wl={class:"card-inner",style:{"margin-top":"12px"},"data-testid":"ps-trace"},Yl={class:"card-title-row"},Zl={class:"card-title"},tc={key:0,class:"empty"},ec={class:"ps-trace-time"},nc={class:"muted-sm"},sc={key:0,class:"chip chip-think",style:{"font-size":"10px"}},rc={key:1,class:"chip",style:{"font-size":"10px"}},oc={key:2,class:"chip",style:{"font-size":"10px"}},ic={key:3,class:"muted-sm",style:{"font-size":"11px"}},ac={key:4,class:"muted-sm",style:{"font-size":"11px"}},lc={key:5,class:"chip chip-ov",style:{"font-size":"10px"}},cc={key:6,class:"chip chip-warn",style:{"font-size":"10px"}},uc={class:"card-inner","data-testid":"ps-globals"},dc={class:"card-title-row"},pc={class:"muted-sm",style:{"font-size":"11px"}},fc={style:{display:"flex","align-items":"center",gap:"8px","flex-wrap":"wrap"}},hc={style:{"font-size":"13px"}},gc={class:"chip",style:{"font-size":"11px"}},mc={class:"muted-sm",style:{"font-size":"11px"}},yc=["onClick"],vc={style:{"font-size":"11.5px","white-space":"pre-wrap","max-height":"280px",overflow:"auto",margin:"6px 0 0"}},bc={key:0,style:{"margin-top":"8px","border-top":"1px dashed var(--line)","padding-top":"6px"}},wc={style:{flex:"0 0 auto"}},kc={style:{flex:"0 0 118px"}},_c={class:"muted-sm",style:{flex:"1"}},Sc={key:0,class:"empty"},xc={class:"card-inner",style:{"margin-top":"14px"},"data-testid":"ps-modules"},Ac={class:"card-title-row"},Ec={class:"muted-sm",style:{"font-size":"11px"}},Tc={style:{display:"flex","align-items":"center",gap:"8px","flex-wrap":"wrap"}},Ic={style:{"font-size":"13px"}},Oc={class:"chip",style:{"font-size":"11px"}},Mc={key:0,class:"muted-sm",style:{"font-size":"11px"}},Pc={class:"muted-sm",style:{"font-size":"11px"}},Nc=["onClick"],Cc={key:0,style:{"font-size":"11.5px","white-space":"pre-wrap","max-height":"280px",overflow:"auto",margin:"6px 0 0"}},Lc={key:1,class:"alert alert-danger",style:{margin:"6px 0 0","font-size":"12px"}},jc={key:2,style:{"margin-top":"8px","border-top":"1px dashed var(--line)","padding-top":"6px"}},qc={style:{flex:"0 0 auto"}},Dc={style:{flex:"0 0 118px"}},Rc={class:"muted-sm",style:{flex:"1"}},Bc={key:0,class:"empty"},Jc=rt({__name:"PromptStudioPage",setup(t){const e=et("map"),n=et(!0),s=et(""),r=et([]),o=et([]),i=et(""),a=et(0),l=L(()=>{a.value;const I=M.get(),x=I.ai||{};let S={};try{S=K.activeApi()||{}}catch{}let J={};try{J=K.cacheStats()||{}}catch{}let F={};try{F=window.AiMemory&&window.AiMemory.stats()||{}}catch{}const it=window.AiTools;let vt=0;try{vt=window.PluginBus&&window.PluginBus.skills&&window.PluginBus.skills().length||0}catch{}let Os=0;try{const Ut=Object.keys(I.copilotChats||{})[0];Os=((I.copilotChats||{})[Ut]||[]).length}catch{}let Ms="auto",Ps="json",Ns="unknown";try{Ms=String(x.toolProto||"auto")}catch{}try{Ps=Fo()}catch{}try{Ns=S.fc===!0?"yes":S.fc===!1?"no":"unknown"}catch{}return{protoMode:Ms,protoEff:Ps,apiFc:Ns,apiName:S.name||"",apiModel:S.model||"",apiEp:String(S.endpoint||"").replace(/^https?:\/\//,"").slice(0,34),configured:!!(S.model&&S.key&&S.endpoint),apisN:(x.apis||[]).length,cacheEntries:J.entries||0,cacheHits:J.hits||0,cacheKb:J.kb||0,memFacts:F.facts||0,memPinned:F.pinned||0,memAi:F.aiFacts||0,engEnabled:!!(it&&it.enabled&&it.enabled()),engReady:!!(it&&it.isReady&&it.isReady()),skillsN:vt,chatsN:Os,globalThink:x.thinkingMode===!0?"开":x.thinkingMode===!1?"关":"未设",globalTok:x.maxTokens||0,globalTemp:typeof x.temperature=="number"?x.temperature:null,modes:x.moduleModes||{},toks:x.moduleToks||{},temps:x.moduleTemps||{}}}),u=[{icon:"🌊",name:"本地流式（SSE）",on:!0,route:"chatJSON / chatStream / chatMessagesStream → chatStreamOnce",who:"全站绝大多数调用：出题/判卷/押题组卷/查重/格式修复/提取/教练/可视化…（注册表 43 条几乎全走这条）",facts:["body 带 stream:true + include_usage；响应头先到即算连接正常，30s 超时只管「连不上」，生成可跑几分钟（带图放宽 90s）","reasoning_content 双轨：思考流与正文分开回调（教练 💭 思考条 / 判卷思考区的数据源）","400 两级降级：先去 stream_options 再退极简非流式——不支持 SSE 的厂商自动兜底","chatJSON = 流式收完 → extractRobustJSON 六层容错提取"]},{icon:"📦",name:"本地非流式（rawChat）",on:!0,route:"AI.chat → rawChatOnce（整包 JSON 响应）",who:"仅广场一次性调用（shareAI）+ 任何请求 400 后的极简重试临时落到这条",facts:["30s 超时覆盖整个生成过程——长输出必死，这就是重任务全走流式的原因","思考决策：逐功能 moduleModes 优先，未配置才回退「显式 noThink > 全局开关 > 省略」(rawChatThinkKwArgs，2026-09-09 已修复此前忽略单模块配置的缺陷)","温度：决策链命中即发，未配置保持历史默认 0.6"]},{icon:"🧪",name:"AI 工程台（Python 工具循环）",on:L(()=>l.value.engEnabled),route:"toolsBridge 门卫 → toolChat 多轮循环；教练面板另走 newCoachSession 直连",who:"启用后 chat/chatStream/chatJSON 自动转多轮；教练/出题/验算/画图可自主调 Python",facts:['JSON 协议：模型输出 {"tool":"python_exec","code":…} → pyodide 真执行 → stdout/图表回传 → 下一轮；≤8 轮封顶','streamClass 分类器：工具轮/结构化 {"final":…} JSON 不上屏，最终回答轮流式喂 UI（思考流全程透传）',"教练 UI：打字机 + 💭 思考条 + 行级步骤卡（liveSteps 会话留存）","晚绑定 window.AiTools 防 core→extensions 循环依赖；未启用零差异","【双协议路由】工具调用方式可选 自研 JSON 协议（全兼容兜底）/ 平台原生 function calling（探测确认 .fc=true 才启用）——协议差异收口在 proto.ts 适配器，agent 循环与 UI 零协议感知；探测入口：设置 → 工程台 → 🔍探测当前接口"]},{icon:"☁️",name:"云端 runner（GitHub Actions）",on:!0,route:"CloudJob 提交 → ai-exam-runner.cjs（v31）→ secret gist 中转 → 收卷",who:"智能出卷（并行出题员/总审查/重写）、导入整卷、资料库整本提取（S0 探测→R1 书签→R2 页脚→R3/R4 目录→R4b 宫格→R5 兜底）",facts:["非流式一次性请求（自带 temperature 默认 0.7），跑在用户自己的 Actions 里，BYOK","断点续跑：每步落盘 gist status.json，崩溃从 checkpoint 恢复","收卷两段式：预览确认（逐题可修订）才入库——防幻觉的人工闸门","与本地链路完全独立：不占浏览器、可关页"]}],p=[{icon:"🚀",t:"① 模块发起",d:"chatStream / chatJSON / chatMessagesStream —— opts.ctx 自报身份（注册表见「调用注册表」页，CI 守门：新增 ctx 不注册→测试红）"},{icon:"🎛",t:"② 决策收口 normalizeOpts",d:"三链同构：单模块配置 > 调用方显式 > 全局默认 > 兜底。思考 resolveThink 五层 · maxTokens 四层 · 温度 resolveTemperature 四层（0~2，未配置=不干预）"},{icon:"🧠",t:"③ 提示词组装",d:"全局人格 / 模块指令 + 动态注入（记忆摘要 · 技能指令 · 识屏 PageCtx · 查询数据 · 用户参数）+ 共享片段（JSON_ONLY · SVG_DIAGRAM_SPEC）"},{icon:"🛠",t:"④ 传输",d:"缓存 cacheHash（命中即回，出题/教练类 cache:false 跳过）· toolsBridge 工程门卫 · withFailover 多接口故障切换 · SSE/非流式两通道"},{icon:"📥",t:"⑤ 解析与修复",d:"extractRobustJSON（围栏/括号配平/截断抢救）· repairJsonSafely · repairPipeLatex · 空正文三级降级（关思考→翻倍 token）"},{icon:"🖼",t:"⑥ 渲染终点",d:"结构化对象 → 模块状态 → 视图；文本 → Tex.renderInline → KaTeX 印刷体（.tx 1.21em 同标度兜底）→ 屏幕 main.css / 打印 txPrintCss+KaTeX 字体内嵌"}],d=[{icon:"🧠",name:"思考 resolveThink",chain:["单模块 moduleModes","显式 noThink/think","局部开关(卷 prefs/深度)","全局 thinkingMode","默认不思考"]},{icon:"📏",name:"maxTokens resolveMaxTokens",chain:["单模块 moduleToks","调用方显式","全局 s.ai.maxTokens","服务端默认"]},{icon:"🌡",name:"温度 resolveTemperature",chain:["单模块 moduleTemps","调用方显式","全局 s.ai.temperature","不干预(流式不发/非流式0.6)"]}],f=L(()=>{a.value;const I=l.value;return(K.AI_REGISTRY||[]).map(x=>{const S=[];I.modes[x.ctx]&&I.modes[x.ctx]!=="global"&&S.push("思考"+(I.modes[x.ctx]==="think"?"✓":"✗")),I.toks[x.ctx]&&S.push("tok"),typeof I.temps[x.ctx]=="number"&&S.push("temp");let J="",F="",it="";try{J=K.resolveThink({ctx:x.ctx})?"思考":"不思考"}catch{J="?"}try{const vt=K.resolveMaxTokens({ctx:x.ctx});F=vt>0?String(vt):"默认"}catch{F="?"}try{const vt=K.resolveTemperature({ctx:x.ctx});it=vt==null?"默认":String(vt)}catch{it="?"}return{ctx:x.ctx,name:x.name,desc:x.desc,def:x.def==="think"?"默认思考":x.def==="noThink"?"默认不思考":"跟随全局",think:J,tok:F,temp:it,ov:S}})}),v=L(()=>{const I=s.value.trim().toLowerCase(),x={};return f.value.forEach(S=>{if(I&&!(S.ctx+S.name+S.desc).toLowerCase().includes(I))return;const J=(K.AI_REGISTRY.find(F=>F.ctx===S.ctx)||{}).module||"其他";(x[J]=x[J]||[]).push(S)}),x}),m=L(()=>(K.AI_REGISTRY||[]).length),b=L(()=>f.value.filter(I=>I.ov.length).length),h=L(()=>{const I=l.value;return[{icon:"📥",t:"输入汇聚",d:"文本 Enter / 📷图片 / 📎附件 / 快捷问题 / 划词小牌；每条消息带最近 12 轮对话上下文"},{icon:"📍",t:"识屏 PageCtx",d:"DOM 直读当前页（≤40 条 × 400 字，超预算如实截断）：📍钉住每条都带；说「这道题/刚才」指代词自动带一次"},{icon:"🎯",t:"技能匹配 matchSkill",d:`PluginBus 技能库（当前 ${I.skillsN} 个）按触发词命中 → 技能指令注入 system；附件名也参与匹配`},{icon:"🧠",t:"systemPrompt 组装",d:`教练人格(coachProfile) + 当前专业课 + AiMemory 记忆摘要（已记住 ${I.memFacts} 条，AI 归纳 ${I.memAi}）+ 实时学习数据快照 + 动作协议（9 类接管工具）`},{icon:"🔀",t:"路由选择",d:I.engEnabled?"✅ 工程台已启用：newCoachSession 多轮 Python 循环（工具轮 JSON 屏弃、思考流+最终回答流式上屏、步骤卡留存）":"常规：agentLoop QUERY 多轮协议——教练输出 [[QUERY:]] → runQuery 本地查数据 → 回填继续（≤5 轮，无结果也逼回收口）"},{icon:"🌊",t:"流式传输",d:"SSE（cache:false 每次新鲜）；reasoning 与正文双轨回调"},{icon:"🖼",t:"渲染",d:"正文逐字打字机 + 💭 一行滚动思考条（点击展开完整思考流，会话级留存可回看）+ 动作按钮（低风险自动执行）+ 存为 Markdown"},{icon:"🧷",t:"后处理",d:"pushHistory(60 条) + 动作执行 + QUERY 结果回填历史 + reflectIfWorthy 值得才反思沉淀记忆 + 主动督学 superviseCheck（双时段节流，教练画像/全智能两档）"}]});function g(I){if(I==="*")return"全站";const x=(K.AI_REGISTRY||[]).find(S=>S.ctx===I);return x?x.module+" · "+x.name:I||"(无ctx)"}const A=L(()=>{a.value;try{return K.promptAugmentors&&K.promptAugmentors()||[]}catch{return[]}}),j=L(()=>{a.value;try{return K.traceList&&K.traceList()||[]}catch{return[]}});function E(){try{K.traceClear&&K.traceClear(),a.value++}catch{}}function P(I,x,S,J){const F=[{icon:"🧩",t:"system 组装",d:x},{icon:"🎛",t:"决策收口 normalizeOpts",d:"思考/最大token/温度三链同构：单模块 > 显式 > 全局 > 兜底",live:I},{icon:"🛠",t:"传输",d:"缓存（命中即回；出题类 cache:false 跳过）· 工具桥门卫（工程模式自动转多轮 Python）· 故障切换链（多接口 30s）· 流式 SSE"}];return J&&F.splice(3,0,{icon:"🧪",t:"沙箱执行",d:J}),F.push({icon:"📥",t:"解析与修复",d:"extractRobustJSON（代码围栏/括号配平/截断抢救）→ repairJsonSafely → repairPipeLatex"}),F.push({icon:"🖼",t:"渲染终点",d:S}),F}function T(I){try{const x=K.resolveThink({ctx:I})?"思考":"不思考",S=K.resolveMaxTokens({ctx:I}),J=K.resolveTemperature({ctx:I});return"当前生效："+x+" · maxTokens "+(S>0?S:"服务端默认")+" · 温度 "+(J??"默认")}catch{return""}}const C={"global.coach":{system:"教练人格 systemPrompt：教练画像(settings.coachProfile) + activeMajorName + memoryDigest(400)",dest:"copilot 对话底座（被 copilot 层二次组合）"},"quiz.gen":{system:"quizPrompt：出题官 + 记忆摘要(memBlock) + 考点/层级/薄弱参数 + JSON_ONLY + SVG_DIAGRAM_SPEC(按需)",dest:"quiz 对象 → formatStem → Tex.renderInline → KaTeX（作答页）",extra:"工程模式：出题前先 python_exec 算准标准答案"},"quiz.answer":{system:"JUDGE_PROMPT：阅卷官 + JSON_ONLY + 题面/作答/标准答案",dest:"判分 JSON → steps 采分点渲染（作答页/复盘）"},"copilot.review":{system:"DEEP_REVIEW_PROMPT：复盘教练 + activeMajor",dest:"全景快照(reportText 打包) → 深度复盘结构化输出"},"copilot.chat":{system:"systemPrompt：教练人格 + activeMajor + memoryDigest(500) + 实时快照 snapshot + 动作协议",dest:"copilot 气泡打字机 + 💭思考条 → renderContent → Tex/KaTeX；动作 parseActions 自动执行",extra:"技能指令 matchSkill / QUERY 数据 runQuery / 识屏 PageCtx 注入"},"word.mnemonic":{system:"mnemonicSystem：词根/联想/考研考点/搭配/易混 五件套契约",dest:"patchWord(mnemonic) → 词卡 mnemonicHtml（复习翻面）"},"word.example":{system:"exampleSystem：考研语境例句 12-20 词 + 中文翻译",dest:"patchWord(example/exampleCn) → 复习页词卡"},"word.confuse":{system:"易混词契约：3 个近形/近义/同根干扰词",dest:"patchWord(confuseList) → 看义选词干扰项（choiceHtml）"},"insp.gen":{system:"genSystem：方法卡契约（recognize/steps/pitfalls/verify）+ 考点/题面/解析",dest:"normalizePlaybook → 方法卡库 + 带练闭环"},"sprint.latexfix":{system:"LATEX_FIX_SYS：LaTeX 质检员契约——只修语法禁改内容，字段级回传（stem/options 只回传改动）",dest:"逐题勾选确认弹窗 → 覆盖 stem/options → Store 落库"}};function R(I){const x=C[I.ctx];return x&&(I.dest=x.dest,I.pipe=P(I.ctx,x.system,x.dest,x.extra)),I}const N=[{name:"JSON_ONLY",desc:"JSON 输出纪律（出题/判卷/例句/易混词/方法卡/云端 questionSystem 复用同一份）",usedBy:["quiz.gen","quiz.answer","word.example","word.confuse","insp.gen","cloud.questionSystem"]},{name:"SVG_DIAGRAM_SPEC",desc:"SVG 画图规约（配图字段单源，改一处全站生效）",usedBy:["quiz.gen","dashboard 每日一题"]},{name:"TOOL 附录",desc:"python_exec 工具声明（本地 TOOL_APPENDIX / 云端 TOOL_APPENDIX）",usedBy:["工程出题","教练/私教工具会话","云端出题/重写/审查"]},{name:"streamClass 分类器",desc:"流式期 tool/final/hold 三态（bridge.toolChat 与 agent 会话共用，JSON 轮不裸上屏）",usedBy:["工程台全站","教练工程分支"]}];async function U(){n.value=!0;try{await Promise.all([Z(()=>import("./wordbook-CfxisImW.js"),[],import.meta.url),Z(()=>import("./copilot-DnPowQJ9.js"),__vite__mapDeps([0,1,2,3,4,5,6]),import.meta.url),Z(()=>Promise.resolve().then(()=>Of),void 0,import.meta.url)]),r.value=(K.globalPrompts()||[]).map(x=>R({name:x.name,ctx:x.id,text:String(x.text||"")}));const I=window;o.value=[{name:"单词 · 记忆口诀",ctx:"word.mnemonic",compose:"助记契约 + 示例词条参数",text:()=>I.WordbookModule.mnemonicSystem({word:"abandon",meaning:"放弃；抛弃"})},{name:"单词 · 语境例句",ctx:"word.example",compose:"例句契约 + 示例词条参数",text:()=>I.WordbookModule.exampleSystem()},{name:"单词 · 易混词干扰项",ctx:"word.confuse",compose:"易混词契约（3 个近形/近义/同根）",text:()=>I.WordbookModule.confuseSystem()},{name:"解题方法 · 方法卡 system",ctx:"insp.gen",compose:"方法卡契约 + 科目/考点/代表性题面",text:()=>I.MethodLink.genSystemPreview({subject:"math",topicName:"极限计算"})}].map(x=>{try{return R({name:x.name,ctx:x.ctx,text:String(x.text()),compose:x.compose})}catch(S){return{name:x.name,ctx:x.ctx,text:"",error:String(S.message||S)}}})}finally{n.value=!1}}he(U);function B(){a.value++,U()}function $(I){const x=s.value.trim().toLowerCase();return x?I.filter(S=>(S.name+" "+S.ctx+" "+S.text).toLowerCase().includes(x)):I}const V=L(()=>$(r.value)),ot=L(()=>$(o.value));async function At(I,x){try{await navigator.clipboard.writeText(I.text),i.value=x,setTimeout(()=>{i.value===x&&(i.value="")},1500)}catch{}}function Tn(I){s.value=I,e.value="list"}return(I,x)=>(w(),_("div",Ha,[c("div",za,[x[6]||(x[6]=c("span",{class:"card-title"},[Y("🛰 AI 层链路可视化 "),c("span",{class:"muted-sm"},"（实时求值 · 非硬编码快照）")],-1)),c("button",{class:"btn btn-ghost btn-sm","data-testid":"ps-refresh",disabled:n.value,onClick:B},"↻ 刷新实时值",8,$a)]),c("div",Ua,[c("span",{class:tt(["chip",l.value.configured?"chip-ok":"chip-warn"])},"🔌 "+k(l.value.configured?(l.value.apiName||"当前接口")+" · "+l.value.apiModel:"未配置接口"),3),c("span",Fa,"备用链 "+k(l.value.apisN)+" 个",1),c("span",Ka,"🌐 全局思考："+k(l.value.globalThink),1),c("span",Va,"📏 全局 maxTokens："+k(l.value.globalTok||"服务端默认"),1),c("span",Qa,"🌡 全局温度："+k(l.value.globalTemp==null?"不干预":l.value.globalTemp),1),c("span",Xa,"🗂 缓存 "+k(l.value.cacheEntries)+" 条 · 命中 "+k(l.value.cacheHits)+" 次 · "+k(l.value.cacheKb)+"KB",1),c("span",Wa,"🧠 记忆 "+k(l.value.memFacts)+" 条（置顶 "+k(l.value.memPinned)+"）",1),c("span",Ya,"🎓 教练会话 "+k(l.value.chatsN)+" 条 · 技能 "+k(l.value.skillsN)+" 个",1),c("span",{class:tt(["chip",l.value.engEnabled?"chip-ok":""])},"🧪 工程台 "+k(l.value.engEnabled?l.value.engReady?"已启用·就绪":"已启用·未加载":"未启用"),3),c("span",{class:tt(["chip",l.value.protoEff==="fc"?"chip-ok":""]),"data-testid":"ps-proto-chip"},"🔀 工具协议："+k(l.value.protoMode==="auto"?"自动":l.value.protoMode==="fc"?"强制FC":"强制JSON")+" → 生效"+k(l.value.protoEff==="fc"?"原生FC":"JSON")+"（接口"+k(l.value.apiFc==="yes"?"支持FC✓":l.value.apiFc==="no"?"不支持FC✗":"未探测?")+"）",3)]),c("div",Za,[c("div",tl,[c("button",{class:tt(["seg",e.value==="map"?"seg-on":""]),"data-testid":"ps-tab-map",onClick:x[0]||(x[0]=S=>e.value="map")},"🗺 链路全景",2),c("button",{class:tt(["seg",e.value==="registry"?"seg-on":""]),"data-testid":"ps-tab-registry",onClick:x[1]||(x[1]=S=>e.value="registry")},"📋 调用注册表",2),c("button",{class:tt(["seg",e.value==="coach"?"seg-on":""]),"data-testid":"ps-tab-coach",onClick:x[2]||(x[2]=S=>e.value="coach")},"🎓 教练机制",2),c("button",{class:tt(["seg",e.value==="aug"?"seg-on":""]),"data-testid":"ps-tab-aug",onClick:x[3]||(x[3]=S=>e.value="aug")},"🔌 拓展与追踪",2),c("button",{class:tt(["seg",e.value==="list"?"seg-on":""]),"data-testid":"ps-tab-list",onClick:x[4]||(x[4]=S=>e.value="list")},"📜 提示词清单",2)]),Qt(c("input",{"onUpdate:modelValue":x[5]||(x[5]=S=>s.value=S),class:"input",placeholder:e.value==="registry"?"🔍 搜索 ctx / 功能名…":"🔍 搜索名称 / ctx / 提示词内容…","data-testid":"ps-q",style:{flex:"1","min-width":"180px"}},null,8,el),[[me,s.value]])]),e.value==="map"?(w(),_(H,{key:0},[c("div",nl,[x[8]||(x[8]=c("div",{class:"card-title"},"四条传输通道（谁走哪条、为什么）",-1)),(w(),_(H,null,Q(u,(S,J)=>c("div",{key:J,class:tt(["ps-lane",{dim:S.on===!1}])},[c("div",sl,[c("span",rl,k(S.icon),1),c("b",ol,k(S.name),1),c("code",il,k(S.route),1),S.on===!1?(w(),_("span",al,"当前未启用")):z("",!0)]),c("div",ll,[x[7]||(x[7]=c("b",null,"谁在用：",-1)),Y(k(S.who),1)]),c("ul",cl,[(w(!0),_(H,null,Q(S.facts,(F,it)=>(w(),_("li",{key:it},k(F),1))),128))])],2)),64))]),c("div",ul,[x[9]||(x[9]=c("div",{class:"card-title"},"一次 AI 调用的六层旅程",-1)),(w(),_(H,null,Q(p,(S,J)=>c("div",{key:J,style:{display:"flex",gap:"10px","align-items":"flex-start",margin:"8px 0"}},[c("div",dl,k(S.icon),1),c("div",pl,[c("b",fl,k(S.t),1),c("div",hl,k(S.d),1)])])),64))]),c("div",gl,[x[10]||(x[10]=c("div",{class:"card-title"},"三条决策链（同构：单模块 > 调用方显式 > 全局 > 兜底）",-1)),(w(),_(H,null,Q(d,S=>c("div",{key:S.name,style:{display:"flex","align-items":"center",gap:"6px","flex-wrap":"wrap",margin:"8px 0"}},[c("b",ml,k(S.icon)+" "+k(S.name),1),(w(!0),_(H,null,Q(S.chain,(J,F)=>(w(),_(H,{key:F},[c("span",yl,k(J),1),F<S.chain.length-1?(w(),_("span",vl,"›")):z("",!0)],64))),128))])),64)),x[11]||(x[11]=c("div",{class:"muted-sm",style:{"font-size":"11.5px"}},"逐功能的当前生效值见「📋 调用注册表」；配置入口：设置 → ⚙️ AI 参数配置中心。",-1))]),c("div",bl,[x[12]||(x[12]=c("div",{class:"card-title"},"🧾 共享片段使用关系（单源契约，改一处全站生效）",-1)),(w(),_(H,null,Q(N,S=>c("div",{key:S.name,style:{border:"1px solid var(--line)","border-radius":"8px",padding:"8px 10px",margin:"6px 0"}},[c("b",wl,k(S.name),1),c("div",kl,k(S.desc),1),(w(!0),_(H,null,Q(S.usedBy,J=>(w(),_("span",{key:J,class:"chip",style:{"font-size":"11px",margin:"2px 4px 2px 0"}},k(J),1))),128))])),64))])],64)):e.value==="registry"?(w(),_("div",_l,[c("div",Sl,[x[13]||(x[13]=c("span",{class:"card-title"},"全量 ctx × 当前实时生效",-1)),c("span",xl,k(m.value)+" 个注册功能 · "+k(b.value)+" 个有逐功能覆盖 · 传输默认走 🌊SSE（例外见全景页）",1)]),(w(!0),_(H,null,Q(v.value,(S,J)=>(w(),_(H,{key:J},[c("div",Al,k(J),1),(w(!0),_(H,null,Q(S,F=>(w(),_("div",{key:F.ctx,class:"ps-reg-row"},[c("div",El,[c("b",Tl,k(F.name),1),c("code",Il,k(F.ctx),1),c("div",Ol,k(F.desc),1)]),c("span",Ml,k(F.def),1),c("span",{class:tt(["chip",F.think==="思考"?"chip-think":""]),style:{"font-size":"11px",flex:"none"}},"现·"+k(F.think),3),c("span",Pl,"tok "+k(F.tok),1),c("span",Nl,"温 "+k(F.temp),1),(w(!0),_(H,null,Q(F.ov,it=>(w(),_("span",{key:it,class:"chip chip-ov",style:{"font-size":"10px",flex:"none"}},k(it),1))),128)),c("button",{class:"btn btn-ghost btn-sm",style:{flex:"none","font-size":"11px"},onClick:it=>Tn(F.ctx)},"📜",8,Cl)]))),128))],64))),128)),Object.keys(v.value).length?z("",!0):(w(),_("div",Ll,"无匹配项"))])):e.value==="coach"?(w(),_(H,{key:2},[c("div",jl,[x[14]||(x[14]=c("div",{class:"card-title"},"教练一句话的全旅程（含工程台分支）",-1)),(w(!0),_(H,null,Q(h.value,(S,J)=>(w(),_("div",{key:J,style:{display:"flex",gap:"10px","align-items":"flex-start",margin:"9px 0"}},[c("div",ql,k(S.icon),1),c("div",Dl,[c("b",Rl,k(J+1)+". "+k(S.t),1),c("div",Bl,k(S.d),1)])]))),128))]),c("div",Jl,[x[18]||(x[18]=c("div",{class:"card-title"},"教练专属设施速查",-1)),c("div",Gl,[x[15]||(x[15]=Y(" · 记忆：",-1)),x[16]||(x[16]=c("b",null,"AiMemory",-1)),Y("（事实库 ≤120 条 / 画像 / 反思沉淀 reflectIfWorthy / 整理 memoryDigest）——当前 "+k(l.value.memFacts)+" 条",1),x[17]||(x[17]=No("<br data-v-68b3ede7> · 识屏：<b data-v-68b3ede7>PageCtx</b>（DOM 直读 ≤40 条 × 400 字 + 9000 字总预算截断如实告知）+ 指代词自动附带<br data-v-68b3ede7> · 动作：<b data-v-68b3ede7>parseActions</b> 9 类接管工具（跳转/加任务/打卡/改排程…），低风险 auto 执行、可撤销<br data-v-68b3ede7> · 查询：<b data-v-68b3ede7>[[QUERY:]]</b> 协议 → runQuery 本地数据 → 回填同轮继续（agentLoop ≤5 轮）<br data-v-68b3ede7> · 渲染：<b data-v-68b3ede7>makeStreamView</b> 打字机 + 💭 思考条（liveThink 会话留存可回看）+ 步骤卡（liveSteps）<br data-v-68b3ede7> · 主动：开场白（每日一次）/ 督学 superviseCheck（双时段）/ pushAssistant（关键事件关怀） ",18))])])],64)):e.value==="aug"?(w(),_(H,{key:3},[c("div",Hl,[c("div",zl,[x[19]||(x[19]=c("span",{class:"card-title"}," 插件提示词拓展器（受控注入 AI system）",-1)),c("span",$l,k(A.value.length)+" 个 · 只追加不替换 · 命中 ctx 才生效 · 总追加 ≤8000 字",1)]),x[20]||(x[20]=c("div",{class:"muted-sm",style:{"font-size":"12px",margin:"4px 0 8px"}},[Y("插件在 manifest 声明 "),c("code",null,"promptAugment:[{ctx,name,build}]"),Y("， 经 "),c("b",null,"PluginBus.syncAugmentors"),Y(" 登记到 "),c("b",null,"AI.applyPromptAugments"),Y("；每次 AI 调用把命中 ctx（或 '*' 全站）的拓展段 追加到 system 尾部。禁用插件即注销。下方「调用追踪」可审计每次调用实际注入了谁。")],-1)),(w(!0),_(H,null,Q(A.value,S=>(w(),_("div",{key:S.id,class:"ps-aug-row"},[c("div",Ul,[c("b",Fl,k(S.name),1),c("div",Kl,k(S.note||"（无说明）"),1)]),c("span",Vl,k(g(S.ctx)),1),c("span",Ql,"来源 "+k(S.pid||"内置"),1)]))),128)),A.value.length?z("",!0):(w(),_("div",Xl,"暂无插件注册提示词拓展器（导入带 promptAugment 的插件后，此处与下方追踪会实时出现注入记录）"))]),c("div",Wl,[c("div",Yl,[c("span",Zl,"📡 全链路调用追踪（最近 "+k(j.value.length)+" 次）",1),c("button",{class:"btn btn-ghost btn-sm","data-testid":"ps-trace-clear",onClick:E},"🗑 清空")]),x[21]||(x[21]=c("div",{class:"muted-sm",style:{"font-size":"11.5px",margin:"4px 0 8px"}},"每次真实 AI 调用记一条：ctx→模块、模型、思考/温度/maxTokens 生效值、 缓存命中、耗时、被哪些插件拓展器注入（可审计）。点「↻ 刷新实时值」或任意 AI 调用后自动更新。",-1)),j.value.length?z("",!0):(w(),_("div",tc,"暂无调用记录——去任意功能触发一次 AI（出题/判卷/教练对话…）后回来看")),(w(!0),_(H,null,Q(j.value,(S,J)=>(w(),_("div",{key:J,class:tt(["ps-trace-row",{err:S.error}])},[c("span",ec,k(new Date(S.at).toLocaleTimeString()),1),c("b",null,k(g(S.ctx)),1),c("span",nc,k(S.model||"—"),1),S.think?(w(),_("span",sc,"思考")):z("",!0),S.temp!=null&&S.temp!==""?(w(),_("span",rc,"温"+k(S.temp),1)):z("",!0),S.tokens?(w(),_("span",oc,"tok"+k(S.tokens),1)):z("",!0),c("span",{class:tt(["chip",S.cache==="hit"?"chip-ok":""]),style:{"font-size":"10px"}},k(S.cache==="hit"?"缓存命中":S.cache==="off"?"不缓存":S.cache==="error"?"失败":"实调"),3),S.ms?(w(),_("span",ic,k(S.ms)+"ms",1)):z("",!0),S.chars?(w(),_("span",ac,k(S.chars)+"字",1)):z("",!0),S.augmented&&S.augmented.length?(w(),_("span",lc,"＋"+k(S.augmented.length)+"插件: "+k(S.augmented.join("/")),1)):z("",!0),S.error?(w(),_("span",cc,k(S.error),1)):z("",!0)],2))),128))])],64)):n.value?z("",!0):(w(),_(H,{key:4},[c("div",uc,[c("div",dc,[x[22]||(x[22]=c("span",{class:"card-title"},"🌐 注册表提示词",-1)),c("span",pc,"core/ai.ts 单源 + 模块自注册 · "+k(V.value.length)+" 条",1)]),(w(!0),_(H,null,Q(V.value,S=>(w(),_("div",{key:S.ctx,style:{border:"1px solid var(--line)","border-radius":"8px",padding:"8px 10px",margin:"6px 0"}},[c("div",fc,[c("b",hc,k(S.name),1),c("span",gc,"ctx:"+k(S.ctx),1),c("span",mc,k(S.text.length)+" 字",1),c("button",{class:"btn btn-ghost btn-sm",style:{"margin-left":"auto"},onClick:J=>At(S,S.ctx)},k(i.value===S.ctx?"✓ 已复制":"📋 复制"),9,yc)]),c("pre",vc,k(S.text),1),S.pipe?(w(),_("div",bc,[(w(!0),_(H,null,Q(S.pipe,(J,F)=>(w(),_("div",{key:F,style:{display:"flex",gap:"6px","font-size":"11.5px",margin:"3px 0"}},[c("span",wc,k(J.icon),1),c("b",kc,k(J.t),1),c("span",_c,k(J.live?T(J.live):J.d),1)]))),128))])):z("",!0)]))),128)),V.value.length?z("",!0):(w(),_("div",Sc,"无匹配项"))]),c("div",xc,[c("div",Ac,[x[23]||(x[23]=c("span",{class:"card-title"},"🧩 模块指令层",-1)),c("span",Ec,"window 门面实时构造 · 示例参数 · "+k(ot.value.length)+" 条",1)]),(w(!0),_(H,null,Q(ot.value,S=>(w(),_("div",{key:S.ctx,style:{border:"1px solid var(--line)","border-radius":"8px",padding:"8px 10px",margin:"6px 0"}},[c("div",Tc,[c("b",Ic,k(S.name),1),c("span",Oc,"ctx:"+k(S.ctx),1),S.compose?(w(),_("span",Mc,k(S.compose),1)):z("",!0),c("span",Pc,k(S.text.length)+" 字",1),c("button",{class:"btn btn-ghost btn-sm",style:{"margin-left":"auto"},onClick:J=>At(S,S.ctx)},k(i.value===S.ctx?"✓ 已复制":"📋 复制"),9,Nc)]),S.error?(w(),_("div",Lc,"求值失败："+k(S.error),1)):(w(),_("pre",Cc,k(S.text),1)),S.pipe?(w(),_("div",jc,[(w(!0),_(H,null,Q(S.pipe,(J,F)=>(w(),_("div",{key:F,style:{display:"flex",gap:"6px","font-size":"11.5px",margin:"3px 0"}},[c("span",qc,k(J.icon),1),c("b",Dc,k(J.t),1),c("span",Rc,k(J.live?T(J.live):J.d),1)]))),128))])):z("",!0)]))),128)),ot.value.length?z("",!0):(w(),_("div",Bc,"无匹配项"))])],64))]))}}),Rt=(t,e)=>{const n=t.__vccOpts||t;for(const[s,r]of e)n[s]=r;return n},Gc=Rt(Jc,[["__scopeId","data-v-68b3ede7"]]);function Hc(){const t=M.get(),e=O.dkey(),n=new Date;if((n.getMonth()+1)*100+n.getDate()>=1101&&!t.milestones.octMath&&t.alerts.lastNovPush!==e){M.update(a=>{a.alerts.lastNovPush=e}),It.open({title:"⚔️ 院校决策提醒",html:"<p>已到11月，「数学真题模拟≥120分」里程磊尚未勾选。</p><p><b>请立即根据数学成绩决定冲上大还是守河工大。</b>报名窗口不等人，用数据说话，不能凭感觉。</p>",actions:[{label:"去决策参谋",kind:"btn-primary",onClick:a=>{a(),window.App.go("decision")}},{label:"稍后",kind:"btn-ghost"}]});return}const r=M.usageBytes()/(5*1024*1024),o=t.meta.lastBackupReminder||"",i=o?(Date.now()-new Date(o).getTime())/O.DAY_MS:999;(r>.6||i>7)&&t.alerts.lastBakWarn!==e&&(M.update(a=>{a.alerts.lastBakWarn=e}),X.warn("💾 已"+Math.floor(i)+"天未导出备份。数据只存在浏览器，建议立即导出（设置 → 导出JSON备份）。"))}function zc(){const t=M.get(),e=new Date,n=(e.getMonth()+1)*100+e.getDate(),s=[];return n>=1101&&!t.milestones.octMath&&s.push(`<div class="alert alert-danger">⚔️ 11月已到而数学模拟里程磊未达成：<a href="javascript:App.go('decision')">立即去决策参谋定院 →</a></div>`),M.mistakeCountWeek("sign")>3&&s.push('<div class="alert alert-warn">✍️ 本周符号错误 '+M.mistakeCountWeek("sign")+" 次 &gt; 3次：智能排程已强制插入符号专项。</div>"),s.join("")}const is={runDailyChecks:Hc,bannerHtml:zc},$c={class:"stats-row"},Uc={class:"stat-top"},Fc={class:"stat-label"},Kc={class:"stat-num"},Vc={class:"stat-den"},Qc={class:"stat-bar"},Xc={class:"stat-foot"},Wc=rt({__name:"StatsRow",setup(t){const e=L(()=>M.todayTaskStats()),n=[{k:"math",ico:"📐"},{k:"ctrl",ico:"🎛"},{k:"eng",ico:"📖"},{k:"pol",ico:"🏛"}],s=L(()=>n.map(r=>{const o=Wt.SUBJECTS[r.k],[i,a]=e.value[r.k]||[0,0];return{k:r.k,ico:r.ico,short:o.short,color:o.color,d:i,t:a,done:a>0&&i===a,pct:a>0?Math.round(i/a*100):0,remain:a-i}}));return(r,o)=>(w(),_("div",$c,[(w(!0),_(H,null,Q(s.value,i=>(w(),_("div",{key:i.k,class:tt(["stat-tile",{"stat-done":i.done}])},[c("div",Uc,[c("span",Fc,k(i.short),1),c("span",{class:"stat-badge",style:Vt({background:`color-mix(in srgb, ${i.color} 14%, transparent)`,color:i.color})},k(i.ico),5)]),c("div",Kc,[c("b",null,k(i.d),1),c("span",Vc,"/"+k(i.t),1)]),c("div",Qc,[c("div",{class:"stat-bar-fill",style:Vt({width:i.pct+"%",background:i.color})},null,4)]),c("div",Xc,k(i.done?"已清空 ✓":i.t===0?"今日无任务":"还差 "+i.remain+" 项"),1)],2))),128))]))}}),Yc=Rt(Wc,[["__scopeId","data-v-9fd1365c"]]),Zc={key:0,class:"dsh-head"},tu={key:1,class:"dsh-title"},eu={class:"dsh-head-extra"},nu={class:"dsh-head-actions"},su=rt({__name:"DashCard",props:{icon:{default:""},title:{default:""},tint:{default:""},dense:{type:Boolean,default:!1}},setup(t){return(e,n)=>(w(),_("section",{class:tt(["dsh-card",{"dsh-dense":t.dense}])},[t.title||e.$slots.actions||e.$slots.extra?(w(),_("header",Zc,[t.icon?(w(),_("span",{key:0,class:tt(["dsh-badge",t.tint?"tint-"+t.tint:""])},k(t.icon),3)):z("",!0),t.title?(w(),_("h2",tu,k(t.title),1)):z("",!0),n[0]||(n[0]=c("span",{class:"dsh-head-spacer"},null,-1)),c("div",eu,[In(e.$slots,"extra",{},void 0)]),c("div",nu,[In(e.$slots,"actions",{},void 0)])])):z("",!0),In(e.$slots,"default",{},void 0)],2))}}),Xt=Rt(su,[["__scopeId","data-v-06402b0e"]]),ru={class:"muted-sm"},ou=["innerHTML"],iu={class:"brief-foot"},au={key:1,class:"brief-body"},lu=["innerHTML"],cu=["innerHTML"],uu={key:0,class:"muted-sm brief-note"},du={key:1,class:"muted-sm brief-note"},pu=rt({__name:"BriefCard",setup(t){const e=O.dkey(),n=L(()=>M.get().dailyBrief),s=L(()=>K.configured()),r=L(()=>n.value&&n.value.date===e&&n.value.content),o=L(()=>n.value&&n.value.date===e&&n.value.failed),i=L(()=>K.configured()&&M.get().ai.briefAuto!==!1),a=L(()=>i.value&&!r.value&&!o.value),l=L(()=>a.value&&!Ds.value),u=Ko(),p=e.slice(5).replace("-","."),d=L(()=>r.value?Ne(n.value.content):""),f=L(()=>Ne(Ds.value)),v=L(()=>Vo(M.get()));function m(){M.update(b=>{b.dailyBrief=null}),Qo()}return(b,h)=>(w(),Lt(Xt,{icon:"📰",title:"今日简报",tint:"blue",class:"dash-brief"},{extra:ft(()=>[c("span",ru,k(W(u))+" · "+k(W(p)),1)]),default:ft(()=>[r.value?(w(),_(H,{key:0},[c("div",{class:"brief-body",innerHTML:d.value},null,8,ou),c("div",iu,[h[0]||(h[0]=c("span",{class:"muted-sm"},"🧠 结合你的记忆与数据生成",-1)),s.value?(w(),_("button",{key:0,class:"link-btn",onClick:m},"🔄 换一版")):z("",!0)])],64)):a.value?(w(),_("div",au,[l.value?(w(),_(H,{key:0},[h[1]||(h[1]=c("div",{class:"skl-line"},null,-1)),h[2]||(h[2]=c("div",{class:"skl-line"},null,-1)),h[3]||(h[3]=c("div",{class:"skl-line skl-w60"},null,-1))],64)):(w(),_(H,{key:1},[c("span",{innerHTML:f.value},null,8,lu),h[4]||(h[4]=c("span",{class:"ai-cursor"},null,-1))],64))])):(w(),_(H,{key:2},[c("div",{class:"brief-body",innerHTML:v.value},null,8,cu),o.value?(w(),_("div",uu,[Y(" ⚠️ AI 简报生成失败（"+k(String(n.value.error||"").slice(0,40))+"） ",1),c("button",{class:"link-btn",onClick:m},"🔄 重试")])):s.value?z("",!0):(w(),_("div",du,"配置 AI 后，这里会变成真正懂你的每日简报 →"))],64))]),_:1}))}}),fu=Rt(pu,[["__scopeId","data-v-17a6feac"]]);function hu(t){if(!t)return{lang:"",code:""};t=String(t).trim();let e=t.match(/^```(\w*)\s*([\s\S]*?)```$/i);return e?{lang:(e[1]||"").toLowerCase(),code:e[2].trim()}:(e=t.match(/```(\w*)\s*\n([\s\S]*?)```/),e?{lang:(e[1]||"").toLowerCase(),code:e[2].trim()}:{lang:"",code:t})}function jr(t){let e=String(t);/xmlns=/.test(e)||(e=e.replace(/<svg/i,'<svg xmlns="http://www.w3.org/2000/svg"'));let n;try{n=new DOMParser().parseFromString(e,"image/svg+xml")}catch{return null}if(!n||n.getElementsByTagName("parsererror").length)return null;const s=n.documentElement;if(!s||s.nodeName.toLowerCase()!=="svg")return null;const r=s.querySelectorAll("script, foreignObject, iframe, object, embed, link, meta");for(let i=0;i<r.length;i++)r[i].parentNode&&r[i].parentNode.removeChild(r[i]);const o=[s].concat(Array.prototype.slice.call(s.getElementsByTagName("*")));for(let i=0;i<o.length;i++){const a=o[i];for(let l=a.attributes.length-1;l>=0;l--){const u=a.attributes[l].name,p=a.attributes[l].value||"";(/^on/i.test(u)||/^(xlink:)?href$/i.test(u)&&/^\s*javascript:/i.test(p)||u.toLowerCase()==="style"&&/javascript:|expression\s*\(/i.test(p))&&a.removeAttribute(u)}}return s.getAttribute("viewBox")?(s.removeAttribute("width"),s.removeAttribute("height"),s.setAttribute("width","100%"),s.getAttribute("preserveAspectRatio")||s.setAttribute("preserveAspectRatio","xMidYMid meet")):s.getAttribute("width")||s.setAttribute("width","280"),s.setAttribute("overflow","visible"),new XMLSerializer().serializeToString(s)}function qr(t){if(t&&typeof t=="object")return"";const e=hu(t),n=e.code;if(!n)return"";if(e.lang==="svg"||n.toLowerCase().indexOf("<svg")>=0){const s=jr(n);if(s)return'<div class="dgm-wrap">'+s+"</div>"}return'<div class="dgm-code"><pre class="report">'+O.esc(n)+"</pre></div>"}function gu(t){return qr(t)}const Dr={render:qr,renderSync:gu,sanitizeSvg:jr},mu=["innerHTML"],yu=rt({__name:"DiagramBlock",props:{source:{}},setup(t){const e=t,n=L(()=>Dr.render(e.source||""));return(s,r)=>(w(),_("div",{class:"diagram-block",innerHTML:n.value},null,8,mu))}}),vu={key:0,class:"dsh-dq-cell"},bu={class:"dq-tile-head"},wu={class:"dq-tile-ico"},ku={key:0,class:"dq-dot",title:"今日题还没做"},_u={key:1,class:"dq-tile-sub st-no"},Su={key:2,class:"dq-tile-sub st-warn"},xu={key:3,class:"dq-tile-sub st-warn"},Au=["innerHTML"],Eu={key:1,class:"dq-tile-preview dq-tile-hint"},Tu={class:"dq-week","aria-hidden":"true"},Iu={class:"dq-tools"},Ou=["value"],Mu=["disabled"],Pu={class:"dq-question"},Nu=["innerHTML"],Cu={class:"dq-section"},Lu=["innerHTML"],ju={key:0,class:"dq-section"},qu=["innerHTML"],Du={key:2,class:"dq-eval dq-eval-ok"},Ru={key:3,class:"dq-eval dq-eval-no"},Bu={key:4,class:"dq-eval-row"},Ju={class:"muted-sm dq-foot"},Gu={class:"alert alert-warn"},Hu=["disabled"],zu={key:2,class:"muted-sm"},$u=rt({__name:"DailyQuizCard",setup(t){const e=O.dkey(),n=L(()=>M.get().dailyQuiz),s=L(()=>n.value&&n.value.date===e&&n.value.question),r=L(()=>n.value&&n.value.date===e&&n.value.failed),o=L(()=>K.configured()),i=L(()=>!!(s.value&&!n.value.revealed&&!n.value.selfEval)),a=L(()=>s.value?Wt.SUBJECTS[n.value.subject]||{short:"题",color:"#666"}:null),l=L(()=>n.value?.selfEval==="known"?{t:"已会 ✓",cls:"st-ok"}:n.value?.selfEval==="unknown"?{t:"记入错题",cls:"st-no"}:n.value?.revealed?{t:"待自评",cls:"st-warn"}:{t:"待作答",cls:"st-warn"}),u=et(!1),p=[{v:"auto",l:"🎲 自动(薄弱点)"},{v:"math",l:"📐 数学"},{v:"ctrl",l:"🎛 专业课"},{v:"eng",l:"📖 英语"},{v:"pol",l:"🏛 政治"}],d=et(!1),f=L(()=>Ne(n.value?.question||"")),v=L(()=>Ne(n.value?.solution||"")),m=L(()=>Ne(n.value?.trap||"")),b=L(()=>(n.value?.generatedAt||"").slice(0,16).replace("T"," ")),h=L(()=>{const T=(M.get().dailyQuizHistory||[]).slice(-6).map((R,N)=>({k:"h"+N+(R.date||""),cls:R.selfEval==="known"?"ok":R.selfEval==="unknown"?"no":"done",today:!1})),C=n.value&&n.value.date===e?n.value.selfEval==="known"?"ok":n.value.selfEval==="unknown"?"no":n.value.revealed?"done":"open":"none";return T.push({k:"today",cls:C,today:!0}),T});function g(){u.value=!u.value}function A(){d.value||(d.value=!0,u.value=!0,Xo(!0,()=>{d.value=!1},ze.value))}function j(){kt.push($t("settings"))}return(E,P)=>u.value?(w(),Lt(Xt,{key:1,icon:"📅",title:"每日一题",tint:"purple",class:"dsh-dq"},{actions:ft(()=>[c("button",{class:"link-btn",onClick:g},"收起 ▴")]),default:ft(()=>[c("div",Iu,[Qt(c("select",{"onUpdate:modelValue":P[0]||(P[0]=T=>Co(ze)?ze.value=T:null),class:"input input-sel dq-sel",title:"指定出题科目"},[(w(),_(H,null,Q(p,T=>c("option",{key:T.v,value:T.v},k(T.l),9,Ou)),64))],512),[[Lo,W(ze)]]),s.value?(w(),_("button",{key:0,class:"btn btn-ghost btn-sm dq-again",disabled:d.value,onClick:A},k(d.value?"生成中…":"🔁 换题"),9,Mu)):z("",!0)]),s.value?(w(),_(H,{key:0},[c("div",Pu,[c("b",null,"📝 "+k(a.value.short)+"题：",1),c("span",{innerHTML:f.value},null,8,Nu)]),n.value.diagram?(w(),Lt(yu,{key:0,source:n.value.diagram},null,8,["source"])):z("",!0),n.value.revealed||n.value.selfEval?(w(),_(H,{key:1},[c("div",Cu,[P[8]||(P[8]=c("b",null,"🔑 解答：",-1)),c("div",{class:"dq-sol",innerHTML:v.value},null,8,Lu)]),n.value.trap?(w(),_("div",ju,[P[9]||(P[9]=c("b",null,"⚠️ 易错点：",-1)),c("div",{class:"dq-sol",innerHTML:m.value},null,8,qu)])):z("",!0)],64)):z("",!0),n.value.selfEval==="known"?(w(),_("div",Du,"✓ 已自评：会了。保持这个节奏。")):n.value.selfEval==="unknown"?(w(),_("div",Ru,"✗ 已自评：还不会——已记入错题本，明天简报会盯着你复习。")):n.value.revealed?(w(),_("div",Bu,[P[10]||(P[10]=c("span",{class:"muted-sm"},"看完解答，诚实自评：",-1)),c("button",{class:"btn btn-primary btn-sm",onClick:P[1]||(P[1]=T=>W(Rs)(!0))},"✓ 会了"),c("button",{class:"btn btn-ghost btn-sm",onClick:P[2]||(P[2]=T=>W(Rs)(!1))},"✗ 还不会")])):(w(),_(H,{key:5},[P[11]||(P[11]=c("div",{class:"dq-fold"},"🫣 解答已折叠——先拿草稿纸做一遍，再对答案。",-1)),c("button",{class:"btn btn-ghost btn-sm",onClick:P[3]||(P[3]=(...T)=>W(Bs)&&W(Bs)(...T))},"👀 查看解答")],64)),c("div",Ju,"基于你的薄弱点生成 · "+k(b.value),1)],64)):r.value?(w(),_(H,{key:1},[c("div",Gu,"⚠️ 今日一题生成失败："+k(n.value.error||"未知错误"),1),c("button",{class:"btn btn-ghost btn-sm dq-retry",disabled:d.value,onClick:A},k(d.value?"生成中…":"🔁 重试生成"),9,Hu)],64)):o.value?(w(),_("div",zu,"⏳ 正在依据你的薄弱点生成今日一题…")):(w(),_(H,{key:3},[P[12]||(P[12]=c("div",{class:"alert alert-warn"},"未配置 AI，无法生成每日一题。请先在「设置」中填写 API。",-1)),c("button",{class:"btn btn-ghost btn-sm",onClick:j,style:{"margin-top":"8px"}},"去设置 →")],64))]),_:1})):(w(),_("div",vu,[c("div",{class:"dq-tile",role:"button",tabindex:"0",title:"点击查看今日一题",onClick:g,onKeydown:Xn(g,["enter"])},[c("div",bu,[c("span",wu,[P[4]||(P[4]=Y("📅",-1)),i.value?(w(),_("span",ku)):z("",!0)]),P[5]||(P[5]=c("span",{class:"dq-tile-name"},"每日一题",-1)),s.value?(w(),_("span",{key:0,class:tt(["dq-tile-sub",l.value.cls])},k(a.value.short)+" · "+k(l.value.t),3)):r.value?(w(),_("span",_u,"生成失败 · 重试")):o.value?(w(),_("span",Su,"⏳ 生成中")):(w(),_("span",xu,"配置 AI"))]),s.value?(w(),_("div",{key:0,class:"dq-tile-preview",innerHTML:f.value},null,8,Au)):(w(),_("div",Eu,k(r.value?"今日生成失败，点击展开可重试。":o.value?"正在依据你的薄弱点生成今日一题…":"配置 AI 后，每天自动送一道针对你弱点的题。"),1)),c("div",Tu,[(w(!0),_(H,null,Q(h.value,T=>(w(),_("span",{key:T.k,class:tt(["dq-wdot","w-"+T.cls+(T.today?" w-today":"")])},null,2))),128)),P[6]||(P[6]=c("span",{class:"dq-week-label muted-sm"},"近 7 日",-1))]),P[7]||(P[7]=c("div",{class:"dq-tile-cta"},"查看今日一题 →",-1))],32)]))}}),Uu=Rt($u,[["__scopeId","data-v-f0f7a385"]]),Fu={class:"now-count"},Ku={class:"now-actions"},Vu={class:"now-count"},Qu={class:"now-title"},Xu={class:"now-sub"},Wu={class:"now-reason"},Yu={class:"now-actions"},Zu=rt({__name:"NowCard",setup(t){const e=()=>window,n=L(()=>M.todayTaskStats()),s=L(()=>M.todayAllDone()),r=L(()=>{n.value;const d=e().SchedulerModule;if(!d||!d.currentPlan)return null;const f=d.currentPlan();return f&&f.sequence&&f.sequence.find(v=>!v.done)||null}),o=L(()=>r.value?Wt.SUBJECTS[r.value.subject]:null),i=L(()=>{const d=n.value;return d.math[0]+d.ctrl[0]+d.eng[0]+d.pol[0]}),a=L(()=>{const d=n.value;return d.math[1]+d.ctrl[1]+d.eng[1]+d.pol[1]});function l(){const d=e().TasksModule;d&&r.value?d.toggleTask(r.value.id,!0):X.show("打卡模块未就绪","warn")}function u(){kt.push($t("focus"))}function p(){kt.push($t("scheduler"))}return(d,f)=>s.value?(w(),Lt(Xt,{key:0,icon:"✅",title:"今日已清场",tint:"ok",class:"dsh-now dsh-now-done"},{extra:ft(()=>[c("span",Fu,k(i.value)+"/"+k(a.value),1)]),default:ft(()=>[f[1]||(f[1]=c("div",{class:"now-title"},"✓ 全部任务完成",-1)),f[2]||(f[2]=c("div",{class:"now-sub"},"可以安心复盘、早点睡。明天继续。",-1)),c("div",Ku,[c("button",{class:"btn btn-ghost",onClick:f[0]||(f[0]=v=>W(kt).push(W($t)("review")))},"去复盘 →")])]),_:1})):r.value?(w(),Lt(Xt,{key:1,icon:"⚡",title:"现在就干这个",class:"dsh-now dsh-now-hero"},{extra:ft(()=>[c("span",Vu,k(i.value)+"/"+k(a.value)+" 已完成",1)]),default:ft(()=>[c("div",Qu,k(r.value.text),1),c("div",Xu,[o.value?(w(),_("span",{key:0,class:"now-tag",style:Vt({background:o.value.color})},k(o.value.short),5)):z("",!0),c("span",Wu,k(r.value.reason),1)]),c("div",Yu,[c("button",{class:"now-btn-primary",onClick:l},"✓ 完成打卡"),c("button",{class:"now-btn-ghost",onClick:u},"🔒 专注"+k(r.value.subject==="math"?45:25)+"分钟",1)])]),_:1})):(w(),Lt(Xt,{key:2,icon:"🗓️",title:"今日无待办",class:"dsh-now"},{default:ft(()=>[f[3]||(f[3]=c("div",{class:"now-title"},"还没排任务",-1)),f[4]||(f[4]=c("div",{class:"now-sub"},"去排程把今天的任务排上，仪表盘才知道你现在该干嘛。",-1)),c("div",{class:"now-actions"},[c("button",{class:"btn btn-primary",onClick:p},"去排程添加")])]),_:1}))}}),td=Rt(Zu,[["__scopeId","data-v-a92668cf"]]);function Ae(t,e){return'<svg viewBox="0 0 '+t+" "+e+'" width="100%" height="'+e+'" xmlns="http://www.w3.org/2000/svg">'}function gt(t,e){return window.U&&O.themeColor?O.themeColor(t,e):e}const Rr={bar(t,e){e=e||{};const n=gt("--chart-ink","#000"),s=gt("--chart-faint","#bfbfbf"),r=gt("--chart-muted","#8c8c8c"),o=gt("--chart-sub","#595959"),i=680,a=e.height||160,l=24,u=16,p=8,d=8,f=Math.max.apply(null,t.map(g=>g.value).concat([1])),v=t.length||1,m=(i-p-d)/v,b=Math.min(44,m*.55);let h=Ae(i,a);for(let g=0;g<v;g++){const A=t[g],j=Math.max(2,A.value/f*(a-l-u)),E=p+g*m+(m-b)/2,P=a-l-j,T=A.highlight?e.hiColor||n:e.color||s;h+='<rect x="'+E+'" y="'+P+'" width="'+b+'" height="'+j+'" rx="4" fill="'+T+'"><title>'+O.esc(A.label)+"："+A.value+(e.unit||"")+"</title></rect>",h+='<text x="'+(E+b/2)+'" y="'+(a-8)+'" text-anchor="middle" font-size="11" fill="'+r+'">'+O.esc(A.label)+"</text>",A.value>0&&(h+='<text x="'+(E+b/2)+'" y="'+(P-4)+'" text-anchor="middle" font-size="11" fill="'+o+'">'+A.value+"</text>")}return h+"</svg>"},donut(t,e){e=e||{};const n=gt("--chart-ink","#000"),s=gt("--chart-faint","#bfbfbf"),r=gt("--chart-muted","#8c8c8c"),o=gt("--chart-sub","#595959"),i=gt("--chart-track","#f0f0f0"),a=680,l=e.height||190,u=110,p=l/2,d=66,f=40,v=O.sum(t.map(h=>h.value));let m=Ae(a,l);if(v===0)m+='<circle cx="'+u+'" cy="'+p+'" r="'+d+'" fill="none" stroke="'+i+'" stroke-width="'+(d-f)+'"/>',m+='<text x="'+u+'" y="'+(p+5)+'" text-anchor="middle" font-size="13" fill="'+s+'">暂无数据</text>';else{let h=-Math.PI/2;t.forEach(g=>{if(g.value<=0)return;const A=g.value/v,j=h+A*Math.PI*2,E=A>.5?1:0,P=u+d*Math.cos(h),T=p+d*Math.sin(h),C=u+d*Math.cos(j),R=p+d*Math.sin(j),N=u+f*Math.cos(j),U=p+f*Math.sin(j),B=u+f*Math.cos(h),$=p+f*Math.sin(h);m+='<path d="M'+P+" "+T+" A"+d+" "+d+" 0 "+E+" 1 "+C+" "+R+" L"+N+" "+U+" A"+f+" "+f+" 0 "+E+" 0 "+B+" "+$+' Z" fill="'+g.color+'"><title>'+O.esc(g.label)+"："+g.value+"次 ("+Math.round(A*100)+"%)</title></path>",h=j}),m+='<text x="'+u+'" y="'+(p-2)+'" text-anchor="middle" font-size="22" font-weight="500" fill="'+n+'">'+v+"</text>",m+='<text x="'+u+'" y="'+(p+16)+'" text-anchor="middle" font-size="11" fill="'+r+'">总计</text>'}let b=24;return t.forEach(h=>{const g=v?Math.round(h.value/v*100):0;m+='<rect x="230" y="'+(b-10)+'" width="10" height="10" rx="2" fill="'+h.color+'"/>',m+='<text x="246" y="'+b+'" font-size="12" fill="'+n+'">'+O.esc(h.label)+"</text>",m+='<text x="660" y="'+b+'" font-size="12" text-anchor="end" fill="'+o+'">'+h.value+"次 · "+g+"%</text>",b+=24}),m+"</svg>"},line(t,e){e=e||{};const n=gt("--chart-ink","#000"),s=gt("--chart-faint","#bfbfbf"),r=gt("--chart-muted","#8c8c8c"),o=gt("--danger","#cf1322"),i=680,a=e.height||170,l=22,u=14,p=30,d=10,f=t.map(E=>E.value),v=e.min!=null?e.min:Math.min.apply(null,f.concat([0])),m=e.max!=null?e.max:Math.max.apply(null,f.concat([10])),b=t.length;if(b===0)return Ae(i,a)+'<text x="340" y="90" text-anchor="middle" fill="'+s+'" font-size="13">暂无数据</text></svg>';const h=E=>p+(b===1?(i-p-d)/2:E*(i-p-d)/(b-1)),g=E=>a-l-(E-v)/(m-v||1)*(a-l-u);let A=Ae(i,a);e.warnBelow!=null&&(A+='<line x1="'+p+'" y1="'+g(e.warnBelow)+'" x2="'+(i-d)+'" y2="'+g(e.warnBelow)+'" stroke="'+o+'" stroke-dasharray="4 4" stroke-width="1"/>',A+='<text x="'+(i-d)+'" y="'+(g(e.warnBelow)-4)+'" text-anchor="end" font-size="10" fill="'+o+'">预警线 '+e.warnBelow+"</text>");let j="";return t.forEach((E,P)=>{j+=(P===0?"M":"L")+h(P)+" "+g(E.value)}),A+='<path d="'+j+'" fill="none" stroke="'+n+'" stroke-width="2"/>',t.forEach((E,P)=>{const T=e.warnBelow!=null&&E.value<e.warnBelow;A+='<circle cx="'+h(P)+'" cy="'+g(E.value)+'" r="4" fill="'+(T?o:n)+'"><title>'+O.esc(E.label)+"："+E.value+(e.unit||"")+"</title></circle>",b<=12&&(A+='<text x="'+h(P)+'" y="'+(a-6)+'" text-anchor="middle" font-size="10" fill="'+r+'">'+O.esc(E.label)+"</text>")}),A+"</svg>"},progressBar(t,e,n){return t=O.clamp(t,0,100),'<div class="pbar" style="height:'+(n||8)+'px"><div class="pbar-fill" style="width:0%;background:'+e+'" data-w="'+t+'"></div></div>'},radar(t,e){e=e||{};const n=gt("--chart-ink","#000"),s=gt("--chart-sub","#595959"),r=gt("--chart-grid","#e8e8e8"),o=680,i=e.height||200,a=t.length||4,l=128,u=i/2,p=Math.max(40,Math.min(92,(i-24)/2-10)),d=e.color||"#2f54eb",f=g=>-Math.PI/2+2*Math.PI*g/a,v=(g,A)=>[l+A*Math.cos(f(g)),u+A*Math.sin(f(g))];let m=Ae(o,i);for(let g=1;g<=4;g++){const A=p*g/4;let j="";for(let E=0;E<=a;E++){const P=v(E%a,A);j+=(E===0?"M":"L")+P[0]+" "+P[1]}m+='<path d="'+j+' Z" fill="none" stroke="'+r+'" stroke-width="0.5"/>'}for(let g=0;g<a;g++){const[A,j]=v(g,p);m+='<line x1="'+l+'" y1="'+u+'" x2="'+A+'" y2="'+j+'" stroke="'+r+'" stroke-width="0.5"/>';const E=l+(p+22)*Math.cos(f(g)),P=u+(p+22)*Math.sin(f(g));m+='<text x="'+E+'" y="'+(P+4)+'" text-anchor="middle" font-size="12" fill="'+s+'">'+O.esc(t[g].label)+"</text>";const[T,C]=v(g,p*(O.clamp(t[g].value,0,100)/100));m+='<text x="'+T+'" y="'+(C-7)+'" text-anchor="middle" font-size="11" font-weight="500" fill="'+n+'">'+Math.round(t[g].value)+"</text>"}let b="";for(let g=0;g<=a;g++){const A=v(g%a,p*(O.clamp(t[g%a].value,0,100)/100));b+=(g===0?"M":"L")+A[0]+" "+A[1]}m+='<path d="'+b+' Z" fill="'+(e.fill||"rgba(47,84,235,0.16)")+'" stroke="'+d+'" stroke-width="1.5"/>';for(let g=0;g<a;g++){const A=v(g,p*(O.clamp(t[g].value,0,100)/100));m+='<circle cx="'+A[0]+'" cy="'+A[1]+'" r="3" fill="'+d+'"/>'}let h=24;return t.forEach(function(g,A){const j=["#185FA5","#0F6E56","#993C1D","#854F0B","#534AB7","#A32D2D","#5F5E5A","#639922"][A%8];m+='<circle cx="'+(o-108)+'" cy="'+(h-3)+'" r="4" fill="'+j+'"/>',m+='<text x="'+(o-96)+'" y="'+h+'" font-size="12" fill="'+n+'">'+O.esc(g.label)+"</text>",m+='<text x="'+(o-14)+'" y="'+h+'" text-anchor="end" font-size="12" font-weight="500" fill="'+n+'">'+Math.round(g.value)+"</text>",h+=20}),m+"</svg>"}},ed={class:"hours-line"},nd={class:"dsh-big"},sd=["innerHTML"],rd={class:"muted-sm"},od=rt({__name:"HoursCard",setup(t){const e=L(()=>M.weekHours()),n=L(()=>(new Date().getDay()+6)%7),s=L(()=>e.value.map((d,f)=>({label:["一","二","三","四","五","六","日"][f],value:d,highlight:f===n.value}))),r=L(()=>O.round1(O.sum(e.value))),o=L(()=>M.get().settings.weeklyTargetHours||50),i=L(()=>o.value?Math.round(r.value/o.value*100):0),{theme:a}=yn(),l=L(()=>(a.value,Rr.bar(s.value,{height:110,unit:"h",hiColor:O.themeColor("--chart-ink","#000")}))),u=L(()=>M.todayHours());function p(){It.open({title:"记录学习时长",html:'<div class="seg-row" id="hr-segs">'+[.5,1,1.5,2,3].map(d=>'<button class="seg" data-h="'+d+'">+'+d+"h</button>").join("")+'</div><div class="muted-sm">点击即累加到今天（当前 '+M.todayHours()+"h）</div>",actions:[{label:"完成",kind:"btn-primary"}]}),document.querySelectorAll("#hr-segs .seg").forEach(d=>{d.onclick=()=>{M.addHours(+d.getAttribute("data-h")),X.success("+"+d.getAttribute("data-h")+"h，今日共 "+M.todayHours()+"h")}})}return(d,f)=>(w(),Lt(Xt,{icon:"📈",title:"本周节奏",tint:"ok"},{actions:ft(()=>[c("button",{class:"link-btn",onClick:p},"+ 记录时长")]),default:ft(()=>[c("div",ed,[c("span",nd,[Y(k(r.value),1),f[0]||(f[0]=c("span",{class:"dsh-unit"},"小时",-1))]),c("span",{class:tt(["dsh-pill",i.value>=70?"dsh-pill-up":"dsh-pill-warn"])},k(i.value>=70?"↑":"↓")+" 目标 "+k(i.value)+"% ",3)]),c("div",{class:"wk-chart",innerHTML:l.value},null,8,sd),c("div",rd,"今日 "+k(u.value)+"h · 周目标 "+k(o.value)+"h",1)]),_:1}))}}),id=Rt(od,[["__scopeId","data-v-2168edf0"]]),ad={class:"subj4"},ld={class:"chip-name"},cd={class:"chip-num"},ud={key:0,class:"rvd-wrap"},dd=["onClick"],pd={class:"rvd-stage"},fd={class:"rvd-text"},hd=["onClick"],gd=["onClick"],md={key:1},yd={class:"task-check"},vd=["checked","onChange"],bd={class:"seq-text"},wd={key:2,class:"empty"},kd=rt({__name:"TasksCard",setup(t){const e=()=>window,n=L(()=>M.todayTaskStats()),s=L(()=>{const b=e().SchedulerModule;return b&&b.currentPlan&&b.currentPlan()||{sequence:[]}}),r=L(()=>s.value.sequence.slice(0,5)),o=L(()=>rr(M.get()).slice(0,5)),i=["math","ctrl","eng","pol"],a=L(()=>i.map(b=>{const h=Wt.SUBJECTS[b],g=n.value[b][0],A=n.value[b][1];return{k:b,short:h.short,d:g,t:A,done:A>0&&g===A,color:h.color}}));function l(b){const h=M.get().tasks.find(g=>g.id===b);return h?!!h.done:!1}function u(b,h){const g=e().TasksModule;g&&g.toggleTask(b,h)}function p(b){return(Wt.SUBJECTS[b]||{color:"#666"}).color}function d(b){return b.kind==="photo"?"📸":b.kind==="pol"?"📕":b.kind==="vocab"?"📚":b.kind==="reading"?"📖":b.kind==="srs"?"⚡":"✍️"}function f(b){return b.kind==="vocab"||b.kind==="reading"||b.kind==="srs"}function v(b){if(b.kind==="pol"){const g=e().PolReciteModule;g&&g.grade(b.id,!0),e().AiMemory&&e().AiMemory.recordEvent("完成政治大题复习",String(b.id||"").slice(0,8)),X.success("✓ 政治大题复习完成，记忆又牢了一层");return}const h=b.kind==="photo"?"mistakePhotos":"mistakes";M.update(g=>{const A=(g[h]||[]).find(j=>j.id===b.id);A&&A.reviewPlan&&(A.reviewPlan.done||(A.reviewPlan.done={}),A.reviewPlan.done["d"+b.stage]=O.dkey())}),e().AiMemory&&e().AiMemory.recordEvent("完成到期复习","D"+b.stage+"阶段"+(b.kind==="photo"?"拍题":"错题")+"重做"),X.success("✓ 复习完成，记忆又牢了一层")}function m(b){if(b.kind==="pol"){const h=e().PolReciteModule;h&&h.openReview(b.id);return}if(b.kind==="vocab"){kt.push($t("wordbook"));return}if(b.kind==="reading"){kt.push($t("reading"));return}if(b.kind==="srs"){kt.push($t("mistakes")),setTimeout(()=>{try{const h=e().MistakesModule;h&&h.srsDueList&&h.srsDueList().length&&h.openDrill()}catch{}},150);return}}return(b,h)=>(w(),Lt(Xt,{icon:"☑️",title:"今日任务",tint:"ok"},{actions:ft(()=>[c("button",{class:"link-btn",onClick:h[0]||(h[0]=g=>W(kt).push(W($t)("scheduler")))},"完整排程 →")]),default:ft(()=>[c("div",ad,[(w(!0),_(H,null,Q(a.value,g=>(w(),_("div",{key:g.k,class:tt(["chip mini",{"chip-done":g.done}]),style:Vt({"--sc":g.color})},[c("span",ld,k(g.short),1),c("span",cd,k(g.d)+"/"+k(g.t),1)],6))),128))]),o.value.length?(w(),_("div",ud,[h[1]||(h[1]=c("div",{class:"muted-sm rvd-cap"},"📅 今日到期复习（重做原题，勿看解析）",-1)),(w(!0),_(H,null,Q(o.value,g=>(w(),_("div",{key:g.kind+g.id,class:tt(["rvd-item",{"rvd-click":g.kind==="pol"||g.kind==="vocab"||g.kind==="reading"}]),onClick:A=>m(g)},[c("span",pd,k(f(g)?"SRS":"D"+g.stage),1),c("span",fd,k(d(g))+" "+k(g.text),1),f(g)?(w(),_("button",{key:0,class:"btn btn-primary btn-sm",onClick:tn(A=>m(g),["stop"])},"去复习 →",8,hd)):(w(),_("button",{key:1,class:"btn btn-ghost btn-sm",onClick:tn(A=>v(g),["stop"])},"✓ 重做完成",8,gd))],10,dd))),128))])):z("",!0),r.value.length?(w(),_("div",md,[(w(!0),_(H,null,Q(r.value,g=>(w(),_("label",{key:g.id,class:tt(["seq-row",{"seq-is-done":l(g.id)}])},[c("span",yd,[c("input",{type:"checkbox",checked:l(g.id),onChange:A=>u(g.id,A.target.checked)},null,40,vd),h[2]||(h[2]=c("span",{class:"box"},null,-1))]),c("span",bd,k(g.text),1),c("span",{class:"seq-badge",style:Vt({color:p(g.subject)})},k(g.weight),5)],2))),128))])):(w(),_("div",wd,"暂无任务"))]),_:1}))}}),_d=Rt(kd,[["__scopeId","data-v-3233740a"]]),Sd={class:"tiles"},xd=["onClick"],Ad=["innerHTML"],Ed={key:0,class:"tile-dot"},Td={class:"tile-name"},Id=rt({__name:"TilesCard",setup(t){const e=()=>window,n=L(()=>{const l=M.todayTaskStats();return l.math[1]+l.ctrl[1]+l.eng[1]+l.pol[1]-l.math[0]-l.ctrl[0]-l.eng[0]-l.pol[0]}),s=L(()=>rr(M.get()).length),r=L(()=>{const l=e().WordbookModule;try{return l&&l.dueCount?l.dueCount():0}catch{return 0}}),o=[{id:"scheduler",tint:"warn",badge:()=>n.value},{id:"quiz",tint:"blue"},{id:"mistakes",tint:"danger",badge:()=>s.value},{id:"wordbook",tint:"ok",badge:()=>r.value},{id:"polrecite",tint:"danger"},{id:"sprint",tint:"purple"},{id:"share",tint:"blue"},{id:"focus",tint:"ok"},{id:"essay",tint:"warn"}],i=L(()=>o.map(l=>{const u=Je[l.id]?l.id:"tools";return{go:l.id,svg:Je[u]||"",name:Mr(l.id),n:l.badge?Math.max(0,l.badge()):0,tint:l.tint}}));function a(l){kt.push($t(l))}return(l,u)=>(w(),Lt(Xt,{icon:"🚀",title:"快捷入口",tint:"blue"},{extra:ft(()=>[...u[0]||(u[0]=[c("span",{class:"muted-sm"},"红点 = 有待办",-1)])]),default:ft(()=>[c("div",Sd,[(w(!0),_(H,null,Q(i.value,p=>(w(),_("button",{key:p.go,class:"tile",onClick:d=>a(p.go)},[c("span",{class:tt(["tile-ico","tint-"+p.tint])},[c("span",{innerHTML:p.svg},null,8,Ad),p.n>0?(w(),_("span",Ed)):z("",!0)],2),c("span",Td,[Y(k(p.name),1),p.n>0?(w(),_(H,{key:0},[Y(" · "+k(p.n),1)],64)):z("",!0)])],8,xd))),128))])]),_:1}))}}),Od=Rt(Id,[["__scopeId","data-v-8644a98a"]]),Md={key:0,class:"streak"},Pd={class:"muted-sm"},Nd={class:"cal"},Cd={class:"cal-mrow"},Ld={class:"cal-wd"},jd={key:0,class:"cal-cell cal-empty"},qd=["title"],Dd={class:"cal-foot"},Rd={class:"muted-sm"},Ee=12,Bd=rt({__name:"CalendarCard",setup(t){const e=["一","二","三","四","五","六","日"],n=L(()=>{const o=M.get(),i=new Date;i.setHours(23,59,59,999);let a=O.weekMonday(new Date);a=new Date(a.getTime()-(Ee-1)*7*O.DAY_MS);const l=[];for(let u=0;u<7;u++){const p=[];for(let d=0;d<Ee;d++){const f=new Date(a.getTime()+(d*7+u)*O.DAY_MS);if(f>i){p.push(null);continue}const v=O.dkey(f),m=o.studyHours[v]||0,b=(o.completions[v]||[]).length,h=m+b*.5,g=h<=0?0:h<2?1:h<4?2:h<6?3:4,A=f.getFullYear()===i.getFullYear()&&f.getMonth()===i.getMonth()&&f.getDate()===i.getDate();p.push({k:v,lv:g,isToday:A,h:m,doneN:b})}l.push(p)}return l}),s=L(()=>{let o=O.weekMonday(new Date);o=new Date(o.getTime()-(Ee-1)*7*O.DAY_MS);const i=[];let a=-1;for(let l=0;l<Ee;l++){const u=new Date(o.getTime()+l*7*O.DAY_MS),p=l===0||u.getMonth()!==a?u.getMonth()+1+"月":"";p&&(a=u.getMonth()),i.push(p)}return i}),r=L(()=>{const o=M.get();let i=O.weekMonday(new Date);i=new Date(i.getTime()-(Ee-1)*7*O.DAY_MS);const a=new Date;a.setHours(23,59,59,999);let l=0,u=0,p=0,d=0;for(let f=0;;f++){const v=new Date(i.getTime()+f*O.DAY_MS);if(v>a)break;const m=O.dkey(v),b=o.studyHours[m]||0;b+(o.completions[m]||[]).length*.5>0?(u++,l+=b,d++,d>p&&(p=d)):d=0}return{totalH:O.round1(l),activeDays:u,best:p,streak:M.studyStreak()}});return(o,i)=>(w(),Lt(Xt,{icon:"🗓️",title:"学习日历",tint:"warn"},{extra:ft(()=>[r.value.streak>=2?(w(),_("span",Md,"🔥 连续 "+k(r.value.streak)+" 天",1)):z("",!0),c("span",Pd,[i[0]||(i[0]=Y("近12周 ",-1)),c("b",null,k(r.value.activeDays),1),i[1]||(i[1]=Y(" 天活跃",-1))])]),default:ft(()=>[c("div",Nd,[c("div",Cd,[i[2]||(i[2]=c("span",{class:"cal-wd"},null,-1)),(w(!0),_(H,null,Q(s.value,(a,l)=>(w(),_("span",{key:"m"+l,class:"cal-mcell"},k(a),1))),128))]),(w(!0),_(H,null,Q(n.value,(a,l)=>(w(),_("div",{key:"r"+l,class:"cal-row"},[c("span",Ld,k(e[l]),1),(w(!0),_(H,null,Q(a,(u,p)=>(w(),_(H,{key:"c"+l+"-"+p},[u?(w(),_("span",{key:1,class:tt(["cal-cell",["cal-lv"+u.lv,{"cal-today":u.isToday}]]),title:u.k+" · "+u.h+"h · 完成"+u.doneN+"项"},null,10,qd)):(w(),_("span",jd))],64))),128))]))),128))]),c("div",Dd,[i[4]||(i[4]=c("div",{class:"cal-legend"},[c("span",{class:"muted-sm"},"少"),c("span",{class:"cal-cell cal-lv0"}),c("span",{class:"cal-cell cal-lv1"}),c("span",{class:"cal-cell cal-lv2"}),c("span",{class:"cal-cell cal-lv3"}),c("span",{class:"cal-cell cal-lv4"}),c("span",{class:"muted-sm"},"多")],-1)),c("span",Rd,[i[3]||(i[3]=Y("累计 ",-1)),c("b",null,k(r.value.totalH)+"h",1)])])]),_:1}))}}),Jd=Rt(Bd,[["__scopeId","data-v-d14087cc"]]),Gd={class:"dsh-root"},Hd=["innerHTML"],zd={class:"dsh-bento"},$d=rt({__name:"DashboardView",setup(t){const e=L(()=>(M.get().milestones,M.get().alerts,is.bannerHtml()));return he(()=>{Wo(),Yo()}),(n,s)=>(w(),_("div",Gd,[e.value?(w(),_("div",{key:0,class:"dsh-banner",innerHTML:e.value},null,8,Hd)):z("",!0),ct(Yc),c("div",zd,[ct(fu,{class:"dsh-span7"}),ct(Uu,{class:"dsh-span5"}),ct(td,{class:"dsh-span7"}),ct(id,{class:"dsh-span5"}),ct(_d,{class:"dsh-span7"}),ct(Od,{class:"dsh-span5"}),ct(Jd,{class:"dsh-span12"})])]))}}),Ud=Rt($d,[["__scopeId","data-v-f21c490f"]]),Fd=[{path:"/",redirect:"/dashboard"},{path:"/dashboard",name:"dashboard",component:Ud},...be.filter(t=>t.id!=="dashboard").map(t=>({path:"/"+t.id,name:t.id,component:Ks})),{path:"/tool/aitools",name:"aitools",component:Ga},{path:"/tool/prompt-studio",name:"prompt-studio",component:Gc},{path:"/tool/:id",name:"tool",component:Ks},{path:"/:pathMatch(.*)*",redirect:"/dashboard"}],kt=jo({history:qo(),routes:Fd});kt.beforeEach(()=>{const t=window.FocusModule;return t&&t.active?(X.show("深度专注进行中，请先点「中断专注」结束再切换","warn",3500),!1):!0});function Kd(){let t="";try{const s=D.tools();s&&s.length&&(t='<div class="muted-sm" style="margin:10px 0 4px;font-size:12px">🧩 插件工具</div><div class="tools-grid">'+s.map(r=>'<button class="tool-cell" data-tab="'+r.id+'"><span class="tool-icon">'+(r.icon||"🧩")+"</span><span>"+O.esc(r.title)+"</span></button>").join("")+"</div>")}catch{}const e=vn.map(s=>'<button class="tool-cell" data-tab="'+s.id+'"><span class="tool-icon">'+(Je[s.icon]||"🧩")+"</span><span>"+s.label+"</span></button>").join(""),n=It.open({title:"🧰 工具箱",html:'<div class="tools-grid">'+e+"</div>"+t,actions:[{label:"关闭"}]});document.querySelectorAll(".tool-cell").forEach(s=>{s.onclick=()=>{const r=s.getAttribute("data-tab");n(),r&&kt.push("/tool/"+r)}})}const Vd={class:"bottomnav",id:"bottomnav","data-testid":"bottomnav"},Qd=["data-tab","data-testid","onClick"],Xd={class:"bn-icon"},Wd={class:"bn-label"},Yd=["data-tab","onClick"],Zd={class:"bn-icon"},tp=["innerHTML"],ep={class:"bn-icon"},np={class:"bn-group bn-group-tools"},sp=["data-tab","data-tool-id","data-testid","onPointerdown","onClick"],rp={class:"bn-icon"},op={class:"bn-label"},ip=rt({__name:"BottomNav",setup(t){const e=Qn(),n=Vn(),{toggle:s}=Lr(),r=L(()=>String(e.params.id||e.name||"")),o=et([]),i=et([]);function a(){try{o.value=D.maintabs()||[]}catch{o.value=[]}try{i.value=D.tools()||[]}catch{i.value=[]}}he(a);const l=L(()=>!be.some(T=>T.id===r.value)&&!!r.value);function u(T){n.push("/"+T)}function p(T){b||n.push("/tool/"+T)}function d(T){return O.esc(T)}const f=et(Array.isArray(M.get().toolOrder)?M.get().toolOrder.slice():[]);function v(T,C){if(!C.length)return T;const R=N=>{const U=C.indexOf(N);return U<0?C.length+T.findIndex(B=>B.id===N):U};return T.slice().sort((N,U)=>R(N.id)-R(U.id))}const m=L(()=>{const T=vn.map(C=>({id:C.id,label:C.label,icon:C.icon,plugin:!1})).concat(i.value.map(C=>({id:C.id,label:C.title||C.id,icon:C.icon||"🧩",plugin:!0})));return v(T,f.value)});let b=!1;const h=et("");let g=0;function A(T,C){b=!1;const R=T.currentTarget;g=window.setTimeout(()=>{h.value=C,R.classList.add("bn-dragging");try{R.setPointerCapture(T.pointerId)}catch{}if(navigator.vibrate)try{navigator.vibrate(12)}catch{}},450)}function j(T){if(g&&!h.value&&(clearTimeout(g),g=0),!h.value)return;T.preventDefault();const N=document.elementFromPoint(T.clientX,T.clientY)?.closest("[data-tool-id]")?.dataset.toolId;if(N&&N!==h.value){const U=m.value.map(V=>V.id),B=U.indexOf(h.value),$=U.indexOf(N);B>=0&&$>=0&&(U.splice($,0,U.splice(B,1)[0]),f.value=U,b=!0)}}function E(T){g&&(clearTimeout(g),g=0),T.currentTarget?.classList.remove("bn-dragging"),h.value&&(M.update(R=>{R.toolOrder=f.value}),h.value="",setTimeout(()=>{b=!1},120))}function P(){f.value=[],M.update(T=>{T.toolOrder=[]})}return(T,C)=>(w(),_("nav",Vd,[C[7]||(C[7]=c("div",{class:"bn-brand"},[c("div",{class:"bn-brand-name"},[c("span",{class:"bn-brand-ico"},"🎯"),Y("26考研作战系统")]),c("div",{class:"bn-brand-sub"},"最适合你的工作台")],-1)),c("button",{class:"bn-layout-toggle","data-testid":"layout-toggle",title:"切回手机单列布局",onClick:C[0]||(C[0]=R=>W(s)())}," 📱 切回手机布局 "),(w(!0),_(H,null,Q(W(be),R=>(w(),_("button",{key:R.id,class:tt(["bn-btn",{"bn-on":r.value===R.id}]),"data-tab":R.id,"data-testid":"nav-"+R.id,onClick:N=>u(R.id)},[c("span",Xd,[ct(Qe,{name:R.icon},null,8,["name"])]),c("span",Wd,k(R.label),1)],10,Qd))),128)),(w(!0),_(H,null,Q(o.value,R=>(w(),_("button",{key:"plugin-"+R.id,class:tt(["bn-btn",{"bn-on":r.value===R.id}]),"data-tab":R.id,onClick:N=>p(R.id)},[c("span",Zd,k(R.icon||"🧩"),1),c("span",{class:"bn-label",innerHTML:d(R.name)},null,8,tp)],10,Yd))),128)),c("button",{class:tt(["bn-btn",{"bn-on":l.value}]),"data-tab":"__tools","data-testid":"nav-tools",onClick:C[1]||(C[1]=R=>W(Kd)())},[c("span",ep,[ct(Qe,{name:"tools"})]),C[4]||(C[4]=c("span",{class:"bn-label"},"工具",-1))],2),c("div",np,[C[5]||(C[5]=c("span",null,"工具",-1)),f.value.length?(w(),_("button",{key:0,class:"bn-reset-order","data-testid":"nav-reset-order",title:"恢复默认顺序",onClick:P},"↺")):z("",!0)]),c("div",{class:"bn-scroll",onPointermove:j,onPointerup:E,onPointercancel:E},[(w(!0),_(H,null,Q(m.value,R=>(w(),_("button",{key:"stool-"+R.id,class:tt(["bn-btn bn-tool-item",{"bn-on":r.value===R.id,"bn-dragging":h.value===R.id}]),"data-tab":R.id,"data-tool-id":R.id,"data-testid":"nav-tool-"+R.id,onPointerdown:N=>A(N,R.id),onClick:N=>p(R.id)},[c("span",rp,[R.plugin?(w(),_(H,{key:1},[Y(k(R.icon),1)],64)):(w(),Lt(Qe,{key:0,name:R.icon||""},null,8,["name"]))]),c("span",op,k(R.label),1)],42,sp))),128))],32),c("div",{class:"bn-user bn-user-clickable",role:"button",tabindex:"0",title:"前往设置","data-testid":"nav-go-settings",onClick:C[2]||(C[2]=R=>p("settings")),onKeydown:C[3]||(C[3]=Xn(R=>p("settings"),["enter"]))},[...C[6]||(C[6]=[c("span",{class:"bn-user-avatar"},"岸",-1),c("span",null,[c("b",null,"上岸预定人"),Y("点击前往设置")],-1),c("span",{class:"bn-user-arrow","aria-hidden":"true"},"›",-1)])],32)]))}}),ap={class:"cp-pal",role:"dialog","aria-label":"命令面板"},lp={class:"cp-pal-list"},cp={class:"cp-pal-group"},up=["id","onClick","onMouseenter"],dp={class:"cp-pal-ico"},pp={class:"cp-pal-title"},fp={key:0,class:"cp-pal-sub"},hp={key:0,class:"cp-pal-empty"},gp=rt({__name:"CommandPalette",setup(t){const e=Vn(),n=yn(),s=et(!1),r=et(""),o=et(0),i=et(null);function a(b){s.value=!1,e.push(b)}const l=L(()=>{const b=r.value.trim().toLowerCase(),h=C=>!b||String(C||"").toLowerCase().includes(b),g=M.get(),A=C=>C+" 条",j=[...be.filter(C=>h(C.label)||h(C.id)).map(C=>({icon:"🧭",title:C.label,sub:"页面",run:()=>a("/"+C.id)})),...vn.filter(C=>h(C.label)||h(C.id)).map(C=>({icon:"🧰",title:C.label,sub:"工具",run:()=>a("/tool/"+C.id)}))];try{const C=Array.isArray(D.maintabs())?D.maintabs():[],R=Array.isArray(D.tools())?D.tools():[];j.push(...C.filter(N=>h(N.name)).map(N=>({icon:N.icon||"🧩",title:N.name,sub:"插件",run:()=>a("/"+N.id)}))),j.push(...R.filter(N=>h(N.title)).map(N=>({icon:N.icon||"🧩",title:N.title,sub:"插件工具",run:()=>a("/tool/"+N.id)})))}catch{}const E=[],P=C=>()=>{s.value=!1,e.push("/tool/photomistake").then(()=>setTimeout(()=>{try{window.PhotoMistakeModule&&window.PhotoMistakeModule.open(C)}catch{}},80))};return(h("错题")||h("mistake"))&&E.push({icon:"📕",title:"错题本",sub:A((g.mistakes||[]).length)+" · 跳转后可搜",run:()=>a("/tool/mistakes")}),(h("单词")||h("vocab"))&&E.push({icon:"🔤",title:"单词",sub:A((g.vocab||[]).length),run:()=>a("/tool/wordbook")}),(h("考点")||h("热力"))&&E.push({icon:"🔥",title:"考点热力",sub:"跳转",run:()=>a("/tool/heatmap")}),(h("讲义")||h("资料库")||h("资料"))&&E.push({icon:"📚",title:"资料库",sub:A((g.studyBooks||[]).length)+" 本",run:()=>a("/tool/sprint")}),(h("任务")||h("排程"))&&E.push({icon:"🗓",title:"今日排程",sub:A((g.tasks||[]).length)+" 项",run:()=>a("/scheduler")}),(h("复习计划")||h("复习")||h("到期"))&&E.push({icon:"📅",title:"复习计划（拍题）",sub:"艾宾浩斯 · 到期直接开始复习",run:P("review")}),(h("薄弱")||h("画像"))&&E.push({icon:"🧠",title:"薄弱画像",sub:"打包错题 → 生成弱点补卷",run:P("weak")}),h("记忆测试")&&E.push({icon:"🎯",title:"记忆测试",sub:"AI 出选判题查遗忘",run:()=>{s.value=!1,e.push("/tool/photomistake").then(()=>setTimeout(()=>{try{window.PhotoMistakeModule&&window.PhotoMistakeModule.openMemoryQuiz()}catch{}},80))}}),(Array.isArray(g.studyBooks)?g.studyBooks:[]).filter(C=>b&&h(C.title)).slice(0,5).forEach(C=>E.push({icon:"📖",title:C.title,sub:"讲义 · 直达阅读",run:()=>{s.value=!1,e.push("/tool/sprint").then(()=>setTimeout(()=>{try{window.SprintModule&&window.SprintModule.openBook(C.id)}catch{}},80))}})),[{id:"nav",icon:"🧭",label:"导航",items:j},{id:"content",icon:"🔎",label:"内容与资料",items:E},{id:"action",icon:"⚡",label:"快捷操作",items:[{icon:"🌗",title:"切换主题（跟随系统/墨白/晨岚/星阑 循环）",sub:"快捷",run:()=>{n.cycle(),s.value=!1}},{icon:"🔒",title:"开始深度专注",sub:"快捷",run:()=>a("/focus")}]}].filter(C=>C.items.length)}),u=L(()=>l.value.flatMap(b=>b.items));je(r,()=>{o.value=0}),je(u,()=>{o.value>=u.value.length&&(o.value=0)});function p(b){const h=u.value.length;h&&(o.value=(o.value+b+h)%h,Ze(()=>{const g=document.getElementById("cp-pal-item-"+o.value);g&&g.scrollIntoView({block:"nearest"})}))}function d(){const b=u.value[o.value];b&&b.run()}function f(b){s.value=b??!s.value,s.value&&(r.value="",o.value=0,Ze(()=>i.value&&i.value.focus()))}function v(b){if((b.metaKey||b.ctrlKey)&&(b.key==="k"||b.key==="K")){b.preventDefault(),f();return}s.value&&(b.key==="Escape"?s.value=!1:b.key==="ArrowDown"?(b.preventDefault(),p(1)):b.key==="ArrowUp"?(b.preventDefault(),p(-1)):b.key==="Enter"&&(b.preventDefault(),d()))}function m(){window.CommandPalette={open:()=>f(!0),close:()=>f(!1)}}return he(()=>{document.addEventListener("keydown",v),m()}),sr(()=>{document.removeEventListener("keydown",v)}),(b,h)=>(w(),Lt(Do,{to:"body"},[s.value?(w(),_("div",{key:0,class:"cp-pal-mask",onClick:h[1]||(h[1]=tn(g=>s.value=!1,["self"]))},[c("div",ap,[Qt(c("input",{ref_key:"inputEl",ref:i,"onUpdate:modelValue":h[0]||(h[0]=g=>r.value=g),class:"cp-pal-input",placeholder:"搜索页面 / 工具 / 讲义 / 操作…（↑↓ 选择，Enter 打开，Esc 关闭）",autocomplete:"off"},null,512),[[me,r.value]]),c("div",lp,[(w(!0),_(H,null,Q(l.value,(g,A)=>(w(),_(H,{key:g.id},[c("div",cp,k(g.icon)+" "+k(g.label),1),(w(!0),_(H,null,Q(g.items,(j,E)=>(w(),_("div",{key:g.id+E,id:"cp-pal-item-"+(l.value.slice(0,A).reduce((P,T)=>P+T.items.length,0)+E),class:tt(["cp-pal-item",{on:l.value.slice(0,A).reduce((P,T)=>P+T.items.length,0)+E===o.value}]),onClick:P=>j.run(),onMouseenter:P=>o.value=l.value.slice(0,A).reduce((T,C)=>T+C.items.length,0)+E},[c("span",dp,k(j.icon),1),c("span",pp,k(j.title),1),j.sub?(w(),_("span",fp,k(j.sub),1)):z("",!0)],42,up))),128))],64))),128)),u.value.length?z("",!0):(w(),_("div",hp,"没有匹配项"))])])])):z("",!0)]))}}),mp=Rt(gp,[["__scopeId","data-v-76eda8ca"]]),yp={class:"app"},vp={class:"wb-pagehead","data-testid":"pagehead"},bp={class:"wb-pagehead-sub"},wp=["data-cols"],kp={class:"view",id:"vue-view","data-testid":"vue-view"},Hn=rt({__name:"App",setup(t){const e=Qn(),n=new Set(["aitools","dashboard","prompt-studio"]),s=L(()=>n.has(String(e.name||""))),r=L(()=>String(e.params.id||e.name||"dashboard")),o=L(()=>Mr(r.value)),i=L(()=>O.daysTo(M.get().settings.examDate)),a=L(()=>{const f=new Date;return O.dkey(f).slice(5)+" · "+["周日","周一","周二","周三","周四","周五","周六"][f.getDay()]}),l=new Set(["scheduler"]),u=L(()=>l.has(r.value)?"2":void 0);let p=null;function d(){const f=document.getElementById("view"),v=document.getElementById("vue-view"),m=s.value?v:f;m&&(m.classList.remove("view-enter"),m.offsetWidth,m.classList.add("view-enter"),p&&clearTimeout(p),p=setTimeout(()=>m.classList.remove("view-enter"),620))}return je(()=>e.fullPath,()=>d()),he(()=>{d()}),(f,v)=>{const m=Ro("RouterView");return w(),_(H,null,[c("div",yp,[ct(zi),c("div",vp,[c("div",null,[c("h1",null,k(o.value),1),c("div",bp,k(a.value)+" · 距考研 "+k(i.value)+" 天",1)])]),Qt(c("main",{class:"view",id:"view","data-cols":u.value},null,8,wp),[[Ls,!s.value]]),Qt(c("main",kp,[ct(m)],512),[[Ls,s.value]]),ct(ip),ct(mp)]),v[0]||(v[0]=c("div",{id:"toast-wrap"},null,-1))],64)}}}),at={},Te={},_p={run(t,e,n,s){if(s=s||{},Te[t])return Te[t];const r={id:t,label:e||t,status:"running",result:void 0,error:"",extra:s.extra||null,startedAt:new Date().toISOString(),finishedAt:""};at[t]=r;const o=Promise.resolve().then(function(){return n()}).then(function(i){if(r.status="done",r.result=i,r.finishedAt=new Date().toISOString(),delete Te[t],s.onDone)try{s.onDone(i,r)}catch(a){console.warn("[BgTask] onDone 回调异常",a)}return window.U&&O.emit&&O.emit("bgTask:done",{id:t,label:r.label,result:i}),i},function(i){if(r.status="error",r.error=i&&i.message?i.message:String(i),r.finishedAt=new Date().toISOString(),delete Te[t],s.onError)try{s.onError(i,r)}catch(a){console.warn("[BgTask] onError 回调异常",a)}throw window.U&&O.emit&&O.emit("bgTask:error",{id:t,label:r.label,error:r.error}),i});return Te[t]=o,o.catch(function(){}),o},isRunning(t){return!!(at[t]&&at[t].status==="running")},get(t){return at[t]||null},getResult(t){return at[t]&&at[t].status==="done"?at[t].result:void 0},getError(t){return at[t]&&at[t].status==="error"?at[t].error:""},clear(t){at[t]&&at[t].status!=="running"&&delete at[t]},clearAll(){Object.keys(at).forEach(function(t){at[t].status!=="running"&&delete at[t]})},list(t){return Object.keys(at).filter(function(e){return!t||at[e].status==="running"}).map(function(e){return at[e]})}},Sp=`# kaoyan2026 云端出卷执行器 workflow（2026-08-24；v11 增 PDF 导入资源 Gist）
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
`,xp=`#!/usr/bin/env node
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
`;(()=>{try{window.CLOUDJOB_ASSETS={yml:Sp,runner:xp}}catch{}})();var lt="KaoYanTools_WorkRepo",as="ai-exam.yml",un="kaoyan2026_wftoken",ls="kaoyan2026_cj_repo_owner",Br="kaoyan2026_cj_secret_checked",Ap=20;function qt(){return window.U}function nt(){return new Date().toISOString()}function bn(){return window.Store.get().cloudJobs=window.Store.get().cloudJobs||[]}function ht(t){return bn().find(function(e){return e.id===t})}function Jt(t,e){window.Store.update(function(n){n.cloudJobs=n.cloudJobs||[];var s=n.cloudJobs.find(function(r){return r.id===t});s&&Object.keys(e).forEach(function(r){s[r]=e[r]})})}function cs(t){window.Store.update(function(e){e.cloudJobs=(e.cloudJobs||[]).filter(function(n){return n.id!==t})})}function ge(){try{var t=localStorage.getItem(un);if(t)return String(t).trim()}catch{}try{var e=window.Store.get(),n=e&&e.cloudJob&&e.cloudJob.wftoken;if(n)return localStorage.setItem(un,String(n).trim()),window.Store.update(function(s){s.cloudJob&&delete s.cloudJob.wftoken}),String(n).trim()}catch{}return""}function Ep(t){try{t?localStorage.setItem(un,String(t).trim()):localStorage.removeItem(un)}catch{}try{localStorage.removeItem(ls)}catch{}Oe=null;try{var e=window.Store.get();e&&e.cloudJob&&e.cloudJob.wftoken&&window.Store.update(function(n){n.cloudJob&&delete n.cloudJob.wftoken})}catch{}}function us(){return!!ge()}function wn(){try{return String(localStorage.getItem(ls)||"").trim()}catch{return""}}var Ie=null;function Jr(t){var e=String(t||"").trim();if(!e)return"";try{localStorage.setItem(ls,e)}catch{}return e}function ds(){var t=wn();if(t)return Promise.resolve(t);var e=ge();return e?Ie||(Ie=fetch("https://api.github.com/user",{headers:{Authorization:"Bearer "+e,Accept:"application/vnd.github+json"}}).then(function(n){if(n.status!==200)throw new Error("令牌无效（HTTP "+n.status+"），无法确定你的仓库归属");return n.json()}).then(function(n){return Jr(n&&n.login)}).finally(function(){Ie=null}),Ie):Promise.resolve("")}function kn(){return ds().catch(function(){return""})}function Tp(){var t=wn();return t?t+"/"+lt:"{你的用户名}/"+lt}function Ot(){if(!window.Cloud){var t=new Error("云同步模块未加载");throw t.status=0,t}var e=St.isLoggedIn,n=typeof e=="function"?!!e():!!e;if(!n){var s=new Error("未登录云同步（先到设置页登录 GitHub）");throw s.status=0,s}}var Vs={};async function _e(t,e){var n=await St.gistReq("/gists/"+t,e?{etag:e}:{});return n}async function pe(t){if(!t)return null;if(t.truncated&&t.raw_url){var e=await fetch(t.raw_url);if(!e.ok)throw new Error("raw 拉取失败 HTTP "+e.status);return await e.text()}return t.content}function Gr(t){var e={"job.json":{content:JSON.stringify({ver:1,jobId:t.id,prefs:t.prefs,createdAt:t.createdAt},null,1)},"status.json":{content:JSON.stringify({status:"queued",stage:"",msg:"已排队，等待执行器接单",progress:0,updatedAt:nt()},null,1)}};if(t._source&&(e["source.json"]={content:t._source}),t._pdf&&t._pdf.data&&t._pdf.data.length){var n=ps(t._pdf.data);if(n.length>100*1024*1024)throw new Error("试卷文件过大（base64 后 "+Math.round(n.length/1048576)+"MB > 100MB Gist 上限）");e["source.pdf.b64"]={content:n}}return e}function ps(t){if(typeof Buffer<"u"&&t&&typeof t!="string")try{return Buffer.from(t).toString("base64")}catch{}var e=t instanceof Uint8Array?t:null;if(!e&&typeof t=="object"&&typeof t.length=="number"&&(e=t),!e)return"";for(var n=32768,s=[],r=0;r<e.length;r+=n)s.push(String.fromCharCode.apply(null,e.subarray?e.subarray(r,r+n):Array.prototype.slice.call(e,r,r+n)));return btoa(s.join(""))}async function _n(t,e){var n=ge();if(!n)return!1;var s=await ds();if(!s)throw new Error("无法确定仓库归属（令牌无效？），请重新保存令牌");var r=await fetch("https://api.github.com/repos/"+s+"/"+lt+"/actions/workflows/"+as+"/dispatches",{method:"POST",headers:{Authorization:"Bearer "+n,Accept:"application/vnd.github+json","Content-Type":"application/json"},body:JSON.stringify({ref:"main",inputs:{gist_id:t,resource_gist_id:e||""}})});if(r.status===204)return!0;throw r.status===401||r.status===403?new Error("执行器令牌无效或缺 workflow 权限（HTTP "+r.status+"）"):r.status===404?new Error("执行器尚未安装（仓库 "+s+"/"+lt+" 里没有 ai-exam.yml），先跑安装器"):new Error("触发失败 HTTP "+r.status)}function Ip(t){return typeof btoa=="function"?btoa(unescape(encodeURIComponent(t))):Buffer.from(t,"utf8").toString("base64")}async function Op(t){if(!window.CLOUDJOB_ASSETS||!window.CLOUDJOB_ASSETS.yml)throw new Error("安装包未随本页构建打入（请用最新构建的页面，或回退手动运行 tools/install_cloudjob.py）");var e=ge();if(!e)throw new Error("先在下方粘贴并保存 GitHub PAT（需 workflow + repo 权限），再点一键安装");t&&t("⏳ 校验令牌…");var n=await fetch("https://api.github.com/user",{headers:{Authorization:"Bearer "+e,Accept:"application/vnd.github+json"}});if(n.status===401)throw new Error("令牌无效（HTTP 401），请重新生成 PAT");var s=n.headers.get("X-OAuth-Scopes")||"";if(s.indexOf("workflow")<0)throw new Error("该令牌缺 workflow 权限（scope: "+(s||"无")+"）。请到 GitHub → Settings → Developer settings → PAT 勾选 workflow 后重新生成");var r=await n.json(),o=Jr(r&&r.login);if(!o)throw new Error("令牌未返回用户名，无法确定仓库归属");var i={Authorization:"Bearer "+e,Accept:"application/vnd.github+json","Content-Type":"application/json"};function a(p){return new Promise(function(d){setTimeout(d,p)})}async function l(){t&&t("🔎 检查仓库 "+o+"/"+lt+"…");var p=await fetch("https://api.github.com/repos/"+o+"/"+lt,{headers:i});if(p.status!==200){if(p.status!==404)throw new Error("检查仓库失败 HTTP "+p.status+"（令牌可能缺 repo 权限）");t&&t("🆕 首次使用：正在你名下创建私有仓库 "+lt+"…");var d=await fetch("https://api.github.com/user/repos",{method:"POST",headers:i,body:JSON.stringify({name:lt,private:!0,auto_init:!0,description:"26考研全能作战系统 · 云端出卷执行器仓库（工具自动创建）"})});if(d.status!==201&&d.status!==202)throw d.status===403?new Error("创建仓库被拒（HTTP 403）：fine-grained PAT 需勾选创建用户仓库的权限，或改用 classic PAT 勾选 repo"):new Error("创建仓库失败 HTTP "+d.status);for(var f=0;f<6;f++){await a(1500);var v=await fetch("https://api.github.com/repos/"+o+"/"+lt+"/contents/README.md?ref=main",{headers:i});if(v.status===200)return}}}await l();async function u(p,d,f){for(var v=0;;v++){var m=null;try{var b=await fetch("https://api.github.com/repos/"+o+"/"+lt+"/contents/"+p+"?ref=main",{headers:i});if(b.status===200){var h=await b.json();m=h.sha}}catch{}t&&t((m?"⬆️ 更新 ":"🆕 新建 ")+p+(v>0?"（第 "+v+" 次重试）":"")+" …");var g=await fetch("https://api.github.com/repos/"+o+"/"+lt+"/contents/"+p,{method:"PUT",headers:i,body:JSON.stringify({message:f,content:Ip(d),branch:"main",sha:m})});if(g.status===200||g.status===201)return;if((g.status===409||g.status>=500)&&v<4){await a(1500*(v+1));continue}throw new Error(p+" 上传失败 HTTP "+g.status+(g.status===404?"（仓库或 main 分支未就绪，稍后重试）":g.status===409?"（分支持续冲突，稍后再试）":""))}}return await u(".github/workflows/ai-exam.yml",window.CLOUDJOB_ASSETS.yml,"ci: install cloud exam runner (workflow)"),await u("tools/cloud/ai-exam-runner.cjs",window.CLOUDJOB_ASSETS.runner,"ci: install cloud exam runner (script)"),t&&t("✅ 执行器已上线（"+o+"/"+lt+"）"),!0}function Sn(t){try{var e=window.Store.get().ai||{},n=e.apis||[],s=null,r=!1;if(t){for(var o=0;o<n.length;o++)if(n[o].id===t){s=n[o],r=!0;break}}if(!s){for(var i=0;i<n.length;i++)if(n[i].id===e.activeApi){s=n[i];break}}if(s=s||(e.endpoint?e:null),s&&s.endpoint&&s.key&&s.model)return{endpoint:s.endpoint,key:s.key,model:s.model,_pinned:r}}catch{}return null}function fs(t){var e=Sn(t);return e&&e._pinned?t:null}function hs(t){var e=Sn(t);return e?{endpoint:e.endpoint,key:e.key,model:e.model}:null}function Hr(t){var e=/RUNNER_VER\s*=\s*'v(\d+)'/.exec(String(t||""));return e?"v"+e[1]:""}function Ce(t){var e=/^v(\d+)$/.exec(String(t||""));return e?parseInt(e[1],10):0}function we(){try{return Hr(window.CLOUDJOB_ASSETS&&window.CLOUDJOB_ASSETS.runner||"")}catch{return""}}async function zr(){var t=ge();if(!t)return{ok:!1,fresh:!1,ver:""};var e=await kn();if(!e)return{ok:!1,fresh:!1,ver:""};var n={Authorization:"Bearer "+t,Accept:"application/vnd.github+json"},s=!1,r="";try{var o=await fetch("https://api.github.com/repos/"+e+"/"+lt+"/contents/.github/workflows/"+as+"?ref=main",{headers:n});if(s=o.status===200,s)try{var i=await o.json();if(i&&i.content){var a=String(i.content).replace(/\s+/g,"");try{r=decodeURIComponent(escape(atob(a)))}catch{try{r=atob(a)}catch{r=""}}}}catch{r=""}}catch{return{ok:!1,fresh:!1,ver:""}}if(!s)return{ok:!1,fresh:!1,ver:""};var l=!1,u="";try{var p=await fetch("https://api.github.com/repos/"+e+"/"+lt+"/contents/tools/cloud/ai-exam-runner.cjs?ref=main",{headers:n});if(p.status===200){var d=await p.json(),f="";if(d&&d.content){var a=String(d.content).replace(/\s+/g,"");try{f=decodeURIComponent(escape(atob(a)))}catch{try{f=atob(a)}catch{f=""}}}u=Hr(f);var v=Ce(u)>0&&Ce(u)>=Ce(we());l=v||/partial\.json/.test(f)&&/function flushPartial/.test(f)&&/TOOLS:python/.test(f)&&/闭环工作/.test(f)&&/x-ratelimit-remaining/.test(f)}}catch{}return{ok:!0,fresh:l,ver:u,workflowYml:r}}function $r(){return!!Sn()}async function Mp(t){if(!us())return{ok:!1,msg:"还没保存执行器令牌（先完成第①步）"};var e=await Qr(Object.assign({check:!0},{}));Jt(e.id,{title:"🧪 配置自检 · "+nt().slice(5,16).replace("T"," ")});try{for(var n=0;n<80;n++){await new Promise(function(l){setTimeout(l,3e3)});var s=null;try{s=await ms(e.id)}catch{}var r=s&&(s.status==="done"||s.status==="error"||s.status==="canceled");if(t&&t(n+1,s||{status:"unknown"}),r){if(s.status==="done")try{var o=(await _e(e.gistId)).data,i=await pe(o.files&&o.files["result.json"]),a=JSON.parse(i);return a&&a.cloudJobCheck?{ok:!0,aiConfigPresent:!!a.aiConfigPresent,msg:s.stageMsg||"自检通过"}:{ok:!1,msg:"自检任务完成但未返回校验标记（执行器可能是旧版，点「一键安装」更新）"}}catch(l){return{ok:!1,msg:"读自检结果失败："+(l.message||l)}}return{ok:!1,msg:"自检失败："+(s.error||s.stageMsg||s.status)}}}return{ok:!1,msg:"自检超时（240s 未完成）。排查：① 执行器是否已装 ② secret 是否配对 ③ Actions 是否被禁用（仓库 Settings→Actions→Actions permissions 勾 Allow）。注：secret 是否存在已可即时探测，此处超时多半是 Actions 未跑起来"}}finally{try{cs(e.id)}catch{}}}async function Pp(){var t=ge();if(!t)return!1;var e=await kn();if(!e)return!1;try{var n=await fetch("https://api.github.com/repos/"+e+"/"+lt+"/actions/secrets",{headers:{Authorization:"Bearer "+t,Accept:"application/vnd.github+json"}});if(n.status!==200)return!1;var s=await n.json(),r=(s&&s.secrets||[]).map(function(o){return o&&o.name});return r.indexOf("CLOUDJOB_GH_TOKEN")>=0}catch{return!1}}async function Np(){if(Lp())return!0;var t=await Pp();return t&&Vr(),t}var Oe=null,Cp=300*1e3;async function Ur(t){if(!t&&Oe&&Date.now()-Oe.at<Cp)return Oe.data;var e=us(),n=e?await kn():"",s=e?await zr():{ok:!1,fresh:!1},r=!!(s&&s.ok),o=n?"https://github.com/"+n+"/"+lt:"https://github.com",i={token:e,repoOwner:n,repoName:lt,runner:r,runnerFresh:!!(s&&s.fresh),runnerVerLocal:we(),runnerVerRemote:s&&s.ver||"",workflowAssetSupported:!!(s&&s.workflowYml&&/resource_gist_id/.test(s.workflowYml)),ai:$r(),secret:await Np(),runnerUrl:o+"/actions",secretsUrl:n?o+"/settings/secrets/actions":""};return Oe={at:Date.now(),data:i},i}var Ht=-1;function Fr(){var t=wn();return(t||"")+"/"+lt}function Kr(){if(!(Ht>=0)){Ht=0;var t=Fr();try{var e=window.Store.get(),n=e.cloudJob&&e.cloudJob.secretCheckedTs>0&&e.cloudJob.secretCheckedRepo===t?e.cloudJob.secretCheckedTs:0,s=0;try{var r=localStorage.getItem(Br);if(r&&r.charAt(0)==="{"){var o=JSON.parse(r);o&&o.ts>0&&o.repo===t&&(s=o.ts)}}catch{}Ht=Math.max(n,s),Ht>0&&Ht>n&&window.Store.update(function(i){i.cloudJob=i.cloudJob||{secretCheckedTs:0},i.cloudJob.secretCheckedTs=Ht,i.cloudJob.secretCheckedRepo=t})}catch{}}}function Lp(){return Kr(),Ht>0}function Vr(){Kr(),Ht=Date.now();var t=Fr();try{localStorage.setItem(Br,JSON.stringify({ts:Ht,repo:t}))}catch{}window.Store.update(function(e){e.cloudJob=e.cloudJob||{secretCheckedTs:0},e.cloudJob.secretCheckedTs=Ht,e.cloudJob.secretCheckedRepo=t})}function gs(t){if(!t||typeof t!="object")return"result 不是对象";if(!Array.isArray(t.questions)||!t.questions.length)return"questions 为空";for(var e=0;e<t.questions.length;e++){var n=t.questions[e];if(!n||!n.stem)return"第"+(e+1)+"题缺题干";if(n.answer==null||n.answer==="")return"第"+(e+1)+"题缺答案";if(n.type==="choice"){if(!Array.isArray(n.options)||n.options.length<2)return"第"+(e+1)+"题选择题缺选项";var s=String(n.answer).trim().charAt(0).toUpperCase(),r=n.options.map(function(o){return String(o||"").trim().charAt(0).toUpperCase()});if(r.indexOf(s)<0)return"第"+(e+1)+"题答案不在选项中"}}return""}function Qs(t){if(!t||typeof t!="object")return"内容不是对象";if(!Array.isArray(t.questions)||!t.questions.length)return"没有可抢救的题目";for(var e=0;e<t.questions.length;e++){var n=t.questions[e];if(!n||!n.stem)return"第"+(e+1)+"题缺题干";if(n.answer==null||n.answer==="")return"第"+(e+1)+"题缺答案";if(n.type==="choice"&&(!Array.isArray(n.options)||n.options.length<2))return"第"+(e+1)+"题选择题缺选项"}return""}function fe(t){if(!t||typeof t!="object")return"导入结果不是对象";if(!Array.isArray(t.questions)||!t.questions.length)return"未识别出任何题目（可能是纯图片无文字层，或文件损坏）";for(var e=0;e<t.questions.length;e++){var n=t.questions[e];if(!n||!n.stem||String(n.stem).trim().length<4)return"第"+(e+1)+"题缺题干";n.type==="choice"&&(!Array.isArray(n.options)||n.options.length<2)&&(n.type="solve")}return""}function ue(t,e,n){n=n||{};var s=ht(t);e.id=e.id||(qt()&&qt().uid?qt().uid():t),e.title=e.title||(n.partial?"☁️ 云端押题卷（抢救）":"云端押题卷"),e.subject=e.subject||s&&s.prefs&&s.prefs.subject||"math",e.createdAt=e.createdAt||nt(),e.builtBy=e.builtBy||"cloud",e.cloudJobId=t,e.completedAt=null,e.score=null,e.duration=null,n.imported&&(e.imported=!0,e.needsReview=!0),n.partial&&(e.partial=!0,e.rescued=!0,e.unreviewed=!n.reviewed,e.timeLimit=e.timeLimit||120,e.totalScore=e.totalScore||(e.questions||[]).reduce(function(o,i){return o+(Number(i.score)||5)},0)),window.Store.update(function(o){o.sprintData=o.sprintData||{},o.sprintData.mockExams=o.sprintData.mockExams||[],o.sprintData.mockExams.some(function(i){return i.cloudJobId===t})||o.sprintData.mockExams.unshift(e)});var r={resultImported:!0,status:"done"};return!n.partial&&s&&Array.isArray(s.log)&&s.log.length>30&&(r.log=s.log.slice(-30)),Jt(t,r),e}async function Qr(t){Ot(),t=t||{};var e=qt()&&qt().uid?qt().uid():"cj"+Date.now()+Math.random().toString(16).slice(2,8),n={id:e,gistId:"",title:"☁️ 云端押题卷 · "+nt().slice(5,16).replace("T"," "),subject:t.subject||"auto",prefs:{subject:t.subject||"auto",diff:t.diff||"mix",count:t.count||"std",think:!!t.think,maxTokens:parseInt(t.maxTokens,10)||null,blueprint:t.blueprint||null,major:t.major||null,check:!!t.check,ai:hs(t.apiId),apiId:fs(t.apiId)},status:"creating",stage:"",stageMsg:"",error:"",wfDispatched:!1,resultImported:!1,createdAt:nt(),submittedAt:nt(),doneAt:""};return dn(n)}async function jp(t){Ot(),t=t||{};var e=t.mother||{},n=Array.isArray(e.questions)?e.questions:[];if(!n.length)throw new Error("母卷没有题目，无法衍生子卷");var s=Ce(we());if(s>0&&s<13)throw new Error("本页面打包的执行器是 "+(we()||"旧版")+"，尚不支持子母卷（需 v13+）。请使用最新构建的页面，或先重新构建并点「🚀 一键安装」。");var r=t.blueprint&&t.blueprint.types&&t.blueprint.types.length?t.blueprint:null;if(!r){var o={};n.forEach(function(d){var f=(d.type||"solve")+"|"+(Number(d.score)||0);o[f]=(o[f]||0)+1}),r={name:"母卷卷型（自动反推）",subject:t.subject||"math",totalScore:Number(e.totalScore)||n.reduce(function(d,f){return d+(Number(f.score)||0)},0),timeLimit:Number(e.timeLimit)||180,types:Object.keys(o).map(function(d){var f=d.split("|");return{type:f[0],count:o[d],score:Number(f[1])||0}})}}var i={1:0,2:0,3:0,4:0,5:0},a={motherTitle:String(e.title||"母卷").slice(0,60),subject:t.subject||r.subject||"math",blueprint:r,questions:n.slice(0,60).map(function(d,f){var v=Math.min(5,Math.max(1,Math.floor(Number(d.star)||3)));return i[v]++,{no:f+1,type:d.type||"solve",score:Number(d.score)||0,star:v,topicName:String(d.topicName||"").slice(0,50),stemDigest:String(d.stem||"").replace(/\s+/g," ").slice(0,80)}}),starMix:(function(){var d=Math.min(n.length,60),f={};return Object.keys(i).forEach(function(v){f[v]=d?Math.round(i[v]/d*100):0}),f})()},l=JSON.stringify(a);if(l.length>400*1024)throw new Error("母卷指纹过大（"+Math.round(l.length/1024)+"KB > 400KB），无法上传");var u=qt()&&qt().uid?qt().uid():"cj"+Date.now()+Math.random().toString(16).slice(2,8),p={id:u,gistId:"",title:"🧬 子卷 · 仿「"+a.motherTitle.slice(0,14)+"」· "+nt().slice(5,16).replace("T"," "),subject:a.subject,prefs:{subject:a.subject,mode:"derive",diff:t.diff||"mix",count:t.count==="lite"||t.count==="full"?t.count:"std",think:!!t.think,maxTokens:parseInt(t.maxTokens,10)||null,blueprint:r,major:t.major||null,deriveNote:String(t.note||"").slice(0,200),motherTitle:a.motherTitle,motherId:t.motherId||null,ai:hs(t.apiId),apiId:fs(t.apiId)},status:"creating",stage:"",stageMsg:"",error:"",wfDispatched:!1,resultImported:!1,isDerive:!0,createdAt:nt(),submittedAt:nt(),doneAt:"",_source:l};return dn(p)}async function qp(t){Ot();var e=Ce(we()),n=t&&t.mode==="book"?30:10,s=t&&t.mode==="book"?"资料库整本导入（需 v30+：书签直拆/2-up裁半/JSON修复）":"试卷导入（需 v10+）";if(e>0&&e<n)throw new Error("本页面打包的执行器是 "+(we()||"旧版")+"，尚不支持"+s+"。请使用最新构建的页面，或先重新构建。");t=t||{};var r=t.data;if(r instanceof ArrayBuffer&&(r=new Uint8Array(r)),!r||!r.length)throw new Error("请先选择要导入的试卷文件");var o=(String(t.fileName||"").toLowerCase().match(/\.(\w+)$/)||[])[1]||"pdf";if(o!=="pdf"&&["png","jpg","jpeg","gif","webp"].indexOf(o)<0)throw new Error("不支持的文件类型：."+o+"（仅支持 PDF 与 png/jpg/jpeg/gif/webp 图片）");var i=qt()&&qt().uid?qt().uid():"cj"+Date.now()+Math.random().toString(16).slice(2,8),a=t&&t.mode==="book",l={id:i,gistId:"",title:(a?"📚 导入资料 · ":"📄 导入试卷 · ")+String(t.fileName||"未命名").slice(0,14)+" · "+nt().slice(5,16).replace("T"," "),subject:t.subject||"math",prefs:{subject:t.subject||"math",mode:t.mode||"import",think:!1,bookTitle:t.bookTitle||null,bookKind:t.bookKind||null,importKind:o==="pdf"?"pdf":"image",fileName:String(t.fileName||""),importTitle:String(t.title||"").slice(0,60)||null,importTimeLimit:parseInt(t.timeLimit,10)>0?parseInt(t.timeLimit,10):null,fillAnswers:t.fillAnswers!==!1,ai:hs(t.apiId),apiId:fs(t.apiId)},status:"creating",stage:"",stageMsg:"",error:"",wfDispatched:!1,resultImported:!1,isImport:!0,srcSize:r.length,srcName:String(t.fileName||""),createdAt:nt(),submittedAt:nt(),doneAt:"",_pdf:{data:r}},u=null;try{u=await Ur()}catch{u=null}var p=!!(u&&u.workflowAssetSupported);if(p){var d={},f=ps(r);if(f.length>100*1024*1024)throw new Error("试卷文件过大（base64 后 "+Math.round(f.length/1048576)+"MB > 100MB Gist 上限）");d["source.pdf.b64"]={content:f};var v={description:"[kaoyan2026] exam-import-asset "+i+" "+(t.fileName||""),public:!1,files:d},m=typeof AbortController<"u"?new AbortController:null,b=typeof(t&&t.onProgress)=="function"?t.onProgress:null,h=0,g=0,A=0,j=-1;try{var E=await St.gistUpload("/gists",v,function(T,C,R){h=T,g=C,A=R,b&&(T===100||T-j>=5)&&(j=T,b(T,C,R,t.fileName||""))},m&&m.signal);if(!E.data||!E.data.id)throw new Error("资源 Gist 创建失败（无法上传试卷源文件）");var P=E.data.id;return l._pdf=null,b&&(b(100,g,A,t.fileName||""),b("stage","🔗 已上传源文件，正在初始化任务…")),dn(l,{assetGistId:P}).then(function(T){return T._pdf=null,b&&b("stage","✅ 任务已派发，等待云端执行器响应…"),T})}catch(T){throw m&&m.signal.aborted?new Error("上传已取消（已传 "+h+"%）"):T}}return dn(l).then(function(T){return delete T._pdf,T})}async function dn(t,e){e=e||{};var n=Gr(t),s=await St.gistReq("/gists",{method:"POST",body:{description:"[kaoyan2026] "+(t.isImport?"exam-import":"cloud-exam-job")+" "+t.id,public:!1,files:n}});if(!s.data||!s.data.id)throw new Error("创建任务 Gist 失败");t.gistId=s.data.id,e.assetGistId&&(t.assetGistId=e.assetGistId);var r=Object.assign({},t);delete r._pdf,window.Store.update(function(i){i.cloudJobs=i.cloudJobs||[],i.cloudJobs.unshift(r),Xr(i.cloudJobs)});try{var o=await _n(t.gistId,e.assetGistId);Jt(t.id,{status:o?"dispatched":"queued",wfDispatched:!!o,stageMsg:o?"已触发云端执行器，排队启动中…":"已排队（执行器未接入，装好后点「重发」即跑）"})}catch(i){if(e.assetGistId)try{await St.gistReq("/gists/"+e.assetGistId,{method:"DELETE"})}catch{}throw Jt(t.id,{status:"error",error:i&&i.message||String(i),stageMsg:"触发失败"}),i}return ht(t.id)}async function Dp(t,e){Ot();var n=ht(t);if(!n||!n.gistId)throw new Error("任务不存在");var s=parseInt(e,10)||n.qs&&n.qs.length||0;if(!s)throw new Error("无法确定目标题量（任务没有蓝图记录），请重新出卷");var r=n.partialCount||n.savedCount||0;if(r>=s)throw new Error("题量已满足（"+r+"/"+s+"），无需续跑；可点「抢救已出题目」直接收卷");await St.gistReq("/gists/"+n.gistId,{method:"PATCH",body:{files:{"job.json":{content:JSON.stringify({ver:1,jobId:n.id,prefs:n.prefs,createdAt:n.createdAt,resume:{target:s,timeLimit:((n.prefs||{}).blueprint||{}).timeLimit||120,from:"partial.json",have:r}},null,1)},"status.json":{content:JSON.stringify({status:"queued",stage:"",msg:"已排队（续跑：补齐剩余 "+(s-r)+" 题）",progress:0,updatedAt:nt()},null,1)}}}});var o=!1;try{o=await _n(n.gistId)}catch(i){throw Jt(t,{status:"error",error:i&&i.message||String(i),stageMsg:"续跑触发失败"}),i}return Jt(t,{status:o?"dispatched":"queued",wfDispatched:!!o,resultImported:!1,error:"",doneAt:"",resumed:!0,resumeTarget:s,resumeHave:r,stage:"",stageMsg:o?"▶️ 续跑已触发：已有 "+r+" 题，补齐至 "+s+" 题":"续跑已排队（执行器未接入，装好后点「重发」即跑）"}),ht(t)}async function Rp(t){Ot();var e=ht(t);if(!e||!e.gistId)throw new Error("任务不存在");try{var n=await _e(e.gistId),s=await pe(n.files&&n.files["log.json"]);if(s){var r=null;try{r=JSON.parse(s)}catch{}if(r&&Array.isArray(r.entries)&&r.entries.length)return r}}catch{}return{entries:e.log||[],error:e.error||null,runnerVer:"",at:"",fallback:!0}}function Xr(t){for(var e={done:1,error:1,canceled:1},n=t.filter(function(o){return e[o.status]});t.length>Ap&&n.length;){var s=n.shift(),r=t.indexOf(s);r>=0&&t.splice(r,1)}}async function ms(t){Ot();var e=ht(t);if(!e||!e.gistId)throw new Error("任务不存在");var n=await _e(e.gistId,Vs[e.gistId]);if(n.status===304)return e;n.etag&&(Vs[e.gistId]=n.etag);var s=n.data,r=await pe(s.files&&s.files["status.json"]),o=null;try{o=JSON.parse(r)}catch{}if(!o)throw new Error("status.json 解析失败");var i={status:o.status||"running",stage:o.stage||"",stageMsg:o.msg||"",updatedAtRemote:o.updatedAt||"",progress:typeof o.progress=="number"?o.progress:null,log:Array.isArray(o.log)?o.log:null,qs:Array.isArray(o.qs)?o.qs:null,partialSaved:!!o.partialSaved,partialCount:typeof o.partialCount=="number"?o.partialCount:null,savedCount:typeof o.savedCount=="number"?o.savedCount:null};return o.status==="done"&&(i.doneAt=o.updatedAt||nt()),o.status==="error"&&(i.error=o.msg||"云端执行失败"),e.updatedAtRemote===i.updatedAtRemote&&e.status===i.status?e:(Jt(t,i),ht(t))}async function Bp(t){var e=bn().filter(function(r){return r.status!=="done"&&r.status!=="error"&&r.status!=="canceled"}),n=await Promise.all(e.map(function(r){return ms(r.id).then(function(){return null}).catch(function(o){return o})})),s=n.filter(Boolean);return s.length&&!(t&&t.silent)&&console.warn("[CloudJob] 刷新失败",s),s}async function Jp(t){Ot();var e=ht(t);if(!e)throw new Error("任务不存在");if(e.resultImported)throw new Error("该任务成果已导入过（去押题卷列表找）");var n=(await _e(e.gistId)).data,s=await pe(n.files&&n.files["result.json"]);if(!s)throw new Error("result.json 还没生成（云端可能仍在写或失败）");var r=null;try{r=JSON.parse(s)}catch{throw new Error("result.json 不是合法 JSON")}if(r&&r.cloudJobPending)throw new Error("成品还没生成（云端可能仍在执行或失败，先刷新状态看看）");if(r&&r.builtBy==="book-import"&&r.book){var o=r.book;if(!o.chapters||!o.chapters.length)throw new Error("book 结果为空（云端提取失败）");if(!Array.isArray(o.groups)){var i={};o.groups=[],(o.chapters||[]).forEach(function(p){var d=p&&p.group||"全册";i[d]||(i[d]={title:d,count:0,qCount:0},o.groups.push(i[d])),i[d].count++,i[d].qCount+=(p.questions||[]).length})}Store.update(function(p){p.studyBooks=p.studyBooks||[],!p.studyBooks.some(function(d){return d.id===o.id})&&(o.importedAt=new Date().toISOString(),p.studyBooks.unshift(o))});var a=ht(t);return a&&(a.resultImported=!0),{book:o}}if(r&&(r.imported||r.builtBy==="pdf-import")){var l=fe(r);if(l)throw new Error("导入卷校验未通过："+l);return r.imported=!0,ue(t,r,{imported:!0})}if(e.prefs&&e.prefs.mode==="book")throw new Error("云端返回的不是资料库整本提取结果（执行器可能是 v30 之前的旧版）——请到配置向导点「🚀 一键安装」升级到 v30+ 后点「♻️ 重发」重跑本任务");var u=gs(r);if(u)throw new Error("成品校验未通过："+u);return ue(t,r,{partial:!1})}async function Gp(t){Ot();var e=ht(t);if(!e)throw new Error("任务不存在");if(e.resultImported)throw new Error("该任务成果已导入过（去押题卷列表找）");var n=(await _e(e.gistId)).data,s=await pe(n.files&&n.files["result.json"]);if(!s)throw new Error("识别结果还没生成（云端可能仍在执行或失败，先刷新状态看看）");var r=null;try{r=JSON.parse(s)}catch{throw new Error("result.json 不是合法 JSON")}if(r&&r.cloudJobPending)throw new Error("识别还没完成（云端可能仍在执行，先刷新状态看看）");if(!(r.imported||r.builtBy==="pdf-import")){var o=!!(e.prefs&&e.prefs.mode==="book");throw new Error(o?"云端返回的不是资料库整本提取结果（执行器可能是 v30 之前的旧版）——请到配置向导点「🚀 一键安装」升级后点「♻️ 重发」重跑本任务":"云端返回的不是导入识别结果（执行器可能是 v9 旧版）——请到配置向导点「🚀 一键安装」升级到 v10 后点「♻️ 重发」重跑本任务")}var i=fe(r);if(i)throw new Error("导入卷校验未通过："+i);return r.imported=!0,r}async function Hp(t,e){Ot();var n=ht(t);if(n&&n.resultImported)throw new Error("该任务成果已导入过（去押题卷列表找）");if(!e||!Array.isArray(e.questions)||!e.questions.length)throw new Error("没有可导入的题目（全部被删？）");var s=fe(e);if(s)throw new Error("修订后仍有题目不完整："+s);return e.imported=!0,ue(t,e,{imported:!0})}async function zp(t){Ot();var e=ht(t);if(!e)throw new Error("任务不存在");if(e.resultImported)throw new Error("该任务成果已导入过（去押题卷列表找）");var n=(await _e(e.gistId)).data,s=n&&n.files||{},r=await pe(s["result.json"]);if(r){var o=null;try{o=JSON.parse(r)}catch{o=null}if(o&&(o.imported||o.builtBy==="pdf-import")&&Array.isArray(o.questions)&&o.questions.length&&!fe(o))return o.imported=!0,ue(t,o,{imported:!0});if(o&&!o.cloudJobPending&&Array.isArray(o.questions)&&o.questions.length&&!Qs(o))return ue(t,o,{partial:!o.chiefReview,reviewed:!!o.chiefReview})}var i=await pe(s["partial.json"]);if(!i)throw new Error("云端没落盘任何题目（执行器在第一题出完前就失败了/或用的是旧版执行器）。旧版执行器不落盘，需在「🛠 配置向导」点一次「🚀 一键安装」升级后再出卷。");var a=null;try{a=JSON.parse(i)}catch{throw new Error("partial.json 不是合法 JSON")}if(!a||!Array.isArray(a.questions)||!a.questions.length)throw new Error("云端已落盘 0 题（partial.json 为空）——执行器一道题都没出成功。");if(a.imported){var l=fe({questions:a.questions});if(l)throw new Error("导入抢救卷校验未通过："+l);var u={title:"📄 导入试卷（抢救 · "+a.questions.length+" 题）",subject:a.subject||e.prefs&&e.prefs.subject||"math",timeLimit:120,totalScore:a.questions.reduce(function(f,v){return f+(Number(v.score)||5)},0),questions:a.questions,imported:!0,builtBy:"pdf-import",generatedAt:a.updatedAt||nt()};return ue(t,u,{imported:!0})}var p=Qs(a);if(p)throw new Error("抢救卷校验未通过："+p);var d={title:"☁️ 云端押题卷（抢救 · "+a.questions.length+" 题）",subject:a.subject||e.prefs&&e.prefs.subject||"math",timeLimit:120,totalScore:a.questions.reduce(function(f,v){return f+(Number(v.score)||5)},0),questions:a.questions,builtBy:"cloud-rescue",generatedAt:a.updatedAt||nt()};return ue(t,d,{partial:!0,reviewed:!!a.reviewed})}async function $p(t,e){Ot(),e=e||{};var n=ht(t);if(!n||!n.gistId)throw new Error("任务不存在");if(n.status==="done")throw new Error("任务已完成，无需取消");var s={"cancel.json":{content:JSON.stringify({canceled:!0,savePartial:e.savePartial!==!1,at:nt()})},"status.json":{content:JSON.stringify({status:"canceled",stage:"",msg:e.savePartial!==!1?"⏹ 正在停止，已出题目尝试保存…":"⏹ 已停止",progress:0,updatedAt:nt()})}};await St.gistReq("/gists/"+n.gistId,{method:"PATCH",body:{files:s}}),Jt(t,{status:"canceled",stageMsg:"已停止"+(e.savePartial!==!1?"（云端整理已出题目中…）":"")})}async function Up(t){Ot();var e=ht(t);if(!e||!e.gistId)throw new Error("任务不存在");await St.gistReq("/gists/"+e.gistId,{method:"PATCH",body:{files:{"status.json":{content:JSON.stringify({status:"queued",stage:"",msg:"重新入队",progress:0,updatedAt:nt()})},"result.json":{content:JSON.stringify({cloudJobPending:!0})},"cancel.json":{content:JSON.stringify({canceled:!1,at:nt()})}}}}),Jt(t,{status:"dispatching",error:"",resultImported:!1,retryAt:nt()});try{var n=await _n(e.gistId);Jt(t,{status:n?"dispatched":"queued",wfDispatched:!!n,stageMsg:n?"已重新触发执行器":"已排队（执行器未接入）"})}catch(s){throw Jt(t,{status:"error",error:s&&s.message||String(s)}),s}return ht(t)}async function Wr(t){Ot();var e=ht(t);if(e&&e.gistId)try{await St.gistReq("/gists/"+e.gistId,{method:"DELETE"})}catch(n){if(n.status!==404)throw n}if(e&&e.assetGistId)try{await St.gistReq("/gists/"+e.assetGistId,{method:"DELETE"})}catch(n){n.status}cs(t)}async function Fp(){for(var t=bn().slice(),e=0,n=0;n<t.length;n++){try{await Wr(t[n].id)}catch{try{cs(t[n].id)}catch{}}e++}return Store.update(function(s){s.cloudJobs=[]}),e}var pn={planning:"🧠 总工规划中",generating:"⚙️ 并发出题中",validating:"📐 蓝本校验中",reviewing:"🔍 总审查中",rewriting:"🔧 定向重写中",finalizing:"✅ 终检打包中",parsing:"🧾 解析试卷中",extracting:"🔎 AI 拆题识别中"},Kp=["planning","generating","reviewing","rewriting","finalizing"],xn={creating:{label:"创建中",cls:"#8c8c8c"},queued:{label:"已排队",cls:"#d46b08"},dispatched:{label:"已派发",cls:"#096dd9"},running:{label:"执行中",cls:"#722ed1"},done:{label:"✅ 完成",cls:"#237804"},error:{label:"🔴 失败",cls:"#cf1322"},canceled:{label:"已取消",cls:"#8c8c8c"}};function Yr(t){if(t.stage&&pn[t.stage])return pn[t.stage];var e=xn[t.status]||{label:t.status||"?"};return e.label}function Zr(t){var e=xn[t.status];return e?e.cls:"#8c8c8c"}const Vp={submit:Qr,submitImport:qp,submitDerive:jp,refresh:ms,refreshAll:Bp,collectResult:Jp,collectPartial:zp,collectImportPreview:Gp,confirmImportExam:Hp,cancel:$p,retry:Up,remove:Wr,clearAll:Fp,resumeJob:Dp,fetchLog:Rp,installRunner:Op,getSetup:Ur,runCheck:Mp,markSecretChecked:Vr,aiReady:$r,aiConfig:Sn,list:bn,find:ht,getToken:ge,setToken:Ep,hasToken:us,repoOwner:wn,resolveOwner:ds,resolveOwnerSafe:kn,repoFull:Tp,dispatch:_n,runnerInstalled:zr,REPO_NAME:lt,WF_FILE:as,STAGE_CN:pn,STAGE_ORDER:Kp,STATUS_META:xn,stageLabel:Yr,statusColor:Zr,validateResultExam:gs,validateImportedExam:fe};typeof module<"u"&&module.exports&&(module.exports={_pure:{validateResultExam:gs,validateImportedExam:fe,gistFiles:Gr,u8ToB64:ps,stageLabel:Yr,statusColor:Zr,trimJobs:Xr,STATUS_META:xn,STAGE_CN:pn}});const ys={ensurePermission(){if(!("Notification"in window))return!1;if(Notification.permission==="default")try{Notification.requestPermission()}catch{}return Notification.permission==="granted"},send(t,e){if(ys.ensurePermission())try{new Notification(t,{body:e});return}catch{}X.show("🔔 "+t+"："+e,"info",5e3)}},zn=30,Qp=700;function xt(){const t=M.get();return t.aiMemory||(t.aiMemory={profile:"",facts:[],reflectCount:0,updatedAt:""}),t.aiMemory.facts||(t.aiMemory.facts=[]),t.aiMemory}function ke(t){return(t||"").replace(/\s+/g,"").slice(0,60)}function Xs(t){return(t.pinned?1e4:0)+(t.hits||1)*10+Math.min(9,Math.floor((Date.now()-new Date(t.updatedAt||t.createdAt).getTime())/O.DAY_MS)*-1)}function An(t){return t.slice().sort(function(e,n){return Xs(n)-Xs(e)})}function Xp(t){if(t.facts.length<=zn)return;const n=An(t.facts).slice(0,zn),s={};n.forEach(function(r){s[r.id]=!0}),t.facts=t.facts.filter(function(r){return s[r.id]})}function vs(t,e,n,s){if(t=(t||"").trim(),!t||t.length<4)return null;t.length>80&&(t=t.slice(0,80));const r=new Date().toISOString();let o=null;return M.update(function(i){const a=xt(),l=ke(t);for(let p=0;p<a.facts.length;p++){const d=a.facts[p];if(s&&d.sigKey===s||ke(d.text)===l){d.text=t,d.hits=(d.hits||1)+1,d.updatedAt=r,e&&(d.kind=e),o=d,a.updatedAt=r;return}}const u={id:O.uid(),text:t,kind:e||"context",hits:1,createdAt:r,updatedAt:r,pinned:!1,source:n||"ai"};s&&(u.sigKey=s),a.facts.push(u),Xp(a),a.updatedAt=r,o=u}),o}function to(t){const e=ke(t);if(!e)return!1;let n=!1;return M.update(function(s){const r=xt();r.facts.forEach(function(o){(ke(o.text)===e||o.text.indexOf(e.slice(0,12))>=0)&&(o.hits=(o.hits||1)+1,o.updatedAt=new Date().toISOString(),n=!0)}),n&&(r.updatedAt=new Date().toISOString())}),n}function Wp(t){M.update(function(e){const n=xt();n.facts=n.facts.filter(function(s){return s.id!==t}),n.updatedAt=new Date().toISOString()})}function Yp(t){M.update(function(e){xt().facts.forEach(function(s){s.id===t&&(s.pinned=!s.pinned)})})}function eo(t){M.update(function(e){const n=xt();n.profile=(t||"").slice(0,400),n.updatedAt=new Date().toISOString()})}function Zp(t){t=t||Qp;const e=xt();let n="";e.profile&&(n+="【考生画像】"+e.profile+`
`);const s=An(e.facts);let r=n.length;const o=[];for(let i=0;i<s.length;i++){const a="- "+s[i].text;if(r+a.length+1>t)break;o.push(a),r+=a.length+1}return o.length&&(n+=`【关于考生的记忆】
`+o.join(`
`)+`
请在回复中体现你对他的了解，但不要机械复述记忆条目。`),n.trim()}function tf(){try{const t=M.get(),e=M.mistakeCountWeek("sign");Mt("sig-sign",e>=3?"近期符号错误频发（本周"+e+"次），做题需强制验算":null,"weakness");const n=M.weekTopMistakes(),s={sign:"符号错误",fraction:"分式处理",integral:"积分",concept:"概念不清",careless:"粗心",other:"其他"};Mt("sig-toperr",n&&n.length&&n[0].count>=2?"本周主要错误类型是「"+(s[n[0].key]||n[0].key)+"」（"+n[0].count+"次）":null,"weakness");const r=M.currentMathAccuracy();Mt("sig-acc",r!=null&&r<70?"当前数学正确率仅"+r+"%，低于安全线70%":null,"weakness");const o=M.weekHours();if(o.filter(function(f){return f>0}).length>=2){const f=O.round1(O.sum(o)/7),v=(t.settings.weeklyTargetHours||50)/7;Mt("sig-pace",f<v*.7?"本周日均学习"+f+"h，明显低于目标"+O.round1(v)+"h":null,"habit")}M.subjectDoneInDays("math",3)?Me("sig-idle-math"):Mt("sig-idle-math","已连续3天没有完成数学任务","habit"),M.subjectDoneInDays("ctrl",3)?Me("sig-idle-ctrl"):Mt("sig-idle-ctrl","已连续3天没有碰专业课","habit");const a=(t.mental||[]).slice(-3);a.length>=3&&a.every(function(f){return f.mood<=5})?Mt("sig-mood","近3天心情持续偏低（≤5分），需要关注状态","habit"):Me("sig-mood"),t.weaknessProfile&&t.weaknessProfile.weakAreas&&t.weaknessProfile.weakAreas.length?Mt("sig-weakareas","拍题暴露的薄弱点："+t.weaknessProfile.weakAreas.slice(0,3).join("、"),"weakness"):Me("sig-weakareas");const l=nf();let u=null,p=0;Object.keys(l).forEach(function(f){l[f]>p&&(p=l[f],u=f)}),Mt("sig-strength",p>=3?"本周在"+(ef[u]||u)+"上投入最多（完成"+p+"项任务）":null,"habit");const d=M.studyStreak();Mt("sig-streak",d>=3?"已连续学习"+d+"天，节奏稳定":null,"habit")}catch{}}function Mt(t,e,n){if(!e){Me(t);return}vs(e,n,"system",t)}function Me(t){M.update(function(e){const n=xt();n.facts=n.facts.filter(function(s){return s.sigKey!==t})})}const ef={math:"数学",ctrl:"专业课",eng:"英语",pol:"政治"};function nf(){const t=M.get(),e={math:0,ctrl:0,eng:0,pol:0};return O.weekKeys().forEach(function(n){if(n===O.dkey()){const s=t.completions[n]||[];t.tasks.forEach(function(r){e[r.subject]!=null&&(r.done||s.indexOf(r.id)>=0)&&e[r.subject]++})}else(t.taskArchive[n]||[]).forEach(function(s){e[s.subject]!=null&&s.done&&e[s.subject]++})}),e}function bs(){try{const t=M.get(),e=O.dkey();let n=0;(t.polRecite||[]).forEach(function(r){r.due&&r.due<=e&&n++}),(t.vocab||[]).forEach(function(r){r.due&&r.due<=e&&n++});const s=t.reading&&t.reading.cards||{};return Object.keys(s).forEach(function(r){s[r].due&&s[r].due<=e&&n++}),n}catch{return 0}}function sf(t){t=t||{};const e=t.exclude||[];try{let n=function(d,f,v,m,b){o||!f||e.indexOf(d)>=0||(o={key:d,tab:m,preset:v,action:{type:"goto",tab:m,label:b}})};const s=M.get(),r=M.studyStreak()>0||Object.keys(s.completions||{}).length>0||s.tasks&&s.tasks.length>0;let o=null;r&&(n("idle-math",!M.subjectDoneInDays("math",3),"已经三天没碰数学了。今天必须补上，先两道真题找手感，别再拖。","scheduler","→ 现在去补数学"),n("idle-ctrl",!o&&!M.subjectDoneInDays("ctrl",3),"专业课冷了三天。核心考点最忌断档，今天固定一小时把它捡回来。","scheduler","→ 去捡专业课"));const i=bs();n("due-backlog",i>=8,"你有 "+i+" 项复习到期了。记忆不复习就是白学，先清一批到期的。","dashboard","→ 去清到期复习");const a=M.currentMathAccuracy();n("low-acc",a!=null&&a<70,"数学正确率还在 "+a+"%，低于安全线。别刷新题，回头把错题按类型吃透。","mistakes","→ 去吃透错题");const l=(s.mental||[]).slice(-3);n("low-mood",l.length>=3&&l.every(function(d){return d.mood<=5}),"连着几天状态都不高。别硬扛，把今天目标砍到能完成，稳住比冲刺重要。","mental","→ 去记录状态");const u=M.weekHours();if(u.filter(function(d){return d>0}).length>=2){const d=O.round1(O.sum(u)/7),f=(s.settings.weeklyTargetHours||50)/7;n("slow-pace",d<f*.7,"本周日均才 "+d+" 小时，离目标差一截。今天多挤一个番茄钟出来。","focus","→ 去挤一个番茄钟")}if(new Date().getHours()>=18){const d=M.todayTaskStats();let f=0,v=0;Object.keys(d).forEach(function(m){f+=d[m][0],v+=d[m][1]}),n("late-undone",v>0&&f*2<v,"都这个点了今天任务还没过半。挑最重要的两件先干完，别让今天空过。","scheduler","→ 去挑两件干完")}return o}catch{return null}}const Ws={"idle-math":"补数学","idle-ctrl":"捡专业课","due-backlog":"清到期复习","low-acc":"吃透错题","low-mood":"关注状态","slow-pace":"加时长","late-undone":"晚间清任务","ai-daily":"AI全智能建议"};function ws(){const t=M.get();return t.ai.superviseLog||(t.ai.superviseLog=[]),t.ai.superviseLog}function rf(t,e,n){M.update(function(s){for(s.ai.superviseLog||(s.ai.superviseLog=[]),s.ai.superviseLog.push({date:t,key:e,slot:n||"am",outcome:null});s.ai.superviseLog.length>14;)s.ai.superviseLog.shift();s.ai.lastSupervise={date:t,key:e,slot:n||"am"}})}function Ys(t,e){const n=M.get();if(t===O.dkey()){const s=n.completions[t]||[];return n.tasks.some(function(r){return r.subject===e&&(r.done||s.indexOf(r.id)>=0)})}return(n.taskArchive[t]||[]).some(function(s){return s.subject===e&&s.done})}function of(t){const e=M.get();if(t===O.dkey()){const s=M.todayTaskStats();let r=0,o=0;return Object.keys(s).forEach(function(i){r+=s[i][0],o+=s[i][1]}),o?r/o:null}const n=e.taskArchive[t]||[];return n.length?n.filter(function(s){return s.done}).length/n.length:null}function af(){const t=ws();let e=null;for(let s=t.length-1;s>=0;s--)if(t[s].outcome==null&&t[s].date!==O.dkey()){e=t[s];break}if(!e)return null;let n=null;try{switch(e.key){case"idle-math":n=Ys(e.date,"math");break;case"idle-ctrl":n=Ys(e.date,"ctrl");break;case"due-backlog":n=bs()<=4;break;case"low-acc":{const s=M.currentMathAccuracy();s!=null?n=s>=70:n=(M.get().quizHistory||[]).some(function(r){return O.isoDay(r.createdAt)>=e.date});break}case"low-mood":{const s=(M.get().mental||[]).slice(-1)[0];n=s?s.mood>=6:null;break}case"slow-pace":{const s=M.get().studyHours[e.date]||0;n=s>=4?!0:s>0?!1:null;break}case"late-undone":{const s=of(e.date);n=s==null?null:s>=.5;break}default:{const s=M.get(),r=s.studyHours[e.date]||0,o=(s.completions[e.date]||[]).length,i=(s.mental||[]).some(function(a){return a.date===e.date});n=r>0||o>0||i?!0:null}}}catch{n=null}return n!=null&&(M.update(function(s){(s.ai.superviseLog||[]).forEach(function(r){r.date===e.date&&r.key===e.key&&r.slot===e.slot&&(r.outcome=n)})}),e.outcome=n,n===!0?Mt("sig-sv-react","对督学有回应：被督促「"+(Ws[e.key]||e.key)+"」后执行了","preference"):no().indexOf(e.key)>=0&&Mt("sig-sv-mute-"+e.key,"对「"+(Ws[e.key]||e.key)+"」类督促反复无行动，唠叨无效，换角度或暂放","preference")),e}function no(){const t={};return ws().forEach(function(e){e.outcome===!1&&(t[e.key]=(t[e.key]||0)+1)}),Object.keys(t).filter(function(e){return t[e]>=2})}function lf(){try{const t=M.get();if(!K.configured()||t.ai.memAuto===!1)return!1;const e=xt().lastConsolidate;return e?Date.now()-new Date(e).getTime()>=7*O.DAY_MS:!0}catch{return!1}}function cf(){return'你是考研教练的“记忆官”，现在做每周记忆巩固。基于考生的全部长期记忆与画像，做一次去冗余与升华。只输出 JSON，不要多余文字、不要 markdown 代码块。格式：{"add":[{"text":"新提炼的稳定规律(≤40字)","kind":"weakness|habit|preference|goal|context|pattern"}],"reinforce":["值得强化保留的记忆原文片段"],"remove":["重复/过时/太琐碎应删除的记忆原文片段"],"profile":"重写后的考生画像一段话(≤140字，更立体：弱点·习惯·偏好·最佳状态·目标)"}。规则：1) 合并语义重复项，只留最凝练一条；2) remove 一次性或已过时的；3) add 最多3条真正跨周有用的规律；4) 简体中文。'}function Zs(){M.update(function(t){t.aiMemory.lastConsolidate=O.dkey()})}function uf(){if(!K.configured())return Promise.resolve(!1);const t=xt(),e=An(t.facts);if(!e.length&&!t.profile)return Zs(),Promise.resolve(!1);const n="【当前画像】"+(t.profile||"（空）")+`
【全部记忆事实】
`+e.map(function(s){return"- ["+(s.kind||"context")+"] "+s.text+"（命中"+(s.hits||1)+"）"}).join(`
`);return K.chatJSON(cf(),n,null,{noTools:!0}).then(function(s){return ro(s),Zs(),!0}).catch(function(){return!1})}function df(){return'你是一名考研教练的"记忆官"。根据教练与考生的最近对话和已有记忆，提取值得长期记住的事实。只输出 JSON，不要多余文字、不要 markdown 代码块。格式：{"add":[{"text":"一句话事实(≤40字)","kind":"weakness|habit|preference|goal|context"}],"reinforce":["已有记忆中被再次验证的原文片段"],"remove":["已过时/被纠正的记忆原文片段"],"profile":"重写后的考生画像一段话(≤120字，融合新旧认知，无变化则原样返回)"}。规则：1) 只沉淀稳定的、跨会话有用的认知（弱点/习惯/偏好/目标/背景），不要记录一次性闲聊；2) add 最多3条，宁缺毋滥；3) reinforce/remove 引用【已有记忆】中的原文；4) 简体中文。'}function so(t){const e=M.get();if(!K.configured()||e.ai.memAuto===!1||!t||t.length<30)return Promise.resolve(!1);const n=xt(),s=n.facts.map(function(o){return o.text}).slice(0,30),r="【当前画像】"+(n.profile||"（空）")+`
【已有记忆】
`+(s.length?s.map(function(o){return"- "+o}).join(`
`):"（无）")+`
【最近对话】
`+t.slice(-3e3);return K.chatJSON(df(),r,null,{noTools:!0}).then(function(o){return ro(o),M.update(function(i){i.aiMemory.reflectCount=(i.aiMemory.reflectCount||0)+1}),!0}).catch(function(){return!1})}function ro(t){t&&(t.profile&&typeof t.profile=="string"&&eo(t.profile),(t.add||[]).slice(0,3).forEach(function(e){e&&e.text&&vs(e.text,e.kind||"context","ai")}),(t.reinforce||[]).slice(0,5).forEach(function(e){e&&to(e)}),(t.remove||[]).slice(0,5).forEach(function(e){if(!e)return;const n=ke(e);M.update(function(s){const r=xt();r.facts=r.facts.filter(function(o){return ke(o.text)!==n&&o.text.indexOf(n.slice(0,12))<0})})}))}let Le=[];function pf(t,e){const n="["+O.hm()+"] "+t+(e?"："+e:"");Le.push(n),Le.length>=4&&oo()}function oo(){if(!Le.length)return;const t=`考生近期行为事件：
`+Le.join(`
`);Le=[],so(t)}function ff(){const t=xt();return{facts:t.facts.length,pinned:t.facts.filter(function(e){return e.pinned}).length,aiFacts:t.facts.filter(function(e){return e.source==="ai"}).length,hasProfile:!!t.profile,reflectCount:t.reflectCount||0,updatedAt:t.updatedAt||""}}const We={MAX_FACTS:zn,digest:Zp,addFact:vs,reinforceByText:to,removeFact:Wp,togglePin:Yp,setProfile:eo,syncLocalSignals:tf,dueBacklog:bs,superviseSuggestion:sf,logSupervise:rf,evalLastOutcome:af,mutedSuperviseKeys:no,superviseLog:function(){return ws().slice()},consolidateDue:lf,weeklyConsolidate:uf,reflect:so,recordEvent:pf,flushEvents:oo,stats:ff,list:function(){return An(xt().facts)},profile:function(){return xt().profile||""}},io={scoreToLevel(t){return t=+t,isNaN(t)?0:t>=80?2:t>=50?1:0},effScore(t){return t?typeof t.score=="number"&&!isNaN(t.score)?Math.round(t.score):t.level===2?85:t.level===1?60:t.level===0?30:null:null},recordAnswer(t){if(!t||!t.topicId||typeof t.score!="number")return;const e=io.scoreToLevel(t.score),n=new Date().toISOString();M.update(function(s){if(s.heat=s.heat||{},s.heat[t.topicId]={level:e,score:t.score,updatedAt:n},s.heatHistory=s.heatHistory||{},s.heatHistory[t.topicId]=s.heatHistory[t.topicId]||[],s.heatHistory[t.topicId].push({score:t.score,level:e,at:n}),s.heatHistory[t.topicId].length>30&&(s.heatHistory[t.topicId]=s.heatHistory[t.topicId].slice(-30)),!t.noMistake&&t.score<80&&t.errorType&&t.errorType!=="none"){const r=t.sourceLabel||"测验";M.addMistake({subject:t.subject||"math",type:t.errorType,desc:"【"+r+"】"+t.topicName+"："+(t.comment||"作答有误"),stem:t.stem||"",options:Array.isArray(t.options)?t.options:[],answer:t.answer,solution:t.solution||"",trap:t.trap||"",refId:t.topicId,source:t.source||"quiz",dedupKey:(t.source||"quiz")+":"+t.topicId+":"+O.shortDate()})}if(t.tier===1&&t.score<(t.penaltyBelow!=null?t.penaltyBelow:90)){const r=t.penaltyCount||5;s.mistakeDrills=s.mistakeDrills||[];for(let o=0;o<r;o++)s.mistakeDrills.push({id:O.uid(),source:"topic",refId:t.topicId,title:"【罚练】"+t.topicName+" 同类题 "+(o+1)+"/"+r,subject:t.subject||"math",status:"pending",penaltyOf:t.topicId,createdAt:n})}s.quizHistory=s.quizHistory||[],s.quizHistory.push({id:O.uid(),topicId:t.topicId,topicName:t.topicName,score:t.score,verdict:t.verdict||"",date:O.shortDate(),createdAt:n,source:t.source||"quiz"}),s.quizHistory.length>100&&(s.quizHistory=s.quizHistory.slice(-100))});try{M.recomputeMathAccuracy&&M.recomputeMathAccuracy()}catch{}}},ao={},G=ao;G.LATEX_RULE="【LaTeX 格式硬约束】所有数学公式必须用标准 LaTeX 反斜杠命令（如 \\frac{a}{b}、\\int_a^b、\\pi、\\sqrt{x}、\\sin x、\\begin{vmatrix}…\\end{vmatrix}、\\begin{cases}…\\end{cases}），**严禁用 | 竖线代替反斜杠**。矩阵用 \\begin{vmatrix}/\\begin{bmatrix} 环境，分段函数用 \\begin{cases} 环境，公式用 $…$ 包裹。【格式细节】① 带参数命令必须用花括号：\\frac{1}{t^3}（严禁漏花括号写成 \\frac1t3），\\mathbb{E}[X]（严禁 \\mathbbE），\\operatorname{rank}(A)；② 上下标必带花括号：e^{-x}（严禁 e-x），x^{2}、A^3-3A^2+3A（指数超过一位必带 {}）；③ 区间/属于用 \\in（**严禁 \\ln**——对数 \\ln 不是属于！），\\to（**严禁裸 \\to**——必须双反斜杠或写作 \\to），\\Leftrightarrow，\\geqslant/\\leqslant；④ 微分写作 \\mathrm{d}x 或直接 dx，禁写成 |dx（|dx 是 pipe 不会渲染）。";G.SUBJ_NAME={math:"数学",ctrl:"专业课",eng:"英语",pol:"政治"};G.SUBJ_ORDER=["math","ctrl","eng","pol"];G.starToDiff=function(t){var e=Math.max(1,Math.min(5,Math.floor(Number(t)||3)));return e<=2?"easy":e===3?"medium":"hard"};G.starOf=function(t){var e=Number(t&&t.star);return e>=1&&e<=5?Math.round(e):{easy:2,medium:3,hard:5}[t&&t.diff||"medium"]||3};G.forceStarMix=function(t,e){if(!e||!t||!t.length)return t;for(var n=t.length,s={1:0,2:0,3:0,4:0,5:0},r=0,o=n,i=1;i<=5;i++){var a=Number(e[i])||0;if(a>0&&o>0){var l=Math.round(n*a/100);l>o&&(l=o),s[i]=l,r+=l,o-=l}}r<n&&(s[3]+=n-r);for(var u={},p=1;p<=5;p++)u[p]=[];t.forEach(function(j,E){u[G.starOf(j)]=u[G.starOf(j)]||[],u[G.starOf(j)].push(E)});for(var d=1;d<=5;d++){for(var f=s[d],v=u[d]||[],m=0,b=0;b<v.length&&m<f;b++)t[v[b]].star=d,m++;for(;m<f;)if(u[3]&&u[3].length){var h=u[3].shift();if(h!=null)t[h].star=d,m++;else break}else if(u[4]&&u[4].length){var g=u[4].shift();if(g!=null)t[g].star=d,m++;else break}else if(u[2]&&u[2].length){var A=u[2].shift();if(A!=null)t[A].star=d,m++;else break}else break}return t.forEach(function(j){j.diff=G.starToDiff(G.starOf(j))}),t};G.forceDiff=function(t,e,n){if(n&&typeof G.forceStarMix=="function")return G.forceStarMix(t,n);var s=e==="hard"?.7:e==="superhard"?1:.4,r=Math.round(t.length*s),o=[],i=[],a=[];for(t.forEach(function(d,f){var v=G.starOf(d);v>=4?o.push(f):v===3?i.push(f):a.push(f)});o.length<r&&(i.length||a.length);){var l=i.length?i.shift():a.shift();t[l].star=4,o.push(l)}for(;o.length>r;){var u=o.filter(function(d){return G.starOf(t[d])===4});if(u.length||(u=o.filter(function(d){return G.starOf(t[d])>=5})),!u.length)break;var p=u[0];t[p].star=3,o.splice(o.indexOf(p),1)}return t.forEach(function(d){d.star=G.starOf(d),d.diff=G.starToDiff(d.star)}),t};var lo={choice:"选择题",fill:"填空题",solve:"解答题",essay:"写作题"};G.bpTypeName=function(t){return lo[t]||"解答题"};G.BLUEPRINT_PRESETS={shuyi:{name:"数一标准卷",subject:"math",totalScore:150,timeLimit:180,types:[{type:"choice",count:10,score:4},{type:"fill",count:6,score:4},{type:"solve",count:6,score:0}],starMix:{1:5,2:20,3:35,4:30,5:10}},shu2:{name:"数二标准卷",subject:"math",totalScore:150,timeLimit:180,types:[{type:"choice",count:10,score:4},{type:"fill",count:6,score:4},{type:"solve",count:6,score:0}],starMix:{1:8,2:22,3:35,4:25,5:10}},shu3:{name:"数三标准卷",subject:"math",totalScore:150,timeLimit:180,types:[{type:"choice",count:10,score:3},{type:"fill",count:10,score:3},{type:"solve",count:5,score:0}],starMix:{1:10,2:25,3:40,4:20,5:5}},yingyi:{name:"英语一标准卷",subject:"eng",totalScore:100,timeLimit:180,types:[{type:"fill",count:5,score:1},{type:"choice",count:10,score:2},{type:"essay",count:2,score:15},{type:"solve",count:1,score:0}],starMix:{1:5,2:20,3:40,4:30,5:5}},ying2:{name:"英语二标准卷",subject:"eng",totalScore:100,timeLimit:180,types:[{type:"fill",count:10,score:1},{type:"choice",count:15,score:2},{type:"essay",count:2,score:15},{type:"solve",count:1,score:0}],starMix:{1:8,2:22,3:40,4:25,5:5}},ctrl:{name:"专业课标准卷",subject:"ctrl",totalScore:150,timeLimit:180,types:[{type:"choice",count:20,score:1},{type:"fill",count:10,score:2},{type:"solve",count:6,score:0}],starMix:{1:10,2:20,3:35,4:30,5:5}},pol:{name:"政治标准卷",subject:"pol",totalScore:100,timeLimit:180,types:[{type:"choice",count:16,score:1},{type:"choice",count:17,score:2,label:"多选题"},{type:"solve",count:5,score:0}],starMix:{1:10,2:25,3:40,4:20,5:5}}};G.SUBJ_TO_PRESET={math:"shuyi",ctrl:"ctrl",eng:"yingyi",pol:"pol"};G.normalizeBlueprint=function(t,e){t=t&&typeof t=="object"?t:{};var n=G.BLUEPRINT_PRESETS[G.SUBJ_TO_PRESET[e]||"shuyi"]||G.BLUEPRINT_PRESETS.shuyi,s={preset:typeof t.preset=="string"?t.preset:G.SUBJ_TO_PRESET[e]||"custom",name:t.name||n.name,subject:t.subject||e||n.subject,totalScore:Math.max(10,Math.min(300,Number(t.totalScore)||n.totalScore)),timeLimit:Math.max(10,Math.min(600,Number(t.timeLimit)||n.timeLimit)),types:[],starMix:{},topicMode:t.topicMode==="manual"?"manual":"auto",topics:Array.isArray(t.topics)?t.topics.map(String).filter(Boolean).slice(0,30):[],volume:t.volume==="lite"||t.volume==="full"?t.volume:"std",updatedAt:t.updatedAt||""},r=Array.isArray(t.types)&&t.types.length?t.types:n.types;r.forEach(function(v){if(v){var m={choice:"choice",fill:"fill",solve:"solve",essay:"essay"}[v.type]||"solve",b=Math.max(0,Math.min(60,Math.floor(Number(v.count)||0)));if(b){var h=Number(v.score);h>=0&&h<=100||(h=0),s.types.push({type:m,label:String(v.label||lo[m]),count:b,score:h})}}}),s.types.length||(s.types=JSON.parse(JSON.stringify(n.types)));for(var o=t.starMix&&typeof t.starMix=="object"?t.starMix:n.starMix,i=0,a=1;a<=5;a++){var l=Math.max(0,Math.min(100,Math.round(Number(o[a])||0)));s.starMix[a]=l,i+=l}if(i!==100){for(var u=i>0?s.starMix:n.starMix,p=i>0?i:100,d=0,f=1;f<=5;f++)s.starMix[f]=Math.round((u[f]||0)/p*100),d+=s.starMix[f];s.starMix[3]+=100-d}return s};G.bpQuestionCount=function(t){return(t.types||[]).reduce(function(e,n){return e+(n.count||0)},0)};G.bpAutoScores=function(t){var e=0,n=0;(t.types||[]).forEach(function(u){u.score>0?e+=u.count*u.score:n+=u.count});var s=Math.max(0,(t.totalScore||100)-e);if(!n)return[];for(var r=Math.floor(s/n*2)/2,o=[],i=0;i<n;i++)o.push(r);for(var a=Math.round((s-r*n)*2)/2,l=n-1;l>=0&&a>0;l--)o[l]+=.5,a-=.5;return o};G.blueprintCheck=function(t,e){var n=[],s=t.questions||[],r=s.length,o=G.bpQuestionCount(e);r!==o&&n.push("题量不符：蓝图 "+o+" 题，实际 "+r+" 题");var i={choice:0,fill:0,solve:0,essay:0};if(s.forEach(function(f){i[f.type]=(i[f.type]||0)+1}),(e.types||[]).forEach(function(f){var v=i[f.type]||0;v!==f.count&&n.push(f.label+"题量：蓝图 "+f.count+"，实际 "+v)}),e.starMix){var a={1:0,2:0,3:0,4:0,5:0};s.forEach(function(f){var v=G.starOf(f);a[v]=(a[v]||0)+1});for(var l=r||1,u=1;u<=5;u++){var p=Math.round(l*((e.starMix[u]||0)/100)),d=a[u];p>0&&Math.abs(d-p)>Math.max(1,Math.round(p*.3))&&n.push("★"+u+" 星级配比偏差：蓝图约 "+p+"，实际 "+d)}}return n};G.defaultBlueprint=function(t){var e=G.SUBJ_TO_PRESET[t]||"shuyi",n=G.BLUEPRINT_PRESETS[e]||G.BLUEPRINT_PRESETS.shuyi;return G.normalizeBlueprint(JSON.parse(JSON.stringify(n)),t)};G.validateQuestion=function(t){if(!t||typeof t!="object")return"不是对象";if(!t.stem||typeof t.stem!="string"||t.stem.length<8)return"题干缺失或过短";if(t.answer==null||t.answer==="")return"缺 answer";if(t.type==="choice"){if(!Array.isArray(t.options)||t.options.length!==4)return"选择题须 4 个选项";var e=t.options.map(function(i){return String(i).trim().charAt(0).toUpperCase()});if(e.join("")!=="ABCD")return"选项前缀须 A/B/C/D（实为 "+e.join("")+"）";var n=String(t.answer).trim().charAt(0).toUpperCase();if(e.indexOf(n)<0)return"answer 不在选项中";var s=String(t.answer).trim().slice(1).trim();if(s.length>6&&t.options.filter(function(i){return String(i).indexOf(s)>=0}).length>1)return"疑似多个选项含相同答案内容"}if(!t.solution||String(t.solution).length<1)return"解析缺失";var r=String(t.solution).replace(/\s+/g,"").length,o=t.type==="solve"||t.type==="essay"?60:t.type==="choice"?25:20;return r<o?"解析不完整（"+r+" 字 < "+o+" 字下限，需分步推导+结论+易错点）":""};G.braceBalanced=function(t){var e=0;t=String(t||"");for(var n=0;n<t.length;n++){var s=t[n];if(s==="\\"){n++;continue}s==="{"?e++:s==="}"&&e--}return e===0};G.buildVariantContext=function(t,e){if(!t||typeof t!="object")return"";var n=[];function s(o,i){if(i!=null){if(Array.isArray(i)){var a=i.map(function(u){return String(u??"").trim()}).filter(function(u){return!!u});if(!a.length)return;n.push(o+"："+a.join(" | "));return}var l=String(i).trim();l&&n.push(o+"："+l)}}function r(){for(var o=0;o<arguments.length;o++){var i=arguments[o];if(i!=null&&String(i).trim()!=="")return i}return""}return s("原题题干",r(t.stem,t.question,t.extractedQuestion)),s("原题选项",t.options),s("标准答案",r(t.answer,t.referenceAnswer)),s("原解析/解题关键",r(t.solution,t.keySteps,t.analysis)),s("易错点/错误原因",r(t.trap,t.errorCause)),s("考点",r(t.topicName,t.topic,t.painPoint)),n.join(`
`)};G.unwrapQuestionObj=function(t){return!t||typeof t!="object"?null:Array.isArray(t)?t.length?t[0]:null:t.questions&&Array.isArray(t.questions)?t.questions[0]:t.q?t.q:t};G.normalizeParallelQ=function(t,e){var n=G.unwrapQuestionObj(t);return n?(n.type={choice:"choice",fill:"fill",solve:"solve",essay:"essay"}[n.type]||e&&e.type||"solve",n.diff={easy:"easy",medium:"medium",hard:"hard"}[n.diff]||e&&e.diff||"medium",n.star=n.star>=1&&n.star<=5?n.star:e&&e.star||3,n.score=typeof n.score=="number"?n.score:e&&e.score||5,n.type==="choice"&&(!Array.isArray(n.options)||n.options.length!==4)&&(n.options=["A. 待补充","B. 待补充","C. 待补充","D. 待补充"]),n):null};G._normAns=function(t){return String(t??"").replace(/\$/g,"").replace(/\\left|\\right|\\!|\\,/g,"").replace(/\\d?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g,"($1)/($2)").replace(/\s+/g,"").replace(/[（(][^（()）]*[）)]/g,"").replace(/^[：:，,。.、答案答解]+/,"").replace(/[。．.、，,：:]+$/,"").toLowerCase()};G._ansNum=function(t){var e=String(t??"").replace(/[()（）]/g,""),n=e.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);if(n){var s=parseFloat(n[2]);return s?parseFloat(n[1])/s:NaN}var r=parseFloat(e);return isNaN(r)?NaN:r};G.answerEquivalent=function(t,e){var n=G._normAns(t),s=G._normAns(e);if(!n||!s)return!1;if(n===s)return!0;var r=function(f){return f.replace(/^[a-d][.、．]/,"")},o=r(n),i=r(s);if(o&&i&&o===i)return!0;var a=function(f){var v=f.lastIndexOf("=");return v>=0?f.slice(v+1):f},l=a(o),u=a(i);if(l&&u&&l===u)return!0;var p=G._ansNum(l),d=G._ansNum(u);return!isNaN(p)&&!isNaN(d)&&Math.abs(p-d)<1e-9};G.triageVerify=function(t,e,n){if(!t&&!e)return{status:"failed",suspect:null};var s=t&&e&&G.answerEquivalent(t,e),r=t&&n!=null&&String(n).trim()!==""&&G.answerEquivalent(t,n),o=e&&n!=null&&String(n).trim()!==""&&G.answerEquivalent(e,n);return s&&r?{status:"agree",suspect:null}:s&&!r?{status:"dispute",suspect:n?"orig-wrong":null}:!s&&(r||o)?{status:"lean",suspect:null}:{status:"dispute",suspect:null}};G.examTitle=function(t,e){return t&&t.title?t.title:"云端押题卷 · "+(G.SUBJ_NAME[e]||"综合")};G.examTotalScore=function(t){var e=t.questions||[];return e.reduce(function(n,s){return n+(Number(s.score)||5)},0)||Number(t.totalScore)||150};G.validateExam=function(t,e){var n=[];return!t||!Array.isArray(t.questions)||!t.questions.length?["无 questions"]:(t.questions.forEach(function(s,r){var o=G.validateQuestion(s);if(o)n.push("第"+(r+1)+"题："+o);else{var i=!G.braceBalanced(s.stem)||!G.braceBalanced(s.solution);i&&n.push("第"+(r+1)+"题：LaTeX 花括号不平衡")}}),e&&G.blueprintCheck(t,e).forEach(function(s){n.push("蓝本："+s)}),n)};G.normalizeQuestion=function(t){var e={stem:String(t&&t.stem||""),type:{choice:"choice",fill:"fill",solve:"solve",essay:"essay"}[t&&t.type]||"solve",options:Array.isArray(t&&t.options)?t.options:null,answer:String(t&&t.answer||""),solution:String(t&&t.solution||""),trap:String(t&&t.trap||""),diff:{easy:"easy",medium:"medium",hard:"hard"}[t&&t.diff]||"medium",star:t&&t.star>=1&&t.star<=5?t.star:3,score:Number(t&&t.score)||5,topicName:String(t&&t.topicName||"")};return e};const $n={early:{label:"早起型",bias:{morning:1.25,afternoon:1,evening:.75},desc:"上午精力最好，难点排上午"},normal:{label:"常规型",bias:{morning:1,afternoon:1.05,evening:1},desc:"均衡分配"},night:{label:"夜猫型",bias:{morning:.75,afternoon:1,evening:1.25},desc:"晚上精力最好，难点排晚上"}},hf={math:{morning:1.3,afternoon:1,evening:1.1},ctrl:{morning:1.1,afternoon:1.15,evening:.9},eng:{morning:1,afternoon:1,evening:1},pol:{morning:.9,afternoon:1,evening:1.15}},ae=[{key:"morning",label:"☀️ 上午",hours:[8,12],share:.34},{key:"afternoon",label:"🌤 下午",hours:[14,18],share:.33},{key:"evening",label:"🌙 晚上",hours:[19,23],share:.33}];function gf(t,e){e=e||{};const n=$n[e.routine]||$n.normal,s=Math.max(60,Math.round((e.dayHours||6)*60)),r={math:90,ctrl:75,eng:45,pol:40},o=[],i=[];(t||[]).forEach(m=>{if(!m)return;(m.forced||m.hard?o:i).push(Object.assign({},m,{minutes:Math.max(15,Math.min(240,m.minutes||r[m.subject]||60))}))});const a=ae.map(m=>({key:m.key,label:m.label,items:[],usedMin:0})),l=ae.map(m=>Math.round(s*m.share*(n.bias[m.key]||1))),u=(m,b)=>{const h=ae[b].key,g=(hf[m.subject]||{})[h]||1,A=a[b].usedMin,j=l[b],E=A+m.minutes>j?1e3:0;return(n.bias[h]||1)*g-E+Math.random()*.01},p={morning:0,afternoon:1,evening:2},d=(m,b)=>{let h=-1,g=-1/0;if(m.slotKey&&p[m.slotKey]!=null?h=p[m.slotKey]:ae.forEach((A,j)=>{const E=u(m,j);E>g&&(g=E,h=j)}),h<0){f.push(m);return}if(b){const A=a[h].items.length-1;if(A>=0&&!a[h].items[A].forced&&!a[h].items[A].hard&&a[h].usedMin+m.minutes>l[h]){const j=a[h].items.splice(A,1)[0];a[h].usedMin-=j.minutes,f.push(Object.assign({},j,{displaced:!0}))}}else if(a[h].usedMin+m.minutes>l[h]){const A=ae.findIndex((j,E)=>a[E].usedMin+m.minutes<=l[E]);if(A>=0)h=A;else{f.push(m);return}}a[h].items.push(Object.assign({},m,{slotStart:mf(h,a[h].usedMin),overflow:a[h].usedMin+m.minutes>l[h]})),a[h].usedMin+=m.minutes},f=[];return o.forEach(m=>d(m,!0)),i.forEach(m=>d(m,!1)),{slots:a.map((m,b)=>({key:m.key,label:m.label,items:m.items,usedMin:m.usedMin,budgetMin:l[b]})),unmapped:f,dayMin:s,hardN:o.length,softN:i.length}}function mf(t,e){const n=ae[t].hours[0]*60;return Math.round((n+e)/5)*5}function yf(t){if(t=Math.round(t||0),t>=60){const e=t/60;return(e%1===0?e:e.toFixed(1))+"h"}return t+"min"}function vf(t,e,n){n=n||{};const s=n.cap||3;if(!t||!e)return[];const r=[];try{const o=t.reading&&t.reading.cards||{},i=Object.keys(o).filter(a=>e(o[a])).slice(0,s);i.length&&r.push({id:"__review_eng",subject:"eng",kind:"vocab",due:!0,text:"📖 单词复习："+i.length+" 个到期（"+(t.readingCount!=null,"")+"间隔复习）",count:i.length,minutes:Math.min(30,i.length*2)})}catch{}try{const o=(t.polRecite||[]).filter(i=>e(i,{includeMastered:!1})).slice(0,s);o.length&&r.push({id:"__review_pol",subject:"pol",kind:"pol",due:!0,text:"📖 政治背诵："+o.length+" 个到期复习",count:o.length,minutes:Math.min(40,o.length*4)})}catch{}try{const o=Array.isArray(t.mistakePhotos)?t.mistakePhotos:[],i=Date.parse(String(n.todayKey||bf()))||Date.now(),a=o.filter(function(l){if(!l||!l.reviewPlan||!l.reviewPlan.start)return!1;const u=Date.parse(l.reviewPlan.start);if(isNaN(u))return!1;const p=Math.floor((i-u)/864e5);return p<0?!1:[1,3,7,15].some(function(d){const f="d"+d;return!(l.reviewPlan.done&&l.reviewPlan.done[f])&&p>=d})});a.length&&r.push({id:"__review_math",subject:"math",kind:"mistake",due:!0,text:"📖 拍题复习："+a.length+" 道到期（D1/3/7/15 间隔）",count:a.length,minutes:Math.min(45,a.length*5)})}catch{}return r}function bf(){const t=new Date;return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}function wf(t,e){const n={math:0,ctrl:0,eng:0,pol:0},s=[],r={};(t||[]).forEach(o=>{!o||o.forced||!o.subject||(r[o.subject]=r[o.subject]||{total:0,done:0},r[o.subject].total++,o.done&&r[o.subject].done++)}),Object.keys(r).forEach(o=>{const i=r[o];i.total&&i.done<i.total?(n[o]=(n[o]||0)+6,s.push(o+" 未全完成（"+i.done+"/"+i.total+"）→ 明日权重 +6%")):i.total&&i.done===i.total&&(n[o]=(n[o]||0)-2,s.push(o+" 全完成 ✓ → 明日权重 -2%"))});try{e&&Object.keys(e).forEach(o=>{(e[o]||99)>=3&&(n[o]=Math.max(n[o]||0,8),s.push(o+" 连续 "+e[o]+" 天未打卡 → 强制补救 +8%"))})}catch{}return{adjust:n,reasons:s}}const kf={ROUTINES:$n,SLOT_META:ae,slotAllocate:gf,fmtMin:yf,collectDueReviews:vf,computeAdjust:wf};function co(){return window.U||{}}function Yt(){return window.Store}function uo(){return window.AI}function Dt(){return window.InspectorModule}function de(t){var e=co();return(e.esc?e.esc:function(n){return String(n??"")})(t)}var ks={math:"数学",ctrl:"自控",eng:"英语",pol:"政治"},_s={sprint:"押题卷",quiz:"AI测验",mistakes:"错题本",photomistake:"拍题",conceptmap:"考点地图",tutor:"私教",reading:"阅读",polrecite:"政治背诵",wordbook:"单词本",review:"复习",daily:"每日一题",bank:"题库"};function fn(){return Yt().get()}function po(){var t=fn();return(!t.playbookLinks||typeof t.playbookLinks!="object")&&(Yt().update(function(e){e.playbookLinks={}}),t=fn()),t.playbookLinks}function Ss(){var t=fn();return Array.isArray(t.playbookDrills)||(Yt().update(function(e){e.playbookDrills=[]}),t=fn()),t.playbookDrills}function hn(t){return String(t??"").replace(/[\s\u3000]+/g,"").replace(/[（(].*?[)）]/g,"").replace(/[、，,。.：:；;·\-—_/\\|"'「」《》【】\[\]]/g,"").toLowerCase().slice(0,24)}function fo(t,e,n){return[t||"_",hn(e),hn(n)].filter(function(s){return s}).join("|")}function ho(t,e,n){t=t||{},n=n||{};var s=t.subject||n.subject||"",r=t.topicName||t.topic||t.name||n.topic||"",o=t.stem||t.question||t.title||t.desc||t.text||"",i=t.type||t.qtype||t.mistakeType||"",a=t.solution||t.analysis||t.explanation||"";return{subject:s,topicName:String(r||"").slice(0,40),topicId:t.topicId||n.topicId||"",type:String(i||"").slice(0,20),stem:String(o||"").slice(0,400),solution:String(a||"").slice(0,600),module:e||"",refId:n.id||t.examId||t.id||"",refTitle:n.title||t.examTitle||"",fp:fo(s,i,r)}}function Un(t,e){var n=co();return n.sim?n.sim(t,e,hn):0}function xs(t,e){if(!t||e.subject&&t.subject&&t.subject!==e.subject)return-1;var n=0,s=Un(t.title||"",e.topicName||"");n+=s*60,e.type&&(t.tags||[]).indexOf(e.type)>=0&&(n+=25);var r=e.stem||"";if(r){var o=0,i=Array.isArray(t.recognize)?t.recognize:t.recognize?String(t.recognize).split(/[\n、；;，,]/).map(function(a){return a.trim()}).filter(Boolean):[];i.forEach(function(a){if(a){var l=hn(a).slice(0,6);l&&r.indexOf(l)>=0&&o++}}),o&&(n+=Math.min(o,3)*10)}return r&&!e.topicName&&(n+=Un(t.title||"",r.slice(0,60))*30),t.uses&&(n+=Math.min(t.uses,10)*.5),n}var go=22;function He(t,e){if(e=e||{},!t||!window.InspectorModule)return null;var n=Dt().list()||[];if(!n.length)return null;var s=po(),r=t.fp?s[t.fp]:"";if(r&&!e.ignoreBound){var o=n.filter(function(l){return l.id===r})[0];if(o)return{pb:o,score:999,bound:!0};Yt().update(function(l){l.playbookLinks&&delete l.playbookLinks[t.fp]})}var i=null,a=-1;return n.forEach(function(l){var u=xs(l,t);u>a&&(a=u,i=l)}),!i||a<go?null:{pb:i,score:Math.round(a),bound:!1}}function mo(t,e){if(!t||!window.InspectorModule)return[];var n=Dt().list()||[],s=[];return n.forEach(function(r){var o=xs(r,t);o>0&&s.push({pb:r,score:Math.round(o)})}),s.sort(function(r,o){return o.score-r.score}),s.slice(0,e||6)}function Fn(t){return"你是考研方法论教练。考生在做「"+(ks[t.subject]||t.subject||"未标科目")+`」的一类题时反复卡住，需要一张可反复套用的【解题方法卡】。
【这类题】
考点/题型：`+(t.topicName||t.type||"见题面")+`
`+(t.stem?"代表性题面："+t.stem.slice(0,220)+`
`:"")+(t.solution?"参考解析（若有错请忽略，按你认为的正确做法写）："+t.solution.slice(0,200)+`
`:"")+`
只输出 JSON 本身（不要前言/后记/markdown 围栏）。【格式硬约束】steps 必须是【对象数组】——每一项都是 {"name":"…","do":"…","tip":"…"} 形式的对象，严禁把 steps 写成字符串数组。
格式：
{
  "subject": "`+(t.subject||"math")+`",
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
⑥ 不确定就给保守、通用、稳妥的做法，不要编造偏门技巧。用简体中文。`}function _f(){var t=uo();return!!(t&&t.configured&&t.configured())}function As(t,e){return e=e||{},new Promise(function(n){if(!window.InspectorModule){n(null);return}var s=e.force?null:He(t);if(s&&s.pb){n({pb:s.pb,created:!1,bound:s.bound});return}if(!_f()){e.silent||window.Toast&&X.warn("未配置 AI，无法自动建立方法卡。可到「解题方法」页手动新建。"),n(null);return}var r=uo();function o(i,a){var l=r.chatJSON?r.chatJSON(Fn(t),i,null,{ctx:"insp.gen",noThink:!0}):r.chatStream(Fn(t),i,null,null,{ctx:"insp.gen",noThink:!0}).then(function(u){return r.extractRobustJSON(u||"")});l.then(function(u){var p=Dt().normalizePlaybook(u,t.subject||"math");if(!p){if(!a){o(i+`
【重试注意】上次 JSON 不完整（疑似被截断）。请压缩每条字数（do≤25字/tip≤20字），确保 steps 4-7 步与全部字段一次性完整输出。严禁把裸字段名（如 "name"、"do"、"tip"）或 JSON 语法碎片（如 "]"、"steps"）当成内容输出；所有数组必须完整闭合。`,!0);return}e.silent||window.Toast&&X.warn("AI 返回的方法卡格式不合格，已放弃入库（不会污染方法库）"),n(null);return}p.source="auto:"+(t.module||"unknown"),p.autoFp=t.fp||"",p.autoTopic=t.topicName||t.type||"",p.uses=0,Yt().update(function(d){d.playbooks=d.playbooks||[],d.playbooks.unshift(p)}),En(t.fp,p.id),n({pb:p,created:!0,bound:!0})}).catch(function(u){e.silent||window.Toast&&X.warn("建立方法卡失败："+(u&&u.message||u)),n(null)})}o("请为这类题生成方法卡。",!1)})}function En(t,e){!t||!e||Yt().update(function(n){n.playbookLinks=n.playbookLinks||{},n.playbookLinks[t]=e})}function Sf(t){t&&Yt().update(function(e){e.playbookLinks&&delete e.playbookLinks[t]})}function yo(t,e){e=e||{};var n=e.autoCreate!==!1;return new Promise(function(s){if(!window.InspectorModule){window.Toast&&X.warn("解题方法模块未加载"),s(null);return}var r=He(t);if(r&&r.pb){tr(r.pb,t,e),s(r.pb);return}if(!n){Dt().startGuide?Dt().startGuide("",t.stem,{origin:e.origin,ctx:t}):Dt().openFor({subject:t.subject,type:t.type,desc:t.topicName}),s(null);return}As(t,{silent:!1}).then(function(o){o&&o.pb&&tr(o.pb,t,e),s(o?o.pb:null)})})}function tr(t,e,n){t&&(e.fp&&En(e.fp,t.id),Dt().startGuide?Dt().startGuide(t.id,e.stem||e.topicName,{origin:n.origin||_s[e.module]||e.module||"",originTab:n.originTab||e.module||"",ctx:e}):Dt().openPlaybook(t.id))}function vo(t){var e=He(t);return e&&e.pb?(Dt().openPlaybook(e.pb.id),e.pb):(Dt().openFor({subject:t.subject,type:t.type,desc:t.topicName||t.stem}),null)}function xf(t){t=t||{};var e={id:"dr"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),pbId:t.pbId||"",fp:t.fp||"",subject:t.subject||"",topicId:t.topicId||"",topic:String(t.topic||"").slice(0,40),module:t.module||"",steps:t.steps||0,doneSteps:t.doneSteps||0,risk:t.risk==null?null:t.risk,ok:!!t.ok,createdAt:new Date().toISOString()};return Yt().update(function(n){n.playbookDrills=n.playbookDrills||[],n.playbookDrills.unshift(e),n.playbookDrills.length>300&&(n.playbookDrills.length=300)}),e.ok&&e.topicId?bo(e.topicId,6):e.ok&&e.topic&&Af(e.subject,e.topic,6),e}function bo(t,e){t&&Yt().update(function(n){n.heat=n.heat||{};var s=n.heat[t]||{level:0,score:null,updatedAt:""};s.score==null&&(s.score=50),s.score=Math.max(0,Math.min(100,s.score+e)),s.level=s.score>=75?2:s.score>=45?1:0,s.updatedAt=new Date().toISOString(),n.heat[t]=s,n.heatHistory||(n.heatHistory={});var r=n.heatHistory[t]||[];r.push({score:s.score,level:s.level,at:new Date().toISOString()}),r.length>30&&(r=r.slice(-30)),n.heatHistory[t]=r})}function Af(t,e,n){try{var s=window.DB&&Wt.TOPICS&&Wt.TOPICS[t]||[],r=null,o=0;s.forEach(function(i){var a=Un(String(i.name||""),e);a>o&&(o=a,r=i)}),r&&o>.5&&bo(r.id,n)}catch{}}function wo(t){var e=Ss().filter(function(s){return s.pbId===t});if(!e.length)return{n:0,ok:0,rate:0,last:""};var n=e.filter(function(s){return s.ok}).length;return{n:e.length,ok:n,rate:Math.round(n/e.length*100),last:e[0].createdAt||""}}function Ef(t){var e=Ss().filter(function(n){return n.fp===t});return{n:e.length,ok:e.filter(function(n){return n.ok}).length,last:e.length?e[0].createdAt:""}}var Kn={},Ln=0;function Tf(t){Ln>400&&(Kn={},Ln=0);var e="c"+Ln+++Math.random().toString(36).slice(2,6);return Kn[e]=t,e}function ko(t){return t&&Kn[t]||null}function Es(t,e){if(e=e||{},!t)return"";var n=He(t),s=n?n.pb:null,r=t.topicName||t.type||"这一类题",o=s?wo(s.id):null,i;return s?i='<span class="ml-pb-name">'+de(s.title)+'</span><span class="ml-pb-meta">'+(o&&o.n?"练过 "+o.n+" 次 · 通过率 "+o.rate+"%":"尚未实操")+(n.bound?" · 已绑定此类题":"")+"</span>":i='<span class="ml-pb-none">「'+de(r)+'」还没建立解题方法</span><span class="ml-pb-meta">建立后，同类题自动复用，带练闭环</span>','<div class="ml-panel'+(e.compact?" ml-compact":"")+'" data-ml-fp="'+de(t.fp)+'" data-ml-ctx="'+Tf(t)+'"><div class="ml-head"><span class="ml-ico">🧭</span><div class="ml-right">'+i+"</div></div>"+(e.hint?'<div class="ml-hint">'+de(e.hint)+"</div>":"")+'<div class="ml-acts">'+(s?'<button class="btn btn-sm btn-primary ml-act" data-ml="practice">🎯 带我练</button><button class="btn btn-sm btn-ghost ml-act" data-ml="view">📖 看方法</button><button class="btn btn-sm btn-ghost ml-act" data-ml="swap">🔄 换一张</button>':'<button class="btn btn-sm btn-primary ml-act" data-ml="create">🧠 为这类题建立方法卡</button><button class="btn btn-sm btn-ghost ml-act" data-ml="pick">📚 从方法库挑一张</button>')+"</div></div>"}function _o(t,e,n){if(n=n||{},!!t){var s=t.classList&&t.classList.contains("ml-panel")?[t]:Array.prototype.slice.call(t.querySelectorAll(".ml-panel"));s.forEach(function(r){var o=ko(r.getAttribute("data-ml-ctx"))||e;o&&So(r,o,n)})}}function So(t,e,n){n=n||{},t.querySelectorAll(".ml-act").forEach(function(s){s.onclick=function(){var r=s.getAttribute("data-ml");if(r==="view"){vo(e);return}if(r==="practice"){yo(e,{origin:_s[e.module]||"",originTab:e.module});return}if(r==="create"){s.disabled=!0,s.textContent="⏳ 正在建立方法卡…",As(e,{force:!0}).then(function(o){s.disabled=!1,s.textContent="🧠 为这类题建立方法卡",o&&o.pb&&(window.Toast&&X.success("方法卡已建立："+o.pb.title+"（同类题将自动复用）"),Ts(t,e,n),n.onChange&&n.onChange(o.pb,e))});return}if(r==="swap"||r==="pick"){xo(e,n,t);return}}})}function Ts(t,e,n){if(!(!t||!e)){var s=Es(e,n),r=document.createElement("div");r.innerHTML=s;var o=r.firstChild;o&&(So(o,e,n),t.parentNode&&t.parentNode.replaceChild(o,t))}}function xo(t,e,n){e=e||{};var s=mo(t,12),r=(window.InspectorModule?Dt().list():[])||[],o=s.length?s:r.filter(function(a){return!t.subject||a.subject===t.subject}).map(function(a){return{pb:a,score:0}}),i='<div class="muted-sm" style="margin-bottom:8px">为「'+de(t.topicName||t.type||"这类题")+"」指定方法卡。绑定后，同类题会自动命中这张卡，不再重复询问。</div>"+(o.length?o.map(function(a){return'<div class="ml-pick-row"><div style="flex:1;min-width:0"><div style="font-size:13.5px;font-weight:600">'+de(a.pb.title)+'</div><div class="muted-sm" style="font-size:11.5px">'+(ks[a.pb.subject]||a.pb.subject)+" · "+(a.pb.steps||[]).length+" 步"+(a.score?" · 匹配度 "+a.score:"")+'</div></div><button class="btn btn-sm btn-primary ml-pick" data-id="'+de(a.pb.id)+'">绑定</button></div>'}).join(""):'<div class="empty">当前没有候选方法卡，可先「建立方法卡」。</div>');window.Modal&&It.open({title:"🔄 选择方法卡",html:i,actions:[{label:"取消"}]}),setTimeout(function(){document.querySelectorAll(".ml-pick").forEach(function(a){a.onclick=function(){En(t.fp,a.getAttribute("data-id")),window.Modal&&It.close&&It.close(),window.Toast&&X.success("已绑定，同类题将自动使用这张卡"),n&&Ts(n,t,e),e.onChange&&e.onChange({id:a.getAttribute("data-id")},t)}})},30)}function If(t,e,n,s,r){if(!t)return null;var o=ho(e,n,s);return t.innerHTML=Es(o,r),_o(t,o,r),o}const Ao={fromQuestion:ho,fingerprint:fo,match:He,candidates:mo,scoreOf:xs,genSystemPreview:function(t){return Fn(t||{subject:"math",topicName:"极限计算"})},ensure:As,bind:En,unbind:Sf,links:po,practice:yo,view:vo,recordDrill:xf,drills:Ss,statsOf:wo,fpStats:Ef,panelHtml:Es,bindPanel:_o,repaintPanel:Ts,mount:If,openPicker:xo,ctxOfToken:ko,SUBJ_CN:ks,MOD_CN:_s,MATCH_MIN:go},Of=Object.freeze(Object.defineProperty({__proto__:null,MethodLink:Ao},Symbol.toStringTag,{value:"Module"})),Ye=40,Mf=400,Pf=9e3,Nf={sprint:[[".sp-exam-card","考试题目",t=>mt(t.querySelector(".sp-exam-no"))+" "+mt(t)],[".sp-item","押题考点",t=>mt(t.querySelector(".sp-name"))+"（"+mt(t.querySelector(".sp-score"))+"）"],["#lib-reader-body > div","资料章节段",t=>mt(t)]],mistakes:[[".mis-row","错题",t=>mt(t.querySelector(".mis-desc"))||mt(t)]],photomistake:[[".pm-question","拍题题目",t=>mt(t)],[".pm-card","拍题记录",t=>mt(t)]],wordbook:[[".fc-word","当前单词卡",t=>mt(t)+" "+mt(t.parentElement?.querySelector(".fc-hint"))]],scheduler:[[".seq-row","排程任务",t=>mt(t)]],essay:[[".essay-row","作文批改记录",t=>mt(t.querySelector(".mis-desc"))||mt(t)]]};function mt(t){return(t&&t.textContent||"").replace(/\s+/g," ").trim().slice(0,Mf)}function Eo(t){const e=document.getElementById("view");let n=t;for(;n&&n!==e;){if(n.hidden)return!1;const s=n.style&&n.style.display;if(s==="none"||s==="hidden"||typeof n.className=="string"&&/(^|\s)cp-hide(\s|$)/.test(n.className))return!1;n=n.parentElement}return!0}const To=new Map;function Cf(t){const e=[];return t.querySelectorAll(".card").forEach(n=>{if(e.length>=Ye||!Eo(n))return;const s=mt(n.querySelector(".card-title")),r=mt(n),o=(s?s+"：":"")+(r.length>90?r.slice(0,90)+"…":r);o.trim()&&e.push({kind:s||"卡片",text:o})}),e}function Lf(t){const e=document.getElementById("view");if(!e)return[];const n=To.get(t);if(n)try{return n(e).slice(0,Ye)}catch{}const s=Nf[t];if(s){const r=[];for(const[o,i,a]of s)if(e.querySelectorAll(o).forEach(l=>{if(r.length>=Ye||!Eo(l))return;const u=a(l);u&&r.push({kind:i,text:u})}),r.length>=Ye)break;if(r.length)return r}return Cf(e)}const jf={dashboard:"仪表盘",scheduler:"排程",review:"复盘",photomistake:"拍题",quiz:"测验",heatmap:"热力图",inspector:"方法卡",sprint:"我的题卷",progress:"进度",decision:"决策",mental:"心态",redline:"红线",wordbook:"单词本",reading:"阅读",essay:"作文",polrecite:"政治背诵",mistakes:"错题本",concept:"概念图",focus:"专注",settings:"设置"};function Io(){const t=String(window.App?.current||"");if(!t||!document.getElementById("view"))return null;const e=Lf(t);return e.length?{pageId:t,label:jf[t]||t,entries:e}:null}function Oo(){const t=Io();if(!t)return"";const e=[];let n=0;for(let r=0;r<t.entries.length;r++){const o=r+1+". ["+t.entries[r].kind+"] "+t.entries[r].text;if(n+o.length>Pf)break;n+=o.length,e.push(o)}const s=e.length<t.entries.length?`
（本页共 `+t.entries.length+" 条，因长度上限仅列出前 "+e.length+" 条；被截断部分如需查看请让用户滚动页面或指明题号）":"";return"【当前页面·"+t.label+`（用户此刻看到的内容，DOM 直读非截图）】
`+e.join(`
`)+s+`
（用户说"这道题/这页/刚才"等指代时，即指上述条目）`}const qf=/(这道题|这题|这个题|这道|这页|本页|当前页|上面|刚才|屏幕上|看到的|这里|哪个错|哪道题)/;function Df(t){return qf.test(t||"")?Oo():""}function Rf(){try{const t=window.getSelection(),e=t?String(t.toString()||"").trim():"";if(e.length<4||e.length>800)return"";if(t&&t.rangeCount){const n=t.getRangeAt(0).commonAncestorContainer,s=n.nodeType===1?n:n.parentElement;if(!s||!s.closest("#view"))return""}return e}catch{return""}}const Bf={register(t,e){To.set(t,e)},snapshot:Io,text:Oo,auto:Df,selection:Rf};window.PageCtx=Bf;function Mo(){const t=window;t.U=O,t.ICONS=Je,t.Spaced=Zo,t.BgTask=_p,t.Tex=Pe,t.Store=M,t.Cloud=St,t.CloudJob=Vp,t.DB=Wt,t.Charts=Rr,t.Diagram=Dr,t.Toast=X,t.Modal=It,t.Components=Go,t.Notify=ys,t.AI=K,t.AiMemory=We,t.Alerts=is,t.Mastery=io,t.ZipKit=Xe,t.PluginBus=D,t.ExamPipeline=ao,t.MethodLink=Ao,t.Plaza=ti,t.SchedulerEngine=kf}function Jf(){const t=M.get(),e=O.dkey();if(t.meta.lastOpenDate===e)return;const n=t.meta.lastOpenDate;if(n&&n<e){const s=t.completions[n]||[];t.taskArchive[n]=t.tasks.map(o=>({subject:o.subject,text:o.text,done:o.done||s.indexOf(o.id)>=0})),t.tasks.forEach(o=>{o.done=!1});const r=Object.keys(t.taskArchive).sort();for(;r.length>60;)delete t.taskArchive[r.shift()]}M.update(s=>{s.meta.lastOpenDate=e})}function Gf(){Mo();try{const e="kaoyan2026_v2_bak";if(!localStorage.getItem(e)&&localStorage.getItem("kaoyan2026_data")){localStorage.setItem(e,new Date().toISOString());const n=localStorage.getItem("kaoyan2026_data");n&&localStorage.setItem("kaoyan2026_data_bak_v2",n)}}catch{}const t=(function(){try{return St.init()}catch{return Promise.resolve()}})();Wt.syncSubjects(),Jf(),ys.ensurePermission();try{We.syncLocalSignals()}catch{}setTimeout(()=>{try{is.runDailyChecks()}catch{}},800),t.then(function(){setTimeout(function(){try{const e=window.Copilot;e&&e.superviseCheck&&e.superviseCheck()}catch{}try{We.consolidateDue()&&We.weeklyConsolidate()}catch{}},1200)}).catch(function(){});try{ye.restoreChat(),ye.maybeAutoLoad()}catch{}(function e(n){try{const s=window.FocusModule;if(s&&s.boot){s.boot();return}}catch{}(n||0)<40&&setTimeout(()=>e((n||0)+1),50)})(),t.then(function(){const e=window.Onboarding;e&&e.needed&&e.needed()&&e.show()}).catch(function(){});try{const e=window.Copilot;e&&e.mount&&e.mount()}catch{}}Mo();const Hf=[()=>Z(()=>import("./dashboard-NYxkHTJA.js"),__vite__mapDeps([7,8,9,3,4,6,5]),import.meta.url),()=>Z(()=>import("./scheduler-DD9ULQJk.js"),[],import.meta.url),()=>Z(()=>import("./tasks-BqMe-nc1.js"),[],import.meta.url),()=>Z(()=>import("./progress-MouM4HYd.js"),[],import.meta.url),()=>Z(()=>import("./review-D181tX7l.js"),[],import.meta.url),()=>Z(()=>import("./heatmap-CJtykNWz.js"),[],import.meta.url),()=>Z(()=>import("./quiz-DXvNSoLm.js"),[],import.meta.url),()=>Z(()=>import("./inspector-C-9uhYsn.js"),[],import.meta.url),()=>Z(()=>import("./sprint-B5hRTBrt.js"),__vite__mapDeps([10,11,3,4,1,2,5,6]),import.meta.url),()=>Z(()=>import("./wordbook-CfxisImW.js"),[],import.meta.url),()=>Z(()=>import("./tutor-Z22EhQvz.js"),[],import.meta.url),()=>Z(()=>import("./settings-CD-7844Z.js"),__vite__mapDeps([12,11]),import.meta.url),()=>Z(()=>import("./onboarding-6bP4wBOR.js"),[],import.meta.url),()=>Z(()=>import("./copilot-DnPowQJ9.js"),__vite__mapDeps([0,1,2,3,4,5,6]),import.meta.url),()=>Z(()=>import("./polrecite-BnJDw6zP.js"),[],import.meta.url),()=>Z(()=>import("./plugincenter-BApsEka-.js"),[],import.meta.url)],zf=[()=>Z(()=>import("./mistakes-DO-9Bg-I.js"),[],import.meta.url),()=>Z(()=>import("./photomistake-B21O7oUw.js"),[],import.meta.url)],$f=[()=>Z(()=>import("./shareplaza-SOJnMojg.js"),__vite__mapDeps([13,14,5,3,4]),import.meta.url)],Uf=[()=>Z(()=>import("./redline-Dj0Zvmn_.js"),[],import.meta.url),()=>Z(()=>import("./focus-DeiM7h0a.js"),[],import.meta.url),()=>Z(()=>import("./conceptmap-DkvhK5Y_.js"),[],import.meta.url),()=>Z(()=>import("./decision-Ca7lZVwo.js"),[],import.meta.url),()=>Z(()=>import("./mental-BDB5Acye.js"),[],import.meta.url),()=>Z(()=>import("./reading-ChUStPXE.js"),[],import.meta.url),()=>Z(()=>import("./essay-DYPiZctW.js"),[],import.meta.url),()=>Z(()=>import("./vizai-WcsIuia_.js"),[],import.meta.url)],Ff=[()=>Z(()=>import("./shareplaza-ext-BYlyrW7i.js"),__vite__mapDeps([15,14,16,5,3,4]),import.meta.url),()=>Z(()=>import("./shareplaza-ai-CtnFQRXe.js"),__vite__mapDeps([17,14,16,5,3,4]),import.meta.url)];let Fe=null;function er(){return Fe||(Fe=(async()=>{await Promise.all($f.map(t=>t())),await Promise.all(Uf.map(t=>t())),await Promise.all(Ff.map(t=>t())),window.__LEGACY_ALL__=!0;try{window.dispatchEvent(new Event("legacy:rest-loaded"))}catch{}})().catch(function(t){throw Fe=null,t})),Fe}await Promise.all(Hf.map(t=>t()));await Promise.all(zf.map(t=>t()));const nr=()=>Z(()=>import("./index-BSDxLz4U.js").then(t=>t.i),__vite__mapDeps([18,9,3,4,6,5]),import.meta.url),Is=Bo(Hn);Is.use(Jo());Is.use(kt);Wi();(function(){if(window.__ERR_OVERLAY__)return;window.__ERR_OVERLAY__=!0;function e(n,s){try{const a=window.__ERR_LOG__=window.__ERR_LOG__||[];a.unshift({at:new Date().toISOString(),msg:String(n||""),stack:String(s||"").slice(0,800)}),a.length>20&&(a.length=20)}catch{}let r=document.getElementById("g-err");r||(r=document.createElement("div"),r.id="g-err",r.style.cssText="position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;background:#b42318;color:#fff;padding:10px 12px;border-radius:10px;font-size:13px;box-shadow:0 6px 24px rgba(0,0,0,.35)",document.body.appendChild(r)),r.innerHTML='<div style="display:flex;gap:8px;align-items:flex-start"><span style="flex:1;line-height:1.5">⚠️ 页面出错：'+O.esc(n)+'</span><button style="background:#fff;color:#b42318;border:0;border-radius:6px;padding:3px 8px;font-size:12px;flex:0 0 auto" data-a="copy">复制</button><button style="background:transparent;color:#fff;border:1px solid #fff;border-radius:6px;padding:3px 8px;font-size:12px;flex:0 0 auto" data-a="x">✕</button></div>'+(s?'<details style="margin-top:6px"><summary style="cursor:pointer;font-size:12px;opacity:.9">展开详情（截图发我）</summary><pre style="white-space:pre-wrap;font-size:11px;max-height:180px;overflow:auto;margin:6px 0 0">'+O.esc(s)+"</pre></details>":"");const o=r.querySelector('[data-a="copy"]'),i=r.querySelector('[data-a="x"]');o&&(o.onclick=function(){try{navigator.clipboard.writeText(n+`
`+s),this.textContent="已复制✓"}catch{}}),i&&(i.onclick=function(){r&&r.parentNode&&r.parentNode.removeChild(r)})}window.addEventListener("error",function(n){const s=n.target;if(s&&(s.tagName==="SCRIPT"||s.tagName==="LINK")){e("资源加载失败："+String(s.src||s.href||"").split("/").pop()+"（分片缺失，多为版本/缓存错配）——请强制刷新或清缓存","");return}n.message&&e(n.message,n.error&&n.error.stack||(n.filename?n.filename+":"+n.lineno:""))},!0),window.addEventListener("unhandledrejection",function(n){const s=n&&n.reason;e(s&&(s.message||String(s))||"未知异步错误",s&&s.stack||"")})})();try{if("serviceWorker"in navigator){const t=!!navigator.serviceWorker.controller;let e=!1;navigator.serviceWorker.addEventListener("controllerchange",function(){if(!t||e)return;e=!0;const n=document.createElement("div");n.style.cssText="position:fixed;left:50%;transform:translateX(-50%);bottom:60px;z-index:99998;background:#1a7f37;color:#fff;padding:10px 14px;border-radius:10px;font-size:13px;box-shadow:0 6px 24px rgba(0,0,0,.35);display:flex;gap:10px;align-items:center",n.innerHTML='🆕 已更新到新版本<button style="background:#fff;color:#1a7f37;border:0;border-radius:6px;padding:4px 10px;font-size:12px">刷新</button>',document.body.appendChild(n),n.querySelector("button").onclick=function(){location.reload()},setTimeout(function(){n.parentNode&&n.parentNode.removeChild(n)},15e3)})}}catch{}try{await M.hydrateHeavy()}catch{}Gf();Is.mount("#app");const Kf=window.requestIdleCallback||function(t){return setTimeout(t,1200)};try{Kf(()=>{er().catch(function(t){console.warn("[boot] 后台模块补齐失败",t)}),nr().then(function(){try{window.App&&Hn.current==="settings"&&Hn.refresh()}catch{}}).catch(function(t){console.warn("[boot] 工程组件注册失败",t)})})}catch{er().catch(()=>{}),nr().catch(()=>{})}try{typeof window.__BOOT_READY=="function"&&window.__BOOT_READY()}catch{}
