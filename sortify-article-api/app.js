const express = require('express');
const app = express();

const articles = [
    {
        "title": "Tiga Kota di Indonesia Dinobatkan sebagai Kota Ramah Lingkungan/Bersih di Asia Tenggara",
        "content": "The Association of Southeast Asian Nations (ASEAN) memberikan penghargaan kepada beberapa kota di Asia Tenggara ...",
        "image": "https://sipsn.menlhk.go.id/sipsn/upload/berita/berita_8_foto_1634875202967.jpeg",
        "link": "https://sipsn.menlhk.go.id/sipsn/baca/8"
    },
    {
        "title": "Babak Baru Program Adipura",
        "content": "Selama masa Pandemi Covid-19 kegiatan penganugrahan Adipura tidak dilaksanakan ...",
        "image": "https://sipsn.menlhk.go.id/sipsn/upload/berita/berita_6_foto_1617854228103.jpg",
        "link": "https://sipsn.menlhk.go.id/sipsn/baca/6"
    },
    {
        "title": "Minim Sampah, Keren!",
        "content": "Sebuah papan tulis mini berwarna hitam dengan bingkai kayu coklat muda ...",
        "image": "https://storage.googleapis.com/sortify-utils/artice-image/article-3.jpeg",
        "link": "https://sipsn.menlhk.go.id/sipsn/baca/2"
    },
    {
        "title": "Indonesia - Finlandia bahas kerjasama pengelolaan sampah menjadi energi",
        "content": "Pengolahan sampah menjadi energi dengan menggunakan proses termal semakin populer sebagai teknologi alternatif ...",
        "image": "https://sipsn.menlhk.go.id/sipsn/upload/berita/berita_5_foto_1606291400172.JPG",
        "link": "https://sipsn.menlhk.go.id/sipsn/baca/5"
    },
    {
        "title": "BSU Cendana BLI-KLHK, Raih Juara II Penghargaaan Bogorku Bersih 2020",
        "content": "Bank Sampah Unit (BSU) Cendana menoreh prestasi dalam ajang Penganugerahan Bogorku Bersih 2020 Clean & Clear, yang berlangsung ...",
        "image": "https://storage.googleapis.com/sortify-utils/artice-image/article-5.jpg",
        "link": "https://sipsn.menlhk.go.id/sipsn/baca/3"
    }
];

app.get('/articles', (req, res) => {
    res.json({ articles });
});
app.get('/', (req, res) => {
    res.send('Welcome to Sortify Article API! Use /articles to get articles.');
});

const PORT =  8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
