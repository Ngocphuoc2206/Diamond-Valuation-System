# 💎 Diamond Valuation System

**Phần mềm quản lý định giá kim cương & thương mại điện tử ngành trang sức**

## 📖 Giới thiệu

Diamond Valuation System là hệ thống phần mềm toàn diện hỗ trợ các doanh nghiệp, cửa hàng trang sức trong việc **quản lý, định giá kim cương và kinh doanh trực tuyến**.  
Hệ thống số hóa toàn bộ quy trình định giá, kết hợp nền tảng thương mại điện tử giúp kết nối khách hàng, tư vấn viên và bộ phận định giá một cách nhanh chóng, minh bạch và chuyên nghiệp.

---

## 👥 Đối tượng sử dụng (Actors)

- **Guest**: Khách truy cập chưa đăng ký, có thể xem thông tin công ty, tra cứu và ước lượng giá kim cương cơ bản.
- **Customer**: Khách hàng đăng ký, có thể gửi yêu cầu định giá, mua sản phẩm, quản lý đơn hàng.
- **Consulting Staff**: Nhân viên tư vấn, tiếp nhận yêu cầu, liên hệ khách hàng, xử lý biên nhận và trả kết quả.
- **Valuation Staff**: Nhân viên định giá, thực hiện quy trình định giá và ghi nhận kết quả.
- **Manager**: Quản lý, phê duyệt các nghiệp vụ đặc biệt, giám sát hoạt động.
- **Admin**: Quản trị hệ thống, cấu hình dịch vụ, quản lý người dùng, dữ liệu và bảo mật.

---

## Chức năng chính

### 🌐 Cổng thông tin & Tra cứu

- **Trang chủ**: Giới thiệu công ty, dịch vụ, kiến thức về kim cương, blog chia sẻ.
- **Tra cứu**: Ứng dụng ước lượng giá trị kim cương qua tiêu chí:
  - Nguồn gốc (Diamond origin)
  - Dạng mài cắt (Shape & Cut)
  - Kích thước (Measurements)
  - Trọng lượng (Carat weight)
  - Màu sắc (Color)
  - Độ tinh khiết (Clarity)
  - Cắt mài (Cut)
  - Tỉ lệ cắt mài (Proportions)
  - Mài bóng (Polish)
  - Đối xứng (Symmetry)
  - Phát quang (Fluorescence)
- **Tra cứu bằng số giám định**: Nhập số giám định trên giấy chứng nhận để ước lượng giá trị.

### 💼 Quy trình định giá kim cương

1. **Khách hàng gửi phiếu yêu cầu định giá**
2. **Nhân viên tư vấn liên hệ khách hàng**
3. **Tiếp nhận mẫu & lập biên nhận định giá**
4. **Nhân viên định giá thực hiện đánh giá và ghi nhận kết quả**
5. **Nhân viên tư vấn trả kết quả & mẫu cho khách hàng**

- **In giấy định giá** theo mẫu chuẩn của công ty.
- **Biên bản niêm phong**: Áp dụng khi khách hàng không đến nhận kết quả.
- **Giấy cam kết nhận mẫu**: Khi khách hàng mất biên nhận (cần phê duyệt quản lý).

### 📊 Quản lý & Cấu hình

- Khai báo **bảng giá** và **thời gian thực hiện** cho từng dịch vụ định giá.
- Khai báo **danh mục thông số định giá**.
- Đồng bộ **dữ liệu giá** từ các nền tảng kinh doanh trang sức quốc tế.
- **Dashboard thống kê**: Tình hình định giá, doanh thu, xu hướng giá.

### 🛒 Thương mại điện tử tích hợp

- **Danh mục sản phẩm**: Nhẫn, bông tai, vòng cổ, kim cương rời.
- **Giỏ hàng & thanh toán**: Hỗ trợ thanh toán online và COD.
- **Quản lý đơn hàng**: Trạng thái đơn, lịch sử giao dịch.
- **Chương trình khuyến mãi**: Mã giảm giá, combo ưu đãi.
- **Tích hợp vận chuyển**: Kết nối API với các đơn vị giao hàng.
- **Đánh giá sản phẩm**: Hệ thống review & xếp hạng sản phẩm.

---

## 🛠️ Công nghệ sử dụng

- **Backend**: Node.js / Express.js hoặc Laravel
- **Frontend**: React.js hoặc Vue.js
- **Database**: MySQL / PostgreSQL
- **Authentication**: JWT (JSON Web Token)
- **E-Commerce**: Tích hợp API thanh toán (VNPay, Stripe, PayPal), API vận chuyển
- **Deployment**: Docker / Cloud Hosting

---

## 📂 Cấu trúc thư mục

```plaintext
Diamond-Valuation-System/
│── backend/            # API & xử lý nghiệp vụ
│── frontend/           # Giao diện web
│── database/           # Script SQL & dữ liệu mẫu
│── docs/               # Tài liệu API, hướng dẫn
│── docker-compose.yml  # Cấu hình Docker
│── README.md           # Tài liệu dự án
```

## ⚙️ Cài đặt & Khởi chạy

### 1.Clone dự án

git clone https://github.com/Ngocphuoc2206/Diamond-Valuation-System.git
cd Diamond-Valuation-System

### 2.Frontend

npm install
npm run dev
