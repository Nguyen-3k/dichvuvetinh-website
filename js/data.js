/* =========================================================
   data.js - Fake Data for Services, Feedback, FAQ
   ========================================================= */

const servicesData = [
  {
    id: 'internet',
    category: 'Internet',
    title: 'Lắp đặt Internet tốc độ cao',
    shortDesc: 'Đường truyền ổn định, tối ưu Wi-Fi cho gia đình, văn phòng và cửa hàng.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
    technology: 'Fiber Optic, Router Wi-Fi 6, Mesh Wi-Fi, QoS tối ưu băng thông',
    installTime: '2 - 4 giờ sau khi khảo sát',
    price: 1200000,
    unit: 'gói cơ bản',
    priceDetails: [
      { package: 'Gói Home 150Mbps', description: 'Phù hợp căn hộ, 3-5 thiết bị', price: 1200000 },
      { package: 'Gói Pro 300Mbps', description: 'Gia đình nhiều thiết bị, học/làm online', price: 1800000 },
      { package: 'Gói Business 500Mbps', description: 'Văn phòng, cửa hàng, camera cloud', price: 2600000 }
    ]
  },
  {
    id: 'camera',
    category: 'Camera',
    title: 'Lắp đặt Camera an ninh',
    shortDesc: 'Quan sát 24/7, lưu trữ an toàn, xem từ xa qua điện thoại.',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=900&q=80',
    technology: 'Camera IP Full HD/2K, hồng ngoại, lưu trữ NVR/Cloud, AI Motion Detection',
    installTime: '3 - 6 giờ tùy số lượng mắt camera',
    price: 2500000,
    unit: 'bộ 2 mắt',
    priceDetails: [
      { package: 'Bộ 2 mắt Camera IP', description: 'Gia đình, phòng trọ, cửa hàng nhỏ', price: 2500000 },
      { package: 'Bộ 4 mắt + đầu ghi', description: 'Nhà phố, shop, kho hàng', price: 4800000 },
      { package: 'Bộ 8 mắt + lưu trữ 30 ngày', description: 'Văn phòng, nhà xưởng nhỏ', price: 8900000 }
    ]
  },
  {
    id: 'smarthome',
    category: 'SmartHome',
    title: 'Thiết lập SmartHome thông minh',
    shortDesc: 'Điều khiển đèn, rèm, cảm biến, khóa cửa và kịch bản tự động hóa.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80',
    technology: 'Zigbee, Wi-Fi IoT, Google Home, Apple HomeKit, cảm biến chuyển động/ánh sáng',
    installTime: '4 - 8 giờ theo số lượng thiết bị',
    price: 3600000,
    unit: 'gói khởi động',
    priceDetails: [
      { package: 'Starter Kit', description: 'Hub trung tâm, 3 công tắc, 2 cảm biến', price: 3600000 },
      { package: 'Comfort Kit', description: 'Đèn, rèm, cảm biến, điều khiển giọng nói', price: 6900000 },
      { package: 'Premium Kit', description: 'Tự động hóa toàn nhà, khóa cửa, an ninh', price: 12500000 }
    ]
  }
];

const feedbackData = [
  {
    name: 'Nguyễn Minh Khang',
    service: 'Internet',
    rating: 5,
    comment: 'Kỹ thuật viên đến đúng giờ, cấu hình Wi-Fi rất ổn. Trước đây phòng ngủ bị yếu sóng, giờ dùng mượt hơn nhiều.'
  },
  {
    name: 'Trần Thảo My',
    service: 'Camera',
    rating: 5,
    comment: 'Camera xem rõ cả ban đêm, app dễ dùng. Nhân viên hướng dẫn rất kỹ cách xem lại video.'
  },
  {
    name: 'Lê Quốc Huy',
    service: 'SmartHome',
    rating: 4,
    comment: 'Hệ thống đèn và cảm biến hoạt động tốt. Mình thích nhất kịch bản tự tắt đèn khi ra khỏi nhà.'
  }
];

const faqData = [
  {
    question: 'Bao lâu thì có kỹ thuật viên đến khảo sát?',
    answer: 'Thông thường chúng tôi phản hồi trong 15 phút và có thể sắp lịch khảo sát trong ngày nếu khu vực còn lịch trống.'
  },
  {
    question: 'Tôi cần cọc bao nhiêu khi đặt lịch?',
    answer: 'Bạn cần cọc 30% giá trị dịch vụ. Số tiền còn lại thanh toán sau khi nghiệm thu hệ thống.'
  },
  {
    question: 'Dịch vụ có bảo hành không?',
    answer: 'Có. Thiết bị được bảo hành theo hãng, phần kỹ thuật lắp đặt được hỗ trợ kiểm tra và bảo trì theo gói đã chọn.'
  },
  {
    question: 'Có hỗ trợ ngoài giờ hành chính không?',
    answer: 'Có. Bộ phận kỹ thuật hỗ trợ từ 08:00 đến 22:00 mỗi ngày, các ca khẩn cấp sẽ được ưu tiên xử lý.'
  }
];
