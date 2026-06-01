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
                <th style="width: 60px; text-align: center;">Chọn</th>
                <th>Gói dịch vụ</th>
                <th>Mô tả</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              ${service.priceDetails.map((item, index) => `
                <tr style="cursor: pointer;" onclick="document.getElementById('pkg_${index}').checked = true;">
                  <td style="text-align: center;">
                    <input type="radio" name="selectedPackage" id="pkg_${index}" value="${index}" ${index === 0 ? 'checked' : ''} style="cursor: pointer; transform: scale(1.2);">
                  </td>
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
  // 1. Đổi màu nút Tab
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === serviceId);
  });

  // 2. Render nội dung
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
    // Chuyển hướng sang trang dịch vụ kèm parameter
    window.location.href = `dich-vu.html?service=${serviceId}`;
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

// Khởi chạy các hàm khi HTML load xong
document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedServices();
  renderFeedback();
  initTabs();
  initFeaturedClick();

  // Đọc tham số trên thanh URL và tự động mở đúng tab đó
  if (document.getElementById('serviceDetail')) {
    const urlParams = new URLSearchParams(window.location.search);
    const activeService = urlParams.get('service') || 'internet'; 
    setActiveTab(activeService);
  }
});