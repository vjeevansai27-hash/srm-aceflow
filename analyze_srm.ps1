$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

Write-Host "Downloaded JS of size:" $js.Length

# Search for login or gettoken or auth patterns
$matches = [regex]::Matches($js, '.{0,100}/login.{0,100}')
foreach ($m in $matches) {
    Write-Host "Match:" $m.Value
}

$matches2 = [regex]::Matches($js, '.{0,100}gettoken.{0,100}')
foreach ($m in $matches2) {
    Write-Host "gettoken Match:" $m.Value
}
