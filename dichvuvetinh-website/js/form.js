/* =========================================================
   form.js - Validation, Price Calculation, Booking, Auth
   ========================================================= */

   
const PHONE_REGEX = /^(0|\+84)(\d{9,10})$/;

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);
}

function getInitials(fullName) {
  const words = fullName.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  const first = words[0][0] || '';
  const last = words[words.length - 1][0] || '';
  return `${first}${last}`.toUpperCase();
}

function setFieldError(field, message) {
  const group = field.closest('.form-group');
  const error = group?.querySelector('.error-message');
  group?.classList.add('invalid');
  if (error) error.textContent = message;
}

function clearFieldError(field) {
  const group = field.closest('.form-group');
  const error = group?.querySelector('.error-message');
  group?.classList.remove('invalid');
  if (error) error.textContent = '';
}

function validateRequired(field, message = 'Vui lòng nhập thông tin này.') {
  if (!field.value.trim()) {
    setFieldError(field, message);
    return false;
  }

  clearFieldError(field);
  return true;
}

function validatePhone(field) {
  const phone = field.value.trim();

  if (!phone) {
    setFieldError(field, 'Vui lòng nhập số điện thoại.');
    return false;
  }

  if (!PHONE_REGEX.test(phone)) {
    setFieldError(field, 'Số điện thoại chưa đúng định dạng. Ví dụ: 0912345678 hoặc +84912345678.');
    return false;
  }

  clearFieldError(field);
  return true;
}

function attachRealtimeValidation(form) {
  if (!form) return;

  form.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('input', () => clearFieldError(field));
    field.addEventListener('change', () => clearFieldError(field));
  });
}

function setButtonLoading(button, isLoading, loadingText = 'Đang xử lý...') {
  if (!button) return;

  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.classList.add('loading');
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.classList.remove('loading');
    button.disabled = false;
  }
}

function validateBookingForm() {
  const name = document.getElementById('bookingName');
  const phone = document.getElementById('bookingPhone');
  const address = document.getElementById('bookingAddress');
  const note = document.getElementById('bookingNote');

  const validName = validateRequired(name, 'Vui lòng nhập họ và tên.');
  const validPhone = validatePhone(phone);
  const validAddress = validateRequired(address, 'Vui lòng nhập địa chỉ lắp đặt.');
  const validNote = validateRequired(note, 'Vui lòng nhập ghi chú để kỹ thuật viên chuẩn bị.');

  return validName && validPhone && validAddress && validNote;
}

function openBookingModal(serviceId) {
  const service = servicesData.find((item) => item.id === serviceId);
  if (!service) return;

  const form = document.getElementById('bookingForm');
  const billSummary = document.getElementById('billSummary');

  form.reset();
  form.querySelectorAll('.form-group').forEach((group) => group.classList.remove('invalid'));
  form.querySelectorAll('.error-message').forEach((error) => error.textContent = '');
  billSummary.hidden = true;

  document.getElementById('bookingTitle').textContent = service.title;
  document.getElementById('bookingSubtitle').textContent = `${service.category} • ${service.installTime}`;
  document.getElementById('bookingServiceId').value = service.id;
  document.getElementById('bookingServicePrice').value = service.price;
  document.getElementById('bookingBasePrice').textContent = formatCurrency(service.price);

  openModal('bookingModal');
}

function calculateDeposit() {
  if (!validateBookingForm()) {
    showToast('Vui lòng kiểm tra lại thông tin đặt lịch.', 'error');
    return;
  }

  const serviceId = document.getElementById('bookingServiceId').value;
  const service = servicesData.find((item) => item.id === serviceId);
  if (!service) return;

  // Công thức tính tiền cọc: 30% x giá dịch vụ gốc.
  // Math.round dùng để tránh số lẻ nếu giá dịch vụ thay đổi trong tương lai.
  const deposit = Math.round(service.price * 0.3);

  document.getElementById('billServiceName').textContent = service.title;
  document.getElementById('billPrice').textContent = formatCurrency(service.price);
  document.getElementById('billDeposit').textContent = formatCurrency(deposit);
  document.getElementById('billSummary').hidden = false;
}

