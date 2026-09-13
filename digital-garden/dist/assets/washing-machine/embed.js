/**
 * WashingMachineEmbed — 把 Web3D 滚筒洗衣机嵌入到任意网页的组件
 *
 * 用法 1（自动初始化）：
 *   <div data-wm-embed="demo/"></div>
 *   <script src="embed/embed.js"></script>
 *
 * 用法 2（手动初始化）：
 *   WashingMachineEmbed.init('#wm-container', { src: 'demo/', ratio: '16/9' });
 *
 * 用法 3（作为 Web Component，现代浏览器）：
 *   <washing-machine-demo src="demo/"></washing-machine-demo>
 */
(function (global) {
  'use strict';

  const defaults = {
    src: 'demo/',
    ratio: '16/9',
    minHeight: 720,
    maxHeight: 1200,
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    shadow: '0 24px 60px rgba(0,0,0,0.35)',
    background: '#0b0e13',
    title: 'Web3D 智能滚筒洗衣机交互演示',
    loadingText: '正在加载 3D 演示…',
    allowFullscreen: true,
  };

  function mergeOptions(el, options) {
    const dataset = el.dataset || {};
    return Object.assign({}, defaults, {
      src: dataset.wmEmbed || dataset.src || defaults.src,
      ratio: dataset.wmRatio || defaults.ratio,
      minHeight: Number(dataset.wmMinHeight || defaults.minHeight),
      maxHeight: Number(dataset.wmMaxHeight || defaults.maxHeight),
      borderRadius: dataset.wmBorderRadius || defaults.borderRadius,
      title: dataset.wmTitle || defaults.title,
      loadingText: dataset.wmLoadingText || defaults.loadingText,
    }, options || {});
  }

  function createIframe(opts) {
    const wrapper = document.createElement('div');
    wrapper.className = 'wm-embed-wrapper';
    wrapper.style.cssText = `
      position: relative;
      width: 100%;
      aspect-ratio: ${opts.ratio};
      min-height: ${opts.minHeight}px;
      max-height: ${opts.maxHeight}px;
      border-radius: ${opts.borderRadius};
      border: ${opts.border};
      box-shadow: ${opts.shadow};
      background: ${opts.background};
      overflow: hidden;
    `;

    const loader = document.createElement('div');
    loader.className = 'wm-embed-loader';
    loader.innerHTML = `
      <div class="wm-embed-spinner"></div>
      <div class="wm-embed-loader-text">${escapeHtml(opts.loadingText)}</div>
    `;
    loader.style.cssText = `
      position: absolute; inset: 0;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 14px; z-index: 1; color: #96a3b8; font-family: system-ui, sans-serif;
      background: radial-gradient(circle at center, rgba(46,195,229,0.06), transparent 60%);
    `;

    const iframe = document.createElement('iframe');
    iframe.className = 'wm-embed-frame';
    iframe.src = opts.src;
    iframe.title = opts.title;
    iframe.setAttribute('allowfullscreen', opts.allowFullscreen ? 'true' : 'false');
    iframe.style.cssText = `
      width: 100%; height: 100%; border: 0; display: block;
    `;

    iframe.addEventListener('load', () => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 300);
    });

    wrapper.appendChild(loader);
    wrapper.appendChild(iframe);
    return wrapper;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function init(selector, options) {
    const targets = typeof selector === 'string'
      ? document.querySelectorAll(selector)
      : selector.length !== undefined ? selector : [selector];

    Array.from(targets).forEach(el => {
      if (el._wmEmbedInit) return;
      el._wmEmbedInit = true;
      const opts = mergeOptions(el, options);
      el.innerHTML = '';
      el.appendChild(createIframe(opts));
    });
  }

  // 自动扫描 data-wm-embed
  function autoInit() {
    init('[data-wm-embed]');
  }

  // Web Component 方式
  if (global.customElements && !global.customElements.get('washing-machine-demo')) {
    class WashingMachineDemo extends global.HTMLElement {
      connectedCallback() {
        const opts = mergeOptions(this, {});
        this.innerHTML = '';
        this.appendChild(createIframe(opts));
      }
    }
    global.customElements.define('washing-machine-demo', WashingMachineDemo);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  global.WashingMachineEmbed = { init, defaults };
})(window);
