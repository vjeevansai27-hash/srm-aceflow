$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

# Look for /curricula/student/
$matches = [regex]::Matches($js, '/curricula/student/[a-zA-Z0-9_/]+')
$endpoints = $matches | ForEach-Object { $_.Value } | Select-Object -Unique
$endpoints | ForEach-Object { Write-Host $_ }
