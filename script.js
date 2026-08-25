document.documentElement.classList.add('js');

const WHATSAPP_NUMBER = '5535984735176';

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-media img');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setMenu(open, returnFocus = false) {
  if (!menuButton || !navigation || !header) return;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('open', open);
  header.classList.toggle('menu-active', open);
  document.body.classList.toggle('menu-open', open);
  if (open) window.requestAnimationFrame(() => navLinks[0]?.focus());
  else if (returnFocus) menuButton.focus();
}

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  setMenu(!isOpen, isOpen);
});
navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !document.body.classList.contains('modal-open') && !document.body.classList.contains('whatsapp-open')) setMenu(false, true);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 1020) setMenu(false);
  updateHeader();
});

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 24);
  if (!heroImage || !hero) return;
  if (reducedMotion.matches || window.innerWidth <= 1020) {
    heroImage.style.removeProperty('--hero-shift');
    return;
  }
  const shift = Math.max(-46, -window.scrollY * 0.06);
  heroImage.style.setProperty('--hero-shift', `${shift}px`);
}

function setActiveLink(current) {
  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => { updateHeader(); ticking = false; });
}, { passive: true });

if ('IntersectionObserver' in window) {
  const navigationObserver = new IntersectionObserver((entries) => {
    const visible = entries.find((entry) => entry.isIntersecting);
    if (visible) setActiveLink(visible.target.id);
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach((section) => navigationObserver.observe(section));
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      instance.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const modalityTabs = [...document.querySelectorAll('.modality-tab')];
const modalityPanels = [...document.querySelectorAll('.modality-panel')];
const modalityFactTitle = document.querySelector('#modality-fact-title');
const modalityFactType = document.querySelector('#modality-fact-type');
const modalityFactLevel = document.querySelector('#modality-fact-level');
const modalityFactFocus = document.querySelector('#modality-fact-focus');
const modalityFactGuidance = document.querySelector('#modality-fact-guidance');
const modalityFactSummary = document.querySelector('#modality-fact-summary');

function selectModality(index, moveFocus = false) {
  if (!modalityTabs.length || !modalityPanels.length) return;
  const selectedIndex = (index + modalityTabs.length) % modalityTabs.length;
  modalityTabs.forEach((tab, tabIndex) => {
    const isSelected = tabIndex === selectedIndex;
    tab.classList.toggle('is-active', isSelected);
    tab.setAttribute('aria-selected', String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });
  modalityPanels.forEach((panel, panelIndex) => {
    const isSelected = panelIndex === selectedIndex;
    panel.classList.toggle('is-active', isSelected);
    panel.setAttribute('aria-hidden', String(!isSelected));
    panel.inert = !isSelected;
  });
  const selectedTab = modalityTabs[selectedIndex];
  if (modalityFactTitle) modalityFactTitle.textContent = selectedTab.dataset.name || '';
  if (modalityFactType) modalityFactType.textContent = selectedTab.dataset.type || '';
  if (modalityFactLevel) modalityFactLevel.textContent = selectedTab.dataset.level || '';
  if (modalityFactFocus) modalityFactFocus.textContent = selectedTab.dataset.focus || '';
  if (modalityFactGuidance) modalityFactGuidance.textContent = selectedTab.dataset.guidance || '';
  if (modalityFactSummary) modalityFactSummary.textContent = selectedTab.dataset.summary || '';
  if (moveFocus) modalityTabs[selectedIndex].focus();
}

modalityTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectModality(index));
  tab.addEventListener('keydown', (event) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') selectModality(0, true);
    else if (event.key === 'End') selectModality(modalityTabs.length - 1, true);
    else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') selectModality(index + 1, true);
    else selectModality(index - 1, true);
  });
});

selectModality(0);

const galleryItems = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.querySelector('#gallery-lightbox');
const lightboxBackdrop = lightbox?.querySelector('.lightbox-backdrop');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const lightboxCaption = lightbox?.querySelector('#lightbox-caption');
const lightboxCounter = lightbox?.querySelector('.lightbox-counter');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const lightboxPrevious = lightbox?.querySelector('.lightbox-prev');
const lightboxNext = lightbox?.querySelector('.lightbox-next');
const pageRegions = [header, document.querySelector('main'), document.querySelector('.site-footer'), document.querySelector('.whatsapp-float')].filter(Boolean);
let currentImageIndex = 0;
let galleryReturnFocus = null;
let touchStartX = 0;
let closeTimer = null;

