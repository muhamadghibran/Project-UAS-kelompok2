const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/database');

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {

        const query = 'SELECT * FROM anggota WHERE LOWER(email) = LOWER(?)';
        db.query(query, [email], async (err, hasil) => {
            if (err) {
                console.error('Kesalahan database:', err);
                return res.status(500).json({ pesan: 'Kesalahan pada database', error: err });
            }

            if (hasil.length === 0) {
                return res.status(401).json({ pesan: 'Email atau kata sandi tidak valid' });
            }

            const pengguna = hasil[0];

            const kataSandiValid = await bcrypt.compare(password, pengguna.password);
            if (!kataSandiValid) {
                return res.status(401).json({ pesan: 'Email atau kata sandi tidak valid' });
            }

            const token = jwt.sign(
                { id: pengguna.id, email: pengguna.email, nama: pengguna.nama },
                process.env.JWT_SECRET || 'secretkey',
                { expiresIn: '1h' } 
            );

            res.status(200)
                .cookie('token', token, { httpOnly: true, maxAge: 3600000 }) // Simpan token di cookie (opsional)
                .json({ pesan: 'Login berhasil', token });
        });
    } catch (error) {
        console.error('Kesalahan server internal:', error);
        res.status(500).json({ pesan: 'Kesalahan server internal', error });
    }
});

const verifikasiToken = (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ pesan: 'Token tidak tersedia. Akses ditolak.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(401).json({ pesan: 'Token tidak valid atau sudah kadaluarsa' });
    }
};

router.get('/profil', verifikasiToken, (req, res) => {
    res.status(200).json({
        pesan: 'Data profil berhasil diambil',
        pengguna: req.user 
    });
});

module.exports = router;
