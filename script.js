console.log("js starting");
let newsong = new Audio();
let songs = [];
let e1;

let trackname = document.querySelector(".trackname");
let time = document.querySelector(".time");
let play = document.getElementById("play");
let back = document.getElementById("back");
let next = document.getElementById("next");
let trackbar = document.querySelector(".trackbar");
let point = document.querySelector(".point");
let volume = document.querySelector(".volume");

// GitHub repo details - apne hisaab se replace karna
const githubUser = "dkprajapat1";
const githubRepo = "Music_clone";
const basePath = `https://api.github.com/repos/${githubUser}/${githubRepo}/contents/Music_clone/song`;

async function getfile() {
    try {
        let res = await fetch(basePath);
        let data = await res.json();

        // Filter only mp3 files and map to download URLs
        songs = data.filter(item => item.name.endsWith(".mp3")).map(item => item.download_url);
        return songs;
    } catch (error) {
        console.error("Error fetching songs from GitHub API:", error);
        return [];
    }
}

async function playlist() {
    let songsUrls = await getfile();

    let pcard = document.querySelector(".cards").getElementsByTagName("ul")[0];
    pcard.innerHTML = "";  // Clear existing cards if any

    songsUrls.forEach(url => {
        let fileName = url.split('/').pop();  // Get filename from URL
        let displayName = fileName.replace(".mp3", "").replace(/%20/g, " ");

        // Assuming no subfolders, else adjust this accordingly
        let coverUrl = `https://raw.githubusercontent.com/${githubUser}/${githubRepo}/main/Music_clone/song/cover.jpeg`; 
        // Agar playlists ke folders hain, to cover photo path ko us hisaab se adjust karna hoga.

        pcard.innerHTML += `<li>
            <div class="card">
                <img src="${coverUrl}" alt="image">
                <div class="playlistname">${displayName}</div>
                <div class="artist">Arijit Singh</div>
                <img class="color_play" src="svg/play_color.svg" alt="">
            </div>
        </li>`;
    });

    Array.from(document.querySelector(".cards>ul").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", async () => {
            let playlistName = e.querySelector(".playlistname").innerText.trim();

            // Filter songs to only those matching the clicked playlist name (if playlists exist)
            // Here, assuming all songs are in one folder, so just play that song
            let songToPlay = songs.find(s => s.includes(playlistName));

            if (songToPlay) {
                playsong(songToPlay);
            } else {
                console.warn("Song not found in list");
            }
        });
    });
}

function playsong(trackUrl) {
    newsong.pause();
    newsong.src = trackUrl;
    let trackNameDisplay = trackUrl.split('/').pop().replace(".mp3", "").replace(/%20/g, " ");
    trackname.innerHTML = trackNameDisplay + "...";
    play.src = "svg/pause.svg";
    newsong.play();
}

// Play button toggle
play.addEventListener("click", () => {
    if (newsong.paused) {
        newsong.play();
        play.src = "svg/pause.svg";
    } else {
        newsong.pause();
        play.src = "svg/play.svg";
    }
});

// Update time and track progress bar
newsong.addEventListener("timeupdate", () => {
    function secondtominuts(time) {
        let seconds = parseInt(time % 60);
        let minuts = parseInt(time / 60);
        if(seconds < 10) seconds = "0" + seconds;
        if(minuts < 10) minuts = "0" + minuts;
        return (minuts + ":" + seconds);
    }
    let songDone = ((newsong.currentTime / newsong.duration) * 100) || 0;
    time.innerHTML = `${secondtominuts(newsong.currentTime)} / ${secondtominuts(newsong.duration)}`;
    point.style.left = `${songDone}%`;
});

// Seekbar click
trackbar.addEventListener("click", (e) => {
    let seekPercent = e.offsetX / trackbar.clientWidth;
    newsong.currentTime = seekPercent * newsong.duration;
});

// Volume control
document.querySelector(".volume").getElementsByTagName("img")[0].addEventListener("click", (e) => {
    if (newsong.volume != 0) {
        newsong.volume = 0;
    } else {
        newsong.volume = 0.5;
    }
});
document.getElementById("volume").addEventListener("input", (e) => {
    let svolume = e.target.value / 100;
    newsong.volume = svolume;
});

// Next and back buttons
next.addEventListener("click", () => {
    let index = songs.indexOf(newsong.src);
    if (index < songs.length - 1) {
        playsong(songs[index + 1]);
    }
});
back.addEventListener("click", () => {
    let index = songs.indexOf(newsong.src);
    if (index > 0) {
        playsong(songs[index - 1]);
    }
});

// Hamburger menu controls
document.getElementById("hamburger").addEventListener("click", () => {
    document.querySelector(".leftbox").style.left = "0%";
});
document.getElementById("close").addEventListener("click", () => {
    document.querySelector(".leftbox").style.left = "-200%";
});

playlist();

