// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleMute") {
    toggleMute();
  }
});

// Function to toggle mute for the current tab
function toggleMute() {
  console.log('i WAS CLICKED')
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const tab = tabs[0];
      console.log(tab.id)
      chrome.tabs.update(tab.id, { muted: !tab.mutedInfo.muted });
    }
  });
}



// content_script.ts
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  console.log(msg);
  console.log(sender);

  // Function to reload the tab until the video ID and search parameter are obtained
  const reloadTabUntilVideoIDAndSearch = async () => {
    // Get the current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs && tabs.length > 0) {
        const currentTab = tabs[0];
        const currentTabURL = currentTab.url;
        console.log('Current Tab URL:', currentTabURL);
  
        // Check if the current tab is a YouTube page
        if (isYouTubeURL(currentTabURL)) {
          const videoID = getYouTubeVideoID(currentTabURL);
          if (videoID) {
            console.log('YouTube Video ID:', videoID);
            let VoiceID;

  
            // Send message to the popup script

              chrome.runtime.sendMessage({ type: 'YOUTUBE_VIDEO_ID', videoID, VoiceID });
          }
          // Stop further reloading or actions on a YouTube page
          return;
        } 
        // else {
        //   console.log('Not a YouTube page');
        //   // Reload the tab after a short delay
        //   setTimeout(reloadTabUntilVideoIDAndSearch, 1000);
        // }
      }
    });
  };
  
  

  // Check if the message is from the popup script
  if (msg.type === 'POPUP_READY') {
    // Start reloading the tab until the video ID and search parameter are obtained
    reloadTabUntilVideoIDAndSearch();
  }
  return true; // Indicates that the response will be sent asynchronously
});

// Function to check if a URL is a YouTube page
const isYouTubeURL = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Function to extract the YouTube video ID from a URL
const getYouTubeVideoID = (url: string): string | null => {
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get('v') || url.split('/').pop() || null;
};


