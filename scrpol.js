const tombolSapa = document.getElementById('sapaButton');

// Pastikan elemen ada sebelum menambahkan event listener untuk mencegah error
if (tombolSapa) {
    tombolSapa.addEventListener('click', function() {
        alert('Halo! Terima kasih sudah berkunjung');
    }); // Perbaikan urutan kurung tutup di sini
}
