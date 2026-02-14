# Shirayeo 一頁式作品集網站開發計劃

## 目標
- 建立一頁式作品集（SvelteKit + Svelte 5 + Tailwind CSS，部署到 Vercel）。
- 頁面分三區：
  1. 網站標題 + 簡短自我介紹
  2. 相片功能區（先做可點擊 active 狀態，拍照流程後補）
  3. 畫作作品集區
- 提供可在 local 執行的簡易 admin 後台，讓非工程背景可更新：
  - 作品集 YAML
  - 照片 YAML
- 媒體資源（作品圖、照片）統一預留 GCS 圖床介面（先 stub）。

## 建議分階段實作（可逐階段 commit）

## Phase 1 - 專案初始化與基礎設定
**目標**
- 建立 SvelteKit 專案（Svelte 5）。
- 整合 Tailwind CSS。
- 加入基本 lint/format 與 `.env` 範本。

**產出**
- 可 `npm run dev` 啟動。
- 基本專案結構建立完成。

**驗收**
- 首頁可開啟，顯示最小骨架內容。

**建議 commit**
- `chore: initialize sveltekit + tailwind project scaffold`

---

## Phase 2 - 前台一頁式骨架（依 wireframe）
**目標**
- 完成首頁三區塊版面與 RWD：
  - Header + Intro
  - Camera icon 區（可切換 active 樣式）
  - 作品集清單區（先用假資料）

**產出**
- `src/routes/+page.svelte` 完成版面與基本樣式。
- 可明確對照 wireframe。

**驗收**
- 手機/桌機都可讀。
- 相機 icon 點擊可切換 active/inactive 狀態（純前端狀態）。

**建議 commit**
- `feat: implement one-page portfolio layout and camera active state`

---

## Phase 3 - 資料模型與本地資料層
**目標**
- 定義前後台共用資料型別（作品、照片）。
- 建立本地 YAML 檔案式資料儲存（先不接 DB）。

**作品資料結構（標準化）**
- `work_name`
- `created_date` (YYYY-MM-DD)
- `materials`
- `real_size`（統一欄位名，兼容你提供的 `size`）
- `digital_size`
- `description`
- `layout`（`直` / `橫`）
- `cover_image_url`（預留圖床網址）

**產出**
- `src/lib/types.ts`
- `src/lib/server/repositories/*`（本地讀寫）
- `data/works.yaml` 初始資料（含你提供的兩筆作品）
- `data/photos.yaml` 初始資料（先可為空陣列）

**驗收**
- 前台可改為讀真實本地資料，不再硬編碼。
- 資料來源明確只有兩份 YAML：`works.yaml` 與 `photos.yaml`。

**建議 commit**
- `feat: add shared schema and yaml-based repository`

---

## Phase 4 - Admin 後台最小可用版（local）
**目標**
- 建立 `/admin` 頁面（先用簡單密碼或 local-only 保護）。
- Admin 僅編輯兩份 YAML：
  - `data/works.yaml`
  - `data/photos.yaml`
- 可操作內容：
  - 作品新增/編輯/刪除（寫回 `works.yaml`）
  - 照片新增/刪除（寫回 `photos.yaml`）

**產出**
- Admin UI（表單 + 清單）。
- 對應的 form actions / API endpoints。

**驗收**
- 修改後可立即反映到前台。
- 重啟 server 後資料仍保留（檔案式儲存）。

**建議 commit**
- `feat: add local admin panel to edit works and photos yaml`

---

## Phase 5 - GCS 圖床介面預留（Stub）
**目標**
- 建立媒體服務抽象層，先提供 stub 實作。
- 設計未來 GCS 需要的環境變數與介面簽名。

**產出**
- `src/lib/server/media/media-provider.ts`（interface）
- `src/lib/server/media/providers/gcs.stub.ts`
- `.env.example` 補齊 GCS 相關鍵值（先不放敏感資訊）

**驗收**
- Admin 可呼叫 stub 上傳流程（回傳假 URL 或 TODO 提示）。
- 不影響現有前台與後台流程。

**建議 commit**
- `feat: scaffold media provider interface with gcs stub`

---

## Phase 6 - 前台體驗強化與內容呈現
**目標**
- 作品卡片資訊完整顯示（名稱/年份/尺寸/媒材/描述）。
- 依 `layout` 調整圖片比例樣式。
- 基礎 SEO（title/description/OG）與 favicon。

**產出**
- 更接近正式上線版本的單頁體驗。

**驗收**
- Lighthouse 基本可接受（先達可讀、可用）。

**建議 commit**
- `feat: polish portfolio presentation and basic seo metadata`

---

## Phase 7 - 部署與交付
**目標**
- 補齊 Vercel 部署設定與操作文件。
- 補 README：本地開發、admin 使用方式、未來 GCS 串接步驟。

**產出**
- `README.md`（中文操作指引）
- 部署成功（preview / production）

**驗收**
- 新機器可依 README 在 10 分鐘內啟動。

**建議 commit**
- `docs: add deployment and admin operation guide`

---

## 初始資料（你提供）
### `data/works.yaml`
```yaml
- work_name: 靜默之所
  created_date: 2025-03-12
  materials: 炭筆、石墨
  real_size: 52cm x 38cm
  digital_size: 2356 x 3289
  description: 描述
  layout: 直

- work_name: 琢磨
  created_date: 2024-09-12
  materials: 炭筆、石墨
  real_size: 52cm x 38cm
  digital_size: 3821 x 5651
  description: 描述
  layout: 直
```

### `data/photos.yaml`（範例）
```yaml
- file_name: IMG_0001.jpg
  uploaded_at: 2026-02-14T14:00:00Z
```

## YAML 結構規範
### 作品（`works.yaml`）
- `work_name`
- `created_date` (YYYY-MM-DD)
- `materials`
- `real_size`
- `digital_size`
- `description`
- `layout`（`直` / `橫`）
- `cover_image_url`（預留圖床網址）

### 照片（`photos.yaml`）
- `file_name`（檔案名稱）
- `uploaded_at`（ISO 8601 時間字串）

## 備註
- 先以「可用、好維護、可逐步上線」為優先，避免一開始過度工程化。
- 相機功能先完成 UI 與狀態切換，後續再接實際拍照/上傳流程。
