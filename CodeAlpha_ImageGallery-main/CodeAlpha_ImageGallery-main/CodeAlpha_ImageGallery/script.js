const images = [
    "images/BMW1.jpg",
    "images/BMW2.jpg",
    "images/BMW3.jpg",
    "images/BMW4.jpg",
    "images/BMW5.jpg",
    "images/BMW6.jpg",
    "images/BMW7.jpg",
    "images/BMW8.jpg",
    "images/BMW9.jpg",
    "images/BMW10.jpg"
];

let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    document.getElementById("lightbox").style.display = "flex";
    document.getElementById("lightbox-img").src = images[currentIndex];
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

function changeImage(step) {
    currentIndex += step;
    if (currentIndex < 0) currentIndex = images.length - 1;
    if (currentIndex >= images.length) currentIndex = 0;
    document.getElementById("lightbox-img").src = images[currentIndex];
}

function toggleGrayscale() {
    const gallery = document.querySelector('.gallery');
    gallery.classList.toggle('grayscale');
}
