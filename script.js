$(document).ready(function () {
  const wrapper = $(".carousel-wrapper");
  const slides = $(".carousel-slide");
  const totalSlides = slides.length;

  let currentIndex = 1;

  const firstClone = slides.eq(0).clone().addClass("clone");
  const lastClone = slides
    .eq(totalSlides - 1)
    .clone()
    .addClass("clone");
  wrapper.append(firstClone);
  wrapper.prepend(lastClone);

  const allSlides = $(".carousel-slide");
  wrapper.css("transform", "translateX(-100%)");

  function goToSlide(index, withTransition = true) {
    if (!withTransition) wrapper.css("transition", "none");
    else wrapper.css("transition", "transform 0.6s ease-in-out");

    const offset = -index * 100;
    wrapper.css("transform", "translateX(" + offset + "%)");

    // update dot
    let dotIndex = index - 1;
    if (dotIndex < 0) dotIndex = totalSlides - 1;
    if (dotIndex >= totalSlides) dotIndex = 0;
    $(".dot").removeClass("active");
    $(".dot").eq(dotIndex).addClass("active");
  }

  // button next
  $(".next").click(function () {
    if (wrapper.is(":animated")) return;
    currentIndex++;
    goToSlide(currentIndex);

    // kalau sampai clone pertama (setelah slide terakhir)
    setTimeout(() => {
      if (currentIndex === totalSlides + 1) {
        currentIndex = 1;
        goToSlide(currentIndex, false);
      }
    }, 610);
  });

  // button prev
  $(".prev").click(function () {
    if (wrapper.is(":animated")) return;
    currentIndex--;
    goToSlide(currentIndex);

    // kalau sampai clone terakhir (sebelum slide pertama)
    setTimeout(() => {
      if (currentIndex === 0) {
        currentIndex = totalSlides;
        goToSlide(currentIndex, false);
      }
    }, 610);
  });

  // klik dot
  $(".dot").click(function () {
    const dotIndex = $(this).data("index");
    currentIndex = dotIndex + 1;
    goToSlide(currentIndex);
  });

  // inisialisasi
  goToSlide(currentIndex, false);
});
