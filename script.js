console.log("js starting");
let newsong = new Audio();
let songs = [];

let trackname = document.querySelector(".trackname");
let time = document.querySelector(".time");
let play = document.getElementById("play");
let back = document.getElementById("back");
let next = document.getElementById("next");
let trackbar = document.querySelector(".trackbar");
let point = document.querySelector(".point");
let volume = document.querySelector(".volume");

const githubUser = "dkprajapat1";
const githubRepo = "Music_clone";
const basePath = `https://api.github.com/repos/${githubUser}/${githubRepo}/contents/Music_clone/song`;

let playlists = []; // Will hold playlist info objects

// 1. Fetch all playlists (folders inside song/)
async function getPlaylists() {
  try {
    let res = await fetch(basePath);
    let data = await res.json();

    playlists = await Promise.all(data.map(async folder => {
      if (!folder.type || folder.type !== "dir") return null;

      let res2 = await fetch(folder.url);
      let playlistData = await res2.json();

      let coverFile = playlistData.find(f => f.name.toLowerCase().includes("cover") && f.name.endsWith(".jpeg"));
      let coverUrl = coverFile ? coverFile.download_url : "";

      let playlistSongs = playlistData.filter(f => f.name.endsWith(".mp3")).map(f => f.download_url);

      return {
        name: folder.name,
        coverUrl,
        songs: playlistSongs
      };
    }));

    playlists = playlists.filter(p => p !== null);

    return playlists;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
}

// 2. Show playlists on UI
async function showPlaylists() {
  let pls = await getPlaylists();
  let pcard = document.querySelector(".cards ul");
  pcard.innerHTML = "";

  pls.forEach((pl, i) => {
    pcard.innerHTML += `
      <li>
        <div class="card">
          <img src="${pl.coverUrl}" alt="cover photo" />
          <div class="playlistname">${pl.name}</div>
          <div class="artist">Artist Name</div>
          <img class="color_play" src="svg/play_color.svg" alt="play icon" />
        </div>
      </li>`;
  });

  Array.from(pcard.children).forEach((li, i) => {
    li.addEventListener("click", () => {
      showSongs(playlists[i].songs);
    });
  });
}

// 3. Show songs of selected playlist
function showSongs(songsList) {
  songs = songsList; // update global songs array for next/back buttons

  let list = document.querySelector(".playlist ul");
  list.innerHTML = "";

  songsList.forEach((songUrl, idx) => {
    let fileName = songUrl.split('/').pop().replace(".mp3", "").replace(/%20/g, " ");
    list.innerHTML += `
      <li>
        <img src="svg/music.svg" alt="music icon" />
        <div class="songname">${fileName}</div>
        <img class="pplay" src="svg/play.svg" alt="play button" />
      </li>`;
  });

  Array.from(list.children).forEach((li, i) => {
    li.addEventListener("click", () => {
      playsong(songs[i]);
    });
  });
}

// 4. Play a song
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

// Volume control toggle mute/unmute
document.querySelector(".volume").getElementsByTagName("img")[0].addEventListener("click", () => {
  newsong.volume = newsong.volume !== 0 ? 0 : 0.5;
});

// Volume slider input
document.getElementById("volume").addEventListener("input", (e) => {
  newsong.volume = e.target.value / 100;
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

// Start by showing playlists
showPlaylists();
