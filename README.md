# 🌟 Uthsonova Blog

> A modern, full-stack blogging platform built with **React 18**, **Tailwind CSS v4**, **Node.js**, **Express**, **MongoDB Atlas**, **Google Gemini AI**, and **Cloudinary**. Featuring scheduled publishing via GitHub Actions cron, rich markdown support, dark/light themes, and interactive dashboards.

---

## 🔗 Live Deployments

| Component | Live Link |
| :--- | :--- |
| 🌐 **Frontend Application** | [https://blog-ppwc.vercel.app](https://blog-ppwc.vercel.app) *(Alternate: [https://blogclient01.vercel.app](https://blogclient01.vercel.app) / [https://blog-1ya8.vercel.app](https://blog-1ya8.vercel.app))* |
| ⚙️ **Backend API Service** | [https://blog-bo1i.vercel.app](https://blog-bo1i.vercel.app) *(Alternate: [https://blog-rho-five-23.vercel.app](https://blog-rho-five-23.vercel.app))* |
| 📑 **Interactive Swagger Docs** | [https://blog-bo1i.vercel.app/api-docs](https://blog-bo1i.vercel.app/api-docs) |
| 🐙 **GitHub Repository** | [https://github.com/Mdarman18/Blog](https://github.com/Mdarman18/Blog) |

---

## ✨ Key Features

- 🤖 **AI-Assisted Writing**: Integrate with **Google Gemini** (`gemini-3.5-flash-lite`) to generate structured blog posts and outlines with rate limiting (5 req / 15 min).
- ⏱️ **Scheduled Blog Publishing**: Authors can schedule blogs for future release. Automated GitHub Actions cron jobs (`daily-publish.yml`) trigger Vercel serverless hooks to publish on time.
- 📝 **Markdown Rich Content**: Full GitHub Flavored Markdown (GFM) support via `react-markdown` and `remark-gfm` with preview mode.
- 🖼️ **Cloud Media Optimization**: Multi-image upload pipeline with **Cloudinary** storage and **Sharp** compression.
- 🔐 **Robust Authentication & Roles**: JWT authentication supporting both cookies and Bearer tokens, with role-based permissions (`user`, `author`, `admin`).
- 💬 **Interactive Engagement**: Real-time view counters, like system, and nested comments discussion thread.
- 📊 **Author & Admin Dashboard**: Manage posts across `draft`, `scheduled`, and `publish` statuses with analytical view counts.
- 🌓 **Modern UI & Themes**: Built with **Tailwind CSS v4**, seamless Dark/Light mode switching, responsive navigation, and toast alerts (`react-hot-toast`).
- 🛡️ **Enterprise Security**: Hardened using **Helmet**, CORS origin allow-lists, **express-rate-limit**, and sanitize checks via **express-validator**.
- 📖 **Swagger OpenAPI**: Complete interactive API specifications accessible at `/api-docs`.

---

## 🛠️ Tech Stack

### Frontend (`/Client`)
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS v4, Lucide React icons
- **State Management**: Redux Toolkit & React Context API
- **Routing**: React Router DOM v6
- **Markdown**: React Markdown, Remark GFM
- **HTTP Client**: Axios with interceptors

### Backend (`/Server`)
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: Google Gemini API
- **Media Management**: Cloudinary & Sharp
- **Security & Utilities**: JWT, bcryptjs, Helmet, CORS, Morgan, Express-Rate-Limit, Express-Validator
- **Documentation**: Swagger UI & Swagger JSDoc

---

## 📁 Project Structure

```bash
Uthsonova Blog/
├── .github/
│   └── workflows/
│       └── daily-publish.yml      # GitHub Actions cron job for scheduled publishing
├── Client/                         # React Frontend (Vite)
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── api/                    # Axios instances and API services (auth, blog, admin)
│   │   ├── components/             # Reusable UI components (Navbar, Footer, ProtectedRoute, etc.)
│   │   ├── context/                # Theme and Auth context providers
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── pages/                  # Route views (Home, BlogDetail, CreateBlog, Dashboard, etc.)
│   │   ├── redux/                  # Redux slices and store configuration
│   │   ├── App.jsx                 # Main application routes & layout
│   │   ├── main.jsx                # Application root entry
│   │   └── index.css               # Design system & Tailwind styling
│   ├── .env.example                # Example client environment variables
│   ├── package.json
│   ├── vercel.json                 # Vercel SPA rewrite routing
│   └── vite.config.js
├── Server/                         # Express Backend API
│   ├── api/
│   │   └── index.js                # Serverless entry point for Vercel
│   ├── src/
│   │   ├── config/                 # DB connection, CORS options, Environment setup
│   │   ├── controllers/            # Route controllers (auth, blog, comment, AI, admin)
│   │   ├── middlewares/            # Auth guards, multer upload, error handling
│   │   ├── models/                 # Mongoose schemas (User, Blog, Comment)
│   │   ├── routes/                 # API routers (auth, blog, AI, admin, cron)
│   │   ├── swagger.js              # Swagger OpenAPI documentation setup
│   │   └── validators/             # Express-validator schemas
│   ├── .env.example                # Example backend environment variables
│   ├── app.js                      # Express app configuration & middlewares
│   ├── server.js                   # Local server entry point
│   ├── package.json
│   └── vercel.json                 # Vercel serverless routing
└── package.json                    # Workspace root
```

---

## ⚙️ Environment Variables

### Client (`Client/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000
# For Production:
# VITE_API_BASE_URL=https://blog-bo1i.vercel.app
```

### Server (`Server/.env`)
```env
PORT=8000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
ADMIN_SECRET_KEY=your_admin_registration_secret_key
CLIENT_ORIGIN=http://localhost:5173

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cron Job Secret
CRON_SECRET=your_secure_cron_secret_token
```

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Mdarman18/Blog.git
cd Blog
```

### 2. Configure Backend
```bash
cd Server
npm install
# Create .env based on the instructions above
npm start
```
The server will start at `http://localhost:8000` (API Docs at `http://localhost:8000/api-docs`).

### 3. Configure Frontend
```bash
cd ../Client
npm install
npm run dev
```
The client app will launch at `http://localhost:5173`.

---

## 📡 API Overview

| Method | Endpoint | Description | Protection |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user | Public |
| **POST** | `/api/auth/login` | Login and receive auth token | Public |
| **GET** | `/api/auth/me` | Fetch authenticated user profile | Bearer Token / Cookie |
| **GET** | `/api/blogs` | Get published blogs (pagination, filters, search) | Public |
| **GET** | `/api/blogs/:id` | Get blog post details and increment views | Public |
| **POST** | `/api/blogs` | Create a blog post (draft / scheduled / publish) | Protected (Author/Admin) |
| **PUT** | `/api/blogs/:id` | Update an existing blog | Protected (Author/Admin) |
| **DELETE** | `/api/blogs/:id` | Delete a blog post | Protected (Author/Admin) |
| **POST** | `/api/ai/generate` | Generate blog content with Google Gemini | Protected (Rate Limited) |
| **POST** | `/api/cron/publish-daily` | Publish scheduled posts whose time has passed | Protected (`x-cron-secret`) |

---

## 🚢 Deployment

- **Frontend**: Hosted on [Vercel](https://vercel.com) with standard Vite React build settings and SPA rewrite configuration (`vercel.json`).
- **Backend**: Hosted on [Vercel](https://vercel.com) serverless functions running `api/index.js`.
- **Scheduled Publishing**: Powered by `.github/workflows/daily-publish.yml` running periodically via GitHub Actions.

---

## 👤 Author

- **GitHub**: [@Mdarman18](https://github.com/Mdarman18)
- **Repository**: [https://github.com/Mdarman18/Blog](https://github.com/Mdarman18/Blog)

---

## 📄 License
This project is licensed under the **ISC License**.
