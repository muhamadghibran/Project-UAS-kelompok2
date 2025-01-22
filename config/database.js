const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: '',     
    database: 'perpustakaan_digital'
});

// Cek koneksi
db.connect((err) => {
    if (err) {
        console.error('Koneksi ke database gagal:', err);
        process.exit(1);
    }
    console.log('Berhasil terhubung ke database');
});

module.exports = db;
