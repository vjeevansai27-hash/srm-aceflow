$body = @{
  path = 'data/coordinator/21LEM202T/slppdf'
  filename = '3021.pdf'
  server = 'https://dld.srmist.edu.in/etecurricula/server'
  key = 'john'
} | ConvertTo-Json

$res = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=%2Fcurricula%2Fadmin%2Ffile%2Fgetfile' -Method POST -Body $body -ContentType 'application/json'
Write-Output "3021: $($res.result.path)"

$body2 = @{
  path = 'data/coordinator/21LEM202T/slppdf'
  filename = '3022.pdf'
  server = 'https://dld.srmist.edu.in/etecurricula/server'
  key = 'john'
} | ConvertTo-Json

$res2 = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=%2Fcurricula%2Fadmin%2Ffile%2Fgetfile' -Method POST -Body $body2 -ContentType 'application/json'
Write-Output "3022: $($res2.result.path)"
