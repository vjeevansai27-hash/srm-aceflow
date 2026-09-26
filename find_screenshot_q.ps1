$loginBody = @{ USER_ID = 'RA2511026011232'; PASSWORD = 'RA2511026011232'; key = 'john' } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=/curricula/login' -Method Post -Body $loginBody -ContentType 'application/json'
$tokenParts = $loginRes.token.Replace('Bearer :', '').Replace('Bearer ', '').Split('.')
$payloadJson = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($tokenParts[1].PadRight($tokenParts[1].Length + (4 - $tokenParts[1].Length % 4) % 4, '='))) | ConvertFrom-Json

$slot = $payloadJson.SLOT | Where-Object { $_.COURSE_CODE -eq '21CSC203P' }

foreach ($sess in @(101, 102, 501)) {
    $qPayload = @{
        COURSE_INFO = @{ COURSE_CODE = $slot.COURSE_CODE; BATCH_ID = $slot.BATCH_ID }
        USER_ID     = $payloadJson.USER_ID
        FULL_NAME   = $payloadJson.FULL_NAME
        DEPARTMENT  = $payloadJson.DEPARTMENT
        SLOT        = $payloadJson.SLOT
        SESSION     = $sess
        key         = 'john'
        MCQ         = 5
        SQ          = 2
        LQ          = 1
    } | ConvertTo-Json -Depth 5

    $headers = @{ Authorization = $loginRes.token }
    try {
        $res = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=/curricula/student/session/getquestions' `
            -Method Post -Body $qPayload -Headers $headers -ContentType 'application/json'
        
        Write-Host "=== 21CSC203P Session $sess ==="
        if ($res.mcq.Count -gt 0) {
            foreach ($q in $res.mcq | Select-Object -First 3) {
                Write-Host "Q:" $q.QUESTION_DESC
            }
        }
    } catch {}
}
