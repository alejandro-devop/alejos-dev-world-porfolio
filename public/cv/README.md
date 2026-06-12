# CV / Résumé files

Place the following PDF files in this directory:

- `alejandro-gomez-cv-en.pdf` — English résumé
- `alejandro-gomez-cv-es.pdf` — Spanish CV

The `resumeUrl` field in the **about** section (admin API / fallback JSON) points
to these paths. Files are served from `public/cv/` at `/cv/*.pdf`.

The `download` attribute on the link forces a file download instead of
opening in the browser (for supported browsers).
