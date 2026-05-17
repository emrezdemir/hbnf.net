(function () {
  "use strict";

  var STATUS_LABELS = {
    live: "PLAYABLE",
    wip: "IN DEV",
    soon: "COMING SOON"
  };

  function readId() {
    var params = new URLSearchParams(location.search);
    return params.get("id") || "";
  }

  function init() {
    var id = readId();
    var root = document.querySelector("#game-root");
    var titleEl = document.querySelector("#page-title");

    if (!id) {
      root.innerHTML = renderNotFound("Oyun belirtilmedi.");
      return;
    }

    var data = window.HBNF_DATA || {};
    var games = Array.isArray(data.games) ? data.games : [];
    var game = games.find(function (g) { return g.id === id; });

    if (!game) {
      root.innerHTML = renderNotFound('"' + id + '" adlı oyun bulunamadı.');
      return;
    }

    titleEl.textContent = game.title + " — hbnf.net";
    document.title = titleEl.textContent;
    root.innerHTML = renderGame(game);
    wireActions(game);
    wireLightbox(game);
    setVersion(data.version);
  }

  function renderGame(game) {
    var status = game.status || "live";
    var statusLabel = STATUS_LABELS[status] || status.toUpperCase();
    var tags = (game.tags || []).map(function (t) {
      return '<span class="tag-chip">' + escapeHtml(t) + "</span>";
    }).join("");

    var canPlay = game.type === "embed" && status !== "soon" && !!game.url;
    var hasRepo = !!game.repo;

    var actions = [];
    if (canPlay) {
      actions.push('<button type="button" class="btn btn-ghost" id="fullscreen-btn" title="Tam ekran">⛶ FULLSCREEN</button>');
      actions.push('<a class="btn btn-ghost" href="' + escapeAttr(game.url) + '" target="_blank" rel="noopener" title="Yeni sekmede aç">↗ NEW TAB</a>');
    }
    if (hasRepo) {
      actions.push('<a class="btn btn-ghost" href="' + escapeAttr(game.repo) + '" target="_blank" rel="noopener">↗ REPO</a>');
    }

    var player = canPlay
      ? '<div class="player-frame" id="player-frame">' +
          '<iframe src="' + escapeAttr(game.url) + '" ' +
                  'title="' + escapeAttr(game.title) + '" ' +
                  'allow="fullscreen; autoplay; gamepad; xr-spatial-tracking" ' +
                  'allowfullscreen></iframe>' +
        "</div>"
      : '<div class="player-frame player-frame-empty">' +
          '<div class="empty-state">' +
            '<div class="empty-title">' + statusLabel + "</div>" +
            '<p>' + (status === "soon" ? "Bu oyun henüz oynanabilir değil." : "Tarayıcıda oynanamaz; harici link veya repo'yu kullan.") + '</p>' +
          "</div>" +
        "</div>";

    var long = game.longDescription
      ? '<p class="game-long">' + escapeHtml(game.longDescription) + "</p>"
      : "";

    var controls = game.controls
      ? '<div class="game-controls"><h4>Kontroller</h4><p>' + escapeHtml(game.controls) + "</p></div>"
      : "";

    var shots = Array.isArray(game.screenshots) && game.screenshots.length
      ? '<section class="info-block">' +
          '<h3>Ekran Görüntüleri</h3>' +
          '<div class="screenshots">' +
            game.screenshots.map(function (src, i) {
              return '<button type="button" class="shot" data-shot-index="' + i + '" aria-label="Görseli büyüt">' +
                       '<img src="' + escapeAttr(src) + '" alt="' + escapeAttr(game.title) + '" loading="lazy">' +
                     "</button>";
            }).join("") +
          "</div>" +
        "</section>"
      : "";

    return (
      '<div class="player-top">' +
        '<a class="back-link" href="index.html#games">← Hub</a>' +
        '<div class="player-title">' +
          '<span class="status ' + status + '">' + statusLabel + "</span>" +
          '<h1>' + escapeHtml(game.title) + '</h1>' +
        "</div>" +
        '<div class="player-actions">' + actions.join("") + "</div>" +
      "</div>" +

      player +

      '<section class="info-block info-block-main">' +
        '<p class="game-short">' + escapeHtml(game.description || "") + "</p>" +
        long +
        '<div class="tags">' + tags + "</div>" +
        controls +
      "</section>" +

      shots
    );
  }

  function wireActions(game) {
    var btn = document.querySelector("#fullscreen-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var frame = document.querySelector("#player-frame");
      if (!frame) return;
      var req = frame.requestFullscreen
             || frame.webkitRequestFullscreen
             || frame.msRequestFullscreen;
      if (req) req.call(frame);
    });
  }

  function wireLightbox(game) {
    var shots = Array.isArray(game.screenshots) ? game.screenshots : [];
    if (shots.length === 0) return;

    var lb = document.querySelector("#lightbox");
    var imgEl = lb.querySelector(".lightbox-img");
    var captionEl = lb.querySelector(".lightbox-caption");
    var prevBtn = lb.querySelector(".lightbox-prev");
    var nextBtn = lb.querySelector(".lightbox-next");
    var closeBtn = lb.querySelector(".lightbox-close");
    var current = 0;

    function show(i) {
      current = (i + shots.length) % shots.length;
      imgEl.src = shots[current];
      imgEl.alt = game.title + " — görsel " + (current + 1);
      captionEl.textContent = (current + 1) + " / " + shots.length;
      prevBtn.hidden = shots.length <= 1;
      nextBtn.hidden = shots.length <= 1;
    }

    function open(i) {
      show(i);
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      lb.hidden = true;
      document.body.style.overflow = "";
      imgEl.src = "";
    }

    document.querySelectorAll(".shot").forEach(function (btn) {
      btn.addEventListener("click", function () {
        open(parseInt(btn.dataset.shotIndex, 10) || 0);
      });
    });

    prevBtn.addEventListener("click", function () { show(current - 1); });
    nextBtn.addEventListener("click", function () { show(current + 1); });
    closeBtn.addEventListener("click", close);

    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lightbox-backdrop")) close();
    });

    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(current - 1);
      else if (e.key === "ArrowRight") show(current + 1);
    });
  }

  function renderNotFound(msg) {
    return (
      '<a class="back-link" href="index.html">← Hub\'a dön</a>' +
      '<div class="not-found">' +
        "<h1>404</h1>" +
        "<p>" + escapeHtml(msg) + "</p>" +
      "</div>"
    );
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
  function escapeAttr(str) {
    return escapeHtml(str).replaceAll('"', "&quot;");
  }

  function setVersion(v) {
    var el = document.querySelector("#version");
    if (el && v) el.textContent = "v" + v;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
