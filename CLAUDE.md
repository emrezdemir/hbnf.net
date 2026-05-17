# CLAUDE.md

Bu dosya, Claude Code'un bu repo'da çalışırken bağlam edinmesi için hazırlanmıştır.

## Proje Özeti

`hbnf.net` — Emre Özdemir'in kişisel game hub'ı. Statik HTML/CSS/JS ile yazılır, kendi sunucuma deploy edilir (GitHub Pages **değil**). Geliştirilen oyunları tek yerden listeler; bazıları iframe ile embed edilir, bazıları external link'tir.

## Stack

- Vanilla HTML5 / CSS3 / JavaScript — **ES module değil**, klasik `<script>` (file:// uyumu için)
- Build step **yok** — dosyalar olduğu gibi serve edilir
- Bağımlılık **yok** — `package.json` bilinçli olarak yer almaz
- Production: Coolify **Static build pack** (otomatik nginx, repo'da Dockerfile/config yok)

## Dosya Düzeni

| Yol | Amaç |
|-----|------|
| `index.html` | Hub ana sayfa, oyun grid'ini render eder |
| `game.html` | Oyun detay sayfası (`?id=<id>`) — OYNA / REPOYA GİT butonları |
| `assets/css/style.css` | Tema (dark + neon accent) ve layout |
| `assets/js/main.js` | Pagination + grid render (`window.HBNF_DATA`'dan okur) |
| `assets/js/game.js` | Detay sayfası render + iframe player |
| `data/games.js` | **Tek doğruluk kaynağı** — `window.HBNF_DATA = { version, games[] }` |
| `games/<id>/` | (Opsiyonel) lokal embed oyunlarının dosyaları |
| `CHANGELOG.md` | Keep-a-Changelog formatı |
| `VERSION` | Semver tek satır (data/games.js'deki `version` ile senkron) |

## Çalışma Kuralları

- **Bağımlılık ekleme** — Node/npm/build tool eklemeden önce sor. Hub'ın "build step yok" prensibi bilinçlidir.
- **Public repo** — Bu repo public. Hassas bilgi (sunucu IP, SSH key, kişisel notlar) commit edilmez. Internal notlar `NOTES.local.md` gibi `.gitignore`'lanan dosyalara gider.
- **Oyun eklerken** üç şey birlikte güncellenir: `data/games.js`, `CHANGELOG.md`, `VERSION` + `data/games.js`'deki `version` (oyun eklendi → minor bump).
- **Versiyonlama** — Hub'ın UI/altyapı değişiklikleri semver'i sürer. Oyun içerik eklemeleri minor, breaking layout değişiklikleri major.
- **Tema değişikliği** — Renk paleti `style.css` başındaki `:root` CSS değişkenlerinde merkezi tutulur; inline color hard-code edilmez.
- **`fetch()` / ES module kullanma** — Site `file://` ile de açılabilir olmalı. Tüm data inline (`data/games.js` → `window.HBNF_DATA`). Yeni veri kaynağı eklenirse aynı pattern kullanılır.

## Lokal Test

1. `index.html`'i çift tıkla (en kolay) — tüm featurelar çalışır
2. veya: `python -m http.server 8080` (prod ile aynı davranış)

## Deploy

Coolify'ın **Static build pack**'i kullanılır. Build Pack: `Static`, Publish Directory: `/`. Repo'ya push → otomatik deploy. Nginx container'ı Coolify tarafından sağlanır; repo'da `Dockerfile` veya `nginx.conf` **yoktur** (bilinçli — idiomatic Coolify yolu).

## Yapma

- GitHub Pages için `CNAME`, `_config.yml`, `gh-pages` branch yapma — hosting Coolify üzerinde.
- `package.json` / `node_modules` ekleme.
- `Dockerfile` / `nginx.conf` ekleme — Static build pack zaten Nginx ile serve ediyor. Custom header/CSP gerekirse Coolify UI'dan "Nginx Configuration" override edilir, repo'ya değil.
- `fetch()` çağrısı veya `<script type="module">` ekleme — `file://` uyumunu bozar.
- Hub'a analytics / tracker eklemeden önce sor.
