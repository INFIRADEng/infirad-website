/* Service picker: three options, at most one panel open.
   Without JavaScript every panel stays visible, so no content depends on it.
   No animation (Brand System v2.1 forbids motion): a panel opens in place. */
(function () {
  var root = document.querySelector('[data-picker]');
  if (!root) return;
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.svc-tab'));
  function panelOf(tab) { return document.getElementById(tab.getAttribute('aria-controls')); }
  function setOpen(active) {
    tabs.forEach(function (tab) {
      var on = tab === active;
      tab.setAttribute('aria-expanded', on ? 'true' : 'false');
      panelOf(tab).hidden = !on;
    });
  }
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      setOpen(tab.getAttribute('aria-expanded') === 'true' ? null : tab);
    });
  });
  function openFromHash() {
    var id = location.hash.slice(1);
    var tab = tabs.filter(function (t) { return t.getAttribute('aria-controls') === id; })[0];
    if (tab) { setOpen(tab); tab.scrollIntoView({ block: 'start' }); }
  }
  setOpen(null);
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
})();
