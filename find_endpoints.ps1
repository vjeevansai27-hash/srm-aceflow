$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

$endpoints = @('getlivesessions', 'getcircleinfo', 'getquestions', 'submit')
foreach ($ep in $endpoints) {
    Write-Host "=== Search for $ep ==="
    $matches = [regex]::Matches($js, '.{0,150}' + $ep + '.{0,250}')
    foreach ($m in $matches | Select-Object -First 3) {
        Write-Host $m.Value
        Write-Host "----------------"
    }
}
