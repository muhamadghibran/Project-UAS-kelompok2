const express = require('express');
const router = express.Router();
const bukuController = require('../controllers/bukuController.js'); 
const authenticateToken = require('../middlewares/auth'); 

router.get('/', authenticateToken, bukuController.getAllBooks);

router.get('/:id', authenticateToken, bukuController.getBookById);

router.post('/', authenticateToken, bukuController.addBook);

router.put('/:id', authenticateToken, bukuController.updateBook);

router.delete('/:id', authenticateToken, bukuController.deleteBook);

module.exports = router;