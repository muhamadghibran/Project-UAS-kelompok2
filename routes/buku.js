const express = require('express');
const router = express.Router();
const bukuController = require('../controllers/bukuController.js'); // Mengimpor bukuController
const authenticateToken = require('../middlewares/auth'); // Middleware autentikasi

// Rute untuk mendapatkan daftar semua buku
router.get('/', authenticateToken, bukuController.getAllBooks);

// Rute untuk mendapatkan detail buku berdasarkan ID
router.get('/:id', authenticateToken, bukuController.getBookById);

// Rute untuk menambahkan buku baru
router.post('/', authenticateToken, bukuController.addBook);

// Rute untuk mengedit buku berdasarkan ID
router.put('/:id', authenticateToken, bukuController.updateBook);

// Rute untuk menghapus buku berdasarkan ID
router.delete('/:id', authenticateToken, bukuController.deleteBook);

module.exports = router;