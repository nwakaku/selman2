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

export async function uploadVoices(videoID) {
  console.log("uploading voice start");
  const xiApiKey = "0255ddbf57bf8f76892bb3d83cca41be";
  const apiUrl = "https://api.elevenlabs.io/v1/voices/add";

  const voiceName = "X2";
  const voiceDescription = "This is a test in progress";
  const accentLabel = "African";
  console.log("here");

  try {
    const linkUrl = await downloadMp3(videoID); // Wait for the linkUrl before continuing
    console.log(linkUrl);
    const formData = new FormData();

    formData.append("name", voiceName);
    formData.append(
      "files",
      new Blob([await fetchFile(linkUrl)], { type: "audio/mpeg" }),
      "million.mp3"
    );
    formData.append("description", voiceDescription);
    formData.append("labels", JSON.stringify({ accent: accentLabel }));

    console.log("formData content:");
    for (const entry of formData.entries()) {
      console.log(entry[0], entry[1]);
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "xi-api-key": xiApiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("uploading voice done");
    console.log(data);
    return data;
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

async function downloadMp3(videoID) {
  console.log("cutting and downloading video");

  const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}&cut=1&sStart=00%3A01%3A00&sEnd=00%3A03%3A30`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "c7c5abf083msh0117337ec749fcdp1724a3jsn5b375c8ee521",
      "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const link = result.link;
    console.log("cutting and downloading video done");
    return link; // Return the link
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchFile(filePath) {
  try {
    const fileResponse = await fetch(filePath);
    console.log(fileResponse);

    if (!fileResponse.ok) {
      throw new Error("File response was not ok");
    }
    const fileBlob = await fileResponse.blob();
    return fileBlob;
  } catch (error) {
    console.error("Error fetching file:", error.message);
    throw error;
  }
}
