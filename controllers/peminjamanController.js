const db = require('../config/database');
const { body, validationResult } = require('express-validator');

exports.getAllPeminjaman = (req, res) => {
    db.query('SELECT * FROM peminjaman', (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
        }
        res.status(200).json({ pesan: 'Data peminjaman berhasil diambil', data: results });
    });
};

exports.getPeminjamanById = (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ pesan: 'ID peminjaman harus berupa angka' });
    }

    db.query('SELECT * FROM peminjaman WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ pesan: 'Peminjaman tidak ditemukan' });
        }
        res.status(200).json({ pesan: 'Detail peminjaman berhasil diambil', data: results[0] });
    });
};

exports.createPeminjaman = [ 
    body('id_buku').isInt({ min: 1 }).withMessage('ID buku harus berupa angka positif'),
    body('id_anggota').isInt({ min: 1 }).withMessage('ID anggota harus berupa angka positif'),
    body('tanggal_peminjaman').isDate().withMessage('Tanggal peminjaman harus berupa tanggal yang valid'),
    body('tanggal_jatuh_tempo').isDate().withMessage('Tanggal jatuh tempo harus berupa tanggal yang valid'),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ pesan: 'Input tidak valid', errors: errors.array() });
        }

        const { id_buku, id_anggota, tanggal_peminjaman, tanggal_jatuh_tempo } = req.body;

        db.query(
            'INSERT INTO peminjaman (id_buku, id_anggota, tanggal_peminjaman, tanggal_jatuh_tempo) VALUES (?, ?, ?, ?)',
            [id_buku, id_anggota, tanggal_peminjaman, tanggal_jatuh_tempo],
            (err, results) => {
                if (err) {
                    console.error('Database Error:', err);
                    return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
                }
                res.status(201).json({ pesan: 'Peminjaman berhasil ditambahkan', data: { id: results.insertId } });
            }
        );
    }
];


exports.updatePeminjaman = [
    body('id_buku').optional().isInt({ min: 1 }).withMessage('ID buku harus berupa angka positif'),
    body('id_anggota').optional().isInt({ min: 1 }).withMessage('ID anggota harus berupa angka positif'),
    body('tanggal_peminjaman').optional().isDate().withMessage('Tanggal peminjaman harus berupa tanggal yang valid'),
    body('tanggal_jatuh_tempo').optional().isDate().withMessage('Tanggal jatuh tempo harus berupa tanggal yang valid'),

    (req, res) => {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ pesan: 'ID peminjaman harus berupa angka' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ pesan: 'Input tidak valid', errors: errors.array() });
        }

        const { id_buku, id_anggota, tanggal_peminjaman, tanggal_jatuh_tempo } = req.body;

        if (!id_buku && !id_anggota && !tanggal_peminjaman && !tanggal_jatuh_tempo) {
            return res.status(400).json({ pesan: 'Tidak ada data untuk diperbarui' });
        }

        db.query(
            'UPDATE peminjaman SET id_buku = ?, id_anggota = ?, tanggal_peminjaman = ?, tanggal_jatuh_tempo = ? WHERE id = ?',
            [id_buku, id_anggota, tanggal_peminjaman, tanggal_jatuh_tempo, id],
            (err, results) => {
                if (err) {
                    console.error('Database Error:', err);
                    return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ pesan: 'Peminjaman tidak ditemukan' });
                }
                res.status(200).json({ pesan: 'Peminjaman berhasil diperbarui' });
            }
        );
    }
];


exports.deletePeminjaman = (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ pesan: 'ID peminjaman harus berupa angka' });
    }

    db.query('DELETE FROM peminjaman WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ pesan: 'Peminjaman tidak ditemukan' });
        }
        res.status(200).json({ pesan: 'Peminjaman berhasil dihapus' });
    });
};
