# JavaCard LLM Agent - 一键启动脚本
# 在项目根目录运行: powershell -ExecutionPolicy Bypass -File run_all.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "=== Step 1: 检查依赖 ===" -ForegroundColor Cyan
python -c "import fastapi, uvicorn, openai, sentence_transformers, chromadb, pypdf, dotenv; print('All packages OK')"

Write-Host "`n=== Step 2: 运行 Ingest (会下载 bge-m3 ~570MB) ===" -ForegroundColor Cyan
Write-Host "预计耗时 5~15 分钟，请等待..." -ForegroundColor Yellow
python -u -m backend.ingest.run_ingest --mode applet

Write-Host "`n=== Step 3: 启动 FastAPI 服务 ===" -ForegroundColor Cyan
Write-Host "服务地址: http://localhost:8000" -ForegroundColor Green
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Yellow
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
