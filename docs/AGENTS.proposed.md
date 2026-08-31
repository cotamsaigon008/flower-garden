# AGENTS.md — bia_fmcg (bản đề xuất

> **Mục đích tệp này:** Là **đề xuất** cho tệp `AGENTS.md` thân thiện với OpenHands — soạn trong phiên khảo sát chỉ đọc. Tệp `AGENTS.md` đang tồn tại trong repo(nội dung người dùng upload: cảnh báo nextjs-agent-rules + tham chiếu `@AGENTS.md` từ `CLAUDE.md`) được **giữ nguyên**, không bị ghi đè. Nếu chủ kho muốn dùng nội dung này, hãy merge/gộp với cảnh báo nextjs-agent-rules rồi thay vào `AGENTS.md` chính thức.



## Snapshot hiện trạng(khảo sát commit `4427f00`, 2026-08-31)

- Ứng dụng: **Next.js 16 (App Router) + React 19** — dashboard "Beer &amp; FMCG Intelligence OS"”. Xem `docs/CODEBASE_OVERVIEW.md` cho phân tích đầy đủ 22 mục.
- Dữ liệu: **Supabase** chỉ-đọc(`market_alerts`, `market_brands`, `company_financials`) qua anon key; các tab Pricing/Distribution/Forecast dùng dữ liệu tĩnh hardcode.

## Quy ước quan trọng khi code trong repo này

1. **Yêu cầu env** (app sẽ ném lỗi khi thiếu): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Không commit giá trị thực — dùng `.env.local` + `.env.example`(nên tạo). Không dùng service_role trong client code,
2. **Lockfile đang thiếu `@supabase/supabase-js`** — trước khi chạy `npm ci`, chạy `npm install` để đồng bộ lockfile rồi commit ket quả. Verify `npm ci && npm run build` trước khi push.
3. **Chưa có `.gitignore`** — không vô tình thêm `node_modules/`, `.next/`, `.env*`, logs vào commit; nên thêm `.gitignore` ngay khi có thể.
4. **AGENTS.md hiện tại chứa cảnh báo**: "This is NOT the Next.js you know… read the relevant guide in `node_modules/next/dist/docs/`" — các phiên OpenHands nên **đọc docs này trước khi viết code Next.js 16** vì API/convention có thể khác bản training cũ.
5. **Typing**: `page.tsx` đang ép `const BeerFmcgIntelligenceOS: any = …` để né lỗi TypeScript — khi sửa type, kiểm tra build `npm run build` vì từng fail với lỗi `never[]` trước đây.
6. **Next.js 16 App Router**: trang chủ dùng `export const revalidate = 0` + `dynamic = "force-dynamic"` — fetch Supabase mỗi request; đừng thay đổi hành vi này mà chưa cân nhắc cache strategy.



## Lệnh phát triển

| Mục đích | Lệnh |
|---|---|
| Dev server | `npm run dev` (mặc định http://localhost:3000) |
| Build | `npm run build` |
| Chạy production | `npm start` |
| Lint | `npm run lint` |
| Cài đặt(dep mới | `npm install`(đồng bộ lockfile trước đã) |

## Cấu trúc dữ liệu kỳ vọng(Supabase — suy từ component, chưa có schema trong repo)

- `market_alerts:` `id`, `alert_type`(==`OPPORTUNITY`→ opportunity; else `priority`==`CRITICAL`→ critical; nếu không → watch`, `title`, `details`, `strategic_action`, `impact`(x/5,, `urgency`(x/5)
- `market_brands:` `brand_name`, `market_share_volume`(%, hiển thị trực tiếp)
- `company_financials:` `company_name`, `period`(VD: `Q2/2026`), `net_revenue_vnd_bn`, `yoy_revenue_growth_pct`, `ad_promo_expense_vnd_bn`, `is_full_year_target`, `is_latest_actual`(đánh dấu kỳ thực tế gần nhất theo công ty)

## Việc nên làm tiếp theo

- [ ] Đồng bộ lockfile(`npm install`) + thêm `.gitignore` + `.env.example`
- [ ] Cập nhật metadata/SEO(`title`, `description`, `lang="vi"` trong `app/layout.tsx`)
- [ ] Xác minh **RLS policy** Supabase(chỉ SELECT công khai, không write bằng anon key)
- [ ] Quyết định nơi triển khai background jobs(Market Alert 30-phút, briefs…); hiện chỉ là mô tả tĩnh trong UI
- [ ] Thêm tests + GitHub Actions CI(lint → typecheck → build)
- [ ] Cá nhân hóa README(mục đích, env, lệnh, kiến trúc)

---

*Bản đề xuất này do trợ lý AI(OpenHands) soạn trong phiên khảo sát chỉ đọc — không thay đổi mã ứng dụng.*