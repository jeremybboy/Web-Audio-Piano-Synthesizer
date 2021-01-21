

//spectrogramme
var started = null;
window.addEventListener("click", () => {
  if (started) return;
  started = true;
  initialize();
});

function initialize() {
  document.body.querySelector("h1").remove();
  const CVS = document.body.querySelector("canvas");
  const CTX = CVS.getContext("2d");
  const W = (CVS.width = window.innerWidth);
  const H = (CVS.height = window.innerHeight);

  // THIS IS REALLY IMPORTANT. we want to use the same context as tone.js
  const ACTX = Tone.context;
  const ANALYSER = ACTX.createAnalyser();

  ANALYSER.fftSize = 4096;

  const synth = new Tone.Synth();
  // Set the tone to sine
  synth.oscillator.type = "sine";
  // connect it to the master output (your speakers)
  // (this used to be called toMaster() but is now called toDestination() in Tone.js)
