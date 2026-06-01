/* =========================================================
   Khởi tạo Supabase Client
   ========================================================= */
const supabaseUrl = 'https://ohmfsbduvubcxainagfn.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9obWZzYmR1dnViY3hhaW5hZ2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNjYzNDAsImV4cCI6MjA5NTY0MjM0MH0.8cpoivQJPmna9kJlF0xZn0VQNxAy8Zhx1ZhNNuf0l0s'; 
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

/* =========================================================
   form.js - Validation, Price Calculation, Booking, Auth
   ========================================================= */

const PHONE_REGEX = /^(0|\+84)(\d{9,10})$/;

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
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
    setFieldError(field, 'Số điện thoại chưa đúng định dạng.');
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
  const validNote = validateRequired(note, 'Vui lòng nhập ghi chú.');

  return validName && validPhone && validAddress && validNote;
}

function openBookingModal(serviceId) {
  const service = servicesData.find((item) => item.id === serviceId);
  if (!service) return;

  const form = document.getElementById('bookingForm');
  form.reset();
  form.querySelectorAll('.form-group').forEach(group => group.classList.remove('invalid'));
  form.querySelectorAll('.error-message').forEach(error => error.textContent = '');

  let selectedPrice = service.price;
  let selectedTitle = service.title;
  
  const selectedRadio = document.querySelector('input[name="selectedPackage"]:checked');
  if (selectedRadio) {
    const pkgIndex = parseInt(selectedRadio.value);
    const pkgItem = service.priceDetails[pkgIndex];
    if (pkgItem) {
      selectedPrice = pkgItem.price;
      selectedTitle = `${service.title} (${pkgItem.package})`;
    }
  }

  document.getElementById('bookingTitle').textContent = selectedTitle;
  document.getElementById('bookingSubtitle').textContent = `${service.category} • ${service.installTime}`;
  document.getElementById('bookingServiceId').value = service.id;
  document.getElementById('bookingServicePrice').value = selectedPrice;
  
  const basePriceEl = document.getElementById('bookingBasePrice');
  if (basePriceEl) basePriceEl.textContent = formatCurrency(selectedPrice);

  openModal('bookingModal');
}

/* --- 1. Form Đặt Lịch --- */
function initBookingForm() {
  const bookingForm = document.getElementById('bookingForm');
  const confirmBtn = document.getElementById('confirmBookingBtn');
  attachRealtimeValidation(bookingForm);
  
  bookingForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validateBookingForm()) {
      showToast('Vui lòng kiểm tra lại thông tin.', 'error');
      return;
    }
    setButtonLoading(confirmBtn, true, 'Đang gửi yêu cầu');
    try {
      const bookingData = {
        name: document.getElementById('bookingName').value.trim(),
        phone: document.getElementById('bookingPhone').value.trim(),
        address: document.getElementById('bookingAddress').value.trim(),
        note: document.getElementById('bookingNote').value.trim(),
        service_id: document.getElementById('bookingServiceId').value,
        price: parseInt(document.getElementById('bookingServicePrice').value) || 0
      };
      const { error } = await supabaseClient.from('bookings').insert([bookingData]);
      if (error) throw error;
      closeModal('bookingModal');
      showToast('Yêu cầu thành công! Chúng tôi sẽ gọi lại trong 15 phút.');
      bookingForm.reset();
    } catch (error) {
      console.error(error);
      showToast('Có lỗi kết nối hệ thống.', 'error');
    } finally {
      setButtonLoading(confirmBtn, false);
    }
  });
}

