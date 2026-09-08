/* Show/hide ("eyeball") toggle for every password field in the tool.
 *
 * WHY A SHARED FILE: login.html, demo-login.html and review-linkedin-login.html each
 * carried their own near-identical togglePw() with a bare 128065 emoji glyph and no
 * accessible name, and the two password GATES (monthly-analytics.html, covered-call.html)
 * had no toggle at all. One script, loaded everywhere, means a fix lands once.
 *
 * WHY /static IS SAFE FOR LOGIN PAGES: backend/app.py's _check_auth returns early for
 * any path starting with /static/, so this loads before a session exists. Do not move it
 * behind an authenticated route or every login page silently loses its toggle.
 *
 * Self-applying: enhances every input[type="password"] on DOMContentLoaded and watches
 * for fields added later, so a new gate picks this up by including the script alone.
 */
(function () {
  "use strict";

  var EYE =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';

  var EYE_OFF =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>' +
    '<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>' +
    '<path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

  var STYLE_ID = "pwt-style";

  /* !important throughout, deliberately. This widget is injected into pages whose own
     CSS routinely out-specifies a bare class: #gate button {width:100%;padding:12px}
     on monthly-analytics.html and #site-gate button {width:100%;background:#ff7a59}
     on the portfolio both matched the toggle and rendered it as a full-width orange
     slab over the field. A drop-in control cannot know the host's selectors, so it
     pins the properties that decide its geometry and chrome. */
  var CSS =
    ".pwt-wrap{position:relative!important;display:block;box-sizing:border-box}" +
    ".pwt-btn{position:absolute!important;top:50%!important;right:8px!important;" +
    "left:auto!important;bottom:auto!important;transform:translateY(-50%)!important;" +
    "display:flex!important;align-items:center!important;justify-content:center!important;" +
    "box-sizing:border-box!important;width:30px!important;min-width:0!important;" +
    "max-width:none!important;height:30px!important;min-height:0!important;" +
    "padding:0!important;margin:0!important;border:0!important;border-radius:6px!important;" +
    "background:transparent!important;box-shadow:none!important;cursor:pointer!important;" +
    "color:currentColor!important;opacity:.55;letter-spacing:normal!important;" +
    "text-transform:none!important;font:inherit!important;line-height:0!important;" +
    "transition:opacity .15s;-webkit-appearance:none!important;appearance:none!important}" +
    ".pwt-btn:hover{opacity:1;background:transparent!important;transform:translateY(-50%)!important}" +
    ".pwt-btn:active{transform:translateY(-50%)!important}" +
    ".pwt-btn:focus-visible{outline:2px solid currentColor;outline-offset:1px;opacity:1}" +
    ".pwt-btn svg{display:block!important;width:18px!important;height:18px!important}" +
    ".pwt-btn::-moz-focus-inner{border:0}";

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /* Reuse a wrapper the page already provides (the three login pages ship .pw-wrap)
     rather than nesting a second one, which would double the positioning context. */
  function containerFor(input) {
    var p = input.parentElement;
    if (p && (p.classList.contains("pw-wrap") || p.classList.contains("pwt-wrap"))) {
      if (getComputedStyle(p).position === "static") p.style.position = "relative";
      return p;
    }
    // Moving a node in the DOM blurs it, which would silently kill autofocus on a gate
    // that relies on it. Put focus and caret back if we just stole them.
    var hadFocus = document.activeElement === input;
    var start = null, end = null;
    if (hadFocus) {
      try { start = input.selectionStart; end = input.selectionEnd; } catch (e) { /* ignore */ }
    }
    /* If the input is a flex item, the new wrapper becomes the flex item instead and the
       input's own flex sizing stops applying. The portfolio site gate is exactly this:
       #site-gate input[type=password]{flex:1} inside a display:flex .input-row, which
       would collapse to intrinsic width. Carry the sizing out to the wrapper. */
    var pcs = getComputedStyle(p);
    var isFlexItem = pcs.display === "flex" || pcs.display === "inline-flex";
    var ics = getComputedStyle(input);

    var wrap = document.createElement("span");
    wrap.className = "pwt-wrap";
    if (isFlexItem) {
      wrap.style.flexGrow = ics.flexGrow;
      wrap.style.flexShrink = ics.flexShrink;
      wrap.style.flexBasis = ics.flexBasis;
      wrap.style.alignSelf = ics.alignSelf;
      wrap.style.minWidth = "0";
      input.style.flex = "1 1 auto";
      input.style.width = "100%";
    }
    p.insertBefore(wrap, input);
    wrap.appendChild(input);
    if (hadFocus) {
      input.focus();
      if (start !== null) {
        try { input.setSelectionRange(start, end); } catch (e) { /* ignore */ }
      }
    }
    return wrap;
  }

  function setState(input, btn, shown) {
    // Preserve the caret: changing .type collapses the selection in Safari and Firefox.
    var start = null, end = null;
    try { start = input.selectionStart; end = input.selectionEnd; } catch (e) { /* not selectable */ }
    input.type = shown ? "text" : "password";
    btn.innerHTML = shown ? EYE_OFF : EYE;
    btn.setAttribute("aria-pressed", shown ? "true" : "false");
    var label = shown ? "Hide password" : "Show password";
    btn.setAttribute("aria-label", label);
    btn.title = label;
    if (start !== null) {
      try { input.setSelectionRange(start, end); } catch (e) { /* ignore */ }
    }
  }

  function enhance(input) {
    if (input.dataset.pwtDone) return;
    input.dataset.pwtDone = "1";

    var wrap = containerFor(input);
    var btn = document.createElement("button");
    btn.type = "button";           // inside a <form> a bare button submits it
    btn.className = "pwt-btn";
    btn.tabIndex = 0;

    // Keep typed text clear of the button. Only widen the padding, never shrink it.
    var pr = parseFloat(getComputedStyle(input).paddingRight) || 0;
    if (pr < 42) input.style.paddingRight = "42px";

    setState(input, btn, false);

    btn.addEventListener("click", function () {
      setState(input, btn, input.type === "password");
      input.focus();
    });

    wrap.appendChild(btn);
  }

  function scan(root) {
    var nodes = (root || document).querySelectorAll('input[type="password"]');
    if (nodes.length) injectStyle();
    Array.prototype.forEach.call(nodes, enhance);
  }

  function init() {
    scan(document);
    // Gates and modals can mount their field after load, so keep watching.
    if (window.MutationObserver) {
      new MutationObserver(function () { scan(document); })
        .observe(document.documentElement, {childList: true, subtree: true});
    }
    // Astro's ClientRouter (portfolio site) swaps the document on navigation without
    // re-running head scripts. No-op anywhere the event is never fired.
    document.addEventListener("astro:page-load", function () { scan(document); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.PwToggle = {refresh: function () { scan(document); }};
})();
