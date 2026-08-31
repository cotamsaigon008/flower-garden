# Khảo sát kho mã nguồn —— bia_fmcg

> **Trạng thái:** Hoàn tất —— **chế độ chỉ đọc**, không sửa đổi mã nguồn ứng dụng. Tài liệu này được tạo lại từ commit `4427f00` — "Add files via upload" — HEAD hiện tại của `main`, xác nhận qua GitHub API ngày 2026-08-31.

> **Tóm tắt nhanh:** Kho chứa **Next.js 16 App Router + React 19 + Supabase** — dashboard "Beer &amp; FMCG Intelligence OS" cho ngành bia/FMCG Việt Nam. Ứng dụng có một route trang chủ, đọc dữ liệu chỉ-đọc từ Supabase ba bảng `market_alerts`, `market_brands`, `company_financials`; các tab còn lại dùng dữ liệu tĩnh hardcode. **Chưa có:** backend server, API route, server actions, database migration, xác thực, tests, CI/CD, Docker, worker thực sự trong kho.

## 1. Mục đích kho và lĩnh vực nghiệp vụ

**Đã xác nhận:**
- Tên dự án trong `package.json`: `beer-fmcg-intelligence-os`; giao diện mang nhãn **Beer &amp; FMCG Intelligence OS** — hệ thống giám sát và điều hành thương mại ngành bia và FMCG Việt Nam.

- Giao diện gồm các tab; **Executive** — real-time alerts, thị phần nội địa, NSV, TTS%, lịch job tự động; **Pricing** — ma trận SKU-giá WinMart, waterfall cấu trúc giá, SKU Tsingtao thử nghiệm; **Distribution** — phân khúc điểm bán ba miền, Strike Rate, Drop Size Index, RED Score; **Forecast** — dự báo 30-90-180 ngày, dịch chuyển kênh on/off-trade, khoảng trắng kệ hàng.

**Suy luận:** Sản phẩm hướng tới executive và strategy intelligence cho nhà sản xuất bia, NPP và chuỗi bán lẻ như WinMart. Kịch bản tham chiếu khung pháp lý Việt Nam như Luật Thuế TTĐB `66/2025/QH15`, Nghị định `168/2024`, Luật ATGT đường bộ `2024`. **Chưa có tài liệu chính thức** về lĩnh vực hay người dùng mục tiêu trong repo vào.**

## 2. Ngăn xếp công nghệ

**Đã xác nhận** — từ `package.json`, `package-lock.json`, mã nguồn:
- `next` `16.2.10`; `react` `19.2.4`; `react-dom` `19.2.4`.
- `typescript` `5.9.3`, `tsconfig.json` strict, `allowJs: true`.
- `tailwindcss` `4.3.2` + `@tailwindcss/postcss` `4.3.2`; `postcss.config.mjs`.
- `recharts` `3.9.2`; `lucide-react` `1.24.0`.
- `@supabase/supabase-js` `^2.45.0` khai báo trong `package.json` — **không có trong `package-lock.json`**.
- ESLint `9.39.5` + `eslint-config-next` `16.2.10`, flat config `eslint.config.mjs`.
- Font Google qua `next/font/google`: Geist và Geist_Mono trong layout; Fraunces, Inter, IBM_Plex_Mono trong component.

**Ghi chú:** `package-lock.json` lockfileVersion 3, khoảng 474 entries; thiếu `@supabase/supabase-js` — lockfile lệch manifest, rủi ro khi `npm ci`.

**Chưa biết:** Phiên bản Node.js, npm yêu cầu — không `engines`, không `.nvmrc`.

**Chưa có:** `.gitignore` — thiếu, nguy cơ commit `node_modules` và `.env`; không `.env.example`; không `LICENSE`.

##3. Cấu trúc kho mã nguồn

