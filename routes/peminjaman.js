const express = require('express');
const router = express.Router();
const peminjamanController = require('../controllers/peminjamanController.js'); // Mengimpor peminjamanController
const authenticateToken = require('../middlewares/auth'); // Middleware autentikasi

// Rute untuk mendapatkan daftar semua peminjaman
router.get('/', authenticateToken, peminjamanController.getAllPeminjaman);

// Rute untuk mendapatkan detail peminjaman berdasarkan ID
router.get('/:id', authenticateToken, peminjamanController.getPeminjamanById);

// Rute untuk menambahkan data peminjaman baru
router.post('/', authenticateToken, peminjamanController.createPeminjaman);

// Rute untuk memperbarui data peminjaman berdasarkan ID
router.put('/:id', authenticateToken, peminjamanController.updatePeminjaman);

// Rute untuk menghapus data peminjaman berdasarkan ID
router.delete('/:id', authenticateToken, peminjamanController.deletePeminjaman);

module.exports = router;
