"use strict";
// Keep matching section anchors when changing languages; English stays the default.
const languageLinks = [...document.querySelectorAll('[data-language-link]')];
const languagePaths = languageLinks.map(link => link.getAttribute('href'));
function updateLanguageLinks() {
  languageLinks.forEach((link, index) => { link.setAttribute('href', languagePaths[index] + window.location.hash); });
}
updateLanguageLinks();
window.addEventListener('hashchange', updateLanguageLinks);
