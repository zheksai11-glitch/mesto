(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var sentinel = document.querySelector("[data-sentinel]");
  var drawer = document.querySelector("[data-drawer]");
  var burger = document.querySelector("[data-burger]");
  var drawerClose = document.querySelector("[data-drawer-close]");
  var lastFocused = null;

  if (header && sentinel && "IntersectionObserver" in window) {
    var headerObserver = new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    });
    headerObserver.observe(sentinel);
  }

  function setDrawer(open) {
    if (!drawer || !burger) return;
    if (open) lastFocused = document.activeElement;

    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.documentElement.style.overflow = open ? "hidden" : "";

    if (open) {
      var first = drawer.querySelector("a, button");
      if (first) first.focus();
    } else if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  if (burger) {
    burger.addEventListener("click", function () {
      setDrawer(!drawer.classList.contains("is-open"));
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener("click", function () {
      setDrawer(false);
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
    var isOpen = drawer && drawer.classList.contains("is-open");

    if (event.key === "Escape" && isOpen) {
      setDrawer(false);
      return;
    }

    if (event.key !== "Tab" || !isOpen) return;

    var focusables = drawer.querySelectorAll("a[href], button:not([disabled])");
    if (!focusables.length) return;

    var first = focusables[0];
    var last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
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

  var prefillTarget = document.querySelector("[data-prefill-target]");
  if (prefillTarget) {
    document.querySelectorAll("[data-prefill]").forEach(function (link) {
      link.addEventListener("click", function () {
        var wanted = link.getAttribute("data-prefill");
        Array.prototype.forEach.call(prefillTarget.options, function (option) {
          if (option.text.indexOf(wanted) === 0) {
            prefillTarget.value = option.value || option.text;
          }
        });
      });
    });
  }

  var slider = document.querySelector("[data-reviews-slider]");
  if (slider) {
    var slides = slider.querySelectorAll(".review-slide");
    var dots = slider.querySelectorAll(".reviews__dot");
    var current = 0;
    var timer = null;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function showSlide(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (slide, k) {
        slide.classList.toggle("is-active", k === current);
      });
      dots.forEach(function (dot, k) {
        dot.classList.toggle("is-active", k === current);
        dot.setAttribute("aria-current", k === current ? "true" : "false");
      });
    }

    function startRotation() {
      if (timer || reduceMotion.matches) return;
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 6000);
    }

    function stopRotation() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, k) {
      dot.addEventListener("click", function () {
        showSlide(k);
        stopRotation();
        startRotation();
      });
    });

    slider.addEventListener("mouseenter", stopRotation);
    slider.addEventListener("mouseleave", startRotation);
    slider.addEventListener("focusin", stopRotation);
    slider.addEventListener("focusout", startRotation);

    startRotation();
  }

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
