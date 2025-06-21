# Makefile pour la compilation LaTeX de la documentation StayOnTask

# Variables
MAIN_TEX = stayontask_documentation.tex
OUTPUT_PDF = stayontask_documentation.pdf
LATEX_ENGINE = pdflatex
BIBTEX_ENGINE = bibtex

# Commande par défaut
all: pdf

# Compilation PDF
pdf:
	$(LATEX_ENGINE) $(MAIN_TEX)
	$(LATEX_ENGINE) $(MAIN_TEX)
	$(LATEX_ENGINE) $(MAIN_TEX)

# Compilation avec bibliographie (si nécessaire)
pdf-full:
	$(LATEX_ENGINE) $(MAIN_TEX)
	$(BIBTEX_ENGINE) $(basename $(MAIN_TEX))
	$(LATEX_ENGINE) $(MAIN_TEX)
	$(LATEX_ENGINE) $(MAIN_TEX)

# Nettoyage des fichiers temporaires
clean:
	rm -f *.aux *.log *.out *.toc *.synctex.gz *.fls *.fdb_latexmk *.bbl *.blg

# Nettoyage complet (inclut le PDF)
clean-all: clean
	rm -f $(OUTPUT_PDF)

# Compilation et ouverture automatique
view: pdf
	start $(OUTPUT_PDF)

# Aide
help:
	@echo "Commandes disponibles:"
	@echo "  make pdf      - Compile le document LaTeX en PDF"
	@echo "  make pdf-full - Compile avec bibliographie"
	@echo "  make clean    - Supprime les fichiers temporaires"
	@echo "  make clean-all- Supprime tous les fichiers générés"
	@echo "  make view     - Compile et ouvre le PDF"
	@echo "  make help     - Affiche cette aide"

.PHONY: all pdf pdf-full clean clean-all view help