/* --- 2. Form Tư Vấn --- */
function initConsultForm() {
  const form = document.getElementById('consultForm');
  if (!form) return;
  attachRealtimeValidation(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('consultName');
    const phone = document.getElementById('consultPhone');
    const area = document.getElementById('consultArea');
    const need = document.getElementById('consultNeed');
    const note = document.getElementById('consultNote');
    const submitBtn = form.querySelector('button[type="submit"]');

    const isValid = [
      validateRequired(name, 'Vui lòng nhập họ tên.'),
      validatePhone(phone),
      validateRequired(area, 'Vui lòng nhập khu vực.'),
      validateRequired(need, 'Vui lòng chọn nhu cầu.')
    ].every(Boolean);

    if (!isValid) { showToast('Vui lòng nhập đủ thông tin.', 'error'); return; }

    setButtonLoading(submitBtn, true, 'Đang gửi');
    try {
      const consultData = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        area: area.value.trim(),
        need: need.value,
        note: note ? note.value.trim() : ''
      };
      const { error } = await supabaseClient.from('consults').insert([consultData]);
      if (error) throw error;
      form.reset();
      showToast('Gửi yêu cầu tư vấn thành công!');
    } catch (error) {
      console.error(error);
      showToast('Không thể gửi yêu cầu lúc này.', 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

/* --- 3. Form Bảo Trì --- */
function initMaintenanceForm() {
  const form = document.getElementById('maintenanceForm');
  const submitBtn = document.getElementById('confirmMaintBtn');
  if (!form) return;
  attachRealtimeValidation(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('maintName');
    const phone = document.getElementById('maintPhone');
    const address = document.getElementById('maintAddress');
    const device = document.getElementById('maintDevice');
    const note = document.getElementById('maintNote');

    const isValid = [
      validateRequired(name, 'Vui lòng nhập họ tên.'),
      validatePhone(phone),
      validateRequired(address, 'Vui lòng nhập địa chỉ.'),
      validateRequired(device, 'Vui lòng chọn thiết bị.')
    ].every(Boolean);

    if (!isValid) { showToast('Vui lòng kiểm tra lại thông tin.', 'error'); return; }

    setButtonLoading(submitBtn, true, 'Đang gửi yêu cầu');
    try {
      const maintenanceData = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        address: address.value.trim(),
        device: device.value,
        note: note ? note.value.trim() : ''
      };
      const { error } = await supabaseClient.from('maintenances').insert([maintenanceData]);
      if (error) throw error;
      form.reset();
      closeModal('maintenanceModal');
      showToast('Gửi yêu cầu bảo trì thành công!');
    } catch (error) {
      console.error(error);
      showToast('Hệ thống đang bận. Vui lòng thử lại!', 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

/* --- 4. HỆ THỐNG ĐĂNG NHẬP / ĐĂNG KÝ (SUPABASE AUTH) --- */
function openAuthModal(mode) {
  const authModeInput = document.getElementById('authMode');
  const nameGroup = document.getElementById('nameGroup');
  const title = document.getElementById('authTitle');
  const subtitle = document.getElementById('authSubtitle');
  const submitBtn = document.getElementById('authSubmitBtn');
  const toggleText = document.getElementById('authToggleText');
  const toggleLink = document.getElementById('authToggleLink');
  const form = document.getElementById('authForm');

  if(!form) return;
  form.reset();
  form.querySelectorAll('.form-group').forEach(g => g.classList.remove('invalid'));
  authModeInput.value = mode;

  if (mode === 'register') {
    nameGroup.style.display = 'block';
    title.textContent = 'Đăng ký tài khoản';
    subtitle.textContent = 'Tạo tài khoản để theo dõi lịch sử dịch vụ.';
    submitBtn.textContent = 'Đăng ký';
    toggleText.textContent = 'Đã có tài khoản?';
    toggleLink.textContent = 'Đăng nhập ngay';
  } else {
    nameGroup.style.display = 'none';
    title.textContent = 'Đăng nhập';
    subtitle.textContent = 'Vui lòng đăng nhập để tiếp tục.';
    submitBtn.textContent = 'Đăng nhập';
    toggleText.textContent = 'Chưa có tài khoản?';
    toggleLink.textContent = 'Đăng ký ngay';
  }
  openModal('authModal');
}

// Hàm render Avatar và Nút dựa trên quyền (Role)
async function renderAuthArea() {
  const authArea = document.getElementById('authArea');
  const mainNav = document.getElementById('mainNav'); 
  if (!authArea) return;

  const { data: { session } } = await supabaseClient.auth.getSession();
  const user = session?.user;

  // QUAN TRỌNG: Quét và XÓA SẠCH bằng ID để chống nhân đôi 100%
  const oldLinks = document.querySelectorAll('#mobileAuthLink');
  oldLinks.forEach(link => link.remove());

  // 1. CHƯA ĐĂNG NHẬP
  if (!user) {
    authArea.innerHTML = `
      <button class="btn btn-outline btn-sm desktop-only-btn" id="openLoginBtn">Đăng nhập</button>
      <button class="btn btn-primary btn-sm desktop-only-btn" id="openRegisterBtn">Đăng ký</button>
      <button class="btn btn-outline btn-sm mobile-only-btn" id="openLoginMobile" style="padding: 4px 10px; font-size: 0.8rem;">Đăng nhập</button>
    `;
    
    document.getElementById('openLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
    document.getElementById('openRegisterBtn')?.addEventListener('click', () => openAuthModal('register'));
    document.getElementById('openLoginMobile')?.addEventListener('click', () => openAuthModal('login'));
    return;
  }

  // 2. ĐÃ ĐĂNG NHẬP
  const { data: profile } = await supabaseClient.from('profiles').select('role, full_name').eq('id', user.id).single();
  const role = profile?.role || 'customer';
  const fullName = profile?.full_name || user.user_metadata?.full_name || 'Khách hàng';

  // 3. LOGIC HIỂN THỊ DÀNH CHO PC VÀ MOBILE
  const isQuanLyPage = window.location.pathname.includes('quan-ly.html');
  let actionButton = '';
  let mobileNavText = '';
  let mobileNavLink = '';
  let mobileNavColor = 'var(--color-primary)';

  if (isQuanLyPage) {
    actionButton = `<a href="index.html" class="btn btn-outline btn-sm desktop-only-btn">🏠 Quay lại</a>`;
    mobileNavText = '🏠 Quay lại Trang chủ';
    mobileNavLink = 'index.html';
  } else {
    if (role === 'admin') {
      actionButton = `<a href="quan-ly.html" class="btn btn-sm desktop-only-btn" style="background: var(--color-danger); color: #fff; border: none;">🔧 Trang Admin</a>`;
      mobileNavText = '🔧 Bảng điều khiển Admin';
      mobileNavLink = 'quan-ly.html';
      mobileNavColor = 'var(--color-danger)';
    } else {
      actionButton = `<a href="quan-ly.html" class="btn btn-outline btn-sm desktop-only-btn">Lịch sử của tôi</a>`;
      mobileNavText = '📦 Lịch sử dịch vụ của tôi';
      mobileNavLink = 'quan-ly.html';
    }
  }

// 4. Bơm link quản lý vào thẳng thanh Menu 3 gạch 
  if (mainNav) {
    // DỜI LỆNH XÓA XUỐNG ĐÂY: Dọn rác ngay trước khi tạo cái mới để chống lỗi "Đua lệnh"
    const oldLinks = document.querySelectorAll('#mobileAuthLink');
    oldLinks.forEach(link => link.remove());

    const mobileLi = document.createElement('a');
    mobileLi.id = 'mobileAuthLink';
    mobileLi.className = 'nav-link mobile-only-btn'; // Gắn class để CSS quản lý
    mobileLi.href = mobileNavLink;
    mobileLi.style.color = mobileNavColor;
    mobileLi.style.fontWeight = '700';
    mobileLi.style.borderTop = '1px dashed var(--color-border)'; 
    mobileLi.style.paddingTop = '16px';
    mobileLi.style.marginTop = '8px';
    mobileLi.innerHTML = mobileNavText;
    mainNav.appendChild(mobileLi);
  }
  
  // 5. Render lại khu vực Header (Avatar + Nút Thoát thu gọn)
  authArea.innerHTML = `
    <div class="user-profile">
      <span class="avatar" title="${fullName}">${getInitials(fullName)}</span>
      <span class="user-name desktop-only-btn">${fullName}</span>
      ${actionButton}
      <button class="btn btn-outline btn-sm logout-btn" id="logoutBtn" style="padding: 4px 10px; font-size: 0.8rem;">Thoát</button>
    </div>
  `;

  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    if (window.location.pathname.includes('quan-ly.html')) {
        window.location.href = 'index.html';
    } else {
        showToast('Bạn đã đăng xuất.');
        renderAuthArea();
    }
  });
}

function initAuthForm() {
  const form = document.getElementById('authForm');
  const toggleLink = document.getElementById('authToggleLink');

  supabaseClient.auth.onAuthStateChange((event, session) => {
    renderAuthArea(); 
  });

  if (!form) return;
  attachRealtimeValidation(form);

  toggleLink?.addEventListener('click', (e) => {
    e.preventDefault();
    const currentMode = document.getElementById('authMode').value;
    openAuthModal(currentMode === 'login' ? 'register' : 'login');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const mode = document.getElementById('authMode').value;
    const fullName = document.getElementById('authFullName');
    const email = document.getElementById('authEmail');
    const password = document.getElementById('authPassword');
    const submitBtn = document.getElementById('authSubmitBtn');

    let isValid = true;
    if (mode === 'register') {
      isValid = validateRequired(fullName, 'Vui lòng nhập họ và tên.') && isValid;
    }
    isValid = validateRequired(email, 'Vui lòng nhập Email.') && isValid;
    isValid = validateRequired(password, 'Vui lòng nhập mật khẩu.') && isValid;
    
    if (password.value.length > 0 && password.value.length < 6) {
      setFieldError(password, 'Mật khẩu phải có ít nhất 6 ký tự.');
      isValid = false;
    }

    if (!isValid) return;
    setButtonLoading(submitBtn, true, 'Đang kết nối...');

    try {
      if (mode === 'register') {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email.value.trim(),
          password: password.value,
          options: { data: { full_name: fullName.value.trim() } }
        });
        if (error) throw error;
        showToast('Đăng ký thành công!');
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email.value.trim(),
          password: password.value
        });
        if (error) {
          if (error.message.includes("Invalid login")) throw new Error("Email hoặc mật khẩu không chính xác.");
          throw error;
        }
        showToast('Đăng nhập thành công!');
      }
      closeModal('authModal');
    } catch (error) {
      console.error('Lỗi Xác thực:', error);
      showToast(error.message || 'Lỗi hệ thống, vui lòng thử lại!', 'error');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
}

/* --- 5. LẮNG NGHE REAL-TIME (THỜI GIAN THỰC) CHO TÀI KHOẢN --- */
function listenToProfileChanges() {
  supabaseClient
    .channel('realtime-profiles')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'profiles' },
      async (payload) => {
        // Kiểm tra xem người bị đổi tên có phải là người đang đăng nhập trên máy này không
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user.id === payload.new.id) {
          console.log('Phát hiện dữ liệu Profile thay đổi, tự động cập nhật UI...');
          renderAuthArea(); // Gọi lại hàm vẽ Avatar để cập nhật tên mới ngay lập tức
        }
      }
    )
    .subscribe();
}

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
  initConsultForm();
  initAuthForm(); 
  initMaintenanceForm();
  listenToProfileChanges();
  
});
