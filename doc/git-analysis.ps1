# Script PowerShell pour analyser les informations Git du projet StayOnTask
# Fichier: git-analysis.ps1
# Usage: .\git-analysis.ps1 [-detailed] [-export] [-output "filename.txt"]

param(
    [switch]$detailed,
    [switch]$export,
    [string]$output = "git-analysis-report.txt"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ANALYSE GIT COMPLETE - STAYONTASK" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan

# Aller dans le repertoire principal du projet
if (Test-Path "..\main") {
    Write-Host "Navigation vers le depot principal..." -ForegroundColor Yellow
    Set-Location ".."
}

Write-Host "`nInformations generales du depot:" -ForegroundColor Yellow
Write-Host "================================="

# Statistiques de base
$totalCommits = git rev-list --all --count
$currentBranch = git branch --show-current
Write-Host "Nombre total de commits: $totalCommits"
Write-Host "Branche actuelle: $currentBranch"

Write-Host "`nAnalyse des contributeurs:" -ForegroundColor Yellow
Write-Host "=========================="

# Obtenir la liste des auteurs avec nombre de commits
Write-Host "`nRepartition des commits par auteur:"
git shortlog -sn

Write-Host "`nDetails par contributeur:" -ForegroundColor Yellow
Write-Host "-------------------------"

# Pour chaque auteur unique
$authors = git log --format='%an' | Sort-Object | Get-Unique

foreach ($author in $authors) {
    Write-Host "`n>> $author" -ForegroundColor White
    
    # Nombre de commits
    $commitCount = (git log --author="$author" --oneline | Measure-Object).Count
    Write-Host "   Commits: $commitCount"
    
    # Pourcentage de contribution
    $percentage = [math]::Round(($commitCount / $totalCommits) * 100, 1)
    Write-Host "   Contribution: $percentage%"
    
    # Premier et dernier commit
    $firstCommit = git log --author="$author" --reverse --oneline | Select-Object -First 1
    $lastCommit = git log --author="$author" --oneline | Select-Object -First 1
    
    if ($firstCommit) {
        Write-Host "   Premier commit: $firstCommit"
    }
    if ($lastCommit) {
        Write-Host "   Dernier commit: $lastCommit"
    }
}

Write-Host "`nHistorique des commits (20 derniers):" -ForegroundColor Yellow
Write-Host "====================================="

# Derniers commits avec auteurs et dates
git log -20 --format='%h %ad %an: %s' --date=short

if ($export) {
    Write-Host "`nGeneration du rapport..." -ForegroundColor Yellow

    $reportContent = @"
RAPPORT D'ANALYSE GIT - STAYONTASK
==================================
Genere le: $(Get-Date -Format "dd/MM/yyyy HH:mm")

STATISTIQUES GENERALES
======================
Nombre total de commits: $totalCommits
Branche actuelle: $currentBranch

REPARTITION DES COMMITS PAR AUTEUR
==================================
$(git shortlog -sn | Out-String)

HISTORIQUE DES COMMITS (20 derniers)
====================================
$(git log -20 --format='%h %ad %an: %s' --date=short | Out-String)
"@

    $reportContent | Out-File -FilePath $output -Encoding UTF8
    Write-Host "Rapport genere: $output" -ForegroundColor Green
}

# Retourner au dossier doc si nous avons change de repertoire
if (Test-Path "doc") {
    Set-Location "doc"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ANALYSE TERMINEE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($export) {
    Write-Host "`nFichier genere: $output"
    Write-Host "Le rapport contient toutes les informations detaillees sur le projet."
} else {
    Write-Host "`nPour une analyse detaillee, utilisez: .\git-analysis.ps1 -detailed"
    Write-Host "Pour exporter un rapport, utilisez: .\git-analysis.ps1 -export"
}
