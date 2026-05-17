# Changelog

Bu projedeki tüm önemli değişiklikler bu dosyada tutulur.

Format [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) standardına dayanır,
sürümleme [Semantic Versioning](https://semver.org/spec/v2.0.0.html) ile yapılır.

## [Unreleased]

## [0.6.0] - 2026-05-17

### Added
- Tam **mobile responsive** çalışma: 768px, 640px, 380px breakpoint'leri
  - Game player üst çubuğu mobilde dikey stack (başlık üstte, butonlar tam genişlik)
  - Pagination kontrolleri küçük ekranlarda kompakt
  - Header / nav / hero / section-head küçük ekranlarda yeniden düzenlendi
  - Screenshots galerisi mobilde tek kolon
  - Game grid 380px altında tek kolon

## [0.5.1] - 2026-05-17

### Changed
- Time Echo URL'i path → subdomain'e taşındı: `hbnf.net/time-echo` → `time-echo.hbnf.net`

## [0.5.0] - 2026-05-17

### Changed
- **`game.html` artık doğrudan iframe player**: detay sayfası UX'i kaldırıldı, "OYNA" butonuna basma adımı yok — sayfa açıldığında oyun otomatik yüklü gelir
- Sayfa düzeni: üstte ince başlık çubuğu (← Hub · başlık · FULLSCREEN · NEW TAB · REPO) → iframe → altında kompakt açıklama/kontroller/screenshots
- Iframe için **FULLSCREEN** ve **NEW TAB** butonları eklendi
- `game.html` daha geniş layout (1500px) — oyun alanı için yer
- "Soon" statüsündeki oyunlar için boş player state'i (dashed border + bilgi metni)

### Notes
- Direkt oyun URL'i: `hbnf.net/<id>` (Coolify'da ayrı app olarak deploy)
- Hub içinden iframe ile oyun: `hbnf.net/game.html?id=<id>` (hub wrapper)
- İkisi farklı UX — direkt link paylaşmak için ilki, hub içinden gezinmek için ikincisi

## [0.4.1] - 2026-05-17

### Changed
- Screenshot tıklaması artık yeni sekmede ham görseli açmak yerine **lightbox modal** açıyor
  - ESC ile kapat · ← / → ile gez · dışına tıkla kapat
  - Mobil için kompakt kontroller, neon glow ile blur backdrop

## [0.4.0] - 2026-05-17

### Added
- Time Echo için cover + gameplay görselleri (`assets/img/time-echo-*.png`)
- Detay sayfasında `screenshots` galerisi (responsive grid, click → full-size yeni sekmede)

### Changed
- Hub şimdilik sadece **Time Echo**'yu listeliyor — placeholder oyunlar (Echo, Echo 3D, Intro) production lansman için kaldırıldı, hazır olduklarında geri eklenir
- Time Echo açıklaması, tag'leri ve kontrolleri gerçek oyuna göre güncellendi (Godot/puzzle/time)

## [0.3.0] - 2026-05-17

### Added
- Coolify **Static build pack** deploy akışı (README + CLAUDE.md)

### Changed
- Veri kaynağı `data/games.json` → `data/games.js` (`window.HBNF_DATA`, inline) — `file://` ile çift tıkla çalışsın diye
- `<script type="module">` → klasik `<script>` (aynı sebeple)
- README + CLAUDE.md güncellendi (yeni stack ve deploy akışı)

### Removed
- `data/games.json` (yerine `data/games.js`)
- `Dockerfile`, `nginx.conf`, `.dockerignore` — Coolify Static build pack zaten Nginx ile serve ediyor, idiomatic değildi (kısaca yaşadı, RIP)

## [0.2.0] - 2026-05-17

### Added
- **Time Echo** ilk oynanabilir oyun olarak hub'a eklendi (`hbnf.net/time-echo` üzerinden iframe ile embed)
- Oyun detay sayfası (`game.html?id=<id>`) — "OYNA" (embed) ve "REPOYA GİT" butonları
- Ana sayfada pagination (6 oyun/sayfa, URL'de `?page=N` ile paylaşılabilir)
- `data/games.json` schema'sı genişledi: `repo`, `longDescription`, `controls`
- Hub'a 4. placeholder: Intro

### Changed
- Time Echo: `type: link` → `embed`, `status: soon` → `live`, tag `prototype` → `godot`

### Fixed
- Footer'da yazar adı düzeltildi: "Emre Z. Demir" → "Emre Özdemir"

## [0.1.0] - 2026-05-17

### Added
- Repo iskeleti: `index.html`, `assets/`, `games/`, `data/games.json`
- Dark + neon temalı hub ana sayfa tasarımı
- `data/games.json` üzerinden dinamik oyun kartı render'ı
- Hub'a oyun ekleme/listeleme akışı için README dokümantasyonu
- `CHANGELOG.md`, `VERSION`, `CLAUDE.md`, `.gitignore`

[Unreleased]: https://github.com/emrezdemir/hbnf.net/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/emrezdemir/hbnf.net/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/emrezdemir/hbnf.net/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/emrezdemir/hbnf.net/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/emrezdemir/hbnf.net/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/emrezdemir/hbnf.net/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/emrezdemir/hbnf.net/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/emrezdemir/hbnf.net/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/emrezdemir/hbnf.net/releases/tag/v0.1.0
