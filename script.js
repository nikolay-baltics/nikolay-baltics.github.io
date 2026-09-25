'use strict';
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    menu.focus();
  }
});
const yearFilter = document.querySelector('#year-filter');
const topicFilter = document.querySelector('#topic-filter');
const publications = [...document.querySelectorAll('.publication')];
function filterPublications() {
  let visible = 0;
  for (const publication of publications) {
    const matches = (yearFilter.value === 'all' || publication.dataset.year === yearFilter.value) && (topicFilter.value === 'all' || publication.dataset.topic === topicFilter.value);
    publication.hidden = !matches;
    if (matches) visible++;
  }
  for (const group of document.querySelectorAll('.publication-group')) {
    group.hidden = ![...group.querySelectorAll('.publication')].some(publication => !publication.hidden);
  }
  const ukrainian = document.documentElement.lang === 'uk';
  const forms = {one: 'публікація', few: 'публікації', many: 'публікацій', other: 'публікації'};
  const noun = ukrainian ? forms[new Intl.PluralRules('uk').select(visible)] : (visible === 1 ? 'publication' : 'publications');
  document.querySelector('#result-count').textContent = `${visible} ${noun}`;
  document.querySelector('.empty-state').hidden = visible > 0;
}
yearFilter.addEventListener('change', filterPublications);
topicFilter.addEventListener('change', filterPublications);
document.querySelector('#reset-filters').addEventListener('click', () => {
  yearFilter.value = 'all'; topicFilter.value = 'all'; filterPublications(); yearFilter.focus();
});
document.querySelector('.filters').hidden = false;
filterPublications();
document.querySelector('#copyright-year').textContent = new Date().getFullYear();
