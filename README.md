ui : https://www.figma.com/design/aLXx1W6pZ3We8oZY6LXbKK/Lomba-UI-UX?node-id=0-1&p=f&t=J2G76lpxDCWttjp8-0

# Sejahtera AI

Sejahtera AI adalah aplikasi pemantau kesehatan harian dan rekomendasi nutrisi cerdas berbasis web. Aplikasi ini menggabungkan pencatatan metrik fisik, jurnal makanan, dan rekomendasi resep masakan cerdas (Koki AI) yang dianalisis secara real-time menggunakan *Large Language Model*.

### Note on Backend Restructuring
> Pada arsitektur awal, proyek ini terbagi menjadi dua subfolder terpisah `sejahtera-frontend` dan `sejahtera-backend`.
>
> Untuk mengoptimalkan integrasi *Serverless Functions* di Vercel serta menghindari kendala *Cross-Origin Resource Sharing* (CORS) & *multi-domain*, seluruh kode sumber backend Golang `controllers`, `models`, `routes`, `middlewares` **telah dipindahkan dan disatukan ke dalam root folder proyek utama Frontend**. 
> 
> *   Proses *entry point* backend Golang kini ditangani secara dinamis oleh Vercel melalui file **`api/index.go`**.
> *   File `main.go` bawaan backend asli tetap ada/diabaikan khusus untuk keperluan pengujian lokal *local development*.


---

## 🛠️ Tech Stack

### **Frontend**
*   **Framework/Library:** React.js + Vite (JavaScript / JSX)
*   **Styling:** CSS Custom (Emerald Green Health Theme)
*   **Icons & Assets:** Lucide React
*   **HTTP Client:** Axios (dengan Interceptor JWT)
*   **Linting:** Oxlint

### **Backend (Serverless API)**
*   **Language:** Go (Golang 1.22+)
*   **Framework:** Gin Gonic
*   **ORM:** GORM (Object-Relational Mapping)
*   **Auth:** JWT (JSON Web Tokens) & Bcrypt Hashing

### **Database & AI Engine**
*   **Database:** MySQL Serverless
*   **AI Engine:** Groq API (LLM - Llama Model)
