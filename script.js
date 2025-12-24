// Elemen DOM
const revealBtn = document.getElementById('revealBtn');
const cardContainer = document.getElementById('cardContainer');
const card = document.getElementById('card');
const snowflakesContainer = document.getElementById('snowflakes');
const titleElement = document.querySelector('.title');

// Status kartu (terbuka atau tertutup)
let isCardOpen = false;

// Teks untuk efek ketikan
const titleText = "Selamat <span>Natal</span> 2024";

// Fungsi untuk membuat efek salju
function createSnowflakes() {
    const snowflakeCount = 80;
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Ukuran acak antara 2px hingga 6px
        const size = Math.random() * 4 + 2;
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        
        // Posisi horizontal acak
        const startPosition = Math.random() * 100;
        snowflake.style.left = `${startPosition}vw`;
        
        // Animasi dengan durasi acak antara 5 hingga 15 detik
        const animationDuration = Math.random() * 10 + 5;
        snowflake.style.animationDuration = `${animationDuration}s`;
        
        // Delay awal acak
        const animationDelay = Math.random() * 5;
        snowflake.style.animationDelay = `${animationDelay}s`;
        
        snowflakesContainer.appendChild(snowflake);
    }
}

// Fungsi untuk membuka/menutup kartu
function toggleCard() {
    if (!isCardOpen) {
        // Buka kartu
        cardContainer.style.height = `${card.offsetHeight + 20}px`;
        setTimeout(() => {
            card.classList.add('show');
        }, 100);
        
        // Ubah teks dan ikon tombol
        revealBtn.innerHTML = '<i class="fas fa-times"></i> Tutup Kartu Ucapan';
        isCardOpen = true;
        
        // Tambahkan efek suara (opsional)
        playSound();
        
        // Tambahkan confetti saat kartu terbuka
        createConfetti();
    } else {
        // Tutup kartu
        card.classList.remove('show');
        setTimeout(() => {
            cardContainer.style.height = '0';
        }, 300);
        
        // Ubah teks dan ikon tombol
        revealBtn.innerHTML = '<i class="fas fa-gift"></i> Buka Kartu Ucapan';
        isCardOpen = false;
    }
}

// Fungsi untuk memutar suara Natal
function playSound() {
    try {
        // Buat elemen audio
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-christmas-bells-299.mp3');
        audio.volume = 0.3;
        audio.play().catch(e => {
            console.log("Autoplay diblokir oleh browser. Klik tombol untuk memutar suara.");
        });
    } catch (error) {
        console.log("Tidak dapat memutar suara: ", error);
    }
}

// Fungsi untuk efek ketikan pada judul
function typeWriterEffect() {
    titleElement.innerHTML = '';
    
    let i = 0;
    let isInTag = false;
    let tagContent = '';
    
    const typeWriter = () => {
        if (i < titleText.length) {
            const char = titleText.charAt(i);
            
            // Cek apakah kita sedang di dalam tag HTML
            if (char === '<') {
                isInTag = true;
            }
            
            if (isInTag) {
                tagContent += char;
                
                // Cek apakah tag sudah ditutup
                if (char === '>') {
                    isInTag = false;
                    titleElement.innerHTML += tagContent;
                    tagContent = '';
                }
            } else {
                titleElement.innerHTML += char;
            }
            
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Mulai efek ketikan
    typeWriter();
}

// Fungsi untuk membuat efek confetti
function createConfetti() {
    const confettiCount = 50;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('snowflake'); // Gunakan kelas yang sama dengan salju untuk styling
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Ukuran acak
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Bentuk acak (kotak atau lingkaran)
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        } else {
            confetti.style.borderRadius = '0';
        }
        
        // Posisi awal acak di sekitar tombol
        const buttonRect = revealBtn.getBoundingClientRect();
        const startX = buttonRect.left + buttonRect.width / 2;
        const startY = buttonRect.top + buttonRect.height / 2;
        
        confetti.style.left = `${startX}px`;
        confetti.style.top = `${startY}px`;
        
        // Animasi khusus untuk confetti
        confetti.style.animation = `confettiFall 3s forwards`;
        
        // Tambahkan ke container salju
        snowflakesContainer.appendChild(confetti);
        
        // Hapus confetti setelah animasi selesai
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
    
    // Tambahkan keyframe untuk animasi confetti
    if (!document.getElementById('confetti-keyframes')) {
        const style = document.createElement('style');
        style.id = 'confetti-keyframes';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() * 200 - 100}px, 100vh) rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Fungsi untuk mengatur ulang efek ketikan saat resize
function resetTitleOnResize() {
    if (window.innerWidth < 768) {
        // Untuk mobile, tampilkan langsung tanpa efek ketikan
        titleElement.innerHTML = titleText;
    } else {
        // Untuk desktop, jalankan efek ketikan
        typeWriterEffect();
    }
}

// Inisialisasi saat halaman dimuat
window.addEventListener('load', () => {
    createSnowflakes();
    resetTitleOnResize();
    
    // Atur tinggi awal kartu container
    cardContainer.style.height = '0';
});

// Tambahkan event listener pada tombol
revealBtn.addEventListener('click', toggleCard);

// Responsif untuk tinggi kartu saat resize window
window.addEventListener('resize', () => {
    if (isCardOpen) {
        cardContainer.style.height = `${card.offsetHeight + 20}px`;
    }
    
    // Reset efek ketikan saat resize
    resetTitleOnResize();
});

// Tambahkan efek hover pada pohon
document.querySelectorAll('.tree').forEach(tree => {
    tree.addEventListener('mouseenter', () => {
        tree.style.transform = `translateY(-50%) scale(1.05)`;
        tree.style.transition = 'transform 0.3s ease';
    });
    
    tree.addEventListener('mouseleave', () => {
        tree.style.transform = `translateY(-50%) scale(1)`;
    });
});
