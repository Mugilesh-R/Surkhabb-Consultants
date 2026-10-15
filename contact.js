/* CONTACT PAGE — form validation & submission */

/* ---------------------------------------------------------------
   EMAIL DELIVERY
   A static site has no server of its own, so FormSubmit
   (formsubmit.co) delivers the enquiries for us: the form is POSTed
   to their endpoint in the background and they email it on. No mail
   application is ever opened for the visitor.

   Enquiries are delivered to the inbox in FORM_RECIPIENT below.
   FormSubmit asks for a one-time activation on a new address: the
   first submission triggers an "Activate Form" email to that inbox,
   and deliveries start once the link in it is clicked. To deliver to a
   different inbox, change FORM_RECIPIENT, then open that inbox once
   and click the activation link.

   Note: the page must be opened over http(s). FormSubmit cannot
   deliver from a page opened directly as a file (file://), so the
   manual routes below stay available as a safety net.
   --------------------------------------------------------------- */
const FORM_RECIPIENT = "chawla171@gmail.com";
const FORM_ENDPOINT = "https://formsubmit.co/ajax/" + FORM_RECIPIENT;

/* The address shown on the page for visitors who prefer to email us. */
const RECIPIENT_EMAIL = "chawla171@gmail.com";

const PHONE_PATTERN = /^(\+91)?[6-9]\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

/* Some mail clients truncate very long mailto: links, so we copy instead. */
const MAX_MAILTO_LENGTH = 1800;

/* How long we wait for the clipboard promise before using execCommand instead. */
const COPY_RESCUE_MS = 1200;

/* How long we wait for the form service before offering the manual routes. */
const SEND_TIMEOUT_MS = 15000;

/* Longest service name we will echo from ?service= into the message box. */
const MAX_SERVICE_LENGTH = 80;

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");
const mailFallback = document.getElementById("mailFallback");
const copyMessageBtn = document.getElementById("copyMessageBtn");
const openMailBtn = document.getElementById("openMailBtn");
const copyStatus = document.getElementById("copyStatus");

const SUBMIT_BUTTON_LABEL = submitBtn ? submitBtn.textContent.trim() : "Submit";

let lastMailtoUrl = "";
let lastEnquiryText = "";
let sendInFlight = false;

const contactFields = [
  {
    id: "name",
    validate(value) {
      if (!value) return "Please enter your name.";
      if (value.length < 2) return "Name must be at least 2 characters.";
      return "";
    }
  },
  {
    id: "email",
    validate(value) {
      if (!value) return "Please enter your email address.";
      if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email address.";
      return "";
    }
  },
  {
    id: "phone",
    validate(value) {
      if (!value) return "Please enter your phone number.";
      if (!PHONE_PATTERN.test(value.replace(/[\s-]/g, ""))) {
        return "Enter a valid 10-digit mobile number (e.g. 9876543210).";
      }
      return "";
    }
  },
  {
    id: "message",
    validate(value) {
      if (!value) return "Please tell us how we can help you.";
      if (value.length < 10) return "Message must be at least 10 characters.";
      return "";
    }
  }
];

function showFieldError(id, message) {
  const input = document.getElementById(id);
  const error = document.getElementById(id + "Error");
  if (!input || !error) return;

  error.textContent = message;
  input.classList.toggle("input-error", Boolean(message));

  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

function validateField(field) {
  const input = document.getElementById(field.id);
  if (!input) return true;

  const message = field.validate(input.value.trim());
  showFieldError(field.id, message);
  return !message;
}

function setFormStatus(message, type) {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = type ? "form-status " + type : "form-status";
}

function setCopyStatus(message, type) {
  if (!copyStatus) return;
  copyStatus.textContent = message;
  copyStatus.className = type ? "copy-status " + type : "copy-status";
}

function showFallback() {
  if (!mailFallback) return;
  mailFallback.hidden = false;
}

function hideFallback() {
  if (!mailFallback) return;
  mailFallback.hidden = true;
  setCopyStatus("", "");
}

function buildMailtoUrl(subject, body) {
  return (
    "mailto:" + RECIPIENT_EMAIL +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(body)
  );
}

function buildEnquiryText(subject, body) {
  return "To: " + RECIPIENT_EMAIL + "\r\nSubject: " + subject + "\r\n\r\n" + body;
}

/* navigator.clipboard is unavailable on insecure origins (file://, plain http),
   so we fall back to the old textarea + execCommand trick. */
function legacyCopy(text) {
  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.top = "-1000px";
  document.body.appendChild(helper);
  helper.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(helper);
  return copied;
}

function copyText(text) {
  return new Promise(resolve => {
    let settled = false;
    const done = copied => {
      if (settled) return;
      settled = true;
      resolve(copied);
    };

    /* Browsers can leave clipboard promises pending (for example while a
       permission prompt is unanswered), so we never wait forever. */
    const rescue = setTimeout(() => {
      if (!settled) done(legacyCopy(text));
    }, COPY_RESCUE_MS);

    const finish = copied => {
      clearTimeout(rescue);
      done(copied);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => finish(true))
        .catch(() => finish(legacyCopy(text)));
    } else {
      finish(legacyCopy(text));
    }
  });
}

function openMailApp() {
  if (!lastMailtoUrl) return false;

  /* Long enquiries would be cut short by the mail app, so we copy instead. */
  if (lastMailtoUrl.length > MAX_MAILTO_LENGTH) {
    setCopyStatus(
      "This enquiry is too long for an email-app link — please use “Copy my enquiry” instead.",
      "error"
    );
    return false;
  }

  window.location.href = lastMailtoUrl;
  return true;
}

