param(
    [string]$RepoUrl
)

if (-not $RepoUrl) {
    Write-Host "Usage: .\push-to-github.ps1 https://github.com/vjeevansai27-hash/YOUR-REPO.git" -ForegroundColor Yellow
    exit 1
}

Write-Host "Configuring remote origin: $RepoUrl ..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin $RepoUrl
git branch -M main
git push -u origin main

Write-Host "Successfully pushed to GitHub! Now you can connect it to Netlify in 1 click." -ForegroundColor Green
