$uri = 'https://dld.srmist.edu.in/etecurricula/server/uploads/data/coordinator/21CSC201J/slppdf/1012.pdf'
Invoke-WebRequest -Uri $uri -OutFile '1012_question.pdf'
$f = Get-Item '1012_question.pdf'
Write-Output "Downloaded 1012_question.pdf, size: $($f.Length) bytes"
