Write-Host "Connecting to Pinggy over port 443..." -ForegroundColor Cyan
$p = Start-Process ssh -ArgumentList "-p 443 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R0:localhost:3000 a.pinggy.io" -NoNewWindow -PassThru -RedirectStandardOutput "pinggy.log" -RedirectStandardError "pinggy_err.log"
Start-Sleep -Seconds 4
if (Test-Path "pinggy.log") {
    Get-Content "pinggy.log"
}
if (Test-Path "pinggy_err.log") {
    Get-Content "pinggy_err.log"
}
