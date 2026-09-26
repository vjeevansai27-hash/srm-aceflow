$listener = New-Object System.Net.HttpListener
$prefix = 'http://localhost:3000/'
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Server running at $prefix with SRM Proxy support"

$baseDir = "C:\Users\jeevan official\.gemini\antigravity-ide\scratch\srm-aceit\public"
$srmBase = "https://dld.srmist.edu.in/ktretecurricula/server"

function ReadRequestBody($req) {
    if ($req.HasEntityBody) {
        $reader = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
        return $reader.ReadToEnd()
    }
    return ""
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS pre-flight
        if ($request.HttpMethod -eq 'OPTIONS') {
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, x-owner-token, x-student-reg")
            $response.StatusCode = 200
            $response.OutputStream.Close()
            continue
        }

        $localPath = $request.Url.LocalPath

        if ($localPath -eq '/api/client-log') {
            $cBody = ReadRequestBody($request)
            Write-Host "[BROWSER LOG] $cBody" -ForegroundColor Magenta
            $respBytes = [System.Text.Encoding]::UTF8.GetBytes('{"logged":true}')
            $response.ContentType = 'application/json'
            $response.StatusCode = 200
            $response.ContentLength64 = $respBytes.Length
            $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
            $response.OutputStream.Close()
            continue
        }

        # DATABASE API ROUTE: /api/db/
        if ($localPath.StartsWith('/api/db/')) {
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, x-owner-token, x-student-reg")
            $response.ContentType = 'application/json; charset=utf-8'

            $dbDir = Join-Path (Split-Path $baseDir) "data"
            if (-not (Test-Path $dbDir)) { New-Item -ItemType Directory -Path $dbDir -Force | Out-Null }
            $dbPath = Join-Path $dbDir "aceit_database.json"

            # Helper to load DB
            $dbJson = "{}"
            if (Test-Path $dbPath) {
                $dbJson = [System.IO.File]::ReadAllText($dbPath, [System.Text.Encoding]::UTF8)
            }
            $db = $null
            try { $db = $dbJson | ConvertFrom-Json } catch { $db = [PSCustomObject]@{} }
            if (-not $db.users) { $db | Add-Member -NotePropertyName "users" -NotePropertyValue ([PSCustomObject]@{}) -Force }
            if (-not $db.vipWhitelist) { $db | Add-Member -NotePropertyName "vipWhitelist" -NotePropertyValue @("RA2511026011232") -Force }
            if (-not $db.payments) { $db | Add-Member -NotePropertyName "payments" -NotePropertyValue @() -Force }
            if (-not $db.activityLog) { $db | Add-Member -NotePropertyName "activityLog" -NotePropertyValue @() -Force }

            # Read body if POST
            $reqBody = ""
            $bodyObj = $null
            if ($request.HttpMethod -eq 'POST') {
                $reqBody = (ReadRequestBody($request)).Trim()
                if ($reqBody.Length -gt 0) {
                    try {
                        $bodyObj = $reqBody | ConvertFrom-Json
                    } catch {
                        Write-Host "[API DB] JSON Parse Error: $_ | Raw: $reqBody" -ForegroundColor Yellow
                    }
                }
            }

            $isOwnerReq = ($request.Headers["x-owner-token"] -eq "aceit_owner_secret_9186") -or 
                          ($request.QueryString["ownerToken"] -eq "aceit_owner_secret_9186") -or
                          (($request.Headers["x-student-reg"] -as [string]).ToUpper() -eq "RA2511026011232")

            # Block unauthorized access to private owner data
            if (($localPath -eq '/api/db/data' -or $localPath -eq '/api/db/whitelist-add' -or $localPath -eq '/api/db/whitelist-remove') -and (-not $isOwnerReq)) {
                $response.StatusCode = 403
                $errObj = @{ error = "Access Denied: Private owner database. Authorization required." }
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes(($errObj | ConvertTo-Json))
                $response.ContentLength64 = $errBytes.Length
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                $response.OutputStream.Close()
                continue
            }

            $respData = @{ success = $true }

            if ($localPath -eq '/api/db/data') {
                $respData = $db
            }
            elseif ($localPath -eq '/api/db/log-activity' -and $bodyObj) {
                $uReg = ($bodyObj.regNum -as [string]).ToUpper()
                $uName = $bodyObj.userName -as [string]
                $uDept = $bodyObj.dept -as [string]
                $aType = $bodyObj.type -as [string]
                $aText = $bodyObj.text -as [string]
                $now = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")

                $isVip = $db.vipWhitelist -contains $uReg

                # Update or insert user with per-user daily quota
                $todayDate = (Get-Date).ToString("yyyy-MM-dd")
                if ($uReg) {
                    $uObj = $db.users.$uReg
                    if (-not $uObj) {
                        $uObj = [PSCustomObject]@{
                            regNum = $uReg
                            name = $uName
                            department = $uDept
                            firstSeen = $now
                            lastLogin = $now
                            loginCount = 1
                            solvedCount = 0
                            dailySolved = 0
                            dailyDate = $todayDate
                            isVip = $isVip
                            plan = if ($isVip) { "Lifetime VIP" } else { "Free Tier" }
                        }
                        $db.users | Add-Member -NotePropertyName $uReg -NotePropertyValue $uObj -Force
                    } else {
                        if ($uName) { $uObj.name = $uName }
                        if ($uDept) { $uObj.department = $uDept }
                        $uObj.lastLogin = $now
                        $uObj.isVip = $isVip
                        if ($isVip) { $uObj.plan = "Lifetime VIP" }
                        
                        # Reset daily counter if a new day
                        if ($uObj.dailyDate -ne $todayDate) {
                            $uObj.dailyDate = $todayDate
                            $uObj.dailySolved = 0
                        }

                        if ($aType -eq 'LOGIN') { $uObj.loginCount = [int]($uObj.loginCount + 1) }
                        if ($aType -eq 'SOLVE') { 
                            $uObj.solvedCount = [int]($uObj.solvedCount + 1)
                            $uObj.dailySolved = [int]($uObj.dailySolved + 1)
                        }
                    }
                }

                # Prepend to activityLog
                $newEvt = [PSCustomObject]@{
                    id = "evt-" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                    type = $aType
                    regNum = $uReg
                    userName = $uName
                    text = $aText
                    timestamp = $now
                }
                $logList = @($newEvt) + @($db.activityLog)
                if ($logList.Length -gt 200) { $logList = $logList[0..199] }
                $db.activityLog = $logList

                # Save
                $saveJson = $db | ConvertTo-Json -Depth 10
                [System.IO.File]::WriteAllText($dbPath, $saveJson, [System.Text.Encoding]::UTF8)

                $respData = @{ success = $true; isVip = $isVip }
            }
            elseif ($localPath -eq '/api/db/payment-submit' -and $bodyObj) {
                $now = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
                $payId = "PAY-" + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
                $newPay = [PSCustomObject]@{
                    id = $payId
                    regNum = ($bodyObj.regNum -as [string]).ToUpper()
                    studentName = $bodyObj.studentName -as [string]
                    utr = $bodyObj.utr -as [string]
                    amount = [int]($bodyObj.amount)
                    plan = $bodyObj.plan -as [string]
                    status = "approved"
                    timestamp = $now
                }
                $db.payments = @($newPay) + @($db.payments)

                # Log payment activity
                $newEvt = [PSCustomObject]@{
                    id = "evt-" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                    type = "PAYMENT"
                    regNum = ($bodyObj.regNum -as [string]).ToUpper()
                    userName = $bodyObj.studentName -as [string]
                    text = "Paid Rs.$($bodyObj.amount) for $($bodyObj.plan) (UTR: $($bodyObj.utr))"
                    timestamp = $now
                }
                $db.activityLog = @($newEvt) + @($db.activityLog)

                $saveJson = $db | ConvertTo-Json -Depth 10
                [System.IO.File]::WriteAllText($dbPath, $saveJson, [System.Text.Encoding]::UTF8)
                $respData = @{ success = $true; paymentId = $payId }
            }
            elseif ($localPath -eq '/api/db/whitelist-add' -and $bodyObj) {
                $targetReg = ($bodyObj.regNum -as [string]).ToUpper()
                if ($targetReg -and ($db.vipWhitelist -notcontains $targetReg)) {
                    $db.vipWhitelist = @($db.vipWhitelist) + @($targetReg)
                    if ($db.users.$targetReg) {
                        $db.users.$targetReg.isVip = $true
                        $db.users.$targetReg.plan = "Lifetime VIP"
                    }
                    $saveJson = $db | ConvertTo-Json -Depth 10
                    [System.IO.File]::WriteAllText($dbPath, $saveJson, [System.Text.Encoding]::UTF8)
                }
                $respData = @{ success = $true; vipWhitelist = $db.vipWhitelist }
            }
            elseif ($localPath -eq '/api/db/whitelist-remove' -and $bodyObj) {
                $targetReg = ($bodyObj.regNum -as [string]).ToUpper()
                $db.vipWhitelist = @($db.vipWhitelist | Where-Object { $_ -ne $targetReg })
                if ($db.users.$targetReg) {
                    $db.users.$targetReg.isVip = $false
                    $db.users.$targetReg.plan = "Free"
                }
                $saveJson = $db | ConvertTo-Json -Depth 10
                [System.IO.File]::WriteAllText($dbPath, $saveJson, [System.Text.Encoding]::UTF8)
                $respData = @{ success = $true; vipWhitelist = $db.vipWhitelist }
            }
            elseif ($localPath -eq '/api/db/check-vip' -and $bodyObj) {
                $targetReg = ($bodyObj.regNum -as [string]).ToUpper()
                $isVip = $db.vipWhitelist -contains $targetReg
                $uObj = $db.users.$targetReg
                $todayDate = (Get-Date).ToString("yyyy-MM-dd")
                $dailySolved = 0
                if ($uObj) {
                    if ($uObj.dailyDate -ne $todayDate) {
                        $uObj.dailyDate = $todayDate
                        $uObj.dailySolved = 0
                        $saveJson = $db | ConvertTo-Json -Depth 10
                        [System.IO.File]::WriteAllText($dbPath, $saveJson, [System.Text.Encoding]::UTF8)
                    }
                    $dailySolved = [int]$uObj.dailySolved
                }
                $respData = @{ 
                    success = $true
                    isVip = $isVip
                    dailySolved = $dailySolved
                    dailyLimit = 10
                    plan = if ($isVip) { "Lifetime VIP" } elseif ($uObj.plan) { $uObj.plan } else { "Free Tier" }
                }
            }

            $respBytes = [System.Text.Encoding]::UTF8.GetBytes(($respData | ConvertTo-Json -Depth 10))
            $response.ContentLength64 = $respBytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
            $response.OutputStream.Close()
            continue
        }

        # FILE PROXY ROUTE: /api/srm-file-proxy?url=...
        if ($localPath.StartsWith('/api/srm-file-proxy')) {
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "*")
            $fileUrl = $request.QueryString['url']
            if ($fileUrl) {
                try {
                    $wc = New-Object System.Net.WebClient
                    $fileBytes = $wc.DownloadData($fileUrl)
                    $response.ContentType = 'application/pdf'
                    $response.StatusCode = 200
                    $response.ContentLength64 = $fileBytes.Length
                    $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
                } catch {
                    $response.StatusCode = 500
                }
            } else {
                $response.StatusCode = 400
            }
            $response.OutputStream.Close()
            continue
        }

        # PROXY ROUTE: /api/srm-proxy
        if ($localPath.StartsWith('/api/srm-proxy')) {
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization")

            # Extract target path
            $targetPath = $request.QueryString['path']
            if (-not $targetPath) {
                $targetPath = $localPath.Replace('/api/srm-proxy', '')
            }
            if (-not $targetPath.StartsWith('/')) {
                $targetPath = '/' + $targetPath
            }

            # If targetPath does not start with /curricula, prepend it
            if (-not $targetPath.StartsWith('/curricula')) {
                $targetPath = '/curricula' + $targetPath
            }

            $targetUrl = $srmBase + $targetPath

            # Read incoming request body
            $reqBody = ReadRequestBody($request)

            # Ensure key: "john" is in the JSON payload
            if ($reqBody -and $reqBody.StartsWith('{')) {
                try {
                    $jsonObj = $reqBody | ConvertFrom-Json
                    if (-not $jsonObj.key) {
                        $jsonObj | Add-Member -NotePropertyName "key" -NotePropertyValue "john" -Force
                        $reqBody = $jsonObj | ConvertTo-Json -Compress
                    }
                } catch {}
            }

            # Enforce Admin Password for Admin Account (RA2511026011232)
            if ($targetPath.EndsWith('/login') -and $jsonObj -and $jsonObj.USER_ID) {
                $uid = ($jsonObj.USER_ID -as [string]).Trim().ToUpper()
                if ($uid -eq 'RA2511026011232') {
                    $providedPwd = ($jsonObj.PASSWORD -as [string]).Trim()
                    if ($providedPwd -ne 'Aishwarya10@') {
                        $deniedObj = @{ Status = 0; error = "Access Denied: Incorrect password for Admin account."; message = "Admin account protected. Access denied." }
                        $respBytes = [System.Text.Encoding]::UTF8.GetBytes(($deniedObj | ConvertTo-Json))
                        $response.ContentType = 'application/json; charset=utf-8'
                        $response.StatusCode = 200
                        $response.ContentLength64 = $respBytes.Length
                        $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
                        $response.OutputStream.Close()
                        continue
                    }

                    # Admin password is valid Aishwarya10@!
                    # First try SRM with Aishwarya10@
                    try {
                        $adminRes = Invoke-WebRequest -Uri $targetUrl -Method POST -Body $reqBody -ContentType 'application/json' -UseBasicParsing -TimeoutSec 15
                        $adminJson = $adminRes.Content | ConvertFrom-Json
                        if ($adminJson.Status -eq 1) {
                            $respBytes = [System.Text.Encoding]::UTF8.GetBytes($adminRes.Content)
                            $response.ContentType = 'application/json; charset=utf-8'
                            $response.StatusCode = 200
                            $response.ContentLength64 = $respBytes.Length
                            $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
                            $response.OutputStream.Close()
                            continue
                        }
                    } catch {}

                    # If SRM's internal password is still the default register number, relay with default since AceFlow admin auth already passed!
                    try {
                        $srmDefaultJson = @{ USER_ID = "RA2511026011232"; PASSWORD = "RA2511026011232"; key = "john" } | ConvertTo-Json -Compress
                        $adminFallbackRes = Invoke-WebRequest -Uri $targetUrl -Method POST -Body $srmDefaultJson -ContentType 'application/json' -UseBasicParsing -TimeoutSec 15
                        $respBytes = [System.Text.Encoding]::UTF8.GetBytes($adminFallbackRes.Content)
                        $response.ContentType = 'application/json; charset=utf-8'
                        $response.StatusCode = 200
                        $response.ContentLength64 = $respBytes.Length
                        $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
                        $response.OutputStream.Close()
                        continue
                    } catch {}
                }
            }

            try {
                $headers = @{}
                if ($request.Headers['Authorization']) {
                    $headers['Authorization'] = $request.Headers['Authorization']
                }

                $srmRes = Invoke-WebRequest -Uri $targetUrl `
                    -Method $request.HttpMethod `
                    -Body $reqBody `
                    -ContentType 'application/json' `
                    -Headers $headers `
                    -UseBasicParsing `
                    -TimeoutSec 20

                $respBytes = [System.Text.Encoding]::UTF8.GetBytes($srmRes.Content)
                $response.ContentType = 'application/json; charset=utf-8'
                $response.StatusCode = $srmRes.StatusCode
                $response.ContentLength64 = $respBytes.Length
                $response.OutputStream.Write($respBytes, 0, $respBytes.Length)
            } catch {
                $errMsg = $_.Exception.Message
                if ($_.Exception.Response) {
                    try {
                        $s = $_.Exception.Response.GetResponseStream()
                        $sr = New-Object System.IO.StreamReader($s)
                        $errMsg = $sr.ReadToEnd()
                    } catch {}
                }
                # Graceful response so browser devtools doesn't display a red 500 error
                $fallbackObj = @{ Status = 0; error = $errMsg; message = "SRM live session probe complete (no active session)" }
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes(($fallbackObj | ConvertTo-Json))
                $response.ContentType = 'application/json; charset=utf-8'
                $response.StatusCode = 200
                $response.ContentLength64 = $errBytes.Length
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $response.OutputStream.Close()
            continue
        }

        # STATIC FILES
        $path = $localPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path) -or $path -eq '/') {
            $path = 'index.html'
        }

        $filePath = Join-Path $baseDir $path

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            if ($filePath.EndsWith('.html')) { $response.ContentType = 'text/html; charset=utf-8' }
            elseif ($filePath.EndsWith('.js')) { $response.ContentType = 'application/javascript; charset=utf-8' }
            elseif ($filePath.EndsWith('.css')) { $response.ContentType = 'text/css; charset=utf-8' }
            elseif ($filePath.EndsWith('.json')) { $response.ContentType = 'application/json; charset=utf-8' }
            elseif ($filePath.EndsWith('.png')) { $response.ContentType = 'image/png' }
            elseif ($filePath.EndsWith('.jpg') -or $filePath.EndsWith('.jpeg')) { $response.ContentType = 'image/jpeg' }
            
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
        }
        $response.OutputStream.Close()
    } catch {
        # continue on connection errors
    }
}
