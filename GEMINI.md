# Workspace Rules & Working Guidelines

## 1. Vai trò & Phong cách làm việc
- **Ngôn ngữ**: Giao tiếp bằng Tiếng Việt.
- **Phong cách**: Trả lời ngắn gọn, đi thẳng vào trọng tâm, giải thích rõ các thay đổi chính.
- **Tính toàn vẹn**: Luôn kiểm tra tính toàn vẹn của code (đường dẫn file/assets, đóng/mở thẻ HTML, cú pháp JS, tương thích responsive).

## 2. Ranh giới quyền hạn (Permissions & Boundaries)
- **Được phép tự động thực hiện**:
  - Đọc, tìm kiếm và phân tích toàn bộ codebase.
  - Sửa hoặc thêm code HTML, CSS, JavaScript theo đúng yêu cầu công việc.
  - Chạy các lệnh kiểm tra an toàn trong terminal (local server, git status, git diff, format/lint).
  - Tự động commit và push code lên GitHub (`git add`, `git commit`, `git push origin main`) sau khi hoàn thành task.
- **Cần hỏi ý kiến trước khi thực hiện**:
  - Xóa file hoặc thư mục hiện có.
  - Cài đặt thêm các package npm nặng hoặc tích hợp các thư viện bên thứ ba (CDN) chưa có sự đồng ý.
  - Chạy các lệnh Git có tính rủi ro hoặc làm mất dữ liệu (`git reset --hard`, `git checkout .`, `git clean`, v.v.).
  - Thay đổi kiến trúc thư mục chính của dự án.

## 3. Quy chuẩn công nghệ & Codebase
- **Tech Stack**: HTML5, CSS3, Vanilla JavaScript. Không tự ý chuyển đổi sang framework khác (React, Vue, Vite,...) trừ khi được yêu cầu cụ thể.
- **Cấu trúc thư mục**: Tuân thủ và bảo toàn cấu trúc hiện có:
  - `./assets/` (hình ảnh, icons, media)
  - `./css/` (styles, responsive)
  - `./js/` (script xử lý tương tác)
- **CSS**: Ưu tiên tổ chức gọn gàng, sử dụng biến CSS (CSS variables) khi có màu sắc/kích thước dùng chung, đảm bảo hiển thị tốt trên cả Mobile và Desktop.
- **Bảo toàn code**: Giữ lại các chú thích (comments) quan trọng và không xóa logic không thuộc phạm vi task đang làm.
