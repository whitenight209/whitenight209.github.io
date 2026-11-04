(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  function setupMermaid() {
    if (!document.body.dataset.enableMermaid || !window.mermaid) {
      return;
    }

    var mermaidBlocks = document.querySelectorAll('pre code.language-mermaid');
    mermaidBlocks.forEach(function (code) {
      var pre = code.parentElement;
      if (!pre || !pre.parentElement) {
        return;
      }

      var graph = document.createElement('div');
      graph.className = 'mermaid';
      graph.textContent = code.textContent;
      pre.parentElement.replaceChild(graph, pre);
    });

    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
      });

      window.mermaid.run({
        nodes: document.querySelectorAll('.mermaid'),
      });
    } catch (err) {
      console.error('Mermaid render failed:', err);
    }
  }

  function setupCodeCopy() {
    if (!document.body.dataset.enableCodeCopy) {
      return;
    }

    function setButtonState(button, label) {
      button.textContent = label;
      setTimeout(function () {
        button.textContent = 'Copy';
      }, 1200);
    }

    function legacyCopy(text) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();

      var ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (err) {
        ok = false;
      }

      document.body.removeChild(textarea);
      return ok;
    }

    var blocks = document.querySelectorAll('.content pre');
    blocks.forEach(function (pre) {
      if (pre.querySelector('.copy-btn')) {
        return;
      }

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-btn';
      button.textContent = 'Copy';

      button.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.innerText : pre.innerText;

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () {
            setButtonState(button, 'Copied');
          }).catch(function () {
            if (legacyCopy(text)) {
              setButtonState(button, 'Copied');
            } else {
              setButtonState(button, 'Failed');
            }
          });
          return;
        }

        if (legacyCopy(text)) {
          setButtonState(button, 'Copied');
        } else {
          setButtonState(button, 'Failed');
        }
      });

      pre.appendChild(button);
    });
  }

  function setupBackToTop() {
    var button = document.getElementById('back-to-top');
    if (!button) {
      return;
    }

    function syncVisibility() {
      if (window.scrollY > 260) {
        button.classList.add('show');
      } else {
        button.classList.remove('show');
      }
    }

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', syncVisibility, { passive: true });
    syncVisibility();
  }

  ready(function () {
    setupMermaid();
    setupCodeCopy();
    setupBackToTop();
  });
})();

(function () {
  var clock = document.getElementById('desktop-clock');
  function updateClock() {
    if (!clock) return;
    var now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    clock.dateTime = now.toISOString();
  }
  updateClock();
  if (clock) setInterval(updateClock, 30000);
  var resize = document.querySelector('.window-resize');
  if (resize) resize.addEventListener('click', function () {
    var wide = document.body.classList.toggle('window-wide');
    resize.setAttribute('aria-pressed', String(wide));
    resize.setAttribute('aria-label', wide ? '창 원래 크기로 보기' : '창 넓게 보기');
  });
  var start = document.querySelector('.start-menu');
  if (start) {
    document.addEventListener('click', function (event) { if (!start.contains(event.target)) start.open = false; });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && start.open) { start.open = false; start.querySelector('summary').focus(); }
    });
  }
})();
