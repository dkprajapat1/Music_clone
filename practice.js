console.log("js starting")
let newsong = new Audio()
let songs
let coverphoto
let trackname = document.querySelector(".trackname")
let time = document.querySelector(".time")
let play = document.getElementById("play")
let back = document.getElementById("back")
let next = document.getElementById("next")
let trackbar = document.querySelector(".trackbar")
let point = document.querySelector(".point")
let volume = document.querySelector(".volume")


async function getfile() {
    let songs = fetch("http://127.0.0.1:3000/song/")
    let responce = (await songs).text()
    return responce;

}

async function playlist() {
    let files = await getfile();
    let div = document.createElement("div");
    div.innerHTML = files;
    let af = div.getElementsByTagName("a")
    // console.log(af[1].href)
    let pfiles = [];
    for (let index = 1; index < af.length; index++) {
        const element = af[index].href;
        pfiles.push(element)

    }
    
    // ad folder to display
    for (let file of pfiles) {
        
        let pcard = document.querySelector(".cards").getElementsByTagName("ul")[0]
        file = file.split("/song/")[1]
        pcard.innerHTML = pcard.innerHTML + `<li>
                            <div class="card">
                                <img src="${coverphoto}" alt="image">
                                <div class="playlistname">${file.replace("/", "")}</div>
                                <div class="artist">Arijit singh</div>
                                 <img class="color_play" src="play_color.svg" alt="">
                            </div>
                            </li> `
    }
    Array.from(document.querySelector(".cards>ul").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", element => {
            let playlistsong = `http://127.0.0.1:3000/song/${e.querySelector(".card").children[1].innerHTML}`
       
        
            main(playlistsong)


            // function for got songs from file
            async function getsong(link) {
                x = link
                let songs = fetch(x)
                let responce = (await songs).text()
                return responce;

            }

            async function main(link) {
                let responce = await getsong(link)
                let div = document.createElement("div");
                div.innerHTML = responce;
                let as = div.getElementsByTagName("a")
                // console.log(as[3].href)
                for (let i = 0; i < as.length; i++) {
                    // const element = as[i];
                    if(as[i].href.endsWith(".jpeg")){
                    console.log("mil gya photo")
                    // coverphoto = (as[i].href)
                    console.log(coverphoto)
                    }
                    
                }

                // store music links from file's
                songs = [];
                for (let index = 0; index < as.length; index++) {
                    const element = as[index].href;
                    if (element.endsWith(".mp3")) {
                        songs.push(element)
                    }
                }

                //got song from user responce 
                function playsong(track) {
                    // console.log("track" + track)
                    newsong.pause();
                    newsong.src = `song/${track}.mp3`;
                    let track1 = track;
                    trackname.innerHTML = track1.replaceAll("/", " ") + "..."
                    play.src = "pause.svg"
                    newsong.play();
                }

                //playlist card and song name
                if (document.querySelector(".playlist").getElementsByTagName("ul")[0].innerHTML !== "") {
                    document.querySelector(".playlist>ul").innerHTML = ""
                }
                for (let song of songs) {
                    let list = document.querySelector(".playlist").getElementsByTagName("ul")[0]
                    song = song.split("/song/")[1];
                    song = song.replaceAll("%20", " ")
                    list.innerHTML = list.innerHTML + `<li>
                    <img src="music.svg" alt="">
                    <div class="songname"> ${song.replaceAll(".mp3", "")}</div>
                    <div>play</div>
                    <img class="pplay" src="play.svg" alt="">
                    </li>`
                }

                //to set default song
                if (newsong.pause) {
                    let song = songs[0].split("/song/")[1];
                    song = song.replaceAll("%20", " ")
                    // console.log(song)
                    playsong(song.replaceAll(".mp3", "").trim())
                }


                //send song to play function
                a = 1;
                Array.from(document.querySelector(".playlist>ul").getElementsByTagName("li")).forEach((e) => {

                    e.addEventListener("click", element => {
                        if (a == 1) {
                            e.querySelector(".pplay").src = "pause.svg"
                            e.querySelector(".pplay").style.filter = "invert(0)"
                            e.style.color = "black"
                            e.querySelector(".playlist>ul>li img").style.filter = "invert(0)"
                            e.style.background = "rgb(197, 197, 197)"
                            playsong(e.querySelector(".songname").innerHTML.trim())

                            a = 0;
                        }
                        else {
                            e.style.background = "#0000"
                            e.querySelector(".pplay").src = "play.svg"
                            e.querySelector(".pplay").style.filter = "invert(1)"
                            e.style.color = "white"
                            e.querySelector(".playlist>ul>li img").style.filter = "invert(1)"

                            play.src = "play.svg"
                            newsong.pause();

                            a = 1;
                        }
                    })
                })

                //conver time into minuts
                function secondtominuts(time) {
                    seconds = parseInt(time % 60);
                    minuts = parseInt(time / 60);

                    return (minuts + ":" + seconds)
                }

                function updatetrack(track) {
                    point.style.left = `${track}%`

                }
                //input check from user
                function usertrackinput(uinput) {
                    newsong.currentTime = uinput * newsong.duration
                }
                //song time and duration
                newsong.addEventListener("timeupdate", () => {
                    let songDone = ((newsong.currentTime / newsong.duration) * 100)
                    time.innerHTML = `${secondtominuts(newsong.currentTime)} / ${secondtominuts(newsong.duration)}`
                    updatetrack(songDone)
                })





                //next and back

                next.addEventListener("click", () => {
                    //  newsong.pause();
                    let index = (songs.indexOf(newsong.src))
                    let length = songs.length
                    if (index < length) {
                        newsong.src = songs[index + 1]
                    }
                    let nexts = newsong.src
                    nexts = nexts.split("/song/")[1]
                    nexts = nexts.replaceAll("%20", " ")
                    playsong(nexts.replace(".mp3", ""))
                })

                back.addEventListener("click", () => {
                    //  newsong.pause();
                    let index = (songs.indexOf(newsong.src))
                    let length = songs.length
                    if (index >= 0) {
                        newsong.src = songs[index - 1]
                    }
                    // console.log("hello")
                    let backs = newsong.src
                    backs = backs.split("/song/")[1]
                    backs = backs.replaceAll("%20", " ")
                    playsong(backs.replace(".mp3", ""))
                    // console.log(songs.indexOf(newsong.src), songs.length)
                })

                //track change by user

                trackbar.addEventListener("click", (e) => {
                    // console.log("working")
                    // console.log((e.offsetX / trackbar.clientWidth) * 100)
                    usertrackinput(e.offsetX / trackbar.clientWidth);

                })
            }
        })
    })
}
playlist()
document.getElementById("hamburger").addEventListener("click", () => {
    document.querySelector(".leftbox").style.left = "0%"
})
document.getElementById("close").addEventListener("click", () => {
    document.querySelector(".leftbox").style.left = "-200%"
})

//play button
play.addEventListener("click", () => {
    if (newsong.paused) {
        newsong.play()
        play.src = "pause.svg"

    }
    else if (newsong.play) {
        newsong.pause();
        play.src = "play.svg"
    }
})

// newsong.volume = 0.1;
document.getElementById("volume").addEventListener("click" , (e)=>{
    let svolume = (e.target.value)/100;
    newsong.volume = svolume;
})

document.querySelector(".volume")[1].getElementsByTagName("img").addEventListener("click" , ()=>{
        // if( svolume != 0){
        console.log("hello dinesh")
            //  svolume=0;
            // newsong.volume = svolume;
        // }
        // else{
            // newsong.volume = 0.5;
        // }
})