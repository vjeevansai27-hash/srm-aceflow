$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content
$idx = $js.IndexOf('studentPractice1Link')
Write-Host $js.Substring([Math]::Max(0, $idx - 200), 800)
