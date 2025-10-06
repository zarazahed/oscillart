const input = document.getElementById('input');

const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

oscillator.start();
gainNode.gain.value = 0;

var reset = false;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;

var amplitude = 40;
var interval = null;

var timepernote = 0;
var length = 0;

notenames = new Map();
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392.0);
notenames.set("A", 440);
notenames.set("B", 493.9);

var counter = 0;
function drawWave() {
    clearInterval(interval);
    if (reset) {
       ctx.clearRect(0, 0, width, height);
       x = 0;
       y = height/2;
       ctx.beginPath();
       ctx.moveTo(x, y);
   }
   reset = false;
   
    counter = 0;
    interval = setInterval(line, 20);

}

function line() {
y = height/2 + amplitude * Math.sin(x * 2  * Math.PI * freq * (0.5 * length));
    ctx.lineTo(x, y);
    ctx.stroke();
    x = x + 1;
    counter++;
    console.log("freq:", freq);

}


function frequency(pitch) {
    freq = pitch / 10000;
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + (timepernote / 1000) - 0.1);


}

function handle() {
    reset = true;
    var usernotes = String(input.value);

    length = usernotes.length;
    timepernote = (6000 / length);

    var noteslist = [];

    for (i = 0; i < usernotes.length; i++) {
        noteslist.push(notenames.get(usernotes.charAt(i)));
    }

       let j = 0;
   repeat = setInterval(() => {
       if (j < noteslist.length) {
           frequency(parseInt(noteslist[j]));
           drawWave();
       j++
       } else {
           clearInterval(repeat)
       }


   }, timepernote)

    audioCtx.resume();
    
    drawWave();
}