# studi

App für den Studierendenalltag: ein Infoportal für Studierende der PH Burgenland
(angelehnt an Studo). Umgesetzt als mobilfreundliche Web-App (PWA) mit
React, Vite und TypeScript. Die Anmeldung läuft über **Microsoft Entra ID**
(MSAL.js, Authorization Code Flow mit PKCE, kein Client-Secret nötig).

## Schnellstart

```bash
npm install
npm run dev    # http://localhost:5173 öffnen und mit dem PH-Konto anmelden
```

`npm run build` erzeugt die fertige App in `dist/`.

## Microsoft Entra einrichten

Die App-Registrierung `studi` existiert bereits; Client-ID und Tenant-ID stehen
in `.env` (öffentliche Kennungen, kein Geheimnis). Eigene Werte zum Testen
kommen in eine `.env.local` (Muster: `.env.example`), die nicht committet wird.
So wurde die Registrierung angelegt:

1. Im [Entra Admin Center](https://entra.microsoft.com) unter
   **Identität → Anwendungen → App-Registrierungen → Neue Registrierung**:
   - Name: `studi`
   - Unterstützte Kontotypen: **Nur Konten in diesem Organisationsverzeichnis**
     (nur PH Burgenland, Single-Tenant)
   - Umleitungs-URI: Plattform **Single-Page-Anwendung (SPA)**,
     URI `http://localhost:5173/`
2. Nach dem Anlegen auf der Übersichtsseite kopieren:
   - **Anwendungs-ID (Client-ID)** → `VITE_ENTRA_CLIENT_ID`
   - **Verzeichnis-ID (Mandanten-ID)** → `VITE_ENTRA_TENANT_ID`
3. Unter **Authentifizierung** später die echte Adresse der App als weitere
   SPA-Umleitungs-URI ergänzen (z. B. `https://studi.example.at/`) und beim
   Deployment `VITE_ENTRA_REDIRECT_URI` darauf setzen.
4. Unter **API-Berechtigungen** ist `Microsoft Graph → User.Read` (delegiert)
   standardmäßig vorhanden. Falls die Hochschule Benutzer-Einwilligungen
   gesperrt hat, muss ein Admin „Administratorzustimmung erteilen“ klicken.

Ein Client-Secret wird **nicht** benötigt und darf nicht ins Repo.

## Struktur

| Pfad | Inhalt |
| --- | --- |
| `src/authConfig.ts` | MSAL-Konfiguration (liest die `VITE_ENTRA_*`-Variablen) |
| `src/main.tsx` | Startet MSAL, verarbeitet den Login-Redirect |
| `src/App.tsx` | Routen; ohne Login wird nur die Anmeldeseite gezeigt |
| `src/pages/` | Start, Login, Profil und Platzhalter für News, Termine, Stundenplan, Mensa, Kontakte |
