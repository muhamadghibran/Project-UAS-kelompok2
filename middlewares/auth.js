const jwt = require('jsonwebtoken');

function autentikasiToken(req, res, next) {
    if (process.env.NODE_ENV === 'development') {
        req.pengguna = { id: 1, email: 'Bam1@gmail.com', nama: 'Bam' }; // Data pengguna mock
        console.log('Mode pengembangan: autentikasi diabaikan');
        return next();
    }

    const headerOtorisasi = req.headers['authorization'];

    if (!headerOtorisasi || !headerOtorisasi.startsWith('Bearer ')) {
        return res.status(401).json({ pesan: 'Akses ditolak, token tidak tersedia atau format salah' });
    }

    const token = headerOtorisasi.split(' ')[1];

    if (!token) {
        return res.status(401).json({ pesan: 'Akses ditolak, token tidak tersedia' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, pengguna) => {
        if (err) {
            console.error('Kesalahan Verifikasi JWT:', err.message); // Logging untuk debugging
            return res.status(403).json({ pesan: 'Token tidak valid atau sudah kadaluarsa' });
        }

        req.pengguna = pengguna;

        next();
    });
}

module.exports = autentikasiToken;
