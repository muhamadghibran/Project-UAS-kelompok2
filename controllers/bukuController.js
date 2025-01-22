const db = require('../config/database');
const { body, validationResult } = require('express-validator');

// Mendapatkan semua buku
exports.getAllBooks = (req, res) => {
    db.query('SELECT * FROM buku', (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
        }
        res.status(200).json({ pesan: 'Data buku berhasil diambil', data: results });
    });
};

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


exports.addBook = [    body('judul').notEmpty().withMessage('Judul harus diisi'),
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