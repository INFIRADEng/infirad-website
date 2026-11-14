// بحث فوري في صفحة المصطلحات — بلا تبعيات، ويعمل بلا JS أيضًا (نموذج GET)
(function () {
  var back = document.querySelector("[data-back]");
  if (!back || !document.referrer || window.history.length < 2) return;
  back.addEventListener("click", function (event) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.back();
  });
})();

(function () {
  var input = document.getElementById("q");
  var grid = document.getElementById("terms-grid");
  if (!input || !grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
  var empty = document.getElementById("no-results");

  function norm(s) {
    return String(s || "")
      .replace(/[\u064B-\u0652\u0670\u06D6-\u06ED]/g, "") // تشكيل
      .replace(/[أإآٱ]/g, "ا")
      .replace(/ى/g, "ي")
      .replace(/ة/g, "ه")
      .toLowerCase()
      .trim();
  }

  var data = cards.map(function (c) {
    return { el: c, text: norm(c.textContent) };
  });

  // prefill from ?q=
  var params = new URLSearchParams(location.search);
  if (params.get("q")) input.value = params.get("q");

  function apply() {
    var q = norm(input.value);
    var shown = 0;
    data.forEach(function (row) {
      var hit = !q || row.text.indexOf(q) !== -1;
      row.el.hidden = !hit;
      if (hit) shown++;
    });
    if (empty) empty.hidden = shown !== 0;
  }

  input.addEventListener("input", apply);
  apply();
})();

// نسخ الاستشهاد (APA/BibTeX): navigator.clipboard مع سقوط إلى selection.
(function () {
  var buttons = document.querySelectorAll("[data-copy]");
  if (!buttons.length) return;
  function fallback(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    done(ok);
  }
  Array.prototype.forEach.call(buttons, function (btn) {
    btn.addEventListener("click", function () {
      var node = document.getElementById(btn.getAttribute("data-copy"));
      if (!node) return;
      var text = node.textContent;
      function mark(ok) {
        btn.textContent = ok ? "نُسخ" : "تعذّر النسخ";
        btn.classList.toggle("copied", ok);
        setTimeout(function () {
          btn.textContent = "نسخ";
          btn.classList.remove("copied");
        }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { mark(true); },
          function () { fallback(text, mark); });
      } else {
        fallback(text, mark);
      }
    });
  });
})();
