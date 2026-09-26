$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content
$idx = $js.IndexOf('/curricula/student/course/getcircleinfo')
Write-Host $js.Substring([Math]::Max(0, $idx - 300), 700)
