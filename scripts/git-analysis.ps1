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
Write-Host ""

# Aller dans le répertoire principal du projet
if (Test-Path "..") {
    Set-Location ".."
}

Write-Host "Informations générales du dépôt:" -ForegroundColor Yellow
Write-Host "================================="

# Statistiques de base
$totalCommits = git rev-list --all --count
$currentBranch = git branch --show-current
$branches = git branch -a | Measure-Object

Write-Host "Nombre total de commits: $totalCommits"
Write-Host "Branche actuelle: $currentBranch"
Write-Host "Nombre de branches: $($branches.Count)"

if ($detailed) {
    Write-Host "`nBranches disponibles:" -ForegroundColor Yellow
    git branch -a
}

Write-Host "`nAnalyse des contributeurs:" -ForegroundColor Yellow
Write-Host "=========================="

# Obtenir la liste des auteurs avec nombre de commits
Write-Host "`nRépartition des commits par auteur:"
git shortlog -sn

Write-Host "`nDétails par contributeur:" -ForegroundColor Yellow
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

Write-Host "`nHistorique des commits:" -ForegroundColor Yellow
Write-Host "======================"

if ($detailed) {
    Write-Host "`nHistorique détaillé (20 derniers commits):"
    git log -20 --format='%h %ad %an: %s' --date=short
} else {
    Write-Host "`nDernier commit:"
    git log -1 --oneline
    
    Write-Host "`nHistorique récent (10 derniers commits):"
    git log -10 --format='%h %ad %an: %s' --date=short
}

if ($detailed) {
    Write-Host "`nAnalyse des fichiers modifiés:" -ForegroundColor Yellow
    Write-Host "=============================="

    # Top 10 des fichiers les plus modifiés
    Write-Host "`nFichiers les plus modifiés:"
    git log --name-only --pretty=format: | Where-Object { $_ -ne "" } | Group-Object | Sort-Object Count -Descending | Select-Object -First 10 | ForEach-Object {
        Write-Host "  $($_.Name) : $($_.Count) modifications"
    }
}

# Export automatique ou sur demande
if ($export -or $detailed) {
    Write-Host "`nGénération du rapport..." -ForegroundColor Yellow
    
    $reportContent = @"
RAPPORT D'ANALYSE GIT - STAYONTASK
==================================
Généré le: $(Get-Date -Format "dd/MM/yyyy HH:mm")

STATISTIQUES GÉNÉRALES
======================
Nombre total de commits: $totalCommits
Branche actuelle: $currentBranch
Nombre de branches: $($branches.Count)

RÉPARTITION DES COMMITS PAR AUTEUR
==================================
$(git shortlog -sn | Out-String)

HISTORIQUE DES COMMITS (20 derniers)
====================================
$(git log -20 --format='%h %ad %an: %s' --date=short | Out-String)

DÉTAILS PAR CONTRIBUTEUR
========================
$($authors | ForEach-Object {
    $author = $_
    $commitCount = (git log --author="$author" --oneline | Measure-Object).Count
    $percentage = [math]::Round(($commitCount / $totalCommits) * 100, 1)
    $firstCommit = git log --author="$author" --reverse --oneline | Select-Object -First 1
    $lastCommit = git log --author="$author" --oneline | Select-Object -First 1
    
    "Auteur: $author"
    "  - Commits: $commitCount ($percentage%)"
    "  - Premier: $firstCommit"
    "  - Dernier: $lastCommit"
    ""
} | Out-String)
"@    if ($detailed) {
        $reportContent += @"

FICHIERS LES PLUS MODIFIÉS
==========================
$(git log --name-only --pretty=format: | Where-Object { $_ -ne "" } | Group-Object | Sort-Object Count -Descending | Select-Object -First 15 | ForEach-Object { "$($_.Name) : $($_.Count) modifications" } | Out-String)
"@
    }

    $reportContent | Out-File -FilePath $output -Encoding UTF8
    Write-Host "Rapport genere: $output" -ForegroundColor Green
}

# Retourner au dossier doc
if (Test-Path "doc") {
    Set-Location "doc"
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "ANALYSE TERMINÉE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($export -or $detailed) {
    Write-Host "`nFichier généré: $output"
    Write-Host "Le rapport contient toutes les informations détaillées sur le projet."
} else {
    Write-Host "`nPour une analyse détaillée, utilisez: .\git-analysis.ps1 -detailed"
    Write-Host "Pour exporter un rapport, utilisez: .\git-analysis.ps1 -export"
}
