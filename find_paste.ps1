$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

$idx = $js.IndexOf('Paste the worksheet answer')
if ($idx -ge 0) {
    Write-Host "Found 'Paste the worksheet answer' at $idx"
    $start = [Math]::Max(0, $idx - 600)
    Write-Host $js.Substring($start, 1200)
} else {
    Write-Host "Not found in main.chunk.js! Checking chunk 16..."
}
