const container = document.getElementById('mainContainer');
const animeWrapper = document.getElementById('animeWrapper');
const chatBubble = document.getElementById('chatBubble');

// --- 1. FUNGSI PINDAH POSISI (KIRI / KANAN) ---
function pindahPosisi() {
    // Cek apakah sekarang kelasnya 'posisi-kiri'
    if (container.classList.contains('posisi-kiri')) {
        container.classList.remove('posisi-kiri');
        container.classList.add('posisi-kanan');
        chatBubble.innerHTML = "Sekarang aku di Kanan! 😎";
    } else {
        container.classList.remove('posisi-kanan');
        container.classList.add('posisi-kiri');
        chatBubble.innerHTML = "Kembali ke Kiri! 👈";
    }
}

// --- 2. FUNGSI GAMBAR BERGERAK MENGIKUTI KURSOR (PARALLAX) ---
document.addEventListener('mousemove', (e) => {
    // Ambil posisi mouse
    const x = (window.innerWidth - e.pageX * 2) / 50; // Angka 50 mengatur kecepatan gerak
    const y = (window.innerHeight - e.pageY * 2) / 50;

    // Gerakkan elemen wrapper anime
    animeWrapper.style.transform = `translateX(${x}px) translateY(${y}px)`;
});

// --- 3. FUNGSI CHAT SEDERHANA ---
function kirimPesan() {
    const input = document.getElementById('inputPesan').value;
    if(input) {
        chatBubble.innerHTML = "Kamu berkata: " + input + "<br> (AI belum aktif, ini contoh respons)";
        document.getElementById('inputPesan').value = ""; // Kosongkan input
    }
}
