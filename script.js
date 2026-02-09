$(document).ready(function () {
  // === Configuration & Constants ===
  const TRANSITION_DURATION = 600; // Durasi transisi dalam milidetik
  const TRANSITION_DELAY = 610; // Delay untuk reset posisi setelah transisi (sedikit lebih lama dari duration)

  // === Dom Element Selectors ===
  const wrapper = $(".carousel-wrapper"); // Container utama yang bergerak (flex container)
  const slides = $(".carousel-slide"); // Semua slide asli dari HTML
  const dots = $(".dot"); // Indicator dots di bawah carousel
  const nextBtn = $(".next"); // Tombol navigasi next
  const prevBtn = $(".prev"); // Tombol navigasi previous

  // === State Management ===
  const totalSlides = slides.length; // Total jumlah slide asli (5 slide)
  let currentIndex = 1; // Index slide aktif - dimulai dari 1 karena ada clone di index 0
  let isAnimating = false;

  // === Infinite Loop Setup ===
  /**
   * Untuk membuat infinite loop yang smooth, kita clone slide pertama dan terakhir:
   * - Clone slide terakhir: diletakkan di awal (index 0)
   * - Clone slide pertama: diletakkan di akhir (index terakhir + 1)
   *
   * Struktur akhir: [Clone-last, Slide-1, Slide-2, ..., Slide-5, Clone-First]
   *
   * Ketika user mencapai Clone-First, kita langsung jump ke Slide-1 tanpa transisi
   * Ketika user mencapai Clone-Last, kita langsung jump ke Slide-5 tanpa transisi
   */
  const firstClone = slides.eq(0).clone().addClass("clone");
  const lastClone = slides
    .eq(totalSlides - 1)
    .clone()
    .addClass("clone");

  wrapper.append(firstClone); // Tambahkan clone slide pertama di akhir
  wrapper.prepend(lastClone); // Tambahkan clone slide terakhir di awal

  // Set posisi awal carousel ke slide pertama yang asli (bukan clone)
  // translateX(-100%) karena clone terakhir ada di index 0
  wrapper.css("transform", "translateX(-100%)");

  // === Core Functions ===
  /**
   * Fungsi untuk berpindah ke slide tertentu
   * @param {number} index - Index slide tujuan (1-based karena index 0 adalah clone)
   * @param {boolean} withTransition - Apakah perpindahan menggunakan animasi transisi
   */
  function goToSlide(index, withTransition = true) {
    // Set flag bahwa animasi sedang berjalan
    isAnimating = true;

    // Tentukan apakah perpindahan menggunakan transisi atau instant (tanpa animasi)
    if (!withTransition) {
      wrapper.css("transition", "none"); // Matikan transisi untuk instant jump
    } else {
      wrapper.css("transition", "transform 0.6s ease-in-out");
    }

    // Hitung offset translateX berdasarkan index
    // Setiap slide memiliki width 100%, jadi offset = -index * 100%
    const offset = -index * 100;
    wrapper.css("transform", `translateX(${offset}%)`);

    // Update active dot indicator
    updateDots(index);

    // Reset flag animasi setelag transisi selesai
    setTimeout(() => {
      isAnimating = false;
    }, TRANSITION_DURATION);
  }

  /**
   * Fungsi untuk update indicator dots
   * @param {number} index - Index slide aktif (1-based)
   */
  function updateDots(index) {
    // Konversi index slide ke index dot (0-based)
    // Karena dots tidak termasuk clone
    let dotIndex = index - 1;

    // Handle edge cases untuk infinite loop
    if (dotIndex < 0) dotIndex = totalSlides - 1; // Jika di clone terakhir, aktifkan dot terakhir
    if (dotIndex >= totalSlides) dotIndex = 0; // Jika di clone pertama, aktifkan dot pertama

    // Update visual dot
    dots.removeClass("active");
    dots.eq(dotIndex).addClass("active");
  }

  // === Event Handlers ===
  /**
   * Handler untuk tombol next
   * Fungsi: Pindah ke slide berikutnya
   */

  nextBtn.click(function () {
    // Cegah multiple clicks saat animasi masih berjalan
    if (isAnimating) return;

    // Increment index untuk pindah ke slide berikutnya
    currentIndex++;
    goToSlide(currentIndex);

    /**
     * Infinite Loop Logic - Forward Direction
     * Ketika mencapai clone pertama (setelah slide terakhir),
     * kita perlu jump kembali ke slide pertama yang asli
     * tanpa transisi agar user tidak sadar
     */
    setTimeout(() => {
      if (currentIndex === totalSlides + 1) {
        // Reset ke slide pertama asli (index 1)
        currentIndex = 1;
        goToSlide(currentIndex, false); // Jump tanpa transisi
      }
    }, TRANSITION_DELAY);
  });

  /**
   * Handler untuk tombol previous
   * Funsgi: Pindah ke slide berikutnya
   */
  prevBtn.click(function () {
    // Cegah multiple clicks saat animasi masih berjalan
    if (isAnimating) return;

    // Decrement index untuk pindah ke slide sebelumnya
    currentIndex--;
    goToSlide(currentIndex);

    /**
     * Infinite Loop Logic - Backward Direction
     * Ketika mencapai clone terakhir (sebelum slide pertama),
     * kita perlu jump kembali ke slide terakhir yang asli
     * tanpa transisi agar user tidak sadar
     */
    setTimeout(() => {
      if (currentIndex === 0) {
        // Reset ke slide terakhir asli (index totalSlides)
        currentIndex = totalSlides;
        goToSlide(currentIndex, false); // Jump tanpa transisi
      }
    }, TRANSITION_DELAY);
  });

  /**
   * Handler untuk klik pada dots
   * Fungsi: Langsung jump ke slide yang dipilih
   */
  dots.click(function () {
    // Cegah action saat animasi masih berjalan
    if (isAnimating) return;

    // Ambil index dot yang diklik (0-based)
    const dotIndex = $(this).data("index");

    // Konversi ke index slide (1-based karena clone di index 0)
    currentIndex = dotIndex + 1;

    // Pindah ke slide yang dipilih dengan transisi
    goToSlide(currentIndex);
  });

  // === Initialization ===
  /**
   * Set posisi awal carousel tanpa transisi
   * Ini untuk memastikan carousel dimulai dari slide pertama yang asli
   */
  goToSlide(currentIndex, false);
});
