/* GA4 basic consent mode: Google is contacted only after analytics consent. */
(() => {
  'use strict';
  const measurementId = 'G-LB7V6EDNGB';
  const storageKey = 'mn-analytics-consent-v1';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const disableKey = 'ga-disable-' + measurementId;
  const uk = document.documentElement.lang === 'uk';
  const copy = uk ? {
    title: 'Аналітика відвідувань',
    text: 'Дозволити Google Analytics використовувати cookies для статистики відвідувань сайту? Вибір можна змінити внизу сторінки.',
    accept: 'Дозволити', reject: 'Відхилити', settings: 'Налаштування cookies',
    details: 'Докладніше',
    privacy: 'Після вашої згоди Google отримуватиме дані про переглянуті сторінки, взаємодії, пристрій та приблизне місцезнаходження. Рекламна персоналізація вимкнена. Аналітичні cookies та ваш вибір зберігаються до 180 днів. Відмовитися можна будь-коли через «Налаштування cookies». Запитання: politics.sumdu@gmail.com.',
    google: 'Як Google використовує дані'
  } : {
    title: 'Website analytics',
    text: 'Allow Google Analytics cookies to measure visits to this website? You can change your choice at the bottom of any page.',
    accept: 'Allow', reject: 'Decline', settings: 'Cookie settings',
    details: 'Details',
    privacy: 'With your consent, Google receives data about page views, interactions, your device and approximate location. Advertising personalisation is disabled. Analytics cookies and your choice are stored for up to 180 days. You can withdraw consent at any time using Cookie settings. Questions: politics.sumdu@gmail.com.',
    google: 'How Google uses data'
  };

  let choice = null;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved && ['granted', 'denied'].includes(saved.value) && saved.expires > Date.now()) choice = saved.value;
  } catch (_) { /* If storage is unavailable, ask on each page. */ }

  window[disableKey] = choice !== 'granted';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });
  let loaded = false;
  function enableAnalytics() {
    window[disableKey] = false;
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    if (loaded) return;
    loaded = true;
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: lifetime / 1000,
      cookie_update: false,
      page_location: location.origin + location.pathname,
      page_referrer: document.referrer.split(/[?#]/)[0]
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.append(script);
  }

  function clearAnalyticsCookies() {
    const domains = ['', location.hostname, '.' + location.hostname];
    if (location.hostname.endsWith('.mykola-nazarov.com')) domains.push('.mykola-nazarov.com');
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.trim().split('=')[0];
      if (name !== '_ga' && !name.startsWith('_ga_')) return;
      domains.forEach(domain => {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax' + (domain ? '; domain=' + domain : '');
      });
    });
  }

  const panel = document.createElement('section');
  panel.className = 'analytics-consent';
  panel.setAttribute('aria-labelledby', 'analytics-consent-title');
  panel.hidden = choice !== null;
  panel.innerHTML = '<div class="analytics-consent-copy"><h2 id="analytics-consent-title"></h2><p></p><details><summary></summary><p></p><a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer"></a></details></div><div class="analytics-consent-actions"><button type="button" data-consent="denied"></button><button type="button" data-consent="granted"></button></div>';
  panel.querySelector('h2').textContent = copy.title;
  panel.querySelector('p').textContent = copy.text;
  panel.querySelector('summary').textContent = copy.details;
  panel.querySelector('details p').textContent = copy.privacy;
  panel.querySelector('a').textContent = copy.google;
  panel.querySelector('[data-consent="denied"]').textContent = copy.reject;
  panel.querySelector('[data-consent="granted"]').textContent = copy.accept;

  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'analytics-settings';
  settings.textContent = copy.settings;
  settings.setAttribute('aria-controls', 'analytics-consent');
  settings.setAttribute('aria-expanded', String(!panel.hidden));
  panel.id = 'analytics-consent';
  settings.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    settings.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) panel.querySelector('button').focus();
  });
  panel.querySelectorAll('[data-consent]').forEach(button => button.addEventListener('click', () => {
    const value = button.dataset.consent;
    try { localStorage.setItem(storageKey, JSON.stringify({ value, expires: Date.now() + lifetime })); } catch (_) {}
    choice = value;
    panel.hidden = true;
    settings.setAttribute('aria-expanded', 'false');
    settings.focus({ preventScroll: true });
    if (value === 'granted') {
      enableAnalytics();
    } else {
      window[disableKey] = true;
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
      clearAnalyticsCookies();
      // Unload an already-running tag after withdrawal; the next page stays untracked.
      if (loaded) location.reload();
    }
  }));
  const settingsContainer = document.createElement('div');
  settingsContainer.className = 'analytics-settings-container';
  settingsContainer.append(settings);
  document.body.append(settingsContainer, panel);
  // Keep already-open language/CV tabs aligned when consent changes in another tab.
  window.addEventListener('storage', event => {
    if (event.key === storageKey) {
      window[disableKey] = true;
      location.reload();
    }
  });
  if (choice === 'granted') enableAnalytics();
  else clearAnalyticsCookies();
})();
