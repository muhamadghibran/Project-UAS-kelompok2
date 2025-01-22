const db = require('../config/database');

// Mendapatkan semua data anggota
exports.ambilSemuaAnggota = (req, res) => {
    db.query('SELECT * FROM anggota', (err, hasil) => {
        if (err) return res.status(500).json({ error: err.message });
        if (hasil.length === 0) return res.status(404).json({ pesan: 'Data anggota tidak ditemukan' });
        res.json(hasil);
    });
};

exports.tambahAnggota = (req, res) => {
    const { nama, email, password, tanggal_keanggotaan } = req.body;

    // Validasi input
    if (!nama || !email || !password || !tanggal_keanggotaan) {
        return res.status(400).json({ pesan: 'Semua kolom wajib diisi' });
    }

    db.query(
        'INSERT INTO anggota (nama, email, password, tanggal_keanggotaan) VALUES (?, ?, ?, ?)',
        [nama, email, password, tanggal_keanggotaan],
        (err, hasil) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ pesan: 'Anggota berhasil ditambahkan', id: hasil.insertId });
        }
    );
};

// Memperbarui data anggota berdasarkan ID
exports.perbaruiAnggota = (req, res) => {
    const { id } = req.params;
    const { nama, email, password, tanggal_keanggotaan } = req.body;

    // Validasi input
    if (!nama || !email || !password || !tanggal_keanggotaan) {
        return res.status(400).json({ pesan: 'Semua kolom wajib diisi' });
    }

    db.query('SELECT * FROM anggota WHERE id = ?', [id], (err, hasil) => {
        if (err) return res.status(500).json({ error: err.message });
        if (hasil.length === 0) return res.status(404).json({ pesan: 'Anggota tidak ditemukan' });

        db.query(
            'UPDATE anggota SET nama = ?, email = ?, password = ?, tanggal_keanggotaan = ? WHERE id = ?',
            [nama, email, password, tanggal_keanggotaan, id],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ pesan: 'Data anggota berhasil diperbarui' });
            }
        );
    });
};

// Menghapus data anggota berdasarkan ID
exports.hapusAnggota = (req, res) => {
    const { id } = req.params;

    db.query('SELECT * FROM anggota WHERE id = ?', [id], (err, hasil) => {
        if (err) return res.status(500).json({ error: err.message });
        if (hasil.length === 0) return res.status(404).json({ pesan: 'Anggota tidak ditemukan' });

        db.query('DELETE FROM anggota WHERE id = ?', [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ pesan: 'Anggota berhasil dihapus' });
        });
    });
};
