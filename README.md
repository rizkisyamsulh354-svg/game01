# 🎮 TETRIS MULTIPLAYER - Game Keren!

Sebuah game Tetris yang sederhana namun penuh dengan visual effects keren, mendukung multiplayer, dan tema yang dinamis!

## ✨ Fitur Utama

### 1. **Gameplay Klasik Tetris**
- 7 jenis blok Tetris (I, O, T, S, Z, J, L)
- Rotasi blok 4 arah
- Sistem score dan level
- Deteksi tabrakan dan line clearing

### 2. **Visual Effects Keren** 🎆
- **Particle Effects**: Efek percikan warna-warni saat baris Tetris terhapus
- **Glow Effects**: Cahaya bersinar pada judul dan UI
- **Animasi Smooth**: Transisi dan animasi yang halus
- **Gradient Backgrounds**: Background yang indah dengan gradient warna

### 3. **Multiplayer Mode** 👥
- **Single Player**: Main game Tetris standar
- **2-Player Local**: Dua pemain main bersamaan di satu layar
- Skor terpisah untuk setiap pemain
- Sistem level independen

### 4. **Tema Dinamis** 🎨
Tema otomatis berubah setiap 5 baris yang dibersihkan:
- 🟣 **Purple** - Tema default yang elegan
- 🌑 **Dark** - Tema gelap dengan warna neon
- 🌊 **Ocean** - Tema laut dengan warna biru-tosca
- 🌅 **Sunset** - Tema matahari terbenam dengan warna orange-merah
- 🌲 **Forest** - Tema hutan dengan warna hijau
- 🍬 **Candy** - Tema permen dengan warna cerah dan meriah

### 5. **Particle System** ✨
- Percikan berwarna saat line clear
- Efek ledakan dengan physics realistic (gravity)
- Particle lifetime dan fading effect
- Glow/shadow effects pada particle

## 🎮 Cara Bermain

### Single Player Mode
1. Klik tombol **"Solo"**
2. Klik **"START GAME"** untuk memulai
3. Gunakan kontrol di bawah untuk bermain

### Multiplayer Mode
1. Klik tombol **"Multiplayer"**
2. Klik **"START GAME"**
3. Player 1 dan Player 2 bermain bersamaan

## ⌨️ Kontrol Keyboard

### Player 1 (Solo & Multiplayer)
| Kontrol | Tombol |
|---------|---------|
| Gerak Kiri | ← (Arrow Left) |
| Gerak Kanan | → (Arrow Right) |
| Jatuh Cepat | ↓ (Arrow Down) |
| Rotasi | Z atau X |

### Player 2 (Multiplayer Only)
| Kontrol | Tombol |
|---------|---------|
| Gerak Kiri | A |
| Gerak Kanan | D |
| Jatuh Cepat | S |
| Rotasi | Q atau E |

## 🎯 Sistem Poin

- **1 Baris Clear**: 100 poin
- **2 Baris Clear**: 400 poin  
- **3 Baris Clear**: 900 poin
- **4 Baris Clear**: 1600 poin (Tetris!)

## 📊 Level System

- Level meningkat setiap 10 baris
- Kecepatan jatuh blok meningkat sesuai level
- Semakin tinggi level, semakin cepat!

## 🌈 Tema Berubah

Setiap kali pemain membersihkan 5 baris, tema otomatis berubah ke tema berikutnya:
- Background berubah warna
- Warna blok berubah
- Efek visual disesuaikan dengan tema

## 💡 Tips & Trik

1. **Bersihkan Tetris**: Jangan hanya fokus menghapus satu baris. Kumpulkan 4 baris kosong di bagian atas untuk bonus poin besar!

2. **Manfaatkan I-Block**: Blok I (garis lurus) sangat berguna untuk menghapus 4 baris sekaligus

3. **Strategi Multiplayer**: Fokus pada score sendiri, tapi jangan lupa memantau lawan!

4. **Gunakan Rotasi**: Rotasi blok dengan bijak untuk menempatkan blok di tempat optimal

5. **Tingkatkan Speed**: Semakin tinggi level, semakin seru! Coba capai level tertinggi

## 🎨 Customization

Game ini dilengkapi dengan sistem tema yang mudah diperluas. Untuk menambah tema baru, edit file `tetris.js` dan tambahkan ke object `THEMES`:

```javascript
const THEMES = {
    yourTheme: {
        name: 'yourTheme',
        colors: ['#FF0000', '#00FF00', /* ... */],
        bg: '#000000',
        bgClass: 'theme-yourtheme'
    }
}
```

## 🚀 Fitur Bonus

- ⏸️ Pause/Resume game kapan saja
- 🔄 Reset game untuk main dari awal
- 📱 Responsive design untuk berbagai ukuran layar
- 🎆 Smooth animations dan transitions

## 📝 Catatan

- Pastikan JavaScript diaktifkan di browser Anda
- Game menggunakan Canvas API untuk rendering
- Game bekerja optimal di browser modern (Chrome, Firefox, Safari, Edge)

## 🎊 Semoga Sesuai!

Game ini dibuat dengan ❤️ untuk memberikan pengalaman bermain Tetris yang menyenangkan dan visual yang memukau!

Nikmati bermain! 🎮✨