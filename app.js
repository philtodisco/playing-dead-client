
const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()
let isPaused
const samplePaths = ["./stems/drums.wav", "./stems/bass.wav", "./stems/guitar1.wav", "./stems/guitar2.wav", "./stems/piano.wav"]

// Function to get audio file
async function getFile(filePath) {
    const response = await fetch(filePath)
    const arrayBuffer = await response.arrayBuffer()
    // Decode the array buffer into an audio buffer
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer) 
    return audioBuffer
}

// Function to create faders
function createFaders(sourceNode, splitFile) {
    const mixer = document.getElementById("mixer-container")
    const fader = document.createElement("input")
    fader.setAttribute("type", "range")
    fader.setAttribute("class", "volume")
    fader.setAttribute("id", `${splitFile}`)
    fader.setAttribute("min", "0")
    fader.setAttribute("max", "2")
    fader.setAttribute("value", "1")
    fader.setAttribute("step", "0.01")
    mixer.appendChild(fader)
    const gainNode = audioContext.createGain()
    const volume = document.getElementById(`${splitFile}`)
    sourceNode.connect(gainNode).connect(audioContext.destination)
    
    volume.addEventListener("input", () => {
        gainNode.gain.value = volume.value
    })
}

// Function to load samples
async function setupSamples(paths) {
    const samplesData = []
    // Iterate over each sample path
    for (const path of paths) {
        const sample = await getFile(path)
        const sourceNode = audioContext.createBufferSource()
        sourceNode.buffer = sample
        samplesData.push({ sample, sourceNode })
        const fileName = path.split("/").pop()
        const splitFile = fileName.split(".")[0]
        createFaders(sourceNode, splitFile)
    }
    return samplesData
}

// Function to play a sample
function playSample(sampleData, time) {
    const { sample, sourceNode } = sampleData // Destructure sample data
    sourceNode.start(time)
}

function pauseSample() {
    audioContext.suspend()
}

function resumeSample() {
    audioContext.resume()
}

// Initialize the buttons and event listeners
document.getElementById("load-song").addEventListener("click", async () => {
    const samples = await setupSamples(samplePaths)
    document.getElementById("play-song").addEventListener("click", () => {
        if (isPaused === true) {
            resumeSample()
        } else 
            samples.forEach((sample) => playSample(sample, 0))
            isPaused = false
    })
    document.getElementById("pause-song").addEventListener("click", () => {
        if (isPaused === false) {
            pauseSample()
            isPaused = true
        } else return
    })
})











// // get the audio element
// const audioElement = document.getElementById("drums");

// const gainNode = audioContext.createGain();

// // pass it into the audio context
// const track = audioContext.createMediaElementSource(audioElement);


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



// // for legacy browsers
// let AudioContext = window.AudioContext || window.webkitAudioContext;
// let audioContext = new AudioContext();
// const samplePaths = ["./stems/drums.wav", "./stems/bass.wav", "./stems/guitar1.wav", "./stems/guitar2.wav", "./stems/piano.wav"]

// const loadSongBtn = document.getElementById("load-song")
// const playSongBtn = document.getElementById("play-song")
// const mixer = document.getElementById("mixer-container")


// // get audio file
// async function getFile(filePath) {
//     const response = await fetch(filePath)
//     const arrayBuffer = await response.arrayBuffer()
//     const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
//     return audioBuffer
// }

// // <input type="range" id="" class="volume" min="0" max="2" value="1" step="0.01" />
// function createFaders(sampleSource) {
//     fader = document.createElement("input")
//     fader.setAttribute("type", "range")
//     fader.setAttribute("class", "volume")
//     fader.setAttribute("id", `${splitFile}`)
//     fader.setAttribute("min", "0")
//     fader.setAttribute("max", "2")
//     fader.setAttribute("value", "1")
//     fader.setAttribute("step", "0.01")
//     mixer.appendChild(fader)
//     console.log(sampleSource)
//     // const sampleSource = audioContext.createBufferSource()
//     // const gainNode = audioContext.createGain()
    
//     // const volume = document.getElementById(`${splitFile}`)
    
    
//     // volume.addEventListener("input", () => {
//     //     gainNode.gain.value = volume.value
//     //     console.log(gainNode.gain.value)
//     // })

//     // sampleSource.connect(gainNode)
//     // gainNode.connect(audioContext.destination)
    
// }


// loadSongBtn.addEventListener("click", () => {
//     setupSamples(samplePaths).then((response) => {
//         samples = response
//         playSongBtn.addEventListener("click", () => {
//             samples.forEach((sample) => playSample(sample, 0))
//         })
//     })
// })

// // push them into audio buffers
// async function setupSamples(paths) {
//     const audioBuffers = []
//     for (const path of paths) {
//         const sample = await getFile(path)
//         audioBuffers.push(sample)
//         splitPath = path.split("/")
//         fileName = splitPath[2]
//         splitFile = fileName.split(".")[0]
//         createFaders(sample)
//     }
//     return audioBuffers
// }

// function playSample(audioBuffer, time) {
//     const sampleSource = audioContext.createBufferSource()
//     console.log(sampleSource)
//     sampleSource.buffer = audioBuffer
//     sampleSource.connect(audioContext.destination)
//     sampleSource.start(time)
//     console.log(sampleSource)
// }

