(function() {
// Sample directory
var SAMPLE_DIR = "./sounds/" 

// Sequencer object stores information about sequence to be looped
var Sequencer = {
  config: {
    kick: [],
    highsnare: [],
    hat: [],
    cowbell: [],
    shaker: [],
    lowsnare: [],
    ride: [],
    bass: [],
    lead: []
  },
  tempo: 130
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -80;
analyser.maxDecibels = -30;
analyser.fftSize = 256;

var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");

var intendedWidth = document.querySelector('.controls').clientWidth;

canvas.setAttribute('width',intendedWidth);

var drawVisual;

visualize();

Sample = function(filename) { // Constructor function
  var request = new XMLHttpRequest(); // XHR Request to grab the audio file
  request.open('GET', SAMPLE_DIR + filename, true); // Gets the audio file from the sample directory with the filename
  request.responseType = 'arraybuffer'; // Response type needed for web audio api
  var sampleBuffer; // Set sampleBuffer here so the whole object can read it
  var isPlaying = false; // Set here to allow scope between functions
  var sampleGain = audioCtx.createGain() // Create gain node
  this.drumName = filename.split(".")[0] // Sets drumName to the filename without the .wav extension 

  request.onload = function() { // Once audio has been successfully loaded
    var audioData = request.response;  // Set audio data to response of the XHR request

    audioCtx.decodeAudioData( // Decodes the audio data ready to be played
      audioData, 
      function(buffer) {
        sampleBuffer = buffer;
      }, 
      function(e){"Error with decoding audio data" + e.err}
    );
  }

  request.send();

  this.playNow = function() {
    var volume = document.querySelector('#' + this.drumName + '-volume').value / 100; // Gets volume for drum playing and sets to volume
    if (isPlaying === false) {
      var sample = audioCtx.createBufferSource() // Creates a buffer source referenced by sample
      sample.buffer = sampleBuffer; // Sets the buffer to sample buffer
      sample.connect(sampleGain); // Connects to the sampleGain
      sampleGain.gain.value = volume; // Sets the gain to the volume of the slider
      sampleGain.connect(analyser); // Connects to the analyser to be used in visualizer
      analyser.connect(audioCtx.destination); // Finally connects to the audio context
      sample.start(0); // Starts playback of sample
    }
    isPlaying = true // Sets isPlaying to true to avoid multiple playbacks of same sample
  }

  this.playInFuture = function(numberOfSteps) { // Function for playing samples in the future to be used by sequencer
    var currentTime = audioCtx.currentTime; // Gets the current time on the audio context clock
    var time = currentTime + (numberOfSteps * (60 / Sequencer.tempo)); // This is the time for each sample to be played
    var volume = document.querySelector('#' + this.drumName + '-volume').value / 100; // Gets volume for drum playing and sets to volume
    var sample = audioCtx.createBufferSource()  // Creates a buffer source
    var sampleGain = audioCtx.createGain() // Creates sample gain
    sample.buffer = sampleBuffer; // Sets the buffer
    sample.connect(sampleGain); // Connects sample to the gain
    sampleGain.gain.value = volume; // Sets gain to the volume
    sampleGain.connect(audioCtx.destination) // Connects to the destination

    if (!sample.start) // If the sample hasnt started 
      sample.start = sample.noteOn // Set start sample to noteOn this is advised for playing in future
      sample.start(time); // Start the sample in the calculated time in future
  }
  
  this.stop = function() {
    isPlaying = false
  }

} // End of Sample object
  

// Constructor variables for each drum creates new object with the chosen audio file
var kick = new Sample("kick.wav")
var highsnare = new Sample("high-snare.wav")
var hat = new Sample("hat.wav")
var cowbell = new Sample("wooden.wav")
var shaker = new Sample("metal.wav")
var lowsnare = new Sample("low-snare.wav")
var ride = new Sample("ride.wav")
var bass = new Sample("bass.wav")
var lead = new Sample("lead.wav")

$(document).keydown(handleToggleSamples) // Event handler for when a key has been pressed
$(document).keyup(handleToggleSamples) // Event handler for when key has been released

function toggleSample(isKeydown, sample) { // toggleSample function takes boolean for iskeydown and string of sample to play
  if (isKeydown) { // If keydown is true plays the sample
    sample.playNow()
  } else { // Else stops the sample
    sample.stop()
  }
}

function handleToggleSamples(e) { // Function for handling keyboard triggering
  var isKeydown = e.type === "keydown"
   // Checks which key was pressed each drum requires three, one for the QWEASDZXC keys one for the numpad with num lock on
   // and one for the numpad with numlock off (e.g. Q/7 and HOME) for kick drum.
  if (e.which == 36 || e.which == 103 || e.which == 81) {
    e.preventDefault(); // Prevents default activity for this keypress e.g. 3 would scroll page down on numpad
    toggleSample(isKeydown, kick) // Trigger toggleSample function with keydown and sample
    $('[drum=kick]').toggleClass('active'); // Add active class to show which drum has been triggered
  }

  if (e.which == 38 || e.which == 104 || e.which == 87) {
    e.preventDefault();
    toggleSample(isKeydown, highsnare)
    $('[drum=high-snare]').toggleClass('active');
  }

  if (e.which == 33 || e.which == 105 || e.which == 69) {
    e.preventDefault();
    toggleSample(isKeydown, hat)
    $('[drum=hat]').toggleClass('active');
  }

  if (e.which == 37 || e.which == 100 || e.which == 65) {
    e.preventDefault();
    toggleSample(isKeydown, cowbell)
    $('[drum=cowbell]').toggleClass('active');
  }

  if (e.which == 12 || e.which == 101 || e.which == 83) {
    e.preventDefault();
    toggleSample(isKeydown, shaker)
    $('[drum=shaker]').toggleClass('active');
  }

  if (e.which == 39 || e.which == 102 || e.which == 68) {
    e.preventDefault();
    toggleSample(isKeydown, lowsnare)
    $('[drum=low-snare]').toggleClass('active');
  }

  if (e.which == 35 || e.which == 97 || e.which == 90) {
    e.preventDefault();
    toggleSample(isKeydown, ride)
    $('[drum=ride]').toggleClass('active');
  }

  if (e.which == 40 || e.which == 98 || e.which == 88) {
    e.preventDefault();
    toggleSample(isKeydown, bass)
    $('[drum=bass]').toggleClass('active');
  }

  if (e.which == 34 || e.which == 99 || e.which == 67) {
    e.preventDefault();
    toggleSample(isKeydown, lead)
    $('[drum=lead]').toggleClass('active');
  }
}

var pressSamples = function() { // Press samples function triggered when button is clicked or tapped
  var drum = ($(this).attr('drum')); // Set drum to the attribute of drum of the chosen sample
  $('[drum=' + drum + ']').addClass('active').delay(200).queue(function(){ 
    $(this).removeClass('active').dequeue();
  }) // Add red background for 200ms then remove to give visual aid that button has been pressed
  
  // Switch statement which determines which drum has been clicked using this avoids 9 if statements

  switch(drum) {
    case "kick":
      kickplayNow();
      kick.stop();
      break;
    case "high-snare":
      highsnare.playNow();
      highsnare.stop();
      break;
    case "hat":
      hat.playNow();
      hat.stop();
      break;
    case "cowbell":
      cowbell.playNow();
      cowbell.stop();
      break;
    case "shaker":
      shaker.playNow();
      shaker.stop();
      break;
    case "low-snare":
      lowsnare.playNow();
      lowsnare.stop();
      break;
    case "ride":
      ride.playNow();
      ride.stop();
      break;
    case "bass":
      bass.playNow();
      bass.stop();
      break;
    case "lead":
      lead.playNow();
      lead.stop();
      break;
  } 
}

// When a drum is tapped (mobile devices) or clicked (desktop) calls the pressSamples function

$(".drum").on({
  tap: pressSamples,
  click: pressSamples
});

//  UI Fixes

// Takes focus away from buttons once clicked to avoid jank

$("button").click(function() {
  $(this).blur();
});

// Updates canvas size when the window is resized

$(window).resize(function(){
    intendedWidth = document.querySelector('.controls').clientWidth;
    console.log(intendedWidth);
    canvas.setAttribute('width',intendedWidth);
});

//  Visualizer function

function visualize() {
  WIDTH = canvas.width; // Sets width to canvas width
  HEIGHT = canvas.height; // Sets height to canvas height
  var bufferLength = analyser.frequencyBinCount;  
  var dataArray = new Uint8Array(bufferLength);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT); // Clears canvas

  function draw() {
    drawVisual = requestAnimationFrame(draw); 
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = (WIDTH / bufferLength) * 2.5; // Width of the bars in visualizer
    var barHeight; 
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i]*2; // Sets bar height to the value of amplitude for that frequency band from the data array
      canvasCtx.fillStyle = '#f44336'; // Style is red colour to match colour of buttons once triggered
      canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight*5);  // Draws to the canvas

      x += barWidth + 1;
    }
  };

