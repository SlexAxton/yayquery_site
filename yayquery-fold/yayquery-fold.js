$(document).ready(function() {
var
	audio = $('#target audio')[0],
	audioOpt = {
		currVol: 0,
		maxVol: audio.volume,
		isReady: false,
		timerIn: null,
		timerOut: null,
		fadeStep: 0.15,
		debug: true
	};

$(audio).bind('loadeddata', function (e) {
	audioOpt.debug && console.log('Audio is ready');
	audioOpt.isReady = true;
});

// Set-up the page fold on our container
$('#target').fold({ side: 'right', autoCurl: true });

// #turn_wrapper is a element page-fold script creates
$('#turn_wrapper').hover(

	// Play/fade in to the 'maxVolume'
	function () {
		audioOpt.debug && console.log('Play audio');
		if (!audioOpt.isReady) return;

		audio.volume = audioOpt.curVol = audioOpt.fadeStep;
		audio.play();

		(function () {
			audioOpt.timerOut && clearTimeout(audioOpt.timerOut); // Clear the fadeOut-timer

			function setTimer() {
				if (audioOpt.curVol < audioOpt.maxVol) {
					audio.volume = audioOpt.curVol = audioOpt.curVol + audioOpt.fadeStep >= 1 ? 1 : audioOpt.curVol + audioOpt.fadeStep;
					audioOpt.timerIn = setTimeout(setTimer, 150);

					audioOpt.debug && console.log('fadein', audioOpt.curVol);
				}
				else {
					audioOpt.timerIn = null;
				}
			};

			audioOpt.timerIn = setTimeout(setTimer, 20);
		}());
	},

	// Pause/fade it out and reset currentTime to 0
	function () {
		audioOpt.debug && console.log('Stop audio');
		if (!audioOpt.isReady) return;

		audioOpt.curVol = audio.volume;

		(function () {
			audioOpt.timerIn && clearTimeout(audioOpt.timerIn); // Clear the fadeIn-timer

			function setTimer() {
				if (audioOpt.curVol !== 0) {
					// >0 || 0
					audio.volume = audioOpt.curVol = audioOpt.curVol - audioOpt.fadeStep < 0 ? 0 : audioOpt.curVol - audioOpt.fadeStep;
					audioOpt.timerOut = setTimeout(setTimer, 150);

					audioOpt.debug && console.log('fadeout', audioOpt.curVol);
				}
				else {
					audio.currentTime = 0.1;
					audio.startTime = 0;
					audio.pause();
					audioOpt.timerOut = null;
				}
			}

			audioOpt.timerOut = setTimeout(setTimer, 20);
		}());
	});
});
