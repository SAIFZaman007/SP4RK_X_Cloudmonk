# CV source

`cv.html` is the source of truth. Regenerate the PDF after any edit:

```bash
pip install weasyprint
python3 -c "from weasyprint import HTML; HTML('cv.html').write_pdf('Saif_Zaman_CV.pdf')"
cp Saif_Zaman_CV.pdf ../public/media/
```

Tuned to fit exactly one A4 page. If you add content, check the page count
before shipping - a CV that spills 20% onto a second page reads worse than a
dense single page:

```bash
python3 -c "from pypdf import PdfReader; print(len(PdfReader('Saif_Zaman_CV.pdf').pages))"
```

Deliberate choices worth knowing:
- **CGPA omitted for the BSc.** With four roles and shipped products, a 2019-era
  GPA is the weakest line on the page. HSC/SSC GPAs are kept since they are
  strong. Restore it in the Education block if a specific employer asks.
- **Single column**, not the two-column original - ATS parsers read single
  column reliably and mangle multi-column layouts.
- Links are live `<a>` tags, so they are clickable in the PDF.
