# CLAUDE.md

Bu dosya, Claude Code'un bu repo'da çalışırken bağlam edinmesi için hazırlanmıştır.

## Proje Özeti

`hbnf.net` — Emre Özdemir'in kişisel game hub'ı. Statik HTML/CSS/JS ile yazılır, Coolify'a deploy edilir. Geliştirilen oyunları tek yerden gezilebilir ve oynanabilir hale getirir.

**Canlı:** https://hbnf.net · **Repo:** https://github.com/emrezdemir/hbnf.net

## Stack

- Vanilla HTML5 / CSS3 / JavaScript — **ES module değil**, klasik `<script>` (file:// uyumu için)
- Build step **yok** — dosyalar olduğu gibi serve edilir
- Bağımlılık **yok** — `package.json` bilinçli olarak yer almaz
- Production: Coolify **Static build pack** (otomatik nginx, repo'da Dockerfile/config yok)

## Mimari — Hub + Oyunlar

Her oyun **ayrı bir Coolify app** olarak kendi subdomain'inde deploy edilir. Hub sadece bir vitrin/launcher:

```
hbnf.net                          → Hub (BU repo, Static build pack)
time-echo.hbnf.net                → Time Echo (ayrı Coolify app, Godot HTML5 build)
<yeni-oyun>.hbnf.net              → Gelecek oyunlar
```

Hub'ın iki sayfası:
- `index.html` — oyun kartlarının grid'i + pagination
- `game.html?id=<id>` — **doğrudan iframe player**. Sayfa açıldığında oyun otomatik yüklenir (OYNA butonu yoktur). Üst çubukta `← Hub · Başlık · FULLSCREEN · NEW TAB · REPO`. Iframe'in altında açıklama/kontroller/ekran görüntüleri (lightbox modal ile büyütülür).

Aynı oyuna iki giriş noktası:
- `hbnf.net/game.html?id=time-echo` → hub içinde iframe ile gezinme
- `time-echo.hbnf.net` → fullscreen, paylaşılabilir direkt link

## Dosya Düzeni

| Yol | Amaç |
|-----|------|
| `index.html` | Hub ana sayfa, oyun grid'ini render eder |
| `game.html` | İframe player sayfası (`?id=<id>`) |
| `assets/css/style.css` | Tema (dark + neon accent), layout, lightbox |
| `assets/js/main.js` | Pagination + grid render (`window.HBNF_DATA`'dan okur) |
| `assets/js/game.js` | Iframe player + fullscreen + lightbox |
| `data/games.js` | **Tek doğruluk kaynağı** — `window.HBNF_DATA = { version, games[] }` |
| `games/` | (Opsiyonel/ileride) lokal embed oyunları için ayrılmış — şu an subdomain pattern'i kullanılıyor, boş |
| `CHANGELOG.md` | Keep-a-Changelog formatı |
| `VERSION` | Semver tek satır (data/games.js'deki `version` ile senkron) |

## games.js Schema

```js
{
  id: "slug",                              // URL'de geçer (game.html?id=slug)
  title: "Display Name",
  description: "Kart açıklaması (kısa)",
  longDescription: "Detay sayfası açıklaması (opsiyonel)",
  type: "embed" | "link",                  // embed → iframe, link → yeni sekme
  url: "https://slug.hbnf.net/",           // embed: iframe src, link: target URL
  repo: "https://github.com/.../...",      // opsiyonel, REPO butonu
  tags: ["godot", "puzzle"],
  status: "live" | "wip" | "soon",         // soon → empty state, iframe yok
  year: 2026,
  controls: "WASD — hareket · SPACE — ...",// opsiyonel, kontroller bloku
  thumbnail: "assets/img/slug-cover.png",  // opsiyonel, kart kapağı
  screenshots: ["assets/img/...", "..."]   // opsiyonel, lightbox galerisi
}
```

## Çalışma Kuralları

- **Bağımlılık ekleme** — Node/npm/build tool eklemeden önce sor. Hub'ın "build step yok" prensibi bilinçlidir.
- **Public repo** — Bu repo public. Hassas bilgi (sunucu IP, SSH key, kişisel notlar) commit edilmez. Internal notlar `NOTES.local.md` gibi `.gitignore`'lanan dosyalara gider.
- **Oyun eklerken** üç şey güncellenir: `data/games.js` (yeni entry + `version` bump), `CHANGELOG.md`, kök `VERSION`. Yeni `id` için `assets/img/<id>-*.png` görselleri eklenir.
- **Versiyonlama** — UI/altyapı değişiklikleri semver'i sürer. Oyun içerik eklemeleri/URL değişiklikleri patch veya minor. Breaking layout/schema değişiklikleri major.
- **Tema değişikliği** — Renk paleti `style.css` başındaki `:root` CSS değişkenlerinde merkezi tutulur; inline color hard-code edilmez.
- **`fetch()` / ES module kullanma** — Site `file://` ile de açılabilir olmalı. Tüm data inline (`data/games.js` → `window.HBNF_DATA`). Yeni veri kaynağı eklenirse aynı pattern kullanılır.
- **Iframe `allow` attribute** — Mevcut: `fullscreen; autoplay; gamepad; xr-spatial-tracking`. Yeni oyun bir capability istiyorsa (örn. `clipboard-read`) buraya ekle.

## Yeni Oyun Ekleme — Tam Akış

1. Oyunu kendi repo'sunda geliştir, HTML build çıkar (Godot/Unity/vanilla farketmez).
2. **Coolify'da yeni app oluştur:** Build Pack: Static, Domain: `https://<slug>.hbnf.net`, Base Directory: build dosyalarının yolu.
3. DNS: `<slug>.hbnf.net` A record sunucu IP'sine yönlendirilir (veya wildcard `*.hbnf.net` ayarlıysa otomatik).
4. Bu hub repo'sunda `data/games.js` → yeni entry ekle (`url: "https://<slug>.hbnf.net/"`).
5. Görselleri `assets/img/<slug>-cover.png` ve `assets/img/<slug>-gameplay.png` olarak koy.
6. `CHANGELOG.md` + `VERSION` + `data/games.js`'deki `version` bump et.
7. Commit & push → Coolify hub'ı otomatik redeploy eder.

## Lokal Test

1. `index.html`'i çift tıkla (en kolay) — tüm featurelar çalışır
2. veya: `python -m http.server 8080` (prod ile aynı davranış)

## Deploy

Coolify'ın **Static build pack**'i kullanılır.
- Hub app — Build Pack: `Static`, Base Directory: `/`, Domain: `https://hbnf.net`
- Repo'ya push → Coolify webhook ile otomatik redeploy
- Nginx container Coolify tarafından sağlanır; repo'da `Dockerfile` / `nginx.conf` **yoktur** (bilinçli, idiomatic yol)
- Custom header/CSP gerekirse Coolify UI'dan "Nginx Configuration" override edilir, repo'ya değil

## Yapma

- GitHub Pages için `CNAME`, `_config.yml`, `gh-pages` branch yapma — hosting Coolify üzerinde.
- `package.json` / `node_modules` ekleme.
- `Dockerfile` / `nginx.conf` ekleme — Static build pack zaten Nginx ile serve ediyor.
- `fetch()` çağrısı veya `<script type="module">` ekleme — `file://` uyumunu bozar.
- `game.html`'e "OYNA" butonu / detay sayfası mantığı geri getirme — bilinçli kaldırıldı, sayfa açıldığında iframe direkt yüklenir.
- Hub'a analytics / tracker eklemeden önce sor.
