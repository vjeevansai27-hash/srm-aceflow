# AceFlow Localhost Server (PowerShell .NET Native)
# Runs on http://localhost:3000/

$port = 3000
$publicDir = Join-Path $PSScriptRoot "public"
$srmBase = "https://dld.srmist.edu.in/ktretecurricula/server"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Output "AceFlow Dev Server running at http://localhost:$port/"
} catch {
    Write-Error "Failed to start listener: $_"
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".pdf"  = "application/pdf"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS Headers
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization, x-owner-token, x-student-reg")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $urlPath = $request.Url.AbsolutePath

        # ── API ROUTES ───────────────────────────────────────────
        if ($urlPath -match "^/api/srm-proxy") {
            $targetPath = ""
            if ($request.Url.Query -match "path=([^&]+)") {
                $targetPath = [System.Uri]::UnescapeDataString($matches[1])
            }
            if (-not $targetPath.StartsWith("/")) { $targetPath = "/" + $targetPath }
            if (-not $targetPath.StartsWith("/curricula")) { $targetPath = "/curricula" + $targetPath }

            # Read request body
            $bodyText = ""
            if ($request.HasEntityBody) {
                $reader = New-Object System.IO.StreamReader($request.InputStream, $request.ContentEncoding)
                $bodyText = $reader.ReadToEnd()
                $reader.Close()
            }

            # Forward to SRM backend
            $remoteUrl = "$srmBase$targetPath"
            try {
                $req = [System.Net.HttpWebRequest]::Create($remoteUrl)
                $req.Method = $request.HttpMethod
                $req.ContentType = "application/json"
                $req.UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
                $req.Referer = "https://dld.srmist.edu.in/ktretecurricula/"
                $req.Timeout = 25000

                $authHeader = $request.Headers["Authorization"]
                if ($authHeader) {
                    $req.Headers.Add("Authorization", $authHeader)
                }

                if ($bodyText -and ($request.HttpMethod -eq "POST" -or $request.HttpMethod -eq "PUT")) {
                    $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($bodyText)
                    $req.ContentLength = $bodyBytes.Length
                    $postStream = $req.GetRequestStream()
                    $postStream.Write($bodyBytes, 0, $bodyBytes.Length)
                    $postStream.Close()
                }

                $remoteRes = $req.GetResponse()
                $resStream = $remoteRes.GetResponseStream()
                $resReader = New-Object System.IO.StreamReader($resStream)
                $resText = $resReader.ReadToEnd()
                $resReader.Close()
                $remoteRes.Close()

                $outBytes = [System.Text.Encoding]::UTF8.GetBytes($resText)
                $response.ContentType = "application/json; charset=utf-8"
                $response.StatusCode = 200
                $response.OutputStream.Write($outBytes, 0, $outBytes.Length)
            } catch [System.Net.WebException] {
                $we = $_.Exception
                $status = 500
                $errJson = "{`"Status`":0,`"error`":`"SRM Connection Error: $($we.Message)`"}"
                if ($we.Response) {
                    try {
                        $errStream = $we.Response.GetResponseStream()
                        $errReader = New-Object System.IO.StreamReader($errStream)
                        $errJson = $errReader.ReadToEnd()
                        $errReader.Close()
                        $status = [int]$we.Response.StatusCode
                    } catch {}
                }
                $outBytes = [System.Text.Encoding]::UTF8.GetBytes($errJson)
                $response.ContentType = "application/json; charset=utf-8"
                $response.StatusCode = $status
                $response.OutputStream.Write($outBytes, 0, $outBytes.Length)
            } catch {
                $errJson = "{`"Status`":0,`"error`":`"$($_.Exception.Message)`"}"
                $outBytes = [System.Text.Encoding]::UTF8.GetBytes($errJson)
                $response.ContentType = "application/json; charset=utf-8"
                $response.StatusCode = 500
                $response.OutputStream.Write($outBytes, 0, $outBytes.Length)
            }
            $response.Close()
            continue
        }

        if ($urlPath -match "^/api/client-log") {
            $response.ContentType = "application/json"
            $response.StatusCode = 200
            $okBytes = [System.Text.Encoding]::UTF8.GetBytes('{"logged":true}')
            $response.OutputStream.Write($okBytes, 0, $okBytes.Length)
            $response.Close()
            continue
        }

        if ($urlPath -match "^/api/owner-db") {
            $response.ContentType = "application/json"
            $response.StatusCode = 200
            $okBytes = [System.Text.Encoding]::UTF8.GetBytes('{"success":true,"rows":[]}')
            $response.OutputStream.Write($okBytes, 0, $okBytes.Length)
            $response.Close()
            continue
        }

        # ── STATIC FILE SERVING ──────────────────────────────────
        $relPath = $urlPath.TrimStart('/')
        if (-not $relPath -or $relPath -eq "") {
            $relPath = "index.html"
        }

        # Remove query string from file path
        if ($relPath.Contains("?")) {
            $relPath = $relPath.Substring(0, $relPath.IndexOf("?"))
        }

        $filePath = Join-Path $publicDir $relPath
        if (-not (Test-Path $filePath -PathType Leaf)) {
            # SPA fallback: if file not found, serve index.html
            $filePath = Join-Path $publicDir "index.html"
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $ct = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $response.ContentType = $ct
            $response.StatusCode = 200
            $response.ContentLength64 = $fileBytes.Length
            $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    } catch {
        # Keep server loop running even if individual request errors
    }
}
