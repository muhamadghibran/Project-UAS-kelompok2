const express = require('express');
const router = express.Router();
const pengembalianController = require('../controllers/pengembalianController'); // Mengimpor controller
const authenticateToken = require('../middlewares/auth'); // Middleware autentikasi

// Rute untuk mendapatkan semua data pengembalian
router.get('/', authenticateToken, pengembalianController.getAllPengembalian);

// Rute untuk mendapatkan data pengembalian berdasarkan ID
router.get('/:id', authenticateToken, pengembalianController.getPengembalianById);

// Rute untuk menambahkan pengembalian baru
router.post('/', authenticateToken, pengembalianController.createPengembalian);

// Rute untuk mengedit pengembalian berdasarkan ID
router.put('/:id', authenticateToken, pengembalianController.updatePengembalian);

// Rute untuk menghapus pengembalian berdasarkan ID
router.delete('/:id', authenticateToken, pengembalianController.deletePengembalian);

module.exports = router;