draw();

}

// Sequencer code

$('.sequencer-buttons').click(function() {
  var drum = ($(this).attr('drum')); // Stores the drum attribute of the sequencer button clicked - these tells the program which drum was pressed
  var step = ($(this).attr('step')); // Stores the step attribute of the sequencer button clicked - these tells the program which step was pressed
  if (this.pressed) { // If button was already pressed 
    Sequencer["config"][drum].splice($.inArray(step,Sequencer["config"][drum]),1); // Remove the selected drum from the object
    $(this).css("background", ""); // Remove the background styling
    this.pressed = false; // Set pressed to false now
  }
  else { 
    Sequencer["config"][drum].push(step); // Push the step value to the Sequencer.config object for the chosen drum (e.g Sequencer.config.kick(1))
    $(this).css("background", "#f44336"); // Set background of the button to red to indicate it has been selected
    this.pressed = true; // Set pressed to true
  }
});

$('.playbtn').click(function() {
  $(this).addClass("hidden"); // Hide play button
  $(".stopbtn").removeClass("hidden"); // Now show the stop button

  Sequencer.config.kick.map(function(steps){
    kick.playInFuture(steps-1); // Map through the kick object and playInFuture for each step in the object
  });
  Sequencer.config.highsnare.map(function(steps){
    highsnare.playInFuture(steps-1); // Map through the highsnare object and playInFuture for each step in the object
  });
  Sequencer.config.hat.map(function(steps){
    hat.playInFuture(steps-1); // Map through the kick hat and playInFuture for each step in the object
  });
  Sequencer.config.cowbell.map(function(steps){
    cowbell.playInFuture(steps-1); // Map through the cowbell object and playInFuture for each step in the object
  });
  Sequencer.config.shaker.map(function(steps){
    shaker.playInFuture(steps-1); // Map through the shaker object and playInFuture for each step in the object
  });
  Sequencer.config.lowsnare.map(function(steps){
    lowsnare.playInFuture(steps-1); // Map through the lowsnare object and playInFuture for each step in the object
  });
  Sequencer.config.ride.map(function(steps){
    ride.playInFuture(steps-1); // Map through the ride object and playInFuture for each step in the object
  });
  Sequencer.config.bass.map(function(steps){
    bass.playInFuture(steps-1); // Map through the bass object and playInFuture for each step in the object
  });
  Sequencer.config.lead.map(function(steps){
    lead.playInFuture(steps-1); // Map through the lead object and playInFuture for each step in the object
  }); 
});