function updateLightbox(index) {
  if (!galleryItems.length || !lightboxImage || !lightboxCaption || !lightboxCounter) return;
  currentImageIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentImageIndex];
  const image = item.querySelector('img');
  const caption = item.closest('figure')?.querySelector('figcaption')?.textContent.trim() || '';
  if (!image) return;
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = caption;
  lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryItems.length}`;
}

function openLightbox(index, trigger) {
  if (!lightbox) return;
  if (closeTimer) window.clearTimeout(closeTimer);
  setMenu(false);
  galleryReturnFocus = trigger;
  updateLightbox(index);
  lightbox.hidden = false;
  document.body.classList.add('modal-open');
  pageRegions.forEach((region) => { region.inert = true; });
  window.requestAnimationFrame(() => {
    lightbox.classList.add('is-open');
    lightboxClose?.focus();
  });
}

function closeLightbox() {
  if (!lightbox || lightbox.hidden) return;
  lightbox.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  pageRegions.forEach((region) => { region.inert = false; });
  const finishClose = () => {
    lightbox.hidden = true;
    galleryReturnFocus?.focus();
    galleryReturnFocus = null;
  };
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finishClose();
  else closeTimer = window.setTimeout(finishClose, 220);
}

galleryItems.forEach((item, index) => item.addEventListener('click', () => openLightbox(index, item)));
lightboxPrevious?.addEventListener('click', () => updateLightbox(currentImageIndex - 1));
lightboxNext?.addEventListener('click', () => updateLightbox(currentImageIndex + 1));
lightboxClose?.addEventListener('click', closeLightbox);

lightboxBackdrop?.addEventListener('click', (event) => {
  if (event.target === lightboxBackdrop) closeLightbox();
});

lightboxBackdrop?.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0]?.clientX || 0;
}, { passive: true });

lightboxBackdrop?.addEventListener('touchend', (event) => {
  const touchEndX = event.changedTouches[0]?.clientX || 0;
  const distance = touchEndX - touchStartX;
  if (Math.abs(distance) < 55) return;
  updateLightbox(currentImageIndex + (distance < 0 ? 1 : -1));
}, { passive: true });

document.addEventListener('keydown', (event) => {
  if (!lightbox || lightbox.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeLightbox();
    return;
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    updateLightbox(currentImageIndex - 1);
    return;
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    updateLightbox(currentImageIndex + 1);
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = [...lightbox.querySelectorAll('button:not([disabled])')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const whatsappDialog = document.querySelector('#whatsapp-dialog');
const whatsappBackdrop = whatsappDialog?.querySelector('.whatsapp-backdrop');
const whatsappClose = whatsappDialog?.querySelector('.whatsapp-close');
const whatsappForm = document.querySelector('#whatsapp-form');
const whatsappName = document.querySelector('#whatsapp-name');
const whatsappModality = document.querySelector('#whatsapp-modality');
const whatsappStatus = document.querySelector('.whatsapp-status');
const whatsappDirectLink = document.querySelector('.whatsapp-direct-link');
const whatsappTriggers = [...document.querySelectorAll('.js-whatsapp-trigger')];
let whatsappReturnFocus = null;
let whatsappCloseTimer = null;

function setWhatsappStatus(message = '', type = '') {
  if (!whatsappStatus) return;
  whatsappStatus.textContent = message;
  whatsappStatus.classList.toggle('is-error', type === 'error');
  whatsappStatus.classList.toggle('is-success', type === 'success');
}

function resetWhatsappFeedback() {
  setWhatsappStatus();
  if (whatsappDirectLink) {
    whatsappDirectLink.hidden = true;
    whatsappDirectLink.removeAttribute('aria-label');
  }
}

function validateWhatsappForm() {
  if (!whatsappForm || !whatsappName || !whatsappModality) return false;
  const goalFields = [...whatsappForm.querySelectorAll('input[name="goal"]')];
  const nameIsValid = whatsappName.value.trim().length > 0;
  const modalityIsValid = whatsappModality.value.length > 0;
  const selectedGoal = goalFields.find((field) => field.checked);

  whatsappName.setAttribute('aria-invalid', String(!nameIsValid));
  whatsappModality.setAttribute('aria-invalid', String(!modalityIsValid));
  goalFields.forEach((field) => field.setAttribute('aria-invalid', String(!selectedGoal)));

  if (nameIsValid && modalityIsValid && selectedGoal) return true;
  if (!nameIsValid) {
    setWhatsappStatus('Informe seu nome para continuar.', 'error');
    whatsappName.focus();
  } else if (!modalityIsValid) {
    setWhatsappStatus('Selecione a modalidade de interesse.', 'error');
    whatsappModality.focus();
  } else {
    setWhatsappStatus('Escolha o seu principal objetivo.', 'error');
    goalFields[0]?.focus();
  }
  return false;
}

function openWhatsappDialog(trigger) {
  if (!whatsappDialog) return;
  if (whatsappCloseTimer) window.clearTimeout(whatsappCloseTimer);
  setMenu(false);
  whatsappReturnFocus = trigger;
  resetWhatsappFeedback();
  const activeModality = document.querySelector('.modality-tab.is-active')?.dataset.name;
  if (whatsappModality && trigger.closest('.modality-facts') && activeModality) whatsappModality.value = activeModality;
  whatsappDialog.hidden = false;
  document.body.classList.add('whatsapp-open');
  pageRegions.forEach((region) => { region.inert = true; });
  window.requestAnimationFrame(() => {
    whatsappDialog.classList.add('is-open');
    whatsappName?.focus();
  });
}

function closeWhatsappDialog() {
  if (!whatsappDialog || whatsappDialog.hidden) return;
  whatsappDialog.classList.remove('is-open');
  document.body.classList.remove('whatsapp-open');
  pageRegions.forEach((region) => { region.inert = false; });
  const finishClose = () => {
    whatsappDialog.hidden = true;
    whatsappReturnFocus?.focus();
    whatsappReturnFocus = null;
  };
  if (reducedMotion.matches) finishClose();
  else whatsappCloseTimer = window.setTimeout(finishClose, 300);
}

whatsappTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openWhatsappDialog(trigger);
  });
});

whatsappClose?.addEventListener('click', closeWhatsappDialog);

whatsappBackdrop?.addEventListener('click', (event) => {
  if (event.target === whatsappBackdrop) closeWhatsappDialog();
});

whatsappForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateWhatsappForm()) return;
  const formData = new FormData(whatsappForm);
  const name = String(formData.get('name') || '').trim();
  const modality = String(formData.get('modality') || '').trim();
  const goal = String(formData.get('goal') || '').trim();
  const extra = String(formData.get('message') || '').trim();
  const lines = [
    `Olá, Clayton! Meu nome é ${name}.`,
    `Tenho interesse em ${modality}.`,
    `Meu principal objetivo é: ${goal}.`,
    extra ? `Informação adicional: ${extra}` : '',
    'Vim pelo site PersonalFight e gostaria de agendar uma aula inicial.'
  ].filter(Boolean);
  const destination = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  whatsappForm.querySelectorAll('[aria-invalid]').forEach((field) => field.setAttribute('aria-invalid', 'false'));
  setWhatsappStatus('Mensagem preparada. Abrindo o WhatsApp…', 'success');
  if (whatsappDirectLink) {
    whatsappDirectLink.href = destination;
    whatsappDirectLink.hidden = false;
    whatsappDirectLink.setAttribute('aria-label', 'Abrir a conversa preparada diretamente no WhatsApp');
  }
  window.open(destination, '_blank', 'noopener,noreferrer');
});

whatsappForm?.addEventListener('input', (event) => {
  if (!(event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLTextAreaElement)) return;
  event.target.setAttribute('aria-invalid', 'false');
  if (whatsappStatus?.classList.contains('is-error')) setWhatsappStatus();
});

whatsappForm?.addEventListener('change', (event) => {
  if (!(event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement)) return;
  if (event.target.name === 'goal') whatsappForm.querySelectorAll('input[name="goal"]').forEach((field) => field.setAttribute('aria-invalid', 'false'));
  else event.target.setAttribute('aria-invalid', 'false');
  if (whatsappStatus?.classList.contains('is-error')) setWhatsappStatus();
});

document.addEventListener('keydown', (event) => {
  if (!whatsappDialog || whatsappDialog.hidden) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeWhatsappDialog();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = [...whatsappDialog.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')];
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const year = document.querySelector('#current-year');
if (year) year.textContent = String(new Date().getFullYear());
updateHeader();
