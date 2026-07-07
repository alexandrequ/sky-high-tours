(function () {
  "use strict";

  /* header solid-on-scroll */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile nav drawer */
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.querySelector(".nav-drawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      var open = drawer.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        drawer.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* lightbox gallery */
  var galleryLinks = Array.prototype.slice.call(document.querySelectorAll(".gallery a"));
  if (galleryLinks.length) {
    var lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML =
      '<button class="lightbox-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button class="lightbox-prev" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<img alt="" />' +
      '<button class="lightbox-next" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></button>';
    document.body.appendChild(lightbox);

    var lbImg = lightbox.querySelector("img");
    var current = 0;

    function show(index) {
      current = (index + galleryLinks.length) % galleryLinks.length;
      var full = galleryLinks[current].getAttribute("href");
      var caption = galleryLinks[current].getAttribute("data-caption") || "";
      lbImg.src = full;
      lbImg.alt = caption;
    }
    function open(index) {
      show(index);
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    galleryLinks.forEach(function (link, i) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        open(i);
      });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", close);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", function () { show(current - 1); });
    lightbox.querySelector(".lightbox-next").addEventListener("click", function () { show(current + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* contact form -> mailto */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = contactForm.querySelector("#name").value.trim();
      var email = contactForm.querySelector("#email").value.trim();
      var travelDates = contactForm.querySelector("#dates").value.trim();
      var message = contactForm.querySelector("#message").value.trim();

      var subject = "Trip enquiry from " + (name || "the website");
      var bodyLines = [
        "Name: " + name,
        "Email: " + email,
        "Preferred travel dates: " + (travelDates || "—"),
        "",
        message
      ];
      var mailto =
        "mailto:tnorbu43@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));
      window.location.href = mailto;
    });
  }
})();
