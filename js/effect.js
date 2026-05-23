/* =========================================================
   effect.js - DOM Effects, Toast, Chatbox, Modal, Header
   ========================================================= */

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  const item = document.createElement('div');
  item.className = `toast-item ${type === 'error' ? 'error' : ''}`;
  item.textContent = message;
  toast.appendChild(item);

  setTimeout(() => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(34px)';
    setTimeout(() => item.remove(), 300);
  }, 4200);
}

function addChatMessage(text, sender = 'bot') {
  const chatBody = document.getElementById('chatBody');
  if (!chatBody) return;

  const msg = document.createElement('div');
  msg.className = `chat-message ${sender}`;
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function initChatbox() {
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const faqList = document.getElementById('faqList');

  if (!chatToggle || !chatPanel || !faqList) return;

  chatToggle.addEventListener('click', () => {
    chatPanel.classList.toggle('active');
    chatPanel.setAttribute('aria-hidden', String(!chatPanel.classList.contains('active')));
  });

  closeChatBtn?.addEventListener('click', () => {
    chatPanel.classList.remove('active');
    chatPanel.setAttribute('aria-hidden', 'true');
  });

  faqList.innerHTML = faqData.map((faq, index) => `
    <button class="faq-item" data-faq-index="${index}">${faq.question}</button>
  `).join('');

  faqList.addEventListener('click', (event) => {
    const btn = event.target.closest('.faq-item');
    if (!btn) return;

    const faq = faqData[Number(btn.dataset.faqIndex)];
    if (!faq) return;

    addChatMessage(faq.question, 'user');
    setTimeout(() => addChatMessage(faq.answer, 'bot'), 420);
  });
}

function initModalCloseEvents() {
  document.addEventListener('click', (event) => {
    const closeBtn = event.target.closest('[data-close-modal]');
    if (closeBtn) closeModal(closeBtn.dataset.closeModal);

    if (event.target.classList.contains('modal-backdrop')) {
      closeModal(event.target.id);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.modal-backdrop.active').forEach((modal) => closeModal(modal.id));
  });
}

function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mainNav');
  if (!mobileBtn || !nav) return;

  mobileBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) nav.classList.remove('open');
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = 'home';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) currentId = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initChatbox();
  initModalCloseEvents();
  initMobileMenu();
  initScrollSpy();
});
