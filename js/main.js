(function () {
  var formUrl =
    document.querySelector('meta[name="google-form-url"]') &&
    document.querySelector('meta[name="google-form-url"]').getAttribute("content");

  document.querySelectorAll(".js-register").forEach(function (link) {
    if (formUrl) {
      link.setAttribute("href", formUrl);
    }
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  function setupRotator(rootSelector, itemSelector, interval) {
    var root = document.querySelector(rootSelector);
    if (!root) return;
    var items = Array.prototype.slice.call(root.querySelectorAll(itemSelector));
    if (!items.length) return;
    var index = items.findIndex(function (el) {
      return el.classList.contains("is-active");
    });
    if (index < 0) {
      index = 0;
      items[0].classList.add("is-active");
    }

    function visibleCount() {
      if (root.classList.contains("js-orgs") && window.matchMedia("(min-width: 960px)").matches) {
        return 3;
      }
      if (root.classList.contains("js-orgs") && window.matchMedia("(min-width: 768px)").matches) {
        return 2;
      }
      return 1;
    }

    function show(next) {
      items.forEach(function (el) {
        el.classList.remove("is-active");
      });
      var count = visibleCount();
      index = ((next % items.length) + items.length) % items.length;
      for (var i = 0; i < count; i += 1) {
        items[(index + i) % items.length].classList.add("is-active");
      }
    }

    var timer = null;
    function start() {
      stop();
      if (interval) {
        timer = window.setInterval(function () {
          show(index + 1);
        }, interval);
      }
    }
    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    root.querySelectorAll("[data-dir]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = btn.getAttribute("data-dir") === "prev" ? -1 : 1;
        show(index + dir);
        start();
      });
    });

    window.addEventListener("resize", function () {
      show(index);
    });

    show(index);
    start();
  }

  setupRotator(".js-quotes", ".quote", 0);
  setupRotator(".js-orgs", ".org-slide", 0);

  document.querySelectorAll(".faq-item").forEach(function (item) {
    var button = item.querySelector("button");
    var panel = item.querySelector(".faq-panel");
    if (!button || !panel) return;

    function sync() {
      var open = item.classList.contains("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      var mark = button.querySelector("[data-mark]");
      if (mark) mark.textContent = open ? "−" : "+";
    }

    sync();
    button.addEventListener("click", function () {
      var willOpen = !item.classList.contains("is-open");
      document.querySelectorAll(".faq-item").forEach(function (other) {
        other.classList.remove("is-open");
      });
      if (willOpen) item.classList.add("is-open");
      document.querySelectorAll(".faq-item").forEach(function (other) {
        var b = other.querySelector("button");
        var p = other.querySelector(".faq-panel");
        var open = other.classList.contains("is-open");
        if (b) b.setAttribute("aria-expanded", open ? "true" : "false");
        if (p) p.hidden = !open;
        var mark = other.querySelector("[data-mark]");
        if (mark) mark.textContent = open ? "−" : "+";
      });
    });
  });

  var backTop = document.querySelector(".back-top");
  if (backTop) {
    window.addEventListener(
      "scroll",
      function () {
        backTop.classList.toggle("is-visible", window.scrollY > 480);
      },
      { passive: true }
    );
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setupReveal() {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var groups = [
      [".hero-kicker", ".hero-bottom"],
      [".problem .wrap > *"],
      [".curriculum h2", ".mm-center", ".mm-node"],
      [".empathy .wrap > *", ".empathy-stats > *", ".empathy-photo-copy > *"],
      [".book .wrap > *", ".mentors .wrap > *"],
      [".testimonials .carousel"],
      [".orgs h2", ".org-stage"],
      [".details .wrap > *", ".schedule .wrap > *", ".faq h2", ".faq-item", ".final-cta .js-register"],
      [".site-footer .wrap > *"],
    ];
    var nodes = [];

    groups.forEach(function (sels) {
      var batch = [];
      sels.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
          batch.push(el);
        });
      });
      batch.forEach(function (el, i) {
        el.style.transitionDelay = i * 0.07 + "s";
        nodes.push(el);
      });
    });

    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(function (el) {
        el.classList.add("is-in");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach(function (el) {
      io.observe(el);
    });

    function flush() {
      nodes.forEach(function (el) {
        if (el.classList.contains("is-in")) return;
        if (el.getBoundingClientRect().top < window.innerHeight - 24) {
          el.classList.add("is-in");
          io.unobserve(el);
        }
      });
    }

    window.addEventListener("scroll", flush, { passive: true });
    flush();
  }

  setupReveal();
})();
