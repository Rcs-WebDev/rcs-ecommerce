# Go + gRPC + ReactJS E-Commerce (dengan Integrasi Midtrans Snap Sandbox)

Proyek ini adalah implementasi lengkap aplikasi e-commerce full-stack dengan arsitektur microservices berbasis **Go (Golang) dan gRPC** untuk backend, serta **ReactJS** untuk frontend. Pembayaran disimulasikan secara langsung dengan mengintegrasikan **Midtrans Snap Sandbox API**.

## Arsitektur & Teknologi Utama
1. **Backend (Go)**:
   - **gRPC Services**: Pemisahan tanggung jawab menjadi 4 service utama: `AuthService`, `ProductService`, `CartService`, dan `OrderService`.
   - **REST API Gateway**: Sebuah HTTP Gateway di Go yang berfungsi menjembatani React frontend ke gRPC backend. Gateway ini juga menangani validasi JWT token (middleware) dan menerima webhook notifikasi pembayaran dari Midtrans.
   - **SQLite & GORM**: Penyimpanan data lokal tanpa perlu konfigurasi database eksternal yang rumit. Data produk awal akan otomatis dimasukkan (seeded) saat server pertama kali dijalankan.
   - **Custom gRPC JSON Codec**: Proyek ini menggunakan encoder JSON kustom untuk gRPC. Hal ini memungkinkan gRPC berjalan langsung dengan struct Go standar tanpa mengharuskan Anda menginstal `protoc` compiler atau plugin protobuf di komputer lokal Anda.
2. **Frontend (ReactJS + Vite)**:
   - UI modern bertema gelap (*dark mode*) yang mewah menggunakan CSS Glassmorphic kustom.
   - Manajemen State menggunakan React Context API.
   - Integrasi langsung dengan popup pembayaran Midtrans Snap.

---

## Prasyarat System
Sebelum menjalankan aplikasi, pastikan Anda telah memiliki komponen berikut terinstal di komputer Anda:
1. **Go (Golang)**: Versi 1.21 ke atas ([Download Go](https://go.dev/dl/))
2. **Node.js**: Versi 18 ke atas ([Download Node.js](https://nodejs.org/))

---

## Panduan Menjalankan Aplikasi

### 1. Menjalankan Go Backend
1. Buka terminal baru dan masuk ke direktori `backend`:
   ```bash
   cd backend
   ```
2. Jalankan perintah untuk mengunduh semua library dependensi Go:
   ```bash
   go mod tidy
   ```
3. Jalankan server backend (gRPC di port `50051` dan HTTP Gateway di port `8080` akan berjalan secara bersamaan):
   ```bash
   go run cmd/main.go
   ```
   *Catatan: File database `ecommerce.db` akan dibuat secara otomatis di folder `backend`.*

---

### 2. Menjalankan React Frontend
1. Buka terminal baru lagi dan masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```
2. Instal semua dependensi frontend:
   ```bash
   npm install
   ```
3. Jalankan server development React (Vite):
   ```bash
   npm run dev
   ```
4. Buka browser Anda dan akses `http://localhost:5173`.

---

## Alur Pengujian Pembayaran Midtrans Sandbox
1. Di halaman utama, klik tombol **Register** untuk membuat akun baru, lalu **Login**.
2. Jelajahi katalog produk premium dan tambahkan beberapa item ke keranjang belanja Anda.
3. Klik ikon Keranjang di pojok kanan atas untuk membuka drawer keranjang belanja.
4. Klik **Checkout (Midtrans)**. Aplikasi backend akan membuat pesanan di database SQLite, mengurangi stok produk, dan meminta token transaksi pembayaran dari Midtrans.
5. Pop-up **Midtrans Snap** akan muncul langsung di dalam aplikasi React Anda.
6. Anda bisa memilih metode pembayaran simulasi (misalnya **Bank Transfer** -> **Permata / BNI / Mandiri** atau **GoPay / QRIS**).
7. Salin nomor Virtual Account yang muncul untuk melakukan pembayaran simulasi.
8. Buka halaman simulator Midtrans ([Midtrans Sandbox Simulator](https://docs.midtrans.com/en/technical-reference/sandbox-test-credentials)) untuk menyimulasikan transfer Virtual Account/QRIS agar status transaksi berubah menjadi **Paid** (Lunas).
9. Setelah disimulasikan lunas, status pesanan Anda di backend akan otomatis terupdate via webhook notification (`POST /api/payment/notification`) dan stok produk akan dikelola dengan konsisten.

