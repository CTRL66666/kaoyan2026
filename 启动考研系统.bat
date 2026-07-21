@echo off
chcp 65001 >nul
title 26考研全能作战系统 启动器
setlocal

set "HTML=%~dp0kaoyan2026.html"

if not exist "%HTML%" (
  echo [错误] 找不到 kaoyan2026.html，请确认它和本启动器在同一文件夹。
  pause
  exit /b 1
)

echo 正在用系统默认浏览器打开考研系统...
echo 如果还是打不开，请手动把 kaoyan2026.html 拖到 Chrome / Edge 窗口里。
echo.

REM 优先 Edge，其次 Chrome，最后系统默认
set "EDGE=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
set "EDGE2=C:\Program Files\Microsoft\Edge\Application\msedge.exe"
set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "CHROME2=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

if exist "%EDGE%"  ( start "" "%EDGE%"  "%HTML%" & goto :done )
if exist "%EDGE2%" ( start "" "%EDGE2%" "%HTML%" & goto :done )
if exist "%CHROME%"  ( start "" "%CHROME%"  "%HTML%" & goto :done )
if exist "%CHROME2%" ( start "" "%CHROME2%" "%HTML%" & goto :done )

REM 兜底：系统默认关联
start "" "%HTML%"

:done
exit /b 0