**Đã xác nhận** — toàn bộ cây tệp commit `4427f00`:
```
bia_fmcg/
├── README.md                  — README mặc định create-next-app + dòng "# bia-fmcg"
├── AGENTS.md                  — cảnh báo nextjs-agent-rules
├── CLAUDE.md                  — chỉ chứa "@AGENTS.md"
├── package.json, package-lock.json
├── next.config.ts              — cấu hình rỗng, không option
├── tsconfig.json              — strict, path alias @/* → ./
├── eslint.config.mjs          — next core-web-vitals + typescript, flat config
├── postcss.config.mjs         — plugin tailwindcss
├── app/
│   ├── favicon.ico
│   ├── globals.css           — import Tailwind v4 + biến CSS light/dark
│   ├── layout.tsx            — RootLayout, Geist fonts, metadata mặc định, lang="en"
│   └── page.tsx              — server component, fetch Supabase rồi render client component
├── components/
│   └── BeerFmcgIntelligenceOS.jsx — 428 dòng,"use client",toàn bộ UI dashboard
├── lib/
│   └── supabase.ts           — tạo Supabase client từ env, ném lỗi khi thiếu env
├── public/                    — file.svg,,globe.svg,,next.svg,,vercel.svg,,window.svg
└── docs/
    └── CODEBASE_OVERVIEW.md — tài liệu này
```
**Không có:** `app/api/`, `app/actions/`, `middleware.ts`, `instrumentation.ts`, `i18n/locales`, monorepo, workspace con.

##4. Các điểm khởi đầu của ứng dụng

**Đã xác nhận:**
- Route duy nhất: `app/page.tsx` — server component mặc định cho `/`, hàm `export default async function Home()`.

- Layout gốc: `app/layout.tsx` — áp dụng toàn trang với metadata, fonts, CSS toàn cục.

- Scripts trong `package.json`: `npm run dev` — `next dev`; `npm run build` — `next build`; `npm start` — `next start`; `npm run lint` — `eslint`.
- Điểm vào dữ liệu: `lib/supabase.ts` — hàm `getSupabaseClient()`.



##5. Kiến trúc backend

**Đã xác nhận:** **Không có backend tùy chỉnh trong kho** — không có `app/api/`, không server actions, không framework backend độc lập, không mã Edge Function.Suppabase Edge Function không nằm trong repo này.



- Data-flow duy nhất: server component `page.tsx` gọi Supabase trực tiếp bằng `getSupabaseClient()`, anon key công khai, kỳ vọng RLS chỉ đọc công khai.

- Xử lý lỗi: khối `try/catch` trong `page.tsx`, lưu `fetchError` rồi truyền xuống UI hiển thị thông báo lỗi trên dashboard.áo

**Suy luận:** Kiến trúc hiện tại là "server-rendered dashboard + Database-as-a-Service" kiểu BaaS với Supabase, chưa có business-logic tầng trung gian. Các `JOB 1–4` hiển thị trong UI là **mô tả tĩnh** — không có mã thực thi định kỳ nào trong repository.



##6. Kiến trúc frontend

