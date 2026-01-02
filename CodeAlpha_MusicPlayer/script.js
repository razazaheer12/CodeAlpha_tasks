const playlist = [
    { 
        title: "Starboy",
        artist: "The Weeknd",
        src: "Music_Tracks/Starboy_LOW.mp3"
    },
    { 
        title: "Save Your Tears",
        artist: "The Weeknd",   
        src: "Music_Tracks/Save_Your_Tears_LOW.mp3"
    },
    { 
        title: "Blinding Lights",
        artist: "The Weeknd",
        src: "Music_Tracks/Blinding_Lights_48KBPS.mp3"
    }
];

let currentTrackIndex = 0;
let isPlaying = false;
let autoplay = false;

// Create audio element
const audio = new Audio();
audio.volume = 0.7;

// DOM Elements
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressContainer = document.getElementById('progressContainer');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const songTitle = document.querySelector('.song-title');
const songArtist = document.querySelector('.song-artist');
const volumeSlider = document.getElementById('volumeSlider');
const volumeLevel = document.getElementById('volumeLevel');
const playlistEl = document.getElementById('playlist');
const autoplayToggle = document.getElementById('autoplayToggle');

// Initialize
function init() {
    loadPlaylist();
    loadTrack(0);
    setupEventListeners();
}

// Load playlist UI
function loadPlaylist() {
    playlistEl.innerHTML = playlist.map((track, index) => `
        <div class="playlist-item ${index === currentTrackIndex ? 'active' : ''}" data-index="${index}">
            <span class="playlist-item-duration" id="duration-${index}">0:00</span>
            <div class="playlist-item-title">${track.title}</div>
            <div class="playlist-item-artist">${track.artist}</div>
        </div>
    `).join('');

    // Add click listeners to playlist items
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'));
            loadTrack(index);
            play();
        });
    });
}

// Load track
function loadTrack(index) {
    currentTrackIndex = index;
    const track = playlist[index];
    
    songTitle.textContent = track.title;
    songArtist.textContent = track.artist;
    
    // Load audio source
    audio.src = track.src;
    audio.load();
    
    // Reset progress
    progress.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationEl.textContent = '0:00';
    
    updatePlaylistUI();
}

// Update playlist UI
function updatePlaylistUI() {
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        if (index === currentTrackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Play audio
function play() {
    audio.play().then(() => {
        isPlaying = true;
        playBtn.textContent = '⏸';
    }).catch(error => {
        console.error('Playback error:', error);
        alert('Error playing audio. Please check if the file path is correct.');
    });
}

// Pause audio
function pause() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = '▶';
}

// Next track
function next() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
}

// Previous track
function previous() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
    }
}

// Format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Event Listeners
function setupEventListeners() {
    // Audio events
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
        const durationSpan = document.getElementById(`duration-${currentTrackIndex}`);
        if (durationSpan) {
            durationSpan.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener('timeupdate', () => {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = progressPercent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
        if (autoplay) {
            next();
            play();
        } else {
            pause();
            audio.currentTime = 0;
        }
    });

    audio.addEventListener('play', () => {
        isPlaying = true;
        playBtn.textContent = '⏸';
    });

    audio.addEventListener('pause', () => {
        isPlaying = false;
        playBtn.textContent = '▶';
    });

    // Control buttons
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    });

    nextBtn.addEventListener('click', () => {
        next();
        play();
    });

    prevBtn.addEventListener('click', () => {
        previous();
        if (isPlaying) play();
    });

    // Progress bar
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const newTime = (clickX / width) * audio.duration;
        audio.currentTime = newTime;
    });

    // Volume control
    volumeSlider.addEventListener('click', (e) => {
        const width = volumeSlider.clientWidth;
        const clickX = e.offsetX;
        const newVolume = clickX / width;
        audio.volume = newVolume;
        volumeLevel.style.width = (newVolume * 100) + '%';
    });

    // Autoplay toggle
    autoplayToggle.addEventListener('click', () => {
        autoplay = !autoplay;
        autoplayToggle.classList.toggle('active');
    });
}

// Initialize on load
init();

