$loginBody = @{ USER_ID = 'RA2511026011232'; PASSWORD = 'RA2511026011232'; key = 'john' } | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=/curricula/login' -Method Post -Body $loginBody -ContentType 'application/json'
$headers = @{ Authorization = $loginRes.token }

$tokenParts = $loginRes.token.Replace('Bearer :', '').Replace('Bearer ', '').Split('.')
$payloadJson = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($tokenParts[1].PadRight($tokenParts[1].Length + (4 - $tokenParts[1].Length % 4) % 4, '='))) | ConvertFrom-Json

Write-Host "Student:" $payloadJson.FULL_NAME "Dept:" $payloadJson.DEPARTMENT

# Check MCQ submission payload
# Notice we won't submit yet or we can test on a test session or check the endpoint syntax
