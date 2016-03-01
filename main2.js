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
  }
  
  var kick = new Sample("kick.wav")
  var snare = new Sample("snare.wav")
  var hat = new Sample("hat.wav")
  var wooden = new Sample("wooden.wav")
  var metal = new Sample("metal.wav")
  var snare1 = new Sample("snare1.wav")
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
      toggleSample(isKeydown, wooden)
      woodenButton.toggleClass('active');
    }

    if (e.which == 12){
      e.preventDefault();
      toggleSample(isKeydown, metal)
      metalButton.toggleClass('active');
    }

    if (e.which == 39){
      e.preventDefault();
      toggleSample(isKeydown, snare1)
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


// Sequencer code & loooping

})();