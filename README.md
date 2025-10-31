# Quizis

https://github.com/user-attachments/assets/5499ae0c-f63d-4006-a122-22b4af7cf1cd

Proyek ini merupakan aplikasi kuis berbasis **React.js** yang dapat menampilkan pertanyaan kuis yang diambil dari API publik **[Open Trivia Database (opentdb.com)](https://opentdb.com/)**.

---

## 🚀 Fitur Utama
- Autentikasi login dan register
- Menampilkan pertanyaan kuis dari API eksternal secara dinamis  
- Soal per halaman yang berganti setelah pengguna menjawab
- Lanjutkan kuis yang masih aktif
- Sistem penilaian otomatis berdasarkan jawaban benar/salah  

---

## 🧩 Alur Singkat Aplikasi
- Pengguna mengatur konfigurasi kuis yang ingin dikerjakan
- Aplikasi melakukan fetch data kuis dari API `https://opentdb.com/`.  
- Data soal dan jawaban kemudian diacak dan disajikan ke pengguna satu per satu.  
- Pengguna memilih jawaban dalam waktu tertentu.  
- Setelah waktu habis atau semua soal dijawab, website menampilkan skor akhir.  
