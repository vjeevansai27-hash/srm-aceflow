$d = Get-Content qdata_sample.json -Raw | ConvertFrom-Json
$keys = $d.psobject.properties.name
Write-Output "Keys: $($keys -join ', ')"
if ($d.slo) {
  Write-Output "SLO: $($d.slo.psobject.properties.name -join ', ')"
  Write-Output "SLO1: $($d.slo.SLO1)"
  Write-Output "SLO2: $($d.slo.SLO2)"
}
if ($d.sq) {
  Write-Output "SQ count: $($d.sq.Count)"
  foreach ($q in $d.sq) {
    Write-Output "--- SQ Desc: $($q.QUESTION_DESC)"
    Write-Output "--- SQ Ans: $($q.ANSWER)"
  }
}
