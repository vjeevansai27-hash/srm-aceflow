# Check what $res.slo and worksheets contain
$loginBody = @{ USER_ID = 'RA2511026011232'; PASSWORD = 'RA2511026011232'; key = 'john' } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=/curricula/login' -Method Post -Body $loginBody -ContentType 'application/json'
$tokenParts = $loginRes.token.Replace('Bearer :', '').Replace('Bearer ', '').Split('.')
$payloadJson = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($tokenParts[1].PadRight($tokenParts[1].Length + (4 - $tokenParts[1].Length % 4) % 4, '='))) | ConvertFrom-Json

# Let's test for C Programming course (21CSC101T or 21CSC203P) from the user's screenshot!
$slot = $payloadJson.SLOT | Where-Object { $_.COURSE_CODE -eq '21CSC101T' }
if (-not $slot) { $slot = $payloadJson.SLOT[0] }

$qPayload = @{
    COURSE_INFO = @{ COURSE_CODE = $slot.COURSE_CODE; BATCH_ID = $slot.BATCH_ID }
    USER_ID     = $payloadJson.USER_ID
    FULL_NAME   = $payloadJson.FULL_NAME
    DEPARTMENT  = $payloadJson.DEPARTMENT
    SLOT        = $payloadJson.SLOT
    SESSION     = 101
    key         = 'john'
    MCQ         = 5
    SQ          = 2
    LQ          = 1
} | ConvertTo-Json -Depth 5

$headers = @{ Authorization = $loginRes.token }
$res = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=/curricula/student/session/getquestions' `
    -Method Post -Body $qPayload -Headers $headers -ContentType 'application/json'

Write-Host "Course:" $slot.COURSE_CODE
Write-Host "MCQs count:" $res.mcq.Count
if ($res.mcq.Count -gt 0) {
    Write-Host "Q1:" $res.mcq[0].QUESTION_DESC
}
Write-Host "SLO structure:" ($res.slo | ConvertTo-Json -Depth 4)
