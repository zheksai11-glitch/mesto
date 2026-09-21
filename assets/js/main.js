(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var sentinel = document.querySelector("[data-sentinel]");
  var drawer = document.querySelector("[data-drawer]");
  var burger = document.querySelector("[data-burger]");

  if (header && sentinel && "IntersectionObserver" in window) {
    var headerObserver = new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    });
    headerObserver.observe(sentinel);
  }

  function setDrawer(open) {
    if (!drawer || !burger) return;
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.documentElement.style.overflow = open ? "hidden" : "";
  }

  if (burger) {
    burger.addEventListener("click", function () {
      setDrawer(!drawer.classList.contains("is-open"));
    });
  }

  if (drawer) {
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setDrawer(false);
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setDrawer(false);
  });

  var revealables = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    revealables.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealables.forEach(function (element) {
      element.classList.add("is-in");
    });
  }

  var form = document.querySelector("[data-booking-form]");

  if (form) {
    var status = form.querySelector("[data-status]");

    form.querySelectorAll("[required]").forEach(function (input) {
      input.addEventListener("input", function () {
        var field = input.closest(".field");
        if (field) field.setAttribute("data-invalid", "false");
        var error = field && field.querySelector(".field__error");
        if (error) error.textContent = "";
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var firstInvalid = null;

      form.querySelectorAll("[required]").forEach(function (input) {
        var field = input.closest(".field");
        var error = field && field.querySelector(".field__error");
        var valid = input.checkValidity();

        if (field) field.setAttribute("data-invalid", valid ? "false" : "true");
        if (error) {
          error.textContent = valid
            ? ""
            : input.getAttribute("data-error") || "Заполните поле";
        }
        if (!valid && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      if (status) {
        status.textContent = "Демонстрационный макет: форма не отправляет данные.";
      }
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  var topBtn = document.querySelector("[data-to-top]");

  if (topBtn) {
    var toggleTop = function () {
      topBtn.classList.toggle("is-visible", window.scrollY > 480);
    };

    window.addEventListener("scroll", toggleTop, { passive: true });
    toggleTop();

    topBtn.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }
})();
