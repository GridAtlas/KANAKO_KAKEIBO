@echo off
REM KANAKO_KAKEIBO: git init + GitHub public repo create + push + Pages enable.

setlocal
cd /d "%~dp0"

set VISIBILITY=--public
if /I "%~1"=="private" set VISIBILITY=--private

REM Default owner is GridAtlas (post-rename). Pass owner as 2nd arg to override.
set OWNER=GridAtlas
if not "%~2"=="" set OWNER=%~2

set REPO=KANAKO_KAKEIBO

echo ================================================================
echo   KANAKO_KAKEIBO init + push + GitHub Pages
echo   visibility=%VISIBILITY% owner=%OWNER%
echo ================================================================

REM 1. git init
if not exist ".git" (
    echo.
    echo [1/6] git init
    git init
    if errorlevel 1 ( echo [ERROR] git init failed & pause & exit /b 1 )
    git symbolic-ref HEAD refs/heads/main
    echo [OK] git init done, branch = main
) else (
    echo [SKIP] .git already exists
)

REM 2. Initial commit
echo.
echo [2/6] git add + commit
git add .
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "chore: bootstrap KANAKO_KAKEIBO with GitHub Pages deploy workflow"
    if errorlevel 1 ( echo [ERROR] commit failed & pause & exit /b 1 )
    echo [OK] initial commit created
) else (
    echo [SKIP] nothing to commit
)

REM 3. Create or reuse GitHub repo
git remote get-url origin >nul 2>&1
if not errorlevel 1 (
    echo.
    echo [3/6] remote origin already configured, pushing
    git push -u origin main
    if errorlevel 1 ( echo [ERROR] push failed & pause & exit /b 1 )
) else (
    echo.
    echo [3/6] Creating GitHub repo %OWNER%/%REPO% (%VISIBILITY%)
    gh repo create %OWNER%/%REPO% %VISIBILITY% --source=. --remote=origin --push --description "Personal household budget mobile web app (Next.js + Tailwind + Zustand + recharts)"
    if errorlevel 1 ( echo [ERROR] gh repo create failed & pause & exit /b 1 )
)

REM 4. Enable GitHub Pages (build_type=workflow) ? safety net if workflow's enablement fails
echo.
echo [4/6] Enabling GitHub Pages (source = workflow)
gh api -X POST "repos/%OWNER%/%REPO%/pages" -f build_type=workflow >nul 2>&1
if errorlevel 1 (
    echo [INFO] Pages API returned non-zero. Likely already enabled or will be enabled via workflow.
) else (
    echo [OK] Pages enabled via API
)

REM 5. Trigger workflow (in case initial push didn't; safe to call anyway)
echo.
echo [5/6] Triggering deploy workflow
gh workflow run deploy.yml -R %OWNER%/%REPO% >nul 2>&1
if errorlevel 1 (
    echo [INFO] workflow_dispatch failed or already running. Continuing.
) else (
    echo [OK] Workflow triggered
)

REM 6. Watch workflow run (optional, waits for completion)
echo.
echo [6/6] Waiting for workflow to complete (Ctrl-C to skip)
timeout /t 5 /nobreak >nul
gh run watch -R %OWNER%/%REPO% --exit-status 2>&1
if errorlevel 1 (
    echo [INFO] Workflow may still be running or exited with error.
)

echo.
echo ================================================================
echo Done!
echo ================================================================
echo Repo:    https://github.com/%OWNER%/%REPO%
echo Pages:   https://%OWNER%.github.io/%REPO%/
echo Actions: https://github.com/%OWNER%/%REPO%/actions
echo.
echo Pages URL takes ~1 minute after workflow finishes.
echo If not accessible, check:
echo   Settings -^> Pages -^> Source should be "GitHub Actions"
echo.
pause