**Đã xác nhận:**
- App Router với một server component và một client component lớn: `components/BeerFmcgIntelligenceOS.jsx` — 428 dòng, `"use client"`, quản lý tab bằng `useState` Domestic`.
- **Không dùng thư viện UI, không state-management** — mọi style là inline CSS-in-JS thông qua object màu `C` và thuộc tính `style`; chuyển tab thủ công bằng biến `activeTab`. Tailwind v4 chỉ dùng qua `globals.css` với `@import "tailwindcss"` và CSS variables, không dùng class Tailwind trong JSX.á
- Biểu đồ bằng **Recharts**: BarChart thị phần, LineChart dự báo,, AreaChart dịch chuyển kênh..
- Fonts: **next/font/google** — Geist trong layout; Fraunces,, Inter,, IBM_Plex_Mono khai báo trong chính component client — tổng cộng thêm ba font Google, cân nhắc tác động hiệu năng.

- **Accessibility** hạn chế: tab dùng `<button>` tốt, nhưng thiếu `role="tab"`, `aria-selected`, điều hướng bàn phím; `lang="en"` trong khi giao diện tiếng Việt.



##7. Lớp API

**Đã xác nhận:** Không có API do ứng dụng định nghĩa trong kho — REST, GraphQL, gRPC đều không hiện diện. Thay vào đó, dữ liệu đọc trực tiếp qua **Supabase client** — postgREST do Supabase cung cấp:

- `market_alerts` — `select("*")`, order bởi `impact` giảm dần, rồi `urgency` giảm dần.

- `market_brands` — `select("*")`, order bởi `market_share_volume` giảm dần.



- `company_financials` — `select("*")`, order bởi `company_name` tăng dần tích.



**Suy luận:** Schema Supabase được suy ra từ component: các cột như `brand_name`, `market_share_volume`, `alert_type`, `priority`, `title`, `details`, `strategic_action`, `impact`, `urgency`, `company_name`, `period`, `net_revenue_vnd_bn`, `yoy_revenue_growth_pct`, `ad_promo_expense_vnd_bn`, `is_full_year_target`, `is_latest_actual` — nhưng **không có trong repo để xác nhận**.



##8. Cơ sở dữ liệu và cơ chế lưu trữ

**Đã xác nhận:** Persistence duy nhất là **Supabase** — PostgreSQL qua `@supabase/supabase-js`. Không có migration SQL, không seed, không ORM trong kho. Quyền truy cập kỳ vọng: anon key công khai, RLS policy public-read chỉ cho SELECT như ghi chú trong `lib/supabase.ts`.

**Chưa biết:** Cấu trúc bảng, migration history, RLS policy thực tế, seed data — toàn bộ nằm trong Supabase project ngoài repo, không thể xác minh từ đây.



##9. Xác thực và phân quyền

**Đã xác nhận:** **Không có mã xác thực hay phân quyền trong kho** — không login, không session, không middleware auth, không dùng Supabase Auth. Toàn bộ ứng dụng chạy công khai đọc bằng anon key.



##10. Các tích hợp bên ngoài

**Đã xác nhận:**
- **Supabase** — tích hợp dữ liệu chính; dependency `@supabase/supabase-js`; cần hai biến môi trường.á
- **Google Fonts** qua `next/font/google` — Geist trong layout;, Fraunces, Inter, IBM_Plex_Mono trong component..



##11. Background jobs và worker

**Đã xác nhận:** **Không có mã worker hay scheduled job trong kho**. UI hiển thị bốn mô tả "JOB" tĩnh — Market Alert mỗi 30 phút,, Daily Executive Brief lúc 07:00,, Weekly Market Review thứ Hai 07:30,, Monthly Board Report ngày mùng 1 lúc 08:00. Đây chỉ là nội dung hiển thị,, không kèm mã cron, edge function hay queue nào trong repository này.



##12. Cấu hình và biến môi trường

**Đã xác nhận:**
- Hai biến môi trường bắt buộc — đọc từ `lib/supabase.ts`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Không có tệp `.env`, `.env.example`, `.env.local` trong repo; không có mẫu cấu hình.

- `next.config.ts` **rỗng** — không cấu hình env, images, redirects, headers hay CSP..



##13. Kiến trúc Docker và container

**Đã xác nhận:** **Không có `Dockerfile`, `docker-compose*`, `.dockerignore`** hay bất kỳ tệp container hóa nào trong kho. Kênh triển khai dự kiến là **Vercel** — README create-next-app hướng dẫn Vercel;, `lib/supabase.ts` ghi chú "Vercel Project Settings".



##14. Quy trình CI/CD

**Đã xác nhận:** **Không có workflow GitHub Actions** — GitHub Actions API trả về `total_count: 0`; không có thư mục `.github/`; không có cấu hình CI/CD bên ngoài nào như GitLab CI, Jenkins, Azure Pipelines. README dẫn tới Vercel deploy nhưng không có `vercel.json` hay cấu hình platform khác trong repo.



##15. Chiến lược kiểm thử

**Đã xác nhận:** **Không có bài kiểm thử nào** — không unit test, không integration test,, không E2E;, không test runner như vitest, jest, playwright, cypress;, không cấu hình coverage. Script `lint` là kiểm tra tĩnh duy nhất được khai báo.



##16. Ghi nhật ký và khả năng quan sát

**Đã xác nhận:** Chỉ có một `console.error("Lỗi tải dữ liệu từ Supabase:", err?.message ?? err)` trong `page.tsx` — log phía server, ra console runtime deploy. Không có logger cấu trúc,, không tracing,, không metrics,, không Sentry/OpenTelemetry,, không cấu hình Vercel Analytics hay Web Vitals.



##17. Thư viện và phụ thuộc chính

**Đã xác nhận** — `package.json` + `package-lock.json`:

| Nhóm | Thư viện | Version |
|---|---|---|
| Framework | `next` | `16.2.10` |
| UI | `react` + `react-dom` | `19.2.4` |
| Chart | `recharts` | `3.9.2` |
| Icons | `lucide-react` | `1.24.0` |
| Data | `@supabase/supabase-js` | `^2.45.0` — ghi chú: thiếu trong lockfile |
| Style | `tailwindcss` + `@tailwindcss/postcss` | `4.3.2` |
| Lint | `eslint-config-next` + `eslint` | `16.2.10` + `9.39.5` |
| Type | `typescript` | `5.9.3` |



##18. Rủi ro tiềm ẩn về kiến trúc

**Đã xác nhận:**
1. **Lockfile không đồng bộ manifest** — `@supabase/supabase-js` có trong `package.json` nhưng vắng trong `package-lock.json`; `npm ci` có thể fail, phiên bản thực tế không bị khoá. Mức: cao
2. **Thiếu `.gitignore`** — nguy cơ commit `node_modules`, `.next`, `.env*`, log — đặc biệt nhạy vì ứng dụng cần secret env. Mức: cao
3. **Metadata và SEO mặc định** — `layout.tsx` giữ `title: "Create Next App"`, `description: "Generated by create next app"`, `lang="en"` trong khi sản phẩm là dashboard tiếng Việt — sai SEO và accessibility. Mức: trung bình
4. **Một client component 428 dòng** — toàn bộ UI, màu sắc, mappers,, tabs,, charts trong một file `.jsx` không type — khó bảo trì, khó tái sử dụng.** Mức: trung bình
5. **Dữ liệu tĩnh hardcode** — pricing matrix,, regions,, forecast,, channel shift,, market gaps,, jobs đều viết cứng trong component — không nguồn dữ liệu,, không cơ chế cập nhật. Mức: trung bình

**Suy luận — rủi ro dự báo:**
6. **RLS Supabase** — anon key công khai chỉ an toàn khi RLS policy đúng; nếu policy sai hoặc có nơi dùng service_role thì dữ liệu bị phơi. Mức: cao — chưa thể xác minh từ repo.

7. **Toàn component client-side** — dù phần lớn là render tĩnh,, kéo theo JavaScript nặng phía trình duyệt. Mức: trung bình
8. **`revalidate = 0` và `dynamic = "force-dynamic"`** — mọi request đều fetch lại Supabase, chưa có cache strategy cho dữ liệu bán tĩnh như thị phần, tài chính. Mức: thấp-trung bình



##19. Nợ kỹ thuật

**Đã xác nhận:**
- Lockfile thiếu dependency Supabase — nợ kỹ thuật ngay từ đầu. Mức cao
- README vẫn là mặc định `create-next-app`, dự án chỉ ghi dòng `# bia-fmcg` cuối tệp. Mức trung bình.
- `AGENTS.md` và `CLAUDE.md` hiện tại chỉ chứa cảnh báo nextjs-agent-rules và tham chiếu — chưa có hướng dẫn build,, test,, env cho agent. Mức trung bình
- Ép kiểu `any` trong `app/page.tsx` — `const BeerFmcgIntelligenceOS: any = ...` kèm comment giải thích workaround cho lỗi build trước đó — ranh giới kiểu dữ liệu chưa được thiết kế. Mức trung bình
- Thiếu hoàn toàn test infrastructure — nợ tích lũy khi tính năng tăng. Mức cao dần
- Hai hệ thống style song song — Tailwind v4 qua CSS variables và inline style qua object `C` — kém nhất quán. Mức thấp



