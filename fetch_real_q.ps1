# Login first to get token & user profile
$loginBody = @{
    USER_ID  = 'RA2511026011232'
    PASSWORD = 'RA2511026011232'
    key      = 'john'
} | ConvertTo-Json

$loginRes = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=/curricula/login' -Method Post -Body $loginBody -ContentType 'application/json'

$tokenParts = $loginRes.token.Replace('Bearer :', '').Replace('Bearer ', '').Split('.')
$payloadJson = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($tokenParts[1].PadRight($tokenParts[1].Length + (4 - $tokenParts[1].Length % 4) % 4, '='))) | ConvertFrom-Json

Write-Host "Student:" $payloadJson.FULL_NAME
Write-Host "Dept:" $payloadJson.DEPARTMENT
Write-Host "Slots:" ($payloadJson.SLOT | ConvertTo-Json -Compress)

# Pick first course: 21CSC203P (Advanced Programming Practice) or 21CSC101T
$slot = $payloadJson.SLOT[0]

$qPayload = @{
    COURSE_INFO = @{
        COURSE_CODE = $slot.COURSE_CODE
        BATCH_ID    = $slot.BATCH_ID
    }
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

$headers = @{
    Authorization = $loginRes.token
}

Write-Host "Querying real questions for session 101..."
try {
    $res = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=/curricula/student/session/getquestions' `
        -Method Post `
        -Body $qPayload `
        -Headers $headers `
        -ContentType 'application/json'
    
    Write-Host "Status:" $res.Status
    Write-Host "MCQs count:" $res.mcq.Count
    if ($res.mcq.Count -gt 0) {
        Write-Host "First MCQ:" ($res.mcq[0] | ConvertTo-Json -Depth 3)
    }
} catch {
    Write-Host "Error:" $_.Exception.Message
}
