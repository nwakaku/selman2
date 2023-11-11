function play() {
  const videoElement = document.getElementsByClassName("video-stream html5-main-video")[0] as HTMLVideoElement;
  if (videoElement) {
      videoElement.play();
  }
}


function pauseOnStart() {
  const videoElement = document.getElementsByClassName("video-stream html5-main-video")[0] as HTMLVideoElement;
  if (videoElement) {
    videoElement.currentTime = 0;
    videoElement.pause();
  }
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'play') {
    console.log('Received message: pause');
    play();
    // Perform actions in response to the message if needed
  } else if (message === 'pauseOnStart') {
    pauseOnStart();
  }
});

