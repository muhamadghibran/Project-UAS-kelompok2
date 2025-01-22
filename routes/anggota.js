const express = require('express');
const router = express.Router();
const db = require('../config/database');
const autentikasiToken = require('../middlewares/auth');


router.get('/', autentikasiToken, (req, res) => {
    db.query('SELECT * FROM anggota', (err, hasil) => {
        if (err) return res.status(500).json({ pesan: err.message });
        if (hasil.length === 0) return res.status(404).json({ pesan: 'Tidak ada anggota yang ditemukan' });
        res.json(hasil);
    });
});

router.get('/:id', autentikasiToken, (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM anggota WHERE id = ?', [id], (err, hasil) => {
        if (err) return res.status(500).json({ pesan: err.message });
        if (hasil.length === 0) return res.status(404).json({ pesan: 'Anggota tidak ditemukan' });
        res.json(hasil[0]);
    });
});

router.post('/', autentikasiToken, (req, res) => {
    const { nama, email, password, tanggal_keanggotaan } = req.body;

    // Validasi input
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

router.put('/:id', autentikasiToken, (req, res) => {
    const { id } = req.params;
    const { nama, email, password, tanggal_keanggotaan } = req.body;

    // Validasi input
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

module.exports = router;
