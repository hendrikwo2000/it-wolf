# 🐺 IT Wolf – Nützliche Tools & digitale Features auf einen Blick

**IT Wolf** ist eine persönliche Sammlung digitaler Tools, AI-Services und kreativer Web-Funktionen – alles an einem Ort, intuitiv nutzbar und komplett kostenlos.  
Ursprünglich gestartet als Lösung gegen Lesezeichen-Chaos, hat sich die Seite zu einem multifunktionalen Mini-Portal für Technik-, KI- und Web-Enthusiasten entwickelt.

🌐 **Website:** [it-wolf.org](https://it-wolf.org)

---

## 🚀 Highlights

- 🔗 Übersichtliche Sammlung nützlicher Webseiten aus den Bereichen:
  - **Künstliche Intelligenz** (z. B. ChatGPT, Perplexity, Hugging Face)
  - **Produktivitätstools** (PDF-Tools, Developer-Tools, Grafikbearbeitung u.v.m.)
  - **Geheime Tipps & Hacks** *(z. B. Radio Garden, 12ft.io)*
- 📘 **Kostenloses E-Book zum Thema Gesundheit**
  - Download mit Passwort (per Formular anfordern)
  - Feedback- und Rezensionsbereich
  - Optionale Spende via PayPal
- ⚙️ **Viele kleine Spielereien und Features**, direkt im Browser ausführbar

---

## 🧩 Funktionen im Überblick

### 🎨 Design & Personalisierung
- `🌓 Dark / Light Mode` – Schnell umschaltbar, gespeichert im Local Storage
- `🎨 Custom Color Theme` – Schrift- und Hintergrundfarbe individuell einstellbar
- `👤 Persönliche Begrüßung` – Gib deinen Namen ein und passe die Headline an:  
  _„Moin Hendrik – Nützliche Seiten“_

---

### ❤️ Favoriten-System
- Markiere beliebige Seiten mit einem Herz
- Eigener Favoritenbereich wird automatisch angezeigt
- Dynamisches Hinzufügen und Entfernen möglich
- Speicherung im Local Storage

---

### 🕹️ Interaktive Features (Impressum → Funktionen)
- `🎮 Tic Tac Toe` – Spiele gegen eine KI (Schwierigkeit wählbar, mit Punktestand)
- `🕸️ Netz` – Dynamisches, interaktives Partikelnetz über die ganze Seite, mit Maussteuerung
- `🧪 Farbanpassung` – Live UI-Customizer
- `🌐 „Dein Name“ Feature` – Personalisierter Einstieg in die Seite

---

## 🔒 Datenschutz & Technik

Was **im Browser bleibt**: Name, Farbthema, Favoriten und die Anmeldung – alles im Local Storage, nichts davon geht an einen Server. Kein Tracking, keine Analyse-Cookies, kein Werbenetzwerk.

Was **den Browser verlässt** – ausschließlich, wenn du ein Formular abschickst:

| Was | Wohin | Warum |
|---|---|---|
| Name, E-Mail, Nachricht | **formsubmit.co** (US-Anbieter) | damit die Mail bei mir ankommt |
| Feedback (Name, E-Mail, Text, Sterne) | **Cloudflare KV** | landet bei mir, wird auf Wunsch zur Rezension |
| Veröffentlichte Rezensionen | **Cloudflare KV** | die Karten, die jeder auf der E-Book-Seite sieht |
| Prüfung „Mensch oder Bot?" | **Cloudflare Turnstile** | hält Skripte von den Formularen fern |

Das E-Book-Passwort liegt in einem verschlüsselten Secret und wird nur auf eine Anfrage mit plausiblen Angaben herausgegeben – es steht in keiner öffentlichen Datei. Eine echte Zugangskontrolle ist es trotzdem nicht: Die E-Mail-Adresse wird nicht überprüft.

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, Vanilla JS – kein Framework, dazu Bootstrap fürs Grobe
- **Hosting**: Cloudflare Pages, Deploy direkt aus diesem Repo
- **Serverless**: Cloudflare Pages Functions für E-Book-Passwort, Rezensionen und Feedback
- **Datenbank**: Cloudflare KV – Rezensionen und Anfragen
- **Spamschutz**: Cloudflare Turnstile vor Passwort- und Feedback-Formular
- **Einstellungen**: Local Storage API
- **Mailversand**: formsubmit, direkt aus dem Browser
- **Build**: `node build.js` hält Navbar und Footer über alle Seiten synchron – gemeinsame Teile liegen in `partials/`, kein Framework nötig

> **Entwickeln:** Navbar/Footer nur in `partials/` bearbeiten, dann `node build.js` ausführen (schreibt die Blöcke in index/seiten/tools/ebook/impressum), danach wie gewohnt committen. `404.html` wird wegen ihrer absoluten Pfade von Hand gepflegt.

---

## 🙌 Warum IT Wolf?

> "Ich wollte eine Plattform bauen, die mir selbst den Alltag erleichtert – und gleichzeitig anderen hilft, nützliche Tools, KI-Services und kleine Web-Gimmicks schneller zu finden."

Mit IT Wolf demonstriere ich nicht nur mein technisches Know-how, sondern auch mein Faible für klare Strukturen, kreative Web-Features und digitale Freiheit.

---

## 📩 Feedback & Support

- Spenden via [PayPal](https://www.paypal.com/paypalme/1hendrik) willkommen
- Feedback gerne über das [Kontaktformular](https://it-wolf.org/impressum#kontakt) oder direkt an: `kontakt@it-wolf.org`

- ⭐ Über einen Star auf GitHub freue ich mich natürlich auch!

---

**Made with 🧠 + 💻 by Hendrik**
