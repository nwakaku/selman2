export function toggleAudio() {
  const audioElement = document.getElementById(
    "audioElement"
  ) as HTMLVideoElement;
  if (audioElement) {
    if (audioElement.paused) {
      audioElement.play();
    }
  }
}

export const pauseOnStart = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
      chrome.tabs.sendMessage(activeTab.id, "pauseOnStart", (response) => {
        // Handle the response from the content script if needed
      });
    }
  });
  const audioElement = document.getElementById(
    "audioElement"
  ) as HTMLVideoElement;
  if (audioElement) {
    if (audioElement.played) {
      audioElement.pause();
    }
  }
};

export const handleVideo = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
      chrome.tabs.sendMessage(activeTab.id, "play", (response) => {
        // Handle the response from the content script if needed
      });
    }
  });
  toggleAudio();
};