##20. Các khu vực nhạy cảm về bảo mật

**Đã xác nhận:**
- **Không có bí mật hardcode trong mã nguồn** — đã scan 19 tệp, không thấy key, token, URL Supabase cố định,, chuỗi `eyJ` hay `service_role` trong code.; từ khóa service_role chỉ xuất hiện trong bình luận `lib/supabase.ts` như cảnh báo "không dùng"".
- **Secret là biến môi trường** — `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`;; anon key là public key, an toàn khi ở client **chỉ khi RLS thực sự chặn write**; không có service_role trong code — tốt..
- **Rủi ro phụ sinh từ thiếu `.gitignore`** — nếu commit sau vô tình thêm `.env*.local` hoặc `node_modules` sẽ lộ secret hoặc phình kho. Mức cao
- **Repo private trên GitHub** — kiểm soát truy cập hiện tại ổn; nhưng nếu repo trở công khai, anon key Supabase lộ sẽ cho đọc dữ liệu nếu RLS sai.Mức cao
- Không có CSP,, security headers,, rate limit — bề mặt tấn công hiện thấp vì app tĩnh + Supabase trực tiếp, nhưng không có lớp phòng thủ nếu dữ liệu nhạy cảm sau này.Mức thấp-trung bình



##21. Tổng kết và khuyến nghị