function initBookingForm() {
  const bookingForm = document.getElementById('bookingForm');
  const calculateBtn = document.getElementById('calculateDepositBtn');
  const confirmBtn = document.getElementById('confirmBookingBtn');

  attachRealtimeValidation(bookingForm);

  calculateBtn?.addEventListener('click', calculateDeposit);

  bookingForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateBookingForm()) {
      showToast('Vui lòng kiểm tra lại thông tin đặt lịch.', 'error');
      return;
    }

    const serviceId = document.getElementById('bookingServiceId').value;
    const service = servicesData.find((item) => item.id === serviceId);
    if (!service) return;

    // Tính lại tiền cọc ở bước xác nhận để đảm bảo dữ liệu không bị sửa từ giao diện.
    const deposit = Math.round(service.price * 0.3);

    setButtonLoading(confirmBtn, true, 'Đang gửi yêu cầu');

    // Giả lập gọi API thanh toán/booking trong 2 giây.
    setTimeout(() => {
      setButtonLoading(confirmBtn, false);
      closeModal('bookingModal');
      showToast(
        `Yêu cầu thành công! Chúng tôi đã nhận thông tin và sẽ liên hệ trong 15 phút. Bạn cần chuẩn bị ${formatCurrency(deposit)} cho nhân viên.`
      );
    }, 2000);
  });
}

function initConsultForm() {
  const form = document.getElementById('consultForm');
  if (!form) return;

  attachRealtimeValidation(form);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('consultName');
    const phone = document.getElementById('consultPhone');
    const area = document.getElementById('consultArea');
    const need = document.getElementById('consultNeed');
    const submitBtn = form.querySelector('button[type="submit"]');

    const isValid = [
      validateRequired(name, 'Vui lòng nhập họ và tên.'),
      validatePhone(phone),
      validateRequired(area, 'Vui lòng nhập khu vực cần hỗ trợ.'),
      validateRequired(need, 'Vui lòng chọn nhu cầu tư vấn.')
    ].every(Boolean);

    if (!isValid) {
      showToast('Vui lòng nhập đầy đủ thông tin tư vấn.', 'error');
      return;
    }

    setButtonLoading(submitBtn, true, 'Đang gửi');

    // Giả lập gửi form tư vấn lên server.
    setTimeout(() => {
      setButtonLoading(submitBtn, false);
      form.reset();
      showToast('Gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ trong 15 phút.');
    }, 1600);
  });
}

function renderAuthArea() {
  const authArea = document.getElementById('authArea');
  if (!authArea) return;

  const user = JSON.parse(localStorage.getItem('dvv_user') || 'null');

  if (!user) {
    authArea.innerHTML = `
      <button class="btn btn-outline btn-sm" id="openLoginBtn">Đăng nhập</button>
      <button class="btn btn-primary btn-sm" id="openRegisterBtn">Đăng ký</button>
    `;

    document.getElementById('openLoginBtn')?.addEventListener('click', () => openModal('authModal'));
    document.getElementById('openRegisterBtn')?.addEventListener('click', () => openModal('authModal'));
    return;
  }

  authArea.innerHTML = `
    <div class="user-profile">
      <span class="avatar" title="${user.fullName}">${getInitials(user.fullName)}</span>
      <span class="user-name">${user.fullName}</span>
      <button class="btn btn-outline btn-sm logout-btn" id="logoutBtn">Thoát</button>
    </div>
  `;

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('dvv_user');
    renderAuthArea();
    showToast('Bạn đã đăng xuất tài khoản demo.');
  });
}

function initAuthForm() {
  const form = document.getElementById('authForm');
  if (!form) return;

  attachRealtimeValidation(form);
  renderAuthArea();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fullName = document.getElementById('authFullName');
    const contact = document.getElementById('authPhone');

    const isValid = [
      validateRequired(fullName, 'Vui lòng nhập họ tên để tạo avatar.'),
      validateRequired(contact, 'Vui lòng nhập số điện thoại hoặc email.')
    ].every(Boolean);

    if (!isValid) return;

    localStorage.setItem('dvv_user', JSON.stringify({
      fullName: fullName.value.trim(),
      contact: contact.value.trim(),
      createdAt: new Date().toISOString()
    }));

    form.reset();
    closeModal('authModal');
    renderAuthArea();
    showToast('Đăng nhập demo thành công! Avatar đã được tạo từ họ tên của bạn.');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
  initConsultForm();
  initAuthForm();
});
