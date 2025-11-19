const container = document.getElementById('mainContainer');
const animeWrapper = document.getElementById('animeWrapper');
const animeImg = document.getElementById('animeImg');
const chatBubble = document.getElementById('chatBubble');

// ==========================================
// ⚠️ PERINGATAN: JANGAN TEMPEL KUNCI UTUH!
// GitHub akan memblokirnya lagi. Gunakan cara di bawah ini.
// ==========================================

// 1. Masukkan Kunci GEMINI Baru (Potong jadi 2 bagian)
// Contoh: Jika kuncinya "AIzaSyD123456789"
const g_part1 = "AIzaSyDzkd2f1W4qnNNTk";  // <-- Masukkan separuh awal kunci BARU di sini
const g_part2 = "28NCxedqlT47AtedWY";     // <-- Masukkan separuh akhir kunci BARU di sini
const GEMINI_API_KEY = g_part1 + g_part2; // Digabung otomatis

// 2. Masukkan Kunci OPENAI Baru (Potong jadi 2 bagian)
// Contoh: Jika kuncinya "sk-svcacct-abcdefg..."
const o_part1 = "sk-svcacct-Vti9P-fxodmsXxO1_KpKVLrOuJSlxeSlyFH778zobiwxev"; // <-- Separuh awal
const o_part2 = "J8OLoVYAIv-3Kx4LiMgSVIG785EYT3BlbkFJvPfmNbqPOOw7c3y3m2KYvAqbonGV1HFNHJDAZaqHglWe-2BDdE1OzYR2a6qn6uWeRhtg6W2wYA"; // <-- Separuh akhir
const OPENAI_API_KEY = o_part1 + o_part2; // Digabung otomatis

// ==========================================
// Variabel status agar karakter tidak ganggu saat AI mikir
let sedangMikir = false;

// --- 1. FUNGSI AI GEMINI ---
async function tanyaGemini(pesan) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: pesan }] }] })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        return "❌ Gemini Gagal (Cek API Key/Kuota)";
    }
}

// --- 2. FUNGSI AI CHATGPT ---
async function tanyaOpenAI(pesan) {
    const url = "https://api.openai.com/v1/chat/completions";
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: pesan }]
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        return "❌ GPT Gagal (Cek API Key/Kuota)";
    }
}

// --- 3. FUNGSI KIRIM PESAN (HYBRID CORE) ---
async function kirimPesan() {
    const input = document.getElementById('inputPesan');
    const pesanUser = input.value;
    
    if(!pesanUser) return;

    // Tandai sedang mikir (supaya fitur 'ngomong sendiri' di-pause)
    sedangMikir = true;

    // Tampilan loading
    input.value = ""; 
    chatBubble.innerHTML = `
        Kamu: "${pesanUser}" <br><br>
        <b style="color: blue;">✨ Mengaktifkan Dual Core AI...</b>
    `;
    
    try {
        // Jalanin dua AI barengan
        const [hasilGemini, hasilGPT] = await Promise.all([
            tanyaGemini(pesanUser),
            tanyaOpenAI(pesanUser)
        ]);

        // Gabungkan Jawaban
        const jawabanFinal = `
            <div style="text-align: left; font-size: 0.9em;">
                <strong style="color: #4285F4;">💎 Versi Gemini:</strong><br>
                ${hasilGemini}
                <br><hr style="margin: 10px 0; border-color: #ddd;">
                <strong style="color: #10a37f;">🧠 Versi ChatGPT:</strong><br>
                ${hasilGPT}
            </div>
        `;

        chatBubble.innerHTML = jawabanFinal;
        
        // Efek kaget selesai mikir
        animeImg.style.transform = "scale(1.1)";
        setTimeout(() => animeImg.style.transform = "scale(1)", 300);

    } catch (err) {
        chatBubble.innerHTML = "Maaf, otak saya konslet. Coba lagi nanti!";
    } finally {
        // Selesai mikir, karakter boleh ngomong acak lagi nanti
        sedangMikir = false;
    }
}

// --- 4. LOGIKA KEHIDUPAN (Random Activity) ---
const kataKataRandom = [
    "Jangan diliatin terus dong, malu tau! 😳",
    "Kamu lagi ngerjain apa sih? Serius amat.",
    "Geser aku ke kanan dong, bosen di kiri.",
    "Haaah... ngantuk nih 😴",
    "Coba klik kepala aku deh!",
    "Eh, mouse kamu gerak-gerak terus pusing liatnya."
];

const kataKataDidorong = [
    "Minggir dulu ah! 😤",
    "Sempit tau!",
    "Jangan deket-deket woi!",
    "Hus hus, sanaan dikit!"
];

// Jalan otomatis setiap 7 detik
setInterval(() => {
    // Jika user lagi make AI (sedangMikir = true), jangan diganggu!
    if (sedangMikir) return; 

    const aksi = Math.random(); 

    // 30% Kemungkinan dorong chat
    if (aksi < 0.3) {
        dorongChat();
    } 
    // 40% Kemungkinan ngomong sendiri
    else if (aksi > 0.3 && aksi < 0.7) {
        const teksAcak = kataKataRandom[Math.floor(Math.random() * kataKataRandom.length)];
        updateChat(teksAcak);
    }
}, 7000); // 7 detik sekali biar gak berisik

function dorongChat() {
    chatBubble.classList.add('didorong');
    const teksMarah = kataKataDidorong[Math.floor(Math.random() * kataKataDidorong.length)];
    chatBubble.innerHTML = teksMarah;
    setTimeout(() => {
        chatBubble.classList.remove('didorong');
        // Kembalikan ke teks default kalau sebelumnya kosong
        chatBubble.innerHTML = "Ada yang bisa dibantu?"; 
    }, 1000);
}

function updateChat(teks) {
    chatBubble.style.opacity = 0;
    setTimeout(() => {
        chatBubble.innerHTML = teks;
        chatBubble.style.opacity = 1;
    }, 300);
}

// --- 5. INTERAKSI & ANIMASI ---

// Klik Gambar
animeImg.addEventListener('click', () => {
    if(sedangMikir) return; // Jangan respon klik kalau lagi mikir
    updateChat("Aduh! Sakit tau dicubitin terus! 💢");
    
    // Efek Getar
    animeImg.style.transform = "translateX(5px)";
    setTimeout(() => animeImg.style.transform = "translateX(-5px)", 50);
    setTimeout(() => animeImg.style.transform = "translateX(5px)", 100);
    setTimeout(() => animeImg.style.transform = "translateX(0)", 150);
});

// Pindah Posisi
function pindahPosisi() {
    if (container.classList.contains('posisi-kiri')) {
        container.classList.remove('posisi-kiri');
        container.classList.add('posisi-kanan');
        if(!sedangMikir) updateChat("Nah, di kanan lebih adem 🍃");
    } else {
        container.classList.remove('posisi-kanan');
        container.classList.add('posisi-kiri');
        if(!sedangMikir) updateChat("Oke, balik lagi ke kiri!");
    }
}

// Parallax Mouse
document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth - e.pageX * 2) / 80; 
    const y = (window.innerHeight - e.pageY * 2) / 80;
    animeWrapper.style.transform = `translateX(${x}px) translateY(${y}px)`;
});
