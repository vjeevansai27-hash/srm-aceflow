$loginBody = @{ USER_ID = 'RA2511026011232'; PASSWORD = 'RA2511026011232'; key = 'john' } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=/curricula/login' -Method Post -Body $loginBody -ContentType 'application/json'
$headers = @{ Authorization = $loginRes.token }

$qPayload = @{
    COURSE_INFO = @{ COURSE_CODE = '21CSC201J'; BATCH_ID = '21CSC201J_13' }
    USER_ID     = 'RA2511026011232'
    FULL_NAME   = 'VADDI JEEVAN VENKATA RANGA SAI'
    DEPARTMENT  = 'CSE AI/ML'
    SESSION     = 101
    key         = 'john'
    MCQ         = 5
    SQ          = 2
    LQ          = 1
} | ConvertTo-Json

$res = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=/curricula/student/session/getquestions' -Method Post -Body $qPayload -Headers $headers -ContentType 'application/json'

Write-Host "=== MCQS FOR 21CSC201J SESSION 101 ==="
for ($i = 0; $i -lt $res.mcq.Count; $i++) {
    $m = $res.mcq[$i]
    Write-Host "Q$($i+1): $($m.QUESTION_DESC)"
    Write-Host "  1: $($m.OPT_1)"
    Write-Host "  2: $($m.OPT_2)"
    Write-Host "  3: $($m.OPT_3)"
    Write-Host "  4: $($m.OPT_4)"
    Write-Host "  Answer: $($m.ANSWER)"
    Write-Host ""
}
