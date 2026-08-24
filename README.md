# VibeCode IDE

> **Minimal IDE** dengan gaya modern, fully responsive (mobile, tablet, desktop), powered by Cloudflare Worker backend.

![VibeCode IDE](https://img.shields.io/badge/Version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Jekyll](https://img.shields.io/badge/Jekyll-4.4.1-red.svg)

---

## 📖 Daftar Isi

- [🚀 Fitur](#-fitur)
- [📦 Struktur Proyek](#-struktur-proyek)
- [🛠 Teknologi](#-teknologi)
- [📥 Instalasi](#-instalasi)
- [🏃‍♂️ Running](#-running)
- [🎨 Arsitektur](#-arsitektur)
- [📂 Struktur File](#-struktur-file)
- [🔧 Konfigurasi](#-konfigurasi)
- [🤖 AI Integration](#-ai-integration)
- [💳 Token Billing](#-token-billing)
- [📝 Git Integration](#-git-integration)
- [📱 Responsive Design](#-responsive-design)
- [🎯 Shortcuts](#-shortcuts)
- [🤝 Kontribusi](#-kontribusi)
- [📜 Lisensi](#-lisensi)

---

## 🚀 Fitur

### ✨ IDE Core
- **Multi-tab Editor** - Buka dan edit banyak file sekaligus
- **File Tree Explorer** - Navigasi file dan folder yang intuitif
- **Syntax Highlighting** - Dukungan untuk HTML, CSS, JavaScript, JSON, Markdown
- **Line Numbers** - Nomor baris untuk navigasi yang mudah
- **Auto-indent** - Tab otomatis untuk code formatting

### 🤖 AI Assistant
- **AI Chat** - Chat dengan AI untuk bantuan coding
- **AI File Editing** - Minta AI untuk mengedit file aktif
- **Multiple AI Models** - Pilih dari berbagai model AI (Qwen, Kimi, GPT OSS, DeepSeek)
- **Project Instructions** - Set costum instruksi proyek untuk AI

### 💾 Project Management
- **Auto-save** - Perubahan otomatis disimpan di localStorage
- **Project Snapshots** - Simpan dan restore state proyek
- **Multiple Projects** - Kelola banyak proyek sekaligus

### 📝 Git Integration
- **Clone Repository** - Clone repo GitHub langsung dari IDE
- **Commit Changes** - Commit perubahan dengan pesan
- **Push/Pull** - Sync dengan remote repository
- **Change Tracking** - Lihat file yang dimodifikasi

### 💳 Token Billing System
- **Token Balance** - Lihat saldo token AI
- **PayPal Integration** - Top-up token via PayPal
- **Multiple Plans** - Pilih paket token (Starter, Pro, Business, Enterprise)

### 📱 Responsive Design
- **Desktop** - Layout penuh dengan sidebar dan chat panel
- **Tablet** - Layout yang dioptimalkan untuk tablet
- **Mobile** - Hamburger menu, drawer panels, bottom navigation

---

## 📦 Struktur Proyek

```
frontend/
├── _config.yml              # Konfigurasi Jekyll
├── _includes/               # Jekyll includes
│   ├── ide-head.html        # CSS includes
│   ├── ide-assets.html      # JS includes
│   └── ide-overlays.html     # Modal & toast overlays
├── _layouts/                # Jekyll layouts
│   └── default.html         # Layout utama
├── assets/
│   ├── css/                 # Stylesheets
│   │   ├── variables.css     # CSS Custom Properties
│   │   ├── base.css          # Base styles & utilities
│   │   ├── ide.css           # IDE-specific styles
│   │   └── dashboard.css     # Dashboard styles
│   ├── icons/               # Icons (optional)
│   └── js/                  # JavaScript modules
│       ├── variables.js      # State & DOM cache
│       ├── utils.js          # Utility functions
│       ├── app.js            # Project store & core
│       ├── file-ops.js       # File operations
│       ├── editor.js         # Editor rendering
│       ├── git.js            # Git operations
│       ├── ai.js             # AI chat & editing
│       └── token.js          # Token billing
├── index.html               # IDE utama
├── dashboard.html           # Project dashboard
├── Gemfile                  # Ruby dependencies
├── Gemfile.lock
└── README.md
```

---

## 🛠 Teknologi

| Teknologi | Versi | Kegunaan |
|-----------|-------|---------|
| **Jekyll** | 4.4.1 | Static Site Generator |
| **Font Awesome** | 6.4.0 | Icon Library |
| **Cloudflare Workers** | - | AI Backend |
| **PayPal API** | - | Payment Processing |
| **GitHub API** | - | Repository Management |

---

## 📥 Instalasi

### Prerequisites
- Ruby 3.0+
- Bundler
- Node.js (optional, untuk development)

### Install Dependencies

```bash
# Install Ruby dependencies
bundle install

# Atau jika menggunakan npm (untuk development)
npm install
```

---

## 🏃‍♂️ Running

### Development Mode

```bash
# Build dan serve dengan Jekyll
bundle exec jekyll serve

# Atau dengan watch mode
bundle exec jekyll serve --watch --livereload
```

Akses IDE di: `http://localhost:4000`
Akses Dashboard di: `http://localhost:4000/dashboard`

### Production Build

```bash
# Build untuk production
bundle exec jekyll build

# Output akan berada di _site/
```

---

## 🎨 Arsitektur

### CSS Architecture

Proyek menggunakan **modular CSS** dengan CSS Custom Properties:

```css
/* variables.css */
:root {
  --bg: #1a1a1a;
  --text: #e0e0e0;
  --accent: #4a9eff;
  /* ... */
}
```

**Load Order:**
1. `variables.css` - CSS Custom Properties
2. `base.css` - Base reset, typography, utilities
3. `ide.css` - IDE-specific components
4. `dashboard.css` - Dashboard-specific styles

### JavaScript Architecture

Proyek menggunakan **modular JavaScript** dengan load order yang terdefinisi:

**Load Order (di ide-assets.html):**
1. `variables.js` - State & DOM cache
2. `utils.js` - Utility functions
3. `file-ops.js` - File operations
4. `editor.js` - Editor rendering
5. `git.js` - Git operations
6. `ai.js` - AI chat & editing
7. `token.js` - Token billing
8. `ide.js` - Main IDE initialization
9. `app.js` - Project store

---

## 📂 Struktur File

### CSS Files

| File | Deskripsi |
|------|-----------|
| `variables.css` | CSS Custom Properties (warna, ukuran, spacing, dll) |
| `base.css` | Base reset, typography, forms, buttons, utility classes |
| `ide.css` | IDE layout, titlebar, sidebar, editor, chat panel |
| `dashboard.css` | Dashboard layout, project grid, GitHub profile |

### JavaScript Files

| File | Deskripsi |
|------|-----------|
| `variables.js` | State management, DOM cache, configuration |
| `utils.js` | Utility functions, UI helpers, modal, toast |
| `app.js` | Project store, snapshot management |
| `file-ops.js` | File operations (open, close, new, delete) |
| `editor.js` | Editor rendering, tabs, file tree |
| `git.js` | Git operations (clone, commit, push, pull) |
| `ai.js` | AI chat, file editing, PayPal integration |
| `token.js` | Token billing system, balance check |
| `ide.js` | Main IDE initialization, event listeners |
| `dashboard.js` | Dashboard functionality |

---

## 🔧 Konfigurasi

### Backend Worker URL

Set URL backend Cloudflare Worker di localStorage:
```javascript
localStorage.setItem('vibecode_worker', 'https://your-worker.workers.dev');
```

Atau edit di `variables.js`:
```javascript
DEFAULT_WORKER_URL: 'https://your-worker.workers.dev'
```

### AI Model

Pilih model AI di Settings:
- `@cf/qwen/qwen2.5-coder-32b-instruct` (Default)
- `@cf/qwen/qwen3-30b-a3b-fp8`
- `@cf/moonshotai/kimi-k2.7-code`
- `@cf/openai/gpt-oss-120b`
- `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b`

### Project Instructions

Set instruksi proyek untuk AI di Settings. Contoh:
```
Gunakan JavaScript vanilla, API aman, dan pertahankan style flat minimal.
```

---

## 🤖 AI Integration

### Cloudflare Workers AI

IDE terhubung ke Cloudflare Workers AI untuk:
- **Chat** - Tanya apa saja tentang coding
- **File Editing** - Minta AI untuk mengedit file
- **Code Generation** - Generate code baru

### Setup Backend

1. Deploy Cloudflare Worker dengan AI endpoints
2. Set Worker URL di Settings atau localStorage
3. Pastikan Worker memiliki access ke Workers AI

### Endpoints yang diperlukan:
- `POST /api/chat` - AI chat
- `POST /api/ai/edit-file` - Edit file dengan AI
- `GET /api/auth/me` - GitHub authentication
- `POST /api/git/*` - Git operations
- `POST /api/payments/*` - Token billing

---

## 💳 Token Billing

### Token Plans

| Plan | Tokens | Harga |
|------|--------|-------|
| Starter | 50,000 | $1 |
| Pro | 300,000 | $5 |
| Business | 1,500,000 | $20 |
| Enterprise | 10,000,000 | $100 |

### Top-Up via PayPal

1. Klik "Top-Up Token" di menu
2. Pilih paket
3. Akan diarahkan ke PayPal
4. Setelah pembayaran berhasil, token otomatis ditambahkan

### Billing Worker

Set billing worker URL di `token.js`:
```javascript
const billingWorkerUrl = 'https://ai-token-billing.your-domain.workers.dev';
```

---

## 📝 Git Integration

### Fitur Git
- **Clone Repository** - Clone repo GitHub
- **Commit** - Commit perubahan dengan pesan
- **Push** - Push ke remote
- **Pull** - Pull dari remote
- **Change Tracking** - Lihat status file

### Authentication

Login dengan GitHub untuk:
- Clone private repositories
- Push ke repositories
- Lihat profil GitHub

### GitHub Workflow

1. Klik "Login with GitHub" di dashboard
2. Autorisasi aplikasi
3. Clone repository
4. Edit file
5. Commit & push perubahan

---

## 📱 Responsive Design

### Breakpoints

| Breakpoint | Layout |
|------------|--------|
| > 1024px | Desktop (full layout) |
| 768px - 1024px | Tablet (adjusted widths) |
| < 768px | Mobile (hamburger menu, drawers) |
| < 400px | Small mobile (compact layout) |

### Mobile Features
- **Hamburger Menu** - Menu utama di sidebar
- **Drawer Panels** - Sidebar dan chat panel bisa dibuka/tutup
- **Bottom Navigation** - Activity bar di bagian bawah
- **Touch Optimized** - Tombol dan ikon yang mudah diklik

---

## 🎯 Shortcuts

| Shortcut | Aksi |
|----------|------|
| `Ctrl + N` | New File |
| `Ctrl + S` | Save File |
| `Ctrl + L` | Focus AI Chat |
| `Escape` | Close Drawers/Menu/Modal |

---

## 🤝 Kontribusi

### Cara Berkontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -am 'Tambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

### Development Guidelines

- Gunakan **modular approach** untuk CSS dan JS
- Ikuti **load order** yang sudah ditentukan
- Gunakan **CSS Custom Properties** untuk styling
- Pastikan **responsive** untuk semua ukuran layar
- Test di **browser modern** (Chrome, Firefox, Safari, Edge)

---

## 📜 Lisensi

MIT License - Lihat [LICENSE](LICENSE) untuk detail.

---

## 🙏 ucapan Terima Kasih

- [Cloudflare Workers](https://workers.cloudflare.com/) - AI Backend
- [Font Awesome](https://fontawesome.com/) - Icons
- [Jekyll](https://jekyllrb.com/) - Static Site Generator
- [PayPal](https://www.paypal.com/) - Payment Processing

---

## 📞 Kontak

- **Website**: [vibecode](https://vibecode-82m.pages.dev/)
- **GitHub**: [github vibecode](https://github.com/daffadevhosting/vibecode)
- **Email**: contact@vibecode.dev

---

**Built with ❤️ and Cloudflare Workers**

*Version: 1.1.0 | Build: 2026.08.24*
