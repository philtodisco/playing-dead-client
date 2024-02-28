// for legacy browsers
let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = new AudioContext();
console.log(audioContext)
let samples
const samplePaths = ["./stems/drums.wav", "./stems/bass.wav", "./stems/guitar1.wav", "./stems/guitar2.wav", "./stems/piano.wav"]

const loadSongBtn = document.getElementById("load-song")
const playSongBtn = document.getElementById("play-song")
const mixer = document.getElementById("mixer-container")

// <input type="range" id="" class="volume" min="0" max="2" value="1" step="0.01" />
function createFaders() {
    fader = document.createElement("input")
    fader.setAttribute("type", "range")
    fader.setAttribute("class", "volume")
    fader.setAttribute("id", `${splitFile}`)
    fader.setAttribute("min", "0")
    fader.setAttribute("max", "2")
    fader.setAttribute("value", "1")
    fader.setAttribute("step", "0.01")
    mixer.appendChild(fader)
    
}

loadSongBtn.addEventListener("click", () => {
    setupSamples(samplePaths).then((response) => {
        samples = response
        console.log(samples)
        playSongBtn.addEventListener("click", () => {
            samples.forEach((sample) => playSample(sample, 0))
            // playSample(samples[0], 0)
        })
    })
})

// get audio file
async function getFile(filePath) {
    const response = await fetch(filePath)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    return audioBuffer
}
 
// push them into audio buffers
async function setupSamples(paths) {
    console.log("setting up samples")
    const audioBuffers = []
    for (const path of paths) {
        const sample = await getFile(path)
        audioBuffers.push(sample)
        splitPath = path.split("/")
        fileName = splitPath[2]
        splitFile = fileName.split(".")[0]
        createFaders()
    }
    console.log("set up done")
    return audioBuffers
}

function playSample(audioBuffer, time) {
    const sampleSource = audioContext.createBufferSource()
    sampleSource.buffer = audioBuffer
    sampleSource.connect(audioContext.destination)
    sampleSource.start(time)
}

// // get the audio element
// const audioElement = document.getElementById("drums");

// const gainNode = audioContext.createGain();

// // pass it into the audio context
// const track = audioContext.createMediaElementSource(audioElement);

// track.connect(gainNode).connect(audioContext.destination);

// // Select our play button
// const playButton = document.querySelector("button");

// playButton.addEventListener(
//   "click",
//   () => {
//     // Check if context is in suspended state (autoplay policy)
//     if (audioContext.state === "suspended") {
//       audioContext.resume();
//     }

//     // Play or pause track depending on state
//     if (playButton.dataset.playing === "false") {
//       audioElement.play();
//       playButton.dataset.playing = "true";
//     } else if (playButton.dataset.playing === "true") {
//       audioElement.pause();
//       playButton.dataset.playing = "false";
//     }
//   },
//   false,
// );

// const volumeControl = document.querySelector("#volume");

// volumeControl.addEventListener(
//   "input",
//   () => {
//     gainNode.gain.value = volumeControl.value;
//   },
//   false,
// );


// audioElement.addEventListener(
//     "ended",
//     () => {
//       playButton.dataset.playing = "false";
//     },
//     false,
//   );
  
