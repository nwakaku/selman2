var FormData = require('form-data');
var fs = require('fs');

 async function uploadVoices(videoID) {
    try {
      console.log("uploading voice start");
      const xiApiKey = "064e216a756be4471a362e5e5976928d";
      const apiUrl = "https://api.elevenlabs.io/v1/voices/add";
  
      const voiceName = "X2";
      const voiceDescription = "This is a test in progress";
      const accentLabel = "African";
      console.log({videoID});
  
      const linkUrl = await downloadMp3(videoID); // Wait for the linkUrl before continuing
      console.log({linkUrl});
      const fileFetch = await fetchFile(linkUrl);
      console.log({fileFetch});
      const formData = new FormData();
  
      formData.append("name", voiceName);
      
      formData.append("description", voiceDescription);
      formData.append("labels", JSON.stringify({ accent: accentLabel }));
      formData.append(
        "files",
        new Blob([fileFetch], { type: "audio/mpeg" }),
        "million.mp3"
      );
  
      // console.log("formData content:");
      // for (const entry of formData.entries()) {
      //   console.log(entry[0], entry[1]);
      // }
  
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "xi-api-key": xiApiKey,
          'Content-Type': 'multipart/form-data'
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
      console.error("An error occurred in uploadVoices:", error.message);
      throw error; // Rethrow the error to be caught by the caller (fetchSubtitles)
    }
  }
  
  
  // c7c5abf083msh0117337ec749fcdp1724a3jsn5b375c8ee521
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
      console.log(result)
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

  module.exports = uploadVoices;