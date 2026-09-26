$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

# Search for definition of x or curriculaserver
$matches = [regex]::Matches($js, '.{0,100}curriculaserver:.{0,100}')
foreach ($m in $matches) {
    Write-Host "Found config:" $m.Value
}
