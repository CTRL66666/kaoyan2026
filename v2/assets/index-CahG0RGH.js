import{S as N}from"./store-CL8qD3_u.js";import{M as Q}from"./vendor-C9qFtEje.js";import{C as Lt,c as Mt,A as P,a as It}from"./ai-Bvj14BkB.js";import{b as ht,a as gt,c as xt,d as bt}from"./siteSearch-Binwyep_.js";const ut="0.26.4",Rt=[`https://cdn.jsdelivr.net/pyodide/v${ut}/full/`,`https://registry.npmmirror.com/-/binary/pyodide/v${ut}/full/`],w=Q({status:"idle",log:[],lastError:"",progress:{pct:0,msg:""}});function pt(t){w.log.push(t),w.log.length>200&&w.log.shift()}const zt=`
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
`;let T=null,M=null,Y=null;const H=new Map;let Jt=0;const dt="kaoyan2026_at_mpl";function St(t){if(t.type==="log"){pt(t.text),Y&&Y(t.text);return}if(t.type==="progress"){w.progress.pct=Math.max(0,Math.min(100,Math.round(t.pct))),w.progress.msg=t.msg||"";return}if(t.type==="ready"){w.status="ready",pt("✅ 基础组件就绪（numpy + sympy，Worker 沙箱）");try{localStorage.getItem(dt)==="1"&&T?.postMessage({type:"preload-mpl"})}catch{}return}if(t.type==="mpl-on"){try{localStorage.setItem(dt,"1")}catch{}return}if(t.type==="load-error"){w.status="error",w.lastError=t.error;return}if(t.type==="stdout"||t.type==="stderr"){const e=H.get(t.id);e&&(e.stdout+=t.text+`
`);return}if(t.type==="exec-done"){const e=H.get(t.id);if(!e)return;clearTimeout(e.timer),H.delete(t.id),e.resolve({ok:!!t.ok,output:String(t.output||"").slice(0,1500),error:String(t.error||""),timedOut:!1,image:t.image||""})}}function Dt(){const t=new Blob([zt],{type:"application/javascript"}),e=new Worker(URL.createObjectURL(t));return e.onmessage=n=>St(n.data),e.onerror=n=>{w.status="error",w.lastError="Worker 错误："+(n.message||"unknown")},e}function wt(t){return t&&(Y=t),T&&w.status==="ready"?Promise.resolve(T):M||(w.status="loading",M=new Promise((e,n)=>{const s=Dt();T=s;const r=i=>{i.type==="ready"?e(s):i.type==="load-error"&&(T=null,M=null,n(new Error(i.error)))},o=s.onmessage;s.onmessage=function(i){const c=i.data||{};(c.type==="ready"||c.type==="load-error")&&(s.onmessage=o,r(c)),St(c)},s.postMessage({type:"load",cdns:Rt})}),M)}function Ft(){try{T&&T.terminate()}catch{}T=null,M=null,w.status="idle"}function U(t){return wt(t).then(()=>{})}function J(){return w.status==="ready"}const et={runtime:!1,numpy:!1,sympy:!1,mpl:!1,font:!1,scipy:!1};function Bt(){return new Promise(t=>{if(!T||w.status!=="ready"){t(Object.assign({},et));return}const e=n=>{const s=n.data||{};s.type==="status-info"&&(T?.removeEventListener("message",e),t(Object.assign({},et,s.st||{})))};T.addEventListener("message",e),T.postMessage({type:"status"}),setTimeout(()=>{T?.removeEventListener("message",e),t(Object.assign({},et))},5e3)})}let L=null;function Ht(t){return L||(t&&(Y=t),L=new Promise((e,n)=>{if(!T||w.status!=="ready"){L=null,n(new Error("基础组件未就绪（先在上方下载基础组件）"));return}let s=!1;const r=(c,a)=>{s||(s=!0,clearTimeout(i),T?.removeEventListener("message",o),L=null,c?e():n(new Error(a||"预载失败")))},o=c=>{const a=c.data||{};a.type==="preload-done"&&r(!!a.ok,a.error)},i=setTimeout(()=>r(!1,"预载超时（240s）——重试或查看工程台日志"),24e4);T.addEventListener("message",o),T.postMessage({type:"preload-mpl"})}),L)}function st(t,e=3e4){return wt().then(n=>new Promise(s=>{const r=++Jt,o={resolve:s,stdout:"",timer:setTimeout(()=>{H.delete(r),Ft(),s({ok:!1,output:o.stdout.slice(0,1500),error:"执行超时（"+Math.round(e/1e3)+"s 上限，已强制终止该次执行）",timedOut:!0})},e)};H.set(r,o),n.postMessage({type:"exec",id:r,code:String(t||"")})}))}function $(t,e){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function ot(t,e,n){const s=new AbortController,r=setTimeout(()=>{try{s.abort()}catch{}},e);return fetch(t,Object.assign({signal:s.signal},n)).finally(()=>clearTimeout(r))}function Wt(){try{const t=window.Store,e=t&&t.get().ai||{},n=e.apis||[],s=n.find(i=>i.id===e.activeApi)||n[0],r=String(s&&s.endpoint||e.endpoint||"").toLowerCase(),o=String(s&&s.key||e.key||"");return o?r.includes("bigmodel.cn")?{provider:"zhipu",key:o}:r.includes("moonshot.cn")?{provider:"kimi",key:o}:r.includes("dashscope.aliyuncs.com")?{provider:"dashscope",key:o}:{provider:"",key:o}:{provider:"",key:""}}catch{return{provider:"",key:""}}}async function Ut(t,e,n){try{const s=await ot("https://open.bigmodel.cn/api/paas/v4/web_search",n,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify({search_query:t,search_engine:"search-std",count:8})});if(!s.ok)return{ok:!1,text:"",sources:[],note:"智谱搜索 HTTP "+s.status};const r=await s.json(),o=Array.isArray(r?.result)?r.result:[];if(!o.length)return{ok:!1,text:"",sources:[],note:"智谱搜索无结果"};const i=o.slice(0,8).map(a=>"【"+$(a.title,60)+"】"+$(a.content,500)),c=o.map(a=>a.link).filter(Boolean).slice(0,6);return{ok:!0,text:i.join(`

`).slice(0,3e3),sources:c}}catch(s){return{ok:!1,text:"",sources:[],note:"智谱搜索不可达："+String(s?.message||s)}}}async function Gt(t,e,n,s){try{const r=s||"https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",o=(()=>{try{const f=window.Store.get().ai,d=(f.apis||[]).find(u=>u.id===f.activeApi)||(f.apis||[])[0];return d&&d.model||"qwen-plus"}catch{return"qwen-plus"}})(),i=await ot(r,n,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify({model:o,messages:[{role:"user",content:"请联网检索并客观汇总以下主题的关键信息（列出要点与来源网址，不要评论）："+t}],enable_search:!0,search_options:{enable_source:!0,search_strategy:"max"}})});if(!i.ok)return{ok:!1,text:"",sources:[],note:"千问联网搜索 HTTP "+i.status};const c=await i.json(),a=c?.choices?.[0]?.message,p=$(a?.content,2800);if(!p)return{ok:!1,text:"",sources:[],note:"千问联网搜索无内容"};const l=[];try{(c?.search_info?.search_results||c?.output?.search_info?.search_results||[]).forEach(d=>{(d?.url||d?.link)&&l.push(d.url||d.link)}),(a?.annotations||[]).forEach(d=>{const u=d?.url_citation?.url||d?.url;u&&l.push(u)})}catch{}return{ok:!0,text:"【千问·联网检索】"+p,sources:l.slice(0,6)}}catch(r){return{ok:!1,text:"",sources:[],note:"千问联网搜索不可达："+String(r?.message||r)}}}async function Vt(t,e,n){try{const s=await ot("https://api.moonshot.cn/v1/kimi_search_api",n,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify({model:"kimi-search-api",messages:[{role:"user",content:t}]})});if(!s.ok)return{ok:!1,text:"",sources:[],note:"Kimi 搜索 HTTP "+s.status};const r=await s.json(),o=r?.choices?.[0]?.message?.content;if(!o)return{ok:!1,text:"",sources:[],note:"Kimi 搜索无内容"};const i=[];try{(r?._citations||r?.citations||[]).forEach(c=>{const a=typeof c=="string"?c:c?.url||c?.original_url;a&&i.push(a)})}catch{}return{ok:!0,text:$(o,3e3),sources:i.slice(0,6)}}catch(s){return{ok:!1,text:"",sources:[],note:"Kimi 搜索不可达："+String(s?.message||s)}}}async function Xt(t,e){let n="auto",s="";try{const c=window.Store.get().settings||{};n=c.searchProvider||"auto",s=String(c.searchKey||"")}catch{}if(n==="fallback")return null;const r=Wt(),o=n==="auto"?r.provider:n,i=s||r.key;return!o||!i?null:o==="zhipu"?Ut(t,i,e):o==="dashscope"?Gt(t,i,e):o==="kimi"?Vt(t,i,e):null}function K(t,e){return String(t||"").replace(/\s+/g," ").trim().slice(0,e)}async function ft(t,e,n){try{const s=new URLSearchParams({action:"query",list:"search",srsearch:t,format:"json",srlimit:"1",origin:"*"}),i=(await(await nt(`https://${e}.wikipedia.org/w/api.php?`+s.toString(),n)).json())?.query?.search?.[0];if(!i?.title)return{};const c=new URLSearchParams({lang:e==="zh"?"zh-cn":"en",format:"json",origin:"*"}),p=await(await nt(`https://${e==="zh"?"zh":"en"}.wikipedia.org/api/rest_v1/page/summary/`+encodeURIComponent(i.title)+"?"+c.toString(),n)).json();return{title:i.title,extract:p?.extract||"",url:p?.content_urls?.desktop?.page||"https://"+e+".wikipedia.org/wiki/"+encodeURIComponent(i.title)}}catch{return{net:!0}}}async function Yt(t,e){try{const s=await(await nt("https://api.duckduckgo.com/?"+new URLSearchParams({q:t,format:"json",no_html:"1",skip_icon_info:"1"}).toString(),e)).json(),r=[],o=s?.RelatedTopics||[];for(const i of o){const c=i?.Topics||[i];for(const a of c)if(a?.Text&&r.push(K(a.Text,160)),r.length>=4)break;if(r.length>=4)break}return{text:K(s?.AbstractText||"",600),url:s?.AbstractURL||"",related:r}}catch{return{text:"",related:[],net:!0}}}function nt(t,e){const n=new AbortController,s=setTimeout(()=>{try{n.abort()}catch{}},e);return fetch(t,{signal:n.signal,headers:{Accept:"application/json"}}).finally(()=>clearTimeout(s))}async function vt(t,e){const n=String(t||"").trim().slice(0,200);if(!n)return{ok:!1,text:"",sources:[],note:"空查询"};const s=12e3;let r="";try{const o=await Xt(n,s);if(o&&o.ok)return o;o&&o.note&&(r=o.note+"；")}catch{}try{const[o,i,c]=await Promise.all([ft(n,"zh",s),ft(n,"en",s),Yt(n,s)]),a=[],p=[];o.extract&&(a.push("【维基·"+o.title+"】"+K(o.extract,700)),o.url&&p.push(o.url)),i.extract&&i.extract!==o.extract&&(a.push("[Wiki·"+i.title+"] "+K(i.extract,500)),i.url&&p.push(i.url)),c.text&&(a.push("【DDG 摘要】"+c.text),c.url&&p.push(c.url)),c.related.length&&a.push("【相关】"+c.related.join("；"));const l=a.join(`

`).slice(0,3e3);if(!l){const f=o.net&&i.net&&c.net,d=r+(f?"联网源（维基百科/DuckDuckGo）均无法连接——中国大陆网络通常访问不到这些站点。建议在「设置→云端AI」配置智谱/千问等带官方搜索的接口（自动复用其 key），或改用已有知识作答。":"已连接但无匹配结果（该主题可能无百科/即时答案）。");return{ok:!1,text:"",sources:[],note:d}}return{ok:!0,text:l,sources:p.slice(0,6)}}catch(o){return{ok:!1,text:"",sources:[],note:"搜索失败："+String(o?.message||o)}}}function $t(){return{setStatus(){},roundStream(){},step(){},think(){},writing(){},finish(){},fail(){},cancelled:!1,onCancel(){}}}function Kt(t,e){let n=Mt();return n?n.toolTask(t,{primary:!1}):e?$t():(n=Lt.aiFloat("🛠 "+t),n.toolTask(t,{primary:!0}))}const Zt={type:"function",function:{name:"python_exec",description:"在浏览器沙箱执行 Python 代码（numpy/sympy/matplotlib 已就绪），返回 stdout 与生成的图表。数学答案与关键中间量必须以工具计算为准。",parameters:{type:"object",properties:{code:{type:"string",description:"完整可运行的 Python 代码"}},required:["code"]}}},Qt={type:"function",function:{name:"web_search",description:"联网检索事实/定义/背景资料（维基百科 + DuckDuckGo 即时答案，适合知识点、概念、公式、人物事件等）。需要实时/权威外部信息时调用；纯计算用 python_exec。",parameters:{type:"object",properties:{query:{type:"string",description:"搜索关键词（简洁明确，中文或英文）"}},required:["query"]}}};function z(t){if(t==="fc"||t==="json")return t;let e="auto";try{e=String(N.get().ai.toolProto||"auto")}catch{}if(e==="json"||e==="fc")return e;try{const n=P.activeApi();return n&&n.fc===!0?"fc":"json"}catch{return"json"}}function rt(t){return t==="fc"?"需要再计算/检索就直接再次调用工具（python_exec / web_search）；可以直接回答时用自然文字作答。":'需要再调用工具输出 {"tool":"python_exec"或"web_search",...}；可以直接回答用户时输出自然文字（不要 JSON）。'}function te(t,e){return`工具执行结果：
`+(t.error?"[错误] "+t.error+`
`+t.output:t.output||"(无输出，请用 print 输出结论)")+(t.image?`
[图表已生成并展示给用户]`:"")+`
请继续：`+rt(e)}function ee(t,e){return`联网搜索结果：
`+(t.ok?t.text+(t.sources&&t.sources.length?`

参考来源：`+t.sources.join(" | "):""):"[搜索未成功] "+(t.note||"无结果"))+`

请基于以上检索内容继续（注意来源可靠性，必要时交叉验证）：`+rt(e)}function ne(t,e){const n=t.ok?t.text:t.note||"",s=t.mode||"search",r=s==="brief"?"全站数据简报（考生当前学习全局：各源关键状态——错题原文/题库家底/进度都在站内，需要细节用 search+detail）：":s==="list"?"站内数据清单（考生自己有哪些数据源可搜；下一步带 sources+query 定向检索）：":s==="detail"?"记录全文（按 ref 取回的完整内容，可直接引用题干/选项/答案/解析）：":"站内检索结果（考生自己的数据，命中即引用来源）：",o=s==="brief"?`
可基于简报直接给出全局判断（哪些薄弱、该先做什么）；引用具体题目/错题原文前先 search 或 detail 拿原文，不要凭简报摘要编造细节。`:s==="list"?`
请从清单里选源并用更具体的词再调一次 site_search（也可先直接向用户汇报清单）。`:s==="detail"?`
可直接基于全文作答/讲解；末尾【关联】已给出方法卡与站内同类题（带 ref），顺着讲完就引导去练。`:`
命中行带 ref，需要某条完整内容再调 {"tool":"site_search","mode":"detail","id":"<ref>"}；回执里写了扫描范围与命中数，向用户汇报时如实引用；没命中的部分说明可换词或 web_search，不要编造数据。`;return r+`
`+n+o+rt(e)}function se(t,e){let n=0,s=!1,r=!1;for(let o=e;o<t.length;o++){const i=t.charAt(o);if(s){r?r=!1:i==="\\"?r=!0:i==='"'&&(s=!1);continue}if(i==='"')s=!0;else if(i==="{")n++;else if(i==="}"&&(n--,n===0))return t.slice(e,o+1)}return null}function it(t){let e=null;try{e=P.extractRobustJSON(t)}catch{e=null}if(e&&typeof e=="object"&&(e.tool||e.final))return e;const n=/"(tool|final)"\s*:/g;let s;for(;(s=n.exec(t))!==null;){const c=t.lastIndexOf("{",s.index);if(c<0)continue;const a=se(t,c);if(a)try{const p=JSON.parse(a);if(p&&typeof p=="object"&&(p.tool||p.final))return p}catch{}}const r=/\[\[\s*(tool|final)\s*[:：]([\s\S]*?)\]\]/g;let o;for(;(o=r.exec(t))!==null;){const c='{"'+o[1]+'":'+o[2]+"}";try{const a=JSON.parse(c);if(a&&typeof a=="object"&&(a.tool||a.final))return a}catch{}}const i=/invoke\s+name\s*=\s*"([a-zA-Z_]+)"/.exec(t);if(i){const c=i[1],a={},p=/parameter\s+name\s*=\s*"([a-zA-Z_]+)"[^>]*>([\s\S]*?)<\s*\/?[^>]*parameter\s*>/g;let l;for(;(l=p.exec(t))!==null;){const f=l[2].replace(/<[^>]*>/g,"").trim();if(l[1]==="sources")try{a.sources=JSON.parse(f)}catch{a.sources=f.split(/[,，\s]+/).filter(Boolean)}else a[l[1]]=f}if(c==="site_search"){const f=String(a.mode||"");if(f==="detail")return{tool:"site_search",mode:"detail",id:String(a.id||a.ref||"")};if(f==="brief")return{tool:"site_search",mode:"brief",sources:a.sources,subject:a.subject};const d=String(a.query||"");return f==="list"||!d.trim()?{tool:"site_search",query:"",sources:a.sources,subject:a.subject}:{tool:"site_search",query:d,sources:a.sources,subject:a.subject}}if(c==="web_search")return{tool:"web_search",query:String(a.query||"")};if(c==="python_exec")return{tool:"python_exec",code:String(a.code||"")}}return e&&typeof e=="object"?e:null}function oe(t,e){return t==="fc"?ie(e):re(e)}function re(t){return{name:"json",async runRound(e,n){const s=String(await P.chatMessagesStream(e,function(o,i){try{n(String(o||""),String(i||""))}catch{}},{cache:!1,timeout:18e4,ctx:t})||""),r=it(s);if(r&&r.tool==="python_exec"&&typeof r.code=="string")return{kind:"tool",name:"python_exec",args:{code:r.code},raw:s};if(r&&r.tool==="web_search"&&typeof r.query=="string")return{kind:"tool",name:"web_search",args:{query:r.query},raw:s};if(r&&r.tool==="site_search"){const o=typeof r.mode=="string"?r.mode:"",i=Array.isArray(r.sources)?r.sources:void 0,c=typeof r.subject=="string"&&r.subject.trim()?r.subject.trim():void 0;if(o==="detail")return{kind:"tool",name:"site_search",args:{mode:"detail",id:String(r.id||r.ref||"")},raw:s};if(o==="brief")return{kind:"tool",name:"site_search",args:{mode:"brief",sources:i,subject:c},raw:s};const a=typeof r.query=="string"?r.query:"";return o==="list"||!a.trim()?{kind:"tool",name:"site_search",args:{query:"",mode:"list",sources:i,subject:c},raw:s}:{kind:"tool",name:"site_search",args:{query:a,sources:i,subject:c},raw:s}}return r&&r.final?{kind:"final",obj:r,raw:s}:{kind:"text",raw:s}},pushToolTurn(e,n,s){e.push({role:"assistant",content:n.raw}),e.push({role:"user",content:s})},pushTextTurn(e,n){e.push({role:"assistant",content:n})}}}function ie(t){let e="";try{e=String((P.activeApi()||{}).id||"")}catch{}return{name:"fc",async runRound(n,s){const r=await P.chatMessagesStream(n,function(p,l){try{s(String(p||""),String(l||""))}catch{}},{cache:!1,timeout:18e4,tools:[Zt,Qt],tool_choice:"auto",apiId:e||void 0,ctx:t}),o=String(r&&r.text||""),i=r&&Array.isArray(r.toolCalls)?r.toolCalls.filter(p=>p&&p.function):[],c=i.find(p=>p.function.name==="python_exec"||p.function.name==="web_search")||null;if(c){let p={};try{p=JSON.parse(c.function.arguments||"{}")||{}}catch{p={}}const l=c.function.name==="web_search"?"web_search":"python_exec";if(String(p[l==="web_search"?"query":"code"]||"").trim())return{kind:"tool",name:l,args:p,raw:o,toolCallId:String(c.id||""),assistantMsg:{role:"assistant",content:o||null,tool_calls:i}}}const a=it(o);return a&&a.final?{kind:"final",obj:a,raw:o}:{kind:"text",raw:o}},pushToolTurn(n,s,r){n.push(s.assistantMsg||{role:"assistant",content:s.raw||null}),n.push({role:"tool",tool_call_id:s.toolCallId||"",content:r})},pushTextTurn(n,s){n.push({role:"assistant",content:s})}}}const at=["【工程工具模式（已启用：沙箱 Python，numpy/sympy/matplotlib 就绪）】","⚠️ 你【确实拥有】python_exec 工具且它真实可用——本环境不依赖平台工具栏/函数调用开关，",'工具通过在回复中直接输出 JSON 调用（{"tool":"python_exec","code":"…"}），结果会真实回传。','不要因为"以为自己没有工具"而跳过计算或说"我无法执行代码"。',"【多轮循环机制】这不是一次性问答：你输出工具 JSON 后【立即停止本轮】，系统真实执行并把",'stdout/错误作为新消息回传给你，你再继续——来回多轮直到完成；"先输出工具 JSON 等结果"是完全可行且被支持的，不是自言自语。'].join(`
`),ae=`
`+at+`
`+['【指令优先级】"只输出题目 JSON"指的是【最终交付物】；计算验证阶段输出工具 JSON 不违反它，恰恰是必经之路。',"【出题工作循环——像人类命题人一样闭环工作（严格遵守）】","① 产生思路：确定考点、解法、难度定位与命题意图。",'② 计算验证：调用 Python 工具（只输出 {"tool":"python_exec","code":"<sympy/numpy 代码>"}）真实算出标准答案与关键中间量——严禁凭感觉编造数值答案。',"③ 闭环调整：检查计算结果——若答案/难度/计算量不符合命题意图，调整思路再算（可多轮）；若发现之前的解法有问题，推翻重来。","④ 验收合格：标准答案经工具确认无误、题面所需数值全部落实。","⑤ 开始出题：围绕已验证的数值与思路，只输出题目 JSON 本体（格式：stem/type/options/answer/solution/trap），不要再带工具标记。","【配图规约（重要）】几何图形/函数图像/积分区域/数据图等需要配图的题：在验证阶段用 python_exec + matplotlib","画出精确图形（figsize≈(4,3)，含坐标轴/刻度/图例，关键点与区域标注清晰）。numpy/sympy【已在环境中装好】；","matplotlib / scipy 首次使用时【自动装载】（直接 import 即可，等待片刻即可）——","严禁 micropip / pyodide.loadPackage / asyncio（不存在也不需要，用了必报错）；","图【不需要 savefig 到文件】（沙箱无文件语义，画完留在内存即可，也无需 plt.show()）；系统自动收取图形作为题目配图，","严禁把文件路径（如 /tmp/xx.png）写进题面/解析/JSON。","【课本风·必用助手】环境已内置 at_style2d / at_style3d——标准右手系、原点式坐标轴箭头、半透明面板，与教材例题同款：",'平面图：ax = plt.gca(); at_style2d(ax)；立体图（曲面/空间曲线/区域/向量）：ax = fig.add_subplot(projection="3d"); at_style3d(ax)。',"图中标注优先用 LaTeX 数学记号（$...$）；已装载黑体，中文标注可用；若日志提示字体未就绪（中文变方框）则改用英文/LaTeX。","若计算结果与预想不符，以计算结果为准调整题面或答案。"].join(`
`),ce=`
`+at+`
`+['1) 需要计算/验算/画图时，只输出一个 JSON {"tool":"python_exec","code":"<Python代码>"}；需要事实/定义/背景/最新资料时，只输出 {"tool":"web_search","query":"<检索词>"}。工具会真实执行，结果回传给你。','1.1) 查【考生自己的数据】用 site_search，四种模式按需选：① {"tool":"site_search","mode":"brief"} 全站简报——各源关键状态（错题最近几条/题卷成绩/资料库书目/单词到期/薄弱点/任务进度），【开班/不确定该查什么时先看它】；只关心某一科时加 "subject":"数学一"（或任一科目名）切片，简报只列该科有数据的源；② {"tool":"site_search"}（不带 query）源清单——11 个数据源各有多少、样例是什么；同样可带 "subject" 只看某科；③ {"tool":"site_search","query":"<实词关键词>","sources":["books","exams","quizBank","mistakes","photos","vocab","polRecite","polChoice","playbooks","tasks","weekly"] 可选,"subject":"<科目名> 可选"} 关键词检索——拆词打分带置信分与 ref；带 subject 时只在含该科的记录里命中（排除别科干扰），问「我数学的二次型错题」这类跨源同主题时用它能精准圈定；④ {"tool":"site_search","mode":"detail","id":"<上一步命中行里的 ref>"} 取全文——错题题干+选项+答案+解析+SRS、题的来源卷/书与全文、单词卡等【完整记录】。检索结果自带「检索回执」（扫描了哪些源/命中几条）——向用户汇报时如实引用。关键词用实词（书名/考点/单词），别整句问句。',"NaNgoto 跳页面 / addTask 加任务 / toggleTask 打卡 / addWord 加单词 / recordMood 记心情 / planDay 排一天 / startQuiz 出题练习 / openMethod 打开方法卡 / genExam 生成套卷 / addMistake 录错题 / startDrill 错题重练 / hardVocab 攻坚单词 / rushPlan 冲刺路径 / markMastered 标记掌握 / reviewDue 清到期复习 / addReminder 设定时提醒。需要用户动手去做的事（做题/背词/清到期）优先给动作按钮，而不是只留一句话。","2) 数学答案与关键中间量必须以工具计算为准；画图直接用 matplotlib；不确定的外部事实先 web_search 再作答，不要臆造。","3) 回答「我上次那道…错题」「我资料库里的…」「我练过的…」这类指向考生个人数据的问题，【必须先 site_search（先清单后检索）】拿到真实内容再作答，禁止凭印象编造；站内没命中就如实说并给出换词建议，外部资料再补 web_search。",'4) 完成后直接用自然文字回答（保持你原有的输出格式与标记习惯），不要带工具 JSON（也不要用 <|DSML|> / XML 之类的其它工具标记，只认 {"tool":…} JSON）。'].join(`
`),le=["【工程工具模式（已启用：沙箱 Python + 联网搜索，numpy/sympy/matplotlib 就绪）】","⚠️ 你【确实拥有】python_exec（计算/画图）与 web_search（联网检索事实/定义/背景）两个工具且真实可用——本环境通过平台【原生 function calling】提供：","需要计算/验算/画图直接调用 python_exec（参数 code）；需要事实/定义/最新资料直接调用 web_search（参数 query）。平台会真实执行并回传结果。",'不要输出 {"tool":"python_exec",...} 这类文本 JSON（那是旧协议，本会话已不使用），','更不要因为"以为自己没有工具"而跳过计算或说"我无法执行代码"。',"【多轮循环机制】这不是一次性问答：每次工具调用后系统真实执行并回传结果，你再继续——来回多轮直到完成。"].join(`
`),ue=`
`+le+`
`+["1) 需要计算/验算/画图时直接调用 python_exec 工具；需要事实/定义/背景/最新资料时直接调用 web_search 工具，结果会回传给你。","2) 数学答案与关键中间量必须以工具计算为准；不确定的外部事实先检索再作答，不要臆造。","3) 完成后直接用自然文字回答（保持你原有的输出格式与标记习惯）。"].join(`
`),pe=`
`+at+`
`+["【工作方式】凡涉及数学推导、数值验算、统计、画图的问题，先调用 Python 真实算；",'需要事实/定义/背景/最新资料时调用 {"tool":"web_search","query":"…"} 联网检索（维基百科/DDG）。',"结论以工具计算/检索结果为准；本问题不需要就直接回答，不必强行调用工具。","【配图规约】画图用 matplotlib（figsize≈(4,3)），直接 import（首次使用自动装载）；","严禁 micropip / pyodide.loadPackage / asyncio；无需 savefig/plt.show（沙箱无文件语义），系统自动收取图形。","【最终交付（最重要）】完成后直接输出最终回答，并【严格保持你原系统提示词规定的输出格式】","（JSON schema、ACTION/QUERY/FLOW 等标记约定原样不变）——工具轮只是工作过程，",'最终回答里不得出现工具 JSON 或"我调用了工具"之类的说明。'].join(`
`),mt='{"tool":',de=/^\s*(?:`{0,3}[a-zA-Z]*)?\s*\{\s*"tool"\s*:/;function _t(t){const e=String(t||"");if(!e.trim())return"hold";if(de.test(e)||/^\s*<[^>]*\|?\s*DSML/i.test(e))return"tool";const n=e.replace(/^\s*`{0,3}[a-zA-Z]*\s*/,"");return n.length<=mt.length&&mt.indexOf(n)===0?"hold":"final"}function kt(t){const e=Math.max(1,t.maxRounds||20),n=Kt(t.label||"AI 工程任务",t.quiet);let s=!1;n.onCancel(()=>{s=!0});const r=()=>s||!!(t.signal&&t.signal.aborted)||!!(t.isCancelled&&t.isCancelled()),o=[{role:"system",content:(t.system||"")+pe}],i=(t.user||"")+`

（环境提醒：本会话支持多轮工具调用——需要计算/画图时输出 {"tool":"python_exec","code":"…"} 并立即停止本轮，Python 会真实执行并把结果回传给你；不需要计算就直接按原格式输出最终回答。）`;return o.push({role:"user",content:t.imageDataUrl?[{type:"text",text:i},{type:"image_url",image_url:{url:t.imageDataUrl}}]:i}),new Promise((c,a)=>{const p=()=>{n.fail("已取消"),a(Object.assign(new Error("已取消"),{cancelled:!0}))},l=(f,d)=>{if(r()){p();return}n.setStatus(f>1?"第 "+f+" 轮 · 等待模型响应…":"任务已发起，等待模型响应…");let u=!1;P.chatMessagesStream(o,function(S,h){if(r())return;const m=String(S||"");h&&n.think(h);const g=_t(m);if(g!=="hold"){if(g==="tool"){n.roundStream(f,m),u&&t.onChunk&&t.onChunk("",""),u=!1;return}u||(u=!0),n.writing(m),t.onChunk&&t.onChunk(m,h||"")}},{cache:!1,timeout:18e4,signal:t.signal,ctx:t.ctx}).then(S=>{if(r()){p();return}const h=String(S||""),m=it(h),g=!!(m&&(m.tool==="python_exec"&&typeof m.code=="string"||m.tool==="web_search"&&typeof m.query=="string"||m.tool==="site_search"&&typeof m.query=="string"));if(g&&u&&(t.onChunk&&t.onChunk("",""),u=!1),g&&f>=e&&!d){n.setStatus("已达工具轮上限，强制汇总…"),o.push({role:"assistant",content:h}),o.push({role:"user",content:"已达最大工具轮次。请停止调用工具，基于目前已有结果，严格按原格式直接输出最终回答。"}),l(f+1,!0);return}if(g&&d){n.finish(),c(h);return}if(g){const v=m.tool==="web_search",_=m.tool==="site_search";n.setStatus("第 "+f+" 轮 · "+(_?"站内搜索…":v?"联网搜索…":"执行 Python…"));const x=_?"📚 站内 "+String(m.query||""):v?"🔍 "+String(m.query||""):String(m.code||""),k=_||v?'还需要检索/计算就输出 {"tool":"site_search"或"web_search"或"python_exec",...}；完成了就按原格式直接输出最终回答。':'还需要计算/画图就输出 {"tool":...}；完成了就按原格式直接输出最终回答。';(_?Promise.resolve((()=>{const y=String(m.mode||""),b=Array.isArray(m.sources)?m.sources:void 0,j=typeof m.subject=="string"&&m.subject.trim()?m.subject.trim():void 0,q=y==="brief",lt=y==="detail",Nt=!q&&!lt&&(y==="list"||!String(m.query||"").trim()),V=q?ht(b,j):lt?gt(String(m.id||m.ref||"")):Nt?xt(b,j):bt(String(m.query||""),b,j);return{ok:V.ok,output:V.ok?V.text:"[站内无结果] "+(V.note||""),error:"",image:""}})()):v?vt(String(m.query||"")).then(y=>({ok:y.ok,output:y.ok?y.text+(y.sources.length?`
来源：`+y.sources.join(" | "):""):"[未检索到] "+(y.note||""),error:"",image:""})):st(m.code).then(y=>({ok:!y.error,output:y.output,error:y.error,image:y.image}))).then(y=>{It("tool",t.ctx),n.step({round:f,tool:m.tool,code:x,output:y.output,error:y.error,image:y.image}),o.push({role:"assistant",content:h}),o.push({role:"user",content:`工具执行结果：
`+(y.error?"[错误] "+y.error+`
`:"")+(y.output||"(无输出/无结果)")+(y.image?`
（图形已收录，最终回答可引用）`:"")+`
请继续：`+k}),l(f+1,d)}).catch(y=>{const b=String(y?.message||y);n.step({round:f,tool:m.tool,code:x,output:"",error:b}),o.push({role:"assistant",content:h}),o.push({role:"user",content:"工具执行异常："+b+`
请调整思路，按原格式输出最终回答。`}),l(f+1,d)});return}if(!h.trim()){if(f>e){n.fail("模型返回空内容"),a(new Error("模型返回空内容"));return}n.setStatus("返回为空，重试中…"),l(f+1,d);return}t.onChunk&&!u&&t.onChunk(h,""),n.finish(),c(h)}).catch(S=>{if(r()){n.fail("已取消"),a(Object.assign(new Error("已取消"),{cancelled:!0}));return}n.fail(String(S?.message||S)),a(S)})};l(1,!1)})}function yt(t,e){return String(t||"").replace(/\s+/g," ").trim().slice(0,e)}function Tt(t){return["你是考研学习的工程助手，可以使用 Python 工具（numpy/sympy/matplotlib 已就绪）与联网搜索工具。","工作方式（严格遵守）：",t==="fc"?'1) 需要计算/验算/画图时直接调用 python_exec 工具（参数 code=Python 代码）；需要事实/定义/背景/最新资料时调用 web_search 工具（参数 query=检索词）；平台真实执行并回传结果，不要输出 {"tool":...} 文本 JSON。':'1) 需要计算/验算/画图时，只输出一个 JSON 对象：{"tool":"python_exec","code":"<Python代码>"}；需要事实/定义/背景/最新资料时，只输出：{"tool":"web_search","query":"<检索词>"}。不要 markdown 代码块、不要多余文字，结果会真实回传。',"2) 画图用 matplotlib，直接 plt. 即可，图片会自动捕获展示给用户，无需 savefig/show。","3) 得出结论后，直接用正常的简体中文回答用户（自然文字，不要 JSON），结论必须有工具计算/检索结果支撑，不要臆造。","4) 一次任务里可以连续调用工具多轮（计算与搜索可交替），直到确有把握。"].join(`
`)}const fe=Tt("json");function me(t){return["你是考研题目的验算引擎，可以使用 Python 工具（numpy/sympy 已安装）。","工作方式（严格遵守）：",t==="fc"?["1) 需要计算/验算时，直接调用 python_exec 工具（原生 function calling，参数 code=要执行的Python代码），",'   平台真实执行并回传 stdout；不要输出 {"tool":...} 文本 JSON。优先用 sympy 做符号验算，辅以数值代入抽查。'].join(""):["1) 每次只输出一个 JSON 对象，不要 markdown 代码块、不要多余文字。",'2) 需要计算/验算时输出：{"tool":"python_exec","code":"<要执行的Python代码>"}。',"   代码将真实执行，stdout 会回传给你。优先用 sympy 做符号验算，辅以数值代入抽查。"].join(`
`),(t==="fc"?"2":"3")+") 验算完成或无需工具时"+(t==="fc"?"，用文本输出最终结论":"输出最终结论")+'：{"final":true,"verdict":"通过|不通过|无法确定","reason":"一句话依据"}。',(t==="fc"?"3":"4")+") 多次调用工具直到确有把握；不要臆造计算结果。"].join(`
`)}async function tt(t){const e=z(t.proto);return G({system:me(e),maxRounds:t.maxRounds||6,proto:e,ctx:t.ctx}).send(t.task,{onStep:t.onStep,isCancelled:t.isCancelled})}function G(t){const e=t?.maxRounds||20,n=z(t?.proto),s=oe(n,t?.ctx),r=t?.history?.length?t.history.slice():[{role:"system",content:String(t?.system||Tt(n))}];return{history:r,proto:n,async send(o,i){const c=[];r.push({role:"user",content:o});let a="";const p=d=>{const u=String(d||""),S=u.search(/\{[\s\S]*?"(?:tool|final)"\s*:/);return S>=0?u.slice(0,S).trim():/^\s*(?:`{0,3}[a-zA-Z]*)?\s*\{/.test(u)?"":u.trim()},l=function(d,u){const S=_t(d);if(S==="tool"){if(i?.onToolStream)try{i.onToolStream(d)}catch{}if(!i?.onText)return;f&&(i.onText("",""),f=!1),u&&i.onText("",u);return}if(!i?.onText)return;const h=d.search(/\{[\s\S]*?"(?:tool|final)"\s*:/),m=d.search(/<\s*\|?\s*DSML\s*\|?/i),g=h<0?m:m<0?h:Math.min(h,m);if(g>=0){if(/"tool"\s*:/.test(d)&&i?.onToolStream)try{i.onToolStream(d)}catch{}const v=d.slice(0,g).trim(),_=(a?a+`

`:"")+v;u?i.onText(_,u):v&&i.onText(_,"");return}if(S==="hold"){u&&i.onText("",u);return}if(/^\s*(?:`{0,3}[a-zA-Z]*)?\s*\{/.test(d)){u&&i.onText("",u);return}f=!0,i.onText(a?a+`

`+d:d,u)};let f=!1;for(let d=1;d<=e;d++){if(i?.isCancelled&&i.isCancelled()){const h={round:d,type:"text",text:"已取消"};return c.push(h),r.push({role:"assistant",content:"（已取消）"}),i?.onStep&&i.onStep(h),{finalText:"已取消",verdict:"",steps:c,rounds:d}}let u;try{u=await s.runRound(r,l)}catch(h){return{finalText:"AI 调用失败："+String(h?.message||h),verdict:"",steps:c,rounds:d}}if(f=!1,u.kind==="tool"){const h=u.name==="web_search",m=u.name==="site_search",g={round:d,type:"exec",tool:u.name,code:h?"🔍 "+String(u.args.query||""):m?"📚 站内 "+String(u.args.query||""):String(u.args.code||""),query:h||m?String(u.args.query||""):void 0};i?.onStep&&i.onStep(g);let v;if(m){const x=String(u.args.mode||""),k=x==="brief",A=x==="detail",y=!k&&!A&&(x==="list"||!String(u.args.query||"").trim()),b=k?ht(u.args.sources,u.args.subject):A?gt(String(u.args.id||"")):y?xt(u.args.sources,u.args.subject):bt(String(u.args.query||""),u.args.sources,u.args.subject);g.code=k?" 全站简报":A?" 取全文 "+String(u.args.id||"").slice(0,30):y?" 站内清单":" 站内 "+String(u.args.query||""),g.output=b.ok?yt(b.text,220):"[站内无结果] "+(b.note||""),v=ne(b,s.name)}else if(h){const x=await vt(String(u.args.query||""));g.output=x.ok?yt(x.text,200):"[未检索到] "+(x.note||""),g.searchSources=x.sources,v=ee(x,s.name)}else{const x=await st(String(u.args.code||""));g.output=x.output,g.error=x.error,g.image=x.image,v=te(x,s.name)}c.push(g),i?.onStep&&i.onStep(g),s.pushToolTurn(r,u,v);const _=p(u.raw);_&&(a=(a?a+`

`:"")+_);continue}if(u.kind==="final"){const h={round:d,type:"final",text:String(u.obj.reason||u.obj.verdict||"")};return c.push(h),i?.onStep&&i.onStep(h),s.pushTextTurn(r,u.raw),{finalText:(a?a+`

`:"")+(u.obj.verdict?"【"+u.obj.verdict+"】":"")+(u.obj.reason||""),verdict:String(u.obj.verdict||""),steps:c,rounds:d}}const S={round:d,type:"text",text:u.raw};return c.push(S),i?.onStep&&i.onStep(S),s.pushTextTurn(r,u.raw),{finalText:(a?a+`

`:"")+u.raw,verdict:"",steps:c,rounds:d}}return{finalText:"达到最大工具轮次（"+e+"）仍未收敛，请拆小问题或增加轮次。",verdict:"",steps:c,rounds:e}}}}const R=Q({running:!1,steps:[]});function D(){const t=N.get().settings;return!!(t.aiTools&&t.aiTools.enabled)}function At(t){N.update(e=>{e.settings.aiTools=Object.assign({enabled:!1},e.settings.aiTools,{enabled:t})})}function Z(){try{const t=N.get().settings;return!(t.aiTools&&t.aiTools.scopeAll===!1)}catch{return!0}}function Pt(t){N.update(e=>{e.settings.aiTools=Object.assign({enabled:!1},e.settings.aiTools,{scopeAll:t})})}function ye(){Pt(!Z()),window.App&&window.App.refresh()}function he(){let t="未探测";try{const n=P.activeApi();t=n&&n.fc===!0?"支持原生FC ✓":n&&n.fc===!1?"不支持原生FC ✗":"未探测 ?"}catch{}let e="json";try{e=z()}catch{}return"当前接口："+t+" · 生效："+(e==="fc"?"原生 FC":"JSON 协议")}function ge(t){N.update(n=>{n.ai.toolProto=t==="json"||t==="fc"?t:void 0});const e=window.Toast;e&&e.show("工具协议模式已设为 "+(t==="json"?"JSON（通用兜底）":t==="fc"?"原生 FC（强制，接口不支持时会失败）":"自动（跟随探测）"),"info",2500),window.App&&window.App.refresh()}function xe(){const t=window.Toast;let e=null;try{e=P.activeApi()}catch{}if(!e||!e.endpoint||!e.key||!e.model){t&&t.warn("当前接口配置不完整，无法探测");return}t&&t.show("🔍 正在探测「"+(e.name||e.model)+"」的原生 FC 能力…","info",28e3),P.probeFC(e).then(function(n){e.id&&P.setApiFc(e.id,n.v==="ok"?!0:n.v==="no"?!1:void 0),n.v==="ok"?t&&t.success("✅ 支持原生 FC，已标记（auto 模式将自动启用）"):n.v==="no"?t&&t.show("⛔ 不支持原生 FC，继续用 JSON 协议（通用兜底）","info",4e3):t&&t.show("❓ 探测不确定："+n.note+"，保守沿用 JSON 协议","info",4e3),window.App&&window.App.refresh()})}function be(){const t=D(),e=w.status,n=e==="ready"?"已就绪":e==="loading"?"下载中…":e==="error"?"加载失败":"未下载";let s="auto";try{s=String(N.get().ai.toolProto||"auto")}catch{}return'<div class="card" id="st-aitools-card"><div class="card-title-row"><span class="card-title">🧪 AI 工程台（实验功能）</span><button class="btn btn-ghost btn-sm" onclick="window.AiTools.settingsGo()">打开</button></div><div class="muted-sm" style="margin-bottom:6px">给 AI 增加真实工程能力：全站各模块的 AI（出题、批改、复盘、规划、教练对话等）自动获得多轮长程任务——调用本地 Python（numpy/sympy/matplotlib）真实计算、验算、画图，过程在右下角任务卡实时可见、可随时取消。默认关闭，不影响现有任何功能。</div><div class="muted-sm" style="margin-bottom:6px">状态：'+(t?"已启用":"未启用")+" · 组件："+n+(t?" · 覆盖："+(Z()?"全部模块":"仅测验/教练"):"")+'</div><div class="btn-row"><button class="btn btn-sm '+(t?"btn-ghost":"btn-primary")+'" onclick="window.AiTools.settingsToggle()">'+(t?"停用":"启用（本机）")+"</button>"+(t?'<button class="btn btn-sm btn-ghost" onclick="window.AiTools.settingsDownload()">'+(e==="ready"?"重新下载组件":"下载扩展组件（约10MB）")+"</button>":"")+(t?'<button class="btn btn-sm btn-ghost" data-testid="at-scope-btn" onclick="window.AiTools.settingsScope()">'+(Z()?"覆盖范围：全部模块（点击退回仅测验/教练）":"覆盖范围：仅测验/教练（点击扩展到全部模块）")+"</button>":"")+"</div>"+(t?'<div style="margin-top:8px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:12px" data-testid="at-proto-row" title="fc 仅作用于多轮 agent 会话（教练/验算/工程对话）；全站桥 toolChat 与出题闭环暂固定 JSON 协议。fc 会话会把请求钉在创建时的接口上，不做跨协议 failover。"><span class="muted-sm">工具调用协议：</span><select class="input" style="width:auto;font-size:12px;padding:2px 6px" data-testid="at-proto-sel" onchange="window.AiTools.settingsProto(this.value)">'+[["auto","自动（跟随接口探测）"],["json","JSON 协议（通用兜底）"],["fc","原生 FC（强制）"]].map(function(r){return'<option value="'+r[0]+'"'+(s===r[0]?" selected":"")+">"+r[1]+"</option>"}).join("")+'</select><button class="btn btn-sm btn-ghost" data-testid="at-probe-btn" onclick="window.AiTools.settingsProbe()">🔍 探测当前接口</button><span class="muted-sm" data-testid="at-proto-state">'+he()+"</span></div>":"")+"</div>"+(t?jt():"")}function Se(){At(!D()),window.App&&window.App.refresh()}function we(){window.Toast&&window.Toast.show("⏳ 正在下载扩展组件（约 10MB，仅此一次）…","info",8e3),U(t=>{window.Toast&&window.Toast.show(t,"info",3e3)}).then(()=>{window.Toast&&window.Toast.success("✅ 扩展组件就绪（numpy + sympy）"),window.App&&window.App.refresh()}).catch(t=>{window.Toast&&window.Toast.danger("扩展组件加载失败："+String(t?.message||t))})}function ve(){window.App&&window.App.go("aitools")}function jt(){const e='<div class="card" id="at-res-card"><div class="card-title-row"><span class="card-title">📦 组件资源管理</span><button class="btn btn-ghost btn-sm" onclick="window.AiTools.resRefresh()">↻ 刷新状态</button></div><div class="muted-sm" style="margin-bottom:6px">基础组件随首次下载安装；画图/数值组件默认「首次使用时按需下载」——重度用户可点「预载」提前装好，出题配图与 scipy 计算零等待。装过即记忆：重启后自动从缓存后台恢复，无需手动操作。</div>'+[["runtime","Pyodide 运行时（内核 + 标准库）","≈10MB",!0],["numpy","numpy（数值计算）","≈7MB",!0],["sympy","sympy（符号验算核心）","≈11MB",!0],["mpl","matplotlib（精确画图）","≈9MB",!1],["font","SimHei 中文字体（图内中文）","≈4.7MB",!1],["scipy","scipy（数值积分/优化）","≈12MB",!1]].map(function(n){return'<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--line);font-size:12.5px"><span style="flex:1">'+n[1]+(n[3]?' <span class="tag">基础</span>':' <span class="tag">画图</span>')+'</span><span class="muted-sm" style="width:64px;text-align:right">'+n[2]+'</span><span data-rs="'+n[0]+'" style="width:84px;text-align:right;font-weight:600">…</span></div>'}).join("")+'<div class="btn-row" style="margin-top:8px"><button class="btn btn-sm btn-primary" onclick="window.AiTools.resPreload()">🎨 预载画图组件（matplotlib + 中文字体 + scipy ≈26MB）</button></div></div>';return setTimeout(()=>{if(typeof document<"u"&&document.body)try{W()}catch{}},60),setTimeout(()=>{if(typeof document<"u"&&document.body)try{W()}catch{}},4e3),e}function W(){Bt().then(t=>{if(typeof document>"u"||!document.body)return;const e={runtime:t.runtime,numpy:t.numpy,sympy:t.sympy,mpl:t.mpl,font:t.font,scipy:t.scipy};Object.keys(e).forEach(n=>{const s=document.querySelector('[data-rs="'+n+'"]');s&&(s.textContent=e[n]?"✓ 已装载":"未装载",s.style.color=e[n]?"var(--ok,#237804)":"var(--text-muted,#888)")})}).catch(()=>{})}function _e(){const t=window.Toast;if(!J()){t&&t.warn("基础组件未就绪——先点上方「下载扩展组件」");return}t&&t.show("⏳ 正在预载画图组件（matplotlib + 中文字体 + scipy ≈26MB，仅首次，视网速约 1~3 分钟）…","info",1e4),Ht(e=>{t&&t.show(e,"info",3e3)}).then(()=>{t&&t.success("✅ 画图 + scipy 组件就绪——出题配图与数值计算零等待"),W()}).catch(e=>{t&&t.danger("预载失败："+String(e.message||e)),W()})}function ke(t,e,n,s){R.running=!0,R.steps=[];const r=["请验算下面这道考研题目的答案是否正确。","【题目】"+(t||"（无题干）"),"【给出的答案】"+(e||"（无）"),"【给出的解析】"+(n||"（无）"),"要求：先用 sympy 独立重新求解/验算（不要照抄解析），再数值代入抽查，最后给出结论。"].join(`
`);return tt({task:r,maxRounds:6,onStep:o=>{R.steps.push(o),s&&s.onStep&&s.onStep(o)},isCancelled:s&&s.isCancelled}).finally(()=>{R.running=!1})}const Te=new Map,F=new Map,X=new Map;function E(t){return String(t||"").replace(/</g,"&lt;")}function B(t,e,n,s,r){const o=[],i=(l,f,d)=>{t.innerHTML='<div class="card" style="margin-top:12px" data-testid="at-verify-card"><div class="card-title-row"><span class="card-title">'+r+'</span><span class="tag" style="background:'+(l==="通过"?"#237804":l==="不通过"?"#cf1322":"#8c8c8c")+';color:#fff">'+(d?"验算中…":l||"完成")+"</span></div>"+o.join("")+'<div style="margin-top:6px"><b style="color:'+(l==="通过"?"#237804":l==="不通过"?"#cf1322":"inherit")+'">'+(d?"AI 正在自主调用 Python 工具验算…":E(f||"完成"))+"</b></div></div>"},c=e.get(n);if(c){i(c.verdict,c.report,!1);return}const a=X.get(n);if(a){i("","",!0),a.then(l=>i(l.verdict,l.report,!1)).catch(l=>i("失败","验算失败："+String(l?.message||l),!1));return}i("","",!0);const p=tt({task:s,maxRounds:6,onStep:l=>{l.type==="exec"&&(o.push('<details style="margin-top:6px"><summary class="muted-sm" style="cursor:pointer">第 '+l.round+' 轮 · AI 调用 Python 工具（点击展开代码与输出）</summary><pre class="report" style="font-size:12px">'+E(l.code)+'</pre><pre class="report" style="font-size:12px;opacity:.8">输出：'+E(l.output||"(无)")+(l.error?`
错误：`+E(l.error):"")+"</pre></details>"),i("","",!0))}}).then(l=>{if(e.set(n,{verdict:l.verdict,report:l.finalText}),e.size>30){const f=e.keys().next().value;f!==void 0&&e.delete(f)}return i(l.verdict,l.finalText,!1),{verdict:l.verdict,report:l.finalText}}).catch(l=>{throw i("失败","验算失败："+String(l?.message||l),!1),l});X.set(n,p),p.finally(()=>{X.delete(n)}),p.catch(()=>{})}function Ae(t){const e=[{role:"system",content:t.system+`
`+ae},{role:"user",content:t.ask+`

（环境提醒：本会话支持多轮工具调用——需要计算时输出 {"tool":"python_exec","code":"…"} 并立即停止本轮，Python 会真实执行并把结果回传给你。数学题的标准答案必须先用它算出。）`}],n=8,s=[];return new Promise((r,o)=>{const i=c=>{if(t.isCancelled&&t.isCancelled()){o(Object.assign(new Error("已取消"),{cancelled:!0}));return}P.chatMessagesStream(e,function(a,p){t.onStream&&t.onStream(a||"",p||"")},{cache:!1,timeout:18e4,ctx:t.ctx}).then(a=>{let p=null;try{p=P.extractRobustJSON(a)}catch{p=null}if(p&&p.tool==="python_exec"&&typeof p.code=="string"){st(p.code).then(l=>{if(l.image&&String(l.image).indexOf("data:image")===0&&s.push(l.image),t.onStep&&t.onStep({round:c,type:"exec",code:p.code,output:l.output,error:l.error,image:l.image}),e.push({role:"assistant",content:a}),e.push({role:"user",content:`工具执行结果：
`+(l.error?"[错误] "+l.error+`
`:"")+(l.output||"(无输出，请用 print 输出结论)")+(l.image?`
（图形已收录，可作为题目配图）`:"")+`
请继续：需要再算/画图输出 {"tool":...}；算好了只输出题目 JSON 本体。`}),c>=n){o(new Error("达到最大工具轮次仍未输出题目 JSON"));return}i(c+1)});return}if(p&&p.stem){delete p.tool,s.length&&(p.diagramImg=s[s.length-1],p.diagrams=s.slice()),r(p);return}if(c>=n){o(new Error("AI 未输出有效题目 JSON。最后输出前200字："+a.slice(0,200)));return}e.push({role:"assistant",content:a}),e.push({role:"user",content:"请严格只输出题目 JSON 本体（含 stem/type/options/answer/solution/trap 字段），不要其他内容。"}),i(c+1)}).catch(o)};i(1)})}function Pe(t,e){try{if(!t||!D())return;if(!J()){t.innerHTML='<div class="muted-sm" style="margin-top:10px">🧪 AI 工程验算：组件未就绪（到「AI 工程台」下载扩展组件后，出题将自动附带 sympy 真实验算）。</div>';return}const n=["请验算下面这道考研题目的答案是否正确。","【题目】"+(e.stem||"（无题干）"),"【给出的答案】"+(e.answer||"（无）"),"【给出的解析】"+(e.solution||"（无）"),"要求：先用 sympy 独立重新求解/验算（不要照抄解析），再数值代入抽查，最后给出结论。"].join(`
`);B(t,Te,e.key,n,"🧪 AI 工程验算（sympy 真实计算）")}catch{}}function je(t,e){try{if(!D())return;(e||[]).forEach(n=>{if(!n||!n.aiAnalysis||!(n.aiAnalysis.keySteps||n.aiAnalysis.solution))return;const s=t.querySelector('[data-pm-verify="'+n.id+'"]');if(!s)return;const r=n.id+"|"+(n.updatedAt||n.createdAt||""),o="🧪 AI 工程验算（解析防幻觉）";if(F.get(r)){B(s,F,r,"",o);return}if(X.has(r)){B(s,F,r,"",o);return}s.innerHTML='<div class="card" style="margin-top:12px"><div class="card-title-row"><span class="card-title">🧪 AI 工程验算（解析防幻觉）</span></div><div class="btn-row"><button class="btn btn-sm btn-ghost" data-pm-verify-run="'+n.id+'">🔬 手动验算（AI 调 sympy 核对解析，消耗 token）</button></div></div>';const c=s.querySelector('[data-pm-verify-run="'+n.id+'"]');c&&(c.onclick=function(){const a=["请验算这道拍题的 AI 解析是否正确（防解析幻觉）。","【题目】"+(n.extractedQuestion||n.note||"（无题干）"),"【AI 给出的解题关键】"+(n.aiAnalysis.keySteps||n.aiAnalysis.solution||"（无）"),"【易错原因】"+(n.aiAnalysis.errorCause||"（无）"),"要求：先用 sympy 独立重新求解（不要照抄解析），对照 AI 的解题关键逐步核对，再数值代入抽查，最后给出结论（AI 解析有错请明确指出错在哪一步）。"].join(`
`);if(J()){B(s,F,r,a,o);return}const p=l=>{s.innerHTML='<div class="muted-sm" style="margin-top:10px">⏳ '+String(l||"").replace(/</g,"&lt;")+"</div>"};p("正在加载工程组件（约 10MB，仅首次）…"),U(l=>p(l)).then(()=>B(s,F,r,a,o)).catch(l=>{s.innerHTML='<div class="muted-sm" style="margin-top:10px">工程组件加载失败：'+String(l&&l.message||l).replace(/</g,"&lt;")+"（检查网络后重试）</div>"})})})}catch{}}var I=null;function Ce(){I=null}function Oe(t,e){if(I&&!e?.fresh)return t.innerHTML="",t.appendChild(I.root),I.panel;var n=document.createElement("div");n.innerHTML='<div class="card"><div class="card-title-row"><span class="card-title">🤖 AI 工程出题中…</span><button class="btn btn-sm btn-ghost" data-testid="qes-cancel">取消</button></div><div style="margin:6px 0"><span class="tag" data-testid="qes-status" style="background:#8c8c8c;color:#fff"></span></div><details open style="margin-top:8px"><summary class="muted-sm" style="cursor:pointer">💭 思考过程（实时流式）</summary><pre class="report" data-testid="qes-think" style="max-height:220px;overflow:auto;opacity:.72;font-size:12px;white-space:pre-wrap;margin-top:4px"></pre></details><div data-testid="qes-tools" style="margin-top:8px"></div><div data-testid="qes-content-wrap" style="display:none;margin-top:10px"><div class="card-title-sm">📝 题面生成（基于已验证数值）</div><pre class="report" data-testid="qes-content" style="max-height:260px;overflow:auto;white-space:pre-wrap;font-size:12px"></pre></div></div>',t.innerHTML="",t.appendChild(n);var s=0,r=!1,o=null,i=0,c=n.querySelector('[data-testid="qes-status"]'),a=n.querySelector('[data-testid="qes-think"]'),p=n.querySelector('[data-testid="qes-think-wrap"]'),l=n.querySelector('[data-testid="qes-tools"]'),f=n.querySelector('[data-testid="qes-content"]'),d=n.querySelector('[data-testid="qes-content-wrap"]'),u=n.querySelector('[data-testid="qes-cancel"]');u&&e&&e.onCancel&&(u.onclick=function(){e.onCancel()});var S=!1,h=0,m=null;function g(){S=!0,h=Date.now(),m&&clearInterval(m);var k=function(){if(S){var A=Math.round((Date.now()-h)/1e3);_("📤 已发送出题请求，等待模型响应…（"+A+"s）"),m=setTimeout(k,1e3)}};k()}function v(){S=!1,m&&(clearInterval(m),m=null)}function _(k,A){c&&(c.textContent=k,A&&(c.style.background=A))}g();var x={setStatus:_,stream:function(k,A){r||(r=!0,v(),_("✅ 已连接 · 流式接收中…","#1a7f37")),A&&(p&&(p.style.display=""),a&&(a.textContent=A,a.scrollTop=a.scrollHeight));var y=String(k||"").trim();if(y.indexOf('{"tool"')===0){var b=s+1;_("🛠 第 "+b+" 轮：AI 正在构造 Python 计算代码…","#8c8c8c"),(i!==b||!o||!o.parentNode)&&(o&&o.parentNode&&o.parentNode.removeChild(o),o=document.createElement("details"),o.setAttribute("data-round-draft",String(b)),o.style.margin="6px 0",o.open=!0,o.innerHTML='<summary class="muted-sm" style="cursor:pointer">🛠 第 '+b+' 轮 · 正在构造 Python 计算代码…</summary><pre class="report" style="font-size:12px;white-space:pre-wrap"></pre>',l&&l.appendChild(o),i=b);var j=o.querySelector("pre");if(j)try{j.textContent=JSON.parse(y).code||y}catch{j.textContent=y}return}y&&(v(),_("✍ 正在撰写题面（基于已验证数值）…","#1a7f37"),d&&(d.style.display=""),f&&(f.textContent=y,f.scrollTop=f.scrollHeight))},toolRound:function(k,A,y,b,j){if(s=Math.max(s,k),v(),o&&i===k&&(o.parentNode&&o.parentNode.removeChild(o),o=null,i=0),_("🛠 第 "+k+" 轮计算完成 ✓ → 继续分析结果…","#1a7f37"),!!l){l.style.display="";var q=document.createElement("details");q.style.margin="6px 0",q.open=!0,q.innerHTML='<summary class="muted-sm" style="cursor:pointer">🛠 第 '+k+" 轮 · Python 计算完成"+(b?"（出错，已回传修正）":" ✓")+'</summary><pre class="report" style="font-size:12px;white-space:pre-wrap">'+E(A)+'</pre><pre class="report" style="font-size:12px;opacity:.8;white-space:pre-wrap">→ 输出：'+E(y||"(无)")+(b?`
错误：`+E(b):"")+"</pre>"+(j?'<img src="'+E(j)+'" alt="工具产图" style="max-width:100%;border-radius:8px;border:1px solid var(--line);margin-top:6px;background:#fff">':""),l.appendChild(q)}},done:function(){v(),_("✅ 完成","#237804"),I=null}};return I={root:n,panel:x},x}const C=Q({items:[],running:!1});let O=null;function qe(){return O||(O=G({maxRounds:20})),O}function Ct(t,e){if(t=String(t||"").trim(),!t||C.running)return;if(!J()){window.Toast&&window.Toast.warn("扩展组件未就绪，请先下载（约 10MB）");return}C.items.push({role:"user",text:t,steps:[]});const n=Q({role:"assistant",text:"",steps:[],image:""});C.items.push(n),C.running=!0,qe().send(t,{onStep:s=>{s.type==="exec"&&(n.steps.push(s),s.image&&(n.image=s.image))},isCancelled:e}).then(s=>{n.text=s.finalText||"（完成）"}).catch(s=>{n.text="AI 调用失败："+String(s?.message||s)}).finally(()=>{C.running=!1,qt()})}const ct="kaoyan2026_aitools_chat";function Ee(t,e="copilot.chat"){const n=z();return G({system:(t||"")+(n==="fc"?ue:ce),maxRounds:20,proto:n,ctx:e})}function Ot(){O=null,C.items.length=0;try{localStorage.removeItem(ct)}catch{}}function qt(){try{const t=O?O.history.slice(-40):[],e=C.items.slice(-30),n=O?O.proto:"";localStorage.setItem(ct,JSON.stringify({hist:t,items:e,proto:n}))}catch{}}function Ne(){try{const t=localStorage.getItem(ct);if(!t)return;const e=JSON.parse(t);if(Array.isArray(e.items)&&e.items.length&&e.items.forEach(function(n){C.items.push({role:n.role==="user"?"user":"assistant",text:String(n.text||""),steps:Array.isArray(n.steps)?n.steps:[],image:n.image||""})}),Array.isArray(e.hist)&&e.hist.length){if(e.proto&&e.proto!==z()){console.warn("[AiTools] 工具协议已切换（"+e.proto+" → "+z()+"），丢弃跨协议会话上下文");return}O=G({history:e.hist})}}catch{}}function Le(){try{if(!D()||w.status!=="idle")return;setTimeout(function(){U(function(){}).catch(function(){})},1500)}catch{}}const Et={settingsCard:be,settingsToggle:Se,settingsDownload:we,settingsGo:ve,resourceCard:jt,resRefresh:W,resPreload:_e,ensureLoaded:U,isReady:J,loaderState:w,pytoolsState:R,chatState:C,renderExamPanel:Oe,resetExamPanel:Ce,newCoachSession:Ee,chatSend:Ct,chatReset:Ot,saveChat:qt,restoreChat:Ne,maybeAutoLoad:Le,verifyAnswer:ke,quizAutoVerify:Pe,photoAutoVerify:je,generateQuestion:Ae,runAgent:tt,enabled:D,setEnabled:At,toolChat:kt,scopeAll:Z,setScopeAll:Pt,settingsScope:ye,settingsProto:ge,settingsProbe:xe};try{window.AiTools=Et}catch{}const Je=Object.freeze(Object.defineProperty({__proto__:null,AiTools:Et,SYSTEM_GENERAL:fe,chatReset:Ot,chatSend:Ct,chatState:C,createAgentSession:G,ensureLoaded:U,isReady:J,loaderState:w,pytoolsState:R,runAgent:tt,toolChat:kt},Symbol.toStringTag,{value:"Module"}));export{Et as A,Ct as a,R as b,C as c,Ot as d,z as e,Je as i,w as l,Ht as p,Bt as r};
