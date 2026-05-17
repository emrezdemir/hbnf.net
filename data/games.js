/* hbnf.net — Games data (inline so site works under file:// too)
 *
 * Schema:
 *   id, title, description, longDescription?, type ('embed'|'link'),
 *   url, repo?, tags[], thumbnail?, status? ('live'|'wip'|'soon'),
 *   year?, controls?
 */
window.HBNF_DATA = {
  version: "0.5.0",
  games: [
    {
      id: "time-echo",
      title: "Time Echo",
      description: "An abandoned space station. Time echoes. Your past will save you.",
      longDescription: "Terk edilmiş bir uzay istasyonunda geçen, zaman manipülasyonu üzerine kurulu bir bulmaca oyunu. Geçmişteki hareketlerin yankıları, bulmacaları çözmek için yardımcın olur. Godot 4 ile geliştirildi, tarayıcıda oynanabilir.",
      type: "embed",
      url: "https://hbnf.net/time-echo",
      repo: "https://github.com/emrezdemir/echo-game.io",
      tags: ["godot", "puzzle", "time"],
      status: "live",
      year: 2026,
      controls: "WASD / Yön tuşları — hareket · SPACE — yankı kaydet/oynat · R — restart",
      thumbnail: "assets/img/time-echo-cover.png",
      screenshots: [
        "assets/img/time-echo-cover.png",
        "assets/img/time-echo-gameplay.png"
      ]
    }
  ]
};
