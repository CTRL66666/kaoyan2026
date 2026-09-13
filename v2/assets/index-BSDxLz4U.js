import{C as At,c as Pt,A as _,S as j}from"./ai-BgMe9yo4.js";import{M as Z}from"./vendor-BVCdKi1G.js";const it="0.26.4",Ct=[`https://cdn.jsdelivr.net/pyodide/v${it}/full/`,`https://registry.npmmirror.com/-/binary/pyodide/v${it}/full/`],w=Z({status:"idle",log:[],lastError:"",progress:{pct:0,msg:""}});function at(t){w.log.push(t),w.log.length>200&&w.log.shift()}const Ot=`
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
`;let S=null,L=null,X=null;const D=new Map;let jt=0;const ct="kaoyan2026_at_mpl";function pt(t){if(t.type==="log"){at(t.text),X&&X(t.text);return}if(t.type==="progress"){w.progress.pct=Math.max(0,Math.min(100,Math.round(t.pct))),w.progress.msg=t.msg||"";return}if(t.type==="ready"){w.status="ready",at("✅ 基础组件就绪（numpy + sympy，Worker 沙箱）");try{localStorage.getItem(ct)==="1"&&S?.postMessage({type:"preload-mpl"})}catch{}return}if(t.type==="mpl-on"){try{localStorage.setItem(ct,"1")}catch{}return}if(t.type==="load-error"){w.status="error",w.lastError=t.error;return}if(t.type==="stdout"||t.type==="stderr"){const e=D.get(t.id);e&&(e.stdout+=t.text+`
`);return}if(t.type==="exec-done"){const e=D.get(t.id);if(!e)return;clearTimeout(e.timer),D.delete(t.id),e.resolve({ok:!!t.ok,output:String(t.output||"").slice(0,1500),error:String(t.error||""),timedOut:!1,image:t.image||""})}}function Et(){const t=new Blob([Ot],{type:"application/javascript"}),e=new Worker(URL.createObjectURL(t));return e.onmessage=n=>pt(n.data),e.onerror=n=>{w.status="error",w.lastError="Worker 错误："+(n.message||"unknown")},e}function dt(t){return t&&(X=t),S&&w.status==="ready"?Promise.resolve(S):L||(w.status="loading",L=new Promise((e,n)=>{const o=Et();S=o;const r=i=>{i.type==="ready"?e(o):i.type==="load-error"&&(S=null,L=null,n(new Error(i.error)))},s=o.onmessage;o.onmessage=function(i){const c=i.data||{};(c.type==="ready"||c.type==="load-error")&&(o.onmessage=s,r(c)),pt(c)},o.postMessage({type:"load",cdns:Ct})}),L)}function Nt(){try{S&&S.terminate()}catch{}S=null,L=null,w.status="idle"}function W(t){return dt(t).then(()=>{})}function R(){return w.status==="ready"}const tt={runtime:!1,numpy:!1,sympy:!1,mpl:!1,font:!1,scipy:!1};function Lt(){return new Promise(t=>{if(!S||w.status!=="ready"){t(Object.assign({},tt));return}const e=n=>{const o=n.data||{};o.type==="status-info"&&(S?.removeEventListener("message",e),t(Object.assign({},tt,o.st||{})))};S.addEventListener("message",e),S.postMessage({type:"status"}),setTimeout(()=>{S?.removeEventListener("message",e),t(Object.assign({},tt))},5e3)})}let N=null;function Mt(t){return N||(t&&(X=t),N=new Promise((e,n)=>{if(!S||w.status!=="ready"){N=null,n(new Error("基础组件未就绪（先在上方下载基础组件）"));return}let o=!1;const r=(c,l)=>{o||(o=!0,clearTimeout(i),S?.removeEventListener("message",s),N=null,c?e():n(new Error(l||"预载失败")))},s=c=>{const l=c.data||{};l.type==="preload-done"&&r(!!l.ok,l.error)},i=setTimeout(()=>r(!1,"预载超时（240s）——重试或查看工程台日志"),24e4);S.addEventListener("message",s),S.postMessage({type:"preload-mpl"})}),N)}function nt(t,e=3e4){return dt().then(n=>new Promise(o=>{const r=++jt,s={resolve:o,stdout:"",timer:setTimeout(()=>{D.delete(r),Nt(),o({ok:!1,output:s.stdout.slice(0,1500),error:"执行超时（"+Math.round(e/1e3)+"s 上限，已强制终止该次执行）",timedOut:!0})},e)};D.set(r,s),n.postMessage({type:"exec",id:r,code:String(t||"")})}))}function Y(t,e){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function ot(t,e,n){const o=new AbortController,r=setTimeout(()=>{try{o.abort()}catch{}},e);return fetch(t,Object.assign({signal:o.signal},n)).finally(()=>clearTimeout(r))}function It(){try{const t=window.Store,e=t&&t.get().ai||{},n=e.apis||[],o=n.find(i=>i.id===e.activeApi)||n[0],r=String(o&&o.endpoint||e.endpoint||"").toLowerCase(),s=String(o&&o.key||e.key||"");return s?r.includes("bigmodel.cn")?{provider:"zhipu",key:s}:r.includes("moonshot.cn")?{provider:"kimi",key:s}:r.includes("dashscope.aliyuncs.com")?{provider:"dashscope",key:s}:{provider:"",key:s}:{provider:"",key:""}}catch{return{provider:"",key:""}}}async function qt(t,e,n){try{const o=await ot("https://open.bigmodel.cn/api/paas/v4/web_search",n,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify({search_query:t,search_engine:"search-std",count:8})});if(!o.ok)return{ok:!1,text:"",sources:[],note:"智谱搜索 HTTP "+o.status};const r=await o.json(),s=Array.isArray(r?.result)?r.result:[];if(!s.length)return{ok:!1,text:"",sources:[],note:"智谱搜索无结果"};const i=s.slice(0,8).map(l=>"【"+Y(l.title,60)+"】"+Y(l.content,500)),c=s.map(l=>l.link).filter(Boolean).slice(0,6);return{ok:!0,text:i.join(`

`).slice(0,3e3),sources:c}}catch(o){return{ok:!1,text:"",sources:[],note:"智谱搜索不可达："+String(o?.message||o)}}}async function Rt(t,e,n,o){try{const r=o||"https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",s=(()=>{try{const m=window.Store.get().ai,d=(m.apis||[]).find(p=>p.id===m.activeApi)||(m.apis||[])[0];return d&&d.model||"qwen-plus"}catch{return"qwen-plus"}})(),i=await ot(r,n,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify({model:s,messages:[{role:"user",content:"请联网检索并客观汇总以下主题的关键信息（列出要点与来源网址，不要评论）："+t}],enable_search:!0,search_options:{enable_source:!0,search_strategy:"max"}})});if(!i.ok)return{ok:!1,text:"",sources:[],note:"千问联网搜索 HTTP "+i.status};const c=await i.json(),l=c?.choices?.[0]?.message,u=Y(l?.content,2800);if(!u)return{ok:!1,text:"",sources:[],note:"千问联网搜索无内容"};const a=[];try{(c?.search_info?.search_results||c?.output?.search_info?.search_results||[]).forEach(d=>{(d?.url||d?.link)&&a.push(d.url||d.link)}),(l?.annotations||[]).forEach(d=>{const p=d?.url_citation?.url||d?.url;p&&a.push(p)})}catch{}return{ok:!0,text:"【千问·联网检索】"+u,sources:a.slice(0,6)}}catch(r){return{ok:!1,text:"",sources:[],note:"千问联网搜索不可达："+String(r?.message||r)}}}async function zt(t,e,n){try{const o=await ot("https://api.moonshot.cn/v1/kimi_search_api",n,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify({model:"kimi-search-api",messages:[{role:"user",content:t}]})});if(!o.ok)return{ok:!1,text:"",sources:[],note:"Kimi 搜索 HTTP "+o.status};const r=await o.json(),s=r?.choices?.[0]?.message?.content;if(!s)return{ok:!1,text:"",sources:[],note:"Kimi 搜索无内容"};const i=[];try{(r?._citations||r?.citations||[]).forEach(c=>{const l=typeof c=="string"?c:c?.url||c?.original_url;l&&i.push(l)})}catch{}return{ok:!0,text:Y(s,3e3),sources:i.slice(0,6)}}catch(o){return{ok:!1,text:"",sources:[],note:"Kimi 搜索不可达："+String(o?.message||o)}}}async function Jt(t,e){let n="auto",o="";try{const c=window.Store.get().settings||{};n=c.searchProvider||"auto",o=String(c.searchKey||"")}catch{}if(n==="fallback")return null;const r=It(),s=n==="auto"?r.provider:n,i=o||r.key;return!s||!i?null:s==="zhipu"?qt(t,i,e):s==="dashscope"?Rt(t,i,e):s==="kimi"?zt(t,i,e):null}function $(t,e){return String(t||"").replace(/\s+/g," ").trim().slice(0,e)}async function lt(t,e,n){try{const o=new URLSearchParams({action:"query",list:"search",srsearch:t,format:"json",srlimit:"1",origin:"*"}),i=(await(await et(`https://${e}.wikipedia.org/w/api.php?`+o.toString(),n)).json())?.query?.search?.[0];if(!i?.title)return{};const c=new URLSearchParams({lang:e==="zh"?"zh-cn":"en",format:"json",origin:"*"}),u=await(await et(`https://${e==="zh"?"zh":"en"}.wikipedia.org/api/rest_v1/page/summary/`+encodeURIComponent(i.title)+"?"+c.toString(),n)).json();return{title:i.title,extract:u?.extract||"",url:u?.content_urls?.desktop?.page||"https://"+e+".wikipedia.org/wiki/"+encodeURIComponent(i.title)}}catch{return{net:!0}}}async function Ft(t,e){try{const o=await(await et("https://api.duckduckgo.com/?"+new URLSearchParams({q:t,format:"json",no_html:"1",skip_icon_info:"1"}).toString(),e)).json(),r=[],s=o?.RelatedTopics||[];for(const i of s){const c=i?.Topics||[i];for(const l of c)if(l?.Text&&r.push($(l.Text,160)),r.length>=4)break;if(r.length>=4)break}return{text:$(o?.AbstractText||"",600),url:o?.AbstractURL||"",related:r}}catch{return{text:"",related:[],net:!0}}}function et(t,e){const n=new AbortController,o=setTimeout(()=>{try{n.abort()}catch{}},e);return fetch(t,{signal:n.signal,headers:{Accept:"application/json"}}).finally(()=>clearTimeout(o))}async function ft(t,e){const n=String(t||"").trim().slice(0,200);if(!n)return{ok:!1,text:"",sources:[],note:"空查询"};const o=12e3;let r="";try{const s=await Jt(n,o);if(s&&s.ok)return s;s&&s.note&&(r=s.note+"；")}catch{}try{const[s,i,c]=await Promise.all([lt(n,"zh",o),lt(n,"en",o),Ft(n,o)]),l=[],u=[];s.extract&&(l.push("【维基·"+s.title+"】"+$(s.extract,700)),s.url&&u.push(s.url)),i.extract&&i.extract!==s.extract&&(l.push("[Wiki·"+i.title+"] "+$(i.extract,500)),i.url&&u.push(i.url)),c.text&&(l.push("【DDG 摘要】"+c.text),c.url&&u.push(c.url)),c.related.length&&l.push("【相关】"+c.related.join("；"));const a=l.join(`

`).slice(0,3e3);if(!a){const m=s.net&&i.net&&c.net,d=r+(m?"联网源（维基百科/DuckDuckGo）均无法连接——中国大陆网络通常访问不到这些站点。建议在「设置→云端AI」配置智谱/千问等带官方搜索的接口（自动复用其 key），或改用已有知识作答。":"已连接但无匹配结果（该主题可能无百科/即时答案）。");return{ok:!1,text:"",sources:[],note:d}}return{ok:!0,text:a,sources:u.slice(0,6)}}catch(s){return{ok:!1,text:"",sources:[],note:"搜索失败："+String(s?.message||s)}}}function Ht(t){let e=Pt(),n=!1;return e||(e=At.aiFloat("🛠 "+t),n=!0),e.toolTask(t,{primary:n})}const st=["【工程工具模式（已启用：沙箱 Python，numpy/sympy/matplotlib 就绪）】","⚠️ 你【确实拥有】python_exec 工具且它真实可用——本环境不依赖平台工具栏/函数调用开关，",'工具通过在回复中直接输出 JSON 调用（{"tool":"python_exec","code":"…"}），结果会真实回传。','不要因为"以为自己没有工具"而跳过计算或说"我无法执行代码"。',"【多轮循环机制】这不是一次性问答：你输出工具 JSON 后【立即停止本轮】，系统真实执行并把",'stdout/错误作为新消息回传给你，你再继续——来回多轮直到完成；"先输出工具 JSON 等结果"是完全可行且被支持的，不是自言自语。'].join(`
`),Dt=`
`+st+`
`+['【指令优先级】"只输出题目 JSON"指的是【最终交付物】；计算验证阶段输出工具 JSON 不违反它，恰恰是必经之路。',"【出题工作循环——像人类命题人一样闭环工作（严格遵守）】","① 产生思路：确定考点、解法、难度定位与命题意图。",'② 计算验证：调用 Python 工具（只输出 {"tool":"python_exec","code":"<sympy/numpy 代码>"}）真实算出标准答案与关键中间量——严禁凭感觉编造数值答案。',"③ 闭环调整：检查计算结果——若答案/难度/计算量不符合命题意图，调整思路再算（可多轮）；若发现之前的解法有问题，推翻重来。","④ 验收合格：标准答案经工具确认无误、题面所需数值全部落实。","⑤ 开始出题：围绕已验证的数值与思路，只输出题目 JSON 本体（格式：stem/type/options/answer/solution/trap），不要再带工具标记。","【配图规约（重要）】几何图形/函数图像/积分区域/数据图等需要配图的题：在验证阶段用 python_exec + matplotlib","画出精确图形（figsize≈(4,3)，含坐标轴/刻度/图例，关键点与区域标注清晰）。numpy/sympy【已在环境中装好】；","matplotlib / scipy 首次使用时【自动装载】（直接 import 即可，等待片刻即可）——","严禁 micropip / pyodide.loadPackage / asyncio（不存在也不需要，用了必报错）；","图【不需要 savefig 到文件】（沙箱无文件语义，画完留在内存即可，也无需 plt.show()）；系统自动收取图形作为题目配图，","严禁把文件路径（如 /tmp/xx.png）写进题面/解析/JSON。","【课本风·必用助手】环境已内置 at_style2d / at_style3d——标准右手系、原点式坐标轴箭头、半透明面板，与教材例题同款：",'平面图：ax = plt.gca(); at_style2d(ax)；立体图（曲面/空间曲线/区域/向量）：ax = fig.add_subplot(projection="3d"); at_style3d(ax)。',"图中标注优先用 LaTeX 数学记号（$...$）；已装载黑体，中文标注可用；若日志提示字体未就绪（中文变方框）则改用英文/LaTeX。","若计算结果与预想不符，以计算结果为准调整题面或答案。"].join(`
`),Bt=`
`+st+`
`+['1) 需要计算/验算/画图时，只输出一个 JSON {"tool":"python_exec","code":"<Python代码>"}；需要事实/定义/背景/最新资料时，只输出 {"tool":"web_search","query":"<检索词>"}。工具会真实执行，结果回传给你。',"2) 数学答案与关键中间量必须以工具计算为准；画图直接用 matplotlib；不确定的外部事实先 web_search 再作答，不要臆造。","3) 完成后直接用自然文字回答（保持你原有的输出格式与标记习惯），不要带工具 JSON。"].join(`
`),Wt=["【工程工具模式（已启用：沙箱 Python + 联网搜索，numpy/sympy/matplotlib 就绪）】","⚠️ 你【确实拥有】python_exec（计算/画图）与 web_search（联网检索事实/定义/背景）两个工具且真实可用——本环境通过平台【原生 function calling】提供：","需要计算/验算/画图直接调用 python_exec（参数 code）；需要事实/定义/最新资料直接调用 web_search（参数 query）。平台会真实执行并回传结果。",'不要输出 {"tool":"python_exec",...} 这类文本 JSON（那是旧协议，本会话已不使用），','更不要因为"以为自己没有工具"而跳过计算或说"我无法执行代码"。',"【多轮循环机制】这不是一次性问答：每次工具调用后系统真实执行并回传结果，你再继续——来回多轮直到完成。"].join(`
`),Ut=`
`+Wt+`
`+["1) 需要计算/验算/画图时直接调用 python_exec 工具；需要事实/定义/背景/最新资料时直接调用 web_search 工具，结果会回传给你。","2) 数学答案与关键中间量必须以工具计算为准；不确定的外部事实先检索再作答，不要臆造。","3) 完成后直接用自然文字回答（保持你原有的输出格式与标记习惯）。"].join(`
`),Gt=`
`+st+`
`+["【工作方式】凡涉及数学推导、数值验算、统计、画图的问题，先调用 Python 真实算；",'需要事实/定义/背景/最新资料时调用 {"tool":"web_search","query":"…"} 联网检索（维基百科/DDG）。',"结论以工具计算/检索结果为准；本问题不需要就直接回答，不必强行调用工具。","【配图规约】画图用 matplotlib（figsize≈(4,3)），直接 import（首次使用自动装载）；","严禁 micropip / pyodide.loadPackage / asyncio；无需 savefig/plt.show（沙箱无文件语义），系统自动收取图形。","【最终交付（最重要）】完成后直接输出最终回答，并【严格保持你原系统提示词规定的输出格式】","（JSON schema、ACTION/QUERY/FLOW 等标记约定原样不变）——工具轮只是工作过程，",'最终回答里不得出现工具 JSON 或"我调用了工具"之类的说明。'].join(`
`),ut='{"tool":',Vt=/^\s*(?:`{0,3}[a-zA-Z]*)?\s*\{\s*"tool"\s*:/;function mt(t){const e=String(t||"");if(!e.trim())return"hold";if(Vt.test(e))return"tool";const n=e.replace(/^\s*`{0,3}[a-zA-Z]*\s*/,"");return n.length<=ut.length&&ut.indexOf(n)===0?"hold":"final"}function yt(t){const e=Math.max(1,t.maxRounds||20),n=Ht(t.label||"AI 工程任务");let o=!1;n.onCancel(()=>{o=!0});const r=()=>o||!!(t.signal&&t.signal.aborted)||!!(t.isCancelled&&t.isCancelled()),s=[{role:"system",content:(t.system||"")+Gt}],i=(t.user||"")+`

（环境提醒：本会话支持多轮工具调用——需要计算/画图时输出 {"tool":"python_exec","code":"…"} 并立即停止本轮，Python 会真实执行并把结果回传给你；不需要计算就直接按原格式输出最终回答。）`;return s.push({role:"user",content:t.imageDataUrl?[{type:"text",text:i},{type:"image_url",image_url:{url:t.imageDataUrl}}]:i}),new Promise((c,l)=>{const u=()=>{n.fail("已取消"),l(Object.assign(new Error("已取消"),{cancelled:!0}))},a=(m,d)=>{if(r()){u();return}n.setStatus(m>1?"第 "+m+" 轮 · 等待模型响应…":"任务已发起，等待模型响应…");let p=!1;_.chatMessagesStream(s,function(x,h){if(r())return;const f=String(x||"");h&&n.think(h);const b=mt(f);if(b!=="hold"){if(b==="tool"){n.roundStream(m,f),p&&t.onChunk&&t.onChunk("",""),p=!1;return}p||(p=!0),n.writing(f),t.onChunk&&t.onChunk(f,h||"")}},{cache:!1,timeout:18e4,signal:t.signal,ctx:t.ctx}).then(x=>{if(r()){u();return}const h=String(x||"");let f=null;try{f=_.extractRobustJSON(h)}catch{f=null}const b=!!(f&&(f.tool==="python_exec"&&typeof f.code=="string"||f.tool==="web_search"&&typeof f.query=="string"));if(b&&p&&(t.onChunk&&t.onChunk("",""),p=!1),b&&m>=e&&!d){n.setStatus("已达工具轮上限，强制汇总…"),s.push({role:"assistant",content:h}),s.push({role:"user",content:"已达最大工具轮次。请停止调用工具，基于目前已有结果，严格按原格式直接输出最终回答。"}),a(m+1,!0);return}if(b&&d){n.finish(),c(h);return}if(b){const v=f.tool==="web_search";n.setStatus("第 "+m+" 轮 · "+(v?"联网搜索…":"执行 Python…"));const g=v?"🔍 "+String(f.query||""):String(f.code||""),G=v?'还需要检索/计算就输出 {"tool":"web_search"或"python_exec",...}；完成了就按原格式直接输出最终回答。':'还需要计算/画图就输出 {"tool":...}；完成了就按原格式直接输出最终回答。';(v?ft(String(f.query||"")).then(y=>({ok:y.ok,output:y.ok?y.text+(y.sources.length?`
来源：`+y.sources.join(" | "):""):"[未检索到] "+(y.note||""),error:"",image:""})):nt(f.code).then(y=>({ok:!y.error,output:y.output,error:y.error,image:y.image}))).then(y=>{n.step({round:m,tool:f.tool,code:g,output:y.output,error:y.error,image:y.image}),s.push({role:"assistant",content:h}),s.push({role:"user",content:`工具执行结果：
`+(y.error?"[错误] "+y.error+`
`:"")+(y.output||"(无输出/无结果)")+(y.image?`
（图形已收录，最终回答可引用）`:"")+`
请继续：`+G}),a(m+1,d)}).catch(y=>{const k=String(y?.message||y);n.step({round:m,tool:f.tool,code:g,output:"",error:k}),s.push({role:"assistant",content:h}),s.push({role:"user",content:"工具执行异常："+k+`
请调整思路，按原格式输出最终回答。`}),a(m+1,d)});return}if(!h.trim()){if(m>e){n.fail("模型返回空内容"),l(new Error("模型返回空内容"));return}n.setStatus("返回为空，重试中…"),a(m+1,d);return}t.onChunk&&!p&&t.onChunk(h,""),n.finish(),c(h)}).catch(x=>{if(r()){n.fail("已取消"),l(Object.assign(new Error("已取消"),{cancelled:!0}));return}n.fail(String(x?.message||x)),l(x)})};a(1,!1)})}const Xt={type:"function",function:{name:"python_exec",description:"在浏览器沙箱执行 Python 代码（numpy/sympy/matplotlib 已就绪），返回 stdout 与生成的图表。数学答案与关键中间量必须以工具计算为准。",parameters:{type:"object",properties:{code:{type:"string",description:"完整可运行的 Python 代码"}},required:["code"]}}},Yt={type:"function",function:{name:"web_search",description:"联网检索事实/定义/背景资料（维基百科 + DuckDuckGo 即时答案，适合知识点、概念、公式、人物事件等）。需要实时/权威外部信息时调用；纯计算用 python_exec。",parameters:{type:"object",properties:{query:{type:"string",description:"搜索关键词（简洁明确，中文或英文）"}},required:["query"]}}};function q(t){if(t==="fc"||t==="json")return t;let e="auto";try{e=String(j.get().ai.toolProto||"auto")}catch{}if(e==="json"||e==="fc")return e;try{const n=_.activeApi();return n&&n.fc===!0?"fc":"json"}catch{return"json"}}function ht(t){return t==="fc"?"需要再计算/检索就直接再次调用工具（python_exec / web_search）；可以直接回答时用自然文字作答。":'需要再调用工具输出 {"tool":"python_exec"或"web_search",...}；可以直接回答用户时输出自然文字（不要 JSON）。'}function $t(t,e){return`工具执行结果：
`+(t.error?"[错误] "+t.error+`
`+t.output:t.output||"(无输出，请用 print 输出结论)")+(t.image?`
[图表已生成并展示给用户]`:"")+`
请继续：`+ht(e)}function Kt(t,e){return`联网搜索结果：
`+(t.ok?t.text+(t.sources&&t.sources.length?`

参考来源：`+t.sources.join(" | "):""):"[搜索未成功] "+(t.note||"无结果"))+`

请基于以上检索内容继续（注意来源可靠性，必要时交叉验证）：`+ht(e)}function gt(t){let e=null;try{e=_.extractRobustJSON(t)}catch{e=null}return e&&typeof e=="object"?e:null}function Zt(t,e){return t==="fc"?te(e):Qt(e)}function Qt(t){return{name:"json",async runRound(e,n){const o=String(await _.chatMessagesStream(e,function(s,i){try{n(String(s||""),String(i||""))}catch{}},{cache:!1,timeout:18e4,ctx:t})||""),r=gt(o);return r&&r.tool==="python_exec"&&typeof r.code=="string"?{kind:"tool",name:"python_exec",args:{code:r.code},raw:o}:r&&r.tool==="web_search"&&typeof r.query=="string"?{kind:"tool",name:"web_search",args:{query:r.query},raw:o}:r&&r.final?{kind:"final",obj:r,raw:o}:{kind:"text",raw:o}},pushToolTurn(e,n,o){e.push({role:"assistant",content:n.raw}),e.push({role:"user",content:o})},pushTextTurn(e,n){e.push({role:"assistant",content:n})}}}function te(t){let e="";try{e=String((_.activeApi()||{}).id||"")}catch{}return{name:"fc",async runRound(n,o){const r=await _.chatMessagesStream(n,function(u,a){try{o(String(u||""),String(a||""))}catch{}},{cache:!1,timeout:18e4,tools:[Xt,Yt],tool_choice:"auto",apiId:e||void 0,ctx:t}),s=String(r&&r.text||""),i=r&&Array.isArray(r.toolCalls)?r.toolCalls.filter(u=>u&&u.function):[],c=i.find(u=>u.function.name==="python_exec"||u.function.name==="web_search")||null;if(c){let u={};try{u=JSON.parse(c.function.arguments||"{}")||{}}catch{u={}}const a=c.function.name==="web_search"?"web_search":"python_exec";if(String(u[a==="web_search"?"query":"code"]||"").trim())return{kind:"tool",name:a,args:u,raw:s,toolCallId:String(c.id||""),assistantMsg:{role:"assistant",content:s||null,tool_calls:i}}}const l=gt(s);return l&&l.final?{kind:"final",obj:l,raw:s}:{kind:"text",raw:s}},pushToolTurn(n,o,r){n.push(o.assistantMsg||{role:"assistant",content:o.raw||null}),n.push({role:"tool",tool_call_id:o.toolCallId||"",content:r})},pushTextTurn(n,o){n.push({role:"assistant",content:o})}}}function ee(t,e){return String(t||"").replace(/\s+/g," ").trim().slice(0,e)}function xt(t){return["你是考研学习的工程助手，可以使用 Python 工具（numpy/sympy/matplotlib 已就绪）与联网搜索工具。","工作方式（严格遵守）：",t==="fc"?'1) 需要计算/验算/画图时直接调用 python_exec 工具（参数 code=Python 代码）；需要事实/定义/背景/最新资料时调用 web_search 工具（参数 query=检索词）；平台真实执行并回传结果，不要输出 {"tool":...} 文本 JSON。':'1) 需要计算/验算/画图时，只输出一个 JSON 对象：{"tool":"python_exec","code":"<Python代码>"}；需要事实/定义/背景/最新资料时，只输出：{"tool":"web_search","query":"<检索词>"}。不要 markdown 代码块、不要多余文字，结果会真实回传。',"2) 画图用 matplotlib，直接 plt. 即可，图片会自动捕获展示给用户，无需 savefig/show。","3) 得出结论后，直接用正常的简体中文回答用户（自然文字，不要 JSON），结论必须有工具计算/检索结果支撑，不要臆造。","4) 一次任务里可以连续调用工具多轮（计算与搜索可交替），直到确有把握。"].join(`
`)}const ne=xt("json");function oe(t){return["你是考研题目的验算引擎，可以使用 Python 工具（numpy/sympy 已安装）。","工作方式（严格遵守）：",t==="fc"?["1) 需要计算/验算时，直接调用 python_exec 工具（原生 function calling，参数 code=要执行的Python代码），",'   平台真实执行并回传 stdout；不要输出 {"tool":...} 文本 JSON。优先用 sympy 做符号验算，辅以数值代入抽查。'].join(""):["1) 每次只输出一个 JSON 对象，不要 markdown 代码块、不要多余文字。",'2) 需要计算/验算时输出：{"tool":"python_exec","code":"<要执行的Python代码>"}。',"   代码将真实执行，stdout 会回传给你。优先用 sympy 做符号验算，辅以数值代入抽查。"].join(`
`),(t==="fc"?"2":"3")+") 验算完成或无需工具时"+(t==="fc"?"，用文本输出最终结论":"输出最终结论")+'：{"final":true,"verdict":"通过|不通过|无法确定","reason":"一句话依据"}。',(t==="fc"?"3":"4")+") 多次调用工具直到确有把握；不要臆造计算结果。"].join(`
`)}async function Q(t){const e=q(t.proto);return U({system:oe(e),maxRounds:t.maxRounds||6,proto:e,ctx:t.ctx}).send(t.task,{onStep:t.onStep,isCancelled:t.isCancelled})}function U(t){const e=t?.maxRounds||20,n=q(t?.proto),o=Zt(n,t?.ctx),r=t?.history?.length?t.history.slice():[{role:"system",content:String(t?.system||xt(n))}];return{history:r,proto:n,async send(s,i){const c=[];r.push({role:"user",content:s});let l="";const u=d=>{const p=String(d||""),x=p.search(/\{[\s\S]*?"(?:tool|final)"\s*:/);return x>=0?p.slice(0,x).trim():/^\s*(?:`{0,3}[a-zA-Z]*)?\s*\{/.test(p)?"":p.trim()},a=function(d,p){const x=mt(d);if(x==="tool"){if(i?.onToolStream)try{i.onToolStream(d)}catch{}if(!i?.onText)return;m&&(i.onText("",""),m=!1),p&&i.onText("",p);return}if(!i?.onText)return;const h=d.search(/\{[\s\S]*?"(?:tool|final)"\s*:/);if(h>=0){if(/"tool"\s*:/.test(d)&&i?.onToolStream)try{i.onToolStream(d)}catch{}const f=d.slice(0,h).trim(),b=(l?l+`

`:"")+f;p?i.onText(b,p):f&&i.onText(b,"");return}if(x==="hold"){p&&i.onText("",p);return}if(/^\s*(?:`{0,3}[a-zA-Z]*)?\s*\{/.test(d)){p&&i.onText("",p);return}m=!0,i.onText(l?l+`

`+d:d,p)};let m=!1;for(let d=1;d<=e;d++){if(i?.isCancelled&&i.isCancelled()){const h={round:d,type:"text",text:"已取消"};return c.push(h),r.push({role:"assistant",content:"（已取消）"}),i?.onStep&&i.onStep(h),{finalText:"已取消",verdict:"",steps:c,rounds:d}}let p;try{p=await o.runRound(r,a)}catch(h){return{finalText:"AI 调用失败："+String(h?.message||h),verdict:"",steps:c,rounds:d}}if(m=!1,p.kind==="tool"){const h=p.name==="web_search",f={round:d,type:"exec",tool:p.name,code:h?"🔍 "+String(p.args.query||""):String(p.args.code||""),query:h?String(p.args.query||""):void 0};i?.onStep&&i.onStep(f);let b;if(h){const g=await ft(String(p.args.query||""));f.output=g.ok?ee(g.text,200):"[未检索到] "+(g.note||""),f.searchSources=g.sources,b=Kt(g,o.name)}else{const g=await nt(String(p.args.code||""));f.output=g.output,f.error=g.error,f.image=g.image,b=$t(g,o.name)}c.push(f),i?.onStep&&i.onStep(f),o.pushToolTurn(r,p,b);const v=u(p.raw);v&&(l=(l?l+`

`:"")+v);continue}if(p.kind==="final"){const h={round:d,type:"final",text:String(p.obj.reason||p.obj.verdict||"")};return c.push(h),i?.onStep&&i.onStep(h),o.pushTextTurn(r,p.raw),{finalText:(l?l+`

`:"")+(p.obj.verdict?"【"+p.obj.verdict+"】":"")+(p.obj.reason||""),verdict:String(p.obj.verdict||""),steps:c,rounds:d}}const x={round:d,type:"text",text:p.raw};return c.push(x),i?.onStep&&i.onStep(x),o.pushTextTurn(r,p.raw),{finalText:(l?l+`

`:"")+p.raw,verdict:"",steps:c,rounds:d}}return{finalText:"达到最大工具轮次（"+e+"）仍未收敛，请拆小问题或增加轮次。",verdict:"",steps:c,rounds:e}}}}const I=Z({running:!1,steps:[]});function z(){const t=j.get().settings;return!!(t.aiTools&&t.aiTools.enabled)}function wt(t){j.update(e=>{e.settings.aiTools=Object.assign({enabled:!1},e.settings.aiTools,{enabled:t})})}function K(){try{const t=j.get().settings;return!(t.aiTools&&t.aiTools.scopeAll===!1)}catch{return!0}}function St(t){j.update(e=>{e.settings.aiTools=Object.assign({enabled:!1},e.settings.aiTools,{scopeAll:t})})}function se(){St(!K()),window.App&&window.App.refresh()}function re(){let t="未探测";try{const n=_.activeApi();t=n&&n.fc===!0?"支持原生FC ✓":n&&n.fc===!1?"不支持原生FC ✗":"未探测 ?"}catch{}let e="json";try{e=q()}catch{}return"当前接口："+t+" · 生效："+(e==="fc"?"原生 FC":"JSON 协议")}function ie(t){j.update(n=>{n.ai.toolProto=t==="json"||t==="fc"?t:void 0});const e=window.Toast;e&&e.show("工具协议模式已设为 "+(t==="json"?"JSON（通用兜底）":t==="fc"?"原生 FC（强制，接口不支持时会失败）":"自动（跟随探测）"),"info",2500),window.App&&window.App.refresh()}function ae(){const t=window.Toast;let e=null;try{e=_.activeApi()}catch{}if(!e||!e.endpoint||!e.key||!e.model){t&&t.warn("当前接口配置不完整，无法探测");return}t&&t.show("🔍 正在探测「"+(e.name||e.model)+"」的原生 FC 能力…","info",28e3),_.probeFC(e).then(function(n){e.id&&_.setApiFc(e.id,n.v==="ok"?!0:n.v==="no"?!1:void 0),n.v==="ok"?t&&t.success("✅ 支持原生 FC，已标记（auto 模式将自动启用）"):n.v==="no"?t&&t.show("⛔ 不支持原生 FC，继续用 JSON 协议（通用兜底）","info",4e3):t&&t.show("❓ 探测不确定："+n.note+"，保守沿用 JSON 协议","info",4e3),window.App&&window.App.refresh()})}function ce(){const t=z(),e=w.status,n=e==="ready"?"已就绪":e==="loading"?"下载中…":e==="error"?"加载失败":"未下载";let o="auto";try{o=String(j.get().ai.toolProto||"auto")}catch{}return'<div class="card" id="st-aitools-card"><div class="card-title-row"><span class="card-title">🧪 AI 工程台（实验功能）</span><button class="btn btn-ghost btn-sm" onclick="window.AiTools.settingsGo()">打开</button></div><div class="muted-sm" style="margin-bottom:6px">给 AI 增加真实工程能力：全站各模块的 AI（出题、批改、复盘、规划、教练对话等）自动获得多轮长程任务——调用本地 Python（numpy/sympy/matplotlib）真实计算、验算、画图，过程在右下角任务卡实时可见、可随时取消。默认关闭，不影响现有任何功能。</div><div class="muted-sm" style="margin-bottom:6px">状态：'+(t?"已启用":"未启用")+" · 组件："+n+(t?" · 覆盖："+(K()?"全部模块":"仅测验/教练"):"")+'</div><div class="btn-row"><button class="btn btn-sm '+(t?"btn-ghost":"btn-primary")+'" onclick="window.AiTools.settingsToggle()">'+(t?"停用":"启用（本机）")+"</button>"+(t?'<button class="btn btn-sm btn-ghost" onclick="window.AiTools.settingsDownload()">'+(e==="ready"?"重新下载组件":"下载扩展组件（约10MB）")+"</button>":"")+(t?'<button class="btn btn-sm btn-ghost" data-testid="at-scope-btn" onclick="window.AiTools.settingsScope()">'+(K()?"覆盖范围：全部模块（点击退回仅测验/教练）":"覆盖范围：仅测验/教练（点击扩展到全部模块）")+"</button>":"")+"</div>"+(t?'<div style="margin-top:8px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:12px" data-testid="at-proto-row" title="fc 仅作用于多轮 agent 会话（教练/验算/工程对话）；全站桥 toolChat 与出题闭环暂固定 JSON 协议。fc 会话会把请求钉在创建时的接口上，不做跨协议 failover。"><span class="muted-sm">工具调用协议：</span><select class="input" style="width:auto;font-size:12px;padding:2px 6px" data-testid="at-proto-sel" onchange="window.AiTools.settingsProto(this.value)">'+[["auto","自动（跟随接口探测）"],["json","JSON 协议（通用兜底）"],["fc","原生 FC（强制）"]].map(function(r){return'<option value="'+r[0]+'"'+(o===r[0]?" selected":"")+">"+r[1]+"</option>"}).join("")+'</select><button class="btn btn-sm btn-ghost" data-testid="at-probe-btn" onclick="window.AiTools.settingsProbe()">🔍 探测当前接口</button><span class="muted-sm" data-testid="at-proto-state">'+re()+"</span></div>":"")+"</div>"+(t?bt():"")}function le(){wt(!z()),window.App&&window.App.refresh()}function ue(){window.Toast&&window.Toast.show("⏳ 正在下载扩展组件（约 10MB，仅此一次）…","info",8e3),W(t=>{window.Toast&&window.Toast.show(t,"info",3e3)}).then(()=>{window.Toast&&window.Toast.success("✅ 扩展组件就绪（numpy + sympy）"),window.App&&window.App.refresh()}).catch(t=>{window.Toast&&window.Toast.danger("扩展组件加载失败："+String(t?.message||t))})}function pe(){window.App&&window.App.go("aitools")}function bt(){const e='<div class="card" id="at-res-card"><div class="card-title-row"><span class="card-title">📦 组件资源管理</span><button class="btn btn-ghost btn-sm" onclick="window.AiTools.resRefresh()">↻ 刷新状态</button></div><div class="muted-sm" style="margin-bottom:6px">基础组件随首次下载安装；画图/数值组件默认「首次使用时按需下载」——重度用户可点「预载」提前装好，出题配图与 scipy 计算零等待。装过即记忆：重启后自动从缓存后台恢复，无需手动操作。</div>'+[["runtime","Pyodide 运行时（内核 + 标准库）","≈10MB",!0],["numpy","numpy（数值计算）","≈7MB",!0],["sympy","sympy（符号验算核心）","≈11MB",!0],["mpl","matplotlib（精确画图）","≈9MB",!1],["font","SimHei 中文字体（图内中文）","≈4.7MB",!1],["scipy","scipy（数值积分/优化）","≈12MB",!1]].map(function(n){return'<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--line);font-size:12.5px"><span style="flex:1">'+n[1]+(n[3]?' <span class="tag">基础</span>':' <span class="tag">画图</span>')+'</span><span class="muted-sm" style="width:64px;text-align:right">'+n[2]+'</span><span data-rs="'+n[0]+'" style="width:84px;text-align:right;font-weight:600">…</span></div>'}).join("")+'<div class="btn-row" style="margin-top:8px"><button class="btn btn-sm btn-primary" onclick="window.AiTools.resPreload()">🎨 预载画图组件（matplotlib + 中文字体 + scipy ≈26MB）</button></div></div>';return setTimeout(()=>{if(typeof document<"u"&&document.body)try{B()}catch{}},60),setTimeout(()=>{if(typeof document<"u"&&document.body)try{B()}catch{}},4e3),e}function B(){Lt().then(t=>{if(typeof document>"u"||!document.body)return;const e={runtime:t.runtime,numpy:t.numpy,sympy:t.sympy,mpl:t.mpl,font:t.font,scipy:t.scipy};Object.keys(e).forEach(n=>{const o=document.querySelector('[data-rs="'+n+'"]');o&&(o.textContent=e[n]?"✓ 已装载":"未装载",o.style.color=e[n]?"var(--ok,#237804)":"var(--text-muted,#888)")})}).catch(()=>{})}function de(){const t=window.Toast;if(!R()){t&&t.warn("基础组件未就绪——先点上方「下载扩展组件」");return}t&&t.show("⏳ 正在预载画图组件（matplotlib + 中文字体 + scipy ≈26MB，仅首次，视网速约 1~3 分钟）…","info",1e4),Mt(e=>{t&&t.show(e,"info",3e3)}).then(()=>{t&&t.success("✅ 画图 + scipy 组件就绪——出题配图与数值计算零等待"),B()}).catch(e=>{t&&t.danger("预载失败："+String(e.message||e)),B()})}function fe(t,e,n,o){I.running=!0,I.steps=[];const r=["请验算下面这道考研题目的答案是否正确。","【题目】"+(t||"（无题干）"),"【给出的答案】"+(e||"（无）"),"【给出的解析】"+(n||"（无）"),"要求：先用 sympy 独立重新求解/验算（不要照抄解析），再数值代入抽查，最后给出结论。"].join(`
`);return Q({task:r,maxRounds:6,onStep:s=>{I.steps.push(s),o&&o.onStep&&o.onStep(s)},isCancelled:o&&o.isCancelled}).finally(()=>{I.running=!1})}const me=new Map,F=new Map,V=new Map;function O(t){return String(t||"").replace(/</g,"&lt;")}function H(t,e,n,o,r){const s=[],i=(a,m,d)=>{t.innerHTML='<div class="card" style="margin-top:12px" data-testid="at-verify-card"><div class="card-title-row"><span class="card-title">'+r+'</span><span class="tag" style="background:'+(a==="通过"?"#237804":a==="不通过"?"#cf1322":"#8c8c8c")+';color:#fff">'+(d?"验算中…":a||"完成")+"</span></div>"+s.join("")+'<div style="margin-top:6px"><b style="color:'+(a==="通过"?"#237804":a==="不通过"?"#cf1322":"inherit")+'">'+(d?"AI 正在自主调用 Python 工具验算…":O(m||"完成"))+"</b></div></div>"},c=e.get(n);if(c){i(c.verdict,c.report,!1);return}const l=V.get(n);if(l){i("","",!0),l.then(a=>i(a.verdict,a.report,!1)).catch(a=>i("失败","验算失败："+String(a?.message||a),!1));return}i("","",!0);const u=Q({task:o,maxRounds:6,onStep:a=>{a.type==="exec"&&(s.push('<details style="margin-top:6px"><summary class="muted-sm" style="cursor:pointer">第 '+a.round+' 轮 · AI 调用 Python 工具（点击展开代码与输出）</summary><pre class="report" style="font-size:12px">'+O(a.code)+'</pre><pre class="report" style="font-size:12px;opacity:.8">输出：'+O(a.output||"(无)")+(a.error?`
错误：`+O(a.error):"")+"</pre></details>"),i("","",!0))}}).then(a=>{if(e.set(n,{verdict:a.verdict,report:a.finalText}),e.size>30){const m=e.keys().next().value;m!==void 0&&e.delete(m)}return i(a.verdict,a.finalText,!1),{verdict:a.verdict,report:a.finalText}}).catch(a=>{throw i("失败","验算失败："+String(a?.message||a),!1),a});V.set(n,u),u.finally(()=>{V.delete(n)}),u.catch(()=>{})}function ye(t){const e=[{role:"system",content:t.system+`
`+Dt},{role:"user",content:t.ask+`

（环境提醒：本会话支持多轮工具调用——需要计算时输出 {"tool":"python_exec","code":"…"} 并立即停止本轮，Python 会真实执行并把结果回传给你。数学题的标准答案必须先用它算出。）`}],n=8,o=[];return new Promise((r,s)=>{const i=c=>{if(t.isCancelled&&t.isCancelled()){s(Object.assign(new Error("已取消"),{cancelled:!0}));return}_.chatMessagesStream(e,function(l,u){t.onStream&&t.onStream(l||"",u||"")},{cache:!1,timeout:18e4,ctx:t.ctx}).then(l=>{let u=null;try{u=_.extractRobustJSON(l)}catch{u=null}if(u&&u.tool==="python_exec"&&typeof u.code=="string"){nt(u.code).then(a=>{if(a.image&&String(a.image).indexOf("data:image")===0&&o.push(a.image),t.onStep&&t.onStep({round:c,type:"exec",code:u.code,output:a.output,error:a.error,image:a.image}),e.push({role:"assistant",content:l}),e.push({role:"user",content:`工具执行结果：
`+(a.error?"[错误] "+a.error+`
`:"")+(a.output||"(无输出，请用 print 输出结论)")+(a.image?`
（图形已收录，可作为题目配图）`:"")+`
请继续：需要再算/画图输出 {"tool":...}；算好了只输出题目 JSON 本体。`}),c>=n){s(new Error("达到最大工具轮次仍未输出题目 JSON"));return}i(c+1)});return}if(u&&u.stem){delete u.tool,o.length&&(u.diagramImg=o[o.length-1],u.diagrams=o.slice()),r(u);return}if(c>=n){s(new Error("AI 未输出有效题目 JSON。最后输出前200字："+l.slice(0,200)));return}e.push({role:"assistant",content:l}),e.push({role:"user",content:"请严格只输出题目 JSON 本体（含 stem/type/options/answer/solution/trap 字段），不要其他内容。"}),i(c+1)}).catch(s)};i(1)})}function he(t,e){try{if(!t||!z())return;if(!R()){t.innerHTML='<div class="muted-sm" style="margin-top:10px">🧪 AI 工程验算：组件未就绪（到「AI 工程台」下载扩展组件后，出题将自动附带 sympy 真实验算）。</div>';return}const n=["请验算下面这道考研题目的答案是否正确。","【题目】"+(e.stem||"（无题干）"),"【给出的答案】"+(e.answer||"（无）"),"【给出的解析】"+(e.solution||"（无）"),"要求：先用 sympy 独立重新求解/验算（不要照抄解析），再数值代入抽查，最后给出结论。"].join(`
`);H(t,me,e.key,n,"🧪 AI 工程验算（sympy 真实计算）")}catch{}}function ge(t,e){try{if(!z())return;(e||[]).forEach(n=>{if(!n||!n.aiAnalysis||!(n.aiAnalysis.keySteps||n.aiAnalysis.solution))return;const o=t.querySelector('[data-pm-verify="'+n.id+'"]');if(!o)return;const r=n.id+"|"+(n.updatedAt||n.createdAt||""),s="🧪 AI 工程验算（解析防幻觉）";if(F.get(r)){H(o,F,r,"",s);return}if(V.has(r)){H(o,F,r,"",s);return}o.innerHTML='<div class="card" style="margin-top:12px"><div class="card-title-row"><span class="card-title">🧪 AI 工程验算（解析防幻觉）</span></div><div class="btn-row"><button class="btn btn-sm btn-ghost" data-pm-verify-run="'+n.id+'">🔬 手动验算（AI 调 sympy 核对解析，消耗 token）</button></div></div>';const c=o.querySelector('[data-pm-verify-run="'+n.id+'"]');c&&(c.onclick=function(){const l=["请验算这道拍题的 AI 解析是否正确（防解析幻觉）。","【题目】"+(n.extractedQuestion||n.note||"（无题干）"),"【AI 给出的解题关键】"+(n.aiAnalysis.keySteps||n.aiAnalysis.solution||"（无）"),"【易错原因】"+(n.aiAnalysis.errorCause||"（无）"),"要求：先用 sympy 独立重新求解（不要照抄解析），对照 AI 的解题关键逐步核对，再数值代入抽查，最后给出结论（AI 解析有错请明确指出错在哪一步）。"].join(`
`);if(R()){H(o,F,r,l,s);return}const u=a=>{o.innerHTML='<div class="muted-sm" style="margin-top:10px">⏳ '+String(a||"").replace(/</g,"&lt;")+"</div>"};u("正在加载工程组件（约 10MB，仅首次）…"),W(a=>u(a)).then(()=>H(o,F,r,l,s)).catch(a=>{o.innerHTML='<div class="muted-sm" style="margin-top:10px">工程组件加载失败：'+String(a&&a.message||a).replace(/</g,"&lt;")+"（检查网络后重试）</div>"})})})}catch{}}var M=null;function xe(){M=null}function we(t,e){if(M&&!e?.fresh)return t.innerHTML="",t.appendChild(M.root),M.panel;var n=document.createElement("div");n.innerHTML='<div class="card"><div class="card-title-row"><span class="card-title">🤖 AI 工程出题中…</span><button class="btn btn-sm btn-ghost" data-testid="qes-cancel">取消</button></div><div style="margin:6px 0"><span class="tag" data-testid="qes-status" style="background:#8c8c8c;color:#fff"></span></div><details open style="margin-top:8px"><summary class="muted-sm" style="cursor:pointer">💭 思考过程（实时流式）</summary><pre class="report" data-testid="qes-think" style="max-height:220px;overflow:auto;opacity:.72;font-size:12px;white-space:pre-wrap;margin-top:4px"></pre></details><div data-testid="qes-tools" style="margin-top:8px"></div><div data-testid="qes-content-wrap" style="display:none;margin-top:10px"><div class="card-title-sm">📝 题面生成（基于已验证数值）</div><pre class="report" data-testid="qes-content" style="max-height:260px;overflow:auto;white-space:pre-wrap;font-size:12px"></pre></div></div>',t.innerHTML="",t.appendChild(n);var o=0,r=!1,s=null,i=0,c=n.querySelector('[data-testid="qes-status"]'),l=n.querySelector('[data-testid="qes-think"]'),u=n.querySelector('[data-testid="qes-think-wrap"]'),a=n.querySelector('[data-testid="qes-tools"]'),m=n.querySelector('[data-testid="qes-content"]'),d=n.querySelector('[data-testid="qes-content-wrap"]'),p=n.querySelector('[data-testid="qes-cancel"]');p&&e&&e.onCancel&&(p.onclick=function(){e.onCancel()});var x=!1,h=0,f=null;function b(){x=!0,h=Date.now(),f&&clearInterval(f);var T=function(){if(x){var y=Math.round((Date.now()-h)/1e3);g("📤 已发送出题请求，等待模型响应…（"+y+"s）"),f=setTimeout(T,1e3)}};T()}function v(){x=!1,f&&(clearInterval(f),f=null)}function g(T,y){c&&(c.textContent=T,y&&(c.style.background=y))}b();var G={setStatus:g,stream:function(T,y){r||(r=!0,v(),g("✅ 已连接 · 流式接收中…","#1a7f37")),y&&(u&&(u.style.display=""),l&&(l.textContent=y,l.scrollTop=l.scrollHeight));var k=String(T||"").trim();if(k.indexOf('{"tool"')===0){var P=o+1;g("🛠 第 "+P+" 轮：AI 正在构造 Python 计算代码…","#8c8c8c"),(i!==P||!s||!s.parentNode)&&(s&&s.parentNode&&s.parentNode.removeChild(s),s=document.createElement("details"),s.setAttribute("data-round-draft",String(P)),s.style.margin="6px 0",s.open=!0,s.innerHTML='<summary class="muted-sm" style="cursor:pointer">🛠 第 '+P+' 轮 · 正在构造 Python 计算代码…</summary><pre class="report" style="font-size:12px;white-space:pre-wrap"></pre>',a&&a.appendChild(s),i=P);var E=s.querySelector("pre");if(E)try{E.textContent=JSON.parse(k).code||k}catch{E.textContent=k}return}k&&(v(),g("✍ 正在撰写题面（基于已验证数值）…","#1a7f37"),d&&(d.style.display=""),m&&(m.textContent=k,m.scrollTop=m.scrollHeight))},toolRound:function(T,y,k,P,E){if(o=Math.max(o,T),v(),s&&i===T&&(s.parentNode&&s.parentNode.removeChild(s),s=null,i=0),g("🛠 第 "+T+" 轮计算完成 ✓ → 继续分析结果…","#1a7f37"),!!a){a.style.display="";var J=document.createElement("details");J.style.margin="6px 0",J.open=!0,J.innerHTML='<summary class="muted-sm" style="cursor:pointer">🛠 第 '+T+" 轮 · Python 计算完成"+(P?"（出错，已回传修正）":" ✓")+'</summary><pre class="report" style="font-size:12px;white-space:pre-wrap">'+O(y)+'</pre><pre class="report" style="font-size:12px;opacity:.8;white-space:pre-wrap">→ 输出：'+O(k||"(无)")+(P?`
错误：`+O(P):"")+"</pre>"+(E?'<img src="'+O(E)+'" alt="工具产图" style="max-width:100%;border-radius:8px;border:1px solid var(--line);margin-top:6px;background:#fff">':""),a.appendChild(J)}},done:function(){v(),g("✅ 完成","#237804"),M=null}};return M={root:n,panel:G},G}const A=Z({items:[],running:!1});let C=null;function Se(){return C||(C=U({maxRounds:20})),C}function vt(t,e){if(t=String(t||"").trim(),!t||A.running)return;if(!R()){window.Toast&&window.Toast.warn("扩展组件未就绪，请先下载（约 10MB）");return}A.items.push({role:"user",text:t,steps:[]});const n=Z({role:"assistant",text:"",steps:[],image:""});A.items.push(n),A.running=!0,Se().send(t,{onStep:o=>{o.type==="exec"&&(n.steps.push(o),o.image&&(n.image=o.image))},isCancelled:e}).then(o=>{n.text=o.finalText||"（完成）"}).catch(o=>{n.text="AI 调用失败："+String(o?.message||o)}).finally(()=>{A.running=!1,Tt()})}const rt="kaoyan2026_aitools_chat";function be(t,e="copilot.chat"){const n=q();return U({system:(t||"")+(n==="fc"?Ut:Bt),maxRounds:20,proto:n,ctx:e})}function _t(){C=null,A.items.length=0;try{localStorage.removeItem(rt)}catch{}}function Tt(){try{const t=C?C.history.slice(-40):[],e=A.items.slice(-30),n=C?C.proto:"";localStorage.setItem(rt,JSON.stringify({hist:t,items:e,proto:n}))}catch{}}function ve(){try{const t=localStorage.getItem(rt);if(!t)return;const e=JSON.parse(t);if(Array.isArray(e.items)&&e.items.length&&e.items.forEach(function(n){A.items.push({role:n.role==="user"?"user":"assistant",text:String(n.text||""),steps:Array.isArray(n.steps)?n.steps:[],image:n.image||""})}),Array.isArray(e.hist)&&e.hist.length){if(e.proto&&e.proto!==q()){console.warn("[AiTools] 工具协议已切换（"+e.proto+" → "+q()+"），丢弃跨协议会话上下文");return}C=U({history:e.hist})}}catch{}}function _e(){try{if(!z()||w.status!=="idle")return;setTimeout(function(){W(function(){}).catch(function(){})},1500)}catch{}}const kt={settingsCard:ce,settingsToggle:le,settingsDownload:ue,settingsGo:pe,resourceCard:bt,resRefresh:B,resPreload:de,ensureLoaded:W,isReady:R,loaderState:w,pytoolsState:I,chatState:A,renderExamPanel:we,resetExamPanel:xe,newCoachSession:be,chatSend:vt,chatReset:_t,saveChat:Tt,restoreChat:ve,maybeAutoLoad:_e,verifyAnswer:fe,quizAutoVerify:he,photoAutoVerify:ge,generateQuestion:ye,runAgent:Q,enabled:z,setEnabled:wt,toolChat:yt,scopeAll:K,setScopeAll:St,settingsScope:se,settingsProto:ie,settingsProbe:ae};try{window.AiTools=kt}catch{}const Ae=Object.freeze(Object.defineProperty({__proto__:null,AiTools:kt,SYSTEM_GENERAL:ne,chatReset:_t,chatSend:vt,chatState:A,createAgentSession:U,ensureLoaded:W,isReady:R,loaderState:w,pytoolsState:I,runAgent:Q,toolChat:yt},Symbol.toStringTag,{value:"Module"}));export{kt as A,vt as a,I as b,A as c,_t as d,q as e,Ae as i,w as l,Mt as p,Lt as r};
