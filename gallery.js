"use strict";
(() => {
  const links = [...document.querySelectorAll('[data-gallery-item]')];
  const dialog = document.querySelector('.photo-viewer');
  if (!dialog || !links.length || typeof dialog.showModal !== 'function') return;
  const photo = dialog.querySelector('.photo-viewer-image');
  const counter = dialog.querySelector('.photo-viewer-count');
  const closeButton = dialog.querySelector('.photo-viewer-close');
  let current = 0;
  let trigger = null;
  let originalOverflow = '';
  function showPhoto(index) {
    current = (index + links.length) % links.length;
    const thumbnail = links[current].querySelector('img');
    photo.src = links[current].href;
    photo.alt = thumbnail.alt;
    counter.textContent = `${current + 1} / ${links.length}`;
  }
  links.forEach((link, index) => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      showPhoto(index);
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      closeButton.focus();
    });
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.querySelector('.photo-viewer-prev').addEventListener('click', () => showPhoto(current - 1));
  dialog.querySelector('.photo-viewer-next').addEventListener('click', () => showPhoto(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPhoto(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let backdropPress = false;
  dialog.addEventListener('pointerdown', event => { backdropPress = event.target === dialog; });
  dialog.addEventListener('click', event => {
    if (backdropPress && event.target === dialog) dialog.close();
    backdropPress = false;
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = originalOverflow;
    photo.removeAttribute('src');
    if (trigger) trigger.focus({preventScroll:true});
  });
})();
