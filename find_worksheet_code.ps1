$url = 'https://dld.srmist.edu.in/ktretecurricula/static/js/main.d2f30946.chunk.js'
$js = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

$queries = @(
    'Paste the worksheet answer',
    'DOWNLOAD PDF',
    'DOWNLOAD DOCX',
    'Learning Practice',
    'Multiple Choice Questions',
    'Last Score'
)

foreach ($q in $queries) {
    Write-Host "=== Searching for: $q ==="
    $idx = 0
    while (($idx = $js.IndexOf($q, $idx)) -ge 0) {
        $start = [Math]::Max(0, $idx - 250)
        $len = [Math]::Min(500, $js.Length - $start)
        Write-Host $js.Substring($start, $len)
        Write-Host "--------------------------------"
        $idx += $q.Length
        if ($idx -ge $js.Length) { break }
    }
}
