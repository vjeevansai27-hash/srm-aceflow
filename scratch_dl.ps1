$uri = 'https://dld.srmist.edu.in/etecurricula/server/uploads/data/coordinator/21CSC201J/slppdf/1011.pdf'
Invoke-WebRequest -Uri $uri -OutFile '1011_question.pdf'
$f = Get-Item '1011_question.pdf'
Write-Output "Downloaded 1011_question.pdf, size: $($f.Length) bytes"
