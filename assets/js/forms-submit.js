/* ==========================================================================
   CAPRIO & CO — FORM SUBMISSION (Google Sheets via Apps Script)
   Handles #contact-form and #quote-form: validates, posts to the Apps
   Script web app below, and updates each form's status element.
   Depends on nothing else — safe to load after products.js/site.js.
   ========================================================================== */
(function () {
  "use strict";

  /* Paste your deployed Apps Script web app URL here (Deploy > New
     deployment > Web app, "Anyone" access). See google-apps-script/Code.gs. */
  var WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxaiSQR2KkY62-2mkWU3CkPSNzU3tINdkCy7m9ERfpx33NtGk5xH6ruy9psxTTwobI/exec";

  function showStatus(statusEl, kind, message) {
    if (!statusEl) return;
    statusEl.className = "formstatus is-" + kind;
    statusEl.textContent = message;
  }

  function handleSubmit(form, statusEl, formType) {
    return function (e) {
      e.preventDefault();

      var data = {};
      new FormData(form).forEach(function (value, key) {
        data[key] = typeof value === "string" ? value.trim() : value;
      });

      if (!data.name || !data.email) {
        showStatus(statusEl, "err", "Please fill in your name and email before sending.");
        return;
      }

      data.formType = formType;
      data.pageUrl = window.location.href;

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : "";
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending…";
      }
      showStatus(statusEl, "ok", "Sending…");

      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        mode: "no-cors",
        body: JSON.stringify(data),
      })
        .then(function () {
          /* mode: "no-cors" makes the response opaque — we can't read a
             real status code, so a resolved fetch is our success signal. */
          showStatus(statusEl, "ok", "Enquiry received. Our team will get back to you shortly.");
          form.reset();
        })
        .catch(function () {
          var email = (typeof SITE !== "undefined" && SITE.email1) || "caprioandco@gmail.com";
          var phone = (typeof SITE !== "undefined" && SITE.phone1) || "+91 90043 97801";
          showStatus(
            statusEl,
            "err",
            "That didn't send. Please email us at " + email + " or WhatsApp " + phone + " instead."
          );
        })
        .finally(function () {
          if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
          }
        });
    };
  }

  document.addEventListener("DOMContentLoaded", function () {
    var contactForm = document.getElementById("contact-form");
    if (contactForm) {
      var contactStatus = document.getElementById("contact-form-status");
      contactForm.addEventListener("submit", handleSubmit(contactForm, contactStatus, "contact"));
    }

    var quoteForm = document.getElementById("quote-form");
    if (quoteForm) {
      var quoteStatus = document.getElementById("form-status");
      quoteForm.addEventListener("submit", handleSubmit(quoteForm, quoteStatus, "quote"));
    }
  });
})();
