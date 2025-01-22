require('dotenv').config();
const express = require('express'); 
const cors = require('cors'); 
const anggotaRoutes = require('./routes/anggota'); 
const authRoutes = require('./routes/auth'); 
const bukuRoutes = require('./routes/buku'); 
const peminjamanRoutes = require('./routes/peminjaman');
const pengembalianRoutes = require('./routes/pengembalian'); 

const app = express(); 

app.use(cors()); 
app.use(express.json()); 


app.use('/api/anggota', anggotaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/buku', bukuRoutes); 
app.use('/api/peminjaman', peminjamanRoutes); 
app.use('/api/pengembalian', pengembalianRoutes); 


app.use((req, res, next) => {
    res.status(404).json({ pesan: 'Endpoint tidak ditemukan' });
});

app.use((err, req, res, next) => {
    console.error('Kesalahan:', err.stack); 
    res.status(500).json({ pesan: 'Terjadi kesalahan pada server', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`); 
});
