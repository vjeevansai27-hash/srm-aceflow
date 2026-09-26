$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

$idx = $js.IndexOf('displayMCQ(')
if ($idx -ge 0) {
    Write-Host "=== displayMCQ found ==="
    $start = [Math]::Max(0, $idx - 800)
    Write-Host $js.Substring($start, 1600)
}
