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
