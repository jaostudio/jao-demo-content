param(
  [string]$BaseUrl = "http://127.0.0.1:3000"
)

$ErrorActionPreference = "Stop"
$failed = $false

function Check-Route {
  param([string]$Path, [string]$Desc, [int]$ExpectedStatus = 200, [bool]$AllowRedirect = $false)
  $url = "$BaseUrl$Path"
  try {
    $req = [System.Net.WebRequest]::Create($url)
    $req.Method = "GET"
    $req.Timeout = 10000
    $req.AllowAutoRedirect = $AllowRedirect
    $resp = $req.GetResponse()
    $status = [int]$resp.StatusCode
    if ($AllowRedirect) {
      $effective = $resp.ResponseUri.PathAndQuery
      Write-Host "  OK $status $Path -> $effective" -ForegroundColor Green
    } elseif ($status -eq $ExpectedStatus) {
      Write-Host "  OK $status $Path" -ForegroundColor Green
    } else {
      Write-Host "  FAIL $Path (expected $ExpectedStatus, got $status)" -ForegroundColor Red
      $script:failed = $true
    }
    $resp.Close()
  } catch {
    if ($AllowRedirect -and $_.Exception.InnerException) {
      $inner = $_.Exception.InnerException
      $status = [int]$inner.StatusCode
      if ($status -eq 302 -or $status -eq 301 -or $status -eq 308) {
        Write-Host "  OK $status $Path (redirect)" -ForegroundColor Green
        return
      }
    }
    Write-Host "  FAIL $Path - $($_.Exception.Message)" -ForegroundColor Red
    $script:failed = $true
  }
}

Write-Host "`n=== Public Routes ===" -ForegroundColor Cyan
Check-Route "/" "Homepage"
Check-Route "/explore" "Explore"
Check-Route "/search" "Search (no query)"
Check-Route "/trending" "Trending"
Check-Route "/category" "Categories index"
Check-Route "/category/technology" "Single category"
Check-Route "/work/getting-started-nextjs-16" "Work detail"
Check-Route "/articles/getting-started-nextjs-16" "Old article redirect" -AllowRedirect $true
Check-Route "/artist/sarah" "Artist profile"
Check-Route "/collections/collections-curated-picks" "Public collection"

Write-Host "`n=== Auth Routes ===" -ForegroundColor Cyan
Check-Route "/signin" "Sign in page"
Check-Route "/register" "Register page"

Write-Host "`n=== Protected Routes ===" -ForegroundColor Cyan
Check-Route "/studio" "Studio (anon redirect)" -AllowRedirect $true
Check-Route "/admin" "Admin (anon redirect)" -AllowRedirect $true

Write-Host "`n=== API Routes ===" -ForegroundColor Cyan
Check-Route "/api/feed" "Feed API"
Check-Route "/api/search?q=nextjs" "Search API"
Check-Route "/api/categories" "Categories API"
Check-Route "/api/articles" "Articles list API"

Write-Host "`n=== 404 Routes ===" -ForegroundColor Cyan
Check-Route "/nonexistent-page-xyz" "Should 404" -ExpectedStatus 404

if ($failed) {
  Write-Host "`nSOME ROUTES FAILED" -ForegroundColor Red
  exit 1
} else {
  Write-Host "`nALL ROUTES PASSED" -ForegroundColor Green
  exit 0
}
