---

# 1. **Kode: Database Connection (`database.js`)**

Kode ini digunakan untuk mengatur koneksi ke database MySQL. Koneksi ini memungkinkan aplikasi untuk mengakses dan mengelola data dalam database.

---

## Penjelasan Kode

### 1. **Inisialisasi Modul MySQL**
```javascript
const mysql = require('mysql');
```
- Mengimpor modul `mysql`, yang digunakan untuk mengelola koneksi ke database MySQL.

---

### 2. **Membuat Koneksi ke Database**
```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'perpustakaan_digital'
});
```
- **`host`**: Alamat server database, diatur ke `localhost`.  
- **`user`**: Nama pengguna database, diatur sebagai `root`.  
- **`password`**: Kata sandi untuk pengguna database, diatur kosong (tidak disarankan untuk produksi).  
- **`database`**: Nama database yang digunakan, yaitu `perpustakaan_digital`.

---

### 3. **Menghubungkan ke Database**
```javascript
db.connect((err) => {
    if (err) {
        console.error('Koneksi ke database gagal:', err);
        process.exit(1);
    }
    console.log('Berhasil terhubung ke database');
});
```
- Fungsi `db.connect()` digunakan untuk menginisialisasi koneksi ke database.  
  - **Jika koneksi berhasil**:  
    - Menampilkan pesan `Berhasil terhubung ke database` di konsol.  
  - **Jika koneksi gagal**:  
    - Mencetak pesan error ke konsol, termasuk detail kesalahan.  
    - Menghentikan proses aplikasi dengan `process.exit(1)`.

---

### 4. **Ekspor Modul**
```javascript
module.exports = db;
```
- Mengekspor koneksi database sehingga dapat digunakan di file lain.  
- Contoh penggunaannya:
  ```javascript
  const db = require('./database');
  ```

---


---

# 2. **Kode: Middleware Autentikasi (`middlewares/auth.js`)**

Kode ini digunakan untuk melakukan autentikasi token JWT pada setiap request yang masuk, memastikan bahwa hanya pengguna yang memiliki token valid yang dapat mengakses resource tertentu.

---

## Penjelasan Kode

### 1. **Mengimpor Modul JWT**
```javascript
const jwt = require('jsonwebtoken');
```
- Mengimpor modul `jsonwebtoken` yang digunakan untuk memverifikasi token JWT.

---

### 2. **Fungsi Utama: `autentikasiToken`**
```javascript
function autentikasiToken(req, res, next) {
    // Logika autentikasi di dalam fungsi ini
}
```
- Fungsi ini adalah middleware yang akan memproses setiap request untuk memeriksa keberadaan dan validitas token JWT.  

---

### 3. **Mode Pengembangan**
```javascript
if (process.env.NODE_ENV === 'development') {
    req.pengguna = { id: 1, email: 'Bam1@gmail.com', nama: 'Bam' }; // Data pengguna mock
    console.log('Mode pengembangan: autentikasi diabaikan');
    return next();
}
```
- Jika aplikasi berjalan dalam **mode pengembangan**, autentikasi diabaikan dan data pengguna mock disematkan langsung ke dalam request (`req.pengguna`).  

---

### 4. **Pemeriksaan Header Otorisasi**
```javascript
const headerOtorisasi = req.headers['authorization'];

if (!headerOtorisasi || !headerOtorisasi.startsWith('Bearer ')) {
    return res.status(401).json({ pesan: 'Akses ditolak, token tidak tersedia atau format salah' });
}
```
- Memeriksa apakah header otorisasi ada dan menggunakan format yang benar (`Bearer <token>`).  
- Jika header tidak valid, response status `401 Unauthorized` dikembalikan.

---

### 5. **Ekstraksi Token**
```javascript
const token = headerOtorisasi.split(' ')[1];

if (!token) {
    return res.status(401).json({ pesan: 'Akses ditolak, token tidak tersedia' });
}
```
- Ekstraksi token dari header otorisasi.  
- Jika token tidak ditemukan, response status `401 Unauthorized` dikembalikan.

---

### 6. **Verifikasi Token JWT**
```javascript
jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, pengguna) => {
    if (err) {
        console.error('Kesalahan Verifikasi JWT:', err.message);
        return res.status(403).json({ pesan: 'Token tidak valid atau sudah kadaluarsa' });
    }

    req.pengguna = pengguna;

    next();
});
```
- Token JWT diverifikasi menggunakan `jwt.verify()`.  
- **Jika valid**: Data pengguna dari token disematkan ke `req.pengguna` dan request dilanjutkan ke middleware berikutnya dengan `next()`.  
- **Jika tidak valid**: Response status `403 Forbidden` dikembalikan.

---

### 7. **Ekspor Fungsi**
```javascript
module.exports = autentikasiToken;
```
- Middleware `autentikasiToken` diekspor agar dapat digunakan di file lain.

---


---

# 3. **Kode: Aplikasi Utama (`app.js`)**



---

## Penjelasan Kode

