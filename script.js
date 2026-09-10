(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.getElementById("main-nav");

  document.querySelectorAll("[data-year]").forEach(function (item) {
    item.textContent = String(new Date().getFullYear());
  });

  function syncHeader() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    }
  }

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  if (menuButton && header && nav) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      header.classList.toggle("menu-open", open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Buka menu");
        header.classList.remove("menu-open");
      });
    });
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("pointermove", function (event) {
      document.documentElement.style.setProperty("--mouse-x", event.clientX + "px");
      document.documentElement.style.setProperty("--mouse-y", event.clientY + "px");
    }, { passive: true });
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeColor(value) {
    return /^#[0-9a-f]{6}$/i.test(String(value)) ? String(value) : "#ff6f7e";
  }

  function clamp(value) {
    var number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return Math.min(100, Math.max(0, Math.round(number)));
  }

  function projectScore(project) {
    var categories = Array.isArray(project.categories) ? project.categories : [];
    if (!categories.length) return 0;
    var total = categories.reduce(function (sum, category) {
      return sum + clamp(category.value);
    }, 0);
    return Math.round(total / categories.length);
  }

  function renderProgress() {
    var target = document.getElementById("progress-list");
    if (!target) return;

    var data = window.KURAGE_PROGRESS || {};
    var projects = Array.isArray(data.projects) ? data.projects : [];
    var updates = Array.isArray(data.updates) ? data.updates : [];

    var activeCount = document.getElementById("active-count");
    var overallAverage = document.getElementById("overall-average");
    var lastUpdated = document.getElementById("last-updated");

    if (activeCount) activeCount.textContent = String(projects.length).padStart(2, "0");

    var combined = projects.length
      ? Math.round(projects.reduce(function (sum, project) {
          return sum + projectScore(project);
        }, 0) / projects.length)
      : 0;

    if (overallAverage) overallAverage.textContent = combined + "%";
    if (lastUpdated) lastUpdated.textContent = data.updated || "Belum diisi";

    if (!projects.length) {
      target.innerHTML = '<div class="empty-data">Belum ada data proyek. Isi file progress-data.js terlebih dahulu.</div>';
      return;
    }

    target.innerHTML = projects.map(function (project, index) {
      var categories = Array.isArray(project.categories) ? project.categories : [];
      var score = projectScore(project);
      var accent = safeColor(project.accent);
      var artClass = project.art === "castle" ? "art-castle" : "art-sky";

      var meters = categories.map(function (category) {
        var value = clamp(category.value);
        return (
          '<div class="meter">' +
            '<span class="meter-label">' + escapeHTML(category.label) + '</span>' +
            '<div class="meter-track" role="progressbar" aria-label="' + escapeHTML(category.label) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + value + '">' +
              '<div class="meter-fill" style="--value:' + value + '%"></div>' +
            '</div>' +
            '<span class="meter-value">' + value + '%</span>' +
          '</div>'
        );
      }).join("");

      return (
        '<article class="progress-card reveal" id="' + escapeHTML(project.id) + '" style="--accent:' + accent + '">' +
          '<div class="progress-card-art ' + artClass + '">' +
            '<div class="progress-art-copy">' +
              '<small>PROJECT ' + String(index + 1).padStart(2, "0") + ' / ' + escapeHTML(project.jpTitle) + '</small>' +
              '<strong>' + escapeHTML(project.title) + '</strong>' +
            '</div>' +
          '</div>' +
          '<div class="progress-card-body">' +
            '<div class="progress-card-top">' +
              '<div>' +
                '<span class="phase">' + escapeHTML(project.phase) + '</span>' +
                '<h2>' + escapeHTML(project.title) + '</h2>' +
                '<p>' + escapeHTML(project.summary) + '</p>' +
              '</div>' +
              '<div class="score-ring" style="--score:' + score + '%" aria-label="Progress keseluruhan ' + score + ' persen">' +
                '<strong>' + score + '%</strong><small>OVERALL</small>' +
              '</div>' +
            '</div>' +
            '<div class="meter-list">' + meters + '</div>' +
            '<div class="progress-meta">' +
              '<span>ENGINE <b>' + escapeHTML(project.engine) + '</b></span>' +
              '<span>PLATFORM <b>' + escapeHTML(project.platform) + '</b></span>' +
              '<span>FOKUS <b>' + escapeHTML(project.milestone) + '</b></span>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join("");

    var logTarget = document.getElementById("update-log");
    if (logTarget) {
      if (!updates.length) {
        logTarget.innerHTML = '<div class="empty-data">Belum ada catatan pembaruan.</div>';
      } else {
        logTarget.innerHTML = updates.map(function (entry) {
          return (
            '<article class="log-entry reveal">' +
              '<time>' + escapeHTML(entry.date) + '</time>' +
              '<h3>' + escapeHTML(entry.title) + '</h3>' +
              '<p>' + escapeHTML(entry.text) + '</p>' +
            '</article>'
          );
        }).join("");
      }
    }
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  renderProgress();
  initReveal();

  if (window.location.hash) {
    window.setTimeout(function () {
      var target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 180);
  }
})();
