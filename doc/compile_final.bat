@echo off
echo ============================================
echo COMPILATION DOCUMENTATION STAYONTASK
echo ============================================
echo.

set FILENAME=stayontask_complet

echo Compilation 1/3 (structure)...
pdflatex %FILENAME%.tex > nul 2>&1

echo Compilation 2/3 (references)...
pdflatex %FILENAME%.tex > nul 2>&1

echo Compilation 3/3 (finalisation)...
pdflatex %FILENAME%.tex

echo.
if exist %FILENAME%.pdf (
    echo ✓ SUCCES : Documentation generee !
    echo   Fichier : %FILENAME%.pdf
    echo   Taille  : 
    for %%I in (%FILENAME%.pdf) do echo     %%~zI octets
    echo.
    
    echo Voulez-vous ouvrir le PDF ? (O/N)
    set /p choice=
    if /i "%choice%"=="O" (
        echo Ouverture du PDF...
        start %FILENAME%.pdf
    )
) else (
    echo ✗ ERREUR : PDF non genere !
    echo Verifiez les erreurs ci-dessus.
)

echo.
echo Nettoyage des fichiers temporaires...
del %FILENAME%.aux %FILENAME%.log %FILENAME%.out %FILENAME%.toc 2>nul

echo.
echo ============================================
echo COMPILATION TERMINEE
echo ============================================
pause
