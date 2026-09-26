$cfPath = Join-Path $PSScriptRoot "cloudflared.exe"
$urlFile = Join-Path $PSScriptRoot "tunnel-url.txt"
if (Test-Path $urlFile) { Remove-Item $urlFile -Force }

Write-Host "Starting Cloudflare HTTPS tunnel for http://localhost:3000 ..." -ForegroundColor Cyan

# Run cloudflared and capture output
& $cfPath tunnel --url http://localhost:3000 2>&1 | ForEach-Object {
    $line = $_.ToString()
    Write-Host $line
    if ($line -match 'https://[a-zA-Z0-9-]+\.trycloudflare\.com') {
        $foundUrl = $matches[0]
        Set-Content -Path $urlFile -Value $foundUrl
        Write-Host ">>> LIVE PUBLIC URL: $foundUrl <<<" -ForegroundColor Green
    }
}
