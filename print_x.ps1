$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

$idx = $js.IndexOf('var x={curriculaserver:')
if ($idx -ge 0) {
    Write-Host $js.Substring($idx, 400)
}
