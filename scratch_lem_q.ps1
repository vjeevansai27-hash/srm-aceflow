$body = @{
  COURSE_INFO = @{ COURSE_CODE = '21LEM202T'; BATCH_ID = '21LEM202T_batch' }
  USER_ID = 'RA2511026011232'
  FULL_NAME = 'VADDI JEEVAN VENKATA RANGA SAI'
  DEPARTMENT = 'CSE AI/ML'
  SLOT = @('A')
  SESSION = 302
  key = 'john'
  MCQ = 5
  SQ = 2
  LQ = 1
} | ConvertTo-Json -Depth 5

$res = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=%2Fcurricula%2Fstudent%2Fsession%2Fgetquestions' -Method POST -Body $body -ContentType 'application/json'
$res | ConvertTo-Json -Depth 4 | Set-Content -Path 'qdata_lem_302.json'
Write-Output "Saved to qdata_lem_302.json"
