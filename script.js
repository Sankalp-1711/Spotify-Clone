console.log("Lets do Javascript");
let currentSong = new Audio();
//making sonngs a global variable
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    // Await the fetch call to get the response object
    currfolder = folder;
    let response = await fetch(`http://127.0.0.1:5500/${folder}/`);
    
    // Then, await the text method on the response object to get the response body as text
    let text = await response.text();
    
    // Log the response text
    //console.log(text);
    let div = document.createElement("div")
    div.innerHTML = text;
    let as=div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
          songs.push(element.href.split(`/${folder}/`)[1])
        
    }
      
}
// Show all the songs in the playlist
let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]
songUL.innerHTML = ""
for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + ` <li> <img class="invert" src="music.svg" alt="" >  
    <div class="info">
    <div class="songname">
     ${song.replaceAll("%20"," ")} 
   </div>
    <div class="songartist"><p>Sankalp</p></div>
    </div>
    <div class="playnow">
       <span>Play Now</span>
    <img class="invert" src="play.svg" alt="">
   </div></li>`;
   
}
// Attach an event listener to my each song
Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
  e.addEventListener("click", element => {
 // console.log(e.querySelector(".info").firstElementChild.innerHTML)
  playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
})
})
return songs
}
const playMusic = (track, pause=false)=>{
//  let audio = new Audio( "/Spotify%20Clone/songs/" + track)
    currentSong.src = `/${currfolder}/` + track
    if(!pause){
  currentSong.play()
  playsong.src = "pause.svg"
}
  
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

  

}
async function displayAlbums(){
  let response = await fetch(`http://127.0.0.1:5500/Spotify%20Clone/songs/`);
    
    // Then, await the text method on the response object to get the response body as text

    let text = await response.text();
    
    // Log the response text
   //console.log(text);
    let div = document.createElement("div")
    div.innerHTML = text;
    let anchors = div.getElementsByTagName("a")
    Array.from(anchors).forEach(async e=>{
     // console.log(e.href)
      if(e.href.includes("/Spotify%20Clone/songs")){
       let folder = e.href.split("/").slice(-2)[0]
       // Get the metadata of the folder
      let response = await fetch(`http://127.0.0.1:5500/Spotify%20Clone/songs/${folder}/info.json`)
    
    // Then, await the text method on the response object to get the response body as text
      let text = await response.json();
      console.log(text)
    
    
     }
    })


   // console.log(anchors)
   // console.log(div)
}

/*async function displayAlbums() {
  try {
      let response = await fetch(`http://127.0.0.1:5500/Spotify%20Clone/songs/`);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      let text = await response.text();

      let div = document.createElement("div");
      div.innerHTML = text;
      let anchors = div.getElementsByTagName("a");

      Array.from(anchors).forEach(async e => {
          try {
              if (e.href.includes("/Spotify%20Clone/songs")) {
                  let folder = e.href.split("/").slice(-2)[0];
                  let folderResponse = await fetch(`http://127.0.0.1:5500/Spotify%20Clone/songs/${encodeURIComponent(folder)}/info.json`);
                  
                  if (!folderResponse.ok) {
                      throw new Error(`HTTP error! status: ${folderResponse.status}`);
                  }

                  let folderInfo = await folderResponse.json();
                  console.log(folderInfo);
              }
          } catch (folderError) {
              console.error(`Error fetching folder info for ${e.href}: ${folderError.message}`);
          }
      });
  } catch (error) {
      console.error(`Error fetching albums: ${error.message}`);
  }
}

// Call the function
displayAlbums();
*/

async function main(){
 
    // get list of all the songs
await getSongs("Spotify%20Clone/songs/HindiSongs")
//currentSong.src = songs[0];
playMusic(songs[0],true)

//Display all the albums on the page
displayAlbums()

//Attach an event listener to play, next and previous
playsong.addEventListener("click", ()=> {
  // pause song played
  if(currentSong.paused){
    currentSong.play()
    playsong.src = "pause.svg"
  }
  // played song paused
  else{
    currentSong.pause()
    playsong.src = "play.svg"
    
  }
})

// Listen for timeupdate event
   currentSong.addEventListener("timeupdate" , ()=>{
   // console.log(currentSong.currentTime,currentSong.duration);
     document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
     document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
   })

// Add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click", e=>{
  let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
document.querySelector(".circle").style.left = percent + "%";
currentSong.currentTime = ((currentSong.duration)* percent)/100
})

//Add an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click", ()=>{
document.querySelector(".left").style.left = "0"

})

// Add event listener for close button
document.querySelector(".close").addEventListener("click",()=>{
  document.querySelector(".left").style.left = "-100%"

})
//Add an event listener to previous

previoussong.addEventListener("click", ()=>{
  currentSong.pause()


let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
// console.log(filename)
if((index-1) >= 0){
playMusic(songs[index-1])
}
//console.log(currentSong)
})
//Add an event listener to next
nextsong.addEventListener("click", ()=>{
  currentSong.pause()

  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  //console.log(filename2)
 if((index+1) < songs.length){
  playMusic(songs[index+1])
 //console.log(currentSong)
 }

  
  })

//Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{

currentSong.volume = parseInt(e.target.value)/100
})

  
//Load the playlist whenever card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click", async item=>{
   // console.log(item,item.currentTarget.dataset)
   songs = await getSongs(`Spotify%20Clone/songs/${item.currentTarget.dataset.folder}`)
    
  })
})

}


main()

