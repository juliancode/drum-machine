(function() {

  var kickButton = $('.kick');
  var snareButton = $('.snare');
  var hatButton = $('.hat');
  var woodenButton = $('.wooden');
  var metalButton = $('.metal');
  var snare1Button = $('.snare1');
  var rideButton = $('.ride');
  var bassButton = $('.bass');
  var leadButton = $('.lead');

  var stepPressed = false;

  var Loop = {
    config: {
      kick: [],
      snare: [],
      hat: [],
      cowbell: [],
      shaker: [],
      lowsnare: [],
      ride: [],
      bass: [],
      lead: []
    },
    tempo: 172
  }
  
  var oneBeatTime = (60 / Loop.tempo)
  var oneBarTime = oneBeatTime * 4
  var numberOfBars = 8
  var totalLoop = oneBarTime * numberOfBars

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var gainNode = audioCtx.createGain();
  var analyser = audioCtx.createAnalyser();
  analyser.minDecibels = -100;
  analyser.maxDecibels = -20;
  analyser.fftSize = 256;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  var canvas = document.querySelector('.visualizer');
  var canvasCtx = canvas.getContext("2d");

  var intendedWidth = document.querySelector('.controls').clientWidth;

  canvas.setAttribute('width',intendedWidth);

  var drawVisual;

  visualize();

Sample = function(filename) {
    var request = new XMLHttpRequest();
    request.open('GET', filename, true);
    request.responseType = 'arraybuffer';
    var sampleBuffer;
    var isPlaying = false;

    this.drumName = filename.split(".")[0]

    this.tempo = Loop.tempo
    var oneBeatTime = (60 / this.tempo)
    var oneBarTime = oneBeatTime * 4
    var numberOfBars = 8
    var totalLoop = oneBarTime * numberOfBars

    request.onload = function() {
      var audioData = request.response; 

      audioCtx.decodeAudioData(
        audioData, 
        function(buffer) {
          sampleBuffer = buffer;
        }, 
        function(e){"Error with decoding audio data" + e.err}
      );
    }
    request.send();

    this.play = function() {
        var volume = document.querySelector('#' + this.drumName + 'vol').value / 100; // Gets volume for drum playing and sets to volume
        if (isPlaying === false) {
        var sample = audioCtx.createBufferSource()
        sample.buffer = sampleBuffer;
        gainNode.gain.value = volume;
        sample.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioCtx.destination);
        // sample.loop = this.loop;
        sample.start(0);
      }
      isPlaying = true
    }

    this.stop = function() {
      isPlaying = false
    }

     this.playInNumberOfSeconds = function(numberOfSeconds) {
      var sample = audioCtx.createBufferSource()
      sample.buffer = sampleBuffer;
      sample.connect(audioCtx.destination);
      if (!sample.start)
        sample.start = sample.noteOn;
      sample.start(numberOfSeconds);
    }

    this.playLoop = function(step) {
     var startTime = audioCtx.currentTime;
     var time = startTime + (step * oneBeatTime);

     this.playInNumberOfSeconds(time);

   }

} // End of Sample object
  
  var kick = new Sample("kick.wav")
  var snare = new Sample("snare.wav")
  var hat = new Sample("hat.wav")
  var cowbell = new Sample("wooden.wav")
  var shaker = new Sample("metal.wav")
  var lowsnare = new Sample("snare1.wav")
  var ride = new Sample("ride.wav")
  var bass = new Sample("bass_stab.wav")
  var lead = new Sample("lead_stab.wav")

  $(document).keydown(handleToggleSamples)
  $(document).keyup(handleToggleSamples)

  function toggleSample(isKeydown, sample) {
    if (isKeydown) {
      sample.play()
    } else {
      sample.stop()
    }
  }

  function handleToggleSamples(e) {
    var isKeydown = e.type === "keydown"
    
    if (e.which == 55 || e.which == 36){
      e.preventDefault();
      toggleSample(isKeydown, kick)
      kickButton.toggleClass('active');
    }

    if (e.which == 38){
      e.preventDefault();
      toggleSample(isKeydown, snare)
      snareButton.toggleClass('active');
    }

    if (e.which == 33){
      e.preventDefault();
      toggleSample(isKeydown, hat)
      hatButton.toggleClass('active');
    }

    if (e.which == 37){
      e.preventDefault();
      toggleSample(isKeydown, cowbell)
      woodenButton.toggleClass('active');
    }

    if (e.which == 12){
      e.preventDefault();
      toggleSample(isKeydown, shaker)
      metalButton.toggleClass('active');
    }

    if (e.which == 39){
      e.preventDefault();
      toggleSample(isKeydown, lowsnare)
      snare1Button.toggleClass('active');
    }

    if (e.which == 35){
      e.preventDefault();
      toggleSample(isKeydown, ride)
      rideButton.toggleClass('active');
    }

    if (e.which == 40){
      e.preventDefault();
      toggleSample(isKeydown, bass)
      bassButton.toggleClass('active');
    }

    if (e.which == 34){
      e.preventDefault();
      toggleSample(isKeydown, lead)
      leadButton.toggleClass('active');
    }
  }

//  UI FIXES

// Updates canvas size when the window is resized

$(window).resize(function(){
    intendedWidth = document.querySelector('.controls').clientWidth;
    canvas.setAttribute('width',intendedWidth);
});

//  

function visualize() {
  WIDTH = canvas.width; // Sets width to canvas width
  HEIGHT = canvas.height; // Sets height to canvas height
  analyser.fftSize = 256; // This size controls number of bars used to represent frequencies in viusalizaton.
  var bufferLength = analyser.frequencyBinCount; 
  var dataArray = new Uint8Array(bufferLength);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
      drawVisual = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      var barWidth = (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]*2;
        canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',0,0)';
        canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight*5);

        x += barWidth + 1;
      }
    };

    draw();

}


// Sequencer code

$('.sequencer-buttons').click(function() {
  var drum = ($(this).attr('drum'));
  var step = ($(this).attr('step'));
  if (this.pressed) {
  Loop["config"][drum].splice($.inArray(step,Loop["config"][drum]),1); 
  $(this).css("background", "");
  this.pressed = false;
  }
  else {
  Loop["config"][drum].push(step);
  $(this).css("background", "red");
  this.pressed = true;
  }
});

$('.play').click(function() {
  console.log(Loop);
    Loop.config.kick.map(function(steps){
     kick.playLoop(steps-1);
     });
    Loop.config.snare.map(function(steps){
     snare.playLoop(steps-1);
     });
    Loop.config.hat.map(function(steps){
     hat.playLoop(steps-1);
     });
    Loop.config.cowbell.map(function(steps){
     cowbell.playLoop(steps-1);
     });
    Loop.config.shaker.map(function(steps){
     shaker.playLoop(steps-1);
     });
    Loop.config.lowsnare.map(function(steps){
     lowsnare.playLoop(steps-1);
     });
    Loop.config.ride.map(function(steps){
     ride.playLoop(steps-1);
     });
    Loop.config.bass.map(function(steps){
     bass.playLoop(steps-1);
     });
    Loop.config.lead.map(function(steps){
     lead.playLoop(steps-1);
     });
});

})();