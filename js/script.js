

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



    //const ACTX = new AudioContext();
    // We want to use the same context as tone.js 
    //for the spectrogram 
    const ACTX = Tone.context;
    const ANALYSER = ACTX.createAnalyser();

    ANALYSER.fftSize = 4096; 
    
    //piano 

    const synth = new Tone.Synth();
    // Set the tone to sine
    synth.oscillator.type = "sine";
    //synth.connect(ANALYSER);
    // connect it to the master output (your speakers)
    synth.toMaster();

    //synth.connect(Analyser);

    //connect the synth to the spectrogram
    synth.connect(ANALYSER);

    
    const piano = document.getElementById("piano");

    piano.addEventListener("mousedown", e => {
      // fires off a note continously until trigger is released
      synth.triggerAttack(e.target.dataset.note);
    });

    piano.addEventListener("mouseup", e => {
      // stops the trigger
      synth.triggerRelease();
    });

    // handles keyboard events
    document.addEventListener("keydown", e => {
      // e object has the key property to tell which key was pressed
      switch (e.key) {
        case "q":
          return synth.triggerAttack("C4", "30n");
        case "z":
          return synth.triggerAttack("C#4", "30n");
        case "s":
          return synth.triggerAttack("D4", "30n");
        case "e":
          return synth.triggerAttack("D#4", "30n");
        case "d":
          return synth.triggerAttack("E4", "30n");
        case "f":
          return synth.triggerAttack("F4", "30n");
        case "t":
          return synth.triggerAttack("F#4", "30n");
        case "g":
          return synth.triggerAttack("G4", "30n");
        case "y":
          return synth.triggerAttack("G#4", "30n");
        case "h":
          return synth.triggerAttack("A4", "30n");
        case "u":
          return synth.triggerAttack("A#4", "30n");
        case "j":
          return synth.triggerAttack("B4", "30n");
        case "k":
          return synth.triggerAttack("C5", "30n");
        case "o":
          return synth.triggerAttack("C#5", "30n");
        case "l":
          return synth.triggerAttack("D5", "30n");
        default:
          return;
      }
    });
    // when the key is released, audio is released as well
    document.addEventListener("keyup", e => {
      switch (e.key) {
        case "q":
        case "z":
        case "s":
        case "e":
        case "d":
        case "f":
        case "t":
        case "g":
        case "y":
        case "h":
        case "u":
        case "j":
        case "k":
        case "o":
        case "l" :
          synth.triggerRelease(); 
      }
    });



   

        const DATA = new Uint8Array(ANALYSER.frequencyBinCount);
        const LEN = DATA.length;
        const h = 10*H / LEN;
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
    


    let rot = 0;
    tick();
    
    function tick() {
      requestAnimationFrame(tick);
      rot += 0.02;
      document.body.style.setProperty("--rot", `${rot}deg`);
    }











    