### 1. **Mengimpor Modul dan Konfigurasi**
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const anggotaRoutes = require('./routes/anggota');
const authRoutes = require('./routes/auth');
const bukuRoutes = require('./routes/buku');
const peminjamanRoutes = require('./routes/peminjaman');
const pengembalianRoutes = require('./routes/pengembalian');
```
- **`dotenv`**: Menggunakan file `.env` untuk menyimpan konfigurasi lingkungan, seperti port server atau secret key.
- **`express`**: Framework utama untuk membuat server aplikasi web.
- **`cors`**: Digunakan untuk mengizinkan permintaan dari sumber yang berbeda (Cross-Origin Resource Sharing).
- **Routing**: Mengimpor file route yang berisi logika masing-masing endpoint (anggota, auth, buku, peminjaman, dan pengembalian).

---

### 2. **Inisialisasi Aplikasi Express**
```javascript
const app = express();
```
- Membuat instance aplikasi Express.

---

### 3. **Menambahkan Middleware**
```javascript
app.use(cors());
app.use(express.json());
```
- **`cors()`**: Mengaktifkan CORS agar aplikasi dapat menerima permintaan dari sumber domain yang berbeda.
- **`express.json()`**: Mem-parsing request body yang dikirimkan dalam format JSON.

---

### 4. **Routing Endpoint**
```javascript
app.use('/api/anggota', anggotaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/buku', bukuRoutes);
app.use('/api/peminjaman', peminjamanRoutes);
app.use('/api/pengembalian', pengembalianRoutes);
```
- Menentukan jalur utama untuk masing-masing modul:
  - `/api/anggota`: Berisi endpoint terkait anggota.
  - `/api/auth`: Berisi endpoint terkait autentikasi.
  - `/api/buku`: Berisi endpoint terkait pengelolaan buku.
  - `/api/peminjaman`: Berisi endpoint terkait peminjaman buku.
  - `/api/pengembalian`: Berisi endpoint terkait pengembalian buku.

---

### 5. **Middleware Penanganan Error (404)**
```javascript
app.use((req, res, next) => {
    res.status(404).json({ pesan: 'Endpoint tidak ditemukan' });
});
```
- Middleware ini akan menangani request yang tidak sesuai dengan endpoint yang tersedia, mengembalikan response dengan status `404 Not Found`.

---

### 6. **Middleware Penanganan Error Server**
```javascript
app.use((err, req, res, next) => {
    console.error('Kesalahan:', err.stack);
    res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
});
```
- Menangkap kesalahan yang terjadi di server dan mengembalikan response dengan status `500 Internal Server Error`.
- **Logging**: Kesalahan akan ditampilkan di konsol untuk memudahkan debugging.

---

### 7. **Menjalankan Server**
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
```
- Menentukan port server:
  - **Jika `process.env.PORT` ada**: Menggunakan port yang ditentukan di file `.env`.
  - **Jika tidak**: Server berjalan pada port `3000` secara default.
- Menjalankan server dan menampilkan pesan keberhasilan di konsol.

---



---

# 4. **Kode: Routing Anggota (`routes/anggota.js`)**

File ini mengatur endpoint CRUD (Create, Read, Update, Delete) untuk entitas **Anggota** dalam aplikasi perpustakaan digital. Semua endpoint memanfaatkan middleware autentikasi (`autentikasiToken`) untuk memvalidasi token JWT.

---

## Penjelasan Kode

### 1. **Mengimpor Modul dan Middleware**
```javascript
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const autentikasiToken = require('../middlewares/auth');
```
- **`express.Router()`**: Membuat instance router untuk memisahkan logika endpoint anggota.
- **`db`**: Mengimpor konfigurasi koneksi database.
- **`autentikasiToken`**: Middleware untuk memvalidasi token JWT di setiap permintaan.

---

### 2. **Endpoint: Mendapatkan Semua Anggota**
```javascript
router.get('/', autentikasiToken, (req, res) => {
    db.query('SELECT * FROM anggota', (err, hasil) => {
        if (err) return res.status(500).json({ pesan: err.message });
        if (hasil.length === 0) return res.status(404).json({ pesan: 'Tidak ada anggota yang ditemukan' });
        res.json(hasil);
    });
});
```
- **Method**: `GET`
- **URL**: `/api/anggota`
- **Deskripsi**: Mengambil daftar semua anggota dari database.
- **Middleware**: `autentikasiToken`
- **Respon**:
  - **200**: Berhasil mengambil data anggota.
  - **404**: Tidak ada anggota ditemukan.
  - **500**: Kesalahan server.

---

### 3. **Endpoint: Mendapatkan Anggota Berdasarkan ID**
```javascript
router.get('/:id', autentikasiToken, (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM anggota WHERE id = ?', [id], (err, hasil) => {
        if (err) return res.status(500).json({ pesan: err.message });
        if (hasil.length === 0) return res.status(404).json({ pesan: 'Anggota tidak ditemukan' });
        res.json(hasil[0]);
    });
});
```
- **Method**: `GET`
- **URL**: `/api/anggota/:id`
- **Deskripsi**: Mengambil data anggota berdasarkan ID.
- **Middleware**: `autentikasiToken`
- **Respon**:
  - **200**: Data anggota ditemukan.
  - **404**: Data anggota tidak ditemukan.
  - **500**: Kesalahan server.

---

### 4. **Endpoint: Menambahkan Anggota Baru**
```javascript
router.post('/', autentikasiToken, (req, res) => {
    const { nama, email, password, tanggal_keanggotaan } = req.body;

    if (!nama || !email || !password || !tanggal_keanggotaan) {
        return res.status(400).json({ pesan: 'Semua kolom harus diisi' });
    }

    db.query(
        'INSERT INTO anggota (nama, email, password, tanggal_keanggotaan) VALUES (?, ?, ?, ?)',
        [nama, email, password, tanggal_keanggotaan],
        (err, hasil) => {
            if (err) return res.status(500).json({ pesan: err.message });
            res.status(201).json({ pesan: 'Anggota berhasil ditambahkan', id: hasil.insertId });
        }
    );
});
```
- **Method**: `POST`
- **URL**: `/api/anggota`
- **Deskripsi**: Menambahkan data anggota baru.
- **Middleware**: `autentikasiToken`
- **Respon**:
  - **201**: Anggota berhasil ditambahkan.
  - **400**: Input tidak valid.
  - **500**: Kesalahan server.

---

### 5. **Endpoint: Memperbarui Data Anggota**
```javascript
router.put('/:id', autentikasiToken, (req, res) => {
    const { id } = req.params;
    const { nama, email, password, tanggal_keanggotaan } = req.body;

    if (!nama || !email || !password || !tanggal_keanggotaan) {
        return res.status(400).json({ pesan: 'Semua kolom harus diisi' });
    }

    db.query('SELECT * FROM anggota WHERE id = ?', [id], (err, hasil) => {
        if (err) return res.status(500).json({ pesan: err.message });
        if (hasil.length === 0) return res.status(404).json({ pesan: 'Anggota tidak ditemukan' });

        db.query(
            'UPDATE anggota SET nama = ?, email = ?, password = ?, tanggal_keanggotaan = ? WHERE id = ?',
            [nama, email, password, tanggal_keanggotaan, id],
            (err) => {
                if (err) return res.status(500).json({ pesan: err.message });
                res.json({ pesan: 'Anggota berhasil diperbarui' });
            }
        );
    });
});
```
- **Method**: `PUT`
- **URL**: `/api/anggota/:id`
- **Deskripsi**: Memperbarui data anggota berdasarkan ID.
- **Middleware**: `autentikasiToken`
- **Respon**:
  - **200**: Anggota berhasil diperbarui.
  - **400**: Input tidak valid.
  - **404**: Anggota tidak ditemukan.
  - **500**: Kesalahan server.

---

### 6. **Endpoint: Menghapus Anggota**
```javascript
router.delete('/:id', autentikasiToken, (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM anggota WHERE id = ?', [id], (err, hasil) => {
        if (err) return res.status(500).json({ pesan: err.message });
        if (hasil.length === 0) return res.status(404).json({ pesan: 'Anggota tidak ditemukan' });

        db.query('DELETE FROM anggota WHERE id = ?', [id], (err) => {
            if (err) return res.status(500).json({ pesan: err.message });
            res.json({ pesan: 'Anggota berhasil dihapus' });
        });
    });
});
```
- **Method**: `DELETE`
- **URL**: `/api/anggota/:id`
- **Deskripsi**: Menghapus data anggota berdasarkan ID.
- **Middleware**: `autentikasiToken`
- **Respon**:
  - **200**: Anggota berhasil dihapus.
  - **404**: Anggota tidak ditemukan.
  - **500**: Kesalahan server.

---



---

# 5. **Kode: Controller Anggota (`controllers/anggotacontrollers.js`)**

File ini berfungsi sebagai **controller** yang menangani logika bisnis untuk operasi CRUD (Create, Read, Update, Delete) pada entitas **Anggota**. Controller ini terpisah dari file routing untuk menjaga struktur kode tetap modular dan mudah dikelola.

---

## Penjelasan Kode

### 1. **Mengimpor Modul**
```javascript
const db = require('../config/database');
```
- **`db`**: Mengimpor konfigurasi database untuk melakukan query ke MySQL.

---

### 2. **Fungsi: `ambilSemuaAnggota`**
```javascript
exports.ambilSemuaAnggota = (req, res) => {
    db.query('SELECT * FROM anggota', (err, hasil) => {
        if (err) return res.status(500).json({ error: err.message });
        if (hasil.length === 0) return res.status(404).json({ pesan: 'Data anggota tidak ditemukan' });
        res.json(hasil);
    });
};
```
- **Deskripsi**: Mengambil semua data anggota dari tabel `anggota`.
- **Respon**:
  - **200**: Data anggota ditemukan.
  - **404**: Tidak ada data anggota yang ditemukan.
  - **500**: Kesalahan server saat query database.

---

### 3. **Fungsi: `tambahAnggota`**
```javascript
exports.tambahAnggota = (req, res) => {
    const { nama, email, password, tanggal_keanggotaan } = req.body;

    if (!nama || !email || !password || !tanggal_keanggotaan) {
        return res.status(400).json({ pesan: 'Semua kolom wajib diisi' });
    }

    db.query(
        'INSERT INTO anggota (nama, email, password, tanggal_keanggotaan) VALUES (?, ?, ?, ?)',
        [nama, email, password, tanggal_keanggotaan],
        (err, hasil) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ pesan: 'Anggota berhasil ditambahkan', id: hasil.insertId });
        }
    );
};
```
- **Deskripsi**: Menambahkan data anggota baru ke dalam tabel `anggota`.
- **Validasi Input**: Semua kolom wajib diisi (`nama`, `email`, `password`, `tanggal_keanggotaan`).
- **Respon**:
  - **201**: Data anggota berhasil ditambahkan.
  - **400**: Input tidak valid atau kolom kosong.
  - **500**: Kesalahan server saat menyimpan data.

---

### 4. **Fungsi: `perbaruiAnggota`**
```javascript
exports.perbaruiAnggota = (req, res) => {
    const { id } = req.params;
    const { nama, email, password, tanggal_keanggotaan } = req.body;

    if (!nama || !email || !password || !tanggal_keanggotaan) {
        return res.status(400).json({ pesan: 'Semua kolom wajib diisi' });
    }

    db.query('SELECT * FROM anggota WHERE id = ?', [id], (err, hasil) => {
        if (err) return res.status(500).json({ error: err.message });
        if (hasil.length === 0) return res.status(404).json({ pesan: 'Anggota tidak ditemukan' });

        db.query(
            'UPDATE anggota SET nama = ?, email = ?, password = ?, tanggal_keanggotaan = ? WHERE id = ?',
            [nama, email, password, tanggal_keanggotaan, id],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ pesan: 'Data anggota berhasil diperbarui' });
            }
        );
    });
};
```
- **Deskripsi**: Memperbarui data anggota berdasarkan ID.
- **Validasi Input**: Semua kolom wajib diisi.
- **Respon**:
  - **200**: Data anggota berhasil diperbarui.
  - **400**: Input tidak valid atau kolom kosong.
  - **404**: Data anggota tidak ditemukan berdasarkan ID.
  - **500**: Kesalahan server saat memperbarui data.

---

### 5. **Fungsi: `hapusAnggota`**
```javascript
exports.hapusAnggota = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM anggota WHERE id = ?', [id], (err, hasil) => {
        if (err) return res.status(500).json({ error: err.message });
        if (hasil.length === 0) return res.status(404).json({ pesan: 'Anggota tidak ditemukan' });

        db.query('DELETE FROM anggota WHERE id = ?', [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ pesan: 'Anggota berhasil dihapus' });
        });
    });
};
```
- **Deskripsi**: Menghapus data anggota berdasarkan ID.
- **Respon**:
  - **200**: Data anggota berhasil dihapus.
  - **404**: Data anggota tidak ditemukan berdasarkan ID.
  - **500**: Kesalahan server saat menghapus data.

---


---

# 6. **Kode: Routes Buku (`routes/buku.js`)**

File ini berfungsi untuk mendefinisikan rute API terkait entitas **Buku**. Setiap rute terhubung dengan controller dan middleware autentikasi token untuk memastikan hanya pengguna yang memiliki token valid yang dapat mengaksesnya.

---

## Penjelasan Kode

### 1. **Mengimpor Modul**
```javascript
const express = require('express');
const router = express.Router();
const bukuController = require('../controllers/bukuController.js'); 
const authenticateToken = require('../middlewares/auth'); 
```
- **`express`**: Modul untuk membuat router.
- **`bukuController`**: Controller yang menangani logika bisnis untuk entitas Buku.
- **`authenticateToken`**: Middleware untuk memverifikasi token JWT.

---

### 2. **Rute: `GET /`**
```javascript
router.get('/', authenticateToken, bukuController.getAllBooks);
```
- **Endpoint**: `/api/buku`
- **Fungsi**: Mengambil semua data buku.
- **Middleware**: `authenticateToken` untuk autentikasi pengguna.

---

### 3. **Rute: `GET /:id`**
```javascript
router.get('/:id', authenticateToken, bukuController.getBookById);
```
- **Endpoint**: `/api/buku/:id`
- **Fungsi**: Mengambil data buku berdasarkan ID.
- **Parameter**: 
  - `id` (path parameter) - ID buku yang ingin diambil.
- **Middleware**: `authenticateToken`.

---

### 4. **Rute: `POST /`**
```javascript
router.post('/', authenticateToken, bukuController.addBook);
```
- **Endpoint**: `/api/buku`
- **Fungsi**: Menambahkan data buku baru.
- **Middleware**: `authenticateToken`.

---

### 5. **Rute: `PUT /:id`**
```javascript
router.put('/:id', authenticateToken, bukuController.updateBook);
```
- **Endpoint**: `/api/buku/:id`
- **Fungsi**: Memperbarui data buku berdasarkan ID.
- **Parameter**:
  - `id` (path parameter) - ID buku yang ingin diperbarui.
- **Middleware**: `authenticateToken`.

---

### 6. **Rute: `DELETE /:id`**
```javascript
router.delete('/:id', authenticateToken, bukuController.deleteBook);
```
- **Endpoint**: `/api/buku/:id`
- **Fungsi**: Menghapus data buku berdasarkan ID.
- **Parameter**:
  - `id` (path parameter) - ID buku yang ingin dihapus.
- **Middleware**: `authenticateToken`.

---

### 7. **Ekspor Modul**
```javascript
module.exports = router;
```
- Meng-ekspor router untuk digunakan di file utama aplikasi (`app.js`).
  


---

# 7. **Kode: Controllers Buku (`controllers/bukuController.js`)**

File ini bertugas menangani logika bisnis dari semua operasi terkait entitas **Buku**, seperti mendapatkan, menambah, memperbarui, dan menghapus data buku. File ini menggunakan database sebagai tempat penyimpanan data.

---

## Penjelasan Kode

### 1. **Mengimpor Modul**
```javascript
const db = require('../config/database');
const { body, validationResult } = require('express-validator');
```
- **`db`**: Koneksi database untuk menjalankan query SQL.
- **`express-validator`**: Digunakan untuk melakukan validasi data pada input.

---

### 2. **Fungsi: `getAllBooks`**
```javascript
exports.getAllBooks = (req, res) => {
    db.query('SELECT * FROM buku', (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
        }
        res.status(200).json({ pesan: 'Data buku berhasil diambil', data: results });
    });
};
```
- **Fungsi**: Mengambil semua data buku dari database.
- **Respon**: 
  - Status `200` dengan data buku.
  - Status `500` jika terjadi kesalahan server.

---

### 3. **Fungsi: `getBookById`**
```javascript
exports.getBookById = (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ pesan: 'ID buku harus berupa angka' });
    }

    db.query('SELECT * FROM buku WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ pesan: 'Buku tidak ditemukan' });
        }
        res.status(200).json({ pesan: 'Detail buku berhasil diambil', data: results[0] });
    });
};
```
- **Fungsi**: Mengambil data buku berdasarkan ID.
- **Parameter**:
  - `id` (path parameter) - ID buku.
- **Respon**:
  - Status `200` jika data ditemukan.
  - Status `404` jika buku tidak ditemukan.
  - Status `400` jika ID tidak valid.

---

### 4. **Fungsi: `addBook`**
```javascript
exports.addBook = [
    body('judul').notEmpty().withMessage('Judul harus diisi'),
    body('penulis').notEmpty().withMessage('Penulis harus diisi'),
    body('tanggal_terbit').isDate().withMessage('Tanggal terbit harus berupa tanggal yang valid'),
    body('genre').notEmpty().withMessage('Genre harus diisi'),
    body('salinan_tersedia').isInt({ min: 0 }).withMessage('Salinan tersedia harus berupa angka dan minimal 0'),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ pesan: 'Input tidak valid', errors: errors.array() });
        }

        const { judul, penulis, tanggal_terbit, genre, salinan_tersedia } = req.body;
        db.query(
            'INSERT INTO buku (judul, penulis, tanggal_terbit, genre, salinan_tersedia) VALUES (?, ?, ?, ?, ?)',
            [judul, penulis, tanggal_terbit, genre, salinan_tersedia],
            (err, results) => {
                if (err) {
                    console.error('Database Error:', err);
                    return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
                }
                res.status(201).json({ pesan: 'Buku berhasil ditambahkan', data: { id: results.insertId } });
            }
        );
    }
];
```
- **Fungsi**: Menambahkan data buku baru.
- **Validasi**: 
  - Kolom harus diisi dengan format tertentu.
- **Respon**: 
  - Status `201` jika data berhasil ditambahkan.
  - Status `400` jika input tidak valid.

---

### 5. **Fungsi: `updateBook`**
```javascript
exports.updateBook = [
    body('judul').optional().notEmpty().withMessage('Judul harus diisi'),
    body('penulis').optional().notEmpty().withMessage('Penulis harus diisi'),
    body('tanggal_terbit').optional().isDate().withMessage('Tanggal terbit harus berupa tanggal yang valid'),
    body('genre').optional().notEmpty().withMessage('Genre harus diisi'),
    body('salinan_tersedia').optional().isInt({ min: 0 }).withMessage('Salinan tersedia harus berupa angka dan minimal 0'),

    (req, res) => {
        const { id } = req.params;
        if (isNaN(id)) {
            return res.status(400).json({ pesan: 'ID buku harus berupa angka' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ pesan: 'Input tidak valid', errors: errors.array() });
        }

        const { judul, penulis, tanggal_terbit, genre, salinan_tersedia } = req.body;

        db.query(
            'UPDATE buku SET judul = ?, penulis = ?, tanggal_terbit = ?, genre = ?, salinan_tersedia = ? WHERE id = ?',
            [judul, penulis, tanggal_terbit, genre, salinan_tersedia, id],
            (err, results) => {
                if (err) {
                    console.error('Database Error:', err);
                    return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ pesan: 'Buku tidak ditemukan' });
                }
                res.status(200).json({ pesan: 'Buku berhasil diperbarui' });
            }
        );
    }
];
```
- **Fungsi**: Memperbarui data buku.
- **Validasi**: Kolom bersifat opsional namun harus valid jika diisi.
- **Respon**: 
  - Status `200` jika data berhasil diperbarui.
  - Status `404` jika buku tidak ditemukan.

---

### 6. **Fungsi: `deleteBook`**
```javascript
exports.deleteBook = (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ pesan: 'ID buku harus berupa angka' });
    }

    db.query('DELETE FROM buku WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ pesan: 'Buku tidak ditemukan' });
        }
        res.status(200).json({ pesan: 'Buku berhasil dihapus' });
    });
};
```
- **Fungsi**: Menghapus data buku berdasarkan ID.
- **Respon**: 
  - Status `200` jika data berhasil dihapus.
  - Status `404` jika buku tidak ditemukan.

--- 



---

# 8. **Kode: Routes Peminjaman (`routes/peminjaman.js`)**

```javascript
const express = require('express');
const router = express.Router();
const peminjamanController = require('../controllers/peminjamanController.js');
const authenticateToken = require('../middlewares/auth');

router.get('/', authenticateToken, peminjamanController.getAllPeminjaman);
router.get('/:id', authenticateToken, peminjamanController.getPeminjamanById);
router.post('/', authenticateToken, peminjamanController.createPeminjaman);
router.put('/:id', authenticateToken, peminjamanController.updatePeminjaman);
router.delete('/:id', authenticateToken, peminjamanController.deletePeminjaman);

module.exports = router;
```

Penjelasan singkat:
- **Fungsi Utama**: File ini bertanggung jawab untuk mengatur **routing** terkait entitas **Peminjaman**.
- **Endpoint**:
  - `GET /`: Mendapatkan semua data peminjaman.
  - `GET /:id`: Mendapatkan detail peminjaman berdasarkan ID.
  - `POST /`: Membuat peminjaman baru.
  - `PUT /:id`: Memperbarui data peminjaman berdasarkan ID.
  - `DELETE /:id`: Menghapus data peminjaman berdasarkan ID.
- **Middleware `authenticateToken`**:
  - Memastikan hanya pengguna dengan token yang valid dapat mengakses endpoint.
- **Controller**: Logika bisnis untuk setiap endpoint ditangani oleh file `controllers/peminjamanController.js`.

# 9. **Kode : Controller Pinjaman (controllers/peminjamanController.js)**:

---

### 1. **`getAllPeminjaman`**  
- **Tujuan**: Mengambil semua data peminjaman dari tabel `peminjaman`.  
- **Kode Utama**:
  ```javascript
  db.query('SELECT * FROM peminjaman', (err, results) => { ... });
  ```
  - Mengambil semua data tanpa filter.
  - Jika ada error, server mengembalikan **HTTP 500** dengan pesan kesalahan.
  - Jika berhasil, server mengembalikan **HTTP 200** dengan data.

---

### 2. **`getPeminjamanById`**  
- **Tujuan**: Mengambil data peminjaman berdasarkan `id`.  
- **Validasi**:
  ```javascript
  if (isNaN(id)) {
      return res.status(400).json({ pesan: 'ID peminjaman harus berupa angka' });
  }
  ```
  - Memastikan bahwa `id` adalah angka.
- **Kode Utama**:
  ```javascript
  db.query('SELECT * FROM peminjaman WHERE id = ?', [id], (err, results) => { ... });
  ```
  - Menggunakan query dengan filter `id`.
  - Jika data tidak ditemukan, server mengembalikan **HTTP 404**.
  - Jika berhasil, data spesifik peminjaman dikembalikan dengan **HTTP 200**.

---

### 3. **`createPeminjaman`**  
- **Tujuan**: Membuat entri baru di tabel `peminjaman`.  
- **Validasi Input**:
  ```javascript
  body('id_buku').isInt({ min: 1 }).withMessage('ID buku harus berupa angka positif'),
  body('id_anggota').isInt({ min: 1 }).withMessage('ID anggota harus berupa angka positif'),
  body('tanggal_peminjaman').isDate().withMessage('Tanggal peminjaman harus berupa tanggal yang valid'),
  body('tanggal_jatuh_tempo').isDate().withMessage('Tanggal jatuh tempo harus berupa tanggal yang valid'),
  ```
  - Memastikan semua field wajib diisi dan dalam format yang benar.
- **Kode Utama**:
  ```javascript
  db.query(
      'INSERT INTO peminjaman (id_buku, id_anggota, tanggal_peminjaman, tanggal_jatuh_tempo) VALUES (?, ?, ?, ?)',
      [id_buku, id_anggota, tanggal_peminjaman, tanggal_jatuh_tempo],
      ...
  );
  ```
  - Menyimpan data baru ke tabel `peminjaman`.
  - Jika berhasil, server mengembalikan **HTTP 201** dengan ID dari data yang baru dibuat.

---

### 4. **`updatePeminjaman`**  
- **Tujuan**: Memperbarui data peminjaman berdasarkan `id`.  
- **Validasi Input**:
  ```javascript
  body('id_buku').optional().isInt({ min: 1 }).withMessage('ID buku harus berupa angka positif'),
  body('id_anggota').optional().isInt({ min: 1 }).withMessage('ID anggota harus berupa angka positif'),
  body('tanggal_peminjaman').optional().isDate().withMessage('Tanggal peminjaman harus berupa tanggal yang valid'),
  body('tanggal_jatuh_tempo').optional().isDate().withMessage('Tanggal jatuh tempo harus berupa tanggal yang valid'),
  ```
  - Semua field bersifat opsional, tetapi jika ada, harus valid.
- **Kode Utama**:
  ```javascript
  db.query(
      'UPDATE peminjaman SET id_buku = ?, id_anggota = ?, tanggal_peminjaman = ?, tanggal_jatuh_tempo = ? WHERE id = ?',
      ...
  );
  ```
  - Memperbarui data peminjaman berdasarkan `id`.
  - Jika data tidak ditemukan, server mengembalikan **HTTP 404**.
  - Jika berhasil, server mengembalikan **HTTP 200** dengan pesan sukses.

---

### 5. **`deletePeminjaman`**  
- **Tujuan**: Menghapus data peminjaman berdasarkan `id`.  
- **Validasi**:
  ```javascript
  if (isNaN(id)) {
      return res.status(400).json({ pesan: 'ID peminjaman harus berupa angka' });
  }
  ```
  - Memastikan bahwa `id` adalah angka.
- **Kode Utama**:
  ```javascript
  db.query('DELETE FROM peminjaman WHERE id = ?', [id], (err, results) => { ... });
  ```
  - Menghapus data dengan `id` tertentu.
  - Jika data tidak ditemukan, server mengembalikan **HTTP 404**.
  - Jika berhasil, server mengembalikan **HTTP 200** dengan pesan sukses.

---

### **Struktur Umum**
- Semua fungsi memiliki:
  - **Validasi input** menggunakan `express-validator`.
  - **Handling error** untuk menangani masalah pada server atau database.
  - **HTTP Status Codes** yang sesuai:
    - **200**: Berhasil mengambil/mengupdate data.
    - **201**: Berhasil membuat data baru.
    - **400**: Kesalahan input.
    - **404**: Data tidak ditemukan.
    - **500**: Kesalahan server.

---

Berikut adalah pembaruan dokumentasi dengan tambahan judul dan nomor untuk kode sebagai nomor 10:

---

# 10. **Fungsi: Pengelolaan Data Pengembalian**

#### *Deskripsi*
Modul ini mengelola data pengembalian melalui beberapa endpoint REST API. Modul memanfaatkan middleware otentikasi untuk memastikan keamanan, dan semua operasi CRUD pada data pengembalian dilakukan melalui controller.

---

### *Penjelasan Kode*

#### *Langkah-Langkah dalam Modul*

1. **Import Ekspres**  
   ```javascript
   const express = require('express');
   ```
   - Modul `express` digunakan untuk membuat instance router.

2. **Inisialisasi Router**  
   ```javascript
   const router = express.Router();
   ```
   - Router digunakan untuk mendefinisikan endpoint spesifik yang terkait dengan data pengembalian.

3. **Import Controller**  
   ```javascript
   const pengembalianController = require('../controllers/pengembalianController');
   ```
   - `pengembalianController` berisi fungsi yang menangani logika utama dari setiap endpoint.

4. **Import Middleware Otentikasi**  
   ```javascript
   const authenticateToken = require('../middlewares/auth');
   ```
   - Middleware `authenticateToken` digunakan untuk memverifikasi bahwa pengguna memiliki token akses yang valid.

5. **Definisi Endpoint GET: '/'**  
   ```javascript
   router.get('/', authenticateToken, pengembalianController.getAllPengembalian);
   ```
   - Endpoint untuk mengambil semua data pengembalian.

6. **Definisi Endpoint GET: '/:id'**  
   ```javascript
   router.get('/:id', authenticateToken, pengembalianController.getPengembalianById);
   ```
   - Endpoint untuk mengambil data pengembalian berdasarkan `id`.

7. **Definisi Endpoint POST: '/'**  
   ```javascript
   router.post('/', authenticateToken, pengembalianController.createPengembalian);
   ```
   - Endpoint untuk menambahkan data pengembalian baru.

8. **Definisi Endpoint PUT: '/:id'**  
   ```javascript
   router.put('/:id', authenticateToken, pengembalianController.updatePengembalian);
   ```
   - Endpoint untuk memperbarui data pengembalian berdasarkan `id`.

9. **Definisi Endpoint DELETE: '/:id'**  
   ```javascript
   router.delete('/:id', authenticateToken, pengembalianController.deletePengembalian);
   ```
   - Endpoint untuk menghapus data pengembalian berdasarkan `id`.

10. **Ekspor Router**  
    ```javascript
    module.exports = router;
    ```
    - Router diekspor agar dapat digunakan dalam *main application file* untuk menangani rute terkait data pengembalian.

---



---

# 11. **Fungsi: Controller Pengelolaan Data Pengembalian**

#### *Deskripsi*
Controller ini berisi logika untuk menangani operasi CRUD terkait data pengembalian. Operasi ini meliputi pengambilan data (semua atau berdasarkan ID), penambahan data baru, pembaruan data, dan penghapusan data.

---

### *Penjelasan Kode*

#### *Langkah-Langkah dalam Modul*

1. **Import Modul yang Dibutuhkan**  
   ```javascript
   const db = require('../config/database');
   const { body, validationResult } = require('express-validator');
   ```
   - `db`: Koneksi ke database.
   - `body` dan `validationResult`: Digunakan untuk validasi input dari `express-validator`.

2. **Fungsi `getAllPengembalian`**  
   ```javascript
   exports.getAllPengembalian = (req, res) => { ... }
   ```
   - Query: `SELECT * FROM pengembalian` untuk mengambil semua data pengembalian.
   - Jika berhasil, data dikembalikan dalam format JSON dengan status 200.
   - Jika gagal, mengembalikan status 500 beserta pesan error.

3. **Fungsi `getPengembalianById`**  
   ```javascript
   exports.getPengembalianById = (req, res) => { ... }
   ```
   - Validasi ID: Memastikan ID adalah angka.
   - Query: `SELECT * FROM pengembalian WHERE id = ?`.
   - Jika data ditemukan, mengembalikan detail data dengan status 200.
   - Jika data tidak ditemukan, mengembalikan status 404.
   - Jika terjadi error, mengembalikan status 500.

4. **Fungsi `createPengembalian`**  
   ```javascript
   exports.createPengembalian = [ ... ]
   ```
   - Validasi Input:
     - `id_peminjaman` harus angka positif.
     - `tanggal_pengembalian` harus berupa tanggal valid.
     - `kondisi_buku` harus teks.
   - Query: `INSERT INTO pengembalian ...`.
   - Jika berhasil, mengembalikan status 201 dengan ID data baru.
   - Jika gagal, mengembalikan status 500 beserta pesan error.

5. **Fungsi `updatePengembalian`**  
   ```javascript
   exports.updatePengembalian = [ ... ]
   ```
   - Validasi ID dan Input: Sama dengan `createPengembalian`, namun semua input bersifat opsional.
   - Query: `UPDATE pengembalian SET ... WHERE id = ?`.
   - Jika data tidak ditemukan, mengembalikan status 404.
   - Jika berhasil, mengembalikan status 200.

6. **Fungsi `deletePengembalian`**  
   ```javascript
   exports.deletePengembalian = (req, res) => { ... }
   ```
   - Validasi ID: Memastikan ID adalah angka.
   - Query: `DELETE FROM pengembalian WHERE id = ?`.
   - Jika data tidak ditemukan, mengembalikan status 404.
   - Jika berhasil, mengembalikan status 200.

---



---

# 12. **Fungsi: Autentikasi dan Proteksi Endpoint**

#### *Deskripsi*
File ini berisi rute yang menangani autentikasi pengguna, termasuk login, verifikasi token, dan pengambilan profil pengguna yang telah terautentikasi. Proses menggunakan token JWT untuk memastikan keamanan.

---

### *Penjelasan Kode*

#### *Langkah-Langkah dalam Modul*

1. **Import Modul yang Dibutuhkan**  
   ```javascript
   const express = require('express');
   const jwt = require('jsonwebtoken');
   const bcrypt = require('bcrypt');
   const db = require('../config/database');
   ```
   - `express`: Untuk membuat router.
   - `jwt`: Untuk membuat dan memverifikasi token JWT.
   - `bcrypt`: Untuk memverifikasi kata sandi yang telah di-hash.
   - `db`: Koneksi ke database.

2. **Endpoint POST: `/login`**  
   ```javascript
   router.post('/login', async (req, res) => { ... });
   ```
   - **Input**: Email dan kata sandi pengguna.
   - **Proses**:
     - Query database untuk mencari pengguna berdasarkan email.
     - Verifikasi kata sandi menggunakan `bcrypt.compare`.
     - Jika berhasil, buat token JWT dengan payload yang berisi ID, email, dan nama pengguna.
   - **Output**:
     - Jika autentikasi berhasil, mengembalikan token JWT dan pesan sukses dengan status 200.
     - Jika gagal, mengembalikan pesan error dengan status 401 atau 500.

3. **Middleware `verifikasiToken`**  
   ```javascript
   const verifikasiToken = (req, res, next) => { ... };
   ```
   - **Input**: Token JWT yang dikirim melalui cookie atau header `Authorization`.
   - **Proses**:
     - Memeriksa keberadaan token.
     - Memverifikasi validitas token menggunakan `jwt.verify`.
     - Menyimpan data pengguna ke dalam `req.user` jika token valid.
   - **Output**:
     - Jika valid, melanjutkan ke middleware berikutnya.
     - Jika tidak valid, mengembalikan pesan error dengan status 401 atau 403.

4. **Endpoint GET: `/profil`**  
   ```javascript
   router.get('/profil', verifikasiToken, (req, res) => { ... });
   ```
   - **Input**: Tidak memerlukan input tambahan selain token yang valid.
   - **Proses**:
     - Middleware `verifikasiToken` memverifikasi token dan menyisipkan data pengguna ke dalam `req.user`.
     - Endpoint ini mengembalikan data profil pengguna.
   - **Output**:
     - Jika berhasil, mengembalikan data profil pengguna dengan status 200.

5. **Ekspor Router**  
   ```javascript
   module.exports = router;
   ```
   - Router diekspor agar dapat digunakan dalam aplikasi utama.

---

### *Catatan*
- Endpoint `/login` dapat menyimpan token ke cookie untuk pengelolaan sesi yang lebih mudah.
- Middleware `verifikasiToken` memastikan bahwa hanya pengguna yang terautentikasi dapat mengakses endpoint yang dilindungi.
- Token JWT memiliki masa berlaku 1 jam; setelah itu, pengguna harus login ulang untuk mendapatkan token baru.

---



---

# 13. **Fungsi: Login**

#### *Deskripsi*  
Fungsi login digunakan untuk autentikasi pengguna dengan email dan password. Jika autentikasi berhasil, sistem akan mengembalikan token JWT untuk digunakan pada permintaan selanjutnya.

---

### *Penjelasan Kode*

#### *Langkah-Langkah dalam Fungsi*

1. **Penerimaan Input dari Body**  
   ```javascript
   const { email, password } = req.body;
   ```
   - Input berupa `email` dan `password` dikirimkan melalui body permintaan.

2. **Query Database untuk Mencari Pengguna**  
   ```javascript
   const query = "SELECT * FROM anggota WHERE email = ?";
   db.query(query, [email], async (err, results) => { ... });
   ```
   - Query SQL mencari pengguna berdasarkan email.
   - Jika pengguna tidak ditemukan, mengembalikan status 400 dengan pesan *Invalid credentials*.

3. **Verifikasi Password**  
   ```javascript
   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
       return res.status(400).send({ message: "Invalid credentials" });
   }
   ```
   - Menggunakan `bcrypt.compare` untuk memverifikasi apakah password yang dikirim sesuai dengan password yang di-hash di database.
   - Jika password tidak cocok, mengembalikan status 400 dengan pesan *Invalid credentials*.

4. **Pembuatan Token JWT**  
   ```javascript
   const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
   res.send({ token });
   ```
   - Token JWT dibuat menggunakan `jwt.sign`, dengan payload berisi ID pengguna dan durasi token 1 jam.
   - Token ini dikembalikan sebagai respons untuk digunakan pada permintaan berikutnya.

5. **Penanganan Error**  
   ```javascript
   res.status(500).send({ message: "Internal server error", error });
   ```
   - Jika terjadi error selama proses login, mengembalikan status 500 dengan pesan *Internal server error*.

---

### *Catatan*
- Gunakan `process.env.JWT_SECRET` untuk menyimpan kunci rahasia JWT secara aman.
- Pastikan koneksi database (`db`) telah terkonfigurasi dengan benar.
- Validasi input dapat ditingkatkan untuk memastikan email dan password yang dikirimkan sesuai dengan format yang diharapkan.
- Tambahkan middleware untuk membatasi jumlah percobaan login guna mencegah serangan brute force.

---

---
#1. **Pengujian end point anggota**
1. ![1  GET Mendapatkan daftar semua anggota](https://github.com/user-attachments/assets/f10350d9-28c8-4838-b183-324a62625815)
2. ![2  GET Mendapatkan daftar anggota menggunakan ID](https://github.com/user-attachments/assets/d2adb7cb-7c8c-42db-a5c1-2de72e7f8945)
3. ![3  POST Menambahkan Anggota Baru](https://github.com/user-attachments/assets/7b725d9a-5570-4748-9ef7-daa88ee51053)
4. ![4  DELETE Menghapus anggota yang ada di daftar](https://github.com/user-attachments/assets/f0cc81f5-2ad1-4ab0-a07c-acd22f93c02f)
5. ![5  UPDATE Memperbaharui anggota yang ada di daftar](https://github.com/user-attachments/assets/06d546ea-765d-4228-8eaf-ede865f41fb0)

#2. **Pengujian end point buku**
1.![1  GET Mendapatkan daftar buku di perpustakaan](https://github.com/user-attachments/assets/06c28ea4-2de3-4830-81f6-e7ce2282e0f9)
2.![2  GET Mendapatkan buku di perpustakaan menggunakan ID](https://github.com/user-attachments/assets/4ec2b7c1-db22-44f8-8957-de8d1ebb9664)
3.![3  POST Menambahkan buku baru di perpustakaan](https://github.com/user-attachments/assets/c3a811ef-a526-4f0e-acd3-1e174bc0dca1)
4.![4  DELETE Menghapus buku di dalam perpustakaan](https://github.com/user-attachments/assets/f37c5ae0-d381-4839-b49b-d2fc03b8d24a)
5.![5  UPDATE Memperbaharui buku yang ada di perpustakaan menggunakan ID](https://github.com/user-attachments/assets/a8933bf2-e4fa-4042-afc6-b616963d3afe)

#3. **Pengujian end point peminjaman**
1.![1  GET Mendapatkan daftar semua peminjaman](https://github.com/user-attachments/assets/fcb6dc57-eda0-4112-bce3-b99d5849eef7)
2.![2  GET Mendapatkan daftar peminjam menggunakan ID](https://github.com/user-attachments/assets/b3d20ab0-9b36-497a-81c3-182c4076626c)
3.![3  POST  Menambahkan data peminjaman](https://github.com/user-attachments/assets/ab18d161-b6f8-4118-8d0d-2d994f1078f4)
4.![4  DELETE Menghapus data peminjam menggunakan ID](https://github.com/user-attachments/assets/7903ae18-71b2-4457-88d9-1900821b6f91)
5.![5  UPDATE Memperbaharui data peminjam](https://github.com/user-attachments/assets/d3a634c8-518b-4c25-bf21-db49d6be920e)

#4. **Pengujian end point pengembalian**
1.![1  GET Mendapatkan semua data pengembalian](https://github.com/user-attachments/assets/24ff388f-e9f3-4705-90ed-7fcb2261d342)
2.![2  Mendapatkan data dari daftar peminjam menggunakan ID](https://github.com/user-attachments/assets/ae9120a1-1d85-4321-863f-50f408e2f22c)
3.![3  POST Menambahkan data pengembalian](https://github.com/user-attachments/assets/ede119dc-5dcb-46d3-8e6a-c99f2fcca831)
4.![4  DELETE Menghapus data peminjam menggunakan ID](https://github.com/user-attachments/assets/828f67aa-d70a-4a8b-8174-0f823035b158)
5.![5  UPDATE Memperbaharui data pengembalian peminjam](https://github.com/user-attachments/assets/285a1ad2-b039-49d0-8f2a-7e1766385615)
