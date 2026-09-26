$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

$matches = [regex]::Matches($js, 'd\.a\.post\([^,]+(\+[^,]+)?,[^)]+\)')
Write-Host "Total matches:" $matches.Count
foreach ($m in $matches) {
    if ($m.Value -match 'session' -or $m.Value -match 'question' -or $m.Value -match 'worksheet' -or $m.Value -match 'practice' -or $m.Value -match 'assessment' -or $m.Value -match 'circle') {
        Write-Host $m.Value
        Write-Host "--------------------"
    }
}
