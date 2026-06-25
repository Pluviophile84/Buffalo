(() => {
  'use strict';

  const config = window.BUFFALO_CONFIG || {};
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const statusRegion = $('#siteStatus');

  const announce = (message) => {
    if (!statusRegion) return;
    statusRegion.textContent = '';
    window.setTimeout(() => { statusRegion.textContent = message; }, 10);
  };

  const hasValue = (value) => typeof value === 'string' && value.trim().length > 0;
  const launchReady = config.status === 'live'
    && hasValue(config.contractAddress)
    && hasValue(config.explorerUrl);
  const launchOnlyFacts = new Set(['totalSupply', 'mintAuthority', 'freezeAuthority', 'teamAllocation']);
  const shortAddress = (address) => address.length > 16
    ? `${address.slice(0, 7)}…${address.slice(-7)}`
    : address;

  function setMeta() {
    const isLive = launchReady;
    const description = isLive
      ? 'An American monetary symbol, carried into its next form. Paper. Nickel. Gold. Blockchain.'
      : 'An American monetary symbol, carried into its next form. Paper. Nickel. Gold. Blockchain. Buffalo ($BUFF) is currently pre-launch.';

    document.title = 'Buffalo ($BUFF) — Paper. Nickel. Gold. Blockchain.';
    const descriptionMeta = $('meta[name="description"]');
    const ogDescription = $('meta[property="og:description"]');
    const twitterDescription = $('meta[name="twitter:description"]');
    if (descriptionMeta) descriptionMeta.content = description;
    if (ogDescription) ogDescription.content = description;
    if (twitterDescription) twitterDescription.content = description;

    if (!hasValue(config.siteUrl)) return;
    const siteUrl = config.siteUrl.replace(/\/$/, '') + '/';
    let canonical = $('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    let ogUrl = $('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    canonical.href = siteUrl;
    ogUrl.content = siteUrl;
    const ogImage = $('meta[property="og:image"]');
    const twitterImage = $('meta[name="twitter:image"]');
    if (ogImage) ogImage.content = `${siteUrl}assets/images/og-buffalo.jpg`;
    if (twitterImage) twitterImage.content = `${siteUrl}assets/images/og-buffalo.jpg`;
  }

  function populateText() {
    $$('[data-config-text]').forEach((element) => {
      const key = element.dataset.configText;
      const value = config[key];
      if (launchOnlyFacts.has(key)) {
        if (launchReady) element.textContent = hasValue(value) ? value : 'Pending verification';
        return;
      }
      if (hasValue(value)) element.textContent = value;
    });

    $$('[data-contract]').forEach((element) => {
      if (launchReady) {
        element.textContent = element.dataset.contract === 'short'
          ? shortAddress(config.contractAddress)
          : config.contractAddress;
        element.classList.remove('is-pending');
      } else {
        element.textContent = element.dataset.contractPlaceholder || 'Published at launch';
        element.classList.add('is-pending');
      }
    });
  }

  function configureLinks() {
    $$('[data-link]').forEach((element) => {
      const key = element.dataset.link;
      const url = config[key];
      const launchSensitive = key === 'buyUrl' || key === 'explorerUrl';
      const live = hasValue(url) && (!launchSensitive || launchReady);

      if (live) {
        element.href = url;
        element.classList.remove('is-disabled');
        element.removeAttribute('aria-disabled');
        element.removeAttribute('tabindex');
        if (/^https?:\/\//i.test(url)) {
          element.target = '_blank';
          element.rel = 'noopener noreferrer';
        }
      } else {
        element.removeAttribute('href');
        element.removeAttribute('target');
        element.removeAttribute('rel');
        element.classList.add('is-disabled');
        element.setAttribute('aria-disabled', 'true');
        element.setAttribute('tabindex', '-1');
      }
    });
  }

  function configureMobileBuy() {
    const link = $('[data-mobile-buy]');
    if (!link) return;

    if (launchReady && hasValue(config.buyUrl)) {
      link.href = config.buyUrl;
      link.textContent = 'Buy $BUFF';
      if (/^https?:\/\//i.test(config.buyUrl)) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      return;
    }

    link.href = '#buy';
    link.textContent = 'Buy $BUFF';
    link.removeAttribute('target');
    link.removeAttribute('rel');
  }

  function configureLaunchState() {
    const isLive = launchReady;
    document.documentElement.dataset.launchState = isLive ? 'live' : 'prelaunch';

    $$('[data-state]').forEach((element) => {
      element.hidden = element.dataset.state !== (isLive ? 'live' : 'prelaunch');
    });

    $$('[data-launch-label]').forEach((element) => {
      element.textContent = isLive ? 'Live on Solana' : 'Pre-launch';
    });

    $$('[data-buy-label]').forEach((element) => {
      element.textContent = isLive
        ? (hasValue(config.buyUrl) ? 'Buy $BUFF' : 'Buy link pending')
        : 'Launch pending';
    });

    const launchState = $('#launchState');
    if (launchState) launchState.textContent = isLive ? 'Live' : 'Pre-launch';

    const contractState = $('#contractState');
    if (contractState) contractState.textContent = launchReady ? 'Published' : 'Pending launch';

    const explorerState = $('#explorerState');
    if (explorerState) explorerState.textContent = launchReady ? 'Available' : 'Pending launch';

    const buyState = $('#buyState');
    if (buyState) buyState.textContent = launchReady && hasValue(config.buyUrl) ? 'Available' : 'Pending launch';

    if (config.status === 'live' && !launchReady) {
      console.warn('Buffalo remains in pre-launch mode: live status requires both contractAddress and explorerUrl.');
    }
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.className = 'clipboard-helper';
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand('copy');
    textarea.remove();
    if (!successful) throw new Error('Copy command failed');
  }

  function setupCopyButtons() {
    $$('[data-copy-contract]').forEach((button) => {
      const enabled = launchReady;
      button.disabled = !enabled;
      button.setAttribute('aria-disabled', String(!enabled));

      button.addEventListener('click', async () => {
        if (!enabled) {
          announce('The contract address will be published at launch.');
          return;
        }

        const original = button.textContent;
        try {
          await copyText(config.contractAddress);
          button.textContent = 'Copied';
          button.classList.add('is-copied');
          announce('Contract address copied to clipboard.');
        } catch (error) {
          button.textContent = 'Copy failed';
          announce('Copy failed. Select the full contract address manually.');
        }
        window.setTimeout(() => {
          button.textContent = original;
          button.classList.remove('is-copied');
        }, 1800);
      });
    });
  }

  function setupMobileMenu() {
    const toggle = $('#navToggle');
    const menu = $('#mobileMenu');
    const main = $('#main');
    const footer = $('footer');
    if (!toggle || !menu) return;

    let lastFocused = null;

    const focusable = () => $$('a[href], button:not([disabled])', menu)
      .filter((element) => element.offsetParent !== null);

    const setOpen = (open) => {
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      menu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
      if (main) main.inert = open;
      if (footer) footer.inert = open;

      if (open) {
        lastFocused = document.activeElement;
        requestAnimationFrame(() => focusable()[0]?.focus());
      } else if (lastFocused instanceof HTMLElement) {
        lastFocused.focus();
      }
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const desktopMedia = window.matchMedia('(min-width: 861px)');
    desktopMedia.addEventListener('change', (event) => {
      if (event.matches && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
    });
  }

  function setupCountdown() {
    const wrap = $('#countdown');
    if (!wrap || launchReady || !hasValue(config.launchDate)) return;
    const target = new Date(config.launchDate).getTime();
    if (!Number.isFinite(target)) return;

    wrap.hidden = false;
    const fields = {
      days: $('[data-count="days"]', wrap),
      hours: $('[data-count="hours"]', wrap),
      minutes: $('[data-count="minutes"]', wrap),
      seconds: $('[data-count="seconds"]', wrap)
    };

    const update = () => {
      const difference = Math.max(0, target - Date.now());
      const seconds = Math.floor(difference / 1000);
      const values = {
        days: Math.floor(seconds / 86400),
        hours: Math.floor((seconds % 86400) / 3600),
        minutes: Math.floor((seconds % 3600) / 60),
        seconds: seconds % 60
      };
      Object.entries(values).forEach(([key, value]) => {
        if (fields[key]) fields[key].textContent = String(value).padStart(2, '0');
      });
      if (difference === 0) window.clearInterval(timer);
    };

    let timer = null;
    update();
    timer = window.setInterval(update, 1000);
  }

  function setYear() {
    const year = $('#currentYear');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  setMeta();
  populateText();
  configureLinks();
  configureMobileBuy();
  configureLaunchState();
  setupCopyButtons();
  setupMobileMenu();
  setupCountdown();
  setYear();
})();
