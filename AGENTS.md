# AGENTS.md — bia_fmcg

> **Trạng thái:** Tệp này được **đề xuất** bởi một phiên khảo sát chỉ đọc (xem `docs/CODEBASE_OVERVIEW.md`). Chủ kho nên xem xét, bổ sung, và **chốt bằng một commit riêng** trước khi sử dụng làm nguồn ngữ cảnh chính thức cho các phiên làm việc với OpenHands.

  Nội dung bên dưới phản ánh hiện trạng kho *tại thời điểm khảo sát* (2026-08-31): kho gần như trống và **sẽ nhanh chóng lỗi thời** khi mã nguồn được thêm vào.**



## Snapshot hiện trạng(khảo sát 2026-08-31)

- Kho `bia_fmcg` (private, GitHub) chỉ chứa một tệp `README.md`(16 bytes:“`# bia-fmcg-main`”) và một commit `first commit` trên `main`.
- Không có mã nguồn, tệp cấu hình, test, CI/CD, Docker, hoặc tài liệu kỹ thuật nào.
.
  Dẫn chiếu: `docs/CODEBASE_OVERVIEW.md` — bảng “Các mục chưa biết/còn thiếu” liệt kê những gì cần bổ sung.



## Quy ước tối thiểu khi làm việc trong kho này(khuyến nghị)

1. **Cập nhật tài liệu dẫn chiếu** khi thêm công nghệ/cấu trúc mới: sửa `README.md`, `docs/` và chính tệp này thay vì để chúng tụt hậu.
2. **Không commit bí mật:** chưa có `.gitignore` — hãy thêm một tệp `.gitignore` phù hợp ngay khi tạo dự án và giữ mọi `.env*`, khóa, token ngoài version control.
3. **Nhánh `main`: không push thẳng khi cộng tác nhiều người** — đề xuất nhánh feature + pull request; `main` hiện chưa có branch protection.
4. **GH_Actions:** khi bắt đầu CI/CD, ưu tiên workflow nhỏ, chạy nhanh(lint → test → build), khóa phiên bản action bằng tag/SHA, không dùng `@main`.



## Quy trình phát triển(khi chưa có quy trình chính thức)

- Đây là phần **chưa xác định**: chưa có lệnh build/test/chạy nào được tài liệu hóa. Cập nhật mục này ngay khi mã nguồn xuất hiện(bao gồm lệnh cài đặt, chạy dev, chạy test, lint/format).
- Khi thiếu quy trình: hỏi chủ kho trước khi giả định công nghệ hoặc cài đặt phụ thuộc.**



## Việc cần làm ngay khi dự án bắt đầu(danh sách kiểm tra)

- [ ] Bổ sung `README.md` mô tả mục đích và lĩnh vực nghiệp vụ(FMCG?).
- [ ] Khai báo ngăn xếp công nghệ và tệp phụ thuộc(manifest/lockfile).
- [ ] Thêm `.gitignore`, `LICENSE`(nếu cần), và `docs/CODEBASE_OVERVIEW.md` được cập nhật theo thực tế.

- [ ] Thiết lập branch protection cho `main` và quy trình PR(chạy CI bắt buộc..
- [ ] Quyết định chiến lược kiểm thử, logging/observability, và container hóa rồi cập nhật tài liệu này.

---

*Tệp `AGENTS.md` này do trợ lý AI(OpenHands) soạn thảo trong phiên khảo sát chỉ đọc — không thay đổi hành vi ứng dụng.*