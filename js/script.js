/* =========================================================
   script.js - Main Logic, Tab Navigation, Render Data
   ========================================================= */

function renderFeaturedServices() {
  const wrapper = document.getElementById('featuredServices');
  if (!wrapper) return;

  wrapper.innerHTML = servicesData.map((service) => `
    <article class="service-card" data-service-card="${service.id}" tabindex="0">
      <img src="${service.image}" alt="${service.title}" />
      <div class="service-card-body">
        <span class="service-badge">${service.category}</span>
        <h3>${service.title}</h3>
        <p>${service.shortDesc}</p>
        <div class="service-price">
          <strong>${formatCurrency(service.price)}</strong>
          <span>/${service.unit}</span>
        </div>
      </div>
    </article>
  `).join('');
}

function renderServiceDetail(serviceId) {
  const service = servicesData.find((item) => item.id === serviceId) || servicesData[0];
  const detail = document.getElementById('serviceDetail');
  if (!detail) return;

  detail.classList.remove('active');

  setTimeout(() => {
    detail.innerHTML = `
      <article class="service-detail-card">
        <img src="${service.image}" alt="${service.title}" />
        <div class="service-detail-content">
          <span class="service-badge">${service.category}</span>
          <h3>${service.title}</h3>
          <p>${service.shortDesc}</p>

          <div class="info-pills">
            <span class="info-pill">Công nghệ: ${service.technology}</span>
            <span class="info-pill">Thời gian: ${service.installTime}</span>
          </div>

          <table class="price-table">
            <thead>
              <tr>
                <th>Gói dịch vụ</th>
                <th>Mô tả</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              ${service.priceDetails.map((item) => `
                <tr>
                  <td>${item.package}</td>
                  <td>${item.description}</td>
                  <td>${formatCurrency(item.price)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <button class="btn btn-primary" onclick="openBookingModal('${service.id}')">
            Chọn dịch vụ này
          </button>
        </div>
      </article>
    `;

    detail.classList.add('active');
  }, 120);
}

function setActiveTab(serviceId) {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === serviceId);
  });

  renderServiceDetail(serviceId);
}

function initTabs() {
  const tabControls = document.querySelector('.tab-controls');
  if (!tabControls) return;

  tabControls.addEventListener('click', (event) => {
    const btn = event.target.closest('.tab-btn');
    if (!btn) return;
    setActiveTab(btn.dataset.tab);
  });
}

function initFeaturedClick() {
  const wrapper = document.getElementById('featuredServices');
  if (!wrapper) return;

  function goToService(serviceId) {
    setActiveTab(serviceId);
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  wrapper.addEventListener('click', (event) => {
    const card = event.target.closest('[data-service-card]');
    if (!card) return;
    goToService(card.dataset.serviceCard);
  });

  wrapper.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const card = event.target.closest('[data-service-card]');
    if (!card) return;
    goToService(card.dataset.serviceCard);
  });
}

function initHeaderServiceLinks() {
  document.querySelectorAll('[data-tab-link]').forEach((link) => {
    link.addEventListener('click', () => {
      const serviceId = link.dataset.tabLink;
      setTimeout(() => setActiveTab(serviceId), 120);
    });
  });
}

function renderFeedback() {
  const wrapper = document.getElementById('feedbackList');
  if (!wrapper) return;

  wrapper.innerHTML = feedbackData.map((item) => `
    <article class="feedback-card">
      <div class="feedback-top">
        <span class="feedback-avatar">${getInitials(item.name)}</span>
        <div>
          <h3>${item.name}</h3>
          <p>${item.service}</p>
        </div>
      </div>
      <p>“${item.comment}”</p>
      <div class="stars" aria-label="${item.rating} sao">
        ${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
      </div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedServices();
  renderServiceDetail('internet');
  renderFeedback();
  initTabs();
  initFeaturedClick();
  initHeaderServiceLinks();
});
