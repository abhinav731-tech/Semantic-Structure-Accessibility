/**
 * main.js — progressive-enhancement behaviors.
 * The site is fully readable and navigable with this file absent;
 * it only adds the mobile nav toggle and inline form validation.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     Mobile navigation toggle
     --------------------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-navigation");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /* ---------------------------------------------------------------------
     Contact form validation
     Accessible pattern:
     - Native HTML validation attributes remain as the baseline.
     - On submit, we run our own checks so we can move focus to the
       first invalid field and announce errors via aria-live regions.
     - Each error message is tied to its input with aria-describedby.
     --------------------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var statusRegion = document.getElementById("form-status");

  function setFieldError(field, message) {
    var wrapper = field.closest(".field");
    var errorEl = document.getElementById(field.id + "-error");
    if (!wrapper || !errorEl) return;
    if (message) {
      wrapper.classList.add("has-error");
      errorEl.textContent = message;
      field.setAttribute("aria-invalid", "true");
    } else {
      wrapper.classList.remove("has-error");
      errorEl.textContent = "";
      field.removeAttribute("aria-invalid");
    }
  }

  function validateField(field) {
    if (field.validity.valid) {
      setFieldError(field, "");
      return true;
    }
    var message = "This field needs your attention.";
    if (field.validity.valueMissing) {
      message = field.dataset.errorRequired || "This field is required.";
    } else if (field.validity.typeMismatch && field.type === "email") {
      message = "Enter a valid email address, e.g. name@example.com.";
    } else if (field.validity.tooShort) {
      message = "Please enter at least " + field.minLength + " characters.";
    }
    setFieldError(field, message);
    return false;
  }

  var requiredFields = form.querySelectorAll("[required]");
  requiredFields.forEach(function (field) {
    field.addEventListener("blur", function () {
      validateField(field);
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var isValid = true;
    var firstInvalid = null;

    requiredFields.forEach(function (field) {
      var fieldValid = validateField(field);
      if (!fieldValid && !firstInvalid) {
        firstInvalid = field;
      }
      isValid = isValid && fieldValid;
    });

    if (!isValid) {
      statusRegion.textContent =
        "There are errors in the form. Please review the highlighted fields.";
      statusRegion.classList.remove("is-visible");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* No backend is wired up in this skeleton; simulate a successful
       submission and confirm it accessibly. Replace with a real
       fetch()/endpoint when the site is connected to a server. */
    form.reset();
    statusRegion.textContent =
      "Thank you — your message has been sent. I will reply within 2–3 days.";
    statusRegion.classList.add("is-visible");
    statusRegion.focus();
  });
})();
