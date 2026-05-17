# hbnf.net — GameHub

Emre Özdemir tarafından geliştirilen oyunların yayınlandığı kişisel game hub.

**Canlı:** [hbnf.net](https://hbnf.net)

## Hakkında

Bu repo `hbnf.net` adresinde yayınlanan statik game hub sitesinin kaynak kodunu içerir. Hub, geliştirdiğim oyunları tek bir yerden gezilebilir ve oynanabilir hale getirir.

**Mimari:** Her oyun kendi subdomain'inde ayrı bir Coolify app olarak deploy edilir (örn. `time-echo.hbnf.net`). Hub yalnızca vitrin/launcher görevi görür; oyun kartına tıklayınca `game.html?id=<slug>` üzerinden iframe ile oyunu yükler.

## Yapı

```
.
├── index.html          # Hub ana sayfası — oyun grid'i + pagination
├── game.html           # Iframe player sayfası (?id=<oyun>)
├── assets/
│   ├── css/style.css   # Tema (dark + neon), layout, lightbox
│   ├── js/main.js      # Hub render
│   ├── js/game.js      # Iframe player + fullscreen + lightbox
│   └── img/            # Oyun kapakları ve ekran görüntüleri
├── data/
│   └── games.js        # Oyun listesi (window.HBNF_DATA, inline)
├── games/              # Boş — gelecekteki lokal embed'ler için ayrıldı
├── CHANGELOG.md
├── VERSION
└── CLAUDE.md           # AI asistan context'i
```

## Geliştirme

Tam statik site — **build adımı yok, bağımlılık yok**. İki yol:

1. **Çift tıkla** `index.html`'i — tarayıcıda direkt açılır (veri inline, fetch yok)
2. **Lokal HTTP server** (opsiyonel, prod ile aynı davranış için):
   ```sh
   python -m http.server 8080
   # veya
   npx serve .
   ```

## Yeni Oyun Ekleme

1. Oyunu kendi repo'sunda geliştir, HTML build çıkar.
2. **Coolify'da yeni app:** Build Pack: Static, Domain: `https://<slug>.hbnf.net`. (DNS A record veya wildcard `*.hbnf.net` ayarlı olmalı.)
3. Bu hub repo'sunda `data/games.js` → yeni entry:
   ```js
   {
     id: "oyun-adi",
     title: "Oyun Adı",
     description: "Kısa açıklama",
     longDescription: "Daha uzun açıklama (opsiyonel)",
     type: "embed",                              // "embed" → iframe, "link" → yeni sekme
     url: "https://oyun-adi.hbnf.net/",          // embed → iframe src, link → target URL
     repo: "https://github.com/.../...",         // opsiyonel, REPO butonu
     tags: ["puzzle", "2d"],
     status: "live",                              // "live" | "wip" | "soon"
     year: 2026,
     controls: "WASD — hareket · SPACE — ...",   // opsiyonel
     thumbnail: "assets/img/oyun-adi-cover.png", // opsiyonel
     screenshots: ["assets/img/...", "..."]      // opsiyonel, lightbox galerisi
   }
   ```
4. Görselleri `assets/img/<slug>-cover.png` ve `assets/img/<slug>-gameplay.png` olarak koy.
5. `CHANGELOG.md` + kök `VERSION` + `data/games.js`'deki `version` bump et.
6. Commit & push → Coolify hub'ı otomatik redeploy eder.

## Deploy — Coolify

Coolify'ın **Static** build pack'i ile deploy ediliyor (Dockerfile/config dosyası gerekmez).

**Coolify dashboard ayarları:**
- **Build Pack:** `Static`
- **Base Directory:** `/`
- **Publish Directory:** `/` (repo kökü, `index.html` burada)
- **Domain:** `hbnf.net`

Coolify otomatik olarak Nginx container'ı ayağa kaldırır ve dosyaları serve eder. Repo'ya her push deploy'u tetikler. Custom Nginx config gerekirse Coolify UI'dan "Nginx Configuration" alanı override edilebilir — repo'da config dosyası tutmaya gerek yok.

> Referans: [Coolify Static build pack docs](https://coolify.io/docs/applications/build-packs/static) · [coolify-examples/static](https://github.com/coollabsio/coolify-examples/tree/main/static)

## Lisans

Kaynak kod hakları saklıdır. Oyunlar için ilgili lisanslar her oyunun kendi klasöründe belirtilir.
