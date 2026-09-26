$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

$matches = [regex]::Matches($js, '.{0,300}loginUser.{0,300}')
foreach ($m in $matches) {
    Write-Host "=================="
    Write-Host $m.Value
}
