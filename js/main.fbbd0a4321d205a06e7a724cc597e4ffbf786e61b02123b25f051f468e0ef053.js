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
