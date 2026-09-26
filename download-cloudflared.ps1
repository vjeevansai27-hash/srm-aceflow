[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$dest = Join-Path $PSScriptRoot "cloudflared.exe"
if (-not (Test-Path $dest)) {
    Write-Host "Downloading official Cloudflare tunnel binary..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile $dest -UseBasicParsing
    Write-Host "Download complete: $dest" -ForegroundColor Green
} else {
    Write-Host "cloudflared.exe already exists: $dest" -ForegroundColor Green
}
