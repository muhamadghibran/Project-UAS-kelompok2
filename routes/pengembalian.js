const express = require('express');
const router = express.Router();
const pengembalianController = require('../controllers/pengembalianController'); 
const authenticateToken = require('../middlewares/auth'); 

router.get('/', authenticateToken, pengembalianController.getAllPengembalian);
router.get('/:id', authenticateToken, pengembalianController.getPengembalianById);
router.post('/', authenticateToken, pengembalianController.createPengembalian);
router.put('/:id', authenticateToken, pengembalianController.updatePengembalian);
router.delete('/:id', authenticateToken, pengembalianController.deletePengembalian);

module.exports = router;
