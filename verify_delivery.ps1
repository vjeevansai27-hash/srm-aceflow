$resIndex = Invoke-WebRequest -Uri 'http://localhost:3000/' -UseBasicParsing
$resApp = Invoke-WebRequest -Uri 'http://localhost:3000/app.js' -UseBasicParsing
$resCss = Invoke-WebRequest -Uri 'http://localhost:3000/style.css' -UseBasicParsing

Write-Host "Index Status:" $resIndex.StatusCode "Bytes:" $resIndex.RawContentLength
Write-Host "App.js Status:" $resApp.StatusCode "Bytes:" $resApp.RawContentLength
Write-Host "Style.css Status:" $resCss.StatusCode "Bytes:" $resCss.RawContentLength

# Verify app.js contains the key methods
Write-Host "Contains autoSolveLiveSession:" ($resApp.Content.Contains('autoSolveLiveSession'))
Write-Host "Contains submitSLOLinkAction:" ($resApp.Content.Contains('submitSLOLinkAction'))
Write-Host "Contains submitMCQsAction:" ($resApp.Content.Contains('submitMCQsAction'))
Write-Host "Contains renderLiveSessionView:" ($resApp.Content.Contains('renderLiveSessionView'))
Write-Host "Contains getcircleinfo:" ($resApp.Content.Contains('getcircleinfo'))