**Thang mức:** A — cần xử lý ngay;; B — nên xử lý sớm;; C — cải thiện khi có thời gian.



| # | Khuyến nghị | Mức |
|---|---|---|
| 1 | Cho chạy `npm install` để đồng bộ lại `package-lock.json`, bổ sung `@supabase/supabase-js` và các dependency thiếu khác, rồi commit lockfile mới | A |
| 2 | Thêm `.gitignore` — `node_modules`, `.next`, `.env*`, logs — trước commit tiếp theo | A |
| 3 | Cập nhật metadata và SEO cho `app/layout.tsx` — title, description,, `lang="vi"` | B |
| 4 | Xác minh Supabase RLS policy — chỉ SELECT công khai, chặn write bằng anon key | B |
| 5 | Thêm `.env.example` liệt kê hai biến, không kèm giá trị thực | B |
| 6 | Cá nhân hóa README — mục đích,, lệnh chạy,, biến env,, kiến trúc dữ liệu | B |
| 7 | Xác định mô hình background jobs thực sự — Supabase Edge Functions hay cron ngoài repo — hiện chỉ là mô tả UI | B |
| 8 | Chia nhỏ component 428 dòng, thêm type cho dữ liệu Supabase thay `any` | C |
| 9 | Thêm tests — ít nhất unit test cho mappers và smoke render test; thêm CI GitHub Actions lint → typecheck → build | C |
| 10 | Tách dữ liệu tĩnh pricing, regions,, forecast thành nguồn dữ liệu có cấu hình hay database | C |
| 11 | Cân nhắc cache strategy cho dữ liệu bán tĩnh thay vì force-dynamic mọi request | C |
| 12 | Cải thiện accessibility cho tab — role="tab",, aria-selected,, điều hướng bàn phím,, contrast,, focus states | C |

##22. Thông tin chưa biết và còn thiếu

| # | Mục | Tình trạng |
|---|---|---|
| 1 | Mô tả nghiệp vụ và người dùng mục tiêu chính thức | Thiếu — suy diễn từ UI |
| 2 | Schema, migration,, RLS policy,, seed data của Supabase | Thiếu — nằm ngoài repo |
| 3 | Phiên bản Node.js,, npm yêu cầu | Thiếu |
| 4 | Backend,, API routes,, server actions | Thiếu — chưa có |
| 5 | Mã background job thực thi | Thiếu — chỉ mô tả tĩnh |
| 6 | Tests và cấu hình test runner | Thiếu |
| 7 | CI/CD pipeline | Thiếu — chưa có workflow |
| 8 | Docker,, container hóa,, tệp deploy | Thiếu — dự kiến Vercel |
| 9 | Logging tập trung,, metrics,, tracing | Thiếu |
| 10 | Tài liệu data contract cho ba bảng Supabase | Thiếu |
| 11 | `.env.example`,, tài liệu cấu hình deploy | Thiếu |
| 12 | Chính sách bảo mật chi tiết — RLS audit,, CSP,, headers | Thiếu |

---

*Tài liệu này được tạo bởi trợ lý AI — OpenHands — trong phiên khảo sát chỉ đọc; không thay đổi bất kỳ mã ứng dụng nào. Mọi dữ liệu xác nhận được kiểm chứng từ commit `4427f00` và GitHub API.*