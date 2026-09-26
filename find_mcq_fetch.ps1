$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

$idx = $js.IndexOf('/curricula/student/session/mcq')
if ($idx -ge 0) {
    # Search backwards for setState({MCQ:
    $start = [Math]::Max(0, $idx - 8000)
    $section = $js.Substring($start, 9000)
    
    $matches = [regex]::Matches($section, 'MCQ:[^,}]+')
    foreach ($m in $matches) {
        Write-Host "MCQ ref:" $m.Value
    }

    $matches2 = [regex]::Matches($section, 'd\.a\.post\([^)]+\)')
    foreach ($m in $matches2) {
        Write-Host "POST:" $m.Value
    }
}
