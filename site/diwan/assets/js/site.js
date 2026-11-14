// بحث فوري في صفحة المصطلحات — بلا تبعيات، ويعمل بلا JS أيضًا (نموذج GET)
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
