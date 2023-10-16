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
          // const searchParam = getYouTubeSearchParam(currentTabURL);
          if (videoID) {
            console.log('YouTube Video ID:', videoID);
            let VoiceID;
  
            // Check if VoiceID is already present
            if (!VoiceID) {
              VoiceID = await uploadVoices(videoID);
              console.log(VoiceID.voice_id);
              console.log(`Here is where voiceID is declared: ${VoiceID}`);
            }
  
            // Send message to the popup script
            if (VoiceID) {
              chrome.runtime.sendMessage({ type: 'YOUTUBE_VIDEO_ID', videoID, VoiceID });
            }
          }
          // Stop further reloading or actions on a YouTube page
          return;
        } else {
          console.log('Not a YouTube page');
          // Reload the tab after a short delay
          setTimeout(reloadTabUntilVideoIDAndSearch, 1000);
        }
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


async function downloadMp3(videoID) {
  console.log('cutting and downloading video')

    const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}&cut=1&sStart=00%3A01%3A00&sEnd=00%3A03%3A30`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'c7c5abf083msh0117337ec749fcdp1724a3jsn5b375c8ee521',
            'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        const link = result.link;
        console.log('cutting and downloading video done');
        return link; // Return the link
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function uploadVoices(videoID) {
  console.log('uploading voice start')
  const xiApiKey = '01d5d014d919e54c2c258c248803f45a';
  const apiUrl = 'https://api.elevenlabs.io/v1/voices/add';

  const voiceName = 'X2';
  const voiceDescription = 'This is a test in progress';
  const accentLabel = 'African';
  console.log("here")

    try {
        const linkUrl = await downloadMp3(videoID); // Wait for the linkUrl before continuing
        console.log(linkUrl);
        const formData = new FormData();

        formData.append('name', voiceName);
        formData.append('files', new Blob([await fetchFile(linkUrl)], { type: 'audio/mpeg' }), 'million.mp3');
        formData.append('description', voiceDescription);
        formData.append('labels', JSON.stringify({ accent: accentLabel }));

        console.log('formData content:');
        for (const entry of formData.entries()) {
            console.log(entry[0], entry[1]);
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'xi-api-key': xiApiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('uploading voice done');
        console.log(data);
        return data
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

async function fetchFile(filePath) {
    try {
      const fileResponse = await fetch(filePath);
      console.log(fileResponse)
  
      if (!fileResponse.ok) {
        throw new Error('File response was not ok');
      }
      const fileBlob = await fileResponse.blob();
      return fileBlob;
    } catch (error) {
      console.error('Error fetching file:', error.message);
      throw error;
    }
  }