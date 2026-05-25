# Dịch vụ vệ tinh Website

Website demo HTML, CSS và JavaScript thuần cho dịch vụ lắp đặt, bảo trì Internet, Camera và SmartHome.

## Cấu trúc thư mục

```plaintext
dichvuvetinh-website/
│
├── index.html
├── css/
│   ├── style.css
│   ├── ui.css
│   ├── animation.css
│   └── responsive.css
│
├── js/
│   ├── script.js
│   ├── form.js
│   ├── data.js
│   └── effect.js
│
├── images/
│   ├── satellite.jpg
│   ├── gps.jpg
│   └── space.jpg
│
└── README.md
```

## Cách chạy bằng VS Code Live Server

1. Mở thư mục `dichvuvetinh-website` bằng VS Code.
2. Cài extension **Live Server** nếu chưa có.
3. Nhấn chuột phải vào `index.html`.
4. Chọn **Open with Live Server**.

## Tính năng chính

- Header responsive, menu mobile.
- Đăng nhập/đăng ký mock bằng LocalStorage.
- Avatar tự tạo từ chữ cái đầu của họ tên.
- Render danh sách dịch vụ từ `js/data.js`.
- Chuyển tab dịch vụ mượt mà.
- Modal đặt lịch lắp đặt.
- Validation form và regex số điện thoại.
- Tính tiền cọc 30% theo giá dịch vụ.
- Loading giả lập gửi API trong 2 giây.
- Toast thông báo thành công/lỗi.
- Form tư vấn riêng ở trang Liên hệ.
- Chatbox FAQ tự động trả lời.

## Ghi chú

Ảnh trong giao diện đang dùng link online từ Unsplash. Thư mục `images/` vẫn có sẵn các file placeholder để đúng cấu trúc yêu cầu.