function setSending(isSending) {
  sendInFlight = isSending;
  if (!submitBtn) return;

  submitBtn.disabled = isSending;
  submitBtn.textContent = isSending ? "Sending…" : SUBMIT_BUTTON_LABEL;
}

/* Posts the enquiry to FormSubmit, which emails it on to FORM_RECIPIENT. */
function sendEnquiry(payload) {
  return new Promise((resolve, reject) => {
    let finished = false;
    const controller = typeof AbortController === "function" ? new AbortController() : null;

    const timer = setTimeout(() => {
      if (finished) return;
      finished = true;
      if (controller) controller.abort();
      const error = new Error("Timed out");
      error.kind = "timeout";
      reject(error);
    }, SEND_TIMEOUT_MS);

    const settle = (callback, value) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      callback(value);
    };

    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    })
      .then(response => {
        if (!response.ok) {
          const error = new Error("HTTP " + response.status);
          error.kind = "service";
          throw error;
        }
        return response.json().catch(() => ({}));
      })
      .then(body => {
        /* FormSubmit answers with success:"true" / success:"false" (strings). */
        const rejected = body && (body.success === false || body.success === "false");
        if (rejected) {
          const error = new Error((body && body.message) || "Rejected by the form service");
          error.kind = "service";
          error.serviceMessage = (body && body.message) || "";
          throw error;
        }
        settle(resolve, true);
      })
      .catch(error => {
        /* Anything without one of our own kinds came from the network layer. */
        if (error && !error.kind) error.kind = "network";
        settle(reject, error);
      });
  });
}

/* The services page links here as contact.html?service=<name>, so an enquiry
   starts with whatever the visitor was reading about. The value is treated as
   plain text: it is never inserted as HTML, control characters are stripped and
   its length is capped. */
function prefillFromQuery(search) {
  const messageInput = document.getElementById("message");
  if (!messageInput || messageInput.value) return "";

  const match = /[?&]service=([^&]*)/.exec(search || "");
  if (!match) return "";

  let service;
  try {
    service = decodeURIComponent(match[1].replace(/\+/g, " "));
  } catch (error) {
    return "";
  }

  service = service.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, MAX_SERVICE_LENGTH);
  if (!service) return "";

  messageInput.value = "I would like to know more about: " + service + ".";
  return service;
}

prefillFromQuery(window.location.search);

contactFields.forEach(field => {
  const input = document.getElementById(field.id);
  if (!input) return;

  input.addEventListener("blur", () => validateField(field));

  input.addEventListener("input", () => {
    if (input.classList.contains("input-error")) validateField(field);
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (sendInFlight) return; /* a double click must not send twice */

  setFormStatus("", "");
  hideFallback();

  const invalidFields = contactFields.filter(field => !validateField(field));

  if (invalidFields.length) {
    setFormStatus("Please correct the highlighted fields and submit again.", "error");

    const firstInvalid = document.getElementById(invalidFields[0].id);
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  /* Newlines are stripped from the subject so a pasted name cannot break the header. */
  const subject = ("Website Enquiry from " + name).replace(/[\r\n]+/g, " ");
  const body = [
    "Name: " + name,
    "Email: " + email,
    "Phone: " + phone,
    "",
    "Message:",
    message,
    "",
    "— Sent from the Surkhaab Consultants contact page"
  ].join("\n").replace(/\n/g, "\r\n");

  /* Kept ready in case the automatic delivery fails. */
  lastMailtoUrl = buildMailtoUrl(subject, body);
  lastEnquiryText = buildEnquiryText(subject, body);

  setFormStatus("Sending your enquiry…", "pending");
  setSending(true);

  sendEnquiry({
    name: name,
    email: email,
    phone: phone,
    message: message,
    _subject: subject,
    _replyto: email,
    _template: "table",
    _captcha: "false"
  })
    .then(() => {
      setSending(false);
      setFormStatus(
        "Thank you, " + name + "! Your enquiry has been sent to our team — we usually reply within the same working day.",
        "success"
      );
      contactForm.reset();
    })
    .catch(error => {
      const couldNotReach = error && (error.kind === "network" || error.kind === "timeout");

      setSending(false);
      setFormStatus(
        couldNotReach
          ? "We could not reach our mail service — please check your internet connection and try again, or send it yourself using the options below; your details are ready to copy."
          : "Something went wrong while sending your enquiry. Please send it yourself using the options below — your details are ready to copy.",
        "error"
      );

      /* Diagnostics for whoever looks after the site. */
      if (window.console && window.console.warn) {
        window.console.warn(
          "Contact form: the enquiry was not delivered automatically (" +
            ((error && error.message) || "unknown reason") + ").",
          error
        );
        if (error && /activation/i.test(error.serviceMessage || "")) {
          window.console.warn(
            "Contact form: " + FORM_RECIPIENT +
              " has not been activated yet — open that inbox and click the one-time " +
              "“Activate Form” link sent by the form service."
          );
        }
      }

      /* The manual routes only appear when the automatic delivery fails. */
      showFallback();
    });
});

if (copyMessageBtn) {
  copyMessageBtn.addEventListener("click", () => {
    if (!lastEnquiryText) return;

    copyText(lastEnquiryText).then(copied => {
      setCopyStatus(
        copied
          ? "Copied! Paste it into a new email addressed to " + RECIPIENT_EMAIL + "."
          : "Automatic copying was blocked — please select your details and copy them manually.",
        copied ? "" : "error"
      );
    });
  });
}

if (openMailBtn) {
  openMailBtn.addEventListener("click", () => {
    if (openMailApp()) {
      setCopyStatus("Your email app should open with the enquiry ready — press send there.", "");
    }
  });
}
