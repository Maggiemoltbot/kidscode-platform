# M9D – Deutsch, Englisch und Französisch

Stand: 17.09.2026

## Gebaut

- `messages/{de,en,fr}.json`: Navigation, Level, Übungen, Profil, Abzeichen, Fehlermeldungen und Bedienhilfen.
- `src/components/i18n/language-provider.tsx`: next-intl-Client-Provider, Flaggenauswahl, localStorage, dynamisches HTML-`lang`; Deutsch als SSR-Startsprache.
- `prisma/schema.prisma`, `prisma/translations.ts`, `prisma/seed.ts`: Übersetzungen aller 4 Kurse, 16 Lektionen und 64 Übungen einschließlich Tipps und MC-Beschriftungen. Seed prüft Vollständigkeit vor Schreibzugriffen.
- `src/lib/{localization,course-queries,lesson-queries}.ts` und Profil-API: übersetzte öffentliche DTOs ohne Lösungsdaten.
- Kurs-, Theorie-, Übungs-, Profil-, Start- und Ranglistenansichten sowie Header, Footer und Bedienhilfen an die Sprachauswahl angeschlossen. TTS spricht die gewählte Sprache.

## Entscheidungen

Client-Kontext statt sprachabhängiger URLs, wie angefordert. `next-intl` ist die einzige neue Abhängigkeit; vorhandene Theme- und Animationsbibliotheken bleiben bestehen. Zusätzlich zu Lesson/Exercise hat Course Übersetzungsfelder, damit Kurskarten und Profilfortschritt ebenfalls die Sprache wechseln.

Programmcode, Bezeichner und erwartete Programmausgaben bleiben unverändert. MC-Optionen besitzen übersetzte Beschriftungen, senden aber weiterhin den ursprünglichen Lösungswert an den Server. Dadurch bleiben Prüfungen und bestehende Fortschritte sprachunabhängig.

## Prüfung

- `npx prisma db push`, `npx prisma generate`, `npm run db:seed`: erfolgreich, ohne Datenlöschung.
- `npm run build`: erfolgreich; Ausgabe isoliert in `.next-build`, Port 3001 nicht gestoppt.
- `npm run typecheck`, `npm run lint`: erfolgreich.
- `npx tsx --test tests/*.test.ts`: 6/6 erfolgreich. Prüft unter anderem alle UI-Schlüssel/ICU-Formate, Übersetzungsabdeckung in der Datenbank und unveränderte Lösungswerte.
- Logs: `/tmp/kidscode-m9d-{db,build,typecheck,lint,tests}.log`.

## Manuelle Smoke-Test-Checkliste

- [ ] Flaggen auf Startseite, Kurs, Theorie, Übung und Profil wechseln; nach Reload Auswahl erhalten.
- [ ] Fragen, Tipps, Antwortbeschriftungen und TTS in EN/FR prüfen; richtige/falsche Auswahl bleibt korrekt bewertet.
- [ ] Kleine Displays und Dark Mode mit längeren französischen Texten prüfen.
- [ ] Ohne localStorage funktioniert der Sprachwechsel zumindest innerhalb der Sitzung.

Die Browser-Schritte sind hier bewusst noch nicht als durchgeführt markiert. Der bestehende Dev-Prozess wird erst nach M9E neu gestartet. Übersetzungen sind einfache MVP-Texte, nicht professionell lektoriert. Metadaten/SSR starten Deutsch; Sprachwechsel erfolgt nach Hydrierung. Codebeispiele enthalten bewusst weiterhin deutsche Literale.

## Nächster Schritt

M9E: MC-Optionen stabil pro Übung mischen und dabei alle drei Sprachbeschriftungen mit ihrem ursprünglichen Lösungswert zusammenhalten. Danach Abschlussprüfung, geplanter Neustart, Push und Telegram.
