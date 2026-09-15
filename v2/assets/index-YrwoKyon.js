import{C as Et,c as Nt,S as j,A,a as Lt}from"./ai-C-NwhegU.js";import{M as tt}from"./vendor-BVCdKi1G.js";const ut="0.26.4",Mt=[`https://cdn.jsdelivr.net/pyodide/v${ut}/full/`,`https://registry.npmmirror.com/-/binary/pyodide/v${ut}/full/`],S=tt({status:"idle",log:[],lastError:"",progress:{pct:0,msg:""}});function pt(t){S.log.push(t),S.log.length>200&&S.log.shift()}const It=`
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
`;let b=null,M=null,$=null;const U=new Map;let zt=0;const ft="kaoyan2026_at_mpl";function gt(t){if(t.type==="log"){pt(t.text),$&&$(t.text);return}if(t.type==="progress"){S.progress.pct=Math.max(0,Math.min(100,Math.round(t.pct))),S.progress.msg=t.msg||"";return}if(t.type==="ready"){S.status="ready",pt("✅ 基础组件就绪（numpy + sympy，Worker 沙箱）");try{localStorage.getItem(ft)==="1"&&b?.postMessage({type:"preload-mpl"})}catch{}return}if(t.type==="mpl-on"){try{localStorage.setItem(ft,"1")}catch{}return}if(t.type==="load-error"){S.status="error",S.lastError=t.error;return}if(t.type==="stdout"||t.type==="stderr"){const e=U.get(t.id);e&&(e.stdout+=t.text+`
`);return}if(t.type==="exec-done"){const e=U.get(t.id);if(!e)return;clearTimeout(e.timer),U.delete(t.id),e.resolve({ok:!!t.ok,output:String(t.output||"").slice(0,1500),error:String(t.error||""),timedOut:!1,image:t.image||""})}}function Rt(){const t=new Blob([It],{type:"application/javascript"}),e=new Worker(URL.createObjectURL(t));return e.onmessage=n=>gt(n.data),e.onerror=n=>{S.status="error",S.lastError="Worker 错误："+(n.message||"unknown")},e}function xt(t){return t&&($=t),b&&S.status==="ready"?Promise.resolve(b):M||(S.status="loading",M=new Promise((e,n)=>{const s=Rt();b=s;const r=i=>{i.type==="ready"?e(s):i.type==="load-error"&&(b=null,M=null,n(new Error(i.error)))},a=s.onmessage;s.onmessage=function(i){const l=i.data||{};(l.type==="ready"||l.type==="load-error")&&(s.onmessage=a,r(l)),gt(l)},s.postMessage({type:"load",cdns:Mt})}),M)}function qt(){try{b&&b.terminate()}catch{}b=null,M=null,S.status="idle"}function G(t){return xt(t).then(()=>{})}function q(){return S.status==="ready"}const nt={runtime:!1,numpy:!1,sympy:!1,mpl:!1,font:!1,scipy:!1};function Jt(){return new Promise(t=>{if(!b||S.status!=="ready"){t(Object.assign({},nt));return}const e=n=>{const s=n.data||{};s.type==="status-info"&&(b?.removeEventListener("message",e),t(Object.assign({},nt,s.st||{})))};b.addEventListener("message",e),b.postMessage({type:"status"}),setTimeout(()=>{b?.removeEventListener("message",e),t(Object.assign({},nt))},5e3)})}let L=null;function Ft(t){return L||(t&&($=t),L=new Promise((e,n)=>{if(!b||S.status!=="ready"){L=null,n(new Error("基础组件未就绪（先在上方下载基础组件）"));return}let s=!1;const r=(l,o)=>{s||(s=!0,clearTimeout(i),b?.removeEventListener("message",a),L=null,l?e():n(new Error(o||"预载失败")))},a=l=>{const o=l.data||{};o.type==="preload-done"&&r(!!o.ok,o.error)},i=setTimeout(()=>r(!1,"预载超时（240s）——重试或查看工程台日志"),24e4);b.addEventListener("message",a),b.postMessage({type:"preload-mpl"})}),L)}function st(t,e=3e4){return xt().then(n=>new Promise(s=>{const r=++zt,a={resolve:s,stdout:"",timer:setTimeout(()=>{U.delete(r),qt(),s({ok:!1,output:a.stdout.slice(0,1500),error:"执行超时（"+Math.round(e/1e3)+"s 上限，已强制终止该次执行）",timedOut:!0})},e)};U.set(r,a),n.postMessage({type:"exec",id:r,code:String(t||"")})}))}function K(t,e){return String(t??"").replace(/\s+/g," ").trim().slice(0,e)}function rt(t,e,n){const s=new AbortController,r=setTimeout(()=>{try{s.abort()}catch{}},e);return fetch(t,Object.assign({signal:s.signal},n)).finally(()=>clearTimeout(r))}function Ht(){try{const t=window.Store,e=t&&t.get().ai||{},n=e.apis||[],s=n.find(i=>i.id===e.activeApi)||n[0],r=String(s&&s.endpoint||e.endpoint||"").toLowerCase(),a=String(s&&s.key||e.key||"");return a?r.includes("bigmodel.cn")?{provider:"zhipu",key:a}:r.includes("moonshot.cn")?{provider:"kimi",key:a}:r.includes("dashscope.aliyuncs.com")?{provider:"dashscope",key:a}:{provider:"",key:a}:{provider:"",key:""}}catch{return{provider:"",key:""}}}async function Bt(t,e,n){try{const s=await rt("https://open.bigmodel.cn/api/paas/v4/web_search",n,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify({search_query:t,search_engine:"search-std",count:8})});if(!s.ok)return{ok:!1,text:"",sources:[],note:"智谱搜索 HTTP "+s.status};const r=await s.json(),a=Array.isArray(r?.result)?r.result:[];if(!a.length)return{ok:!1,text:"",sources:[],note:"智谱搜索无结果"};const i=a.slice(0,8).map(o=>"【"+K(o.title,60)+"】"+K(o.content,500)),l=a.map(o=>o.link).filter(Boolean).slice(0,6);return{ok:!0,text:i.join(`

`).slice(0,3e3),sources:l}}catch(s){return{ok:!1,text:"",sources:[],note:"智谱搜索不可达："+String(s?.message||s)}}}async function Dt(t,e,n,s){try{const r=s||"https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",a=(()=>{try{const d=window.Store.get().ai,p=(d.apis||[]).find(f=>f.id===d.activeApi)||(d.apis||[])[0];return p&&p.model||"qwen-plus"}catch{return"qwen-plus"}})(),i=await rt(r,n,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify({model:a,messages:[{role:"user",content:"请联网检索并客观汇总以下主题的关键信息（列出要点与来源网址，不要评论）："+t}],enable_search:!0,search_options:{enable_source:!0,search_strategy:"max"}})});if(!i.ok)return{ok:!1,text:"",sources:[],note:"千问联网搜索 HTTP "+i.status};const l=await i.json(),o=l?.choices?.[0]?.message,u=K(o?.content,2800);if(!u)return{ok:!1,text:"",sources:[],note:"千问联网搜索无内容"};const c=[];try{(l?.search_info?.search_results||l?.output?.search_info?.search_results||[]).forEach(p=>{(p?.url||p?.link)&&c.push(p.url||p.link)}),(o?.annotations||[]).forEach(p=>{const f=p?.url_citation?.url||p?.url;f&&c.push(f)})}catch{}return{ok:!0,text:"【千问·联网检索】"+u,sources:c.slice(0,6)}}catch(r){return{ok:!1,text:"",sources:[],note:"千问联网搜索不可达："+String(r?.message||r)}}}async function Ut(t,e,n){try{const s=await rt("https://api.moonshot.cn/v1/kimi_search_api",n,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+e},body:JSON.stringify({model:"kimi-search-api",messages:[{role:"user",content:t}]})});if(!s.ok)return{ok:!1,text:"",sources:[],note:"Kimi 搜索 HTTP "+s.status};const r=await s.json(),a=r?.choices?.[0]?.message?.content;if(!a)return{ok:!1,text:"",sources:[],note:"Kimi 搜索无内容"};const i=[];try{(r?._citations||r?.citations||[]).forEach(l=>{const o=typeof l=="string"?l:l?.url||l?.original_url;o&&i.push(o)})}catch{}return{ok:!0,text:K(a,3e3),sources:i.slice(0,6)}}catch(s){return{ok:!1,text:"",sources:[],note:"Kimi 搜索不可达："+String(s?.message||s)}}}async function Wt(t,e){let n="auto",s="";try{const l=window.Store.get().settings||{};n=l.searchProvider||"auto",s=String(l.searchKey||"")}catch{}if(n==="fallback")return null;const r=Ht(),a=n==="auto"?r.provider:n,i=s||r.key;return!a||!i?null:a==="zhipu"?Bt(t,i,e):a==="dashscope"?Dt(t,i,e):a==="kimi"?Ut(t,i,e):null}function Q(t,e){return String(t||"").replace(/\s+/g," ").trim().slice(0,e)}async function dt(t,e,n){try{const s=new URLSearchParams({action:"query",list:"search",srsearch:t,format:"json",srlimit:"1",origin:"*"}),i=(await(await ot(`https://${e}.wikipedia.org/w/api.php?`+s.toString(),n)).json())?.query?.search?.[0];if(!i?.title)return{};const l=new URLSearchParams({lang:e==="zh"?"zh-cn":"en",format:"json",origin:"*"}),u=await(await ot(`https://${e==="zh"?"zh":"en"}.wikipedia.org/api/rest_v1/page/summary/`+encodeURIComponent(i.title)+"?"+l.toString(),n)).json();return{title:i.title,extract:u?.extract||"",url:u?.content_urls?.desktop?.page||"https://"+e+".wikipedia.org/wiki/"+encodeURIComponent(i.title)}}catch{return{net:!0}}}async function Gt(t,e){try{const s=await(await ot("https://api.duckduckgo.com/?"+new URLSearchParams({q:t,format:"json",no_html:"1",skip_icon_info:"1"}).toString(),e)).json(),r=[],a=s?.RelatedTopics||[];for(const i of a){const l=i?.Topics||[i];for(const o of l)if(o?.Text&&r.push(Q(o.Text,160)),r.length>=4)break;if(r.length>=4)break}return{text:Q(s?.AbstractText||"",600),url:s?.AbstractURL||"",related:r}}catch{return{text:"",related:[],net:!0}}}function ot(t,e){const n=new AbortController,s=setTimeout(()=>{try{n.abort()}catch{}},e);return fetch(t,{signal:n.signal,headers:{Accept:"application/json"}}).finally(()=>clearTimeout(s))}async function wt(t,e){const n=String(t||"").trim().slice(0,200);if(!n)return{ok:!1,text:"",sources:[],note:"空查询"};const s=12e3;let r="";try{const a=await Wt(n,s);if(a&&a.ok)return a;a&&a.note&&(r=a.note+"；")}catch{}try{const[a,i,l]=await Promise.all([dt(n,"zh",s),dt(n,"en",s),Gt(n,s)]),o=[],u=[];a.extract&&(o.push("【维基·"+a.title+"】"+Q(a.extract,700)),a.url&&u.push(a.url)),i.extract&&i.extract!==a.extract&&(o.push("[Wiki·"+i.title+"] "+Q(i.extract,500)),i.url&&u.push(i.url)),l.text&&(o.push("【DDG 摘要】"+l.text),l.url&&u.push(l.url)),l.related.length&&o.push("【相关】"+l.related.join("；"));const c=o.join(`

`).slice(0,3e3);if(!c){const d=a.net&&i.net&&l.net,p=r+(d?"联网源（维基百科/DuckDuckGo）均无法连接——中国大陆网络通常访问不到这些站点。建议在「设置→云端AI」配置智谱/千问等带官方搜索的接口（自动复用其 key），或改用已有知识作答。":"已连接但无匹配结果（该主题可能无百科/即时答案）。");return{ok:!1,text:"",sources:[],note:p}}return{ok:!0,text:c,sources:u.slice(0,6)}}catch(a){return{ok:!1,text:"",sources:[],note:"搜索失败："+String(a?.message||a)}}}function Xt(){return{setStatus(){},roundStream(){},step(){},think(){},writing(){},finish(){},fail(){},cancelled:!1,onCancel(){}}}function Vt(t,e){let n=Nt();return n?n.toolTask(t,{primary:!1}):e?Xt():(n=Et.aiFloat("🛠 "+t),n.toolTask(t,{primary:!0}))}const Yt={type:"function",function:{name:"python_exec",description:"在浏览器沙箱执行 Python 代码（numpy/sympy/matplotlib 已就绪），返回 stdout 与生成的图表。数学答案与关键中间量必须以工具计算为准。",parameters:{type:"object",properties:{code:{type:"string",description:"完整可运行的 Python 代码"}},required:["code"]}}},$t={type:"function",function:{name:"web_search",description:"联网检索事实/定义/背景资料（维基百科 + DuckDuckGo 即时答案，适合知识点、概念、公式、人物事件等）。需要实时/权威外部信息时调用；纯计算用 python_exec。",parameters:{type:"object",properties:{query:{type:"string",description:"搜索关键词（简洁明确，中文或英文）"}},required:["query"]}}};function R(t){if(t==="fc"||t==="json")return t;let e="auto";try{e=String(j.get().ai.toolProto||"auto")}catch{}if(e==="json"||e==="fc")return e;try{const n=A.activeApi();return n&&n.fc===!0?"fc":"json"}catch{return"json"}}function it(t){return t==="fc"?"需要再计算/检索就直接再次调用工具（python_exec / web_search）；可以直接回答时用自然文字作答。":'需要再调用工具输出 {"tool":"python_exec"或"web_search",...}；可以直接回答用户时输出自然文字（不要 JSON）。'}function Kt(t,e){return`工具执行结果：
`+(t.error?"[错误] "+t.error+`
`+t.output:t.output||"(无输出，请用 print 输出结论)")+(t.image?`
[图表已生成并展示给用户]`:"")+`
请继续：`+it(e)}function Qt(t,e){return`联网搜索结果：
`+(t.ok?t.text+(t.sources&&t.sources.length?`

参考来源：`+t.sources.join(" | "):""):"[搜索未成功] "+(t.note||"无结果"))+`

请基于以上检索内容继续（注意来源可靠性，必要时交叉验证）：`+it(e)}function Zt(t,e){return`站内检索结果（考生自己的数据，命中即引用来源）：
`+(t.ok?t.text:"[无命中] "+(t.note||""))+`

请基于以上站内内容继续（没有命中的部分如实说明，不要编造自己的数据）：`+it(e)}function te(t,e){let n=0,s=!1,r=!1;for(let a=e;a<t.length;a++){const i=t.charAt(a);if(s){r?r=!1:i==="\\"?r=!0:i==='"'&&(s=!1);continue}if(i==='"')s=!0;else if(i==="{")n++;else if(i==="}"&&(n--,n===0))return t.slice(e,a+1)}return null}function at(t){let e=null;try{e=A.extractRobustJSON(t)}catch{e=null}if(e&&typeof e=="object"&&(e.tool||e.final))return e;const n=/"(tool|final)"\s*:/g;let s;for(;(s=n.exec(t))!==null;){const r=t.lastIndexOf("{",s.index);if(r<0)continue;const a=te(t,r);if(a)try{const i=JSON.parse(a);if(i&&typeof i=="object"&&(i.tool||i.final))return i}catch{}}return e&&typeof e=="object"?e:null}function ee(t,e){return t==="fc"?oe(e):ne(e)}function ne(t){return{name:"json",async runRound(e,n){const s=String(await A.chatMessagesStream(e,function(a,i){try{n(String(a||""),String(i||""))}catch{}},{cache:!1,timeout:18e4,ctx:t})||""),r=at(s);return r&&r.tool==="python_exec"&&typeof r.code=="string"?{kind:"tool",name:"python_exec",args:{code:r.code},raw:s}:r&&r.tool==="web_search"&&typeof r.query=="string"?{kind:"tool",name:"web_search",args:{query:r.query},raw:s}:r&&r.tool==="site_search"&&typeof r.query=="string"?{kind:"tool",name:"site_search",args:{query:r.query,sources:Array.isArray(r.sources)?r.sources:void 0},raw:s}:r&&r.final?{kind:"final",obj:r,raw:s}:{kind:"text",raw:s}},pushToolTurn(e,n,s){e.push({role:"assistant",content:n.raw}),e.push({role:"user",content:s})},pushTextTurn(e,n){e.push({role:"assistant",content:n})}}}function oe(t){let e="";try{e=String((A.activeApi()||{}).id||"")}catch{}return{name:"fc",async runRound(n,s){const r=await A.chatMessagesStream(n,function(u,c){try{s(String(u||""),String(c||""))}catch{}},{cache:!1,timeout:18e4,tools:[Yt,$t],tool_choice:"auto",apiId:e||void 0,ctx:t}),a=String(r&&r.text||""),i=r&&Array.isArray(r.toolCalls)?r.toolCalls.filter(u=>u&&u.function):[],l=i.find(u=>u.function.name==="python_exec"||u.function.name==="web_search")||null;if(l){let u={};try{u=JSON.parse(l.function.arguments||"{}")||{}}catch{u={}}const c=l.function.name==="web_search"?"web_search":"python_exec";if(String(u[c==="web_search"?"query":"code"]||"").trim())return{kind:"tool",name:c,args:u,raw:a,toolCallId:String(l.id||""),assistantMsg:{role:"assistant",content:a||null,tool_calls:i}}}const o=at(a);return o&&o.final?{kind:"final",obj:o,raw:a}:{kind:"text",raw:a}},pushToolTurn(n,s,r){n.push(s.assistantMsg||{role:"assistant",content:s.raw||null}),n.push({role:"tool",tool_call_id:s.toolCallId||"",content:r})},pushTextTurn(n,s){n.push({role:"assistant",content:s})}}}const se=8,V=160,re=2e3,ie=40,H=new Map;function mt(t){return String(t||"").toLowerCase().replace(/\s+/g,"")}function ae(t,e){const n=String(t||"").replace(/\s+/g," ").trim();if(n.length<=V)return n;const s=n.toLowerCase().indexOf(e.toLowerCase());if(s<0)return n.slice(0,V)+"…";const r=Math.max(0,s-Math.floor(V/3));return(r>0?"…":"")+n.slice(r,r+V)+"…"}function ce(t,e){const n=String(t||"").trim();if(n.length<2)return[];const s=mt(n),r=o=>!e||!e.length||e.indexOf(o)>=0,a=[],i=j.get(),l=function(o,u,c,d,p){!c||mt(c).indexOf(s)<0||a.push({kind:o,title:String(u||"").slice(0,30),text:ae(d||c,n),ref:String(p||"")})};return r("books")&&(i.studyBooks||[]).forEach(function(o){(o.chapters||[]).forEach(function(u,c){(u.questions||[]).forEach(function(d,p){l("资料库题",(o.title||"")+"·"+(u.title||"第"+(c+1)+"章"),(d.stem||"")+" "+(d.point||"")+" "+(d.solution||""),d.stem,o.id+"#c"+c+"q"+p)})})}),r("exams")&&((i.sprintData||{}).mockExams||[]).forEach(function(o){(o.questions||[]).forEach(function(u,c){l("题卷题",o.title||"未命名卷",(u.stem||"")+" "+(u.topicName||"")+" "+(u.solution||""),u.stem,(o.id||"")+"#q"+c)})}),r("quizBank")&&(i.quizBank||[]).forEach(function(o){l("收藏题库",o.topicName||"收藏",(o.stem||"")+" "+(o.trap||"")+" "+(o.solution||""),o.stem,o.id||"")}),r("mistakes")&&(i.mistakes||[]).forEach(function(o){l("错题",o.subject||"错题",(o.desc||"")+" "+(o.stem||"")+" "+(o.type||""),o.desc||o.stem,o.id||"")}),r("photos")&&(i.mistakePhotos||[]).forEach(function(o){l("拍题错题",o.painPoint||"拍题",(o.extractedQuestion||"")+" "+(o.note||"")+" "+(o.painPoint||""),o.extractedQuestion||o.note,o.id||"")}),r("vocab")&&(i.vocab||[]).forEach(function(o){l("单词",o.word||"",(o.word||"")+" "+(o.meaning||"")+" "+(o.rare||"")+" "+(o.example||""),o.meaning||o.word,o.id||o.word||"")}),r("pol")&&((i.polRecite||[]).forEach(function(o){l("政治背诵",o.topic||"政治",(o.topic||"")+" "+(o.points||[]).join(" ")+" "+(o.card||""),o.card||o.topic,o.id||"")}),(i.polChoice||[]).forEach(function(o){l("政治选择",o.subject||"政治",(o.stem||"")+" "+(o.analysis||""),o.stem,o.id||"")})),r("playbooks")&&(i.playbooks||[]).forEach(function(o){l("方法卡",o.title||"方法",(o.title||"")+" "+(o.tags||[]).join(" ")+" "+(o.recognize||[]).join(" ")+" "+(o.steps||[]).map(function(u){return(u.name||"")+" "+(u.do||"")}).join(" "),o.title,o.id||"")}),r("tasks")&&(i.tasks||[]).forEach(function(o){l("任务",o.subject||"任务",(o.text||"")+" "+(o.note||""),o.text,o.id||"")}),r("weekly")&&(i.weeklyStats?Object.keys(i.weeklyStats):[]).forEach(function(o){const u=i.weeklyStats[o]||{};l("周报",o,o+" "+(u.mentalState||"")+" "+(u.specialEvent||"")+" "+(u.mainErrorTypes||[]).join(" "),u.mentalState||u.specialEvent||o,o)}),a}function St(t,e){const n=String(t||"").trim();if(n.length<2)return{ok:!1,text:"",hits:[],note:"查询词太短（至少 2 字）"};let s=0;try{s=j.rev()}catch{}const r=n.toLowerCase()+"|"+(e&&e.length?e.join(","):"*"),a=H.get(r);if(a&&a.rev===s)return Object.assign({},a.res,{cached:!0});const l=ce(n,e).slice(0,se);let o=re,u="";const c=[];for(const p of l){const f="· ["+p.kind+"] "+p.title+"："+p.text;if(u.length+f.length>o)break;u+=(u?`
`:"")+f,c.push(p)}const d=c.length?{ok:!0,text:u,hits:c}:{ok:!1,text:"",hits:[],note:"站内没有命中「"+n+"」的内容（可换关键词，或改用 web_search 查外部资料）"};if(H.set(r,{rev:s,res:d}),H.size>ie){const p=H.keys().next().value;p!=null&&H.delete(p)}return d}const ct=["【工程工具模式（已启用：沙箱 Python，numpy/sympy/matplotlib 就绪）】","⚠️ 你【确实拥有】python_exec 工具且它真实可用——本环境不依赖平台工具栏/函数调用开关，",'工具通过在回复中直接输出 JSON 调用（{"tool":"python_exec","code":"…"}），结果会真实回传。','不要因为"以为自己没有工具"而跳过计算或说"我无法执行代码"。',"【多轮循环机制】这不是一次性问答：你输出工具 JSON 后【立即停止本轮】，系统真实执行并把",'stdout/错误作为新消息回传给你，你再继续——来回多轮直到完成；"先输出工具 JSON 等结果"是完全可行且被支持的，不是自言自语。'].join(`
`),le=`
`+ct+`
`+['【指令优先级】"只输出题目 JSON"指的是【最终交付物】；计算验证阶段输出工具 JSON 不违反它，恰恰是必经之路。',"【出题工作循环——像人类命题人一样闭环工作（严格遵守）】","① 产生思路：确定考点、解法、难度定位与命题意图。",'② 计算验证：调用 Python 工具（只输出 {"tool":"python_exec","code":"<sympy/numpy 代码>"}）真实算出标准答案与关键中间量——严禁凭感觉编造数值答案。',"③ 闭环调整：检查计算结果——若答案/难度/计算量不符合命题意图，调整思路再算（可多轮）；若发现之前的解法有问题，推翻重来。","④ 验收合格：标准答案经工具确认无误、题面所需数值全部落实。","⑤ 开始出题：围绕已验证的数值与思路，只输出题目 JSON 本体（格式：stem/type/options/answer/solution/trap），不要再带工具标记。","【配图规约（重要）】几何图形/函数图像/积分区域/数据图等需要配图的题：在验证阶段用 python_exec + matplotlib","画出精确图形（figsize≈(4,3)，含坐标轴/刻度/图例，关键点与区域标注清晰）。numpy/sympy【已在环境中装好】；","matplotlib / scipy 首次使用时【自动装载】（直接 import 即可，等待片刻即可）——","严禁 micropip / pyodide.loadPackage / asyncio（不存在也不需要，用了必报错）；","图【不需要 savefig 到文件】（沙箱无文件语义，画完留在内存即可，也无需 plt.show()）；系统自动收取图形作为题目配图，","严禁把文件路径（如 /tmp/xx.png）写进题面/解析/JSON。","【课本风·必用助手】环境已内置 at_style2d / at_style3d——标准右手系、原点式坐标轴箭头、半透明面板，与教材例题同款：",'平面图：ax = plt.gca(); at_style2d(ax)；立体图（曲面/空间曲线/区域/向量）：ax = fig.add_subplot(projection="3d"); at_style3d(ax)。',"图中标注优先用 LaTeX 数学记号（$...$）；已装载黑体，中文标注可用；若日志提示字体未就绪（中文变方框）则改用英文/LaTeX。","若计算结果与预想不符，以计算结果为准调整题面或答案。"].join(`
`),ue=`
`+ct+`
`+['1) 需要计算/验算/画图时，只输出一个 JSON {"tool":"python_exec","code":"<Python代码>"}；需要事实/定义/背景/最新资料时，只输出 {"tool":"web_search","query":"<检索词>"}；需要查【考生自己的数据】（他的资料库题/题卷/收藏题库/错题/拍题错题/单词/政治/方法卡/任务/周报）时，只输出 {"tool":"site_search","query":"<关键词>","sources":["books|exams|quizBank|mistakes|photos|vocab|pol|playbooks|tasks|weekly 里按需选，可省略=全部"]}。工具会真实执行，结果回传给你。',"2) 数学答案与关键中间量必须以工具计算为准；画图直接用 matplotlib；不确定的外部事实先 web_search 再作答，不要臆造。","3) 回答「我上次那道…错题」「我资料库里的…」「我练过的…」这类指向考生个人数据的问题，【必须先 site_search】拿到真实内容再作答，禁止凭印象编造；站内没命中就如实说，可再补 web_search。","4) 完成后直接用自然文字回答（保持你原有的输出格式与标记习惯），不要带工具 JSON。"].join(`
`),pe=["【工程工具模式（已启用：沙箱 Python + 联网搜索，numpy/sympy/matplotlib 就绪）】","⚠️ 你【确实拥有】python_exec（计算/画图）与 web_search（联网检索事实/定义/背景）两个工具且真实可用——本环境通过平台【原生 function calling】提供：","需要计算/验算/画图直接调用 python_exec（参数 code）；需要事实/定义/最新资料直接调用 web_search（参数 query）。平台会真实执行并回传结果。",'不要输出 {"tool":"python_exec",...} 这类文本 JSON（那是旧协议，本会话已不使用），','更不要因为"以为自己没有工具"而跳过计算或说"我无法执行代码"。',"【多轮循环机制】这不是一次性问答：每次工具调用后系统真实执行并回传结果，你再继续——来回多轮直到完成。"].join(`
`),fe=`
`+pe+`
`+["1) 需要计算/验算/画图时直接调用 python_exec 工具；需要事实/定义/背景/最新资料时直接调用 web_search 工具，结果会回传给你。","2) 数学答案与关键中间量必须以工具计算为准；不确定的外部事实先检索再作答，不要臆造。","3) 完成后直接用自然文字回答（保持你原有的输出格式与标记习惯）。"].join(`
`),de=`
`+ct+`
`+["【工作方式】凡涉及数学推导、数值验算、统计、画图的问题，先调用 Python 真实算；",'需要事实/定义/背景/最新资料时调用 {"tool":"web_search","query":"…"} 联网检索（维基百科/DDG）。',"结论以工具计算/检索结果为准；本问题不需要就直接回答，不必强行调用工具。","【配图规约】画图用 matplotlib（figsize≈(4,3)），直接 import（首次使用自动装载）；","严禁 micropip / pyodide.loadPackage / asyncio；无需 savefig/plt.show（沙箱无文件语义），系统自动收取图形。","【最终交付（最重要）】完成后直接输出最终回答，并【严格保持你原系统提示词规定的输出格式】","（JSON schema、ACTION/QUERY/FLOW 等标记约定原样不变）——工具轮只是工作过程，",'最终回答里不得出现工具 JSON 或"我调用了工具"之类的说明。'].join(`
`),yt='{"tool":',me=/^\s*(?:`{0,3}[a-zA-Z]*)?\s*\{\s*"tool"\s*:/;function bt(t){const e=String(t||"");if(!e.trim())return"hold";if(me.test(e))return"tool";const n=e.replace(/^\s*`{0,3}[a-zA-Z]*\s*/,"");return n.length<=yt.length&&yt.indexOf(n)===0?"hold":"final"}function vt(t){const e=Math.max(1,t.maxRounds||20),n=Vt(t.label||"AI 工程任务",t.quiet);let s=!1;n.onCancel(()=>{s=!0});const r=()=>s||!!(t.signal&&t.signal.aborted)||!!(t.isCancelled&&t.isCancelled()),a=[{role:"system",content:(t.system||"")+de}],i=(t.user||"")+`

（环境提醒：本会话支持多轮工具调用——需要计算/画图时输出 {"tool":"python_exec","code":"…"} 并立即停止本轮，Python 会真实执行并把结果回传给你；不需要计算就直接按原格式输出最终回答。）`;return a.push({role:"user",content:t.imageDataUrl?[{type:"text",text:i},{type:"image_url",image_url:{url:t.imageDataUrl}}]:i}),new Promise((l,o)=>{const u=()=>{n.fail("已取消"),o(Object.assign(new Error("已取消"),{cancelled:!0}))},c=(d,p)=>{if(r()){u();return}n.setStatus(d>1?"第 "+d+" 轮 · 等待模型响应…":"任务已发起，等待模型响应…");let f=!1;A.chatMessagesStream(a,function(w,h){if(r())return;const m=String(w||"");h&&n.think(h);const g=bt(m);if(g!=="hold"){if(g==="tool"){n.roundStream(d,m),f&&t.onChunk&&t.onChunk("",""),f=!1;return}f||(f=!0),n.writing(m),t.onChunk&&t.onChunk(m,h||"")}},{cache:!1,timeout:18e4,signal:t.signal,ctx:t.ctx}).then(w=>{if(r()){u();return}const h=String(w||""),m=at(h),g=!!(m&&(m.tool==="python_exec"&&typeof m.code=="string"||m.tool==="web_search"&&typeof m.query=="string"||m.tool==="site_search"&&typeof m.query=="string"));if(g&&f&&(t.onChunk&&t.onChunk("",""),f=!1),g&&d>=e&&!p){n.setStatus("已达工具轮上限，强制汇总…"),a.push({role:"assistant",content:h}),a.push({role:"user",content:"已达最大工具轮次。请停止调用工具，基于目前已有结果，严格按原格式直接输出最终回答。"}),c(d+1,!0);return}if(g&&p){n.finish(),l(h);return}if(g){const v=m.tool==="web_search",k=m.tool==="site_search";n.setStatus("第 "+d+" 轮 · "+(k?"站内搜索…":v?"联网搜索…":"执行 Python…"));const x=k?"📚 站内 "+String(m.query||""):v?"🔍 "+String(m.query||""):String(m.code||""),_=k||v?'还需要检索/计算就输出 {"tool":"site_search"或"web_search"或"python_exec",...}；完成了就按原格式直接输出最终回答。':'还需要计算/画图就输出 {"tool":...}；完成了就按原格式直接输出最终回答。';(k?Promise.resolve((()=>{const y=St(String(m.query||""),Array.isArray(m.sources)?m.sources:void 0);return{ok:y.ok,output:y.ok?y.text:"[站内无命中] "+(y.note||""),error:"",image:""}})()):v?wt(String(m.query||"")).then(y=>({ok:y.ok,output:y.ok?y.text+(y.sources.length?`
来源：`+y.sources.join(" | "):""):"[未检索到] "+(y.note||""),error:"",image:""})):st(m.code).then(y=>({ok:!y.error,output:y.output,error:y.error,image:y.image}))).then(y=>{Lt("tool",t.ctx),n.step({round:d,tool:m.tool,code:x,output:y.output,error:y.error,image:y.image}),a.push({role:"assistant",content:h}),a.push({role:"user",content:`工具执行结果：
`+(y.error?"[错误] "+y.error+`
`:"")+(y.output||"(无输出/无结果)")+(y.image?`
（图形已收录，最终回答可引用）`:"")+`
请继续：`+_}),c(d+1,p)}).catch(y=>{const T=String(y?.message||y);n.step({round:d,tool:m.tool,code:x,output:"",error:T}),a.push({role:"assistant",content:h}),a.push({role:"user",content:"工具执行异常："+T+`
请调整思路，按原格式输出最终回答。`}),c(d+1,p)});return}if(!h.trim()){if(d>e){n.fail("模型返回空内容"),o(new Error("模型返回空内容"));return}n.setStatus("返回为空，重试中…"),c(d+1,p);return}t.onChunk&&!f&&t.onChunk(h,""),n.finish(),l(h)}).catch(w=>{if(r()){n.fail("已取消"),o(Object.assign(new Error("已取消"),{cancelled:!0}));return}n.fail(String(w?.message||w)),o(w)})};c(1,!1)})}function ht(t,e){return String(t||"").replace(/\s+/g," ").trim().slice(0,e)}function kt(t){return["你是考研学习的工程助手，可以使用 Python 工具（numpy/sympy/matplotlib 已就绪）与联网搜索工具。","工作方式（严格遵守）：",t==="fc"?'1) 需要计算/验算/画图时直接调用 python_exec 工具（参数 code=Python 代码）；需要事实/定义/背景/最新资料时调用 web_search 工具（参数 query=检索词）；平台真实执行并回传结果，不要输出 {"tool":...} 文本 JSON。':'1) 需要计算/验算/画图时，只输出一个 JSON 对象：{"tool":"python_exec","code":"<Python代码>"}；需要事实/定义/背景/最新资料时，只输出：{"tool":"web_search","query":"<检索词>"}。不要 markdown 代码块、不要多余文字，结果会真实回传。',"2) 画图用 matplotlib，直接 plt. 即可，图片会自动捕获展示给用户，无需 savefig/show。","3) 得出结论后，直接用正常的简体中文回答用户（自然文字，不要 JSON），结论必须有工具计算/检索结果支撑，不要臆造。","4) 一次任务里可以连续调用工具多轮（计算与搜索可交替），直到确有把握。"].join(`
`)}const ye=kt("json");function he(t){return["你是考研题目的验算引擎，可以使用 Python 工具（numpy/sympy 已安装）。","工作方式（严格遵守）：",t==="fc"?["1) 需要计算/验算时，直接调用 python_exec 工具（原生 function calling，参数 code=要执行的Python代码），",'   平台真实执行并回传 stdout；不要输出 {"tool":...} 文本 JSON。优先用 sympy 做符号验算，辅以数值代入抽查。'].join(""):["1) 每次只输出一个 JSON 对象，不要 markdown 代码块、不要多余文字。",'2) 需要计算/验算时输出：{"tool":"python_exec","code":"<要执行的Python代码>"}。',"   代码将真实执行，stdout 会回传给你。优先用 sympy 做符号验算，辅以数值代入抽查。"].join(`
`),(t==="fc"?"2":"3")+") 验算完成或无需工具时"+(t==="fc"?"，用文本输出最终结论":"输出最终结论")+'：{"final":true,"verdict":"通过|不通过|无法确定","reason":"一句话依据"}。',(t==="fc"?"3":"4")+") 多次调用工具直到确有把握；不要臆造计算结果。"].join(`
`)}async function et(t){const e=R(t.proto);return X({system:he(e),maxRounds:t.maxRounds||6,proto:e,ctx:t.ctx}).send(t.task,{onStep:t.onStep,isCancelled:t.isCancelled})}function X(t){const e=t?.maxRounds||20,n=R(t?.proto),s=ee(n,t?.ctx),r=t?.history?.length?t.history.slice():[{role:"system",content:String(t?.system||kt(n))}];return{history:r,proto:n,async send(a,i){const l=[];r.push({role:"user",content:a});let o="";const u=p=>{const f=String(p||""),w=f.search(/\{[\s\S]*?"(?:tool|final)"\s*:/);return w>=0?f.slice(0,w).trim():/^\s*(?:`{0,3}[a-zA-Z]*)?\s*\{/.test(f)?"":f.trim()},c=function(p,f){const w=bt(p);if(w==="tool"){if(i?.onToolStream)try{i.onToolStream(p)}catch{}if(!i?.onText)return;d&&(i.onText("",""),d=!1),f&&i.onText("",f);return}if(!i?.onText)return;const h=p.search(/\{[\s\S]*?"(?:tool|final)"\s*:/);if(h>=0){if(/"tool"\s*:/.test(p)&&i?.onToolStream)try{i.onToolStream(p)}catch{}const m=p.slice(0,h).trim(),g=(o?o+`

`:"")+m;f?i.onText(g,f):m&&i.onText(g,"");return}if(w==="hold"){f&&i.onText("",f);return}if(/^\s*(?:`{0,3}[a-zA-Z]*)?\s*\{/.test(p)){f&&i.onText("",f);return}d=!0,i.onText(o?o+`

`+p:p,f)};let d=!1;for(let p=1;p<=e;p++){if(i?.isCancelled&&i.isCancelled()){const h={round:p,type:"text",text:"已取消"};return l.push(h),r.push({role:"assistant",content:"（已取消）"}),i?.onStep&&i.onStep(h),{finalText:"已取消",verdict:"",steps:l,rounds:p}}let f;try{f=await s.runRound(r,c)}catch(h){return{finalText:"AI 调用失败："+String(h?.message||h),verdict:"",steps:l,rounds:p}}if(d=!1,f.kind==="tool"){const h=f.name==="web_search",m=f.name==="site_search",g={round:p,type:"exec",tool:f.name,code:h?"🔍 "+String(f.args.query||""):m?"📚 站内 "+String(f.args.query||""):String(f.args.code||""),query:h||m?String(f.args.query||""):void 0};i?.onStep&&i.onStep(g);let v;if(m){const x=St(String(f.args.query||""),f.args.sources);g.output=x.ok?ht(x.text,220):"[站内无命中] "+(x.note||""),v=Zt(x,s.name)}else if(h){const x=await wt(String(f.args.query||""));g.output=x.ok?ht(x.text,200):"[未检索到] "+(x.note||""),g.searchSources=x.sources,v=Qt(x,s.name)}else{const x=await st(String(f.args.code||""));g.output=x.output,g.error=x.error,g.image=x.image,v=Kt(x,s.name)}l.push(g),i?.onStep&&i.onStep(g),s.pushToolTurn(r,f,v);const k=u(f.raw);k&&(o=(o?o+`

`:"")+k);continue}if(f.kind==="final"){const h={round:p,type:"final",text:String(f.obj.reason||f.obj.verdict||"")};return l.push(h),i?.onStep&&i.onStep(h),s.pushTextTurn(r,f.raw),{finalText:(o?o+`

`:"")+(f.obj.verdict?"【"+f.obj.verdict+"】":"")+(f.obj.reason||""),verdict:String(f.obj.verdict||""),steps:l,rounds:p}}const w={round:p,type:"text",text:f.raw};return l.push(w),i?.onStep&&i.onStep(w),s.pushTextTurn(r,f.raw),{finalText:(o?o+`

`:"")+f.raw,verdict:"",steps:l,rounds:p}}return{finalText:"达到最大工具轮次（"+e+"）仍未收敛，请拆小问题或增加轮次。",verdict:"",steps:l,rounds:e}}}}const z=tt({running:!1,steps:[]});function J(){const t=j.get().settings;return!!(t.aiTools&&t.aiTools.enabled)}function _t(t){j.update(e=>{e.settings.aiTools=Object.assign({enabled:!1},e.settings.aiTools,{enabled:t})})}function Z(){try{const t=j.get().settings;return!(t.aiTools&&t.aiTools.scopeAll===!1)}catch{return!0}}function Tt(t){j.update(e=>{e.settings.aiTools=Object.assign({enabled:!1},e.settings.aiTools,{scopeAll:t})})}function ge(){Tt(!Z()),window.App&&window.App.refresh()}function xe(){let t="未探测";try{const n=A.activeApi();t=n&&n.fc===!0?"支持原生FC ✓":n&&n.fc===!1?"不支持原生FC ✗":"未探测 ?"}catch{}let e="json";try{e=R()}catch{}return"当前接口："+t+" · 生效："+(e==="fc"?"原生 FC":"JSON 协议")}function we(t){j.update(n=>{n.ai.toolProto=t==="json"||t==="fc"?t:void 0});const e=window.Toast;e&&e.show("工具协议模式已设为 "+(t==="json"?"JSON（通用兜底）":t==="fc"?"原生 FC（强制，接口不支持时会失败）":"自动（跟随探测）"),"info",2500),window.App&&window.App.refresh()}function Se(){const t=window.Toast;let e=null;try{e=A.activeApi()}catch{}if(!e||!e.endpoint||!e.key||!e.model){t&&t.warn("当前接口配置不完整，无法探测");return}t&&t.show("🔍 正在探测「"+(e.name||e.model)+"」的原生 FC 能力…","info",28e3),A.probeFC(e).then(function(n){e.id&&A.setApiFc(e.id,n.v==="ok"?!0:n.v==="no"?!1:void 0),n.v==="ok"?t&&t.success("✅ 支持原生 FC，已标记（auto 模式将自动启用）"):n.v==="no"?t&&t.show("⛔ 不支持原生 FC，继续用 JSON 协议（通用兜底）","info",4e3):t&&t.show("❓ 探测不确定："+n.note+"，保守沿用 JSON 协议","info",4e3),window.App&&window.App.refresh()})}function be(){const t=J(),e=S.status,n=e==="ready"?"已就绪":e==="loading"?"下载中…":e==="error"?"加载失败":"未下载";let s="auto";try{s=String(j.get().ai.toolProto||"auto")}catch{}return'<div class="card" id="st-aitools-card"><div class="card-title-row"><span class="card-title">🧪 AI 工程台（实验功能）</span><button class="btn btn-ghost btn-sm" onclick="window.AiTools.settingsGo()">打开</button></div><div class="muted-sm" style="margin-bottom:6px">给 AI 增加真实工程能力：全站各模块的 AI（出题、批改、复盘、规划、教练对话等）自动获得多轮长程任务——调用本地 Python（numpy/sympy/matplotlib）真实计算、验算、画图，过程在右下角任务卡实时可见、可随时取消。默认关闭，不影响现有任何功能。</div><div class="muted-sm" style="margin-bottom:6px">状态：'+(t?"已启用":"未启用")+" · 组件："+n+(t?" · 覆盖："+(Z()?"全部模块":"仅测验/教练"):"")+'</div><div class="btn-row"><button class="btn btn-sm '+(t?"btn-ghost":"btn-primary")+'" onclick="window.AiTools.settingsToggle()">'+(t?"停用":"启用（本机）")+"</button>"+(t?'<button class="btn btn-sm btn-ghost" onclick="window.AiTools.settingsDownload()">'+(e==="ready"?"重新下载组件":"下载扩展组件（约10MB）")+"</button>":"")+(t?'<button class="btn btn-sm btn-ghost" data-testid="at-scope-btn" onclick="window.AiTools.settingsScope()">'+(Z()?"覆盖范围：全部模块（点击退回仅测验/教练）":"覆盖范围：仅测验/教练（点击扩展到全部模块）")+"</button>":"")+"</div>"+(t?'<div style="margin-top:8px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:12px" data-testid="at-proto-row" title="fc 仅作用于多轮 agent 会话（教练/验算/工程对话）；全站桥 toolChat 与出题闭环暂固定 JSON 协议。fc 会话会把请求钉在创建时的接口上，不做跨协议 failover。"><span class="muted-sm">工具调用协议：</span><select class="input" style="width:auto;font-size:12px;padding:2px 6px" data-testid="at-proto-sel" onchange="window.AiTools.settingsProto(this.value)">'+[["auto","自动（跟随接口探测）"],["json","JSON 协议（通用兜底）"],["fc","原生 FC（强制）"]].map(function(r){return'<option value="'+r[0]+'"'+(s===r[0]?" selected":"")+">"+r[1]+"</option>"}).join("")+'</select><button class="btn btn-sm btn-ghost" data-testid="at-probe-btn" onclick="window.AiTools.settingsProbe()">🔍 探测当前接口</button><span class="muted-sm" data-testid="at-proto-state">'+xe()+"</span></div>":"")+"</div>"+(t?At():"")}function ve(){_t(!J()),window.App&&window.App.refresh()}function ke(){window.Toast&&window.Toast.show("⏳ 正在下载扩展组件（约 10MB，仅此一次）…","info",8e3),G(t=>{window.Toast&&window.Toast.show(t,"info",3e3)}).then(()=>{window.Toast&&window.Toast.success("✅ 扩展组件就绪（numpy + sympy）"),window.App&&window.App.refresh()}).catch(t=>{window.Toast&&window.Toast.danger("扩展组件加载失败："+String(t?.message||t))})}function _e(){window.App&&window.App.go("aitools")}function At(){const e='<div class="card" id="at-res-card"><div class="card-title-row"><span class="card-title">📦 组件资源管理</span><button class="btn btn-ghost btn-sm" onclick="window.AiTools.resRefresh()">↻ 刷新状态</button></div><div class="muted-sm" style="margin-bottom:6px">基础组件随首次下载安装；画图/数值组件默认「首次使用时按需下载」——重度用户可点「预载」提前装好，出题配图与 scipy 计算零等待。装过即记忆：重启后自动从缓存后台恢复，无需手动操作。</div>'+[["runtime","Pyodide 运行时（内核 + 标准库）","≈10MB",!0],["numpy","numpy（数值计算）","≈7MB",!0],["sympy","sympy（符号验算核心）","≈11MB",!0],["mpl","matplotlib（精确画图）","≈9MB",!1],["font","SimHei 中文字体（图内中文）","≈4.7MB",!1],["scipy","scipy（数值积分/优化）","≈12MB",!1]].map(function(n){return'<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid var(--line);font-size:12.5px"><span style="flex:1">'+n[1]+(n[3]?' <span class="tag">基础</span>':' <span class="tag">画图</span>')+'</span><span class="muted-sm" style="width:64px;text-align:right">'+n[2]+'</span><span data-rs="'+n[0]+'" style="width:84px;text-align:right;font-weight:600">…</span></div>'}).join("")+'<div class="btn-row" style="margin-top:8px"><button class="btn btn-sm btn-primary" onclick="window.AiTools.resPreload()">🎨 预载画图组件（matplotlib + 中文字体 + scipy ≈26MB）</button></div></div>';return setTimeout(()=>{if(typeof document<"u"&&document.body)try{W()}catch{}},60),setTimeout(()=>{if(typeof document<"u"&&document.body)try{W()}catch{}},4e3),e}function W(){Jt().then(t=>{if(typeof document>"u"||!document.body)return;const e={runtime:t.runtime,numpy:t.numpy,sympy:t.sympy,mpl:t.mpl,font:t.font,scipy:t.scipy};Object.keys(e).forEach(n=>{const s=document.querySelector('[data-rs="'+n+'"]');s&&(s.textContent=e[n]?"✓ 已装载":"未装载",s.style.color=e[n]?"var(--ok,#237804)":"var(--text-muted,#888)")})}).catch(()=>{})}function Te(){const t=window.Toast;if(!q()){t&&t.warn("基础组件未就绪——先点上方「下载扩展组件」");return}t&&t.show("⏳ 正在预载画图组件（matplotlib + 中文字体 + scipy ≈26MB，仅首次，视网速约 1~3 分钟）…","info",1e4),Ft(e=>{t&&t.show(e,"info",3e3)}).then(()=>{t&&t.success("✅ 画图 + scipy 组件就绪——出题配图与数值计算零等待"),W()}).catch(e=>{t&&t.danger("预载失败："+String(e.message||e)),W()})}function Ae(t,e,n,s){z.running=!0,z.steps=[];const r=["请验算下面这道考研题目的答案是否正确。","【题目】"+(t||"（无题干）"),"【给出的答案】"+(e||"（无）"),"【给出的解析】"+(n||"（无）"),"要求：先用 sympy 独立重新求解/验算（不要照抄解析），再数值代入抽查，最后给出结论。"].join(`
`);return et({task:r,maxRounds:6,onStep:a=>{z.steps.push(a),s&&s.onStep&&s.onStep(a)},isCancelled:s&&s.isCancelled}).finally(()=>{z.running=!1})}const Pe=new Map,B=new Map,Y=new Map;function E(t){return String(t||"").replace(/</g,"&lt;")}function D(t,e,n,s,r){const a=[],i=(c,d,p)=>{t.innerHTML='<div class="card" style="margin-top:12px" data-testid="at-verify-card"><div class="card-title-row"><span class="card-title">'+r+'</span><span class="tag" style="background:'+(c==="通过"?"#237804":c==="不通过"?"#cf1322":"#8c8c8c")+';color:#fff">'+(p?"验算中…":c||"完成")+"</span></div>"+a.join("")+'<div style="margin-top:6px"><b style="color:'+(c==="通过"?"#237804":c==="不通过"?"#cf1322":"inherit")+'">'+(p?"AI 正在自主调用 Python 工具验算…":E(d||"完成"))+"</b></div></div>"},l=e.get(n);if(l){i(l.verdict,l.report,!1);return}const o=Y.get(n);if(o){i("","",!0),o.then(c=>i(c.verdict,c.report,!1)).catch(c=>i("失败","验算失败："+String(c?.message||c),!1));return}i("","",!0);const u=et({task:s,maxRounds:6,onStep:c=>{c.type==="exec"&&(a.push('<details style="margin-top:6px"><summary class="muted-sm" style="cursor:pointer">第 '+c.round+' 轮 · AI 调用 Python 工具（点击展开代码与输出）</summary><pre class="report" style="font-size:12px">'+E(c.code)+'</pre><pre class="report" style="font-size:12px;opacity:.8">输出：'+E(c.output||"(无)")+(c.error?`
错误：`+E(c.error):"")+"</pre></details>"),i("","",!0))}}).then(c=>{if(e.set(n,{verdict:c.verdict,report:c.finalText}),e.size>30){const d=e.keys().next().value;d!==void 0&&e.delete(d)}return i(c.verdict,c.finalText,!1),{verdict:c.verdict,report:c.finalText}}).catch(c=>{throw i("失败","验算失败："+String(c?.message||c),!1),c});Y.set(n,u),u.finally(()=>{Y.delete(n)}),u.catch(()=>{})}function Ce(t){const e=[{role:"system",content:t.system+`
`+le},{role:"user",content:t.ask+`

（环境提醒：本会话支持多轮工具调用——需要计算时输出 {"tool":"python_exec","code":"…"} 并立即停止本轮，Python 会真实执行并把结果回传给你。数学题的标准答案必须先用它算出。）`}],n=8,s=[];return new Promise((r,a)=>{const i=l=>{if(t.isCancelled&&t.isCancelled()){a(Object.assign(new Error("已取消"),{cancelled:!0}));return}A.chatMessagesStream(e,function(o,u){t.onStream&&t.onStream(o||"",u||"")},{cache:!1,timeout:18e4,ctx:t.ctx}).then(o=>{let u=null;try{u=A.extractRobustJSON(o)}catch{u=null}if(u&&u.tool==="python_exec"&&typeof u.code=="string"){st(u.code).then(c=>{if(c.image&&String(c.image).indexOf("data:image")===0&&s.push(c.image),t.onStep&&t.onStep({round:l,type:"exec",code:u.code,output:c.output,error:c.error,image:c.image}),e.push({role:"assistant",content:o}),e.push({role:"user",content:`工具执行结果：
`+(c.error?"[错误] "+c.error+`
`:"")+(c.output||"(无输出，请用 print 输出结论)")+(c.image?`
（图形已收录，可作为题目配图）`:"")+`
请继续：需要再算/画图输出 {"tool":...}；算好了只输出题目 JSON 本体。`}),l>=n){a(new Error("达到最大工具轮次仍未输出题目 JSON"));return}i(l+1)});return}if(u&&u.stem){delete u.tool,s.length&&(u.diagramImg=s[s.length-1],u.diagrams=s.slice()),r(u);return}if(l>=n){a(new Error("AI 未输出有效题目 JSON。最后输出前200字："+o.slice(0,200)));return}e.push({role:"assistant",content:o}),e.push({role:"user",content:"请严格只输出题目 JSON 本体（含 stem/type/options/answer/solution/trap 字段），不要其他内容。"}),i(l+1)}).catch(a)};i(1)})}function Oe(t,e){try{if(!t||!J())return;if(!q()){t.innerHTML='<div class="muted-sm" style="margin-top:10px">🧪 AI 工程验算：组件未就绪（到「AI 工程台」下载扩展组件后，出题将自动附带 sympy 真实验算）。</div>';return}const n=["请验算下面这道考研题目的答案是否正确。","【题目】"+(e.stem||"（无题干）"),"【给出的答案】"+(e.answer||"（无）"),"【给出的解析】"+(e.solution||"（无）"),"要求：先用 sympy 独立重新求解/验算（不要照抄解析），再数值代入抽查，最后给出结论。"].join(`
`);D(t,Pe,e.key,n,"🧪 AI 工程验算（sympy 真实计算）")}catch{}}function je(t,e){try{if(!J())return;(e||[]).forEach(n=>{if(!n||!n.aiAnalysis||!(n.aiAnalysis.keySteps||n.aiAnalysis.solution))return;const s=t.querySelector('[data-pm-verify="'+n.id+'"]');if(!s)return;const r=n.id+"|"+(n.updatedAt||n.createdAt||""),a="🧪 AI 工程验算（解析防幻觉）";if(B.get(r)){D(s,B,r,"",a);return}if(Y.has(r)){D(s,B,r,"",a);return}s.innerHTML='<div class="card" style="margin-top:12px"><div class="card-title-row"><span class="card-title">🧪 AI 工程验算（解析防幻觉）</span></div><div class="btn-row"><button class="btn btn-sm btn-ghost" data-pm-verify-run="'+n.id+'">🔬 手动验算（AI 调 sympy 核对解析，消耗 token）</button></div></div>';const l=s.querySelector('[data-pm-verify-run="'+n.id+'"]');l&&(l.onclick=function(){const o=["请验算这道拍题的 AI 解析是否正确（防解析幻觉）。","【题目】"+(n.extractedQuestion||n.note||"（无题干）"),"【AI 给出的解题关键】"+(n.aiAnalysis.keySteps||n.aiAnalysis.solution||"（无）"),"【易错原因】"+(n.aiAnalysis.errorCause||"（无）"),"要求：先用 sympy 独立重新求解（不要照抄解析），对照 AI 的解题关键逐步核对，再数值代入抽查，最后给出结论（AI 解析有错请明确指出错在哪一步）。"].join(`
`);if(q()){D(s,B,r,o,a);return}const u=c=>{s.innerHTML='<div class="muted-sm" style="margin-top:10px">⏳ '+String(c||"").replace(/</g,"&lt;")+"</div>"};u("正在加载工程组件（约 10MB，仅首次）…"),G(c=>u(c)).then(()=>D(s,B,r,o,a)).catch(c=>{s.innerHTML='<div class="muted-sm" style="margin-top:10px">工程组件加载失败：'+String(c&&c.message||c).replace(/</g,"&lt;")+"（检查网络后重试）</div>"})})})}catch{}}var I=null;function Ee(){I=null}function Ne(t,e){if(I&&!e?.fresh)return t.innerHTML="",t.appendChild(I.root),I.panel;var n=document.createElement("div");n.innerHTML='<div class="card"><div class="card-title-row"><span class="card-title">🤖 AI 工程出题中…</span><button class="btn btn-sm btn-ghost" data-testid="qes-cancel">取消</button></div><div style="margin:6px 0"><span class="tag" data-testid="qes-status" style="background:#8c8c8c;color:#fff"></span></div><details open style="margin-top:8px"><summary class="muted-sm" style="cursor:pointer">💭 思考过程（实时流式）</summary><pre class="report" data-testid="qes-think" style="max-height:220px;overflow:auto;opacity:.72;font-size:12px;white-space:pre-wrap;margin-top:4px"></pre></details><div data-testid="qes-tools" style="margin-top:8px"></div><div data-testid="qes-content-wrap" style="display:none;margin-top:10px"><div class="card-title-sm">📝 题面生成（基于已验证数值）</div><pre class="report" data-testid="qes-content" style="max-height:260px;overflow:auto;white-space:pre-wrap;font-size:12px"></pre></div></div>',t.innerHTML="",t.appendChild(n);var s=0,r=!1,a=null,i=0,l=n.querySelector('[data-testid="qes-status"]'),o=n.querySelector('[data-testid="qes-think"]'),u=n.querySelector('[data-testid="qes-think-wrap"]'),c=n.querySelector('[data-testid="qes-tools"]'),d=n.querySelector('[data-testid="qes-content"]'),p=n.querySelector('[data-testid="qes-content-wrap"]'),f=n.querySelector('[data-testid="qes-cancel"]');f&&e&&e.onCancel&&(f.onclick=function(){e.onCancel()});var w=!1,h=0,m=null;function g(){w=!0,h=Date.now(),m&&clearInterval(m);var _=function(){if(w){var P=Math.round((Date.now()-h)/1e3);k("📤 已发送出题请求，等待模型响应…（"+P+"s）"),m=setTimeout(_,1e3)}};_()}function v(){w=!1,m&&(clearInterval(m),m=null)}function k(_,P){l&&(l.textContent=_,P&&(l.style.background=P))}g();var x={setStatus:k,stream:function(_,P){r||(r=!0,v(),k("✅ 已连接 · 流式接收中…","#1a7f37")),P&&(u&&(u.style.display=""),o&&(o.textContent=P,o.scrollTop=o.scrollHeight));var y=String(_||"").trim();if(y.indexOf('{"tool"')===0){var T=s+1;k("🛠 第 "+T+" 轮：AI 正在构造 Python 计算代码…","#8c8c8c"),(i!==T||!a||!a.parentNode)&&(a&&a.parentNode&&a.parentNode.removeChild(a),a=document.createElement("details"),a.setAttribute("data-round-draft",String(T)),a.style.margin="6px 0",a.open=!0,a.innerHTML='<summary class="muted-sm" style="cursor:pointer">🛠 第 '+T+' 轮 · 正在构造 Python 计算代码…</summary><pre class="report" style="font-size:12px;white-space:pre-wrap"></pre>',c&&c.appendChild(a),i=T);var N=a.querySelector("pre");if(N)try{N.textContent=JSON.parse(y).code||y}catch{N.textContent=y}return}y&&(v(),k("✍ 正在撰写题面（基于已验证数值）…","#1a7f37"),p&&(p.style.display=""),d&&(d.textContent=y,d.scrollTop=d.scrollHeight))},toolRound:function(_,P,y,T,N){if(s=Math.max(s,_),v(),a&&i===_&&(a.parentNode&&a.parentNode.removeChild(a),a=null,i=0),k("🛠 第 "+_+" 轮计算完成 ✓ → 继续分析结果…","#1a7f37"),!!c){c.style.display="";var F=document.createElement("details");F.style.margin="6px 0",F.open=!0,F.innerHTML='<summary class="muted-sm" style="cursor:pointer">🛠 第 '+_+" 轮 · Python 计算完成"+(T?"（出错，已回传修正）":" ✓")+'</summary><pre class="report" style="font-size:12px;white-space:pre-wrap">'+E(P)+'</pre><pre class="report" style="font-size:12px;opacity:.8;white-space:pre-wrap">→ 输出：'+E(y||"(无)")+(T?`
错误：`+E(T):"")+"</pre>"+(N?'<img src="'+E(N)+'" alt="工具产图" style="max-width:100%;border-radius:8px;border:1px solid var(--line);margin-top:6px;background:#fff">':""),c.appendChild(F)}},done:function(){v(),k("✅ 完成","#237804"),I=null}};return I={root:n,panel:x},x}const C=tt({items:[],running:!1});let O=null;function Le(){return O||(O=X({maxRounds:20})),O}function Pt(t,e){if(t=String(t||"").trim(),!t||C.running)return;if(!q()){window.Toast&&window.Toast.warn("扩展组件未就绪，请先下载（约 10MB）");return}C.items.push({role:"user",text:t,steps:[]});const n=tt({role:"assistant",text:"",steps:[],image:""});C.items.push(n),C.running=!0,Le().send(t,{onStep:s=>{s.type==="exec"&&(n.steps.push(s),s.image&&(n.image=s.image))},isCancelled:e}).then(s=>{n.text=s.finalText||"（完成）"}).catch(s=>{n.text="AI 调用失败："+String(s?.message||s)}).finally(()=>{C.running=!1,Ot()})}const lt="kaoyan2026_aitools_chat";function Me(t,e="copilot.chat"){const n=R();return X({system:(t||"")+(n==="fc"?fe:ue),maxRounds:20,proto:n,ctx:e})}function Ct(){O=null,C.items.length=0;try{localStorage.removeItem(lt)}catch{}}function Ot(){try{const t=O?O.history.slice(-40):[],e=C.items.slice(-30),n=O?O.proto:"";localStorage.setItem(lt,JSON.stringify({hist:t,items:e,proto:n}))}catch{}}function Ie(){try{const t=localStorage.getItem(lt);if(!t)return;const e=JSON.parse(t);if(Array.isArray(e.items)&&e.items.length&&e.items.forEach(function(n){C.items.push({role:n.role==="user"?"user":"assistant",text:String(n.text||""),steps:Array.isArray(n.steps)?n.steps:[],image:n.image||""})}),Array.isArray(e.hist)&&e.hist.length){if(e.proto&&e.proto!==R()){console.warn("[AiTools] 工具协议已切换（"+e.proto+" → "+R()+"），丢弃跨协议会话上下文");return}O=X({history:e.hist})}}catch{}}function ze(){try{if(!J()||S.status!=="idle")return;setTimeout(function(){G(function(){}).catch(function(){})},1500)}catch{}}const jt={settingsCard:be,settingsToggle:ve,settingsDownload:ke,settingsGo:_e,resourceCard:At,resRefresh:W,resPreload:Te,ensureLoaded:G,isReady:q,loaderState:S,pytoolsState:z,chatState:C,renderExamPanel:Ne,resetExamPanel:Ee,newCoachSession:Me,chatSend:Pt,chatReset:Ct,saveChat:Ot,restoreChat:Ie,maybeAutoLoad:ze,verifyAnswer:Ae,quizAutoVerify:Oe,photoAutoVerify:je,generateQuestion:Ce,runAgent:et,enabled:J,setEnabled:_t,toolChat:vt,scopeAll:Z,setScopeAll:Tt,settingsScope:ge,settingsProto:we,settingsProbe:Se};try{window.AiTools=jt}catch{}const Je=Object.freeze(Object.defineProperty({__proto__:null,AiTools:jt,SYSTEM_GENERAL:ye,chatReset:Ct,chatSend:Pt,chatState:C,createAgentSession:X,ensureLoaded:G,isReady:q,loaderState:S,pytoolsState:z,runAgent:et,toolChat:vt},Symbol.toStringTag,{value:"Module"}));export{jt as A,Pt as a,z as b,C as c,Ct as d,R as e,Je as i,S as l,Ft as p,Jt as r};
