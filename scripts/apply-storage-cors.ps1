# Apply the CORS policy in storage.cors.json to the Firebase Storage bucket.
# Run from the app/ folder: .\scripts\apply-storage-cors.ps1
#
# Prerequisites (try in this order, the script picks whichever is installed):
#   1. Google Cloud SDK with gsutil
#      Install from https://cloud.google.com/sdk/docs/install
#   2. Google Cloud SDK with gcloud storage
#      (Same install as above. Newer subcommand, same auth.)

$ErrorActionPreference = 'Stop'

$bucket = 'gs://scholarly-echo.firebasestorage.app'
$corsFile = Join-Path $PSScriptRoot '..\storage.cors.json'

if (-not (Test-Path $corsFile)) {
    Write-Host "ERROR: storage.cors.json not found at $corsFile" -ForegroundColor Red
    exit 1
}

Write-Host "Applying CORS to $bucket" -ForegroundColor Cyan
Write-Host "Using policy file: $corsFile" -ForegroundColor Cyan
Write-Host ""

$gsutil = Get-Command gsutil -ErrorAction SilentlyContinue
$gcloud = Get-Command gcloud -ErrorAction SilentlyContinue

if ($gsutil) {
    Write-Host "Found gsutil at $($gsutil.Source). Applying..." -ForegroundColor Green
    & gsutil cors set $corsFile $bucket
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Verifying applied CORS..." -ForegroundColor Cyan
        & gsutil cors get $bucket
        Write-Host ""
        Write-Host "Done. Test the upload from https://scholarly-echo.web.app/admin/dashboard/blog" -ForegroundColor Green
    } else {
        Write-Host "gsutil failed. Make sure you are authenticated: 'gcloud auth login'" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}
elseif ($gcloud) {
    Write-Host "Found gcloud at $($gcloud.Source). Using 'gcloud storage buckets update'..." -ForegroundColor Green
    & gcloud storage buckets update $bucket --cors-file=$corsFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Verifying applied CORS..." -ForegroundColor Cyan
        & gcloud storage buckets describe $bucket --format='value(cors_config)'
        Write-Host ""
        Write-Host "Done. Test the upload from https://scholarly-echo.web.app/admin/dashboard/blog" -ForegroundColor Green
    } else {
        Write-Host "gcloud failed. Make sure you are authenticated: 'gcloud auth login'" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}
else {
    Write-Host "Neither gsutil nor gcloud is installed on PATH." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Install Google Cloud SDK from:" -ForegroundColor Yellow
    Write-Host "  https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After install, open a NEW PowerShell window and run:" -ForegroundColor Yellow
    Write-Host "  gcloud auth login" -ForegroundColor Yellow
    Write-Host "  gcloud config set project scholarly-echo" -ForegroundColor Yellow
    Write-Host "  .\scripts\apply-storage-cors.ps1" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or, see the manual REST-API fallback in DEPLOY_BLOG_FIX.md" -ForegroundColor Yellow
    exit 1
}
