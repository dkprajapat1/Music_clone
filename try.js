console.log("js starting")
let newsong = new Audio()
let trackname = document.querySelector(".trackname")
let time = document.querySelector(".time")
let play = document.getElementById("play")
let back = document.getElementById("back")
let next = document.getElementById("next")
let trackbar = document.querySelector(".trackbar")
let point = document.querySelector(".point")
let volume = document.querySelector(".volume")
let first 

// console.log(point)


async function getsong() {
    let songs = fetch("http://127.0.0.1:3000/song/")
    let responce = (await songs).text()
    return responce;

}


async function main() {

    let responce = await getsong()
    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    // console.log(as[1].href)

    // store music links from file's
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index].href;
        if (element.endsWith(".mp3")) {
            songs.push(element)
        }
    }



    //got song from user responce 
    function playsong(track , a) {
        newsong.src = `song/${track}.mp3`;
        // newsong.src = "song/"+track+".mp3";
        trackname.innerHTML = track + "..."
        play.src = "pause.svg"
        // a.style.background = "rgb(197, 197, 197)"
        newsong.play();
    }

   

    //playlist card and song name
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
    if(newsong.pause){
       let song = songs[0].split("/song/")[1];
        song = song.replaceAll("%20", " ")
        console.log(song)
        playsong(song.replaceAll(".mp3", "").trim(),)
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

                playsong(e.querySelector(".songname").innerHTML.trim() ,e)
                console.log(e)

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

        return (minuts+":"+seconds)
    }

    function updatetrack(track){
        point.style.left = `${track}%`
        
    }
//input check from user
    function usertrackinput(uinput){
        newsong.currentTime = uinput*newsong.duration
    }
    //song time and duration
    newsong.addEventListener("timeupdate", () => {
        let songDone = ((newsong.currentTime/newsong.duration)*100)
        time.innerHTML = `${secondtominuts(newsong.currentTime)} / ${secondtominuts(newsong.duration)}`
        updatetrack(songDone)
    })



    //play button
    play.addEventListener("click", () => {
        if (newsong.paused) {
            newsong.play()
            play.src = "pause.svg"
            
        }
        else {
            newsong.pause();
            play.src = "play.svg"
        }
    })


    //track change by user

trackbar.addEventListener("click" , (e)=>{
    console.log("working")
    console.log((e.offsetX/trackbar.clientWidth)*100)
    usertrackinput(e.offsetX/trackbar.clientWidth);
   

})






    //previus song
    //  back.addEventListener("click" , ()=>{
    //     // let reverse = songs[]
    //  })



    // audio.addEventListener("loadedmetadata", () => {
    //     let duration = audio.duration;
    //     console.log("Audio duration:", duration, "seconds");
    // });

    //for hamburger
    document.getElementById("hamburger").addEventListener("click" , ()=>{
document.querySelector(".leftbox").style.left= "0%"
    })
    document.getElementById("close").addEventListener("click" , ()=>{
document.querySelector(".leftbox").style.left= "-200%"
    })

}

main()