# ================================================================
# Deploy.ps1 – School & College Transport Contract Management System
# ================================================================
# Deployment script for Windows (PowerShell)
#
# What it does:
#   1. Installs frontend dependencies and builds the production bundle
#   2. Installs backend dependencies
#   3. Starts the backend (which now serves the frontend too)
#
# After running this script:
#   - Visit http://localhost:5000 to access the full application
#   - Both UI and API are served from a single port (5000)
# ================================================================

param(
    [int]$Port = 5000,
    [switch]$UsePM2
)

# ---------------------------
# CONFIGURATION
# ---------------------------
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $projectRoot "frontend"
$backendDir  = Join-Path $projectRoot "backend"

# ---------------------------
# HELPERS
# ---------------------------
function Write-Step($step, $msg) {
    Write-Host ""
    Write-Host "[$step] $msg" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor DarkGray
}

function Write-Ok($msg) { Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Err($msg) { Write-Host "  ✗ $msg" -ForegroundColor Red }

# ---------------------------
# PRE-FLIGHT CHECKS
# ---------------------------
Write-Step "0" "Pre-flight checks"

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Err "Node.js is not installed or not on PATH. Please install Node.js 18+ first."
    exit 1
}
$nodeVersion = node --version
Write-Ok "Node.js $nodeVersion detected"

# Check npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Err "npm is not installed. Please install Node.js (it includes npm)."
    exit 1
}
$npmVersion = npm --version
Write-Ok "npm v$npmVersion detected"

# Check .env file exists for backend
$envFile = Join-Path $backendDir ".env"
if (-not (Test-Path $envFile)) {
    Write-Err "Backend .env file not found at $envFile"
    Write-Err "Create one with DATABASE_URL, JWT_SECRET, etc. before deploying."
    exit 1
}
Write-Ok "Backend .env file found"

# ---------------------------
# STEP 1: FRONTEND BUILD
# ---------------------------
Write-Step "1" "Installing frontend dependencies & building production bundle"

Push-Location $frontendDir
try {
    Write-Host "  Running npm ci..." -ForegroundColor DarkYellow
    npm ci --silent 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed in frontend" }
    Write-Ok "Frontend dependencies installed"

    Write-Host "  Running npm run build..." -ForegroundColor DarkYellow
    npm run build 2>&1 | ForEach-Object { Write-Host "  $_" -ForegroundColor DarkGray }
    if ($LASTEXITCODE -ne 0) { throw "Vite build failed" }
    Write-Ok "Frontend production bundle created at frontend\dist\"

    # Verify dist was created
    $distPath = Join-Path $frontendDir "dist"
    $indexFile = Join-Path $distPath "index.html"
    if (-not (Test-Path $indexFile)) {
        throw "dist\index.html not found after build!"
    }
    $distSize = (Get-ChildItem $distPath -Recurse | Measure-Object -Property Length -Sum).Sum
    $distSizeMB = [math]::Round($distSize / 1MB, 2)
    Write-Ok "Build output: $distSizeMB MB total"
}
catch {
    Write-Err $_.Exception.Message
    Pop-Location
    exit 1
}
Pop-Location

# ---------------------------
# STEP 2: BACKEND SETUP
# ---------------------------
Write-Step "2" "Installing backend dependencies"

Push-Location $backendDir
try {
    Write-Host "  Running npm ci..." -ForegroundColor DarkYellow
    npm ci --silent 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed in backend" }
    Write-Ok "Backend dependencies installed"
}
catch {
    Write-Err $_.Exception.Message
    Pop-Location
    exit 1
}
Pop-Location

# ---------------------------
# STEP 3: START BACKEND
# ---------------------------
Write-Step "3" "Starting the application server"

Push-Location $backendDir
try {
    # Set port via environment variable
    $env:PORT = $Port

    if ($UsePM2) {
        # PM2 process manager (recommended for production)
        if (-not (Get-Command pm2 -ErrorAction SilentlyContinue)) {
            Write-Host "  Installing PM2 globally..." -ForegroundColor DarkYellow
            npm i -g pm2 2>&1 | Out-Null
        }

        # Stop any existing instance
        pm2 delete transport-api 2>&1 | Out-Null

        pm2 start src/server.js --name transport-api
        if ($LASTEXITCODE -ne 0) { throw "PM2 failed to start the application" }

        pm2 save 2>&1 | Out-Null
        Write-Ok "Application started with PM2 (process name: transport-api)"
        Write-Host ""
        Write-Host "  PM2 Management Commands:" -ForegroundColor White
        Write-Host "    pm2 status            – view running processes" -ForegroundColor DarkGray
        Write-Host "    pm2 logs transport-api – view live logs" -ForegroundColor DarkGray
        Write-Host "    pm2 restart transport-api – restart the app" -ForegroundColor DarkGray
        Write-Host "    pm2 stop transport-api – stop the app" -ForegroundColor DarkGray
    }
    else {
        # Simple Node.js execution
        Write-Ok "Starting with node..."
        Write-Host ""
        Write-Host "  ┌──────────────────────────────────────────────────┐" -ForegroundColor Green
        Write-Host "  │                                                  │" -ForegroundColor Green
        Write-Host "  │   Transport Contract Management System           │" -ForegroundColor Green
        Write-Host "  │                                                  │" -ForegroundColor Green
        Write-Host "  │   Application:  http://localhost:$Port             │" -ForegroundColor Green
        Write-Host "  │   API Health:   http://localhost:$Port/health      │" -ForegroundColor Green
        Write-Host "  │                                                  │" -ForegroundColor Green
        Write-Host "  │   Press Ctrl+C to stop the server                │" -ForegroundColor Green
        Write-Host "  │                                                  │" -ForegroundColor Green
        Write-Host "  └──────────────────────────────────────────────────┘" -ForegroundColor Green
        Write-Host ""

        node src/server.js
    }
}
catch {
    Write-Err $_.Exception.Message
    Pop-Location
    exit 1
}
Pop-Location
