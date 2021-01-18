// 1. declare frequency max
const freqMax= 5000;

// 2. Declare player to play a sample sound (like mp3 file)
const player = new Tone.Player("audio/Kalimba.mp3");

// 3. declare ping pong delay
const delay = new Tone.FeedbackDelay(0.3,0.3);

// 4. declare low pass filterLowPass
const filterLowPass =new Tone.Filter(150, "lowpass");

// 5. declare high pass filter
const filterHighPass =new Tone.Filter(150, "highpass");


// 6. chain effects
player.chain(filterLowPass,filterHighPass, delay,Tone.Destination);

// 7. stop event listener
document.getElementById('audio-stop-button').addEventListener('click',function(){
    player.stop();

});

// 8. on click, play event listener
document.getElementById('audio-play-button').addEventListener('click',async()=>{

    // 9. create audio context
    await Tone.start();
    console.log("context audio ok");

    // 10. Wait for files to be loaded
    Tone.loaded().then(() => {
        //11. Play Audio
        player.start();
        console.log('player start');
    })

});




//  on mouse move, vary effects parameters functions of X / Y mouse position
document.body.addEventListener('mousemove', function(event){
    // 12. vary ping pong delay on X axis
    delay.set({
        feedback: event.pageX /document.body.clientWidth,
    });
    // 13. calculate frequency functions of mouse position
    let freq = event.pageY /document.body.clientHeight * freqMax;

    // 14. vary low pass filterLowPass on Y axis 
    filterLowPass.set({
        frequency: freq,
    });

    // 15. vary high pass filterHighPass on Y axis 
    filterHighPass.set({
        frequency: freq, 
    }) ;
});






//spectrogramme 
var started = null;
window.addEventListener('click', () => {
    if (started) return;
    started = true;
    initialize();
})

function initialize() {
    document.body.querySelector('h1').remove();
    const CVS =document.body.querySelector('canvas');
    const CTX = CVS.getContext('2d');
    const W = CVS.width = window.innerWidth;
    const H = CVS.height = window.innerHeight;

    const ACTX = new AudioContext();
    const ANALYSER = ACTX.createAnalyser();

    ANALYSER.fftSize = 4096;  
    
    navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(process);

    function process(stream) {
        const SOURCE = ACTX.createMediaStreamSource(stream);
        SOURCE.connect(ANALYSER);
        const DATA = new Uint8Array(ANALYSER.frequencyBinCount);
        const LEN = DATA.length;
        const h = H / LEN;
        const x = W - 1;
        CTX.fillStyle = 'hsl(280, 100%, 10%)';
        CTX.fillRect(0, 0, W, H);

        loop();

        function loop() {
        window.requestAnimationFrame(loop);
        let imgData = CTX.getImageData(1, 0, W - 1, H);
        CTX.fillRect(0, 0, W, H);
        CTX.putImageData(imgData, 0, 0);
        ANALYSER.getByteFrequencyData(DATA);
        for (let i = 0; i < LEN; i++) {
            let rat = DATA[i] / 255;
            let hue = Math.round((rat * 120) + 280 % 360);
            let sat = '100%';
            let lit = 10 + (70 * rat) + '%';
            CTX.beginPath();
            CTX.strokeStyle = `hsl(${hue}, ${sat}, ${lit})`;
            CTX.moveTo(x, H - (i * h));
            CTX.lineTo(x, H - (i * h + h));
            CTX.stroke();
        }
        }
    }
    }


    let rot = 0;
    tick();
    
    function tick() {
      requestAnimationFrame(tick);
      rot += 0.02;
      document.body.style.setProperty("--rot", `${rot}deg`);
    }











    

