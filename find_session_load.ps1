$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

# Search for the function that loads the session details when a session is opened!
$idx = $js.IndexOf('/curricula/student/session/submitlink')
if ($idx -ge 0) {
    $start = [Math]::Max(0, $idx - 5000)
    $section = $js.Substring($start, 7000)
    
    $matches = [regex]::Matches($section, 'd\.a\.post\([^,]+(\+[^,]+)?,[^)]+\)')
    foreach ($m in $matches) {
        Write-Host "Call in session component:" $m.Value
    }
}
