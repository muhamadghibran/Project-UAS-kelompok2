const db = require('../config/database');
const { body, validationResult } = require('express-validator');

exports.getAllPengembalian = (req, res) => {
    db.query('SELECT * FROM pengembalian', (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
        }
        res.status(200).json({ pesan: 'Data pengembalian berhasil diambil', data: results });
    });
};

exports.getPengembalianById = (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ pesan: 'ID pengembalian harus berupa angka' });
    }

    db.query('SELECT * FROM pengembalian WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ pesan: 'Pengembalian tidak ditemukan' });
        }
        res.status(200).json({ pesan: 'Detail pengembalian berhasil diambil', data: results[0] });
    });
};

exports.createPengembalian = [
    body('id_peminjaman').isInt({ min: 1 }).withMessage('ID peminjaman harus berupa angka positif'),
    body('tanggal_pengembalian').isDate().withMessage('Tanggal pengembalian harus berupa tanggal yang valid'),
    body('kondisi_buku').isString().withMessage('Kondisi buku harus berupa teks'),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ pesan: 'Input tidak valid', errors: errors.array() });
        }

        const { id_peminjaman, tanggal_pengembalian, kondisi_buku } = req.body;

        db.query(
            'INSERT INTO pengembalian (id_peminjaman, tanggal_pengembalian, kondisi_buku) VALUES (?, ?, ?)',
            [id_peminjaman, tanggal_pengembalian, kondisi_buku],
            (err, results) => {
                if (err) {
                    console.error('Database Error:', err);
                    return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
                }
                res.status(201).json({ pesan: 'Pengembalian berhasil ditambahkan', data: { id: results.insertId } });
            }
        );
    }
];

exports.updatePengembalian = [
    body('id_peminjaman').optional().isInt({ min: 1 }).withMessage('ID peminjaman harus berupa angka positif'),
    body('tanggal_pengembalian').optional().isDate().withMessage('Tanggal pengembalian harus berupa tanggal yang valid'),
    body('kondisi_buku').optional().isString().withMessage('Kondisi buku harus berupa teks'),

    (req, res) => {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ pesan: 'ID pengembalian harus berupa angka' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ pesan: 'Input tidak valid', errors: errors.array() });
        }

        const { id_peminjaman, tanggal_pengembalian, kondisi_buku } = req.body;

        db.query(
            'UPDATE pengembalian SET id_peminjaman = ?, tanggal_pengembalian = ?, kondisi_buku = ? WHERE id = ?',
            [id_peminjaman, tanggal_pengembalian, kondisi_buku, id],
            (err, results) => {
                if (err) {
                    console.error('Database Error:', err);
                    return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ pesan: 'Pengembalian tidak ditemukan' });
                }
                res.status(200).json({ pesan: 'Pengembalian berhasil diperbarui' });
            }
        );
    }
];

exports.deletePengembalian = (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ pesan: 'ID pengembalian harus berupa angka' });
    }

    db.query('DELETE FROM pengembalian WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ pesan: 'Pengembalian tidak ditemukan' });
        }
        res.status(200).json({ pesan: 'Pengembalian berhasil dihapus' });
    });
};
