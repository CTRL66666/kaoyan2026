/* build.js — 合并为单个离线HTML（零依赖，Node直接运行）
 * 用法：node build.js
 * 产物：kaoyan2026.html（CSS/JS全部内联，双击即用，离线可用）
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

const JS_FILES = [
  'js/core/utils.js',
  'js/core/tex.js',
  'js/core/store.js',
  'js/core/data.js',
  'js/core/charts.js',
  'js/core/components.js',
  'js/core/notify.js',
  'js/core/ai.js',
  'js/core/alerts.js',
  'js/modules/dashboard.js',
  'js/modules/tasks.js',
  'js/modules/scheduler.js',
  'js/modules/progress.js',
  'js/modules/review.js',
  'js/modules/mistakes.js',
  'js/modules/redline.js',
  'js/modules/heatmap.js',
  'js/modules/quiz.js',
  'js/modules/inspector.js',
  'js/modules/focus.js',
  'js/modules/conceptmap.js',
  'js/modules/decision.js',
  'js/modules/mental.js',
  'js/modules/reading.js',
  'js/modules/settings.js',
  'js/modules/onboarding.js',
  'js/app.js'
];

let html = read('index.html');
const css = read('css/style.css');
const js = JS_FILES.map(f => '\n/* ===== ' + f + ' ===== */\n' + read(f)).join('\n');

html = html.replace('<!--@css-->', '<style>\n' + css + '\n</style>');
html = html.replace('<!--@js-->', '<script>\n' + js + '\n</script>');

const out = path.join(ROOT, 'kaoyan2026.html');
fs.writeFileSync(out, html, 'utf8');

// ---------- 产物完整性硬校验（防止字符串转义把 </body> 插进 script 里） ----------
const body = fs.readFileSync(out, 'utf8');
const scriptStart = body.indexOf('<script>');
const scriptEnd = body.indexOf('</script>');
const scriptPart = (scriptStart >= 0 && scriptEnd > scriptStart) ? body.slice(scriptStart, scriptEnd) : '';
const problems = [];
if (!body.trimEnd().endsWith('</html>')) problems.push('文件未以 </html> 结尾');
if (scriptPart.indexOf('</body>') >= 0 || scriptPart.indexOf('</html>') >= 0) problems.push('<script> 内部被 </body>/</html> 截断（字符串转义事故）');
const opens = (body.match(/<script>/g) || []).length, closes = (body.match(/<\/script>/g) || []).length;
if (opens !== closes) problems.push('script 标签不配对: ' + opens + '/' + closes);
if (problems.length) {
  console.error('✗ 构建产物校验失败：\n  - ' + problems.join('\n  - '));
  process.exit(1);
}
const kb = Math.round(fs.statSync(out).size / 1024);
console.log('OK 构建完成: kaoyan2026.html (' + kb + ' KB, ' + JS_FILES.length + ' 个JS模块) | 完整性校验通过');
