# hbnf.net — GameHub

Emre Özdemir tarafından geliştirilen oyunların yayınlandığı kişisel game hub.

**Canlı:** [hbnf.net](https://hbnf.net)

## Hakkında

Bu repo `hbnf.net` adresinde yayınlanan statik game hub sitesinin kaynak kodunu içerir. Hub, geliştirdiğim oyunları tek bir yerden gezilebilir ve oynanabilir hale getirir:

- **Web oyunları** doğrudan tarayıcıda embed edilir
- **Native / Steam oyunları** ilgili mağaza sayfalarına yönlendirilir

## Yapı

```
.
├── index.html          # Hub ana sayfası
├── game.html           # Oyun detay sayfası (?id=<oyun>)
├── assets/
│   ├── css/style.css   # Stiller (dark + neon)
│   └── js/
│       ├── main.js     # Hub: pagination + grid render
│       └── game.js     # Detay sayfası: oyna / repo
├── data/
│   └── games.js        # Oyun listesi (window.HBNF_DATA, inline)
├── games/              # (Opsiyonel) lokal embed oyunları
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

1. `data/games.js` içindeki `games: [ ... ]` dizisine yeni bir obje ekle:
   ```js
   {
     id: "oyun-adi",
     title: "Oyun Adı",
     description: "Kısa açıklama",
     type: "embed",                          // "embed" veya "link"
     url: "https://hbnf.net/oyun-adi",       // embed: oynanacak URL, link: hedef URL
     repo: "https://github.com/.../...",     // opsiyonel, REPOYA GİT butonu için
     tags: ["puzzle", "2d"],
     status: "live",                          // "live" | "wip" | "soon"
     year: 2026
   }
   ```
2. Lokal embed istersen `games/<id>/index.html` koy ve `url: "games/<id>/"` yaz.
3. `CHANGELOG.md`'ye not düş, `VERSION` bump et (`data/games.js`'deki `version` ile senkron).

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
