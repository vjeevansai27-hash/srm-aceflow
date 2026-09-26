$p = @{
  path = "data/coordinator/21CSC201J/slp"
  filename = "1011.docx"
  server = "https://dld.srmist.edu.in/etecurricula/server"
  key = "john"
} | ConvertTo-Json

$r = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=%2Fcurricula%2Fadmin%2Ffile%2Fgetfile' -Method POST -Body $p -ContentType 'application/json'
Write-Output "DOCX result: $($r | ConvertTo-Json -Depth 2)"

$p2 = @{
  path = "data/coordinator/21CSC201J/slppdf"
  filename = "1011.pdf"
  server = "https://dld.srmist.edu.in/etecurricula/server"
  key = "john"
} | ConvertTo-Json
$r2 = Invoke-RestMethod -Uri 'http://localhost:3000/api/srm-proxy?path=%2Fcurricula%2Fadmin%2Ffile%2Fgetfile' -Method POST -Body $p2 -ContentType 'application/json'
Write-Output "PDF result: $($r2 | ConvertTo-Json -Depth 2)"
