require('dotenv').config(); // Memuat variabel lingkungan dari file .env
const express = require('express'); // Mengimpor Express
const cors = require('cors'); // Mengimpor Cors untuk mengizinkan akses lintas domain
const anggotaRoutes = require('./routes/anggota'); // Mengimpor rute untuk anggota
const authRoutes = require('./routes/auth'); // Mengimpor rute untuk autentikasi
const bukuRoutes = require('./routes/buku'); // Mengimpor rute untuk buku
const peminjamanRoutes = require('./routes/peminjaman'); // Mengimpor rute untuk peminjaman
const pengembalianRoutes = require('./routes/pengembalian'); // **Mengimpor rute untuk pengembalian**

const app = express(); // Membuat aplikasi Express

// Middleware
app.use(cors()); // Mengizinkan akses lintas domain
app.use(express.json()); // Middleware untuk parsing JSON dari body request

// Rute utama aplikasi
app.use('/api/anggota', anggotaRoutes); // Rute untuk operasi anggota
app.use('/api/auth', authRoutes); // Rute untuk login dan registrasi
app.use('/api/buku', bukuRoutes); // Rute untuk operasi buku
app.use('/api/peminjaman', peminjamanRoutes); // Rute untuk operasi peminjaman
app.use('/api/pengembalian', pengembalianRoutes); // **Rute untuk operasi pengembalian**

 // Middleware untuk menangani rute yang tidak ditemukan (404)
app.use((req, res, next) => {
    res.status(404).json({ pesan: 'Endpoint tidak ditemukan' }); // Mengembalikan pesan error 404
});

// Middleware untuk menangani error global
app.use((err, req, res, next) => {
    console.error('Kesalahan:', err.stack); // Menampilkan log error di konsol
    res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message }); // Mengembalikan pesan error 500
});

// Memulai server
const PORT = process.env.PORT || 3000; // Menggunakan port dari environment variable atau default ke 3000
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`); // Pesan untuk menunjukkan bahwa server berjalan
});
