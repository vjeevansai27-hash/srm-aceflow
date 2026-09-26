$loginBody = @{ USER_ID = 'RA2511026011232'; PASSWORD = 'RA2511026011232'; key = 'john' } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=/curricula/login' -Method Post -Body $loginBody -ContentType 'application/json'
$headers = @{ Authorization = $loginRes.token }

$slots = @(
    @{ CODE = '21CSC203P'; BATCH = '21CSC203P_43' },
    @{ CODE = '21CSC101T'; BATCH = '21CSC101T_2' },
    @{ CODE = '21CSC201J'; BATCH = '21CSC201J_13' },
    @{ CODE = '21CSC202J'; BATCH = '21CSC202J_73' }
)

foreach ($s in $slots) {
    foreach ($sess in @(101, 102, 103, 104, 105)) {
        $qPayload = @{
            COURSE_INFO = @{ COURSE_CODE = $s.CODE; BATCH_ID = $s.BATCH }
            USER_ID     = 'RA2511026011232'
            FULL_NAME   = 'VADDI JEEVAN VENKATA RANGA SAI'
            DEPARTMENT  = 'CSE AI/ML'
            SESSION     = $sess
            key         = 'john'
            MCQ         = 5
            SQ          = 2
            LQ          = 1
        } | ConvertTo-Json

        try {
            $res = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=/curricula/student/session/getquestions' -Method Post -Body $qPayload -Headers $headers -ContentType 'application/json'
            if ($res.mcq) {
                foreach ($m in $res.mcq) {
                    if ($m.QUESTION_DESC -like '*creator of the C*' -or $m.QUESTION_DESC -like '*declare a variable*') {
                        Write-Host ">>> FOUND IN COURSE: $($s.CODE) SESSION: $sess"
                        Write-Host "Q: $($m.QUESTION_DESC)"
                        return
                    }
                }
            }
        } catch {}
    }
}
Write-Host "Done scanning 101-105"