$(".stopbtn").click(function() { // Function for when the stop button is pressed
  $(this).addClass("hidden"); // Hide stop button
  $(".playbtn").removeClass("hidden"); // Now show the play button
  analyser.disconnect(); // Disconnect the sound
});

$(".bpmbtn").click(function() { // When set tempo button is pressed
  var newTempo = $(".bpm").val(); // Set newTempo variable to the value in the BPM input field
    if (newTempo >= 60 && newTempo <= 300) { // If its between 60 and 300 bpm
      Sequencer.tempo = newTempo; // Set the Sequencer object tempo to the new tempo
    } else {
      alert("Please enter a tempo between 60-300"); // Othewise alert the user that a tempo between 60-300 should be selected
    }
});

})();

// Modal and change of views code

$('.modal .close').on('click', function(e){
    e.preventDefault();
    $.modal().close();
});

$('.livebtn').click(function() {
  $('.controls').css('display', 'block');
  $('.drum-machine').css('display', 'block');
  $('.sequencer-container').css('display', 'none');
});

$('.sequencerbtn').click(function() {
  $('.controls').css('display', 'none');
  $('.drum-machine').css('display', 'none');
  $('.sequencer-container').css('display', 'block');
});

$(window).load(function() {
  $('#welcome').modal().open();
});

$('.startbtn').click(function() {
  $.modal().close();
});
