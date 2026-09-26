$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

# Search for MCQ: or MCQ:e or similar in this component
$idx = $js.IndexOf('header:"Multiple Choice Questions"')
if ($idx -ge 0) {
    # search backwards from this index for the API call that sets MCQ
    $start = [Math]::Max(0, $idx - 3000)
    $section = $js.Substring($start, 3500)
    
    $matches = [regex]::Matches($section, 'd\.a\.post\([^)]+\)')
    foreach ($m in $matches) {
        Write-Host "API Call:" $m.Value
    }
}
