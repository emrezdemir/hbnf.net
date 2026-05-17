(function () {
  "use strict";

  var STATUS_LABELS = {
    live: "PLAYABLE",
    wip: "IN DEV",
    soon: "COMING SOON"
  };

  var PAGE_SIZE = 6;
  var allGames = [];

  function init() {
    var grid = document.querySelector("#games-grid");
    var count = document.querySelector("#games-count");

    var data = window.HBNF_DATA || {};
    allGames = Array.isArray(data.games) ? data.games : [];
    count.textContent = String(allGames.length).padStart(2, "0");

    if (allGames.length === 0) {
      grid.innerHTML = '<div class="loading">Henüz oyun yok</div>';
      return;
    }

    renderPage(readPage());
    setVersion(data.version);
  }

  function readPage() {
    var params = new URLSearchParams(location.search);
    var p = parseInt(params.get("page"), 10);
    return Number.isFinite(p) && p > 0 ? p : 1;
  }

  function totalPages() {
    return Math.max(1, Math.ceil(allGames.length / PAGE_SIZE));
  }

  function renderPage(page) {
    var grid = document.querySelector("#games-grid");
    var pag = document.querySelector("#pagination");
    var total = totalPages();
    var safePage = Math.min(Math.max(page, 1), total);

    var start = (safePage - 1) * PAGE_SIZE;
    var slice = allGames.slice(start, start + PAGE_SIZE);
    grid.innerHTML = slice.map(renderCard).join("");

    pag.innerHTML = renderPagination(safePage, total);
    pag.hidden = total <= 1;

    pag.querySelectorAll("[data-page]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var p = parseInt(btn.dataset.page, 10);
        if (Number.isFinite(p)) goToPage(p);
      });
    });
  }

  function goToPage(page) {
    var total = totalPages();
    var safe = Math.min(Math.max(page, 1), total);
    var url = new URL(location.href);
    if (safe === 1) url.searchParams.delete("page");
    else url.searchParams.set("page", String(safe));
    history.pushState({ page: safe }, "", url);
    renderPage(safe);
    var anchor = document.querySelector("#games");
    if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.addEventListener("popstate", function () {
    if (allGames.length) renderPage(readPage());
  });

  function renderPagination(page, total) {
    if (total <= 1) return "";

    function btn(label, p, opts) {
      opts = opts || {};
      var cls = ["page-btn"];
      if (opts.current) cls.push("current");
      if (opts.disabled) cls.push("disabled");
      var attrs = ['class="' + cls.join(" ") + '"'];
      if (opts.disabled) attrs.push('aria-disabled="true"');
      else attrs.push('data-page="' + p + '"');
      if (opts.ariaLabel) attrs.push('aria-label="' + opts.ariaLabel + '"');
      if (opts.current) attrs.push('aria-current="page"');
      return "<button " + attrs.join(" ") + ">" + label + "</button>";
    }

    var parts = [];
    parts.push(btn("‹ Prev", page - 1, { disabled: page === 1, ariaLabel: "Önceki sayfa" }));

    compactPageList(page, total).forEach(function (p) {
      if (p === "…") parts.push('<span class="page-ellipsis">…</span>');
      else parts.push(btn(String(p).padStart(2, "0"), p, {
        current: p === page,
        ariaLabel: "Sayfa " + p
      }));
    });

    parts.push(btn("Next ›", page + 1, { disabled: page === total, ariaLabel: "Sonraki sayfa" }));
    return parts.join("");
  }

  function compactPageList(current, total) {
    if (total <= 7) {
      var arr = [];
      for (var i = 1; i <= total; i++) arr.push(i);
      return arr;
    }
    var result = [1];
    var start = Math.max(2, current - 1);
    var end = Math.min(total - 1, current + 1);
    if (start > 2) result.push("…");
    for (var j = start; j <= end; j++) result.push(j);
    if (end < total - 1) result.push("…");
    result.push(total);
    return result;
  }

  function renderCard(game) {
    var status = game.status || "live";
    var tags = (game.tags || []).slice(0, 3).map(function (t) {
      return '<span class="tag-chip">' + escapeHtml(t) + "</span>";
    }).join("");
    var thumb = game.thumbnail
      ? '<img src="' + escapeAttr(game.thumbnail) + '" alt="' + escapeAttr(game.title) + '" loading="lazy">'
      : '<div class="placeholder">' + escapeHtml(game.title) + "</div>";
    var href = "game.html?id=" + encodeURIComponent(game.id);
    var statusLabel = STATUS_LABELS[status] || status.toUpperCase();

    return (
      '<a class="game-card" href="' + href + '" data-id="' + escapeAttr(game.id) + '">' +
        '<div class="thumb">' + thumb + "</div>" +
        "<h3>" + escapeHtml(game.title) + "</h3>" +
        '<p class="desc">' + escapeHtml(game.description || "") + "</p>" +
        '<div class="tags">' + tags + "</div>" +
        '<div class="meta">' +
          '<span class="status ' + status + '">' + statusLabel + "</span>" +
          "<span>OPEN →</span>" +
        "</div>" +
      "</a>"
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
