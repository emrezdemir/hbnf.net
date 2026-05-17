# Changelog

Bu projedeki tüm önemli değişiklikler bu dosyada tutulur.

Format [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) standardına dayanır,
sürümleme [Semantic Versioning](https://semver.org/spec/v2.0.0.html) ile yapılır.

## [Unreleased]

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

[Unreleased]: https://github.com/emrezdemir/hbnf.net/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/emrezdemir/hbnf.net/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/emrezdemir/hbnf.net/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/emrezdemir/hbnf.net/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/emrezdemir/hbnf.net/releases/tag/v0.1.0
