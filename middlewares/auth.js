const jwt = require('jsonwebtoken');

function autentikasiToken(req, res, next) {
    // Abaikan verifikasi token jika dalam mode pengembangan
    if (process.env.NODE_ENV === 'development') {
        req.pengguna = { id: 1, email: 'Bam1@gmail.com', nama: 'Bam' }; // Data pengguna mock
        console.log('Mode pengembangan: autentikasi diabaikan');
        return next();
    }

    // Ambil header Authorization
    const headerOtorisasi = req.headers['authorization'];

    // Pastikan header Authorization ada dan memiliki format yang benar
    if (!headerOtorisasi || !headerOtorisasi.startsWith('Bearer ')) {
        return res.status(401).json({ pesan: 'Akses ditolak, token tidak tersedia atau format salah' });
    }

    // Ekstrak token dari header
    const token = headerOtorisasi.split(' ')[1];

    // Jika token tidak ditemukan
    if (!token) {
        return res.status(401).json({ pesan: 'Akses ditolak, token tidak tersedia' });
    }

    // Verifikasi token
    jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, pengguna) => {
        if (err) {
            console.error('Kesalahan Verifikasi JWT:', err.message); // Logging untuk debugging
            return res.status(403).json({ pesan: 'Token tidak valid atau sudah kadaluarsa' });
        }

        // Set data pengguna ke objek request
        req.pengguna = pengguna;

        // Lanjutkan ke middleware berikutnya
        next();
    });
}

module.exports = autentikasiToken;
