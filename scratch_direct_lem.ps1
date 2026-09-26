$body = @{
  path = 'data/coordinator/21LEM202T/slppdf'
  filename = '3021.pdf'
  server = 'https://dld.srmist.edu.in/etecurricula/server'
  key = 'john'
} | ConvertTo-Json

try {
  $res = Invoke-RestMethod -Uri 'https://dld.srmist.edu.in/ktretecurricula/server/curricula/admin/file/getfile' -Method POST -Body $body -ContentType 'application/json' -TimeoutSec 15
  Write-Output "Direct 3021: $($res | ConvertTo-Json -Depth 3)"
} catch {
  Write-Output "Direct error: $_"
}

$body2 = @{
  path = 'data/coordinator/21LEM202T/slppdf'
  filename = '3022.pdf'
  server = 'https://dld.srmist.edu.in/etecurricula/server'
  key = 'john'
} | ConvertTo-Json

try {
  $res2 = Invoke-RestMethod -Uri 'https://dld.srmist.edu.in/ktretecurricula/server/curricula/admin/file/getfile' -Method POST -Body $body2 -ContentType 'application/json' -TimeoutSec 15
  Write-Output "Direct 3022: $($res2 | ConvertTo-Json -Depth 3)"
} catch {
  Write-Output "Direct error 2: $_"
}
